import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select, { components } from "react-select";
import DatePicker from "react-datepicker";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import NirbsErrorShowModal from '../../../Common/NirbsErrorShowModal';
import { check_Category_Nibrs, check_OffenceCode_NoneUnknown, ErrorShow, ErrorTooltip } from '../../Property/PropertyNibrsError';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import { get_PropertyMainModule_Data, } from '../../../../redux/actions/PropertyAction';
import { get_AgencyOfficer_Data, get_ArresteeName_Data, get_DrugManufactured_Drp_Data, get_Masters_Name_Drp_Data, get_MeasureType_Drp_Data, get_PropSourceDrugDrpData, get_PropertyLossCode_Drp_Data, get_PropertyTypeData, get_SuspectedDrug_Drp_Data, get_TypeMarijuana_Drp_Data, } from '../../../../redux/actions/DropDownsData';
import { get_Inc_ReportedDate, get_LocalStoreData } from '../../../../redux/actions/Agency';
import { MasterProperty_ID, Master_Property_Status, Masters_Name_Drp_Data, Property_ID, Property_LossCode_Drp_Data, } from '../../../../redux/actionTypes';
import { RequiredFieldIncident, RequiredFieldOnConditon, RequiredFieldHIN } from '../../Utility/Personnel/Validation';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat, fourColwithExtraCode, offenseArray, threeColVictimOffenseArray, } from '../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData, fetchPostDataNibrs } from '../../../hooks/Api';
import { Decrypt_Id_Name, Encrypted_Id_Name, LockFildscolour, Requiredcolour, base64ToString, filterPassedTimeZonesProperty, getShowingDateText, getShowingMonthDateYear, isLockOrRestrictModule, stringToBase64, tableCustomStyles } from '../../../Common/Utility';
import ChangesModal from '../../../Common/ChangesModal';
import ListModal from '../../Utility/ListManagementModel/ListModal';
import Loader from '../../../Common/Loader';
import DeletePopUpModal from '../../../Common/DeleteModal';
import SelectBox from '../../../Common/SelectBox';


