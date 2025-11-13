import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import ReportsServices from "../../../CADServices/APIs/reports";
import { toastifyError } from '../../../Components/Common/AlertMsg';
import { fetchPostData } from '../../../Components/hooks/Api';
import Loader from '../../../Components/Common/Loader';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getShowingMonthDateYear, getShowingWithOutTime } from '../../../Components/Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import ReportMainAddress from '../ReportMainAddress/ReportMainAddress';
import { getData_DropDown_Zone } from '../../../CADRedux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { IncidentContext } from '../../../CADContext/Incident';

const ShiftSummaryReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const { allResourcesData } = useContext(IncidentContext);

    const [zoneDropDown, setZoneDropDown] = useState([])
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loder, setLoder] = useState(false);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [shiftSummaryData, setShiftSummaryData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const [shiftDropDown, setShiftDropDown] = useState([])

    const [
        shiftState,
        ,
        handleShiftState,
        clearShiftState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        zone: "",
        shift: "",
        Resource1: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showZone: false,
        showShift: false,
        showResource1: false,
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        zone: "",
        shift: "",
        Resource1: "",
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showZone: searchValue?.zone,
            showShift: searchValue?.shift,
            showResource1: searchValue?.Resource1,
        });
    }, [searchValue]);


    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("CU105", localStoreData?.AgencyID, localStoreData?.PINID));
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

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

    const resetFields = () => {
        clearShiftState();
        setShiftSummaryData([]);
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
            else { console.error("error") }
        })
    }

    const getShiftSearchData = async (isPrintReport = false) => {
        setLoder(true);

        if (
            !shiftState?.reportedFromDate &&
            !shiftState?.reportedToDate &&
            !shiftState?.zone?.code &&
            !shiftState?.shift &&
            !shiftState?.Resource1

        ) {
            toastifyError("Please enter at least one detail");
            setLoder(false);
            setverifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "ReportedDate": shiftState?.reportedFromDate ? getShowingMonthDateYear(shiftState?.reportedFromDate) : "",
            "ReportedDateTO": shiftState?.reportedToDate ? getShowingMonthDateYear(shiftState?.reportedToDate) : "",
            "ShiftID": shiftState?.shift?.ShiftId,
            "ZoneID": shiftState?.zone?.value,
            "ResourceID": shiftState?.Resource1?.ResourceID || "",
        };

        setSearchValue(shiftState)

        try {
            const response = await ReportsServices.getShiftSummaryReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setShiftSummaryData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoder(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setShiftSummaryData([]);
                    setAgencyData([])
                    setverifyIncident(false);
                    setLoder(false);
                }
            }
        } catch (error) {
            console.error("error", error)
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
            printForm(); getShiftSearchData(true); setShowFooter(false);
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
                                                <legend>Shift Summary</legend>
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
                                                                handleShiftState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleShiftState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={shiftState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={shiftState?.reportedFromDate ? true : false}
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
                                                                handleShiftState("reportedToDate", date);
                                                            }}
                                                            selected={shiftState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={shiftState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={shiftState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!shiftState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!shiftState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Patrol Zone
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select..."
                                                            options={zoneDropDown}

                                                            isClearable
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            // isMulti
                                                            value={shiftState?.zone}
                                                            onChange={(e) => { handleShiftState("zone", e) }}
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
                                                            placeholder="Select..."
                                                            getOptionLabel={(v) => v?.ShiftCode + " | " + v?.ShiftDescription}
                                                            getOptionValue={(v) => v?.ShiftId}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.ShiftCode} | ${option?.ShiftDescription}`
                                                                    : option?.ShiftCode;
                                                            }}
                                                            options={shiftDropDown}
                                                            value={shiftState?.shift}
                                                            onChange={(e) => { handleShiftState("shift", e) }}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Unit #
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            isClearable
                                                            options={allResourcesData}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={shiftState?.Resource1}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            onChange={(e) => {

                                                                handleShiftState("Resource1", e);
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
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    {effectiveScreenPermission?.[0]?.AddOK ? <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getShiftSearchData(false); }} >Show Report</button> : <></>}
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        onClick={() => { resetFields(); }}
                                    >Clear</button>
                                    <Link to={'/cad/dashboard-page'}>
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
                            <p className="p-0 m-0 d-flex align-items-center">Shift Summary Report</p>
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
                                    }}>Shift Summary Report</p>
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
                                        </div>
                                    </fieldset>
                                </div>
                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                        <div>
                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead className="text-dark master-table text-bold">
                                                        <tr>
                                                            <th style={{ width: '110px' }}>Unit #</th>
                                                            <th style={{ width: '200px' }}>Officer</th>
                                                            <th style={{ width: '70px' }}>No. Of Calls</th>
                                                            <th style={{ width: '110px' }}>Shift</th>
                                                            <th style={{ width: '140px' }}>Zone</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="master-tbody">
                                                        {shiftSummaryData.map((obj) => {
                                                            return (
                                                                <tr>
                                                                    <td className="text-list" style={{ width: '110px' }}>{obj.ResourceNumber}</td>
                                                                    <td className="text-list" style={{ width: '200px' }}>{obj.Officers}</td>
                                                                    <td className="text-list" style={{ width: '70px' }}>{obj.NoOfCalls}</td>
                                                                    <td className="text-list" style={{ width: '110px' }}>{obj.Shift}</td>
                                                                    <td className="text-list" style={{ width: '140px' }}>{obj.Zone}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
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

export default ShiftSummaryReport