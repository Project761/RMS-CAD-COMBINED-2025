import { useCallback, useContext, useEffect, useState } from 'react'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import { Editor } from 'react-draft-wysiwyg';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { convertToHTML } from 'draft-convert';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';

const Comments = (props) => {

  const { DecArrestId } = props

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

  const { get_Arrest_Count, setChangesStatus } = useContext(AgencyContext);
  const [commentData, setCommentData] = useState([])
  const [arrestCommentsID, setArrestCommentsID] = useState('')
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [arrestID, setArrestID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [editval, setEditval] = useState();
  const [clickedRow, setClickedRow] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);

  const [value, setValue] = useState({
    'CommentsDoc': '', 'ArrestID': '', 'Comments': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '',
    'OfficerID': '', 'AdminOfficer': '', 'arrestCommentsID': "",
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(parseInt(localStoreData?.AgencyID)); setLoginPinID(parseInt(localStoreData?.PINID));
      dispatch(get_ScreenPermissions_Data("A068", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (loginAgencyID || loginPinID) {
      setValue({
        ...value, 'CommentsDoc': '', 'ArrestID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
        'OfficerID': loginPinID, 'AdminOfficer': '', 'arrestCommentsID': "",
      });
      if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)) }
      if (commentData?.length === 0) { get_CommentsData(DecArrestId); }

    }
  }, [loginAgencyID, loginPinID])

  useEffect(() => {
    if (DecArrestId) { setArrestID(DecArrestId); }
  }, [DecArrestId]);

  const [errors, setErrors] = useState({
    'CommentsError': '', 'OfficerIDError': '',
  })

  useEffect(() => {
    if (arrestCommentsID && status) {
      GetSingleData(arrestCommentsID)
    }
  }, [upDateCount, arrestCommentsID])

  const GetSingleData = (arrestCommentsID) => {
    const val = { 'ArrestCommentsID': arrestCommentsID }
    fetchPostData('ArrestComments/GetSingleData_ArrestComments', val)
      .then((res) => {
        if (res) { setEditval(res) }
        else { setEditval([]) }
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value, 'ArrestCommentsID': arrestCommentsID, 'OfficerID': editval[0].OfficerID, 'Comments': editval[0].Comments, 'ModifiedByUserFK': loginPinID,
        'CommentsDoc': editval[0].CommentsDoc,
      })
      if (editval[0].CommentsDoc?.trim()) {
        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(editval[0].CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));
      }
    } else {
      setValue({
        ...value, 'CommentsDoc': '', 'ArrestID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
        'OfficerID': loginPinID, 'AdminOfficer': '', 'arrestCommentsID': "",
      }); setEditorState(EditorState.createEmpty());
    }
  }, [editval])

  const reset = (e) => {
    setValue({
      ...value, 'CommentsDoc': '', 'ArrestID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
      'OfficerID': loginPinID, 'AdminOfficer': '', 'arrestCommentsID': "",
    }); setStatesChangeStatus(false); setErrors({ ...errors, 'CommentsError': '', 'OfficerIDError': '', });
    setEditorState(() => EditorState.createEmpty(),);
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.Comments?.trim())) {
      setErrors(prevValues => { return { ...prevValues, ['CommentsError']: RequiredFieldIncident(value.Comments?.trim()) } })
    }
    if (RequiredFieldIncident(value.OfficerID)) {
      setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value.OfficerID) } })
    }
  }
  const { CommentsError, OfficerIDError } = errors

  useEffect(() => {
    if (CommentsError === 'true' && OfficerIDError === 'true') {
      if (status) { updateComments() }
      else { submit() }
    }
  }, [CommentsError, OfficerIDError])

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") { reset() }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => { document.removeEventListener("keydown", escFunction, false); };
  }, [escFunction]);

  const ChangeDropDown = (e, name) => {
    if (e) {
      setStatesChangeStatus(true); setValue({ ...value, [name]: e.value }); setChangesStatus(true)
    } else { setValue({ ...value, [name]: null }) }
  }

  const handleEditorChange = (state) => {
    setEditorState(state); convertContentToHTML(state);
  }

  const convertContentToHTML = (state) => {
    let currentContentAsHTML = convertToHTML(state.getCurrentContent());
    setValue({ ...value, CommentsDoc: currentContentAsHTML });
  };

  const getValueNarrative = (e) => {
    setValue({ ...value, ['Comments']: e.blocks[0].text })
    setChangesStatus(true); setStatesChangeStatus(true)

  }

  const submit = () => {
    const result = commentData?.find(item => {
      if (item.Comments) {
        if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
          return item.Comments.toLowerCase() === value.Comments.toLowerCase()
        } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
      }
    });
    if (result) {
      toastifyError('Comments Already Exists'); setErrors({ ...errors, ['CommentsError']: '', })
    } else {
      const { CommentsDoc, Comments, OfficerID, AdminOfficer, arrestCommentsID, } = value;
      const val = {
        'CommentsDoc': CommentsDoc, 'ArrestID': DecArrestId, 'Comments': Comments, 'CreatedByUserFK': loginPinID, 'OfficerID': OfficerID, 'AdminOfficer': AdminOfficer, 'arrestCommentsID': arrestCommentsID, 'ModifiedByUserFK': '',
      }
      AddDeleteUpadate('ArrestComments/Insert_ArrestComments', val)
        .then((res) => {
          const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
          toastifySuccess(message); get_Arrest_Count(arrestID); setChangesStatus(false); setStatesChangeStatus(false)
          get_CommentsData(DecArrestId); reset();
        })
    }
  }

  const updateComments = (e) => {
    const result = commentData?.find(item => {
      if (item.Comments) {
        if (item.ArrestCommentsID != value.ArrestCommentsID) {
          if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
            return item.Comments.toLowerCase() === value.Comments.toLowerCase()
          } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
        }
      }
    });
    if (result) {
      toastifyError('Code Already Exists'); setErrors({ ...errors, ['NarrativeCommentsError']: '' })
    } else {
      AddDeleteUpadate('ArrestComments/Update_ArrestComments', value)
        .then((res) => {
          const parsedData = JSON.parse(res.data); const message = parsedData.Table[0].Message;
          toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false)
          get_CommentsData(DecArrestId); setStatusFalse();
        })
    }
  }


  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf", height: 20, minHeight: 35, fontSize: 14, margintop: 2, boxShadow: 0,
    }),
  }

  const get_CommentsData = (arrestID) => {
    const val = { 'ArrestID': arrestID }
    fetchPostData('ArrestComments/GetData_ArrestComments', val)
      .then(res => {
        if (res) {
          setCommentData(res);
        } else {
          setCommentData([]);
        }
      })
  }

  const columns = [
    {
      name: 'Reported By',
      selector: (row) => row?.Officer_Description,
      sortable: true
    },
    {
      name: 'Comments',
      selector: (row) => <>{row?.Comments ? row?.Comments?.trim()?.substring(0, 60) : ''}{row?.Comments?.trim()?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 10 }}>

          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <span to={`#`} onClick={(e) => setArrestCommentsID(row.ArrestCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
              : <></>
              : <span to={`#`} onClick={(e) => setArrestCommentsID(row.ArrestCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </span>
          }
        </div>
    }
  ]

  const editComments = (val) => {
    setStatesChangeStatus(false)
    setArrestCommentsID(val.ArrestCommentsID); setUpDateCount(upDateCount + 1); setStatus(true); setErrors('')

  }

  const setStatusFalse = (e) => {
    setClickedRow(null); setStatus(false); reset();
  }

  const DeleteComments = () => {
    const val = { 'ArrestCommentsID': arrestCommentsID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('ArrestComments/Delete_ArrestComments', val).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_Arrest_Count(arrestID); reset()
        get_CommentsData(DecArrestId); setStatus(false);
      } else console.log("Somthing Wrong");
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer',
      },
    },
  ];


  return (
    <>

      <div className="row mt-1">
        <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            onChange={getValueNarrative}
            editorStyle={{ height: '15vh' }}
            toolbar={{
              options: ['inline', 'blockType', 'fontFamily', 'list', 'history'],
              inline: {
                inDropdown: false,
                className: undefined,
                component: undefined,
                dropdownClassName: undefined,
                options: ['bold', 'italic', 'underline', 'monospace',],
              },
            }}
          />
          {errors.CommentsError !== 'true' ? (
            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
          ) : null}
        </div>
      </div>
      <div className="col-12">
        <div className="row">
          <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
            <label htmlFor="" className='new-label'>Reported By{errors.OfficerIDError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4 mt-2 ">
            <Select
              name='OfficerID'
              isClearable
              styles={colourStyles}
              value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerID)}
              options={agencyOfficerDrpData}
              onChange={(e) => ChangeDropDown(e, 'OfficerID')}
              placeholder="Select.."
              menuPlacement="top"
            />
          </div>
          <div className="col-12 col-md-6 col-lg-7 text-right mt-2 pt-1">
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
        </div>
      </div>
      <div className="col-12 mt-3">
        <DataTable
          dense
          columns={columns}
          data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? commentData : '' : commentData}
          selectableRowsHighlight
          highlightOnHover
          pagination
          customStyles={tableCustomStyles}
          onRowClicked={(row) => {
            setClickedRow(row);
            editComments(row);
          }}
          persistTableHead={true}
          conditionalRowStyles={conditionalRowStyles}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        />
      </div>
      <DeletePopUpModal func={DeleteComments} />
      <ChangesModal func={check_Validation_Error} setToReset={setStatusFalse} />
    </>
  )
}
export default Comments;