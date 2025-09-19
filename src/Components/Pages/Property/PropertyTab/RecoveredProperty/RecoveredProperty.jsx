import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { RequiredFieldIncident, RequiredFieldOnConditon, } from '../../../Utility/Personnel/Validation'
import { Decrypt_Id_Name, Requiredcolour, base64ToString, filterPassedTimeZonesProperty, getShowingMonthDateYear, tableCustomStyles } from '../../../../Common/Utility'
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from 'react-redux'
import { get_LocalStoreData } from '../../../../../redux/actions/Agency'
import PropListng from '../../../ShowAllList/PropListng'
import ChangesModal from '../../../../Common/ChangesModal'
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction'

const RecoveredProperty = (props) => {

    const { ListData, DecPropID, DecMPropID, incidentReportedDate, isViewEventDetails = false } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var ProId = query?.get("ProId");
    var MProId = query?.get("MProId");
    var IncID = query?.get("IncId");

    if (!ProId) ProId = 0;
    else ProId = parseInt(base64ToString(ProId));
    if (!MProId) ProId = 0;
    else MProId = parseInt(base64ToString(MProId));
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    let MstPage = query?.get('page');

    const { get_Property_Count, setChangesStatus, GetDataTimeZone, datezone } = useContext(AgencyContext);
    //screen permission 
    const [propertyData, setPropertyData] = useState([]);
    const [recoveredPropertyID, setRecoveredPropertyID] = useState();
    const [status, setStatus] = useState(false);

    const [propertyID, setPropertyID] = useState();
    const [masterPropertyID, setMasterPropertyID] = useState();
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [recoverDate, setRecoverDate] = useState();
    const [recoveryTypeDrpData, setRecoveryTypeDrpData] = useState([]);
    const [dispositionsDrpData, setDispositionsDrpData] = useState([]);
    const [recoverTypeCode, setRecoverTypeCode] = useState('');
    const [remainBalance, setRemainBalance] = useState(0);
    const [updateStatus, setUpdateStatus] = useState();
    // permissions
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [value, setValue] = useState({
        'RecoveredPropertyID': '', 'MasterPropertyID': '', 'PropertyID': '', 'RecoveredIDNumber': '', 'RecoveredDateTime': '', 'OfficerPFID': null,
        'RecoveryTypeID': null, 'AgencyID': '', 'RecoveredValue': '', 'Comments': '', 'Balance': '', 'DispositionID': null, 'UCRRecoveredID': null,
        'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
    });

    const reportedTime = new Date(incidentReportedDate);

    const [errors, setErrors] = useState({
        'DispositionIDError': '', 'OfficerPFIDError': '', 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', 'Comments': '', 'RecoverTypeCode': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("P066", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 ? true : false);
        } else {
            setPermissionForAdd(false);
            setPermissionForEdit(false);
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (loginAgencyID || loginPinID) {
            setValue({ ...value, 'PropertyID': ProId, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'MasterPropertyID': MProId, })
        }
    }, [loginAgencyID, loginPinID]);

    useEffect(() => {
        if (DecPropID || DecMPropID) {
            get_property_Data(DecPropID, DecMPropID); setPropertyID(DecPropID); setMasterPropertyID(DecMPropID);
        }
    }, [DecPropID, DecMPropID]);

    useEffect(() => {
        if (IncID) { setMainIncidentID(IncID); }
    }, [IncID])

    const check_Validation_Error = (e) => {
        const DispositionIDErr = RequiredFieldIncident(value.DispositionID);
        const OfficerPFIDErr = RequiredFieldIncident(value.OfficerPFID);
        const RecoveredDateTimeErr = RequiredFieldIncident(value.RecoveredDateTime);
        const RecoveryTypeIDErr = RequiredFieldIncident(value.RecoveryTypeID);
        const CommentsErr = RequiredFieldIncident(value.Comments);
        const ContactErr = recoverTypeCode === 'P' ? RequiredFieldOnConditon(value.RecoveredValue) : 'true';

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['DispositionIDError']: DispositionIDErr || prevValues['DispositionIDError'],
                ['OfficerPFIDError']: OfficerPFIDErr || prevValues['OfficerPFIDError'],
                ['RecoveredDateTimeError']: RecoveredDateTimeErr || prevValues['RecoveredDateTimeError'],
                ['RecoveryTypeIDError']: RecoveryTypeIDErr || prevValues['RecoveryTypeIDError'],
                ['Comments']: CommentsErr || prevValues['Comments'],
                ['ContactError']: ContactErr || prevValues['ContactError'],
            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { DispositionIDError, OfficerPFIDError, RecoveredDateTimeError, RecoveryTypeIDError, Comments, ContactError } = errors

    useEffect(() => {
        if (DispositionIDError === 'true' && OfficerPFIDError === 'true' && RecoveredDateTimeError === 'true' && RecoveryTypeIDError === 'true' && Comments === 'true' && ContactError === 'true') {
            if (recoveredPropertyID) { Update_RecoveredProperty() }
            else { Add_RecoveredProperty() }
        }
    }, [DispositionIDError, OfficerPFIDError, RecoveredDateTimeError, RecoveryTypeIDError, Comments, ContactError])

    useEffect(() => {
        if (loginAgencyID) { get_Head_Of_Agency(loginAgencyID); get_RecoveryType(loginAgencyID); get_Dispositions(); }
    }, [loginAgencyID]);

    useEffect(() => {
        if (sessionStorage.getItem('propertyStolenValue')) {
            if (propertyData) {
                let remainBal = Decrypt_Id_Name(sessionStorage.getItem('propertyStolenValue'), 'SForStolenValue');
                const newArr = propertyData.map((val) => { return val.RecoveredValue });
                for (let i in newArr) { remainBal = parseFloat(remainBal) - parseFloat(newArr[i]); }
                if (remainBal < 0) {
                    remainBal = 0;
                }
                remainBal = parseFloat(remainBal)?.toFixed(2)
                setRemainBalance(remainBal); setValue({ ...value, ['Balance']: remainBal })
            } else {
                setValue({ ...value, ['Balance']: parseInt(Decrypt_Id_Name(sessionStorage.getItem('propertyStolenValue'), 'SForStolenValue')) });
                setRemainBalance(parseFloat(Decrypt_Id_Name(sessionStorage.getItem('propertyStolenValue'), 'SForStolenValue')));
            }
        } else { setRemainBalance(0) }
    }, [updateStatus, propertyData, recoverTypeCode])

    const get_RecoveryType = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('RecoveryType/GetDataDropDown_RecoveryType', val).then((data) => {
            if (data) {
                setRecoveryTypeDrpData(threeColArray(data, 'RecoveryTypeID', 'Description', 'RecoveryTypeCode'));
            }
            else { setRecoveryTypeDrpData([]) }
        })
    };

    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            }
            else {
                setHeadOfAgency([])
            }
        })
    };

    const get_Dispositions = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('PropertyDispositions/GetDataDropDown_PropertyDispositions', val).then((data) => {
            if (data) {
                setDispositionsDrpData(Comman_changeArrayFormat(data, 'PropertyDispositionsID', 'Description'));
            }
            else { setDispositionsDrpData([]) }
        })
    };

    const HandleChanges = (e) => {
        !addUpdatePermission && setChangesStatus(true)
        if (e.target.name === 'RecoveredValue') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.charAt(0) === '.') { ele = ''; } // Clear the input if the first character is a dot
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    var total = 0
                    total = parseFloat(remainBalance) - parseFloat(e.target.value)
                    total = total?.toFixed(2)
                    setValue(pre => {
                        return { ...pre, ['Balance']: total, [e.target.name]: ele }
                    });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
                        if (!checkDot) {
                            var total = 0
                            total = parseFloat(remainBalance) - parseFloat(e.target.value)
                            total = total?.toFixed(2)
                            setValue(pre => {
                                return {
                                    ...pre, ['Balance']: total, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2)
                                }
                            });
                        }
                    } else {
                        var total = 0
                        total = parseFloat(remainBalance) - parseFloat(e.target.value)
                        total = total.toFixed(2)
                        setValue(pre => {
                            return { ...pre, ['Balance']: total, [e.target.name]: ele }
                        });
                    }
                }
            } else {
                if (ele.length === 16) {
                    var total = 0;
                    total = parseFloat(remainBalance) - parseFloat(ele)
                    total = total?.toFixed(2)
                    setValue({ ...value, ['Balance']: total ? total : remainBalance, [e.target.name]: ele });
                } else {
                    var total = 0;
                    total = parseFloat(remainBalance) - parseFloat(ele ? ele : 0)
                    total = total?.toFixed(2)
                    setValue({ ...value, ['Balance']: total ? total : remainBalance, [e.target.name]: ele });
                }
            }
        } else {
            setValue({ ...value, [e.target.name]: e.target.value })
        }
    }

    // complete code 
    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setChangesStatus(true)
        if (e) {
            if (name === 'RecoveryTypeID') {
                setValue({ ...value, ['RecoveryTypeID']: e.value })
                setRecoverTypeCode(e.id)
                if (e.id === 'FU' || e.id === 'F') {
                    let recoveredValue = '';
                    if (propertyData) {
                        recoveredValue = remainBalance;
                    } else {
                        const stolenValue = sessionStorage.getItem('propertyStolenValue');
                        if (stolenValue) {
                            recoveredValue = Decrypt_Id_Name(stolenValue, 'SForStolenValue');
                        }
                    }
                    if (isNaN(recoveredValue) || recoveredValue === undefined || recoveredValue === null) {
                        recoveredValue = '0.00';
                    }

                    setValue(pre => { return { ...pre, ['RecoveredValue']: recoveredValue } });
                } else {
                    setValue(pre => { return { ...pre, ['RecoveredValue']: '0.00' } });
                }
            } else {
                setValue({ ...value, [name]: e.value })
            }
        } else {
            if (name === 'RecoveryTypeID') {
                setValue({ ...value, [name]: null, ['RecoveredValue']: '0.00' });
                setUpdateStatus(updateStatus + 1);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }

    const Add_RecoveredProperty = (e) => {
        if (value.RecoveredValue >= 0) {
            if (parseFloat(value.RecoveredValue) <= parseFloat(remainBalance)) {
                if (remainBalance !== 0) {
                    AddDeleteUpadate('RecoveredProperty/Insert_RecoveredProperty', value)
                        .then((res) => {
                            const parsedData = JSON.parse(res.data);
                            const message = parsedData.Table[0].Message;
                            toastifySuccess(message);
                            setChangesStatus(false); get_property_Data(propertyID, masterPropertyID);
                            get_Property_Count(propertyID, masterPropertyID, MstPage === "MST-Property-Dash" ? true : false);
                            setStatus(false); reset(); setErrors({ ...errors, 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', });
                        })
                } else {
                    toastifyError("Remaining Balance is Zero"); setErrors({ ...errors, 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', });
                }
            } else {
                toastifyError("Recovered value should not be greater than Remaining Value");
                setErrors({ ...errors, 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', });
            }
        } else {
            toastifyError("The recovered value must be greater than zero"); setErrors({ ...errors, 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', });
        }
    }

    const Update_RecoveredProperty = () => {
        AddDeleteUpadate('RecoveredProperty/Update_RecoveredProperty', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            setChangesStatus(false); setStatus(false); reset(); get_property_Data(propertyID, masterPropertyID);
        })
    }

    const OnClose = () => {
        reset(); setRecoveredPropertyID(); setRecoverTypeCode()
    }



    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
        }
    };

    const reset = () => {
        setValue(pre => {
            return {
                ...pre, 'RecoveredIDNumber': '', 'RecoveredDateTime': '', 'OfficerPFID': '', 'RecoveryTypeID': '', 'RecoveredValue': '', 'Comments': '', 'DispositionID': '', 'UCRRecoveredID': '', 'AgencyID': loginAgencyID,
            }
        });
        setErrors({
            ...errors,
            'DispositionIDError': '', 'OfficerPFIDError': '', 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', 'Comments': '', 'ContactError': '',
        });
        setRecoverDate(""); setRecoverTypeCode('')
    }

    const get_property_Data = (propertyID, masterPropertyID) => {
        const val = { 'PropertyID': propertyID, 'MasterPropertyID': masterPropertyID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('RecoveredProperty/GetData_RecoveredProperty', val).then((res) => {
            if (res) {
                setPropertyData(res)
            } else {
                setPropertyData();
            }
        })
    }

    const columns = [
        {
            name: 'Recovered ID Number', selector: (row) => row.RecoveredIDNumber, sortable: true
        },
        {
            name: 'Comments', selector: (row) => row.Comments,
            format: (row) => (<>{row?.Comments ? row?.Comments.substring(0, 70) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
        {
            name: 'Recovered Value', selector: (row) => row.RecoveredValue, sortable: true

        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 30 }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 30 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={() => { setRecoveredPropertyID(row.RecoveredPropertyID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            : <span onClick={() => { setRecoveredPropertyID(row.RecoveredPropertyID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>
        }
    ]


    const Delete_RecoveredProperty = () => {
        const val = { 'RecoveredPropertyID': recoveredPropertyID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('RecoveredProperty/Delete_RecoveredProperty', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_property_Data(propertyID, masterPropertyID); get_Property_Count(propertyID, masterPropertyID, MstPage === "MST-Property-Dash" ? true : false);
                setRecoveredPropertyID(''); reset('');
            } else console.log("Somthing Wrong");
        })
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            reset(); setRecoveredPropertyID(); setRecoverTypeCode()
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => { document.removeEventListener("keydown", escFunction, false); };
    }, [escFunction]);

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
            <PropListng {...{ ListData }} />
            <div className="col-12 col-md-12 pt-1" >
                <div className="row align-items-center" style={{rowGap:"8px"}}>
                    <div className="col-2 col-md-2 col-lg-1">
                        <label htmlFor="" className='label-name mb-0 '>Officer Pf{errors.OfficerPFIDError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerPFIDError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2" >
                        <Select
                            name='OfficerPFID'
                            styles={Requiredcolour}
                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerPFID)}
                            isClearable
                            options={agencyOfficerDrpData}
                            onChange={(e) => ChangeDropDown(e, 'OfficerPFID')}
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='label-name mb-0 '>Recovered Date/Time  {errors.RecoveredDateTimeError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RecoveredDateTimeError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2" >
                        <DatePicker
                            id="RecoveredDateTime"
                            name="RecoveredDateTime"
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            onChange={(selectedDate) => {
                                if (!selectedDate) {
                                    // No date selected
                                    setRecoverDate(null);
                                    !addUpdatePermission && setChangesStatus(true);
                                    setValue({ ...value, ['RecoveredDateTime']: null });
                                    return;
                                }
                                let finalDate = new Date(selectedDate);
                                const now = new Date(datezone);
                                const incidentDate = new Date(incidentReportedDate);
                                // ✅ Check if datezone is valid
                                if (isNaN(now.getTime())) {
                                    console.warn("Invalid datezone:", datezone);
                                    return; // Or fallback to new Date()
                                }

                                if (
                                    finalDate.getHours() === 0 &&
                                    finalDate.getMinutes() === 0 &&
                                    finalDate.getSeconds() === 0
                                ) {
                                    finalDate.setHours(now.getHours());        // Set current hour
                                    finalDate.setMinutes(now.getMinutes());    // Set current minute
                                    finalDate.setSeconds(now.getSeconds());    // Set current second
                                    finalDate.setMilliseconds(now.getMilliseconds());  // Set milliseconds
                                }

                                let finalValidDate;

                                if (finalDate > now) {
                                    finalValidDate = now;  // Don't allow future dates
                                } else if (finalDate < incidentDate) {
                                    finalValidDate = incidentDate;  // Don't allow dates before incident date
                                } else {
                                    finalValidDate = finalDate;  // Otherwise, use selected date
                                }
                                // Format the date as per your requirements
                                const formattedDate = getShowingMonthDateYear(finalValidDate);
                                // Update state with the selected date
                                setRecoverDate(finalValidDate);
                                !addUpdatePermission && setChangesStatus(true);
                                setValue({
                                    ...value,
                                    ['RecoveredDateTime']: formattedDate
                                });
                            }}
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeFormat="HH:mm"
                            is24Hour
                            isClearable={!!value?.RecoveredDateTime}
                            selected={recoverDate}
                            placeholderText={value?.RecoveredDateTime ? value.RecoveredDateTime : 'Select...'}
                            className="requiredColor"
                            autoComplete="Off"
                            timeInputLabel
                            showTimeSelect
                            timeIntervals={1}
                            timeCaption="Time"
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            filterTime={(date) => filterPassedTimeZonesProperty(date, incidentReportedDate, datezone)}
                            maxDate={new Date(datezone)}
                            minDate={new Date(incidentReportedDate)}
                        />

                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <Link to={'/ListManagement?page=Recovery%20Type&call=/Prop-Home'} className='new-link'>
                            Recovery Type{errors.RecoveryTypeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RecoveryTypeIDError}</p>
                            ) : null}
                        </Link>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3" >
                        <Select
                            name='RecoveryTypeID'
                            value={recoveryTypeDrpData?.filter((obj) => obj.value === value?.RecoveryTypeID)}
                            options={recoveryTypeDrpData}
                            onChange={(e) => ChangeDropDown(e, 'RecoveryTypeID')}
                            styles={Requiredcolour}
                            isClearable
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1">
                        <label htmlFor="" className='label-name mb-0 text-nowrap'>Recovered Value {errors.ContactError !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 text-field mt-0" >
                        <input type="text" name="RecoveredValue" value={value?.RecoveredValue ?? "0.00"} onChange={HandleChanges}
                            className={`${recoverTypeCode === 'P' ? " " : "readonlyColor"} requiredColor`}
                            required readOnly={recoverTypeCode === 'P' ? false : true}
                        />
                    </div>

                    <div className="col-2 col-md-2 col-lg-2">
                        <label htmlFor="" className='label-name mb-0'>Balance</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-2 text-field mt-0" >
                        <input type="text" name="Balance"

                            value={
                                isNaN(value?.Balance) || value?.Balance < 0
                                    ? "0.00"
                                    : Number(value.Balance).toFixed(2)
                            }
                            onChange={HandleChanges} className="readonlyColor" required readOnly />
                    </div>
                    <div className="col-2 col-md-2 col-lg-2">
                        <Link to={'/ListManagement?page=Property%20Dispositions&call=/Prop-Home'} className='new-link'>
                            Disposition{errors.DispositionIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionIDError}</p>
                            ) : null}
                        </Link>
                    </div>
                    <div className="col-10 col-md-10 col-lg-3" >
                        <Select
                            name='DispositionID'
                            value={dispositionsDrpData?.filter((obj) => obj.value === value?.DispositionID)}
                            options={dispositionsDrpData}
                            onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                            styles={Requiredcolour}
                            isClearable
                            placeholder="Select..."
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1">
                        <label htmlFor="" className='label-name mb-0'>Comments{errors.Comments !== 'true' ? (
                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Comments}</p>
                        ) : null}</label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-6 text-field mt-0" >
                        <textarea name='Comments' value={value?.Comments} onChange={HandleChanges} id="Comments" cols="30" rows='4' className="form-control requiredColor" style={{ resize: 'none' }}></textarea>
                    </div>
                </div>
                {!isViewEventDetails &&
                    <div className="btn-box text-right  mr-1 mb-2">
                        <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={OnClose} >New</button>
                        {
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
                <div className="col-12 modal-table">
                    <DataTable
                        dense
                        columns={columns}

                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? propertyData : [] : propertyData}
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        highlightOnHover
                        fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        pagination
                        paginationPerPage={'100'}
                        fixedHeaderScrollHeight='150px'
                        paginationRowsPerPageOptions={[10, 15, 20, 50]}
                        showPaginationBottom={10}
                    />
                </div>
            </div>
            <ChangesModal func={check_Validation_Error} setToReset={OnClose} />
            <DeletePopUpModal func={Delete_RecoveredProperty} />
        </>
    )
}

export default RecoveredProperty

const Get_Property_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.RecoveryTypeID))

    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}