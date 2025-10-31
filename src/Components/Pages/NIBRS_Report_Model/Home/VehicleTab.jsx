import React, { useState, useEffect, useContext } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../Common/Loader';
import NirbsErrorShowModal from '../../../Common/NirbsErrorShowModal';
import { Carousel } from 'react-responsive-carousel';
import BarCode from '../../../Common/BarCode';
import AlertTable from '../../AlertMaster/AlertTable';
import { get_Vehicle_Search_Data } from '../../../../redux/actions/VehicleAction';
import VehicleSearchTab from '../../VehicleSearchTab/VehicleSearchTab';
import AlertMasterModel from '../../AlertMaster/AlertMasterModel';
import ImageModel from '../../ImageModel/ImageModel';
import MasterNameModel from '../../MasterNameModel/MasterNameModel';
import ListModal from '../../Utility/ListManagementModel/ListModal';
import { get_ModalId_Drp_Data, get_Classification_Drp_Data, get_PlateType_Drp_Data, get_State_Drp_Data, get_VehicleLossCode_Drp_Data, get_Masters_Name_Drp_Data, get_Masters_PossessionOwnerData } from '../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import { MasterVehicle_ID, Vehicle_ID, Master_Property_Status, Classification_Drp_Data, Master_Vehicle_Status } from '../../../../redux/actionTypes';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../redux/actions/Agency';
import ChangesModal from '../../../Common/ChangesModal';
import DeletePopUpModal from '../../../Common/DeleteModal';
import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { threeColArray } from '../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData, fetchPostDataNibrs, } from '../../../hooks/Api';
import { Decrypt_Id_Name, Encrypted_Id_Name, Requiredcolour, base64ToString, filterPassedTimeZone, filterPassedTimeZonesProperty, getShowingDateText, getShowingMonthDateYear, getYearWithOutDateTime, stringToBase64, tableCustomStyles } from '../../../Common/Utility';

