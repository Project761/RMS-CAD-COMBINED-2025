import React, { useState, useCallback, useEffect, useContext } from 'react'
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Select from "react-select";
import { EditorState, ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const VehicleNotesAddUp = (props) => {

    const { loginPinID, loginAgencyID, upDateCount, vehicleID, vehicleNotesID, status, modal, setModal, get_VehicleNotesData } = props

    const { get_vehicle_Count } = useContext(AgencyContext)

    const [editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([]);

    const [value, setValue] = useState({
        'VehicleID': '',
        'MasterPropertyID': '',
        'OfficerNameID': null,
        'Notes': '',
        'CreatedByUserFK': '',
        'VehicleNotesID': '', 'ModifiedByUserFK': '',
        'CommentsDoc': '',
    })

    useEffect(() => {
        setValue({ ...value, 'VehicleID': vehicleID, 'CreatedByUserFK': loginPinID, })
    }, [vehicleID, upDateCount]);

    const [errors, setErrors] = useState({
        'OfficerNameIDError': '', 'NotesError': '',
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        if (loginAgencyID) {
            get_Head_Of_Agency(loginAgencyID);
        }
    }, [loginAgencyID])

    useEffect(() => {
        if (vehicleNotesID && status) {
            GetSingleData(vehicleNotesID)
        }
    }, [vehicleNotesID, upDateCount])

    const GetSingleData = (vehicleNotesID) => {
        const val = { 'VehicleNotesID': vehicleNotesID }
        fetchPostData('VehicleNotes/GetSingleData_VehicleNotes', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'VehicleNotesID': vehicleNotesID, 'OfficerNameID': editval[0].OfficerNameID, 'Notes': editval[0].Notes,
                'ModifiedByUserFK': loginPinID,
                'CommentsDoc': editval[0].CommentsDoc,
            })
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(editval[0]?.CommentsDoc))));

        } else {
            setValue({
                ...value,
                'OfficerNameID': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'VehicleNotesID': '', 'Notes': '',
            });
            setEditorState(() => EditorState.createEmpty(),);
        }
    }, [editval])

    const reset = (e) => {
        setValue({
            ...value,
            'OfficerNameID': '', 'Notes': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'VehicleNotesID': '', 'OfficerName': '',
        });
        setErrors({
            'OfficerNameIDError': '', 'NotesError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerNameIDError']: RequiredFieldIncident(value.OfficerNameID) } })
        }
        if (RequiredFieldIncident(value.Notes)) {
            setErrors(prevValues => { return { ...prevValues, ['NotesError']: RequiredFieldIncident(value.Notes) } })
        }
    }

    const { OfficerNameIDError, NotesError } = errors

    useEffect(() => {
        if (OfficerNameIDError === 'true' && NotesError === 'true') {
            if (status) update_VehicleNotes()
            else Save_VehicleNotes()
        }
    }, [OfficerNameIDError, NotesError])

    const get_Head_Of_Agency = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])
            }
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

    const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();
    }

    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
    }

    const getValueVehicleNotes = (e) => {
        setValue({
            ...value,
            ['Notes']: e.blocks[0].text
        })
    }

    const Save_VehicleNotes = (e) => {
        AddDeleteUpadate('VehicleNotes/Insert_VehicleNotes', value)
            .then((res) => {
                get_VehicleNotesData(vehicleID);
                get_vehicle_Count(vehicleID)
                toastifySuccess(res.Message);
                setModal(false)
                reset();
            })
    }

    const update_VehicleNotes = (e) => {
        AddDeleteUpadate('VehicleNotes/Update_VehicleNotes', value)
            .then((res) => {
                toastifySuccess(res.Message)
                get_VehicleNotesData(vehicleID);
                setModal(false)
                reset();
            })
    }

    const closeModal = () => {
        reset();
        setModal(false);
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

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

    return (
        <>
            {
                modal ?

                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="VehicleNotes" tabIndex="-1" aria-hidden="true" data-backdrop="false">
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
                                                                    onChange={getValueVehicleNotes}
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
                                                            {errors.NotesError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NotesError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6 col-lg-4 pt-2 dropdown__box">
                                                    <Select
                                                        name='OfficerNameID'
                                                        styles={colourStyles}
                                                        menuPlacement='top'
                                                        value={headOfAgency?.filter((obj) => obj.value === value?.OfficerNameID)}
                                                        isClearable
                                                        options={headOfAgency}
                                                        onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                                                        placeholder="Select..."
                                                    />
                                                    <label htmlFor="" className='pt-2'>Officer</label>
                                                    {errors.OfficerNameIDError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerNameIDError}</span>
                                                    ) : null}
                                                </div>
                                                <div className="col-12 col-md-6 col-lg-8 text-right  mt-3 pt-1">
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
                    </dialog>

                    :
                    <>
                    </>
            }
        </>
    )
}

export default VehicleNotesAddUp

