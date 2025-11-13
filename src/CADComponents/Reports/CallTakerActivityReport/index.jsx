import { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { colorLessStyle_Select } from '../../Utility/CustomStylesForReact';
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
import { handleNumberTextKeyDown } from '../../../CADUtils/functions/common';
import { getData_DropDown_Operator } from '../../../CADRedux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';

const CallTakerActivityReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);

    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setVerifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [callTakerActivityData, setCallTakerActivityData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);

    const [
        callTakerActivityState,
        ,
        handleCallTakerActivityState,
        clearCallTakerActivityState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        callTaker: "",
        CADEventFrom: "",
        CADEventTo: "",
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        callTaker: "",
        CADEventFrom: "",
        CADEventTo: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCallTaker: false,
        showCADEventFrom: false,
        showCADEventTo: false,
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCallTaker: searchValue?.callTaker,
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
        });
    }, [searchValue]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
            dispatch(get_ScreenPermissions_Data("CE105", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    const resetFields = () => {
        clearCallTakerActivityState();
        setCallTakerActivityData([]);
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

    const getCallTakerActivityReport = async (isPrintReport = false) => {
        setLoader(true);
        if (
            !callTakerActivityState?.reportedFromDate &&
            !callTakerActivityState?.reportedToDate &&
            !callTakerActivityState?.callTaker?.PINID &&
            !callTakerActivityState?.CADEventFrom &&
            !callTakerActivityState?.CADEventTo
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setVerifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "CADIncidentNumberFrom": callTakerActivityState?.CADEventFrom,
            "CADIncidentNumberTo": callTakerActivityState?.CADEventTo,
            "CallTakerID": callTakerActivityState?.callTaker?.PINID,
            "ReportedDate": callTakerActivityState?.reportedFromDate ? getShowingMonthDateYear(callTakerActivityState?.reportedFromDate) : "",
            "ReportedDateTO": callTakerActivityState?.reportedToDate ? getShowingMonthDateYear(callTakerActivityState?.reportedToDate) : "",
        }
        setSearchValue(callTakerActivityState)

        try {
            const response = await ReportsServices.getCallTakerActivityReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setCallTakerActivityData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setVerifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setCallTakerActivityData([]);
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
            printForm(); getCallTakerActivityReport(true); setShowFooter(false);
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
                                                <legend>Call Taker Activity</legend>
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
                                                            value={callTakerActivityState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleCallTakerActivityState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handleCallTakerActivityState("CADEventTo", ""); // Clear CADEventTo
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
                                                            value={callTakerActivityState.CADEventTo}
                                                            onChange={(e) => handleCallTakerActivityState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!callTakerActivityState.CADEventFrom}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Call Taker
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
                                                            value={callTakerActivityState?.callTaker}
                                                            isClearable
                                                            onChange={(e) => { handleCallTakerActivityState("callTaker", e) }}
                                                        />
                                                    </div>
                                                </div>
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
                                                                handleCallTakerActivityState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleCallTakerActivityState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={callTakerActivityState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            isClearable={callTakerActivityState?.reportedFromDate ? true : false}
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
                                                                handleCallTakerActivityState("reportedToDate", date);
                                                            }}
                                                            selected={callTakerActivityState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            isClearable={callTakerActivityState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={callTakerActivityState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!callTakerActivityState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!callTakerActivityState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    {effectiveScreenPermission?.[0]?.AddOK ? <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getCallTakerActivityReport(false); }} >Show Report</button> : <></>}
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
                            <p className="p-0 m-0 d-flex align-items-center">Call Taker Activity Report</p>
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
                                    }}>Call Taker Activity</p>
                                </div>
                                <div className="col-12 mt-1 mb-3">
                                    <fieldset>
                                        <legend>Search Criteria</legend>
                                        <div className="row mt-2">

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
                                            {showFields.showCallTaker && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Call Taker</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.callTaker?.displayName2 || ""}
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
                                            <table className="table table-bordered mb-0">
                                                <thead className="text-dark master-table text-bold">
                                                    <tr>
                                                        <th className="">INT - Conf Inform or Intelligence Info </th>
                                                        <th className="" >A - ALARM CALL/BOARD</th>
                                                        <th className="" >D - DIRECTIVE/ORDERS</th>
                                                        <th className="" >9 - E911 CALL</th>
                                                        <th className="" >H - Health and Human Services</th>
                                                        <th className="" >M - MAIL</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <table className="table table-bordered mb-0">
                                                <thead className="text-dark master-table text-bold">
                                                    <tr>
                                                        <th className="" >O - OFFICER-INITIATED</th>
                                                        <th className="" >P - OTHER AUTHORITIES</th>
                                                        <th className="" >R - RADIO</th>
                                                        <th className="" >Y - RECEIVED in OTHER MANNER</th>
                                                        <th className="" >T - TELEPHONE</th>
                                                        <th className="" >W - WALK-IN</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                            <table className="table table-bordered">
                                                <thead className="text-dark master-table text-bold">
                                                    <tr>
                                                        <th className="">Call Taker</th>
                                                        <th className="" >INT</th>
                                                        <th className="" >A</th>
                                                        <th className="" >D</th>
                                                        <th className="" >9</th>
                                                        <th className="" >H</th>
                                                        <th className="" >M</th>
                                                        <th className="" >O</th>
                                                        <th className="" >P</th>
                                                        <th className="" >R</th>
                                                        <th className="" >Y</th>
                                                        <th className="" >T</th>
                                                        <th className="" >W</th>
                                                        <th className="" >Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="master-tbody">
                                                    {callTakerActivityData.map((obj) => (
                                                        <tr>
                                                            <td className="text-list" style={{ width: '200px' }}>{obj.CallTaker}</td>
                                                            <td className="text-list" >{obj.INT}</td>
                                                            <td className="text-list" >{obj.A}</td>
                                                            <td className="text-list" >{obj.D}</td>
                                                            <td className="text-list" >{obj.Nine}</td>
                                                            <td className="text-list" >{obj.H}</td>
                                                            <td className="text-list" >{obj.M}</td>
                                                            <td className="text-list" >{obj.O}</td>
                                                            <td className="text-list" >{obj.P}</td>
                                                            <td className="text-list" >{obj.R}</td>
                                                            <td className="text-list" >{obj.Y}</td>
                                                            <td className="text-list" >{obj.T}</td>
                                                            <td className="text-list" >{obj.W}</td>
                                                            <td className="text-list" >{obj.Total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <thead className="text-dark master-table text-bold">
                                                    <tr>
                                                        <th className="">Total</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.INT || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.A || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.D || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.Nine || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.H || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.M || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.O || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.P || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.R || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.Y || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.T || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.W || 0), 0)}</th>
                                                        <th>{callTakerActivityData.reduce((acc, obj) => acc + (obj.Total || 0), 0)}</th>
                                                    </tr>
                                                </thead>
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

export default CallTakerActivityReport