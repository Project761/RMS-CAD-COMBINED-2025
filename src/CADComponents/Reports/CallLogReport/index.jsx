import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import { handleNumberTextKeyDown } from '../../../CADUtils/functions/common';
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
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';

const CallLogReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const [zoneDropDown, setZoneDropDown] = useState([])
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setVerifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [dailyActivityData, setDailyActivityData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);

    const [
        callLogState,
        ,
        handleCallLogState,
        clearCallLogState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        zone: "",
        CADEventFrom: "",
        CADEventTo: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showZone: false,
        showCADEventFrom: false,
        showCADEventTo: false,
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        zone: "",
        CADEventFrom: "",
        CADEventTo: "",
    });

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("CE104", localStoreData?.AgencyID, localStoreData?.PINID));
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
        }
    }, [localStoreData]);


    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showZone: searchValue?.zone,
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
        });
    }, [searchValue]);


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

    const resetFields = () => {
        clearCallLogState();
        setDailyActivityData([]);
        setAgencyData();
        setLoader(false);
        setVerifyIncident(false);
    }

    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoader(true);

        if (
            !callLogState?.reportedFromDate &&
            !callLogState?.reportedToDate &&
            !callLogState?.zone?.code &&
            !callLogState?.CADEventFrom &&
            !callLogState?.CADEventTo
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setVerifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "ReportedDate": callLogState?.reportedFromDate ? getShowingMonthDateYear(callLogState?.reportedFromDate) : "",
            "ReportedDateTO": callLogState?.reportedToDate ? getShowingMonthDateYear(callLogState?.reportedToDate) : "",
            "CADIncidentNumberFrom": callLogState?.CADEventFrom,
            "CADIncidentNumberTo": callLogState?.CADEventTo,
            "ZoneID": callLogState?.zone?.value,
        }
        setSearchValue(callLogState)

        try {
            const response = await ReportsServices.getCallLogReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setDailyActivityData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setVerifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setDailyActivityData([]);
                    setAgencyData([])
                    setVerifyIncident(false);
                    setLoader(false);
                }
            }
        } catch (error) {
            console.error("error", error)
            if (!isPrintReport) {
                toastifyError("Data Not Available");
            }
            setVerifyIncident(false);
            setLoader(false);
        }
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
                                                <legend>Call Log Report</legend>
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
                                                                handleCallLogState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleCallLogState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={callLogState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={callLogState?.reportedFromDate ? true : false}
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
                                                                handleCallLogState("reportedToDate", date);
                                                            }}
                                                            selected={callLogState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={callLogState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={callLogState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!callLogState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!callLogState?.reportedFromDate && 'readonlyColor'}
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
                                                            value={callLogState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleCallLogState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handleCallLogState("CADEventTo", ""); // Clear CADEventTo
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
                                                            value={callLogState.CADEventTo}
                                                            onChange={(e) => handleCallLogState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!callLogState.CADEventFrom}
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
                                                            value={callLogState?.zone}
                                                            onChange={(e) => { handleCallLogState("zone", e) }}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    {effectiveScreenPermission?.[0]?.AddOK ? <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button> : <></>
                                    }
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
                            <p className="p-0 m-0 d-flex align-items-center">Call Log Report</p>
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
                                    }}>Call Log Report</p>
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
                                        {[...new Set(dailyActivityData.map((obj) => obj.Date))].map((Date) => {
                                            const filteredData = dailyActivityData.filter((obj) => obj.Date === Date);
                                            const commonData = filteredData[0]; // Get the first record to extract common fields
                                            return (
                                                <div key={Date}>
                                                    <p className="py-1 text-center" style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px"
                                                    }}>{Date && `Date : ${getShowingWithOutTime(Date)}`} {commonData?.TotalCalls && `| Total - ${commonData?.TotalCalls || "-"} Calls`} </p>

                                                    <div className="table-responsive">
                                                        {filteredData.map((obj, index) => {
                                                            const isLastItem = index === filteredData.length - 1;
                                                            return (
                                                                <div key={obj.CADIncidentNumber}>
                                                                    <table className="table table-bordered mb-0">
                                                                        <thead className="text-dark master-table text-bold">
                                                                            <tr>
                                                                                <th style={{ width: '30px' }}>CAD Event#</th>
                                                                                <th style={{ width: '70px' }}>Reported DT/TM</th>
                                                                                <th style={{ width: '430px' }}>Location</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="master-tbody">
                                                                            <tr>
                                                                                <td className="text-list" style={{ width: '30px' }}>{obj.CADIncidentNumber || "-"}</td>
                                                                                <td className="text-list" style={{ width: '70px' }}> {obj.ReportedDate && getShowingDateText(obj.ReportedDate)}</td>
                                                                                <td className="text-list" style={{ width: '430px' }}>{obj.CrimeLocation || "-"}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <table className="table table-bordered mb-0">
                                                                        <thead className="text-dark master-table text-bold">
                                                                            <tr>
                                                                                <th style={{ width: '120px' }}>Clear DT/TM</th>
                                                                                <th style={{ width: '120px' }}>Call Taker</th>
                                                                                <th style={{ width: '120px' }}>Receive Source</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="master-tbody">
                                                                            <tr>
                                                                                <td className="text-list" style={{ width: '120px' }}>{obj.ClearDate && getShowingDateText(obj.ClearDate)}</td>
                                                                                <td className="text-list" style={{ width: '120px' }}> {obj.CallTaker || "-"}</td>
                                                                                <td className="text-list" style={{ width: '120px' }}>{obj.ReceiveSource || "-"}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <table className="table table-bordered">
                                                                        <thead className="text-dark master-table text-bold">
                                                                            <tr>
                                                                                <th style={{ width: '280px' }}>CFS Code/Description</th>
                                                                                <th style={{ width: '150px' }}>CAD Disposition</th>
                                                                                <th style={{ width: '150px' }}>Zone</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="master-tbody">
                                                                            <tr>
                                                                                <td className="text-list" style={{ width: '280px' }}>{obj.CFSCodeDescription || "-"}</td>
                                                                                <td className="text-list" style={{ width: '150px' }}>{obj.DispositionDescription || "-"}</td>
                                                                                <td className="text-list" style={{ width: '150px' }}>{obj.ZoneCode || "-"}</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    {!isLastItem && (
                                                                        <div className="col-12">
                                                                            <hr style={{ border: '2px solid #001F3F' }} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                                {showFooter && (
                                    <div className="print-footer">
                                        <div className="text-bold py-1 px-3 mr-3 ml-3" style={{ backgroundColor: '#e7eaed', color: 'black', textAlign: 'left', fontSize: "16px" }}>
                                            Printed By: {LoginUserName || '-'} on {getShowingWithOutTime(datezone) || '-'}
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

export default CallLogReport