import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {
  Decrypt_Id_Name, DecryptedList, EncryptedList, LockFildscolour, Requiredcolour, base64ToString,
  getShowingMonthDateYear, getShowingWithOutTime,
  nibrscolourStyles,
  stringToBase64, tableCustomStyles,
} from "../../../../Common/Utility";
import { AddDeleteUpadate, ScreenPermision, fetchPostData, fetchPostDataNibrs } from "../../../../hooks/Api";
import { Comman_changeArrayFormat, modifiedFbiCodeArray, threeColArray, threeColArrayWithCode } from "../../../../Common/ChangeArrayFormat";
import { toastifyError, toastifySuccess } from "../../../../Common/AlertMsg";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { RequiredFieldIncident, RequiredFieldIncidentCarboTheft, RequiredForYesNo } from "../../../Utility/Personnel/Validation";
import ChangesModal from "../../../../Common/ChangesModal";
import {
  AttemptCompleteError, check_NibrsCode_09C, check_Valid_Nibrs_Code, chekLocationType, CyberspaceLocationError, ErrorTooltip, MethodOFEntryMandataryError, TableErrorTooltip, ValidateNibrsCodeError,
} from "../ErrorNibrs";
import DataTable from "react-data-table-component";
import DeletePopUpModal from "../../../../Common/DeleteModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { get_Inc_ReportedDate, get_LocalStoreData } from "../../../../../redux/actions/Agency";
import ListModal from "../../../Utility/ListManagementModel/ListModal";
import NirbsErrorShowModal from "../../../../Common/NirbsErrorShowModal";
import Loader from "../../../../Common/Loader";

