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
import { getShowingMonthDateYear, getShowingWithOutTime } from '../../../Components/Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import ReportMainAddress from '../ReportMainAddress/ReportMainAddress';
import { getData_DropDown_Operator } from '../../../CADRedux/actions/DropDownsData';

const DispatchQueueWaitTimeReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [CFSDropDown, setCFSDropDown] = useState([]);
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setVerifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [dispatchQueueWaitTimeData, setDispatchQueueWaitTimeData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);

    const [
        dispatchQueueWaitTimeState,
        ,
        handleDispatchQueueWaitTimeState,
        clearDispatchQueueWaitTimeState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        dispatcher: "",
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        dispatcher: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCADEventFrom: false,
        showCADEventTo: false,
        showFoundPriorityID: false,
        showFoundCFSLDesc: false,
        showFoundCFSCodeID: false,
        showDispatcher: false,
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
            showFoundPriorityID: searchValue?.FoundPriorityID,
            showFoundCFSLDesc: searchValue?.FoundCFSLDesc,
            showFoundCFSCodeID: searchValue?.FoundCFSCodeID,
            showDispatcher: searchValue?.dispatcher,
        });
    }, [searchValue]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
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
            enabled: !!loginAgencyID
        }
    );

    useEffect(() => {
        if (isFetchCFSCodeData && CFSCodeData) {
            const parsedData = JSON.parse(CFSCodeData?.data?.data);
            setCFSDropDown(parsedData?.Table);
        }
    }, [isFetchCFSCodeData, CFSCodeData]);

    const resetFields = () => {
        clearDispatchQueueWaitTimeState();
        setDispatchQueueWaitTimeData([]);
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
            else { console.log("error") }
        })
    }

    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoader(true);
        if (
            !dispatchQueueWaitTimeState?.reportedFromDate &&
            !dispatchQueueWaitTimeState?.reportedToDate &&
            !dispatchQueueWaitTimeState?.CADEventFrom &&
            !dispatchQueueWaitTimeState?.CADEventTo &&
            !dispatchQueueWaitTimeState?.FoundCFSCodeID &&
            !dispatchQueueWaitTimeState?.dispatcher?.PINID
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setVerifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "CADIncidentNumberFrom": dispatchQueueWaitTimeState?.CADEventFrom,
            "CADIncidentNumberTo": dispatchQueueWaitTimeState?.CADEventTo,
            "ReportedDate": dispatchQueueWaitTimeState?.reportedFromDate ? getShowingMonthDateYear(dispatchQueueWaitTimeState?.reportedFromDate) : "",
            "ReportedDateTO": dispatchQueueWaitTimeState?.reportedToDate ? getShowingMonthDateYear(dispatchQueueWaitTimeState?.reportedToDate) : "",
            "CADCFSCodeID": dispatchQueueWaitTimeState?.FoundCFSCodeID,
            "dispatcher": dispatchQueueWaitTimeState?.dispatcher?.PINID,
            // "CADCFSCodeID":1,
            // "ZoneDescription": dispatchQueueWaitTimeState?.zone?.label,
        }
        setSearchValue(dispatchQueueWaitTimeState)
        try {
            const response = await ReportsServices.getOfficerActivityReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setDispatchQueueWaitTimeData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setVerifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available"); setDispatchQueueWaitTimeData([]); setAgencyData([])
                    setVerifyIncident(false); setLoader(false);
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
                                                <legend>Dispatch Queue/Wait Time Report</legend>
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
                                                                handleDispatchQueueWaitTimeState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleDispatchQueueWaitTimeState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={dispatchQueueWaitTimeState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={dispatchQueueWaitTimeState?.reportedFromDate ? true : false}
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
                                                                handleDispatchQueueWaitTimeState("reportedToDate", date);
                                                            }}
                                                            selected={dispatchQueueWaitTimeState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={dispatchQueueWaitTimeState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={dispatchQueueWaitTimeState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!dispatchQueueWaitTimeState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!dispatchQueueWaitTimeState?.reportedFromDate && 'readonlyColor'}
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
                                                            value={dispatchQueueWaitTimeState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleDispatchQueueWaitTimeState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handleDispatchQueueWaitTimeState("CADEventTo", ""); // Clear CADEventTo
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
                                                            value={dispatchQueueWaitTimeState.CADEventTo}
                                                            onChange={(e) => handleDispatchQueueWaitTimeState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!dispatchQueueWaitTimeState.CADEventFrom}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Dispatcher
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
                                                            value={dispatchQueueWaitTimeState?.dispatcher}
                                                            isClearable
                                                            onChange={(e) => { handleDispatchQueueWaitTimeState("dispatcher", e) }}
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
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === dispatchQueueWaitTimeState?.FoundCFSCodeID) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleDispatchQueueWaitTimeState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleDispatchQueueWaitTimeState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleDispatchQueueWaitTimeState("FoundPriorityID", v?.PriorityID);
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
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === dispatchQueueWaitTimeState?.FoundCFSLDesc) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleDispatchQueueWaitTimeState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleDispatchQueueWaitTimeState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleDispatchQueueWaitTimeState("FoundPriorityID", v?.PriorityID);
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
                                                            Final Status
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">

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
                            <p className="p-0 m-0 d-flex align-items-center">Dispatch Queue/Wait Time Report</p>
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
                                    }}>Dispatch Queue/Wait Time Report</p>
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

                                            {showFields.showDispatcher && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Dispatcher</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.dispatcher?.displayName2}
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
                                        {[
                                            ...new Set(dispatchQueueWaitTimeData.map((obj) => obj.OfficerName)),
                                        ].map((OfficerName, index, array) => {
                                            const filteredData = dispatchQueueWaitTimeData.filter((obj) => obj.OfficerName === OfficerName);
                                            const commonData = filteredData[0];
                                            const isLastItem = index === array.length - 1;  // Check if it's the last item
                                            {/* const isLastItem = index === filteredData.length - 1; */ }

                                            return (
                                                <div key={OfficerName}>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered mb-0">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th className="" style={{ width: '180px' }}>Officer</th>
                                                                    <th className="">Totals Calls</th>
                                                                    <th className="">Shift</th>
                                                                    <th className="">Patrol Zone</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="master-tbody">
                                                                <tr>
                                                                    <td className="text-list" style={{ width: '180px' }}>{commonData.OfficerName}</td>
                                                                    <td className="text-list" >{commonData.TotalDPCalls}</td>
                                                                    <td className="text-list">{commonData.Shift}</td>
                                                                    <td className="text-list">{commonData.Zone}</td>

                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table className="table table-bordered">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th className="" style={{ width: '180px' }}>CFS Code</th>
                                                                    <th className="">CFS Description</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="master-tbody">
                                                                {filteredData
                                                                    .filter((obj) => obj.CFSCODE && obj.CFSCodeDescription)  // Only include records where both CFSCODE and CFSCodeDescription exist
                                                                    .map((obj) => (
                                                                        <tr key={obj.CFSCODE}>
                                                                            <td className="text-list" style={{ width: '180px' }}>{obj.CFSCODE}</td>
                                                                            <td className="text-list">{obj.CFSCodeDescription}</td>
                                                                        </tr>
                                                                    ))}
                                                            </tbody>
                                                        </table>

                                                        {!isLastItem && (
                                                            <div className="col-12">
                                                                <hr style={{ border: '2px solid #001F3F' }} />
                                                            </div>
                                                        )}
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
                loader && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

export default DispatchQueueWaitTimeReport