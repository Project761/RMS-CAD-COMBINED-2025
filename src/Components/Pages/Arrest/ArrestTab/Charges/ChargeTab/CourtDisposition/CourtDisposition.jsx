import React, { useContext, useState, useEffect, useCallback } from 'react'
import DataTable from 'react-data-table-component';
import { fetchPostData, AddDeleteUpadate } from './../../../../../../hooks/Api.js'
import { Decrypt_Id_Name, formatDate, getShowingDateText, getShowingMonthDateYear, Requiredcolour, tableCustomStyles, } from './../../../../../../Common/Utility';
import { toastifySuccess } from './../../../../../../Common/AlertMsg';
import DeletePopUpModal from './../../../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../../../Context/Agency/Index.js';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation.js';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat.jsx';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/actions/Agency.js';
import ListModal from '../../../../../Utility/ListManagementModel/ListModal.jsx';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction.js';
import ChangesModal from '../../../../../../Common/ChangesModal.jsx';

const CourtDisposition = (props) => {

  const { DecChargeId } = props

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);

  const { get_ArrestCharge_Count, setChangesStatus, updateCount, setUpdateCount } = useContext(AgencyContext);

  const [courtDispoData, setCourtDispoData] = useState();
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0);
  const [chargeCourtDispositionID, setChargeCourtDispositionID] = useState();
  const [delCourtDispositionID, setDelCourtDispositionID] = useState();
  const [ChargeID, setChargeID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [courtDispositionDate, setCourtDispositionDate] = useState();
  const [editval, setEditval] = useState();
  const [clearanceID, setClearanceID] = useState([]);
  const [courtDispositionID, setCourtDispositionID] = useState([]);
  const [openPage, setOpenPage] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);

  // permissions
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({
    'DispositionDtTm': '', 'Comments': '', 'ExceptionalClearanceID': '', 'ChargeCourtDispositionID': "", 'CourtDispositionID': '',
    'ChargeID': '', 'CreatedByUserFK': ''
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("C075", localStoreData?.AgencyID, localStoreData?.PINID));
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
    if (loginPinID) {
      setValue({ ...value, 'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID })
      get_CourtDisposition_Data(DecChargeId); setChargeID(DecChargeId);
    }
  }, [loginPinID]);

  const [errors, setErrors] = useState({
    'DispositionDtTmErrors': '', 'CourtDispositionIDErrors': '', 'CommentsErrors': '',
  })

  const GetSingleData = (chargeCourtDispositionID) => {
    const val = { 'ChargeCourtDispositionID': chargeCourtDispositionID }
    fetchPostData('ChargeCourtDisposition/GetSingleData_ChargeCourtDisposition', val)
      .then((res) => {
        if (res) { setEditval(res); }
        else { setEditval() }
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value, 'ChargeCourtDispositionID': chargeCourtDispositionID, 'CourtDispositionID': editval[0]?.CourtDispositionID, 'Comments': editval[0]?.Comments,
        'ExceptionalClearanceID': editval[0]?.ExceptionalClearanceID,
        'ModifiedByUserFK': loginPinID, 'DispositionDtTm': editval[0].DispositionDtTm ? getShowingDateText(editval[0].DispositionDtTm) : '',
      });
      setCourtDispositionDate(editval[0]?.DispositionDtTm ? new Date(editval[0]?.DispositionDtTm) : '')
    }
    else { setValue({ ...value, 'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '', }) }
  }, [editval, updateCount])

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.DispositionDtTm)) {
      setErrors(prevValues => { return { ...prevValues, ['DispositionDtTmErrors']: RequiredFieldIncident(value.DispositionDtTm) } })
    }
    if (RequiredFieldIncident(value.CourtDispositionID)) {
      setErrors(prevValues => { return { ...prevValues, ['CourtDispositionIDErrors']: RequiredFieldIncident(value.CourtDispositionID) } })
    }
    if (RequiredFieldIncident(value.Comments)) {
      setErrors(prevValues => { return { ...prevValues, ['CommentsErrors']: RequiredFieldIncident(value.Comments) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DispositionDtTmErrors, CourtDispositionIDErrors, CommentsErrors, } = errors

  useEffect(() => {
    if (DispositionDtTmErrors === 'true' && CourtDispositionIDErrors === 'true' && CommentsErrors === 'true') {
      if (status) { update_CourtDisp() }
      else { Add_Type() }
    }
  }, [DispositionDtTmErrors, CourtDispositionIDErrors, CommentsErrors])

  useEffect(() => {
    if (openPage || loginAgencyID) {
      Get_DataExceptionalClearanceID(loginAgencyID); Get_CourtDispositionID(loginAgencyID)
    }
  }, [loginAgencyID, openPage])

  const Get_DataExceptionalClearanceID = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID }
    fetchPostData('ExceptionalClearance/GetDataDropDown_ExceptionalClearance', val).then((data) => {
      if (data) { setClearanceID(Comman_changeArrayFormat(data, 'ClearanceID', 'Description')) }
      else { setClearanceID([]); }
    })
  }

  const Get_CourtDispositionID = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID }
    fetchPostData('CourtDispositions/GetDataDropDown_CourtDispositions', val).then((data) => {
      if (data) {
        setCourtDispositionID(Comman_changeArrayFormat(data, 'CourtDispositionID', 'Description'))
      } else {
        setCourtDispositionID([]);
      }
    })
  }

  const Add_Type = (e) => {
    const { DispositionDtTm, Comments, ExceptionalClearanceID, ChargeCourtDispositionID, CourtDispositionID, ChargeID, CreatedByUserFK } = value;
    const val = {
      'DispositionDtTm': DispositionDtTm, 'Comments': Comments, 'ExceptionalClearanceID': ExceptionalClearanceID, 'ChargeCourtDispositionID': ChargeCourtDispositionID, 'CourtDispositionID': CourtDispositionID,
      'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID
    }
    AddDeleteUpadate('ChargeCourtDisposition/Insert_ChargeCourtDisposition', val).then((res) => {
      const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
      toastifySuccess(message); get_CourtDisposition_Data(DecChargeId);
      get_ArrestCharge_Count(ChargeID); reset(); setChangesStatus(false); setStatesChangeStatus(false)
      setErrors({ 'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '', });
    })
  }

  const update_CourtDisp = () => {
    AddDeleteUpadate('ChargeCourtDisposition/Update_ChargeCourtDisposition', value).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;
      toastifySuccess(message); setChangesStatus(false); setStatusFalse(); setStatesChangeStatus(false)
      get_CourtDisposition_Data(DecChargeId); reset();
      setErrors({ 'DispositionDtTmErrors': '', 'CourtDispositionIDErrors': '', 'CommentsErrors': '', });
    })
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value })
    } else {
      setValue({ ...value, [name]: null })
    }
  }

  useEffect(() => {
    if (!status) {
    } else { setCourtDispositionDate(''); setValue({ ...value, ['DispositionDtTm']: '', }); }
  }, [])

  const get_CourtDisposition_Data = (ChargeID) => {
    const val = { 'ChargeID': ChargeID, }
    fetchPostData('ChargeCourtDisposition/GetData_ChargeCourtDisposition', val).then((res) => {
      if (res) {
        setCourtDispoData(res);
      } else { setCourtDispoData([]); }
    })
  }

  const columns = [
    {
      name: 'Date/Time', selector: (row) => getShowingDateText(row.DispositionDtTm), sortable: true
    },
    {
      name: 'Comment', selector: (row) => row.Comments,
      format: (row) => (
        <>{row?.Comments ? row?.Comments.substring(0, 70) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>
      ),
      sortable: true
    },
    {
      name: 'Court Disposition', selector: (row) => row.CourtDispostion, sortable: true
    },
    {
      name: 'Exceptional Clearance', selector: (row) => row.ExceptionalClearance, sortable: true
    },

    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 65 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <span to={`#`} onClick={() => { setDelCourtDispositionID(row.ChargeCourtDispositionID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
              : <></> :
              <span to={`#`} onClick={() => { setDelCourtDispositionID(row.ChargeCourtDispositionID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>

    }
  ]

  const set_Edit_Value = (row) => {
    setStatus(true); setErrors(''); setUpdateStatus(updateStatus + 1);
    setStatesChangeStatus(false); setChargeCourtDispositionID(row.ChargeCourtDispositionID);
    GetSingleData(row.ChargeCourtDispositionID);
  }

  const DeleteCourtDisposition = () => {
    const val = { 'ChargeCourtDispositionID': delCourtDispositionID, 'DeletedByUserFK': loginPinID }
    AddDeleteUpadate('ChargeCourtDisposition/Delete_ChargeCourtDisposition', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_ArrestCharge_Count(ChargeID); reset();
        if (delCourtDispositionID == chargeCourtDispositionID) { setStatusFalse() }
        get_CourtDisposition_Data(DecChargeId);
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = () => {
    setStatus(false); reset(); setErrors(''); setChangesStatus(false)
  }

  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    setValue({ ...value, [e.target.name]: e.target.value })
  }

  const reset = () => {
    setValue({ ...value, 'DispositionDtTm': '', 'CourtDispositionID': '', 'Comments': '', 'ExceptionalClearanceID': '', });
    if (editval?.[0]?.CourtDispositionID?.length > 0 || editval?.[0]?.Comments?.length > 0 || editval?.[0]?.ExceptionalClearanceID?.length > 0 || editval?.[0]?.DispositionDtTm?.length > 0) {
      setUpdateCount(updateCount + 1);
    }
    setErrors({ ...errors, 'DispositionDtTmErrors': '', 'CourtDispositionIDErrors': '', 'CommentsErrors': '', });
    setStatesChangeStatus(false); setChargeCourtDispositionID(''); setCourtDispositionDate("");
  }

  const conditionalRowStyles = [
    {
      when: row => row.ChargeCourtDispositionID == chargeCourtDispositionID,
      style: {
        backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer',
      },
    },
  ];


  const customStylesWithOutColor = {
    control: base => ({
      ...base, height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
    }),
  };

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      reset()
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <>
      <div className="col-12">
        <div className="row">
          <div className="col-4 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Disposition Date/Time{errors.DispositionDtTmErrors !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionDtTmErrors}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-3 mt-2 ">
            <DatePicker
              ref={startRef}
              onKeyDown={(e) => {
                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                  e?.preventDefault();
                } else { onKeyDown(e); }
              }}
              id='DispositionDtTm'
              name='DispositionDtTm'
              className='requiredColor'
              dateFormat="MM/dd/yyyy HH:mm"
              timeFormat="HH:mm"
              is24Hour
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              onChange={(date) => {
                !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                let currDate = new Date(date);
                let prevDate = new Date(value?.DispositionDtTm);
                let minDate = new Date(incReportedDate);

                if (((currDate.getDate() === minDate.getDate() && currDate.getMonth() === minDate.getMonth() && currDate.getFullYear() === minDate.getFullYear()) && !(currDate.getDate() === prevDate.getDate() && currDate.getMonth() === prevDate.getMonth() && currDate.getFullYear() === prevDate.getFullYear())
                ) || (currDate.getTime() < minDate.getTime())) {
                  setCourtDispositionDate(minDate); setValue({ ...value, ['DispositionDtTm']: minDate ? getShowingMonthDateYear(minDate) : null })
                }
                else { setCourtDispositionDate(date); setValue({ ...value, ['DispositionDtTm']: date ? getShowingMonthDateYear(date) : null }) }
              }}
              selected={courtDispositionDate}
              timeInputLabel
              isClearable={value?.DispositionDtTm ? true : false}
              placeholderText={value?.DispositionDtTm ? value?.DispositionDtTm : 'Select...'}
              showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
              filterTime={(time) => filterPassedDateTime1(time, courtDispositionDate, incReportedDate)}
              minDate={new Date(incReportedDate)}


            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('Cleared Exceptionally')
            }} data-target="#ListModel" className='new-link'>
              Exceptional Clearance
            </span>
          </div>
          <div className="col-5 col-md-5 col-lg-5 mt-2 ">
            <Select
              name='ExceptionalClearanceID'
              value={clearanceID?.filter((obj) => obj.value === value?.ExceptionalClearanceID)}
              isClearable
              options={clearanceID}
              onChange={(e) => ChangeDropDown(e, 'ExceptionalClearanceID')}
              placeholder="Select..."
              styles={customStylesWithOutColor}
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <p data-toggle="modal" onClick={() => {
              setOpenPage('Court Dispositions')
            }} data-target="#ListModel" className='new-link'>
              Court Disposition    {errors.CourtDispositionIDErrors !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtDispositionIDErrors}</p>
              ) : null}
            </p>
          </div>
          <div className="col-3 col-md-3 col-lg-3 mt-2 ">
            <Select
              name='CourtDispositionID'
              styles={Requiredcolour}
              value={courtDispositionID?.filter((obj) => obj.value === value?.CourtDispositionID)}
              isClearable
              options={courtDispositionID}
              onChange={(e) => ChangeDropDown(e, 'CourtDispositionID')}
              placeholder="Select..."
            />
          </div>

          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <label htmlFor="" className='new-label'>Comments{errors.CommentsErrors !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsErrors}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-5 mt-2 ">
            <textarea name='Comments' onChange={handleChange} id="Comments" value={value.Comments} cols="30" rows='1' className="form-control requiredColor" style={{ resize: 'none' }}></textarea>
          </div>
        </div>
        <div className="btn-box text-right mt-3 mr-1 mb-2">
          <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { setStatusFalse(); }}>New</button>
          {
            status ?
              effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1">Update</button>
                : <></> :
                <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1">Update</button>
              :
              effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>
                : <></> :
                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>
          }
        </div>
        <DataTable
          dense
          columns={columns}
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? courtDispoData : '' : courtDispoData}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          pagination
          highlightOnHover
          onRowClicked={(row) => { set_Edit_Value(row); }}
          fixedHeaderScrollHeight='250px'
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          persistTableHead={true}
          customStyles={tableCustomStyles}
        />
      </div>
      <DeletePopUpModal func={DeleteCourtDisposition} />
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal
        func={check_Validation_Error} setToReset={reset} />

    </>
  )
}

export default CourtDisposition;

export const filterPassedDateTime1 = (time, val, reportDate) => {
  const selectedDate = new Date(time);
  const currentDate = new Date();
  if (selectedDate > currentDate) {
    return true;
  }
  const rpdt = new Date(reportDate).getTime();
  const dd = formatDate(new Date(rpdt));

  if (val && new Date(val)?.getDate() === new Date(reportDate)?.getDate()) {
    return new Date(dd).getTime() <= selectedDate.getTime();
  } else {
    return currentDate.getTime() >= selectedDate.getTime();
  }
};



