import React, { useContext, useState, useEffect } from 'react';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AgencyContext } from '../../../../Context/Agency/Index';
import { getShowingDateText, getShowingMonthDateYear, Decrypt_Id_Name, base64ToString, stringToBase64, formatDate, filterPassedTimeZone, filterPassedTimeZoneException, nibrscolourStyles, Requiredcolour, isLockOrRestrictModule, LockFildscolour, } from '../../../Common/Utility';
import { AddDeleteUpadate, ScreenPermision, fetchPostData, fetchPostDataNibrs } from '../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RequiredFieldIncident, RequiredFieldIncidentCarboTheft, Space_NotAllow, } from '../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat, threeColArray } from '../../../Common/ChangeArrayFormat';
import Location from '../../../Location/Location';
import Loader from '../../../Common/Loader';
import ChangesModal from '../../../Common/ChangesModal';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import ListModal from '../../Utility/ListManagementModel/ListModal';
import { Incident_ReportDate } from '../../../../redux/actionTypes';
import { get_Incident_Drp_Data, } from '../../../../redux/actions/DropDownsData';
import { checkValidOffenderError, ErrorTooltip } from '../../../NIBRSError';
import MessageModelIncident from '../../../Common/MessageModelIncident';
import NirbsErrorShowModal from '../../../Common/NirbsErrorShowModal';
import NirbsAllModuleErrorShowModal from '../../../Common/NibrsAllModuleErrShowModal';


