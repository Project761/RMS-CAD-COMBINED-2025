import React, { useContext, useEffect, useRef, useState, } from 'react';
import { components } from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import SelectBox from '../../../../Common/SelectBox';
import { Comman_changeArrayFormatBasicInfo, Comman_changeArrayFormatMethodOfOperation, threeColArray, threeColArrayWithCode } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import Select from "react-select";
import { Bias_90C_Error, check_GangCrime_CrimeCode, check_Valid_Bias_Code, checkCrimeActiSuitableCode, checkCriminalActivityIsRequire, checkMethodOfEntryIsRequire, checkWeaponTypeIsRequire, checkWeaponTypeValidate, CrimeActivitySelectNoneError, CrimeActivitySelectSuitableCodesError, ErrorStyle_CriminalActivity, ErrorStyle_NIBRS_09C, ErrorStyleOffenderUse, ErrorStyleWeapon, ErrorTooltip, HomicideOffenseUnknowError, MethodOFEntryMandataryError, NotApplicableError, OffenderUseError_N, OffenderUseError_Other, ValidateBiasCodeError } from '../ErrorNibrs';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import OffListing from '../../../ShowAllList/OffListing';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, MultiSelectRequredColor, Nibrs_ErrorStyle } from '../../../../Common/Utility';
import { RequiredFieldIncident, RequiredFieldIncidentOffender } from '../../../Utility/Personnel/Validation';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />
        <p className='ml-2 d-inline'>{props.label}</p>
      </components.Option>
    </div>
  );
};

