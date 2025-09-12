import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DatePicker from 'react-datepicker';
import { Space_Allow_with_Trim, RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const NarrativeAddUp = (props) => {

  const { loginPinID, warrantID, loginAgencyID, upDateCount, warrantNarrativeID, status, modal, setModal, narrativeData, get_NarrativesData } = props
  const { get_Warrent_Count } = useContext(AgencyContext);
  const [editval, setEditval] = useState();
  const [narrativeDtTm, setNarrativeDtTm] = useState()
  const [headOfAgency, setHeadOfAgency] = useState([])
  const [narrativeTypeList, setNarrativeTypeList] = useState([])

  const [value, setValue] = useState({
    'CommentsDoc': '',
    'NarrativeComments': '',
    'NarrativeDtTm': '',
    'NarrativeTypeID': null,
    'ReportedByID': null,
    'ModifiedByUserFK': '',
    'CreatedByUserFK': '',
    'WarrantID': '',
    'WarrantNarrativeID': '',
  })
  const [errors, setErrors] = useState({
    'NarrativeDtTmError': '', 'ArrestNarrativeIDError': '', 'NarrativeCommentsError': '', 'ReportedByIDError': '',
  })

  useEffect(() => {
    if (warrantID) {
      setValue(pre => { return { ...pre, 'WarrantID': warrantID, 'CreatedByUserFK': loginPinID, 'ReportedByID': loginPinID } })
    }
  }, [warrantID, upDateCount]);

  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  useEffect(() => {
    if (warrantNarrativeID && status) {
      GetSingleData(warrantNarrativeID)
    }
  }, [warrantNarrativeID])

  const GetSingleData = (WarrantNarrativeID) => {
    const val = { 'WarrantNarrativeID': warrantNarrativeID }
    fetchPostData('WarrantNarrative/GetSingleData_WarrantNarrative', val)
      .then((res) => {
        if (res) setEditval(res)
        else setEditval()
      })
  }

  useEffect(() => {
    if (status) {
      setValue({
        ...value,
        "WarrantNarrativeID": warrantNarrativeID,
        'NarrativeDtTm': editval[0].narrativeDtTm ? getShowingDateText(editval[0].narrativeDtTm) : '',
        'NarrativeTypeID': editval[0].NarrativeTypeID,
        'ReportedByID': editval[0].ReportedByID,
        'NarrativeComments': editval[0].NarrativeComments,
        'ModifiedByUserFK': loginPinID,
        'CommentsDoc': editval[0].CommentsDoc,
      })
      setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(editval[0].CommentsDoc))));
  
    } else {
      setValue({
        ...value,
        'NarrativeComments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'WarrantNarrativeID': '',
        'NarrativeDtTm': '', 'NarrativeTypeID': null,
      });
      setEditorState(() => EditorState.createEmpty(),);
   
    }
  }, [editval])

  // Get Head of Agency
  useEffect(() => {
    if (loginAgencyID) {
      Get_Officer_Name(loginAgencyID);
      get_Narrative_Type(loginAgencyID);
    }
  }, [loginAgencyID])

  const Get_Officer_Name = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID
    }
    fetchPostData('DropDown/GetData_HeadOfAgency', val)
      .then(res => {
        if (res) {
          setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
        } else setHeadOfAgency([])
      })
  };

  const get_Narrative_Type = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID
    }
    fetchPostData('NarrativeType/GetDataDropDown_NarrativeType', val)
      .then((res) => {
        if (res) setNarrativeTypeList(Comman_changeArrayFormat(res, 'NarrativeTypeID', 'Description'))
        else setNarrativeTypeList([])
      })
  }

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
      setValue({
        ...value, [name]: e.value
      })
    } else {
      setValue({
        ...value, [name]: null
      })
    }
  }

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  }

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
  }

  const getValueNarrative = (e) => {
    setValue({
      ...value,
      ['NarrativeComments']: e.blocks[0].text
    })
  }

  const reset = (e) => {
    setValue({
      ...value, 'NarrativeTypeID': '', 'NarrativeComments': '', 'NarrativeDtTm': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'WarrantNarrativeID': '',
      'headOfAgencyName': '',
    });
    setErrors({
      ...errors,
      'ReportedByPinError': '', 'NarrativeDtTmError': '', 'ArrestNarrativeIDError': '', 'NarrativeCommentsError': '', 'ReportedByIDError': '',
    });
    setNarrativeDtTm('');
    setEditorState(() => EditorState.createEmpty(),);
  
  }

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.narrativeDtTm)) {
      setErrors(prevValues => { return { ...prevValues, ['NarrativeDtTmError']: RequiredFieldIncident(value.narrativeDtTm) } })
    }
    if (RequiredFieldIncident(value.NarrativeTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['ArrestNarrativeIDError']: RequiredFieldIncident(value.NarrativeTypeID) } })
    }
    if (Space_Allow_with_Trim(value.NarrativeComments)) {
      setErrors(prevValues => { return { ...prevValues, ['NarrativeCommentsError']: Space_Allow_with_Trim(value.NarrativeComments) } })
    }
    if (RequiredFieldIncident(value.ReportedByID)) {
      setErrors(prevValues => { return { ...prevValues, ['ReportedByIDError']: RequiredFieldIncident(value.ReportedByID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { NarrativeDtTmError, ArrestNarrativeIDError, NarrativeCommentsError, ReportedByIDError } = errors

  useEffect(() => {
    if (NarrativeDtTmError === 'true' && ArrestNarrativeIDError === 'true' && NarrativeCommentsError === 'true' && ReportedByIDError === 'true') {
      if (status) updateNarrative()
      else submit()
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
      AddDeleteUpadate('WarrantNarrative/Insert_Narrative', value)
        .then((res) => {
          toastifySuccess(res.Message);
          get_Warrent_Count(warrantID)
          setModal(false)
          get_NarrativesData(warrantID);
          reset();
          setErrors({
            ['NarrativeDtTmError']: '',
          })
        })
    }
  }

  const updateNarrative = (e) => {
    const result = narrativeData?.find(item => {
      if (item.NarrativeComments) {
        if (item.warrantNarrativeID != value.warrantNarrativeID) {
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
      AddDeleteUpadate('WarrantNarrative/Update_WarrantNarrative', value)
        .then((res) => {
          toastifySuccess(res.Message)
          get_NarrativesData(warrantID);
          setModal(false)
          reset();
          setErrors({
            ['NarrativeDtTmError']: '',
          })
        })
    }
  }

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const closeModal = () => {
    reset();
    setModal(false);
  }

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  return (
    <>
      {
        modal ?

          <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="NarrativeModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="m-1 ">
                    <fieldset style={{ border: '1px solid gray' }}>
                      <legend style={{ fontWeight: 'bold' }}>Narrative</legend>
                      <div className="row">
                        <div className="col-12 col-md-12 col-lg-12 ">
                          <div className="row ">
                            <div className="col-12 col-md-12 col-lg-12" style={{ marginTop: '-15px' }}>
                              <div className="text-field">
                                <Editor
                                  editorState={editorState}
                                  onEditorStateChange={handleEditorChange}
                                  wrapperClassName="wrapper-class"
                                  editorClassName="editor-class"
                                  toolbarClassName="toolbar-class"
                                  onChange={getValueNarrative}
                                  editorStyle={{ height: '60vh' }}
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
                              </div>
                              {errors.NarrativeCommentsError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeCommentsError}</span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mt-2">
                          <div className="dropdown__box">
                            <Select
                              name='ReportedByID'
                              isClearable
                              styles={colourStyles}
                              value={headOfAgency?.filter((obj) => obj.value === value?.ReportedByID)}
                              options={headOfAgency}
                              onChange={(e) => ChangeDropDown(e, 'ReportedByID')}
                              placeholder="Select.."
                              menuPlacement="top"
                            />
                            <label htmlFor="">Reported By</label>
                            {errors.ReportedByIDError !== 'true' ? (
                              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByIDError}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mt-1">
                          <div className="dropdown__box">
                            <DatePicker
                              ref={startRef}
                              onKeyDown={onKeyDown}
                              dateFormat="MM/dd/yyyy HH:mm"
                              timeInputLabel
                              isClearable={value?.narrativeDtTm ? true : false}
                              className='requiredColor'
                              name='narrativeDtTm'
                              onChange={(date) => { setNarrativeDtTm(date); setValue({ ...value, ['narrativeDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                              selected={narrativeDtTm}
                              placeholderText={value.narrativeDtTm ? value.narrativeDtTm : 'Select...'}
                              showTimeSelect
                              timeIntervals={1}
                              timeCaption="Time"
                              dropdownMode="select"
                              popperPlacement="top-end"
                              maxDate={new Date()}

                            />
                            <label htmlFor="" className='pt-1'>Date/Time</label>
                            {errors.NarrativeDtTmError !== 'true' ? (
                              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeDtTmError}</span>
                            ) : null}
                          </div>
                          <div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-4 mt-2">
                          <div className="dropdown__box">
                            <Select
                              name='NarrativeTypeID'
                              isClearable
                              styles={colourStyles}
                              value={narrativeTypeList?.filter((obj) => obj.value === value?.NarrativeTypeID)}
                              options={narrativeTypeList}
                              onChange={(e) => ChangeDropDown(e, 'NarrativeTypeID')}
                              placeholder="Select.."
                              menuPlacement="top"
                            />
                            <label htmlFor="">Narrative Type/Report Type</label>
                            {errors.ArrestNarrativeIDError !== 'true' ? (
                              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArrestNarrativeIDError}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-12 text-right mt-3 ">
                          {
                            status ?
                              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                              :
                              <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Save</button>
                          }
                          <button type="button" onClick={() => { closeModal(); }} className="btn btn-sm btn-success ml-2" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </dialog >

          :
          <>
          </>
      }
    </>
  )
}

export default NarrativeAddUp

