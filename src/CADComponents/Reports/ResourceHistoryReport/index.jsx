import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { colorLessStyle_Select, customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import { handleNumberTextKeyDown } from '../../../CADUtils/functions/common';
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

const ResourceHistoryReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);

    const [
        resourceHistoryReportState,
        ,
        handleResourceHistoryReportState,
        clearResourceHistoryReportState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        Id: "",
        apt: "",
        location: "",
        Resource1: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        zone: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCADEventFrom: false,
        showCADEventTo: false,
        showResource1: false,
        showPrimaryOfficer: false,
        showSecondaryOfficer: false,
        showZone: false,

    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        Id: "",
        apt: "",
        location: "",
        Resource1: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        zone: ""
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
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
    const [resourceHistoryData, setResourceHistoryData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [resourceDropDown, setResourceDropDown] = useState([]);
    const [showFooter, setShowFooter] = useState(false);

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

    const resetFields = () => {
        clearResourceHistoryReportState();
        setResourceHistoryData([]);
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

    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoder(true);

        if (
            !resourceHistoryReportState?.reportedFromDate &&
            !resourceHistoryReportState?.reportedToDate &&
            !resourceHistoryReportState?.CADEventFrom &&
            !resourceHistoryReportState?.CADEventTo &&
            !resourceHistoryReportState?.Resource1 &&
            !resourceHistoryReportState?.primaryOfficer?.PINID &&
            !resourceHistoryReportState?.secondaryOfficer?.PINID &&
            !resourceHistoryReportState?.zone?.code
        ) {
            toastifyError("Please enter at least one detail");
            setLoder(false);
            setverifyIncident(false)
            return; // Exit the function if required fields are not filled
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "ReportedFromDate": resourceHistoryReportState?.reportedFromDate ? getShowingMonthDateYear(resourceHistoryReportState?.reportedFromDate) : "",
            "ReportedToDate": resourceHistoryReportState?.reportedToDate ? getShowingMonthDateYear(resourceHistoryReportState?.reportedToDate) : "",
            "CADEventFrom": resourceHistoryReportState?.CADEventFrom,
            "CADEventTo": resourceHistoryReportState?.CADEventTo,
            "ResourceID": resourceHistoryReportState?.Resource1?.ResourceID,
            "PrimaryOfficerPINID": resourceHistoryReportState?.primaryOfficer?.PINID,
            "SecondaryOfficerPINID": resourceHistoryReportState?.secondaryOfficer?.PINID,
            "PatrolZoneID": resourceHistoryReportState?.zone?.value,
        }

        setSearchValue(resourceHistoryReportState)

        try {
            const response = await ReportsServices.getResourceHistoryReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setResourceHistoryData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoder(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setResourceHistoryData([]);
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
            printForm(); getIncidentSearchData(true); setShowFooter(false);
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
                                                <legend>Unit History Report</legend>
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
                                                                handleResourceHistoryReportState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleResourceHistoryReportState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={resourceHistoryReportState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={resourceHistoryReportState?.reportedFromDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select From Date..."
                                                            maxDate={new Date(datezone)}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Reported To Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='reportedToDate'
                                                            id='reportedToDate'
                                                            onChange={(date) => {
                                                                handleResourceHistoryReportState("reportedToDate", date);
                                                            }}
                                                            selected={resourceHistoryReportState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={resourceHistoryReportState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={resourceHistoryReportState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!resourceHistoryReportState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!resourceHistoryReportState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>

                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            CAD Event # From
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control  py-1 new-input"
                                                            name="CADEventFrom"
                                                            placeholder="CAD Event # From"
                                                            value={resourceHistoryReportState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleResourceHistoryReportState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handleResourceHistoryReportState("CADEventTo", ""); // Clear CADEventTo
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            CAD Event # To
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control  py-1 new-input"
                                                            name="CADEventTo"
                                                            placeholder="CAD Event # To"
                                                            value={resourceHistoryReportState.CADEventTo}
                                                            onChange={(e) => handleResourceHistoryReportState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!resourceHistoryReportState.CADEventFrom}
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
                                                            options={resourceDropDown}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={resourceHistoryReportState?.Resource1}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            onChange={(e) => {

                                                                handleResourceHistoryReportState("Resource1", e);
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
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
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
                                                            value={resourceHistoryReportState?.primaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleResourceHistoryReportState("primaryOfficer", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Secondary Officer
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
                                                            value={resourceHistoryReportState?.secondaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleResourceHistoryReportState("secondaryOfficer", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
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
                                                            value={resourceHistoryReportState?.zone}
                                                            onChange={(e) => { handleResourceHistoryReportState("zone", e) }}
                                                        />
                                                    </div>
                                                </div>

                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
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
                            <p className="p-0 m-0 d-flex align-items-center">Unit History Report</p>
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
                                    }}>Unit History Report</p>
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
                                            {showFields.showCADEventFrom && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CAD Event# From</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.CADEventFrom || ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showCADEventTo && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CAD Event# To</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.CADEventTo || ""}
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
                                        </div>
                                    </fieldset>
                                </div>

                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                        {[...new Set(resourceHistoryData.map((obj) => obj.CADIncidentNumber))].map((CADIncidentNumber) => {
                                            const filteredData = resourceHistoryData.filter((obj) => obj.CADIncidentNumber === CADIncidentNumber);
                                            const commonData = filteredData[0]; // Get the first record to extract common fields

                                            return (
                                                <div>
                                                    <p className="py-1 text-center" style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "16px", marginBottom: "5px"
                                                    }}>CAD Event #: {CADIncidentNumber || "-"}</p>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered" style={{ marginBottom: "0px" }}>
                                                            <tbody className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <td style={{ width: '200px', fontSize: "16px" }}><span style={{ fontWeight: "500" }}>CFS Code/Description :</span>{commonData?.CFSCode} {commonData?.CFSDescription && `| ${commonData?.CFSDescription}`}</td>
                                                                    <td style={{ width: '120px', fontSize: "16px" }}><span style={{ fontWeight: "500" }}>Reported DT/TM :</span>   {commonData.ReportedDate && getShowingDateText(commonData.ReportedDate)}</td>
                                                                    <td style={{ width: '120px', fontSize: "16px" }}><span style={{ fontWeight: "500" }}>Patrol Zone :</span> {commonData.PatrolZone} </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th style={{ width: '140px' }}>Unit #</th>
                                                                    <th style={{ width: '240px' }}>Dispatched</th>
                                                                    <th style={{ width: '240px' }}>Enroute</th>
                                                                    <th style={{ width: '240px' }}>Arrive</th>
                                                                    <th style={{ width: '240px' }}>Free</th>
                                                                    <th style={{ width: '200px' }}>Primary Officer</th>
                                                                    <th style={{ width: '200px' }}>Secondary Officer</th>
                                                                    <th style={{ width: '140px' }}>Total Minute</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="master-tbody">
                                                                {filteredData.map((obj) => {


                                                                    return (
                                                                        <tr>
                                                                            <td className="text-list" style={{ width: '140px' }}>{obj.Resource}</td>
                                                                            <td className="text-list" style={{ width: '240px', wordBreak: 'break-all' }}>
                                                                                {obj.Dispatched && getShowingDateText(obj.Dispatched)}
                                                                            </td>
                                                                            <td className="text-list" style={{ width: '240px' }}>
                                                                                {obj.Enroute && getShowingDateText(obj.Enroute)}
                                                                            </td>
                                                                            <td className="text-list" style={{ width: '240px' }}>
                                                                                {obj.Arrive && getShowingDateText(obj.Arrive)}
                                                                            </td>
                                                                            <td className="text-list" style={{ width: '240px' }}>
                                                                                {obj.Free && getShowingDateText(obj.Free)}
                                                                            </td>

                                                                            <td className="text-list" style={{ width: '200px' }}>{obj.PrimaryOfficer}</td>
                                                                            <td className="text-list" style={{ width: '200px' }}>
                                                                                {obj.SecondaryOfficer}
                                                                            </td>
                                                                            <td className="text-list" style={{ width: '140px' }}>
                                                                                {obj.TotalMinutes}
                                                                            </td>
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

export default ResourceHistoryReport