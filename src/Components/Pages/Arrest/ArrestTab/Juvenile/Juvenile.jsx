import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Decrypt_Id_Name, getShowingWithOutTime, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import ArresList from '../../../ShowAllList/ArrestList';

const Juvenile = (props) => {
  const { DecArrestId, ListData, get_List } = props
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const { get_Arrest_Count, setChangesStatus, changesStatusCount, changesStatus, NameId, } = useContext(AgencyContext);
  const [clickedRow, setClickedRow] = useState(null);

  const [juvenileData, setJuvenileData] = useState();
  const [arrestJuvenileID, setArrestJuvenileID] = useState();
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0)

  const [loginAgencyID, setLoginAgencyID] = useState('')
  const [arrestID, setArrestID] = useState('')
  const [loginPinID, setLoginPinID] = useState('');
  const [editval, setEditval] = useState();
  const [parentContactDtTm, setParentContactDtTm] = useState();
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);

  // permissions
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({
    'ParentContactDtTm': '', 'ContactByID': '', 'ParentAddress': '', 'ParentName': '', 'ParentPhone': "", 'ArrestID': arrestID,
    'CreatedByUserFK': loginPinID,
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("A080", localStoreData?.AgencyID, localStoreData?.PINID));
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
    if (loginAgencyID) {
      setValue({
        ...value, 'ParentContactDtTm': '', 'ContactByID': '', 'ParentAddress': '', 'ParentName': '', 'ParentPhone': "", 'CreatedByUserFK': loginPinID, 'ArrestID': DecArrestId,
      }); if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(loginAgencyID));
    }
  }, [loginAgencyID]);

  useEffect(() => {
    if (DecArrestId) { setArrestID(DecArrestId); get_Data_Juvenile(DecArrestId); }
  }, [DecArrestId])


  useEffect(() => {
    if (NameId) {
      get_List(NameId);
    }
  }, [NameId])
  const [errors, setErrors] = useState({
    'ParentContactDtTmErrors': '', 'ContactByIDErrors': '',
  })

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.ParentContactDtTm)) {
      setErrors(prevValues => { return { ...prevValues, ['ParentContactDtTmErrors']: RequiredFieldIncident(value.ParentContactDtTm) } })
    }
    if (RequiredFieldIncident(value.ContactByID)) {
      setErrors(prevValues => { return { ...prevValues, ['ContactByIDErrors']: RequiredFieldIncident(value.ContactByID) } })
    }
  }
  const { ParentContactDtTmErrors, ContactByIDErrors, } = errors

  useEffect(() => {
    if (ParentContactDtTmErrors === 'true' && ContactByIDErrors === 'true') {
      if (status) { update_Juvenile() }
      else { Add_Type() }
    }
  }, [ParentContactDtTmErrors, ContactByIDErrors])


  const GetSingleData = (arrestJuvenileID) => {
    const val = { 'ArrestJuvenileID': arrestJuvenileID, }
    fetchPostData('ArrestJuvenile/GetSingleData_ArrestJuvenile', val)
      .then((res) => {
        if (res) { setEditval(res); }
        else { setEditval([]) }
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value, 'ArrestJuvenileID': editval[0]?.ArrestJuvenileID, 'ParentContactDtTm': editval[0].ParentContactDtTm ? getShowingWithOutTime(editval[0].ParentContactDtTm) : '',
        'ParentAddress': editval[0]?.ParentAddress ? editval[0]?.ParentAddress.trim() : '', 'ContactByID': editval[0]?.ContactByID,
        'ParentName': editval[0]?.ParentName ? editval[0]?.ParentName : '', 'ParentPhone': editval[0]?.ParentPhone, 'ModifiedByUserFK': loginPinID,
      })
      setParentContactDtTm(editval[0]?.ParentContactDtTm ? new Date(editval[0]?.ParentContactDtTm) : '');
    } else { setValue({ ...value, 'ParentContactDtTm': '', ' ContactByID': '', 'ParentAddress': '', 'ParentName': '', }) }
  }, [editval, changesStatusCount])


  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === 'ParentPhone') {
      let ele = e.target.value.replace(/[^0-9\s]/g, "")
      if (ele.length === 10) {
        const cleaned = ('' + ele).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] });
        }
      } else {
        ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
        setValue({ ...value, [e.target.name]: EvalError });
      }
    }
    else {
      setValue({ ...value, [e.target.name]: e.target.value, });
    }
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value })
    } else setValue({ ...value, [name]: null })
  }

  const Add_Type = () => {
    const { ParentContactDtTm, ContactByID, ParentAddress, ParentName, ParentPhone, } = value;
    const val = {
      'ParentContactDtTm': ParentContactDtTm, 'ContactByID': ContactByID, 'ParentAddress': ParentAddress, 'ParentName': ParentName,
      'CreatedByUserFK': loginPinID, 'ArrestID': DecArrestId, 'ParentPhone': ParentPhone
    }
    AddDeleteUpadate('ArrestJuvenile/Insert_ArrestJuvenile', val).then((res) => {
      const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
      toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false)
      get_Data_Juvenile(arrestID); get_Arrest_Count(arrestID); setStatus(false); reset()
    })
  }

  const update_Juvenile = () => {
    AddDeleteUpadate('ArrestJuvenile/Update_ArrestJuvenile', value).then((res) => {
      const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
      toastifySuccess(message); setStatesChangeStatus(false); get_Data_Juvenile(arrestID); setStatusFalse();
      setChangesStatus(false); setStatus(false); reset();
    })
  }


  const reset = () => {
    setValue({
      ...value, 'ParentContactDtTm': '', 'ContactByID': '', 'ParentAddress': '', 'ParentName': '', 'ParentPhone': "",
    }); setParentContactDtTm(''); setStatesChangeStatus(false); setChangesStatus(false)
    setErrors({ ...errors, 'ParentContactDtTmErrors': '', 'ContactByIDErrors': '', });
  }

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") { reset() }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => { document.removeEventListener("keydown", escFunction, false); };
  }, [escFunction]);

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };


  const get_Data_Juvenile = (arrestID) => {
    const val = { 'ArrestID': arrestID, }
    fetchPostData('ArrestJuvenile/GetData_ArrestJuvenile', val).then((res) => {
      if (res) { setJuvenileData(res); }
      else { setJuvenileData(); }
    })
  }

  const columns = [
    {
      name: 'Date', selector: (row) => getShowingWithOutTime(row.ParentContactDtTm), sortable: true
    },
    {
      name: 'Parent Name', selector: (row) => row.ParentName,
      format: (row) => (<>{row?.ParentName ? row?.ParentName.substring(0, 30) : ''}{row?.ParentName?.length > 40 ? '  . . .' : null} </>),
      sortable: true
    },

    {
      name: 'Contacted By', selector: (row) => row.ContactBy_Name,
      format: (row) => (<>{row?.ContactBy_Name ? row?.ContactBy_Name.substring(0, 30) : ''}{row?.ContactBy_Name?.length > 40 ? '  . . .' : null} </>),
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <span to={`#`} onClick={() => { setArrestJuvenileID(row.ArrestJuvenileID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
              : <></>
              : <span to={`#`} onClick={() => { setArrestJuvenileID(row.ArrestJuvenileID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>

    }
  ]
  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
    },
  ];

  const set_Edit_Value = (row) => {
    if (changesStatus) {
      const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
      modal.show();
    } else {
      setStatus(true); setErrors(''); setUpdateStatus(updateStatus + 1); setStatesChangeStatus(false)
      setArrestJuvenileID(row.ArrestJuvenileID);
      GetSingleData(row.ArrestJuvenileID)
    }
  }

  const DeleteJuvenile = () => {
    const val = { 'ArrestJuvenileID': arrestJuvenileID, 'DeletedByUserFK': loginPinID }
    AddDeleteUpadate('ArrestJuvenile/Delete_ArrestJuvenile', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Data_Juvenile(arrestID); reset(); get_Arrest_Count(arrestID); setStatus(false);
      } else console.log("Somthing Wrong");
    })
  }

  const setStatusFalse = (e) => {
    setClickedRow(null); setStatus(false); reset(''); setErrors('')
  }

  const setToReset = () => {
  }

  return (
    <>
      <ArresList {...{ ListData }} />

      <div className="col-12">
        <div className="row">
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <label htmlFor="" className='new-label'>Parent Name</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4 mt-2 text-field ">
            <input type="text" className='ParentName' name='ParentName' value={value?.ParentName} onChange={handleChange} />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Parent Contact Date{errors.ParentContactDtTmErrors !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ParentContactDtTmErrors}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4 mt-2 ">
            <DatePicker
              ref={startRef}
              onKeyDown={(e) => {
                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                  e?.preventDefault();
                } else { onKeyDown(e); }
              }}
              id='ParentContactDtTm'
              name='ParentContactDtTm'
              className='requiredColor' dateFormat="MM/dd/yyyy"
              onChange={(date) => { setParentContactDtTm(date); setStatesChangeStatus(true); setValue({ ...value, ['ParentContactDtTm']: date ? getShowingWithOutTime(date) : null }) }}
              selected={parentContactDtTm}
              isClearable={value?.ParentContactDtTm ? true : false}
              placeholderText={value?.ParentContactDtTm ? value?.ParentContactDtTm : 'Select...'}
              timeIntervals={1}
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              autoComplete='Off'
              minDate={new Date(incReportedDate)}
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Contacted By {errors.ContactByIDErrors !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactByIDErrors}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4 mt-2 ">
            <Select
              name='ContactByID'
              value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ContactByID)}
              options={agencyOfficerDrpData}
              styles={Requiredcolour}
              isClearable
              placeholder="Select..."
              onChange={(e) => { ChangeDropDown(e, 'ContactByID') }}
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Parent Address</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4 mt-2 ">
            <textarea name='ParentAddress' id="ParentAddress" value={value?.ParentAddress} onChange={handleChange} cols="30" rows='2' className="form-control " style={{ resize: 'none' }}>
            </textarea>
          </div>
        </div>
      </div>
      <div className="btn-box text-right  mr-1 mb-2 mt-2">
        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); }}>New</button>
        {
          status ?
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.Changeok ?
                <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1">Update</button>
                :
                <>
                </>
              :
              <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1">Update</button>
            :
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.AddOK ?
                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>
                :
                <>
                </>
              :
              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>
        }
      </div>
      <div className="col-12 mt-2">
        <DataTable
          dense
          columns={columns}
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? juvenileData : '' : juvenileData}
          highlightOnHover
          onRowClicked={(row) => {
            setClickedRow(row);
            set_Edit_Value(row);
          }}
          pagination
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          paginationPerPage={'5'}
          fixedHeaderScrollHeight='500px'
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          persistTableHead={true}
          customStyles={tableCustomStyles}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      <DeletePopUpModal func={DeleteJuvenile} />
      <ChangesModal
        func={check_Validation_Error} setToReset={setToReset} />
    </>
  )
}

export default Juvenile