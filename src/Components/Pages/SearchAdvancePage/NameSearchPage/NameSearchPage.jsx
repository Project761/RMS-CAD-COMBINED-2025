import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Aes256Encrypt, colourStyles, Decrypt_Id_Name, filterPassedDateTime, filterPassedTime, getShowingDateText, getShowingMonthDateYear } from '../../../Common/Utility';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { fetchPostData } from '../../../hooks/Api';
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name, fourColArray, threeColArray, threeColArrayWithCode } from '../../../Common/ChangeArrayFormat';
import { toastifyError } from '../../../Common/AlertMsg';
import { Comparision } from '../../PersonnelCom/Validation/PersonnelValidation';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import { get_Eye_Color_Drp_Data, get_Hair_Color_Drp_Data, get_NIBRS_Drp_Data } from '../../../../redux/actions/DropDownsData';
import SelectBox from '../../../Common/SelectBox';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';
import { colorLessStyle_Select } from '../../../../CADComponents/Utility/CustomStylesForReact';
import { components } from "react-select";
import { useQuery } from 'react-query';
import Location from '../../../Location/Location';
const os = require('os');

const MultiValue = props => (
    <components.MultiValue {...props}>
        <span>{props.data.label}</span>
    </components.MultiValue>
);

const NameSearchPage = ({ isCAD = false, setSelectSearchRecord = () => { } }) => {

    const [ageUnitDrpData, setAgeUnitDrpData] = useState([]);
    const [nameTypeCode, setNameTypeCode] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [multiSelectedReason, setMultiSelectedReason] = useState({
        optionSelected: null
    })

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let openPageName = query?.get('page');

    const { setnameSearch, setChangesStatus, recentSearchData, setRecentSearchData, } = useContext(AgencyContext);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const eyeColorDrpData = useSelector((state) => state.DropDown.eyeColorDrpData);
    const hairColorDrpData = useSelector((state) => state.DropDown.hairColorDrpData);
    const nameTypeData = useSelector((state) => state.Agency.nameTypeData);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const screenCode1 = effectiveScreenPermission[0]?.ScreenCode1;

    const [ComplexionColoIDDrp, setComplexionColoIDDrp] = useState([]);

    const [nameTypeIdDrp, setNameTypeIdDrp] = useState([]);
    const [suffixIdDrp, setSuffixIdDrp] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);
    const [smtLocation, setSmtLocation] = useState([]);
    const [smtType, setSmtType] = useState([]);
    const [reasonIdDrp, setReasonIdDrp] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [masterNameID, setMasterNameID] = useState();
    const [nameID, setNameID] = useState();
    const [businessTypeDrp, setBusinessTypeDrp] = useState([]);
    const [phoneTypeIdDrp, setPhoneTypeIdDrp] = useState([]);
    const [globalname, setglobalname] = useState('')
    const [globalnameto, setglobalnameto] = useState('')
    const [loginPinID, setLoginPINID] = useState('');
    const [refineSearchData, setRefineSearchData] = useState(null);
    const [victimTypeDrp, setVictimTypeDrp] = useState([]);

    const [locationStatus, setLocationStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0);
    const [onSelectLocation, setOnSelectLocation] = useState(false);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [isPermissionsLoaded, setIsPermissionsLoaded] = useState(false);


    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    //NIBRS Code
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    // Offense Code/Name
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(nibrsCodeDrp);

    const [value, setValue] = useState({
        'NameIDNumber': '', 'NameIDNumberTo': '', 'NameTypeID': '', 'NameReasonCodeID': '', 'LastName': '', 'MiddleName': '', 'FirstName': '',
        'SuffixID': '', 'DateOfBirthFrom': '', 'DateOfBirthTo': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '', 'HairColorID': '', 'LawTitleId': '',
        'EyeColorID': '', 'WeightFrom': '', 'WeightTo': '', 'SMTTypeID': '', 'SMTLocationID': '', 'SSN': '', 'SMT_Description': '',
        'IncidentNumber': '', 'IncidentNumberTo': '', 'ReportedDate': '', 'ReportedDateTo': '', 'DateOfBirth': '',
        'HeightFrom': '', 'HeightTo': '', 'AgencyID': '', 'DLNumber': '', 'BusinessTypeID': "", 'PhoneTypeID': '', 'Contact': '', 'FaxNumber': '',
        'RMSCFSCodeID': '', 'FBIID': '', 'CrimeLocation': '', 'OccurredFrom': '', 'OccurredFromTo': '', 'AgeFrom': '', 'AgeTo': '', 'AgeUnitID': '', 'Local': '', 'SBI': '', 'FBI': '', 'TAX': '', 'SPN': '', 'Jacket': '', 'OCN': '', 'State': '', 'ComplexionID': '',
        'IPAddress': '', 'UserID': loginPinID, 'SearchCriteria': '', 'SearchCriteriaJson': '', 'ReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK, CADEventFrom: '', CADEventTo: ''

    });

    const [multiSelected, setMultiSelected] = useState({
        optionSelected: null
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPINID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("N102", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            if (hairColorDrpData?.length === 0) dispatch(get_Hair_Color_Drp_Data(loginAgencyID))
            if (eyeColorDrpData?.length === 0) dispatch(get_Eye_Color_Drp_Data(loginAgencyID))
            if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(loginAgencyID)); }
            GetNameTypeIdDrp(loginAgencyID); GetSuffixIDDrp(loginAgencyID); GetSexIDDrp(loginAgencyID); GetRaceIdDrp(loginAgencyID); getEthinicityDrp(loginAgencyID); get_SMTTypeID(loginAgencyID);
            get_Name_Drp_Data(loginAgencyID)
            get_Appearance_Drp_Data(loginAgencyID);
            console.log(value.NameTypeID)
            // get_Victim_Type_Data(loginAgencyID , value.NameTypeID);
        }
    }, [loginAgencyID]);

    useEffect(() => {
        if (loginAgencyID) {
            // lawtitle dpr
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            // FBIID
            NIBRSCodeDrpDwnVal(loginAgencyID, 0);
            // charge / offence codeName
            getRMSCFSCodeListDrp(loginAgencyID, 0, 0);
        }
    }, [loginAgencyID,]);

    useEffect(() => {
        GetReasonIdDrp(loginAgencyID, value.NameTypeID);
    }, [value.NameTypeID])

    const get_SMTLocationID = (LoginAgencyID, id) => {
        fetchPostData('SMTLocations/GetDataDropDown_SMTLocations', { AgencyID: LoginAgencyID, SMTTypeID: id }).then((data) => {
            if (data) {
                setSmtLocation(Comman_changeArrayFormat(data, 'SMTLocationID', 'Description'))
            }
            else { setSmtLocation([]); }
        })
    }

    const onChangeReasonCode = (data, name) => {
        const newArray = [...data]
        if (data) {
            let finalValueList = newArray.filter((item, index) => newArray.indexOf(item) === index)?.map((item) => item.value);
            setChangesStatus(true); setValue({ ...value, [name]: JSON.stringify(finalValueList) });
            setMultiSelected({ optionSelected: newArray.filter((item, index) => newArray.indexOf(item) === index) });
        }
        else { setMultiSelected({ optionSelected: newArray }); }
    }

    const GetNameTypeIdDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('NameType/GetDataDropDown_NameType', val).then((data) => {
            if (data) {
                const id = data?.filter((val) => { if (val.NameTypeCode === "I") return val })
                if (id.length > 0) {
                    setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].NameTypeID } })
                     get_Victim_Type_Data(loginAgencyID , id[0].NameTypeID);
                }
                setNameTypeIdDrp(threeColArray(data, 'NameTypeID', 'Description', 'NameTypeCode'))
            }
            else { setNameTypeIdDrp([]); }
        })
    };

    const GetSuffixIDDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('Suffix/GetDataDropDown_Suffix', val).then((data) => {
            if (data) {
                setSuffixIdDrp(Comman_changeArrayFormat(data, 'SuffixID', 'Description'))
            }
            else { setSuffixIdDrp([]); }
        })
    };

    const GetSexIDDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('DropDown/GetData_SexType', val).then((data) => {
            if (data) {
                setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
            }
            else { setSexIdDrp([]); }
        })
    }

    const GetRaceIdDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
            }
            else { setRaceIdDrp([]); }
        })
    }

    const getEthinicityDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
            }
            else { setEthinicityDrpData([]) }
        })
    };

    const get_SMTTypeID = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('SMTTypes/GetDataDropDown_SMTTypes', val).then((data) => {
            if (data) {
                setSmtType(Comman_changeArrayFormat(data, 'SMTTypeID', 'Description'))
            }
            else { setSmtType([]); }
        })
    }

    const check_Validation_Error = () => {
        if (Comparision(value.WeightFrom, value.WeightTo, 'Weight') === 'true') {
            get_Name_Advance_Search();
        }
    }

    const get_Appearance_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetAppearanceDropDown', val).then((data) => {
            if (data) {
                setComplexionColoIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.ComplexionType, "ComplexionID", "Description", "ComplexionID"));
            } else {
                setComplexionColoIDDrp([]);
            }
        })
    };

    function hasValues(obj) {
        for (let key in obj) {
            if (key != 'AgencyID' && key != 'PINID') {
                if (obj[key]) { return true; }
            }
        }
        return false;
    }

    useEffect(() => {
        if (isCAD) {
            if (location.state?.fromRefineSearch) {
                get_SMTLocationID(loginAgencyID, location.state.searchState?.SMTTypeID);
                getRmsCfsCodeID(loginAgencyID, location.state.searchState?.FBIID);
                GetBusinessTypeDrp(loginAgencyID);
                setRefineSearchData(location.state);
                setValue(location.state.searchState || {});
                setNameTypeCode(location.state.nameCodeState || {})
                setMultiSelected(location.state.multiSelectedState || {})
            } else if (!refineSearchData) {
                // If no refine search data, reset the form
                Reset();
            }
            // Clear location.state AFTER saving the data locally
            if (location.state) {
                navigate(location.pathname, { replace: true });
            }
        }
    }, [location.state, navigate, refineSearchData]);

    const get_Name_Advance_Search = async () => {
        const {
            NameIDNumber, NameIDNumberTo, NameTypeID, NameReasonCodeID, LastName, MiddleName, FirstName, SuffixID, DateOfBirthFrom, DateOfBirthTo, SexID, RaceID, EthnicityID, HairColorID,
            EyeColorID, WeightFrom, WeightTo, SMTTypeID, SMTLocationID, SSN, SMT_Description, IncidentNumber, IncidentNumberTo, ReportedDate, ReportedDateTo, DateOfBirth,
            HeightFrom, HeightTo, AgencyID, PINID, DLNumber, BusinessTypeID, PhoneTypeID, Contact, FaxNumber, RMSCFSCodeID, FBIID, CrimeLocation, OccurredFrom, OccurredFromTo, LawTitleId, AgeFrom, AgeTo, AgeUnitID, Local, SBI, FBI, TAX, SPN, Jacket, OCN, State, ComplexionID,
            IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID, VictimTypeID,
            CADEventFrom, CADEventTo // Include these from the input value
        } = myStateRef.current
        if ((AgeFrom?.trim() || AgeTo?.trim())) {
            // toastifyError("Please select an Age Unit.");
            if (!AgeUnitID) {
                return;
            }
            let isValidToExist = false;
            {
                if (AgeTo !== undefined && AgeTo !== null && AgeTo !== '') {
                    isValidToExist = true;
                    if (parseFloat(AgeFrom) > parseFloat(AgeTo)) {
                        toastifyError(`Age To should  be more than Age From`);
                        return;
                    }
                }
                if (AgeUnitID === 2 && ((AgeFrom > 23 || AgeFrom < 1))) {
                    toastifyError(`Age  in Hours should be between 1 to 23`);
                    return;
                }
                if (AgeUnitID === 2 && isValidToExist && ((AgeTo > 23 || AgeTo < 1))) {
                    toastifyError(`Age  in Hours should be between 1 to 23`);
                    return;
                }
                if (AgeUnitID === 1 && (AgeFrom > 364 || AgeFrom < 1)) {
                    toastifyError(`Age  in Days should be between 1 to 364`);
                    return;
                }
                if (AgeUnitID === 1 && isValidToExist && (AgeTo > 364 || AgeTo < 1)) {
                    toastifyError(`Age in Days should be between 1 to 364`);
                    return;
                }
                if (AgeUnitID === 5 && (AgeFrom > 99 || AgeFrom < 1)) {
                    toastifyError(`Age  in Years should be between 1 to 99`);
                    return;
                }
                if (AgeUnitID === 5 && isValidToExist && (AgeTo > 99 || AgeTo < 1)) {
                    toastifyError(`Age  in Years should be between 1 to 99`);
                    return;
                }
            }


        }

        const val = {
            'NameIDNumber': NameIDNumber?.trim(), 'NameIDNumberTo': NameIDNumberTo?.trim(), 'NameTypeID': NameTypeID, 'ReasonCodeList': NameReasonCodeID, 'LastName': LastName?.trim(), 'MiddleName': MiddleName?.trim(), 'FirstName': FirstName?.trim(),
            'SuffixID': SuffixID, 'DateOfBirthFrom': DateOfBirthFrom, 'DateOfBirthTo': DateOfBirthTo, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'HairColorID': HairColorID,
            'EyeColorID': EyeColorID, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'SMTTypeID': SMTTypeID, 'SMTLocationID': SMTLocationID, 'SSN': SSN, 'SMT_Description': SMT_Description,
            'IncidentNumber': IncidentNumber, 'IncidentNumberTo': IncidentNumberTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'DateOfBirth': DateOfBirth,
            'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'AgencyID': loginAgencyID, 'DLNumber': DLNumber, 'BusinessTypeID': BusinessTypeID, 'PhoneTypeID': PhoneTypeID, 'Contact': Contact, 'FaxNumber': FaxNumber, 'RMSCFSCodeID': RMSCFSCodeID, 'FBIID': FBIID, 'Address': CrimeLocation, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, "LawTitleID": LawTitleId, 'AgeFrom': AgeFrom, 'AgeTo': AgeTo, 'AgeUnitID': AgeUnitID, 'Local': Local, 'SBI': SBI, 'FBI': FBI, 'TAX': TAX, 'SPN': SPN, 'Jacket': Jacket, 'OCN': OCN, 'State': State, 'ComplexionID': ComplexionID,
            'IPAddress': IPAddress, 'UserID': loginPinID, 'SearchCriteria': SearchCriteria, 'SearchCriteriaJson': SearchCriteriaJson,
            'ReportName': effectiveScreenPermission[0]?.ScreenCode1, 'Status': Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
            'VictimTypeID': VictimTypeID
        }
        // Add CAD-related fields if isCAD is true
        if (isCAD) {
            val['CADIncidentNumberFrom'] = CADEventFrom?.trim();
            val['CADIncidentNumberTo'] = CADEventTo?.trim();
        }
        if (hasValues(val)) {
            const apiUrl = isCAD ? "CAD/Name/Name_Search" : "MasterName/Search_Name"; // Change API URL based on isCAD
            fetchPostData(apiUrl, val).then((res) => {
                if (res.length > 0) {
                    setnameSearch(res);
                    Reset();
                    if (isCAD) {
                        navigate('/cad/nameSearchList?page=Name-Search', { state: { searchState: value, nameCodeState: nameTypeCode, multiSelectedState: multiSelected } });
                        // recent Name search data
                        // setRecentSearchData([...recentSearchData, { ...val, "SearchModule": "NameSearch" }])
                    } else {
                        navigate('/namesearch?page=Name-Search');
                        // recent Name search data
                        setRecentSearchData([...recentSearchData, { ...val, "SearchModule": "Nam-Search" }]);
                    }
                } else {
                    setnameSearch([]);
                    toastifyError("Data Not Available");
                    setIsPermissionsLoaded(false);
                }
            });
        }
        else { toastifyError("Please Enter Details"); }
    }

    const handleKeyDown = (e) => {
        const charCode = e.keyCode || e.which;
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
        const numKeys = Array.from({ length: 10 }, (_, i) => i + 48);
        const numpadKeys = Array.from({ length: 10 }, (_, i) => i + 96);

        if (!controlKeys.includes(charCode) && !numKeys.includes(charCode) && !numpadKeys.includes(charCode)) {
            e.preventDefault();
        }
    };

    const getRmsCfsCodeID = (loginAgencyID, FBIID) => {
        const val = { 'AgencyID': loginAgencyID, 'FBIID': FBIID, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setRmsCfsID([]);
            }
        })
    }

    const changeDropDown = (e, name) => {
        if (e) {
            if (name === "RMSCFSCodeID") {
                setValue({ ...value, [name]: e.value })
            }
            else if (name === 'FBIID') {
                getRmsCfsCodeID(loginAgencyID, e.value)
                setValue({ ...value, [name]: e.value, ['RMSCFSCodeID']: '', });
            }
            else if (name === 'NIBRSClearanceID') {
                if (e.id != 'N') {
                    setValue({ ...value, [name]: e.value, ['NIBRSclearancedate']: getShowingMonthDateYear(new Date()), });
                } else {
                    setValue({ ...value, [name]: e.value, ['NIBRSclearancedate']: '', });
                }
            }
            else {
                setValue({ ...value, [name]: e.value, })
            }
        } else if (e === null) {
            if (name === "RMSDispositionId") {
                setValue({ ...value, [name]: null, ['NIBRSClearanceID']: null, ['DispositionDate']: '', ['NIBRSclearancedate']: '', });
            }
            else if (name === 'FBIID') {
                setRmsCfsID([]);
                setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeID']: "", })
            }
            else if (name === 'NIBRSClearanceID') {
                setValue({ ...value, [name]: null, ['NIBRSclearancedate']: "", });
            }
            else {
                setValue({ ...value, [name]: null });
            }
        }
        else {
            setValue({ ...value, [name]: null });
        }
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'SMTTypeID') {
                get_SMTLocationID(loginAgencyID, e.value)
                setValue({ ...value, [name]: e.value, ['SMTLocationID']: null, })
            } else {
                setValue({ ...value, [name]: e.value, })
            }
            if (name === 'NameTypeID') {
                get_Victim_Type_Data(loginAgencyID , e.value);
                setValue({
                    ...value,
                    [name]: e.value, ['SMTLocationID']: null, ['NameReasonCodeID']: [], ['LastName']: null, ['RMSCFSCodeID']: '',
                    ['FBIID']: '', ['OccurredFrom']: '', ['OccurredFromTo']: ''
                })
                setMultiSelected({ optionSelected: [] });
                setNameTypeCode(e.id);
                if (e.id === 'B') { GetBusinessTypeDrp(loginAgencyID) }
            }
            if (name === 'PhoneTypeID') {
                setValue({ ...value, [name]: e.value, ['SMTLocationID']: null, })
            }

        } else {
            if (name === 'SMTTypeID') {
                setValue({ ...value, [name]: null, ['SMTLocationID']: null, });
                setSmtLocation([]);
                return;
            }
            setValue({ ...value, [name]: null, })

        }
    }

    const GetBusinessTypeDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('NameBusinessType/GetDataDropDown_NameBusinessType', val).then((data) => {
            if (data) {
                setBusinessTypeDrp(Comman_changeArrayFormat(data, 'NameBusinessTypeID', 'Description'))
            }
            else { setBusinessTypeDrp([]); }
        })
    };

    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                setPhoneTypeIdDrp(threeColArray(data[0]?.ContactType, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode'))
                setAgeUnitDrpData(threeColArray(data[0]?.AgeUnit, 'AgeUnitID', 'Description', 'AgeUnitCode'));
            }
            else { setPhoneTypeIdDrp([]); setAgeUnitDrpData([]); }
        })
    };

    const Reset = () => {
        setIsPermissionsLoaded(false);
        setValue({
            ...value,
            NameIDNumber: '', NameIDNumberTo: '', NameTypeID: '', NameReasonCodeID: '', LastName: '', MiddleName: '', FirstName: '',
            SuffixID: '', DateOfBirthFrom: '', DateOfBirthTo: '', SexID: '', RaceID: '', EthnicityID: '', HairColorID: '',
            EyeColorID: '', WeightFrom: '', WeightTo: '', SMTTypeID: '', SMTLocationID: '', SSN: '', SMT_Description: '',
            IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', DateOfBirth: '', LawTitleId: '',
            HeightFrom: '', HeightTo: '', AgencyID: loginAgencyID, Contact: '', FaxNumber: '', RMSCFSCodeID: '', FBIID: '', CrimeLocation: '', OccurredFrom: '', OccurredFromTo: '', AgeFrom: '', AgeTo: '', AgeUnitID: '', Local: '', SBI: '', FBI: '', TAX: '', SPN: '', Jacket: '', OCN: '', State: '', ComplexionID: '', CADEventFrom: '', CADEventTo: '',
        });

    }

    const OnClose = () => {
        Reset();

        navigate('/dashboard-page');
        if (isCAD) {
            navigate('/cad/dashboard-page');
            setSelectSearchRecord("")
        } else {
            navigate('/dashboard-page');
        }
    }

    const [errorMessage, setErrorMessage] = useState('');

    const handlChange = (e) => {
        if (e.target.name === 'SSN') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({ ...value, [e.target.name]: ele })
            }
            if (e.target.name === 'SSN') {
                return 'true';
            }
            if (e.target.name.length === 11) {
                return 'true'
            }
        } else if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
            if (ele.length === 8) {
                const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                const match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
                setValue({ ...value, [e.target.name]: ele })
            }
        }
        else if (e.target.name === 'WeightTo' || e.target.name === 'WeightFrom') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true);
            const updatedValue = { ...value, [e.target.name]: checkNumber };
            if (e.target.name === 'WeightFrom' && checkNumber === '') {
                updatedValue.WeightTo = '';
            }
            setValue(updatedValue);
        }

        else if (e.target.name === 'HeightFrom') {
            let ele = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: ele, })

        } else if (e.target.name === 'HeightTo') {
            let ele = e.target.value.replace(/[^0-9\s]/g, "");
            setValue({ ...value, [e.target.name]: ele, })
        }

        else if (e.target.name === 'AgeFrom') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true);
            setValue({ ...value, AgeFrom: checkNumber, AgeTo: '', AgeUnitID: '', ['Years']: 0, ['DateOfBirth']: null });
        }
        else if (e.target.name === 'AgeTo') {
            const checkNumber = e.target.value.replace(/[^0-9\s]/g, "");
            setChangesStatus(true);
            setValue({ ...value, [e.target.name]: checkNumber, ['Years']: 0, ['DateOfBirth']: null });
        }
        else if (e.target.name === 'Contact') {
            let ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 10) {
                setValue(pre => { return { ...pre, ['IsUnListedPhNo']: 'true', } });
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                    setChangesStatus(true)
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setChangesStatus(true)
                setValue({ ...value, [e.target.name]: ele })
            }
        } else if (e.target.name === 'CADEventFrom') {
            if (e.target.value) {
                setValue({ ...value, CADEventFrom: e.target.value });
            } else {
                setValue({ ...value, CADEventFrom: e.target.value, CADEventTo: "" });
            }
        }
        else {
            setValue({ ...value, [e.target.name]: e.target.value });
        }
    }

    const handleChangeMNI = (e) => {
        const { name, value } = e.target;
        setValue((prevState) => {
            let updatedState = { ...prevState, [name]: value };
            if (name === 'NameIDNumber' && !value.trim()) {
                updatedState.NameIDNumberTo = '';
            }
            return updatedState;
        });
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    }

    const HeightFromOnBlur = (e) => {
        const heightstates = e.target.value;
        var len = heightstates.length;
        let heights = "";
        var oldvalue = heightstates.substring(len - 1, len);
        if (oldvalue != "\"") {
            if (len == 0) {
                heights = '';
            }
            else if (len == 1) {
                heights = heightstates.substring(0, len) + "'00\"";
            }
            else if (len == 2) {
                heights = heightstates.substring(0, len - 1) + "'0" + heightstates.substring(len - 1) + "\"";
            }
            else {
                var lengthstate = heightstates.substring(len - 2)

                heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                if (heightstates.substring(len - 2, len - 1) == 0) {
                    heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                }
                if (lengthstate > 11) {
                    heights = '';
                    toastifyError('invalid');
                }
            }
        }
        else { heights = heightstates; }
        const globalname_Fromarray = globalnameto.replace("\"", "").replace("'", "");
        const globalname_Toarray = heights.replace("\"", "").replace("'", "");

        if ((parseInt(globalname_Fromarray) < parseInt(globalname_Toarray))) {
            toastifyError('height should be less');
        }
        if (parseInt(heights.replace("\"", "").replace("'", "")) < 101) {
            toastifyError('Height should be greater than or equal to 1\'01"');
            heights = '';
        }
        if (heights != '') {
            setglobalname(heights);
        }
        setValue({ ...value, ['HeightFrom']: heights, })
    }

    const HeightOnChange = (e) => {
        const heightstates = e.target.value;
        var len = heightstates.length;
        let heights = "";
        var oldvalue = heightstates.substring(len - 1, len);
        if (oldvalue != "\"") {
            if (len == 0) {
                heights = '';
            }
            else if (len == 1) {
                heights = heightstates.substring(0, len) + "'00\"";
            }
            else if (len == 2) {
                heights = heightstates.substring(0, len - 1) + "'0" + heightstates.substring(len - 1) + "\"";
            }
            else {
                heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                if (heightstates.substring(len - 2, len - 1) == 0) {
                    heights = heightstates.substring(0, len - 2) + "'" + heightstates.substring(len - 2) + "\"";
                }
                var lengthstate = heightstates.substring(len - 2)
                if (lengthstate > 11) {
                    heights = '';
                    toastifyError('invalid');
                }
            }
        }
        else {
            heights = heightstates;
        }
        const globalname_Fromarray = globalname.replace("\"", "").replace("'", "");
        const globalname_Toarray = heights.replace("\"", "").replace("'", "");
        if ((parseInt(globalname_Fromarray) >= parseInt(globalname_Toarray))) {
            toastifyError('height should be greater');
            heights = '';
        }
        if (parseInt(heights.replace("\"", "").replace("'", "")) < 101) {
            toastifyError('Height should be greater than or equal to 1\'01"');
            heights = '';
        }
        if (heights != '') {
            setglobalnameto(heights)
        }
        setValue({ ...value, ['HeightTo']: heights, })

    }

    const onChangeNameIDNum = (e) => {
        if (e) {
            const { name, value } = e.target;

            if (name === 'NameIDNumber' || name === 'NameIDNumberTo') {
                let ele = value.replace(/[^a-zA-Z0-9]/g, '');
                if (ele.length <= 11) {
                    const alphabet = ele[0]?.toUpperCase() || '';
                    const digits = ele.slice(1).replace(/[^0-9]/g, '');
                    if (digits.length === 9) {
                        setValue(prevValue => ({
                            ...prevValue,
                            [name]: alphabet + '-' + digits,
                            ...(name === 'NameIDNumber' && value === '' ? { NameIDNumberTo: '' } : {})
                        }));
                    } else {
                        setValue(prevValue => ({
                            ...prevValue,
                            [name]: alphabet + digits,
                            ...(name === 'NameIDNumber' && value === '' ? { NameIDNumberTo: '' } : {})
                        }));
                    }
                } else {
                    ele = value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
                    setValue(prevValue => ({
                        ...prevValue,
                        [name]: ele,
                        ...(name === 'NameIDNumber' && value === '' ? { NameIDNumberTo: '' } : {})
                    }));
                }
            } else {
                setValue(prevValue => ({
                    ...prevValue,
                    [name]: value
                }));
            }
        } else {
            setValue(prevValue => ({
                ...prevValue,
                [e.target.name]: e.target.value
            }));
        }
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
    const customStyles2 = {
        control: (base) => ({
            ...base,
            backgroundColor: '#f5f5f5',
            color: '#999999',
            cursor: 'not-allowed',
            height: 20,
            minHeight: 35,
            fontSize: 14,
            marginTop: 2,
            boxShadow: 'none',
        }),
    };


    const HandleChange = (e,) => {
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
            if (ele.length === 8) {
                const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                const match = cleaned.match(/^(\d{2})(\d{6})$/);
                if (match) {
                    setValue({
                        ...value,
                        [e.target.name]: match[1] + '-' + match[2]
                    })
                }
            } else {
                ele = e.target.value.split("'").join('').replace(/[^0-9\s]/g, '');
                setValue({
                    ...value,
                    [e.target.name]: ele
                })
            }
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        }
    }

    const RMSCFSDropDown = (e, name) => {
        if (e) {
            if (name === 'RMSCFSCodeList') {
                const ids = []
                e.forEach(({ value }) => ids.push(value))
                setValue({
                    ...value,
                    [name]: JSON.stringify(ids)
                })
            } else if (name === 'IncidentSecurityIDlist') {
                const ids = []
                e.forEach(({ value }) => ids.push(value))
                setValue({
                    ...value,
                    [name]: JSON.stringify(ids)
                })
            } else {
                setValue({
                    ...value,
                    [name]: e.value,
                })
            }
        } else {
            setValue({
                ...value,
                [name]: null,
            })
        }
    }

    const notReqStyle = {
        control: (styles) => ({
            ...styles, backgroundColor: "",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue((prevValue) => {
            const updatedValue = { ...prevValue, [name]: value };
            if (name === "WeightFrom" && value.trim() === "") {
                updatedValue.WeightTo = "";
            }

            return updatedValue;
        });
    };

    const handleChangeHight = (e) => {
        const { name, value } = e.target;
        setValue((prevValue) => {
            const updatedValue = { ...prevValue, [name]: value };
            if (name === "HeightFrom" && value.trim() === "") {
                updatedValue.HeightTo = "";
            }
            return updatedValue;
        });
    };

    const handleWeightFromBlur = () => {
        const weightFrom = Number(value?.WeightFrom);
        const weightTo = Number(value?.WeightTo);
        if (weightFrom && weightTo) {
            if (weightFrom > weightTo) {
                toastifyError('WeightFrom should be less than WeightTo');

            }
        }

    };

    const handleWeightToBlur = () => {
        const weightFrom = Number(value?.WeightFrom);
        const weightTo = Number(value?.WeightTo);
        if (weightFrom && weightTo) {
            if (weightTo < weightFrom) {
                toastifyError('WeightTo should be greater than WeightFrom');
            }
        }

    };

    const ReasonCodeRoleArr = [
        { value: 1, label: 'Victim' },
        { value: 2, label: 'Offender' },
        { value: 3, label: 'Other' }
    ]

    const onChangeReaonsRole = (e, name) => {
        setChangesStatus(true);
        const newArray = [...e]
        if (e) {
            let finalValueList = newArray?.map((item) => item.value);
            GetReasonIdDrp(loginAgencyID, value.NameTypeID, finalValueList);
            setValue({ ...value, [name]: finalValueList });
            setMultiSelectedReason({ optionSelected: newArray });

        } else {

            GetReasonIdDrp(loginAgencyID, value.NameTypeID, []);
            setValue({ ...value, [name]: null });
            setMultiSelectedReason({ optionSelected: [] });
        }
    }

    const getFiltredReasonCode = (arr) => {
        const selectedReasonArr = multiSelected.optionSelected ? multiSelected.optionSelected : [];

        const isAdultArrest = selectedReasonArr?.filter((item) => item?.label === "Adult Arrest")
        const isJuvinileArrest = selectedReasonArr?.filter((item) => item?.label === "Juvenile Arrest")

        if (isAdultArrest?.length > 0) {
            const isAdultArr = arr?.filter((item) => item?.label != "Juvenile Arrest")
            return isAdultArr

        } else if (isJuvinileArrest?.length > 0) {
            const isAdultArr = arr?.filter((item) => item?.label != "Adult Arrest")
            return isAdultArr
        } else {
            return arr
        }
    }

    const GetReasonIdDrp = (loginAgencyID, id, RoleIdsArray) => {
        const val = { AgencyID: loginAgencyID, CategoryID: id, Role: RoleIdsArray }
        fetchPostData('NameReasonCode/GetDataDropDown_NameReasonCode', val).then((data) => {
            if (data) {
                const hasVictimNameTrue = data.some(item => item.IsVictimName === true);
                //   setVictimDropStatus(hasVictimNameTrue);
                // setVictimDropStatus(hasVictimNameTrue);
                setReasonIdDrp(Comman_changeArrayFormat(data, 'NameReasonCodeID', 'Description'))
                if (openPageName === 'Victim') {
                    const id = data?.filter((val) => { if (val?.ReasonCode === "VIC") return val });
                    if (id?.length > 0) {
                        setMultiSelected({
                            optionSelected: id ? fourColArray(id, 'NameReasonCodeID', 'Description', 'IsVictimName', 'IsOffenderName') : '',
                        });
                        let finalValueList = id?.map((item) => item?.NameReasonCodeID);
                        setValue({ ...value, ['NameReasonCodeID']: finalValueList })
                    }
                } else if (openPageName === 'Offender') {
                    const id = data?.filter((val) => { if (val?.ReasonCode === "OFF") return val });
                    if (id?.length > 0) {
                        setMultiSelected({
                            optionSelected: id ? fourColArray(id, 'NameReasonCodeID', 'Description', 'IsVictimName', 'IsOffenderName') : '',
                        });
                        let finalValueList = id?.map((item) => item?.NameReasonCodeID);
                        setValue({ ...value, ['NameReasonCodeID']: finalValueList })
                    }
                }
            } else {
                setReasonIdDrp([]);
            }
        })
    }

    // const get_Victim_Type_Data = (loginAgencyID) => {
    //     const val = {
    //         AgencyID: loginAgencyID,
    //     }
    //     fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
    //         if (data) {
    //             setVictimTypeDrp(threeColArray(data, 'VictimTypeID', 'Description', 'VictimCode'))
    //         } else {
    //             setVictimTypeDrp([]);
    //         }
    //     })
    // }
    //harsh
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
            get_Name_Advance_Search()
        }
    }, [isPermissionsLoaded]);

    const myStateRef = React.useRef(value);


    useEffect(() => {
        myStateRef.current = value;
    }, [value])




    //------------------------------------------//--------------------------------------
    const onChangeNIBRSCode = (e, name) => {
        if (e) {
            if (name === "FBIID") {
                setValue({ ...value, ["FBIID"]: e.value, ["RMSCFSCodeID"]: null, });
                setChargeCodeDrp([]);
                getRMSCFSCodeListDrp(loginAgencyID, e.value, value?.LawTitleId);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "FBIID") {
                setValue({
                    ...value, [name]: null, ["RMSCFSCodeID"]: null,
                });
                NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
                getRMSCFSCodeListDrp(loginAgencyID, null, value?.LawTitleId);
                setChargeCodeDrp([]);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    };

    const handleInputChange = (inputValue) => {
        if (inputValue) {
            const filtered = nibrsCodeDrp.filter((option) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions([]);
        }
    };


    const getLawTitleNibrsByCharge = async (loginAgencyID, lawTitleID, RMSCFSCodeID, mainIncidentID) => {
        const lawTitleObj = { 'AgencyID': loginAgencyID, 'ChargeCodeID': RMSCFSCodeID };
        const nibrsCodeObj = { 'AgencyID': loginAgencyID, 'LawTitleID': null, 'IncidentID': mainIncidentID, 'ChargeCodeID': RMSCFSCodeID, };
        try {
            const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
                fetchPostData("LawTitle/GetDataDropDown_LawTitle", lawTitleObj),
                fetchPostData("FBICodes/GetDataDropDown_FBICodes", nibrsCodeObj),
            ]);
            const lawTitleArr = Comman_changeArrayFormat(
                lawTitleResponse, "LawTitleID", "Description"
            );
            const nibrsArr = threeColArrayWithCode(
                nibrsCodeResponse, "FBIID", "Description", "FederalSpecificFBICode"
            );
            setNibrsCodeDrp(nibrsArr);
            setValue({
                ...value,
                LawTitleId: lawTitleArr[0]?.value, FBIID: nibrsArr[0]?.value, RMSCFSCodeID: RMSCFSCodeID,
            });
            const isSingleEntry = lawTitleArr.length === 1 && nibrsArr.length === 1;
        } catch (error) {
            console.error("Error during data fetching:", error);
        }
    };


    const getRMSCFSCodeListDrp = (loginAgencyID, FBIID, LawTitleId) => {
        const val = {
            'AgencyID': loginAgencyID, 'FBIID': FBIID, 'LawTitleID': LawTitleId,
        };
        fetchPostData("ChargeCodes/GetDataDropDown_ChargeCodes", val).then(
            (data) => {
                if (data) {
                    setChargeCodeDrp(Comman_changeArrayFormat(data, "ChargeCodeID", "Description"));
                } else {
                    setChargeCodeDrp([]);
                }
            }
        );
    };

    const LawTitleIdDrpDwnVal = async (loginAgencyID, RMSCFSCodeID) => {
        const val = { 'AgencyID': loginAgencyID, 'ChargeCodeID': RMSCFSCodeID };
        await fetchPostData("LawTitle/GetDataDropDown_LawTitle", val).then(
            (data) => {
                if (data) {
                    setLawTitleIdDrp(Comman_changeArrayFormat(data, "LawTitleID", "Description"));
                } else {
                    setLawTitleIdDrp([]);
                }
            }
        );
    };


    const NIBRSCodeDrpDwnVal = (loginAgencyID, LawTitleId, mainIncidentID) => {
        const val = {
            'AgencyID': loginAgencyID, 'LawTitleID': LawTitleId ? LawTitleId : null, 'IncidentID': mainIncidentID,
        };
        fetchPostData("FBICodes/GetDataDropDown_FBICodes", val).then((data) => {
            if (data) {
                setNibrsCodeDrp(threeColArrayWithCode(data, "FBIID", "Description", "FederalSpecificFBICode"));
            } else {
                setNibrsCodeDrp([]);
            }
        });
    };

    const onChangeDrpLawTitle = async (e, name) => {

        if (e) {
            if (name === "LawTitleId") {
                setValue({
                    ...value, ["LawTitleId"]: e.value, ["FBIID"]: null, ["RMSCFSCodeID"]: null,
                });
                setChargeCodeDrp([]); setNibrsCodeDrp([]);
                // nibrs code
                NIBRSCodeDrpDwnVal(loginAgencyID, e.value);
                // charge code
                getRMSCFSCodeListDrp(loginAgencyID, value?.FBIID, e.value);
            } else if (name === "RMSCFSCodeID") {
                const res = await getLawTitleNibrsByCharge(loginAgencyID, value?.LawTitleId, e.value);
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValue({ ...value, ["LawTitleId"]: null, ["FBIID"]: "", ["RMSCFSCodeID"]: null, });
                setNibrsCodeDrp([]); setChargeCodeDrp([]);
                //law title
                LawTitleIdDrpDwnVal(loginAgencyID, null);
                // nibrs code
                NIBRSCodeDrpDwnVal(loginAgencyID, null);
                //offence code
                getRMSCFSCodeListDrp(loginAgencyID, null, null);
            } else if (name === "RMSCFSCodeID") {
                setValue({ ...value, ["RMSCFSCodeID"]: null });

                // nibrs code
                NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
            } else {
                setValue({ ...value, [name]: null });
            }
        }
    };

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

    const get_Victim_Type_Data = (loginAgencyID, nameTypeID) => {
        const val = { AgencyID: loginAgencyID };

        fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
            if (data) {
                const formattedData = threeColArray(data, 'VictimTypeID', 'Description', 'VictimCode');
                let filteredVictimType = [];
                if (nameTypeID === 1) {
                    filteredVictimType = formattedData?.filter(item =>
                        item.id === "I" || item.id === "L"
                    );
                } else if (nameTypeID === 2) {
                    filteredVictimType = formattedData?.filter(item =>
                        ["B", "F", "G", "R", "S", "O", "U"].includes(item.id)
                    );
                } else {
                    filteredVictimType = formattedData; // fallback to all if not 1 or 2
                }
                setVictimTypeDrp(filteredVictimType);
            } else {
                setVictimTypeDrp([]);
            }
        });
    };


    return (
        <div className="section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency ">
                            <div className="card-body" >
                                <div className="btn-box  text-right  mr-1 mb-1">
                                    {
                                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Name_Advance_Search(); }}>Search</button>
                                            : <></> :
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Name_Advance_Search(); }}>Search</button>
                                    }
                                    <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1 " onClick={() => { OnClose(); }}>Close</button>

                                </div>
                                <div className="row " style={{ marginTop: '-2px' }}>

                                    <div className="col-12 ">

                                        <fieldset >
                                            <legend>Name Type</legend>

                                            <div className="row px-1">
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Name Type</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-1 ">
                                                    <Select
                                                        name='NameTypeID'
                                                        value={nameTypeIdDrp?.filter((obj) => obj.value === value?.NameTypeID)}
                                                        options={nameTypeIdDrp}
                                                        onChange={(e) => ChangeDropDown(e, 'NameTypeID')}
                                                        // isClearable
                                                        placeholder="Select..."
                                                        styles={customStylesWithOutColor}
                                                    />

                                                </div>

                                                <div className="col-3 col-md-3 col-lg-1 mt-3">
                                                    <label htmlFor="" className='label-name '>
                                                        Victim Type
                                                    </label>

                                                </div>
                                                <div className="col-3 col-md-3 col-lg-2  mt-2" >
                                                    <Select
                                                        name='VictimTypeID'
                                                        value={victimTypeDrp?.filter((obj) => obj.value === value?.VictimTypeID)}
                                                        isClearable
                                                        // options={victimTypeDrp ? filterVictimData(victimTypeDrp, nameSingleData[0]?.NameTypeCode) : []}
                                                        options={victimTypeDrp}
                                                        onChange={(e) => { ChangeDropDown(e, 'VictimTypeID'); }}
                                                        placeholder="Select.."
                                                    //   styles={victimTypeStatus ? colourStylesReason : ''}
                                                    // ref={SelectedValue}
                                                    />
                                                </div>

                                                <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                    <label htmlFor="" className='label-name '>
                                                        Role
                                                    </label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-1">
                                                    <SelectBox
                                                        options={ReasonCodeRoleArr ? ReasonCodeRoleArr : []}
                                                        menuPlacement="bottom"
                                                        isMulti
                                                        closeMenuOnSelect={false}
                                                        hideSelectedOptions={true}
                                                        isClearable={false}
                                                        // allowSelectAll={true} 
                                                        allowSelectAll={false}
                                                        value={multiSelectedReason?.optionSelected}
                                                        components={{ MultiValue }}
                                                        onChange={(e) => onChangeReaonsRole(e, 'Role')}
                                                    // styles={colourStyles}
                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Reason Code</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                    <Select
                                                        name='NameReasonCodeID'
                                                        value={multiSelected.optionSelected}

                                                        options={reasonIdDrp ? getFiltredReasonCode(reasonIdDrp) : []}
                                                        onChange={(e) => onChangeReasonCode(e, 'NameReasonCodeID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                        isDisabled={value.NameTypeID ? false : true}
                                                        styles={customStylesWithOutColor}
                                                        defaultValue={[]}
                                                        isMulti
                                                    />
                                                </div>
                                            </div>

                                        </fieldset>
                                    </div>
                                    {
                                        nameTypeCode === "B" ?
                                            <></> :
                                            <div className="col-12 ">
                                                <fieldset >
                                                    <legend>Name Info </legend>
                                                    <div className="row px-1">
                                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                            <label htmlFor="" className='new-label'>MNI From</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 text-field mt-1">
                                                            <input type="text" id='NameIDNumber' maxLength={11} name='NameIDNumber' value={value?.NameIDNumber} onChange={handleChangeMNI} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'
                                                            >MNI To</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2 text-field mt-1">
                                                            <input type="text" id='NameIDNumberTo' disabled={!value?.NameIDNumber?.trim()}
                                                                className={!value?.NameIDNumber?.trim() ? 'readonlyColor' : ''} maxLength={11} name='NameIDNumberTo' value={value?.NameIDNumberTo} onChange={handleChangeMNI} />
                                                        </div>

                                                    </div>
                                                    <div className="row">
                                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                            <label htmlFor="" className='new-label'>Last Name</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3   text-field mt-1">
                                                            <input type="text" id='LastName' name='LastName' value={value?.LastName} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>First Name</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2  text-field mt-1">
                                                            <input type="text" id='FirstName' name='FirstName' value={value?.FirstName} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 px-0">
                                                            <label htmlFor="" className='new-label px-0'>Middle&nbsp;Name</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3  text-field mt-1">
                                                            <input type="text" id='MiddleName' name='MiddleName' value={value?.MiddleName} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-2  mt-2">
                                                            <label htmlFor="" className='new-label'>Suffix</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3  mt-1 ">
                                                            <Select
                                                                name='SuffixID'
                                                                value={suffixIdDrp?.filter((obj) => obj.value === value?.SuffixID)}
                                                                options={suffixIdDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'SuffixID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                styles={customStylesWithOutColor}
                                                            />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>DOB From</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2  ">
                                                            <DatePicker
                                                                id='DateOfBirthFrom'
                                                                name='DateOfBirthFrom'
                                                                ref={startRef}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => {
                                                                    if (date) {
                                                                        setValue({ ...value, ['DateOfBirthFrom']: date ? getShowingMonthDateYear(date) : null, ['DateOfBirthTo']: '', ['AgeUnitID']: '' })
                                                                    }
                                                                    else {
                                                                        setValue({ ...value, ['DateOfBirthFrom']: date ? getShowingMonthDateYear(date) : null, ['DateOfBirthTo']: '', ['AgeUnitID']: '' })
                                                                    }
                                                                }}

                                                                dateFormat="MM/dd/yyyy"
                                                                onChangeRaw={(e) => {
                                                                    const formatted = formatRawInput(e.target.value);
                                                                    e.target.value = formatted;
                                                                }}
                                                                // peekNextMonth
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                                isClearable={value?.DateOfBirthFrom ? true : false}
                                                                selected={value?.DateOfBirthFrom && new Date(value?.DateOfBirthFrom)}
                                                                placeholderText={value?.DateOfBirthFrom ? value.DateOfBirthFrom : 'Select...'}
                                                                autoComplete='Off'
                                                                maxDate={new Date()}
                                                                disabled={value.AgeFrom ? true : false}
                                                                className={value?.AgeFrom ? 'readonlyColor' : ''}
                                                            />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>DOB To</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 ">
                                                            <DatePicker
                                                                id='DateOfBirthTo'
                                                                name='DateOfBirthTo'
                                                                ref={startRef1}
                                                                onKeyDown={onKeyDown}
                                                                onChange={(date) => { setValue({ ...value, ['DateOfBirthTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                                dateFormat="MM/dd/yyyy"
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dropdownMode="select"
                                                                isClearable={value?.DateOfBirthTo ? true : false}
                                                                selected={value?.DateOfBirthTo && new Date(value?.DateOfBirthTo)}
                                                                onChangeRaw={(e) => {
                                                                    const formatted = formatRawInput(e.target.value);
                                                                    e.target.value = formatted;
                                                                }}
                                                                placeholderText={value?.DateOfBirthTo ? value.DateOfBirthTo : 'Select...'}
                                                                autoComplete='Off'
                                                                maxDate={new Date()}
                                                                minDate={value?.DateOfBirthFrom && new Date(value?.DateOfBirthFrom)}
                                                                disabled={!value?.DateOfBirthFrom}
                                                                className={!value?.DateOfBirthFrom ? 'readonlyColor' : ''}
                                                            />
                                                        </div>

                                                        <div className="col-1 col-md-1 col-lg-2 mt-2 ">
                                                            <label htmlFor="" className='label-name'>Age</label>
                                                        </div>
                                                        <div className="col-2 col-md-3 col-lg-1 mt-1  text-field " >
                                                            <input type="text" name='AgeFrom' maxLength={3}

                                                                value={value?.AgeFrom}
                                                                onChange={handlChange} required
                                                                placeholder='From' autoComplete='off'
                                                                disabled={value?.DateOfBirthFrom ? true : false}
                                                                className={value?.DateOfBirthFrom ? 'readonlyColor' : ''}
                                                            />
                                                        </div>
                                                        <span className='dash-name mt-1'>_</span>
                                                        <div className="col-2 col-md-2 col-lg-1 mt-1  text-field " >
                                                            <input type="text" name='AgeTo' disabled={!value.AgeFrom?.trim()} className={!value?.AgeFrom?.trim() ? 'readonlyColor' : ''} maxLength={3} value={value?.AgeTo} placeholder='To' autoComplete='off' onChange={handlChange} />
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2 mt-1 px-0">
                                                            <Select
                                                                name='AgeUnitID'
                                                                value={ageUnitDrpData?.filter((obj) => obj.value === value?.AgeUnitID)}
                                                                options={value.DateOfBirthFrom ? [] : ageUnitDrpData}
                                                                onChange={(e) => ChangeDropDown(e, 'AgeUnitID')}
                                                                isClearable
                                                                placeholder="Age Unit..."
                                                                styles={value.AgeFrom?.trim() || value.AgeTo?.trim() ? colourStyles : customStylesWithOutColor}
                                                                isDisabled={value?.DateOfBirthFrom ? true : false}
                                                                className={value?.DateOfBirthFrom ? 'readonlyColor' : ''}

                                                            />
                                                            {value.AgeFrom?.trim() || value.AgeTo?.trim() ? (
                                                                <span className="error-message" style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</span>
                                                            ) : null}
                                                        </div>

                                                    </div>
                                                </fieldset>
                                                {!isCAD && <fieldset >
                                                    <legend>Identification Info </legend>
                                                    <div className="row">
                                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                            <label htmlFor="" className='new-label'>SSN</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                            <input type="text" id='SSN' name='SSN' maxLength={9} value={value?.SSN} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>DL #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                            <input type="text" id='DLNumber' name='DLNumber' maxLength={15} value={value?.DLNumber} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>Phone #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                            <input type="text" id='Contact' name='Contact' maxLength={10} value={value?.Contact} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                            <label htmlFor="" className='new-label'>Local #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                            <input type="text" id='Local' name='Local' maxLength={10} value={value?.Local} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>SBI #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                            <input type="text" id='SBI' name='SBI' maxLength={25} value={value?.SBI} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>FBI #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                            <input type="text" id='FBI' name='FBI' maxLength={25} value={value?.FBI} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                            <label htmlFor="" className='new-label'>Tax #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                            <input type="text" id='TAX' name='TAX' value={value?.TAX} maxLength={25} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>SPN #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                            <input type="text" id='SPN' name='SPN' maxLength={25} value={value?.SPN} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>Jacket #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                            <input type="text" id='Jacket' name='Jacket' maxLength={25} value={value?.Jacket} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                            <label htmlFor="" className='new-label'>OCN #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                            <input type="text" id='OCN' name='OCN' maxLength={25} value={value?.OCN} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                            <label htmlFor="" className='new-label'>State #</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
                                                            <input type="text" id='State' name='State' maxLength={25} value={value?.State} onChange={handlChange} />
                                                        </div>
                                                    </div>
                                                </fieldset>}
                                            </div>
                                    }



                                    {
                                        nameTypeCode === "B" ?
                                            <>
                                                <div className="col-12 col-md-12 col-lg-12">
                                                    <div className="row px-3">
                                                        <div className="col-2 col-md-2 col-lg-2 mt-2 px-0">
                                                            <label htmlFor="" className='label-name'>Business Name</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3   text-field mt-1">
                                                            <input type="text" id='LastName' name='LastName' value={value?.LastName} onChange={handlChange} />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                            <label htmlFor="" className='label-name '>Business Type</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-6  mt-1">
                                                            <Select
                                                                name='BusinessTypeID'
                                                                value={businessTypeDrp?.filter((obj) => obj.value === value?.BusinessTypeID)}
                                                                options={businessTypeDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'BusinessTypeID')}
                                                                isClearable
                                                                placeholder="Select..."
                                                                styles={customStylesWithOutColor}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row px-3">
                                                        <div className="col-2 col-md-2 col-lg-2 mt-2">
                                                            <label htmlFor="" className='label-name '>Contact Type</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-3  mt-1">
                                                            <Select
                                                                name='PhoneTypeID'
                                                                styles={customStylesWithOutColor}
                                                                placeholder="Select..."
                                                                value={phoneTypeIdDrp?.filter((obj) => obj.value === value?.PhoneTypeID)}
                                                                options={phoneTypeIdDrp}
                                                                onChange={(e) => ChangeDropDown(e, 'PhoneTypeID')}
                                                                isClearable

                                                            />
                                                        </div>
                                                        <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                                            <label htmlFor="" className='label-name '>Contact No.</label>
                                                        </div>
                                                        <div className="col-4 col-md-4 col-lg-2 text-field mt-1">
                                                            <input type="text" name='Contact' className={''} value={value?.Contact} onChange={handlChange} maxLength={10} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                            :
                                            <>
                                                <div className="col-12">
                                                    <fieldset >
                                                        <legend>Physical Descriptor</legend>
                                                        <div className="row mt-2">
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Gender</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-3  ">
                                                                <Select
                                                                    name='SexID'
                                                                    value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                                    options={sexIdDrp}
                                                                    onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    styles={customStylesWithOutColor}
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Race</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-2 ">
                                                                <Select
                                                                    name='RaceID'
                                                                    value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                                    options={raceIdDrp}
                                                                    onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    styles={customStylesWithOutColor}
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Ethnicity</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-3  mt-1">
                                                                <Select
                                                                    name='EthnicityID'
                                                                    value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                                    options={ethinicityDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    styles={customStylesWithOutColor}
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Hair Color</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                                <Select
                                                                    onChange={(e) => ChangeDropDown(e, 'HairColorID')}
                                                                    name="HairColorID"
                                                                    value={hairColorDrpData?.filter((obj) => obj.value === value?.HairColorID)}
                                                                    options={hairColorDrpData}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    styles={customStylesWithOutColor}
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                                <label htmlFor="" className='label-name '>Height
                                                                    <p className='text-center mb-0' style={{ fontWeight: 'bold', fontSize: '10px' }}>(FT)</p>
                                                                </label>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1 text-field mt-1" >
                                                                {/* <input type="text" name='HeightFrom' maxLength={3} onBlur={(e) => HeightFromOnBlur(e)} value={value?.HeightFrom} onChange={handlChange} placeholder='From' /> */}
                                                                <input type="text" onKeyDown={handleKeyDown} name='HeightFrom' maxLength={3} value={value?.HeightFrom}
                                                                    onBlur={(e) => HeightFromOnBlur(e)}
                                                                    onChange={handleChangeHight}
                                                                    required
                                                                    disabled={nameTypeCode === "B" ? true : false} readOnly={nameTypeCode === "B" ? true : false} className={nameTypeCode === "B" ? 'readonlyColor' : ''} placeholder='From' autoComplete='off' />
                                                            </div>
                                                            <span className='dash-name mt-1' style={{ marginRight: '-10px' }}>__</span>
                                                            <div className="col-3 col-md-2 col-lg-1 ">
                                                                <div className="text-field px-2 mt-1">
                                                                    <input type="text" onKeyDown={handleKeyDown} name='HeightTo' maxLength={3} value={value?.HeightTo} onBlur={(e) => HeightOnChange(e)}
                                                                        onChange={handleChangeHight} required className={nameTypeCode === "B" || !value.HeightFrom?.trim() ? 'readonlyColor' : ''}
                                                                        disabled={nameTypeCode === "B" || !value.HeightFrom?.trim() ? true : false} readOnly={nameTypeCode === "B" ? true : false} placeholder='To' autoComplete='off'
                                                                    />
                                                                    {/* <input type="text" name='HeightTo' maxLength={3} value={value?.HeightTo} onBlur={(e) => HeightOnChange(e)}
                                                                        onChange={handlChange} required disabled={!value.HeightFrom} className={!value?.HeightFrom ? 'readonlyColor' : ''}
                                                                        placeholder='To' autoComplete='off'
                                                                    /> */}
                                                                </div>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                                <label htmlFor="" className='label-name '>Weight
                                                                    <p className='text-center mb-0' style={{ fontWeight: 'bold', fontSize: '10px' }}>(LBS)</p>
                                                                </label>
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1 text-field mt-1" >
                                                                <input type="text" name='WeightFrom' onBlur={(e) => {
                                                                    if (e.target.name === 'WeightFrom' &&
                                                                        // e.relatedTarget !== crossButtonRef.current &&
                                                                        e.relatedTarget?.name !== 'HeightFrom' &&
                                                                        e.relatedTarget?.name !== 'HeightTo') {
                                                                        handleWeightFromBlur(e);
                                                                    }
                                                                }} value={value?.WeightFrom} maxLength={3} onChange={handleChange} required placeholder='From' autoComplete='off' />
                                                                {/* <input type="text" id='WeightFrom' name='WeightFrom' value={value?.WeightFrom} onChange={handleChange} maxLength={3} placeholder='From'
                                                                /> */}
                                                            </div>
                                                            <span className='dash-name mt-1' style={{ marginRight: '-10px' }}>__</span>
                                                            <div className="col-3 col-md-1 col-lg-1 ">
                                                                <div className="text-field px-2 mt-1">
                                                                    <input type="text" name='WeightTo' onBlur={(e) => {
                                                                        if (e.target.name === 'WeightTo' &&
                                                                            // e.relatedTarget !== crossButtonRef.current &&
                                                                            e.relatedTarget?.name !== 'HeightFrom' &&
                                                                            e.relatedTarget?.name !== 'HeightTo') {
                                                                            handleWeightToBlur(e);
                                                                        }
                                                                    }} value={value?.WeightTo} maxLength={3} onChange={handleChange} disabled={!value.WeightFrom?.trim()} className={!value?.WeightFrom?.trim() ? 'readonlyColor' : ''} min={value?.WeightFrom}
                                                                        placeholder='To' />
                                                                    {/* <input type="text" id='WeightTo' name='WeightTo' disabled={!value.WeightFrom?.trim()} className={!value?.WeightFrom?.trim() ? 'readonlyColor' : ''} min={value?.WeightFrom} value={value?.WeightTo} onChange={handleChange}
                                                                        maxLength={3} placeholder='To'
                                                                    /> */}
                                                                </div>
                                                            </div>

                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Eye Color</label>
                                                            </div>
                                                            <div className="col-4 col-md-10 col-lg-3">
                                                                <Select
                                                                    name="EyeColorID"
                                                                    styles={customStylesWithOutColor}
                                                                    value={eyeColorDrpData?.filter((obj) => obj.value === value?.EyeColorID)}
                                                                    options={eyeColorDrpData}
                                                                    onChange={(e) => ChangeDropDown(e, 'EyeColorID')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                    menuPlacement="top"
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-1  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Complexion</label>
                                                            </div>
                                                            <div className="col-4 col-md-10 col-lg-3">
                                                                <Select
                                                                    name="Complexion"
                                                                    styles={customStylesWithOutColor}
                                                                    value={ComplexionColoIDDrp?.filter((obj) => obj.value === value?.ComplexionID)}
                                                                    options={ComplexionColoIDDrp}
                                                                    isClearable
                                                                    onChange={(e) => ChangeDropDown(e, 'ComplexionID')}
                                                                    placeholder="Select Complexion"
                                                                />
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-12">
                                                    <fieldset >
                                                        <legend>SMT</legend>
                                                        <div className="row">
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>SMT Type</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                                <Select
                                                                    name='SMTTypeID'
                                                                    value={smtType?.filter((obj) => obj.value === value?.SMTTypeID)}
                                                                    isClearable
                                                                    options={smtType}
                                                                    onChange={(e) => ChangeDropDown(e, 'SMTTypeID')}
                                                                    placeholder="Select..."
                                                                    styles={customStylesWithOutColor}
                                                                    menuPlacement='top'
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-3  mt-2 ">
                                                                <label htmlFor="" className='new-label'>SMT Location</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-4 mt-1">
                                                                <Select
                                                                    name='SMTLocationID'
                                                                    styles={customStylesWithOutColor}
                                                                    value={smtLocation?.filter((obj) => obj.value === value?.SMTLocationID)}
                                                                    isClearable
                                                                    options={smtLocation}
                                                                    onChange={(e) => ChangeDropDown(e, 'SMTLocationID')}
                                                                    placeholder="Select..."
                                                                    isDisabled={!value?.SMTTypeID || smtType?.find((obj) => obj.value === value?.SMTTypeID)?.label === 'Unknown'}
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label'>Description</label>
                                                            </div>
                                                            <div className="col-10 col-md-10 col-lg-10 mt-1 text-field">
                                                                <textarea id='SMT_Description' name='SMT_Description' value={value?.SMT_Description} onChange={handlChange} cols="30" rows="1" required></textarea>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                            </>

                                    }
                                    <div className="col-12">
                                        <fieldset >
                                            <legend>Incident Information</legend>
                                            {isCAD &&
                                                <div className='row'>
                                                    <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                        <label htmlFor="" className='new-label'>CAD Event # From</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                                                        <input type="text" id='CADEventFrom' name='CADEventFrom' maxLength={10} value={value?.CADEventFrom} onChange={handlChange} />
                                                    </div>
                                                    <div className="col-2 col-md-2 col-lg-3  mt-2 ">
                                                        <label htmlFor="" className='new-label'>CAD Event # To</label>
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-4 mt-1 text-field">
                                                        <input type="text" id='CADEventTo' name='CADEventTo' className={!value?.CADEventFrom?.trim() ? 'readonlyColor' : ''} disabled={!value?.CADEventFrom} maxLength={10} value={value?.CADEventTo} onChange={handlChange} />
                                                    </div>
                                                </div>

                                            }
                                            <div className="row mt-2">
                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                    <label htmlFor="" className='new-label'>Occurred From Date</label>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-3 ">
                                                    <DatePicker
                                                        name='OccurredFrom'
                                                        id='OccurredFrom'
                                                        ref={startRef2}
                                                        // onKeyDown={onKeyDown}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            } else {
                                                                onKeyDown(e);
                                                            }
                                                        }}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null, ['OccurredFromTo']: '', })
                                                            }
                                                            // else {
                                                            //     setValue({ ...value, ['OccurredFrom']: null, ['OccurredFromTo']: null })
                                                            // }
                                                            else {
                                                                setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null, ['OccurredFromTo']: '', })
                                                            }
                                                        }}
                                                        selected={value?.OccurredFrom && new Date(value?.OccurredFrom)}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        dateFormat="MM/dd/yyyy"
                                                        // timeFormat="HH:mm a"
                                                        // is24Hour
                                                        timeInputLabel
                                                        isClearable={value?.OccurredFrom ? true : false}
                                                        // peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date()}
                                                        placeholderText='Select...'
                                                        // showTimeSelect
                                                        // timeIntervals={1}
                                                        // timeCaption="Time"
                                                        filterTime={filterPassedTime}

                                                    />
                                                </div>
                                                <div className="col-2 col-md-2 col-lg-3  mt-2 ">
                                                    <babel htmlFor="" className='new-label'>Occurred To Date</babel>
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-4  ">
                                                    <DatePicker
                                                        id='OccurredFromTo'
                                                        name='OccurredFromTo'
                                                        ref={startRef3}
                                                        // onKeyDown={onKeyDown}
                                                        onKeyDown={(e) => {
                                                            if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                                                                e?.preventDefault();
                                                            } else {
                                                                onKeyDown(e);
                                                            }
                                                        }}
                                                        onChange={(date) => { setValue({ ...value, ['OccurredFromTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                        dateFormat="MM/dd/yyyy"
                                                        // timeFormat="HH:mm a"
                                                        // is24Hour
                                                        isClearable={value?.OccurredFromTo ? true : false}
                                                        // disabled={value?.OccurredFrom ? false : true}
                                                        selected={value?.OccurredFromTo && new Date(value?.OccurredFromTo)}
                                                        onChangeRaw={(e) => {
                                                            const formatted = formatRawInput(e.target.value);
                                                            e.target.value = formatted;
                                                        }}
                                                        minDate={new Date(value?.OccurredFrom)}
                                                        maxDate={new Date()}
                                                        placeholderText={'Select...'}
                                                        showDisabledMonthNavigation
                                                        autoComplete="off"
                                                        showYearDropdown
                                                        showMonthDropdown
                                                        dropdownMode="select"
                                                        // showTimeSelect
                                                        // timeIntervals={1}
                                                        // timeCaption="Time"
                                                        filterTime={(time) => filterPassedDateTime(time, value?.OccurredFromTo, value?.OccurredFrom)}
                                                        disabled={!value?.OccurredFrom}
                                                        className={!value?.OccurredFrom ? 'readonlyColor' : ''}
                                                    />
                                                </div>
                                                <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                                                    <label htmlFor="" className="new-label text-nowrap" >Law Title
                                                        <br />
                                                    </label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-3 mt-2">
                                                    <Select
                                                        name="LawTitleId"
                                                        value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                                                        options={lawTitleIdDrp}
                                                        isClearable
                                                        onChange={(e) => onChangeDrpLawTitle(e, "LawTitleId")}
                                                        placeholder="Select..."
                                                    />
                                                </div>

                                                <div className="col-2 col-md-2 col-lg-3  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'> TIBRS Code</label>
                                                </div>
                                                {!isCAD && <div className="col-10 col-md-10 col-lg-4 mt-2 ">
                                                    <Select

                                                        name="FBIID"
                                                        styles={customStylesWithOutColor}
                                                        value={nibrsCodeDrp?.filter((obj) => obj.value === value?.FBIID)}
                                                        options={filteredOptions.length > 0 ? filteredOptions : nibrsCodeDrp}
                                                        onInputChange={handleInputChange}
                                                        isClearable
                                                        onChange={(e) => onChangeNIBRSCode(e, "FBIID")}
                                                        placeholder="Select..."
                                                        menuPlacement='top'
                                                    // name='FBIID'
                                                    // styles={customStylesWithOutColor}
                                                    // value={NIBRSDrpData?.filter((obj) => obj.value === value?.FBIID)}
                                                    // isClearable
                                                    // options={NIBRSDrpData}
                                                    // onChange={(e) => changeDropDown(e, 'FBIID')}
                                                    // placeholder="Select..."
                                                    // menuPlacement='top'
                                                    />
                                                </div>}
                                                {!isCAD && <div className="col-2 col-md-2 col-lg-2  mt-2 pt-2">
                                                    <label htmlFor="" className='new-label'> Offense Code/Name </label>
                                                </div>}
                                                {
                                                    !isCAD && <div className="col-10 col-md-10 col-lg-10 mt-2 ">
                                                        <Select
                                                            name="RMSCFSCodeID"
                                                            styles={customStylesWithOutColor}
                                                            value={chargeCodeDrp?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                            isClearable
                                                            options={chargeCodeDrp}
                                                            onChange={(e) => onChangeDrpLawTitle(e, "RMSCFSCodeID")}
                                                            placeholder="Select..."
                                                            menuPlacement='top'
                                                        // name='RMSCFSCodeID'
                                                        // styles={customStylesWithOutColor}
                                                        // value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                        // isClearable
                                                        // options={rmsCfsID}
                                                        // menuPlacement='top'
                                                        // onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeID')}
                                                        // placeholder="Select..."
                                                        // isDisabled={!value?.FBIID}
                                                        // className={!value?.FBIID ? 'readonlyColor' : ''}
                                                        />
                                                    </div>
                                                }

                                                <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                    <label htmlFor="" className='new-label'>Location</label>
                                                </div>
                                                <div className="col-9 col-md-9 col-lg-10 mt-1 text-field">
                                                    <Location
                                                        {...{ value, setValue, locationStatus, setLocationStatus, updateStatus, setOnSelectLocation, setChangesStatus, setStatesChangeStatus }}
                                                        col='CrimeLocation'
                                                        locationID='crimelocationid'
                                                        check={false}
                                                        verify={true}
                                                        style={{ resize: 'both' }}
                                                    />
                                                    {/* <input type="text" name='CrimeLocation' value={value?.CrimeLocation} onChange={handlChange} id='CrimeLocation' className='' /> */}
                                                </div>

                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="btn-box  text-right  mr-1 mb-1">
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Name_Advance_Search(); }}>Search</button>
                                        : <></> :
                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Name_Advance_Search(); }}>Search</button>
                                }
                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1 " onClick={() => { OnClose(); }}>Close</button>

                            </div> */}
                            {/* <div className="btn-box  text-right  mr-1 mb-1" >
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => { get_Name_Advance_Search(); }}>Search</button>
                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1 " onClick={() => { OnClose(); }}>Close</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NameSearchPage