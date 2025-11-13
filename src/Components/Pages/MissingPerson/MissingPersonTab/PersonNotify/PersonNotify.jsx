import React, { useContext, useEffect, useState } from 'react'
// import MissingTab from '../../../Utility/Tab/MissingTab'
import { Decrypt_Id_Name, Requiredcolour, base64ToString, colourStyles, customStylesWithOutColor, filterPassedDateTime, filterPassedTimeZone, filterPassedTimeZonesProperty, getShowingDateText, getShowingMonthDateYear, getYearWithOutDateTime, stringToBase64 } from '../../../../Common/Utility'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_AgencyOfficer_Data, get_ArresteeName_Data, get_Classification_Drp_Data, get_Data_VODID_Drp_Data, get_MakeId_Drp_Data, get_Missing_Person_Relationship_Drp_Data, get_ModalId_Drp_Data, get_PlateType_Drp_Data, get_State_Drp_Data, get_StyleId_Drp_Data, get_VehicleLossCode_Drp_Data, get_Vehicle_Color_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
import { threeColArray } from '../../../../Common/ChangeArrayFormat';
import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../../Utility/Personnel/Validation';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import MasterNameModel from '../../../MasterNameModel/MasterNameModel';
import ChangesModal from '../../../../Common/ChangesModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import ListModal from '../../../Utility/ListManagementModel/ListModal';
import { get_Vehicle_Search_Data } from '../../../../../redux/actions/VehicleAction';
import VehicleSearchTab from '../../../VehicleSearchTab/VehicleSearchTab';
import { Classification_Drp_Data } from '../../../../../redux/actionTypes';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import CreatableSelect from 'react-select/creatable';
import MissingTab from '../../../../Utility/Tab/MissingTab';

