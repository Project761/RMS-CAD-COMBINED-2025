import React, { useContext, useEffect, useRef, useState } from "react";
import { components } from "react-select";
import SelectBox from "../../../Common/SelectBox";
import Select from "react-select";
import {
  get_Inc_ReportedDate,
  get_LocalStoreData,
} from "../../../../redux/actions/Agency";
import { useDispatch, useSelector } from "react-redux";
import { AddDeleteUpadate, fetchPostData, fetchPostDataNibrs, ScreenPermision } from "../../../hooks/Api";
import { Comman_changeArrayFormat, Comman_changeArrayFormatBasicInfo, Comman_changeArrayFormatMethodOfOperation, modifiedFbiCodeArray, threeColArray, threeColArrayWithCode, } from "../../../Common/ChangeArrayFormat";
import { toastifyError, toastifySuccess } from "../../../Common/AlertMsg";
import { base64ToString, Decrypt_Id_Name, getShowingWithOutTime, nibrscolourStyles, MultiSelectRequredColor, stringToBase64, tableCustomStyles, Requiredcolour, Nibrs_ErrorStyle, } from "../../../Common/Utility";
import {
  Bias_90C_Error, check_GangCrime_CrimeCode, check_Valid_Bias_Code, check_Valid_Nibrs_Code, checkCrimeActiSuitableCode, checkCriminalActivityIsRequire,
  checkMethodOfEntryIsRequire, checkWeaponTypeIsRequire, checkWeaponTypeValidate, chekLocationType,
  CrimeActivitySelectSuitableCodesError, CyberspaceLocationError,
  ErrorStyle_CriminalActivity, ErrorStyle_NIBRS_09C, ErrorTooltip,
  MethodOFEntryMandataryError, NotApplicableError,
  ValidateBiasCodeError, ValidateNibrsCodeError,
} from "../../Offense/OffenceTab/ErrorNibrs";
import { RequiredFieldIncident, RequiredForYesNo, } from "../../Utility/Personnel/Validation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AgencyContext } from "../../../../Context/Agency/Index";
import DataTable from "react-data-table-component";
import ChangesModal from "../../../Common/ChangesModal";
import ListModal from "../../Utility/ListManagementModel/ListModal";
import NirbsErrorShowModal from "../../../Common/NirbsErrorShowModal";
import Loader from "../../../Common/Loader";
import DeletePopUpModal from "../../../Common/DeleteModal";

