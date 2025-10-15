import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useLocation } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility';
import NameListing from '../../../ShowAllList/NameListing';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const Warrant = (props) => {

    const { ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails = false } = props

    const { get_Name_Count, setChangesStatus, GetDataTimeZone, datezone, NameId } = useContext(AgencyContext)

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const [status, setStatus] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [clickedRow, setClickedRow] = useState(null);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0)
    const [WarrentTypeDrp, setWarrentTypeDrp] = useState([])
    const [warrantStatus, setWarrantStatus] = useState([])
    const [agencyData, setAgencyData] = useState([])
    const [warrantID, setWarrantID] = useState([])
    const [warrentTypeData, setWarrentTypeData] = useState([])
    const [DateTimeIssued, setDateTimeIssued] = useState(new Date());
    const [DateExpired, setDateExpired] = useState(false);
    const [editval, setEditval] = useState();
    const [openPage, setOpenPage] = useState('');
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    const [addUpdatePermission, setaddUpdatePermission] = useState();


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');

    const [value, setValue] = useState({
        'WarrantNumber': '', 'NameID': '', 'WarrantTypeID': '', 'WarrantStatusID': '',
        'AssignedOfficerID': '', 'MasterNameID': '', 'IssuingAgencyID': '', 'WarrantIssuingAgency': '', 'DateTimeIssued': '', 'DateExpired': '',
        'CreatedByUserFK': '', 'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
    });

    const [errors, setErrors] = useState({
        'WarrantTypeIDErrors': '', 'WarrantNumberErrors': '', 'DateTimeIssuedErrors': '', 'DateExpiredErrors': '', 'IssuingAgencyIDErrors': '',
    })

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N135", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    const reset = () => {
        setValue({
            ...value,
            'WarrantNumber': '', 'WarrantTypeID': '', 'WarrantStatusID': '', 'AssignedOfficerID': '', 'WarrantIssuingAgency': '',
            'IssuingAgencyID': '', 'WarrantIssuingAgency': '', 'DateTimeIssued': '', 'DateExpired': '',
        }); setErrors({ ...errors, 'WarrantTypeIDErrors': '', 'WarrantNumberErrors': '', 'DateTimeIssuedErrors': '', 'DateExpiredErrors': '', 'IssuingAgencyIDErrors': '', }); setDateTimeIssued(''); setDateExpired('')
    }

    const GetSingleData = (warrantID) => {
        const val = { WarrantID: warrantID, }
        fetchPostData('NameWarrant/GetSingleData_NameWarrant', val)
            .then((res) => {
                if (res) setEditval(res)
                else setEditval()
            }
            )
    }
    console.log(NameId)
    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'WarrantID': warrantID,
                'DateExpired': editval[0]?.DateExpired ? getShowingDateText(editval[0]?.DateExpired) : null,
                'DateTimeIssued': editval[0]?.DateTimeIssued ? getShowingDateText(editval[0]?.DateTimeIssued) : null,
                'WarrantNumber': editval[0]?.WarrantNumber, 'WarrantTypeID': editval[0]?.WarrantTypeID, 'WarrantStatusID': editval[0]?.WarrantStatusID,
                'AssignedOfficerID': editval[0]?.AssignedOfficerID, 'IssuingAgencyID': editval[0]?.IssuingAgencyID, 'WarrantIssuingAgency': editval[0]?.WarrantIssuingAgency,
                'ModifiedByUserFK': loginPinID,
            });
            setDateExpired(editval[0]?.DateExpired ? new Date(editval[0]?.DateExpired) : null);
            setDateTimeIssued(editval[0]?.DateTimeIssued ? new Date(editval[0]?.DateTimeIssued) : null);
        } else {
            setValue({
                ...value,
                'WarrantNumber': '', 'WarrantTypeID': '', 'WarrantStatusID': '', 'WarrantIssuingAgency': '',
                'AssignedOfficerID': '', 'MasterNameID': '', 'IssuingAgencyID': '', 'DateTimeIssued': '', 'DateExpired': '',
                'ModifiedByUserFK': '',
            })
        }
    }, [editval])


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {

            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, DecIncID))
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (NameId || DecMasterNameID) {
            setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': NameId } });
            get_WarrentType_Data(NameId, DecMasterNameID);
        }
    }, [NameId, DecMasterNameID, loginPinID]);


    const get_WarrentType_Data = (DecNameID, DecMasterNameID) => {
        const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
        const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('NameWarrant/GetData_NameWarrant', MstPage ? val2 : val).then((res) => {
            if (res) {
                setWarrentTypeData(res)
            } else {
                setWarrentTypeData([]);
            }
        })
    }

    const check_Validation_Error = (e) => {
        const WarrantTypeIDErrors = RequiredFieldIncident(value.WarrantTypeID);
        const WarrantNumberErrors = RequiredFieldIncident(value.WarrantNumber);
        const DateTimeIssuedErrors = RequiredFieldIncident(value.DateTimeIssued);
        const DateExpiredErrors = RequiredFieldIncident(value.DateExpired);
        const IssuingAgencyIDErrors = RequiredFieldIncident(value.IssuingAgencyID || value.WarrantIssuingAgency);

        setErrors(pre => {
            return {
                ...pre,
                ['WarrantTypeIDErrors']: WarrantTypeIDErrors || pre['WarrantTypeIDErrors'],
                ['WarrantNumberErrors']: WarrantNumberErrors || pre['WarrantNumberErrors'],
                ['DateTimeIssuedErrors']: DateTimeIssuedErrors || pre['DateTimeIssuedErrors'],
                ['DateExpiredErrors']: DateExpiredErrors || pre['DateExpiredErrors'],
                ['IssuingAgencyIDErrors']: IssuingAgencyIDErrors || pre['IssuingAgencyIDErrors'],

            }
        });
    }
    const { WarrantTypeIDErrors, IssuingAgencyIDErrors, DateExpiredErrors, DateTimeIssuedErrors, WarrantNumberErrors } = errors

    useEffect(() => {
        if (WarrantTypeIDErrors === 'true' && IssuingAgencyIDErrors === 'true' && DateExpiredErrors === 'true' && DateTimeIssuedErrors === 'true' && WarrantNumberErrors === 'true') {
            if (warrantID && status) { update_Activity() }
            else { Add_Type() }
        }
    }, [WarrantTypeIDErrors, IssuingAgencyIDErrors, DateExpiredErrors, DateTimeIssuedErrors, WarrantNumberErrors])

    const DropDownIssuingAgency = (e, name) => {
        //  !addUpdatePermission && setChangesStatus(true)
        console.log(e, name)
        if (name === 'WarrantIssuingAgencyID') {
            !addUpdatePermission && setChangesStatus(true);
            !addUpdatePermission && setStatesChangeStatus(true);
            if (e?.__isNew__) {

                setValue({ ...value, IssuingAgencyID: '', WarrantIssuingAgency: e.label, });
            } else if (e) {

                setValue({ ...value, IssuingAgencyID: e.value, WarrantIssuingAgency: '', });
            } else {

                setValue({ ...value, IssuingAgencyID: '', WarrantIssuingAgency: '', });
            }
        }
    }
    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else {
            setValue({ ...value, [name]: null })
        }

    }

    const handleChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        setValue({ ...value, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (openPage || loginAgencyID || loginPinID) {
            GetWarrentType(loginAgencyID); GetwarrantStatus(loginAgencyID); getAgency(loginAgencyID)
        }
    }, [loginAgencyID, loginPinID, openPage])


    const GetWarrentType = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('WarrantType/GetDataDropDown_WarrantType', val).then((data) => {
            if (data) {
                setWarrentTypeDrp(Comman_changeArrayFormat(data, 'WarrantTypeID', 'Description'))
            } else {
                setWarrentTypeDrp([]);
            }
        })
    }

    const GetwarrantStatus = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('WarrantStatus/GetDataDropDown_WarrantStatus', val).then((data) => {
            if (data) {
                setWarrantStatus(Comman_changeArrayFormat(data, 'WarrantStatusID', 'Description'))
            } else {
                setWarrantStatus([]);
            }
        })
    }

    const getAgency = async (loginAgencyID,) => {
        const value = { AgencyID: loginAgencyID, }
        fetchPostData("WarrantIssuingAgency/GetDataDropDown_WarrantIssuingAgency", value).then((data) => {
            if (data) {
                console.log(data)
                setAgencyData(Comman_changeArrayFormat(data, 'WarrantIssuingAgencyID', 'Description'))
            } else {
                setAgencyData();
            }
        })
    }

    const columns = [
        {
            name: 'Warrant No.',
            selector: (row) => row.WarrantNumber,
            sortable: true
        },
        {
            name: 'Warrant Type',
            selector: (row) => row.WarrantType_Description,
            sortable: true
        },

        {
            name: 'Assigned Officer',
            selector: (row) => row.AssignedOfficer,
            format: (row) => (
                <>{row?.AssignedOfficer ? row?.AssignedOfficer.substring(0, 30) : ''}{row?.AssignedOfficer?.length > 40 ? '  . . .' : null} </>
            ),
            sortable: true
        },
        {
            name: 'Warrant Status',
            selector: (row) => row.WarrantStatus,
            sortable: true
        },
        {
            name: 'Issued Date/Time',
            selector: (row) => row.DateTimeIssued ? getShowingDateText(row.DateTimeIssued) : " ",
            sortable: true
        },

        {
            name: 'Expired Date/Time',
            selector: (row) => row.DateExpired ? getShowingDateText(row.DateExpired) : " ",
            sortable: true
        },


        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={() => { setWarrantID(row.WarrantID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            : <span onClick={() => { setWarrantID(row.WarrantID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>

        }
    ]

    const setStatusFalse = (e) => {
        reset(); setStatesChangeStatus(false); setChangesStatus(false); setStatus(false); reset();
        setUpdateStatus(updateStatus + 1); setClickedRow(null);
    }

    const set_Edit_Value = (row) => {
        reset(); setStatus(true);
        setUpdateStatus(updateStatus + 1);
        setWarrantID(row.WarrantID);
        GetSingleData(row.WarrantID); setStatesChangeStatus(false); setChangesStatus(false);
    }

    const Add_Type = () => {
        const result = warrentTypeData?.find(item => {
            if (item.WarrantNumber === value.WarrantNumber) {
                return item.WarrantNumber === value.WarrantNumber
            } else return item.WarrantNumber === value.WarrantNumber
        });
        const result1 = warrentTypeData?.find(item => {
            if (item.WarrantTypeID === value.WarrantTypeID) {
                return item.WarrantTypeID === value.WarrantTypeID
            } else return item.WarrantTypeID === value.WarrantTypeID
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('WarrantNumber Already Exists')
                setErrors({ ...errors, ['WarrantTypeIDErrors']: '' })
            }
            if (result1) {
                toastifyError('WarrantType Already Exists')
                setErrors({ ...errors, ['WarrantTypeIDErrors']: '' })
            }
        } else {
            AddDeleteUpadate('NameWarrant/Insert_NameWarrant', value).then((res) => {
                get_WarrentType_Data(NameId, DecMasterNameID);
                setChangesStatus(false);
                setStatesChangeStatus(false);
                const parseData = JSON.parse(res.data);
                get_Name_Count(NameId, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
                toastifySuccess(parseData?.Table[0].Message); getAgency(loginAgencyID)
                reset(); setErrors({ ...errors, 'WarrantTypeIDErrors': '', })
            })
        }
    }

    const update_Activity = () => {
        const result = warrentTypeData?.find(item => {
            if (item.WarrantID != value.WarrantID) {
                if (item.WarrantNumber) {
                    if (item.WarrantNumber === value.WarrantNumber) {
                        return item.WarrantNumber === value.WarrantNumber
                    } else return item.WarrantNumber === value.WarrantNumber
                }
            }
        });
        const result1 = warrentTypeData?.find(item => {
            if (item.WarrantID != value.WarrantID) {
                if (item.WarrantTypeID) {
                    if (item.WarrantTypeID === value.WarrantTypeID) {
                        return item.WarrantTypeID === value.WarrantTypeID
                    } else return item.WarrantTypeID === value.Description
                }
            }
        }
        );
        if (result || result1) {
            if (result) {
                toastifyError('WarrantNumber Already Exists')
                setErrors({ ...errors, ['WarrantTypeIDErrors']: '' })
            }
            if (result1) {
                toastifyError('WarrantType Already Exists')
                setErrors({ ...errors, ['WarrantTypeIDErrors']: '' })
            }
        } else {
            AddDeleteUpadate('NameWarrant/Update_NameWarrant', value).then((res) => {
                const parseData = JSON.parse(res.data);
                toastifySuccess(parseData?.Table[0].Message);
                get_Name_Count(NameId, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
                setChangesStatus(false); setStatesChangeStatus(false);
                get_WarrentType_Data(NameId, DecMasterNameID); getAgency(loginAgencyID)
                setErrors({ ...errors, 'WarrantTypeIDErrors': '', })
                reset(); setStatus(false);
            })
        }
    }

    const DeleteNameAliases = () => {
        const val = { 'WarrantID': warrantID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('NameWarrant/Delete_NameWarrant', val).then((res) => {
            if (res) {
                const parseData = JSON.parse(res.data);
                toastifySuccess(parseData?.Table[0].Message); setChangesStatus(false);
                get_Name_Count(NameId, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
                get_WarrentType_Data(NameId, DecMasterNameID); setStatus(false); reset()
            } else console.log("Somthing Wrong");
        })
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];



    const customStylesWithOutColor = {
        control: base => ({
            ...base, height: 20, minHeight: 33, fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();


    const filterTimeForDateZone = (time, datezone) => {
        const zoneDate = new Date(datezone);
        const zoneHours = zoneDate.getHours();
        const zoneMinutes = zoneDate.getMinutes();

        const timeHours = time.getHours();
        const timeMinutes = time.getMinutes();
        if (timeHours > zoneHours || (timeHours === zoneHours && timeMinutes > zoneMinutes)) {
            return false;
        }

        return true;
    };



    return (
        <>
            <NameListing  {...{ ListData }} />
            <div className="col-md-12 mt-1">
                <div className="row">
                    <div className="col-3 col-md-3 col-lg-1 mt-2">
                        <label htmlFor="" className='label-name '>Warrant No.{errors.WarrantNumberErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WarrantNumberErrors}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                        <input type="text" className='requiredColor' maxLength={10} value={value?.WarrantNumber} onChange={handleChange} name='WarrantNumber' required />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2">

                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Warrant Type')
                        }} data-target="#ListModel" className='new-link'>
                            Warrant Type{errors.WarrantTypeIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WarrantTypeIDErrors}</p>
                            ) : null}
                        </span>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-1" >
                        <Select
                            name='WarrantTypeID'
                            styles={Requiredcolour}
                            value={WarrentTypeDrp?.filter((obj) => obj.value === value?.WarrantTypeID)}
                            isClearable
                            options={WarrentTypeDrp}
                            onChange={(e) => ChangeDropDown(e, 'WarrantTypeID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                        <label htmlFor="" className='label-name '>Assigned Officer</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-1" >
                        <Select
                            name='AssignedOfficerID'
                            styles={customStylesWithOutColor}
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.AssignedOfficerID)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'AssignedOfficerID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-1 mt-2">

                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Warrant Status')
                        }} data-target="#ListModel" className='new-link'>
                            Warrant&nbsp;Status
                        </span>
                    </div>

                    <div className="col-3 col-md-3 col-lg-2  mt-1">
                        <Select
                            name='WarrantStatusID'
                            styles={customStylesWithOutColor}
                            value={warrantStatus?.filter((obj) => obj.value === value?.WarrantStatusID)}
                            isClearable
                            options={warrantStatus}
                            onChange={(e) => ChangeDropDown(e, 'WarrantStatusID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                        <label htmlFor="" className='label-name '>Issued Date/Time{errors.DateTimeIssuedErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateTimeIssuedErrors}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-3 mt-2">
                        <DatePicker
                            id='DateTimeIssued'
                            name='DateTimeIssued'
                            ref={startRef1}
                            className='requiredColor'
                            dateFormat="MM/dd/yyyy HH:mm"
                            selected={value?.DateTimeIssued ? new Date(value?.DateTimeIssued) : null}
                            isClearable={Boolean(value?.DateTimeIssued)}
                            placeholderText={value?.DateTimeIssued || 'Select...'}
                            showTimeSelect
                            timeInputLabel="Time"
                            timeIntervals={1}
                            timeCaption="Time"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            // minDate={new Date(NameDateExpired)}
                            // maxDate={new Date(datezone)}
                            autoComplete='off'
                            timeFormat="HH:mm"
                            is24Hour
                            onKeyDown={(e) => {
                                if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(date) => {
                                !addUpdatePermission && setStatesChangeStatus(true);
                                !addUpdatePermission && setChangesStatus(true);
                                if (date) {
                                    const currentTime = new Date();
                                    const updatedDate = new Date(date);

                                    if (updatedDate.getHours() === 0 && updatedDate.getMinutes() === 0) {
                                        updatedDate.setHours(currentTime.getHours());
                                        updatedDate.setMinutes(currentTime.getMinutes());
                                    }

                                    setDateTimeIssued(updatedDate);
                                    setValue({
                                        ...value,
                                        ['DateTimeIssued']: getShowingMonthDateYear(updatedDate),
                                        ['DateExpired']: ''
                                    });
                                    setDateExpired(); // optionally you can also pass null here: setDateExpired(null);
                                } else {
                                    setDateTimeIssued(null);
                                    setDateExpired(null); // <-- Clear Expired date
                                    setValue({ ...value, ['DateTimeIssued']: null, ['DateExpired']: null }); // <-- Clear both fields in value
                                }
                            }}

                        // filterTime={(time) => filterTimeForDateZone(time, datezone)}
                        />

                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                        <label htmlFor="" className='label-name '>Expired Date/Time{errors.DateExpiredErrors !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DateExpiredErrors}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                        <DatePicker
                            id="DateExpired"
                            name="DateExpired"
                            onChange={(date) => {
                                if (date) {
                                    const selectedDate = new Date(date);
                                    const isMidnight = selectedDate.getHours() === 0 && selectedDate.getMinutes() === 0;
                                    if (isMidnight) {
                                        const now = new Date();
                                        selectedDate.setHours(now.getHours());
                                        selectedDate.setMinutes(now.getMinutes());
                                        selectedDate.setSeconds(0);
                                        selectedDate.setMilliseconds(0);
                                    }

                                    setDateExpired(selectedDate);
                                    setStatesChangeStatus(true);
                                    setValue({
                                        ...value,
                                        ["DateExpired"]: getShowingDateText(selectedDate),
                                    });
                                } else {
                                    setDateExpired(null);
                                    setValue({ ...value, ["DateExpired"]: null });
                                }
                            }}

                            isClearable={value?.DateExpired ? true : false}
                            selected={DateExpired}
                            placeholderText={"Select..."}
                            autoComplete="Off"
                            dropdownMode="select"
                            showMonthDropdown
                            showDisabledMonthNavigation
                            showYearDropdown
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeFormat="HH:mm "
                            is24Hour
                            showTimeSelect
                            className='requiredColor'
                            timeCaption="Time"
                            // isDisabled={!value?.DateTimeIssued}
                            timeIntervals={1}
                            minDate={new Date(DateTimeIssued)}
                            disabled={value?.DateTimeIssued ? false : true}
                        // className={!value?.DateOfBirthFrom && 'readonlyColor'}

                        />
                    </div>


                    <div className="col-3 col-md-3 col-lg-1 mt-2">
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Warrant Issuing Agency')
                        }} data-target="#ListModel" className='new-link'>
                            Issuing&nbsp;Agency{errors.IssuingAgencyIDErrors !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IssuingAgencyIDErrors}</p>
                            ) : null}
                        </span>
                    </div>

                    <div className="col-9 col-md-9 col-lg-11 mt-1" >
                        <CreatableSelect
                            name="IssuingAgencyID"
                            isClearable
                            options={agencyData}
                            styles={Requiredcolour}
                            placeholder="Select or type..."
                            value={
                                agencyData?.find((obj) => obj.value?.toString() === value?.IssuingAgencyID?.toString())
                                || (value?.WarrantIssuingAgency
                                    ? { label: value.WarrantIssuingAgency, value: value.WarrantIssuingAgency } : null)
                            }
                            onChange={(e) => DropDownIssuingAgency(e, "WarrantIssuingAgencyID")}
                        />
                    </div>

                </div>
                {!isViewEventDetails &&
                    <div className="btn-box text-right mr-1 mb-2 mt-3">
                        <button type="button" data-dismiss="modal" onClick={() => {
                            setStatusFalse();
                        }} className="btn btn-sm btn-success mr-1" >New</button>

                        {
                            status ?
                                effectiveScreenPermission ?
                                    effectiveScreenPermission[0]?.Changeok ?
                                        <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                        :
                                        <>
                                        </>
                                    :
                                    <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                :
                                effectiveScreenPermission ?
                                    effectiveScreenPermission[0]?.AddOK ?
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                        :
                                        <>
                                        </>
                                    :
                                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                        }

                    </div>
                }

            </div >
            <div className="col-12 mt-3 modal-table">
                <DataTable
                    dense
                    columns={columns}

                    data={warrentTypeData}
                    pagination
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        setClickedRow(row);
                        set_Edit_Value(row);
                    }}
                    fixedHeader
                    persistTableHead={true}
                    fixedHeaderScrollHeight='200px'
                    conditionalRowStyles={conditionalRowStyles}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            <DeletePopUpModal func={DeleteNameAliases} />
            <ChangesModal func={check_Validation_Error} />
            <ListModal {...{ openPage, setOpenPage }} />

        </>
    )
}

export default Warrant