import React, { useState, useEffect, useCallback } from 'react'
import Select from 'react-select'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import { RequiredField } from '../../Personnel/Validation';


const SMTLocationAddUp = (props) => {

    const { loginPinID, loginAgencyID, singleTypeId, status, get_data, listData, modal, setModal, updateStatus } = props
    const [agencyData, setAgencyData] = useState([])
    const [smtData, setSmtData] = useState([])
    const [editval, setEditval] = useState();

    const [value, setValue] = useState({
        'SMTLocationCode': '', 'AgencyCode': '', 'SMTTypeID': '', 'Description': '', 'AgencyID': '', 'MultiAgency_Name': '', 'IsEditable': 0, 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1', 'SMTLocationID': '',
        'SMTTypeName': ''
    });

    const [errors, setErrors] = useState({
        'CodeError': '',
        'DescriptionError': '',
    })

    useEffect(() => {
        if (agencyData?.length === 0 && modal) {
            if (loginPinID && loginAgencyID) {
                getAgency(loginAgencyID, loginPinID); get_SMT_Location(loginAgencyID);
                setValue({ ...value, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, })
            }
        }
    }, [modal, loginAgencyID])

    useEffect(() => {
        if (singleTypeId) {
            GetSingleData()
        }
    }, [singleTypeId, updateStatus])

    const GetSingleData = () => {
        const val = { 'SMTLocationID': singleTypeId }
        fetchPostData('SMTLocations/GetSingleData_SMTLocations', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "SMTLocationCode": editval[0]?.SMTLocationCode, 'IsActive': editval[0]?.IsActive,
                "Description": editval[0]?.Description,
                'AgencyCode': editval[0]?.AgencyCode,
                "SMTTypeID": editval[0]?.SMTTypeID,
                'SMTLocationID': editval[0]?.SMTLocationID, 'MultiAgency_Name': editval[0]?.MultiAgency_Name,
                'AgencyID': editval[0]?.AgencyID, 'ModifiedByUserFK': loginPinID,
                'SMTTypeName': editval[0]?.SMTTypeName ? changeArrayFormat_WithFilter(editval, 'SMTLocation', smtData) : ''
            })
        }
        else {
            setValue({
                ...value,
                'SMTLocationCode': '', 'AgencyCode': '', 'Description': '', 'AgencyID': '', 'MultiAgency_Name': '', 'ModifiedByUserFK': '', 'AgencyName': '', 'IsActive': '1',
                'SMTLocationID': '', 'SMTTypeID': '', 'SMTTypeName': ''
            })
        }
    }, [editval])


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
    
    const reset = () => {
        setValue({
            ...value,
            'SMTLocationCode': '', 'Description': '', 'AgencyCode': '', 'AgencyID': '', 'MultiAgency_Name': '', 'IsEditable': 0, 'ModifiedByUserFK': '', 'AgencyName': '', 'SMTTypeID': '', 'SMTTypeName': ''
        })
        setErrors({
            ...errors,
            'CodeError': '',
            'DescriptionError': '',
        })
    }

    const handlChanges = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const SMTTypeChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['SMTTypeID']: e.value
            })
        } else setValue({
            ...value,
            ['SMTTypeID']: null
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

    const get_SMT_Location = async (loginAgencyID) => {
        const value = {
            AgencyID: loginAgencyID,
        }
        fetchPostData("SMTTypes/GetDataDropDown_SMTTypes", value).then((data) => {
            if (data) {
                setSmtData(changeArrayFormat(data, 'SMTLocation'))
            } else {
                setSmtData();
            }
        })
    }


    const getAgency = async (loginAgencyID, loginPinID) => {
        const value = {
            AgencyID: loginAgencyID,
            PINID: loginPinID,
        }
        fetchPostData("Agency/GetData_Agency", value).then((data) => {
            if (data) {
                setAgencyData(changeArrayFormat(data))
            } else {
                setAgencyData();
            }
        })
    }

    const Add_Type = (e) => {
        const result = listData?.find(item => {
            if (item.SMTLocationCode === value.SMTLocationCode) {
                return item.SMTLocationCode === value.SMTLocationCode
            } else return item.SMTLocationCode === value.SMTLocationCode
        });
        const result1 = listData?.find(item => {
            if (item.Description === value.Description) {
                return item.Description === value.Description
            } else return item.Description === value.Description
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('SMTLocations/InsertSMTLocations', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['CodeError']: '' })
                setModal(false)
                get_data();
                reset();
            })
        }
    }

    const update_Type = () => {
        const result = listData?.find(item => {
            if (item.SMTLocationID != singleTypeId) {
                if (item.SMTLocationCode === value.SMTLocationCode) {
                    return item.SMTLocationCode === value.SMTLocationCode
                } else return item.SMTLocationCode === value.SMTLocationCode
            }
        });
        const result1 = listData?.find(item => {
            if (item.SMTLocationID != singleTypeId) {
                if (item.Description === value.Description) {
                    return item.Description === value.Description
                } else return item.Description === value.Description
            }
        });
        if (result || result1) {
            if (result) {
                toastifyError('Code Already Exists')
                setErrors({ ...errors, ['CodeError']: '' })
            }
            if (result1) {
                toastifyError('Description Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('SMTLocations/UpdateSMTLocations', value).then((res) => {
                toastifySuccess(res.Message); setErrors({ ...errors, ['DescriptionError']: '' })
                get_data();
                setModal(false)
                reset();
            })
        }
    }

    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.SMTLocationCode)) {
            setErrors(prevValues => { return { ...prevValues, ['CodeError']: RequiredField(value.SMTLocationCode) } })
        }
        if (RequiredField(value.Description)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: RequiredField(value.Description) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { CodeError, DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true' && CodeError === 'true') {
            if (status) update_Type()
            else Add_Type()
        }
    }, [CodeError, DescriptionError])

    const closeModal = () => {
        reset();
        setModal(false);
    }

    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="BloodTypeModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>SMT Location</legend>
                                            <div className="row">
                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <div className="text-field">
                                                        <input type="text" maxLength={10} name='SMTLocationCode' onChange={handlChanges} value={value.SMTLocationCode} className='requiredColor' />
                                                        <label>Code</label>
                                                        {errors.CodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CodeError}</span>
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
                                                <div className=" col-12 col-md-12 col-lg-12 dropdown__box mt-4 ">
                                                    {
                                                        value?.SMTTypeName ?
                                                            <Select
                                                                name='SMTTypeID'
                                                                isClearable
                                                                defaultValue={value.SMTTypeName}
                                                                options={smtData}
                                                                onChange={SMTTypeChanges}
                                                                placeholder="SMT Type"
                                                            />
                                                            :
                                                            <Select
                                                                name='SMTTypeID'
                                                                isClearable
                                                                options={smtData}
                                                                onChange={SMTTypeChanges}
                                                                placeholder="SMT Type"
                                                            />

                                                    }
                                                    <label>SMT Type</label>
                                                </div>
                                                <div className=" mt-4 col-12 col-md-12 col-lg-12 dropdown__box ">
                                                    {
                                                        value?.AgencyName ?
                                                            <Select
                                                                isMulti
                                                                name='AgencyID'
                                                                isClearable
                                                                defaultValue={value.AgencyName}
                                                                options={agencyData}
                                                                onChange={Agencychange}
                                                                placeholder="Select Agency"
                                                            /> : <Select
                                                                isMulti
                                                                name='AgencyID'
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

export default SMTLocationAddUp;

export const changeArrayFormat = (data, type) => {
    if (type === 'SMTLocation') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.SMTTypeID, label: sponsor.Description })
        )
        return result
    }
    else {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, smtData) => {
    if (type === 'SMTLocation') {
        const result = data?.map((sponsor) =>
            (sponsor.SMTTypeID)
        )
        const result2 = smtData?.map((sponsor) => {
            if (sponsor.value === result[0]) {
                return { value: result[0], label: sponsor.label }
            }
        }
        )
        const val = result2.filter(function (element) {
            return element !== undefined;
        });
        return val[0]
    }
    else {
        const result = data.map((sponsor) =>
            ({ value: sponsor.AgencyId, label: sponsor.Agency_Name })
        )
        return result
    }

}