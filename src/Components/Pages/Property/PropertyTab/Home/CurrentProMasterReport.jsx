import React, { useContext, useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime, getYearWithOutDateTime } from '../../../../Common/Utility';
import { fetchPostData } from '../../../../hooks/Api';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import ReportAddress from '../../../ReportAddress/ReportAddress';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Link } from 'react-router-dom';

const MasterPropertyReport = (props) => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const ipAddress = sessionStorage.getItem('IPAddress');
    const { printIncReport, setIncMasterReport, IncReportCount, setIncReportCount, PropertyNumber, showModal, setShowModal } = props
    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);

    const [multiImage, setMultiImage] = useState([]);
  
    const [verifyReport, setverifyReport] = useState(false);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const [PropertyPhoto, setPropertyPhoto] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginUserName(localStoreData?.UserName)
            setloginPinID(parseInt(localStoreData?.PINID));
           
        }
    }, [localStoreData]);

    useEffect(() => {
        if (masterReportData?.length > 0) {
            setverifyReport(true);
        }
    }, [masterReportData]);


    const componentRef = useRef();


    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoder(true);
            setShowFooter(true);
        },
        onAfterPrint: () => {
            setLoder(false);
            setShowFooter(false);
        }
    });

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

    const get_PropertyReport = async () => {
        setLoder(true); setIsLoading(true)
        const val = {
            'PropertyNumber': PropertyNumber, 'AgencyID': LoginAgencyID,
            'UserID': loginPinID, 'SearchCriteria': '',
            'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1,
            'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1,
            'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
        }
        try {
            const apiUrl = 'ReportProperty/GetData_ReportProperty';
            const res = await fetchPostData(apiUrl, val);
            
            if (res.length > 0) {
                console.log("🚀 ~ getIncidentSearchData ~ res:", res);
                
                setMasterReportData(res[0]);
                
                getAgencyImg(LoginAgencyID); setIsLoading(false)
            } else {
                
            
                setIsLoading(false)
            }
        } catch (error) {
            console.log("🚀 ~ getIncidentSearchData ~ error:", error);

        }
    }

    useEffect(() => {
        if (masterReportData?.Property?.length > 0) {
        
        
        }
    }, [masterReportData]);

    useEffect(() => {
        if (printIncReport) {
            get_PropertyReport();
        }
    }, [printIncReport, IncReportCount])

    return (
        <>
            {
                showModal && (
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
                                        Master Property Report
                                    </p>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <span onClick={() => { setIncMasterReport(true); printForm(); setIncReportCount(IncReportCount + 1) }} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
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
                                            <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }} >
                                                <>
                                                    <ReportAddress {...{ multiImage, masterReportData }} />
                                                </>
                                                <div className="col-12">
                                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                    <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Master Property Report</h5>
                                                </div>

                                                {
                                                    masterReportData?.Property?.length > 0 ?
                                                        <>
                                                            {
                                                                masterReportData?.Property?.map((obj) => (
                                                                    <>
                                                                        <div className="col-12">
                                                                            <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                                        </div>
                                                                        <div className="container-fluid" style={{ pageBreakAfter: 'always', border: '1px solid #80808085', }}>
                                                                            <h5 className=" text-white text-bold bg-green text-center py-1 px-3">Property Information:{obj?.PropertyNumber}</h5>
                                                                            <div className="col-12 bb mt-2" >
                                                                                <div className="row px-3 mb-1" >
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                        <div className='text-field'>
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.PropertyNumber}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Property Number</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-8 col-md-8 col-lg-8 mt-2">
                                                                                        <div className='text-field'>
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.PropertyType_Description}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Property Type</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className='text-field'>
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.ReportedDtTm ? getShowingDateText(obj.ReportedDtTm) : ''}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Reported Date/Time</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1">
                                                                                        <div className='text-field'>
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.Value}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Value</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                value={obj.PossessionOf_Name}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>In Possession Of</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.PropertyCategory_Description}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Category</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                value={obj.PropertyClassification_Description}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Classification</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                        <div className="text-field">
                                                                                            <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                value={obj.Officer_Name}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Primary Officer</label>

                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-12 col-md-12 col-lg-6 mt-2">
                                                                                        <div className='text-field'>
                                                                                            <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                value={obj.PropertyLossCode_Description}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary'>Loss Code</label>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                        <div className=''>
                                                                                          
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                checked={obj?.IsEvidence || false}
                                                                                                disabled={!obj}
                                                                                            />
                                                                                            <label htmlFor="" className='new-summary pl-2'>Is Evidence</label>

                                                                                        </div>
                                                                                    </div>


                                                                                </div>
                                                                            </div>
                                                                            {/* Miscellaneous Information */}
                                                                            <div className="col-12  ">
                                                                                <div className="container ">
                                                                                    <h6 className=' text-dark mt-2'>Miscellaneous Information
                                                                                    </h6>
                                                                                    <div className="col-12 ">
                                                                                        <div className="row bb px-3 mb-2">
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                <div className="text-field">
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.PropertyTag}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Tag #</label>

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                <div className="text-field">
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.NICB}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>NICB #</label>

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                <div className="text-field">
                                                                                                    <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.DestroyDtTm}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Destroy Date/Time</label>

                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                                <div className='text-field'>
                                                                                                    <textarea rows={2} type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                        value={obj.Description} style={{ resize: 'none' }}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary'>Description</label>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="col-6 col-md-6 col-lg-3 mt-2 ">
                                                                                                <div className=''>
                                                                                                    <input
                                                                                                        type="checkbox"
                                                                                                        name=""
                                                                                                        id=""
                                                                                                        checked={obj && Object.keys(obj).length > 0 ? obj.IsSendToPropertyRoom : false}
                                                                                                        disabled={!obj || Object.keys(obj).length === 0}
                                                                                                    />
                                                                                                    <label htmlFor="" className='new-summary pl-2'>Is Send To Property Room</label>

                                                                                                </div>
                                                                                            </div>



                                                                                        </div>
                                                                                    </div>
                                                                                </div>

                                                                            </div>


                                                                            {/* Article */}
                                                                            <div className="col-12 bb ">
                                                                                {
                                                                                    JSON.parse(obj?.Article)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container ">
                                                                                                <h6 className=' text-dark mt-2'>Article Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.Article)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">


                                                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SerialID}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Serial No.</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Quantity}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Quantity</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Brand}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Brand</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.ModelID}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Model No.</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.TopColor_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.BottomColor_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.OAN}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>OAN No.</label>

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


                                                                            {/* Boat */}
                                                                            <div className="col-12  bb" >
                                                                                {
                                                                                    JSON.parse(obj?.Boat)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Boat Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.Boat)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Registration_StateName}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Registration State</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.RegistrationNumber}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Registration Number</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Make_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Make</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Model_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Model</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.HIN}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>HIN</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.VOD_Desc}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>VOD</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Propulusion_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Propulation</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.TopColor_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.BottomColor_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Length}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Length</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item?.RegistrationExpiryDtTm ? getYearWithOutDateTime(item?.RegistrationExpiryDtTm) : null}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Registration Expiry</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                                           
                                                                                                                            <label htmlFor="" className='new-summary'>Comments</label>

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
                                                                            {/* Drug */}
                                                                            <div className="col-12  bb">
                                                                                {
                                                                                    JSON.parse(obj?.Drug)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Drug Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.Drug)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SuspectedDrugType_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Suspected Drug Type</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.PropertySourceDrugType_Desc}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Property Source Drug Type</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.EstimatedDrugQty}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Estimate Drug Qty</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.FractionDrugQty}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Fraction Drug Qty</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.MeasurementType_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Measurement Type</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SolidPounds}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Solid Pounds</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SolidOunces}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Solid Ounces</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SolidGrams}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Solid Grams</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.LiquidOunces}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Liquid Ounces</label>

                                                                                                                            </div>
                                                                                                                        </div>

                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.DoseUnits}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Dose Units</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item?.Items}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Items</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item?.MarijuanaType_Desc}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Type Marijuana Fields and Gardens</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item?.NumLabs}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Number Of Clandestine Labs Seized</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item?.NumFields}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Number Marijuana Fields and Gardens</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item?.DrugManufactured_Desc}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Type of Drug Manufactured</label>

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
                                                                            {/* Other */}
                                                                            <div className="col-12  bb" >
                                                                                {
                                                                                    JSON.parse(obj?.Other)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Other Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.Other)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Brand}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Brand</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SerialID}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Serial ID</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.TopColor_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.BottomColor_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.ModelID}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Model ID</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Quantity}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Quantity</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.QuantityUnit}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Quantity Unit</label>

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


                                                                            {/* Security */}
                                                                            <div className="col-12  bb" >
                                                                                {
                                                                                    JSON.parse(obj?.Security)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Security Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.Security)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Denomination}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Denomination</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.IssuingAgency}
                                                                                                                                />

                                                                                                                                <label htmlFor="" className='new-summary'>Issuing Agency</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.MeasureType}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Measure Type</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SecurityDtTm ? getShowingWithOutTime(item.SecurityDtTm) : ''}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Security Date</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.SerialID}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Serial ID</label>

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
                                                                            {/* Weapon */}
                                                                            <div className="col-12  bb" >
                                                                                {
                                                                                    JSON.parse(obj?.weapon)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Weapon Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.weapon)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Style}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Style</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Finish}
                                                                                                                                />

                                                                                                                                <label htmlFor="" className='new-summary'>Finish</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Caliber}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Caliber</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Handle}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Handle</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.WeaponMake_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Weapon Make</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.PropertyModel_Description}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Weapon Model</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.ManufactureYear}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Manufacture Year</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.BarrelLength}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Barrel Length</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                                                            <div className=''>
                                                                                                                               
                                                                                                                                <input
                                                                                                                                    type="checkbox"
                                                                                                                                    checked={item?.IsAuto || false}
                                                                                                                                    disabled={!item}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary pl-2'>Is Auto</label>

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
                                                                            {/* property notes */}
                                                                            <div className="col-12  bb">
                                                                                {
                                                                                    JSON.parse(obj?.PropertyNotes)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Property Notes Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.PropertyNotes)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">

                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.OfficerName}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                            <label htmlFor="" className='new-summary'>Property Notes</label>

                                                                                                                            <div
                                                                                                                                className="readonlyColor  "
                                                                                                                                style={{
                                                                                                                                    border: '1px solid #ccc',
                                                                                                                                    borderRadius: '4px',
                                                                                                                                    padding: '10px',
                                                                                                                                    backgroundColor: '#f9f9f9',
                                                                                                                                    lineBreak: 'anywhere'
                                                                                                                                }}
                                                                                                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Notes) }}

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
                                                                            {/* RecoveredProperty */}
                                                                            <div className="col-12  bb" >
                                                                                {
                                                                                    JSON.parse(obj?.RecoveredProperty)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Recovered Property Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.RecoveredProperty)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Officer_Name}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Officer</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.RecoveredDateTime ? getShowingDateText(item.RecoveredDateTime) : ''}
                                                                                                                                />

                                                                                                                                <label htmlFor="" className='new-summary'>Recovered Date/Time</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.RecoveryType_Des}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Recovery Type</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.RecoveredValue}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Recovered Value</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Balance}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Balance</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Disposition_Des}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Disposition</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                            <label htmlFor="" className='new-summary'>Comments</label>

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


                                                                            {
                                                                                JSON.parse(obj?.Document)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="table-responsive" >
                                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                                <p className="p-0 m-0 d-flex align-items-center">Property Document</p>
                                                                                            </div>
                                                                                            <table className="table table-bordered" >
                                                                                                <thead className='text-dark master-table'>
                                                                                                    <tr>
                                                                                                        <th className='' style={{ width: '100px' }}>Document Name</th>
                                                                                                        <th className='' style={{ width: '100px' }}>Notes</th>
                                                                                                        <th className='' style={{ width: '100px' }}>Document Type</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody >
                                                                                                    {
                                                                                                        JSON.parse(obj?.Document)?.map((item, key) => (
                                                                                                            <>
                                                                                                                <tr key={key}>
                                                                                                                    <td style={{ width: '100px' }} className='text-list'>{item.DocumentName}</td>
                                                                                                                    <td style={{ width: '100px' }} className='text-list'>{item.DocumentNotes}</td>
                                                                                                                    <td style={{ width: '100px' }} className='text-list'>{item.Description_Document}</td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        ))
                                                                                                    }
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <></>
                                                                            }
                                                                            {/* vehicle-recoverd */}

                                                                            {
                                                                                JSON.parse(obj?.Owner)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="table-responsive" >
                                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                                <p className="p-0 m-0 d-flex align-items-center">Property Owner Information:</p>
                                                                                            </div>
                                                                                            <table className="table " >
                                                                                                <thead className='text-dark master-table'>
                                                                                                    <tr>
                                                                                                        <th className=''>Owner Name</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody >
                                                                                                    {
                                                                                                        JSON.parse(obj?.Owner)?.map((item, key) => (
                                                                                                            <>
                                                                                                                <tr key={key} >
                                                                                                                    <td className='text-list'>{item.Owner_Name}</td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        ))
                                                                                                    }
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <></>
                                                                            }
                                                                            {/* property room */}
                                                                            {
                                                                                JSON.parse(obj?.PropertyRoom)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="table-responsive" >
                                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                                <p className="p-0 m-0 d-flex align-items-center">Property Room Information:</p>
                                                                                            </div>
                                                                                            <table className="table " >
                                                                                                <thead className='text-dark master-table'>
                                                                                                    <tr>
                                                                                                        <th className=''>Activity</th>
                                                                                                        <th className=''>Activity Reason</th>
                                                                                                        <th className=''>Date/Time</th>
                                                                                                        <th className=''>Officer Name</th>
                                                                                                        <th className=''>Other Person Name</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody >
                                                                                                    {
                                                                                                        JSON.parse(obj?.PropertyRoom)?.map((item, key) => (
                                                                                                            <>
                                                                                                                <tr key={key} >
                                                                                                                    <td className='text-list'>{item.Status}</td>
                                                                                                                    <td className='text-list'>{item.ActivityReason_Des}</td>
                                                                                                                    <td className='text-list'>{item.ReleaseDate ? getShowingDateText(item.ReleaseDate) : ''}</td>
                                                                                                                    <td className='text-list'>{item.Officer_Name}</td>
                                                                                                                    <td className='text-list'>{item.OtherPersonName_Name}</td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        ))
                                                                                                    }
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <></>
                                                                            }


                                                                            {/* property offence */}
                                                                            {
                                                                                JSON.parse(obj?.PropertyOffense)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="table-responsive bb" >
                                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                                <p className="p-0 m-0 d-flex align-items-center">Property Offense:</p>
                                                                                            </div>
                                                                                            <table className="table " >
                                                                                                <thead className='text-dark master-table'>
                                                                                                    <tr>
                                                                                                        <th className='' style={{ width: '200px' }}>TIBRS Code</th>
                                                                                                        <th className='' style={{ width: '200px' }}>Offense Code/Name</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody >
                                                                                                    {
                                                                                                        JSON.parse(obj?.PropertyOffense)?.map((item, key) => (
                                                                                                            <>
                                                                                                                <tr key={key} >
                                                                                                                    <td className='text-list' style={{ width: '200px' }}>{item.NIBRSCode}</td>
                                                                                                                    <td className='text-list' style={{ width: '200px' }}>{item.Offense_Description}</td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        ))
                                                                                                    }
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <></>
                                                                            }


                                                                            {/* property TRANSACTION */}
                                                                            {
                                                                                JSON.parse(obj?.TransactionLog)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="table-responsive" >
                                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                                <p className="p-0 m-0 d-flex align-items-center">Transaction Information:</p>
                                                                                            </div>
                                                                                            <table className="table " >
                                                                                                <thead className='text-dark master-table'>
                                                                                                    <tr>
                                                                                                        <th className=''>Transaction Name</th>
                                                                                                        <th className=''>Transaction Number</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody >
                                                                                                    {
                                                                                                        JSON.parse(obj?.TransactionLog)?.map((item, key) => (
                                                                                                            <>
                                                                                                                <tr key={key} >
                                                                                                                    <td className='text-list'>{item.TransactionName}</td>
                                                                                                                    <td className='text-list'>{item.TransactionNumber}</td>
                                                                                                                </tr>
                                                                                                            </>
                                                                                                        ))
                                                                                                    }
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    </>
                                                                                    :
                                                                                    <></>
                                                                            }


                                                                            <div className="table-responsive">
                                                                                <h5 className="text-white text-bold bg-green py-1 px-3">Property Image:</h5>
                                                                                {
                                                                                    JSON.parse(obj?.Photo)?.length > 0 ? (
                                                                                        <div className="col-12">
                                                                                            <div className="row">
                                                                                                {
                                                                                                    JSON.parse(obj?.Photo)?.map((item, index) => {
                                                                                                        return (
                                                                                                            <div key={index} className="col-3 mb-1 mt-1 d-flex justify-content-center">
                                                                                                                <img
                                                                                                                    src={item.Photo}
                                                                                                                    alt={`Property ${index}`}
                                                                                                                    className="img-fluid "
                                                                                                                    style={{ width: "100%", height: "200px" }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        );
                                                                                                    })
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p>No images available</p>
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                    </>
                                                                ))
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }
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

export default MasterPropertyReport