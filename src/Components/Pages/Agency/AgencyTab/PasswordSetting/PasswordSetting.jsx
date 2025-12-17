
import React, { useContext, useEffect, useState } from 'react'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name, base64ToString } from '../../../../Common/Utility'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter'
import { AddDeleteUpadate, fetchData, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api'
import { Max_Login_Attempts, Max_Password_Age, Min_LowerCase_InPassword, Min_NumericDigits_InPassword, Min_Password_Length, Min_SpecialChars_InPassword, Min_UpperCase_InPassword, Password_Hist_UniquenessDepth, Password_MessageDays } from '../../AgencyValidation/validators'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { get_LocalStoreData } from '../../../../../redux/actions/Agency'
import { useLocation } from 'react-router-dom'
import ChangesModal from '../../../../Common/ChangesModal'
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';

const PasswordSetting = ({ allowMultipleLogin }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const { localStoreArray, get_LocalStorage, LoginPinID, setLoginPinID, LoginAgencyID, setLoginAgencyID, get_CountList, setChangesStatus, } = useContext(AgencyContext);
    const [passwordSettingList, setPasswordSettingList] = useState([])
    const [status, setStatus] = useState(false)
    const [passwordValidationList, setPasswordValidationList] = useState([])
    const [pinId, setPinId] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddPasswordSetting, setPermissionForAddPasswordSetting] = useState(false);
    const [permissionForEditPasswordSetting, setPermissionForEditPasswordSetting] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");
    var aIdSta = query?.get("ASta");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    const [errors, setErrors] = useState({
        'MaxPasswordAge': '',
        'MinPasswordLength': '',
        'MinLowerCaseInPassword': '',
        'MinUpperCaseInPassword': '',
        'MinNumericDigitsInPassword': '',
        'MinSpecialCharsInPassword': '',
        'PasswordHistUniquenessDepth': '',
        'PasswordMessageDays': '',
        'MaxLoginAttempts': '',
    })

    const [value, setValue] = useState({
        'MaxPasswordAge': '',
        'MinPasswordLength': '',
        'MinLowerCaseInPassword': '',
        'MinUpperCaseInPassword': '',
        'MinNumericDigitsInPassword': '',
        'MinSpecialCharsInPassword': '',
        'PasswordHistUniquenessDepth': '',
        'PasswordMessageDays': '',
        'MaxLoginAttempts': '',
        'AgencyID': aId,
        'CreatedByUserFK': pinId,
        'ModifiedByUserFK': '',
        'PasswordSettingID': '',
    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({

        'MaxPasswordAge': '', 'MinPasswordLength': '', 'MinLowerCaseInPassword': '', 'MinUpperCaseInPassword': '',
        'MinNumericDigitsInPassword': '', 'MinSpecialCharsInPassword': '', 'PasswordHistUniquenessDepth': '', 'PasswordMessageDays': '', 'MaxLoginAttempts': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinId(localStoreData?.PINID);
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (pinId) {
            setValue({
                ...value,
                'MaxPasswordAge': '',
                'MinPasswordLength': '',
                'MinLowerCaseInPassword': '',
                'MinUpperCaseInPassword': '',
                'MinNumericDigitsInPassword': '',
                'MinSpecialCharsInPassword': '',
                'PasswordHistUniquenessDepth': '',
                'PasswordMessageDays': '',
                'MaxLoginAttempts': '',
                'AgencyID': aId,
                'CreatedByUserFK': pinId,
                'ModifiedByUserFK': '',
                'PasswordSettingID': '',
            });
        }
    }, [pinId]);

    useEffect(() => {
        if (aId) {
            get_PasswordSetting_List(aId); get_Field_Permision_Password(aId)
        }
    }, [aId]);

    // Change Status then call 
    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'MaxPasswordAge': passwordSettingList[0]?.MaxPasswordAge,
                'MinPasswordLength': passwordSettingList[0]?.MinPasswordLength,
                'MinLowerCaseInPassword': passwordSettingList[0]?.MinLowerCaseInPassword,
                'MinUpperCaseInPassword': passwordSettingList[0]?.MinUpperCaseInPassword,
                'MinNumericDigitsInPassword': passwordSettingList[0]?.MinNumericDigitsInPassword,
                'MinSpecialCharsInPassword': passwordSettingList[0]?.MinSpecialCharsInPassword,
                'PasswordHistUniquenessDepth': passwordSettingList[0]?.PasswordHistUniquenessDepth,
                'PasswordMessageDays': passwordSettingList[0]?.PasswordMessageDays,
                'MaxLoginAttempts': passwordSettingList[0]?.MaxLoginAttempts,
                'AgencyID': aId,
                'ModifiedByUserFK': pinId,
                'PasswordSettingID': passwordSettingList[0]?.PasswordSettingID,
            })
        } else {
            setValue({
                ...value,
                'MaxPasswordAge': '',
                'MinPasswordLength': '',
                'MinLowerCaseInPassword': '',
                'MinUpperCaseInPassword': '',
                'MinNumericDigitsInPassword': '',
                'MinSpecialCharsInPassword': '',
                'PasswordHistUniquenessDepth': '',
                'PasswordMessageDays': '',
                'MaxLoginAttempts': '',
                'AgencyID': aId,
                'ModifiedByUserFK': '',
                'PasswordSettingID': '',
            })
        }
    }, [status])


    // Get Effective Field Permission
    const get_Field_Permision_Password = (aId) => {
        fieldPermision(aId, 'A010').then(res => {
            if (res) {

                const MaxPasswordAgeFilter = Agency_Field_Permistion_Filter(res, "Agency-MaxPasswordAge");
                const MinPasswordLengthFilter = Agency_Field_Permistion_Filter(res, "Agency-MinPasswordLength");
                const MinPasswordLowercaseLettersFilter = Agency_Field_Permistion_Filter(res, "Agency-MinPasswordLowercaseLetters");
                const MinPasswordUppercaseLettersFilter = Agency_Field_Permistion_Filter(res, "Agency-MinPasswordUppercaseLetters");
                const MinPasswordNumericDigitsFilter = Agency_Field_Permistion_Filter(res, "Agency-MinPasswordNumericDigits");
                const MinPasswordSpecialCharactersFilter = Agency_Field_Permistion_Filter(res, "Agency-MinPasswordSpecialCharacters");
                const HistoryUniquenessDepthFilter = Agency_Field_Permistion_Filter(res, "Agency-HistoryUniquenessDepth");
                const PasswordMessageDaysFilter = Agency_Field_Permistion_Filter(res, "Agency-PasswordMessageDays");
                const MaxLoginAttemptsFilter = Agency_Field_Permistion_Filter(res, "Agency-MaxLoginAttempts");

                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['MaxPasswordAge']: MaxPasswordAgeFilter || prevValues['MaxPasswordAge'],
                        ['MinPasswordLength']: MinPasswordLengthFilter || prevValues['MinPasswordLength'],
                        ['MinLowerCaseInPassword']: MinPasswordLowercaseLettersFilter || prevValues['MinLowerCaseInPassword'],
                        ['MinUpperCaseInPassword']: MinPasswordUppercaseLettersFilter || prevValues['MinUpperCaseInPassword'],
                        ['MinNumericDigitsInPassword']: MinPasswordNumericDigitsFilter || prevValues['MinNumericDigitsInPassword'],
                        ['MinPasswordSpecialCharacters']: MinPasswordSpecialCharactersFilter || prevValues['MinPasswordSpecialCharacters'],
                        ['PasswordHistUniquenessDepth']: HistoryUniquenessDepthFilter || prevValues['PasswordHistUniquenessDepth'],
                        ['PasswordMessageDays']: PasswordMessageDaysFilter || prevValues['PasswordMessageDays'],
                        ['MaxLoginAttempts']: MaxLoginAttemptsFilter || prevValues['MaxLoginAttempts'],
                    }
                });
            }
        });
    }

    // get password Setting list
    const get_PasswordSetting_List = (aId) => {
        const val = { AgencyID: aId }
        fetchPostData('PasswordSetting/PasswordSetting_getData', val)
            .then((res) => {
                if (res) {


                    setPasswordSettingList(res);
                    setStatus(true)
                } else {
                    setStatus(false)
                }
            })
    }

    // Passowrd Validation List 
    const password_Validation_List = () => {
        fetchData('PasswordSetting/GetData_CJISPasswordSetting')
            .then((res) => {
                if (res) {
                    setPasswordValidationList(res);
                }
            })
    }

    // Get Screeen Permission
    const getScreenPermision = (aId, pinId) => {
        try {
            ScreenPermision("A010", aId, pinId).then(res => {
                if (res?.length > 0) {
                    setEffectiveScreenPermission(res)
                    setPermissionForAddPasswordSetting(res[0]?.AddOK);
                    setPermissionForEditPasswordSetting(res[0]?.Changeok);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
                }
                else {
                    setEffectiveScreenPermission([]); setPermissionForAddPasswordSetting(false); setPermissionForEditPasswordSetting(false);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(false)
                }
            });
        } catch (error) {
            console.error('There was an error!', error);
            setPermissionForAddPasswordSetting(false);
            setPermissionForEditPasswordSetting(false);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(false)
        }
    }

    // onChange Hooks Function
    const handleInput = (e) => {
        !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true)
        const re = /^((?!(0)))[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    }

    // Password Setting Submit
    const password_Setting_Add = async () => {
        AddDeleteUpadate('PasswordSetting/InsertPasswordSetting', value)
            .then((res) => {
                if (res.success) {

                    const parsedData = JSON.parse(res?.data)
                    const message = parsedData?.Table[0]?.Message
                    toastifySuccess(message)
                    setErrors({ ...errors, ['MaxPasswordAge']: '' })
                }
            })
    }

    // Password Setting update
    const password_Setting_Update = async () => {
        AddDeleteUpadate('PasswordSetting/UpdatePasswordSetting', value)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res?.data)
                    const message = parsedData?.Table[0]?.Message
                    toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false)
                    setErrors({ ...errors, ['MaxPasswordAge']: '' })
                }
            })
    }

    // Check Validation
    const check_Validation_Error = (e) => {
        e.preventDefault()
        const MaxPasswordAgeErr = Max_Password_Age(value.MaxPasswordAge, passwordValidationList);
        const MinPasswordLengthErr = Min_Password_Length(value.MinPasswordLength, passwordValidationList);
        const MinLowerCaseInPasswordErr = Min_LowerCase_InPassword(value.MinLowerCaseInPassword, passwordValidationList);
        const MinNumericDigitsInPasswordErr = Min_NumericDigits_InPassword(value.MinNumericDigitsInPassword, passwordValidationList);
        const MinSpecialCharsInPasswordErr = Min_SpecialChars_InPassword(value.MinSpecialCharsInPassword, passwordValidationList);
        const PasswordHistUniquenessDepthErr = Password_Hist_UniquenessDepth(value.PasswordHistUniquenessDepth, passwordValidationList);
        const PasswordMessageDaysErr = Password_MessageDays(value.PasswordMessageDays, passwordValidationList);
        const MaxLoginAttemptsErr = Max_Login_Attempts(value.MaxLoginAttempts, passwordValidationList);
        const MinUpperCaseInPasswordErr = Min_UpperCase_InPassword(value.MinUpperCaseInPassword, passwordValidationList);

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['MaxPasswordAge']: MaxPasswordAgeErr || prevValues['MaxPasswordAge'],
                ['MinPasswordLength']: MinPasswordLengthErr || prevValues['MinPasswordLength'],
                ['MinLowerCaseInPassword']: MinLowerCaseInPasswordErr || prevValues['MinLowerCaseInPassword'],
                ['MinNumericDigitsInPassword']: MinNumericDigitsInPasswordErr || prevValues['MinNumericDigitsInPassword'],
                ['MinSpecialCharsInPassword']: MinSpecialCharsInPasswordErr || prevValues['MinSpecialCharsInPassword'],
                ['PasswordHistUniquenessDepth']: PasswordHistUniquenessDepthErr || prevValues['PasswordHistUniquenessDepth'],
                ['PasswordMessageDays']: PasswordMessageDaysErr || prevValues['PasswordMessageDays'],
                ['MaxLoginAttempts']: MaxLoginAttemptsErr || prevValues['MaxLoginAttempts'],
                ['MinUpperCaseInPassword']: MinUpperCaseInPasswordErr || prevValues['MinUpperCaseInPassword'],
            }
        });
    }

    // Check All Field Format is True Then Submit 
    const { MinUpperCaseInPassword, MaxLoginAttempts, PasswordMessageDays, PasswordHistUniquenessDepth, MinSpecialCharsInPassword, MinNumericDigitsInPassword, MinLowerCaseInPassword, MinPasswordLength, MaxPasswordAge } = errors

    useEffect(() => {
        if (MinUpperCaseInPassword === 'true' && MaxLoginAttempts === 'true' && PasswordMessageDays === 'true' && PasswordHistUniquenessDepth === 'true' && MinSpecialCharsInPassword === 'true' && MinNumericDigitsInPassword === 'true' && MinLowerCaseInPassword === 'true' && MinPasswordLength === 'true' && MaxPasswordAge === 'true') {
            if (status) password_Setting_Update()
            else password_Setting_Add()
        }
    }, [MinUpperCaseInPassword, MaxLoginAttempts, PasswordMessageDays, PasswordHistUniquenessDepth, MinSpecialCharsInPassword, MinNumericDigitsInPassword, MinLowerCaseInPassword, MinPasswordLength, MaxPasswordAge])

    return (
        <>
            {effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ?
                <div className="row mt-2 p-1 px-3">
                    <div className="col-6 col-md-6 col-lg-4 d-flex">
                        <label className='pass-label mt-3 pr-5 mr-1'>Max Password Age (days)
                        </label>
                        <div className="col-4 col-md-4 col-lg-3 pl-1   text-field">
                            <input type="text"
                                maxLength={2}
                                name='MaxPasswordAge'
                                value={value.MaxPasswordAge}
                                className={`form-control form-control-sm requiredColor 
                                ${fieldPermissionAgency?.MaxPasswordAge[0] ?
                                        fieldPermissionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermissionAgency?.MaxPasswordAge[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermissionAgency?.MaxPasswordAge[0]?.AddOK === 1 && passwordSettingList?.MaxPasswordAge === '' && status ? '' : fieldPermissionAgency?.MaxPasswordAge[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.MaxPasswordAge[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermissionAgency?.MaxPasswordAge[0] ?
                                    fieldPermissionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermissionAgency?.MaxPasswordAge[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.MaxPasswordAge[0]?.Changeok === 0 && fieldPermissionAgency?.MaxPasswordAge[0]?.AddOK === 1 && passwordSettingList?.MaxPasswordAge === '' && status ? handleInput : fieldPermissionAgency?.MaxPasswordAge[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.MaxPasswordAge[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                            />
                            <p ><span className='hovertext-small' data-hover="Max valid for 90 days" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MaxPasswordAge !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MaxPasswordAge}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4  d-flex">
                        <label className='pass-label mt-3 pr-5 mr-1'>Min Password Length</label>
                        <div className="col-4 col-md-4 col-lg-3 text-field">

                            <input type="text"
                                maxLength={2}
                                className={`form-control form-control-sm  requiredColor
                        ${fieldPermissionAgency?.MinPasswordLength[0] ?
                                        fieldPermissionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermissionAgency?.MinPasswordLength[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermissionAgency?.MinPasswordLength[0]?.AddOK === 1 && passwordSettingList?.MinPasswordLength === '' && status ? '' : fieldPermissionAgency?.MinPasswordLength[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.MinPasswordLength[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermissionAgency?.MinPasswordLength[0] ?
                                    fieldPermissionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermissionAgency?.MinPasswordLength[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.MinPasswordLength[0]?.Changeok === 0 && fieldPermissionAgency?.MinPasswordLength[0]?.AddOK === 1 && passwordSettingList?.MinPasswordLength === '' && status ? handleInput : fieldPermissionAgency?.MinPasswordLength[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.MinPasswordLength[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinPasswordLength' value={value.MinPasswordLength} />
                            <p ><span className='hovertext-small-1' data-hover="Min length (8)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinPasswordLength !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinPasswordLength}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 d-flex ">
                        <label className='pass-label  mt-3 pr-4'>Min Password Uppercase Letters</label>
                        <div className="col-4 col-md-4 col-lg-3 text-field ">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm  requiredColor
                         ${fieldPermissionAgency?.MinUpperCaseInPassword[0] ?
                                        fieldPermissionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinUpperCaseInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinUpperCaseInPassword === '' && status ? '' : fieldPermissionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.MinUpperCaseInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermissionAgency?.MinUpperCaseInPassword[0] ?
                                    fieldPermissionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinUpperCaseInPassword[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.MinUpperCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinUpperCaseInPassword === '' && status ? handleInput : fieldPermissionAgency?.MinUpperCaseInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.MinUpperCaseInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinUpperCaseInPassword' value={value.MinUpperCaseInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min uppercase char (1)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinUpperCaseInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinUpperCaseInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3 pr-3'>Min Password Lowercase Letters</label>
                        <div className="col-4 col-md-4 col-lg-3 pl-1  text-field">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm  requiredColor
                        ${fieldPermissionAgency?.MinLowerCaseInPassword[0] ?
                                        fieldPermissionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinLowerCaseInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinLowerCaseInPassword === '' && status ? '' : fieldPermissionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.MinLowerCaseInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermissionAgency?.MinLowerCaseInPassword[0] ?
                                    fieldPermissionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinLowerCaseInPassword[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.MinLowerCaseInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && passwordSettingList?.MinLowerCaseInPassword === '' && status ? handleInput : fieldPermissionAgency?.MinLowerCaseInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.MinLowerCaseInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinLowerCaseInPassword' value={value.MinLowerCaseInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min Lowercase Char (1)" ><i className='fa fa-exclamation-circle'></i></span></p>

                            {errors.MinLowerCaseInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinLowerCaseInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3 pr-2'>Min Password Numeric Digits</label>
                        <div className="col-4 col-md-4 col-lg-3  text-field">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm requiredColor 
                        ${fieldPermissionAgency?.MinLowerCaseInPassword[0] ?
                                        fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinNumericDigitsInPassword === '' && status ? '' : fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermissionAgency?.MinLowerCaseInPassword[0] ?
                                    fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinNumericDigitsInPassword === '' && status ? handleInput : fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.MinNumericDigitsInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinNumericDigitsInPassword' value={value.MinNumericDigitsInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min Numeric Digit (1)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinNumericDigitsInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinNumericDigitsInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-1 d-flex">
                        <label className='pass-label mt-3 pr-4'>Min Password Special Characters</label>
                        <div className="col-4 col-md-4 col-lg-3 pl-1 text-field mt-3">
                            <input type="text" maxLength={2}
                                className={`form-control form-control-sm requiredColor
                        ${fieldPermissionAgency?.MinSpecialCharsInPassword[0] ?
                                        fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinSpecialCharsInPassword === '' && status ? '' : fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermissionAgency?.MinSpecialCharsInPassword[0] ?
                                    fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 0 && fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && passwordSettingList?.MinSpecialCharsInPassword === '' && status ? handleInput : fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.MinSpecialCharsInPassword[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MinSpecialCharsInPassword' value={value.MinSpecialCharsInPassword} />
                            <p ><span className='hovertext-small' data-hover="Min Numeric Digit (1)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MinSpecialCharsInPassword !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MinSpecialCharsInPassword}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3 pr-5'>History Uniqueness Depth</label>
                        <div className="col-4 col-md-4 col-lg-3 text-field ">
                            <input type="text"
                                maxLength={2}
                                className={`form-control form-control-sm requiredColor 
                        ${fieldPermissionAgency?.PasswordHistUniquenessDepth[0] ?
                                        fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && passwordSettingList?.PasswordHistUniquenessDepth === '' && status ? '' : fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''} `
                                }
                                onChange={fieldPermissionAgency?.PasswordHistUniquenessDepth[0] ?
                                    fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && passwordSettingList?.PasswordHistUniquenessDepth === '' && status ? handleInput : fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.PasswordHistUniquenessDepth[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='PasswordHistUniquenessDepth' value={value.PasswordHistUniquenessDepth} />
                            <p ><span className='hovertext-small' data-hover="Max Uniqueness Depth (10)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.PasswordHistUniquenessDepth !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PasswordHistUniquenessDepth}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4  mt-2 d-flex">
                        <label className='pass-label mt-3 pr-4 mr-3'>Password Message Days</label>
                        <div className="col-4 col-md-4 col-lg-3  text-field ">
                            <input type="text"
                                maxLength={2}
                                className={`form-control form-control-sm requiredColor
                        ${fieldPermissionAgency?.PasswordMessageDays[0] ?
                                        fieldPermissionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordMessageDays[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordMessageDays[0]?.AddOK === 1 && passwordSettingList?.PasswordMessageDays === '' && status ? '' : fieldPermissionAgency?.PasswordMessageDays[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.PasswordMessageDays[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''}`
                                }
                                onChange={fieldPermissionAgency?.PasswordMessageDays[0] ?
                                    fieldPermissionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordMessageDays[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.PasswordMessageDays[0]?.Changeok === 0 && fieldPermissionAgency?.PasswordMessageDays[0]?.AddOK === 1 && passwordSettingList?.PasswordMessageDays === '' && status ? handleInput : fieldPermissionAgency?.PasswordMessageDays[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.PasswordMessageDays[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='PasswordMessageDays' value={value.PasswordMessageDays} />
                            <p ><span className='hovertext-small' data-hover="Max Message Days (30)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.PasswordMessageDays !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PasswordMessageDays}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-6 col-md-6 col-lg-4 mt-2 d-flex">
                        <label className='pass-label mt-3 pr-5 mr-5 '>Max Login Attempts</label>
                        <div className="col-4 col-md-4 col-lg-3 text-field" >
                            <input type="text"
                                maxLength={1}
                                className={`form-control form-control-sm  requiredColor
                        ${fieldPermissionAgency?.MaxLoginAttempts[0] ?
                                        fieldPermissionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermissionAgency?.MaxLoginAttempts[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermissionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && passwordSettingList?.MaxLoginAttempts === '' && status ? '' : fieldPermissionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && !status ? '' : fieldPermissionAgency?.MaxLoginAttempts[0]?.Changeok === 1 && status ? '' : 'readonlyColor' : ''}`
                                }
                                onChange={fieldPermissionAgency?.MaxLoginAttempts[0] ?
                                    fieldPermissionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermissionAgency?.MaxLoginAttempts[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.MaxLoginAttempts[0]?.Changeok === 0 && fieldPermissionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && passwordSettingList?.MaxLoginAttempts === '' && status ? handleInput : fieldPermissionAgency?.MaxLoginAttempts[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.MaxLoginAttempts[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                }
                                name='MaxLoginAttempts' value={value.MaxLoginAttempts} />
                            <p ><span className='hovertext-small' data-hover="Max Login Attempts (5)" ><i className='fa fa-exclamation-circle'></i></span></p>
                            {errors.MaxLoginAttempts !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.MaxLoginAttempts}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-12 mt-2 text-right pr-5 ">
                        {
                            status ?
                                effectiveScreenPermission ?
                                    effectiveScreenPermission[0]?.Changeok ?
                                        <button className='btn btn-success ' disabled={!statesChangeStatus} type='button' onClick={check_Validation_Error}>Update</button>
                                        :
                                        <></>
                                    :
                                    <button className='btn btn-success ' type='button' disabled={!statesChangeStatus} onClick={check_Validation_Error}>Update</button>
                                :
                                effectiveScreenPermission ?
                                    effectiveScreenPermission[0]?.AddOK ?
                                        <button className='btn btn-success' type='button' onClick={check_Validation_Error}>Save</button>
                                        : <></>
                                    : <button className='btn btn-success' type='button' onClick={check_Validation_Error}>Save</button>
                        }
                    </div>
                    <ChangesModal func={check_Validation_Error} />
                    {/* <ChangesModal hasPermission={status ? permissionForEditPasswordSetting : permissionForAddPasswordSetting} func={check_Validation_Error} /> */}
                    <IdentifyFieldColor />
                </div>
                :
                <p className='text-center mt-2'>You don’t have permission to view data</p>
                :
                <></>
            }
        </>
    )
}

export default PasswordSetting