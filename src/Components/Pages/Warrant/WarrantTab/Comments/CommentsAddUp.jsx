import React, { useContext, useState, useEffect, useCallback } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident, Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const CommentsAddUp = (props) => {

    const { userName, upDateCount, warrantCommentsID, status, modal, setModal, get_CommentsData, commentData, loginPinID, loginAgencyID, warrantID, } = props

    const { get_Warrent_Count } = useContext(AgencyContext)

    const [value, setValue] = useState({
        'CommentsDoc': '',
        'WarrantID': '',
        'WarrantCommentsID': '',
        'ModifiedByUserFK': '',
        'OfficerName': '',
        'CreatedByUserFK': '',
        'OfficerID': null,
        'AdminOfficer': '',
    })

    useEffect(() => {
        setValue({ ...value, 'WarrantID': warrantID, 'OfficerName': userName, 'OfficerID': loginPinID, 'CreatedByUserFK': loginPinID, })
    }, [warrantID, upDateCount]);

    const [errors, setErrors] = useState({
        'CommentsError': '',
    })

    const [editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([])

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        if (loginAgencyID) {
            Get_Officer_Name(loginAgencyID);
        }
    }, [loginAgencyID])

    useEffect(() => {
        if (warrantCommentsID && status) {
            GetSingleData(warrantCommentsID)
        }
    }, [upDateCount, warrantCommentsID])

    const GetSingleData = (warrantCommentsID) => {
        const val = { 'WarrantCommentsID': warrantCommentsID }
        fetchPostData('WarrantComments/GetSingleData_WarrantComments', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval([])
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'OfficerID': editval[0].OfficerID,
                'OfficerName': userName,
                'Comments': editval[0].Comments,
                'ModifiedByUserFK': loginPinID,
                'CommentsDoc': editval[0].CommentsDoc,
                'WarrantCommentsID': editval[0].warrantCommentsID,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(editval[0].CommentsDoc))));
        } else {
            setValue({
                ...value,
                'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'WarrantCommentsID': '',
            });
            setEditorState(() => EditorState.createEmpty(),);
        }
    }, [editval])

    const reset = (e) => {
        setValue({
            ...value,
            'Comments': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'WarrantCommentsID': '',
        });
        setErrors({
            'CommentsError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['officerIdError']: RequiredFieldIncident(value.OfficerID) } })
        }
        if (Space_Allow_with_Trim(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['CommentsError']: Space_Allow_with_Trim(value.Comments) } })
        }
    }
    // Check All Field Format is True Then Submit 
    const { CommentsError } = errors
    useEffect(() => {
        if (CommentsError === 'true') {
            if (status)
                updateComments()
            else submit()
        }
    }, [CommentsError])

    // Get Head of Agency
    const Get_Officer_Name = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val)
            .then(res => {
                if (res) {
                    setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
                } else setHeadOfAgency([])
            })
    };

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

    const handlChanges_Drop = (e, name) => {
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
            ['Comments']: e.blocks[0].text
        })
    }

    const submit = (e) => {
        const result = commentData?.find(item => {
            if (item.Comments) {
                if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                    return item.Comments.toLowerCase() === value.Comments.toLowerCase()
                } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
            }
        });
        if (result) {
            toastifyError('Comments Already Exists')
            setErrors({ ...errors, ['CommentsError']: '' })
        } else {
            AddDeleteUpadate('WarrantComments/Insert_WarrantComments', value)
                .then((res) => {
                    console.log(res)
                    toastifySuccess(res.Message);
                    get_Warrent_Count(warrantID);
                    setModal(false)
                    get_CommentsData(warrantID);
                    setModal(false)
                    reset();
                })
        }
    }

    const updateComments = (e) => {
        const result = commentData?.find(item => {
            if (item.Comments) {
                if (item.warrantCommentsID != value.warrantCommentsID) {
                    if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                        return item.Comments.toLowerCase() === value.Comments.toLowerCase()
                    } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
                }
            }
        });
        if (result) {
            toastifyError('Code Already Exists')
            setErrors({ ...errors, ['CommentsError']: '' })
        } else {
            AddDeleteUpadate('WarrantComments/Update_WarrantComments', value)
                .then((res) => {
                    toastifySuccess(res.Message)
                    get_CommentsData(warrantID);
                    setModal(false)
                    reset();
                })
        }
    }

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

                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CommentsModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <div className="row ">
                                                <div className="col-12 col-md-12 col-lg-12 ">
                                                    <div className="row ">
                                                        <div className="col-12 col-md-12 col-lg-12">
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
                                                            {errors.CommentsError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                             
                                                <div className="col-12 col-md-6 col-lg-3 mt-2 ">
                                                    <div className="dropdown__box">
                                                        <Select
                                                            name='OfficerID'
                                                            styles={colourStyles}
                                                            value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                            options={headOfAgency}
                                                            onChange={(e) => handlChanges_Drop(e, 'OfficerID')}
                                                            placeholder="Select.."
                                                            menuPlacement="top"
                                                            isClearable
                                                        />
                                                        <label htmlFor="">Officer Name</label>
                                                        {errors.officerIdError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.officerIdError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-lg-9 text-right mt-4 pt-2">
                                                    {
                                                        status ?
                                                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2">Update</button>
                                                            :
                                                            <button type="button" onClick={() => { check_Validation_Error(); }} className="btn btn-sm btn-success pl-2">Save</button>
                                                    }
                                                    <button type="button" onClick={() => { closeModal(); }} className="btn btn-sm btn-success ml-2" data-dismiss="modal">Close</button>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>

                    :
                    <>
                    </>
            }
        </>
    )
}

export default CommentsAddUp

