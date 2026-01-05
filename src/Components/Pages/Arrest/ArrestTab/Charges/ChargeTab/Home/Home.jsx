
import React, { useState, useEffect, useContext, useRef } from 'react'
import Select from "react-select";
import { Decrypt_Id_Name, LockFildscolour, MultiSelectLockedStyle, Requiredcolour, customStylesWithOutColor, filterPassedTimeZonesProperty, getShowingDateText, isLockOrRestrictModule, nibrscolourStyles, stringToBase64, tableCustomStyles } from '../../../../../../Common/Utility';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray, threeColArrayWithCode } from '../../../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../../../redux/actions/Agency';
import ListModal from '../../../../../Utility/ListManagementModel/ListModal';
import { get_UcrClear_Drp_Data } from '../../../../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../../../Common/ChangesModal';
import { components } from "react-select";
import DatePicker from "react-datepicker";
import ArresList from '../../../../../ShowAllList/ArrestList';
import { classRegistry } from 'fabric';

const StatusOption = [
  { value: "A", label: "Attempted" },
  { value: "C", label: "Completed" },
];


const Charges = (props) => {

  const { DecChargeId, ListData, GetSingleData, get_List, isLocked, } = props

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  let DecIncID = 0, DecEIncID = 0, DecArrestId = 0;

  // DecArrestId = 0;
  const query = useQuery();
  var IncID = query?.get("IncId");
  var ArrestId = query?.get("ArrestId");
  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");
  var ChargeId = query?.get('ChargeId');
  var ChargeSta = query?.get('ChargeSta');
  var ArrNo = query?.get('ArrNo');
  var Name = query?.get("Name");
  let MstPage = query?.get('page');

  if (!IncID) IncID = 0;
  else DecIncID = parseInt((IncID));

  if (!IncID) { DecEIncID = 0; }
  else { DecEIncID = parseInt(base64ToString(IncID)); }


  function isBase64(str) {
    if (typeof str !== 'string') return false;
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  function base64ToString(str) {
    const bytes = Uint8Array.from(atob(str), c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  if (ArrestId && isBase64(ArrestId)) {
    try {
      DecArrestId = parseInt(base64ToString(ArrestId));
    } catch (err) {
      console.error("Error decoding ArrestId:", err);
    }
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const UCRClearDrpData = useSelector((state) => state.DropDown.UCRClearDrpData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);

  const { get_Arrest_Count, arrestChargeData, setArrestChargeData, datezone, NameId, setArrestName, get_OffenseName_Data, changesStatusCount, changesStatus, get_Incident_Count, get_Data_Arrest_Charge, get_ArrestCharge_Count, tabCountArrest, setChangesStatus, updateCount, setUpdateCount, ArresteName, get_Data_Arrest } = useContext(AgencyContext);
  const SelectedValue = useRef();

  const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
  const [Editval, setEditval] = useState([]);
  const [ArrestID, setArrestID] = useState('');
  const [ChargeID, setChargeID] = useState();
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [openPage, setOpenPage] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  // Law Title
  const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
  const [NIBRSDrpData, setNIBRSDrpData] = useState([]);
  // permissions
  const [addUpdatePermission, setaddUpdatePermission] = useState();
  const [ChargeLocalArr, setChargeLocalArr] = useState(
    JSON.parse(sessionStorage.getItem('ChargeLocalData')) || []
  );

  //------------------------------Weapon--------------------------------------
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
  const [typeOfSecurityList, setTypeOfSecurityList] = useState([]);
  const [propertyDrp, setPropertyDrp] = useState();
  const [propertyEditVal, setPropertyEditVal] = useState();
  const [categoryIdDrp, setCategoryIdDrp] = useState([]);

  const [value, setValue] = useState({
    AttemptComplete: 'N', // Default value for AttemptComplete
    'NameID': '', 'ArrestID': '', 'ArrestNumber': '', 'IncidentID': '', 'CreatedByUserFK': '', 'IncidentNumber': '',
    'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'ModifiedByUserFK': '', 'Name': '',
    'LawTitleId': '', 'AttemptComplete': '', 'CategoryId': '', 'OffenseDateTime': '',
  });

  const [errors, setErrors] = useState({
    'NIBRSIDError': '', 'ChargeCodeIDError': '', 'AttemptRequiredError': '', 'ChargeDateTimeError': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("C073", localStoreData?.AgencyID, localStoreData?.PINID)); get_Arrest_Count(DecArrestId);
      const storedVal = JSON.parse(localStorage.getItem('insertedArrestVal'));
      let arresteeID = storedVal?.ArresteeID
      if (!DecArrestId) { get_OffenseName_Data(arresteeID, true); }


    }
  }, [localStoreData]);

  useEffect(() => {
    if (!DecArrestId) {
      setChargeLocalArr(arrestChargeData)
    }
  }, [arrestChargeData]);


  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    }
    else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (LoginAgencyID) {
      const defaultDate = incReportedDate ? getShowingDateText(incReportedDate) : null;
      setValue({ ...value, 'ChargeDateTime': defaultDate });
    }
  }, [LoginAgencyID, incReportedDate]);

  useEffect(() => {
    if (LoginAgencyID) {
      setValue({
        ...value,
        'IncidentID': DecEIncID, 'ArrestID': ArrestID, 'ChargeID': DecChargeId, 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID,
        'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', 'AttemptComplete': '',
      });
      // get_Data_Arrest_Charge(DecArrestId);
      if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)); }
      // get_Property_Data(ArrestID);
      if (DecArrestId) { get_Data_Arrest_Charge(DecArrestId); }
      // setArrestID(ArrestID);
      get_Property_DropDown(DecEIncID);
      if (UCRClearDrpData?.length === 0) { dispatch(get_UcrClear_Drp_Data(LoginAgencyID)); }
      // lawTitle
      LawTitleIdDrpDwnVal(LoginAgencyID, null);
      // get category
      //  get_CategoryId_Drp(LoginAgencyID)
      // nibrs code
      get_NIBRS_Drp_Data(LoginAgencyID, null);
      // charge code
      get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
    }
  }, [LoginAgencyID]);

  useEffect(() => {
    if (ChargeID) {
      // setArrestID(ArrestID);
      get_ArrestCharge_Count(ChargeID);
    }
  }, [ChargeID])

  useEffect(() => {
    if (DecArrestId) {
      get_Property_Data(DecArrestId); get_Security_Data(DecArrestId); get_Security_DropDown(DecArrestId);
    }
  }, [DecArrestId])

  useEffect(() => {
    if (DecEIncID) {
      get_Property_DropDown(DecEIncID);
    }
  }, [DecEIncID])

  useEffect(() => {
    if (NameId) {
      get_List(NameId);
    }
  }, [NameId])

  useEffect(() => {
    if (DecArrestId) {
      get_Data_Arrest_Charge(DecArrestId); get_Arrest_Count(DecArrestId);
    }
  }, [DecArrestId])


  const isDuplicateCharge = () => {
    return arrestChargeData.some(item =>
      item.NIBRSID === value.NIBRSID &&
      item.ChargeCodeID === value.ChargeCodeID &&
      item.ChargeID !== value.ChargeID
    );
  };


  const check_Validation_Error = (e) => {
    const NIBRSIDError = RequiredFieldIncident(value.NIBRSID);
    const ChargeCodeIDError = RequiredFieldIncident(value.ChargeCodeID);
    const AttemptRequiredError = RequiredFieldIncident(value.AttemptComplete);
    const ChargeDateTimeErr = RequiredFieldIncident(value.OffenseDateTime)
    setErrors(pre => {
      return {
        ...pre,
        ['NIBRSIDError']: NIBRSIDError || pre['NIBRSIDError'],
        ['ChargeCodeIDError']: ChargeCodeIDError || pre['ChargeCodeIDError'],
        ['AttemptRequiredError']: AttemptRequiredError || pre['AttemptRequiredError'],
        ['ChargeDateTimeError']: ChargeDateTimeErr || pre['ChargeDateTimeError'],
      }
    });
  }

  const { ChargeCodeIDError, NIBRSIDError, AttemptRequiredError, ChargeDateTimeError } = errors

  useEffect(() => {
    if (ChargeCodeIDError === 'true' && NIBRSIDError === 'true' && AttemptRequiredError === 'true' && ChargeDateTimeError === 'true') {
      // 🔴 DUPLICATE CHECK
      if (isDuplicateCharge()) {
        toastifyError("Offense Code/Name & TIBRS Code Already Exists!");
        setErrors({ ...errors, ['ChargeCodeIDError']: '' });
        return;
      }
      if ((ChargeSta === true || ChargeSta === 'true') && ChargeID) {
        update_Arrest_Charge();
      } else {
        Add_Charge_Data();
      }
    }
  }, [ChargeCodeIDError, NIBRSIDError, AttemptRequiredError, ChargeDateTimeError]);




  useEffect(() => {
    if (DecChargeId) {
      GetSingleDataCharge(DecChargeId);
    } else {
      Reset()
    }
  }, [DecChargeId]);



  const Reset = () => {
    setEditval([]);
    setValue({ ...value, 'CreatedByUserFK': '', 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'WarrantID': '', 'LawTitleId': '', 'AttemptComplete': '', 'CategoryId': '', 'OffenseDateTime': '', });
    setStatesChangeStatus(false); setChangesStatus(false); setErrors({});
    // setMultiSelected([]); setMultiSelected(prevValues => { return { ...prevValues, ['PropertyID']: '' } })

    // lawTitle
    LawTitleIdDrpDwnVal(LoginAgencyID, null);
    // nibrs code
    get_NIBRS_Drp_Data(LoginAgencyID, null);
    // charge code
    get_ChargeCode_Drp_Data(LoginAgencyID, null, null);

  }

  const get_CategoryId_Drp = (LoginAgencyID) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('ChargeCategory/GetDataDropDown_ChargeCategory', val).then((data) => {
      if (data) {
        setCategoryIdDrp(Comman_changeArrayFormat(data, 'ChargeCategoryID', 'Description',))
      } else {
        setCategoryIdDrp([]);
      }
    })
  }

  const LawTitleIdDrpDwnVal = async (loginAgencyID, ChargeCodeID) => {
    const val = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID }
    await fetchPostData('LawTitle/GetDataDropDown_LawTitle', val).then((data) => {
      if (data) {
        setLawTitleIdDrp(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'));
      } else {
        setLawTitleIdDrp([]);
      }
    })
  }

  const get_NIBRS_Drp_Data = (LoginAgencyID, LawTitleID,) => {
    const val = { 'AgencyID': LoginAgencyID, 'LawTitleID': LawTitleID ? LawTitleID : null, 'IncidentID': DecIncID, }
    fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((res) => {
      if (res) {
        setNIBRSDrpData(threeColArrayWithCode(res, 'FBIID', 'Description', 'FederalSpecificFBICode'));
      } else {
        setNIBRSDrpData([]);
      }
    })
  }

  const get_ChargeCode_Drp_Data = (LoginAgencyID, FBIID, LawTitleID) => {
    const val = { 'AgencyID': LoginAgencyID, 'FBIID': FBIID, 'LawTitleID': LawTitleID, }
    fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
      if (data) {
        // setChargeCodeDrp(Comman_changeArrayFormat(data, "ChargeCodeID", "Description"));
        setChargeCodeDrp(threeColArray(data, "ChargeCodeID", "Description", "CategoryID"));
      } else {
        setChargeCodeDrp([]);
      }
    })
  };

  const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, chargeCodeId, categoryId) => {
    const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: chargeCodeId };
    const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: DecIncID, ChargeCodeID: chargeCodeId };

    try {
      const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
        fetchPostData('LawTitle/GetDataDropDown_LawTitle', lawTitleObj),
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', nibrsCodeObj)
      ]);

      const lawTitleArr = Comman_changeArrayFormat(lawTitleResponse, 'LawTitleID', 'Description');
      const nibrsArr = threeColArrayWithCode(nibrsCodeResponse, 'FBIID', 'Description', 'FederalSpecificFBICode');

      setValue({
        ...value,
        LawTitleId: lawTitleArr[0]?.value,
        NIBRSID: nibrsArr[0]?.value,
        ChargeCodeID: chargeCodeId,
        CategoryId: categoryId,
      });
    } catch (error) {
      console.error('Error during data fetching:', error);

    }
  };

  const onChangeDrpLawTitle = async (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {

      if (name === "LawTitleId") {
        setValue({ ...value, ['LawTitleId']: e.value, ['NIBRSID']: null, ['ChargeCodeID']: null, });
        setChargeCodeDrp([]); setNIBRSDrpData([]);

        // nibrs code 
        get_NIBRS_Drp_Data(LoginAgencyID, e.value);
        // charge code
        get_ChargeCode_Drp_Data(LoginAgencyID, value?.NIBRSID, e.value);

      } else if (name === 'ChargeCodeID') {
        // getCategory
        setCategoryIdDrp([])
        get_CategoryId_Drp(LoginAgencyID, e.id);

        const res = await getLawTitleNibrsByCharge(LoginAgencyID, value?.LawTitleId, e.value, e.id);

      } else {
        setValue({ ...value, [name]: e.value });

      }
    } else {
      if (name === "LawTitleId") {
        setValue({ ...value, ['LawTitleId']: null, ['NIBRSID']: '', ['ChargeCodeID']: null, });
        setChargeCodeDrp([]); setNIBRSDrpData([]);

        //law title
        LawTitleIdDrpDwnVal(LoginAgencyID, null);
        // nibrs code
        get_NIBRS_Drp_Data(LoginAgencyID, null);
        //offence code 
        get_ChargeCode_Drp_Data(LoginAgencyID, null, null);

      } else if (name === 'ChargeCodeID') {

        setValue({ ...value, ['ChargeCodeID']: null, ['CategoryId']: null });
        // getCategory
        setCategoryIdDrp([])
        // get_CategoryId_Drp(loginAgencyID, null);

      } else {
        setValue({ ...value, [name]: null });
      }
    }
  }

  const onChangeNIBRSCode = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      if (name === 'NIBRSID') {
        setValue({ ...value, ['NIBRSID']: e.value, ['ChargeCodeID']: null, });
        setChargeCodeDrp([]);
        get_ChargeCode_Drp_Data(LoginAgencyID, e.value, value?.LawTitleId);
      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === "NIBRSID") {
        setValue({ ...value, [name]: null, ['ChargeCodeID']: null, });
        get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else if (e === null) {
      setValue({ ...value, [name]: null });
    } else {
      setValue({ ...value, [name]: null });
    }
  }

  const HandleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value, });
    setChangesStatus(true); setStatesChangeStatus(true)
  };

  const handlcount = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === 'Count') {
      const ele = e.target.value.replace(/[^0-9.]/g, "")
      if (ele.includes('.')) {
        if (ele.length === 16) {
          setValue({ ...value, [e.target.name]: ele });
        } else {
          if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
            const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
            if (!checkDot) {
              setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
              return;
            } else { return; }
          } else {
            setValue({ ...value, [e.target.name]: ele });
          }
        }
      } else { setValue({ ...value, [e.target.name]: ele }); }
    }
    else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  }

  const onChangeAttComplete = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  }


  //-----------------------------------------------ChargeTab----------------------------------------------------
  useEffect(() => {
    if (Editval) {
      console.log(Editval)
      setValue({
        ...value,
        'UCRClearID': Editval[0]?.UCRClearID || Editval?.UCRClearID, 'CategoryId': Editval[0]?.CategoryId || Editval?.CategoryId,
        'ChargeCodeID': Editval[0]?.ChargeCodeID || Editval?.ChargeCodeID, 'Count': Editval[0]?.Count || Editval?.Count, 'Name': Editval[0]?.Name || Editval?.Name, 'NIBRSID': Editval[0]?.NIBRSID || Editval?.NIBRSCodeId, 'ChargeID': Editval[0]?.ChargeID,
        'ModifiedByUserFK': LoginPinID, 'LawTitleId': Editval[0]?.LawTitleId || Editval?.LawTitleId,
        'AttemptComplete': (Editval[0]?.AttemptComplete === "C") || (Editval?.AttemptComplete === "C")
          ? "C" : (Editval[0]?.AttemptComplete === "A") || (Editval?.AttemptComplete === "A")
            ? "A" : "",
        // 'OffenseDateTime': Editval[0]?.OffenseDateTime ? getShowingDateText(Editval[0]?.OffenseDateTime) : "",
        'OffenseDateTime': Editval[0]?.OffenseDateTime || Editval?.OffenseDateTime,
      });
      setArrestName(Editval[0]?.Name ? Editval[0]?.Name : '');
      // lawTitle 
      LawTitleIdDrpDwnVal(LoginAgencyID, null);
      // nibrs code
      get_NIBRS_Drp_Data(LoginAgencyID, null);
      // charge code
      get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
      // get category
      get_CategoryId_Drp(LoginAgencyID, Editval[0]?.CategoryId)
    } else {
      setValue({
        ...value, 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', 'AttemptComplete': '', 'CategoryId': '', 'OffenseDateTime': '',
      });
    }
  }, [Editval, changesStatusCount]);

  const GetSingleDataCharge = (ChargeID) => {
    if (DecArrestId) {
      const val = { 'ChargeID': ChargeID };
      fetchPostData('ArrestCharge/GetSingleData_ArrestCharge', val).then((res) => {
        if (res) {
          setEditval(res);
        } else {
          setEditval([]);
        }
      });
    } else {
      const localChargeData = JSON.parse(sessionStorage.getItem('ChargeLocalData')) || [];
      const chargeData = localChargeData.find(charge => charge.ChargeID === ChargeID);
      if (chargeData) {
        setEditval([chargeData]);
      } else {
        setEditval([]);
      }
    }
  };

  const SyncLocalChargesToServer = async (ArrestID, DecEIncID, loginPinID, LoginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge) => {
    if (!ArrestID || !ChargeLocalArr?.length) return;
    console.log(ChargeLocalArr)

    const chargeValue = ChargeLocalArr.filter(data => !data.OffenseID);
    console.log(chargeValue);

    console.log(chargeValue)

    for (let charge of chargeValue) {

      console.log(charge, 'hello1')

      const val = {
        ...charge, ChargeID: null, ArrestID, IncidentID: DecEIncID, CreatedByUserFK: LoginPinID, AgencyID: LoginAgencyID,
      };
      await AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
        if (res?.success) { console.log(`✅ Synced local charge: ${charge.ChargeCodeID}`); }
      });
    }
    setChargeLocalArr([]); sessionStorage.removeItem('ChargeLocalData'); get_Arrest_Count(ArrestID); get_Data_Arrest_Charge(ArrestID);
  };


  const insert_Arrest_Data = async () => {
    if (ChargeLocalArr?.length === 0 && tabCountArrest?.ChargeCount === 0 && arrestChargeData.length === 0) {
      toastifyError("Please add at least one charge");
      return;
    }
    const storedVal = JSON.parse(localStorage?.getItem('insertedArrestVal'));
    AddDeleteUpadate('Arrest/Insert_Arrest', storedVal).then(async (res) => {
      if (res?.success) {
        const newArrestID = res.ArrestID;
        setChargeLocalArr([]);
        sessionStorage.removeItem('ChargeLocalData');
        await SyncLocalChargesToServer(newArrestID, DecEIncID, LoginPinID, LoginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge);
        console.log(res?.ArrestID)
        toastifySuccess(res?.Message);
        setArrestID(res?.ArrestID); get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, LoginPinID);
        navigate(
          `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(
            res?.ArrestID
          )}&ArrNo=${res?.ArrestNumber}&Name=${ArresteName}&ArrestSta=${true}&ChargeSta=${false}`
        );
        get_Incident_Count(DecEIncID); GetSingleData(res.ArrestID, DecEIncID);
      }
    });
  };

  // const Add_Charge_Data = (MainArrestID) => {
  //   const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime } = value;
  //   const newCharge = {
  //     ...value, Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime
  //   };
  //   if (MainArrestID || DecArrestId) {
  //     const val = { ...newCharge, ChargeID: DecChargeId, ArrestID: MainArrestID || DecArrestId, };
  //     AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
  //       if (res.success) {
  //         const parsedData = JSON.parse(res.data);
  //         const message = parsedData.Table[0].Message;
  //         toastifySuccess(message); get_Arrest_Count(MainArrestID || DecArrestId);
  //         Reset(); get_Data_Arrest_Charge(MainArrestID || DecArrestId);
  //         setChargeID(res.ChargeID); get_Incident_Count(DecEIncID); get_Data_Arrest(DecEIncID, LoginPinID);
  //         setChangesStatus(false); get_ArrestCharge_Count(ChargeID); setStatesChangeStatus(false);
  //         setUpdateCount(updateCount + 1);
  //         setErrors({ ...errors, ['ChargeCodeIDError']: '' });
  //         // lawTitle
  //         LawTitleIdDrpDwnVal(LoginAgencyID, null);
  //         // nibrs code
  //         get_NIBRS_Drp_Data(LoginAgencyID, null);
  //         // charge code
  //         get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
  //       }
  //     });
  //   } else {
  //     const localCharge = {
  //       ...newCharge,
  //       ChargeID: `local-${Date.now()}`,
  //       ArrestID: null,
  //       NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
  //       ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
  //       LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
  //       CategoryId_Description: categoryIdDrp?.find(x => x.value === CategoryId)?.label || '',
  //       UCRClearID_Description: UCRClearDrpData?.find(x => x.value === UCRClearID)?.label || '',
  //       AttemptComplete: AttemptComplete, OffenseDateTime: OffenseDateTime, Count: Count, Name: Name,

  //     };
  //     const isDuplicate = ChargeLocalArr?.some(item =>
  //       item.ChargeCodeID === localCharge.ChargeCodeID &&
  //       item.NIBRSID === localCharge.NIBRSID
  //     );
  //     if (isDuplicate) {
  //       toastifyError('This charge already exists locally.');
  //       setErrors({ ...errors, ['ChargeCodeIDError']: '' });
  //     }
  //     const updatedLocalCharges = [...ChargeLocalArr, localCharge];
  //     setChargeLocalArr(updatedLocalCharges);
  //     sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedLocalCharges));
  //     Reset(); setChangesStatus(false); setStatesChangeStatus(false);
  //   }
  // };

  const Add_Charge_Data = () => {
    const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime, IncidentID } = value;
    const newCharge = {
      ...value, Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime, IncidentID
    };
    if (ArrestID || DecArrestId) {
      const val = { ...newCharge, ChargeID: DecChargeId, ArrestID: ArrestID || DecArrestId, IncidentID: DecEIncID };
      AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
        if (res.success) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message); get_Arrest_Count(ArrestID || DecArrestId);
          get_Data_Arrest_Charge(ArrestID || DecArrestId); get_ArrestCharge_Count(DecChargeId);
          Reset(); setChangesStatus(false); setStatesChangeStatus(false);
          setUpdateCount(updateCount + 1);
          setErrors({ ...errors, ['ChargeCodeIDError']: '', });
          get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, LoginPinID);
          // Reload dropdowns
          LawTitleIdDrpDwnVal(LoginAgencyID, null);
          get_NIBRS_Drp_Data(LoginAgencyID, null);
          get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
        }
      });
    } else {
      const localCharge = {
        ...newCharge,
        ChargeID: `local-${Date.now()}`,
        ArrestID: null,
        NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
        ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
        LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
        CategoryId_Description: categoryIdDrp?.find(x => x.value === CategoryId)?.label || '',
        UCRClearID_Description: UCRClearDrpData?.find(x => x.value === UCRClearID)?.label || '',
        AttemptComplete: AttemptComplete, OffenseDateTime: OffenseDateTime, Count: Count, Name: Name,
      };
      const isDuplicate = ChargeLocalArr?.some(item =>
        item.ChargeCodeID === localCharge.ChargeCodeID &&
        item.NIBRSID === localCharge.NIBRSID
      );
      if (isDuplicate) {
        toastifyError('This charge already exists locally.');
        return;
      }
      const updatedLocalCharges = [...ChargeLocalArr, localCharge];
      setChargeLocalArr(updatedLocalCharges); sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedLocalCharges));
      Reset(); setChangesStatus(false); setStatesChangeStatus(false);
      setArrestChargeData(updatedLocalCharges)
    }
  };

  // const update_Arrest_Charge = () => {
  //   const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime } = value;
  //   if (DecArrestId) {
  //     const val = {
  //       'IncidentID': DecEIncID, 'ArrestID': DecArrestId, 'ChargeID': ChargeID, 'ModifiedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID, 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
  //       'LawTitleId': LawTitleId, 'AttemptComplete': AttemptComplete, 'CategoryId': CategoryId, 'OffenseDateTime': OffenseDateTime
  //     };
  //     AddDeleteUpadate('ArrestCharge/Update_ArrestCharge', val).then((res) => {
  //       const parsedData = JSON.parse(res.data);
  //       const message = parsedData.Table[0].Message;
  //       toastifySuccess(message); setStatesChangeStatus(false);
  //       get_Data_Arrest_Charge(DecArrestId); setErrors({ ...errors, ['ChargeCodeIDError']: '' }); setChangesStatus(false);
  //       // lawTitle
  //       LawTitleIdDrpDwnVal(LoginAgencyID, null); get_Incident_Count(DecEIncID);
  //       // nibrs code
  //       get_NIBRS_Drp_Data(LoginAgencyID, null);
  //       // charge code
  //       get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
  //     });
  //   } else {
  //     const updatedCharges = ChargeLocalArr.map(charge => {
  //       if (charge.ChargeID === DecChargeId) {
  //         return {
  //           ...charge, ChargeCodeID,
  //           NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
  //           ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
  //           LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
  //           CategoryId_Description: categoryIdDrp?.find(x => x.value === CategoryId)?.label || '',
  //           UCRClearID_Description: UCRClearDrpData?.find(x => x.value === UCRClearID)?.label || '',
  //           AttemptComplete: AttemptComplete, OffenseDateTime: OffenseDateTime, Count: Count, Count: Count, Name: Name,
  //         };
  //       }
  //       return charge;
  //     });
  //     setChargeLocalArr(updatedCharges);
  //     sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedCharges));
  //     setStatesChangeStatus(false); setChangesStatus(false); setErrors({ ...errors, ['ChargeCodeIDError']: '' });
  //     LawTitleIdDrpDwnVal(LoginAgencyID, null);
  //     get_NIBRS_Drp_Data(LoginAgencyID, null);
  //     get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
  //   }
  // };
  console.log(DecArrestId)
  console.log(ArrestID)

  const update_Arrest_Charge = () => {
    const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime } = value;
    if (DecArrestId) {
      const val = {
        'IncidentID': DecEIncID, 'ArrestID': DecArrestId, 'ChargeID': ChargeID, 'ModifiedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID, 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
        'LawTitleId': LawTitleId, 'AttemptComplete': AttemptComplete, 'CategoryId': CategoryId, 'OffenseDateTime': OffenseDateTime
      };
      AddDeleteUpadate('ArrestCharge/Update_ArrestCharge', val).then((res) => {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        setStatesChangeStatus(false);
        setChangesStatus(false);
        get_Data_Arrest_Charge(DecArrestId);
        setErrors({ ...errors, ['ChargeCodeIDError']: '', });
        LawTitleIdDrpDwnVal(LoginAgencyID, null);
        get_NIBRS_Drp_Data(LoginAgencyID, null);
        get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
      });
    } else {
      const updatedCharges = ChargeLocalArr.map(charge => {
        if (charge.ChargeID === DecChargeId) {
          return {
            ...charge, ChargeCodeID,
            NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
            ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
            LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
            CategoryId_Description: categoryIdDrp?.find(x => x.value === CategoryId)?.label || '',
            UCRClearID_Description: UCRClearDrpData?.find(x => x.value === UCRClearID)?.label || '',
            AttemptComplete: AttemptComplete, OffenseDateTime: OffenseDateTime, Count: Count, Name: Name,
          };
        }
        return charge;
      });
      setChargeLocalArr(updatedCharges);
      sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedCharges));
      setStatesChangeStatus(false);
      setChangesStatus(false);
      setErrors({ ...errors, ['ChargeCodeIDError']: '', });
      LawTitleIdDrpDwnVal(LoginAgencyID, null);
      get_NIBRS_Drp_Data(LoginAgencyID, null);
      get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
    }
  };



  const DeleteArrestCharge = () => {
    const val = { 'ChargeID': ChargeID, 'DeletedByUserFK': LoginPinID }
    AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Data_Arrest_Charge(DecArrestId); get_Arrest_Count(ArrestID);
        Reset(); get_ArrestCharge_Count(ChargeID); setErrors(''); setStatusFalse(); get_Incident_Count(DecEIncID);
      } else { console.log("Somthing Wrong"); }
    })
  }

  const columns = [
    {
      name: 'NIBRS Code',
      selector: (row) => row.NIBRS_Description || row.FBICode_Desc,
      sortable: true
    },
    {
      name: 'Offense Code/Name',
      selector: (row) => row.ChargeCode_Description || row.Offense_Description,
      sortable: true
    },
    {
      name: 'Law Title',
      selector: (row) => row.LawTitle || row.LawTitleId,
      sortable: true
    },
    {
      name: (
        <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>
          Delete
        </p>
      ),
      cell: (row) =>
        arrestChargeData.length > 1 ? (
          <div style={{ position: 'absolute', top: 4, right: 10 }}>
            <span
              onClick={() => { setChargeID(row.ChargeID); }}
              className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
              data-toggle="modal"
              data-target="#DeleteModal"
            >
              <i className="fa fa-trash"></i>
            </span>
          </div>
        ) : null
    }
  ];


  const conditionalRowStyles = [
    {
      when: row => row.ChargeID === ChargeID,
      style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
    },
  ];

  const set_Edit_Value = (row) => {
    if (changesStatus) {
      const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
      modal.show();
    } else {
      if (MstPage === "MST-Arrest-Dash") {
        navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ChargeId=${stringToBase64(row.ChargeID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeSta=${true}&SideBarStatus=${false}`);
        // setStatus(true); 
        if (row.OffenseID) {
          setEditval(row);
        }
        else {
          get_ArrestCharge_Count(row?.ChargeID); setErrors(''); setChargeID(row.ChargeID);
          GetSingleDataCharge(row.ChargeID);
        }
      } else {
        if (row.OffenseID) {
          navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ChargeId=${stringToBase64(row.ChargeID)}&Name=${Name}&ArrNo=${ArrNo}&ChargeSta=${true}&SideBarStatus=${false}`)
          setEditval(row);
        }
        else {
          navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ChargeId=${stringToBase64(row.ChargeID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeSta=${true}&SideBarStatus=${false}`)
          get_ArrestCharge_Count(row.ChargeID);
          setErrors(''); setStatesChangeStatus(false);
          //  setStatus(true); 
          setChargeID(row.ChargeID); setChangesStatus(false); GetSingleDataCharge(row.ChargeID); get_Arrest_Count(row?.ArrestID);
          get_Property_Data(row?.ArrestID);
        }
      }
    }
  }

  const setStatusFalse = () => {
    if (MstPage === "MST-Arrest-Dash") {
      navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${DecArrestId}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeId=${('')}&ChargeSta=${false}&SideBarStatus=${false}`)
      setErrors(''); setChargeID('');
      Reset();
    } else {
      navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(DecArrestId)}&Name=${Name}&ArrNo=${ArrNo}&ChargeId=${('')}&ChargeSta=${false}&SideBarStatus=${false}`)
      setErrors(''); setChargeID(''); Reset();
    }
  }

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


  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  //-------------------------------------Weapon--------------------------
  useEffect(() => {
    if (typeOfSecurityEditVal) {
      setMultiSelected(prevValues => { return { ...prevValues, ['ChargeWeaponTypeID']: typeOfSecurityEditVal } })
    }
  }, [typeOfSecurityEditVal])

  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const [multiSelected, setMultiSelected] = useState({
    ChargeWeaponTypeID: null,
  })

  useEffect(() => {
    if (typeOfSecurityEditVal) {
      setMultiSelected(prevValues => { return { ...prevValues, ['ChargeWeaponTypeID']: typeOfSecurityEditVal } })
    }
  }, [typeOfSecurityEditVal])

  const typeofsecurity = (multiSelected) => {
    setMultiSelected({ ...multiSelected, ChargeWeaponTypeID: multiSelected })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'ChargeWeaponID', 'ChargeWeaponType/Delete_ChargeWeaponType')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'ChargeWeaponTypeID', 'ChargeWeaponType/Insert_ChargeWeaponType')
    }

  }

  const get_Security_Data = (ArrestID) => {
    const val = { 'ArrestID': ArrestID }
    fetchPostData('ChargeWeaponType/GetData_ChargeWeaponType', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(Comman_changeArrayFormatChargeWeapon(res, 'ChargeWeaponID', 'WeaponCode', 'PretendToBeID', 'Weapon_Description', 'Weapon_Description', 'ChargeWeaponTypeID'));
      }
      else { setTypeOfSecurityEditVal([]); }
    })
  }

  const Comman_changeArrayFormatChargeWeapon = (data, Id, Code, type, col3, col4) => {
    if (type === 'PretendToBeID') {
      const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col4], id: sponsor[Code], code: sponsor[Code] })
      )
      return result
    } else {
      const result = data?.map((sponsor) =>
        ({ value: sponsor[Id], label: sponsor[col4], code: sponsor[col4] })
      )
      return result
    }
  }

  const get_Security_DropDown = (ArrestID) => {
    const val = { 'ArrestID': ArrestID }
    fetchPostData('ChargeWeaponType/GetData_InsertChargeWeaponType', val).then((data) => {
      if (data) {
        setTypeOfSecurityList(threeColArray(data, 'WeaponID', 'Description', 'WeaponCode'));
      } else {
        setTypeOfSecurityList([])
      }
    })
  }

  const InSertBasicInfo = (id, col1, url) => {
    const val = { 'ArrestID': DecArrestId, [col1]: id, 'CreatedByUserFK': LoginPinID, }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ChargeWeaponTypeID' && get_Security_Data(DecArrestId); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(DecArrestId);
      } else { console.log("Somthing Wrong"); }
    })
  }

  const DelSertBasicInfo = (ChargeWeaponID, col1, url) => {
    const val = { [col1]: ChargeWeaponID, 'DeletedByUserFK': LoginPinID, }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ChargeWeaponID' && get_Security_Data(DecArrestId); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(DecArrestId);
      }
    })
  }

  function filterArray(arr, key) {
    return [...new Map(arr?.map(item => [item[key], item])).values()]
  }

  const filterUnArmed = (arr) => {
    const ValArr = multiSelected.ChargeWeaponTypeID ? multiSelected.ChargeWeaponTypeID : []

    const unArmedArr = ValArr?.filter((item) => item?.id === '01');

    if (unArmedArr?.length > 0) {
      return []

    } else {
      const weaponValues = ValArr?.map((item) => item?.id)
      const otherFilterArr = arr?.filter((item) => !weaponValues?.includes(item?.id));
      return otherFilterArr

    }
  }

  //-------------------------------------------Property-----------------------------------
  useEffect(() => {
    if (propertyEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['PropertyID']: propertyEditVal } }) }
  }, [propertyEditVal])

  const get_Property_Data = (ArrestID) => {
    const val = {
      'ArrestID': ArrestID,
    }
    fetchPostData('ArrestProperty/GetData_ArrestProperty', val).then((res) => {
      if (res) {
        setPropertyEditVal(Comman_changeArrayFormat(res, 'ArrestPropertyID', 'ArrestID', 'PretendToBeID', 'PropertyID', 'Description'));
      } else {
        setPropertyEditVal([]);
      }
    })
  }

  const get_Property_DropDown = (incidentID) => {
    const val = {
      'IncidentID': incidentID,
    }
    fetchPostData('ArrestProperty/GetData_InsertArrestProperty', val).then((data) => {
      if (data) {
        setPropertyDrp(Comman_changeArrayFormat(data, 'PropertyID', 'Description',))
      } else {
        setPropertyDrp([])
      }
    })
  }

  const Property = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      PropertyID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < propertyEditVal?.length) {
      let missing = null;
      let i = propertyEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(propertyEditVal[--i])) ? missing : propertyEditVal[i];
      }
      DelSertBasicInfopro(missing.value, 'ArrestPropertyID', 'ArrestProperty/Delete_ArrestProperty')
    } else {
      InSertBasicInfopro(multiSelected[len].value, 'PropertyID', 'ArrestProperty/Insert_ArrestProperty')
    }
  }

  const InSertBasicInfopro = (id, col1, url) => {
    const val = {
      'ChargeID': ChargeID,
      'ArrestID': DecArrestId,
      [col1]: id,
      'CreatedByUserFK': LoginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'PropertyID' && get_Property_Data(DecArrestId); get_Security_Data(DecArrestId); get_Property_DropDown(DecEIncID); get_Arrest_Count(ArrestID)
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfopro = (ArrestPropertyID, col1, url) => {
    const val = {
      [col1]: ArrestPropertyID,
      'DeletedByUserFK': LoginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ArrestPropertyID' && get_Property_Data(DecArrestId); get_Security_Data(DecArrestId); get_Property_DropDown(DecEIncID); get_Arrest_Count(DecArrestId)
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const customStylesWithOutColorMulti = {
    control: base => ({
      ...base,
      minHeight: 60,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const getValidDate = (date) => {
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d : null;
  };

  console.log(arrestChargeData)

  return (
    <>
      <ArresList {...{ ListData }} />
      <div className="container-fluid">
        <fieldset className="">
          <legend className="w-auto px-2">Weapon & Property</legend>
          <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
            <div className="col-2 col-md-2 col-lg-1 ">
              <label htmlFor="" className='label-name mt-0 '>Weapon</label>
            </div>
            <div className="col-6 col-md-6 col-lg-5">
              {
                value?.ChargeWeaponTypeIDName ?
                  <Select
                    className="basic-multi-SelectBox"
                    isMulti
                    name='ChargeWeaponTypeID'
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={true}
                    options={typeOfSecurityList ? filterUnArmed(typeOfSecurityList) : []}
                    onChange={(e) => typeofsecurity(e)}
                    value={filterArray(multiSelected.ChargeWeaponTypeID, 'label')}
                    components={{ MultiValue, }}
                    placeholder="Select Type Of Weapon From List.."
                    // styles={customStylesWithOutColorMulti}
                    // isDisabled={!value?.ChargeID}
                    styles={isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true) ? MultiSelectLockedStyle : customStylesWithOutColorMulti}
                    isDisabled={!DecArrestId || isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true)}
                  />
                  :
                  <Select
                    className="basic-multi-select"
                    isMulti
                    name='ChargeWeaponTypeID'
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={true}
                    options={typeOfSecurityList ? filterUnArmed(typeOfSecurityList) : []}
                    onChange={(e) => typeofsecurity(e)}
                    value={filterArray(multiSelected.ChargeWeaponTypeID, 'label')}
                    placeholder="Select Type Of Weapon From List.."
                    components={{ MultiValue, }}
                    // styles={customStylesWithOutColorMulti}
                    // isDisabled={!value?.ChargeID}
                    styles={isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true) ? MultiSelectLockedStyle : customStylesWithOutColorMulti}
                    isDisabled={!DecArrestId || isLockOrRestrictModule("Lock", typeOfSecurityEditVal, isLocked, true)}
                  />
              }
            </div>
            {/* Property Section */}
            <div className="col-1 col-md-2 col-lg-1 ">
              <label htmlFor="" className='label-name mt-0'>Property</label>
            </div>
            <div className="col-6 col-md-6 col-lg-5 ">
              <Select
                options={propertyDrp}
                isClearable={false}
                closeMenuOnSelect={false}
                placeholder="Select.."
                ref={SelectedValue}
                className="basic-multi-select"
                isMulti
                components={{ MultiValue, }}
                onChange={(e) => Property(e)}
                value={multiSelected.PropertyID}
                name='PropertyID'
                noDataComponent={'There are no data to display'}
                styles={isLockOrRestrictModule("Lock", propertyEditVal, isLocked, true) ? MultiSelectLockedStyle : customStylesWithOutColorMulti}
                isDisabled={!DecArrestId || isLockOrRestrictModule("Lock", propertyEditVal, isLocked, true)}
              // isDisabled={!value?.ChargeID}
              // styles={customStylesWithOutColorMulti}
              />
            </div>
          </div>
        </fieldset>
      </div>

      <div className="col-12">
        <fieldset className="p-2">
          <legend className="w-auto px-2">Charge Information</legend>
          <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
            <div className="col-2 col-md-2 col-lg-1 ">
              <label htmlFor="" className='new-label mb-0'>
                Law Title
              </label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 ">
              <Select
                name='LawTitleId'
                value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                options={lawTitleIdDrp}
                isClearable
                onChange={(e) => onChangeDrpLawTitle(e, 'LawTitleId')}
                placeholder="Select..."
                styles={isLockOrRestrictModule("Lock", Editval[0]?.LawTitleId, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={!value?.ChargeID || isLockOrRestrictModule("Lock", Editval[0]?.LawTitleId, isLocked)}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-2 text-right">
              <label htmlFor="" className='new-label mb-0'>
                TIBRS Code
                {errors.NIBRSIDError !== 'true' && (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block", }}>{errors.NIBRSIDError}</span>
                )}
              </label>
            </div>
            <div className="col-4 col-md-4 col-lg-3">
              <Select
                name="NIBRSID"
                value={NIBRSDrpData?.filter((obj) => obj.value === value?.NIBRSID)}
                isClearable
                options={NIBRSDrpData}
                onChange={(e) => { onChangeNIBRSCode(e, 'NIBRSID') }}
                placeholder="Select..."
                styles={isLockOrRestrictModule("Lock", Editval[0]?.NIBRSID, isLocked) ? LockFildscolour : Requiredcolour}
                isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.NIBRSID, isLocked)}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-2 ">
              <label htmlFor="" className='new-label mb-0'>
                Category
              </label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 ">
              <Select
                name='CategoryId'
                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryId)}
                options={categoryIdDrp}
                onChange={(e) => ChangeDropDown(e, 'CategoryId')}
                isClearable
                placeholder="Select..."
                styles={isLockOrRestrictModule("Lock", Editval[0]?.CategoryId, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.CategoryId, isLocked)}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1  text-right">
              <Link to={'/ListManagement?page=Charge%20Code&call=/Arr-Charge-Home'} className='new-link '>
                Offense Code/Name
                {errors.ChargeCodeIDError !== 'true' ? (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block", }}>{errors.ChargeCodeIDError}</span>
                ) : null}
              </Link>
            </div>
            <div className="col-4 col-md-4 col-lg-7 mt-0 ">
              <Select
                name="ChargeCodeID"
                value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                isClearable
                options={chargeCodeDrp}
                onChange={(e) => { onChangeDrpLawTitle(e, 'ChargeCodeID') }}
                placeholder="Select..."
                styles={isLockOrRestrictModule("Lock", Editval[0]?.ChargeCodeID, isLocked) ? LockFildscolour : Requiredcolour}
                isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.ChargeCodeID, isLocked)}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-2 text-right" >
              <label className="new-label mb-0"  >
                Attempted/Completed
                {errors.AttemptRequiredError !== 'true' && (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block", }}>
                    {errors.AttemptRequiredError}
                  </span>
                )}
              </label>
            </div>
            <div className="col-3 col-md-4 col-lg-2">
              <Select
                onChange={(e) => onChangeAttComplete(e, "AttemptComplete")}
                options={StatusOption}
                isClearable
                placeholder="Select..."
                value={StatusOption.find((option) => option.value === value?.AttemptComplete) || null}
                styles={isLockOrRestrictModule("Lock", Editval[0]?.AttemptComplete, isLocked) ? LockFildscolour : !value?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles}
                isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.AttemptComplete, isLocked)}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 text-right">
              <span data-toggle="modal" onClick={() => {
                setOpenPage('UCR Clear')
              }} data-target="#ListModel" className='new-link'>
                UCR Clear
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 ">
              <Select
                name="UCRClearID"
                value={UCRClearDrpData?.filter((obj) => obj.value === value?.UCRClearID)}
                isClearable
                options={UCRClearDrpData}
                onChange={(e) => { ChangeDropDown(e, 'UCRClearID') }}
                placeholder="Select..."
                styles={isLockOrRestrictModule("Lock", Editval[0]?.UCRClearID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.UCRClearID, isLocked)}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 text-right">
              <label htmlFor="" className='new-label mb-0'>Count</label>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-0 text-field">
              <input type="text" name='Count' id='Count' maxLength={5} onChange={handlcount} value={value?.Count} className={isLockOrRestrictModule("Lock", Editval[0]?.Count, isLocked) ? 'LockFildsColor' : ''} disabled={isLockOrRestrictModule("Lock", Editval[0]?.Count, isLocked)}
              />
            </div>
            <div className="col-3 col-md-3 col-lg-2 ">
              <label htmlFor="" className="new-label px-0 mb-0">
                Charge  Date/Time
                {errors.ChargeDateTimeError !== 'true' ? (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block", }}>{errors.ChargeDateTimeError}</span>
                ) : null}
              </label>
            </div>

            <div className="col-3 col-md-4 col-lg-2 ">
              <DatePicker
                id='OffenseDateTime'
                name='OffenseDateTime'
                ref={startRef}
                onKeyDown={(e) => {
                  if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                    e.preventDefault();
                  } else {
                    onKeyDown(e);
                  }
                }}
                dateFormat="MM/dd/yyyy HH:mm"
                timeFormat="HH:mm "
                is24Hour
                isClearable={false}
                selected={getValidDate(value?.OffenseDateTime)}
                autoComplete="Off"
                onChange={(date) => {
                  if (!date) return;
                  const oldDate = getValidDate(value?.OffenseDateTime);
                  const isSameDay =
                    oldDate &&
                    date.getFullYear() === oldDate.getFullYear() &&
                    date.getMonth() === oldDate.getMonth() &&
                    date.getDate() === oldDate.getDate();
                  let finalDate = date;
                  if (!isSameDay) {
                    const inc = new Date(incReportedDate);
                    finalDate = new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      inc.getHours(),
                      inc.getMinutes(),
                      0
                    );
                  }
                  if (finalDate > new Date(datezone)) {
                    finalDate = new Date(datezone);
                  }
                  if (finalDate < new Date(incReportedDate)) {
                    finalDate = new Date(incReportedDate);
                  }
                  setValue({
                    ...value,
                    OffenseDateTime: getShowingDateText(finalDate)
                  });
                  !addUpdatePermission && setChangesStatus(true);
                  !addUpdatePermission && setStatesChangeStatus(true);
                }}
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
                filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                className={isLockOrRestrictModule("Lock", Editval[0]?.OffenseDateTime, isLocked) ? 'LockFildsColor' : 'requiredColor'}
                disabled={isLockOrRestrictModule("Lock", Editval[0]?.OffenseDateTime, isLocked)}
              />
            </div>
          </div>
        </fieldset>

      </div>

      <div className="col-12 text-right mt-0 p-0">
        <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { setStatusFalse(); }}>New</button>
        {
          // (ChargeSta === true || ChargeSta === 'true') && ChargeID ?
          (ChargeSta === true || ChargeSta === 'true') && ChargeID ?
            effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
              <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update Charge</button>
              : <></> :
              <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update Charge</button>
            :
            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Add Charge</button>
              : <></> :
              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Add Charge</button>
        }
      </div>

      <div className="col-12 mt-2">
        <DataTable
          dense
          data={
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? (DecArrestId) && arrestChargeData.length > 0
              ? arrestChargeData : ChargeLocalArr : []
              : (DecArrestId) && arrestChargeData.length > 0
                ? arrestChargeData
                : ChargeLocalArr
          }
          columns={columns}
          selectableRowsHighlight
          highlightOnHover
          pagination
          onRowClicked={(row) => { set_Edit_Value(row); }}
          fixedHeaderScrollHeight='250px'
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          persistTableHead={true}
          customStyles={tableCustomStyles}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      {/* <div className="col-12 text-right mt-0 p-0 mt-2">
        <button type="button" onClick={insert_Arrest_Data} disabled={DecArrestId ? true : false} className="btn btn-sm btn-success  mr-1">Save</button>
      </div> */}
      {!DecArrestId && (
        <div className="col-12 text-right mt-0 p-0 mt-2">
          <button
            type="button"
            onClick={insert_Arrest_Data}
            className="btn btn-sm btn-success mr-1"
          >
            Save
          </button>
        </div>
      )}

      <DeletePopUpModal func={DeleteArrestCharge} />
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={check_Validation_Error} />
    </>
  )
}
export default Charges





