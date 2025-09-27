import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import Select from "react-select";
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../hooks/Api';
import { Aes256Encrypt, Decrypt_Id_Name, tableCustomStyles } from './Utility';
import { toastifyError, toastifySuccess } from './AlertMsg';
import DeletePopUpModal from './DeleteModal';
import { AgencyContext } from '../../Context/Agency/Index';
import { Comman_changeArrayFormat } from './ChangeArrayFormat';
import { RequiredField, RequiredFieldIncident } from '../Pages/Utility/Personnel/Validation';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../redux/actions/Agency';
import PropListng from '../Pages/ShowAllList/PropListng';
import NameListing from '../Pages/ShowAllList/NameListing';
import VehicleListing from '../Pages/ShowAllList/VehicleListing';
import ChangesModal from './ChangesModal';
import { get_ScreenPermissions_Data } from '../../redux/actions/IncidentAction';

const DocumentModal = (props) => {

    const { DocName, ListData, nameCount, Vichile, ParentId, parentTabMasterID, count, deleteUrl, rowIdName, insertDataUrl, getDataUrl, getDataMasterUrl, TabIdColName, masterIDColName, scrCode, isViewEventDetails = false } = props

    const { setChangesStatus, get_Property_Count, get_Name_Count, get_vehicle_Count, } = useContext(AgencyContext);

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');

    const [DocumentID, setDocumentID] = useState('');
    const [documentdata, setDocumentdata] = useState();
    const [updateStatus, setUpdateStatus] = useState(0);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [clickedRow] = useState(null);

    const [value, setValue] = useState({
        [masterIDColName]: '', [TabIdColName]: '', 'DocumentName': '', 'DocumentNotes': '', 'DocumentTypeID': null, 'File': '',
        'CreatedByUserFK': loginPinID, 'AgencyID': '',
        'IsMaster': MstPage === "MST-Property-Dash" || MstPage === "MST-Name-Dash" || MstPage === "MST-Vehicle-Dash" ? true : false,
    })

    const [errors, setErrors] = useState({
        'DocumentNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '', "DocumentNotesError": ''
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data(scrCode, localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);


    useEffect(() => {
        if (loginAgencyID) {
            get_DocumentDropDwn(loginAgencyID);
        }
    }, [loginAgencyID])

    useEffect(() => {
        setValue({
            ...value,
            'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
            [masterIDColName]: parentTabMasterID, [TabIdColName]: ParentId
        })
        get_Documentdata(ParentId, parentTabMasterID)
    }, [ParentId, loginPinID, parentTabMasterID, updateStatus]);


    const get_Documentdata = (TabId, masterID) => {
        const val = { [TabIdColName]: TabId, [masterIDColName]: masterID, 'IsMaster': MstPage === "MST-Property-Dash" || MstPage === "MST-Name-Dash" || MstPage === "MST-Vehicle-Dash" ? true : false, }
        const val2 = { [TabIdColName]: 0, [masterIDColName]: masterID, 'IsMaster': MstPage === "MST-Property-Dash" || MstPage === "MST-Name-Dash" || MstPage === "MST-Vehicle-Dash" ? true : false, }
        fetchPostData(MstPage === 'masterProperty' ? getDataMasterUrl : getDataUrl, MstPage ? val2 : val).then((res) => {
            if (res) {
                setDocumentdata(res)
            } else {
                setDocumentdata([]);
            }
        })
    }

    const check_Validation_Error = (e) => {
        const DocumentNameErr = RequiredField(value.DocumentName);
        const DocumentTypeIDErr = RequiredFieldIncident(value.DocumentTypeID);
        const File_Not_SelectedErr = validate_fileupload(selectedFileName);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['DocumentNameError']: DocumentNameErr || prevValues['DocumentNameError'],
                ['DocumentTypeIDError']: DocumentTypeIDErr || prevValues['DocumentTypeIDError'],
                ['File_Not_Selected']: File_Not_SelectedErr || prevValues['File_Not_Selected'],
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { DocumentNameError, DocumentTypeIDError, File_Not_Selected } = errors

    useEffect(() => {
        if (DocumentNameError === 'true' && DocumentTypeIDError === 'true' && File_Not_Selected === 'true') {
            Add_Document();
        }
    }, [DocumentNameError, DocumentTypeIDError, File_Not_Selected])


    const get_DocumentDropDwn = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('DocumentType/GetDataDropDown_DocumentType', val).then((data) => {
            if (data) {
                setDocumentDrpVal(Comman_changeArrayFormat(data, 'DocumentTypeID', 'Description'));
            } else {
                setDocumentDrpVal([])
            }
        })
    };

    const HandleChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
        setChangesStatus(true)
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setChangesStatus(true)
            setValue({ ...value, [name]: e.value });
        } else {
            setChangesStatus(true)
            setValue({ ...value, [name]: null });
        }
    }

    

    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) {
            nameArray?.push(name?.name)
        }
        setSelectedFileName(nameArray);
    };

    const Add_Document = async () => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const docs = [];
        const EncDocs = [];
        // Add selected files to formdata
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("File", selectedFile[i]);
            EncFormdata.append("File", selectedFile[i]);
        }
        const values = JSON.stringify(value);
        docs.push(values);

        const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(value)]));
        EncDocs.push(EncPostData);

        formdata.append("Data", JSON.stringify(docs));
        EncFormdata.append("Data", EncDocs);

        AddDelete_Img(insertDataUrl, formdata, EncFormdata).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                setChangesStatus(false);
                get_Documentdata(ParentId, parentTabMasterID);
                setErrors({ ...errors, 'DocumentNameError': '' });
                if (nameCount) {
                    // Case 3: nameCount is present
                    if (ParentId || parentTabMasterID) {
                        get_Name_Count(ParentId, parentTabMasterID, MstPage === "MST-Name-Dash" ? true : false);
                    }
                } else {
                    // Case 1: Vichile is not present
                    if (!Vichile) {
                        if (count || ParentId || parentTabMasterID) {
                            get_Property_Count(ParentId, parentTabMasterID, MstPage ? true : false);
                        }
                    } else {
                        // Case 2: Vichile is present
                        if (DocName === "VehDoc" && (count || ParentId || parentTabMasterID)) {
                            get_vehicle_Count(ParentId, parentTabMasterID);
                        }
                    }

                }
                reset(); setSelectedFileName([]); setSelectedFile([]);
            } else {
                console.log("Something went wrong");
            }
        }).catch(err => console.log(err));
    }

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    <span onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
                        <i className="fa fa-eye"></i>
                    </span>
                </div>
        },
        {
            width: '250px',
            name: 'Document Name',
            selector: (row) => row.DocumentName,
            sortable: true
        },
        {
            width: '250px',
            name: 'Document Notes',
            selector: (row) => row.DocumentNotes,
            sortable: true
        },
        {
            name: 'Document Type',
            selector: (row) => row.DocumentType_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={() => { setDocumentID(row?.[rowIdName]); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={() => { setDocumentID(row?.[rowIdName]); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>
        }
    ]

    const setStatusFalse = () => {
        reset(); setUpdateStatus(updateStatus + 1); setDocumentID(''); setSelectedFileName([]); setSelectedFile([])
    }

    const DeleteDocumentManagement = () => {
        const val = { 'DocumentID': DocumentID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstPage === "MST-Property-Dash" || MstPage === "MST-Vehicle-Dash" ? true : false, }
        AddDeleteUpadate(deleteUrl, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setErrors('')
                if (nameCount) {
                    // Case 3: nameCount is present
                    if (ParentId || parentTabMasterID) {
                        get_Name_Count(ParentId, parentTabMasterID, MstPage === "MST-Name-Dash" ? true : false);
                    }
                } else {
                    // Case 1: Vichile is not present
                    if (!Vichile) {
                        if (count || ParentId || parentTabMasterID) {
                            get_Property_Count(count, ParentId, parentTabMasterID, MstPage ? true : false);
                        }
                    } else {
                        // Case 2: Vichile is present
                        if (count || ParentId || parentTabMasterID) {
                            get_vehicle_Count(ParentId, parentTabMasterID);
                        }
                    }
                }

                get_Documentdata(ParentId, parentTabMasterID);
                reset();
            } else { console.log("Somthing Wrong"); }
        })
    }

    const reset = () => {
        setValue({
            ...value,
            'DocumentName': '', 'DocumentNotes': '', 'DocumentTypeID': '', 'File': '', 'selectedFileName': '', 'File_Not_Selected': '', 'fileName': '',
        });
        document.querySelector("input[type='file']").value = "";
        setErrors({
            ...errors,
            'fileName': '', 'DocumentNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
        }); setSelectedFileName(''); setSelectedFile([])
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
                DocName === 'PropDoc' ?
                    <PropListng {...{ ListData }} />
                    :
                    DocName === 'NameDoc' ?
                        <NameListing {...{ ListData }} />
                        :
                        DocName === 'VehDoc' ?
                            <VehicleListing {...{ ListData }} />
                            :
                            <></>
            }
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="row">
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Document Name{errors.DocumentNameError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentNameError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4 text-field mt-2" >
                        <input type="text" className="requiredColor" value={value?.DocumentName} name="DocumentName" id='DocumentName' onChange={HandleChanges} required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <Link to={'/ListManagement?page=Document%20Type&call=/Prop-Home'} className='new-link'>
                            Document Type{errors.DocumentTypeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeIDError}</p>
                            ) : null}
                        </Link>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4  mt-2" >
                        <Select
                            name='DocumentTypeID'
                            styles={colourStyles}
                            value={documentDrpVal?.filter((obj) => obj.value === value?.DocumentTypeID)}
                            isClearable
                            options={documentDrpVal}
                            onChange={(e) => ChangeDropDown(e, 'DocumentTypeID')}
                            placeholder="Select.."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>File Attachment{errors.File_Not_Selected !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-10 text-field mt-2">
                        <input type="file" className='requiredColor' name='DocumentFile' onChange={changeHandler} required />
                        {selectedFileName?.length > 0 &&
                            <i className="fa fa-close" style={{ position: "absolute", right: "1rem", top: "7px" }} onClick={() => { setSelectedFileName(''); document.querySelector("input[type='file']").value = "" }}></i>}

                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '> Notes </label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-10 " >
                        <textarea name='DocumentNotes' id="DocumentNotes" value={value?.DocumentNotes} onChange={HandleChanges} cols="30" rows='2' className="form-control" ></textarea>
                    </div>
                </div>
                {!isViewEventDetails &&
                    <div className="btn-box text-right mr-1 mb-2 mt-1">
                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                        {
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                        }

                    </div>
                }
                <div className=" col-12 modal-table">
                    <DataTable
                        fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        conditionalRowStyles={conditionalRowStyles}
                        dense
                        columns={columns}
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? documentdata : [] : documentdata}
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}

                        pagination
                        highlightOnHover
                    />
                </div>
            </div>
            <ChangesModal func={check_Validation_Error} setToReset={setStatusFalse} />
            <DeletePopUpModal func={DeleteDocumentManagement} />
        </>
    )
}

export default DocumentModal

function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File*';
    }

}