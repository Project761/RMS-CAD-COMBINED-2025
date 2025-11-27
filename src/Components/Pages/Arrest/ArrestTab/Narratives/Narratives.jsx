import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, editorConfig, filterPassedDateTime, getShowingDateText, getShowingMonthDateYear, isLockOrRestrictModule, LockFildscolour, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState } from 'draft-js';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { RequiredFieldIncident, Space_NotAllow, } from '../../../Utility/Personnel/Validation';
import DatePicker from 'react-datepicker';
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import htmlToDraft from 'html-to-draftjs';
import ReactQuill from 'react-quill';
import ArresList from '../../../ShowAllList/ArrestList';

const Narrative = (props) => {

  const { DecArrestId, DecIncID, ListData, get_List, isLocked, setIsLocked } = props
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

  const { get_Arrest_Count, setChangesStatus, changesStatusCount, changesStatus, NameId } = useContext(AgencyContext)
  const [clickedRow, setClickedRow] = useState(null);
  const [narrativeData, setNarrativeData] = useState([])
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [arrestNarrativeID, setArrestNarrativeID] = useState('')


  const [arrestID, setArrestID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [editval, setEditval] = useState([]);
  const [narrativeDtTm, setNarrativeDtTm] = useState()
  const [narrativeTypeList, setNarrativeTypeList] = useState([])
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  // permissions
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({
    'CommentsDoc': '', 'NarrativeComments': '', 'NarrativeDtTm': '', 'NarrativeTypeID': '', 'ReportedByID': null, 'ModifiedByUserFK': '',
    'CreatedByUserFK': '', 'ArrestID': '', 'ArrestNarrativeID': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(parseInt(localStoreData?.PINID)); setLoginAgencyID(parseInt(localStoreData?.AgencyID));
      dispatch(get_ScreenPermissions_Data("A072", localStoreData?.AgencyID, localStoreData?.PINID));
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
      setValue({
        ...value,
        'CommentsDoc': '', 'NarrativeComments': '', 'NarrativeDtTm': '', 'NarrativeTypeID': '',
        'ReportedByID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
        'ModifiedByUserFK': '', 'ArrestNarrativeID': '',
        'ArrestID': '', 'CreatedByUserFK': loginPinID,
      });
      get_Narrative_Type(loginAgencyID);
      if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(loginAgencyID));
    }
  }, [loginPinID, agencyOfficerDrpData]);

  useEffect(() => {
    if (DecArrestId) {
      get_NarrativesData(DecArrestId);
      setArrestID(DecArrestId);
    }
  }, [DecArrestId]);

  useEffect(() => {
    if (NameId) {
      get_List(NameId);
    }
  }, [NameId])

  useEffect(() => {
    if (DecIncID) {
      get_NarrativesData(DecIncID);
    }
  }, [DecIncID]);

  const get_NarrativesData = () => {
    const val = { 'ArrestID': DecArrestId, }
    fetchPostData('ArrestNarrative/GetData_ArrestNarrative', val)
      .then(res => {
        if (res) { setNarrativeData(res); }
        else { setNarrativeData([]); }
      })
  }

  const columns = [
    {
      name: 'Date/Time',
      selector: (row) => getShowingDateText(row.NarrativeDtTm),
      sortable: true
    },
    {
      name: 'Arrest Notes',
      selector: (row) => row?.NarrativeComments || '',
      format: (row) => (
        <>{row?.NarrativeComments ? row?.NarrativeComments.substring(0, 70) : ''}{row?.NarrativeComments?.length > 40 ? '  . . .' : null} </>
      ),
      sortable: true
    },
    {
      name: 'Reported By', selector: (row) => row.ReportedBy_Description,
      format: (row) => (<>{row?.ReportedBy_Description ? row?.ReportedBy_Description.substring(0, 30) : ''}{row?.ReportedBy_Description?.length > 40 ? '  . . .' : null} </>),
      sortable: true
    },
    {
      name: 'Report Type ', selector: (row) => row.NarrativeDescription, sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: '10px' }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", narrativeData, isLocked, true) ?
              <span to={`#`} onClick={(e) => setArrestNarrativeID(row.ArrestNarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
              :
              <></>
              :
              !isLockOrRestrictModule("Lock", narrativeData, isLocked, true) &&
              <span to={`#`} onClick={(e) => setArrestNarrativeID(row.ArrestNarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>

    }
  ]

  const [errors, setErrors] = useState({
    'NarrativeDtTmError': '', 'ArrestNarrativeIDError': '', 'NarrativeCommentsError': '', 'ReportedByIDError': '',
  })

  const GetSingleData = (arrestNarrativeID) => {
    const val = { 'ArrestNarrativeID': arrestNarrativeID }
    fetchPostData('ArrestNarrative/GetSingleData_ArrestNarrative', val).then((res) => {
      if (res) { setEditval(res) }
      else { setEditval([]) }
    })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        "ArrestNarrativeID": arrestNarrativeID, 'NarrativeDtTm': editval[0].NarrativeDtTm ? getShowingDateText(editval[0].NarrativeDtTm) : '',
        'NarrativeTypeID': editval[0].NarrativeTypeID, 'ReportedByID': editval[0].ReportedByID, 'CreatedByUserFK': editval[0].CreatedByUserFK,
        'NarrativeComments': editval[0].NarrativeComments, 'ModifiedByUserFK': loginPinID, 'CommentsDoc': editval[0].CommentsDoc,
      });

      setNarrativeDtTm(editval[0]?.narrativeDtTm ? new Date(editval[0]?.narrativeDtTm) : null);
    } else {
      setValue({
        ...value,
        'NarrativeComments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'ArrestNarrativeID': '', 'NarrativeDtTm': '', 'NarrativeTypeID': '', 'ReportedByID': loginPinID, 'CreatedByUserFK': loginPinID,
      });
    }
  }, [editval, changesStatusCount])

  const get_Narrative_Type = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID }
    fetchPostData('NarrativeType/GetDataDropDown_NarrativeType', val)
      .then((res) => {
        if (res) { setNarrativeTypeList(Comman_changeArrayFormat(res, 'NarrativeTypeID', 'Description')) }
        else { setNarrativeTypeList([]) }
      })
  }

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") { reset() }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const ChangeDropDown = (e, name) => {
    console.log('hello-ChangeDropDown -1')
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value })
    } else {
      setValue({ ...value, [name]: null })
    }
  }

  const reset = () => {
    setChangesStatus(false)
    setValue({
      ...value, 'NarrativeTypeID': '', 'NarrativeComments': '', 'NarrativeDtTm': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'ArrestNarrativeID': '',
      'headOfAgencyName': '', 'ReportedByID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
    });
    setErrors({
      ...errors,
      'ReportedByPinError': '', 'NarrativeDtTmError': '', 'ArrestNarrativeIDError': '', 'NarrativeCommentsError': '', 'ReportedByIDError': '',
    });
    setNarrativeDtTm('');
    setEditval([])
  }

  const checkId = (id, obj) => {
    const status = obj?.filter((item) => item?.value == id)
    return status?.length > 0
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.NarrativeDtTm)) {
      setErrors(prevValues => { return { ...prevValues, ['NarrativeDtTmError']: RequiredFieldIncident(value.NarrativeDtTm) } })
    }
    if (RequiredFieldIncident(value.NarrativeTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ArrestNarrativeIDError']: RequiredFieldIncident(value.NarrativeTypeID) } })
    }
    if (Space_NotAllow(value.NarrativeComments)) {
      setErrors(prevValues => { return { ...prevValues, ['NarrativeCommentsError']: Space_NotAllow(value.NarrativeComments) } })
    }
    if (RequiredFieldIncident(value.ReportedByID)) {
      setErrors(prevValues => { return { ...prevValues, ['ReportedByIDError']: RequiredFieldIncident(value.ReportedByID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { NarrativeDtTmError, ArrestNarrativeIDError, NarrativeCommentsError, ReportedByIDError } = errors

  useEffect(() => {
    if (NarrativeDtTmError === 'true' && ArrestNarrativeIDError === 'true' && NarrativeCommentsError === 'true' && ReportedByIDError === 'true') {
      if (status) { updateNarrative() }
      else { submit() }
    }
  }, [NarrativeDtTmError, ArrestNarrativeIDError, NarrativeCommentsError, ReportedByIDError])

  const submit = () => {
    const result = narrativeData?.find(item => {
      if (item.NarrativeComments) {
        if (item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()) {
          return item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()
        } else return item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()
      }
    }
    );
    if (result) {
      toastifyError('Comments Already Exists')
      setErrors({ ...errors, ['NarrativeCommentsError']: '' })
    } else {
      const { CommentsDoc, NarrativeComments, NarrativeDtTm, NarrativeTypeID, ReportedByID,
        ArrestNarrativeID, } = value;
      const val = {
        'CommentsDoc': CommentsDoc, 'NarrativeComments': NarrativeComments, 'NarrativeDtTm': NarrativeDtTm, 'NarrativeTypeID': NarrativeTypeID, 'ReportedByID': ReportedByID,
        'ArrestNarrativeID': ArrestNarrativeID, 'ArrestID': DecArrestId, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID,
      }
      AddDeleteUpadate('ArrestNarrative/Insert_Narrative', val).then((res) => {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message); get_Arrest_Count(arrestID); setChangesStatus(false);
        get_NarrativesData(DecIncID);; reset(); setStatesChangeStatus(false)
        setErrors({ ['NarrativeDtTmError']: '', })
      })
    }
  }

  const updateNarrative = (e) => {
    const result = narrativeData?.find(item => {
      if (item.NarrativeComments) {
        if (item.ArrestNarrativeID != value.ArrestNarrativeID) {
          if (item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()) {
            return item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()
          } else return item.NarrativeComments.toLowerCase() === value.NarrativeComments.toLowerCase()
        }
      }
    }
    );
    if (result) {
      toastifyError('Code Already Exists')
      setErrors({ ...errors, ['NarrativeCommentsError']: '' })
    } else {
      AddDeleteUpadate('ArrestNarrative/Update_ArrestNarrative', value)
        .then((res) => {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message); setChangesStatus(false); get_NarrativesData(DecIncID);
          setStatusFalse(); reset(); setStatesChangeStatus(false)
          setErrors({ ['NarrativeDtTmError']: '', })
        })
    }
  }

  const DeleteNarratives = () => {
    const val = {
      'ArrestNarrativeID': arrestNarrativeID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('ArrestNarrative/Delete_ArrestNarrative', val).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_Arrest_Count(arrestID); reset()
        get_NarrativesData(DecIncID); setStatus(false);
      } else { console.log("Somthing Wrong"); }
    })
  }

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const setStatusFalse = () => {
    setClickedRow(null); setStatus(false); reset(); setChangesStatus(false)
  }

  const editNarratives = (row) => {
    if (changesStatus) {
      const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
      modal.show();
    }
    else {
      setArrestNarrativeID(row.ArrestNarrativeID);
      setUpDateCount(upDateCount + 1); setStatesChangeStatus(false); setStatus(true); setErrors('')
      GetSingleData(row.ArrestNarrativeID); setChangesStatus(false);
    }

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

  const setToReset = () => {
  }

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.ck-powered-by { display: none !important; }`;
    document.head.appendChild(style);
  }, []);

  return (
    <>
      <ArresList {...{ ListData }} />
      <div className="row mb-3">
        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
          <span className='new-label'>
            Reported By {errors.ReportedByIDError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByIDError}</p>
            ) : null}
          </span>
        </div>
        <div className="col-4 col-md-4 col-lg-3 mt-2 ">
          <Select
            name='ReportedByID'
            isClearable
            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReportedByID)}
            options={agencyOfficerDrpData}
            onChange={(e) => ChangeDropDown(e, 'ReportedByID')}
            placeholder="Select.."
            menuPlacement="bottom"
            // styles={Requiredcolour}
            styles={isLockOrRestrictModule("Lock", editval[0]?.ReportedByID, isLocked) ? LockFildscolour : Requiredcolour}
            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.ReportedByID, isLocked)}
          />
        </div>
        <div className="col-4 col-md-4 col-lg-1 mt-2 pt-2">
          <label htmlFor="" className='new-label'>Report Type {errors.ArrestNarrativeIDError !== 'true' ? (
            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArrestNarrativeIDError}</p>
          ) : null}</label>
        </div>
        <div className="col-7 col-md-7 col-lg-3 mt-2 ">
          <Select
            name='NarrativeTypeID'
            isClearable
            value={narrativeTypeList?.filter((obj) => obj.value === value?.NarrativeTypeID)}
            options={narrativeTypeList}
            onChange={(e) => ChangeDropDown(e, 'NarrativeTypeID')}
            placeholder="Select.."
            menuPlacement="bottom"
            // styles={Requiredcolour}
            styles={isLockOrRestrictModule("Lock", editval[0]?.NarrativeTypeID, isLocked) ? LockFildscolour : Requiredcolour}
            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.NarrativeTypeID, isLocked)}
          />
        </div>
        <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
          <label htmlFor="" className='new-label'>Date/Time{errors.NarrativeDtTmError !== 'true' ? (
            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeDtTmError}</p>
          ) : null}</label>
        </div>
        <div className="col-4 col-md-4 col-lg-3 mt-2 ">
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
            // className='requiredColor'
            className={isLockOrRestrictModule("Lock", editval[0]?.NarrativeDtTm, isLocked) ? 'LockFildsColor' : 'requiredColor'}
            disabled={isLockOrRestrictModule("Lock", editval[0]?.NarrativeDtTm, isLocked)}
            name='NarrativeDtTm'
            id='NarrativeDtTm'
            onChange={(date) => {
              let currDate = new Date(date);
              let prevDate = new Date(value?.NarrativeDtTm);
              let maxDate = new Date()

              if (date) {
                if ((currDate.getDate() === maxDate.getDate() && currDate.getMonth() === maxDate.getMonth() && currDate.getFullYear() === maxDate.getFullYear()) && !(currDate.getDate() === prevDate.getDate() && currDate.getMonth() === prevDate.getMonth() && currDate.getFullYear() === prevDate.getFullYear())) {
                  setNarrativeDtTm(maxDate); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                  setValue({ ...value, ['NarrativeDtTm']: maxDate ? getShowingMonthDateYear(maxDate) : null })
                }
                else
                  if (date >= new Date()) {
                    setNarrativeDtTm(new Date()); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                    setValue({ ...value, ['NarrativeDtTm']: new Date() ? getShowingMonthDateYear(new Date()) : null })
                  } else if (date <= new Date(incReportedDate)) {
                    setNarrativeDtTm(incReportedDate); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                    setValue({ ...value, ['NarrativeDtTm']: incReportedDate ? getShowingMonthDateYear(incReportedDate) : null })
                  } else {
                    setNarrativeDtTm(date); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                    setValue({ ...value, ['NarrativeDtTm']: date ? getShowingMonthDateYear(date) : null })
                  }
              } else {
                setNarrativeDtTm(null); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                setValue({ ...value, ['NarrativeDtTm']: null })
              }
            }}
            selected={value.NarrativeDtTm ? new Date(value.NarrativeDtTm) : null}
            placeholderText={'Select...'}
            showTimeSelect
            filterTime={(time) => filterPassedDateTime(time, narrativeDtTm, incReportedDate)}
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

      </div>

      <div className="row mt-1">
        <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">

          <ReactQuill
            className={isLockOrRestrictModule("Lock", editval[0]?.CommentsDoc, isLocked) ? "editor-class-Lock" : `editor-class`}
            // disabled={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
            //   !IsSuperadmin &&
            //   !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}

            // readOnly={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') && !IsSuperadmin && !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}
            disabled={isLockOrRestrictModule("Lock", editval[0]?.CommentsDoc, isLocked) ? true : false}
            readOnly={isLockOrRestrictModule("Lock", editval[0]?.CommentsDoc, isLocked)}
            value={value.CommentsDoc}
            onChange={(value, delta, source, editor) => {
              const text = editor?.getText();
              setStatesChangeStatus(true);
              setValue((prevValue) => ({
                ...prevValue,
                NarrativeComments: text,
                CommentsDoc: value,
              }));

            }}
            modules={{
              history: { delay: 200, maxStack: 500, userOnly: true },
              toolbar: [
                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                [{ 'size': ['small', 'medium', 'large', 'huge'] }],  // Font 
                // size options 
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
                ['bold', 'italic', 'underline'],
                // ['link', 'image'],
                [{ 'color': [] }, { 'background': [] }],  // Text color and 
                // background color 
                ['blockquote'],
                ['spell-checker'],  // spell checker
                ['undo', 'redo'],
              ],
            }}
            formats={['undo', 'redo', "header", "bold", "italic", "underline", "size", "background", "strike", 'align', "blockquote", 'list', "bullet", "indent", "code-block", "spell-checker", "color",
              // "link", 
              // "image", 
            ]}
            editorProps={{ spellCheck: true }}
            theme="snow"
            placeholder="Write something..."
            style={{
              minHeight: '200px',
              maxHeight: '210px',
              overflowY: 'auto',
            }}
          />
          {errors.NarrativeCommentsError !== 'true' ? (
            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeCommentsError}</span>
          ) : null}
        </div>
      </div>

      <div className="col-12 text-right mt-3 ">
        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); }}>New</button>
        {
          status ?
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.Changeok ?
                <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success pl-2">Update</button>
                :
                <>
                </>
              :
              <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success pl-2">Update</button>
            :
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.AddOK ?
                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Save</button>
                :
                <>
                </>
              :
              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Save</button>
        }
      </div>
      <div className="col-12 mt-2">
        <DataTable
          dense
          columns={columns}
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? narrativeData : '' : narrativeData}
          selectableRowsHighlight
          highlightOnHover
          onRowClicked={(row) => { setClickedRow(row); editNarratives(row); }}
          fixedHeaderScrollHeight='150px'
          conditionalRowStyles={conditionalRowStyles}
          fixedHeader
          pagination
          paginationPerPage={'10'}
          paginationRowsPerPageOptions={[10, 15, 20, 50]}
          persistTableHead={true}
          customStyles={tableCustomStyles}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      <DeletePopUpModal func={DeleteNarratives} />
      <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
    </>
  )
}
export default Narrative;