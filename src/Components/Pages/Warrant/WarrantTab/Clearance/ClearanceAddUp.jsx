import React, { useCallback, useContext, useState, useEffect } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident, SpaceCheck } from '../../../Utility/Personnel/Validation';

const ClearanceAddUp = (props) => {

    const { upDateCount, warrantClearanceID, status, modal, setModal, loginPinID, loginAgencyID, warrantID, get_DispositionData } = props
    const { get_Warrent_Count } = useContext(AgencyContext)
    const [clearanceDate, setClearanceDate] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([])
    const [disposition, setDisposition] = useState([])
    const [editval, setEditval] = useState();

    const [value, setValue] = useState({
        'WarrantID': '',
        'DispositionID': null,
        'ClearanceDateTime': '',
        'OfficerID': null,
        'Remarks': '',
        'CreatedByUserFK': '',
    });

    const [errors, setErrors] = useState({
        'DispositionIDError': '', 'OfficerIDError': '', 'ClearanceDateTimeError': '', 'RemarksError': '',
    })

    useEffect(() => {
        if (warrantID) {
            setValue(pre => { return { ...pre, 'WarrantID': warrantID, 'CreatedByUserFK': loginPinID, } })
        }
    }, [warrantID, upDateCount]);


    useEffect(() => {
        if (warrantClearanceID && status) {
            GetSingleData(warrantClearanceID)
        }
    }, [warrantClearanceID, upDateCount])

    const GetSingleData = (warrantClearanceID) => {
        const val = { 'WarrantClearanceID': warrantClearanceID }
        fetchPostData('WarrantClearance/GetSingleData_WarrantClearance', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            })
    }

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.DispositionID)) {
            setErrors(prevValues => { return { ...prevValues, ['DispositionIDError']: RequiredFieldIncident(value.DispositionID) } })
        }
        if (RequiredFieldIncident(value.ClearanceDateTime)) {
            setErrors(prevValues => { return { ...prevValues, ['ClearanceDateTimeError']: RequiredFieldIncident(value.ClearanceDateTime) } })
        }
        if (RequiredFieldIncident(value.OfficerID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerIDError']: RequiredFieldIncident(value.OfficerID) } })
        }
        if (SpaceCheck(value.Remarks)) {
            setErrors(prevValues => { return { ...prevValues, ['RemarksError']: SpaceCheck(value.Remarks) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { DispositionIDError, ClearanceDateTimeError, OfficerIDError, RemarksError } = errors

    useEffect(() => {
        if (DispositionIDError === 'true' && ClearanceDateTimeError === 'true' && OfficerIDError === 'true' && RemarksError === 'true') {
            if (status) updateClearance();
            else submit()
        }
    }, [DispositionIDError, ClearanceDateTimeError, OfficerIDError, RemarksError])

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
                'WarrantClearanceID': warrantClearanceID,
                'ClearanceDateTime': editval[0].ClearanceDateTime ? getShowingDateText(editval[0].ClearanceDateTime) : '',
                'OfficerID': editval[0].OfficerID,
                'Remarks': editval[0].Remarks,
                'DispositionID': editval[0].DispositionID,
                'ModifiedByUserFK': loginPinID,
            })
        } else {
            setValue({
                ...value,
                'WarrantID': '', 'DispositionID': null, 'ClearanceDateTime': '', 'OfficerID': null, 'Remarks': '',
            });
        }
    }, [editval])

    const reset = (e) => {
        setValue({
            ...value, 'WarrantID': '', 'DispositionID': '', 'ClearanceDateTime': '', 'OfficerID': '', 'Remarks': '',
        }); setClearanceDate('')
        setErrors({
            ...errors,
            'DispositionIDError': '', 'OfficerIDError': '', 'ClearanceDateTimeError': '', 'RemarksError': '',
        });

    }

    useEffect(() => {
        if (loginAgencyID) {
            get_WarrentDisposition(loginAgencyID)
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

    const get_WarrentDisposition = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID
        }
        fetchPostData('WarrantDispositions/GetDataDropDown_WarrantDispositions', val).then(res => {
            if (res) {
                setDisposition(threeColArray(res, 'WarrantDispositionsID', 'Description', 'WarrantDispositionsCode'))

            } else setDisposition([])
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
        AddDeleteUpadate('WarrantClearance/Insert_WarrantClearance', value)
            .then((res) => {
                toastifySuccess(res.Message);
                setModal(false)
                get_Warrent_Count(warrantID)
                get_DispositionData(warrantID);
                reset()
                setErrors({
                    ['DispositionIDError']: '',
                })
            })

    }

    const updateClearance = (e) => {
        AddDeleteUpadate('WarrantClearance/Update_WarrantClearance', value)
            .then((res) => {
                toastifySuccess(res.Message)
                get_DispositionData(warrantID);
                get_Warrent_Count(warrantID)
                setModal(false)
                setErrors({
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

                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ClearanceModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered modal-lg" >
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Clearance</legend>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-6 col-md-3 col-lg-3  pt-1">
                                                            <div className="dropdown__box">
                                                                <Select
                                                                    name='DispositionID'
                                                                    isClearable
                                                                    styles={colourStyles}
                                                                    value={disposition?.filter((obj) => obj.value === value?.DispositionID)}
                                                                    options={disposition}
                                                                    onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                                                                    placeholder="Select.."
                                                                    menuPlacement="top"
                                                                />
                                                                <label htmlFor='' >Disposition</label>
                                                                {errors.DispositionIDError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionIDError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-4 col-lg-3  ">
                                                            <div className="dropdown__box">
                                                                <DatePicker
                                                                    id='ClearanceDateTime'
                                                                    name='ClearanceDateTime'
                                                                    ref={startRef}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setClearanceDate(date); setValue({ ...value, ['ClearanceDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                    className='requiredColor'
                                                                    dateFormat="MM/dd/yyyy HH:mm"
                                                                    timeInputLabel
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    isClearable={value?.ClearanceDateTime ? true : false}
                                                                    selected={clearanceDate}
                                                                    placeholderText={value?.ClearanceDateTime ? value.ClearanceDateTime : 'Select...'}
                                                                    showTimeSelect
                                                                    timeIntervals={1}
                                                                    timeCaption="Time"
                                                                    autoComplete="Off"
                                                                    maxDate={new Date()}
                                                                />
                                                                <label htmlFor="" className='pt-1'>Clearance Date/Time</label>
                                                                {errors.ClearanceDateTimeError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ClearanceDateTimeError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-3 col-lg-3  pt-1">
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
                                                                <label htmlFor='' >By PIN</label>
                                                                {errors.OfficerIDError !== 'true' ? (
                                                                    <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                        <div className="col-3  col-md-3 col-lg-3 " style={{ marginTop: '5px' }}>
                                                            <div className="text-field">
                                                                <input type="text" className='readonlyColor' name='ORI'
                                                                    required readOnly />
                                                                <label htmlFor="">By ORI</label>
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
                                    <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { closeModal(); }}>Close</button>
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

export default ClearanceAddUp