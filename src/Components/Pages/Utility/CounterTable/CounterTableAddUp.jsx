import  { useState, useEffect, useCallback } from 'react'
import { toastifySuccess } from '../../../Common/AlertMsg'
import { AddDeleteUpadate } from '../../../hooks/Api'
import { RequiredFieldIncident } from '../Personnel/Validation';
import Select from 'react-select'
import { useSelector } from 'react-redux';

const CounterTableAddUp = (props) => {

    const { modal, status, editList, setModal, get_Data_List, updateStatus, loginAgencyID } = props
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);

    const [value, setValue] = useState({
        'Counter_Format': '', 'Last_Number': '', 'WhenReset': '', 'WhenResetName': '',
        'CounterID': '', 'IsSystemGenerated': '',
    });

    const [errors, setErrors] = useState({
        'Counter_FormatError': '', 'Last_NumberError': '', 'When_ResetError': '',
    })

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                "Counter_Format": editList?.Counter_Format,
                "Last_Number": editList?.Last_Number?.toString(),
                'WhenReset': editList?.WhenReset,
                'CounterID': editList?.CounterID,
                'IsSystemGenerated': editList?.IsSystemGenerated === 'Y' ? 'Y' : 'N',
                'WhenResetName': changeArrayFormat_WithFilter([editList]),
            })
        } else {
            setValue({
                ...value,
                'Counter_Format': '',
                'Last_Number': '', 'WhenReset': '', 'WhenResetName': '',
                'CounterID': '',
            })
        }
    }, [editList, updateStatus])

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
            'Counter_Format': '', 'Last_Number': '', 'WhenReset': '',
            'CounterID': '', 'WhenResetName': '',
        })
        setErrors({
            ...errors,
            'Counter_FormatError': '', 'Last_NumberError': '', 'When_ResetError': '',
        })
    }

    const handlChanges = (e, AppCode) => {
      
        if (e) {
            if (e.target.name === 'IsSystemGenerated') {
                if (e.target.checked) {
                    setValue({ ...value, [e.target.name]: 'Y' })
                } else {
                    setValue({ ...value, [e.target.name]: 'N' })
                }
            } else {
                if (AppCode?.trim() == "ARR") {
                    let pattern = /^[A-Z0-9\-]*$/;
                    if (loginAgencyState === 'TX') {
                        setValue({ ...value, [e.target.name]: pattern.test(e.target.value) ? e.target.value : value.Counter_Format })
                    } else {
                        setValue({ ...value, [e.target.name]: e.target.value })
                    }
                } else {
                    setValue({ ...value, [e.target.name]: e.target.value })
                }
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

   

    const update_Type = () => {
        const { Counter_Format, Last_Number, WhenReset,  CounterID, IsSystemGenerated, } = value
        const val = {
            'Counter_Format': Counter_Format, 'AgencyID': loginAgencyID,
            'Last_Number': Last_Number, 'WhenReset': WhenReset, 'CounterID': CounterID, 'IsSystemGenerated': IsSystemGenerated,
        }
        AddDeleteUpadate('Counter/UpdateCounter', val).then((res) => {
            toastifySuccess(res.Message);
            get_Data_List();
            setModal(false)
            reset();
        })
    }

    const check_Validation_Error = (e) => {
        e?.preventDefault()
        if (RequiredFieldIncident(value.Counter_Format)) {
            setErrors(prevValues => { return { ...prevValues, ['Counter_FormatError']: RequiredFieldIncident(value.Counter_Format) } })
        }
        if (RequiredFieldIncident(value.Last_Number)) {
            setErrors(prevValues => { return { ...prevValues, ['Last_NumberError']: RequiredFieldIncident(value.Last_Number) } })
        }
        if (RequiredFieldIncident(value.WhenReset)) {
            setErrors(prevValues => { return { ...prevValues, ['When_ResetError']: RequiredFieldIncident(value.WhenReset) } })
        }
    }

    const { Counter_FormatError, Last_NumberError, When_ResetError } = errors

    useEffect(() => {
        if (Counter_FormatError === 'true' && Last_NumberError === 'true' && When_ResetError === 'true') {
            update_Type();
        }
    }, [Counter_FormatError, Last_NumberError, When_ResetError])

    const closeModal = () => {
        reset();
        setModal(false);
    }

    const options = [
        { value: 'Roll', label: 'Roll' },
        { value: 'Year', label: 'Year' },
    ]

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        })
    }


    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CounterModal" tabIndex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-lg modal-dialog-centered rounded">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Counter Model</legend>
                                            <div className="row">
                                                <div className="col-12 col-md-4 col-lg-4 mt-3">
                                                    <div className="text-field">
                                                        <input type="text" name='Counter_Format' title='Please enter only letters, numbers, and a single hyphen.' maxLength={12} onChange={(e) => { handlChanges(e, editList?.AppCode) }} value={value.Counter_Format} className='requiredColor' />
                                                        <label>Counter_Format</label>
                                                        {errors.Counter_FormatError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Counter_FormatError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-3">
                                                    <div className="text-field">
                                                        <input type="text" name='Last_Number' onChange={handlChanges} value={value.Last_Number} className='requiredColor' />
                                                        <label>Last_Number</label>
                                                        {errors.Last_NumberError !== 'true' ? (
                                                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Last_NumberError}</span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-12 col-lg-4 mt-1">
                                                    <label style={{ fontWeight: '650', lineHeight: '5px', fontSize: '12px' }}>When Reset</label>
                                                    {
                                                        value?.WhenResetName ?
                                                            <Select
                                                                name='WhenReset'
                                                                isClearable
                                                                styles={colourStyles}
                                                                value={options?.filter((obj) => obj.value === value?.WhenReset)}
                                                                options={options}
                                                                onChange={(e) => {
                                                                    if (e) {
                                                                        setValue({ ...value, ['WhenReset']: e.label })
                                                                    } else setValue({ ...value, ['WhenReset']: '' })
                                                                }}
                                                                placeholder="When Rest..."
                                                            />
                                                            :
                                                            <Select
                                                                name='WhenReset'
                                                                isClearable
                                                                styles={colourStyles}
                                                                onChange={(e) => {
                                                                    if (e) {
                                                                        setValue({ ...value, ['WhenReset']: e.label })
                                                                    } else setValue({ ...value, ['WhenReset']: '' })
                                                                }}
                                                                placeholder="When Rest..."
                                                            />
                                                    }
                                                    {errors.When_ResetError !== 'true' ? (
                                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.When_ResetError}</span>
                                                    ) : null}
                                                </div>
                                                <div className="col-12 col-md-4 col-lg-4 mt-3">
                                                    <div className="form-check "  >
                                                        <input className="form-check-input" type="checkbox" id="IsSystemGenerated" onChange={handlChanges} name='IsSystemGenerated'
                                                            value={value.IsSystemGenerated}
                                                            checked={value.IsSystemGenerated === 'Y' ? true : false}
                                                        />
                                                        <label className="form-check-label" htmlFor="IsSystemGenerated">  Is System Generated
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        <button type="button" className="btn btn-sm btn-success mr-2" onClick={check_Validation_Error} >Update</button>
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

export default CounterTableAddUp;

export const changeArrayFormat_WithFilter = (data) => {
    const result = data.map((sponsor) =>
        ({ value: sponsor.WhenReset, label: sponsor.WhenReset })
    )
    return result
}