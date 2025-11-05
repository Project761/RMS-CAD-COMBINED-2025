import React, { useState, useEffect, useContext } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { Aes256Encrypt, Decrypt_Id_Name, Encrypted_Id_Name, LockFildscolour, Requiredcolour, base64ToString, filterPassedDateTime, filterPassedTime, filterPassedTimeZone, filterPassedTimeZonesProperty, filterPastDate, getMonthWithOutDateTime, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, getYearWithOutDateTime, stringToBase64, tableCustomStyle, tableCustomStyles } from '../../../../Common/Utility';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AddDeleteUpadate, fetchPostData, fetchData, AddDelete_Img, fetchPostDataNibrs } from '../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../Common/ChangeArrayFormat';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../../Utility/Personnel/Validation';
import { Carousel } from 'react-responsive-carousel';
import defualtImage from '../../../../../img/uploadImage.png';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import ChangesModal from '../../../../Common/ChangesModal';
import DataTable from 'react-data-table-component';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { MasterVehicle_ID, Vehicle_ID, Master_Property_Status, Classification_Drp_Data, Masters_Name_Drp_Data, Master_Vehicle_Status, StyleID_Drp_Data, MakeID_Drp_Data } from '../../../../../redux/actionTypes';
import ImageModel from '../../../ImageModel/ImageModel';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_Data_VODID_Drp_Data, get_Vehicle_Color_Drp_Data, get_AgencyOfficer_Data, get_ArresteeName_Data, get_ModalId_Drp_Data, get_Classification_Drp_Data, get_PlateType_Drp_Data, get_State_Drp_Data, get_VehicleLossCode_Drp_Data, get_Masters_Name_Drp_Data, get_IsPrimary_Color_Drp_Data, get_IsSecondary_Color_Drp_Data, get_ArresteeNameVehicle, get_Masters_PossessionOwnerData } from '../../../../../redux/actions/DropDownsData';
import VehicleSearchTab from '../../../VehicleSearchTab/VehicleSearchTab';
import { get_Vehicle_Search_Data } from '../../../../../redux/actions/VehicleAction';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import AlertMasterModel from '../../../AlertMaster/AlertMasterModel';
import AlertTable from '../../../AlertMaster/AlertTable';
import BarCode from '../../../../Common/BarCode';
import NirbsErrorShowModal from '../../../../Common/NirbsErrorShowModal';
import Loader from '../../../../Common/Loader';
import CurrentVehicleReport from './CurrentVehicleReport';
import CreatableSelect from 'react-select/creatable';
import NCICModal from '../../../../../CADComponents/NCICModal';


