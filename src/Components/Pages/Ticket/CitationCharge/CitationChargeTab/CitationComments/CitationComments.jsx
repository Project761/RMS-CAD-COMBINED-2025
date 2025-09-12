import { useCallback, useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import Select from "react-select";
import { AgencyContext } from '../../../../../../Context/Agency/Index';
import { Comman_changeArrayFormat } from '../../../../../Common/ChangeArrayFormat';
import { fetchPostData } from '../../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../../Utility/Personnel/Validation';
import { tableCustomStyles } from '../../../../../Common/Utility';
import { useSelector } from 'react-redux';

const CitationComments = () => {
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { setChangesStatus } = useContext(AgencyContext);
    const [ArrestChargeCommentsID, setArrestChargeCommentsID] = useState('')
    const [status, setStatus] = useState(false)
    const [loginPinID, setLoginPinID,] = useState('');
    const [editval, setEditval] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [headOfAgency, setHeadOfAgency] = useState([])

    const [value, setValue] = useState({
        'CommentsDoc': '', 'ChargeID': '', 'Comments': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'OfficerID': '', 'ArrestChargeCommentsID': "",
    })

    const [errors, setErrors] = useState({
        'CommentsError': '', 'OfficerIDError': '',
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );


    useEffect(() => {
        if (ArrestChargeCommentsID && status) {
            GetSingleData(ArrestChargeCommentsID)
        }
    }, [ArrestChargeCommentsID])

    const GetSingleData = (ArrestChargeCommentsID) => {
        const val = { 'ArrestChargeCommentsID': ArrestChargeCommentsID }
        fetchPostData('ArrestChargeComments/GetSingleData_ArrestChargeComments', val)
            .then((res) => {
                if (res) { setEditval(res) }
                else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'ArrestChargeCommentsID': ArrestChargeCommentsID, 'OfficerID': editval[0].OfficerID, 'Comments': editval[0].Comments,
                'ModifiedByUserFK': loginPinID, 'CommentsDoc': editval[0].CommentsDoc,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(editval[0].CommentsDoc))));
        } else {
            setValue({
                ...value,
                'CommentsDoc': '', 'ChargeID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '', 'OfficerID': loginPinID, 'ArrestChargeCommentsID': "",
            });
            setEditorState(() => EditorState.createEmpty(),);
        }
    }, [editval])

    const reset = (e) => {
        setValue({
            ...value,
            'CommentsDoc': '', 'ChargeID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '', 'OfficerID': loginPinID, 'ArrestChargeCommentsID': "",
        });
        setErrors({
            ...errors,
            'CommentsError': '', 'OfficerIDError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: RequiredFieldIncident(value.Comments) } })
        }
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value.OfficerID) } })
        }
    }



    // Get Head of Agency
    const Get_Officer_Name = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('DropDown/GetData_HeadOfAgency', val)
            .then(res => {
                if (res) {
                    setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
                } else { setHeadOfAgency([]) }
            })
    };

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
        if (e) {
            setValue({ ...value, [name]: e.value })
            setChangesStatus(true)
        } else {
            setValue({ ...value, [name]: null })
            setChangesStatus(true)
        }
    }

    const handleEditorChange = (state) => {
        setEditorState(state); convertContentToHTML();
    }

    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
    }

    const getValueNarrative = (e) => {
        setValue({ ...value, ['Comments']: e.blocks[0].text })
        setChangesStatus(true)
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
                            value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                            options={headOfAgency}
                            onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                            placeholder="Select.."
                            menuPlacement="top"
                        />
                    </div>
                    <div className="col-12 col-md-6 col-lg-7 text-right mt-2 pt-1">
                        <button type="button" className="btn btn-sm btn-success mr-1 " >New</button>

                        {
                            status ?
                                effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                                    <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                                    : <></> :
                                    <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                                :
                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Save</button>
                                    : <></> :
                                    <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Save</button>
                        }
                    </div>
                </div>
            </div>
            <div className="col-12 mt-3">

                <DataTable
                    dense
                    selectableRowsHighlight
                    highlightOnHover
                    pagination
                    customStyles={tableCustomStyles}

                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
                {/*  */}
            </div>

        </>
    )
}
export default CitationComments;