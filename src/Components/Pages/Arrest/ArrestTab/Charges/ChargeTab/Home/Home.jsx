
import React, { useState, useEffect, useContext, useRef } from 'react'
import Select from "react-select";
import { Decrypt_Id_Name, MultiSelectRequredColor, Requiredcolour, base64ToString, customStylesWithOutColor, filterPassedTimeZonesProperty, getShowingDateText, nibrscolourStyles, stringToBase64, tableCustomStyles } from '../../../../../../Common/Utility';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray, threeColArrayWithCode } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
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
import SelectBox from '../../../../../../Common/SelectBox';
import { components } from "react-select";
import DatePicker from "react-datepicker";
import NameListing from '../../../../../ShowAllList/NameListing';
import ArresList from '../../../../../ShowAllList/ArrestList';

const StatusOption = [
  { value: "A", label: "Attempted" },
  { value: "C", label: "Completed" },
];


const Charges = (props) => {

  const { setStatus, DecChargeId, ListData, setListData, get_List } = props

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

  const { get_Arrest_Count, arrestChargeData, datezone, NameId, setArrestName, changesStatusCount, changesStatus, get_Data_Arrest_Charge, get_ArrestCharge_Count, setChangesStatus, updateCount, setUpdateCount, ArresteName } = useContext(AgencyContext);
  const SelectedValue = useRef();

  const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
  const [Editval, setEditval] = useState();
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
    'NIBRSIDError': '', 'ChargeCodeIDError': '', 'AttemptRequiredError': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);


  console.log(DecArrestId)
  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("C073", localStoreData?.AgencyID, localStoreData?.PINID)); get_Arrest_Count(DecArrestId);
    }
  }, [localStoreData]);

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
      setValue({
        ...value,
        'ChargeDateTime': defaultDate
      });
      // dispatch(get_PropertyTypeData(loginAgencyID));
    }
  }, [LoginAgencyID, incReportedDate]);


  useEffect(() => {
    if (LoginAgencyID) {
      setValue({
        ...value,
        'IncidentID': DecEIncID, 'ArrestID': ArrestID, 'ChargeID': DecChargeId, 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID,
        'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', 'AttemptComplete': '',
      });
      if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)); }
      // get_Property_Data(ArrestID);
      get_Security_DropDown(DecChargeId); get_Security_Data(ChargeID); get_Data_Arrest_Charge(DecArrestId);
      // setArrestID(ArrestID);
      get_Property_DropDown(DecEIncID);
      if (UCRClearDrpData?.length === 0) { dispatch(get_UcrClear_Drp_Data(LoginAgencyID)); }
      // lawTitle
      LawTitleIdDrpDwnVal(LoginAgencyID, null); get_CategoryId_Drp(LoginAgencyID)
      // nibrs code
      get_NIBRS_Drp_Data(LoginAgencyID, null);
      // charge code
      get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
    }
  }, [LoginAgencyID]);

  useEffect(() => {
    if (ChargeID) {
      // setArrestID(ArrestID);
      get_ArrestCharge_Count(ChargeID); get_Security_Data(ChargeID);
      get_Security_Data(ChargeID); get_Security_DropDown(ChargeID); get_Property_Data(ChargeID);
    }
  }, [ChargeID])

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
    console.log('hello')
    if (DecArrestId) {
      get_Data_Arrest_Charge(DecArrestId); get_Arrest_Count(DecArrestId);
    }
  }, [DecArrestId])

  const check_Validation_Error = (e) => {
    const NIBRSIDError = RequiredFieldIncident(value.NIBRSID); const ChargeCodeIDError = RequiredFieldIncident(value.ChargeCodeID); const AttemptRequiredError = RequiredFieldIncident(value.AttemptComplete);
    setErrors(pre => {
      return {
        ...pre,
        ['NIBRSIDError']: NIBRSIDError || pre['NIBRSIDError'], ['ChargeCodeIDError']: ChargeCodeIDError || pre['ChargeCodeIDError'], ['AttemptRequiredError']: AttemptRequiredError || pre['AttemptRequiredError'],
      }
    });
  }

  const { ChargeCodeIDError, NIBRSIDError, AttemptRequiredError } = errors

  useEffect(() => {
    if (ChargeCodeIDError === 'true' && NIBRSIDError === 'true' && AttemptRequiredError === 'true') {
      if ((ChargeSta === true || ChargeSta === 'true') && ChargeID) { update_Arrest_Charge() }
      else {
        if (DecArrestId) { Add_Charge_Data(); }
        else {
          insert_Arrest_Data()
        }
      }
    }
  }, [ChargeCodeIDError, NIBRSIDError, AttemptRequiredError])

  useEffect(() => {
    if (DecChargeId) {
      GetSingleData(DecChargeId);
    } else {
      Reset()
    }
  }, [DecChargeId]);

  const GetSingleData = (ChargeID) => {
    const val = { 'ChargeID': ChargeID }
    fetchPostData('ArrestCharge/GetSingleData_ArrestCharge', val).then((res) => {
      if (res) {
        setEditval(res);
      } else { setEditval([]) }
    })
  }

  useEffect(() => {
    if (ChargeID) {
      setValue({
        ...value, 'Count': Editval[0]?.Count ? Editval[0]?.Count : '', 'Name': Editval[0]?.Name, 'ChargeCodeID': Editval[0]?.ChargeCodeID,
        'NIBRSID': Editval[0]?.NIBRSID, 'UCRClearID': Editval[0]?.UCRClearID, 'ChargeID': Editval[0]?.ChargeID, 'ModifiedByUserFK': LoginPinID,
        'LawTitleId': Editval[0]?.LawTitleId, 'AttemptComplete': Editval[0]?.AttemptComplete, ChargeDateTime: Editval[0]?.ChargeDateTime,
        'CategoryId': Editval[0]?.CategoryId, 'OffenseDateTime': Editval[0]?.OffenseDateTime,

      });
      setArrestName(Editval[0]?.Name ? Editval[0]?.Name : '');

      // lawTitle
      LawTitleIdDrpDwnVal(LoginAgencyID, null);

      // nibrs code
      get_NIBRS_Drp_Data(LoginAgencyID, null);
      // charge code
      get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
    } else {
      setValue({
        ...value, 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', 'AttemptComplete': '', 'CategoryId': '', 'OffenseDateTime': '',
      });
    }
  }, [Editval, changesStatusCount])

  const Reset = () => {
    setValue({ ...value, 'CreatedByUserFK': '', 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'WarrantID': '', 'LawTitleId': '', 'AttemptComplete': '', 'CategoryId': '', 'OffenseDateTime': '', });
    setStatesChangeStatus(false); setChangesStatus(false); setErrors({}); setMultiSelected([]); setMultiSelected(prevValues => { return { ...prevValues, ['PropertyID']: '' } })

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
      console.log(data)
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
        setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'));
      } else {
        setChargeCodeDrp([]);
      }
    })
  };

  const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, chargeCodeId) => {
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
        const res = await getLawTitleNibrsByCharge(LoginAgencyID, value?.LawTitleId, e.value);

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
        setValue({ ...value, ['ChargeCodeID']: null });

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




  const insert_Arrest_Data = async () => {
    const storedVal = JSON.parse(localStorage.getItem('insertedArrestVal'));
    AddDeleteUpadate('Arrest/Insert_Arrest', storedVal).then(async (res) => {
      if (res.success) {
        setArrestID(res.ArrestID)
        toastifySuccess(res.Message);
        navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrNo=${res?.ArrestNumber}&Name=${ArresteName}&ArrestSta=${true}&ChargeSta=${false}`)
        Add_Charge_Data(res.ArrestID);
      }
    });
  }

  const Add_Charge_Data = (MainArrestID) => {
    const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime } = value;
    const val = {
      'IncidentID': DecEIncID, 'ArrestID': MainArrestID || DecArrestId, 'ChargeID': DecChargeId, 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID, 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
      'LawTitleId': LawTitleId, AttemptComplete: AttemptComplete, 'CategoryId': CategoryId, 'OffenseDateTime': OffenseDateTime,
    }
    AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Arrest_Count(MainArrestID || DecArrestId);
        Reset(); get_Data_Arrest_Charge(MainArrestID || DecArrestId);
        setChargeID(res.ChargeID);
        setChangesStatus(false); get_ArrestCharge_Count(ChargeID); setStatesChangeStatus(false);
        // if (res.ChargeID || res.ArrestID) {
        //   setChargeID(res.ChargeID);
        // }
        setUpdateCount(updateCount + 1);
        setErrors({ ...errors, ['ChargeCodeIDError']: '' });

        // lawTitle
        LawTitleIdDrpDwnVal(LoginAgencyID, null);
        // nibrs code
        get_NIBRS_Drp_Data(LoginAgencyID, null);
        // charge code
        get_ChargeCode_Drp_Data(LoginAgencyID, null, null);

      }
    })
  }

  console.log(ArrestID)
  const onChangeAttComplete = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  }

  const update_Arrest_Charge = () => {
    const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete, CategoryId, OffenseDateTime } = value;
    const val = {
      'IncidentID': DecEIncID, 'ArrestID': DecArrestId, 'ChargeID': DecChargeId, 'ModifiedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID, 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
      'LawTitleId': LawTitleId, 'AttemptComplete': AttemptComplete, 'CategoryId': CategoryId, 'OffenseDateTime': OffenseDateTime
    }
    AddDeleteUpadate('ArrestCharge/Update_ArrestCharge', val).then((res) => {
      const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
      toastifySuccess(message); setStatesChangeStatus(false);
      get_Data_Arrest_Charge(DecArrestId); setErrors({ ...errors, ['ChargeCodeIDError']: '' }); setChangesStatus(false);
      // lawTitle
      LawTitleIdDrpDwnVal(LoginAgencyID, null);
      // nibrs code
      get_NIBRS_Drp_Data(LoginAgencyID, null);
      // charge code
      get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
    })
  }

  const DeleteArrestCharge = (delChargeID) => {
    const val = { 'ChargeID': delChargeID, 'DeletedByUserFK': LoginPinID }
    AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Data_Arrest_Charge(DecArrestId); get_Arrest_Count(ArrestID);
        Reset(); get_ArrestCharge_Count(ChargeID); setErrors(''); setStatusFalse()
      } else { console.log("Somthing Wrong"); }
    })
  }

  const columns = [
    {
      name: 'TIBRS Code', selector: (row) => row.NIBRS_Description, sortable: true
    },
    {
      name: ' Offense Code/Name', selector: (row) => row.ChargeCode_Description, sortable: true
    },
    {
      name: 'Law Title', selector: (row) => row.LawTitle, sortable: true
    },
  ]

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
        navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ChargeId=${stringToBase64(row.ChargeID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeSta=${true}&SideBarStatus=${false}`)
        get_ArrestCharge_Count(row?.ChargeID); setErrors('');
        // setStatus(true); 
        setChargeID(row.ChargeID);
        GetSingleData(row.ChargeID);
      } else {
        navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ChargeId=${stringToBase64(row.ChargeID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeSta=${true}&SideBarStatus=${false}`)
        get_ArrestCharge_Count(row.ChargeID); setErrors(''); setStatesChangeStatus(false);
        //  setStatus(true); 
        setChargeID(row.ChargeID); setChangesStatus(false); GetSingleData(row.ChargeID); get_Arrest_Count(row?.ArrestID); get_Property_Data(row?.ChargeID);
      }
    }
  }

  const setStatusFalse = () => {
    if (MstPage === "MST-Arrest-Dash") {
      navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${ArrestId}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeId=${('')}&ChargeSta=${false}&SideBarStatus=${false}`)
      setErrors(''); setChargeID('');
      Reset();
    } else {
      navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(ArrestID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeId=${('')}&ChargeSta=${false}&SideBarStatus=${false}`)
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

  const MultiSelectColor = {
    control: base => ({
      ...base,
      minHeight: 58,
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

  const get_Security_Data = (ChargeID) => {
    const val = { 'ChargeID': ChargeID }
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

  const get_Security_DropDown = (chargeID) => {
    const val = { 'ChargeID': chargeID }
    fetchPostData('ChargeWeaponType/GetData_InsertChargeWeaponType', val).then((data) => {
      if (data) {
        setTypeOfSecurityList(threeColArray(data, 'WeaponID', 'Description', 'WeaponCode'));
      } else {
        setTypeOfSecurityList([])
      }
    })
  }


  const InSertBasicInfo = (id, col1, url) => {
    const val = { 'ChargeID': ChargeID, [col1]: id, 'CreatedByUserFK': LoginPinID, }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        col1 === 'ChargeWeaponTypeID' && get_Security_Data(ChargeID); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(ChargeID);
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
        col1 === 'ChargeWeaponID' && get_Security_Data(ChargeID); get_ArrestCharge_Count(ChargeID); get_Security_DropDown(ChargeID);
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

  const get_Property_Data = (ChargeID) => {
    const val = {
      'ChargeID': ChargeID,
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
        col1 === 'PropertyID' && get_Property_Data(ChargeID); get_Property_DropDown(DecEIncID); get_Arrest_Count(ArrestID)
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
        col1 === 'ArrestPropertyID' && get_Property_Data(ChargeID); get_Property_DropDown(DecEIncID); get_Arrest_Count(DecArrestId)
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

  console.log(ListData)
  return (
    <>
      <ArresList {...{ ListData }} />
      {/* <div className="mt-2">
        <fieldset>
          <legend>Name Information</legend>
          <div className="col-12 bb">
            <div className="row">
              <div className="col-2 col-md-2 col-lg-1 showlist">
                <p htmlFor="" className='label-name'>Name:</p>
              </div>
              <div className="col-4 col-md-4 col-lg-2 text-show">
                <label htmlFor=""></label>
              </div>
              <div className="col-2 col-md-2 col-lg-1 showlist">
                <p htmlFor="" className='label-name'>DOB:</p>
              </div>
              <div className="col-4 col-md-4 col-lg-2 text-show">
                <label htmlFor=""></label>
              </div>
              <div className="col-2 col-md-2 col-lg-1 showlist">
                <p htmlFor="" className='label-name'>Age:</p>
              </div>
              <div className="col-4 col-md-4 col-lg-2 text-show">
                <label htmlFor=""></label>
              </div>
              <div className="col-2 col-md-2 col-lg-1 showlist">
                <p htmlFor="" className='label-name'>Gender:</p>
              </div>
              <div className="col-4 col-md-4 col-lg-2 text-show">
                <label htmlFor=""></label>
              </div>
              <div className="col-2 col-md-2 col-lg-1 showlist">
                <p htmlFor="" className='label-name'>Race:</p>
              </div>
              <div className="col-4 col-md-4 col-lg-2 text-show">
                <label htmlFor=""></label>
              </div>
            </div>

          </div>
        </fieldset>
      </div> */}
      <div className="container-fluid">
        <fieldset className="p-3 mt-2">
          <legend className="w-auto px-2">Weapon & Property</legend>
          <div className="row mt-2">
            <div className="col-2 col-md-2 col-lg-1 mt-3">
              <label htmlFor="" className='label-name '>Weapon</label>
            </div>
            <div className="col-6 col-md-6 col-lg-5 mb-3">
              {
                value?.ChargeWeaponTypeIDName ?
                  <Select
                    className="basic-multi-SelectBox"
                    isMulti
                    name='ChargeWeaponTypeID'
                    isDisabled={!value?.ChargeID}
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={true}
                    options={typeOfSecurityList ? filterUnArmed(typeOfSecurityList) : []}
                    onChange={(e) => typeofsecurity(e)}
                    value={filterArray(multiSelected.ChargeWeaponTypeID, 'label')}
                    components={{ MultiValue, }}
                    placeholder="Select Type Of Weapon From List.."
                    styles={customStylesWithOutColorMulti}
                  />
                  :
                  <Select
                    className="basic-multi-select"
                    isMulti
                    name='ChargeWeaponTypeID'
                    isDisabled={!value?.ChargeID}
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={true}
                    options={typeOfSecurityList ? filterUnArmed(typeOfSecurityList) : []}
                    onChange={(e) => typeofsecurity(e)}
                    value={filterArray(multiSelected.ChargeWeaponTypeID, 'label')}
                    placeholder="Select Type Of Weapon From List.."
                    components={{ MultiValue, }}
                    styles={customStylesWithOutColorMulti}

                  />
              }
            </div>

            {/* Property Section */}
            <div className="col-1 col-md-2 col-lg-1 mt-3">
              <label htmlFor="" className='label-name '>Property</label>
            </div>
            <div className="col-6 col-md-6 col-lg-5 mb-3">
              <Select
                options={propertyDrp}
                isClearable={false}
                closeMenuOnSelect={false}
                isDisabled={!value?.ChargeID}
                placeholder="Select.."
                ref={SelectedValue}
                className="basic-multi-select"
                isMulti
                styles={customStylesWithOutColorMulti}
                components={{ MultiValue, }}
                onChange={(e) => Property(e)}
                value={multiSelected.PropertyID}
                name='PropertyID'
                noDataComponent={'There are no data to display'}
              />
            </div>
          </div>
        </fieldset>
      </div>


      <div className="col-12">
        <fieldset className="p-2">
          <legend className="w-auto px-2">Charge information</legend>
          <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
            <div className="col-2 col-md-2 col-lg-1 ">
              <label htmlFor="" className='new-label mb-0'>
                Law Title
              </label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 ">
              <Select
                name='LawTitleId'
                styles={customStylesWithOutColor}
                value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                options={lawTitleIdDrp}
                isClearable
                onChange={(e) => onChangeDrpLawTitle(e, 'LawTitleId')}
                placeholder="Select..."
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
            <div className="col-4 col-md-4 col-lg-4  ">
              <Select
                styles={Requiredcolour}
                name="NIBRSID"
                value={NIBRSDrpData?.filter((obj) => obj.value === value?.NIBRSID)}
                isClearable
                options={NIBRSDrpData}
                onChange={(e) => { onChangeNIBRSCode(e, 'NIBRSID') }}
                placeholder="Select..."
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 ">
              <label htmlFor="" className='new-label mb-0'>
                Category
              </label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 ">
              <Select
                name='CategoryId'
                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryId)}
                styles={customStylesWithOutColor}
                options={categoryIdDrp}
                onChange={(e) => ChangeDropDown(e, 'CategoryId')}
                isClearable
                placeholder="Select..."
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
            <div className="col-4 col-md-4 col-lg-8 mt-0 ">
              <Select
                name="ChargeCodeID"
                value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
                styles={Requiredcolour}
                isClearable
                options={chargeCodeDrp}
                onChange={(e) => { onChangeDrpLawTitle(e, 'ChargeCodeID') }}
                placeholder="Select..."
              />
            </div>


            <div className="col-2 col-md-2 col-lg-1  text-right" >
              <label className="new-label mb-0"  >
                Attempt/Complete
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
                styles={!value?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles}
                placeholder="Select..."
                value={StatusOption.find((option) => option.value === value?.AttemptComplete) || null}
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
                styles={customStylesWithOutColor}
                name="UCRClearID"
                value={UCRClearDrpData?.filter((obj) => obj.value === value?.UCRClearID)}
                isClearable
                options={UCRClearDrpData}
                onChange={(e) => { ChangeDropDown(e, 'UCRClearID') }}
                placeholder="Select..."
              />
            </div>
            <div className="col-2 col-md-2 col-lg-2 text-right">
              <label htmlFor="" className='new-label mb-0'>Count</label>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-0 text-field">
              <input type="text" name='Count' id='Count' maxLength={5} onChange={handlcount}
                value={value?.Count}
                className='' />
            </div>
            <div className="col-3 col-md-3 col-lg-1 ">
              <label htmlFor="" className="new-label px-0 mb-0">
                Charge  Date/Time{errors.OffenseDttmError !== 'true' ? (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OffenseDttmError}</p>
                ) : null}
              </label>
            </div>
            <div className="col-3 col-md-4 col-lg-2">
              <DatePicker
                id='OffenseDateTime'
                name='OffenseDateTime'
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
                  // setIncidentReportedDate(date ? getShowingMonthDateYear(date) : null)
                  if (date > new Date(datezone)) {
                    date = new Date(datezone);
                  }
                  if (date >= new Date()) {
                    setValue({ ...value, ['OffenseDateTime']: new Date() ? getShowingDateText(new Date(date)) : null })
                  } else if (date <= new Date(incReportedDate)) {
                    setValue({ ...value, ['OffenseDateTime']: new Date() ? getShowingDateText(new Date(date)) : null })
                  } else {
                    setValue({ ...value, ['OffenseDateTime']: date ? getShowingDateText(date) : null })
                  }
                }}
                selected={value?.OffenseDateTime && new Date(value?.OffenseDateTime)}

                // disabled={nibrsSubmittedPropertyMain === 1}
                // className={'requiredColor'}
                autoComplete="Off"
                placeholderText={'Select...'}
                timeInputLabel
                showTimeSelect
                timeIntervals={1}
                timeCaption="Time"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                minDate={new Date(incReportedDate)}
                maxDate={new Date(datezone)}
                // maxDate={new Date(datezone)}
                filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                timeFormat="HH:mm "
                is24Hour
              />
            </div>

          </div>
        </fieldset>

      </div>
      <div className="col-12 text-right mt-0 p-0">
        <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { setStatusFalse(); }}>New</button>
        {
          (ChargeSta === true || ChargeSta === 'true') && ChargeID ?
            effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
              <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update</button>
              : <></> :
              <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update</button>
            :
            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Save</button>
              : <></> :
              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success  mr-1">Save</button>
        }
      </div>
      <div className="col-12 mt-2">
        <DataTable
          dense
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? arrestChargeData : '' : arrestChargeData}
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
      <DeletePopUpModal func={DeleteArrestCharge} />
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={check_Validation_Error} />
    </>
  )
}
export default Charges