const MultiValue = (props) => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const Offense = ({ offenseClick, isNibrsSummited = false, }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uniqueId = sessionStorage.getItem("UniqueUserID") ? Decrypt_Id_Name(sessionStorage.getItem("UniqueUserID"), "UForUniqueUserID") : "";

  const { get_Offence_Count, updateCount, setUpdateCount, setChangesStatus, get_Offence_Data, nibrsSubmittedStatus, setnibrsSubmittedStatus, nibrsSubmittedOffense, setnibrsSubmittedOffense, changesStatus, get_Incident_Count, setIncidentStatus, setIncStatus, offenceFillterData, setcountoffaduit, validate_IncSideBar } = useContext(AgencyContext);

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);

  const [status, setStatus] = useState();
  const [openPage, setOpenPage] = useState("");
  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [loginPinID, setLoginPinID] = useState("");
  const [nibrsCode, setNibrsCode] = useState("");
  const [offenceID, setOffenceID] = useState("");
  const [editval, setEditval] = useState([]);
  const [crimeOffenderUseDrp, setCrimeOffenderUseDrp] = useState([]);
  const [crimeActivityDrp, setCrimeActivityDrp] = useState([]);
  const [crimeBiasCategoryDrp, setCrimeBiasCategoryDrp] = useState([]);
  const [methodEntryDrp, setMethodEntryDrp] = useState();
  const [weaponDrp, setWeaponDrp] = useState();
  const [crimeActivityNoneStatus, setCrimeActivityNoneStatus] = useState();
  const [crimeActSelectedCodeArray, setCrimeActSelectedCodeArray] = useState([]);
  const [BiasSelectCodeArray, setBiasSelectCodeArray] = useState([]);
  const [WeaponSelectCodeArray, setWeaponSelectCodeArray] = useState([]);
  const [crimeOffenderUseEditVal, setCrimeOffenderUseEditVal] = useState([]);
  const [criminalActivityEditVal, setCriminalActivityEditVal] = useState([]);
  const [crimeBiasCategoryEditVal, setCrimeBiasCategoryEditVal] = useState([]);
  const [weaponEditVal, setweaponEditVal] = useState([]);
  const [crimeOffenderUse, setCrimeOffenderUse] = useState([]);
  const [crimeActivity, setCrimeActivity] = useState([]);
  const [crimeBiasCategory, setCrimeBiasCategory] = useState([]);
  const [weaponID, setWeaponID] = useState([]);
  const [bias09CCodeStatus, setBias09CCodeStatus] = useState(false);
  const [gangInfoDrpVal, setGangInfoDrpVal] = useState([]);
  const [gangInfoVal, setGangInfoVal] = useState([]);
  const [methodOfEntryCode, setMethodOfEntryCode] = useState("");
  // error box
  const [showWeaponError, setShowWeaponError] = useState(true);
  const [showAttempCompError, setShowAttempCompError] = useState(true);
  const [showLocationTypeError, setShowLocationTypeError] = useState(true);
  const [showMethodOfEntryError, setShowMethodOfEntryError] = useState(true);
  const [showCriminalActivityError, setShowCriminalActivityError] = useState(true);
  const [showOffenderUsingError, setShowOffenderUsingError] = useState(true);
  const [showBiasError, setShowBiasError] = useState(true);
  const [showGangInformationError, setShowGangInformationError] = useState(true);
  const [showError, setShowError] = useState(false);

  // Law Title
  const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
  //NIBRS Code
  const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
  // Offense Code/Name
  const [chargeCodeDrp, setChargeCodeDrp] = useState([]);

  const [locationIdDrp, setLocationIdDrp] = useState([]);
  const [crimeId, setCrimeId] = useState("");
  const [mainIncidentID, setMainIncidentID] = useState("");
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [primaryLocationCode, setPrimaryLocationCode] = useState("");
  // --- DS
  const [filteredOptions, setFilteredOptions] = useState(nibrsCodeDrp);
  // nibrs Validate Incident
  const [baseDate, setBaseDate] = useState("");
  const [oriNumber, setOriNumber] = useState("");
  const [nibrsValidateOffenseData, setnibrsValidateOffenseData] = useState([]);
  const [nibrsOffErrStr, setNibrsOffErrStr] = useState("");
  const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
  const [nibrsValidateloder, setnibrsValidateLoder] = useState(false);
  const [clickNibloder, setclickNibLoder] = useState(false);
  const [nibrsFieldError, setnibrsFieldError] = useState({});

  const [isCrimeAgainstPerson, setIsCrimeAgainstPerson] = useState(false);
  const [isCrimeAgainstProperty, setIsCrimeAgainstProperty] = useState(false);
  const [isCrimeAgainstSociety, setIsCrimeAgainstSociety] = useState(false);

  const YesNoArr = [
    { value: 'Y', label: "Yes" },
    { value: 'N', label: "No" },
  ];

  const [value, setValue] = useState({
    ChargeCodeID: "",
    NIBRSCodeId: null,
    OffenseCodeId: null,
    LawTitleId: null,
    OffenderLeftSceneId: null,
    CategoryId: null,
    PrimaryLocationId: null,
    SecondaryLocationId: null,
    FTADate: "",
    Fine: "",
    CourtCost: "",
    FTAAmt: "",
    LitigationTax: "",
    DamageProperty: "",
    OfRoomsInvolved: "",
    PremisesEntered: "",
    PropertyAbandoned: "",
    IsForceused: "",
    IsIncidentCode: false,
    AttemptComplete: "",
    CrimeID: "",
    IncidentID: "",
    CreatedByUserFK: "",
    ModifiedByUserFK: "",
    IsDomesticViolence: "",
    IsGangInfo: "",
    CrimeMethodOfEntryID: "",
    Comments: "",
    IsCargoTheftInvolved: null,
  });

  const [errors, setErrors] = useState({
    NibrsIdError: "", ChargeCodeIDError: "", PremisesEnteredError: "", PrimaryLocationError: "", GangInformationError: '', AttemptRequiredError: "", CommentsError: "", MethodOfEnrtyError: "", WeaponTypeError: "", CriminalActivityError: "",
    OffenderUsingError: "", BiasCategoryError: "", CargoTheftError: "",
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
      setLoginAgencyID(localStoreData?.AgencyID);
      setLoginPinID(localStoreData?.PINID);
      getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
      get_Incident_Count(IncID, localStoreData?.PINID);
      get_MethodOfEntry_DropDown(localStoreData?.AgencyID);
      setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null);
      setOriNumber(localStoreData?.ORI);
    }
  }, [localStoreData]);

  const get_Crime_OffenderUse_Data = (offenceID) => {
    const val = { CrimeID: offenceID };
    fetchPostData("OffenseOffenderUse/GetData_OffenseOffenderUse", val).then(
      (res) => {
        if (res) {
          setCrimeOffenderUseEditVal(Comman_changeArrayFormatBasicInfo(res, "CrimeOffenderUseID", "Description", "PretendToBeID", "OffenderUseID", "OffenderUseCode"));
        } else {
          setCrimeOffenderUseEditVal([]);
        }
      }
    );
  };

  const get_Criminal_Activity_Data = (offenceID) => {
    const val = { CrimeID: offenceID };
    fetchPostData("OffenseCriminalActivity/GetData_OffenseCriminalActivity", val).then(
      (res) => {
        if (res) {
          setCriminalActivityEditVal(Comman_changeArrayFormatBasicInfo(res, "CrimeActivityID", "Description", "PretendToBeID", "ActivityID", "CriminalActivityCode"));
        } else {
          setCriminalActivityEditVal([]);
        }
      }
    );
  };

  const get_Crime_Bias_Category_Data = (offenceID) => {
    const val = { CrimeID: offenceID };
    fetchPostData("OffenseBiasCategory/GetData_OffenseBiasCategory", val).then(
      (res) => {
        if (res) {
          setCrimeBiasCategoryEditVal(Comman_changeArrayFormatBasicInfo(res, "CrimeBiasCategoryID", "Description", "PretendToBeID", "BiasCategoryID", "BiasCode"));
        } else {
          setCrimeBiasCategoryEditVal([]);
        }
      }
    );
  };

  const [methodOfEntryEditVal, setmethodOfEntryEditVal] = useState([]);

  // weapon
  const get_Weapon_Data = (offenceID) => {
    const val = { CrimeID: offenceID };
    fetchPostData("OffenseWeapon/GetData_OffenseWeapon", val).then((res) => {
      if (res) {
        setweaponEditVal(Comman_changeArrayFormatBasicInfo(res, "WeaponTypeID", "Weapon_Description", "PretendToBeID", "CrimeID", "WeaponCode"));
      } else {
        setweaponEditVal([]);
      }
    });
  };

  const get_MethodOfEntry_Data = (offenceID) => {
    const val = { CrimeID: offenceID };
    fetchPostData("OffenseMethodOfEntry/GetData_OffenseMethodOfEntry", val).then((res) => {
      if (res) {
        setmethodOfEntryEditVal(Comman_changeArrayFormatMethodOfOperation(res, "MethodOfEntryID", "CrimeID", "PretendToBeID", "CrimeMethodOfEntryID", "MethodOfEntry_Description"));
      } else {
        setmethodOfEntryEditVal([]);
      }
    });
  };

  useEffect(() => {
    if (crimeOffenderUseEditVal) {
      setCrimeOffenderUse(crimeOffenderUseEditVal);
    }
  }, [crimeOffenderUseEditVal]);

  useEffect(() => {
    if (methodOfEntryEditVal) {
      setMethodOfEntryCode(methodOfEntryEditVal[0]?.value);
    }
  }, [methodOfEntryEditVal]);

  useEffect(() => {
    if (criminalActivityEditVal) {
      setCrimeActivity(criminalActivityEditVal);
      const noneStatus = criminalActivityEditVal?.filter((item) => {
        if (item?.code === "N") {
          return true;
        }
      });
      setCrimeActivityNoneStatus(noneStatus?.length > 0);
      const crimeActivityCodesArray = criminalActivityEditVal?.map((item) => {
        return item?.code;
      });
      setCrimeActSelectedCodeArray(crimeActivityCodesArray);
    }
  }, [criminalActivityEditVal]);

  useEffect(() => {
    if (crimeBiasCategoryEditVal) {
      setCrimeBiasCategory(crimeBiasCategoryEditVal);
      const BiasCodesArray = crimeBiasCategoryEditVal?.map((item) => {
        return item?.code;
      });
      const Bias09CCode = crimeBiasCategoryEditVal?.map((item) => {
        return item?.code === "88";
      });
      setBias09CCodeStatus(Bias09CCode?.length > 0);
      setBiasSelectCodeArray(BiasCodesArray);
    }
  }, [crimeBiasCategoryEditVal]);

  useEffect(() => {
    if (weaponEditVal) {
      setWeaponID(weaponEditVal);
      const WeaponCodesArray = weaponEditVal?.map((item) => {
        return item?.code;
      });
      setWeaponSelectCodeArray(WeaponCodesArray);
    }
  }, [weaponEditVal]);

  const Weaponchange = (multiSelected) => {
    setWeaponID(multiSelected);
    const len = multiSelected.length - 1;
    if (multiSelected?.length < weaponEditVal?.length) {
      let missing = null;
      let i = weaponEditVal.length;
      while (i) {
        missing = ~multiSelected.indexOf(weaponEditVal[--i])
          ? missing
          : weaponEditVal[i];
      }

    } else {

    }
  };

  const CrimeActivitychange = (multiSelected) => {
    setCrimeActivity(multiSelected);
    const len = multiSelected.length - 1;
    if (multiSelected?.length < criminalActivityEditVal?.length) {
      let missing = null;
      let i = criminalActivityEditVal.length;
      while (i) {
        missing = ~multiSelected.indexOf(criminalActivityEditVal[--i])
          ? missing
          : criminalActivityEditVal[i];
      }

    } else {

    }
  };

  const CrimeBiasCategorychange = (multiSelected) => {
    setCrimeBiasCategory(multiSelected);
    const len = multiSelected.length - 1;
    if (multiSelected?.length < crimeBiasCategoryEditVal?.length) {
      let missing = null;
      let i = crimeBiasCategoryEditVal.length;
      while (i) {
        missing = ~multiSelected.indexOf(crimeBiasCategoryEditVal[--i])
          ? missing
          : crimeBiasCategoryEditVal[i];
      }
    } else {
    }
  };

  const OffenderUsechange = (multiSelected) => {
    const status = multiSelected?.filter((item) => {
      if (item.id === "N") return item;
    });
    if (status?.length > 0) {
      setCrimeOffenderUse(status);
    } else {
      setCrimeOffenderUse(multiSelected);
    }
    setCrimeOffenderUse(multiSelected);
    const len = multiSelected.length - 1;
    if (multiSelected?.length < crimeOffenderUseEditVal?.length) {
      let missing = null;
      let i = crimeOffenderUseEditVal.length;
      while (i) {
        missing = ~multiSelected.indexOf(crimeOffenderUseEditVal[--i])
          ? missing
          : crimeOffenderUseEditVal[i];
      }

    } else {

    }
  };


  useEffect(() => {
    if (openPage || loginAgencyID) {
      getCrimeOffenderUseDrpVal(loginAgencyID);
      getCrimeActivityDrpVal(loginAgencyID);
      get_Weapon_DropDown(loginAgencyID);
      getGangInfoDrp(loginAgencyID);
      getCrimeBiasCategoryDrpVal(loginAgencyID);
    }
  }, [openPage, loginAgencyID]);

  const getCrimeOffenderUseDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData(
      "CrimeOffenderUse/GetDataDropDown_CrimeOffenderUse",
      val
    ).then((data) => {
      if (data) {
        setCrimeOffenderUseDrp(
          threeColArrayWithCode(
            data,
            "OffenderUseID",
            "Description",
            "OffenderUseCode"
          )
        );
      } else {
        setCrimeOffenderUseDrp([]);
      }
    });
  };

  const getCrimeActivityDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData(
      "CriminalActivity/GetDataDropDown_CriminalActivity",
      val
    ).then((data) => {
      if (data) {
        setCrimeActivityDrp(
          threeColArrayWithCode(
            data,
            "CriminalActivityID",
            "Description",
            "CriminalActivityCode"
          )
        );
      } else {
        setCrimeActivityDrp([]);
      }
    });
  };

  const getCrimeBiasCategoryDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("CrimeBias/GetDataDropDown_CrimeBias", val).then((data) => {
      if (data) {

        setCrimeBiasCategoryDrp(
          threeColArrayWithCode(data, "BiasID", "Description", "BiasCode")
        );
      } else {
        setCrimeBiasCategoryDrp([]);
      }
    });
  };

  const get_Weapon_DropDown = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("OffenseWeapon/GetData_InsertOffenseWeapon", val).then(
      (data) => {
        if (data) {
          setWeaponDrp(
            threeColArrayWithCode(data, "WeaponID", "Description", "WeaponCode")
          );
        } else {
          setWeaponDrp([]);
        }
      }
    );
  };

  const get_MethodOfEntry_DropDown = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData(
      "OffenseMethodOfEntry/GetData_InsertGetData_OffenseMethodOfEntry",
      val
    ).then((data) => {
      if (data) {
        setMethodEntryDrp(
          threeColArrayWithCode(
            data,
            "EntryMethodID",
            "Description",
            "MethodOfEntryCode"
          )
        );
      } else {
        setMethodEntryDrp([]);
      }
    });
  };

  function filterArray(arr, key) {
    return [...new Map(arr?.map((item) => [item[key], item])).values()];
  }

  const getWeaponDrpData = (data, nibrsCode, weaponID) => {
    const weaponValues = weaponID?.map((item) => item?.code);
    if (loginAgencyState === "TX" && nibrsCode == "13B") {
      const weaponData = data.filter((item) => {
        if (
          item?.id === "99" ||
          item?.id === "40" ||
          item?.id === "90" ||
          item?.id === "95"
        )
          return item;
      });
      return weaponData;
    }
    // else if (loginAgencyState === "TX" && nibrsCode == "13A") {
    //   const weaponData = data.filter((item) => {
    //     if (
    //       item?.id === "11" ||
    //       item?.id === "12" ||
    //       item?.id === "13" ||
    //       item?.id === "14" ||
    //       item?.id === "15"
    //     )
    //       return item;
    //   });
    //   const otherFilterArr = weaponData?.filter(
    //     (item) => !weaponValues?.includes(item?.id)
    //   );

    //   return otherFilterArr;
    // }
    else if (
      loginAgencyState === "TX" &&
      (nibrsCode === "09A" || nibrsCode === "09B" || nibrsCode === "09C")
    ) {
      const weaponData = data.filter((item) => {
        if (item?.id != "77" && item?.id != "99") return item;
      });
      return weaponData;
    } else {
      return data;
    }
  };

  const get_CriminalActivity_DrpData = (data) => {
    const nibrsCodeArray = ["09A", "09B", "100", "120", "11A", "11B", "11C", "11D", "13A", "13B", "13C",];
    const suitablecodes = ["250", "280", "30C", "35A", "35B", "39C", "370", "49A", "520", "521", "522", "526", "58A", "58B", "61A", "61B", "620",];
    const AnimalCrueltyCode = ["720"];
    if (loginAgencyState === "TX" && suitablecodes?.includes(nibrsCode)) {
      const crimeActiDrpData = data.filter((item) => {
        if (item?.id === "B" || item?.id === "C" || item?.id === "D" || item?.id === "E" || item?.id === "O" || item?.id === "P" || item?.id === "T" || item?.id === "U")
          return item;
      });
      return crimeActiDrpData;
    } else if (
      loginAgencyState === "TX" &&
      AnimalCrueltyCode?.includes(nibrsCode)
    ) {
      const crimeActiDrpData = data.filter((item) => {
        if (
          item?.id === "A" ||
          item?.id === "F" ||
          item?.id === "I" ||
          item?.id === "S"
        )
          return item;
      });
      return crimeActiDrpData;
    } else {
      return data;
    }
  };

  const getBiasDrpData = (data) => {
    // if (loginAgencyState === "TX" && nibrsCode === "09A" && nibrsCode === "09B" && nibrsCode === "09C") {
    if (loginAgencyState === "TX" && nibrsCode === "09C") {
      const biasData = data.filter((item) => { if (item.id == "88") return item; });
      return biasData;
    } else {
      return data;
    }
  };

  // Check NotApplicable Offender Using Drp Data
  const getCheckNotApplicable = () => {
    if (loginAgencyState === "TX") {
      let offenderUsingValues = filterArray(crimeOffenderUse, "label");

      const status = offenderUsingValues?.filter((item) => {
        if (item.code === "N") return item;
      });
      return status?.length > 0 && offenderUsingValues?.length > 1
        ? true
        : false;
    } else {
      return false;
    }
  };

  const getOffenderUsingDrpData = (data) => {
    if (loginAgencyState === "TX") {
      let offenderUsingValues = filterArray(crimeOffenderUse, "label");
      const status = offenderUsingValues?.filter((item) => {
        if (item.code === "N") return item;
      });
      return status?.length > 0 ? [] : data;
    } else {
      return data;
    }
  };

  useEffect(() => {
    if (IncID) {
      setValue({
        ...value,
        IncidentID: IncID, CreatedByUserFK: "", ChargeCodeID: "", NIBRSCodeId: null, OffenseCodeId: null, LawTitleId: null, OffenderLeftSceneId: null, CategoryId: null, PrimaryLocationId: null, SecondaryLocationId: null, FTADate: "", Fine: "", CourtCost: "", FTAAmt: "", LitigationTax: "", DamageProperty: "", OfRoomsInvolved: "", PremisesEntered: "", PropertyAbandoned: "", IsForceused: "", IsIncidentCode: false, AttemptComplete: "", CrimeID: "", ModifiedByUserFK: "", Comments: "", IsCargoTheftInvolved: ''
      });
      get_Offence_Data(IncID);
      setMainIncidentID(IncID);

      if (!incReportedDate) {
        dispatch(get_Inc_ReportedDate(IncID));
      }
    }
  }, [IncID]);

  useEffect(() => {
    if (OffId && (OffSta === true || OffSta === "true")) {
      setCrimeId(parseInt(OffId));
      setOffenceID(parseInt(OffId));
      GetSingleData(parseInt(OffId));
    }
  }, [OffId, OffSta]);

  const nibrsCodeValue = ["09A", "09B", "100", "120", "11A", "11B", "11C", "11D", "13A", "13B", "13C"]

  const check_Validation_Error = (e) => {
    if (value?.SecondaryLocationId && value?.PrimaryLocationId === value?.SecondaryLocationId) {
      toastifyError("The primary location and secondary location cannot be the same.");
      return;
    }

    const MethodOfEnrtyErr = checkMethodOfEntryIsRequire(nibrsCode, loginAgencyState) ? validateFieldsMethodOfEntry(value.CrimeMethodOfEntryID) : "true";
    const WeaponTypeErr = checkWeaponTypeIsRequire(nibrsCode, loginAgencyState) ? validateFields(weaponID) : "true";
    const CriminalActivityErr = checkCriminalActivityIsRequire(nibrsCode, loginAgencyState) ? validateFields(crimeActivity) : "true";
    const GangInformationError = loginAgencyState === "TX" && isGangDisabled(nibrsCode) && value?.NIBRSCodeId ? RequiredFieldIncident(value?.IsGangInfo) : "true";

    // const OffenderUsingErr = validateFields(crimeOffenderUse);
    // const BiasCategoryErr = validateFields(crimeBiasCategory);

    const OffenderUsingErr = nibrsCode != "999" ? validateFields(crimeOffenderUse) : 'true';
    const BiasCategoryErr = nibrsCode != "999" ? validateFields(crimeBiasCategory) : 'true';

    const NibrsIdErrorr = RequiredFieldIncident(value.NIBRSCodeId);
    const ChargeCodeIDErr = value?.NIBRSCodeId ? RequiredFieldIncident(value?.ChargeCodeID) : "true";
    const PremisesEnteredErr = nibrsCode === "220" && (primaryLocationCode === "14" || primaryLocationCode === "19") && loginAgencyState === "TX" ? RequiredFieldIncident(value?.PremisesEntered) : "true";
    const PrimaryLocationErr = check_Valid_Nibrs_Code(nibrsCode) ? "true" : RequiredFieldIncident(value?.PrimaryLocationId);
    const AttemptRequiredErr = RequiredFieldIncident(value?.AttemptComplete);
    const CommentsErr = nibrsCode === "11B" && loginAgencyState === "TX" ? RequiredFieldIncident(value?.Comments) : "true";
    const CargoTheftErrorErr = !nibrsCode === "220" || nibrsCode === "210" || nibrsCode === "120" || nibrsCode === "23D" || nibrsCode === "23F" || nibrsCode === "23H" || nibrsCode === "240" || nibrsCode === "26A" || nibrsCode === "26A" || nibrsCode === "23D" || nibrsCode === "26C" || nibrsCode === "26E" || nibrsCode === "26F" || nibrsCode === "26G" || nibrsCode === "270" || nibrsCode === "510" ? RequiredFieldIncident(value?.IsCargoTheftInvolved) : "true";


    setErrors((pre) => {
      return {
        ...pre,
        ["MethodOfEnrtyError"]: MethodOfEnrtyErr || pre["MethodOfEnrtyError"],
        ["WeaponTypeError"]: WeaponTypeErr || pre["WeaponTypeError"],
        ["CriminalActivityError"]: CriminalActivityErr || pre["CriminalActivityError"],
        ["NibrsIdError"]: NibrsIdErrorr || pre["NibrsIdError"],
        ["ChargeCodeIDError"]: ChargeCodeIDErr || pre["ChargeCodeIDError"],
        ["PremisesEnteredError"]: PremisesEnteredErr || pre["PremisesEnteredError"],
        ["PrimaryLocationError"]: PrimaryLocationErr || pre["PrimaryLocationError"],
        ["AttemptRequiredError"]: AttemptRequiredErr || pre["AttemptRequiredError"],
        ["CommentsError"]: CommentsErr || pre["CommentsError"],
        ["CargoTheftError"]: CargoTheftErrorErr || pre["CargoTheftError"],

        ["OffenderUsingError"]: OffenderUsingErr || pre["OffenderUsingError"],
        ["BiasCategoryError"]: BiasCategoryErr || pre["BiasCategoryError"],
        ["GangInformationError"]: GangInformationError || pre["GangInformationError"],
      };
    });
  };

  // Check All Field Format is True Then Submit
  const { MethodOfEnrtyError, WeaponTypeError, CriminalActivityError, GangInformationError, ChargeCodeIDError, NibrsIdError, PremisesEnteredError, AttemptRequiredError, PrimaryLocationError, CommentsError, OffenderUsingError, BiasCategoryError, CargoTheftError } = errors;

  useEffect(() => {
    if (MethodOfEnrtyError === "true" && WeaponTypeError === "true" && CriminalActivityError === "true" && GangInformationError === "true" && ChargeCodeIDError === "true" && NibrsIdError === "true" && PremisesEnteredError === "true" && AttemptRequiredError === "true" && PrimaryLocationError === "true" && CommentsError === "true" && OffenderUsingError === "true" && BiasCategoryError === "true" && CargoTheftError === "true") {
      if (OffId && (OffSta === true || OffSta === "true")) {
        Update_Offence();
      } else {
        Add_Offense();
      }
    }
  }, [MethodOfEnrtyError, WeaponTypeError, CriminalActivityError, ChargeCodeIDError, GangInformationError, NibrsIdError, PremisesEnteredError, PrimaryLocationError, AttemptRequiredError, CommentsError, OffenderUsingError, BiasCategoryError, CargoTheftError]);

  const getScreenPermision = (LoginAgencyID, PinID) => {
    ScreenPermision("O036", LoginAgencyID, PinID).then((res) => {
      if (res) {
        setEffectiveScreenPermission(res);

      } else {
        setEffectiveScreenPermission([]);
      }
    });
  };

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
      } else {
        setEditval();
      }
    });
  };

  useEffect(() => {
    if (crimeId) {
      if (editval?.length > 0) {
        setcountoffaduit(true);
        setValue({
          ...value,
          CrimeID: editval[0]?.CrimeID,
          NIBRSCodeId: editval[0]?.NIBRSCodeId,
          ChargeCodeID: editval[0]?.ChargeCodeID,
          LawTitleId: editval[0]?.LawTitleId,
          OffenseCodeId: editval[0]?.OffenseCodeId,
          PrimaryLocationId: editval[0]?.PrimaryLocationId,
          SecondaryLocationId: editval[0]?.SecondaryLocationId,
          OffenderLeftSceneId: editval[0]?.OffenderLeftSceneId,
          CategoryId: editval[0]?.CategoryId,
          clickedRow: editval[0]?.clickedRow,
          // text Box
          Fine: editval[0]?.Fine ? editval[0]?.Fine : "",
          CourtCost: editval[0]?.CourtCost ? editval[0]?.CourtCost : "",
          FTAAmt: editval[0]?.FTAAmt ? editval[0]?.FTAAmt : "",
          LitigationTax: editval[0]?.LitigationTax ? editval[0]?.LitigationTax : "",
          DamageProperty: editval[0]?.DamageProperty ? editval[0]?.DamageProperty : "",
          OfRoomsInvolved: editval[0]?.OfRoomsInvolved ? editval[0]?.OfRoomsInvolved : "",
          PremisesEntered: editval[0]?.PremisesEntered ? editval[0]?.PremisesEntered : "",
          Comments: editval[0]?.Comments ? editval[0]?.Comments : "",
          'IsCargoTheftInvolved': editval[0]?.IsCargoTheftInvolved || editval[0]?.IsCargoTheftInvolved === "Y" ? editval[0]?.IsCargoTheftInvolved === "N" ? "N" : "Y" : "",
          // Checkbox
          PropertyAbandoned: editval[0]?.PropertyAbandoned,
          IsForceused: editval[0]?.IsForceused === "N" || editval[0]?.IsForceused === null || editval[0]?.IsForceused === "" ? false : true,
          IsIncidentCode: editval[0]?.IsIncidentCode,
          //Radio Button
          AttemptComplete: editval[0]?.AttemptComplete === "Completed" ? "C" : editval[0]?.AttemptComplete === "Attempted" ? "A" : "",
          IsDomesticViolence: editval[0]?.IsDomesticViolence,
          IsGangInfo: editval[0]?.IsGangInfo,
          CrimeMethodOfEntryID: editval[0]?.CrimeMethodOfEntryID,
          //Date picker
          FTADate: editval[0]?.FTADate ? getShowingWithOutTime(editval[0]?.FTADate) : "",
          // other
          ModifiedByUserFK: loginPinID,
          CreatedByUserFK: loginPinID,
        });
        setGangInfoVal(filterGangsUsingIncludes(gangInfoDrpVal, editval[0]?.IsGangInfo));
        setnibrsSubmittedOffense(editval[0]?.IsNIBRSSummited);
        // nibrs code
        (async () => {
          const drpData = await NIBRSCodeDrpDwnVal(loginAgencyID, editval[0]?.LawTitleId);
          setNibrsCode(Get_Nibrs_Code(editval, drpData));
        })();
        // charge code / offence code name
        getChargeCodeIDDrp(loginAgencyID, editval[0]?.NIBRSCodeId, editval[0]?.LawTitleId);
        setPrimaryLocationCode(Get_PrimaryLocation_Code(editval, locationIdDrp));
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

  const Reset = () => {
    setValue({
      ...value,
      ChargeCodeID: "", LawTitleId: "", OffenseCodeId: "", NIBRSCodeId: "", OffenderLeftSceneId: "", CategoryId: "", PrimaryLocationId: "", SecondaryLocationId: "", Fine: "", CourtCost: "", FTAAmt: "", LitigationTax: "", DamageProperty: "", OfRoomsInvolved: "", PremisesEntered: "", PropertyAbandoned: "", IsForceused: "", AttemptComplete: "", FTADate: "",
      CrimeID: "", IsDomesticViolence: "", IsGangInfo: "", CrimeMethodOfEntryID: "", Comments: "", WeaponTypeID: "", CrimeMethodOfEntryID: "", CrimeBiasCategoryID: "", CrimeActivityID: "", IsCargoTheftInvolved: '',
    });
    setWeaponID([]);
    setCrimeBiasCategory([]);
    setCrimeOffenderUse([]);
    setCrimeActivity([]);
    setErrors({
      ...errors,
      ChargeCodeIDError: "", NibrsIdError: "", PremisesEnteredError: "", PrimaryLocationError: "", AttemptRequiredError: "", CommentsError: "", CriminalActivityError: "", MethodOfEnrtyError: "", WeaponTypeError: "",
      OffenderUsingError: "", BiasCategoryError: "", CargoTheftError: '', GangInformationError: '',
    });
    setCrimeId("");
    setChargeCodeDrp([]);
    setChangesStatus(false);
    setStatesChangeStatus(false);
    setPrimaryLocationCode("");
    setNibrsCode("");
    setIsCrimeAgainstSociety(false); setIsCrimeAgainstProperty(false); setIsCrimeAgainstPerson(false);

    setGangInfoVal([]);
    //law title
    LawTitleIdDrpDwnVal(loginAgencyID, null);
    // nibrs code
    NIBRSCodeDrpDwnVal(loginAgencyID, null);
    // charge / offence codeName
    getChargeCodeIDDrp(loginAgencyID, 0, 0);
    setShowCriminalActivityError(true);
    setShowError(false);
    setnibrsFieldError([]);
  };

  const changeDropDown = (e, name) => {
    if (e) {
      setChangesStatus(true);
      setStatesChangeStatus(true);
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
        setPrimaryLocationCode("");
        setValue({ ...value, [name]: null });
        setValue((pre) => ({ ...pre, ["SecondaryLocationId"]: null }));
        setErrors({ ...errors, PremisesEnteredError: "" });
      } else {
        setValue({ ...value, [name]: null });
      }
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  useEffect(() => {
    if (openPage || loginAgencyID) {
      LocationIdDrpDwnVal(loginAgencyID);
      // lawtitle dpr
      LawTitleIdDrpDwnVal(loginAgencyID, null);
      // NIBRSCodeId
      NIBRSCodeDrpDwnVal(loginAgencyID, 0);
      // charge / offence codeName
      getChargeCodeIDDrp(loginAgencyID, 0, 0);
    }
  }, [loginAgencyID, openPage]);

  const LocationIdDrpDwnVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID };
    fetchPostData("LocationType/GetDataDropDown_LocationType", val).then(
      (data) => {
        if (data) setLocationIdDrp(threeColArray(data, "LocationTypeID", "Description", "LocationTypeCode"));
        else setLocationIdDrp([]);
      }
    );
  };

  // ChargeCodeID
  const LawTitleIdDrpDwnVal = async (loginAgencyID, ChargeCodeID) => {
    const val = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID };
    await fetchPostData("LawTitle/GetDataDropDown_LawTitle", val).then(
      (data) => {
        if (data) setLawTitleIdDrp(Comman_changeArrayFormat(data, "LawTitleID", "Description"));
        else setLawTitleIdDrp([]);
      }
    );
  };

  const NIBRSCodeDrpDwnVal = async (loginAgencyID, LawTitleID) => {
    const val = {
      AgencyID: loginAgencyID,
      LawTitleID: LawTitleID ?? null,
      IncidentID: mainIncidentID,
    };
    const data = await fetchPostData("FBICodes/GetDataDropDown_FBICodes", val);
    const drpData = data ? modifiedFbiCodeArray(data, "FBIID", "Description", "FederalSpecificFBICode", "IsCrimeAgains_Person", "IsCrimeAgainstProperty", "IsCrimeAgainstSociety") : [];
    setNibrsCodeDrp(drpData);
    return drpData;
  };

  const getChargeCodeIDDrp = (loginAgencyID, NIBRSCodeId, LawTitleID) => {
    const val = {
      AgencyID: loginAgencyID,
      FBIID: NIBRSCodeId,
      LawTitleID: LawTitleID,
    };
    fetchPostData("ChargeCodes/GetDataDropDown_ChargeCodes", val).then(
      (data) => {
        if (data) setChargeCodeDrp(Comman_changeArrayFormat(data, "ChargeCodeID", "Description"));
        else setChargeCodeDrp([]);
      }
    );
  };

  const getLawTitleNibrsByCharge = async (
    loginAgencyID,
    lawTitleID,
    chargeCodeId
  ) => {
    const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: chargeCodeId };
    const nibrsCodeObj = {
      AgencyID: loginAgencyID,
      LawTitleID: null,
      IncidentID: mainIncidentID,
      ChargeCodeID: chargeCodeId,
    };
    try {
      const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
        fetchPostData("LawTitle/GetDataDropDown_LawTitle", lawTitleObj),
        fetchPostData("FBICodes/GetDataDropDown_FBICodes", nibrsCodeObj),
      ]);
      const lawTitleArr = Comman_changeArrayFormat(
        lawTitleResponse,
        "LawTitleID",
        "Description"
      );
      const nibrsArr = threeColArrayWithCode(
        nibrsCodeResponse,
        "FBIID",
        "Description",
        "FederalSpecificFBICode"
      );
      setNibrsCodeDrp(nibrsArr);
      setValue({
        ...value,
        LawTitleId: lawTitleArr[0]?.value,
        NIBRSCodeId: nibrsArr[0]?.value,
        ChargeCodeID: chargeCodeId,
      });
      const isSingleEntry = lawTitleArr.length === 1 && nibrsArr.length === 1;
    } catch (error) {
      console.error("Error during data fetching:", error);
    }
  };

  const onChangeDrpLawTitle = async (e, name) => {
    setChangesStatus(true);
    setStatesChangeStatus(true);
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
        const res = await getLawTitleNibrsByCharge(
          loginAgencyID,
          value?.LawTitleId,
          e.value
        );
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
    setChangesStatus(true);
    setStatesChangeStatus(true);
    if (e) {
      if (name === "NIBRSCodeId") {
        if ((e.id === "09C" || e.id === "360" || e.id === "09A" || e.id === "09B" || e.id === "13A" || e.id === "13B" || e.id === "13C") && loginAgencyState === "TX") {
          setNibrsCode(e.id);
          setValue({ ...value, ["NIBRSCodeId"]: e.value, ["ChargeCodeID"]: null, AttemptComplete: "C", });
          setChargeCodeDrp([]);

          getChargeCodeIDDrp(loginAgencyID, e.value, value?.LawTitleId);
        } else {
          setNibrsCode(e.id);
          setValue({ ...value, ["NIBRSCodeId"]: e.value, ["ChargeCodeID"]: null, });
          setChargeCodeDrp([]);

          getChargeCodeIDDrp(loginAgencyID, e.value, value?.LawTitleId);
        }
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      setChangesStatus(true);
      if (name === "NIBRSCodeId") {
        setValue({ ...value, [name]: null, ["ChargeCodeID"]: null, ["CrimeMethodOfEntryID"]: null, });
        setErrors({ ...errors, ChargeCodeIDError: "", PremisesEnteredError: "", });
        NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
        getChargeCodeIDDrp(loginAgencyID, null, value?.LawTitleId);
        // nibrs Errors States
        setNibrsCode("");
        setPrimaryLocationCode("");
        setChargeCodeDrp([]);
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  };

  useEffect(() => {
    if (status) setValue({ ...value, ["FTADate"]: "" });
  }, []);

  const Add_Offense = async () => {
    const {
      ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId, PrimaryLocationId, IsCargoTheftInvolved,
      SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt, LitigationTax, DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned,
      IsForceused, IsIncidentCode, AttemptComplete, CrimeID, IncidentID, CreatedByUserFK, ModifiedByUserFK, IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID, Comments,
    } = value;
    const val = {
      ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId, PrimaryLocationId, IsCargoTheftInvolved,
      SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt, LitigationTax, DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned, IsForceused, IsIncidentCode, AttemptComplete, CrimeID, IncidentID: mainIncidentID,
      CreatedByUserFK: loginPinID, ModifiedByUserFK: "", IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID, Comments,
      CrimeActivityID: crimeActivity?.map((item) => item?.value),
      CrimeMethodOfEntryID: value?.CrimeMethodOfEntryID,
      WeaponTypeID: weaponID?.map((item) => item?.value),

      CrimeOffenderUseID: crimeOffenderUse?.map((item) => item?.value),
      CrimeBiasCategoryID: crimeBiasCategory?.map((item) => item?.value),
    };
    try {
      const res = await AddDeleteUpadate("NIBRSData/Insert_Offense", val);
      if (res.success) {
        Reset();
        if (res?.CrimeID) {
          navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(res?.CrimeID)}&OffSta=${true}`);
          get_Offence_Data(mainIncidentID);
          get_Offence_Count(res?.CrimeID);

          get_Criminal_Activity_Data(res?.CrimeID);
          get_Crime_Bias_Category_Data(res?.CrimeID);
          get_Crime_OffenderUse_Data(res?.CrimeID);
          get_MethodOfEntry_Data(res?.CrimeID);
          get_Weapon_Data(res?.CrimeID);

          // Validate Offense
          ValidateOffense(IncID);
          NibrsErrorReturn(res?.CrimeID);
          // validateIncSideBar
          validate_IncSideBar(IncID, IncNo, loginAgencyID);
        }
        setChangesStatus(false);
        setStatesChangeStatus(false);

      }
      LawTitleIdDrpDwnVal(loginAgencyID, null); NIBRSCodeDrpDwnVal(loginAgencyID, null); toastifySuccess(res.Message);
      get_Offence_Data(mainIncidentID); get_Incident_Count(IncID, loginPinID);

    } catch (error) {
      toastifyError("An error occurred while adding the offense.");
    } finally {
      setUpdateCount(updateCount + 1);
      setErrors({ ...errors, ["ChargeCodeIDError"]: "", CommentsError: "" });
    }
  };

  const Update_Offence = async () => {
    const {
      ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId, IsCargoTheftInvolved, PrimaryLocationId, SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt, LitigationTax, DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned, IsForceused, IsIncidentCode, AttemptComplete, CrimeID, IncidentID, CreatedByUserFK, ModifiedByUserFK, IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID, Comments,
    } = value;
    const val = {
      ChargeCodeID, NIBRSCodeId, OffenseCodeId, LawTitleId, OffenderLeftSceneId, CategoryId, PrimaryLocationId, IsCargoTheftInvolved, SecondaryLocationId, FTADate, Fine, CourtCost, FTAAmt, LitigationTax, DamageProperty, OfRoomsInvolved, PremisesEntered, PropertyAbandoned, IsForceused, IsIncidentCode, AttemptComplete, CrimeID, IncidentID: mainIncidentID, CreatedByUserFK: loginPinID, ModifiedByUserFK: loginPinID, IsDomesticViolence, IsGangInfo, CrimeMethodOfEntryID, Comments,
      CrimeActivityID: crimeActivity?.map((item) => item?.value),
      CrimeMethodOfEntryID: value?.CrimeMethodOfEntryID,
      WeaponTypeID: weaponID?.map((item) => item?.value),

      CrimeBiasCategoryID: crimeBiasCategory?.map((item) => item?.value),
      CrimeOffenderUseID: crimeOffenderUse?.map((item) => item?.value),
    };
    try {
      const res = await AddDeleteUpadate("NIBRSData/Insert_Offense", val);
      if (res.success) {
        Reset();
        toastifySuccess(res.Message); setChangesStatus(false);
        setStatesChangeStatus(false); get_Offence_Data(IncID); setStatusFalse();
        setErrors({ ...errors, ["ChargeCodeIDError"]: "", CommentsError: "" });
        get_Offence_Count(offenceID);

        // Validate Offense

        ValidateOffense(IncID);
        NibrsErrorReturn(CrimeID);
        // validateIncSideBar
        validate_IncSideBar(IncID, IncNo, loginAgencyID);
      }
      LawTitleIdDrpDwnVal(loginAgencyID, null); NIBRSCodeDrpDwnVal(loginAgencyID, null);


    } catch (error) {
      toastifyError("An error occurred while updating the offense.");
    } finally {
      setErrors({ ...errors, ["ChargeCodeIDError"]: "", CommentsError: "" });
    }
  };

  const setStatusFalse = (e) => {
    navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${0}&OffSta=${false}`);
    NIBRSCodeDrpDwnVal(loginAgencyID, 0);
    setStatus(false); Reset(); setnibrsSubmittedOffense(0);
  };

  useEffect(() => {
    if (offenceFillterData?.length > 0) {
      const arrestChargeCounts = offenceFillterData.map(item => item.ArrestChargeCount);
      // SetDeleteshowCounts(arrestChargeCounts);
    }
  }, [offenceFillterData]);

  const columns = [
    {
      name: "NIBRS Code", selector: (row) => row.FBIID_Description, sortable: true,
    },
    {
      name: "Offense Code", selector: (row) => row.OffenseName_Description, sortable: true,
    },
    {
      name: "Law Title", selector: (row) => row.LawTitle_Description, sortable: true,
    },
    {
      width: "100px",
      name: "View",
      cell: (row) => (
        <div style={{ position: "absolute", top: 4 }}>

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
    },

    // {
    //   name: (
    //     <p
    //       className="text-end"
    //       style={{ position: "absolute", top: "7px", right: 30 }}
    //     >
    //       Action
    //     </p>
    //   ),
    //   cell: (row) => (
    //     <div style={{ position: "absolute", top: 4, right: 30 }}>
    //       {effectiveScreenPermission ? (
    //         effectiveScreenPermission[0]?.DeleteOK ? (
    //           <span
    //             onClick={(e) => setOffenceID(row.CrimeID)}
    //             className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
    //             data-toggle="modal"
    //             data-target="#DeleteModal"
    //           >
    //             <i className="fa fa-trash"></i>
    //           </span>
    //         ) : (
    //           <></>
    //         )
    //       ) : (
    //         <span
    //           onClick={(e) => setOffenceID(row.CrimeID)}
    //           className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
    //           data-toggle="modal"
    //           data-target="#DeleteModal"
    //         >
    //           <i className="fa fa-trash"></i>
    //         </span>
    //       )}
    //     </div>
    //   ),
    // },
    {
      name: (
        <p
          className="text-end"
          style={{ position: "absolute", top: "7px", right: 30 }}
        >
          Action
        </p>
      ),
      cell: (row) => (
        <div style={{ position: "absolute", top: 4, right: 30 }}>
          {row.ArrestChargeCount === "0" && (
            effectiveScreenPermission ? (
              effectiveScreenPermission[0]?.DeleteOK ? (
                <span
                  onClick={() => setOffenceID(row.CrimeID)}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                  data-toggle="modal"
                  data-target="#DeleteModal"
                >
                  <i className="fa fa-trash"></i>
                </span>
              ) : null
            ) : (
              <span
                onClick={() => setOffenceID(row.CrimeID)}
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

  const getOffenseNibrsError = (crimeId, nibrsValidateOffenseData) => {
    const arr = nibrsValidateOffenseData?.filter((item) => item?.CrimeID === crimeId);
    return arr?.[0]?.OnPageError;
  };

  const setOffenseErrString = (CrimeID, nibrsValidateOffenseData) => {
    const arr = nibrsValidateOffenseData?.filter((item) => item?.CrimeID === CrimeID);
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

  const conditionalRowStyles1 = [
    {
      when: () => true,
      style: (row) => getStatusColors(row.FBICode),
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

  const setEditVal = (row) => {
    get_Weapon_Data(row?.CrimeID);
    setOffenceID(row?.CrimeID);
    setStatesChangeStatus(false);
    navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(row?.CrimeID)}&OffSta=${true}`);
    setErrors({ ...errors, ChargeCodeIDError: "", NibrsIdError: "" });
    GetSingleData(row?.CrimeID);
    get_Offence_Count(row?.CrimeID);
    setCrimeId(row?.CrimeID);
    NibrsErrorReturn(row?.CrimeID);
    setUpdateCount(updateCount + 1);
    setIncStatus(true);

    get_Criminal_Activity_Data(row?.CrimeID);
    get_Crime_Bias_Category_Data(row?.CrimeID);
    get_Crime_OffenderUse_Data(row?.CrimeID);
    get_MethodOfEntry_Data(row?.CrimeID);

  };

  // Custom Style
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

  const MethodOfEntryStyles = {
    control: (styles) => ({
      ...styles,
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  // Custom Style
  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fce9bf",
      minHeight: 58,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  // custuom style withoutColor
  const customStylesWithOutColor = {
    control: (base) => ({
      ...base,
      minHeight: 58,
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

  const StatusOptionGang = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const changeDropDowns = (e, name) => {
    setChangesStatus(true);
    setStatesChangeStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  const getMethodOfEntryStyleColor = (nibrsCode) => {
    if (nibrsCode === "220") {
      return value?.CrimeMethodOfEntryID ? nibrsSuccessStyles : nibrscolourStyles;
    } else {
      return MethodOfEntryStyles;
    }
  };

  useEffect(() => {
    if (offenseClick && mainIncidentID) {
      ValidateOffense(mainIncidentID, true);
    }
  }, [offenseClick, mainIncidentID]);

  // validate Incident
  const ValidateOffense = async (incidentID, isDefaultSelected = false) => {
    setclickNibLoder(true);
    const val = {
      gIncidentID: incidentID,
      IncidentNumber: IncNo,
      CrimeId: '',
      // CrimeId: crimeId,
    };
    await fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", val).then(async (res) => {
      if (res) {

        const offenceError = res?.Offense

        if (offenceError?.length > 0 && isDefaultSelected) {
          // console.log("🚀 ~ ValidateOffense ~ isDefaultSelected:", isDefaultSelected)
          GetSingleData(offenceError?.[0]?.CrimeID);
          NibrsErrorReturn(offenceError?.[0]?.CrimeID);
          get_Weapon_Data(offenceError?.[0]?.CrimeID);
          setOffenceID(offenceError?.[0]?.CrimeID);
          // set Drp value
          get_MethodOfEntry_Data(offenceError?.[0]?.CrimeID);
          get_Criminal_Activity_Data(offenceError?.[0]?.CrimeID);
          get_Crime_Bias_Category_Data(offenceError?.[0]?.CrimeID);
          get_Crime_OffenderUse_Data(offenceError?.[0]?.CrimeID);


          setStatesChangeStatus(false);
          navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${stringToBase64(offenceError?.[0]?.CrimeID)}&OffSta=${true}`);
          setErrors({ ...errors, ChargeCodeIDError: "", NibrsIdError: "" });
          get_Offence_Count(offenceError?.[0]?.CrimeID);
          setCrimeId(offenceError?.[0]?.CrimeID);
          setUpdateCount(updateCount + 1);

          setIncStatus(true);

        } else {


        }

        setnibrsValidateOffenseData(offenceError);
        setclickNibLoder(false);

      } else {
        setnibrsValidateOffenseData([]);
        setclickNibLoder(false);

      }
    });
  };

  const NibrsErrorReturn = async (crimeId) => {
    setShowAttempCompError(false);
    setShowLocationTypeError(false);
    setShowMethodOfEntryError(false);
    setShowCriminalActivityError(false);
    setShowOffenderUsingError(false);
    setShowBiasError(false);
    setShowWeaponError(false);
    setShowGangInformationError(false);
    setShowError(false);
    const val = {
      gIncidentID: mainIncidentID,
      IncidentNumber: IncNo,
      CrimeId: crimeId,
    };
    await fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", val).then((res) => {
      if (res) {

        const offenceError = res?.Offense && res?.Offense[0] ? res?.Offense[0] : [];


        if (offenceError?.Victimoffense) {
          setShowError(true);
        }
        setnibrsFieldError(offenceError);


        if (offenceError?.LocationType) {
          setShowLocationTypeError(true);
        }
        if (offenceError?.GangInformation) {
          setShowGangInformationError(true);
        }
        if (offenceError?.MethodOfEntry) {
          setShowMethodOfEntryError(true);
        }
        if (offenceError?.Weapon) {
          setShowWeaponError(true);
        }
        if (offenceError?.CriminalActivity) {
          setShowCriminalActivityError(true);
        }
        if (offenceError?.OffenderUsing) {
          setShowOffenderUsingError(true);
        }
        if (offenceError?.Bias) {
          setShowBiasError(true);
        }

      } else {
        setnibrsFieldError([]);
      }
    });
  };

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

  const onChangeGangInfo = (e, name) => {
    setChangesStatus(true);
    setStatesChangeStatus(true);
    const id = [];
    if (e) {
      e.map((item, i) => {
        id.push(item.value);
      });
      setGangInfoVal(e);
      setValue({ ...value, [name]: id.toString() });
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  function filterGangsUsingIncludes(gangs, ids) {
    const idArray = ids?.split(",")?.map(Number);
    const arr = gangs?.filter((gang) => idArray?.includes(gang.value));
    return arr;
  }

  const getGangInfoStyleColor = (nibrsCode) => {
    const gangValidCodes = ["11B", "09A", "09B", "100", "11A", "11B", "11C", "11D", "120", "13A", "13B", "13C"];
    if (gangValidCodes?.includes(nibrsCode)) {
      return value?.IsGangInfo || value?.IsGangInfo === false ? nibrsSuccessStyles : nibrscolourStyles;
    }
    else {
      return customStylesWithOutColor;
    }
  };

  const isGangDisabled = (nibrsCode) => {
    const gangValidCodes = ["11B", "09A", "09B", "100", "11A", "11B", "11C", "11D", "120", "13A", "13B", "13C"];
    return gangValidCodes?.includes(nibrsCode);
  };

  const DeleteOffence = () => {
    const val = { CrimeID: offenceID, DeletedByUserFK: loginPinID };
    AddDeleteUpadate("Crime/Delete_Offense", val).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;
      toastifySuccess(message);
      get_Incident_Count(IncID, loginPinID);
      get_Offence_Data(mainIncidentID);
      setStatusFalse();
      Reset();
    });
  };

  const validateFields = (field) => {
    if (field?.length == 0) {
      return "Required *";
    } else {
      return "true";
    }
  };

  const validateFieldsMethodOfEntry = (field) => {
    if (field?.length == 0 || field == null) {
      return "Required *";
    } else {
      return "true";
    }
  };

  const handleChange = (e) => {
    setChangesStatus(true); setStatesChangeStatus(true);
    if (e.target.name === "PremisesEntered") {

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
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  //-------------------------------filtered Data Offender suspected of using--------------------------------
  const filteredOptionsOffederUsing = crimeOffenderUseDrp.filter((opt) => {
    const selectedCodes = crimeOffenderUse?.map(item => item.code || item.id); // assuming 'code' or 'id' stores 'A', 'C', etc.
    if (selectedCodes?.includes('N')) {
      return opt.code === 'N'; // Only show N if it's selected
    } else if (selectedCodes?.some(code => ['A', 'C', 'D'].includes(code))) {
      return opt.code !== 'N'; // Hide N if any of A/C/D is selected
    }
    return true; // Default: show all options
  });

  useEffect(() => {
    const selectedItem = nibrsCodeDrp?.find((item) => item.value === value?.NIBRSCodeId);
    if (selectedItem) {
      setIsCrimeAgainstPerson(selectedItem?.IsCrimeAgainsPerson);
      setIsCrimeAgainstProperty(selectedItem?.IsCrimeAgainstProperty);
      setIsCrimeAgainstSociety(selectedItem?.IsCrimeAgainstSociety);
    }
  }, [value?.NIBRSCodeId,]);

  const isNibrs999 = offenceFillterData?.find((item) => item?.FBICode === "999" ? true : false)

  // useEffect(() => {
  //   const selectedItem = nibrsCodeDrp?.find((item) => item.value === value?.NIBRSCodeId);
  //   if (selectedItem) {
  //     setIsCrimeAgainstPerson(selectedItem?.IsCrimeAgainsPerson);
  //     setIsCrimeAgainstProperty(selectedItem?.IsCrimeAgainstProperty);
  //     setIsCrimeAgainstSociety(selectedItem?.IsCrimeAgainstSociety);
  //   }
  // }, [value?.NIBRSCodeId,]);


  const OnChangeCargoTheft = (e, name) => {
    setStatesChangeStatus(true); setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);


  return (
    <>
      <div className="col-12">
        <div className="row mt-2 gy-3 align-items-center" style={{ rowGap: '8px' }}>
          <div className="col-4 col-md-4 col-lg-2 ">
            <span
              data-toggle="modal"
              onClick={() => {
                setOpenPage("Law Title");
              }}
              data-target="#ListModel"
              className="new-link px-0"
            >
              Law Title
            </span>
          </div>
          <div className="col-7 col-md-7 col-lg-4">
            <Select
              name="LawTitleId"
              value={lawTitleIdDrp?.filter(
                (obj) => obj.value === value?.LawTitleId
              )}
              options={lawTitleIdDrp}
              isClearable
              onChange={(e) => onChangeDrpLawTitle(e, "LawTitleId")}
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2 ">
            <label htmlFor="" className="new-label mb-0">
              NIBRS Code
            </label>
            {errors.NibrsIdError !== "true" ?
              (<span style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}>
                {errors.NibrsIdError}
              </span>
              ) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-4 ">
            <Select
              styles={Requiredcolour}
              name="NIBRSCodeId"
              value={nibrsCodeDrp?.filter((obj) => obj.value === value?.NIBRSCodeId)}
              options={filteredOptions.length > 0 ? filteredOptions : nibrsCodeDrp}
              onInputChange={handleInputChange}
              isClearable
              onChange={(e) => onChangeNIBRSCode(e, "NIBRSCodeId")}
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2">
            <div style={{ whiteSpace: "wrap" }} >
              <Link
                to={"/ListManagement?page=Charge%20Code&call=/Off-Home"}
                className="new-link"
              >
                Offense Code/Name
              </Link>
            </div>
            {/* Check and display error message below the link */}
            {errors.ChargeCodeIDError !== "true" && (
              <div
                style={{
                  color: "red", fontSize: "13px", marginTop: "10px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end"
                }}
              >
                {errors.ChargeCodeIDError}
              </div>
            )}
          </div>
          <div className="col-7 col-md-7 col-lg-4">
            <Select
              name="ChargeCodeID"
              styles={Requiredcolour}
              value={chargeCodeDrp?.filter(
                (obj) => obj.value === value?.ChargeCodeID
              )}
              isClearable
              options={chargeCodeDrp}
              onChange={(e) => onChangeDrpLawTitle(e, "ChargeCodeID")}
              placeholder="Select..."
            />

          </div>
          <div className={`col-2 mt-0 `}>
            <label
              className="new-label"
              style={{
                marginBottom: "0px",
                display: "block",
                fontSize: "13px",
              }}
            >
              Attempted/Completed
            </label>
            {errors.AttemptRequiredError !== "true" ? (
              <span
                style={{
                  color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end"
                }}
              >
                {errors.AttemptRequiredError}
              </span>
            ) : null}

          </div>
          <div className="col-4 ">

            <Select
              onChange={(e) => changeDropDown(e, "AttemptComplete")}
              options={StatusOption}
              isClearable
              styles={
                !value?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles
              }
              placeholder="Select..."
              value={StatusOption.filter(
                (option) => option.value === value?.AttemptComplete
              )}
            />

          </div>
          <div className={`col-4 col-md-4 col-lg-2 mt-0 pt-0 `}>
            <span data-toggle="modal" onClick={() => { setOpenPage("Location Type"); }} data-target="#ListModel" className="new-link">
              Primary Location Type
              <br />
            </span>
            {errors.PrimaryLocationError !== "true" ? (
              <div style={{ color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end" }}>
                {errors.PrimaryLocationError}
              </div>
            ) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-4">
            {nibrsFieldError?.LocationType && showLocationTypeError && (
              <div className="nibrs-tooltip-error">
                <div className="tooltip-arrow"></div>

                <div className="tooltip-content">
                  <span className="text-danger">
                    ⚠️ {nibrsFieldError.LocationTypeError || ""}
                  </span>
                </div>
              </div>
            )}
            <Select
              name="PrimaryLocationId"
              styles={
                loginAgencyState === "TX"
                  ?
                  chekLocationType(nibrsCode, primaryLocationCode) ? nibrscolourStyles : check_Valid_Nibrs_Code(nibrsCode) ? MethodOfEntryStyles : Requiredcolour
                  :
                  Requiredcolour
              }
              value={locationIdDrp?.filter((obj) => obj.value === value?.PrimaryLocationId)}
              isClearable
              options={locationIdDrp}
              onChange={(e) => changeDropDown(e, "PrimaryLocationId")}
              placeholder="Select..."
            />

          </div>
          <div className={`col-4 col-md-4 col-lg-2 `}>
            <label htmlFor="" className="new-label m-0 ">
              Gang Information
            </label>
            {errors.GangInformationError !== "true" ? (
              <span
                style={{
                  color: "red", fontSize: "13px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end"
                }}
              >
                {errors.GangInformationError}
              </span>
            ) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-4  ">
            {nibrsFieldError?.GangInformation && showGangInformationError && (
              <div className="nibrs-tooltip-error">
                <div className="tooltip-arrow"></div>
                <div className="tooltip-content">
                  <span className="text-danger">
                    ⚠️ {nibrsFieldError.GangInformationError || ""}
                  </span>
                </div>
              </div>
            )}
            <Select
              isMulti
              styles={
                loginAgencyState === "TX"
                  ?
                  getGangInfoStyleColor(nibrsCode) ? getGangInfoStyleColor(nibrsCode) : customStylesWithOutColor
                  :
                  customStylesWithOutColor
              }
              isDisabled={
                loginAgencyState === "TX"
                  ?
                  isGangDisabled(nibrsCode) ? false : true
                  :
                  false
              }
              value={gangInfoVal}

              onChange={(e) => onChangeGangInfo(e, "IsGangInfo")}
              options={gangInfoDrpVal}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-4 col-md-4 col-lg-2  ">
            <span
              data-toggle="modal"
              onClick={() => {
                setOpenPage("Method Of Entry");
              }}
              data-target="#ListModel"
              className="new-link px-0"
            >
              Method Of Entry
            </span>
            {errors.MethodOfEnrtyError !== "true" ? (
              <span
                style={{
                  color: "red",
                  fontSize: "13px",
                  margin: "0px",
                  padding: "0px",
                  display: "block",
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end"
                }}
              >
                {errors.MethodOfEnrtyError}
              </span>
            ) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-4 ">
            {nibrsFieldError?.MethodOfEntry && showMethodOfEntryError && (
              <div className="nibrs-tooltip-error">
                <div className="tooltip-arrow"></div>

                <div className="tooltip-content">
                  <span className="text-danger">
                    ⚠️ {nibrsFieldError.MethodofEntryError || ""}
                  </span>
                </div>
              </div>
            )}
            <Select
              styles={
                loginAgencyState === "TX"
                  ? getMethodOfEntryStyleColor(nibrsCode)
                    ? getMethodOfEntryStyleColor(nibrsCode)
                    : customStylesWithOutColor
                  : customStylesWithOutColor
              }
              isDisabled={
                loginAgencyState === "TX"
                  ? nibrsCode === "220"
                    ? false
                    : true
                  : false
              }
              name="CrimeMethodOfEntryID"
              menuPlacement="top"
              isClearable
              options={methodEntryDrp}
              value={methodEntryDrp?.filter(
                (obj) => obj.value === value?.CrimeMethodOfEntryID
              )}
              onChange={(e) => changeDropDown(e, "CrimeMethodOfEntryID")}
              placeholder="Select..."
            />

          </div>
          <div className="col-4 col-md-4 col-lg-2  ">
            <label
              className="new-label"
              style={{
                marginBottom: "0px",
                display: "block",
                fontSize: "13px",
              }}
            >
              Premises Entered
            </label>

            {errors.PremisesEnteredError !== "true" ? (
              <span
                style={{
                  color: "red",
                  fontSize: "13px",
                  margin: "0px",
                  padding: "0px",
                  display: "block",
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end"
                }}
              >
                {errors.PremisesEnteredError}
              </span>
            ) : null}
          </div>
          <div className="col-7 col-md-7 col-lg-2 text-field mt-0 ">
            <input
              type="number"
              min={1}
              max={99}
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
          <div className="col-7 col-md-7 col-lg-2"></div>

          {nibrsCode === "220" || nibrsCode === "210" || nibrsCode === "120" || nibrsCode === "23D" || nibrsCode === "23F" || nibrsCode === "23H" || nibrsCode === "240" || nibrsCode === "26A" || nibrsCode === "26A" || nibrsCode === "23D" || nibrsCode === "26C" || nibrsCode === "26E" || nibrsCode === "26F" || nibrsCode === "26G" || nibrsCode === "270" || nibrsCode === "510" ?
            <>
              <div className="col-2 col-md-2 col-lg-2 mt-2" style={{ display: "flex", flexDirection: "column" }}>
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

              <div className="col-6 col-md-6 col-lg-4 mt-2">
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

        </div>
      </div>
      <div className="col-12">
        <div className="row mt-2" style={{ rowGap: '8px' }}>
          <div className="col-12 col-md-12 col-lg-6">
            <div className="row align-items-center" style={{ rowGap: '8px' }}>
              <div className="col-3 col-md-3 col-lg-3">
                <span
                  data-toggle="modal"
                  onClick={() => {
                    setOpenPage("Criminal Activity");
                  }}
                  data-target="#ListModel"
                  className="new-link px-0"
                >
                  Criminal Activity
                  {loginAgencyState === "TX" ? (
                    check_GangCrime_CrimeCode(
                      nibrsCode,
                      crimeActSelectedCodeArray,
                      "Tooltip"
                    ) ? (
                      check_GangCrime_CrimeCode(
                        nibrsCode,
                        crimeActSelectedCodeArray,
                        "Tooltip"
                      )
                    ) : checkCrimeActiSuitableCode(
                      nibrsCode,
                      crimeActSelectedCodeArray,
                      loginAgencyState
                    ) ? (
                      <ErrorTooltip
                        ErrorStr={CrimeActivitySelectSuitableCodesError}
                      />
                    ) : (
                      <></>
                    )
                  ) : (
                    <></>
                  )}
                </span>
                {errors.CriminalActivityError !== "true" ? <span style={{
                  color: "red", fontSize: "13px", margin: "0px", padding: "0px", display: "block", display: "flex", width: "100%", justifyContent: "flex-end"
                }}>{errors.CriminalActivityError}</span> : null}
              </div>
              <div className="col-9 col-md-9 col-lg-9  position-relative">
                {nibrsFieldError?.CriminalActivity && showCriminalActivityError && (
                  <div className="nibrs-tooltip-error">
                    <div className="tooltip-arrow"></div>

                    <div className="tooltip-content">
                      <span className="text-danger">
                        ⚠️ {nibrsFieldError.CriminalActivityError || ""}
                      </span>
                    </div>
                  </div>
                )}
                <SelectBox
                  className="basic-multi-select"
                  styles={
                    loginAgencyState === "TX"
                      ? checkCriminalActivityIsRequire(
                        nibrsCode,
                        loginAgencyState
                      )
                        ? ErrorStyle_CriminalActivity(false)
                        : check_GangCrime_CrimeCode(
                          nibrsCode,
                          crimeActSelectedCodeArray,
                          "Color"
                        )
                          ? check_GangCrime_CrimeCode(
                            nibrsCode,
                            crimeActSelectedCodeArray,
                            "Color"
                          )
                          :
                          checkCrimeActiSuitableCode(
                            nibrsCode,
                            crimeActSelectedCodeArray,
                            loginAgencyState
                          )
                            ? ErrorStyle_CriminalActivity(true) : customStylesWithOutColor : customStylesWithOutColor
                  }
                  name="CrimeActivity"
                  options={
                    crimeActivityDrp?.length > 0
                      ? get_CriminalActivity_DrpData(crimeActivityDrp)
                      : []
                  }

                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue }}
                  onChange={(e) => {
                    CrimeActivitychange(e);
                    setStatesChangeStatus(true);
                  }}
                  value={filterArray(crimeActivity, "label")}
                  placeholder="Select Criminal Activity From List"
                />

              </div>
              <div className="col-3 col-md-3 col-lg-3 ">
                <span
                  data-toggle="modal"
                  onClick={() => {
                    setOpenPage("Weapon Type");
                  }}
                  data-target="#ListModel"
                  className="new-link px-0"
                >
                  Weapon Type
                  {loginAgencyState === "TX" ? (
                    checkWeaponTypeValidate(
                      nibrsCode,
                      WeaponSelectCodeArray,
                      "ToolTip",
                      loginAgencyState
                    )
                  ) : (
                    <></>
                  )}
                  <br />

                </span>
                {errors.WeaponTypeError !== "true" ? <span style={{
                  color: "red", fontSize: "13px", margin: "0px", padding: "0px", display: "block",
                  display: "flex",
                  width: "100%",
                  justifyContent: "flex-end"
                }}>{errors.WeaponTypeError}</span> : null}
              </div>
              <div className="col-9 col-md-9 col-lg-9 ">
                {nibrsFieldError?.Weapon && showWeaponError && (
                  <div className="nibrs-tooltip-error">
                    <div className="tooltip-arrow"></div>

                    <div className="tooltip-content">
                      <span className="text-danger">
                        ⚠️ {nibrsFieldError.WeaponError || ""}
                      </span>
                    </div>
                  </div>
                )}
                <SelectBox
                  className="basic-multi-select"
                  name="WeaponTypeID"
                  styles={loginAgencyState === "TX" ? checkWeaponTypeValidate(nibrsCode, WeaponSelectCodeArray, "Color", loginAgencyState) ? checkWeaponTypeValidate(nibrsCode, WeaponSelectCodeArray, "Color", loginAgencyState) : customStylesWithOutColor : customStylesWithOutColor}
                  isClearable={false}
                  options={weaponDrp?.length > 0 ? getWeaponDrpData(weaponDrp, nibrsCode) : []}
                  hideSelectedOptions={true}
                  closeMenuOnSelect={false}
                  components={{ MultiValue }}
                  onChange={(e) => { Weaponchange(e); setStatesChangeStatus(true); }}
                  value={filterArray(weaponID, "label")}
                  placeholder="Select Weapon Type From List"
                  isMulti
                  menuPlacement="top"
                />

              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <div className="row  align-items-center" style={{ rowGap: '8px' }}>
              <div className="col-3 col-md-3 col-lg-4 text-right">
                <span data-toggle="modal" onClick={() => { setOpenPage("Offender Suspected of Using"); }} data-target="#ListModel" className="new-link px-0">Offender Using
                  {loginAgencyState === "TX" ? (
                    getCheckNotApplicable() ? (
                      <ErrorTooltip ErrorStr={NotApplicableError} />
                    ) : (
                      <> </>
                    )
                  ) : (
                    <></>
                  )}
                </span>
                <br />
                {errors.OffenderUsingError !== 'true' ? (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OffenderUsingError}</span>
                ) : null}
              </div>

              <div className="col-9 col-md-9 col-lg-8 ">
                {nibrsFieldError?.OffenderUsing && showOffenderUsingError && (
                  <div className="nibrs-tooltip-error">
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-content">
                      <span className="text-danger">
                        ⚠️ {nibrsFieldError.OffenderUsingError || ""}
                      </span>
                    </div>
                  </div>
                )}
                <SelectBox
                  className="basic-multi-select"
                  name="offenderusing"
                  options={getOffenderUsingDrpData(filteredOptionsOffederUsing)}
                  isClearable={false}
                  isMulti
                  styles={loginAgencyState == 'TX' ? nibrsCode === "999" ? customStylesWithOutColor : getCheckNotApplicable() ? Nibrs_ErrorStyle : MultiSelectRequredColor : MultiSelectRequredColor}
                  // styles={loginAgencyState == 'TX' ? getCheckNotApplicable() ? Nibrs_ErrorStyle : customStylesWithColor : customStylesWithColor}

                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue }}
                  onChange={(e) => { OffenderUsechange(e); setStatesChangeStatus(true); }}
                  value={filterArray(crimeOffenderUse, "label")}
                  placeholder="Select Offender Using From List"
                />
              </div>
              <div className="col-3 col-md-3 col-lg-4 text-right">
                <span data-toggle="modal" onClick={() => { setOpenPage("Bias Motivation"); }} data-target="#ListModel" className="new-link px-0">
                  Bias
                  {loginAgencyState === "TX" ? (nibrsCode === "09C" && !bias09CCodeStatus ? (<ErrorTooltip ErrorStr={Bias_90C_Error} />)
                    :
                    check_Valid_Bias_Code(BiasSelectCodeArray) ? (<ErrorTooltip ErrorStr={ValidateBiasCodeError} />) : <></>)
                    :
                    <></>
                  }
                </span>
                <br />
                {errors.BiasCategoryError !== 'true' ? (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.BiasCategoryError}</span>
                ) : null}
              </div>
              <div className="col-9 col-md-9 col-lg-8 ">
                {nibrsFieldError?.Bias && showBiasError &&

                  (<div className="nibrs-tooltip-error" style={{ left: '-80px' }}>
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-content">
                      <span className="text-danger">
                        ⚠️ {nibrsFieldError?.BiasError || ""}
                      </span>
                    </div>
                  </div>
                  )}
                <SelectBox
                  className="basic-multi-select"
                  name="bias"
                  options={crimeBiasCategoryDrp?.length > 0 ? getBiasDrpData(crimeBiasCategoryDrp) : []}
                  isClearable={false}
                  styles={
                    loginAgencyState === 'TX' ? nibrsCode === "999" ? customStylesWithOutColor :
                      nibrsCode === '09C' && !bias09CCodeStatus ? ErrorStyle_NIBRS_09C(nibrsCode)
                        :
                        check_Valid_Bias_Code(BiasSelectCodeArray) ? nibrscolourStyles : MultiSelectRequredColor
                      :
                      MultiSelectRequredColor
                  }
                  // styles={
                  //   loginAgencyState === 'TX' ? nibrsCode === '09C' && !bias09CCodeStatus ? ErrorStyle_NIBRS_09C(nibrsCode)
                  //     :
                  //     check_Valid_Bias_Code(BiasSelectCodeArray) ? Nibrs_ErrorStyle
                  //       :
                  //       customStylesWithColor
                  //     :
                  //     customStylesWithColor
                  // }

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue }}
                  onChange={(e) => { CrimeBiasCategorychange(e); setStatesChangeStatus(true); }}
                  value={filterArray(crimeBiasCategory, "label")}
                  placeholder="Select Bias From List"
                />

              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-12 mt-1 bb ">
          <div className="row">
            <div className="col-2 col-md-2 col-lg-2 mt-2 "></div>
            <div className="col-2 col-md-2 col-lg-3 mt-2 ml-4">
              <input className="form-check-input mr-1" disabled={true} type="checkbox" name="IsCrimeAgainstPerson" checked={isCrimeAgainstPerson} value={isCrimeAgainstPerson} />
              <label htmlFor="">Is Crime Against Person</label>
            </div>
            <div className="col-2 col-md-2 col-lg-3 mt-2 ">
              <input className="form-check-input mr-1" disabled={true} type="checkbox" name="IsCrimeAgainstProperty" checked={isCrimeAgainstProperty} value={isCrimeAgainstProperty} />
              <label htmlFor="">Is Crime Against Property</label>
            </div>
            <div className="col-2 col-md-2 col-lg-3 mt-2 ">
              <input className="form-check-input mr-1" disabled={true} type="checkbox" name="IsCrimeAgainstSociety" checked={isCrimeAgainstSociety} value={isCrimeAgainstSociety} />
              <label htmlFor="">Is Crime Against Society</label>
            </div>
          </div>
        </div> */}
        <div className="text-center p-1">
          {
            !showError || isNibrs999 || nibrsCode === "999" ? (
              <></>
            ) : (
              <span
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  border: '1px solid red', backgroundColor: '#ffe6e6', color: isHovered ? 'blue' : 'red',
                  padding: '3px', borderRadius: '4px', display: 'inline-block', transition: 'color 0.3s ease',
                  fontWeight: 'bold', fontSize: '14px',
                }}
              >
                {nibrsFieldError?.VictimoffenseError || "Offense must have at least one victim Connected"}
              </span>
            )
          }
        </div>

        {/* <div className="text-center p-1">
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
        </div> */}
        {

          isNibrsSummited ? (
            <>
            </>
          ) : (
            <>
              <div className="col-12 mt-2 justify-content-between d-flex">
                <button type="button"
                  onClick={() => { ValidateOffense(mainIncidentID); }}
                  data-toggle={"modal"} data-target={"#NibrsErrorShowModal"}
                  className={` ml-3 ${nibrsValidateOffenseData?.length > 0 ? "btn btn-sm mr-1" : "btn btn-sm btn-success mr-1"}`}
                  style={{ backgroundColor: `${nibrsValidateOffenseData?.length > 0 ? nibrsValidateOffenseData?.length > 0 ? "red" : "green" : ""}` }}
                >
                  Validate TIBRS
                </button>

                <div>
                  <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { setStatusFalse(); }}>
                    New
                  </button>
                  {OffId && (OffSta === true || OffSta === "true") ? (
                    effectiveScreenPermission ? (
                      effectiveScreenPermission[0]?.Changeok &&
                        nibrsSubmittedOffense !== 1 ? (
                        <button type="button" disabled={!statesChangeStatus} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-4">
                          Update
                        </button>
                      ) : (
                        <></>
                      )
                    ) : (
                      <button type="button" disabled={!statesChangeStatus} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-4">
                        Update
                      </button>
                    )
                  ) : effectiveScreenPermission ? (
                    effectiveScreenPermission[0]?.AddOK ? (
                      <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success ">Save
                      </button>
                    ) : (
                      <></>
                    )
                  ) : (
                    <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-4">
                      Save
                    </button>
                  )}
                </div>
              </div>
            </>
          )
        }
        <div className="px-0 mt-2">
          <DataTable
            columns={columns}
            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? offenceFillterData : [] : offenceFillterData}
            showHeader={true}
            persistTableHead={true}
            dense
            highlightOnHover
            responsive
            customStyles={tableCustomStyles}
            onRowClicked={(row) => { setEditVal(row); }}
            conditionalRowStyles={mergedConditionalRowStyles}
            fixedHeader
            fixedHeaderScrollHeight="170px"
            pagination
            paginationPerPage={"100"}
            paginationRowsPerPageOptions={[100, 150, 200, 500]}
            showPaginationBottom={100}
            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : "There are no data to display"}
          />
        </div>
      </div>
      <ChangesModal func={check_Validation_Error} />
      <ListModal {...{ openPage, setOpenPage }} />
      <DeletePopUpModal func={DeleteOffence} />
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

export default Offense;

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
