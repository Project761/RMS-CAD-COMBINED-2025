import { useCallback, useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { Aes256Encrypt, Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../Common/Utility';
import { Link, useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import MissingTab from '../../../Utility/Tab/MissingTab';
import Select from "react-select";
import DeletePopUpModal from '../../../Common/DeleteModal';
import ChangesModal from '../../../Common/ChangesModal';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';

const MissingDocument = () => {

    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    let DecEIncID = 0
    let DecMissPerID = 0
    const query = useQuery();
    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    if (!MissPerId) { DecMissPerID = 0; }
    else { DecMissPerID = parseInt(base64ToString(MissPerId)); }

    const { setChangesStatus } = useContext(AgencyContext);
    const [documentID, setDocumentID] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0)
    const [documentdata, setDocumentdata] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);

    const [value, setValue] = useState({
        'AgencyID': '', 'DocumentName': '', 'DocumentNotes': '', 'file': '',
        'DocumentTypeID': '', 'CreatedByUserFK': '', 'MissingPersonID': ''
    })

    const [errors, setErrors] = useState({
        'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(parseInt(localStoreData?.PINID)); get_DocumentDropDwn(localStoreData?.AgencyID)
            dispatch(get_ScreenPermissions_Data("M129", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (IncID) {
            get_Documentdata();
        }
    }, [IncID]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value,
                'CreatedByUserFK': loginPinID, 'MissingPersonID': DecMissPerID, 'AgencyID': loginAgencyID
            });
        }
    }, [loginAgencyID]);

    const check_Validation_Error = (e) => {
        const DocumentNameErr = RequiredFieldIncident(value.DocumentName);
        const DocumentTypeIDErr = RequiredFieldIncident(value.DocumentTypeID);
        const File_Not_SelectedErr = validate_fileupload(selectedFileName);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['DocFileNameError']: DocumentNameErr || prevValues['DocFileNameError'],
                ['DocumentTypeIDError']: DocumentTypeIDErr || prevValues['DocumentTypeIDError'],
                ['File_Not_Selected']: File_Not_SelectedErr || prevValues['File_Not_Selected'],
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { DocFileNameError, DocumentTypeIDError, File_Not_Selected } = errors

    useEffect(() => {
        if (DocFileNameError === 'true' && DocumentTypeIDError === 'true' && File_Not_Selected === 'true') {
            Add_Documents();
        }
    }, [DocFileNameError, DocumentTypeIDError, File_Not_Selected])

    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) {
            nameArray?.push(name?.name)
        }
        setSelectedFileName(nameArray);
        setChangesStatus(true);
        setErrors({ ...errors, 'File_Not_Selected': '' })
    };


    const get_DocumentDropDwn = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('DocumentType/GetDataDropDown_DocumentType', val).then((data) => {
            if (data) {
                setDocumentDrpVal(Comman_changeArrayFormat(data, 'DocumentTypeID', 'Description'));
            }
            else {
                setDocumentDrpVal([])
            }
        })
    };

    const Add_Documents = async (id) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const newDoc = [];
        const EncDocs = [];

        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("file", selectedFile[i])
            EncFormdata.append("file", selectedFile[i])
        }
        const { DocumentID, DocumentName, DocumentNotes, file, DocumentTypeID, MissingPersonID } = value
        const val = {
            'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID,
            'DocumentID': DocumentID, 'DocumentName': DocumentName, 'DocumentNotes': DocumentNotes, 'file': file,
            'DocumentTypeID': DocumentTypeID, 'MissingPersonID': MissingPersonID
        }

        const values = JSON.stringify(val);
        newDoc.push(values);

        const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
        EncDocs.push(EncPostData);

        formdata.append("Data", JSON.stringify(newDoc));
        EncFormdata.append("Data", EncDocs);

        AddDelete_Img('MissingPersonDocument/Insert_MisisngPersonDoc', formdata, EncFormdata).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Documentdata();
                reset();
                setChangesStatus(false);
                setSelectedFileName([]);
                setSelectedFile([])
                setErrors({ ...errors, 'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '', })
            } else {
                console.log("something Wrong");
            }
        }).catch(err => console.log(err))
    }

    const get_Documentdata = () => {
        const val = { 'MissingPersonID': DecMissPerID }
        fetchPostData('MissingPersonDocument/GetData_MisisngPersonDoc', val).then((res) => {
            if (res) {
                setDocumentdata(res);
            } else {
                setDocumentdata([]);
            }
        })
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
            name: 'Document Name',
            selector: (row) => row.DocumentName,
            sortable: true
        },
        {
            name: 'Notes',
            selector: (row) => row.DocumentNotes,
            format: (row) => (
                <>{row?.DocumentNotes ? row?.DocumentNotes.substring(0, 70) : ''}{row?.DocumentNotes?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },
        {
            name: 'Document Type',
            selector: (row) => row.DocumentType_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 5 }}>Delete</p>,
            cell: row =>


                <div className="div" style={{ position: 'absolute', top: 4, right: 12 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <span onClick={() => { setDocumentID(row.DocumentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={() => { setDocumentID(row.DocumentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const DeleteDocumentManagement = () => {
        const val = { 'DocumentID': documentID, 'IsActive': '0', 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('MissingPersonDocument/Delete_MisisngPersonDoc', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Documentdata(); setErrors('')
                reset();
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = () => {
        setChangesStatus(false);

        reset(); setSelectedFileName([]); setSelectedFile([]); setUpdateStatus(updateStatus + 1);
    }

    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
        setChangesStatus(true);
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value });
            setChangesStatus(true);
            setErrors({ ...errors, 'DocumentTypeIDError': '' })

        }
        else { setValue({ ...value, [name]: null }) }
    }

    const reset = () => {
        setValue({ ...value, 'DocumentName': '', 'file': '', 'DocumentTypeID': '', 'DocumentNotes': '', });
        document.querySelector("input[type='file']").value = "";
        setErrors({ ...errors, 'DocFileNameError': '', 'File_Not_Selected': '', 'DocumentTypeIDError': '', });
        setSelectedFileName('');
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);


    // Custom Style
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            <div className="section-body view_page_design pt-1 p-1 bt">
                <div className="div">
                    <div className="col-12  inc__tabs">
                        <MissingTab />
                    </div>
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body" >
                                <div className="col-md-12">
                                    <div className="row" style={{ marginTop: '-18px', }}>
                                        <div className="col-2 col-md-2 col-lg-2 mt-3">
                                            <label htmlFor="" className='label-name '>Document Name{errors.DocFileNameError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocFileNameError}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-4 col-md-4 col-lg-4 text-field mt-2" >
                                            <input type="text" className='requiredColor' name='DocumentName' value={value.DocumentName} onChange={handleChange} required autoComplete='off' />
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-3">
                                            <Link to={'/ListManagement?page=Document%20Type&call=/Name-Home'} className='new-link'>
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
                                        <div className="col-10 col-md-10 col-lg-10 text-field mt-2 mb-0">
                                            <input type="file" className='requiredColor' name='file' onChange={changeHandler} required />
                                            {selectedFileName?.length > 0 &&
                                                <i className="fa fa-close" style={{ position: "absolute", right: "1rem", top: "7px" }} onClick={() => { setSelectedFileName(''); document.querySelector("input[type='file']").value = "" }}></i>}

                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-3">
                                            <label htmlFor="" className='label-name '>Notes</label>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-10 mb-0 mt-1" >
                                            <textarea name='DocumentNotes' onChange={handleChange} id="Comments" value={value.DocumentNotes} cols="30" rows='2' className="form-control " ></textarea>
                                        </div>
                                    </div>



                                    <div className="btn-box text-right mr-1 mb-2 mt-2">
                                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                                        {
                                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                                                : <></> :
                                                <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>}
                                    </div>
                                    <DataTable
                                        dense
                                        columns={columns}

                                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? documentdata : [] : documentdata}
                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                        pagination
                                        highlightOnHover
                                        customStyles={tableCustomStyles}
                                        onRowClicked={(row) => {

                                        }}
                                        fixedHeader
                                        persistTableHead={true}
                                        fixedHeaderScrollHeight='200px'

                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteDocumentManagement} />
            <ChangesModal func={check_Validation_Error} />
        </>
    )
}

export default MissingDocument
function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File*';
    }

}