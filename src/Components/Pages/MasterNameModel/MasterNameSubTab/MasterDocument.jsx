import React, { useContext, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import Select from "react-select";
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { Aes256Encrypt, tableCustomStyles } from '../../../Common/Utility';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { RequiredField, RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, AddDelete_Img, fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import MasterChangesModal from '../MasterChangeModel';

const MasterDocument = (props) => {

    const { possessionID, mstPossessionID, ownerOfID, loginAgencyID, loginPinID, count } = props

    const { setChangesStatus, get_Property_Count, get_Name_Count, get_vehicle_Count,get_MasterName_Count } = useContext(AgencyContext);

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
    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [clickedRow, setClickedRow] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false)


    const [value, setValue] = useState({
        'MasterNameID': '', 'NameID': '', 'DocumentName': '', 'DocumentNotes': '', 'DocumentTypeID': null, 'File': '',
        'CreatedByUserFK': loginPinID, 'AgencyID': '',
        'IsMaster': MstPage === "MST-Property-Dash" || MstPage === "MST-Vehicle-Dash" ? true : false,
    })

    const [errors, setErrors] = useState({
        'DocumentNameError': '', 'DocumentTypeIDError': '', 'File_Not_Selected': '',
    })

    useEffect(() => {
        if (loginAgencyID) {
            get_DocumentDropDwn(loginAgencyID);
        }
    }, [loginAgencyID])

    useEffect(() => {
        setValue({
            ...value,
            'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
            'MasterNameID': mstPossessionID, 'NameID': possessionID || ownerOfID
        })
        get_Documentdata(possessionID || ownerOfID, mstPossessionID)
    }, [possessionID, loginPinID, mstPossessionID, ownerOfID, updateStatus]);

    const get_Documentdata = (TabId, masterID) => {
        const val = { 'NameID': TabId, 'MasterNameID': masterID, 'IsMaster': MstPage === "MST-Property-Dash" || MstPage === "MST-Vehicle-Dash" ? true : false, }
        const val2 = { 'NameID': 0, 'MasterNameID': masterID, 'IsMaster': MstPage === "MST-Property-Dash" || MstPage === "MST-Vehicle-Dash" ? true : false, }
        fetchPostData(MstPage === 'masterProperty' ? 'MainMasterNameDocument/GetData_MainMasterNameDocument' : 'NameDocument/GetData_NameDocument', MstPage ? val2 : val).then((res) => {
            if (res) {
                setDocumentdata(res)
            } else {
                setDocumentdata([]);
            }
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
        }); setSelectedFileName(''); setSelectedFile([]);
        setChangesStatus(false);
    }

    const HandleChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
        setChangesStatus(true)
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

    const ChangeDropDown = (e, name) => {
        if (e) {
            setChangesStatus(true)
            setValue({ ...value, [name]: e.value });
        } else {
            setChangesStatus(true)
            setValue({ ...value, [name]: null });
        }
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

    const Add_Document = async () => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const docs = [];
        const EncDocs = [];
        // multiple file upload <----
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("File", selectedFile[i])
            EncFormdata.append("File", selectedFile[i])
        }

        const values = JSON.stringify(value);
        const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(value)]));

        EncDocs.push(EncPostData);
        docs.push(values)

        formdata.append("Data", JSON.stringify(docs));
        EncFormdata.append("Data", EncDocs);

        AddDelete_Img(MstPage ? 'NameDocument/Insert_NameDocument' : 'NameDocument/Insert_NameDocument', formdata, EncFormdata).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                setChangesStatus(false);
                get_Documentdata(possessionID || ownerOfID, mstPossessionID);
                setErrors({ ...errors, 'DocumentNameError': '', })
                if (count) {
                    get_Property_Count(count);
                }
                else if (possessionID) {
                    get_MasterName_Count(possessionID);

                } else if (possessionID) {
                    get_vehicle_Count(possessionID || ownerOfID);
                }
                toastifySuccess(message);
                reset();
                setSelectedFileName([]);
                setSelectedFile([]);
            } else {
                console.log("something Wrong");
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
                    <span onClick={() => { setDocumentID(row?.DocumentID); setDeleteModal(true) }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" >
                        <i className="fa fa-trash"></i>
                    </span>
                </div>
        }
    ]

    const setStatusFalse = () => {
        reset(); setUpdateStatus(updateStatus + 1); setDocumentID(''); setSelectedFileName([]); setSelectedFile([])
    }

    const DeleteDocumentManagement = () => {
        const val = { 'DocumentID': DocumentID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameDocument/Delete_NameDocument', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                setDeleteModal(false)
                toastifySuccess(message);
                if (count) {
                    get_Property_Count(count);
                }
                else if (possessionID) {
                    get_MasterName_Count(possessionID);

                } else if (possessionID) {
                    get_vehicle_Count(possessionID || ownerOfID);
                }
                get_Documentdata(possessionID || ownerOfID, mstPossessionID);
            } else { console.log("Somthing Wrong"); }
        })
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
        <div>
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
                        <label htmlFor="" className='label-name '>File Attachement{errors.File_Not_Selected !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-10 text-field mt-2">
                        <input type="file" className='requiredColor' name='DocumentFile' onChange={changeHandler} multiple required />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2 mt-3">
                        <label htmlFor="" className='label-name '> Notes </label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-10 " >
                        <textarea name='DocumentNotes' id="DocumentNotes" value={value?.DocumentNotes} onChange={HandleChanges} cols="30" rows='2' className="form-control " ></textarea>
                    </div>
                </div>
                <div className="btn-box text-right mr-1 mb-2 mt-1">
                    <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
                    <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                </div>

            </div>
            {
                deleteModal &&
                <div className="modal" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="box text-center py-5">
                                <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                <div className="btn-box mt-3">
                                    <button type="button" onClick={() => { DeleteDocumentManagement(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                    <button type="button" onClick={() => { setDeleteModal(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
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
                    }}
                    pagination
                    fixedHeaderScrollHeight='120px'
                    paginationPerPage={'10'}
                    paginationRowsPerPageOptions={[10, 15, 20, 50]}
                    highlightOnHover
                    noDataComponent={"There are no data to display"}
                />
            </div>
            <MasterChangesModal func={check_Validation_Error} />
        </div>
    )
}

export default MasterDocument

function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File*';
    }

}