const Properties = ({ propertyClick, isNibrsSummited = false, getIncident_NibrsErrors = () => { }, isLocked, setIsLocked, getPermissionLevelByLock = () => { } }) => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const masterPropertyStatus = useSelector((state) => state.Agency.masterPropertyStatus);
    const propertyMainModuleData = useSelector((state) => state.Property.propertyMainModuleData);

    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
    const propertyLossCodeDrpData = useSelector((state) => state.DropDown.propertyLossCodeDrpData);
    const drugManufacturedDrpData = useSelector((state) => state.DropDown.drugManufacturedDrpData);
    const typeMarijuanaDrpData = useSelector((state) => state.DropDown.typeMarijuanaDrpData);
    const measureTypeDrpData = useSelector((state) => state.DropDown.measureTypeDrpData);
    const suspectedDrugDrpData = useSelector((state) => state.DropDown.suspectedDrugDrpData);
    const propSourceDrugDrpData = useSelector((state) => state.DropDown.propSourceDrugDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };


    let DecPropID = 0, DecMPropID = 0
    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ProId = query?.get("ProId");
    var MProId = query?.get('MProId');
    var ProSta = query?.get('ProSta');
    let FbiCode = query?.get('FbiCode');
    let AttComp = query?.get('AttComp');
    let MstPage = query?.get('page');
    var narrativeId = query?.get("narrativeId");

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!ProId) ProId = 0;
    else DecPropID = parseInt(base64ToString(ProId));
    if (!MProId) ProId = 0;
    else DecMPropID = parseInt(base64ToString(MProId));

    const navigate = useNavigate();

    const { get_Incident_Count, setChangesStatus, get_Property_Count, nibrsSubmittedProperty, setnibrsSubmittedProperty, setcountoffaduit, datezone, GetDataTimeZone, validate_IncSideBar } = useContext(AgencyContext);

    const [incidentReportedDate, setIncidentReportedDate] = useState(null);
    const [propertyCategoryData, setPropertyCategoryData] = useState([]);
    const [propertyClassificationData, setPropertyClassificationData] = useState([]);
    const [editval, setEditval] = useState([]);
    const [propertyNumber, setPropertyNumber] = useState('');
    const [lossCode, setLossCode] = useState('');
    const [openPage, setOpenPage] = useState('');
    //------propertyID, MasterPropertyID------
    const [delPropertyID, setDelPropertyID] = useState('');
    const [propertyID, setPropertyID] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    //------------DrugDataModal---------------
    const [drugData, setDrugData] = useState([]);
    const [propertyDrugID, setPropertyDrugID] = useState();
    const [drugModal, setDrugModal] = useState();
    const [drugEditData, setDrugEditData] = useState([]);
    const [drugTypecode, setDrugTypecode] = useState('');
    const [drugMeasureUnitData, setDrugMeasureUnitData] = useState([]);
    const [drugMeasureTypeData, setDrugMeasureTypeData] = useState([]);
    const [isProperty, setIsProperty] = useState(true);
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [updateCount, setUpdateCount] = useState(0);
    const [possessionID, setPossessionID] = useState('');
    const [drugLocalArr, setDrugLocalArr] = useState([]);
    const [localDrugCount, setLocalDrugCount] = useState(1);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [nibrsCodeArr, setNibrsCodeArr] = useState([]);
    const [propRecType, setPorpRecType] = useState('');
    const [propCategoryCode, setPorpCategoryCode] = useState('');
    const [isDrugOffense, setIsDrugOffense] = useState(false);
    // nibrs
    const [baseDate, setBaseDate] = useState('');
    const [oriNumber, setOriNumber] = useState('');
    const [nibrsValidateData, setnibrsValidateData] = useState([]);
    const [nibrsErrStr, setNibrsErrStr] = useState('');
    const [clickNibloder, setclickNibLoder] = useState(false);
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [nibrsFieldError, setnibrsFieldError] = useState({});
    const [showLossCodeError, setShowLossCodeError] = useState({});

    const [suspectedDrugTypeErrorStatus, setSuspectedDrugTypeErrorStatus] = useState(false);
    const [isPropertyIdZeroError, setIsPropertyIdZeroError] = useState(false);

    const [value, setValue] = useState({
        'MasterPropertyID': '', 'PropertyID': '', 'AgencyID': '', 'IncidentID': '', 'CreatedByUserFK': '', 'ReportedDtTm': '', 'DestroyDtTm': '', 'Value': '',
        'PropertyCategoryCode': '', 'PropertyTypeID': null, 'CategoryID': null, 'ClassificationID': null, 'OfficerID': null, 'LossCodeID': null, 'PossessionOfID': null,
        'PropertyTag': '', 'NICB': '', 'Description': '', 'IsEvidence': '', 'IsSendToPropertyRoom': '', 'IsPropertyRecovered': '', 'MaterialID': null,
        'PropertyArticleID': null, 'SerialID': '', 'ModelID': '', 'OAN': '', 'Quantity': '', 'Brand': '', 'TopColorID': null, 'BottomColorID': null,
        'PropertyBoatID': null, 'BoatIDNumber': '', 'HIN': '', 'RegistrationNumber': '', 'VODID': null, 'Length': '', 'Comments': '', 'ManufactureYear': '',
        'MakeID': null, 'RegistrationExpiryDtTm': '', 'PropulusionID': null, 'RegistrationStateID': null, 'SuspectedDrugTypeID': null, 'SecurityDtTm': '',
        'OtherID': null, 'PropertyOtherID': null, 'PropertySecurityID': null, 'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': null,
        'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'IsAuto': '', 'BarrelLength': '', 'WeaponModelID': null, 'PropertyWeaponID': null,
        'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementTypeID': null, 'ModifiedByUserFK': '', 'PropertyDrugID': 0, 'PropertySourceDrugTypeID': null,
        'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, 'ClandistineLabsNumber': '', 'MasterID': null,
        'IsMaster': MstPage === "MST-Property-Dash" ? true : false, 'PropertyNumber': 'Auto Genrated', 'QuantityUnitID': null,
        'ArticleIDNumber': '',
        'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'MeasurementUnitID': null, 'MeasurementTypeID': null, 'SolidPounds': '', 'PropertyDrugMeasure_Description': '', 'SuspectedDrugType_Description': '', 'ManufactureYearFrom': ''
    });

    const [errors, setErrors] = useState({
        'PropertyTypeIDError': '', 'CategoryIDError': '', 'LossCodeIDError': '', 'OfficerIDError': '', 'ContactError': '',
        //Boat RequireFields
        'RegStateError': '', 'RegNumError': '', 'HINError': '',
    })

    useEffect(() => {
        if (MstPage && possessionID) { setPossessionID(''); dispatch({ type: Masters_Name_Drp_Data, payload: [] }); }
    }, [MstPage]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("P059", localStoreData?.AgencyID, localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID); setBaseDate(localStoreData?.BaseDate ? localStoreData?.BaseDate : null); setOriNumber(localStoreData?.ORI);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            const defaultDate = datezone ? new Date(datezone) : null;
            setValue({
                ...value, 'IncidentID': IncID, 'OfficerID': loginAgencyID, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, 'ReportedDtTm': MstPage != "MST-Property-Dash" ? defaultDate : defaultDate
            });
            dispatch(get_PropertyTypeData(loginAgencyID));
        }
    }, [loginAgencyID, incReportedDate]);

    useEffect(() => {
        if (loginAgencyID || IncID) dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
    }, [loginAgencyID, IncID]);

    useEffect(() => {
        if (DecPropID || DecMPropID) {
            setPropertyID(DecPropID); GetSingleData(DecPropID, DecMPropID); setMasterPropertyID(DecMPropID); get_Property_Count(DecPropID, DecMPropID, MstPage === "MST-Property-Dash" ? true : false);
            get_Data_Porperty_Offence(DecPropID, DecMPropID, IncID)

            getEditOffenseData(DecPropID, DecMPropID, IncID)
        }
    }, [DecPropID, DecMPropID]);

    useEffect(() => {
        if (propertyTypeData?.length != 0) {
            const Id = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });

            if (Id.length > 0 && (ProSta == 'false' || ProSta == false) && !FbiCode) {
                setValue({ ...value, ['PropertyTypeID']: Id[0]?.value, ['PropertyCategoryCode']: Id[0]?.id, })
                PropertyCategory(Id[0]?.value);
            }
        }
    }, [propertyTypeData, localStoreData]);

    useEffect(() => {
        if (IncID) {
            if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
            setMainIncidentID(IncID);
            dispatch(get_PropertyMainModule_Data(IncID, MstPage === "MST-Property-Dash" ? true : false));
            dispatch(get_ArresteeName_Data('', '', IncID));

        }
    }, [IncID, possessionID]);

    useEffect(() => {
        // get Data for offense drop down
        if (propertyID) {
            get_Offense_DropDown(IncID, propertyID);
        } else {
            get_Offense_DropDown(IncID);
        }
    }, [propertyID, IncID]);

    const check_Validation_Error = (e) => {
        const PropertyTypeIDErr = RequiredFieldIncident(value?.PropertyTypeID);
        const CategoryIDErr = RequiredFieldIncident(value?.CategoryID);
        const LossCodeIDErr = RequiredFieldIncident(value?.LossCodeID);
        const ContactErr = lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? RequiredFieldOnConditon(value.Value) : 'true';
        const HINErr = value.PropertyCategoryCode === 'B' ? RequiredFieldHIN(value?.HIN, 12, 21) : 'true';
        const RegNumErr = value.PropertyCategoryCode === 'B' ? RequiredFieldIncident(value?.RegistrationNumber) : "true";
        const RegStateErr = value.PropertyCategoryCode === 'B' ? RequiredFieldIncident(value?.RegistrationStateID) : "true";

        setErrors(prevValues => {
            return {
                ...prevValues,
                ['PropertyTypeIDError']: PropertyTypeIDErr || prevValues['PropertyTypeIDError'],
                ['CategoryIDError']: CategoryIDErr || prevValues['CategoryIDError'],
                ['LossCodeIDError']: LossCodeIDErr || prevValues['LossCodeIDError'],
                ['ContactError']: ContactErr || prevValues['ContactError'],
                ['HINError']: HINErr || prevValues['HINError'],
                ['RegNumError']: RegNumErr || prevValues['RegNumError'],
                ['RegStateError']: RegStateErr || prevValues['RegStateError'],
            }
        });
    }

    // Check All Field Format is True Then Submit 
    const { PropertyTypeIDError, ContactError, CategoryIDError, LossCodeIDError, RegStateError, RegNumError, HINError } = errors

    useEffect(() => {
        if (PropertyTypeIDError === 'true' && ContactError === 'true' && CategoryIDError === 'true' && LossCodeIDError === 'true' && HINError === 'true' && RegNumError === 'true' && RegStateError === 'true') {
            if (MstPage === "MST-Property-Dash") {
                if (masterPropertyID) {
                    update_Property();
                } else {
                    Add_Property();
                }
            } else {
                if (propertyID && masterPropertyID) {
                    update_Property();
                } else {
                    Add_Property();
                }
            }
        }
    }, [PropertyTypeIDError, ContactError, CategoryIDError, LossCodeIDError, RegStateError, RegNumError, HINError]);

    const GetSingleData = (propertyId, masterPropertyId) => {
        const val = { 'PropertyID': propertyId, 'MasterPropertyID': masterPropertyId, 'PINID': loginPinID, 'IncidentID': mainIncidentID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        const val2 = { 'MasterPropertyID': masterPropertyId, 'PropertyID': 0, 'PINID': loginPinID, 'IncidentID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('Property/GetSingleData_Property', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {

                setEditval(res);
            } else { setEditval([]); }
        })
    }

    useEffect(() => {
        if (value?.PropertyCategoryCode === 'A') {
            dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));
        }
    }, [value?.PropertyCategoryCode])

    useEffect(() => {
        if (editval?.length > 0) {
            setcountoffaduit(true); PropertyCategory(editval[0]?.PropertyTypeID);
            sessionStorage.setItem("propertyStolenValue", Encrypted_Id_Name(editval[0]?.Value, 'SForStolenValue'));
            setMasterPropertyID(editval[0]?.MasterPropertyID);
            setPropertyID(MstPage === "MST-Property-Dash" ? '' : editval[0]?.PropertyID)
            dispatch({ type: MasterProperty_ID, payload: editval[0]?.MasterPropertyID });
            dispatch({ type: Property_ID, payload: MstPage === "MST-Property-Dash" ? '' : editval[0]?.PropertyID });

            if (Get_Property_Code(editval, propertyTypeData) === 'A') {
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));

            } else if (Get_Property_Code(editval, propertyTypeData) === 'B') {
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', ''));

            } else if (Get_Property_Code(editval, propertyTypeData) === 'O') {
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', ''));

            } else if (Get_Property_Code(editval, propertyTypeData) === 'S') {
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', ''));

            } else if (Get_Property_Code(editval, propertyTypeData) === 'G') {
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1'));

            } else if (Get_Property_Code(editval, propertyTypeData) === 'D') {
                get_Data_Drug_Modal(editval[0]?.MasterPropertyID, propertyID);
                dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '1', ''));
            }

            setLossCode(Get_LossCode(editval, propertyLossCodeDrpData));
            setValue({
                ...value,
                'PropertyID': MstPage === "MST-Property-Dash" ? '' : editval[0]?.PropertyID, 'PropertyTypeID': editval[0]?.PropertyTypeID,
                'ModifiedByUserFK': loginPinID, 'PropertyNumber': editval[0]?.PropertyNumber, 'CategoryID': editval[0]?.CategoryID,
                'ClassificationID': editval[0]?.ClassificationID, 'ReportedDtTm': editval[0]?.ReportedDtTm ? getShowingDateText(editval[0]?.ReportedDtTm) : '',
                'DestroyDtTm': editval[0]?.DestroyDtTm ? getShowingDateText(editval[0]?.DestroyDtTm) : '',
                'Value': editval[0]?.Value === null && (editval[0].CategoryID === 2 || editval[0].CategoryID === 5 || editval[0].CategoryID === 600013 || editval[0].CategoryID === 600014 || editval[0].CategoryID === 31 || editval[0].CategoryID === 600026) ? '0' : editval[0]?.Value === null ? '0' : editval[0]?.Value,
                'OfficerID': editval[0]?.OfficerID, 'LossCodeID': editval[0]?.LossCodeID, 'PropertyTag': editval[0]?.PropertyTag,
                'NICB': editval[0]?.NICB, 'Description': editval[0]?.Description, 'IsEvidence': editval[0]?.IsEvidence, 'IsSendToPropertyRoom': editval[0]?.IsSendToPropertyRoom,
                'IsPropertyRecovered': editval[0]?.IsPropertyRecovered, 'PossessionOfID': editval[0]?.PossessionOfID, 'PropertyCategoryCode': Get_Property_Code(editval, propertyTypeData),
            });
            setnibrsSubmittedProperty(editval[0]?.IsNIBRSSummited);
            setPorpCategoryCode(Get_LossCodes(editval, propertyCategoryData)); PropertyClassification(editval[0]?.CategoryID);
            setPropertyNumber(editval[0]?.PropertyNumber);
            setIncidentReportedDate(editval[0]?.ReportedDtTm ? new Date(editval[0]?.ReportedDtTm) : null);

            // validate property
            if (editval[0]?.PropertyID) {
                NibrsErrorReturn(editval[0]?.PropertyID);
            }

        } else {
            Reset();
            setIncidentReportedDate(getShowingMonthDateYear(new Date())); if (FbiCode && AttComp) { setStatesAccordingTo_FbiCode(FbiCode, AttComp); }
        }
    }, [editval, propertyTypeData])

    // ----------------------------Property Type -----------------------
    useEffect(() => {
        if (value.PropertyCategoryCode === 'D') {
            if (suspectedDrugDrpData?.length === 0) dispatch(get_SuspectedDrug_Drp_Data(loginAgencyID));
            if (propSourceDrugDrpData?.length === 0) dispatch(get_PropSourceDrugDrpData(loginAgencyID));
            if (measureTypeDrpData?.length === 0) dispatch(get_MeasureType_Drp_Data(loginAgencyID));
            if (typeMarijuanaDrpData?.length === 0) dispatch(get_TypeMarijuana_Drp_Data(loginAgencyID));
            if (drugManufacturedDrpData?.length === 0) dispatch(get_DrugManufactured_Drp_Data(loginAgencyID));
        }
    }, [value?.PropertyCategoryCode])

    const get_Data_Drug_Modal = (masterPropertyId, propertyID) => {
        const val = { 'PropertyID': propertyID, 'MasterPropertyID': masterPropertyId, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('PropertyDrug/GetData_PropertyDrug', val).then((res) => {
            if (res) {

                setDrugData(res);
            } else {
                setDrugData([]);
            }
        })
    }

    const PropertyCategory = (CategoryID) => {
        const val = { CategoryID: CategoryID, }
        fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
            if (data) {
                setPropertyCategoryData(fourColwithExtraCode(data, 'PropertyDescID', 'Description', 'CategoryID', 'PropDescCode'));
                setPorpCategoryCode(Get_LossCodes(editval, fourColwithExtraCode(data, 'PropertyDescID', 'Description', 'CategoryID', 'PropDescCode')))
            } else {
                setPropertyCategoryData([]);
            }
        })
    }

    const get_Data_Porperty_Offence = (propertyID, DecMPropID, mainIncidentID) => {
        const val = { 'PropertyID': propertyID, 'MasterPropertyID': DecMPropID ? DecMPropID : 0, 'IncidentID': mainIncidentID, 'OffenseID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('PropertyOffense/GetData_PropertyOffense', val).then((res) => {
            if (res) {
                const nibrsCodeArr = res?.map((item) => item?.NIBRSCode);
                setNibrsCodeArr(nibrsCodeArr);
            } else {
                setNibrsCodeArr([])
            }
        });
    }

    const PropertyClassification = (PropertyDescID) => {
        const val = { PropertyDescID: PropertyDescID, }
        fetchPostData('Property/GetDataDropDown_PropertyClassification', val).then((data) => {
            if (data) {
                setPropertyClassificationData(Comman_changeArrayFormat(data, 'PropertyClassificationID', 'Description'))
            } else {
                setPropertyClassificationData([]);
            }
        })
    }

    const getDrugMeasureUnit = (drugTypeID) => {
        const val = {
            'AgencyID': loginAgencyID,
            'DrugTypeID': drugTypeID,
        }
        fetchPostData('MeasurementUnit/GetDataDropDown_MeasurementUnit', val).then((data) => {
            if (data) {

                setDrugMeasureUnitData(Comman_changeArrayFormat(data, 'MeasurementUnitID', 'Description'))
            } else {
                setDrugMeasureUnitData([]);
            }
        })
    }

    const getDrugMeasureType = (drugTypeID, measurementUnitID) => {
        const val = {
            'AgencyID': loginAgencyID,
            'DrugTypeID': drugTypeID,
            'MeasurementUnitID': measurementUnitID,
        }
        fetchPostData('PropertyDrugMeasureType/GetDataDropDown_PropertyDrugMeasureType', val).then((data) => {
            if (data) {

                setDrugMeasureTypeData(Comman_changeArrayFormat(data, 'DrugMeasureTypeID', 'Description'))
            } else {
                setDrugMeasureTypeData([]);
            }
        })
    }

    const onChangeDrugType = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true)
        if (e) {
            if (name === 'SuspectedDrugTypeID') {
                setValue({ ...value, [name]: e.value, 'SuspectedDrugType_Description': e.label, 'MeasurementUnitID': null, 'MeasurementUnit_Description': '', 'MeasurementTypeID': null, });
                setDrugMeasureUnitData([]); setDrugMeasureTypeData([]);
                getDrugMeasureUnit(e.value);

            } else if (name === 'MeasurementUnitID') {
                setValue({ ...value, [name]: e.value, 'MeasurementTypeID': null, 'MeasurementUnit_Description': e.label });
                setDrugMeasureTypeData([]);
                getDrugMeasureType(value.SuspectedDrugTypeID, e.value);

            } else if (name === 'MeasurementTypeID') {
                setValue({ ...value, [name]: e.value, 'PropertyDrugMeasure_Description': e.label });
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {

            if (name === 'SuspectedDrugTypeID') {
                setValue({ ...value, [name]: null, 'SuspectedDrugType_Description': '', 'MeasurementUnitID': null, 'MeasurementUnit_Description': '', 'MeasurementTypeID': null, });
                setDrugMeasureUnitData([]); setDrugMeasureTypeData([]);


            } else if (name === 'MeasurementUnitID') {
                setValue({ ...value, [name]: null, 'MeasurementTypeID': null, 'MeasurementUnit_Description': '' });
                setDrugMeasureTypeData([]);


            } else if (name === 'MeasurementTypeID') {
                setValue({ ...value, [name]: null, 'PropertyDrugMeasure_Description': '' });
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    }

    const Reset = () => {
        setValue({
            ...value,
            'PropertyID': '', 'MasterPropertyID': '', 'PropertyNumber': 'Auto Generated', 'PropertyCategoryCode': 'A', 'PossessionOfID': null, 'OfficerID': null,

            // Dropdown
            'CategoryID': null, 'ClassificationID': null, 'LossCodeID': null,

            'DestroyDtTm': '', 'Value': '', 'PropertyTag': '', 'NICB': '', 'Description': '',
            'ReportedDtTm': MstPage === "MST-Property-Dash" ? getShowingMonthDateYear(new Date(datezone)) : incReportedDate ? getShowingDateText(incReportedDate) : getShowingMonthDateYear(new Date()),
            // checkbox
            'IsEvidence': '', 'IsSendToPropertyRoom': '', 'IsPropertyRecovered': '',
            //drug Fields
            'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, '  ClandistineLabsNumber': null,
            'MasterID': null, 'Clandestine': '',
            'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
        });

        setnibrsSubmittedProperty(0);
        setErrors({ ...errors, 'PropertyTypeIDError': '', 'CategoryIDError': '', 'LossCodeIDError': '', 'OfficerIDError': '', 'ContactError': '' });
        setPropertyNumber(''); setLossCode('');
        setDrugData([]); setPropertyClassificationData([]);
        setMasterPropertyID(''); setPropertyID(''); setPorpRecType(''); setPorpCategoryCode('');
        dispatch({ type: MasterProperty_ID, payload: '' });
        dispatch({ type: Property_ID, payload: '' });
        setPossessionID('');
        setShowLossCodeError(false);
        dispatch(get_Masters_Name_Drp_Data(''));
        if (propertyTypeData?.length != 0 && !FbiCode) {
            const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });
            if (typeArticleArr.length > 0) {
                setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
                PropertyCategory(typeArticleArr[0]?.value);
            }
            setIsDrugOffense(false);
        }
        setShowLossCodeError(false);
        setnibrsFieldError([]);
    }

    const setStatesAccordingTo_FbiCode = (FbiCode, AttComp) => {
        switch (FbiCode) {
            case '35A':
            case '35B': {
                switch (AttComp) {
                    case 'A': {
                        if (propertyTypeData?.length != 0 && AttComp === 'A') {
                            const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });
                            if (typeArticleArr.length > 0) {
                                setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
                                PropertyCategory(typeArticleArr[0]?.value);
                                setIsDrugOffense(false);
                            }
                        }
                        return;
                        break; // Added break
                    }
                    case 'C': {
                        if (propertyTypeData?.length != 0 && AttComp === 'C') {
                            const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "D") return val });
                            if (typeArticleArr.length > 0) {
                                setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
                                PropertyCategory(typeArticleArr[0]?.value);
                                setIsDrugOffense(true);
                            }
                        }
                        return;
                        break; // Added break
                    }
                    default: {
                        return;
                        break; // Added break
                    }
                }
            }
            default: {
                if (propertyTypeData?.length != 0) {
                    const typeArticleArr = propertyTypeData?.filter((val) => { if (val?.id === "A") return val });
                    if (typeArticleArr.length > 0) {
                        setValue(prevValues => { return { ...prevValues, ['PropertyTypeID']: typeArticleArr[0]?.value, ['PropertyCategoryCode']: typeArticleArr[0]?.id, } })
                        PropertyCategory(typeArticleArr[0]?.value);
                        setIsDrugOffense(false);
                    }
                }
                break; // Added break
            }
        }
    }

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true)
        if (e) {
            if (name === 'SuspectedDrugTypeID') {
                setDrugTypecode(e.id);
                setChangesStatus(true);
                if (e.id === 'E') {
                    setValue({
                        ...value,
                        [name]: e.value, 'MeasurementTypeID': '', 'PropertySourceDrugTypeID': '', 'SuspectedDrugType_Description': e.label, 'TypeMarijuana': '', 'MarijuanaNumber': '', '  ClandistineLabsNumber': '', 'DrugManufactured': '',
                    });
                } else {
                    setValue({
                        ...value,
                        [name]: e.value, 'SuspectedDrugType_Description': e.label, 'TypeMarijuana': '', 'MarijuanaNumber': '', '  ClandistineLabsNumber': '', 'DrugManufactured': '',
                    });
                }
            } else if (name === 'PropertyTypeID') {
                switch (e.id) {
                    case 'A': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', '')); break;
                    case 'B': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', '')); break;
                    case 'S': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', '')); break;
                    case 'O': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', '')); break;
                    case 'D': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '1', '')); break;
                    case 'G': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1')); break;
                    default: dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));;
                }
                PropertyCategory(e.value);
                PropertyClassification('');
                setChangesStatus(true);
                setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['CategoryID']: '', ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '', });
                setLossCode('');
            } else if (name === 'CategoryID') {
                setPorpCategoryCode(e.code);
                PropertyClassification(e.value);
                setChangesStatus(true);

                if (e.code === '09' || e.code === '22' || e.code === '65' || e.code === '66' || e.code === '77' || e.code === '11' || e.code === '10' || e.code === '48') {
                    setValue({ ...value, [name]: e.value, ['Value']: '0.00' });
                } else if (e.code === '88') {
                    setValue({ ...value, [name]: e.value, ['Value']: '1' });

                } else {
                    setValue({ ...value, [name]: e.value, ['Value']: '' });
                }

            } else if (name === "PossessionOfID") {
                setPossessionID(e.value); setValue({ ...value, [name]: e.value });
            } else if (name === "MeasurementTypeID") {

                if (e.id === 'XX') {
                    setValue({ ...value, [name]: e.value, 'PropertyDrugMeasure_Description': e.label, 'EstimatedDrugQty': '' });
                } else {
                    setValue({ ...value, [name]: e.value, 'PropertyDrugMeasure_Description': e.label, });
                }


            } else {
                setChangesStatus(true)
                setValue({ ...value, [name]: e.value });
            }

        } else {
            if (name === 'SuspectedDrugTypeID') {
                setChangesStatus(true); setDrugTypecode('');
                setValue({ ...value, [name]: null, 'MeasurementTypeID': '', });

            } else if (name === 'PropertyTypeID') {
                setChangesStatus(true);
                setValue({
                    ...value,
                    ['PropertyTypeID']: null, ['PropertyCategoryCode']: '', ['CategoryID']: null, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '',
                });
                setPropertyCategoryData([]); setPropertyClassificationData([]); setLossCode('');
                dispatch({ type: Property_LossCode_Drp_Data, payload: [] });

            } else if (name === 'CategoryID') {

                setChangesStatus(true); setPorpCategoryCode('');
                setPropertyClassificationData([]);

                setValue({ ...value, ['CategoryID']: null, ['ClassificationID']: null, ['Value']: '' });

            } else if (name === "PossessionOfID") {
                setPossessionID('');
                setChangesStatus(true);
                setValue({ ...value, [name]: null });
            } else {
                setChangesStatus(true);
                setValue({ ...value, [name]: null });
            }
            void 0;
        }
    }

    const HandleChanges = (e) => {
        setStatesChangeStatus(true)
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsAuto') {
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        }
        else if (e.target.name === 'EstimatedDrugQty' || e.target.name === 'SolidPounds' || e.target.name === 'SolidOunces' || e.target.name === 'SolidGrams' || e.target.name === 'LiquidOunces' || e.target.name === 'DoseUnits' || e.target.name === 'Items') {
            let ele = e.target.value.replace(/[^0-9]/g, "")
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/[^0-9]/g, '');
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: cleaned
                });
            } else {
                ele = e.target.value.split('$').join('').replace(/[^0-9]/g, "");
                setChangesStatus(true)
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'Quantity' || e.target.name === 'Length' || e.target.name === 'BarrelLength' || e.target.name === 'FractionDrugQty' || e.target.name === 'MarijuanaNumber' || e.target.name === 'ClandistineLabsNumber') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true)
            setValue({
                ...value,
                [e.target.name]: checkNumber
            });
        }
        else if (e.target.name === 'Denomination') {
            var ele = e.target.value.replace(/[^0-9\.]/g, "")


            if (ele === "") {
                setValue({
                    ...value,
                    [e.target.name]: ele,
                    MeasureTypeID: null
                });
                setChangesStatus(true);
                return;
            }



            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setChangesStatus(true)
                    setValue({ ...value, [e.target.name]: ele });
                } else {

                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g)
                        if (!checkDot) {
                            setChangesStatus(true)
                            setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                        }
                    } else {
                        setChangesStatus(true)
                        setValue({ ...value, [e.target.name]: ele })
                    }
                }
            }
            else {
                if (ele.length === 16) {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                } else {
                    setChangesStatus(true)
                    setValue({
                        ...value,
                        [e.target.name]: ele
                    });
                }
            }
        } else if (e.target.name === 'HIN' || e.target.name === 'RegistrationNumber') {
            var ele = e.target.value.replace(/[^0-9a-zA-Z]/g, "")
            setValue({
                ...value,
                [e.target.name]: ele
            });
        }
        else if (e.target.name === 'Value') {
            setChangesStatus(true);
            const ele = e.target.value.replace(/[^0-9\.]/g, "");
            if (ele.startsWith('.')) {
                return;
            }

            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        const checkDot = ele.substr(ele.indexOf('.') + 1).slice(0, 2).match(/\./g);
                        if (!checkDot) {
                            setValue({
                                ...value,
                                [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2)
                            });
                            return;
                        } else {
                            return;
                        }
                    } else {
                        setValue({ ...value, [e.target.name]: ele });
                    }
                }
            } else {
                setValue({ ...value, [e.target.name]: ele });
            }
        }
        else {
            setChangesStatus(true);
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const Add_Property = () => {
        if (value.PropertyCategoryCode === 'D' && drugLocalArr?.length === 0) {
            toastifyError('Add atleast one drug type');
            setErrors({ ...errors, ['PropertyTypeIDError']: '', })
            return

        } else {
            AddDeleteUpadate('Property/Insert_Property', value).then((res) => {
                if (res.success) {

                    if (MstPage === "MST-Property-Dash") {
                        navigate(`/nibrs-Home?page=MST-Property-Dash&ProId=${stringToBase64(res?.PropertyID)}&MProId=${stringToBase64(res?.MasterPropertyID)}&ModNo=${res?.PropertyNumber?.trim()}&ProSta=${true}&ProCategory=${value.PropertyCategoryCode}&narrativeId=${narrativeId}`);
                    } else {
                        navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(res?.PropertyID)}&MProId=${stringToBase64(res?.MasterPropertyID)}&ProSta=${true}&ProCategory=${value.PropertyCategoryCode}&narrativeId=${narrativeId}`)
                    }

                    Reset();
                    if (drugLocalArr?.length > 0 && value.PropertyCategoryCode === 'D') {
                        Add_Drug(true, res.PropertyID, res.MasterPropertyID);
                    }
                    toastifySuccess(res.Message);
                    setErrors({ ...errors, ['LossCodeIDError']: '', }); setUpdateCount(updateCount + 1)
                    get_Incident_Count(mainIncidentID, loginPinID);
                    dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));
                    setChangesStatus(false); setStatesChangeStatus(true); setDrugLocalArr([]);

                    // Validate Property

                    ValidateIncidentProperty(mainIncidentID);
                    NibrsErrorReturn(res?.PropertyID);
                    // validateIncSideBar
                    validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);

                } else {
                    toastifyError('error');
                    setErrors({ ...errors, ['PropertyTypeIDError']: '', })
                }
            })

        }

    }

    const update_Property = () => {
        const previousValue = value.Value;
        AddDeleteUpadate('Property/Update_Property', value).then((res) => {
            if (res?.success) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));
                setChangesStatus(false); setStatesChangeStatus(true);
                setErrors({ ...errors, ['PropertyTypeIDError']: '', })

                sessionStorage.setItem("propertyStolenValue", Encrypted_Id_Name(previousValue, 'SForStolenValue'));
                GetSingleData(DecPropID, DecMPropID);

                // Validate Property

                ValidateIncidentProperty(mainIncidentID);
                NibrsErrorReturn(DecPropID);
                // validateIncSideBar
                validate_IncSideBar(mainIncidentID, IncNo, loginAgencyID);

            } else {
                toastifyError('error');
                setErrors({ ...errors, ['PropertyTypeIDError']: '', })
            }
        })
    }

    useEffect(() => {
        if (MstPage === "MST-Property-Dash" && masterPropertyStatus == true) { newProperty() }
    }, [MstPage, masterPropertyStatus]);

    const newProperty = () => {
        if (MstPage === "MST-Property-Dash") {

            navigate(`/nibrs-Home?page=MST-Property-Dash&ProId=${0}&MProId=${0}&ModNo=${''}&ProSta=${false}&ProCategory=${''}&narrativeId=${narrativeId}`);

            Reset();

            dispatch({ type: Master_Property_Status, payload: false })
            get_Property_Count(''); setChangesStatus(false); setStatesChangeStatus(false);
        } else {

            navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&ProCategory=${''}&narrativeId=${narrativeId}`)

            Reset(); setPossessionID('');

            dispatch({ type: Master_Property_Status, payload: false })
            get_Property_Count(''); setChangesStatus(false); setStatesChangeStatus(false);
            setErrors({});
        }
    }

    // const columns1dad = [
    //     {
    //         width: '250px',
    //         name: 'Property Number',
    //         selector: (row) => row.PropertyNumber,
    //         sortable: true
    //     },
    //     {
    //         name: 'Property Type',
    //         selector: (row) => row.PropertyType_Description,
    //         sortable: true
    //     },
    //     {
    //         name: 'Category',
    //         selector: (row) => row.PropertyCategory_Description,
    //         sortable: true
    //     },
    //     {
    //         name: 'Loss Code',
    //         selector: (row) => row.PropertyLossCode_Description,
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
    //                             onClick={(e) => { setErrString(row.PropertyID, nibrsValidateData); }}
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
    //                             <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //                                 <i className="fa fa-trash"></i>
    //                             </span>
    //                             : <></>
    //                         :
    //                         <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //                             <i className="fa fa-trash"></i>
    //                         </span>
    //                 }
    //             </div>
    //     }
    // ]


    const columns1 = [
        {
            width: '250px',
            name: 'Property Number',
            selector: (row) => row.PropertyNumber,
            sortable: true
        },
        {
            name: 'Property Type',
            selector: (row) => row.PropertyType_Description,
            sortable: true
        },
        {
            name: 'Category',
            selector: (row) => row.PropertyCategory_Description,
            sortable: true
        },
        {
            name: 'Loss Code',
            selector: (row) => row.PropertyLossCode_Description,
            sortable: true
        },
        {
            name: 'Owner Name',
            selector: (row) => row.Owner,
            sortable: true
        },
        // {
        //   name: 'Evidence Flag',
        //   selector: (row) => row.Evidence,
        //   sortable: true
        // },
        {
            name: 'Evidence Flag',
            selector: row => (
                <input type="checkbox" checked={row.Evidence === true} disabled />
            ),
            sortable: true
        },
        {
            width: '100px',
            name: 'View',

            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 30 }}>
                    {
                        getNibrsError(row.PropertyID, nibrsValidateData) ?
                            <span
                                onClick={(e) => { setErrString(row.PropertyID, nibrsValidateData); }}
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
                            effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", propertyMainModuleData, isLocked, true) ?
                                <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            !isLockOrRestrictModule("Lock", propertyMainModuleData, isLocked, true) &&
                            <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
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

    const set_EditRow = (row) => {
        setStatesChangeStatus(false); setShowLossCodeError(false);
        if (row?.PropertyID || row?.MasterPropertyID) {
            // get Inc-Lock Status
            getPermissionLevelByLock(IncID, loginPinID);

            navigate(`/nibrs-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(row?.PropertyID)}&MProId=${stringToBase64(row?.MasterPropertyID)}&ProSta=${true}&ProCategory=${row.PropertyType_Description}&narrativeId=${narrativeId}`);

            Reset();
            GetSingleData(row?.PropertyID, row?.MasterPropertyID);
            get_Property_Count(row?.PropertyID, row?.MasterPropertyID, MstPage === "MST-Property-Dash" ? true : false);
            setMasterPropertyID(row?.MasterPropertyID); dispatch({ type: MasterProperty_ID, payload: row?.MasterPropertyID });
            setPropertyID(row?.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID });
        }
    }

    const Delete_Property = () => {
        const val = { 'PropertyID': delPropertyID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        AddDeleteUpadate('Property/Delete_Property', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Incident_Count(mainIncidentID, loginPinID); setErrors('');
                dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));
                if (propertyID == delPropertyID) { newProperty() }
            } else { console.log("Somthing Wrong"); }
        })
    }

    const columns = [
        {
            name: 'Suspected Drug Type',
            selector: (row) => row.SuspectedDrugType_Description,
            sortable: true
        },
        {
            name: 'Measurement Unit',
            selector: (row) => row.MeasurementUnit_Description,
            sortable: true
        },
        {
            name: 'Measurement Type',
            selector: (row) => row.PropertyDrugMeasure_Description,
            sortable: true
        },
        {
            name: 'Estimated Qty',
            selector: (row) => row.EstimatedDrugQty,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 0, right: 0 }}>

                    <button onClick={() => { setIsProperty(false); setPropertyDrugID(row.PropertyDrugID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
        },

    ]

    const set_Edit_Value = (row) => {
        setPropertyDrugID(row?.PropertyDrugID); setDrugEditData(row); setDrugModal(true); setStatesChangeStatus(true);
    }

    const setStatusFalse = (e) => {
        setChangesStatus(false); setStatesChangeStatus(false);
        setPropertyDrugID(''); setDrugTypecode('');
        setDrugModal(true);
        setValue({
            ...value,
            'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementTypeID': '', 'PropertyDrugID': '',
            'PropertySourceDrugTypeID': '', 'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, '  ClandistineLabsNumber': '',
            'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
        })
    }

    const [drugErrors, setDrugErrors] = useState({
        'SuspectedDrugTypeIDError': '', 'EstimatedDrugQtyError': '', 'MeasurementUnitIDError': '', 'MeasurementTypeIDError': '',

    })

    const check_Drug_Validation_Error = () => {
        const SuspectedDrugTypeIDErr = RequiredFieldIncident(value.SuspectedDrugTypeID);
        const EstimatedDrugQtyErr = RequiredFieldIncident(value.EstimatedDrugQty);
        const MeasurementUnitIDErr = RequiredFieldIncident(value.MeasurementUnitID);
        const MeasurementTypeIDErr = RequiredFieldIncident(value.MeasurementTypeID);


        setDrugErrors(prevValues => {
            return {
                ...prevValues,
                ['SuspectedDrugTypeIDError']: SuspectedDrugTypeIDErr || prevValues['SuspectedDrugTypeIDErr'],
                ['EstimatedDrugQtyError']: EstimatedDrugQtyErr || prevValues['EstimatedDrugQtyError'],
                ['MeasurementUnitIDError']: MeasurementUnitIDErr || prevValues['MeasurementUnitIDError'],
                ['MeasurementTypeIDError']: MeasurementTypeIDErr || prevValues['MeasurementTypeIDError'],


            }
        })
    }

    // Check All Field Format is True Then Submit 
    const { SuspectedDrugTypeIDError, EstimatedDrugQtyError, MeasurementUnitIDError, MeasurementTypeIDError } = drugErrors

    useEffect(() => {
        if (SuspectedDrugTypeIDError === 'true' && EstimatedDrugQtyError === 'true' && MeasurementUnitIDError === 'true' && MeasurementTypeIDError === 'true') {
            if (propertyDrugID) { update_DrugModal(); }
            else {
                if (ProSta === 'true' || ProSta === true) {
                    Add_Drug(true, 0, 0);
                } else {
                    Add_Drug(false, 0, 0);
                }
            }
        }
    }, [SuspectedDrugTypeIDError, EstimatedDrugQtyError, MeasurementUnitIDError, MeasurementTypeIDError])

    useEffect(() => {
        if (propertyDrugID) {
            setValue({
                ...value,
                'SuspectedDrugTypeID': parseInt(drugEditData?.SuspectedDrugTypeID),

                'EstimatedDrugQty': drugEditData?.EstimatedDrugQty,
                'FractionDrugQty': drugEditData?.FractionDrugQty,
                'MeasurementTypeID': drugEditData?.MeasurementTypeID,
                'MasterPropertyID': drugEditData?.MasterPropertyID,
                'PropertyDrugID': drugEditData?.PropertyDrugID,
                'PropertySourceDrugTypeID': drugEditData?.PropertySourceDrugTypeID,
                'MarijuanaTypeID': drugEditData?.MarijuanaTypeID,
                'MarijuanaNumber': drugEditData?.MarijuanaNumber,
                'DrugManufacturedID': drugEditData?.DrugManufacturedID,
                'ClandistineLabsNumber': drugEditData?.ClandistineLabsNumber,
                'MeasurementUnitID': drugEditData?.MeasurementUnitID,

                'Items': drugEditData?.Items,
                'DoseUnits': drugEditData?.DoseUnits,
                'LiquidOunces': drugEditData?.LiquidOunces,
                'SolidGrams': drugEditData?.SolidGrams,
                'SolidOunces': drugEditData?.SolidOunces,
                'SolidPounds': drugEditData?.SolidPounds,
            })
            setDrugTypecode(Get_Drug_Code(drugEditData, suspectedDrugDrpData));
            getDrugMeasureUnit(drugEditData?.SuspectedDrugTypeID);
            getDrugMeasureType(drugEditData?.SuspectedDrugTypeID, drugEditData?.MeasurementUnitID);

        } else {
            setValue({
                ...value,
                'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'MeasurementUnitID': null, 'MeasurementTypeID': '', 'PropertySourceDrugTypeID': '',
                'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null, '  ClandistineLabsNumber': '',
                'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
            });
            setDrugErrors({
                ...drugErrors,
                'SuspectedDrugTypeIDError': '', 'EstimatedDrugQtyError': '', 'MeasurementUnitIDError': '', 'MeasurementTypeIDError': '',
                'solidPoundsError': '', 'solidOunceError': '', 'solidGramError': '', 'liquidOunceError': '', 'doseUnitsError': '', 'ItemsError': '',
            })
        }
    }, [drugEditData, drugModal])

    const Add_Drug = (ProStatus, proID, MstProID) => {
        if (ProStatus) {
            if (proID || MstProID) {

                const oldArr = drugLocalArr
                const newArr = oldArr.map(obj => ({
                    MasterPropertyID: MstProID,
                    MeasurementUnitID: obj.MeasurementUnitID,
                    PropertyID: proID,
                    SuspectedDrugTypeID: obj.SuspectedDrugTypeID, EstimatedDrugQty: obj.EstimatedDrugQty, FractionDrugQty: obj.FractionDrugQty, MeasurementTypeID: obj.MeasurementTypeID, PropertyCategoryCode: obj.PropertyCategoryCode, PropertySourceDrugTypeID: obj.PropertySourceDrugTypeID,
                    CreatedByUserFK: obj.CreatedByUserFK, MarijuanaTypeID: obj.MarijuanaTypeID, MarijuanaNumber: obj.MarijuanaNumber, DrugManufacturedID: obj.DrugManufacturedID,
                    ClandistineLabsNumber: obj.ClandistineLabsNumber, IsMaster: obj.IsMaster, SolidPounds: obj.SolidPounds, SolidOunces: obj.SolidOunces, SolidGrams: obj.SolidGrams,
                    LiquidOunces: obj.LiquidOunces, DoseUnits: obj.DoseUnits, Items: obj.Items,
                }));
                insetLocalDrugData(newArr)
            } else {
                const result = drugData?.find(item => {
                    if (item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID) {
                        return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
                    } else {
                        return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
                    }
                });
                if (result) {
                    toastifyError('DrugType and MeasurementType Already Exists');
                    setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
                } else {
                    AddDeleteUpadate('PropertyDrug/Insert_PropertyDrug', value).then((res) => {
                        const parsedData = JSON.parse(res.data);
                        const message = parsedData.Table[0].Message;
                        toastifySuccess(message); get_Data_Drug_Modal(masterPropertyID, propertyID);
                        setChangesStatus(false); setStatesChangeStatus(false); setDrugModal(false); setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' })
                    })
                }
            }
        } else {
            const result = drugLocalArr?.find(item => {
                if (item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID) {
                    return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
                } else {
                    return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
                }
            });
            if (result) {
                toastifyError('DrugType and MeasurementType Already Exists'); setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
            } else {
                value.PropertyDrugID = localDrugCount
                setLocalDrugCount(localDrugCount + 1); setDrugLocalArr([...drugLocalArr, value]);
                sessionStorage.setItem('DrugLocalData', JSON.stringify([...drugLocalArr, value]));
                setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' }); setChangesStatus(false); setStatesChangeStatus(false); setDrugModal(false); onDrugClose();
            }
        }
    }

    const insetLocalDrugData = async (DataArr) => {
        try {
            DataArr?.forEach(async (data) => {
                const response = await AddDeleteUpadate(MstPage === "MST-Property-Dash" ? 'MainMasterPropertyDrug/Insert_MainMasterPropertyDrug' : 'PropertyDrug/Insert_PropertyDrug', data)
            });
            setDrugLocalArr([]);
        } catch (error) {
            console.log(error); setDrugLocalArr([]);
        }
    }

    const update_DrugModal = () => {
        if (drugLocalArr?.length > 0) {
            const newArray = drugLocalArr?.filter(item => item.PropertyDrugID == propertyDrugID);
            const ModifyArr = newArray?.map(obj => ({
                'SuspectedDrugTypeID': value?.SuspectedDrugTypeID,
                'EstimatedDrugQty': value?.EstimatedDrugQty,
                'MeasurementUnitID': value?.MeasurementUnitID,
                'FractionDrugQty': value?.FractionDrugQty, 'MeasurementTypeID': value?.MeasurementTypeID, 'PropertyCategoryCode': value?.PropertyCategoryCode, 'PropertySourceDrugTypeID': value?.PropertySourceDrugTypeID, 'CreatedByUserFK': value?.CreatedByUserFK,
                'MarijuanaTypeID': value?.MarijuanaTypeID, 'MarijuanaNumber': value?.MarijuanaNumber, 'DrugManufacturedID': value?.DrugManufacturedID, 'ClandistineLabsNumber': value?.ClandistineLabsNumber, 'SolidPounds': value?.SolidPounds, 'SolidOunces': value?.SolidOunces, 'SolidGrams': value?.SolidGrams, 'LiquidOunces': value?.LiquidOunces,
                'DoseUnits': value?.DoseUnits, 'Items': value?.Items, 'PropertyDrugMeasure_Description': value.PropertyDrugMeasure_Description, 'SuspectedDrugType_Description': value.SuspectedDrugType_Description, 'IsMaster': obj.IsMaster, 'PropertyDrugID': obj.PropertyDrugID,
            }));
            const result = drugLocalArr?.find(item => {
                if (item?.PropertyDrugID != ModifyArr[0]?.PropertyDrugID) {
                    if (item.SuspectedDrugTypeID == ModifyArr[0]?.SuspectedDrugTypeID && item?.MeasurementTypeID == ModifyArr[0]?.MeasurementTypeID) {
                        return item.SuspectedDrugTypeID == ModifyArr[0]?.SuspectedDrugTypeID && item?.MeasurementTypeID == ModifyArr[0]?.MeasurementTypeID
                    } else {
                        return item.SuspectedDrugTypeID == ModifyArr[0]?.SuspectedDrugTypeID && item?.MeasurementTypeID == ModifyArr[0]?.MeasurementTypeID
                    }
                }
            });
            if (result) {
                toastifyError('DrugType and MeasurementType Already Exists');
                setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
            } else {
                const LastArray = drugLocalArr.map(obj => obj.PropertyDrugID == propertyDrugID ? ModifyArr[0] : obj);
                setDrugLocalArr(LastArray); setChangesStatus(false); setStatesChangeStatus(false); setDrugModal(false);
                setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' }); setDrugEditData({})
            }
        } else {
            const result = drugData?.find(item => {
                if (item.PropertyDrugID != value['PropertyDrugID']) {
                    if (item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID) {
                        return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
                    } else {
                        return item.SuspectedDrugTypeID == value.SuspectedDrugTypeID && item?.MeasurementTypeID == value?.MeasurementTypeID
                    }
                }
            });
            if (result) {
                toastifyError('DrugType and MeasurementType Already Exists'); setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' });
            } else {
                AddDeleteUpadate('PropertyDrug/Update_PropertyDrug', value).then((res) => {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); get_Data_Drug_Modal(masterPropertyID, propertyID,);
                    setChangesStatus(false); setStatesChangeStatus(false); setDrugModal(false); onDrugClose();
                    setDrugErrors({ ...drugErrors, 'SuspectedDrugTypeIDError': '' }); setDrugEditData({})
                })
            }
        }
    }

    const ChangePhoneType = (e, name) => {
        setChangesStatus(true); setStatesChangeStatus(true)
        if (e) {
            if (name === 'LossCodeID') {
                setLossCode(e.id); setPorpRecType(e.code);


                if (propCategoryCode === '09' || propCategoryCode === '22' || propCategoryCode === '65' || propCategoryCode === '66' || propCategoryCode === '77' || propCategoryCode === '11' || propCategoryCode === '10' || propCategoryCode === '48') {
                    setValue({ ...value, [name]: e.value, });
                }
                else if (propCategoryCode === '88') {
                    setValue({ ...value, [name]: e.value, });
                }
                else {
                    setValue({ ...value, [name]: e.value, ['Value']: '', });
                }
                setErrors(({ ...errors, ['ContactError']: 'true', 'CategoryIDError': '' }));
            } else {
                setValue({ ...value, [name]: e.value, });
            }
        } else {
            if (name === 'LossCodeID') {
                setLossCode(''); setPorpRecType('');

                if (propCategoryCode === '09' || propCategoryCode === '22' || propCategoryCode === '65' || propCategoryCode === '66' || propCategoryCode === '77' || propCategoryCode === '11' || propCategoryCode === '10' || propCategoryCode === '48') {
                    setValue({ ...value, [name]: null, });
                }
                else if (propCategoryCode === '88') {
                    setValue({ ...value, [name]: null, });
                }
                else {
                    setValue({ ...value, [name]: null, ['Value']: '', });
                }
                setErrors(({ ...errors, ['ContactError']: 'true' }));
            } else {
                setValue({ ...value, [name]: null, });
            }
        }
    };

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

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => ({
                ...getStatusColors(row.PropertyID, nibrsValidateData),
                ...(row.PropertyID === DecPropID ? {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                    cursor: 'pointer',
                } : {})
            }),
        },
    ];

    const stylesNoColorSourceDrug = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 32,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const conditionalRowStylesDrug = [
        {
            when: row => row.PropertyDrugID === propertyDrugID,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
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

    const onMasterPropClose = () => {
        navigate('/dashboard-page');
    }

    useEffect(() => {
        if (propertyClick && mainIncidentID) {
            ValidateIncidentProperty(mainIncidentID, true);
        }
    }, [propertyClick, mainIncidentID]);


    const ValidateIncidentProperty = (incidentID, isDefaultSelected = false) => {
        setclickNibLoder(true); setSuspectedDrugTypeErrorStatus(false); setIsPropertyIdZeroError(false); setnibrsValidateData([]);
        try {
            fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'PropertyId': '', 'gIntAgencyID': loginAgencyID }).then((data) => {
                console.log("🚀 ~ ValidateIncidentProperty ~ data:", data)
                if (data) {
                    if (data?.Properties?.length > 0) {
                        const propArr = data?.Properties?.filter((item) => item?.PropertyType !== 'V' && item?.PropertyType !== null);


                        if (propArr?.length > 0) {

                            const propErrorArray = propArr || []
                            if (propErrorArray.every(item => item === null || item === undefined)) {
                                setnibrsValidateData([]); setclickNibLoder(false);

                            } else {
                                const isSuspectedDrugType = propArr[0]?.OnPageError?.includes("{352} Add at least one suspected drug type(create a property with type 'Drug')");
                                const isPropertyIdZeroError = propArr[0]?.OnPageError?.includes("{074} Need a property loss code of 5,7 for offense  23B");

                                if (isSuspectedDrugType) {
                                    setSuspectedDrugTypeErrorStatus(true);
                                    setIsPropertyIdZeroError(false);

                                } else if (isPropertyIdZeroError) {
                                    setIsPropertyIdZeroError(true);
                                    setSuspectedDrugTypeErrorStatus(false);

                                } else {
                                    setSuspectedDrugTypeErrorStatus(false);
                                    setIsPropertyIdZeroError(false);

                                    setclickNibLoder(false);

                                }

                                const row = propArr[0];

                                isDefaultSelected && set_EditRow(row);

                                setnibrsValidateData(propArr || []);
                                setclickNibLoder(false);




                            }

                        } else {
                            setnibrsValidateData([]); setclickNibLoder(false);

                        }

                    } else {
                        setnibrsValidateData([]); setclickNibLoder(false);

                    }

                } else {
                    setnibrsValidateData([]); setclickNibLoder(false);

                }
            })
        } catch (error) {
            setnibrsValidateData([]); setclickNibLoder(false);
        }
    }

    const NibrsErrorReturn = async (propertyID) => {
        setclickNibLoder(true); setShowLossCodeError(false); setNibrsErrStr(''); setnibrsFieldError([]);
        try {
            fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': mainIncidentID, 'IncidentNumber': IncNo, 'PropertyId': propertyID, 'gIntAgencyID': loginAgencyID }).then((data) => {
                if (data) {

                    const propArr = data?.Properties?.filter((item) => item?.PropertyType !== 'V');

                    if (propArr?.length > 0) {
                        console.log("🚀 ~ Validate Particular Property :", propArr);
                        setclickNibLoder(false); setnibrsFieldError(propArr[0]); setNibrsErrStr(propArr[0]?.OnPageError);

                    } else {
                        setclickNibLoder(false); setNibrsErrStr(''); setnibrsFieldError([]);
                    }

                } else {
                    setNibrsErrStr(''); setnibrsFieldError([]); setShowLossCodeError(false); setclickNibLoder(false);
                }

            })
        } catch (error) {
            console.log("🚀 ~ ValidateProperty ~ error:", error);
            setclickNibLoder(false); setNibrsErrStr(''); setnibrsFieldError([]); setShowLossCodeError(false);
        }
    }

    const Delete_Prpperty_Drug = () => {
        if (drugLocalArr?.length > 0) {
            const newArray = drugLocalArr?.filter(item => item.PropertyDrugID !== propertyDrugID);
            setDrugLocalArr([...newArray]);
        } else {
            const val = { 'PropertyDrugID': propertyDrugID, 'DeletedByUserFK': loginPinID }
            AddDeleteUpadate('PropertyDrug/Delete_PropertyDrug', val).then((res) => {
                if (res) {

                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    get_Data_Drug_Modal(masterPropertyID, propertyID,);
                    setChangesStatus(false); setStatesChangeStatus(false);
                    dispatch(get_PropertyMainModule_Data(mainIncidentID, MstPage === "MST-Property-Dash" ? true : false));
                } else { console.log("Somthing Wrong"); }
            })
        }
    }

    const onDrugClose = () => {
        setDrugModal(false);
        setValue({
            ...value,
            'SuspectedDrugTypeID': null, 'EstimatedDrugQty': null, 'FractionDrugQty': null, 'MeasurementTypeID': '', 'ClandistineLabsNumber': '',
            'PropertySourceDrugTypeID': '', 'MarijuanaTypeID': null, 'MarijuanaNumber': '', 'DrugManufacturedID': null,
            'Items': '', 'DoseUnits': '', 'LiquidOunces': '', 'SolidGrams': '', 'SolidOunces': '', 'SolidPounds': '',
        })
        setDrugErrors({
            ...drugErrors,
            'SuspectedDrugTypeIDError': '', 'EstimatedDrugQtyError': '', 'MeasurementUnitIDError': '', 'MeasurementTypeIDError': '',
        })
        setDrugEditData({}); setPropertyDrugID('');
    }

    // ---------------------offence-----------------------------    

    const CheckboxOption = props => {
        return (
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />
                <label className='ml-2'>{props.label}</label>
            </components.Option>
        );
    };

    const [offenseDrp, setOffenseDrp] = useState();
    const [offenseEditVal, setOffenseEditVal] = useState([]);
    const [offensemultiSelected, setOffensemultiSelected] = useState({
        optionSelected: null
    })

    useEffect(() => {
        if (offenseEditVal) {
            setOffensemultiSelected(prevValues => { return { ...prevValues, ['OffenseID']: offenseEditVal } });
        }
    }, [offenseEditVal])

    const customStyleOffenseWithoutColor = {
        control: base => ({
            ...base,
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "134px",
            overflowY: "auto",
        }),
    };

    const customStyleOffenseNibrsErrorColor = {
        control: base => ({
            ...base,
            backgroundColor: "#F29A9A",
            minHeight: 60,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: "134px",
            overflowY: "auto",
        }),
    };

    const get_Offense_DropDown = (incidentID, propertyID) => {
        const val = { 'IncidentID': incidentID, 'PropertyID': propertyID || 0 }
        fetchPostData('PropertyOffense/GetDataDropDown_PropertyOffense', val).then((data) => {
            console.log("🚀 ~ get_Offense_DropDown ~ data:", data)
            if (data) {
                setOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description'));

            } else {
                setOffenseDrp([]);

            }
        }).catch((err) => {
            console.log("🚀 ~get_Offense_DropDown fetchpostdata error ~ err:", err);
        })
    }

    const getEditOffenseData = (propertyID, DecMPropID, mainIncidentID) => {
        const val = { 'PropertyID': propertyID, 'MasterPropertyID': DecMPropID ? DecMPropID : 0, 'IncidentID': mainIncidentID, 'OffenseID': 0, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        fetchPostData('PropertyOffense/GetData_PropertyOffense', val).then((res) => {
            console.log("🚀 ~ getEditOffenseData ~ res:", res)
            if (res) {
                // data, Id, Code, type, col3, col4, NIBRSCode, AttmComp
                setOffenseEditVal(offenseArray(res, 'PropertyOffenseID', 'OffenseID', 'PropertyID', 'PropertyID', 'Offense_Description', 'NIBRSCode', 'AttemptComplete'));

            } else {
                setOffenseEditVal([]);

            }
        });
    }

    const offenseMulitiSelectOnchange = (multiSelected) => {
        setStatesChangeStatus(true);
        setOffensemultiSelected({
            ...offensemultiSelected,
            OffenseID: multiSelected
        })

        const len = multiSelected.length - 1
        if (multiSelected?.length < offenseEditVal?.length) {
            let missing = null;
            let i = offenseEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(offenseEditVal[--i])) ? missing : offenseEditVal[i];
            }
            DeleteOffense(missing.value, 'propertyOffenseID', 'PropertyOffense/Delete_PropertyOffense')

        } else {
            InsertOffense(multiSelected[len]?.value, 'OffenseID', 'PropertyOffense/Insert_PropertyOffense')

        }
        // if (multiSelected.length > 0) {
        //     setoffenceCountStatus(true);
        // } else {
        //     setoffenceCountStatus(false);
        // }

    }

    const DeleteOffense = (id, col1, url) => {
        const val = {
            'PropertyOffenseID': id,
            'DeletedByUserFK': loginPinID,
            'MasterPropertyID': masterPropertyID,
            'PropertyID': propertyID,
            'IsMaster': MstPage === "MST-Property-Dash" ? true : false
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Offense_DropDown(mainIncidentID, propertyID);
                getEditOffenseData(propertyID, masterPropertyID, mainIncidentID);

            } else {
                console.log("Somthing Wrong");
            }
        }).catch((err) => {
            console.log("🚀 ~ Insert AddDeleteUpadate ~ err:", err);
        })
    }

    const InsertOffense = (id, col1, url) => {
        const val = {
            'IncidentID': mainIncidentID,
            'PropertyID': propertyID,
            'CreatedByUserFK': loginPinID,
            'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
            'MasterPropertyID': masterPropertyID,
            'labal': '',
            'OffenseID': id,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData?.Table[0].Message;
                toastifySuccess(message);
                get_Offense_DropDown(mainIncidentID, propertyID);
                getEditOffenseData(propertyID, masterPropertyID, mainIncidentID);

            } else {
                console.log("Somthing Wrong");

            }
        }).catch((err) => {
            console.log("🚀 ~ Insert AddDeleteUpadate ~ err:", err);
        })
    }

    // don't remove code
    const check_OffenceCode_NibrsError = (OffenceArray = [], lossCode, propCategoryCode) => {
        try {
            if (!Array.isArray(OffenceArray) || OffenceArray.length === 0) {
                return '';
            }

            for (const offence of OffenceArray) {
                const checkResult = check_OffenceCode_NoneUnknown(offence?.NIBRSCode, lossCode, offence?.AttmComp, propCategoryCode);

                if (checkResult) {
                    return checkResult; // return immediately if a match is found
                }
            }

            // if no offences matched condition
            return '';
        } catch (error) {
            console.error("🚀 ~ check_OffenceCode_NibrsError ~ error:", error);
            return '';
        }
    };

    // const check_OffenceCode_NibrsError = (OffenceArray) => {
    //     try {
    //         if (OffenceArray?.length > 0) {
    //             for (let i = 0; i < OffenceArray?.length; i++) {
    //                 let checkOffenceCodeNoneUnknown = check_OffenceCode_NoneUnknown(OffenceArray[i]?.NIBRSCode, lossCode, OffenceArray[i]?.AttmComp, propCategoryCode)
    //                 if (checkOffenceCodeNoneUnknown) {
    //                     return checkOffenceCodeNoneUnknown
    //                  
    //                 } else {
    //                     return ''
    //                 }
    //             }
    //         }
    //     } catch (error) {
    //         console.log("🚀 ~ check_OffenceCode_NibrsError ~ error:", error);
    //         return ''

    //     }
    // }

    return (
        <>
            <div className="col-12">
                <div className="row">
                    <div className="col-12 col-md-12 col-lg-11 pt-1 p-0" >
                        <div className="row ">
                            <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                                <label htmlFor="" className='new-label px-0'>Property No.</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-1 text-field">
                                <input type="text" className='readonlyColor' value={propertyNumber ? propertyNumber : 'Auto Generated'} required readOnly />
                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2 px-1">
                                <label htmlFor="" className='new-label'>
                                    Loss Code
                                    {errors.LossCodeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                {
                                    nibrsFieldError?.OnPageError && !nibrsFieldError?.IsCategory && (

                                        nibrsFieldError?.OnPageError?.includes("{201} Criminal Activity must be present - Mandatory field") ?
                                            <></>
                                            :
                                            <div className="nibrs-tooltip-error">
                                                <div className="tooltip-arrow"></div>
                                                <div className="tooltip-content">
                                                    <span className="text-danger">⚠️ {nibrsFieldError?.OnPageError || ''}</span>
                                                </div>
                                            </div>
                                    )
                                }
                                <Select
                                    name='LossCodeID'
                                    value={propertyLossCodeDrpData?.filter((obj) => obj.value === value?.LossCodeID)}
                                    options={propertyLossCodeDrpData}
                                    onChange={(e) => ChangePhoneType(e, 'LossCodeID')}
                                    isClearable
                                    placeholder="Select..."
                                    styles={isLockOrRestrictModule("Lock", editval[0]?.LossCodeID, isLocked) ? LockFildscolour : Requiredcolour}
                                    isDisabled={isLockOrRestrictModule("Lock", editval[0]?.LossCodeID, isLocked)}
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                <label htmlFor="" className='new-label'>Value
                                    {errors.ContactError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
                                    ) : null}
                                </label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                <input
                                    type="text"
                                    name="Value"
                                    id="Value"
                                    className={isLockOrRestrictModule("Lock", editval[0]?.Value, isLocked) ? 'LockFildsColor' : !value?.CategoryID ? 'readonlyColor' : lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
                                    maxLength={9}
                                    disabled={isLockOrRestrictModule("Lock", editval[0]?.Value, isLocked) || !value?.CategoryID || propCategoryCode === '09' || propCategoryCode === '22' || propCategoryCode === '65' || propCategoryCode === '66' || propCategoryCode === '88' || propCategoryCode === '10' || propCategoryCode === '10' || propCategoryCode === '48'}
                                    value={`$${value?.Value}`}
                                    onChange={HandleChanges}
                                    required
                                    autoComplete='off'
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                <span className='new-label '>
                                    Type{errors.PropertyTypeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PropertyTypeIDError}</p>
                                    ) : null}
                                </span>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-1">
                                <Select
                                    name='PropertyTypeID'
                                    value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                    options={propertyTypeData}
                                    onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                    isClearable
                                    placeholder="Select..."
                                    styles={isLockOrRestrictModule("Lock", editval[0]?.PropertyTypeID, isLocked) ? LockFildscolour : propertyID || masterPropertyID ? customStylesWithOutColor : Requiredcolour}
                                    isDisabled={isLockOrRestrictModule("Lock", editval[0]?.PropertyTypeID, isLocked) || propertyID || masterPropertyID || isDrugOffense ? true : false}
                                // styles={propertyID || masterPropertyID ? customStylesWithOutColor : Requiredcolour}
                                // isDisabled={propertyID || masterPropertyID || isDrugOffense ? true : false}
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-1 mt-2">
                                <span data-toggle="modal" onClick={() => {
                                    setOpenPage('Property Description')
                                }} data-target="#ListModel" className='new-link'>
                                    Category{
                                        loginAgencyState === 'TX' ?
                                            check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'ToolTip')
                                                ?
                                                check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'ToolTip')
                                                :
                                                <></>
                                            :
                                            <></>
                                    }
                                    {errors.CategoryIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</p>
                                    ) : null}
                                </span>
                            </div>
                            <div className="col-3 col-md-3 col-lg-3 mt-2">
                                {nibrsFieldError?.IsCategory && (
                                    <div className="nibrs-tooltip-error" style={{ left: '-20px' }}>
                                        <div className="tooltip-arrow"></div>
                                        <div className="tooltip-content">
                                            <span className="text-danger">⚠️ {nibrsFieldError?.Category || ''}</span>
                                        </div>
                                    </div>
                                )}
                                <Select
                                    name='CategoryID'
                                    id='CategoryID'
                                    styles={
                                        isLockOrRestrictModule("Lock", editval[0]?.CategoryID, isLocked) ? LockFildscolour :
                                            loginAgencyState === 'TX' ?
                                                check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'Color')
                                                    ?
                                                    check_Category_Nibrs(nibrsCodeArr, propRecType, propCategoryCode, 'Color')
                                                    :
                                                    Requiredcolour
                                                :
                                                Requiredcolour
                                    }
                                    isDisabled={isLockOrRestrictModule("Lock", editval[0]?.CategoryID, isLocked)}

                                    value={propertyCategoryData?.filter((obj) => obj.value === value?.CategoryID)}
                                    options={propertyCategoryData}
                                    onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                <label htmlFor="" className='new-label px-0' style={{ paddingLeft: '5px' }}>Classification</label>
                            </div>
                            <div className="col-9 col-md-9 col-lg-2 mt-1">
                                <Select
                                    styles={isLockOrRestrictModule("Lock", editval[0]?.ClassificationID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                                    isDisabled={isLockOrRestrictModule("Lock", editval[0]?.ClassificationID, isLocked)}

                                    name='ClassificationID'
                                    value={propertyClassificationData?.filter((obj) => obj.value === value?.ClassificationID)}
                                    options={propertyClassificationData}
                                    onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                    isClearable
                                    placeholder="Select..."
                                />
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                <label htmlFor="" className='new-label'>Reported Date/Time</label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                <DatePicker
                                    id='ReportedDtTm'
                                    name='ReportedDtTm'
                                    ref={startRef}
                                    onKeyDown={(e) => {
                                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                            e?.preventDefault();
                                        } else {
                                            onKeyDown(e);
                                        }
                                    }}
                                    dateFormat="MM/dd/yyyy HH:mm"
                                    isClearable={false}
                                    disabled={true}
                                    selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                    onChange={(date) => {
                                        setChangesStatus(true); setStatesChangeStatus(true);
                                        if (date > new Date(datezone)) {
                                            date = new Date(datezone);
                                        }
                                        setIncidentReportedDate(date ? getShowingMonthDateYear(date) : null)
                                        if (date >= new Date()) {
                                            setValue({ ...value, ['ReportedDtTm']: new Date() ? getShowingDateText(new Date()) : null })
                                        } else if (date <= new Date(incReportedDate)) {
                                            setValue({ ...value, ['ReportedDtTm']: incReportedDate ? getShowingDateText(incReportedDate) : null })
                                        } else {
                                            setValue({ ...value, ['ReportedDtTm']: date ? getShowingDateText(date) : null })
                                        }
                                    }}
                                    autoComplete="Off"
                                    className='requiredColor'
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
                                    timeFormat="HH:mm"
                                    is24Hour
                                    filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                                />

                            </div>
                            {
                                // // don't remove code
                                // (propertyID || masterPropertyID) && (ProSta === 'true' || ProSta === true) &&
                                // <>
                                //     <div className="col-1 col-md-1 col-lg-1 mt-4">
                                //         <label htmlFor="" className='new-label '>
                                //             Offense{
                                //                 check_OffenceCode_NibrsError(offensemultiSelected?.OffenseID, lossCode,propCategoryCode) ? <ErrorTooltip ErrorStr={check_OffenceCode_NibrsError(offensemultiSelected?.OffenseID, lossCode,propCategoryCode)} /> : ''
                                //             }
                                //         </label>
                                //     </div>
                                //     <div className="col-7 col-md-7 col-lg-7 mt-2">
                                //         <SelectBox
                                //             name='OffenseID'
                                //             isClearable
                                //             options={offenseDrp}
                                //             value={offensemultiSelected.OffenseID}
                                //             closeMenuOnSelect={false}
                                //             components={{ Option: CheckboxOption }}
                                //             placeholder="Select.."
                                //             onChange={(e) => offenseMulitiSelectOnchange(e)}
                                //             // ref={SelectedValue}
                                //             className="basic-multi-select select-box_offence"
                                //             isMulti
                                //             styles={check_OffenceCode_NibrsError(offensemultiSelected?.OffenseID) ? customStyleOffenseNibrsErrorColor : customStyleOffenseWithoutColor}
                                //         />
                                //     </div>
                                // </>
                            }
                        </div>
                        <div className="text-center p-1 d-flex justify-content-center">
                            {
                                suspectedDrugTypeErrorStatus ? (
                                    <span
                                        style={{ color: 'red', textAlign: 'center', }}
                                        onClick={() => { '' }}>
                                        <u>⚠️ {"{352} Add at least one suspected drug type(create a property with type 'Drug')" || ''}</u>
                                    </span>
                                )
                                    :
                                    isPropertyIdZeroError ? (
                                        <span
                                            style={{ color: 'red', textAlign: 'center', }}
                                            onClick={() => { '' }}>
                                            <u>⚠️ {'{074} Need a property loss code of 5,7 for offense  23B' || ''}</u>
                                        </span>
                                    )
                                        :
                                        (
                                            nibrsFieldError?.OnPageError && (
                                                <span
                                                    style={{ color: 'red', textAlign: 'center', }}
                                                    onClick={() => { '' }}>
                                                    <u>⚠️ {nibrsFieldError?.OnPageError || ''}</u>
                                                </span>
                                            )
                                        )
                            }
                        </div>
                    </div>
                    {
                        value.PropertyCategoryCode === 'D' ?
                            <div className="col-12 col-md-12 pt-2 p-0" >
                                <div className=" ">
                                    <fieldset className='p-0'>
                                        <legend> Drug  </legend>
                                        <div className="col-12">
                                            <div className="row mt-1">
                                                <div className="col-12 col-md-2 col-lg-3 mt-2 ">
                                                    <label htmlFor="SuspectedDrugTypeID" className="form-label" style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                                                        Drug Type
                                                    </label>
                                                    <div>
                                                        <Select
                                                            inputId="SuspectedDrugTypeID"
                                                            name="SuspectedDrugTypeID"
                                                            value={suspectedDrugDrpData?.filter(obj => obj.value === value?.SuspectedDrugTypeID)}
                                                            isClearable
                                                            options={suspectedDrugDrpData}
                                                            onChange={(e) => onChangeDrugType(e, 'SuspectedDrugTypeID')}
                                                            placeholder="Select..."
                                                            // styles={Requiredcolour}
                                                            styles={isLockOrRestrictModule("Lock", drugEditData?.SuspectedDrugTypeID, isLocked) ? LockFildscolour : Requiredcolour}
                                                            isDisabled={isLockOrRestrictModule("Lock", drugEditData?.SuspectedDrugTypeID, isLocked)}
                                                        />
                                                        {drugErrors.SuspectedDrugTypeIDError !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.SuspectedDrugTypeIDError}</p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-2 col-lg-2 mt-2 ">
                                                    <label className='form-label' style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                                                        Measurement Unit
                                                    </label>
                                                    <div>
                                                        <Select
                                                            name='MeasurementUnitID'
                                                            value={drugMeasureUnitData?.filter((obj) => obj.value === value?.MeasurementUnitID)}
                                                            options={drugMeasureUnitData}
                                                            onChange={(e) => onChangeDrugType(e, 'MeasurementUnitID')}
                                                            placeholder="Select..."
                                                            isClearable
                                                            // styles={Requiredcolour}
                                                            styles={isLockOrRestrictModule("Lock", drugEditData?.MeasurementUnitID, isLocked) ? LockFildscolour : Requiredcolour}
                                                            isDisabled={isLockOrRestrictModule("Lock", drugEditData?.MeasurementUnitID, isLocked)}
                                                        />
                                                        {drugErrors.MeasurementUnitIDError !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.MeasurementUnitIDError}</p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-2 col-lg-2 mt-2 ">
                                                    <label className='form-label' htmlFor="MeasurementTypeID" style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                                                        Measurement Type
                                                    </label>
                                                    <div >
                                                        <Select
                                                            name='MeasurementTypeID'
                                                            options={drugMeasureTypeData}
                                                            value={drugMeasureTypeData?.filter((obj) => obj.value === value?.MeasurementTypeID)}
                                                            onChange={(e) => onChangeDrugType(e, 'MeasurementTypeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                            // styles={Requiredcolour}
                                                            styles={isLockOrRestrictModule("Lock", drugEditData?.MeasurementTypeID, isLocked) ? LockFildscolour : Requiredcolour}
                                                            isDisabled={isLockOrRestrictModule("Lock", drugEditData?.MeasurementTypeID, isLocked)}
                                                        />
                                                        {drugErrors.MeasurementTypeIDError !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.MeasurementTypeIDError}</p>
                                                        ) : null}
                                                    </div>
                                                </div>

                                                <div className="col-12 col-md-2 col-lg-2 mt-2">
                                                    <label className='form-label' htmlFor="EstimatedDrugQty" style={{ fontSize: '13px', color: '#283041', fontWeight: '500' }}>
                                                        Estimated Drug Qty
                                                    </label>
                                                    <div className="text-field mt-0">
                                                        <input
                                                            type="number"
                                                            name='EstimatedDrugQty'
                                                            id='EstimatedDrugQty'
                                                            className={isLockOrRestrictModule("Lock", drugEditData?.EstimatedDrugQty, isLocked) ? 'LockFildsColor' : 'requiredColor'}
                                                            disabled={isLockOrRestrictModule("Lock", drugEditData?.EstimatedDrugQty, isLocked)}
                                                            autoComplete='off'
                                                            maxLength={12}
                                                            step="0.001"
                                                            value={value?.EstimatedDrugQty}
                                                            onChange={(e) => {
                                                                if (e.target.value?.length > 12) {
                                                                    return;
                                                                }
                                                                const val = e.target.value;
                                                                if (val.includes('.')) {
                                                                    const [whole, decimal] = val.split('.');
                                                                    if (decimal.length > 3) {
                                                                        return;
                                                                    }
                                                                }
                                                                setValue({ ...value, EstimatedDrugQty: val });
                                                            }}
                                                        />
                                                    </div>
                                                    {drugErrors.EstimatedDrugQtyError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.EstimatedDrugQtyError}</p>
                                                    ) : null}
                                                </div>

                                                <div className="btn-box text-right col-3 col-md-2  pt-2" style={{ marginTop: '28px', marginLeft: 'auto' }}>
                                                    <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={onDrugClose}>New</button>
                                                    {
                                                        propertyDrugID ?
                                                            <>
                                                                <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => { check_Drug_Validation_Error() }}>Update </button>
                                                            </>
                                                            :
                                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { check_Drug_Validation_Error() }}>Add Drug</button>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                                <div className="row ">
                                    <div className="col-12 modal-table mt-1">
                                        <DataTable
                                            fixedHeader
                                            persistTableHead={true}
                                            customStyles={tableCustomStyles}
                                            dense
                                            conditionalRowStyles={conditionalRowStylesDrug}
                                            columns={columns}
                                            data={drugData?.length > 0 ? drugData : drugLocalArr}
                                            onRowClicked={(row) => set_Edit_Value(row)}
                                            pagination
                                            paginationPerPage={'5'}
                                            fixedHeaderScrollHeight='80px'
                                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                            highlightOnHover
                                            noDataComponent={"There are no data to display"}
                                        />
                                    </div>
                                </div>
                            </div>
                            :
                            <>
                            </>
                    }
                    <div className="col-12 text-right mb-1 mt-1 field-button  d-flex justify-content-between" style={{ marginTop: "1px" }}>
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
                                        onClick={() => { ValidateIncidentProperty(mainIncidentID) }}
                                        className={`ml-3 ${nibrsValidateData?.length > 0 ? `btn btn-sm  mr-2` : 'btn btn-sm btn-success mr-2'}`}
                                        style={{
                                            backgroundColor: `${nibrsValidateData?.length > 0 ? nibrsValidateData?.length > 0 ? 'red' : 'green' : ''}`,
                                        }}
                                    >
                                        Validate TIBRS
                                    </button>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-success mx-1"
                                            onClick={() => { newProperty(); setIsLocked(false); }}
                                        >
                                            New
                                        </button>
                                        {
                                            (propertyID || masterPropertyID) && (ProSta === 'true' || ProSta === true) ?
                                                effectiveScreenPermission ?
                                                    effectiveScreenPermission[0]?.Changeok && nibrsSubmittedProperty !== 1 ?
                                                        <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                        :
                                                        <>
                                                        </>
                                                    :
                                                    <button type="button" disabled={!statesChangeStatus} className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Update</button>
                                                :
                                                effectiveScreenPermission ?
                                                    effectiveScreenPermission[0]?.AddOK ?
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onDoubleClick={''} onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                                        :
                                                        <>
                                                        </>
                                                    :
                                                    <button type="button" className="btn btn-sm btn-success mr-1" onDoubleClick={''} onClick={(e) => { check_Validation_Error(); }}>Save</button>
                                        }
                                        {
                                            MstPage === "MST-Property-Dash" &&
                                            <button type="button" className="btn btn-sm btn-success mx-1" onClick={onMasterPropClose} data-dismiss="modal">Close</button>
                                        }
                                    </div>
                                </>
                            )
                        }

                    </div>
                </div >
            </div >
            {
                drugModal &&
                <div className="modal fade" style={{ background: 'rgba(0,0,0, 0.5)' }} id='DrugModal' tabIndex='-1' aria-hidden='true' data-backdrop='false'>
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "end" }}><b>X</b>
                            </button>
                            <div className="modal-body">
                                <div className="m-1 mt-3 bb">
                                    <fieldset >
                                        <legend >Drugs</legend>
                                        <div className="col-12">
                                            <div className="row mt-1">
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Suspected&nbsp;Drug&nbsp;Type{drugErrors.SuspectedDrugTypeIDError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.SuspectedDrugTypeIDError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-3 mt-1">
                                                    <Select
                                                        name='SuspectedDrugTypeID'
                                                        styles={Requiredcolour}
                                                        value={suspectedDrugDrpData?.filter((obj) => obj.value === value?.SuspectedDrugTypeID)}
                                                        isClearable
                                                        options={suspectedDrugDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'SuspectedDrugTypeID')}
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-3 mt-2">
                                                    <label className='new-label'>Property Source Drug Type</label>
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-4 mt-1">
                                                    <Select
                                                        name='PropertySourceDrugTypeID'
                                                        styles={customStylesWithOutColor}
                                                        value={propSourceDrugDrpData?.filter((obj) => obj.value === value?.PropertySourceDrugTypeID)}
                                                        options={propSourceDrugDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'PropertySourceDrugTypeID')}
                                                        placeholder="Select..."
                                                        isClearable
                                                        isDisabled={drugTypecode !== 'E' ? false : true}
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Estimated&nbsp;Drug&nbsp;Qty  {drugErrors.EstimatedDrugQtyError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.EstimatedDrugQtyError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={9} name='EstimatedDrugQty' id='EstimatedDrugQty' disabled={value?.MeasurementTypeID === 11} value={value?.EstimatedDrugQty} onChange={HandleChanges} className={value?.MeasurementTypeID !== 11 ? 'requiredColor' : ''} required={value?.MeasurementTypeID !== 11} autoComplete='off' />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Fraction Drug Qty {drugErrors.FractionDrugQtyError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.FractionDrugQtyError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={9} name='FractionDrugQty' id='FractionDrugQty' value={value?.FractionDrugQty} onChange={HandleChanges} className='requiredColor' required autoComplete='off' />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2 pt-1">
                                                    <label className='new-label'>

                                                        Measurement Type

                                                        {drugErrors.MeasurementTypeIDError !== 'true' ? (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{drugErrors.MeasurementTypeIDError}</p>
                                                        ) : null}
                                                    </label>

                                                </div>
                                                <div className="col-9 col-md-9 col-lg-2 mt-2 ">
                                                    <Select
                                                        name='MeasurementTypeID'
                                                        value={measureTypeDrpData?.filter((obj) => obj.value === value?.MeasurementTypeID)}
                                                        styles={Requiredcolour}
                                                        options={measureTypeDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'MeasurementTypeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">

                                                    <label className='new-label'>Solid Pounds</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={9} name='SolidPounds' id='SolidPounds' value={value?.SolidPounds} onChange={HandleChanges} required autoComplete='off' />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Solid Ounces</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-1 text-field">
                                                    <input type="text" maxLength={9} name='SolidOunces' id='SolidOunces' value={value?.SolidOunces} onChange={HandleChanges} required autoComplete='off' />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Solid Grams</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                                                    <input type="text" maxLength={9} name='SolidGrams' id='SolidGrams' value={value?.SolidGrams} onChange={HandleChanges} required autoComplete='off' />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Liquid Ounces</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                                                    <input type="text" maxLength={9} name='LiquidOunces' id='LiquidOunces' value={value?.LiquidOunces} onChange={HandleChanges} required autoComplete='off' />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Dose Units</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                                                    <input type="text" maxLength={9} name='DoseUnits' id='DoseUnits' value={value?.DoseUnits} onChange={HandleChanges} required autoComplete='off' />
                                                </div>
                                                <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                    <label className='new-label'>Items</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2 mt-2 text-field">
                                                    <input type="text" maxLength={9} name='Items' id='Items' value={value?.Items} onChange={HandleChanges} required autoComplete='off' />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            <div className="btn-box text-right mr-1 mb-2">

                                {
                                    propertyDrugID && nibrsSubmittedProperty !== 1 ? (
                                        <button
                                            type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={() => check_Drug_Validation_Error()}
                                        >  Update
                                        </button>
                                    ) : !propertyDrugID ? (
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => check_Drug_Validation_Error()}
                                        >
                                            Save
                                        </button>
                                    ) : null // If propertyDrugID exists and nibrsSubmittedStatus === 1, show nothing
                                }

                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1">Close</button>
                            </div>
                        </div>
                    </div >
                </div >
            }

            <div className="col-12 modal-table pt-1">
                <DataTable
                    dense
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    conditionalRowStyles={conditionalRowStyles}
                    columns={columns1}
                    data={propertyMainModuleData}
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    onRowClicked={(row) => {
                        set_EditRow(row);
                    }}
                    // fixedHeaderScrollHeight='90px'
                    // pagination
                    // paginationPerPage={'100'}
                    // paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    noDataComponent={"There are no data to display"}
                />

            </div>
            <ListModal {...{ openPage, setOpenPage }} />
            <ChangesModal func={check_Validation_Error} setToReset={newProperty} />
            <DeletePopUpModal func={!isProperty ? Delete_Prpperty_Drug : Delete_Property} />
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

export default Properties

const Get_Property_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.PropertyTypeID)
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

const Get_Drug_Code = (data, dropDownData) => {
    const newArr = [];
    newArr.push(data);

    const result = newArr?.map((sponsor) =>
        (sponsor.SuspectedDrugTypeID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === parseInt(result[0])) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}

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

const Get_LossCodes = (data, dropDownData) => {

    const result = data?.map((sponsor) => (sponsor.CategoryID))

    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.code }
        }
    })

    const val = result2.filter(function (element) {
        return element !== undefined;
    });

    return val[0]?.id
}

