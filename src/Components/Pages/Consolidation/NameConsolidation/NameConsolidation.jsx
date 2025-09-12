import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../../Common/Utility';
import DataTable from 'react-data-table-component';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData, get_NameTypeData } from '../../../../redux/actions/Agency';
import { Comman_changeArrayFormat } from '../../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../Common/AlertMsg';
import axios from 'axios';
import { error } from 'pdf-lib';
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction';


const NameConsolidation = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [selectedOption, setSelectedOption] = useState('person');
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [businessTypeDrp, setBusinessTypeDrp] = useState([]);
    const [loginPinID, setLoginPinID] = useState();
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [primarySearchData, setPrimarySearchData] = useState([]);
    const [secondarySearchData, setSecondarySearchData] = useState([]);
    const [toggleClear, setToggleClear] = useState(false);
    const [selectionLocked, setSelectionLocked] = useState(false);
    const [primaryNameSelectCount, setPrimaryNameSelect] = useState([]);
    const [secondaryNameSelectCount, setSecondaryNameSelectCount] = useState([]);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [sameAsPrimaryCheck, setSameAsPrimaryCheck] = useState(false);
    const [selectedPrimaryRows, setSelectedPrimaryRows] = useState([]);


    const nameTypeData = useSelector((state) => state.Agency.nameTypeData);

    const [value, setValue] = useState({
        NameIDNumber: '', LastName: '', MiddleName: '', FirstName: '', SSN: '', SexID: '', RaceID: '', EthnicityID: '', DateOfBirth: '', AgencyID: '', ConMerge: 'Con', FBI: '',
        //Businsess Type
        BusinessTypeID: '', Contact: '', FaxNumber: '',
        //not in use
        NameTypeID: '', NameReasonCodeID: '', SuffixID: '', DateOfBirthFrom: '', DateOfBirthTo: '', HairColorID: '', EyeColorID: '', WeightFrom: '', WeightTo: '',
        SMTTypeID: '', SMTLocationID: '', SMT_Description: '', IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', HeightFrom: '', HeightTo: '',
    })

    const [secondvalue, setsecondValue] = useState({
        NameIDNumber: '', LastName: '', MiddleName: '', FirstName: '', SSN: '', SexID: '', RaceID: '', EthnicityID: '', DateOfBirth: '', AgencyID: '', FBI: '',
        //Businsess Type
        BusinessTypeID: '', Contact: '', FaxNumber: '',

        //not in use
        NameTypeID: '', NameReasonCodeID: '', SuffixID: '', DateOfBirthFrom: '', DateOfBirthTo: '', HairColorID: '', EyeColorID: '', WeightFrom: '', WeightTo: '',
        SMTTypeID: '', SMTLocationID: '', SMT_Description: '', IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', HeightFrom: '', HeightTo: '',
    })

    const [conValues, setConValues] = useState({
        "SecondaryNameID": '', "PrimaryKeyID": '', "PINID": '', "AgencyID": '', "DeletedByUserFK": '', "ComputerName": 'Admin0001',

        "IsPendingOtherAgencyEvents": true, "IsAddress": true, "IsIDNumber": true, "IsAlias": true, "IsDocument": false, "IsImage": false, "IsAlert": true,
        "Iscontact": true, "IsName": true, "IsDOB": true, "IsSSN": true, "IsRace": true, "IsSex": true, "IsAge": true,
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID); get_Name_Drp_Data(localStoreData?.AgencyID); GetBusinessTypeDrp(localStoreData?.AgencyID)
            dispatch(get_NameTypeData(localStoreData?.AgencyID));
            dispatch(get_ScreenPermissions_Data("U118", localStoreData?.AgencyID, localStoreData?.PINID));
            const id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
            if (id.length > 0) {
                setValue(prevValues => { return { ...prevValues, ['NameTypeID']: id[0].value } })
            }
        }
    }, [localStoreData]);

    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data[0]?.Ethnicity, 'EthnicityID', 'Description'));
                setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
                setSexIdDrp(Comman_changeArrayFormat(data[0]?.Gender, 'SexCodeID', 'Description'));
            } else {
                setEthinicityDrpData([]);
                setRaceIdDrp([]);
                setSexIdDrp([]);
            }
        })
    };

    const GetBusinessTypeDrp = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('NameBusinessType/GetDataDropDown_NameBusinessType', val).then((data) => {
            if (data) {
                setBusinessTypeDrp(Comman_changeArrayFormat(data, 'NameBusinessTypeID', 'Description'))
            } else {
                setBusinessTypeDrp([]);
            }
        })
    };

    const get_PrimaryName_Search = async () => {
        const {
            NameIDNumber, NameTypeID, NameReasonCodeID, LastName, MiddleName, FirstName, SuffixID, DateOfBirthFrom, DateOfBirthTo, SexID, RaceID, EthnicityID, HairColorID,
            EyeColorID, WeightFrom, WeightTo, SMTTypeID, SMTLocationID, SSN, SMT_Description, IncidentNumber, IncidentNumberTo, ReportedDate, ReportedDateTo, DateOfBirth,
            HeightFrom, HeightTo,FBI, BusinessTypeID, FaxNumber, Contact
        } = value;

        const val = {
            'NameIDNumber': NameIDNumber, 'NameTypeID': NameTypeID, 'NameReasonCodeID': NameReasonCodeID, 'LastName': LastName, 'MiddleName': MiddleName, 'FirstName': FirstName,
            'SuffixID': SuffixID, 'DateOfBirthFrom': DateOfBirthFrom, 'DateOfBirthTo': DateOfBirthTo, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'HairColorID': HairColorID, 'FBI': FBI,
            'EyeColorID': EyeColorID, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'SMTTypeID': SMTTypeID, 'SMTLocationID': SMTLocationID, 'SSN': SSN, 'SMT_Description': SMT_Description,
            'IncidentNumber': IncidentNumber, 'IncidentNumberTo': IncidentNumberTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'DateOfBirth': DateOfBirth,
            'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'AgencyID': loginAgencyID, 'BusinessTypeID': BusinessTypeID, 'FaxNumber': FaxNumber, 'Contact': Contact
        };

        const primaryHasValues = hasValues(val);
        const secondaryHasValues = hasValues(secondvalue);
        if (primaryHasValues && secondaryHasValues) {
            fetchPostData("MasterName/Search_Name", val).then((res) => {
                if (res.length > 0) {
                    console.log(res);
                    setPrimarySearchData(res);
                } else {
                    setPrimarySearchData([]);
                    toastifyError("No Data Available in Primary Search");
                }
            });
            get_SecondaryName_Search();
        }
        else {
            toastifyError("Both Primary and Secondary Fields Should Filled");
        }
    };


    const get_SecondaryName_Search = async () => {
        const {
            NameIDNumber, NameTypeID, NameReasonCodeID, LastName, MiddleName, FirstName, SuffixID, DateOfBirthFrom, DateOfBirthTo, SexID, RaceID, EthnicityID, HairColorID,
            EyeColorID, WeightFrom, WeightTo, SMTTypeID, SMTLocationID, SSN, SMT_Description, IncidentNumber, IncidentNumberTo, ReportedDate, ReportedDateTo, DateOfBirth,
            HeightFrom, HeightTo, FBI, BusinessTypeID, FaxNumber, Contact
        } = secondvalue;

        const val = {
            'NameIDNumber': NameIDNumber, 'NameTypeID': NameTypeID, 'NameReasonCodeID': NameReasonCodeID, 'LastName': LastName, 'MiddleName': MiddleName, 'FirstName': FirstName,
            'SuffixID': SuffixID, 'DateOfBirthFrom': DateOfBirthFrom, 'DateOfBirthTo': DateOfBirthTo, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'HairColorID': HairColorID, 'FBI': FBI,
            'EyeColorID': EyeColorID, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'SMTTypeID': SMTTypeID, 'SMTLocationID': SMTLocationID, 'SSN': SSN, 'SMT_Description': SMT_Description,
            'IncidentNumber': IncidentNumber, 'IncidentNumberTo': IncidentNumberTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'DateOfBirth': DateOfBirth,
            'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'AgencyID': loginAgencyID, BusinessTypeID, FaxNumber, Contact
        };

        fetchPostData("MasterName/Search_Name", val).then((res) => {
            if (res.length > 0) {
                setSecondarySearchData(res);
            } else {
                setSecondarySearchData([]);
                toastifyError("No Data Available in Secondary Search");
            }
        });
    };

    function hasValues(obj) {
        for (let key in obj) {
            if (key !== 'AgencyID' && key !== 'NameTypeID') {
                if (obj[key]) {
                    return true;
                }
            }
        }
        return false;
    }

    useEffect(() => {
        if (loginAgencyID) {
            dispatch(get_NameTypeData(loginAgencyID));
        }
    }, [localStoreData])

    const consoledateName = async () => {
        const { PrimaryKeyID, IsPendingOtherAgencyEvents, IsAddress, IsIDNumber, IsAlias, IsDocument, IsImage, IsAlert, Iscontact, IsName, IsDOB, IsSSN, IsRace, IsSex, IsAge,
        } = conValues

        for (let i = 0; i < secondaryNameSelectCount?.length; i++) {
            const val = {
                "SecondaryNameID": secondaryNameSelectCount[i], "PrimaryKeyID": PrimaryKeyID, "intPINID": loginPinID, "intAgencyID": parseInt(loginAgencyID), "DeletedByUserFK": loginPinID, "ComputerName": 'Admin0001',
                "IsPendingOtherAgencyEvents": IsPendingOtherAgencyEvents, "IsAddress": IsAddress, "IsIDNumber": IsIDNumber, "IsAlias": IsAlias, "IsDocument": IsDocument, "IsImage": IsImage, "IsAlert": IsAlert,
                "Iscontact": Iscontact, "IsName": IsName, "IsDOB": IsDOB, "IsSSN": IsSSN, "IsRace": IsRace, "IsSex": IsSex, "IsAge": IsAge,
            }
            const res = await AddDeleteUpadate('Consolidation/NameConsolidation', val)
            if (res?.success) {
                const parceData = JSON.parse(res?.data)
                toastifySuccess(parceData?.Table[0]?.Message);
                setPrimaryNameSelect(null); setSecondaryNameSelectCount(null);
                setPrimarySearchData([]); setSecondarySearchData([]);
                setSelectionLocked(false);
                setSelectedPrimaryRows([]);
            } else {
                console.log(res?.Message)
            }
        }
    }

    const setSameAsPrimary = (e) => {
        setSameAsPrimaryCheck(e.target.checked)
        if (e.target.checked) {
            if (selectedOption === 'person') {
                const {
                    NameIDNumber, LastName, MiddleName, FirstName, SexID, RaceID, EthnicityID, SSN, DateOfBirth, FBI
                } = value
                setsecondValue({
                    ...secondvalue,
                    NameIDNumber: NameIDNumber, LastName: LastName, MiddleName: MiddleName, FirstName: FirstName, SSN: SSN, SexID: SexID, RaceID: RaceID, EthnicityID: EthnicityID, DateOfBirth: DateOfBirth, AgencyID: loginAgencyID, FBI: FBI,
                })
            } else {
                const {
                    LastName, BusinessTypeID, Contact, FaxNumber
                } = value
                setsecondValue({
                    ...secondvalue,
                    BusinessTypeID: BusinessTypeID, LastName: LastName, Contact: Contact, FaxNumber: FaxNumber,
                })
            }
        } else {
            if (selectedOption === 'person') {
                setsecondValue({
                    ...secondvalue,
                    NameIDNumber: '', LastName: '', MiddleName: '', FirstName: '', SSN: '', SexID: '', RaceID: '', EthnicityID: '', DateOfBirth: '', AgencyID: '', FBI: '',
                })
            } else {
                setsecondValue({
                    ...secondvalue,
                    BusinessTypeID: '', LastName: '', Contact: '', FaxNumber: '',
                })
            }
        }
    }

    const columns = [
        {
            name: 'Name Number',
            selector: (row) => row.NameIDNumber,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Middle Name',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },
        {
            name: 'DOB',
            selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ",

            sortable: true
        },
        {
            name: 'Is Juvenile',
            selector: (row) => row.IsJuvenile ? 'Yes' : 'No',
            sortable: true
        },

    ]

    const handleRadioChange = (event) => {
        setStatesChangeStatus(true)

        setSelectedOption(event.target.value); reset()
        console.log(event.target.value);
        if (event.target.value === 'person') {
            setValue(prevValues => { return { ...prevValues, ['NameTypeID']: 1 } })
        }
        else if (event.target.value === 'business') {
            setValue(prevValues => { return { ...prevValues, ['NameTypeID']: 2 } })
        }
    };

    const handleChange = (e) => {
        setStatesChangeStatus(true)
        if (e) {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        } else {
            setValue({
                ...value,
                [e.target.name]: '',
            })
        }
    };

    const handleCheckBox = (e) => {
        setStatesChangeStatus(true)

        setConValues({
            ...conValues,
            [e.target.name]: e.target.checked
        })
    };

    const onChangeNameIdNum = (e, name) => {
        if (e.target.value.trim() !== '') {
            setStatesChangeStatus(true);
        }
        if (name === 'Secondary') {
            if (e.target.name === 'NameIDNumber') {
                let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                if (ele.length === 10) {
                    const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                    const match = cleaned.match(/^([AJ]{1})(\d{9})$/);

                    if (match) {
                        setsecondValue({
                            ...secondvalue,
                            [e.target.name]: match[1] + '-' + match[2]
                        })
                    }
                } else {
                    ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
                    setsecondValue({
                        ...secondvalue,
                        [e.target.name]: ele
                    })
                }
            } else {
                setsecondValue({
                    ...secondvalue,
                    [e.target.name]: e.target.value
                })
            }
        } else {
            if (e.target.name === 'NameIDNumber') {
                let ele = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                if (ele.length === 10) {
                    const cleaned = ('' + ele).replace(/[^a-zA-Z0-9\s]/g, '');
                    const match = cleaned.match(/^([AJ]{1})(\d{9})$/);

                    if (match) {
                        setValue({
                            ...value,
                            [e.target.name]: match[1] + '-' + match[2]
                        })
                    }
                } else {
                    ele = e.target.value.split("'").join('').replace(/[^a-zA-Z0-9\s]/g, '');
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
    }

    const ChangeDropDown = (e, name, objName) => {

        setStatesChangeStatus(true)

        if (objName === 'Secondary') {
            if (e) {
                setsecondValue({
                    ...secondvalue,
                    [name]: e.value
                })
            } else {
                setsecondValue({
                    ...secondvalue,
                    [name]: null
                })
            }
        } else {
            if (e) {
                setValue({
                    ...value, [name]: e.value
                })
            } else {
                setValue({
                    ...value, [name]: null
                })
            }
        }
    }

    const onChangeSSNNum = (e, name) => {
        setStatesChangeStatus(true)

        if (name === 'Secondary') {
            if (e) {
                if (e.target.name === 'SSN') {
                    let ele = e.target.value.replace(/\D/g, '');
                    if (ele.length === 9) {
                        const cleaned = ('' + ele).replace(/\D/g, '');
                        const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                        if (match) {
                            setsecondValue({
                                ...secondvalue,
                                [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                            })
                        }
                    } else {
                        ele = e.target.value.split('-').join('').replace(/\D/g, '');
                        setsecondValue({
                            ...secondvalue,
                            [e.target.name]: ele
                        })
                    }
                }
            } else {
                setsecondValue({
                    ...secondvalue,
                    [e.target.name]: e.target.value
                })
            }
        } else {
            if (e) {
                if (e.target.name === 'SSN') {
                    let ele = e.target.value.replace(/\D/g, '');
                    if (ele.length === 9) {
                        const cleaned = ('' + ele).replace(/\D/g, '');
                        const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                        if (match) {
                            setValue({
                                ...value,
                                [e.target.name]: match[1] + '-' + match[2] + '-' + match[3]
                            })
                        }
                    } else {
                        ele = e.target.value.split('-').join('').replace(/\D/g, '');
                        setValue({
                            ...value,
                            [e.target.name]: ele
                        })
                    }
                }
            } else {
                setValue({
                    ...value,
                    [e.target.name]: e.target.value
                })
            }
        }
    }

    const onChangePhoneFaxNum = (e, name) => {
        if (e.target.value.trim() !== '') {
            setStatesChangeStatus(true);
        }

        if (name === 'Secondary') {
            if (e) {
                if (e.target.name === 'Contact') {
                    let ele = e.target.value.replace(/\D/g, '');
                    if (ele.length <= 10) {
                        const cleaned = ('' + ele).replace(/\D/g, '');
                        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                        if (match) {
                            setsecondValue({
                                ...secondvalue,
                                [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                            });
                        } else {
                            setsecondValue({
                                ...secondvalue,
                                [e.target.name]: ele,
                            });
                        }
                    }
                } else if (e.target.name === 'FaxNumber') {
                    let ele = e.target.value.replace(/\D/g, '');
                    if (ele.length <= 10) {
                        const cleaned = ('' + ele).replace(/\D/g, '');
                        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                        if (match) {
                            setsecondValue({
                                ...secondvalue,
                                [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                            });
                        } else {
                            setsecondValue({
                                ...secondvalue,
                                [e.target.name]: ele,
                            });
                        }
                    }
                } else {
                    setsecondValue({
                        ...secondvalue,
                        [e.target.name]: e.target.value
                    })
                }
            }
        } else {
            if (e) {
                if (e.target.name === 'Contact') {
                    let ele = e.target.value.replace(/\D/g, '');
                    if (ele.length <= 10) {
                        const cleaned = ('' + ele).replace(/\D/g, '');
                        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                        if (match) {
                            setValue({
                                ...value,
                                [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                            });
                        } else {
                            setValue({
                                ...value,
                                [e.target.name]: ele,
                            });
                        }
                    }
                } else if (e.target.name === 'FaxNumber') {
                    let ele = e.target.value.replace(/\D/g, '');
                    if (ele.length <= 10) {
                        const cleaned = ('' + ele).replace(/\D/g, '');
                        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                        if (match) {
                            setValue({
                                ...value,
                                [e.target.name]: match[1] + '-' + match[2] + '-' + match[3],
                            });
                        } else {
                            setValue({
                                ...value,
                                [e.target.name]: ele,
                            });
                        }
                    }
                } else {
                    setValue({
                        ...value,
                        [e.target.name]: e.target.value
                    })
                }
            }
        }
    }

    const reset = () => {
        dispatch(get_NameTypeData(loginAgencyID));
        setStatesChangeStatus(false);
        setSameAsPrimaryCheck(false);
        setSelectionLocked(false);
        setPrimaryNameSelect([]);
        const Id = nameTypeData?.filter((val) => { if (val.id === "I") return val })
        if (Id.length > 0) {
            setValue({
                ...value,
                ['NameTypeID']: Id[0]?.value,
            })

        }
        setValue({
            ...value,
            NameIDNumber: '', LastName: '', MiddleName: '', FirstName: '', SSN: '', SexID: '', RaceID: '', EthnicityID: '', DateOfBirth: '', AgencyID: '',
            //Business Search Para
            BusinessTypeID: '', Contact: '', FaxNumber: '', FBI: '',

            //not in use
            NameReasonCodeID: '', SuffixID: '', DateOfBirthFrom: '', DateOfBirthTo: '', HairColorID: '', EyeColorID: '', WeightFrom: '', WeightTo: '',
            SMTTypeID: '', SMTLocationID: '', SMT_Description: '', IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', HeightFrom: '', HeightTo: '',
        })
        setConValues({
            ...conValues,
            "SecondaryNameID": '', "PrimaryKeyID": '',
            "IsPendingOtherAgencyEvents": true, "IsAddress": true, "IsIDNumber": true, "IsAlias": true, "IsDocument": false, "IsImage": false, "IsAlert": true,
            "Iscontact": true, "IsName": true, "IsDOB": true, "IsSSN": true, "IsRace": true, "IsSex": true, "IsAge": true,

        })
        setsecondValue({
            ...secondvalue,
            NameIDNumber: '', LastName: '', MiddleName: '', FirstName: '', SSN: '', SexID: '', RaceID: '', EthnicityID: '', DateOfBirth: '', FBI: '',
            //Business Search Para
            BusinessTypeID: '', Contact: '', FaxNumber: '',

            //not in use
            NameReasonCodeID: '', SuffixID: '', DateOfBirthFrom: '', DateOfBirthTo: '', HairColorID: '', EyeColorID: '', WeightFrom: '', WeightTo: '',
            SMTTypeID: '', SMTLocationID: '', SMT_Description: '', IncidentNumber: '', IncidentNumberTo: '', ReportedDate: '', ReportedDateTo: '', HeightFrom: '', HeightTo: '',
        })
        handleClearRows(); setSecondarySearchData([]); setPrimarySearchData([]);
    }

  
  
    const handleCheckboxChange = ({ selectedRows }) => {
        if (selectedRows?.length > 0) {
            setPrimaryNameSelect(selectedRows)
            setConValues({ ...conValues, "PrimaryKeyID": selectedRows[0]?.MasterNameID, });
            setSelectedPrimaryRows(selectedRows.map(row => row.NameIDNumber));
            setSelectionLocked(true);
        } else {
            setPrimaryNameSelect(selectedRows)
            setConValues({ ...conValues, "PrimaryKeyID": '', });

            setSelectionLocked(false);
        }
    }

    const handleSecondaryCheckboxChange = ({ selectedRows }) => {
        const ids = []
        selectedRows.forEach(({ MasterNameID }) => ids.push(MasterNameID))

        if (selectedRows.length > 0) {
            setSecondaryNameSelectCount(ids)
        } else {
            setSecondaryNameSelectCount(ids)
        }
    }

    const handleClearRows = () => {
        setStatesChangeStatus(false)
        setToggleClear(!toggleClear);
    }

    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency  ">
                            <div className="card-body">
                                <div className="col-12 col-md-12 col-lg-12 ">
                                    <div className="row" style={{ marginTop: '-10px' }}>
                                        <div className="form-check col-3 ml-2">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" defaultChecked value="person" onChange={handleRadioChange} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Person Name Consolidation
                                            </label>
                                        </div>
                                        <div className="form-check col-6">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value="business" onChange={handleRadioChange} />
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                Business Name Consolidation
                                            </label>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" onChange={setSameAsPrimary} checked={sameAsPrimaryCheck} type="checkbox" name='SamePrimary' id="flexCheckDefault" />
                                                <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault">
                                                    Same as Primary
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="content mb-0 ">
                                    {selectedOption === 'person' ? (
                                        <div>
                                            <div className="col-12 col-md-12 col-lg-12">
                                                <div className="row mt-2">
                                                    <div className="col-12 col-md-12 col-lg-6 br">
                                                        <fieldset>
                                                            <legend>Primary Search Criteria</legend>
                                                            <div className="row mt-2">
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Name No.</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" id='NameIDNumber' name='NameIDNumber' value={value?.NameIDNumber} maxLength={11} onChange={(e) => { onChangeNameIdNum(e, 'Primary') }} className="" required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Last Name</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" name='LastName' value={value?.LastName} onChange={(e) => { onChangeNameIdNum(e, 'Primary') }} className="" id='LastName' required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>First Name</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" className="" name='FirstName' id='FirstName' value={value?.FirstName} onChange={(e) => { onChangeNameIdNum(e, 'Primary') }} required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Ethnicity</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4    mt-1">
                                                                    <Select
                                                                        name='EthnicityID'
                                                                        value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                                        options={ethinicityDrpData}
                                                                        onChange={(e) => ChangeDropDown(e, 'EthnicityID', 'Primary')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Middle&nbsp;Name</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" className="" name='MiddleName' id='MiddleName' value={value?.MiddleName} onChange={(e) => { onChangeNameIdNum(e, 'Primary') }} required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>SSN</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" className="" name='SSN' id='SSN' maxLength={10} value={value?.SSN} onChange={(e) => onChangeSSNNum(e, 'Primary')} required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Gender</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4    mt-1">
                                                                    <Select
                                                                        name='SexID'
                                                                        value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                                        options={sexIdDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'SexID', 'Primary')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Race</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4    mt-1">
                                                                    <Select
                                                                        name='RaceID'
                                                                        value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                                        options={raceIdDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'RaceID', 'Primary')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>DOB</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4 ">
                                                                    <DatePicker
                                                                        id='DateOfBirth'
                                                                        name='DateOfBirth'
                                                                        className=''
                                                                        onChange={(date) => { setValue({ ...value, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, }) }}
                                                                        dateFormat="MM/dd/yyyy"
                                                                        timeInputLabel
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        isClearable={value?.DateOfBirth ? true : false}
                                                                        selected={value?.DateOfBirth && new Date(value?.DateOfBirth)}
                                                                        placeholderText={value?.DateOfBirth ? value.DateOfBirth : 'Select...'}
                                                                        maxDate={new Date()}
                                                                        timeIntervals={1}
                                                                        autoComplete="Off"
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>FBI No.</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" onChange={(e) => { onChangeNameIdNum(e, 'Primary') }} value={value?.FBI} name='FBI' className="" id='FBI' required />
                                                                </div>
                                                            </div>
                                                        </fieldset >
                                                    </div>
                                                    <div className="col-12 col-md-12 col-lg-6">
                                                        <fieldset>
                                                            <legend>Secondary Search Criteria</legend>
                                                            <div className="row mt-2">
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Name No.</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" id='NameIDNumber' name='NameIDNumber' value={secondvalue?.NameIDNumber} maxLength={11} onChange={(e) => onChangeNameIdNum(e, 'Secondary')} className="" required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Last Name</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" name='LastName' value={secondvalue?.LastName} onChange={(e) => { onChangeNameIdNum(e, 'Secondary') }} className="" id='LastName' required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>First Name</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" className="" name='FirstName' id='FirstName' value={secondvalue?.FirstName} onChange={(e) => { onChangeNameIdNum(e, 'Secondary') }} required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Ethnicity</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4    mt-1">
                                                                    <Select
                                                                        name='EthnicityID'
                                                                        value={ethinicityDrpData?.filter((obj) => obj.value === secondvalue?.EthnicityID)}
                                                                        options={ethinicityDrpData}
                                                                        onChange={(e) => ChangeDropDown(e, 'EthnicityID', 'Secondary')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Middle&nbsp;Name</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" className="" name='MiddleName' id='MiddleName' value={secondvalue?.MiddleName} onChange={(e) => { onChangeNameIdNum(e, 'Secondary') }} required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>SSN</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" className="" name='SSN' id='SSN' maxLength={10} value={secondvalue?.SSN} onChange={(e) => onChangeSSNNum(e, 'Secondary')} required />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Gender</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4    mt-1">
                                                                    <Select
                                                                        name='SexID'
                                                                        value={sexIdDrp?.filter((obj) => obj.value === secondvalue?.SexID)}
                                                                        options={sexIdDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'SexID', 'Secondary')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>Race</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4    mt-1">
                                                                    <Select
                                                                        name='RaceID'
                                                                        value={raceIdDrp?.filter((obj) => obj.value === secondvalue?.RaceID)}
                                                                        options={raceIdDrp}
                                                                        onChange={(e) => ChangeDropDown(e, 'RaceID', 'Secondary')}
                                                                        isClearable
                                                                        placeholder="Select..."
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>DOB</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4 ">
                                                                    <DatePicker
                                                                        id='DateOfBirth'
                                                                        name='DateOfBirth'
                                                                        className=''
                                                                        onChange={(date) => { setsecondValue({ ...secondvalue, ['DateOfBirth']: date ? getShowingWithOutTime(date) : null, }) }}
                                                                        dateFormat="MM/dd/yyyy"
                                                                        timeInputLabel
                                                                        showYearDropdown
                                                                        showMonthDropdown
                                                                        dropdownMode="select"
                                                                        isClearable={secondvalue?.DateOfBirth ? true : false}
                                                                        selected={secondvalue?.DateOfBirth && new Date(secondvalue?.DateOfBirth)}
                                                                        placeholderText={secondvalue?.DateOfBirth ? secondvalue.DateOfBirth : 'Select...'}
                                                                        maxDate={new Date()}
                                                                        timeIntervals={1}
                                                                        autoComplete="Off"
                                                                    />
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                    <label htmlFor="" className='new-label '>FBI No.</label>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                    <input type="text" onChange={(e) => { onChangeNameIdNum(e, 'Secondary') }} value={secondvalue?.FBI} name='FBI' required />
                                                                </div>
                                                            </div>
                                                        </fieldset >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-12 col-md-12 col-lg-12">
                                            <div className="row mt-2">
                                                <div className="col-6 br">
                                                    <fieldset>
                                                        <legend>Primary Search Criteria</legend>
                                                        <div className="row mt-2">
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 px-0">
                                                                <label htmlFor="" className='new-label px-0'>Business&nbsp;Name</label>
                                                            </div>
                                                            <div className="col-10 col-md-10 col-lg-10  text-field  mt-1">
                                                                <input type="text" name='LastName' id='LastName' value={value?.LastName} onChange={(e) => { onChangeNameIdNum(e, 'Primary') }} className="" required />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 px-0">
                                                                <label htmlFor="" className='new-label px-0'>Business&nbsp;Type</label>
                                                            </div>
                                                            <div className="col-10 col-md-10 col-lg-10 mt-1">
                                                                <Select
                                                                    name='BusinessTypeID'
                                                                    value={businessTypeDrp?.filter((obj) => obj.value === value?.BusinessTypeID)}
                                                                    options={businessTypeDrp}
                                                                    onChange={(e) => ChangeDropDown(e, 'BusinessTypeID', 'Primary')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label '>Phone</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                <input type="text" name='Contact' id='Contact' value={value?.Contact} onChange={(e) => { onChangePhoneFaxNum(e, 'Primary') }} className="" required />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label '>Fax No.</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                <input type="text" name='FaxNumber' id='FaxNumber' value={value?.FaxNumber} onChange={(e) => { onChangePhoneFaxNum(e, 'Primary') }} className="" required />
                                                            </div>
                                                        </div>
                                                    </fieldset >
                                                </div>
                                                <div className="col-6">
                                                    <fieldset>
                                                        <legend>Secondary Search Criteria</legend>
                                                        <div className="row mt-2">
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 px-0">
                                                                <label htmlFor="" className='new-label px-0'>Business&nbsp;Name</label>
                                                            </div>
                                                            <div className="col-10 col-md-10 col-lg-10  text-field  mt-1">
                                                                <input type="text" name='LastName' id='LastName' value={secondvalue?.LastName} onChange={(e) => { onChangeNameIdNum(e, 'Secondary') }} className="" required />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 px-0">
                                                                <label htmlFor="" className='new-label px-0'>Business&nbsp;Type</label>
                                                            </div>
                                                            <div className="col-10 col-md-10 col-lg-10 mt-1">
                                                                <Select
                                                                    name='BusinessTypeID'
                                                                    value={businessTypeDrp?.filter((obj) => obj.value === secondvalue?.BusinessTypeID)}
                                                                    options={businessTypeDrp}
                                                                    onChange={(e) => ChangeDropDown(e, 'BusinessTypeID', 'Secondary')}
                                                                    isClearable
                                                                    placeholder="Select..."
                                                                />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label '>Phone</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                <input type="text" name='Contact' id='Contact' value={secondvalue?.Contact} onChange={(e) => { onChangePhoneFaxNum(e, 'Secondary') }} className="" required />
                                                            </div>
                                                            <div className="col-2 col-md-2 col-lg-2  mt-2 ">
                                                                <label htmlFor="" className='new-label '>Fax No.</label>
                                                            </div>
                                                            <div className="col-4 col-md-4 col-lg-4  text-field  mt-1">
                                                                <input type="text" name='FaxNumber' id='FaxNumber' value={secondvalue?.FaxNumber} onChange={(e) => { onChangePhoneFaxNum(e, 'Secondary') }} className="" required />
                                                            </div>
                                                        </div>
                                                    </fieldset >
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 bt mt-1">
                                    <div className="row mt-2 cc" >
                                        <div className="form-check col-3 ml-3">
                                            <input className="form-check-input" value={'Con'} checked={value?.ConMerge === 'Con'} onChange={handleChange} type="radio" name="ConMerge" id="flexRadioDefault3" />
                                            <label className="form-check-label" htmlFor="Consolidate">
                                                Consolidate
                                            </label>
                                        </div>
                                        <div className="form-check col-3">
                                            <input className="form-check-input" value={'Merge'} checked={value?.ConMerge === 'Merge'} onChange={handleChange} type="radio" name="ConMerge" id="flexRadioDefault4" />
                                            <label className="form-check-label" htmlFor="MergeEvents">
                                                Merge Events
                                            </label>
                                        </div>
                                        <div className="col-3  p-0 mb-1">
                                            {
                                                effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                    <button type="button" disabled={!statesChangeStatus} onClick={() => { get_PrimaryName_Search() }} className="btn btn-sm btn-success  mr-1" >Search</button>
                                                    : <></> :
                                                    <button type="button" disabled={!statesChangeStatus} onClick={() => { get_PrimaryName_Search() }} className="btn btn-sm btn-success  mr-1" >Search</button>
                                            }
                                            <button type="button" onClick={() => { reset() }} className="btn btn-sm btn-success  mr-1" >Clear</button>

                                        </div>


                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='SamePrimary' id="flexCheckDefault1" />
                                                <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault1">
                                                    Match Exact Criteria
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 cc">
                                    <div className="row mt-2" >
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='IsName' id="IsName" checked={conValues?.IsName} value={conValues?.IsName} onChange={handleCheckBox} />
                                                <label className="form-check-label" htmlFor="flexCheckDefault2">
                                                    Name
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='Iscontact' id="Iscontact" checked={conValues?.Iscontact} value={conValues?.Iscontact} onChange={handleCheckBox} />
                                                <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault3">
                                                    Contact
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='IsAlert' id="IsAlert" checked={conValues?.IsAlert} value={conValues?.IsAlert} onChange={handleCheckBox} />
                                                <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault4">
                                                    Alerts
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='IsImage' id="IsImage" checked={conValues?.IsImage} value={conValues?.IsImage} onChange={handleCheckBox} />
                                                <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault5">
                                                    Images
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='IsDocument' id="IsDocument" checked={conValues?.IsDocument} value={conValues?.IsDocument} onChange={handleCheckBox} />
                                                <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault6">
                                                    Documents
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 col-md-4 col-lg-2 ">
                                            <div className="form-check ">
                                                <input className="form-check-input" type="checkbox" name='IsCreateAlias' id="IsCreateAlias" checked={conValues?.IsCreateAlias} value={conValues?.IsCreateAlias} onChange={handleCheckBox} />
                                                <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault8">
                                                    Create Alias
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            selectedOption === 'person' &&
                                            <>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='IsAddress' id="IsAddress" checked={conValues?.IsAddress} value={conValues?.IsAddress} onChange={handleCheckBox} />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault9">
                                                            Address
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='IsSSN' id="IsSSN" checked={conValues?.IsSSN} value={conValues?.IsSSN} onChange={handleCheckBox} />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault10">
                                                            SSN
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='IsEthinicity' id="IsEthinicity" checked={conValues?.IsEthinicity} value={conValues?.IsEthinicity} onChange={handleCheckBox} />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault11">
                                                            Ethinicity
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='IsDobAge' id="IsDobAge" checked={conValues?.IsDobAge} value={conValues?.IsDobAge} onChange={handleCheckBox} />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault12">
                                                            DOB/Age
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='IsRace' id="IsRace" checked={conValues?.IsRace} value={conValues?.IsRace} onChange={handleCheckBox} />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault13">
                                                            Race
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='IsAlias' id="IsAlias" checked={conValues?.IsAlias} value={conValues?.IsAlias} onChange={handleCheckBox} />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault14">
                                                            Alias
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='SamePrimary' id="flexCheckDefault15" />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault15">
                                                            Id Number
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col-3 col-md-4 col-lg-2 ">
                                                    <div className="form-check ">
                                                        <input className="form-check-input" type="checkbox" name='IsSex' id="IsSex" checked={conValues?.IsSex} value={conValues?.IsSex} onChange={handleCheckBox} />
                                                        <label className="form-check-label" name='IsSamePrimary' id='IsSamePrimary' htmlFor="flexCheckDefault16">
                                                            Gender
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <fieldset className='mt-2 mb-1'>
                                    <legend>Primary Name</legend>
                                    <div className="col-12 mt-1 pt-1 px-0">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={primarySearchData?.length > 0 ? primarySearchData : []}
                                            pagination
                                            highlightOnHover
                                            fixedHeaderScrollHeight='150px'
                                            fixedHeader
                                            persistTableHead={true}
                                            customStyles={tableCustomStyles}
                                            selectableRows
                                            selectableRowsSingle
                                            selectableRowsHighlight
                                            onSelectedRowsChange={handleCheckboxChange}
                                            clearSelectedRows={toggleClear}
                                            selectableRowDisabled={(row) => selectionLocked && !primaryNameSelectCount?.includes(row)}
                                            headerCheckboxAll={false}
                                        />
                                    </div>
                                </fieldset>
                                <fieldset className='mt-2 mb-1'>
                                    <legend>Secondary Name</legend>
                                    <div className="col-12 mt-1 pt-1 px-0">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={secondarySearchData.length > 0 ? secondarySearchData : []}
                                            pagination
                                            highlightOnHover
                                            fixedHeaderScrollHeight='150px'
                                            fixedHeader
                                            persistTableHead={true}
                                            customStyles={tableCustomStyles}
                                            selectableRows
                                            selectableRowsHighlight
                                            onSelectedRowsChange={handleSecondaryCheckboxChange}
                                            clearSelectedRows={toggleClear}
                                            selectableRowDisabled={(row) => selectedPrimaryRows.includes(row.NameIDNumber)}
                                        />
                                    </div>
                                </fieldset>
                                <div className="col-12 field-button" style={{ position: 'absolute', bottom: '5px', textAlign: 'right' }} >
                                    <button type="button" disabled={secondaryNameSelectCount?.length < 1 || primaryNameSelectCount?.length < 1 || value?.ConMerge != 'Con'} onClick={() => { consoledateName() }} className="btn btn-sm btn-success  mr-1" >Consolidate</button>
                                    <button type="button" disabled={secondaryNameSelectCount?.length < 1 || primaryNameSelectCount?.length < 1 || value?.ConMerge != 'Merge'} className="btn btn-sm btn-success  mr-4" >Merge Events</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default NameConsolidation

