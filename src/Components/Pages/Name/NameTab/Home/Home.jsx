import React, { useContext, useEffect, useRef, useState } from 'react'
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import { useLocation, useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, base64ToString, stringToBase64, getShowingWithOutTime, Aes256Encrypt, Requiredcolour, colourStylesRole, customStylesWithOutColor, LockFildscolour, tableCustomStyles, } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormatReasonCode, Comman_changeArrayFormat_With_Name, changeArray, fourColArrayReasonCode, sixColArray, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Email_Field, PhoneFieldNotReq, RequiredField, NameValidationCharacter, PhoneField, FaxField } from '../../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident, } from '../../../Utility/Personnel/Validation';
import SelectBox from '../../../../Common/SelectBox';
import Location from '../../../../Location/Location';
import NameSearchModal from '../../../NameSearch/NameSearchModal';
import { SSN_Field, Heights, Comparisionweight, Comparision2 } from '../../../PersonnelCom/Validation/PersonnelValidation';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png';
import VerifyLocation from './VerifyLocation';
import ChangesModal from '../../../../Common/ChangesModal';
import DataTable from 'react-data-table-component';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import ImageModel from '../../../ImageModel/ImageModel';
import { useDispatch, useSelector } from 'react-redux';
import { get_Inc_ReportedDate, get_LocalStoreData, get_NameTypeData } from '../../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_Masters_Name_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import AlertMasterModel from '../../../AlertMaster/AlertMasterModel';
import AlertTable from '../../../AlertMaster/AlertTable';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import Loader from '../../../../Common/Loader';
import NirbsErrorShowModal from '../../../../Common/NirbsErrorShowModal';
import NCICModal from '../../../../../CADComponents/NCICModal';
import DeleteNameModal from '../../../../Common/DeleteNameModel';

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const Home = ({ setShowVictim, setshowWarrant, setNameShowPage, setShowOffender, setIsBusinessName, get_List, isCad = false, isCADSearch = false, isViewEventDetails = false }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const nameTypeData = useSelector((state) => state.Agency.nameTypeData);
  const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);

  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const { get_Incident_Count, get_Name_Count, NameTabCount, nameSearchStatus, nibrsSubmittedName, setnibrsSubmittedName, get_Data_Name, setcountAppear, setAuditCount, setNameSearchStatus, setcountStatus, setChangesStatus, setNameSingleData, changesStatus, nameFilterData, validate_IncSideBar } = useContext(AgencyContext);


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

  const [editval, setEditval] = useState([]);
  //Datepicker
  const [dobDate, setDobDate] = useState();
  const [yearsVal, setYearsVal] = useState();
  // DropDown
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
  const [ownerNameData, setOwnerNameData] = useState([]);
  const [nameModalStatus, setNameModalStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0);
  const [stateList, setStateList] = useState([]);
  const [globalname, setglobalname] = useState('')
  const [globalnameto, setglobalnameto] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [called, setcalled] = useState(false);
  const [openPage, setOpenPage] = useState('');
  const crossButtonRef = useRef(null);
  const [victimTypeDrp, setVictimTypeDrp] = useState([]);
  const [victimTypeStatus, setvictimTypeStatus] = useState(false);
  const [roleStatus, setroleStatus] = useState(false);
  const [isSocietyName, setIsSocietyName] = useState(false);
  const [isSecondDropdownDisabled, setIsSecondDropdownDisabled] = useState(true);
  const [openNCICModal, setOpenNCICModal] = useState(false);
  // Image 
  const [nameMultiImg, setNameMultiImg] = useState([]);
  const [imageId, setImageId] = useState('');
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
  const [type] = useState("NameBusiness");
  const [uploadImgFiles, setuploadImgFiles] = useState([])
  const [imageModalStatus, setImageModalStatus] = useState(false)
  const [onSelectLocation, setOnSelectLocation] = useState(true);
  const [possenSinglData, setPossenSinglData] = useState([]);
  const [availableAlert, setAvailableAlert] = useState([]);
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [saveValue, setsaveValue] = useState(false);
  const [isAdultArrest, setIsAdultArrest] = useState(false);
  const [isMissing, setisMissing] = useState(false);
  const [isVictim, setIsVictim] = useState(false);
  const [residentIDDrp, setResidentIDDrp] = useState([]);
  const [baseDate, setBaseDate] = useState('');
  const [oriNumber, setOriNumber] = useState('');
  const [arrestCount, setarrestCount] = useState('');
  const [missingpersonCount, setmissingpersonCount] = useState('');
  const [propertyOwnerCount, setpropertyOwnerCount] = useState('');

  const [newClicked, setNewClicked] = useState(0);
  // nibrs 
  const [nibrsValidateNameData, setnibrsValidateNameData] = useState([]);
  const [nibrsErrStr, setNibrsErrStr] = useState('');
  const [clickNibloder, setclickNibLoder] = useState(false);
  const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
  const [nibFieldStatusOrErr, setNibFieldStatusOrErr] = useState()
  const [imageModalOfficerID, setImageModalOfficerID] = useState(null)
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();
  const [juvenilestatus, setjuvenilestatus] = useState(false);

  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  });

  const [multiSelectedReason, setMultiSelectedReason] = useState({
    optionSelected: null
  });
  console.log(NameTabCount)

  const [value, setValue] = useState({
    'NameIDNumber': 'Auto Generated', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
    'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'EthnicityID': '', 'AgeUnitID': '',
    'IsJuvenile': '', 'IsCurrentPh': true, 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '',
    'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '',
    'OwnerNameID': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'DateOfBirth': '', 'CertifiedDtTm': '', 'AgeFrom': '',
    'AgeTo': '', 'Years': '', 'EventType': 'I', 'ModifiedByUserFK': '', 'MasterNameID': '', 'NameID': '',
    'ArrestID': "", 'WarrantID': "", 'TicketID': "", 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0, 'VictimCode': '',
    'CreatedByUserFK': '', 'AgencyID': '', 'IncidentID': '', 'NameLocationID': '', 'DLNumber': "", 'DLStateID': '', 'IsUnknown': false, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
    'Role': '', 'ResidentID': '', 'IsInjury': '', 'VictimTypeID': ''
  })

  const [errors, setErrors] = useState({
    'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true',
    'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'DLError': 'true', 'SexIDError': '', 'AddressError': 'true', 'CrimeLocationError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
  })

  const [imgData, setImgData] = useState({
    "PictureTypeID": '', "ImageViewID": '', "ImgDtTm": '', "OfficerID": '', "Comments": '', "DocumentID": ''
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
      get_Incident_Count(IncID, localStoreData?.PINID); setMainIncidentID(IncID);
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
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (IncID) {
      setMainIncidentID(IncID); dispatch(get_Inc_ReportedDate(IncID))
    } else { Reset(); }
  }, [IncID]);

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
      const RoleErr = MstPage === "MST-Name-Dash" ? 'true' : RequiredFieldIncident(value.Role);
      const VictimTypeError = roleStatus && MstPage !== "MST-Name-Dash" ? RequiredFieldIncident(value.VictimTypeID) : 'true';
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
        setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'error' } })
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
      const RoleErr = MstPage === "MST-Name-Dash" ? 'true' : RequiredFieldIncident(value.Role);
      const VictimTypeError = roleStatus && MstPage !== "MST-Name-Dash" ? RequiredFieldIncident(value.VictimTypeID) : 'true';
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
        setErrors(prevValues => { return { ...prevValues, ['AgeError']: 'Invalid' } })
      }
      // Phone Validation
    }
  };

  const handleKeyDown = (e) => {
    const charCode = e.keyCode || e.which;
    const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
    const numKeys = Array.from({ length: 10 }, (_, i) => i + 48);
    const numpadKeys = Array.from({ length: 10 }, (_, i) => i + 96);
    if (!controlKeys.includes(charCode) && !numKeys.includes(charCode) && !numpadKeys.includes(charCode)) {
      e.preventDefault();
    }
  };

  // Check All Field Format is True Then Submit   
  const { LastNameError, OwnerPhoneNumberError, CrimeLocationError, AgeFromError, EthnicityErrorr, ResidentError, VictimTypeError, RoleError, OwnerFaxNumberError, FirstNameError, MiddleNameError, NameTypeIDError, NameReasonCodeIDError, ContactError, DLError, SSN, WeightError, HeightError, AgeError, DateOfBirthError, RaceIDError, SexIDError, } = errors
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
    if (agencyOfficerDrpData?.length === 0 && loginAgencyID) dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
  }, [loginAgencyID])

  useEffect(() => {
    if (loginAgencyID && IncID) dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
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
        setStateList(Comman_changeArrayFormat(data[0]?.State, "StateID", "State"));
        setSuffixIdDrp(Comman_changeArrayFormat(data[0]?.Suffix, 'SuffixID', 'Description'));
        setPhoneTypeIdDrp(threeColArray(data[0]?.ContactType, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
      } else {
        setAgeUnitDrpData([]); setEthinicityDrpData([]); setSexIdDrp([]); setVerifyIdDrp([]); setRaceIdDrp([]); setStateList([]); setSuffixIdDrp([]);
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
    if (nameID || masterNameID) {
      if (editval.length > 0) {
        get_Victim_Type_Data(loginAgencyID, editval[0]?.NameTypeID);
        setAuditCount(true); get_Arrestee_Drp_Data(mainIncidentID); get_Name_MultiImage(nameID, masterNameID);
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
          'MasterNameID': editval[0]?.MasterNameID, 'NameID': editval[0]?.NameID, 'IsUnknown': editval[0]?.IsUnknown, 'NameIDNumber': editval[0]?.NameIDNumber ? editval[0]?.NameIDNumber : 'Auto Generated', 'checkVictem': editval[0]?.NewVictimID ? editval[0]?.NewVictimID[0]?.NewVictimID : "", 'checkOffender': editval[0]?.NewOffenderID ? editval[0]?.NewOffenderID[0]?.NewOffenderID : "", 'checkArrest': editval[0]?.ArrestID ? editval[0]?.ArrestID[0]?.ArrestID : "",
          // DropDown
          'NameTypeID': editval[0]?.NameTypeID, 'BusinessTypeID': editval[0]?.BusinessTypeID, 'SuffixID': editval[0]?.SuffixID, 'VerifyID': editval[0]?.DLVerifyID, 'SexID': editval[0]?.SexID, 'RaceID': editval[0]?.RaceID, 'PhoneTypeID': editval[0]?.PhoneTypeID, 'EthnicityID': editval[0]?.EthnicityID, 'AgeUnitID': editval[0]?.AgeUnitID, 'NameReasonCodeID': editval[0]?.ReasonCode ? changeArray(editval[0]?.ReasonCode, 'NameReasonCodeID') : '', 'CertifiedByID': editval[0]?.CertifiedByID, 'Role': MstPage === "MST-Name-Dash" ? '' : editval[0]?.Role,
          // checkbox
          'IsJuvenile': editval[0]?.IsJuvenile, 'IsVerify': editval[0]?.IsVerify, 'IsUnListedPhNo': editval[0]?.IsUnListedPhNo,
          //textbox
          'OwnerFaxNumber': editval[0]?.OwnerFaxNumber, 'OwnerPhoneNumber': editval[0]?.OwnerPhoneNumber, 'OwnerNameID': editval[0]?.OwnerNameID,
          'LastName': editval[0]?.LastName ? editval[0]?.LastName?.trim() : editval[0]?.LastName, 'FirstName': editval[0]?.FirstName, 'MiddleName': editval[0]?.MiddleName, 'SSN': editval[0]?.SSN, 'WeightFrom': editval[0]?.WeightFrom, 'WeightTo': editval[0]?.WeightTo,
          'HeightFrom': editval[0]?.HeightFrom, 'HeightTo': editval[0]?.HeightTo, 'Address': editval[0]?.Address, 'Contact': editval[0]?.Contact,
          'AgeFrom': editval[0]?.AgeFrom === null ? null : editval[0]?.AgeFrom ?? '0', 'AgeTo': editval[0]?.AgeTo ? editval[0]?.AgeTo : '',
          //Datepicker
          'DateOfBirth': editval[0]?.DateOfBirth ? getShowingWithOutTime(editval[0]?.DateOfBirth) : '', 'CertifiedDtTm': editval[0]?.CertifiedDtTm ? getShowingDateText(editval[0]?.CertifiedDtTm) : null, 'Years': editval[0]?.Years, 'NameLocationID': editval[0]?.NameLocationID,
          'ModifiedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'DLNumber': editval[0]?.DLNumber, 'DLStateID': editval[0]?.DLStateID,
          'VictimCode': editval[0]?.VictimCode, 'ResidentID': editval[0]?.ResidentID, 'IsInjury': editval[0]?.IsInjury, 'VictimTypeID': editval[0]?.VictimTypeID
        })
        setnibrsSubmittedName(editval[0]?.IsNIBRSSummited);
        if (editval[0]?.Role?.includes(1)) {
          setroleStatus(true);
        } else {
          setroleStatus(false);
        }
        setIsSecondDropdownDisabled(editval[0]?.Role?.length === 0);
        setIsSocietyName(editval[0].IsSociety === 'true' ? true : false); setarrestCount(editval[0]?.ArrestCount); setmissingpersonCount(editval[0]?.MissingPersonCount); setpropertyOwnerCount(editval[0]?.PropertyOwnerCount); setPossessionID(editval[0]?.OwnerNameID)
        // ---------------------Name_Non_Verify_Add--------------
        GetReasonIdDrp(loginAgencyID, editval[0]?.NameTypeID, JSON.parse(editval[0]?.Role));
        setPhoneTypeCode(Get_PhoneType_Code(editval, phoneTypeIdDrp)); setDobDate(editval[0]?.DateOfBirth ? new Date(editval[0]?.DateOfBirth) : '');
        setIsAdult(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Adult Arrest" || item.ReasonCode_Description === "Juvenile Arrest" })); setIsOffender(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Offender" }));
        setvictimTypeStatus(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode_Description === "Victim" || item.ReasonCode_Description === "Business Is A Victim" || item.ReasonCode_Description === "Domestic Victim" || item.ReasonCode_Description === "Individual Is A Victim" || item.ReasonCode_Description === "Individual Victim" || item.ReasonCode_Description === "Other Is A Victim" || item.ReasonCode_Description === "Restraint Victim" || item.ReasonCode_Description === "Restraint Victim" || item.ReasonCode_Description === "Society Is A Victim" }))
        //--------------get_Non_Verify_Add-------------------
        if (!editval[0]?.IsVerify && editval[0]?.NameLocationID) {
          get_Add_Single_Data(editval[0]?.NameLocationID);
        }
        setNameTypeCode(editval[0]?.NameTypeCode); setIsBusinessName(editval[0]?.NameTypeCode === 'B' ? true : false)
        if (editval[0]?.Years) { const Years = editval[0]?.Years.split(' '); setYearsVal(Years[1]) }
        setMultiSelected({
          optionSelected: editval[0]?.ReasonCode ? fourColArrayReasonCode(editval[0]?.ReasonCode, 'NameReasonCodeID', 'ReasonCode_Description', 'IsVictimName', 'IsOffenderName'
          ) : '',
        });
        setMultiSelectedReason({ optionSelected: MstPage === "MST-Name-Dash" ? '' : editval[0]?.Role ? makeRoleArr(editval[0]?.Role) : [], });
        setShowOffender(editval[0]?.ReasonCode?.some(function (item) { return item.IsOffenderName })); setShowVictim(editval[0]?.ReasonCode?.some(function (item) { return item.IsVictimName })); setshowWarrant(editval[0]?.ReasonCode?.some(function (item) { return item.ReasonCode === "WAR" }));
      }
    } else {
      if (!changesStatus) {
        setAuditCount(false); setShowOffender(false); setShowVictim(false); setshowWarrant(false);
        setValue({
          ...value,
          'MasterNameID': '', 'NameID': '', 'NameIDNumber': 'Auto Generated', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'EthnicityID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': '', 'CertifiedByID': '', 'AgeUnitID': '', 'Role': '',
          'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'checkVictem': 0, 'checkOffender': 0, 'checkArrest': 0,
          'DLNumber': '', 'DLStateID': '', 'ResidentID': '',
        }); setPhoneTypeCode('')
      }
      const id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
      if (id.length > 0) {
        setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
        setNameTypeCode(id[0].NameTypeCode); setIsBusinessName(false);
      }
      setMultiSelected({ optionSelected: [], }); setMultiSelectedReason({ optionSelected: [], });
    }
  }, [editval])

  const makeRoleArr = (ids) => {
    const arr = filteredReasonCodeRoleArr?.filter(item => ids.includes(item.value));
    return filteredReasonCodeRoleArr?.filter(item => ids.includes(item.value));
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
          setNameSearchValue(data); setNameSearchStatus(true)
        } else {
          setNameSearchValue([]); setNameSearchStatus(false)
          if (type) toastifyError('No Name Available');
        }
      })
    } else {
      setNameSearchStatus(false); toastifyError('Empty Feild');
    }
  }

  const getNameSearch = async (loginAgencyID, NameTypeID, LastName, FirstName, MiddleName, DateOfBirth, SSN, HeightFrom, HeightTo, WeightFrom, WeightTo, EthnicityID, ResidentID, RaceID, SexID, PhoneTypeID, Contact, type) => {
    if (value.LastName || value.DateOfBirth || value.FirstName || value.MiddleName || value.SSN || value.SexID || value.HeightFrom || value.HeightTo || value.DateOfBirth || value.WeightFrom || value.WeightTo || value.EthnicityID || value.ResidentID || value.RaceID || value.PhoneTypeID || value.Contact || value.NameReasonCodeID.length > 0 || value.Address || value.AgeFrom || value.AgeTo || value.AgeUnitID || value.DLNumber || value.DLStateID || value.SuffixID) {
      setIsLoading(true);
      setChangesStatus(false);
      fetchPostData("MasterName/Search_Name", {
        "NameTypeID": NameTypeID, "LastName": LastName, "FirstName": FirstName ? FirstName : null, "MiddleName": MiddleName ? MiddleName : null, "SSN": SSN ? SSN : null, 'AgencyID': loginAgencyID ? loginAgencyID : null, NameIDNumber: "", 'ReasonCodeList': value.NameReasonCodeID ? JSON.stringify(value.NameReasonCodeID) : '', SuffixID: value.SuffixID, 'DateOfBirth': DateOfBirth, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'ResidentID': ResidentID, HairColorID: "", EyeColorID: "", 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, SMTTypeID: "", SMTLocationID: "", SMT_Description: "", IncidentNumber: "", IncidentNumberTo: "", ReportedDate: "", ReportedDateTo: "", 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'PhoneTypeID': PhoneTypeID, 'Contact': Contact, 'Address': value.Address ? value.Address : '', 'AgeFrom': value.AgeFrom ? value.AgeFrom : '', 'AgeTo': value.AgeTo ? value.AgeTo : '', 'AgeUnitID': value.AgeUnitID ? value.AgeUnitID : '', 'DLNumber': value.DLNumber ? value.DLNumber : '', 'DLStateID': value.DLStateID ? value.DLStateID : '', 'MasterNameID': masterNameID,

      }).then((data) => {
        if (data.length > 0) {
          setIsLoading(false);
          const [{ MasterNameID, NameIDNumber }] = data;
          setNameSearchValue(data); setNameSearchStatus(true)
        } else {
          setNameSearchValue([]); setIsLoading(false);
          if (type) toastifyError('No Name Available');
          setNameSearchStatus(false)
        }
      })
    } else {
      setNameSearchStatus(false); toastifyError('Please Enter Details');
    }
  }

  const set_Edit_Value = (row) => {
    if (changesStatus) {
      const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
      modal.show();
    }
    else {
      if (row.NameID || row.MasterNameID) {
        Reset(); setVictimTypeDrp([]); GetSingleData(row.NameID, row.MasterNameID);
        if (isCad) {
          navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
        } else {
          navigate(`/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
        }
        get_Name_Count(row.NameID, row.MasterNameID, MstPage === "MST-Name-Dash" ? true : false);
        setNameID(row.NameID); setMasterNameID(row?.MasterNameID); setUpdateStatus(updateStatus + 1); setuploadImgFiles('');
        getNibrsErrorToolTip(row.NameID, uniqueId, mainIncidentID);
        setIsSocietyName(row.IsSociety === 'true' ? true : false);
        setErrors({
          ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
        });
      }
    }

  }

  const setStatusFalse = () => {
    setImageModalOfficerID(null); setNewClicked((prev) => prev + 1);
    if (MstPage === "MST-Name-Dash") {
      if (isCADSearch) {
        navigate(`/cad/name-search?page=MST-Name-Dash&IncId=${0}&IncNo=${0}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
      } else {
        navigate(`/Name-Home?page=MST-Name-Dash&IncId=${0}&IncNo=${0}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
        Reset();
      }
    }
    else {
      if (isCad) {
        navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
      } else {
        navigate(`/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}`)
      }
      setMasterNameID(''); setNameID(''); Reset(); setUpdateStatus(updateStatus + 1); setLocationStatus(true); get_Name_Count('');
      setIsAdult(false); setIsOffender(false); setPossessionID(''); setPossenSinglData([]);
    }
  }


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
      name: 'Alias Indicator', selector: (row) => row.AliasIndicator, sortable: true
    },
    {
      width: '100px', name: 'View',
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
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>

          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK ?
                <span onClick={() => { setNameID(row.NameID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal">
                  <i className="fa fa-trash"></i>
                </span>
                : <></>
              : <span onClick={() => { setNameID(row.NameID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal">
                <i className="fa fa-trash"></i>
              </span>
          }

        </div>

    }
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
    const val = { AgencyID: loginAgencyID, CategoryID: id, Role: MstPage === "MST-Name-Dash" ? '' : RoleIdsArray }
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
    !addUpdatePermission && setStatesChangeStatus(true)
    if (e) {
      if (name === 'NameTypeID') {
        get_Victim_Type_Data(loginAgencyID, nameTypeCode); setVictimTypeDrp([]);
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
        setLocationStatus(true); setMultiSelected({ optionSelected: [] });
        setMultiSelectedReason({ optionSelected: [] }); setPhoneTypeCode(''); setNameTypeCode(e.id); !addUpdatePermission && setChangesStatus(true);
        if (e.id === 'B') { setIsBusinessName(true); GetBusinessTypeDrp(loginAgencyID); get_Arrestee_Drp_Data(mainIncidentID); } else { setIsBusinessName(false); }
      } else {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [name]: e.value, 'IsJuvenile': e.id === 'B' ? null : value.IsJuvenile })
      }
    } else {
      !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [name]: null }); setNameTypeCode(''); setIsBusinessName(false); setPhoneTypeCode('')
    }
  }
  function getLabelsString(data) {
    return data.map(item => item.label).join(',');
  }

  const ChangePhoneType = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true)
    if (e) {
      if (name === 'PhoneTypeID') {
        setPhoneTypeCode(e.id); !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [name]: e.value, ['Contact']: "", ['IsUnListedPhNo']: false })
      }
      !addUpdatePermission && setChangesStatus(true)
    } else if (e === null) {
      if (name === 'PhoneTypeID') {
        !addUpdatePermission && setChangesStatus(true); setValue({ ...value, ['PhoneTypeID']: "", ['Contact']: "", ['IsUnListedPhNo']: false });
        setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '' }); setPhoneTypeCode('')
      }
    } else {
      !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [name]: null, ['IsUnListedPhNo']: false }); setPhoneTypeCode('')
    }
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
    if (e) {
      if (name === 'DLStateID') {
        setValue({ ...value, [name]: e.value, ['DLNumber']: '', ['VerifyID']: '' });
      } else if (name === 'OwnerNameID') {
        setValue({ ...value, [name]: e.value }); setPossessionID(e.value); setPossenSinglData([]);
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === 'DLStateID') {
        setValue({ ...value, [name]: null, ['DLNumber']: '', ['VerifyID']: '' });
      } else {
        setValue({ ...value, [name]: null, }); setErrors({ ...errors, ['DLError']: '', }); setPossessionID(''); setPossenSinglData([]);
      }
    }
  };

  const HandleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e.target.name === 'IsVerify' || e.target.name === 'IsUnListedPhNo' || e.target.name === 'IsUnknown') {
      if (e.target.name === 'IsVerify') {
        if (e.target.checked && addVerifySingleData.length > 0) {
          setModalStatus(false); setLocationStatus(true); setAddVerifySingleData([]);
          setValue(pre => { return { ...pre, ['Address']: '', [e.target.name]: e.target.checked, } });
        } else {
          setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
          setModalStatus(true); setLocationStatus(false);
        }
      } else {
        !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: e.target.checked });
      }
      if (e.target.name === 'IsUnknown') {
        if (e.target.checked === true) {
          setValue(pre => {
            return {
              ...pre, ['FirstName']: '', ['MiddleName']: '', ['SSN']: '', ['DateOfBirth']: '', ['DLNumber']: '', ['DLStateID']: '',
              ['AgeFrom']: '', ['AgeTo']: '', [e.target.name]: e.target.checked, ['LastName']: 'Unknown', ['VerifyID']: '', ['SexID']: 3, ['RaceID']: 6, ['EthnicityID']: 3,
            }
          });
          setErrors({ ...errors, ['DLError']: '', }); setDobDate('');
        } else {
          setValue(pre => { return { ...pre, ['LastName']: '', [e.target.name]: e.target.checked, ['SexID']: '', ['RaceID']: '', ['EthnicityID']: '', } });
        }
      }

    }
    else if (e.target.name === 'Contact') {
      if (phoneTypeCode === 'E') {
        !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: e.target.value });
      } else {
        let ele = e.target.value.replace(/\D/g, '');
        if (ele.length === 10) {
          setValue(pre => { return { ...pre, ['IsUnListedPhNo']: 'true', } });
          const cleaned = ('' + ele).replace(/\D/g, '');
          const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
          if (match) {
            !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] })
          }
        } else {
          ele = e.target.value.split('-').join('').replace(/\D/g, '');
          !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: ele, ['IsUnListedPhNo']: ele === '' ? false : value['IsUnListedPhNo'], })
        }
      }
    }
    else if (e.target.name === 'DLNumber') {
      const normalizedValue = e.target.value.trim();
      !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: normalizedValue, });
    }
    else if (e.target.name === 'OwnerPhoneNumber') {
      let ele = e.target.value.replace(/\D/g, '');
      if (ele.length <= 10) {
        const cleaned = ('' + ele).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3], });
        } else {
          !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: ele, });
        }
      }
    }
    else if (e.target.name === 'OwnerFaxNumber') {
      let ele = e.target.value.replace(/\D/g, '');
      if (ele.length <= 10) {
        const cleaned = ('' + ele).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3], });
        } else {
          !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: ele, });
        }
      }
    }
    else if (e.target.name === 'SSN') {
      let ele = e.target.value.replace(/[^0-9\s]/g, "")
      if (ele.length === 9) {
        const cleaned = ('' + ele).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
        if (match) {
          !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] });
          getNameSearchPopup(loginAgencyID, value?.NameTypeID, null, null, null, null, match[1] + '-' + match[2] + '-' + match[3])
        }
      } else {
        ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
        !addUpdatePermission && setChangesStatus(true); setValue({ ...value, [e.target.name]: ele });
      }
    }
    else if (e.target.name === 'WeightTo' || e.target.name === 'WeightFrom') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
      !addUpdatePermission && setChangesStatus(true)
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
      setValue({ ...value, [e.target.name]: ele, HeightTo: '' })
    } else if (e.target.name === 'HeightTo') {
      let ele = e.target.value.replace(/[^0-9\s]/g, "");
      setValue({ ...value, [e.target.name]: ele, })
    }
    else if (e.target.name === 'AgeFrom') {
      const checkNumber = e.target.value.replace(/[^0-9]/g, "");
      !addUpdatePermission && setChangesStatus(true); setDobDate('');
      setValue({ ...value, AgeFrom: checkNumber, AgeTo: '', AgeUnitID: '', ['Years']: 0, ['DateOfBirth']: null });
    }
    else if (e.target.name === 'AgeTo') {
      const checkNumber = e.target.value.replace(/[^0-9]/g, "");
      !addUpdatePermission && setChangesStatus(true); setDobDate('');
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
    }
    else {
      const AgencyID = loginAgencyID;
      const IncidentID = mainIncidentID;
      const CreatedByUserFK = loginPinID;
      const { NameTypeID, BusinessTypeID, IsMaster, NameIDNumber, IsUnListedPhNo, IsVerify, IsCurrentPh, SuffixID, VerifyID, SexID, RaceID, PhoneTypeID, NameReasonCodeID, CertifiedByID, EthnicityID, AgeUnitID, IsJuvenile, LastName, FirstName, MiddleName, SSN, WeightFrom, WeightTo, HeightFrom, HeightTo, Address, Contact, OwnerNameID, OwnerPhoneNumber, OwnerFaxNumber, DateOfBirth, CertifiedDtTm, AgeFrom, AgeTo, Years, ModifiedByUserFK, MasterNameID, NameID, ArrestID, WarrantID, TicketID, checkVictem, EventType,
        checkOffender, checkArrest, NameLocationID, DLNumber, DLStateID, IsUnknown, Role, ResidentID, IsInjury, VictimTypeID
      } = value;

      const trimmedFirstName = FirstName?.trim();
      const trimmedMiddleName = MiddleName?.trim();
      const RoleName = multiSelectedReason?.optionSelected?.length > 0 ? getLabelsString(multiSelectedReason.optionSelected) : "";
      const val = {
        'AgencyID': AgencyID,
        'NameIDNumber': (value.NameIDNumber.startsWith('J') && value.IsJuvenile) || (value.NameIDNumber.startsWith('A') && !value.IsJuvenile)
          ? value.NameIDNumber
          : 'Auto Generated',

        'NameTypeID': NameTypeID, 'EventType': EventType, 'IsMaster': IsMaster, 'IsUnListedPhNo': IsUnListedPhNo, 'IsVerify': IsVerify, 'PhoneTypeID': PhoneTypeID, 'OwnerFaxNumber': OwnerFaxNumber, 'IsCurrentPh': IsCurrentPh, 'BusinessTypeID': BusinessTypeID, 'SuffixID': SuffixID, 'DLVerifyID': VerifyID, 'SexID': SexID, 'RaceID': RaceID, 'PhoneTypeID': PhoneTypeID, 'NameReasonCodeID': NameReasonCodeID, 'CertifiedByID': CertifiedByID, 'RoleName': RoleName, 'EthnicityID': EthnicityID, 'AgeUnitID': AgeUnitID, 'IsJuvenile': IsJuvenile, 'LastName': LastName ? LastName : null, 'FirstName': trimmedFirstName ? trimmedFirstName : null, 'MiddleName': trimmedMiddleName ? trimmedMiddleName : null, 'SSN': SSN, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'Address': Address, 'Contact': Contact, 'OwnerNameID': OwnerNameID, 'OwnerPhoneNumber': OwnerPhoneNumber,
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
                  if (isCad) {
                    navigate(`/cad/dispatcher?page=MST-Name-Dash&NameID=${stringToBase64(res?.NameID)}&MasterNameID=${stringToBase64(res?.MasterNameID)}&ModNo=${res?.NameNumber}&NameStatus=${true}`);

                  } else {
                    navigate(`/Name-Home?page=MST-Name-Dash&NameID=${stringToBase64(res?.NameID)}&MasterNameID=${stringToBase64(res?.MasterNameID)}&ModNo=${res?.NameNumber}&NameStatus=${true}`);
                  }
                }
                else {
                  if (isCad) {
                    navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(res?.NameID)}&MasterNameID=${stringToBase64(res?.MasterNameID)}&NameStatus=${true}`)
                  } else {
                    navigate(`/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(res?.NameID)}&MasterNameID=${stringToBase64(res?.MasterNameID)}&NameStatus=${true}`)
                  }
                }
                toastifySuccess(res.Message); setsaveValue(false);
                setValue({
                  ...value,
                  'NameIDNumber': 'Auto Generated', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '', 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '',
                  'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'MasterNameID': '', 'NameID': '', 'EthnicityID': '', 'DLNumber': "", 'DLStateID': '', 'IsUnknown': '', 'IsJuvenile': '',
                })
                get_NameTypeData(loginAgencyID); get_Data_Name(mainIncidentID, MstPage === "MST-Name-Dash" ? true : false);

                setChangesStatus(false); setLocationStatus(true); setUpdateStatus(updateStatus + 1); setIsAdult(false); setIsOffender(false);

                setStatesChangeStatus(false); get_Incident_Count(mainIncidentID, loginPinID);
                if (uploadImgFiles?.length > 0) { upload_Image_File(res?.NameID, res?.MasterNameID); setuploadImgFiles('') }
                setErrors({ ...errors, ['AddressError']: 'true', ['WeightError']: 'true', ['AgeError']: 'true', ['ContactError']: 'true', ['NameTypeIDError']: '', });
              } else {
                toastifyError(res.Message); setErrors({ ...errors, ['NameTypeIDError']: '', ['ContactError']: '', });
                setChangesStatus(false)
              }
              // validateIncSideBar
              validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
            })
          } else { toastifyError('SSN Already exist '); }
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
    }
    else {
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
      const RoleName = multiSelectedReason?.optionSelected?.length > 0 ? getLabelsString(multiSelectedReason.optionSelected) : "";
      const val = {
        'AgencyID': AgencyID,
        'NameIDNumber': IsJuvenile === editval[0]?.IsJuvenile ? NameIDNumber : 'Auto Generated',
        'NameTypeID': NameTypeID, 'EventType': EventType, 'IsMaster': IsMaster, 'IsVerify': IsVerify, 'IsUnListedPhNo': IsUnListedPhNo, 'PhoneTypeID': PhoneTypeID, 'OwnerFaxNumber': OwnerFaxNumber, 'IsCurrentPh': IsCurrentPh, 'BusinessTypeID': BusinessTypeID, 'SuffixID': SuffixID, 'DLVerifyID': VerifyID, 'SexID': SexID, 'RaceID': RaceID, 'PhoneTypeID': PhoneTypeID, 'NameReasonCodeID': NameReasonCodeID, 'CertifiedByID': CertifiedByID, 'EthnicityID': EthnicityID, 'AgeUnitID': AgeUnitID, 'IsJuvenile': IsJuvenile, 'LastName': LastName ? LastName : null, 'FirstName': trimmedFirstName ? trimmedFirstName : null, 'MiddleName': trimmedMiddleName ? trimmedMiddleName : null, 'SSN': SSN, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'Address': Address, 'Contact': Contact, 'OwnerNameID': OwnerNameID, 'OwnerPhoneNumber': OwnerPhoneNumber,
        'OwnerFaxNumber': OwnerFaxNumber, 'DateOfBirth': DateOfBirth, 'CertifiedDtTm': CertifiedDtTm, 'AgeFrom': AgeFrom, 'AgeTo': AgeTo, 'Years': Years, 'ModifiedByUserFK': ModifiedByUserFK, 'MasterNameID': MasterNameID, 'NameID': NameID, 'ArrestID': ArrestID, 'WarrantID': WarrantID, 'TicketID': TicketID, 'checkVictem': checkVictem, 'checkOffender': checkOffender, 'checkArrest': checkArrest, 'CreatedByUserFK': CreatedByUserFK, 'IncidentID': IncidentID, 'NameLocationID': NameLocationID, 'DLNumber': DLNumber, 'DLStateID': DLStateID, 'IsUnknown': IsUnknown, 'Role': formattedRole, 'ResidentID': ResidentID, 'IsInjury': IsInjury, 'VictimTypeID': VictimTypeID, 'RoleName': RoleName,
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
                  if (isCad) {
                    navigate(`/cad/dispatcher?page=MST-Name-Dash&MasterNameID=${stringToBase64(MasterNameID)}&ModNo=${ModNo}&NameStatus=${true}`);
                  } else {
                    navigate(`/Name-Home?page=MST-Name-Dash&MasterNameID=${stringToBase64(MasterNameID)}&ModNo=${ModNo}&NameStatus=${true}`);
                  }
                }
                setChangesStatus(false);
                setValue({
                  ...value,
                  'NameIDNumber': 'Auto Generated', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '', 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '',
                  'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'EthnicityID': '', 'DLNumber': "", 'DLStateID': '', 'IsUnknown': '', 'IsJuvenile': '',
                })
                GetSingleData(nameID, masterNameID); get_List(nameID, masterNameID); get_Name_Count(nameID, masterNameID, MstPage === "MST-Name-Dash" ? true : false); get_Data_Name(mainIncidentID, MstPage === "MST-Name-Dash" ? true : false); setStatesChangeStatus(false);
                if (uploadImgFiles?.length > 0) { upload_Image_File(); setuploadImgFiles('') }
                setErrors({ ...errors, ['ContactError']: 'true', ['NameTypeIDError']: '', });
              } else {
                setChangesStatus(false); toastifyError(res.Message); setErrors({ ...errors, ['NameTypeIDError']: '', });
              }
              // validateIncSideBar
              validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
            })
          } else { toastifyError('SSN Already Exists'); }
        }
      })
    }
  }

  const Reset = () => {
    setroleStatus(false); setIsAdultArrest(false); setisMissing(false); setIsVictim(false); setIsSocietyName(false);
    setarrestCount(''); setmissingpersonCount(''); setpropertyOwnerCount('');
    setIsSecondDropdownDisabled(true); setvictimTypeStatus(false); setnibrsSubmittedName(0); setIsAdult(false);
    setIsOffender(false); setcalled(false); setShowOffender(false); setShowVictim(false); setshowWarrant(false); setDobDate(''); setAvailableAlert([])
    setStatesChangeStatus(false); setOnSelectLocation(true); setChangesStatus(false);
    setErrors({
      ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true', "CrimeLocationError": '', 'AgeFromError': '', 'InjuryError': '', 'ResidentError': '', 'EthnicityErrorr': '',
    })
    setPhoneTypeCode(''); setMultiSelected({ optionSelected: [] }); setMultiSelectedReason({ optionSelected: [], });

    const Id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
    if (Id.length > 0) {
      setValue({
        ...value,
        ['NameTypeID']: Id[0]?.value, 'NameIDNumber': 'Auto Generated', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
        'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '', 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'MasterNameID': '', 'NameID': '', 'EthnicityID': '', 'DLNumber': "", 'DLStateID': '', 'IsUnknown': '', 'IsJuvenile': '', 'VictimCode': '', 'ResidentID': '', 'IsInjury': '', 'VictimTypeID': '',
      })
      setglobalname(''); setglobalnameto(''); setLocationStatus(true); setUpdateStatus(updateStatus + 1); setNameTypeCode(Id[0].id); setIsBusinessName(false); setcountAppear(false); setcountStatus(false);
    }
    setNameMultiImg('');
    setuploadImgFiles('')
  }

  const ResetSearch = () => {
    setShowOffender(false); setShowVictim(false); setshowWarrant(false); setDobDate(''); setAvailableAlert([])
    setErrors({
      ...value, 'NameTypeIDError': '', 'LastNameError': '', 'FirstNameError': '', 'MiddleNameError': '', 'NameReasonCodeIDError': '', 'CertifiedByIDError': '', 'ContactError': 'true', 'WeightError': 'true', 'HeightError': 'true', 'AgeError': 'true', 'DateOfBirthError': '', 'RaceIDError': '', 'SexIDError': '', 'AddressError': 'true', 'SSN': '', 'DLError': 'true',
    })
    setPhoneTypeCode(''); setMultiSelected({ optionSelected: [] });
    setMultiSelectedReason({ optionSelected: [], });
    const Id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
    if (Id.length > 0) {
      setValue({
        ...value,
        'NameIDNumber': 'Auto Generated', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '', 'RaceID': '', 'PhoneTypeID': '', 'NameReasonCodeID': [], 'Role': [], 'CertifiedByID': '', 'AgeUnitID': '', 'IsVerify': true, 'IsUnListedPhNo': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'WeightFrom': '', 'WeightTo': '', 'HeightFrom': '', 'HeightTo': '', 'Address': '', 'Contact': '', 'OwnerPhoneNumber': '', 'OwnerFaxNumber': '', 'OwnerNameID': '', 'DateOfBirth': '', 'CertifiedDtTm': null, 'AgeFrom': '', 'AgeTo': '', 'Years': '', 'MasterNameID': '', 'NameID': '', 'EthnicityID': '', 'DLNumber': "", 'DLStateID': '', 'IsUnknown': '', 'IsJuvenile': '',
      })
      setglobalname(''); setglobalnameto(''); setLocationStatus(true); setUpdateStatus(updateStatus + 1); setIsBusinessName(false); setIsSocietyName(false);
    }
    setNameMultiImg(''); setuploadImgFiles('')
  }

  const OnChangeSelectedReason = (data, name) => {
    let VictimStatusData = data.some(function (item) { return item.label === "Victim" || item.label === "Business Is A Victim" || item.label === "Domestic Victim" || item.label === "Individual Is A Victim" || item.label === "Individual Victim" || item.label === "Other Is A Victim" || item.label === "Restraint Victim" || item.label === "Restraint Victim" || item.label === "Society Is A Victim" });
    if (VictimStatusData) {
      setvictimTypeStatus(true);
    } else if (!nameID) {
      setvictimTypeStatus(false);
    }
    !addUpdatePermission && setStatesChangeStatus(true);
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
      !addUpdatePermission && setChangesStatus(true);
      setValue({
        ...value,
        [name]: finalValueList
      });
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
      !addUpdatePermission && setChangesStatus(true);
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
      !addUpdatePermission && setChangesStatus(true);
      setValue({
        ...value,
        [name]: finalValueList
      })
      setMultiSelected({ optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index) });
    } else {
      let finalValueList = newArray?.map((item) => item.value);
      !addUpdatePermission && setChangesStatus(true);
      setValue({ ...value, [name]: finalValueList })
      setMultiSelected({ optionSelected: newArray });
    }
  };

  const handleDOBChange = (date, e) => {
    !addUpdatePermission && setStatesChangeStatus(true)
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

          const diffInMs = maxAllowedDate - date; // difference in milliseconds
          const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
          // setValue({ ...value, ['AgeFrom']: diffInHours, ['AgeTo']: '', ['Years']: diffInHours, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 2, ['IsJuvenile']: true })
          setValue({ ...value, ['AgeFrom']: 0, ['AgeTo']: '', ['Years']: 0, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, ['AgeUnitID']: 1, ['IsJuvenile']: true })
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
        getNameSearchPopup(loginAgencyID, value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, getShowingWithOutTime(date), value.SSN, false)
      }

    } else if (e?.target?.value?.length) {
      if (e?.target?.value?.length === 10) {
        if (value?.LastName) {
          getNameSearchPopup(loginAgencyID, value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, getShowingWithOutTime(date), value.SSN, false)
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
      // setJuvinile(true)
      setjuvenilestatus(true)
      setValue({ ...value, ['IsJuvenile']: true })
    } else {
      setValue({ ...value, ['IsJuvenile']: false })
      setjuvenilestatus(false)
    }
  }, [value.DateOfBirth, value.AgeFrom, value.AgeUnitID]);

  const AgeFromOnBlur = () => {
    if (value.AgeFrom < 18) {
      setValue({ ...value, ['IsJuvenile']: true })
    }
  }

  const HeightFromOnBlur = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
    const heightstates = e.target.value;
    var len = heightstates.length;
    let heights = "";
    var oldvalue = heightstates.substring(len - 1, len);
    if (oldvalue != "\"") {
      if (len == 0) {
        heights = '';
      }
      else if (len == 1) {
        heights = heightstates.substring(0, len) + "'00\"";
      }
      else if (len == 2) {
        heights = heightstates.substring(0, len - 1) + "'0" + heightstates.substring(len - 1) + "\"";
      }
      else {
        var lengthstate = heightstates.substring(len - 2)
        heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
        if (heightstates.substring(len - 2, len - 1) == 0) {
          heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
        }
        if (lengthstate > 11) {
          heights = '';
          toastifyError('invalid');
        }
      }
    }
    else {
      heights = heightstates;
    }
    const globalname_Fromarray = globalnameto.replace("\"", "").replace("'", "");
    const globalname_Toarray = heights.replace("\"", "").replace("'", "");
    if ((parseInt(globalname_Fromarray) < parseInt(globalname_Toarray))) {
      toastifyError('height should be less');
    }
    if (parseInt(heights.replace("\"", "").replace("'", "")) < 101) {
      toastifyError('Height should be greater than or equal to 1\'01"');
      heights = '';
    }
    if (heights != '') {
      setglobalname(heights);
    }
    setValue({
      ...value,
      ['HeightFrom']: heights,
    })
  }

  const HeightOnChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true)
    const heightstates = e.target.value;
    var len = heightstates.length;
    let heights = "";
    var oldvalue = heightstates.substring(len - 1, len);
    if (oldvalue != "\"") {
      if (len == 0) {
        heights = '';
      }
      else if (len == 1) {
        heights = heightstates.substring(0, len) + "'00\"";
      }
      else if (len == 2) {
        heights = heightstates.substring(0, len - 1) + "'0" + heightstates.substring(len - 1) + "\"";
      }
      else {
        heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
        if (heightstates.substring(len - 2, len - 1) == 0) {
          heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
        }
        var lengthstate = heightstates.substring(len - 2)
        if (lengthstate > 11) {
          heights = '';
          toastifyError('invalid');
        }
      }
    }
    else {
      heights = heightstates;
    }

    const globalname_Fromarray = globalname.replace("\"", "").replace("'", "");
    const globalname_Toarray = heights.replace("\"", "").replace("'", "");

    if ((parseInt(globalname_Fromarray) > parseInt(globalname_Toarray))) {
      toastifyError('height should be greater');

    }
    if (parseInt(heights.replace("\"", "").replace("'", "")) < 101) {
      toastifyError('Height should be greater than or equal to 1\'01"');
      heights = '';
    }

    if (heights != '') {
      setglobalnameto(heights)
    }

    setValue({
      ...value,
      ['HeightTo']: heights,
    })

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

  //---------------------------------------- Image Insert ------------------------------------------------
  const get_Name_MultiImage = (nameID, masterNameID) => {
    const val = { 'NameID': nameID, 'MasterNameID': masterNameID, }
    const val1 = { 'NameID': 0, 'MasterNameID': masterNameID }
    fetchPostData('MasterName/GetData_MasterNamePhoto', openPageName == 'MST-Name-Dash' ? val1 : val)
      .then((res) => {
        if (res) {
          setNameMultiImg(res); setImageModalOfficerID(res[0]?.OfficerID)
        }
        else {
          setNameMultiImg(); setImageModalOfficerID(null)
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
        else { toastifyError(res?.Message); }
      })
  }

  const upload_Image_File = async (namID, namMID) => {
    const formdata = new FormData();
    const EncFormdata = new FormData();
    const newData = [];
    const EncDocs = [];
    for (let i = 0; i < uploadImgFiles.length; i++) {
      const { file, imgData } = uploadImgFiles[i];
      const val = {
        'NameID': nameID ? nameID : namID, 'MasterNameID': masterNameID ? masterNameID : namMID, 'CreatedByUserFK': loginPinID, 'Comments': imgData?.Comments,
        'PictureTypeID': imgData?.PictureTypeID, 'ImageViewID': imgData?.ImageViewID, 'ImgDtTm': imgData?.ImgDtTm, 'OfficerID': imgData?.OfficerID, 'AgencyID': loginAgencyID,
      }
      const val1 = {
        'NameID': 0, 'MasterNameID': masterNameID ? masterNameID : namMID, 'CreatedByUserFK': loginPinID,
        'PictureTypeID': imgData?.PictureTypeID, 'ImageViewID': imgData?.ImageViewID, 'ImgDtTm': imgData?.ImgDtTm,
        'OfficerID': imgData?.OfficerID, 'Comments': imgData?.Comments, 'AgencyID': loginAgencyID,
      }

      const values = JSON.stringify(openPageName === 'MST-Name-Dash' ? val1 : val);
      newData.push(values);
      const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(openPageName === 'MST-Name-Dash' ? val1 : val)]));
      EncDocs.push(EncPostData);
      formdata.append("file", file);
      EncFormdata.append("file", file);
    }

    formdata.append("Data", JSON.stringify(newData));
    EncFormdata.append("Data", EncDocs);
    AddDelete_Img('MasterName/MasterName_Photo', formdata, EncFormdata).then((res) => {
      if (res.success) {
        get_Name_MultiImage(nameID ? nameID : namID, masterNameID ? masterNameID : namMID);
        setuploadImgFiles('')
      }
    })
      .catch(err => console.log(err))
  }

  const delete_Image_File = (e) => {
    e?.preventDefault()
    const value = { 'PhotoID': imageId, 'DeletedByUserFK': loginPinID }
    AddDeleteUpadate('MasterName/Delete_Photo', value).then((data) => {
      if (data.success) {
        const parsedData = JSON.parse(data.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Name_MultiImage(nameID, masterNameID);
        setModalStatus(false); setImageId('');
        if (openPageName === 'MST-Name-Dash') { GetMasterSingleData(masterNameID) } else { GetSingleData(nameID, masterNameID); }
      } else {
        toastifyError(data?.Message);
      }
    });
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




 

  const colourStylesVictimCode = {
    control: (styles) => ({
      ...styles, backgroundColor: "rgb(255 202 194)",
      height: 20,
      minHeight: 33,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  // // Custom Style
  // const colourStyles = {
  //   control: (styles) => ({
  //     ...styles, backgroundColor: "#fce9bf",
  //     height: 20,
  //     minHeight: 33,
  //     fontSize: 14,
  //     margintop: 2,
  //     boxShadow: 0,
  //   }),
  // };

  const colourStylesReason = {
    control: (styles) => ({
      ...styles,
      backgroundColor: isSocietyName ? '#9d949436' : "#FFE2A8",
      fontSize: 14,
      marginTop: 2,
    }),
  };

  // -------------conditional border------------
  // const colourStylesReason = {
  //   control: (styles) => ({
  //     ...styles,
  //     backgroundColor: isSocietyName ? '#9d949436' : "#FFE2A8",
  //     fontSize: 14,
  //     marginTop: 2,
  //     boxShadow: "none",
  //     minHeight: 33,
  //     border: isSocietyName ? "none" : "1px solid #A65E00",
  //   }),
  // };

  const colourStylesMasterReason = {
    control: (styles) => ({
      ...styles,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
      minHeight: 33,
    }),
  };



  const customStylesWithColor2 = {
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

  const blinkAnimationStyle = {
    animation: 'blink-animation 1s infinite',
    fontSize: '16px',
    color: 'red',
  };

  const onChangeReaonsRole = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    const newArray = [...(e || [])];
    const finalValueList = newArray.map(item => item.value);
    setIsSecondDropdownDisabled(finalValueList?.length === 0);
    // Define role values
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
    if (finalValueList.includes(VICTIM_ROLE_ID)) {
      setroleStatus(true); get_Victim_Type_Data(loginAgencyID, value.NameTypeID);
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
      GetReasonIdDrp(loginAgencyID, value.NameTypeID, []); setMultiSelected({ optionSelected: [] });
      setValue(prev => ({ ...prev, NameReasonCodeID: [], VictimTypeID: '' }));
    }
    setMultiSelectedReason({ optionSelected: newArray });
  };


  const ReasonCodeRoleArr = [
    { value: 1, label: 'Victim' },
    { value: 2, label: 'Offender' },
    { value: 3, label: 'Other' }
  ]

  const filteredReasonCodeRoleArr = nameTypeCode === 'B'
    ? ReasonCodeRoleArr.filter(item => item.value !== 2)
    : ReasonCodeRoleArr;

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
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
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



  // validate Incident
  const nibrsValidateName = (incidentID, reportDate, baseDate, oriNumber) => {
    setclickNibLoder(true);
    const val = {
      'gIntAgencyID': loginAgencyID,
      "IsIncidentCheck": true,
      "gIncidentID": incidentID,
      "dtpDateTo": reportDate,
      "dtpDateFrom": reportDate,
      "BaseDate": baseDate,
      "strORINumber": oriNumber,
      "strComputerName": uniqueId,
      "rdbSubmissionFile": false,
      "rdbErrorLog": false,
      "rdbNonReportable": false,
      "chkPastErrorPrint": false,
      "rdbOne": false,
      "rdbTwoMonth": false,
      "rdbThreeMonth": false,
      "rdbAllLogFile": false,
      "IPAddress": ""
    }
    fetchPostData('NIBRS/TXIBRS', val).then((data) => {
      if (data) {
        const arr1 = data[0]?.ErrorObject?.Offender
        const arr2 = data[0]?.ErrorObject?.Victim
        const mergeArr = [...(arr1 || []), ...(arr2 || [])]
        setnibrsValidateNameData(mergeArr); setclickNibLoder(false);
      } else {
        setnibrsValidateNameData([]); setclickNibLoder(false);
      }
    })
  }

  const getNibrsErrorToolTip = (nameId, uniqueId, mainIncidentID) => {
    const val = {
      "OffenderId": nameId, "VictimID": nameId, "strComputerName": uniqueId, "gIncidentID": mainIncidentID, "OffenseID": "", 'CrimeID': "",
    }
    fetchPostData('NIBRS/ReturnCrimeId', val).then((res) => {
      if (res) {
        setNibFieldStatusOrErr(res[0]);
      } else {
        setNibFieldStatusOrErr({});
      }
    })
  }

  // const colourStylesRole = {
  //   control: (styles) =>
  //   ({
  //     ...styles, backgroundColor: "#fce9bf",
  //     fontSize: 14,
  //     margintop: 2,
  //     boxShadow: 0,
  //   }),
  // };

  const getLimitedTimesUpTo = (limitDate) => {
    const times = [];
    const start = new Date(limitDate);
    start.setHours(0, 0, 0, 0);
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
    setDobDate(date); updateAllowTimeSelect(date); handleDOBChange(date, e); !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
  };

  const setToReset = () => {
  }

  const DeleteContactDetail = () => {
    const val = { 'NameID': nameID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('MasterName/Delete_NameEvent', val).then((res) => {
      if (res) {
        const parseData = JSON.parse(res.data);
        toastifySuccess(parseData?.Table[0].Message);
        get_NameTypeData(loginAgencyID); get_Data_Name(mainIncidentID, MstPage === "MST-Name-Dash" ? true : false);
        setStatesChangeStatus(false); get_Incident_Count(mainIncidentID, loginPinID);
        // get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);

        Reset();
        setStatusFalse();
        // Get_ContactDetailsData(DecNameID, DecMasterNameID)
      } else console.log("Somthing Wrong");
    })
  }


  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false); return (
    <>
      <div className="row child">

        <div className="col-12  modal-table mt-3 "  >
          {
            MstPage != "MST-Name-Dash" &&
            <DataTable
              className="scrollableTableBody"
              dense
              columns={columns}
              data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? nameFilterData : [] : nameFilterData}
              selectableRowsHighlight
              highlightOnHover
              responsive
              fixedHeader
              fixedHeaderScrollHeight='135px'
              customStyles={tableCustomStyles}
              conditionalRowStyles={conditionalRowStyles}

              onRowClicked={(row) => {
                set_Edit_Value(row);
              }}
              persistTableHead={true}
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
          }
        </div>
        {/* bb */}
        <div className="col-12 col-md-12 col-lg-12 ">
          <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
            <div className="col-2 col-md-2 col-lg-1">
              <label htmlFor="" className='label-name mb-0'>Name Type
                {errors.NameTypeIDError !== 'true' ? (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.NameTypeIDError}</p>
                ) : null}
              </label>
            </div>
            <div className="col-3 col-md-3 col-lg-2">
              <Select
                name='NameTypeID'
                value={nameTypeData?.filter((obj) => obj.value === value?.NameTypeID)}
                options={nameTypeData}
                onChange={(e) => ChangeNameType(e, 'NameTypeID')}

                placeholder="Select..."
                styles={nibrsSubmittedName === 1 ? LockFildscolour : Requiredcolour}
                isDisabled={nameID || masterNameID || nibrsSubmittedName === 1 ? true : false}

              />
            </div>
            <div className="col-2 col-md-2 col-lg-1">
              <label htmlFor="" className='label-name mb-0'>MNI</label>
            </div>
            <div className="col-2 col-md-3 col-lg-2 text-field mt-0">
              <input type="text" className='readonlyColor' value={value?.NameIDNumber} name='nameid' required readOnly />
            </div>
            <div className="col-3 col-md-2 col-lg-1">
              <div className="form-check ">

                {
                  !(nameTypeCode === "B") && (
                    value.DateOfBirth || value.AgeFrom ? (
                      <>
                        <input className="form-check-input" type="checkbox" name="IsJuvenile" value={value?.IsJuvenile} checked={value?.IsJuvenile} id="flexCheckDefault" disabled={nameTypeCode === "B" || nibrsSubmittedName === 1} />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          Juvenile
                        </label>
                      </>
                    ) : (
                      <>
                        <input className="form-check-input" type="checkbox" name="IsJuvenile" value={value?.IsJuvenile} checked={false} id="flexCheckDefault" disabled={nameTypeCode === "B" || nibrsSubmittedName === 1} />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          Juvenile
                        </label>
                      </>
                    )
                  )
                }
              </div>
            </div>

            <div className='col-3 col-md-2 col-lg-5'>
              {
                (!value.IsUnknown && ((masterNameID && MstPage === "MST-Name-Dash") || nameID)) ? (
                  // <div className="col-lg-5">
                  <AlertTable
                    availableAlert={availableAlert}
                    masterPropertyID={masterNameID ? masterNameID : ''}
                    ProSta={NameStatus}
                  />
                  // </div>
                ) : null
              }
            </div>





            {
              nameTypeCode === "B" ?

                <>
                  <div className="col-1 col-md-1 col-lg-1 ">
                    <label htmlFor="" className='label-name mb-0 text-nowrap'>Business Name
                      {errors.LastNameError !== 'true' && nameTypeCode === 'B' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</p>
                      ) : null}</label>
                  </div>
                  <div className="col-2 col-md-2 col-lg-4 text-field mt-0">
                    <input type="text" name='LastName'
                      className={isSocietyName ? 'readonlyColor' : 'requiredColor'}
                      value={value?.LastName}
                      disabled={isSocietyName}
                      onChange={HandleChange}
                      required />
                  </div>
                  {
                    !nameID &&
                    <div className="col-12 col-md-3 col-lg-1 name-box mt-0 text-center " >
                      <button type="button" data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-success" onClick={() => getNameSearch(loginAgencyID, value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.HeightFrom, value.HeightTo, value.WeightFrom, value.WeightTo, value.EthnicityID, value.RaceID, value.SexID, value.PhoneTypeID, value.Contact, true)}>Search</button>
                    </div>
                  }
                  <div className="col-1 col-md-1 col-lg-1">
                    <label htmlFor="" className='label-name mb-0'>Business Type</label>
                  </div>
                  <div className="col-2 col-md-2 col-lg-5">
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

                  <div className="col-1 col-md-1 col-lg-1">
                    <label htmlFor="" className='label-name mb-0 '>Owner Name</label>
                  </div>
                  <div className="col-2 col-md-2 col-lg-3">
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
                  <div className="col-1 " data-toggle="modal" data-target="#MasterModal"  >
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
                  <div className="col-1 col-md-1 col-lg-1">
                    <label htmlFor="" className='label-name mb-0'>Owner&nbsp;Phone&nbsp;No.{errors.OwnerPhoneNumberError !== 'true' ? (
                      <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OwnerPhoneNumberError}</p>
                    ) : null}</label>
                  </div>
                  <div className="col-2 col-md-2 col-lg-2 text-field mt-0">
                    <input type="text" name='OwnerPhoneNumber' maxLength={11} className={''} value={value?.OwnerPhoneNumber} onChange={HandleChange} required />

                  </div>

                  <div className="col-1 col-md-1 col-lg-2 ">
                    <label htmlFor="" className='label-name px-0 mb-0'>Business Fax No.{errors.OwnerFaxNumberError !== 'true' ? (
                      <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OwnerFaxNumberError}</p>
                    ) : null}</label>
                  </div>
                  <div className="col-2 col-md-2 col-lg-2 text-field mt-0">
                    <input type="text" name='OwnerFaxNumber' className={''} value={value?.OwnerFaxNumber} onChange={HandleChange} required />
                  </div>
                </>

                :

                <>
                  <div className="col-2 col-md-2 col-lg-1">
                    <label htmlFor="" className='label-name mb-0'>Last Name
                      {errors.LastNameError !== 'true' && nameTypeCode !== 'B' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</p>
                      ) : null}</label>
                  </div>
                  <div className="col-10 col-md-10 col-lg-2 text-field mt-0">
                    <input type="text" name='LastName' maxLength={100} onBlur={(e) => { e.relatedTarget !== saveButtonRef.current && e.relatedTarget !== closeButtonRef.current && LastFirstNameOnBlur(e) }} className={nameTypeCode === "B" || nibrsSubmittedName === 1 ? 'LockFildsColor' : 'requiredColor'} value={value?.LastName} onClick={() => { !addUpdatePermission && setChangesStatus(true); }} onChange={HandleChange} required disabled={nameTypeCode === "B" || nibrsSubmittedName === 1 ? true : false} readOnly={nameTypeCode === "B" || nibrsSubmittedName === 1 ? true : false} autoComplete='off' />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1">
                    <label htmlFor="" className='label-name mb-0'>First Name
                      {errors.FirstNameError !== 'true' && nameTypeCode !== 'B' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</p>
                      ) : null}
                    </label>
                  </div>
                  <div className="col-2 col-md-4 col-lg-2 text-field mt-0">
                    <input type="text" maxLength={50} ref={firstNameInputRef} name='FirstName'
                      onBlur={(e) => { e.relatedTarget !== saveButtonRef.current && LastFirstNameOnBlur(e) }}
                      className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1) ? 'LockFildsColor' : ''} value={value?.FirstName} onChange={HandleChange} required disabled={nameTypeCode === "B" || nibrsSubmittedName === 1 ? true : false} readOnly={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1) ? true : false} onClick={() => { !addUpdatePermission && setChangesStatus(true); }} autoComplete='off' />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1">
                    <label htmlFor="" className='label-name mb-0 '>Middle Name
                      {errors.MiddleNameError !== 'true' && nameTypeCode !== 'B' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.MiddleNameError}</p>
                      ) : null}
                    </label>
                  </div>
                  <div className="col-2 col-md-4 col-lg-2 text-field mt-0">
                    <input type="text" name='MiddleName' maxLength={50} value={value?.MiddleName} className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1) ? 'LockFildsColor' : ''} onChange={HandleChange} required disabled={nameTypeCode === "B" || nibrsSubmittedName === 1 ? true : false} readOnly={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1) ? true : false} onClick={() => { !addUpdatePermission && setChangesStatus(true); }} autoComplete='off' />
                  </div>
                  <div className="col-12 col-md-12 col-lg-3 d-flex align-items-center ">
                    <div className="col-2 col-md-2 col-lg-2 ml-4 ml-md-0">
                      <label htmlFor="" className='label-name mb-0'>Suffix</label>
                    </div>
                    <div className="col-8 col-md-8 col-lg-6 ">
                      <Select
                        name='SuffixID'
                        value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                        options={suffixIdDrp}
                        onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                        isClearable
                        placeholder="Select..."

                        isDisabled={nameTypeCode === "B" || nibrsSubmittedName === 1 ? true : false}

                        styles={nibrsSubmittedName === 1 ? LockFildscolour : customStylesWithOutColor}

                      />
                    </div>
                    <div className="col-4 col-md-2 col-lg-4">
                      <div className="form-check">
                        <input className="form-check-input " type="checkbox" name='IsUnknown' value={value?.IsUnknown} checked={value?.IsUnknown} onChange={HandleChange} id="flexCheckDefault1" disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} />
                        <label className="form-check-label label-name  pr-md-2" htmlFor="flexCheckDefault1">
                          Unknown
                        </label>
                      </div>
                    </div>
                  </div>
                </>

            }



            {
              nameTypeCode === "B" ?
                <>
                </>
                :
                <>


                  <div className="col-1 col-md-2 col-lg-1">
                    <label htmlFor="" className='label-name mb-0'>DOB
                      {errors.DateOfBirthError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DateOfBirthError}</p>
                      ) : null}</label>

                  </div>
                  <div className="col-2 col-md-3 col-lg-2">
                    <DatePicker
                      id='DateOfBirth'
                      name='DateOfBirth'
                      ref={startRef}
                      selected={dobDate}
                      onChange={handleDateChange}
                      onKeyDown={(e) => {
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                          e.preventDefault();
                        } else {
                          onKeyDown(e);
                        }
                      }}
                      dateFormat={allowTimeSelect ? "MM/dd/yyyy" : "MM/dd/yyyy"}
                      // showTimeSelect={allowTimeSelect} // Always show time picker
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      timeCaption="Time"
                      placeholderText={value.DateOfBirth ? value.DateOfBirth : 'Select...'}
                      isClearable={value.DateOfBirth ? true : false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      autoComplete="off"
                      maxDate={maxAllowedDate}
                      disabled={nameTypeCode === "B" || nibrsSubmittedName === 1}
                      className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1) ? 'LockFildsColor' : '' ? 'requiredColor' : ''}
                      readOnly={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1)}
                      // Disable time input if not allowed
                      timeInputLabel={allowTimeSelect ? "" : "Time Not Available"}
                      includeTimes={
                        dobDate && isSameDate(dobDate, maxAllowedDate)
                          ? getLimitedTimesUpTo(maxAllowedDate)
                          : undefined
                      }
                    />
                  </div>


                  <div className="col-12 col-md-7 col-lg-3">
                    <div className="row align-items-center">
                      <div className="col-12 col-md-1">
                        <label htmlFor="" className='label-name mb-0'>Age {errors.AgeFromError !== 'true' ? (
                          <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.AgeFromError}</p>
                        ) : null}</label>
                      </div>
                      <div className="col-5 col-md-2 mt-0 text-field px-0" >
                        <input type="text" name='AgeFrom' maxLength={3}
                          // className={value.DateOfBirth || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1 ? 'LockFildsColor' : victimTypeStatus || isAdult || IsOffender ? 'requiredColor' : ''}
                          className={
                            nibrsSubmittedName === 1 ? 'LockFieldsColor' : value.DateOfBirth || value?.IsUnknown === 'true' || value?.IsUnknown === true ? 'readonlyColor'
                              : victimTypeStatus || isAdult || IsOffender ? 'requiredColor' : ''
                          }

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
                          disabled={(value.DateOfBirth ? true : false) || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1}
                          readOnly={(value.DateOfBirth ? true : false) || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1} placeholder='From' autoComplete='off' />
                      </div>
                      <div className="col-1 text-center px-0">
                        <span className="dash-name">_</span>
                      </div>
                      <div className="col-5 col-md-2 mt-0 text-field px-0 " >
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

                          value={value?.AgeTo} onChange={HandleChange} required
                          // className={value.DateOfBirth || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1 ? 'LockFildsColor' : ''}
                          className={
                            value.DateOfBirth || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true ? 'readonlyColor'
                              : nibrsSubmittedName === 1 ? 'LockFildscolour' : ''
                          }
                          disabled={value.DateOfBirth ? true : false || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1} readOnly={value.DateOfBirth ? true : false || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1} placeholder='To' autoComplete='off' />


                      </div>
                      <div className="col-5 col-md-6" >
                        <Select
                          name='AgeUnitID'
                          value={ageUnitDrpData?.filter((obj) => obj.value === value?.AgeUnitID)}
                          options={ageUnitDrpData}
                          onChange={(e) => ChangeDropDown(e, 'AgeUnitID')}
                          isClearable
                          placeholder="Age Unit..."
                          styles={value.AgeFrom ? Requiredcolour : customStylesWithOutColor}

                          isDisabled={value.DateOfBirth ? true : false || !value?.AgeFrom || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1}

                        />
                      </div>
                    </div>
                  </div>



                  <div className="col-2 col-md-2 col-lg-1">
                    <span data-toggle="modal" onClick={() => { setOpenPage('Gender') }} data-target="#ListModel" className='new-link px-0'>
                      Gender {errors.SexIDError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.SexIDError}</p>
                      ) : null}
                    </span>
                  </div>
                  <div className="col-10 col-md-10 col-lg-2 ">
                    <Select

                      styles={nibrsSubmittedName === 1 ? LockFildscolour : (value?.VictimCode === 'I' || value?.VictimCode === 'L') && !value.SexID && value?.IsUnknown !== 'true' && value?.IsUnknown !== true && !isAdult ? colourStylesVictimCode : (isAdult || IsOffender || victimTypeStatus ? Requiredcolour : customStylesWithOutColor)}

                      name='SexID'
                      value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                      options={sexIdDrp}
                      onChange={(e) => ChangeDropDown(e, 'SexID')}
                      isClearable
                      placeholder="Select..."
                      isDisabled={nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1 ? true : false}
                    />
                  </div>
                  <div className="col-2 col-md-2 col-lg-1 px-0">
                    <span data-toggle="modal" onClick={() => { setOpenPage('Race') }} data-target="#ListModel" className='new-link px-0'>
                      Race{errors.RaceIDError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RaceIDError}</p>
                      ) : null}
                    </span>
                  </div>
                  <div className="col-10 col-md-10 col-lg-2">
                    <Select
                      name='RaceID'
                      value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                      options={raceIdDrp}
                      onChange={(e) => ChangeDropDown(e, 'RaceID')}
                      isClearable
                      placeholder="Select..."
                      isDisabled={nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1 ? true : false}

                      styles={nibrsSubmittedName === 1 ? LockFildscolour : (value?.VictimCode === 'I' || value?.VictimCode === 'L') && !value.RaceID && value?.IsUnknown !== 'true' && value?.IsUnknown !== true && !isAdult ? colourStylesVictimCode : (isAdult || IsOffender || victimTypeStatus ? Requiredcolour : customStylesWithOutColor)}

                    />
                  </div>



                  <div className="col-2 col-md-2 col-lg-1">
                    <span data-toggle="modal" onClick={() => { setOpenPage('Ethnicity') }} data-target="#ListModel" className='new-link px-0'>
                      Ethnicity{errors.EthnicityErrorr !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.EthnicityErrorr}</p>
                      ) : null}

                    </span>
                  </div>
                  <div className="col-10 col-md-10 col-lg-2">
                    <Select
                      name='EthnicityID'
                      value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                      options={ethinicityDrpData}
                      onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                      isClearable
                      placeholder="Select..."
                      styles={nibrsSubmittedName === 1 ? LockFildscolour : (value?.IsUnknown === 'true' || value?.IsUnknown === true) ? customStylesWithOutColor : victimTypeStatus ? Requiredcolour : ''}

                      isDisabled={value?.IsUnknown === 'true' || value?.IsUnknown === true || nibrsSubmittedName === 1 ? true : false}
                    />
                  </div>

                  <div className='col-lg-3'>
                    <div className='row align-items-center'>
                      <div className="col-12 col-md-3 ">
                        <label htmlFor="" className='label-name mb-0 text-nowrap'>Weight
                          <p className='text-center mb-0' style={{ fontWeight: 'bold', fontSize: '10px' }}>(LBS)</p>
                          {errors.WeightError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.WeightError}</p>
                          ) : null}
                        </label>
                      </div>
                      <div className="col-5 col-md-4  text-field mt-0" >
                        <input type="text" name='WeightFrom' ref={crossButtonRef} onBlur={(e) => {
                          if (e.target.name === 'WeightFrom' &&
                            e.relatedTarget !== crossButtonRef.current &&
                            e.relatedTarget?.name !== 'HeightFrom' &&
                            e.relatedTarget?.name !== 'HeightTo') {
                            handleWeightFromBlur(e);
                          }
                        }} value={value?.WeightFrom} maxLength={3} onKeyDown={handleKeyDown} onChange={HandleChange} required disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} className={nameTypeCode === "B" ? 'readonlyColor' : ''} placeholder='From' autoComplete='off' />
                      </div>
                      <div className="col-2 col-md-1 text-center">
                        <span className="dash-name">_</span>
                      </div>
                      <div className="col-5 col-md-4 ">
                        <div className="text-field mt-0">
                          <input type="text" name='WeightTo' ref={crossButtonRef} onBlur={(e) => {
                            if (e.target.name === 'WeightTo' &&
                              e.relatedTarget !== crossButtonRef.current &&
                              e.relatedTarget?.name !== 'HeightFrom' &&
                              e.relatedTarget?.name !== 'HeightTo') {
                              handleWeightToBlur(e);
                            }
                          }} value={value?.WeightTo} maxLength={3} onChange={HandleChange} required className={(nameTypeCode === "B" || !value?.WeightFrom || value.WeightFrom === '0' || value.WeightFrom === '00' || value.WeightFrom === '000') ? 'readonlyColor' : ''} disabled={(nameTypeCode === "B" || !value?.WeightFrom || value.WeightFrom === '0' || value.WeightFrom === '00' || value.WeightFrom === '000') ? true : false} readOnly={nameTypeCode === "B" ? true : false} placeholder='To' autoComplete='off' />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-lg-3'>
                    <div className='row align-items-center'>
                      <div className="col-12 col-md-3  ">
                        <label htmlFor="" className='label-name mb-0 text-nowrap'>Height
                          <p className='text-center mb-0' style={{ fontWeight: 'bold', fontSize: '10px' }}>(FT)</p>
                          {errors.HeightError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.HeightError}</p>
                          ) : null}
                        </label>
                      </div>
                      <div className="col-5 col-md-4 text-field mt-0" >
                        <input type="text" name='HeightFrom' maxLength={3} value={value?.HeightFrom}
                          onBlur={(e) => {
                            if (e.target.name === 'HeightFrom' && e.relatedTarget !== crossButtonRef.current &&
                              e.relatedTarget?.name !== 'WeightFrom' &&
                              e.relatedTarget?.name !== 'WeightTo') {
                              HeightFromOnBlur(e);
                            }
                          }}
                          onChange={HandleChange}
                          required
                          onKeyDown={handleKeyDown} disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} className={nameTypeCode === "B" ? 'readonlyColor' : ''} placeholder='From' autoComplete='off' />
                      </div>
                      <div className="col-2 col-md-1 text-center">
                        <span className="dash-name">_</span>
                      </div>
                      <div className="col-5 col-md-4 ">
                        <div className="text-field mt-0">
                          <input type="text" name='HeightTo' maxLength={3} value={value?.HeightTo} onBlur={(e) => {
                            if (e.target.name === 'HeightTo' && e.relatedTarget !== crossButtonRef.current &&
                              e.relatedTarget?.name !== 'WeightFrom' &&
                              e.relatedTarget?.name !== 'WeightTo') {
                              HeightOnChange(e);
                            }
                          }}
                            onChange={HandleChange} required className={nameTypeCode === "B" || !value.HeightFrom ? 'readonlyColor' : ''} disabled={nameTypeCode === "B" || !value.HeightFrom ? true : false} readOnly={nameTypeCode === "B" ? true : false} placeholder='To' autoComplete='off' />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-2 col-md-2 col-lg-1 px-0" >
                    <span data-toggle="modal" onClick={() => { setOpenPage('Resident') }} data-target="#ListModel" className='new-link px-0'>
                      Resident{errors.ResidentError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ResidentError}</p>
                      ) : null}
                    </span>
                  </div>
                  <div className="col-10 col-md-10 col-lg-2">
                    <Select
                      name="ResidentID"
                      value={residentIDDrp?.filter((obj) => obj.value === value?.ResidentID) || null}
                      options={residentIDDrp}
                      onChange={(e) => ChangeDropDownResident(e, 'ResidentID')}
                      isClearable
                      placeholder="Select..."
                      menuPlacement="bottom"
                      styles={nibrsSubmittedName === 1 ? LockFildscolour : victimTypeStatus ? Requiredcolour : ''}
                      isDisabled={nibrsSubmittedName === 1 ? true : false}
                    />
                  </div>


                  <div className='col-12 col-md-12 col-lg-12'>
                    <fieldset className='mt-0 pb-1' style={{ width: "100%" }}>
                      <legend>SSN/DL Info </legend>
                    </fieldset>
                  </div>

                  <div className="col-2 col-md-2 col-lg-1">
                    <label htmlFor="" className='label-name mb-0 '>SSN
                      {errors.SSN !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.SSN}</p>
                      ) : null}</label>
                  </div>
                  <div className="col-3 col-md-3 col-lg-2 text-field mt-0" >
                    <input style={{ height: "35px" }} type="text"
                      readOnly={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? true : false}
                      className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? 'readonlyColor' : ''} maxLength={10} name='SSN' value={value?.SSN}
                      onChange={HandleChange} required autoComplete='off' />
                  </div>
                  <div className="col-3 col-md-6 col-lg-5 d-flex row align-items-center " >
                    <div className="col-2 col-md-2 col-lg-2 pl-2">
                      <label htmlFor="" className='label-name mb-0'>State/DL#</label>
                    </div>
                    <div className="col-3 col-md-5 col-lg-6" >
                      <Select
                        name='DLStateID'
                        value={stateList?.filter((obj) => obj.value === value?.DLStateID)}
                        options={stateList}
                        onChange={(e) => ChangeDropDown(e, 'DLStateID')}
                        isClearable
                        placeholder="State"
                        styles={customStylesWithOutColor}
                        className={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? 'readonlyColor' : ''}
                        isDisabled={(nameTypeCode === "B" || value?.IsUnknown === 'true' || value?.IsUnknown === true) ? true : false}
                      />
                    </div>
                    <span className='dash-name' >
                      {errors.DLError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.DLError}</p>
                      ) : null}
                    </span>
                    <div className="col-3 col-md-5 col-lg-4 text-field mt-0" >
                      <input
                        type="text"
                        className={value?.DLStateID ? 'requiredColor' : 'readonlyColor'}
                        style={{ textTransform: "uppercase" }}
                        value={value?.DLNumber ? value.DLNumber.replace(/[^\w\s]/g, '') : ''}
                        maxLength={15}
                        disabled={value?.DLStateID ? false : true}
                        onChange={HandleChange}
                        name="DLNumber"
                        required
                        autoComplete='off'
                      />
                    </div>
                  </div>
                  <div className="col-3 col-md-6 col-lg-4 d-flex align-items-center " >
                    <div className="col-2 col-md-2 col-lg-4">
                      <span data-toggle="modal" onClick={() => { setOpenPage('Verify') }} data-target="#ListModel" className='new-link px-0'>
                        How Verify
                      </span>
                    </div>
                    <div className="col-10 col-md-10 col-lg-8">
                      <Select
                        name='VerifyID'
                        value={verifyIdDrp?.filter((obj) => obj.value === value?.VerifyID)}
                        options={verifyIdDrp}
                        onChange={(e) => ChangeDropDown(e, 'VerifyID')}
                        isClearable
                        placeholder="Verify ID"
                        styles={customStylesWithOutColor}
                        isDisabled={!value?.DLStateID}
                      />
                    </div>
                  </div>




                </>
            }







            <div className="col-2 col-md-2 col-lg-1">
              <label htmlFor="" className='label-name mb-0 '>
                Role {errors.RoleError !== 'true' ? (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RoleError}</p>
                ) : null}
              </label>
            </div>
            <div className="col-3 col-md-3 col-lg-3">
              <SelectBox
                options={filteredReasonCodeRoleArr || []}
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
                  if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && NameTabCount?.NameWarrantCount > 0
                  ) { return; }
                  if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && arrestCount > 0
                  ) { return; }
                  if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && missingpersonCount > 0
                  ) { return; }
                  if ((action === 'remove-value' || action === 'pop-value') && removedOption?.value === 3 && propertyOwnerCount > 0
                  ) { return; }
                  const isRemovingVictim = removedOption?.value === 1;

                  if ((action === 'remove-value' || action === 'pop-value') && isRemovingVictim && value.checkVictem === 1 && nameID) {
                    return;
                  }
                  if ((action === 'remove-value' || action === 'pop-value') && isRemovingVictim && value.checkVictem !== 1) {
                    setMultiSelected({ optionSelected: [] });
                    setValue(prev => ({ ...prev, NameReasonCodeID: null }));
                  }
                  onChangeReaonsRole(selectedOptions, 'Role');
                }}

                styles={nibrsSubmittedName === 1 || isSocietyName ? LockFildscolour : MstPage === "MST-Name-Dash" ? 'readonlyColor' : colourStylesRole}
                isDisabled={nibrsSubmittedName === 1 || isSocietyName || MstPage === "MST-Name-Dash"}
              />

            </div>
            <div className="col-2 col-md-2 col-lg-1">
              <label htmlFor="" className='label-name mb-0'>
                Reason Code
                {errors.NameReasonCodeIDError !== 'true' ? (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.NameReasonCodeIDError}</p>
                ) : null}</label>
            </div>
            <div className="col-10 col-md-10 col-lg-4" >
              <SelectBox
                styles={nibrsSubmittedName === 1 || isSocietyName ? LockFildscolour : MstPage === "MST-Name-Dash" ? colourStylesMasterReason : colourStylesReason}
                isDisabled={nibrsSubmittedName === 1 || isSocietyName || isSecondDropdownDisabled && MstPage !== "MST-Name-Dash" ? true : false}
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
                  ];

                  const removedOption = actionMeta.removedValue;
                  const action = actionMeta.action;
                  console.log(removedOption?.reasonCode);
                  if (
                    (action === 'remove-value' || action === 'pop-value') &&
                    removedOption?.reasonCode === 'WAR' &&
                    NameTabCount?.NameWarrantCount > 0
                  ) {
                    return;
                  }
                  if (
                    (action === 'remove-value' || action === 'pop-value') &&
                    (removedOption?.reasonCode === 'ADAR' || removedOption?.reasonCode === 'JVA') &&
                    arrestCount > 0
                  ) {
                    return;
                  }
                  if (
                    (action === 'remove-value' || action === 'pop-value') &&
                    (removedOption?.reasonCode === 'MIS') &&
                    missingpersonCount > 0
                  ) {
                    return;
                  }
                  if (
                    (action === 'remove-value' || action === 'pop-value') &&
                    (removedOption?.reasonCode === 'OWN') &&
                    propertyOwnerCount > 0
                  ) {
                    return;
                  }
                  if ((action === 'remove-value' || action === 'pop-value') && removedOption) {
                    const isVictim = victimLabels.includes(removedOption.label);
                    const currentVictimCount = multiSelected.optionSelected.filter(opt =>
                      victimLabels.includes(opt.label)
                    ).length;

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

              roleStatus && MstPage !== "MST-Name-Dash" ?

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
                      isDisabled={isSocietyName}

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

            {/*  */}
            <div className="col-lg-5" style={{ margin: '0 auto' }} >
              <div className='row align-items-center' style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'nowrap' }}>
                {
                  nameID && NameTabCount?.NameOffenseCount <= 0 && (
                    <span
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: isHovered ? 'blue' : 'red', border: '1px solid red', backgroundColor: '#fbecec',
                        borderRadius: '4px', padding: '4px 8px', margin: '0 auto',
                        cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                        width: 'fit-content', height: 'fit-content',

                      }}
                      className="col-12 col-md-4" onClick={() => setNameShowPage('Offense')}>
                      Add Offense
                    </span>
                  )
                }
                {
                  isMissing && MstPage !== "MST-Name-Dash" ? (
                    <span
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="col-12 col-md-4"
                      // style={{ color: 'red', display: "flex", justifyContent: "end" }}
                      style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        color: isHovered ? 'blue' : 'red', border: '1px solid red', backgroundColor: '#fbecec',
                        borderRadius: '4px', padding: '4px 8px', margin: '0 auto',
                        cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                        width: 'fit-content', height: 'fit-content',

                      }}
                      onClick={(e) => { navigate(`/Missing-Home?IncId=${stringToBase64(mainIncidentID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(nameID)}&MasterNameID=${stringToBase64(masterNameID)}&NameStatus=${true}&MissPerSta=${false}`) }}
                    >
                      Missing Person
                    </span>
                  ) : <></>
                }
                {

                }
                {isAdultArrest && MstPage !== "MST-Name-Dash" ? (
                  <span
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="col-12 col-md-4"
                    style={{
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      color: isHovered ? 'blue' : 'red', border: '1px solid red', backgroundColor: '#fbecec',
                      borderRadius: '4px', padding: '4px 8px', margin: '0 auto',
                      cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                      width: 'fit-content', height: 'fit-content',
                    }}
                    onClick={(e) => { navigate(`/Arrest-Home?IncId=${stringToBase64(mainIncidentID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(nameID)}&MasterNameID=${stringToBase64(masterNameID)}&NameStatus=${true}`) }}
                  >
                    Arrest
                  </span>
                ) : <></>
                }
              </div>
            </div>







          </div>
        </div >
      </div>

      <div className='col-12 col-md-12 col-lg-12'>
        <fieldset className='mt-0 pb-1' style={{ width: "100%" }}>
          <legend>Address/Contact Info </legend>
        </fieldset>
      </div>

      <div className='row align-items-center mt-1' style={{ rowGap: "8px" }}>
        <div className='col-5 col-md-8 col-lg-11'>
          <div className='row align-items-center' style={{ rowGap: "8px" }}>
            <div className="col-3 col-md-2 col-lg-1">
              <label htmlFor="" className='label-name mb-0'>Address
                {errors.CrimeLocationError !== 'true' ? (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CrimeLocationError}</p>
                ) : null}</label>
            </div>
            <div className="col-7  col-md-7 col-lg-9 mt-0 text-field" >
              <Location {...{ value, setValue, setChangesStatus, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setStatesChangeStatus }} col='Address' locationID='NameLocationID' check={isAdult ? false : false} verify={value.IsVerify} page='Name' />
            </div>
            <div className="col-3 col-md-3 col-lg-2">
              <div className="form-check ">
                <input className="form-check-input" type="checkbox" name='IsVerify' value={value?.IsVerify} checked={(value?.IsVerify || !value?.NameLocationID)} onChange={HandleChange} data-toggle="modal" data-target="#NameVerifyModal" id="flexCheckDefault3" />
                <label className="form-check-label mr-2" htmlFor="flexCheckDefault3">
                  Verify
                </label>
                {
                  !value?.IsVerify && addVerifySingleData.length > 0 ?
                    <i className="fa fa-edit " onKeyDown={''} onClick={() => { if (value.NameLocationID) { get_Add_Single_Data(value.NameLocationID); setModalStatus(true); } }} data-toggle="modal" data-target="#NameVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                    :
                    <>
                    </>
                }
              </div>
            </div>
            <div className="col-2 col-md-2 col-lg-1 px-0">
              <label htmlFor="" className='label-name px-0 mb-0'>Contact Type</label>
            </div>
            <div className="col-3 col-md-3 col-lg-3">
              <Select
                name='PhoneTypeID'
                value={phoneTypeIdDrp?.filter((obj) => obj.value === value?.PhoneTypeID)}
                options={phoneTypeIdDrp}
                onChange={(e) => ChangePhoneType(e, 'PhoneTypeID')}
                isClearable
                placeholder="Select..."

                disabled={phoneTypeCode ? false : true}
                styles={customStylesWithOutColor}



              />
            </div>
            <div className="col-1 col-md-2 col-lg-1">
              <label htmlFor="" className='label-name mb-0'>Contact

              </label>
            </div>
            <div className="col-3 col-md-3 col-lg-2 text-field mt-0">
              <input type="text"
                maxLength={phoneTypeCode !== 'E' ? 10 : ''} className={value?.PhoneTypeID ? 'requiredColor' : 'readonlyColor'}
                name='Contact' value={value?.Contact} onChange={HandleChange} required disabled={value?.PhoneTypeID ? false : true} autoComplete='off' />
              {errors.ContactError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</span>
              ) : null}
            </div>
            <div className="col-3 col-md-1 col-lg-2">
              {
                phoneTypeCode !== 'E' ?
                  <div className="form-check ">
                    <input className="form-check-input" type="checkbox" name='IsUnListedPhNo' value={value?.IsUnListedPhNo} disabled={!value?.Contact ? true : false} checked={value?.IsUnListedPhNo} onChange={HandleChange} id="flexCheckDefault2" />
                    <label className="form-check-label" htmlFor="flexCheckDefault2">
                      Unlisted
                    </label>
                  </div> : <></>
              }
            </div>
          </div>
        </div>


        <div className="col-4 col-md-4 col-lg-1" >
          <div className="img-box" data-toggle="modal" data-target="#ImageModel">
            <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
              {
                nameMultiImg.length > 0 ?
                  nameMultiImg?.map((item) => (

                    <div key={item?.PhotoID ? item?.PhotoID : item?.imgID} onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel" className='model-img'>
                      <img src={`data:image/png;base64,${item.Photo}`} style={{ height: '90px' }} />
                    </div>
                  ))
                  :
                  <div data-toggle="modal" data-target="#ImageModel" onClick={() => { setImageModalStatus(true) }} >
                    <img src={defualtImage} alt='' />
                  </div>
              }
            </Carousel>
          </div>
        </div>

      </div >






      <div className='row mb-2'>
        {!isViewEventDetails &&
          <div className="col-12 col-md-12 col-lg-12 text-right" >
            <div className=" mt-1 text-md-right " >

              {
                MstPage !== "MST-Name-Dash" && nameFilterData?.length > 0 && <button type="button"
                  className="btn btn-sm  text-white mr-1"

                  onClick={() => { nibrsValidateName(mainIncidentID, incReportedDate, baseDate, oriNumber) }}
                  style={{
                    backgroundColor: `${nibrsValidateNameData?.length > 0 ? nibrsValidateNameData?.length > 0 ? 'Red' : 'green' : 'teal'}`,
                  }}
                >
                  Validate TIBRS
                </button>
              }
              <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#NCICModal" onClick={() => { setOpenNCICModal(true) }}>TLETS</button>

              <button type="button" ref={crossButtonRef} className="btn btn-sm btn-success  mr-1" onClick={() => { setStatusFalse(); }}>
                New
              </button>
              {
                (masterNameID && MstPage === "MST-Name-Dash") || (nameID) ? (
                  effectiveScreenPermission ?
                    effectiveScreenPermission[0]?.Changeok ?
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
                ) :
                  (
                    effectiveScreenPermission ?
                      effectiveScreenPermission[0]?.AddOK ?
                        <>
                          <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); setcalled(true) }} disabled={isLoading || nameSearchStatus || saveValue} ref={saveButtonRef}>Save</button>
                          {nameTypeCode !== "B" && (
                            <button type="button" data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-success mr-1" onClick={() => getNameSearch(loginAgencyID, value?.NameTypeID, value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.HeightFrom, value.HeightTo, value.WeightFrom, value.WeightTo, value.EthnicityID, value.ResidentID, value.RaceID, value.SexID, value.PhoneTypeID, value.Contact, true,)}>Search</button>
                          )}
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

              {
                MstPage === "MST-Name-Dash" &&
                <button type="button" className="btn btn-sm btn-success mx-1" ref={closeButtonRef} onClick={onMasterPropClose} data-dismiss="modal">Close</button>
              }
            </div>
          </div>
        }

      </div >


      <ListModal {...{ openPage, setOpenPage }} />
      <NameSearchModal {...{ mainIncidentID, nameSearchValue, loginAgencyID, setValue, ResetSearch, setMultiSelected, value, setDobDate, get_Name_MultiImage, setUpdateStatus, updateStatus, MstPage }} />
      <DeletePopUpModal func={delete_Image_File} />
      <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
      <VerifyLocation {...{ loginAgencyID, loginPinID, modalStatus, setModalStatus, value, setStatesChangeStatus, setChangesStatus, setValue, addVerifySingleData, get_Add_Single_Data }} />
      <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion, setStatesChangeStatus }} />
      {/* <IdentifyFieldColor /> */}
      <ImageModel multiImage={nameMultiImg} pinID={imageModalOfficerID ? imageModalOfficerID : loginPinID} setStatesChangeStatus={setStatesChangeStatus} newClicked={newClicked} entityID={value?.NameIDNumber} primaryOfficerID={agencyOfficerDrpData} setMultiImage={setNameMultiImg} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageId} setImageId={setImageId} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_Name_MultiImage} agencyID={loginAgencyID} />
      <AlertMasterModel masterID={masterNameID} setStatesChangeVich={setStatesChangeStatus} AlertType={"Name"} modelName={"Name"} loginPinID={loginPinID} agencyID={loginAgencyID} getAlertData={setAvailableAlert} />
      <DeleteNameModal func={DeleteContactDetail} setToReset={Reset} setStatusFalse={setStatusFalse} />

      <NirbsErrorShowModal
        ErrorText={nibrsErrStr}
        nibErrModalStatus={nibrsErrModalStatus}
        setNibrsErrModalStatus={setNibrsErrModalStatus}

      />
      {openNCICModal && <NCICModal {...{ openNCICModal, setOpenNCICModal, }} isNameCallTaker nameData={value} />}

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

export default Home;

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

