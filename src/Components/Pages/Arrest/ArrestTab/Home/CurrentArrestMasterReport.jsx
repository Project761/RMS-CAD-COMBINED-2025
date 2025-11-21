import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { fetchPostData } from '../../../../hooks/Api';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ReportAddress from '../../../ReportAddress/ReportAddress';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime } from '../../../../Common/Utility';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';
const CurrentArrestMasterReport = (props) => {

    const dispatch = useDispatch();
    const componentRef = useRef();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const ipAddress = sessionStorage.getItem('IPAddress');
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);
    const { printIncReport, setIncMasterReport, IncReportCount, setIncReportCount, ArrestNumber, showModalReport, setshowModalReport } = props

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
        if (LoginAgencyID) {
            getAgencyImg(LoginAgencyID);
            getpPropertyImg();
        }
    }, [LoginAgencyID]);

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

    const getpPropertyImg = (propertyID, masterPropertyID) => {
        const val = { 'PropertyID': propertyID, 'MasterPropertyID': masterPropertyID, }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setPropertyPhoto(imgUrl);
            }
            else { console.log("errror") }
        })
    }

    useEffect(() => {
        if (masterReportData?.Charge?.length > 0) {
            setverifyIncident(true);
        }
    }, [masterReportData]);

    const isNotEmpty = (value) => {
        return value !== null && value.trim() !== '';
    }

    const getIncidentSearchData = async () => {
        setLoder(true); setIsLoading(true);

        const val = {
            'ArrestNumber': ArrestNumber, 'IncidentNumberTo': '', 'ReportedDate': '', 'ReportedDateTo': '', 'OccurredFrom': '', 'OccurredTo': '', 'AgencyID': LoginAgencyID, 'FBIID': '', 'RMSCFSCodeList': '', 'Location': '',
            'IPAddress': '',
            'UserID': loginPinID,
            'SearchCriteria': '',
            'SearchCriteriaJson': '',
            'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1,
            'Status': '',
            'ModuleName': effectiveScreenPermission[0]?.ScreenCode1,
            'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
        }
        try {
            const apiUrl = 'ArrestReport/GetData_ArrestReport';
            const res = await fetchPostData(apiUrl, val);
            if (res.length > 0) {
                setIncidentData(res[0].Incident);
                setMasterReportData(res[0]);
                getpPropertyImg(masterPropertyID, propertyID);
                getAgencyImg(LoginAgencyID); setIsLoading(false);


            } else {
                setIncidentData([]);
                setverifyIncident(false); setIsLoading(false);

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
            setLoder(true);
            setShowFooter(true);
        },
        onAfterPrint: () => {
            setLoder(false);
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


    return (
        <>
            {
                showModalReport && (
                    <>

                        <div class="modal " style={{ background: "rgba(0,0,0, 0.5)" }} id="QueueReportsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">

                            <div className=" pt-2 modal-xl m-auto " >
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
                                        Arrest Master Report
                                    </p>

                                    <div style={{ marginLeft: 'auto' }}>
                                        <span onClick={() => { setIncMasterReport(true); printForm(); setIncReportCount(IncReportCount + 1) }} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            <i className="fa fa-print"  > Print</i>
                                        </span>

                                        <button
                                            className="btn btn-sm btn-danger px-2 py-0"
                                            onClick={() => {
                                                setshowModalReport(false);
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
                                            <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }} >
                                                <>
                                                    <ReportAddress {...{ multiImage, masterReportData }} />
                                                </>
                                                {showWatermark && (
                                                    <div className="watermark-print">Confidential</div>
                                                )}
                                                <div className="col-12">
                                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                    <h5 className="text-center text-white text-bold bg-green  py-1" >Arrest Master Report</h5>

                                                </div>
                                                <div className="container mt-1" style={{ pageBreakAfter: 'always' }}>
                                                    <div className="col-12">

                                                        {
                                                            masterReportData?.Charge?.length > 0 ?
                                                                <>
                                                                    {
                                                                        masterReportData?.Charge?.map((obj) => (
                                                                            <>
                                                                                <h5 className=" text-white text-bold bg-green py-1 px-3 text-center"> Arrest #:- {obj.ArrestNumber}</h5>

                                                                                {/* name */}
                                                                                <div className="col-12  ">

                                                                                    <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                                        <h6 className=' text-dark mt-2'>Name Information</h6>

                                                                                        <div className="col-12 mb-2 ">

                                                                                            <div className="row px-3 ">
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.NameIDnumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Name ID#</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-8 col-md-8 col-lg-8 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly

                                                                                                            value={obj?.Arrestee_Name
                                                                                                            }

                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Name:</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.Suffix}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Suffix</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.DateOfBirth && getShowingWithOutTime(obj?.DateOfBirth)}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>DOB</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.AgeFrom}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Age</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.AgeUnit_Decsription}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Age Unit</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6col-lg-6 mt-2 pt-1  ">
                                                                                                    <div className=" text-field">
                                                                                                        <textarea rows={1} type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.Address} style={{ resize: 'none' }}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Address</label>
                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.Race_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Race</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.Gender}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Gender</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-4">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                            value={obj?.HeightFrom != null || obj?.HeightTo != null
                                                                                                                ? `${obj.HeightFrom || ''}-${obj.HeightTo || ''}`.replace(/-$/, '')
                                                                                                                : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Height</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 col-md-2 col-lg-2 mt-4">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DOB' required readOnly
                                                                                                            value={obj?.WeightFrom != null || obj?.WeightTo != null
                                                                                                                ? `${obj.WeightFrom || ''}-${obj.WeightTo || ''}`.replace(/-$/, '')
                                                                                                                : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Weight</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.EyeColor_Description}

                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Eye Color</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.HairColor_Description
                                                                                                            }

                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Hair Color</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.Resident_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Resident</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.SSN}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>SSN</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.Ethnicity_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Ethnicity</label>
                                                                                                    </div>
                                                                                                </div>



                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.DLNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>DL#</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={JSON.parse(obj?.State)[0]?.IdentificationNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>State#</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            // value={item?.DLNumber}
                                                                                                            value={JSON.parse(obj?.Jacket)[0]?.IdentificationNumber}

                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Jacket#</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={JSON.parse(obj?.FBI)[0]?.IdentificationNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>FBI#</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.BirthPlace}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Birth Place</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            value={obj?.BINationality
                                                                                                            }
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Nationality</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='' required readOnly
                                                                                                            // value={item?.DLNumber}
                                                                                                            value={obj?.MaritalStatus_Description}

                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Maritial Status</label>
                                                                                                    </div>
                                                                                                </div>


                                                                                            </div>


                                                                                        </div>

                                                                                    </div>


                                                                                </div >
                                                                                {/* arrest */}
                                                                                <div className="col-12  ">
                                                                                    <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                                        <div className="col-12 mb-2">
                                                                                            <h6 className=' text-dark mt-2 bb'>Arrest Information</h6>
                                                                                            <div className="row px-3" >

                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.ArrestDtTm ? getShowingDateText(obj?.ArrestDtTm) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Arrest Date/Time</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.Arrestee_Name}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Arrestee</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.Agency_Name}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Arrest Agency</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.ArrestType_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Arrest Type</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.IncidentNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Incident Number</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-4">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly

                                                                                                            value={obj?.ReportedDate ? getShowingDateText(obj?.ReportedDate) : ''}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Reported Date/Time</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-3 col-md-3 col-lg-3 mt-4">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.Supervisor_Name}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Supervisor</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-9 col-md-9 col-lg-9 mt-4">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.Address}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Incident Location</label>
                                                                                                    </div>
                                                                                                </div>



                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* Rights-info */}
                                                                                <div className="col-12  ">
                                                                                    <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                                        <h6 className=' text-dark mt-2 bb'>Rights Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            <div className="row bb px-3 mb-2">
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.RightsGiven}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Rights Given</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.GivenBy_Name}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Given By</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.PrimaryOfficer_Name}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Primary Officer</label>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                {/* Juvenile Disposition-info */}
                                                                                <div className="col-12  ">
                                                                                    <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                                        <h6 className=' text-dark mt-2 bb'>Juvenile Disposition</h6>
                                                                                        <div className="col-12 ">
                                                                                            <div className="row bb px-3 mb-2">
                                                                                                <div className="col-8 col-md-8 col-lg-10 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.JuvenileDisposition_Desc}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Disposition</label>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-2 mt-2">
                                                                                                    <div className='text-field'>
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.PhoneNo}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Phone No.</label>
                                                                                                    </div>
                                                                                                </div>


                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>


                                                                                <div className="col-12" >
                                                                                    {
                                                                                        JSON.parse(obj?.Charge)?.length > 0 && JSON.parse(obj?.NameAliases)?.length > 0 ? (
                                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                <h6 className='text-dark mt-2'>Alias Name Information:</h6>
                                                                                                <div className="col-12">
                                                                                                    <table className="table table-bordered">
                                                                                                        <thead className='text-dark master-table'>
                                                                                                            <tr>
                                                                                                                <th className=''>Alias Name</th>
                                                                                                                <th className=''>Alias DOB</th>
                                                                                                                <th className=''>Alias SSN</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody className='master-tbody'>
                                                                                                            {
                                                                                                                JSON.parse(obj?.NameAliases)?.map((item, key) => (
                                                                                                                    <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                                        <td>{item.LastName}</td>
                                                                                                                        <td>{item.DOB ? getShowingDateText(item.DOB) : ''}</td>
                                                                                                                        <td>{item.AliasSSN}</td>
                                                                                                                    </tr>
                                                                                                                ))
                                                                                                            }
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : null
                                                                                    }
                                                                                </div>
                                                                                {/* court */}
                                                                                < div className="col-12  " >
                                                                                    {

                                                                                        JSON.parse(obj?.ArrestCourtInformation)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2'>Court Information</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.ArrestCourtInformation)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Name}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Name</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.DocketID}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Docket ID</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.CourtName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Court Name</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.StateName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Court State</label>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.CityName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Court City</label>
                                                                                                                        </div>
                                                                                                                    </div>


                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.JudgeName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Judge Name</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.PleaDescription}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Plea </label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item?.PleaDateTime ? getShowingDateText(item?.PleaDateTime) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Plea Date/Time</label>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item?.Prosecutor}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Prosecutor</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4  mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item?.Attorney}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Attorney</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item?.AppearDateTime ? getShowingDateText(item?.AppearDateTime) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Appear Date/Time</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.CourtAppearDescription}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Court Appear Reason</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                                        <div className=''>
                                                                                                                            <input
                                                                                                                                type="checkbox"
                                                                                                                                name=""
                                                                                                                                id=""
                                                                                                                                checked={item && Object.keys(item).length > 0 ? item.IsRescheduled : false}
                                                                                                                                disabled={!item || Object.keys(item).length === 0}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary pl-2'>Rescheduled</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                                        <div className=''>
                                                                                                                            <input
                                                                                                                                type="checkbox"
                                                                                                                                name=""
                                                                                                                                id=""
                                                                                                                                checked={item && Object.keys(item).length > 0 ? item.IsContinued : false}
                                                                                                                                disabled={!item || Object.keys(item).length === 0}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary pl-2'>Continued</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                                        <div className=''>
                                                                                                                            <input
                                                                                                                                type="checkbox"
                                                                                                                                name=""
                                                                                                                                id=""
                                                                                                                                checked={item && Object.keys(item).length > 0 ? item.IsAppearRequired : false}
                                                                                                                                disabled={!item || Object.keys(item).length === 0}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary pl-2'>Appear Required</label>

                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                                                        <div className=''>
                                                                                                                            <input
                                                                                                                                type="checkbox"
                                                                                                                                name=""
                                                                                                                                id=""
                                                                                                                                checked={item && Object.keys(item).length > 0 ? item.IsDismissed : false}
                                                                                                                                disabled={!item || Object.keys(item).length === 0}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary pl-2'>Dismissed</label>

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
                                                                                </div>
                                                                                <div className="col-12" >
                                                                                    <div className="table-responsive">
                                                                                        {
                                                                                            JSON.parse(obj?.Charge)?.length > 0 && JSON.parse(obj?.ArrestProperty)?.length > 0 ? (
                                                                                                <>
                                                                                                    <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                                        <h5 className='text-dark mt-2'>Property Information:</h5>

                                                                                                        <table className="table table-bordered">
                                                                                                            <thead className='text-dark master-table'>
                                                                                                                <tr>
                                                                                                                    <th className=''>Property Number</th>
                                                                                                                    <th className=''>Type</th>
                                                                                                                    <th className=''>Classification</th>
                                                                                                                    <th className=''>Value</th>
                                                                                                                    <th className=''>Reason</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody className='master-tbody'>
                                                                                                                {
                                                                                                                    JSON.parse(obj?.ArrestProperty)?.map((item, key) => (
                                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                                            <td>{item.PropertyNumber}</td>
                                                                                                                            <td>{item.PropertyType_Description}</td>
                                                                                                                            <td>{item.Classification_Desc}</td>
                                                                                                                            <td>{item.Value}</td>
                                                                                                                            <td>{item.PropertyLossCode_Description}</td>
                                                                                                                        </tr>
                                                                                                                    ))
                                                                                                                }
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <></>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                {/* ------------------------VEHICLE --------------------*/}
                                                                                <div className="col-12" >

                                                                                    < div className="table-responsive" >

                                                                                        {
                                                                                            JSON.parse(obj?.Charge)?.length > 0 && JSON.parse(obj?.ArrestVehicle)?.length > 0 ? (
                                                                                                <>
                                                                                                    <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                                        <h5 className=' text-dark mt-2' >Vehicle Information:</h5>
                                                                                                        <table className="table table-bordered">
                                                                                                            <thead className='text-dark master-table'>
                                                                                                                <tr>
                                                                                                                    <th className=''>Vehicle Number</th>
                                                                                                                    <th className=''>Category</th>
                                                                                                                    <th className=''>Classification</th>
                                                                                                                    <th className=''>Value</th>
                                                                                                                    <th className=''>Reason</th>
                                                                                                                </tr>
                                                                                                            </thead>
                                                                                                            <tbody className='master-tbody'>
                                                                                                                {
                                                                                                                    JSON.parse(obj?.ArrestVehicle)?.map((item, key) => (
                                                                                                                        <>
                                                                                                                            <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                                                <td>{item.PropertyNumber}</td>
                                                                                                                                <td>{item.Category_Description}</td>
                                                                                                                                <td>{item.Classification_Description}</td>
                                                                                                                                <td>{item.Value}</td>
                                                                                                                                <td>{item.PropertyLossCode_Description}</td>

                                                                                                                            </tr>
                                                                                                                        </>
                                                                                                                    ))
                                                                                                                }
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </div>
                                                                                                </>
                                                                                            ) : (
                                                                                                <></>
                                                                                            )
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                {/* ArrestCriminalActivity */}
                                                                                < div className="col-12  " >
                                                                                    {

                                                                                        JSON.parse(obj?.ArrestCriminalActivity)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2'>Criminal Activity</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.ArrestCriminalActivity)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.CriminalActivity_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Criminal Activity</label>
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
                                                                                </div>


                                                                                {/* naartive */}
                                                                                <div className="col-12  " >
                                                                                    {
                                                                                        JSON.parse(obj?.ArrestNarrative)?.length > 0 ?
                                                                                            <>
                                                                                                {
                                                                                                    JSON.parse(obj?.ArrestNarrative)?.map((item, key) => (
                                                                                                        <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                                            <div className="col-12">
                                                                                                                <h6 className=' text-dark mt-2'>Narratives</h6>
                                                                                                                <div className="row  mb-2 px-3" >
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.ReportedBy_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Reported By</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Narrative_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Narrative Type/Report Type</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.NarrativeDtTm ? getShowingDateText(obj.NarrativeDtTm) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Date/Time</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                                        <div>
                                                                                                                            <label htmlFor="" className='new-summary'>Narrative</label>
                                                                                                                            <div
                                                                                                                                className="readonlyColor text-justify"
                                                                                                                                style={{
                                                                                                                                    border: '1px solid #ccc',
                                                                                                                                    borderRadius: '4px',
                                                                                                                                    padding: '10px',
                                                                                                                                    minHeight: '100px',
                                                                                                                                    backgroundColor: '#f9f9f9', // Light background for readability
                                                                                                                                    overflowY: 'auto', // Allows scrolling if content overflows
                                                                                                                                }}
                                                                                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.CommentsDoc) }}
                                                                                                                            />
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    ))
                                                                                                }
                                                                                            </>
                                                                                            :
                                                                                            <></>
                                                                                    }


                                                                                    {
                                                                                        JSON.parse(obj?.Smt)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                                    <h6 className='text-dark mt-2'>SMT Info:</h6>
                                                                                                    <div className="col-12">
                                                                                                        {
                                                                                                            JSON.parse(obj?.Smt)?.map((item, key) => (
                                                                                                                <div key={key} className="row bb mb-2">
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input
                                                                                                                                type="text"
                                                                                                                                className='readonlyColor'
                                                                                                                                name='DocFileName'
                                                                                                                                required
                                                                                                                                readOnly
                                                                                                                                value={item.SMTType_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>SMT Type</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input
                                                                                                                                type="text"
                                                                                                                                className='readonlyColor'
                                                                                                                                name='DocFileName'
                                                                                                                                required
                                                                                                                                readOnly
                                                                                                                                value={item.SMTLocation_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>SMT Location</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input
                                                                                                                                type="text"
                                                                                                                                className='readonlyColor'
                                                                                                                                name='DocFileName'
                                                                                                                                required
                                                                                                                                readOnly
                                                                                                                                value={item.SMT_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Description</label>
                                                                                                                        </div>
                                                                                                                    </div>


                                                                                                                    <div className="col-12">
                                                                                                                        <div className="row mt-1">
                                                                                                                            {
                                                                                                                                JSON.parse(item.SMTPhoto)?.map((photo, index) => (
                                                                                                                                    <div key={index} className="col-3 mb-3">
                                                                                                                                        <img
                                                                                                                                            src={photo.Path}
                                                                                                                                            className=''
                                                                                                                                            alt={`Image ${index}`}
                                                                                                                                        />
                                                                                                                                    </div>
                                                                                                                                ))
                                                                                                                            }
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


                                                                                    {
                                                                                        JSON.parse(obj?.ArrestPhoto)?.length > 0 ? (
                                                                                            <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                                <h6 className='text-dark mt-2'>Mug Shot Images:</h6>
                                                                                                <div className="col-12 mb-2">
                                                                                                    <div className="row">
                                                                                                        {obj.ArrestPhoto ? (
                                                                                                            JSON.parse(obj.ArrestPhoto).map((Photo, index) => (
                                                                                                                <div key={index} className="col-3 mb-3 d-flex justify-content-center">
                                                                                                                    <img
                                                                                                                        src={Photo.Photo}
                                                                                                                        alt={`Mug shot ${index + 1}`}
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
                                                                                        ) : null
                                                                                    }

                                                                                </div>
                                                                                {/* juvenile  */}
                                                                                <div className="col-12  " >
                                                                                    {

                                                                                        JSON.parse(obj?.ArrestJuvenile)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2'>Juvenile Information</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.ArrestJuvenile)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.ParentName}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Parent/Guardian</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item?.ParentContactDtTm ? getShowingDateText(item?.ParentContactDtTm) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'> Parent Contacted Date</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.ContactBy}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Contacted By</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <textarea rows={1} type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.ParentAddress} style={{ resize: 'none' }}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Parent Address</label>
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
                                                                                </div>


                                                                                {/* police */}
                                                                                <div className="col-12  " >
                                                                                    {
                                                                                        // JSON.parse(obj?.ArrestPoliceForce)?.map((item, key) => (
                                                                                        JSON.parse(obj?.Charge)?.length > 0 && JSON.parse(obj?.ArrestPoliceForce)?.length > 0 ? (
                                                                                            <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                <h6 className=' text-dark mt-2'>Police Force:</h6>
                                                                                                <div className="col-12 ">
                                                                                                    <table className="table table-bordered">
                                                                                                        <thead className='text-dark master-table'>
                                                                                                            <tr>
                                                                                                                <th className=''>Officer Name</th>
                                                                                                                <th className=''>Description</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody className='master-tbody'>
                                                                                                            {
                                                                                                                JSON.parse(obj?.ArrestPoliceForce)?.map((item, key) => (
                                                                                                                    <>
                                                                                                                        <tr key={key} style={{ borderBottom: '0.2px solid gray' }}>
                                                                                                                            <td>{item.Officer_Name}</td>
                                                                                                                            <td>{item.ArrPoliceForce_Description}</td>

                                                                                                                        </tr>
                                                                                                                    </>
                                                                                                                ))
                                                                                                            }
                                                                                                        </tbody>
                                                                                                    </table>

                                                                                                </div>
                                                                                            </div>
                                                                                        ) : null
                                                                                    }
                                                                                </div>

                                                                                {/* charge */}
                                                                                <div className="col-12  ">
                                                                                    {

                                                                                        JSON.parse(obj?.Charge)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #ddd' }}>
                                                                                                    <h6 className=' text-dark mt-2'>Charge Information</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.Charge)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Name}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Name</label>
                                                                                                                        </div>
                                                                                                                    </div>

                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.IncidentNumber}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Incident #</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.ArrestNumber}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Arrest #</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.NIBRS_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>TIBRS Code</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.ChargeCode_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Offense Code/Nmae</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.UCRClear_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>UCR Clear</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Count}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Count</label>
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
                                                                                </div>

                                                                                {/* Penalties-info */}
                                                                                {/* <div className="col-12  ">
                                                                                    {
                                                                                        JSON.parse(obj?.Charge)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container " style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2 bb'>Penalties</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.Charge)?.map((item, key) => (
                                                                                                                <div className="row bb px-3 mb-2">
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Fine}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Fine</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.CourtCost}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Court Cost</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.OtherCost}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Other Cost</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.FTADate ? getShowingWithOutTime(item.FTADate) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>FTA Date</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.FTAAmount}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>FTA Amount</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.LitigationTax}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Litigation Tax</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.TotalPenalty}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Total Penalty</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Years}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Years</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Months}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Months</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Days}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Days</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                                        <div>
                                                                                                                            <label htmlFor="" className='new-summary'>Comments</label>
                                                                                                                            <div
                                                                                                                                className="readonlyColor text-justify"
                                                                                                                                style={{
                                                                                                                                    border: '1px solid #ccc',
                                                                                                                                    borderRadius: '4px',
                                                                                                                                    padding: '10px',
                                                                                                                                    minHeight: '100px',
                                                                                                                                    backgroundColor: '#f9f9f9',
                                                                                                                                    overflowY: 'auto',
                                                                                                                                }}
                                                                                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.Comments) }}
                                                                                                                            />
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
                                                                                </div> */}


                                                                                {/* ChargeCourtDisposition  */}
                                                                                <div className="col-12  " >
                                                                                    {

                                                                                        JSON.parse(obj?.ChargeCourtDisposition)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2'>Court Disposition Information</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.ChargeCourtDisposition)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item?.DispositionDtTm ? getShowingDateText(obj?.DispositionDtTm) : ''}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Disposition Date/Time</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-8 col-md-8 col-lg-8 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item?.ExceptionalClearance}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Exceptional Clearance</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.CourtDispostion}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Court Disposition</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">

                                                                                                                        <div>
                                                                                                                            <label htmlFor="" className='new-summary'>Comments</label>
                                                                                                                            <div
                                                                                                                                className="readonlyColor text-justify"
                                                                                                                                style={{
                                                                                                                                    border: '1px solid #ccc',
                                                                                                                                    borderRadius: '4px',
                                                                                                                                    padding: '10px',
                                                                                                                                    minHeight: '100px',
                                                                                                                                    backgroundColor: '#f9f9f9',
                                                                                                                                    overflowY: 'auto',
                                                                                                                                }}
                                                                                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Comments) }}
                                                                                                                            />
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
                                                                                </div>
                                                                                {/* ChargeComment  */}
                                                                                < div className="col-12  " >
                                                                                    {

                                                                                        JSON.parse(obj?.ArrestChargeComments)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2'>Comment Information</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.ArrestChargeComments)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-12 col-md-6 col-lg-6 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Officer_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Reported By</label>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                                        <div>
                                                                                                                            <label htmlFor="" className='new-summary'>Notes</label>
                                                                                                                            <div
                                                                                                                                className="readonlyColor text-justify"
                                                                                                                                style={{
                                                                                                                                    border: '1px solid #ccc',
                                                                                                                                    borderRadius: '4px',
                                                                                                                                    padding: '10px',
                                                                                                                                    minHeight: '100px',
                                                                                                                                    backgroundColor: '#f9f9f9', // Light background for readability
                                                                                                                                    overflowY: 'auto', // Allows scrolling if content overflows
                                                                                                                                }}
                                                                                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.CommentsDoc) }}
                                                                                                                            />
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
                                                                                </div>
                                                                                {/* ChargeWeapon  */}
                                                                                < div className="col-12  " >
                                                                                    {

                                                                                        JSON.parse(obj?.ChargeWeapon)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2'>Weapon Information</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.ChargeWeapon)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Weapon_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Weapon</label>
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
                                                                                </div>
                                                                                {/* ChargeOffense  */}
                                                                                < div className="col-12  " >
                                                                                    {

                                                                                        JSON.parse(obj?.ChargeOffense)?.length > 0 ?
                                                                                            <>
                                                                                                <div className="container bb" style={{ border: '1px solid #80808085', }}>
                                                                                                    <h6 className=' text-dark mt-2'>Offense Information</h6>
                                                                                                    <div className="col-12 ">
                                                                                                        {
                                                                                                            JSON.parse(obj?.ChargeOffense)?.map((item, key) => (
                                                                                                                <div className="row  px-3 bb mb-2" >
                                                                                                                    <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                                        <div className='text-field'>
                                                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                value={item.Offense_Description}
                                                                                                                            />
                                                                                                                            <label htmlFor="" className='new-summary'>Offense</label>
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
                                                                                </div>

                                                                            </>
                                                                        ))
                                                                    }
                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                                {showFooter && (
                                                    <div className="print-footer">
                                                        <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                                    </div>
                                                )}
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

export default CurrentArrestMasterReport