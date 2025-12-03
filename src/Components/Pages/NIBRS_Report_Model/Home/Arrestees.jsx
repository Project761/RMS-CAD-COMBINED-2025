import React, { useEffect, useState, useContext } from 'react'
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { ErrorTooltip } from '../../Name/NameNibrsErrors';
import { PhoneField } from '../../Agency/AgencyValidation/validators';
import { get_AgencyOfficer_Data, get_ArrestJuvenileDis_DrpData, get_ArrestType_Drp, get_ArresteeName_Data, get_Masters_Name_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../redux/actions/Agency';
import { useDispatch, useSelector } from 'react-redux';
import MasterNameModel from '../../MasterNameModel/MasterNameModel';
import DataTable from 'react-data-table-component';
import ChangesModal from '../../../Common/ChangesModal';
import DeletePopUpModal from '../../../Common/DeleteModal';
import ConfirmModal from '../../Arrest/ConfirmModal';
import { RequiredFieldIncident } from '../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { AddDeleteUpadate, AddDelete_Img, fetchPostData, fetchPostDataNibrs } from '../../../hooks/Api';
import { Aes256Encrypt, Decrypt_Id_Name, LockFildscolour, Requiredcolour, base64ToString, customStylesWithOutColor, filterPassedTimeZone, filterPassedTimeZoneArrest, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, isLockOrRestrictModule, nibrscolourStyles, stringToBase64, tableCustomStyles } from '../../../Common/Utility';
import ListModal from '../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import { Comman_changeArrayFormat, threeColArrayWithCode } from '../../../Common/ChangeArrayFormat';

const Arrestees = ({ arrestClick, isNibrsSummited = false, isLocked, setIsLocked, getPermissionLevelByLock = () => { } }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const arrestTypeDrpData = useSelector((state) => state.DropDown.arrestTypeDrpData);
    const arrestJuvenileDisDrpData = useSelector((state) => state.DropDown.arrestJuvenileDisDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecEIncID = 0; let DecNameId = 0;

    const query = useQuery();
    var IncID = query?.get("IncId");
    var ArrestId = query?.get("ArrestId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ArrNo = query?.get("ArrNo");
    var Name = query?.get("Name");
    let MstPage = query?.get('page');
    let ChargeSta = query?.get('ChargeSta');
    var ArrestSta = query?.get('ArrestSta');
    var NameID = query?.get("NameID");

    var SideBarStatus = query?.get("SideBarStatus");

    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    if (!NameID) { DecNameId = 0; }
    else { DecNameId = parseInt(base64ToString(NameID)); }

    const { get_Arrest_Count, setArrestName, tabCount, arrestChargeData, updateCount, get_OffenseName_Data, setUpdateCount, incidentCount, setArrestChargeData, setIncidentNumber, get_Data_Arrest_Charge, get_ArrestCharge_Count, changesStatus, tabCountArrest, nibrsSubmittedStatus, setnibrsSubmittedStatus, nibrsSubmittedArrestee, setnibrsSubmittedArrestee, incidentNumber, ArresteName, arrestFilterData, get_Data_Arrest, policeForceDrpData, get_Police_Force, changesStatusCount, setChangesStatus, get_Incident_Count, setActiveArrest, datezone, GetDataTimeZone } = useContext(AgencyContext);

    const [status, setStatus] = useState();
    const [arrestDate, setArrestDate] = useState();
    const [rightGivenCode, setRightGivenCode] = useState('N');
    const [ArrestID, setArrestID] = useState('');
    const [Editval, setEditval] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [arresteeChange, setArresteeChange] = useState();
    const [clickedRow, setClickedRow] = useState(null);


    const [multiImage, setMultiImage] = useState([]);
    const [MainIncidentID, setMainIncidentID] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [JuvenileCleared, setIsJuvenileCleared] = useState();
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [possessionID, setPossessionID] = useState('');
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [mstNameID, setMstNameID] = useState(0);

    const [isDatePickerRequiredColor, setDatePickerRequiredColor] = useState(false);
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [incExceDate, setincExceDate] = useState();
    const [insertArrest, setInsertArrest] = useState([]);

    const [extractIncidentDate, setextractIncidentDate] = useState('');
    const [incidentReportedDate, setincidentReportedDate] = useState('');
    const [offenseNameID, setoffenseNameID] = useState();
    const [confirmInsertArrest, setConfirmInsertArrest] = useState(false);
    const [ChargeLocalArr, setChargeLocalArr] = useState(
        JSON.parse(sessionStorage.getItem('ChargeLocalData')) || []
    );


    const [AgencyCode, setAgencyCode] = useState('');
    const [Agencystatus, setAgencystatus] = useState('true');
    const [incidentDate, setincidentDate] = useState([]);
    //  NIBRS Error
    const [clickNibLoder, setclickNibLoder] = useState(false);

    const type = "ArrestMod"

    const [value, setValue] = useState({
        'ArrestID': '', 'AgencyID': '', 'ArrestNumber': '', 'IncidentID': '', 'CreatedByUserFK': '', 'IsJuvenileArrest': '', 'ArrestDtTm': '', 'ArrestingAgency': '', 'ArrestTypeID': '', 'SupervisorID': '', 'PoliceForceID': '', 'RightsGivenID': '', 'JuvenileDispositionID': '', 'PhoneNo': '', 'PrimaryOfficerID': '', 'GivenByID': '', 'ArresteeID': '', 'ArresteeLable': 0, 'ModifiedByUserFK': '', 'IsMultipleArrestees': '', 'ArrestingAgencyID': '',
    });

    const [errors, setErrors] = useState({
        'ArresteeIDError': '', 'ArrestDtTmError': '', 'JuvenileDispoError': '', 'ArrestTypeIDError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            get_Arrest_Count(ArrestID); get_Single_PersonnelList(localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID);
            setAgencyCode(localStoreData?.ORI); dispatch(get_ScreenPermissions_Data("A067", localStoreData?.AgencyID, localStoreData?.PINID));

            if (DecEIncID) {
                dispatch(get_ArresteeName_Data('', '', DecEIncID, true, ArrestID));
                GetEditData(DecEIncID);
            }

        }
    }, [localStoreData]);

    useEffect(() => {
        if (incidentDate?.length > 0) {
            setextractIncidentDate(incidentDate[0]?.NIBRSclearancedate ? new Date(incidentDate[0]?.NIBRSclearancedate) : null);
            setincidentReportedDate(incidentDate[0]?.ReportedDate ? new Date(incidentDate[0]?.ReportedDate) : null)
        }
    }, [incidentDate]);

    const GetEditData = (incidentID) => {
        const val = { IncidentID: incidentID };
        fetchPostData('Incident/GetSingleData_Incident', val).then((res) => {
            if (res?.length > 0) {
                setincidentDate(res);
            }
        });
    };

    useEffect(() => {
        if (DecEIncID) {
            setMainIncidentID(DecEIncID);
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(DecEIncID)) }
            dispatch(get_ArresteeName_Data('', '', DecEIncID, true, ArrestID));
        }
        if (MstPage === "MST-Arrest-Dash" && possessionID) {
            dispatch(get_Masters_Name_Drp_Data(possessionID, 0, 0));
        }
    }, [DecEIncID, nameModalStatus, possessionID]);

    const getIncidentData = async (incidentID) => {
        const val = { IncidentID: incidentID }
        await fetchPostData('Incident/GetSingleData_Incident', val).then((res) => {
            if (res?.length > 0) {
                setInsertArrest(res[0]?.RMSDispositionId === 15 && incidentCount[0]?.ArrestCount == 0);
                return res[0]?.RMSDispositionId === 15 && incidentCount[0]?.ArrestCount == 0;
            }
            else { setInsertArrest(false); return false; }
        })
    }

    useEffect(() => {
        if (possessionID) {
            checkSelectedName(parseInt(possessionID))
        }
    }, [possessionID, arresteeNameData]);

    useEffect(() => {
        if (DecNameId) {
            dispatch(get_Masters_Name_Drp_Data(DecNameId, 0, 0));
            checkSelectedName1(parseInt(DecNameId));
            setValue({ ...value, ['ArresteeID']: parseInt(DecNameId) })
        }
    }, [DecNameId, arresteeNameData]);

    const checkSelectedName1 = (ArresteeID) => {
        if (ArresteeID) {
            const keysToCheck = ['AgeFrom', 'Gendre_Description', 'LastName', 'Race_Description'];
            const nameStatus = MstPage === "MST-Arrest-Dash" ? mastersNameDrpData : arresteeNameData?.filter((val) => val?.NameID == ArresteeID);
            setArresteeChange(nameStatus[0]);
            const status = nameStatus[0]?.IsJuvenileArrest;
            const age = handleDOBChange(nameStatus[0]?.DateOfBirth);

            setArrestName(nameStatus[0]?.label)
            if (age === null) {
                setValue({ ...value, ['ArresteeID']: parseInt(DecNameId), })
            } else {
                setValue({ ...value, ['IsJuvenileArrest']: status, ['ArresteeID']: parseInt(DecNameId), })
            }
            return keysToCheck.every(key => nameStatus[0]?.hasOwnProperty(key) && nameStatus[0]?.[key]);
        } else {
            return true
        }
    }

    useEffect(() => {
        if (loginAgencyID) {
            setValue({ ...value, 'IncidentID': DecEIncID, 'ArrestID': ArrestID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID });
            get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
            if (arrestTypeDrpData?.length === 0) dispatch(get_ArrestType_Drp(loginAgencyID));
            if (arrestJuvenileDisDrpData?.length === 0) dispatch(get_ArrestJuvenileDis_DrpData(loginAgencyID));
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (ArrestID) {
            GetSingleData(ArrestID, DecEIncID);
            setArrestID(ArrestID); get_Arrest_Count(ArrestID);
        } else {
            setMultiImage(''); setStatus(false); setArrestID('');
            reset_Value()
        }
    }, [ArrestID, DecEIncID]);

    const GetSingleData = (ArrestID, MainIncidentID) => {
        const val = { 'ArrestID': ArrestID, 'PINID': '0', 'IncidentID': MainIncidentID }
        fetchPostData('Arrest/GetSingleData_Arrest', val).then((res) => {
            if (res.length > 0) {


                if (res[0]?.NIBRSClearanceID) { setincExceDate(new Date(res[0]?.NIBRSclearancedate)); }
                setStatus(true);
                setEditval(res);
            } else {
                setEditval([]); setincExceDate('');
            }
        })
    }

    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])

    const get_Single_PersonnelList = (loginPinID) => {
        fetchPostData('Personnel/GetData_UpdatePersonnel', { PINID: loginPinID })
            .then((res) => {
                if (res) {
                    setIsJuvenileCleared(res[0]?.IsJuvenileCleared);
                } else {

                }
            })
    }

    const check_Validation_Error = (e) => {

        const arresteeStatus = possessionID ? checkSelectedName(value?.ArresteeID) : checkSelectedName1(value?.ArresteeID)
        if (JuvenileCleared === false && value.IsJuvenileArrest) {
            toastifyError('You are not authorized to create a juvenile arrest.')
            return;
        }
        if (arresteeStatus) {
            const ArresteeIDErr = RequiredFieldIncident(value.ArresteeID);
            const ArrestDtTmErr = RequiredFieldIncident(value.ArrestDtTm);
            const CellPhoneErr = value.PhoneNo ? PhoneField(value.PhoneNo) : 'true'
            const JuvenileDispoErr = value?.IsJuvenileArrest === true || value?.IsJuvenileArrest === 'true' ? RequiredFieldIncident(value?.JuvenileDispositionID) : 'true'
            const ArrestTypeIDErr = RequiredFieldIncident(value.ArrestTypeID);
            setErrors(pre => {
                return {
                    ...pre,
                    ['ArresteeIDError']: ArresteeIDErr || pre['ArresteeIDError'],
                    ['ArrestDtTmError']: ArrestDtTmErr || pre['ArrestDtTmError'],
                    ['CellPhoneError']: CellPhoneErr || pre['CellPhoneError'],
                    ['JuvenileDispoError']: JuvenileDispoErr || pre['JuvenileDispoError'],
                    ['ArrestTypeIDError']: ArrestTypeIDErr || pre['ArrestTypeIDError'],
                }
            });
        } else {
            setShowModal(true);
            setErrors(pre => { return { ...pre, ['ArresteeIDError']: '' } })
        }
    }

    const { ArrestDtTmError, ArresteeIDError, CellPhoneError, JuvenileDispoError, ArrestTypeIDError } = errors

    useEffect(() => {

        if (ArrestDtTmError === 'true' && ArresteeIDError === 'true' && CellPhoneError === 'true' && JuvenileDispoError === 'true' && ArrestTypeIDError === 'true') {
            if (MstPage === "MST-Arrest-Dash") {
                if (ArrestID && (ArrestSta === true || ArrestSta === 'true')) { update_Arrest(); }
                else { insert_Arrest_Data(); }
            } else {
                if (ArrestID && (ArrestSta === true || ArrestSta === 'true')) { update_Arrest(); }
                else { insert_Arrest_Data(); }
            }
        }
    }, [ArrestDtTmError, ArresteeIDError, CellPhoneError, JuvenileDispoError, ArrestTypeIDError])

    useEffect(() => {
        if (Editval?.length > 0) {
            dispatch(get_ArresteeName_Data('', '', DecEIncID, true, ArrestID));
            setValue({
                ...value,
                'ArrestID': Editval[0]?.ArrestID, 'ArrestNumber': Editval[0]?.ArrestNumber, 'IsJuvenileArrest': Editval[0]?.IsJuvenileArrest,
                'ArrestDtTm': Editval[0]?.ArrestDtTm ? getShowingDateText(Editval[0]?.ArrestDtTm) : "", 'IsMultipleArrestees': Editval[0]?.IsMultipleArrestees,
                'ArrestingAgencyID': Editval[0]?.ArrestingAgencyID,
                'ArrestingAgency': Editval[0]?.ArrestingAgency ? Editval[0]?.ArrestingAgency : '',
                'PhoneNo': Editval[0]?.PhoneNo ? Editval[0]?.PhoneNo : '',
                'ArrestTypeID': Editval[0]?.ArrestTypeID, 'SupervisorID': Editval[0]?.SupervisorID, 'PoliceForceID': Editval[0]?.PoliceForceID ? Editval[0]?.PoliceForceID : '',
                'ArresteeID': Editval[0]?.ArresteeID, 'RightsGivenID': Editval[0]?.RightsGivenID, 'JuvenileDispositionID': Editval[0]?.JuvenileDispositionID,
                'GivenByID': Editval[0]?.GivenByID, 'PrimaryOfficerID': Editval[0]?.PrimaryOfficerID, 'ModifiedByUserFK': loginPinID,
            });
            setnibrsSubmittedArrestee(Editval[0]?.IsNIBRSSummited);
            setPossessionID(Editval[0]?.ArresteeID);
            setArrestName(Editval[0]?.Arrestee_Name ? Editval[0]?.Arrestee_Name : '');
            setIncidentNumber(Editval[0]?.IncidentNumber ? Editval[0]?.IncidentNumber : '')
            setArrestDate(Editval[0]?.ArrestDtTm ? new Date(Editval[0]?.ArrestDtTm) : ''); setRightGivenCode(Get_Given_Code(Editval, policeForceDrpData))

        } else {
            setValue({
                ...value,
                'ArrestNumber': '', 'IsJuvenileArrest': '', 'ArrestDtTm': '', 'ArrestTypeID': '', 'SupervisorID': '', 'PoliceForceID': '', 'RightsGivenID': '', 'JuvenileDispositionID': '', 'PhoneNo': '', 'GivenByID': '', 'PrimaryOfficerID': '', 'ModifiedByUserFK': '', 'IsMultipleArrestees': '',
            });
            setArrestDate();
        }
    }, [Editval, changesStatusCount])

    const reset_Value = () => {
        setAgencystatus(true);
        Reset()
        setValue(prevValue => ({
            ...prevValue, ArrestNumber: '', IsJuvenileArrest: '', ArrestDtTm: '', ArrestingAgency: '', ArrestTypeID: '', SupervisorID: '', PoliceForceID: '', ArresteeID: '', RightsGivenID: '', JuvenileDispositionID: '', PhoneNo: '', GivenByID: '', PrimaryOfficerID: '', ModifiedByUserFK: '', IsMultipleArrestees: '',
            ArrestingAgencyID: ''
        }));
        setErrors(prevErrors => ({
            ...prevErrors, ArresteeIDError: '', PrimaryOfficerIDError: '', ArrestDtTmError: '', JuvenileDispoError: '', ArrestTypeIDError: ''
        }));

        sessionStorage.removeItem('ChargeLocalData');
        setArrestDate(); setStatesChangeStatus(false); setStatus(false); setArrestID(''); setChangesStatus(false);
    };

    const HandleChange = (e) => {
        if (e.target.name === "IsJuvenileArrest") {
            setChangesStatus(true); setStatesChangeStatus(true)
            setValue({ ...value, [e.target.name]: e.target.checked });
        } else if (e.target.name === 'PhoneNo') {
            var ele = e.target.value.replace(/[^0-9\s]/g, "")
            if (ele.length === 10) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setChangesStatus(true)
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] });
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/[^0-9\s]/g, "");
                setChangesStatus(true); setValue({ ...value, [e.target.name]: ele });
            }
        } else {
            setChangesStatus(true); setValue({ ...value, [e.target.name]: e.target.value });
        }
    };

    const handleChange = (event) => {
        setChangesStatus(true)
        const { name, value } = event.target;
        let ele = value.replace(/\D/g, '');
        setStatesChangeStatus(true)
        if (ele.length === 10) {
            const cleaned = ele.replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                setValue((prevState) => ({ ...prevState, [name]: match[1] + '-' + match[2] + '-' + match[3], }));
            }
        } else {
            ele = value.split('-').join('').replace(/\D/g, '');
            setValue((prevState) => ({ ...prevState, [name]: ele, }));
        }
    };

    useEffect(() => {
        if (rightGivenCode !== "Y") {
            setValue({ ...value, ['GivenByID']: '' })
        }
    }, [rightGivenCode])

    const insert_Arrest_Data = async () => {
        if (ChargeLocalArr?.length === 0 && tabCountArrest?.ChargeCount === 0 && arrestChargeData.length === 0) {
            toastifyError('Please add at least one charge')
            setErrors({
                ...errors,
                'ArrestNumberError': '', 'IsJuvenileArrestError': '', 'ArrestDtTmError': '', 'ArrestTypeIDError': '', 'SupervisorIDError': '', 'PoliceForceIDError': '', 'RightsGivenIDError': '', 'JuvenileDispositionIDError': '', 'PhoneNoError': '', 'PrimaryOfficerIDError': '', 'GivenByIDError': '', 'ArresteeIDError': '', 'ArresteeLableError': '', 'ModifiedByUserFKError': '', 'IsMultipleArresteesError': '', 'ArrestingAgencyIDError': '',
            })
        }
        else {
            const { ArrestID, AgencyID, ArrestNumber, IncidentID, CreatedByUserFK, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, ArresteeLable, ModifiedByUserFK, IsMultipleArrestees, ArrestingAgencyID, } = value;
            const val = {
                'ArrestID': ArrestID, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'CreatedByUserFK': loginPinID, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': '', 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
            }
            AddDeleteUpadate('Arrest/Insert_Arrest', val).then(async (res) => {
                if (res.success) {
                    const newArrestID = res.ArrestID;
                    await SyncLocalChargesToServer(newArrestID, DecEIncID, loginPinID, loginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge
                    );
                    if (MstPage === "MST-Arrest-Dash") {
                        navigate(`/nibrs-Home?page=MST-Arrest-Dash&ArrNo=${res?.ArrestNumber}&IncNo=${incidentNumber}&Name=${ArresteName}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrestSta=${true}&ChargeSta=${true}`);
                    } else {
                        navigate(`/nibrs-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(res?.ArrestID)}&ArrNo=${res?.ArrestNumber}&Name=${ArresteName}&ArrestSta=${true}&ChargeSta=${false}`)
                    }
                    reset_Value();
                    toastifySuccess(res.Message); get_Arrest_Count(ArrestID); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                    GetSingleData(res?.ArrestID, DecEIncID);
                    setArrestID(res.ArrestID); setStatus(false); setChangesStatus(false); setStatesChangeStatus(false)

                    setErrors({ ...errors, ['ArresteeIDError']: '' }); get_Incident_Count(DecEIncID);

                }
            });


        }
    }

    const update_Arrest = () => {
        const { ArrestID, AgencyID, ArrestNumber, IncidentID, CreatedByUserFK, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, ArresteeLable, ModifiedByUserFK, IsMultipleArrestees, ArrestingAgencyID, } = value;
        const val = {
            'ArrestID': ArrestID, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': loginPinID, 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
        }
        if (ChargeLocalArr?.length === 0 && tabCountArrest?.ChargeCount === 0 && arrestChargeData.length === 0) {
            toastifyError('Please add at least one charge')
            setErrors({
                ...errors,
                'ArrestNumberError': '', 'IsJuvenileArrestError': '', 'ArrestDtTmError': '', 'ArrestTypeIDError': '', 'SupervisorIDError': '', 'PoliceForceIDError': '', 'RightsGivenIDError': '', 'JuvenileDispositionIDError': '', 'PhoneNoError': '', 'PrimaryOfficerIDError': '', 'GivenByIDError': '', 'ArresteeIDError': '', 'ArresteeLableError': '', 'ModifiedByUserFKError': '', 'IsMultipleArresteesError': '', 'ArrestingAgencyIDError': '',
            })
        }
        else {
            if (insertArrest) {
                setConfirmInsertArrest(true);
                setErrors({
                    ...errors,
                    'ArrestNumberError': '', 'IsJuvenileArrestError': '', 'ArrestDtTmError': '', 'ArrestTypeIDError': '', 'SupervisorIDError': '', 'PoliceForceIDError': '', 'RightsGivenIDError': '', 'JuvenileDispositionIDError': '', 'PhoneNoError': '', 'PrimaryOfficerIDError': '', 'GivenByIDError': '', 'ArresteeIDError': '', 'ArresteeLableError': '', 'ModifiedByUserFKError': '', 'IsMultipleArresteesError': '', 'ArrestingAgencyIDError': '',
                })
            } else {

                const { ArrestID, AgencyID, ArrestNumber, IncidentID, CreatedByUserFK, IsJuvenileArrest, ArrestDtTm, ArrestingAgency, ArrestTypeID, SupervisorID, PoliceForceID, RightsGivenID, JuvenileDispositionID, PhoneNo, PrimaryOfficerID, GivenByID, ArresteeID, ArresteeLable, ModifiedByUserFK, IsMultipleArrestees, ArrestingAgencyID, } = value;
                const val = {
                    'ArrestID': ArrestID, 'AgencyID': loginAgencyID, 'IncidentID': DecEIncID, 'ArrestNumber': ArrestNumber, 'IsJuvenileArrest': IsJuvenileArrest, 'ArrestDtTm': ArrestDtTm, 'ArrestingAgency': ArrestingAgency, 'ArrestTypeID': ArrestTypeID, 'SupervisorID': SupervisorID, 'PoliceForceID': PoliceForceID, 'RightsGivenID': RightsGivenID, 'JuvenileDispositionID': JuvenileDispositionID, 'PhoneNo': PhoneNo, 'PrimaryOfficerID': PrimaryOfficerID, 'GivenByID': GivenByID, 'ArresteeID': ArresteeID, 'ArresteeLable': 0, 'ModifiedByUserFK': loginPinID, 'IsMultipleArrestees': IsMultipleArrestees, 'ArrestingAgencyID': ArrestingAgencyID,
                }
                AddDeleteUpadate('Arrest/Update_Arrest', val).then((res) => {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); setChangesStatus(false); setStatesChangeStatus(false); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                    setErrors({ ...errors, ['ArresteeIDError']: '' }); GetSingleData(ArrestID, DecEIncID); get_Arrest_Count(ArrestID);

                    if (DecEIncID) {

                    }
                })

            }
        }



    }

    const DeleteArrest = () => {
        const val = { 'ArrestID': ArrestID, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('Arrest/Delete_Arrest', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data_Arrest(MainIncidentID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                get_Incident_Count(DecEIncID); get_Arrest_Count(ArrestID); reset_Value();
                sessionStorage.removeItem('ChargeLocalData');
                navigate(`/nibrs-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`)
            } else console.log("Somthing Wrong");
        })
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
        }
    };

    const columns = [
        {
            name: 'Arrest Number', selector: (row) => row.ArrestNumber, sortable: true
        },
        {
            name: 'Arrestee Name', selector: (row) => row.Arrestee_Name, sortable: true
        },
        {
            name: 'Arrest Type', selector: (row) => row.ArrestType, sortable: true
        },
        {
            name: 'Arresting Agency', selector: (row) => row.Agency_Name, sortable: true
        },
        {
            name: 'Charges(Count)',
            selector: (row) => {
                if (row.ChargeCount === 0 || row.ChargeCount === '0') {
                    return <span style={{ color: 'red', fontWeight: 'bold' }}>{row.ChargeCount}</span>;
                }
                return row.ChargeCount;
            },
            sortable: true
        },
        // {
        //     name: 'Juvenile Flag', selector: (row) => row.IsJuvenileArrest, sortable: true
        // },
        {
            name: 'Juvenile Flag',
            selector: row => (
                <input type="checkbox" checked={row.IsJuvenileArrest === true} disabled />
            ),
            sortable: true
        },

        {
            name: 'Use of Force Flag', selector: (row) => row.PoliceForce_Description, sortable: true
        },
        {
            width: '200px', name: 'Supervisor Name',
            selector: (row) => <>{row?.Supervisor_Name ? row?.Supervisor_Name.substring(0, 60) : ''}{row?.Supervisor_Name?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },
        // {
        //     name: 'Police Force Description', selector: (row) => row.PoliceForce_Description, sortable: true
        // },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", arrestFilterData, isLocked, true) ?
                            <span onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">                                    <i className="fa fa-trash"></i>
                            </span>
                            :
                            <></>
                            :
                            !isLockOrRestrictModule("Lock", arrestFilterData, isLocked, true) &&
                            <span onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">                                    <i className="fa fa-trash"></i>
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const set_Edit_Value = (row) => {
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
            modal.show();
        } else {
            if (row?.ArrestID) {
                // get Inc-Lock Status
                getPermissionLevelByLock(DecEIncID, loginPinID);
                Reset();
                navigate(`/nibrs-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${row?.ArrestNumber}&Name=${row?.Arrestee_Name}&ArrestSta=${true}&ChargeSta=${false}&SideBarStatus=${!SideBarStatus}&ArrestStatus=${false} `)
                setArrestID(row?.ArrestID); setActiveArrest(row?.ArrestID); setErrors(''); setStatesChangeStatus(true); setChangesStatus(false); setStatus(true);
                GetSingleData(row?.ArrestID, DecEIncID); get_Data_Arrest_Charge(row?.ArrestID); Reset()
            }
        }
    }

    const Reset = () => {
        setEditvalCharge([]);
        setValueCharge({ ...valueCharge, 'CreatedByUserFK': '', 'ChargeCodeID': '', 'NIBRSID': '', 'WarrantID': '', 'LawTitleId': '', });
        setStatesChangeStatus(false); setChangesStatus(false); setErrorsCharge({}); setDelChargeID(''); setDecChargeId(''); setChargeID('')
        // lawTitle
        setoffenseNameID();
        LawTitleIdDrpDwnVal(loginAgencyID, null);
        // nibrs code
        get_NIBRS_Drp_Data(loginAgencyID, null);
        // charge code
        get_ChargeCode_Drp_Data(loginAgencyID, null, null);
    }

    const conditionalRowStyles = [
        {
            when: row => row.ArrestID === ArrestID,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    //--------------------possession---------------------------------//
    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) { setPossenSinglData(res); }
            else { setPossenSinglData([]); }
        })
    }

    const handleDOBChange = (date, e) => {
        if (date) {
            setValue(pre => ({ ...pre, ['AgeFrom']: '', ['AgeTo']: '' }));
            const res = getShowingWithOutTime(date).split("/");
            let age = calculateAge(`${res[0]} ${res[1]} ${res[2]}`);
            return age;
        }
    };

    function calculateAge(birthday) {
        const today = new Date();
        const date = new Date(birthday);
        const diffInMs = today.getTime() - date.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const years = Math.floor(diffInDays / 365);
        let Days = "";
        Days += diffInDays % 7;
        const newday = Days.split('.')
        return `${years}`;
    };

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true)
        let newValue = { ...value };
        if (e) {

            newValue[name] = e.value;
            if (name === 'RightsGivenID') {
                setRightGivenCode(e.id);
            } else if (name === 'ArresteeID') {
                if (get_OffenseName_Data) {
                    get_OffenseName_Data(e?.value);
                }
                setPossessionID(e.value);
                newValue['JuvenileDispositionID'] = null;
                newValue['PhoneNo'] = '';
                const age = handleDOBChange(e.DateOfBirth);
                if (e.DateOfBirth) {

                    if (age === null || age === undefined) {
                        newValue['IsJuvenileArrest'] = '';
                    } else {
                        newValue['IsJuvenileArrest'] = age < 18 ? true : '';
                    }
                    setArresteeChange(e); setPossessionID(e.value);
                } else


                    if (!e.Gendre_Description || !e.Race_Description || !e.AgeFrom || !e.LastName) {

                        setShowModal(true); setArresteeChange(e); setPossessionID(e.value);
                    }
            }
            setChangesStatus(true);
            setValue(newValue);
        } else {
            newValue['JuvenileDispositionID'] = null;
            newValue['PhoneNo'] = '';
            if (name === 'RightsGivenID') {
                setRightGivenCode('N');
            } else if (name === 'ArresteeID') {
                newValue['IsJuvenileArrest'] = '';
                setPossessionID(''); setPossenSinglData([]); setArresteeChange('');
            }
            newValue[name] = null;
            setChangesStatus(true);
            setValue(newValue);
        }
    };

    const checkSelectedName = (ArresteeID) => {
        if (ArresteeID) {
            const keysToCheck = ['AgeFrom', 'Gendre_Description', 'LastName', 'Race_Description'];
            const nameStatus = MstPage === "MST-Arrest-Dash" ? mastersNameDrpData : arresteeNameData?.filter((val) => val?.NameID == ArresteeID);
            setArresteeChange(nameStatus[0]);
            const age = handleDOBChange(nameStatus[0]?.DateOfBirth);


            const status = nameStatus[0]?.IsJuvenile;

            setArrestName(nameStatus[0]?.label)

            if (age === null) {
                setValue({ ...value, ['ArresteeID']: parseInt(possessionID), })
            } else {
                setValue({ ...value, ['IsJuvenileArrest']: status, ['ArresteeID']: parseInt(possessionID), })
            }
            return keysToCheck.every(key => nameStatus[0]?.hasOwnProperty(key) && nameStatus[0]?.[key]);
        } else {
            return true
        }
    }

    //------------newChange----------------
    const clearID = () => {
        if (Editval?.length > 0) {
            setArrestID(ArrestID)
        } else {
            setArrestID(null)
        }
    }

    const checkArrestDate = (arrestDate, incExDate) => {
        const arrDate = new Date(arrestDate);
        const incDate = new Date(incExDate);

        if (arrDate < incDate) {
            return arrDate < incDate
        } else {
            return false
        }
    }

    const setStatusFalse = () => {
        if (MstPage === "MST-Arrest-Dash") {
            navigate(`/nibrs-Home?page=MST-Arrest-Dash&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`);
            setClickedRow(null); reset_Value(); setErrors(''); setPossessionID(''); setPossenSinglData([]); setArrestID('');
            setnibrsSubmittedArrestee(0);
        } else {
            navigate(`/nibrs-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}`)

            setClickedRow(null); setErrors(''); setPossessionID(''); setPossenSinglData([]);
            setActiveArrest(false); setRightGivenCode(false); setArrestID(''); reset_Value();
            setnibrsSubmittedArrestee(0);
        }
    }

    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    //----------------------------//----------------------------------Charge-------------------------------------------

    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [EditvalCharge, setEditvalCharge] = useState([]);
    const [ChargeID, setChargeID] = useState();
    const [DecChargeId, setDecChargeId] = useState();
    const [delChargeID, setDelChargeID] = useState();
    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    const [NIBRSDrpData, setNIBRSDrpData] = useState([]);
    const [isChargeDel, setIsChargeDel] = useState(false);
    const [narrativeApprovedStatus, setNarrativeApprovedStatus] = useState(false);

    const [valueCharge, setValueCharge] = useState({
        'ArrestID': '', 'IncidentID': '', 'CreatedByUserFK': '', 'ChargeCodeID': '', 'NIBRSID': '', 'ChargeID': '', 'ModifiedByUserFK': '', 'LawTitleId': '', 'AttemptComplete': '',
    });

    const [errorsCharge, setErrorsCharge] = useState({
        'NIBRSIDError': '', 'ChargeCodeIDError': '', 'AttemptRequiredError': '',
    })

    useEffect(() => {
        if (loginAgencyID) {
            setValueCharge({
                ...valueCharge,
                'IncidentID': DecEIncID, 'ArrestID': ArrestID, 'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'AttemptComplete': '',
                'LawTitleId': '',
            });
            get_Arrest_Count(ArrestID); get_Data_Arrest_Charge(ArrestID);
            // lawTitle
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            // nibrs code
            get_NIBRS_Drp_Data(loginAgencyID, null);
            // charge code
            get_ChargeCode_Drp_Data(loginAgencyID, null, null);
        }
    }, [loginAgencyID]);

    const check_Validation_ErrorCharge = (e) => {
        const NIBRSIDError = RequiredFieldIncident(valueCharge.NIBRSID);
        const ChargeCodeIDError = RequiredFieldIncident(valueCharge.ChargeCodeID);
        const AttemptRequiredError = RequiredFieldIncident(valueCharge.AttemptComplete);
        setErrorsCharge(pre => {
            return {
                ...pre,
                ['NIBRSIDError']: NIBRSIDError || pre['NIBRSIDError'],
                ['ChargeCodeIDError']: ChargeCodeIDError || pre['ChargeCodeIDError'],
                ['AttemptRequiredError']: AttemptRequiredError || pre['AttemptRequiredError'],
            }
        });
    }

    const { ChargeCodeIDError, NIBRSIDError, AttemptRequiredError } = errorsCharge

    useEffect(() => {
        if (ChargeCodeIDError === 'true' && NIBRSIDError === 'true' && AttemptRequiredError === 'true') {
            if (ChargeID) { update_Arrest_Charge() }
            else { Add_Charge_Data() }
        }
    }, [ChargeCodeIDError, NIBRSIDError, AttemptRequiredError])

    useEffect(() => {
        if (DecChargeId) {
            GetSingleDataCharge(DecChargeId);
        }
    }, [DecChargeId]);

    useEffect(() => {
        if (DecEIncID) {
            getIncidentData(DecEIncID);
            getNarrativeApprovedStatus(DecEIncID);
        }
    }, [DecEIncID]);

    const GetSingleDataCharge = (ChargeID) => {
        if (ArrestID) {
            const val = { 'ChargeID': ChargeID };
            fetchPostData('ArrestCharge/GetSingleData_ArrestCharge', val).then((res) => {
                if (res) {
                    setEditvalCharge(res);
                } else {
                    setEditvalCharge([]);
                }
            });
        } else {
            const localChargeData = JSON.parse(sessionStorage.getItem('ChargeLocalData')) || [];
            const chargeData = localChargeData.find(charge => charge.ChargeID === ChargeID);
            if (chargeData) {
                setEditvalCharge([chargeData]);
            } else {
                setEditvalCharge([]);
            }
        }
    };

    useEffect(() => {
        if (EditvalCharge) {
            setValueCharge({
                ...valueCharge, 'ChargeCodeID': EditvalCharge[0]?.ChargeCodeID || EditvalCharge?.ChargeCodeID,
                'NIBRSID': EditvalCharge[0]?.NIBRSID || EditvalCharge?.NIBRSCodeId, 'ChargeID': EditvalCharge[0]?.ChargeID,
                'ModifiedByUserFK': loginPinID, 'LawTitleId': EditvalCharge[0]?.LawTitleId || EditvalCharge?.LawTitleId,
                'AttemptComplete': EditvalCharge[0]?.AttemptComplete === "C"
                    ? "C"
                    : EditvalCharge[0]?.AttemptComplete === "A"
                        ? "A"
                        : "",
            });

            setArrestName(EditvalCharge[0]?.Name ? EditvalCharge[0]?.Name : '');
            // lawTitle
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            // nibrs code
            get_NIBRS_Drp_Data(loginAgencyID, null);
            // charge code
            get_ChargeCode_Drp_Data(loginAgencyID, null, null);
        } else {
            setValueCharge({ ...valueCharge, 'Count': '', 'ChargeCodeID': '', 'NIBRSID': '', 'UCRClearID': '', 'ChargeID': '', 'Name': Name, 'IncidentNumber': IncNo, 'ArrestNumber': ArrNo, 'LawTitleId': '', 'AttemptComplete': '' });
        }
    }, [EditvalCharge, changesStatusCount])

    const getNarrativeApprovedStatus = async (IncidentId) => {
        try {
            const res = await fetchPostData('Narrative/GetData_AllIncidentNarrativeApprovedStatus', { IncidentId: IncidentId });
            if (res?.length > 0) {
                // true when all narrative approved
                setNarrativeApprovedStatus(res[0]?.AllReportApprove);
            } else {
                setNarrativeApprovedStatus(false);
            }
        } catch (error) {
            console.log("🚀 ~ getNarrativeApprovedStatus ~ error:", error);
            setNarrativeApprovedStatus(false);
        }
    }

    const LawTitleIdDrpDwnVal = async (loginAgencyID, ChargeCodeID) => {
        const val = { AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID }
        await fetchPostData('LawTitle/GetDataDropDown_LawTitle', val).then((data) => {
            if (data) {
                setLawTitleIdDrp(Comman_changeArrayFormat(data, 'LawTitleID', 'Description'));
            } else {
                setLawTitleIdDrp([]);
            }
        })
    }

    const get_NIBRS_Drp_Data = (loginAgencyID, LawTitleID,) => {
        const val = { 'AgencyID': loginAgencyID, 'LawTitleID': LawTitleID ? LawTitleID : null, 'IncidentID': DecEIncID, }
        fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((res) => {
            if (res) {
                setNIBRSDrpData(threeColArrayWithCode(res, 'FBIID', 'Description', 'FederalSpecificFBICode'));

            } else {
                setNIBRSDrpData([]);

            }
        })
    }

    const get_ChargeCode_Drp_Data = (loginAgencyID, FBIID, LawTitleID) => {
        const val = { 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'LawTitleID': LawTitleID, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setChargeCodeDrp(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'));
            } else {
                setChargeCodeDrp([]);
            }
        })
    };

    const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, chargeCodeId) => {
        const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: chargeCodeId };
        const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: DecEIncID, ChargeCodeID: chargeCodeId };
        try {
            const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
                fetchPostData('LawTitle/GetDataDropDown_LawTitle', lawTitleObj),
                fetchPostData('FBICodes/GetDataDropDown_FBICodes', nibrsCodeObj)
            ]);
            const lawTitleArr = Comman_changeArrayFormat(lawTitleResponse, 'LawTitleID', 'Description');

            const nibrsArr = threeColArrayWithCode(nibrsCodeResponse, 'FBIID', 'Description', 'FederalSpecificFBICode');

            setValueCharge({ ...valueCharge, LawTitleId: lawTitleArr[0]?.value, NIBRSID: nibrsArr[0]?.value, ChargeCodeID: chargeCodeId, });
        } catch (error) {
            console.error('Error during data fetching:', error);

        }
    };

    const onChangeDrpLawTitle = async (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            if (name === "LawTitleId") {
                setValueCharge({ ...valueCharge, ['LawTitleId']: e.value, ['NIBRSID']: null, ['ChargeCodeID']: null, });
                setChargeCodeDrp([]); setNIBRSDrpData([]);
                // nibrs code 
                get_NIBRS_Drp_Data(loginAgencyID, e.value);
                // charge code
                get_ChargeCode_Drp_Data(loginAgencyID, valueCharge?.NIBRSID, e.value);
            } else if (name === 'ChargeCodeID') {
                const res = await getLawTitleNibrsByCharge(loginAgencyID, valueCharge?.LawTitleId, e.value);
            } else {
                setValueCharge({ ...valueCharge, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValueCharge({ ...valueCharge, ['LawTitleId']: null, ['NIBRSID']: '', ['ChargeCodeID']: null, });
                setChargeCodeDrp([]); setNIBRSDrpData([]);
                //law title
                LawTitleIdDrpDwnVal(loginAgencyID, null);
                // nibrs code
                get_NIBRS_Drp_Data(loginAgencyID, null);
                //offence code 
                get_ChargeCode_Drp_Data(loginAgencyID, null, null);

            } else if (name === 'ChargeCodeID') {
                setValueCharge({ ...valueCharge, ['ChargeCodeID']: null });
            } else {
                setValueCharge({ ...valueCharge, [name]: null });
            }
        }
    }

    const onChangeNIBRSCode = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            if (name === 'NIBRSID') {
                if ((e.id === "09C" || e.id === "360" || e.id === "09A" || e.id === "09B" || e.id === "13A" || e.id === "13B" || e.id === "13C") && loginAgencyState === "TX") {
                    setValueCharge({ ...valueCharge, ["NIBRSID"]: e.value, ["ChargeCodeID"]: null, AttemptComplete: "C", });
                    setChargeCodeDrp([]); get_ChargeCode_Drp_Data(loginAgencyID, e.value, valueCharge?.LawTitleId);

                } else {
                    setValueCharge({ ...valueCharge, ['NIBRSID']: e.value, ['ChargeCodeID']: null, });
                    setChargeCodeDrp([]); get_ChargeCode_Drp_Data(loginAgencyID, e.value, valueCharge?.LawTitleId);

                }
            } else {
                setValueCharge({ ...valueCharge, [name]: e.value });

            }
        } else {
            if (name === "NIBRSID") {
                setValueCharge({ ...valueCharge, [name]: null, ['ChargeCodeID']: null, });
                get_ChargeCode_Drp_Data(loginAgencyID, null, null);
            } else {
                setValueCharge({ ...valueCharge, [name]: null });

            }
        }
    }

    const SyncLocalChargesToServer = async (ArrestID, DecEIncID, loginPinID, loginAgencyID, ChargeLocalArr, setChargeLocalArr, get_Arrest_Count, get_Data_Arrest_Charge) => {
        if (!ArrestID || !ChargeLocalArr?.length) return;
        for (let charge of ChargeLocalArr) {
            const val = {
                ...charge, ChargeID: null, ArrestID, IncidentID: DecEIncID, CreatedByUserFK: loginPinID, AgencyID: loginAgencyID,
            };
            await AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
                if (res?.success) {
                    console.log(`✅ Synced local charge: ${charge.ChargeCodeID}`);
                }
            });
        }
        // Cleanup
        setChargeLocalArr([]);
        sessionStorage.removeItem('ChargeLocalData');

        get_Arrest_Count(ArrestID);
        get_Data_Arrest_Charge(ArrestID);
    };

    const Add_Charge_Data = () => {
        const { ChargeCodeID, NIBRSID, LawTitleId, AttemptComplete } = valueCharge;
        const newCharge = {
            ...valueCharge, ChargeCodeID, NIBRSID, LawTitleId, IncidentID: DecEIncID, CreatedByUserFK: loginPinID, AgencyID: loginAgencyID, AttemptComplete: AttemptComplete,
        };

        if (ArrestID) {
            const val = { ...newCharge, ChargeID: DecChargeId, ArrestID: ArrestID, };
            AddDeleteUpadate('ArrestCharge/Insert_ArrestCharge', val).then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); get_Arrest_Count(ArrestID);
                    get_Data_Arrest_Charge(ArrestID);
                    get_ArrestCharge_Count(DecChargeId);

                    Reset();
                    setChangesStatus(false);
                    setStatesChangeStatus(false);
                    setUpdateCount(updateCount + 1);

                    setErrorsCharge({
                        ...errorsCharge,
                        ['ChargeCodeIDError']: '',
                    });
                    get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);

                    // Reload dropdowns
                    LawTitleIdDrpDwnVal(loginAgencyID, null);
                    get_NIBRS_Drp_Data(loginAgencyID, null);
                    get_ChargeCode_Drp_Data(loginAgencyID, null, null);
                }
            });

        } else {
            const localCharge = {
                ...newCharge,
                ChargeID: `local-${Date.now()}`,
                ArrestID: null,
                NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
                ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
                LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
                AttemptComplete: AttemptComplete,
            };
            const isDuplicate = ChargeLocalArr?.some(item =>
                item.ChargeCodeID === localCharge.ChargeCodeID &&
                item.NIBRSID === localCharge.NIBRSID
            );

            if (isDuplicate) {
                toastifyError('This charge already exists locally.');
                return;
            }

            const updatedLocalCharges = [...ChargeLocalArr, localCharge];
            setChargeLocalArr(updatedLocalCharges);
            sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedLocalCharges));
            Reset();
            setChangesStatus(false);
            setStatesChangeStatus(false);
        }
    };

    const update_Arrest_Charge = () => {
        const { ChargeCodeID, NIBRSID, LawTitleId, AttemptComplete } = valueCharge;

        if (ArrestID) {
            const val = { IncidentID: DecEIncID, ArrestID: ArrestID, ChargeID: DecChargeId, ModifiedByUserFK: loginPinID, AgencyID: loginAgencyID, ChargeCodeID: ChargeCodeID, NIBRSID: NIBRSID, LawTitleId: LawTitleId, AttemptComplete: AttemptComplete, };

            AddDeleteUpadate('ArrestCharge/Update_ArrestCharge', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;

                toastifySuccess(message);
                setStatesChangeStatus(false);
                setChangesStatus(false);
                get_Data_Arrest_Charge(ArrestID);

                setErrorsCharge({
                    ...errorsCharge,
                    ['ChargeCodeIDError']: '',
                });
                LawTitleIdDrpDwnVal(loginAgencyID, null);
                get_NIBRS_Drp_Data(loginAgencyID, null);
                get_ChargeCode_Drp_Data(loginAgencyID, null, null);
            });
        } else {

            const updatedCharges = ChargeLocalArr.map(charge => {
                if (charge.ChargeID === DecChargeId) {
                    return {
                        ...charge, ChargeCodeID, NIBRSID, LawTitleId, NIBRS_Description: NIBRSDrpData?.find(x => x.value === NIBRSID)?.label || '',
                        ChargeCode_Description: chargeCodeDrp?.find(x => x.value === ChargeCodeID)?.label || '',
                        LawTitle_Description: lawTitleIdDrp?.find(x => x.value === LawTitleId)?.label || '',
                        AttemptComplete: AttemptComplete,
                    };
                }
                return charge;
            });

            setChargeLocalArr(updatedCharges);
            sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedCharges));
            setStatesChangeStatus(false);
            setChangesStatus(false);
            setErrorsCharge({
                ...errorsCharge,
                ['ChargeCodeIDError']: '',
            });
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            get_NIBRS_Drp_Data(loginAgencyID, null);
            get_ChargeCode_Drp_Data(loginAgencyID, null, null);
        }
    };

    const DeleteCharge = () => {
        // if (!delChargeID) {
        //     toastifyError('No charge selected for deletion.');
        //     return;
        // }
        const chargeID = String(delChargeID);
        if (chargeID.startsWith('local-')) {
            const updatedLocalCharges = ChargeLocalArr.filter(charge => charge.ChargeID !== delChargeID);
            setChargeLocalArr(updatedLocalCharges);
            sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedLocalCharges));

            toastifySuccess('Deleted successfully.');
            setDelChargeID(null);
            setIsChargeDel(false);
            // Reset();
            setChangesStatus(false);
            setStatesChangeStatus(false);
        } else {
            const val = { 'ChargeID': delChargeID, 'DeletedByUserFK': loginPinID };
            AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
                if (res) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    get_Data_Arrest_Charge(ArrestID);
                    get_Arrest_Count(ArrestID);
                    setIsChargeDel(false);
                    // Reset();
                    get_ArrestCharge_Count(DecChargeId);
                    setErrors('');
                    // setStatusFalse();
                } else {
                    console.log("Something went wrong");
                }
            });
        }
    };

    const columnsCharge = [
        {
            name: 'NIBRS Code', selector: (row) => row.NIBRS_Description || row.FBICode_Desc, sortable: true
        },
        {
            name: ' Offense Code/Name', selector: (row) => row.ChargeCode_Description || row.Offense_Description, sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        !narrativeApprovedStatus && <span onClick={() => {
                            if (row.NameOffenseID) {
                                setoffenseNameID(row.NameOffenseID)
                            }
                            else {
                                setDelChargeID(row.ChargeID); setIsChargeDel(true)
                            }
                        }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                            <i className="fa fa-trash"></i>
                        </span>
                    }
                </div >
        }


    ]

    const conditionalRowStylesCharge = [
        {
            when: row => row.ChargeID === DecChargeId,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const set_Edit_ValueCharge = (row) => {
        setDelChargeID(row.ChargeID);
        if (!row.OffenseID) {
            setChargeID(row.ChargeID);
            setDecChargeId(row.ChargeID);
        }
        get_ArrestCharge_Count(row.ChargeID); setErrorsCharge(''); setStatesChangeStatus(false);

        if (row.OffenseID) {
            setEditvalCharge(row);
        }
        else {
            GetSingleDataCharge(row.ChargeID);
        }
        setChangesStatus(false); get_Arrest_Count(ArrestID);
    }

    const setStatusFalseCharge = () => {
        setErrorsCharge(''); setChargeID(''); Reset();
    }

    // Validate Arrest 
    const ValidateArrest = (incidentID) => {
        setclickNibLoder(true);
        try {
            fetchPostDataNibrs('NIBRS/GetArrest_A_NIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'ArrestID': '', 'gIntAgencyID': loginAgencyID }).then((data) => {
                if (data) {
                    console.log("🚀 ~ ValidateProperty ~ data:", data);
                    setclickNibLoder(false);
                } else {
                    setclickNibLoder(false);
                }
            })
        } catch (error) {
            console.log("🚀 ~ ValidateProperty ~ error:", error);
            setclickNibLoder(false);
        }
    }

    const checkArrest_ChargeCount = () => {
        get_Data_Arrest(DecEIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
        if (ArrestID) {
            get_ArrestCharge_Count(ArrestID);
        }
    }

    useEffect(() => {
        if (value?.IsJuvenileArrest === false || value?.IsJuvenileArrest === 'false') {
            setValue(prev => ({
                ...prev,
                JuvenileDispositionID: null,
                PhoneNo: '',
            }));
        }
    }, [value?.IsJuvenileArrest]);

    const arrestChargeCount = arrestFilterData?.every((item) => item?.ChargeCount > 0);

    //  Attempted/Completed
    const StatusOption = [
        { value: "A", label: "Attempted" },
        { value: "C", label: "Completed" },
    ];

    const nibrsSuccessStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#9fd4ae",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const onChangeAttComp = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true);
        if (e) {
            setValueCharge({ ...valueCharge, [name]: e.value });
        } else {
            setValueCharge({ ...valueCharge, [name]: null });
        }
    };

    const DeleteOffense = () => {
        const val = {
            'NameOffenseID': offenseNameID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('NameOffense/Delete_NameOffense', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);

                // get_Name_Count(DecNameID)
                // get_Offense_DropDown(incidentID, DecNameID);

                get_OffenseName_Data(possessionID)
            } else {
                console.log("res");
            }
        }).catch((err) => {
            console.log("🚀 ~Delete AddDeleteUpadate ~ err:", err);
        })
    }

    return (
        <>
            <div className="col-12 " id="display-not-form">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 pt-2 p-0">
                        <div className="row px-2">
                            <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                <label htmlFor="" className='new-label'> Arrest No.</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2  text-field  mt-1">
                                <input
                                    type="text"
                                    name='ArrestNumber'
                                    value={value?.ArrestNumber}
                                    className="readonlyColor"
                                    onChange={''}
                                    id='ArrestNumber'
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-2 col-md-3 col-lg-2 mt-1 pt-2">
                                <label htmlFor="" className='new-label text-nowrap'>Incident No.</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                <input
                                    type="text"
                                    className='readonlyColor'
                                    name='IncidentNumber'
                                    value={IncNo ? IncNo : ''}
                                    required
                                    readOnly
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2">
                                <label htmlFor="" className='new-label'>
                                    Arrest Date/Time
                                    {errors.ArrestDtTmError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ArrestDtTmError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 ">
                                <DatePicker
                                    id='ArrestDtTm'
                                    name='ArrestDtTm'
                                    ref={startRef1}
                                    onKeyDown={(e) => {
                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                            e?.preventDefault();
                                        } else {
                                            onKeyDown(e);
                                        }
                                    }}
                                    onChange={(date) => {
                                        if (!date) {
                                            setChangesStatus(true);
                                            setStatesChangeStatus(true);
                                            setArrestDate(null);
                                            setValue({ ...value, ['ArrestDtTm']: null });
                                            return;
                                        }

                                        let currDate = new Date(date);
                                        const minDate = extractIncidentDate ? new Date(extractIncidentDate) : new Date(incidentReportedDate);
                                        const maxDate = new Date(datezone);

                                        const isSameDate = (d1, d2) =>
                                            d1.getFullYear() === d2.getFullYear() &&
                                            d1.getMonth() === d2.getMonth() &&
                                            d1.getDate() === d2.getDate();

                                        if (minDate) {
                                            const minDateTime = new Date(minDate);
                                            minDateTime.setMinutes(minDateTime.getMinutes() + 1);
                                            if (isSameDate(currDate, minDate)) {
                                                if (currDate < minDateTime) {
                                                    currDate = minDateTime;
                                                }
                                            }
                                            if (currDate < minDateTime) {
                                                currDate = minDateTime;
                                            }
                                        }

                                        if (currDate > maxDate) {
                                            currDate = maxDate;
                                        }

                                        setChangesStatus(true);
                                        setStatesChangeStatus(true);
                                        setArrestDate(currDate);
                                        setValue({ ...value, ['ArrestDtTm']: getShowingMonthDateYear(currDate) });
                                    }}
                                    // className='requiredColor'
                                    className={isLockOrRestrictModule("Lock", Editval[0]?.ArrestDtTm, isLocked) ? 'LockFildsColor' : 'requiredColor'}
                                    disabled={isLockOrRestrictModule("Lock", Editval[0]?.ArrestDtTm, isLocked)}

                                    dateFormat="MM/dd/yyyy HH:mm"
                                    timeFormat="HH:mm"
                                    is24Hour
                                    timeInputLabel
                                    showYearDropdown
                                    showMonthDropdown
                                    dropdownMode="select"
                                    isClearable={value?.ArrestDtTm ? true : false}
                                    selected={value?.ArrestDtTm ? new Date(value?.ArrestDtTm) : null}
                                    placeholderText={value?.ArrestDtTm ? value.ArrestDtTm : 'Select...'}
                                    showTimeSelect
                                    timeIntervals={1}
                                    timeCaption="Time"
                                    autoComplete="Off"
                                    maxDate={new Date(datezone)}
                                    minDate={extractIncidentDate ? new Date(extractIncidentDate) : new Date(incidentReportedDate)}
                                    filterTime={(time) => filterPassedTimeZoneArrest(time, extractIncidentDate, datezone, incidentReportedDate)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <fieldset className='mt-2'> */}
                {/* <legend>Name Information </legend> */}
                <div className="row ">
                    <div className="col-12 col-md-12 col-lg-12 pt-2 p-0 ">
                        <div className="row ">
                            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                <label htmlFor="" className='new-label'>Arrestee
                                    {errors.ArresteeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ArresteeIDError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3">
                                {
                                    MstPage === "MST-Arrest-Dash" ?
                                        <Select
                                            name="ArresteeID"
                                            options={mastersNameDrpData}
                                            value={mastersNameDrpData?.filter((obj) => obj.value === value?.ArresteeID)}
                                            isClearable
                                            onChange={(e) => ChangeDropDown(e, 'ArresteeID')}
                                            placeholder="Select..."
                                            // styles={Requiredcolour}
                                            styles={isLockOrRestrictModule("Lock", Editval[0]?.ArresteeID, isLocked) ? LockFildscolour : Requiredcolour}
                                            isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.ArresteeID, isLocked)}
                                        />
                                        :
                                        <Select
                                            name="ArresteeID"
                                            options={arresteeNameData}
                                            value={arresteeNameData?.filter((obj) => obj.value === value?.ArresteeID)}
                                            isClearable
                                            onChange={(e) => ChangeDropDown(e, 'ArresteeID')}
                                            placeholder="Select..."
                                            // styles={Requiredcolour}
                                            // isDisabled={ArrestID ? true : false}
                                            styles={isLockOrRestrictModule("Lock", Editval[0]?.ArresteeID, isLocked) ? LockFildscolour : Requiredcolour}
                                            isDisabled={ArrestID || isLockOrRestrictModule("Lock", Editval[0]?.ArresteeID, isLocked) ? true : false}
                                        />
                                }
                            </div>
                            <div className="col-1" data-toggle="modal" data-target="#MasterModal"  >
                                <button
                                    className=" btn btn-sm bg-green text-white"
                                    disabled={ArrestID}
                                    onClick={() => {
                                        if (possessionID) { GetSingleDataPassion(possessionID); }
                                        setNameModalStatus(true); setDatePickerRequiredColor(true)
                                    }}
                                >
                                    <i className="fa fa-plus" > </i>
                                </button>
                            </div>
                            <div className="col-4 col-md-2 col-lg-1 mt-2">
                                <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Arrest Type') }}>
                                    Arrest Type{errors.ArrestTypeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ArrestTypeIDError}</p>
                                    ) : null}
                                </span>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 ">
                                <Select
                                    name="ArrestTypeID"
                                    value={arrestTypeDrpData?.filter((obj) => obj.value === value?.ArrestTypeID)}
                                    isClearable
                                    options={arrestTypeDrpData}
                                    onChange={(e) => { ChangeDropDown(e, 'ArrestTypeID') }}
                                    placeholder="Select..."
                                    // styles={Requiredcolour}
                                    styles={isLockOrRestrictModule("Lock", Editval[0]?.ArrestTypeID, isLocked) ? LockFildscolour : Requiredcolour}
                                    isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.ArrestTypeID, isLocked)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* </fieldset> */}
                {/* juvenile */}
                {/* <fieldset> */}
                {/* <legend>Juvenile Disposition</legend> */}
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 pt-2 p-0 ">
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                <span
                                    data-toggle="modal"
                                    onClick={() => { setOpenPage('Arrest Juvenile Disposition') }}
                                    data-target="#ListModel"
                                    className='new-link'
                                >
                                    Disposition
                                    {errors.JuvenileDispoError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.JuvenileDispoError}</p>
                                    ) : null}
                                </span>
                            </div>
                            <div className="col-4 col-md-4 col-lg-4 mt-1 ml-2">
                                <Select
                                    name='JuvenileDispositionID'
                                    menuPlacement='top'
                                    value={arrestJuvenileDisDrpData?.filter((obj) => obj.value === value?.JuvenileDispositionID)}
                                    isClearable
                                    options={arrestJuvenileDisDrpData}
                                    onChange={(e) => ChangeDropDown(e, 'JuvenileDispositionID')}
                                    placeholder="Select..."
                                    // styles={value?.IsJuvenileArrest === 'true' || value?.IsJuvenileArrest === true ? Requiredcolour : customStylesWithOutColor}
                                    // isDisabled={!(value?.IsJuvenileArrest === true || value?.IsJuvenileArrest === 'true')}
                                    styles={isLockOrRestrictModule("Lock", Editval[0]?.JuvenileDispositionID, isLocked) ? LockFildscolour : value?.IsJuvenileArrest === 'true' || value?.IsJuvenileArrest === true ? Requiredcolour : customStylesWithOutColor}
                                    isDisabled={isLockOrRestrictModule("Lock", Editval[0]?.JuvenileDispositionID, isLocked) || !(value?.IsJuvenileArrest === true || value?.IsJuvenileArrest === 'true')}
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2 ml-5">
                                <label htmlFor="" className='new-label'>Phone No:{errors.CellPhoneError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CellPhoneError}</p>
                                ) : null}</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                <input
                                    type="text"
                                    maxLength={10}
                                    name='PhoneNo'
                                    id='PhoneNo'
                                    value={value?.PhoneNo}
                                    onChange={handleChange}
                                    required
                                    // className={`${value.IsJuvenileArrest === false ? "readonlyColor" : ''}`}
                                    // disabled={value.IsJuvenileArrest === true ? false : true}
                                    className={`${isLockOrRestrictModule("Lock", Editval[0]?.PhoneNo, isLocked) ? 'LockFildscolour' : value.IsJuvenileArrest === false ? "readonlyColor" : ''}`}
                                    disabled={isLockOrRestrictModule("Lock", Editval[0]?.PhoneNo, isLocked) || value.IsJuvenileArrest === true ? false : true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* </fieldset> */}
                {tabCountArrest?.ChargeCount === 0 && ArrestID && (
                    <div className="text-center p-1">
                        <span
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                color: isHovered ? 'blue' : 'red',
                                transition: 'background-color 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <u>Add Charge With This Arrest</u>
                        </span>
                    </div>
                )}
            </div>
            <div className={`modal ${confirmInsertArrest ? 'show' : ''}`} style={{ display: confirmInsertArrest ? 'block' : 'none', background: "rgba(0,0,0, 0.5)", transition: '0.5s', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="box text-center py-5">
                            <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to save current record ?</h5>
                            <div className="btn-box mt-3">
                                <button type="button" onClick={() => { setInsertArrest(false); check_Validation_Error(); setConfirmInsertArrest(false); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }}>OK</button>
                                <button type="button" onClick={() => { setConfirmInsertArrest(false); }} className="btn btn-sm btn-secondary ml-2">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <>
                <fieldset>
                    <legend>Charge</legend>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                <label htmlFor="" className='new-label'>
                                    Law Title
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-2 ">
                                <Select
                                    name='LawTitleId'
                                    styles={customStylesWithOutColor}
                                    value={lawTitleIdDrp?.filter((obj) => obj.value === valueCharge?.LawTitleId)}
                                    options={lawTitleIdDrp}
                                    isClearable
                                    onChange={(e) => onChangeDrpLawTitle(e, 'LawTitleId')}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-2 pt-2">
                                <label htmlFor="" className='new-label'>
                                    TIBRS Code
                                    <br />
                                    {errorsCharge.NIBRSIDError !== 'true' ? (
                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errorsCharge.NIBRSIDError}</span>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                <Select
                                    styles={Requiredcolour}
                                    name="NIBRSID"
                                    value={NIBRSDrpData?.filter((obj) => obj.value === valueCharge?.NIBRSID)}
                                    isClearable
                                    options={NIBRSDrpData}
                                    onChange={(e) => { onChangeNIBRSCode(e, 'NIBRSID') }}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-4 col-md-4 col-lg-2 mt-2 ">

                            </div>
                            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                                <Link to={'/ListManagement?page=Charge%20Code&call=/Arr-Charge-Home'} className='new-link '>
                                    Off. Code
                                    <br />
                                    {errorsCharge.ChargeCodeIDError !== 'true' ? (
                                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errorsCharge.ChargeCodeIDError}</span>
                                    ) : null}
                                </Link>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                <Select
                                    name="ChargeCodeID"
                                    value={chargeCodeDrp?.filter((obj) => obj.value === valueCharge?.ChargeCodeID)}
                                    styles={Requiredcolour}
                                    isClearable
                                    options={chargeCodeDrp}
                                    onChange={(e) => { onChangeDrpLawTitle(e, 'ChargeCodeID') }}
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-2 col-md-2 col-lg-2 mt-3" >
                                <label className="new-label"  >
                                    {/* Attem/Comp */}
                                    Attempted/Completed
                                    {errorsCharge.AttemptRequiredError !== 'true' && (
                                        <span style={{ color: 'red', fontSize: '13px', display: 'block' }}>
                                            {errorsCharge.AttemptRequiredError}
                                        </span>
                                    )}
                                </label>
                            </div>
                            <div className="col-10 col-md-4 col-lg-2 mt-2">
                                <Select
                                    onChange={(e) => onChangeAttComp(e, "AttemptComplete")}
                                    options={StatusOption}
                                    isClearable
                                    styles={!valueCharge?.AttemptComplete ? nibrscolourStyles : nibrsSuccessStyles}
                                    placeholder="Select..."
                                    value={StatusOption.filter((option) => option.value === valueCharge?.AttemptComplete)}
                                />
                            </div>
                            <div className="btn-box text-right col-lg-12 mt-2 mb-2 d-flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                                {
                                    isNibrsSummited ? (
                                        <>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                data-toggle={"modal"}
                                                data-target={"#NibrsErrorShowModal"}

                                                onClick={() => { checkArrest_ChargeCount() }}
                                                className={` ${!arrestChargeCount ? `btn btn-sm  mr-2  mt-2` : 'btn btn-sm btn-success mr-2 '}`}

                                                style={{
                                                    backgroundColor: `${!arrestChargeCount ? 'red' : 'green'}`,
                                                }}
                                            >
                                                Validate TIBRS
                                            </button>
                                            <div>
                                                <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { setStatusFalseCharge(); }}>New</button>
                                                {
                                                    ChargeID ?
                                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                                                            <button type="button" onClick={() => check_Validation_ErrorCharge()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update Charge</button>
                                                            :
                                                            <></>
                                                            :
                                                            <button type="button" onClick={() => check_Validation_ErrorCharge()} disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1">Update Charge</button>
                                                        :
                                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                            <button type="button" onClick={() => check_Validation_ErrorCharge()} className="btn btn-sm btn-success  mr-1">Add Charge</button>
                                                            :
                                                            <></>
                                                            :
                                                            <button type="button" onClick={() => check_Validation_ErrorCharge()} className="btn btn-sm btn-success  mr-1">Add Charge</button>
                                                }

                                            </div>
                                        </>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-2">
                        <DataTable
                            dense
                            data={
                                effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? (ArrestID || possessionID) && arrestChargeData.length > 0
                                    ? arrestChargeData
                                    : ChargeLocalArr
                                    : []
                                    : (ArrestID || possessionID) && arrestChargeData.length > 0
                                        ? arrestChargeData
                                        : ChargeLocalArr
                            }
                            columns={columnsCharge}
                            selectableRowsHighlight
                            highlightOnHover
                            pagination
                            onRowClicked={(row) => { set_Edit_ValueCharge(row); }}
                            fixedHeaderScrollHeight='250px'
                            conditionalRowStyles={conditionalRowStylesCharge}
                            fixedHeader
                            persistTableHead={true}
                            customStyles={tableCustomStyles}
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        />
                    </div>
                    <ListModal {...{ openPage, setOpenPage }} />
                    <ChangesModal func={check_Validation_Error} />
                </fieldset>
            </>
            <div className="col-12 d-flex justify-content-between  p-0" style={{ marginTop: '-8px' }}>
                {
                    isNibrsSummited ? (
                        <>
                        </>
                    ) : (
                        <>
                            {/* don't remove black div */}
                            <div>
                            </div>
                            <div>
                                {MstPage !== "MST-Arrest-Dash" && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success mr-2  mt-2"
                                        // onClick={setStatusFalse}
                                        onClick={() => { setStatusFalse(); setIsLocked(false); }}
                                    >
                                        New
                                    </button>
                                )}
                                {
                                    ArrestID && (ArrestSta === true || ArrestSta === 'true') ?
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok && nibrsSubmittedArrestee !== 1 ?
                                            <button type="button" className="btn btn-sm btn-success mr-2 mt-2" data-toggle="modal" data-target="#myModal"
                                                disabled={!statesChangeStatus} onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Update</button>
                                            :
                                            <></>
                                            :
                                            <button type="button" className="btn btn-sm btn-success mr-2  mt-2" data-toggle="modal" data-target="#myModal" disabled={!statesChangeStatus} onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Update</button>
                                        :
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <button type="button" className="btn btn-sm btn-success mr-2  mt-2" data-toggle="modal" data-target="#myModal" onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Save</button>
                                            :
                                            <></>
                                            :
                                            <button type="button" className="btn btn-sm btn-success mr-2  mt-2" data-toggle="modal" data-target="#myModal" onClick={() => { if (!showModal) { check_Validation_Error(); } }}>Save</button>
                                }
                            </div>
                        </>
                    )
                }
            </div>
            <div className="col-12 pt-1">
                {
                    MstPage != "MST-Arrest-Dash" &&
                    <DataTable
                        dense
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? arrestFilterData : [] : arrestFilterData}
                        columns={columns}
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        pagination
                        onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); }}
                        fixedHeaderScrollHeight='100px'
                        conditionalRowStyles={conditionalRowStyles}
                        fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        paginationPerPage={'100'}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                }
            </div>
            <ListModal {...{ openPage, setOpenPage }} />
            <ConfirmModal {...{ showModal, setShowModal, arresteeChange, value, possessionID, setPossessionID, setValue, setErrors }} />
            <DeletePopUpModal func={offenseNameID ? DeleteOffense : isChargeDel ? DeleteCharge : DeleteArrest} clearID={clearID} />
            <ChangesModal func={check_Validation_Error} />
            <MasterNameModel {...{ type, setArrestID, isDatePickerRequiredColor, value, setValue, setMstNameID, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, possessionID, setPossessionID, possenSinglData, setPossenSinglData, GetSingleDataPassion }} />
        </>
    )
}

export default Arrestees

const Get_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.ArresteeID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.label
}

const Get_Given_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.RightsGivenID)
    )
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