const Home = ({ setStatus, setShowVehicleRecovered, newStatus, ResetErrors, setResetErrors, showVehicleRecovered, get_List, setPropertyStatus, isCad = false, isViewEventDetails = false, isCADSearch = false, clickCount }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const vodIdData = useSelector((state) => state.DropDown.vehicleVODIDDrpData);
    const colorDrp = useSelector((state) => state.DropDown.vehicleColorDrpData);
    const primaryOfficerID = useSelector((state) => state.DropDown.agencyOfficerDrpData)
    const modalIdDrp = useSelector((state) => state.DropDown.modalIdDrpData)
    const classificationID = useSelector((state) => state.DropDown.classificationDrpData)
    const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData)
    const stateList = useSelector((state) => state.DropDown.stateDrpData);
    const isSecondaryDrpData = useSelector((state) => state.DropDown.isSecondaryDrpData);
    const isPrimaryDrpData = useSelector((state) => state.DropDown.isPrimaryDrpData);
    const arresteeNameVehicle = useSelector((state) => state.DropDown.arresteeNameVehicle);
    const inProfessionOf = useSelector((state) => state.DropDown.arresteeNameData);
    const mastersNameDrpData = useSelector((state) => state.DropDown.mastersNameDrpData);
    const ownerPossessionDrpData = useSelector((state) => state.DropDown.ownerPossessionDrpData);
    const masterVehicleStatus = useSelector((state) => state.Agency.masterVehicleStatus);
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
    let isNew = query?.get('isNew');
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!VehId) VehId = 0;
    else DecVehId = parseInt(base64ToString(VehId));
    if (!MVehId) VehId = 0;
    else DecMVehId = parseInt(base64ToString(MVehId));


    const { get_vehicle_Count, get_Incident_Count, updateCount, setUpdateCount, incidentCount, nibrsSubmittedStatus, nibrsSubmittedvehicleMain, setnibrsSubmittedvehicleMain, setnibrsSubmittedStatus, changesStatus, changesStatusCount, setChangesStatus, setVehicleStatus, vehicleStatus, VehicleFilterData, get_Data_Vehicle, get_Name_Count, datezone, GetDataTimeZone, setcountoffaduit, validate_IncSideBar, incidentReportedDate, setIncidentReportedDate } = useContext(AgencyContext)

    const [clickedRow, setClickedRow] = useState(null);
    const [destoryDate, setDestoryDate] = useState();
    const [plateExpDate, setPlateExpDate] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [inspectionExpDate, setInspectionExpDate] = useState();
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [lossCode, setLossCode] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [plateTypeCode, setPlateTypeCode] = useState('');
    const [modalStatus, setModalStatus] = useState(false);
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [editval, setEditval] = useState();
    const [vehicleMultiImg, setVehicleMultiImg] = useState([])
    const [imageId, setImageId] = useState('');
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [vehicleID, setVehicleID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [type, setType] = useState("VehicleOwner");
    const [possessionID, setPossessionID] = useState('');
    const [ownerOfID, setOwnerOfID] = useState('');
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [uploadImgFiles, setuploadImgFiles] = useState([]);
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [searchModalState, setSearchModalState] = useState();
    const [openPage, setOpenPage] = useState('');
    const [availableAlert, setAvailableAlert] = useState([]);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [printStatus, setPrintStatus] = useState(false);
    const [printVehReport, setPrintVehReport] = useState(false);
    const [VehReportCount, setVehReportCount] = useState(1);
    const [openNCICModal, setOpenNCICModal] = useState(false);
    const [vehMakeDrpData, setVehMakeDrpData] = useState([])
    const [styleDrp, setStyleDrpData] = useState([])
    const [baseDate, setBaseDate] = useState('');
    const [oriNumber, setOriNumber] = useState('');
    const [nibrsValidateData, setnibrsValidateData] = useState([]);
    const [nibrsErrStr, setNibrsErrStr] = useState('');
    const [clickNibloder, setclickNibLoder] = useState(false);
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [imageModalOfficerID, SetImageModalOfficerID] = useState(null);
    const [newClicked, SetNewClciked] = useState(0);
    const [vehErrorStatus, setVehErrorStatus] = useState(false);
    const [showModal, setShowModal] = useState(false);


    // permissions
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'IncidentID': '', 'VehicleID': '', 'PropertyID': '', 'MasterPropertyID': '', 'CreatedByUserFK': '',
        'VehicleNumber': 'Auto Generated', 'ReportedDtTm': '', 'LossCodeID': null, 'CategoryID': null, 'PlateID': null,
        'VehicleNo': '', 'PlateTypeID': null, 'ClassificationID': '', 'IsSendToPropertyRoom': '', 'VIN': '', 'VODID': '', 'PlateExpireDtTm': '',
        'OANID': '', 'StyleID': '', 'MakeID': null, 'ModelID': null, 'ManufactureYear': '', 'Weight': '', 'OwnerID': null,
        'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '',
        'PrimaryOfficerID': null, 'InProfessionOf': '', 'TagID': null, 'NICBID': null, 'DestroyDtTm': '', 'Description': '',
        'IsEvidence': '', 'IsRecoveredByAgencyOfOther': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '',
        'ModifiedByUserFK': "", 'ArrestID': "", 'AgencyID': '', 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false,
        'ModelName': '',
        'PlateExpirationMonth': '',
        'PlateExpirationYear': '',
    });

    const [errors, setErrors] = useState({
        'LossCodeIDError': '', 'CategoryIDError': '', 'RecoveryTypeIDError': '', 'PlateTypeIDError': '', 'VehicleNoError': '', 'vinLengthError': '',
        'PlateStateNoError': '',
    })

    const [imgData, setImgData] = useState({
        "PictureTypeID": '', "ImageViewID": '', "ImgDtTm": '', "OfficerID": '', "Comments": '', "DocumentID": ''
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (ResetErrors) {
            reset();
        }
    }, [ResetErrors]);

    // useEffect(() => {
    //     if (isNew === true) { newVehicle(); }
    // }, [isNew]);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("V081", localStoreData?.AgencyID, localStoreData?.PINID));
            get_Incident_Count(IncID, localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID);
            setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null); setOriNumber(localStoreData?.ORI);
        }
    }, [localStoreData]);

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
        if (MstVehicle === "MST-Vehicle-Dash" && masterVehicleStatus === true) {
            newVehicle();
            setPossessionID(''); setOwnerOfID('');
            setPossenSinglData([]);

            // dispatch({ type: Masters_Name_Drp_Data, payload: [] });
        }
    }, [MstVehicle, masterVehicleStatus]);

    useEffect(() => {
        if (value.CategoryID === '' || value.CategoryID === null) {
            setValue({ ...value, ['ClassificationID']: '' });
        }
    }, [value.CategoryID])

    useEffect(() => {
        if (IncID) {
            setMainIncidentID(IncID); get_Data_Vehicle(IncID); dispatch(get_ArresteeNameVehicle('', '', IncID));
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
        }
    }, [IncID, nameModalStatus, possessionID, ownerOfID, loginPinID]);

    useEffect(() => {
        if (type === "VehicleName" && possessionID) { setValue({ ...value, ['InProfessionOf']: parseInt(possessionID) }); }
        if (type === "VehicleOwner" && ownerOfID) { setValue({ ...value, ['OwnerID']: parseInt(ownerOfID) }); }
    }, [possessionID, arresteeNameVehicle, ownerOfID, type, mastersNameDrpData, ownerPossessionDrpData]);

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
        if (loginAgencyID) {
            if (primaryOfficerID?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)); }
        }
    }, [loginAgencyID, IncID]);

    useEffect(() => {
        if (DecVehId || DecMVehId) {
            setVehicleID(DecVehId);
            GetSingleData(DecVehId, DecMVehId);
            setMasterPropertyID(DecMVehId);
            MstVehicle == 'MST-Vehicle-Dash' ? get_vehicle_Count(0, DecMVehId) : get_vehicle_Count(DecVehId, DecMVehId)

        } else {
            if (!DecVehId && !DecMVehId) reset();
        }
    }, [DecVehId, DecMVehId, clickCount]);

    useEffect(() => {
        if (loginAgencyID) {
            if (isPrimaryDrpData?.length === 0) { dispatch(get_IsPrimary_Color_Drp_Data(loginAgencyID)) };
            if (isSecondaryDrpData?.length === 0) { dispatch(get_IsSecondary_Color_Drp_Data(loginAgencyID)) };
            if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(loginAgencyID)) };
            if (plateTypeIdDrp?.length === 0) { dispatch(get_PlateType_Drp_Data(loginAgencyID)) };
            PropertyType(loginAgencyID);
            if (arresteeNameVehicle?.length === 0) { dispatch(get_ArresteeNameVehicle('', '', IncID)) }
            if (vodIdData?.length === 0) { dispatch(get_Data_VODID_Drp_Data(loginAgencyID)) };
            if (stateList?.length === 0) { dispatch(get_State_Drp_Data()) };
        }
    }, [loginAgencyID])

    const check_Validation_Error = (e) => {
        const LossCodeIDErr = RequiredFieldIncident(value.LossCodeID);
        const CategoryIDErr = RequiredFieldIncident(value.CategoryID);
        const PlateTypeIDErr = RequiredFieldIncident(value.PlateTypeID);
        const PlateStateNoErr = categoryCode === "NMVs" || plateTypeCode === "Unknown" ? 'true' : RequiredFieldIncident(value.PlateID);
        const VehicleNoErr = value.PlateID == '' || value.PlateID === null ? 'true' : RequiredFieldIncident(value.VehicleNo)
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
            dispatch(get_Masters_Name_Drp_Data(editval[0]?.OwnerID));
            dispatch(get_Masters_PossessionOwnerData(editval[0]?.InProfessionOf));
            setcountoffaduit(true);
            dispatch(get_Classification_Drp_Data(editval[0]?.CategoryID));
            get_StyleId_Drp_Data(loginAgencyID, editval[0]?.CategoryID);
            get_MakeId_Drp_Data(loginAgencyID, editval[0]?.CategoryID);
            setLossCode(Get_LossCode(editval, propertyLossCodeData));
            setCategoryCode(getCategoryCode(editval, categoryIdDrp));
            dispatch(get_ModalId_Drp_Data(loginAgencyID, editval[0]?.MakeID));
            dispatch({ type: MasterVehicle_ID, payload: editval[0]?.MasterPropertyID });
            dispatch({ type: Vehicle_ID, payload: MstVehicle === 'MST-Vehicle-Dash' ? '' : editval[0]?.VehicleID });
            sessionStorage.setItem("vehicleStolenValue", Encrypted_Id_Name(editval[0]?.Value, 'VForVehicleStolenValue'));
            setValue({
                ...value,
                'LossCodeID': editval[0]?.LossCodeID,
                'NICBID': editval[0]?.NICBID, 'TagID': editval[0]?.TagID, 'PrimaryOfficerID': editval[0]?.PrimaryOfficerID, 'SecondaryColorID': editval[0]?.SecondaryColorID, 'PrimaryColorID': editval[0]?.PrimaryColorID,
                'OwnerID': editval[0]?.OwnerID, 'ModelID': editval[0]?.ModelID, 'MakeID': editval[0]?.MakeID, 'StyleID': editval[0]?.StyleID, 'OANID': editval[0]?.OANID, 'VODID': editval[0]?.VODID,
                'ClassificationID': editval[0]?.ClassificationID, 'PlateTypeID': editval[0]?.PlateTypeID, 'PlateID': editval[0]?.PlateID ? editval[0]?.PlateID : '', 'CategoryID': editval[0]?.CategoryID,
                'VehicleNumber': editval[0]?.VehicleNumber, 'ReportedDtTm': editval[0]?.ReportedDtTm ? getShowingDateText(editval[0]?.ReportedDtTm) : '', 'IsEligibleForImmobalization': editval[0]?.IsEligibleForImmobalization,
                'IsImmobalizationDevice': editval[0]?.IsImmobalizationDevice, 'IsPropertyRecovered': editval[0]?.IsPropertyRecovered, 'ModelName': editval[0]?.ModelName, 'IsEvidence': editval[0]?.IsEvidence, 'IsRecoveredByAgencyOfOther': editval[0]?.IsRecoveredByAgencyOfOther,
                'InProfessionOf': editval[0]?.InProfessionOf, 'Description': editval[0]?.Description, 'DestroyDtTm': editval[0]?.DestroyDtTm, 'InspectionExpiresDtTm': editval[0]?.InspectionExpiresDtTm,
                'Inspection_Sticker': editval[0]?.Inspection_Sticker, 'Weight': editval[0]?.Weight, 'ManufactureYear': editval[0]?.ManufactureYear, 'VIN': editval[0]?.VIN ? editval[0]?.VIN : '',
                'VehicleNo': editval[0]?.VehicleNo, 'PlateExpireDtTm': editval[0]?.PlateExpireDtTm, 'ModifiedByUserFK': loginPinID, 'PropertyID': editval[0]?.PropertyID, 'MasterPropertyID': editval[0]?.MasterPropertyID,
                'IsSendToPropertyRoom': editval[0]?.IsSendToPropertyRoom, 'Value': editval[0]?.Value ? editval[0]?.Value : "",

                'PlateExpirationMonth': editval[0]?.PlateExpirationMonth, 'PlateExpirationYear': editval[0]?.PlateExpirationYear,
            });

            setPossessionID(editval[0]?.InProfessionOf); setOwnerOfID(parseInt(editval[0]?.OwnerID));
            setnibrsSubmittedvehicleMain(editval[0]?.IsNIBRSSummited);
            get_Vehicle_MultiImage(vehicleID, masterPropertyID); setVehicleID(editval[0]?.PropertyID);
            setMasterPropertyID(editval[0]?.MasterPropertyID); setDestoryDate(editval[0]?.DestroyDtTm ? new Date(editval[0]?.DestroyDtTm) : '');
            setInspectionExpDate(editval[0]?.InspectionExpiresDtTm ? new Date(editval[0]?.InspectionExpiresDtTm) : '');
            setManufactureDate(editval[0]?.ManufactureYear ? new Date(editval[0]?.ManufactureYear) : ''); setPlateExpDate(editval[0]?.PlateExpireDtTm ? new Date(editval[0]?.PlateExpireDtTm) : '');
            setIncidentReportedDate(editval[0]?.ReportedDtTm ? new Date(editval[0]?.ReportedDtTm) : null);
            // if (editval[0]?.LossCodeID === 3 || editval[0]?.LossCodeID === 12 || editval[0]?.LossCodeID === 10) {
            //     setShowVehicleRecovered(true)
            // }
            if (editval[0]?.IsSendToPropertyRoom) {
                setPropertyStatus(true);
            }

        } else {
            setValue({
                ...value,
                'ReportedDtTm': MstVehicle === "MST-Vehicle-Dash" ? getShowingMonthDateYear(new Date(datezone)) : incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()),
                'VehicleNumber': '', 'VehicleNo': '', 'PlateID': null, 'OANID': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '', 'AgencyID': loginAgencyID,
                'LossCodeID': null, 'CategoryID': null, 'PlateTypeID': null, 'ClassificationID': null,
                'VIN': '', 'VODID': '', 'PlateExpireDtTm': '', 'StyleID': '', 'MakeID': null, 'ModelID': null, 'ManufactureYear': '',
                'Weight': '', 'OwnerID': null, 'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '',
                'PrimaryOfficerID': null, 'InProfessionOf': '', 'TagID': null, 'NICBID': null, 'DestroyDtTm': '', 'Description': '',
                'IsEvidence': '', 'IsRecoveredByAgencyOfOther': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '', 'ModelName': '',
                'PlateExpirationMonth': '', 'PlateExpirationYear': '',
            });
            setuploadImgFiles([]); setVehicleMultiImg([]);
        }
    }, [editval, changesStatusCount]);

    useEffect(() => {
        propertyLossCodeData?.filter(val => {
            if (val.value === value?.LossCodeID) {
                if (val.id === "RECD") {
                    setShowVehicleRecovered(true);
                } else {
                    setShowVehicleRecovered(false);
                }
            }
        });
    }, [value.LossCodeID, propertyLossCodeData]);

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

    const get_MakeId_Drp_Data = (LoginAgencyID, CategoryID) => {
        const val = { AgencyID: LoginAgencyID, PropertyDescID: CategoryID }
        fetchPostData('PropertyVehicleMake/GetDataDropDown_PropertyVehicleMake', val).then((data) => {
            if (data) {
                setVehMakeDrpData(Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description'))
            } else {
                setVehMakeDrpData([]);
            }
        })
    }

    const get_StyleId_Drp_Data = (LoginAgencyID, CategoryID) => {
        const val = { AgencyID: LoginAgencyID, PropertyDescID: CategoryID }
        fetchPostData('PropertyVehicleStyle/GetDataDropDown_PropertyVehicleStyle', val).then((data) => {
            if (data) {
                setStyleDrpData(Comman_changeArrayFormat(data, 'VehicleStyleID', 'Description'))
            } else {
                setStyleDrpData([]);
            }
        })
    }

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'MakeID') {
                dispatch(get_ModalId_Drp_Data(loginAgencyID, e.value));
                setValue(prev => ({ ...prev, MakeID: e.value, ModelID: 0 }));
            }
            else if (name === 'ModelID') {
                if (e?.__isNew__) {
                    setValue({ ...value, ModelID: '', ModelName: e.label, });
                } else if (e) {
                    setValue({ ...value, ModelID: e.value, ModelName: '', });
                } else {
                    setValue({ ...value, ModelID: '', ModelName: '', });
                }
            }
            else if (name === 'CategoryID') {
                setCategoryCode(e.id);
                setPlateTypeCode("");
                dispatch(get_Classification_Drp_Data(e.value));
                get_StyleId_Drp_Data(loginAgencyID, e.value);
                get_MakeId_Drp_Data(loginAgencyID, e.value);
                setValue(prev => ({
                    ...prev, [name]: e.value, MakeID: '', StyleID: ''
                }));
            } else if (name === 'PlateTypeID') {
                setPlateTypeCode(e.id);
                setValue(prev => ({ ...prev, [name]: e.value }));
            } else {
                setValue(prev => ({ ...prev, [name]: e.value }));
            }
        } else if (e === null) {
            if (name === 'CategoryID') {
                setCategoryCode('');
                setPlateTypeCode('');
                setValue(prev => ({
                    ...prev, CategoryID: '', ClassificationID: '', MakeID: '', StyleID: ''
                }));
                dispatch(get_Classification_Drp_Data(''));
                dispatch({ type: Classification_Drp_Data, payload: [] });
                setVehMakeDrpData([]);
                setStyleDrpData([]);
            } else if (name === 'MakeID') {
                setValue(prev => ({ ...prev, MakeID: '', ModelID: '', ModelName: '' }));
                dispatch(get_ModalId_Drp_Data(loginAgencyID, ''));
            }
            else if (name === 'ModelID') {
                setValue(prev => ({ ...prev, ModelID: '', ModelName: '', }));
            }
            else if (name === 'PlateTypeID') {
                setPlateTypeCode("");
                setValue(prev => ({ ...prev, [name]: null }));
            } else {
                setValue(prev => ({ ...prev, [name]: null }));
            }
        } else {
            setValue(prev => ({ ...prev, [name]: null }));
        }
    };

    const onInProfessionChange = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'InProfessionOf') {
                setPossessionID(e.value); GetSingleDataPassion(e.value, 0); setPossenSinglData([]); setValue({ ...value, [name]: e.value });
            } else if (name === 'OwnerID') {
                setOwnerOfID(e.value); GetSingleDataPassion(e.value, 0); setPossenSinglData([]); setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === 'InProfessionOf') {
                setPossessionID(''); setPossenSinglData([]); setValue({ ...value, [name]: null });
            } else if (name === 'OwnerID') {
                setOwnerOfID(''); setPossenSinglData([]); setValue({ ...value, [name]: null });
            }
        }
    }

    const HandleChanges = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsRecoveredByAgencyOfOther' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsImmobalizationDevice' || e.target.name === 'IsEligibleForImmobalization') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            });

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

        } else if (e.target.name === 'Weight') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");

            setValue({ ...value, [e.target.name]: checkNumber })
        } else if (e.target.name === 'OANID') {
            var ele = e.target.value.replace(/[^0-9a-zA-Z]/g, "")
            const checkNumber = ele.toUpperCase();

            setValue({ ...value, [e.target.name]: checkNumber })

        }
        else if (e.target.name === 'VIN') {
            var ele = e.target.value.replace(/[^0-9a-zA-Z]+$/g, "")
            var eleIOQ = ele.replace(/[IOQ]/gi, '');
            const checkNumber = eleIOQ.toUpperCase();

            setValue({ ...value, [e.target.name]: checkNumber })
        }

        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            });
        }
    }

    const Insert_Vehicle = () => {
        AddDeleteUpadate('PropertyVehicle/Insert_PropertyVehicle', value).then((res) => {
            if (res.success) {
                if (isCad) {
                    if (MstVehicle === 'MST-Vehicle-Dash') {
                        navigate(`/cad/dispatcher?page=MST-Vehicle-Dash&VehId=${stringToBase64(res?.PropertyID)}&MVehId=${stringToBase64(res?.MasterPropertyID)}&ModNo=${res?.VehicleNumber}&VehSta=${true}`)
                    } else {
                        navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(res?.PropertyID)}&MVehId=${stringToBase64(res?.MasterPropertyID)}&VehSta=${true}`)
                    }
                } else {
                    if (MstVehicle === 'MST-Vehicle-Dash') {
                        navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&VehId=${stringToBase64(res?.PropertyID)}&MVehId=${stringToBase64(res?.MasterPropertyID)}&ModNo=${res?.VehicleNumber}&VehSta=${true}`)
                    } else {
                        navigate(`/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(res?.PropertyID)}&MVehId=${stringToBase64(res?.MasterPropertyID)}&VehSta=${true}`)
                    }
                }
                reset();
                if (uploadImgFiles?.length > 0) {
                    upload_Image_File(res.PropertyID, res.MasterPropertyID);
                    setuploadImgFiles([])
                }
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['LossCodeIDError']: '' }); get_Incident_Count(mainIncidentID, loginPinID); get_Data_Vehicle(mainIncidentID);
                setUpdateCount(updateCount + 1); PropertyType(loginAgencyID);
                setChangesStatus(false); setStatesChangeStatus(false); setStatus(false); setMasterPropertyID(res?.MasterPropertyID);
                // validateIncSideBar
                validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
                // nibrsValidateProperty(mainIncidentID)
            } else {
                toastifyError('Error'); setErrors({ ...errors, ['LossCodeIDError']: '' });
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
                GetSingleData(vehicleID, masterPropertyID); setChangesStatus(false); setStatesChangeStatus(false);
                setUpdateCount(updateCount + 1); get_Data_Vehicle(mainIncidentID);
                setErrors({ ...errors, ['LossCodeIDError']: '' });
                setValue({ ...value, Value: previousValue, }); get_List(vehicleID);
                if (uploadImgFiles?.length > 0) { upload_Image_File(); setuploadImgFiles([]); }
                // validateIncSideBar
                validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);
                // nibrsValidateProperty(mainIncidentID)
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
            'Weight': '', 'OwnerID': '', 'PrimaryColorID': '', 'SecondaryColorID': '', 'Value': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '', 'ModelName': '',
            'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '', 'PrimaryOfficerID': '',
            'IsEvidence': '', 'IsRecoveredByAgencyOfOther': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '', 'IsSendToPropertyRoom': '',
            'ReportedDtTm': MstVehicle === "MST-Vehicle-Dash" ? getShowingMonthDateYear(new Date(datezone)) : incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()),
            "MasterPropertyID": '', 'PropertyID': '', 'IsMasterManufactureYear': '', 'IsMasterIsEvidence': '',
            'PlateExpirationMonth': '', 'PlateExpirationYear': '',

        });
        setShowVehicleRecovered(false);
        setErrors({
            ...errors,
            'LossCodeIDError': '', 'CategoryIDError': '', 'RecoveryTypeIDError': '', 'PlateTypeIDError': '', 'PlateStateNoError': '', 'VehicleNoError': '', 'ContactError': '', 'vinLengthError': ''
        });
        setnibrsSubmittedvehicleMain(0); setPlateExpDate(); setManufactureDate(); setInspectionExpDate(); setDestoryDate(); setChangesStatus(false)
        setMasterPropertyID('');
        dispatch({ type: MasterVehicle_ID, payload: '' });
        dispatch({ type: Classification_Drp_Data, payload: [] });
        dispatch({ type: Vehicle_ID, payload: '' });
        setVehicleID(''); setLossCode(''); setAvailableAlert([]);
        setPropertyStatus(false); setPossessionID(''); dispatch(get_Masters_Name_Drp_Data(''));
        dispatch(get_Masters_PossessionOwnerData('')); setPlateTypeCode(''); setCategoryCode(''); setVehMakeDrpData([]);
        setStyleDrpData([]);
        setVehicleStatus(false);
        setuploadImgFiles([]); setVehicleMultiImg([]);
        setResetErrors(false);

    }

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

    const get_Vehicle_MultiImage = (vehicleID, masterPropertyID) => {
        const val = { 'PropertyID': vehicleID, 'IsMaster': false, }
        const val1 = { 'PropertyID': 0, 'MasterPropertyID': masterPropertyID, 'IsMaster': true }
        fetchPostData('PropertyVehicle/GetData_PropertyVehiclePhoto', MstVehicle === "MST-Vehicle-Dash" ? val1 : val)
            .then((res) => {
                // console.log("🚀 ~ get_Vehicle_MultiImage ~ res:", res)
                if (res?.length > 0) {
                    setVehicleMultiImg(res);
                    SetImageModalOfficerID(res[0]?.OfficerID);

                } else {
                    setVehicleMultiImg([]);
                    // for clearing uploded img if it has on cancle button
                    setuploadImgFiles([]);
                    SetImageModalOfficerID(null);

                }
            })
    }

    const update_Vehicle_MultiImage = () => {
        const val = { "ModifiedByUserFK": loginPinID, "AgencyID": loginAgencyID, "PictureTypeID": imgData?.PictureTypeID, "ImageViewID": imgData?.ImageViewID, "ImgDtTm": imgData?.ImgDtTm, "OfficerID": imgData?.OfficerID, "Comments": imgData?.Comments, "DocumentID": imgData?.DocumentID }
        AddDeleteUpadate('PropertyVehicle/Update_PropertyVehiclePhotoDetail', val)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);

                }
                else {
                    toastifyError(res?.Message);
                }
            })

    }

    const upload_Image_File = async (vehID, vehMID) => {
        const formdata = new FormData();
        const newData = [];
        const EncFormdata = new FormData();
        const EncDocs = [];
        for (let i = 0; i < uploadImgFiles.length; i++) {
            const { file, imgData } = uploadImgFiles[i];

            const val = {
                'PropertyID': vehicleID ? vehicleID : vehID, 'MasterPropertyID': masterPropertyID ? masterPropertyID : vehMID,
                'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'PictureTypeID': imgData?.PictureTypeID,
                'ImageViewID': imgData?.ImageViewID, 'ImgDtTm': imgData?.ImgDtTm, 'OfficerID': imgData?.OfficerID,
                'Comments': imgData?.Comments, 'IsMaster': MstVehicle === "MST-Property-Dash" ? true : false, 'AgencyID': loginAgencyID,
            };

            const val1 = {
                'PropertyID': 0, 'MasterPropertyID': masterPropertyID ? masterPropertyID : vehMID,
                'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'PictureTypeID': imgData?.PictureTypeID,
                'ImageViewID': imgData?.ImageViewID, 'ImgDtTm': imgData?.ImgDtTm, 'OfficerID': imgData?.OfficerID,
                'Comments': imgData?.Comments, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false, 'AgencyID': loginAgencyID,
            };

            const values = JSON.stringify(MstVehicle === 'MST-Vehicle-Dash' ? val1 : val);
            newData.push(values);

            const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(MstVehicle === 'MST-Vehicle-Dash' ? val1 : val)]));
            EncDocs.push(EncPostData);
            formdata.append("file", file);
            EncFormdata.append("file", file);
        }
        formdata.append("Data", JSON.stringify(newData));
        EncFormdata.append("Data", EncDocs);
        AddDelete_Img('PropertyVehicle/Insert_PropertyVehiclePhoto', formdata, EncFormdata)
            .then((res) => {
                if (res.success) {
                    get_Vehicle_MultiImage(vehicleID ? vehicleID : vehID, masterPropertyID ? masterPropertyID : vehMID);
                    setuploadImgFiles([]);
                }
            })
            .catch(err => console.log(err));
    };

    const delete_Image_File = (e) => {
        const value = { 'PhotoID': imageId, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('PropertyVehicle/Delete_PropertyVehiclePhoto', value).then((data) => {
            if (data.success) {
                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Vehicle_MultiImage(vehicleID, masterPropertyID);
                setModalStatus(false);
                setImageId('');
            } else {
                toastifyError(data?.Message);
            }
        });
    }

    // const delete_Vehicle_Property = (e) => {
    //     const value = { 'PropertyID': vehicleID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false, }
    //     AddDeleteUpadate('PropertyVehicle/Delete_PropertyVehicle', value).then((res) => {
    //         if (res) {
    //             const parsedData = JSON.parse(res.data);
    //             const message = parsedData.Table[0].Message;
    //             toastifySuccess(message);
    //             get_Incident_Count(mainIncidentID, loginPinID);
    //             get_Data_Vehicle(mainIncidentID);
    //             newVehicle();
    //         } else {
    //             const parsedData = JSON.parse(res.data);
    //             const message = parsedData.Table[0].Message;
    //             toastifySuccess(message);
    //         }
    //     });
    // }

    const ChangePhoneType = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'LossCodeID') {
                setLossCode(e.id);

                setValue({ ...value, [name]: e.value, Value: '', });
            } else {

                setValue({ ...value, [name]: e.value, });
            }
        } else if (e === null) {
            if (name === 'LossCodeID') {

                setLossCode('');
                setValue({ ...value, [name]: null, Value: '', });
            }
        }
    };

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
        // {
        //     name: ' Make/Model ',
        //     selector: (row) => row.Model_Description || row.Make_Description,
        //     sortable: true
        // },
        {
            name: 'Make/Model',
            selector: (row) => {
                let make = row.Make_Description ? row.Make_Description : '';
                let model = row.Model_Description ? row.Model_Description : '';
                return `${make}${make && model ? ' / ' : ''}${model}`;
            },
            sortable: true
        },
        // {
        //     name: 'Primary Color',
        //     selector: (row) => row.PrimaryColor_Description,
        //     sortable: true
        // },
        {
            name: 'Primary Color',
            selector: (row) => (
                <span title={row?.PrimaryColor_Description}>
                    {row?.PrimaryColor_Description ? row?.PrimaryColor_Description.substring(0, 20) : ''}
                    {row?.PrimaryColor_Description?.length > 20 ? '...' : ''}
                </span>
            ),
            sortable: true
        },
        {
            name: 'Owner Name',
            selector: (row) => row.Owner_Description,
            sortable: true
        },

        {
            name: 'Plate Expirestion',
            // selector: (row) => row.InspectionExpiresDtTm,
            selector: (row) => row.PlateExpireDtTm,
            sortable: true
        },
        {
            name: 'Manu.Year',
            selector: (row) => row.ManufactureYear,
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
                <input type="checkbox" checked={row.IsEvidence === true} disabled />
            ),
            sortable: true
        },
        // {
        //     width: '100px',
        //     name: 'View',
        //     cell: row =>
        //         <div style={{ position: 'absolute', top: 4, right: 30 }}>
        //             {
        //                 getNibrsError(row.PropertyID, nibrsValidateData) ?
        //                     <span
        //                         onClick={(e) => { setErrString(row.PropertyID, nibrsValidateData) }}
        //                         className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
        //                         data-toggle="modal"
        //                         data-target="#NibrsErrorShowModal"
        //                     >
        //                         <i className="fa fa-eye"></i>
        //                     </span>
        //                     :
        //                     <></>
        //             }
        //         </div>
        // },
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
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
            modal?.show();
        } else {
            setVehicleMultiImg([]); setStatesChangeStatus(false);
            setuploadImgFiles([]);
            if (row.VehicleID || row.MasterPropertyID) {
                if (isCad) {
                    navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}`)
                } else {
                    navigate(`/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}`)
                }
                setMasterPropertyID(row.MasterPropertyID); dispatch({ type: MasterVehicle_ID, payload: row?.MasterPropertyID });
                setVehicleID(row?.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID });
                setVehicleStatus(true); dispatch({ type: Master_Property_Status, payload: true });
                setUpdateCount(updateCount + 1); setErrors([])
                GetSingleData(row?.PropertyID, row?.MasterPropertyID);
                get_vehicle_Count(row?.PropertyID, 0);
            }
        }

    }

    const newVehicle = () => {
        SetNewClciked((prev) => prev + 1);
        SetImageModalOfficerID(null);
        if (MstVehicle === 'MST-Vehicle-Dash') {
            if (isCad) {
                if (isCADSearch) {
                    navigate(`/cad/vehicle_search?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}`);
                } else {
                    navigate(`/cad/dispatcher?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}`)
                }
            } else {
                navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}&VehSta=${false}`)
            }
            reset(); setPossessionID(''); setOwnerOfID(''); setPossenSinglData([]);
            setClickedRow(null); setVehicleStatus(false);
            setStatus(false); get_vehicle_Count(''); PropertyType(loginAgencyID);
            setVehicleMultiImg([]);
            setuploadImgFiles([]);

            // dispatch({ type: Master_Vehicle_Status, payload: false });

        } else {
            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}`)
            } else {
                navigate(`/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}`)
            }
            reset(); setPossessionID(''); setOwnerOfID(''); setPossenSinglData([]);
            setClickedRow(null); setVehicleStatus(false);
            setStatus(false); get_vehicle_Count(''); PropertyType(loginAgencyID);
            setVehicleMultiImg([]); setuploadImgFiles([]);

            dispatch({ type: Master_Vehicle_Status, payload: false });
        }
        setPropertyStatus(false);
    }

    const OnClose = () => {
        setStatesChangeStatus(false);
        if (MstVehicle === 'MST-Vehicle-Dash') {
            if (isCADSearch) {
                navigate('/cad/dashboard-page');
            } else {
                navigate('/dashboard-page');
            }
        }
    }

    const getPlateStateStyle = () => {
        return categoryCode === "NMVs" || plateTypeCode === "Unknown" ? WidhoutColorStyles : Requiredcolour
    }

    const getPlateTypeOption = (arr) => {
        if (categoryCode === "NMVs") {
            return arr?.filter((item) => item.id === "Unknown")
        } else {
            return arr
        }
    }

    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setPossenSinglData(res);
            } else { setPossenSinglData([]); }
        })
    }

    // useEffect(() => {
    //     if (IncID) {
    //         nibrsValidateProperty(IncID);
    //     }
    // }, [IncID]);

    const nibrsValidateProperty = (incidentID) => {
        setclickNibLoder(true);
        try {
            fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'PropertyId': '', 'gIntAgencyID': loginAgencyID }).then((data) => {
                if (data) {
                    if (data?.Properties?.length > 0) {
                        const VehArr = data?.Properties?.filter((item) => item?.PropertyType === 'V');

                        if (VehArr?.length > 0) {
                            setnibrsValidateData(VehArr || []); setclickNibLoder(false);
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
            setclickNibLoder(false); setnibrsValidateData([]);
        }
    }

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setNameModalStatus(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const HandleChangesPlate = (e) => {
        const { name, value: inputValue } = e.target;
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        // Block if VehicleNo starts with 0
        if (name === 'VehicleNo') {
            if (inputValue.length === 1 && inputValue === '0') {
                return;
            }
        }
        setValue({
            ...value,
            [name]: name === 'VehicleNo' ? inputValue.toUpperCase() : inputValue,
        });
    };

    const getValidDate = (date) => {
        const d = new Date(date);
        return !isNaN(d.getTime()) ? d : null;
    };

    return (
        <>
            {((incidentCount[0]?.VehicleCount === 0 || incidentCount[0]?.VehicleCount === "0") || (VehSta === true || VehSta === 'true') || isNew === "true" || isNew === true) && (
                <>
                    <div className="col-12 col-md-12 col-lg-12 p-0">
                        <div className="col-12 ">
                            <div className="row align-items-center mt-1" style={{ rowGap: "8px" }}>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'>Vehicle No.</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 text-field mt-0">
                                    <input style={{ padding: '5px 9px 7px 8px' }} type="text" name='VehicleNumber' id='VehicleNumber' placeholder='Auto Generated' value={value?.VehicleNumber} onChange={HandleChanges} className='readonlyColor h-100' required autoComplete='off' readOnly />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2 ">
                                    <label htmlFor="" className='new-label mb-0'>Loss Code{errors.LossCodeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <Select
                                        name='LossCodeID'
                                        value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                        styles={nibrsSubmittedvehicleMain === 1 ? LockFildscolour : Requiredcolour}
                                        options={propertyLossCodeData}
                                        onChange={(e) => ChangePhoneType(e, 'LossCodeID')}
                                        isClearable
                                        placeholder="Select..."
                                        isDisabled={nibrsSubmittedvehicleMain === 1 ? true : false}
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2">
                                    <label htmlFor="" className='new-label mb-0'>Reported Date/Time{errors.ReportedDtTmError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ReportedDtTmError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-10 col-md-10 col-lg-2">
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
                                                    setIncidentReportedDate(date ? getShowingMonthDateYear(date) : null)
                                                    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
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
                                                // selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                selected={getValidDate(value?.ReportedDtTm)}
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
                                                disabled={nibrsSubmittedvehicleMain === 1}
                                                className={nibrsSubmittedvehicleMain === 1 ? 'LockFildsColor' : 'requiredColor'}
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
                                                // selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                selected={getValidDate(value?.ReportedDtTm)}
                                                autoComplete="Off"
                                                onChange={(date) => {
                                                    setIncidentReportedDate(date ? getShowingMonthDateYear(date) : null);
                                                    !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
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
                                                disabled={nibrsSubmittedvehicleMain === 1}
                                                className={nibrsSubmittedvehicleMain === 1 ? 'LockFildsColor' : 'requiredColor'}
                                            />
                                    }
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'> Category {errors.CategoryIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2">
                                    <Select
                                        name='CategoryID'
                                        value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
                                        styles={nibrsSubmittedvehicleMain === 1 ? LockFildscolour : Requiredcolour}
                                        options={categoryIdDrp}
                                        onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                        isClearable
                                        placeholder="Select..."
                                        isDisabled={nibrsSubmittedvehicleMain === 1 ? true : false}
                                    />
                                </div>
                                {/* <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'> Classification</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                            <Select
                                name='ClassificationID'
                                value={classificationID?.filter((obj) => obj.value === value?.ClassificationID)}
                                styles={nibrsSubmittedvehicleMain === 1 ? LockFildscolour : customStylesWithOutColor}
                                isDisabled={!value?.CategoryID || nibrsSubmittedvehicleMain === 1 ? true : false}
                                options={classificationID}
                                onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div> */}
                                <div className="col-2 col-md-2 col-lg-2">
                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Plate Type') }}>
                                        Plate Type{errors.PlateTypeIDError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PlateTypeIDError}</p>
                                        ) : null}
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <Select
                                        name='PlateTypeID'
                                        value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
                                        styles={nibrsSubmittedvehicleMain === 1 ? LockFildscolour : Requiredcolour}
                                        isDisabled={nibrsSubmittedvehicleMain === 1 ? true : false}
                                        options={plateTypeIdDrp ? getPlateTypeOption(plateTypeIdDrp) : []}
                                        onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-12 col-md-12 col-lg-4 d-flex align-items-center">
                                    <div className="col-3 col-md-2 col-lg-5">
                                        <label htmlFor="" className='new-label mb-0 '>
                                            Plate&nbsp;State&nbsp;&&nbsp;No.
                                            {errors.PlateStateNoError !== 'true' ? (
                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', paddingLeft: '7px' }}>{errors.PlateStateNoError}</p>
                                            ) : null}
                                        </label>
                                    </div>
                                    <div className="col-4 col-md-6 col-lg-4" >
                                        <Select
                                            name='PlateID'
                                            value={stateList?.filter((obj) => obj.value === value?.PlateID)}
                                            styles={
                                                nibrsSubmittedvehicleMain === 1 ? LockFildscolour : getPlateStateStyle()
                                            }
                                            isDisabled={nibrsSubmittedvehicleMain === 1 ? true : false}
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

                                    <span className='' >
                                        <div className="text-field col-12 col-md-12 col-lg-12 mt-0 ">
                                            <input
                                                // className={`${value.PlateID ? "requiredColor" : ''} ${!value?.PlateID || nibrsSubmittedvehicleMain === 1 ? 'readonlyColor' : ''}`}
                                                className={
                                                    nibrsSubmittedvehicleMain === 1 ? 'LockFildsColour' : `${value.PlateID ? "requiredColor" : ""} ${!value?.PlateID ? "readonlyColor" : ""}`.trim()
                                                }

                                                disabled={!value?.PlateID || nibrsSubmittedvehicleMain === 1}
                                                type="text" name='VehicleNo' id='VehicleNo' maxLength={8}
                                                isDisabled={!value?.PlateID}
                                                value={value?.VehicleNo} onChange={HandleChangesPlate} required placeholder='Number..' autoComplete='off' style={{ padding: "5px" }} />
                                        </div>
                                        {errors.VehicleNoError !== 'true' && value.PlateID ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', paddingLeft: '7px' }}>{errors.VehicleNoError}</p>
                                        ) : null}
                                    </span>
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'> Classification</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2">
                                    <Select
                                        name='ClassificationID'
                                        value={classificationID?.filter((obj) => obj.value === value?.ClassificationID)}
                                        styles={nibrsSubmittedvehicleMain === 1 ? LockFildscolour : customStylesWithOutColor}
                                        isDisabled={!value?.CategoryID || nibrsSubmittedvehicleMain === 1 ? true : false}
                                        options={classificationID}
                                        onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                {/* <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Plate Type') }}>
                                Plate Type{errors.PlateTypeIDError !== 'true' ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PlateTypeIDError}</p>
                                ) : null}
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                            <Select
                                name='PlateTypeID'
                                value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
                                styles={nibrsSubmittedvehicleMain === 1 ? LockFildscolour : Requiredcolour}
                                isDisabled={nibrsSubmittedvehicleMain === 1 ? true : false}
                                options={plateTypeIdDrp ? getPlateTypeOption(plateTypeIdDrp) : []}
                                onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div> */}
                                <div className="col-2 col-md-2 col-lg-2">
                                    <label htmlFor="" className='new-label mb-0'>VIN {errors.vinLengthError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.vinLengthError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3 mt-0 text-field d-flex align-items-center">
                                    <input type="text" name='VIN' id='VIN' style={{ textTransform: "uppercase", padding: '5px 9px 7px 8px' }} maxLength={17} value={value?.VIN} onChange={HandleChanges} className='' required autoComplete='off' />
                                    <span className=''>
                                        <span className='  col-1 col-md-1 col-lg-1'>
                                            {
                                                (!vehicleStatus || !masterPropertyID) && (VehSta != 'true' || VehSta != true) &&
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-success"
                                                    data-toggle="modal"
                                                    data-target="#PropertyModal"
                                                    onClick={() => {
                                                        dispatch(get_Vehicle_Search_Data(
                                                            value?.VIN, value?.VODID, value?.PlateExpireDtTm, value?.OANID, value?.StyleID, value?.PrimaryColorID,
                                                            value?.SecondaryColorID, value?.Value, value?.Inspection_Sticker, value?.InspectionExpiresDtTm,
                                                            value?.IsEvidence, value?.LossCodeID, value?.MakeID, value?.ManufactureYear,
                                                            value?.PlateID, value?.VehicleNo, value?.PlateTypeID, value?.CategoryID, value?.ClassificationID, value?.PrimaryOfficerID,
                                                            loginAgencyID, setSearchModalState
                                                        ));

                                                    }}

                                                >
                                                    Search
                                                </button>
                                            }
                                        </span>
                                    </span>
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Vehicle VOD') }}>
                                        VOD
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <Select
                                        name='VODID'
                                        value={vodIdData?.filter((obj) => obj.value === value?.VODID)}
                                        styles={customStylesWithOutColor}
                                        options={vodIdData}
                                        onChange={(e) => ChangeDropDown(e, 'VODID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label text-nowrap mb-0'>Plate Expiration</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 d-flex align-items-center">
                                    <DatePicker
                                        selected={
                                            value?.PlateExpirationMonth
                                                ? new Date(2023, value.PlateExpirationMonth - 1)
                                                : null
                                        }
                                        onChange={(date) => {
                                            if (!date) {
                                                setValue(prev => ({ ...prev, PlateExpirationMonth: null }));
                                                return;
                                            }
                                            const selectedMonth = date.getMonth() + 1;
                                            setValue(prev => ({ ...prev, PlateExpirationMonth: selectedMonth }));
                                        }}
                                        openToDate={new Date(2023, new Date().getMonth())}
                                        dateFormat="MM"
                                        showMonthYearPicker
                                        dropdownMode="select"
                                        autoComplete="off"
                                        maxDate={new Date(2023, 11)}
                                        isClearable
                                        renderCustomHeader={() => null}
                                    />


                                    -
                                    <DatePicker
                                        selected={value?.PlateExpirationYear ? new Date(value.PlateExpirationYear, (value?.PlateExpirationMonth ? value.PlateExpirationMonth - 1 : 0)) : null}
                                        onChange={(date) => {
                                            !addUpdatePermission && setChangesStatus(true);
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            if (!date) {
                                                setValue(prev => ({ ...prev, PlateExpirationYear: null }));
                                                return;
                                            }
                                            const selectedYear = date.getFullYear();
                                            setValue(prev => ({ ...prev, PlateExpirationYear: selectedYear }));
                                        }}
                                        openToDate={value?.PlateExpirationYear ? new Date(value.PlateExpirationYear, 0) : new Date()}
                                        yearItemNumber={8}
                                        dateFormat="yyyy"
                                        dropdownMode="select"
                                        autoComplete="off"
                                        showYearPicker
                                        isClearable
                                    />

                                </div>
                                <div className="col-2 col-md-2 col-lg-2">
                                    <label htmlFor="" className='new-label mb-0'>OAN Id</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3 mt-0 text-field ">
                                    <input style={{ padding: '5px 9px 7px 8px' }} type="text" name='OANID' id='OANID' value={value?.OANID} onChange={HandleChanges} className='h-100' required maxLength={20} autoComplete='off' />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Style') }}>
                                        Style
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <Select
                                        name='StyleID'
                                        value={styleDrp?.filter((obj) => obj.value === value?.StyleID)}
                                        styles={customStylesWithOutColor}
                                        options={styleDrp}
                                        onChange={(e) => ChangeDropDown(e, 'StyleID')}
                                        isClearable
                                        isDisabled={value?.CategoryID ? false : true}
                                        className={!value?.CategoryID ? 'readonlyColor' : ''}
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'>Owner</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2">
                                    {
                                        MstVehicle === "MST-Vehicle-Dash" ?
                                            <>
                                                <Select
                                                    name='OwnerID'
                                                    value={mastersNameDrpData?.filter((obj) => obj.value === value?.OwnerID)}
                                                    styles={customStylesWithOutColor}
                                                    options={mastersNameDrpData}
                                                    onChange={(e) => { onInProfessionChange(e, 'OwnerID') }}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </>
                                            :
                                            <>
                                                <Select
                                                    name='OwnerID'
                                                    value={arresteeNameVehicle?.filter((obj) => obj.value === value?.OwnerID)}
                                                    styles={customStylesWithOutColor}
                                                    options={arresteeNameVehicle}
                                                    onChange={(e) => { onInProfessionChange(e, 'OwnerID') }}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </>
                                    }
                                </div>
                                <div className="col-6 col-md-6 col-lg-1" >
                                    <button
                                        onClick={() => {
                                            if (ownerOfID) {
                                                setTimeout(() => {
                                                    GetSingleDataPassion(ownerOfID, 0);
                                                }, [200])
                                            }
                                            setNameModalStatus(true);
                                            setType("VehicleOwner");
                                            get_Name_Count(ownerOfID);
                                            get_vehicle_Count(vehicleID);
                                        }}
                                        className="btn btn-sm bg-green text-white" data-toggle="modal" data-target="#MasterModal">
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" data-toggle="modal" data-target="#ListModel" className='new-link mb-0 ' onClick={() => { setOpenPage('Property Vehicle Make') }}>Make</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <Select
                                        name='MakeID'
                                        value={vehMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                        styles={customStylesWithOutColor}
                                        options={vehMakeDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                        isClearable
                                        isDisabled={value?.CategoryID ? false : true}
                                        className={!value?.CategoryID ? 'readonlyColor' : ''}
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'>Model</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <CreatableSelect
                                        name="ModelID"
                                        isClearable
                                        options={modalIdDrp}
                                        styles={customStylesWithOutColor}
                                        placeholder="Select or type..."
                                        isDisabled={!value?.MakeID}
                                        className={!value?.CategoryID ? 'readonlyColor' : ''}
                                        value={
                                            modalIdDrp?.find((obj) => obj.value?.toString() === value?.ModelID?.toString())
                                            || (value?.ModelName ? { label: value.ModelName, value: value.ModelName } : null)
                                        }
                                        onChange={(e) => ChangeDropDown(e, "ModelID")}
                                    />

                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <span data-toggle="modal" data-target="#ListModel" className='new-link mb-0 ' onClick={() => { setOpenPage('Color') }}>
                                        Primary&nbsp;Color
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2">
                                    <Select
                                        name='PrimaryColorID'
                                        value={isPrimaryDrpData?.filter((obj) => obj.value === value?.PrimaryColorID)}
                                        styles={customStylesWithOutColor}
                                        options={isPrimaryDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'PrimaryColorID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2">
                                    <span data-toggle="modal" data-target="#ListModel" className='new-link mb-0' onClick={() => { setOpenPage('Color') }}>
                                        Secondary&nbsp;Color
                                    </span>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <Select
                                        name='SecondaryColorID'
                                        value={isSecondaryDrpData?.filter((obj) => obj.value === value?.SecondaryColorID)}
                                        styles={customStylesWithOutColor}
                                        options={isSecondaryDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'SecondaryColorID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'>Weight</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3 mt-0 text-field">
                                    <input style={{ padding: '5px 9px 7px 8px' }} type="text" name='Weight' id='Weight' maxLength={4} value={value?.Weight} onChange={HandleChanges} className='h-100' required autoComplete='off' />
                                </div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'>Value
                                        {errors.ContactError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                                        ) : null}
                                    </label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2 mt-0 text-field">
                                    <input
                                        style={{ padding: '5px 9px 7px 8px' }}
                                        type="text"
                                        name="Value"
                                        id="Value"
                                        // className={nibrsSubmittedvehicleMain === 1 ? 'readonlyColor' : lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                                        // className={nibrsSubmittedvehicleMain === 1 || !value?.CategoryID ? 'readonlyColor' : lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                                        className={`h-100 ${nibrsSubmittedvehicleMain === 1 ? 'LockFildscolour' : !value?.CategoryID ? 'readonlyColor' : (lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD') ? 'requiredColor' : ''}`}


                                        disabled={nibrsSubmittedvehicleMain === 1 || !value?.CategoryID ? true : false}
                                        maxLength={9}
                                        value={`$ ${value?.Value}`}
                                        onChange={HandleChanges}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2">
                                    <label htmlFor="" className='new-label mb-0'>Inspection Sticker</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-1 mt-0 text-field ">
                                    <input style={{ padding: '5px 9px 7px 8px' }} type="text" name='Inspection_Sticker' id='Inspection_Sticker' value={value?.Inspection_Sticker} onChange={HandleChanges} className='h-100' required autoComplete='off' />
                                </div>
                                <div className='col-3 col-lg-2'></div>
                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'>Inspection Expires</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-3">
                                    <DatePicker
                                        id='InspectionExpiresDtTm'
                                        name='InspectionExpiresDtTm'
                                        ref={startRef1}
                                        onKeyDown={(e) => {
                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                e.preventDefault();
                                            } else {
                                                onKeyDown(e);
                                            }
                                        }}
                                        onChange={(date) => {
                                            // date will be null if cleared, or valid date if selected
                                            !addUpdatePermission && setChangesStatus(true);
                                            !addUpdatePermission && setStatesChangeStatus(true);
                                            setInspectionExpDate(date);
                                            setValue({ ...value, ['InspectionExpiresDtTm']: date ? getShowingMonthDateYear(date) : null });
                                        }}
                                        onChangeRaw={(e) => {
                                            const input = e.target.value?.trim();

                                            if (input === '') {
                                                // User cleared the field
                                                setInspectionExpDate(null);
                                                setValue({ ...value, ['InspectionExpiresDtTm']: null });
                                            } else {
                                                const parsedDate = new Date(input);
                                                if (isNaN(parsedDate?.getTime())) {
                                                    // Invalid input, set current date
                                                    const now = new Date();
                                                    setInspectionExpDate(now);
                                                    setValue({ ...value, ['InspectionExpiresDtTm']: getShowingMonthDateYear(now) });
                                                }
                                                // Else valid input will be handled by onChange
                                            }
                                        }}
                                        dateFormat="MM/dd/yyyy"
                                        isClearable={!!value?.inspectionExpDate}
                                        selected={inspectionExpDate}
                                        placeholderText={value?.inspectionExpDate || 'Select...'}
                                        autoComplete="off"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                    />
                                </div>



                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0 ' >Primary&nbsp;Officer</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2">
                                    <Select
                                        name='PrimaryOfficerID'
                                        value={primaryOfficerID?.filter((obj) => obj.value == value?.PrimaryOfficerID)}
                                        styles={customStylesWithOutColor}
                                        options={primaryOfficerID}
                                        onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                        isClearable
                                        placeholder="Select..."
                                    />
                                </div>
                                <div className="col-2 col-md-2 col-lg-2">
                                    <label htmlFor="" className='new-label mb-0'>In Possession Of</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-2">
                                    {
                                        MstVehicle ?
                                            <>
                                                <Select
                                                    name='InProfessionOf'
                                                    value={ownerPossessionDrpData?.filter((obj) => obj.value == value?.InProfessionOf)}
                                                    styles={customStylesWithOutColor}
                                                    options={ownerPossessionDrpData}
                                                    onChange={(e) => { onInProfessionChange(e, 'InProfessionOf') }}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </>
                                            :
                                            <>
                                                <Select
                                                    name='InProfessionOf'
                                                    value={inProfessionOf?.filter((obj) => obj.value == value?.InProfessionOf)}
                                                    styles={customStylesWithOutColor}
                                                    options={inProfessionOf}
                                                    onChange={(e) => { onInProfessionChange(e, 'InProfessionOf') }}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </>
                                    }
                                </div>
                                <div className="col-1">
                                    <button
                                        onClick={() => {
                                            if (possessionID) {
                                                setTimeout(() => {
                                                    GetSingleDataPassion(possessionID, 0);
                                                }, [200])

                                            }
                                            // setOwnerOfID();
                                            setPossenSinglData([]);
                                            setNameModalStatus(true);
                                            setType("VehicleName");
                                        }}
                                        className="btn btn-sm bg-green text-white" data-toggle="modal" data-target="#MasterModal">
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </div>

                                <div className="col-2 col-md-2 col-lg-1">
                                    <label htmlFor="" className='new-label mb-0'>Manu. Year</label>
                                </div>
                                <div className="col-4 col-md-4 col-lg-1">
                                    <DatePicker
                                        name='ManufactureYear'
                                        id='ManufactureYear'
                                        selected={manufactureDate}
                                        onChange={(date) => {
                                            !addUpdatePermission && setChangesStatus(true); !addUpdatePermission && setStatesChangeStatus(true);
                                            setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null })
                                        }}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        yearItemNumber={8}
                                        ref={startRef2}
                                        onKeyDown={onKeyDown}
                                        autoComplete="off"
                                        showYearDropdown
                                        showMonthDropdown
                                        dropdownMode="select"
                                        maxDate={new Date()}
                                        minDate={new Date(1900, 0, 1)}
                                    />
                                </div>



                                <div className="col-12 col-md-12 col-lg-2 text-right" >
                                </div>

                                <div className='col-11 mb-md-5 mb-sm-5 mb-lg-0'>
                                    <div className='row'>
                                        <div className="col-4 col-md-4 col-lg-1" ></div>
                                        <div className="col-4 col-md-4 col-lg-1 ml-2">
                                            <div className="form-check ">
                                                <input className="form-check-input" name='IsEvidence' value={value?.IsEvidence} checked={value?.IsEvidence} onChange={HandleChanges} type="checkbox" id="flexCheckDefault" />
                                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                                    Evidence
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-4 col-md-4 col-lg-3 ml-5">
                                            {
                                                showVehicleRecovered ?
                                                    <>
                                                        <div className="form-check ">
                                                            <input className="form-check-input" name='IsRecoveredByAgencyOfOther' value={value?.IsRecoveredByAgencyOfOther} checked={value?.IsRecoveredByAgencyOfOther} onChange={HandleChanges} type="checkbox" id="flexCheckDefault" />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                Is Stolen From Other Agency
                                                            </label>
                                                        </div>
                                                    </> : <></>
                                            }

                                        </div>
                                    </div>
                                </div>

                                <div className='col-11 mb-md-5 mb-sm-5 mb-lg-0'>
                                    <AlertTable availableAlert={availableAlert} masterPropertyID={masterPropertyID} ProSta={VehSta} />

                                    <div className='row mt-1 justify-content-between align-items-center'>
                                        <div>
                                            {/* {vehicleStatus && (VehSta === 'true' || VehSta === true) &&
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { setPrintStatus(true) }}>Print Barcode</button>
                                    }
                                    {
                                        VehicleFilterData?.length > 0 &&
                                        <button
                                            type="button"
                                            onClick={() => { nibrsValidateProperty(mainIncidentID, incReportedDate, baseDate, oriNumber) }}
                                            className="btn btn-sm mr-2"
                                            style={{
                                                backgroundColor: `${nibrsValidateData?.length > 0 ? nibrsValidateData?.length > 0 ? 'red' : 'green' : 'teal'}`,
                                                color: 'white'
                                            }}
                                        >
                                            Validate TIBRS Vehicle
                                        </button>
                                    } */}
                                        </div>


                                        <div>
                                            <button type="button" className="btn btn-sm btn-success mr-1" data-toggle="modal" data-target="#NCICModal" onClick={() => { setOpenNCICModal(true) }}>TLETS</button>

                                            {/* <button type="button" className="btn btn-sm btn-success mr-1" onClick={newVehicle}>New</button> */}

                                            {
                                                vehicleStatus && (VehSta === 'true' || VehSta === true) ?
                                                    effectiveScreenPermission ?
                                                        effectiveScreenPermission[0]?.Changeok ?
                                                            <>
                                                                <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                                <button
                                                                    type="button" className="btn btn-sm btn-success mr-4" data-toggle="modal" data-target="#QueueReportsModal"
                                                                    onClick={() => { setShowModal(true); setPrintVehReport(true); setVehReportCount(VehReportCount + 1); }}
                                                                >
                                                                    Print <i className="fa fa-print"></i>
                                                                </button>
                                                            </>

                                                            :
                                                            <>
                                                            </>
                                                        :
                                                        <>
                                                            <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                            <button
                                                                type="button" className="btn btn-sm btn-success mr-4" data-toggle="modal" data-target="#QueueReportsModal"
                                                                onClick={() => { setShowModal(true); setPrintVehReport(true); setVehReportCount(VehReportCount + 1); }}
                                                            >
                                                                Print <i className="fa fa-print"></i>
                                                            </button>
                                                        </>
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
                                            {
                                                MstVehicle === 'MST-Vehicle-Dash' &&
                                                <button type="button" className="btn btn-sm btn-success " onClick={OnClose}>Close</button>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className=" col-3 col-md-3 col-lg-1 ">
                                    <div className="img-box" style={{ marginTop: '-18px' }}>
                                        <Carousel autoPlay={true} className="carousel-style" showArrows={true} showThumbs={false} showStatus={false} >
                                            {
                                                vehicleMultiImg?.length > 0 ?
                                                    vehicleMultiImg?.map((item) => (
                                                        <div key={item?.PhotoID ? item?.PhotoID : item?.imgID} onClick={() => { setImageModalStatus(true) }} data-toggle="modal" data-target="#ImageModel" className='model-img'>
                                                            <img src={`data:image/png;base64,${item?.Photo}`} style={{ height: '90px' }} />
                                                        </div>
                                                    ))
                                                    :
                                                    <div data-toggle="modal" data-target="#ImageModel" onClick={() => { setImageModalStatus(true) }}>
                                                        <img src={defualtImage} />
                                                    </div>
                                            }
                                        </Carousel>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-12 p-0 pt-1">
                            <div className=" col-12 modal-table">
                                {/* {
                            MstVehicle != 'MST-Vehicle-Dash' &&
                            <DataTable
                                dense
                                columns={columns}
                                data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? VehicleFilterData : [] : VehicleFilterData}
                                selectableRowsHighlight
                                highlightOnHover
                                responsive
                                fixedHeaderScrollHeight="150px"
                                fixedHeader
                                persistTableHead={true}
                                customStyles={tableCustomStyle}
                                onRowClicked={(row) => {
                                    setClickedRow(row);
                                    setEditVal(row);
                                }}
                                pagination
                                paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                paginationPerPage={5}
                                conditionalRowStyles={conditionalRowStyles}
                                showHeader={true}

                                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            />
                        } */}
                            </div>
                        </div>
                    </div>
                    {/* <IdentifyFieldColor /> */}
                    {/* <DeletePopUpModal func={delete_Vehicle_Property} /> */}
                    <ChangesModal func={check_Validation_Error} />
                    <ListModal {...{ openPage, setOpenPage }} />
                    <VehicleSearchTab {...{ GetSingleData, searchModalState, setSearchModalState, mainIncidentID, value, setValue, loginPinID, loginAgencyID, MstVehicle, setEditval, setStatesChangeStatus, setChangesStatus, isCad, get_Vehicle_MultiImage }} />
                    <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, setPossessionID, possenSinglData, possessionID, setOwnerOfID, ownerOfID, setPossenSinglData, GetSingleDataPassion }} />
                    <ImageModel multiImage={vehicleMultiImg} pinID={imageModalOfficerID ? imageModalOfficerID : loginPinID} entityID={value?.VehicleNo} newClicked={newClicked} setStatesChangeStatus={setStatesChangeStatus} primaryOfficerID={primaryOfficerID} setMultiImage={setVehicleMultiImg} uploadImgFiles={uploadImgFiles} setuploadImgFiles={setuploadImgFiles} ChangeDropDown={ChangeDropDown} modalStatus={modalStatus} setModalStatus={setModalStatus} imageId={imageId} setImageId={setImageId} imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} delete_Image_File={delete_Image_File} setImgData={setImgData} imgData={imgData} updateImage={update_Vehicle_MultiImage} agencyID={loginAgencyID} />
                    <AlertMasterModel masterID={masterPropertyID} setStatesChangeVich={setStatesChangeStatus} AlertType={"Vehicle"} modelName={"Vehicle"} loginPinID={loginPinID} agencyID={loginAgencyID} getAlertData={setAvailableAlert} />
                    <BarCode agencyID={loginAgencyID} propID={DecVehId} masPropID={DecMVehId} codeNo={value?.VehicleNumber} printStatus={printStatus} setPrintStatus={setPrintStatus} />
                    <NirbsErrorShowModal
                        ErrorText={nibrsErrStr}
                        nibErrModalStatus={nibrsErrModalStatus}
                        setNibrsErrModalStatus={setNibrsErrModalStatus}
                    />
                    <CurrentVehicleReport VehNumber={value.VehicleNumber} {...{ printVehReport, setPrintVehReport, VehReportCount, setVehReportCount, showModal, setShowModal }} />
                    {openNCICModal && <NCICModal {...{ openNCICModal, setOpenNCICModal, }} vehicleIncidentData={value} />}
                    {
                        clickNibloder && (
                            <div className="loader-overlay">
                                <Loader />
                            </div>
                        )
                    }
                </>
            )}

        </>
    )
}

export default Home

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