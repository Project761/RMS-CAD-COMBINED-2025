import React, { useState, useEffect, useContext } from 'react'
import DataTable from 'react-data-table-component'
import Select from "react-select";
import { Decrypt_Id_Name, base64ToString, stringToBase64, tableCustomStyles } from '../../../../../Common/Utility';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData } from '../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../../Utility/Personnel/Validation';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../redux/actions/Agency';
import { get_NIBRS_Drp_Data, get_UcrClear_Drp_Data } from '../../../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../../../redux/actions/IncidentAction';
const Home = () => {

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  let DecArrestId = 0, DecChargeId = 0, DecIncID = 0
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
  else DecIncID = parseInt(base64ToString(IncID));
  if (!ChargeId) ChargeId = 0;
  else DecChargeId = parseInt(base64ToString(ChargeId));
  if (!ArrestId) ArrestId = 0;
  else DecArrestId = parseInt(base64ToString(ArrestId));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);
  const UCRClearDrpData = useSelector((state) => state.DropDown.UCRClearDrpData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const { get_Arrest_Count, get_Incident_Count, arrestChargeData, ArresteName, setArrestName, get_Data_Arrest_Charge, get_ArrestCharge_Count, setChangesStatus, incidentNumber, updateCount, setUpdateCount } = useContext(AgencyContext);

  const [clickedRow, setClickedRow] = useState(null);
  const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
  const [Editval, setEditval] = useState();
  const [ArrestNumber, setArrestNumber] = useState('')
  const [ArrestID, setArrestID] = useState('')
  const [ChargeID, setChargeID] = useState();
  const [MainIncidentID, setMainIncidentID] = useState('');
  const [LoginAgencyID, setLoginAgencyID] = useState('');
  const [LoginPinID, setLoginPinID,] = useState('');
  const [openPage, setOpenPage] = useState('');
  const [status, setStatus] = useState('');

  const [value, setValue] = useState({
    'NameID': '', 'ArrestID': '', 'ArrestNumber': '', 'IncidentID': '', 'CreatedByUserFK': '',
    'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'ModifiedByUserFK': '', 'Name': ArresteName,
  });

  const [errors, setErrors] = useState({
    'NIBRSIDError': '', 'ChargeCodeIDError': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (DecArrestId || DecIncID) {
      setMainIncidentID(DecIncID); get_Data_Arrest_Charge(DecArrestId); get_Incident_Count(DecIncID);
    }
  }, [DecIncID, DecArrestId]);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("C073", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (LoginAgencyID) {
      if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(LoginAgencyID)); }
      if (UCRClearDrpData?.length === 0) { dispatch(get_UcrClear_Drp_Data(LoginAgencyID)); }
    }
  }, [LoginAgencyID])

  useEffect(() => {
    if (LoginAgencyID) {
      setValue({
        ...value,
        'IncidentID': DecIncID, 'ArrestID': DecArrestId, 'ChargeID': DecChargeId, 'CreatedByUserFK': LoginPinID, 'AgencyID': LoginAgencyID, 'Name': ArresteName, 'ArrestNumber': ArrestNumber,
      })
    }
  }, [LoginAgencyID]);

  useEffect(() => {
    if (DecChargeId) {
      setChargeID(DecChargeId); GetSingleData(DecChargeId); setArrestID(DecArrestId); get_ArrestCharge_Count(DecChargeId);
    }
  }, [DecChargeId]);

  const check_Validation_Error = (e) => {
    const NIBRSIDError = RequiredFieldIncident(value.NIBRSID); const ChargeCodeIDError = RequiredFieldIncident(value.ChargeCodeID);
    setErrors(pre => {
      return {
        ...pre,
        ['NIBRSIDError']: NIBRSIDError || pre['NIBRSIDError'], ['ChargeCodeIDError']: ChargeCodeIDError || pre['ChargeCodeIDError'],
      }
    });
  }
  const { ChargeCodeIDError, NIBRSIDError } = errors

  useEffect(() => {
    if (ChargeCodeIDError === 'true' && NIBRSIDError === 'true') {
      if ((ChargeSta === true || ChargeSta === 'true') && ChargeID) { update_Arrest_Charge() }
      else { Add_Charge_Data() }
    }
  }, [ChargeCodeIDError, NIBRSIDError])

  useEffect(() => {
    if (ChargeID) {
      GetSingleData(ChargeID)
    }
  }, [ChargeID])

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
      });
      get_ChargeCode_Drp_Data(Editval[0]?.NIBRSID); setArrestName(Editval[0]?.Arrestee_Name ? Editval[0]?.Arrestee_Name : '');
    } else {
      setValue({ ...value, 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'Name': Name, 'ArrestNumber': ArrNo, })
    }
  }, [Editval])

  const Reset = () => {
    setValue({ ...value, 'CreatedByUserFK': '', 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'WarrantID': '', })
    setErrors({ ...errors, ['NIBRSIDError']: '', });
  }

  const get_ChargeCode_Drp_Data = (FBIID) => {
    const val = { FBIID: FBIID }
    fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
      if (data) {
        setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
      } else { setChargeCodeDrp([]); }
    })
  };


  const ChangeDropDown = (e, name) => {
    if (e) {
      if (name === 'NIBRSID') {
        get_ChargeCode_Drp_Data(e.value);
        setValue({ ...value, [name]: e.value, ['ChargeCodeID']: '', });
        setChangesStatus(true);
      } else {
        setValue({ ...value, [name]: e.value, });
        setChangesStatus(true);
      }
    } else if (e === null) {
      if (name === 'NIBRSID') {
        get_ChargeCode_Drp_Data([]);
        setValue({ ...value, ['NIBRSID']: "", ['ChargeCodeID']: "", });
        setChangesStatus(true);
      } else {
        setValue({ ...value, [name]: null });
        setChangesStatus(true);
      }
    } else {
      setValue({ ...value, [name]: null })
      setChangesStatus(true);
    }
  }

  const HandleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value, });
    setChangesStatus(true);
  };

  const Add_Charge_Data = () => {
    AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', value).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Arrest_Count(ArrestID); get_Data_Arrest_Charge(DecArrestId)
        setStatus(false); Reset(); setChangesStatus(false);
        if (res.ChargeID) {
          get_ArrestCharge_Count(res.ChargeID); setChargeID(res.ChargeID);
          navigate(`/Arr-Charge-Home?IncId=${IncID}&ArrestId=${ArrestId}&IncNo=${IncNo}&Name=${Name}&ArrestSta=${true}&ArrNo=${ArrNo}&ChargeId=${stringToBase64(res.ChargeID)}&ChargeSta=${true}`)
        }
        setUpdateCount(updateCount + 1); setErrors({ ...errors, ['ChargeCodeIDError']: '' })
      }
    })
  }

  const update_Arrest_Charge = () => {
    AddDeleteUpadate('ArrestCharge/Update_ArrestCharge', value).then((res) => {
      const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
      toastifySuccess(message); get_Data_Arrest_Charge(DecArrestId); setErrors({ ...errors, ['ChargeCodeIDError']: '' }); setChangesStatus(false);
    })
  }

  const DeleteArrestCharge = () => {
    const val = { 'ChargeID': ChargeID, 'DeletedByUserFK': LoginPinID }
    AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Data_Arrest_Charge(DecArrestId); get_Arrest_Count(ArrestID); Reset(''); setStatusFalse()
        get_ArrestCharge_Count(ChargeID); setStatus(false)
      } else console.log("Somthing Wrong");
    })
  }

  const columns = [
    {
      name: 'Arrest Number', selector: (row) => row.ArrestNumber, sortable: true
    },
    {
      name: 'TIBRS Description', selector: (row) => row.NIBRS_Description, sortable: true
    },
    {
      name: 'UCRClear Description', selector: (row) => row.UCRClear_Description, sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => <>
        <div style={{ position: 'absolute', top: 4, right: 5 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <span to={`#`} onClick={(e) => setChargeID(row.ChargeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
              : <></>
              : <span to={`#`} onClick={(e) => setChargeID(row.ChargeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>
      </>
    }
  ]

  const conditionalRowStyles = [
    {
      when: row => row.ChargeID === ChargeID,
      style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
    },
  ];

  const set_Edit_Value = (row) => {
    if (MstPage === "MST-Arrest-Dash") {
      navigate(`/Arr-Charge-Home?page=MST-Arrest-Dash&ArrestId=${stringToBase64(row.ArrestID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeId=${stringToBase64(row.ChargeID)}&ChargeSta=${true}`);
      get_ArrestCharge_Count(row.ChargeID); setErrors(''); setStatus(true); setChargeID(row.ChargeID);
    } else {
      navigate(`/Arr-Charge-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ChargeId=${stringToBase64(row.ChargeID)}&ArrestId=${stringToBase64(row.ArrestID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${true}&ChargeSta=${true}`);
      get_ArrestCharge_Count(row.ChargeID); setErrors(''); setStatus(true); setChargeID(row.ChargeID);
    }
  }

  const setStatusFalse = () => {
    if (MstPage === "MST-Arrest-Dash") {
      // navigate(`/Arr-Charge-Home?page=MST-Arrest-Dash&ArrestId=${ArrestId}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${false}&ChargeSta=${false}`)
      setChargeID(''); setClickedRow(null); Reset(); setErrors(''); get_ArrestCharge_Count('');
    } else {
      // navigate(`/Arr-Charge-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(ArrestID)}&Name=${Name}&ArrNo=${ArrNo}&ArrestSta=${false}&ChargeSta=${false}`)
      setChargeID(''); setClickedRow(null); Reset(); setErrors(''); get_ArrestCharge_Count('');
    }
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf", height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
    }),
  };

  const customStylesWithOutColor = {
    control: base => ({
      ...base, height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="col-12">
        <div className="row">
          {/* <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Name</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
            <input type="text" className='readonlyColor' name='Name' value={Name ? Name : ''} required readOnly />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Incident Number</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 text-field">
            <input type="text" className='readonlyColor' name='IncidentID' value={(IncNo, MstPage === "MST-Arrest-Dash" ? '' : IncNo)} required readOnly />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Arrest Number</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 text-field">
            <input type="text" className='readonlyColor' name='ArrestNumber' value={ArrNo ? ArrNo : ''} required readOnly />
          </div> */}
          <div className="col-3 col-md-3 col-lg-2 mt-2 pt-2">
            <span data-toggle="modal" data-target="#ListModel" className='new-link'>
              Category
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-3 mt-2 ">
            <Select
              styles={customStylesWithOutColor}
              name="Category"
              // value={UCRClearDrpData?.filter((obj) => obj.value === value?.UCRClearID)}
              isClearable
              // options={UCRClearDrpData}
              onChange={(e) => { ChangeDropDown(e, 'Category') }}
              placeholder="Select..."
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-2 pt-2">
            <span data-toggle="modal" data-target="#ListModel" className='new-link'>
              Degree
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-5 mt-2 ">
            <Select
              styles={customStylesWithOutColor}
              name="Degree"
              // value={UCRClearDrpData?.filter((obj) => obj.value === value?.UCRClearID)}
              isClearable
              // options={UCRClearDrpData}
              onChange={(e) => { ChangeDropDown(e, 'Degree') }}
              placeholder="Select..."
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-2 pt-2">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('FBI Code')
            }} data-target="#ListModel" className='new-link'>
              TIBRS Code {errors.NIBRSIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NIBRSIDError}</span>
              ) : null}
            </span>
          </div>
          <div className="col-9 col-md-9 col-lg-3 mt-2 ">
            <Select
              styles={colourStyles}
              name="NIBRSID"
              value={NIBRSDrpData?.filter((obj) => obj.value === value?.NIBRSID)}
              isClearable
              options={NIBRSDrpData}
              onChange={(e) => { ChangeDropDown(e, 'NIBRSID') }}
              placeholder="Select..."
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-2 pt-2">
            <Link to={'/ListManagement?page=Charge%20Code&call=/Arr-Charge-Home'} className='new-link '>
              Charge Code/Description  {errors.ChargeCodeIDError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ChargeCodeIDError}</span>
              ) : null}
            </Link>
          </div>
          <div className="col-9 col-md-9 col-lg-5 mt-2 ">
            <Select
              name="ChargeCodeID"
              value={chargeCodeDrp?.filter((obj) => obj.value === value?.ChargeCodeID)}
              styles={colourStyles}
              isClearable
              options={chargeCodeDrp}
              onChange={(e) => { ChangeDropDown(e, 'ChargeCodeID') }}
              placeholder="Select..."
            />
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-2 pt-2">

            <span data-toggle="modal" onClick={() => {
              setOpenPage('UCR Clear')
            }} data-target="#ListModel" className='new-link'>
              UCR Clear
            </span>
          </div>
          <div className="col-4 col-md-3 col-lg-3 mt-2 ">
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

          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Count</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 text-field">
            <input type="text" name='Count' id='Count' onChange={HandleChange} value={value?.Count} className='' />
          </div>
        </div>
      </div>
      <div className="col-12 text-right mt-2 p-0">
        <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" >New</button>
        {
          (ChargeSta === true || ChargeSta === 'true') && ChargeID ?
            effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
              <button type="button" className="btn btn-sm btn-success  mr-1">Update</button>
              : <></> :
              <button type="button" className="btn btn-sm btn-success  mr-1">Update</button>
            :
            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
              <button type="button" className="btn btn-sm btn-success  mr-1">Save</button>
              : <></> :
              <button type="button" className="btn btn-sm btn-success  mr-1">Save</button>
        }
      </div>
      <div className="col-12 mt-2">
        <DataTable
          dense
          // data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? arrestChargeData : '' : arrestChargeData}
          // columns={columns}
          selectableRowsHighlight
          highlightOnHover
          pagination
          // onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); }}
          fixedHeaderScrollHeight='250px'
          // conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          persistTableHead={true}
          customStyles={tableCustomStyles}
        // noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}

        />
      </div>
    </>
  )
}

export default Home