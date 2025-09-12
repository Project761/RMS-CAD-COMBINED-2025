import  { useCallback, useState, useEffect } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../Validation';


const EmployeeTypeAddUp = (props) => {

    const { employeeTypeID, status, get_data_EmployeeType, employeeTypeData, modal, setModal, relationUpdStatus } = props

    const [agencyData, setAgencyData] = useState([])
    const [employeeTypeEditval, setEmployeeTypeEditval] = useState();
    const [value, setValue] = useState({
        'EmployeeCode': '',
        'Description': '',
        'EthnicityID': '',
        'IsActive': '',
        'ModifiedByUserFK': '',
        'DeletedByUserFK': '',
        'AgencyId': '',
        'AgencyName': '', 'MultiAgency_Name': '',
        'AgencyCode': ''
    });

    const reset = () => {
        setValue({
            ...value,
            'EmployeeCode': '',
            'Description': '',
            'EmployeeTypeID': '',
            'IsActive': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyId': '', 'MultiAgency_Name': '', 'AgencyName': '', 'AgencyCode': ''
        })
        setErrors({
            ...errors,
            'EmployeeCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'EmployeeCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (employeeTypeID) {
            GetSingleData_Gender()
        }
    }, [employeeTypeID, relationUpdStatus])

    const GetSingleData_Gender = () => {
        const val = { 'EmployeeTypeID': employeeTypeID }
        fetchPostData('TableManagement/GetSingleData_EmployeeType', val)
            .then((res) => {
                console.log(res);
                if (res) setEmployeeTypeEditval(res)
                else setEmployeeTypeEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "EmployeeCode": employeeTypeEditval[0]?.EmployeeCode,
                "Description": employeeTypeEditval[0]?.Description,
                'AgencyCode': employeeTypeEditval[0]?.AgencyCode,
                'EmployeeTypeID': employeeTypeEditval[0]?.employeeTypeID, 'MultiAgency_Name': employeeTypeEditval[0]?.MultiAgency_Name,
                'AgencyId': employeeTypeEditval[0]?.AgencyID, 'IsActive': employeeTypeEditval[0]?.IsActive,
                'AgencyName': employeeTypeEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(employeeTypeEditval[0]?.MultipleAgency) : '',
            })
        }
        else {
            setValue({
                ...value,
                "EmployeeCode": '',
                "Description": '',
                'EmployeeTypeID': '',
                'AgencyId': '', 'ModifiedByUserFK': '', 'MultiAgency_Name': '', 'AgencyName': '', 'AgencyCode': ''
            })
        }
    }, [employeeTypeEditval])

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

    const Agencychange = (e) => {
        const id = []
        const name = []
        if (e) {
            e.map((item, i) => {
                id.push(item.value);
                name.push(item.label)
            })
            setValue({
                ...value,
                ['AgencyId']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }

    useEffect(() => {
        if (modal) { getAgency(); }
    }, [modal])


    const getAgency = async () => {
      
        fetchPostData("Agency/GetData_Agency",).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const Add_EmployeeType = (e) => {
        const result = employeeTypeData?.find(item => {
            if (item.EmployeeCode === value.EmployeeCode) {
                return item.EmployeeCode === value.EmployeeCode
            } else return item.EmployeeCode === value.EmployeeCode
        }
        );
        const result1 = employeeTypeData?.find(item => {
            if (item.Description === value.Description) {
                return item.Description === value.Description
            } else return item.Description === value.Description
        });
        if (result || result1) {
            if (result) {
                toastifyError('Employee Type Code Already Exists')
                setErrors({ ...errors, ['EmployeeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('TableManagement/InsertEmployeeType', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['EmployeeCodeError']: '' })
                setModal(false)
                get_data_EmployeeType();
                reset();
            })
        }
    }

    const update_EmployeeType = () => {
        const result = employeeTypeData?.find(item => {
            if (item.employeeTypeID != value.employeeTypeID) {
                if (item.EmployeeCode === value.EmployeeCode) {
                    return item.EmployeeCode === value.EmployeeCode
                } else return item.EmployeeCode === value.EmployeeCode
            }
        });
        const result1 = EmployeeTypeData?.find(item => {
            if (item.EmployeeTypeID != value.EmployeeTypeID) {
                if (item.Description === value.Description) {
                    return item.Description === value.Description
                } else return item.Description === value.Description
            }
        });
        if (result || result1) {
            if (result) {
                toastifyError('Employee Code Already Exists')
                setErrors({ ...errors, ['EmployeeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('TableManagement/UpdateEmployeeType', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data_EmployeeType();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.EmployeeCode)) {
            setErrors(prevValues => { return { ...prevValues, ['EmployeeCodeError']: RequiredField(value.EmployeeCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, EmployeeCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && EmployeeCodeError === 'true') {
            if (status) update_EmployeeType()
            else Add_EmployeeType()
        }
    }, [DescriptionError, EmployeeCodeError])

    const closeModal = () => {
        reset();
        setModal(false);
    }


    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="EmployeeTypeModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Employee Type</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='EmployeeCode' maxLength={10} onChange={handlChanges} value={value.EmployeeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.EmployeeCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EmployeeCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='AgencyCode' onChange={handlChanges} value={value.AgencyCode} />
                                                        <label>Agency Code</label>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-8 col-lg-8 mt-2">
                                                    <div className="text-field">
                                                        <textarea className='requiredColor' name='Description' onChange={handlChanges} value={value.Description} required cols="30" rows="1"></textarea>
                                                        <label>Description</label>
                                                        {errors.DescriptionError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                    {
                                                        value?.AgencyName ?
                                                            <Select
                                                                isMulti
                                                                name='Agencyid'
                                                                isClearable
                                                                defaultValue={value?.AgencyName}
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            /> : <Select
                                                                isMulti
                                                                name='Agencyid'
                                                                isClearable
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            />
                                                           
                                                    }
                                                    <label>Agency</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {
                                            status ?
                                                <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >update</button>
                                                :
                                                <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Save</button>
                                        }
                                        <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModal()}>Close</button>
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

export default EmployeeTypeAddUp

export const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
}

export const changeArrayFormat_WithFilter = (data) => {
    const result = data.map((sponsor) =>
        ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
}