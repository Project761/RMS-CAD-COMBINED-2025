import React, { useContext, useEffect, useRef, useState } from 'react'
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, base64ToString, stringToBase64, getShowingWithOutTime, tableCustomStyles, nibrscolourStyles, Requiredcolour, } from '../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData, fetchPostDataNibrs } from '../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormatReasonCode, Comman_changeArrayFormat_With_Name, changeArray, fourColArray, fourColArrayReasonCode, offenseArray, sixColArray, threeColArray, threeColVictimOffenseArray } from '../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Email_Field, PhoneFieldNotReq, RequiredField, NameValidationCharacter, PhoneField, FaxField } from '../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident, } from '../../Utility/Personnel/Validation';
import { Comparision, SSN_Field, Heights, Comparisionweight, Comparision2 } from '../../PersonnelCom/Validation/PersonnelValidation';
import { get_Inc_ReportedDate, get_LocalStoreData, get_NameTypeData } from '../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_Masters_Name_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import SelectBox from '../../../Common/SelectBox';
import ChangesModal from '../../../Common/ChangesModal';
import ListModal from '../../Utility/ListManagementModel/ListModal';
import Loader from '../../../Common/Loader';
import NirbsErrorShowModal from '../../../Common/NirbsErrorShowModal';

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const MinOffender = ({ offenderClick = false, isNibrsSummited = false, ValidateProperty = () => { } }) => {

    const SelectedValue = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const nameTypeData = useSelector((state) => state.Agency.nameTypeData);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { get_Incident_Count, get_Name_Count, nameSearchStatus, setcountAppear, nibrsSubmittedOffender, setoffenceCountStatus, setnibrsSubmittedOffender, setAuditCount, setNameSearchStatus, setcountStatus, setChangesStatus, setNameSingleData, changesStatus, } = useContext(AgencyContext);


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
    const [nameData, setNameData] = useState([]);
    const [nameFilterData, setNameFilterData] = useState([]);
    const [isBusinessName, setIsBusinessName] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);
    const [editval, setEditval] = useState([]);
    //Datepicker
    const [dobDate, setDobDate] = useState();
    const [yearsVal, setYearsVal] = useState();
    const [juvinile, setJuvinile] = useState();
    const [saveValue, setsaveValue] = useState(false);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [ageUnitDrpData, setAgeUnitDrpData] = useState([]);
    const [suffixIdDrp, setSuffixIdDrp] = useState([]);
    const [verifyIdDrp, setVerifyIdDrp] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [phoneTypeIdDrp, setPhoneTypeIdDrp] = useState([]);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [nameTypeCode, setNameTypeCode] = useState();
    const [businessTypeDrp, setBusinessTypeDrp] = useState([]);
    const [phoneTypeCode, setPhoneTypeCode] = useState('');
    const [nameSearchValue, setNameSearchValue] = useState([]);
    const [isAdult, setIsAdult] = useState(false);
    const [IsOffender, setIsOffender] = useState(false);
    const [victimStatus, setVictimStatus] = useState(false);
    const [ownerNameData, setOwnerNameData] = useState([]);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [dlNumber, setDlNumber] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [called, setcalled] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const crossButtonRef = useRef(null);
    const [victimTypeDrp, setVictimTypeDrp] = useState([]);
    const [victimTypeStatus, setvictimTypeStatus] = useState(false);
    const [nameIDNumber, setNameIDNumber] = useState(null);
    const [roleStatus, setroleStatus] = useState(false);
    const [isSecondDropdownDisabled, setIsSecondDropdownDisabled] = useState(true);
    // Verify Location 
    const [modalStatus, setModalStatus] = useState(false);
    const [addVerifySingleData, setAddVerifySingleData] = useState([]);
    const [locationStatus, setLocationStatus] = useState(false);
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [masterNameID, setMasterNameID] = useState();
    const [nameID, setNameID] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState(1);
    const [possessionID, setPossessionID] = useState('');
    const [uploadImgFiles, setuploadImgFiles] = useState([]);
    const [onSelectLocation, setOnSelectLocation] = useState(true);
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [isAdultArrest, setIsAdultArrest] = useState(false);
    const [isMissing, setisMissing] = useState(false);
    const [isVictim, setIsVictim] = useState(false);
    const [residentIDDrp, setResidentIDDrp] = useState([]);
    const [baseDate, setBaseDate] = useState('');
    const [oriNumber, setOriNumber] = useState('');

    // nibrs 
    const [nibrsValidateNameData, setnibrsValidateNameData] = useState([]);
    const [nibrsErrStr, setNibrsErrStr] = useState('');
    const [clickNibloder, setclickNibLoder] = useState(false);
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [showOffenderRelationError, setShowOffenderRelationError] = useState(false);
    const [relationShipError, setRelationShipError] = useState({});
    const [arrestCount, setarrestCount] = useState('');

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    });
    const [multiSelectedReason, setMultiSelectedReason] = useState({
        optionSelected: null
    });

    // ---------------------offence-----------------------------
    const [offenseDrp, setOffenseDrp] = useState();
    const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
    const [multiSelected1, setMultiSelected1] = useState({
        optionSelected: null
    })

    const [value, setValue] = useState({
        'NameIDNumber': 'Auto Generated', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '', 'AgeUnitID': '',
        'IsJuvenile': '', 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '',
        'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'DateOfBirth': '', 'CertifiedDtTm': '', 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'NameID': '',
        'ArrestID': "", 'WarrantID': "", 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0, 'VictimCode': '', 'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': '', 'NameLocationID': '',
        'DLNumber': "", 'DLStateID': '', 'IsUnknown': false, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, 'Role': '', 'ResidentID': '', 'IsInjury': '',
        'VictimTypeID': ''
    })

    const [errors, setErrors] = useState({
        'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true',
        'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'DLError': 'true', 'SexIDError': '', 'AddressError': 'true', 'CrimeLocationError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));
            setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null); setOriNumber(localStoreData?.ORI);
        }
    }, [localStoreData]);

    useEffect(() => {
        setMasterNameID(value.MasterNameID);
    }, [value.MasterNameID])

    useEffect(() => {
        if (DeNameID || DeMasterNameID) {
            get_Name_Count(DeNameID, DeMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
        }
    }, [DeNameID, DeMasterNameID])

    useEffect(() => {
        if (IncID) {
            setMainIncidentID(IncID); dispatch(get_Inc_ReportedDate(IncID))
        }
        else { Reset(); }
    }, [IncID, DeNameID]);

    useEffect(() => {
        const currentNameTypeID = editval[0]?.NameTypeID;
        if (currentNameTypeID !== undefined && currentNameTypeID !== null) {
            get_Victim_Type_Data(loginAgencyID, currentNameTypeID);
        }
    }, [editval[0]?.NameTypeID]);

    useEffect(() => {
        if (nameID) {
            get_OffenseName_Data(nameID);
        }
    }, [nameID])

    useEffect(() => {
        if (IncID || DeNameID) {
            setNameID(DeNameID); setMainIncidentID(IncID);
            get_Offense_DropDown(IncID, DeNameID);

            get_Data_Name_Drp(IncID, DeNameID);

            get_Incident_Count(IncID, loginPinID);
        }
        else if (DeMasterNameID) {
            setMasterNameID(DeMasterNameID)
        }
    }, [DeNameID, loginPinID, DeMasterNameID, IncID]);

    const get_Data_Name = (NameID) => {
        const val = { 'IncidentID': NameID || 0, 'IsOffenderName': true, }
        fetchPostData('MasterName/GetData_VictimOffender', val).then((res) => {
            if (res) {
                setNameData(res); setNameFilterData(res)
            } else {
                setNameData([]); setNameFilterData([])
            }
        })
    }

    useEffect(() => {
        if (IncID) {
            setMainIncidentID(IncID); get_Arrestee_Drp_Data(IncID); get_Data_Name(IncID);
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
        }
        else { Reset() }
        if (DeNameID || DeMasterNameID || MstPage === "MST-Name-Dash") {
            setNameID(DeNameID); GetSingleData(DeNameID, DeMasterNameID); setMasterNameID(DeMasterNameID)
        }
        else { Reset() }
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
                setValue({ ...value, ['NameTypeID']: Id[0]?.value, }); setNameTypeCode(Id[0].id); setIsBusinessName(false);
            }
        }
    }, [nameTypeData, mainIncidentID])

    const check_Validation_Error = (e) => {
        const { LastName, FirstName, MiddleName, NameTypeID, NameReasonCodeID, SSN, DLStateID, DLNumber, Contact, HeightFrom, HeightTo, WeightFrom, WeightTo, AgeFrom, AgeTo, SexID, RaceID, DateOfBirth, IsUnknown } = value;
        if (isAdult || IsOffender || victimTypeStatus) {
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
            setErrors(prevValues => {
                return {
                    ...prevValues,
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
            setErrors(prevValues => {
                return {
                    ...prevValues,
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
                setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'error' } })
            }

            // Phone Validation
        }
    };

    // Check All Field Format is True Then Submit   
    const { LastNameError, OwnerPhoneNumberError, CrimeLocationError, AgeFromError, EthnicityErrorr, ResidentError, VictimTypeError, RoleError, OwnerFaxNumberError, FirstNameError, MiddleNameError, NameTypeIDError, CertifiedByIDError, NameReasonCodeIDError, ContactError, DLError, SSN, WeightError, HeightError, AgeError, DateOfBirthError, RaceIDError, SexIDError, } = errors

    useEffect(() => {
        if (nameTypeCode === 'B') {
            if (LastNameError === 'true' && FirstNameError === 'true' && CrimeLocationError === 'true' && RoleError === 'true' && CrimeLocationError === 'true' && OwnerPhoneNumberError === 'true' && OwnerFaxNumberError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && DLError === 'true' && SSN === 'true' && HeightError === 'true' && WeightError === 'true' && AgeError === 'true') {
                if (MstPage === "MST-Name-Dash") {
                    if (masterNameID) { Update_Name(); }
                    else { InsertName(); }
                }
                else {
                    if (nameID && masterNameID) { Update_Name(); }
                    else { InsertName(); }
                }
            }
        } else if (isAdult || IsOffender || victimTypeStatus) {
            if (LastNameError === 'true' && OwnerPhoneNumberError === 'true' && CrimeLocationError === 'true' && VictimTypeError === 'true' && RoleError === 'true' && ResidentError === 'true' && EthnicityErrorr === 'true' && AgeFromError === 'true' && FirstNameError === 'true' && OwnerFaxNumberError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && DLError === 'true' && SSN === 'true' && HeightError === 'true' && WeightError === 'true' && AgeError === 'true' && DateOfBirthError === 'true' && RaceIDError === 'true' && SexIDError === 'true') {
                if (MstPage === "MST-Name-Dash") {
                    if (masterNameID) { Update_Name(); }
                    else { InsertName(); }
                }
                else {
                    if (nameID && masterNameID) { Update_Name(); }
                    else { InsertName(); }
                }
            }
        } else if (LastNameError === 'true' && OwnerPhoneNumberError === 'true' && CrimeLocationError === 'true' && VictimTypeError === 'true' && RoleError === 'true' && FirstNameError === 'true' && OwnerFaxNumberError === 'true' && MiddleNameError === 'true' && NameTypeIDError === 'true' && NameReasonCodeIDError === 'true' && ContactError === 'true' && DLError === 'true' && SSN === 'true' && HeightError === 'true' && WeightError === 'true' && AgeError === 'true') {
            if (MstPage === "MST-Name-Dash") {
                if (masterNameID) { Update_Name(); }
                else { InsertName(); }
            }
            else {
                if (nameID && masterNameID) { Update_Name(); }
                else { InsertName(); }
            }
        }
    }, [LastNameError, FirstNameError, OwnerPhoneNumberError, EthnicityErrorr, MiddleNameError, ResidentError, VictimTypeError, RoleError, AgeFromError, CrimeLocationError, OwnerFaxNumberError, DLError, NameTypeIDError, NameReasonCodeIDError, ContactError, SSN, WeightError, HeightError, AgeError, DateOfBirthError, RaceIDError, SexIDError])

    useEffect(() => {
        if (loginAgencyID) {
            if (nameTypeData.length === 0 || MstPage === "MST-Name-Dash") { dispatch(get_NameTypeData(loginAgencyID)); }
            get_Name_Drp_Data(loginAgencyID)
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (loginAgencyID || IncID) dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
        get_Data_RelationShip_Drp(loginAgencyID);
    }, [loginAgencyID, IncID]);

    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                setAgeUnitDrpData(threeColArray(data[0]?.AgeUnit, 'AgeUnitID', 'Description', 'AgeUnitCode'));
                setEthinicityDrpData(Comman_changeArrayFormat(data[0]?.Ethnicity, 'EthnicityID', 'Description'));
                setSexIdDrp(Comman_changeArrayFormat(data[0]?.Gender, 'SexCodeID', 'Description'));
                setVerifyIdDrp(Comman_changeArrayFormat(data[0]?.HowVerify, 'VerifyID', 'Description'));
                setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
                setSuffixIdDrp(Comman_changeArrayFormat(data[0]?.Suffix, 'SuffixID', 'Description'));
                setPhoneTypeIdDrp(threeColArray(data[0]?.ContactType, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))

            } else {
                setAgeUnitDrpData([]); setEthinicityDrpData([]); setSexIdDrp([]); setVerifyIdDrp([]); setRaceIdDrp([]); setSuffixIdDrp([]);
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
                setOwnerNameData([]);
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
                }
                else { setIsAdultArrest(false); }
                if (data.Victim === 0 && isVictim?.length > 0) { setIsVictim(true); }
                else { setIsVictim(false); }
                if (data.MissingPerson === 0 && isMissingPerson?.length > 0) { setisMissing(true); }
                else { setisMissing(false); }
            }
        })
    }

    const GetSingleData = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        const val2 = { 'MasterNameID': masterNameID, 'NameID': 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('MasterName/GetSingleData_MasterName', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {
                setEditval(res); setNameSingleData(res);
            } else { setEditval([]); setNameSingleData([]) }
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
        if (nameID || masterNameID) {
            if (editval.length > 0) {
                setAuditCount(true);
                get_Arrestee_Drp_Data(mainIncidentID)
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
                    'MasterNameID': editval[0]?.MasterNameID, 'NameID': editval[0]?.NameID, 'IsUnknown': editval[0]?.IsUnknown, 'NameIDNumber': editval[0]?.NameIDNumber ? editval[0]?.NameIDNumber : 'Auto Generated',
                    'checkVictem': editval[0]?.NewVictimID ? editval[0]?.NewVictimID[0]?.NewVictimID : "", 'checkOffender': editval[0]?.NewOffenderID ? editval[0]?.NewOffenderID[0]?.NewOffenderID : "",
                    'checkArrest': editval[0]?.ArrestID ? editval[0]?.ArrestID[0]?.ArrestID : "",
                    // DropDown
                    'NameTypeID': editval[0]?.NameTypeID, 'BusinessTypeID': editval[0]?.BusinessTypeID, 'SuffixID': editval[0]?.SuffixID, 'VerifyID': editval[0]?.DLVerifyID,
                    'SexID': editval[0]?.SexID, 'RaceID': editval[0]?.RaceID, 'PhoneTypeID': editval[0]?.PhoneTypeID, 'EthnicityID': editval[0]?.EthnicityID, 'AgeUnitID': editval[0]?.AgeUnitID,
                    'NameReasonCodeID': editval[0]?.ReasonCode ? changeArray(editval[0]?.ReasonCode, 'NameReasonCodeID') : '', 'CertifiedByID': editval[0]?.CertifiedByID,
                    'Role': editval[0]?.Role,
                    // checkbox
                    'IsJuvenile': editval[0]?.IsJuvenile, 'IsVerify': editval[0]?.IsVerify, 'IsUnListedPhNo': editval[0]?.IsUnListedPhNo,
                    //textbox
                    'OwnerFaxNumber': editval[0]?.OwnerFaxNumber, 'OwnerPhoneNumber': editval[0]?.OwnerPhoneNumber, 'OwnerNameID': editval[0]?.OwnerNameID,
                    'LastName': editval[0]?.LastName ? editval[0]?.LastName?.trim() : editval[0]?.LastName, 'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName,
                    'SSN': editval[0]?.SSN, 'WeightFrom': editval[0]?.WeightFrom, 'WeightTo': editval[0]?.WeightTo,
                    'HeightFrom': editval[0]?.HeightFrom, 'HeightTo': editval[0]?.HeightTo, 'Address': editval[0]?.Address,
                    'Contact': editval[0]?.Contact,

                    'AgeFrom': editval[0]?.AgeFrom === null ? null : editval[0]?.AgeFrom ?? '0',

                    'AgeTo': editval[0]?.AgeTo ? editval[0]?.AgeTo : '',
                    //Datepicker
                    'DateOfBirth': editval[0]?.DateOfBirth ? getShowingWithOutTime(editval[0]?.DateOfBirth) : '', 'CertifiedDtTm': editval[0]?.CertifiedDtTm ? getShowingDateText(editval[0]?.CertifiedDtTm) : null,
                    'Years': editval[0]?.Years, 'NameLocationID': editval[0]?.NameLocationID, 'ModifiedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
                    'DLNumber': editval[0]?.DLNumber, 'DLStateID': editval[0]?.DLStateID, 'VictimCode': editval[0]?.VictimCode, 'ResidentID': editval[0]?.ResidentID,
                    'IsInjury': editval[0]?.IsInjury, 'VictimTypeID': editval[0]?.VictimTypeID
                })

                if (editval[0]?.Role?.includes(1)) {
                    setroleStatus(true);
                } else {
                    setroleStatus(false);
                }

                setPossessionID(editval[0]?.OwnerNameID)
                setarrestCount(editval[0]?.ArrestCount);
                setnibrsSubmittedOffender(editval[0]?.IsNIBRSSummited);
                // ---------------------Name_Non_Verify_Add--------------
                GetReasonIdDrp(loginAgencyID, editval[0]?.NameTypeID, JSON.parse(editval[0]?.Role));
                setPhoneTypeCode(Get_PhoneType_Code(editval, phoneTypeIdDrp));
                setDobDate(editval[0]?.DateOfBirth ? new Date(editval[0]?.DateOfBirth) : '');
                setIsAdult(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Adult Arrest" || item.ReasonCode_Description === "Juvenile Arrest" }));
                setIsOffender(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Offender" }));
                setVictimStatus(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Victim" }));
                setvictimTypeStatus(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Victim" || item.ReasonCode_Description === "Business Is A Victim" || item.ReasonCode_Description === "Domestic Victim" || item.ReasonCode_Description === "Individual Is A Victim" || item.ReasonCode_Description === "Individual Victim" || item.ReasonCode_Description === "Other Is A Victim" || item.ReasonCode_Description === "Restraint Victim" || item.ReasonCode_Description === "Restraint Victim" }))

                //--------------get_Non_Verify_Add-------------------
                if (!editval[0]?.IsVerify && editval[0]?.NameLocationID) {
                    get_Add_Single_Data(editval[0]?.NameLocationID);
                }
                // NameTypeCode
                setNameTypeCode(editval[0]?.NameTypeCode);

                setIsBusinessName(editval[0]?.NameTypeCode === 'B' ? true : false)
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
                    'MasterNameID': '', 'NameID': '', 'NameIDNumber': 'Auto Generated',
                    // DropDown
                    'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'EthnicityID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'AgeUnitID': '', 'Role': '',
                    // checkbox

                    'IsVerify': true, 'IsUnListedPhNo': '',
                    //textbox
                    'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '',
                    //Datepicker
                    'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0,
                    'DLNumber': '', 'DLStateID': '', 'ResidentID': '',
                }); setPhoneTypeCode('')
            }
            const id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })

                setNameTypeCode(id[0].NameTypeCode);

                setIsBusinessName(false);
            }
            setMultiSelected({ optionSelected: [], }); setMultiSelectedReason({ optionSelected: [], });
        }
    }, [editval])

    const makeRoleArr = (ids) => {
        const arr = ReasonCodeRoleArr.filter(item => ids.includes(item.value));
        return ReasonCodeRoleArr.filter(item => ids.includes(item.value));
    }

    const LastFirstNameOnBlur = (e) => {
        if (!called) {
            if (e.target.name === 'LastName') {
                if (value?.LastName && value?.FirstName) {
                }
            } else if (e.target.name === 'FirstName') {
                if (value?.LastName && value?.FirstName) {
                }
            }
        }

    }

    const getNameSearch = async (loginAgencyID, NameTypeID, LastName, FirstName, MiddleName, DateOfBirth, SSN, HeightFrom, HeightTo, WeightFrom, WeightTo, EthnicityID, RaceID, SexID, PhoneTypeID, Contact, type) => {
        if (LastName || DateOfBirth || FirstName || MiddleName || SSN || SexID || HeightFrom || HeightTo || DateOfBirth || WeightFrom || WeightTo || EthnicityID || RaceID || PhoneTypeID || Contact || value.NameReasonCodeID || value.Address || value.AgeFrom || value.AgeTo || value.AgeUnitID || value.DLNumber || value.DLStateID || value.SuffixID) {
            setIsLoading(true);
            setChangesStatus(false);
            fetchPostData("MasterName/Search_Name", {
                "NameTypeID": NameTypeID, "LastName": LastName, "FirstName": FirstName ? FirstName : null, "MiddleName": MiddleName ? MiddleName : null, "SSN": SSN ? SSN : null, 'AgencyID': loginAgencyID ? loginAgencyID : null,
                NameIDNumber: "", 'ReasonCodeList': value.NameReasonCodeID ? JSON.stringify(value.NameReasonCodeID) : '', SuffixID: value.SuffixID, 'DateOfBirth': DateOfBirth, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, HairColorID: "", EyeColorID: "", 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, SMTTypeID: "", SMTLocationID: "", SMT_Description: "",
                IncidentNumber: "", IncidentNumberTo: "", ReportedDate: "", ReportedDateTo: "", 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'PhoneTypeID': PhoneTypeID, 'Contact': Contact, 'Address': value.Address ? value.Address : '', 'AgeFrom': value.AgeFrom ? value.AgeFrom : '', 'AgeTo': value.AgeTo ? value.AgeTo : '', 'AgeUnitID': value.AgeUnitID ? value.AgeUnitID : '',
                'DLNumber': value.DLNumber ? value.DLNumber : '',
                'DLStateID': value.DLStateID ? value.DLStateID : '',
                'MasterNameID': masterNameID,

            }).then((data) => {
                if (data.length > 0) {
                    setIsLoading(false);
                    const [{ MasterNameID, NameIDNumber }] = data;

                    setNameIDNumber(NameIDNumber);
                    setNameSearchValue(data); setNameSearchStatus(true)
                } else {
                    setNameSearchValue([]);
                    setIsLoading(false);
                    if (type) toastifyError('No Name Available');
                    setNameSearchStatus(false)
                }
            })
        } else {
            setNameSearchStatus(false);
            toastifyError('No data available');
        }
    }

    const set_Edit_Value = (row) => {
        if (row?.NameID || row?.MasterNameID) {
            Reset();
            // get nibrs error tool tip
            getNibrsErrorToolTip(row?.NameID, IncNo, mainIncidentID);
            // Relationship
            Get_Relationship_Data(row?.NameID);

            setStatesChangeStatus(false)
            GetSingleData(row?.NameID, row?.MasterNameID);
            navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
            get_Name_Count(row?.NameID, row?.MasterNameID, MstPage === "MST-Name-Dash" ? true : false);
            setNameID(row.NameID)
            setMasterNameID(row?.MasterNameID)
            setUpdateStatus(updateStatus + 1);
            setuploadImgFiles('');
            get_OffenseName_Data(row?.NameID);
            setErrors({
                ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
            })
        }
    }

    // const columns = [
    //     {
    //         name: 'MNI',
    //         selector: (row) => row.NameIDNumber,
    //         sortable: true
    //     },

    //     {
    //         name: 'Gender',
    //         selector: (row) => row.Gender,
    //         sortable: true
    //     },
    //     {
    //         name: 'DOB',
    //         selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ",
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
    //     {
    //         name: 'Reason Code',
    //         selector: (row) => row?.NameReasonCode || '',
    //         format: (row) => (
    //             <>{row?.NameReasonCode ? row?.NameReasonCode.substring(0, 50) : ''}{row?.NameReasonCode?.length > 40 ? '  . . .' : null} </>
    //         ),
    //         sortable: true
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
            name: 'Ethnicity', selector: (row) => row.Ethnicity, sortable: true
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

                setReasonIdDrp(Comman_changeArrayFormatReasonCode(data, 'NameReasonCodeID', 'ReasonCode', 'Description'));
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
                setLocationStatus(true);
                setMultiSelected({ optionSelected: [] });
                setMultiSelectedReason({
                    optionSelected: []
                });
                setPhoneTypeCode(''); setNameTypeCode(e.id); setChangesStatus(true);
                if (e.id === 'B') {
                    setIsBusinessName(true); GetBusinessTypeDrp(loginAgencyID);
                    get_Arrestee_Drp_Data(mainIncidentID);
                } else { setIsBusinessName(false); }


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
            }); setNameTypeCode(''); setIsBusinessName(false); setPhoneTypeCode('')
        }
    }

    const ChangeDropDown = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            if (name === 'DLStateID') {
                setDlNumber(true);
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
                setDlNumber(false); setPossessionID(''); setPossenSinglData([]);
            }
        }
    };

    const HandleChange = (e) => {
        setStatesChangeStatus(true);
        if (e.target.name === 'IsVerify' || e.target.name === 'IsUnListedPhNo' || e.target.name === 'IsUnknown') {
            if (e.target.name === 'IsVerify') {
                if (e.target.checked && addVerifySingleData.length > 0) {
                    setModalStatus(false);
                    setLocationStatus(true); setAddVerifySingleData([]);
                    setValue(pre => { return { ...pre, ['Address']: '', [e.target.name]: e.target.checked, } });

                } else {
                    setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                    setModalStatus(true);
                    setLocationStatus(false);
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
                checkOffender, checkArrest, NameLocationID, DLNumber, DLStateID, IsUnknown, Role, ResidentID, IsInjury, VictimTypeID
            } = value;

            const trimmedFirstName = FirstName?.trim();
            const trimmedMiddleName = MiddleName?.trim();

            const val = {
                'AgencyID': AgencyID,
                'NameIDNumber': IsJuvenile === editval[0]?.IsJuvenile ? NameIDNumber : 'Auto Generated',
                'NameTypeID': NameTypeID, 'EventType': EventType, 'IsMaster': IsMaster, 'IsUnListedPhNo': IsUnListedPhNo, 'IsVerify': IsVerify, 'PhoneTypeID': PhoneTypeID, 'OwnerFaxNumber': OwnerFaxNumber, 'IsCurrentPh': IsCurrentPh, 'BusinessTypeID': BusinessTypeID, 'SuffixID': SuffixID, 'DLVerifyID': VerifyID, 'SexID': SexID, 'RaceID': RaceID, 'PhoneTypeID': PhoneTypeID, 'NameReasonCodeID': NameReasonCodeID, 'CertifiedByID': CertifiedByID, 'EthnicityID': EthnicityID, 'AgeUnitID': AgeUnitID, 'IsJuvenile': IsJuvenile, 'LastName': LastName ? LastName : null, 'FirstName': trimmedFirstName ? trimmedFirstName : null, 'MiddleName': trimmedMiddleName ? trimmedMiddleName : null, 'SSN': SSN, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'Address': Address, 'Contact': Contact, 'OwnerNameID': OwnerNameID, 'OwnerPhoneNumber': OwnerPhoneNumber,
                'OwnerFaxNumber': OwnerFaxNumber, 'DateOfBirth': DateOfBirth, 'CertifiedDtTm': CertifiedDtTm, 'AgeFrom': AgeFrom, 'AgeTo': AgeTo, 'Years': Years, 'ModifiedByUserFK': ModifiedByUserFK, 'MasterNameID': MasterNameID, 'NameID': NameID, 'ArrestID': ArrestID, 'WarrantID': WarrantID, 'TicketID': TicketID, 'checkVictem': checkVictem, 'checkOffender': checkOffender, 'checkArrest': checkArrest, 'CreatedByUserFK': CreatedByUserFK, 'IncidentID': IncidentID, 'NameLocationID': NameLocationID, 'DLNumber': DLNumber, 'DLStateID': DLStateID, 'IsUnknown': IsUnknown, 'Role': Role, 'ResidentID': ResidentID, 'IsInjury': IsInjury, 'VictimTypeID': VictimTypeID
            };
            const fetchParams = MstPage === "MST-Name-Dash" ?
                { "MasterNameID": masterNameID, "SSN": SSN, 'NameID': NameID, 'AgencyID': AgencyID } :
                { "SSN": SSN, "IncidentID": mainIncidentID, "MasterNameID": masterNameID, 'NameID': NameID, 'AgencyID': AgencyID };

            fetchPostData("MasterName/GetData_EventNameExists", fetchParams).then((data) => {
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
                if (data) {
                    if (data[0]?.Total === 0) {
                        setsaveValue(true);
                        AddDeleteUpadate('MasterName/Insert_MasterName', val).then((res) => {
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
                                get_Data_Name(IncID);
                                setChangesStatus(false);
                                setLocationStatus(true);
                                setUpdateStatus(updateStatus + 1);
                                setIsAdult(false);
                                setIsOffender(false);
                                setVictimStatus(false);
                                get_Incident_Count(mainIncidentID, loginPinID);
                                setErrors({ ...errors, ['AddressError']: 'true', ['WeightError']: 'true', ['AgeError']: 'true', ['ContactError']: 'true', ['NameTypeIDError']: '', });
                                // Validate Offender
                                ValidateProperty(IncID);
                                getNibrs_Names_Error(IncID, IncNo);
                                getNibrsErrorToolTip(res?.NameID, IncNo, IncID);
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

    const Update_Name = () => {
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
                checkOffender, checkArrest, NameLocationID, DLNumber, DLStateID, IsUnknown, Role, ResidentID, IsInjury, VictimTypeID
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
            };
            fetchPostData("MasterName/GetData_EventNameExists", {
                "SSN": SSN, "IncidentID": MstPage === "MST-Name-Dash" ? '' : mainIncidentID, 'masterNameID': masterNameID, 'NameID': NameID, 'AgencyID': AgencyID
            }).then((data) => {
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
                if (data) {
                    if (data[0]?.Total === 0) {
                        AddDeleteUpadate('MasterName/Update_MasterName', val).then((res) => {
                            if (res.success) {
                                const parseData = JSON.parse(res.data);
                                toastifySuccess(parseData?.Table[0].Message);
                                if (MstPage === "MST-Name-Dash") {


                                    navigate(`/nibrs-Home?page=MST-Name-Dash&MasterNameID=${stringToBase64(MasterNameID)}&ModNo=${ModNo}&NameStatus=${true}`);

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
                                get_Name_Count(nameID, masterNameID, MstPage === "MST-Name-Dash" ? true : false);
                                get_Data_Name(IncID);
                                setStatesChangeStatus(true);
                                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });

                                // Validate Offender
                                ValidateProperty(IncID);
                                getNibrs_Names_Error(IncID, IncNo);
                                getNibrsErrorToolTip(nameID, IncNo, IncID);
                            } else {
                                setChangesStatus(false); toastifyError(res.Message); setErrors({ ...errors, ['NameTypeIDError']: '', });
                            }
                        })
                    } else {
                        toastifyError('SSN Already Exists');
                    }
                }
            })
        }
    }

    const Reset = () => {
        setroleStatus(false);
        setIsAdultArrest(false); setisMissing(false); setIsVictim(false); setvictimTypeStatus(false);
        setIsAdult(false); setIsOffender(false); setVictimStatus(false); setcalled(false);
        setDobDate(''); setStatesChangeStatus(false); setOnSelectLocation(true);
        setChangesStatus(false); setDlNumber(false);
        setErrors({
            ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true', "CrimeLocationError": '', 'AgeFromError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
        })
        setPhoneTypeCode(''); setMultiSelected({ optionSelected: [] }); setMultiSelectedReason({ optionSelected: [], });
        const Id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
        if (Id.length > 0) {
            setValue({
                ...value,
                ['NameTypeID']: Id[0]?.value, 'NameIDNumber': 'Auto Generated',
                // DropDown
                'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '', 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '',
                'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'MasterNameID': '', 'NameID': '', 'EthnicityID': '', 'DLNumber': "", 'DLStateID': '', 'IsUnknown': '', 'IsJuvenile': '', 'VictimCode': '', 'ResidentID': '', 'IsInjury': '', 'VictimTypeID': '',
            })
            setLocationStatus(true); setUpdateStatus(updateStatus + 1); setNameTypeCode(Id[0].id); setIsBusinessName(false); setcountAppear(false); setcountStatus(false);
        }
        setuploadImgFiles('');
        setShowOffenderRelationError(false);
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
        console.log(VictimStatus)
        let adult = data.some(function (item) { return item.label === "Adult Arrest" || item.label === "Offender" || item.label === "Juvenile Arrest" });
        if (!adult) { setErrors({ ...errors, ['DateOfBirthError']: 'true', ['RaceIDError']: 'true', ['SexIDError']: 'true', ['NameTypeIDError']: '', ['AgeFromError']: '', ['EthnicityErrorr']: '', ['ResidentError']: '' }); }
        setIsAdult(adult);
        setIsOffender(adult);
        setVictimStatus(VictimStatus);
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
            setValue({ ...value, [name]: finalValueList });
            setMultiSelected({ optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index) });
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
            setChangesStatus(true); setValue({ ...value, [name]: finalValueList }); setMultiSelected({ optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index) });
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
            setChangesStatus(true); setValue({ ...value, [name]: finalValueList })
            setMultiSelected({ optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index) });
        } else {
            let finalValueList = newArray?.map((item) => item.value);
            setChangesStatus(true); setValue({ ...value, [name]: finalValueList })
            setMultiSelected({ optionSelected: newArray });
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
                console.log('hello3')
                setValue({ ...value, ['AgeFrom']: ageObj?.age, ['AgeTo']: '', ['Years']: ageObj.age, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 5 })
            }
            else {
                if (ageObj.days > 0) {
                    console.log('hello')
                    setValue({ ...value, ['AgeFrom']: ageObj?.days, ['AgeTo']: '', ['Years']: ageObj.days, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 1, ['IsJuvenile']: true })
                } else {
                    console.log('hello2')
                    const diffInMs = maxAllowedDate - date; // difference in milliseconds
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

    // const colourStylesVictimCode = {
    //     control: (styles) => ({
    //         ...styles, backgroundColor: "rgb(255 202 194)",
    //         height: 20,
    //         minHeight: 33,
    //         fontSize: 14,
    //         margintop: 2,
    //         boxShadow: 0,
    //     }),
    // };

    // Custom Style
    // const colourStyles = {
    //     control: (styles) => ({
    //         ...styles, backgroundColor: "#fce9bf",
    //         height: 20,
    //         minHeight: 33,
    //         fontSize: 14,
    //         margintop: 2,
    //         boxShadow: 0,
    //     }),
    // };

    const withOutColorStyle = {
        control: (styles) => ({
            ...styles,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const colourStylesReason = {
        control: (styles) => ({
            ...styles, backgroundColor: "#FFE2A8",
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
            minHeight: 33,
        }),
    };

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

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef1.current.setOpen(false);
        }
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

    const onChangeReaonsRole = (e, name) => {
        setStatesChangeStatus(true);
        setChangesStatus(true);

        const newArray = [...(e || [])];
        const finalValueList = newArray.map(item => item.value);

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

    const StatusOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ];

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
                    filteredVictimType = formattedData; // fallback to all if not 1 or 2
                }

                setVictimTypeDrp(filteredVictimType);
            } else {
                setVictimTypeDrp([]);
            }
        });
    };



    useEffect(() => {
        if (offenderClick && mainIncidentID && IncNo) {
            getNibrs_Names_Error(mainIncidentID, IncNo, true);
        }
    }, [offenderClick, IncNo, mainIncidentID])

    // validate Incident
    const getNibrs_Names_Error = (incidentID, IncNo, isDefaultSelected = false) => {
        setclickNibLoder(true);
        const val = {
            'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'NameID': "", 'gIntAgencyID': loginAgencyID,
        }
        try {
            fetchPostDataNibrs('NIBRS/GetOffenderNIBRSError', val).then((data) => {
                if (data) {
                    const victimList = data?.Victim;
                    if (Array.isArray(victimList) && victimList.length > 0 && isDefaultSelected) {
                        const row = victimList[0];
                        getNibrsErrorToolTip(row?.NameEventID, IncNo, mainIncidentID);
                        // Relationship
                        Get_Relationship_Data(row?.NameEventID);
                        setStatesChangeStatus(false)
                        GetSingleData(row?.NameEventID, row?.MasterNameID);
                        navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameEventID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
                        get_Name_Count(row?.NameEventID, row?.MasterNameID, MstPage === "MST-Name-Dash" ? true : false);
                        setNameID(row.NameEventID)
                        setMasterNameID(row?.MasterNameID)
                        setUpdateStatus(updateStatus + 1);
                        setuploadImgFiles('');
                        get_OffenseName_Data(row?.NameEventID);
                        setErrors({
                            ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
                        })
                    };
                    setnibrsValidateNameData(data?.Offender);
                    setclickNibLoder(false);

                } else {
                    setnibrsValidateNameData([]);
                    setclickNibLoder(false);

                }
            })
        } catch (error) {
            console.log("🚀 ~ getNibrs_Names_Error ~ error:", error);
            setclickNibLoder(false);
        }
    }

    const getNibrsErrorToolTip = (nameId, IncNo, mainIncidentID) => {
        setShowOffenderRelationError(false);
        const val = {
            'NameID': nameId,
            'IncidentNumber': IncNo,
            'gIncidentID': mainIncidentID,
            'gIntAgencyID': loginAgencyID,
        }
        try {
            fetchPostDataNibrs('NIBRS/GetOffenderNIBRSError', val).then((data) => {

                if (data) {
                    const offenderError = data?.Offender && data?.Offender[0] ? data?.Offender[0] : [];
                    if (offenderError?.Relationship) {
                        setRelationShipError(offenderError);
                        setShowOffenderRelationError(true);

                    } else {
                        setRelationShipError([]);
                        setShowOffenderRelationError(false);

                    }
                } else {
                    setRelationShipError([]);
                    setShowOffenderRelationError(false);

                }
            })
        } catch (error) {
            console.log("🚀 ~ getNibrsErrorToolTip ~ error:", error)
            setRelationShipError([]);
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
            setLocationStatus(true);
            get_Name_Count('');
            setIsAdult(false);
            setIsOffender(false);
            setVictimStatus(false);
            setPossessionID(''); setPossenSinglData([]);
            setnibrsSubmittedOffender(0);
        }
    }

    //----------------------------------------------offence-------------------------------------
    const get_OffenseName_Data = (NameID) => {
        const val = { 'NameID': NameID, }
        fetchPostData('NameOffense/GetData_NameOffense', val).then((res) => {
            if (res) {
                setTypeOfSecurityEditVal(offenseArray(res, 'NameOffenseID', 'OffenseID', 'NameID', 'NameID', 'Offense_Description', 'PretendToBeID'));
                const hasPropertyCrime = res.some(item => item.IsCrimeAgains_Person === true);
                setIsCrimeAgainstPerson(hasPropertyCrime);
            } else {
                setIsCrimeAgainstPerson(false);
                setTypeOfSecurityEditVal([]);
            }
        }).catch((err) => {
            console.log("🚀 ~ getOffenseData ~ err:", err);
        })
    }

    useEffect(() => {
        if (typeOfSecurityEditVal) { setMultiSelected1(prevValues => { return { ...prevValues, ['OffenseID']: typeOfSecurityEditVal } }) }
    }, [typeOfSecurityEditVal])

    const get_Offense_DropDown = (IncID, nameID) => {
        const val = {
            'IncidentID': IncID, 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': nameID ? false : true
        }
        fetchPostData('NameOffense/GetData_InsertNameOffense', val).then((data) => {
            if (data) {
                setOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description'))
            } else {
                setOffenseDrp([])
            }
        }).catch((err) => {
            console.log("🚀 ~get_Offense_DropDown fetchpostdata error ~ err:", err);
        })
    }

    const offense = (multiSelected1) => {
        setMultiSelected1({
            ...multiSelected1,
            OffenseID: multiSelected1
        })
        const len = multiSelected1.length - 1
        if (multiSelected1?.length < typeOfSecurityEditVal?.length) {
            let missing = null;
            let i = typeOfSecurityEditVal.length;
            while (i) {
                missing = (~multiSelected1.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
            }
            DelSertBasicInfo1(missing.value, 'NameOffenseID', 'NameOffense/Delete_NameOffense')
        } else {
            InSertBasicInfo1(multiSelected1[len]?.value, 'OffenseID', 'NameOffense/Insert_NameOffense')
        }

    }

    const InSertBasicInfo1 = (id, col1, url) => {
        const val = {
            'NameID': nameID, [col1]: id, 'CreatedByUserFK': loginPinID, 'MasterNameID': masterNameID, 'IsMaster': nameID ? false : true
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Name_Count(DeNameID); get_Offense_DropDown(IncID, DeNameID);
                col1 === 'OffenseID' && get_OffenseName_Data(nameID);
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
                get_Offense_DropDown(IncID, DeNameID);
                col1 === 'NameOffenseID' && get_OffenseName_Data(nameID)
            } else {
                console.log("res");
            }
        }).catch((err) => {
            console.log("🚀 ~Delete AddDeleteUpadate ~ err:", err);
        })
    }

    const customStylesWithOutColor123 = {
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



    //  RelationShip
    const [selectedNameData, setSelectedNameData] = useState([]);
    const [relationShipDrp, setRelationShipDrp] = useState([]);
    const [RelationshipID, setRelationshipID] = useState('');
    const [status, setStatus] = useState(false);
    const [singleData, setRelationSingleData] = useState([]);
    const [relationshipData, setRelationshipData] = useState([]);
    const [relationTypeCode, setRelationTypeCode] = useState('');
    const [incdentNamesDrp, setIncdentNamesDrp] = useState([]);
    const [relationRow, setRelationRow] = useState(null);
    const [editCount, setEditCount] = useState(0);
    const [confirmDeleteOffender, setConfirmDeleteOffender] = useState(false);
    const [isCrimeAgainstPerson, setIsCrimeAgainstPerson] = useState(false);

    const [relationShipVal, setRelationShipVal] = useState({
        'Code': 'VIC',
        'IncidentID': IncID,
        'VictimID': '',
        'NameID': nameID,
        'RelationshipTypeID': '',
        'VictimNameID': '',
        'OffenderNameID': '',
        'ModifiedByUserFK': '',
        'RelationshipID': '',
    });

    const [realationErrors, setRealationErrors] = useState({
        VictimNameIDErrors: '',
        RelationshipTypeIDErrors: '',
    });

    useEffect(() => {
        if (singleData[0]?.RelationshipID && RelationshipID) {
            setRelationShipVal(pre => {
                return {
                    ...pre,
                    RelationshipTypeID: singleData[0]?.RelationshipTypeID,
                    VictimNameID: singleData[0]?.VictimNameID,
                    OffenderNameID: singleData[0]?.OffenderNameID,
                    ModifiedByUserFK: loginPinID,
                    RelationshipID: singleData[0]?.RelationshipID,
                    VictimID: singleData[0]?.VictimID,

                }
            });
            singleData[0]?.OffenderNameID && getSelectedNameSingleData(singleData[0]?.OffenderNameID);
            singleData[0]?.OffenderNameID && setRelationTypeCode(Get_RelationType_Code(singleData, relationShipDrp))
        } else {
            resetHooks()
        }
    }, [singleData])

    const get_Data_Name_Drp = (IncID, DeNameID) => {
        const val = { 'IncidentID': IncID, 'NameID': DeNameID, }
        fetchPostData('NameRelationship/GetDataDropDown_OffenderName', val).then((data) => {
            if (data) {
                setIncdentNamesDrp(Comman_changeArrayFormat(data, 'NameID', 'Name'))
            } else {
                setIncdentNamesDrp([])
            }
        })
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

    const getSelectedNameSingleData = (DeNameID, masterNameID) => {
        const val = { 'NameID': DeNameID, 'MasterNameID': masterNameID, 'IsMaster': false, }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setSelectedNameData(res[0]);
            } else { setSelectedNameData([]) }
        })
    }

    const get_Single_Data = (RelationshipID) => {
        const val = { 'RelationshipID': RelationshipID, }
        fetchPostData('NameRelationship/GetSingleData_NameRelationship', val).then((data) => {
            if (data) {
                setRelationSingleData(data)
            } else {
                setRelationSingleData([])
            }
        })
    }

    const checkRelationError = () => {
        const RelationshipTypeIDErr = isCrimeAgainstPerson ? RequiredFieldIncident(relationShipVal.RelationshipTypeID) : 'true';
        const OffenderNameIDErr = isCrimeAgainstPerson ? RequiredFieldIncident(relationShipVal.OffenderNameID) : 'true';

        setRealationErrors(prevValues => {
            return {
                ...prevValues,
                ['RelationshipTypeIDErrors']: RelationshipTypeIDErr || prevValues['RelationshipTypeIDErrors'],
                ['VictimNameIDErrors']: OffenderNameIDErr || prevValues['VictimNameIDErrors'],
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { RelationshipTypeIDErrors, VictimNameIDErrors } = realationErrors

    useEffect(() => {
        if (RelationshipTypeIDErrors === 'true' && VictimNameIDErrors === 'true') {
            if (status && RelationshipID) { update_Relationship() }
            else { save_Relationship() }
        }
    }, [RelationshipTypeIDErrors, VictimNameIDErrors])

    const save_Relationship = () => {
        const result = relationshipData?.find(item => {
            if (item?.OffenderNameID === relationShipVal?.OffenderNameID && item?.RelationshipTypeID === relationShipVal?.RelationshipTypeID) {
                return item?.OffenderNameID === relationShipVal?.OffenderNameID && item?.RelationshipTypeID === relationShipVal?.RelationshipTypeID
            } else return item?.OffenderNameID === relationShipVal?.OffenderNameID && item?.RelationshipTypeID === relationShipVal?.RelationshipTypeID
        });
        if (result) {
            toastifyError('Offender Name And Relationship Type Already Exists');
            setRealationErrors({ ...realationErrors, ['RelationshipTypeIDErrors']: '' });
        } else {
            if (relationShipVal?.RelationshipTypeID && relationShipVal?.OffenderNameID) {
                const { Code, IncidentID, VictimID, NameID, RelationshipTypeID, VictimNameID, OffenderNameID, ModifiedByUserFK, RelationshipID } = relationShipVal;
                const val = {
                    'Code': Code,
                    'IncidentID': IncidentID,
                    'VictimID': VictimID,
                    'NameID': nameID,
                    'RelationshipTypeID': RelationshipTypeID,
                    'VictimNameID': VictimNameID,
                    'OffenderNameID': OffenderNameID,
                    'ModifiedByUserFK': ModifiedByUserFK,
                    'RelationshipID': RelationshipID,
                }

                AddDeleteUpadate('NameRelationship/Insert_NameRelationship', val).then((data) => {
                    if (data.success) {
                        const parsedData = JSON.parse(data.data);
                        const message = parsedData.Table[0]?.Message;
                        toastifySuccess(message);
                        Get_Relationship_Data(DeNameID);
                        setStatus(false);
                        resetHooks();
                        setStatesChangeStatus(false);
                        setChangesStatus(false)
                    } else {
                        toastifyError(data.Message)
                    }
                })
            } else {
                toastifyError('Please Select Relationship Type & Offender Name');
                setRealationErrors({ ...realationErrors, ['RelationshipTypeIDErrors']: '', 'VictimNameIDErrors': '', });
            }
        }
    }

    const update_Relationship = () => {
        const result = relationshipData?.find(item => {
            if (item?.RelationshipID != relationShipVal['RelationshipID']) {
                if (item?.OffenderNameID === relationShipVal?.OffenderNameID && item?.RelationshipTypeID === relationShipVal?.RelationshipTypeID) {
                    return item?.OffenderNameID === relationShipVal?.OffenderNameID && item?.RelationshipTypeID === relationShipVal?.RelationshipTypeID
                } else return item?.OffenderNameID === relationShipVal?.OffenderNameID && item?.RelationshipTypeID === relationShipVal?.RelationshipTypeID
            }
        });
        if (result) {
            toastifyError('Offender & Relationship Already Exists')
            setRealationErrors({ ...realationErrors, ['RelationshipTypeIDErrors']: '' })
        } else {
            if (relationShipVal?.RelationshipTypeID && relationShipVal?.OffenderNameID) {
                AddDeleteUpadate('NameRelationship/Update_NameRelationship', relationShipVal).then((data) => {
                    if (data.success) {
                        const parsedData = JSON.parse(data.data);
                        const message = parsedData.Table[0].Message;
                        toastifySuccess(message);
                        Get_Relationship_Data(DeNameID); setStatus(true);
                        setStatesChangeStatus(false); setChangesStatus(false)
                        resetHooks();
                        setRealationErrors({ ...realationErrors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
                    } else {
                        toastifyError(data.Message)
                    }
                })
            } else {
                toastifyError('Please Select Relationship Type & Offender Name');
                setRealationErrors({ ...realationErrors, ['RelationshipTypeIDErrors']: '', 'VictimNameIDErrors': '', });
            }
        }
    }

    const setRelationEditValues = (row) => {
        get_Single_Data(row.RelationshipID)
        setStatus(true);
        setRelationshipID(row.RelationshipID);
        setRealationErrors({ ...realationErrors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
    }

    const OnChangeDrpRelation = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            if (name === 'OffenderNameID') {
                setRelationShipVal({ ...relationShipVal, [name]: e.value });
                getSelectedNameSingleData(e.value)
            } else if (name === 'RelationshipTypeID') {
                setRelationTypeCode(e?.id);
                setRelationShipVal({ ...relationShipVal, [name]: e.value });

            } else {
                setRelationShipVal({ ...relationShipVal, [name]: e.value });
            }
        } else {
            if (name === 'OffenderNameID') {
                setRelationShipVal({ ...relationShipVal, [name]: null });
                setSelectedNameData([]);
            } else if (name === 'RelationshipTypeID') {
                setRelationShipVal({ ...relationShipVal, [name]: null });
                setRelationTypeCode('');
            } else {
                setRelationShipVal({ ...relationShipVal, [name]: null });
            }
        }
    }

    const setRelationStatusFalse = (e) => {
        setRelationRow(null);
        resetHooks();

        setStatesChangeStatus(false);
        setUpdateStatus(updateStatus + 1);
        setRealationErrors({ ...realationErrors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
    }

    const resetHooks = () => {
        setRelationShipVal({ ...relationShipVal, RelationshipTypeID: '', VictimNameID: '', OffenderNameID: '', ModifiedByUserFK: '', RelationshipID: '', });
        setStatesChangeStatus(false); setChangesStatus(false); setRelationshipID(''); setStatus(false);
        setRealationErrors({ ...realationErrors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
        setSelectedNameData([]); setRelationTypeCode('');
    }

    const RowStyleRelationShip = [
        {
            when: row => row === relationRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const RelationColumns = [
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

                    <span onClick={(e) => { setRelationshipID(row.RelationshipID); setConfirmDeleteOffender(true); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RelationshipId">
                        <i className="fa fa-trash"></i>
                    </span>
                </div>
        }
    ];

    const deleteOffenderRelation = () => {
        const val = { 'RelationshipID': RelationshipID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameRelationship/Delete_NameRelationship', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setEditCount(editCount + 1);
                setConfirmDeleteOffender(false)
                Get_Relationship_Data(DeNameID);
                setChangesStatus(false)
                setRelationStatusFalse()
            } else { toastifyError("Somthing Wrong"); }
        })
    }

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

            <div className="col-12 col-md-12 col-lg-12  ">
                <div className="row px-2">
                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                        <label htmlFor="" className='label-name '>
                            Name Type
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
                                <input type="text" name='LastName' className={'requiredColor'} value={value?.LastName} onChange={HandleChange} required />
                            </div>
                            {
                                !nameID &&
                                <div className="col-12 col-md-3 col-lg-1 name-box text-center mt-1 pt-1 " >
                                    <button type="button" data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-success" onClick={() => getNameSearch(loginAgencyID, value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.HeightFrom, value.HeightTo, value.WeightFrom, value.WeightTo, value.EthnicityID, value.RaceID, value.SexID, value.PhoneTypeID, value.Contact, true)}>Search</button>
                                </div>
                            }
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
                    <div className="col-12 col-md-12 col-lg-12  ">
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
                    </div>
            }
            {
                nameTypeCode === "B" ?
                    <>
                    </>
                    :
                    <>
                        <div className="col-12 col-md-12 col-lg-12">
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
                                                includeTimes={
                                                    dobDate && isSameDate(dobDate, maxAllowedDate)
                                                        ? getLimitedTimesUpTo(maxAllowedDate)
                                                        : undefined
                                                }
                                            />
                                        </div>
                                        <div className="col-12 col-md-7 col-lg-3 d-flex " >
                                            <div className="col-1 col-md-1 col-lg-3 mt-2 ">
                                                <label htmlFor="" className='label-name'>Age {errors.AgeFromError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.AgeFromError}</p>
                                                ) : null}</label>
                                            </div>
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
                                            <div className="col-4 col-md-4 col-lg-12 mt-1 px-0 text-nowrap" >
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
                        </div>
                    </>
            }
            {/* Alert Master */}
            <div className="col-12 col-md-12 col-lg-12 mt-1 ">
                <div className=' mb-1 row'>
                    <div className="col-2 col-md-2 col-lg-1 mt-2">
                        <label htmlFor="" className='label-name '>
                            Role {errors.RoleError !== 'true' && nameTypeCode !== 'B' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RoleError}</p>
                            ) : null}
                        </label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3  mt-1">
                        <SelectBox
                            options={ReasonCodeRoleArr ? ReasonCodeRoleArr : []}
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
                                const action = actionMeta.action;
                                if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && arrestCount > 0
                                ) { return; }
                                const isRemovingVictim = removedOption?.value === 1;

                                if (actionMeta.action === 'remove-value' && isRemovingVictim && value.checkVictem === 1 && nameID) {
                                    return;
                                }
                                if (actionMeta.action === 'remove-value' && isRemovingVictim && value.checkVictem !== 1) {
                                    setMultiSelected({ optionSelected: [] });
                                    setValue(prev => ({ ...prev, NameReasonCodeID: null }));
                                }
                                onChangeReaonsRole(selectedOptions, 'Role');
                            }}

                            styles={Requiredcolour}
                        />
                    </div>


                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='label-name '>
                            Reason Code
                            {errors.NameReasonCodeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.NameReasonCodeIDError}</p>
                            ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-4 mt-1 mb-1" >
                        <SelectBox
                            styles={MstPage === "MST-Name-Dash" ? colourStylesMasterReason : colourStylesReason}
                            options={reasonIdDrp ? getFiltredReasonCode(reasonIdDrp) : []}
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
                                ]
                                const removedOption = actionMeta.removedValue;
                                const action = actionMeta.action;
                                console.log(removedOption?.reasonCode)
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
                                        onChange={(e) => { ChangeDropDown(e, 'VictimTypeID'); }}
                                        placeholder="Select.."
                                        styles={roleStatus ? colourStylesReason : ''}

                                    />
                                </div>
                            </>
                            :
                            <></>
                    }



                    <div className="col-lg-5 " style={{ margin: '0 auto' }} >
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
            </div>

            {
                DeNameID ? (
                    <div className="row  align-items-center mt-2">
                        <div className="col-2 col-md-2 col-lg-1 ">
                            <label htmlFor="" className='label-name '>Offense
                            </label>
                        </div>
                        <div className="col-8 col-md-8 col-lg-8  mt-2" >
                            <SelectBox
                                name='OffenseID'
                                isClearable
                                options={offenseDrp}
                                closeMenuOnSelect={false}
                                components={{ Option: CheckboxOption }}
                                placeholder="Select.."
                                onChange={(e) => offense(e)}
                                value={multiSelected1.OffenseID}
                                ref={SelectedValue}
                                className="basic-multi-select select-box_offence"
                                isMulti
                                styles={customStylesWithOutColor123}
                            />
                        </div>
                    </div>
                )
                    :
                    null
            }



            <div className="row">
                <div className="col-12 col-md-12 col-lg-12 ">

                    <div className="row justify-content-end mb-2">

                        <div className="col-12 col-md-12 col-lg-12 text-right" >

                            <div className=" mt-1 justify-content-between d-flex  " >
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
                                                className={` ml-3 ${nibrsValidateNameData?.length > 0 ? 'btn btn-sm mr-1' : 'btn btn-sm btn-success mr-1'}`}
                                                onClick={() => { getNibrs_Names_Error(mainIncidentID, IncNo) }}
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
                                                            effectiveScreenPermission[0]?.Changeok && nibrsSubmittedOffender !== 1 ?
                                                                <>
                                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }} ref={saveButtonRef} disabled={isLoading || nameSearchStatus || !statesChangeStatus}>Update</button>
                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                            :
                                                            <>
                                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }} ref={saveButtonRef} disabled={isLoading || nameSearchStatus || !statesChangeStatus}>Update</button>

                                                            </>
                                                    )
                                                        :
                                                        (
                                                            effectiveScreenPermission ?
                                                                effectiveScreenPermission[0]?.AddOK ?
                                                                    <>
                                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }} disabled={isLoading || nameSearchStatus || saveValue} ref={saveButtonRef}>Save</button>
                                                                    </>
                                                                    :
                                                                    <>
                                                                    </>
                                                                :
                                                                <>
                                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }} disabled={isLoading || nameSearchStatus || saveValue}>Save</button>
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
            <div className={`modal ${confirmDeleteOffender ? 'show' : ''}`} style={{ display: confirmDeleteOffender ? 'block' : 'none', background: "rgba(0,0,0, 0.5)", transition: '0.5s', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="box text-center py-5">
                            <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to save current record ?</h5>
                            <div className="btn-box mt-3">
                                <button type="button" onClick={() => { deleteOffenderRelation() }} className="btn btn-sm text-white" style={{ background: "#ef233c" }}>Delete</button>
                                <button type="button" onClick={() => { setConfirmDeleteOffender(false) }} className="btn btn-sm btn-secondary ml-2">Close</button>
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
                        onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); }}
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
        </>
    )
}

export default MinOffender;

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