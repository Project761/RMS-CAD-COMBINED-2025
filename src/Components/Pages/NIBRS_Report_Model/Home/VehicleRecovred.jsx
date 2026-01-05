// import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
// import { Decrypt_Id_Name, filterPassedTimeZonesProperty, getShowingMonthDateYear, isLockOrRestrictModule, Requiredcolour, tableCustomStyles } from '../../../../Common/Utility'
// import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component'
// import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
// import DeletePopUpModal from '../../../../Common/DeleteModal'
// import { AgencyContext } from '../../../../../Context/Agency/Index'
// import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../../Utility/Personnel/Validation'
// import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat'
import Select from "react-select";
import DatePicker from "react-datepicker";
// import { useDispatch, useSelector } from 'react-redux'
// import { get_LocalStoreData } from '../../../../../redux/actions/Agency'
// import VehicleListing from '../../../ShowAllList/VehicleListing'
// import ChangesModal from '../../../../Common/ChangesModal'
// import { get_AgencyOfficer_Data, get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';


import React, { useState, useEffect, useContext, useRef } from 'react'
import { Decrypt_Id_Name, filterPassedTimeZonesProperty, getShowingMonthDateYear, isLockOrRestrictModule, Requiredcolour, tableCustomStyles } from '../../../Common/Utility'
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api'
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg'
import DeletePopUpModal from '../../../Common/DeleteModal'
import { AgencyContext } from '../../../../Context/Agency/Index';
import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat, threeColArray } from '../../../Common/ChangeArrayFormat';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../Common/ChangesModal';