const Home = ({ status, setStatus, setOffenceID, get_List, nibrsCode, setNibrsCode, setshowOffPage }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
  const uniqueId = sessionStorage.getItem("UniqueUserID") ? Decrypt_Id_Name(sessionStorage.getItem("UniqueUserID"), "UForUniqueUserID") : "";

  const { get_Offence_Count, updateCount, setUpdateCount, setChangesStatus, nibrsSubmittedStatus, setnibrsSubmittedStatus, nibrsSubmittedOffenseMain, setnibrsSubmittedOffenseMain, get_Offence_Data, changesStatus, get_Incident_Count, setIncidentStatus, setIncStatus, offenceFillterData, setcountoffaduit, PanelCode, setPanelCode,
    incidentCount, validate_IncSideBar
  } = useContext(AgencyContext);


  const PropertyCount = incidentCount[0]?.PropertyCount || 0;
  const PropertyDrugCount = incidentCount[0]?.PropertyDrugCount || 0;
  // Law Title
  const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
  //NIBRS Code
  const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
  // Offense Code/Name
  const [chargeCodeDrp, setChargeCodeDrp] = useState([]);

  const [offenderLeftSceneDrp, setOffenderLeftSceneDrp] = useState([]);
  const [categoryIdDrp, setCategoryIdDrp] = useState([]);
  const [locationIdDrp, setLocationIdDrp] = useState([]);
  const [editval, setEditval] = useState();
  const [crimeId, setCrimeId] = useState("");
  const [delCrimeId, setDelCrimeId] = useState("");
  const [mainIncidentID, setMainIncidentID] = useState("");
  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [loginPinID, setLoginPinID] = useState("");
  const [openPage, setOpenPage] = useState("");
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [primaryLocationCode, setPrimaryLocationCode] = useState("");
  const [gangInfoDrpVal, setGangInfoDrpVal] = useState([]);
  const [gangInfoVal, setGangInfoVal] = useState([]);
  const [chargedata, setChargedata] = useState([]);
  const [panelCode, setpanelCode] = useState('');
  const [DeleteshowCounts, SetDeleteshowCounts] = useState('');


  const [filteredOptions, setFilteredOptions] = useState(nibrsCodeDrp);
  const [methodEntryDrp, setMethodEntryDrp] = useState();

  // nibrs Validate Incident
  const [baseDate, setBaseDate] = useState("");
  const [oriNumber, setOriNumber] = useState("");
  const [nibrsValidateOffenseData, setnibrsValidateOffenseData] = useState([]);
  const [nibrsOffErrStr, setNibrsOffErrStr] = useState("");
  const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
  const [nibrsValidateloder] = useState(false);
  const [clickNibloder, setclickNibLoder] = useState(false);
  const [nibrsError, setnibrsError] = useState([]);

  const [attemptComplteStatus, setAttemptComplteStatus] = useState(false);

  const [locationTypeComplteStatus, setlocationTypeComplteStatus] = useState(false);
  const [locationTypeComplteError, setlocationTypeComplteError] = useState("");
  const [gangInformationStatus, setgangInformationStatus] = useState(false);
  const [gangInformationError, setgangInformationError] = useState("");
  const [methodOfEntryStatus, setmethodOfEntryStatus] = useState(false);
  const [methodOfEntryError, setmethodOfEntryError] = useState("");
  const [isCrimeAgainstPerson, setIsCrimeAgainstPerson] = useState(false);
  const [isCrimeAgainstProperty, setIsCrimeAgainstProperty] = useState(false);
  const [isCrimeAgainstSociety, setIsCrimeAgainstSociety] = useState(false);

  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({
    ChargeCodeID: "", NIBRSCodeId: null, OffenseCodeId: null, LawTitleId: null, OffenderLeftSceneId: null, CategoryId: null,
    PrimaryLocationId: null, SecondaryLocationId: null, FTADate: "", Fine: "", CourtCost: "", FTAAmt: "", LitigationTax: "", DamageProperty: "", OfRoomsInvolved: "", PremisesEntered: "", PropertyAbandoned: "", IsForceused: "", IsIncidentC: false, AttemptComplete: "", CrimeID: "", IncidentID: "", CreatedByUserFK: "", ModifiedByUserFK: "", IsDomesticViolence: "", IsGangInfo: "", CrimeMethodOfEntryID: "", Comments: "", IsCargoTheftInvolved: null,
  });

  const [errors, setErrors] = useState({
    NibrsIdError: "", ChargeCodeIDError: "", PremisesEnteredError: "", PrimaryLocationError: "", AttemptRequiredError: "", CommentsError: "",
    CargoTheftError: "",
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
  var IncSta = query?.get("IncSta");
  var OffId = query?.get("OffId");
  var OffSta = query?.get("OffSta");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));
  if (!OffId) OffId = 0;
  else OffId = parseInt(base64ToString(OffId));

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
      get_MethodOfEntry_DropDown(localStoreData?.AgencyID); setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null);
      setOriNumber(localStoreData?.ORI); get_Incident_Count(IncID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (IncID) {
      setValue({
        ...value,
        IncidentID: IncID, CreatedByUserFK: "", ChargeCodeID: "", NIBRSCodeId: null, OffenseCodeId: null, LawTitleId: null, OffenderLeftSceneId: null, CategoryId: null, PrimaryLocationId: null, SecondaryLocationId: null, FTADate: "", Fine: "", CourtCost: "", FTAAmt: "", LitigationTax: "", DamageProperty: "", OfRoomsInvolved: "", PremisesEntered: "", PropertyAbandoned: "", IsForceused: "",
        IsInciden: false, AttemptComplete: "", CrimeID: "", ModifiedByUserFK: "", Comments: "", IsCargoTheftInvolved: ''
      });
      get_Offence_Data(IncID); setMainIncidentID(IncID);
      if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)); }
    }
  }, [IncID]);

  // useEffect(() => {
  //   if (IncID && IncNo && offenceFillterData?.length > 0) {
  //     nibrsValidateOffense(IncID, IncNo);
  //   }
  // }, [IncID, IncNo, offenceFillterData]);

  useEffect(() => {
    if (OffId && (OffSta === true || OffSta === "true")) {
      setCrimeId(parseInt(OffId)); setOffenceID(parseInt(OffId)); GetSingleData(parseInt(OffId));
      get_Offence_Count(OffId);
    }
  }, [OffId, OffSta]);

  const nibrsCodeValue = ["09A", "09B", "100", "120", "11A", "11B", "11C", "11D", "13A", "13B", "13C"]

  const check_Validation_Error = (e) => {
    if (value?.SecondaryLocationId && value?.PrimaryLocationId === value?.SecondaryLocationId) {
      toastifyError("The primary location and secondary location cannot be the same.");
      return;
    }
    const NibrsIdErrorr = RequiredFieldIncident(value.NIBRSCodeId);
    const ChargeCodeIDErr = RequiredFieldIncident(value.ChargeCodeID);
    const PremisesEnteredErr = nibrsCode === "220" && (primaryLocationCode === "14" || primaryLocationCode === "19") && loginAgencyState === "TX" ? RequiredFieldIncident(value?.PremisesEntered) : "true";
    const PrimaryLocationErr = ((panelCode === "03" || panelCode === "07" || panelCode === "06") ? RequiredFieldIncident(value?.PrimaryLocationId) : check_Valid_Nibrs_Code(nibrsCode) ? "true" : RequiredFieldIncident(value?.PrimaryLocationId));
    const AttemptRequiredErr = RequiredFieldIncident(value?.AttemptComplete);
    const CommentsErr = nibrsCode === "11B" && loginAgencyState === "TX" ? RequiredFieldIncident(value?.Comments) : "true";
    const MethodEntryError = nibrsCode === '220' ? RequiredFieldIncident(value?.CrimeMethodOfEntryID) : 'true'
    // const CargoTheftErrorErr = carboTheft ? RequiredFieldIncidentCarboTheft(value.IsCargoTheftInvolved) : "true";
    // const CargoTheftErrorErr = RequiredFieldIncident(value.);
    const CargoTheftErrorErr = !nibrsCode === "220" || nibrsCode === "210" || nibrsCode === "120" || nibrsCode === "23D" || nibrsCode === "23F" || nibrsCode === "23H" || nibrsCode === "240" || nibrsCode === "26A" || nibrsCode === "26A" || nibrsCode === "23D" || nibrsCode === "26C" || nibrsCode === "26E" || nibrsCode === "26F" || nibrsCode === "26G" || nibrsCode === "270" || nibrsCode === "510" ? RequiredFieldIncident(value?.IsCargoTheftInvolved) : "true";


    setErrors((pre) => {
      return {
        ...pre,
        ["MethodEntryError"]: MethodEntryError || pre["MethodEntryError"],
        ["NibrsIdError"]: NibrsIdErrorr || pre["NibrsIdError"],
        ["ChargeCodeIDError"]: ChargeCodeIDErr || pre["ChargeCodeIDError"],
        ["PremisesEnteredError"]: PremisesEnteredErr || pre["PremisesEnteredError"],
        ["PrimaryLocationError"]: PrimaryLocationErr || pre["PrimaryLocationError"],
        ["AttemptRequiredError"]: AttemptRequiredErr || pre["AttemptRequiredError"],
        ["CommentsError"]: CommentsErr || pre["CommentsError"],
        ["CargoTheftError"]: CargoTheftErrorErr || pre["CargoTheftError"],
      };
    });
  };

  // Check All Field Format is True Then Submit
  const { ChargeCodeIDError, NibrsIdError, PremisesEnteredError, AttemptRequiredError, PrimaryLocationError, CommentsError, MethodEntryError, CargoTheftError } = errors;

  useEffect(() => {
    if (ChargeCodeIDError === "true" && NibrsIdError === "true" && PremisesEnteredError === "true" && AttemptRequiredError === "true" && PrimaryLocationError === "true" && CommentsError === "true" && MethodEntryError === 'true' && CargoTheftError === 'true') {
      if (OffId && (OffSta === true || OffSta === "true")) {
        Update_Offence();
      } else {
        Add_Offense();
      }
    }
  }, [ChargeCodeIDError, NibrsIdError, PremisesEnteredError, PrimaryLocationError, AttemptRequiredError, CommentsError, MethodEntryError, CargoTheftError]);

  const getScreenPermision = (LoginAgencyID, PinID) => {
    ScreenPermision("O036", LoginAgencyID, PinID).then((res) => {
      if (res) {
        setEffectiveScreenPermission(res); setPermissionForEdit(res[0]?.Changeok); setPermissionForAdd(res[0]?.AddOK);
        setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
      } else {
        setEffectiveScreenPermission([]); setPermissionForEdit(false); setPermissionForAdd(false); setaddUpdatePermission(false);
      }
    });
  };

  // ---- DS 
  const handleInputChange = (inputValue) => {
    if (inputValue) {
      const filtered = nibrsCodeDrp.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  const GetSingleData = (crimeId) => {
    const val = { CrimeID: crimeId };
    fetchPostData("Crime/GetSingleData_Offense", val).then((res) => {
      if (res) {
        setEditval(res);
        const PanelCode = res[0]?.PanelCode;
        setPanelCode(PanelCode)
      } else {
        setEditval();
      }
    });
  };

  useEffect(() => {
    if (crimeId) {
      if (editval?.length > 0) {
        console.log(editval[0]?.IsCargoTheftInvolved)
        setcountoffaduit(true);
        setValue({
          ...value,
          CrimeID: editval[0]?.CrimeID, NIBRSCodeId: editval[0]?.NIBRSCodeId, ChargeCodeID: editval[0]?.ChargeCodeID,
          LawTitleId: editval[0]?.LawTitleId, OffenseCodeId: editval[0]?.OffenseCodeId, PrimaryLocationId: editval[0]?.PrimaryLocationId,
          SecondaryLocationId: editval[0]?.SecondaryLocationId, OffenderLeftSceneId: editval[0]?.OffenderLeftSceneId, CategoryId: editval[0]?.CategoryId,
          clickedRow: editval[0]?.clickedRow,
          // text Box
          Fine: editval[0]?.Fine ? editval[0]?.Fine : "", CourtCost: editval[0]?.CourtCost ? editval[0]?.CourtCost : "",
          FTAAmt: editval[0]?.FTAAmt ? editval[0]?.FTAAmt : "", LitigationTax: editval[0]?.LitigationTax ? editval[0]?.LitigationTax : "",
          DamageProperty: editval[0]?.DamageProperty ? editval[0]?.DamageProperty : "",
          OfRoomsInvolved: editval[0]?.OfRoomsInvolved ? editval[0]?.OfRoomsInvolved : "",
          PremisesEntered: editval[0]?.PremisesEntered ? editval[0]?.PremisesEntered : "",
          Comments: editval[0]?.Comments ? editval[0]?.Comments : "",
          // Checkbox
          PropertyAbandoned: editval[0]?.PropertyAbandoned, IsForceused: editval[0]?.IsForceused === "N" || editval[0]?.IsForceused === null || editval[0]?.IsForceused === "" ? false : true, IsIncidentCode: editval[0]?.IsIncidentCode,
          //Radio Button
          AttemptComplete: editval[0]?.AttemptComplete === "Completed" ? "C" : editval[0]?.AttemptComplete === "Attempted" ? "A" : "",
          IsDomesticViolence: editval[0]?.IsDomesticViolence, IsGangInfo: editval[0]?.IsGangInfo, CrimeMethodOfEntryID: editval[0]?.CrimeMethodOfEntryID,
          //Date picker
          FTADate: editval[0]?.FTADate ? getShowingWithOutTime(editval[0]?.FTADate) : "",

          'IsCargoTheftInvolved': editval[0]?.IsCargoTheftInvolved || editval[0]?.IsCargoTheftInvolved === "Y" ? editval[0]?.IsCargoTheftInvolved === "N" ? "N" : "Y" : "",
          // other
          ModifiedByUserFK: loginPinID, CreatedByUserFK: loginPinID,
        });

        const filteredChargeData = Object.values(chargedata).filter((item) => item.ChargeCodeID === editval[0]?.ChargeCodeID);
        const panelCode = filteredChargeData.length > 0 ? filteredChargeData[0].PanelCode : null;
        setpanelCode(panelCode); setnibrsSubmittedOffenseMain(editval[0]?.IsNIBRSSummited); setGangInfoVal(filterGangsUsingIncludes(gangInfoDrpVal, editval[0]?.IsGangInfo));
        // nibrs code
        NIBRSCodeDrpDwnVal(loginAgencyID, editval[0]?.LawTitleId);
        // charge code / offence code name
        getChargeCodeIDDrp(loginAgencyID, editval[0]?.NIBRSCodeId, editval[0]?.LawTitleId);
        setNibrsCode(Get_Nibrs_Code(editval, nibrsCodeDrp)); setPrimaryLocationCode(Get_PrimaryLocation_Code(editval, locationIdDrp));
      }
    } else {
      setValue({
        ...value,
        ChargeCodeID: "", NIBRSCodeId: null, OffenseCodeId: null, LawTitleId: null, OffenderLeftSceneId: null, CategoryId: null, PrimaryLocationId: null, SecondaryLocationId: null,
        // text Box
        Fine: "", CourtCost: "", FTAAmt: "", LitigationTax: "", DamageProperty: "", OfRoomsInvolved: "", PremisesEntered: "",
        // Checkbox
        PropertyAbandoned: "", IsForceused: "", IsCargoTheftInvolved: '',
        //Radio Button
        AttemptComplete: "",
        //Date picker
        FTADate: "", IsDomesticViolence: "", IsGangInfo: "", CrimeMethodOfEntryID: "", Comments: "",
      });
      setGangInfoVal([]);
    }
  }, [editval]);

  useEffect(() => {
    nibrsCodeDrp?.filter((val) => {
      if (val.value === value?.NIBRSCodeId) {
        setNibrsCode(val?.id);
      }
    });
  }, [value.NIBRSCodeId, nibrsCodeDrp]);

  useEffect(() => {
    locationIdDrp?.filter((val) => {
      if (val.value === value?.PrimaryLocationId) {
        setPrimaryLocationCode(val?.id);
      }
    });
  }, [value.PrimaryLocationId, nibrsCodeDrp]);

  const resetEditVal = () => {
    if (crimeId) {
      if (editval?.length > 0) {
        setValue({
          ...value,
          CrimeID: editval[0]?.CrimeID, NIBRSCodeId: editval[0]?.NIBRSCodeId, ChargeCodeID: editval[0]?.ChargeCodeID,
          LawTitleId: editval[0]?.LawTitleId, OffenseCodeId: editval[0]?.OffenseCodeId, PrimaryLocationId: editval[0]?.PrimaryLocationId,
          SecondaryLocationId: editval[0]?.SecondaryLocationId, OffenderLeftSceneId: editval[0]?.OffenderLeftSceneId, CategoryId: editval[0]?.CategoryId,
          clickedRow: editval[0]?.clickedRow,
          // text Box
          Fine: editval[0]?.Fine ? editval[0]?.Fine : "",
          CourtCost: editval[0]?.CourtCost ? editval[0]?.CourtCost : "",
          FTAAmt: editval[0]?.FTAAmt ? editval[0]?.FTAAmt : "",
          LitigationTax: editval[0]?.LitigationTax
            ? editval[0]?.LitigationTax
            : "",
          DamageProperty: editval[0]?.DamageProperty
            ? editval[0]?.DamageProperty
            : "",
          OfRoomsInvolved: editval[0]?.OfRoomsInvolved
            ? editval[0]?.OfRoomsInvolved
            : "",
          PremisesEntered: editval[0]?.PremisesEntered
            ? editval[0]?.PremisesEntered
            : "",
          // Checkbox
          PropertyAbandoned: editval[0]?.PropertyAbandoned,
          IsForceused:
            editval[0]?.IsForceused === "N" ||
              editval[0]?.IsForceused === null ||
              editval[0]?.IsForceused === ""
              ? false
              : true,
          IsIncidentCode: editval[0]?.IsIncidentCode,
          Comments: editval[0]?.Comments ? editval[0]?.Comments : "",
          //Radio Button
          AttemptComplete: "",
          //Date picker
          FTADate: editval[0]?.FTADate
            ? getShowingWithOutTime(editval[0]?.FTADate)
            : "",
          // other
          ModifiedByUserFK: loginPinID,
          CreatedByUserFK: loginPinID,
        });

        getChargeCodeIDDrp(
          loginAgencyID,
          editval[0]?.NIBRSCodeId,
          value?.LawTitleId
        );
        NIBRSCodeDrpDwnVal(loginAgencyID, editval[0]?.LawTitleId);
      }
    }
  };

  const Reset = () => {
    setValue({
      ...value, ChargeCodeID: "", LawTitleId: "", OffenseCodeId: "", NIBRSCodeId: "", OffenderLeftSceneId: "", CategoryId: "", PrimaryLocationId: "", SecondaryLocationId: "", Fine: "", CourtCost: "", FTAAmt: "", LitigationTax: "", DamageProperty: "", OfRoomsInvolved: "", PremisesEntered: "", PropertyAbandoned: "", IsForceused: "", AttemptComplete: "", FTADate: "", CrimeID: "", IsDomesticViolence: "", IsGangInfo: "", CrimeMethodOfEntryID: "", Comments: "", IsCargoTheftInvolved: '',
    });
    setErrors({
      ...errors, ChargeCodeIDError: "", NibrsIdError: "", PremisesEnteredError: "", PrimaryLocationError: "", AttemptRequiredError: "", CommentsError: "",
      MethodEntryError: "", CargoTheftError: "",
    });
    setCrimeId(""); setpanelCode(''); setChargeCodeDrp([]); setChangesStatus(false); setStatesChangeStatus(false);
    setGangInfoVal([]); setPrimaryLocationCode(""); setNibrsCode(""); setnibrsSubmittedOffenseMain(0);
    setIsCrimeAgainstSociety(false); setIsCrimeAgainstProperty(false); setIsCrimeAgainstPerson(false);
    //law title
    LawTitleIdDrpDwnVal(loginAgencyID, null);
    // nibrs code
    NIBRSCodeDrpDwnVal(loginAgencyID, null);
    // charge / offence codeName
    getChargeCodeIDDrp(loginAgencyID, 0, 0);
    setlocationTypeComplteStatus(false);
  };

  const changeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      if (name === "PrimaryLocationId") {
        setPrimaryLocationCode(e.id);
        setValue({ ...value, [name]: e.value });
        if (!e.value) {
          setValue((pre) => ({ ...pre, ["SecondaryLocationId"]: null }));
        }
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else if (e === null) {
      if (name === "PrimaryLocationId") {
        setPrimaryLocationCode(""); setValue({ ...value, [name]: null });
        setValue((pre) => ({ ...pre, ["SecondaryLocationId"]: null }));
        setErrors({ ...errors, PremisesEnteredError: "" });
      } else {
        setValue({ ...value, [name]: null });
      }
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === "PropertyAbandoned" || e.target.name === "IsForceused") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
      });
    } else if (e.target.name === "OfRoomsInvolved") {
      // Remove non-digit chars
      let checkNumber = e.target.value.replace(/[^0-9]/g, "");

      if (checkNumber.includes("00")) {
        checkNumber = checkNumber.replace(/0{2,}/g, "0");
      }

      setValue({
        ...value,
        [e.target.name]: checkNumber,
      });
    } else if (e.target.name === "PremisesEntered") {
      let checkNumber = e.target.value.replace(/[^0-9]/g, "");
      if (checkNumber.length <= 2) {
        if (checkNumber[0] === '0' || parseInt(checkNumber) > 99) {
          setValue({ ...value, [e.target.name]: "" });
        } else {
          setValue({ ...value, [e.target.name]: checkNumber });
        }
      } else {
        e.preventDefault();

      }
    } else if (e.target.name === "Fine" || e.target.name === "LitigationTax" || e.target.name === "FTAAmt" || e.target.name === "CourtCost" || e.target.name === "DamageProperty") {
      var ele = e.target.value.replace(/[^0-9\.]/g, "");
      if (ele.includes(".")) {
        if (ele.length === 16) {

          setValue({ ...value, [e.target.name]: ele });
        } else {
          if (ele.substr(ele.indexOf(".") + 1).slice(0, 2)) {
            const checkDot = ele
              .substr(ele.indexOf(".") + 1)
              .slice(0, 2)
              .match(/\./g);
            if (!checkDot) {

              setValue({
                ...value,
                [e.target.name]:
                  ele.substring(0, ele.indexOf(".")) +
                  "." +
                  ele.substr(ele.indexOf(".") + 1).slice(0, 2),
              });
            }
          } else {
            setValue({ ...value, [e.target.name]: ele });
          }
        }
      } else {
        if (ele.length === 16) {
          setValue({
            ...value,
            [e.target.name]: ele,
          });
        } else {
          setValue({
            ...value,
            [e.target.name]: ele,
          });
        }
      }
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    }
  };

  useEffect(() => {
    if (openPage || loginAgencyID) {
      OffenderLeftSceneDrpDwnVal(loginAgencyID); CategoryDrpDwnVal(loginAgencyID);
      LocationIdDrpDwnVal(loginAgencyID); getGangInfoDrp(loginAgencyID);
      // lawtitle dpr
      LawTitleIdDrpDwnVal(loginAgencyID, null);
      // NIBRSCodeId
      NIBRSCodeDrpDwnVal(loginAgencyID, 0);
      // charge / offence codeName
      getChargeCodeIDDrp(loginAgencyID, 0, 0);
    }
  }, [loginAgencyID, openPage]);

  const getNibrsValue = (ChargeCodeID) => {
    const val = { ChargeCodeID: ChargeCodeID };
    fetchPostData("ChargeCodes/GetDataDropDown_NIBRS", val).then((data) => {
      if (data) {
        setValue((pre) => {
          return { ...pre, ["NIBRSCodeId"]: data[0].FBIID };
        });
      }
    });
  };

  useEffect(() => {
    if (editval?.length > 0 && gangInfoDrpVal?.length > 0) {
      const selectedGangs = gangInfoDrpVal.filter((option) =>
        editval[0]?.IsGangInfo?.split(",").includes(option.value.toString())
      );
      setGangInfoVal(selectedGangs);
    }
  }, [editval, gangInfoDrpVal]);

  const getGangInfoDrp = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("Gang/GetDataDropDown_Gang", val).then((data) => {
      if (data) {
        setGangInfoDrpVal(
          threeColArray(data, "GangID", "Description", "GangCode")
        );
      } else {
        setGangInfoDrpVal([]);
      }
    });
  };

  const filterGangsUsingIncludes = (options, selectedIds) => {
    if (!selectedIds) return [];
    const selectedIdArray = selectedIds.split(",");
    return options.filter((option) =>
      selectedIdArray.includes(option.value.toString())
    );
  };

  const LocationIdDrpDwnVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("LocationType/GetDataDropDown_LocationType", val).then(
      (data) => {
        if (data) setLocationIdDrp(threeColArray(data, "LocationTypeID", "Description", "LocationTypeCode"));
        else setLocationIdDrp([]);
      }
    );
  };

  const CategoryDrpDwnVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("ChargeCategory/GetDataDropDown_ChargeCategory", val).then(
      (data) => {
        if (data) setCategoryIdDrp(Comman_changeArrayFormat(data, "ChargeCategoryID", "Description"));
        else setCategoryIdDrp([]);
      }
    );
  };

  const OffenderLeftSceneDrpDwnVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("CrimeLeftScene/GetDataDropDown_CrimeLeftScene", val).then(
      (data) => {
        if (data) setOffenderLeftSceneDrp(Comman_changeArrayFormat(data, "LeftSceneId", "Description"));
        else setOffenderLeftSceneDrp([]);
      }
    );
  };

  // ChargeCodeID
  const LawTitleIdDrpDwnVal = async (loginAgencyID, ChargeCodeID) => {
    const val = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID };
    await fetchPostData("LawTitle/GetDataDropDown_LawTitle", val).then((data) => {
      if (data) setLawTitleIdDrp(Comman_changeArrayFormat(data, "LawTitleID", "Description"));
      else setLawTitleIdDrp([]);
    });
  };

  const NIBRSCodeDrpDwnVal = (loginAgencyID, LawTitleID) => {
    const val = {
      AgencyID: loginAgencyID,
      LawTitleID: LawTitleID ? LawTitleID : null,
      IncidentID: mainIncidentID,
    };
    fetchPostData("FBICodes/GetDataDropDown_FBICodes", val).then((data) => {
      if (data) {
        // console.log("🚀 ~ fetchPostData ~ data:", data)
        setNibrsCodeDrp(modifiedFbiCodeArray(data, "FBIID", "Description", "FederalSpecificFBICode", "IsCrimeAgains_Person", "IsCrimeAgainstProperty", "IsCrimeAgainstSociety"));

      } else {
        setNibrsCodeDrp([]);

      }
    });
  };

  const getChargeCodeIDDrp = (loginAgencyID, NIBRSCodeId, LawTitleID) => {
    const val = {
      AgencyID: loginAgencyID, FBIID: NIBRSCodeId, LawTitleID: LawTitleID,
    };
    fetchPostData("ChargeCodes/GetDataDropDown_ChargeCodes", val).then((data) => {
      if (data) {
        setChargedata(data); setChargeCodeDrp(Comman_changeArrayFormat(data, "ChargeCodeID", "Description"));
      }
      else
        setChargeCodeDrp([]);
    });
  };

  const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, chargeCodeId) => {
    const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: chargeCodeId };
    const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: mainIncidentID, ChargeCodeID: chargeCodeId };
    try {
      const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
        fetchPostData("LawTitle/GetDataDropDown_LawTitle", lawTitleObj),
        fetchPostData("FBICodes/GetDataDropDown_FBICodes", nibrsCodeObj),
      ]);
      const lawTitleArr = Comman_changeArrayFormat(lawTitleResponse, "LawTitleID", "Description");
      const nibrsArr = threeColArrayWithCode(nibrsCodeResponse, "FBIID", "Description", "FederalSpecificFBICode");
      setNibrsCodeDrp(nibrsArr);
      setValue({
        ...value,
        LawTitleId: lawTitleArr[0]?.value, NIBRSCodeId: nibrsArr[0]?.value, ChargeCodeID: chargeCodeId,
      });
      const isSingleEntry = lawTitleArr.length === 1 && nibrsArr.length === 1;
    } catch (error) {
      console.error("Error during data fetching:", error);
    }
  };

  const onChangeDrpLawTitle = async (e, name) => {
    !addUpdatePermission && setChangesStatus(true);
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e) {
      if (name === "LawTitleId") {
        setValue({
          ...value,
          ["LawTitleId"]: e.value,
          ["NIBRSCodeId"]: null,
          ["ChargeCodeID"]: null,
        });
        setChargeCodeDrp([]);
        setNibrsCodeDrp([]);
        // nibrs code
        NIBRSCodeDrpDwnVal(loginAgencyID, e.value);
        // charge code
        getChargeCodeIDDrp(loginAgencyID, value?.NIBRSCodeId, e.value);
      } else if (name === "ChargeCodeID") {
        const filteredChargeData = Object.values(chargedata).filter((item) => item.ChargeCodeID === e.value);
        const panelCode = filteredChargeData.length > 0 ? filteredChargeData[0].PanelCode : null;
        setpanelCode(panelCode);
        const res = await getLawTitleNibrsByCharge(loginAgencyID, value?.LawTitleId, e.value);
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === "LawTitleId") {
        setValue({
          ...value,
          ["LawTitleId"]: null,
          ["NIBRSCodeId"]: "",
          ["ChargeCodeID"]: null,
        });
        setNibrsCodeDrp([]);
        setChargeCodeDrp([]);
        //law title
        LawTitleIdDrpDwnVal(loginAgencyID, null);
        // nibrs code
        NIBRSCodeDrpDwnVal(loginAgencyID, null);
        //offence code
        getChargeCodeIDDrp(loginAgencyID, null, null);
      } else if (name === "ChargeCodeID") {
        setValue({ ...value, ["ChargeCodeID"]: null });
        // nibrs code
        NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  };

  const onChangeNIBRSCode = (e, name) => {
    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
    if (e) {
      if (name === "NIBRSCodeId") {
        if ((e.id === "09C" || e.id === "360" || e.id === "09A" || e.id === "09B" || e.id === "13A" || e.id === "13B" || e.id === "13C") && loginAgencyState === "TX") {
          setNibrsCode(e.id);
          setValue({ ...value, ["NIBRSCodeId"]: e.value, ["ChargeCodeID"]: null, AttemptComplete: "C", IsGangInfo: null, });
          setChargeCodeDrp([]); setGangInfoVal([]);
          getChargeCodeIDDrp(loginAgencyID, e.value, value?.LawTitleId);
        } else {
          setNibrsCode(e.id);
          setValue({ ...value, ["NIBRSCodeId"]: e.value, ["ChargeCodeID"]: null, });
          setChargeCodeDrp([]); setGangInfoVal([]);
          getChargeCodeIDDrp(loginAgencyID, e.value, value?.LawTitleId);
        }
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === "NIBRSCodeId") {
        setValue({ ...value, [name]: null, ["ChargeCodeID"]: null, ["CrimeMethodOfEntryID"]: null, IsGangInfo: null, });
        setErrors({ ...errors, ChargeCodeIDError: "", PremisesEnteredError: "", });
        setGangInfoVal([]);
        NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
        getChargeCodeIDDrp(loginAgencyID, null, value?.LawTitleId);
        // nibrs Errors States
        setNibrsCode(""); setPrimaryLocationCode(""); setChargeCodeDrp([]);
      } else {
        setValue({ ...value, [name]: null });

      }
    }
  };

  useEffect(() => {
    if (status) {
      setValue({ ...value, ["FTADate"]: "" });
    }
  }, []);

  const Add_Offense = async () => {
    const { ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId,
      PrimaryLocationId, SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt, LitigationTax,
      DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned,
      IsForceused, IsIncidentCode, AttemptComplete, CrimeID, IncidentID, IsCargoTheftInvolved,
      CreatedByUserFK, ModifiedByUserFK, IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID, Comments,
    } = value;
    const val = {
      ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId,
      PrimaryLocationId, SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt, LitigationTax,
      DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned, IsCargoTheftInvolved,
      IsForceused, IsIncidentCode, AttemptComplete, CrimeID,
      IncidentID: mainIncidentID,
      CreatedByUserFK: loginPinID,
      ModifiedByUserFK: "",
      IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID, Comments,
    };
    try {
      const res = await AddDeleteUpadate("Crime/Insert_Offense", val);
      if (res.success) {
        Reset();
        if (res.CrimeID) {
          navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(res.CrimeID)}&OffSta=${true}`);
          get_Incident_Count(mainIncidentID, loginPinID);
          get_Offence_Data(mainIncidentID);
        }
        setChangesStatus(false); setStatesChangeStatus(false);
      }
      LawTitleIdDrpDwnVal(loginAgencyID, null);
      NIBRSCodeDrpDwnVal(loginAgencyID, null);
      toastifySuccess(res.Message);
      // validateIncSideBar
      validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
    } catch (error) {
      toastifyError("An error occurred while adding the offense.");
    } finally {
      setUpdateCount(updateCount + 1);
      setErrors({ ...errors, ["ChargeCodeIDError"]: "", CommentsError: "" });
    }
  };

  const Update_Offence = async () => {
    const {
      ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId,
      PrimaryLocationId, SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt, LitigationTax,
      DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned,
      IsForceused, IsIncidentCode, AttemptComplete, CrimeID, IncidentID, IsCargoTheftInvolved,
      CreatedByUserFK, ModifiedByUserFK, IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID,
      Comments,
    } = value;

    const val = {
      ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId,
      PrimaryLocationId, SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt,
      LitigationTax, DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned,
      IsIncidentCode, AttemptComplete, CrimeID, IncidentID: mainIncidentID,
      CreatedByUserFK: loginPinID, ModifiedByUserFK: loginPinID, IsCargoTheftInvolved,
      IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID, Comments,
    };

    try {
      const res = await AddDeleteUpadate("Crime/Update_Offense", val);
      if (res.success) {
        Reset();
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        setChangesStatus(false);
        setStatesChangeStatus(false);
        get_Offence_Data(mainIncidentID);
        get_List(OffId);
        setStatusFalse();
        setErrors({ ...errors, ["ChargeCodeIDError"]: "", CommentsError: "" });
      }
      LawTitleIdDrpDwnVal(loginAgencyID, null);
      NIBRSCodeDrpDwnVal(loginAgencyID, null);
      // validateIncSideBar
      validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
    } catch (error) {
      toastifyError("An error occurred while updating the offense.");
    } finally {
      setErrors({ ...errors, ["ChargeCodeIDError"]: "", CommentsError: "" });
    }
  };

  const setStatusFalse = (e) => {
    navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${0}&OffSta=${false}`);
    NIBRSCodeDrpDwnVal(loginAgencyID, 0);
    setStatus(false);
    Reset();
  };

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const Cancel = () => {
    if (!changesStatus) {
      navigate("/Off-Home");
      // deleteStoreData({ 'OffenceID': '', 'OffenceStatus': '' });
      setIncidentStatus(true);
    }
  };

  useEffect(() => {
    if (offenceFillterData?.length > 0) {
      const arrestChargeCounts = offenceFillterData.map(item => item.ArrestChargeCount);
      SetDeleteshowCounts(arrestChargeCounts);
    }
  }, [offenceFillterData]);


  const columns = [
    {
      minWidth: "200px",
      grow: 1,
      name: "TIBRS Code",
      selector: (row) => row.FBIID_Description,
      sortable: true,
      cell: (row) =>
        check_NibrsCode_09C(row.FBICode, offenceFillterData) ? (
          <div className="tooltip-left-zero">
            <TableErrorTooltip
              value={row.FBIID_Description}
              ErrorStr={check_NibrsCode_09C(row.FBICode, offenceFillterData)}
            />
          </div>
        ) : (
          row.FBIID_Description
        ),
    },
    {
      minWidth: "200px",
      grow: 2,
      name: "Offense Code",
      selector: (row) => row.OffenseName_Description,
      sortable: true,
    },
    {
      minWidth: "100px",
      grow: 1,
      name: "Law Title",
      selector: (row) => row.LawTitle_Description,
      sortable: true,
    },
    {
      minWidth: "110px",
      grow: 1,
      cell: (row) => (
        <div >
          {
            getCrimeInfoErrorButton(row.CrimeID, nibrsValidateOffenseData) ?
              <>
                <span
                  onClick={(e) => {
                    navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row?.CrimeID)}&OffSta=${true}&CrimeSta=${true}`);
                  }}
                  className={`btn btn-sm text-white px-2 py-0 mr-1 `}
                  style={{
                    backgroundColor: "red",
                  }}
                >
                  Crime Info
                </span>
              </>
              :
              <>
                <span
                  onClick={(e) => {
                    navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row?.CrimeID)}&OffSta=${true}&CrimeSta=${true}`);
                  }}
                  className={`btn btn-sm text-white px-2 py-0 mr-1 `}
                  style={{
                    backgroundColor: "#19aea3",
                  }}
                >
                  Crime Info
                </span>
              </>
          }
        </div>
      ),

    },
    {

      minWidth: "120px",
      grow: 1,
      cell: (row) => (
        <div >
          {(row?.FBICode === "35A" || row?.FBICode === "35B") && row?.AttemptComplete === "Completed" && (
            <span
              onClick={(e) => {
                navigate(`/Prop-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&FbiCode=${row.FBICode}&AttComp=${row?.AttemptComplete === "Completed" ? "C" : "A"}`);
              }}
              className={`btn btn-sm  text-white px-2 py-0 mr-1`}
              style={{
                backgroundColor: PropertyDrugCount === 0 ? "red" : "#19aea3",
              }}
            >
              Drug Property
            </span>
          )}
        </div>
      ),

    },
    {
      minWidth: "110px",
      grow: 1,
      cell: (row) => (
        <div >
          {row?.IsCrimeAgainstProperty === true && (
            <span
              onClick={(e) => {
                navigate(`/Prop-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&FbiCode=${row.FBICode}&AttComp=${row?.AttemptComplete === "Completed" ? "C" : "A"}`);
              }}
              className={`btn btn-sm  text-white px-2 py-0 mr-1 `}
              style={{
                backgroundColor: (row?.IsCrimeAgainstProperty === true && PropertyCount === 0) ? "red" : "#19aea3",
              }}
            >
              Property
            </span>
          )}
        </div >
      ),
    },
    {
      minWidth: "110px",
      grow: 1,
      cell: (row) => (
        <div >
          {row?.IsCrimeAgainstProperty === true && (
            <span
              onClick={(e) => {
                navigate(`/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}&FbiCode=${row.FBICode}&AttComp=${row?.AttemptComplete === "Completed" ? "C" : "A"}`);
              }}
              className={`btn btn-sm bg-green text-white px-2 py-0 mr-1`}
            >
              Vehicle
            </span>
          )}
        </div>
      ),
    },
    {
      minWidth: "40px",
      grow: 1,
      name: "View",
      cell: (row) => (
        <div >
          {getOffenseNibrsError(row.CrimeID, nibrsValidateOffenseData) ? (
            <span
              onClick={(e) =>
                setOffenseErrString(row.CrimeID, nibrsValidateOffenseData)
              }
              className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
              data-toggle="modal"
              data-target="#NibrsErrorShowModal"
            >
              <i className="fa fa-eye"></i>
            </span>
          ) : (
            <></>
          )}
        </div>
      ),
      // omit: row => getOffenseNibrsError(row.CrimeID, nibrsValidateOffenseData) ? false : true,
    },
    {
      minWidth: "40px",
      grow: 1,
      name: (
        <p
          className="text-end"
          style={{ position: "absolute", top: "7px", }}
        >
          Action
        </p>
      ),
      cell: (row) => (
        <div >
          {row.ArrestChargeCount === "0" && (
            effectiveScreenPermission ? (
              effectiveScreenPermission[0]?.DeleteOK ? (
                <span
                  onClick={() => setDelCrimeId(row.CrimeID)}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                  data-toggle="modal"
                  data-target="#DeleteModal"
                >
                  <i className="fa fa-trash"></i>
                </span>
              ) : null
            ) : (
              <span
                onClick={() => setDelCrimeId(row.CrimeID)}
                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                data-toggle="modal"
                data-target="#DeleteModal"
              >
                <i className="fa fa-trash"></i>
              </span>
            )
          )}
        </div>
      ),
    },
  ];

  const getCrimeInfoErrorButton = (crimeId, nibrsValidateOffenseData) => {
    const arr = nibrsValidateOffenseData?.filter((item) => (item?.CrimeID === crimeId) && (item?.Bias === true || item?.OffenderUsing === true || item?.CriminalActivity === true || item?.Weapon === true));
    return arr?.[0]?.OnPageError;
  };

  const getOffenseNibrsError = (crimeId, nibrsValidateOffenseData) => {
    const arr = nibrsValidateOffenseData?.filter(
      (item) => item?.CrimeID === crimeId
    );
    return arr?.[0]?.OnPageError;
  };

  const setOffenseErrString = (CrimeID, nibrsValidateOffenseData) => {
    const arr = nibrsValidateOffenseData?.filter(
      (item) => item?.CrimeID === CrimeID
    );
    // console.log("🚀 ~ getOffenseNibrsError ~ arr:", arr);
    setNibrsOffErrStr(arr[0]?.OnPageError);
    setNibrsErrModalStatus(true);
  };

  const getStatusColors = (CrimeID, nibrsValidateOffenseData) => {
    return getOffenseNibrsError(CrimeID, nibrsValidateOffenseData) ? { backgroundColor: "rgb(255 202 194)" } : {};
  };

  const mergedConditionalRowStyles = [
    {
      when: () => true,
      style: (row) => ({
        ...getStatusColors(row.CrimeID, nibrsValidateOffenseData),
        ...(row.CrimeID === crimeId
          ? {
            backgroundColor: "#001f3fbd",
            color: "white",
            cursor: "pointer",
          }
          : {}),
      }),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.CrimeID == crimeId,
      style: {
        backgroundColor: "#001f3fbd",
        color: "white",
        cursor: "pointer",
      },
    },
  ];

  const setEditVal = (row, status) => {
    if (changesStatus) {
      const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
      modal?.show();
    } else {
      if (row.CrimeID) {
        setStatesChangeStatus(false);
        navigate(`/Off-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row.CrimeID)}&OffSta=${true}`);
        setErrors({ ...errors, ChargeCodeIDError: "", NibrsIdError: "" });
        GetSingleData(row.CrimeID);
        get_Offence_Count(row.CrimeID);
        NibrsErrorReturn(row.CrimeID);
        setCrimeId(row.CrimeID);
        setOffenceID(row?.CrimeID);
        setStatus(true);
        // Reset();
      }
      setUpdateCount(updateCount + 1);
      setIncStatus(true);
    }
  };

  const DeleteOffence = () => {
    const val = { CrimeID: delCrimeId, DeletedByUserFK: loginPinID };
    AddDeleteUpadate("Crime/Delete_Offense", val).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;
      toastifySuccess(message);
      get_Incident_Count(mainIncidentID, loginPinID);
      get_Offence_Data(mainIncidentID);
      setStatusFalse();
      Reset();
    });
  };

  // Custom Style
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  // Custom Style
  // const nibrscolourStyles = {
  //   control: (styles) => ({
  //     ...styles,
  //     backgroundColor: "rgb(255 202 194)",
  //     height: 20,
  //     minHeight: 35,
  //     fontSize: 14,
  //     margintop: 2,
  //     boxShadow: 0,
  //   }),
  // };


  const nibrsSuccessStyles = {
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

  // custuom style withoutColor
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

  const StatusOption = [
    { value: "A", label: "Attempted" },
    { value: "C", label: "Completed" },
  ];

  const StatusOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];


  const changeDropDowns = (e, name) => {
    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  const onChangeGangInfo = (e, name) => {
    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
    const id = [];
    if (e) {
      e.map((item, i) => { id.push(item.value); });
      setGangInfoVal(e);
      setValue({ ...value, [name]: id.toString() });
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  const get_MethodOfEntry_DropDown = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("OffenseMethodOfEntry/GetData_InsertGetData_OffenseMethodOfEntry", val).then((data) => {
      if (data) {
        setMethodEntryDrp(threeColArrayWithCode(data, "EntryMethodID", "Description", "MethodOfEntryCode"));
      } else {
        setMethodEntryDrp([]);
      }
    });
  };

  const getMethodOfEntryStyleColor = (nibrsCode) => {
    if (nibrsCode === "220") {
      return value?.CrimeMethodOfEntryID ? nibrsSuccessStyles : nibrscolourStyles;
    } else {
      return customStylesWithOutColor;
    }
  };

  const getGangInfoStyleColor = (nibrsCode) => {
    const gangValidCodes = ["11B", "09A", "09B", "100", "11A", "11C", "11D", "120", "13A", "13B", "13C"];
    if (gangValidCodes?.includes(nibrsCode)) {
      return value?.IsGangInfo || value?.IsGangInfo === false ? nibrsSuccessStyles : nibrscolourStyles;
    } else {
      return customStylesWithOutColor;
    }
  };

  const isGangDisabled = (nibrsCode) => {
    const gangValidCodes = ["11B", "09A", "09B", "100", "11A", "11C", "11D", "120", "13A", "13B", "13C"];
    return gangValidCodes?.includes(nibrsCode);
  };

  // validate Incident
  const nibrsValidateOffense = async (incidentID, IncNo) => {
    setclickNibLoder(true);
    const val = {
      gIncidentID: incidentID,
      IncidentNumber: IncNo,
      CrimeId: '',
    };
    try {
      const data = await fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", val);
      console.log("🚀 ~ nibrsValidateOffense ~ data:", data);
      if (data) {
        setnibrsValidateOffenseData(data?.Offense);
        setclickNibLoder(false);

      } else {
        setnibrsValidateOffenseData([]);
        setclickNibLoder(false);

      }
    } catch (error) {
      console.error("Error in nibrsValidateOffense: ", error);

    } finally {
      setclickNibLoder(false);

    }
  };

  const NibrsErrorReturn = async (crimeId) => {
    const val = {
      gIncidentID: mainIncidentID,
      IncidentNumber: IncNo,
      CrimeId: crimeId,
    };
    try {
      const res = await fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", val);
      if (res) {
        const offenceError = res?.Offense && res?.Offense[0] ? res?.Offense[0] : [];

        if (offenceError.LocationType) {
          setlocationTypeComplteStatus(offenceError?.LocationType);
          setlocationTypeComplteError(offenceError?.LocationTypeError);
        }
        if (offenceError.MethodOfEntry) {
          setmethodOfEntryStatus(offenceError?.MethodOfEntry);
          setmethodOfEntryError(offenceError?.MethodOfEntryError);
        }
        if (offenceError.GangInformation) {
          setgangInformationStatus(offenceError?.GangInformation);
          setgangInformationError(offenceError?.GangInformationError);
        }
        setnibrsError(res);

      } else {

        setnibrsError([]);
        setAttemptComplteStatus(false);
        setlocationTypeComplteStatus(false);
        setgangInformationStatus(false);
        setmethodOfEntryStatus(false);
      }
    } catch (error) {
      console.error("Error in NibrsErrorReturn: ", error);
      setnibrsError([]);
      setAttemptComplteStatus(false);
      setlocationTypeComplteStatus(false);
      setgangInformationStatus(false);
      setmethodOfEntryStatus(false);
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);


  // DS
  useEffect(() => {
    const selectedItem = nibrsCodeDrp?.find((item) => item.value === value?.NIBRSCodeId);
    if (selectedItem) {
      setIsCrimeAgainstPerson(selectedItem?.IsCrimeAgainsPerson);
      setIsCrimeAgainstProperty(selectedItem?.IsCrimeAgainstProperty);
      setIsCrimeAgainstSociety(selectedItem?.IsCrimeAgainstSociety);
    }
  }, [value?.NIBRSCodeId,]);

  const isNibrs999 = offenceFillterData?.find((item) => item?.FBICode === "999" ? true : false)

  const YesNoArr = [
    { value: 'Y', label: "Yes" },
    { value: 'N', label: "No" },
  ];


  const OnChangeCargoTheft = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  return (
    <>
      <div className="col-12 bb child">
        <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
          <div className="col-4 col-md-4 custom-col-12 ">
            <span data-toggle="modal" onClick={() => { setOpenPage("Law Title"); }} data-target="#ListModel" className="new-link px-0">Law Title</span>
          </div>
          <div className="col-7 col-md-7 col-lg-2">
            <Select
              name="LawTitleId"
              // styles={customStylesWithOutColor}
              styles={
                nibrsSubmittedOffenseMain === 1 ? LockFildscolour : customStylesWithOutColor
              }
              isDisabled={nibrsSubmittedOffenseMain === 1}
              // value={lawTitleIdDrp?.length === 1 ? lawTitleIdDrp?.filter((obj) => obj.value === lawTitleIdDrp[0]?.value) : lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
              value={lawTitleIdDrp?.filter(
                (obj) => obj.value === value?.LawTitleId
              )}
              options={lawTitleIdDrp}
              isClearable
              onChange={(e) => onChangeDrpLawTitle(e, "LawTitleId")}
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 col-lg-1 " style={{ lineHeight: 1.1 }}>
            <label htmlFor="" className="new-label m-0 text-nowrap" >
              TIBRS Code
            </label>
            <br />
            <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
              {errors.NibrsIdError !== "true" ? (
                <div style={{ color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}>{errors.NibrsIdError}</div>
              ) : null}

            </span>
          </div>
          <div className="col-7 col-md-7 col-lg-3 ">
            <Select
              name="NIBRSCodeId"
              styles={
                nibrsSubmittedOffenseMain === 1 ? LockFildscolour
                  :
                  Requiredcolour
              }
              isDisabled={nibrsSubmittedOffenseMain === 1}
              value={nibrsCodeDrp?.filter((obj) => obj.value === value?.NIBRSCodeId)}
              options={filteredOptions.length > 0 ? filteredOptions : nibrsCodeDrp}
              onInputChange={handleInputChange}
              isClearable
              onChange={(e) => onChangeNIBRSCode(e, "NIBRSCodeId")}
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 col-lg-1 ">
            <label htmlFor="" className="new-label m-0">Category</label>
          </div>
          <div className="col-7 col-md-7 custom-col-20 custom-col-29">
            <Select
              name="CategoryId"
              styles={customStylesWithOutColor}
              value={categoryIdDrp?.filter(
                (obj) => obj.value === value?.CategoryId
              )}
              isClearable
              options={categoryIdDrp}
              onChange={(e) => changeDropDown(e, "CategoryId")}
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 custom-col-12 " style={{ lineHeight: 1.1 }}>
            <Link to={"/ListManagement?page=Charge%20Code&call=/Off-Home"} className="new-link text-nowrap">Offense Code/Name</Link>
            <br />
            {errors.ChargeCodeIDError !== "true" ? (
              <div style={{ color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}  >
                {errors.ChargeCodeIDError}
              </div>
            ) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-6 ">
            <Select
              name="ChargeCodeID"
              // styles={colourStyles}
              styles={
                nibrsSubmittedOffenseMain === 1 ? LockFildscolour : Requiredcolour
              }
              isDisabled={nibrsSubmittedOffenseMain === 1}
              // styles={value?.NIBRSCodeId ? colourStyles : customStylesWithOutColor}
              // isDisabled={value?.NIBRSCodeId || value?.LawTitleId ? false : true}
              value={chargeCodeDrp?.filter(
                (obj) => obj.value === value?.ChargeCodeID
              )}
              isClearable
              options={chargeCodeDrp}
              onChange={(e) => onChangeDrpLawTitle(e, "ChargeCodeID")}
              placeholder="Select..."
            />
          </div>
          <div className="col-2" style={{ lineHeight: 1.1 }}>
            <label className="new-label m-0 text-nowrap"  >
              Attempted/Completed
            </label>
            <br />
            {errors.AttemptRequiredError !== "true" ? (<div style={{ color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}  >
              {errors.AttemptRequiredError}
            </div>
            ) : null}
          </div>
          <div className="custom-col-20">
            <Select
              onChange={(e) => changeDropDown(e, "AttemptComplete")}
              options={StatusOption}
              isClearable
              styles={nibrsSubmittedOffenseMain === 1 ? LockFildscolour : !value?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles}
              isDisabled={nibrsSubmittedOffenseMain === 1}
              placeholder="Select..."
              value={StatusOption.filter((option) => option.value === value?.AttemptComplete)}
            />
          </div>
          <div className="col-4 col-md-4 custom-col-12 " style={{ lineHeight: 1.1 }}>
            <span style={{ lineHeight: 1.1 }} data-toggle="modal" onClick={() => setOpenPage("Location Type")} data-target="#ListModel" className="new-link d-block text-nowrap">
              Primary Location Type
              {locationTypeComplteStatus && (<ErrorTooltip ErrorStr={locationTypeComplteError} />)}
              {chekLocationType(nibrsCode, primaryLocationCode) && (<ErrorTooltip ErrorStr={CyberspaceLocationError} />)}
            </span>
            <br />
            {errors.PrimaryLocationError !== "true" ? (<div style={{ color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}>{errors.PrimaryLocationError}</div>) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-4 ">
            <Select
              name="PrimaryLocationId"
              styles={
                nibrsSubmittedOffenseMain === 1 ? LockFildscolour
                  :
                  (panelCode === "03" || panelCode === "07" || panelCode === "06") ? Requiredcolour
                    :
                    loginAgencyState === "TX" ? chekLocationType(nibrsCode, primaryLocationCode) ? nibrscolourStyles
                      :
                      check_Valid_Nibrs_Code(nibrsCode) ? customStylesWithOutColor
                        :
                        Requiredcolour
                      :
                      Requiredcolour
              }
              isDisabled={nibrsSubmittedOffenseMain === 1}
              value={locationIdDrp?.filter((obj) => obj.value === value?.PrimaryLocationId)}
              isClearable
              options={locationIdDrp}
              onChange={(e) => changeDropDown(e, "PrimaryLocationId")}
              placeholder="Select..."
            />
          </div>
          <div className="" style={{ flex: "0 0 21.3%", minWidth: "21.3%" }}>
            <span data-toggle="modal" onClick={() => setOpenPage("Location Type")} data-target="#ListModel" className="new-link">Secondary Location Type </span>
          </div>
          <div className="col-7 col-md-7 col-lg-4  ">
            <Select
              name="SecondaryLocationId"
              styles={customStylesWithOutColor}
              value={locationIdDrp?.filter(
                (obj) => obj.value === value?.SecondaryLocationId
              )}
              isClearable
              options={locationIdDrp}
              onChange={(e) => changeDropDown(e, "SecondaryLocationId")}
              placeholder="Select..."
              isDisabled={!value?.PrimaryLocationId}
            />
          </div>
          <div className="custom-col-12">
            <span data-toggle="modal" onClick={() => setOpenPage("Crime Left  Scene")} data-target="#ListModel" className="new-link px-0">Offender Left Scene </span>
          </div>
          <div className="col-7 col-md-7 col-lg-2  ">
            <Select
              name="OffenderLeftSceneId"
              styles={customStylesWithOutColor}
              value={offenderLeftSceneDrp?.filter((obj) => obj.value === value?.OffenderLeftSceneId)}
              isClearable
              options={offenderLeftSceneDrp}
              onChange={(e) => changeDropDown(e, "OffenderLeftSceneId")}
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2 ">
            <label htmlFor="" className="new-label">
              Domestic violence
            </label>
          </div>
          <div className="col-7 col-md-7 col-lg-2  ">
            <Select
              value={StatusOptions.filter(
                (option) => option.value === value?.IsDomesticViolence
              )}
              // styles={customStylesWithOutColor}
              onChange={(e) => changeDropDowns(e, "IsDomesticViolence")}
              options={StatusOptions}
              isClearable
              placeholder="Select..."
              styles={
                nibrsSubmittedOffenseMain === 1
                  ? LockFildscolour
                  : customStylesWithOutColor
              }
              isDisabled={nibrsSubmittedOffenseMain === 1}
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2  ">
            <label htmlFor="" className="new-label d-block m-0 text-nowrap">
              Gang Information
              {gangInformationStatus && (<ErrorTooltip ErrorStr={gangInformationError} />)}
            </label>
          </div>
          <div className="custom-col-20">
            <Select
              isMulti
              styles={
                nibrsSubmittedOffenseMain === 1 ? LockFildscolour
                  :
                  loginAgencyState === "TX" ? getGangInfoStyleColor(nibrsCode) ? getGangInfoStyleColor(nibrsCode)
                    :
                    customStylesWithOutColor
                    :
                    customStylesWithOutColor
              }
              isDisabled={
                nibrsSubmittedOffenseMain === 1
                  ? true
                  : loginAgencyState === "TX"
                    ? isGangDisabled(nibrsCode)
                      ? false
                      : true
                    : false
              }
              value={gangInfoVal}
              onChange={(e) => onChangeGangInfo(e, "IsGangInfo")}
              options={gangInfoDrpVal}
              isClearable
              placeholder="Select..."
            />
          </div>
          {/* style={{ lineHeight: 1.1 }} */}
          <div className="custom-col-12 " >
            <label htmlFor="" className="new-label m-0 text-nowrap">
              Premises Entered
            </label>
            <br />
            {errors.PremisesEnteredError !== "true" ? (<div style={{ color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}  >{errors.PremisesEnteredError}</div>) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-2 text-field mt-0">
            <input
              type="text"
              style={{
                backgroundColor: loginAgencyState === "TX" &&
                  nibrsCode === "220" && (primaryLocationCode === "14" || primaryLocationCode === "19") ? value?.PremisesEntered ? "rgb(159 212 174)"
                  :
                  "rgb(255 202 194)"
                  :
                  ""
              }}
              name="PremisesEntered"
              value={value?.PremisesEntered}
              onChange={handleChange}
              maxLength={2}
              required
              autoComplete="off"
            />
          </div>
          <div className="col-2 " style={{ lineHeight: 1.1 }}>
            <span data-toggle="modal" onClick={() => setOpenPage("Method Of Entry")} data-target="#ListModel"
              className="new-link px-0"

            >
              Method Of Entry
              {methodOfEntryStatus ? (<ErrorTooltip ErrorStr={methodOfEntryError} />) : (<></>)}
            </span>
            <br />
            {errors.MethodEntryError !== "true" ? (<div style={{ color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}  >
              {errors.MethodEntryError}
            </div>
            ) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-2 ">
            <Select
              styles={
                nibrsSubmittedOffenseMain === 1 ?
                  LockFildscolour
                  :
                  loginAgencyState === "TX" ? getMethodOfEntryStyleColor(nibrsCode) ? getMethodOfEntryStyleColor(nibrsCode) : customStylesWithOutColor : customStylesWithOutColor
              }
              isDisabled={nibrsSubmittedOffenseMain === 1 ? true : loginAgencyState === "TX" ? nibrsCode === "220" ? false : true : false}
              name="CrimeMethodOfEntryID"
              menuPlacement="top"
              isClearable
              options={methodEntryDrp}
              value={methodEntryDrp?.filter((obj) => obj.value === value?.CrimeMethodOfEntryID)}
              onChange={(e) => changeDropDown(e, "CrimeMethodOfEntryID")}
              placeholder="Select..."
            />
          </div>


          {nibrsCode === "220" || nibrsCode === "210" || nibrsCode === "120" || nibrsCode === "23D" || nibrsCode === "23F" || nibrsCode === "23H" || nibrsCode === "240" || nibrsCode === "26A" || nibrsCode === "26A" || nibrsCode === "23D" || nibrsCode === "26C" || nibrsCode === "26E" || nibrsCode === "26F" || nibrsCode === "26G" || nibrsCode === "270" || nibrsCode === "510" ?
            <>
              <div className="col-2 col-md-2 col-lg-2" style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <span className="new-label">
                    Cargo Theft
                    {errors.CargoTheftError !== "true" ? (
                      <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px" }}>
                        {errors.CargoTheftError}
                      </p>
                    ) : null}
                  </span>
                </div>
              </div>

              <div className="custom-col-20">
                <Select
                  name="IsCargoTheftInvolved"
                  value={YesNoArr?.filter((obj) => obj.value === value?.IsCargoTheftInvolved)}
                  options={YesNoArr}
                  menuPlacement="bottom"
                  onChange={(e) => OnChangeCargoTheft(e, "IsCargoTheftInvolved")}
                  isClearable={value?.IsCargoTheftInvolved ? true : false}
                  placeholder="Select..."
                  styles={Requiredcolour}
                />
              </div>
            </>
            :
            <></>
          }

          <div className="col-1"></div>
          <div className="col-12 ">
            <div className="row align-items-center" style={{ rowGap: "8px" }}>
              <div className="custom-col-12 ">
                <label htmlFor="" className="new-label m-0 mb-0 text-nowrap">
                  Comments
                  {errors.CommentsError !== "true" ? (<span style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", }}  >{errors.CommentsError}</span>) : null}
                </label>
              </div>
              <div className="col-10 col-md-10 col-lg-6 text-field mt-0">
                <textarea
                  name="Comments"
                  className={`form-control ${loginAgencyState === "TX" && nibrsCode === "11B" ? "requiredColor" : ""} `}
                  value={value.Comments}
                  onChange={handleChange}
                  id=""
                  cols="30"
                  rows="2"
                  style={{ resize: "none" }}
                ></textarea>
              </div>
            </div>
          </div>
          <div className="col-12 mt-1 ">
            <div className="row align-items-center" style={{ rowGap: "8px" }}>
              <div className="custom-col-12"></div>
              <div className="col-2 col-md-2 col-lg-3 ml-4">
                <input className="form-check-input mr-1" disabled={true} type="checkbox" name="IsCrimeAgainstPerson" checked={isCrimeAgainstPerson} value={isCrimeAgainstPerson} />
                <label htmlFor="">Is Crime Against Person</label>
              </div>
              <div className="col-2 col-md-2 col-lg-3 ">
                <input className="form-check-input mr-1" disabled={true} type="checkbox" name="IsCrimeAgainstProperty" checked={isCrimeAgainstProperty} value={isCrimeAgainstProperty} />
                <label htmlFor="">Is Crime Against Property</label>
              </div>
              <div className="col-2 col-md-2 col-lg-3 ">
                <input className="form-check-input mr-1" disabled={true} type="checkbox" name="IsCrimeAgainstSociety" checked={isCrimeAgainstSociety} value={isCrimeAgainstSociety} />
                <label htmlFor="">Is Crime Against Society</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-1">
        {
          isNibrs999 || nibrsCode === "999" ? null : (
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                border: '1px solid red', backgroundColor: '#ffe6e6', color: isHovered ? 'blue' : 'red',
                padding: '3px', borderRadius: '4px', display: 'inline-block',
                transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
              }}
            >
              Each Offense must have at least one victim Connected
            </div>
          )
        }
      </div>

      <div className="col-12 text-right mb-1 mt-1 field-button  d-flex justify-content-between">
        <div>
          {/* {offenceFillterData?.length > 0 && (
            <button
              type="button"
              onClick={() => nibrsValidateOffense(mainIncidentID, IncNo)}
              className={`btn btn-sm text-white mr-2`}
              style={{ backgroundColor: `${nibrsValidateOffenseData?.length > 0 ? nibrsValidateOffenseData?.length > 0 ? "red" : "green" : "teal"}` }}
            >
              Validate TIBRS Offense
            </button>
          )} */}
        </div>
        <div>
          {OffId ? (
            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => setshowOffPage("CrimeInformation")}>Crime Information</button>
          ) : (
            <></>
          )}
          <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => setStatusFalse()}>New</button>
          {OffId && (OffSta === true || OffSta === "true") ? (
            effectiveScreenPermission ? (
              effectiveScreenPermission[0]?.Changeok ? (
                <button type="button" disabled={!statesChangeStatus} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-4">Update</button>
              ) : (
                <></>
              )
            ) : (
              <button type="button" disabled={!statesChangeStatus} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-4">Update</button>
            )
          )
            :
            effectiveScreenPermission ? (
              effectiveScreenPermission[0]?.AddOK ? (
                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-4">Save</button>
              ) : (
                <></>
              )
            ) : (
              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-4">Save</button>
            )
          }
        </div>
      </div>
      <div className="px-0 mt-2">
        <DataTable
          showHeader={true}
          persistTableHead={true}
          dense
          columns={columns}
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? offenceFillterData : "" : offenceFillterData}
          highlightOnHover
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : "There are no data to display"}
          responsive
          customStyles={tableCustomStyles}
          onRowClicked={(row) => {
            setEditVal(row);
          }}
          conditionalRowStyles={mergedConditionalRowStyles}
          // conditionalRowStyles={conditionalRowStyles1}
          // conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          fixedHeaderScrollHeight="170px"
          pagination
          paginationPerPage={"100"}
          paginationRowsPerPageOptions={[100, 150, 200, 500]}
          showPaginationBottom={100}
        />
      </div>
      {/* <IdentifyFieldColor /> */}
      <ChangesModal func={check_Validation_Error} setToReset={resetEditVal} />
      <DeletePopUpModal func={DeleteOffence} />
      <ListModal {...{ openPage, setOpenPage }} />
      <NirbsErrorShowModal
        ErrorText={nibrsOffErrStr}
        nibErrModalStatus={nibrsErrModalStatus}
        setNibrsErrModalStatus={setNibrsErrModalStatus}
        nibrsValidateloder={nibrsValidateloder}
      />
      {clickNibloder && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
    </>
  );
};

export default Home;

const Get_Nibrs_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) => sponsor.NIBRSCodeId);

  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id };
    }
  });

  const val = result2.filter(function (element) {
    return element !== undefined;
  });

  return val[0]?.id;
};

const Get_PrimaryLocation_Code = (data, dropDownData) => {
  const result = data?.map((sponsor) => sponsor.PrimaryLocationId);

  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id };
    }
  });

  const val = result2.filter(function (element) {
    return element !== undefined;
  });

  return val[0]?.id;
};
