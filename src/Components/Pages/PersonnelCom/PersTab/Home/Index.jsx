import React, { useState, useEffect, useContext } from 'react'
import Select from 'react-select';
import DatePicker from "react-datepicker";
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Aes256Encrypt, Decrypt_Id_Name, DecryptedList, Aes256Base64DecryptString, EncryptedList, base64ToString, encryptAndEncodeToBase64, getShowingWithOutTime, getShowingYearMonthDate, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { AddDeleteUpadate, fetchData, AddDelete_Img, fetchPostData, fieldPermision, fetchPostDataPersonnel } from '../../../../hooks/Api';
import { Email_Field, PasswordField, PinValidator, ReEnterPasswordVal, RequiredField, RequiredFieldUser, hasKeyboardSequence } from '../../Validation/PersonnelValidation';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png'
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';
import ChangesModal from '../../../../Common/ChangesModal';
import DataTable from 'react-data-table-component';
import ImageModel from '../../../ImageModel/ImageModel';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import TwoFactorModal from '../../../../../Components/Auth/TwoFactorModal'
import GeneratePassword from './GeneratePassword';

import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';

const Home = (props) => {

    const [clickedRow, setClickedRow] = useState(null);
    const { editValueList, setDobHireDate, } = props

    // Hooks Initialization
    const navigate = useNavigate()
    const { get_CountList, setChangesStatus, setcountaduitprsonel } = useContext(AgencyContext);

    const [pasStatus, setPasStatus] = useState(false);
    const [rePasStatus, setRePasStatus] = useState(false);

    const [personnelEditList, setPersonnelEditList] = useState([]);
    const [passwordSettingVal, setPasswordSettingVal] = useState([]);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [sexList, setSexList] = useState([]);
    const [employeeTypeList, setEmployeeTypeList] = useState([]);
    const [accountTypeList] = useState([
        { "value": 1, "label": "Regular Account" },
        { "value": 2, "label": "Temporary Account" },
        { "value": 3, "label": "Emergency Account" },
    ]);
    const [personnelImage, setPersonnelImage] = useState([]);
    const [imageId, setImageId] = useState('');
    const [isMultiPin, setIsMultiPin] = useState();
    const [validDobDate, setValidDobDate] = useState(null);

    // inside checkPassword function
    const [passStatus, setPassStatus] = useState(false);
    const [isSuperadmin, setIsSuperadmin] = useState(null);

    const [passMessage, setPassMessage] = useState();
    const [personnelID, setPersonnelID] = useState();
    const [personnelDelID, setPersonnelDelID] = useState();
    const [loginPinID, setLoginPinID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [uploadImgFiles, setuploadImgFiles] = useState([]);
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [isPasswordChange, setIsPasswordChange] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [personnelList, setPersonnelList] = useState([]);
    const [allPersonnelList, setAllPersonnelList] = useState([])
    const [Is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [inActiveCheckBox, setInActiveCheckBox] = useState(false);
    const [onAction, setOnAction] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [isAdministrativeSystem, setIsAdministrativeSystem] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    // permissions
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddPersonnel, setPermissionForAddPersonnel] = useState(false);
    const [permissionForEditPersonnel, setPermissionForEditPersonnel] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    const query = useQuery();
    var aId = query?.get("Aid");
    var aIdSta = query?.get("ASta");
    var AgyName = query?.get("AgyName");
    var ORINum = query?.get("ORINum");

    var perId = query?.get('perId');
    var perSta = query?.get('perSta');

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));
    if (!perId) perId = 0;
    else perId = parseInt(base64ToString(perId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        const superadminStatus = localStorage.getItem("IsSuperadmin");
        setIsSuperadmin(superadminStatus);
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            setIsAdministrativeSystem(localStoreData?.IsAdministrativeSystem);
            get_EffectiveScreen_Permission(localStoreData?.AgencyID, localStoreData?.PINID);
            if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID));
            get_Personnel_Lists(aId, localStoreData?.PINID);
        }
    }, [localStoreData]);

    const [value, setValue] = useState({
        'PIN': '', 'AgencyID': aId, 'AllowMultipleLogins': true, 'FirstName': '', 'MiddleName': '', 'LastName': '', 'UserName': '', 'Password': '', 'DivisionId': '', 'RankID': '',
        'EmployeeTypeID': '', 'Email': '', 'ShiftID': '', 'ReEnterPassword': '', 'ModifiedByUserFK': '', 'PINID': '', 'IsSuperadmin': '', 'IsAllowLogin': '', 'ShiftName': '',
        "RankName": '', 'DivisionName': '', 'DateOfBirth': '', 'NCICLoginId': '', 'NCICLoginPassword': '', 'NCICLoginTerminalID': '', 'NCICORI': '', 'ScheduleId': '', 'MaxLockLevel': '', 'MaxRestrictLevel': '', 'IsJuvenileCleared': '',
        'IsActive': true, 'SexID': '', 'IsSupervisor': '', IsSupervisorPersonnel: '', IsProsecutor: '', 'photoId': '', 'GenderName': '', 'EmployeeName': '', 'CreatedByUserFK': personnelID, Is2FAEnabled: false,
        'IsIncidentEditable': ''
    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        // Persionnel Fields
        'PIN': '', 'FirstName': '', 'MiddleName': '', 'LastName': '', 'UserName': '', 'Password': '', 'DivisionId': '', 'RankID': '', 'Email': '',
        'ShiftID': '', 'ReEnterPassword': '', 'IsSuperadmin': '', 'IsAllowLogin': ''
    })

    const [imgData, setImgData] = useState({
        "PictureTypeID": '', "ImageViewID": '', "ImgDtTm": '', "OfficerID": '', "Comments": '', "DocumentID": ''
    })


    useEffect(() => {
        if (aId && perId) {
            get_Single_PersonnelList(perId); setPersonnelID(perId)
            get_Field_Permision_Division(aId, perId)
        }
    }, [aId, perId])

    // Onload Function
    useEffect(() => {
        if (aId) {
            // get_Personnel_Lists(aId, loginPinID);
            get_Password_Setting(aId); getSexList(aId); get_CountList(aId);
        }
        get_EmployeeType();
        dateChange();
    }, [aId,]);

    // Get Single Persoonel Data 
    const get_Single_PersonnelList = (perId) => {
        fetchPostData('Personnel/GetData_UpdatePersonnel', { PINID: perId })
            .then((res) => {
                if (res) {
                    setPersonnelEditList(res);
                    get_Personnel_MultiImage(perId)
                }
                else { setPersonnelEditList([]); }
            })
    }

    useEffect(() => {
        if (personnelEditList?.length > 0) {
            setcountaduitprsonel(true)
            setDateOfBirth(''); setIsMultiPin(false);
            setValue({
                ...value,
                'PIN': personnelEditList[0]?.PIN,
                'FirstName': personnelEditList[0]?.FirstName,
                'MiddleName': personnelEditList[0]?.MiddleName === null ? "" : personnelEditList[0]?.MiddleName,
                'LastName': personnelEditList[0]?.LastName,
                'UserName': personnelEditList[0]?.UserName,
                'Password': personnelEditList[0]?.Password ? Aes256Base64DecryptString(personnelEditList[0]?.Password) : '',
                // 'Password': personnelEditList[0]?.Password ? DecryptedList(personnelEditList[0]?.Password) : '',
                'DivisionId': personnelEditList[0]?.DivisionId,
                'RankID': personnelEditList[0]?.RankID,
                'EmployeeTypeID': personnelEditList[0]?.EmployeeTypeID,
                'AccountTypeID': personnelEditList[0]?.AccountTypeID,
                'Email': personnelEditList[0]?.Email,
                'ShiftID': personnelEditList[0]?.ShiftID,
                'ReEnterPassword': personnelEditList[0]?.Password ? Aes256Base64DecryptString(personnelEditList[0]?.Password) : '',
                // 'ReEnterPassword': personnelEditList[0]?.Password ? DecryptedList(personnelEditList[0]?.Password) : '',
                'PINID': personnelEditList[0]?.PINID,
                'NCICLoginId': personnelEditList[0]?.NCICLoginId,
                'NCICLoginPassword': personnelEditList[0]?.NCICLoginPassword ? Aes256Base64DecryptString(personnelEditList[0]?.NCICLoginPassword) : '',
                // 'NCICLoginPassword': personnelEditList[0]?.NCICLoginPassword ? DecryptedList(personnelEditList[0]?.NCICLoginPassword) : '',
                'NCICLoginTerminalID': personnelEditList[0]?.NCICLoginTerminalID,
                'IsSuperadmin': personnelEditList[0]?.IsSuperadmin, 'IsActive': personnelEditList[0]?.IsActive, 'IsSupervisor': personnelEditList[0]?.IsSupervisor, 'IsSupervisorPersonnel': personnelEditList[0]?.IsSupervisorPersonnel, IsProsecutor: personnelEditList[0]?.IsProsecutor,
                'IsAllowLogin': personnelEditList[0]?.IsAllowLogin, 'DateOfBirth': getShowingWithOutTime(personnelEditList[0]?.DateOfBirth) === 'Invalid date' ? '' : getShowingWithOutTime(personnelEditList[0]?.DateOfBirth), 'NCICORI': personnelEditList[0]?.NCICORI, 'IsJuvenileCleared': personnelEditList[0]?.IsJuvenileCleared,
                'DivisionName': changeArrayFormat_WithFilter(personnelEditList, 'division'), 'ShiftName': changeArrayFormat_WithFilter(personnelEditList, 'shift'), 'RankName': changeArrayFormat_WithFilter(personnelEditList, 'rank'),
                'EmployeeName': changeArrayFormat_WithFilter(personnelEditList, 'EmployeeName'),
                'GenderName': changeArrayFormat_WithFilter(personnelEditList, 'gender'),
                'MaxLockLevel': personnelEditList[0]?.MaxLockLevel, 'MaxRestrictLevel': personnelEditList[0]?.MaxRestrictLevel, 'SexID': personnelEditList[0]?.SexID,
                'IsIncidentEditable': personnelEditList[0]?.IsIncidentEditable,
                'ModifiedByUserFK': loginPinID,
                'Is2FAEnabled': personnelEditList[0]?.Is2FAEnabled,
            });

            setErrors({ ...errors, "PasswordError": personnelEditList[0]?.Password ? 'true' : 'true' })
            // setErrors({ ...errors, "PasswordError":  'true' }) // sonarqube Error
            setDateOfBirth(personnelEditList[0]?.DateOfBirth ? new Date(personnelEditList[0]?.DateOfBirth) : null);
            if (Aes256Base64DecryptString(personnelEditList[0]?.Password)) {
                // getPasswordStatus(personnelEditList[0]?.Password)
                setPasStatus(true);
                setRePasStatus(true);
            } else {
                setPasStatus(false);
                setRePasStatus(false);
            }
        } else rest_Value()
    }, [personnelEditList])


    const getPasswordStatus = async (password) => {
        const pasword = DecryptedList(password)
        const status = await checkPassword(null, pasword)
    }

    // Get Multiple Image Personnel
    const get_Personnel_MultiImage = (perID) => {
        fetchPostData('Personnel/GetData_Image', { PINID: perID ? perID : perId, AgencyID: aId })
            .then((res) => {
                if (res) { setPersonnelImage(res); }
                else { setPersonnelImage(''); }
            })
    }

    // Get Effective Field Permission
    const get_Field_Permision_Division = (aId, loginPinID) => {
        fieldPermision(aId, 'P018', loginPinID).then(res => {
            if (res) {
                const PINFilter = res?.filter(item => item.Description === "Personnel-Pin");
                // const PINFilter = Agency_Field_Permistion_Filter(res, "Personnel-Pin")
                const LastNameFilter = res?.filter(item => item.Description === "Personnel-LastName");
                const FirstNameFilter = res?.filter(item => item.Description === "Personnel-FirstName");
                const MiddleNameFilter = res?.filter(item => item.Description === "Personnel-MiddleName");
                const DivisionIdFilter = res?.filter(item => item.Description === "Personnel-Division");
                const RankIDFilter = res?.filter(item => item.Description === "Personnel-Rank");
                const ShiftIDFilter = res?.filter(item => item.Description === "Personnel-Shift");
                const EmailFilter = res?.filter(item => item.Description === "Personnel-Email_Id");
                const UserNameFilter = res?.filter(item => item.Description === "Personnel-LoginUserId");
                const PasswordFilter = res?.filter(item => item.Description === "Personnel-Password");
                const ReEnterPasswordFilter = res?.filter(item => item.Description === "Personnel-ReEnterPassword");
                const IsSuperadminFilter = res?.filter(item => item.Description === "Personnel-SuperAdmin");
                const IsAllowLoginFilter = res?.filter(item => item.Description === "Personnel-AllowLogin");

                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['PIN']: PINFilter || prevValues['PIN'],
                        ['LastName']: LastNameFilter || prevValues['LastName'],
                        ['FirstName']: FirstNameFilter || prevValues['FirstName'],
                        ['MiddleName']: MiddleNameFilter || prevValues['MiddleName'],
                        ['DivisionId']: DivisionIdFilter || prevValues['DivisionId'],
                        ['RankID']: RankIDFilter || prevValues['RankID'],
                        ['ShiftID']: ShiftIDFilter || prevValues['ShiftID'],
                        ['Email']: EmailFilter || prevValues['Email'],
                        ['UserName']: UserNameFilter || prevValues['UserName'],
                        ['Password']: PasswordFilter || prevValues['Password'],
                        ['ReEnterPassword']: ReEnterPasswordFilter || prevValues['ReEnterPassword'],
                        ['IsSuperadmin']: IsSuperadminFilter || prevValues['IsSuperadmin'],
                        ['IsAllowLogin']: IsAllowLoginFilter || prevValues['IsAllowLogin'],
                    }
                });
            }
        });
    }

    // Get Password setting 
    const get_Password_Setting = (aId) => {
        fetchPostData('PasswordSetting/PasswordSetting_getData', { AgencyID: aId }).then(res => {
            if (res) {
                setPasswordSettingVal(res[0])
            }
        })
    }

    const getSexList = async (aId) => {
        fetchPostData("DropDown/GetData_SexType", { AgencyId: aId })
            .then(response => {
                if (response) setSexList(changeArrayFormat(response, 'genderId'))
                else setSexList()
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    const get_EmployeeType = (aId) => {
        fetchPostData('DropDown/GetDataDropDown_EmployeeType', { AgencyId: aId })
            .then(res => {
                if (res) setEmployeeTypeList(changeArrayFormat(res, 'EmployeeType'))
                else setEmployeeTypeList()
            })
    }

    const [errors, setErrors] = useState({
        'PINError': '', 'FirstNameError': '', 'LastNameError': '', 'PasswordError': '',
        'UserNameError': '', 'ReEnterPasswordError': '', 'emailError': ''
    });


    // useEffect(() => {
    //     if (PINError === 'true' && FirstNameError === 'true' && LastNameError === 'true' && PasswordError === 'true' && UserNameError === 'true' && ReEnterPasswordError === 'true' && emailError === 'true') {
    //         if (perId && (perSta === true || perSta === 'true')) {
    //             update_Personnel();
    //             setIsPasswordChange(false);
    //         } else {
    //             save_Personnel();
    //             setIsPasswordChange(false);
    //         }
    //     }
    // }, [PINError, FirstNameError, LastNameError, PasswordError, UserNameError, ReEnterPasswordError, emailError])


    const check_Validation_Error = (e) => {
        e.preventDefault();
        // Unique Login UserId validation
        const isUserNameUnique = !personnelList?.some(
            (person) =>
                person?.UserName?.toLowerCase() === value.UserName?.toLowerCase() &&
                // If editing, allow the current record
                (perId ? person?.PINID !== value.PINID : true)
        );
        if (!isUserNameUnique) {
            setErrors(prevValues => ({ ...prevValues, UserNameError: 'Login UserId must be unique.' }));
            return;
        }

        // Password required validation
        if (!value.Password || value.Password.trim() === '') {
            setErrors(prevValues => ({
                ...prevValues,
                ['PasswordError']: 'Required'
            }));
        } else if (PasswordField(passwordSettingVal, value.Password, value.UserName)) {
            setErrors(prevValues => ({
                ...prevValues,
                ['PasswordError']: PasswordField(passwordSettingVal, value.Password, value.UserName)
            }));
        }

        if (RequiredFieldIncident(value.PIN)) {
            setErrors(prevValues => ({ ...prevValues, ['PINError']: RequiredFieldIncident(value.PIN) }))
        }
        if (RequiredField(value.FirstName)) {
            setErrors(prevValues => ({ ...prevValues, ['FirstNameError']: RequiredField(value.FirstName) }))
        }
        if (RequiredField(value.LastName)) {
            setErrors(prevValues => ({ ...prevValues, ['LastNameError']: RequiredField(value.LastName) }))
        }
        if (RequiredFieldUser(value.UserName)) {
            setErrors(prevValues => ({ ...prevValues, ['UserNameError']: RequiredFieldUser(value.UserName) }));
        }
        // if (RequiredFieldUser(value.NCICLoginId)) {
        //     setErrors(prevValues => ({ ...prevValues, ['NCICLoginIdError']: RequiredFieldUser(value.NCICLoginId) }))
        // }
        if (ReEnterPasswordVal(value.Password, value.ReEnterPassword)) {
            setErrors(prevValues => ({ ...prevValues, ['ReEnterPasswordError']: ReEnterPasswordVal(value.Password, value.ReEnterPassword) }))
        }
        if (Email_Field(value.Email)) {
            setErrors(prevValues => ({ ...prevValues, ['emailError']: Email_Field(value.Email) }))
        }
    }

    const { PINError, FirstNameError, LastNameError, PasswordError, UserNameError, NCICLoginIdError, ReEnterPasswordError, emailError } = errors

    useEffect(() => {
        if (PINError === 'true' && FirstNameError === 'true' && LastNameError === 'true' && PasswordError === 'true' && UserNameError === 'true' && ReEnterPasswordError === 'true' && emailError === 'true') {
            if (perId && (perSta === true || perSta === 'true')) {
                update_Personnel();
            } else {
                save_Personnel();
            }
        }
    }, [PINError, FirstNameError, LastNameError, PasswordError, UserNameError, NCICLoginIdError, ReEnterPasswordError, emailError])


    const save_Personnel = async () => {
        const checkPassStatus = await checkPassword(null, value?.Password)
        if (isMultiPin || !checkPassStatus) {
            isMultiPin && toastifyError('PIN Already Exists');
            !checkPassStatus && toastifyError('Password Must not contain personal Info');
            setErrors({ ...errors, ['PINError']: '' });
        } else {
            const {
                PIN, AgencyID, AllowMultipleLogins, FirstName, MiddleName, LastName, UserName, Password, DivisionId, RankID, EmployeeTypeID, Email, ShiftID, ReEnterPassword, ModifiedByUserFK, PINID, IsSuperadmin, IsAllowLogin, ShiftName, RankName, DivisionName, DateOfBirth, NCICLoginId, NCICLoginPassword, NCICLoginTerminalID, NCICORI, ScheduleId, MaxLockLevel, MaxRestrictLevel, IsJuvenileCleared, IsActive, SexID, IsSupervisor, IsSupervisorPersonnel, IsProsecutor, photoId, GenderName, EmployeeName,
                IsIncidentEditable,
                CreatedByUserFK,
            } = value
            const val = {
                'PIN': PIN, 'AgencyID': AgencyID, 'AllowMultipleLogins': AllowMultipleLogins, 'FirstName': FirstName, 'MiddleName': MiddleName, 'LastName': LastName, 'UserName': UserName,
                'Password': encryptAndEncodeToBase64(Password),
                'ReEnterPassword': encryptAndEncodeToBase64(ReEnterPassword),
                'NCICLoginPassword': encryptAndEncodeToBase64(NCICLoginPassword),
                'DivisionId': DivisionId, 'RankID': RankID, 'EmployeeTypeID': EmployeeTypeID, 'Email': Email, 'ShiftID': ShiftID,
                'ModifiedByUserFK': ModifiedByUserFK, 'PINID': PINID, 'IsSuperadmin': IsSuperadmin, 'IsAllowLogin': IsAllowLogin, 'ShiftName': ShiftName, "RankName": RankName, 'DivisionName': DivisionName, 'DateOfBirth': DateOfBirth, 'NCICLoginId': NCICLoginId,
                'NCICLoginTerminalID': NCICLoginTerminalID, 'NCICORI': NCICORI, 'ScheduleId': ScheduleId, 'MaxLockLevel': MaxLockLevel, 'MaxRestrictLevel': MaxRestrictLevel, 'IsJuvenileCleared': IsJuvenileCleared, 'IsActive': IsActive, 'SexID': SexID, 'IsSupervisor': IsSupervisor, IsSupervisorPersonnel: IsSupervisorPersonnel, IsProsecutor: IsProsecutor, 'photoId': photoId, 'GenderName': GenderName, 'EmployeeName': EmployeeName,
                'IsIncidentEditable': IsIncidentEditable,
                'CreatedByUserFK': loginPinID,
            }
            AddDeleteUpadate('Personnel/InsertPersonnel', val).then((res) => {
                if (res?.success === true) {
                    setChangesStatus(false); setStatesChangeStatus(false);
                    // const parseData = JSON.parse(res.data);
                    toastifySuccess(res.Message);
                    setStatusFalse(); setPasStatus(true); setRePasStatus(true);
                    navigate(`/personnelTab?Aid=${stringToBase64(aId)}&ASta=${aIdSta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${stringToBase64(res?.Id)}&perSta=${true}`)
                    get_Personnel_Lists(aId, loginPinID)
                    getAllPersonnelList(aId, loginPinID)
                    setErrors({ ...errors, ['PINError']: '' })
                    get_CountList(aId);
                    if (uploadImgFiles?.length > 0) {
                        upload_Image_File(res?.Id)
                        setuploadImgFiles('')
                    }
                }
            }).catch(err => console.log(err))

        }
    }

    // Update Personnel List
    const update_Personnel = async () => {
        const checkPassStatus = await checkPassword(null, value?.Password)

        if (isMultiPin || !checkPassStatus) {
            isMultiPin && toastifyError('PIN Already Exists');
            !checkPassStatus && toastifyError(passMessage);
            // checkPassStatus && toastifyError('Password Must not contain personal Info');
            setErrors({ ...errors, ['PINError']: '' });
        } else {
            const {
                PIN, AgencyID, AllowMultipleLogins, FirstName, MiddleName, LastName, UserName, Password, DivisionId, RankID, EmployeeTypeID, Email, ShiftID, ReEnterPassword, ModifiedByUserFK, PINID, IsSuperadmin, IsAllowLogin, ShiftName, RankName, DivisionName, DateOfBirth, NCICLoginId, NCICLoginPassword, NCICLoginTerminalID, NCICORI, ScheduleId, MaxLockLevel, MaxRestrictLevel, IsJuvenileCleared, IsActive, SexID, IsSupervisor, IsSupervisorPersonnel, IsProsecutor, photoId, GenderName, EmployeeName,
                IsIncidentEditable,
                CreatedByUserFK,
            } = value

            const val = {
                'PIN': PIN, 'AgencyID': AgencyID, 'AllowMultipleLogins': AllowMultipleLogins, 'FirstName': FirstName, 'MiddleName': MiddleName, 'LastName': LastName, 'UserName': UserName,
                'Password': encryptAndEncodeToBase64(Password?.length > 0 ? Password : ''),
                'ReEnterPassword': encryptAndEncodeToBase64(ReEnterPassword?.length > 0 ? ReEnterPassword : ''),
                'NCICLoginPassword': encryptAndEncodeToBase64(NCICLoginPassword), 'NCICLoginTerminalID': NCICLoginTerminalID,
                'DivisionId': DivisionId, 'RankID': RankID, 'EmployeeTypeID': EmployeeTypeID, 'Email': Email, 'ShiftID': ShiftID,
                'ModifiedByUserFK': ModifiedByUserFK, 'PINID': PINID, 'IsSuperadmin': IsSuperadmin, 'IsAllowLogin': IsAllowLogin, 'ShiftName': ShiftName, "RankName": RankName, 'DivisionName': DivisionName, 'DateOfBirth': DateOfBirth, 'NCICLoginId': NCICLoginId,
                'NCICORI': NCICORI, 'ScheduleId': ScheduleId, 'MaxLockLevel': MaxLockLevel, 'MaxRestrictLevel': MaxRestrictLevel, 'IsJuvenileCleared': IsJuvenileCleared, 'IsActive': IsActive, 'SexID': SexID, 'IsSupervisor': IsSupervisor, IsSupervisorPersonnel: IsSupervisorPersonnel, IsProsecutor: IsProsecutor, 'photoId': photoId, 'GenderName': GenderName, 'EmployeeName': EmployeeName,
                'IsIncidentEditable': IsIncidentEditable,
                'CreatedByUserFK': CreatedByUserFK,
            }

            AddDeleteUpadate('Personnel/UpdatePersonnel', val).then((res) => {
                if (res.success === true) {
                    if (uploadImgFiles?.length > 0) {
                        upload_Image_File();
                        setuploadImgFiles('');
                    }
                    const parseData = JSON.parse(res.data);
                    toastifySuccess(parseData?.Table[0].Message);
                    setErrors({ ...errors, ['PINError']: '' })

                    if (inActiveCheckBox && value.IsActive) {
                        navigate(`/personnelTab?Aid=${stringToBase64(aId)}&ASta=${aIdSta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${stringToBase64(perId)}&perSta=${true}`)
                        get_Personnel_Lists(aId, loginPinID); setInActiveCheckBox(false);
                        getAllPersonnelList(aId, loginPinID)

                    }
                    else if (!inActiveCheckBox && !value.IsActive) {
                        get_Personnel_Lists(aId, loginPinID); setStatusFalse();
                        getAllPersonnelList(aId, loginPinID)

                    } else if (!inActiveCheckBox && value.IsActive) {
                        get_Personnel_Lists(aId, loginPinID);
                    }
                    setChangesStatus(false); setStatesChangeStatus(false); setPasStatus(true); setRePasStatus(true);

                } else {
                    setErrors({ ...errors, ['PINError']: '' })
                    toastifyError(JSON.parse(res.request.response).Message)
                }
            })

            setErrors({ ...errors, ['PINError']: '' });
        }
    }

    const getAllPersonnelList = async (aId, PINID) => {
        try {
            const [ActivePersonnelList, InActivePersonnelList] = await Promise.all([

                fetchPostData('Personnel/GetData_Personnel', { 'AgencyID': aId, 'PINID': PINID }),
                fetchPostData('Personnel/GetData_InActivePersonnel', { 'AgencyID': aId })
            ]);
            // console.log("🚀 ~ getAllPersonnelList ~ InActivePersonnelList:", InActivePersonnelList)
            // console.log("🚀 ~ getAllPersonnelList ~ ActivePersonnelList:", ActivePersonnelList)
            const personnelList = [...ActivePersonnelList, ...InActivePersonnelList]
            // console.log("🚀 ~ getAllPersonnelList ~ personnelList:", personnelList)
            setAllPersonnelList(personnelList)
        } catch (error) {
            setAllPersonnelList([])
            console.log(error)
        }
    }

    // to update image data
    const update_Personnel_MultiImage = () => {
        const val = { "ModifiedByUserFK": loginPinID, "AgencyID": aId, "PictureTypeID": imgData?.PictureTypeID, "ImageViewID": imgData?.ImageViewID, "ImgDtTm": imgData?.ImgDtTm, "OfficerID": imgData?.OfficerID, "Comments": imgData?.Comments, "DocumentID": imgData?.DocumentID }
        AddDeleteUpadate('PropertyVehicle/Update_PropertyVehiclePhotoDetail', val)
            .then((res) => {
                if (res.success) {
                    const parseData = JSON.parse(res.data);
                    toastifySuccess(parseData?.Table[0].Message);
                    get_Personnel_MultiImage(perId)
                } else {
                    toastifyError(res?.Message);
                }
            })
        // AddDelete_Img('PropertyVehicle/Update_PropertyVehiclePhotoDetail', val)
        //     .then((res) => {
        //         if (res.success) {
        //             const parseData = JSON.parse(res.data);
        //             toastifySuccess(parseData?.Table[0].Message);
        //             get_Personnel_MultiImage(perId)
        //         }
        //         else {
        //             toastifyError(res?.Message);
        //         }
        //     })
    }

    // Upload Personnel Image 
    const upload_Image_File = async (pid) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const newData = [];
        const EncDocs = [];
        for (let i = 0; i < uploadImgFiles.length; i++) {
            const { file, imgData } = uploadImgFiles[i];
            const val = {
                'PINID': perId ? perId : pid, 'CreatedByUserFK': loginPinID, 'PhotoTypeId': 0,
                'AgencyID': loginAgencyID, 'PictureTypeID': imgData?.PictureTypeID, 'ImageViewID': imgData?.ImageViewID,
                'ImgDtTm': imgData?.ImgDtTm, 'OfficerID': imgData?.OfficerID, 'Comments': imgData?.Comments
            }
            const values = JSON.stringify(val);
            newData.push(values);

            const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
            EncDocs.push(EncPostData);

            formdata.append("File", file);
            EncFormdata.append("File", file);
        }
        formdata.append("Data", JSON.stringify(newData));
        EncFormdata.append("Data", EncDocs);

        AddDelete_Img('Personnel/Insert_PersonnelPhoto', formdata, EncFormdata)
            .then((res) => {
                if (res.success) {
                    if (pid) {
                        get_Personnel_MultiImage(pid)
                    } else if (!pid) {
                        setOnAction(!onAction)
                    }
                    setuploadImgFiles('')
                }
            }).catch(err => console.error(err))
    }

    useEffect(() => {
        get_Personnel_MultiImage()
        setuploadImgFiles('')
    }, [perId, onAction])

    const delete_Image_File = (e) => {
        const val = { PhotoId: imageId, DeletedByUserFK: loginPinID, }
        AddDeleteUpadate('Personnel/Delete_PersonnelPhoto', val).then((data) => {
            if (data.success) {
                const parseData = JSON.parse(data.data);
                toastifySuccess(parseData?.Table[0].Message); get_Personnel_MultiImage(perId)
                setModalStatus(false)
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const startRef2 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef2.current.setOpen(false);
        }
    };

    // Custom color
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const checkPinExist = (checkNumber, aId, perId) => {
        const val = { PINID: perId, PIN: checkNumber, AgencyID: aId, }
        fetchPostData('Personnel/GetData_CheckPIN', val).then(res => {
            if (res[0].Count > 0) {
                setIsMultiPin(true)
            } else {
                setIsMultiPin(false)
            }
        })
    }

    // Get Effective Screeen Permission
    const get_EffectiveScreen_Permission = (aId, pinId) => {
        fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", { AgencyID: aId, PINID: pinId, ApplicationID: '1', code: 'P018', })
            .then(res => {
                if (res) {
                    setEffectiveScreenPermission(res);
                    setPermissionForAddPersonnel(res[0]?.AddOK);
                    setPermissionForEditPersonnel(res[0]?.Changeok);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
                }
                else {
                    setEffectiveScreenPermission(); setPermissionForAddPersonnel(false); setPermissionForEditPersonnel(false);
                    setaddUpdatePermission(false);
                }

            }).catch(error => {
                console.error('There was an error!', error);
                setPermissionForAddPersonnel(false); setPermissionForEditPersonnel(false);
                setaddUpdatePermission(false);
            });
    }

    // Delete Peronnel Fuction
    const delete_Personnel = (e, id) => {
        e?.preventDefault()
        const val = { PINID: personnelDelID, DeletedByUserFK: loginPinID, }
        AddDeleteUpadate('Personnel/DeletePersonnel', val)
            .then((res) => {
                if (res) {
                    if (personnelID == personnelDelID) { setStatusFalse(); }
                    const parseData = JSON.parse(res.data);
                    toastifySuccess(parseData?.Table[0].Message); get_CountList(aId);
                };
                get_Personnel_Lists(aId, loginPinID); setErrors(''); setStatusFalse();
            })
    }

    const columns = [
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true

        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'User Name',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 7, right: 42 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 50 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            // <span
                            //     onClick={(e) => setPersonnelID(row.PINID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            //     <i className="fa fa-trash"></i>
                            // </span>
                            <span
                                onClick={(e) => setPersonnelDelID(row.PINID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <></>
                    }
                </div>
        }
    ]

    // to check password on input blur or focus
    async function checkPassword(e, password,) {
        var PasswordVal = e ? e?.target?.value : password

        if (PasswordVal?.trim()?.length > 0) {
            if (!hasKeyboardSequence(PasswordVal)) {
                if (value?.MiddleName?.trim()?.length > 0) {
                    if (PasswordVal?.toLowerCase()?.includes(value?.FirstName?.trim()?.toLowerCase()) || PasswordVal?.toLowerCase()?.includes(value?.MiddleName?.trim()?.toLowerCase()) || PasswordVal?.toLowerCase()?.includes(value?.LastName?.trim()?.toLowerCase())) {
                        setPassStatus(false); setPassMessage("Password shouldn't contain personnel info First, Last, Middle Name or DOB");
                        return false
                    } else {
                        const res = await fetchPostData('Personnel/CheckPasswordSetting', { Password: encryptAndEncodeToBase64(PasswordVal), AgencyID: loginAgencyID, PINID: personnelID })
                        if (res[0]?.status === "True" || res[0]?.status === true) {
                            setPassStatus(true); setPassMessage(res[0].Message);
                            return true
                        } else {
                            setPassStatus(false); setPassMessage(res[0].Message);
                            return false
                        }
                    }
                } else if (value?.DateOfBirth && value?.DateOfBirth?.trim()?.replace(/\//g, "").length > 0) {
                    if (value?.DateOfBirth && PasswordVal?.toLowerCase()?.includes(getShowingWithOutTime(value?.DateOfBirth)?.trim()?.replace(/\//g, "")) || PasswordVal?.toLowerCase()?.includes(value?.FirstName?.trim()?.toLowerCase()) || PasswordVal?.toLowerCase()?.includes(value?.LastName?.trim()?.toLowerCase())) {
                        setPassStatus(false); setPassMessage("Password shouldn't contain personnel info First, Last, Middle Name or DOB");
                        return false
                    } else {
                        const res = await fetchPostData('Personnel/CheckPasswordSetting', { Password: encryptAndEncodeToBase64(PasswordVal), AgencyID: loginAgencyID, PINID: personnelID })

                        if (res[0]?.status === "True" || res[0]?.status === true) {
                            setPassStatus(true); setPassMessage(res[0].Message);
                            return true
                        } else {
                            setPassStatus(false); setPassMessage(res[0].Message);
                            return false
                        }
                    }
                } else {
                    if (PasswordVal?.toLowerCase()?.includes(value?.FirstName?.trim()?.toLowerCase()) || PasswordVal?.toLowerCase()?.includes(value?.LastName?.trim()?.toLowerCase())) {
                        setPassStatus(false); setPassMessage("Password shouldn't contain personnel info First, Last, Middle Name or DOB");
                        return false
                    } else {
                        const res = await fetchPostData('Personnel/CheckPasswordSetting', { Password: encryptAndEncodeToBase64(PasswordVal), AgencyID: loginAgencyID, PINID: personnelID })

                        if (res[0]?.status === "True" || res[0]?.status === true) {
                            setPassStatus(true); setPassMessage(res[0].Message);
                            return true
                        } else {
                            setPassStatus(false); setPassMessage(res[0].Message);
                            return false
                        }
                    }
                }
            } else {
                toastifyError('Invalid Pattern')
            }
        } else {
            return true
        }
    }

    const handleCopy = (e) => { e.preventDefault(); };

    const OnClose = () => { navigate('/agency'); }

    const conditionalRowStyles = [
        {
            when: row => row?.PINID === personnelID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    useEffect(() => {
        if (perId) {
            get_Single_PersonnelList(perId);
            setPersonnelID(perId);
        }
    }, [perId])

    const setEditValue = (row) => {
        setPersonnelImage('')
        if (row?.PINID) {
            rest_Value()
            if (inActiveCheckBox) {
                navigate(`/personnelTab?Aid=${stringToBase64(aId)}&ASta=${aIdSta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${stringToBase64(row?.PINID)}&perSta=${true}`)
            } else {
                navigate(`/personnelTab?Aid=${stringToBase64(aId)}&ASta=${aIdSta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${stringToBase64(row?.PINID)}&perSta=${true}`)
            }
            get_Single_PersonnelList(row.PINID);
            setPersonnelID(row?.PINID);
        }
    }

    const setStatusFalse = (e) => {
        navigate(`/personnelTab?Aid=${stringToBase64(aId)}&ASta=${aIdSta}&AgyName=${AgyName}&ORINum=${ORINum}&perId=${0}&perSta=${false}`)
        setClickedRow(null); rest_Value(); setPersonnelID(''); setStatesChangeStatus(false);
    }

    // onChange Hooks Function
    const dateChange = () => {
        const newDate = new Date()
        const year = new Date().getFullYear();
        setValidDobDate(new Date(newDate.setFullYear(year - 18)));
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            if (e.target.name === 'Password') {
                setPasStatus(false);
                setValue(pre => { return { ...pre, [e.target.name]: e.target.value } });
                if (PasswordField(passwordSettingVal, e.target.value, value.UserName) === 'true') {
                    setErrors({ ...errors, ['PasswordError']: PasswordField(passwordSettingVal, e.target.value, value.UserName), 'ReEnterPasswordError': '' })
                    // setErrors({ ...errors, ['PasswordError']: 'true', 'ReEnterPasswordError': '' }) // sonarqube Error
                } else {
                    setErrors({ ...errors, ['PasswordError']: PasswordField(passwordSettingVal, e.target.value, value.UserName) != 'true' ? 'false' : 'true', 'ReEnterPasswordError': '' }) // sonarqube Error
                    // setErrors({ ...errors, ['PasswordError']: 'false', 'ReEnterPasswordError': '' }) // sonarqube Error
                }
            } else if (e.target.name === 'ReEnterPassword') {
                setRePasStatus(false);
                const rePasswordValue = e.target.value.replace(/\s/g, '');
                setValue(pre => { return { ...pre, [e.target.name]: rePasswordValue } });

            } else if (e.target.name === 'MaxLockLevel' || e.target.name === 'MaxRestrictLevel') {
                const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
                if (checkNumber < 11) {
                    setValue({
                        ...value,
                        [e.target.name]: checkNumber
                    });
                }
            } else if (e.target.name === 'PIN') {
                const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
                if (checkNumber?.length === 6) {
                    checkPinExist(checkNumber, aId, perId);
                }
                setValue({
                    ...value,
                    [e.target.name]: checkNumber
                });
            } else {
                setValue(pre => { return { ...pre, [e.target.name]: e.target.value } });
            }
        }
    }


    const handleChangeNCIC = (event) => {
        const { name, value } = event.target;
        if (event) {
            setStatesChangeStatus(true);
            setValue((prevState) => ({ ...prevState, [name]: value, }));
        }
        else {
            setStatesChangeStatus(true);
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };

    const rest_Value = () => {
        setValue({
            ...value,
            'PIN': '', 'AgencyID': aId, 'FirstName': '', 'MiddleName': '', 'LastName': '', 'UserName': '', 'Password': '', 'DivisionId': '', 'RankID': '', 'EmployeeTypeID': '', 'Email': '', 'ShiftID': '', 'ReEnterPassword': '', 'ModifiedByUserFK': '', 'PINID': '', 'IsSuperadmin': '', 'IsAllowLogin': '', 'ShiftName': '', "RankName": '', 'DivisionName': '', 'DateOfBirth': '', 'NCICLoginId': '', 'NCICORI': '', 'ScheduleId': '', 'MaxLockLevel': '', 'MaxRestrictLevel': '', 'IsJuvenileCleared': '', 'IsActive': true, 'SexID': '', 'IsSupervisor': '', IsSupervisorPersonnel: '', IsProsecutor: '', 'photoId': '', 'GenderName': '', 'EmployeeName': '', 'IsIncidentEditable': '', 'NCICLoginId': '', 'NCICLoginPassword': '', 'NCICLoginTerminalID': '',
        });
        setshowPassword(false);
        setErrors({
            ...errors,
            'PINError': '', 'FirstNameError': '', 'LastNameError': '', 'PasswordError': '',
            'UserNameError': '', 'ReEnterPasswordError': '', 'emailError': '', 'NCICLoginIdError': '',
        });
        setPersonnelImage([]); setRePasStatus(false); setPasStatus(false); setDateOfBirth(null); setIsMultiPin(false); setStatesChangeStatus(false);

    }

    const get_Personnel_Lists = (aId, PINID) => {
        const val = { 'AgencyID': aId, 'PINID': PINID }
        fetchPostDataPersonnel('Personnel/GetData_Personnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res?.Table); setIs2FAEnabled(res?.Table1?.[0]?.Is2FAEnabled); }
                else { setPersonnelList([]); setIs2FAEnabled(false); }
            })
    }

    const getInActive_Personnel = (id) => {
        const val = { AgencyID: id }
        fetchPostDataPersonnel('Personnel/GetData_InActivePersonnel', val)
            .then((res) => {
                if (res) { setPersonnelList(res?.Table); }
                else { setPersonnelList([]); }
            })
    }

    const handleActiveCheckBox = (e) => {
        if (e) {
            if (e.target.checked) {
                getInActive_Personnel(aId, loginPinID)
            } else {
                get_Personnel_Lists(aId, loginPinID)
            }
            setInActiveCheckBox(e.target.checked);
            setStatusFalse();
            setPersonnelEditList([]);
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-12 child" id='display-not-form'>
                    <div className="row">
                        <div className="col-12 col-md-12 col-lg-12 pt-2 ">
                            <div className="row mt-1" >
                                <fieldset>
                                    <legend> Employee  Information :- {perId && (perSta === true || perSta === 'true') ? personnelEditList[0]?.PINID : ''}</legend>
                                    <div className="row">
                                        <div className="col-2 col-md-2 col-lg-1 mt-2">
                                            <label htmlFor="" className='new-label'>Pin  {errors.PINError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PINError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">
                                            <input
                                                type="text"
                                                // maxLength="6"
                                                name='PIN'
                                                value={value.PIN}
                                                className={'requiredColor'}
                                                onChange={handleChange}
                                                required
                                            />
                                            {/* <p>
                                                <span className='hovertext-1' data-hover="Enter a 6 digit code here with no repeating digits and sequential patterns (i.e., 112233, 123456)" ><i className='fa fa-exclamation-circle'></i></span>
                                            </p> */}
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2">
                                            <label htmlFor="" className='new-label'>Last Name {errors.LastNameError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">
                                            <input type="text" maxLength={50} name='LastName' value={value.LastName}
                                                className={'requiredColor'}
                                                onChange={handleChange}
                                                required />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2">
                                            <label htmlFor="" className='new-label'>First Name  {errors.FirstNameError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">
                                            <input type="text" maxLength={50} name='FirstName' value={value.FirstName}
                                                className={'requiredColor'}
                                                onChange={handleChange}
                                                required />

                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>Middle Name</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">
                                            <input type="text" maxLength={200} name='MiddleName' value={value.MiddleName} onChange={handleChange} required />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label '>Gender</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 mt-2 ">
                                            <Select
                                                name='SexID'
                                                onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                value={sexList?.filter((obj) => obj.value === value?.SexID)}
                                                styles={customStylesWithOutColor}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                menuPlacement="bottom"
                                                options={sexList}
                                                isClearable
                                            />
                                        </div>

                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label '>DOB</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 ">
                                            <DatePicker
                                                ref={startRef2}
                                                onKeyDown={onKeyDown}
                                                dateFormat="MM/dd/yyyy"
                                                timeInputLabel
                                                name='DateOfBirth'
                                                isClearable={true}
                                                maxDate={validDobDate}
                                                onChange={date => {
                                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
                                                    setDateOfBirth(date); setValue({ ...value, ['DateOfBirth']: date ? getShowingYearMonthDate(date) : null });
                                                    const newDate = new Date(date)
                                                    const year = newDate.getFullYear();
                                                    setDobHireDate(new Date(newDate.setFullYear(year + 18)));
                                                }}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                selected={dateOfBirth}
                                                placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select ..'}
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label '>Email Id{errors.emailError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.emailError}</p>
                                            ) : null}</label>
                                        </div>
                                        {isSuperadmin === "1" && value?.IsSuperadmin ? <div className="col-4  col-md-4 col-lg-2 mt-1 text-field"><span>{value.Email}</span></div> :
                                            <div className="col-4  col-md-4 col-lg-2 mt-2 text-field"> <input type="text" name='Email' value={value.Email}
                                                className={'requiredColor'}
                                                onChange={handleChange}
                                                required /></div>}

                                        <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>Employee&nbsp;Type</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 mt-2">
                                            <Select
                                                name='EmployeeTypeID'
                                                onChange={(e) => ChangeDropDown(e, 'EmployeeTypeID')}
                                                value={employeeTypeList?.filter((obj) => obj.value === value?.EmployeeTypeID)}
                                                styles={customStylesWithOutColor}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                menuPlacement="top"
                                                options={employeeTypeList}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>Account&nbsp;Type</label>
                                        </div>
                                        <div className="col-4  col-md-4 col-lg-2 mt-2">
                                            <Select
                                                name='AccountTypeID'
                                                styles={customStylesWithOutColor}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                menuPlacement="top"
                                                value={accountTypeList?.filter((obj) => obj.value === value?.AccountTypeID)}
                                                options={accountTypeList}
                                                onChange={(e) => ChangeDropDown(e, 'AccountTypeID')}
                                                isClearable
                                            />
                                        </div>
                                        {isSuperadmin === "1" && Is2FAEnabled &&
                                            <div className="col-2 col-md-2 col-lg-9 mt-2 px-0 d-flex justify-content-end">
                                                <TwoFactorModal TwoFactorEnabled={false} value={value} get_Personnel_Lists={get_Personnel_Lists} setValue={setValue} isSuperadmin={isSuperadmin} loginPinID={loginPinID} />
                                            </div>
                                        }
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-11 pt-2 ">
                            <fieldset>
                                <legend>Login Information</legend>
                                <div className="row mt-1" >
                                    <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                        <label htmlFor="" className='new-label px-0'>Login&nbsp;UserId{errors.UserNameError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.UserNameError}</p>
                                        ) : null}</label>
                                    </div>
                                    <div className="col-8  col-md-8 col-lg-2 mt-2 text-field">
                                        <input type="text"
                                            onCut={handleCopy}
                                            onCopy={handleCopy}
                                            onPaste={handleCopy}
                                            name='UserName' value={value.UserName.match(/[a-zA-Z\s]*/)}
                                            className={'requiredColor'}
                                            onChange={handleChange}
                                            required />
                                    </div>
                                    <div className="d-flex col-6 col-md-6 col-lg-4">
                                        <div className="col-2 col-md-4 col-lg-4 mt-2">
                                            <label htmlFor="" className='new-label'>
                                                Password
                                                {errors.PasswordError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PasswordError === 'false' ? 'Incorrect format' : errors.PasswordError}</p>
                                                ) : null}
                                            </label>
                                        </div>
                                        <div className="col-4  col-md-7 col-lg-7 mt-2 text-field">
                                            <input type="text" name='Password' id="passwordvalue"
                                                value={pasStatus && value.Password?.trim()?.length > 0 ? '*********' : value.Password}
                                                onBlur={(e) => checkPassword(e)}
                                                onCut={handleCopy}
                                                onCopy={handleCopy}
                                                autocomplete="off"
                                                onPaste={handleCopy}
                                                onChange={(e) => { !pasStatus && handleChange(e); setIsPasswordChange(true); }}
                                                className={'requiredColor'}
                                                required
                                            />
                                            <i className={!pasStatus ? "fa fa-eye" : "fa fa-eye-slash"} onKeyDown={''} onClick={(e) => { setPasStatus(!pasStatus); setRePasStatus(!pasStatus) }} style={{ position: 'absolute', top: '10%', right: '5%' }}></i>
                                            <p><span className='hovertext-pass' data-hover={`Password: Enter password of min.${passwordSettingVal?.MinPasswordLength}  Length with min ${passwordSettingVal?.MinSpecialCharsInPassword} special char, Min ${passwordSettingVal?.MinUpperCaseInPassword} Uppercase, Min ${passwordSettingVal?.MinLowerCaseInPassword} Lowercase and Min ${passwordSettingVal?.MinNumericDigitsInPassword} numeric digit, Or Password Can't be in  Alphabets  and Numerical Sequence  `} ><i className='fa fa-exclamation-circle'></i></span></p>
                                            {isPasswordChange && <GeneratePassword clickedRow={clickedRow} setValue={setValue} />}
                                        </div>
                                        <span className='mt-3'><i style={{ color: errors?.PasswordError === 'true' ? 'green' : 'red', fontSize: "20px" }} className="fa fa-check-circle" aria-hidden="true"></i> </span>
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-3 mt-2 ">
                                        <label htmlFor="" className='new-label '>
                                            Re-Enter Password
                                            {errors.ReEnterPasswordError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ReEnterPasswordError}</p>
                                            ) : null}
                                        </label>
                                    </div>
                                    <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">
                                        <input type="text" name='ReEnterPassword'
                                            value={rePasStatus && value.ReEnterPassword?.trim()?.length > 0 ? '*********' : value.ReEnterPassword}
                                            onCut={handleCopy}
                                            onCopy={handleCopy}
                                            autocomplete="off"
                                            onPaste={handleCopy}
                                            className={''}
                                            // onChange={(e) => { !rePasStatus && handleChange(e) }}
                                            onChange={(e) => { !pasStatus && handleChange(e) }}
                                            required
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>NCIC Login Information</legend>
                                <div className="row mt-1" >
                                    <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                        <label htmlFor="" className='new-label px-0'>NCIC Login
                                            {/* &nbsp;ID{errors.NCICLoginIdError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.NCICLoginIdError}</p>
                                        ) : null} */}
                                        </label>
                                    </div>
                                    <div className="col-8  col-md-8 col-lg-2 mt-2 text-field">
                                        <input type="text"
                                            // onCut={handleCopy}
                                            // onCopy={handleCopy}
                                            // onPaste={handleCopy}

                                            name='NCICLoginId'
                                            value={value?.NCICLoginId || ''}
                                            // className={'requiredColor'}
                                            // maxLength={10}
                                            onChange={handleChangeNCIC}
                                            required />
                                    </div>
                                    <div className="d-flex col-6 col-md-6 col-lg-4">
                                        <div className="col-2 col-md-4 col-lg-4 mt-2">
                                            <label htmlFor="" className='new-label'>
                                                NCIC Password
                                                {/* {errors.PasswordError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PasswordError === 'false' ? 'Incorrect format' : errors.PasswordError}</p>
                                                ) : null} */}
                                            </label>
                                        </div>
                                        <div className="col-4  col-md-7 col-lg-7 mt-2 text-field">
                                            <input
                                                type={"text"}
                                                name="NCICLoginPassword"
                                                id="passwordvalue"
                                                // value={value?.NCICLoginPassword || ''}
                                                value={
                                                    showPassword
                                                        ? (value.NCICLoginPassword?.trim()?.length > 0 ? '****************' : '')
                                                        : value.NCICLoginPassword
                                                } autoComplete="off"
                                                className=""
                                                onChange={handleChangeNCIC}
                                                required
                                                readOnly={showPassword}
                                            />
                                            <span
                                                onClick={() => setshowPassword(!showPassword)}
                                                // className={!showPassword ? "fa fa-eye" : "fa fa-eye-slash"}
                                                className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    cursor: 'pointer'
                                                }}
                                            >

                                            </span>
                                        </div>

                                    </div>
                                    <div className="col-2 col-md-2 col-lg-3 mt-2 ">
                                        <label htmlFor="" className='new-label '>
                                            NCIC Terminal ID
                                            {/* {errors.ReEnterPasswordError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ReEnterPasswordError}</p>
                                            ) : null} */}
                                        </label>
                                    </div>
                                    <div className="col-4  col-md-4 col-lg-2 mt-2 text-field">
                                        <input type="text" name='NCICLoginTerminalID'
                                            // value={value?.NCICLoginTerminalID?.match(/[a-zA-Z\s]*/)}
                                            value={value?.NCICLoginTerminalID || ''}
                                            onCut={handleCopy}
                                            onCopy={handleCopy}
                                            autocomplete="off"
                                            onPaste={handleCopy}
                                            // maxLength={10}
                                            className={''}
                                            // onChange={(e) => { !rePasStatus && handleChange(e) }}
                                            onChange={handleChangeNCIC}
                                            required
                                        />
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>Other</legend>
                                <div className="row " >
                                    <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                        <label htmlFor="" className='new-label px-0'>Max&nbsp;Lock&nbsp;Level</label>
                                    </div>
                                    <div className="col-4  col-md-4 col-lg-2 mt-1 text-field">
                                        <input type="text" name='MaxLockLevel' value={value.MaxLockLevel} onChange={handleChange}
                                            required />
                                    </div>
                                    <div className="d-flex col-6 col-md-6 col-lg-4">
                                        <div className="col-4 col-md-5 col-lg-4 mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>Max&nbsp;Restrict&nbsp;Level</label>
                                        </div>
                                        <div className="col-7  col-md-7 col-lg-7 mt-1 text-field">
                                            <input type="text" name='MaxRestrictLevel' value={value.MaxRestrictLevel} onChange={handleChange}
                                                required />
                                        </div>
                                    </div>
                                    {
                                        isAdministrativeSystem &&
                                        <div className="col-4 col-md-4 col-lg-2 mt-2">
                                            {isSuperadmin === "1" && value?.IsSuperadmin ?
                                                <label className='ml-2' >Super Admin</label> :
                                                <>
                                                    <input type="checkbox" name="IsSuperadmin" value={value?.IsSuperadmin}
                                                        checked={value?.IsSuperadmin}
                                                        onChange={() => { setValue({ ...value, ['IsSuperadmin']: !value?.IsSuperadmin }); setStatesChangeStatus(true); }}
                                                        disabled={false}
                                                        id="IsSuperadmin" />
                                                    <label className='ml-2' htmlFor="IsSuperadmin">Super Admin</label>
                                                </>
                                            }
                                        </div>
                                    }
                                    <div className="col-4 col-md-4 col-lg-2  mt-2">
                                        <input type="checkbox" name="IsAllowLogin" value={value?.IsAllowLogin}
                                            checked={value?.IsAllowLogin}
                                            onChange={() => { setValue({ ...value, ['IsAllowLogin']: !value?.IsAllowLogin }); setStatesChangeStatus(true); }}
                                            disabled={false}
                                            id="IsAllowLogin" />
                                        <label className='ml-2' htmlFor="IsAllowLogin">Allow Login</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-1 mt-2">
                                        <input type="checkbox" name="IsActive"
                                            value={value?.IsActive}
                                            checked={value?.IsActive}
                                            onChange={() => {
                                                !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                                                if (inActiveCheckBox || perId && (perSta === true || perSta === 'true')) {
                                                    setValue({ ...value, ['IsActive']: !value?.IsActive });
                                                }
                                            }}
                                        />
                                        <label className='ml-2' >Active</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                        <input type="checkbox" name="IsJuvenileCleared" value={value.IsJuvenileCleared}
                                            checked={value.IsJuvenileCleared}
                                            onChange={() => { setValue({ ...value, ['IsJuvenileCleared']: !value?.IsJuvenileCleared }); setStatesChangeStatus(true); }}
                                            id="IsJuvenileCleared"
                                        />
                                        <label className='ml-2' htmlFor="IsJuvenileCleared">Juvenile Cleared</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                        <input type="checkbox" name="IsSupervisor" value={value?.IsSupervisor}
                                            checked={value?.IsSupervisor}
                                            onChange={() => { setValue({ ...value, ['IsSupervisor']: !value?.IsSupervisor }); setStatesChangeStatus(true); }}
                                            id="IsSupervisor"
                                        />
                                        <label className='ml-2' htmlFor="IsSupervisor">Report Approver</label>
                                    </div>
                                    <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                        <input type="checkbox" name="IsSupervisorPersonnel" value={value?.IsSupervisorPersonnel}
                                            checked={value?.IsSupervisorPersonnel}
                                            onChange={() => { setValue({ ...value, ['IsSupervisorPersonnel']: !value?.IsSupervisorPersonnel }); setStatesChangeStatus(true); }}
                                            id="IsSupervisorPersonnel"
                                        />
                                        <label className='ml-2' htmlFor="IsSupervisorPersonnel">Is Supervisor</label>
                                    </div>

                                    <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                        <input type="checkbox" name="IsProsecutor" value={value?.IsProsecutor}
                                            checked={value?.IsProsecutor}
                                            onChange={() => { setValue({ ...value, ['IsProsecutor']: !value?.IsProsecutor }); setStatesChangeStatus(true); }}
                                            id="IsProsecutor"
                                        />
                                        <label className='ml-2' htmlFor="IsProsecutor">Is Prosecutor</label>
                                    </div>

                                    <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                                        <input type="checkbox" name="IsIncidentEditable" value={value.IsIncidentEditable}
                                            checked={value.IsIncidentEditable}
                                            onChange={() => { setValue({ ...value, ['IsIncidentEditable']: !value?.IsIncidentEditable }); setStatesChangeStatus(true); }}
                                            id="IsIncidentEditable"
                                        />
                                        <label className='ml-2' htmlFor="IsJuvenileCleared">Is Incident Editable</label>
                                    </div>
                                    {/* <div className="col-4 col-md-4 col-lg-3 mt-1">
                                        <input type="checkbox" name="AllowMultipleLogins" value={value?.AllowMultipleLogins}
                                            checked={value?.AllowMultipleLogins}
                                            // onChange={handleChange}
                                            onChange={() => { setValue({ ...value, ['AllowMultipleLogins']: !value?.AllowMultipleLogins }); }}
                                        />
                                        <label className='ml-2' >Multiple Login</label>
                                    </div>

                                    </div> */}
                                </div>
                            </fieldset>
                        </div>
                        <div className=" col-4 col-md-4 col-lg-1 pt-1" >
                            <div className="img-box px-1">
                                {
                                    personnelImage?.length > 0 ?
                                        <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false}
                                        >
                                            {personnelImage?.map((item, index) => (
                                                <div key={item?.PhotoID ? item?.PhotoID : item?.imgID} onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel"  >
                                                    <img src={`data:image/png;base64,${item.Photo}`} style={{ height: '105px' }} />
                                                </div>
                                            ))
                                            }
                                        </Carousel>
                                        :
                                        <div data-toggle="modal" data-target="#ImageModel" onClick={() => { setImageModalStatus(true) }} key='test'>
                                            <img src={defualtImage} style={{ height: '105px' }} />
                                        </div>
                                }
                            </div>
                        </div>
                        <div className="col-12 col-lg-12  text-right" style={{ marginTop: '-25px' }}>
                            {
                                !inActiveCheckBox && <button type="button" className="btn btn-sm btn-success mr-1 " data-dismiss="modal" onClick={() => { setStatusFalse(); setIsPasswordChange(false); }}>New</button>
                            }
                            {
                                inActiveCheckBox || perId || (perSta === true || perSta === 'true') ?
                                    effectiveScreenPermission ?
                                        effectiveScreenPermission[0]?.Changeok ?
                                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={check_Validation_Error}>Update</button>
                                            : <></> :
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} disabled={!statesChangeStatus}>Update</button>
                                    :
                                    effectiveScreenPermission ?
                                        effectiveScreenPermission[0]?.AddOK ?
                                            <button type="button" className="btn btn-sm btn-success" onClick={check_Validation_Error}>Save</button>
                                            : <></>
                                        :
                                        <button type="button" className="btn btn-sm btn-success" onClick={check_Validation_Error}>Save</button>
                            }
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 ">
                            <div className="form-check custom-control custom-checkbox">
                                <input
                                    className="custom-control-input"
                                    type="checkbox"
                                    name=''
                                    id="flexCheckDefault1"
                                    style={{ cursor: 'pointer' }}
                                    onChange={handleActiveCheckBox}
                                    checked={inActiveCheckBox}
                                />
                                <label className="custom-control-label " htmlFor="flexCheckDefault1" style={{ fontSize: '14px' }}>
                                    Show In-Active Personnel
                                </label>
                            </div>
                        </div>
                        <div className="col-12 mt-1">
                            <DataTable
                                dense
                                columns={columns}
                                data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? personnelList : '' : ''}

                                highlightOnHover
                                noContextMenu
                                pagination
                                paginationPerPage={'100'}
                                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                showPaginationBottom={100}
                                // paginationPerPage={'5'}
                                // paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                responsive
                                showHeader={true}
                                persistTableHead={true}
                                customStyles={tableCustomStyles}
                                // fixedHeaderScrollHeight="150px"
                                fixedHeader
                                conditionalRowStyles={conditionalRowStyles}
                                onRowClicked={(row) => {
                                    setClickedRow(row);
                                    setEditValue(row);
                                    setIsPasswordChange(false);
                                }}
                                subHeaderAlign="right"
                                subHeaderWrap
                                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            />
                        </div>
                    </div>
                </div >
            </div >
            <DeletePopUpModal func={delete_Personnel} />
            {/* <IdentifyFieldColor /> */}

            <ChangesModal hasPermission={perId || (perSta === true || perSta === 'true') ? permissionForEditPersonnel : permissionForAddPersonnel} func={check_Validation_Error} />

            <ImageModel multiImage={personnelImage} pinID={loginPinID} setStatesChangeStatus={setStatesChangeStatus} primaryOfficerID={agencyOfficerDrpData} setMultiImage={setPersonnelImage} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageId} setImageId={setImageId} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_Personnel_MultiImage} agencyID={loginAgencyID} />
        </>
    )
}