const VehicleRecovred = (props) => {
    const dispatch = useDispatch();
    const { ListData, DecVehId, DecMVehId, IncID, isViewEventDetails = false, isLocked, setIsLocked, openVehicleRecoveredTab, mainIncidentID, setMainIncidentID, vehicleID, setVehicleID, masterPropertyID, vehicleData, get_property_Data } = props
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const { get_vehicle_Count, setChangesStatus, GetDataTimeZone, datezone, incidentReportedDate } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    const crossButtonRef = useRef(null);
    const query = useQuery();
    let MstVehicle = query?.get('page');

    const reportedTime = new Date(incidentReportedDate);
    const [modal, setModal] = useState(false)
    const [updateStatus, setUpdateStatus] = useState(0)
    // const [vehicleData, setVehicleData] = useState([]);
    const [VehicleRecoveredID, setVehicleRecoveredID] = useState();
    const [VehRecDeldID, setVehRecDelID] = useState();
    const [loder, setLoder] = useState(false);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    // const [masterPropertyID, setMasterPropertyID] = useState();
    // const [vehicleID, setVehicleID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    // const [mainIncidentID, setMainIncidentID] = useState('');
    const [recoverDate, setRecoverDate] = useState();
    const [headOfAgency, setHeadOfAgency] = useState([]);
    const [recoveryTypeDrpData, setRecoveryTypeDrpData] = useState([]);
    const [dispositionsDrpData, setDispositionsDrpData] = useState([]);
    const [recoverTypeCode, setRecoverTypeCode] = useState('');
    const [remainBalance, setRemainBalance] = useState(0);
    const [clickedRow, setClickedRow] = useState(null);
    const [upDateCount, setUpDateCount] = useState(0)
    const [status, setStatus] = useState(false)
    const [editval, setEditval] = useState();
    // permissions
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'VehicleRecoveredID': '', 'PropertyID': '', 'MasterPropertyID': '', 'RecoveredIDNumber': '', 'RecoveredDateTime': '',
        'OfficerPFID': null, 'RecoveryTypeID': null, 'RecoveredValue': '', 'Comments': '', 'Balance': '', 'DispositionID': null, 'UCRRecoveredID': null,
        'CreatedByUserFK': '', 'AgencyID': '', 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false,
    });

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
            dispatch(get_ScreenPermissions_Data("V084", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);

        }
    }, [localStoreData]);

    console.log(mainIncidentID)
    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        }
        else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (vehicleID || masterPropertyID) {
            setValue({
                ...value,
                'PropertyID': vehicleID, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginAgencyID, 'MasterPropertyID': masterPropertyID,
                'VehicleRecoveredID': '', 'RecoveredIDNumber': '', 'RecoveredDateTime': '', 'OfficerPFID': null, 'RecoveryTypeID': null, 'RecoveredValue': '', 'Comments': '', 'Balance': '', 'DispositionID': null, 'UCRRecoveredID': null, 'ModifiedByUserFK': '',
            }); get_property_Data(vehicleID); setVehicleID(vehicleID); get_vehicle_Count(vehicleID, masterPropertyID)
        }
    }, [vehicleID, masterPropertyID]);

    useEffect(() => {
        if (mainIncidentID) {
            setMainIncidentID(mainIncidentID); dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, mainIncidentID))
        }
    }, [mainIncidentID])

    // const get_property_Data = (PropertyID) => {
    //     const val = { 'PropertyID': 0, 'MasterPropertyID': masterPropertyID, 'IsMaster': true }
    //     const val1 = { 'PropertyID': PropertyID, 'MasterPropertyID': 0, 'IsMaster': false }
    //     fetchPostData('VehicleRecovered/GetData_VehicleRecovered', MstVehicle === "MST-Vehicle-Dash" ? val : val1).then((res) => {
    //         if (res) {
    //             setVehicleData(res); setLoder(true)
    //         } else {
    //             setVehicleData(); setLoder(true)
    //         }
    //     })
    // }
    console.log(vehicleID)
    const reset = () => {
        setValue(pre => {
            return {
                ...pre, 'RecoveredIDNumber': '', 'RecoveredDateTime': '', 'OfficerPFID': '', 'RecoveryTypeID': '', 'RecoveredValue': '', 'Comments': '', 'DispositionID': '', 'UCRRecoveredID': '',
            }
        });
        setErrors({
            ...errors,
            'DispositionIDError': '', 'OfficerPFIDError': '', 'RecoveredDateTimeError': '', 'RecoveryTypeIDError': '', 'Comments': '', 'ContactError': '',
        });
        setRecoverDate(""); setVehRecDelID(''); setRecoverTypeCode('')
    }

    useEffect(() => {
        if (sessionStorage.getItem('vehicleStolenValue')) {
            if (vehicleData?.length > 0) {
                let remainBal = Decrypt_Id_Name(sessionStorage.getItem('vehicleStolenValue'), 'VForVehicleStolenValue');
                const newArr = vehicleData.map((val) => { return val.RecoveredValue });
                for (let i in newArr) {
                    remainBal = parseFloat(remainBal) - parseFloat(newArr[i]);
                }
                if (remainBal < 0) { remainBal = 0; }
                remainBal = parseFloat(remainBal)?.toFixed(2)
                setRemainBalance(remainBal); setValue({ ...value, ['Balance']: remainBal })
            } else {
                setValue({ ...value, ['Balance']: parseFloat(Decrypt_Id_Name(sessionStorage.getItem('vehicleStolenValue'), 'VForVehicleStolenValue')) });
                setRemainBalance(parseFloat(Decrypt_Id_Name(sessionStorage.getItem('vehicleStolenValue'), 'VForVehicleStolenValue')));
            }
        } else {
            setRemainBalance(0);
        }
    }, [updateStatus, vehicleData, recoverTypeCode])

    useEffect(() => {
        if (VehicleRecoveredID) {
            GetSingleData(VehicleRecoveredID)
        } else {
            reset()
        }
    }, [VehicleRecoveredID, updateStatus])

    const GetSingleData = (VehicleRecoveredID) => {
        const val = { 'VehicleRecoveredID': VehicleRecoveredID, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false, }
        fetchPostData('/VehicleRecovered/GetSingleData_VehicleRecovered', val)
            .then((res) => {
                if (res) { setEditval(res) }
                else { setEditval() }
            })
    }

    useEffect(() => {
        if (VehicleRecoveredID) {
            setValue({
                ...value,
                'DispositionID': editval[0]?.DispositionID, 'UCRRecoveredID': editval[0]?.UCRRecoveredID, 'VehicleRecoveredID': editval[0]?.VehicleRecoveredID, 'RecoveredIDNumber': editval[0]?.RecoveredIDNumber, 'RecoveredDateTime': editval[0]?.RecoveredDateTime,
                'OfficerPFID': editval[0]?.OfficerPFID, 'RecoveredValue': editval[0]?.RecoveredValue, 'RecoveryTypeID': editval[0]?.RecoveryTypeID, 'Comments': editval[0]?.Comments, 'Balance': editval[0]?.Balance, 'ModifiedByUserFK': loginPinID,
            })
            setRecoverDate(editval[0]?.RecoveredDateTime ? new Date(editval[0]?.RecoveredDateTime) : ''); setRecoverTypeCode(Get_Property_Code(editval, recoveryTypeDrpData));
        }
    }, [editval])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.DispositionID)) {
            setErrors(prevValues => { return { ...prevValues, ['DispositionIDError']: RequiredFieldIncident(value.DispositionID) } })
        }
        if (RequiredFieldIncident(value.OfficerPFID)) {
            setErrors(prevValues => { return { ...prevValues, ['OfficerPFIDError']: RequiredFieldIncident(value.OfficerPFID) } })
        }
        if (RequiredFieldIncident(value.RecoveredDateTime)) {
            setErrors(prevValues => { return { ...prevValues, ['RecoveredDateTimeError']: RequiredFieldIncident(value.RecoveredDateTime) } })
        }
        if (RequiredFieldIncident(value.RecoveryTypeID)) {
            setErrors(prevValues => { return { ...prevValues, ['RecoveryTypeIDError']: RequiredFieldIncident(value.RecoveryTypeID) } })
        }
        if (RequiredFieldIncident(value.Comments)) {
            setErrors(prevValues => { return { ...prevValues, ['Comments']: RequiredFieldIncident(value.Comments) } })
        }
        if (recoverTypeCode === 'P') {
            if (RequiredFieldOnConditon(value.RecoveredValue)) {
                setErrors(prevValues => ({ ...prevValues, ['ContactError']: RequiredFieldOnConditon(value.RecoveredValue) }));
            }
        }
        else {
            setErrors(prevValues => ({ ...prevValues, ['ContactError']: RequiredFieldOnConditon(null) }));
        }
    }

    const { DispositionIDError, OfficerPFIDError, RecoveredDateTimeError, RecoveryTypeIDError, Comments, ContactError } = errors

    useEffect(() => {
        if (DispositionIDError === 'true' && OfficerPFIDError === 'true' && RecoveredDateTimeError === 'true' && RecoveryTypeIDError === 'true' && Comments === 'true' && ContactError === 'true') {
            if (VehicleRecoveredID) { Update_RecoveredProperty() }
            else { Add_RecoveredProperty() }
        }
    }, [DispositionIDError, OfficerPFIDError, RecoveredDateTimeError, RecoveryTypeIDError, Comments, ContactError])

    useEffect(() => {
        if (loginAgencyID) {
            get_Head_Of_Agency(loginAgencyID); get_RecoveryType(loginAgencyID); get_Dispositions(loginAgencyID);
        }
    }, [loginAgencyID])

    const get_Head_Of_Agency = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            } else {
                setHeadOfAgency([])
            }
        })
    };

    const get_RecoveryType = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('RecoveryType/GetDataDropDown_RecoveryType', val).then((data) => {
            if (data) {
                setRecoveryTypeDrpData(threeColArray(data, 'RecoveryTypeID', 'Description', 'RecoveryTypeCode'));
            }
            else {
                setRecoveryTypeDrpData([])
            }
        })
    };

    const get_Dispositions = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('PropertyDispositions/GetDataDropDown_PropertyDispositions', val).then((data) => {
            if (data) {
                setDispositionsDrpData(Comman_changeArrayFormat(data, 'PropertyDispositionsID', 'Description'));
            }
            else {
                setDispositionsDrpData([])
            }
        })
    };

    const HandleChanges = (e) => {
        !addUpdatePermission && setChangesStatus(true)
        if (e.target.name === 'RecoveredValue') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.charAt(0) === '.') {
                ele = '';
            }
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
                            return {
                                ...pre, ['Balance']: total, [e.target.name]: ele
                            }
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
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    }
    console.log(incidentReportedDate)
    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setChangesStatus(true)
        if (e) {
            if (name === 'RecoveryTypeID') {
                setValue({ ...value, ['RecoveryTypeID']: e.value })
                setRecoverTypeCode(e.id)
                if (e.id === 'FU' || e.id === 'F') {
                    if (vehicleData) {
                        setValue(pre => { return { ...pre, ['RecoveredValue']: remainBalance } });
                    } else {
                        setValue(pre => { return { ...pre, ['RecoveredValue']: sessionStorage.getItem('vehicleStolenValue') ? Decrypt_Id_Name(sessionStorage.getItem('vehicleStolenValue'), 'VForVehicleStolenValue') : '', } })
                    }
                } else if (e.id === 'P' || e.id !== 'FU' || e.id !== 'F') {
                    setValue(pre => { return { ...pre, ['RecoveredValue']: '' } })
                }
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === 'RecoveryTypeID') {
                setValue({ ...value, [name]: null, ['RecoveredValue']: '' });
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }

    const Add_RecoveredProperty = (e) => {
        if (value.RecoveredValue != 0) {
            if (parseFloat(value.RecoveredValue) <= parseFloat(remainBalance)) {
                if (remainBalance !== 0) {
                    const {
                        PropertyID, AgencyID, CreatedByUserFK, MasterPropertyID, VehicleRecoveredID, RecoveredIDNumber, RecoveredDateTime,
                        OfficerPFID, RecoveryTypeID, RecoveredValue, Comments, Balance, DispositionID, UCRRecoveredID, ModifiedByUserFK, IsMaster,
                    } = value
                    const val = {
                        'PropertyID': vehicleID, 'AgencyID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'MasterPropertyID': masterPropertyID,
                        'VehicleRecoveredID': VehicleRecoveredID, 'RecoveredIDNumber': RecoveredIDNumber, 'RecoveredDateTime': RecoveredDateTime,
                        'OfficerPFID': OfficerPFID, 'RecoveryTypeID': RecoveryTypeID, 'RecoveredValue': RecoveredValue, 'Comments': Comments,
                        'Balance': Balance, 'DispositionID': DispositionID, 'UCRRecoveredID': UCRRecoveredID, 'ModifiedByUserFK': '', 'IsMaster': IsMaster
                    }
                    AddDeleteUpadate('VehicleRecovered/Insert_VehicleRecovered', val)
                        .then((res) => {
                            const parsedData = JSON.parse(res.data);
                            const message = parsedData.Table[0].Message;
                            toastifySuccess(message); get_property_Data(vehicleID);
                            setModal(false); get_vehicle_Count(vehicleID, masterPropertyID)
                            reset(); setChangesStatus(false); setErrors({ ...errors, 'DispositionIDError': '', });
                            setRecoverTypeCode('');
                        });
                } else {
                    toastifyError("Remaining Balance is Zero"); setErrors({ ...errors, 'DispositionIDError': '', });
                }
            } else {
                toastifyError("Recovered value should not be greater than Remaining Value"); setErrors({ ...errors, 'DispositionIDError': '', });
            }
        } else {
            toastifyError("The recovered value must be greater than zero"); setErrors({ ...errors, 'DispositionIDError': '', });
        }
    }

    const Update_RecoveredProperty = () => {
        AddDeleteUpadate('VehicleRecovered/Update_VehicleRecovered', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message);
            setModal(false); reset(); get_property_Data(vehicleID);
        })
    }

    const OnClose = () => {
        setModal(false); reset(); setVehicleRecoveredID(); setRecoverTypeCode(); setVehRecDelID(''); setChangesStatus(false)
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

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const columns = [
        {
            name: 'Recovered ID', selector: (row) => row.RecoveredIDNumber, sortable: true
        },
        {
            name: 'Comments', selector: (row) => row.Comments,
            format: (row) => (<>{row?.Comments ? row?.Comments.substring(0, 70) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
        {
            name: 'Recovered Value', selector: (row) => row.RecoveredValue?.replace(/^0+/, ''), sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 60 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 65 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", vehicleData, isLocked, true) ?
                                <span onClick={() => { setVehRecDelID(row.VehicleRecoveredID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            !isLockOrRestrictModule("Lock", vehicleData, isLocked, true) &&
                            <span onClick={() => { setVehRecDelID(row.VehicleRecoveredID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>

        }
    ]

    const Delete_RecoveredProperty = () => {
        const val = {
            'VehicleRecoveredID': VehRecDeldID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false,
        }
        AddDeleteUpadate('VehicleRecovered/Delete_VehicleRecovered', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_property_Data(vehicleID); get_vehicle_Count(vehicleID, masterPropertyID); setVehicleRecoveredID('');
                setVehRecDelID(''); setErrors(''); reset('');
            } else { console.log("Somthing Wrong"); }
        })
    }

    const editComments = (val) => {
        GetSingleData(VehicleRecoveredID); setVehicleRecoveredID(val.VehicleRecoveredID);
        setUpDateCount(upDateCount + 1); setStatus(true); setErrors(''); setModal(true);
    }

    const setStatusFalse = (e) => {
        setClickedRow(null); setStatus(false); setModal(true); reset();
    }

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
            {/* <VehicleListing {...{ ListData }} /> */}

            {
                openVehicleRecoveredTab &&
                <>
                    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="VehicleRecovred" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                        <div class="modal-dialog  modal-dialog-centered  modal-xl" style={{ minHeight: "500px" }}>
                            <div class="modal-content">
                                <button type="button" className="border-0" aria-label="Close"
                                    onClick={(e) => { setStatusFalse(); }}
                                    data-dismiss="modal" style={{ alignSelf: "end" }} ref={crossButtonRef}><b>X</b>
                                </button>
                                <div class="modal-body name-body-model">


                                    <div className="col-12 col-md-12 pt-1 p-0" >
                                        <div className="row">
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Officer{errors.OfficerPFIDError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerPFIDError}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2  mt-2" >
                                                <Select
                                                    name='OfficerPFID'
                                                    id='OfficerPFID'
                                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerPFID)}
                                                    options={agencyOfficerDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'OfficerPFID')}
                                                    styles={Requiredcolour}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Recovered Date/Time  {errors.RecoveredDateTimeError !== 'true' ? (
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
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <Link to={'/ListManagement?page=Recovery%20Type&call=/Prop-Home'} className='new-link'>
                                                    Recovery Type{errors.RecoveryTypeIDError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RecoveryTypeIDError}</p>
                                                    ) : null}
                                                </Link>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 mt-2" >
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
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Recovered Value {errors.ContactError !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 text-field mt-2" >
                                                <input type="text" name="RecoveredValue" value={value?.RecoveredValue}
                                                    onChange={HandleChanges}
                                                    className={`${recoverTypeCode === 'P' ? " " : "readonlyColor"} requiredColor`}
                                                    required readOnly={recoverTypeCode === 'P' ? false : true}
                                                />

                                            </div>

                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Balance</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-2 text-field mt-2" >
                                                <input type="text" name="Balance" value={value?.Balance < 0 ? 0 : value?.Balance} onChange={HandleChanges} className="readonlyColor" required readOnly />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <Link to={'/ListManagement?page=Property%20Dispositions&call=/Prop-Home'} className='new-link'>
                                                    Disposition{errors.DispositionIDError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DispositionIDError}</p>
                                                    ) : null}
                                                </Link>
                                            </div>
                                            <div className="col-10 col-md-10 col-lg-2 mt-2" >
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
                                            <div className="col-2 col-md-2 col-lg-2 mt-3">
                                                <label htmlFor="" className='label-name '>Comments{errors.Comments !== 'true' ? (
                                                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.Comments}</p>
                                                ) : null}</label>
                                            </div>
                                            <div className="col-10 col-md-10 col-lg-6 text-field mt-2" >
                                                <textarea name='Comments' value={value?.Comments} onChange={HandleChanges} id="Comments" cols="30" rows='4' className="form-control requiredColor" style={{ resize: 'none' }}></textarea>
                                            </div>
                                        </div>

                                        {!isViewEventDetails &&
                                            <div className="btn-box text-right  mr-1 mb-2">
                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { reset(); }} >New</button>
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
                                                data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? vehicleData : [] : vehicleData}
                                                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                dense
                                                columns={columns}
                                                selectableRowsHighlight
                                                highlightOnHover
                                                customStyles={tableCustomStyles}
                                                onRowClicked={(row) => {
                                                }}
                                                fixedHeader
                                                persistTableHead={true}
                                                fixedHeaderScrollHeight='170px'
                                                pagination
                                                paginationPerPage={'10'}
                                                paginationRowsPerPageOptions={[10, 15, 20, 50]}
                                                showPaginationBottom={10}
                                                conditionalRowStyles={conditionalRowStyles}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            <ChangesModal func={check_Validation_Error} setToReset={OnClose} />
            <DeletePopUpModal func={Delete_RecoveredProperty} />
        </>
    )
}

export default VehicleRecovred
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