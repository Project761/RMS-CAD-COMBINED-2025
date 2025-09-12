import React, { useContext, useEffect, useState } from 'react';
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
import PropListng from '../../../ShowAllList/PropListng';

const Document = (props) => {
  const { ListData } = props
  const { get_Property_Count, localStoreArray, get_LocalStorage, } = useContext(AgencyContext);
  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');

  const [propertyDocID, setPropertyDocID] = useState('');
  const [documentdata, setDocumentdata] = useState();
  const [updateStatus, setUpdateStatus] = useState(0);

  const [propertyID, setPropertyID] = useState();
  const [masterPropertyID, setMasterPropertyID] = useState();
  const [mainIncidentID, setMainIncidentID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [documentDrpVal, setDocumentDrpVal] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState([]);
  const [clickedRow, setClickedRow] = useState(null);

  const localStore = {
    Value: "",
    UniqueId: localStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(localStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', propertyID: '', masterPropertyID: '', }),
  }

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        setMainIncidentID(parseInt(localStoreArray?.IncidentID));
        if (localStoreArray?.PropertyID || localStoreArray.MasterPropertyID) {
          setMasterPropertyID(localStoreArray?.MasterPropertyID);
          setPropertyID(localStoreArray?.PropertyID);
          get_Documentdata(localStoreArray?.PropertyID, localStoreArray?.MasterPropertyID);
        }
        else {
          setPropertyID('');
          setMasterPropertyID('');
        }
      }
    }
  }, [localStoreArray])

  const [value, setValue] = useState({
    'CreatedByUserFK': loginPinID, 'MasterPropertyID': masterPropertyID, 'PropertyID': '', 'DocName': '', 'Notes': '', 'DocTypeID': null,
    'AgencyID': '', 'File': '',
  })

  useEffect(() => {
    setValue({ ...value, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'MasterPropertyID': masterPropertyID, 'PropertyID': propertyID })
  }, [propertyID, loginPinID, masterPropertyID, updateStatus]);

  const [errors, setErrors] = useState({
    'DocNameError': '', 'DocTypeIDError': '', 'File_Not_Selected': '',
  })

  const check_Validation_Error = (e) => {
    const DocNameErr = RequiredField(value.DocName);
    const DocTypeIDErr = RequiredFieldIncident(value.DocTypeID);
    const File_Not_SelectedErr = validate_fileupload(selectedFileName);
    setErrors(prevValues => {
      return {
        ...prevValues,
        ['DocNameError']: DocNameErr || prevValues['DocNameError'],
        ['DocTypeIDError']: DocTypeIDErr || prevValues['DocTypeIDError'],
        ['File_Not_Selected']: File_Not_SelectedErr || prevValues['File_Not_Selected'],
      }
    })
  }

  // Check All Field Format is True Then Submit 
  const { DocNameError, DocTypeIDError, File_Not_Selected } = errors

  useEffect(() => {
    if (DocNameError === 'true' && DocTypeIDError === 'true' && File_Not_Selected === 'true') {
      Add_Document();
    }
  }, [DocNameError, DocTypeIDError, File_Not_Selected])

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

  const get_Documentdata = (propertyID, masterPropertyID) => {
    const val = { 'PropertyID': propertyID, 'MasterPropertyID': masterPropertyID, }
    const val2 = { 'MasterPropertyID': masterPropertyID, 'PropertyID': 0, }
    fetchPostData(openPage === 'masterProperty' ? 'MainMasterPropertyDocument/GetData_MainMasterPropertyDocument' : 'PropertyDocument/GetData_PropertyDocument', openPage === 'masterProperty' ? val2 : val).then((res) => {
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
    const newData = [];
    const EncDocs = [];
    // multiple file upload <----
    for (let i = 0; i < selectedFile.length; i++) {
      formdata.append("File", selectedFile[i])
      EncFormdata.append("File", selectedFile[i])
    
    }

    const values = JSON.stringify(value);
    newData.push(values);

    const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(value)]));
    EncDocs.push(EncPostData);

    formdata.append("Data", JSON.stringify(newData));
    EncFormdata.append("Data", EncDocs);

    AddDelete_Img(openPage === 'masterProperty' ? 'MainMasterPropertyDocument/Insert_MainMasterPropertyDocument' : 'PropertyDocument/Insert_PropertyDocument', formdata, EncFormdata).then((res) => {
      if (res.success) {
        get_Documentdata(propertyID, masterPropertyID);
        setErrors({ ...errors, 'DocNameError': '', })
        get_Property_Count(propertyID);
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
          <Link to={'#'} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0" >
            <i className="fa fa-eye"></i>
          </Link>
        </div>
    },
    {
      width: '250px',
      name: 'Document Name',
      selector: (row) => row.DocName,
      sortable: true
    },
    {
      width: '250px',
      name: 'Document Notes',
      selector: (row) => row.Notes,
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
          <Link to={'#'} onClick={() => { setPropertyDocID(row.PropertyDocID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
            <i className="fa fa-trash"></i>
          </Link>
        </div>

    }
  ]

  const setStatusFalse = (e, row) => {
    reset();
    setUpdateStatus(updateStatus + 1);
    setPropertyDocID(row.PropertyDocID);
  }

  const DeleteDocumentManagement = () => {
    const val = {
      'PropertyDocID': propertyDocID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('PropertyDocument/Delete_PropertyDocument', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Property_Count(propertyID);
        get_Documentdata(propertyID, masterPropertyID);
      } else console.log("Somthing Wrong");
    })
  }

  const closeModal = () => {
    reset(); setSelectedFileName([]); setSelectedFile([])
  }

  const reset = () => {
    setValue({
      ...value,
      'DocName': '', 'Notes': '', 'DocTypeID': '', 'File': '', 'selectedFileName': '', 'File_Not_Selected': '', 'fileName': '',
    });
    document.querySelector("input[type='file']").value = "";
    setErrors({
      ...errors,
      'fileName': '', 'DocNameError': '', 'DocTypeIDError': '', 'File_Not_Selected': '',
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
      <PropListng {...{ ListData }} />
      <div className="col-12 col-md-12 pt-2 p-0" >
        
        <div className="row">
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <label htmlFor="" className='label-name '>Document Name{errors.DocNameError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocNameError}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-4 text-field mt-2" >
            <input type="text" className="requiredColor" value={value?.DocName} name="DocName" id='DocName' onChange={HandleChanges} required autoComplete='off' />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <Link to={'/ListManagement?page=Document%20Type&call=/Prop-Home'} className='new-link'>
              Document Type{errors.DocTypeIDError !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocTypeIDError}</p>
              ) : null}
            </Link>
          </div>
          <div className="col-3 col-md-3 col-lg-4  mt-2" >
            <Select
              name='DocTypeID'
              styles={colourStyles}
              value={documentDrpVal?.filter((obj) => obj.value === value?.DocTypeID)}
              isClearable
              options={documentDrpVal}
              onChange={(e) => ChangeDropDown(e, 'DocTypeID')}
              placeholder="Select.."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <label htmlFor="" className='label-name '>File Attachement{errors.File_Not_Selected !== 'true' ? (
              <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-4 text-field mt-2">
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
            <label htmlFor="" className='label-name '>Notes </label>
          </div>
          <div className="col-3 col-md-3 col-lg-4 text-field mt-2" >
            <textarea name='Notes' id="Notes" value={value?.Notes} onChange={HandleChanges} cols="30" rows='3' className="form-control pt-2 pb-2  requiredColor" ></textarea>
          </div>
        </div>
        <div className="btn-box text-right mr-1 mb-2">
          <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
          <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
          <button type="button" data-dismiss="modal" onClick={closeModal} className="btn btn-sm btn-success mr-1" >Close</button>
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