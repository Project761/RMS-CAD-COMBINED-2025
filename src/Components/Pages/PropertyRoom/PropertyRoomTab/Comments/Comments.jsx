import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import { Editor } from 'react-draft-wysiwyg';
import DataTable from 'react-data-table-component';
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { RequiredFieldIncident, Space_NotAllow } from '../../../Utility/Personnel/Validation';
import { convertToHTML } from 'draft-convert';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';

const Comments = (props) => {


  const { DecProRomId } = props

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

  const { setChangesStatus } = useContext(AgencyContext);
  const [commentData, setCommentData] = useState([])
  const [PropertyRoomCommentsID, setPropertyRoomCommentsID] = useState('')
  const [delCommentsID, setDelCommentsID] = useState('')
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [PropertyRoomID, setPropertyRoomID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [editval, setEditval] = useState();
  const [clickedRow, setClickedRow] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);


  const [value, setValue] = useState({
    'CommentsDoc': '', 'PropertyRoomID': '', 'Comments': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '',
    'OfficerID': '', 'AdminOfficer': '', 'PropertyRoomCommentsID': "",
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(parseInt(localStoreData?.AgencyID)); setLoginPinID(parseInt(localStoreData?.PINID));
      // dispatch(get_ScreenPermissions_Data("A068", localStoreData?.AgencyID, localStoreData?.PINID));
      const savedSelectedRows = JSON.parse(sessionStorage.getItem('selectedRows')) || [];
      const propertyRoomID = savedSelectedRows[0].PropertyRoomID;
      console.log(propertyRoomID);
      setPropertyRoomID(propertyRoomID);

    }
  }, [localStoreData]);

  console.log(PropertyRoomID)


  useEffect(() => {
    if (loginAgencyID || loginPinID) {
      setValue({
        ...value,
        'CommentsDoc': '', 'PropertyRoomID': PropertyRoomID, 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
        'OfficerID': loginPinID, 'AdminOfficer': '', 'PropertyRoomCommentsID': "",
      });
      if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)) }
      if (commentData?.length === 0) { get_CommentsData(DecProRomId); }
    }
  }, [loginAgencyID, loginPinID])

  useEffect(() => {
    if (DecProRomId) {
      setPropertyRoomID(DecProRomId);
    }
  }, [DecProRomId]);

  const [errors, setErrors] = useState({
    'CommentsError': '', 'OfficerIDError': '',
  })

  useEffect(() => {
    if (PropertyRoomCommentsID && status) {
      GetSingleData(PropertyRoomCommentsID)
    }
  }, [upDateCount, PropertyRoomCommentsID])

  const GetSingleData = (PropertyRoomCommentsID) => {
    const val = { 'PropertyRoomCommentsID': PropertyRoomCommentsID }
    fetchPostData('PropertyRoomComments/GetSingleData_PropertyRoomComments', val)
      .then((res) => {
        if (res) { setEditval(res) }
        else { setEditval([]) }
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        'PropertyRoomCommentsID': PropertyRoomCommentsID, 'OfficerID': editval[0].OfficerID, 'Comments': editval[0].Comments, 'ModifiedByUserFK': loginPinID,
        'CommentsDoc': editval[0].CommentsDoc,
      })
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(editval[0].CommentsDoc))));

    } else {
      setValue({
        ...value,
        'CommentsDoc': '', 'PropertyRoomID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
        'OfficerID': loginPinID, 'AdminOfficer': '', 'PropertyRoomCommentsID': "",
      })
      setEditorState(EditorState.createEmpty());
      // setEditorState(() => EditorState.createEmpty(),);
    }
  }, [editval])

  const reset = (e) => {
    setValue({
      ...value,
      'CommentsDoc': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
      'OfficerID': loginPinID, 'AdminOfficer': '', 'PropertyRoomCommentsID': "",
    })
    if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)) }
    setErrors({ ...errors, 'CommentsError': '', 'OfficerIDError': '', });
    setEditorState(() => EditorState.createEmpty(),); setStatesChangeStatus(false);
  }

  const check_Validation_Error = (e) => {
    if (Space_NotAllow(value.Comments)) {
      setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_NotAllow(value.Comments) } })
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

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({ ...value, [name]: e.value })
    } else {
      setValue({ ...value, [name]: null })
    }
  }

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML(state);
  }

  const convertContentToHTML = (state) => {
    let currentContentAsHTML = convertToHTML(state.getCurrentContent());
    setValue({ ...value, CommentsDoc: currentContentAsHTML });
  };

  const getValueNarrative = (e) => {
    // setValue({ ...value, ['Comments']: e.blocks[0].text })
    setStatesChangeStatus(true);
    for (let key in e.blocks) {
      let combinedText = '';
      if (e.blocks[key]?.text) {
        combinedText += e.blocks[key].text + ' ';
      }
      setValue({ ...value, ['Comments']: combinedText })
    }
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
      toastifyError('Comments Already Exists')
      setErrors({ ...errors, ['CommentsError']: '', })
    } else {
      const { CommentsDoc, PropertyRoomID, Comments, CreatedByUserFK,
        OfficerID, AdminOfficer, PropertyRoomCommentsID, ModifiedByUserFK,
      } = value;
      const val = {
        'CommentsDoc': CommentsDoc, 'PropertyRoomID': PropertyRoomID, 'Comments': Comments, 'CreatedByUserFK': loginPinID,
        'OfficerID': OfficerID, 'AdminOfficer': AdminOfficer, 'PropertyRoomCommentsID': PropertyRoomCommentsID, 'ModifiedByUserFK': '',
      }

      console.log(PropertyRoomID);
      AddDeleteUpadate('PropertyRoomComments/Insert_PropertyRoomComments', val)
        .then((res) => {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message); setStatesChangeStatus(false);
          // setChangesStatus(false);
          get_CommentsData();
          reset();
        })
    }
  }

  const updateComments = (e) => {
    const result = commentData?.find(item => {
      if (item.Comments) {
        if (item.PropertyRoomCommentsID != value.PropertyRoomCommentsID) {
          if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
            return item.Comments.toLowerCase() === value.Comments.toLowerCase()
          } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
        }
      }
    });
    if (result) {
      toastifyError('Code Already Exists')
      setErrors({ ...errors, ['NarrativeCommentsError']: '' })
    } else {
      // const val = {
      //   'AdminOfficer': AdminOfficer, 'Comments': Comments, 'CommentsDoc': CommentsDoc , 'CreatedByUserFK' : CreatedByUserFK , 'ModifiedByUserFK' : ModifiedByUserFK, 'OfficerID': OfficerID ,
      //   'PropertyRoomCommentsID' : PropertyRoomCommentsID
      // };
      AddDeleteUpadate('PropertyRoomComments/Update_PropertyRoomComments', value)
        .then((res) => {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message); setStatesChangeStatus(false);
          // setChangesStatus(false);
          get_CommentsData(); setStatusFalse();
        })
    }
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

  const get_CommentsData = () => {

    const val = { 'PropertyRoomID': PropertyRoomID }
    fetchPostData('PropertyRoomComments/GetData_PropertyRoomComments', val)
      .then(res => {
        if (res) {
          setCommentData(res);
        } else {
          setCommentData([]);
        }
      })
  }
  console.log(PropertyRoomID)
  console.log(DecProRomId)
  const columns = [
    {
      name: 'Property No',
      selector: (row) => row.PropertyNumber,
      sortable: true,
    },
    {
      name: 'Officer Name',
      selector: (row) => row.Officer_Description,
      sortable: true,
    },
    {
      name: 'Notes',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 60) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 10 }}>
          <span to={`#`} onClick={(e) => setDelCommentsID(row.PropertyRoomCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
            <i className="fa fa-trash"></i>
          </span>
        </div>
    }
  ]

  const editComments = (val) => {
    setStatesChangeStatus(false);
    setPropertyRoomCommentsID(val.PropertyRoomCommentsID);
    setUpDateCount(upDateCount + 1);
    setStatus(true); setErrors('')
  }

  const setStatusFalse = (e) => {
    setClickedRow(null); setPropertyRoomCommentsID(''); setDelCommentsID(''); setStatesChangeStatus(false);
    setStatus(false);
    reset();
  }

  const DeleteComments = () => {
    const val = { 'PropertyRoomCommentsID': delCommentsID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('PropertyRoomComments/Delete_PropertyRoomComments', val).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_CommentsData(); setStatus(false);
        if (delCommentsID == PropertyRoomCommentsID) { setStatusFalse(); setStatesChangeStatus(false); }
      } else console.log("Somthing Wrong");
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.PropertyRoomCommentsID == PropertyRoomCommentsID,
      style: {
        backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer',
      },
    },
  ];

  console.log(commentData)

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
                <button type="button" disabled={!statesChangeStatus} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                :
                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success pl-2">Save</button>
            }

          </div>
        </div>
      </div>
      <div className="col-12 mt-3">
        {/* {
          loder ? */}
        <DataTable
          dense
          columns={columns}
          data={commentData}
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
          noDataComponent={"There are no data to display"}
          paginationPerPage={'100'}
          paginationRowsPerPageOptions={[100, 150, 200, 500]}
          showPaginationBottom={100}
          fixedHeaderScrollHeight='260px'
          fixedHeader
        />
        {/* :/ */}
        {/* <Loader /> */}
      </div>
      <DeletePopUpModal func={DeleteComments} />
      {/* <ChangesModal func={check_Validation_Error} setToReset={setStatusFalse} /> */}

      {/* <CommentsAddUp {...{ loginPinID, arrestID, loginAgencyID, upDateCount, arrestCommentsID, status, modal, setModal, get_CommentsData, commentData }} /> */}
    </>
  )
}
export default Comments;