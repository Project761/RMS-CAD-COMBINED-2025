import React, { useEffect, useState, useContext, useCallback } from "react";
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, base64ToString, filterPassedDateTimeZone, getShowingDateText, getShowingMonthDateYear, tableCustomStyles } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { RequiredFieldIncident, Space_NotAllow } from "../../../Utility/Personnel/Validation";
import IdentifyFieldColor from "../../../../Common/IdentifyFieldColor";
import { useDispatch } from "react-redux";
import { get_LocalStoreData } from "../../../../../redux/actions/Agency";
import { useSelector } from "react-redux";
import { get_AgencyOfficer_Data } from "../../../../../redux/actions/IncidentAction";
import ChangesModal from "../../../../Common/ChangesModal";

const DispatchActivity = (props) => {

  const { incidentReportedDate } = props

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const dispatch = useDispatch()
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

  const { get_IncidentTab_Count, setChangesStatus, GetDataTimeZone, datezone } = useContext(AgencyContext);

  const [clickedRow, setClickedRow] = useState(null);
  const [dispatchData, setDispatchData] = useState();
  const [dispatchEditValue, setDispatchEditValue] = useState();
  const [dispatchID, setDispatchID] = useState();
  const [status, setStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0)
  const [loder, setLoder] = useState(false)
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
  const [incidentID, setIncidentID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);

  const [value, setValue] = useState({
    'OfficerId': null, 'DispatchDate': '', 'Comments': '', 'DispatchId': '', 'IncidentId': '', 'CreatedByUserFK': '', 'AdminOfficer': '',
  })

  const [errors, setErrors] = useState({
    'DispatchDateError': '', 'CommentsError': '', 'officerIdError': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
      dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID))
      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData, IncID]);

  useEffect(() => {
    if (IncID) {
      setIncidentID(IncID);
      get_Dispatch_Data(IncID);
      get_IncidentTab_Count(IncID, loginPinID);
    }
  }, [IncID]);

  useEffect(() => {
    if (incidentID) {
      setValue(pre => {
        return {
          ...pre, 'OfficerId': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '', 'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
          'DispatchDate': '', 'Comments': '', 'DispatchId': '', 'ModifiedByUserFK': '',
        }
      })
    }
  }, [incidentID, status, updateStatus, agencyOfficerDrpData]);

  useEffect(() => {
    if (dispatchEditValue) {
      setValue({
        ...value,
        'OfficerId': dispatchEditValue?.OfficerId,
        'DispatchDate': dispatchEditValue?.DispatchDate ? getShowingDateText(dispatchEditValue?.DispatchDate) : null,
        'Comments': dispatchEditValue?.Comments,
        'DispatchId': dispatchEditValue?.DispatchId,
        'ModifiedByUserFK': loginPinID,
      })
    }
  }, [dispatchEditValue, updateStatus])

  const checkId = (id, obj) => {
    const status = obj?.filter((item) => item?.value == id)
    return status?.length > 0
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.DispatchDate)) {
      setErrors(prevValues => { return { ...prevValues, ['DispatchDateError']: RequiredFieldIncident(value.DispatchDate) } })
    }
    if (RequiredFieldIncident(value.OfficerId)) {
      setErrors(prevValues => { return { ...prevValues, ['officerIdError']: RequiredFieldIncident(value.OfficerId) } })
    }
    if (Space_NotAllow(value.Comments)) {
      setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_NotAllow(value.Comments) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { DispatchDateError, CommentsError, officerIdError } = errors

  useEffect(() => {
    if (DispatchDateError === 'true' && CommentsError === 'true' && officerIdError === 'true') {
      if (status) { UpdateDispatched() }
      else { AddDispatch() }
    }
  }, [DispatchDateError, CommentsError, officerIdError])

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      Reset()
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const handleChange = (e) => {
    setStatesChangeStatus(true); setChangesStatus(true);
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }

  const ChangeDropDown = (e, name) => {
    setStatesChangeStatus(true); setChangesStatus(true);
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setValue({
        ...value,
        [name]: null
      })
    }
  }

  const AddDispatch = () => {
    AddDeleteUpadate('IncidentDispatchComments/Insert_IncidentDispatcherComments', value)
      .then((res) => {
        if (res.success) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          get_IncidentTab_Count(incidentID);
          get_Dispatch_Data(incidentID);
          closeModal();
          setToReset();
          setStatesChangeStatus(false); setChangesStatus(false);
        }
      })
  }

  const UpdateDispatched = () => {
    AddDeleteUpadate('IncidentDispatchComments/Update_IncidentDispatcherComments', value)
      .then((res) => {
        if (res.success) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          get_Dispatch_Data(incidentID);
          setStatusFalse();
          setToReset();
          setStatesChangeStatus(false); setChangesStatus(false);
        }
      })
  }

  const closeModal = () => {
    Reset();
  }

  const Reset = () => {
    setValue({
      ...value,
      'OfficerId': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '', 'DispatchDate': '', 'Comments': '', 'DispatchId': '', 'ModifiedByUserFK': '',
    });
    setErrors({ ...errors, 'DispatchDateError': '', 'CommentsError': '', 'officerIdError': '' }); setStatesChangeStatus(false); setChangesStatus(false);
  }

  const get_Dispatch_Data = (incidentID) => {
    const val = { 'IncidentId': incidentID, }
    fetchPostData('IncidentDispatchComments/GetData_IncidentDispatcherComments', val).then((res) => {
      if (res) {
        setDispatchData(res); setLoder(true)
      } else {
        setDispatchData([]); setLoder(true)
      }
    })
  }

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I031", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const columns = [
    {
      name: 'Dispatch Date/Time',
      selector: (row) => getShowingDateText(row.DispatchDate),
      sortable: true
    },
    {
      name: 'Dispatch Activity Comments',
      selector: (row) => row?.Comments || '',
      format: (row) => (
        <>{row?.Comments ? row?.Comments.substring(0, 70) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>
      ),
      sortable: true
    },
    {
      name: 'Officer Name',
      selector: (row) => row.OfficerName ? row.OfficerName : '',
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 20 }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 20 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <span onClick={() => { setDispatchID(row.DispatchId) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
              : <></>
              : <span onClick={() => { setDispatchID(row.DispatchId) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>

    }
  ]

  const set_Edit_Value = (row) => {
    setStatus(true); setStatesChangeStatus(false);
    setDispatchEditValue(row);
    setUpdateStatus(updateStatus + 1);
    setErrors({});
  }

  const setStatusFalse = (e) => {
    setClickedRow(null); setStatus(false); setDispatchEditValue(); Reset();
  }

  const DeleteDispatch = () => {
    const val = { 'DispatchId': dispatchID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('IncidentDispatchComments/Delete_IncidentDispatcherComments', val)
      .then((res) => {
        if (res.success) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          get_IncidentTab_Count(incidentID, loginPinID); setStatusFalse(); setToReset();
        } else { console.log("Somthing Wrong"); }
        get_Dispatch_Data(incidentID);
      })
  }
  const setToReset = (e) => {
    setClickedRow(null); setStatus(false); Reset(); setErrors({ ...errors, 'DispatchDateError': '', 'CommentsError': '', 'officerIdError': '', });
    setChangesStatus(false); setStatesChangeStatus(false);
  }
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
  }

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
      },
    },
  ];

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };


  return (
    <>
      <div className="col-12">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-6">
            <div className="row">
              <div className="col-4 col-md-4 col-lg-6 mt-2 pt-2">
                <label htmlFor="" className='new-label'>Dispatch Date/Time</label>
              </div>
              <div className="col-7 col-md-7 col-lg-6 mt-2 ">
                <DatePicker
                  ref={startRef}
                  onKeyDown={(e) => {
                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                      e?.preventDefault();
                    } else {
                      onKeyDown(e);
                    }
                  }}
                  name='DispatchDate'
                  id='DispatchDate'
                  className='requiredColor'
                  dateFormat="MM/dd/yyyy HH:mm"
                  timeFormat="HH:mm "
                  is24Hour
                  onChange={(date) => {
                    if (date) {
                      setStatesChangeStatus(true);
                      const maxDate = new Date(datezone);
                      const maxDateWithMaxTime = new Date(maxDate);
                      maxDateWithMaxTime.setHours(maxDate.getHours(), maxDate.getMinutes(), maxDate.getSeconds(), maxDate.getMilliseconds());
                      const minDate = new Date(incidentReportedDate);
                      const selectedDate = new Date(date);
                      const enteredTime = selectedDate.getTime();
                      if (enteredTime < minDate.getTime()) {
                        selectedDate.setTime(minDate.getTime());
                      }
                      else if (enteredTime > maxDateWithMaxTime.getTime()) {
                        selectedDate.setTime(maxDateWithMaxTime.getTime());
                      }
                      setChangesStatus(true);
                      setValue({ ...value, ['DispatchDate']: getShowingMonthDateYear(selectedDate) });
                    }

                    else {
                      setChangesStatus(true);
                      setValue({ ...value, ['DispatchDate']: null });
                      setStatesChangeStatus(true);
                    }
                  }}
                  timeInputLabel
                  isClearable={value?.DispatchDate ? true : false}
                  placeholderText={'Select..'}
                  selected={value?.DispatchDate && new Date(value?.DispatchDate)}
                  minDate={new Date(incidentReportedDate)}
                  maxDate={new Date(datezone)}
                  showTimeSelect
                  timeIntervals={1}
                  timeCaption="Time"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  autoComplete='off'
                  filterTime={(time) => filterPassedDateTimeZone(time, value?.DispatchDate, incidentReportedDate, datezone)}

                />
                {errors.DispatchDateError !== 'true' ? (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispatchDateError}</span>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <div className="row">
              <div className="col-4 col-md-4 col-lg-4 mt-2 pt-2">
                <label htmlFor="" className='new-label'>Officer Name</label>
              </div>
              <div className="col-7 col-md-7 col-lg-8 mt-2 ">
                <Select
                  name='OfficerId'
                  styles={colourStyles}
                  value={agencyOfficerDrpData?.filter((obj) => obj.value == value?.OfficerId)}
                  options={agencyOfficerDrpData}
                  onChange={(e) => ChangeDropDown(e, 'OfficerId')}
                  placeholder="Select.."
                  menuPlacement="bottom"
                  isClearable
                />
                {errors.officerIdError !== 'true' ? (
                  <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.officerIdError}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-4 col-md-4 col-lg-3 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Dispatch Activity Comments</label>
          </div>
          <div className="col-8 col-md-8 col-lg-9 mt-2 ">
            <textarea name='Comments' id="Comments" cols="30" onChange={handleChange} value={value.Comments} rows='3' className="form-control pt-2 pb-2 requiredColor" style={{ resize: 'none' }}></textarea>
            {errors.CommentsError !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="btn-box text-right mt-4 mr-1 ">
        <button type="button" className="btn btn-sm btn-success mr-1 mb-2" data-dismiss="modal" onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
        {
          status ?
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.Changeok ?
                <button type="button" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1 mb-2">Update</button>
                :
                <>
                </>
              :
              <button type="button" disabled={!statesChangeStatus} onClick={() => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1 mb-2">Update</button>
            :
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.AddOK ?
                <button type="button" onClick={() => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1 mb-2">Save</button>
                :
                <>
                </>
              :
              <button type="button" onClick={() => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1 mb-2">Save</button>
        }
      </div>
      <div className="col-12 px-0 mt-3" >
        {
          loder ?
            <DataTable
              dense
              columns={columns}
              data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? dispatchData : '' : dispatchData}
              selectableRowsHighlight
              highlightOnHover
              customStyles={tableCustomStyles}
              conditionalRowStyles={conditionalRowStyles}
              showHeader={true}
              persistTableHead={true}
              pagination
              paginationPerPage={'100'}
              paginationRowsPerPageOptions={[100, 150, 200, 500]}
              showPaginationBottom={100}
              fixedHeaderScrollHeight='200px'
              fixedHeader
              onRowClicked={(row) => {
                setClickedRow(row);
                set_Edit_Value(row);
              }}
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />
        }
      </div>
      <IdentifyFieldColor />
      <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
      <DeletePopUpModal func={DeleteDispatch} />
    </>
  )
}

export default DispatchActivity; 