import React, { useContext, useEffect, useRef, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useDispatch } from 'react-redux';
import { fetchIpAddress, get_LocalStoreData } from '../../../../redux/actions/Agency';
import { base64ToString, colourStyles, customStylesWithOutColor, Decrypt_Id_Name, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../../Common/Utility';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Comman_changeArrayFormat, Comman_changeArrayFormatBasicInfo, Comman_changeArrayVictim, threeColArray, threeColArrayWithCode } from '../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { get_AgencyOfficer_Data, get_Circumstances_Drp_Data, get_Incident_Drp_Data, get_Missing_CMC_Drp_Data, get_NIBRS_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import DataTable from 'react-data-table-component';
import FamilyViolenceReport from './FamilyViolenceReport';
import { useReactToPrint } from 'react-to-print';
import MissingPersonReport from './MissingPersonReport';
import SelectBox from '../../../Common/SelectBox';
import { components } from "react-select";
import SexualAssaultReport from './SexualAssaultReport';
import HateReport from './HateReport';
import Loader from '../../../Common/Loader';
import { AgencyContext } from '../../../../Context/Agency/Index';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';


const StateReport = () => {
    const MultiValue = props => (
        <components.MultiValue {...props}>
            <span>{props.data.label}</span>
        </components.MultiValue>
    );

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const fbiCodesDrpData = useSelector((state) => state.DropDown.fbiCodesDrpData);
    const NIBRSDrpData = useSelector((state) => state.DropDown.NIBRSDrpData);

    const circumstancesDrpData = useSelector((state) => state.DropDown.circumstancesDrpData);
    const missingCMCDrpData = useSelector((state) => state.DropDown.missingCMCDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const ipAddress = useSelector((state) => state.Ip.ipAddress);

    const { GetDataTimeZone, datezone } = useContext(AgencyContext);


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    const query = useQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));


    const [selectedOption, setSelectedOption] = useState('Family');
    const [crimeBiasCategoryDrp, setCrimeBiasCategoryDrp] = useState([]);
    const [crimeBiasCategory, setCrimeBiasCategory] = useState([])
    const [crimeBiasCategoryEditVal, setCrimeBiasCategoryEditVal] = useState([]);
    const [headOfAgency, setHeadOfAgency] = useState([]);

    const [VictimDrp, setVictimDrp] = useState([]);
    const [name, setName] = useState([]);
    const [DrpNameID, setDrpNameID] = useState();
    const [victimTypeDrp, setVictimTypeDrp] = useState([]);
    const [CrimeID, setCrimeID] = useState('');
    const [relationShipDrp, setRelationShipDrp] = useState([]);

    const [multiImage, setMultiImage] = useState([]);
    const [rmsCfsID, setRmsCfsID] = useState([]);

    const [LoginPinID, setLoginPinID,] = useState('');
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [ethinicityDrpData, setEthinicityDrpData] = useState([])
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [masterReportData, setMasterReportData] = useState([])
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [loder, setLoder] = useState(false);
    const [showWatermark, setShowWatermark] = useState(false);



    const [lawTitleIdDrp, setLawTitleIdDrp] = useState([]);
    //NIBRS Code
    const [nibrsCodeDrp, setNibrsCodeDrp] = useState([]);
    // Offense Code/Name
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState(nibrsCodeDrp);

    const [value, setValue] = useState({
        'IncidentNumber': '', 'IncidentNumberTo': '', 'ReportedDate': null, 'ReportedDateTo': null, 'OccurredFrom': null, 'OccurredTo': null, 'AgencyID': '', 'FBIID': null, 'ChargeCodeID': null, 'RMSCFSCodeID': null, 'NameIDNumber': '', 'SSN': '', 'LastName': '', 'FirstName': '', 'MiddleName': '', 'DateOfBirthFrom': '', 'DateOfBirthTo': '', 'RelationshipTypeID': '', 'CrimeBiasCategoryID': '', 'VictimTypeID': '',
        'SexID': null, 'RaceID': null, 'EthnicityID': null, 'CrimeLocation': '', 'PINID': '', 'LawTitleId': '',
        // MSIING
        'ReportingOfficerID': '', 'CircumstancesID': null, 'CMCID': null, 'IsDNA': '', 'MissingPersonNameID': null,
        'IPAddress': '', 'UserID': '', 'SearchCriteria': '', 'SearchCriteriaJson': '', 'ReportName': 'StateReport', 'Status': '', 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1 || '', 'ModuleID': effectiveScreenPermission[0]?.ModuleFK || '',
    });


    const [searchValue, setSearchValue] = useState({
        IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', OccurredFrom: '', OccurredTo: '', CrimeLocation: '', SSN: '', LastName: '', FirstName: '', MiddleName: '', DateOfBirthFrom: '', DateOfBirthTo: '', SexID: null, RaceID: null, EthnicityID: null, RMSCFSCodeID: null, FBIID: null,
    });

    const [showFields, setShowFields] = useState({
        showIncidentNumber: false, showIncidentNumberTo: false, showReportedDateFrom: false, showReportedDateTo: false, showOccurredFrom: false, showOccurredTo: false, showCrimeLocation: false, showSSN: false, showLastName: false, showFirstName: false, showMiddleName: false, showDateOfBirthFrom: false, showDateOfBirthTo: false, showSexID: false, showRaceID: false, showEthnicityID: false, showRMSCFSCodeID: false, showFBIID: false, showOfficerName: false,
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);


    useEffect(() => {
        if (localStoreData) {
            dispatch(fetchIpAddress()); setloginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            GetSexIDDrp(localStoreData?.AgencyID); GetRaceIdDrp(localStoreData?.AgencyID); getEthinicityDrp(localStoreData?.AgencyID);
            get_Data_RelationShip_Drp(localStoreData?.AgencyID); get_Victim_Type_Data(localStoreData?.AgencyID);
            get_Head_Of_Agency(localStoreData?.AgencyID); GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("S111", localStoreData?.AgencyID, localStoreData?.PINID));
            if (NIBRSDrpData?.length === 0) { dispatch(get_NIBRS_Drp_Data(localStoreData?.AgencyID)) }
            if (circumstancesDrpData?.length === 0) { dispatch(get_Circumstances_Drp_Data(localStoreData?.AgencyID)) }
            if (missingCMCDrpData?.length === 0) { dispatch(get_Missing_CMC_Drp_Data(localStoreData?.AgencyID)) }
        }
    }, [localStoreData]);


    useEffect(() => {
        if (loginAgencyID) {
            // lawtitle dpr
            LawTitleIdDrpDwnVal(loginAgencyID, null);
            // FBIID
            NIBRSCodeDrpDwnVal(loginAgencyID, 0);
            // charge / offence codeName
            getRMSCFSCodeListDrp(loginAgencyID, 0, 0);
        }
    }, [loginAgencyID]);



    useEffect(() => {
        setShowFields({
            showIncidentNumber: searchValue.IncidentNumber, showIncidentNumberTo: searchValue.IncidentNumberTo, showReportedDateFrom: searchValue.ReportedDate, showReportedDateTo: searchValue.ReportedDateTo, showOccurredFrom: searchValue.OccurredFrom, showOccurredTo: searchValue.OccurredTo, showCrimeLocation: searchValue.CrimeLocation, showSSN: searchValue.SSN, showLastName: searchValue.LastName, showFirstName: searchValue.FirstName, showMiddleName: searchValue.MiddleName, showDateOfBirthFrom: searchValue.DateOfBirthFrom, showDateOfBirthTo: searchValue.DateOfBirthTo, showSexID: searchValue.SexID !== null, showRaceID: searchValue.RaceID !== null, showEthnicityID: searchValue.EthnicityID !== null, showRMSCFSCodeID: searchValue.RMSCFSCodeID !== null, showFBIID: searchValue.FBIID !== null,
        });
    }, [searchValue]);


    const handleChange = (e) => {
        if (e.target.name === 'IncidentNumber' || e.target.name === 'IncidentNumberTo') {
            let ele = e.target.value.trim();
            setValue({ ...value, [e.target.name]: ele });
            if (ele.length === 0) {
                e.target.name === 'IncidentNumber' && setValue({
                    ...value, ['IncidentNumberTo']: "", [e.target.name]: ele
                });
            }
        }
        else {
            setValue({ ...value, [e.target.name]: e.target.value })
        }
    }
    const get_Head_Of_Agency = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
            if (data) {
                setHeadOfAgency(Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency'));
            } else {
                setHeadOfAgency([])
            }
        })
    };

    const handlChange = (e) => {
        if (e.target.name === 'SSN') {
            var ele = e.target.value.replace(/\D/g, '');
            if (ele.length === 9) {
                var cleaned = ('' + ele).replace(/\D/g, '');
                var match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] + '-' + match[3] })
                }
            } else {
                ele = e.target.value.split('-').join('').replace(/\D/g, '');
                setValue({ ...value, [e.target.name]: ele })
            } if (e.target.name === 'SSN') {
                return 'true';
            } if (e.target.name.length === 11) {
                return 'true'
            }
        }
        else { setValue({ ...value, [e.target.name]: e.target.value }) }
    }
    const startRef = React.useRef();
    const startRef1 = React.useRef();
    const startRef2 = React.useRef();
    const startRef3 = React.useRef();
    const startRef4 = React.useRef();
    const startRef5 = React.useRef();
    const startRef6 = React.useRef();
    const startRef7 = React.useRef();
    const startRef8 = React.useRef();

    const onKeyDown = (e) => {
        if (e.keyCode === 9 || e.which === 9) {
            startRef.current.setOpen(false);
            startRef1.current.setOpen(false);
            startRef2.current.setOpen(false);
            startRef3.current.setOpen(false);
            startRef4.current.setOpen(false);
            startRef5.current.setOpen(false);
            startRef6.current.setOpen(false);
            startRef7.current.setOpen(false);
            startRef8.current.setOpen(false);
        }
    };
    const getRmsCfsCodeID = (loginAgencyID, FBIID) => {
        const val = { 'FBIID': FBIID, 'AgencyID': loginAgencyID, }
        fetchPostData('ChargeCodes/GetDataDropDown_ChargeCodes', val).then((data) => {
            if (data) {
                setRmsCfsID(Comman_changeArrayFormat(data, 'ChargeCodeID', 'Description'))
            } else {
                setRmsCfsID([]);
            }
        })
    }
    const getEthinicityDrp = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('/DropDown/GetDataDropDown_Ethnicity', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data, 'EthnicityID', 'Description'));
            } else {
                setEthinicityDrpData([])
            }
        })
    };
    const get_Data_RelationShip_Drp = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID }
        fetchPostData('VictimRelationshipType/GetDataDropDown_VictimRelationshipType', val).then((data) => {
            if (data) {
                setRelationShipDrp(Comman_changeArrayFormat(data, 'VictimRelationshipTypeID', 'Description'))
            } else {
                setRelationShipDrp([])
            }
        })
    }
    const CrimeBiasCategorychange = (multiSelected) => {
        setCrimeBiasCategory(multiSelected)
        const len = multiSelected.length - 1
        const selectedValues = len >= 0 ? multiSelected[len].value : null;
        if (multiSelected?.length < crimeBiasCategoryEditVal?.length) {
            let missing = null;
            let i = crimeBiasCategoryEditVal.length;
            while (i) {
                missing = (~multiSelected.indexOf(crimeBiasCategoryEditVal[--i])) ? missing : crimeBiasCategoryEditVal[i];
            }
            DelSertBasicInfo(missing.id, 'BiasCategoryID', 'OffenseBiasCategory/DeleteOffenseBiasCategory')
        } else {
            if (selectedValues) {
                InSertBasicInfo(multiSelected[len].value, 'CrimeBiasCategoryID', 'OffenseBiasCategory/InsertOffenseBiasCategory')
            }
        }
    }
    const GetRaceIdDrp = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_RaceType', val).then((data) => {
            if (data) {
                setRaceIdDrp(Comman_changeArrayFormat(data, 'RaceTypeID', 'Description'))
            } else {
                setRaceIdDrp([]);
            }
        })
    }
    // const get_Data_Victim_Drp = () => {
    //     const val = {
    //         'IncidentID': IncID,
    //         'NameID': DrpNameID,
    //     }
    //     fetchPostData('Victim/GetData_InsertVictimName', val).then((data) => {
    //         if (data) {
    //             setVictimDrp(Comman_changeArrayVictim(data, 'NameID', 'VictimID', 'Name',))
    //         } else {
    //             setVictimDrp([])
    //         }
    //     })
    // }
    // const get_Data_Name_Drp = (IncID) => {
    //     const val = {
    //         'IncidentID': IncID,
    //     }
    //     fetchPostData('NameRelationship/GetDataDropDown_OffenderName', val).then((data) => {
    //         if (data) {
    //             setName(Comman_changeArrayFormat(data, 'NameID', 'Name'))
    //         } else {
    //             setName([])
    //         }
    //     })
    // }
    const GetSexIDDrp = (LoginAgencyID) => {
        const val = { AgencyID: LoginAgencyID }
        fetchPostData('DropDown/GetData_SexType', val).then((data) => {
            if (data) {
                setSexIdDrp(Comman_changeArrayFormat(data, 'SexCodeID', 'Description'))
            } else {
                setSexIdDrp([]);
            }
        })
    }
    const get_Victim_Type_Data = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID,
        }
        fetchPostData('VictimType/GetDataDropDown_VictimType', val).then((data) => {
            if (data) {
                setVictimTypeDrp(threeColArray(data, 'VictimTypeID', 'Description', 'VictimCode'))
            } else {
                setVictimTypeDrp([]);
            }
        })
    }
    const InSertBasicInfo = (id, col1, url) => {
        const val = {
            'NameID': DrpNameID,
            'CrimeID': CrimeID,
            [col1]: id,
            'CreatedByUserFK': LoginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                col1 === 'CrimeBiasCategoryID' && get_Crime_Bias_Category_Data(CrimeID);
            } else {
                console.log("Somthing Wrong");
            }
        })
    }
    const get_Crime_Bias_Category_Data = () => {
        const val = { 'CrimeID': CrimeID, }
        fetchPostData('OffenseBiasCategory/GetData_OffenseBiasCategory', val)
            .then((res) => {
                if (res) {
                    setCrimeBiasCategoryEditVal(Comman_changeArrayFormatBasicInfo(res, 'CrimeBiasCategoryID', 'Description', 'PretendToBeID', 'BiasCategoryID', 'BiasCode'));
                }
                else {
                    setCrimeBiasCategoryEditVal([]);
                }
            })
    }

    const DelSertBasicInfo = (OffenderOffenseID, col1, url) => {
        const val = {
            [col1]: OffenderOffenseID,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate(url, val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                col1 === 'CrimeBiasCategoryID' && get_Crime_Bias_Category_Data(CrimeID);

            } else {
                console.log("Somthing Wrong");
            }
        })
    }
    const ChangeDropDown = (e, name) => {
        if (e) {
            if (name === 'FBIID') {
                getRmsCfsCodeID(loginAgencyID, e.value); setValue({ ...value, [name]: e.value, ['RMSCFSCodeID']: "", })
            } else {
                setValue({ ...value, [name]: e.value })
            }
        } else {
            if (name === 'FBIID') {
                setRmsCfsID([]); setValue({ ...value, ['FBIID']: "", ['RMSCFSCodeID']: "", })
            } else {
                setValue({ ...value, [name]: null })
            }
        }
    }
    const onChangeNameIDNum = (e) => {
        if (e) {
            if (e.target.name === 'NameIDNumber') {
                let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                if (ele.length === 10) {
                    const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                    const match = cleaned.match(/^([AJ]{1})(\d{9})$/);
                    if (match) {
                        setValue({ ...value, [e.target.name]: match[1] + '-' + match[2] })
                    }
                } else {
                    ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
                    setValue({ ...value, [e.target.name]: ele })
                }
            } else {
                setValue({ ...value, [e.target.name]: e.target.value })
            }
        } else {
            setValue({ ...value, [e.target.name]: e.target.value })
        }
    }
    // const handleRadioChange = (event) => {
    //     setSelectedOption(event.target.value);
    //     const { value: selectedOption } = event.target;
    //     setValue(prevState => ({
    //         ...prevState,
    //         IsFamily: selectedOption === 'Family',
    //         IsSexual: selectedOption === 'Sexual',
    //         IsMissing: selectedOption === 'Missing',
    //         IsHate: selectedOption === 'Hate',
    //     }));
    // };
    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
        Reset('');
    };

    // const GetmasterReportData = () => {
    //     const val = { IncidentNumber: incidentNumber }
    //     fetchPostData('HateCrimeIncidentReport/UcrSearch', val).then((data) => {
    //         if (data) {
    //             console.log(data)
    //             setMasterReportData(data)
    //         } else {
    //             setMasterReportData([])
    //         }
    //     })
    // }

    const GetFamilyReportData = async (isPrintReport = false) => {
        console.log(value);
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ChargeCodeID !== null || value?.OccurredFrom?.trim()?.length > 0 || value?.OccurredFromTo?.trim()?.length > 0 || value?.LawTitleId !== null || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.FBIID !== null || value?.CrimeLocation?.trim()?.length > 0 || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.SexID !== null || value?.RaceID !== null || value?.EthnicityID !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.RelationshipTypeID !== null || value?.PINID !== null) {
            const { IncidentNumberTo, ChargeCodeID, OccurredFrom, OccurredFromTo, LawTitleId, ReportedDate, ReportedDateTo, AgencyID, FBIID, CrimeLocation, NameIDNumber, LastName, FirstName, MiddleName, SexID, RaceID, EthnicityID, SSN, DateOfBirthTo, DateOfBirthFrom, RelationshipTypeID, IncidentNumber, PINID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID,
            } = value
            const val = {
                'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'ChargeCodeID': ChargeCodeID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'LawTitleID': LawTitleId, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'CrimeLocation': CrimeLocation, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'PINID': PINID,
                IPAddress, 'UserID': LoginPinID, SearchCriteria, SearchCriteriaJson, ReportName, Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'FamilySummaryReport/PrintFamilySummaryReportAuditLog' : 'FamilySummaryReport/GetReport_FamilyReport';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setMasterReportData(res[0]); setSearchValue(value); getAgencyImg(loginAgencyID); setLoder(false);
                }
                else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setMasterReportData([]);
                    } setLoder(false);
                }
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setLoder(false);
            }
        } else { toastifyError("Please Enter Details"); setLoder(false); }
    }

    const GetHateReportData = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.FBIID !== null || value?.CrimeLocation?.trim()?.length > 0 || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.SexID !== null || value?.RaceID !== null || value?.EthnicityID !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.RelationshipTypeID !== null || value?.CrimeBiasCategoryID !== null || value?.RMSCFSCodeID !== null || value?.LawTitleId !== null || value?.VictimTypeID !== null || value?.PINID !== null) {
            const { IncidentNumberTo, RMSCFSCodeID, LawTitleId, OccurredFrom, OccurredFromTo, ReportedDate, ReportedDateTo, AgencyID, FBIID, CrimeLocation, NameIDNumber, LastName, FirstName, MiddleName, SexID, RaceID, EthnicityID, SSN, DateOfBirthTo, DateOfBirthFrom, RelationshipTypeID, IncidentNumber, VictimTypeID, CrimeBiasCategoryID, PINID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID
            } = value
            const val = {
                'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'ChargeCodeID': RMSCFSCodeID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'ReportedDate': ReportedDate, 'LawTitleID': LawTitleId, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'CrimeLocation': CrimeLocation, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'CrimeBiasCategoryID': CrimeBiasCategoryID, 'VictimTypeID': VictimTypeID, 'PINID': PINID,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'HateCrimeIncidentReport/PrintReportHateCrimeAuditLog' : 'HateCrimeIncidentReport/HateCrimeSummaryReport';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setMasterReportData(res[0]); setSearchValue(value); getAgencyImg(loginAgencyID); setLoder(false);
                }
                else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setMasterReportData([]);
                    }
                    setLoder(false);
                }
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setLoder(false);
            }
        } else {
            toastifyError("Please Enter Details"); setLoder(false);
        }
    }
    const GetMissingReportData = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ReportingOfficerID?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.AgencyID?.trim()?.length > 0 || value?.CircumstancesID !== null || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName !== null || value?.FirstName !== null || value?.FirstName !== null || value?.MiddleName !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.CMCID !== null || value?.MissingPersonNameID !== null || value?.PINID !== null) {

            const { IncidentNumberTo, ReportingOfficerID, OccurredFrom, OccurredFromTo, ReportedDate, ReportedDateTo, AgencyID, CircumstancesID, NameIDNumber, LastName, FirstName, MiddleName, SSN, DateOfBirthTo, DateOfBirthFrom, MissingPersonNameID, IncidentNumber, CMCID, RelationshipTypeID, PINID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID
            } = value
            const val = {
                'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'CircumstancesID': CircumstancesID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'MissingPersonNameID': MissingPersonNameID, 'CMCID': CMCID, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'ReportingOfficerID': ReportingOfficerID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'PINID': PINID,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'ReportMissingPersonMissing/PrintReportMissingPersonAuditLog' : 'ReportMissingPersonMissing/GetData_ReportMissingPerson';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setMasterReportData(res[0]); setSearchValue(value); getAgencyImg(loginAgencyID); setLoder(false);
                }
                else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available"); setMasterReportData([]);
                    }
                    setLoder(false);
                }
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setLoder(false);
            }
        } else {
            toastifyError("Please Enter Details"); setLoder(false);
        }
    }
    const GetSexualReportData = async (isPrintReport = false) => {
        setLoder(true);
        if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ChargeCodeID?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.OccurredFromTo?.trim()?.length > 0 || value?.LawTitleId !== null || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.FBIID !== null || value?.CrimeLocation?.trim()?.length > 0 || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.SexID !== null || value?.RaceID !== null || value?.EthnicityID !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.RelationshipTypeID !== null || value?.PINID !== null) {
            const { IncidentNumberTo, ChargeCodeID, OccurredFrom, OccurredFromTo, LawTitleId, ReportedDate, ReportedDateTo, AgencyID, FBIID, CrimeLocation, NameIDNumber, LastName, FirstName, MiddleName, SexID, RaceID, EthnicityID, SSN, DateOfBirthTo, DateOfBirthFrom, RelationshipTypeID, IncidentNumber, PINID, IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, ModuleName, ModuleID
            } = value
            const val = {
                'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'ChargeCodeID': ChargeCodeID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'LawTitleID': LawTitleId, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'CrimeLocation': CrimeLocation, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'PINID': PINID,
                IPAddress, UserID, SearchCriteria, SearchCriteriaJson, ReportName, Status, 'ModuleName': effectiveScreenPermission[0]?.ScreenCode1, 'ModuleID': effectiveScreenPermission[0]?.ModuleFK,
            }
            try {
                const apiUrl = isPrintReport ? 'ReportSexualAssualt/PrintReportSexualAssualtAuditLog' : 'ReportSexualAssualt/GetReport_ReportSexualAssualt';
                const res = await fetchPostData(apiUrl, val);
                if (res.length > 0) {
                    setMasterReportData(res[0]); setSearchValue(value); getAgencyImg(loginAgencyID); setLoder(false);
                }
                else {
                    if (!isPrintReport) {
                        toastifyError("Data Not Available");
                        setMasterReportData([]);
                    }
                    setLoder(false);
                }
            } catch (error) {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                }
                setLoder(false);
            }
        } else {
            toastifyError("Please Enter Details"); setLoder(false);
        }
    }

    // const GetmasterReportData = async () => {
    //     if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ChargeCodeID !== null || value?.OccurredFrom?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.FBIID !== null || value?.CrimeLocation?.trim()?.length > 0 || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.SexID !== null || value?.RaceID !== null || value?.EthnicityID !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.RelationshipTypeID !== null || value?.Officer_Name !== null) {
    //         const { IncidentNumberTo, ChargeCodeID, OccurredFrom, OccurredFromTo, ReportedDate, ReportedDateTo, AgencyID, FBIID, CrimeLocation, NameIDNumber, LastName, FirstName, MiddleName, SexID, RaceID, EthnicityID, SSN, DateOfBirthTo, DateOfBirthFrom, RelationshipTypeID, IncidentNumber, Officer_Name,
    //         } = value
    //         const val = {
    //             'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'ChargeCodeID': ChargeCodeID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'CrimeLocation': CrimeLocation, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'Officer_Name': Officer_Name,
    //         }
    //         fetchPostData('FamilySummaryReport/GetReport_FamilyReport', val).then((res) => {
    //             if (res.length > 0) {
    //                 console.log(res)
    //                 setMasterReportData(res[0]);
    //                 setSearchValue(value);
    //                 getAgencyImg(loginAgencyID)

    //             } else {
    //                 setMasterReportData([])
    //                 toastifyError("Data Not Available");
    //             }
    //         })
    //     }
    //     else {
    //         toastifyError("Please Enter Details");
    //     }
    // }
    // const GetmasterReportData = async () => {
    //     if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ChargeCodeID?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.FBIID !== null || value?.CrimeLocation?.trim()?.length > 0 || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.SexID !== null || value?.RaceID !== null || value?.EthnicityID !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.RelationshipTypeID !== null || value?.Officer_Name !== null) {
    //         const { IncidentNumberTo, ChargeCodeID, OccurredFrom, OccurredFromTo, ReportedDate, ReportedDateTo, AgencyID, FBIID, CrimeLocation, NameIDNumber, LastName, FirstName, MiddleName, SexID, RaceID, EthnicityID, SSN, DateOfBirthTo, DateOfBirthFrom, RelationshipTypeID, IncidentNumber, Officer_Name,
    //         } = value
    //         const val = {
    //             'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'ChargeCodeID': ChargeCodeID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'CrimeLocation': CrimeLocation, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'Officer_Name': Officer_Name,
    //         }
    //         fetchPostData('HateCrimeIncidentReport/HateCrimeSummaryReport', val).then((res) => {
    //             if (res.length > 0) {
    //                 console.log(res)

    //                 setMasterReportData(res[0]);
    //                 setSearchValue(value);
    //                 getAgencyImg(loginAgencyID)

    //             } else {
    //                 setMasterReportData([])
    //                 toastifyError("Data Not Available");
    //             }
    //         });
    //     }
    // }

    // const GetmasterReportData = async () => {
    //     if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ChargeCodeID?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.FBIID !== null || value?.CrimeLocation?.trim()?.length > 0 || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName?.trim()?.length > 0 || value?.FirstName?.trim()?.length > 0 || value?.MiddleName?.trim()?.length > 0 || value?.SexID !== null || value?.RaceID !== null || value?.EthnicityID !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.RelationshipTypeID !== null || value?.Officer_Name !== null) {
    //         const { IncidentNumberTo, ChargeCodeID, OccurredFrom, OccurredFromTo, ReportedDate, ReportedDateTo, AgencyID, FBIID, CrimeLocation, NameIDNumber, LastName, FirstName, MiddleName, SexID, RaceID, EthnicityID, SSN, DateOfBirthTo, DateOfBirthFrom, RelationshipTypeID, IncidentNumber, Officer_Name,
    //         } = value
    //         const val = {
    //             'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'ChargeCodeID': ChargeCodeID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'FBIID': FBIID, 'CrimeLocation': CrimeLocation, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'Officer_Name': Officer_Name,
    //         }
    //         fetchPostData('ReportSexualAssualt/GetReport_ReportSexualAssualt', val).then((res) => {
    //             if (res.length > 0) {
    //                 console.log(res)
    //                 setMasterReportData(res[0]);
    //                 setSearchValue(value);
    //                 getAgencyImg(loginAgencyID)
    //             } else {
    //                 setMasterReportData([])
    //                 toastifyError("Data Not Available");
    //             }
    //         });
    //     }
    // }

    // const GetmasterReportData = async () => {
    //     if (value?.ReportedDate?.trim()?.length > 0 || value?.IncidentNumberTo?.trim()?.length > 0 || value?.ReportingOfficerID?.trim()?.length > 0 || value?.OccurredFrom?.trim()?.length > 0 || value?.IncidentNumber?.trim()?.length > 0 || value?.ReportedDateTo?.trim()?.length > 0 || value?.AgencyID?.trim()?.length > 0 || value?.CircumstancesID !== null || value?.NameIDNumber?.trim()?.length > 0 || value?.LastName !== null || value?.FirstName !== null || value?.FirstName !== null || value?.MiddleName !== null || value?.SSN?.trim()?.length > 0 || value?.DateOfBirthTo?.trim()?.length > 0 || value?.DateOfBirthFrom?.trim()?.length > 0 || value?.CMCID !== null || value?.MissingPersonNameID !== null || value?.Officer_Name !== null) {

    //         const { IncidentNumberTo, ReportingOfficerID, OccurredFrom, OccurredFromTo, ReportedDate, ReportedDateTo, AgencyID, CircumstancesID, NameIDNumber, LastName, FirstName, MiddleName, SSN, DateOfBirthTo, DateOfBirthFrom, MissingPersonNameID, IncidentNumber, CMCID, RelationshipTypeID, Officer_Name
    //         } = value
    //         const val = {
    //             'IncidentNumberTo': IncidentNumberTo, 'IncidentNumber': IncidentNumber, 'CircumstancesID': CircumstancesID, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'AgencyID': loginAgencyID, 'MissingPersonNameID': MissingPersonNameID, 'CMCID': CMCID, "NameIDNumber": NameIDNumber, 'LastName': LastName, 'FirstName': FirstName, 'MiddleName': MiddleName, 'ReportingOfficerID': ReportingOfficerID, 'SSN': SSN, 'DateOfBirthTo': DateOfBirthTo, 'DateOfBirthFrom': DateOfBirthFrom, 'RelationshipTypeID': RelationshipTypeID, 'Officer_Name': Officer_Name,
    //         }
    //         fetchPostData('ReportMissingPersonMissing/GetData_ReportMissingPerson', val).then((res) => {
    //             if (res.length > 0) {
    //                 console.log(res)

    //                 setMasterReportData(res[0]);
    //                 setSearchValue(value);
    //                 getAgencyImg(loginAgencyID)

    //             } else {
    //                 setMasterReportData([])
    //                 toastifyError("Data Not Available");
    //             }
    //         });
    //     }
    // }

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.log("errror") }
        })
    }
    //----Reset--------------------
    const Reset = () => {
        setValue({
            ...value,
            IncidentNumberTo: '', IncidentNumber: '', ChargeCodeID: '', OccurredFrom: '', OccurredFromTo: '', ReportedDate: '', ReportedDateTo: '', AgencyID: '', FBIID: '', CrimeLocation: '', NameIDNumber: '', LastName: '', FirstName: '', MiddleName: '', SexID: '', RaceID: '', EthnicityID: '', SSN: '', DateOfBirthTo: '', DateOfBirthFrom: '', RelationshipTypeID: '', MissingPersonNameID: '', CMCID: '', CircumstancesID: '', PINID: '', ReportingOfficerID: '', RMSCFSCodeID: '', LawTitleId: '',
        }); setMasterReportData(''); setSelectedStatus(false); setMasterReportData(''); setMasterReportData(''); setMasterReportData(''); setShowWatermark('')
    }

    // const columns = [
    //     {
    //         name: 'Incident Number', selector: (row) => row.IncidentNumber, sortable: true
    //     },
    //     {
    //         name: 'Reported Date',
    //         selector: (row) => getShowingDateText(row.ReportedDate),

    //         sortable: true
    //     },

    //     {
    //         name: 'Occurred From',
    //         // selector: (row) => row.OccurredFrom,
    //         selector: (row) => getShowingDateText(row.OccurredFrom),

    //         sortable: true
    //     },
    //     {
    //         name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Print</p>,
    //         cell: row =>
    //             <div style={{ position: 'absolute', top: 4, right: 10 }}>
    //                 <span to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //                     <i className="fa fa-print"></i>
    //                 </span>

    //             </div>
    //     }
    // ]

    function filterArray(arr, key) {
        return [...new Map(arr?.map(item => [item[key], item])).values()]
    }
    // const componentRef = useRef();

    // const printForm = useReactToPrint({
    //     content: () => componentRef.current,
    //     documentTitle: 'Data',
    //     onAfterPrint: () => setSelectedStatus(false),
    // })
    // useEffect(() => {
    //     if (selectedStatus) {
    //         printForm();
    //     }
    // }, [selectedStatus]);

    // const handleShowReport = () => {
    //     if (selectedOption === 'Missing') {
    //         GetmasterReportData();
    //     } else {
    //         GetmasterReportData();
    //     }
    //     setSelectedStatus(true);
    // };

    const handleShowReport = (status) => {
        if (selectedOption === 'Missing') {
            GetMissingReportData(status);
        }
        else if (selectedOption === 'Hate') {
            GetHateReportData(status);

        }
        else if (selectedOption === 'Sexual') {
            GetSexualReportData(status);
        }
        else {
            GetFamilyReportData(status);
        }
        setSelectedStatus(true);
    };




    //--------------------------------------------//-----------------------------------------------
    const onChangeNIBRSCode = (e, name) => {
        if (e) {
            if (name === "FBIID") {
                // console.log('call');
                if (
                    (e.id === "09C" ||
                        e.id === "360" ||
                        e.id === "09A" ||
                        e.id === "09B" ||
                        e.id === "13A" ||
                        e.id === "13B" ||
                        e.id === "13C")
                ) {
                    // setNibrsCode(e.id);
                    setValue({
                        ...value,
                        ["FBIID"]: e.value,
                        ["RMSCFSCodeID"]: null,
                        AttemptComplete: "C",
                        IsGangInfo: null,
                    });
                    setChargeCodeDrp([]);
                    // NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
                    getRMSCFSCodeListDrp(loginAgencyID, e.value, value?.LawTitleId);
                } else {
                    // setNibrsCode(e.id);
                    setValue({
                        ...value,
                        ["FBIID"]: e.value,
                        ["RMSCFSCodeID"]: null,
                    });
                    setChargeCodeDrp([]);
                    // NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
                    getRMSCFSCodeListDrp(loginAgencyID, e.value, value?.LawTitleId);
                }
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "FBIID") {
                setValue({
                    ...value,
                    [name]: null,
                    ["RMSCFSCodeID"]: null,
                    ["CrimeMethodOfEntryID"]: null,
                    IsGangInfo: null,
                });

                NIBRSCodeDrpDwnVal(loginAgencyID, value?.LawTitleId);
                getRMSCFSCodeListDrp(loginAgencyID, null, value?.LawTitleId);
                // nibrs Errors States
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
        const lawTitleObj = { AgencyID: loginAgencyID, ChargeCodeID: RMSCFSCodeID };
        const nibrsCodeObj = { AgencyID: loginAgencyID, LawTitleID: null, IncidentID: mainIncidentID, ChargeCodeID: RMSCFSCodeID, };
        try {
            const [lawTitleResponse, nibrsCodeResponse] = await Promise.all([
                fetchPostData("LawTitle/GetDataDropDown_LawTitle", lawTitleObj),
                fetchPostData("FBICodes/GetDataDropDown_FBICodes", nibrsCodeObj),
            ]);
            const lawTitleArr = Comman_changeArrayFormat(lawTitleResponse, "LawTitleID", "Description");
            const nibrsArr = threeColArrayWithCode(nibrsCodeResponse, "FBIID", "Description", "FederalSpecificFBICode");
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
            AgencyID: loginAgencyID,
            FBIID: FBIID,
            LawTitleID: LawTitleId,
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
        const val = { AgencyID: loginAgencyID, ChargeCodeID: RMSCFSCodeID };
        await fetchPostData("LawTitle/GetDataDropDown_LawTitle", val).then(
            (data) => {
                if (data) {
                    setLawTitleIdDrp(
                        Comman_changeArrayFormat(data, "LawTitleID", "Description")
                    );
                } else {
                    setLawTitleIdDrp([]);
                }
            }
        );
    };


    const NIBRSCodeDrpDwnVal = (loginAgencyID, LawTitleID, mainIncidentID) => {
        const val = {
            AgencyID: loginAgencyID,
            LawTitleID: LawTitleID ? LawTitleID : null,
            IncidentID: mainIncidentID,
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
                    ...value,
                    ["LawTitleId"]: e.value,
                    ["FBIID"]: null,
                    ["RMSCFSCodeID"]: null,
                });
                setChargeCodeDrp([]);
                setNibrsCodeDrp([]);
                // nibrs code
                NIBRSCodeDrpDwnVal(loginAgencyID, e.value);
                // charge code
                getRMSCFSCodeListDrp(loginAgencyID, value?.FBIID, e.value);
            } else if (name === "RMSCFSCodeID") {
                const res = await getLawTitleNibrsByCharge(
                    loginAgencyID,
                    value?.LawTitleId,
                    e.value
                );
            } else {
                setValue({ ...value, [name]: e.value });
            }
        } else {
            if (name === "LawTitleId") {
                setValue({
                    ...value,
                    ["LawTitleId"]: null,
                    ["FBIID"]: "",
                    ["RMSCFSCodeID"]: null,
                });
                setNibrsCodeDrp([]);
                setChargeCodeDrp([]);
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



    return (
        <>
            <div class="section-body view_page_design pt-1">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <fieldset style={{ marginTop: '-15px' }}>
                                    <legend>State Report</legend>
                                    <div className="form-check ml-2 col-9 col-md-9 col-lg-12 mt-1 pt-1 text-right">
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
                                    <div className="row">
                                        <div className='col-12'>
                                            <div className="row mt-2">
                                                <div className="form-check col-6 col-md-6 col-lg-3 ml-lg-5 pl-lg-5 pl-md-0 ml-md-0">
                                                    <input className="form-check-input" value="Family" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                                                        //  checked={value?.IsFamily}
                                                        checked={selectedOption === 'Family'}
                                                        onChange={handleRadioChange} />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                        Family Violence
                                                    </label>
                                                </div>
                                                <div className="form-check  col-6 col-md-6 col-lg-3">
                                                    <input className="form-check-input" type="radio" value="Sexual" name="flexRadioDefault" id="flexRadioDefault2" checked={value?.IsSexual} onChange={handleRadioChange} />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                        Sexual Assault
                                                    </label>
                                                </div>
                                                <div className="form-check  col-6 col-md-6 col-lg-3">
                                                    <input className="form-check-input"
                                                        type="radio"
                                                        value="Missing"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault3"
                                                        onChange={handleRadioChange}
                                                        checked={selectedOption === 'Missing'}
                                                    // checked={value?.IsMissing}
                                                    />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault3">
                                                        Missing Person
                                                    </label>
                                                </div>

                                                <div className="form-check  col-6 col-md-6 col-lg-2">
                                                    <input className="form-check-input" type="radio" value="Hate" name="flexRadioDefault" id="flexRadioDefault4" checked={value?.IsHate} onChange={handleRadioChange} />
                                                    <label className="form-check-label" htmlFor="flexRadioDefault4">
                                                        Hate Crime
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Incident Number From</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1 ">
                                                <input type="text" name='IncidentNumber' id='IncidentNumber' value={value.IncidentNumber} onChange={handleChange} className='' />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Incident Number To</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 text-field mt-1 ">
                                                <input type="text" name='IncidentNumberTo'
                                                    disabled={value?.IncidentNumber?.trim() ? false : true}
                                                    className={!value?.IncidentNumber?.trim() && 'readonlyColor'}
                                                    id='IncidentNumberTo' value={value.IncidentNumberTo} onChange={handleChange} />
                                            </div>
                                            {selectedOption == 'Missing' ?
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                                                        <label htmlFor="" className='new-label px-0'>Missing&nbsp;Person</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3  mt-1 ">
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
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2 px-0">
                                                        <label htmlFor="" className='new-label px-0'>Circumstances</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-5  mt-1 ">
                                                        <Select
                                                            styles={customStylesWithOutColor}
                                                            name="CircumstancesID"
                                                            value={circumstancesDrpData?.filter((obj) => obj.value === value?.CircumstancesID)}
                                                            options={circumstancesDrpData}
                                                            onChange={(e) => { ChangeDropDown(e, 'CircumstancesID') }}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" defaultValue id="flexCheckDefault" />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                DNA
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                                                        <label htmlFor="" className='new-label px-0'>CMC</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                                        <Select
                                                            styles={customStylesWithOutColor}
                                                            name="CMCID"
                                                            value={missingCMCDrpData?.filter((obj) => obj.value === value?.CMCID)}
                                                            options={missingCMCDrpData}
                                                            onChange={(e) => { ChangeDropDown(e, 'CMCID') }}
                                                            isClearable
                                                            placeholder="Select..."
                                                        />
                                                    </div>

                                                </>
                                                :
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                                        <label htmlFor="" className='new-label'>Location</label>
                                                    </div>
                                                    <div className="col-9 col-md-9 col-lg-3 mt-1 text-field">
                                                        <input type="text" name='CrimeLocation' value={value?.CrimeLocation} onChange={handleChange} id='CrimeLocation'
                                                            className={selectedOption === null || selectedOption === '' || selectedOption === 'Missing' ? 'readonlyColor' : ''}
                                                            disabled={selectedOption === null || selectedOption === '' || selectedOption === 'Missing'}
                                                        />
                                                    </div>
                                                </>
                                            }
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Reported From Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2">
                                                <DatePicker
                                                    name='ReportedDate'
                                                    id='ReportedDate'
                                                    ref={startRef}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => {
                                                        if (date) {
                                                            setValue({ ...value, ['ReportedDate']: getShowingDateText(date) });
                                                        } else {
                                                            setValue({ ...value, ['ReportedDate']: null, ['ReportedDateTo']: null });
                                                        }
                                                    }}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    selected={value?.ReportedDate && new Date(value?.ReportedDate)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    isClearable={!!value?.ReportedDate}
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='off'
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select...'
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Reported To Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2">
                                                <DatePicker
                                                    name='ReportedDateTo'
                                                    id='ReportedDateTo'
                                                    onChange={(date) => { setValue({ ...value, ['ReportedDateTo']: date ? getShowingDateText(date) : null }) }}
                                                    selected={value?.ReportedDateTo && new Date(value?.ReportedDateTo)}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    ref={startRef1}
                                                    onKeyDown={onKeyDown}
                                                    isClearable={value?.ReportedDateTo ? true : false}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    // peekNextMonth
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    dropdownMode="select"
                                                    autoComplete='Off'
                                                    // disabled={value?.ReportedDate ? false : true}
                                                    maxDate={new Date(datezone)}
                                                    placeholderText='Select...'
                                                    minDate={new Date(value?.ReportedDate)}
                                                    disabled={value?.ReportedDate ? false : true}
                                                    className={!value?.ReportedDate && 'readonlyColor'}
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                                <label htmlFor="" className='new-label'>Officer</label>
                                            </div>
                                            <div className="col-9 col-md-9 col-lg-3 mt-1">
                                                <Select
                                                    styles={customStylesWithOutColor}
                                                    name='PINID'
                                                    value={headOfAgency?.filter((obj) => obj.value === value?.PINID)}
                                                    isClearable
                                                    options={headOfAgency}
                                                    onChange={(e) => ChangeDropDown(e, 'PINID')}
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Occurred From Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2">
                                                <DatePicker
                                                    name='OccurredFrom'
                                                    id='OccurredFrom'
                                                    ref={startRef2}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => {
                                                        if (date) {
                                                            setValue({ ...value, ['OccurredFrom']: date ? getShowingDateText(date) : null })
                                                        } else {
                                                            setValue({ ...value, ['OccurredFrom']: null, ['OccurredTo']: null })
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
                                            <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                <label htmlFor="" className='new-label'>Occurred To Date</label>
                                            </div>
                                            <div className="col-3 col-md-3 col-lg-2">
                                                <DatePicker
                                                    id='OccurredTo'
                                                    name='OccurredTo'
                                                    ref={startRef3}
                                                    onKeyDown={onKeyDown}
                                                    onChange={(date) => { setValue({ ...value, ['OccurredTo']: date ? getShowingMonthDateYear(date) : null }) }}
                                                    dateFormat="MM/dd/yyyy"
                                                    isClearable={value?.OccurredTo ? true : false}
                                                    disabled={value?.OccurredFrom ? false : true}
                                                    selected={value?.OccurredTo && new Date(value?.OccurredTo)}
                                                    minDate={new Date(value?.OccurredFrom)}
                                                    onChangeRaw={(e) => {
                                                        const formatted = formatRawInput(e.target.value);
                                                        e.target.value = formatted;
                                                    }}
                                                    maxDate={new Date(datezone)}
                                                    placeholderText={'Select...'}
                                                    showDisabledMonthNavigation
                                                    autoComplete="off"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    className={!value?.OccurredFrom && 'readonlyColor'}
                                                />
                                            </div>
                                        </div>
                                        {selectedOption !== 'Missing' && (
                                            <div className="col-12">
                                                <div className="row">

                                                    <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                                                        <label htmlFor="" className='new-label'> Law Title</label>
                                                    </div>
                                                    <div className="col-7 col-md-7 col-lg-2  mt-2">
                                                        <Select
                                                            name="LawTitleId"
                                                            value={lawTitleIdDrp?.filter((obj) => obj.value === value?.LawTitleId)}
                                                            options={lawTitleIdDrp}
                                                            isClearable
                                                            onChange={(e) => onChangeDrpLawTitle(e, "LawTitleId")}
                                                            placeholder="Select..."
                                                        />
                                                    </div>
                                                    <div className="col-4 col-md-4 col-lg-5 mt-2 pt-1">
                                                        <label htmlFor="" className="new-label text-nowrap" >   TIBRS Code
                                                            <br />
                                                        </label>
                                                    </div>

                                                    <div className="col-7 col-md-7 col-lg-3 mt-2">
                                                        <Select
                                                            name="FBIID"
                                                            styles={colourStyles}
                                                            value={nibrsCodeDrp?.filter((obj) => obj.value === value?.FBIID)}
                                                            options={filteredOptions.length > 0 ? filteredOptions : nibrsCodeDrp}
                                                            onInputChange={handleInputChange}
                                                            isClearable
                                                            onChange={(e) => onChangeNIBRSCode(e, "FBIID")}
                                                            placeholder="Select..."
                                                        />
                                                    </div>

                                                    <div className="col-4 col-md-4 col-lg-2 mt-2 pt-1">
                                                        <label htmlFor="" className='new-label'>Offense Code/Name</label>
                                                        <br />
                                                    </div>
                                                    <div className="col-7 col-md-7 col-lg-10  mt-2">
                                                        <Select
                                                            name="RMSCFSCodeID"
                                                            styles={colourStyles}
                                                            value={chargeCodeDrp?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                            isClearable
                                                            options={chargeCodeDrp}
                                                            onChange={(e) => onChangeDrpLawTitle(e, "RMSCFSCodeID")}
                                                            placeholder="Select..."
                                                        />
                                                    </div>

                                                    {/* <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                        <label htmlFor="" className='new-label'> NIBRS Codedfdsf</label>
                                                    </div>
                                                    <div className="col-9 col-md-9 col-lg-4 mt-1">
                                                        <Select
                                                            name='FBIID'
                                                            value={NIBRSDrpData?.filter((obj) => obj.value === value?.FBIID)}
                                                            isClearable
                                                            options={NIBRSDrpData}
                                                            onChange={(e) => ChangeDropDown(e, 'FBIID')}
                                                            placeholder="Select..."
                                                            className={selectedOption === null || selectedOption === '' || selectedOption === 'Missing' ? 'readonlyColor' : ''}
                                                            styles={selectedOption === null || selectedOption === '' || selectedOption === 'Missing' ? 'readonlyColor' : customStylesWithOutColor}
                                                            isDisabled={selectedOption === null || selectedOption === '' || selectedOption === 'Missing'}
                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                        <label htmlFor="" className='new-label'>Offense Code/Name</label>
                                                    </div>
                                                    <div className="col-9 col-md-9 col-lg-4 mt-1">
                                                        <Select
                                                            name='RMSCFSCodeID'
                                                            styles={selectedOption === null || selectedOption === '' || selectedOption === 'Missing' ? 'readonlyColor' : customStylesWithOutColor}
                                                            // isDisabled={selectedOption === null || selectedOption === '' || selectedOption === 'Missing'}
                                                            value={rmsCfsID?.filter((obj) => obj.value === value?.RMSCFSCodeID)}
                                                            isClearable
                                                            options={rmsCfsID}
                                                            onChange={(e) => ChangeDropDown(e, 'RMSCFSCodeID')}
                                                            placeholder="Select..."
                                                            isDisabled={!value?.FBIID}
                                                            className={!value?.FBIID ? 'readonlyColor' : ''}
                                                        />
                                                    </div> */}
                                                </div>
                                            </div>
                                        )}


                                        {selectedOption == 'Hate' && (
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                        <label htmlFor="" className='new-label'>Bais</label>
                                                    </div>
                                                    <div className="col-9 col-md-9 col-lg-4 mt-1">
                                                        <SelectBox
                                                            className="basic-multi-select"
                                                            name='CrimeBiasCategoryID'
                                                            options={crimeBiasCategoryDrp}
                                                            isClearable={false}
                                                            styles={customStylesWithOutColor}
                                                            // isDisabled={disabled}
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            hideSelectedOptions={true}
                                                            components={{ MultiValue, }}
                                                            onChange={(e) => CrimeBiasCategorychange(e)}

                                                            // value={crimeBiasCategory}
                                                            value={filterArray(crimeBiasCategory, 'label')}
                                                            placeholder='Select Bias From List'
                                                        // isDisabled={!isCrimeIDSelected} // Disable when CrimeID is not selected

                                                        />
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2 ">
                                                        <label htmlFor="" className='new-label'>Vicitm Type</label>
                                                    </div>
                                                    <div className="col-9 col-md-9 col-lg-4 mt-1">
                                                        <Select
                                                            name='VictimTypeID'
                                                            value={victimTypeDrp?.filter((obj) => obj.value === value?.VictimTypeID)}
                                                            isClearable
                                                            options={victimTypeDrp}
                                                            onChange={(e) => { ChangeDropDown(e, 'VictimTypeID'); }}
                                                            placeholder="Select.."
                                                        // ref={SelectedValue}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Name Information</legend>
                                    <div className="row mt-1">
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>MNI</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='NameIDNumber' maxLength={11} value={value?.NameIDNumber} onChange={onChangeNameIDNum} id='NameIDNumber' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-5 mt-2 ">
                                            <label htmlFor="" className='new-label'>SSN</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='SSN' value={value?.SSN} onChange={handlChange} id='SSN' maxLength={9} className='' />
                                        </div>

                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Last Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='LastName' value={value?.LastName} onChange={handlChange} id='LastName' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>First Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='FirstName' value={value?.FirstName} onChange={handlChange} id='FirstName' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 px-0">
                                            <label htmlFor="" className='new-label px-0'>Middle&nbsp;Name</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 text-field mt-1 ">
                                            <input type="text" name='MiddleName' value={value?.MiddleName} onChange={handlChange} id='MiddleName' className='' />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Gender</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
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
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Race</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
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
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Ethnicity</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  mt-1 ">
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
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>DOB From</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  ">
                                            <DatePicker
                                                id='DateOfBirthFrom'
                                                name='DateOfBirthFrom'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => setValue({ ...value, ['DateOfBirthFrom']: date ? getShowingWithOutTime(date) : "", ['DateOfBirthTo']: date ? value.DateOfBirthTo : null })}
                                                isClearable={value.DateOfBirthFrom ? true : false}
                                                selected={value?.DateOfBirthFrom && new Date(value.DateOfBirthFrom)}
                                                placeholderText={'Select...'}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                // dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date(datezone)}
                                                dropdownMode="select"
                                            />
                                        </div>

                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>DOB To</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3  ">
                                            <DatePicker
                                                id='DateOfBirthTo'
                                                name='DateOfBirthTo'
                                                dateFormat="MM/dd/yyyy"
                                                onChange={(date) => setValue({ ...value, ['DateOfBirthTo']: date ? getShowingWithOutTime(date) : "" })}
                                                isClearable={value.DateOfBirthTo ? true : false}
                                                selected={value?.DateOfBirthTo && new Date(value.DateOfBirthTo)}
                                                placeholderText={'Select...'}
                                                onChangeRaw={(e) => {
                                                    const formatted = formatRawInput(e.target.value);
                                                    e.target.value = formatted;
                                                }}
                                                // peekNextMonth
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                autoComplete='Off'
                                                maxDate={new Date(datezone)}
                                                disabled={value?.DateOfBirthFrom ? false : true}
                                                className={!value?.DateOfBirthFrom && 'readonlyColor'}
                                            />
                                        </div>
                                        {selectedOption == 'Missing' && (
                                            <>
                                                <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                                    <label htmlFor="" className='new-label'>Hair Color</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-1 ">
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
                                                {/* <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                                    <label htmlFor="" className='new-label'>Skin Color</label>
                                                </div>
                                                <div className="col-3 col-md-3 col-lg-3  mt-1 ">
                                                    <Select
                                                        name='EthnicityID'
                                                        value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                        options={ethinicityDrpData}
                                                        onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                        isClearable
                                                        placeholder="Select..."
                                                        styles={customStylesWithOutColor}
                                                    />
                                                </div> */}
                                            </>
                                        )}
                                    </div>
                                </fieldset>
                                {/* <fieldset>
                                    <legend>Relationship</legend>
                                    <div className="row mt-1">
                                        <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                            <label htmlFor="" className='new-label'>Victim</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4  mt-1 ">
                                            <Select
                                                name='SexID'
                                                value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                options={sexIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={selectedOption === null || selectedOption === 'Hate' || selectedOption === 'Missing' ? 'readonlyColor' : customStylesWithOutColor}
                                                isDisabled={selectedOption === null || selectedOption === 'Hate' || selectedOption === 'Missing'}
                                            />
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                            <label htmlFor="" className='new-label'>Offender</label>
                                        </div>
                                        <div className="col-3 col-md-3 col-lg-4  mt-1 ">
                                            <Select
                                                name='RaceID'
                                                value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                options={raceIdDrp}
                                                onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                isClearable
                                                placeholder="Select..."
                                                styles={selectedOption === null || selectedOption === 'Hate' || selectedOption === 'Missing' ? 'readonlyColor' : customStylesWithOutColor}
                                                isDisabled={selectedOption === null || selectedOption === 'Hate' || selectedOption === 'Missing'}
                                            />
                                        </div>
                                    </div>
                                </fieldset> */}
                                {
                                    selectedOption == 'Sexual' || selectedOption == 'Family' ?
                                        <>
                                            <fieldset>
                                                <legend>Relationship</legend>
                                                <div className="row mt-1">
                                                    <div className="col-3 col-md-3 col-lg-1 mt-2 ">
                                                        <label htmlFor="" className='new-label'>Relationship</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4  mt-1 ">
                                                        <Select
                                                            name='RelationshipTypeID'
                                                            styles={colourStyles}
                                                            isClearable
                                                            value={relationShipDrp?.filter((obj) => obj.value === value.RelationshipTypeID)}
                                                            options={relationShipDrp}
                                                            onChange={(e) => { ChangeDropDown(e, 'RelationshipTypeID'); }}
                                                            placeholder="Select.."
                                                        />
                                                    </div>

                                                </div>
                                            </fieldset>

                                        </>
                                        : <></>
                                }
                            </div>

                            <div className="col-12 col-md-12 col-lg-12 mt-2 pt-1 text-right mb-2">
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { handleShowReport(false); }} >Show Report</button>
                                        : <></> :
                                        <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { handleShowReport(false); }} >Show Report</button>
                                }
                                <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { Reset(); }}>Clear</button>
                                <Link to={'/Reports'}>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                </Link>
                            </div>

                            {/* <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                               
                                <button
                                    className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                    onClick={handleShowReport}
                                >
                                    Show Report
                                </button>
                                <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" onClick={() => { Reset(); }} >Clear</button>
                                <Link to={'/Reports'}>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2" >Close</button>
                                </Link>
                            </div> */}


                        </div>
                        {/* <div className="col-12 pt-1">
                            <DataTable
                                dense
                                data={masterReportData}
                                columns={columns}
                                selectableRowsHighlight
                                highlightOnHover
                                responsive
                                fixedHeaderScrollHeight='170px'
                                // conditionalRowStyles={conditionalRowStyles}
                                fixedHeader
                                customStyles={tableCustomStyles}
                                persistTableHead={true}
                            />
                        </div> */}
                    </div>
                </div>
            </div>
            {selectedOption === 'Family' && selectedStatus && (
                <FamilyViolenceReport  {...{ selectedStatus, showWatermark, setShowWatermark, setSelectedStatus, masterReportData, setMasterReportData, showFields, searchValue, multiImage, rmsCfsID, GetFamilyReportData }} />
            )}
            {selectedOption === 'Missing' && selectedStatus && (
                <MissingPersonReport  {...{ selectedStatus, setSelectedStatus, showWatermark, setShowWatermark, setMasterReportData, masterReportData, multiImage, GetMissingReportData }} />
            )}
            {selectedOption === 'Sexual' && selectedStatus && (
                <SexualAssaultReport  {...{ selectedStatus, setSelectedStatus, showWatermark, setShowWatermark, setMasterReportData, masterReportData, multiImage, GetSexualReportData }} />
            )}
            {selectedOption === 'Hate' && selectedStatus && (
                <HateReport  {...{ selectedStatus, setSelectedStatus, setMasterReportData, showWatermark, setShowWatermark, masterReportData, multiImage, GetHateReportData }} />
            )}
            {loder && (
                <div className="loader-overlay">
                    <Loader />
                </div>
            )}
        </>
    )
}

export default StateReport