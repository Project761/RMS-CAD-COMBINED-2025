import { useEffect, useState, useContext } from 'react'
import { AddDeleteUpadate } from '../../../../hooks/Api';
import { RequiredField } from '../../AgencyValidation/validators';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';

const AgencyContactAddUpp = (props) => {

    const { get_CountList } = useContext(AgencyContext)
    const { aId, pinID, get_Agency_Contact_data, agencyContactEditData, relationUpdStatus, openModal, setOpenModal, agencyContactData, status } = props

    const [value, setValue] = useState({
        'FirstName': '',
        'MiddleName': '',
        'LastName': '',
        'AgencyID': aId,
        'Phone1': '',
        'Phone2': '',
        'Fax': '',
        'Cell': '',
        'Email': '',
        'CreatedByUserFK': pinID,
        'AgencyEmergencyID': '',
    })

    useEffect(() => {
        if (agencyContactEditData?.AgencyEmergencyID) {
            setValue({
                'FirstName': agencyContactEditData?.FirstName,
                'MiddleName': agencyContactEditData?.MiddleName,
                'LastName': agencyContactEditData?.LastName,
                'AgencyID': agencyContactEditData?.AgencyID,
                'Phone1': agencyContactEditData?.Phone1,
                'Phone2': agencyContactEditData?.Phone2,
                'Fax': agencyContactEditData?.Fax,
                'Cell': agencyContactEditData?.Cell,
                'Email': agencyContactEditData?.Email,
                'CreatedByUserFK': agencyContactEditData?.CreatedByUserFK,
                'AgencyEmergencyID': agencyContactEditData?.AgencyEmergencyID,
            });
        } else {
            setValue({
                ...value,
                'FirstName': '',
                'MiddleName': '',
                'LastName': '',
                'Phone1': '',
                'Phone2': '',
                'Fax': '',
                'Cell': '',
                'Email': '',
                'AgencyEmergencyID': '',
            });
        }
    }, [agencyContactEditData, relationUpdStatus])

    // initialization Error Hooks
    const [errors, setErrors] = useState({
        'FirstNameError': '', 'LastNameError': '', 'Phone1Error': '', 'Phone2Error': '', 'CellError': '', 'FaxError': '', 'EmailError': ''
    })

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.FirstName)) {
            setErrors(prevValues => { return { ...prevValues, ['FirstNameError']: RequiredField(value.FirstName) } })
        }
        if (RequiredField(value.LastName)) {
            setErrors(prevValues => { return { ...prevValues, ['LastNameError']: RequiredField(value.LastName) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { FirstNameError, LastNameError, } = errors

    useEffect(() => {
        if (FirstNameError === 'true' && LastNameError === 'true') {
            if (status) { Update_Agency_Contact() }
            else { Add_Agency_contact() }
        }
    }, [FirstNameError, LastNameError,])


    const reset = () => {
        setValue({
            ...value,
            'FirstName': '',
            'MiddleName': '',
            'LastName': '',
            'Phone1': '',
            'Phone2': '',
            'Fax': '',
            'Cell': '',
            'Email': '',
            'AgencyEmergencyID': '',
            'FirstNameError': '',
            'LastNameError': '',
        })
        setErrors({
            ...errors,
            'FirstNameError': '',
            'LastNameError': '',
        })
    }

    const handlChanges = (e) => {
        if (e.target.name === 'Phone1' || e.target.name === 'Phone2' || e.target.name === 'Cell' || e.target.name === 'Fax') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                    })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const Add_Agency_contact = (e) => {
        const result1 = agencyContactData?.find(item => item.FirstName === value.FirstName);
        const result = agencyContactData?.find(item => item.LastName === value.LastName);
        if (result || result1) {
            if (result) {
                toastifyError('FirstName Already Exists')
                setErrors({ ...errors, ['FirstNameError']: '' })
            }
            if (result1) {
                toastifyError('LastName Already Exists')
                setErrors({ ...errors, ['LastNameError']: '' })
            }
        } else {
            AddDeleteUpadate('AgencyEmergencyContact/InsertAgency_EmergencyContact', value).then((res) => {
                if (res) {
                    toastifySuccess(res.Message)
                    setErrors({ ...errors, ['LastNameError']: '' })
                    get_Agency_Contact_data(aId);
                    reset()
                    get_CountList(aId);
                    setOpenModal(false)
                }
            })
        }
    }

    const Update_Agency_Contact = (e) => {
        const result = agencyContactData?.find(item => {
            if (item.AgencyEmergencyID != value.AgencyEmergencyID) {
                if (item.FirstName === value.FirstName) {
                    return item.FirstName === value.FirstName
                } else return item.FirstName === value.FirstName
            }
            return false;
        });
        const result1 = agencyContactData?.find(item => {
            if (item.AgencyEmergencyID != value.AgencyEmergencyID) {
                if (item.LastName === value.LastName) {
                    return item.LastName === value.LastName
                } else return item.LastName === value.LastName
            }
            return false;
        });
        if (result || result1) {
            if (result) {
                toastifyError('FirstName Already Exists')
                setErrors({ ...errors, ['FirstNameError']: '' })
            }
            if (result1) {
                toastifyError('LastName Already Exists')
                setErrors({ ...errors, ['LastNameError']: '' })
            }
        } else {
            AddDeleteUpadate('AgencyEmergencyContact/UpdateAgency_EmergencyContact', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message);
                        get_Agency_Contact_data(aId);
                        reset()
                        setOpenModal(false)
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }


    const closeModal = () => {
        reset();
        setOpenModal(false)
    }

    return (
        <>
            {
                openModal ?
                    <dialog className="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="AgencyContact" data-backdrop="false" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className=" modal-dialog modal-lg modal-dialog-centered ">
                            <div className="modal-content">
                                <div className="modal-body ">
                                    <div className="m-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Agency Contact</legend>
                                            <div className="row " >
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" className='requiredColor' id="FirstName" name='FirstName' value={value.FirstName} onChange={handlChanges} required />
                                                        <label>First Name</label>
                                                        {errors.FirstNameError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.FirstNameError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" id="MiddleName" name='MiddleName' value={value.MiddleName} onChange={handlChanges} required />
                                                        <label>Middle Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" className='requiredColor' id="LastName" name='LastName' value={value.LastName} onChange={handlChanges} required />
                                                        <label>Last Name</label>
                                                        {errors.LastNameError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.LastNameError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">

                                                        <input type="text" maxLength={10} id="Phone1" name='Phone1' value={value.Phone1} onChange={handlChanges} required />
                                                        <label>Phone1</label>

                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} id="Phone2" name='Phone2' value={value.Phone2} onChange={handlChanges} required />
                                                        <label>Phone2</label>

                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} id="Fax" name='Fax' value={value.Fax} onChange={handlChanges} required />
                                                        <label>Fax</label>

                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="Phone" maxLength={10} id="Cell" name='Cell' value={value.Cell} onChange={handlChanges} required />
                                                        <label>Cell</label>

                                                    </div>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <div className="text-field">
                                                        <input type="Email" name='Email' value={value.Email} onChange={handlChanges} required />
                                                        <label>Email</label>

                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {
                                                status ?
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Update</button>
                                                    :
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error} >Save</button>
                                            }
                                            <button type="button" className="btn btn-sm btn-success mr-1" data-dismiss="modal" onClick={() => closeModal()} >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    :
                    <> </>
            }
        </>
    )
}

export default AgencyContactAddUpp