import { useCallback, useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import Select from "react-select";
import { toastifyError, toastifySuccess } from '../../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { RequiredFieldIncident, Space_NotAllow } from '../../../../../Utility/Personnel/Validation';
import { colourStyles, Decrypt_Id_Name, Requiredcolour, tableCustomStyles } from '../../../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../../../Common/ChangesModal';
import { get_AgencyOfficer_Data } from '../../../../../../../redux/actions/DropDownsData';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const Comments = (props) => {

    const { DecChargeId } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const { get_ArrestCharge_Count, setChangesStatus, updateCount, setUpdateCount, changesStatusCount, changesStatus } = useContext(AgencyContext);

    const [commentData, setCommentData] = useState([])
    const [ArrestChargeCommentsID, setArrestChargeCommentsID] = useState('')
    const [upDateCount, setUpDateCount] = useState(0)
    const [status, setStatus] = useState(false)
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [editval, setEditval] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);

    // permissions
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'CommentsDoc': '', 'ChargeID': '', 'Comments': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'OfficerID': null, 'ArrestChargeCommentsID': "",
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(parseInt(localStoreData?.PINID)); setLoginAgencyID(parseInt(localStoreData?.AgencyID));
            dispatch(get_ScreenPermissions_Data("C076", localStoreData?.AgencyID, localStoreData?.PINID));
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
                ...value, 'CreatedByUserFK': loginPinID, 'OfficerID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
                'ArrestChargeCommentsID': "", 'CommentsDoc': '', 'ChargeID': DecChargeId, 'Comments': '', 'ModifiedByUserFK': '',
            });
            if (agencyOfficerDrpData?.length === 0) dispatch(get_AgencyOfficer_Data(loginAgencyID));
            get_CommentsData(DecChargeId);
        }
    }, [loginPinID, agencyOfficerDrpData]);

    const [errors, setErrors] = useState({
        'CommentsError': '', 'OfficerIDError': '',
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

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
            if (editval[0].CommentsDoc?.trim()) {
                setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editval[0].CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));
            }
        } else {
            setValue({
                ...value,
                'CommentsDoc': '', 'ChargeID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '', 'OfficerID': loginPinID, 'ArrestChargeCommentsID': "",
            });
            setEditorState(() => EditorState.createEmpty(),);
        }
    }, [editval, updateCount, changesStatusCount])

    const reset = (e) => {
        setValue({
            ...value,
            'CommentsDoc': '', 'ChargeID': '', 'Comments': '', 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
            'OfficerID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '', 'ArrestChargeCommentsID': "",
        });
        if (editval?.[0]?.CommentsDoc?.length > 0 || editval?.[0]?.OfficerID?.length > 0 || editval?.[0]?.Comments?.length > 0) {
            setUpdateCount(updateCount + 1);
        }
        setStatesChangeStatus(false); setChangesStatus(false); setErrors({ ...errors, 'CommentsError': '', 'OfficerIDError': '', });
        setEditorState(() => EditorState.createEmpty(),);
    }
    const checkId = (id, obj) => {
        const status = obj?.filter((item) => item?.value == id)
        return status?.length > 0
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
        if (event.key === "Escape") { reset() }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else {
            setValue({ ...value, [name]: null })
        }
    }

    const handleEditorChange = (state) => {
        setEditorState(state); convertContentToHTML(state);
    }

    const convertContentToHTML = (state) => {
        let currentContentAsHTML = draftToHtml(convertToRaw(state.getCurrentContent()));
        setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
    }

    const getValueNarrative = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        for (let key in e.blocks) {
            let combinedText = '';
            if (e.blocks[key]?.text) { combinedText += e.blocks[key].text + ' '; }
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
        }
        else {
            const { CommentsDoc, Comments, OfficerID, ArrestChargeCommentsID, ModifiedByUserFK } = value;
            const val = {
                'CommentsDoc': CommentsDoc, 'ChargeID': DecChargeId, 'Comments': Comments, 'CreatedByUserFK': loginPinID,
                'OfficerID': OfficerID, 'ArrestChargeCommentsID': ArrestChargeCommentsID, 'ModifiedByUserFK': ModifiedByUserFK,
            }
            AddDeleteUpadate('ArrestChargeComments/Insert_ArrestChargeComments', val)
                .then((res) => {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); get_ArrestCharge_Count(DecChargeId);
                    get_CommentsData(DecChargeId); reset(); setChangesStatus(false); setStatesChangeStatus(false)
                })
        }
    }

    const updateComments = (e) => {
        const result = commentData?.find(item => {
            if (item.Comments) {
                if (item.ArrestChargeCommentsID != value.ArrestChargeCommentsID) {
                    if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
                        return item.Comments.toLowerCase() === value.Comments.toLowerCase()
                    } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
                }
            }
        });
        if (result) {
            toastifyError('Code Already Exists'); setErrors({ ...errors, ['NarrativeCommentsError']: '' })
        }
        else {
            AddDeleteUpadate('ArrestChargeComments/Update_ArrestChargeComments', value)
                .then((res) => {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); get_CommentsData(DecChargeId); reset(); setStatusFalse(); setChangesStatus(false); setStatesChangeStatus(false)
                })
        }
    }



    const get_CommentsData = (ChargeID) => {
        const val = { 'ChargeID': ChargeID }
        fetchPostData('ArrestChargeComments/GetData_ArrestChargeComments', val)
            .then(res => {
                if (res) { setCommentData(res); }
                else { setCommentData([]); }
            })
    }

    const columns = [
        {
            name: 'Reported By', selector: (row) => row?.Officer_Description, sortable: true
        },
        {
            name: 'Comments', selector: (row) => row?.Comments || '',
            format: (row) => (<>{row?.Comments ? row?.Comments.substring(0, 70) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span to={`#`} onClick={(e) => setArrestChargeCommentsID(row.ArrestChargeCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            : <span to={`#`} onClick={(e) => setArrestChargeCommentsID(row.ArrestChargeCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const editComments = (val) => {
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
            modal.show();
        } else {
            setArrestChargeCommentsID(val.ArrestChargeCommentsID); setStatesChangeStatus(false)
            setUpDateCount(upDateCount + 1); setStatus(true); setErrors(''); GetSingleData(val.ArrestChargeCommentsID)
        }
    }
    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); reset();
    }

    const DeleteComments = () => {
        const val = { 'ArrestChargeCommentsID': ArrestChargeCommentsID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('ArrestChargeComments/Delete_ArrestChargeComments', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); reset(); get_ArrestCharge_Count(DecChargeId); get_CommentsData(DecChargeId); setStatus(false);
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
    const setToReset = () => {
    }
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
                        editorStyle={{ height: '35vh', }}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontFamily', 'list', 'textAlign', 'history'],
                            inline: {
                                inDropdown: false, className: undefined,
                                component: undefined, dropdownClassName: undefined,
                                options: ['bold', 'italic', 'underline', 'monospace',],
                            },

                            list: {
                                inDropdown: false, className: undefined,
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
                            styles={Requiredcolour}
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
                                effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                                    <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success pl-2">Update</button>
                                    : <></> :
                                    <button type="button" onClick={() => check_Validation_Error()} disabled={!statesChangeStatus} className="btn btn-sm btn-success pl-2">Update</button>
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
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? commentData : '' : commentData}
                    selectableRowsHighlight
                    highlightOnHover
                    pagination
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => { setClickedRow(row); editComments(row); }}
                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={DeleteComments} />
            <ChangesModal
                func={check_Validation_Error} setToReset={setToReset} />
        </>
    )
}
export default Comments;