const IncidentHome = ({ incidentClick = false, isNibrsSummited = false, isLocked, setIsLocked }) => {

    let navigate = useNavigate();
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    // const rmsDispositionDrpData = useSelector((state) => state.DropDown.rmsDispositionDrpData);

    const { updateCount, get_IncidentTab_Count, get_Incident_Count, nibrsSubmittedAdministartive, GetDataExceptionalClearanceID, setnibrsSubmittedAdministartive, incidentCount, exceptionalClearID, setChangesStatus, GetDataTimeZone, datezone, validate_IncSideBar } = useContext(AgencyContext);

    const [reportedDate, setReportedDate] = useState(new Date(datezone));
    const [loder, setLoder] = useState(false);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [incidentID, setIncidentID] = useState();

    //DropDown Value
    const [editval, setEditval] = useState([]);
    const [clsDrpCode, setClsDrpCode] = useState();
    const [exClsDateCode, setExClsDateCode] = useState();
    const [updateStatus, setUpdateStatus] = useState(0);
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [carboTheft, setcarboTheft] = useState(false);
    const [adultArrestStatus, setadultArrestStatus] = useState(false);
    const [incidentErrorStatus, setIncidentErrorStatus] = useState(false);

    // nibrs Validate Incident
    const [baseDate, setBaseDate] = useState('');
    const [oriNumber, setOriNumber] = useState('');
    /// Error String
    const [IncidentErrorString, setIncidentErrorString] = useState('');

    const rmsDispositionDrpData = [
        {
            value: 15,
            label: "Yes",
            id: "01",
        },
        {
            value: 16,
            label: "No",
            id: "02",
        },
    ];

    const [value, setValue] = useState({
        'IncidentID': '', 'ReportedDate': '', 'OccurredFrom': '', 'OccurredTo': '', 'BIBRSDate': getShowingMonthDateYear(datezone), 'FinishedDate': '', 'DispositionDate': '', 'NIBRSclearancedate': '', 'IncidentNumber': "Auto Generated", 'CrimeLocation': '', 'DispositionComments': '', 'AgencyName': '', 'RMSCFSCodeID': '', 'NIBRSClearanceID': '', 'RMSDispositionId': '', 'ReceiveSourceID': '', 'CADCFSCodeID': '', 'CADDispositionId': '', 'AgencyID': '', 'IsVerify': true, 'crimelocationid': 0, 'FBIID': '', 'IsIncidentCode': true, 'DispatchedDate': '', 'ArrivedDate': '', 'DirectionPrefix': '', 'Street': '', 'DirectionSufix': '', 'TypeSufix': '', 'City': '', 'State': '', 'ZipCode': '', 'PremiseNo': '', 'ApartmentNo': '', 'CommonPlace': '', 'ApartmentType': '', 'Street_Parse': '', 'PremiseNo_Parse': '', 'DirectionPrefix_Parse': '',
        'TypeSuffix_Parse': '', 'DirectionSuffix_Parse': '', 'ZipCodeID': '', 'CityID': '', 'IsUsLocation': '', 'CountryID': '', 'Country': '', 'point_of_interest': '', 'neighborhood': '', 'subpremise': '', 'premise': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'OffenseType': '', 'OffenseTypeID': '', 'Address': '', 'CADIncidentNumber': '', 'MasterIncidentNumber': '', 'IsCargoTheftInvolved': null, 'InitAdjust': '', 'AttempComp': '',

    })

    const [errors, setErrors] = useState({
        'OccuredError': '', 'CrimeLocationError': '', 'ExceptionalClearaceError': '', 'IsVerify': '', 'NIBRSclearancedateError': '', 'IncNumberError': '', 'NIBRSclearancedateError': '', 'IncNumberError': '', 'OffenceTypeError': '', 'CargoTheftError': "",
        'FBIIDError': '',
    })

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    var narrativeId = query?.get("narrativeId");

    useEffect(() => {
        if (!localStoreData.AgencyID || !localStoreData.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setValue({ ...value, 'AgencyID': localStoreData?.AgencyID, 'CreatedByUserFK': localStoreData?.PINID });
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            setLoder(true);
            GetDataTimeZone(localStoreData?.AgencyID);
            get_Incident_Count(IncID, localStoreData?.PINID);
            setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null);
            setOriNumber(localStoreData?.ORI);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            if (exceptionalClearID.length === 0 && loginAgencyID) { GetDataExceptionalClearanceID(loginAgencyID); }
        }
    }, [loginAgencyID]);

    useEffect(() => {
        const defaultDate = datezone ? new Date(datezone) : null;

        setValue({ ...value, 'BIBRSDate': getShowingMonthDateYear(datezone), });
        if (IncID) {
            setIncidentID(IncID); GetEditData(IncID);
            get_IncidentTab_Count(IncID, loginPinID);
        } else {
            setIncidentID('');
            setClsDrpCode('')
        }
    }, [IncID, datezone]);

    const GetEditData = (incidentID) => {
        const val = { IncidentID: incidentID }
        fetchPostData('Incident/GetSingleData_Incident', val).then((res) => {
            if (res?.length > 0) {

                setEditval(res); setLoder(true);
            }
            else { setEditval([]); setLoder(true) }
        })
    }

    useEffect(() => {
        if (incidentID && (IncSta === true || IncSta === 'true')) {
            setValue({
                ...value,
                'IncidentID': editval[0]?.IncidentID, 'AgencyID': editval[0]?.AgencyID, 'CADDispositionId': editval[0]?.CADDispositionId, 'CADCFSCodeID': editval[0]?.CADCFSCodeID, 'RMSCFSCodeID': editval[0]?.RMSCFSCodeID, 'RMSDispositionId': editval[0]?.RMSDispositionId, 'NIBRSClearanceID': editval[0]?.NIBRSClearanceID, 'ReceiveSourceID': editval[0]?.ReceiveSourceID, 'crimelocationid': editval[0]?.crimelocationid, 'FBIID': editval[0]?.FBIID,
                //date fields
                'IncidentNumber': editval[0]?.IncidentNumber, 'CADIncidentNumber': editval[0]?.CADIncidentNumber, 'MasterIncidentNumber': editval[0]?.MasterIncidentNumber, 'ReportedDate': editval[0]?.ReportedDate ? getShowingDateText(editval[0]?.ReportedDate) : '', 'OccurredFrom': editval[0]?.OccurredFrom ? getShowingDateText(editval[0]?.OccurredFrom) : '',
                'OccurredTo': editval[0]?.OccurredTo ? getShowingDateText(editval[0]?.OccurredTo) : '', 'BIBRSDate': editval[0]?.BIBRSDate ? getShowingDateText(editval[0]?.BIBRSDate) : '',
                'DispositionDate': editval[0]?.DispositionDate ? editval[0]?.DispositionDate : '', 'NIBRSclearancedate': editval[0]?.NIBRSclearancedate ? getShowingDateText(editval[0]?.NIBRSclearancedate) : '', 'IsVerify': editval[0]?.IsVerify,
                //text
                'CrimeLocation': editval[0]?.CrimeLocation, 'DispositionComments': editval[0]?.DispositionComments,
                // location column
                'DirectionPrefix': editval[0]?.DirectionPrefix, 'Street': editval[0]?.Street, 'DirectionSufix': editval[0]?.DirectionSufix, 'TypeSufix': editval[0]?.TypeSufix, 'City': editval[0]?.City, 'State': editval[0]?.State, 'OffenseType': editval[0]?.OffenseType, 'OffenseTypeID': editval[0]?.OffenseTypeID, 'ZipCode': editval[0]?.ZipCode, 'PremiseNo': editval[0]?.PremiseNo, 'ApartmentNo': editval[0]?.ApartmentNo, 'CommonPlace': editval[0]?.CommonPlace, 'ApartmentType': editval[0]?.ApartmentType, 'Street_Parse': editval[0]?.Street_Parse, 'PremiseNo_Parse': editval[0]?.PremiseNo_Parse, 'DirectionPrefix_Parse': editval[0]?.DirectionPrefix_Parse, 'TypeSuffix_Parse': editval[0]?.TypeSuffix_Parse, 'DirectionSuffix_Parse': editval[0]?.DirectionSuffix_Parse, 'ZipCodeID': editval[0]?.ZipCodeID, 'CityID': editval[0]?.CityID, 'IsUsLocation': editval[0]?.IsUsLocation, 'CountryID': editval[0]?.CountryID, 'Country': editval[0]?.Country, 'point_of_interest': editval[0]?.point_of_interest, 'neighborhood': editval[0]?.neighborhood, 'subpremise': editval[0]?.subpremise, 'premise': editval[0]?.premise, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID, 'Address': editval[0]?.Address,
                'CaseStatusID': editval[0]?.CaseStatusID ? parseInt(editval[0]?.CaseStatusID) : '', 'CaseStatusCode': editval[0]?.CaseStatusCode,
                'IsCargoTheftInvolved': editval[0]?.IsCargoTheftInvolved || editval[0]?.IsCargoTheftInvolved === "N" ? editval[0]?.IsCargoTheftInvolved === "N" ? false : true : "",
                // 'IsCargoTheftInvolved': editval[0]?.IsCargoTheftInvolved === 'N' || editval[0]?.IsCargoTheftInvolved === null || editval[0]?.IsCargoTheftInvolved === '' ? false : true,
                // ----------------checkbox-------------------
                'InitAdjust': editval[0]?.InitAdjust ? editval[0]?.InitAdjust.trim() : '', 'AttempComp': editval[0]?.AttempComp,
            });

            setcarboTheft(editval[0]?.IsCargoTheftVisible);
            setClsDrpCode(Get_Exceptional_Code(editval, rmsDispositionDrpData));
            setExClsDateCode(Get_ExClsDate_Code(editval, exceptionalClearID));
            setnibrsSubmittedAdministartive(editval[0]?.IsNIBRSSummited);
            setReportedDate(
                editval[0]?.ReportedDate ? new Date(editval[0]?.ReportedDate) : ""
            );

            if (incidentCount[0]?.ArrestCount > 0) {
                setadultArrestStatus(true);
            } else {
                setadultArrestStatus(false);
            }
        } else {
            setValue({
                ...value,
                'IncidentNumber': null,
                'ReportedDate': getShowingMonthDateYear(datezone), 'OccurredFrom': null, 'OccurredTo': null, 'BIBRSDate': getShowingMonthDateYear(datezone), 'FBIID': '', 'CADCFSCodeID': '', 'DispositionDate': '', 'NIBRSclearancedate': '', 'CrimeLocation': '', 'DispositionComments': '', 'CADDispositionId': '', 'IsVerify': true, 'RMSCFSCodeID': '', 'NIBRSClearanceID': '', 'RMSDispositionId': '', 'ReceiveSourceID': '', 'OffenseType': '', 'OffenseTypeID': '', 'Address': '', 'CADIncidentNumber': '', 'MasterIncidentNumber': '', 'IsCargoTheftInvolved': '', 'InitAdjust': '', 'AttempComp': '',
            });
            setUpdateStatus(updateStatus + 1);

        }
    }, [editval, updateCount]);

    useEffect(() => {
        if (editval?.length > 0 && rmsDispositionDrpData?.length > 0) {
            // setClsDrpCode(Get_Exceptional_Code(editval, rmsDispositionDrpData));
        }
    }, [rmsDispositionDrpData, editval]);

    const check_Validation_Error = (e) => {
        if (clsDrpCode === '01' || value.RMSDispositionId === '15' || value.RMSDispositionId === 15) {
            if (exClsDateCode != 'N') {
                const ReportedDateErr = RequiredFieldIncident(value.ReportedDate);
                const NIBRSClearanceIDErr = RequiredFieldIncident(value.NIBRSClearanceID);
                const NIBRSclearancedateErrorErr = RequiredFieldIncident(value.NIBRSclearancedate);
                const OffenceTypeErr = RequiredFieldIncident(value?.OffenseTypeID)
                const CargoTheftErrorErr = carboTheft ? RequiredFieldIncidentCarboTheft(value.IsCargoTheftInvolved) : "true";
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        ['OccuredError']: ReportedDateErr || prevValues['OccuredError'],
                        ['ExceptionalClearaceError']: NIBRSClearanceIDErr || prevValues['ExceptionalClearaceError'],
                        ['NIBRSclearancedateError']: NIBRSclearancedateErrorErr || prevValues['NIBRSclearancedateError'],
                        ['OffenceTypeError']: OffenceTypeErr || prevValues['OffenceTypeError'],
                        ['CargoTheftError']: CargoTheftErrorErr || prevValues['CargoTheftError'],
                    }
                });
            } else {
                const ReportedDateErr = RequiredFieldIncident(value.ReportedDate);
                const NIBRSClearanceIDErr = RequiredFieldIncident(value.NIBRSClearanceID);
                const OffenceTypeErr = RequiredFieldIncident(value?.OffenseTypeID)
                const CargoTheftErrorErr = carboTheft ? RequiredFieldIncidentCarboTheft(value.IsCargoTheftInvolved) : "true";
                setErrors(prevValues => {
                    return {
                        ...prevValues,
                        ['OccuredError']: ReportedDateErr || prevValues['OccuredError'],
                        ['ExceptionalClearaceError']: NIBRSClearanceIDErr || prevValues['ExceptionalClearaceError'],
                        ['OffenceTypeError']: OffenceTypeErr || prevValues['OffenceTypeError'],
                        ['CargoTheftError']: CargoTheftErrorErr || prevValues['CargoTheftError'],
                    }
                })
            }
        } else {
            const ReportedDateErr = RequiredFieldIncident(value.ReportedDate);
            const OffenceTypeErr = RequiredFieldIncident(value?.OffenseTypeID)
            const CargoTheftErrorErr = carboTheft ? RequiredFieldIncidentCarboTheft(value.IsCargoTheftInvolved) : "true";
            setErrors(prevValues => {
                return {
                    ...prevValues,
                    ['OccuredError']: ReportedDateErr || prevValues['OccuredError'],
                    ['OffenceTypeError']: OffenceTypeErr || prevValues['OffenceTypeError'],
                    ['CargoTheftError']: CargoTheftErrorErr || prevValues['CargoTheftError'],
                }
            })
        }
    }

    // Check All Field Format is True Then Submit 
    const { OccuredError, ExceptionalClearaceError, NIBRSclearancedateError, OffenceTypeError, CargoTheftError } = errors

    useEffect(() => {
        if (clsDrpCode === '01') {
            if (exClsDateCode != 'N') {
                if (OccuredError === 'true' && ExceptionalClearaceError === 'true' && NIBRSclearancedateError === 'true' && OffenceTypeError === 'true' && CargoTheftError === 'true') {
                    if (IncSta === true || IncSta === 'true') {
                        UpdateIncident();
                    } else {
                        AddIncident();
                    }
                }
            } else if (OccuredError === 'true' && ExceptionalClearaceError === 'true' && OffenceTypeError === 'true', CargoTheftError === 'true') {
                if (IncSta === true || IncSta === 'true') {
                    UpdateIncident();
                } else {
                    AddIncident();
                }
            }
        } else if (OccuredError === 'true' && OffenceTypeError === 'true' && CargoTheftError === 'true') {
            if (IncSta === true || IncSta === 'true') {
                UpdateIncident();
            } else {
                AddIncident();
            }
        }
    }, [OccuredError, , ExceptionalClearaceError, NIBRSclearancedateError, OffenceTypeError, CargoTheftError]);

    const Reset = () => {
        setValue({
            ...value,
            'ReportedDate': '', 'OccurredFrom': '', 'OccurredTo': '', 'FinishedDate': '', 'BIBRSDate': '', 'DispositionDate': '', 'FBIID': '', 'NIBRSclearancedate': '', 'DispositionComments': '', 'IncidentNumber': '', 'RMSCFSCodeID': '', 'CADIncidentNumber': '', 'MasterIncidentNumber': '',
            'NIBRSClearanceID': '', 'RMSDispositionId': '', 'ReceiveSourceID': '', 'CADCFSCodeID': '', 'OffenseType': '', 'OffenseTypeID': '', 'Address': '', 'IsCargoTheftInvolved': '', 'InitAdjust': '', 'AttempComp': '',
        });
        setErrors({ ...errors, 'OccuredError': '', 'CrimeLocationError': '', 'ExceptionalClearaceError': '', 'NIBRSclearancedateError': '', 'OffenceTypeError': '', 'CargoTheftError': '' });
        setExClsDateCode('')
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true);
        if (e) {
            if (name === "RMSCFSCodeID") {
                setChangesStatus(true);
                setValue({ ...value, [name]: e.value })
            }
            else if (name === "RMSDispositionId") {
                setChangesStatus(true); setClsDrpCode(e.id);
                setValue({ ...value, [name]: e.value, ['NIBRSclearancedate']: '', ['NIBRSClearanceID']: '', });
                setErrors({ ...errors, ['OccuredError']: '', ['ExceptionalClearaceError']: '', ['NIBRSclearancedateError']: '', });

            }
            else if (name === 'FBIID') {
                setChangesStatus(true);
                setValue({ ...value, [name]: e.value, ['RMSCFSCodeID']: '', });
                setErrors({ ...errors, ['OccuredError']: '', });
            }
            else if (name === 'NIBRSClearanceID') {
                setChangesStatus(true); setExClsDateCode(e.id);
                if (e.id != 'N') {
                    setValue({ ...value, [name]: e.value, ['NIBRSclearancedate']: getShowingMonthDateYear(datezone), });
                    setErrors({ ...errors, ['OccuredError']: '', ['NIBRSclearancedateError']: '', });
                }
                else {
                    setChangesStatus(true)
                    setValue({ ...value, [name]: e.value, ['NIBRSclearancedate']: '', });
                    setErrors({ ...errors, ['OccuredError']: '', ['NIBRSclearancedateError']: '', });
                }
            } else {
                setChangesStatus(true); setValue({ ...value, [name]: e.value, })
            }
        } else if (e === null) {
            setChangesStatus(true)
            if (name === "RMSDispositionId") {
                setValue({ ...value, [name]: null, ['NIBRSClearanceID']: null, ['NIBRSclearancedate']: '', });
                setClsDrpCode(''); setExClsDateCode('');
                setErrors({ ...errors, ['OccuredError']: '', ['ExceptionalClearaceError']: '', ['NIBRSclearancedateError']: "" });

            }
            else if (name === 'FBIID') {
                setChangesStatus(true);
                setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeID']: "", });

            }
            else if (name === 'NIBRSClearanceID') {
                setChangesStatus(true); setExClsDateCode('');
                setValue({ ...value, [name]: null, ['NIBRSclearancedate']: "", });
                setErrors({ ...errors, ['ExceptionalClearaceError']: "", ['NIBRSclearancedateError']: "" });

            }
            else {
                setChangesStatus(true); setValue({ ...value, [name]: null });

            }
        } else {
            setChangesStatus(true); setValue({ ...value, [name]: null });
        }
    }

    const AddIncident = async () => {
        const {
            IncidentID, ReportedDate, OccurredFrom, OccurredTo, BIBRSDate, FinishedDate, DispositionDate, NIBRSclearancedate, IncidentNumber, CrimeLocation,
            DispositionComments, AgencyName, RMSCFSCodeID, NIBRSClearanceID, RMSDispositionId, ReceiveSourceID, CADCFSCodeID, CADDispositionId, AgencyID, IsVerify, crimelocationid, FBIID, IsIncidentCode, DispatchedDate, ArrivedDate, DirectionPrefix, Street, DirectionSufix, TypeSufix, City, State, ZipCode, PremiseNo, ApartmentNo, CommonPlace, ApartmentType, Street_Parse, PremiseNo_Parse, DirectionPrefix_Parse, TypeSuffix_Parse, DirectionSuffix_Parse, ZipCodeID, CityID, IsUsLocation, CountryID, Country, point_of_interest, neighborhood, subpremise, OffenseType, OffenseTypeID, CADIncidentNumber, MasterIncidentNumber, premise, CreatedByUserFK, ModifiedByUserFK, IsCargoTheftInvolved, InitAdjust, AttempComp
        } = value
        const val = {
            'IncidentID': IncidentID, 'ReportedDate': ReportedDate, 'OccurredFrom': OccurredFrom, 'OccurredTo': OccurredTo, 'BIBRSDate': BIBRSDate, 'FinishedDate': FinishedDate, 'DispositionDate': DispositionDate, 'NIBRSclearancedate': NIBRSclearancedate, 'IncidentNumber': IncidentNumber, 'CrimeLocation': CrimeLocation, 'DispositionComments': DispositionComments, 'AgencyName': AgencyName, 'RMSCFSCodeID': RMSCFSCodeID, 'NIBRSClearanceID': NIBRSClearanceID, 'RMSDispositionId': RMSDispositionId ? RMSDispositionId : 16, 'ReceiveSourceID': ReceiveSourceID, 'CADCFSCodeID': CADCFSCodeID, 'CADDispositionId': CADDispositionId, 'AgencyID': loginAgencyID, 'IsVerify': IsVerify, 'crimelocationid': crimelocationid, 'FBIID': FBIID, 'IsIncidentCode': IsIncidentCode, 'DispatchedDate': DispatchedDate, 'ArrivedDate': ArrivedDate, 'DirectionPrefix': DirectionPrefix, 'Street': Street, 'DirectionSufix': DirectionSufix, 'CADIncidentNumber': CADIncidentNumber, 'MasterIncidentNumber': MasterIncidentNumber, 'TypeSufix': TypeSufix, 'City': City, 'State': State, 'ZipCode': ZipCode, 'PremiseNo': PremiseNo, 'ApartmentNo': ApartmentNo, 'CommonPlace': CommonPlace, 'ApartmentType': ApartmentType, 'Street_Parse': Street_Parse, 'PremiseNo_Parse': PremiseNo_Parse, 'DirectionPrefix_Parse': DirectionPrefix_Parse,
            'TypeSuffix_Parse': TypeSuffix_Parse, 'DirectionSuffix_Parse': DirectionSuffix_Parse, 'ZipCodeID': ZipCodeID, 'CityID': CityID, 'IsUsLocation': IsUsLocation, 'CountryID': CountryID, 'Country': Country, 'point_of_interest': point_of_interest, 'neighborhood': neighborhood, 'subpremise': subpremise, 'premise': premise, 'OffenseType': OffenseType, 'OffenseTypeID': OffenseTypeID, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': '',
            'IsCargoTheftInvolved': IsCargoTheftInvolved, 'InitAdjust': InitAdjust, 'AttempComp': AttempComp
        }
        AddDeleteUpadate('Incident/IncidentInsert', val).then((res) => {
            if (res.success) {
                if (res.IncidentID) {
                    get_IncidentTab_Count(parseInt(res?.IncidentID), loginPinID); GetEditData(parseInt(res?.IncidentID));
                    setIncidentID(parseInt(res?.IncidentID)); setChangesStatus(false); setStatesChangeStatus(false); toastifySuccess(res?.Message);
                    // validateIncSideBar
                    validate_IncSideBar(res?.IncidentID, res?.IncidentNumber, loginAgencyID);
                }
                navigate(`/Inc-Home?IncId=${stringToBase64(res?.IncidentID?.trim())}&IncNo=${res?.IncidentNumber?.trim()}&IncSta=${true}&narrativeId=${narrativeId}`);
                setErrors({ ...errors, ['OccuredError']: '', ['IncNumberError']: '', ['NIBRSclearancedateError']: '', });
            } else {
                toastifyError("Error"); setErrors({ ...errors, ['OccuredError']: '', ['IncNumberError']: '', ['NIBRSclearancedateError']: '', });
            }
        })
    }

    const UpdateIncident = () => {
        AddDeleteUpadate('Incident/IncidentUpdate', value).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); get_IncidentTab_Count(incidentID, loginPinID); setChangesStatus(false);
            setStatesChangeStatus(false);
            GetEditData(IncID);
            nibrsValidateInc(IncID);
            // validateIncSideBar
            validate_IncSideBar(IncID, IncNo, loginAgencyID);
            setErrors({ ...errors, ['OccuredError']: '', ['ExceptionalClearaceError']: '', });
        })
    }

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
        }
    };

    const OnChangeCargoTheft = (e, name) => {
        setStatesChangeStatus(true); setChangesStatus(true);

        if (e) {
            setValue({ ...value, [name]: e.value });
        } else {
            setValue({ ...value, [name]: null });
        }
    }

    const getExceptionColorCode = (code, value) => {
        if (code === "01") {
            return !value ? nibrscolourStyles : nibSuccessStyles
        } else {
            return customStylesWithOutColor
        }
    }

    useEffect(() => {
        if (incidentClick && IncID && loginAgencyID) {
            nibrsValidateInc(IncID);
        }
    }, [incidentClick, IncID, loginAgencyID]);

    // validate property/vehicle
    const nibrsValidateInc = async (incidentID) => {
        try {
            const [incidentError] = await Promise.all([
                fetchPostDataNibrs('NIBRS/GetIncidentNIBRSError', { 'StrIncidentID': incidentID, 'StrIncidentNumber': IncNo, 'StrAgencyID': loginAgencyID }),
            ])

            if (incidentError?.Incident) {
                const incObj = incidentError?.Incident ? incidentError?.Incident : [];
                // console.log("🚀 ~ nibrsValidateInc ~ incObj:", incObj)

            } else {

            }

        } catch (error) {
            console.log("🚀 ~ ValidateProperty ~ error:", error);

        }
    }

    const YesNoArr = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ]

    const nibSuccessStyles = {
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

    const colourStylesEC = {
        control: (styles) => ({
            ...styles,
            backgroundColor: exClsDateCode === 'N' || exClsDateCode === 'A' || exClsDateCode === 'B' || exClsDateCode === 'C' || exClsDateCode === 'D' || exClsDateCode === 'E' ? "#fce9bf" : "rgb(255 202 194)",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

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


    return (
        loder ?
            <>
                <div className="col-12">
                    <div className="row">
                        <div className="col-4 col-md-4 col-lg-3 mt-2">
                            <label htmlFor="" className='new-label'>Incident #{errors.IncNumberError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.IncNumberError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-7 pl-1 col-md-7 col-lg-3  mt-1 ">
                            <input
                                type="text"
                                name='IncidentNumber'
                                id='IncidentNumber'
                                maxLength={20}
                                className={`form-control  py-1 new-input ${incidentID ? 'readonly' : 'requiredColor'}`}
                                readOnly={incidentID ? 'readonly' : ''}
                                disabled={incidentID ? 'readonly' : ''}
                                value={value.IncidentNumber}
                            />
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-2">
                            <label htmlFor="" className='new-label'>Reported Date/Time{errors.OccuredError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OccuredError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-9 col-md-9 col-lg-3">
                            {
                                incidentID && (IncSta === true || IncSta === 'true') ?
                                    <DatePicker
                                        ref={startRef}
                                        onKeyDown={onKeyDown}
                                        id="ReportedDate"
                                        name='ReportedDate'
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        onChange={(date) => {
                                            setStatesChangeStatus(true); setChangesStatus(true);
                                            const maxTime = datezone ? new Date(datezone) : null;
                                            if (date && maxTime) {
                                                const selectedDate = new Date(date);
                                                if (selectedDate.getTime() > maxTime.getTime()) {
                                                    selectedDate.setHours(maxTime.getHours());
                                                    selectedDate.setMinutes(maxTime.getMinutes());
                                                    selectedDate.setSeconds(maxTime.getSeconds());
                                                }
                                                setReportedDate(selectedDate);
                                                setValue({
                                                    ...value,
                                                    ['ReportedDate']: getShowingMonthDateYear(selectedDate), ['OccurredFrom']: null, ['OccurredTo']: null, ['NIBRSclearancedate']: null
                                                });

                                            }
                                            else {
                                                setReportedDate(date);

                                                setValue({
                                                    ...value,
                                                    ['ReportedDate']: date ? getShowingMonthDateYear(date) : null,
                                                    ['OccurredFrom']: null,
                                                    ['OccurredTo']: null,
                                                    ['NIBRSclearancedate']: null
                                                });
                                            }
                                        }}
                                        maxDate={datezone ? new Date(datezone) : null}
                                        filterTime={(date) => filterPassedTimeZone(date, datezone)}
                                        selected={reportedDate}
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        showDisabledMonthNavigation
                                        autoComplete='off'
                                        timeFormat="HH:mm "
                                        is24Hour
                                        minDate={new Date(1991, 0, 1)}
                                        // className='requiredColor'
                                        className={"readonlyColor"}
                                        disabled={true}
                                    />
                                    :
                                    <DatePicker
                                        ref={startRef}
                                        onKeyDown={onKeyDown}
                                        id="ReportedDate"
                                        name='ReportedDate'
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        onChange={(date) => {
                                            setStatesChangeStatus(true); setChangesStatus(true);
                                            const maxTime = datezone ? new Date(datezone) : null;
                                            if (date && maxTime) {

                                                const selectedDate = new Date(date);
                                                if (selectedDate.getTime() > maxTime.getTime()) {
                                                    selectedDate.setHours(maxTime.getHours());
                                                    selectedDate.setMinutes(maxTime.getMinutes());
                                                    selectedDate.setSeconds(maxTime.getSeconds());
                                                }
                                                setReportedDate(selectedDate);

                                                setValue({
                                                    ...value,
                                                    ['ReportedDate']: getShowingMonthDateYear(selectedDate),
                                                    ['OccurredFrom']: null,
                                                    ['OccurredTo']: null,
                                                    ['NIBRSclearancedate']: null
                                                });
                                            }
                                            else {
                                                setReportedDate(date);
                                                setValue({ ...value, ['ReportedDate']: date ? getShowingMonthDateYear(date) : null, ['BIBRSDate']: date ? getShowingMonthDateYear(date) : null, ['OccurredFrom']: null, ['OccurredTo']: null, ['NIBRSclearancedate']: null });
                                            }
                                        }}
                                        maxDate={datezone ? new Date(datezone) : null}
                                        filterTime={(date) => filterPassedTimeZone(date, datezone)}
                                        selected={reportedDate}
                                        // className='requiredColor'
                                        className={"readonlyColor"}
                                        disabled={true}
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        showDisabledMonthNavigation
                                        autoComplete='off'
                                        timeFormat="HH:mm "
                                        is24Hour
                                        minDate={new Date(1991, 0, 1)}
                                    />
                            }
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                            <span data-toggle="modal" data-target="#ListModel" onClick={() => { setOpenPage('Incident Disposition') }} className='new-link '>
                                Exceptional Clearance (Yes/No)
                            </span>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                            <Select
                                name='RMSDispositionId'
                                value={rmsDispositionDrpData?.find(obj => obj.value === (value?.RMSDispositionId || 16))}
                                isClearable={false}
                                options={rmsDispositionDrpData}
                                onChange={(e) => ChangeDropDown(e, 'RMSDispositionId')}
                                placeholder="Select..."

                                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.RMSDispositionId, isLocked) || adultArrestStatus}
                                styles={isLockOrRestrictModule("Lock", editval[0]?.RMSDispositionId, isLocked) ? LockFildscolour : Requiredcolour}
                            // isDisabled={adultArrestStatus}
                            // styles={Requiredcolour}

                            />
                        </div>
                        {
                            carboTheft && (
                                <>
                                    <div className="col-2 col-md-2 col-lg-3 mt-2 pt-1">
                                        <span className="new-label">
                                            Did the incident involve Cargo theft
                                            {errors.CargoTheftError !== "true" ? (
                                                <p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }} > {errors.CargoTheftError}</p>
                                            ) : null}
                                        </span>
                                    </div>
                                    <div className="col-6  col-md-6 col-lg-3 mt-1 " >
                                        {
                                            incidentErrorStatus && (
                                                <div className="nibrs-tooltip-error" style={{ left: "-30px" }}>
                                                    <div className="tooltip-arrow"></div>
                                                    <div className="tooltip-content">
                                                        <span className="text-danger">⚠️ {IncidentErrorString || ''}</span>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <Select
                                            name='IsCargoTheftInvolved'
                                            value={YesNoArr?.filter((obj) => obj.value === value?.IsCargoTheftInvolved)}
                                            options={YesNoArr}
                                            menuPlacement='bottom'
                                            isClearable={value?.IsCargoTheftInvolved ? true : false}
                                            onChange={(e) => OnChangeCargoTheft(e, 'IsCargoTheftInvolved')}
                                            placeholder="Select..."

                                            isDisabled={isLockOrRestrictModule("Lock", editval[0]?.IsCargoTheftInvolved, isLocked)}
                                            styles={isLockOrRestrictModule("Lock", editval[0]?.IsCargoTheftInvolved, isLocked) ? LockFildscolour : value?.IsCargoTheftInvolved || value?.IsCargoTheftInvolved === false ? nibSuccessStyles : nibrscolourStyles}
                                        // styles={value?.IsCargoTheftInvolved || value?.IsCargoTheftInvolved === false ? nibSuccessStyles : nibrscolourStyles}
                                        />
                                    </div>
                                </>
                            )
                        }
                        <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                            <span data-toggle="modal" data-target="#ListModel" className='new-link '>
                                <span onClick={() => { setOpenPage('Cleared Exceptionally') }}>Exceptional Clearance Code</span>
                                {errors.ExceptionalClearaceError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ExceptionalClearaceError}</p>
                                ) : null}
                            </span>
                        </div>
                        <div className="col-9 col-md-9 col-lg-3 mt-2 ">
                            <Select
                                name='NIBRSClearanceID'
                                value={exceptionalClearID?.filter((obj) => obj.value === value?.NIBRSClearanceID)}
                                isClearable
                                options={exceptionalClearID}
                                onChange={(e) => ChangeDropDown(e, 'NIBRSClearanceID')}
                                placeholder="Select..."

                                styles={isLockOrRestrictModule("Lock", editval[0]?.NIBRSClearanceID, isLocked) ? LockFildscolour : getExceptionColorCode(clsDrpCode, value?.NIBRSClearanceID)}
                                isDisabled={clsDrpCode === '02' || isLockOrRestrictModule("Lock", editval[0]?.NIBRSClearanceID, isLocked) ? true : false}

                            // styles={getExceptionColorCode(clsDrpCode, value?.NIBRSClearanceID)}
                            // isDisabled={clsDrpCode === '02' ? true : false}

                            />
                        </div>
                        <div className="col-5 col-md-5 col-lg-3 mt-2 pt-1">
                            <label htmlFor="" className='new-label '>Exceptional Clearance Date/Time   {errors.NIBRSclearancedateError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.NIBRSclearancedateError}</p>
                            ) : null}</label>
                        </div>
                        <div className='col-7  col-md-7 col-lg-3 mt-2'>
                            <DatePicker
                                name='NIBRSclearancedate'
                                id='NIBRSclearancedate'

                                onChange={(date) => {
                                    if (date) {
                                        setStatesChangeStatus(true);
                                        setChangesStatus(true);
                                        if (date > new Date(datezone)) {
                                            date = new Date(datezone);
                                        }
                                        const maxDate = new Date(datezone);
                                        maxDate.setHours(23, 59, 59, 999);
                                        if (date >= new Date()) {
                                            setValue({
                                                ...value,
                                                ["NIBRSclearancedate"]: new Date()
                                                    ? getShowingDateText(new Date())
                                                    : null,
                                            });
                                        } else if (date <= reportedDate) {
                                            setValue({
                                                ...value,
                                                ["NIBRSclearancedate"]: reportedDate
                                                    ? getShowingDateText(reportedDate)
                                                    : null,
                                            });
                                        } else {
                                            if (date.getTime() === maxDate.getTime()) {
                                                setValue({
                                                    ...value,
                                                    ["NIBRSclearancedate"]: getShowingDateText(maxDate),
                                                });
                                            } else {
                                                setValue({
                                                    ...value,
                                                    ["NIBRSclearancedate"]: date
                                                        ? getShowingDateText(date)
                                                        : null,
                                                });
                                            }
                                        }
                                    } else {
                                        setStatesChangeStatus(true);
                                        setChangesStatus(true);
                                        setValue({ ...value, ["NIBRSclearancedate"]: null });
                                    }
                                }}
                                ref={startRef4}
                                onKeyDown={(e) => {
                                    if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                        e.preventDefault();
                                    } else {
                                        onKeyDown(e);
                                    }
                                }}
                                selected={value?.NIBRSclearancedate && new Date(value?.NIBRSclearancedate)}
                                placeholderText={value?.NIBRSclearancedate ? value?.NIBRSclearancedate : 'Select...'}
                                dateFormat="MM/dd/yyyy HH:mm"
                                timeFormat="HH:mm "
                                is24Hour
                                timeInputLabel
                                isClearable={value?.NIBRSclearancedate ? true : false}
                                autoComplete='Off'
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                showTimeSelect
                                timeIntervals={1}
                                minDate={reportedDate}
                                maxDate={new Date(datezone)}
                                filterTime={(date) => filterPassedTimeZoneException(date, datezone, reportedDate)}

                                className={isLockOrRestrictModule("Lock", editval[0]?.NIBRSclearancedate, isLocked) ? 'LockFildsColor' : clsDrpCode === '01' ? value?.NIBRSclearancedate ? 'nibrsSuccessColor' : 'nibrsColor' : 'readonlyColor'}
                                disabled={isLockOrRestrictModule("Lock", editval[0]?.NIBRSclearancedate, isLocked) ? true : value?.NIBRSClearanceID && exClsDateCode !== 'N' ? false : true}

                            // className={clsDrpCode === '01' ? value?.NIBRSclearancedate ? 'nibrsSuccessColor' : 'nibrsColor' : 'readonlyColor'}
                            // disabled={value?.NIBRSClearanceID && exClsDateCode !== 'N' ? false : true}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12  mt-3 d-flex justify-content-between">
                    {
                        isNibrsSummited ?
                            <>
                            </>
                            :
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        nibrsValidateInc(incidentID);
                                    }}
                                    className={`btn text-white btn-sm mt-2`}
                                    style={{
                                        backgroundColor: `${incidentErrorStatus ? 'red' : 'teal'}`,
                                    }}
                                >
                                    Validate TIBRS Incident
                                </button>
                                <div>
                                    {
                                        (IncSta === true || IncSta === 'true') && nibrsSubmittedAdministartive !== 1 ?
                                            <>
                                                <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }} > Update </button>
                                            </>
                                            :
                                            <>
                                            </>
                                    }
                                </div>
                            </>
                    }
                </div>
                <ChangesModal func={check_Validation_Error} />
                <ListModal {...{ openPage, setOpenPage }} />
                {/* <NirbsAllModuleErrorShowModal
                    nibErrModalStatus={nibrsErrModalStatus}
                    setNibrsErrModalStatus={setNibrsErrModalStatus}
                    nibrsValidateloder={nibrsValidateloder}
                    administrativeErrorString={administrativeErrorString}
                    offenseErrorString={offenseErrorString}
                    victimErrorString={victimErrorString}
                    offenderErrorString={offenderErrorString}
                    propertyErrorString={propertyErrorString}
                    vehicleErrorString={vehicleErrorString}
                /> */}
                {/* <NirbsErrorShowModal
                    ErrorText={nibIncScreen ? incValidateErrStr : incAllModuleValidateErrStr}
                    nibErrModalStatus={nibrsErrModalStatus}
                    setNibrsErrModalStatus={setNibrsErrModalStatus}
                    nibrsValidateloder={nibrsValidateloder}
                    OffenseState={OffenseState}
                    offenseClick={offenseClick}
                /> */}
            </>
            :
            <Loader />
    )
}

