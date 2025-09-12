import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime, getYearWithOutDateTime } from '../../../../Common/Utility';
import { useSelector } from 'react-redux';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { fetchPostData } from '../../../../hooks/Api';
import ReportAddress from '../../../ReportAddress/ReportAddress';
import { useReactToPrint } from 'react-to-print';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';


const CurrentVehicleReport = (props) => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = sessionStorage.getItem('IPAddress');

    const { GetDataTimeZone, datezone, } = useContext(AgencyContext);
    const { printVehReport, setPrintVehReport, VehReportCount, setVehReportCount, VehNumber, showModal, setShowModal } = props

    const [verifyReport, setverifyReport] = useState(false);
    const [masterReportData, setMasterReportData] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [multiImage, setMultiImage] = useState([]);
    const [loder, setLoder] = useState(false);
    const [LoginUserName, setLoginUserName] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); GetDataTimeZone(localStoreData?.AgencyID);
            setLoginUserName(localStoreData?.UserName);
        }
    }, [localStoreData]);

    const get_PropertyReport = async () => {
        setLoder(true); setIsLoading(true)
        const val = {
            'ReportedDate': '', 'ReportedDateTo': '', 'CategoryID': '', 'VehicleNumber': VehNumber, 'VehicleNumberTo': '', 'LossCodeID': '',
            'ValueTo': '', 'Value': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'AgencyID': LoginAgencyID, 'StorageLocationID': '', 'ActivityType': '', 'ReceiveDate': '', 'ReceiveDateTo': '', 'InvestigatorID': '',
            'PropertyTypeID': '', 'DispositionID': '', 'RecoveredDateTime': '', 'RecoveredDateTimeTo': '', 'IPAddress': '', 'UserID': '', 'SearchCriteria': '', 'SearchCriteriaJson': '',
            'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK
        }
        try {
            const apiUrl = 'ReportVehicle/GetData_MasterReportVehicle';
            const res = await fetchPostData(apiUrl, val);
            if (res.length > 0) {
                getAgencyImg(LoginAgencyID);
                setMasterReportData(res[0]); setverifyReport(true); setIsLoading(false); setLoder(false);
            } else {
                console.log("Data Not Available"); setIsLoading(false);
            }
        } catch (error) {
            setverifyReport(false); setMasterReportData([]); setLoder(false);
        }

    }

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

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data', 
        removeAfterPrint: true,
        onBeforeGetContent: () => {
            setShowFooter(true);
        },
        onAfterPrint: () => {
            setShowFooter(false);
            setPrintVehReport(false);
        }
    });

    const [showFooter, setShowFooter] = useState(false);

    useEffect(() => {
        if (printVehReport) {
            get_PropertyReport();
        }
    }, [printVehReport, VehReportCount])


    return (
        <>
            {
                showModal && (
                    <>

                        <div class="modal " style={{ background: "rgba(0,0,0, 0.5)" }} id="QueueReportsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">

                            <div className=" pt-2 modal-xl  m-auto " >
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
                                        Vehicle Master Report
                                    </p>
                                    <div style={{ marginLeft: 'auto' }}>
                                        <span onClick={() => { setPrintVehReport(true); printForm(); setVehReportCount(VehReportCount + 1) }}
                                            className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                            <i className="fa fa-print"  > Print</i>
                                        </span>
                                        <button
                                            className="btn btn-sm btn-danger px-2 py-0"
                                            onClick={() => {
                                                setShowModal(false);
                                                setPrintVehReport(false);
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
                                                {
                                                    masterReportData?.Vehicle?.length > 0 ?
                                                        <>
                                                            <ReportAddress {...{ multiImage, masterReportData }} />
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                }
                                                <div className="col-12">
                                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                    <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Vehicle Master Report</h5>
                                                </div>

                                                {
                                                    masterReportData?.Vehicle?.length > 0 ?
                                                        <>
                                                            {
                                                                masterReportData?.Vehicle?.map((obj) => (
                                                                    <>
                                                                        <div className="container-fluid " style={{ pageBreakAfter: 'always' }}>

                                                                            <div className="table-responsive mt-5" >
                                                                                <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-center align-items-center">
                                                                                    <p className="p-0 m-0 d-flex align-items-center text-center">Vehicle Information: {obj?.VehicleNumber}</p>
                                                                                </div>
                                                                                <div className="col-12  " style={{ border: '1px solid #80808085', }}>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Vehicle Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            <div className="row bb px-3 mb-2">
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.VehicleNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Vehicle Number</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.ReportedDtTm ? getShowingDateText(obj?.ReportedDtTm) : null}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Reported Date/Time</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Value}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Value</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.LossCode_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Loss Code</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Category_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Category</label>

                                                                                                    </div>
                                                                                                </div>

                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Classification_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Classification</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.StatePlateNumber}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Plate State</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.VehicleNo}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Plate No.
                                                                                                        </label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.PlateType_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Plate Type</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.VIN}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>VIN</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.VOD_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>VOD
                                                                                                        </label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.PlateExpireDtTm ? getShowingWithOutTime(obj?.PlateExpireDtTm) : null}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Plate Expires</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.OANID}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>OAN ID</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.style_Desc}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Style</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Weight}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Weight</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Owner_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Owner</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Make_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Make</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Model_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Model</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.PrimaryColor_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Primary Color</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.SecondaryColor_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Secondary Color</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.ManufactureYear ? getYearWithOutDateTime(obj?.ManufactureYear) : null}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Manuf.Year</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.Inspection_Sticker}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Inspection Sticker</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj?.InspectionExpiresDtTm ? getShowingWithOutTime(obj?.InspectionExpiresDtTm) : null}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Inspection Expires</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.PrimaryOfficer_Description}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>Primary Officer</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                    <div className="text-field">
                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                            value={obj.InProfessionOf}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary'>In Possession Of</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""
                                                                                                            checked={obj?.IsEvidence || false}
                                                                                                            disabled={!obj}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-2'>Evidence</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""
                                                                                                            checked={obj && Object.keys(obj).length > 0 ? obj.IsSendToPropertyRoom : false}
                                                                                                            disabled={!obj || Object.keys(obj).length === 0}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-2'>Send To Property Room</label>

                                                                                                    </div>
                                                                                                </div>


                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                                <div className="col-12  " style={{ border: '1px solid #80808085', }}>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Additional Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            <div className="row bb px-3 mb-2">
                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                    <div>
                                                                                                        <label htmlFor="" className='new-summary'>Description</label>
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
                                                                                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(obj?.Description) }}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""
                                                                                                            checked={obj?.IsImmobalizationDevice || false}
                                                                                                            disabled={!obj}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-1'>Is Immobalization Device</label>

                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                                                    <div className=''>
                                                                                                        <input
                                                                                                            type="checkbox"
                                                                                                            name=""
                                                                                                            id=""                                                                                                    
                                                                                                            checked={obj?.IsEligibleForImmobalization || false}
                                                                                                            disabled={!obj}
                                                                                                        />
                                                                                                        <label htmlFor="" className='new-summary pl-1'>Is EligibleForImmobalization</label>

                                                                                                    </div>
                                                                                                </div>



                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>

                                                                            </div>
                                                                
                                                                            <div className="col-12  " style={{ border: '1px solid #80808085', }}>
                                                                                {
                                                                                    JSON.parse(obj?.VehicleNotes)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Vehicle Notes Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.VehicleNotes)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 mb-2">
                                                                                                                <div className="col-12 " >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-6 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                                    value={item.OfficerName}
                                                                                                                                />
                                                                                                                                <label htmlFor="" className='new-summary'>Officer Name</label>

                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                        <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">

                                                                                                                            <div>
                                                                                                                                <label htmlFor="" className='new-summary'>Notes</label>
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
                                                                                                                                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Notes) }}
                                                                                                                                />
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
                                                                         
                                                                            {JSON.parse(obj?.Document)?.length > 0 ?
                                                                                <div className="table-responsive mt-2" >
                                                                                    <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                        <p className="p-0 m-0 d-flex align-items-center">Vehicle Document:</p>
                                                                                    </div>
                                                                                    <table className="table " >
                                                                                        <thead className='text-dark master-table'>
                                                                                            <tr>
                                                                                                <th className='' >Document Name</th>
                                                                                                <th className='' >Notes</th>
                                                                                                <th className=''>Document Type</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody>
                                                                                            {
                                                                                                JSON.parse(obj?.Document)?.map((item, key) => (
                                                                                                    <>
                                                                                                        <tr key={key}>
                                                                                                            <td className='text-list'>{item.DocumentName}</td>
                                                                                                            <td className='text-list'>{item.DocumentNotes}</td>
                                                                                                            <td className='text-list'>{item.DocumentType_Description}</td>
                                                                                                        </tr>
                                                                                                    </>
                                                                                                ))
                                                                                            }
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                                : <></>}


                                                                            <div className="col-12  bb" style={{ border: '1px solid #80808085', }}>
                                                                                {
                                                                                    JSON.parse(obj?.Recovered)?.length > 0 ?
                                                                                        <>
                                                                                            <div className="container bb">
                                                                                                <h6 className=' text-dark mt-2'>Recovered Property Information</h6>
                                                                                                <div className="col-12 ">
                                                                                                    {
                                                                                                        JSON.parse(obj?.Recovered)?.map((item, key) => (
                                                                                                            <div className="row bb px-3 ">
                                                                                                                <div className="col-12 mb-2" >
                                                                                                                    <div className="row ">
                                                                                                                        <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                            <div className="text-field">
                                                                                                                                <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                                    value={item.Officer_Description}
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
                                                                                                                                    value={item.RecoveryType}
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
                                                                                                                                    value={item.Disposition}
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
                                                                                JSON.parse(obj?.Transaction)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="table-responsive mt-2" >
                                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                                <p className="p-0 m-0 d-flex align-items-center">Transaction Information:</p>
                                                                                            </div>
                                                                                            <table className="table " >
                                                                                                <thead className='text-dark master-table'>
                                                                                                    <tr>
                                                                                                        <th className='' style={{ width: '100px' }}>Transaction Name</th>
                                                                                                        <th className='' style={{ width: '100px' }}>Transaction Number</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {
                                                                                                        JSON.parse(obj?.Transaction)?.map((item, key) => (
                                                                                                            <>
                                                                                                                <tr key={key}>
                                                                                                                    <td style={{ width: '100px' }} className='text-list'>{item.TransactionName}</td>
                                                                                                                    <td style={{ width: '100px' }} className='text-list'>{item.TransactionNumber}</td>
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
                                                                            {
                                                                                JSON.parse(obj?.Propertyroom)?.length > 0 ?
                                                                                    <>
                                                                                        <div className="table-responsive mt-2" >
                                                                                            <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                                <p className="p-0 m-0 d-flex align-items-center">Property Room Information:</p>
                                                                                            </div>
                                                                                            <table className="table " >
                                                                                                <thead className='text-dark master-table'>
                                                                                                    <tr>
                                                                                                        <th className=''>Officer Name</th>
                                                                                                        <th className=''>Activity Reason</th>
                                                                                                        <th className=''>Other Person Name</th>
                                                                                                        <th className=''>Activity</th>
                                                                                                        <th className=''>Date/Time</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody>
                                                                                                    {
                                                                                                        JSON.parse(obj?.Propertyroom)?.map((item, key) => (
                                                                                                            <>
                                                                                                                <tr key={key}>
                                                                                                                    <td className='text-list'>{item.Officer_Name}</td>
                                                                                                                    <td className='text-list'>{item.ActivityReason_Des}</td>
                                                                                                                    <td className='text-list'>{item.OtherPersonName_Name}</td>
                                                                                                                    <td className='text-list'>{item.Status}</td>
                                                                                                                    <td className='text-list'>{item.ReleaseDate ? getShowingDateText(item.ReleaseDate) : ''}</td>

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
                                                                           
                                                                           
                                                                            {
                                                                                JSON.parse(obj?.Photo)?.length > 0 ? (
                                                                                    <div className="table-responsive mt-3 ">
                                                                                        <div className="text-white text-bold bg-green py-1 px-2 d-flex justify-content-between align-items-center">
                                                                                            <p className="p-0 m-0 d-flex align-items-center">Vehicle Image Information</p>
                                                                                        </div>
                                                                                        <div className='col-12'>
                                                                                            <div className="row">
                                                                                                {
                                                                                                    JSON.parse(obj?.Photo)?.map((item, index) => {
                                                                                                        return (
                                                                                                            <div className="col-3 d-flex justify-content-center mb-2" key={index}>
                                                                                                                <img
                                                                                                                    src={item.Photo}
                                                                                                                    alt={`Vehicle ${index}`}
                                                                                                                    className="img-fluid"
                                                                                                                    style={{
                                                                                                                        width: "100%",
                                                                                                                        height: "200px",
                                                                                                                        padding: "5px"
                                                                                                                    }}
                                                                                                                />
                                                                                                            </div>
                                                                                                        );
                                                                                                    })
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ) : null
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

            {/* {loder && (
                  <div className="loader-overlay">
                      <Loader />
                  </div>
              )} */}
        </>

    )
}

export default CurrentVehicleReport