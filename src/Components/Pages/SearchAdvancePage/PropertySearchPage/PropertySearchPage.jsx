import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, Encrypted_Id_Name, colourStyles, customStylesWithOutColor, getShowingMonthDateYear, getShowingWithOutTime, getYearWithOutDateTime } from '../../../Common/Utility';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat, threeColArray } from '../../../Common/ChangeArrayFormat';
import DataTable from 'react-data-table-component';
import { get_BoatModel_Drp_Data, get_Bottom_Color_Drp_Data, get_Make_Drp_Data, get_Material_Drp_Data, get_MeasureType_Drp_Data, get_PropertyLossCode_Drp_Data, get_PropertyTypeData, get_Propulusion_Drp_Data, get_State_Drp_Data, get_SuspectedDrug_Drp_Data, get_Top_Color_Drp_Data, get_VOD_Drp_Data, get_WeaponMake_Drp_Data, get_WeaponModel_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { Property_LossCode_Drp_Data } from '../../../../redux/actionTypes';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import classNames from 'classnames';


const PropertySearchPage = ({ isCAD = false, setSelectSearchRecord = () => { } }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
    const propertyLossCodeDrpData = useSelector((state) => state.DropDown.propertyLossCodeDrpData);
    const topColorDrpData = useSelector((state) => state.DropDown.topColorDrpData);
    const bottomColorDrpData = useSelector((state) => state.DropDown.bottomColorDrpData);
    const vodDrpData = useSelector((state) => state.DropDown.vodDrpData);
    const stateDrpData = useSelector((state) => state.DropDown.stateDrpData);
    const materialDrpData = useSelector((state) => state.DropDown.materialDrpData);
    const makeDrpData = useSelector((state) => state.DropDown.makeDrpData);
    const boatModelDrpData = useSelector((state) => state.DropDown.boatModelDrpData);
    const propulusionDrpData = useSelector((state) => state.DropDown.propulusionDrpData);
    const measureTypeDrpData = useSelector((state) => state.DropDown.measureTypeDrpData);
    const weaponMakeDrpData = useSelector((state) => state.DropDown.weaponMakeDrpData);
    const weaponModelDrpData = useSelector((state) => state.DropDown.weaponModelDrpData);
    const suspectedDrugDrpData = useSelector((state) => state.DropDown.suspectedDrugDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);

    // const screenCode1 = effectiveScreenPermission[0]?.ScreenCode1;

    const { setPropertySearchData, GetDataTimeZone, datezone, recentSearchData, setRecentSearchData, searchObject, setSearchObject } = useContext(AgencyContext);
    const [weaponfactureDate, setWeaponfactureDate] = useState();
    const [weaponfactureDateto, setWeaponfactureDateTo] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [manufactureDateto, setManufactureDateTo] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPINID] = useState('');
    const [propertyCategoryData, setPropertyCategoryData] = useState([]);
    const [propertyClassificationData, setPropertyClassificationData] = useState([]);
    const [editval, setEditval] = useState([]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPINID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("P103", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    const [value, setValue] = useState({
        'IncidentNumber': null, 'PropertyNumber': null, 'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': null, 'ReportedDtTmTo': null,
        'PropertyCategoryCode': null, 'CategoryID': null, 'LastName': null, 'FirstName': null, 'MiddleName': null, 'AgencyID': '',
        'SecurityDtTm': '', 'RegistrationExpiryDtTm': '', 'RegistrationNumber': '', 'MaterialID': null, 'PropulusionID': '', 'Comments': '',
        'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'QuantityUnitID': null, 'Brand': '', 'MeasurementTypeID': '',
        'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': null, 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'MakeID': '',
        'WeaponModelID': null, 'IsAuto': '', 'BarrelLength': '', 'Length': '', 'HIN': '', 'VODID': null, 'RegistrationStateID': '',
        'ClassificationID': null, 'Description': '', 'NICB': '', 'ValueFrom': '', 'Valueto': '', 'PropertyNumberTo': null,
        'SuspectedDrugTypeID': null, 'DispositionID': null, 'EstimatedDrugQty': null, 'FractionDrugQty': null, 'ManufactureYearTo': '',
        'ManufactureYearFrom': '', CADEventTo: "", CADEventFrom: "",
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'ReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK, isAllAgencies: false,
        isSelfAgency: true
    });

    useEffect(() => {
        if (loginAgencyID) {
            dispatch(get_PropertyTypeData(loginAgencyID));
            if (topColorDrpData?.length === 0) dispatch(get_Top_Color_Drp_Data(loginAgencyID))
            if (bottomColorDrpData?.length === 0) dispatch(get_Bottom_Color_Drp_Data(loginAgencyID))
            if (vodDrpData?.length === 0) dispatch(get_VOD_Drp_Data(loginAgencyID));
            if (stateDrpData?.length === 0) dispatch(get_State_Drp_Data());
            if (materialDrpData?.length === 0) dispatch(get_Material_Drp_Data(loginAgencyID))
            if (makeDrpData?.length === 0) dispatch(get_Make_Drp_Data(loginAgencyID))
            if (boatModelDrpData?.length === 0) dispatch(get_BoatModel_Drp_Data(loginAgencyID));
            if (propulusionDrpData?.length === 0) dispatch(get_Propulusion_Drp_Data(loginAgencyID));
            if (measureTypeDrpData?.length === 0) dispatch(get_MeasureType_Drp_Data(loginAgencyID));
            if (weaponMakeDrpData?.length === 0) dispatch(get_WeaponMake_Drp_Data(loginAgencyID));
            if (weaponModelDrpData?.length === 0) dispatch(get_WeaponModel_Drp_Data(loginAgencyID));
            if (suspectedDrugDrpData?.length === 0) dispatch(get_SuspectedDrug_Drp_Data(loginAgencyID));
            dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));
        }
    }, [loginAgencyID]);


    const handlChange = (e,) => {
        // if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
        //     let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        //     if (ele.length === 10) {
        //         const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
        //         const match = cleaned.match(/^(\w{3})(\d{7})$/);
        //         if (match) {
        //             setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
        //         }
        //     } else {
        //         ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
        //         setValue({ ...value, [e.target.name]: ele })
        //         if (ele?.length == 0) { e.target.name == 'PropertyNumber' && setValue({ ...value, ['PropertyNumberTo']: "", [e.target.name]: ele }) }
        //     }
        // }
        if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'PropertyNumber' && setValue({
                    ...value, ['PropertyNumberTo']: "", [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'CADEventFrom') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'CADEventFrom' && setValue({
                    ...value, ['CADEventTo']: "", [e.target.name]: ele
                });
            }
        }
        // else { setValue({ ...value, [e.target.name]: e.target.value }) }
        // else if (e.target.name === 'IncidentNumber') {
        //     let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
        //     if (ele.length === 8) {
        //         const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
        //         const match = cleaned.match(/^(\d{2})(\d{6})$/);
        //         if (match) {
        //             setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
        //         }
        //     } else {
        //         ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
        //         setValue({ ...value, [e.target.name]: ele })
        //     }
        // }
        //-----new Update-----------------
        else if (e.target.name === 'ValueFrom' || e.target.name === 'Valueto') {
            let ele = e.target.value;
            ele = ele.replace(/[^0-9.]/g, "");
            if (ele.includes('.')) {
                let [integerPart, decimalPart] = ele.split('.');
                decimalPart = decimalPart.substring(0, 2);
                ele = `${integerPart}.${decimalPart}`;
            }
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0 && e.target.name === 'ValueFrom') {
                setValue({ ...value, ['Valueto']: "", [e.target.name]: ele });
            }
        } else if (e.target.name === 'isSelfAgency' || e.target.name === 'isAllAgencies') {
            setValue({ ...value, [e.target.name]: e.target.checked })
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }

    const [refineSearchData, setRefineSearchData] = useState(null);

    useEffect(() => {
        if (location.state?.fromRefineSearch) {
            setRefineSearchData(location.state);
            setValue(location.state.searchState || {});
        } else if (!refineSearchData) {
            // If no refine search data, reset the form
            Reset();
        }

        // Clear location.state AFTER saving the data locally
        if (location.state) {
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, refineSearchData]);


    const getPropertySearch = async () => {
        if (value?.IncidentNumber?.trim() || value?.PropertyNumber?.trim() || value?.PropertyTypeID ||
            value?.LossCodeID || value?.ReportedDtTm?.trim() || value?.ReportedDtTmTo?.trim() || value?.PropertyCategoryCode?.trim() || value?.LastName?.trim() || value?.FirstName?.trim() || value?.MiddleName?.trim() || value?.SecurityDtTm?.trim() ||
            value?.RegistrationExpiryDtTm?.trim() || value?.RegistrationNumber?.trim() || value?.MaterialID || value?.PropulusionID || value?.Comments?.trim() || value?.SerialID || value?.ModelID || value?.TopColorID || value?.BottomColorID ||
            value?.OAN?.trim() || value?.Quantity?.trim() || value?.QuantityUnitID || value?.Brand?.trim() ||
            value?.MeasurementTypeID || value?.Denomination?.trim() || value?.IssuingAgency?.trim() || value?.MeasureTypeID || value?.Style?.trim() || value?.Finish?.trim() || value?.Caliber?.trim() || value?.Handle?.trim() || value?.MakeID
            || value?.WeaponModelID || value?.IsAuto || value?.MakeID || value?.BarrelLength || value?.ManufactureYearTo || value?.Length
            || value?.HIN || value?.VODID || value?.RegistrationStateID || value?.ClassificationID || value?.Description?.trim()
            || value?.NICB?.trim()
            || value?.ValueFrom?.trim() || value?.Valueto?.trim() || value?.PropertyNumberTo?.trim() || value?.CategoryID || value?.DispositionID || value?.SuspectedDrugTypeID || value?.EstimatedDrugQty?.trim() || value?.FractionDrugQty?.trim() || value?.ManufactureYearFrom || value?.isSelfAgency || value?.isAllAgencies
        ) {
            const {
                IncidentNumber, PropertyNumber, PropertyTypeID, LossCodeID, ReportedDtTm, ReportedDtTmTo, PropertyCategoryCode, LastName,
                FirstName, MiddleName, SecurityDtTm, RegistrationExpiryDtTm, RegistrationNumber, MaterialID, PropulusionID, Comments,
                SerialID, ModelID, TopColorID, BottomColorID, OAN, Quantity, QuantityUnitID, Brand, MeasurementTypeID, Denomination,
                IssuingAgency, MeasureTypeID, Style, Finish, Caliber, Handle, MakeID, WeaponModelID, IsAuto, BarrelLength, ManufactureYearTo,
                Length, HIN, VODID, RegistrationStateID, ClassificationID, Description, NICB, ValueFrom, Valueto, PropertyNumberTo, CategoryID,
                DispositionID, SuspectedDrugTypeID, EstimatedDrugQty, FractionDrugQty, ManufactureYearFrom, AgencyID,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, isSelfAgency, isAllAgencies
            } = myStateRef.current;
            const payload = {
                ...(isCAD
                    ? { CADIncidentNumber: IncidentNumber }
                    : { IncidentNumber: IncidentNumber }),
                'PropertyNumber': PropertyNumber, 'PropertyTypeID': PropertyTypeID, 'LossCodeID': LossCodeID,
                'ReportedDtTm': ReportedDtTm, 'ReportedDtTmTo': ReportedDtTmTo, 'PropertyCategoryCode': PropertyCategoryCode, 'LastName': LastName,
                'FirstName': FirstName, 'MiddleName': MiddleName, 'SecurityDtTm': SecurityDtTm, 'RegistrationExpiryDtTm': RegistrationExpiryDtTm,
                'RegistrationNumber': RegistrationNumber, 'MaterialID': MaterialID, 'PropulusionID': PropulusionID, 'Comments': Comments,
                'SerialID': SerialID, 'ModelID': ModelID, 'TopColorID': TopColorID, 'BottomColorID': BottomColorID, 'OAN': OAN, 'Quantity': Quantity,
                'QuantityUnitID': QuantityUnitID, 'Brand': Brand, 'MeasurementTypeID': MeasurementTypeID, 'Denomination': Denomination,
                'IssuingAgency': IssuingAgency, 'MeasureTypeID': MeasureTypeID, 'Style': Style, 'Finish': Finish, 'Caliber': Caliber, 'Handle': Handle,
                'MakeID': MakeID, 'WeaponModelID': WeaponModelID, 'IsAuto': IsAuto, 'BarrelLength': BarrelLength, 'ManufactureYearTo': ManufactureYearTo,
                'Length': Length, 'HIN': HIN, 'VODID': VODID, 'RegistrationStateID': RegistrationStateID, 'ClassificationID': ClassificationID,
                'Description': Description, 'NICB': NICB, 'ValueFrom': ValueFrom, 'Valueto': Valueto, 'PropertyNumberTo': PropertyNumberTo, 'CategoryID': CategoryID,
                'DispositionID': DispositionID, 'SuspectedDrugTypeID': SuspectedDrugTypeID, 'EstimatedDrugQty': EstimatedDrugQty, 'FractionDrugQty': FractionDrugQty,
                'ManufactureYearFrom': ManufactureYearFrom,
                'IPAddress': IPAddress, 'UserID': loginPinID, 'SearchCriteria': SearchCriteria, 'SearchCriteriaJson': SearchCriteriaJson,
                'ReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
                "AgencyID": loginAgencyID,
                "SearchFlag": isSelfAgency && !isAllAgencies ? 0 : isAllAgencies && !isSelfAgency ? 1 : isSelfAgency && isAllAgencies ? 2 : null,
            };

            const apiEndpoint = isCAD
                ? "/CAD/Property/Property_Search"
                : "Property/Search_Property";

            const res = await fetchPostData(apiEndpoint, payload);
            // const res = await fetchPostData("Property/Search_Property", payload);
            if (res.length > 0) {
                setPropertySearchData(res);
                if (isCAD) {
                    navigate('/cad/propertySearchList?page=Property-Search', { state: { searchState: value } });
                } else {
                    navigate('/property-search?page=Property-Search');

                    // Add to Recent Search
                    setRecentSearchData([...recentSearchData, { ...payload, "SearchModule": "Pro-Search" }]);
                }
                // navigate('/property-search?page=Property-Search')
                Reset();
            } else {
                setPropertySearchData([]);
                toastifyError("Data Not Available");
                setIsPermissionsLoaded(false);
            }
        } else {
            toastifyError("Please Enter Details");
        }
    };

    useEffect(() => {
        if (value.PropertyCategoryCode)
            ResetFields_On_Change(value.PropertyCategoryCode);
    }, [value.PropertyCategoryCode])

    const ResetFields_On_Change = (Code) => {
        //Boat 
        if (Code !== 'B') {
            setValue({
                ...value,
                'BoatIDNumber': '', 'ManufactureYearFrom': '', 'ManufactureYearTo': '', 'Length': '', 'RegistrationStateID': '', 'RegistrationNumber': '', 'VODID': null, 'MaterialID': null,
                'MakeID': '', 'ModelID': '', 'Comments': '', 'HIN': '', 'RegistrationExpiryDtTm': '', 'PropulusionID': '', 'BottomColorID': '', 'TopColorID': '',
            });
        }
        //Article
        if (Code !== 'A') {
            setValue({
                ...value,
                'SerialID': '', 'ModelID': '', 'TopColorID': '', 'BottomColorID': '', 'OAN': '', 'Quantity': '', 'Brand': '',
            })
        }
        //Other
        if (Code !== 'O') {
            setValue({
                ...value,
                'Brand': '', 'SerialID': '', 'OtherID': '', 'BottomColorID': '', 'ModelID': '', 'Quantity': '', 'QuantityUnitID': '',
            })
        }
        //Security
        if (Code !== 'S') {
            setValue({
                ...value,
                'SecurityIDNumber': '', 'Denomination': '', 'IssuingAgency': '', 'MeasureTypeID': null, 'SecurityDtTm': '', 'SerialID': '',
            })
        }
        //Weapon
        if (Code !== 'G') {
            setValue({
                ...value,
                'WeaponIDNumber': '', 'Style': '', 'Finish': '', 'Caliber': '', 'Handle': '', 'SerialID': '', 'MakeID': '', 'WeaponModelID': null, 'IsAuto': '', 'ManufactureYearFrom': '', 'ManufactureYearTo': '',
                'BarrelLength': '',
            })
        }
    }

    const Reset = () => {
        setIsPermissionsLoaded(false);
        setValue({
            ...value,
            'IncidentNumber': null, 'PropertyNumber': null, 'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': null, 'ReportedDtTmTo': null,
            'PropertyCategoryCode': null, 'LastName': null, 'FirstName': null, 'MiddleName': null, 'AgencyID': loginAgencyID,
            'SecurityDtTm': '', 'RegistrationExpiryDtTm': '', 'ClassificationID': null, 'Description': '', 'NICB': '', 'ValueFrom': '', 'Valueto': '', 'PropertyNumberTo': null, 'CategoryID': null,
            'SuspectedDrugTypeID': null, 'EstimatedDrugQty': '', 'FractionDrugQty': '', 'DispositionID': '', isAllAgencies: false,
            isSelfAgency: true
        })
    }

    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsAuto') {
            setValue({ ...value, [e.target.name]: e.target.checked })
        } else if (e.target.name === 'EstimatedDrugQty') {
            let ele = e.target.value.replace(/[^0-9.]/g, "")
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/[^0-9.]/g, '');
                setValue({ ...value, [e.target.name]: cleaned });
            } else {
                ele = e.target.value.split('$').join('').replace(/[^0-9.]/g, "");
                setValue({ ...value, [e.target.name]: ele });
            }
        } else if (e.target.name === 'Quantity' || e.target.name === 'Length' || e.target.name === 'FractionDrugQty' || e.target.name === 'MarijuanaNumber' || e.target.name === 'ClandistineLabsNumber') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: checkNumber });
        }
        else if (e.target.name === 'Value') {
            const ele = e.target.value.replace(/[^0-9]/g, "")
            if (ele.includes('.')) {
                if (ele.length === 16) {
                    setValue({ ...value, [e.target.name]: ele });
                } else {
                    if (ele.substr(ele.indexOf('.') + 1).slice(0, 2)) {
                        setValue({ ...value, [e.target.name]: ele.substring(0, ele.indexOf(".")) + '.' + ele.substr(ele.indexOf('.') + 1).slice(0, 2) });
                    } else { setValue({ ...value, [e.target.name]: ele }) }
                }
            } else { setValue({ ...value, [e.target.name]: ele }); }
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'SuspectedDrugTypeID') {
                setValue({
                    ...value,
                    [name]: e.value, 'SuspectedDrugType_Description': e.label, 'PropertySourceDrugTypeID': '', 'TypeMarijuana': '', 'MarijuanaNumber': '', '  ClandistineLabsNumber': '', 'DrugManufactured': '',
                });
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
                setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '', ['TopColorID']: '', ['BottomColorID']: '', ['Brand']: '', ['ModelID']: '' });
            } else if (name === 'CategoryID') {
                PropertyClassification(e.value);
                setValue({ ...value, [name]: e.value });
            }
            else { setValue({ ...value, [name]: e.value }); }
        } else {
            if (name === 'SuspectedDrugTypeID') {
                setValue({ ...value, [name]: null });
            } else if (name === 'PropertyTypeID') {
                setValue({
                    ...value,
                    ['PropertyTypeID']: null, ['PropertyCategoryCode']: '', ['CategoryID']: null, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '',
                });
                setPropertyCategoryData([]); setPropertyClassificationData([]);
                dispatch({ type: Property_LossCode_Drp_Data, payload: [] });
            } else if (name === 'CategoryID') {
                setValue({ ...value, ['CategoryID']: null, ['ClassificationID']: null, });
                setPropertyClassificationData([]);
            }
            else {
                setValue({ ...value, [name]: null });
            }
            void 0;
        }
    }
    const onClose = () => {
        if (isCAD) {
            navigate('/cad/dashboard-page');
        } else {
            navigate('/dashboard-page');
        }
        Reset();
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

    const PropertyCategory = (CategoryID) => {
        const val = { CategoryID: CategoryID, }
        fetchPostData('Property/GetDataDropDown_PropertyType', val).then((data) => {
            if (data) {
                setPropertyCategoryData(threeColArray(data, 'PropertyDescID', 'Description', 'CategoryID'))
            } else {
                setPropertyCategoryData([]);
            }
        })
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

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("I096", localStoreData?.AgencyID, localStoreData?.PINID));
                setIsPermissionsLoaded(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);


    useEffect(() => {

        if (isPermissionsLoaded) {
            getPropertySearch()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);


    useEffect(() => {
        myStateRef.current = value;
    }, [value])

    function formatRawInput(value) {
        // Remove non-digit characters
        const cleaned = value?.replace(/\D/g, '');

        // MMddyyyy handling
        if (cleaned?.length === 8) {
            const mm = cleaned?.slice(0, 2);
            const dd = cleaned?.slice(2, 4);
            const yyyy = cleaned?.slice(4, 8);
            return `${mm}/${dd}/${yyyy}`;
        }

        return value;
    }


    return (
        <div className=" section-body pt-3 p-1 bt" >
            <div className="div">
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={classNames("card Agency", { "incident-card": !isCAD })}>
                            {/* <div className="card Agency incident-card "> */}
                            <div className="card-body" >
                                <div className="btn-box text-right mr-1 mb-2">
                                    {
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { getPropertySearch(); }}>Search</button>
                                            : <></> :
                                            <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { getPropertySearch(); }}>Search</button>
                                    }
                                    <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { onClose(); }} >Close</button>
                                </div>
                                <div className="col-12 row my-2 ml-3">
                                    <div className="row align-items-center px-1 mt-2 mb-2">
                                        <div className="col-auto mt-1">
                                            <label className="new-label">Search with Agency</label>
                                        </div>
                                        <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                                            <input
                                                type="checkbox"
                                                id="isSelfAgency"
                                                name="isSelfAgency"
                                                checked={value.isSelfAgency}
                                                onChange={handlChange}
                                            />
                                            <label htmlFor="isSelfAgency" className="tab-form-label mb-0">
                                                Self Agency
                                            </label>
                                        </div>
                                        <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                                            <input
                                                type="checkbox"
                                                id="isAllAgencies"
                                                name="isAllAgencies"
                                                checked={value.isAllAgencies}
                                                onChange={handlChange}
                                            />
                                            <label htmlFor="isAllAgencies" className="tab-form-label mb-0">
                                                All Agencies
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="col-12 ">
                                        <fieldset>
                                            <legend>Property Information</legend>

                                            <div className="row">
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>{isCAD ? "CAD Event #" : "Incident #"}</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 text-field ">
                                                    <input type="text" id='IncidentNumber' name='IncidentNumber' className={''} value={value.IncidentNumber} onChange={handlChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Property No. From</label>
                                                </div>
                                                <div className={isCAD ? "col-4 col-md-4 col-lg-2 text-field" : "col-4 col-md-4 col-lg-2 text-field"}>
                                                    <input type="text" id='PropertyNumber' style={{ textTransform: "uppercase" }} maxLength={11} name='PropertyNumber' value={value.PropertyNumber} onChange={handlChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Property No. To</label>
                                                </div>
                                                <div className={isCAD ? "col-4 col-md-4 col-lg-2 text-field" : "col-4 col-md-4 col-lg-2 text-field"}>
                                                    <input type="text" id='PropertyNumberTo' disabled={!value?.PropertyNumber?.trim()}
                                                        className={!value?.PropertyNumber?.trim() ? 'readonlyColor' : ''} style={{ textTransform: "uppercase" }} maxLength={11} name='PropertyNumberTo' value={value.PropertyNumberTo} onChange={handlChange} />
                                                </div>

                                            </div>
                                            <div className="row">
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Type</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                    <Select
                                                        styles={colourStyles}
                                                        name='PropertyTypeID'
                                                        value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                        options={propertyTypeData}
                                                        onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                        isDisabled={sessionStorage.getItem('PropertyID') || sessionStorage.getItem('MasterPropertyID') ? true : false}
                                                    />

                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Property Loss Code</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                    <Select
                                                        name='LossCodeID'
                                                        styles={colourStyles}
                                                        value={propertyLossCodeDrpData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                        options={propertyLossCodeDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                        isClearable
                                                        isDisabled={!value?.PropertyTypeID}
                                                        placeholder="Select..."
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Category</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                    <Select
                                                        name='CategoryID'
                                                        id='CategoryID'
                                                        styles={customStylesWithOutColor}
                                                        value={propertyCategoryData?.filter((obj) => obj.value === value?.CategoryID)}
                                                        options={propertyCategoryData}
                                                        onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                        isDisabled={!value?.PropertyTypeID}
                                                        className={!value?.PropertyTypeID ? 'readonlyColor' : ''}
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Classification</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                    <Select
                                                        styles={customStylesWithOutColor}
                                                        name='ClassificationID'
                                                        value={propertyClassificationData?.filter((obj) => obj.value === value?.ClassificationID)}
                                                        options={propertyClassificationData}
                                                        onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                        isDisabled={!value?.CategoryID}
                                                        className={!value?.CategoryID ? 'readonlyColor' : ''}
                                                    />
                                                </div>

                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Reported From Date</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4 ">
                                                    <DatePicker
                                                        id='ReportedDtTm'
                                                        name='ReportedDtTm'
                                                        ref={startRef}
                                                        onKeyDown={onKeyDown}
                                                        className=''
                                                        onChange={(date) => {
                                                            if (date) {
                                                                setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null, ['ReportedDtTmTo']: '', })
                                                            }
                                                            else {
                                                                setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null, ['ReportedDtTmTo']: '', })
                                                            }
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        autoComplete='Off'
                                                        showYearDropdown
                                                        isClearable={value?.ReportedDtTm ? true : false}
                                                        selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        maxDate={new Date(datezone)}
                                                        placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Reported To Date</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4">
                                                    <DatePicker
                                                        id='ReportedDtTmTo'
                                                        name='ReportedDtTmTo'
                                                        ref={startRef1}
                                                        onKeyDown={onKeyDown}
                                                        onChange={(date) => { setValue({ ...value, ['ReportedDtTmTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                        dateFormat="MM/dd/yyyy"
                                                        timeInputLabel
                                                        dropdownMode="select"
                                                        showMonthDropdown
                                                        autoComplete='Off'
                                                        showYearDropdown
                                                        isClearable={value?.ReportedDtTmTo ? true : false}
                                                        selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        maxDate={new Date(datezone)}
                                                        minDate={new Date(value?.ReportedDtTm)}
                                                        placeholderText={'Select...'}
                                                        disabled={!value?.ReportedDtTm}
                                                        className={!value?.ReportedDtTm ? 'readonlyColor' : ''}
                                                    />
                                                </div>
                                                {/* <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Value From</label>
                                                </div>
                                                <div className="col-4 col-md-2 col-lg-2 text-field ">
                                                    <input type="text" id='ValueFrom' style={{ textTransform: "uppercase" }} maxLength={9} name='ValueFrom' value={`$ ${value?.ValueFrom}`} onChange={handlChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Value To</label>
                                                </div>
                                                <div className="col-4 col-md-2 col-lg-2 text-field ">
                                                    <input type="text" id='Valueto' disabled={!value?.ValueFrom?.trim()}
                                                        className={!value?.ValueFrom?.trim() ? 'readonlyColor' : ''} style={{ textTransform: "uppercase" }} maxLength={9} name='Valueto' value={`$ ${value?.Valueto}`} onChange={handlChange} />
                                                </div> */}

                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Value From</label>
                                                </div>
                                                <div className="col-4 col-md-2 col-lg-2 text-field ">
                                                    <input type="text" id='ValueFrom' style={{ textTransform: "uppercase" }} maxLength={9} name='ValueFrom' value={`$ ${value?.ValueFrom}`} onChange={handlChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Value To</label>
                                                </div>
                                                <div className="col-4 col-md-2 col-lg-2 text-field ">
                                                    <input type="text" id='Valueto' disabled={!value?.ValueFrom}
                                                        className={!value?.ValueFrom ? 'readonlyColor' : ''} style={{ textTransform: "uppercase" }} maxLength={9} name='Valueto' value={`$ ${value?.Valueto}`} onChange={handlChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>NICB ID</label>
                                                </div>
                                                <div className="col-4 col-md-2 col-lg-2 text-field ">
                                                    <input type='text' name='NICB' id='NICB' value={value?.NICB} onChange={handlChange} className='readonlyColor' readOnly />
                                                </div>
                                                <div className="col-3 col-md-2 col-lg-2 mt-2 ">
                                                    <label htmlFor="" className='new-label'>Description</label>
                                                </div>
                                                <div className="col-9 col-md-10 col-lg-10 mt-1 text-field">
                                                    <input type="text" name='Description' className='' value={value.Description} onChange={handlChange} />

                                                </div>
                                            </div>
                                        </fieldset>

                                        {/* ARTICLE   */}
                                        {
                                            value.PropertyCategoryCode === 'A' ?
                                                <div className="col-12 col-md-12 col-lg-12 mt-1 p-0" >
                                                    <fieldset>
                                                        <legend>Article</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Model Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'> Top Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='TopColorID'
                                                                    value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                                                                    options={topColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  px-0 mt-2 ">
                                                                <label htmlFor="" className='new-label'>Bottom&nbsp;Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-1">
                                                                <Select
                                                                    name='BottomColorID'
                                                                    value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                    options={bottomColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Brand</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1 text-field">
                                                                <input type="text" name='Brand' id='Brand' maxLength={20} value={value?.Brand} onChange={HandleChanges} className='' required />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Others */}
                                        {
                                            value.PropertyCategoryCode === 'O' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset>
                                                        <legend>Other</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Brand</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Top Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='TopColorID'
                                                                    value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                                                                    options={topColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1 px-0  mt-2">
                                                                <label htmlFor="" className='new-label'>Bottom Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='BottomColorID'
                                                                    value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                    options={bottomColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Model Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='ModelID' id='ModelID' value={value?.ModelID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Security */}
                                        {
                                            value.PropertyCategoryCode === 'S' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset>
                                                        <legend>Security</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Denomination</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='Denomination' maxLength={16} id='Denomination' value={value?.Denomination} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Security Date</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 ">
                                                                <DatePicker
                                                                    id='SecurityDtTm'
                                                                    name='SecurityDtTm'
                                                                    ref={startRef1}
                                                                    onKeyDown={onKeyDown}
                                                                    onChange={(date) => { setValue({ ...value, ['SecurityDtTm']: date ? getShowingWithOutTime(date) : null }) }}
                                                                    className=''
                                                                    dateFormat="MM/dd/yyyy"
                                                                    isClearable={value?.SecurityDtTm ? true : false}
                                                                    selected={value?.SecurityDtTm && new Date(value?.SecurityDtTm)}
                                                                    placeholderText={value?.SecurityDtTm ? value.SecurityDtTm : 'Select...'}
                                                                    timeIntervals={1}
                                                                    autoComplete="Off"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>

                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {/* Weapon */}
                                        {
                                            value.PropertyCategoryCode === 'G' ?
                                                <div className="col-12 col-md-12 col-lg-12 pt-2 p-0" >
                                                    <fieldset>
                                                        <legend>Weapon</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Serial Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Caliber</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='Caliber' maxLength={10} id='Caliber' value={value?.Caliber} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label htmlFor="" className='new-label'>Manu.Year From</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1">
                                                                <DatePicker
                                                                    name='ManufactureYearFrom'
                                                                    id='ManufactureYearFrom'
                                                                    selected={weaponfactureDate}
                                                                    onChange={(date) => {
                                                                        setWeaponfactureDate(date);
                                                                        setValue({ ...value, ['ManufactureYearFrom']: date ? getYearWithOutDateTime(date) : null });
                                                                        if (!date) {
                                                                            setWeaponfactureDateTo(null);
                                                                            setValue({ ...value, ['ManufactureYearTo']: null });
                                                                        }
                                                                    }}
                                                                    showYearPicker
                                                                    dateFormat="yyyy"
                                                                    yearItemNumber={8}
                                                                    ref={startRef4}
                                                                    onKeyDown={onKeyDown}
                                                                    autoComplete="nope"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                />
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label htmlFor="" className='new-label'>Manu.Year To</label>
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-1">
                                                                <DatePicker
                                                                    name='ManufactureYearTo'
                                                                    id='ManufactureYearTo'
                                                                    selected={weaponfactureDateto}
                                                                    onChange={(date) => {
                                                                        setWeaponfactureDateTo(date);
                                                                        setValue({
                                                                            ...value,
                                                                            ['ManufactureYearTo']: date ? getYearWithOutDateTime(date) : null
                                                                        });
                                                                    }}
                                                                    showYearPicker
                                                                    dateFormat="yyyy"
                                                                    yearItemNumber={8}
                                                                    ref={startRef4}
                                                                    onKeyDown={onKeyDown}
                                                                    autoComplete="nope"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                    disabled={!weaponfactureDate} // Disable if 'ManufactureYearFrom' has no value
                                                                    className={!weaponfactureDate ? 'readonlyColor' : ''}
                                                                />
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Make</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2   mt-1">
                                                                <Select
                                                                    name='MakeID'
                                                                    value={weaponMakeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={weaponMakeDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Model Id</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2   mt-1">
                                                                <Select
                                                                    name='WeaponModelID'
                                                                    styles={customStylesWithOutColor}
                                                                    value={weaponModelDrpData?.filter((obj) => obj.value === value?.WeaponModelID)}
                                                                    isClearable
                                                                    options={weaponModelDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'WeaponModelID')}
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-4 col-lg-3 mt-2">
                                                                <div className="form-check ">
                                                                    <input className="form-check-input" type="checkbox" name='auto' id="flexCheckDefault" checked={value?.IsAuto} />
                                                                    <label className="form-check-label" name='IsAuto' id='IsAuto' value={value?.IsAuto} onChange={HandleChanges} htmlFor="flexCheckDefault">
                                                                        Auto
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-1  mt-2 px-0">
                                                                <label htmlFor="" className='new-label px-0'>Length</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='BarrelLength' value={value?.BarrelLength} id='BarrelLength' maxLength={10} onChange={HandleChanges} className='' required />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                        {/* Boat */}
                                        {
                                            value.PropertyCategoryCode === 'B' ?
                                                <div className="col-12 col-md-12 col-lg-12 p-0" >
                                                    <fieldset>
                                                        <legend>Boat</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Reg. State</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1 ">
                                                                <Select
                                                                    name='RegistrationStateID'
                                                                    styles={colourStyles}
                                                                    value={stateDrpData?.filter((obj) => obj.value === value?.RegistrationStateID)}
                                                                    options={stateDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'RegistrationStateID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Reg. No</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                <input type="text" name='RegistrationNumber' id='RegistrationNumber' value={value?.RegistrationNumber} maxLength={10} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label htmlFor="" className="new-label">Manu. Year From</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1">
                                                                <DatePicker
                                                                    name="ManufactureYearFrom"
                                                                    id="ManufactureYearFrom"
                                                                    selected={manufactureDate}
                                                                    onChange={(date) => {
                                                                        setManufactureDate(date);
                                                                        setValue({
                                                                            ...value, ['ManufactureYearFrom']: date ? getYearWithOutDateTime(date) : null
                                                                        });
                                                                        if (!date) {
                                                                            setManufactureDateTo(null);
                                                                            setValue({ ...value, ['ManufactureYearFrom']: null, ['ManufactureYearTo']: null });
                                                                        }
                                                                    }}
                                                                    showYearPicker
                                                                    dateFormat="yyyy"
                                                                    yearItemNumber={8}
                                                                    ref={startRef2}
                                                                    onKeyDown={onKeyDown}
                                                                    autoComplete="nope"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                />
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                <label htmlFor="" className="new-label">Manu. Year To</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1">
                                                                <DatePicker
                                                                    name="ManufactureYearTo"
                                                                    id="ManufactureYearTo"
                                                                    selected={manufactureDateto}
                                                                    onChange={(date) => {
                                                                        setManufactureDateTo(date);
                                                                        setValue({
                                                                            ...value,
                                                                            ['ManufactureYearTo']: date ? getYearWithOutDateTime(date) : null
                                                                        });
                                                                    }}
                                                                    showYearPicker
                                                                    dateFormat="yyyy"
                                                                    yearItemNumber={8}
                                                                    ref={startRef2}
                                                                    onKeyDown={onKeyDown}
                                                                    autoComplete="nope"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    maxDate={new Date()}
                                                                    disabled={!value?.ManufactureYearFrom} // Disable when ManufactureYearFrom is not set
                                                                    className={!value?.ManufactureYearFrom ? 'readonlyColor' : ''} // Optional styling for disabled state
                                                                />
                                                            </div>

                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>HIN</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                <input type="text" name='HIN' value={value?.HIN} maxLength={20} onChange={HandleChanges} className='' required />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Make</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='MakeID'
                                                                    value={makeDrpData?.filter((obj) => obj.value === value?.MakeID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={makeDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'MakeID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Top Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='TopColorID'
                                                                    value={topColorDrpData?.filter((obj) => obj.value === value?.TopColorID)}
                                                                    options={topColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'TopColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    menuPlacement='top'
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1 px-0 mt-2">
                                                                <label htmlFor="" className='new-label'>Bottom Color</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='BottomColorID'
                                                                    value={bottomColorDrpData?.filter((obj) => obj.value === value?.BottomColorID)}
                                                                    options={bottomColorDrpData}
                                                                    styles={customStylesWithOutColor}
                                                                    onChange={(e) => ChangeDropDown(e, 'BottomColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    menuPlacement='top'
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                <label htmlFor="" className='new-label'>Propulsion</label>


                                                            </div >
                                                            <div className="col-3 col-md-3 col-lg-2  mt-1">
                                                                <Select
                                                                    name='PropulusionID'
                                                                    value={propulusionDrpData?.filter((obj) => obj.value === value?.PropulusionID)}
                                                                    styles={customStylesWithOutColor}
                                                                    options={propulusionDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'PropulusionID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    menuPlacement='top'
                                                                />
                                                            </div>
                                                        </div >
                                                    </fieldset >
                                                </div >
                                                :
                                                <>
                                                </>
                                        }
                                        {/* drug */}
                                        {
                                            value.PropertyCategoryCode === 'D' ?

                                                <div className="col-12 col-md-12 pt-2 p-0" >
                                                    <fieldset >
                                                        <legend>Drug</legend>
                                                        <div className="row">
                                                            <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                                <label className='new-label'>Suspected&nbsp;Drug&nbsp;Type</label>
                                                            </div>
                                                            <div className="col-3 col-md-3  col-lg-4 mt-1">
                                                                <Select
                                                                    name='SuspectedDrugTypeID'
                                                                    styles={colourStyles}
                                                                    value={suspectedDrugDrpData?.filter((obj) => obj.value === value?.SuspectedDrugTypeID)}
                                                                    isClearable
                                                                    options={suspectedDrugDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'SuspectedDrugTypeID')}
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                                <label className='new-label'>Measurement Type</label>
                                                            </div>
                                                            <div className="col-3 col-md-3  col-lg-4 mt-1">
                                                                <Select
                                                                    name='DispositionID'
                                                                    value={measureTypeDrpData?.filter((obj) => obj.value === value?.DispositionID)}
                                                                    styles={colourStyles}
                                                                    options={measureTypeDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'DispositionID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                                <label className='new-label'>Estimated Drug Qty</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4 mt-1 text-field">
                                                                <input type="text" maxLength={9} name='EstimatedDrugQty' id='EstimatedDrugQty' value={value?.EstimatedDrugQty} onChange={HandleChanges} className='' required autoComplete='off' />
                                                            </div>
                                                            <div className="col-3 col-md-3  col-lg-2 mt-2">
                                                                <label className='new-label'>Fraction Drug Qty</label>
                                                            </div>
                                                            <div className="col-3 col-md-3 col-lg-4 mt-1 text-field">
                                                                <input type="text" maxLength={9} name='FractionDrugQty' id='FractionDrugQty' value={value?.FractionDrugQty} onChange={HandleChanges} className='' required autoComplete='off' />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <>
                                                </>
                                        }
                                        <fieldset >
                                            <legend>Property Owner</legend>
                                            <div className="row">
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>Last Name</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field ">
                                                    <input type='text' name="LastName" id='LastName' value={value?.LastName} onChange={handlChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'>First Name</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field ">
                                                    <input type='text' name="FirstName" id="FirstName" value={value?.FirstName} onChange={handlChange} />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-1  mt-2 pt-2 px-0">
                                                    <label htmlFor="" className='new-label px-0'>Middle Name</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 text-field ">
                                                    <input type='text' name="MiddleName" id='MiddleName' value={value?.MiddleName} onChange={handlChange} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div >
                                </div >
                            </div >

                            {/* <div className="btn-box text-right mr-1 mb-2">
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { getPropertySearch(); }}>Search</button>
                                        : <></> :
                                        <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { getPropertySearch(); }}>Search</button>
                                }
                                <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { onClose(); }} >Close</button>
                            </div> */}
                            {/* <div className="btn-box text-right mr-1 mb-2">
                                <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { getPropertySearch(); }}>Search</button>
                                <button type='button' className='btn btn-sm btn-success mr-1' onClick={() => { onClose(); }} >Close</button>
                            </div> */}
                        </div >
                    </div >
                </div >
            </div >
        </div >
    )
}

export default PropertySearchPage