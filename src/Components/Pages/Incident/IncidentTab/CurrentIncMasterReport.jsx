import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithOutTimeNew } from '../../../Common/Utility';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { useReactToPrint } from 'react-to-print';
import ReportAddress from '../../ReportAddress/ReportAddress';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import { fetchPostData, fetchPostDataNew } from '../../../hooks/Api';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';

import { AgencyContext } from '../../../../Context/Agency/Index';
import { containsKeywordInTable } from '../../../../CADUtils/functions/containsKeyword';


const CurrentIncMasterReport = (props) => {

    const dispatch = useDispatch();
    const componentRef = useRef();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const ipAddress = sessionStorage.getItem('IPAddress');
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);
    const { printIncReport, IncReportCount, setIncReportCount, incNumber, setIncMasterReport, showModal, setShowModal, incidentID, isRedactedReport } = props


    const [multiImage, setMultiImage] = useState([]);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [reportedData, setReportedData] = useState([]);
    const [incidentData, setIncidentData] = useState([]);
    const [masterReportData, setMasterReportData] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [locationStatus, setLocationStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [PropertyPhoto, setPropertyPhoto] = useState([]);
    const [loder, setLoder] = useState(false);
    const [height, setHeight] = useState('auto');
    const [propertyID, setPropertyID] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [redactingData, setRedactingData] = useState({});

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginPinID(parseInt(localStoreData?.PINID));
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    // Onload Function
    useEffect(() => {
        if (LoginAgencyID && incNumber && incidentID) {
            getAgencyImg(LoginAgencyID);
            Get_AgencyWiseRedactingReport(LoginAgencyID, incidentID)
        }
    }, [LoginAgencyID, incNumber]);

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.log("errror") }
        })
    }

    useEffect(() => {
        if (incidentData?.length > 0) {
            setverifyIncident(true);
            // printForm();
        }
    }, [incidentData]);

    const isNotEmpty = (value) => {
        return value !== null && value.trim() !== '';
    }

    const getIncidentSearchData = async () => {
        setLoder(true);
        setIsLoading(true);
        const val = {
            'IncidentNumber': incNumber, 'IncidentNumberTo': '', 'ReportedDate': '', 'ReportedDateTo': '', 'OccurredFrom': '', 'OccurredTo': '', 'AgencyID': LoginAgencyID, 'FBIID': '', 'RMSCFSCodeList': '', 'Location': '',
            'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '',
            'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1,
            'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1,
            'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
        }
        try {
            const apiUrl = 'Report/GetData_MasterReport';
            const res = await fetchPostData(apiUrl, val);
            if (res.length > 0) {
                console.log("🚀 ~ getIncidentSearchData ~ res:", res);
                setIncidentData(res[0].Incident);
                setMasterReportData(res[0]);
                setIsLoading(false);
                getAgencyImg(LoginAgencyID);

            } else {
                setIncidentData([]);
                setverifyIncident(false);
                setIsLoading(false);

            }

        } catch (error) {

            console.log("🚀 ~ getIncidentSearchData ~ error:", error);

        }

    }


    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        removeAfterPrint: true,
        onBeforeGetContent: () => {
            setShowFooter(true);
        },
        onAfterPrint: () => {
            setShowFooter(false);
            setIncMasterReport(false);
        }
    });

    const [showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        if (printIncReport) {
            getIncidentSearchData();
        }
    }, [printIncReport, IncReportCount])


    const Get_AgencyWiseRedactingReport = async (loginAgencyID, IncID) => {
        const val = { AgencyID: loginAgencyID, IncidentID: IncID }
        await fetchPostDataNew('CAD/RedactingofReports/GetAgencyWiseRedactingReport', val).then((data) => {
            if (data.length > 0) {
                setRedactingData(JSON.parse(data));
            } else {
                setRedactingData([]);
            }
        })
    }

    return (
        <>
            {
                showModal && (
                    <>

                        <div class="modal " style={{ background: "rgba(0,0,0, 0.5)" }} id="CurrentIncidentReport" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">

                            <div className="modal-xl m-auto">
                                <div
                                    className="py-1 px-3 mt-1 d-flex justify-content-between text-black align-items-center"
                                    style={{
                                        backgroundColor: '#dddddd',
                                        borderTopLeftRadius: '8px',
                                        borderTopRightRadius: '8px',
                                        width: '100%',
                                    }}

                                >
                                    <p className="p-0 m-0 d-flex align-items-center" style={{ fontSize: '18px', color: "#000", fontWeight: 'bold' }}>
                                        Master Incident Report
                                    </p>

                                    <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>

                                        <span onClick={() => {
                                            setIncMasterReport(true);
                                            printForm();
                                            setIncReportCount(IncReportCount + 1);
                                        }} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            <i className="fa fa-print"  > Print</i>
                                        </span>

                                        <button
                                            className="btn btn-sm btn-danger px-2 py-0"
                                            onClick={() => {
                                                setShowModal(false);
                                                setIncMasterReport(false);
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className="modal-dialog modal-xl modal-dialog-centered currentlnc__modal mt-0">
                                <div className="modal-content p-2 px-4 approvedReportsModal" style={{ minHeight: '600px' }}>

                                    {isLoading ? (
                                        <div className="text-center py-5">
                                            <div className="spinner-border text-primary" role="status"></div>
                                            <p>Loading report...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div
                                                className="row printable-area"
                                                ref={componentRef}
                                                style={{
                                                    border: '1px solid #80808085',
                                                    marginBottom: '100px',
                                                    pointerEvents: isRedactedReport ? 'none' : 'auto'
                                                }}
                                            >
                                                <>
                                                    <ReportAddress {...{ multiImage, masterReportData }} />
                                                </>
                                                <div className="col-12">
                                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                    <h5 className="text-center text-white text-bold bg-green  py-1" >Master Incident Report</h5>
                                                </div>
                                                {
                                                    masterReportData?.Incident?.map((obj) =>
                                                        <>
                                                            <div className="container mt-3" style={{ pageBreakAfter: 'always', }}>
                                                                <h5 className=" text-white text-bold bg-green py-1 px-3 text-center"> Incident Number:- {obj.IncidentNumber}</h5>
                                                                {/* incident */}
                                                                <div className="col-12 mt-2 mb-3" style={{ border: '1px solid #80808085', }}>
                                                                    <div className="container ">
                                                                        <div className="col-12 mb-2">
                                                                            <h6 className=' text-dark mt-2'>Incident Information</h6>
                                                                            <div className="row px-3" >
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.IncidentNumber}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Incident Number</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.ReportedDate ? getShowingDateText(obj.ReportedDate) : ''}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Reported Date</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.BIBRSDate ? getShowingDateText(obj.BIBRSDate) : ''}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>NIBRS Date</label>
                                                                                    </div>
                                                                                </div>
                                                                                {/* <div className="col-2"></div> */}
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.OccurredFrom ? getShowingDateText(obj.OccurredFrom) : ''}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Occurred From</label>
                                                                                    </div>
                                                                                </div>
                                                                                {/* <div className="col-1"></div> */}
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.OccurredTo ? getShowingDateText(obj.OccurredTo) : ''}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Occurred To</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.ReceiveSource}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>How Reported</label>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.isPoliceForceApplied}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Use of Force Applied</label>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.OfficerName}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Primary Officer</label>
                                                                                    </div>
                                                                                </div>


                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.NIBRSStatus}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Case Status</label>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-9 col-md-9 col-lg-10 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text"
                                                                                            className={`readonlyColor ${isRedactedReport && containsKeywordInTable(obj.CrimeLocation, "CrimeLocation", "Table3", redactingData) ? "redacted" : ""}`}
                                                                                            name='DocFileName' required readOnly
                                                                                            value={obj.CrimeLocation}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Crime Location</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-2 mt-4 pt-3">
                                                                                    <div className=''>
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            name=""
                                                                                            id=""
                                                                                            checked={obj && Object.keys(obj).length > 0 ? obj.IsVerify : false}
                                                                                            disabled={!obj || Object.keys(obj).length === 0}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary pl-2'>Verified</label>

                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-12 col-md-12 col-lg-12 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.OffenseType}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Offense Type</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-12 col-md-12 col-lg-12 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                            value={obj.RMS_Disposition}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Exceptional Clearance(Yes/No)</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                            value={obj.NIBRSClearance}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Exceptional Clearance Code</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                            value={obj.NIBRSclearancedate ? getShowingDateText(obj.NIBRSclearancedate) : ''}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Exceptional Clearance Date/Time</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                            value={obj.CADCFSCode_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>CAD CFS Code</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 col-lg-6 mt-4">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                            value={obj.CADDispositions_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>CAD Dispositions</label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    {/* pin-activity */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.PINActivity)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>PIN Activity</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.PINActivity)?.map((item, key) => (
                                                                                                    <div className="row  px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            // value={item.ActivityDateTime ? getShowingDateText(obj.ActivityDateTime) : ''}
                                                                                                                            // value={item.ActivityDateTime}
                                                                                                                            value={item.ActivityDateTime ? getShowingDateText(item.ActivityDateTime) : ''}

                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.OfficerName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.ActivityRole}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Role</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.ActivityStatus}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Activity Details</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.ResourceNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Module</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.ShiftDescription}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Shift</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* type of secruity */}
                                                                    <div className="col-12  ">
                                                                        {
                                                                            JSON.parse(obj?.IncidentSecurity)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Types Of Security</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.IncidentSecurity)?.map((item, key) => (
                                                                                                    <div className="row  px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                    <label htmlFor="" className='new-summary'>Types Of Security</label>
                                                                                                                    <div
                                                                                                                        className="readonlyColor "
                                                                                                                        style={{
                                                                                                                            border: '1px solid #ccc',
                                                                                                                            borderRadius: '4px',
                                                                                                                            padding: '10px',
                                                                                                                            backgroundColor: '#f9f9f9',
                                                                                                                            lineBreak: 'anywhere'
                                                                                                                        }}
                                                                                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.Security_Description) }}
                                                                                                                    />

                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* dispatch */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Dispatch)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Dispatch Activity</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Dispatch)?.map((item, key) => (
                                                                                                    <div className="row  px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.DispatchDate ? getShowingDateText(item.DispatchDate) : ''}

                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Dispatch Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.OfficerName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                    <label htmlFor="" className='new-summary'>Dispatch Activity Comments</label>

                                                                                                                    <div
                                                                                                                        className="readonlyColor  "
                                                                                                                        style={{
                                                                                                                            border: '1px solid #ccc',
                                                                                                                            borderRadius: '4px',
                                                                                                                            padding: '10px',
                                                                                                                            backgroundColor: '#f9f9f9',
                                                                                                                            lineBreak: 'anywhere'
                                                                                                                        }}
                                                                                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Comments) }}
                                                                                                                    />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Narrative)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Report</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Narrative)?.map((item, key) => {

                                                                                                    let redactedComment = item?.RedactedComment || "";

                                                                                                    redactedComment = redactedComment?.replace(
                                                                                                        /background-color:\s*rgb\(0,\s*128,\s*0\)/g,
                                                                                                        "background-color: #EAEAE8"
                                                                                                    );

                                                                                                    redactedComment = redactedComment?.replace(
                                                                                                        /color:\s*rgb\(127,\s*255,\s*212\)/g,
                                                                                                        "color: #434A54"
                                                                                                    );

                                                                                                    return (
                                                                                                        <div className="row  px-3 ">

                                                                                                            <div className="col-12 mb-2">
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.AsOfDate ? getShowingDateText(item.AsOfDate) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Date/Time</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Report Type</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.ReportedBy}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Written For</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                                        <div>
                                                                                                                            <label htmlFor="" className='new-summary'>Notes</label>
                                                                                                                            <div
                                                                                                                                className="readonlyColor text-left "
                                                                                                                                style={{
                                                                                                                                    border: '1px solid #ccc',
                                                                                                                                    borderRadius: '4px',
                                                                                                                                    padding: '10px',
                                                                                                                                    backgroundColor: '#f9f9f9',
                                                                                                                                    whiteSpace: 'normal',
                                                                                                                                    wordBreak: 'break-word',
                                                                                                                                    overflowWrap: 'break-word'

                                                                                                                                }}
                                                                                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(isRedactedReport ? redactedComment : item?.Comments) }}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >

                                                                    {/* offense */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Offence)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Offense Information</h6>
                                                                                        <div className="col-12">
                                                                                            {
                                                                                                JSON.parse(obj?.Offence)?.map((item, key) => (
                                                                                                    <div className="row  mb-2 px-3 " >
                                                                                                        <div className="col-5 col-md-5 col-lg-5 mt-1">
                                                                                                            <div className='text-field'>
                                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                    value={item.FBIID_Description}
                                                                                                                />
                                                                                                                <label htmlFor="" className='new-summary'>TIBRS Code</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        {/* <div className="col-2"></div> */}
                                                                                                        <div className="col-5 col-md-5 col-lg-7 mt-1">
                                                                                                            <div className='text-field'>
                                                                                                                <input type="text"
                                                                                                                    className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item.OffenseName_Description, "FullDescription", "Table1", redactingData) ? "redacted" : ""}`}
                                                                                                                    name='DocFileName' required readOnly
                                                                                                                    value={item.OffenseName_Description}
                                                                                                                />
                                                                                                                <label htmlFor="" className='new-summary'>Offense Code/Name</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-5 col-md-5 col-lg-5 mt-4">
                                                                                                            <div className='text-field'>
                                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                    value={item.PrimaryLocation}
                                                                                                                />
                                                                                                                <label htmlFor="" className='new-summary'>Primary Location</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-2"></div>
                                                                                                        <div className="col-5 col-md-5 col-lg-5 mt-4 ">
                                                                                                            <div className='text-field'>
                                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                    value={item.SecondaryLocation}
                                                                                                                />
                                                                                                                <label htmlFor="" className='new-summary'>Secondary Location</label>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                                            {
                                                                                                                item.AttemptComplete == "A" ?
                                                                                                                    <div className="form-check  ">
                                                                                                                        <input className="form-check-input mt-1" type="checkbox" checked={true} name="AttemptComplete" id="flexRadioDefault1" />
                                                                                                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                                                                            Attempted
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                                    :
                                                                                                                    <div className="form-check  ">
                                                                                                                        <input className="form-check-input mt-1" type="checkbox" value={false} checked={false} onChange={(e) => { e.preventDefault(); }} name="AttemptComplete" id="flexRadioDefault1" />
                                                                                                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                                                                            Attempted
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                            }

                                                                                                        </div>
                                                                                                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                                            {
                                                                                                                item.AttemptComplete === "C" ?
                                                                                                                    <div className="form-check  ">
                                                                                                                        <input className="form-check-input mt-1" type="checkbox" checked={true} name="AttemptComplete" id="flexRadioDefault2" />
                                                                                                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                                                                            Completed
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                                    :
                                                                                                                    <div className="form-check  ">
                                                                                                                        <input className="form-check-input mt-1" type="checkbox" value={false} checked={false} onChange={(e) => { e.preventDefault(); }} name="AttemptComplete" id="flexRadioDefault2" />
                                                                                                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                                                                            Completed
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                            }

                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div>
                                                                    {/* name */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Name)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container">
                                                                                        <h6 className=' text-dark mt-2'>Name Information Person</h6>

                                                                                        <div className="col-12 mb-2 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Name).filter(item => item.NameType_Description !== 'Business')
                                                                                                    .map((item, key) => (

                                                                                                        <div className="row ">
                                                                                                            <div className="col-2" >
                                                                                                                <div className="col-10 col-md-10 col-lg-10 mt-4 ">
                                                                                                                    <div className=" text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.NameIDNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>MNI:</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-10 mb-2">
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.NameType_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Name Type</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-1"></div>

                                                                                                                    <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input
                                                                                                                                type="text"
                                                                                                                                className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item?.LastName && item?.FirstName && item?.MiddleName ?
                                                                                                                                    item?.LastName + ' ' + item?.FirstName + ' ' + item?.MiddleName
                                                                                                                                    :
                                                                                                                                    item?.LastName && item?.FirstName ?
                                                                                                                                        item?.LastName + ' ' + item?.FirstName
                                                                                                                                        :
                                                                                                                                        item?.LastName && item?.MiddleName ?
                                                                                                                                            item?.LastName + ' ' + item?.MiddleName
                                                                                                                                            :
                                                                                                                                            item?.LastName ?
                                                                                                                                                item?.LastName
                                                                                                                                                :
                                                                                                                                                "", "FullName", "Table", redactingData) ? "redacted" : ""}`}
                                                                                                                                name=''
                                                                                                                                required readOnly
                                                                                                                                value={item?.LastName && item?.FirstName && item?.MiddleName ?
                                                                                                                                    item?.LastName + '  ' + item?.FirstName + '  ' + item?.MiddleName
                                                                                                                                    :
                                                                                                                                    item?.LastName && item?.FirstName ?
                                                                                                                                        item?.LastName + '  ' + item?.FirstName
                                                                                                                                        :
                                                                                                                                        item?.LastName && item?.MiddleName ?
                                                                                                                                            item?.LastName + '  ' + item?.MiddleName
                                                                                                                                            :
                                                                                                                                            item?.LastName ?
                                                                                                                                                item?.LastName
                                                                                                                                                :
                                                                                                                                                ""}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Name:</label>

                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text"
                                                                                                                                className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item.Address, "Address", "Table", redactingData) ? "redacted" : ""}`}

                                                                                                                                name='' required readOnly
                                                                                                                                value={item?.Address}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Address</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.Suffix_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Suffix</label>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.Gender_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Gender</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-1"></div>

                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text"
                                                                                                                                className={`readonlyColor ${isRedactedReport && containsKeywordInTable(getShowingWithOutTimeNew(item.DateOfBirth), "DateOfBirthFormatted", "Table", redactingData) ? "redacted" : ""}`}
                                                                                                                                name='' required readOnly
                                                                                                                                value={item.DateOfBirth ? getShowingWithOutTimeNew(item.DateOfBirth) : ''}

                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>DOB</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text"
                                                                                                                                className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item.AgeFrom, "AgeFrom", "Table", redactingData) ? "redacted" : ""}`}

                                                                                                                                name='' required readOnly
                                                                                                                                value={item?.AgeFrom > 0 ? item?.AgeFrom : ""}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Age From</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text"
                                                                                                                                className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item.AgeTo, "AgeTo", "Table", redactingData) ? "redacted" : ""}`}

                                                                                                                                name='' required readOnly
                                                                                                                                value={item?.AgeTo > 0 ? item?.AgeTo : ""}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Age To</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.AgeUnit_Decsription}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Age Unit</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text"
                                                                                                                                className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item?.SSN, "SSN", "Table", redactingData) ? "redacted" : ""}`}
                                                                                                                                name='' required readOnly
                                                                                                                                value={item?.SSN}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>SSN</label>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item?.DLNumber, "DLNumber", "Table", redactingData) ? "redacted" : ""}`}
                                                                                                                                name='' required readOnly
                                                                                                                                value={item?.DLNumber}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>DL Number</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-5 col-md-5 col-lg-5 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.NameReasonCode_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Reason Code</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-1"></div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.Hair_Color}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Hair Color</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.Eye_Color}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Eye Color</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item.Contact, "Contact", "Table", redactingData) ? "redacted" : ""}`} name='' required readOnly
                                                                                                                                value={item?.Contact}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Contact</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.HeightFrom}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Height From</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.HeightTo}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Height To</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.WeightFrom}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Weight From</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.WeightTo}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Weight To</label>
                                                                                                                        </div>
                                                                                                                    </div>


                                                                                                                    <div className="col-12">
                                                                                                                        <div className="row">
                                                                                                                            {item.NamePhoto ? (
                                                                                                                                JSON.parse(item.NamePhoto).map((photo, index) => (
                                                                                                                                    <div className="col-3 mb-1 mt-1 d-flex justify-content-center" key={index}>
                                                                                                                                        <img
                                                                                                                                            src={photo.Path}
                                                                                                                                            alt={`Image ${index + 1}`}
                                                                                                                                            className="img-fluid"
                                                                                                                                            style={{ width: "100%", height: "200px", padding: "5px" }}
                                                                                                                                        />
                                                                                                                                    </div>
                                                                                                                                ))
                                                                                                                            ) : null}
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Name)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">

                                                                                        <div className="col-12 mb-2 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Name).filter(item => item.NameType_Description === 'Business')
                                                                                                    .map((item, key) => (


                                                                                                        <div className="row  ">
                                                                                                            <h6 className=' text-dark mt-2 col-12'>Name Information Business</h6>
                                                                                                            <div className="col-2" >
                                                                                                                <div className="col-10 col-md-10 col-lg-10 mt-4 ">
                                                                                                                    <div className=" text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.NameIDNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>MNI:</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                            <div className="col-10 mb-2">
                                                                                                                <div className="row ">
                                                                                                                    <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.LastName && item?.FirstName && item?.MiddleName ?
                                                                                                                                    item?.LastName + '  ' + item?.FirstName + '  ' + item?.MiddleName
                                                                                                                                    :
                                                                                                                                    item?.LastName && item?.FirstName ?
                                                                                                                                        item?.LastName + '  ' + item?.FirstName
                                                                                                                                        :
                                                                                                                                        item?.LastName && item?.MiddleName ?
                                                                                                                                            item?.LastName + '  ' + item?.MiddleName
                                                                                                                                            :
                                                                                                                                            item?.LastName ?
                                                                                                                                                item?.LastName
                                                                                                                                                :
                                                                                                                                                ""}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Business Name:</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-1"></div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.NameType_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Name Type</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.OwnerName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Owner Name</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.OwnerPhoneNumber}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Owner Phone Number</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.OwnerFaxNumber}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Business Fax Number</label>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-6 col-md-6 col-lg-6 pt-1 mt-2 ">
                                                                                                                        <div className="text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.Contact}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Contact</label>
                                                                                                                        </div>
                                                                                                                    </div>



                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1  ">
                                                                                                                        <div className=" text-field">
                                                                                                                            <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                                value={item?.Address}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Address</label>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="container ">
                                                                                                                        {/* //--------------------------Old------------------------------? */}


                                                                                                                        <div className="col-12">
                                                                                                                            <div className="row">
                                                                                                                                {item.NamePhoto ? (
                                                                                                                                    JSON.parse(item.NamePhoto).map((photo, index) => (
                                                                                                                                        <div className="col-3 mb-1 mt-1 d-flex justify-content-center" key={index}>
                                                                                                                                            <img
                                                                                                                                                src={photo.Path}
                                                                                                                                                alt={`Image ${index + 1}`}
                                                                                                                                                className="img-fluid"
                                                                                                                                                style={{
                                                                                                                                                    width: "100%",
                                                                                                                                                    height: "200px",
                                                                                                                                                    padding: "5px"
                                                                                                                                                }}
                                                                                                                                            />
                                                                                                                                        </div>
                                                                                                                                    ))
                                                                                                                                ) : null}
                                                                                                                            </div>
                                                                                                                        </div>


                                                                                                                    </div>
                                                                                                                </div>



                                                                                                                {/* </div> */}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* property */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Property)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Property Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Property)?.map((item, key) => (
                                                                                                    <div className="row   ">
                                                                                                        <div className="col-2" >
                                                                                                            <div className="col-10 col-md-10 col-lg-10 mt-4 ">
                                                                                                                <div className=" text-field">
                                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                        value={item?.PropertyNumber}
                                                                                                                    />
                                                                                                                    <label htmlFor="" className='new-summary'>Property No.</label>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-10 mb-2">
                                                                                                            <div className="row ">
                                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.PropertyType_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Property Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.PropertyClassification_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Property Classification</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-1"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1  ">
                                                                                                                    <div className=" text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.Officer_Name}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Officer Name</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.ReportedDtTm && getShowingDateText(item.ReportedDtTm)}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Reported Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.Value}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Value</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-1"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-4 ">
                                                                                                                    <div className=" text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.PropertyLossCode_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Loss Code</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-4 ">
                                                                                                                    <div className=" text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.PossessionName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'> Possession Of</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-4 ">
                                                                                                                    <div className=" text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.PropertyCategory_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Category</label>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="container">


                                                                                                                    <div className="col-12">
                                                                                                                        <div className="row">
                                                                                                                            {item.PropertyPhoto ? (
                                                                                                                                JSON.parse(item.PropertyPhoto).map((photo, index) => (
                                                                                                                                    <div className="col-3 mb-1 mt-1 d-flex justify-content-center" key={index}>
                                                                                                                                        <img
                                                                                                                                            src={photo.Path}
                                                                                                                                            alt={`Property ${index + 1}`}
                                                                                                                                            className="img-fluid"
                                                                                                                                            style={{ width: "100%", height: "200px", padding: "5px" }}
                                                                                                                                        />
                                                                                                                                    </div>
                                                                                                                                ))
                                                                                                                            ) : null}
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* Vehicle */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.PropertyVehicle)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Vehicle Information</h6>
                                                                                        <div className="col-12 mb-2">
                                                                                            {
                                                                                                JSON.parse(obj?.PropertyVehicle
                                                                                                )?.map((item, key) => (
                                                                                                    <div className="row  px-3">
                                                                                                        <div className="col-2" >
                                                                                                            <div className="col-10 col-md-10 col-lg-10 mt-4 ">
                                                                                                                <div className=" text-field">
                                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                        value={item?.VehicleNumber}
                                                                                                                    />
                                                                                                                    <label htmlFor="" className='new-summary'>Vehicle No.</label>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-10 mb-2">
                                                                                                            <div className="row ">
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.Category_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Vehicle Category</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.PropertyClassification_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Vehicle Classification</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-4 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.Officer_Name}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-4 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.ReportedDtTm && getShowingDateText(item.ReportedDtTm)}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Reported Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.Value}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Value</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item?.StatePlateNumber, "StateVehicleNo", "Table2", redactingData) ? "redacted" : ""}`} name='' required readOnly
                                                                                                                            value={item.StatePlateNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Plate State & No.</label>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text"

                                                                                                                            className={`readonlyColor ${isRedactedReport && containsKeywordInTable(item?.VIN, "VIN", "Table2", redactingData) ? "redacted" : ""}`}
                                                                                                                            name='' required readOnly
                                                                                                                            value={item.VIN}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>VIN</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.Make_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Make</label>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.Model_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Model</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.style_Desc}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Style</label>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.PrimaryColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Primary Color</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.SecondaryColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Secondary Color</label>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.LossCode_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Loss Code</label>
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-2"></div>

                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.PlateType}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Plate Type</label>
                                                                                                                    </div>
                                                                                                                </div>


                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-3">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.PossessionName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'> Possession Of</label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>

                                                                                                            <div className="container ">




                                                                                                                <div className="col-12">
                                                                                                                    <div className="row">
                                                                                                                        {item.VehiclePhoto ? (
                                                                                                                            JSON.parse(item.VehiclePhoto).map((photo, index) => (
                                                                                                                                <div className="col-3 mb-1 mt-1 d-flex justify-content-center" key={index}>
                                                                                                                                    <img
                                                                                                                                        src={photo.Path}
                                                                                                                                        alt={`Property ${index + 1}`}
                                                                                                                                        className="img-fluid"
                                                                                                                                        style={{ width: "100%", height: "200px", padding: "5px" }}
                                                                                                                                    />
                                                                                                                                </div>
                                                                                                                            ))
                                                                                                                        ) : null}
                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>


                                                                                                        </div>
                                                                                                    </div>

                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* Arrest */}
                                                                    <div className="col-12  " >
                                                                        {
                                                                            JSON.parse(obj?.Arrest)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container ">
                                                                                        <h6 className=' text-dark mt-2'>Arrest Information</h6>

                                                                                        <div className="col-12 mb-2">
                                                                                            {
                                                                                                JSON.parse(obj?.Arrest)?.map((item, key) => (
                                                                                                    <div className="row  px-3">
                                                                                                        <div className="col-2" >
                                                                                                            <div className="col-12 col-md-12 col-lg-12 mt-4 ">
                                                                                                                <div className=" text-field">
                                                                                                                    <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                        value={item?.ArrestNumber}
                                                                                                                    />
                                                                                                                    <label htmlFor="" className='new-summary'>Arrest No.</label>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                        <div className="col-10 mb-2">
                                                                                                            <div className="row ">
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.Agency_Name}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Agency Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.Arrestee_Name}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Arrestee Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item.ArrestDtTm && getShowingDateText(item.ArrestDtTm)}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Arrest Date/Time</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.Supervisor_Name}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Supervisor Name</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.ArrestType}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Arrest Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-2"></div>
                                                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                                            value={item?.PrimaryOfficer}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Primary Officer</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="container ">

                                                                                                                    <div className="col-12">
                                                                                                                        <div className="row">
                                                                                                                            {item.ArrestPhoto ? (
                                                                                                                                JSON.parse(item.ArrestPhoto).map((photo, index) => (
                                                                                                                                    <div className="col-3 mb-1 mt-1 d-flex justify-content-center" key={index}>
                                                                                                                                        <img
                                                                                                                                            src={photo.Path}
                                                                                                                                            alt={`Property ${index + 1}`}
                                                                                                                                            className="img-fluid"
                                                                                                                                            style={{ width: "100%", height: "200px", padding: "5px" }}
                                                                                                                                        />
                                                                                                                                    </div>
                                                                                                                                ))
                                                                                                                            ) : null}
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                </div>

                                                                                                            </div>

                                                                                                        </div>
                                                                                                    </div>

                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    <div className="conatiner  mb-1">
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                }

                                            </div>
                                        </>
                                    )}

                                </div>

                            </div>
                        </div>
                    </>

                )

            }


        </>

    )
}

export default CurrentIncMasterReport