import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import Select, { components } from "react-select";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, DecryptedList, filterPassedTime, EncryptedList, getShowingDateText, base64ToString, getShowingMonthDateYear, stringToBase64, getShowingWithOutTime, tableCustomStyles, Aes256Encrypt, Requiredcolour, nibrscolourStyles, nibrsErrorMultiSelectStyles } from '../../../Common/Utility';
import { AddDeleteUpadate, AddDelete_Img, fetchData, fetchPostData, fetchPostDataNibrs } from '../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormatBasicInfo, Comman_changeArrayFormatBasicInfowithoutcode, Comman_changeArrayFormatJustfiableHomicide, Comman_changeArrayFormat_With_Name, changeArray, fourColArray, fourColArrayReasonCode, offenseArray, sixColArray, threeColArray, threeColArrayWithCode, threeColVictimInjuryArray, threeColVictimOffenseArray } from '../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Email_Field, PhoneFieldNotReq, RequiredField, NameValidationCharacter, PhoneField, FaxField, ORIValidatorVictim } from '../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident, Space_Allow_with_Trim, Space_Not_Allow, Space_NotAllow } from '../../Utility/Personnel/Validation';
import { Comparision, SSN_Field, Heights, SSN_FieldName, Comparisionweight, Comparision2 } from '../../PersonnelCom/Validation/PersonnelValidation';
import { get_Inc_ReportedDate, get_LocalStoreData, get_NameTypeData } from '../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_Masters_Name_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import SelectBox from '../../../Common/SelectBox';
import { assult_Type_Nibrs_Errors, check_injuryType_Nibrs, checkOffenderIsUnknown, ErrorStyle, ErrorTooltip, ErrorTooltipComp, SexOfVictimError, SocietyPublicError, StatutoryRapeError, VectimOffenderSpouceError, victimNibrsErrors } from '../../Name/NameNibrsErrors';
import ChangesModal from '../../../Common/ChangesModal';
import DatePicker from "react-datepicker";
import ListModal from '../../Utility/ListManagementModel/ListModal';
import NirbsErrorShowModal from '../../../Common/NirbsErrorShowModal';
import Loader from '../../../Common/Loader';

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const MainVictims = ({ victimClick, isNibrsSummited = false, ValidateProperty = () => { } }) => {


    const SelectedValue = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const nameTypeData = useSelector((state) => state.Agency.nameTypeData);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { get_Incident_Count, nameSearchStatus, nameSingleData, nibrsSubmittedName, nibrsSubmittedVictim, setnibrsSubmittedVictim, get_NameVictim_Count, get_Name_Count, setChangesStatus, setcountAppear, setAuditCount, setNameSearchStatus, setcountStatus, setNameSingleData, changesStatus, setoffenceCountStatus, validate_IncSideBar } = useContext(AgencyContext);


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const saveButtonRef = useRef(null);
    const closeButtonRef = useRef(null);
    const firstNameInputRef = useRef(null);

    let DeNameID = 0, DeMasterNameID = 0

    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");

    let openPageName = query?.get('page');
    var NameID = query?.get("NameID");
    var NameStatus = query?.get("NameStatus");
    var MasterNameID = query?.get("MasterNameID");
    let MstPage = query?.get('page');
    let ModNo = query?.get('ModNo');

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!NameID) NameID = 0;
    else DeNameID = parseInt(base64ToString(NameID));
    if (!MasterNameID) MasterNameID = 0;
    else DeMasterNameID = parseInt(base64ToString(MasterNameID));


    const [nameFilterData, setNameFilterData] = useState([]);
    const [victimInjuryID, setVictimInjuryID] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [editval, setEditval] = useState([]);
    const [dobDate, setDobDate] = useState();
    const [yearsVal, setYearsVal] = useState();

    const [injuryTypeDrp, setInjuryTypeDrp] = useState();
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [ageUnitDrpData, setAgeUnitDrpData] = useState([]);
    const [suffixIdDrp, setSuffixIdDrp] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [phoneTypeIdDrp, setPhoneTypeIdDrp] = useState([]);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [nameTypeCode, setNameTypeCode] = useState();
    const [businessTypeDrp, setBusinessTypeDrp] = useState([]);
    const [phoneTypeCode, setPhoneTypeCode] = useState('');
    const [isAdult, setIsAdult] = useState(false);
    const [IsOffender, setIsOffender] = useState(false);
    const [ownerNameData, setOwnerNameData] = useState([]);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [called, setcalled] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const crossButtonRef = useRef(null);
    const [victimTypeDrp, setVictimTypeDrp] = useState([]);
    const [callTypeDrp, setCallTypeDrp] = useState([]);
    const [assignmentTypeDrp, setAssignmentTypeDrp] = useState([]);
    const [victimTypeStatus, setvictimTypeStatus] = useState(false);

    const [justifiableHomiDrp, setJustifiableHomiDrp] = useState();
    const [justifiableHomiEditVal, setJustifiableHomiEditVal] = useState();
    const [justifiyID, setJustifiyID] = useState([]);

    const [addVerifySingleData, setAddVerifySingleData] = useState([]);
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [masterNameID, setMasterNameID] = useState();
    const [nameID, setNameID] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState(1);
    const [possessionID, setPossessionID] = useState('');
    const [juvinile, setJuvinile] = useState();
    const [uploadImgFiles, setuploadImgFiles] = useState([]);

    const [onSelectLocation, setOnSelectLocation] = useState(true);
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [availableAlert, setAvailableAlert] = useState([]);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [saveValue, setsaveValue] = useState(false);
    const [isAdultArrest, setIsAdultArrest] = useState(false);
    const [isMissing, setisMissing] = useState(false);
    const [isVictim, setIsVictim] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [residentIDDrp, setResidentIDDrp] = useState([]);
    const [injuryTypeEditVal, setInjuryTypeEditVal] = useState();
    const [assaultID, setAssaultID] = useState();
    const [assaultEditVal, setAssaultEditVal] = useState();
    const [assultCodeArr, setAssultCodeArr] = useState([]);
    const [assaultDrp, setAssaultDrp] = useState();
    const [victimID, setvictimID] = useState('');
    const [baseDate, setBaseDate] = useState('');
    const [oriNumber, setOriNumber] = useState('');
    const [roleStatus, setroleStatus] = useState(false);
    const [isSecondDropdownDisabled, setIsSecondDropdownDisabled] = useState(true);
    const [isCrimeAgainstPerson, setIsCrimeAgainstPerson] = useState(false);
    const [has120RoberyOffense, setHas120RoberyOffense] = useState(false);

    // nibrs 
    const [nibrsValidateNameData, setnibrsValidateNameData] = useState([]);
    const [nibrsErrStr, setNibrsErrStr] = useState('');
    const [clickNibloder, setclickNibLoder] = useState(false);
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [nibrsFieldError, setnibrsFieldError] = useState({});

    const [showInjuryTypeError, setShowInjuryTypeError] = useState(false);
    const [showAssaultTypeError, setShowAssaultTypeError] = useState(false);
    const [showVictimAgeError, setShowVictimAgeError] = useState(false);
    const [showAssignmentTypeError, setShowAssignmentTypeError] = useState(false);
    const [showOffenseTypeError, setShowOffenseTypeError] = useState(false);
    const [showJustifyHomicideError, setShowJustifyHomicideError] = useState(false);
    const [showCallTypeError, setShowCallTypeError] = useState(false);
    const [victimCode, setVictimCode] = useState('');

    const [isSocietyName, setIsSocietyName] = useState(false);
    const [isInjurryRequired, setisInjurryRequired] = useState(false);
    const [nibrsCodeArray, setnibrsCodeArray] = useState([]);
    const [arrestCount, setarrestCount] = useState('');

    // ---------------------offence-----------------------------    
    const [offenseDrp, setOffenseDrp] = useState();
    const [offensemultiSelected, setoffensemultiSelected] = useState({
        optionSelected: null
    })

    const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState([]);

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })

    const [multiSelectedReason, setMultiSelectedReason] = useState({
        optionSelected: null
    })

    const assaultID20Or21 = assaultID?.some((item) => (item.code === '20' || item.code === '21'));

    const [value, setValue] = useState({
        'NameIDNumber': 'Auto Generated', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
        'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '', 'AgeUnitID': '', 'IsJuvenile': '', 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '',
        'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'DateOfBirth': '', 'CertifiedDtTm': '', 'AgeFrom': '',
        'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'NameID': '', 'ArrestID': "", 'WarrantID': "", 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0, 'VictimCode': '',
        'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': '', 'NameLocationID': '', 'DLNumber': "", 'DLStateID': '', 'IsUnknown': false, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
        'Role': '', 'ResidentID': '', 'IsInjury': '', 'VictimTypeID': '', 'CallTypeID': '', 'AssignmentTypeID': '', 'ORI': '',
    })

    const [errors, setErrors] = useState({
        'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'InjuryTypeError': '',
        'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'DLError': 'true', 'SexIDError': '', 'AddressError': 'true', 'CrimeLocationError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',

        'CallTypeIDError': '', 'AssignmentTypeIDError': '', "AssaultTypeIDError": '', 'JusifiableHomicideError': '',
    })

    const [imgData, setImgData] = useState({
        "PictureTypeID": '', "ImageViewID": '', "ImgDtTm": '', "OfficerID": '', "Comments": '', "DocumentID": ''
    })

    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            try {
                if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
                    if (uniqueId) {
                        await dispatch(get_LocalStoreData(uniqueId));
                    }
                    await get_Incident_Count(IncID, localStoreData?.PINID);
                    setMainIncidentID(IncID);
                }
            } catch (error) {
                console.error('Error initializing data:', error);

            }
        };
        initializeData();
    }, [localStoreData, uniqueId, IncID]);

    // Handle local store data updates
    useEffect(() => {
        if (!localStoreData) return;

        const { AgencyID, PINID, BaseDate, ORI } = localStoreData;

        // Set login credentials
        setLoginAgencyID(AgencyID);
        setLoginPinID(PINID);

        // Fetch screen permissions
        dispatch(get_ScreenPermissions_Data("N046", AgencyID, PINID));
        // Set additional data
        setBaseDate(BaseDate ?? null);
        setOriNumber(ORI);
    }, [localStoreData]);

    // Update master name ID when value changes
    useEffect(() => {
        setMasterNameID(value.MasterNameID);
    }, [value.MasterNameID]);

    // Handle name count updates
    useEffect(() => {
        if (DeNameID || DeMasterNameID) {
            const isMasterPage = MstPage === "MST-Name-Dash";
            get_Name_Count(DeNameID, DeMasterNameID, isMasterPage);
        }
    }, [DeNameID, DeMasterNameID]);

    // Fetch name data
    const get_Data_Name = async (NameID) => {
        const params = {
            'IncidentID': NameID || 0,
            'IsVictimName': true
        };

        try {
            const res = await fetchPostData('MasterName/GetData_VictimOffender', params);
            if (!res) {
                throw new Error('No data received from API');
            }

            setNameFilterData(res);
        } catch (error) {
            console.error('Error fetching victim data:', error);

            setNameFilterData([]);
        }
    };

    useEffect(() => {
        if (IncID) {
            setMainIncidentID(IncID);
            dispatch(get_Inc_ReportedDate(IncID));
            get_Offense_DropDown(IncID, DeNameID || 0);
        } else {
            Reset();
        }
    }, [IncID]);

    // Handle incident data updates
    useEffect(() => {
        if (IncID) {
            setMainIncidentID(IncID);
            get_Arrestee_Drp_Data(IncID);
            get_Data_Name(IncID);
        }
    }, [IncID, nameModalStatus, possessionID]);

    useEffect(() => {
        if (MstPage === "MST-Name-Dash" && possessionID) {
            dispatch(get_Masters_Name_Drp_Data(possessionID, DeNameID, DeMasterNameID));
        }
        if (possessionID) { setValue({ ...value, ['OwnerNameID']: parseInt(possessionID) }) }
    }, [possessionID, ownerNameData]);

    useEffect(() => {
        if (DeNameID || DeMasterNameID) {
            setNameID(DeNameID); GetSingleData(DeNameID, DeMasterNameID); setMasterNameID(DeMasterNameID)
        } else {
            Reset()
        }
        if (DeNameID || DeMasterNameID || MstPage === "MST-Name-Dash") {
            setNameID(DeNameID); GetSingleData(DeNameID, DeMasterNameID); setMasterNameID(DeMasterNameID)
        }
        else {
            Reset()
        }
    }, [DeNameID, DeMasterNameID]);

    useEffect(() => {
        if (mainIncidentID) {
            setValue({ ...value, 'AgencyID': loginAgencyID, 'IncidentID': mainIncidentID, 'CreatedByUserFK': loginPinID, });
        }
    }, [mainIncidentID]);

    useEffect(() => {
        if (reasonIdDrp.length > 0) {
            GetDataVictimCheck(DeNameID, DeMasterNameID);
        }
    }, [reasonIdDrp]);

    useEffect(() => {
        if (nameTypeData?.length > 0) {
            const Id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
            if (Id.length > 0 && (NameStatus == null || NameStatus == 'null' || NameStatus == false || NameStatus == 'false')) {
                setValue({ ...value, ['NameTypeID']: Id[0]?.value, })
                setNameTypeCode(Id[0].id);
            }
        }
    }, [nameTypeData, mainIncidentID])

    const check_Validation_Error = (e) => {
        const { LastName, FirstName, MiddleName, NameTypeID, NameReasonCodeID, SSN, DLStateID, DLNumber, Contact, HeightFrom, HeightTo, WeightFrom, WeightTo, AgeFrom, AgeTo, SexID, RaceID, DateOfBirth, IsUnknown } = value;
        if (isAdult || IsOffender || victimTypeStatus) {
            const ORI = ORIValidatorVictim(value?.ORI);
            const SexIDError = RequiredField(value.SexID);
            const RaceIDErr = RequiredField(value.RaceID);
            const DateOfBirthErr = (isAdult && value?.IsUnknown) || isAdult || IsOffender || victimTypeStatus ? 'true' : RequiredField(value.DateOfBirth);
            const CrimeLocationErr = onSelectLocation || value.Address === '' ? 'true' : 'true';
            const LastNameErr = NameValidationCharacter(LastName, 'LastName', FirstName, MiddleName, LastName);
            const FirstNameErr = NameValidationCharacter(FirstName, 'FirstName', FirstName, MiddleName, LastName);
            const MiddleNameErr = NameValidationCharacter(MiddleName, 'MiddleName', FirstName, MiddleName, LastName);
            const NameTypeIDErr = RequiredFieldIncident(value.NameTypeID);
            const NameReasonCodeIDErr = MstPage === "MST-Name-Dash" ? 'true' : RequiredFieldIncident(value.NameReasonCodeID);
            const SSNErr = SSN_Field(value.SSN);
            const DLError = value.DLStateID ? RequiredFieldIncident(value.DLNumber) : 'true'
            const OwnerPhoneNumberError = value.OwnerPhoneNumber ? PhoneField(value.OwnerPhoneNumber) : 'true'
            const OwnerFaxNumberError = value.OwnerFaxNumber ? FaxField(value.OwnerFaxNumber) : 'true'
            const AgeFromErr = victimTypeStatus && !value.IsUnknown && !value.DateOfBirth || isAdult && !value.IsUnknown || IsOffender && !value.IsUnknown ? RequiredFieldIncident(value.AgeFrom) : 'true'
            const EthnicityErrorr = victimTypeStatus ? RequiredFieldIncident(value.EthnicityID) : 'true'
            const ResidentErr = victimTypeStatus ? RequiredFieldIncident(value.ResidentID) : 'true'
            const RoleErr = RequiredFieldIncident(value.Role);
            const VictimTypeError = roleStatus ? RequiredFieldIncident(value.VictimTypeID) : 'true';

            const InjuryTypeError = victimCode === 'L' && nibrsCodeArray?.includes('120') ? 'true' : isInjurryRequired ? validateFields(victimInjuryID) : 'true';
            const CallTypeIDError = victimCode === 'L' ? RequiredFieldIncident(value.CallTypeID) : 'true';
            const AssignmentTypeIDError = victimCode === 'L' ? RequiredFieldIncident(value.AssignmentTypeID) : 'true';
            const AssaultTypeIDErr = nibrsCodeArray?.includes('09A') || nibrsCodeArray?.includes('09C') || nibrsCodeArray?.includes('13A') ? validateFields(assaultID) : 'true';

            const JusifiableHomicideErr = assaultID20Or21 ? validateFields(justifiyID) : 'true';


            setErrors(prevValues => {
                return {
                    ...prevValues,
                    ['ORITypeErrors']: ORI || prevValues['ORITypeErrors'],
                    ['SexIDError']: SexIDError || prevValues['SexIDError'],
                    ['RaceIDError']: RaceIDErr || prevValues['RaceIDError'],
                    ['DateOfBirthError']: DateOfBirthErr || prevValues['DateOfBirthError'],
                    ['LastNameError']: LastNameErr || prevValues['LastNameError'],
                    ['FirstNameError']: FirstNameErr || prevValues['FirstNameError'],
                    ['MiddleNameError']: MiddleNameErr || prevValues['MiddleNameError'],
                    ['NameTypeIDError']: NameTypeIDErr || prevValues['NameTypeIDError'],
                    ['NameReasonCodeIDError']: NameReasonCodeIDErr || prevValues['NameReasonCodeIDError'],
                    ['SSN']: SSNErr || prevValues['SSN'],
                    ['DLError']: DLError || prevValues['DLError'],
                    ['OwnerPhoneNumberError']: OwnerPhoneNumberError || prevValues['OwnerPhoneNumberError'],
                    ['OwnerFaxNumberError']: OwnerFaxNumberError || prevValues['OwnerFaxNumberError'],
                    ['CrimeLocationError']: CrimeLocationErr || prevValues['CrimeLocationError'],
                    ['AgeFromError']: AgeFromErr || prevValues['AgeFromError'],
                    ['EthnicityErrorr']: EthnicityErrorr || prevValues['EthnicityErrorr'],
                    ['ResidentError']: ResidentErr || prevValues['ResidentError'],
                    ['RoleError']: RoleErr || prevValues['RoleError'],
                    ['VictimTypeError']: VictimTypeError || prevValues['VictimTypeError'],
                    ['InjuryTypeError']: InjuryTypeError || prevValues['InjuryTypeError'],

                    ['CallTypeIDError']: CallTypeIDError || prevValues['CallTypeIDError'],
                    ['AssignmentTypeIDError']: AssignmentTypeIDError || prevValues['AssignmentTypeIDError'],

                    ['JusifiableHomicideError']: JusifiableHomicideErr || prevValues['JusifiableHomicideError'],
                    ['AssaultTypeIDError']: AssaultTypeIDErr || prevValues['AssaultTypeIDError'],
                }
            })

            // Phone Validation
            if (phoneTypeCode === 'E') {
                Email_Field(value.Contact) && setErrors(prevValues => { return { ...prevValues, ['ContactError']: Email_Field(value.Contact) } })
            } else if (phoneTypeCode) {
                PhoneFieldNotReq(value.Contact) && setErrors(prevValues => { return { ...prevValues, ['ContactError']: PhoneFieldNotReq(value.Contact) } })
            }
            // height validation
            if (Heights(value.HeightFrom, value.HeightTo, 'Height') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'error' } })
            }

            //Weight Validation
            if (Comparisionweight(value.WeightFrom, value.WeightTo, 'Weight') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'error' } })
            }
            // //Age Validation
            if (Comparision2(value.AgeFrom, value.AgeTo, 'Age', value.AgeUnitID, nameTypeCode) === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'Invalid' } })
            }


        } else {
            const ORI = ORIValidatorVictim(value?.ORI);
            const LastNameErr = NameValidationCharacter(LastName, 'LastName', FirstName, MiddleName, LastName);
            const FirstNameErr = NameValidationCharacter(FirstName, 'FirstName', FirstName, MiddleName, LastName);
            const MiddleNameErr = NameValidationCharacter(MiddleName, 'MiddleName', FirstName, MiddleName, LastName);
            const CrimeLocationErr = onSelectLocation || value.Address === '' ? 'true' : 'true';
            const NameTypeIDErr = RequiredFieldIncident(value.NameTypeID);
            const NameReasonCodeIDErr = MstPage === "MST-Name-Dash" ? 'true' : RequiredFieldIncident(value.NameReasonCodeID);
            const SSNErr = SSN_Field(value.SSN);
            const DLError = value.DLStateID ? RequiredFieldIncident(value.DLNumber) : 'true'
            const ContactErr = phoneTypeCode ? phoneTypeCode === 'E' ? Email_Field(value.Contact) : PhoneFieldNotReq(value.Contact) : 'true';
            const OwnerPhoneNumberError = value.OwnerPhoneNumber ? PhoneField(value.OwnerPhoneNumber) : 'true'
            const OwnerFaxNumberError = value.OwnerFaxNumber ? FaxField(value.OwnerFaxNumber) : 'true'
            const RoleErr = RequiredFieldIncident(value.Role);
            const VictimTypeError = roleStatus ? RequiredFieldIncident(value.VictimTypeID) : 'true';

            const InjuryTypeError = victimCode === 'L' && nibrsCodeArray?.includes('120') ? 'true' : isInjurryRequired ? validateFields(victimInjuryID) : 'true';
            const CallTypeIDError = victimCode === 'L' ? RequiredFieldIncident(value.CallTypeID) : 'true';
            const AssignmentTypeIDError = victimCode === 'L' ? RequiredFieldIncident(value.AssignmentTypeID) : 'true';
            const AssaultTypeIDErr = nibrsCodeArray?.includes('09A') || nibrsCodeArray?.includes('09C') || nibrsCodeArray?.includes('13A') ? validateFields(assaultID) : 'true';

            const JusifiableHomicideErr = assaultID20Or21 ? validateFields(justifiyID) : 'true';

            setErrors(prevValues => {
                return {
                    ...prevValues,
                    ['ORITypeErrors']: ORI || prevValues['ORITypeErrors'],
                    ['LastNameError']: LastNameErr || prevValues['LastNameError'],
                    ['FirstNameError']: FirstNameErr || prevValues['FirstNameError'],
                    ['MiddleNameError']: MiddleNameErr || prevValues['MiddleNameError'],
                    ['NameTypeIDError']: NameTypeIDErr || prevValues['NameTypeIDError'],
                    ['CrimeLocationError']: CrimeLocationErr || prevValues['CrimeLocationError'],
                    ['NameReasonCodeIDError']: NameReasonCodeIDErr || prevValues['NameReasonCodeIDError'],
                    ['SSN']: SSNErr || prevValues['SSN'],
                    ['ContactError']: ContactErr || prevValues['ContactError'],
                    ['DLError']: DLError || prevValues['DLError'],
                    ['OwnerPhoneNumberError']: OwnerPhoneNumberError || prevValues['OwnerPhoneNumberError'],
                    ['OwnerFaxNumberError']: OwnerFaxNumberError || prevValues['OwnerFaxNumberError'],
                    ['RoleError']: RoleErr || prevValues['RoleError'],
                    ['VictimTypeError']: VictimTypeError || prevValues['VictimTypeError'],
                    ['InjuryTypeError']: InjuryTypeError || prevValues['InjuryTypeError'],

                    ['CallTypeIDError']: CallTypeIDError || prevValues['CallTypeIDError'],
                    ['AssignmentTypeIDError']: AssignmentTypeIDError || prevValues['AssignmentTypeIDError'],
                    ['JusifiableHomicideError']: JusifiableHomicideErr || prevValues['JusifiableHomicideError'],
                    ['AssaultTypeIDError']: AssaultTypeIDErr || prevValues['AssaultTypeIDError'],
                }
            })

            // Phone Validation
            if (phoneTypeCode === 'E') {
                Email_Field(value.Contact) && setErrors(prevValues => { return { ...prevValues, ['ContactError']: Email_Field(value.Contact) } })
            } else if (phoneTypeCode) {
                PhoneFieldNotReq(value.Contact) && setErrors(prevValues => { return { ...prevValues, ['ContactError']: PhoneFieldNotReq(value.Contact) } })
            }

            // height validation
            if (Heights(value.HeightFrom, value.HeightTo, 'Height') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['HeightError']: 'error' } })
            }

            // Weight Validation
            if (Comparisionweight(value.WeightFrom, value.WeightTo, 'Weight') === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['WeightError']: 'error' } })
            }
            //Age Validation
            if (Comparision2(value.AgeFrom, value.AgeTo, 'Age', value.AgeUnitID, nameTypeCode) === 'true') {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'true' } })
            } else {
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'Invalid' } })
            }

        }
    };

    const validateFields = (field) => {
        console.log("🚀 ~ validateFields ~ field:", field)

        if (field?.length == 0) {
            return 'Required *';
        } else {
            return 'true'
        }
    };

    const handleKeyDown = (e) => {
        const charCode = e.keyCode || e.which;
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
        const numKeys = Array.from({ length: 10 }, (_, i) => i + 48);
        const numpadKeys = Array.from({ length: 10 }, (_, i) => i + 96);

        if (!controlKeys?.includes(charCode) && !numKeys?.includes(charCode) && !numpadKeys?.includes(charCode)) {
            e.preventDefault();
        }
    };

    // Check All Field Format is True Then Submit   
    const { LastNameError, OwnerPhoneNumberError, CrimeLocationError, ORITypeErrors, AgeFromError, EthnicityErrorr, ResidentError, VictimTypeError, InjuryTypeError, RoleError, OwnerFaxNumberError, FirstNameError, MiddleNameError, NameTypeIDError, CertifiedByIDError, NameReasonCodeIDError, ContactError, DLError, SSN, WeightError, HeightError, AgeError, DateOfBirthError, RaceIDError, SexIDError, CallTypeIDError, AssignmentTypeIDError, JusifiableHomicideError, AssaultTypeIDError } = errors

    useEffect(() => {
        if (nameTypeCode === 'B') {
            if (LastNameError === 'true' && FirstNameError === 'true' && ORITypeErrors === 'true' && CrimeLocationError === 'true' && InjuryTypeError === 'true' && RoleError === 'true' && CrimeLocationError === 'true' && OwnerPhoneNumberError === 'true' && OwnerFaxNumberError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && DLError === 'true' && SSN === 'true' && HeightError === 'true' && WeightError === 'true' && AgeError === 'true' && CallTypeIDError === 'true' && AssignmentTypeIDError === 'true' && JusifiableHomicideError === 'true' && AssaultTypeIDError === 'true') {

                if (MstPage === "MST-Name-Dash") {
                    if (masterNameID) {
                        Update_Name();
                    } else {
                        InsertName();
                    }
                }
                else {
                    if (nameID && masterNameID) {
                        Update_Name();
                    } else {
                        InsertName();
                    }
                }
            }
        } else if (isAdult || IsOffender || victimTypeStatus) {
            if (LastNameError === 'true' && OwnerPhoneNumberError === 'true' && ORITypeErrors === 'true' && CrimeLocationError === 'true' && InjuryTypeError === 'true' && VictimTypeError === 'true' && RoleError === 'true' && ResidentError === 'true' && EthnicityErrorr === 'true' && AgeFromError === 'true' && FirstNameError === 'true' && OwnerFaxNumberError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && DLError === 'true' && SSN === 'true' && HeightError === 'true' && WeightError === 'true' && AgeError === 'true' && DateOfBirthError === 'true' && RaceIDError === 'true' && SexIDError === 'true' && CallTypeIDError === 'true' && AssignmentTypeIDError === 'true' && JusifiableHomicideError === 'true' && AssaultTypeIDError === 'true') {
                if (MstPage === "MST-Name-Dash") {
                    if (masterNameID) {
                        Update_Name();
                    } else {
                        InsertName();
                    }
                }
                else {
                    if (nameID && masterNameID) {
                        Update_Name();
                    } else {
                        InsertName();
                    }
                }
            }
        } else if (LastNameError === 'true' && OwnerPhoneNumberError === 'true' && ORITypeErrors === 'true' && CrimeLocationError === 'true' && InjuryTypeError === 'true' && VictimTypeError === 'true' && RoleError === 'true' && FirstNameError === 'true' && OwnerFaxNumberError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && DLError === 'true' && SSN === 'true' && HeightError === 'true' && WeightError === 'true' && AgeError === 'true' && CallTypeIDError === 'true' && AssignmentTypeIDError === 'true' && JusifiableHomicideError === 'true' && AssaultTypeIDError === 'true') {
            if (MstPage === "MST-Name-Dash") {
                if (masterNameID) {
                    Update_Name();
                } else {
                    InsertName();
                }
            }
            else {
                if (nameID && masterNameID) {
                    Update_Name();
                } else {
                    InsertName();
                }
            }
        }
    }, [LastNameError, FirstNameError, OwnerPhoneNumberError, EthnicityErrorr, ORITypeErrors, MiddleNameError, ResidentError, InjuryTypeError, VictimTypeError, RoleError, AgeFromError, CrimeLocationError, OwnerFaxNumberError, DLError, NameTypeIDError, NameReasonCodeIDError, ContactError, SSN, WeightError, HeightError, AgeError, DateOfBirthError, RaceIDError, SexIDError, CallTypeIDError, AssignmentTypeIDError, JusifiableHomicideError, AssaultTypeIDError])

    useEffect(() => {
        if (loginAgencyID) {
            get_Call_Type_Data(loginAgencyID);
            get_AssignmentType_Data(loginAgencyID);

            if (nameTypeData.length === 0 || MstPage === "MST-Name-Dash") { dispatch(get_NameTypeData(loginAgencyID)); }
            get_Name_Drp_Data(loginAgencyID)
        }
        if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
    }, [loginAgencyID])

    useEffect(() => {
        if (loginAgencyID || IncID) dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
    }, [loginAgencyID, IncID]);

    const get_AssignmentType_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('VictimAssignmentType/GetDataDropDown_VictimAssignmentType', val).then((data) => {
            if (data) {
                setAssignmentTypeDrp(Comman_changeArrayFormat(data, 'VictimAssignmentTypeID', 'Description'))
            } else {
                setAssignmentTypeDrp([]);
            }
        })
    }

    const get_Call_Type_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('VictimCallType/GetDataDropDown_VictimCallType', val).then((data) => {
            if (data) {
                setCallTypeDrp(Comman_changeArrayFormat(data, 'VictimCallTypeID', 'Description'))
            } else {
                setCallTypeDrp([]);
            }
        })
    }

    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                setAgeUnitDrpData(threeColArray(data[0]?.AgeUnit, 'AgeUnitID', 'Description', 'AgeUnitCode'));
                setEthinicityDrpData(Comman_changeArrayFormat(data[0]?.Ethnicity, 'EthnicityID', 'Description'));
                setSexIdDrp(Comman_changeArrayFormat(data[0]?.Gender, 'SexCodeID', 'Description'));
                setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
                setSuffixIdDrp(Comman_changeArrayFormat(data[0]?.Suffix, 'SuffixID', 'Description'));
                setPhoneTypeIdDrp(threeColArray(data[0]?.ContactType, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))


            } else {
                setAgeUnitDrpData([]); setEthinicityDrpData([]); setSexIdDrp([]); setRaceIdDrp([]); setSuffixIdDrp([]);
                setPhoneTypeIdDrp([]);
            }
        })
    };

    const get_Arrestee_Drp_Data = (IncidentID) => {
        const val = { 'MasterNameID': 0, 'IncidentID': IncidentID, 'IsOwnerName': true }
        fetchPostData('Arrest/GetDataDropDown_Arrestee', val).then((data) => {
            if (data) {
                setOwnerNameData(sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID'));
            } else {
                setOwnerNameData([])
            }
        })
    };

    useEffect(() => {
        if (loginAgencyID && value.NameTypeID) {
            GetReasonIdDrp(loginAgencyID, value.NameTypeID, value?.Role);
        }
    }, [value.NameTypeID])

    const GetDataVictimCheck = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        const val2 = { 'MasterNameID': masterNameID, 'NameID': 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('MasterName/GetDataNameArrestVictimCheck', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {
                const data = res[0];
                const reasonIdDrp = multiSelected.optionSelected ? multiSelected.optionSelected : [];
                const checkIsArrestArr = reasonIdDrp?.filter((item) => item?.label === "Adult Arrest");
                const isJuvinileArrest = reasonIdDrp?.filter((item) => item?.label === "Juvenile Arrest");
                const isVictim = reasonIdDrp?.filter((item) => item?.label === "Victim");
                const isMissingPerson = reasonIdDrp?.filter((item) => item?.label === "Missing Person");

                if (data?.Arrest === 0 && (checkIsArrestArr?.length > 0 || isJuvinileArrest?.length > 0)) {
                    setIsAdultArrest(true);
                } else {
                    setIsAdultArrest(false);

                }
                if (data.MissingPerson === 0 && isMissingPerson?.length > 0) {
                    setisMissing(true);
                } else {
                    setisMissing(false);

                }
            }
        })
    }

    const GetSingleData = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        const val2 = { 'MasterNameID': masterNameID, 'NameID': 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('MasterName/GetSingleData_MasterName', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {
                const victimID = res[0]?.VictimID;

                GetVictimSingleData(nameID);

                setvictimID(victimID);
                const isSocietyName = res[0]?.IsSociety;
                setIsSocietyName(isSocietyName === 'true' ? true : false);
                setEditval(res); setNameSingleData(res);
            } else {
                setEditval([]); setNameSingleData([])
            }
        })
    }

    const GetMasterSingleData = () => {
        const val = { 'MasterNameID': masterNameID, 'NameID': 0, }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setEditval(res);
            } else { setEditval() }
        })
    }

    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setPossenSinglData(res);
            } else { setPossenSinglData([]); }
        })
    }

    useEffect(() => {
        const currentNameTypeID = editval[0]?.NameTypeID;
        if (currentNameTypeID !== undefined && currentNameTypeID !== null) {
            get_Victim_Type_Data(loginAgencyID, currentNameTypeID);
        }
    }, [editval[0]?.NameTypeID]);

    useEffect(() => {
        if (nameID || masterNameID) {
            if (editval.length > 0) {
                setAuditCount(true)
                get_Arrestee_Drp_Data(mainIncidentID);

                if (editval[0]?.DLCountryID || editval[0]?.DLStateID || editval[0]?.DLNumber || editval[0]?.MaritalStatusID || editval[0]?.HairColorID || editval[0]?.BIVerifyID
                    || editval[0]?.BICountryID || editval[0]?.BIStateID || editval[0]?.BICityID || editval[0]?.DLVerifyID || editval[0]?.ResidentID || editval[0]?.EyeColorID ||
                    editval[0]?.BINationality || editval[0]?.BirthPlace || editval[0]?.IsUSCitizen
                ) {

                    setcountStatus(true);
                }
                else {
                    setcountStatus(false);
                }
                if (editval[0]?.FaceShapeID || editval[0]?.ComplexionID || editval[0]?.HairStyleID || editval[0]?.FacialHairID1 || editval[0]?.FacialHairID2 || editval[0]?.DistinctFeatureID1 || editval[0]?.DistinctFeatureID2 || editval[0]?.HairLengthID || editval[0]?.HairShadeID || editval[0]?.FacialOddityID1
                    || editval[0]?.FacialOddityID2 || editval[0]?.FacialOddityID3 || editval[0]?.BodyBuildID || editval[0]?.SpeechID || editval[0]?.TeethID || editval[0]?.GlassesID || editval[0]?.Clothing || editval[0]?.HandednessID
                ) { setcountAppear(true); }
                else { setcountAppear(false); }
                if (editval[0]?.NameTypeID === 2) { GetBusinessTypeDrp(loginAgencyID) }
                setValue({
                    ...value,
                    'MasterNameID': editval[0]?.MasterNameID,
                    'NameID': editval[0]?.NameID,
                    'IsUnknown': editval[0]?.IsUnknown,
                    'NameIDNumber': editval[0]?.NameIDNumber ? editval[0]?.NameIDNumber : 'Auto Generated',
                    'checkVictem': editval[0]?.NewVictimID ? editval[0]?.NewVictimID[0]?.NewVictimID : "",
                    'checkOffender': editval[0]?.NewOffenderID ? editval[0]?.NewOffenderID[0]?.NewOffenderID : "",
                    'checkArrest': editval[0]?.ArrestID ? editval[0]?.ArrestID[0]?.ArrestID : "",
                    // DropDown
                    'NameTypeID': editval[0]?.NameTypeID, 'BusinessTypeID': editval[0]?.BusinessTypeID, 'SuffixID': editval[0]?.SuffixID, 'VerifyID': editval[0]?.DLVerifyID,
                    'SexID': editval[0]?.SexID, 'RaceID': editval[0]?.RaceID, 'PhoneTypeID': editval[0]?.PhoneTypeID, 'EthnicityID': editval[0]?.EthnicityID, 'AgeUnitID': editval[0]?.AgeUnitID,
                    'NameReasonCodeID': editval[0]?.ReasonCode ? changeArray(editval[0]?.ReasonCode, 'NameReasonCodeID') : '', 'CertifiedByID': editval[0]?.CertifiedByID,
                    'Role': editval[0]?.Role,
                    // checkbox
                    'IsJuvenile': editval[0]?.IsJuvenile,
                    'IsVerify': editval[0]?.IsVerify,
                    'IsUnListedPhNo': editval[0]?.IsUnListedPhNo,
                    //textbox
                    'OwnerFaxNumber': editval[0]?.OwnerFaxNumber, 'OwnerPhoneNumber': editval[0]?.OwnerPhoneNumber, 'OwnerNameID': editval[0]?.OwnerNameID,
                    'LastName': editval[0]?.LastName ? editval[0]?.LastName?.trim() : editval[0]?.LastName, 'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName,
                    'SSN': editval[0]?.SSN, 'WeightFrom': editval[0]?.WeightFrom, 'WeightTo': editval[0]?.WeightTo,
                    'HeightFrom': editval[0]?.HeightFrom, 'HeightTo': editval[0]?.HeightTo, 'Address': editval[0]?.Address,
                    'Contact': editval[0]?.Contact,

                    'AgeFrom': editval[0]?.AgeFrom === null ? null : editval[0]?.AgeFrom ?? '0',

                    'AgeTo': editval[0]?.AgeTo ? editval[0]?.AgeTo : '',

                    'DateOfBirth': editval[0]?.DateOfBirth ? getShowingWithOutTime(editval[0]?.DateOfBirth) : '',
                    'CertifiedDtTm': editval[0]?.CertifiedDtTm ? getShowingDateText(editval[0]?.CertifiedDtTm) : null,
                    'Years': editval[0]?.Years,
                    'NameLocationID': editval[0]?.NameLocationID,
                    'ModifiedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
                    'DLNumber': editval[0]?.DLNumber,
                    'DLStateID': editval[0]?.DLStateID,
                    'VictimCode': editval[0]?.VictimCode,
                    'ResidentID': editval[0]?.ResidentID,
                    // victim
                    'IsInjury': editval[0]?.IsInjury,
                    'VictimTypeID': editval[0]?.VictimTypeID,

                    'CallTypeID': editval[0]?.CallTypeID,
                    'AssignmentTypeID': editval[0]?.AssignmentTypeID,
                    'ORI': editval[0]?.ORI,
                })

                if (editval[0]?.Role?.includes(1)) {
                    setroleStatus(true);
                } else {
                    setroleStatus(false);
                }

                get_Data_InjuryType_Drp(victimID)
                get_Assults_Data(victimID)
                get_InjuryType_Data(victimID);
                get_JustifiableHomicide_Data(victimID)
                get_Assults_Drp(victimID)
                setarrestCount(editval[0]?.ArrestCount);

                setPossessionID(editval[0]?.OwnerNameID)
                setnibrsSubmittedVictim(editval[0]?.IsNIBRSSummited);
                // ---------------------Name_Non_Verify_Add--------------
                GetReasonIdDrp(loginAgencyID, editval[0]?.NameTypeID, JSON.parse(editval[0]?.Role));

                setPhoneTypeCode(Get_PhoneType_Code(editval, phoneTypeIdDrp));
                setDobDate(editval[0]?.DateOfBirth ? new Date(editval[0]?.DateOfBirth) : '');
                setIsAdult(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Adult Arrest" || item.ReasonCode_Description === "Juvenile Arrest" }));

                setIsOffender(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Offender" }));
                setvictimTypeStatus(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Victim" || item.ReasonCode_Description === "Business Is A Victim" || item.ReasonCode_Description === "Domestic Victim" || item.ReasonCode_Description === "Individual Is A Victim" || item.ReasonCode_Description === "Individual Victim" || item.ReasonCode_Description === "Other Is A Victim" || item.ReasonCode_Description === "Restraint Victim" || item.ReasonCode_Description === "Society Is A Victim" }))


                //--------------get_Non_Verify_Add-------------------
                if (!editval[0]?.IsVerify && editval[0]?.NameLocationID) {
                    get_Add_Single_Data(editval[0]?.NameLocationID);
                }


                setNameTypeCode(editval[0]?.NameTypeCode);

                if (editval[0]?.Years) {
                    const Years = editval[0]?.Years.split(' ');
                    setYearsVal(Years[1])
                }

                setMultiSelected({
                    optionSelected: editval[0]?.ReasonCode ? fourColArrayReasonCode(editval[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
                    ) : '',
                });

                setMultiSelectedReason({

                    optionSelected: editval[0]?.Role ? makeRoleArr(editval[0]?.Role) : [],
                });

            }
        } else {
            if (!changesStatus) {
                setAuditCount(false);
                setValue({
                    ...value,
                    'MasterNameID': '',
                    'NameID': '',
                    'NameIDNumber': 'Auto Generated',
                    // DropDown
                    'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'EthnicityID': '',
                    'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'AgeUnitID': '',
                    'Role': '',
                    // checkbox

                    'IsVerify': true, 'IsUnListedPhNo': '',
                    //textbox
                    'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
                    'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '',
                    'HeightTo': '', 'Address': '', 'Contact': '',
                    //r
                    'DateOfBirth': '', 'CertifiedDtTm': null,
                    'AgeFrom': '', 'AgeTo': '', 'Years': '', 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0,
                    'DLNumber': '',
                    'DLStateID': '',
                    'ResidentID': '',

                    'CallTypeID': '',
                    'AssignmentTypeID': '',
                    'ORI': '',
                }); setPhoneTypeCode('')
            }
            const id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
                setNameTypeCode(id[0].NameTypeCode);

            }
            setMultiSelected({ optionSelected: [], });
            setMultiSelectedReason({
                optionSelected: [],
            });
        }
    }, [editval])

    const makeRoleArr = (ids) => {
        const arr = ReasonCodeRoleArr.filter(item => ids?.includes(item.value));
        return ReasonCodeRoleArr.filter(item => ids?.includes(item.value));
    }

    const LastFirstNameOnBlur = (e) => {
        if (!called) {
            if (e.target.name === 'LastName') {
                if (value?.LastName && value?.FirstName) {
                    getNameSearchPopup(loginAgencyID, value?.NameTypeID, value?.LastName, value?.FirstName, null, null)
                }
            } else if (e.target.name === 'FirstName') {
                if (value?.LastName && value?.FirstName) {
                    getNameSearchPopup(loginAgencyID, value?.NameTypeID, value?.LastName, value?.FirstName, null, null)
                }
            }
        }
    }

    const getNameSearchPopup = async (loginAgencyID, NameTypeID, LastName, FirstName, MiddleName, DateOfBirth, SSN, type) => {
        if (LastName && DateOfBirth || FirstName || MiddleName || SSN) {
            fetchPostData("MasterName/Search_Name", {
                "NameTypeID": NameTypeID, "LastName": LastName, "FirstName": FirstName ? FirstName : null, "MiddleName": MiddleName ? MiddleName : null, "DateOfBirth": DateOfBirth ? DateOfBirth : null, "SSN": SSN ? SSN : null, 'AgencyID': loginAgencyID ? loginAgencyID : null, 'MasterNameID': masterNameID,
            }).then((data) => {
                if (data.length > 0) {
                    setNameSearchStatus(true);

                } else {
                    if (type) toastifyError('No Name Available');
                    setNameSearchStatus(false);

                }
            })
        } else {
            setNameSearchStatus(false);
            toastifyError('Empty Feild');

        }
    }

    const set_Edit_Value = (row) => {
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
            modal.show();
        }
        else {
            if (row.NameID || row.MasterNameID) {
                //Validate All Names
                getNibrsErrorToolTip(row?.NameID, mainIncidentID, IncNo);
                get_Offense_DropDown(mainIncidentID, row.NameID);
                setStatesChangeStatus(false)
                GetSingleData(row.NameID, row.MasterNameID);
                navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
                get_Name_Count(row.NameID, row.MasterNameID, MstPage === "MST-Name-Dash" ? true : false);
                setNameID(row.NameID)
                setMasterNameID(row?.MasterNameID);

                setUpdateStatus(updateStatus + 1);
                setuploadImgFiles('')

                get_Assults_Drp(victimID)
                setErrors({
                    ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
                })
            }

        }
    }

    const setStatusFalse = () => {
        if (MstPage === "MST-Name-Dash") {
            navigate(`/nibrs-Home?page=MST-Name-Dash&IncId=${0}&IncNo=${0}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
        }
        else {
            navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
            setMasterNameID('');
            setNameID('');
            setClickedRow(null); Reset();
            setUpdateStatus(updateStatus + 1);
            get_Name_Count('');
            setIsAdult(false);
            setIsOffender(false); setIsSocietyName(false)
            setPossessionID(''); setPossenSinglData([]);
        }
    }

    // const columns = [
    //     {
    //         name: 'MNI',
    //         selector: (row) => row.NameIDNumber,
    //         sortable: true
    //     },
    //     {
    //         name: 'Name',
    //         selector: (row) => row.FullName,
    //         sortable: true
    //     },
    //     {
    //         name: 'Race',
    //         selector: (row) => row.Description_Race,
    //         sortable: true
    //     },
    //     {
    //         width: '100px',
    //         name: 'View',

    //         cell: row =>
    //             <div style={{ position: 'absolute', top: 4, right: 30 }}>
    //                 {
    //                     getNibrsError(row.NameID, nibrsValidateNameData) ?
    //                         <span
    //                             onClick={(e) => { setErrString(row.NameID, nibrsValidateNameData) }}
    //                             className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
    //                             data-toggle="modal"
    //                             data-target="#NibrsErrorShowModal"
    //                         >
    //                             <i className="fa fa-eye"></i>
    //                         </span>
    //                         :
    //                         <></>
    //                 }
    //             </div>
    //     },
    // ]
    const columns = [
        {
            name: 'MNI', selector: (row) => row.NameIDNumber, sortable: true
        },
        {
            name: 'Name', selector: (row) => row.FullName, sortable: true
        },
        {
            name: 'Gender', selector: (row) => row.Gender, sortable: true
        },
        {
            name: 'DOB', selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ", sortable: true
        },

        {
            name: 'SSN', selector: (row) => row.SSN, sortable: true
        },
        {
            name: 'Race', selector: (row) => row.Description_Race, sortable: true
        },
        {
            name: 'Ethnicity', selector: (row) => row.EthnicityDes, sortable: true
        },
        {
            name: 'Alias Indicator', selector: (row) => row.SSN, sortable: true
        },
        {
            width: '100px',
            name: 'View',

            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 30 }}>
                    {
                        getNibrsError(row.NameID, nibrsValidateNameData) ?
                            <span
                                onClick={(e) => { setErrString(row.NameID, nibrsValidateNameData) }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                data-toggle="modal"
                                data-target="#NibrsErrorShowModal"
                            >
                                <i className="fa fa-eye"></i>
                            </span>
                            :
                            <></>
                    }
                </div>
        },
        {
            name: 'Reason Code', selector: (row) => row?.NameReasonCode || '',
            format: (row) => (<>{row?.NameReasonCode ? row?.NameReasonCode.substring(0, 50) : ''}{row?.NameReasonCode?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
    ]

    const getNibrsError = (Id, nibrsValidateNameData) => {
        const arr = nibrsValidateNameData?.filter((item) => item?.NameEventID == Id);
        return arr?.[0]?.OnPageError;
    }

    const setErrString = (ID, nibrsValidateNameData) => {
        const arr = nibrsValidateNameData?.filter((item) => item?.NameEventID == ID);

        setNibrsErrStr(arr[0]?.OnPageError);
        setNibrsErrModalStatus(true);
    }

    const getStatusColors = (ID, nibrsValidateNameData) => {
        return getNibrsError(ID, nibrsValidateNameData) ? { backgroundColor: "rgb(255 202 194)" } : {};
    };

    const GetReasonIdDrp = (loginAgencyID, id, RoleIdsArray) => {
        const val = { AgencyID: loginAgencyID, CategoryID: id, Role: RoleIdsArray }
        fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val).then((data) => {
            if (data) {
                const hasVictimNameTrue = data.some(item => item.IsVictimName === true);
                setReasonIdDrp(Comman_changeArrayFormat(data, 'NameReasonCodeID', 'Description'))
                if (openPageName === 'Victim') {
                    const id = data?.filter((val) => { if (val?.ReasonCode === "VIC") return val });
                    if (id?.length > 0) {
                        setMultiSelected({
                            optionSelected: id ? fourColArrayReasonCode(id, 'NameReasonCodeID', 'Description', 'IsVictimName', 'IsOffenderName') : '',
                        });
                        let finalValueList = id?.map((item) => item?.NameReasonCodeID);
                        setValue({ ...value, ['NameReasonCodeID']: finalValueList })
                    }
                } else if (openPageName === 'Offender') {
                    const id = data?.filter((val) => { if (val?.ReasonCode === "OFF") return val });
                    if (id?.length > 0) {
                        setMultiSelected({
                            optionSelected: id ? fourColArrayReasonCode(id, 'NameReasonCodeID', 'Description', 'IsVictimName', 'IsOffenderName') : '',
                        });
                        let finalValueList = id?.map((item) => item?.NameReasonCodeID);
                        setValue({ ...value, ['NameReasonCodeID']: finalValueList })
                    }
                }
            } else {
                setReasonIdDrp([]);
            }
        })
    }

    const GetBusinessTypeDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('NameBusinessType/GetDataDropDown_NameBusinessType', val).then((data) => {
            if (data) {
                setBusinessTypeDrp(Comman_changeArrayFormat(data, 'NameBusinessTypeID', 'Description'))
            } else {
                setBusinessTypeDrp([]);
            }
        })
    };

    const ChangeNameType = (e, name) => {
        setStatesChangeStatus(true);
        setroleStatus(false)
        if (e) {
            if (name === 'NameTypeID') {
                get_Victim_Type_Data(loginAgencyID, nameTypeCode);
                setValue({
                    ...value,
                    [name]: e.value,
                    'NameIDNumber': 'Auto Generated', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'Role': '', 'NameReasonCodeID': [], 'CertifiedByID': '', 'AgeUnitID': '',
                    'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'DLStateID': '',
                    'IsJuvenile': e.id === 'B' ? null : value.IsJuvenile
                });
                setErrors({
                    ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
                })
                setMultiSelected({ optionSelected: [] });
                setMultiSelectedReason({
                    optionSelected: []
                });
                setPhoneTypeCode(''); setNameTypeCode(e.id); setChangesStatus(true);
                if (e.id === 'B') { GetBusinessTypeDrp(loginAgencyID); get_Arrestee_Drp_Data(mainIncidentID); } else { ; }


            } else {
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: e.value,
                    'IsJuvenile': e.id === 'B' ? null : value.IsJuvenile
                })

            }
        } else {
            setChangesStatus(true)
            setValue({
                ...value,
                [name]: null
            }); setNameTypeCode(''); setPhoneTypeCode('')
        }
    }

    const ChangePhoneType = (e, name) => {
        setStatesChangeStatus(true);
        if (e) {
            if (name === 'PhoneTypeID') {
                setPhoneTypeCode(e.id)
                setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: e.value, ['Contact']: "", ['IsUnListedPhNo']: false
                })
            }
            setChangesStatus(true)
        } else if (e === null) {
            if (name === 'PhoneTypeID') {
                setChangesStatus(true);
                setValue({ ...value, ['PhoneTypeID']: "", ['Contact']: "", ['IsUnListedPhNo']: false });

                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '' });
                setPhoneTypeCode('')
            }
        } else {
            setChangesStatus(true)
            setValue({
                ...value,
                [name]: null,
                ['IsUnListedPhNo']: false
            });

            setPhoneTypeCode('')
        }
    }

    const ChangeDropDown = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            if (name === 'DLStateID') {
                setValue({ ...value, [name]: e.value, ['DLNumber']: '', ['VerifyID']: '' });
            } else if (name === 'OwnerNameID') {
                setValue({ ...value, [name]: e.value })
                setPossessionID(e.value);
                setPossenSinglData([]);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === 'DLStateID') {
                setValue({ ...value, [name]: null, ['DLNumber']: '', ['VerifyID']: '' });
            } else {
                setValue({ ...value, [name]: null, });
                setErrors({ ...errors, ['DLError']: '', });
                setPossessionID(''); setPossenSinglData([]);
            }
        }
    };

    const ChangeDropDownRole = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {

            setVictimCode(e.id)
            setValue({ ...value, [name]: e.value, CallTypeID: '', AssignmentTypeID: '', ORI: '' });

        } else {
            setVictimCode('')
            setValue({ ...value, [name]: null, CallTypeID: '', AssignmentTypeID: '', ORI: '' });

        }
    }

    const handleChangeVictim = (event) => {
        const { name, value } = event.target;
        setStatesChangeStatus(true);
        if (event) {
            let ele = value.split('-').join('').replace(/[^a-zA-Z0-9\s\W]/g, "").toUpperCase();
            setValue((prevState) => ({ ...prevState, [name]: ele, }));
        }
        else {
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };

    const HandleChange = (e) => {
        setStatesChangeStatus(true);
        if (e.target.name === 'IsVerify' || e.target.name === 'IsUnListedPhNo' || e.target.name === 'IsUnknown') {
            if (e.target.name === 'IsVerify') {
                if (e.target.checked && addVerifySingleData.length > 0) {

                    setAddVerifySingleData([]);
                    setValue(pre => { return { ...pre, ['Address']: '', [e.target.name]: e.target.checked, } });

                } else {
                    setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });


                }
            } else {
                setChangesStatus(true)
                setValue({ ...value, [e.target.name]: e.target.checked });
            }
            if (e.target.name === 'IsUnknown') {
                if (e.target.checked === true) {
                    setValue(pre => {
                        return {
                            ...pre, ['FirstName']: '', ['MiddleName']: '', ['SSN']: '', ['DateOfBirth']: '', ['DLNumber']: '', ['DLStateID']: '',
                            ['AgeFrom']: '', ['AgeTo']: '', [e.target.name]: e.target.checked, ['LastName']: 'Unknown', ['VerifyID']: '', ['SexID']: 3, ['RaceID']: 6, ['EthnicityID']: 3,
                        }
                    });
                    setErrors({ ...errors, ['DLError']: '', });
                    setDobDate('');
                } else {
                    setValue(pre => { return { ...pre, ['LastName']: '', [e.target.name]: e.target.checked, ['SexID']: '', ['RaceID']: '', ['EthnicityID']: '', } });
                }
            }

        }
        else if (e.target.name === 'Contact') {
            if (phoneTypeCode === 'E') {
                setChangesStatus(true)
                setValue({ ...value, [e.target.name]: e.target.value });
            } else {
                let ele = e.target.value.replace(/\D/g, '');
                if (ele.length === 10) {
                    setValue(pre => { return { ...pre, ['IsUnListedPhNo']: 'true', } });
                    const cleaned = ('' + ele).replace(/\D/g, '');
                    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                    if (match) {
                        setChangesStatus(true)
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                        })
                    }
                } else {
                    ele = e.target.value.split('-').join('').replace(/\D/g, '');
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele,
                        ['IsUnListedPhNo']: ele === '' ? false : value['IsUnListedPhNo'],
                    })
                }
            }
        }
        else if (e.target.name === 'DLNumber') {
            const normalizedValue = e.target.value.trim();
            setChangesStatus(true);
            setValue({
                ...value,
                [e.target.name]: normalizedValue,
            });

        }
        else if (e.target.name === 'OwnerPhoneNumber') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length <= 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setChangesStatus(true);
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                    });
                } else {
                    setChangesStatus(true);
                    setValue({
                        ...value,
                        [e.target.name]: ele,
                    });
                }
            }
        }
        else if (e.target.name === 'OwnerFaxNumber') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length <= 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setChangesStatus(true);
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                    });
                } else {
                    setChangesStatus(true);
                    setValue({
                        ...value,
                        [e.target.name]: ele,
                    });
                }
            }
        }
        else if (e.target.name === 'SSN') {
            let ele = e.target.value.replace(/[^0-9\s]/g, "")
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    });
                    getNameSearchPopup(loginAgencyID, value?.NameTypeID, null, null, null, null, match[1] + '-' + match[2] + '-' + match[3])
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        }
        else if (e.target.name === 'WeightTo' || e.target.name === 'WeightFrom') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true)
            if (e.target.name === 'WeightFrom') {
                if (checkNumber === '' || checkNumber === '0') {
                    setValue({ ...value, WeightFrom: checkNumber, WeightTo: '' });
                } else {
                    setValue({ ...value, [e.target.name]: checkNumber });
                }
            } else {
                setValue({ ...value, [e.target.name]: checkNumber });
            }

        } else if (e.target.name === 'HeightFrom') {
            let ele = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({
                ...value,
                [e.target.name]: ele, HeightTo: ''
            })

        } else if (e.target.name === 'HeightTo') {
            let ele = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({
                ...value,
                [e.target.name]: ele,
            })

        }
        else if (e.target.name === 'AgeFrom') {
            const checkNumber = e.target.value.replace(/[^0-9]/g, "");
            setChangesStatus(true);
            setDobDate('');

            setValue({ ...value, AgeFrom: checkNumber, AgeTo: '', AgeUnitID: '', ['Years']: 0, ['DateOfBirth']: null });
        }
        else if (e.target.name === 'AgeTo') {
            const checkNumber = e.target.value.replace(/[^0-9]/g, "");
            setChangesStatus(true);
            setDobDate('');

            setValue({ ...value, [e.target.name]: checkNumber, ['Years']: 0, ['DateOfBirth']: null });
        }
        else setValue({ ...value, [e.target.name]: e.target.value })
    };

    const InsertName = () => {
        if (roleStatus && !victimTypeStatus) {
            toastifyError('Please Add Reason Code Related To Victim');
            setErrors({
                ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true', "CrimeLocationError": '', 'AgeFromError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
            })

        } else {
            const AgencyID = loginAgencyID;
            const IncidentID = mainIncidentID;
            const CreatedByUserFK = loginPinID;

            const { NameTypeID, BusinessTypeID, IsMaster, NameIDNumber, IsUnListedPhNo, IsVerify, IsCurrentPh, SuffixID, VerifyID, SexID, RaceID, PhoneTypeID, NameReasonCodeID, CertifiedByID, EthnicityID, AgeUnitID, IsJuvenile, LastName, FirstName, MiddleName, SSN, WeightFrom, WeightTo, HeightFrom, HeightTo, Address, Contact, OwnerNameID, OwnerPhoneNumber, OwnerFaxNumber, DateOfBirth, CertifiedDtTm, AgeFrom, AgeTo, Years, ModifiedByUserFK, MasterNameID, NameID, ArrestID, WarrantID, TicketID, checkVictem, EventType,
                checkOffender, checkArrest, NameLocationID, DLNumber, DLStateID, IsUnknown, Role, ResidentID, IsInjury, VictimTypeID, ORI, AssignmentTypeID, CallTypeID
            } = value;

            const trimmedFirstName = FirstName?.trim();
            const trimmedMiddleName = MiddleName?.trim();

            const val = {
                'AgencyID': AgencyID,
                'NameIDNumber': IsJuvenile === editval[0]?.IsJuvenile ? NameIDNumber : 'Auto Generated',

                'NameTypeID': NameTypeID, 'EventType': EventType, 'IsMaster': IsMaster, 'IsUnListedPhNo': IsUnListedPhNo, 'IsVerify': IsVerify, 'PhoneTypeID': PhoneTypeID, 'OwnerFaxNumber': OwnerFaxNumber, 'IsCurrentPh': IsCurrentPh, 'BusinessTypeID': BusinessTypeID, 'SuffixID': SuffixID, 'DLVerifyID': VerifyID, 'SexID': SexID, 'RaceID': RaceID, 'PhoneTypeID': PhoneTypeID, 'NameReasonCodeID': NameReasonCodeID, 'CertifiedByID': CertifiedByID, 'EthnicityID': EthnicityID, 'AgeUnitID': AgeUnitID, 'IsJuvenile': IsJuvenile, 'LastName': LastName ? LastName : null, 'FirstName': trimmedFirstName ? trimmedFirstName : null, 'MiddleName': trimmedMiddleName ? trimmedMiddleName : null, 'SSN': SSN, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'Address': Address, 'Contact': Contact, 'OwnerNameID': OwnerNameID, 'OwnerPhoneNumber': OwnerPhoneNumber,
                'OwnerFaxNumber': OwnerFaxNumber, 'DateOfBirth': DateOfBirth, 'CertifiedDtTm': CertifiedDtTm, 'AgeFrom': AgeFrom, 'AgeTo': AgeTo, 'Years': Years, 'ModifiedByUserFK': ModifiedByUserFK, 'MasterNameID': MasterNameID, 'NameID': NameID, 'ArrestID': ArrestID, 'WarrantID': WarrantID, 'TicketID': TicketID, 'checkVictem': checkVictem, 'checkOffender': checkOffender, 'checkArrest': checkArrest, 'CreatedByUserFK': CreatedByUserFK, 'IncidentID': IncidentID, 'NameLocationID': NameLocationID, 'DLNumber': DLNumber, 'DLStateID': DLStateID, 'IsUnknown': IsUnknown, 'Role': Role, 'ResidentID': ResidentID, 'IsInjury': IsInjury, 'VictimTypeID': VictimTypeID,

                'AssaultID': assaultID?.map((item) => item?.value),
                'VictimInjuryID': victimInjuryID?.map((item) => item?.value),
                'JustifiableHomicideID': justifiyID?.map((item) => item?.value),

                'AssignmentTypeID': AssignmentTypeID,
                'CallTypeID': CallTypeID,
                'ORI': ORI,



            };

            const fetchParams = MstPage === "MST-Name-Dash" ?
                { "MasterNameID": masterNameID, "SSN": SSN, 'NameID': NameID, 'AgencyID': AgencyID } :
                { "SSN": SSN, "IncidentID": mainIncidentID, "MasterNameID": masterNameID, 'NameID': NameID, 'AgencyID': AgencyID };

            fetchPostData("MasterName/GetData_EventNameExists", fetchParams).then((data) => {
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
                if (data) {

                    if (data[0]?.Total === 0) {
                        setsaveValue(true);
                        AddDeleteUpadate('NIBRSData/Insert_NameNIBRSData', val).then((res) => {
                            if (res.success) {
                                if (MstPage === "MST-Name-Dash") {
                                    navigate(`/nibrs-Home?page=MST-Name-Dash&NameID=${stringToBase64(res?.NameID)}&MasterNameID=${stringToBase64(res?.MasterNameID)}&ModNo=${res?.NameNumber}&NameStatus=${true}`);
                                }
                                else {
                                    navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(res?.NameID)}&MasterNameID=${stringToBase64(res?.MasterNameID)}&NameStatus=${true}`)
                                }
                                toastifySuccess(res.Message);
                                setsaveValue(false);
                                setValue({
                                    ...value,
                                    'NameIDNumber': 'Auto Generated',
                                    // DropDown
                                    'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
                                    'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '',
                                    'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
                                    'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '',
                                    'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '',
                                    'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '',
                                    'MasterNameID': '', 'NameID': '', 'EthnicityID': '',
                                    'DLNumber': "",
                                    'DLStateID': '',
                                    'IsUnknown': '', 'IsJuvenile': '',
                                })
                                get_NameTypeData(loginAgencyID);
                                get_Data_Name(mainIncidentID, MstPage === "MST-Name-Dash" ? true : false);
                                Reset()
                                setChangesStatus(false);
                                setUpdateStatus(updateStatus + 1);
                                setIsAdult(false);
                                setIsOffender(false);
                                setStatesChangeStatus(false);
                                get_Incident_Count(mainIncidentID, loginPinID);

                                GetVictimSingleData(res?.NameID);
                                if (uploadImgFiles?.length > 0) {

                                    setuploadImgFiles('')
                                }
                                setErrors({ ...errors, ['AddressError']: 'true', ['WeightError']: 'true', ['AgeError']: 'true', ['ContactError']: 'true', ['NameTypeIDError']: '', });

                                // Validate Name
                                ValidateProperty(mainIncidentID);
                                ValidateIncNames(mainIncidentID, IncNo);
                                getNibrsErrorToolTip(res?.NameID, mainIncidentID, IncNo);
                                // validateIncSideBar
                                validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
                            } else {
                                toastifyError(res.Message); setErrors({ ...errors, ['NameTypeIDError']: '', ['ContactError']: '', });
                                setChangesStatus(false)
                            }
                        })
                    } else {
                        toastifyError('SSN Already exist ');
                    }
                }
            })
        }

    }

    const Update_Name = (showToast = true) => {
        if (roleStatus && !victimTypeStatus) {
            toastifyError('Please Add Reason Code Related To Victim');
            setErrors({
                ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true', "CrimeLocationError": '', 'AgeFromError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
            })

        } else {
            const AgencyID = loginAgencyID;
            const IncidentID = mainIncidentID;
            const CreatedByUserFK = loginPinID;
            const { NameTypeID, BusinessTypeID, SuffixID, IsUnListedPhNo, IsMaster, IsVerify, IsCurrentPh, VerifyID, NameIDNumber, SexID, RaceID, PhoneTypeID, NameReasonCodeID, CertifiedByID, EthnicityID, AgeUnitID, IsJuvenile, LastName, FirstName, MiddleName, SSN, WeightFrom, WeightTo, HeightFrom, HeightTo, Address, Contact, OwnerNameID, OwnerPhoneNumber, OwnerFaxNumber, DateOfBirth, CertifiedDtTm, AgeFrom, AgeTo, Years, ModifiedByUserFK, MasterNameID, NameID, ArrestID, WarrantID, TicketID, checkVictem, EventType,
                checkOffender, checkArrest, NameLocationID, DLNumber, DLStateID, IsUnknown, Role, ResidentID, IsInjury, VictimTypeID, ORI, AssignmentTypeID, CallTypeID
            } = value;

            const trimmedFirstName = FirstName?.trim();
            const trimmedMiddleName = MiddleName?.trim();

            let formattedRole = [];
            if (typeof Role === 'string' && Role.startsWith('[') && Role.endsWith(']')) {
                try {
                    formattedRole = JSON.parse(Role);
                } catch (error) {
                    console.error('Error parsing Role:', error);
                }
            } else if (typeof Role === 'number') {
                formattedRole = [Role];
            } else {
                formattedRole = Role;
            }
            const val = {
                'AgencyID': AgencyID,
                'NameIDNumber': IsJuvenile === editval[0]?.IsJuvenile ? NameIDNumber : 'Auto Generated',

                'NameTypeID': NameTypeID, 'EventType': EventType, 'IsMaster': IsMaster, 'IsVerify': IsVerify, 'IsUnListedPhNo': IsUnListedPhNo, 'PhoneTypeID': PhoneTypeID, 'OwnerFaxNumber': OwnerFaxNumber, 'IsCurrentPh': IsCurrentPh, 'BusinessTypeID': BusinessTypeID, 'SuffixID': SuffixID, 'DLVerifyID': VerifyID, 'SexID': SexID, 'RaceID': RaceID, 'PhoneTypeID': PhoneTypeID, 'NameReasonCodeID': NameReasonCodeID, 'CertifiedByID': CertifiedByID, 'EthnicityID': EthnicityID, 'AgeUnitID': AgeUnitID, 'IsJuvenile': IsJuvenile, 'LastName': LastName ? LastName : null, 'FirstName': trimmedFirstName ? trimmedFirstName : null, 'MiddleName': trimmedMiddleName ? trimmedMiddleName : null, 'SSN': SSN, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'Address': Address, 'Contact': Contact, 'OwnerNameID': OwnerNameID, 'OwnerPhoneNumber': OwnerPhoneNumber,
                'OwnerFaxNumber': OwnerFaxNumber, 'DateOfBirth': DateOfBirth, 'CertifiedDtTm': CertifiedDtTm, 'AgeFrom': AgeFrom, 'AgeTo': AgeTo, 'Years': Years, 'ModifiedByUserFK': ModifiedByUserFK, 'MasterNameID': MasterNameID, 'NameID': NameID, 'ArrestID': ArrestID, 'WarrantID': WarrantID, 'TicketID': TicketID, 'checkVictem': checkVictem, 'checkOffender': checkOffender, 'checkArrest': checkArrest, 'CreatedByUserFK': CreatedByUserFK, 'IncidentID': IncidentID, 'NameLocationID': NameLocationID, 'DLNumber': DLNumber, 'DLStateID': DLStateID, 'IsUnknown': IsUnknown, 'Role': formattedRole, 'ResidentID': ResidentID, 'IsInjury': IsInjury, 'VictimTypeID': VictimTypeID,

                'AssaultID': assaultID?.map((item) => item?.value),
                'VictimInjuryID': victimInjuryID?.map((item) => item?.value),
                'JustifiableHomicideID': justifiyID?.map((item) => item?.value),
                'ORI': ORI,
                'AssignmentTypeID': AssignmentTypeID,
                'CallTypeID': CallTypeID,
            };

            fetchPostData("MasterName/GetData_EventNameExists", {
                "SSN": SSN,
                "IncidentID": MstPage === "MST-Name-Dash" ? '' : mainIncidentID,
                'masterNameID': masterNameID,
                'NameID': NameID,
                'AgencyID': AgencyID

            }).then((data) => {
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
                if (data) {
                    if (data[0]?.Total === 0) {
                        AddDeleteUpadate('NIBRSData/Insert_NameNIBRSData', val).then((res) => {
                            if (res.success) {
                                if (showToast) {
                                    toastifySuccess(res.Message);
                                }
                                if (MstPage === "MST-Name-Dash") {
                                    navigate(`/Name-Home?page=MST-Name-Dash&MasterNameID=${stringToBase64(MasterNameID)}&ModNo=${ModNo}&NameStatus=${true}`);
                                }
                                setChangesStatus(false);
                                setValue({
                                    ...value,
                                    'NameIDNumber': 'Auto Generated',
                                    // DropDown
                                    'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
                                    'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '',
                                    'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
                                    'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '',
                                    'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '',
                                    'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '',
                                    'EthnicityID': '',
                                    'DLNumber': "",
                                    'DLStateID': '',
                                    'IsUnknown': '', 'IsJuvenile': '',
                                })
                                GetSingleData(nameID, masterNameID);
                                // get Victim Single Data
                                GetVictimSingleData(nameID);

                                get_Name_Count(nameID, masterNameID, MstPage === "MST-Name-Dash" ? true : false);
                                get_Data_Name(mainIncidentID, MstPage === "MST-Name-Dash" ? true : false);
                                get_Offense_DropDown(incidentID, nameID);
                                setStatesChangeStatus(true);
                                if (uploadImgFiles?.length > 0) {
                                    setuploadImgFiles('')
                                }

                                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });

                                // Validate Name
                                ValidateProperty(mainIncidentID);
                                ValidateIncNames(mainIncidentID, IncNo);
                                getNibrsErrorToolTip(nameID, mainIncidentID, IncNo);
                                // validateIncSideBar
                                validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
                            } else {
                                setChangesStatus(false);
                                toastifyError(res.Message);
                                setErrors({ ...errors, ['NameTypeIDError']: '', });
                            }
                        })
                    } else {
                        toastifyError('SSN Already Exists');
                        setErrors({ ...errors, ['ContactError']: '', ['NameTypeIDError']: 'true', });
                    }
                }
            });
        }
    }

    // get Single Data Victim
    const GetVictimSingleData = (NameID) => {
        const val = { 'NameID': NameID }
        try {
            fetchPostData('Victim/GetData_Victim', val).then((res) => {
                if (res.length != 0) {

                    setVictimCode(res[0]?.VictimCode);
                } else {
                    setVictimCode('');
                }
            })
        } catch (error) {
            console.error('Error fetching victim single data:', error);
        }
    }

    const Reset = () => {
        setroleStatus(false);
        setIsAdultArrest(false); setisMissing(false); setIsVictim(false); setIsDataFetched(false); setvictimTypeStatus(false);
        setIsAdult(false); setIsOffender(false);
        setcalled(false); setDobDate(''); setAvailableAlert([])
        setStatesChangeStatus(false); setOnSelectLocation(true); setChangesStatus(false);
        setErrors({
            ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true', "CrimeLocationError": '', 'AgeFromError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '', 'InjuryTypeError': '', 'AssignmentTypeIDError': '', 'CallTypeIDError': '',
        });
        // reset relation error
        setErrors1({
            ...errors1,
            'RelationshipTypeIDErrors': '', 'VictimNameIDErrors': '',
        });

        setAssaultID([]); setVictimInjuryID([]); setJustifiyID([]);
        setPhoneTypeCode('');
        setMultiSelected({ optionSelected: [] });
        setMultiSelectedReason({ optionSelected: [], });
        setoffensemultiSelected({ optionSelected: [] });
        setIsSocietyName(false);
        const Id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
        if (Id.length > 0) {
            setValue({
                ...value,
                ['NameTypeID']: Id[0]?.value,
                'NameIDNumber': 'Auto Generated',
                // DropDown
                'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
                'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '',
                'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
                'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '',
                'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '',
                'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '',
                'MasterNameID': '', 'NameID': '', 'EthnicityID': '',
                'DLNumber': "",
                'DLStateID': '',
                'IsUnknown': '', 'IsJuvenile': '', 'VictimCode': '',
                'ResidentID': '', 'IsInjury': '', 'VictimTypeID': '', 'CallTypeID': '', 'AssignmentTypeID': '', 'ORI': '',
            })
            setUpdateStatus(updateStatus + 1);
            setNameTypeCode(Id[0].id); setcountAppear(false); setcountStatus(false);
        }
        setuploadImgFiles(''); setnibrsFieldError([]); setShowInjuryTypeError(false); setShowVictimAgeError(false);
        setisInjurryRequired(false); setnibrsCodeArray([]);
        setHas120RoberyOffense(false);
        setIsCrimeAgainstPerson(false);

        setnibrsFieldError([]);
    }

    const ResetSearch = () => {
        setDobDate(''); setAvailableAlert([])
        setErrors({
            ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
        })
        setPhoneTypeCode(''); setMultiSelected({ optionSelected: [] });
        setMultiSelectedReason({
            optionSelected: [],
        });
        const Id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
        if (Id.length > 0) {
            setValue({
                ...value,

                'NameIDNumber': 'Auto Generated',
                // DropDown
                'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
                'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '',
                'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
                'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '',
                'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '',
                'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '',
                'MasterNameID': '', 'NameID': '', 'EthnicityID': '',
                'DLNumber': "",
                'DLStateID': '',
                'IsUnknown': '', 'IsJuvenile': '',
            })


            setUpdateStatus(updateStatus + 1);

        }
        setuploadImgFiles('')
    }

    const OnChangeSelectedReason = (data, name) => {
        setStatesChangeStatus(true);
        let VictimStatusData = data.some(function (item) { return item.label === "Victim" || item.label === "Business Is A Victim" || item.label === "Domestic Victim" || item.label === "Individual Is A Victim" || item.label === "Individual Victim" || item.label === "Other Is A Victim" || item.label === "Restraint Victim" || item.label === "Restraint Victim" });
        if (VictimStatusData) {
            setvictimTypeStatus(true);
        } else if (!nameID) {
            setvictimTypeStatus(false);
        }
        let VictimStatus = data.some(function (item) { return item.label === "Victim" });
        let adult = data.some(function (item) { return item.label === "Adult Arrest" || item.label === "Offender" || item.label === "Juvenile Arrest" });
        if (!adult) { setErrors({ ...errors, ['DateOfBirthError']: 'true', ['RaceIDError']: 'true', ['SexIDError']: 'true', ['NameTypeIDError']: '', ['AgeFromError']: '', ['EthnicityErrorr']: '', ['ResidentError']: '' }); }
        setIsAdult(adult);
        setIsOffender(adult);
        const newArray = [...data]
        if (value.checkOffender === 1 && value.checkVictem === 1) {
            multiSelected.optionSelected?.map(val => {
                if (val.checkVictem) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
                if (val.checkOff) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setChangesStatus(true);
            setValue({
                ...value,
                [name]: finalValueList
            });
            setMultiSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        }
        else if (value.checkOffender === 1) {
            multiSelected.optionSelected?.map(val => {
                if (val.checkOff) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setChangesStatus(true);
            setValue({
                ...value,
                [name]: finalValueList
            })
            setMultiSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        }
        else if (value.checkVictem === 1) {
            multiSelected.optionSelected?.map(val => {
                if (val.checkVictem) {
                    if (data.length > 0) {
                        return data?.filter(item => {
                            if (item.value === val.value) return newArray.push(val)
                            else newArray.push(val)
                        })
                    } else return newArray.push(val)
                }
            })
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setChangesStatus(true);
            setValue({
                ...value,
                [name]: finalValueList
            })
            setMultiSelected({
                optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index)
            });
        } else {
            let finalValueList = newArray?.map((item) => item.value);
            setChangesStatus(true);
            setValue({
                ...value,
                [name]: finalValueList
            })
            setMultiSelected({
                optionSelected: newArray
            });
        }
    };

    const handleDOBChange = (date, e) => {
        setStatesChangeStatus(true)
        if (date) {
            setValue(pre => { return { ...pre, ['AgeFrom']: '', ['AgeTo']: '' } })
            setDobDate(date);
            const res = getShowingWithOutTime(date).split("/")
            let ageObj = calculateAge(date);
            if (ageObj.age > 0) {

                setValue({ ...value, ['AgeFrom']: ageObj?.age, ['AgeTo']: '', ['Years']: ageObj.age, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 5 })
            }
            else {
                if (ageObj.days > 0) {

                    setValue({ ...value, ['AgeFrom']: ageObj?.days, ['AgeTo']: '', ['Years']: ageObj.days, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 1, ['IsJuvenile']: true })
                } else {

                    const diffInMs = maxAllowedDate - date;
                    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
                    setValue({ ...value, ['AgeFrom']: 0, ['AgeTo']: '', ['Years']: 0, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 1, ['IsJuvenile']: true })
                    // setValue({ ...value, ['AgeFrom']: diffInHours, ['AgeTo']: '', ['Years']: diffInHours, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 2, ['IsJuvenile']: true })
                }

            }
        } else if (date === null) {
            setDobDate(''); setValue({ ...value, ['AgeFrom']: '', ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, ['IsJuvenile']: false });
            calculateAge(null)
        } else {
            setDobDate(''); setValue({ ...value, ['AgeFrom']: null, ['AgeTo']: '', ['DateOfBirth']: null, ['AgeUnitID']: null, ['IsJuvenile']: false });
            calculateAge(null)
        }
        if (!nameID && !e?.target?.value?.length) {
            if (value?.LastName) {

            }

        } else if (e?.target?.value?.length) {
            if (e?.target?.value?.length === 10) {
                if (value?.LastName) {

                }

            }
        }
    };

    function calculateAge(birthday) {
        const today = MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate);
        const birthDate = new Date(birthday);
        const diffInMs = today - birthDate;

        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return {
            age: age,
            days: diffInDays,
        };
    }

    useEffect(() => {
        if (yearsVal < 18 || parseInt(value.AgeFrom) < 18 || value.AgeUnitID === 1 || value.AgeUnitID === 2) {
            setJuvinile(true)
            setValue({ ...value, ['IsJuvenile']: true })
        } else {
            setJuvinile(false);
            setValue({ ...value, ['IsJuvenile']: false })
        }


    }, [value.DateOfBirth, value.AgeFrom, value.AgeUnitID]);

    const AgeFromOnBlur = () => {
        if (value.AgeFrom < 18) {
            setValue({ ...value, ['IsJuvenile']: true })
        }
    }

    // <---------------------Verify SingleData ------------------->
    const get_Add_Single_Data = (NameLocationID) => {
        fetchPostData('MasterLocation/GetSingleData_MasterLocation', { 'LocationID': NameLocationID, }).then((res) => {
            if (res.length > 0) {

                setAddVerifySingleData(res)
            } else {
                setAddVerifySingleData([])
            }
        })
    }

    // to update image data
    const update_Name_MultiImage = () => {
        const val = { "ModifiedByUserFK": loginPinID, "AgencyID": loginAgencyID, "PictureTypeID": imgData?.PictureTypeID, "ImageViewID": imgData?.ImageViewID, "ImgDtTm": imgData?.ImgDtTm, "OfficerID": imgData?.OfficerID, "Comments": imgData?.Comments, "DocumentID": imgData?.DocumentID }
        AddDeleteUpadate('PropertyVehicle/Update_PropertyVehiclePhotoDetail', val)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);

                }
                else {
                    toastifyError(res?.Message);
                }
            })
    }

    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => ({
                ...getStatusColors(row.NameID, nibrsValidateNameData),
                ...(row.NameID === nameID ? {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                    cursor: 'pointer',
                } : {})
            }),
        },
    ];

    const colourStylesMasterReason = {
        control: (styles) => ({
            ...styles,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
            minHeight: 33,
        }),
    };

    // custuom style withoutColor
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

    const customStylesWithOutColor1 = {
        control: base => ({
            ...base,
            minHeight: 55,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };


    const nibrsSuccessStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#9fd4ae",
            height: 55,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const customWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
            width: 130,
        }),
    };

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef1.current.setOpen(false);
        }
    };

    const onMasterPropClose = () => {
        get_Name_Count('');
        navigate('/dashboard-page');
        if (!changesStatus) {
        }
    }

    const handleWeightFromBlur = () => {
        const weightFrom = Number(value?.WeightFrom);
        const weightTo = Number(value?.WeightTo);
        if (weightFrom && weightTo) {
            if (weightFrom > weightTo) {
                toastifyError('WeightFrom should be less than WeightTo');
            }
        }

    };

    const handleWeightToBlur = () => {
        const weightFrom = Number(value?.WeightFrom);
        const weightTo = Number(value?.WeightTo);
        if (weightFrom && weightTo) {
            if (weightTo < weightFrom) {
                toastifyError('WeightTo should be greater than WeightFrom');
            }
        }
    };

    const blinkAnimationStyle = {
        animation: 'blink-animation 1s infinite',
        fontSize: '16px',
        color: 'red',
    };

    const onChangeReaonsRole = (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);

        const newArray = [...(e || [])];
        const finalValueList = newArray?.map(item => item?.value);

        setIsSecondDropdownDisabled(finalValueList?.length === 0);

        // Role constants
        const VICTIM_ROLE_ID = 1;
        const OFFENDER_ROLE_ID = 2;
        const OTHER_ROLE_ID = 3;

        const victimLabels = [
            "Victim", "Business Is A Victim", "Domestic Victim", "Individual Is A Victim",
            "Individual Victim", "Other Is A Victim", "Restraint Victim", "Society Is A Victim"
        ];

        const victimRemoved = !finalValueList.includes(VICTIM_ROLE_ID);
        const offenderRemoved = !finalValueList.includes(OFFENDER_ROLE_ID);
        const otherRemoved = !finalValueList.includes(OTHER_ROLE_ID);

        let updatedOptionSelected = [...multiSelected.optionSelected];

        if (victimRemoved) {
            updatedOptionSelected = updatedOptionSelected.filter(
                (opt) => !victimLabels.includes(opt.label)
            );
        }

        if (offenderRemoved) {
            updatedOptionSelected = updatedOptionSelected.filter(
                (opt) => !["Offender", "Sex Offender"].includes(opt.label)
            );
        }

        if (otherRemoved) {
            updatedOptionSelected = updatedOptionSelected.filter(
                (opt) => victimLabels.includes(opt.label) || opt.label === "Offender"
            );
        }

        // Victim Role check
        if (finalValueList.includes(VICTIM_ROLE_ID)) {
            setroleStatus(true);
            get_Victim_Type_Data(loginAgencyID, value.NameTypeID);
        } else {
            setroleStatus(false);
        }

        setMultiSelected(prev => ({ ...prev, optionSelected: updatedOptionSelected }));

        setValue(prev => ({
            ...prev,
            [name]: finalValueList,
            VictimTypeID: finalValueList.includes(VICTIM_ROLE_ID) ? value.VictimTypeID : '',
            NameReasonCodeID: updatedOptionSelected.map(item => item.value)
        }));

        if (finalValueList.length > 0) {
            GetReasonIdDrp(loginAgencyID, value.NameTypeID, finalValueList);
        } else {
            GetReasonIdDrp(loginAgencyID, value.NameTypeID, []);
            setMultiSelected({ optionSelected: [] });
            setValue(prev => ({ ...prev, NameReasonCodeID: [], VictimTypeID: '' }));
        }

        setMultiSelectedReason({ optionSelected: newArray });
    };

    const ReasonCodeRoleArr = [
        { value: 1, label: 'Victim' },
        { value: 2, label: 'Offender' },
        { value: 3, label: 'Other' }
    ]

    useEffect(() => {
        if (openPage || loginAgencyID) {
            get_General_Drp_Data(loginAgencyID);
        }
    }, [openPage, loginAgencyID]);

    const get_General_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetGeneralDropDown', val).then((data) => {
            if (data) {
                setResidentIDDrp(
                    Comman_changeArrayFormat_With_Name(data[0]?.Resident, "ResidentID", "Description", "ResidentID")
                );
            } else {
                setResidentIDDrp([]);

            }
        })
    };

    const ChangeDropDownResident = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value, });
        } else {
            setValue({ ...value, [name]: null, });
        }
    };

    const get_Victim_Type_Data = (loginAgencyID, nameTypeID) => {
        const val = { AgencyID: loginAgencyID };

        fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
            if (data) {
                const formattedData = threeColArray(data, 'VictimTypeID', 'Description', 'VictimCode');

                let filteredVictimType = [];

                if (nameTypeID === 1) {
                    filteredVictimType = formattedData?.filter(item =>
                        item.id === "I" || item.id === "L"
                    );
                } else if (nameTypeID === 2) {
                    filteredVictimType = formattedData?.filter(item =>
                        ["B", "F", "G", "R", "S", "O", "U"].includes(item.id)
                    );
                } else {
                    filteredVictimType = formattedData;
                }

                setVictimTypeDrp(filteredVictimType);
            } else {
                setVictimTypeDrp([]);
            }
        });
    };

    useEffect(() => {
        get_Data_InjuryType_Drp(victimID);
        get_Assults_Drp(victimID);
        get_Data_JustifiableHomicide_Drp(victimID)
    }, [victimID])

    const get_Data_InjuryType_Drp = (incidentID, victimID) => {
        const val = { 'IncidentID': incidentID, 'VictimID': victimID }
        fetchPostData('InjuryVictim/GetData_InsertVictimInjury', val).then((data) => {
            if (data) {
                setInjuryTypeDrp(threeColVictimInjuryArray(data, 'VictimInjuryID', 'Description', 'InjuryCode'))
            } else {
                setInjuryTypeDrp([])
            }
        })
    }

    const get_Assults_Drp = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimAssaultType/GetData_InsertVictimAssaultType', val).then((data) => {
            if (data) {
                setAssaultDrp(threeColArrayWithCode(data, 'AssaultTypeID', 'Description', 'AssaultCode'));
            } else {
                setAssaultDrp([])

            }
        })
    }

    const get_Data_JustifiableHomicide_Drp = (victimID) => {
        const val = { 'VictimID': victimID }
        fetchPostData('VictimJustifiableHomicide/GetData_InsertJustifiableHomicide', val).then((data) => {
            if (data) {
                setJustifiableHomiDrp(threeColVictimInjuryArray(data, 'JustifiableHomicideID', 'Description', "JustifiableHomicideCode",))

            } else {
                setJustifiableHomiDrp([])
            }
        })
    }

    useEffect(() => {
        if (injuryTypeEditVal) { setVictimInjuryID(injuryTypeEditVal) }
    }, [injuryTypeEditVal])

    useEffect(() => {
        if (justifiableHomiEditVal) {
            setJustifiyID(justifiableHomiEditVal);
        }
    }, [justifiableHomiEditVal])

    useEffect(() => {
        if (assaultEditVal) {
            setAssaultID(assaultEditVal)
            const assultArray = assaultEditVal?.map((item) => item?.code);
            setAssultCodeArr(assultArray);
        }
    }, [assaultEditVal])

    useEffect(() => {
        if (victimID) { get_InjuryType_Data(victimID); get_Assults_Data(victimID); get_JustifiableHomicide_Data(victimID) }
    }, [victimID])

    const get_JustifiableHomicide_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimJustifiableHomicide/GetData_VictimJustifiableHomicide', val).then((res) => {
            // console.log("🚀 ~ get_JustifiableHomicide_Data ~ res:", res)
            if (res) {
                setJustifiableHomiEditVal(Comman_changeArrayFormatJustfiableHomicide(res, 'VictimJustifiableHomicideID', 'JustifiableHomicideID', 'PretendToBeID', 'JustifiableHomicide_Description', 'JustifiableHomicideCode'));

            } else {
                setJustifiableHomiEditVal([]);
            }
        })
    }

    const get_InjuryType_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('InjuryVictim/GetData_InjuryVictim', val).then((res) => {
            if (res) {
                setInjuryTypeEditVal(Comman_changeArrayFormatBasicInfowithoutcode(res, 'VictimInjuryID', 'NameID', 'PretendToBeID', 'NameEventInjuryID', 'VictimInjury_Description'));
            } else {
                setInjuryTypeEditVal([]);
            }
        })
    }

    const get_Assults_Data = (victimID) => {
        const val = { 'VictimID': victimID, }
        fetchPostData('VictimAssaultType/GetData_VictimAssaultType', val).then((res) => {
            if (res) {
                setAssaultEditVal(Comman_changeArrayFormatBasicInfo(res, 'AssaultID', 'Assault_Description', 'PretendToBeID', 'NameEventAssaultID', 'AssaultCode'));
            } else {
                setAssaultEditVal([]);
            }
        })
    }

    const InjuryTypeOnChange = (multiSelected) => {
        setVictimInjuryID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < injuryTypeEditVal?.length) {
            let missing = null;
            let i = injuryTypeEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(injuryTypeEditVal[--i])) ? missing : injuryTypeEditVal[i];
            }
        } else {

        }
        get_Data_InjuryType_Drp(victimID);
    }

    const JustifuableOnChange = (multiSelected) => {
        setJustifiyID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < justifiableHomiEditVal?.length) {
            let missing = null;
            let i = justifiableHomiEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(justifiableHomiEditVal[--i])) ? missing : justifiableHomiEditVal[i];
            }

        } else {

        }
        get_Data_JustifiableHomicide_Drp(victimID)
    }

    const assaultOnChange = (multiSelected) => {
        setAssaultID(multiSelected)
        const len = multiSelected.length - 1
        if (multiSelected?.length < assaultEditVal?.length) {
            let missing = null;
            let i = assaultEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(assaultEditVal[--i])) ? missing : assaultEditVal[i];
            }

        } else {

        }
        get_Assults_Drp(victimID)
    }

    const InSertBasicInfo = (id, col1, url) => {
        const val = {
            'NameID': nameID,
            'VictimID': victimID,
            [col1]: id,
            'CreatedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {


                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                col1 === 'VictimInjuryID' && get_InjuryType_Data();
                col1 === 'JustifiableHomicideID' && get_JustifiableHomicide_Data();
                col1 === 'AssaultID' && get_Assults_Data(); get_Assults_Drp()

            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const DelSertBasicInfo = (victimOfficerID, col1, url) => {
        const val = {
            [col1]: victimOfficerID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {

                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                if (col1 === 'NameEventInjuryID') {
                    get_InjuryType_Data();
                }
                else if (col1 === 'NameEventAssaultID') {
                    get_Assults_Data();
                    get_Assults_Drp();
                }
                else if (col1 === 'NameEventJustifiableHomicideID') {
                    get_JustifiableHomicide_Data();
                }
            } else {
                console.log("Somthing Wrong");
            }
        })
    }

    const nibrsStylesColor = {
        control: base => ({
            ...base,
            backgroundColor: "rgb(255 202 194)",
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const ErrorColorStyle = {
        control: base => ({
            ...base,
            backgroundColor: "rgb(255 202 194)",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const ColorStyle = {
        control: base => ({
            ...base,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const getFiltredReasonCode = (arr) => {
        const selectedReasonArr = multiSelected.optionSelected ? multiSelected.optionSelected : [];
        const isAdultArrest = selectedReasonArr?.filter((item) => item?.label === "Adult Arrest")
        const isJuvinileArrest = selectedReasonArr?.filter((item) => item?.label === "Juvenile Arrest")

        if (isAdultArrest?.length > 0) {
            const isAdultArr = arr?.filter((item) => item?.label != "Juvenile Arrest")
            return isAdultArr

        } else if (isJuvinileArrest?.length > 0) {
            const isAdultArr = arr?.filter((item) => item?.label != "Adult Arrest")
            return isAdultArr

        } else {
            return arr
        }
    }

    const [clickedRow1, setClickedRow1] = useState(null);
    const [relationshipData, setRelationshipData] = useState([]);
    const [status, setStatus] = useState(false);
    const [RelationshipID, setRelationshipID] = useState('');
    const [editCount, setEditCount] = useState(0);
    const [relationShipDrp, setRelationShipDrp] = useState([]);
    const [name, setName] = useState([]);
    const [singleData, setSingleData] = useState([]);
    const [incidentID, setIncidentID] = useState();
    const [selectedNameData, setSelectedNameData] = useState([]);
    const [relationTypeCode, setRelationTypeCode] = useState([]);
    const [confirmDeleteVictim, setConfirmDeleteVictim] = useState(false);

    const [value1, setValue1] = useState({
        'Code': 'VIC',
        'IncidentID': IncID,
        'VictimID': victimID,
        'NameID': DeNameID,
        'RelationshipTypeID': '',
        'VictimNameID': '',
        'OffenderNameID': '',
        'ModifiedByUserFK': '',
        'RelationshipID': '',
    });

    useEffect(() => {
        get_NameVictim_Count(victimID);
        get_Name_Count(DeNameID);
    }, [DeNameID, victimID]);

    useEffect(() => {
        if (DeNameID) { setNameID(DeNameID); setIncidentID(IncID); setValue1({ ...value1, 'CreatedByUserFK': loginPinID, 'NameID': DeNameID, }) }
        get_Name_Count(DeNameID)
    }, [DeNameID, loginPinID,]);

    const [errors1, setErrors1] = useState({
        'RelationshipTypeIDErrors': '', 'VictimNameIDErrors': '',
    })

    const check_Validation_Error1 = () => {

        const RelationshipTypeIDErr = isCrimeAgainstPerson || has120RoberyOffense ? RequiredFieldIncident(value1.RelationshipTypeID) : 'true';
        const OffenderNameIDErr = isCrimeAgainstPerson || has120RoberyOffense ? RequiredFieldIncident(value1.OffenderNameID) : 'true';

        setErrors1(prevValues => {
            return {
                ...prevValues,
                ['RelationshipTypeIDErrors']: RelationshipTypeIDErr || prevValues['RelationshipTypeIDErrors'],
                ['VictimNameIDErrors']: OffenderNameIDErr || prevValues['VictimNameIDErrors'],
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { RelationshipTypeIDErrors, VictimNameIDErrors } = errors1

    useEffect(() => {
        if (RelationshipTypeIDErrors === 'true' && VictimNameIDErrors === 'true') {
            if (status && RelationshipID) { update_Relationship(); Update_Name(false); }
            else { save_Relationship() }
        }
    }, [RelationshipTypeIDErrors, VictimNameIDErrors])

    useEffect(() => {
        get_Data_RelationShip_Drp(loginAgencyID); get_Data_Name_Drp(IncID, DeNameID); Get_Relationship_Data(DeNameID);
    }, [DeNameID, IncID, loginAgencyID])

    useEffect(() => {
        if (singleData[0]?.RelationshipID && RelationshipID) {
            setValue1(pre => {
                return {
                    ...pre,
                    RelationshipTypeID: singleData[0]?.RelationshipTypeID,
                    VictimNameID: singleData[0]?.VictimNameID,
                    OffenderNameID: singleData[0]?.OffenderNameID,
                    ModifiedByUserFK: loginPinID,
                    RelationshipID: singleData[0]?.RelationshipID,
                }
            });
            singleData[0]?.OffenderNameID && getSelectedNameSingleData(singleData[0]?.OffenderNameID);
            singleData[0]?.OffenderNameID && setRelationTypeCode(Get_RelationType_Code(singleData, relationShipDrp))
        } else {
            resetHooks()
        }
    }, [singleData, editCount])

    const get_Data_RelationShip_Drp = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID, }
        fetchPostData('VictimRelationshipType/GetDataDropDown_VictimRelationshipType', val).then((data) => {
            if (data) {
                setRelationShipDrp(threeColArray(data, 'VictimRelationshipTypeID', 'Description', 'VictimRelationshipTypeCode'))
            } else {
                setRelationShipDrp([])
            }
        })
    }

    const get_Data_Name_Drp = (IncID, DeNameID) => {
        const val = { 'IncidentID': IncID, 'NameID': DeNameID, }
        fetchPostData('NameRelationship/GetDataDropDown_OffenderName', val).then((data) => {
            if (data) {

                setName(Comman_changeArrayFormat(data, 'NameID', 'Name'))
            } else {
                setName([])
            }
        })
    }

    const get_Single_Data = (RelationshipID) => {
        const val = { 'RelationshipID': RelationshipID, }
        fetchPostData('NameRelationship/GetSingleData_NameRelationship', val).then((data) => {
            if (data) {
                setSingleData(data)
            } else {
                setSingleData([])
            }
        })
    }

    const ChangeDropDown1 = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            if (name === 'OffenderNameID') {
                setValue1({ ...value1, [name]: e.value });
                getSelectedNameSingleData(e.value)
            } else if (name === 'RelationshipTypeID') {
                setRelationTypeCode(e?.id);
                setValue1({ ...value1, [name]: e.value });

            } else {
                setValue1({ ...value1, [name]: e.value });
            }
        } else {
            if (name === 'OffenderNameID') {
                setValue1({ ...value1, [name]: null });
                setSelectedNameData([]);
            } else if (name === 'RelationshipTypeID') {
                setValue1({ ...value1, [name]: null });
                setRelationTypeCode('');
            } else {
                setValue1({ ...value1, [name]: null });
            }
        }
    }

    const getSelectedNameSingleData = (DeNameID, masterNameID) => {
        const val = { 'NameID': DeNameID, 'MasterNameID': masterNameID, 'IsMaster': false, }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setSelectedNameData(res[0]);
            } else { setSelectedNameData([]) }
        })
    }

    const save_Relationship = () => {
        const result = relationshipData?.find(item => {
            if (item?.OffenderNameID === value1?.OffenderNameID && item?.RelationshipTypeID === value1?.RelationshipTypeID) {
                return item?.OffenderNameID === value1?.OffenderNameID && item?.RelationshipTypeID === value1?.RelationshipTypeID
            } else return item?.OffenderNameID === value1?.OffenderNameID && item?.RelationshipTypeID === value1?.RelationshipTypeID
        });
        if (result) {
            toastifyError('Offender Name And Relationship Type Already Exists');
            setErrors1({ ...errors1, ['RelationshipTypeIDErrors']: '' });
        } else {
            if (value1?.RelationshipTypeID && value1?.OffenderNameID) {
                AddDeleteUpadate('NameRelationship/Insert_NameRelationship', value1).then((data) => {
                    if (data.success) {
                        const parsedData = JSON.parse(data.data);
                        const message = parsedData.Table[0]?.Message;
                        if (message === 'Victim-Offender Relationship Already Present') {
                            toastifyError(message); setErrors1({ ...errors1, ['RelationshipTypeIDErrors']: '' });
                        } else {
                            toastifySuccess(message);
                            Get_Relationship_Data(DeNameID); setStatus(false); resetHooks(); get_NameVictim_Count(victimID)
                            get_Name_Count(DeNameID); setErrors1({ ...errors1, ['RelationshipTypeIDErrors']: '' });
                            setStatesChangeStatus(false); setChangesStatus(false)
                        }
                    } else {
                        toastifyError(data.Message)
                    }
                })
            } else {
                toastifyError('Please Select Relationship Type & Offender Name');
                setErrors1({ ...errors1, ['RelationshipTypeIDErrors']: '', 'VictimNameIDErrors': '', });
            }
        }
    }

    const update_Relationship = () => {
        const result = relationshipData?.find(item => {
            if (item?.RelationshipID != value1['RelationshipID']) {
                if (item?.OffenderNameID === value1?.OffenderNameID && item?.RelationshipTypeID === value1?.RelationshipTypeID) {
                    return item?.OffenderNameID === value1?.OffenderNameID && item?.RelationshipTypeID === value1?.RelationshipTypeID
                } else return item?.OffenderNameID === value1?.OffenderNameID && item?.RelationshipTypeID === value1?.RelationshipTypeID
            }
        });
        if (result) {
            toastifyError('Offender & Relationship Already Exists')
            setErrors({ ...errors, ['RelationshipTypeIDErrors']: '' })
        } else {
            if (value1?.RelationshipTypeID && value1?.OffenderNameID) {
                AddDeleteUpadate('NameRelationship/Update_NameRelationship', value1).then((data) => {
                    if (data.success) {
                        const parsedData = JSON.parse(data.data);
                        const message = parsedData.Table[0].Message;
                        toastifySuccess(message);
                        Get_Relationship_Data(DeNameID); setStatus(true);
                        setStatesChangeStatus(false); setChangesStatus(false)
                        get_Name_Count(DeNameID);
                        resetHooks();
                        setErrors1({
                            ...errors1,
                            'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '',
                        });
                    } else {
                        toastifyError(data.Message)
                    }
                })
            } else {
                toastifyError('Please Select Relationship Type & Offender Name');
                setErrors1({ ...errors1, ['RelationshipTypeIDErrors']: '', 'VictimNameIDErrors': '', });
            }
        }
    }

    const resetHooks = () => {
        setValue1({ ...value1, RelationshipTypeID: '', VictimNameID: '', OffenderNameID: '', ModifiedByUserFK: '', RelationshipID: '', });
        setStatesChangeStatus(false); setChangesStatus(false); setRelationshipID(''); setStatus(false);
        setErrors1({ ...errors1, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
        setSelectedNameData([]); setRelationTypeCode('');
    }

    const Get_Relationship_Data = (DeNameID) => {
        const val = { 'Code': 'VIC', 'NameID': DeNameID, }
        fetchPostData('NameRelationship/GetData_NameRelationship', val).then((res) => {
            if (res) {

                setRelationshipData(res)
            } else {
                setRelationshipData([]);
            }
        })
    }

    const columns1 = [
        {
            name: 'Name',
            selector: (row) => row.OffenderName,
            sortable: true
        },
        {
            name: 'Relationship',
            selector: (row) => row.RelationshipType_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: '10px' }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>

                    <span onClick={(e) => { setRelationshipID(row.RelationshipID); setConfirmDeleteVictim(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RelationshipId">
                        <i className="fa fa-trash"></i>
                    </span>
                </div>
        }
    ];

    const deleteVictimRelation = () => {
        const val = { 'RelationshipID': RelationshipID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameRelationship/Delete_NameRelationship', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                setConfirmDeleteVictim(false)
                setEditCount(editCount + 1)
                Get_Relationship_Data(DeNameID);
                setChangesStatus(false)
                get_NameVictim_Count(victimID)
                resetHooks();
                setStatusFalse1()
            } else { toastifyError("Somthing Wrong"); }
        })
    }

    const colourStyles1 = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const withOutColorStyle1 = {
        control: (styles) => ({
            ...styles,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const NibrsErrorsStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "rgb(255 202 194)",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const set_Edit_Value1 = (row) => {
        get_Single_Data(row.RelationshipID)
        setStatus(true);

        setRelationshipID(row.RelationshipID);

        setErrors1({
            ...errors1,
            'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '',
        });
    }

    const setStatusFalse1 = (e) => {
        setClickedRow1(null); resetHooks();
        setStatus(false)
        setStatesChangeStatus(false);
        setUpdateStatus(updateStatus + 1);
        setErrors1({
            ...errors1,
            'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '',
        });
        setnibrsSubmittedVictim(0);

    }

    const conditionalRowStyless = [
        {
            when: row => row === clickedRow1,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const getRelationNibrsError = (RelationTypeCode, type) => {
        const validCodes = ["SE", "CS", "PA", "SB", "CH", "GP", "GC", "IL", "SP", "SC", "SS", "OF", "AQ", "FR", "NE", "BE", "BG", "CF", "XS", "EE", "ER", "OK", "RU", "ST", "VO", "HR", "XB"];
        if (RelationTypeCode) {
            if (validCodes?.includes(RelationTypeCode)) {
                if (RelationTypeCode == "SE") {
                    return relationTypeCode == "SE" && nameSingleData[0]?.AgeFrom < 13 ? type === 'Color' ? NibrsErrorsStyles : <ErrorTooltipComp ErrorStr={VectimOffenderSpouceError} /> : false

                } else if (RelationTypeCode === "PA" || RelationTypeCode === "GP") {
                    return selectedNameData?.AgeFrom > nameSingleData[0]?.AgeFrom ? type === 'Color' ? NibrsErrorsStyles : <ErrorTooltipComp ErrorStr={'the victim’s age must be greater than the offender’s age.'} /> : false

                } else if (RelationTypeCode === "CH" || RelationTypeCode === "GC") {
                    return selectedNameData?.AgeFrom < nameSingleData[0]?.AgeFrom ? type === 'Color' ? NibrsErrorsStyles : <ErrorTooltipComp ErrorStr={'the victim’s age must be less than the offender’s age.'} /> : false

                }
                else {
                    return false

                }
            } else {
                return type === 'Color' ? NibrsErrorsStyles : <ErrorTooltipComp ErrorStr={"Invalid Relationship Type"} />

            }
        } else if (name?.length > 0 && relationshipData?.length === 0) {
            return type === 'Color' ? NibrsErrorsStyles : <ErrorTooltipComp ErrorStr={"Data must be entered"} />

        } else {
            return type === 'Color' ? colourStyles1 : <></>

        }
    }

    useEffect(() => {
        if (victimClick && mainIncidentID) {
            ValidateIncNames(mainIncidentID, IncNo, true)
        }
    }, [victimClick, mainIncidentID])

    // validate Incident
    const ValidateIncNames = (incidentID, IncNo, isDefaultSelected = false) => {
        setclickNibLoder(true);
        const val = {
            'gIncidentID': incidentID,
            'IncidentNumber': IncNo,
            'NameID': "",
            'gIntAgencyID': loginAgencyID,
        }
        try {
            fetchPostDataNibrs('NIBRS/GetVictimNIBRSError', val).then((data) => {
                if (data) {

                    const victimList = data?.Victim;
                    console.log("🚀 ~ ValidateIncNames ~ victimList:", victimList)
                    if (Array.isArray(victimList) && victimList.length > 0 && isDefaultSelected) {
                        const row = victimList[0];
                        getNibrsErrorToolTip(row?.NameEventID, mainIncidentID, IncNo);

                        get_Offense_DropDown(mainIncidentID, row?.NameEventID);
                        setStatesChangeStatus(false);
                        GetSingleData(row?.NameEventID, row?.MasterNameID);
                        navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameEventID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
                        setNameID(row.NameEventID);
                        setMasterNameID(row?.MasterNameID);
                        setUpdateStatus(updateStatus + 1);

                        setErrors({
                            ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
                        });
                    }

                    setnibrsValidateNameData(data?.Victim);
                    setclickNibLoder(false);

                } else {
                    setnibrsValidateNameData([]);
                    setclickNibLoder(false);

                }
            })
        } catch (error) {
            console.log("🚀 ~ nibrsValidateName ~ error:", error);
            setclickNibLoder(false);
        }
    }

    const getNibrsErrorToolTip = (NameId, IncidentID, IncNo) => {
        setShowInjuryTypeError(false);
        setShowVictimAgeError(false);
        setShowAssaultTypeError(false);
        setShowOffenseTypeError(false);
        setShowJustifyHomicideError(false);
        setShowCallTypeError(false);
        const val = {
            "gIncidentID": IncidentID,
            "IncidentNumber": IncNo,
            "NameID": NameId,
            "gIntAgencyID": loginAgencyID,
        }
        fetchPostDataNibrs('NIBRS/GetVictimNIBRSError', val).then((data) => {

            if (data) {
                const victimError = data?.Victim && data?.Victim[0] ? data?.Victim[0] : [];
                console.log("🚀 ~ getNibrsErrorToolTip ~ victimError:", victimError)
                setnibrsFieldError(victimError);
                if (victimError?.InjuryType) {
                    setShowInjuryTypeError(true);

                }
                if (victimError?.VictimAge) {
                    setShowVictimAgeError(true);

                }
                if (victimError?.AssaultType) {
                    setShowAssaultTypeError(true);

                }
                if (victimError?.AssignmentType) {
                    setShowAssignmentTypeError(true);

                }
                if (victimError?.Offense) {
                    setShowOffenseTypeError(true);

                }
                if (victimError?.JustHomicide) {
                    setShowJustifyHomicideError(true);

                }
                if (victimError?.CallType) {
                    setShowCallTypeError(true);

                }
            } else {
                setnibrsFieldError([]);

            }
        })
    }

    function filterArray(arr, key) {
        return [...new Map(arr?.map(item => [item[key], item])).values()]
    }

    useEffect(() => {
        if (DeNameID) {
            setNameID(DeNameID); setIncidentID(IncID);
            get_OffenseName_Data(DeNameID);
        }
        else if (DeMasterNameID) {
            setMasterNameID(DeMasterNameID)
            get_OffenseName_Data(DeMasterNameID);
        }
    }, [DeNameID, loginPinID, DeMasterNameID]);

    const codes_for_IndividualVictim = ["100", "11A", "11B", "11C", "11D", "120", "13A", "13B", "210", "64A", "64B"]

    const get_OffenseName_Data = (DeNameID) => {
        const val = { 'NameID': DeNameID }
        fetchPostData('NameOffense/GetData_NameOffense', val).then((res) => {
            if (res) {
                setTypeOfSecurityEditVal(offenseArray(res, 'NameOffenseID', 'OffenseID', 'NameID', 'NameID', 'Offense_Description', 'PretendToBeID'));

                setHas120RoberyOffense(res.some(item => item.FBICode === "220"));
                const hasPropertyCrime = res.some(item => item.IsCrimeAgains_Person === true);
                setIsCrimeAgainstPerson(hasPropertyCrime);

                const OffenseNibrsCodeArr = res?.map(item => item.FBICode);
                setnibrsCodeArray(OffenseNibrsCodeArr);

                const hasMatchingFBICode = res.some(item => codes_for_IndividualVictim.includes(item.FBICode));
                setisInjurryRequired(hasMatchingFBICode);

            } else {
                setIsCrimeAgainstPerson(false);
                setHas120RoberyOffense(false);
                setTypeOfSecurityEditVal([]);

            }
        }).catch((err) => {
            console.log("🚀 ~ getOffenseData ~ err:", err);
        });
    }

    useEffect(() => {
        if (typeOfSecurityEditVal) {
            setoffensemultiSelected(prevValues => { return { ...prevValues, ['OffenseID']: typeOfSecurityEditVal } });

        }
    }, [typeOfSecurityEditVal])

    const get_Offense_DropDown = (incidentID, nameID) => {
        const val = { 'IncidentID': incidentID, 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': nameID ? false : true }
        fetchPostData('NameOffense/GetData_InsertNameOffense', val).then((data) => {
            if (data) {
                setOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description'));

            } else {
                setOffenseDrp([]);

            }
        }).catch((err) => {
            console.log("🚀 ~get_Offense_DropDown fetchpostdata error ~ err:", err);
        })
    }

    const offenseMulitiSelectOnchange = (multiSelected) => {
        setStatesChangeStatus(true);
        setoffensemultiSelected({
            ...offensemultiSelected,
            OffenseID: multiSelected
        })

        const len = multiSelected.length - 1
        if (multiSelected?.length < typeOfSecurityEditVal?.length) {
            let missing = null;
            let i = typeOfSecurityEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
            }
            DelSertBasicInfo1(missing.value, 'NameOffenseID', 'NameOffense/Delete_NameOffense')

        } else {
            InSertBasicInfo1(multiSelected[len]?.value, 'OffenseID', 'NameOffense/Insert_NameOffense')

        }
        if (multiSelected.length > 0) {
            setoffenceCountStatus(true);
        } else {
            setoffenceCountStatus(false);
        }
        // validateIncSideBar
        validate_IncSideBar(IncID, IncNo, loginAgencyID);
    }

    const InSertBasicInfo1 = (id, col1, url) => {
        const val = {
            'NameID': nameID, [col1]: id, 'CreatedByUserFK': loginPinID, 'MasterNameID': masterNameID, 'IsMaster': nameID ? false : true
        }

        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Name_Count(DeNameID); get_Offense_DropDown(incidentID, DeNameID);
                col1 === 'OffenseID' && get_OffenseName_Data(DeNameID);
            } else {
                console.log("Somthing Wrong");
            }
        }).catch((err) => {
            console.log("🚀 ~ Insert AddDeleteUpadate ~ err:", err);
        })
    }

    const DelSertBasicInfo1 = (OffenseID, col1, url) => {
        const val = { [col1]: OffenseID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Name_Count(DeNameID)
                get_Offense_DropDown(incidentID, DeNameID);
                col1 === 'NameOffenseID' && get_OffenseName_Data(DeNameID)
            } else {

            }
        }).catch((err) => {
            console.log("🚀 ~Delete AddDeleteUpadate ~ err:", err);
        })
    }

    const customStyleOffenseWithoutColor = {
        control: base => ({
            ...base,
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "134px",
            overflowY: "auto",
        }),
    };

    const customStyleOffenseNibrsErrorColor = {
        control: base => ({
            ...base,
            backgroundColor: "#F29A9A",
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "134px",
            overflowY: "auto",
        }),
    };

    const customStyleOffenseNibrsSuccessColor = {
        control: base => ({
            ...base,
            backgroundColor: "#9fd4ae",
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "134px",
            overflowY: "auto",
        }),
    };

    const CheckboxOption = props => {
        return (
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />
                <label className='ml-2'>{props.label}</label>
            </components.Option>
        );
    };

    const getLimitedTimesUpTo = (limitDate) => {
        const times = [];
        const start = new Date(limitDate);
        start.setHours(0, 0, 0, 0); // start at 00:00

        const end = new Date(limitDate);

        while (start <= end) {
            times.push(new Date(start));
            start.setMinutes(start.getMinutes() + 1);
        }

        return times;
    };

    const [allowTimeSelect, setAllowTimeSelect] = useState(false);

    const maxAllowedDate = MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate);

    const isSameDate = (d1, d2) => {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    };

    const updateAllowTimeSelect = (date) => {
        if (!date) {
            setAllowTimeSelect(false);
            return;
        }
        const selectedDate = new Date(date);
        const maxDate = new Date(maxAllowedDate);
        const dayBeforeMax = new Date(maxDate);
        dayBeforeMax.setDate(maxDate.getDate() - 1);

        // Only enable time if selected date is maxDate or maxDate-1
        if (isSameDate(selectedDate, maxDate) || isSameDate(selectedDate, dayBeforeMax)) {
            setAllowTimeSelect(true);
        } else {
            setAllowTimeSelect(false);
        }
    };

    useEffect(() => {
        updateAllowTimeSelect(dobDate); // Set it when page loads (initially)
    }, [dobDate, maxAllowedDate]);

    const handleDateChange = (date, e) => {
        if (new Date(date) > new Date(maxAllowedDate)) {
            date = maxAllowedDate
        } else if (new Date('1900-01-01') > new Date(date)) {
            date = new Date('1900-01-02')
        }
        setDobDate(date);
        updateAllowTimeSelect(date);
        handleDOBChange(date, e);
        setChangesStatus(true);
        setStatesChangeStatus(true);
    };

    return (
        <>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 ">
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                <label htmlFor="" className='label-name '>Name Type
                                    {errors.NameTypeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.NameTypeIDError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                <Select
                                    name='NameTypeID'
                                    value={nameTypeData?.filter((obj) => obj.value === value?.NameTypeID)}
                                    options={nameTypeData}
                                    onChange={(e) => ChangeNameType(e, 'NameTypeID')}

                                    placeholder="Select..."
                                    isDisabled={nameID || masterNameID ? true : false}
                                    styles={Requiredcolour}
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                <label htmlFor="" className='label-name '>MNI</label>
                            </div>
                            <div className="col-2 col-md-3 col-lg-2 text-field mt-1">
                                <input type="text" className='readonlyColor' value={value?.NameIDNumber} name='nameid' required readOnly />
                            </div>
                            <div className="col-3 col-md-2 col-lg-1 mt-2">
                                <div className="form-check ">

                                    {
                                        !(nameTypeCode === "B") && (
                                            value.DateOfBirth || value.AgeFrom ? (
                                                <>
                                                    <input className="form-check-input" type="checkbox" name="IsJuvenile" value={value?.IsJuvenile} checked={value?.IsJuvenile} id="flexCheckDefault" disabled={nameTypeCode === "B"} />
                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                        Juvenile
                                                    </label>
                                                </>
                                            ) : (
                                                <>
                                                    <input className="form-check-input" type="checkbox" name="IsJuvenile" value={value?.IsJuvenile} checked={false} id="flexCheckDefault" disabled={nameTypeCode === "B"} />
                                                    <label className="form-check-label" htmlFor="flexCheckDefault">
                                                        Juvenile
                                                    </label>
                                                </>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div >
                </div>
                {
                    nameTypeCode === "B" ?
                        <div className="col-12 col-md-12 col-lg-12">
                            <div className="row ">
                                <div className="col-1 col-md-1 col-lg-1 mt-2 px-0">
                                    <label htmlFor="" className='label-name'>Business Name
                                        {errors.LastNameError !== 'true' && nameTypeCode === 'B' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</p>
                                        ) : null}</label>
                                </div>
                                <div className="col-2 col-md-2 col-lg-4 text-field mt-1">
                                    <input type="text" name='LastName' value={value?.LastName}
                                        className={isSocietyName ? 'readonlyColor' : 'requiredColor'}
                                        disabled={isSocietyName}
                                        onChange={HandleChange} required />
                                </div>
                                <div className="col-1 col-md-1 col-lg-1 mt-2">
                                    <label htmlFor="" className='label-name '>Business Type</label>
                                </div>
                                <div className="col-2 col-md-2 col-lg-5  mt-1">
                                    <Select
                                        name='BusinessTypeID'
                                        value={businessTypeDrp?.filter((obj) => obj.value === value?.BusinessTypeID)}
                                        options={businessTypeDrp}
                                        onChange={(e) => ChangeDropDown(e, 'BusinessTypeID')}
                                        isClearable
                                        placeholder="Select..."
                                        styles={customStylesWithOutColor}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-1 col-md-1 col-lg-1 mt-2">
                                    <label htmlFor="" className='label-name '>Owner Name</label>
                                </div>
                                <div className="col-2 col-md-2 col-lg-3  mt-1">
                                    {
                                        MstPage === "MST-Name-Dash" ?
                                            <Select
                                                name='OwnerNameID'
                                                styles={customStylesWithOutColor}
                                                options={mastersNameDrpData}
                                                value={mastersNameDrpData?.filter((obj) => obj.value === value?.OwnerNameID)}
                                                isClearable={value?.OwnerNameID ? true : false}
                                                onChange={(e) => ChangeDropDown(e, 'OwnerNameID')}
                                                placeholder="Select..."
                                            />
                                            :
                                            <Select
                                                name='OwnerNameID'
                                                styles={customStylesWithOutColor}
                                                options={ownerNameData}
                                                value={ownerNameData?.filter((obj) => obj.value === value?.OwnerNameID)}
                                                isClearable={value?.OwnerNameID ? true : false}
                                                onChange={(e) => ChangeDropDown(e, 'OwnerNameID')}
                                                placeholder="Select..."
                                            />
                                    }
                                </div>
                                <div className="col-1 mt-1" data-toggle="modal" data-target="#MasterModal"  >
                                    <button onClick={() => {
                                        if (possessionID) {
                                            setTimeout(() => {
                                                GetSingleDataPassion(possessionID);
                                            }, [200])

                                        }
                                        setNameModalStatus(true);
                                    }} className=" btn btn-sm bg-green text-white py-1" >
                                        <i className="fa fa-plus" >
                                        </i>
                                    </button>
                                </div>

                                <div className="col-1 col-md-1 col-lg-1 mt-2 ">
                                    <label htmlFor="" className='label-name '>Owner&nbsp;Phone&nbsp;No.{errors.OwnerPhoneNumberError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OwnerPhoneNumberError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 text-field mt-1">
                                    <input type="text" name='OwnerPhoneNumber' maxLength={11} className={''} value={value?.OwnerPhoneNumber} onChange={HandleChange} required />

                                </div>

                                <div className="col-1 col-md-1 col-lg-2 px-0 mt-2">
                                    <label htmlFor="" className='label-name px-0'>Business Fax No.{errors.OwnerFaxNumberError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OwnerFaxNumberError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 text-field mt-1">
                                    <input type="text" name='OwnerFaxNumber' className={''} value={value?.OwnerFaxNumber} onChange={HandleChange} required />
                                </div>
                            </div>
                        </div>
                        :
                        <div className="row mt-1 px-0">
                            <div className="col-12 col-md-12 col-lg-12  ">
                                <div className="row">
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='label-name '>Last Name
                                            {errors.LastNameError !== 'true' && nameTypeCode !== 'B' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</p>
                                            ) : null}</label>
                                    </div>
                                    <div className="col-10 col-md-10 col-lg-2 text-field mt-1">
                                        <input type="text" name='LastName' maxLength={100} onBlur={(e) => { e.relatedTarget !== saveButtonRef.current && e.relatedTarget !== closeButtonRef.current && LastFirstNameOnBlur(e) }} className={nameTypeCode === "B" ? 'readonlyColor' : 'requiredColor'} value={value?.LastName} onClick={() => { setChangesStatus(true); }} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} autoComplete='off' />
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                                        <label htmlFor="" className='label-name '>First Name
                                            {errors.FirstNameError !== 'true' && nameTypeCode !== 'B' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</p>
                                            ) : null}
                                        </label>
                                    </div>
                                    <div className="col-2 col-md-4 col-lg-2 text-field mt-1">
                                        <input type="text" maxLength={50} ref={firstNameInputRef} name='FirstName'
                                            onBlur={(e) => { e.relatedTarget !== saveButtonRef.current && LastFirstNameOnBlur(e) }}
                                            className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? 'readonlyColor' : ''} value={value?.FirstName} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? true : false} onClick={() => { setChangesStatus(true); }} autoComplete='off' />
                                    </div>
                                    <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                        <label htmlFor="" className='label-name '>Middle Name
                                            {errors.MiddleNameError !== 'true' && nameTypeCode !== 'B' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.MiddleNameError}</p>
                                            ) : null}
                                        </label>
                                    </div>
                                    <div className="col-2 col-md-4 col-lg-2 text-field mt-1">
                                        <input type="text" name='MiddleName' maxLength={50} value={value?.MiddleName} className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? 'readonlyColor' : ''} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? true : false} onClick={() => { setChangesStatus(true); }} autoComplete='off' />
                                    </div>
                                    <div className="col-12 col-md-12 col-lg-3 d-flex mt-1 ">
                                        <div className="col-2 col-md-2 col-lg-2 mt-2 ml-4 ml-md-0">
                                            <label htmlFor="" className='label-name'>Suffix</label>
                                        </div>
                                        <div className="col-8 col-md-8 col-lg-6 ">
                                            <Select
                                                name='SuffixID'
                                                value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                                                options={suffixIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                                                isClearable
                                                placeholder="Select..."
                                                isDisabled={nameTypeCode === "B" ? true : false}
                                                styles={customStylesWithOutColor}
                                            />
                                        </div>
                                        <div className="col-4 col-md-2 col-lg-4">
                                            <div className="form-check pt-2 ">
                                                <input className="form-check-input " type="checkbox" name='IsUnknown' value={value?.IsUnknown} checked={value?.IsUnknown} onChange={HandleChange} id="flexCheckDefault1" disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                                                <label className="form-check-label label-name  pr-md-2" htmlFor="flexCheckDefault1">
                                                    Unknown
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
                {
                    nameTypeCode === "B" ?
                        <>
                        </>
                        :
                        <>
                            <div className="row ">
                                <div className="col-12 col-md-12 col-lg-6">
                                    <div className="row">
                                        <div className="col-1 col-md-2 col-lg-2 mt-3">
                                            <label htmlFor="" className='label-name '>DOB
                                                {errors.DateOfBirthError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DateOfBirthError}</p>
                                                ) : null}</label>

                                        </div>
                                        <div className="col-2 col-md-3 col-lg-4 mt-0">
                                            <DatePicker
                                                id='DateOfBirth'
                                                name='DateOfBirth'
                                                ref={startRef}
                                                onKeyDown={(e) => {
                                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                        e.preventDefault();
                                                    } else {
                                                        onKeyDown(e);
                                                    }
                                                }
                                                }
                                                onChange={handleDateChange}
                                                dateFormat={allowTimeSelect ? "MM/dd/yyyy" : "MM/dd/yyyy"}
                                                isClearable={value.DateOfBirth ? true : false}
                                                selected={dobDate}
                                                placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select...'}

                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'

                                                maxDate={MstPage === "MST-Name-Dash" ? new Date() : new Date(incReportedDate)}
                                                disabled={nameTypeCode === "B" ? true : false}
                                                className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? 'readonlyColor' : '' ? 'requiredColor' : ''}
                                                readOnly={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? true : false}

                                            />
                                        </div>
                                        <div className="col-12 col-md-7 col-lg-3 d-flex position-relative " >
                                            <div className="col-1 col-md-1 col-lg-3 mt-2 ">
                                                <label htmlFor="" className='label-name'>Age {errors.AgeFromError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.AgeFromError}</p>
                                                ) : null}</label>
                                            </div>
                                            {nibrsFieldError?.VictimAge && showVictimAgeError && (
                                                <div className="nibrs-tooltip-error nibrs-tooltip-error-victimAge ">
                                                    <div className="tooltip-arrow"></div>

                                                    <div className="tooltip-content">
                                                        <span className="text-danger">⚠️ {nibrsFieldError.VictimAgeError || ''}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="col-2 col-md-3 col-lg-5 mt-1  text-field px-0" >
                                                <input type="text" name='AgeFrom' maxLength={3}
                                                    className={value.DateOfBirth || value?.IsUnknown === 'true' || value?.IsUnknown === true ? 'readonlyColor' : victimTypeStatus || isAdult || IsOffender ? 'requiredColor' : ''}

                                                    style={{
                                                        textAlign: 'center', ...(value?.VictimCode === 'I' || value?.VictimCode === 'L') && !value.AgeFrom ? {
                                                            backgroundColor: 'rgb(255 202 194)',
                                                            height: 20,
                                                            minHeight: 33,
                                                            fontSize: 14,
                                                            marginTop: 2,
                                                            boxShadow: 0,
                                                        }
                                                            : {}
                                                    }}
                                                    value={value?.AgeFrom}

                                                    onBlur={(e) => AgeFromOnBlur(e)}
                                                    onChange={HandleChange} required
                                                    disabled={(value.DateOfBirth ? true : false) || value?.IsUnknown === 'true' || value?.IsUnknown === true}
                                                    readOnly={(value.DateOfBirth ? true : false) || value?.IsUnknown === 'true' || value?.IsUnknown === true} placeholder='From' autoComplete='off' />
                                            </div>
                                            <span className='dash-name mt-1'>_</span>
                                            <div className="col-2 col-md-2 col-lg-4 mt-1  text-field " >
                                                <input type="text" name='AgeTo' maxLength={3}
                                                    style={{
                                                        textAlign: 'center', ...(value?.VictimCode === 'I' || value?.VictimCode === 'L') && !value.AgeTo ? {
                                                            backgroundColor: 'rgb(255 202 194)',
                                                            height: 20,
                                                            minHeight: 33,
                                                            fontSize: 14,
                                                            marginTop: 2,
                                                            boxShadow: 0,
                                                        }
                                                            : {}
                                                    }}
                                                    value={value?.AgeTo} onChange={HandleChange} required className={value.DateOfBirth || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true ? 'readonlyColor' : ''} disabled={value.DateOfBirth ? true : false || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true} readOnly={value.DateOfBirth ? true : false || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true} placeholder='To' autoComplete='off' />

                                            </div>
                                            <div className="col-4 col-md-4 col-lg-12  mt-1 px-0 text-nowrap" >
                                                <Select
                                                    name='AgeUnitID'
                                                    value={ageUnitDrpData?.filter((obj) => obj.value === value?.AgeUnitID)}
                                                    options={ageUnitDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'AgeUnitID')}
                                                    isClearable
                                                    placeholder="Age Unit..."
                                                    styles={value.AgeFrom ? Requiredcolour : customStylesWithOutColor}

                                                    isDisabled={value.DateOfBirth ? true : false || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true}

                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-6">
                                    <div className="row">
                                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                            <span data-toggle="modal" onClick={() => { setOpenPage('Gender') }} data-target="#ListModel" className='new-link px-0'>
                                                Gender {errors.SexIDError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.SexIDError}</p>
                                                ) : null}
                                            </span>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-4 mt-1 ">
                                            <Select
                                                styles={(value?.VictimCode === 'I' || value?.VictimCode === 'L') && !value.SexID && value?.IsUnknown !== 'true' && value?.IsUnknown !== true && !isAdult ? nibrscolourStyles : (isAdult || IsOffender || victimTypeStatus ? Requiredcolour : customStylesWithOutColor)}
                                                name='SexID'
                                                value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                options={sexIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                isClearable
                                                placeholder="Select..."
                                                isDisabled={nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true ? true : false}
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-2 px-0">
                                            <span data-toggle="modal" onClick={() => { setOpenPage('Race') }} data-target="#ListModel" className='new-link px-0'>
                                                Race{errors.RaceIDError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RaceIDError}</p>
                                                ) : null}
                                            </span>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-5 mt-1">
                                            <Select
                                                name='RaceID'
                                                value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                options={raceIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                isClearable
                                                placeholder="Select..."
                                                isDisabled={nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true ? true : false}
                                                styles={(value?.VictimCode === 'I' || value?.VictimCode === 'L') && !value.RaceID && value?.IsUnknown !== 'true' && value?.IsUnknown !== true && !isAdult ? nibrscolourStyles : (isAdult || IsOffender || victimTypeStatus ? Requiredcolour : customStylesWithOutColor)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 col-md-12 col-lg-6 d-flex ">
                                            <div className="col-2 col-md-2 col-lg-2 mt-2 ">

                                                <span data-toggle="modal" onClick={() => { setOpenPage('Ethnicity') }} data-target="#ListModel" className='new-link px-0'>
                                                    Ethnicity{errors.EthnicityErrorr !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.EthnicityErrorr}</p>
                                                    ) : null}

                                                </span>
                                            </div>
                                            <div className="col-10 col-md-10 col-lg-10 mt-1 mb-0">
                                                <Select
                                                    name='EthnicityID'
                                                    value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                    options={ethinicityDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                    styles={(value?.IsUnknown === 'true' || value?.IsUnknown === true) ? customStylesWithOutColor : victimTypeStatus ? Requiredcolour : ''}
                                                    isDisabled={value?.IsUnknown === 'true' || value?.IsUnknown === true ? true : false}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-1 mt-3 text-right" sstyle={{ marginLeft: "-14px" }}>
                                            <span data-toggle="modal" onClick={() => { setOpenPage('Resident') }} data-target="#ListModel" className='new-link px-0'>
                                                Resident{errors.ResidentError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ResidentError}</p>
                                                ) : null}
                                            </span>
                                        </div>
                                        <div className="col-md-5 mt-2 flex-grow-1 mt-2"  >
                                            <Select
                                                name="ResidentID"

                                                value={residentIDDrp?.filter((obj) => obj.value === value?.ResidentID) || null}
                                                options={residentIDDrp}
                                                onChange={(e) => ChangeDropDownResident(e, 'ResidentID')}
                                                isClearable
                                                placeholder="Select..."
                                                menuPlacement="bottom"
                                                styles={victimTypeStatus ? Requiredcolour : ''}
                                            />
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </>
                }
                {/* Alert Master */}
                <div className=' mb-1 row'>
                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                        <label htmlFor="" className='label-name '>
                            Role {errors.RoleError !== 'true' && nameTypeCode !== 'B' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RoleError}</p>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-3 col-md-5 col-lg-5  mt-1">
                        <SelectBox
                            options={ReasonCodeRoleArr ? ReasonCodeRoleArr : []}
                            styles={isSocietyName ? 'readonlyColor' : Requiredcolour}
                            menuPlacement="bottom"
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={true}
                            isClearable={false}

                            allowSelectAll={false}
                            value={multiSelectedReason?.optionSelected}
                            components={{ MultiValue }}

                            onChange={(selectedOptions, actionMeta) => {
                                const removedOption = actionMeta.removedValue;
                                const isRemovingVictim = removedOption?.value === 1;
                                const action = actionMeta.action;
                                if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && arrestCount > 0
                                ) { return; }
                                if (actionMeta.action === 'remove-value' && isRemovingVictim && value.checkVictem === 1 && nameID) {
                                    return;
                                }
                                if (actionMeta.action === 'remove-value' && isRemovingVictim && value.checkVictem !== 1) {
                                    setMultiSelected({ optionSelected: [] });
                                    setValue(prev => ({ ...prev, NameReasonCodeID: null }));
                                }
                                onChangeReaonsRole(selectedOptions, 'Role');
                            }}

                            isDisabled={isSocietyName}
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='label-name '>
                            Reason Code
                            {errors.NameReasonCodeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.NameReasonCodeIDError}</p>
                            ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-5 mt-1 mb-1" >
                        <SelectBox
                            styles={isSocietyName ? 'readonlyColor' : MstPage === "MST-Name-Dash" ? colourStylesMasterReason : Requiredcolour}

                            options={reasonIdDrp ? getFiltredReasonCode(reasonIdDrp) : []}
                            isDisabled={isSocietyName ? true : false}
                            menuPlacement="bottom"
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={true}
                            isClearable={false}

                            allowSelectAll={false}
                            value={multiSelected.optionSelected}

                            components={{ MultiValue }}
                            onChange={(selectedOptions, actionMeta) => {
                                const victimLabels = [
                                    "Victim", "Business Is A Victim", "Domestic Victim", "Individual Is A Victim",
                                    "Individual Victim", "Other Is A Victim", "Restraint Victim", "Society Is A Victim"
                                ];

                                const removedOption = actionMeta.removedValue;
                                const action = actionMeta.action;
                                if (
                                    (action === 'remove-value' || action === 'pop-value') &&
                                    (removedOption?.reasonCode === 'ADAR' || removedOption?.reasonCode === 'JVA') &&
                                    arrestCount > 0
                                ) {
                                    return;
                                }
                                if (action === 'remove-value' && removedOption) {
                                    const isVictim = victimLabels.includes(removedOption.label);
                                    const currentVictimCount = multiSelected.optionSelected.filter(opt => victimLabels.includes(opt.label)).length;
                                    if (nameID && isVictim && currentVictimCount <= 1) {
                                        return;
                                    }
                                }
                                if (value.checkVictem === 1 || (value.checkVictem === 0 && value.checkOffender === 1) || value.checkOffender === 0) {
                                    OnChangeSelectedReason(selectedOptions, 'NameReasonCodeID');
                                }
                            }}

                        />
                    </div>
                    {
                        roleStatus ?
                            <>
                                <div className="col-3 col-md-3 col-lg-1 mt-3">
                                    <label htmlFor="" className='label-name '>
                                        Victim Type
                                        {errors.VictimTypeError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.VictimTypeError}</p>
                                        ) : null}</label>

                                </div>
                                <div className="col-3 col-md-3 col-lg-2  mt-2" >
                                    <Select
                                        name='VictimTypeID'
                                        value={victimTypeDrp?.filter((obj) => obj.value === value?.VictimTypeID)}
                                        isClearable

                                        options={victimTypeDrp}
                                        onChange={(e) => { ChangeDropDownRole(e, 'VictimTypeID'); }}
                                        placeholder="Select.."
                                        styles={!isSocietyName && roleStatus ? Requiredcolour : ''}

                                        isDisabled={isSocietyName || (masterNameID && MstPage === "MST-Name-Dash") || (nameID)}

                                    />
                                </div>
                            </>
                            :
                            <></>
                    }


                    <div className="col-lg-5 " >
                        <div className='row' style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'nowrap' }}>

                            {isMissing && (
                                <div
                                    className="col-12 col-md-4"
                                    style={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        color: 'red', border: '1px solid red', backgroundColor: '#fbecec',
                                        borderRadius: '4px', padding: '4px 8px', margin: '0 auto',
                                        cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                                        width: 'fit-content', height: 'fit-content',

                                    }}
                                    onClick={(e) => { navigate(`/Missing-Home?IncId=${stringToBase64(mainIncidentID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(nameID)}&MasterNameID=${stringToBase64(masterNameID)}&NameStatus=${true}`) }}
                                >
                                    Missing Person
                                </div>
                            )}
                            {isAdultArrest && (
                                <div
                                    className="col-12 col-md-4"
                                    style={{
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        color: 'red', border: '1px solid red', backgroundColor: '#fbecec',
                                        borderRadius: '4px', padding: '4px 8px', margin: '0 auto',
                                        cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                                        width: 'fit-content', height: 'fit-content',

                                    }}

                                    onClick={(e) => { navigate(`/Arrest-Home?IncId=${stringToBase64(mainIncidentID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(nameID)}&MasterNameID=${stringToBase64(masterNameID)}&NameStatus=${true}`) }}
                                >
                                    Adult Arrest
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-12 ">
                        {
                            nameTypeCode === 'I' ?
                                <>
                                    <div className='row'>
                                        <div className="col-2 col-md-2 col-lg-1 mt-4">
                                            <Link to={'/ListManagement?page=Injury%20Type&call=/Name-Home'} className='new-link text-nowrap ml-1'>
                                                Injury Type
                                                {errors?.InjuryTypeError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors?.InjuryTypeError}</p>
                                                ) : null}
                                            </Link>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-5  mt-2" >
                                            {nibrsFieldError?.InjuryType && showInjuryTypeError && (
                                                <div className="nibrs-tooltip-error" style={{ left: '-80px' }}>
                                                    <div className="tooltip-arrow"></div>
                                                    <div className="tooltip-content">
                                                        <span className="text-danger">⚠️ {nibrsFieldError.InjuryTypeError || ''}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <Select
                                                name='VictimInjuryID'
                                                styles={
                                                    loginAgencyState === 'TX' ?
                                                        victimCode === 'L' && nibrsCodeArray?.includes('120') ? customStylesWithOutColor1
                                                            :
                                                            isInjurryRequired ? filterArray(victimInjuryID, 'label')?.length > 0 ? nibrsSuccessStyles : nibrsErrorMultiSelectStyles
                                                                :
                                                                customStylesWithOutColor1
                                                        :
                                                        customStylesWithOutColor1
                                                }
                                                isClearable={false}
                                                options={injuryTypeDrp}
                                                closeMenuOnSelect={false}
                                                placeholder="Select.."
                                                ref={SelectedValue}
                                                components={{ MultiValue, }}
                                                onChange={(e) => { InjuryTypeOnChange(e); setStatesChangeStatus(true); }}
                                                className="basic-multi-select"
                                                isMulti
                                                menuPlacement='top'
                                                value={filterArray(victimInjuryID, 'label')}
                                            />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-1 mt-4">
                                            <span data-toggle="modal" onClick={() => { setOpenPage('Assault Type') }} data-target="#ListModel" className='new-link'>
                                                Assault Type
                                                {/* {
                                                    loginAgencyState === 'TX' ?
                                                       <>
                                                        </>
                                                        :
                                                        <>
                                                        </>
                                                } */}
                                                {errors.AssaultTypeIDError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AssaultTypeIDError}</span>
                                                ) : null}
                                            </span>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-5  mt-2" >
                                            {nibrsFieldError?.AssaultType && showAssaultTypeError && (
                                                <div className="nibrs-tooltip-error" style={{ left: '-80px' }}>
                                                    <div className="tooltip-arrow"></div>
                                                    <div className="tooltip-content">
                                                        <span className="text-danger">⚠️ {nibrsFieldError.AssaultTypeError || ''}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <Select
                                                className="basic-multi-select"
                                                styles={
                                                    loginAgencyState === 'TX' ?

                                                        nibrsCodeArray?.includes('09A') || nibrsCodeArray?.includes('09C') || nibrsCodeArray?.includes('13A') ? nibrsErrorMultiSelectStyles : customStylesWithOutColor1
                                                        :
                                                        customStylesWithOutColor1
                                                }
                                                name='AssaultID'
                                                options={assaultDrp}
                                                isClearable={false}
                                                isMulti
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={true}
                                                components={{ MultiValue, }}
                                                onChange={(e) => { assaultOnChange(e); setStatesChangeStatus(true); }}
                                                value={filterArray(assaultID, 'label')}
                                            />
                                        </div>

                                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                                            <span onClick={() => { setOpenPage('Justifiable Homicide') }} data-toggle="modal" data-target="#ListModel" className='new-link'>
                                                Justifiable Homicide
                                                {errors.JusifiableHomicideError !== 'true' ? (
                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.JusifiableHomicideError}</span>
                                                ) : null}
                                            </span>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-5  mt-2" >
                                            {nibrsFieldError?.JustHomicide && showJustifyHomicideError && (
                                                <div className="nibrs-tooltip-error" style={{ left: '-80px' }}>
                                                    <div className="tooltip-arrow"></div>

                                                    <div className="tooltip-content">
                                                        <span className="text-danger">⚠️ {nibrsFieldError.JustHomicideError || ''}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <Select
                                                name='JustifiableHomicideID'
                                                value={justifiyID}
                                                isClearable={false}
                                                options={justifiableHomiDrp}
                                                closeMenuOnSelect={false}
                                                placeholder="Select.."
                                                ref={SelectedValue}
                                                components={{ MultiValue, }}
                                                onChange={(e) => JustifuableOnChange(e)}
                                                className="basic-multi-select"
                                                isMulti
                                                styles={assaultID20Or21 ? nibrsErrorMultiSelectStyles : customStylesWithOutColor1}
                                            />
                                        </div>

                                        {
                                            victimCode === 'L' && <>
                                                <div className="col-2 col-md-2 col-lg-1 mt-4">
                                                    <span
                                                        data-toggle="modal"
                                                        onClick={() => { setOpenPage('Victim Call Type') }}
                                                        data-target="#ListModel"
                                                        className='new-link'
                                                    >
                                                        Call Type
                                                        {errors.CallTypeIDError !== 'true' ? (<p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CallTypeIDError}</p>
                                                        ) : null}
                                                    </span>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5  mt-2" >
                                                {nibrsFieldError?.CallType && showCallTypeError && (
                                                <div className="nibrs-tooltip-error" style={{ left: '-80px' }}>
                                                    <div className="tooltip-arrow"></div>

                                                    <div className="tooltip-content">
                                                        <span className="text-danger">⚠️ {nibrsFieldError.CallTypeError || ''}</span>
                                                    </div>
                                                </div>
                                            )}
                                                    <Select
                                                        name='CallTypeID'
                                                        value={callTypeDrp?.filter((obj) => obj.value === value?.CallTypeID)}
                                                        styles={
                                                            loginAgencyState === 'TX'
                                                                ?
                                                                victimCode === 'L' ? ColorStyle : customStylesWithOutColor
                                                                :
                                                                customStylesWithOutColor
                                                        }
                                                        isDisabled={
                                                            loginAgencyState === 'TX' ?
                                                                victimCode === 'L' ? false : true
                                                                :
                                                                false
                                                        }
                                                        isClearable
                                                        options={callTypeDrp}
                                                        onChange={(e) => { ChangeDropDown(e, 'CallTypeID'); }}
                                                        placeholder="Select.."
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-4">
                                                    <span
                                                        data-toggle="modal"
                                                        data-target="#ListModel"
                                                        className='new-link'
                                                        onClick={() => { setOpenPage('Victim Officer Assignment Type') }}
                                                    >
                                                        Assignment Type
                                                        {errors.AssignmentTypeIDError !== 'true' ? (<p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AssignmentTypeIDError}</p>
                                                        ) : null}
                                                    </span>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5  mt-2" >
                                                    {nibrsFieldError?.AssignmentType && showAssignmentTypeError && (
                                                        <div className="nibrs-tooltip-error" style={{ left: '-80px' }}>
                                                            <div className="tooltip-arrow"></div>

                                                            <div className="tooltip-content">
                                                                <span className="text-danger">⚠️ {nibrsFieldError.AssignmentTypeError || ''}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <Select
                                                        name='AssignmentTypeID'
                                                        value={assignmentTypeDrp?.filter((obj) => obj.value === value?.AssignmentTypeID)}
                                                        styles={
                                                            loginAgencyState === 'TX' ?
                                                                victimCode === 'L' ? ColorStyle : customStylesWithOutColor
                                                                :
                                                                customStylesWithOutColor
                                                        }
                                                        isDisabled={
                                                            loginAgencyState === 'TX' ?
                                                                victimCode === 'L' ? false : true
                                                                :
                                                                false
                                                        }
                                                        isClearable
                                                        options={assignmentTypeDrp}
                                                        onChange={(e) => { ChangeDropDown(e, 'AssignmentTypeID'); }}
                                                        placeholder="Select.."
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-3" >
                                                    <div className="d-flex align-items-center justify-content-end " style={{ gap: "6px" }}> {/* Flex wrapper */}
                                                        <label htmlFor="" className="new-label mb-0">
                                                            ORI
                                                        </label>
                                                        <span
                                                            className="hovertext"
                                                            data-hover="ORI : Enter a 9 digit code starting with first two capital characters and ending with 00"
                                                        >
                                                            <i className="fa fa-exclamation-circle icon-blue-bg" style={{ color: 'blue' }}></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5  mt-2 ">
                                                    <input
                                                        type="text"
                                                        className={`form-control ${victimCode === 'L' ? '' : 'readonlyColor'}`}
                                                        name="ORI"
                                                        value={value?.ORI}
                                                        disabled={victimCode === 'L' ? false : true}
                                                        onChange={handleChangeVictim}
                                                        maxLength={9}
                                                        required
                                                        autoComplete="off"
                                                    />
                                                    <div>
                                                        {errors.ORITypeErrors !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '13px', margin: '10px', padding: '0px', textAlign: "left", display: "block" }}>{errors.ORITypeErrors}</p>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </>
                                :
                                <></>
                        }
                        {
                            DeNameID ?
                                (
                                    <div className="row  align-items-center mt-2">
                                        <div className="col-2 col-md-2 col-lg-1 ">
                                            <label htmlFor="" className='label-name '>Offense </label>
                                        </div>
                                        <div className="col-8 col-md-8 col-lg-8 mt-2">
                                            {nibrsFieldError?.Offense && showOffenseTypeError && (
                                                <div className="nibrs-tooltip-error" style={{ left: '-80px' }}>
                                                    <div className="tooltip-arrow"></div>
                                                    <div className="tooltip-content">
                                                        <span className="text-danger">⚠️ {nibrsFieldError.OffenseError || ''}</span>
                                                    </div>
                                                </div>
                                            )}
                                            <SelectBox
                                                name='OffenseID'
                                                isClearable
                                                options={offenseDrp}
                                                value={offensemultiSelected.OffenseID}
                                                closeMenuOnSelect={false}
                                                components={{ Option: CheckboxOption }}
                                                placeholder="Select.."
                                                onChange={(e) => offenseMulitiSelectOnchange(e)}
                                                ref={SelectedValue}
                                                className="basic-multi-select select-box_offence"
                                                isMulti
                                                styles={nibrsFieldError?.Offense && showOffenseTypeError ? customStyleOffenseNibrsErrorColor : customStyleOffenseWithoutColor}
                                            />
                                        </div>
                                    </div>
                                )
                                :
                                null
                        }
                        {/* RelationShip */}
                        {
                            nameTypeCode === "I" && DeNameID ? (
                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                    <div>
                                        <fieldset className='p-0'>
                                            <legend>
                                                Victim to Offender Relationship
                                            </legend>
                                            <div className="row mb-2 mt-2">
                                                <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                    <label htmlFor="" className='label-name'>
                                                        Offender

                                                        {errors1?.VictimNameIDErrors !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors1?.VictimNameIDErrors}</p>
                                                        ) : null}
                                                    </label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-5 mt-2">
                                                    <Select
                                                        name='OffenderNameID'
                                                        styles={
                                                            loginAgencyState === 'TX' ?
                                                                isCrimeAgainstPerson || has120RoberyOffense ? colourStyles1 : withOutColorStyle1
                                                                :
                                                                colourStyles1
                                                        }

                                                        isClearable
                                                        value={name?.filter((obj) => obj.value === value1.OffenderNameID)}
                                                        options={name}
                                                        onChange={(e) => { ChangeDropDown1(e, 'OffenderNameID'); }}
                                                        placeholder="Select.."
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1 mt-3">
                                                    <Link to={'/ListManagement?page=Relationship%20Type&call=/Name-Home'} className='new-link'>
                                                        Relationship
                                                        {loginAgencyState === 'TX' ? checkOffenderIsUnknown(relationTypeCode, selectedNameData, 'ToolTip') : <></>}
                                                        {errors1?.RelationshipTypeIDErrors !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors1?.RelationshipTypeIDErrors}</p>
                                                        ) : null}
                                                    </Link>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-2">
                                                    <Select
                                                        name='RelationshipTypeID'

                                                        styles={isCrimeAgainstPerson || has120RoberyOffense ? colourStyles1 : withOutColorStyle1}
                                                        isClearable
                                                        value={relationShipDrp?.filter((obj) => obj.value === value1.RelationshipTypeID)}
                                                        options={relationShipDrp}
                                                        onChange={(e) => { ChangeDropDown1(e, 'RelationshipTypeID'); }}
                                                        placeholder="Select.."
                                                    />
                                                </div>
                                                <div className="btn-box text-right col-lg-2 mt-2 mb-2">
                                                    {
                                                        isNibrsSummited ? (
                                                            <>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { setStatusFalse1(); setUpdateStatus(updateStatus + 1); }}>New</button>
                                                                {
                                                                    status && nibrsSubmittedVictim !== 1 ? (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-success mr-1"
                                                                            disabled={!statesChangeStatus}
                                                                            onClick={(e) => { check_Validation_Error1(); }}
                                                                        >
                                                                            Update
                                                                        </button>
                                                                    ) : !status ? (
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-sm btn-success mr-1"
                                                                            onClick={(e) => { check_Validation_Error1(); }}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                    ) : null
                                                                }
                                                            </>
                                                        )
                                                    }

                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            )
                                :
                                null
                        }
                        {
                            nameTypeCode === "I" && DeNameID ? (
                                <div className="row ">
                                    <div className="col-12 ">
                                        <div className="table-responsive">
                                            <DataTable
                                                dense
                                                columns={columns1}
                                                data={relationshipData}
                                                highlightOnHover
                                                customStyles={tableCustomStyles}
                                                onRowClicked={(row) => {
                                                    setClickedRow1(row);
                                                    set_Edit_Value1(row);
                                                }}
                                                fixedHeader
                                                persistTableHead
                                                fixedHeaderScrollHeight='80px'
                                                pagination
                                                paginationPerPage={'100'}
                                                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                conditionalRowStyles={conditionalRowStyless}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                                :
                                null
                        }
                        <div className="row">
                            <div className="col-12 col-md-12 col-lg-12 mb-2 mt-2"  >
                                <div className=" mt-1 text-md-right d-flex " style={{ justifyContent: "space-between" }} >
                                    {
                                        isNibrsSummited ? (
                                            <>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    data-toggle={"modal"}
                                                    data-target={"#NibrsErrorShowModal"}
                                                    className={`ml-3 ${nibrsValidateNameData?.length > 0 ? 'btn btn-sm mr-1' : 'btn btn-sm btn-success mr-1'}`}


                                                    onClick={() => { ValidateIncNames(mainIncidentID, IncNo) }}
                                                    style={{
                                                        backgroundColor: `${nibrsValidateNameData?.length > 0 ? nibrsValidateNameData?.length > 0 ? 'Red' : 'green' : ''}`,
                                                    }}
                                                >
                                                    Validate TIBRS
                                                </button>
                                                <div>
                                                    <button type="button" ref={crossButtonRef} className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }}>
                                                        New
                                                    </button>
                                                    {
                                                        (masterNameID && MstPage === "MST-Name-Dash") || (nameID) ? (
                                                            effectiveScreenPermission ?
                                                                effectiveScreenPermission[0]?.Changeok && nibrsSubmittedVictim !== 1 ?
                                                                    <>
                                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }} ref={saveButtonRef} disabled={nameSearchStatus || !statesChangeStatus}>Update</button>

                                                                    </>
                                                                    :
                                                                    <>
                                                                    </>
                                                                :
                                                                <>
                                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }} ref={saveButtonRef} disabled={nameSearchStatus || !statesChangeStatus}>Update</button>

                                                                </>
                                                        ) :
                                                            (
                                                                effectiveScreenPermission ?
                                                                    effectiveScreenPermission[0]?.AddOK ?
                                                                        <>
                                                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }}

                                                                                ref={saveButtonRef}>Save</button>

                                                                        </>
                                                                        :
                                                                        <>
                                                                        </>
                                                                    :
                                                                    <>
                                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }}

                                                                        >Save</button>
                                                                    </>
                                                            )
                                                    }
                                                </div>
                                            </>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`modal ${confirmDeleteVictim ? 'show' : ''}`} style={{ display: confirmDeleteVictim ? 'block' : 'none', background: "rgba(0,0,0, 0.5)", transition: '0.5s', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="box text-center py-5">
                                <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to save current record ?</h5>
                                <div className="btn-box mt-3">
                                    <button type="button" onClick={() => { deleteVictimRelation() }} className="btn btn-sm text-white" style={{ background: "#ef233c" }}>Delete</button>
                                    <button type="button" onClick={() => { setConfirmDeleteVictim(false) }} className="btn btn-sm btn-secondary ml-2">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12  modal-table "  >
                    {
                        MstPage != "MST-Name-Dash" &&
                        <DataTable
                            dense
                            columns={columns}

                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? nameFilterData : [] : nameFilterData}
                            selectableRowsHighlight
                            highlightOnHover
                            responsive
                            fixedHeader
                            pagination
                            paginationPerPage={'10'}
                            paginationRowsPerPageOptions={[10, 15, 20, 50]}

                            fixedHeaderScrollHeight='80px'
                            customStyles={tableCustomStyles}
                            conditionalRowStyles={conditionalRowStyles}
                            onRowClicked={(row) => {
                                setClickedRow(row);
                                set_Edit_Value(row);
                            }}
                            persistTableHead={true}
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        />
                    }
                </div>
                <ListModal {...{ openPage, setOpenPage }} />
                <ChangesModal func={check_Validation_Error} />
                <NirbsErrorShowModal
                    ErrorText={nibrsErrStr}
                    nibErrModalStatus={nibrsErrModalStatus}
                    setNibrsErrModalStatus={setNibrsErrModalStatus}

                />
                {
                    clickNibloder && (
                        <div className="loader-overlay">
                            <Loader />
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default MainVictims;

const Get_PhoneType_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.PhoneTypeID));
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
};

const Get_RelationType_Code = (data, dropDownData) => {

    const result = data?.map((sponsor) => (sponsor.RelationshipTypeID));
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
};