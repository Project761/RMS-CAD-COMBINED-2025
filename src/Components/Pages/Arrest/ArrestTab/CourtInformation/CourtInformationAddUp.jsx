import React, { useCallback, useEffect, useState, useContext } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { getShowingDateText, getShowingMonthDateYear } from '../../../../Common/Utility';
import { fetchPostData, fetchData, AddDeleteUpadate } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name } from '../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../../Context/Agency/Index';

const CourtInformationAddUp = (props) => {

    const { ArresteName, get_Arrest_Count } = useContext(AgencyContext);

    const { loginPinID, arrestID, loginAgencyID, setModal, modal, get_CourtInformation_Data, updateStatus, courtInfoID, setCourtInfoID, status } = props
    const [pleaDate, setPleaDate] = useState();
    const [appearDate, setAppearDate] = useState();
    const [arrestPleaDrp, setArrestPleaDrp] = useState([]);
    const [judgeNameDrp, setJudgeNameDrp] = useState([]);
    const [courtNameDrp, setCourtNameDrp] = useState([]);
    const [courtApperReasonDrp, setCourtApperReasonDrp] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [biStateList, setBiStateList] = useState([]);
    const [editval, setEditval] = useState();

    const [value, setValue] = useState({
        'Name': '', 'DocketID': "Docket 45", 'CourtNameID': "", 'CourtAppearReasonID': '', 'Attorney': '', 'CourtStateID': '', 'CourtCityID': '', 'JudgeNameID': '', 'PleaID': '', 'PleaDateTime': '', 'Prosecutor': '', 'AppearDateTime': '', 'IsRescheduled': '', 'IsContinued': '', 'IsAppearRequired': '', 'IsDismissed': '', 'ArrestID': '', 'CreatedByUserFK': '',
    })

    useEffect(() => {
        setValue({ ...value, 'ArrestID': arrestID, 'CreatedByUserFK': loginPinID, 'Name': ArresteName, })
    }, [arrestID, updateStatus]);

    const [errors, setErrors] = useState({
        'NameErrors': '',
    })

    useEffect(() => {
        if (courtInfoID && status) {
            GetSingleData(courtInfoID)
        }
    }, [courtInfoID])

    const GetSingleData = (courtInfoID) => {
        const val = { 'ArrsetCourtInformationID': courtInfoID }
        fetchPostData('ArrsetCourtInformation/GetSingleData_ArrsetCourtInformation', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'Name': editval[0]?.Name,
                'DocketID': editval[0]?.DocketID,
                'CourtNameID': editval[0]?.CourtNameID,
                'CourtAppearReasonID': editval[0]?.CourtAppearReasonID,
                'Attorney': editval[0]?.Attorney,
                'CourtStateID': editval[0]?.CourtStateID,
                'CourtCityID': editval[0]?.CourtCityID,
                'JudgeNameID': editval[0]?.JudgeNameID,
                'PleaID': editval[0]?.PleaID,
                'PleaDateTime': editval[0]?.PleaDateTime ? getShowingDateText(editval[0]?.PleaDateTime) : null,
                'AppearDateTime': editval[0]?.AppearDateTime ? getShowingDateText(editval[0]?.AppearDateTime) : null,
                'Prosecutor': editval[0]?.Prosecutor,
                'IsRescheduled': editval[0]?.IsRescheduled,
                'IsContinued': editval[0]?.IsContinued,
                'IsAppearRequired': editval[0]?.IsAppearRequired,
                'IsDismissed': editval[0]?.IsDismissed,
                'ModifiedByUserFK': loginPinID,
                'ArrsetCourtInformationID': courtInfoID,
            })
            setAppearDate(editval[0]?.AppearDateTime ? new Date(editval[0]?.AppearDateTime) : null);
            setPleaDate(editval[0]?.PleaDateTime ? new Date(editval[0]?.PleaDateTime) : null);
            getCity(editval[0]?.CourtStateID);
        }
        else {
            setValue({
                ...value,
                'Name': ArresteName,
                'DocketID': "Docket 45", 'CourtNameID': "", 'CourtAppearReasonID': '',
                'Attorney': '', 'CourtStateID': '', 'CourtCityID': '', 'JudgeNameID': '',
                'PleaID': '', 'PleaDateTime': '', 'Prosecutor': '', 'AppearDateTime': '', 'IsRescheduled': '',
                'IsContinued': '', 'IsAppearRequired': '', 'IsDismissed': '', 'courtInfoID': ''
            })
            setAppearDate('')
            setPleaDate('')
        }
    }, [editval])

    const Reset = () => {
        setValue({
            ...value,
            'DocketID': "Docket 45", 'CourtNameID': "", 'CourtAppearReasonID': '',
            'Attorney': '', 'CourtStateID': '', 'CourtCityID': '', 'JudgeNameID': '',
            'PleaID': '', 'PleaDateTime': '', 'Prosecutor': '', 'AppearDateTime': '', 'IsRescheduled': '',
            'IsContinued': '', 'IsAppearRequired': '', 'IsDismissed': '', 'courtInfoID': '',
        })
        setAppearDate(''); setPleaDate('');
        setErrors({
            ...errors,
            ['CourtNameIDError']: '',
        });
    }
    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            Reset()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);
    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.CourtNameID)) {
            setErrors(prevValues => { return { ...prevValues, ['CourtNameIDError']: RequiredFieldIncident(value.CourtNameID) } })
        }
    }

    const { CourtNameIDError } = errors

    useEffect(() => {
        if (CourtNameIDError === 'true') {
            if (status) { update_CourtInFo() }
            else { Add_CourtInformation() }
        }
    }, [CourtNameIDError])

    useEffect(() => {
        Get_ArrestPlea(loginAgencyID); Get_JudgeNameDrp(loginAgencyID); Get_CourtAppearDrp(loginAgencyID); Get_CourtNameDrp(loginAgencyID); getStateList();
    }, [loginAgencyID])

    const Get_ArrestPlea = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID
        }
        fetchPostData('ArrestPlea/GetDataDropDown_ArrestPlea', val).then((data) => {
            if (data) {
                setArrestPleaDrp(Comman_changeArrayFormat(data, 'ArrestPleaID', 'Description'))
            } else {
                setArrestPleaDrp([]);
            }
        })
    }

    const Get_JudgeNameDrp = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID
        }
        fetchPostData('CourtJudgeName/GetDataDropDown_CourtJudgeName', val).then((data) => {
            if (data) {
                setJudgeNameDrp(Comman_changeArrayFormat(data, 'CourtJudgeNameID', 'Description'))
            } else {
                setJudgeNameDrp([]);
            }
        })
    }

    const Get_CourtAppearDrp = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID
        }
        fetchPostData('CourtAppearReason/GetDataDropDown_CourtAppearReason', val).then((data) => {
            if (data) {
                setCourtApperReasonDrp(Comman_changeArrayFormat(data, 'CourtAppearReasonID', 'Description'))
            } else {
                setCourtApperReasonDrp([]);
            }
        })
    }

    const Get_CourtNameDrp = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID
        }
        fetchPostData('CourtName/GetDataDropDown_CourtName', val).then((data) => {
            if (data) {
                setCourtNameDrp(Comman_changeArrayFormat(data, 'CourtID', 'Description'))
            } else {
                setCourtNameDrp([]);
            }
        })
    }

    const getStateList = async () => {
        fetchData("State_City_ZipCode/GetData_State").then((data) => {
            if (data) {
                setBiStateList(Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "CourtStateID"));
            } else {
                setBiStateList([]);
            }
        });
    };

    const getCity = async (StateID) => {
        const val = {
            StateID: StateID,
        };
        fetchPostData("State_City_ZipCode/GetData_City", val).then((data) => {
            if (data) {
                setCityList(Comman_changeArrayFormat_With_Name(data, "CityID", "CityName", "CourtCityID"))
            } else {
                setCityList([]);
            }
        });
    };

    const selectHandleChange = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [e.name]: e.value
            })
            if (e.name === 'CourtStateID') {
                getCity(e.value)
            }
        } else {
            setValue({
                ...value,
                [name]: null,
            })
        }
    }

    const handleChange = (e) => {
        if (e.target.name === 'IsRescheduled' || e.target.name === 'IsContinued' || e.target.name === 'IsAppearRequired' || e.target.name === 'IsDismissed') {
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
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else setValue({
            ...value,
            [name]: null
        })
    }

    const Add_CourtInformation = () => {
        AddDeleteUpadate('ArrsetCourtInformation/Insert_ArrsetCourtInformation', value).then((res) => {
            toastifySuccess(res.Message);
            get_Arrest_Count(arrestID);
            setModal(false);
            get_CourtInformation_Data(arrestID);
            Reset();
            setErrors({
                ...errors,
                ['CourtNameIDError']: '',
            });
        })
    }

    const update_CourtInFo = () => {
        AddDeleteUpadate('ArrsetCourtInformation/Update_ArrsetCourtInformation', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                setModal(false);
                Reset();
                get_CourtInformation_Data(arrestID);
                setErrors({
                    ...errors,
                    ['CourtNameIDError']: '',
                });
            }
        })
    }

    const OnClose = () => {
        setModal(false);
        Reset();
        setCourtInfoID('')
    }

    const startRef = React.useRef();
    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
        }
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

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

    return (
        <>
            {
                modal ?

                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="CourtInformationModal" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-1">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Court Information</legend>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-6  col-md-6 col-lg-5  mt-1 pt-1" >
                                                            <div className="text-field">
                                                                <input type="text" name='Name' id='Name' value={value?.Name} className='readonlyColor' required readOnly />
                                                                <label htmlFor="">Name</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6  col-md-6 col-lg-3 mt-1 pt-1" >
                                                            <div className="text-field">
                                                                <input type="text" name='DocketID' id='DocketID' value={value?.DocketID} className='readonlyColor' required readOnly />
                                                                <label htmlFor="">Docket Number</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-6 pt-1 mb-1 col-lg-4  dropdown__box">
                                                            <Select
                                                                name='CourtNameID'
                                                                styles={colourStyles}
                                                                value={courtNameDrp?.filter((obj) => obj.value === value?.CourtNameID)}
                                                                isClearable
                                                                options={courtNameDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'CourtNameID')}
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-1'>Court Name</label>
                                                            {errors.CourtNameIDError !== 'true' ? (
                                                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CourtNameIDError}</span>
                                                            ) : null}
                                                        </div>
                                                        <div className="col-6 col-md-6 pt-1 mb-1 col-lg-4  dropdown__box">
                                                            <Select
                                                                name="CourtStateID"
                                                                styles={customStylesWithOutColor}
                                                                value={biStateList?.filter((obj) => obj.value === value?.CourtStateID)}
                                                                isClearable
                                                                options={biStateList}
                                                                onChange={(e) => selectHandleChange(e, 'CourtStateID')}
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-1'>Court State</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 pt-1 mb-1 col-lg-4  dropdown__box">
                                                            <Select
                                                                name="CourtCityID"
                                                                styles={customStylesWithOutColor}
                                                                value={cityList?.filter((obj) => obj.value === value?.CourtCityID)}
                                                                isClearable
                                                                options={cityList}
                                                                onChange={(e) => selectHandleChange(e, 'CourtCityID')}
                                                                placeholder="Select..."

                                                            />
                                                            <label htmlFor='' className='mt-1'>Court City</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 pt-1 mb-1 col-lg-4  dropdown__box">
                                                            <Select
                                                                name='JudgeNameID'
                                                                styles={customStylesWithOutColor}
                                                                value={judgeNameDrp?.filter((obj) => obj.value === value?.JudgeNameID)}
                                                                isClearable
                                                                options={judgeNameDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'JudgeNameID')}
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-1'>Judge Name</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 pt-1 mb-1 col-lg-4  dropdown__box">
                                                            <Select
                                                                name='PleaID'
                                                                styles={customStylesWithOutColor}
                                                                value={arrestPleaDrp?.filter((obj) => obj.value === value?.PleaID)}
                                                                isClearable
                                                                options={arrestPleaDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'PleaID')}
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor='' className='mt-1'>Plea</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-4 dropdown__box">
                                                            <DatePicker
                                                                ref={startRef}
                                                                onKeyDown={onKeyDown}
                                                                id='PleaDateTime'
                                                                name='PleaDateTime'
                                                                className=''
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                onChange={(date) => { setPleaDate(date); setValue({ ...value, ['PleaDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                selected={pleaDate}
                                                                timeInputLabel
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                showTimeSelect
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                                maxDate={new Date()}
                                                            />
                                                            <label htmlFor="" className='pt-1'>Plea Date/Time</label>
                                                        </div>
                                                        <div className="col-6  col-md-6 col-lg-4  mt-1 pt-1" >
                                                            <div className="text-field">
                                                                <input type="text" id='Prosecutor' name='Prosecutor' value={value?.Prosecutor} onChange={handleChange} required />
                                                                <label htmlFor="">Prosecutor</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-6 pt-1 mb-1 col-lg-4 ">
                                                            <div className="text-field">
                                                                <input type="text" name='Attorney' id='Attorney' onChange={handleChange} value={value?.Attorney} required />
                                                                <label htmlFor="">Attorney</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-4 dropdown__box">
                                                            <DatePicker
                                                                ref={startRef}
                                                                onKeyDown={onKeyDown}
                                                                id='AppearDateTime'
                                                                name='AppearDateTime'
                                                                className=''
                                                                dateFormat="MM/dd/yyyy HH:mm"
                                                                onChange={(date) => { setAppearDate(date); setValue({ ...value, ['AppearDateTime']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                selected={appearDate}
                                                                timeInputLabel
                                                                isClearable
                                                                placeholderText={'Select...'}
                                                                showTimeSelect
                                                                timeIntervals={1}
                                                                timeCaption="Time"
                                                            />
                                                            <label htmlFor="" className='pt-1'>Appear Date/Time</label>
                                                        </div>
                                                        <div className="col-6 col-md-6 col-lg-4 pt-1  dropdown__box">
                                                            <Select
                                                                name='CourtAppearReasonID' styles={customStylesWithOutColor}
                                                                value={courtApperReasonDrp?.filter((obj) => obj.value === value?.CourtAppearReasonID)}
                                                                isClearable
                                                                options={courtApperReasonDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'CourtAppearReasonID')}
                                                                placeholder="Select..."
                                                            />
                                                            <label htmlFor="" className='mt-1'>Court Appear Reason</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-2">
                                                            <div className="form-check ">
                                                                <input className="form-check-input" type="checkbox" name='IsRescheduled' id="flexCheckDefault" checked={value?.IsRescheduled} value={value?.IsRescheduled} onChange={handleChange} />
                                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                    Rescheduled
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                            <div className="form-check ">
                                                                <input className="form-check-input" type="checkbox" name='IsContinued' id="flexCheckDefault1" checked={value?.IsContinued} value={value?.IsContinued} onChange={handleChange} />
                                                                <label className="form-check-label" htmlFor="flexCheckDefault1">
                                                                    Continued
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-5 col-md-5 col-lg-3 mt-2">
                                                            <div className="form-check ">
                                                                <input className="form-check-input" type="checkbox" name='IsAppearRequired' id="flexCheckDefault2" checked={value?.IsAppearRequired} value={value?.IsAppearRequired} onChange={handleChange} />
                                                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                                    Appear Required
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="col-5 col-md-4 col-lg-3 mt-2">
                                                            <div className="form-check ">
                                                                <input className="form-check-input" type="checkbox" name='IsDismissed' id="flexCheckDefault3" checked={value?.IsDismissed} value={value?.IsDismissed} onChange={handleChange} />
                                                                <label className="form-check-label" htmlFor="flexCheckDefault3">
                                                                    Dismissed
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="btn-box text-right mt-1 mr-1 mb-2">
                                    {
                                        status ?

                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => check_Validation_Error()}>Update</button>

                                            :

                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => check_Validation_Error()}>Save</button>

                                    }
                                    <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={OnClose}>Close</button>
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

export default CourtInformationAddUp