const VehicleTab = ({ isCADSearch = false, isCad = false, vehicleClick, isNibrsSummited = false, }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const classificationID = useSelector((state) => state.DropDown.classificationDrpData);
    const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData);
    const stateList = useSelector((state) => state.DropDown.stateDrpData);
    const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let DecVehId = 0, DecMVehId = 0
    let MstVehicle = query?.get('page');
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var VehId = query?.get("VehId");
    var MVehId = query?.get('MVehId');
    var VehSta = query?.get('VehSta');

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!VehId) VehId = 0;
    else DecVehId = parseInt(base64ToString(VehId));
    if (!MVehId) VehId = 0;
    else DecMVehId = parseInt(base64ToString(MVehId));

    const { get_vehicle_Count, get_Incident_Count, updateCount, setUpdateCount, changesStatus, nibrsSubmittedVehicle, setnibrsSubmittedVehicle, changesStatusCount, setChangesStatus, setVehicleStatus, vehicleStatus, VehicleFilterData, get_Data_Vehicle, get_Name_Count, datezone, GetDataTimeZone, setcountoffaduit, validate_IncSideBar } = useContext(AgencyContext)


    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [categoryCode, setCategoryCode] = useState('');
    const [plateTypeCode, setPlateTypeCode] = useState('');
    const [lossCode, setLossCode] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [editval, setEditval] = useState();
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [vehicleID, setVehicleID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');

    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    // nibrs
    const [baseDate, setBaseDate] = useState('');
    const [oriNumber, setOriNumber] = useState('');
    const [nibrsValidateData, setnibrsValidateData] = useState([]);
    const [nibrsErrStr, setNibrsErrStr] = useState('');
    const [clickNibloder, setclickNibLoder] = useState(false);
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [vehErrorStatus] = useState(false);
    const [showLossCodeError, setShowLossCodeError] = useState({});
    const [nibrsFieldError, setnibrsFieldError] = useState({});


    const [value, setValue] = useState({
        'IncidentID': '', 'VehicleID': '', 'PropertyID': '', 'MasterPropertyID': '', 'CreatedByUserFK': '',
        'VehicleNumber': 'Auto Generated', 'ReportedDtTm': '', 'LossCodeID': null, 'CategoryID': null, 'PlateID': null,
        'VehicleNo': '', 'PlateTypeID': null, 'ClassificationID': '', 'IsSendToPropertyRoom': '', 'VIN': '', 'VODID': '', 'PlateExpireDtTm': '',
        'OANID': '', 'StyleID': '', 'MakeID': null, 'ModelID': null, 'ManufactureYear': '', 'Weight': '', 'OwnerID': null,
        'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '',
        'PrimaryOfficerID': null, 'InProfessionOf': '', 'TagID': null, 'NICBID': null, 'DestroyDtTm': '', 'Description': '',
        'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '',
        'ModifiedByUserFK': "", 'ArrestID': "", 'AgencyID': '', 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false,
    })

    const [errors, setErrors] = useState({
        'LossCodeIDError': '', 'CategoryIDError': '', 'RecoveryTypeIDError': '', 'PlateTypeIDError': '', 'VehicleNoError': '', 'vinLengthError': '', 'PlateStateNoError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("V081", localStoreData?.AgencyID, localStoreData?.PINID));
            get_Incident_Count(IncID, localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID);
            setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null);
            setOriNumber(localStoreData?.ORI);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (IncID) {
            setMainIncidentID(IncID);
            get_Data_Vehicle(IncID);
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }

        }
    }, [IncID, loginPinID]);

    useEffect(() => {
        if (loginAgencyID) {
            const defaultDate = datezone ? new Date(datezone) : null;
            setValue({
                ...value,
                'IncidentID': IncID, 'OfficerID': loginPinID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID,
                'PrimaryOfficerID': loginPinID,
                'ReportedDtTm': (MstVehicle !== "MST-Vehicle-Dash" ? (incReportedDate ? getShowingDateText(incReportedDate) : defaultDate) : defaultDate)
            });
            PropertyType(loginAgencyID);
        }
    }, [loginAgencyID, incReportedDate, datezone]);

    useEffect(() => {
        if (DecVehId || DecMVehId) {
            setVehicleID(DecVehId); GetSingleData(DecVehId, DecMVehId);
            setMasterPropertyID(DecMVehId);
            MstVehicle == 'MST-Vehicle-Dash' ? get_vehicle_Count(0, DecMVehId) : get_vehicle_Count(DecVehId, DecMVehId)
        } else {
            reset();
        }
    }, [DecVehId, DecMVehId,]);

    useEffect(() => {
        if (loginAgencyID) {
            if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(loginAgencyID)) };
            if (stateList?.length === 0) { dispatch(get_State_Drp_Data()) };
            if (plateTypeIdDrp?.length === 0) { dispatch(get_PlateType_Drp_Data(loginAgencyID)) };
            PropertyType(loginAgencyID);
        }
    }, [loginAgencyID])

    const check_Validation_Error = (e) => {
        const LossCodeIDErr = RequiredFieldIncident(value.LossCodeID);
        const CategoryIDErr = RequiredFieldIncident(value.CategoryID);
        const PlateTypeIDErr = RequiredFieldIncident(value.PlateTypeID);
        const VehicleNoErr = value.PlateID == '' || value.PlateID === null ? 'true' : RequiredFieldIncident(value.VehicleNo)
        const PlateStateNoErr = categoryCode === "NMVs" || plateTypeCode === "Unknown" ? 'true' : RequiredFieldIncident(value.PlateID);
        const ContactErr = lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? RequiredFieldOnConditon(value.Value) : 'true';
        const vinErr = value?.VIN.length > 0 && value?.VIN.length < 17 ? "Enter Minimum 17 Characters" : 'true';
        setErrors(pre => {
            return {
                ...pre,
                ['LossCodeIDError']: LossCodeIDErr || pre['LossCodeIDError'],
                ['CategoryIDError']: CategoryIDErr || pre['CategoryIDError'],
                ['PlateTypeIDError']: PlateTypeIDErr || pre['PlateTypeIDError'],
                ['PlateStateNoError']: PlateStateNoErr || pre['PlateStateNoError'],
                ['ContactError']: ContactErr || pre['ContactError'],
                ['VehicleNoError']: VehicleNoErr || pre['VehicleNoError'],
                ['vinLengthError']: vinErr || pre['vinLengthError'],
            }
        });
    }

    // Check All Field Format is True Then Submit 
    const { LossCodeIDError, CategoryIDError, RecoveryTypeIDError, PlateTypeIDError, PlateStateNoError, ContactError, VehicleNoError, vinLengthError } = errors

    useEffect(() => {
        if (LossCodeIDError === 'true' && CategoryIDError === 'true' && PlateTypeIDError === 'true' && PlateStateNoError === 'true' && ContactError === 'true' && VehicleNoError === 'true' && vinLengthError === 'true') {
            if (MstVehicle === 'MST-Vehicle-Dash') {
                if (masterPropertyID) { Update_Vehicle(); }
                else { Insert_Vehicle(); }
            } else {
                if (vehicleID && (VehSta === "true" || VehSta === true)) {
                    Update_Vehicle();
                    return;
                } else { Insert_Vehicle(); return; }
            }
        }
    }, [LossCodeIDError, CategoryIDError, RecoveryTypeIDError, PlateTypeIDError, PlateStateNoError, ContactError, VehicleNoError, vinLengthError])

    const GetSingleData = (vehicleID, masterPropertyID) => {
        const val = { 'PropertyID': 0, 'MasterPropertyID': masterPropertyID, 'IsMaster': true, 'PINID': loginPinID }
        const val1 = { 'PropertyID': vehicleID, 'MasterPropertyID': 0, 'IsMaster': false, 'PINID': loginPinID }

        fetchPostData('PropertyVehicle/GetSingleData_PropertyVehicle', MstVehicle === "MST-Vehicle-Dash" ? val : val1).then((res) => {
            if (res.length > 0) {
                setVehicleStatus(true)
                setEditval(res);
            } else { setEditval([]) }
        })
    }

    useEffect(() => {
        if (editval) {

            setcountoffaduit(true)
            dispatch(get_Classification_Drp_Data(editval[0]?.CategoryID));
            setCategoryCode(getCategoryCode(editval, categoryIdDrp));

            dispatch({ type: MasterVehicle_ID, payload: editval[0]?.MasterPropertyID });
            dispatch({ type: Vehicle_ID, payload: MstVehicle === 'MST-Vehicle-Dash' ? '' : editval[0]?.VehicleID });
            sessionStorage.setItem("vehicleStolenValue", Encrypted_Id_Name(editval[0]?.Value, 'VForVehicleStolenValue'));
            setValue({
                ...value,
                'LossCodeID': editval[0]?.LossCodeID,

                'NICBID': editval[0]?.NICBID, 'TagID': editval[0]?.TagID, 'PrimaryOfficerID': editval[0]?.PrimaryOfficerID, 'SecondaryColorID': editval[0]?.SecondaryColorID,
                'PrimaryColorID': editval[0]?.PrimaryColorID, 'OwnerID': editval[0]?.OwnerID, 'ModelID': editval[0]?.ModelID, 'MakeID': editval[0]?.MakeID, 'StyleID': editval[0]?.StyleID, 'OANID': editval[0]?.OANID, 'VODID': editval[0]?.VODID,
                'ClassificationID': editval[0]?.ClassificationID, 'PlateTypeID': editval[0]?.PlateTypeID, 'PlateID': editval[0]?.PlateID ? editval[0]?.PlateID : '', 'CategoryID': editval[0]?.CategoryID, 'VehicleNumber': editval[0]?.VehicleNumber,
                'ReportedDtTm': editval[0]?.ReportedDtTm ? getShowingDateText(editval[0]?.ReportedDtTm) : '',
                'IsEligibleForImmobalization': editval[0]?.IsEligibleForImmobalization, 'IsImmobalizationDevice': editval[0]?.IsImmobalizationDevice, 'IsPropertyRecovered': editval[0]?.IsPropertyRecovered,
                'IsEvidence': editval[0]?.IsEvidence, 'InProfessionOf': editval[0]?.InProfessionOf, 'Description': editval[0]?.Description, 'DestroyDtTm': editval[0]?.DestroyDtTm, 'InspectionExpiresDtTm': editval[0]?.InspectionExpiresDtTm,
                'Inspection_Sticker': editval[0]?.Inspection_Sticker, 'Weight': editval[0]?.Weight, 'ManufactureYear': editval[0]?.ManufactureYear,
                'VIN': editval[0]?.VIN ? editval[0]?.VIN : '', 'VehicleNo': editval[0]?.VehicleNo, 'PlateExpireDtTm': editval[0]?.PlateExpireDtTm,
                'ModifiedByUserFK': loginPinID, 'PropertyID': editval[0]?.PropertyID, 'MasterPropertyID': editval[0]?.MasterPropertyID,
                'IsSendToPropertyRoom': editval[0]?.IsSendToPropertyRoom,
                'Value': editval[0]?.Value ? editval[0]?.Value : "",
            });

            setLossCode(Get_LossCode(editval, propertyLossCodeData));
            setnibrsSubmittedVehicle(editval[0]?.IsNIBRSSummited);
            setVehicleID(editval[0]?.PropertyID);
            setMasterPropertyID(editval[0]?.MasterPropertyID);

            // validate property
            if (editval[0]?.PropertyID) {
                NibrsErrorReturn(editval[0]?.PropertyID);
            }


        } else {
            setValue({
                ...value,
                'VehicleNumber': '', 'VehicleNo': '', 'PlateID': null, 'OANID': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '', 'AgencyID': loginAgencyID,
                'LossCodeID': null, 'CategoryID': null, 'PlateTypeID': null, 'ClassificationID': null,
                'VIN': '', 'VODID': '', 'PlateExpireDtTm': '', 'StyleID': '', 'MakeID': null, 'ModelID': null, 'ManufactureYear': '',
                'Weight': '', 'OwnerID': null, 'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '',
                'PrimaryOfficerID': null, 'InProfessionOf': '', 'TagID': null, 'NICBID': null, 'DestroyDtTm': '', 'Description': '',
                'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '',
            });

        }
    }, [editval, changesStatusCount])

    const PropertyType = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((data) => {
            if (data) {
                const res = data?.filter((val) => {
                    if (val.PropertyCategoryCode === "V") return val
                })
                if (res.length > 0) {
                    get_CategoryId_Drp(res[0]?.PropertyCategoryID)
                }
            }
        })
    }

    const get_CategoryId_Drp = (CategoryID) => {
        const val = { CategoryID: CategoryID }
        fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
            if (data) {
                setCategoryIdDrp(threeColArray(data, 'PropertyDescID', 'Description', 'PropDescCode'))
            } else {
                setCategoryIdDrp([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true); setChangesStatus(true)
        if (e) {
            if (name === 'MakeID') {
                dispatch(get_ModalId_Drp_Data(loginAgencyID, e.value))
                setValue({ ...value, ['MakeID']: e.value });

            } else if (name === 'CategoryID') {
                dispatch(get_Classification_Drp_Data(e.value));
                setCategoryCode(e.id);
                setPlateTypeCode("");
                setValue({ ...value, [name]: e.value, });

            } else if (name === 'PlateTypeID') {
                setPlateTypeCode(e.id);
                setValue({ ...value, [name]: e.value });

            } else {
                setValue({ ...value, [name]: e.value });

            }

        }
        else if (e === null) {
            if (name === 'CategoryID') {
                setValue({ ...value, ['CategoryID']: '', ['ClassificationID']: '', });
                setCategoryCode();
                setPlateTypeCode("");

                dispatch(get_Classification_Drp_Data(''));
                dispatch({ type: Classification_Drp_Data, payload: [] });

            } else if (name === 'MakeID') {
                setValue({ ...value, ['MakeID']: '', ['ModelID']: '' });

                dispatch(get_ModalId_Drp_Data(loginAgencyID, ''))
                setValue({ ...value, [name]: null });

            } else if (name === 'PlateTypeID') {
                setPlateTypeCode("");
                setValue({ ...value, [name]: null });

            } else {
                setValue({ ...value, [name]: null });

            }

        }
        else {
            setValue({ ...value, [name]: null });
        }
    }

    const HandleChanges = (e) => {
        setStatesChangeStatus(true);
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsImmobalizationDevice' || e.target.name === 'IsEligibleForImmobalization') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            });
            setChangesStatus(true);
        } else if (e.target.name === 'Value') {
            const ele = e.target.value.replace(/[^0-9\.]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
                        if (!checkDot) {
                            setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                            return;
                        } else {
                            return;
                        }
                    } else { setValue({ ...value, [e.target.name]: ele }) }
                }
            } else {
                setValue({ ...value, [e.target.name]: ele });
            }
            setChangesStatus(true)
        } else if (e.target.name === 'Weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true)
            setValue({ ...value, [e.target.name]: checkNumber })
        } else if (e.target.name === 'OANID' || e.target.name === 'VehicleNo') {
            var ele = e.target.value.replace(/[^0-9a-zA-Z]/g, "")
            const checkNumber = ele.toUpperCase();
            setChangesStatus(true)
            setValue({ ...value, [e.target.name]: checkNumber })

        }
        else if (e.target.name === 'VIN') {
            var ele = e.target.value.replace(/[^0-9a-zA-Z]+$/g, "")
            var eleIOQ = ele.replace(/[IOQ]/gi, '');
            const checkNumber = eleIOQ.toUpperCase();
            setChangesStatus(true)
            setValue({ ...value, [e.target.name]: checkNumber })
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            });
            setChangesStatus(true)
        }
    }

    const Insert_Vehicle = () => {
        AddDeleteUpadate('PropertyVehicle/Insert_PropertyVehicle', value).then((res) => {
            if (res.success) {
                navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(res?.PropertyID)}&MVehId=${stringToBase64(res?.MasterPropertyID)}&VehSta=${true}`)
                reset();
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['LossCodeIDError']: '' })
                get_Incident_Count(mainIncidentID, loginPinID);
                get_Data_Vehicle(mainIncidentID);
                setUpdateCount(updateCount + 1);
                PropertyType(loginAgencyID);
                setChangesStatus(false); setStatesChangeStatus(true);
                setMasterPropertyID(res?.MasterPropertyID);

                // Validate Vehicle 
             
                ValidateVehicle(mainIncidentID);
                NibrsErrorReturn(res?.PropertyID);
                // validateIncSideBar
                validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
            } else {
                toastifyError('Error');
                setErrors({ ...errors, ['LossCodeIDError']: '' });
            }
        })
    }

    const Update_Vehicle = () => {
        const previousValue = value.Value;
        AddDeleteUpadate('PropertyVehicle/Update_PropertyVehicle', value).then((res) => {
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                GetSingleData(vehicleID, masterPropertyID);
                setChangesStatus(false); setStatesChangeStatus(true);
                setUpdateCount(updateCount + 1);
                get_Data_Vehicle(mainIncidentID);
                setErrors({ ...errors, ['LossCodeIDError']: '' });
                setValue({ ...value, Value: previousValue, });

                // Validate Vehicle 
          
                ValidateVehicle(mainIncidentID);
                NibrsErrorReturn(vehicleID);
                // validateIncSideBar
                validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
            } else {
                toastifyError('Error');
                setErrors({ ...errors, ['LossCodeIDError']: '' });
            }
        })
    }

    const reset = () => {
        setValue({
            ...value,
            'VehicleNumber': '', 'LossCodeID': '', 'CategoryID': '', 'PlateID': '', 'VehicleNo': '', 'PlateTypeID': '', 'ClassificationID': '',
            'VIN': '', 'VODID': '', 'PlateExpireDtTm': '', 'OANID': '', 'StyleID': '', 'MakeID': '', 'ModelID': '', 'ManufactureYear': '',
            'Weight': '', 'OwnerID': '', 'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '',
            'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '', 'PrimaryOfficerID': '',
            'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '', 'IsSendToPropertyRoom': '',
            'ReportedDtTm': MstVehicle === "MST-Vehicle-Dash" ? getShowingMonthDateYear(new Date(datezone)) : incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()), "MasterPropertyID": '',
        })
        setErrors({
            ...errors,
            'LossCodeIDError': '', 'CategoryIDError': '', 'RecoveryTypeIDError': '', 'PlateTypeIDError': '', 'PlateStateNoError': '', 'VehicleNoError': '', 'ContactError': '', 'vinLengthError': ''
        })
        setChangesStatus(false)
        setMasterPropertyID('');
        dispatch({ type: MasterVehicle_ID, payload: '' });
        dispatch({ type: Classification_Drp_Data, payload: [] });
        setVehicleID(''); dispatch({ type: Vehicle_ID, payload: '' });

        setLossCode('');

        dispatch(get_Masters_Name_Drp_Data(''));
        dispatch(get_Masters_PossessionOwnerData(''));
        setnibrsSubmittedVehicle(0);

        setPlateTypeCode('');
        setCategoryCode('');
        setShowLossCodeError(false);
        setnibrsFieldError([]);

    }

    // Custom Style
    const WidhoutColorStyles = {
        control: (styles) => ({
            ...styles,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();

    const onKeyDown = (e) => {
        if (e.target.id === 'ReportedDate') {
            e.preventDefault();
        } else if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);

        }
    };

    const delete_Vehicle_Property = (e) => {
        const value = { 'PropertyID': vehicleID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false, }
        AddDeleteUpadate('PropertyVehicle/Delete_PropertyVehicle', value).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); newVehicle()
                get_Incident_Count(mainIncidentID, loginPinID);
                get_Data_Vehicle(mainIncidentID);
            } else {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
            }
        });
    }

    const ChangePhoneType = (e, name) => {
        setStatesChangeStatus(true);
        if (e) {
            if (name === 'LossCodeID') {
                setLossCode(e.id);
                setChangesStatus(true);
                setValue({ ...value, [name]: e.value, Value: '', });
            } else {
                setChangesStatus(true);
                setValue({ ...value, [name]: e.value, });
            }
        } else if (e === null) {
            if (name === 'LossCodeID') {
                setChangesStatus(true);
                setLossCode('');
                setValue({ ...value, [name]: null, Value: '', });
            }
        }
    };

    // const columnsdsds = [
    //     {
    //         name: 'Vehicle Number',
    //         selector: (row) => row.VehicleNumber,
    //         sortable: true
    //     },
    //     {
    //         name: 'Loss Code ',
    //         selector: (row) => row.LossCode_Description,
    //         sortable: true
    //     },
    //     {
    //         name: 'Category ',
    //         selector: (row) => row.Category_Description,
    //         sortable: true
    //     },
    //     {
    //         name: 'Classification ',
    //         selector: (row) => row.Classification_Description,
    //         sortable: true
    //     },
    //     {
    //         name: 'VIN ',
    //         selector: (row) => row.VIN,
    //         sortable: true
    //     },
    //     {
    //         name: 'Plate State/Number ',
    //         selector: (row) => row.PlateState,
    //         sortable: true
    //     },
    //     {
    //         width: '100px',
    //         name: 'View',

    //         cell: row =>
    //             <div style={{ position: 'absolute', top: 4, right: 30 }}>
    //                 {
    //                     getNibrsError(row.PropertyID, nibrsValidateData) ?
    //                         <span
    //                             onClick={(e) => { setErrString(row.PropertyID, nibrsValidateData) }}
    //                             className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
    //                             data-toggle="modal"
    //                             data-target="#NibrsErrorShowModal"
    //                         >
    //                             <i className="fa fa-eye"></i>
    //                         </span>
    //                         :
    //                         <></>
    //                 }
    //             </div>
    //     },
    //     {
    //         name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
    //         cell: row =>
    //             <div style={{ position: 'absolute', top: 4, right: 10 }}>
    //                 {
    //                     effectiveScreenPermission ?
    //                         effectiveScreenPermission[0]?.DeleteOK ?
    //                             <span onClick={(e) => { setVehicleID(row.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //                                 <i className="fa fa-trash"></i>
    //                             </span>
    //                             : <></>
    //                         :
    //                         <span onClick={(e) => { setVehicleID(row.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //                             <i className="fa fa-trash"></i>
    //                         </span>
    //                 }

    //             </div>
    //     }
    // ]

    const columns = [
        {
            name: 'Vehicle Number',
            selector: (row) => row.VehicleNumber,
            sortable: true
        },
        {
            name: 'Loss Code ',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            name: 'Plate State/Number ',
            selector: (row) => row.PlateState,
            sortable: true
        },
        {
            name: ' Make/Model ',
            selector: (row) => row.Model,
            sortable: true
        },
        {
            name: 'Primary Color',
            selector: (row) => row.Model,
            sortable: true
        },
        {
            name: 'Owner Name',
            selector: (row) => row.Owner,
            sortable: true
        },
        {
            name: 'Plate Expiration',
            selector: (row) => row.PlateExpireDtTm,
            sortable: true
        },
        {
            name: 'Manu.Year',
            selector: (row) => row.Manu,
            sortable: true
        },
        // {
        //     name: 'Evidence Flag ',
        //     selector: (row) => row.Evidence,
        //     sortable: true
        // },
        {
            name: 'Evidence Flag',
            selector: row => (
                <input type="checkbox" checked={row.Evidence === true} disabled />
            ),
            sortable: true
        },
        // {
        //     name: 'Classification ',
        //     selector: (row) => row.Classification_Description,
        //     sortable: true
        // },
        // {
        //     name: 'VIN ',
        //     selector: (row) => row.VIN,
        //     sortable: true
        // },
        {
            width: '100px',
            name: 'View',

            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 30 }}>
                    {
                        getNibrsError(row.PropertyID, nibrsValidateData) ?
                            <span
                                onClick={(e) => { setErrString(row.PropertyID, nibrsValidateData) }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                                data-toggle="modal"
                                data-target="#NibrsErrorShowModal"
                            >
                                <i className="fa fa-eye"></i>
                            </span>
                            :
                            <></>
                    }
                </div>
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={(e) => { setVehicleID(row.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            <span onClick={(e) => { setVehicleID(row.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>
        }
    ]

    const getNibrsError = (Id, nibrsValidateData) => {
        const arr = nibrsValidateData?.filter((item) => item?.PropertyID == Id);
        return arr?.[0]?.OnPageError;
    }

    const setErrString = (ID, nibrsValidateData) => {
        const arr = nibrsValidateData?.filter((item) => item?.PropertyID == ID);
        setNibrsErrStr(arr[0]?.OnPageError);
        setNibrsErrModalStatus(true);
    }

    const getStatusColors = (ID, nibrsValidateData) => {
        return getNibrsError(ID, nibrsValidateData) ? { backgroundColor: "rgb(255 202 194)" } : {};
    };

    const getPlateStateStyle = () => {
        return categoryCode === "NMVs" || plateTypeCode === "Unknown" ? WidhoutColorStyles : Requiredcolour
    }

    const getPlateTypeOption = (arr) => {
        if (categoryCode === "NMVs") {
            return arr?.filter((item) => item.id === "Unknown");

        } else {
            return arr

        }
    }

    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => ({
                ...getStatusColors(row.PropertyID, nibrsValidateData),
                ...(row.PropertyID === DecVehId ? {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                    cursor: 'pointer',
                } : {})
            }),
        },
    ];

    const setEditVal = (row) => {
        setStatesChangeStatus(false);
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
            modal.show();

        } else {

            if (row.PropertyID || row.MasterPropertyID) {
                navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}`)
                GetSingleData(row?.PropertyID, row?.MasterPropertyID);
                get_vehicle_Count(row?.PropertyID, 0);
                setMasterPropertyID(row.MasterPropertyID);
                setVehicleID(row?.PropertyID);
                setVehicleStatus(true);
                setUpdateCount(updateCount + 1);
                dispatch({ type: MasterVehicle_ID, payload: row?.MasterPropertyID });
                dispatch({ type: Vehicle_ID, payload: row.PropertyID });
                dispatch({ type: Master_Property_Status, payload: true });

            }
        }
    }

    useEffect(() => {
        if (vehicleClick && mainIncidentID) {
            ValidateVehicle(mainIncidentID, true);
        }
    }, [vehicleClick, mainIncidentID]);

    const ValidateVehicle = (incidentID, isDefaultSelected = false) => {
        setclickNibLoder(true); setnibrsValidateData([]);
        try {
            fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'PropertyId': '', 'gIntAgencyID': loginAgencyID }).then((data) => {
                // console.log("🚀 ~ ValidateVehicle ~ data:", data)
                if (data) {

                    if (data?.Properties?.length > 0) {
                        const VehArr = data?.Properties?.filter((item) => item?.PropertyType === 'V');
                        // console.log("🚀 ~ fetchPostDataNibrs ~ VehArr:", VehArr);


                        if (VehArr?.length > 0) {
                            setnibrsValidateData(VehArr || []); setclickNibLoder(false);

                            const row = VehArr[0];
                            // get selected By Default
                            isDefaultSelected && setEditVal(row);

                        } else {
                            setnibrsValidateData([]); setclickNibLoder(false);
                        }

                    } else {

                        setnibrsValidateData([]); setclickNibLoder(false);
                    }


                } else {
                    setnibrsValidateData([]);
                    setclickNibLoder(false);

                }
            })
        } catch (error) {
            console.log("🚀 ~ ValidateProperty ~ error:", error);
            setclickNibLoder(false); setnibrsValidateData([]);
        }
    }

    const NibrsErrorReturn = async (propertyID) => {
        setclickNibLoder(true); setnibrsFieldError([]); setShowLossCodeError(false); setNibrsErrStr('');
        try {
            fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': mainIncidentID, 'IncidentNumber': IncNo, 'PropertyId': propertyID, 'gIntAgencyID': loginAgencyID }).then((data) => {
                if (data) {

                    if (data?.Properties?.length > 0) {

                        const VehArr = data?.Properties?.filter((item) => item?.PropertyType === 'V');
                        console.log("🚀 ~ NibrsErrorReturn ~ VehArr:", VehArr)

                        if (VehArr?.length > 0) {
                            setclickNibLoder(false); setnibrsFieldError(VehArr[0]); setNibrsErrStr(VehArr[0]?.OnPageError);

                        } else {
                            setclickNibLoder(false); setNibrsErrStr(''); setnibrsFieldError([]);
                        }

                    } else {
                        setclickNibLoder(false); setNibrsErrStr(''); setnibrsFieldError([]);
                    }


                } else {
                    setnibrsFieldError([]); setShowLossCodeError(false); setclickNibLoder(false); setNibrsErrStr('');

                }
            })
        } catch (error) {
            console.log("🚀 ~ ValidateProperty ~ error:", error);
            setclickNibLoder(false); setnibrsFieldError([]); setShowLossCodeError(false); setNibrsErrStr('');
        }

    }

    const newVehicle = () => {
        if (MstVehicle === 'MST-Vehicle-Dash') {
            if (isCad) {
                if (isCADSearch) {
                    navigate(`/cad/vehicle_search?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}`);
                } else {
                    navigate(`/cad/dispatcher?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}`)
                }
            }
            reset();
            setVehicleStatus(false); get_vehicle_Count(''); PropertyType(loginAgencyID)
            dispatch({ type: Master_Vehicle_Status, payload: false });
            PropertyType(loginAgencyID);

        } else {
            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}`)
            } else {
                navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}`)
            }
            reset();
            setVehicleStatus(false); dispatch({ type: Master_Vehicle_Status, payload: false });
            get_vehicle_Count(''); PropertyType(loginAgencyID); PropertyType(loginAgencyID);

        }
    }

    return (
        <>
            <div className="col-12 col-md-12 col-lg-12 p-0">
                <div className="col-12 ">
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Vehicle No.</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2  text-field mt-1">
                            <input type="text" name='VehicleNumber' id='VehicleNumber' placeholder='Auto Generated' value={value?.VehicleNumber} onChange={HandleChanges} className='readonlyColor' required autoComplete='off' readOnly />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Loss Code{errors.LossCodeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                            {nibrsFieldError?.OnPageError && !nibrsFieldError?.IsCategory && (
                                <div className="nibrs-tooltip-error">
                                    <div className="tooltip-arrow"></div>

                                    <div className="tooltip-content">
                                        <span className="text-danger">⚠️ {nibrsFieldError?.OnPageError || ''}</span>
                                    </div>
                                </div>
                            )}
                            <Select
                                name='LossCodeID'
                                value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                styles={Requiredcolour}
                                options={propertyLossCodeData}
                                onChange={(e) => ChangePhoneType(e, 'LossCodeID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1 px-4">
                            <label htmlFor="" className='new-label'>Reported Date/Time{errors.ReportedDtTmError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ReportedDtTmError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-10 col-md-10 col-lg-2 ">
                            {
                                MstVehicle === 'MST-Vehicle-Dash' ?
                                    <DatePicker
                                        id='reportedDtTm'
                                        name='reportedDtTm'
                                        ref={startRef}

                                        onKeyDown={(e) => {
                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                e.preventDefault();
                                            } else {
                                                onKeyDown(e);
                                            }
                                        }}
                                        onChange={(date) => {
                                            setChangesStatus(true); setStatesChangeStatus(true);
                                            if (date > new Date(datezone)) {
                                                date = new Date(datezone);
                                            }
                                            if (date >= new Date()) {
                                                setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date(date)) : null })
                                            } else if (date <= new Date(incReportedDate)) {
                                                setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date(date)) : null })
                                            } else {
                                                setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null })
                                            }
                                        }}
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeFormat="HH:mm"
                                        is24Hour
                                        isClearable={false}
                                        selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                        className='requiredColor'
                                        autoComplete="Off"
                                        timeInputLabel
                                        placeholderText={'Select...'}
                                        showTimeSelect
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        maxDate={new Date(datezone)}
                                        filterTime={(date) => filterPassedTimeZone(date, datezone)}
                                    />
                                    :
                                    <DatePicker
                                        id='reportedDtTm'
                                        name='reportedDtTm'
                                        ref={startRef}

                                        onKeyDown={(e) => {
                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                e.preventDefault();
                                            } else {
                                                onKeyDown(e);
                                            }
                                        }}
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        timeFormat="HH:mm "
                                        is24Hour
                                        isClearable={false}
                                        selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                        autoComplete="Off"
                                        onChange={(date) => {
                                            setChangesStatus(true); setStatesChangeStatus(true);
                                            if (date > new Date(datezone)) {
                                                date = new Date(datezone);
                                            }
                                            if (date >= new Date()) {
                                                setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date()) : null })
                                            } else if (date <= new Date(incReportedDate)) {
                                                setValue({ ...value, ['ReportedDtTm']: incReportedDate ? getShowingDateText(incReportedDate) : null })
                                            } else {
                                                setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null })
                                            }
                                        }}
                                        timeInputLabel
                                        showTimeSelect
                                        timeIntervals={1}
                                        timeCaption="Time"
                                        showMonthDropdown
                                        showYearDropdown
                                        dropdownMode="select"
                                        minDate={new Date(incReportedDate)}
                                        maxDate={new Date(datezone)}
                                        showDisabledMonthNavigation
                                        filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                                        className='requiredColor'
                                    />
                            }
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'> Category {errors.CategoryIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2  mt-1">
                            {nibrsFieldError?.IsCategory && (
                                <div className="nibrs-tooltip-error" style={{ left: '-147px' }}>
                                    <div className="tooltip-arrow"></div>

                                    <div className="tooltip-content">
                                        <span className="text-danger">⚠️ {nibrsFieldError?.Category || ''}</span>
                                    </div>
                                </div>
                            )}
                            <Select
                                name='CategoryID'
                                value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                styles={Requiredcolour}
                                options={categoryIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'> Classification</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                            <Select
                                name='ClassificationID'
                                value={classificationID?.filter((obj) => obj.value === value?.ClassificationID)}
                                styles={customStylesWithOutColor}
                                options={classificationID}
                                onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-12 col-md-12 col-lg-4 d-flex ">
                            <div className="col-3 col-md-2 col-lg-5 mt-2 pt-1 ">
                                <label htmlFor="" className='new-label '>
                                    Plate&nbsp;State&nbsp;&&nbsp;No.
                                    {errors.PlateStateNoError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', paddingLeft: '7px' }}>{errors.PlateStateNoError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-6 col-lg-4 mt-1" >
                                <Select
                                    name='PlateID'
                                    value={stateList?.filter((obj) => obj.value === value?.PlateID)}
                                    styles={getPlateStateStyle()}
                                    options={stateList}
                                    onChange={(e) => {
                                        ChangeDropDown(e, 'PlateID');
                                        if (!e) {
                                            setValue({ ...value, PlateID: null, VehicleNo: '' });
                                        }
                                    }}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                            <span className='' style={{ marginTop: '-8px' }}>
                                <div className="text-field col-12 col-md-12 col-lg-12 ">
                                    <input
                                        className={`${value.PlateID ? "requiredColor" : ''} ${!value?.PlateID ? 'readonlyColor' : ''}`}
                                        disabled={!value?.PlateID}
                                        type="text" name='VehicleNo' id='VehicleNo' maxLength={8}
                                        isDisabled={!value?.PlateID}
                                        value={value?.VehicleNo} onChange={HandleChanges} required placeholder='Number..' autoComplete='off' style={{ padding: "5px" }} />
                                </div>
                                {errors.VehicleNoError !== 'true' && value.PlateID ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', paddingLeft: '7px' }}>{errors.VehicleNoError}</p>
                                ) : null}
                            </span>
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Plate Type') }}>
                                Plate Type
                                {errors.PlateTypeIDError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PlateTypeIDError}</p>
                                ) : null}
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                            <Select
                                name='PlateTypeID'
                                value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
                                styles={Requiredcolour}
                                options={plateTypeIdDrp ? getPlateTypeOption(plateTypeIdDrp) : []}
                                onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Value
                                {errors.ContactError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                                ) : null}
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                            <input
                                type="text"
                                name="Value"
                                id="Value"
                                className={!value?.CategoryID ? 'readonlyColor' : lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                                disabled={!value?.CategoryID}
                                maxLength={9}
                                value={`$ ${value?.Value}`}
                                onChange={HandleChanges}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className='col-2  mt-1 mb-md-5 mb-sm-5 mb-lg-0'>

                        </div>

                    </div>
                    <div className="text-center p-1 d-flex justify-content-center">
                        {
                            nibrsFieldError?.OnPageError && (
                                <span
                                    style={{
                                        color: 'red',
                                        textAlign: 'center',
                                    }}
                                    onClick={() => { '' }}>
                                    <u>⚠️ {nibrsFieldError?.OnPageError || ''}</u>
                                </span>
                            )
                        }
                    </div>
                    <div className="col-12 col-md-12 col-lg-12 mt-2 text-right d-flex justify-content-between" >
                        {
                            isNibrsSummited ? (
                                <>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => { ValidateVehicle(mainIncidentID) }}
                                            className={`${nibrsValidateData?.length > 0 ? "btn btn-sm mr-2" : 'btn btn-sm mr-2 btn-success'}`}
                                            style={{
                                                backgroundColor: `${nibrsValidateData?.length > 0 ? 'red' : 'green'}`,
                                                color: 'white'
                                            }}
                                        >
                                            Validate TIBRS
                                        </button>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={newVehicle}>New</button>
                                        {
                                            vehicleStatus && (VehSta === 'true' || VehSta === true) ?
                                                effectiveScreenPermission ?
                                                    effectiveScreenPermission[0]?.Changeok && nibrsSubmittedVehicle !== 1 ?
                                                        <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                        :
                                                        <>
                                                        </>
                                                    :
                                                    <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                :
                                                effectiveScreenPermission ?
                                                    effectiveScreenPermission[0]?.AddOK ?
                                                        <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { setMasterPropertyID(''); check_Validation_Error(); }}>Save</button>
                                                        :
                                                        <>
                                                        </>
                                                    :
                                                    <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { setMasterPropertyID(''); check_Validation_Error(); }}>Save</button>
                                        }
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div>
                <div className="col-12 col-md-12 col-lg-12 p-0 pt-1">
                    <div className=" col-12 modal-table">
                        {
                            MstVehicle != 'MST-Vehicle-Dash' &&
                            <DataTable
                                dense
                                columns={columns}
                                data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? VehicleFilterData : [] : VehicleFilterData}
                                selectableRowsHighlight
                                highlightOnHover
                                responsive
                                fixedHeader
                                persistTableHead={true}
                                customStyles={tableCustomStyles}
                                onRowClicked={(row) => {
                                    setEditVal(row);
                                }}
                                pagination
                                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                paginationPerPage={'5'}
                                conditionalRowStyles={conditionalRowStyles}
                                showHeader={true}
                                fixedHeaderScrollHeight='80px'
                                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            />
                        }
                    </div>
                </div>
            </div>
            {/* <IdentifyFieldColor /> */}
            <DeletePopUpModal func={delete_Vehicle_Property} />
            <ChangesModal func={check_Validation_Error} />
            <ListModal {...{ openPage, setOpenPage }} />
            <NirbsErrorShowModal
                ErrorText={nibrsErrStr}
                nibErrModalStatus={nibrsErrModalStatus}
                setNibrsErrModalStatus={setNibrsErrModalStatus}

            />
            {
                clickNibloder && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

export default VehicleTab

const Get_LossCode = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.LossCodeID))
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}


const getCategoryCode = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.CategoryID))
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}