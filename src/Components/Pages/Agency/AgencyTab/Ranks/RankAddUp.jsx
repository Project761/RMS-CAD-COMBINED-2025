import React, { useContext, useEffect, useState } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter'
import { AddDeleteUpadate, fieldPermision } from '../../../../hooks/Api'
import { RequiredField } from '../../AgencyValidation/validators'

const RankAddUp = ({ aId, pinID, get_Rank, status, rankEditData, openModal, setOpenModal, rankList, updateStatus }) => {

    const { get_CountList } = useContext(AgencyContext);

    const [value, setValue] = useState({
        'AgencyId': aId,
        'RankCode': '',
        'RankDescription': '',
        'CreatedByUserFK': pinID,
    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        // Rank Field 
        'RankCode': '', 'RankDescription': '',
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'RankCode': '', 'RankDescription': '',
    })

    const reset_value = () => {
        setValue({
            ...value,
            'RankCode': '',
            'RankDescription': '',
            'ModifiedByUserFK': ''
        });
    }

    const handleInput = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (rankEditData?.RankID) {
            setValue({
                ...value,
                'RankID': rankEditData?.RankID,
                'AgencyId': aId,
                'RankCode': rankEditData?.RankCode,
                'RankDescription': rankEditData?.RankDescription,
                'ModifiedByUserFK': pinID,
            });
        } else {
            setValue({
                ...value,
                'AgencyId': aId,
                'RankCode': '',
                'RankDescription': '',
                'ModifiedByUserFK': ''
            });
        }
    }, [rankEditData, updateStatus])

    useEffect(() => {
        if (aId && pinID) { get_Field_Permision_Rank(aId, pinID) }
    }, [aId, pinID])

    // Get Effective Field Permission
    const get_Field_Permision_Rank = (aId, pinID) => {
        fieldPermision(aId, 'A021', pinID).then(res => {
            if (res) {
                const RankCodeFilter = res?.filter(item => item.Description === "Agency-RankCode");
                const RankDescriptionFilter = res?.filter(item => item.Description === "Agency-RankDescription");
                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['RankCode']: RankCodeFilter || prevValues['RankCode'],
                        ['RankDescription']: RankDescriptionFilter || prevValues['RankDescription'],
                    }
                });
            }
        });
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault();
        const RankCodeErr = RequiredField(value.RankCode);
        const RankDescriptionErr = RequiredField(value.RankDescription);

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['RankCode']: RankCodeErr || prevValues['RankCode'],
                ['RankDescription']: RankDescriptionErr || prevValues['RankDescription'],
            }
        });
    }

    // Check All Field Format is True Then Submit 
    const { RankDescription, RankCode } = errors

    useEffect(() => {
        if (RankCode === 'true' && RankDescription === 'true') {
            if (status) rank_Update()
            else rank_add()
        }
    }, [RankDescription, RankCode])

    

    const rank_add = async (e) => {
        const result = rankList?.find(item => item.RankCode.toLowerCase() === value.RankCode.toLowerCase());
        const result1 = rankList?.find(item => item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()
        );
        if (result || result1) {
            if (result) {
                toastifyError('Rank Code Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
            if (result1) {
                toastifyError('Rank Description Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/InsertRank', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.Message)
                        get_Rank(aId); get_CountList(aId); reset_value(); setOpenModal(false); setErrors({ ...errors, ['RankCode']: '' })
                    } else { toastifyError("Rank can not be saved !!") }
                })
        }
    }

    // Rank Update Method
    const rank_Update = (e) => {
        const result = rankList?.find(item => {
            if (item.RankID != value.RankID) {
                if (item.RankCode.toLowerCase() === value.RankCode.toLowerCase()) {
                    return item.RankCode.toLowerCase() === value.RankCode.toLowerCase()
                } else return item.RankCode.toLowerCase() === value.RankCode.toLowerCase()
            }
            return false
        });
        const result1 = rankList?.find(item => {
            if (item.RankID != value.RankID) {
                if (item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()) {
                    return item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()
                } else return item.RankDescription.toLowerCase() === value.RankDescription.toLowerCase()
            }
            return false
        });
        if (result || result1) {
            if (result) {
                toastifyError('Rank Code Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
            if (result1) {
                toastifyError('Rank Description Already Exists')
                setErrors({ ...errors, ['RankCode']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/UpdateRank', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); get_Rank(aId); setOpenModal(false); setOpenModal(false); setErrors({ ...errors, ['RankCode']: '' })
                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        }
    }

    const closeModalReset = () => {
        setErrors({ ...errors, 'RankCode': '', 'RankDescription': '' })
        reset_value()
    }

    return (
        <>
            {
                openModal ?
                    <dialog className="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="RankModal" data-backdrop="false" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className=" modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body ">
                                    <div className="m-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Ranks</legend>
                                            <div className="row ">
                                                <div className="col-6 input-group-lg">
                                                    <div className="text-field">
                                                        <input type="text" name='RankCode' value={value.RankCode}
                                                            className={fieldPermissionAgency?.RankCode[0] ?
                                                                fieldPermissionAgency?.RankCode[0]?.Changeok === 0 && fieldPermissionAgency?.RankCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.RankCode[0]?.Changeok === 0 && fieldPermissionAgency?.RankCode[0]?.AddOK === 1 && rankEditData?.RankCode === '' && status ? 'requiredColor' : fieldPermissionAgency?.RankCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.RankCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermissionAgency?.RankCode[0] ?
                                                                fieldPermissionAgency?.RankCode[0]?.Changeok === 0 && fieldPermissionAgency?.RankCode[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.RankCode[0]?.Changeok === 0 && fieldPermissionAgency?.RankCode[0]?.AddOK === 1 && rankEditData?.RankCode === '' && status ? handleInput : fieldPermissionAgency?.RankCode[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.RankCode[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required />
                                                        <label>Rank Code </label>
                                                        {errors.RankCode !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RankCode}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="text-field ">
                                                        <textarea type="text" name='RankDescription' value={value.RankDescription}
                                                            className={fieldPermissionAgency?.RankDescription[0] ?
                                                                fieldPermissionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermissionAgency?.RankDescription[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermissionAgency?.RankDescription[0]?.AddOK === 1 && rankEditData?.RankDescription === '' && status ? 'requiredColor' : fieldPermissionAgency?.RankDescription[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.RankDescription[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermissionAgency?.RankDescription[0] ?
                                                                fieldPermissionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermissionAgency?.RankDescription[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.RankDescription[0]?.Changeok === 0 && fieldPermissionAgency?.RankDescription[0]?.AddOK === 1 && rankEditData?.RankDescription === '' && status ? handleInput : fieldPermissionAgency?.RankDescription[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.RankDescription[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required cols="30" rows="1" />
                                                        {errors.RankDescription !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RankDescription}</span>
                                                        ) : null}
                                                        <label>Rank Description</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {status ?
                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                                :
                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                            }
                                            <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={(e) => closeModalReset()}>Close</button>
                                        </div>
                                    </div>
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

export default RankAddUp