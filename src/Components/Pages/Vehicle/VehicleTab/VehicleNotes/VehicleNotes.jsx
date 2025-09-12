import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { Editor } from 'react-draft-wysiwyg';
import Select from "react-select";
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { useSelector, useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import VehicleListing from '../../../ShowAllList/VehicleListing';
import ChangesModal from '../../../../Common/ChangesModal';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { MasterVehicle_ID } from '../../../../../redux/actionTypes';


const VehicleNotes = (props) => {

    const { ListData, DecVehId, DecMVehId, DecIncID, isViewEventDetails = false } = props
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const { get_vehicle_Count, setChangesStatus, changesStatusCount, changesStatus } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstVehicle = query?.get('page');

    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [loder, setLoder] = useState(false);
    const [vehicleNotesData, setVehicleNotesData] = useState([]);
    const [VehicleNotesID, setVehicleNotesID] = useState('');
    const [delVehicleNotesID, setDelVehicleNotesID] = useState('');
    const [upDateCount, setUpDateCount] = useState(0);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [loginAgencyID, setLoginAgencyID] = useState('')
    const [vehicleID, setVehicleID] = useState('')
    const [loginPinID, setLoginPinID] = useState('');
    const [editval, setEditval] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [masterPropertyID, setMasterPropertyID] = useState('');

    const [value, setValue] = useState({
        'PropertyID': '', 'MasterPropertyID': '', 'PropertyID': '', 'OfficerNameID': null, 'Notes': '', 'CreatedByUserFK': '', 'VehicleNotesID': '', 'ModifiedByUserFK': '', 'CommentsDoc': '', 'CreateDtTmNotes': '',
        'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false,
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(parseInt(localStoreData?.PINID));
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID); get_Head_Of_Agency(localStoreData?.AgencyID);
            setValue({ ...value, 'OfficerNameID': localStoreData?.PINID });
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecVehId || DecMVehId) {
            setValue({
                ...value,
                'PropertyID': DecVehId, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '', 'OfficerNameID': '', 'Notes': '', 'CommentsDoc': '', 'VehicleNotesID': '', 'CreateDtTmNotes': '',
            })
            get_vehicle_Count(DecVehId, DecMVehId); get_VehicleNotesData(DecVehId); setVehicleID(DecVehId); setMasterPropertyID(DecMVehId);

        }
    }, [DecVehId, DecMVehId]);

    const get_VehicleNotesData = (PropertyID) => {
        const val = { "PropertyID": PropertyID, 'IsMaster': MstVehicle === false, }
        const val1 = { "PropertyID": PropertyID, 'IsMaster': true, MasterPropertyID: DecMVehId }
        fetchPostData('VehicleNotes/GetData_VehicleNotes', MstVehicle === "MST-Vehicle-Dash" ? val1 : val).then(res => {
            if (res) {
                setVehicleNotesData(res); setLoder(true)
            } else {
                setVehicleNotesData([]); setLoder(true)
            }
        })
    }

    const getScreenPermision = (loginAgencyID, loginPinID) => {
        ScreenPermision("V082", loginAgencyID, loginPinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission()
            }
        });
    }

    const [errors, setErrors] = useState({
        'OfficerNameIDError': '', 'NotesError': '',
    })

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        if (loginAgencyID) {
            get_Head_Of_Agency(loginAgencyID);
            setValue({ ...value, 'OfficerNameID': '' })
        }
    }, [loginAgencyID])

    useEffect(() => {
        if (VehicleNotesID && status) { GetSingleData(VehicleNotesID) }
    }, [DecVehId, DecMVehId, upDateCount])

    const GetSingleData = (VehicleNotesID) => {
        const val = { 'VehicleNotesID': VehicleNotesID, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false, }
        fetchPostData('VehicleNotes/GetSingleData_VehicleNotes', val).then((res) => {
            if (res) setEditval(res)
            else setEditval()
        })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value, 'VehicleNotesID': VehicleNotesID, 'OfficerNameID': editval[0].OfficerNameID, 'Notes': editval[0].Notes, 'ModifiedByUserFK': loginPinID,
                'CommentsDoc': editval[0].CommentsDoc, 'CreateDtTmNotes': editval[0].CreateDtTmNotes ? getShowingDateText(editval[0].CreateDtTmNotes) : null,
            });
            dispatch({ type: MasterVehicle_ID, payload: editval[0]?.MasterPropertyID });
            if (editval[0].CommentsDoc?.trim()) {
                setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editval[0].CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));
            }
        } else {
            setValue({
                ...value, 'OfficerNameID': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'VehicleNotesID': '', 'Notes': '', 'CreateDtTmNotes': '',
            });
            setEditorState(() => EditorState.createEmpty(),);
        }
    }, [editval, changesStatusCount])

    const reset = (e) => {
        setValue({ ...value, 'OfficerNameID': '', 'Notes': '', 'CommentsDoc': '', 'ModifiedByUserFK': '', 'VehicleNotesID': '', 'OfficerName': '', 'CreateDtTmNotes': '', }); setErrors({ ...errors, 'OfficerNameIDError': '', 'NotesError': '', });
        setVehicleNotesID(''); setEditorState(() => EditorState.createEmpty(),); setStatesChangeStatus(false);
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerNameIDError']: RequiredFieldIncident(value.OfficerNameID) } })
        }
        if (RequiredFieldIncident(value.Notes?.trim())) {
            setErrors(prevValues => { return { ...prevValues, ['NotesError']: RequiredFieldIncident(value.Notes?.trim()) } })
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
        const val = { AgencyID: loginAgencyID, IncidentID: 0 }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            } else {
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
        setEditorState(state); convertContentToHTML(state);
    }

    const convertContentToHTML = (state) => {
        let currentContentAsHTML = draftToHtml(convertToRaw(state.getCurrentContent()));
        setValue({ ...value, 'CommentsDoc': currentContentAsHTML })
    }

    const getValueVehicleNotes = (e) => {
        setStatesChangeStatus(true); setChangesStatus(true)
        for (let key in e.blocks) {
            let combinedText = '';
            if (e.blocks[key]?.text) {
                combinedText += e.blocks[key].text + ' ';
            }
            setValue({ ...value, ['Notes']: combinedText })
        }
    }

    const Save_VehicleNotes = (e) => {
        const { PropertyID, CreatedByUserFK, ModifiedByUserFK, MasterPropertyID,
            OfficerNameID, Notes, CommentsDoc, VehicleNotesID, IsMaster, CreateDtTmNotes } = value
        const val = {
            'PropertyID': DecVehId, 'MasterPropertyID': DecMVehId, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
            'OfficerNameID': OfficerNameID, 'Notes': Notes, 'CommentsDoc': CommentsDoc, 'VehicleNotesID': 0, 'IsMaster': IsMaster,
            'CreateDtTmNotes': getShowingDateText(new Date()),

        }
        AddDeleteUpadate('VehicleNotes/Insert_VehicleNotes', val)
            .then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_VehicleNotesData(DecVehId); get_vehicle_Count(DecVehId, DecMVehId)
                setErrors({ ...errors, ['NotesError']: '' }); setStatusFalse(); setChangesStatus(false); setStatesChangeStatus(false);
            })
    }

    const update_VehicleNotes = (e) => {
        const { PropertyID, CreatedByUserFK, ModifiedByUserFK, MasterPropertyID,
            OfficerNameID, Notes, CommentsDoc, VehicleNotesID, IsMaster } = value
        const val = {
            'PropertyID': DecVehId, 'MasterPropertyID': DecMVehId, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID,
            'OfficerNameID': OfficerNameID, 'Notes': Notes, 'CommentsDoc': CommentsDoc, 'VehicleNotesID': VehicleNotesID, 'IsMaster': IsMaster,
            'CreateDtTmNotes': getShowingDateText(new Date()),
        }
        AddDeleteUpadate('VehicleNotes/Update_VehicleNotes', val)
            .then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_VehicleNotesData(DecVehId); get_vehicle_Count(DecVehId, DecMVehId); setErrors({ ...errors, ['NotesError']: '' });
                setStatusFalse(); setChangesStatus(false); setStatesChangeStatus(false);
            })
    }

    const DeleteVehicleNotes = () => {
        const val = { 'VehicleNotesID': delVehicleNotesID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false, }
        AddDeleteUpadate('VehicleNotes/Delete_VehicleNotes', val).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_vehicle_Count(vehicleID, DecMVehId);
                get_VehicleNotesData(vehicleID); setErrors('')
                if (delVehicleNotesID == VehicleNotesID) { setStatusFalse(); }
                reset();
            } else console.log("Somthing Wrong");
        })
    }

    const closeModal = () => {
        reset();
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true);
        if (e) {
            setValue({ ...value, [name]: e.value }); setChangesStatus(true)
        } else setValue({
            ...value, [name]: null
        })
    }

    const columns = [
        {
            width: '200px', name: 'Date/Time',
            selector: (row) => row.CreateDtTmNotes ? getShowingDateText(row.CreateDtTmNotes) : " ",
            sortable: true
        },
        {
            name: 'Vehicle Notes',
            selector: (row) => row?.Notes || '',
            format: (row) => (
                <>{row?.Notes ? row?.Notes.substring(0, 70) : ''}{row?.Notes?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },
        {
            name: 'Officer', selector: (row) => row.OfficerName,
            format: (row) => (
                <>{row?.OfficerName ? row?.OfficerName.substring(0, 40) : ''}{row?.OfficerName?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 3 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 7 }}>

                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={(e) => setDelVehicleNotesID(row.VehicleNotesID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={(e) => setDelVehicleNotesID(row.VehicleNotesID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>

        }
    ]

    const conditionalRowStyles = [
        {
            when: row => row?.VehicleNotesID == VehicleNotesID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const editVehicleNotes = (val) => {
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
            modal.show();
        } else {
            setStatus(true); setStatesChangeStatus(false); setVehicleNotesID(val.VehicleNotesID); setModal(true); setErrors(''); setUpDateCount(upDateCount + 1);
        }
    }

    const setStatusFalse = (e, row) => {
        setStatus(false); reset(); setClickedRow(); setModal(true)
        setUpDateCount(upDateCount + 1);
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
    const setToReset = () => {
    }
    return (
        <>
            <VehicleListing {...{ ListData }} />
            <div className="row mt-1">
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
                            options: ['inline', 'blockType', 'fontFamily', 'list', 'textAlign', 'history',],
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
                                    value={headOfAgency?.filter((obj) => obj.value === value?.OfficerNameID)}
                                    options={headOfAgency}
                                    onChange={(e) => ChangeDropDown(e, 'OfficerNameID')}
                                    placeholder="Select.."
                                    menuPlacement="top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!isViewEventDetails &&
                <div className="col-12 col-md-12 col-lg-12 text-right  bb">
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
            <div className="col-12 px-0 mt-1 modal-table" >
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? vehicleNotesData : [] : vehicleNotesData}
                    selectableRowsHighlight
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    fixedHeader
                    persistTableHead={true}
                    fixedHeaderScrollHeight='100px'
                    onRowClicked={(row) => {
                        setClickedRow(row); editVehicleNotes(row);
                    }}
                    pagination
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    conditionalRowStyles={conditionalRowStyles}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={DeleteVehicleNotes} />
            <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
        </>
    )
}

export default VehicleNotes;


