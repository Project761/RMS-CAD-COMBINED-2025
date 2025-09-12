import { useState } from 'react'
import FieldInterviewMainTab from '../../../../Utility/Tab/FieldInterviewMainTab'
import DataTable from 'react-data-table-component'
import { getShowingDateText, getShowingMonthDateYear, tableCustomStyles } from '../../../../Common/Utility'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import DatePicker from 'react-datepicker';
import { EditorState } from 'draft-js'
import { convertToHTML } from 'draft-convert'
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation'

const FieldNarrative = () => {
  const [clickedRow, setClickedRow] = useState(null);
  const [status, setStatus] = useState(false);

  const [value, setValue] = useState({
    'CommentsDoc': '',
    'IncidentId': '',
    'NarrativeID': '',
    'Comments': '',
    'ReportedByPINActivityID': null, 'NarrativeTypeID': null,
    'AsOfDate': null,
    'CreatedByUserFK': '',
    'ModifiedByUserFK': '',
  })

  const [errors, setErrors] = useState({
    'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '',
  })
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );
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
      ['Comments']: e.blocks[0].text
    });
  }


  const check_Validation_Error = () => {
    if (RequiredFieldIncident(value.ReportedByPINActivityID)) {
      setErrors(prevValues => { return { ...prevValues, ['ReportedByPinError']: RequiredFieldIncident(value.ReportedByPINActivityID) } })
    }
    if (RequiredFieldIncident(value.AsOfDate)) {
      setErrors(prevValues => { return { ...prevValues, ['AsOfDateError']: RequiredFieldIncident(value.AsOfDate) } })
    }
    if (RequiredFieldIncident(value.NarrativeTypeID)) {
      setErrors(prevValues => { return { ...prevValues, ['NarrativeIDError']: RequiredFieldIncident(value.NarrativeTypeID) } })
    }
    if (RequiredFieldIncident(value.Comments)) {
      setErrors(prevValues => { return { ...prevValues, ['CommentsError']: RequiredFieldIncident(value.Comments) } })
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
  const columns = [
    {
      width: '150px',
      name: 'Date',
      selector: (row) => getShowingDateText(row.AsOfDate),
      sortable: true
    },
    {
      width: '250px',
      name: 'Narrative',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 60) : ''}{row?.Comments?.length > 60 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      width: '230px',
      name: 'Reported By',
      selector: (row) => row.ReportedBy_Description,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row) => row.NarrativeDescription,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 15 }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 15 }}>
          {
            <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
              <i className="fa fa-trash"></i>
            </span>
          }
        </div>
    }
  ]
  const setStatusFalse = (e) => {
    setClickedRow(null); setStatus(false);;
  }

  return (
    <>
      <div className="section-body view_page_design pt-1 p-1 bt" >
        <div className="col-12  inc__tabs">
          <FieldInterviewMainTab />
        </div>
        <div className="dark-row" >
          <div className="col-12 col-sm-12">
            <div className="card Agency incident-card ">
              <div className="card-body" >
                <div className="row " style={{ marginTop: '-16px', marginLeft: '-18px' }}>
                  <div className="col-12 col-md-12 col-lg-12 ">
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
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-2">
                          <label htmlFor="" className='new-label'>Officer Name</label>
                        </div>
                        <div className="col-7 col-md-7 col-lg-7 mt-2 ">
                          <Select
                            name='ReportedByPINActivityID'
                            isClearable
                            styles={colourStyles}
                            onChange={(e) => ChangeDropDown(e, 'ReportedByPINActivityID')}
                            placeholder="Select.."
                            menuPlacement="top"
                          />
                          {errors.ReportedByPinError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByPinError}</span>
                          ) : null}
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-2">
                          <label htmlFor="" className='new-label'>Report Type</label>
                        </div>
                        <div className="col-7 col-md-7 col-lg-7 mt-2 ">
                          <Select
                            name='NarrativeTypeID'
                            isClearable
                            styles={colourStyles}
                            onChange={(e) => ChangeDropDown(e, 'NarrativeTypeID')}
                            placeholder="Select.."
                            menuPlacement="top"
                          />
                          {errors.NarrativeIDError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeIDError}</span>
                          ) : null}
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-2">
                          <label htmlFor="" className='new-label'>Approving Supervisior</label>
                        </div>
                        <div className="col-7 col-md-7 col-lg-7 mt-2 text-field ">
                          <input type="text" className='readonlyColor' name='status' disabled readOnly />
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="row">
                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-2">
                          <label htmlFor="" className='new-label'>Date/Time</label>
                        </div>
                        <div className="col-7 col-md-7 col-lg-7 mt-2 ">
                          <DatePicker
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeInputLabel
                            isClearable={value?.AsOfDate ? true : false}
                            className='requiredColor'
                            name='AsOfDate'
                            onChange={(date) => { setValue({ ...value, ['AsOfDate']: date ? getShowingMonthDateYear(date) : null }) }}
                            selected={value?.AsOfDate && new Date(value?.AsOfDate)}
                            placeholderText={'Select...'}
                            showTimeSelect
                            timeIntervals={1}
                            timeCaption="Time"
                            popperPlacement="top-end"
                            maxDate={new Date()}
                            autoComplete="Off"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            onKeyDown={(e) => {
                              if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ')) {
                                e?.preventDefault();
                              }
                            }}
                          />
                          {errors.AsOfDateError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AsOfDateError}</span>
                          ) : null}
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-2 pt-2">
                          <label htmlFor="" className='new-label'>Status</label>
                        </div>
                        <div className="col-7 col-md-7 col-lg-7 mt-2 text-field ">
                          <input type="text" className='readonlyColor' name='status' disabled readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-12 col-lg-12 text-right  bb">
                  <button type="button" className="btn btn-sm btn-success mr-1 mb-2" onClick={() => { setStatusFalse(); }}>New</button>
                  {
                    status ?
                      <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Update</button>
                      :
                      <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Save</button>
                  }
                </div>
                <div className="col-12  mt-1" >
                  <DataTable
                    showHeader={true}
                    persistTableHead={true}
                    dense
                    columns={columns}
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    pagination
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    showPaginationBottom={100}
                    fixedHeaderScrollHeight='120px'
                    fixedHeader
                  />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default FieldNarrative