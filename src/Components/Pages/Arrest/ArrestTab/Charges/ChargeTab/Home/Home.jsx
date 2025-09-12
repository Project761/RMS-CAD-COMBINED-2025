
import React, { useState, useEffect, useContext } from 'react'
import Select from "react-select";
import { Decrypt_Id_Name, Requiredcolour, base64ToString, nibrscolourStyles, stringToBase64, tableCustomStyles } from '../../../../../../Common/Utility';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/actions/Agency';
import ListModal from '../../../../../Utility/ListManagementModel/ListModal';
import { get_UcrClear_Drp_Data } from '../../../../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../../../Common/ChangesModal';

const StatusOption = [
  { value: "A", label: "Attempted" },
  { value: "C", label: "Completed" },
];


const Home = (props) => {

  const { setStatus, DecArrestId, DecChargeId } = props

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  let DecIncID = 0, DecEIncID = 0;
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


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const UCRClearDrpData = useSelector((state) => state.DropDown.UCRClearDrpData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const { get_Arrest_Count, arrestChargeData, setArrestName, changesStatusCount, changesStatus, get_Data_Arrest_Charge, get_ArrestCharge_Count, setChangesStatus, updateCount, setUpdateCount } = useContext(AgencyContext);

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


  const [value, setValue] = useState({
    AttemptComplete: 'N', // Default value for AttemptComplete

    'NameID': '', 'ArrestID': '', 'ArrestNumber': '', 'IncidentID': '', 'CreatedByUserFK': '', 'IncidentNumber': '',
    'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'ModifiedByUserFK': '', 'Name': '',
    'LawTitleId': '', 'AttemptComplete': '',
  });

  const [errors, setErrors] = useState({
    'NIBRSIDError': '', 'ChargeCodeIDError': '', 'AttemptRequiredError': '',
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
      setValue({
        ...value,
        'IncidentID': DecEIncID, 'ArrestID': DecArrestId, 'ChargeID': DecChargeId, 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID,
        'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', 'AttemptComplete': '',
      });
      get_Arrest_Count(DecArrestId);
      get_Data_Arrest_Charge(DecArrestId); setArrestID(DecArrestId)
      if (UCRClearDrpData?.length === 0) { dispatch(get_UcrClear_Drp_Data(LoginAgencyID)); }
      // lawTitle
      LawTitleIdDrpDwnVal(LoginAgencyID, null);
      // nibrs code
      get_NIBRS_Drp_Data(LoginAgencyID, null);
      // charge code
      get_ChargeCode_Drp_Data(LoginAgencyID, null, null);
    }
  }, [LoginAgencyID]);

  useEffect(() => {
    if (DecChargeId) {
      setArrestID(DecArrestId); setChargeID(DecChargeId); get_ArrestCharge_Count(DecChargeId)
    }
  }, [DecChargeId])

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
      else { Add_Charge_Data() }
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
        'LawTitleId': Editval[0]?.LawTitleId, 'AttemptComplete': Editval[0]?.AttemptComplete,
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
        ...value, 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', 'AttemptComplete': '',
      });
    }
  }, [Editval, changesStatusCount])

  const Reset = () => {
    setValue({ ...value, 'CreatedByUserFK': '', 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'WarrantID': '', 'LawTitleId': '', 'AttemptComplete': '', });
    setStatesChangeStatus(false); setChangesStatus(false); setErrors({});

    // lawTitle
    LawTitleIdDrpDwnVal(LoginAgencyID, null);
    // nibrs code
    get_NIBRS_Drp_Data(LoginAgencyID, null);
    // charge code
    get_ChargeCode_Drp_Data(LoginAgencyID, null, null);

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

  const Add_Charge_Data = () => {
    const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId } = value;
    const val = {
      'IncidentID': DecEIncID, 'ArrestID': DecArrestId, 'ChargeID': DecChargeId, 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID, 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
      'LawTitleId': LawTitleId,
    }
    AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Arrest_Count(DecArrestId); get_Data_Arrest_Charge(DecArrestId)
        Reset();
        setChangesStatus(false); get_ArrestCharge_Count(DecChargeId); setStatesChangeStatus(false);
        if (res.ChargeID || res.ArrestID) {
          setChargeID(res.ChargeID);
          setArrestID(res.ArrestID);
        }
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

  const onChangeAttComplete = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  }

  const update_Arrest_Charge = () => {
    const { Count, ChargeCodeID, NIBRSID, UCRClearID, Name, LawTitleId, AttemptComplete } = value;
    const val = {
      'IncidentID': DecEIncID, 'ArrestID': DecArrestId, 'ChargeID': DecChargeId, 'ModifiedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID, 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'UCRClearID': UCRClearID, 'ChargeCodeID': ChargeCodeID, 'NIBRSID': NIBRSID, 'Count': Count,
      'LawTitleId': LawTitleId, 'AttemptComplete': AttemptComplete,
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
        Reset(); get_ArrestCharge_Count(DecChargeId); setErrors(''); setStatusFalse()
      } else { console.log("Somthing Wrong"); }
    })
  }

  const columns = [
    {
      name: 'Arrest Number', selector: (row) => row.ArrestNumber, sortable: true
    },
    {
      name: 'TIBRS Code', selector: (row) => row.NIBRS_Description, sortable: true
    },
    {
      name: ' Offense Code/Name', selector: (row) => row.ChargeCode_Description, sortable: true
    },
    {
      name: 'UCR Clear', selector: (row) => row.UCRClear_Description, sortable: true
    },
  ]

  const conditionalRowStyles = [
    {
      when: row => row.ChargeID === DecChargeId,
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
        get_ArrestCharge_Count(row?.ChargeID); setErrors(''); setStatus(true); setChargeID(row.ChargeID);
        GetSingleData(row.ChargeID);
      } else {

        navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ChargeId=${stringToBase64(row.ChargeID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeSta=${true}&SideBarStatus=${false}`)

        get_ArrestCharge_Count(row.ChargeID); setErrors(''); setStatesChangeStatus(false); setStatus(true); setChargeID(row.ChargeID); setChangesStatus(false); GetSingleData(row.ChargeID); get_Arrest_Count(ArrestID);
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

  const customStylesWithOutColor = {
    control: base => ({
      ...base, height: 20, minHeight: 30, fontSize: 14, margintop: 2, boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="col-12">
        <div className="row align-items-center mt-2" style={{ rowGap: "8px" }}>
          <div className="col-2 col-md-2 col-lg-1">
            <label htmlFor="" className='new-label mb-0'>Name</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3  text-field mt-0">
            <input type="text" className='readonlyColor' name='Name' value={Name?.replace(/\s+/g, ' ').trim() ? Name?.replace(/\s+/g, ' ').trim() : ''} required readOnly />
          </div>
          <div className="col-2 col-md-2 col-lg-2 ">
            <label htmlFor="" className='new-label mb-0'>Incident Number</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2  text-field mt-0">
            <input type="text" className='readonlyColor' name='IncidentNumber' value={IncNo ? IncNo : ''}
              required readOnly />
          </div>
          <div className="col-2 col-md-2 col-lg-2 ">
            <label htmlFor="" className='new-label mb-0'>Arrest Number</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2  text-field mt-0">
            <input type="text" className='readonlyColor' name='ArrestNumber' value={ArrNo ? ArrNo : ''} required readOnly />
          </div>
          <div className="col-2 col-md-2 col-lg-1 ">
            <label htmlFor="" className='new-label mb-0'>
              Law Title
            </label>
          </div>
          <div className="col-4 col-md-4 col-lg-3 ">
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
          <div className="col-4 col-md-4 col-lg-2  ">

          </div>

          <div className="col-2 col-md-2 col-lg-1  text-right">
            <Link to={'/ListManagement?page=Charge%20Code&call=/Arr-Charge-Home'} className='new-link '>
              Offense Code/Name
              {errors.ChargeCodeIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block", }}>{errors.ChargeCodeIDError}</span>
              ) : null}
            </Link>
          </div>
          <div className="col-4 col-md-4 col-lg-5 mt-0 ">
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



          <div className="col-2 col-md-2 col-lg-2  text-right" >
            <label className="new-label mb-0"  >
              Attempted/Completed
              {errors.AttemptRequiredError !== 'true' && (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', display: "block", }}>
                  {errors.AttemptRequiredError}
                </span>
              )}
            </label>
          </div>
          <div className="col-10 col-md-4 col-lg-4 ">
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
          <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
            <input type="text" name='Count' id='Count' maxLength={5} onChange={handlcount}
              value={value?.Count}
              className='' />
          </div>

        </div>
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
export default Home


