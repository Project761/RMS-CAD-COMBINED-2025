import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Aes256Encrypt, Decrypt_Id_Name, DecryptedList, EncryptedList, Encrypted_Id_Name, LockFildscolour, Requiredcolour, base64ToString, customStylesWithOutColor, encryptAndEncodeToBase64, filterPassedDateTime, filterPassedTime, filterPassedTimeZone, filterPassedTimeZonesCurrent, filterPassedTimeZonesProperty, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, getYearWithOutDateTime, stringToBase64, tableCustomStyle, tableCustomStyles } from '../../../../Common/Utility';
import { AddDeleteUpadate, AddDelete_Img, ScreenPermision, fetchData, fetchPostData, fetchPostDataNibrs } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, fourColwithExtraCode, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { RequiredFieldIncident, RequiredFieldOnConditon, RequiredFieldHIN } from '../../../Utility/Personnel/Validation';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png'
import ChangesModal from '../../../../Common/ChangesModal';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import { useDispatch, useSelector } from 'react-redux';
import { MasterProperty_ID, Master_Property_Status, Masters_Name_Drp_Data, PropertySearch_Modal_Status, PropertySearch_Type, Property_ID, Property_LossCode_Drp_Data, Property_Search_Data } from '../../../../../redux/actionTypes';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../redux/actions/Agency';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_AgencyOfficer_Data, get_ArresteeName_Data, get_BoatModel_Drp_Data, get_Bottom_Color_Drp_Data, get_Color_Drp_Data, get_DrugManufactured_Drp_Data, get_Make_Drp_Data, get_Masters_Name_Drp_Data, get_Material_Drp_Data, get_MeasureType_Drp_Data, get_PropSourceDrugDrpData, get_PropertyLossCode_Drp_Data, get_PropertyTypeData, get_Propulusion_Drp_Data, get_State_Drp_Data, get_SuspectedDrug_Drp_Data, get_Top_Color_Drp_Data, get_TypeMarijuana_Drp_Data, get_VOD_Drp_Data, get_WeaponMake_Drp_Data, get_WeaponModel_Drp_Data, } from '../../../../../redux/actions/DropDownsData';
import ImageModel from '../../../ImageModel/ImageModel';
import { get_PropertyMainModule_Data, get_Property_Article_Search_Data, get_Property_Boat_Search_Data, get_Property_Drug_Search_Data, get_Property_Other_Search_Data, get_Property_Security_Search_Data, get_Property_Weapon_Search_Data } from '../../../../../redux/actions/PropertyAction';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import PropertySearchTab from '../../../PropertySearchTab/PropertySearchTab';
import axios from 'axios';
import AlertMasterModel from '../../../AlertMaster/AlertMasterModel';
import AlertTable from '../../../AlertMaster/AlertTable';
import BarCode from '../../../../Common/BarCode';
import { check_Category_Nibrs, check_OffenceCode_NoneUnknown, ErrorTooltip, NoneUnknownErrorStr } from '../../PropertyNibrsError';
import Loader from '../../../../Common/Loader';
import NirbsErrorShowModal from '../../../../Common/NirbsErrorShowModal';
import CurrentProMasterReport from './CurrentProMasterReport';
import CreatableSelect from 'react-select/creatable';
import NCICModal from '../../../../../CADComponents/NCICModal';


