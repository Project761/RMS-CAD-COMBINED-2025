import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingMonthDateYear } from '../../../../Common/Utility';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate } from '../../../../hooks/Api';
import Loader from '../../../../Common/Loader';

const EvidenceDestructionModel = (props) => {
    const { PropertyRoomID, DecPropID, DecMPropID, isLoading, setSelectedFile, componentRef, get_EvidenceDestruction, setEevidenceDestructionID, editval, generate, setgenerate, targetRef } = props

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [LoginPinID, setLoginPinID,] = useState('');

    //-----------Date------------------------
    const [crimeDate, setCrimeDate] = useState();
    const [dateOfReceipt, setDateOfReceipt] = useState();
    const [dateOfDestruction, setDateOfDestruction] = useState();
    const [dateOfDelivery, setDateOfDelivery] = useState();
    const [propertyReceivedDT, setPropertyReceivedDT] = useState();
    const [finalJudgementDT, setFinalJudgementDT] = useState();
    const [noticeSentDt, setNoticeSentDt] = useState();
    const [approvalDT, setApprovalDT] = useState();

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); get_EvidenceDestruction(PropertyRoomID)
        }
    }, [localStoreData]);



    const [value, setValue] = useState({
        'PropertyroomID': '', 'Agency': '', 'ComplaintNo': '', 'ProsecutorCaseNo': '', 'DepartmentCaseNo': '', 'NameOfVicitm': '',
        'AddressOfVicitm': '', 'NJS': '', 'CrimeDate': '', 'PropertyReceivedDT': '', 'FinalJudgementDT': '',
        'LastCourtAction': '', 'DispositionOfCase': '', 'ReasonForDestruction': '', 'SignOfPersonReqDes': '',
        'NoticeSentDt': '', 'SentBy': '', 'SignCTAttorneyAppDes': '', 'ItemstobeDestroyed': '',
        'ApprovalDT': '', 'PropertydeliveredBy': '', 'DateOfDelivery': '', 'PropertyReceivedBy': '', 'DateOfReceipt': '',
        'DateOfDestruction': '', 'PlaceOfDestruction': '', 'MethodOfDestruction': '', 'PropertyOfDestruction': '',
        "CreatedByUserFK": '', 'CreatedDtTm': '',
        //------ReadioButton---
        'TypeOfEvidence': '',
        'TypeOfCase': '',
        'NoticeOfIntentSentToClaimant': '',
        'DateOfRequest': '',
        'SignOfPersonDeliverProp': '',
        'SignOfPersonReceiveProp': '',
        'SignOfPersonDestWitDesProp': '',
        'SignatureOfPersonRequesting': '',

    });

    const Reset = () => {
        setValue({
            ...value, 'PropertyroomID': '', 'Agency': '', 'ComplaintNo': '', 'ProsecutorCaseNo': '', 'DepartmentCaseNo': '', 'NameOfVicitm': '',
            'AddressOfVicitm': '', 'NJS': '', 'CrimeDate': '', 'PropertyReceivedDT': '', 'FinalJudgementDT': '',
            'LastCourtAction': '', 'DispositionOfCase': '', 'ReasonForDestruction': '', 'SignOfPersonReqDes': '',
            'NoticeSentDt': '', 'SentBy': '', 'SignCTAttorneyAppDes': '', 'ItemstobeDestroyed': '',
            'ApprovalDT': '', 'PropertydeliveredBy': '', 'DateOfDelivery': '', 'PropertyReceivedBy': '', 'DateOfReceipt': '',
            'DateOfDestruction': '', 'PlaceOfDestruction': '', 'MethodOfDestruction': '', 'PropertyOfDestruction': '',
            "CreatedByUserFK": '', 'CreatedDtTm': '',
            //------ReadioButton---
            'TypeOfEvidence': '',
            'TypeOfCase': '',
            'NoticeOfIntentSentToClaimant': '',
            'DateOfRequest': '',
            'SignOfPersonDeliverProp': '',
            'SignOfPersonReceiveProp': '',
            'SignOfPersonDestWitDesProp': '',
            'SignatureOfPersonRequesting': '',
        }); setApprovalDT(''); setNoticeSentDt(''); setFinalJudgementDT(''); setPropertyReceivedDT(''); setDateOfDelivery(''); setDateOfDestruction(''); setDateOfReceipt(''); setCrimeDate('')
        // setErrors({ ...errors, ['NIBRSIDError']: '', });
    }

    useEffect(() => {
        if (editval.length > 0) {

            setValue({
                ...value,
                'PropertyroomID': editval[0]?.PropertyroomID, 'Agency': editval[0]?.Agency, 'ComplaintNo': editval[0]?.ComplaintNo, 'ProsecutorCaseNo': editval[0]?.ProsecutorCaseNo, 'DepartmentCaseNo': editval[0]?.DepartmentCaseNo, 'NameOfVicitm': editval[0]?.NameOfVicitm,
                'AddressOfVicitm': editval[0]?.AddressOfVicitm, 'NJS': editval[0]?.NJS, 'CrimeDate': editval[0]?.CrimeDate ? formatDate(editval[0]?.CrimeDate) : '', 'PropertyReceivedDT': editval[0]?.PropertyReceivedDT ? formatDate(editval[0]?.PropertyReceivedDT) : '', 'FinalJudgementDT': editval[0]?.FinalJudgementDT ? formatDate(editval[0]?.FinalJudgementDT) : '',
                'LastCourtAction': editval[0]?.AddressOfVicitm, 'DispositionOfCase': editval[0]?.AddressOfVicitm, 'ReasonForDestruction': editval[0]?.AddressOfVicitm, 'SignOfPersonReqDes': editval[0]?.AddressOfVicitm,
                NoticeSentDt: editval[0]?.NoticeSentDt ? formatDate(editval[0]?.NoticeSentDt) : '', 'SentBy': editval[0]?.SentBy, 'SignCTAttorneyAppDes': editval[0]?.SignCTAttorneyAppDes, 'ItemstobeDestroyed': editval[0]?.ItemstobeDestroyed,
                'ApprovalDT': editval[0]?.ApprovalDT ? formatDate(editval[0]?.ApprovalDT) : '', 'PropertydeliveredBy': editval[0]?.PropertydeliveredBy, 'DateOfDelivery': editval[0]?.DateOfDelivery ? formatDate(editval[0]?.DateOfDelivery) : '', 'PropertyReceivedBy': editval[0]?.PropertyReceivedBy, 'DateOfReceipt': editval[0]?.DateOfReceipt ? formatDate(editval[0]?.DateOfReceipt) : '',
                'DateOfDestruction': editval[0]?.DateOfDestruction ? formatDate(editval[0]?.DateOfDestruction) : '', 'PlaceOfDestruction': editval[0]?.PlaceOfDestruction, 'MethodOfDestruction': editval[0]?.MethodOfDestruction, 'PropertyOfDestruction': editval[0]?.PropertyOfDestruction,
                "CreatedByUserFK": editval[0]?.CreatedByUserFK, 'CreatedDtTm': editval[0]?.CreatedDtTm,
                //------ReadioButton---
                'TypeOfEvidence': editval[0]?.TypeOfEvidence,
                'TypeOfCase': editval[0]?.TypeOfCase,
                'NoticeOfIntentSentToClaimant': editval[0]?.NoticeOfIntentSentToClaimant,
                'DateOfRequest': editval[0]?.DateOfRequest ? formatDate(editval[0]?.DateOfRequest) : '',
                'SignOfPersonDeliverProp': editval[0]?.SignOfPersonDeliverProp,
                'SignOfPersonReceiveProp': editval[0]?.SignOfPersonReceiveProp,
                'SignOfPersonDestWitDesProp': editval[0]?.SignOfPersonDestWitDesProp,
                'SignatureOfPersonRequesting': editval[0]?.SignatureOfPersonRequesting,
            })

        }
        else {
            setValue({
                ...value, 'PropertyroomID': PropertyRoomID, 'Agency': '', 'ComplaintNo': '', 'ProsecutorCaseNo': '', 'DepartmentCaseNo': '', 'NameOfVicitm': '',
                'AddressOfVicitm': '', 'NJS': '', 'CrimeDate': '', 'PropertyReceivedDT': '', 'FinalJudgementDT': '',
                'LastCourtAction': '', 'DispositionOfCase': '', 'ReasonForDestruction': '', 'SignOfPersonReqDes': '',
                'NoticeSentDt': '', 'SentBy': '', 'SignCTAttorneyAppDes': '', 'ItemstobeDestroyed': '',
                'ApprovalDT': '', 'PropertydeliveredBy': '', 'DateOfDelivery': '', 'PropertyReceivedBy': '', 'DateOfReceipt': '',
                'DateOfDestruction': '', 'PlaceOfDestruction': '', 'MethodOfDestruction': '', 'PropertyOfDestruction': '',
                "CreatedByUserFK": '', 'CreatedDtTm': '',
                //------ReadioButton---
                'TypeOfEvidence': '',
                'TypeOfCase': '',
                'NoticeOfIntentSentToClaimant': '',
                'SignOfPersonDeliverProp': '',
                'SignOfPersonReceiveProp': '',
                'SignOfPersonDestWitDesProp': '',
                'SignatureOfPersonRequesting': '',
            });
        }
    }, [editval])

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    useEffect(() => {
        if (LoginAgencyID) {
            setValue({
                ...value,
                'PropertyroomID': PropertyRoomID, 'Agency': '', 'ComplaintNo': '', 'ProsecutorCaseNo': '', 'DepartmentCaseNo': '', 'NameOfVicitm': '',
                'AddressOfVicitm': '', 'NJS': '', 'CrimeDate': '', 'PropertyReceivedDT': '', 'FinalJudgementDT': '',
                'LastCourtAction': '', 'DispositionOfCase': '', 'ReasonForDestruction': '', 'SignOfPersonReqDes': '',
                'NoticeSentDt': '', 'SentBy': '', 'SignCTAttorneyAppDes': '', 'ItemstobeDestroyed': '',
                'ApprovalDT': '', 'PropertydeliveredBy': '', 'DateOfDelivery': '', 'PropertyReceivedBy': '', 'DateOfReceipt': '',
                'DateOfDestruction': '', 'PlaceOfDestruction': '', 'MethodOfDestruction': '', 'PropertyOfDestruction': '',
                "CreatedByUserFK": '', 'CreatedDtTm': '',
                //------ReadioButton---
                'TypeOfEvidence': '',
                'TypeOfCase': '',
                'NoticeOfIntentSentToClaimant': '',
                'DateOfRequest': '',
                'SignOfPersonDeliverProp': '',
                'SignOfPersonReceiveProp': '',
                'SignOfPersonDestWitDesProp': '',
                'SignatureOfPersonRequesting': '',
            });
        }
    }, [LoginAgencyID]);


    const Add_Type = () => {
        const propertyroomID = PropertyRoomID;
        const { Agency, ComplaintNo, ProsecutorCaseNo, DepartmentCaseNo, NameOfVicitm,
            AddressOfVicitm, NJS, CrimeDate, PropertyReceivedDT, FinalJudgementDT,
            LastCourtAction, DispositionOfCase, ReasonForDestruction, SignOfPersonReqDes, DateOfRequest,
            NoticeSentDt, SentBy, SignCTAttorneyAppDes, ItemstobeDestroyed,
            ApprovalDT, PropertydeliveredBy, DateOfDelivery, PropertyReceivedBy, DateOfReceipt,
            DateOfDestruction, PlaceOfDestruction, MethodOfDestruction, PropertyOfDestruction,
            CreatedByUserFK, CreatedDtTm,
            TypeOfEvidence, TypeOfCase, NoticeOfIntentSentToClaimant, SignOfPersonDeliverProp, SignOfPersonReceiveProp, SignOfPersonDestWitDesProp, SignatureOfPersonRequesting } = value;

        const val = {
            propertyroomID, Agency, ComplaintNo, ProsecutorCaseNo, DepartmentCaseNo, NameOfVicitm,
            AddressOfVicitm, NJS, CrimeDate, PropertyReceivedDT, FinalJudgementDT,
            LastCourtAction, DispositionOfCase, ReasonForDestruction, SignOfPersonReqDes,
            NoticeSentDt, SentBy, SignCTAttorneyAppDes, ItemstobeDestroyed,
            ApprovalDT, PropertydeliveredBy, DateOfDelivery, PropertyReceivedBy, DateOfReceipt,
            DateOfDestruction, PlaceOfDestruction, MethodOfDestruction, PropertyOfDestruction,
            CreatedByUserFK, CreatedDtTm, DateOfRequest, SignOfPersonDeliverProp, SignOfPersonReceiveProp, SignOfPersonDestWitDesProp, SignatureOfPersonRequesting,
            TypeOfEvidence, TypeOfCase, NoticeOfIntentSentToClaimant
        }
        AddDeleteUpadate('EvidenceDestruction/InsertEvidenceDestruction', val).then((res) => {
            setEevidenceDestructionID(res.setEevidenceDestructionID)
            toastifySuccess(res.Message); get_EvidenceDestruction(PropertyRoomID);
            Reset();
        }).catch((error) => {
            console.error('Error:', error);


        });
    }



    const HandleChange = (e, name) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleDateChange = (dateString, fieldName) => {
        const isValidDate = validateDate(dateString);
        const formattedDate = isValidDate ? getShowingMonthDateYear(dateString) : dateString;
        setValue({ ...value, [fieldName]: formattedDate });
    };


    const validateDate = (dateString) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const matches = dateString.match(regex);
        if (!matches) return false;

        const day = parseInt(matches[1], 10);
        const month = parseInt(matches[2], 10);
        const year = parseInt(matches[3], 10);
        const date = new Date(year, month - 1, day);


        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    };


    const getShowingMonthDateYear = (dateString) => {
        const dateParts = dateString.split('/');
        if (dateParts.length === 3) {
            const day = dateParts[0].padStart(2, '0');
            const month = dateParts[1].padStart(2, '0');
            const year = dateParts[2];
            return `${month}/${day}/${year} 00:00:00`;
        }
        return dateString;
    };

    return (
        <>
            <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="EvidenceModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                <div class="modal-dialog modal-xl rounded modal-dialog-scrollable">
                    <div class="modal-content">
                        <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "end" }} ><b>X
                        </b>
                        </button>
                        <div class="modal-body ">
                            <div className="col-12 col-md-12 col-lg-12 " style={{ marginTop: '-15px' }}>
                                <fieldset >
                                    <legend>Destruction Evidence</legend>
                                    <div className="row " >
                                        <div className="container mt-1" ref={componentRef}>
                                            <div className="row" >
                                                <table class="table table-bordered" >
                                                    <tbody>
                                                        <tr>
                                                            <td >
                                                                <span className='prop-td'>
                                                                    Type Of Evidence
                                                                </span>
                                                                <div className='row'>
                                                                    <div className="form-check pl-4">
                                                                        <input className="form-check-input" type="radio" name="TypeOfEvidence" id="flexRadioDefault1"
                                                                            value="CDS"
                                                                            onChange={handleChange}
                                                                            checked={value.TypeOfEvidence === 'CDS'}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                                            CDS
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check pl-5">
                                                                        <input className="form-check-input" type="radio" name="TypeOfEvidence" id="flexRadioDefault2"
                                                                            value="Weapons"
                                                                            onChange={handleChange}
                                                                            checked={value.TypeOfEvidence === 'Weapons'}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                                            Weapons
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className='prop-td'>
                                                                    Type Of Case
                                                                </span>
                                                                <div className='row'>
                                                                    <div className="form-check pl-4">
                                                                        <input className="form-check-input" type="radio" name="TypeOfCase" id="flexRadioDefault3"
                                                                            value="Adult"
                                                                            // onChange={HandleChange}
                                                                            // checked={value.Adult}
                                                                            onChange={handleChange}
                                                                            checked={value.TypeOfCase === 'Adult'}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                                            Adult
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check pl-5">
                                                                        <input className="form-check-input" type="radio" name="TypeOfCase" id="flexRadioDefault4"
                                                                            value="Juvenile"
                                                                            onChange={handleChange}
                                                                            checked={value.TypeOfCase === 'Juvenile'}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexRadioDefault4">
                                                                            Juvenile
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className='prop-td'>
                                                                    Agency:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1' name='Agency' onChange={HandleChange} value={value?.Agency} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Complaint No:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1' name='ComplaintNo' onChange={HandleChange} value={value?.ComplaintNo} />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Prosecutor Case No:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className='py-1' name='ProsecutorCaseNo' onChange={HandleChange} value={value?.ProsecutorCaseNo} />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Department Case No:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='DepartmentCaseNo' onChange={HandleChange} value={value?.DepartmentCaseNo} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>

                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className='prop-td'>
                                                                    Name  Of (defendant) (victim):
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='NameOfVicitm' onChange={HandleChange} value={value?.NameOfVicitm} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className='prop-td'>
                                                                    Address  Of (defendant) (victim):
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='AddressOfVicitm' onChange={HandleChange} value={value?.AddressOfVicitm} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    NJS:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='NJS' onChange={HandleChange} value={value?.NJS} />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Crime Date:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    {/* <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        onChange={(date) => { setCrimeDate(date); setValue({ ...value, ['CrimeDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                        name='CrimeDate'
                                                                        selected={crimeDate}
                                                                    // value={value?.CrimeDate}
                                                                    /> */}
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='CrimeDate'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'CrimeDate')}
                                                                        value={value.CrimeDate}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Date Property Received:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    {/* <input type="text" className='py-1' name='PropertyReceivedDT'
                                                                        onChange={(date) => { setPropertyReceivedDT(date); setValue({ ...value, ['PropertyReceivedDT']: date ? getShowingMonthDateYear(date) : null }) }}

                                                                    // value={value?.PropertyReceivedDT}
                                                                    /> */}
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='PropertyReceivedDT'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'PropertyReceivedDT')}
                                                                        value={value.PropertyReceivedDT}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Date Of Final Judgment:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    {/* <input type="text" className=' py-1 ' name='FinalJudgementDT'
                                                                        onChange={(date) => { setFinalJudgementDT(date); setValue({ ...value, ['FinalJudgementDT']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                    // value={value?.FinalJudgementDT} 
                                                                    /> */}
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='FinalJudgementDT'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'FinalJudgementDT')}
                                                                        value={value.FinalJudgementDT}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Last Court Action:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='LastCourtAction' onChange={HandleChange} value={value?.LastCourtAction} />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Disposition Of Case:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='DispositionOfCase' onChange={HandleChange} value={value?.DispositionOfCase} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className='prop-td'>
                                                                    Reason For Destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='ReasonForDestruction' onChange={HandleChange} value={value?.ReasonForDestruction} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-8'>
                                                                <span className='prop-td'>
                                                                    Person Requesting Destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='SignOfPersonReqDes' onChange={HandleChange} value={value?.SignOfPersonReqDes} />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Date Of Request:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    {/* <input type="text" className=' py-1' name='DateOfRequest' onChange={HandleChange} value={value?.DateOfRequest} /> */}
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='DateOfRequest'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'DateOfRequest')}
                                                                        value={value.DateOfRequest}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className='prop-td'>
                                                                    Signature Of Person Requesting Destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='SignatureOfPersonRequesting' onChange={HandleChange} value={value?.SignatureOfPersonRequesting} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <span className='prop-td'>
                                                                    Items to be destroyed (Complete descriptions-Weapons must include make,model,serial number etc):
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' onChange={HandleChange} value={value?.ItemstobeDestroyed} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Notice of intent sent to claimant
                                                                </span>
                                                                <div className='row'>
                                                                    <div className="form-check pl-4">
                                                                        <input className="form-check-input" type="radio" name="NoticeOfIntentSentToClaimant" id="flexRadioDefault5"
                                                                            value="Yes"
                                                                            onChange={handleChange}
                                                                            checked={value.NoticeOfIntentSentToClaimant === 'Yes'}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexRadioDefault5">
                                                                            Yes
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check pl-5">
                                                                        <input className="form-check-input" type="radio" name="NoticeOfIntentSentToClaimant" id="flexRadioDefault6"
                                                                            value="No"
                                                                            onChange={handleChange}
                                                                            checked={value.NoticeOfIntentSentToClaimant === 'No'}

                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexRadioDefault6">
                                                                            No
                                                                        </label>
                                                                    </div>
                                                                    <div className="form-check pl-5">
                                                                        <input className="form-check-input" type="radio" name="NoticeOfIntentSentToClaimant" id="flexRadioDefault6"
                                                                            value="N/A"
                                                                            onChange={handleChange}
                                                                            checked={value.NoticeOfIntentSentToClaimant === 'N/A'}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="flexRadioDefault6">
                                                                            N/A
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Date notice sent:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">

                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='NoticeSentDt'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'NoticeSentDt')}
                                                                        value={value.NoticeSentDt}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Sent by:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='SentBy' onChange={HandleChange} value={value?.SentBy} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Signature of chief trial attorney approving destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='SignCTAttorneyAppDes' onChange={HandleChange} value={value?.SignCTAttorneyAppDes} />
                                                                </div>
                                                            </td>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Date Of Approval:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='ApprovalDT'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'ApprovalDT')}
                                                                        value={value.ApprovalDT}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Property delivered by:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='PropertydeliveredBy' onChange={HandleChange} value={value?.PropertydeliveredBy} />
                                                                </div>
                                                            </td>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Date Of delivery:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='DateOfDelivery'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'DateOfDelivery')}
                                                                        value={value.DateOfDelivery}
                                                                    />

                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Property received by:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='PropertyReceivedBy' onChange={HandleChange} value={value?.PropertyReceivedBy} />
                                                                </div>
                                                            </td>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Date Of receipt:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='DateOfReceipt'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'DateOfReceipt')}
                                                                        value={value.DateOfReceipt}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Date of destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input
                                                                        type="text"
                                                                        className='py-1'
                                                                        name='DateOfDestruction'
                                                                        onChange={(e) => handleDateChange(e.target.value, 'DateOfDestruction')}
                                                                        value={value.DateOfDestruction}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Place of destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='PlaceOfDestruction' onChange={HandleChange} value={value?.PlaceOfDestruction} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Method of destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='MethodOfDestruction' onChange={HandleChange} value={value?.MethodOfDestruction} />
                                                                </div>
                                                            </td>
                                                            <td className='col-6'>
                                                                <span className='prop-td'>
                                                                    Property of destruction:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <input type="text" className=' py-1 ' name='PropertyOfDestruction' onChange={HandleChange} value={value?.PropertyOfDestruction} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <table class="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Signature of person (s) delivering property:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-4 text-field">
                                                                    <textarea id="" cols="30" rows='2' name='SignOfPersonDeliverProp' onChange={HandleChange} value={value?.SignOfPersonDeliverProp}></textarea>
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Signature of person (s) receiving property:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-4 text-field">
                                                                    <textarea id="" cols="30" rows='2' name='SignOfPersonReceiveProp' onChange={HandleChange} value={value?.SignOfPersonReceiveProp}></textarea>
                                                                </div>
                                                            </td>
                                                            <td className='col-4'>
                                                                <span className='prop-td'>
                                                                    Signature of person (s) dest and/or wit destruction of prop:
                                                                </span>
                                                                <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                                                    <textarea id="" cols="30" rows='2' name='SignOfPersonDestWitDesProp' onChange={HandleChange} value={value?.SignOfPersonDestWitDesProp}></textarea>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onClick={Add_Type}>Save</button>
                            <button type="button" class="btn btn-secondary" onClick={Reset}>Clear</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={Reset} >Close</button>
                        </div>
                    </div>
                </div>
            </div>
            {
                generate &&
                <div ref={targetRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} >
                    <legend>Destruction Evidence</legend>
                    <table class="table table-bordered" >
                        <tbody>
                            <tr>
                                <td >
                                    <span className='prop-td'>
                                        Type Of Evidence
                                    </span>
                                    <div className='row'>
                                        <div className="form-check pl-4">
                                            <input className="form-check-input" type="radio" name="TypeOfEvidence" id="flexRadioDefault1"
                                                value="CDS"
                                                onChange={handleChange}
                                                checked={value.TypeOfEvidence === 'CDS'}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                CDS
                                            </label>
                                        </div>
                                        <div className="form-check pl-5">
                                            <input className="form-check-input" type="radio" name="TypeOfEvidence" id="flexRadioDefault2"
                                                value="Weapons"
                                                onChange={handleChange}
                                                checked={value.TypeOfEvidence === 'Weapons'}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                Weapons
                                            </label>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className='prop-td'>
                                        Type Of Case
                                    </span>
                                    <div className='row'>
                                        <div className="form-check pl-4">
                                            <input className="form-check-input" type="radio" name="TypeOfCase" id="flexRadioDefault3"
                                                value="Adult"
                                                // onChange={HandleChange}
                                                // checked={value.Adult}
                                                onChange={handleChange}
                                                checked={value.TypeOfCase === 'Adult'}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                Adult
                                            </label>
                                        </div>
                                        <div className="form-check pl-5">
                                            <input className="form-check-input" type="radio" name="TypeOfCase" id="flexRadioDefault4"
                                                value="Juvenile"
                                                onChange={handleChange}
                                                checked={value.TypeOfCase === 'Juvenile'}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault4">
                                                Juvenile
                                            </label>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <span className='prop-td'>
                                        Agency:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1' name='Agency' onChange={HandleChange} value={value?.Agency} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Complaint No:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1' name='ComplaintNo' onChange={HandleChange} value={value?.ComplaintNo} />
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Prosecutor Case No:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className='py-1' name='ProsecutorCaseNo' onChange={HandleChange} value={value?.ProsecutorCaseNo} />
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Department Case No:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='DepartmentCaseNo' onChange={HandleChange} value={value?.DepartmentCaseNo} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <span className='prop-td'>
                                        Name  Of (defendant) (victim):
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='NameOfVicitm' onChange={HandleChange} value={value?.NameOfVicitm} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <span className='prop-td'>
                                        Address  Of (defendant) (victim):
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='AddressOfVicitm' onChange={HandleChange} value={value?.AddressOfVicitm} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        NJS:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='NJS' onChange={HandleChange} value={value?.NJS} />
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Crime Date:

                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        {/* <input
                                            type="text"
                                            className='py-1'
                                            onChange={(date) => { setCrimeDate(date); setValue({ ...value, ['CrimeDate']: date ? getShowingMonthDateYear(date) : null }) }}
                                            name='CrimeDate'
                                        // value={value?.CrimeDate}
                                        /> */}
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='CrimeDate'
                                            onChange={(e) => handleDateChange(e.target.value, 'CrimeDate')}
                                            value={value.CrimeDate}
                                        />

                                    </div>
                                </td>

                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Date Property Received:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        {/* <input type="text" className='py-1' name='PropertyReceivedDT'
                                            onChange={(date) => { setPropertyReceivedDT(date); setValue({ ...value, ['PropertyReceivedDT']: date ? getShowingMonthDateYear(date) : null }) }}

                                        // value={value?.PropertyReceivedDT}
                                        /> */}
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='PropertyReceivedDT'
                                            onChange={(e) => handleDateChange(e.target.value, 'PropertyReceivedDT')}
                                            value={value.PropertyReceivedDT}
                                        />

                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Date Of Final Judgment:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        {/* <input type="text" className=' py-1 ' name='FinalJudgementDT'
                                            onChange={(date) => { setFinalJudgementDT(date); setValue({ ...value, ['FinalJudgementDT']: date ? getShowingMonthDateYear(date) : null }) }}
                                        // value={value?.FinalJudgementDT} 
                                        /> */}
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='FinalJudgementDT'
                                            onChange={(e) => handleDateChange(e.target.value, 'FinalJudgementDT')}
                                            value={value.FinalJudgementDT}
                                        />
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Last Court Action:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='LastCourtAction' onChange={HandleChange} value={value?.LastCourtAction} />
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Disposition Of Case:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='DispositionOfCase' onChange={HandleChange} value={value?.DispositionOfCase} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <span className='prop-td'>
                                        Reason For Destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='ReasonForDestruction' onChange={HandleChange} value={value?.ReasonForDestruction} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-8'>
                                    <span className='prop-td'>
                                        Person Requesting Destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='SignOfPersonReqDes' onChange={HandleChange} value={value?.SignOfPersonReqDes} />
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Date Of Request:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        {/* <input type="text" className=' py-1' name='DateOfRequest' onChange={HandleChange} value={value?.DateOfRequest} /> */}
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='DateOfRequest'
                                            onChange={(e) => handleDateChange(e.target.value, 'DateOfRequest')}
                                            value={value.DateOfRequest}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <span className='prop-td'>
                                        Signature Of Person Requesting Destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='SignatureOfPersonRequesting' onChange={HandleChange} value={value?.SignatureOfPersonRequesting} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td>
                                    <span className='prop-td'>
                                        Items to be destroyed (Complete descriptions-Weapons must include make,model,serial number etc):
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' onChange={HandleChange} value={value?.ItemstobeDestroyed} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Notice of intent sent to claimant
                                    </span>
                                    <div className='row'>
                                        <div className="form-check pl-4">
                                            <input className="form-check-input" type="radio" name="NoticeOfIntentSentToClaimant" id="flexRadioDefault5"
                                                value="Yes"
                                                onChange={handleChange}
                                                checked={value.NoticeOfIntentSentToClaimant === 'Yes'}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault5">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check pl-5">
                                            <input className="form-check-input" type="radio" name="NoticeOfIntentSentToClaimant" id="flexRadioDefault6"
                                                value="No"
                                                onChange={handleChange}
                                                checked={value.NoticeOfIntentSentToClaimant === 'No'}

                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault6">
                                                No
                                            </label>
                                        </div>
                                        <div className="form-check pl-5">
                                            <input className="form-check-input" type="radio" name="NoticeOfIntentSentToClaimant" id="flexRadioDefault6"
                                                value="N/A"
                                                onChange={handleChange}
                                                checked={value.NoticeOfIntentSentToClaimant === 'N/A'}
                                            />
                                            <label className="form-check-label" htmlFor="flexRadioDefault6">
                                                N/A
                                            </label>
                                        </div>
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Date notice sent:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='NoticeSentDt'
                                            onChange={(e) => handleDateChange(e.target.value, 'NoticeSentDt')}
                                            value={value.NoticeSentDt}
                                        />

                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Sent by:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='SentBy' onChange={HandleChange} value={value?.SentBy} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Signature of chief trial attorney approving destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='SignCTAttorneyAppDes' onChange={HandleChange} value={value?.SignCTAttorneyAppDes} />
                                    </div>
                                </td>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Date Of Approval:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='ApprovalDT'
                                            onChange={(e) => handleDateChange(e.target.value, 'ApprovalDT')}
                                            value={value.ApprovalDT}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Property delivered by:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='PropertydeliveredBy' onChange={HandleChange} value={value?.PropertydeliveredBy} />
                                    </div>
                                </td>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Date Of delivery:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='DateOfDelivery'
                                            onChange={(e) => handleDateChange(e.target.value, 'DateOfDelivery')}
                                            value={value.DateOfDelivery}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Property received by:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='PropertyReceivedBy' onChange={HandleChange} value={value?.PropertyReceivedBy} />
                                    </div>
                                </td>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Date Of receipt:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input
                                            type="text"
                                            className='py-1'
                                            name='DateOfReceipt'
                                            onChange={(e) => handleDateChange(e.target.value, 'DateOfReceipt')}
                                            value={value.DateOfReceipt}
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Date of destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='DateOfDestruction'
                                            onChange={(date) => { setDateOfDestruction(date); setValue({ ...value, ['DateOfDestruction']: date ? getShowingMonthDateYear(date) : null }) }}
                                        //  value={value?.DateOfDestruction} 
                                        />
                                    </div>
                                </td>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Place of destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='PlaceOfDestruction' onChange={HandleChange} value={value?.PlaceOfDestruction} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Method of destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='MethodOfDestruction' onChange={HandleChange} value={value?.MethodOfDestruction} />
                                    </div>
                                </td>
                                <td className='col-6'>
                                    <span className='prop-td'>
                                        Property of destruction:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <input type="text" className=' py-1 ' name='PropertyOfDestruction' onChange={HandleChange} value={value?.PropertyOfDestruction} />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class="table table-bordered">
                        <tbody>
                            <tr>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Signature of person (s) delivering property:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-4 text-field">
                                        <textarea id="" cols="30" rows='2' name='SignOfPersonDeliverProp' onChange={HandleChange} value={value?.SignOfPersonDeliverProp}></textarea>
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Signature of person (s) receiving property:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-4 text-field">
                                        <textarea id="" cols="30" rows='2' name='SignOfPersonReceiveProp' onChange={HandleChange} value={value?.SignOfPersonReceiveProp}></textarea>
                                    </div>
                                </td>
                                <td className='col-4'>
                                    <span className='prop-td'>
                                        Signature of person (s) dest and/or wit destruction of prop:
                                    </span>
                                    <div className="col-12 col-md-12 col-lg-12  mt-1 text-field">
                                        <textarea id="" cols="30" rows='2' name='SignOfPersonDestWitDesProp' onChange={HandleChange} value={value?.SignOfPersonDestWitDesProp}></textarea>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                  
                </div>
            }
        </>
    )
}

export default EvidenceDestructionModel