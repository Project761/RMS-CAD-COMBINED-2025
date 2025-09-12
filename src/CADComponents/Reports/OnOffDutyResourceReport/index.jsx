import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { colorLessStyle_Select, customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import ReportsServices from "../../../CADServices/APIs/reports";
import { toastifyError } from '../../../Components/Common/AlertMsg';
import { fetchPostData } from '../../../Components/hooks/Api';
import Loader from '../../../Components/Common/Loader';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Components/Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import ReportMainAddress from '../ReportMainAddress/ReportMainAddress';
import { getData_DropDown_Operator, getData_DropDown_Zone } from '../../../CADRedux/actions/DropDownsData';

const OnOffDutyResourceReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);

    const [
        onOffDutyResourceState,
        ,
        handleOnOffDutyResourceState,
        clearOnOffDutyResourceState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        shift: "",
        Resource1: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        zone: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showShift: false,
        showResource1: false,
        showPrimaryOfficer: false,
        showSecondaryOfficer: false,
        showZone: false,
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        shift: "",
        Resource1: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        zone: "",
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showShift: searchValue?.shift,
            showResource1: searchValue?.Resource1,
            showPrimaryOfficer: searchValue?.primaryOfficer,
            showSecondaryOfficer: searchValue?.secondaryOfficer,
            showZone: searchValue?.zone,
        });
    }, [searchValue]);

    const [zoneDropDown, setZoneDropDown] = useState([])
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loder, setLoder] = useState(false);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [onOffDutyResourceData, setOnOffDutyResourceData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [resourceDropDown, setResourceDropDown] = useState([]);
    const [showFooter, setShowFooter] = useState(false);
    const [shiftDropDown, setShiftDropDown] = useState([])

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName);
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const getResourcesKey = `/CAD/MasterResource/GetDataDropDown_Resource/${loginAgencyID}`;
    const { data: getResourcesData, isSuccess, refetch, isError: isNoData } = useQuery(
        [getResourcesKey, { AgencyID: loginAgencyID },],
        MasterTableListServices.getDataDropDown_Resource,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID,
        }
    );

    useEffect(() => {
        if (isSuccess && getResourcesData) {
            const data = JSON.parse(getResourcesData?.data?.data);
            setResourceDropDown(data?.Table || [])
        }
    }, [isSuccess, getResourcesData])

    const zoneDropDownDataModel = (data, value, label, code) => {
        const result = data?.map((item) => ({
            value: item[value],
            label: item[label],
            code: item[code]
        }));
        return result;
    };

    useEffect(() => {
        if (ZoneDrpData) {
            setZoneDropDown(zoneDropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription", "ZoneCode"));
        }
    }, [ZoneDrpData]);

    const shiftDataKey = `/CAD/MasterResourceShift/GetData_Shift`;
    const { data: shiftData, isSuccess: isFetchShiftData } = useQuery(
        [shiftDataKey, { AgencyID: loginAgencyID },],
        MasterTableListServices.getShift,
        {
            refetchOnWindowFocus: false,
            enabled: !!loginAgencyID
        }
    );

    useEffect(() => {
        if (shiftData && isFetchShiftData) {
            const data = JSON.parse(shiftData?.data?.data);
            setShiftDropDown(data?.Table || [])
        }
    }, [shiftData, isFetchShiftData])

    const resetFields = () => {
        clearOnOffDutyResourceState();
        setOnOffDutyResourceData([]);
        setAgencyData();
        setLoder(false);
        setverifyIncident(false);
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoder(true);
        },
        onAfterPrint: () => {
            setLoder(false);
        }
    });

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.log("error") }
        })
    }

    const getOnOffDutyResourceData = async (isPrintReport = false) => {
        setLoder(true);

        if (
            !onOffDutyResourceState?.reportedFromDate &&
            !onOffDutyResourceState?.reportedToDate &&
            !onOffDutyResourceState?.shift &&
            !onOffDutyResourceState?.Resource1 &&
            !onOffDutyResourceState?.primaryOfficer &&
            !onOffDutyResourceState?.secondaryOfficer &&
            !onOffDutyResourceState?.zone?.code
        ) {
            toastifyError("Please enter at least one detail");
            setLoder(false);
            setverifyIncident(false)
            return; // Exit the function if required fields are not filled
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "ReportedFromDate": onOffDutyResourceState?.reportedFromDate ? getShowingMonthDateYear(onOffDutyResourceState?.reportedFromDate) : "",
            "ReportedToDate": onOffDutyResourceState?.reportedToDate ? getShowingMonthDateYear(onOffDutyResourceState?.reportedToDate) : "",
            "ShiftID": onOffDutyResourceState?.shift?.ShiftId,
            "ResourceID": onOffDutyResourceState?.Resource1?.ResourceID,
            "PrimaryOfficerID": onOffDutyResourceState?.primaryOfficer?.value,
            "SecondaryOfficerID": onOffDutyResourceState?.secondaryOfficer?.value,
            "ZoneID": onOffDutyResourceState?.zone?.value,
        }

        setSearchValue(onOffDutyResourceState)

        try {
            const response = await ReportsServices.getOnOffDutyResorceReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setOnOffDutyResourceData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoder(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setOnOffDutyResourceData([]);
                    setAgencyData([])
                    setverifyIncident(false);
                    setLoder(false);
                }
            }
        } catch (error) {
            console.log("error", error)
            if (!isPrintReport) {
                toastifyError("Data Not Available");
            }
            setverifyIncident(false);
            setLoder(false);
        }

    }

    const handlePrintClick = () => {
        setLoder(true)
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getOnOffDutyResourceData(true); setShowFooter(false);
        }, 100);
    };

    return (
        <>
            <div className="section-body pt-1 p-1 bt" >
                <div className="div">
                    <div className="dark-row" >
                        <div className="col-12 col-sm-12">
                            <div className="card Agency">
                                <div className="card-body pt-3 pb-2" >
                                    <div className="row " style={{ marginTop: '-10px' }}>

                                        <div className="col-12 mt-2">
                                            <fieldset>
                                                <legend>On/Off Duty Unit</legend>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Reported From Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='startDate'
                                                            id='startDate'
                                                            onChange={(date) => {
                                                                handleOnOffDutyResourceState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleOnOffDutyResourceState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={onOffDutyResourceState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={onOffDutyResourceState?.reportedFromDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select From Date..."
                                                            maxDate={new Date(datezone)}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Reported To Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='reportedToDate'
                                                            id='reportedToDate'
                                                            onChange={(date) => {
                                                                handleOnOffDutyResourceState("reportedToDate", date);
                                                            }}
                                                            selected={onOffDutyResourceState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={onOffDutyResourceState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={onOffDutyResourceState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!onOffDutyResourceState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!onOffDutyResourceState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Primary Officer
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={OperatorDrpData}
                                                            getOptionLabel={(v) => v?.displayName}
                                                            getOptionValue={(v) => v?.PINID}
                                                            value={onOffDutyResourceState?.primaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleOnOffDutyResourceState("primaryOfficer", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Secondary Officer
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={OperatorDrpData}
                                                            getOptionLabel={(v) => v?.displayName}
                                                            getOptionValue={(v) => v?.PINID}
                                                            value={onOffDutyResourceState?.secondaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleOnOffDutyResourceState("secondaryOfficer", e) }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Patrol Zone
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={zoneDropDown}

                                                            isClearable
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            // isMulti
                                                            value={onOffDutyResourceState?.zone}
                                                            onChange={(e) => { handleOnOffDutyResourceState("zone", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Unit #
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            isClearable
                                                            options={resourceDropDown}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={onOffDutyResourceState?.Resource1}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            onChange={(e) => {

                                                                handleOnOffDutyResourceState("Resource1", e);
                                                            }}
                                                            styles={customStylesWithOutColorArrow}
                                                            maxMenuHeight={145}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            isSearchable={true}
                                                        />

                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Shift
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            isClearable
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            getOptionLabel={(v) => v?.ShiftCode + " | " + v?.ShiftDescription}
                                                            getOptionValue={(v) => v?.ShiftId}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.ShiftCode} | ${option?.ShiftDescription}`
                                                                    : option?.ShiftCode;
                                                            }}
                                                            options={shiftDropDown}
                                                            value={onOffDutyResourceState?.shift}
                                                            onChange={(e) => { handleOnOffDutyResourceState("shift", e) }}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getOnOffDutyResourceData(false); }} >Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        onClick={() => { resetFields(); }}
                                    >Clear</button>
                                    <Link to={'/cad/reports'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2">Close</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyIncident &&
                <>
                    <div className="col-12 col-md-12 col-lg-12  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">On/Off Duty Unit</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    {/* <i className="fa fa-print" onClick={printForm}></i> */}
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" ref={componentRef}>
                        <div className="col-12" >
                            <div className="row" >
                                {/* Report Address */}
                                <ReportMainAddress {...{ multiImage, agencyData }} />

                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    <p className=" py-1 text-center text-white bg-green" style={{
                                        textAlign: "center", fontWeight: "bold", fontSize: "20px"
                                    }}>On/Off Duty Unit</p>
                                </div>
                                <div className="col-12 mt-1 mb-3">
                                    <fieldset>
                                        <legend>Search Criteria</legend>
                                        <div className="row mt-2">
                                            {showFields.showReportedFromDate && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported From Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.reportedFromDate ? getShowingWithOutTime(searchValue.reportedFromDate) : ""}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showReportedToDate && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported To Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.reportedToDate ? getShowingWithOutTime(searchValue.reportedToDate) : ""}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {showFields.showPrimaryOfficer && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Primary Officer</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.primaryOfficer?.displayName2 || ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showSecondaryOfficer && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Secondary Officer</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.secondaryOfficer?.displayName2 || ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showZone && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Patrol Zone</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.zone?.label}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showResource1 && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Unit #</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue?.Resource1?.ResourceNumber}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showShift && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Shift</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.shift?.ShiftCode}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}

                                        </div>
                                    </fieldset>
                                </div>

                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                        {[...new Set(onOffDutyResourceData.map((obj) => obj.ResourceNumber))].map((ResourceNumber) => {
                                            const filteredData = onOffDutyResourceData.filter((obj) => obj.ResourceNumber === ResourceNumber);
                                            return (
                                                <div>
                                                    <p className="py-1 text-center" style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "16px", marginBottom: "5px"
                                                    }}>Unit #: {ResourceNumber || "-"}</p>

                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th style={{ width: '200px' }}>Primary Officer</th>
                                                                    <th style={{ width: '200px' }}>Secondary Officer</th>
                                                                    <th style={{ width: '200px' }}>Shift</th>
                                                                    <th style={{ width: '200px' }}>Patrol Zone</th>
                                                                    <th style={{ width: '240px' }}>On Duty</th>
                                                                    <th style={{ width: '240px' }}>Off Duty</th>
                                                                    <th style={{ width: '140px' }}>Total Time</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="master-tbody">
                                                                {filteredData.map((obj) => {


                                                                    return (
                                                                        <tr>
                                                                            <td className="text-list" style={{ width: '200px' }}>{obj.PrimaryOfficer}</td>
                                                                            <td className="text-list" style={{ width: '200px' }}> {obj.SecondaryOfficer}</td>
                                                                            <td className="text-list" style={{ width: '140px' }}>{obj.ShiftDescription}</td>
                                                                            <td className="text-list" style={{ width: '140px' }}>{obj.ZoneDescription}</td>
                                                                            <td className="text-list" style={{ width: '240px', wordBreak: 'break-all' }}>
                                                                                {obj.OnTime && getShowingDateText(obj.OnTime)}
                                                                            </td>
                                                                            <td className="text-list" style={{ width: '240px' }}>
                                                                                {obj.OfTime && getShowingDateText(obj.OfTime)}
                                                                            </td>
                                                                            <td className="text-list" style={{ width: '140px' }}>{obj.TotalMinutes}</td>
                                                                        </tr>
                                                                    );
                                                                })}

                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                                {showFooter && (
                                    <div className="print-footer">
                                        <div className="text-bold py-1 px-3 mb-4 mr-3 ml-3" style={{ backgroundColor: '#e7eaed', color: 'black', textAlign: 'left', fontSize: "16px" }}>
                                            Printed By: {LoginUserName || '-'} on {getShowingWithOutTime(datezone) || ''}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </>
            }
            {
                loder && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

export default OnOffDutyResourceReport