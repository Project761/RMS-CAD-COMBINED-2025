import React, { useCallback, useEffect, useState, useContext } from 'react'
import Select from "react-select";
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredField, RequiredFieldSpaceNotAllow } from '../../../Agency/AgencyValidation/validators';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Space_Allow_with_Trim } from '../../../Utility/Personnel/Validation';

const DocumentAddUp = (props) => {

    const { get_vehicle_Count } = useContext(AgencyContext)
    const { vehicleID, loginPinID, loginAgencyID, updateStatus, get_Documentdata, modal, setModal, status, incidentID, } = props

    const [documentDrpVal, setDocumentDrpVal] = useState([]);
    const [editval, setEditval] = useState();
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);

    const [value, setValue] = useState({
        'VehicleID': '',
        'MasterPropertyID': 0,
        'PropertyID:': 0,
        'DocumentName': '',
        'Notes': '',
        'File': '',
        'DocumentTypeId': 0,
        'CreatedByUserFK': '',
        'ModifiedByUserFK': '',
        'AgencyID': '',
    })

    const [errors, setErrors] = useState({
        'DocumentNameError': '', 'DocumentNotesError': '', 'DocumentTypeIdError': '', 'File_Not_Selected': '',
    })

    useEffect(() => {
        setValue({ ...value, 'VehicleID': vehicleID, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, })
    }, [vehicleID, updateStatus]);

    useEffect(() => {
        if (vehicleID) {
            GetSingleData(vehicleID)
        }
    }, [vehicleID])

    const GetSingleData = (vehicleID) => {
        const val = { 'VehicleID': vehicleID }
        fetchPostData('IncidentDocumentManagement/GetSingleData_IncidentDocManagement', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (vehicleID) {
            setValue({
                ...value,
                'VehicleID': editval[0]?.vehicleID,
                'DocumentName': editval[0]?.DocumentName,
                'Notes': editval[0]?.Notes,
                'DocumentTypeId': editval[0]?.DocumentTypeId,
                'IncidentId': incidentID,
                'ModifiedByUserFK': loginPinID,
            })
        }
        else {
            setValue({
                ...value,
                'DocumentName': '',
                'Notes': '',
                'DocumentFile': '',
                'DocumentTypeId': null,
                'ModifiedByUserFK': '',
            })
        }
    }, [editval])


    const reset = () => {
        setValue({
            ...value,
            'DocumentName': '', 'Notes': '',
            'DocumentFile': '',
            'DocumentTypeId': '', 'DocumentTypeIdName': '',
        });
        setErrors({
            'DocumentNameError': '', 'DocumentNotesError': '', 'DocumentTypeIdError': '', 'File_Not_Selected': '',
        }); setSelectedFileName(''); setModal(false);
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldSpaceNotAllow(value.DocumentName)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentNameError']: RequiredFieldSpaceNotAllow(value.DocumentName) } })
        }
        if (Space_Allow_with_Trim(value.Notes)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentNotesError']: Space_Allow_with_Trim(value.Notes) } })
        }
        if (RequiredField(value.DocumentTypeId)) {
            setErrors(prevValues => { return { ...prevValues, ['DocumentTypeIdError']: RequiredField(value.DocumentTypeId) } })
        }
        if (validate_fileupload(selectedFileName)) {
            setErrors(prevValues => { return { ...prevValues, ['File_Not_Selected']: validate_fileupload(selectedFileName) } })
        }
    }

    const { DocumentNameError, DocumentNotesError, DocumentTypeIdError, File_Not_Selected } = errors

    useEffect(() => {
        if (DocumentNameError === 'true' && DocumentNotesError === 'true' && DocumentTypeIdError === 'true' && File_Not_Selected === 'true') {
            if (status) Update_Document()
            else Add_Document()
        }
    }, [DocumentNameError, DocumentNotesError, DocumentTypeIdError, File_Not_Selected])


    const handleChange = (e) => {
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

    useEffect(() => {
        if (loginAgencyID) {
            get_DocumentDropDwn(loginAgencyID);
        }
    }, [loginAgencyID])

    const get_DocumentDropDwn = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('DocumentType/GetDataDropDown_DocumentType', val).then((data) => {
            if (data) {
                setDocumentDrpVal(Comman_changeArrayFormat(data, 'DocumentTypeID', 'Description'));
            }
            else {
                setDocumentDrpVal([])
            }
        })
    };

    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) {
            nameArray?.push(name?.name)
        }
        setSelectedFileName(nameArray);
    };

    const Add_Document = () => {
        const formdata = new FormData();
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("File", selectedFile[i])
        }
        const values = JSON.stringify(value);
        formdata.append("Data", values);
        AddDeleteUpadate('VehicleDocument/Insert_VehicleDocument', formdata)
            .then((res) => {
                if (res.success) {
                    toastifySuccess(res.Message);
                    get_vehicle_Count(vehicleID)
                    get_Documentdata(vehicleID);
                    setModal(false);
                    setSelectedFileName([]);
                    setSelectedFile([]);
                    reset();
                } else {
                    console.log("something Wrong");
                }
            })
            .catch(err => console.log(err))
    }

    const Update_Document = () => {
        AddDeleteUpadate('IncidentDocumentManagement/Update_IncidentDocManagement', value).then((res) => {
            toastifySuccess(res.Message);
            setModal(false);
            get_Documentdata(vehicleID);
            reset();
        })
    }

    const closeModal = () => {
        reset();
        setModal(false);
        setSelectedFileName([]);
        setSelectedFile([]);
    };

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

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    return (
        <>
            {
                modal ?

                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="DocumentModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Document</legend>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-6 col-md-6  col-lg-6 mt-1">
                                                            <div className="text-field">
                                                                <input type="text" className='requiredColor' name='DocumentName' value={value.DocumentName} onChange={handleChange} required />
                                                                <label className=''>Document Name</label>
                                                                {errors.DocumentNameError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentNameError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-6">
                                                            <div className=" dropdown__box">
                                                                <Select
                                                                    name='DocumentTypeId'
                                                                    styles={colourStyles}
                                                                    value={documentDrpVal?.filter((obj) => obj.value === value?.DocumentTypeId)}
                                                                    isClearable
                                                                    options={documentDrpVal}
                                                                    onChange={(e) => ChangeDropDown(e, 'DocumentTypeId')}
                                                                    placeholder="Select.."
                                                                />
                                                                <label htmlFor="">Document Type</label>
                                                                {errors.DocumentTypeIdError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentTypeIdError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-6  col-lg-12 mt-3 ">
                                                            <div className="text-field col-12 ">
                                                                <input type="file" className='requiredColor' name='DocumentFile' onChange={changeHandler} multiple required />
                                                                <label className='mt-1'>File Attachement</label>
                                                            </div>

                                                            {errors.File_Not_Selected !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</span>
                                                            ) : null}
                                                        </div>
                                                        <div className="col-12  col-md-12 col-lg-12  dropdown__box" style={{ marginTop: '10px' }}>
                                                            <textarea name='Notes' onChange={handleChange} id="Comments" value={value.Notes} cols="30" rows='3' className="form-control pt-2 pb-2 requiredColor" ></textarea>
                                                            <label htmlFor="" className='pt-1'>Notes</label>
                                                            {errors.DocumentNotesError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DocumentNotesError}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="btn-box text-right mt-3 mr-1 mb-2">
                                    <button type="button" onClick={(e) => { check_Validation_Error(); }} className="btn btn-sm btn-success mr-1">Save</button>
                                    <button type="button" data-dismiss="modal" onClick={closeModal} className="btn btn-sm btn-success mr-1" >Close</button>
                                </div>
                            </div>
                        </div>
                    </dialog>

                    :
                    <></>
            }
        </>
    )
}

export default DocumentAddUp

function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File..';
    }

}