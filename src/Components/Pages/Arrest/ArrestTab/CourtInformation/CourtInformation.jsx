import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Decrypt_Id_Name, filterPassedDateTime, formatDate, getShowingDateText, getShowingMonthDateYear, tableCustomStyles } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchData, fetchPostData } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name } from '../../../../Common/ChangeArrayFormat'
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux'
import { get_LocalStoreData } from '../../../../../redux/actions/Agency'
import ListModal from '../../../Utility/ListManagementModel/ListModal'
import ChangesModal from '../../../../Common/ChangesModal'
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction'

const CourtInformation = (props) => {

  const { DecArrestId } = props

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);


  const { get_Arrest_Count, ArresteName, setChangesStatus } = useContext(AgencyContext)
  const [courtInfoData, setCourtInfoData] = useState();
  const [status, setStatus] = useState(false);
  const [modal, setModal] = useState(false)
  const [courtInfoID, setCourtInfoID] = useState();
  const [loder, setLoder] = useState(false)
  const [arrestID, setArrestID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [pleaDate, setPleaDate] = useState();
  const [appearDate, setAppearDate] = useState();
  const [arrestPleaDrp, setArrestPleaDrp] = useState([]);
  const [courtApperReasonDrp, setCourtApperReasonDrp] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [biStateList, setBiStateList] = useState([]);
  const [editval, setEditval] = useState();
  const [openPage, setOpenPage] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [clickedRow, setClickedRow] = useState(null);

  // permissions
  const [addUpdatePermission, setaddUpdatePermission] = useState();


  const [value, setValue] = useState({
    'Name': '', 'DocketID': "Docket 45", 'CourtName': "", 'CourtAppearReasonID': '', 'Attorney': '',
    'CourtStateID': '', 'CourtCityID': '', 'JudgeName': '', 'PleaID': '', 'PleaDateTime': '',
    'Prosecutor': '', 'AppearDateTime': '', 'IsRescheduled': '', 'IsContinued': '', 'IsAppearRequired': '',
    'IsDismissed': '', 'ArrestID': '', 'CreatedByUserFK': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID); dispatch(get_ScreenPermissions_Data("A071", localStoreData?.AgencyID, localStoreData?.PINID));
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
    if (DecArrestId) {
      setValue({ ...value, 'ArrestID': DecArrestId, 'CreatedByUserFK': loginPinID, 'Name': ArresteName, })
      get_CourtInformation_Data(DecArrestId); setArrestID(DecArrestId);
    }
  }, [DecArrestId]);

  const [errors, setErrors] = useState({
    'NameErrors': '',
  })

  const GetSingleData = (courtInfoID) => {
    const val = { 'ArrsetCourtInformationID': courtInfoID }
    fetchPostData('ArrsetCourtInformation/GetSingleData_ArrsetCourtInformation', val)
      .then((res) => {
        if (res) { setEditval(res); }
        else { setEditval([]) }
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'Name': editval[0]?.Name, 'DocketID': editval[0]?.DocketID, 'CourtName': editval[0]?.CourtName,
        'CourtAppearReasonID': editval[0]?.CourtAppearReasonID, 'Attorney': editval[0]?.Attorney ? editval[0]?.Attorney : '',
        'CourtStateID': editval[0]?.CourtStateID, 'CourtCityID': editval[0]?.CourtCityID, 'JudgeName': editval[0]?.JudgeName ? editval[0]?.JudgeName : '',
        'PleaID': editval[0]?.PleaID, 'PleaDateTime': editval[0]?.PleaDateTime ? getShowingDateText(editval[0]?.PleaDateTime) : null,
        'AppearDateTime': editval[0]?.AppearDateTime ? getShowingDateText(editval[0]?.AppearDateTime) : null,
        'Prosecutor': editval[0]?.Prosecutor ? editval[0]?.Prosecutor : '', 'IsRescheduled': editval[0]?.IsRescheduled, 'IsContinued': editval[0]?.IsContinued,
        'IsAppearRequired': editval[0]?.IsAppearRequired, 'IsDismissed': editval[0]?.IsDismissed, 'ModifiedByUserFK': loginPinID, 'ArrsetCourtInformationID': courtInfoID,
      })
      setAppearDate(editval[0]?.AppearDateTime ? new Date(editval[0]?.AppearDateTime) : null);
      setPleaDate(editval[0]?.PleaDateTime ? new Date(editval[0]?.PleaDateTime) : null); getCity(editval[0]?.CourtStateID);
    } else {
      setValue({
        ...value, 'Name': ArresteName, 'DocketID': "Docket 45", 'CourtName': "", 'CourtAppearReasonID': '', 'Attorney': '', 'CourtStateID': '', 'CourtCityID': '', 'JudgeName': '',
        'PleaID': '', 'PleaDateTime': '', 'Prosecutor': '', 'AppearDateTime': '', 'IsRescheduled': '', 'IsContinued': '', 'IsAppearRequired': '', 'IsDismissed': '', 'courtInfoID': ''
      }); setAppearDate(''); setPleaDate('')
    }
  }, [editval])

  const Reset = () => {
    setValue({
      ...value, 'DocketID': "Docket 45", 'CourtName': "", 'CourtAppearReasonID': '', 'Attorney': '', 'CourtStateID': '', 'CourtCityID': '', 'JudgeName': '',
      'PleaID': '', 'PleaDateTime': '', 'Prosecutor': '', 'AppearDateTime': '', 'IsRescheduled': '',
      'IsContinued': '', 'IsAppearRequired': '', 'IsDismissed': '', 'courtInfoID': '',
    })
    setAppearDate(''); setPleaDate(''); setStatesChangeStatus(false);
    setErrors({ ...errors, ['CourtNameError']: '', });
  }

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

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.CourtName)) {
      setErrors(prevValues => { return { ...prevValues, ['CourtNameError']: RequiredFieldIncident(value.CourtName) } })
    }
  }

  const { CourtNameError } = errors

  useEffect(() => {
    if (CourtNameError === 'true') {
      if (status) { update_CourtInFo() }
      else { Add_CourtInformation() }
    }
  }, [CourtNameError])

  useEffect(() => {
    if (openPage || loginAgencyID) {
      Get_ArrestPlea(loginAgencyID); Get_CourtAppearDrp(loginAgencyID); getStateList();
    }
  }, [loginAgencyID, openPage]);

  const Get_ArrestPlea = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID }
    fetchPostData('ArrestPlea/GetDataDropDown_ArrestPlea', val).then((data) => {
      if (data) {
        setArrestPleaDrp(Comman_changeArrayFormat(data, 'ArrestPleaID', 'Description'))
      } else {
        setArrestPleaDrp([]);
      }
    })
  }

  const Get_CourtAppearDrp = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID }
    fetchPostData('CourtAppearReason/GetDataDropDown_CourtAppearReason', val).then((data) => {
      if (data) { setCourtApperReasonDrp(Comman_changeArrayFormat(data, 'CourtAppearReasonID', 'Description')) }
      else { setCourtApperReasonDrp([]); }
    })
  }

  const getStateList = async () => {
    fetchData("State_City_ZipCode/GetData_State").then((data) => {
      if (data) { setBiStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "CourtStateID")); }
      else { setBiStateList([]); }
    });
  };

  const getCity = async (StateID) => {
    const val = { StateID: StateID, };
    fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
      if (data) {
        setCityList(Comman_changeArrayFormat_With_Name(data, "CityID", "CityName", "CourtCityID"))
      } else { setCityList([]); }
    });
  };

  const selectHandleChange = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [e.name]: e.value });
      if (e.name === 'CourtStateID') {
        getCity(e.value);
        setValue(prevValue => ({ ...prevValue, CourtCityID: null }));
      }
    } else {
      if (name === 'CourtStateID') {
        setValue({ ...value, [name]: null, CourtCityID: null });
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  }

  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === 'IsRescheduled' || e.target.name === 'IsContinued' || e.target.name === 'IsAppearRequired' || e.target.name === 'IsDismissed') {
      setValue({ ...value, [e.target.name]: e.target.checked, });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value })
    }
    else { setValue({ ...value, [name]: null }) }
  }

  const Add_CourtInformation = () => {
    const { Name, DocketID, Docket, CourtName, CourtAppearReasonID,
      Attorney, CourtStateID, CourtCityID, JudgeName, PleaID, PleaDateTime, Prosecutor, AppearDateTime, IsRescheduled,
      IsContinued, IsAppearRequired, IsDismissed, courtInfoID, } = value;
    const val = {
      'Name': Name, 'ArrestID': DecArrestId, 'Docket 45': DocketID, 'Docket': Docket, 'CourtName': CourtName, 'CourtAppearReasonID': CourtAppearReasonID,
      'Attorney': Attorney, 'CourtCityID': CourtCityID, 'JudgeName': JudgeName, 'PleaID': PleaID, 'PleaDateTime': PleaDateTime, 'Prosecutor': Prosecutor, 'AppearDateTime': AppearDateTime, 'IsRescheduled': IsRescheduled,
      'IsContinued': IsContinued, 'IsAppearRequired': IsAppearRequired, 'IsDismissed': IsDismissed, 'CourtStateID': CourtStateID, 'courtInfoID': courtInfoID, 'CreatedByUserFK': loginPinID
    }
    AddDeleteUpadate('ArrsetCourtInformation/Insert_ArrsetCourtInformation', val).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;
      toastifySuccess(message);
      get_Arrest_Count(arrestID); setStatesChangeStatus(false); setChangesStatus(false)
      setModal(false); get_CourtInformation_Data(arrestID); Reset();
      setErrors({ ...errors, ['CourtNameError']: '', });
    })
  }

  const update_CourtInFo = () => {
    AddDeleteUpadate('ArrsetCourtInformation/Update_ArrsetCourtInformation', value).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
        toastifySuccess(message); setStatus(true);
        setStatusFalse(); setStatesChangeStatus(false); setChangesStatus(false)
        get_CourtInformation_Data(arrestID);
        setErrors({ ...errors, ['CourtNameError']: '', });
      }
    })
  }

  const startRef = React.useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const customStylesWithOutColor = {
    control: base => ({
      ...base, height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
    }),
  };

  const get_CourtInformation_Data = (ArrestID) => {
    const val = { 'ArrestID': ArrestID }
    fetchPostData('ArrsetCourtInformation/GetData_ArrsetCourtInformation', val).then((res) => {
      if (res) { setCourtInfoData(res); setLoder(true) }
      else { setCourtInfoData([]); setLoder(true) }
    })
  }

  const columns = [
    {
      name: 'Plea Date/Time', selector: (row) => row.PleaDateTime ? getShowingDateText(row.PleaDateTime) : " ", sortable: true
    },
    {
      name: 'Name', selector: (row) => row.Name, sortable: true
    },
    {
      name: 'Court Name', selector: (row) => row.CourtName,
      format: (row) => (<>{row?.CourtName ? row?.CourtName.substring(0, 30) : ''}{row?.CourtName?.length > 40 ? '  . . .' : null} </>),
      sortable: true
    },
    {
      name: 'Prosecutor', selector: (row) => row.Prosecutor,
      format: (row) => (<>{row?.Prosecutor ? row?.Prosecutor.substring(0, 30) : ''}{row?.Prosecutor?.length > 40 ? '  . . .' : null} </>),
      sortable: true
    },
    {
      name: 'Attorney', selector: (row) => row.Attorney,
      format: (row) => (<>{row?.Attorney ? row?.Attorney.substring(0, 30) : ''}{row?.Attorney?.length > 40 ? '  . . .' : null} </>),
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
      cell: row =>
        <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <span to={`#`} onClick={() => { setCourtInfoID(row.ArrsetCourtInformationID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
              : <></> :
              <span to={`#`} onClick={() => { setCourtInfoID(row.ArrsetCourtInformationID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>

    }
  ]

  const set_Edit_Value = (row) => {
    setErrors(''); setStatus(true); setStatesChangeStatus(false); setCourtInfoID(row.ArrsetCourtInformationID); GetSingleData(row.ArrsetCourtInformationID)
  }

  const setStatusFalse = (e) => {
    Reset(); setClickedRow(null); setStatus(false); setCourtInfoID(); setModal(true); setChangesStatus(false)
  }

  const DeleteCourtInFo = () => {
    const val = { 'ArrsetCourtInformationID': courtInfoID, 'DeletedByUserFK': loginPinID }
    AddDeleteUpadate('ArrsetCourtInformation/Delete_ArrsetCourtInformation', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_Arrest_Count(arrestID); Reset();
        get_CourtInformation_Data(arrestID); setStatus(false);
      } else console.log("Somthing Wrong");
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
    },
  ];

  return (
    <>
      <div className="col-12">
        <div className="row ">
          <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Name</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 text-field">
            <input type="text" name='Name' id='Name' value={value?.Name} className='readonlyColor' required readOnly />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Docket Number</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 text-field">
            <input type="text" name='DocketID' id='DocketID' value={value?.DocketID} className='readonlyColor' required readOnly />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
            <span className='new-label'>
              Court Name{errors.CourtNameError !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtNameError}</p>
              ) : null}
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
            <input type="text" name='CourtName' value={value?.CourtName} required className='requiredColor' onChange={handleChange} />
          </div>

          <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Court State</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 ">
            <Select
              name="CourtStateID"
              styles={customStylesWithOutColor}
              value={biStateList?.filter((obj) => obj.value === value?.CourtStateID)}
              isClearable
              options={biStateList}
              onChange={(e) => selectHandleChange(e, 'CourtStateID')}
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Court City</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 ">
            <Select
              name="CourtCityID"
              styles={customStylesWithOutColor}
              value={cityList?.filter((obj) => obj.value === value?.CourtCityID)}
              isClearable
              options={cityList}
              onChange={(e) => selectHandleChange(e, 'CourtCityID')}
              placeholder="Select..."
              isDisabled={!value?.CourtStateID}
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
            <span className='new-label'>
              Judge Name
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
            <input type="text" name='JudgeName' value={value?.JudgeName} onChange={handleChange} />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('Arrest Plea')
            }} data-target="#ListModel" className='new-link'>
              Plea
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 ">
            <Select
              name='PleaID'
              styles={customStylesWithOutColor}
              value={arrestPleaDrp?.filter((obj) => obj.value === value?.PleaID)}
              isClearable
              options={arrestPleaDrp}
              onChange={(e) => ChangeDropDown(e, 'PleaID')}
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Plea Date/Time</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-1">

            <DatePicker
              ref={startRef}
              onKeyDown={(e) => {
                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                  e?.preventDefault();
                } else { onKeyDown(e); }
              }}
              dateFormat="MM/dd/yyyy HH:mm"
              timeFormat="HH:mm "
              is24Hour
              timeInputLabel
              isClearable
              name='PleaDateTime'
              id='PleaDateTime'
              onChange={(date) => {
                if (date) {
                  let currDate = new Date(date);
                  let prevDate = new Date(value?.PleaDateTime);
                  let maxDate = new Date();
                  if ((currDate.getDate() === maxDate.getDate() && currDate.getMonth() === maxDate.getMonth() && currDate.getFullYear() === maxDate.getFullYear()) && !(currDate.getDate() === prevDate.getDate() && currDate.getMonth() === prevDate.getMonth() && currDate.getFullYear() === prevDate.getFullYear())) {
                    setPleaDate(new Date()); !addUpdatePermission && setStatesChangeStatus(true);
                    setValue({ ...value, ['PleaDateTime']: new Date() ? getShowingMonthDateYear(new Date()) : null })
                  }
                  else if (date >= new Date()) {
                    setPleaDate(new Date()); !addUpdatePermission && setStatesChangeStatus(true); setValue({ ...value, ['PleaDateTime']: new Date() ? getShowingMonthDateYear(new Date()) : null })
                  } else if (date <= new Date(incReportedDate)) {
                    setPleaDate(incReportedDate); !addUpdatePermission && setStatesChangeStatus(true); setValue({ ...value, ['PleaDateTime']: incReportedDate ? getShowingMonthDateYear(incReportedDate) : null })
                  } else {
                    setPleaDate(date); !addUpdatePermission && setStatesChangeStatus(true); setValue({ ...value, ['PleaDateTime']: date ? getShowingMonthDateYear(date) : null })
                  }
                } else {
                  setPleaDate(null); !addUpdatePermission && setStatesChangeStatus(true); setValue({ ...value, ['PleaDateTime']: null })
                }
              }}
              selected={value.PleaDateTime ? new Date(value.PleaDateTime) : null}
              placeholderText={'Select...'}
              showTimeSelect
              filterTime={(time) => filterPassedDateTime(time, pleaDate, incReportedDate)}
              timeIntervals={1}
              dropdownMode="select"
              timeCaption="Time"
              popperPlacement="bottom"
              maxDate={new Date()}
              minDate={new Date(incReportedDate)}
              autoComplete='off'
              showMonthDropdown
              showYearDropdown
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Prosecutor</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-2 text-field">
            <input type="text" name='Prosecutor' value={value?.Prosecutor} onChange={handleChange} />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Attorney</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-2 text-field">
            <input type="text" name='Attorney' id='Attorney' onChange={handleChange} value={value?.Attorney} required />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Appear Date/Time</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-1">
            <DatePicker
              ref={startRef}
              onKeyDown={(e) => {
                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                  e?.preventDefault();
                } else {
                  onKeyDown(e);
                }
              }}
              id='AppearDateTime'
              name='AppearDateTime'
              className=''
              dateFormat="MM/dd/yyyy HH:mm"
              timeFormat="HH:mm"
              is24Hour
              onChange={(date) => {
                setAppearDate(date);
                !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                setValue({ ...value, ['AppearDateTime']: date ? getShowingMonthDateYear(date) : null });
              }}
              selected={appearDate}
              filterTime={(time) => filterPassedDateTime1(time, appearDate, incReportedDate)}
              timeInputLabel
              isClearable={value?.AppearDateTime ? true : false}
              placeholderText={'Select...'}
              showTimeSelect
              timeIntervals={1}
              timeCaption="Time"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              minDate={new Date(incReportedDate)}
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
            <span data-toggle="modal" onClick={() => {
              setOpenPage('Court Appear Reason')
            }} data-target="#ListModel" className='new-link'>
              Court Appear Reason
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-2 ">
            <Select
              name='CourtAppearReasonID' styles={customStylesWithOutColor}
              value={courtApperReasonDrp?.filter((obj) => obj.value === value?.CourtAppearReasonID)}
              isClearable
              options={courtApperReasonDrp}
              onChange={(e) => ChangeDropDown(e, 'CourtAppearReasonID')}
              placeholder="Select..."
            />
          </div>
        </div>
        <div className="row bt mt-2">
          <div className="col-4 col-md-4 col-lg-3 mt-2">
            <div className="form-check ">
              <input className="form-check-input" type="checkbox" name='IsRescheduled' id="flexCheckDefault" checked={value?.IsRescheduled} value={value?.IsRescheduled} onChange={handleChange} />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Rescheduled
              </label>
            </div>
          </div>
          <div className="col-3 col-md-3 col-lg-3 mt-2">
            <div className="form-check ">
              <input className="form-check-input" type="checkbox" name='IsContinued' id="flexCheckDefault1" checked={value?.IsContinued} value={value?.IsContinued} onChange={handleChange} />
              <label className="form-check-label" htmlFor="flexCheckDefault1">
                Continued
              </label>
            </div>
          </div>
          <div className="col-5 col-md-5 col-lg-3 mt-2">
            <div className="form-check ">
              <input className="form-check-input" type="checkbox" name='IsAppearRequired' id="flexCheckDefault2" checked={value?.IsAppearRequired} value={value?.IsAppearRequired} onChange={handleChange} />
              <label className="form-check-label" htmlFor="flexCheckDefault2">
                Appear Required
              </label>
            </div>
          </div>
          <div className="col-5 col-md-4 col-lg-3 mt-2">
            <div className="form-check ">
              <input className="form-check-input" type="checkbox" name='IsDismissed' id="flexCheckDefault3" checked={value?.IsDismissed} value={value?.IsDismissed} onChange={handleChange} />
              <label className="form-check-label" htmlFor="flexCheckDefault3">
                Dismissed
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="btn-box text-right mt-1 mr-1 mb-2">
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
      <div className="col-12  mt-4" >
        <DataTable
          dense
          columns={columns}
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? courtInfoData : [] : courtInfoData}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
          pagination
          highlightOnHover
          onRowClicked={(row) => {
            setClickedRow(row);
            set_Edit_Value(row);
          }}
          fixedHeaderScrollHeight='150px'
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          persistTableHead={true}
          customStyles={tableCustomStyles}
        />
      </div>
      <DeletePopUpModal func={DeleteCourtInFo} />
      <ChangesModal
        func={check_Validation_Error} setToReset={setStatusFalse} />
      <ListModal {...{ openPage, setOpenPage }} />

    </>
  )
}

export default CourtInformation

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
