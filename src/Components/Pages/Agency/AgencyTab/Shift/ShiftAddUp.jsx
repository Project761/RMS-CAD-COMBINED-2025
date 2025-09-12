import React, { useState, useEffect, useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { AddDeleteUpadate, fieldPermision } from '../../../../hooks/Api';
import { RequiredField } from '../../AgencyValidation/validators';

const ShiftAddUp = ({ aId, pinID, get_Shift, shiftEditData, status, openModal, setOpenModal, updCount, shiftList }) => {

    const { get_CountList } = useContext(AgencyContext)
    const [value, setValue] = useState({
        'AgencyId': aId,
        'ShiftCode': '',
        'ShiftDescription': '',
        'Starttime': '',
        'EndTime': '',
        'ShiftId': '',
        'CreatedByUserFK': pinID,
    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        'ShiftCode': '', 'ShiftDescription': '', 'Starttime': '', 'EndTime': '',
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'ShiftCodeErr': '', 'ShiftDescriptionErr': '', 'StarttimeErr': '', 'EndTimeErr': '',
    })

    const handleInput = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value,
        });
    };

    const emptyField = () => {
        setValue({
            ...value,
            'ShiftId': "",
            'ShiftCode': "",
            'ShiftDescription': "",
            'Starttime': "",
            'EndTime': "",
        });
    }

    useEffect(() => {
        if (shiftEditData?.ShiftId) {
            setValue({
                ...value,
                'ShiftId': shiftEditData?.ShiftId,
                'AgencyId': aId,
                'ShiftCode': shiftEditData?.ShiftCode,
                'ShiftDescription': shiftEditData?.ShiftDescription,
                'Starttime': shiftEditData?.Starttime,
                'EndTime': shiftEditData?.EndTime,
                'ModifiedByUserFK': pinID,
            });
        } else {
            setValue({
                ...value,
                'AgencyId': aId,
                'ShiftCode': '',
                'ShiftDescription': '',
                'Starttime': '',
                'EndTime': '',
                'ModifiedByUserFK': '',
            });
        }
    }, [shiftEditData, updCount])

    useEffect(() => {
        if (aId && pinID) { get_Field_Permision_Shift(aId, pinID) }
    }, [aId])

    // Get Effective Field Permission
    const get_Field_Permision_Shift = (aId, pinID) => {
        fieldPermision(aId, 'A020', pinID).then(res => {
            if (res) {
                const ShiftCodeFilter = Agency_Field_Permistion_Filter(res, "Agency-ShiftCode");
                const ShiftDescriptionFilter = Agency_Field_Permistion_Filter(res, "Agency-Description");
                const StarttimeFilter = Agency_Field_Permistion_Filter(res, "Agency-StartTime");
                const EndTimeFilter = Agency_Field_Permistion_Filter(res, "Agency-EndTime");

                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['ShiftCode']: ShiftCodeFilter || prevValues['ShiftCode'],
                        ['ShiftDescription']: ShiftDescriptionFilter || prevValues['ShiftDescription'],
                        ['Starttime']: StarttimeFilter || prevValues['Starttime'],
                        ['EndTime']: EndTimeFilter || prevValues['EndTime'],
                    }
                });
            }
        });
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault();
        const ShiftCodeErr = RequiredField(value.ShiftCode);
        const ShiftDescriptionErr = RequiredField(value.ShiftDescription);
        const StarttimeErr = RequiredField(value.Starttime);
        const EndTimeErr = RequiredField(value.EndTime);

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['ShiftCodeErr']: ShiftCodeErr || prevValues['ShiftCodeErr'],
                ['ShiftDescriptionErr']: ShiftDescriptionErr || prevValues['ShiftDescriptionErr'],
                ['StarttimeErr']: StarttimeErr || prevValues['StarttimeErr'],
                ['EndTimeErr']: EndTimeErr || prevValues['EndTimeErr'],
            }
        });
    }

    // Check All Field Format is True Then Submit 
    const { ShiftCodeErr, ShiftDescriptionErr, EndTimeErr, StarttimeErr } = errors

    useEffect(() => {
        if (ShiftCodeErr === 'true' && ShiftDescriptionErr === 'true' && EndTimeErr === 'true' && StarttimeErr === 'true') {
            if (status) shift_Update()
            else shift_add()
        }
    }, [ShiftCodeErr, ShiftDescriptionErr, EndTimeErr, StarttimeErr])

    // New Shift Create
    const shift_add = async (e) => {
        const result = shiftList?.find(item => item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase());
        const result1 = shiftList?.find(item => item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()
        );
        if (result || result1) {
            if (result) {
                toastifyError('Shift Code Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
            if (result1) {
                toastifyError('Shift Description Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/InsertShift', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.Message); setErrors({ ...errors, ['ShiftCodeErr']: '' })
                        get_Shift(aId); get_CountList(aId); setOpenModal(false); emptyField()
                    } else { toastifyError("Shift can not be saved !!") }
                })
        }
    }

    // Update Shift Function---------
    const shift_Update = (e) => {
        const result = shiftList?.find(item => {
            if (item.ShiftId !== value.ShiftId) {
                if (item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()) {
                    return item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()
                } else return item.ShiftCode.toLowerCase() === value.ShiftCode.toLowerCase()
            }
        });
        const result1 = shiftList?.find(item => {
            if (item.ShiftId !== value.ShiftId) {
                if (item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()) {
                    return item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()
                } else return item.ShiftDescription.toLowerCase() === value.ShiftDescription.toLowerCase()
            }
        });
        if (result || result1) {
            if (result) {
                toastifyError('Shift Code Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
            if (result1) {
                toastifyError('Shift Description Already Exists')
                setErrors({ ...errors, ['ShiftCodeErr']: '' })
            }
        } else {
            AddDeleteUpadate('MasterPersonnel/UpdateShift', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); setErrors({ ...errors, ['ShiftCodeErr']: '' })
                        get_Shift(aId); setOpenModal(false); emptyField()
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
        setErrors({ ...errors, 'ShiftCodeErr': '', 'ShiftDescriptionErr': '', 'StarttimeErr': '', 'EndTimeErr': '' })
        emptyField()
    }

    return (
        <>
            {
                openModal ?
                    <dialog className="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="ShiftModal" data-backdrop="false" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className=" modal-dialog modal-md modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body ">
                                    <div className="m-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Shift</legend>
                                            <div className="row" >
                                                <div className="col-4 input-group-lg">
                                                    <div className="text-field">
                                                        <input type="text" name='ShiftCode' value={value.ShiftCode}
                                                            className={fieldPermissionAgency?.ShiftCode[0] ?
                                                                fieldPermissionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftCode[0]?.AddOK === 1 && shiftEditData?.ShiftCode === '' && status ? 'requiredColor' : fieldPermissionAgency?.ShiftCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.ShiftCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermissionAgency?.ShiftCode[0] ?
                                                                fieldPermissionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftCode[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.ShiftCode[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftCode[0]?.AddOK === 1 && shiftEditData?.ShiftCode === '' && status ? handleInput : fieldPermissionAgency?.ShiftCode[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.ShiftCode[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required maxLength={10} />
                                                        <label>Shift Code </label>
                                                        {errors.ShiftCodeErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ShiftCodeErr}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-8">
                                                    <div className="text-field ">
                                                        <textarea type="text" name='ShiftDescription' value={value.ShiftDescription}
                                                            className={fieldPermissionAgency?.ShiftDescription[0] ?
                                                                fieldPermissionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftDescription[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftDescription[0]?.AddOK === 1 && shiftEditData?.ShiftDescription === 'requiredColor' && status ? 'requiredColor' : fieldPermissionAgency?.ShiftDescription[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.ShiftDescription[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermissionAgency?.ShiftDescription[0] ?
                                                                fieldPermissionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftDescription[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.ShiftDescription[0]?.Changeok === 0 && fieldPermissionAgency?.ShiftDescription[0]?.AddOK === 1 && shiftEditData?.ShiftDescription === '' && status ? handleInput : fieldPermissionAgency?.ShiftDescription[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.ShiftDescription[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required cols="30" rows="1" />
                                                        <label>Description</label>
                                                        {errors.ShiftDescriptionErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ShiftDescriptionErr}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-6 dropdown__box mt-3">
                                                    <div className="text-field">
                                                        <input type="time" name='Starttime' value={value.Starttime}
                                                            className={fieldPermissionAgency?.Starttime[0] ?
                                                                fieldPermissionAgency?.Starttime[0]?.Changeok === 0 && fieldPermissionAgency?.Starttime[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.Starttime[0]?.Changeok === 0 && fieldPermissionAgency?.Starttime[0]?.AddOK === 1 && shiftEditData?.Starttime === '' && status ? 'requiredColor' : fieldPermissionAgency?.Starttime[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.Starttime[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermissionAgency?.Starttime[0] ?
                                                                fieldPermissionAgency?.Starttime[0]?.Changeok === 0 && fieldPermissionAgency?.Starttime[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.Starttime[0]?.Changeok === 0 && fieldPermissionAgency?.Starttime[0]?.AddOK === 1 && shiftEditData?.Starttime === '' && status ? handleInput : fieldPermissionAgency?.Starttime[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.Starttime[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required />
                                                        <label htmlFor="">Start Time</label>
                                                        {errors.StarttimeErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StarttimeErr}</span>
                                                        ) : null}

                                                    </div>
                                                </div>
                                                <div className="col-6 dropdown__box mt-3">
                                                    <div className="text-field">
                                                        <input type="time" name='EndTime' value={value.EndTime}
                                                            className={fieldPermissionAgency?.EndTime[0] ?
                                                                fieldPermissionAgency?.EndTime[0]?.Changeok === 0 && fieldPermissionAgency?.EndTime[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.EndTime[0]?.Changeok === 0 && fieldPermissionAgency?.EndTime[0]?.AddOK === 1 && shiftEditData?.EndTime === '' && status ? 'requiredColor' : fieldPermissionAgency?.EndTime[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.EndTime[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermissionAgency?.EndTime[0] ?
                                                                fieldPermissionAgency?.EndTime[0]?.Changeok === 0 && fieldPermissionAgency?.EndTime[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.EndTime[0]?.Changeok === 0 && fieldPermissionAgency?.EndTime[0]?.AddOK === 1 && shiftEditData?.EndTime === '' && status ? handleInput : fieldPermissionAgency?.EndTime[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.EndTime[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            required />
                                                        <label htmlFor="">End Time</label>
                                                        {errors.EndTimeErr !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.EndTimeErr}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="col-12">
                                        <div className="btn-box text-right mt-3 mr-1">
                                            {
                                                status ?
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                                                    :
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                                            }
                                            <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() => closeModalReset()}>Close</button>
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

export default ShiftAddUp