export default IncidentHome

const Get_Exceptional_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.RMSDispositionId));
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor?.value === result[0]) {
            return { value: result[0], label: sponsor?.label, id: sponsor?.id }
        }
    });
    const val = result2?.filter(function (element) { return element !== undefined; });
    return val ? val[0]?.id : null;
}

const Get_OffenseType_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.OffenseTypeID))

    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })

    const val = result2?.filter(function (element) {
        return element !== undefined;
    });
    return val ? val[0]?.id : null;
}

const Get_ExClsDate_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.NIBRSClearanceID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2?.filter(function (element) {
        return element !== undefined;
    });
    return val ? val[0]?.id : null;
}

export const changeArrayFormat = (data, type) => {
    if (type === 'zip') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.zipId, label: sponsor.Zipcode })
        )
        return result
    }
    if (type === 'state') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.StateID, label: sponsor.StateName })
        )
        return result
    }
    if (type === 'city') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.CityID, label: sponsor.CityName })
        );
        return result
    }

    if (type === 'RmsCfsID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.RMSCFSCodeID, label: sponsor.RMSCFSCode })
        )
        return result
    }
    if (type === 'RmsDisposition') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.IncidentDispositionsID, label: sponsor.RMSDispositionCode })
        )
        return result
    }
    if (type === 'ExceptionClearID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ClearanceID, label: sponsor.ClearanceCode })
        )
        return result
    }
    if (type === 'ReciveSrcID') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.ReceiveSourceID, label: sponsor.ReceiveSourceCode })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, DropDownValue) => {
    if (DropDownValue) {
        if (type === 'CADCFSCodeID') {
            const result = data?.map((sponsor) =>
                (sponsor.CADCFSCodeID)
            )
            const result2 = DropDownValue?.map((sponsor) => {
                if (sponsor.value === result[0]) {
                    return { value: result[0], label: sponsor.label }
                }
            }
            )
            const val = result2?.filter(function (element) {
                return element !== undefined;
            });
            return val ? val[0] : null
        }
    }
}
