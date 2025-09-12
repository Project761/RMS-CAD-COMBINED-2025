import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../../../../hooks/Api';
import { Aes256Encrypt, Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import DataTable from 'react-data-table-component';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { RequiredField, RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import Select from "react-select";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/api';


const Document = (props) => {


    const { DecNameID, DecMasterNameID, } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';


    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    const { get_Name_Count, localStoreArray, get_LocalStorage, } = useContext(AgencyContext);
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const [DocumentTypeID, setDocumentTypeID] = useState('');
    const [documentdata, setDocumentdata] = useState();
    const [updateStatus, setUpdateStatus] = useState(0);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);

    const localStore = {
        Value: "",
        UniqueId: localStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(localStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', NameID: '', MasterNameID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    const [value, setValue] = useState({
        'CreatedByUserFK': loginPinID, 'MasterNameID': '', 'NameID': '', 'DocumentName': '', 'DocumentNotes': '', 'DocumentTypeID': null,
        'AgencyID': '', 'File': '',

    })

    useEffect(() => {
        if (DecNameID && DecMasterNameID) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID, 'AgencyID': loginAgencyID, } });
            get_Documentdata(DecNameID, DecMasterNameID);
        }

    }, [DecNameID, DecMasterNameID, loginPinID]);


    const [errors, setErrors] = useState({
        'DocumentNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
    })

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

    useEffect(() => {
        if (loginAgencyID) {
            get_DocumentDropDwn(loginAgencyID);
        }
    }, [loginAgencyID])

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

    const get_Documentdata = (DecNameID, DecMasterNameID) => {
        const val = { 'NameID': DecNameID, 'MasterNameID': DecMasterNameID, }
        const val2 = { 'MasterNameID': DecMasterNameID, 'NameID': 0, }
        fetchPostData(openPage === 'mastername' ? 'MainMasterNameDocument/GetData_MainMasterNameDocument' : 'NameDocument/GetData_NameDocument', openPage === 'mastername' ? val2 : val).then((res) => {
            if (res) {
                setDocumentdata(res)
            } else {
                setDocumentdata([]);
            }
        })
    }

    const HandleChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
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

    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) {
            nameArray?.push(name?.name)
        }
        setSelectedFileName(nameArray);
    };

    const Add_Document = async (id) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const newDoc = [];
        const EncDocs = [];
        // multiple file upload <----
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("File", selectedFile[i])
            EncFormdata.append("File", selectedFile[i])
        }
        const values = JSON.stringify(value);
        newDoc.push(values);

        const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(value)]));
        EncDocs.push(EncPostData);

        formdata.append("Data", JSON.stringify(newDoc));
        EncFormdata.append("Data", EncDocs);

        AddDelete_Img(openPage === 'mastername' ? 'MainMasterNameDocument/Insert_MainMasterNameDocument' : 'NameDocument/Insert_NameDocument', formdata, EncFormdata).then((res) => {
            if (res.success) {
                get_Documentdata(DecNameID, DecMasterNameID);
                setErrors({ ...errors, 'DocumentNameError': '', })
                get_Name_Count(DecNameID);
                toastifySuccess(res.Message);
                reset();
                setSelectedFileName([])
                setSelectedFile([])
            } else {
                console.log("something Wrong");
            }
        }).catch(err => console.log(err))
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
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 7 }}>
                    <span onClick={() => {
                        setDocumentTypeID(row.DocumentID
                        );
                    }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </span>
                </div>

        }
    ]

    const setStatusFalse = (e, row) => {
        reset();
        setUpdateStatus(updateStatus + 1);
        setDocumentTypeID(row.DocumentTypeID);
    }

    const DeleteDocumentManagement = () => {
        const val = {
            'DocumentID': DocumentTypeID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('NameDocument/Delete_NameDocument', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Name_Count(DecNameID);
                get_Documentdata(DecNameID, DecMasterNameID);
            } else console.log("Somthing Wrong");
        })
    }

  
    const set_Edit_Value = (row) => {

        setUpdateStatus(updateStatus + 1);
        setDocumentTypeID(row.DocumentTypeID)
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
            <div className="col-12 col-md-12 pt-2 p-0" >
                <div className="row">
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Documents Name{errors.DocumentNameError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentNameError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-4 text-field mt-2" >
                        <input type="text" className='requiredColor' name='DocumentName' value={value.DocumentName} onChange={HandleChanges} required autoComplete='off' />
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
                        <label htmlFor="" className='label-name '>File Attachement{errors.File_Not_Selected !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-10 text-field mt-2">
                        <input type="file" className='requiredColor' name='DocumentFile' onChange={changeHandler} multiple required />
                        <div className=" col-12 mt-3">
                            {
                                selectedFileName?.length > 0 &&
                                selectedFileName?.map((data) => {
                                    return <p className='bg-info mx-1 text-white px-2' key={data}>{data}</p>
                                })
                            }
                        </div>
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '>Notes</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-10 text-field mt-2" >
                        <textarea name='DocumentNotes' id="DocumentNotes" value={value?.DocumentNotes} onChange={HandleChanges} cols="30" rows='3' className="form-control pt-2 pb-2" ></textarea>
                    </div>
                </div>
                <div className="btn-box text-right mr-1 mb-2">
                    <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                    <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                </div>
                <div className=" col-12">
                    <DataTable
                        fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        conditionalRowStyles={conditionalRowStyles}
                        dense
                        columns={columns}
                        data={documentdata}
                        onRowClicked={(row) => {
                            setClickedRow(row);
                            set_Edit_Value(row);
                        }}
                        pagination
                        highlightOnHover
                        noDataComponent={"There are no data to display"}
                    />
                </div>
            </div>
            <DeletePopUpModal func={DeleteDocumentManagement} />
        </>
    )
}

export default Document

function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File..';
    }

}