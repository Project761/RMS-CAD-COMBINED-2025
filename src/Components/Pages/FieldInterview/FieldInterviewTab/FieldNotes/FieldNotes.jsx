import { useContext, useState } from 'react'
import FieldInterviewMainTab from '../../../../Utility/Tab/FieldInterviewMainTab'
import DataTable from 'react-data-table-component';
import { getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Select from "react-select";
import { useSelector } from 'react-redux';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';

const FieldNotes = () => {
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const { setChangesStatus } = useContext(AgencyContext);

    const [status, setStatus] = useState(false);
    const [upDateCount, setUpDateCount] = useState(0);
    const [value, setValue] = useState({
        'PropertyID': '', 'OfficerNameID': '', 'Notes': '', 'CommentsDoc': '', 'CreatedByUserFK': '', 'PropertyNotesID': '',
        'ModifiedByUserFK': '',
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

    const getValueVehicleNotes = (e) => {
        setChangesStatus(true);
        setValue({
            ...value,
            ['Notes']: e.blocks[0].text
        })
    }
    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerNameIDError']: RequiredFieldIncident(value.OfficerNameID) } })
        }
        if (RequiredFieldIncident(value.Notes)) {
            setErrors(prevValues => { return { ...prevValues, ['NotesError']: RequiredFieldIncident(value.Notes) } })
        }
    }
    const [errors, setErrors] = useState({
        'OfficerNameIDError': '', 'NotesError': '',
    })

    const columns = [
        {
            width: '200px',
            name: 'Date/Time',
            selector: (row) => getShowingDateText(row.getShowingDateText),
            sortable: true
        },
        {
            name: 'Property Notes',
            selector: (row) => <>{row?.Notes ? row?.Notes.substring(0, 60) : ''}{row?.Notes?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Officer',
            selector: (row) => row.OfficerName,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 3 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 7 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]



    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }
    const ChangeDropDown = (e, name) => {
        if (e) { setChangesStatus(true); setValue({ ...value, [name]: e.value }) }
        else { setChangesStatus(true); setValue({ ...value, [name]: null }) }
    }
    const setStatusFalse = () => {
        setStatus(false); setUpDateCount(upDateCount + 1);
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
                                            onChange={getValueVehicleNotes}
                                            editorStyle={{ height: '25vh' }}
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
                                        {errors.NotesError !== 'true' ? (
                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NotesError}</span>
                                        ) : null}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="row">
                                                <div className="col-4 col-md-4 col-lg-3 mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Officer Name {errors.OfficerNameIDError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerNameIDError}</span>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-7 mt-2 ">
                                                    <Select
                                                        name='OfficerNameID'
                                                        isClearable
                                                        styles={colourStyles}
                                                        value={''}
                                                        options={''}
                                                        onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                                                        placeholder="Select.."
                                                        menuPlacement="top"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 text-right  bb">
                                    <button type="button" className="btn btn-sm btn-success mr-1 mb-2" onClick={() => { setStatusFalse(); }}>New</button>
                                    {
                                        status ?
                                            effectiveScreenPermission ?
                                                effectiveScreenPermission[0]?.Changeok ?
                                                    <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Update</button>
                                                    :
                                                    <>
                                                    </>
                                                :
                                                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Update</button>
                                            :
                                            effectiveScreenPermission ?
                                                effectiveScreenPermission[0]?.AddOK ?
                                                    <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Save</button>
                                                    :
                                                    <>
                                                    </>
                                                :
                                                <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Save</button>
                                    }
                                </div>
                                <div className="col-12  mt-1" >
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={''}
                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                        selectableRowsHighlight
                                        highlightOnHover
                                        customStyles={tableCustomStyles}
                                        persistTableHead={true}
                                        pagination
                                        paginationPerPage={'100'}
                                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                        showPaginationBottom={100}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default FieldNotes