const Home = ({ setShowRecovered, setShowPage, status, setShowOtherTab, get_List, propertystatus, setPropertyStatus, isCad = false, isViewEventDetails = false, isCADSearch = false, }) => {


  const dispatch = useDispatch();
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const masterPropertyStatus = useSelector((state) => state.Agency.masterPropertyStatus);
  const propertyMainModuleData = useSelector((state) => state.Property.propertyMainModuleData);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
  const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);
  const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
  const propertyLossCodeDrpData = useSelector((state) => state.DropDown.propertyLossCodeDrpData);
  const colorDrpData = useSelector((state) => state.DropDown.colorDrpData);
  const topColorDrpData = useSelector((state) => state.DropDown.topColorDrpData);
  const bottomColorDrpData = useSelector((state) => state.DropDown.bottomColorDrpData);
  const stateDrpData = useSelector((state) => state.DropDown.stateDrpData);
  const materialDrpData = useSelector((state) => state.DropDown.materialDrpData);
  const makeDrpData = useSelector((state) => state.DropDown.makeDrpData);
  const propulusionDrpData = useSelector((state) => state.DropDown.propulusionDrpData);
  const weaponMakeDrpData = useSelector((state) => state.DropDown.weaponMakeDrpData);
  const drugManufacturedDrpData = useSelector((state) => state.DropDown.drugManufacturedDrpData);
  const typeMarijuanaDrpData = useSelector((state) => state.DropDown.typeMarijuanaDrpData);
  const suspectedDrugDrpData = useSelector((state) => state.DropDown.suspectedDrugDrpData);
  const weaponModelDrpData = useSelector((state) => state.DropDown.weaponModelDrpData);
  const boatModelDrpData = useSelector((state) => state.DropDown.boatModelDrpData);
  const vodDrpData = useSelector((state) => state.DropDown.vodDrpData);
  const propSourceDrugDrpData = useSelector((state) => state.DropDown.propSourceDrugDrpData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);

  const measureTypeDrpData = useSelector((state) => state.DropDown.measureTypeDrpData);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  let DecPropID = 0, DecMPropID = 0
  const query = useQuery();
  var IncID = query?.get("IncId");
  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");
  var ProId = query?.get("ProId");
  var MProId = query?.get('MProId');
  var ProSta = query?.get('ProSta');
  let FbiCode = query?.get('FbiCode');
  let AttComp = query?.get('AttComp');
  let MstPage = query?.get('page');

  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));
  if (!ProId) ProId = 0;
  else DecPropID = parseInt(base64ToString(ProId));
  if (!MProId) ProId = 0;
  else DecMPropID = parseInt(base64ToString(MProId));

  const navigate = useNavigate();

  const { get_Incident_Count, changesStatus, setChangesStatus, get_Property_Count, nibrsSubmittedStatus, setnibrsSubmittedStatus, nibrsSubmittedPropertyMain, setnibrsSubmittedPropertyMain, setcountoffaduit, datezone, GetDataTimeZone, validate_IncSideBar, incidentReportedDate, setIncidentReportedDate, } = useContext(AgencyContext);

  const [loder, setLoder] = useState(false);
  const [drugLoder, setDrugLoder] = useState(false);
  const [manufactureDate, setManufactureDate] = useState();
  const [weaponfactureDate, setWeaponfactureDate] = useState();
  const [securityDate, setSecurityDate] = useState();
  const [propertyCategoryData, setPropertyCategoryData] = useState([]);
  const [propertyClassificationData, setPropertyClassificationData] = useState([]);
  const [editval, setEditval] = useState([]);
  const [propertyNumber, setPropertyNumber] = useState('');
  const [propertyArticle, setPropertyArticle] = useState([]);
  const [propertyWeapon, setPropertyWeapon] = useState([]);
  const [propertySecurity, setPropertySecurity] = useState([]);
  const [propertOther, setPropertOther] = useState([]);
  const [propertyBoat, setPropertyBoat] = useState([]);
  const [lossCode, setLossCode] = useState('');
  const [openPage, setOpenPage] = useState('');
  //------propertyID, MasterPropertyID------
  const [delPropertyID, setDelPropertyID] = useState('');
  const [propertyID, setPropertyID] = useState('');
  const [masterPropertyID, setMasterPropertyID] = useState('');
  //-------------------image----------------
  const [multiImage, setMultiImage] = useState([]);
  const [imageId, setImageId] = useState('');
  const [modalStatus, setModalStatus] = useState(false);
  //------------DrugDataModal---------------
  const [drugData, setDrugData] = useState([]);
  const [propertyDrugID, setPropertyDrugID] = useState();
  const [drugModal, setDrugModal] = useState();
  const [drugEditData, setDrugEditData] = useState([]);
  const [drugTypecode, setDrugTypecode] = useState('');
  const [drugMeasureUnitData, setDrugMeasureUnitData] = useState([]);
  const [drugMeasureTypeData, setDrugMeasureTypeData] = useState([]);

  const [isProperty, setIsProperty] = useState(true);
  const [nameModalStatus, setNameModalStatus] = useState(false);
  const [mainIncidentID, setMainIncidentID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [updateCount, setUpdateCount] = useState(0);
  const [type, setType] = useState("Property");
  const [possessionID, setPossessionID] = useState('');
  const [possenSinglData, setPossenSinglData] = useState([]);
  const [uploadImgFiles, setuploadImgFiles] = useState([]);
  const [imageModalStatus, setImageModalStatus] = useState(false);
  const [hideDirector, setHideDirector] = useState(false);
  const [searchModalState, setSearchModalState] = useState();
  const [drugLocalArr, setDrugLocalArr] = useState([]);
  const [localDrugCount, setLocalDrugCount] = useState(1);
  const [availableAlert, setAvailableAlert] = useState([]);
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [printStatus, setPrintStatus] = useState(false);
  const [nibrsCodeArr, setNibrsCodeArr] = useState([]);
  const [propRecType, setPorpRecType] = useState('');
  const [propCategoryCode, setPorpCategoryCode] = useState('');
  const [isDrugOffense, setIsDrugOffense] = useState(false);
  // nibrs
  const [baseDate, setBaseDate] = useState('');
  const [oriNumber, setOriNumber] = useState('');
  const [nibrsValidateData, setnibrsValidateData] = useState([]);
  const [nibrsErrStr, setNibrsErrStr] = useState('');
  const [clickNibloder, setclickNibLoder] = useState(false);
  const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
  const [printIncReport, setIncMasterReport] = useState(false);
  const [IncReportCount, setIncReportCount] = useState(1);
  const [navigateStatus, SetNavigateStatus] = useState(false);
  const [openNCICModal, setOpenNCICModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [WeaponModelData, setWeaponModelData] = useState([]);
  // permissions
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({
    'MasterPropertyID': '', 'PropertyID': '', 'AgencyID': '', 'IncidentID': '', 'CreatedByUserFK': '', 'ReportedDtTm': '', 'DestroyDtTm': '', 'Value': '',
    'PropertyCategoryCode': '', 'PropertyTypeID': null, 'CategoryID': null, 'ClassificationID': null, 'OfficerID': null, 'LossCodeID': null, 'PossessionOfID': null,
    'PropertyTag': '', 'NICB': '', 'Description': '', 'IsEvidence': '', 'IsSendToPropertyRoom': '', 'IsPropertyRecovered': '', 'MaterialID': null,
    'PropertyArticleID': null, 'SerialID': '', 'ModelID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'TopColorID': null, 'BottomColorID': null,
    'PropertyBoatID': null, 'BoatIDNumber': '', 'HIN': '', 'RegistrationNumber': '', 'VODID': null, 'Length': '', 'Comments': '', 'ManufactureYear': '',
    'MakeID': null, 'RegistrationExpiryDtTm': '', 'PropulusionID': null, 'RegistrationStateID': null, 'SecurityDtTm': '',
    'OtherID': null, 'PropertyOtherID': null, 'PropertySecurityID': null, 'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': null,
    'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'IsAuto': '', 'BarrelLength': '', 'WeaponModelID': null, 'PropertyWeaponID': null,
    'ModifiedByUserFK': '', 'MasterID': null, 'ArticleIDNumber': '',
    'IsMaster': MstPage === "MST-Property-Dash" ? true : false, 'PropertyNumber': 'Auto Genrated', 'QuantityUnitID': null,

    // Drug Fields
    'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementUnitID': null, 'MeasurementTypeID': null, 'PropertyDrugID': 0, 'PropertySourceDrugTypeID': null,
    'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, 'ClandistineLabsNumber': '',
    'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '', 'PropertyDrugMeasure_Description': '', 'SuspectedDrugType_Description': '', 'ManufactureYearFrom': ''
  });


  const [imgData, setImgData] = useState({
    "PictureTypeID": '', "ImageViewID": '', "ImgDtTm": '', "OfficerID": '', "Comments": '', "DocumentID": ''
  })

  const [errors, setErrors] = useState({
    'PropertyTypeIDError': '', 'CategoryIDError': '', 'LossCodeIDError': '', 'OfficerIDError': '', 'ContactError': '',
    //Boat RequireFields
    'RegStateError': '', 'RegNumError': '', 'HINError': '',
  })

  useEffect(() => {
    if (MstPage && possessionID) { setPossessionID(''); setPossenSinglData([]); dispatch({ type: Masters_Name_Drp_Data, payload: [] }); }
  }, [MstPage]);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("P059", localStoreData?.AgencyID, localStoreData?.PINID));
      GetDataTimeZone(localStoreData?.AgencyID);
      setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null);
      setOriNumber(localStoreData?.ORI); get_Incident_Count(IncID);

    }
  }, [localStoreData]);

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      // for change tab when not having  add and update permission
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (loginAgencyID) {
      const defaultDate = datezone ? new Date(datezone) : null;
      setValue({
        ...value,
        'IncidentID': IncID, 'OfficerID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
        'ReportedDtTm': MstPage != "MST-Property-Dash" ? defaultDate : defaultDate
      });
      dispatch(get_PropertyTypeData(loginAgencyID));
    }
  }, [loginAgencyID, incReportedDate]);

  useEffect(() => {
    if (loginAgencyID && IncID) dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
  }, [loginAgencyID, IncID]);

  useEffect(() => {
    if (DecPropID || DecMPropID) {
      get_Incident_Count(IncID);
      setPropertyID(DecPropID); GetSingleData(DecPropID, DecMPropID); setMasterPropertyID(DecMPropID); get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false);
      get_Data_Porperty_Offence(DecPropID, DecMPropID, IncID)
    }
  }, [DecPropID, DecMPropID]);

  useEffect(() => {
    if (propertyTypeData?.length != 0) {
      const Id = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });

      if (Id.length > 0 && (ProSta == 'false' || ProSta == false) && !FbiCode) {
        setValue({ ...value, ['PropertyTypeID']: Id[0]?.value, ['PropertyCategoryCode']: Id[0]?.id, })
        PropertyCategory(Id[0]?.value);
      }
    }
  }, [propertyTypeData, localStoreData]);

  useEffect(() => {
    if (IncID) {
      if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
      setMainIncidentID(IncID);
      dispatch(get_PropertyMainModule_Data(IncID, MstPage === "MST-Property-Dash" ? true : false));
      dispatch(get_ArresteeName_Data('', '', IncID));
    }
  }, [IncID, nameModalStatus, possessionID]);

  useEffect(() => {
    if (possessionID) { setValue({ ...value, ['PossessionOfID']: parseInt(possessionID) }) }
  }, [possessionID, arresteeNameData, mastersNameDrpData]);

  const check_Validation_Error = (e) => {
    const PropertyTypeIDErr = RequiredFieldIncident(value?.PropertyTypeID);
    const CategoryIDErr = RequiredFieldIncident(value?.CategoryID);
    const LossCodeIDErr = RequiredFieldIncident(value?.LossCodeID);

    const ContactErr = lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? RequiredFieldOnConditon(value.Value) : 'true';

    const HINErr = value.PropertyCategoryCode === 'B' ? RequiredFieldHIN(value?.HIN, 12, 21) : 'true';
    const RegNumErr = value.PropertyCategoryCode === 'B' ? RequiredFieldIncident(value?.RegistrationNumber) : "true";
    const RegStateErr = value.PropertyCategoryCode === 'B' ? RequiredFieldIncident(value?.RegistrationStateID) : "true";

    setErrors(prevValues => {
      return {
        ...prevValues,
        ['PropertyTypeIDError']: PropertyTypeIDErr || prevValues['PropertyTypeIDError'],
        ['CategoryIDError']: CategoryIDErr || prevValues['CategoryIDError'],
        ['LossCodeIDError']: LossCodeIDErr || prevValues['LossCodeIDError'],
        ['ContactError']: ContactErr || prevValues['ContactError'],
        ['HINError']: HINErr || prevValues['HINError'],
        ['RegNumError']: RegNumErr || prevValues['RegNumError'],
        ['RegStateError']: RegStateErr || prevValues['RegStateError'],
      }
    });
  }

  // Check All Field Format is True Then Submit 
  const { PropertyTypeIDError, ContactError, CategoryIDError, LossCodeIDError, RegStateError, RegNumError, HINError } = errors

  useEffect(() => {
    if (PropertyTypeIDError === 'true' && ContactError === 'true' && CategoryIDError === 'true' && LossCodeIDError === 'true' && HINError === 'true' && RegNumError === 'true' && RegStateError === 'true') {
      if (MstPage === "MST-Property-Dash") {
        if (masterPropertyID) {
          update_Property();
        } else {
          Add_Property();
        }
      } else {
        if (propertyID && masterPropertyID) {
          update_Property();
        } else {
          Add_Property();
        }
      }
    }
  }, [PropertyTypeIDError, ContactError, CategoryIDError, LossCodeIDError, RegStateError, RegNumError, HINError]);

  const GetSingleData = (propertyId, masterPropertyId) => {
    const val = { 'PropertyID': propertyId, 'MasterPropertyID': masterPropertyId, 'PINID': loginPinID, 'IncidentID': mainIncidentID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    const val2 = { 'MasterPropertyID': masterPropertyId, 'PropertyID': 0, 'PINID': loginPinID, 'IncidentID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    fetchPostData('Property/GetSingleData_Property', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
      if (res) {
        console.log("GetSingleData Property", res);
        setEditval(res); setLoder(true);
      } else { setEditval([]); setLoder(true); }
    })
  }

  const get_PropertyArticle_Single_Data = (masterPropertyId, propertyId, PropertyCategoryCode) => {
    const val = { 'PropertyID': propertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    const val2 = { 'MasterPropertyID': masterPropertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0, 'IsMaster': true }
    fetchPostData('Property/GetData_PropertyArticle', MstPage === "MST-Property-Dash" || !propertyId ? val2 : val).then((res) => {
      if (res) {
        setPropertyArticle(res);
      }
      else { setPropertyArticle([]) }
    })
  }

  const get_PropertyBoat_Single_Data = (masterPropertyId, propertyId, PropertyCategoryCode) => {
    const val = { 'PropertyID': propertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    const val2 = { 'MasterPropertyID': masterPropertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0, 'IsMaster': true }
    fetchPostData('Property/GetData_PropertyBoat', MstPage === "MST-Property-Dash" || !propertyId ? val2 : val).then((res) => {
      if (res) {
        setPropertyBoat(res);
      } else { setPropertyBoat([]) }
    })
  }

  const get_PropertOther_Single_Data = (masterPropertyId, propertyId, PropertyCategoryCode) => {
    const val = { 'PropertyID': propertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    const val2 = { 'MasterPropertyID': masterPropertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0, 'IsMaster': true }
    fetchPostData('Property/GetData_PropertOther', MstPage === "MST-Property-Dash" || !propertyId ? val2 : val).then((res) => {
      if (res) {
        setPropertOther(res);
      }
      else { setPropertOther([]) }
    })
  }

  const get_PropertySecurity_Single_Data = (masterPropertyId, propertyId, PropertyCategoryCode) => {
    const val = { 'PropertyID': propertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    const val2 = { 'MasterPropertyID': masterPropertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0, 'IsMaster': true }
    fetchPostData('Property/GetData_PropertySecurity', MstPage === "MST-Property-Dash" || !propertyId ? val2 : val).then((res) => {
      if (res) {
        setPropertySecurity(res);
      } else { setPropertySecurity([]) }
    })
  }

  const get_PropertyWeapon_Single_Data = (masterPropertyId, propertyId, PropertyCategoryCode) => {
    const val = { 'PropertyID': propertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'MasterPropertyID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    const val2 = { 'MasterPropertyID': masterPropertyId, 'PropertyCategoryCode': PropertyCategoryCode, 'PropertyID': 0, 'IsMaster': true }
    fetchPostData('Property/GetData_PropertyWeapon', MstPage === "MST-Property-Dash" || !propertyId ? val2 : val).then((res) => {
      if (res) {
        setPropertyWeapon(res);
      }
      else { setPropertyWeapon([]) }
    })
  }

  useEffect(() => {
    if (editval?.length > 0) {
      setcountoffaduit(true)
      PropertyCategory(editval[0]?.PropertyTypeID);
      dispatch(get_Masters_Name_Drp_Data(editval[0]?.PossessionOfID));
      sessionStorage.setItem("propertyStolenValue", Encrypted_Id_Name(editval[0]?.Value, 'SForStolenValue'));
      setMasterPropertyID(editval[0]?.MasterPropertyID);
      setPropertyID(MstPage === "MST-Property-Dash" ? '' : editval[0]?.PropertyID)
      dispatch({ type: MasterProperty_ID, payload: editval[0]?.MasterPropertyID });
      dispatch({ type: Property_ID, payload: MstPage === "MST-Property-Dash" ? '' : editval[0]?.PropertyID });
      if (Get_Property_Code(editval, propertyTypeData) === 'A') {
        get_PropertyArticle_Single_Data(editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(editval, propertyTypeData))
        setPropertOther([]); setPropertyBoat([]); setPropertyWeapon([]); setPropertySecurity([])
        dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', '')); console.log("Call  Type === A")

      } else if (Get_Property_Code(editval, propertyTypeData) === 'B') {
        get_PropertyBoat_Single_Data(editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(editval, propertyTypeData))
        setPropertOther([]); setPropertyArticle([]); setPropertyWeapon([]); setPropertySecurity([])
        dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', '')); console.log("Call  Type === B")

      } else if (Get_Property_Code(editval, propertyTypeData) === 'O') {
        get_PropertOther_Single_Data(editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(editval, propertyTypeData))
        setPropertyArticle([]); setPropertyBoat([]); setPropertyWeapon([]); setPropertySecurity([])
        dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', '')); console.log("Call  Type === O")

      } else if (Get_Property_Code(editval, propertyTypeData) === 'S') {
        get_PropertySecurity_Single_Data(editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(editval, propertyTypeData))
        setPropertOther([]); setPropertyBoat([]); setPropertyWeapon([]); setPropertyArticle([])
        dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', '')); console.log("Call  Type === S")

      } else if (Get_Property_Code(editval, propertyTypeData) === 'G') {
        get_PropertyWeapon_Single_Data(editval[0]?.MasterPropertyID, propertyID, Get_Property_Code(editval, propertyTypeData))
        setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertySecurity([]);
        dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1')); console.log("Call  Type === G")

      } else if (Get_Property_Code(editval, propertyTypeData) === 'D') {
        get_Data_Drug_Modal(editval[0]?.MasterPropertyID, propertyID);
        setPropertOther([]); setPropertyBoat([]); setPropertyArticle([]); setPropertySecurity([]); setPropertyWeapon([]);
        dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '1', '')); console.log("Call  Type === D")
      }

      setLossCode(Get_LossCode(editval, propertyLossCodeDrpData));
      setValue({
        ...value,
        'PropertyID': MstPage === "MST-Property-Dash" ? '' : editval[0]?.PropertyID,
        'MasterPropertyID': editval[0]?.MasterPropertyID,
        'PropertyTypeID': editval[0]?.PropertyTypeID,
        'ModifiedByUserFK': loginPinID,
        'PropertyNumber': editval[0]?.PropertyNumber,
        'CategoryID': editval[0]?.CategoryID,
        'ClassificationID': editval[0]?.ClassificationID,
        'ReportedDtTm': editval[0]?.ReportedDtTm ? getShowingDateText(editval[0]?.ReportedDtTm) : '',
        'DestroyDtTm': editval[0]?.DestroyDtTm ? getShowingDateText(editval[0]?.DestroyDtTm) : '',
        'Value': editval[0]?.Value === null && (editval[0].CategoryID === 2 || editval[0].CategoryID === 5 || editval[0].CategoryID === 600013 || editval[0].CategoryID === 600014 || editval[0].CategoryID === 31 || editval[0].CategoryID === 600026) ? '0' : editval[0]?.Value === null ? '0' : editval[0]?.Value,

        'OfficerID': editval[0]?.OfficerID,
        'LossCodeID': editval[0]?.LossCodeID,
        'PropertyTag': editval[0]?.PropertyTag,
        'NICB': editval[0]?.NICB,
        'Description': editval[0]?.Description,
        'IsEvidence': editval[0]?.IsEvidence,
        'IsSendToPropertyRoom': editval[0]?.IsSendToPropertyRoom,
        'IsPropertyRecovered': editval[0]?.IsPropertyRecovered,
        'PossessionOfID': editval[0]?.PossessionOfID,
        'PropertyCategoryCode': Get_Property_Code(editval, propertyTypeData),
        // -------------------------------------------------Article fields --------
        'PropertyArticleID': Get_Property_Code(editval, propertyTypeData) === "A" ? editval[0].PropertyArticle[0]?.PropertyArticleID : '',
        //---------------------------------- boat Fields --------------------------
        'PropertyBoatID': Get_Property_Code(editval, propertyTypeData) === "B" ? editval[0].PropertyBoat[0]?.PropertyBoatID : "",
        // ----------------------------Other Fields-----------------------
        'PropertyOtherID': Get_Property_Code(editval, propertyTypeData) === "O" ? editval[0].PropertyOther[0]?.PropertyOtherID : '',
        // ----------------------------Security Fields-----------------------
        'PropertySecurityID': Get_Property_Code(editval, propertyTypeData) === "S" ? editval[0].PropertySecurity[0]?.PropertySecurityID : '',
        'PropertyWeaponID': Get_Property_Code(editval, propertyTypeData) === "G" ? editval[0].PropertyWeapon[0]?.PropertyWeaponID : '',
      })
      setPossessionID(editval[0]?.PossessionOfID);

      setPorpCategoryCode(Get_LossCodes(editval, propertyCategoryData))
      PropertyClassification(editval[0]?.CategoryID);
      setPropertyNumber(editval[0]?.PropertyNumber);
      get_Name_MultiImage(DecPropID, DecMPropID);
      setIncidentReportedDate(editval[0]?.ReportedDtTm ? new Date(editval[0]?.ReportedDtTm) : null);
      setnibrsSubmittedPropertyMain(editval[0]?.IsNIBRSSummited);

      if (editval[0]?.IsSendToPropertyRoom) {
        setPropertyStatus(true);
      }
      if (editval[0]?.IsEvidence) {
        SetNavigateStatus(true);
      }
    } else {
      Reset();
      setIncidentReportedDate(getShowingMonthDateYear(new Date()));
      if (FbiCode && AttComp) { setStatesAccordingTo_FbiCode(FbiCode, AttComp); }
    }
  }, [editval, propertyTypeData])

  useEffect(() => {
    propertyLossCodeDrpData?.filter(val => {
      if (val.value === value?.LossCodeID) {
        if (val.id === "RECD") {
          setShowRecovered(true);
        } else {
          setShowRecovered(false);
        }
      }
    });
  }, [value.LossCodeID, propertyLossCodeDrpData]);

  // ----------------------------Property Type -----------------------
  useEffect(() => {
    propertyTypeData?.filter(val => {
      if (val.value === value?.PropertyTypeID) {
        if (val.id === "D") {
          setShowOtherTab(true);
        } else {
          setShowOtherTab(false);
        }
      }
    });
  }, [value.PropertyTypeID]);

  useEffect(() => {
    if (propertyArticle.length > 0) {
      setValue({
        ...value,
        'ArticleIDNumber': propertyArticle[0]?.ArticleIDNumber, 'SerialID': propertyArticle[0]?.SerialID, 'PropertyArticleID': propertyArticle[0]?.PropertyArticleID, 'ModelID': propertyArticle[0]?.ModelID, 'TopColorID': propertyArticle[0]?.TopColorID, 'BottomColorID': propertyArticle[0]?.BottomColorID, 'OAN': propertyArticle[0]?.OAN, 'Quantity': propertyArticle[0]?.Quantity, 'Brand': propertyArticle[0]?.Brand,
      })
    }
  }, [propertyArticle])

  useEffect(() => {
    if (propertyBoat.length > 0) {
      setValue({
        ...value,
        'BoatIDNumber': propertyBoat[0]?.BoatIDNumber, 'PropertyBoatID': propertyBoat[0]?.PropertyBoatID, 'MaterialID': propertyBoat[0]?.MaterialID, 'VODID': propertyBoat[0]?.VODID,
        'Length': propertyBoat[0]?.Length, 'RegistrationStateID': propertyBoat[0]?.RegistrationStateID, 'RegistrationNumber': propertyBoat[0]?.RegistrationNumber,
        'MakeID': propertyBoat[0]?.MakeID, 'ModelID': propertyBoat[0]?.ModelID, 'Comments': propertyBoat[0]?.Comments, 'HIN': propertyBoat[0]?.HIN,
        'PropulusionID': propertyBoat[0]?.PropulusionID, 'BottomColorID': propertyBoat[0]?.BottomColorID, 'TopColorID': propertyBoat[0]?.TopColorID,
        'ManufactureYear': propertyBoat[0]?.ManufactureYear ? getYearWithOutDateTime(propertyBoat[0]?.ManufactureYear) : null,

        'RegistrationExpiryDtTm': propertyBoat[0]?.RegistrationExpiryDtTm ? propertyBoat[0]?.RegistrationExpiryDtTm : null,
      });
      setManufactureDate(propertyBoat[0]?.ManufactureYear ? new Date(propertyBoat[0]?.ManufactureYear) : null);
    }
  }, [propertyBoat])

  useEffect(() => {
    if (propertOther.length > 0) {
      setValue({
        ...value,
        'OtherID': propertOther[0]?.OtherID, 'PropertyOtherID': propertOther[0]?.PropertyOtherID, 'Brand': propertOther[0]?.Brand, 'QuantityUnitID': propertOther[0]?.QuantityUnitID ? parseInt(propertOther[0]?.QuantityUnitID) : '',
        'SerialID': propertOther[0]?.SerialID ? propertOther[0]?.SerialID : '', 'TopColorID': propertOther[0]?.TopColorID, 'BottomColorID': propertOther[0]?.BottomColorID, 'ModelID': propertOther[0]?.ModelID, 'Quantity': propertOther[0]?.Quantity,
      })
    }
  }, [propertOther])

  useEffect(() => {
    if (propertySecurity.length > 0) {
      setValue({
        ...value,
        'SecurityIDNumber': propertySecurity[0]?.SecurityIDNumber, 'PropertySecurityID': propertySecurity[0]?.PropertySecurityID, 'Denomination': propertySecurity[0]?.Denomination,
        'IssuingAgency': propertySecurity[0]?.IssuingAgency, 'MeasureTypeID': propertySecurity[0]?.MeasureTypeID ? parseInt(propertySecurity[0]?.MeasureTypeID) : '', 'SecurityDtTm': propertySecurity[0]?.SecurityDtTm,
        'SerialID': propertySecurity[0]?.SerialID,
      })
      setSecurityDate(propertySecurity[0]?.SecurityDtTm ? new Date(propertySecurity[0]?.SecurityDtTm) : '');
    }
  }, [propertySecurity])

  useEffect(() => {
    if (propertyWeapon.length > 0) {
      setValue({
        ...value,
        'WeaponIDNumber': propertyWeapon[0]?.WeaponIDNumber, 'PropertyWeaponID': propertyWeapon[0]?.PropertyWeaponID, 'Style': propertyWeapon[0]?.Style, 'Finish': propertyWeapon[0]?.Finish, 'Caliber': propertyWeapon[0]?.Caliber, 'Handle': propertyWeapon[0]?.Handle, 'SerialID': propertyWeapon[0]?.SerialID, 'MakeID': propertyWeapon[0]?.MakeID, 'WeaponModelID': propertyWeapon[0]?.WeaponModelID, 'IsAuto': propertyWeapon[0]?.IsAuto, 'BarrelLength': propertyWeapon[0]?.BarrelLength,
        'ManufactureYear': propertyWeapon[0]?.ManufactureYear ? getYearWithOutDateTime(propertyWeapon[0]?.ManufactureYear) : null,
      });
      setWeaponfactureDate(propertyWeapon[0]?.ManufactureYear ? new Date(propertyWeapon[0]?.ManufactureYear) : null);
    }
  }, [propertyWeapon])

  useEffect(() => {
    if (value?.PropertyCategoryCode === 'A') {
      if (topColorDrpData?.length === 0) dispatch(get_Top_Color_Drp_Data(loginAgencyID))
      if (bottomColorDrpData?.length === 0) dispatch(get_Bottom_Color_Drp_Data(loginAgencyID))

      dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));
    } else if (value?.PropertyCategoryCode === 'B') {
      if (propulusionDrpData?.length === 0) dispatch(get_Propulusion_Drp_Data(loginAgencyID));

      if (topColorDrpData?.length === 0) dispatch(get_Top_Color_Drp_Data(loginAgencyID))
      if (bottomColorDrpData?.length === 0) dispatch(get_Bottom_Color_Drp_Data(loginAgencyID))
      if (stateDrpData?.length === 0) dispatch(get_State_Drp_Data());
      if (materialDrpData?.length === 0) dispatch(get_Material_Drp_Data(loginAgencyID))
      if (vodDrpData?.length === 0) dispatch(get_VOD_Drp_Data(loginAgencyID));
      if (makeDrpData?.length === 0) dispatch(get_Make_Drp_Data(loginAgencyID))
      if (boatModelDrpData?.length === 0) dispatch(get_BoatModel_Drp_Data(loginAgencyID));
    } else if (value.PropertyCategoryCode === 'D') {


      if (measureTypeDrpData?.length === 0) dispatch(get_MeasureType_Drp_Data(loginAgencyID));
      if (suspectedDrugDrpData?.length === 0) dispatch(get_SuspectedDrug_Drp_Data(loginAgencyID));
      if (propSourceDrugDrpData?.length === 0) dispatch(get_PropSourceDrugDrpData(loginAgencyID));
      if (typeMarijuanaDrpData?.length === 0) dispatch(get_TypeMarijuana_Drp_Data(loginAgencyID));
      if (drugManufacturedDrpData?.length === 0) dispatch(get_DrugManufactured_Drp_Data(loginAgencyID));


    } else if (value.PropertyCategoryCode === 'O') {

      if (measureTypeDrpData?.length === 0) dispatch(get_MeasureType_Drp_Data(loginAgencyID));
      if (topColorDrpData?.length === 0) dispatch(get_Top_Color_Drp_Data(loginAgencyID))
      if (bottomColorDrpData?.length === 0) dispatch(get_Bottom_Color_Drp_Data(loginAgencyID))
    } else if (value.PropertyCategoryCode === 'S') {
      if (measureTypeDrpData?.length === 0) dispatch(get_MeasureType_Drp_Data(loginAgencyID));
    } else if (value.PropertyCategoryCode === 'G') {
      if (weaponModelDrpData?.length === 0) dispatch(get_WeaponModel_Drp_Data(loginAgencyID));
      if (weaponMakeDrpData?.length === 0) dispatch(get_WeaponMake_Drp_Data(loginAgencyID));
    }
  }, [value?.PropertyCategoryCode])

  const get_Data_Drug_Modal = (masterPropertyId, propertyID) => {
    const val = { 'PropertyID': propertyID, 'MasterPropertyID': masterPropertyId, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    fetchPostData('PropertyDrug/GetData_PropertyDrug', val).then((res) => {
      if (res) {
        setDrugData(res); setDrugLoder(true);
      } else {
        setDrugData([]); setDrugLoder(true);
      }
    })
  }

  const PropertyCategory = (CategoryID) => {
    const val = { CategoryID: CategoryID, }
    fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
      if (data) {
        setPropertyCategoryData(fourColwithExtraCode(data, 'PropertyDescID', 'Description', 'CategoryID', 'PropDescCode'));

        setPorpCategoryCode(Get_LossCodes(editval, fourColwithExtraCode(data, 'PropertyDescID', 'Description', 'CategoryID', 'PropDescCode')))
      } else {
        setPropertyCategoryData([]);
      }
    })
  }

  const get_Data_Porperty_Offence = (propertyID, DecMPropID, mainIncidentID) => {
    const val = { 'PropertyID': propertyID, 'MasterPropertyID': DecMPropID ? DecMPropID : 0, 'IncidentID': mainIncidentID, 'OffenseID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    fetchPostData('PropertyOffense/GetData_PropertyOffense', val).then((res) => {
      if (res) {
        const nibrsCodeArr = res?.map((item) => item?.NIBRSCode);
        setNibrsCodeArr(nibrsCodeArr);
      } else {
        setNibrsCodeArr([])
      }
    });
  }

  const PropertyClassification = (PropertyDescID) => {
    const val = { PropertyDescID: PropertyDescID, }
    fetchPostData('Property/GetDataDropDown_PropertyClassification', val).then((data) => {
      if (data) {
        setPropertyClassificationData(Comman_changeArrayFormat(data, 'PropertyClassificationID', 'Description'))
      } else {
        setPropertyClassificationData([]);
      }
    })
  }

  const getDrugMeasureUnit = (drugTypeID) => {
    const val = {
      'AgencyID': loginAgencyID,
      'DrugTypeID': drugTypeID,
    }
    fetchPostData('MeasurementUnit/GetDataDropDown_MeasurementUnit', val).then((data) => {
      if (data) {
        setDrugMeasureUnitData(Comman_changeArrayFormat(data, 'MeasurementUnitID', 'Description'))
      } else {
        setDrugMeasureUnitData([]);
      }
    })
  }

  const getDrugMeasureType = (drugTypeID, measurementUnitID) => {
    const val = {
      'AgencyID': loginAgencyID,
      'DrugTypeID': drugTypeID,
      'MeasurementUnitID': measurementUnitID,
    }
    fetchPostData('PropertyDrugMeasureType/GetDataDropDown_PropertyDrugMeasureType', val).then((data) => {
      if (data) {

        setDrugMeasureTypeData(Comman_changeArrayFormat(data, 'DrugMeasureTypeID', 'Description'))
      } else {
        setDrugMeasureTypeData([]);
      }
    })
  }

  const onChangeDrugType = (e, name) => {
    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true)
    if (e) {
      if (name === 'SuspectedDrugTypeID') {
        setValue({ ...value, [name]: e.value, 'SuspectedDrugType_Description': e.label, 'MeasurementUnitID': null, 'MeasurementUnit_Description': '', 'MeasurementTypeID': null, });
        setDrugMeasureUnitData([]); setDrugMeasureTypeData([]);
        getDrugMeasureUnit(e.value);

      } else if (name === 'MeasurementUnitID') {
        setValue({ ...value, [name]: e.value, 'MeasurementTypeID': null, 'MeasurementUnit_Description': e.label });
        setDrugMeasureTypeData([]);
        getDrugMeasureType(value.SuspectedDrugTypeID, e.value);

      } else if (name === 'MeasurementTypeID') {
        setValue({ ...value, [name]: e.value, 'PropertyDrugMeasure_Description': e.label });
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {

      if (name === 'SuspectedDrugTypeID') {
        setValue({ ...value, [name]: null, 'SuspectedDrugType_Description': '', 'MeasurementUnitID': null, 'MeasurementUnit_Description': '', 'MeasurementTypeID': null, });
        setDrugMeasureUnitData([]); setDrugMeasureTypeData([]);


      } else if (name === 'MeasurementUnitID') {
        setValue({ ...value, [name]: null, 'MeasurementTypeID': null, 'MeasurementUnit_Description': '' });
        setDrugMeasureTypeData([]);


      } else if (name === 'MeasurementTypeID') {
        setValue({ ...value, [name]: null, 'PropertyDrugMeasure_Description': '' });
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  }

  const Reset = () => {
    setValue({
      ...value,
      'PropertyID': '', 'MasterPropertyID': '', 'PropertyNumber': 'Auto Generated', 'PropertyCategoryCode': 'A', 'PossessionOfID': null, 'OfficerID': null,

      // Dropdown
      'CategoryID': null, 'ClassificationID': null, 'LossCodeID': null,

      'DestroyDtTm': '', 'Value': '', 'PropertyTag': '', 'NICB': '', 'Description': '',
      'ReportedDtTm': MstPage === "MST-Property-Dash" ? getShowingMonthDateYear(new Date(datezone)) : incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()),
      // checkbox
      'IsEvidence': '', 'IsSendToPropertyRoom': '', 'IsPropertyRecovered': '',
      // Article fields 
      'SerialID': '', 'ModelID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'TopColorID': null, 'BottomColorID': null,
      // boat Fields 
      'BoatIDNumber': '', 'HIN': '', 'RegistrationNumber': '', 'VODID': null, 'Length': '', 'Comments': '', 'ManufactureYear': null, 'MaterialID': null,
      'MakeID': null, 'RegistrationExpiryDtTm': null, 'PropulusionID': null, 'RegistrationStateID': null,
      // Other Fields
      'OtherID': null, 'QuantityUnitID': '',
      //Security
      'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': null, 'SecurityDtTm': null,
      //Weapon 
      'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'IsAuto': '', 'BarrelLength': '', 'WeaponModelID': null, 'PropertyWeaponID': null,
      //drug Fields
      'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementUnitID': null, 'MeasurementTypeID': null, 'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, '  ClandistineLabsNumber': null,
      'MasterID': null, 'Clandestine': '',
      'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
    });

    setnibrsSubmittedPropertyMain(0);
    setErrors({ ...errors, 'PropertyTypeIDError': '', 'CategoryIDError': '', 'LossCodeIDError': '', 'OfficerIDError': '', 'ContactError': '' });
    setSecurityDate(''); setPropertyNumber(''); setLossCode(''); setWeaponfactureDate(null); setManufactureDate(null);
    setDrugData([]); setAvailableAlert([]); setPropertyClassificationData([]);
    setMasterPropertyID(''); setPropertyID(''); setPorpRecType(''); setPorpCategoryCode('');
    dispatch({ type: MasterProperty_ID, payload: '' });
    dispatch({ type: Property_ID, payload: '' });
    setPossessionID('');
    dispatch(get_Masters_Name_Drp_Data(''));


    sessionStorage.removeItem('DrugLocalData', JSON.stringify([...drugLocalArr, value]));
    setDrugLocalArr([]); setPropertyDrugID('')


    if (propertyTypeData?.length != 0 && !FbiCode) {
      const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });
      if (typeArticleArr.length > 0) {
        setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
        PropertyCategory(typeArticleArr[0]?.value);
      }
      setIsDrugOffense(false);
    }
    setPropertyStatus(false);

  }

  const setStatesAccordingTo_FbiCode = (FbiCode, AttComp) => {
    switch (FbiCode) {
      case '35A':
      case '35B': {
        switch (AttComp) {
          case 'A': {
            if (propertyTypeData?.length != 0 && AttComp === 'A') {
              const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });
              if (typeArticleArr.length > 0) {
                setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
                PropertyCategory(typeArticleArr[0]?.value);
                setIsDrugOffense(false);
              }
            }
            return;
            break; // Added break
          }
          case 'C': {
            if (propertyTypeData?.length != 0 && AttComp === 'C') {
              const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "D") return val });
              if (typeArticleArr.length > 0) {
                setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
                PropertyCategory(typeArticleArr[0]?.value);
                setIsDrugOffense(true);
              }
            }
            return;
            break; // Added break
          }
          default: {
            return;
            break; // Added break
          }
        }
      }
      default: {
        if (propertyTypeData?.length != 0) {
          const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });
          if (typeArticleArr.length > 0) {
            setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
            PropertyCategory(typeArticleArr[0]?.value);
            setIsDrugOffense(false);
          }
        }
        break; // Added break
      }
    }
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      if (name === 'SuspectedDrugTypeID') {
        setDrugTypecode(e.id);

        if (e.id === 'E') {
          setValue({
            ...value,
            [name]: e.value, 'MeasurementTypeID': '', 'PropertySourceDrugTypeID': '', 'SuspectedDrugType_Description': e.label, 'TypeMarijuana': '', 'MarijuanaNumber': '', '  ClandistineLabsNumber': '', 'DrugManufactured': '',
          });
        } else {
          setValue({
            ...value,
            [name]: e.value, 'SuspectedDrugType_Description': e.label, 'TypeMarijuana': '', 'MarijuanaNumber': '', '  ClandistineLabsNumber': '', 'DrugManufactured': '',
          });
        }
      }
      else if (name === 'ModelID') {

        if (e?.__isNew__) {
          console.log("New model created:", e.label);

          setValue({
            ...value,
            ModelID: '',
            ModelName: e.label,
          });
        } else if (e) {
          console.log("Existing model selected:", e.value);
          setValue({
            ...value,
            ModelID: e.value,
            ModelName: '',
          });
        } else {
          // Cleared
          setValue({
            ...value,
            ModelID: '',
            ModelName: '',
          });
        }
      }
      else if (name === 'WeaponModelID') {

        if (e?.__isNew__) {
          console.log("New model created:", e.label);

          setValue({
            ...value,
            WeaponModelID: '',
            ModelName: e.label,
          });
        } else if (e) {
          console.log("Existing model selected:", e.value);
          setValue({
            ...value,
            WeaponModelID: e.value,
            ModelName: '',
          });
        } else {

          setValue({
            ...value,
            WeaponModelID: '',
            ModelName: '',
          });
        }
      }
      else if (name === 'PropertyTypeID') {
        switch (e.id) {
          case 'A': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', '')); break;
          case 'B': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', '')); break;
          case 'S': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', '')); break;
          case 'O': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', '')); break;
          case 'D': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '1', '')); break;
          case 'G': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1')); break;
          default: dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));;
        }
        PropertyCategory(e.value);
        PropertyClassification('');

        setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['CategoryID']: '', ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '', });
        setLossCode('');
        setDrugLoder(true);
      }
      else if (name === 'CategoryID') {
        setPorpCategoryCode(e.code);
        PropertyClassification(e.value);

        if (e.code === '09' || e.code === '22' || e.code === '65' || e.code === '66' || e.code === '77' || e.code === '11' || e.code === '10' || e.code === '48') {
          setValue({ ...value, [name]: e.value, ['Value']: '0.00' });

        } else if (e.code === '88') {
          setValue({ ...value, [name]: e.value, ['Value']: '1' });

        } else {
          setValue({ ...value, [name]: e.value, ['Value']: '' });

        }
      }
      else if (name === "PossessionOfID") {
        setPossessionID(e.value); setPossenSinglData([]); setValue({ ...value, [name]: e.value });
      }
      else if (name === "MeasurementTypeID") {

        if (e.id === 'XX') {
          setValue({ ...value, [name]: e.value, 'PropertyDrugMeasure_Description': e.label, 'EstimatedDrugQty': '' });
        } else {
          setValue({ ...value, [name]: e.value, 'PropertyDrugMeasure_Description': e.label, });
        }


      }
      else {

        setValue({ ...value, [name]: e.value });
      }

    } else {
      setStatesChangeStatus(true)
      if (name === 'SuspectedDrugTypeID') {
        setDrugTypecode('');
        setValue({ ...value, [name]: null, 'MeasurementTypeID': '', });

      }
      else if (name === 'PropertyTypeID') {

        setValue({
          ...value,
          ['PropertyTypeID']: null, ['PropertyCategoryCode']: '', ['CategoryID']: null, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '',
        });
        setPropertyCategoryData([]); setPropertyClassificationData([]); setLossCode('');
        dispatch({ type: Property_LossCode_Drp_Data, payload: [] });

      }
      else if (name === 'ModelID' || name === 'WeaponModelID') {
        setValue(prev => ({
          ...prev,
          ModelID: '',
          ModelName: '',
          WeaponModelID: '',
        }));
      }
      else if (name === 'CategoryID') {
        setPorpCategoryCode('');
        setPropertyClassificationData([]);
        setValue({ ...value, ['CategoryID']: null, ['ClassificationID']: null, ['Value']: '' });

      }
      else if (name === "PossessionOfID") {
        setPossessionID(''); setPossenSinglData([])

        setValue({ ...value, [name]: null });
      }
      else {

        setValue({ ...value, [name]: null });
      }
      void 0;
    }
  }

  const HandleChanges = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
    if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsAuto') {

      setValue({
        ...value,
        [e.target.name]: e.target.checked
      })
    }
    else if (e.target.name === 'EstimatedDrugQty' || e.target.name === 'SolidPounds' || e.target.name === 'SolidOunces' || e.target.name === 'SolidGrams' || e.target.name === 'LiquidOunces' || e.target.name === 'DoseUnits' || e.target.name === 'Items') {
      let ele = e.target.value.replace(/[^0-9]/g, "")
      if (ele.length === 10) {
        const cleaned = ('' + ele).replace(/[^0-9]/g, '');

        setValue({
          ...value,
          [e.target.name]: cleaned
        });
      } else {
        ele = e.target.value.split('$').join('').replace(/[^0-9]/g, "");

        setValue({
          ...value,
          [e.target.name]: ele
        });
      }
    } else if (e.target.name === 'Quantity' || e.target.name === 'Length' || e.target.name === 'BarrelLength' || e.target.name === 'FractionDrugQty' || e.target.name === 'MarijuanaNumber' || e.target.name === 'ClandistineLabsNumber') {
      const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");

      setValue({
        ...value,
        [e.target.name]: checkNumber
      });
    }
    else if (e.target.name === 'Denomination') {
      var ele = e.target.value.replace(/[^0-9\.]/g, "")


      if (ele === "") {
        setValue({
          ...value,
          [e.target.name]: ele,
          MeasureTypeID: null
        });

        return;
      }



      if (ele.includes('.')) {
        if (ele.length === 16) {

          setValue({ ...value, [e.target.name]: ele });
        } else {

          if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
            const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
            if (!checkDot) {

              setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
            }
          } else {

            setValue({ ...value, [e.target.name]: ele })
          }
        }
      }
      else {
        if (ele.length === 16) {

          setValue({
            ...value,
            [e.target.name]: ele
          });
        } else {

          setValue({
            ...value,
            [e.target.name]: ele
          });
        }
      }
    } else if (e.target.name === 'HIN' || e.target.name === 'RegistrationNumber') {
      var ele = e.target.value.replace(/[^0-9a-zA-Z]/g, "")
      setValue({
        ...value,
        [e.target.name]: ele
      });
    }
    else if (e.target.name === 'Value') {

      const ele = e.target.value.replace(/[^0-9\.]/g, "");
      if (ele.startsWith('.')) {
        return;
      }
      if (ele === '') {

      } else if (!/^\d+$/.test(ele)) {
        setErrors({
          ...errors,
          ContactError: '',
        });
      } else {
        setErrors({
          ...errors,
          ContactError: '',
        });
      }

      if (ele.includes('.')) {
        if (ele.length === 16) {
          setValue({ ...value, [e.target.name]: ele });
        } else {
          if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
            const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g);
            if (!checkDot) {
              setValue({
                ...value,
                [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2)
              });
              return;
            } else {
              return;
            }
          } else {
            setValue({ ...value, [e.target.name]: ele });
          }
        }
      } else {
        setValue({ ...value, [e.target.name]: ele });
      }
    }
    else {

      setValue({
        ...value,
        [e.target.name]: e.target.value
      })
    }
  }

  useEffect(() => {
    if (value.PropertyCategoryCode) ResetFields_On_Change(value.PropertyCategoryCode);
  }, [value.PropertyCategoryCode])

  const ResetFields_On_Change = (Code) => {
    //Boat 
    if (Code !== 'B') {
      setValue({
        ...value,
        'BoatIDNumber': '', 'ManufactureYear': '', 'Length': '', 'RegistrationStateID': '', 'RegistrationNumber': '', 'VODID': null, 'MaterialID': null,
        'MakeID': '', 'ModelID': '', 'Comments': '', 'HIN': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '', 'BottomColorID': '', 'TopColorID': '',
      });
    }
    //Article
    if (Code !== 'A') {
      setValue({
        ...value,
        'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'Brand': '',
      })
    }
    //Other
    if (Code !== 'O') {
      setValue({
        ...value,
        'OtherID': null, 'Brand': '', 'SerialID': '', 'BottomColorID': '', 'ModelID': '', 'Quantity': '', 'QuantityUnitID': '',
      })
    }
    //Security
    if (Code !== 'S') {
      setValue({
        ...value,
        'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': null, 'SecurityDtTm': '', 'SerialID': '',
      })
    }
    //Weapon
    if (Code !== 'G') {
      setValue({
        ...value,
        'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'SerialID': '', 'MakeID': '', 'WeaponModelID': null, 'IsAuto': '', 'ManufactureYear': '',
        'BarrelLength': '',
      })
    }
  }

  const Add_Property = () => {
    if (value.PropertyCategoryCode === 'D' && drugLocalArr?.length === 0) {
      toastifyError('Add atleast one drug type');
      setErrors({ ...errors, ['PropertyTypeIDError']: '', })
      return
    } else {
      const {
        MasterPropertyID, PropertyID, AgencyID, IncidentID, CreatedByUserFK, ReportedDtTm, DestroyDtTm, Value: propertyValue,
        PropertyCategoryCode, PropertyTypeID, CategoryID, ClassificationID, OfficerID, LossCodeID, PossessionOfID,
        PropertyTag, NICB, Description, IsEvidence, IsSendToPropertyRoom, IsPropertyRecovered, MaterialID,
        PropertyArticleID, SerialID, ModelID, OAN, Quantity, Brand, TopColorID, BottomColorID,
        PropertyBoatID, BoatIDNumber, HIN, RegistrationNumber, VODID, Length, Comments, ManufactureYear,
        MakeID, RegistrationExpiryDtTm, PropulusionID, RegistrationStateID, SecurityDtTm,
        OtherID, PropertyOtherID, PropertySecurityID, SecurityIDNumber, Denomination, IssuingAgency, MeasureTypeID,
        WeaponIDNumber, Style, Finish, Caliber, Handle, IsAuto, BarrelLength, WeaponModelID, PropertyWeaponID,
        ModifiedByUserFK, MasterID, ArticleIDNumber, IsMaster, PropertyNumber, QuantityUnitID,
        SuspectedDrugTypeID, EstimatedDrugQty, FractionDrugQty, MeasurementUnitID, MeasurementTypeID, PropertyDrugID, PropertySourceDrugTypeID,
        MarijuanaTypeID, MarijuanaNumber, DrugManufacturedID, ClandistineLabsNumber,
        Items, DoseUnits, LiquidOunces, SolidGrams, SolidOunces, SolidPounds, PropertyDrugMeasure_Description, SuspectedDrugType_Description, ManufactureYearFrom
      } = value;

      const payload = {
        MasterPropertyID, PropertyID, AgencyID: loginAgencyID, IncidentID: IncID, CreatedByUserFK: loginPinID, ReportedDtTm, DestroyDtTm, Value: propertyValue, PropertyCategoryCode, PropertyTypeID, CategoryID, ClassificationID, OfficerID, LossCodeID, PossessionOfID,
        PropertyTag, NICB, Description, IsEvidence, IsSendToPropertyRoom, IsPropertyRecovered, MaterialID,
        PropertyArticleID, SerialID, ModelID, OAN, Quantity, Brand, TopColorID, BottomColorID,
        PropertyBoatID, BoatIDNumber, HIN, RegistrationNumber, VODID, Length, Comments, ManufactureYear,
        MakeID, RegistrationExpiryDtTm, PropulusionID, RegistrationStateID, SecurityDtTm,
        OtherID, PropertyOtherID, PropertySecurityID, SecurityIDNumber, Denomination, IssuingAgency, MeasureTypeID,
        WeaponIDNumber, Style, Finish, Caliber, Handle, IsAuto, BarrelLength, WeaponModelID, PropertyWeaponID,
        ModifiedByUserFK, MasterID, ArticleIDNumber, IsMaster, PropertyNumber, QuantityUnitID,
        SuspectedDrugTypeID, EstimatedDrugQty, FractionDrugQty, MeasurementUnitID, MeasurementTypeID, PropertyDrugID, PropertySourceDrugTypeID,
        MarijuanaTypeID, MarijuanaNumber, DrugManufacturedID, ClandistineLabsNumber,
        Items, DoseUnits, LiquidOunces, SolidGrams, SolidOunces, SolidPounds, PropertyDrugMeasure_Description, SuspectedDrugType_Description, ManufactureYearFrom
      };
      AddDeleteUpadate('Property/Insert_Property', payload).then((res) => {
        if (res.success) {
          if (isCad) {
            if (MstPage === "MST-Property-Dash") {
              navigate(`/cad/dispatcher?page=MST-Property-Dash&ProId=${stringToBase64(res?.PropertyID)}&MProId=${stringToBase64(res?.MasterPropertyID)}&ModNo=${res?.PropertyNumber?.trim()}&ProSta=${true}&ProCategory=${''}`);
            } else {
              navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(res?.PropertyID)}&MProId=${stringToBase64(res?.MasterPropertyID)}&ProSta=${true}&ProCategory=${''}`)
            }
          } else {
            if (MstPage === "MST-Property-Dash") {
              navigate(`/Prop-Home?page=MST-Property-Dash&ProId=${stringToBase64(res?.PropertyID)}&MProId=${stringToBase64(res?.MasterPropertyID)}&ModNo=${res?.PropertyNumber?.trim()}&ProSta=${true}&ProCategory=${value.PropertyCategoryCode}`);
            } else {
              navigate(`/Prop-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(res?.PropertyID)}&MProId=${stringToBase64(res?.MasterPropertyID)}&ProSta=${true}&ProCategory=${value.PropertyCategoryCode}`)
            }
          }
          Reset();
          if (uploadImgFiles?.length > 0) {
            upload_Image_File(res.PropertyID, res.MasterPropertyID)
            setuploadImgFiles('')
          }
          if (drugLocalArr?.length > 0 && value.PropertyCategoryCode === 'D') {
            Add_Drug(true, res.PropertyID, res.MasterPropertyID);
          }
          if (value?.PropertyCategoryCode === 'B') { dispatch(get_BoatModel_Drp_Data(loginAgencyID)) }
          if (value?.PropertyCategoryCode === 'G') { dispatch(get_WeaponModel_Drp_Data(loginAgencyID)); }
          toastifySuccess(res.Message);
          setErrors({ ...errors, ['LossCodeIDError']: '', }); setUpdateCount(updateCount + 1)
          get_Incident_Count(mainIncidentID, loginPinID);
          dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));
          setChangesStatus(false); setStatesChangeStatus(false); setPossenSinglData([]); setDrugLocalArr([]);
          // validateIncSideBar
          validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
        } else {
          toastifyError('error');
          setErrors({ ...errors, ['PropertyTypeIDError']: '', })
        }
      })
    }
  }

  const update_Property = () => {
    const previousValue = value.Value;
    const {
      MasterPropertyID, PropertyID, AgencyID, IncidentID, CreatedByUserFK, ReportedDtTm, DestroyDtTm, Value: propertyValue,
      PropertyCategoryCode, PropertyTypeID, CategoryID, ClassificationID, OfficerID, LossCodeID, PossessionOfID,
      PropertyTag, NICB, Description, IsEvidence, IsSendToPropertyRoom, IsPropertyRecovered, MaterialID,
      PropertyArticleID, SerialID, ModelID, OAN, Quantity, Brand, TopColorID, BottomColorID,
      PropertyBoatID, BoatIDNumber, HIN, RegistrationNumber, VODID, Length, Comments, ManufactureYear,
      MakeID, RegistrationExpiryDtTm, PropulusionID, RegistrationStateID, SecurityDtTm,
      OtherID, PropertyOtherID, PropertySecurityID, SecurityIDNumber, Denomination, IssuingAgency, MeasureTypeID,
      WeaponIDNumber, Style, Finish, Caliber, Handle, IsAuto, BarrelLength, WeaponModelID, PropertyWeaponID,
      ModifiedByUserFK, MasterID, ArticleIDNumber, IsMaster, PropertyNumber, QuantityUnitID,
      SuspectedDrugTypeID, EstimatedDrugQty, FractionDrugQty, MeasurementUnitID, MeasurementTypeID, PropertyDrugID, PropertySourceDrugTypeID,
      MarijuanaTypeID, MarijuanaNumber, DrugManufacturedID, ClandistineLabsNumber,
      Items, DoseUnits, LiquidOunces, SolidGrams, SolidOunces, SolidPounds, PropertyDrugMeasure_Description, SuspectedDrugType_Description, ManufactureYearFrom
    } = value;

    const payload = {
      MasterPropertyID, PropertyID, AgencyID: loginAgencyID, IncidentID: IncID, CreatedByUserFK: loginPinID, ReportedDtTm, DestroyDtTm, Value: propertyValue, PropertyCategoryCode, PropertyTypeID, CategoryID, ClassificationID, OfficerID, LossCodeID, PossessionOfID,
      PropertyTag, NICB, Description, IsEvidence, IsSendToPropertyRoom, IsPropertyRecovered, MaterialID,
      PropertyArticleID, SerialID, ModelID, OAN, Quantity, Brand, TopColorID, BottomColorID,
      PropertyBoatID, BoatIDNumber, HIN, RegistrationNumber, VODID, Length, Comments, ManufactureYear,
      MakeID, RegistrationExpiryDtTm, PropulusionID, RegistrationStateID, SecurityDtTm,
      OtherID, PropertyOtherID, PropertySecurityID, SecurityIDNumber, Denomination, IssuingAgency, MeasureTypeID,
      WeaponIDNumber, Style, Finish, Caliber, Handle, IsAuto, BarrelLength, WeaponModelID, PropertyWeaponID,
      ModifiedByUserFK, MasterID, ArticleIDNumber, IsMaster, PropertyNumber, QuantityUnitID,
      SuspectedDrugTypeID, EstimatedDrugQty, FractionDrugQty, MeasurementUnitID, MeasurementTypeID, PropertyDrugID, PropertySourceDrugTypeID,
      MarijuanaTypeID, MarijuanaNumber, DrugManufacturedID, ClandistineLabsNumber,
      Items, DoseUnits, LiquidOunces, SolidGrams, SolidOunces, SolidPounds, PropertyDrugMeasure_Description, SuspectedDrugType_Description, ManufactureYearFrom
    };
    AddDeleteUpadate('Property/Update_Property', payload).then((res) => {
      if (res?.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));
        setChangesStatus(false); setStatesChangeStatus(false);
        setErrors({ ...errors, ['PropertyTypeIDError']: '', })

        sessionStorage.setItem("propertyStolenValue", Encrypted_Id_Name(previousValue, 'SForStolenValue'));
        GetSingleData(DecPropID, DecMPropID);
        if (value?.PropertyCategoryCode === 'B') { dispatch(get_BoatModel_Drp_Data(loginAgencyID)) }
        if (value?.PropertyCategoryCode === 'G') { dispatch(get_WeaponModel_Drp_Data(loginAgencyID)); }
        get_List(propertyID, masterPropertyID);
        if (uploadImgFiles?.length > 0) {
          upload_Image_File()
          setuploadImgFiles('')
        }
        // validateIncSideBar
        validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
      } else {
        toastifyError('error');
        setErrors({ ...errors, ['PropertyTypeIDError']: '', })
      }
    })
  }

  useEffect(() => {
    console.log("MstPage", MstPage);
    console.log("MstPage", MstPage);
    console.log("masterPropertyStatus", masterPropertyStatus);
    if (MstPage === "MST-Property-Dash" && masterPropertyStatus == true) { newProperty() }
  }, [MstPage, masterPropertyStatus]);

  const newProperty = () => {
    SetNavigateStatus(false);
    if (MstPage === "MST-Property-Dash") {
      if (isCad) {
        navigate(`/cad/dispatcher?page=MST-Property-Dash&ProId=${0}&MProId=${0}&ModNo=${''}&ProSta=${false}&ProCategory=${''}`);
      } else {
        navigate(`/Prop-Home?page=MST-Property-Dash&ProId=${0}&MProId=${0}&ModNo=${''}&ProSta=${false}&ProCategory=${''}`);
      }
      Reset();
      setMultiImage([]);

      dispatch({ type: Master_Property_Status, payload: false })
      get_Property_Count(''); setChangesStatus(false); setStatesChangeStatus(false);
    } else {
      if (isCad) {
        navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&ProCategory=${''}`)
      } else {
        navigate(`/Prop-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&ProCategory=${''}`)
      }
      Reset(); setMultiImage([]); setPossessionID(''); setPossenSinglData([]);

      dispatch({ type: Master_Property_Status, payload: false })
      get_Property_Count(''); setChangesStatus(false); setStatesChangeStatus(false);
      setErrors({});
    }
    setPropertyStatus(false);
  }

  const columns1 = [
    {
      grow: 1, minwidth: "100px",
      name: 'Property Number',
      selector: (row) => row.PropertyNumber,
      sortable: true
    },
    {
      grow: 1,
      minWidth: "100px",
      name: 'Property Type',
      selector: (row) => row.PropertyType_Description,
      sortable: true
    },
    {
      grow: 1,
      minWidth: "100px",
      name: 'Category',
      selector: (row) => row.PropertyCategory_Description,
      sortable: true

    },
    {
      grow: 1,
      minWidth: "100px",
      name: 'Loss Code',
      selector: (row) => row.PropertyLossCode_Description,
      sortable: true
    },
    {
      grow: 1,
      minWidth: "100px",
      name: 'Owner Name',
      selector: (row) => row.Owner_Description,
      sortable: true
    },
    // {
    //   name: 'Evidence Flag',
    //   selector: (row) => row.Evidence,
    //   sortable: true
    // },
    {
      grow: 1,
      minWidth: "100px",
      name: 'Evidence Flag',
      selector: row => (
        <input type="checkbox" checked={row.IsEvidence === true} disabled />
      ),
      sortable: true
    },
    {
      grow: 0,
      minWidth: "80px",
      name: 'View',
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 30 }}>
          {
            getNibrsError(row.PropertyID, nibrsValidateData) ?
              <span
                onClick={(e) => { setErrString(row.PropertyID, nibrsValidateData) }}
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
      grow: 0,
      minWidth: "100px",
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK ?
                <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                  <i className="fa fa-trash"></i>
                </span>
                : <></>
              :
              <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>
    }
  ]

  const getNibrsError = (Id, nibrsValidateData) => {
    const arr = nibrsValidateData?.filter((item) => item?.PropertyID == Id);
    return arr?.[0]?.OnPageError;
  }

  const setErrString = (ID, nibrsValidateData) => {
    const arr = nibrsValidateData?.filter((item) => item?.PropertyID == ID);
    setNibrsErrStr(arr[0]?.OnPageError);
    setNibrsErrModalStatus(true);
  }

  const getStatusColors = (ID, nibrsValidateData) => {
    return getNibrsError(ID, nibrsValidateData) ? { backgroundColor: "rgb(255 202 194)" } : {};
  };

  const HideCol = React.useMemo(() => [
    {
      width: '250px',
      name: 'Property Number',
      selector: (row) => row.PropertyNumber,
      sortable: true
    },
    {
      name: 'Category',
      selector: (row) => row.PropertyCategory_Description,
      sortable: true
    },
    {
      name: 'Loss Code',
      selector: (row) => row.PropertyLossCode_Description,
      sortable: true,
      omit: hideDirector,
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 10 }}>
          <span onClick={(e) => { setHideDirector(!hideDirector); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
            <i>Hide</i>
          </span>
        </div>
    }
  ], [hideDirector]);

  const set_EditRow = (row) => {
    if (changesStatus) {
      const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
      modal?.show();

    } else {
      setuploadImgFiles(''); setMultiImage([]); setStatesChangeStatus(false);
      if (row.PropertyID || row.MasterPropertyID) {
        if (isCad) {
          navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(row?.PropertyID)}&MProId=${stringToBase64(row?.MasterPropertyID)}&ProSta=${true}&ProCategory=${row.PropertyType_Description}`)
        } else {
          navigate(`/Prop-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(row?.PropertyID)}&MProId=${stringToBase64(row?.MasterPropertyID)}&ProSta=${true}&ProCategory=${row.PropertyType_Description}`)
        }
        Reset();
        GetSingleData(row?.PropertyID, row?.MasterPropertyID);
        get_Property_Count(row?.PropertyID, row?.MasterPropertyID, MstPage === "MST-Property-Dash" ? true : false);

        setMasterPropertyID(row?.MasterPropertyID); dispatch({ type: MasterProperty_ID, payload: row?.MasterPropertyID });
        setPropertyID(row?.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID });
      }

    }
  }

  const Delete_Property = () => {
    const val = { 'PropertyID': delPropertyID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    AddDeleteUpadate('Property/Delete_Property', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_Incident_Count(mainIncidentID, loginPinID); setErrors('');
        dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));

        if (propertyID == delPropertyID) { newProperty() }
      } else { console.log("Somthing Wrong"); }
    })
  }

  const columns = [
    {
      name: 'Suspected Drug Type',
      selector: (row) => row.SuspectedDrugType_Description,
      sortable: true
    },
    {
      name: 'Measurement Unit',
      selector: (row) => row.MeasurementUnit_Description,
      sortable: true
    },
    {
      name: 'Measurement Type',
      selector: (row) => row.PropertyDrugMeasure_Description,
      sortable: true
    },
    {
      name: 'Estimated Qty',
      selector: (row) => row.EstimatedDrugQty,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Action</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 0, right: 0 }}>

          <button onClick={() => { setIsProperty(false); setPropertyDrugID(row.PropertyDrugID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
            <i className="fa fa-trash"></i>
          </button>
        </div>
    },

  ]

  const set_Edit_Value = (row) => {
    setDrugErrors('');
    setPropertyDrugID(row.PropertyDrugID); setDrugEditData(row); setDrugModal(true); setStatesChangeStatus(false);
  }

  const setStatusFalse = (e) => {
    setChangesStatus(false); setStatesChangeStatus(false);
    setPropertyDrugID(''); setDrugTypecode('');
    setDrugModal(true)
    setValue({
      ...value,
      'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementTypeID': '', 'PropertyDrugID': '',
      'PropertySourceDrugTypeID': '', 'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, '  ClandistineLabsNumber': '',
      'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
    })
  }

  const [drugErrors, setDrugErrors] = useState({
    'SuspectedDrugTypeIDError': '', 'EstimatedDrugQtyError': '', 'MeasurementUnitIDError': '', 'MeasurementTypeIDError': '',
  })

  const check_Drug_Validation_Error = () => {
    const SuspectedDrugTypeIDErr = RequiredFieldIncident(value.SuspectedDrugTypeID);
    const EstimatedDrugQtyErr = RequiredFieldIncident(value.EstimatedDrugQty);
    const MeasurementUnitIDErr = RequiredFieldIncident(value.MeasurementUnitID);
    const MeasurementTypeIDErr = RequiredFieldIncident(value.MeasurementTypeID);


    setDrugErrors(prevValues => {
      return {
        ...prevValues,
        ['SuspectedDrugTypeIDError']: SuspectedDrugTypeIDErr || prevValues['SuspectedDrugTypeIDErr'],
        ['EstimatedDrugQtyError']: EstimatedDrugQtyErr || prevValues['EstimatedDrugQtyError'],
        ['MeasurementUnitIDError']: MeasurementUnitIDErr || prevValues['MeasurementUnitIDError'],
        ['MeasurementTypeIDError']: MeasurementTypeIDErr || prevValues['MeasurementTypeIDError'],


      }
    })
  }

  // Check All Field Format is True Then Submit 
  const { SuspectedDrugTypeIDError, EstimatedDrugQtyError, MeasurementUnitIDError, MeasurementTypeIDError } = drugErrors

  useEffect(() => {
    if (SuspectedDrugTypeIDError === 'true' && EstimatedDrugQtyError === 'true' && MeasurementUnitIDError === 'true' && MeasurementTypeIDError === 'true') {
      if (propertyDrugID) { update_DrugModal(); }
      else {
        if (ProSta === 'true' || ProSta === true) {
          Add_Drug(true, 0, 0);
        } else {
          Add_Drug(false, 0, 0);
        }
      }
    }
  }, [SuspectedDrugTypeIDError, EstimatedDrugQtyError, MeasurementUnitIDError, MeasurementTypeIDError])

  useEffect(() => {
    if (propertyDrugID) {
      setValue({
        ...value,
        'SuspectedDrugTypeID': parseInt(drugEditData?.SuspectedDrugTypeID),

        'EstimatedDrugQty': drugEditData?.EstimatedDrugQty,
        'FractionDrugQty': drugEditData?.FractionDrugQty,
        'MeasurementTypeID': drugEditData?.MeasurementTypeID,
        'MasterPropertyID': drugEditData?.MasterPropertyID,
        'PropertyDrugID': drugEditData?.PropertyDrugID,
        'PropertySourceDrugTypeID': drugEditData?.PropertySourceDrugTypeID,
        'MarijuanaTypeID': drugEditData?.MarijuanaTypeID,
        'MarijuanaNumber': drugEditData?.MarijuanaNumber,
        'DrugManufacturedID': drugEditData?.DrugManufacturedID,
        'ClandistineLabsNumber': drugEditData?.ClandistineLabsNumber,
        'MeasurementUnitID': drugEditData?.MeasurementUnitID,

        'Items': drugEditData?.Items,
        'DoseUnits': drugEditData?.DoseUnits,
        'LiquidOunces': drugEditData?.LiquidOunces,
        'SolidGrams': drugEditData?.SolidGrams,
        'SolidOunces': drugEditData?.SolidOunces,
        'SolidPounds': drugEditData?.SolidPounds,
      })
      setDrugTypecode(Get_Drug_Code(drugEditData, suspectedDrugDrpData));
      getDrugMeasureUnit(drugEditData?.SuspectedDrugTypeID);
      getDrugMeasureType(drugEditData?.SuspectedDrugTypeID, drugEditData?.MeasurementUnitID);

    } else {
      setValue({
        ...value,
        'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementUnitID': null, 'MeasurementTypeID': '', 'PropertySourceDrugTypeID': '',
        'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, '  ClandistineLabsNumber': '',
        'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
      });
      setDrugErrors({
        ...drugErrors,
        'SuspectedDrugTypeIDError': '', 'EstimatedDrugQtyError': '', 'MeasurementUnitIDError': '', 'MeasurementTypeIDError': '',
        'solidPoundsError': '', 'solidOunceError': '', 'solidGramError': '', 'liquidOunceError': '', 'doseUnitsError': '', 'ItemsError': '',
      })
    }
  }, [drugEditData, drugModal])

  const Add_Drug = (ProStatus, proID, MstProID) => {
    if (ProStatus) {
      if (proID || MstProID) {

        const oldArr = drugLocalArr
        const newArr = oldArr.map(obj => ({
          MasterPropertyID: MstProID,
          PropertyID: proID,
          MeasurementUnitID: obj.MeasurementUnitID,
          SuspectedDrugTypeID: obj.SuspectedDrugTypeID,
          EstimatedDrugQty: obj.EstimatedDrugQty,
          FractionDrugQty: obj.FractionDrugQty,
          MeasurementTypeID: obj.MeasurementTypeID,
          PropertyCategoryCode: obj.PropertyCategoryCode,
          PropertySourceDrugTypeID: obj.PropertySourceDrugTypeID,
          CreatedByUserFK: obj.CreatedByUserFK,
          MarijuanaTypeID: obj.MarijuanaTypeID,
          MarijuanaNumber: obj.MarijuanaNumber,
          DrugManufacturedID: obj.DrugManufacturedID,
          ClandistineLabsNumber: obj.ClandistineLabsNumber,
          IsMaster: obj.IsMaster,
          SolidPounds: obj.SolidPounds,
          SolidOunces: obj.SolidOunces,
          SolidGrams: obj.SolidGrams,
          LiquidOunces: obj.LiquidOunces,
          DoseUnits: obj.DoseUnits,
          Items: obj.Items,
        }));

        insetLocalDrugData(newArr)
      } else {

        const result = drugData?.find(item => {
          if (item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID) {
            return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
          } else {
            return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
          }
        });
        if (result) {
          toastifyError('DrugType and MeasurementType Already Exists');
          setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
        } else {
          AddDeleteUpadate('PropertyDrug/Insert_PropertyDrug', value).then((res) => {

            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); onDrugClose();
            get_Data_Drug_Modal(masterPropertyID, propertyID);
            setChangesStatus(false); setStatesChangeStatus(false);
            setDrugModal(false);
            setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });

          })
        }
      }
    } else {
      const result = drugLocalArr?.find(item => {
        if (item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID) {
          return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
        } else {
          return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
        }
      });

      if (result) {

        toastifyError('DrugType and MeasurementType Already Exists');
        setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
      } else {
        value.PropertyDrugID = localDrugCount
        setLocalDrugCount(localDrugCount + 1)
        setDrugLocalArr([...drugLocalArr, value]);
        sessionStorage.setItem('DrugLocalData', JSON.stringify([...drugLocalArr, value]));
        setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
        setChangesStatus(false); setStatesChangeStatus(false); setDrugModal(false);

        onDrugClose();
      }

    }
  }

  const insetLocalDrugData = async (DataArr) => {
    try {
      DataArr?.forEach(async (data) => {
        const response = await AddDeleteUpadate(MstPage === "MST-Property-Dash" ? 'MainMasterPropertyDrug/Insert_MainMasterPropertyDrug' : 'PropertyDrug/Insert_PropertyDrug', data)
      });
      setDrugLocalArr([]);

    } catch (error) {
      console.log(error); setDrugLocalArr([]);
    }
  }

  const update_DrugModal = () => {
    if (drugLocalArr?.length > 0) {
      const newArray = drugLocalArr?.filter(item => item.PropertyDrugID == propertyDrugID);
      const ModifyArr = newArray?.map(obj => ({
        'MeasurementUnitID': value?.MeasurementUnitID,
        'SuspectedDrugTypeID': value?.SuspectedDrugTypeID,
        'EstimatedDrugQty': value?.EstimatedDrugQty,
        'FractionDrugQty': value?.FractionDrugQty,
        'MeasurementTypeID': value?.MeasurementTypeID,
        'PropertyCategoryCode': value?.PropertyCategoryCode,
        'PropertySourceDrugTypeID': value?.PropertySourceDrugTypeID,
        'CreatedByUserFK': value?.CreatedByUserFK,
        'MarijuanaTypeID': value?.MarijuanaTypeID,
        'MarijuanaNumber': value?.MarijuanaNumber,
        'DrugManufacturedID': value?.DrugManufacturedID,
        'ClandistineLabsNumber': value?.ClandistineLabsNumber,
        'SolidPounds': value?.SolidPounds,
        'SolidOunces': value?.SolidOunces,
        'SolidGrams': value?.SolidGrams,
        'LiquidOunces': value?.LiquidOunces,
        'DoseUnits': value?.DoseUnits,
        'Items': value?.Items,
        'PropertyDrugMeasure_Description': value.PropertyDrugMeasure_Description,
        'SuspectedDrugType_Description': value.SuspectedDrugType_Description,
        'IsMaster': obj.IsMaster,
        'PropertyDrugID': obj.PropertyDrugID,
      }));

      const result = drugLocalArr?.find(item => {
        if (item?.PropertyDrugID != ModifyArr[0]?.PropertyDrugID) {
          if (item.SuspectedDrugTypeID == ModifyArr[0]?.SuspectedDrugTypeID && item?.MeasurementTypeID == ModifyArr[0]?.MeasurementTypeID) {
            return item.SuspectedDrugTypeID == ModifyArr[0]?.SuspectedDrugTypeID && item?.MeasurementTypeID == ModifyArr[0]?.MeasurementTypeID
          } else {
            return item.SuspectedDrugTypeID == ModifyArr[0]?.SuspectedDrugTypeID && item?.MeasurementTypeID == ModifyArr[0]?.MeasurementTypeID
          }
        }
      });
      if (result) {

        toastifyError('DrugType and MeasurementType Already Exists');
        setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
      } else {
        const LastArray = drugLocalArr.map(obj => obj.PropertyDrugID == propertyDrugID ? ModifyArr[0] : obj);
        setDrugLocalArr(LastArray); onDrugClose();
        setChangesStatus(false); setStatesChangeStatus(false); setDrugModal(false);
        setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' })
        setDrugEditData({})
      }

    } else {
      const result = drugData?.find(item => {
        if (item.PropertyDrugID != value['PropertyDrugID']) {
          if (item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID) {
            return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
          } else {
            return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
          }
        }
      });
      if (result) {

        toastifyError('DrugType and MeasurementType Already Exists');
        setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
      } else {
        AddDeleteUpadate('PropertyDrug/Update_PropertyDrug', value).then((res) => {

          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          get_Data_Drug_Modal(masterPropertyID, propertyID,);
          setChangesStatus(false); setStatesChangeStatus(false);
          setDrugModal(false);
          setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' })
          setDrugEditData({}); onDrugClose();
        })
      }
    }
  }

  const Delete_Prpperty_Drug = () => {
    if (drugLocalArr?.length > 0) {
      const newArray = drugLocalArr?.filter(item => item.PropertyDrugID !== propertyDrugID);
      setDrugLocalArr([...newArray]);
    } else {
      const val = { 'PropertyDrugID': propertyDrugID, 'DeletedByUserFK': loginPinID }
      AddDeleteUpadate('PropertyDrug/Delete_PropertyDrug', val).then((res) => {
        if (res) {

          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          get_Data_Drug_Modal(masterPropertyID, propertyID,);
          setChangesStatus(false); setStatesChangeStatus(false); onDrugClose()
          dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));
        } else console.log("Somthing Wrong");
      })
    }
  }

  const onDrugClose = () => {
    setDrugModal(false);
    setValue({
      ...value,
      'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementTypeID': '', 'ClandistineLabsNumber': '',
      'PropertySourceDrugTypeID': '', 'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null,
      'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
    })
    setDrugErrors({
      ...drugErrors,
      'SuspectedDrugTypeIDError': '', 'EstimatedDrugQtyError': '', 'MeasurementUnitIDError': '', 'MeasurementTypeIDError': '',

    })
    setDrugEditData({}); setPropertyDrugID('');
  }

  const get_Name_MultiImage = (propertyId, masterPropertyId, isSearch = false) => {
    const val = { 'PropertyID': propertyId, 'MasterPropertyID': masterPropertyId, 'IsMaster': isSearch ? true : MstPage === "MST-Property-Dash" ? true : false, }
    const val1 = { 'PropertyID': 0, 'MasterPropertyID': masterPropertyId, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
    fetchPostData('Property/GetData_PropertyPhoto', MstPage === "MST-Property-Dash" ? val1 : val)
      .then((res) => {
        if (res) {
          setMultiImage(res);
        }
        else { setMultiImage([]); }
      })
  }

  //-------------------------Image---------------------------
  // to update image data
  const update_Property_MultiImage = () => {
    const val = { "ModifiedByUserFK": loginPinID, "AgencyID": loginAgencyID, "PictureTypeID": imgData?.PictureTypeID, "ImageViewID": imgData?.ImageViewID, "ImgDtTm": imgData?.ImgDtTm, "OfficerID": imgData?.OfficerID, "Comments": imgData?.Comments, "DocumentID": imgData?.DocumentID }
    AddDeleteUpadate('PropertyVehicle/Update_PropertyVehiclePhotoDetail', val).then((res) => {
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

  const upload_Image_File = async (propID, propMID) => {
    const formdata = new FormData();
    const EncFormdata = new FormData();
    const newData = [];
    const EncDocs = [];
    for (let i = 0; i < uploadImgFiles.length; i++) {
      const { file, imgData } = uploadImgFiles[i];
      const val = {
        'PropertyID': propertyID ? propertyID : propID,
        'MasterPropertyID': masterPropertyID ? masterPropertyID : propMID,
        'CreatedByUserFK': loginPinID,
        'PictureTypeID': imgData?.PictureTypeID,
        'ImageViewID': imgData?.ImageViewID,
        'ImgDtTm': imgData?.ImgDtTm,
        'OfficerID': imgData?.OfficerID,
        'Comments': imgData?.Comments,
        'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
        'AgencyID': loginAgencyID,
      }
      const val1 = {
        'PropertyID': 0,
        'MasterPropertyID': masterPropertyID ? masterPropertyID : propMID,
        'CreatedByUserFK': loginPinID,
        'PictureTypeID': imgData?.PictureTypeID,
        'ImageViewID': imgData?.ImageViewID,
        'ImgDtTm': imgData?.ImgDtTm,
        'OfficerID': imgData?.OfficerID,
        'Comments': imgData?.Comments,
        'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
        'AgencyID': loginAgencyID,
      }
      const values = JSON.stringify(MstPage === "MST-Property-Dash" ? val1 : val);
      newData.push(values);

      const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
      EncDocs.push(EncPostData);

      formdata.append("file", file);
      EncFormdata.append("file", file);
    }
    formdata.append("Data", JSON.stringify(newData));
    EncFormdata.append("Data", EncDocs);
    AddDelete_Img('Property/Insert_PropertyPhoto', formdata, EncFormdata).then((res) => {
      if (res.success) {
        get_Name_MultiImage(propertyID ? propertyID : propID, masterPropertyID ? masterPropertyID : propMID);
        setuploadImgFiles('')
      }
    }).catch(err => console.log(err))
  }

  const delete_Image_File = (e) => {
    const value = { 'PhotoID': imageId, 'DeletedByUserFK': loginPinID }
    AddDeleteUpadate('Property/Delete_PropertyPhoto', value).then((data) => {
      if (data.success) {
        const parsedData = JSON.parse(data.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_Name_MultiImage(propertyID, masterPropertyID);

        setModalStatus(false);
        setImageId('');
      } else {
        toastifyError(data?.Message);
      }
    });
  }

  const onChangeLossCode = (e, name) => {
    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true)
    if (e) {
      if (name === 'LossCodeID') {
        setLossCode(e.id); setPorpRecType(e.code);


        if (propCategoryCode === '09' || propCategoryCode === '22' || propCategoryCode === '65' || propCategoryCode === '66' || propCategoryCode === '77' || propCategoryCode === '11' || propCategoryCode === '10' || propCategoryCode === '48') {
          setValue({ ...value, [name]: e.value, });

        }
        else if (propCategoryCode === '88') {
          setValue({ ...value, [name]: e.value, });
        }
        else {
          setValue({ ...value, [name]: e.value, ['Value']: '', });
        }
        setErrors(({ ...errors, ['ContactError']: 'true', 'CategoryIDError': '' }));

      } else {
        setValue({ ...value, [name]: e.value, });
      }
    } else {
      if (name === 'LossCodeID') {
        setLossCode(''); setPorpRecType('');

        if (propCategoryCode === '09' || propCategoryCode === '22' || propCategoryCode === '65' || propCategoryCode === '66' || propCategoryCode === '77' || propCategoryCode === '11' || propCategoryCode === '10' || propCategoryCode === '48') {
          setValue({ ...value, [name]: null, });
        }
        else if (propCategoryCode === '88') {
          setValue({ ...value, [name]: null, });
        }
        else {
          setValue({ ...value, [name]: null, ['Value']: '', });
        }
        setErrors(({ ...errors, ['ContactError']: 'true' }));
      } else {
        setValue({ ...value, [name]: null, });
      }
    }
  };

  const startRef = React.useRef();
  const startRef1 = React.useRef();
  const startRef2 = React.useRef();
  const startRef3 = React.useRef();
  const startRef4 = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
      startRef1.current.setOpen(false);
      startRef2.current.setOpen(false);
      startRef3.current.setOpen(false);
      startRef4.current.setOpen(false);
    }
  };

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const conditionalRowStyles = [
    {
      when: () => true,
      style: (row) => ({
        ...getStatusColors(row.PropertyID, nibrsValidateData),
        ...(row.PropertyID === DecPropID ? {
          backgroundColor: '#001f3fbd',
          color: 'white',
          cursor: 'pointer',
        } : {})
      }),
    },
  ];

  const conditionalRowStylesDrug = [
    {
      when: row => row.PropertyDrugID === propertyDrugID,
      style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
    },
  ];



  const stylesNoColorSourceDrug = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 32,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };



  const GetSingleDataPassion = (nameID, masterNameID) => {
    const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
    fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
      if (res) {
        setPossenSinglData(res);
      } else {
        setPossenSinglData([]);
      }
    })
  }

  const onMasterPropClose = () => {
    if (isCADSearch) {
      navigate('/cad/dashboard-page');
    } else {
      navigate('/dashboard-page');
    }
  }

  const filterMeasureTypeArray = (data) => {

    if (drugTypecode === 'E') {
      const filterArray = data?.filter((item) => { if (item?.id != "DU") return item });
      return filterArray
    } else if (drugTypecode === 'E' || drugTypecode === 'G' || drugTypecode === 'K') {
      return data
    } else {
      const filterArray = data?.filter((item) => { if (item?.id != "NP") { return item } });
      return filterArray
    }
  }

  const getProLossType = (data, nibrsCodeArr) => {
    const CodeArray = ['100', '35', '521', '522', '526', '26H'];
    const CommanCodes = nibrsCodeArr?.filter(value => CodeArray.includes(value));

    if (CommanCodes?.length > 0) {
      const returnData = data?.filter((item) => { if (item?.id === "None") return item })
      return returnData

      // return data
    } else if (nibrsCodeArr?.includes('280')) {
      const returnData = data?.filter((item) => { if (item?.id === "None" || item?.id === "RECD") return item })
      return returnData

    } else {
      return data

    }
  }

  const nibrsValidateProperty = (incidentID) => {
    setclickNibLoder(true);
    try {
      fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'PropertyId': '', 'gIntAgencyID': loginAgencyID }).then((data) => {
        if (data) {
          if (data?.Properties?.length > 0) {
            const propArr = data?.Properties?.filter((item) => item?.PropertyType !== 'V');
            console.log("🚀 ~ fetchPostDataNibrs ~ propArr:", propArr)

            if (propArr?.length > 0) {
              setnibrsValidateData(propArr || []); setclickNibLoder(false);

            } else {
              setnibrsValidateData([]); setclickNibLoder(false);

            }

          } else {
            setnibrsValidateData([]); setclickNibLoder(false);

          }

        } else {
          setnibrsValidateData([]); setclickNibLoder(false);

        }
      })
    } catch (error) {
      setnibrsValidateData([]); setclickNibLoder(false);
    }
  }

  const handleClick = () => {
    setShowPage('Miscellaneous Information')
  };

  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setNameModalStatus(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-11 pt-1 p-0" >
            <div className="row ">
              <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                <label htmlFor="" className='new-label px-0'>Property No.</label>
              </div>
              <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                <input type="text" className='readonlyColor' value={propertyNumber ? propertyNumber : 'Auto Generated'} required readOnly />
              </div>
              <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                <label htmlFor="" className='new-label'>
                  Loss Code
                  {errors.LossCodeIDError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</p>
                  ) : null}
                </label>
              </div>
              <div className="col-3 col-md-3 col-lg-3 mt-1">
                <Select
                  name='LossCodeID'
                  value={propertyLossCodeDrpData?.filter((obj) => obj.value === value?.LossCodeID)}

                  options={propertyLossCodeDrpData}

                  onChange={(e) => onChangeLossCode(e, 'LossCodeID')}
                  isClearable
                  placeholder="Select..."
                  styles={nibrsSubmittedPropertyMain === 1 ? LockFildscolour : Requiredcolour}
                  isDisabled={nibrsSubmittedPropertyMain === 1 ? true : false}
                />
              </div>

              <div className="col-3 col-md-3 col-lg-2 mt-2">
                <label htmlFor="" className='new-label'>Reported Date/Time</label>
              </div>
              <div className="col-3 col-md-3 col-lg-2">
                {
                  MstPage === "MST-Property-Dash" ?
                    <DatePicker
                      id='ReportedDtTm'
                      name='ReportedDtTm'
                      ref={startRef}


                      onKeyDown={(e) => {
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                          e?.preventDefault();
                        } else {
                          onKeyDown(e);
                        }
                      }}
                      dateFormat="MM/dd/yyyy HH:mm"

                      isClearable={false}
                      onChange={(date) => {
                        !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                        setIncidentReportedDate(date ? getShowingMonthDateYear(date) : null)
                        if (date > new Date(datezone)) {
                          date = new Date(datezone);
                        }
                        if (date >= new Date()) {
                          setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date(date)) : null })
                        } else if (date <= new Date(incReportedDate)) {
                          setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date(date)) : null })
                        } else {
                          setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null })
                        }
                      }}
                      selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}

                      disabled={nibrsSubmittedPropertyMain === 1}
                      className={nibrsSubmittedPropertyMain === 1 ? 'LockFildsColour' : 'requiredColor'}
                      autoComplete="Off"
                      placeholderText={'Select...'}
                      timeInputLabel
                      showTimeSelect
                      timeIntervals={1}
                      timeCaption="Time"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      maxDate={new Date(datezone)}
                      filterTime={(date) => filterPassedTimeZone(date, datezone)}
                      timeFormat="HH:mm "
                      is24Hour

                    />
                    :
                    <DatePicker
                      id='ReportedDtTm'
                      name='ReportedDtTm'

                      ref={startRef}

                      onKeyDown={(e) => {
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                          e?.preventDefault();
                        } else {
                          onKeyDown(e);
                        }
                      }}
                      dateFormat="MM/dd/yyyy HH:mm"
                      isClearable={false}
                      selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                      onChange={(date) => {
                        !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                        if (date > new Date(datezone)) {
                          date = new Date(datezone);
                        }
                        setIncidentReportedDate(date ? getShowingMonthDateYear(date) : null)
                        if (date >= new Date()) {
                          setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date()) : null })
                        } else if (date <= new Date(incReportedDate)) {
                          setValue({ ...value, ['ReportedDtTm']: incReportedDate ? getShowingDateText(incReportedDate) : null })
                        } else {
                          setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null })
                        }
                      }}
                      autoComplete="Off"

                      disabled={nibrsSubmittedPropertyMain === 1}
                      className={nibrsSubmittedPropertyMain === 1 ? 'LockFildsColour' : 'requiredColor'}
                      timeInputLabel
                      showTimeSelect
                      timeIntervals={1}
                      timeCaption="Time"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={new Date(incReportedDate)}
                      maxDate={new Date(datezone)}
                      showDisabledMonthNavigation

                      timeFormat="HH:mm "
                      is24Hour

                      filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                    />
                }
              </div>

            </div>
            <div className="row">
              <div className="col-3 col-md-3 col-lg-1 mt-2">
                <span className='new-label '>
                  Type{errors.PropertyTypeIDError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PropertyTypeIDError}</p>
                  ) : null}
                </span>
              </div>
              <div className="col-3 col-md-3 col-lg-3 mt-1">
                <Select
                  styles={nibrsSubmittedPropertyMain === 1 ? LockFildscolour : propertyID || masterPropertyID ? customStylesWithOutColor : Requiredcolour}
                  name='PropertyTypeID'
                  value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                  options={propertyTypeData}
                  onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                  isClearable
                  placeholder="Select..."
                  isDisabled={propertyID || masterPropertyID || isDrugOffense || nibrsSubmittedPropertyMain === 1 ? true : false}
                />
              </div>
              <div className="col-3 col-md-3 col-lg-1 mt-2">
                <span data-toggle="modal" onClick={() => { setOpenPage('Property Description') }} data-target="#ListModel" className='new-link'>
                  Category
                  {
                    loginAgencyState === 'TX' ?
                      check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'ToolTip')
                        ?
                        check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'ToolTip')
                        :
                        <></>
                      :
                      <></>
                  }
                  {errors.CategoryIDError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</p>
                  ) : null}
                </span>
              </div>
              <div className="col-3 col-md-3 col-lg-3 mt-1">
                <Select
                  name='CategoryID'
                  id='CategoryID'
                  styles={
                    nibrsSubmittedPropertyMain === 1 ? LockFildscolour :
                      loginAgencyState === 'TX' ?
                        check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'Color')
                          ?
                          check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'Color')
                          :
                          Requiredcolour
                        :
                        Requiredcolour
                  }

                  value={propertyCategoryData?.filter((obj) => obj.value === value?.CategoryID)}
                  options={propertyCategoryData}
                  onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                  isClearable
                  placeholder="Select..."
                  isDisabled={nibrsSubmittedPropertyMain === 1 ? true : false}
                />
              </div>

              <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                <label htmlFor="" className='new-label px-0' style={{ paddingLeft: '5px' }}>Classification</label>
              </div>
              <div className="col-9 col-md-9 col-lg-2 mt-1">
                <Select
                  styles={nibrsSubmittedPropertyMain === 1 ? LockFildscolour : customStylesWithOutColor}
                  name='ClassificationID'
                  value={propertyClassificationData?.filter((obj) => obj.value === value?.ClassificationID)}
                  options={propertyClassificationData}
                  onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                  isClearable
                  placeholder="Select..."
                  isDisabled={nibrsSubmittedPropertyMain === 1 ? true : false}
                />
              </div>


              <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                <label htmlFor="" className='new-label px-0' style={{ paddingLeft: '5px' }}> Possession&nbsp;Of</label>
              </div>
              {/* <div className="col-8 col-md-8 col-lg-3 d-flex mt-1 "> */}
              <div className="col-8 col-md-8 col-lg-2 mt-1">
                {
                  MstPage === "MST-Property-Dash" ?
                    <Select
                      name='PossessionOfID'
                      styles={customStylesWithOutColor}
                      value={mastersNameDrpData?.filter((obj) => obj.value === value?.PossessionOfID)}
                      isClearable
                      options={mastersNameDrpData}
                      onChange={(e) => { ChangeDropDown(e, 'PossessionOfID') }}
                      placeholder="Select..."
                    />
                    :
                    <Select
                      name='PossessionOfID'
                      styles={customStylesWithOutColor}
                      value={arresteeNameData?.filter((obj) => obj.value === value?.PossessionOfID)}
                      isClearable
                      options={arresteeNameData}
                      onChange={(e) => { ChangeDropDown(e, 'PossessionOfID') }}
                      placeholder="Select..."
                    />
                }
              </div>

              <span
                onClick={() => {
                  if (possessionID) { GetSingleDataPassion(possessionID); } setNameModalStatus(true);
                }}
                data-toggle="modal" data-target="#MasterModal"
                className=" btn btn-sm bg-green text-white py-1 mt-1"
                style={{ marginRight: 'auto' }}
              >
                <i className="fa fa-plus" >
                </i>
              </span>

              {/* </div> */}

              {/* <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                <label htmlFor="" className='new-label px-0' style={{ paddingLeft: '5px' }}>Possession&nbsp;Of</label>
              </div>
              <div className="col-8 col-md-8 col-lg-2 mt-1 ">
                {
                  MstPage === "MST-Property-Dash" ?
                    <Select
                      name='PossessionOfID'
                      styles={customStylesWithOutColor}
                      value={mastersNameDrpData?.filter((obj) => obj.value === value?.PossessionOfID)}
                      isClearable
                      options={mastersNameDrpData}
                      onChange={(e) => { ChangeDropDown(e, 'PossessionOfID') }}
                      placeholder="Select..."
                    />
                    :
                    <Select
                      name='PossessionOfID'
                      styles={customStylesWithOutColor}
                      value={arresteeNameData?.filter((obj) => obj.value === value?.PossessionOfID)}
                      isClearable
                      options={arresteeNameData}
                      onChange={(e) => { ChangeDropDown(e, 'PossessionOfID') }}
                      placeholder="Select..."
                    />
                }
            
              </div>
                <span
                  data-toggle="modal" data-target="#MasterModal"
                  onClick={() => {
                    if (possessionID) { GetSingleDataPassion(possessionID); } setNameModalStatus(true);
                  }}
                  className="col-1 col-md-1 col-lg-1 btn btn-sm bg-green text-white py-1 mt-1"
                >
                  <i className="fa fa-plus" >
                  </i>
                </span> */}



              <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                <label htmlFor="" className='new-label '>Primary&nbsp;Officer{errors.OfficerIDError !== 'true' ? (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</p>
                ) : null}</label>
              </div>
              <div className="col-3 col-md-3 col-lg-3 mt-1">
                <Select
                  name='OfficerID'
                  styles={customStylesWithOutColor}
                  value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                  isClearable
                  options={agencyOfficerDrpData}
                  onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                  placeholder="Select..."
                />
              </div>

              <div className="col-3 col-md-3 col-lg-2 mt-2">
                <label htmlFor="" className='new-label'>
                  Value
                  {errors.ContactError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                  ) : null}
                </label>
              </div>
              <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                <input
                  type="text"
                  name="Value"
                  id="Value"

                  // className={nibrsSubmittedPropertyMain === 1 || !value?.CategoryID ? 'readonlyColor' : lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                  className={nibrsSubmittedPropertyMain === 1 ? 'LockFildsColour' : !value?.CategoryID ? 'readonlyColor' : lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD'
                    ? 'requiredColor'
                    : ''
                  }
                  maxLength={9}
                  disabled={nibrsSubmittedPropertyMain === 1 || !value?.CategoryID ? true : propCategoryCode === '09' || propCategoryCode === '22' || propCategoryCode === '65' || propCategoryCode === '66' || propCategoryCode === '88' || propCategoryCode === '10' || propCategoryCode === '10' || propCategoryCode === '48'}
                  value={`$${value?.Value}`}
                  onChange={HandleChanges}
                  required
                  autoComplete='off'
                />
              </div>

            </div>
            <div className="row">
              <div className="col-3 col-md-3 col-lg-1">
              </div>
              <div className="col-3 col-md-3 col-lg-4">
                <div className="form-check">
                  <input className="form-check-input" name='IsEvidence' value={value?.IsEvidence} onChange={HandleChanges} checked={value?.IsEvidence} type="checkbox" id="flexCheckDefault" disabled={editval[0]?.IsEvidence ? true : false} />
                  <label className="form-check-label" for="flexCheckDefault">
                    Evidence
                  </label>
                </div>



              </div>

              <div className=" col-3 col-md-3 col-lg-3 px-1 mt-1">
                {navigateStatus && (
                  <span
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    style={{
                      border: '1px solid red', backgroundColor: '#ffe6e6', color: isHovered ? 'blue' : 'red',
                      padding: '3px', borderRadius: '4px', display: 'inline-block',
                      transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '15px', width: "100%", textAlign: "center"
                    }}
                  >
                    Navigate to Miscellaneous Information
                  </span>
                )}
              </div>

            </div>

          </div>
          <div className="col-3 col-md-3 col-lg-1 pt-3 " >
            <div className="img-box" >
              <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                {
                  multiImage.length > 0 ?
                    multiImage?.map((item) => (
                      <div key={item.PropertyTypeID} className='model-img' onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel">
                        <img src={`data:image/png;base64,${item.Photo}`} style={{ height: '100px' }} />
                      </div>
                    ))
                    :
                    <div onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel">
                      <img src={defualtImage} />
                    </div>
                }
              </Carousel>
            </div>
          </div>
          {/* Alert Master */}
          <div className='col-lg-12'>
            <AlertTable availableAlert={availableAlert} masterPropertyID={masterPropertyID} ProSta={ProSta} labelCol="col-lg-1" />
          </div>
          {/* ARTICLE   */}
          {
            value.PropertyCategoryCode === 'A' ?
              <div className="col-12 col-md-12 col-lg-12 mt-1 p-0" >
                <fieldset>
                  <legend>Article</legend>
                  <div className="row">
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Serial Id</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='SerialID' id='SerialID' autoComplete='off' value={value?.SerialID} onChange={HandleChanges} className='' required />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Model Id</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">

                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Color')
                      }} data-target="#ListModel" className='new-link'>
                        Top Color
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-1">
                      <Select
                        name='TopColorID'
                        value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                        options={topColorDrpData}
                        styles={customStylesWithOutColor}
                        onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  px-0 mt-2 ">
                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Color')
                      }} data-target="#ListModel" className='new-link'>
                        Bottom Color
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-1">
                      <Select
                        name='BottomColorID'
                        value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                        options={bottomColorDrpData}
                        styles={customStylesWithOutColor}
                        onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                      <label htmlFor="" className='new-label'>OAN</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1 text-field">
                      <input type="text" name='OAN' id='OAN' maxLength={20} value={value?.OAN} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                      <label htmlFor="" className='new-label'>Quantity</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1 text-field">
                      <input type="text" name='Quantity' id='Quantity' maxLength={20} value={value?.Quantity} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                      <label htmlFor="" className='new-label'>Brand</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1 text-field">
                      <input type="text" name='Brand' id='Brand' maxLength={20} value={value?.Brand} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-12  col-md-12 col-lg-3 mt-md-1 " >
                      {
                        (!propertyID && !masterPropertyID) && (ProSta != 'true' || ProSta != true) &&
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          data-toggle="modal"
                          data-target="#PropertyModal"
                          onClick={() => {
                            dispatch(get_Property_Article_Search_Data(possessionID, value?.SerialID, value?.ModelID, value?.Brand, value?.LossCodeID, value?.TopColorID, value?.CategoryID, value?.PropertyTypeID, value?.PropertyCategoryCode,

                              value?.OfficerID, value?.OAN, value?.Quantity, value?.Value, value?.BottomColorID, value?.ClassificationID, setSearchModalState, loginAgencyID))
                            setSearchModalState(true)
                          }}
                        >
                          Search
                        </button>
                      }
                    </div>
                  </div>
                </fieldset>
              </div>
              :
              <></>
          }
          {/* Others */}
          {
            value.PropertyCategoryCode === 'O' ?
              <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                <fieldset>
                  <legend>Other</legend>
                  <div className="row">
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Brand</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Serial Id</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Color')
                      }} data-target="#ListModel" className='new-link'>
                        Top Color
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='TopColorID'
                        value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                        options={topColorDrpData}
                        styles={customStylesWithOutColor}
                        onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 px-0  mt-2">
                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Color')
                      }} data-target="#ListModel" className='new-link'>
                        Bottom Color
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='BottomColorID'
                        value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                        options={bottomColorDrpData}
                        styles={customStylesWithOutColor}
                        onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Model Id</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Quantity</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='Quantity' id='Quantity' value={value?.Quantity} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1 px-0 mt-2">
                      <label htmlFor="" className='new-label '>Quantity Unit</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        styles={customStylesWithOutColor}
                        name='QuantityUnitID'
                        value={measureTypeDrpData?.filter((obj) => obj.value === value?.QuantityUnitID)}
                        options={measureTypeDrpData}
                        onChange={(e) => ChangeDropDown(e, 'QuantityUnitID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-12  col-md-12 col-lg-3   mt-md-1" >
                      {
                        (!propertyID && !masterPropertyID) && (ProSta != 'true' || ProSta != true) &&
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          data-toggle="modal"
                          data-target="#PropertyModal"
                          onClick={() => {
                            dispatch(get_Property_Other_Search_Data(value?.SerialID, value?.TopColorID, value?.ModelID, value?.Brand, value?.LossCodeID, value?.CategoryID, value?.PropertyTypeID, value?.PropertyCategoryCode, value?.OfficerID, value?.OAN, value?.Quantity, value?.Value, value?.BottomColorID, value?.ClassificationID, value?.QuantityUnitID, setSearchModalState, loginAgencyID));
                            setSearchModalState(true)
                          }}
                        >
                          Search
                        </button>
                      }
                    </div>
                  </div>
                </fieldset>
              </div>
              :
              <></>
          }
          {/* Security */}
          {
            value.PropertyCategoryCode === 'S' ?
              <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                <fieldset>
                  <legend>Security</legend>
                  <div className="row">
                    <div className="col-3 col-md-3 col-lg-2  mt-2">
                      <label htmlFor="" className='new-label'>Denomination</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='Denomination' maxLength={16} id='Denomination' value={value?.Denomination} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-2">
                      <label htmlFor="" className='new-label'>Issuing Agency</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='IssuingAgency' id='IssuingAgency' value={value?.IssuingAgency} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-2">
                      <label htmlFor="" className='new-label'>Measure Type</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='MeasureTypeID'

                        value={measureTypeDrpData?.filter((obj) => obj.value === value?.MeasureTypeID)}
                        styles={value?.Denomination ? customStylesWithOutColor : 'readonlyColor'}
                        options={measureTypeDrpData}
                        onChange={(e) => ChangeDropDown(e, 'MeasureTypeID')}
                        isClearable
                        placeholder="Select..."
                        isDisabled={value?.Denomination ? false : true}
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-2">
                      <label htmlFor="" className='new-label'>Security Date</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 ">
                      <DatePicker
                        id='SecurityDtTm'
                        name='SecurityDtTm'
                        ref={startRef1}

                        onKeyDown={(e) => {
                          if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                            e?.preventDefault();
                          } else {
                            onKeyDown(e);
                          }
                        }}
                        onChange={(date) => { setStatesChangeStatus(true); setSecurityDate(date); setValue({ ...value, ['SecurityDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                        className=''
                        dateFormat="MM/dd/yyyy"
                        isClearable={value?.SecurityDtTm ? true : false}
                        selected={securityDate}
                        placeholderText={value?.SecurityDtTm ? value.SecurityDtTm : 'Select...'}
                        timeIntervals={1}
                        autoComplete="Off"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        filterTime={filterPassedTime}
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-2">
                      <label htmlFor="" className='new-label'>Serial Id</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-12  col-md-12 col-lg-4   mt-md-1" >
                      {
                        (!propertyID && !masterPropertyID) && (ProSta != 'true' || ProSta != true) &&
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          data-toggle="modal"
                          data-target="#PropertyModal"
                          onClick={() => {
                            dispatch(get_Property_Security_Search_Data(value?.SerialID, value?.IssuingAgency, value?.MeasureTypeID, value?.SecurityDtTm, value?.CategoryID, value?.Denomination, value?.PropertyTypeID, value?.PropertyCategoryCode,
                              value?.OfficerID, value?.OAN, value?.Quantity, value?.Value, value?.BottomColorID, value?.ClassificationID, value?.LossCodeID,
                              setSearchModalState, loginAgencyID));
                            setSearchModalState(true)
                          }}
                        >
                          Search
                        </button>
                      }
                    </div>
                  </div>
                </fieldset>
              </div>
              :
              <></>
          }
          {/* Weapon */}
          {
            value.PropertyCategoryCode === 'G' ?
              <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                <fieldset>
                  <legend>Weapon</legend>
                  <div className="row">
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Style</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='Style' id='Style' value={value?.Style} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Finish</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='Finish' id='Finish' value={value?.Finish} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Caliber</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='Caliber' maxLength={10} id='Caliber' value={value?.Caliber} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Handle</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='Handle' id='Handle' value={value?.Handle} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>

                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Serial Id</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Make</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2   mt-1">
                      <Select
                        name='MakeID'
                        value={weaponMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                        styles={customStylesWithOutColor}
                        options={weaponMakeDrpData}
                        onChange={(e) => ChangeDropDown(e, 'MakeID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Model</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2   mt-1">

                      <CreatableSelect
                        name="WeaponModelID"
                        isClearable
                        options={weaponModelDrpData}
                        styles={customStylesWithOutColor}
                        placeholder="Select or type..."
                        value={
                          // First, try to match existing dropdown option
                          weaponModelDrpData?.find((obj) => obj.value?.toString() === value?.WeaponModelID?.toString())
                          // If not matched, fallback to custom typed value
                          || (value?.ModelName ? { label: value.ModelName, value: value.ModelName } : null)
                        }
                        onChange={(e) => ChangeDropDown(e, "WeaponModelID")}
                      />
                    </div>
                    <div className="col-3 col-md-4 col-lg-3 mt-2">
                      <div className="form-check ">
                        <input className="form-check-input" type="checkbox" name='auto' id="flexCheckDefault" checked={value?.IsAuto} />
                        <label className="form-check-label" name='IsAuto' id='IsAuto' value={value?.IsAuto} onChange={HandleChanges} htmlFor="flexCheckDefault">
                          Auto
                        </label>
                      </div>
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Manu.&nbsp;Year</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 ">
                      <DatePicker
                        name='ManufactureYear'
                        id='ManufactureYear'
                        selected={weaponfactureDate}
                        onChange={(date) => { setStatesChangeStatus(true); setWeaponfactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                        showYearPicker
                        dateFormat="yyyy"
                        yearItemNumber={8}
                        ref={startRef4}
                        onKeyDown={onKeyDown}
                        autoComplete="off"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2 px-0">
                      <label htmlFor="" className='new-label px-0'>Barrel&nbsp;Length</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                      <input type="text" name='BarrelLength' value={value?.BarrelLength} id='BarrelLength' maxLength={10} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-12  col-md-12 col-lg-6   mt-md-1" >
                      {
                        (!propertyID && !masterPropertyID) && (ProSta != 'true' || ProSta != true) &&
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          data-toggle="modal"
                          data-target="#PropertyModal"
                          onClick={() => {
                            dispatch(get_Property_Weapon_Search_Data(value?.Style, value?.Finish, value?.SerialID, value?.MakeID,
                              value?.ManufactureYear, value?.BarrelLength, value?.LossCodeID, value?.CategoryID, value?.Caliber, value?.Handle, value?.PropertyTypeID, value?.PropertyCategoryCode,
                              value?.OfficerID, value?.OAN, value?.Quantity, value?.Value, value?.BottomColorID, value?.ClassificationID, setSearchModalState, loginAgencyID));
                            setSearchModalState(true);
                          }}
                        >
                          Search
                        </button>
                      }
                    </div>
                  </div>
                </fieldset>
              </div>
              :
              <>
              </>
          }
          {/* Boat */}
          {
            value.PropertyCategoryCode === 'B' ?
              <div className="col-12 col-md-12 col-lg-12 p-0" >
                <fieldset>
                  <legend>Boat</legend>
                  <div className="row">
                    <div className="col-3 col-md-3 col-lg-1   mt-2">
                      <label htmlFor="" className='new-label'>Manu. Year</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 ">
                      <DatePicker
                        name='ManufactureYear'
                        id='ManufactureYear'
                        selected={manufactureDate}
                        onChange={(date) => { setStatesChangeStatus(true); setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
                        showYearPicker
                        dateFormat="yyyy"
                        yearItemNumber={8}
                        ref={startRef2}
                        onKeyDown={onKeyDown}
                        autoComplete="off"
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        maxDate={new Date()}
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Length</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 text-field mt-1 ">
                      <input type="text" name='Length' id='Length' maxLength={9} value={value?.Length} onChange={HandleChanges} className='' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>HIN  {errors.HINError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.HINError}</p>
                      ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 text-field  mt-1">
                      <input type="text" name='HIN' value={value?.HIN} maxLength={21} onChange={HandleChanges} className='requiredColor' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Reg. Expiry</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2">
                      <DatePicker
                        id='RegistrationExpiryDtTm'
                        name='RegistrationExpiryDtTm'
                        ref={startRef}

                        isClearable
                        onKeyDown={onKeyDown}
                        dateFormat="MM/yyyy"
                        selected={value?.RegistrationExpiryDtTm && new Date(value?.RegistrationExpiryDtTm)}

                        onChange={(date) => { setStatesChangeStatus(true); setValue({ ...value, ['RegistrationExpiryDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                        showMonthYearPicker
                        autoComplete="Off"
                        className=''
                        placeholderText={'Select...'}
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">

                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Boat VOD')
                      }} data-target="#ListModel" className='new-link'>
                        VOD
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='VODID'
                        value={vodDrpData?.filter((obj) => obj.value === value?.VODID)}
                        styles={customStylesWithOutColor}
                        options={vodDrpData}
                        onChange={(e) => ChangeDropDown(e, 'VODID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                      <label htmlFor="" className='new-label'>Reg. State  {errors.RegStateError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RegStateError}</p>
                      ) : null}</label>

                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1 ">
                      <Select
                        name='RegistrationStateID'
                        styles={Requiredcolour}
                        value={stateDrpData?.filter((obj) => obj.value === value?.RegistrationStateID)}
                        options={stateDrpData}
                        onChange={(e) => ChangeDropDown(e, 'RegistrationStateID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Reg. No  {errors.RegNumError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.RegNumError}</p>
                      ) : null}</label>

                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                      <input type="text" name='RegistrationNumber' id='RegistrationNumber' value={value?.RegistrationNumber} maxLength={10} onChange={HandleChanges} className='requiredColor' required autoComplete='off' />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 mt-2">

                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Property Boat OH Material')
                      }} data-target="#ListModel" className='new-link'>
                        Material
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='MaterialID'
                        value={materialDrpData?.filter((obj) => obj.value === value?.MaterialID)}
                        options={materialDrpData}
                        styles={customStylesWithOutColor}
                        onChange={(e) => ChangeDropDown(e, 'MaterialID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">

                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Property Boat Make')
                      }} data-target="#ListModel" className='new-link'>
                        Make
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='MakeID'
                        value={makeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                        styles={customStylesWithOutColor}
                        options={makeDrpData}
                        onChange={(e) => ChangeDropDown(e, 'MakeID')}
                        isClearable
                        placeholder="Select..."
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">

                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Property Boat Model')
                      }} data-target="#ListModel" className='new-link'>
                        Model
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <CreatableSelect
                        name="ModelID"
                        isClearable
                        options={boatModelDrpData}
                        styles={customStylesWithOutColor}
                        placeholder="Select or type..."
                        value={
                          // First, try to match existing dropdown option
                          boatModelDrpData?.find((obj) => obj.value?.toString() === value?.ModelID?.toString())
                          // If not matched, fallback to custom typed value
                          || (value?.ModelName ? { label: value.ModelName, value: value.ModelName } : null)
                        }
                        onChange={(e) => ChangeDropDown(e, "ModelID")}
                      />




                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Top Color</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='TopColorID'
                        value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                        options={topColorDrpData}
                        styles={customStylesWithOutColor}
                        onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                        isClearable
                        placeholder="Select..."
                        menuPlacement='top'
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 px-0 mt-2">
                      <label htmlFor="" className='new-label'>Bottom Color</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='BottomColorID'
                        value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                        options={bottomColorDrpData}
                        styles={customStylesWithOutColor}
                        onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                        isClearable
                        placeholder="Select..."
                        menuPlacement='top'
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <span data-toggle="modal" onClick={() => {
                        setOpenPage('Property Boat Propulsion')
                      }} data-target="#ListModel" className='new-link'>
                        Propulsion
                      </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                      <Select
                        name='PropulusionID'
                        value={propulusionDrpData?.filter((obj) => obj.value === value?.PropulusionID)}
                        styles={customStylesWithOutColor}
                        options={propulusionDrpData}
                        onChange={(e) => ChangeDropDown(e, 'PropulusionID')}
                        isClearable
                        placeholder="Select..."
                        menuPlacement='top'
                      />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1  mt-2">
                      <label htmlFor="" className='new-label'>Comments</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-6  mt-1">
                      <textarea name='Comments' id="Comments" value={value?.Comments} onChange={HandleChanges} cols="30" rows='1' className="form-control" style={{ resize: 'none' }}>
                      </textarea>
                    </div>
                    <div className="col-12  col-md-12 col-lg-1 text-right mt-md-1 " >
                      {
                        (!propertyID && !masterPropertyID) && (ProSta != 'true' || ProSta != true) &&
                        <button
                          type="button"
                          className="btn btn-sm btn-success "
                          data-toggle="modal"
                          data-target="#PropertyModal"
                          onClick={() => {
                            dispatch(get_Property_Boat_Search_Data(value?.RegistrationStateID, value?.RegistrationNumber, value?.MaterialID, value?.HIN, value?.RegistrationExpiryDtTm, value?.VODID, value?.LossCodeID, value?.ManufactureYear, value?.Length, value?.CategoryID, value?.TopColorID, value?.MakeID, value?.ModelID, value?.PropulusionID, value?.Comments, value?.PropertyTypeID, value?.PropertyCategoryCode, value?.OfficerID, value?.OAN, value?.Quantity, value?.Value, value?.BottomColorID, value?.ClassificationID, setSearchModalState, loginAgencyID));
                            setSearchModalState(true)
                          }}
                        >
                          Search
                        </button>
                      }
                    </div>
                  </div>
                </fieldset>
              </div>
              :
              <>
              </>
          }
          {/* drug */}
          {
            value.PropertyCategoryCode === 'D' ?
              <div className="col-12 col-md-12 pt-2 p-0" >
                <div className=" ">
                  <fieldset className='p-0'>
                    <legend> Drug  </legend>
                    <div className="col-12">
                      <div className="row mt-1">
                        <div className="col-12 col-md-2 col-lg-3 mt-2 ">
                          <label htmlFor="SuspectedDrugTypeID" className="form-label" style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                            Drug Type
                          </label>
                          <div>
                            <Select
                              inputId="SuspectedDrugTypeID"
                              name="SuspectedDrugTypeID"
                              styles={Requiredcolour}
                              value={suspectedDrugDrpData?.filter(obj => obj.value === value?.SuspectedDrugTypeID)}
                              isClearable
                              options={suspectedDrugDrpData}
                              onChange={(e) => onChangeDrugType(e, 'SuspectedDrugTypeID')}
                              placeholder="Select..."
                            />
                            {drugErrors.SuspectedDrugTypeIDError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.SuspectedDrugTypeIDError}</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="col-12 col-md-2 col-lg-2 mt-2 ">
                          <label className='form-label' style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                            Measurement Unit
                          </label>
                          <div>
                            <Select
                              name='MeasurementUnitID'
                              styles={Requiredcolour}
                              value={drugMeasureUnitData?.filter((obj) => obj.value === value?.MeasurementUnitID)}
                              options={drugMeasureUnitData}
                              onChange={(e) => onChangeDrugType(e, 'MeasurementUnitID')}
                              placeholder="Select..."
                              isClearable
                            />
                            {drugErrors.MeasurementUnitIDError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.MeasurementUnitIDError}</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="col-12 col-md-2 col-lg-2 mt-2 ">
                          <label className='form-label' htmlFor="MeasurementTypeID" style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                            Measurement Type
                          </label>
                          <div >
                            <Select
                              name='MeasurementTypeID'
                              styles={Requiredcolour}
                              options={drugMeasureTypeData}
                              value={drugMeasureTypeData?.filter((obj) => obj.value === value?.MeasurementTypeID)}
                              onChange={(e) => onChangeDrugType(e, 'MeasurementTypeID')}
                              isClearable
                              placeholder="Select..."
                            />
                            {drugErrors.MeasurementTypeIDError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.MeasurementTypeIDError}</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="col-12 col-md-2 col-lg-2 mt-2">
                          <label className='form-label' htmlFor="EstimatedDrugQty" style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                            Estimated Drug Qty
                          </label>
                          <div className="text-field mt-0">
                            <input
                              type="number"
                              name='EstimatedDrugQty'
                              id='EstimatedDrugQty'
                              className={'requiredColor'}
                              autoComplete='off'
                              maxLength={12}
                              step="0.001"
                              value={value?.EstimatedDrugQty}
                              onChange={(e) => {
                                !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true)
                                if (e.target.value?.length > 12) {
                                  return;
                                }
                                const val = e.target.value;
                                if (val.includes('.')) {
                                  const [whole, decimal] = val.split('.');
                                  if (decimal.length > 3) {
                                    return;
                                  }
                                }
                                setValue({ ...value, EstimatedDrugQty: val });
                              }}
                            />
                          </div>
                          {drugErrors.EstimatedDrugQtyError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.EstimatedDrugQtyError}</p>
                          ) : null}
                        </div>
                        {/* <div className="col-5 col-md-5 col-lg-6 text-right " >
                          {
                            (!propertyID || !masterPropertyID) && (ProSta != 'true' || ProSta != true) && (value.PropertyCategoryCode === 'D') &&
                            <button
                              type="button"
                              id='Drugbtn'
                              className="btn btn-sm btn-success"
                              data-toggle="modal"
                              data-target="#PropertyModal"
                              onClick={() => {
                                dispatch(get_Property_Drug_Search_Data(value?.LossCodeID,
                                  value?.Value,
                                  value?.PropertyTypeID,
                                  value?.PropertyCategoryCode,
                                  value?.CategoryID,
                                  value?.ClassificationID,
                                  value?.OfficerID,
                                  loginAgencyID,
                                  setSearchModalState,))
                                setSearchModalState(true);
                              }}
                            >
                              Search
                            </button>
                          }
                        </div> */}
                        <div className="btn-box text-right col-3 col-md-3 mt-4  pt-2" >
                          {
                            (!propertyID || !masterPropertyID) && (ProSta != 'true' || ProSta != true) && (value.PropertyCategoryCode === 'D') &&
                            <button
                              type="button"
                              id='Drugbtn'
                              className="btn btn-sm btn-success mr-1"
                              data-toggle="modal"
                              data-target="#PropertyModal"
                              onClick={() => {
                                dispatch(get_Property_Drug_Search_Data(value?.LossCodeID,
                                  value?.Value,
                                  value?.PropertyTypeID,
                                  value?.PropertyCategoryCode,
                                  value?.CategoryID,
                                  value?.ClassificationID,
                                  value?.OfficerID,
                                  loginAgencyID,
                                  setSearchModalState,))
                                setSearchModalState(true);
                              }}
                            >
                              Search
                            </button>
                          }
                          <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={onDrugClose}>New</button>
                          {
                            propertyDrugID ?
                              <>
                                <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Drug_Validation_Error() }}>Update </button>
                              </>
                              :
                              <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Drug_Validation_Error() }}>Add Drug</button>
                          }
                        </div>
                      </div>
                    </div>
                  </fieldset>




                </div>
                <div className="row ">
                  <div className="col-12 modal-table mt-1">
                    <DataTable
                      fixedHeader
                      persistTableHead={true}
                      customStyles={tableCustomStyle}
                      dense
                      conditionalRowStyles={conditionalRowStylesDrug}
                      columns={columns}
                      data={drugData?.length > 0 ? drugData : drugLocalArr}
                      onRowClicked={(row) => set_Edit_Value(row)}
                      pagination
                      paginationPerPage={5}
                      fixedHeaderScrollHeight='150px'
                      paginationRowsPerPageOptions={[5, 10, 15, 20]}
                      highlightOnHover
                      noDataComponent={"There are no data to display"}
                    />
                  </div>
                </div>
              </div>
              :
              <>
              </>
          }
          {!isViewEventDetails &&
            <div className="col-12 text-right mb-1 mt-1 field-button  d-flex justify-content-between" style={{ marginTop: "1px" }}>
              <div>
                {
                  propertyMainModuleData?.length > 0 &&
                  <button
                    type="button"
                    onClick={() => { nibrsValidateProperty(mainIncidentID, incReportedDate, baseDate, oriNumber) }}
                    className={`btn btn-sm text-white mr-2`}
                    style={{
                      backgroundColor: `${nibrsValidateData?.length > 0 ? nibrsValidateData?.length > 0 ? 'red' : 'green' : 'teal'}`,
                    }}
                  >
                    Validate TIBRS Property
                  </button>
                }
              </div>
              <div>
                {
                  (propertyID || masterPropertyID) && (ProSta === 'true' || ProSta === true) &&
                  <button type="button" className="btn btn-sm btn-success mx-1" onClick={() => { setPrintStatus(true) }}>Print Barcode</button>
                }
                <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#NCICModal" onClick={() => { setOpenNCICModal(true) }}>TLETS</button>
                <button
                  type="button"
                  className="btn btn-sm btn-success mx-1"
                  onClick={newProperty}
                  {...(!isCad && { "data-dismiss": "modal" })}
                >
                  New
                </button>

                {
                  (propertyID || masterPropertyID) && (ProSta === 'true' || ProSta === true) ?
                    effectiveScreenPermission ?
                      effectiveScreenPermission[0]?.Changeok ?
                        <>
                          <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>

                          <button
                            type="button" className="btn btn-sm btn-success mr-4" data-toggle="modal" data-target="#QueueReportsModal"
                            onClick={() => { setShowModal(true); setIncMasterReport(true); setIncReportCount(IncReportCount + 1); }}
                          >
                            Print <i className="fa fa-print"></i>
                          </button>
                        </>
                        :
                        <>
                        </>
                      :
                      <>
                        <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>

                        <button
                          type="button" className="btn btn-sm btn-success mr-4" data-toggle="modal" data-target="#QueueReportsModal"
                          onClick={() => { setShowModal(true); setIncMasterReport(true); setIncReportCount(IncReportCount + 1); }}
                        >
                          Print <i className="fa fa-print"></i>
                        </button>
                      </>
                    :
                    effectiveScreenPermission ?
                      effectiveScreenPermission[0]?.AddOK ?
                        <button type="button" className="btn btn-sm btn-success mr-1" onDoubleClick={''} onClick={(e) => { check_Validation_Error(); }}>Save</button>
                        :
                        <>
                        </>
                      :
                      <button type="button" className="btn btn-sm btn-success mr-1" onDoubleClick={''} onClick={(e) => { check_Validation_Error(); }}>Save</button>
                }
                {
                  MstPage === "MST-Property-Dash" &&
                  <button type="button" className="btn btn-sm btn-success mx-1" onClick={onMasterPropClose} data-dismiss="modal">Close</button>
                }

              </div>

            </div>
          }
        </div >
      </div >
      {
        drugModal &&
        <div className="modal fade" style={{ background: 'rgba(0,0,0, 0.5)' }} id='DrugModal' tabIndex='-1' aria-hidden='true' data-backdrop='false'>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" onClick={onDrugClose} style={{ alignSelf: "end" }}><b>X</b>
              </button>
              <div className="modal-body">
                <div className="m-1 mt-3 bb">
                  <fieldset >
                    <legend >Drugs</legend>
                    <div className="col-12">
                      <div className="row mt-1">
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Suspected&nbsp;Drug&nbsp;Type{drugErrors.SuspectedDrugTypeIDError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.SuspectedDrugTypeIDError}</p>
                          ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3  col-lg-3 mt-1">
                          <Select
                            name='SuspectedDrugTypeID'
                            styles={Requiredcolour}
                            value={suspectedDrugDrpData?.filter((obj) => obj.value === value?.SuspectedDrugTypeID)}
                            isClearable
                            options={suspectedDrugDrpData}
                            onChange={(e) => ChangeDropDown(e, 'SuspectedDrugTypeID')}
                            placeholder="Select..."
                          />
                        </div>
                        <div className="col-3 col-md-3  col-lg-3 mt-2">
                          <label className='new-label'>Property Source Drug Type</label>
                        </div>
                        <div className="col-3 col-md-3  col-lg-4 mt-1">
                          <Select
                            name='PropertySourceDrugTypeID'
                            styles={customStylesWithOutColor}
                            value={propSourceDrugDrpData?.filter((obj) => obj.value === value?.PropertySourceDrugTypeID)}
                            options={propSourceDrugDrpData}
                            onChange={(e) => ChangeDropDown(e, 'PropertySourceDrugTypeID')}
                            placeholder="Select..."
                            isClearable
                            isDisabled={drugTypecode !== 'E' ? false : true}
                          />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Estimated&nbsp;Drug&nbsp;Qty  {drugErrors.EstimatedDrugQtyError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.EstimatedDrugQtyError}</p>
                          ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                          <input type="text" maxLength={9} name='EstimatedDrugQty' id='EstimatedDrugQty' disabled={value?.MeasurementTypeID === 11} value={value?.EstimatedDrugQty} onChange={HandleChanges} className={value?.MeasurementTypeID !== 11 ? 'requiredColor' : ''} required={value?.MeasurementTypeID !== 11} autoComplete='off' />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Fraction Drug Qty {drugErrors.FractionDrugQtyError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.FractionDrugQtyError}</p>
                          ) : null}</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                          <input type="text" maxLength={9} name='FractionDrugQty' id='FractionDrugQty' value={value?.FractionDrugQty} onChange={HandleChanges} className='requiredColor' required autoComplete='off' />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2 pt-1">
                          <label className='new-label'>
                            Measurement Type
                            {drugErrors.MeasurementTypeIDError !== 'true' ? (
                              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.MeasurementTypeIDError}</p>
                            ) : null}
                          </label>
                        </div>
                        <div className="col-9 col-md-9 col-lg-2 mt-2 ">
                          <Select
                            name='MeasurementTypeID'
                            value={measureTypeDrpData?.filter((obj) => obj.value === value?.MeasurementTypeID)}
                            styles={Requiredcolour}
                            options={measureTypeDrpData}

                            onChange={(e) => ChangeDropDown(e, 'MeasurementTypeID')}
                            isClearable
                            placeholder="Select..."
                          />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">

                          <label className='new-label'>Solid Pounds</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                          <input type="text" maxLength={9} name='SolidPounds' id='SolidPounds' value={value?.SolidPounds} onChange={HandleChanges} required autoComplete='off' />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Solid Ounces</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                          <input type="text" maxLength={9} name='SolidOunces' id='SolidOunces' value={value?.SolidOunces} onChange={HandleChanges} required autoComplete='off' />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Solid Grams</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                          <input type="text" maxLength={9} name='SolidGrams' id='SolidGrams' value={value?.SolidGrams} onChange={HandleChanges} required autoComplete='off' />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Liquid Ounces</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                          <input type="text" maxLength={9} name='LiquidOunces' id='LiquidOunces' value={value?.LiquidOunces} onChange={HandleChanges} required autoComplete='off' />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Dose Units</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                          <input type="text" maxLength={9} name='DoseUnits' id='DoseUnits' value={value?.DoseUnits} onChange={HandleChanges} required autoComplete='off' />
                        </div>
                        <div className="col-3 col-md-3  col-lg-2 mt-2">
                          <label className='new-label'>Items</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                          <input type="text" maxLength={9} name='Items' id='Items' value={value?.Items} onChange={HandleChanges} required autoComplete='off' />
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
              <div className="btn-box text-right mr-1 mb-2">
                {
                  propertyDrugID ?
                    <>
                      <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Drug_Validation_Error() }}>Update </button>
                    </>
                    :
                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Drug_Validation_Error() }}>Save</button>
                }
                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={onDrugClose}>Close</button>
              </div>
            </div>
          </div >
        </div >
      }
      {
        modalStatus &&
        <div className="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s' }} data-backdrop="false">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="box text-center py-5">
                <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                <div className="btn-box mt-3">
                  <button type="button" onClick={delete_Image_File} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                  <button type="button" onClick={() => { setImageId(''); setModalStatus(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <div className="col-12 modal-table pt-1">
        {
          MstPage != "MST-Property-Dash" &&
          <DataTable
            dense
            fixedHeader
            persistTableHead={true}
            customStyles={tableCustomStyle}
            conditionalRowStyles={conditionalRowStyles}
            columns={columns1}

            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? propertyMainModuleData : [] : propertyMainModuleData}

            selectableRowsHighlight
            highlightOnHover
            responsive

            onRowClicked={(row) => {
              set_EditRow(row);
            }}

            fixedHeaderScrollHeight='150px'
            pagination
            paginationPerPage={'100'}
            paginationRowsPerPageOptions={[100, 150, 200, 500]}
            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          />
        }
      </div>
      <DeletePopUpModal func={!isProperty ? Delete_Prpperty_Drug : Delete_Property} />

      <ChangesModal func={check_Validation_Error} />

      {/* <IdentifyFieldColor /> */}
      <PropertySearchTab {...{ get_PropertyArticle_Single_Data, get_PropertyBoat_Single_Data, get_PropertOther_Single_Data, get_PropertySecurity_Single_Data, get_PropertyWeapon_Single_Data, get_Data_Drug_Modal, searchModalState, setSearchModalState, mainIncidentID, value, setValue, loginPinID, loginAgencyID, MstPage, setPropertOther, setPropertyBoat, setPropertyWeapon, setPropertySecurity, setPropertyArticle, setLossCode, PropertyCategory, PropertyClassification, setPropertyNumber, setDrugData, setChangesStatus, setStatesChangeStatus, setPossessionID, isCad, get_Name_MultiImage }} />
      <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possenSinglData, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion }} />
      <ListModal {...{ openPage, setOpenPage }} />
      <ImageModel multiImage={multiImage} pinID={loginPinID} setStatesChangeStatus={setStatesChangeStatus} primaryOfficerID={agencyOfficerDrpData} setMultiImage={setMultiImage} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} ChangeDropDown={ChangeDropDown} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageId} setImageId={setImageId} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_Property_MultiImage} agencyID={loginAgencyID} />
      <AlertMasterModel masterID={masterPropertyID} setStatesChangeVich={setStatesChangeStatus} AlertType={"Property"} modelName={"Property"} loginPinID={loginPinID} agencyID={loginAgencyID} getAlertData={setAvailableAlert} />
      <BarCode agencyID={loginAgencyID} propID={DecPropID} masPropID={DecMPropID} codeNo={propertyNumber} printStatus={printStatus} setPrintStatus={setPrintStatus} />
      <NirbsErrorShowModal
        ErrorText={nibrsErrStr}
        nibErrModalStatus={nibrsErrModalStatus}
        setNibrsErrModalStatus={setNibrsErrModalStatus}

      />
      <CurrentProMasterReport printIncReport={printIncReport}
        setIncMasterReport={setIncMasterReport} IncReportCount={IncReportCount}
        setIncReportCount={setIncReportCount}
        PropertyNumber={value.PropertyNumber}
      />

      <CurrentProMasterReport PropertyNumber={value.PropertyNumber} {...{ printIncReport, setIncMasterReport, IncReportCount, setIncReportCount, showModal, setShowModal }} />
      {openNCICModal && <NCICModal {...{ openNCICModal, setOpenNCICModal, }} />}
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

export default Home

const Get_Property_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) =>
    (sponsor.PropertyTypeID)
  )
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id }
    }
  }
  )
  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
}

const Get_Drug_Code = (data, dropDownData) => {
  const newArr = [];
  newArr.push(data);

  const result = newArr?.map((sponsor) =>
    (sponsor.SuspectedDrugTypeID)
  )
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === parseInt(result[0])) {
      return { value: result[0], label: sponsor.label, id: sponsor.id }
    }
  })
  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
}

const Get_LossCode = (data, dropDownData) => {
  const result = data?.map((sponsor) => (sponsor.LossCodeID))
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id }
    }
  })
  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
}

const Get_LossCodes = (data, dropDownData) => {

  const result = data?.map((sponsor) => (sponsor.CategoryID))

  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.code }
    }
  })

  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
}