const PersonNotify = () => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecEIncID = 0
    let DecMissPerID = 0
    let DecMissVehID = 0

    const query = useQuery();

    var IncID = query?.get("IncId");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var MissVehID = query?.get("MissVehID");
    var MissVehSta = query?.get("MissVehSta");
    let MstPage = query?.get('page');
    let MstVehicle = query?.get('page');

    if (!IncID) { DecEIncID = 0; }
    else { DecEIncID = parseInt(base64ToString(IncID)); }

    if (!MissPerId) { DecMissPerID = 0; }
    else { DecMissPerID = parseInt(base64ToString(MissPerId)); }

    if (!MissVehID) { DecMissVehID = 0; }
    else { DecMissVehID = parseInt(base64ToString(MissVehID)); }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { setChangesStatus, VehicleFilterData, get_Data_Vehicle, datezone, nibrsSubmittedvehicleMain, setnibrsSubmittedvehicleMain, } = useContext(AgencyContext);

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const missingPersonRelationshipDrpData = useSelector((state) => state.DropDown.missingPersonRelationshipDrpData);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const vodIdData = useSelector((state) => state.DropDown.vehicleVODIDDrpData);
    const colorDrp = useSelector((state) => state.DropDown.vehicleColorDrpData);
    const primaryOfficerID = useSelector((state) => state.DropDown.agencyOfficerDrpData)
    const arresteeDrpData = useSelector((state) => state.DropDown.arresteeNameData);
    const modalIdDrp = useSelector((state) => state.DropDown.modalIdDrpData)
    const makeIdDrp = useSelector((state) => state.DropDown.makeIdDrpData)
    const styleIdDrp = useSelector((state) => state.DropDown.styleIdDrpData)
    const classificationID = useSelector((state) => state.DropDown.classificationDrpData)
    const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData)
    const stateList = useSelector((state) => state.DropDown.stateDrpData);
    const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const [lossCode, setLossCode] = useState('');
    const [categoryCode, setCategoryCode] = useState('');
    const [plateTypeCode, setPlateTypeCode] = useState('');
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [plateExpDate, setPlateExpDate] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState('');
    const [possenSinglData, setPossenSinglData] = useState([]);
    const [ownerOfID, setOwnerOfID] = useState('');
    const [nameModalStatus, setNameModalStatus] = useState(false);
    const [type, setType] = useState("MissingPersonVehicleOwner");
    const [missingVehicleID, setMissingVehicleID] = useState()
    const [editval, setEditval] = useState()
    const [vehicleData, setVehicleData] = useState()
    const [possessionID, setPossessionID] = useState();
    const [openPage, setOpenPage] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [searchModalState, setSearchModalState] = useState();
    const [inspectionExpDate, setInspectionExpDate] = useState();
    const [incidentReportedDate, setIncidentReportedDate] = useState(null);

    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'IncidentID': '', 'AgencyID': '', 'CategoryID': null, 'PlateID': null, 'PlateTypeID': null, 'ClassificationID': null, 'VIN': '', 'VODID': null, 'PlateExpireDtTm': '', 'OANID': null, 'StyleID': null, 'MakeID': null, 'ModelID': null, 'ManufactureYear': '', 'Weight': '', 'OwnerID': null,
        'PrimaryColorID': null, 'SecondaryColorID': null, 'Value': '', 'CreatedByUserFK': '', 'VehicleNo': '', 'VehicleNumber': '', 'ReportedDtTm': '', 'LossCodeID': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '',
        'PrimaryOfficerID': '', 'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '', 'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '', 'ModelName': '',
        'VehicleID': '', 'IsMaster': false, otherIdentifyingCharacteristics: ''
    })
    const initialState = {
        // Associated Person Information
        inCompanyWith: null,
        relationship: '',

        // Vehicle Information
        missingVehicle: '',
        lossCode: '',
        category: '',
        reportedDateTime: null,
        plateType: '',
        plateState: '',
        plateNumber: '',
        classification: '',
        vod: '',
        plateExpires: null,
        vin: '',
        style: '',
        owner: '',
        oanId: '',
        model: '',
        primaryColor: '',
        make: '',
        weight: '',
        value: '',
        inspectionSticker: '',
        secondaryColor: '',
        manuYear: null,
        inspectionExpires: null,
        otherIdentifyingCharacteristics: '',

        // Reporting Person Information
        parentSpouseGuardianName: null,

        // Agency Information
        localAgencyHandlingCase: '',
        city: '',
        state: '',
        agencyAddress: '',
        faxNumber: '',
        investigatingOfficer: '',
        phoneNumber: '',
        caseNumber: '',
        emailAddress: ''
    }
    const [personNotifyUIForm, setPersonNotifyUIForm] = useState(initialState);
    const [errors, setErrors] = useState({
        'CategoryIDError': '', 'PlateTypeIDError': '', 'VehicleNoError': '', 'vinLengthError': '', 'LossCodeIDError': '',
        'PlateStateNoError': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("M128", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        }
        else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (loginAgencyID) {
            setValue({
                ...value, 'IncidentID': DecEIncID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'PrimaryOfficerID': loginPinID, 'LossCodeID': 8, 'ReportedDtTm': incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date())
            });
            if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(loginAgencyID)) };
            if (plateTypeIdDrp?.length === 0) { dispatch(get_PlateType_Drp_Data(loginAgencyID)) };
            if (styleIdDrp?.length === 0) { dispatch(get_StyleId_Drp_Data(loginAgencyID)) };
            if (makeIdDrp?.length === 0) { dispatch(get_MakeId_Drp_Data(loginAgencyID)) };
            if (arresteeDrpData?.length === 0) { dispatch(get_ArresteeName_Data('', '', DecEIncID)) }
            if (vodIdData?.length === 0) { dispatch(get_Data_VODID_Drp_Data(loginAgencyID)) };
            if (colorDrp?.length === 0) { dispatch(get_Vehicle_Color_Drp_Data(loginAgencyID)) };
            if (primaryOfficerID?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)) };
            if (stateList?.length === 0) { dispatch(get_State_Drp_Data()) };
            if (missingPersonRelationshipDrpData?.length === 0) { dispatch(get_Missing_Person_Relationship_Drp_Data(loginAgencyID)) };
            PropertyType(loginAgencyID); get_Data_Vehicle(DecEIncID);
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(DecEIncID)) }
        }
    }, [loginAgencyID, incReportedDate]);

    useEffect(() => {
        if (possessionID) { setValue({ ...value, ['OwnerID']: parseInt(possessionID) }) }
    }, [possessionID, arresteeDrpData]);

    useEffect(() => {
        if (VehicleFilterData?.length > 0) {
            const normalObjectArray = VehicleFilterData?.map(vehicle => {
                return {
                    value: vehicle.PropertyID, label: vehicle.VehicleNumber
                };
            });
            setVehicleData(normalObjectArray)
        }
    }, [VehicleFilterData])


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
            }
            else { setCategoryIdDrp([]); }
        })
    }

    useEffect(() => {
        if (DecMissVehID) {
            GetSingleDataVehicle(DecMissVehID);
            GetSingleDataPersonInfo(DecMissPerID);

        }
    }, [DecMissVehID]);

    useEffect(() => {
        if (DecMissPerID) {
            GetSingleData(DecMissPerID);
            GetSingleDataPersonInfo(DecMissPerID);
        }
    }, [DecMissPerID]);

    const GetSingleDataVehicle = (VehicleID, masterPropertyID) => {
        const val = { 'PropertyID': VehicleID, 'MasterPropertyID': masterPropertyID, 'IsMaster': false, 'PINID': loginPinID }
        fetchPostData('PropertyVehicle/GetSingleData_PropertyVehicle', val).then((res) => {
            if (res.length > 0) {
                reset()
                setEditval(res);
            } else { setEditval([]) }
        })
    }

    const GetSingleData = () => {
        const val = { 'MissingPersonID': DecMissPerID, }
        fetchPostData('MissingPerson/GetSingleData_MissingPerson', val).then((res) => {
            if (res.length > 0) {
                reset()
                setEditval(res);
            } else { setEditval([]) }
        })
    }
    const GetSingleDataPersonInfo = () => {
        const val = { 'MissingPersonID': DecMissPerID, }
        fetchPostData('MissingPersonAssociated/GetData_MissingPersonAssociated', val).then((res) => {
            if (res.length > 0) {
                reset()
                // setEditval(res);
                setPersonNotifyUIForm({
                    ...personNotifyUIForm,
                    inCompanyWith: res[0]?.InCompanyWith,
                    relationship: res[0]?.RelationshipID,
                    otherIdentifyingCharacteristics: res[0]?.OtherIdentifyingVehicle,
                    parentSpouseGuardianName: res[0]?.ParentSpouseGuardianName,
                    localAgencyHandlingCase: res[0]?.LocalAgencyHandlingCase,
                    city: res[0]?.City,
                    state: res[0]?.State,
                    agencyAddress: res[0]?.AgencyAddress,
                    faxNumber: res[0]?.FaxNumber,
                    investigatingOfficer: res[0]?.InvestigatingOfficer,
                    phoneNumber: res[0]?.PhoneNumber,
                    caseNumber: res[0]?.CaseNumber,
                    emailAddress: res[0]?.EmailAddress,
                })

            } else { }
        })
    }

    useEffect(() => {
        if (editval) {
            setValue({
                ...value,
                'SecondaryColorID': editval[0]?.SecondaryColorID, 'IncidentID': editval[0]?.IncidentID, 'PrimaryColorID': editval[0]?.PrimaryColorID, 'OwnerID': editval[0]?.OwnerID, 'ModelID': editval[0]?.ModelID, 'MakeID': editval[0]?.MakeID, 'StyleID': editval[0]?.StyleID, 'OANID': editval[0]?.OANID, 'VODID': editval[0]?.VODID, 'ClassificationID': editval[0]?.ClassificationID, 'PlateTypeID': editval[0]?.PlateTypeID, 'PlateID': editval[0]?.PlateID, 'CategoryID': editval[0]?.CategoryID, 'VehicleNumber': editval[0]?.VehicleNumber, 'Weight': editval[0]?.Weight, 'ManufactureYear': editval[0]?.ManufactureYear, 'VIN': editval[0]?.VIN ? editval[0]?.VIN : '', 'VehicleNo': editval[0]?.VehicleNo, 'PlateExpireDtTm': editval[0]?.PlateExpireDtTm, 'ModifiedByUserFK': loginPinID, 'Value': editval[0]?.Value ? editval[0]?.Value : "", 'VehicleID': editval[0]?.PropertyID,
                // 'ReportedDtTm': editval[0]?.ReportedDtTm ? getShowingDateText(editval[0]?.ReportedDtTm) : '', 
                'ReportedDtTm': editval[0]?.ReportedDtTm ? getShowingDateText(editval[0]?.ReportedDtTm) : '' || editval[0]?.MissingPerson_ReportedDttm ? getShowingDateText(editval[0]?.MissingPerson_ReportedDttm) : '', 'LossCodeID': editval[0]?.LossCodeID, 'Inspection_Sticker': editval[0]?.Inspection_Sticker, 'InspectionExpiresDtTm': editval[0]?.InspectionExpiresDtTm, 'PrimaryOfficerID': editval[0]?.PrimaryOfficerID, 'InProfessionOf': editval[0]?.InProfessionOf, 'TagID': editval[0]?.TagID, 'NICBID': editval[0]?.NICBID, 'DestroyDtTm': editval[0]?.DestroyDtTm, 'Description': editval[0]?.Description, 'IsEvidence': editval[0]?.IsEvidence, 'IsPropertyRecovered': editval[0]?.IsPropertyRecovered, 'IsImmobalizationDevice': editval[0]?.IsImmobalizationDevice, 'IsEligibleForImmobalization': editval[0]?.IsEligibleForImmobalization, 'ModelName': editval[0]?.ModelName,
            })
            dispatch(get_Classification_Drp_Data(editval[0]?.CategoryID)); setOwnerOfID(editval[0]?.OwnerID); setPossessionID(editval[0]?.OwnerID);
            setIncidentReportedDate(editval[0]?.ReportedDtTm ? new Date(editval[0]?.ReportedDtTm) : null); setnibrsSubmittedvehicleMain(editval[0]?.IsNIBRSSummited); dispatch(get_ModalId_Drp_Data(loginAgencyID, editval[0]?.MakeID)); setInspectionExpDate(editval[0]?.InspectionExpiresDtTm ? new Date(editval[0]?.InspectionExpiresDtTm) : ''); setManufactureDate(editval[0]?.ManufactureYear ? new Date(editval[0]?.ManufactureYear) : ''); setPlateExpDate(editval[0]?.PlateExpireDtTm ? new Date(editval[0]?.PlateExpireDtTm) : ''); setMissingVehicleID(editval[0]?.PropertyID); setCategoryCode(getCategoryCode(editval, categoryIdDrp));
        } else {
            setValue({
                ...value,
                'AgencyID': loginAgencyID, 'CategoryID': null, 'PlateID': null, 'PlateTypeID': null, 'ClassificationID': null, 'VIN': '', 'VODID': null, 'PlateExpireDtTm': '', 'OANID': null, 'StyleID': null, 'MakeID': null, 'ModelID': null, 'ManufactureYear': '', 'Weight': '', 'OwnerID': null, 'PrimaryColorID': null, 'SecondaryColorID': null, 'Value': '', 'CreatedByUserFK': '', 'VehicleNo': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '', 'VehicleNumber': '', 'PrimaryOfficerID': '', 'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '', 'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '', 'ModelName': '',
                'IsMaster': false,
            })
        }
    }, [editval])

    const check_Validation_Error = (e) => {
        const LossCodeIDErr = RequiredFieldIncident(value.LossCodeID);
        const CategoryIDErr = RequiredFieldIncident(value.CategoryID);
        const PlateTypeIDErr = RequiredFieldIncident(value.PlateTypeID);
        const PlateStateNoErr = categoryCode === "NMVs" || plateTypeCode === "Unknown" ? 'true' : RequiredFieldIncident(value.PlateID);
        const VehicleNoErr = value?.PlateID ? RequiredFieldIncident(value.VehicleNo) : 'true';
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

    const { CategoryIDError, PlateTypeIDError, PlateStateNoError, ContactError, VehicleNoError, vinLengthError, LossCodeIDError } = errors

    useEffect(() => {
        if (CategoryIDError === 'true' && PlateTypeIDError === 'true' && PlateStateNoError === 'true' && ContactError === 'true' && VehicleNoError === 'true' && vinLengthError === 'true' && LossCodeIDError === 'true') {
            if (missingVehicleID && (MissVehSta === true || MissVehSta || 'true')) {
                Update_MissingVehicle_Data()
            } else {
                Insert_Vehicle();
            }
        }
    }, [CategoryIDError, PlateTypeIDError, PlateStateNoError, ContactError, VehicleNoError, vinLengthError, LossCodeIDError]);

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
    const handlePersonNotifyUIChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPersonNotifyUIForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const ChangeDropDownMake = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
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
                setCategoryCode(e.id); dispatch(get_Classification_Drp_Data(e.value));
                get_StyleId_Drp_Data(loginAgencyID, e.value); get_MakeId_Drp_Data(loginAgencyID, e.value);
                setValue(prev => ({ ...prev, [name]: e.value, MakeID: '', StyleID: '' }));
            } else if (name === 'PlateTypeID') {
                setPlateTypeCode(e.id);
                setValue(prev => ({ ...prev, [name]: e.value }));
            } else {
                setValue(prev => ({ ...prev, [name]: e.value }));
            }
        } else if (e === null) {
            if (name === 'CategoryID') {
                setCategoryCode('');
                setValue(prev => ({ ...prev, CategoryID: '', ClassificationID: '', MakeID: '', StyleID: '' }));
                dispatch(get_Classification_Drp_Data('')); dispatch({ type: Classification_Drp_Data, payload: [] });

            } else if (name === 'MakeID') {
                setValue(prev => ({ ...prev, MakeID: '', ModelID: '', ModelName: '' }));
                dispatch(get_ModalId_Drp_Data(loginAgencyID, ''));
            }
            else if (name === 'ModelID') {
                setValue(prev => ({ ...prev, ModelID: '', ModelName: '', }));
            }
            else if (name === 'PlateTypeID') {
                setPlateTypeCode(""); setValue(prev => ({ ...prev, [name]: null }));
            } else {
                setValue(prev => ({ ...prev, [name]: null }));
            }
        } else {
            setValue(prev => ({ ...prev, [name]: null }));
        }
    };

    const ChangeDropDown = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'MakeID') {
                dispatch(get_ModalId_Drp_Data(loginAgencyID, e.value)); setValue({ ...value, ['MakeID']: e.value });
            } else if (name === 'CategoryID') {
                setCategoryCode(e.id); setPlateTypeCode(""); dispatch(get_Classification_Drp_Data(e.value))
                setValue({ ...value, [name]: e.value, }); setErrors({ ...errors, 'CategoryIDError': '' })
            } else if (name === 'PlateTypeID') {
                setPlateTypeCode(e.id); setValue({ ...value, [name]: e.value }); setErrors({ ...errors, 'PlateTypeIDError': '' })
            } else if (name === 'VehicleID') {
                setValue({ ...value, [name]: e.value });
                if (e.value) {
                    navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${true}&MissVehID=${stringToBase64(e.value)}&MissVehSta=${true}`)
                }
            } else if (name === 'OwnerID') {
                setValue({ ...value, [name]: e.value }); setOwnerOfID(e.value); setPossessionID(e.value); setPossenSinglData([])
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else if (e === null) {
            if (name === 'CategoryID') {
                setCategoryCode(''); setPlateTypeCode(""); setValue({ ...value, ['CategoryID']: '', ['ClassificationID']: '', });
                dispatch(get_Classification_Drp_Data('')); dispatch({ type: Classification_Drp_Data, payload: [] });
            }
            if (name === 'OwnerID') {
                setValue({ ...value, [name]: null }); setOwnerOfID(null); setPossessionID(null); setPossenSinglData([]);
            }
            else if (name === 'PlateTypeID') {
                setPlateTypeCode(""); setValue({ ...value, [name]: null });
            } else {
                setValue({ ...value, [name]: null });
            }
        } else {
            setValue({ ...value, [name]: null });
        }
    }


    const HandleChanges = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e.target.name === 'Value') {
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
        } else if (e.target.name === 'VIN' || e.target.name === 'OANID' || e.target.name === 'VehicleNo') {
            var ele = e.target.value.replace(/[^0-9a-zA-Z]/g, "")
            const checkNumber = ele.toUpperCase();
            setValue({ ...value, [e.target.name]: checkNumber }); setErrors({ ...errors, 'VehicleNoError': '' })
        } else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    }

    const reset = () => {
        setValue({
            ...value,
            'CategoryID': null, 'PlateID': null, 'PlateTypeID': null, 'ClassificationID': null, 'VIN': '', 'VODID': null, 'PlateExpireDtTm': '', 'OANID': '', 'StyleID': null, 'MakeID': null, 'ModelID': null, 'ManufactureYear': '', 'Weight': '', 'OwnerID': null,
            'PrimaryColorID': null, 'SecondaryColorID': null, 'Value': '', 'CreatedByUserFK': '', 'VehicleNo': '', 'VehicleID': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '', 'PrimaryOfficerID': '', 'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '', 'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '', 'VehicleNumber': '', 'LossCodeID': '', 'ReportedDtTm': MstVehicle === "MST-Vehicle-Dash" ? getShowingMonthDateYear(new Date(datezone)) : incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()),
        })
        setPersonNotifyUIForm(initialState)
        setErrors({
            ...errors, 'CategoryIDError': '', 'PlateTypeIDError': '', 'VehicleNoError': '', 'ContactError': '', 'vinLengthError': '', 'LossCodeIDError': '', 'PlateStateNoError': '',
        })
        setPlateExpDate(); setManufactureDate(); setOwnerOfID(''); setPossessionID(''); setInspectionExpDate(); setnibrsSubmittedvehicleMain(0);
    }

    const Insert_Vehicle = () => {
        const {
            IncidentID, CategoryID, PlateID, PlateTypeID, ClassificationID, VIN, VODID, PlateExpireDtTm, OANID, StyleID, MakeID, ModelID, ManufactureYear, Weight, OwnerID, PrimaryColorID, SecondaryColorID, Value, VehicleNo, VehicleID, VehicleNumber, ReportedDtTm, LossCodeID, Inspection_Sticker, InspectionExpiresDtTm, PrimaryOfficerID, InProfessionOf, TagID, NICBID, DestroyDtTm, Description, IsEvidence, IsPropertyRecovered, IsImmobalizationDevice, IsEligibleForImmobalization, ModelName
        } = value;

        let finalVehicleID = VehicleID;
        // ✅ If VehicleID is missing but VehicleNumber is provided, match from vehicleData
        if (!finalVehicleID && VehicleNumber && vehicleData?.length > 0) {
            const matchedVehicle = vehicleData.find(v => v.label === VehicleNumber);
            if (matchedVehicle) {
                finalVehicleID = matchedVehicle.value;
            } else {
                toastifyError('Vehicle Number does not match any existing vehicle.');
            }
        }
        const val = {
            IncidentID: IncidentID,
            AgencyID: loginAgencyID,
            CategoryID: CategoryID,
            PlateID: PlateID,
            PlateTypeID: PlateTypeID,
            ClassificationID: ClassificationID,
            VIN: VIN,
            VODID: VODID,
            PlateExpireDtTm: PlateExpireDtTm,
            OANID: OANID,
            StyleID: StyleID,
            MakeID: MakeID,
            ModelID: ModelID,
            ManufactureYear: ManufactureYear,
            Weight: Weight,
            OwnerID: OwnerID,
            PrimaryColorID: PrimaryColorID,
            SecondaryColorID: SecondaryColorID,
            Value: Value,
            CreatedByUserFK: loginPinID,
            VehicleNo: VehicleNo,
            MissingPersonVehicleID: missingVehicleID,
            ReportedDtTm: ReportedDtTm,
            LossCodeID: LossCodeID,
            Inspection_Sticker: Inspection_Sticker,
            InspectionExpiresDtTm: InspectionExpiresDtTm,
            PrimaryOfficerID: loginPinID,
            InProfessionOf: InProfessionOf,
            TagID: TagID,
            NICBID: NICBID,
            DestroyDtTm: DestroyDtTm,
            Description: Description,
            IsEvidence: IsEvidence,
            IsPropertyRecovered: IsPropertyRecovered,
            IsImmobalizationDevice: IsImmobalizationDevice,
            IsEligibleForImmobalization: IsEligibleForImmobalization,
            IsMaster: false,
            ModelName: ModelName,
            VehicleID: finalVehicleID, // ✅ Use updated ID here
        };

        AddDeleteUpadate('PropertyVehicle/Insert_PropertyVehicle', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                if (res?.PropertyID) {
                    navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=true&MissVehID=${stringToBase64(res?.PropertyID)}&MissPerSta=true`);
                    Insert_PersonInfo(res?.VehicleID);
                    // Insert_MisingPerson_Vehicle(res?.PropertyID);
                }

                get_Data_Vehicle(DecEIncID);
                setErrors({ ...errors, CategoryIDError: '' });
                PropertyType(loginAgencyID);
                setChangesStatus(false);
                setStatesChangeStatus(false);
            } else {
                toastifyError('Error');
                setErrors({ ...errors, CategoryIDError: '' });
            }
        });
    };

    const Insert_PersonInfo = (VehicleID) => {
        const val = {
            "VehicleID": VehicleID,
            "AgencyID": loginAgencyID,
            "CreatedByUserFK": loginPinID,
            "MissingPersonID": DecMissPerID,

            "InCompanyWith": personNotifyUIForm.inCompanyWith,
            "RelationshipID": personNotifyUIForm.relationship,
            "OtherIdentifyingVehicle": personNotifyUIForm.otherIdentifyingCharacteristics,
            "ParentSpouseGuardianName": personNotifyUIForm.parentSpouseGuardianName,
            "LocalAgencyHandlingCase": personNotifyUIForm.localAgencyHandlingCase,
            "City": personNotifyUIForm.city,
            "State": personNotifyUIForm.state,
            "AgencyAddress": personNotifyUIForm.agencyAddress,
            "FaxNumber": personNotifyUIForm.faxNumber,
            "InvestigatingOfficer": personNotifyUIForm.investigatingOfficer,
            "PhoneNumber": personNotifyUIForm.phoneNumber,
            "CaseNumber": personNotifyUIForm.caseNumber,
            "EmailAddress": personNotifyUIForm.emailAddress,
        }
        AddDeleteUpadate('MissingPersonAssociated/InsertMissingPersonAssociated', val).then((res) => {
            if (res.success) {

            } else {
                toastifyError('Error'); setErrors({ ...errors, ['CategoryIDError']: '' });
            }
        })
    }

    const Update_PersonInfo = (VehicleID) => {
        const val = {
            "VehicleID": VehicleID,
            "AgencyID": loginAgencyID,
            "CreatedByUserFK": loginPinID,
            "MissingPersonID": DecMissPerID,

            "InCompanyWith": personNotifyUIForm.inCompanyWith,
            "RelationshipID": personNotifyUIForm.relationship,
            "OtherIdentifyingVehicle": personNotifyUIForm.otherIdentifyingCharacteristics,
            "ParentSpouseGuardianName": personNotifyUIForm.parentSpouseGuardianName,
            "LocalAgencyHandlingCase": personNotifyUIForm.localAgencyHandlingCase,
            "City": personNotifyUIForm.city,
            "State": personNotifyUIForm.state,
            "AgencyAddress": personNotifyUIForm.agencyAddress,
            "FaxNumber": personNotifyUIForm.faxNumber,
            "InvestigatingOfficer": personNotifyUIForm.investigatingOfficer,
            "PhoneNumber": personNotifyUIForm.phoneNumber,
            "CaseNumber": personNotifyUIForm.caseNumber,
            "EmailAddress": personNotifyUIForm.emailAddress,
        }
        AddDeleteUpadate('MissingPersonAssociated/UpdateMissingPersonAssociated', val).then((res) => {
            if (res.success) {

            } else {
                toastifyError('Error'); setErrors({ ...errors, ['CategoryIDError']: '' });
            }
        })
    }

    const Update_MissingVehicle_Data = () => {
        const previousValue = value.Value;
        const { IncidentID, CategoryID, PlateID, PlateTypeID, ClassificationID, VIN, VODID, PlateExpireDtTm, OANID, StyleID, MakeID, ModelID, ManufactureYear, Weight, OwnerID, PrimaryColorID, SecondaryColorID, Value, VehicleNo, VehicleID, VehicleNumber, ReportedDtTm, LossCodeID, Inspection_Sticker, InspectionExpiresDtTm, PrimaryOfficerID, InProfessionOf, TagID, NICBID, DestroyDtTm, Description, IsEvidence, IsPropertyRecovered, IsImmobalizationDevice, IsEligibleForImmobalization, ModelName
        } = value;
        const val = {
            'IncidentID': IncidentID, 'AgencyID': loginAgencyID, 'CategoryID': CategoryID, 'PlateID': PlateID, 'PlateTypeID': PlateTypeID, 'ClassificationID': ClassificationID, 'VIN': VIN, 'VODID': VODID, 'PlateExpireDtTm': PlateExpireDtTm, 'OANID': OANID, 'StyleID': StyleID, 'MakeID': MakeID, 'ModelID': ModelID, 'ManufactureYear': ManufactureYear, 'Weight': Weight, 'OwnerID': OwnerID, 'PrimaryColorID': PrimaryColorID, 'SecondaryColorID': SecondaryColorID, 'Value': Value, 'ModifiedByUserFK': loginPinID, 'VehicleNo': VehicleNo, 'MissingPersonVehicleID': missingVehicleID, 'PropertyID': VehicleID, 'ReportedDtTm': ReportedDtTm, 'LossCodeID': LossCodeID, 'Inspection_Sticker': Inspection_Sticker, 'InspectionExpiresDtTm': InspectionExpiresDtTm, 'PrimaryOfficerID': loginPinID, 'InProfessionOf': InProfessionOf, 'TagID': TagID, 'NICBID': NICBID, 'DestroyDtTm': DestroyDtTm, 'Description': Description, 'IsEvidence': IsEvidence, 'IsPropertyRecovered': IsPropertyRecovered, 'IsImmobalizationDevice': IsImmobalizationDevice, 'IsEligibleForImmobalization': IsEligibleForImmobalization, 'VehicleNumber': VehicleNumber, 'ModelName': ModelName
        }
        AddDeleteUpadate('PropertyVehicle/Update_PropertyVehicle', val).then((res) => {
            if (res.success) {

                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); setChangesStatus(false); setErrors({ ...errors, ['CategoryIDError']: '' });
                setValue({ ...value, Value: previousValue, });
                Insert_MisingPerson_Vehicle(VehicleID);
                Update_PersonInfo(VehicleID);
                setStatesChangeStatus(false)
            } else {
                toastifyError('Error'); setErrors({ ...errors, ['CategoryIDError']: '' });
            }
        })
    }

    const Insert_MisingPerson_Vehicle = (vehID) => {
        const val = { 'PropertyID': vehID, 'MissingPersonID': DecMissPerID, 'ModifiedByUserFK': loginPinID }
        AddDeleteUpadate('MissingPerson/Insert_MissingPersonVehicle', val).then((res) => {
            if (res.success) {

            } else {
                toastifyError('Error'); setErrors({ ...errors, ['CategoryIDError']: '' });
            }
        })
    }

    const Delete_MisingPerson_Vehicle = () => {
        const val = { 'PropertyID': '', 'MissingPersonID': DecMissPerID, 'ModifiedByUserFK': loginPinID }
        AddDeleteUpadate('MissingPerson/Insert_MissingPersonVehicle', val).then((res) => {
            if (res.success) {
                toastifySuccess("Deleted Successfully");
                navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${true}&MissVehID=${''}&MissPerSta=${true}`)
                GetSingleDataVehicle('')
                // GetSingleDataPersonInfo(DecMissPerID);
            } else {
                toastifyError('Error'); setErrors({ ...errors, ['CategoryIDError']: '' });
            }
        })
    }

    const GetSingleDataPassion = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID }
        fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
            if (res) {
                setPossenSinglData(res);
            } else { setPossenSinglData([]); }
        })
    }

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

    const setToReset = () => {
        navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${MissPerId}&MissPerSta=${true}&MissVehID=${''}&MissVehSta=${false}`)
        setMissingVehicleID(''); reset(); setChangesStatus(false);

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

    const ChangeDropDown1 = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
        if (e) {
            if (name === 'MakeID') {
                dispatch(get_ModalId_Drp_Data(loginAgencyID, e.value))
                setValue({ ...value, ['MakeID']: e.value });
            }
            setValue({ ...value, [name]: e.value });

        } else if (e === null) {
            if (name === 'MakeID') {
                setValue({ ...value, ['MakeID']: '', ['ModelID']: '' });
                dispatch(get_ModalId_Drp_Data(loginAgencyID, ''))
            }
            setValue({ ...value, [name]: null });

        } else {
            setValue({ ...value, [name]: null });

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

    const handleDropDownChange = (e, name) => {
        !addUpdatePermission && setStatesChangeStatus(true);
        !addUpdatePermission && setChangesStatus(true);
        if (e) {
            setPersonNotifyUIForm({ ...personNotifyUIForm, [name]: e.value })
        } else if (e === null) {
            setPersonNotifyUIForm({ ...personNotifyUIForm, [name]: null })
        } else {
            setPersonNotifyUIForm({ ...personNotifyUIForm, [name]: null })
        }
    }
    return (
        <>
        <div className='col-12 child'>
            <fieldset className='mt-2'>
                <legend>Associated Person Information</legend>
                <div className="col-12 mt-4">
                    <div className="row">

                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>In Company With</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-4 mt-1 ">
                            <Select
                                name='inCompanyWith'
                                value={arresteeDrpData?.filter((obj) => obj.value === personNotifyUIForm?.inCompanyWith)}
                                styles={customStylesWithOutColor}
                                options={arresteeDrpData}
                                onChange={(e) => handleDropDownChange(e, 'inCompanyWith')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-1 col-md-1 col-lg-1   px-0" style={{ marginTop: '8px' }}>
                            <button

                                onClick={() => {
                                    if (possessionID) { GetSingleDataPassion(possessionID); }
                                    else {
                                        setPossessionID('');
                                        setPossenSinglData('');
                                    }
                                    setNameModalStatus(true);
                                    setType("MissingPersonVehicleOwner");

                                }}
                                className="btn btn-sm bg-green text-white py-0" data-toggle="modal" data-target="#MasterModal">
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1">
                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Missing Person Relationship') }}>
                                Relationship
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-4 mt-1 ">
                            <Select
                                styles={customStylesWithOutColor}
                                name="relationship"
                                value={missingPersonRelationshipDrpData?.filter((obj) => obj.value === value?.relationship)}
                                options={missingPersonRelationshipDrpData}
                                onChange={(e) => { ChangeDropDown(e, 'relationship') }}

                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                    </div>
                </div>
            </fieldset>

            <fieldset className='mt-2'>
                <legend>Vehicle Information</legend>
                <div className="col-12 mt-4">
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Missing&nbsp;Vehicle</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-6  mt-1">
                            <Select
                                name='VehicleID'
                                styles={customStylesWithOutColor}
                                isDisabled={missingVehicleID && (MissVehSta === true || MissVehSta || 'true') ? true : false}

                                value={vehicleData?.filter((obj) => obj.value === value?.VehicleID)}

                                onChange={(e) => {
                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

                                    ChangeDropDown(e, 'VehicleID');
                                    if (!e) { setToReset(); }
                                }}
                                options={vehicleData}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 pt-1 px-4">
                            <label htmlFor="" className='new-label'>Reported Date/Time{errors.ReportedDtTmError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ReportedDtTmError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-10 col-md-10 col-lg-3 ">
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
                                            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

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
                                        className={nibrsSubmittedvehicleMain === 1 ? 'readonlyColor' : 'requiredColor'}
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
                                            setIncidentReportedDate(date ? getShowingMonthDateYear(date) : null);
                                            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
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
                                        className={nibrsSubmittedvehicleMain === 1 ? 'readonlyColor' : 'requiredColor'}
                                    />
                            }
                        </div>
                    </div>
                </div>
                <div className="col-12 ">
                    <div className="row">
                        <div className="col-2 col-md-2 col-lg-1 mt-2 " >
                            <label htmlFor="" className='new-label'>Loss Code{errors.LossCodeIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1" >
                            <Select
                                name='LossCodeID'
                                value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                styles={Requiredcolour}
                                options={propertyLossCodeData}
                                onChange={(e) => ChangeDropDown(e, 'LossCodeID')}

                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'> Category {errors.CategoryIDError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2  mt-1">
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
                                isDisabled={!value?.CategoryID}
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">

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
                                styles={Requiredcolour}
                                options={plateTypeIdDrp ? getPlateTypeOption(plateTypeIdDrp) : []}
                                onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-12 col-md-12 col-lg-4 d-flex ">
                            <div className="col-3 col-md-2 col-lg-4 mt-2 pt-1 text-left ">
                                <label htmlFor="" className='new-label '>
                                    Plate&nbsp;State&nbsp;&&nbsp;No.
                                    {errors.PlateStateNoError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', paddingLeft: '7px' }}>{errors.PlateStateNoError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-4 col-md-6 col-lg-5 mt-1" >
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
                                        isDisabled={!value?.PlateID}
                                        type="text" name='VehicleNo' id='VehicleNo' maxLength={8} value={value?.VehicleNo} onChange={HandleChanges} required placeholder='Number..' autoComplete='off' style={{ padding: "5px" }} />
                                </div>
                                {errors.VehicleNoError !== 'true' && value.PlateID ? (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', paddingLeft: '7px' }}>{errors.VehicleNoError}</p>
                                ) : null}
                            </span>
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>VIN {errors.vinLengthError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.vinLengthError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field d-flex">
                            <input type="text" name='VIN' id='VIN' maxLength={17} value={value?.VIN} onChange={HandleChanges} className='' required autoComplete='off' />
                            <span className='mt-1 mx-2 '>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success"
                                    data-toggle="modal"
                                    data-target="#PropertyModal"
                                    onClick={() => {
                                        dispatch(get_Vehicle_Search_Data(value?.VIN, value?.VODID, value?.PlateExpireDtTm, value?.OANID, value?.StyleID, value?.PrimaryColorID, value?.SecondaryColorID, value?.Value, value?.Inspection_Sticker, value?.InspectionExpiresDtTm, value?.IsEvidence, value?.LossCodeID, value?.MakeID, value?.ManufactureYear, value?.PlateID, value?.VehicleNo, value?.PlateTypeID, value?.CategoryID, value?.ClassificationID, value?.PrimaryOfficerID, loginAgencyID, value?.AgencyID, value?.PlateID, setSearchModalState));
                                        setSearchModalState(true)
                                    }}
                                >
                                    Search
                                </button>
                            </span>
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">

                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Vehicle VOD') }}>
                                VOD
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 pt-1">
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
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Plate Expires</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2  ">
                            {/* <DatePicker
                                                    id='PlateExpireDtTm'
                                                    name='PlateExpireDtTm'
                                                    ref={startRef1}

                                                    onKeyDown={(e) => {
                                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                            e?.preventDefault();
                                                        } else {
                                                            onKeyDown(e);
                                                        }
                                                    }}
                                                    onChange={(date) => { setPlateExpDate(date); setValue({ ...value, ['PlateExpireDtTm']: date ? getShowingMonthDateYear(date) : null }); setStatesChangeStatus(true); setChangesStatus(true) }}
                                                    dateFormat="MM/dd/yyyy"
                                                    isClearable={value?.PlateExpireDtTm ? true : false}
                                                    selected={plateExpDate}
                                                    placeholderText={value?.PlateExpireDtTm ? value?.PlateExpireDtTm : 'Select...'}
                                                    autoComplete="off"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                /> */}
                            <DatePicker
                                id='PlateExpireDtTm'
                                name='PlateExpireDtTm'
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
                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                    setPlateExpDate(date);
                                    setValue({ ...value, ['PlateExpireDtTm']: date ? getShowingMonthDateYear(date) : null });
                                }}
                                onChangeRaw={(e) => {
                                    const input = e.target.value?.trim();

                                    if (input === '') {
                                        // User cleared the field
                                        setPlateExpDate(null);
                                        setValue({ ...value, ['PlateExpireDtTm']: null });
                                    } else {
                                        const parsedDate = new Date(input);
                                        if (isNaN(parsedDate?.getTime())) {
                                            // Invalid input, set current date
                                            const now = new Date();
                                            setPlateExpDate(now);
                                            setValue({ ...value, ['PlateExpireDtTm']: getShowingMonthDateYear(now) });
                                        }
                                        // Else valid input will be handled by onChange
                                    }
                                }}
                                dateFormat="MM/dd/yyyy"
                                isClearable={!!value?.PlateExpireDtTm}
                                selected={plateExpDate}
                                placeholderText={value?.PlateExpireDtTm || 'Select...'}
                                autoComplete="off"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>OAN Id</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field ">
                            <input type="text" name='OANID' id='OANID' value={value?.OANID} onChange={HandleChanges} className='' required maxLength={20} autoComplete='off' />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">

                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Style') }}>
                                Style
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 ">
                            <Select
                                name='StyleID'
                                value={styleIdDrp?.filter((obj) => obj.value === value?.StyleID)}
                                styles={customStylesWithOutColor}
                                options={styleIdDrp}
                                onChange={(e) => ChangeDropDown(e, 'StyleID')}
                                isClearable
                                isDisabled={value?.CategoryID ? false : true}
                                className={!value?.CategoryID ? 'readonlyColor' : ''}
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Owner</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                            <Select
                                name='OwnerID'
                                value={arresteeDrpData?.filter((obj) => obj.value === value?.OwnerID)}
                                styles={customStylesWithOutColor}
                                options={arresteeDrpData}
                                onChange={(e) => ChangeDropDown(e, 'OwnerID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-6 col-md-6 col-lg-1   px-0" style={{ marginTop: '8px' }}>
                            <button

                                onClick={() => {
                                    if (possessionID) { GetSingleDataPassion(possessionID); }
                                    else {
                                        setPossessionID('');
                                        setPossenSinglData('');
                                    }
                                    setNameModalStatus(true);
                                    setType("MissingPersonVehicleOwner");

                                }}
                                className="btn btn-sm bg-green text-white py-0" data-toggle="modal" data-target="#MasterModal">
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Make') }}>
                                Make
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 ">
                            <Select
                                name='MakeID'
                                value={makeIdDrp?.filter((obj) => obj.value === value?.MakeID)}
                                styles={customStylesWithOutColor}
                                options={makeIdDrp}
                                onChange={(e) => ChangeDropDownMake(e, 'MakeID')}
                                isClearable
                                isDisabled={value?.CategoryID ? false : true}
                                className={!value?.CategoryID ? 'readonlyColor' : ''}
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Model</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 ">
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
                                onChange={(e) => ChangeDropDownMake(e, "ModelID")}
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Color') }}>
                                Primary&nbsp;Color
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2 mt-1 ">
                            <Select
                                name='PrimaryColorID'
                                value={colorDrp?.filter((obj) => obj.value === value?.PrimaryColorID)}
                                styles={customStylesWithOutColor}
                                options={colorDrp}
                                onChange={(e) => ChangeDropDown(e, 'PrimaryColorID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">

                            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Color') }}>
                                Secondary Color
                            </span>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1">
                            <Select
                                name='SecondaryColorID'
                                value={colorDrp?.filter((obj) => obj.value === value?.SecondaryColorID)}
                                styles={customStylesWithOutColor}
                                options={colorDrp}
                                onChange={(e) => ChangeDropDown(e, 'SecondaryColorID')}
                                isClearable
                                placeholder="Select..."
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Weight</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-1 mt-1 text-field">
                            <input type="text" name='Weight' id='Weight' maxLength={4} value={value?.Weight} onChange={HandleChanges} className='' required autoComplete='off' />
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Value {errors.ContactError !== 'true' ? (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                            ) : null}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-1 mt-1 text-field">
                            <input
                                type="text"
                                name="Value"
                                id="Value"
                                className={lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                                maxLength={20}
                                value={`$ ${value?.Value}`}
                                onChange={HandleChanges}
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Inspection Sticker</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-1 mt-1 text-field">
                            <input type="text" name='Inspection_Sticker' id='Inspection_Sticker' value={value?.Inspection_Sticker} onChange={HandleChanges} className='' required autoComplete='off' />
                        </div>
                        <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                            <label htmlFor="" className='new-label'>Inspection Expires</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 ">
                            {/* <DatePicker
                                                    id='InspectionExpiresDtTm'
                                                    name='InspectionExpiresDtTm'
                                                    ref={startRef3}
                                                    onKeyDown={(e) => {
                                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                            e.preventDefault();
                                                        } else {
                                                            onKeyDown(e);
                                                        }
                                                    }}
                                                    onChange={(date) => {
                                                        setChangesStatus(true); setStatesChangeStatus(true);
                                                        setInspectionExpDate(date); setValue({ ...value, ['InspectionExpiresDtTm']: date ? getShowingMonthDateYear(date) : null })
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    isClearable={value?.InspectionExpiresDtTm ? true : false}
                                                    selected={inspectionExpDate}
                                                    placeholderText={value?.InspectionExpiresDtTm ? value?.InspectionExpiresDtTm : 'Select...'}
                                                    autoComplete="off"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    minDate={new Date(value?.ReportedDtTm)}
                                                    filterTime={(time) => filterPassedDateTime(time, value?.InspectionExpiresDtTm, value?.ReportedDtTm)}
                                                /> */}
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
                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);

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
                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                            <label htmlFor="" className='new-label'>Manu. Year</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-2 ">
                            <DatePicker
                                name='ManufactureYear'
                                id='ManufactureYear'
                                selected={manufactureDate}
                                onChange={(date) => {
                                    setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }); !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
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
                            />
                        </div>
                        <div className=" col-4 col-md-4 col-lg-1 pt-1 mt-3">
                            <div className="img-box" style={{ marginTop: '-18px' }}>

                            </div>
                        </div>
                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap'>Other Identifying Characteristics of Vehicle</label>
                                <input type='text' name='otherIdentifyingCharacteristics' value={personNotifyUIForm.otherIdentifyingCharacteristics} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='Placeholder' />
                            </div>
                        </div>
                    </div>
                </div>



            </fieldset>

            {/* Reporting Person Information Section */}
            <fieldset className='mt-2'>
                <legend>Reporting Person Information</legend>
                <div className="col-12 mt-4">
                    <div className="row">
                        <div className="col-8 col-md-8 col-lg-8">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap'>Parent/Spouse/Guardian Name</label>

                                <Select
                                    name='parentSpouseGuardianName'
                                    value={arresteeDrpData?.filter((obj) => obj.value === personNotifyUIForm?.parentSpouseGuardianName)}
                                    styles={customStylesWithOutColor}
                                    options={arresteeDrpData}
                                    onChange={(e) => handleDropDownChange(e, 'parentSpouseGuardianName')}
                                    isClearable
                                    placeholder="Select..."
                                    className='w-100'
                                />
                                {/* <input type='text' name='parentSpouseGuardianName' value={personNotifyUIForm.parentSpouseGuardianName} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' /> */}
                                <button className="btn btn-sm bg-primary text-white ml-2">
                                    <i className="fa fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

            {/* Agency Information Section */}
            <fieldset className='mt-2'>
                <legend>Agency Information</legend>
                <div className="col-12 mt-4">
                    <div className="row align-items-center mt-1">
                       
                        <div className="col-4 col-md-4 col-lg-4">
                            <div className="d-flex align-items-center">
                                <label className='new-label mr-2 mb-0 text-nowrap'>Local Agency Handling Case</label>
                                <input type='text' name='localAgencyHandlingCase' value={personNotifyUIForm.localAgencyHandlingCase} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                        <div className="col-1 col-md-1 col-lg-1 mt-1" >
                            <label className='new-label right-align text-right'>City</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3">
                            <div className="d-flex align-items-center">
                                {/* <label className='new-label mr-2 mb-0 text-nowrap'>City</label> */}
                                <input type='text' name='city' value={personNotifyUIForm.city} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                        <div className="col-1 col-md-1 col-lg-1 mt-1" >
                            <label className='new-label right-align text-right'>State</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3">
                            <div className="d-flex align-items-center">
                                <input type='text' name='state' value={personNotifyUIForm.state} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-2 col-md-2 col-lg-1 mt-2" >
                            <label className='new-label right-align text-right'>Agency Address</label>
                        </div>
                        <div className="col-6 col-md-6 col-lg-7">
                            <div className="d-flex align-items-center">
                                <input type='text' name='agencyAddress' value={personNotifyUIForm.agencyAddress} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                        <div className="col-1 col-md-1 col-lg-1 mt-2" >
                            <label className='new-label right-align text-right'>Fax Number</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3">
                            <div className="d-flex align-items-center">
                                <input type='text' name='faxNumber' value={personNotifyUIForm.faxNumber} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-2 col-md-2 col-lg-1 mt-2" >
                            <label className='new-label right-align text-right'>Investigating Officer</label>
                        </div>
                        <div className="col-2 col-md-2 col-lg-3">
                            <div className="d-flex align-items-center">
                                <Select
                                    name='investigatingOfficer'
                                    styles={colourStyles}
                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === personNotifyUIForm?.investigatingOfficer)}
                                    isClearable
                                    options={agencyOfficerDrpData}
                                    onChange={(e) => handleDropDownChange(e, 'investigatingOfficer')}
                                    placeholder="Select..."
                                    className='w-100'
                                />
                            </div>
                        </div>
                        <div className="col-1 col-md-1 col-lg-1 mt-2" >
                            <label className='new-label right-align text-right'>Phone Number</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3">
                            <div className="d-flex align-items-center">
                                <input type='text' name='phoneNumber' value={personNotifyUIForm.phoneNumber} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                        <div className="col-1 col-md-1 col-lg-1 mt-2" >
                            <label className='new-label right-align text-right'>Case Number</label>
                        </div>
                        <div className="col-3 col-md-3 col-lg-3">
                            <div className="d-flex align-items-center">
                                <input type='text' name='caseNumber' value={personNotifyUIForm.caseNumber} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-2 col-md-2 col-lg-1 mt-2" >
                            <label className='new-label right-align text-right'>Email Addres</label>
                        </div>
                        <div className="col-12 col-md-12 col-lg-11">
                            <div className="d-flex align-items-center">
                                <input type='text' name='emailAddress' value={personNotifyUIForm.emailAddress} onChange={handlePersonNotifyUIChange} className='form-control' placeholder='' />
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>

            <div className="col-12 text-right mt-2 p-0">
                <button type="button" className="btn btn-sm btn-success mr-1" onClick={setToReset} >Cancel</button>

                {
                    effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => Delete_MisingPerson_Vehicle()}  >Delete</button>
                        : <></> :
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => Delete_MisingPerson_Vehicle()}  >Delete</button>
                }
                {
                    missingVehicleID && (MissVehSta === true || MissVehSta || 'true') ?
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Update</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Update</button>
                        :
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Save</button>
                            : <></> :
                            <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }} disabled={!statesChangeStatus}>Save</button>
                }
            </div>
            <ChangesModal func={check_Validation_Error} setToReset={setToReset} />
            <ListModal {...{ openPage, setOpenPage }} />
            <VehicleSearchTab {...{ searchModalState, setSearchModalState, possenSinglData, setPossessionID, possessionID, loginAgencyID, setPossenSinglData, GetSingleDataPassion }} />
            <MasterNameModel {...{ value, setValue, nameModalStatus, setNameModalStatus, loginPinID, loginAgencyID, type, possenSinglData, setPossessionID, possessionID, setPossenSinglData, GetSingleDataPassion }} />
            </div>
        </>
    )
}

export default PersonNotify

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