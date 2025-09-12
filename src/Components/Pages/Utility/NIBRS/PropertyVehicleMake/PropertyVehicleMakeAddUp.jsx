import React, { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Decrypt_Id_Name } from '../../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation'



const PropertyVehicleMakeAddUp = (props) => {

    const { PropertyVehicleMakeID, status, get_data_PropertyVehicleMake, PropertyVehicleMakeData, modal, setModal, PropertyVehicleMakeupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [propertyVehicleMakeEditval, setPropertyVehicleMakeEditval] = useState();
    const [value, setValue] = useState({
        'PropertyVehicleMakeCode': '',
        'Description': '',
        'AgencyID': '',
        'Iseditable': '0',
        'PropertyVehicleMakeID': '',
        'IsActive': '',
        'ModifiedByUserFK': '',
        'MultiAgency_Name': '',
        'AgencyName': '',
        'AgencyCode': '',
    });


    const reset = () => {
        setValue({
            ...value,
            'PropertyVehicleMakeCode': '',
            'Description': '',
            'AgencyID': '',
            'Iseditable': '',
            'PropertyVehicleMakeID': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyName': '',
            'MultiAgency_Name': '',
            'AgencyCode': '',

        })
        setErrors({
            'PropertyVehicleMakeCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'PropertyVehicleMakeCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (PropertyVehicleMakeID) {
            GetSingleDataBias()
        }
    }, [PropertyVehicleMakeID, PropertyVehicleMakeupdStatus])

    const GetSingleDataBias = () => {
        const val = { 'PropertyVehicleMakeID': PropertyVehicleMakeID }
        fetchPostData('PropertyVehicleMake/GetSingleData_PropertyVehicleMake', val)
            .then((res) => {


                if (res) setPropertyVehicleMakeEditval(res)
                else setPropertyVehicleMakeEditval()
            })
    }


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "PropertyVehicleMakeCode": propertyVehicleMakeEditval[0]?.PropertyVehicleMakeCode,
                'AgencyID': propertyVehicleMakeEditval[0]?.AgencyID,
                'AgencyCode': propertyVehicleMakeEditval[0]?.AgencyCode,
                "Description": propertyVehicleMakeEditval[0]?.Description,
                'PropertyVehicleMakeID': propertyVehicleMakeEditval[0]?.PropertyVehicleMakeID,
                'Iseditable': propertyVehicleMakeEditval[0]?.Iseditable,
                'IsActive': propertyVehicleMakeEditval[0]?.IsActive,
                'MultiAgency_Name': propertyVehicleMakeEditval[0]?.MultiAgency_Name,
                'AgencyName': propertyVehicleMakeEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(propertyVehicleMakeEditval[0]?.MultipleAgency) : '',
                'CreatedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID'),
                'ModifiedByUserFK': Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
            })
        }
        else {
            setValue({
                ...value,
                "PropertyVehicleMakeCode": '',
                "Description": '',
                'PropertyVehicleMakeID': '',
                'AgencyName': '',
                'ModifiedByUserFK': '',
                'MultiAgency_Name': ''

            })
        }
    }, [propertyVehicleMakeEditval])

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

    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }


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
                ['AgencyID']: id.toString(), ['MultiAgency_Name']: name.toString()
            })
        }
    }


    useEffect(() => {
        if (modal) { getAgency(); }
    }, [modal])

    const getAgency = async () => {
        const value = {
            AgencyID: Decrypt_Id_Name(localStorage.getItem('AgencyID'), 'AForAgencyID'),
            PINID: Decrypt_Id_Name(localStorage.getItem('PINID'), 'UForUserID')
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const Add_PropertyVehicleMake = (e) => {
        const result = PropertyVehicleMakeData?.find(item => {
            if (item.PropertyVehicleMakeCode === value.PropertyVehicleMakeCode) {
                return item.PropertyVehicleMakeCode === value.PropertyVehicleMakeCode
            } else return item.PropertyVehicleMakeCode === value.PropertyVehicleMakeCode
        });
        const result1 = PropertyVehicleMakeData?.find(item => {
            if (item.Description === value.Description) {
                return item.Description === value.Description
            } else return item.Description === value.Description
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['PropertyVehicleMakeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('PropertyVehicleMake/InsertPropertyVehicleMake', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['PropertyVehicleMakeCodeError']: '' })
                setModal(false)
                get_data_PropertyVehicleMake();
                reset();
            })

        }
    }

    const Update_PropertyVehicleMake = () => {
        const result = PropertyVehicleMakeData?.find(item => {
            if (item.PropertyVehicleMakeID != PropertyVehicleMakeID) {
                if (item.PropertyVehicleMakeCode === value.PropertyVehicleMakeCode) {
                    return item.PropertyVehicleMakeCode === value.PropertyVehicleMakeCode
                } else return item.PropertyVehicleMakeCode === value.PropertyVehicleMakeCode
            }
        });
        const result1 = PropertyVehicleMakeData?.find(item => {
            if (item.PropertyVehicleMakeID != value.PropertyVehicleMakeID) {
                if (item.Description === value.Description) {
                    return item.Description === value.Description
                } else return item.Description === value.Description
            }
        });
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['PropertyVehicleMakeCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('PropertyVehicleMake/UpdatePropertyVehicleMake', value).then((res) => {
                console.log('this value', value)
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['PropertyVehicleMakeCodeError']: '' })
                get_data_PropertyVehicleMake();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.PropertyVehicleMakeCode)) {
            setErrors(prevValues => { return { ...prevValues, ['PropertyVehicleMakeCodeError']: RequiredField(value.PropertyVehicleMakeCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DescriptionError, PropertyVehicleMakeCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && PropertyVehicleMakeCodeError === 'true') {
            if (status) Update_PropertyVehicleMake()
            else Add_PropertyVehicleMake()
        }
    }, [DescriptionError, PropertyVehicleMakeCodeError])

    const closeModal = () => {
        reset();
        setModal(false);
    }


    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PropertyVehicleMakeModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Property Vehicle Make</legend>

                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='PropertyVehicleMakeCode' onChange={handlChanges} value={value.PropertyVehicleMakeCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.PropertyVehicleMakeCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.PropertyVehicleMakeCodeError}</span>
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
                                                <div className="col-12">
                                                    <div className="row pt-2">
                                                        <div className="col-12 col-md-12 col-lg-12 dropdown__box">
                                                            {
                                                                value?.AgencyName ?
                                                                    <Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        defaultValue={value?.AgencyName}
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    /> : <Select
                                                                        name='AgencyID'
                                                                        isMulti
                                                                        isClearable
                                                                        options={agencyData}
                                                                        onChange={Agencychange}
                                                                        placeholder="Select Agency"
                                                                    />

                                                            }
                                                            <label>Agency</label>
                                                        </div>
                                                    </div>
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

export default PropertyVehicleMakeAddUp;


export const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result

}

export const changeArrayFormat_WithFilter = (data) => {
    const result = data?.map((sponsor) =>
        ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
    )
    return result
}