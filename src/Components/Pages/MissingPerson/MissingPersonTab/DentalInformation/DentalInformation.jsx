import React, { useContext, useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, base64ToString, colourStyles } from '../../../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { get_Jwellery_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import { PhoneFieldNotReq } from '../../../Agency/AgencyValidation/validators';

const DentalInformation = (props) => {

    const { DecMissPerID } = props;
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecIncID = 0;
    let DecJewID = 0;
    const query = useQuery();
    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var JewID = query?.get("JewID");
    var JewSta = query?.get("JewSta");
    let MstPage = query?.get('page');

    if (!IncID) { DecIncID = 0; }
    else { DecIncID = parseInt(base64ToString(IncID)); }

    if (!JewID) { DecJewID = 0; }
    else { DecJewID = parseInt(base64ToString(JewID)); }

    const dispatch = useDispatch();

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const jwelleryTypeDrpData = useSelector((state) => state.DropDown.JwelleryDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const { setChangesStatus, get_MissingPerson_Count, datezone } = useContext(AgencyContext);

    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [dentalInfoID, setDentalInfoID] = useState(null);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [errors, setErrors] = useState({
        'dentistTelephoneError': '',
        'telephoneError': ''
    });
    const initialValue = {
        'MissingPersonID': '', 'JewelleryTypeID': '', 'Description': '', 'CreatedByUserFK': '',

        // Dental Info
        dentalRecordAvailable: "",
        dentistName: '',
        dentistStreetAddress: '',
        dentistTelephone: '',
        dentistCityStateZip: '',

        // Dental Data Checklist
        allDentalInfoCollected: "",
        photographsCollected: "",
        recordsGivenToAgency: "",
        dentalConditionWorksheetCompleted: false,
        ncicDentalReportCompleted: "",

        // Dental Condition Worksheet - Tooth conditions (1-32)
        toothConditions: {},

        // Additional Dental Information
        additionalDentalInfo: '',

        // NCIC Missing Person Dental Report
        patientName: '',
        ageAtDisappearance: '',
        ncicNumber: '',
        NcicPinID: '',
        dateCompleted: "",
        address: '',
        telephone: '',
        emailAddress: '',
        xRaysAvailable: "",
        dentalModelsAvailable: "",
        dentalPhotographsAvailable: "",

        // Dental Characteristics - Individual tooth fields
        // Upper Right
        tooth_UR_01_18: '',
        tooth_UR_02_17: '',
        tooth_UR_03_16: '',
        tooth_UR_04_15_A: '',
        tooth_UR_05_14_B: '',
        tooth_UR_06_13_C: '',
        tooth_UR_07_12_D: '',
        tooth_UR_08_11_E: '',

        // Upper Left
        tooth_UL_09_21_F: '',
        tooth_UL_10_22_G: '',
        tooth_UL_11_23_H: '',
        tooth_UL_12_24_I: '',
        tooth_UL_13_25_J: '',
        tooth_UL_14_26: '',
        tooth_UL_15_27: '',
        tooth_UL_16_28: '',

        // Lower Right
        tooth_LR_32_48: '',
        tooth_LR_31_47: '',
        tooth_LR_30_46: '',
        tooth_LR_29_45: '',
        tooth_LR_28_44_T: '',
        tooth_LR_27_43_S: '',
        tooth_LR_26_42_R: '',
        tooth_LR_25_41_Q: '',

        // Lower Left
        tooth_LL_24_31_O: '',
        tooth_LL_23_32_N: '',
        tooth_LL_22_33_M: '',
        tooth_LL_21_34_L: '',
        tooth_LL_20_35_K: '',
        tooth_LL_19_36: '',
        tooth_LL_18_37: '',
        tooth_LL_17_38: '',

        // Dental Codes and Remarks
        IsDentalRemarksAllUNK: "",
        DentalRemarksDescription: ''
    }
    const [value, setValue] = useState(initialValue);

    const reset = () => {
        setValue(initialValue);
        setStatesChangeStatus(false);
        setErrors({
            'dentistTelephoneError': '',
            'telephoneError': ''
        });
    }

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId)
                dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID);
            setloginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("M124", localStoreData?.AgencyID, localStoreData?.PINID));
            get_MissingPerson_Count(DecMissPerID, localStoreData?.PINID);
            if (jwelleryTypeDrpData?.length === 0) {
                dispatch(get_Jwellery_Drp_Data(localStoreData?.AgencyID))
            }
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
            setValue({
                ...value, 'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID
            });
        }
        getDentalInfo();

    }, [loginAgencyID]);

    const setStatusFalse = () => {
        reset();
        setChangesStatus(false)
    }

    const getDentalInfo = () => {
        const val = { 'MissingPersonID': DecMissPerID };
        fetchPostData('MissingPersonDentalInformation/GetData_MissingPersonDentalInformation', val)
            .then((res) => {
                if (res && res.length > 0) {
                    const d = res[0];
                    // Map tooth conditions 1..32
                    const tc = {};
                    for (let i = 1; i <= 32; i += 1) {
                        tc[i] = d[`DentalCondition${i}`] || '';
                    }
                    setDentalInfoID(d?.DentalInfoID || null);
                    setValue(prev => ({
                        ...prev,
                        MissingPersonID: d?.MissingPersonID || DecMissPerID,
                        CreatedByUserFK: loginPinID,

                        dentalRecordAvailable: d?.IsDentalRecord === true || d?.IsDentalRecord === 'true',
                        dentistName: d?.NameOfDentist || '',
                        dentistTelephone: d?.TelephoneNumber || '',
                        dentistStreetAddress: d?.StreetAdd || '',
                        dentistCityStateZip: d?.CityStateZip || '',

                        allDentalInfoCollected: d?.IsDentalAll === true || d?.IsDentalAll === 'true',
                        photographsCollected: d?.IsDentalPhotographs === true || d?.IsDentalPhotographs === 'true',
                        recordsGivenToAgency: d?.IsDentalRecords === true || d?.IsDentalRecords === 'true',
                        dentalConditionWorksheetCompleted: d?.IsDentalCompletedWorksheet === true || d?.IsDentalCompletedWorksheet === 'true',
                        ncicDentalReportCompleted: d?.IsDentalCompletedNCICReport === true || d?.IsDentalCompletedNCICReport === 'true',

                        toothConditions: tc,

                        additionalDentalInfo: d?.AdditionalDentalInfo || '',

                        patientName: d?.NCICPatientName || '',
                        ageAtDisappearance: d?.NcicAgeAtDisappearance || '',
                        ncicNumber: d?.NCICNo || '',
                        NcicPinID: d?.NcicPinID || '',
                        dateCompleted: d?.NcicDateCompleted ? new Date(d.NcicDateCompleted) : "",

                        address: d?.NcicAddress || '',
                        telephone: d?.NcicTelephoneNumber || '',
                        emailAddress: d?.NcicEmail || '',
                        xRaysAvailable: d?.NcicXRay === true || d?.NcicXRay === 'true',
                        dentalModelsAvailable: d?.NcicDentalModelsAvailable === true || d?.NcicDentalModelsAvailable === 'true',
                        dentalPhotographsAvailable: d?.NcicDentalPhotogrphs === true || d?.NcicDentalPhotogrphs === 'true',

                        tooth_UR_01_18: d?.UpperRight1 || '',
                        tooth_UR_02_17: d?.UpperRight2 || '',
                        tooth_UR_03_16: d?.UpperRight3 || '',
                        tooth_UR_04_15_A: d?.UpperRight4 || '',
                        tooth_UR_05_14_B: d?.UpperRight5 || '',
                        tooth_UR_06_13_C: d?.UpperRight6 || '',
                        tooth_UR_07_12_D: d?.UpperRight7 || '',
                        tooth_UR_08_11_E: d?.UpperRight8 || '',

                        tooth_UL_09_21_F: d?.UpperLeft1 || '',
                        tooth_UL_10_22_G: d?.UpperLeft2 || '',
                        tooth_UL_11_23_H: d?.UpperLeft3 || '',
                        tooth_UL_12_24_I: d?.UpperLeft4 || '',
                        tooth_UL_13_25_J: d?.UpperLeft5 || '',
                        tooth_UL_14_26: d?.UpperLeft6 || '',
                        tooth_UL_15_27: d?.UpperLeft7 || '',
                        tooth_UL_16_28: d?.UpperLeft8 || '',

                        tooth_LR_32_48: d?.LowerRight1 || '',
                        tooth_LR_31_47: d?.LowerRight2 || '',
                        tooth_LR_30_46: d?.LowerRight3 || '',
                        tooth_LR_29_45: d?.LowerRight4 || '',
                        tooth_LR_28_44_T: d?.LowerRight5 || '',
                        tooth_LR_27_43_S: d?.LowerRight6 || '',
                        tooth_LR_26_42_R: d?.LowerRight7 || '',
                        tooth_LR_25_41_Q: d?.LowerRight8 || '',

                        tooth_LL_24_31_O: d?.LowerLeft1 || '',
                        tooth_LL_23_32_N: d?.LowerLeft2 || '',
                        tooth_LL_22_33_M: d?.LowerLeft3 || '',
                        tooth_LL_21_34_L: d?.LowerLeft4 || '',
                        tooth_LL_20_35_K: d?.LowerLeft5 || '',
                        tooth_LL_19_36: d?.LowerLeft6 || '',
                        tooth_LL_18_37: d?.LowerLeft7 || '',
                        tooth_LL_17_38: d?.LowerLeft8 || '',

                        IsDentalRemarksAllUNK: d?.IsDentalRemarksAllUNK === true || d?.IsDentalRemarksAllUNK === 'true',
                        DentalRemarksDescription: d?.DentalRemarksDescription || '',
                    }));
                } else {
                    setDentalInfoID(null);
                }
            })
    }

    const insertDentalInfo = () => {
        // Validate dentistTelephone first
        let dentistTelephoneErr = '';
        let telephoneErr = '';
        let hasErrors = false;

        if (value.dentistTelephone) {
            dentistTelephoneErr = PhoneFieldNotReq(value.dentistTelephone);
            if (dentistTelephoneErr === 'true') {
                setErrors(prevValues => ({ ...prevValues, dentistTelephoneError: 'true' }));
            } else {
                setErrors(prevValues => ({ ...prevValues, dentistTelephoneError: dentistTelephoneErr }));
                hasErrors = true;
            }
        } else {
            setErrors(prevValues => ({ ...prevValues, dentistTelephoneError: '' }));
        }

        // Validate telephone (NCIC section)
        if (value.telephone) {
            telephoneErr = PhoneFieldNotReq(value.telephone);
            if (telephoneErr === 'true') {
                setErrors(prevValues => ({ ...prevValues, telephoneError: 'true' }));
            } else {
                setErrors(prevValues => ({ ...prevValues, telephoneError: telephoneErr }));
                hasErrors = true;
            }
        } else {
            setErrors(prevValues => ({ ...prevValues, telephoneError: '' }));
        }

        // If no errors, proceed with save
        if (!hasErrors) {
            const boolToString = (v) => (v ? 'true' : 'false');

            // Map tooth conditions 1..32
            const toothMap = {};
            for (let i = 1; i <= 32; i += 1) {
                toothMap[`DentalCondition${i}`] = value?.toothConditions?.[i] || '';
            }

            const payload = {
                MissingPersonID: value?.MissingPersonID || DecMissPerID,

                IsDentalRecord: boolToString(!!value?.dentalRecordAvailable),
                NameOfDentist: value?.dentistName || '',
                TelephoneNumber: value?.dentistTelephone || '',
                StreetAdd: value?.dentistStreetAddress || '',
                CityStateZip: value?.dentistCityStateZip || '',

                IsDentalAll: boolToString(!!value?.allDentalInfoCollected),
                IsDentalPhotographs: boolToString(!!value?.photographsCollected),
                IsDentalRecords: boolToString(!!value?.recordsGivenToAgency),
                IsDentalCompletedWorksheet: boolToString(!!value?.dentalConditionWorksheetCompleted),
                IsDentalCompletedNCICReport: boolToString(!!value?.ncicDentalReportCompleted),

                ...toothMap,

                AdditionalDentalInfo: value?.additionalDentalInfo || '',

                NCICPatientName: value?.patientName || '',
                NcicAgeAtDisappearance: value?.ageAtDisappearance || '',
                NCICNo: value?.ncicNumber || '',
                NcicPinID: value?.NcicPinID || '',
                NcicDateCompleted: value?.dateCompleted ? new Date(value.dateCompleted) : '',
                NcicAddress: value?.address || '',
                NcicTelephoneNumber: value?.telephone || '',
                NcicEmail: value?.emailAddress || '',
                NcicXRay: boolToString(!!value?.xRaysAvailable),
                NcicDentalModelsAvailable: boolToString(!!value?.dentalModelsAvailable),
                NcicDentalPhotogrphs: boolToString(!!value?.dentalPhotographsAvailable),

                // Quadrant details
                UpperRight1: value?.tooth_UR_01_18 || '',
                UpperRight2: value?.tooth_UR_02_17 || '',
                UpperRight3: value?.tooth_UR_03_16 || '',
                UpperRight4: value?.tooth_UR_04_15_A || '',
                UpperRight5: value?.tooth_UR_05_14_B || '',
                UpperRight6: value?.tooth_UR_06_13_C || '',
                UpperRight7: value?.tooth_UR_07_12_D || '',
                UpperRight8: value?.tooth_UR_08_11_E || '',

                UpperLeft1: value?.tooth_UL_09_21_F || '',
                UpperLeft2: value?.tooth_UL_10_22_G || '',
                UpperLeft3: value?.tooth_UL_11_23_H || '',
                UpperLeft4: value?.tooth_UL_12_24_I || '',
                UpperLeft5: value?.tooth_UL_13_25_J || '',
                UpperLeft6: value?.tooth_UL_14_26 || '',
                UpperLeft7: value?.tooth_UL_15_27 || '',
                UpperLeft8: value?.tooth_UL_16_28 || '',

                LowerRight1: value?.tooth_LR_32_48 || '',
                LowerRight2: value?.tooth_LR_31_47 || '',
                LowerRight3: value?.tooth_LR_30_46 || '',
                LowerRight4: value?.tooth_LR_29_45 || '',
                LowerRight5: value?.tooth_LR_28_44_T || '',
                LowerRight6: value?.tooth_LR_27_43_S || '',
                LowerRight7: value?.tooth_LR_26_42_R || '',
                LowerRight8: value?.tooth_LR_25_41_Q || '',

                LowerLeft1: value?.tooth_LL_24_31_O || '',
                LowerLeft2: value?.tooth_LL_23_32_N || '',
                LowerLeft3: value?.tooth_LL_22_33_M || '',
                LowerLeft4: value?.tooth_LL_21_34_L || '',
                LowerLeft5: value?.tooth_LL_20_35_K || '',
                LowerLeft6: value?.tooth_LL_19_36 || '',
                LowerLeft7: value?.tooth_LL_18_37 || '',
                LowerLeft8: value?.tooth_LL_17_38 || '',

                // Dental remarks flag
                IsDentalRemarksAllUNK: boolToString(!!value?.IsDentalRemarksAllUNK),
                DentalRemarksDescription: value?.DentalRemarksDescription || '',

                CreatedByUserFK: loginPinID || value?.CreatedByUserFK || ''
            };

            AddDeleteUpadate('MissingPersonDentalInformation/Insert_MissingPersonDentalInformation', payload).then((res) => {
                if (res.success) {

                    toastifySuccess("Inserted Successfully");
                    setStatusFalse()
                    get_MissingPerson_Count(DecMissPerID, loginPinID);
                    getDentalInfo();

                    setStatesChangeStatus(false);
                }
            })
        }
    }

    const updateDentalInfo = () => {
        // Validate dentistTelephone first
        let dentistTelephoneErr = '';
        let telephoneErr = '';
        let hasErrors = false;

        if (value.dentistTelephone) {
            dentistTelephoneErr = PhoneFieldNotReq(value.dentistTelephone);
            if (dentistTelephoneErr === 'true') {
                setErrors(prevValues => ({ ...prevValues, dentistTelephoneError: 'true' }));
            } else {
                setErrors(prevValues => ({ ...prevValues, dentistTelephoneError: dentistTelephoneErr }));
                hasErrors = true;
            }
        } else {
            setErrors(prevValues => ({ ...prevValues, dentistTelephoneError: '' }));
        }

        // Validate telephone (NCIC section)
        if (value.telephone) {
            telephoneErr = PhoneFieldNotReq(value.telephone);
            if (telephoneErr === 'true') {
                setErrors(prevValues => ({ ...prevValues, telephoneError: 'true' }));
            } else {
                setErrors(prevValues => ({ ...prevValues, telephoneError: telephoneErr }));
                hasErrors = true;
            }
        } else {
            setErrors(prevValues => ({ ...prevValues, telephoneError: '' }));
        }

        // If no errors, proceed with update
        if (!hasErrors) {
            const boolVal = (v) => !!v;

            const toothMap = {};
            for (let i = 1; i <= 32; i += 1) {
                toothMap[`DentalCondition${i}`] = value?.toothConditions?.[i] || '';
            }

            const payload = {
                DentalInfoID: dentalInfoID,
                MissingPersonID: value?.MissingPersonID || DecMissPerID,

                IsDentalRecord: boolVal(value?.dentalRecordAvailable),
                NameOfDentist: value?.dentistName || '',
                TelephoneNumber: value?.dentistTelephone || '',
                StreetAdd: value?.dentistStreetAddress || '',
                CityStateZip: value?.dentistCityStateZip || '',

                IsDentalAll: boolVal(value?.allDentalInfoCollected),
                IsDentalPhotographs: boolVal(value?.photographsCollected),
                IsDentalRecords: boolVal(value?.recordsGivenToAgency),
                IsDentalCompletedWorksheet: boolVal(value?.dentalConditionWorksheetCompleted),
                IsDentalCompletedNCICReport: boolVal(value?.ncicDentalReportCompleted),

                ...toothMap,

                AdditionalDentalInfo: value?.additionalDentalInfo || '',

                NCICPatientName: value?.patientName || '',
                NcicAgeAtDisappearance: value?.ageAtDisappearance || '',
                NCICNo: value?.ncicNumber || '',
                NcicPinID: value?.NcicPinID || '',
                NcicDateCompleted: value?.dateCompleted ? new Date(value.dateCompleted) : '',
                NcicAddress: value?.address || '',
                NcicTelephoneNumber: value?.telephone || '',
                NcicEmail: value?.emailAddress || '',
                NcicXRay: boolVal(value?.xRaysAvailable),
                NcicDentalModelsAvailable: boolVal(value?.dentalModelsAvailable),
                NcicDentalPhotogrphs: boolVal(value?.dentalPhotographsAvailable),

                UpperRight1: value?.tooth_UR_01_18 || '',
                UpperRight2: value?.tooth_UR_02_17 || '',
                UpperRight3: value?.tooth_UR_03_16 || '',
                UpperRight4: value?.tooth_UR_04_15_A || '',
                UpperRight5: value?.tooth_UR_05_14_B || '',
                UpperRight6: value?.tooth_UR_06_13_C || '',
                UpperRight7: value?.tooth_UR_07_12_D || '',
                UpperRight8: value?.tooth_UR_08_11_E || '',

                UpperLeft1: value?.tooth_UL_09_21_F || '',
                UpperLeft2: value?.tooth_UL_10_22_G || '',
                UpperLeft3: value?.tooth_UL_11_23_H || '',
                UpperLeft4: value?.tooth_UL_12_24_I || '',
                UpperLeft5: value?.tooth_UL_13_25_J || '',
                UpperLeft6: value?.tooth_UL_14_26 || '',
                UpperLeft7: value?.tooth_UL_15_27 || '',
                UpperLeft8: value?.tooth_UL_16_28 || '',

                LowerRight1: value?.tooth_LR_32_48 || '',
                LowerRight2: value?.tooth_LR_31_47 || '',
                LowerRight3: value?.tooth_LR_30_46 || '',
                LowerRight4: value?.tooth_LR_29_45 || '',
                LowerRight5: value?.tooth_LR_28_44_T || '',
                LowerRight6: value?.tooth_LR_27_43_S || '',
                LowerRight7: value?.tooth_LR_26_42_R || '',
                LowerRight8: value?.tooth_LR_25_41_Q || '',

                LowerLeft1: value?.tooth_LL_24_31_O || '',
                LowerLeft2: value?.tooth_LL_23_32_N || '',
                LowerLeft3: value?.tooth_LL_22_33_M || '',
                LowerLeft4: value?.tooth_LL_21_34_L || '',
                LowerLeft5: value?.tooth_LL_20_35_K || '',
                LowerLeft6: value?.tooth_LL_19_36 || '',
                LowerLeft7: value?.tooth_LL_18_37 || '',
                LowerLeft8: value?.tooth_LL_17_38 || '',

                IsDentalRemarksAllUNK: boolVal(value?.IsDentalRemarksAllUNK),
                DentalRemarksDescription: value?.DentalRemarksDescription || '',
            };

            AddDeleteUpadate('MissingPersonDentalInformation/Update_MissingPersonDentalInformation', payload).then((res) => {
                // const parsedData = JSON.parse(res.data);
                const message = res.Message;
                toastifySuccess(message);
                getDentalInfo();
                setStatesChangeStatus(false);
            })
        }
    }

    const handleInputChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        const { name, value, type, checked } = e.target;

        if (name === 'dentistTelephone' || name === 'telephone') {
            // Format phone number as XXX-XXX-XXXX
            let ele = value.replace(/\D/g, '');
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue(prev => ({ ...prev, [name]: match[1] + '-' + match[2] + '-' + match[3] }));
                    const errorKey = name === 'dentistTelephone' ? 'dentistTelephoneError' : 'telephoneError';
                    setErrors(prev => ({ ...prev, [errorKey]: '' }));
                }
            } else {
                ele = value.split('-').join('').replace(/\D/g, '');
                setValue(prev => ({ ...prev, [name]: ele }));
                const errorKey = name === 'dentistTelephone' ? 'dentistTelephoneError' : 'telephoneError';
                setErrors(prev => ({ ...prev, [errorKey]: '' }));
            }
        } else if (name.startsWith('tooth_')) {
            const parts = name.split('_');
            const maybeNumber = parts[1];
            const isSimpleToothNumber = /^\d+$/.test(maybeNumber);
            if (isSimpleToothNumber) {
                setValue(prev => ({
                    ...prev,
                    toothConditions: {
                        ...prev.toothConditions,
                        [maybeNumber]: value
                    }
                }));
            } else {
                // Quadrant fields like tooth_UR_01_18 should bind directly to their own key
                setValue(prev => ({ ...prev, [name]: value }));
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
                {/* Detailed Dental Information UI (per mock) */}
                <fieldset className='mt-2'>
                    <legend>Dental Info</legend>
                    <div className="col-12 mt-2">
                        <div className="row align-items-center">
                            <div className="col-6 col-md-4 col-lg-3 ">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0'>Dental Record Available?</label>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type='radio'
                                            name='dentalRecordAvailable'
                                            checked={!!value.dentalRecordAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, dentalRecordAvailable: true }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span className='mr-2'>Yes</span>
                                        <input
                                            type='radio'
                                            name='dentalRecordAvailable'
                                            checked={!value.dentalRecordAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, dentalRecordAvailable: false }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>Name of Dentist</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='dentistName' value={value.dentistName} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>Telephone Number
                                    {errors.dentistTelephoneError && errors.dentistTelephoneError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.dentistTelephoneError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='dentistTelephone' value={value.dentistTelephone} onChange={handleInputChange} className={errors.dentistTelephoneError && errors.dentistTelephoneError !== 'true' ? 'form-control requiredColor' : 'form-control'} placeholder='' maxLength={10} />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>Street Address</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='dentistStreetAddress' value={value.dentistStreetAddress} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>City, State, Zip

                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='dentistCityStateZip' value={value.dentistCityStateZip} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className='mt-2'>
                    <legend>Dental Data Checklist</legend>
                    <div className='col-12 mt-2'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className="form-check mb-2">
                                    <input type='checkbox' name='allDentalInfoCollected' checked={value.allDentalInfoCollected} onChange={handleInputChange} className='form-check-input mr-2' />
                                    <label className='form-check-label'>All dental information has been collected and reviewed (including, but not limited to all original radiographs, treatment records, dental photographs, and dental models).</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input type='checkbox' name='photographsCollected' checked={value.photographsCollected} onChange={handleInputChange} className='form-check-input mr-2' />
                                    <label className='form-check-label'>Photographs showing missing persons teeth have been collected from family and/or friends.</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input type='checkbox' name='recordsGivenToAgency' checked={value.recordsGivenToAgency} onChange={handleInputChange} className='form-check-input mr-2' />
                                    <label className='form-check-label'>Dental records and photographs collected have been given to the investigating agency.</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input type='checkbox' name='dentalConditionWorksheetCompleted' checked={value.dentalConditionWorksheetCompleted} onChange={handleInputChange} className='form-check-input mr-2' />
                                    <label className='form-check-label'>Completed Dental Condition Worksheet.</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input type='checkbox' name='ncicDentalReportCompleted' checked={value.ncicDentalReportCompleted} onChange={handleInputChange} className='form-check-input mr-2' />
                                    <label className='form-check-label'>Completed NCIC Missing Person Dental Report.</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                <fieldset className='mt-2'>
                    <legend>Dental Condition Worksheet</legend>
                    <div className='col-12 mt-2'>
                        <div className='row'>
                            <div className='col-12'>
                                <p className='mb-3'>
                                    You should fill out this chart following your complete review of all available dental records and radiographs. You should number the teeth following the format of the Universal numbering system with tooth #1 being the upper right third molar, tooth #16 being the upper left third molar, tooth #17 being the lower left third molar and tooth #32 being the lower right third molar. In your descriptions of the restorations present, you should include the surfaces involved (M, O, D, F, L), the restorative material used, such as amalgam, gold, porcelain, composite, temporary cement and any other conditions that may be observed such as endodontic treatment, pin retention, orthodontic brackets or bands. You must not leave any tooth numbers blank. If the tooth has no restorations, note it as “virgin” or “present, no restoration.” Note other significant dental information at the bottom of this chart or on an additional sheet of paper, which you should attach to this worksheet.
                                </p>
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-6'>
                                <div className='row'>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(toothNum => (
                                        <div key={toothNum} className='col-12 mb-2'>
                                            <div className="d-flex align-items-center">
                                                <label className='new-label mr-2 mb-0' style={{ minWidth: '30px' }}>{toothNum}</label>
                                                <input
                                                    type='text'
                                                    name={`tooth_${toothNum}`}
                                                    value={value.toothConditions[toothNum] || ''}
                                                    onChange={handleInputChange}
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='row'>
                                    {[32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17].map(toothNum => (
                                        <div key={toothNum} className='col-12 mb-2'>
                                            <div className="d-flex align-items-center">
                                                <label className='new-label mr-2 mb-0' style={{ minWidth: '30px' }}>{toothNum}</label>
                                                <input
                                                    type='text'
                                                    name={`tooth_${toothNum}`}
                                                    value={value.toothConditions[toothNum] || ''}
                                                    onChange={handleInputChange}
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Additional Dental Information */}
                <fieldset className='mt-2'>
                    <legend>Additional Dental Information</legend>
                    <div className='col-12 mt-2'>
                        <div className='row'>
                            <div className='col-12'>
                                <textarea
                                    name='additionalDentalInfo'
                                    value={value.additionalDentalInfo}
                                    onChange={handleInputChange}
                                    className='form-control'
                                    rows='4'
                                    placeholder=''
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* NCIC Missing Person Dental Report */}
                <fieldset className='mt-2'>
                    <legend>NCIC Missing Person Dental Report</legend>
                    <div className='col-12 mt-2'>
                        <div className='row align-items-center'>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>Patient's Name</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5 mt-2">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='patientName' value={value.patientName} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-2">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Age at Disappearance</label>
                                    <input type='text' name='ageAtDisappearance' value={value.ageAtDisappearance} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-2">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>NCIC#</label>
                                    <input type='text' name='ncicNumber' value={value.ncicNumber} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>Completed By</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5">
                                <div className="d-flex align-items-center">
                                    <Select
                                        name='NcicPinID'
                                        styles={colourStyles}
                                        value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.NcicPinID)}
                                        isClearable
                                        options={agencyOfficerDrpData}
                                        onChange={(e) => handleDropDownChange(e, 'NcicPinID')}
                                        placeholder="Select..."
                                        className='w-100'

                                    />
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-lg-6">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Date Completed</label>
                                    {/* <input type='text' name='dateCompleted' value={value.dateCompleted} onChange={handleInputChange} className='form-control' placeholder='Select' /> */}
                                    <DatePicker
                                        name="dateCompleted"
                                        id="dateCompleted"
                                        className="form-control"
                                        onChange={(date) => handleDateChange(date, 'dateCompleted')}
                                        selected={value.dateCompleted ? value.dateCompleted && new Date(value.dateCompleted) : null}
                                        dateFormat="MM/dd/yyyy"
                                        isClearable={!!value.dateCompleted}
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
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>Address</label>
                            </div>
                            <div className="col-10 col-md-10 col-lg-11">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='address' value={value.address} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>
                                    Telephone #
                                    {errors.telephoneError && errors.telephoneError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.telephoneError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-5">
                                <div className="d-flex align-items-center">
                                    <input type='text' name='telephone' value={value.telephone} onChange={handleInputChange} className={errors.telephoneError && errors.telephoneError !== 'true' ? 'form-control requiredColor' : 'form-control'} placeholder='' maxLength={10} />
                                </div>
                            </div>
                            <div className="col-6 col-md-6 col-lg-6">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Email Address</label>
                                    <input type='text' name='emailAddress' value={value.emailAddress} onChange={handleInputChange} className='form-control' placeholder='' />
                                </div>
                            </div>
                        </div>

                        <div className='row mt-2 align-items-center'>
                            <div className="col-2 col-md-2 col-lg-1 mt-2" >
                                <label className='new-label right-align text-right'>
                                    X-rays Available?
                                </label>
                            </div>
                            <div className="col-4 col-md-2 col-lg-3">
                                <div className="d-flex align-items-center">
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type='radio'
                                            name='xRaysAvailable'
                                            checked={!!value.xRaysAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, xRaysAvailable: true }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span className='mr-2'>Yes</span>
                                        <input
                                            type='radio'
                                            name='xRaysAvailable'
                                            checked={!value.xRaysAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, xRaysAvailable: false }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-4">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Dental Models Available</label>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type='radio'
                                            name='dentalModelsAvailable'
                                            checked={!!value.dentalModelsAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, dentalModelsAvailable: true }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span className='mr-2'>Yes</span>
                                        <input
                                            type='radio'
                                            name='dentalModelsAvailable'
                                            checked={!value.dentalModelsAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, dentalModelsAvailable: false }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-md-4 col-lg-4">
                                <div className="d-flex align-items-center">
                                    <label className='new-label mr-2 mb-0 text-nowrap'>Dental Photographs Available</label>
                                    <div className='d-flex align-items-center'>
                                        <input
                                            type='radio'
                                            name='dentalPhotographsAvailable'
                                            checked={!!value.dentalPhotographsAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, dentalPhotographsAvailable: true }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span className='mr-2'>Yes</span>
                                        <input
                                            type='radio'
                                            name='dentalPhotographsAvailable'
                                            checked={!value.dentalPhotographsAvailable}
                                            onChange={(e) => {
                                                setValue(prev => ({ ...prev, dentalPhotographsAvailable: false }));
                                                !addUpdatePermission && setStatesChangeStatus(true);
                                                !addUpdatePermission && setChangesStatus(true);
                                            }}
                                            className='mr-1'
                                        />
                                        <span>No</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Dental Characteristics */}
                <fieldset className='mt-2'>
                    <legend>Dental Characteristics</legend>
                    <div className='col-12 mt-2'>


                        {/* Tooth Quadrants Grid */}
                        <div className='row'>
                            {/* Left Column - Upper Right & Upper Left */}
                            <div className='col-5'>
                                {/* Upper Right */}
                                <div className='mb-3'>
                                    <h6 className='mb-2'>Upper Right</h6>
                                    {[
                                        { key: 'tooth_UR_01_18', label: '01 (18)' },
                                        { key: 'tooth_UR_02_17', label: '02 (17)' },
                                        { key: 'tooth_UR_03_16', label: '03 (16)' },
                                        { key: 'tooth_UR_04_15_A', label: '04 (15) (A)' },
                                        { key: 'tooth_UR_05_14_B', label: '05 (14) (B)' },
                                        { key: 'tooth_UR_06_13_C', label: '06 (13) (C)' },
                                        { key: 'tooth_UR_07_12_D', label: '07 (12) (D)' },
                                        { key: 'tooth_UR_08_11_E', label: '08 (11) (E)' }
                                    ].map((tooth, index) => (
                                        <div key={tooth.key} className='mb-2'>
                                            <div className="d-flex align-items-center">
                                                <label className='new-label mr-2 mb-0' style={{ minWidth: '80px' }}>{tooth.label}</label>
                                                <input
                                                    type='text'
                                                    name={tooth.key}
                                                    value={value[tooth.key] || ''}
                                                    onChange={handleInputChange}
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Upper Left */}
                                <div className='mb-3'>
                                    <h6 className='mb-2'>Upper Left</h6>
                                    {[
                                        { key: 'tooth_UL_09_21_F', label: '09 (21) (F)' },
                                        { key: 'tooth_UL_10_22_G', label: '10 (22) (G)' },
                                        { key: 'tooth_UL_11_23_H', label: '11 (23) (H)' },
                                        { key: 'tooth_UL_12_24_I', label: '12 (24) (I)' },
                                        { key: 'tooth_UL_13_25_J', label: '13 (25) (J)' },
                                        { key: 'tooth_UL_14_26', label: '14 (26)' },
                                        { key: 'tooth_UL_15_27', label: '15 (27)' },
                                        { key: 'tooth_UL_16_28', label: '16 (28)' }
                                    ].map((tooth, index) => (
                                        <div key={tooth.key} className='mb-2'>
                                            <div className="d-flex align-items-center">
                                                <label className='new-label mr-2 mb-0' style={{ minWidth: '80px' }}>{tooth.label}</label>
                                                <input
                                                    type='text'
                                                    name={tooth.key}
                                                    value={value[tooth.key] || ''}
                                                    onChange={handleInputChange}
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Center Column - Explanatory Notes */}
                            <div className='col-2 d-flex align-items-center justify-content-center'>
                                <div className='text-center font-weight-semi-bold' style={{ textOrientation: 'mixed', gap: '14px' }}>
                                    <div className='text-muted'>
                                        (Numbers in parentheses represent FDI System.)<br />
                                    </div>
                                    <div className='text-muted mt-4'>
                                        (Letters in parentheses represent deciduous dentition.)
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Lower Right & Lower Left */}
                            <div className='col-5'>
                                {/* Lower Right */}
                                <div className='mb-10'>
                                    <h6 className='mb-2'>Lower Right</h6>
                                    {[
                                        { key: 'tooth_LR_32_48', label: '32 (48)' },
                                        { key: 'tooth_LR_31_47', label: '31 (47)' },
                                        { key: 'tooth_LR_30_46', label: '30 (46)' },
                                        { key: 'tooth_LR_29_45', label: '29 (45)' },
                                        { key: 'tooth_LR_28_44_T', label: '28 (44) (T)' },
                                        { key: 'tooth_LR_27_43_S', label: '27 (43) (S)' },
                                        { key: 'tooth_LR_26_42_R', label: '26 (42) (R)' },
                                        { key: 'tooth_LR_25_41_Q', label: '25 (41) (Q)' }
                                    ].map((tooth, index) => (
                                        <div key={tooth.key} className='mb-2'>
                                            <div className="d-flex align-items-center">
                                                <label className='new-label mr-2 mb-0' style={{ minWidth: '80px' }}>{tooth.label}</label>
                                                <input
                                                    type='text'
                                                    name={tooth.key}
                                                    value={value[tooth.key] || ''}
                                                    onChange={handleInputChange}
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Lower Left */}
                                <div className='mb-3'>
                                    <h6 className='mb-2'>Lower Left</h6>
                                    {[
                                        { key: 'tooth_LL_24_31_O', label: '24 (31) (O)' },
                                        { key: 'tooth_LL_23_32_N', label: '23 (32) (N)' },
                                        { key: 'tooth_LL_22_33_M', label: '22 (33) (M)' },
                                        { key: 'tooth_LL_21_34_L', label: '21 (34) (L)' },
                                        { key: 'tooth_LL_20_35_K', label: '20 (35) (K)' },
                                        { key: 'tooth_LL_19_36', label: '19 (36)' },
                                        { key: 'tooth_LL_18_37', label: '18 (37)' },
                                        { key: 'tooth_LL_17_38', label: '17 (38)' }
                                    ].map((tooth, index) => (
                                        <div key={tooth.key} className='mb-2'>
                                            <div className="d-flex align-items-center">
                                                <label className='new-label mr-2 mb-0' style={{ minWidth: '80px' }}>{tooth.label}</label>
                                                <input
                                                    type='text'
                                                    name={tooth.key}
                                                    value={value[tooth.key] || ''}
                                                    onChange={handleInputChange}
                                                    className='form-control'
                                                    placeholder=''
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Dental Codes */}
                <fieldset className='mt-2'>
                    <legend>Dental Codes</legend>
                    <div className='col-12 mt-2 d-flex flex-column align-items-center justify-content-center'>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='mb-2'>
                                    X = Tooth has been removed or did not develop
                                </div>
                                <div className='mb-2'>
                                    V = Tooth is unrestored or no information (Default Code)
                                </div>
                                <div className='mb-2'>
                                    M = Mesial Surface Restored
                                </div>
                                <div className='mb-2'>
                                    O = Occlusal/Incisal Surface Restored
                                </div>
                                <div className='mb-2'>
                                    D = Distal Surface Restored
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className='mb-2'>
                                    F = Facial or Buccal Surface Restored
                                </div>
                                <div className='mb-2'>
                                    L = Lingual Surface Restored
                                </div>
                                <div className='mb-2'>
                                    C = Lab Processed or Prefabricated Restoration
                                </div>
                                <div className='mb-2'>
                                    R = Endodontic Treatment
                                </div>
                                <div className='mb-2'>
                                    / = Tooth present with endodontic treatment but clinical crown missing
                                </div>
                            </div>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-12'>
                                (*The codes V and / are used differently in the Missing Person Dental Report than in the Unidentified Person Dental Report.)
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* Dental Remarks */}
                <fieldset className='mt-2'>
                    <legend>Dental Remarks</legend>
                    <div className='col-12 mt-2'>
                        <div className='row'>
                            <div className='col-12 d-flex align-items-center'>
                                <div className="form-check mb-2 mr-4">
                                    <input
                                        type='radio'
                                        name='IsDentalRemarksAllUNK'
                                        checked={!!value.IsDentalRemarksAllUNK}
                                        onChange={(e) => {
                                            setValue(prev => ({ ...prev, IsDentalRemarksAllUNK: true }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }}
                                        className='form-check-input mr-2'
                                    />
                                    <label className='form-check-label'>ALL (All 32 Teeth Are Present And Unrestored)</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input
                                        type='radio'
                                        name='IsDentalRemarksAllUNK'
                                        checked={!value.IsDentalRemarksAllUNK}
                                        onChange={(e) => {
                                            setValue(prev => ({ ...prev, IsDentalRemarksAllUNK: false }));
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            !addUpdatePermission && setChangesStatus(true);
                                        }}
                                        className='form-check-input mr-2'
                                    />
                                    <label className='form-check-label'>UNK (No Dental Information Available)</label>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-12'>
                                <textarea
                                    name='DentalRemarksDescription'
                                    value={value.DentalRemarksDescription}
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
                    <button type="button" className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }}  >New</button>
                    {
                        dentalInfoID ?
                            effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                                <button type="button" className="btn btn-sm btn-success  mr-1" disabled={!statesChangeStatus} onClick={() => { updateDentalInfo(); }}  >Update</button>
                                : <></> :
                                <button type="button" className="btn btn-sm btn-success  mr-1" disabled={!statesChangeStatus} onClick={() => { updateDentalInfo(); }}  >Update</button>
                            :
                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { insertDentalInfo(); }}  >Save</button>
                                : <></> :
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { insertDentalInfo(); }}  >Save</button>
                    }
                </div>
                <ChangesModal func={dentalInfoID ? updateDentalInfo : insertDentalInfo} setToReset={reset} />
            </div>

        </>
    )
}
export default DentalInformation;