const MultiValue = props => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const BasicInformation = ({ ListData, offenceID, nibrsCode, setNibrsCode, }) => {

  const { get_Offence_Count, nibrsSubmittedStatus, setnibrsSubmittedStatus, nibrsSubmittedOffenseMain, setnibrsSubmittedOffenseMain, PanelCode, changesStatus, setChangesStatus } = useContext(AgencyContext);

  const [value, setValue] = useState({
    'IsDomesticViolence': '', 'IsGangInfo': '',
  })


  const SelectedValue = useRef();
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  // DropDown Value
  const [pretentedDrp, setPretentedDrp] = useState([]);
  const [pointExitDrp, setPointExitDrp] = useState([]);
  const [pointEntryDrp, setPointEntryDrp] = useState([]);
  const [crimeOffenderUseDrp, setCrimeOffenderUseDrp] = useState([]);
  const [crimeActivityDrp, setCrimeActivityDrp] = useState([]);
  const [crimeBiasCategoryDrp, setCrimeBiasCategoryDrp] = useState([]);
  const [toolsUseIDDrp, setToolsUseIDDrp] = useState([]);
  const [crimeTargetDrp, setCrimeTargetDrp] = useState([]);
  const [crimeSuspectDrp, setCrimeSuspectDrp] = useState([]);
  const [crimeSecurityviolatedDrp, setCrimeSecurityviolatedDrp] = useState([]);
  const [methodOfOperationDrp, setMethodOfOperationDrp] = useState();
  const [methodEntryDrp, setMethodEntryDrp] = useState();
  const [weaponDrp, setWeaponDrp] = useState();
  const [crimeActivityNoneStatus, setCrimeActivityNoneStatus] = useState();
  const [crimeActSelectedCodeArray, setCrimeActSelectedCodeArray] = useState([]);
  const [BiasSelectCodeArray, setBiasSelectCodeArray] = useState([]);
  const [WeaponSelectCodeArray, setWeaponSelectCodeArray] = useState([]);

  // Edit Value Data
  const [editval, setEditval] = useState([]);
  const [pointExitEditVal, setPointExitEditVal] = useState([]);
  const [pointEntryEditVal, setPointEntryEditVal] = useState([]);
  const [crimeOffenderUseEditVal, setCrimeOffenderUseEditVal] = useState([]);
  const [criminalActivityEditVal, setCriminalActivityEditVal] = useState([]);
  const [crimeBiasCategoryEditVal, setCrimeBiasCategoryEditVal] = useState([]);
  const [crimeToolsUseEditVal, setCrimeToolsUseEditVal] = useState([]);
  const [crimeTargeteEditVal, setCrimeTargeteEditVal] = useState([]);
  const [crimeSuspectEditVal, setCrimeSuspectEditVal] = useState([]);
  const [securityViolatedEditVal, setSecurityViolatedEditVal] = useState([]);
  const [methodOfOperationEditVal, setmethodOfOperationEditVal] = useState([]);
  const [methodOfEntryEditVal, setmethodOfEntryEditVal] = useState([]);
  const [weaponEditVal, setweaponEditVal] = useState([]);
  const [openPage, setOpenPage] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');


  // DRP IDS Arrays objects
  const [crimePointOfEntry, setCrimePointOfEntry] = useState([]);
  const [pretendToBeID, setPretendToBeID] = useState([]);
  const [crimePointOfExitID, setCrimePointOfExitID] = useState([]);
  const [crimeOffenderUse, setCrimeOffenderUse] = useState([]);
  const [crimeActivity, setCrimeActivity] = useState([]);
  const [crimeBiasCategory, setCrimeBiasCategory] = useState([]);
  const [crimeToolsUse, setCrimeToolsUse] = useState([]);
  const [crimeTarget, setCrimeTarget] = useState([]);
  const [crimeSuspect, setCrimeSuspect] = useState([]);
  const [securityViolated, setSecurityViolated] = useState([]);
  const [methodOfOperation, setMethodOfOperation] = useState([]);
  const [methodOfEntry, setMethodOfEntry] = useState([]);
  const [weaponID, setWeaponID] = useState([]);
  const [methodOfEntryCode, setMethodOfEntryCode] = useState('');
  const [methodEntryDelID, setMethodEntryDelID] = useState('');
  const [bias09CCodeStatus, setBias09CCodeStatus] = useState(false);
  const [crimeTabValue, setcrimeTabValue] = useState(false);
  const [weaponTypeStatus, setweaponTypeStatus] = useState(false);
  const [weaponTypeError, setweaponTypeError] = useState(false);
  const [offenderUsingStatus, setoffenderUsingStatus] = useState(false);
  const [offenderUsingError, setoffenderUsingError] = useState(false);
  const [criminalActivityStatus, setcriminalActivityStatus] = useState(false);
  const [criminalActivityError, setcriminalActivityError] = useState(false);
  const [biasStatus, setbiasStatus] = useState(false);
  const [biasStatusError, setbiasStatusError] = useState(false);
  const [securityViolatedStatus, setsecurityViolatedStatus] = useState(false);
  const [securityViolatedError, setsecurityViolatedError] = useState(false);
  const [pointOfEntryStatus, setpointOfEntryStatus] = useState(false);
  const [pointOfEntryError, setsetpointOfEntryError] = useState(false);
  const [pointOfExitStatus, setpointOfExitStatus] = useState(false);
  const [pointOfExitError, setpointOfExitError] = useState(false);
  const [methodOfOperationStatus, setmethodOfOperationStatus] = useState(false);
  const [methodOfOperationError, setmethodOfOperationError] = useState(false);
  const [nibrsError, setnibrsError] = useState([]);
  // permissions
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();
  const [errors, setErrors] = useState({ 'MethodOfEnrtyError': '', 'WeaponTypeError': '', 'CriminalActivityError': '', 'OffenderusingError': '', 'CrimeBiasCategoryError': '' });

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("O037", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);


  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      // for change tab when not having  add and update permission
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);



  const [multiSelected, setMultiSelected] = useState({
    PretendToBeID: null, CrimePointOfExitID: null, CrimeOffenderUse: null, CrimeActivity: null, CrimeBiasCategory: null, CrimeToolsUse: null, CrimeTarget: null, CrimeSuspect: null, SecurityViolated: null, methodOfOperation: null, methodOfEntry: null, weaponID: null,
  })

  useEffect(() => {
    if (offenceID) {
      NibrsErrorReturn(offenceID);
      GetBasicInfoData(); get_Point_Exit_Data(); get_Point_Entry_Data(); get_Crime_OffenderUse_Data(); get_Criminal_Activity_Data(); get_Crime_Bias_Category_Data(); get_Crime_Tools_Use_Data(); get_Crime_Target_Data();
      get_Crime_Suspect_Data(); get_Security_Violated_Data(); get_MethodOfOperation_Data(); get_MethodOfEntry_Data(); get_Weapon_Data();
    }
  }, [])

  const checkOffenderCount = () => {
    if (pretendToBeID.length > 0 || crimePointOfEntry.length > 0 || weaponID.length > 0 || securityViolated.length > 0 || crimeTarget.length > 0 || crimeBiasCategory.length > 0 || crimeOffenderUse.length > 0 || crimePointOfExitID.length > 0 || methodOfOperation.length > 0 || methodEntryDrp.length > 0 || crimeSuspect.length > 0 || crimeToolsUse.length > 0 || crimeActivity.length > 0) {
      setcrimeTabValue(false);
    } else {
      setcrimeTabValue(true);
    }
  };

  const GetBasicInfoData = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('CrimePretendToBe/GetData_CrimePretendToBe', val)
      .then((res) => {
        if (res) {
          setEditval(Comman_changeArrayFormatBasicInfo(res, 'PretendToBeID', 'Description', 'PretendToBeID', 'CrimePretendID', 'PretendToBeCode'));
        }
        else {
          setEditval([]);
        }
      })
  }

  const get_Point_Exit_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffensePointOfExit/GetDataOffensePointOfExit', val)
      .then((res) => {
        if (res) {
          setPointExitEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimePointOfExitID', 'Description', 'PretendToBeID', 'PointOfExitID', 'PointOfExitCode'));
        } else {
          setPointExitEditVal([]);
        }
      })
  }

  const get_Point_Entry_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffensePointOfEntry/GetData_OffensePointOfEntry', val)
      .then((res) => {
        if (res) {
          setPointEntryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimePointOfEntryID', 'Description', 'PretendToBeID', 'PointOfEntryID', 'EntryPointCode'));
        }
        else {
          setPointEntryEditVal([]);
        }
      })
  }

  const get_Crime_OffenderUse_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseOffenderUse/GetData_OffenseOffenderUse', val)
      .then((res) => {
        if (res) {
          setCrimeOffenderUseEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeOffenderUseID', 'Description', 'PretendToBeID', 'OffenderUseID', 'OffenderUseCode'));
        }
        else {
          setCrimeOffenderUseEditVal([]);
        }
      })
  }

  const get_Criminal_Activity_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseCriminalActivity/GetData_OffenseCriminalActivity', val)
      .then((res) => {
        if (res) {
          setCriminalActivityEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeActivityID', 'Description', 'PretendToBeID', 'ActivityID', 'CriminalActivityCode'));
        }
        else {
          setCriminalActivityEditVal([]);
        }
      })
  }

  const get_Crime_Bias_Category_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseBiasCategory/GetData_OffenseBiasCategory', val)
      .then((res) => {
        if (res) {
          setCrimeBiasCategoryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeBiasCategoryID', 'Description', 'PretendToBeID', 'BiasCategoryID', 'BiasCode'));
        }
        else {
          setCrimeBiasCategoryEditVal([]);
        }
      })
  }

  const get_Crime_Tools_Use_Data = () => {
    const val = { 'CrimeID': offenceID }
    fetchPostData('OffenseToolsUse/GetData_OffenseToolsUse', val)
      .then((res) => {
        if (res) {
          setCrimeToolsUseEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeToolsUseID', 'Description', 'PretendToBeID', 'ToolsUseID', 'ToolsUseCode'));
        }
        else {
          setCrimeToolsUseEditVal([]);
        }
      })
  }

  const get_Crime_Target_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseTarget/GetData_OffenseTarget', val)
      .then((res) => {
        if (res) {
          setCrimeTargeteEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeTargetID', 'Description', 'PretendToBeID', 'TargetID', 'TargetCode'));
        }
        else {
          setCrimeTargeteEditVal([]);
        }
      })
  }

  const get_Crime_Suspect_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseSuspect/GetData_OffenseSuspect', val)
      .then((res) => {
        if (res) {

          setCrimeSuspectEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeSuspectID', 'Description', 'PretendToBeID', 'SuspectID', 'SuspectCode'));
        }
        else {
          setCrimeSuspectEditVal([]);
        }
      })
  }

  const get_Security_Violated_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseSecurityViolated/GetData_OffenseSecurityViolated', val)
      .then((res) => {
        if (res) {
          setSecurityViolatedEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeSecurityviolatedID', 'Description', 'PretendToBeID', 'SecurityviolatedID', 'SecurityviolatedCode'));
        }
        else {
          setSecurityViolatedEditVal([]);
        }
      })
  }

  // weapon
  const get_Weapon_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseWeapon/GetData_OffenseWeapon', val).then((res) => {
      if (res) {
        setweaponEditVal(Comman_changeArrayFormatBasicInfo(res, 'WeaponTypeID', 'Weapon_Description', 'PretendToBeID', 'WeaponID', 'WeaponCode'))
      } else {
        setweaponEditVal([]);
      }
    })
  }

  useEffect(() => {
    if (editval) { setPretendToBeID(editval) }
  }, [editval])

  useEffect(() => {
    if (pointExitEditVal) { setCrimePointOfExitID(pointExitEditVal) }
  }, [pointExitEditVal])

  useEffect(() => {
    if (pointEntryEditVal) { setCrimePointOfEntry(pointEntryEditVal) }
  }, [pointEntryEditVal])

  useEffect(() => {
    if (crimeOffenderUseEditVal) { setCrimeOffenderUse(crimeOffenderUseEditVal) }
  }, [crimeOffenderUseEditVal])

  useEffect(() => {
    if (criminalActivityEditVal) {
      setCrimeActivity(criminalActivityEditVal);
      const noneStatus = criminalActivityEditVal?.filter((item) => { if (item?.code === "N") { return true } });
      setCrimeActivityNoneStatus(noneStatus?.length > 0);

      const crimeActivityCodesArray = criminalActivityEditVal?.map((item) => { return item?.code });
      setCrimeActSelectedCodeArray(crimeActivityCodesArray);

    }
  }, [criminalActivityEditVal])

  useEffect(() => {
    if (crimeBiasCategoryEditVal) {
      setCrimeBiasCategory(crimeBiasCategoryEditVal);
      const BiasCodesArray = crimeBiasCategoryEditVal?.map((item) => { return item?.code });
      const Bias09CCode = crimeBiasCategoryEditVal?.map((item) => { return item?.code === "88" });
      setBias09CCodeStatus(Bias09CCode?.length > 0)
      setBiasSelectCodeArray(BiasCodesArray);
    }
  }, [crimeBiasCategoryEditVal])

  useEffect(() => {
    if (crimeToolsUseEditVal) { setCrimeToolsUse(crimeToolsUseEditVal) }
  }, [crimeToolsUseEditVal])

  useEffect(() => {
    if (crimeTargeteEditVal) { setCrimeTarget(crimeTargeteEditVal) }
  }, [crimeTargeteEditVal])

  useEffect(() => {
    if (crimeSuspectEditVal) { setCrimeSuspect(crimeSuspectEditVal) }
  }, [crimeSuspectEditVal])

  useEffect(() => {
    if (securityViolatedEditVal) { setSecurityViolated(securityViolatedEditVal) }
  }, [securityViolatedEditVal])

  useEffect(() => {
    if (methodOfOperationEditVal) { setMethodOfOperation(methodOfOperationEditVal) }
  }, [methodOfOperationEditVal])

  useEffect(() => {
    if (methodOfEntryEditVal) {
      setMethodEntryDelID(methodOfEntryEditVal[0]?.id);
      setMethodOfEntryCode(methodOfEntryEditVal[0]?.value)
    }
  }, [methodOfEntryEditVal])

  useEffect(() => {
    if (weaponEditVal) {
      setWeaponID(weaponEditVal);
      const WeaponCodesArray = weaponEditVal?.map((item) => { return item?.code });
      setWeaponSelectCodeArray(WeaponCodesArray);
    }
  }, [weaponEditVal])

  // Onchange Fuction
  const Agencychange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);


    setPretendToBeID(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < editval?.length) {
      let missing = null;
      let i = editval.length;
      while (i) {
        missing = (~multiSelected.indexOf(editval[--i])) ? missing : editval[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const poinOfExitchange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setCrimePointOfExitID(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < pointExitEditVal?.length) {
      let missing = null;
      let i = pointExitEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(pointExitEditVal[--i])) ? missing : pointExitEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const poinOfEntrychange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setCrimePointOfEntry(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < pointEntryEditVal?.length) {
      let missing = null;
      let i = pointEntryEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(pointEntryEditVal[--i])) ? missing : pointEntryEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const OffenderUsechange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);


    setCrimeOffenderUse(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < crimeOffenderUseEditVal?.length) {
      let missing = null;
      let i = crimeOffenderUseEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(crimeOffenderUseEditVal[--i])) ? missing : crimeOffenderUseEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const CrimeActivitychange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setCrimeActivity(multiSelected);
    const len = multiSelected.length - 1
    if (multiSelected?.length < criminalActivityEditVal?.length) {
      let missing = null;
      let i = criminalActivityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(criminalActivityEditVal[--i])) ? missing : criminalActivityEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const CrimeBiasCategorychange = (multiSelected) => {

    !addUpdatePermission && setChangesStatus(true);
    setCrimeBiasCategory(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < crimeBiasCategoryEditVal?.length) {
      let missing = null;
      let i = crimeBiasCategoryEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(crimeBiasCategoryEditVal[--i])) ? missing : crimeBiasCategoryEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const CrimeToolsUsechange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setCrimeToolsUse(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < crimeToolsUseEditVal?.length) {
      let missing = null;
      let i = crimeToolsUseEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(crimeToolsUseEditVal[--i])) ? missing : crimeToolsUseEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const CrimeTargetchange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setCrimeTarget(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < crimeTargeteEditVal?.length) {
      let missing = null;
      let i = crimeTargeteEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(crimeTargeteEditVal[--i])) ? missing : crimeTargeteEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const CrimeSuspectchange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setCrimeSuspect(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < crimeSuspectEditVal?.length) {
      let missing = null;
      let i = crimeSuspectEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(crimeSuspectEditVal[--i])) ? missing : crimeSuspectEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const SecurityViolatedchange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setSecurityViolated(multiSelected)
    const len = multiSelected.length - 1
    if (multiSelected?.length < securityViolatedEditVal?.length) {
      let missing = null;
      let i = securityViolatedEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(securityViolatedEditVal[--i])) ? missing : securityViolatedEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }

  const CrimeMethodOfEntrychange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);

    const len = multiSelected.length - 1
    setMethodOfEntry(len < 1 ? [] : multiSelected.slice(0, len));
    if (multiSelected?.length < methodOfEntryEditVal?.length) {
      let missing = null;
      let i = methodOfEntryEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(methodOfEntryEditVal[--i])) ? missing : methodOfEntryEditVal[i];
      }

    } else {
      if (len < 1) {

      } else {
        toastifyError('please select only one');
      }
    }
  }

  const Weaponchange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);
    setWeaponID(multiSelected)

    const len = multiSelected.length - 1

    if (multiSelected?.length < weaponEditVal?.length) {
      let missing = null;
      let i = weaponEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(weaponEditVal[--i])) ? missing : weaponEditVal[i];
      }


    } else {

    }
    checkOffenderCount();
  }

  useEffect(() => {
    if (openPage || loginAgencyID) {
      getPretendTobeDrpVal(loginAgencyID); getPointExitTobeDrpVal(loginAgencyID); getPointEntryTobeDrpVal(loginAgencyID); getCrimeOffenderUseDrpVal(loginAgencyID); getCrimeActivityDrpVal(loginAgencyID);
      getCrimeBiasCategoryDrpVal(loginAgencyID); getCrimeToolsUseDrpVal(loginAgencyID); getCrimeTargetDrpVal(loginAgencyID); getCrimeSuspectDrpVal(loginAgencyID); getCrimeSecurityviolatedDrpVal(loginAgencyID);
      get_MethodOfOperation_DropDown(loginAgencyID); get_MethodOfEntry_DropDown(loginAgencyID); get_Weapon_DropDown(loginAgencyID);
    }
  }, [openPage, loginAgencyID])

  const getPretendTobeDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('PretendToBe/GetDataDropDown_PretendToBe', val).then((data) => {
      if (data) {
        setPretentedDrp(threeColArrayWithCode(data, 'PretendToBeID', 'Description', 'PretendToBeCode'))

      } else {
        setPretentedDrp([]);
      }
    })
  }

  const getPointExitTobeDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimePointOfexit/GetDataDropDown_CrimePointOfexit', val).then((data) => {
      if (data) {
        setPointExitDrp(threeColArrayWithCode(data, 'PointOfExit', 'Description', 'PointOfExitCode'))
      } else {
        setPointExitDrp([]);
      }
    })
  }

  const getPointEntryTobeDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimePointOfEntry/GetDataDropDown_CrimePointOfEntry', val).then((data) => {
      if (data) {
        setPointEntryDrp(threeColArrayWithCode(data, 'EntryPointId', 'Description', 'EntryPointCode'))
      } else {
        setPointEntryDrp([]);
      }
    })
  }

  const getCrimeOffenderUseDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimeOffenderUse/GetDataDropDown_CrimeOffenderUse', val).then((data) => {
      if (data) {
        setCrimeOffenderUseDrp(threeColArrayWithCode(data, 'OffenderUseID', 'Description', 'OffenderUseCode'))
      } else {
        setCrimeOffenderUseDrp([]);
      }
    })
  }

  const getCrimeActivityDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CriminalActivity/GetDataDropDown_CriminalActivity', val).then((data) => {
      if (data) {
        setCrimeActivityDrp(threeColArrayWithCode(data, 'CriminalActivityID', 'Description', 'CriminalActivityCode'))
      } else {
        setCrimeActivityDrp([]);
      }
    })
  }

  const getCrimeBiasCategoryDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimeBias/GetDataDropDown_CrimeBias', val).then((data) => {
      if (data) {

        setCrimeBiasCategoryDrp(threeColArrayWithCode(data, 'BiasID', 'Description', 'BiasCode'))
      } else {
        setCrimeBiasCategoryDrp([]);
      }
    })
  }

  const getCrimeToolsUseDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimeToolsUse/GetDataDropDown_CrimeToolsUse', val).then((data) => {
      if (data) {
        setToolsUseIDDrp(threeColArrayWithCode(data, 'ToolsUseID', 'Description', 'ToolsUseCode'))
      } else {
        setToolsUseIDDrp([]);
      }
    })
  }

  const getCrimeTargetDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimeTarget/GetDataDropDown_CrimeTarget', val).then((data) => {
      if (data) {
        setCrimeTargetDrp(threeColArrayWithCode(data, 'TargetID', 'Description', 'TargetCode'))
      } else {
        setCrimeTargetDrp([]);
      }
    })
  }

  const getCrimeSuspectDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimeSuspect/GetDataDropDown_CrimeSuspect', val).then((data) => {
      if (data) {
        setCrimeSuspectDrp(threeColArrayWithCode(data, 'SuspectID', 'Description', 'SuspectCode'))

      } else {
        setCrimeSuspectDrp([]);
      }
    })
  }

  const getCrimeSecurityviolatedDrpVal = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('CrimeSecurityviolated/GetDataDropDown_CrimeSecurityviolated', val).then((data) => {
      if (data) {
        setCrimeSecurityviolatedDrp(threeColArrayWithCode(data, 'SecurityviolatedID', 'Description', 'SecurityviolatedCode'))
      } else {
        setCrimeSecurityviolatedDrp([]);
      }
    })
  }

  const CrimeMethodOfOpeationchange = (multiSelected) => {
    !addUpdatePermission && setChangesStatus(true);

    setMethodOfOperation(multiSelected);
    const len = multiSelected.length - 1
    if (multiSelected?.length < methodOfOperationEditVal?.length) {
      let missing = null;
      let i = methodOfOperationEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(methodOfOperationEditVal[--i])) ? missing : methodOfOperationEditVal[i];
      }

    } else {

    }
    checkOffenderCount();
  }


  const check_Validation_Error = (e) => {
    const methodEntryArr = methodOfEntryCode ? [methodOfEntryCode] : [];
    const isWeaponRequired = checkWeaponTypeIsRequire(nibrsCode, loginAgencyState) || PanelCode === '03' || PanelCode === '06' || PanelCode === '08';
    // const offenderusingErr = (PanelCode === '03' || PanelCode === '06' || PanelCode === '08') ? RequiredFieldIncidentOffender(crimeOffenderUse) : 'true';
    const MethodOfEnrtyErr = checkMethodOfEntryIsRequire(nibrsCode, loginAgencyState) ? validateFields(methodEntryArr) : 'true';
    const WeaponTypeErr = isWeaponRequired ? validateFields(weaponID) : 'true';
    const CriminalActivityErr = checkCriminalActivityIsRequire(nibrsCode, loginAgencyState) ? validateFields(crimeActivity) : 'true';

    const offenderusingErr = nibrsCode != "999" ? RequiredFieldIncidentOffender(crimeOffenderUse) : 'true';
    const CrimeBiasCategoryErr = nibrsCode != "999" ? validateFields(crimeBiasCategory) : 'true';


    setErrors(pre => ({
      ...pre,
      ['MethodOfEnrtyError']: MethodOfEnrtyErr || pre['MethodOfEnrtyError'],
      ['WeaponTypeError']: WeaponTypeErr || pre['WeaponTypeError'],
      ['CriminalActivityError']: CriminalActivityErr || pre['CriminalActivityError'],
      ['OffenderusingError']: offenderusingErr || pre['OffenderusingError'],
      ['CrimeBiasCategoryError']: CrimeBiasCategoryErr || pre['CrimeBiasCategoryError'],

    }));
  };

  const { MethodOfEnrtyError, WeaponTypeError, CriminalActivityError, OffenderusingError, CrimeBiasCategoryError } = errors

  useEffect(() => {
    if (MethodOfEnrtyError === 'true' && WeaponTypeError === 'true' && CriminalActivityError === 'true' && OffenderusingError === 'true' && CrimeBiasCategoryError === 'true') {
      InSertBasicInfo();
    }
  }, [MethodOfEnrtyError, WeaponTypeError, CriminalActivityError, OffenderusingError, CrimeBiasCategoryError])

  const InSertBasicInfo = () => {
    const val = {
      'CrimeID': offenceID,
      'CreatedByUserFK': loginPinID,
      'PretendToBeID': pretendToBeID.map((item) => item?.value),
      'CrimePointOfExitID': crimePointOfExitID.map((item) => item?.value),
      'CrimePointOfEntryID': crimePointOfEntry.map((item) => item?.value),
      'CrimeOffenderUseID': crimeOffenderUse.map((item) => item?.value),
      'CrimeActivityID': crimeActivity.map((item) => item?.value),
      'CrimeBiasCategoryID': crimeBiasCategory.map((item) => item?.value),
      'CrimeToolsUseID': crimeToolsUse.map((item) => item?.value),
      'CrimeTargetID': crimeTarget.map((item) => item?.value),
      'CrimeSuspectID': crimeSuspect.map((item) => item?.value),
      'CrimeSecurityviolatedID': securityViolated.map((item) => item?.value),
      'CrimeMethodOfOpeationID': methodOfOperation.map((item) => item?.value),
      'CrimeMethodOfEntryID': [methodOfEntryCode],
      'WeaponTypeID': weaponID.map((item) => item?.value),

    }
    AddDeleteUpadate('Crime/Insert_OffenseInformation', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        GetBasicInfoData();
        get_Point_Exit_Data();
        get_Point_Entry_Data();
        get_Crime_OffenderUse_Data();
        get_Criminal_Activity_Data();
        get_Crime_Bias_Category_Data();
        get_Crime_Tools_Use_Data();
        get_Crime_Target_Data();
        get_Crime_Suspect_Data();
        get_Security_Violated_Data();
        get_MethodOfOperation_Data();
        get_MethodOfEntry_Data();
        get_Weapon_Data();
        get_Offence_Count(offenceID);
        NibrsErrorReturn(offenceID);
        setErrors({ ...errors, 'MethodOfEnrtyError': '', 'CriminalActivityError': '', 'WeaponTypeError': '', 'OffenderusingError': '', 'CrimeBiasCategoryError': '' })
        setChangesStatus(false);
      } else {
        console.log("Somthing Wrong");
        setErrors({ ...errors, 'MethodOfEnrtyError': '', 'CriminalActivityError': '', 'WeaponTypeError': '', 'OffenderusingError': '', 'CrimeBiasCategoryError': '' })
      }
    })

  }

  const DelSertBasicInfo = (CrimePretendID, col1, url) => {
    const val = { [col1]: CrimePretendID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate(url, val).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;
      if (res) {
        toastifySuccess(message);
        col1 === 'CrimePretendID' && GetBasicInfoData();
        col1 === 'PointOfExitID' && get_Point_Exit_Data();
        col1 === 'PointOfEntryID' && get_Point_Entry_Data();
        col1 === 'OffenderUseID' && get_Crime_OffenderUse_Data();
        col1 === 'ActivityID' && get_Criminal_Activity_Data();
        col1 === 'BiasCategoryID' && get_Crime_Bias_Category_Data();
        col1 === 'ToolsUseID' && get_Crime_Tools_Use_Data();
        col1 === 'TargetID' && get_Crime_Target_Data();
        col1 === 'SuspectID' && get_Crime_Suspect_Data();
        col1 === 'SecurityviolatedID' && get_Security_Violated_Data();
        col1 === 'methodOfOperationID' && get_MethodOfOperation_Data();
        col1 === 'MethodOfEntryID' && get_MethodOfEntry_Data();
        col1 === 'WeaponID' && get_Weapon_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  //  method of operation
  const get_MethodOfOperation_Data = () => {
    const val = { 'CrimeID': offenceID, };
    fetchPostData('OffenseMethodOfOperation/GetData_OffenseMethodOfOperation', val)
      .then((res) => {
        if (res) {
          setmethodOfOperationEditVal(Comman_changeArrayFormatMethodOfOperation(res, 'MethodOfOperationID', 'CrimeID', 'PretendToBeID', 'CrimeMethodOfOpeationID', 'MethodOfOperation_Description'));
        } else {
          setmethodOfOperationEditVal([]);
        }
      });
  };

  const get_MethodOfOperation_DropDown = (loginAgencyID) => {
    const val = { 'AgencyID': loginAgencyID, }
    fetchPostData('OffenseMethodOfOperation/GetData_InsertGetData_OffenseMethodOfOperation', val).then((data) => {
      if (data) {
        setMethodOfOperationDrp(threeColArrayWithCode(data, 'MethodOfOperationID', 'Description', 'MethodOfOperationCode',));
      }
      else {
        setMethodOfOperationDrp([])
      }
    })
  }

  const get_Weapon_DropDown = (loginAgencyID) => {
    const val = { 'AgencyID': loginAgencyID, }
    fetchPostData('OffenseWeapon/GetData_InsertOffenseWeapon', val).then((data) => {
      if (data) {

        setWeaponDrp(threeColArrayWithCode(data, 'WeaponID', 'Description', 'WeaponCode'));
      } else {
        setWeaponDrp([])
      }
    })
  }

  const get_MethodOfEntry_Data = () => {
    const val = { 'CrimeID': offenceID, }
    fetchPostData('OffenseMethodOfEntry/GetData_OffenseMethodOfEntry', val).then((res) => {
      if (res) {
        setmethodOfEntryEditVal(Comman_changeArrayFormatMethodOfOperation(res, 'MethodOfEntryID', 'CrimeID', 'PretendToBeID', 'CrimeMethodOfEntryID', 'MethodOfEntry_Description'));
      } else {
        setmethodOfEntryEditVal([]);
      }
    })
  }

  const get_MethodOfEntry_DropDown = (loginAgencyID) => {
    const val = { 'AgencyID': loginAgencyID, }
    fetchPostData('OffenseMethodOfEntry/GetData_InsertGetData_OffenseMethodOfEntry', val).then((data) => {
      if (data) {
        setMethodEntryDrp(threeColArrayWithCode(data, 'EntryMethodID', 'Description', 'MethodOfEntryCode'));
      } else {
        setMethodEntryDrp([])
      }
    })
  }

  const onChangeMethodOfEntry = (e) => {
    if (e) {
      setMethodOfEntryCode(e.value)
      const val = { 'CrimeID': offenceID, CrimeMethodOfEntryID: e.value, 'CreatedByUserFK': loginPinID, }
      AddDeleteUpadate('OffenseMethodOfEntry/Insert_OffenseMethodOfEntry', val).then((res) => {
        setErrors({ ...errors, 'MethodOfEnrtyError': '' })
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
      })
    } else {
      const val = { 'CrimeID': offenceID, MethodOfEntryID: methodEntryDelID, 'DeletedByUserFK': loginPinID, }
      AddDeleteUpadate('OffenseMethodOfEntry/Delete_OffenseMethodOfEntry', val).then((res) => {
        setErrors({ ...errors, 'MethodOfEnrtyError': '' })
        setMethodOfEntryCode(0)
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
      })
    }
    checkOffenderCount();
  }

  function filterArray(arr, key) {
    return [...new Map(arr?.map(item => [item[key], item])).values()]
  }

  const validateFields = (field) => {
    if (field?.length == 0) {
      return 'Required *';
    } else {
      return 'true'
    }
  };

  const getWeaponDrpData = (data, nibrsCode, weaponID) => {

    const weaponValues = weaponID?.map((item) => item?.code)

    if (loginAgencyState === 'TX' && nibrsCode == "13B") {
      const weaponData = data.filter((item) => { if (item?.id === '99' || item?.id === '40' || item?.id === '90' || item?.id === '95') return item });

      const otherFilterArr = weaponData?.filter((item) => !weaponValues.includes(item?.id));
      return otherFilterArr

    }
    //  else if (loginAgencyState === 'TX' && nibrsCode == "13A") {
    //   const weaponData = data.filter((item) => { if (item?.id === '11' || item?.id === '12' || item?.id === '13' || item?.id === '14' || item?.id === '15') return item });

    //   const otherFilterArr = weaponData?.filter((item) => !weaponValues.includes(item?.id));
    //   return otherFilterArr

    // }
    else if (loginAgencyState === 'TX' && (nibrsCode === '09A' || nibrsCode === '09B' || nibrsCode === '09C')) {
      const weaponData = data.filter((item) => { if (item?.id != '77' && item?.id != '99') return item });

      const otherFilterArr = weaponData?.filter((item) => !weaponValues.includes(item?.id));
      return otherFilterArr

    }
    else {
      return data

    }

  }

  const get_CriminalActivity_DrpData = (data) => {

    const nibrsCodeArray = ["09A", "09B", "100", "120", "11A", "11B", "11C", "11D", "13A", "13B", "13C"]
    const suitablecodes = ['250', '280', '30C', '35A', '35B', '39C', '370', '49A', '520', '521', '522', '526', '58A', '58B', '61A', '61B', '620',]
    const AnimalCrueltyCode = ['720']

    if (loginAgencyState === 'TX' && suitablecodes.includes(nibrsCode)) {
      const crimeActiDrpData = data.filter((item) => { if (item?.id === "B" || item?.id === "C" || item?.id === "D" || item?.id === "E" || item?.id === "O" || item?.id === "P" || item?.id === "T" || item?.id === "U") return item });
      return crimeActiDrpData

    } else if (loginAgencyState === 'TX' && AnimalCrueltyCode.includes(nibrsCode)) {
      const crimeActiDrpData = data.filter((item) => { if (item?.id === "A" || item?.id === "F" || item?.id === "I" || item?.id === "S") return item });
      return crimeActiDrpData

    } else {
      return data
    }
  }

  const getBiasDrpData = (data) => {
    if (loginAgencyState === 'TX' && nibrsCode === '09A' && nibrsCode === '09B' && nibrsCode === '09C') {
      const weaponData = data.filter((item) => { if (item.id == "88") return item });
      return weaponData
    } else {
      return data
    }
  }

  // Check NotApplicable Offender Using Drp Data
  const getCheckNotApplicable = () => {
    if (loginAgencyState === 'TX') {
      let offenderUsingValues = filterArray(crimeOffenderUse, 'label');

      const status = offenderUsingValues?.filter((item) => { if (item.code === "N") return item });
      return status?.length > 0 && offenderUsingValues?.length > 1 ? true : false
    } else {
      return false
    }
  }

  const getOffenderUsingDrpData = (data) => {
    if (loginAgencyState === 'TX') {
      let offenderUsingValues = filterArray(crimeOffenderUse, 'label');

      const status = offenderUsingValues?.filter((item) => { if (item.code === "N") return item });
      return status?.length > 0 ? [] : data
    } else {
      return data
    }
  }

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
    control: base => ({
      ...base,
      minHeight: 58,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const customStylesWithOutYesNoBox = {
    control: base => ({
      ...base,
      minHeight: 58,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };


  const StatusOption = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  const StatusOptionGang = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' }
  ];

  const NibrsErrorReturn = (crimeId) => {
    const val = {
      'CrimeID': crimeId,
      "strComputerName": uniqueId,

      "OffenderId": "",
      "VictimID": ""
    }
    fetchPostData('NIBRS/ReturnCrimeId', val).then((res) => {
      if (res) {

        if (res?.Weapon !== undefined) {
          setweaponTypeStatus(res?.Weapon);
          setweaponTypeError(res?.WeaponError);
        }
        if (res.OffenderUsing !== undefined) {
          setoffenderUsingStatus(res?.OffenderUsing);
          setoffenderUsingError(res?.OffenderUsingError);
        }
        if (res.CriminalActivity !== undefined) {
          setcriminalActivityStatus(res?.CriminalActivity);
          setcriminalActivityError(res?.CriminalActivityError);
        }
        if (res.Bias !== undefined) {
          setbiasStatus(res?.Bias);
          setbiasStatusError(res?.BiasError);
        }
        if (res.SecurityViolated !== undefined) {
          setsecurityViolatedStatus(res?.SecurityViolated);
          setsecurityViolatedError(res?.SecurityViolatedError);
        }
        if (res.PointOfEntry !== undefined) {
          setpointOfEntryStatus(res?.PointOfEntry);
          setsetpointOfEntryError(res?.PointOfEntryError);
        }
        if (res.PointOfExit !== undefined) {
          setpointOfExitStatus(res?.PointOfExit);
          setpointOfExitError(res?.PointOfExitError);
        }
        if (res.MethodofOperation !== undefined) {
          setmethodOfOperationStatus(res?.MethodofOperation);
          setmethodOfOperationError(res?.MethodofOperationError);
        }

        setnibrsError(res);
      } else {
        setnibrsError([])
        setweaponTypeStatus(false);
        setweaponTypeError('');
        setoffenderUsingStatus(false);
        setoffenderUsingError('');
        setcriminalActivityStatus(false);
        setcriminalActivityError('');
        setbiasStatus(false);
        setbiasStatusError('');
        setsecurityViolatedStatus(false);
        setsecurityViolatedError('');
        setpointOfEntryStatus(false);
        setsetpointOfEntryError('');
        setpointOfExitStatus(false);
        setpointOfExitError('')
        setmethodOfOperationStatus(false);
        setmethodOfOperationError('');

      }
    })
  }

  //-------------------------------filtered Data Offender suspected of using--------------------------------
  const filteredOptions = crimeOffenderUseDrp.filter((opt) => {
    const selectedCodes = crimeOffenderUse?.map(item => item.code || item.id); // assuming 'code' or 'id' stores 'A', 'C', etc.
    if (selectedCodes?.includes('N')) {
      return opt.code === 'N'; // Only show N if it's selected
    } else if (selectedCodes?.some(code => ['A', 'C', 'D'].includes(code))) {
      return opt.code !== 'N'; // Hide N if any of A/C/D is selected
    }
    return true; // Default: show all options
  });


  // const customStylesWithColor = {
  //   control: base => ({
  //     ...base,
  //     backgroundColor: "#fce9bf",
  //     minHeight: 58,
  //     fontSize: 14,
  //     margintop: 2,
  //     boxShadow: 0,
  //   }),
  // };


  return (
    <>
      <OffListing  {...{ ListData }} />
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-6">
            <div className="row align-items-center" style={{ rowGap: "8px" }}>
              <div className="col-3 col-md-3 col-lg-3">
                <span data-toggle="modal" onClick={() => { setOpenPage('Pretend To Be') }} data-target="#ListModel" className='new-link px-0'>
                  Pretented To Be
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-9">
                <SelectBox
                  className="basic-multi-select"
                  options={pretentedDrp}
                  styles={customStylesWithOutColor}
                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => Agencychange(e)}

                  value={filterArray(pretendToBeID, 'label')}
                  placeholder='Select Pretented To Be From List'
                />
              </div>
              <div className="col-3 col-md-3 col-lg-3">

                <span data-toggle="modal" onClick={() => { setOpenPage('Point Of Entry') }} data-target="#ListModel" className='new-link px-0'>
                  Point Of Entry  {pointOfEntryStatus && (
                    <ErrorTooltip ErrorStr={pointOfEntryError} />
                  )}
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-9 ">
                <SelectBox
                  className="basic-multi-select"
                  styles={customStylesWithOutColor}
                  name='pointofentry'
                  options={pointEntryDrp}
                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => poinOfEntrychange(e)}

                  value={filterArray(crimePointOfEntry, 'label')}
                  placeholder='Select Point Of Entry From List'
                />
              </div>
             
              <div className="col-3 col-md-3 col-lg-3">

                <span data-toggle="modal" onClick={() => { setOpenPage('Tools Use') }} data-target="#ListModel" className='new-link px-0'>
                  Tools
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-9 ">
                <SelectBox
                  className="basic-multi-select"
                  styles={customStylesWithOutColor}
                  name='btoolsias'
                  options={toolsUseIDDrp}
                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => CrimeToolsUsechange(e)}
                  menuPlacement="top"

                  value={filterArray(crimeToolsUse, 'label')}
                  placeholder='Select Tools From List'
                />
              </div>
              <div className="col-3 col-md-3 col-lg-3">

                <span data-toggle="modal" onClick={() => { setOpenPage('Crime Suspect') }} data-target="#ListModel" className='new-link px-0'>
                  Suspect Action
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-9 ">
                <SelectBox
                  className="basic-multi-select"
                  styles={customStylesWithOutColor}
                  name='suspectaction'
                  options={crimeSuspectDrp}
                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => CrimeSuspectchange(e)}
                  menuPlacement="top"

                  value={filterArray(crimeSuspect, 'label')}
                  placeholder='Select Suspect Action From List'
                />
              </div>
              <div className="col-3 col-md-3 col-lg-3">

                <span data-toggle="modal" onClick={() => { setOpenPage('Method Of Operation') }} data-target="#ListModel" className='new-link px-0'>
                  Method&nbsp;Of&nbsp;Operation   {methodOfOperationStatus && (
                    <ErrorTooltip ErrorStr={methodOfOperationError} />
                  )}
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-9 ">
                <SelectBox
                  className="basic-multi-select"
                  styles={customStylesWithOutColor}
                  isMulti
                  isClearable={false}
                  hideSelectedOptions={true}
                  closeMenuOnSelect={false}
                  menuPlacement='top'
                  options={methodOfOperationDrp}
                  components={{ MultiValue, }}
                  onChange={(e) => CrimeMethodOfOpeationchange(e)}

                  value={filterArray(methodOfOperation, 'label')}
                  placeholder='Select Method Of Operation From List'

                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <div className="row align-items-center" style={{ rowGap: "8px" }}>
              <div className="col-3 col-md-3 col-lg-4">
                <span data-toggle="modal" onClick={() => { setOpenPage('Point Of Exit') }} data-target="#ListModel" className='new-link px-0'>
                  Point Of Exit  {pointOfExitStatus && (
                    <ErrorTooltip ErrorStr={pointOfExitError} />
                  )}
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-8  ">
                <SelectBox
                  className="basic-multi-select"
                  styles={customStylesWithOutColor}
                  name='pointofexit'
                  options={pointExitDrp}
                  isClearable={false}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => poinOfExitchange(e)}

                  value={filterArray(crimePointOfExitID, 'label')}
                  placeholder='Select Point Of Exit From List'
                />
              </div>

             
             
              <div className="col-3 col-md-3 col-lg-4">

                <span data-toggle="modal" onClick={() => { setOpenPage('Crime Target') }} data-target="#ListModel" className='new-link px-0'>
                  Target
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-8 " >
                <SelectBox
                  className="basic-multi-select"
                  name='target'
                  options={crimeTargetDrp}
                  styles={customStylesWithOutColor}
                  isClearable={false}

                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => CrimeTargetchange(e)}

                  value={filterArray(crimeTarget, 'label')}
                  menuPlacement="top"
                  placeholder='Select Target From List'
                />
              </div>
              <div className="col-3 col-md-3 col-lg-4">

                <span data-toggle="modal" onClick={() => { setOpenPage('Crime Security Violated') }} data-target="#ListModel" className='new-link px-0'>
                  Security Violated
                  {securityViolatedStatus && (
                    <ErrorTooltip ErrorStr={securityViolatedError} />
                  )}
                </span>
              </div>
              <div className="col-9 col-md-9 col-lg-8 ">
                <SelectBox
                  className="basic-multi-select"
                  name='SecurityViolated'
                  options={crimeSecurityviolatedDrp}
                  isClearable={false}
                  styles={customStylesWithOutColor}
                  isMulti
                  closeMenuOnSelect={false}
                  hideSelectedOptions={true}
                  components={{ MultiValue, }}
                  onChange={(e) => SecurityViolatedchange(e)}
                  menuPlacement="top"
                  value={filterArray(securityViolated, 'label')}
                  placeholder='Select Security Violated From List'
                />
              </div>
             
              <div className="col-12   text-right">
                {
                  effectiveScreenPermission ? (
                    effectiveScreenPermission[0]?.Changeok ? (
                      <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error() }}>Update</button>
                    ) : (
                      <></>
                    )
                  ) : (
                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error() }}>Update</button>
                  )
                }
                {/* <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error() }}>Update</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={check_Validation_Error} />
    </>
  )
}

export default BasicInformation