export default Home


export const changeArrayFormat = (data, type) => {
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.DivisionID, label: sponsor.Name })
        )
        return result
    }
    if (type === 'rank') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RankID, label: sponsor.RankDescription })
        )
        return result
    }
    if (type === 'shift') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        return result
    }
    if (type === 'photoType') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.PhotoTypeId, label: sponsor.PhotoType })
        )
        return result
    }
    if (type === 'genderId') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.SexCodeID, label: sponsor.Description })
        )
        return result
    }
    if (type === 'EmployeeType') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.EmployeeTypeID, label: sponsor.Description })
        )
        return result
    }

    if (type === 'AccountType') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AccountTypeID, label: sponsor.Description })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type) => {
    if (type === 'division') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.DivisionId, label: sponsor.DivisionName })
        )
        return result[0]
    }
    if (type === 'rank') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.RankID, label: sponsor.RankName })
        )
        return result[0]
    }
    if (type === 'shift') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.ShiftID, label: sponsor.ShiftDescription })
        )
        return result[0]
    }
    if (type === 'EmployeeName') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.EmployeeTypeID, label: sponsor.EmployeeTypeDescription })
        )
        return result[0]
    }
    if (type === 'gender') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.SexID, label: sponsor.Gender_Name })
        )
        return result[0]
    }

    if (type === 'AccountType') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.AccountTypeID, label: sponsor.AccountTypeDescription })
        )
        return result[0]
    }
}

