import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Decrypt_Id_Name, DecryptedList, base64ToString, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Editor } from 'react-draft-wysiwyg';
import Select from "react-select";
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import PropListng from '../../../ShowAllList/PropListng';
import ChangesModal from '../../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';

const PropertyNotes = (props) => {

    const { ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails = false } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const { get_Property_Count, setChangesStatus } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');

    const [status, setStatus] = useState(false);
    const [loder, setLoder] = useState(false);
    const [vehicleNotesData, setVehicleNotesData] = useState([]);
    const [PropertyNotesID, setPropertyNotesID] = useState('');
    const [upDateCount, setUpDateCount] = useState(0);
    const [loginAgencyID, setLoginAgencyID] = useState('')
    const [PropertyID, setPropertyID] = useState('')
    const [masterPropertyID, setMasterPropertyID] = useState('')
    const [loginPinID, setLoginPinID] = useState('');
    const [editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    const [value, setValue] = useState({
        'PropertyID': '', 'OfficerNameID': '', 'Notes': '',
        'CreateDtTmNotes': '', 'CommentsDoc': '', 'CreatedByUserFK': '', 'PropertyNotesID': '',
        'ModifiedByUserFK': '', 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, 'MasterPropertyID': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }

    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("P061", localStoreData?.AgencyID, localStoreData?.PINID));
            get_Head_Of_Agency(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecPropID || DecMPropID) {
            get_PropertyNotesData(DecPropID, DecMPropID);
            setPropertyID(DecPropID);
            setMasterPropertyID(DecMPropID)
        }
    }, [DecPropID, DecMPropID]);

    useEffect(() => {
        if (loginPinID) {
            setValue({
                ...value,
                'PropertyID': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
                'OfficerNameID': '', 'Notes': '', 'CommentsDoc': '', 'PropertyNotesID': '', 'CreateDtTmNotes': '',
            });
        }
    }, [loginPinID]);

    const get_PropertyNotesData = (PropertyID, masterPropertyID) => {
        const val = { 'PropertyID': PropertyID, 'MasterPropertyID': masterPropertyID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('PropertyNotes/GetData_PropertyNotes', val)
            .then(res => {
                if (res) {
                    console.log(res)
                    setVehicleNotesData(res); setLoder(true)
                } else {
                    setVehicleNotesData([]); setLoder(true)
                }
            })
    }

    const [errors, setErrors] = useState({

        'NotesError': '',
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );


    const GetSingleData = (PropertyNotesID) => {
        const val = { 'PropertyNotesID': PropertyNotesID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('PropertyNotes/GetSingleData_PropertyNotes', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'PropertyNotesID': PropertyNotesID, 'OfficerNameID': editval[0].OfficerNameID, 'Notes': editval[0].Notes,
                'ModifiedByUserFK': loginPinID, 'PropertyID': DecPropID, 'MasterPropertyID': DecMPropID, 'CommentsDoc': editval[0].CommentsDoc, 'CreateDtTmNotes': editval[0].CreateDtTmNotes ? getShowingDateText(editval[0].CreateDtTmNotes) : null,

            });
            if (editval[0].CommentsDoc?.trim()) {


                setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editval[0].CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));


            }
        } else {
            setValue({
                ...value,
                'CommentsDoc': '', 'ModifiedByUserFK': '', 'PropertyNotesID': '', 'Notes': '', 'CreateDtTmNotes': '',
            });
            setEditorState(() => EditorState.createEmpty(),);
        }
    }, [editval])

    const reset = (e) => {
        setValue({
            ...value,
            'OfficerNameID': '', 'Notes': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'PropertyNotesID': '', 'OfficerName': '', 'CreateDtTmNotes': '',
        });
        setErrors({
            ...errors,

            'NotesError': '',
        });
        setEditorState(() => EditorState.createEmpty(),);
    }

    const check_Validation_Error = (e) => {

        if (RequiredFieldIncident(value.Notes?.trim())) {
            setErrors(prevValues => { return { ...prevValues, ['NotesError']: RequiredFieldIncident(value.Notes?.trim()) } })
        }
    }
    const handleKeyDown = (e) => {
        const cursorPosition = e.target.selectionStart;
        if (e.key === " " && cursorPosition === 0) {
            e.preventDefault();
        }
        if (e.key === "Enter" && cursorPosition === 0) {
            e.preventDefault();
        }
    };

    // Check All Field Format is True Then Save_VehicleNotes 
    const { NotesError } = errors

    useEffect(() => {
        if (NotesError === 'true') {
            if (status) update_VehicleNotes()
            else Save_VehicleNotes()
        }
    }, [NotesError])

    // Get Head of Agency
    const get_Head_Of_Agency = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, IncidentID: DecIncID }
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
        convertContentToHTML(state);
    }

    const convertContentToHTML = (state) => {

        let currentContentAsHTML = draftToHtml(convertToRaw(state.getCurrentContent()));

        setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
    }


    const getValueVehicleNotes = (e) => {
        setChangesStatus(true);
        setStatesChangeStatus(true);

        let combinedText = '';

        for (let key in e.blocks) {
            if (e.blocks[key]?.text) {
                combinedText += e.blocks[key].text + ' ';
            }
        }

        setValue({ ...value, ['Notes']: combinedText.trim() });
    };

    const Save_VehicleNotes = (e) => {
        const { PropertyID, CreatedByUserFK, ModifiedByUserFK, OfficerNameID, Notes, CommentsDoc, PropertyNotesID, IsMaster, CreateDtTmNotes } = value;
        const val = {
            'PropertyID': DecPropID,
            'MasterPropertyID': masterPropertyID,
            'CreatedByUserFK': loginPinID,
            'ModifiedByUserFK': '',
            'IsMaster': IsMaster,
            'OfficerNameID': OfficerNameID,
            'Notes': Notes,
            'CommentsDoc': CommentsDoc,
            'PropertyNotesID': PropertyNotesID,
            'CreateDtTmNotes': getShowingDateText(new Date()),
        };

        AddDeleteUpadate('PropertyNotes/Insert_PropertyNotes', val)
            .then((res) => {
                console.log(res);
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setChangesStatus(false);
                setStatesChangeStatus(false);
                get_PropertyNotesData(DecPropID, DecMPropID);
                get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false);
                reset();
            });
    }


    const update_VehicleNotes = (e) => {
        const { PropertyID, CreatedByUserFK, ModifiedByUserFK, OfficerNameID, Notes, CommentsDoc, PropertyNotesID, IsMaster, CreateDtTmNotes } = value;
        const val = {
            'PropertyID': DecPropID,
            'MasterPropertyID': masterPropertyID,
            'CreatedByUserFK': loginPinID,
            'ModifiedByUserFK': '',
            'IsMaster': IsMaster,
            'OfficerNameID': OfficerNameID,
            'Notes': Notes,
            'CommentsDoc': CommentsDoc,
            'PropertyNotesID': PropertyNotesID,
            'CreateDtTmNotes': getShowingDateText(new Date()),
        };
        AddDeleteUpadate('PropertyNotes/Update_PropertyNotes', val)
            .then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setChangesStatus(false); setStatesChangeStatus(false);
                get_PropertyNotesData(DecPropID, DecMPropID);
                reset();
                setStatusFalse();
            })
    }
    const DeleteVehicleNotes = () => {
        const val = { 'PropertyNotesID': PropertyNotesID, 'MasterPropertyID': masterPropertyID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('PropertyNotes/Delete_PropertyNotes', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false)
                get_PropertyNotesData(DecPropID, DecMPropID);
                reset(); setStatusFalse();
            } else console.log("Somthing Wrong");
        })
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true)
        if (e) { setChangesStatus(true); setValue({ ...value, [name]: e.value }) }
        else { setChangesStatus(true); setValue({ ...value, [name]: null }) }
    }

    const columns = [
        {
            name: 'Date/Time',
            selector: (row) => row.CreateDtTmNotes ? getShowingDateText(row.CreateDtTmNotes) : " ",

            sortable: true
        },
        {
            name: 'Property Notes',
            selector: (row) => row?.Notes || '',
            format: (row) => (
                <>{row?.Notes ? row?.Notes.substring(0, 70) : ''}{row?.Notes?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 3 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 7 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={(e) => setPropertyNotesID(row.PropertyNotesID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={(e) => setPropertyNotesID(row.PropertyNotesID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]




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

    const editVehicleNotes = (val) => {
        setStatus(true);
        GetSingleData(val.PropertyNotesID)
        setStatesChangeStatus(false);
        setPropertyNotesID(val.PropertyNotesID);
        setUpDateCount(upDateCount + 1);
        get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false);
        setErrors({});
    }

    const setStatusFalse = (e, row) => {
        setStatus(false); reset(); setUpDateCount(upDateCount + 1); setClickedRow();
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
    const handleNotesChange = (e) => {
        setValue(e.target.value); // Capture all lines of notes
    };
    return (
        <>
            <PropListng {...{ ListData }} />
            <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">
                <Editor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    onChange={getValueVehicleNotes}

                    editorStyle={{ height: '35vh', }}
                    toolbar={{
                        options: ['inline', 'blockType', 'fontFamily', 'list', 'textAlign', 'history'],
                        inline: {
                            inDropdown: false,
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['bold', 'italic', 'underline', 'monospace',],
                        },
                        list: {
                            inDropdown: false,
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['unordered', 'ordered',],
                        },
                        textAlign: {
                            inDropdown: false,
                            className: undefined,
                            component: undefined,
                            dropdownClassName: undefined,
                            options: ['left', 'center', 'right', 'justify'],
                        },
                    }}
                />
                {errors.NotesError !== 'true' ? (
                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NotesError}</span>
                ) : null}
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-6">
                        <div className="row">

                        </div>
                    </div>
                    {!isViewEventDetails &&
                        <div className="col-12 col-md-12 col-lg-6 text-right mt-3 bb">
                            <button type="button" className="btn btn-sm btn-success mr-1 mb-2" onClick={() => { setStatusFalse(); }}>New</button>
                            {
                                status ?
                                    effectiveScreenPermission ?
                                        effectiveScreenPermission[0]?.Changeok ?
                                            <button type="button" disabled={!statesChangeStatus} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Update</button>
                                            :
                                            <>
                                            </>
                                        :
                                        <button type="button" disabled={!statesChangeStatus} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 mb-2">Update</button>
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
                    }
                </div>
            </div>
            <div className="col-12 px-0 modal-table" >
                <DataTable
                    dense
                    columns={columns}

                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? vehicleNotesData : [] : vehicleNotesData}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    selectableRowsHighlight
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        setClickedRow(row);
                        editVehicleNotes(row);
                    }}
                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    pagination
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    showPaginationBottom={100}
                    fixedHeader
                    fixedHeaderScrollHeight='120px'
                />
            </div>
            <ChangesModal func={check_Validation_Error} setToReset={setStatusFalse} />
            <DeletePopUpModal func={DeleteVehicleNotes} />
        </>
    )
}
export default PropertyNotes