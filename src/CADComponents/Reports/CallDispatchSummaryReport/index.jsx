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
import { getData_DropDown_Zone } from '../../../CADRedux/actions/DropDownsData';

const CallDispatchSummaryReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const [zoneDropDown, setZoneDropDown] = useState([])
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [CFSDropDown, setCFSDropDown] = useState([]);
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setVerifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [callDispatchSummaryData, setCallDispatchSummaryData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const [shiftDropDown, setShiftDropDown] = useState([])

    const [
        callDispatchSummaryState,
        ,
        handleCallDispatchSummaryState,
        clearCallDispatchSummaryState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        shift: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        zone: "",
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        shift: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        zone: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCADEventFrom: false,
        showCADEventTo: false,
        showShift: false,
        showFoundPriorityID: false,
        showFoundCFSLDesc: false,
        showFoundCFSCodeID: false,
        showZone: false,
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
            showShift: searchValue?.shift,
            showFoundPriorityID: searchValue?.FoundPriorityID,
            showFoundCFSLDesc: searchValue?.FoundCFSLDesc,
            showFoundCFSCodeID: searchValue?.FoundCFSCodeID,
            showZone: searchValue?.zone,
        });
    }, [searchValue]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const CFSCodeKey = `/CAD/MasterCallforServiceCode/InsertCallforServiceCode`;
    const { data: CFSCodeData, isSuccess: isFetchCFSCodeData } = useQuery(
        [
            CFSCodeKey,
            {
                Action: "GetData_DropDown_CallforService",
                AgencyID: loginAgencyID,
            }
        ],
        MasterTableListServices.getCFS,
        {
            refetchOnWindowFocus: false,
        }
    );

    useEffect(() => {
        if (isFetchCFSCodeData && CFSCodeData) {
            const parsedData = JSON.parse(CFSCodeData?.data?.data);
            setCFSDropDown(parsedData?.Table);
        }
    }, [isFetchCFSCodeData, CFSCodeData]);

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
        clearCallDispatchSummaryState();
        setCallDispatchSummaryData([]);
        setAgencyData();
        setLoader(false);
        setVerifyIncident(false);
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoader(true);
        },
        onAfterPrint: () => {
            setLoader(false);
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

    const getCallDispatchSummaryData = async (isPrintReport = false) => {
        setLoader(true);
        if (
            !callDispatchSummaryState?.reportedFromDate &&
            !callDispatchSummaryState?.reportedToDate &&
            !callDispatchSummaryState?.zone?.code &&
            !callDispatchSummaryState?.CADEventFrom &&
            !callDispatchSummaryState?.CADEventTo &&
            !callDispatchSummaryState?.shift &&
            !callDispatchSummaryState?.FoundCFSCodeID &&
            !callDispatchSummaryState?.CADDisposition
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setVerifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "CADIncidentNumberFrom": callDispatchSummaryState?.CADEventFrom,
            "CADIncidentNumberTo": callDispatchSummaryState?.CADEventTo,
            "ReportedDate": callDispatchSummaryState?.reportedFromDate ? getShowingMonthDateYear(callDispatchSummaryState?.reportedFromDate) : "",
            "ReportedDateTO": callDispatchSummaryState?.reportedToDate ? getShowingMonthDateYear(callDispatchSummaryState?.reportedToDate) : "",
            "ShiftID": callDispatchSummaryState?.shift?.ShiftId,
            "CADCFSCodeID": callDispatchSummaryState?.FoundCFSCodeID,
            "ZoneID": callDispatchSummaryState?.zone?.value,
        }
        setSearchValue(callDispatchSummaryState)
        try {
            const response = await ReportsServices.getCallDispatchSummaryReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setCallDispatchSummaryData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setVerifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setCallDispatchSummaryData([]);
                    setAgencyData([])
                    setVerifyIncident(false);
                    setLoader(false);
                }
            }
        } catch (error) {
            if (!isPrintReport) {
                toastifyError("Data Not Available");
            }
            setVerifyIncident(false); setLoader(false);
        }
    }

    const handlePrintClick = () => {
        setLoader(true)
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getCallDispatchSummaryData(true); setShowFooter(false);
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
                                                <legend>Call Dispatch Summary</legend>

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
                                                                handleCallDispatchSummaryState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleCallDispatchSummaryState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={callDispatchSummaryState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={callDispatchSummaryState?.reportedFromDate ? true : false}
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
                                                                handleCallDispatchSummaryState("reportedToDate", date);
                                                            }}
                                                            selected={callDispatchSummaryState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={callDispatchSummaryState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={callDispatchSummaryState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!callDispatchSummaryState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!callDispatchSummaryState?.reportedFromDate && 'readonlyColor'}
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
                                                            value={callDispatchSummaryState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleCallDispatchSummaryState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handleCallDispatchSummaryState("CADEventTo", ""); // Clear CADEventTo
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
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
                                                            value={callDispatchSummaryState.CADEventTo}
                                                            onChange={(e) => handleCallDispatchSummaryState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!callDispatchSummaryState.CADEventFrom}
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
                                                            value={callDispatchSummaryState?.shift}
                                                            onChange={(e) => { handleCallDispatchSummaryState("shift", e) }}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            CFS
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="CFSLId"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === callDispatchSummaryState?.FoundCFSCodeID) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleCallDispatchSummaryState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleCallDispatchSummaryState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleCallDispatchSummaryState("FoundPriorityID", v?.PriorityID);
                                                            }}
                                                            placeholder="Select..."
                                                            styles={colorLessStyle_Select}
                                                            className="w-100"
                                                            menuPlacement="bottom"
                                                            isClearable
                                                            filterOption={(option, inputValue) =>
                                                                option.data.CFSCODE.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="CFSLDesc"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === callDispatchSummaryState?.FoundCFSLDesc) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleCallDispatchSummaryState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleCallDispatchSummaryState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleCallDispatchSummaryState("FoundPriorityID", v?.PriorityID);
                                                            }}
                                                            placeholder="Select..."
                                                            styles={colorLessStyle_Select}
                                                            className="w-100"
                                                            menuPlacement="bottom"
                                                            isClearable
                                                            filterOption={(option, inputValue) =>
                                                                option.data.CFSCodeDescription.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
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
                                                            value={callDispatchSummaryState?.zone}
                                                            onChange={(e) => { handleCallDispatchSummaryState("zone", e) }}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getCallDispatchSummaryData(false); }} >Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        onClick={() => { resetFields(); }}
                                    >Clear</button>
                                    <Link to={'/cad/dashboard-page'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        >Close</button>
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
                            <p className="p-0 m-0 d-flex align-items-center">Call Dispatch Summary Report</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
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
                                    }}>Call Dispatch Summary Report</p>
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
                                                            readOnly />
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
                                                            value={searchValue.CADEventFrom}
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
                                                            value={searchValue.CADEventTo}
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
                                        <div className='row'>
                                            {showFields?.showFoundCFSCodeID && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CFS</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1 d-flex">
                                                        <input type="text" className='readonlyColor'
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === searchValue?.FoundCFSCodeID
                                                            )?.CFSCODE}
                                                            readOnly />
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-8 text-field mt-1 d-flex">

                                                        <input type="text" className='readonlyColor ml-2'
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === searchValue?.FoundCFSLDesc
                                                            )?.CFSCodeDescription
                                                            }
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="text-dark master-table text-bold">
                                                    <tr>
                                                        <th className="" style={{ width: '180px' }}>CAD Event#</th>
                                                        <th className="">CFS Code/Description</th>
                                                        <th className="">Reported DT/TM</th>
                                                        <th className="">Shift</th>
                                                        <th className="">Patrol Zone</th>
                                                        <th className="">Initial Dispatch DT/TM</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="master-tbody">
                                                    {callDispatchSummaryData
                                                        .map((obj) => (
                                                            <tr>
                                                                <td className="text-list" style={{ width: '180px' }}>{obj.CADIncidentNumber}</td>
                                                                <td className="text-list">{obj.CFSCodeDescription}</td>
                                                                <td className="text-list"> {obj.ReportedDate && getShowingDateText(obj.ReportedDate)}</td>
                                                                <td className="text-list">{obj.ShiftDescription}</td>
                                                                <td className="text-list">{obj.ZoneDescription}</td>
                                                                <td className="text-list"> {obj.InitialDispatchDT && getShowingDateText(obj.InitialDispatchDT)}</td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
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
                loader && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

export default CallDispatchSummaryReport