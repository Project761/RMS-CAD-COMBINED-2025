import React, { useContext, useState, useEffect, } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AgencyContext } from "../../../../Context/Agency/Index";
import {
  getShowingDateText, getShowingMonthDateYear, Decrypt_Id_Name, base64ToString, stringToBase64, filterPassedTimeZone, filterPassedTimeZoneException,
  nibrscolourStyles,
  colourStyles,
  Requiredcolour,
} from "../../../Common/Utility";
import { AddDeleteUpadate, fetchPostData } from "../../../hooks/Api";
import { toastifyError, toastifySuccess } from "../../../Common/AlertMsg";
import { useLocation, useNavigate } from "react-router-dom";
import { RequiredFieldIncident, RequiredFieldIncidentCarboTheft, Space_AllowInc, } from "../../Utility/Personnel/Validation";
import { Comman_changeArrayFormat, dropDownDataModel, threeColArray } from "../../../Common/ChangeArrayFormat";
import VerifyLocation from "./VerifyLocation/VerifyLocation";
import IdentifyFieldColor from "../../../Common/IdentifyFieldColor";
import Loader from "../../../Common/Loader";
import ChangesModal from "../../../Common/ChangesModal";
import { useDispatch, useSelector } from "react-redux";
import { get_LocalStoreData } from "../../../../redux/actions/Agency";
import ListModal from "../../Utility/ListManagementModel/ListModal";
import { Incident_ReportDate } from "../../../../redux/actionTypes";
import { get_Incident_Drp_Data, get_Narrative_Type_Drp_Data, } from "../../../../redux/actions/DropDownsData";
import MessageModelIncident from "../../../Common/MessageModelIncident";
import NirbsErrorShowModal from "../../../Common/NirbsErrorShowModal";
import { get_AgencyOfficer_Data, get_ScreenPermissions_Data } from "../../../../redux/actions/IncidentAction";
import CurrentIncMasterReport from "./CurrentIncMasterReport";
import { InputMask } from "primereact/inputmask";
import CallTakerServices from "../../../../CADServices/APIs/callTaker";
import Location from "../../../../CADComponents/Common/Location";
import GeoServices from "../../../../CADServices/APIs/geo";
import GeoLocationInfoModal from "../../../Location/GeoLocationInfoModal";



