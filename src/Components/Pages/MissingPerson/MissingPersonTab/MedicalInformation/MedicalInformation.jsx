import React, { useContext, useEffect, useState } from 'react'
import { colourStyles, customStylesWithOutColor } from '../../../../Common/Utility';
import DatePicker from "react-datepicker";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { useDispatch } from 'react-redux';
import Select from "react-select";
import { get_BloodType_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import ChangesModal from '../../../../Common/ChangesModal';
import { PhoneFieldNotReq } from '../../../Agency/AgencyValidation/validators';

const MedicalInformation = (props) => {
    const dispatch = useDispatch();
    const { DecMissPerID } = props

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecIncID = 0;
    let DecHobID = 0;
    const query = useQuery();
    var openPage = query?.get('page');
    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var HobID = query?.get("HobID");
    var HobSta = query?.get("HobSta");
    let MstPage = query?.get('page');

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const bloodTypeDrpData = useSelector((state) => state.DropDown.bloodTypeDrpData);
    const { setChangesStatus, get_MissingPerson_Count, GetDataTimeZone, datezone } = useContext(AgencyContext);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const arresteeNameMissingData = useSelector((state) => state.DropDown.arresteeNameMissingData);

    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [Editval, setEditval] = useState();
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [errors, setErrors] = useState({
        'TelephoneNumberError': '',
        'OpticalTelephoneNumberError': '',
        'AuthorizationTelephoneNumberError': '',
        'AgencyTelephoneError': ''
    });

    const [value, setValue] = useState({
        'MissingPersonID': '',
        'Description': '',
        'MedicalInformationDtTm': '',
        'CreatedByUserFK': '',
        // Medical Info
        MedicalIsRecord: true,
        MedicalIsIssues: true,
        MedicalTypeIssues: '',
        MedicalPrescription: '',
        MissingPersonNameID: '',
        dateOfBirth: "",
        DateOfLastContact: "",
        InvestigationAgency: '',
        AgencyTelephone: '',
        InvestigationOfficers: '',
        xRaysAvailable: true,
        BodyXrayWhere: '',
        NameOfMedicalDoctor: '',
        BloodTypeID: '',
        TelephoneNumber: '',
        StreetAdd: '',
        CityStateZip: '',

        // Optical
        OpticalIsGlassesOrContact: true,
        OpticalWhatKindGlassesOrContact: '',
        OpticalWhatTypeOfFramGlasses: '',
        OpticalPrescriptionRightEye: '',
        OpticalPrescriptionLeftEye: '',
        NameOfOpticion: '',
        OpticalTelephoneNumber: '',
        OpticalStreetAdd: '',
        OpticalCityStateZip: '',

        // Authorization to Release Medical Records
        AuthorizationSignatureOfParent: '',
        AuthorizationDate: "",
        AuthorizationPrintedName: '',
        AuthorizationRelationship: '',
        AuthorizationTelephoneNumber: '',
        AuthorizationStreetAdd: '',
        AuthorizationCityStateZip: '',

        // Internal Characteristics Coding Sheet
        InternalCharacteristicsCodingSheet: '',
    })

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID);
            setloginPinID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("M125", localStoreData?.AgencyID, localStoreData?.PINID));
            get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        }
        else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({ ...value, 'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID });
        }

        if (bloodTypeDrpData?.length === 0) { dispatch(get_BloodType_Drp_Data(loginAgencyID)) }

    }, [loginAgencyID]);

    useEffect(() => {
        if (DecMissPerID) {
            GetSingleData_MedicalInformation_Data(DecMissPerID);
        }
    }, [DecMissPerID]);


    useEffect(() => {
        if (Editval) {
            setValue({
                ...value,
                'MissingPersonID': Editval[0]?.MissingPersonID,
                'Description': Editval[0]?.Description,
                'MedicalInformationDtTm': Editval[0]?.MedicalInformationDtTm,
                'MedicalInformationID': Editval[0]?.MedicalInformationID,
                'ModifiedByUserFK:': '',
                'MedicalIsRecord': Editval[0]?.MedicalIsRecord,
                'MedicalIsIssues': Editval[0]?.MedicalIsIssues,
                'MedicalTypeIssues': Editval[0]?.MedicalTypeIssues,
                'MedicalPrescription': Editval[0]?.MedicalPrescription,
                'MissingPersonNameID': arresteeNameMissingData?.filter((obj) => obj.value === Editval[0]?.MissingPersonNameID)[0]?.label || '',
                'dateOfBirth': Editval[0]?.dateOfBirth ? new Date(Editval[0]?.dateOfBirth) : "",
                'DateOfLastContact': Editval[0]?.DateOfLastContact ? new Date(Editval[0]?.DateOfLastContact) : "",
                'InvestigationAgency': Editval[0]?.InvestigationAgency,
                'AgencyTelephone': Editval[0]?.AgencyTelephone,
                'InvestigationOfficers': Editval[0]?.InvestigationOfficers,
                'xRaysAvailable': Editval[0]?.xRaysAvailable,
                'BodyXrayWhere': Editval[0]?.BodyXrayWhere,
                'NameOfMedicalDoctor': Editval[0]?.NameOfMedicalDoctor,
                'BloodTypeID': Editval[0]?.BloodTypeID,
                'TelephoneNumber': Editval[0]?.TelephoneNumber,
                'StreetAdd': Editval[0]?.StreetAdd,
                'CityStateZip': Editval[0]?.CityStateZip,
                'OpticalIsGlassesOrContact': Editval[0]?.OpticalIsGlassesOrContact,
                'OpticalWhatKindGlassesOrContact': Editval[0]?.OpticalWhatKindGlassesOrContact,
                'OpticalWhatTypeOfFramGlasses': Editval[0]?.OpticalWhatTypeOfFramGlasses,
                'OpticalPrescriptionRightEye': Editval[0]?.OpticalPrescriptionRightEye,
                'OpticalPrescriptionLeftEye': Editval[0]?.OpticalPrescriptionLeftEye,
                'NameOfOpticion': Editval[0]?.NameOfOpticion,
                'OpticalTelephoneNumber': Editval[0]?.OpticalTelephoneNumber,
                'OpticalStreetAdd': Editval[0]?.OpticalStreetAdd,
                'OpticalCityStateZip': Editval[0]?.OpticalCityStateZip,
                'AuthorizationSignatureOfParent': Editval[0]?.AuthorizationSignatureOfParent,
                'AuthorizationDate': Editval[0]?.AuthorizationDate ? new Date(Editval[0]?.AuthorizationDate) : null,
                'AuthorizationPrintedName': Editval[0]?.AuthorizationPrintedName,
                'AuthorizationRelationship': Editval[0]?.AuthorizationRelationship,
                'AuthorizationTelephoneNumber': Editval[0]?.AuthorizationTelephoneNumber,
                'AuthorizationStreetAdd': Editval[0]?.AuthorizationStreetAdd,
                'AuthorizationCityStateZip': Editval[0]?.AuthorizationCityStateZip,
                'InternalCharacteristicsCodingSheet': Editval[0]?.InternalCharacteristicsCodingSheet,
                'ModifiedByUserFK': loginPinID,
                'CreatedByUserFK': loginPinID,
            })
        } else {
            setValue({
                ...value, 'MissingPersonID': '', 'Description': '', 'MedicalInformationDtTm': '', 'ModifiedByUserFK:': loginPinID,
            });
        }
    }, [Editval])

    const reset = () => {
        setValue({});
        setStatesChangeStatus(false);
        setErrors({
            'TelephoneNumberError': '',
            'OpticalTelephoneNumberError': '',
            'AuthorizationTelephoneNumberError': '',
            'AgencyTelephoneError': ''
        });
    }

    const setStatusFalse = () => {
        reset();
        setChangesStatus(false)
    }

    const GetSingleData_MedicalInformation_Data = (ID) => {
        const val = { 'MissingPersonID': ID }
        fetchPostData('MissingPerson/Getsingal_MissingPerson', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                } else {
                    setEditval([])
                }
            })
    }

    const update_medicalInformation_data = () => {
        // Validate all phone fields first
        let telephoneNumberErr = '';
        let opticalTelephoneNumberErr = '';
        let authorizationTelephoneNumberErr = '';
        let hasErrors = false;

        // Validate TelephoneNumber (Medical Doctor)
        if (value.TelephoneNumber) {
            telephoneNumberErr = PhoneFieldNotReq(value.TelephoneNumber);
            if (telephoneNumberErr === 'true') {
                // Validation passed
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        TelephoneNumberError: 'true'
                    }
                });
            } else {
                // Validation failed - has error message
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        TelephoneNumberError: telephoneNumberErr
                    }
                });
                hasErrors = true;
            }
        } else {
            // Empty field - no validation needed
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    TelephoneNumberError: ''
                }
            });
        }

        // Validate OpticalTelephoneNumber
        if (value.OpticalTelephoneNumber) {
            opticalTelephoneNumberErr = PhoneFieldNotReq(value.OpticalTelephoneNumber);
            if (opticalTelephoneNumberErr === 'true') {
                // Validation passed
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        OpticalTelephoneNumberError: 'true'
                    }
                });
            } else {
                // Validation failed - has error message
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        OpticalTelephoneNumberError: opticalTelephoneNumberErr
                    }
                });
                hasErrors = true;
            }
        } else {
            // Empty field - no validation needed
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    OpticalTelephoneNumberError: ''
                }
            });
        }

        // Validate AuthorizationTelephoneNumber
        if (value.AuthorizationTelephoneNumber) {
            authorizationTelephoneNumberErr = PhoneFieldNotReq(value.AuthorizationTelephoneNumber);
            if (authorizationTelephoneNumberErr === 'true') {
                // Validation passed
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        AuthorizationTelephoneNumberError: 'true'
                    }
                });
            } else {
                // Validation failed - has error message
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        AuthorizationTelephoneNumberError: authorizationTelephoneNumberErr
                    }
                });
                hasErrors = true;
            }
        } else {
            // Empty field - no validation needed
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    AuthorizationTelephoneNumberError: ''
                }
            });
        }

        // Validate AgencyTelephone
        let agencyTelephoneErr = '';
        if (value.AgencyTelephone) {
            agencyTelephoneErr = PhoneFieldNotReq(value.AgencyTelephone);
            if (agencyTelephoneErr === 'true') {
                // Validation passed
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        AgencyTelephoneError: 'true'
                    }
                });
            } else {
                // Validation failed - has error message
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        AgencyTelephoneError: agencyTelephoneErr
                    }
                });
                hasErrors = true;
            }
        } else {
            // Empty field - no validation needed
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    AgencyTelephoneError: ''
                }
            });
        }

        // If no errors, proceed with save
        if (!hasErrors) {
            const { MissingPersonNameID, ...val } = value || {};
            AddDeleteUpadate('MissingPerson/MedicalDetails_Update', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                GetSingleData_MedicalInformation_Data(DecMissPerID);
                setStatusFalse()
                setStatesChangeStatus(false);
                setChangesStatus(false);
            })
        }
    }




    const handleInputChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        const { name, value, type, checked } = e.target;

        if (name === 'TelephoneNumber' || name === 'OpticalTelephoneNumber' || name === 'AuthorizationTelephoneNumber' || name === 'AgencyTelephone') {
            // Format phone number as XXX-XXX-XXXX
            let ele = value.replace(/\D/g, '');
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue(prev => ({ ...prev, [name]: match[1] + '-' + match[2] + '-' + match[3] }));
                    setErrors(prev => ({ ...prev, [name + 'Error']: '' }));
                }
            } else {
                ele = value.split('-').join('').replace(/\D/g, '');
                setValue(prev => ({ ...prev, [name]: ele }));
                setErrors(prev => ({ ...prev, [name + 'Error']: '' }));
            }
        } else {
            setValue(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleDateChange = (date, name) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        setValue(prev => ({ ...prev, [name]: date ? new Date(date) : null }));
    };

    const handleDropDownChange = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else if (e === null) {
            setValue({ ...value, [name]: null })
        } else {
            setValue({ ...value, [name]: null })
        }
    }


    return (
        <>
            <div className="col-12  child" >
                {/* Detailed Medical Information UI (per mock) */}
                <fieldset className='mt-2'>
                    <legend>Medical Info</legend>
                    <div className="col-12">
                        <div className="row align-items-center">
                            <div className="col-6 col-md-4 col-lg-3 mt-2">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Medical Records Available?</label>
                                    <div className='d-flex align-items-center'>
                                        <input type='radio' name='MedicalIsRecord' checked={!!value.MedicalIsRecord} onChange={(e) => {
                                            setValue(prev => ({ ...prev, MedicalIsRecord: true }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span className='mr-2'>Yes</span>
                                        <input type='radio' name='MedicalIsRecord' checked={!value.MedicalIsRecord} onChange={(e) => {
                                            setValue(prev => ({ ...prev, MedicalIsRecord: false }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="row align-items-center">

                            <div className="col-2 col-md-4 col-lg-3 mt-2">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Medical Issues?</label>
                                    <div className='d-flex align-items-center'>
                                        <input type='radio' name='MedicalIsIssues' checked={!!value.MedicalIsIssues} onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                MedicalIsIssues: true,
                                                MedicalTypeIssues: prev.MedicalTypeIssues,
                                                MedicalPrescription: prev.MedicalPrescription
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span className='mr-2'>Yes</span>
                                        <input type='radio' name='MedicalIsIssues' checked={!value.MedicalIsIssues} onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                MedicalIsIssues: false,
                                                MedicalTypeIssues: '',
                                                MedicalPrescription: ''
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-5 col-md-4 col-lg-4 mt-2">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>If "Yes," Type of Issue?</label>
                                    <input
                                        type='text'
                                        name='MedicalTypeIssues'
                                        value={value.MedicalTypeIssues}
                                        onChange={handleInputChange}
                                        className='form-control'
                                        disabled={!value.MedicalIsIssues}
                                        placeholder=''
                                    />
                                </div>
                            </div>
                            <div className="col-5 col-md-4 col-lg-5 mt-2">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0'>Prescription</label>
                                    <input
                                        type='text'
                                        name='MedicalPrescription'
                                        value={value.MedicalPrescription}
                                        onChange={handleInputChange}
                                        className='form-control'
                                        disabled={!value.MedicalIsIssues}
                                        placeholder=''
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-6 col-md-5 col-lg-4">

                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Missing Person's Name</label>
                                    <input type='text' name='MissingPersonNameID'
                                        value={value.MissingPersonNameID}
                                        readOnly
                                        className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 " >
                                <label className='new-label right-align text-right mb-0'>Date of Birth</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <DatePicker
                                        name="dateOfBirth"
                                        id="dateOfBirth"
                                        className="form-control"
                                        onChange={(date) => handleDateChange(date, 'dateOfBirth')}
                                        selected={value.dateOfBirth ? value.dateOfBirth && new Date(value.dateOfBirth) : null}
                                        dateFormat="MM/dd/yyyy"
                                        isClearable={!!value.dateOfBirth}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete="off"
                                        placeholderText="Select..."
                                        maxDate={new Date(datezone)}
                                    />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 d-flex justify-content-center" >
                                <label className='new-label right-align text-right mb-0'>Date of Last Contact</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <DatePicker
                                        name="DateOfLastContact"
                                        id="DateOfLastContact"
                                        className="form-control"
                                        onChange={(date) => handleDateChange(date, 'DateOfLastContact')}
                                        selected={value.DateOfLastContact ? value.DateOfLastContact && new Date(value.DateOfLastContact) : null}
                                        dateFormat="MM/dd/yyyy"
                                        isClearable={!!value.DateOfLastContact}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete="off"
                                        placeholderText=""
                                        maxDate={new Date(datezone)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-6 col-md-4 col-lg-4">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Investigation Agency</label>
                                    <input type='text' name='InvestigationAgency' value={value.InvestigationAgency} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1" >
                                <label className='new-label right-align text-right mb-0'>Agency Telephone #
                                    {errors.AgencyTelephoneError && errors.AgencyTelephoneError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AgencyTelephoneError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='AgencyTelephone' value={value.AgencyTelephone} onChange={handleInputChange} className={errors.AgencyTelephoneError && errors.AgencyTelephoneError !== 'true' ? 'form-control requiredColor' : 'form-control'} placeholder='' maxLength={10} />
                                </div>
                            </div>
                            <div className="col-4 col-md-4 col-lg-4">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Investigation Officers</label>
                                    {/* <input type='text' name='InvestigationOfficers' value={value.InvestigationOfficers} onChange={handleInputChange} className='form-control' placeholder='Select' /> */}
                                    <Select
                                        name='InvestigationOfficers'
                                        styles={colourStyles}
                                        value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.InvestigationOfficers)}
                                        isClearable
                                        options={agencyOfficerDrpData}
                                        onChange={(e) => handleDropDownChange(e, 'InvestigationOfficers')}
                                        placeholder="Select..."
                                        className='w-100'
                                    />
                                </div>
                            </div>



                        </div>
                        <div className='row mt-2 align-items-center'>

                            <div className="col-6 col-md-6 col-lg-4">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Are body X-rays Available?</label>
                                    <div className='d-flex align-items-center'>
                                        <input type='radio' name='xRaysAvailable' checked={!!value.xRaysAvailable} onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                xRaysAvailable: true,
                                                BodyXrayWhere: prev.BodyXrayWhere
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span className='mr-2'>Yes</span>
                                        <input type='radio' name='xRaysAvailable' checked={!value.xRaysAvailable} onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                xRaysAvailable: false,
                                                BodyXrayWhere: ''
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 " >
                                <label className='new-label right-align text-right mb-0'>Where?</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-7">
                                <div className="d-flex align-items-center">
                                    <input
                                        type='text'
                                        name='BodyXrayWhere'
                                        value={value.BodyXrayWhere}
                                        onChange={handleInputChange}
                                        className='form-control'
                                        disabled={!value.xRaysAvailable}
                                        placeholder=''
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                            <div className="col-6 col-md-4 col-lg-4">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Name of Medical Doctor</label>
                                    <input type='text' name='NameOfMedicalDoctor' value={value.NameOfMedicalDoctor} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 " >
                                <label className='new-label right-align text-right mb-0'>Blood Type</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <Select
                                        styles={customStylesWithOutColor}
                                        name="BloodTypeID"
                                        value={bloodTypeDrpData?.filter((obj) => obj.value === value?.BloodTypeID)}
                                        options={bloodTypeDrpData}
                                        onChange={(e) => { handleDropDownChange(e, 'BloodTypeID') }}

                                        isClearable
                                        placeholder="Select..."
                                        className='w-100'
                                    />

                                </div>
                            </div>

                            <div className="col-1 col-md-1 col-lg-1 " >
                                <label className='new-label right-align text-right mb-0'>Telephone Number
                                    {errors.TelephoneNumberError && errors.TelephoneNumberError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.TelephoneNumberError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='TelephoneNumber' value={value.TelephoneNumber} onChange={handleInputChange} className={errors.TelephoneNumberError && errors.TelephoneNumberError !== 'true' ? 'form-control requiredColor' : 'form-control'} placeholder='' maxLength={10} />
                                </div>
                            </div>

                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-8 col-md-8 col-lg-8">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Street Address</label>
                                    <input type='text' name='StreetAdd' value={value.StreetAdd} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 " >
                                <label className='new-label right-align text-right mb-0'>City, State, Zip</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='CityStateZip' value={value.CityStateZip} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className='mt-2'>
                    <legend>Optical</legend>
                    <div className='col-12'>
                        <div className='row align-items-center'>
                            <div className='col-6 col-md-3 col-lg-3 mt-2'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Glasses or Contact Lenses?</label>
                                    <div className='d-flex align-items-center'>
                                        <input type='radio' name='OpticalIsGlassesOrContact' checked={!!value.OpticalIsGlassesOrContact} onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                OpticalIsGlassesOrContact: true,
                                                OpticalWhatKindGlassesOrContact: prev.OpticalWhatKindGlassesOrContact,
                                                OpticalWhatTypeOfFramGlasses: prev.OpticalWhatTypeOfFramGlasses
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span className='mr-2'>Yes</span>
                                        <input type='radio' name='OpticalIsGlassesOrContact' checked={!value.OpticalIsGlassesOrContact} onChange={(e) => {
                                            setValue(prev => ({
                                                ...prev,
                                                OpticalIsGlassesOrContact: false,
                                                OpticalWhatKindGlassesOrContact: '',
                                                OpticalWhatTypeOfFramGlasses: ''
                                            }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }} className='mr-1' />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-6 col-md-4 col-lg-4 mt-2'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>If contact lenses, what kind?</label>
                                    <input
                                        type='text'
                                        name='OpticalWhatKindGlassesOrContact'
                                        value={value.OpticalWhatKindGlassesOrContact}
                                        onChange={handleInputChange}
                                        className='form-control'
                                        disabled={!value.OpticalIsGlassesOrContact}
                                        placeholder=''
                                    />
                                </div>
                            </div>
                            <div className='col-6 col-md-5 col-lg-5 mt-2'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>If glasses, what type of frame?</label>
                                    <input
                                        type='text'
                                        name='OpticalWhatTypeOfFramGlasses'
                                        value={value.OpticalWhatTypeOfFramGlasses}
                                        onChange={handleInputChange}
                                        className='form-control'
                                        disabled={!value.OpticalIsGlassesOrContact}
                                        placeholder=''
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className='col-6 col-md-6 col-lg-6'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Prescription: Right Eye</label>
                                    <input type='text' name='OpticalPrescriptionRightEye' value={value.OpticalPrescriptionRightEye} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className='col-6 col-md-6 col-lg-6'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Prescription: Left Eye</label>
                                    <input type='text' name='OpticalPrescriptionLeftEye' value={value.OpticalPrescriptionLeftEye} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>

                        </div>
                        <div className='row mt-2 align-items-center'>
                            <div className='col-6 col-md-8 col-lg-8'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Name of Optician, Optometrist, or Ophthalmologist</label>
                                    <input type='text' name='NameOfOpticion' value={value.NameOfOpticion} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1" >
                                <label className='new-label right-align text-right mb-0'>Telephone Number
                                    {errors.OpticalTelephoneNumberError && errors.OpticalTelephoneNumberError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OpticalTelephoneNumberError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className='col-5 col-md-3 col-lg-3'>
                                <div className="d-flex align-items-center">

                                    <input type='text' name='OpticalTelephoneNumber' value={value.OpticalTelephoneNumber} onChange={handleInputChange} className={errors.OpticalTelephoneNumberError && errors.OpticalTelephoneNumberError !== 'true' ? 'form-control requiredColor' : 'form-control'} placeholder='' maxLength={10} />
                                </div>
                            </div>

                        </div>
                        <div className='row mt-2 align-items-center'>

                            <div className='col-6 col-md-8 col-lg-8'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Street Address</label>
                                    <input type='text' name='OpticalStreetAdd' value={value.OpticalStreetAdd} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1" >
                                <label className='new-label right-align text-right mb-0'>City, State, Zip</label>
                            </div>
                            <div className='col-5 col-md-2 col-lg-3'>
                                <div className="d-flex align-items-center">
                                    <input type='text' name='OpticalCityStateZip' value={value.OpticalCityStateZip} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className='mt-2'>
                    <legend>Authorization to Release Medical Records</legend>
                    <div className='col-12'>
                        <div className='row align-items-center'>
                            <div className='col-6 col-md-8 col-lg-8 mt-2'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Signature of Parent/Legal Guardian/Next of Kin</label>
                                    <input type='text' name='AuthorizationSignatureOfParent' value={value.AuthorizationSignatureOfParent} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 " >
                                <label className='new-label right-align text-right mb-0'>Date</label>
                            </div>

                            <div className='col-5 col-md-3 col-lg-3 mt-2'>
                                <div className="d-flex align-items-center">

                                    {/* <DatePicker
                                    selected={value.AuthorizationDate}
                                    onChange={(date) => setValue(prev => ({ ...prev, AuthorizationDate: date }))}
                                    className='form-control'
                                    placeholderText='Select'
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode='select'
                                /> */}
                                    <DatePicker
                                        name="AuthorizationDate"
                                        id="AuthorizationDate"
                                        className="form-control"
                                        onChange={(date) => handleDateChange(date, 'AuthorizationDate')}
                                        selected={value.AuthorizationDate ? value.AuthorizationDate && new Date(value.AuthorizationDate) : null}
                                        dateFormat="MM/dd/yyyy"
                                        isClearable={!!value.AuthorizationDate}
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        autoComplete="off"
                                        placeholderText="Select..."
                                        minDate={new Date(datezone)}
                                    />

                                </div>
                            </div>
                        </div>
                        <div className='row mt-2 align-items-center'>
                            <div className='col-6 col-md-4 col-lg-4'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Printed Name</label>
                                    <input type='text' name='AuthorizationPrintedName' value={value.AuthorizationPrintedName} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className='col-6 col-md-4 col-lg-4'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Relationship</label>
                                    <input type='text' name='AuthorizationRelationship' value={value.AuthorizationRelationship} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 " >
                                <label className='new-label right-align text-right mb-0'>Telephone Number
                                    {errors.AuthorizationTelephoneNumberError && errors.AuthorizationTelephoneNumberError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AuthorizationTelephoneNumberError}</p>
                                    ) : null}
                                </label>
                            </div>


                            <div className='col-5 col-md-3 col-lg-3'>
                                <div className="d-flex align-items-center">

                                    <input type='text' name='AuthorizationTelephoneNumber' value={value.AuthorizationTelephoneNumber} onChange={handleInputChange} className={errors.AuthorizationTelephoneNumberError && errors.AuthorizationTelephoneNumberError !== 'true' ? 'form-control requiredColor' : 'form-control'} placeholder='' maxLength={10} />
                                </div>
                            </div>

                        </div>
                        <div className='row mt-2 align-items-center'>
                            <div className='col-6 col-md-8 col-lg-8'>
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap text-right' style={{ minWidth: '160px', flexShrink: 0 }}>Street Address</label>
                                    <input type='text' name='AuthorizationStreetAdd' value={value.AuthorizationStreetAdd} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-1 col-md-1 col-lg-1 " >
                                <label className='new-label right-align text-right'>City, State, Zip</label>
                            </div>
                            <div className='col-5 col-md-3 col-lg-3'>
                                <div className="d-flex align-items-center">
                                    <input type='text' name='AuthorizationCityStateZip' value={value.AuthorizationCityStateZip} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className='mt-2'>
                    <legend>Internal Characteristics Coding Sheet</legend>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-12'>

                                <label className='new-label mr-2 my-2'>This sheet may be used by the next of kin or physician to list or describe additional characteristics that may not be readily visible, such as surgical procedures and missing organs. Information documented on this sheet should be coded by the NCIC operator and added to the missing person record.</label>
                                <textarea
                                    name='InternalCharacteristicsCodingSheet'
                                    value={value.InternalCharacteristicsCodingSheet}
                                    onChange={handleInputChange}
                                    className='form-control'
                                    rows='4'
                                    placeholder=''
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div className="col-12 text-right mt-2 p-0">
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success  mr-4" disabled={!statesChangeStatus} onClick={() => { update_medicalInformation_data(); }} >Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success  mr-4" disabled={!statesChangeStatus} onClick={() => { update_medicalInformation_data(); }} >Update</button>
                    }
                </div>

                <ChangesModal func={update_medicalInformation_data} setToReset={reset} />
            </div>
        </>
    )
}

export default MedicalInformation;