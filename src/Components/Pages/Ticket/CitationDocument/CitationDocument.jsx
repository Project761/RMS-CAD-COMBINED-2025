import React, { useCallback, useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useLocation } from 'react-router-dom'
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import DeletePopUpModal from '../../../Common/DeleteModal';
import { Aes256Encrypt, Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision, AddDelete_Img } from '../../../hooks/Api';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { RequiredField, RequiredFieldSpaceNotAllow } from '../../Agency/AgencyValidation/validators';
import { RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import Select from "react-select";
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
// import Tab from '../../Utility/Tab/Tab';
import IdentifyFieldColor from '../../../Common/IdentifyFieldColor';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
// import NameListing from '../ShowAllList/NameListing';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import CitationMainTab from '../../../Utility/Tab/CitationMainTab';

const CitationDocument = () => {

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

    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const { get_Incident_Count, localStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    const [clickedRow, setClickedRow] = useState(null);
    const [documentID, setDocumentID] = useState('');
    const [status, setStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0)
    const [modal, setModal] = useState(false)
    const [documentdata, setDocumentdata] = useState();
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [EffectiveScreenPermission, setEffectiveScreenPermission] = useState([]);

    const [value, setValue] = useState({
        'AgencyID': '', 'DocumentID': '', 'DocumentName': '', 'DocumentNotes': '', 'File': '',
        'IsActive': '1', 'DocumentTypeID': '', 'CreatedByUserFK': '', 'IncidentId': '', 'ModifiedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
            // get_LocalStorage();
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(parseInt(localStoreData?.PINID)); get_DocumentDropDwn(localStoreData?.AgencyID)
            dispatch(get_ScreenPermissions_Data('I035', localStoreData?.AgencyID, localStoreData?.PINID));

        }
    }, [localStoreData]);

    useEffect(() => {
        if (IncID) {
            get_Documentdata(IncID); setMainIncidentID(IncID);
            setValue({
                ...value,
                'IncidentId': IncID
            })
        }
    }, [IncID]);

    const check_Validation_Error = (e) => {
        const DocumentNameErr = RequiredField(value.DocumentName);
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
    };

    const getScreenPermision = (LoginAgencyID, LoginPinID) => {
        ScreenPermision("I035", LoginAgencyID, LoginPinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission([])
            }
        });
    }

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

        // multiple file upload <----
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("File", selectedFile[i])
            EncFormdata.append("File", selectedFile[i])
            // console.log(selectedFile[i])
        }
        const { IncidentId, AgencyID, CreatedByUserFK, DocumentID, DocumentName, DocumentNotes, File,
            IsActive, DocumentTypeID, ModifiedByUserFK } = value
        const val = {
            'IncidentId': IncID, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID,
            'DocumentID': DocumentID, 'DocumentName': DocumentName, 'DocumentNotes': DocumentNotes, 'File': File,
            'IsActive': '1', 'DocumentTypeID': DocumentTypeID, 'ModifiedByUserFK': '',
        }
        // console.log(val)
        const values = JSON.stringify(val);
        newDoc.push(values)
        const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
        EncDocs.push(EncPostData);

        formdata.append("Data", JSON.stringify(newDoc));
        EncFormdata.append("Data", EncDocs);
        AddDelete_Img('IncidentDocumentManagement/Insert_IncidentDocManagement', formdata, EncFormdata)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); get_Documentdata(mainIncidentID);
                    get_Incident_Count(mainIncidentID); reset(); setSelectedFileName([]); setSelectedFile([])
                    setErrors({ ...errors, 'DocFileNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '', })
                } else {
                    console.log("something Wrong");
                }
            })
            .catch(err => console.log(err))
    }

    const get_Documentdata = (mainIncidentID) => {
        const val = { 'IncidentId': mainIncidentID }
        fetchPostData('IncidentDocumentManagement/GetData_IncidentDocManagement', val).then((res) => {
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
                            <span onClick={() => { setDocumentID(row?.documentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                            : <></>
                            : <span onClick={() => { setDocumentID(row?.documentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const DeleteDocumentManagement = () => {
        const val = { 'DocumentID': documentID, 'IsActive': '0', 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('IncidentDocumentManagement/Delete_IncidentDocManagement', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message); get_Incident_Count(mainIncidentID); get_Documentdata(mainIncidentID);
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = () => {
        setClickedRow(null); reset(); setSelectedFileName([]); setSelectedFile([]); setStatus(false); setUpdateStatus(updateStatus + 1);
    }

    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value })
    }

    const ChangeDropDown = (e, name) => {
        if (e) { setValue({ ...value, [name]: e.value }) }
        else { setValue({ ...value, [name]: null }) }
    }

    const reset = () => {
        setValue({ ...value, 'DocumentName': '', 'File': '', 'DocumentTypeID': '', 'DocumentNotes': '', });
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
                        <CitationMainTab />
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
                                            <label htmlFor="" className='label-name '>File Attachement{errors.File_Not_Selected !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
                                            ) : null}</label>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-10 text-field mt-2 mb-0">
                                            <input type="file" className='requiredColor' name='File' onChange={changeHandler} multiple required />
                                            <div className=" col-12 mt-3">
                                                {/* {
                                                    selectedFileName?.length > 0 &&
                                                    selectedFileName?.map((data) => {
                                                        return <p className='bg-info mx-1 text-white px-2' key={data.id}>{data}</p>
                                                    })
                                                } */}
                                            </div>
                                        </div>
                                        <div className="col-2 col-md-2 col-lg-2 mt-3">
                                            <label htmlFor="" className='label-name '>Notes</label>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-10 mb-0 mt-1" >
                                            <textarea name='DocumentNotes' onChange={handleChange} id="Comments" value={value.DocumentNotes} cols="30" rows='2' className="form-control " ></textarea>
                                        </div>
                                    </div>
                                    <div className="btn-box text-right mr-1 mb-2 mt-2">
                                        <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); conditionalRowStyles(''); setUpdateStatus(updateStatus + 1); }}>New</button>
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
                                    <DataTable
                                        dense
                                        columns={columns}
                                        pagination
                                        highlightOnHover
                                        customStyles={tableCustomStyles}
                                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? documentdata : [] : documentdata}
                                        onRowClicked={(row) => {
                                            setClickedRow(row);
                                            //   set_Edit_Value(row);
                                        }}
                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                        fixedHeader
                                        persistTableHead={true}
                                        fixedHeaderScrollHeight='200px'
                                        conditionalRowStyles={conditionalRowStyles}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteDocumentManagement} />
            {/* <IdentifyFieldColor /> */}
        </>
    )
}

export default CitationDocument

function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File*';
    }

}