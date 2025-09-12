import React, { useCallback, useContext, useState, useEffect } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident, SpaceCheck } from '../../../Utility/Personnel/Validation';

const WarrantServiceAddUp = (props) => {

    const { upDateCount, warrantServiceID, status, modal, setModal, loginPinID, loginAgencyID, warrantID, get_WarrantService } = props
    const { get_Warrent_Count } = useContext(AgencyContext)
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [editval, setEditval] = useState();
    const [serviceAttemptedDate, setServiceAttemptedDate] = useState();
    const [nextAttemptedDate, setNextAttemptedDate] = useState();

    const [value, setValue] = useState({
        'WarrantID': '',
        'NextAttemptDtTm': '',
        'ServiceAttemptDtTm': '',
        'OfficerID': null,
        'Remarks': '',
        'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'OfficerIDError': '', 'RemarksError': '',
    })

    useEffect(() => {
        if (warrantID) {
            setValue(pre => { return { ...pre, 'WarrantID': warrantID, 'CreatedByUserFK': loginPinID, } })
        }
    }, [warrantID, upDateCount]);


    useEffect(() => {
        if (warrantServiceID && status) {
            GetSingleData(warrantServiceID)
        }
    }, [warrantServiceID, upDateCount])

    const GetSingleData = (warrantServiceID) => {
        const val = { 'WarrantServiceID': warrantServiceID }
        fetchPostData('WarrantService/GetSingleData_WarrantService', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value.OfficerID) } })
        }
        if (SpaceCheck(value.Remarks)) {
            setErrors(prevValues => { return { ...prevValues, ['RemarksError']: SpaceCheck(value.Remarks) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { OfficerIDError, RemarksError } = errors

    useEffect(() => {
        if (OfficerIDError === 'true' && RemarksError === 'true') {
            if (status) updateWarrantService();
            else submit()
        }
    }, [OfficerIDError, RemarksError])

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


    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'WarrantServiceID': warrantServiceID,
                'ServiceAttemptDtTm': editval[0].ServiceAttemptDtTm ? getShowingDateText(editval[0].ServiceAttemptDtTm) : '',
                'NextAttemptDtTm': editval[0].NextAttemptDtTm ? getShowingDateText(editval[0].NextAttemptDtTm) : '',
                'OfficerID': editval[0].OfficerID,
                'Remarks': editval[0].Remarks,
                'ModifiedByUserFK': loginPinID,
            })
        } else {
            setValue({
                ...value,
                'WarrantID': '', 'NextAttemptDtTm': '', 'ServiceAttemptDtTm': '', 'OfficerID': null, 'Remarks': '',
            });
        }
    }, [editval])

    const reset = (e) => {
        setValue({
            ...value, 'WarrantID': '', 'NextAttemptDtTm': '', 'ServiceAttemptDtTm': '', 'OfficerID': '', 'Remarks': '',
        }); setNextAttemptedDate(''); setServiceAttemptedDate('')
        setErrors({
            ...errors,
            'OfficerIDError': '', 'RemarksError': '',
        });

    }

    useEffect(() => {
        if (loginAgencyID) {
            Get_Officer_Name(loginAgencyID)
        }
    }, [loginAgencyID])

    const Get_Officer_Name = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID
        }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then(res => {
            if (res) {
                setHeadOfAgency(Comman_changeArrayFormat(res, 'PINID', 'HeadOfAgency'))
            } else setHeadOfAgency([])
        })
    };


    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value, [name]: e.value
            })
        } else {
            setValue({
                ...value, [name]: null
            })
        }
    }

    const HandleChange = (e) => {
        if (e) {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.null
            })
        }
    }

    const submit = () => {
        AddDeleteUpadate('WarrantService/Insert_WarrantService', value)
            .then((res) => {
                toastifySuccess(res.Message);
                setModal(false)
                get_Warrent_Count(warrantID)
                get_WarrantService(warrantID);
                reset()
                setErrors({
                    ...errors,
                    ['DispositionIDError']: '',
                })
            })

    }

    const updateWarrantService = (e) => {
        AddDeleteUpadate('WarrantService/Update_WarrantService', value)
            .then((res) => {
                toastifySuccess(res.Message)
                get_WarrantService(warrantID);
                get_Warrent_Count(warrantID)
                setModal(false)
                setErrors({
                    ...errors,
                    ['DispositionIDError']: '',
                })
            })

    }

    const closeModal = () => {
        reset();
        setModal(false);
    }

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    }
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


                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="WarrantServiceModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Warrant Service</legend>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-6 col-md-4 col-lg-4  ">
                                                            <div className="dropdown__box">
                                                                <DatePicker
                                                                    id='ServiceAttemptDtTm'
                                                                    name='ServiceAttemptDtTm'
                                                                    ref={startRef}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setServiceAttemptedDate(date); setValue({ ...value, ['ServiceAttemptDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                    className=''
                                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                                    timeInputLabel
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    isClearable={value?.ServiceAttemptDtTm ? true : false}
                                                                    selected={serviceAttemptedDate}
                                                                    placeholderText={value?.ServiceAttemptDtTm ? value.ServiceAttemptDtTm : 'Select...'}
                                                                    showTimeSelect
                                                                    timeIntervals={1}
                                                                    timeCaption="Time"
                                                                    autoComplete="Off"
                                                                    maxDate={new Date()}
                                                                />
                                                                <label htmlFor="" className='pt-1'>Service Attempted</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-3 col-lg-4  pt-1">
                                                            <div className="dropdown__box">
                                                                <Select
                                                                    name='OfficerID'
                                                                    isClearable
                                                                    styles={colourStyles}
                                                                    value={headOfAgency?.filter((obj) => obj.value === value?.OfficerID)}
                                                                    options={headOfAgency}
                                                                    onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                                    placeholder="Select.."
                                                                    menuPlacement="top"
                                                                />
                                                                <label htmlFor='' >Attempted By</label>
                                                                {errors.OfficerIDError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-4 col-lg-4  ">
                                                            <div className="dropdown__box">
                                                                <DatePicker
                                                                    id='NextAttemptDtTm'
                                                                    name='NextAttemptDtTm'
                                                                    ref={startRef}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setNextAttemptedDate(date); setValue({ ...value, ['NextAttemptDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                    className=''
                                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                                    timeInputLabel
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    isClearable={value?.NextAttemptDtTm ? true : false}
                                                                    selected={nextAttemptedDate}
                                                                    placeholderText={value?.NextAttemptDtTm ? value.NextAttemptDtTm : 'Select...'}
                                                                    showTimeSelect
                                                                    timeIntervals={1}
                                                                    timeCaption="Time"
                                                                    autoComplete="Off"
                                                                    maxDate={new Date()}
                                                                />
                                                                <label htmlFor="" className='pt-1'>Next Attempt Date</label>
                                                            </div>
                                                        </div>


                                                        <div className="col-12  col-md-12 col-lg-12 mt-2" >
                                                            <div className="text-field">
                                                                <textarea name='Remarks' id="Remarks" cols="30" rows='1' className="form-control " value={value?.Remarks} onChange={HandleChange}  ></textarea>
                                                                <label htmlFor="" className='pt-1'>Remark</label>
                                                                {errors.RemarksError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RemarksError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="btn-box text-right  mr-1 mb-2">
                                    {
                                        status ?
                                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Update</button>
                                            :
                                            <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success mr-1">Save</button>
                                    }
                                    <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { closeModal(); }} >Close</button>
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

export default WarrantServiceAddUp