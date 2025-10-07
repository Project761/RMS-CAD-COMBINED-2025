import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, Encrypted_Id_Name, colourStyles, customStylesWithOutColor, getShowingDateText, getShowingMonthDateYear, getShowingWithFixedTime01, getShowingWithOutTime, getYearWithOutDateTime } from '../../../Common/Utility';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { fetchPostData } from '../../../hooks/Api';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comman_changeArrayFormat, threeColArray } from '../../../Common/ChangeArrayFormat';
import DataTable from 'react-data-table-component';
import { get_AgencyOfficer_Data, get_BoatModel_Drp_Data, get_Bottom_Color_Drp_Data, get_Make_Drp_Data, get_Material_Drp_Data, get_MeasureType_Drp_Data, get_PropertyLossCode_Drp_Data, get_PropertyTypeData, get_Propulusion_Drp_Data, get_State_Drp_Data, get_SuspectedDrug_Drp_Data, get_Top_Color_Drp_Data, get_VehicleLossCode_Drp_Data, get_VOD_Drp_Data, get_WeaponMake_Drp_Data, get_WeaponModel_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { Property_LossCode_Drp_Data } from '../../../../redux/actionTypes';
import { useReactToPrint } from 'react-to-print';
import Loader from '../../../Common/Loader';
import ReportAddress from '../../ReportAddress/ReportAddress';
import DOMPurify from 'dompurify';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';


const PropertyInventoryReport = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const propertyTypeData = useSelector((state) => state.DropDown.propertyTypeData);
    // const propertyLossCodeDrpData = useSelector((state) => state.DropDown.propertyLossCodeDrpData);
    const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = sessionStorage.getItem('IPAddress');

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

    const { GetDataTimeZone, datezone } = useContext(AgencyContext);
    const [weaponfactureDate, setWeaponfactureDate] = useState();
    const [weaponfactureDateto, setWeaponfactureDateTo] = useState();
    const [manufactureDate, setManufactureDate] = useState();
    const [manufactureDateto, setManufactureDateTo] = useState();


    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [propertyCategoryData, setPropertyCategoryData] = useState([]);
    const [propertyClassificationData, setPropertyClassificationData] = useState([]);
    const [editval, setEditval] = useState([]);
    const [verifyReport, setverifyReport] = useState(false);
    const [masterReportData, setMasterReportData] = useState([]);
    const [multiImage, setMultiImage] = useState([]);
    const [loder, setLoder] = useState(false);
    const [loginPinID, setloginPinID,] = useState('');
    const [LoginUserName, setLoginUserName] = useState('');
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);

    const [value, setValue] = useState({
        'IncidentNumber': '', 'IncidentNumberTo': '', 'PropertyNumber': '', 'PropertyNumberTo': '', 'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': '', 'ReportedDtTmTo': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'DateTimeIssued': '', 'DateTimeIssuedTo': '',
        'WarrantNumber': '', 'WarrantNumberTo': '', 'OfficerID': null,
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'AgencyID': loginAgencyID,
        // article
        'Brand': '', 'SerialID': '',
        // boat
        'RegistrationNumber': '', 'RegistrationStateID': '',
        // drug
        'SuspectedDrugTypeID': null, 'DispositionID': null, 'EstimatedDrugQty': null, 'FractionDrugQty': null,
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'FormatedReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
    });
    const [searchValue, setSearchValue] = useState({
        IncidentNumber: '', IncidentNumberTo: '', PropertyNumber: '', PropertyNumberTo: '', PropertyTypeID: null, LossCodeID: null, OfficerID: null, ReportedDtTm: '', ReportedDtTmTo: '', OccurredFrom: '', OccurredFromTo: '', DateTimeIssued: '', DateTimeIssuedTo: '', WarrantNumber: '', WarrantNumberTo: '', LastName: '', FirstName: '', MiddleName: '',

    });

    const [showFields, setShowFields] = useState({
        showIncidentNumber: false, showIncidentNumberTo: false, showPropertyNumber: false, showPropertyNumberTo: false, showPropertyTypeID: false, showLossCodeID: false, showOfficerID: false, showReportedDtTm: false, showReportedDtTmTo: false, showOccurredFrom: false, showOccurredFromTo: false, showDateTimeIssued: false, showDateTimeIssuedTo: false, showWarrantNumber: false, showWarrantNumberTo: false, showLastName: false, showFirstName: false, showMiddleName: false,
    });

    useEffect(() => {
        setShowFields({
            showIncidentNumber: searchValue.IncidentNumber,
            showIncidentNumberTo: searchValue.IncidentNumberTo,
            showPropertyNumber: searchValue.PropertyNumber,
            showPropertyNumberTo: searchValue.PropertyNumberTo,
            showPropertyTypeID: searchValue.PropertyTypeID !== null,
            showLossCodeID: searchValue.LossCodeID !== null,
            showOfficerID: searchValue.OfficerID !== null,
            showReportedDtTm: searchValue.ReportedDtTm,
            showReportedDtTmTo: searchValue.ReportedDtTmTo,
            showOccurredFrom: searchValue.OccurredFrom,
            showOccurredFromTo: searchValue.OccurredFromTo,
            showDateTimeIssued: searchValue.DateTimeIssued,
            showDateTimeIssuedTo: searchValue.DateTimeIssuedTo,
            showWarrantNumber: searchValue.WarrantNumber,
            showWarrantNumberTo: searchValue.WarrantNumberTo,
            showLastName: searchValue.LastName,
            showFirstName: searchValue.FirstName,
            showMiddleName: searchValue.MiddleName,
        });
    }, [searchValue]);
    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setloginPinID(parseInt(localStoreData?.PINID));
            setLoginUserName(localStoreData?.UserName)
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("P106", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);


    useEffect(() => {
        if (loginAgencyID) {
            dispatch(get_PropertyTypeData(loginAgencyID));
            dispatch(get_AgencyOfficer_Data(loginAgencyID, ''))
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
            if (propertyLossCodeData?.length === 0) { dispatch(get_VehicleLossCode_Drp_Data(loginAgencyID)) };

        }
    }, [loginAgencyID]);

    // const handlChange = (e) => {
    //     if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
    //         let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    //         if (ele.length === 10) {
    //             const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
    //             const match = cleaned.match(/^(\w{3})(\d{7})$/);
    //             if (match) {
    //                 setValue({
    //                     ...value,
    //                     [e.target.name]: match[1] + '-' + match[2]
    //                 })
    //             }
    //         } else {
    //             ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
    //             setValue({ ...value, [e.target.name]: ele })

    //             if (ele?.length == 0) { e.target.name == 'PropertyNumber' && setValue({ ...value, ['PropertyNumberTo']: "", [e.target.name]: ele }) }
    //         }
    //     } else if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
    //         let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
    //         if (ele.length === 8) {
    //             const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
    //             const match = cleaned.match(/^(\d{2})(\d{6})$/);
    //             if (match) {
    //                 setValue({
    //                     ...value,
    //                     [e.target.name]: match[1] + '-' + match[2]
    //                 })
    //             }
    //         } else {
    //             ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
    //             setValue({
    //                 ...value,
    //                 [e.target.name]: ele
    //             });

    //             if (ele?.length == 0) { e.target.name == 'IncidentNumber' && setValue({ ...value, ['IncidentNumberTo']: "", [e.target.name]: ele }) }
    //         }
    //     } else if (e.target.name === 'WarrantNumber' || e.target.name === 'WarrantNumberTo') {
    //         setValue({ ...value, [e.target.name]: e.target.value });

    //         if (e.target.value?.length == 0) { e.target.name == 'WarrantNumber' && setValue({ ...value, ['WarrantNumberTo']: "", [e.target.name]: e.target.value }) }
    //     } else {
    //         setValue({
    //             ...value,
    //             [e.target.name]: e.target.value
    //         })
    //     }
    // }
    const handlChange = (e) => {
        if (e.target.name === 'PropertyNumber' || e.target.name === 'PropertyNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'PropertyNumber' && setValue({
                    ...value, ['PropertyNumberTo']: "", [e.target.name]: ele
                });
            }
        }
        else if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'IncidentNumber' && setValue({
                    ...value, ['IncidentNumberTo']: "", [e.target.name]: ele
                });
            }
        }
        else if (e.target.name === 'WarrantNumber' || e.target.name === 'WarrantNumberTo') {
            const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Remove spaces
            setValue({ ...value, [e.target.name]: cleanedValue });

            if (cleanedValue.length === 0) {
                e.target.name === 'WarrantNumber' && setValue({ ...value, ['WarrantNumberTo']: "", [e.target.name]: cleanedValue });
            }
        }
        else if (e.target.name === 'LastName' || e.target.name === 'FirstName' || e.target.name === 'MiddleName') {
            const inputValue = e.target.value;
            const checkInput = inputValue.replace(/[^a-zA-Z0-9@#$%&*!.,\s]/g, "");
            const finalInput = inputValue.trim() === "" ? checkInput.replace(/\s/g, "") : checkInput;

            setValue({
                ...value,
                [e.target.name]: finalInput
            });
        }

        else {
            const cleanedValue = e.target.value.replace(/[^a-zA-Z0-9]/g, ''); // Remove spaces
            setValue({
                ...value,
                [e.target.name]: cleanedValue
            });
        }
    };

    const getPropertySearch = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDtTm?.trim()?.length > 0 || value?.PropertyNumber?.trim()?.length > 0 || value?.PropertyNumberTo?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ReportedDtTmTo?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.OccurredFromTo?.trim()?.length > 0 || value?.DateTimeIssued?.trim()?.length > 0 || value?.DateTimeIssuedTo?.trim()?.length > 0 || value?.WarrantNumber?.trim()?.length > 0 || value?.WarrantNumberTo?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || (value?.PropertyTypeID !== null && value?.PropertyTypeID != '') || value?.DispositionID || value?.SuspectedDrugTypeID || value?.EstimatedDrugQty?.trim() || value?.FractionDrugQty?.trim() || value?.Brand?.trim() || value?.SerialID?.trim() || value?.OfficerID || value?.LossCodeID) {
            const {
                ReportedDtTm, ReportedDtTmTo, CategoryID, PropertyNumber, PropertyNumberTo, PropertyTypeID, IncidentNumber, IncidentNumberTo, OccurredFrom, OccurredFromTo, DateTimeIssued, DateTimeIssuedTo, WarrantNumber, WarrantNumberTo, LastName, FirstName, MiddleName, DispositionID, SuspectedDrugTypeID, EstimatedDrugQty, FractionDrugQty, Brand, SerialID, OfficerID, LossCodeID,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
            } = myStateRef.current
            const val = {
                'ReportedDtTm': ReportedDtTm, 'ReportedDtTmTo': ReportedDtTmTo, 'CategoryID': CategoryID, 'PropertyNumber': PropertyNumber, 'PropertyNumberTo': PropertyNumberTo, 'PropertyTypeID': PropertyTypeID, 'AgencyID': loginAgencyID,
                'IncidentNumber': IncidentNumber,
                'IncidentNumberTo': IncidentNumberTo,
                'OccurredFrom': OccurredFrom,
                'OccurredFromTo': OccurredFromTo,
                'DateTimeIssued': DateTimeIssued, 'DateTimeIssuedTo': DateTimeIssuedTo, 'WarrantNumber': WarrantNumber,
                'WarrantNumberTo': WarrantNumberTo, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName,
                'DispositionID': DispositionID, 'SuspectedDrugTypeID': SuspectedDrugTypeID, 'EstimatedDrugQty': EstimatedDrugQty, 'FractionDrugQty': FractionDrugQty, 'Brand': Brand, 'SerialID': SerialID, 'OfficerID': OfficerID, 'LossCodeID': LossCodeID,
                IPAddress, UserID: loginPinID, SearchCriteria, SearchCriteriaJson, FormatedReportName: effectiveScreenPermission[0]?.ScreenCode1, Status, ModuleName: effectiveScreenPermission[0]?.ScreenCode1, ModuleID: effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'ReportProperty/PrintPropertyReport' : 'ReportProperty/GetData_ReportPropertyInventory';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    console.log(res)
                    setMasterReportData(res[0]);
                    setverifyReport(true);
                    getAgencyImg(loginAgencyID)
                    setLoder(false);
                    setSearchValue(value);

                }
                else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setverifyReport(false); setMasterReportData([]);
                        setLoder(false);
                    }

                }
                setIsPermissionsLoaded(false)
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setverifyReport(false);
                setLoder(false);
                setIsPermissionsLoaded(false)

            }

        } else {
            toastifyError("Please Enter Details");
            setLoder(false);
        }
    }
    // const getPropertySearch = () => {
    //     if (value?.ReportedDtTm?.trim()?.length > 0 || value?.PropertyNumber?.trim()?.length > 0 || value?.PropertyNumberTo?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ReportedDtTmTo?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.OccurredFromTo?.trim()?.length > 0 || value?.DateTimeIssued?.trim()?.length > 0 || value?.DateTimeIssuedTo?.trim()?.length > 0 || value?.WarrantNumber?.trim()?.length > 0 || value?.WarrantNumberTo?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || (value?.PropertyTypeID !== null && value?.PropertyTypeID != '')) {
    //         const {
    //             ReportedDtTm, ReportedDtTmTo, CategoryID, PropertyNumber, PropertyNumberTo, PropertyTypeID, IncidentNumber, IncidentNumberTo, OccurredFrom, OccurredFromTo, DateTimeIssued, DateTimeIssuedTo, WarrantNumber, WarrantNumberTo, LastName, FirstName, MiddleName

    //         } = value
    //         const val = {
    //             'ReportedDtTm': ReportedDtTm, 'ReportedDtTmTo': ReportedDtTmTo, 'CategoryID': CategoryID, 'PropertyNumber': PropertyNumber, 'PropertyNumberTo': PropertyNumberTo, 'PropertyTypeID': PropertyTypeID, 'AgencyID': loginAgencyID,
    //             'IncidentNumber': IncidentNumber,
    //             'IncidentNumberTo': IncidentNumberTo,
    //             'OccurredFrom': OccurredFrom,
    //             'OccurredFromTo': OccurredFromTo,
    //             'DateTimeIssued': DateTimeIssued, 'DateTimeIssuedTo': DateTimeIssuedTo, 'WarrantNumber': WarrantNumber,
    //             'WarrantNumberTo': WarrantNumberTo, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName,
    //         }
    //         fetchPostData('ReportProperty/GetData_ReportPropertyInventory', val).then((res) => {
    //             if (res.length > 0) {
    //                 console.log(res)
    //                 setMasterReportData(res[0]);
    //                 setverifyReport(true);
    //                 getAgencyImg(loginAgencyID)

    //             }
    //             else {
    //                 toastifyError("Data Not Available"); setverifyReport(false); setMasterReportData([]);
    //             }
    //         })
    //     } else {
    //         toastifyError("Please Enter Details");
    //     }
    // }

    const getAgencyImg = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                // console.log(res)
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);

            }
            else { console.log("errror") }
        })
    }

    useEffect(() => {
        if (value.PropertyCategoryCode) ResetFields_On_Change(value.PropertyCategoryCode);
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
                'OtherID': null, 'Brand': '', 'SerialID': '', 'BottomColorID': '', 'ModelID': '', 'Quantity': '', 'QuantityUnitID': '',
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
        setValue({
            ...value,
            'IncidentNumber': '', 'IncidentNumberTo': '', 'PropertyNumber': '', 'PropertyNumberTo': '', 'PropertyTypeID': null, 'LossCodeID': null, 'ReportedDtTm': '', 'ReportedDtTmTo': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'DateTimeIssued': '', 'DateTimeIssuedTo': '',
            'WarrantNumber': '', 'WarrantNumberTo': '',
            'LastName': '', 'FirstName': '', 'MiddleName': '',
            'Brand': '', 'SerialID': '',
            'RegistrationNumber': '', 'RegistrationStateID': '',
            'SuspectedDrugTypeID': '', 'DispositionID': '', 'EstimatedDrugQty': '', 'FractionDrugQty': '',
            'OfficerID': "",
        });
        setverifyReport(false); setMasterReportData([]); setShowWatermark('')
    }

    const HandleChanges = (e) => {
        if (e.target.name === 'IsEvidence' || e.target.name === 'IsSendToPropertyRoom' || e.target.name === 'IsPropertyRecovered' || e.target.name === 'IsAuto') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked
            })
        } else if (e.target.name === 'EstimatedDrugQty') {
            let ele = e.target.value.replace(/[^0-9.]/g, "")
            if (ele.length === 10) {
                const cleaned = ('' + ele).replace(/[^0-9.]/g, '');
                setValue({
                    ...value,
                    [e.target.name]: cleaned
                });
            } else {
                ele = e.target.value.split('$').join('').replace(/[^0-9.]/g, "");
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        } else if (e.target.name === 'Quantity' || e.target.name === 'Length' || e.target.name === 'FractionDrugQty' || e.target.name === 'MarijuanaNumber' || e.target.name === 'ClandistineLabsNumber') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({
                ...value,
                [e.target.name]: checkNumber
            });
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
            } else {
                setValue({
                    ...value,
                    [e.target.name]: ele
                });
            }
        }
        else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    // const ChangeDropDown = (e, name) => {
    //     if (e) {
    //         if (name === 'PropertyTypeID') {
    //             switch (e.id) {
    //                 case 'A': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', '')); break;
    //                 case 'B': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '1', '', '', '', '')); break;
    //                 case 'S': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '1', '', '', '')); break;
    //                 case 'O': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '1', '', '')); break;
    //                 case 'D': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '1', '')); break;
    //                 case 'G': dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '', '', '', '', '', '1')); break;
    //                 default: dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));
    //             }
    //             PropertyCategory(e.value);
    //             setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['LossCodeID']: '', });
    //         } else {
    //             setValue({ ...value, [name]: e.value });
    //         }

    //     }

    //     else {
    //         if (name === 'PropertyTypeID') {
    //             setValue({ ...value, ['PropertyCategoryCode']: '', ['PropertyTypeID']: '', ['LossCodeID']: '', });
    //             // dispatch({ type: Property_LossCode_Drp_Data, payload: [] });
    //             dispatch(get_PropertyLossCode_Drp_Data(loginAgencyID, '1', '', '', '', '', ''));
    //             // PropertyCategory(id[0]?.value);
    //             // PropertyCategory(CategoryID);
    //             // PropertyClassification(PropertyDescID);
    //             return;
    //         }
    //         setValue({ ...value, [name]: null });
    //     }
    // }

    const ChangeDropDown = (e, name) => {
        if (e) {
            //   setStatesChangeStatus(true)
            if (name === 'SuspectedDrugTypeID') {
                // setDrugTypecode(e.id)
                // setChangesStatus(true)
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
                // setChangesStatus(true);
                setValue({ ...value, ['PropertyCategoryCode']: e.id, ['PropertyTypeID']: e.value, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '', ['Brand']: '', ['SerialID']: '' });
                // setLossCode('');
                // setDrugLoder(true);
            } else if (name === 'CategoryID') {
                PropertyClassification(e.value);
                // setChangesStatus(true)
                setValue({ ...value, [name]: e.value });
            }
            //    else if (name === "PossessionOfID") {
            //     setPossessionID(e.value); setPossenSinglData([]); setValue({ ...value, [name]: e.value });
            //   }
            //    else if (name === "MeasurementTypeID") {
            //     setValue({ ...value, [name]: e.value, 'PropertyDrugMeasure_Description': e.label });
            //   }
            else {
                // setChangesStatus(true)
                setValue({ ...value, [name]: e.value });
            }
        } else {
            //   setStatesChangeStatus(true)
            if (name === 'SuspectedDrugTypeID') {
                // setChangesStatus(true)
                setValue({
                    ...value,
                    [name]: null
                });
                // setDrugTypecode('');
            } else if (name === 'PropertyTypeID') {
                // setChangesStatus(true);
                setValue({
                    ...value,
                    ['PropertyTypeID']: null, ['PropertyCategoryCode']: '', ['CategoryID']: null, ['ClassificationID']: null, ['LossCodeID']: null, ['Value']: '', ['Brand']: '', ['SerialID']: ''
                });
                setPropertyCategoryData([]); setPropertyClassificationData([]);
                dispatch({ type: Property_LossCode_Drp_Data, payload: [] });
            } else if (name === 'CategoryID') {
                // setChangesStatus(true);
                setValue({ ...value, ['CategoryID']: null, ['ClassificationID']: null, });
                setPropertyClassificationData([]);
            }
            //    else if (name === "PossessionOfID") {
            //     setPossessionID(''); setPossenSinglData([])
            //     setChangesStatus(true);
            //     setValue({ ...value, [name]: null });
            //   } 
            else {
                // setChangesStatus(true);
                setValue({ ...value, [name]: null });
            }
            void 0;
        }
    }

    const onClose = () => {
        navigate('/dashboard-page'); Reset();
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

    const componentRef = useRef();

    // const printForm = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: 'Data',
    //     onAfterPrint: () => { '' }
    // });
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoder(true);
        },
        onAfterPrint: () => {
            setLoder(false);
        }
    });


    const [showFooter, setShowFooter] = useState(false);

    const handlePrintClick = () => {
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getPropertySearch(true); setShowFooter(false);
        }, 100);
    };

    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === 'Enter') {
                await dispatch(get_ScreenPermissions_Data("P106", localStoreData?.AgencyID, localStoreData?.PINID));
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
        <>
            <div className=" section-body pt-3 p-1 bt" >
                <div className="div">
                    <div className="dark-row" >
                        <div className="col-12 col-sm-12">
                            <div className="card Agency  ">
                                <div className="card-body" >
                                    <div className="row ">
                                        <div className="col-12 ">
                                            <fieldset>
                                                <legend>Property Inventory Information</legend>
                                                <div className="form-check mr-2 col-9 col-md-9 col-lg-11 mt-1 pt-1 text-right">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="watermarkCheckbox"
                                                        checked={showWatermark}
                                                        onChange={(e) => setShowWatermark(e.target.checked)}
                                                    />
                                                    <label className="form-check-label" htmlFor="watermarkCheckbox">
                                                        Print Confidential Report
                                                    </label>
                                                </div>
                                                <div className="row align-items-center" style={{rowGap:"8px"}}>
                                                    <div className="col-2 col-md-2 col-lg-2">
                                                        <label htmlFor="" className='new-label mb-0'>Property # From</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 text-field mt-0 ">
                                                        <input type="text" id='PropertyNumber' style={{ textTransform: "uppercase" }} maxLength={11} name='PropertyNumber' value={value.PropertyNumber} onChange={handlChange}

                                                        />
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-3 ">
                                                        <label htmlFor="" className='new-label mb-0'>Property # To</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 text-field mt-0">
                                                        <input type="text" id='PropertyNumberTo' style={{ textTransform: "uppercase" }} maxLength={11} name='PropertyNumberTo' value={value.PropertyNumberTo} onChange={handlChange}
                                                            disabled={!value?.PropertyNumber?.trim()}
                                                            className={!value?.PropertyNumber?.trim() ? 'readonlyColor' : ''}
                                                        />
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-2">
                                                        <label htmlFor="" className='new-label mb-0'>Incident # From</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 text-field mt-0">
                                                        <input type="text" id='IncidentNumber' style={{ textTransform: "uppercase" }} name='IncidentNumber' value={value.IncidentNumber} onChange={handlChange} />
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-3 ">
                                                        <label htmlFor="" className='new-label mb-0'>Incident # To</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 text-field mt-0">
                                                        <input type="text" id='IncidentNumberTo' style={{ textTransform: "uppercase" }} name='IncidentNumberTo' value={value.IncidentNumberTo} onChange={handlChange}
                                                            disabled={!value?.IncidentNumber?.trim()}
                                                            className={!value?.IncidentNumber?.trim() ? 'readonlyColor' : ''}
                                                        />
                                                    </div>
                                                    {/* <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                        <label htmlFor="" className='new-label'>Warrant # From</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                                        <input type="text" id='WarrantNumber' style={{ textTransform: "uppercase" }} maxLength={10} name='WarrantNumber' value={value.WarrantNumber} onChange={handlChange} />
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-3  mt-2 ">
                                                        <label htmlFor="" className='new-label'>Warrant # To</label>
                                                    </div> */}
                                                    {/* <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                                        <input type="text" id='WarrantNumberTo' style={{ textTransform: "uppercase" }} maxLength={10} name='WarrantNumberTo' value={value.WarrantNumberTo} onChange={handlChange}
                                                            disabled={!value?.WarrantNumber?.trim()}
                                                            className={!value?.WarrantNumber?.trim() ? 'readonlyColor' : ''}
                                                        />
                                                    </div> */}
                                                    <div className="col-2 col-md-2 col-lg-2">
                                                        <label htmlFor="" className='new-label mb-0'>Reported From Date</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3">
                                                        <DatePicker
                                                            id='ReportedDtTm'
                                                            name='ReportedDtTm'
                                                            ref={startRef}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => {
                                                                if (date) {
                                                                    setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null })
                                                                } else {
                                                                    setValue({ ...value, ['ReportedDtTm']: date ? getShowingMonthDateYear(date) : null, ['ReportedDtTmTo']: null })
                                                                }
                                                            }}
                                                            className=''
                                                            onChangeRaw={(e) => {
                                                                const formatted = formatRawInput(e.target.value);
                                                                e.target.value = formatted;
                                                            }}
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            dropdownMode="select"
                                                            showMonthDropdown
                                                            autoComplete='Off'
                                                            showYearDropdown
                                                            isClearable={value?.ReportedDtTm ? true : false}
                                                            selected={value?.ReportedDtTm && new Date(value?.ReportedDtTm)}
                                                            maxDate={new Date(datezone)}
                                                            placeholderText={value?.ReportedDtTm ? value.ReportedDtTm : 'Select...'}
                                                        />
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-3">
                                                        <label htmlFor="" className='new-label mb-0'>Reported To Date</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3">
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
                                                            // disabled={value?.ReportedDtTm ? false : true}
                                                            isClearable={value?.ReportedDtTmTo ? true : false}
                                                            onChangeRaw={(e) => {
                                                                const formatted = formatRawInput(e.target.value);
                                                                e.target.value = formatted;
                                                            }}
                                                            selected={value?.ReportedDtTmTo && new Date(value?.ReportedDtTmTo)}
                                                            maxDate={new Date(datezone)}
                                                            minDate={new Date(value?.ReportedDtTm)}
                                                            placeholderText={'Select...'}
                                                            disabled={value?.ReportedDtTm ? false : true}
                                                            className={!value?.ReportedDtTm && 'readonlyColor'}
                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2">
                                                        <label htmlFor="" className='new-label mb-0'>Occurred From Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3">
                                                        <DatePicker
                                                            name='OccurredFrom'
                                                            id='OccurredFrom'
                                                            ref={startRef2}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => {
                                                                if (date) {
                                                                    setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null })
                                                                } else {
                                                                    setValue({ ...value, ['OccurredFrom']: null, ['OccurredFromTo']: null })
                                                                }
                                                            }}
                                                            selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                            onChangeRaw={(e) => {
                                                                const formatted = formatRawInput(e.target.value);
                                                                e.target.value = formatted;
                                                            }}
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            isClearable={value?.OccurredFrom ? true : false}
                                                            // peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete='Off'
                                                            // disabled
                                                            maxDate={new Date(datezone)}
                                                            placeholderText='Select...'
                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3">
                                                        <label htmlFor="" className='new-label mb-0'>Occurred To Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3">
                                                        <DatePicker
                                                            id='OccurredFromTo'
                                                            name='OccurredFromTo'
                                                            ref={startRef3}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['OccurredFromTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={value?.OccurredFromTo ? true : false}
                                                            // disabled={value?.OccurredFrom ? false : true}
                                                            selected={value?.OccurredFromTo && new Date(value?.OccurredFromTo)}
                                                            onChangeRaw={(e) => {
                                                                const formatted = formatRawInput(e.target.value);
                                                                e.target.value = formatted;
                                                            }}
                                                            minDate={new Date(value?.OccurredFrom)}
                                                            maxDate={new Date(datezone)}
                                                            placeholderText={'Select...'}
                                                            showDisabledMonthNavigation
                                                            autoComplete="off"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                            disabled={value?.OccurredFrom ? false : true}
                                                            className={!value?.OccurredFrom && 'readonlyColor'}
                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2">
                                                        <label htmlFor="" className='new-label mb-0'>Issued From Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3">
                                                        <DatePicker
                                                            name='DateTimeIssued'
                                                            id='DateTimeIssued'
                                                            ref={startRef2}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => {
                                                                if (date) {
                                                                    setValue({ ...value, ['DateTimeIssued']: date ? getShowingDateText(date) : null })
                                                                } else {
                                                                    setValue({ ...value, ['DateTimeIssued']: null, ['DateTimeIssuedTo']: null })
                                                                }
                                                            }}
                                                            selected={value?.DateTimeIssued && new Date(value?.DateTimeIssued)}
                                                            onChangeRaw={(e) => {
                                                                const formatted = formatRawInput(e.target.value);
                                                                e.target.value = formatted;
                                                            }}
                                                            dateFormat="MM/dd/yyyy"
                                                            timeInputLabel
                                                            isClearable={value?.DateTimeIssued ? true : false}
                                                            // peekNextMonth
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete='Off'
                                                            // disabled
                                                            maxDate={new Date(datezone)}
                                                            placeholderText='Select...'
                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3 ">
                                                        <label htmlFor="" className='new-label mb-0'>Issued To Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3">
                                                        <DatePicker
                                                            id='DateTimeIssuedTo'
                                                            name='DateTimeIssuedTo'
                                                            ref={startRef3}
                                                            onKeyDown={onKeyDown}
                                                            onChange={(date) => { setValue({ ...value, ['DateTimeIssuedTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={value?.DateTimeIssuedTo ? true : false}
                                                            // disabled={value?.DateTimeIssued ? false : true}
                                                            selected={value?.DateTimeIssuedTo && new Date(value?.DateTimeIssuedTo)}
                                                            onChangeRaw={(e) => {
                                                                const formatted = formatRawInput(e.target.value);
                                                                e.target.value = formatted;
                                                            }}
                                                            minDate={new Date(value?.DateTimeIssued)}
                                                            maxDate={new Date(datezone)}
                                                            placeholderText={'Select...'}
                                                            showDisabledMonthNavigation
                                                            autoComplete="off"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                            disabled={value?.DateTimeIssued ? false : true}
                                                            className={!value?.DateTimeIssued && 'readonlyColor'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row bt mt-1">
                                                    <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                        <label htmlFor="" className='new-label'>Type</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-2 ">
                                                        <Select
                                                            styles={colourStyles}
                                                            name='PropertyTypeID'
                                                            value={propertyTypeData?.filter((obj) => obj.value === value?.PropertyTypeID)}
                                                            options={propertyTypeData}
                                                            onChange={(e) => ChangeDropDown(e, 'PropertyTypeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                        // isDisabled={sessionStorage.getItem('PropertyID') || sessionStorage.getItem('MasterPropertyID') ? true : false}
                                                        />
                                                    </div>
                                                    <div className="col-2"></div>
                                                    <div className="col-6 col-md-6 col-lg-5 mt-3 mb-1">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                name="IsStolen"
                                                                // checked={value?.IsStolen || false}
                                                                // onChange={handleChange1}
                                                                id="flexCheckStolen"
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckStolen">
                                                                Property Destroyed
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                        <label htmlFor="" className='new-label'>Loss Code</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3 mt-1 ">
                                                        <Select
                                                            name='LossCodeID'
                                                            styles={customStylesWithOutColor}
                                                            value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
                                                            options={propertyLossCodeData}
                                                            onChange={(e) => ChangeDropDown(e, 'LossCodeID')}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                        <label htmlFor="" className='new-label'>Officer</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3 mt-1 ">
                                                        <Select
                                                            name='OfficerID'
                                                            value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                                                            isClearable
                                                            options={agencyOfficerDrpData}
                                                            styles={customStylesWithOutColor}
                                                            onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                            placeholder="Select..."
                                                        />
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
                                                                <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                    <label htmlFor="" className='new-label'>Serial #</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
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
                                                                <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                    <label htmlFor="" className='new-label'>Brand</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" name='Brand' id='Brand' value={value?.Brand} onChange={HandleChanges} className='' required />
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-1  mt-2">
                                                                    <label htmlFor="" className='new-label'>Serial #</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
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
                                                                    <label htmlFor="" className='new-label'>Serial #</label>
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
                                                                <div className="col-3 col-md-3 col-lg-2  mt-2">
                                                                    <label htmlFor="" className='new-label'>Serial #</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field  mt-1">
                                                                    <input type="text" name='SerialID' id='SerialID' value={value?.SerialID} onChange={HandleChanges} className='' required />
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
                                                                <div className="col-3 col-md-3 col-lg-2  mt-2 ">
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
                                                                    <label htmlFor="" className='new-label'>Reg. #</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" name='RegistrationNumber' id='RegistrationNumber' value={value?.RegistrationNumber} maxLength={10} onChange={HandleChanges} className='' required />
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
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
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 text-right mt-1 mb-2">
                                    {/* <button className="btn btn-sm bg-green text-white px-2 py-1"
                                        onClick={() => { getPropertySearch(); }}>Show Report</button> */}
                                    {
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getPropertySearch(false); }} >Show Report</button>
                                            : <></> :
                                            <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getPropertySearch(false); }} >Show Report</button>
                                    }
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { Reset(); }}>Clear</button>
                                    <Link to={'/Reports'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    verifyReport ?

                        masterReportData?.Property?.length > 0 ?
                            <>
                                <div className="col-12 col-md-12 col-lg-12 pt-2  px-2">
                                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                                        <p className="p-0 m-0 d-flex align-items-center">Property Inventory Report</p>
                                        <div style={{ marginLeft: 'auto' }}>
                                            <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                                {/* <i className="fa fa-print"></i> */}
                                                <i className="fa fa-print" onClick={handlePrintClick}></i>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                                <div className="container mt-1"  >
                                    <div className="col-12" >
                                        <div className="row" ref={componentRef} style={{ border: '1px solid #80808085', pageBreakAfter: 'always' }}>
                                            <>
                                                <ReportAddress {...{ multiImage, masterReportData }} />
                                                {showWatermark && (
                                                    <div className="watermark-print">Confidential</div>
                                                )}
                                                {/* <div className="col-4 col-md-3 col-lg-2 pt-1 ml-3">
                                                    <div className="main">
                                                        <div className="img-box" >
                                                            <img src={multiImage} className='' style={{ marginTop: '4px', width: '150px', height: '150px' }} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-7 col-md-7 col-lg-9 mt-2">
                                                    <div className="main">
                                                        <h5 className='text-dark font-weight-bold'>{masterReportData?.Agency_Name}</h5>
                                                        <p className='text-p'>Address: <span className='text-address'>{masterReportData?.Agency_Address1}</span></p>
                                                        <div className='d-flex justify-content-start flex-wrap'>
                                                            <p className='text-p'>City: <span className='text-gray ml-2'>{masterReportData?.CityName}</span></p>
                                                            <p className='text-p mb-1 ml-3'>State: <span className='text-gray'>{masterReportData?.StateName}</span></p>
                                                            <p className='text-p mb-1 ml-3'>Zip: <span className='text-gray'>{masterReportData?.Zipcode}</span></p>
                                                        </div>
                                                        <div className='d-flex justify-content-start flex-wrap'>
                                                            <p className='text-p mb-1'>Phone: <span className='text-gray ml-1'>{masterReportData?.Agency_Phone}</span></p>
                                                            <p className='text-p mb-1 ml-4'>Fax: <span className='text-gray'>{masterReportData?.Agency_Fax}</span></p>
                                                        </div>
                                                    </div>
                                                </div> */}

                                            </>
                                            <div className="col-12">
                                                <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                <h5 className=" text-white text-bold bg-green py-1 px-3 text-center">Property Inventory Report</h5>
                                            </div>
                                            <div className="col-12">

                                                <fieldset>
                                                    <legend>Search Criteria</legend>

                                                    <div className="row">
                                                        {showFields.showIncidentNumber && searchValue.IncidentNumber && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Incident No.From</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.IncidentNumber || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                        {showFields.showIncidentNumberTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Incident No.To</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.IncidentNumberTo || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showPropertyNumber && searchValue.PropertyNumber && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Property No.From</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.PropertyNumber || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                        {showFields.showPropertyNumberTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Property No.To</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.PropertyNumberTo || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showPropertyTypeID && searchValue.PropertyTypeID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Property Type</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={propertyTypeData.find((obj) => obj.value === searchValue.PropertyTypeID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showLossCodeID && searchValue.LossCodeID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Loss Code</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={propertyLossCodeData.find((obj) => obj.value === searchValue.LossCodeID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showOfficerID && searchValue.OfficerID && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Officer Name</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={agencyOfficerDrpData.find((obj) => obj.value === searchValue.OfficerID)?.label || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showReportedDtTm && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Reported From Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.ReportedDtTm && getShowingWithOutTime(searchValue.ReportedDtTm)} readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                        {showFields.showReportedDtTmTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Reported to Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.ReportedDtTmTo && getShowingWithOutTime(searchValue.ReportedDtTmTo)} readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                        {showFields.showOccurredFrom && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Occurred From Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor'
                                                                        value={searchValue.OccurredFrom && getShowingWithOutTime(searchValue.OccurredFrom)}

                                                                        readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showOccurredFromTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Occurred To Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor'
                                                                        value={searchValue.OccurredFromTo && getShowingWithOutTime(searchValue.OccurredFromTo)}

                                                                        readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showDateTimeIssued && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Issued From Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor'
                                                                        value={searchValue.DateTimeIssued && getShowingWithOutTime(searchValue.DateTimeIssued)}

                                                                        readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showDateTimeIssuedTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Issued To Date</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor'
                                                                        value={searchValue.DateTimeIssuedTo && getShowingWithOutTime(searchValue.DateTimeIssuedTo)}

                                                                        readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                        {showFields.showWarrantNumber && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Warrant From Number</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.WarrantNumber || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}

                                                        {showFields.showWarrantNumberTo && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Warrant To Number</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.WarrantNumberTo || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}


                                                        {showFields.showLastName && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Last Name</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.LastName || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showFirstName && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>First Name</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.FirstName || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}
                                                        {showFields.showMiddleName && (
                                                            <>
                                                                <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                                    <label className='new-label'>Middle Name</label>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-2 text-field mt-1">
                                                                    <input type="text" className='readonlyColor' value={searchValue.MiddleName || ''} readOnly />
                                                                </div>
                                                            </>
                                                        )}



                                                    </div>
                                                </fieldset>
                                            </div>
                                            {
                                                masterReportData?.Property?.length > 0 ?
                                                    <>
                                                        {
                                                            masterReportData?.Property?.map((obj) => (
                                                                <>
                                                                    <div className="col-12">
                                                                        <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                                                    </div>
                                                                    <div className="col-12  mt-2" >
                                                                        <div className="container" style={{ pageBreakAfter: 'always' }}>
                                                                            <h5 className=" text-white text-bold bg-green py-1 px-3"> Property Number:- {obj.PropertyNumber}</h5>

                                                                            <div className="row px-3" >
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.PropertyNumber}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Property Number</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.IncidentNumber}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Incident Number</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.ReportedDtTm ? getShowingDateText(obj.ReportedDtTm) : ''}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Reported Date/Time</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.OwnerName}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Owner Name</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.Category_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Category</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.Classification_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Classification</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={obj.LossCode_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Loss Code</label>
                                                                                    </div>
                                                                                </div>



                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                    {/* article */}
                                                                    <div className="col-12  " style={{ border: '1px solid #80808085', }}>
                                                                        {
                                                                            JSON.parse(obj?.Article)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Article Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Article)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 ">
                                                                                                        <div className="col-12 mb-2" style={{ borderRight: '1px solid gray' }}>
                                                                                                            <div className="row ">
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                                            value={item.Brand}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Brand</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.ModelID}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Model ID</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SerialID}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Serial ID </label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.TopColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.BottomColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Quantity}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Quantity</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.OAN}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>OAN</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* Boat */}
                                                                    <div className="col-12  bb" >
                                                                        {
                                                                            JSON.parse(obj?.Boat)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Boat Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Boat)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Registration_StateName}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Registration State</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.RegistrationNumber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Registration Number</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Make_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Make</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Model_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Model</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.HIN}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>HIN</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.VOD_Desc}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>VOD</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Propulusion_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Propulation</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.TopColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.BottomColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Length}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>OAN No.</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item?.RegistrationExpiryDtTm ? getShowingDateText(item?.RegistrationExpiryDtTm) : null}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Registration Expiry</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 ">
                                                                                                                    {/* <div className="text-field">
                                                                                                                        <textarea type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item?.Comments}
                                                                                                                            style={{ resize: 'none' }} />
                                                                                                                        <label htmlFor="" className='new-summary'>Comments</label>
                                                                                                                    </div> */}
                                                                                                                    <label htmlFor="" className='new-summary'>Comments</label>

                                                                                                                    <div
                                                                                                                        className="readonlyColor  "
                                                                                                                        style={{
                                                                                                                            border: '1px solid #ccc',
                                                                                                                            borderRadius: '4px',
                                                                                                                            padding: '10px',
                                                                                                                            backgroundColor: '#f9f9f9',
                                                                                                                            lineBreak: 'anywhere'
                                                                                                                        }}
                                                                                                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item?.Comments) }}

                                                                                                                    />
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* Drug */}
                                                                    <div className="col-12  bb">
                                                                        {
                                                                            JSON.parse(obj?.Drug)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Drug Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Drug)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SuspectedDrugType_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'> Drug Type</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.MeasurementUnit_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Measurement Unit </label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.MeasurementType_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Measurement type</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.EstimatedDrugQty}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Estimate Drug Qty</label>

                                                                                                                    </div>
                                                                                                                </div>





                                                                                                                {/* <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.MeasurementType_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Measurement Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SolidPounds}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Solid Pounds</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SolidOunces}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Solid Ounces</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SolidGrams}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Solid Grams</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.LiquidOunces}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Liquid Ounces</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.DoseUnits}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Dose Units</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item?.Items}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Items</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item?.MarijuanaType_Desc}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Type Marijuana Fields and Gardens</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item?.NumLabs}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Number Of Clandestine Labs Seized</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item?.NumFields}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Number Marijuana Fields and Gardens</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item?.MarijuanaType_Desc1}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Type of Drug Manufactured</label>

                                                                                                                    </div>
                                                                                                                </div> */}

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* Other */}
                                                                    <div className="col-12  bb" >
                                                                        {
                                                                            JSON.parse(obj?.Other)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Other Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Other)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Brand}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Brand</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SerialID}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Serial ID</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.TopColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Top Color</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.BottomColor_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Bottom Color</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.ModelID}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Model ID</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Quantity}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Quantity</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.QuantityUnit}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Quantity Unit</label>

                                                                                                                    </div>
                                                                                                                </div>


                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* Security */}
                                                                    <div className="col-12  bb" >
                                                                        {
                                                                            JSON.parse(obj?.Security)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Security Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.Security)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Denomination}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Denomination</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.IssuingAgency}
                                                                                                                        />

                                                                                                                        <label htmlFor="" className='new-summary'>Issuing Agency</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.MeasureType}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Measure Type</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SecurityDtTm ? getShowingDateText(item.SecurityDtTm) : ''}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Security Date</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.SerialID}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Serial ID</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* Weapon */}
                                                                    <div className="col-12  bb" >
                                                                        {
                                                                            JSON.parse(obj?.weapon)?.length > 0 ?
                                                                                <>
                                                                                    <div className="container bb">
                                                                                        <h6 className=' text-dark mt-2'>Weapon Information</h6>
                                                                                        <div className="col-12 ">
                                                                                            {
                                                                                                JSON.parse(obj?.weapon)?.map((item, key) => (
                                                                                                    <div className="row bb px-3 ">
                                                                                                        <div className="col-12 mb-2" >
                                                                                                            <div className="row ">
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Style}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Style</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Finish}
                                                                                                                        />

                                                                                                                        <label htmlFor="" className='new-summary'>Finish</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Caliber}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Caliber</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.Handle}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Handle</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.WeaponMake_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Weapon Make</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.PropertyModel_Description}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Weapon Model</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.ManufactureYear}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Manufacture Year</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-4 mt-2 pt-1 ">
                                                                                                                    <div className="text-field">
                                                                                                                        <input type="text" className='readonlyColor' name='OfficerName' required readOnly
                                                                                                                            value={item.BarrelLength}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary'>Barrel Length</label>

                                                                                                                    </div>
                                                                                                                </div>
                                                                                                                <div className="col-6 col-md-6 col-lg-3 mt-4 ">
                                                                                                                    <div className=''>
                                                                                                                        <input
                                                                                                                            type="checkbox"
                                                                                                                            name=""
                                                                                                                            id=""
                                                                                                                            checked={item && Object.keys(obj).length > 0 ? item.IsAuto : false}
                                                                                                                            disabled={!item || Object.keys(item).length === 0}
                                                                                                                        />
                                                                                                                        <label htmlFor="" className='new-summary pl-2'>Is Auto</label>

                                                                                                                    </div>
                                                                                                                </div>

                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ))
                                                                                            }
                                                                                        </div>

                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <></>
                                                                        }
                                                                    </div >
                                                                    {/* <div className="container-fluid" style={{ pageBreakAfter: 'always' }}>
                                                                        <h5 className=" text-white text-bold bg-green text-center py-1 px-3">Property Information:{obj?.PropertyNumber}</h5>
                                                                        <div className="table-responsive" >
                                                                            <table className="table table-bordered" >
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td colSpan={4}>
                                                                                            <h6 className='text-dark text-bold'>Property Number:</h6>
                                                                                            <p className='text-list'>{obj?.PropertyNumber}</p>
                                                                                        </td>
                                                                                        <td colSpan={4}>
                                                                                            <h6 className='text-dark text-bold'>Incident Number</h6>
                                                                                            <p className='text-list'>{obj?.IncidentNumber}</p>
                                                                                        </td>
                                                                                        <td colSpan={4}>
                                                                                            <h6 className='text-dark text-bold'>Reported Date/Time:</h6>
                                                                                            <p className='text-list'>{obj?.ReportedDtTm ? getShowingDateText(obj?.ReportedDtTm) : null}</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    {obj.
                                                                                        OtherPropertyType === "Article" && (
                                                                                            <>
                                                                                                <tr>
                                                                                                    <td colSpan={4}>
                                                                                                        <h6 className='text-dark text-bold'>Serial No:</h6>
                                                                                                        <p className='text-list'>{obj?.SerialID}</p>
                                                                                                    </td>
                                                                                                    <td colSpan={4}>
                                                                                                        <h6 className='text-dark text-bold'>Model:</h6>
                                                                                                        <p className='text-list'>{obj?.ModelID}</p>
                                                                                                    </td>

                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td colSpan={4}>
                                                                                                        <h6 className='text-dark text-bold'>Quantity:</h6>
                                                                                                        <p className='text-list'>{obj?.Quantity}</p>
                                                                                                    </td>
                                                                                                    <td colSpan={4}>
                                                                                                        <h6 className='text-dark text-bold'>Brand:</h6>
                                                                                                        <p className='text-list'>{obj?.Brand}</p>
                                                                                                    </td>

                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td colSpan={6}>
                                                                                                        <h6 className='text-dark text-bold'>Top Color:</h6>
                                                                                                        <p className='text-list'>{obj?.ArticleTopColor}</p>
                                                                                                    </td>
                                                                                                    <td colSpan={6}>
                                                                                                        <h6 className='text-dark text-bold'>Bottom Color</h6>
                                                                                                        <p className='text-list'>{obj?.ArticleBottomColor}</p>
                                                                                                    </td>
                                                                                                </tr>

                                                                                            </>
                                                                                        )}
                                                                                    <tr>
                                                                                        <td colSpan={4}>
                                                                                            <h6 className='text-dark text-bold'>Category:</h6>
                                                                                            <p className='text-list'>{obj?.Category_Description}</p>
                                                                                        </td>
                                                                                        <td colSpan={4}>
                                                                                            <h6 className='text-dark text-bold'>Classification:</h6>
                                                                                            <p className='text-list'>{obj?.Classification_Description}</p>
                                                                                        </td>
                                                                                        <td colSpan={4}>
                                                                                            <h6 className='text-dark text-bold'>Loss Code:</h6>
                                                                                            <p className='text-list'>{obj?.LossCode_Description}</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        {
                                                                            JSON.parse(obj?.PropertyRoom)?.length > 0 ?
                                                                                <>
                                                                                    <div className="table-responsive" >
                                                                                        <div className="text-white text-bold bg-green py-1 px-2  d-flex justify-content-between align-items-center">
                                                                                            <p className="p-0 m-0 d-flex align-items-center">Storage Location Information:</p>
                                                                                        </div>

                                                                                        <table className="table " >
                                                                                            <thead className='text-dark master-table'>
                                                                                                <tr>
                                                                                                    <th className='' style={{ width: '100px' }}>Property Number</th>
                                                                                                    <th className='' style={{ width: '120px' }}>Activity Date/Time</th>
                                                                                                    <th className='' style={{ width: '100px' }}>Activity Type</th>
                                                                                                    <th className='' style={{ width: '100px' }}>Officer</th>
                                                                                                    <th className='' style={{ width: '100px' }}>Property Room Person</th>
                                                                                                    <th className='' style={{ width: '100px' }}>Location</th>
                                                                                                    <th className='' style={{ width: '100px' }}>Activity Reason</th>
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody >
                                                                                                {
                                                                                                    JSON.parse(obj?.PropertyRoom)?.map((item, key) => (
                                                                                                        <>
                                                                                                            <tr key={key} >
                                                                                                                <td className='text-list' style={{ width: '100px' }}>{item.PropertyNumber}</td>
                                                                                                                <td className='text-list' style={{ width: '120px' }}>{item?.ReceiveDate ? getShowingDateText(item?.ReceiveDate) : null}</td>
                                                                                                                <td className='text-list' style={{ width: '100px' }}>{item.ActivityType}</td>
                                                                                                                <td className='text-list' style={{ width: '100px' }}>{item.Officer_Name}</td>
                                                                                                                <td className='text-list' style={{ width: '100px' }}>{item.RoomPerson}</td>
                                                                                                                <td className='text-list' style={{ width: '100px' }}>{item.location}</td>
                                                                                                                <td className='text-list' style={{ width: '100px' }}>{item.ActivityReason}</td>


                                                                                                            </tr>
                                                                                                        </>
                                                                                                    ))
                                                                                                }
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                </>
                                                                        }

                                                                    </div> */}
                                                                </>
                                                            ))
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                    </>
                                            }
                                            {showFooter && (
                                                <div className="print-footer">
                                                    <p> Officer Name: {LoginUserName || ''} | Date/Time: {getShowingWithFixedTime01(datezone || '')} | IP Address: {ipAddress || ''}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </>
                            :
                            <>
                            </>
                        :
                        <>
                        </>
                }
            </div >
            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )
            }
        </>

    )
}

export default PropertyInventoryReport