const IncidentHome = ({ setIncidentReportedDate, setShowPoliceForce, setShowIncPage, isPreviewNormalReport, setIsPreviewNormalReport }) => {

  let navigate = useNavigate();
  const dispatch = useDispatch();
  const uniqueId = sessionStorage.getItem("UniqueUserID") ? Decrypt_Id_Name(sessionStorage.getItem("UniqueUserID"), "UForUniqueUserID") : "";
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const receiveSourceDrpData = useSelector((state) => state.DropDown.receiveSourceDrpData);
  const cadCfsCodeDrpData = useSelector((state) => state.DropDown.cadCfsCodeDrpData);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const cadDispositionDrpData = useSelector((state) => state.DropDown.cadDispositionDrpData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const { updateCount, get_IncidentTab_Count, get_Incident_Count, nibrsSubmittedIncident, setnibrsSubmittedIncident, setIncidentRmsCfs, setnibrsStatus, exceptionalClearID, GetDataExceptionalClearanceID, setChangesStatus, changesStatus, setReportedDtTmInc, GetDataTimeZone, datezone, setOfficerApprovCount, incidentRecentData, setIncidentRecentData, incidentCount, setCaseStatus, validate_IncSideBar
  } = useContext(AgencyContext);

  const [reportedDate, setReportedDate] = useState(new Date(datezone));
  const [occuredFromDate, setOccuredFromDate] = useState(new Date(datezone));
  const [occuredToDate, setOccuredToDate] = useState();
  const [onSelectLocation, setOnSelectLocation] = useState(false);
  const [loder, setLoder] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [addVerifySingleData, setAddVerifySingleData] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [loginPinID, setLoginPinID] = useState("");
  const [incidentID, setIncidentID] = useState();
  const [stateReportID, setStateReportID] = useState("");

  //DropDown Value
  const [rmsCfsID, setRmsCfsID] = useState([]);
  const [editval, setEditval] = useState([]);
  const [clsDrpCode, setClsDrpCode] = useState();
  const [exClsDateCode, setExClsDateCode] = useState();
  const [updateStatus, setUpdateStatus] = useState(0);
  const [openPage, setOpenPage] = useState("");
  const [incNumberExistStatus, setIncNumberExistStatus] = useState(false);
  const [incNumberGenrateStatus, setIncNumberGenrateStatus] = useState(false);
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [offenseIdDrp, setOffenseIdDrp] = useState([]);
  const [incidentStatusDrpDwn, setIncidentStatusDrpDwn] = useState([]);
  // ucr reportdata
  const [printIncReport, setIncMasterReport] = useState(false);
  const [IncReportCount, setIncReportCount] = useState(1);
  //nibrs
  const [checkValidOffender, setcheckValidOffender] = useState([]);
  const [carboTheft, setcarboTheft] = useState(false);
  const [adultArrestStatus, setadultArrestStatus] = useState(false);
  // nibrs Validate Incident
  const [baseDate, setBaseDate] = useState("");
  const [oriNumber, setOriNumber] = useState("");
  const [nibrsValidateIncidentData, setnibrsValidateIncidentData] = useState([]);
  const [nibrsValidIncScreen, setnibrsValidIncScreen] = useState(false);
  const [nibrsValidAllIncModule, setnibrsValidAllIncModule] = useState(false);
  const [incValidateErrStr, setIncValidateErrStr] = useState("");
  const [incAllModuleValidateErrStr, setincAllModuleValidateErrStr] = useState("");
  const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
  const [nibrsValidateloder, setnibrsValidateLoder] = useState(false);
  const [nibIncScreen, setNibIncScreen] = useState(false);
  const [OffenseState, setOffenseState] = useState(false);
  const [offenseClick, setoffenseClick] = useState(false);
  const [offenseStatus, setoffenseStatus] = useState(false);
  const [statusnew, setstatusnew] = useState(false);
  const [assignModelShow, setassignModelShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [Counter_Format, setCounter_Format] = useState();
  const [incNumEditOfficer, setIncNumEditOfficer] = useState(false);
  const [isSystemGenratedStatus, setIsSystemGenratedStatus] = useState(false);
  const [IsCadEditable, setIsCadEditable] = useState(true);

  // locatons
  const initialFormValues = {
    PremiseNo: "", stDirection: "", Street: "", stDirection2: "", ApartmentNo: "", commonPlaceName: "", premiseType: null, City: "", ZipCode: "", mileMarker: "", coordinateX: "", coordinateY: "", AltStreet: "", intersection1: "", intersection2: "", verify: true, patrolZone: null, emsZone: null, fireZone: null, otherZone: null, currentFlag: null, location: "", IsVerify: true, isStreet: false, isCity: false, isPremiseNo: false, isZipCode: false, isMileMarker: false, isCommonPlaceName: false, isStDirection: false, isStDirection2: false, isIntersection1: false, isIntersection2: false, isAltStreet: false, isApartmentNo: false, isCoordinateX: false, isCoordinateY: false,
  };

  const [geoFormValues, setGEOFormValues] = useState(initialFormValues);
  const [geoLocationID, setGeoLocationID] = useState();
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [locationData, setLocationData] = useState();
  const [locationStatus, setLocationStatus] = useState(false);
  const [isCheckGoogleLocation, setIsCheckGoogleLocation] = useState(false);
  const [isVerifyReportedLocation, setIsVerifyReportedLocation] = useState(false);
  const [selectedButton, setSelectedButton] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [isGoogleLocation, setIsGoogleLocation] = useState(true)
  const [geoZoneDropDown, setGeoZoneDropDown] = useState([]);
  const [premiseDropDown, setPremiseDropDown] = useState([]);
  const [receiveSourceDropDown, setReceiveSourceDropDown] = useState([]);
  // permissions
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  // GeoLocationInfoModal
  const [openLocationInformationModal, setOpenLocationInformationModal] = useState(false);

  const rmsDispositionDrpData = [
    {
      value: 15,
      label: "Yes",
      id: "01",
    },
    {
      value: 16,
      label: "No",
      id: "02",
    },
  ];

  const policeForceDrpData = [
    {
      "value": true,
      "label": "Yes",
      "id": "Y"
    },
    {
      "value": false,
      "label": "No",
      "id": "N"
    }
  ]

  const [value, setValue] = useState({
    IncidentID: "",
    ReportedDate: IsCadEditable && !(incidentID && (IncSta === true || IncSta === "true")) ? getShowingMonthDateYear(datezone) : null,
    OccurredFrom: IsCadEditable && !(incidentID && (IncSta === true || IncSta === "true")) ? getShowingMonthDateYear(datezone) : null,
    OccurredTo: "", BIBRSDate: getShowingMonthDateYear(datezone), FinishedDate: "", DispositionDate: "", NIBRSclearancedate: "",
    IncidentNumber: incNumberGenrateStatus ? "Auto Generated" : null, DispositionComments: "", AgencyName: "", RMSCFSCodeID: "", NIBRSClearanceID: "",
    RMSDispositionId: 16, ReceiveSourceID: "", CADCFSCodeID: "", CADDispositionId: "", AgencyID: "", FBIID: "", IsIncidentCode: true,
    DispatchedDate: "", ArrivedDate: "", ModifiedByUserFK: "", CreatedByUserFK: "", OffenseType: "", OffenseTypeID: "", CADIncidentNumber: "",
    MasterIncidentNumber: "", IsCargoTheftInvolved: null, InitAdjust: "", AttempComp: "",
    PrimaryOfficerID: "",
    NIBRSStatus: "", CaseStatusID: "", CaseStatusCode: "",
    //Location
    IsVerify: true, crimelocationid: 0, CrimeLocation: "", GEOID: '', IsUsLocation: "", DirectionPrefix: "", Street: "", DirectionSufix: "", TypeSufix: "", City: "", State: "", ZipCode: "", PremiseNo: "", ApartmentNo: "", CommonPlace: "", ApartmentType: "", Street_Parse: "", PremiseNo_Parse: "", DirectionPrefix_Parse: "", TypeSuffix_Parse: "", DirectionSuffix_Parse: "", ZipCodeID: "", CityID: "", CountryID: "", Country: "", point_of_interest: "", neighborhood: "", subpremise: "", premise: "", Address: "", isPoliceForceApplied: false,
  });

  const [errors, setErrors] = useState({
    OccuredError: "", CrimeLocationError: "", ExceptionalClearaceError: "", IsVerify: "", NIBRSclearancedateError: "", DispositionDateError: "", IncNumberError: "", OffenceTypeError: "", CargoTheftError: "", PrimaryOfficerIdError: "", CaseStatusError: ""
  });

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param),
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  var IncNo = query?.get("IncNo");
  var IsCadInc = query?.get("IsCadInc");
  var IncSta = query?.get("IncSta");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setValue({ ...value, AgencyID: localStoreData?.AgencyID, CreatedByUserFK: localStoreData?.PINID });
      dispatch(get_ScreenPermissions_Data("I034", localStoreData?.AgencyID, localStoreData?.PINID));
      setLoginAgencyID(localStoreData?.AgencyID); setIncNumEditOfficer(localStoreData?.IsIncidentEditable === "true" || localStoreData?.IsIncidentEditable === true ? true : false); setLoginPinID(localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID);
      get_Incident_Count(IncID, localStoreData?.PINID); setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null);
      setOriNumber(localStoreData?.ORI); get_IncidentTab_Count(IncID, localStoreData?.PINID); setLoder(true);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      // for change tab when not having  add and update permission
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setPermissionForAdd(false);
      setPermissionForEdit(false);
      // for change tab when not having  add and update permission
      setaddUpdatePermission(false)
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (IncID) {
      GetEditData(IncID); setIncidentID(IncID);
    }
  }, [IncID, localStoreData]);

  useEffect(() => {
    if (loginAgencyID) {
      dispatch(get_Incident_Drp_Data(loginAgencyID));
      getAgencySettingData(loginAgencyID);
      if (exceptionalClearID.length === 0 && loginAgencyID) { GetDataExceptionalClearanceID(loginAgencyID); }
      getZoneData(loginAgencyID);
      getIncidentStatus(loginAgencyID);
    }
  }, [loginAgencyID]);

  useEffect(() => {
    if (loginAgencyID && incidentStatusDrpDwn?.length > 0) {
      OffenseIdDrpDwnVal(loginAgencyID);
    }
  }, [loginAgencyID, incidentStatusDrpDwn]);

  // api/IncidentStatus/GetDataDropDown_IncidentStatus
  // AgencyID

  const getIncidentStatus = async (AgencyID) => {
    try {
      await fetchPostData("IncidentStatus/GetDataDropDown_IncidentStatus", { 'AgencyID': AgencyID }).then((res) => {
        // console.log("🚀 ~ getIncidentStatus ~ res:", res)
        if (res?.length > 0) {
          setIncidentStatusDrpDwn(threeColArray(res, "IncidentStatusID", "Description", "IncidentStatusCode"));
        } else {
          setIncidentStatusDrpDwn([]);
        }
      })
    } catch (error) {
      console.log("Error in getIncidentStatus: ", error);
      setIncidentStatusDrpDwn([]);
    }
  };

  //--------------------Ds---------------------
  const getAgencySettingData = (aId) => {
    fetchPostData("Agency/GetData_SingleData", { AgencyID: aId }).then(
      (res) => {
        setIsCadEditable(res[0]?.IsCadEditable);
      }
    );
  };

  useEffect(() => {
    if (!(incidentID && (IncSta === true || IncSta === "true"))) {
      const defaultDate = datezone ? new Date(datezone) : null;
      if (IsCadEditable === true || IsCadEditable === "true") {
        setOccuredFromDate(defaultDate); setReportedDate(defaultDate);
        setValue((prevValue) => ({
          ...prevValue,
          ReportedDate: defaultDate ? getShowingMonthDateYear(defaultDate) : null, OccurredFrom: defaultDate ? getShowingMonthDateYear(defaultDate) : null,
          PrimaryOfficerID: parseInt(loginPinID)
        }));
      } else {
        setOccuredFromDate(null); setReportedDate(null);
        setValue((prevValue) => ({ ...prevValue, OccurredFrom: null, ReportedDate: null, }));
      }
      setValue((prevValue) => ({ ...prevValue, BIBRSDate: getShowingMonthDateYear(datezone), PrimaryOfficerID: parseInt(loginPinID) }));
    }
  }, [datezone, IsCadEditable, incidentID, IncSta]);

  //---------------------------//--------------------------------
  const GetEditData = (incidentID) => {
    const val = { IncidentID: incidentID };
    fetchPostData("Incident/GetSingleData_Incident", val).then((res) => {
      if (res?.length > 0) {
        setEditval(res); setLoder(true);
        const statusMap = { R: "ReOpen", C: "Closed", H: "Hold", O: "Open", };
        const statusCode = res[0]?.CaseStatusCode;
        setCaseStatus(statusMap[statusCode] || "Open");
        setReportedDtTmInc(getShowingDateText(res[0]?.ReportedDate));
        setoffenseStatus(res[0]?.OffenceCount === "0" || res[0]?.OffenceCount === 0 ? true : false);
      } else {
        setCaseStatus([]);
      }
    });
  };

  const getNameOfferndersData = (incidentID) => {
    const val = { IncidentID: incidentID };
    fetchPostData("OffenderAssault/GetData_OffenderByIncident", val).then(
      (res) => {
        if (res?.length > 0) {
          setcheckValidOffender(res);
        } else {
          setcheckValidOffender([]);
        }
      }
    );
  };

  const OffenseIdDrpDwnVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("OffenseType/GetDataDropDown_OffenseType", val).then(
      (data) => {
        if (data) {
          setOffenseIdDrp(threeColArray(data, "OffenseTypeID", "Description", "OffenseTypeCode"));
          const arr = threeColArray(data, "OffenseTypeID", "Description", "OffenseTypeCode");
          const NoneArray = arr?.filter((item) => item?.id === "N");
          const CaseStatusArray = incidentStatusDrpDwn?.filter((item) => item?.id === "O");
          // console.log("🚀 ~ OffenseIdDrpDwnVal ~ CaseStatusArray:", CaseStatusArray)

          // console.log("incidentStatusDrpDwn", incidentStatusDrpDwn)

          if (NoneArray?.length > 0 && CaseStatusArray?.length > 0 && editval?.length == 0 && (IncSta === false || IncSta === "false")) {
            setValue({ ...value, ["OffenseTypeID"]: NoneArray[0]?.value, ["PrimaryOfficerID"]: parseInt(loginPinID), ["CaseStatusID"]: CaseStatusArray[0]?.value ? parseInt(CaseStatusArray[0]?.value) : "" });
          }
        } else {
          setOffenseIdDrp([]);
        }
      }
    );
  };

  useEffect(() => {
    if (incidentID && (IncSta === true || IncSta === 'true')) {
      setOfficerApprovCount(true);
      setValue({
        ...value,
        //drpdown
        'IncidentID': editval[0]?.IncidentID, 'AgencyID': editval[0]?.AgencyID, 'CADDispositionId': editval[0]?.CADDispositionId, 'CADCFSCodeID': editval[0]?.CADCFSCodeID, 'RMSCFSCodeID': editval[0]?.RMSCFSCodeID,
        'FBIID': editval[0]?.FBIID, 'ReceiveSourceID': editval[0]?.ReceiveSourceID, 'crimelocationid': editval[0]?.crimelocationid, 'NIBRSClearanceID': editval[0]?.NIBRSClearanceID, 'RMSDispositionId': editval[0]?.RMSDispositionId,
        //date fields
        'IncidentNumber': editval[0]?.IncidentNumber, 'CADIncidentNumber': editval[0]?.CADIncidentNumber, 'MasterIncidentNumber': editval[0]?.MasterIncidentNumber, 'ReportedDate': editval[0]?.ReportedDate ? getShowingDateText(editval[0]?.ReportedDate) : '', 'OccurredFrom': editval[0]?.OccurredFrom ? getShowingDateText(editval[0]?.OccurredFrom) : '',
        'OccurredTo': editval[0]?.OccurredTo ? getShowingDateText(editval[0]?.OccurredTo) : '', 'BIBRSDate': editval[0]?.BIBRSDate ? getShowingDateText(editval[0]?.BIBRSDate) : '',
        'DispositionDate': editval[0]?.DispositionDate ? editval[0]?.DispositionDate : '', 'NIBRSclearancedate': editval[0]?.NIBRSclearancedate ? getShowingDateText(editval[0]?.NIBRSclearancedate) : '', 'IsVerify': editval[0]?.IsVerify,
        //text
        'CrimeLocation': editval[0]?.CrimeLocation, 'DispositionComments': editval[0]?.DispositionComments,
        // location column
        'DirectionPrefix': editval[0]?.DirectionPrefix, 'Street': editval[0]?.Street, 'DirectionSufix': editval[0]?.DirectionSufix, 'TypeSufix': editval[0]?.TypeSufix, 'City': editval[0]?.City, 'State': editval[0]?.State, 'OffenseType': editval[0]?.OffenseType, 'OffenseTypeID': editval[0]?.OffenseTypeID, 'ZipCode': editval[0]?.ZipCode, 'PremiseNo': editval[0]?.PremiseNo, 'ApartmentNo': editval[0]?.ApartmentNo, 'CommonPlace': editval[0]?.CommonPlace, 'ApartmentType': editval[0]?.ApartmentType, 'Street_Parse': editval[0]?.Street_Parse, 'PremiseNo_Parse': editval[0]?.PremiseNo_Parse, 'DirectionPrefix_Parse': editval[0]?.DirectionPrefix_Parse, 'TypeSuffix_Parse': editval[0]?.TypeSuffix_Parse, 'DirectionSuffix_Parse': editval[0]?.DirectionSuffix_Parse, 'ZipCodeID': editval[0]?.ZipCodeID, 'CityID': editval[0]?.CityID, 'IsUsLocation': editval[0]?.IsUsLocation, 'CountryID': editval[0]?.CountryID, 'Country': editval[0]?.Country, 'point_of_interest': editval[0]?.point_of_interest, 'neighborhood': editval[0]?.neighborhood, 'subpremise': editval[0]?.subpremise, 'premise': editval[0]?.premise, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID, 'Address': editval[0]?.Address,
        'IsCargoTheftInvolved': editval[0]?.IsCargoTheftInvolved || editval[0]?.IsCargoTheftInvolved === "N" ? editval[0]?.IsCargoTheftInvolved === "N" ? false : true : "",
        // 'IsCargoTheftInvolved': editval[0]?.IsCargoTheftInvolved === 'N' || editval[0]?.IsCargoTheftInvolved === null || editval[0]?.IsCargoTheftInvolved === '' ? false : true,
        // ----------------checkbox-------------------
        'InitAdjust': editval[0]?.InitAdjust ? editval[0]?.InitAdjust.trim() : '', 'AttempComp': editval[0]?.AttempComp,
        'PrimaryOfficerID': editval[0]?.PrimaryOfficerID,
        'NIBRSStatus': editval[0]?.NIBRSStatus, 'CaseStatusID': editval[0]?.CaseStatusID ? parseInt(editval[0]?.CaseStatusID) : '', 'CaseStatusCode': editval[0]?.CaseStatusCode, isPoliceForceApplied: editval[0]?.isPoliceForceApplied,
      });
      setnibrsStatus(editval[0]?.NIBRSStatus); setnibrsSubmittedIncident(editval[0]?.IsNIBRSSummited);

      setcarboTheft(editval[0]?.IsCargoTheftVisible); setOccuredFromDate(editval[0]?.OccurredFrom ? new Date(editval[0]?.OccurredFrom) : null);
      setReportedDate(editval[0]?.ReportedDate ? new Date(editval[0]?.ReportedDate) : ''); setIncidentReportedDate(editval[0]?.ReportedDate ? new Date(editval[0]?.ReportedDate) : null); setClsDrpCode(Get_Exceptional_Code(editval, rmsDispositionDrpData)); setExClsDateCode(Get_ExClsDate_Code(editval, exceptionalClearID)); setStateReportID(Get_OffenseType_Code(editval, offenseIdDrp)); setIncidentRmsCfs(editval[0]?.RMSCFSCodeID); setReportedDtTmInc(getShowingDateText(editval[0]?.ReportedDate)); setOnSelectLocation(false);
      //--------------get_Non_Verify_Add-------------------
      if (!editval[0]?.IsVerify && editval[0]?.crimelocationid) {
        get_Add_Single_Data(editval[0]?.crimelocationid); setOnSelectLocation(false);
      }
      if (editval[0]?.isPoliceForceApplied) {
        setShowPoliceForce(true);
      } else if (!editval[0]?.isPoliceForceApplied) {
        setShowPoliceForce(false);
      }
      if (editval[0]?.isPoliceForceApplied) {
        setIsEnabled(true);
      } else {
        setIsEnabled(false);
      }
      dispatch({ type: Incident_ReportDate, payload: editval[0]?.ReportedDate ? getShowingDateText(editval[0]?.ReportedDate) : '', });

      if (incidentCount[0]?.ArrestCount > 0) {
        setadultArrestStatus(true);
      } else {
        setadultArrestStatus(false);
      }
    } else {
      setValue({
        ...value,
        'IncidentNumber': incNumberGenrateStatus ? "Auto Generated" : null, 'ReportedDate': getShowingMonthDateYear(datezone), 'OccurredFrom': getShowingMonthDateYear(datezone), 'OccurredTo': null, 'BIBRSDate': getShowingMonthDateYear(datezone), 'FBIID': '', 'CADCFSCodeID': '', 'DispositionDate': '', 'NIBRSclearancedate': '', 'CrimeLocation': '', 'DispositionComments': '', 'CADDispositionId': '', 'IsVerify': true, 'RMSCFSCodeID': '', 'NIBRSClearanceID': '', 'RMSDispositionId': '', 'ReceiveSourceID': '', 'OffenseType': '', 'OffenseTypeID': '', 'Address': '', 'CADIncidentNumber': '', 'MasterIncidentNumber': '', 'IsCargoTheftInvolved': '', 'InitAdjust': '', 'AttempComp': '',
        'NIBRSStatus': '', 'CaseStatusID': '', 'CaseStatusCode': '',
      });
      setLocationStatus(true); setUpdateStatus(updateStatus + 1); setIncNumberGenrateStatus(true); setIncidentReportedDate(getShowingMonthDateYear(new Date()));
      setOnSelectLocation(false);
    }
  }, [editval, updateCount]);

  useEffect(() => {
    offenseIdDrp?.filter((val) => {
      if (val.value === value?.OffenseTypeID) {
        setStateReportID(val?.id);
      }
    });
  }, [value.OffenseTypeID, offenseIdDrp]);

  useEffect(() => {
    if (editval?.length == 0 && (IncSta === false || IncSta === "false")) {
      if (!incidentID) {
        get_INC_NO_Genrate_Status(localStoreData?.AgencyID);
      }
    }
    get_Data_List(localStoreData?.AgencyID);
  }, [editval, localStoreData]);

  useEffect(() => {
    if (editval?.length == 0 && (IncSta === false || IncSta === "false")) {
      setValue({ ...value, ["RMSDispositionId"]: 16 });
      setClsDrpCode("02");
    }
  }, [IncID, IncSta]);

  const check_Validation_Error = (e) => {
    if (clsDrpCode === "01") {
      if (exClsDateCode != "N") {
        const IncNumberErr = !incNumberGenrateStatus ? RequiredFieldIncident(value?.IncidentNumber) : "true";
        const CrimeLocationErr = onSelectLocation ? 'Select Location' : Space_AllowInc(value.CrimeLocation);
        const ReportedDateErr = RequiredFieldIncident(value.ReportedDate);
        const NIBRSClearanceIDErr = RequiredFieldIncident(value.NIBRSClearanceID);
        const NIBRSclearancedateErrorErr = value?.NIBRSClearanceID && exClsDateCode !== "N" ? RequiredFieldIncident(value.NIBRSclearancedate) : "true";
        const CargoTheftErrorErr = carboTheft ? RequiredFieldIncidentCarboTheft(value.IsCargoTheftInvolved) : "true";
        const OffenceTypeErr = RequiredFieldIncident(value?.OffenseTypeID);
        const PrimaryOfficerIDErr = RequiredFieldIncident(value?.PrimaryOfficerID);
        const CaseStatusErr = RequiredFieldIncident(value?.CaseStatusID);

        setErrors((prevValues) => {
          return {
            ...prevValues,
            ["OccuredError"]: ReportedDateErr || prevValues["OccuredError"],
            ["CrimeLocationError"]: CrimeLocationErr || prevValues["CrimeLocationError"],
            ["ExceptionalClearaceError"]: NIBRSClearanceIDErr || prevValues["ExceptionalClearaceError"],
            ["NIBRSclearancedateError"]: NIBRSclearancedateErrorErr || prevValues["NIBRSclearancedateError"],
            ["IncNumberError"]: IncNumberErr || prevValues["IncNumberError"],
            ["OffenceTypeError"]: OffenceTypeErr || prevValues["OffenceTypeError"],
            ["CargoTheftError"]: CargoTheftErrorErr || prevValues["CargoTheftError"],
            ["PrimaryOfficerIdError"]: PrimaryOfficerIDErr || prevValues["PrimaryOfficerIdError"],
            ["CaseStatusError"]: CaseStatusErr || prevValues["CaseStatusError"],
          };
        });
      } else {
        const ReportedDateErr = RequiredFieldIncident(value.ReportedDate);
        const NIBRSClearanceIDErr = RequiredFieldIncident(value.NIBRSClearanceID);
        const CrimeLocationErr = onSelectLocation ? 'Select Location' : Space_AllowInc(value.CrimeLocation);
        const IncNumberErr = !incNumberGenrateStatus ? RequiredFieldIncident(value?.IncidentNumber) : "true";
        const OffenceTypeErr = RequiredFieldIncident(value?.OffenseTypeID);
        const CargoTheftErrorErr = carboTheft ? RequiredFieldIncidentCarboTheft(value.IsCargoTheftInvolved) : "true";
        const PrimaryOfficerIDErr = RequiredFieldIncident(value?.PrimaryOfficerID);
        const CaseStatusErr = RequiredFieldIncident(value?.CaseStatusID);
        setErrors((prevValues) => {
          return {
            ...prevValues,
            ["OccuredError"]: ReportedDateErr || prevValues["OccuredError"],
            ["CrimeLocationError"]: CrimeLocationErr || prevValues["CrimeLocationError"],
            ["ExceptionalClearaceError"]: NIBRSClearanceIDErr || prevValues["ExceptionalClearaceError"],
            ["IncNumberError"]: IncNumberErr || prevValues["IncNumberError"],
            ["OffenceTypeError"]: OffenceTypeErr || prevValues["OffenceTypeError"],
            ["CargoTheftError"]: CargoTheftErrorErr || prevValues["CargoTheftError"],
            ["PrimaryOfficerIdError"]: PrimaryOfficerIDErr || prevValues["PrimaryOfficerIdError"],
            ["CaseStatusError"]: CaseStatusErr || prevValues["CaseStatusError"],
          };
        });
      }
    } else {
      const ReportedDateErr = RequiredFieldIncident(value.ReportedDate);
      const CrimeLocationErr = onSelectLocation ? "Select Location" : Space_AllowInc(value.CrimeLocation);
      const IncNumberErr = !incNumberGenrateStatus ? RequiredFieldIncident(value?.IncidentNumber) : "true";
      const OffenceTypeErr = RequiredFieldIncident(value?.OffenseTypeID);
      const CargoTheftErrorErr = carboTheft ? RequiredFieldIncidentCarboTheft(value.IsCargoTheftInvolved) : "true";
      const PrimaryOfficerIDErr = RequiredFieldIncident(value?.PrimaryOfficerID);
      const CaseStatusErr = RequiredFieldIncident(value?.CaseStatusID);
      setErrors((prevValues) => {
        return {
          ...prevValues,
          ["OccuredError"]: ReportedDateErr || prevValues["OccuredError"],
          ["CrimeLocationError"]: CrimeLocationErr || prevValues["CrimeLocationError"],
          ["IncNumberError"]: IncNumberErr || prevValues["IncNumberError"],
          ["OffenceTypeError"]: OffenceTypeErr || prevValues["OffenceTypeError"],
          ["CargoTheftError"]: CargoTheftErrorErr || prevValues["CargoTheftError"],
          ["PrimaryOfficerIdError"]: PrimaryOfficerIDErr || prevValues["PrimaryOfficerIdError"],
          ["CaseStatusError"]: CaseStatusErr || prevValues["CaseStatusError"],
        };
      });
    }
  };

  // Check All Field Format is True Then Submit
  const { OccuredError, CrimeLocationError, ExceptionalClearaceError, NIBRSclearancedateError, IncNumberError, OffenceTypeError, CargoTheftError, PrimaryOfficerIdError, CaseStatusError } = errors;

  useEffect(() => {
    if (clsDrpCode === "01" || value.RMSDispositionId === "15" || value.RMSDispositionId === 15) {
      if (exClsDateCode != "N") {
        if (OccuredError === "true" && CrimeLocationError === "true" && ExceptionalClearaceError === "true" && NIBRSclearancedateError === "true" && IncNumberError === "true" && OffenceTypeError === "true" && CargoTheftError === "true" && PrimaryOfficerIdError === "true" && CaseStatusError === "true") {
          if (IncSta === true || IncSta === "true") {
            UpdateIncident();
          } else {
            AddIncident();
          }
        }
      } else if (OccuredError === "true" && CrimeLocationError === "true" && ExceptionalClearaceError === "true" && IncNumberError === "true" && OffenceTypeError === "true" && CargoTheftError === "true" && PrimaryOfficerIdError === "true" && CaseStatusError === "true") {
        if (IncSta === true || IncSta === "true") {
          UpdateIncident();
        } else {
          AddIncident();
        }
      }
    } else if (OccuredError === "true" && CrimeLocationError === "true" && IncNumberError === "true" && OffenceTypeError === "true" && CargoTheftError === "true" && PrimaryOfficerIdError === "true" && CaseStatusError === "true") {
      if (IncSta === true || IncSta === "true") {
        UpdateIncident();
      } else {
        AddIncident();
      }
    }
  }, [OccuredError, CrimeLocationError, ExceptionalClearaceError, NIBRSclearancedateError, IncNumberError, OffenceTypeError, CargoTheftError, PrimaryOfficerIdError, CaseStatusError]);

  const Reset = () => {
    setValue({
      ...value,
      ReportedDate: "", OccurredFrom: "", OccurredTo: "", FinishedDate: "", BIBRSDate: "", DispositionDate: "", FBIID: "", NIBRSclearancedate: "", DispositionComments: "", IncidentNumber: "", RMSCFSCodeID: "", CADIncidentNumber: "", MasterIncidentNumber: "", NIBRSClearanceID: "", RMSDispositionId: "", ReceiveSourceID: "", CADCFSCodeID: "", OffenseType: "", OffenseTypeID: "", Address: "", IsCargoTheftInvolved: "", InitAdjust: "", AttempComp: "", NIBRSStatus: '', CaseStatusID: '', CaseStatusCode: '',
      // PrimaryOfficerId: "",
    });
    setErrors({
      ...errors, OccuredError: "", CrimeLocationError: "", ExceptionalClearaceError: "", NIBRSclearancedateError: "", OffenceTypeError: "", CargoTheftError: "", PrimaryOfficerIdError: "", CaseStatusError: "",
    });
    setExClsDateCode(""); setCaseStatus('Open')
  };

  const setToResetData = () => {
    setValue({
      ...value,
      RMSDispositionId: "",
    });
  };

  const HandleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === "IsVerify") {
      if (e.target.checked && addVerifySingleData.length > 0) {
        setModalStatus(false); setLocationStatus(true); setAddVerifySingleData([]);
        setValue((pre) => {
          return {
            ...pre, ["CrimeLocation"]: "", [e.target.name]: e.target.checked,
          };
        });
      } else {
        setValue((pre) => {
          return { ...pre, [e.target.name]: e.target.checked };
        });
        setModalStatus(true); setLocationStatus(false);
      }
    } else if (e.target.name === "IsCargoTheftInvolved") {
      setValue((pre) => {
        return { ...pre, [e.target.name]: e.target.checked };
      });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      if (name === "RMSCFSCodeID") {
        setIncidentRmsCfs(e.value); setValue({ ...value, [name]: e.value });
      } else if (name === "RMSDispositionId") {
        setClsDrpCode(e.id);
        setValue({
          ...value,
          [name]: e.value,

          ["DispositionDate"]: getShowingMonthDateYear(datezone),
          ["NIBRSclearancedate"]: "",
        });
        setErrors({
          ...errors,
          ["OccuredError"]: "",
          ["ExceptionalClearaceError"]: "",
          ["NIBRSclearancedateError"]: "",
        });
      } else if (name === "NIBRSClearanceID") {
        setExClsDateCode(e.id);
        if (e.id != "N") {
          setValue({
            ...value,
            [name]: e.value,
            ["NIBRSclearancedate"]: getShowingMonthDateYear(datezone),
          });
          setErrors({
            ...errors,
            ["OccuredError"]: "",
            ["NIBRSclearancedateError"]: "",
          });
        } else {

          setValue({ ...value, [name]: e.value, ["NIBRSclearancedate"]: "" });
          setErrors({
            ...errors,
            ["OccuredError"]: "",
            ["NIBRSclearancedateError"]: "",
          });
        }
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else if (e === null) {
      if (name === "RMSDispositionId") {
        setValue({
          ...value,
          [name]: null,
          ["NIBRSClearanceID"]: null,
          ["DispositionDate"]: "",
          ["NIBRSclearancedate"]: "",
        });
        setClsDrpCode("");
        setExClsDateCode("");
        setErrors({
          ...errors,
          ["OccuredError"]: "",
          ["ExceptionalClearaceError"]: "",
          ["DispositionDateError"]: "",
          ["NIBRSclearancedateError"]: "",
        });
      } else if (name === "FBIID") {

        setRmsCfsID([]);

        setValue({ ...value, ["FBIID"]: "", ["RMSCFSCodeID"]: "" });
      } else if (name === "NIBRSClearanceID") {

        setExClsDateCode("");

        setValue({ ...value, [name]: null, ["NIBRSclearancedate"]: "" });
        setErrors({
          ...errors,
          ["ExceptionalClearaceError"]: "",
          ["NIBRSclearancedateError"]: "",
        });
      } else {
        setValue({ ...value, [name]: null });
      }
    } else {
      setValue({ ...value, [name]: null });

    }
  };

  const onChangeExceptionalClearance = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      if (name === "RMSDispositionId") {
        // console.log(e.id);
        setClsDrpCode(e.id);
        setValue({
          ...value,
          [name]: e.value,
          ["NIBRSClearanceID"]: null,
          ["NIBRSclearancedate"]: "",
        });
        setErrors({
          ...errors,
          ["OccuredError"]: "",
          ["ExceptionalClearaceError"]: "",
          ["NIBRSclearancedateError"]: "",
        });
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === "RMSDispositionId") {
        setValue({
          ...value,
          [name]: null,
          ["NIBRSClearanceID"]: null,
          ["NIBRSclearancedate"]: "",
        });
        setErrors({
          ...errors,
          ["OccuredError"]: "",
          ["ExceptionalClearaceError"]: "",
          ["NIBRSclearancedateError"]: "",
        });
        setClsDrpCode("");
        setExClsDateCode("");
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  };

  const onChangeExceptionalClearanceCode = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      if (name === "NIBRSClearanceID") {
        setExClsDateCode(e.id);
        if (e.id != "N") {
          setValue({
            ...value,
            [name]: e.value,
            ["NIBRSclearancedate"]: getShowingMonthDateYear(datezone),
          });
          setErrors({
            ...errors,
            ["OccuredError"]: "",
            ["NIBRSclearancedateError"]: "",
          });
        } else {
          setValue({ ...value, [name]: e.value, ["NIBRSclearancedate"]: "" });
          setErrors({
            ...errors,
            ["OccuredError"]: "",
            ["NIBRSclearancedateError"]: "",
          });
        }
      }
    } else {
      if (name === "NIBRSClearanceID") {
        setExClsDateCode("");
        setValue({ ...value, [name]: null, ["NIBRSclearancedate"]: "" });
        setErrors({
          ...errors,
          ["ExceptionalClearaceError"]: "",
          ["NIBRSclearancedateError"]: "",
        });
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  };

  const onChangeOffenceType = (e, name) => {
    !addUpdatePermission && setChangesStatus(true);
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e) {
      if (name == "OffenseTypeID") {
        setValue({ ...value, ["OffenseTypeID"]: e.value });
        setStateReportID(e.id);
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name == "OffenseTypeID") {
        setValue({ ...value, ["OffenseTypeID"]: null });
        setStateReportID("");
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  };

  const formatToRegex = (format) => {
    if (!format) return null;
    const regexString = format
      .replace(/Y/g, ".") // Replace Y with any character
      .replace(/#/g, ".") // Replace # with any character
      .replace(/-/g, "-"); // Keep dashes as-is

    return new RegExp(`^${regexString}$`);
  };

  const get_Data_List = async (loginAgencyID) => {
    try {
      await fetchPostData("Counter/GetData_SysCounter", {
        AgencyID: loginAgencyID,
      }).then((res) => {
        if (res) {
          const IncFormatArr = res?.filter((item) => item.AppCode === "INC ");
          setCounter_Format(IncFormatArr[0]?.DefinedFormat);

          setIsSystemGenratedStatus(
            IncFormatArr[0]?.IsSystemGenerated === "Y" ? true : false
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const AddIncident = async () => {
    const incNumberExistStatus = await check_INC_NO_Exist(loginAgencyID, value?.IncidentNumber ? value?.IncidentNumber : "Auto Generated", 0)
    if (incNumberExistStatus) {
      toastifyError("Incident Number Already Exists");
      setErrors({ ...errors, ['OccuredError']: '', ['IncNumberError']: '', ['NIBRSclearancedateError']: '', });
    } else {
      const {
        IncidentID, ReportedDate, OccurredFrom, OccurredTo, BIBRSDate, FinishedDate, DispositionDate, NIBRSclearancedate, IncidentNumber, CrimeLocation,
        DispositionComments, PrimaryOfficerID, AgencyName, RMSCFSCodeID, NIBRSClearanceID, RMSDispositionId, ReceiveSourceID, CADCFSCodeID, CADDispositionId, AgencyID, IsVerify, crimelocationid, FBIID, IsIncidentCode, DispatchedDate, ArrivedDate, DirectionPrefix, Street, DirectionSufix, TypeSufix, City, State, ZipCode, PremiseNo, ApartmentNo, CommonPlace, ApartmentType, Street_Parse, PremiseNo_Parse, DirectionPrefix_Parse, TypeSuffix_Parse, DirectionSuffix_Parse, ZipCodeID, CityID, IsUsLocation, CountryID, Country, point_of_interest, neighborhood, subpremise, OffenseType, OffenseTypeID, CADIncidentNumber, MasterIncidentNumber, premise, CreatedByUserFK, ModifiedByUserFK, IsCargoTheftInvolved, InitAdjust, AttempComp, NIBRSStatus, CaseStatusCode, CaseStatusID, isPoliceForceApplied
      } = value
      const val = {
        'IncidentID': IncidentID, 'ReportedDate': ReportedDate, 'OccurredFrom': OccurredFrom, 'OccurredTo': OccurredTo, 'BIBRSDate': BIBRSDate, 'FinishedDate': FinishedDate, 'DispositionDate': DispositionDate, 'NIBRSclearancedate': NIBRSclearancedate, 'IncidentNumber': IncidentNumber, 'CrimeLocation': CrimeLocation, 'DispositionComments': DispositionComments, 'AgencyName': AgencyName, 'RMSCFSCodeID': RMSCFSCodeID, 'NIBRSClearanceID': NIBRSClearanceID,
        'RMSDispositionId': RMSDispositionId ? RMSDispositionId : 16,
        'ReceiveSourceID': ReceiveSourceID, 'CADCFSCodeID': CADCFSCodeID, 'CADDispositionId': CADDispositionId, 'AgencyID': loginAgencyID, 'IsVerify': IsVerify, 'crimelocationid': crimelocationid, 'FBIID': FBIID, 'IsIncidentCode': IsIncidentCode, 'DispatchedDate': DispatchedDate, 'ArrivedDate': ArrivedDate, 'DirectionPrefix': DirectionPrefix, 'Street': Street, 'DirectionSufix': DirectionSufix, 'CADIncidentNumber': CADIncidentNumber, 'MasterIncidentNumber': MasterIncidentNumber, 'TypeSufix': TypeSufix, 'City': City, 'State': State, 'ZipCode': ZipCode, 'PremiseNo': PremiseNo, 'ApartmentNo': ApartmentNo, 'CommonPlace': CommonPlace, 'ApartmentType': ApartmentType, 'Street_Parse': Street_Parse, 'PremiseNo_Parse': PremiseNo_Parse, 'DirectionPrefix_Parse': DirectionPrefix_Parse,
        'TypeSuffix_Parse': TypeSuffix_Parse, 'DirectionSuffix_Parse': DirectionSuffix_Parse, 'ZipCodeID': ZipCodeID, 'CityID': CityID, 'IsUsLocation': IsUsLocation, 'CountryID': CountryID, 'Country': Country, 'point_of_interest': point_of_interest, 'neighborhood': neighborhood, 'subpremise': subpremise, 'premise': premise, 'OffenseType': OffenseType, 'OffenseTypeID': OffenseTypeID, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
        'IsCargoTheftInvolved': IsCargoTheftInvolved, 'InitAdjust': InitAdjust, 'AttempComp': AttempComp,
        'PrimaryOfficerID': PrimaryOfficerID, 'NIBRSStatus': NIBRSStatus, 'CaseStatusCode': CaseStatusCode, 'CaseStatusID': CaseStatusID, 'isPoliceForceApplied': isPoliceForceApplied
      }
      AddDeleteUpadate('Incident/IncidentInsert', val).then((res) => {
        // console.log("🚀 ~ AddIncident ~ res:", res)
        if (res.success) {
          setIncNumberGenrateStatus(true);
          if (res.IncidentID) {
            get_IncidentTab_Count(parseInt(res?.IncidentID), loginPinID);
            GetEditData(parseInt(res?.IncidentID));
            setOnSelectLocation(false); setIncidentID(parseInt(res?.IncidentID)); setChangesStatus(false); setStatesChangeStatus(false); toastifySuccess(res?.Message);

            // for add new incident in recent incident list
            let newData = [...incidentRecentData];
            const newObj = {
              IncidentID: res.IncidentID ? parseInt(res.IncidentID) : '',
              IncidentNumber: res.IncidentNumber ? res.IncidentNumber : '',
            }
            newData.push(newObj);
            setIncidentRecentData(newData);

            // validateIncSideBar
            validate_IncSideBar(res?.IncidentID, res?.IncidentNumber, loginAgencyID);
          }
          navigate(`/Inc-Home?IncId=${stringToBase64(res?.IncidentID?.trim())}&IncNo=${res?.IncidentNumber?.trim()}&IncSta=${true}`);
          setErrors({ ...errors, ['OccuredError']: '', ['IncNumberError']: '', ['NIBRSclearancedateError']: '', });

        } else {
          toastifyError("Error"); setErrors({ ...errors, ['OccuredError']: '', ['IncNumberError']: '', ['NIBRSclearancedateError']: '', });

        }
      });

    }
  }

  const UpdateIncident = async () => {
    await AddDeleteUpadate('Incident/IncidentUpdate', value).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;
      toastifySuccess(message); get_IncidentTab_Count(incidentID, loginPinID); setChangesStatus(false);
      setStatesChangeStatus(false); setOnSelectLocation(false);
      GetEditData(IncID);
      setErrors({ ...errors, ['OccuredError']: '', ['ExceptionalClearaceError']: '', });
      // validateIncSideBar
      validate_IncSideBar(IncID, IncNo, loginAgencyID);
    });
  }

  // validate Incident
  const get_NibrsErrorStatus = async (incidentID, reportDate, baseDate, oriNumber) => {
    try {
      const val = {
        gIntAgencyID: loginAgencyID, IsIncidentCheck: true, gIncidentID: incidentID, dtpDateTo: reportDate,
        dtpDateFrom: reportDate, BaseDate: baseDate, strORINumber: oriNumber, strComputerName: uniqueId,
        //no use
        rdbSubmissionFile: false, rdbErrorLog: false, rdbNonReportable: false, chkPastErrorPrint: false,
        rdbOne: false, rdbTwoMonth: false, rdbThreeMonth: false, rdbAllLogFile: false, IPAddress: "",
      };
      await fetchPostData("NIBRS/TXIBRS", val).then((data) => {
        if (Array.isArray(data) && data.length > 0) {

          const errorObject = data[0]?.ErrorObject || {};
          const incidentError = errorObject?.Incident ? true : false;
          const administrativeError = errorObject?.Administrative ? true : false;
          const status = incidentError && administrativeError ? true : false;
          // return status;

          fetchPostData('Incident/Update_IsNIBRSError', {
            'IsNIBRSError': status,
            'ModifiedByUserFK': loginPinID,
            'IncidentID': incidentID
          }).then((res) => {
            console.log("🚀 ~ UpdateIsNIBRSError ~ res:", res)
            if (res.success) {
              // toastifySuccess(res?.Message);
            }
          });


        } else {
          return false;
        }
      });
    } catch (error) {
      console.log("🚀 ~ nibrsValidateInc ~ error:", error);
      return false;
    }
  };


  const OnClose = () => {
    if (IsCadInc === "true" || IsCadInc === true) {
      if (!changesStatus) {
        setChangesStatus(false);
        setStatesChangeStatus(false);
        Reset();
        navigate("/CadincidentList");
        setIncidentID("");
      }
    } else if (!changesStatus) {
      setChangesStatus(false);
      setStatesChangeStatus(false);
      Reset();
      navigate("/incident");
      setIncidentID("");
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

  const get_Add_Single_Data = (crimelocationid) => {
    const val = { LocationID: crimelocationid };
    fetchPostData("MasterLocation/GetSingleData_MasterLocation", val).then(
      (res) => {
        if (res.length > 0) {
          setAddVerifySingleData(res);
        } else {
          setAddVerifySingleData([]);
        }
      }
    );
  };

  const get_INC_NO_Genrate_Status = async (loginAgencyID) => {
    try {
      const val = { AgencyID: loginAgencyID };
      await fetchPostData("Incident/NumberGenerate", val).then((data) => {
        // console.log(data)
        if (data[0]?.Message?.trim()) {
          setIncNumberGenrateStatus(true);
        } else {
          setIncNumberGenrateStatus(false);
          setstatusnew(true);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const check_INC_NO_Exist = async (LoginAgencyID, IncidentNumber, IncidentID) => {
    const val = { AgencyID: LoginAgencyID, IncidentNumber: IncidentNumber, IncidentID: IncidentID };
    const data = await fetchPostData("Incident/IncidentExist", val);
    if (data?.length > 0) {
      if (data[0].Total === 0 || data[0].Total === "0") {
        setIncNumberExistStatus(false);
        return false;
      } else {
        toastifyError("Incident No already Exist");
        setIncNumberExistStatus(true);
        return true;
      }
    } else {
      setIncNumberExistStatus(true);
      return true;
    }
  };

  const reportedTime = new Date(reportedDate);
  let reportDate = reportedTime.getDate();
  let reportMonth = reportedTime.getMonth();
  let reportTime = reportedTime.getTime();
  const date = new Date(occuredFromDate);
  let OccuredDate = date.getDate();
  let OccuredMonth = date.getMonth();

  // for occuredfrom date
  const filterPassed = (time) => {
    const selectedDate = new Date(time);
    if (!occuredFromDate) {
      selectedDate?.setDate(reportDate);
      selectedDate?.setMonth(reportMonth);
      selectedDate?.setFullYear(reportedTime?.getFullYear());
      return reportedTime?.getTime() >= selectedDate?.getTime();
    } else if (
      occuredFromDate &&
      OccuredDate !== reportDate &&
      reportMonth !== OccuredMonth
    ) {
      return reportedDate?.getTime() >= selectedDate?.getTime();
    } else if (
      occuredFromDate &&
      OccuredDate !== reportDate &&
      reportMonth === OccuredMonth
    ) {
      return reportedDate?.getTime() >= selectedDate?.getTime();
    } else {
      return reportedDate?.getTime() >= selectedDate?.getTime();
    }
  };

  const checkExceptionNibrsError = (exCode) => {
    // return NibrsErrorscolourStyles
    if (exCode) {
      if (
        exCode === "N" ||
        exCode === "A" ||
        exCode === "B" ||
        exCode === "C" ||
        exCode === "D" ||
        exCode === "E"
      ) {
        if (checkValidOffender?.length == 0) {
          return nibrscolourStyles;
        } else {
          return nibrscolourStyles;
          // return colourStyles
        }
      } else {
        return nibrscolourStyles;
      }
    } else {
      if (clsDrpCode == "EC" && value?.RMSDispositionId != "") {
        return nibrscolourStyles;
        // return colourStyles
      } else {
        return customStylesWithOutColor;
      }
    }
  };

  // --- DS
  const getMinTimeForOccurredTo = (occuredFromDate) => {
    const minTime = new Date(occuredFromDate);
    minTime.setHours(occuredFromDate?.getHours());
    minTime.setMinutes(occuredFromDate?.getMinutes());
    minTime.setSeconds(occuredFromDate?.getSeconds());
    minTime.setMilliseconds(0);
    return minTime;
  };

  const filterTimeAfterOccurredFromAndBeforeMaxDate = (time, occuredFromDate, datezone) => {
    const occurredFromTimestamp = occuredFromDate?.getTime();
    const maxTimestamp = new Date(datezone)?.getTime();
    if (time?.getTime() <= occurredFromTimestamp) {
      return false;
    }
    if (time?.getTime() >= maxTimestamp) {
      return false;
    }
    return true;
  };

  const getMaxTimeForOccurredTo = (datezone) => {
    if (!datezone) return new Date();
    const maxTime = new Date(datezone);
    return maxTime;
  };

  const setToReset = () => { };

  const OnChangeCargoTheft = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  const getExceptionColorCode = (code, value) => {
    if (code) {
      if (code === "01") {
        return !value ? nibrscolourStyles : nibSuccessStyles;
      } else if (code === "02") {
        return diableColourStyles;
      }
    } else {
      return customStylesWithOutColor;
    }
  };

  const YesNoArr = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const diableColourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#9d949436",
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const nibSuccessStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#9fd4ae",
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const customStylesWithOutColor = {
    control: (base) => ({
      ...base,
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  // validate Incident
  const nibrsValidateInc = (incidentID, reportDate, baseDate, oriNumber) => {
    try {
      setnibrsValidateLoder(true);
      const val = {
        gIntAgencyID: loginAgencyID, IsIncidentCheck: true, gIncidentID: incidentID, dtpDateTo: reportDate,
        dtpDateFrom: reportDate, BaseDate: baseDate, strORINumber: oriNumber, strComputerName: uniqueId,
        //no use
        rdbSubmissionFile: false, rdbErrorLog: false, rdbNonReportable: false, chkPastErrorPrint: false,
        rdbOne: false, rdbTwoMonth: false, rdbThreeMonth: false, rdbAllLogFile: false, IPAddress: "",
      };
      // https://apigoldline.com:5002/api/NIBRS/TXIBRS
      fetchPostData("NIBRS/TXIBRS", val).then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setnibrsValidateLoder(false);
          const errorObject = data[0]?.ErrorObject || {};

          setnibrsValidateIncidentData(data);
          setnibrsValidIncScreen(!errorObject?.Administrative);
          setnibrsValidAllIncModule(!errorObject?.Incident);
          // console.log("🚀 ~ nibrsValidateInc ~ !errorObject?:", errorObject);
          // console.log("🚀 ~ nibrsValidateInc ~ !errorObject?.Incident:", !errorObject?.Incident);

          setIncValidateErrStr(errorObject?.Administrative || "");
          setincAllModuleValidateErrStr(errorObject?.Incident || "");
          setOffenseState(errorObject?.Offense?.[0]?.OnPageError || "");

        } else {
          setnibrsValidateIncidentData([]);
          setnibrsValidIncScreen(true);
          setnibrsValidAllIncModule(true);
          setnibrsValidateLoder(false);

        }
      });
    } catch (error) {
      console.log("🚀 ~ nibrsValidateInc ~ error:", error);
    }
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredUseOfForce, setIsHoveredUseOfForce] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const [rawValue, setRawValue] = useState("");

  const inputMask = Counter_Format && Counter_Format.replace ? Counter_Format.replace(/#/g, "*") : "";

  const formatWithMask = (mask, digits) => {
    let formatted = "";
    let digitIndex = 0;
    for (let i = 0; i < mask?.length; i++) {
      if (mask[i] === "9") {
        formatted += digitIndex < digits.length ? digits[digitIndex] : "_";
        digitIndex++;
      } else {
        formatted += mask[i];
      }
    }
    return formatted;
  };

  const maskedValue = formatWithMask(inputMask, rawValue);
  const showAutoGenerated = !(value.IncidentNumber || !incNumberGenrateStatus || incidentID);
  const canEditIncidentNumber = isSystemGenratedStatus && !incNumberGenrateStatus;

  const getZoneData = async (AgencyID) => {
    await fetchPostData('/CAD/GeoPetrolZone/GetData_Zone', { IsActive: 1, AgencyID: AgencyID, })
      .then((res) => {
        if (res) {
          setGeoZoneDropDown(
            dropDownDataModel(res, "ZoneID", "ZoneCode")
          );
        } else {
          // console.log("No Data");
          setGeoZoneDropDown([]);
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    setIsVerifyReportedLocation(false);
    const fetchLocationData = async () => {
      try {

        const response = await GeoServices.getLocationData({
          Location: geoFormValues?.location,
          AgencyID: loginAgencyID
        });
        const data = JSON.parse(response?.data?.data)?.Table || [];
        setLocationData(data);

      } catch (error) {
        console.error("Error fetching location data:", error);
        setLocationData([]);
      }
    };

    if (geoFormValues?.location) {
      fetchLocationData();
    }
  }, [geoFormValues?.location, isSelectLocation]);

  const createLocationPayload = (locationInformation) => {
    const data = locationInformation || geoFormValues;
    const {
      Street = "", stDirection = "", stDirection2 = "", City = "",
      ZipCode = "", PremiseNo = "", ApartmentNo = "", commonPlaceName = "",
      premiseType = {}, coordinateX = "", coordinateY = "", mileMarker = "",
      AltStreet = "", intersection1 = "", intersection2 = "", patrolZone = {},
      emsZone = {}, fireZone = {}, otherZone = {}, IsVerify = "", location = "",
      currentFlag = []
    } = data || {};

    return {
      ...(geoLocationID && { ID: geoLocationID }),
      Street, "DirectionPrefix": stDirection, "DirectionSufix": stDirection2,
      City, ZipCode, PremiseNo, ApartmentNo: value?.ApartmentNo, "CommonPlace": commonPlaceName,
      "PremiseType": premiseType?.label || "", "Latitude": coordinateY, "Longitude": coordinateX,
      "MileMaker": mileMarker, AltStreet, "InterDirectionPrefix": intersection1,
      "InterDirectionSufix": intersection2, "PatrolZone": patrolZone?.label, "EMSZone": emsZone?.label,
      "FireZone": fireZone?.label, "OtherZone": otherZone?.label, IsVerified: IsVerify,
      location, "CurrentFlage": currentFlag?.map(item => item?.label).join(", "),
      "GeoLocationContactsJson": JSON.stringify({ Contacts: contactList || [] }),
      "CreatedByUserFK": loginPinID, "AgencyID": loginAgencyID
    };
  };

  const handleCaseStatus = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value, NIBRSStatus: e.label, CaseStatusCode: e.id });
    }
    else {
      setValue({ ...value, [name]: null, NIBRSStatus: '', CaseStatusCode: '' });
    }
  }

  const isValidZone = (zone) => zone && Object.keys(zone).length > 0;
  const isVerifyLocation = geoFormValues.isVerify && isValidZone(geoFormValues.patrolZone) && isValidZone(geoFormValues.emsZone) && isValidZone(geoFormValues.fireZone) && isValidZone(geoFormValues.otherZone);


  return loder ? (
    <>
      <div className="col-12 overflow-y-hidden">
        <div className="row align-items-center mt-2 mb-2" style={{ rowGap: "8px" }}>
          <div className="col-4 col-md-4 col-lg-2 ">
            <label htmlFor="" className="new-label mb-0">
              Incident #
              {errors.IncNumberError !== "true" ? (
                <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                  {errors.IncNumberError}
                </p>
              ) : null}
            </label>
          </div>
          <div className="col-7 pl-1 col-md-7 col-lg-3 requiredColor_input_mask ">
            {showAutoGenerated ? (
              <input style={{ height: '35px' }} type="text" name="IncidentNumber" id="IncidentNumber" value="Auto Generated" readOnly disabled autoComplete="off" inputMode="none" maxLength={12} placeholder={Counter_Format} className="form-control py-1 new-input readonly" />
            ) : isSystemGenratedStatus ? (
              <input style={{ height: '35px' }} type="text" name="IncidentNumber" id="IncidentNumber" value={value.IncidentNumber} readOnly disabled autoComplete="off" inputMode="none" maxLength={12} placeholder={Counter_Format} className="form-control py-1 new-input readonly" />
            ) : (
              <InputMask
                mask={inputMask}
                maskChar="_"
                alwaysShowMask={true}
                value={value.IncidentNumber}
                placeholder={Counter_Format}
                style={{ textTransform: "uppercase" }}
                disabled={
                  !((isSystemGenratedStatus && incNumEditOfficer && (IncSta === true || IncSta === "true")) ||
                    (!isSystemGenratedStatus && incNumEditOfficer) || (!isSystemGenratedStatus && !incNumEditOfficer && (IncSta === false || IncSta === "false"))
                  )
                }
                readOnly={
                  !((isSystemGenratedStatus && incNumEditOfficer && (IncSta === true || IncSta === "true")) || (!isSystemGenratedStatus && incNumEditOfficer) || (!isSystemGenratedStatus && !incNumEditOfficer && (IncSta === false || IncSta === "false")))
                }
                onChange={(e) => {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                  setValue({
                    ...value,
                    ["IncidentNumber"]: e.target.value,
                  });
                }}
                onBlur={(e) => check_INC_NO_Exist(loginAgencyID, e.target?.value, incidentID)}
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    type="text"
                    name="IncidentNumber"
                    id="IncidentNumber"
                    autoComplete="off"
                    inputMode="none"
                    maxLength={12}
                    placeholder={Counter_Format}
                    className={`requiredColor_input_mask`}
                  />
                )}
              </InputMask>
            )}
          </div>

          <div className="col-3 col-md-3 col-lg-4 text-right">
            <span
              data-toggle="modal"
              onClick={() => { setOpenPage("Incident Status"); }}
              data-target="#ListModel"
              className="new-link px-0"
            >
              Case Status  {errors.CaseStatusError !== "true" ? <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>{errors.CaseStatusError}</p> : null}
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-3">
            <Select
              name="CaseStatusID"
              styles={Requiredcolour}
              value={incidentStatusDrpDwn?.filter((obj) => obj.value === value?.CaseStatusID)}
              isClearable
              options={incidentStatusDrpDwn}
              onChange={(e) => handleCaseStatus(e, "CaseStatusID")}
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2 ">
            <label htmlFor="" className="new-label mb-0">
              Master Incident #
            </label>
          </div>
          <div className="col-7 col-md-7 col-lg-3">
            <input type="text" name="MasterIncidentNumber" id="MasterIncidentNumber" className="form-control  new-input" value={value.MasterIncidentNumber} disabled readOnly />
          </div>
          <div className="col-3 col-md-3 col-lg-4">
            <label htmlFor="" className="new-label mb-0">
              CAD Event #
            </label>
          </div>
          <div className="col-9 col-md-9 col-lg-3  ">
            <input type="text" name="CADIncidentNumber" id="CADIncidentNumber" className="form-control  new-input" value={value.CADIncidentNumber} disabled readOnly />
          </div>

          <div className="bb"></div>

          <div className="col-3 col-md-3 col-lg-2 ">
            <label htmlFor="" className="new-label mb-0">
              Reported Date/Time
              {errors.OccuredError !== "true" ? <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>{errors.OccuredError}</p> : null}
            </label>
          </div>
          <div className="col-9 col-md-9 col-lg-3 ">
            {incidentID && (IncSta === true || IncSta === "true") ? (
              <DatePicker
                ref={startRef}
                onKeyDown={onKeyDown}
                id="ReportedDate"
                name="ReportedDate"
                dateFormat="MM/dd/yyyy HH:mm"
                onChange={(date) => {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                  if (date) {
                    const maxTime = datezone ? new Date(datezone) : null;

                    if (maxTime) {
                      const selectedDate = new Date(date);
                      const currentTimeInZone = new Date(datezone);

                      if (
                        !date.getHours() &&
                        !date.getMinutes() &&
                        !date.getSeconds()
                      ) {
                        selectedDate.setHours(currentTimeInZone.getHours());
                        selectedDate.setMinutes(currentTimeInZone.getMinutes());
                        selectedDate.setSeconds(currentTimeInZone.getSeconds());
                      }

                      setReportedDate(selectedDate);
                      setOccuredFromDate(new Date(selectedDate));

                      setIncidentReportedDate(
                        getShowingMonthDateYear(selectedDate)
                      );
                      setValue({
                        ...value,
                        ["ReportedDate"]: getShowingMonthDateYear(selectedDate),
                        ["DispositionDate"]: null,
                        ["NIBRSclearancedate"]: null,
                        ["OccurredFrom"]: getShowingMonthDateYear(
                          new Date(selectedDate)
                        ),
                      });
                    } else {
                      const currentTimeInZone = new Date(datezone);
                      const adjustedDate = new Date(date);
                      adjustedDate.setHours(currentTimeInZone.getHours());
                      adjustedDate.setMinutes(currentTimeInZone.getMinutes());
                      adjustedDate.setSeconds(currentTimeInZone.getSeconds());

                      setReportedDate(adjustedDate);
                      setIncidentReportedDate(
                        date ? getShowingMonthDateYear(adjustedDate) : null
                      );

                      setValue({
                        ...value,
                        ["ReportedDate"]: date
                          ? getShowingMonthDateYear(adjustedDate)
                          : null,
                        ["OccurredFrom"]: null,
                        ["DispositionDate"]: null,
                        ["NIBRSclearancedate"]: null,
                      });

                      setOccuredFromDate(null);
                    }
                  } else {
                    // If date is cleared (null or undefined), reset all fields
                    setReportedDate(null);
                    setIncidentReportedDate(null);
                    setOccuredFromDate(null);

                    setValue({
                      ...value,
                      ["ReportedDate"]: null,
                      ["OccurredFrom"]: null,
                      ["DispositionDate"]: null,
                      ["NIBRSclearancedate"]: null,
                    });
                  }
                }}
                placeholderText="Select..."
                maxDate={datezone ? new Date(datezone) : null}
                filterTime={(date) => filterPassedTimeZone(date, datezone)}
                selected={reportedDate}
                disabled={nibrsSubmittedIncident === 1 || incidentID}
                className={nibrsSubmittedIncident === 1 || incidentID ? "readonlyColor" : "requiredColor"}
                // className={nibrsSubmittedIncident === 1 ? "LockFildsColor" : incidentID ? "readonlyColor" : "requiredColor"
                // }

                timeInputLabel
                showTimeSelect
                timeIntervals={1}
                timeCaption="Time"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                showDisabledMonthNavigation
                autoComplete="off"
                timeFormat="HH:mm "
                is24Hour
                minDate={new Date(1991, 0, 1)}
              />
            ) : (
              <DatePicker
                ref={startRef}
                onKeyDown={onKeyDown}
                id="ReportedDate"
                name="ReportedDate"
                dateFormat="MM/dd/yyyy HH:mm"
                onChange={(date) => {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                  if (date) {
                    const maxTime = datezone ? new Date(datezone) : null;

                    if (maxTime) {
                      const selectedDate = new Date(date);
                      const currentTimeInZone = new Date(datezone);

                      if (
                        !date.getHours() &&
                        !date.getMinutes() &&
                        !date.getSeconds()
                      ) {
                        selectedDate.setHours(currentTimeInZone.getHours());
                        selectedDate.setMinutes(currentTimeInZone.getMinutes());
                        selectedDate.setSeconds(currentTimeInZone.getSeconds());
                      }

                      setReportedDate(selectedDate);
                      setOccuredFromDate(new Date(selectedDate));

                      setIncidentReportedDate(
                        getShowingMonthDateYear(selectedDate)
                      );
                      setValue({
                        ...value,
                        ["ReportedDate"]: getShowingMonthDateYear(selectedDate),
                        ["DispositionDate"]: null,
                        ["NIBRSclearancedate"]: null,
                        ["OccurredFrom"]: getShowingMonthDateYear(
                          new Date(selectedDate)
                        ),
                      });
                    } else {
                      const currentTimeInZone = new Date(datezone);
                      const adjustedDate = new Date(date);
                      adjustedDate.setHours(currentTimeInZone.getHours());
                      adjustedDate.setMinutes(currentTimeInZone.getMinutes());
                      adjustedDate.setSeconds(currentTimeInZone.getSeconds());

                      setReportedDate(adjustedDate);
                      setIncidentReportedDate(
                        date ? getShowingMonthDateYear(adjustedDate) : null
                      );

                      setValue({
                        ...value,
                        ["ReportedDate"]: date
                          ? getShowingMonthDateYear(adjustedDate)
                          : null,
                        ["OccurredFrom"]: null,
                        ["DispositionDate"]: null,
                        ["NIBRSclearancedate"]: null,
                      });

                      setOccuredFromDate(null);
                    }
                  } else {
                    // If date is cleared (null or undefined), reset all fields
                    setReportedDate(null);
                    setIncidentReportedDate(null);
                    setOccuredFromDate(null);

                    setValue({
                      ...value,
                      ["ReportedDate"]: null,
                      ["OccurredFrom"]: null,
                      ["DispositionDate"]: null,
                      ["NIBRSclearancedate"]: null,
                    });
                  }
                }}
                maxDate={datezone ? new Date(datezone) : null}
                filterTime={(date) => filterPassedTimeZone(date, datezone)}
                selected={reportedDate}
                disabled={nibrsSubmittedIncident === 1 || incidentID}
                className={
                  nibrsSubmittedIncident === 1 || incidentID ? "readonlyColor" : "requiredColor"
                }
                // className={nibrsSubmittedIncident === 1 ? "LockFildsColor" : incidentID ? "readonlyColor" : "requiredColor"}
                timeInputLabel
                placeholderText="Select..."
                showTimeSelect
                timeIntervals={1}
                timeCaption="Time"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                showDisabledMonthNavigation
                autoComplete="off"
                timeFormat="HH:mm "
                is24Hour
                minDate={new Date(1991, 0, 1)}
              />
            )}
          </div>
          <div className="col-3 col-md-3 col-lg-4  ">
            <span data-toggle="modal" onClick={() => { setOpenPage("Incident Receive Source"); }} data-target="#ListModel" className="new-link px-0">How Reported</span>
          </div>
          <div className="col-9 col-md-9 col-lg-3">
            <Select
              name="ReceiveSourceID"
              value={receiveSourceDrpData?.filter(
                (obj) => obj.value === value?.ReceiveSourceID
              )}
              isClearable
              options={receiveSourceDrpData}
              menuPlacement="bottom"
              onChange={(e) => ChangeDropDown(e, "ReceiveSourceID")}
              placeholder="Select..."
              styles={customStylesWithOutColor}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 ">
            <label htmlFor="" className="new-label px-0 mb-0">
              Occurred From Date/Time
            </label>
          </div>
          <div className="col-9 col-md-9 col-lg-3 ">
            <DatePicker
              ref={startRef1}
              onKeyDown={(e) => {
                if (
                  !(
                    (e.key >= "0" && e.key <= "9") ||
                    e.key === "Backspace" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === "Delete" ||
                    e.key === ":" ||
                    e.key === "/" ||
                    e.key === " " ||
                    e.key === "F5"
                  )
                ) {
                  e.preventDefault();
                } else {
                  onKeyDown(e);
                }
              }}
              name="OccurredFrom"
              id="OccurredFrom"
              onChange={(date, e) => {
                if (date) {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                  const now = new Date();
                  let newDate = new Date(date); // Clone selected date

                  // Set current time if time is not selected (or is default midnight)
                  if (
                    newDate.getHours() === 0 &&
                    newDate.getMinutes() === 0 &&
                    newDate.getSeconds() === 0 &&
                    newDate.getMilliseconds() === 0
                  ) {
                    newDate.setHours(now.getHours());
                    newDate.setMinutes(now.getMinutes());
                    newDate.setSeconds(now.getSeconds());
                    newDate.setMilliseconds(now.getMilliseconds());
                  }

                  const isSameDay =
                    newDate?.getDate() === reportedDate?.getDate() &&
                    newDate?.getMonth() === reportedDate?.getMonth() &&
                    newDate?.getFullYear() === reportedDate?.getFullYear();

                  // Only apply reportedTime if newDate is greater than reportedTime
                  if (
                    isSameDay &&
                    newDate?.getTime() > reportedTime?.getTime()
                  ) {
                    newDate?.setHours(reportedTime?.getHours());
                    newDate?.setMinutes(reportedTime?.getMinutes());
                    newDate?.setSeconds(reportedTime?.getSeconds());
                    newDate?.setMilliseconds(reportedTime?.getMilliseconds());
                  }

                  // Additional guard if selected time is still more than reportedTime
                  if (newDate?.getTime() > reportedTime?.getTime()) {
                    if (
                      newDate?.getDate() === now?.getDate() &&
                      newDate?.getMonth() === now?.getMonth() &&
                      newDate?.getFullYear() === now.getFullYear()
                    ) {
                      newDate?.setDate(reportDate);
                      newDate?.setMonth(reportMonth);
                      newDate?.setFullYear(reportedTime.getFullYear());
                    } else {
                      newDate?.setDate(reportDate);
                      newDate?.setMonth(reportMonth);
                      newDate?.setFullYear(reportedTime.getFullYear());
                      newDate?.setTime(reportTime);
                    }
                  }

                  setValue({
                    ...value,
                    ["OccurredFrom"]: newDate
                      ? getShowingMonthDateYear(newDate)
                      : null,
                    ["OccurredTo"]: null,
                  });
                  setOccuredFromDate(newDate);
                  setOccuredToDate(null);
                } else {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                  setOccuredFromDate(null);
                  setOccuredToDate(null);
                  setValue({
                    ...value,
                    ["OccurredFrom"]: null,
                    ["OccurredTo"]: null,
                  });
                }
              }}
              isClearable
              dateFormat="MM/dd/yyyy HH:mm"
              placeholderText="Select..."
              selected={occuredFromDate}
              maxDate={new Date(reportedDate)}
              filterTime={filterPassed}
              timeInputLabel
              showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              showDisabledMonthNavigation
              autoComplete="off"
              timeFormat="HH:mm"
              is24Hour={true}
              className={` ${(nibrsSubmittedIncident === 1 && incidentID) || !value.ReportedDate ? "readonlyColor" : ""}`}
              // className={nibrsSubmittedIncident === 1 ? "LockFildsColor" : incidentID || !value.ReportedDate ? "readonlyColor" : ""}
              disabled={(nibrsSubmittedIncident === 1 && incidentID) || !value.ReportedDate}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-4  ">
            <label htmlFor="" className="new-label mb-0">
              Occurred To Date/Time
            </label>
          </div>
          <div className="col-7  col-md-7 col-lg-3 ">
            <DatePicker
              ref={startRef2}
              onKeyDown={(e) => {
                if (
                  !(
                    (e.key >= "0" && e.key <= "9") ||
                    e.key === "Backspace" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === "Delete" ||
                    e.key === ":" ||
                    e.key === "/" ||
                    e.key === " " ||
                    e.key === "F5"
                  )
                ) {
                  e.preventDefault();
                } else {
                  onKeyDown(e);
                }
              }}
              id="OccurredTo"
              name="OccurredTo"
              onChange={(date) => {
                const isSameDate = (date1, date2) => {
                  return (
                    date1.getFullYear() === date2.getFullYear() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getDate() === date2.getDate()
                  );
                };

                if (date) {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                  const maxTime = datezone ? new Date(datezone) : null;
                  const minTime = occuredFromDate ? new Date(occuredFromDate) : null;
                  let selectedDate = new Date(date);
                  if (maxTime && isSameDate(selectedDate, maxTime)) {
                    if (!selectedDate.getHours() && !selectedDate.getMinutes()) {
                      selectedDate.setHours(maxTime.getHours());
                      selectedDate.setMinutes(maxTime.getMinutes());
                      selectedDate.setSeconds(maxTime.getSeconds());
                      selectedDate.setMilliseconds(maxTime.getMilliseconds());
                    }
                  }
                  else if (minTime && isSameDate(selectedDate, minTime)) {
                    if (!selectedDate.getHours() && !selectedDate.getMinutes()) {
                      const newTime = new Date(minTime.getTime() + 60000);
                      selectedDate.setHours(newTime.getHours());
                      selectedDate.setMinutes(newTime.getMinutes());
                      selectedDate.setSeconds(newTime.getSeconds());
                      selectedDate.setMilliseconds(newTime.getMilliseconds());
                    }
                  }
                  else {
                    if (maxTime && selectedDate.getTime() > maxTime.getTime()) {
                      selectedDate.setHours(maxTime.getHours());
                      selectedDate.setMinutes(maxTime.getMinutes());
                      selectedDate.setSeconds(maxTime.getSeconds());
                      selectedDate.setMilliseconds(maxTime.getMilliseconds());
                    } else if (minTime && selectedDate.getTime() < minTime.getTime()) {
                      selectedDate = new Date(minTime.getTime() + 60000);
                    }
                  }
                  if (minTime && selectedDate.getTime() < minTime.getTime()) {
                    selectedDate = new Date(minTime.getTime() + 60000);
                  }
                  if (maxTime && selectedDate.getTime() > maxTime.getTime()) {
                    selectedDate.setHours(maxTime.getHours());
                    selectedDate.setMinutes(maxTime.getMinutes());
                    selectedDate.setSeconds(maxTime.getSeconds());
                    selectedDate.setMilliseconds(maxTime.getMilliseconds());
                  }
                  setValue({
                    ...value,
                    ["OccurredTo"]: selectedDate
                      ? getShowingMonthDateYear(selectedDate)
                      : null,
                  });
                  setOccuredToDate(selectedDate);
                } else {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                  setValue({ ...value, ["OccurredTo"]: null });
                  setOccuredToDate(null);
                }
              }}

              dateFormat="MM/dd/yyyy HH:mm"
              className={` ${(nibrsSubmittedIncident === 1 && incidentID) ? 'readonlyColor' : ''}`}
              // className={`${(nibrsSubmittedIncident === 1 && incidentID) || !value?.OccurredFrom ? "readonlyColor" : ""}`}
              // className={nibrsSubmittedIncident === 1 ? "LockFildsColor" : incidentID || !value.OccurredFrom ? "readonlyColor" : ""}
              disabled={
                (nibrsSubmittedIncident === 1 && incidentID) ||
                (!value?.OccurredFrom && true)
              }
              timeInputLabel
              isClearable
              selected={value?.OccurredTo ? new Date(value.OccurredTo) : null}
              placeholderText={
                value?.OccurredTo ? value.OccurredTo : "Select..."
              }
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={
                occuredFromDate
                  ? getMinTimeForOccurredTo(occuredFromDate)
                  : null
              }
              maxDate={getMaxTimeForOccurredTo(datezone)}
              showDisabledMonthNavigation
              showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
              autoComplete="Off"
              timeFormat="HH:mm "
              is24Hour
              filterTime={(time) =>
                filterTimeAfterOccurredFromAndBeforeMaxDate(
                  time,
                  occuredFromDate,
                  datezone
                )
              }
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 ">
            <label htmlFor="" className="new-label mb-0">
              Crime Location
              {errors.CrimeLocationError !== "true" ? (
                <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                  {errors.CrimeLocationError}
                </p>
              ) : null}
            </label>
          </div>
          <div className="col-6  col-md-6 col-lg-8 text-field mt-0 ">
            <Location
              {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus, }}
              col="CrimeLocation"
              locationID="crimelocationid"
              check={true}
              verify={value.IsVerify}
              style={{ resize: "both" }}
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 d-flex align-items-center">
            <div className="form-check custom-control custom-checkbox">
              <input className="custom-control-input" data-toggle="modal" data-target="#VerifyModal" type="checkbox" id="flexCheckDefault" name="IsVerify" value={value?.IsVerify}
                checked={value?.IsVerify || !value?.crimelocationid}
                onChange={HandleChange}
                style={{ cursor: "pointer" }}
              />
              <label className="custom-control-label " htmlFor="flexCheckDefault" style={{ fontSize: "14px" }}>Verify</label>
            </div>

            {!value?.IsVerify && addVerifySingleData.length > 0 ? (
              <i className="fa fa-edit pl-3  " data-toggle="modal" data-target="#VerifyModal" style={{ cursor: "pointer", backgroundColor: "" }}
                onClick={() => {
                  if (value.crimelocationid) {
                    get_Add_Single_Data(value.crimelocationid);
                    setModalStatus(true);
                  }
                }}
              >
                {" "}
                Edit{" "}
              </i>
            ) : (
              <></>
            )}

          </div>
          <div className="col-3 col-md-3 col-lg-2  ">
            <span className="new-label mb-0">
              Offense Type
              {errors.OffenceTypeError !== "true" ? (
                <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                  {errors.OffenceTypeError}
                </p>
              ) : null}
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-3 ">
            <Select
              name="OffenseId"
              styles={Requiredcolour}
              value={offenseIdDrp?.filter((obj) => obj.value === value?.OffenseTypeID)}
              isClearable
              options={offenseIdDrp}
              onChange={(e) => onChangeOffenceType(e, "OffenseTypeID")}
              placeholder="Select..."
            />
          </div>
          <div className="col-3 col-md-3 col-lg-4 ">
            <span className="new-label mb-0">
              Primary Officer
              {errors.PrimaryOfficerIdError !== "true" ? (
                <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                  {errors.PrimaryOfficerIdError}
                </p>
              ) : null}
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-3  ">
            <Select
              name="PrimaryOfficerID"
              styles={IncSta === true || IncSta === "true" ? diableColourStyles : Requiredcolour}
              value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
              isClearable
              options={agencyOfficerDrpData}
              isDisabled={IncSta === true || IncSta === "true" ? true : false}
              onChange={(e) => ChangeDropDown(e, "PrimaryOfficerID")}
              placeholder="Select..."
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2  ">
            <span className="new-label mb-0">CAD CFS Code</span>
          </div>
          <div className="col-9 col-md-9 col-lg-3">
            <Select
              name="CADCFSCodeID"
              value={cadCfsCodeDrpData?.filter(
                (obj) => obj.value === value?.CADCFSCodeID
              )}
              isClearable
              menuPlacement="bottom"
              options={cadCfsCodeDrpData}
              onChange={(e) => ChangeDropDown(e, "CADCFSCodeID")}
              placeholder="Select..."
              styles={customStylesWithOutColor}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-4">
            <span className="new-label">CAD Disposition</span>
          </div>
          <div className="col-9 col-md-9 col-lg-3 ">
            <Select
              name="CADDispositionId"
              value={cadDispositionDrpData?.filter((obj) => obj.value === value?.CADDispositionId)}
              isClearable
              menuPlacement="bottom"
              options={cadDispositionDrpData}
              onChange={(e) => ChangeDropDown(e, "CADDispositionId")}
              placeholder="Select..."
              styles={customStylesWithOutColor}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 ">
            <span
              data-toggle="modal"
              data-target="#ListModel"
              onClick={() => {
                setOpenPage("Incident Disposition");
              }}
              className="new-link "
            >
              Exceptional Clearance (Yes/No)
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-3 ">
            <Select
              name="RMSDispositionId"
              value={rmsDispositionDrpData?.filter((obj) => obj.value === value?.RMSDispositionId)}
              isDisabled={adultArrestStatus}
              // isDisabled={true}
              isClearable
              options={rmsDispositionDrpData}
              onChange={(e) => onChangeExceptionalClearance(e, "RMSDispositionId")}
              placeholder="Select..."
              styles={customStylesWithOutColor}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-4 ">
            <label className='new-label mb-0'>Use of Force Applied</label>
          </div>
          <div className="col-9 col-md-9 col-lg-3 ">
            <Select
              name='isPoliceForceApplied'
              styles={customStylesWithOutColor}
              value={policeForceDrpData?.filter((obj) => obj.value === value?.isPoliceForceApplied)}
              isClearable
              options={policeForceDrpData}
              onChange={(e) => {
                ChangeDropDown(e, 'isPoliceForceApplied');
                if (!e?.value) { setShowPoliceForce(false) }
                else { setShowPoliceForce(true); }
              }}
              placeholder="Select..."
            />
            {isEnabled && (
              <span
                onMouseEnter={() => setIsHoveredUseOfForce(true)}
                onMouseLeave={() => setIsHoveredUseOfForce(false)}
                onClick={() => setShowIncPage('PoliceForce')}
                style={{
                  color: isHoveredUseOfForce ? 'blue' : 'red',
                  transition: 'background-color 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <u>Enter Details in Use of Force</u>
              </span>
            )}
          </div>
          <div className="col-3 col-md-3 col-lg-2">
            <span
              data-toggle="modal"
              data-target="#ListModel"
              className="new-link "
            >
              <span onClick={() => { setOpenPage("Cleared Exceptionally"); }}>
                Exceptional Clearance Code
              </span>
              {errors.ExceptionalClearaceError !== "true" ? (
                <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                  {errors.ExceptionalClearaceError}
                </p>
              ) : null}
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-3">
            <Select
              name="NIBRSClearanceID"
              value={exceptionalClearID?.filter(
                (obj) => obj.value === value?.NIBRSClearanceID
              )}
              isClearable
              options={exceptionalClearID}
              onChange={(e) => onChangeExceptionalClearanceCode(e, "NIBRSClearanceID")}
              placeholder="Select..."
              isDisabled={clsDrpCode === "01" ? false : true}
              styles={getExceptionColorCode(clsDrpCode, value?.NIBRSClearanceID)}
            />
          </div>
          <div className="col-5 col-md-5 col-lg-4 ">
            <label htmlFor="" className="new-label mb-0 ">
              Exceptional Clearance Date/Time{" "}
              {errors.NIBRSclearancedateError !== "true" ? (
                <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }}>
                  {errors.NIBRSclearancedateError}
                </p>
              ) : null}
            </label>
          </div>
          <div className="col-7 col-md-7 col-lg-3 ">
            <DatePicker
              name="NIBRSclearancedate"
              id="NIBRSclearancedate"

              className={
                nibrsSubmittedIncident === 1 && incidentID ? "readonlyColor" : clsDrpCode === "01"
                  ?
                  value?.NIBRSclearancedate ? "nibrsSuccessColor" : value?.NIBRSClearanceID && exClsDateCode !== "N" ? "nibrsColor" : "readonlyColor"
                  :
                  "readonlyColor"
              }
              disabled={
                value?.NIBRSClearanceID && exClsDateCode !== "N" ? false : true
              }

              onChange={(date) => {
                if (date) {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                  if (date > new Date(datezone)) {
                    date = new Date(datezone);
                  }

                  const maxDate = new Date(datezone);
                  maxDate.setHours(23, 59, 59, 999); // Set max time to 23:59:59.999

                  if (date >= new Date()) {
                    setValue({
                      ...value,
                      ["NIBRSclearancedate"]: new Date()
                        ? getShowingDateText(new Date())
                        : null,
                    });
                  } else if (date <= reportedDate) {
                    setValue({
                      ...value,
                      ["NIBRSclearancedate"]: reportedDate
                        ? getShowingDateText(reportedDate)
                        : null,
                    });
                  } else {
                    if (date.getTime() === maxDate.getTime()) {
                      // If the selected date is the max date, set the time to 23:59
                      setValue({
                        ...value,
                        ["NIBRSclearancedate"]: getShowingDateText(maxDate),
                      });
                    } else {
                      setValue({
                        ...value,
                        ["NIBRSclearancedate"]: date
                          ? getShowingDateText(date)
                          : null,
                      });
                    }
                  }
                } else {
                  !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                  setValue({ ...value, ["NIBRSclearancedate"]: null });
                }
              }}
              ref={startRef4}
              onKeyDown={(e) => {
                if (
                  !(
                    (e.key >= "0" && e.key <= "9") ||
                    e.key === "Backspace" ||
                    e.key === "ArrowLeft" ||
                    e.key === "ArrowRight" ||
                    e.key === "Delete" ||
                    e.key === ":" ||
                    e.key === "/" ||
                    e.key === " " ||
                    e.key === "F5"
                  )
                ) {
                  e.preventDefault();
                } else {
                  onKeyDown(e);
                }
              }}
              selected={
                value?.NIBRSclearancedate && new Date(value?.NIBRSclearancedate)
              }
              placeholderText={
                value?.NIBRSclearancedate
                  ? value?.NIBRSclearancedate
                  : "Select..."
              }
              dateFormat="MM/dd/yyyy HH:mm"
              timeFormat="HH:mm "
              is24Hour
              timeInputLabel
              isClearable={value?.NIBRSclearancedate ? true : false}
              autoComplete="Off"
              // peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              showTimeSelect
              timeIntervals={1}
              minDate={reportedDate}
              maxDate={new Date(datezone)}
              filterTime={(date) =>
                filterPassedTimeZoneException(date, datezone, reportedDate)
              }
            />
          </div>

          <div className="col-3 col-md-3 col-lg-2 ">
            <label htmlFor="" className="new-label mb-0">
              TIBRS Submission Date/Time
            </label>
          </div>
          <div className="col-9 col-md-9 col-lg-3">
            <DatePicker
              name="BIBRSDate"
              id="BIBRSDate"
              open={false}
              className={"readonlyColor"}
              ref={startRef3}
              onKeyDown={onKeyDown}
              dateFormat="MM/dd/yyyy HH:mm"
              selected={value?.BIBRSDate && new Date(value.BIBRSDate)}
              placeholderText={"Select.."}
              timeInputLabel
              isClearable={false}
              disabled={true}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
              minDate={reportedDate}
              maxDate={datezone ? new Date(datezone) : null}
              filterTime={(date) => filterPassedTimeZone(date, datezone)}
            />
          </div>
          <div className="col-3 col-md-3 col-lg-4 ">
            <label htmlFor="" className="new-label mb-0">
              TIBRS Status{" "}
            </label>
          </div>
          <div className="col-9 col-md-9 col-lg-3 ">
            <input type="text" name="NIBRSStatus" id="NIBRSStatus" className={`form-control py-1 new-input `} disabled style={{ height: '35px' }} />
          </div>


          <div className="col-3 col-md-3 col-lg-2 ">
            <label className="new-label mb-0">Print Format</label>
          </div>
          <div className="col d-flex align-items-center">
            {/* Normal Report */}
            <label className="d-flex align-items-center me-4 mb-0" style={{ gap: "6px" }}>
              <input
                type="radio"
                value="false"
                name="status"
                checked={isPreviewNormalReport}
                onChange={() => { setIsPreviewNormalReport(true) }}
              />

              <span>Normal Report</span>
            </label>

            {/* Redacted Report */}
            <label className="d-flex align-items-center mb-0" style={{ marginLeft: "18px", gap: "6px" }}>
              <input
                type="radio"
                value="true"
                name="status"
                checked={!isPreviewNormalReport}
                onChange={() => { setIsPreviewNormalReport(false) }}
              />
              <span>Redacted Report</span>
            </label>
          </div>

          {carboTheft ? (
            <>
              <div className="col-2 col-md-2 col-lg-2" style={{ display: "flex", flexDirection: "column" }}>
                <div>   {" "}
                  <span className="new-label">
                    Did the incident involve Cargo theft
                    {errors.CargoTheftError !== "true" ? (
                      <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }} > {errors.CargoTheftError}</p>
                    ) : null}
                  </span>
                </div>
              </div>
              <div className="col-6 col-md-6 col-lg-2 ">
                <Select
                  name="IsCargoTheftInvolved"
                  value={YesNoArr?.filter((obj) => obj.value === value?.IsCargoTheftInvolved)}
                  options={YesNoArr}
                  menuPlacement="bottom"
                  onChange={(e) => OnChangeCargoTheft(e, "IsCargoTheftInvolved")}
                  isClearable={value?.IsCargoTheftInvolved ? true : false}
                  placeholder="Select..."
                  styles={value?.IsCargoTheftInvolved || value?.IsCargoTheftInvolved === false ? nibSuccessStyles : nibrscolourStyles}
                />
              </div>
            </>
          ) : (
            <>
              {/* Empty fillers to occupy the same space */}
              <div className="col-2 col-md-2 col-lg-2 d-none d-lg-block"></div>
              <div className="col-6 col-md-6 col-lg-2 d-none d-lg-block"></div>
            </>
          )}


        </div>
      </div>







      <div className="col-12 text-right mt-2 d-flex justify-content-between">
        <div>
          {IncSta === true || IncSta === "true" ? (
            <>
              <button
                type="button"
                onClick={() => {
                  nibrsValidateInc(incidentID, value?.ReportedDate, baseDate, oriNumber);
                  setNibIncScreen(true);
                  setNibrsErrModalStatus(true);
                  setoffenseClick(false);
                }}
                data-toggle={"modal"}
                data-target={"#NibrsErrorShowModal"}
                className={`btn text-white btn-sm mr-2`}
                style={{ backgroundColor: `${nibrsValidateIncidentData.length > 0 ? nibrsValidIncScreen ? "green" : "red" : "teal"}` }}
              >
                Validate Incident Screen
              </button>
              <button
                type="button"
                onClick={() => {
                  nibrsValidateInc(incidentID, value?.ReportedDate, baseDate, oriNumber);
                  setNibIncScreen(false);
                  setNibrsErrModalStatus(true);
                  setoffenseClick(false);
                }}
                data-toggle={"modal"}
                data-target={"#NibrsErrorShowModal"}
                className={`btn text-white btn-sm mr-2`}
                style={{ backgroundColor: `${nibrsValidateIncidentData?.length > 0 ? nibrsValidAllIncModule ? "green" : "red" : "teal"}` }}
              >
                Validate TIBRS Incident
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        {offenseStatus && (
          <div className="text-center p-1 mt-2">
            <span
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                border: '1px solid red', backgroundColor: '#ffe6e6', color: isHovered ? 'blue' : 'red',
                padding: '3px', borderRadius: '4px', display: 'inline-block',
                transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '15px',
              }}
              onClick={() => navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${0}&OffSta=${false}`)}
            >
              This Incident does not have any TIBRS reportable Crime(s)
            </span>
          </div>
        )}
        <div>
          {IncSta === true || IncSta === "true" ? effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
            <>
              {stateReportID == "SA" || stateReportID == "FV" || stateReportID == "HC" ? (
                <>
                </>
              )
                :
                (
                  <></>
                )}
              <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={(e) => check_Validation_Error()} >{" "}Update{" "}</button>
              <button
                type="button"
                className="btn btn-sm btn-success mr-4"
                data-toggle="modal"
                data-target="#CurrentIncidentReport"
                onClick={() => {
                  setShowModal(true);
                  setIncMasterReport(true);
                  setIncReportCount(IncReportCount + 1);
                }}
              >
                Print <i className="fa fa-print"></i>
              </button>
            </>
            :
            <></>
            :
            <>
              {stateReportID == "SA" ||
                stateReportID == "FV" ||
                stateReportID == "HC" ? (
                <>
                </>
              ) : (
                <></>
              )}
              <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}  >
                {" "}
                Update{" "}
              </button>
              <button type="button" className="btn btn-sm btn-success mr-4" data-toggle="modal" data-target="#QueueReportsModal" onClick={() => { setShowModal(true); setIncMasterReport(true); setIncReportCount(IncReportCount + 1); }}>
                Print <i className="fa fa-print"></i>
              </button>
            </>
            :
            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
              <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>
                {" "}
                Save{" "}
              </button>
              :
              <></>
              :
              <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>
                {" "}
                Save{" "}
              </button>
          }
          <button type="button" className="btn btn-sm btn-success mr-4" onClick={() => { OnClose(); }} data-toggle={changesStatus ? "modal" : ""}
            data-target={changesStatus ? "#SaveModal" : ""}
          >
            Close
          </button>
          {/* {
            value?.CaseStatusCode === "C" && (
              <button type="button" data-toggle="modal" data-target="#CloseHistoryModal" className="btn btn-sm btn-success mr-1" onClick={(e) => {
                setassignModelShow(true);
              }}
              >
                Reopen
              </button>
            )
          } */}
        </div>
      </div>

      <GeoLocationInfoModal {...{ openLocationInformationModal, setOpenLocationInformationModal, setSelectedButton, geoFormValues, setGEOFormValues, isGoogleLocation, createLocationPayload, isVerifyLocation, geoLocationID, isCheckGoogleLocation, setIsVerifyReportedLocation, setGeoLocationID }} />

      <CloseHistoryModal
        incidentID={incidentID}
        assignModelShow={assignModelShow}
        setassignModelShow={setassignModelShow}
        GetEditData={GetEditData}
      />

      <VerifyLocation
        {...{
          loginAgencyID,
          modalStatus,
          setModalStatus,
          value,
          setValue,
          addVerifySingleData,
          get_Add_Single_Data,
          setOnSelectLocation,
          setStatesChangeStatus,
        }}
      />

      <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
      <ListModal {...{ openPage, setOpenPage }} />
      <MessageModelIncident
        clsDrpCode={clsDrpCode}
        setToResetData={setToResetData}
        IncidentNumber={value?.IncidentNumber}
        incidentID={incidentID}
        IncSta={IncSta}
      />

      <NirbsErrorShowModal
        ErrorText={
          nibIncScreen ? incValidateErrStr : incAllModuleValidateErrStr
        }
        nibErrModalStatus={nibrsErrModalStatus}
        setNibrsErrModalStatus={setNibrsErrModalStatus}
        nibrsValidateloder={nibrsValidateloder}
        OffenseState={OffenseState}
        offenseClick={offenseClick}
      />
      <CurrentIncMasterReport
        incNumber={value.IncidentNumber}
        incidentID={IncID}
        isRedactedReport={!isPreviewNormalReport}
        {...{
          printIncReport,
          setIncMasterReport,
          showModal,
          setShowModal,
          IncReportCount,
          setIncReportCount,
        }}
      />
      {/* <IdentifyFieldColor /> */}
    </>
  ) : (
    <Loader />
  );
};

export default IncidentHome;

const Get_Exceptional_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) => sponsor.RMSDispositionId);
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor?.value === result[0]) {
      return { value: result[0], label: sponsor?.label, id: sponsor?.id };
    }
  });
  const val = result2?.filter(function (element) {
    return element !== undefined;
  });
  return val ? val[0]?.id : null;
};

const Get_OffenseType_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) => sponsor.OffenseTypeID);

  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id };
    }
  });

  const val = result2?.filter(function (element) {
    return element !== undefined;
  });
  return val ? val[0]?.id : null;
};

const Get_ExClsDate_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) => sponsor.NIBRSClearanceID);
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id };
    }
  });
  const val = result2?.filter(function (element) {
    return element !== undefined;
  });
  return val ? val[0]?.id : null;
};

export const changeArrayFormat = (data, type) => {
  if (type === "zip") {
    const result = data?.map((sponsor) => ({
      value: sponsor.zipId,
      label: sponsor.Zipcode,
    }));
    return result;
  }
  if (type === "state") {
    const result = data?.map((sponsor) => ({
      value: sponsor.StateID,
      label: sponsor.StateName,
    }));
    return result;
  }
  if (type === "city") {
    const result = data?.map((sponsor) => ({
      value: sponsor.CityID,
      label: sponsor.CityName,
    }));
    return result;
  }

  if (type === "RmsCfsID") {
    const result = data?.map((sponsor) => ({
      value: sponsor.RMSCFSCodeID,
      label: sponsor.RMSCFSCode,
    }));
    return result;
  }
  if (type === "RmsDisposition") {
    const result = data?.map((sponsor) => ({
      value: sponsor.IncidentDispositionsID,
      label: sponsor.RMSDispositionCode,
    }));
    return result;
  }
  if (type === "ExceptionClearID") {
    const result = data?.map((sponsor) => ({
      value: sponsor.ClearanceID,
      label: sponsor.ClearanceCode,
    }));
    return result;
  }
  if (type === "ReciveSrcID") {
    const result = data?.map((sponsor) => ({
      value: sponsor.ReceiveSourceID,
      label: sponsor.ReceiveSourceCode,
    }));
    return result;
  }
};

export const changeArrayFormat_WithFilter = (data, type, DropDownValue) => {
  if (DropDownValue) {
    if (type === "CADCFSCodeID") {
      const result = data?.map((sponsor) => sponsor.CADCFSCodeID);
      const result2 = DropDownValue?.map((sponsor) => {
        if (sponsor.value === result[0]) {
          return { value: result[0], label: sponsor.label };
        }
      });
      const val = result2?.filter(function (element) {
        return element !== undefined;
      });
      return val ? val[0] : null;
    }
  }
};

const CloseHistoryModal = (props) => {
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const localStoreData = useSelector((state) => state?.Agency?.localStoreData);
  const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

  const { incidentID, GetEditData, assignModelShow, setassignModelShow } = props;

  const dispatch = useDispatch();
  const uniqueId = sessionStorage.getItem("UniqueUserID") ? Decrypt_Id_Name(sessionStorage.getItem("UniqueUserID"), "UForUniqueUserID") : "";

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param),
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [loginPinID, setLoginPinID] = useState();
  const [value, setValue] = useState({
    CommentsDoc: "",
    IncidentId: "",
    Comments: "",
    ReportedByPINActivityID: null,
    CreatedByUserFK: "",
    ModifiedByUserFK: "",
    OfficerID: "",
    IncidentID: "",
  });

  const [errors, setErrors] = useState({
    CommentsError: "",
  });

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID));
      if (narrativeTypeDrpData?.length === 0) {
        dispatch(get_Narrative_Type_Drp_Data(loginAgencyID));
      }
    }
  }, [localStoreData, IncID]);

  // const colourStyles = {
  //   control: (styles) => ({
  //     ...styles,
  //     backgroundColor: "#fce9bf",
  //     height: 20,
  //     minHeight: 35,
  //     fontSize: 14,
  //     margintop: 2,
  //     boxShadow: 0,
  //   }),
  // };

  const check_Validation_ErrorComments = () => {
    if (RequiredFieldIncident(value.Comments)) {
      setErrors((prevValues) => {
        return {
          ...prevValues,
          ["CommentsError"]: RequiredFieldIncident(value.Comments),
        };
      });
    }
  };

  const { CommentsError } = errors;

  useEffect(() => {
    if (CommentsError === "true") {
      submit();
    }
  }, [CommentsError]);

  const submit = () => {
    const { Comments, CreatedByUserFK, IncidentID } = value;
    const val = {
      Comments: Comments,
      IncidentID: incidentID,
      CreatedByUserFK: loginPinID,
      NIBRSStatus: "Reopen",
    };
    AddDeleteUpadate(
      "IncidentCloseHistory/Insert_IncidentCloseHistory",
      val
    ).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;
      toastifySuccess(message);
      setassignModelShow(false);
      resetComments();
    });
  };

  const resetComments = () => {
    setValue({
      ...value,
      Comments: "",
    });
    setErrors({ ...errors, ["CommentsError"]: "" });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (event) {
      // console.log("handleChange running")
      setValue((prevState) => ({ ...prevState, [name]: value }));
    } else {
      // console.log("handleChange running")

      setValue((prevState) => ({ ...prevState, [name]: null }));
    }
  };

  return (
    <>
      {assignModelShow && (
        <div
          class="modal fade"
          style={{ background: "rgba(0,0,0, 0.5)" }}
          id="CloseHistoryModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-2 px-4 approvedReportsModal">
              <div className="d-flex justify-content-between">
                <h5 className="fw-bold">Assign Report</h5>
                <button
                  className="btn-close b-none bg-transparent text-right"
                  data-dismiss="modal"
                >
                  X
                </button>
              </div>
              <div className="d-flex ">
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col-9 col-md-9 col-lg-6 text-field mt-1">
                      <textarea
                        type="text"
                        name="Comments"
                        cols="35"
                        rows="3"
                        value={value.Comments}
                        className="requiredColor"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      ></textarea>
                      {errors.CommentsError !== "true" ? (
                        <p
                          style={{
                            color: "red",
                            fontSize: "11px",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          {errors.CommentsError}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {/* Alert Box (newly added) */}
                </div>
              </div>
              {/* btn-sm btn-success */}
              <div
                className="col-6 col-md-4 col-lg-12 mt-2 d-flex text-right "
                style={{ justifyContent: "flex-end" }}
              >
                <button
                  type="button"
                  style={{ backgroundColor: "#001f3f", color: "#fff" }}
                  className="btn  mr-1 mb-2"
                  onClick={() => check_Validation_ErrorComments()}
                >
                  Save
                </button>
                <button
                  type="button"
                  style={{ border: " 1px solid#001f3f", color: "#001f3f" }}
                  data-dismiss="modal"
                  onClick={() => {
                    resetComments();
                    setassignModelShow(false);
                  }}
                  className="btn  pl-2 mb-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
