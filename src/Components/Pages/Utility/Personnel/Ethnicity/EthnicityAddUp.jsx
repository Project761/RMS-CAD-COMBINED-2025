import React, { useState,useEffect,useCallback } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate,fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../Validation';


const EthnicityAddUp = (props) => {

    const { ethnicityID, status, get_data_Ethnicity, ethnicityData, modal, setModal, ethnicityupdStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [ethnicityEditval, setEthnicityEditval] = useState();

    const [value, setValue] = useState({
        'EthnicityCode': '',
        'Description': '',
        'EthnicityID': '',
        'IsActive': '',
        'DeletedByUserFK': '',
        'AgencyId': '', 'MultiAgency_Name': '',
        'AgencyName': '', 'AgencyCode': '',
    });

    const reset = () => {
        setValue({
            ...value,
            'EthnicityCode': '',
            'Description': '',
            'EthnicityID': '',
            'IsActive': '',
            'CreatedByUserFK': '',
            'ModifiedByUserFK': '',
            'DeletedByUserFK': '',
            'AgencyId': '',
            'AgencyName': '', 'MultiAgency_Name': '', 'AgencyCode': '',
        })
        setErrors({
            ...errors,
            'EthnicityCodeError': '',
            'DescriptionError': '',
        })
    }

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'EthnicityCodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (ethnicityID) {
            GetSingleData_Gender()
        }
    }, [ethnicityID, ethnicityupdStatus])

    const GetSingleData_Gender = () => {
        const val = { 'EthnicityID': ethnicityID }
        fetchPostData('TableManagement/GetSingleData_Ethnicity', val)
            .then((res) => {
                if (res) setEthnicityEditval(res)
                else setEthnicityEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "EthnicityCode": ethnicityEditval[0]?.EthnicityCode,
                'AgencyCode': ethnicityEditval[0]?.AgencyCode,
                "Description": ethnicityEditval[0]?.Description,
                'EthnicityID': ethnicityEditval[0]?.ethnicityID, 'MultiAgency_Name': ethnicityEditval[0]?.MultiAgency_Name,
                'AgencyId': ethnicityEditval[0]?.AgencyID, 'IsActive': ethnicityEditval[0]?.IsActive,
                'AgencyName': ethnicityEditval[0]?.MultipleAgency ? changeArrayFormat_WithFilter(ethnicityEditval[0]?.MultipleAgency) : '',
            })
        }
        else {
            setValue({
                ...value,
                "EthnicityCode": '',
                "Description": '',
                'EthnicityID': '',
                'AgencyId': '', 'AgencyName': '', 'MultiAgency_Name': '', 'IsActive': '', 'ModifiedByUserFK': '', 'AgencyCode': '',
            })
        }
    }, [ethnicityEditval])


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

    const Add_Ethnicity = (e) => {
        const result = ethnicityData?.find(item => {
            if (item.EthnicityCode === value.EthnicityCode) {
                return item.EthnicityCode === value.EthnicityCode
            } else return item.EthnicityCode === value.EthnicityCode
        });
        const result1 = ethnicityData?.find(item => {
            if (item.Description === value.Description) {
                return item.Description === value.Description
            } else return item.Description === value.Description
        });
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['EthnicityCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {

            AddDeleteUpadate('TableManagement/InsertEthnicity', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['EthnicityCodeError']: '' })
                setModal(false)
                get_data_Ethnicity();
                reset();
            })
        }
    }

    const update_Ethnicity = () => {
        const result = ethnicityData?.find(item => {
            if (item.ethnicityID != ethnicityID) {
                if (item.EthnicityCode === value.EthnicityCode) {
                    return item.EthnicityCode === value.EthnicityCode
                } else return item.EthnicityCode === value.EthnicityCode
            }
        }
        );
        const result1 = ethnicityData?.find(item => {
            if (item.ethnicityID != ethnicityID) {
                if (item.Description === value.Description) {
                    return item.Description === value.Description
                } else return item.Description === value.Description
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Ethnicity Code Already Exists')
                setErrors({ ...errors, ['EthnicityCodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('TableManagement/UpdateEthnicity', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data_Ethnicity();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.EthnicityCode)) {
            setErrors(prevValues => { return { ...prevValues, ['EthnicityCodeError']: RequiredField(value.EthnicityCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    const { DescriptionError, EthnicityCodeError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && EthnicityCodeError === 'true') {
            if (status) update_Ethnicity()
            else Add_Ethnicity()
        }
    }, [DescriptionError, EthnicityCodeError])

    const closeModal = () => {
        reset();
        setModal(false);
    }

    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="EthnicityModal" tabIndex="-1"  aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Ethnicity</legend>
                                            <div className="row ">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" name='EthnicityCode' maxLength={10} onChange={handlChanges} value={value.EthnicityCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.EthnicityCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EthnicityCodeError}</span>
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

export default EthnicityAddUp

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

