import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import { Decrypt_Id_Name, base64ToString, colourStyles, filterPassedDateTime, filterPassedTime, getShowingDateText, getShowingMonthDateYear, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { get_FieldInterview_Data } from '../../../../../redux/actions/FieldInterviewAction';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { get_FISuspectActivity_Drp_Data, get_FIContactType_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import Location from '../../../../Location/Location';
import AddressVerify from '../../../Name/NameTab/Address/AddressVerify';

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const Home = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const FieldInterviewData = useSelector((state) => state.FieldInterview.FieldInterviewData);
    const FISuspectActivity = useSelector((state) => state.DropDown.FISuspectActivity);
    const FIContactType = useSelector((state) => state.DropDown.FIContactType);
    const { setChangesStatus, setActiveArrest } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecEIncID = 0
    let DecFiID = 0

    const query = useQuery();
    var IncID = query?.get("IncId");
    var FiID = query?.get("FieldID");
    var FiSta = query?.get('Fieldst');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    let MstPage = query?.get('page');

    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    if (!FiID) { DecFiID = 0; }
    else { DecFiID = parseInt(base64ToString(FiID)); }

    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [Editval, setEditval] = useState('');
    const [IncidentNumber, setIncidentNumber] = useState('');
    const [interviewID, setinterviewID] = useState()
    const [addVerifySingleData, setAddVerifySingleData] = useState([]);
    const [locationStatus, setLocationStatus] = useState(false);
    const [modalStatus, setModalStatus] = useState(false);
    const [onSelectLocation, setOnSelectLocation] = useState(true);
    const [updateStatus, setUpdateStatus] = useState(0);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(parseInt(localStoreData?.AgencyID)); setloginPinID(parseInt(localStoreData?.PINID));
        }
    }, [localStoreData]);

    const [value, setValue] = useState({
        'AgencyID': '', 'IncidentID': '', 'IncidentNumber': IncNo, 'StartDtTm': '', 'EndDtTm': '', 'FIOfficerID': '',
        'OtherOfficerID': '', 'FILocationID': '', 'IsVerify': true, 'ContactTypeID': '', 'ContactSource': '', 'Bureau': '',
        'ContactReason': '', 'SuspectActivityID': '', 'CreatedByUserFK': '', 'FINumber': '', 'Location': ''
    });

    const [errors, setErrors] = useState({
        'OtherOfficerIDError': '', 'StartDtTmError': '',
    })

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value,
                'IncidentID': DecEIncID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'FIOfficerID': loginPinID,
                'StartDtTm': incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date())
            });
            dispatch(get_FieldInterview_Data(DecEIncID))
            if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)) }
            if (FISuspectActivity?.length === 0) { dispatch(get_FISuspectActivity_Drp_Data(loginAgencyID)) }
            if (FIContactType?.length === 0) { dispatch(get_FIContactType_Drp_Data(loginAgencyID)) }
        }
    }, [loginAgencyID, incReportedDate]);

    const check_Validation_Error = (e) => {
        const OtherOfficerIDErr = RequiredFieldIncident(value.OtherOfficerID);
        const StartDtTmErr = RequiredFieldIncident(value.StartDtTm);
        setErrors(prevValues => {
            return {
                ...prevValues,
                ['OtherOfficerIDError']: OtherOfficerIDErr || prevValues['OtherOfficerIDError'],
                ['StartDtTmError']: StartDtTmErr || prevValues['StartDtTmError'],
            }
        });
    }

    const { OtherOfficerIDError, StartDtTmError } = errors

    useEffect(() => {
        if (OtherOfficerIDError === 'true' && StartDtTmError === 'true') {
            if (interviewID) { update_FieldInterview_data() }
            else { insert_FieldInterview_Data(); }
        }
    }, [OtherOfficerIDError, StartDtTmError])

    useEffect(() => {
        if (Editval) {
            setValue({
                ...value,
                'AgencyID': Editval[0]?.AgencyID, 'IncidentID': Editval[0]?.IncidentID, 'IncidentNumber': Editval[0]?.IncidentNumber, 'StartDtTm': Editval[0]?.StartDtTm, 'FINumber': Editval[0]?.FINumber, 'CreatedByUserFK': Editval[0]?.CreatedByUserFK, 'Location': Editval[0]?.Location, 'LocationID': Editval[0]?.LocationID, 'EndDtTm': Editval[0]?.EndDtTm ? getShowingDateText(Editval[0]?.EndDtTm) : '', 'FIOfficerID': Editval[0]?.FIOfficerID, 'OtherOfficerID': Editval[0]?.OtherOfficerID, 'FILocationID': Editval[0]?.FILocationID, 'IsVerify': Editval[0]?.IsVerify, 'ContactTypeID': Editval[0]?.ContactTypeID, 'ContactSource': Editval[0]?.ContactSource, 'Bureau': Editval[0]?.Bureau, 'ContactReason': Editval[0]?.ContactReason, 'SuspectActivityID': Editval[0]?.SuspectActivityID,
            })
            if (!Editval[0]?.IsVerify && parseInt(Editval[0]?.FILocationID)) {
                get_Add_Single_Data(Editval[0]?.FILocationID);
            }
            setinterviewID(Editval[0]?.FieldInterviewID)
        } else {
            setValue({
                ...value,
                'StartDtTm': incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()),
                'AgencyID': '', 'IncidentID': '', 'EndDtTm': Editval[0]?.EndDtTm ? getShowingDateText(Editval[0]?.EndDtTm) : '', 'SuspectActivityID': '', 'CreatedByUserFK': '', 'ContactTypeID': '', 'ContactSource': '', 'Bureau': '', 'ContactReason': '', 'IsVerify': true, 'FINumber': '', 'OtherOfficerID': '', 'FILocationID': '', 'Location': '',
            });
            setUpdateStatus(updateStatus + 1);
        }
    }, [Editval])

    const set_Edit_Value = (row) => {
        if (row) {
            navigate(`/field-interview?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&FieldID=${stringToBase64(row?.FieldInterviewID)}&Fieldst=${true}&`)
            setinterviewID(row?.FieldInterviewID);
            setActiveArrest(row?.FieldInterviewID);
            setUpdateStatus(updateStatus + 1);
        }
    }

    const setStatusFalse = () => {
        navigate(`/field-interview?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&FieldID=${''}&Fieldst=${false}`)
        setinterviewID('');
        reset();
        setLocationStatus(true);
        setChangesStatus(false);
        setActiveArrest(false);
        setUpdateStatus(updateStatus + 1);
    }

    const HandleChange = (e) => {
        if (e.target.name === 'IsVerify') {
            if (e.target.name === 'IsVerify') {
                if (e.target.checked && addVerifySingleData.length > 0) {
                    setModalStatus(false);
                    setLocationStatus(true); setAddVerifySingleData([]);
                    setValue(pre => { return { ...pre, ['Location']: '', [e.target.name]: e.target.checked, } });
                } else {
                    setValue(pre => { return { ...pre, [e.target.name]: e.target.checked, } });
                    setModalStatus(true);
                    setLocationStatus(false);
                    setAddVerifySingleData([]);
                }
            } else {
                setValue({ ...value, [e.target.name]: e.target.checked, })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    };

    const handleInputChange = (e) => {
        setIncidentNumber(e.target.value);
    };

    const insert_FieldInterview_Data = () => {
        AddDeleteUpadate('FieldInterview/Insert_FieldInterview', value).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                dispatch(get_FieldInterview_Data(DecEIncID));
                setChangesStatus(false);
                setLocationStatus(true);
                setErrors({ ...errors, ['OtherOfficerIDError']: '' });
                setUpdateStatus(updateStatus + 1);
            }
        })
    }

    const update_FieldInterview_data = () => {
        const { StartDtTm, EndDtTm, FIOfficerID, OtherOfficerID, FILocationID, IsVerify, ContactTypeID,
            ContactSource, Bureau, ContactReason, SuspectActivityID, FINumber, Location } = value;
        const val = { 'StartDtTm': StartDtTm, 'EndDtTm': EndDtTm, 'FIOfficerID': FIOfficerID, 'OtherOfficerID': OtherOfficerID, 'FILocationID': FILocationID, 'IsVerify': IsVerify, 'ContactTypeID': ContactTypeID, 'ContactSource': ContactSource, 'Bureau': Bureau, 'ContactReason': ContactReason, 'SuspectActivityID': SuspectActivityID, 'ModifiedByUserFK': loginPinID, 'FieldInterviewID': interviewID, 'FINumber': FINumber, 'Location': Location }
        AddDeleteUpadate('FieldInterview/Update_FieldInterview', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                dispatch(get_FieldInterview_Data(DecEIncID))
                setErrors({ ...errors, ['OtherOfficerIDError']: '' });
                setChangesStatus(false);
                setUpdateStatus(updateStatus + 1);
            } else {
                toastifyError('Error');
                setErrors({ ...errors, ['OtherOfficerIDError']: '' });
            }
        })
    }

    //--------------------------------Location--------------------------
    const get_Add_Single_Data = (FILocationID) => {
        const val = { 'LocationID': FILocationID, }

        fetchPostData('MasterLocation/GetSingleData_MasterLocation', val).then((res) => {
            if (res.length > 0) {
                setAddVerifySingleData(res)
            } else {
                setAddVerifySingleData([])
            }
        })
    }

    useEffect(() => {
        if (DecFiID) {
            GetSingleData_FieldInterview_Data(DecFiID);
        } else {
            reset()
        }
        if (!incReportedDate) { dispatch(get_Inc_ReportedDate(DecEIncID)) }
    }, [DecFiID]);

    const GetSingleData_FieldInterview_Data = (ID) => {
        const val = { 'FieldInterviewID': ID }
        fetchPostData('FieldInterview/GetSingleData_FieldInterview', val)
            .then((res) => {
                if (res.length > 0) {
                    setEditval(res);
                    setUpdateStatus(updateStatus + 1);
                } else { setEditval([]) }
            })
    }

    const Delete_FieldInterview_Data = () => {
        const val = { 'FieldInterviewID': interviewID, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('FieldInterview/Delete_FieldInterview', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                dispatch(get_FieldInterview_Data(DecEIncID));
                setStatusFalse();
                setUpdateStatus(updateStatus + 1);
            } else console.log("Somthing Wrong");
            setUpdateStatus(updateStatus + 1);
        })
    }

    const ChangeDropDown = (e, name) => {
        if (e) { setValue({ ...value, [name]: e.value }); }
        else { setValue({ ...value, [name]: null }) }
    }

    const reset = () => {
        setValue({
            ...value,
            'IncidentNumber': IncNo, 'StartDtTm': incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()), 'EndDtTm': '', 'FIOfficerID': loginPinID, 'FINumber': '', 'OtherOfficerID': '', 'FILocationID': '', 'IsVerify': true, 'ContactTypeID': '', 'ContactSource': '', 'Bureau': '', 'ContactReason': '', 'SuspectActivityID': '', 'Location': ''
        });
        setErrors({ ...errors, 'OtherOfficerIDError': '', 'StartDtTmError': '', });
        setinterviewID('');
    }

    const columns = [
        {
            name: 'FI Number',
            selector: (row) => row.FINumber ? row.FINumber : '',
            sortable: true
        },
        {
            name: 'Contact Source',
            selector: (row) => row.ContactSource ? row.ContactSource : '',
            sortable: true
        },
        {
            name: 'Start Date/Time',
            selector: (row) => row.StartDtTm ? row.StartDtTm : '',
        },
        {
            name: 'Location',
            selector: (row) => row.Location ? row.Location : '',
            sortable: true
        },
      
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    <span className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setinterviewID(row.FieldInterviewID); }} data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </span>
                </div>
        }
    ]

    const conditionalRowStyles = [
        {
            when: row => row.FieldInterviewID === interviewID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const colourStylesReason = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
            minHeight: 33,
        }),
    };

    return (
        <>
            <div className="col-12">
                <div className="row " style={{ marginTop: '-16px', marginLeft: '-18px' }}>
                    <div className="col-3 col-md-3 col-lg-1 mt-2 pt-2">
                        <label htmlFor="" className='new-label'>FI Number</label>
                    </div>
                    <div className="col-4 col-md-9 col-lg-2 mt-2 text-field">
                        <input type="text" className='form-control' value={value?.FINumber ? value?.FINumber : 'Auto Genrated'} placeholder='Auto Genrated' onChange={''} name='FINumber' id='FINumber' required readOnly />
                    </div>
                    <div className="col-2 col-md-3 col-lg-2 mt-2 pt-2">
                        <label htmlFor="" className='new-label'>Start Date/Time{errors.StartDtTmError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.StartDtTmError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-9 col-md-3 col-lg-2 mt-1">
                        <DatePicker
                            id='StartDtTm'
                            name='StartDtTm'
                            autoComplete='Off'
                            className='requiredColor'
                            dateFormat="MM/dd/yyyy HH:mm"
                            onChange={(date) => { setValue({ ...value, ['StartDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
                            selected={value?.StartDtTm && new Date(value?.StartDtTm)}
                            timeInputLabel
                            placeholderText={'Select...'}
                            showTimeSelect
                            timeIntervals={1}
                            timeCaption="Time"
                            minDate={new Date(incReportedDate)}
                            readOnly
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2 pt-2">
                        <label htmlFor="" className='new-label'>End Date/Time</label>
                    </div>
                    <div className="col-9 col-md-3 col-lg-3 mt-1">
                        <DatePicker
                            id='EndDtTm'
                            name='EndDtTm'
                            className=''
                            dateFormat="MM/dd/yyyy HH:mm"
                            onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                    e?.preventDefault();
                                }
                            }}
                            onChange={(date) => {
                                if (date >= new Date()) {
                                    setValue({ ...value, ['EndDtTm']: new Date() ? getShowingMonthDateYear(new Date()) : null })
                                } else if (date <= new Date(incReportedDate)) {
                                    setValue({ ...value, ['EndDtTm']: incReportedDate ? getShowingMonthDateYear(incReportedDate) : null })
                                } else {
                                    setValue({ ...value, ['EndDtTm']: date ? getShowingMonthDateYear(date) : null })
                                }
                            }}
                            selected={value?.EndDtTm && new Date(value?.EndDtTm)}
                            timeInputLabel
                            isClearable={value?.EndDtTm ? true : false}
                            placeholderText={'Select...'}
                            showTimeSelect
                            timeIntervals={1}
                            filterTime={(time) => filterPassedDateTime(time, value?.EndDtTm, incReportedDate)}
                            timeCaption="Time"
                            minDate={new Date(incReportedDate)}
                            maxDate={new Date()}
                            autoComplete='Off'

                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 mt-2 pt-2">
                        <label htmlFor="" className='new-label'>FI Officer</label>
                    </div>
                    <div className="col-9 col-md-9 col-lg-2 mt-2 ">
                        <Select
                            name="FIOfficerID"
                            styles={customStylesWithOutColor}
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.FIOfficerID)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'FIOfficerID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-3 col-lg-2 mt-2 pt-2">
                        <label htmlFor="" className='new-label'>Other Officer{errors.OtherOfficerIDError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OtherOfficerIDError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-9 col-md-9 col-lg-7 mt-2 ">
                        <Select
                            name="OtherOfficerID"
                            styles={colourStylesReason}
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OtherOfficerID)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'OtherOfficerID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 mt-2 pt-2">
                        <label htmlFor="" className='new-label'>Incident No.</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2 text-field">
                        <input type="text" name='IncidentID' id='IncidentID' onChange={handleInputChange}
                            value={value?.IncidentNumber} className='requiredColor' readOnly />
                    </div >
                    <div className="col-1 col-md-4 col-lg-1 pt-2" data-toggle="modal" data-target="#MasterModal" style={{ cursor: 'pointer' }}>
                        <span
                            className=" btn btn-sm bg-green text-white py-0 px-1"   >
                            <i className="fa fa-search"  > </i>
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 mt-2 pt-2">
                        <label htmlFor="" className='new-label'>Location</label>
                    </div>
                    <div className="col-4 col-md-6 col-lg-5 mt-2 text-field">
                        <Location {...{ value, setValue, locationStatus, setLocationStatus, setOnSelectLocation, updateStatus }}
                            col='Location' locationID='FILocationID' check={true} verify={value.IsVerify} />
                    </div>
                  
                    <div className="col-2 col-md-3 col-lg-2 mt-2 mb-2 d-flex">
                        <div className="form-check custom-control custom-checkbox">
                            <input className="form-check-input" data-toggle="modal" data-target="#AddressVerifyModal" type="checkbox" name='IsVerify'
                                checked={(value?.IsVerify || !value?.FILocationID)}
                                value={value?.IsVerify} onChange={HandleChange} id="flexCheckDefault" style={{ cursor: 'pointer' }} />
                            <label className="form-check-label mr-2" htmlFor="flexCheckDefault">
                                Verify
                            </label>
                            {
                                !value?.IsVerify && addVerifySingleData.length > 0 ?
                                    <i className="fa fa-edit " onKeyDown={''} onClick={() => { if (value.FILocationID) { if (value.FILocationID) { get_Add_Single_Data(value.FILocationID); setModalStatus(true); } } }} data-toggle="modal" data-target="#AddressVerifyModal" style={{ cursor: 'pointer', backgroundColor: '' }} > Edit </i>
                                    :
                                    <>
                                    </>
                            }
                        </div>
                    </div>
                    <div className="col-2 col-md-3 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Contact Type</label>
                    </div>
                    <div className="col-4 col-md-3 col-lg-2 mt-1 ">
                        <Select
                            name="ContactTypeID"
                            styles={customStylesWithOutColor}
                            value={FIContactType?.filter((obj) => obj.value === value?.ContactTypeID)}
                            isClearable
                            options={FIContactType}
                            onChange={(e) => ChangeDropDown(e, 'ContactTypeID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-3 col-lg-2 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Contact Source</label>
                    </div>
                    <div className="col-4 col-md-3 col-lg-2 mt-1 text-field">
                        <input type="text" name='ContactSource' id='ContactSource' className='' value={value?.ContactSource} onChange={HandleChange} required />
                    </div>
                    <div className="col-2 col-md-3 col-lg-2 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Contact Reason</label>
                    </div>
                    <div className="col-4 col-md-3 col-lg-3 mt-1 text-field">
                        <input type="text" name='ContactReason' id='ContactReason' value={value?.ContactReason} onChange={HandleChange} className='' required />
                    </div>
                    <div className="col-2 col-md-3 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label'>Bureau</label>
                    </div>
                    <div className="col-4 col-md-3 col-lg-2 mt-1 text-field">
                        <input type="text" name='Bureau' id='Bureau' value={value?.Bureau} onChange={HandleChange} className='' required />
                    </div>
                    <div className="col-2 col-md-3 col-lg-2 mt-2 pt-1 ">
                        <label htmlFor="" className='new-label '>Suspect&nbsp;Activity</label>
                    </div>
                    <div className="col-4 col-md-9 col-lg-2 mt-1 ">
                        <Select
                            name="SuspectActivityID"
                            styles={customStylesWithOutColor}
                            isClearable
                            options={FISuspectActivity}
                            value={FISuspectActivity?.filter((obj) => obj.value === value?.SuspectActivityID)}
                            onChange={(e) => ChangeDropDown(e, 'SuspectActivityID')}
                            placeholder="Select..."
                        />
                    </div>

                </div >
                <div className="btn-box text-right mt-1 mr-1 mb-2">
                    <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { setStatusFalse() }} >New</button>
                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Validation_Error(); }} > {interviewID ? 'Update' : 'Save'} </button>

                </div>
            </div >
            <div className="col-12 mt-1" >

                <DataTable
                    dense
                    columns={columns}
                    data={FieldInterviewData}
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    onRowClicked={(row) => {
                        set_Edit_Value(row);

                    }}
                    fixedHeaderScrollHeight='170px'
                    conditionalRowStyles={conditionalRowStyles}
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                />
            </div>
            <DeletePopUpModal func={Delete_FieldInterview_Data} />
            <AddressVerify {...{ loginAgencyID, loginPinID, modalStatus, setModalStatus, value, setValue, addVerifySingleData, setAddVerifySingleData, get_Add_Single_Data, setUpdateStatus }} />
        </>

    )
}

export default Home