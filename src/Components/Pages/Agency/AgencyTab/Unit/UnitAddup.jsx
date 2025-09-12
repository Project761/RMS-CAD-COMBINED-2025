
import React, { useState, memo, useEffect, useContext } from 'react'
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData, fieldPermision } from '../../../../hooks/Api';
import { RequiredField } from '../../AgencyValidation/validators';
import { getShowingWithOutTime } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import DatePicker from "react-datepicker";
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';

function UnitAddUp(props) {
    // Hooks Initialization
    const { aId, pinID, unitEditData, status, get_Unit_List, unitList, openModal, setOpenModal, updCount } = props
    const [associatedShiftList, setAssociatedShiftList] = useState([])
    const [divisionList, setDivisionList] = useState([])
    const { get_CountList } = useContext(AgencyContext)
    const [serviceDate, setServiceDate] = useState()

    const [value, setValue] = useState({
        "UnitCode": "",
        "AgencyID": aId,
        "DivisionId": "",
        "UnitName": "",
        "ServiceDate": "",
        "AssociatedShiftID": false,
        "AllowMobileLogin": "",
        "CreatedByUserFK": pinID,
        "ModifiedByUserFK": "",
        "UnitId": "",
        "AssociatedShiftName": '', 'DivisionName': ''
    });

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        // Unit Field
        "UnitCode": "", "DivisionId": "", "UnitName": "", "ServiceDate": "", "AssociatedShiftID": "",
    })

    // Initializaation Error Hooks
    const [errors, setErrors] = useState({
        'UnitCodeError': '',
        'UnitNameError': '',
        'DivisionIdError': ''
    })

    // Onload Function
    useEffect(() => {
        if (aId) {
            get_AssociatedShift(aId)
            get_Division(aId);
            get_Field_Permision_Unit(aId, pinID)
        }
    }, [aId, pinID])

    const get_AssociatedShift = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData('MasterPersonnel/GetData_Shift', value)
            .then(res => {
                if (res) setAssociatedShiftList(changeArrayFormat(res, 'shift'))
                else setAssociatedShiftList()
            })
    }

    const get_Division = (aId) => {
        const value = {
            AgencyId: aId
        }
        fetchPostData('Division/GetData_Division', value)
            .then(res => {
                if (res) {
                    setDivisionList(changeArrayFormat(res, 'division'))
                }
                else setDivisionList([]);
            })
    }

    useEffect(() => {
        if (unitEditData?.UnitId) {
            setServiceDate(getShowingWithOutTime(unitEditData?.ServiceDate) === '01/01/1900' ? null : getShowingWithOutTime(unitEditData?.ServiceDate) === 'Invalid date' ? '' : new Date(unitEditData?.ServiceDate))
            setValue({
                ...value,
                'AgencyID': unitEditData?.AgencyID,
                "UnitCode": unitEditData?.UnitCode, "DivisionId": unitEditData?.DivisionId, "UnitName": unitEditData?.UnitName,
                "ServiceDate": getShowingWithOutTime(unitEditData?.ServiceDate) === '01/01/1900' ? null : getShowingWithOutTime(unitEditData?.ServiceDate) === 'Invalid date' ? '' : getShowingWithOutTime(unitEditData?.ServiceDate), "AssociatedShiftID": unitEditData?.AssociatedShiftID, "AllowMobileLogin": unitEditData?.AllowMobileLogin,
                "UnitId": unitEditData?.UnitId, "AssociatedShiftName": unitEditData?.AssociatedShiftID != null ? changeArrayFormat_WithFilter([unitEditData], 'shift') : '',
                'DivisionName': unitEditData?.DivisionId != null ? changeArrayFormat_WithFilter([unitEditData], 'division', divisionList) : '',
                "ModifiedByUserFK": pinID,
            });
        } else {
            setValue({
                ...value,
                "UnitCode": '', "DivisionId": '', "UnitName": '', "ServiceDate": '', "AssociatedShiftID": '', "ModifiedByUserFK": '', "UnitId": '', 'AllowMobileLogin': false, "DivisionName": '', 'AssociatedShiftName': ''
            });
        }
    }, [unitEditData, updCount])

    // Get Effective Field Permission
    const get_Field_Permision_Unit = (aId, pinID) => {
        fieldPermision(aId, 'A005', pinID).then(res => {
            if (res) {
                const agencyUnitCodeFilter = Agency_Field_Permistion_Filter(res, "Agency-UnitCode");
                const agencyDivisionFilter = Agency_Field_Permistion_Filter(res, "Agency-Division");
                const agencyUnitNameFilter = Agency_Field_Permistion_Filter(res, "Agency-UnitName");
                const agencyServiceDateFilter = Agency_Field_Permistion_Filter(res, "Agency-ServiceDate");
                const agencyAssociatedShiftFilter = Agency_Field_Permistion_Filter(res, "Agency-AssociatedShift");
                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['UnitCode']: agencyUnitCodeFilter || prevValues['UnitCode'],
                        ['DivisionId']: agencyDivisionFilter || prevValues['DivisionId'],
                        ['UnitName']: agencyUnitNameFilter || prevValues['UnitName'],
                        ['ServiceDate']: agencyServiceDateFilter || prevValues['ServiceDate'],
                        ['AssociatedShiftID']: agencyAssociatedShiftFilter || prevValues['AssociatedShiftID'],
                    }
                });
            }
        });
    }

    // onChange Hooks Function
    const handleInput = (e) => {
        if (e.target.name === 'AllowMobileLogin') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    };

    const dateChange = (date) => {
        setServiceDate(date);
        setValue({ ...value, ['ServiceDate']: date })
    }

    // Set value 
    const divisionChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['DivisionId']: e.value
            })
        } else {
            setValue({
                ...value,
                ['DivisionId']: null
            })
        }
    }

    const AssociatedShiftChanges = (e) => {
        if (e) {
            setValue({
                ...value,
                ['AssociatedShiftID']: e.value
            })
        } else {
            setValue({
                ...value,
                ['AssociatedShiftID']: null
            })
        }
    }

    // Check validation on Field
    const check_Validation_Error = (e) => {
        e.preventDefault()
        if (RequiredField(value.UnitCode)) {
            setErrors(prevValues => { return { ...prevValues, ['UnitCodeError']: RequiredField(value.UnitCode) } })
        }
        if (RequiredField(value.UnitName)) {
            setErrors(prevValues => { return { ...prevValues, ['UnitNameError']: RequiredField(value.UnitName) } })
        }
        if (RequiredField(value.DivisionId)) {
            setErrors(prevValues => { return { ...prevValues, ['DivisionIdError']: RequiredField(value.DivisionId) } })
        }
    }

    const reset_Value = () => {
        setValue({
            ...value,
            "UnitCode": '', "DivisionId": '', "UnitName": '', "ServiceDate": '', "AssociatedShiftID": '', "AllowMobileLogin": '', "ModifiedByUserFK": '', 'AssociatedShiftName': '', 'DivisionName': ''
        });
        setServiceDate()
    }

    const closeModalReset = () => {
        setErrors({
            ...errors,
            'UnitCodeError': '', 'UnitNameError': '', 'DivisionIdError': ''
        });
        reset_Value()
    }

    // Check All Field Format is True Then Submit 
    const { UnitCodeError, UnitNameError, DivisionIdError } = errors

    useEffect(() => {
        if (UnitCodeError === 'true' && UnitNameError === 'true' && DivisionIdError === 'true') {
            if (status) unit_Update()
            else unit_Add()
        }
    }, [UnitCodeError, UnitNameError, DivisionIdError])

    // New Unit Create
    const unit_Add = async () => {
        const result = unitList?.find(item => item.UnitCode === value.UnitCode);
        const result1 = unitList?.find(item => item.UnitName === value.UnitName);

        if (result || result1) {
            if (result) {
                toastifyError('Unit Code Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
            if (result1) {
                toastifyError('Unit Name Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
        } else {
            AddDeleteUpadate('Unit/UnitInsert', value)
                .then((res) => {
                    if (res.success === true) {
                        toastifySuccess(res.data); setErrors({ ...errors, ['UnitCodeError']: '' }); get_Unit_List(aId); get_CountList(aId); setOpenModal(false); reset_Value()
                    }
                })
        }
    }

    // Unit Values Update
    const unit_Update = async () => {
        const result = unitList?.find(item => {
            if (item.UnitId != value.UnitId) {
                if (item.UnitCode === value.UnitCode) {
                    return item.UnitCode === value.UnitCode
                } else return item.UnitCode === value.UnitCode
            }
            return false
        });
        const result1 = unitList?.find(item => {
            if (item.UnitId != value.UnitId) {
                if (item.UnitName === value.UnitName) {
                    return item.UnitName === value.UnitName
                } else return item.UnitName === value.UnitName
            }
            return false
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('Unit Code Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
            if (result1) {
                toastifyError('Unit Name Already Exists')
                setErrors({ ...errors, ['UnitCodeError']: '' })
            }
        } else {
            AddDeleteUpadate('Unit/UnitUpdate', value)
                .then((res) => {
                    if (res.success === true) {
                        const parsedData = JSON.parse(res.data);
                        const message = parsedData.Table[0].Message;
                        toastifySuccess(message); reset_Value()
                        setErrors({ ...errors, ['UnitCodeError']: '' });
                        get_Unit_List(aId)
                        setOpenModal(false)
                    }
                })
        }
    }
    // Custom Style
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

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),

    };

    // tab date change
    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    }

    return (
        <>
            {
                openModal ?
                    <dialog className="modal fade borderModal" style={{ background: "rgba(0,0,0, 0.5)" }} id="UnitModal" data-backdrop="false" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className=" modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body ">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Unit</legend>
                                            <div className="row pt-1 ">
                                                <div className="col-4 input-group-lg">
                                                    <div className="text-field">
                                                        <input type="text"
                                                            value={value.UnitCode}
                                                            className={fieldPermissionAgency?.UnitCode[0] ?
                                                                fieldPermissionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermissionAgency?.UnitCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermissionAgency?.UnitCode[0]?.AddOK === 1 && unitEditData?.UnitCode === '' && status ? 'requiredColor' : fieldPermissionAgency?.UnitCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.UnitCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermissionAgency?.UnitCode[0] ?
                                                                fieldPermissionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermissionAgency?.UnitCode[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.UnitCode[0]?.Changeok === 0 && fieldPermissionAgency?.UnitCode[0]?.AddOK === 1 && unitEditData?.UnitCode === '' && status ? handleInput : fieldPermissionAgency?.UnitCode[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.UnitCode[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            name='UnitCode' maxLength={10} required />
                                                        <label>Unit Code </label>
                                                        {errors.UnitCodeError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UnitCodeError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-8">
                                                    <div className="text-field ">
                                                        <input type="text"
                                                            className={fieldPermissionAgency?.UnitName[0] ?
                                                                fieldPermissionAgency?.UnitName[0]?.Changeok === 0 && fieldPermissionAgency?.UnitName[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.UnitName[0]?.Changeok === 0 && fieldPermissionAgency?.UnitName[0]?.AddOK === 1 && unitEditData?.UnitName === '' && status ? 'requiredColor' : fieldPermissionAgency?.UnitName[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.UnitName[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                                                            }
                                                            onChange={fieldPermissionAgency?.UnitName[0] ?
                                                                fieldPermissionAgency?.UnitName[0]?.Changeok === 0 && fieldPermissionAgency?.UnitName[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.UnitName[0]?.Changeok === 0 && fieldPermissionAgency?.UnitName[0]?.AddOK === 1 && unitEditData?.UnitName === '' && status ? handleInput : fieldPermissionAgency?.UnitName[0]?.AddOK === 1 && !status ? handleInput : fieldPermissionAgency?.UnitName[0]?.Changeok === 1 && status ? handleInput : '' : handleInput
                                                            }
                                                            value={value.UnitName}
                                                            name='UnitName' required />
                                                        <label>Unit Name</label>
                                                        {errors.UnitNameError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.UnitNameError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="row pt-2">
                                                <div className="col-4  dropdown__box_req">
                                                    <Select
                                                        styles={colourStyles}
                                                        value={divisionList?.filter((obj) => obj.value === value?.DivisionId)}
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        options={divisionList}
                                                        isClearable
                                                        onChange={fieldPermissionAgency?.DivisionId[0] ?
                                                            fieldPermissionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionId[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionId[0]?.AddOK === 1 && unitEditData?.DivisionId === '' && status ? divisionChanges : fieldPermissionAgency?.DivisionId[0]?.AddOK === 1 && !status ? divisionChanges : fieldPermissionAgency?.DivisionId[0]?.Changeok === 1 && status ? divisionChanges : '' : divisionChanges
                                                        }
                                                        isDisabled={fieldPermissionAgency?.DivisionId[0] ?
                                                            fieldPermissionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionId[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.DivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionId[0]?.AddOK === 1 && unitEditData?.DivisionId === '' && status ? false : fieldPermissionAgency?.DivisionId[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.DivisionId[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        name='DivisionId'
                                                    />
                                                    <label htmlFor="">Division</label>
                                                    {errors.DivisionIdError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DivisionIdError}</span>
                                                    ) : null}
                                                </div>
                                                <div className="col-4  ">
                                                    <div className="text-field mt-2 date__box ">
                                                        <DatePicker
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            autoComplete='Off'
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            name='ServiceDate'
                                                            peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            isClearable={true}
                                                            onChange={date => fieldPermissionAgency?.ServiceDate[0] ? fieldPermissionAgency?.ServiceDate[0]?.Changeok === 0 ? '' : dateChange(date) : ''
                                                            }
                                                            disabled={fieldPermissionAgency?.ServiceDate[0] ?
                                                                fieldPermissionAgency?.ServiceDate[0]?.Changeok === 0 && fieldPermissionAgency?.ServiceDate[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.ServiceDate[0]?.Changeok === 0 && fieldPermissionAgency?.ServiceDate[0]?.AddOK === 1 && unitEditData?.ServiceDate === '' && status ? false : fieldPermissionAgency?.ServiceDate[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.ServiceDate[0]?.Changeok === 1 && status ? false : true : false
                                                            }
                                                            selected={serviceDate}
                                                            placeholderText={value.ServiceDate ? value.ServiceDate : 'Select ..'}
                                                        />
                                                        <label>Service Date</label>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="form-group mt-3 dropdown__box">
                                                        <Select
                                                            styles={customStylesWithOutColor}
                                                            value={associatedShiftList?.filter((obj) => obj.value === value?.AssociatedShiftID)}
                                                            className="basic-single"
                                                            classNamePrefix="select"
                                                            name='AssociatedShiftID'
                                                            options={associatedShiftList}
                                                            isClearable
                                                            onChange={fieldPermissionAgency?.AssociatedShiftID[0] ?
                                                                fieldPermissionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermissionAgency?.AssociatedShiftID[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermissionAgency?.AssociatedShiftID[0]?.AddOK === 1 && unitEditData?.AssociatedShiftID === '' && status ? AssociatedShiftChanges : fieldPermissionAgency?.AssociatedShiftID[0]?.AddOK === 1 && !status ? AssociatedShiftChanges : fieldPermissionAgency?.AssociatedShiftID[0]?.Changeok === 1 && status ? AssociatedShiftChanges : '' : AssociatedShiftChanges
                                                            }
                                                            isDisabled={fieldPermissionAgency?.AssociatedShiftID[0] ?
                                                                fieldPermissionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermissionAgency?.AssociatedShiftID[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.AssociatedShiftID[0]?.Changeok === 0 && fieldPermissionAgency?.AssociatedShiftID[0]?.AddOK === 1 && unitEditData?.AssociatedShiftID === '' && status ? false : fieldPermissionAgency?.AssociatedShiftID[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.AssociatedShiftID[0]?.Changeok === 1 && status ? false : true : false
                                                            }
                                                        />
                                                        <label htmlFor="">Associated Shift</label>
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

export default memo(UnitAddUp);

export const changeArrayFormat = (data, type) => {
    if (type === 'shift') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )
        data = result.filter(function (element) {
            return element !== "";
        });
        return result
    }
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.DivisionID, label: sponsor.DivisionCode })
        )
        data = result.filter(function (element) {
            return element !== "";
        });
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, dropDownData) => {
    if (type === 'shift') {
        const result = data.map((sponsor) =>
            ({ value: sponsor.ShiftId, label: sponsor.ShiftDescription })
        )

        return result[0]
    }
    if (type === 'division') {
        const result = data?.map((sponsor) =>
            (sponsor.DivisionId)
        )
        const result2 = dropDownData?.map((sponsor) => {
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
}