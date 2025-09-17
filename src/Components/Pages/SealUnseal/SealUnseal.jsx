import React, { useCallback, useContext, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Aes256Encrypt, base64ToString, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../Common/Utility';
import SealUnsealTab from '../../Utility/Tab/SealUnsealTab';
import Select from "react-select";
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../Common/ChangeArrayFormat';
import { AddDelete_Img, fetchPostData } from '../../hooks/Api';
import DatePicker from "react-datepicker";
import SelectBox from '../../Common/SelectBox';
import { AgencyContext } from '../../../Context/Agency/Index';
import { debounce } from 'lodash';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { useDispatch } from 'react-redux';

const SealUnseal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { datezone, GetDataTimeZone } = useContext(AgencyContext);

    const [loginAgencyID, setloginAgencyID] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [sealUnsealData, setSealUnsealData] = useState([]);
    const [nameSearchValue, setNameSearchValue] = useState([]);
    const [loginPinID, setLoginPinID,] = useState('');
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [logData, setLogData] = useState([]);
    const [dateOfbirth, setdateOfbirth] = useState();
    const [clickedRow, setClickedRow] = useState(null);
    const [masterNameID, setMasterNameID] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [IncidentID, setIncidentID] = useState(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [ChargeID, setChargeID] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [action, setAction] = useState(null);
    const [actionType, setActionType] = useState('');
    const [selectedRowStatus, setSelectedRowStatus] = useState([]);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedChargeIds, setSelectedChargeIds] = useState([]);
    const [selectedCheckedRows, setSelectedCheckedRows] = useState([]);
    const [disabledParent, setDisabledParent] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [transactionName, setTransactionName] = useState([]);
    const [transactionId, setTransactionId] = useState([]);
    const [transactionNumber, setTransactionNumber] = useState([]);
    const [selectionLocked, setSelectionLocked] = useState(false);
    const [selectionLockedArrest, setselectionLockedArrest] = useState(false);
    const [primaryNameSelectCount, setPrimaryNameSelect] = useState([]);
    const [arrestSelectCount, setArrestSelectCount] = useState([]);
    const [arrestChareData, setArrestChareData] = useState([]);
    const [arrestId, setArrestId] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [ScreenPermissionsData, setScreenPermissionsData] = useState(false)
    const [ScreenPermissionsData1, setScreenPermissionsData1] = useState(false)

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var NameID = query?.get("NameID");
    var MasterNameID = query?.get("MasterNameID");

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const [value, setValue] = useState({
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'DateOfBirth': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '', 'SealUnseal': 1,
        'DateTimeSeal': '',
    })
    const [errors, setErrors] = useState({ 'File_Not_Selected': '', })

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("U120", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    const getNameSearch = async () => {
        const {
            NameIDNumber, NameIDNumberTo, NameTypeID, NameReasonCodeID, LastName, MiddleName, FirstName, SuffixID, DateOfBirthFrom, DateOfBirthTo, SexID, RaceID, EthnicityID, HairColorID,
            EyeColorID, WeightFrom, WeightTo, SMTTypeID, SMTLocationID, SSN, SMT_Description, IncidentNumber, IncidentNumberTo, ReportedDate, ReportedDateTo, DateOfBirth,
            HeightFrom, HeightTo, AgencyID, PINID, DLNumber, BusinessTypeID, PhoneTypeID, Contact, FaxNumber, RMSCFSCodeID, FBIID, CrimeLocation, OccurredFrom, OccurredFromTo, AgeFrom, AgeTo, AgeUnitID, Local, SBI, FBI, TAX, SPN, Jacket, OCN, State, ComplexionID
        } = value
        const val = {
            'NameIDNumber': NameIDNumber?.trim(), 'NameIDNumberTo': NameIDNumberTo?.trim(), 'NameTypeID': NameTypeID, 'ReasonCodeList': NameReasonCodeID, 'LastName': LastName?.trim(), 'MiddleName': MiddleName?.trim(), 'FirstName': FirstName?.trim(),
            'SuffixID': SuffixID, 'DateOfBirthFrom': DateOfBirthFrom, 'DateOfBirthTo': DateOfBirthTo, 'SexID': SexID, 'RaceID': RaceID, 'EthnicityID': EthnicityID, 'HairColorID': HairColorID,
            'EyeColorID': EyeColorID, 'WeightFrom': WeightFrom, 'WeightTo': WeightTo, 'SMTTypeID': SMTTypeID, 'SMTLocationID': SMTLocationID, 'SSN': SSN, 'SMT_Description': SMT_Description,
            'IncidentNumber': IncidentNumber, 'IncidentNumberTo': IncidentNumberTo, 'ReportedDate': ReportedDate, 'ReportedDateTo': ReportedDateTo, 'DateOfBirth': DateOfBirth,
            'HeightFrom': HeightFrom, 'HeightTo': HeightTo, 'AgencyID': loginAgencyID, 'DLNumber': DLNumber, 'BusinessTypeID': BusinessTypeID, 'PhoneTypeID': PhoneTypeID, 'Contact': Contact, 'FaxNumber': FaxNumber, 'RMSCFSCodeID': RMSCFSCodeID, 'FBIID': FBIID, 'Address': CrimeLocation, 'OccurredFrom': OccurredFrom, 'OccurredFromTo': OccurredFromTo, 'AgeFrom': AgeFrom, 'AgeTo': AgeTo, 'AgeUnitID': AgeUnitID, 'Local': Local, 'SBI': SBI, 'FBI': FBI, 'TAX': TAX, 'SPN': SPN, 'Jacket': Jacket, 'OCN': OCN, 'State': State, 'ComplexionID': ComplexionID,
        }
        if (hasValues(val)) {
            fetchPostData("RecordSeal/Search_Seal", val).then((res) => {
                if (res.length > 0) {
                    setNameSearchValue(res);
                    // Clear();

                } else { setNameSearchValue([]); toastifyError("Data Not Available"); }
            })
        } else { toastifyError("Please Enter Details"); }
    }
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'SSN') {
            let ele = value.replace(/\D/g, '');
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) { setValue((prevState) => ({ ...prevState, [name]: match[1] + '-' + match[2] + '-' + match[3], })); }
            } else {
                ele = value.split('-').join('').replace(/\D/g, '');
                setValue((prevState) => ({ ...prevState, [name]: ele, }));
            }
        } else {
            if (event) { setValue((prevState) => ({ ...prevState, [name]: value })); }
            else { setValue((prevState) => ({ ...prevState, [name]: null })); }
        }
    };

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({ ...value, [name]: e.value })
        } else {
            setValue({ ...value, [name]: null });
        }
    };

    useEffect(() => {
        if (loginAgencyID) {
            get_Name_Drp_Data(loginAgencyID)
        }
    }, [loginAgencyID])

    function hasValues(obj) {
        for (let key in obj) {
            if (key != 'AgencyID' && key != 'PINID') {
                if (obj[key]) {
                    return true;
                }
            }
        }
        return false;
    }

    const get_Name_Drp_Data = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID, }
        fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
            if (data) {
                setEthinicityDrpData(Comman_changeArrayFormat(data[0]?.Ethnicity, 'EthnicityID', 'Description'));
                setSexIdDrp(Comman_changeArrayFormat(data[0]?.Gender, 'SexCodeID', 'Description'));
                setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
            } else {
                setEthinicityDrpData([]); setSexIdDrp([]); setRaceIdDrp([]);
            }
        })
    };






    const Clear = () => {
        setValue({
            ...value,
            'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'DateOfBirth': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '', 'SealUnseal': 1,
        }); setdateOfbirth(''); setNameSearchValue('');
        setLogData([]); setSelectedRowStatus(''); setSelectedRowData(null); setSelectedRows('')
        setSelectedCheckedRows([]);
        setSelectedChargeIds([]);
        setExpandedRow(null);
        setScreenPermissionsData(false);
        setScreenPermissionsData1(false);

    }

    const onDashboardClose = () => {
        navigate('/dashboard-page');
    }

    const handleRowSelected = (selectedRows) => {
        if (selectedRows.selectedRows.length > 0) {
            const selectedRow = selectedRows.selectedRows[0];
            setMasterNameID(selectedRow.MasterNameID);
            get_LogData(selectedRow.MasterNameID);
        } else {
            setSelectedRow(null); setMasterNameID(null); setLogData([]); get_LogData('');
        }
    };

    const get_LogData = (MasterNameID,) => {
        const val2 = { 'MasterNameID': MasterNameID, 'PINID': loginPinID }
        fetchPostData("RecordSeal/GetDataNameIncident", val2).then((res) => {
            if (res) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        })
    }

    const columns = [
        {
            name: 'Name Number', selector: (row) => row.NameIDNumber, sortable: true
        },
        {
            name: 'Last Name', selector: (row) => row.LastName, sortable: true
        },
        {
            name: 'First Name', selector: (row) => row.FirstName, sortable: true
        },
        {
            name: 'Middle Name', selector: (row) => row.MiddleName, sortable: true
        },
        {
            name: 'Gender', selector: (row) => row.Gender_Description, sortable: true
        },
        {
            name: 'DOB', selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ", sortable: true
        },
        {
            name: 'Race', selector: (row) => row.Race_Description, sortable: true
        },
        {
            name: 'SSN', selector: (row) => row.SSN, sortable: true
        },
    ]

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    //-----------------------Select Charges to be Seal/Unseal----------------------------------------------

    const AddType = [
        { value: 1, label: 'Seal', },
        { value: 2, label: 'Unseal', },
    ]

    useEffect(() => {
        setIncidentID(IncidentID)
    }, [IncidentID])

    const get_SealUnsealData = (IncidentID, LoginPinID) => {
        const val2 = { 'ArrestID': '', 'PINID': LoginPinID, "IncidentID": IncidentID.toString() }
        fetchPostData("RecordSeal/Get_ChargebySeal", val2).then((res) => {
            if (res) {
                let filteredData = [];
                if (value.SealUnseal === 1) {
                    filteredData = res.filter(value => value.SealUnsealStatus === false);
                } else if (value.SealUnseal === 2) {
                    filteredData = res.filter(value => value.SealUnsealStatus === true);
                }
                setSealUnsealData(filteredData);
            } else {
                setSealUnsealData([]);
            }
        });
    }

    const get_ArrestChargeDataget_SealUnsealData = async (ArrestID) => {
        const val2 = { 'ArrestID': '', 'PINID': loginPinID, "IncidentID": ArrestID }
        try {
            const res = await fetchPostData("RecordSeal/Get_ChargebySeal", val2);
            if (res) {
                if (sealUnsealData) { setSealUnsealData([]); }
                else { setSealUnsealData(res); }
                setIsDataLoaded(true);
                const childDetails = res.filter((charge) => charge.ArrestID === ArrestID);
                setSelectedCheckedRows(res); setSelectedChargeIds(childDetails.map(charge => charge.ChargeID));
            } else {
                setSealUnsealData([]); setIsDataLoaded(true);
            }
        } catch (error) {
            setArrestChareData([]); setIsDataLoaded(true);
        }
    };


    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) {
            nameArray?.push(name?.name)
        }
        setSelectedFileName(nameArray);
        setErrors({ ...errors, 'File_Not_Selected': '' })
    };

    const Add_SealOrUnseal = async (actionType) => {
        const formdata = new FormData();
        const EncFormdata = new FormData();
        const newDoc = []; const EncDocs = [];
        const isSeal = actionType === 'seal';
        const officerID = isSeal ? value.SealOfficerID : value.UnsealOfficerID;
        const files = isSeal ? value.SealFiles : value.UnsealFiles;
        const DateTime = isSeal && datezone ? getShowingDateText(new Date(datezone)) : getShowingDateText(new Date(datezone));
        for (let i = 0; i < selectedFile.length; i++) {
            formdata.append("file", selectedFile[i]); EncFormdata.append("file", selectedFile[i]);
        }
        const SealUnsealStatus = isSeal ? 'True' : 'false';
        for (let id of selectedChargeIds) {
            const val = {
                'ChargeID': id, 'CreatedByUserFK': loginPinID, 'SealUnsealStatus': SealUnsealStatus,
                [isSeal ? 'DateTimeSeal' : 'DateTimeUnSeal']: DateTime,
                [isSeal ? 'SealFiles' : 'UnsealFiles']: files,
                [isSeal ? 'SealOfficerID' : 'UnsealOfficerID']: officerID,
                [isSeal ? 'SealOfficerID' : 'UnsealOfficerID']: loginPinID
            };
            const values = JSON.stringify(val);
            newDoc.push(values);
            const EncPostData = await Aes256Encrypt(JSON.stringify([JSON.stringify(val)]));
            EncDocs.push(EncPostData);
        }
        formdata.append("Data", JSON.stringify(newDoc));
        EncFormdata.append("Data", EncDocs);
        formdata.append("AgencyID", loginAgencyID);
        EncFormdata.append("AgencyID", loginAgencyID);
        AddDelete_Img('RecordSeal/Insert_RecordSeal', formdata, EncFormdata)
            .then((res) => {
                if (res.success) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message); setSelectedFileName([]); setSelectedFile([]); get_SealUnsealData(selectedRows); setSelectedRowStatus(isSeal ? true : false);
                    setSelectedRows([]); setSelectedChargeIds([]); setSelectedCheckedRows([]); setExpandedRow(null);
                    // setScreenPermissionsData(false);
                    // setScreenPermissionsData1(false);
                } else {
                    console.log("Something went wrong");
                }
            })
            .catch(err => console.log(err));
    };

    const columns2 = [
        {
            cell: (row) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(row.ArrestID)}
                        onChange={(e) => handleCheckboxChange(e, row)}
                    />
                    <button
                        onClick={() => handleExpandRow(row.ArrestID)}
                        style={{
                            transform: expandedRow === row.ArrestID ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease-in-out", marginLeft: "15px", width: "30px", height: "30px", border: "none", fontSize: "20px",
                        }}
                    >
                        {">"}
                    </button>
                </div>
            ),
            width: "120px",
        },
        {
            name: 'Incident Number', selector: (row) => row.IncidentNumber, sortable: true,
        },
        {
            name: 'Reported Date', selector: (row) => row.ReportedDate ? getShowingMonthDateYear(row.ReportedDate) : " ", sortable: true,
        },
        {
            name: 'Location', selector: (row) => row.CrimeLocation?.trim(), sortable: true,
        },
    ];

    const columns1 = [
        {
            name: "Select",
            cell: (row) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        checked={selectedChargeIds.includes(row.ChargeID)} // Check if child charge is selected
                        onChange={() => handleCheckboxChangesCharge(row)}
                    // Toggle selection of child charge
                    />
                </div>
            ),
            width: "120px",
        },
        // { name: 'Charge Code', selector: row => row?.ChargeCode_Description, sortable: true },
        // { name: 'Charge Description', selector: row => row?.NIBRS_Description, sortable: true },
        { name: 'TIBRS Code', selector: row => row?.NIBRS_Description, sortable: true },
        { name: 'Offense Code/Name', selector: row => row?.ChargeCode_Description, sortable: true },
        { name: 'Event Number', selector: row => row?.ArrestNumber, sortable: true },
        {
            width: '200px', name: 'Date/Time Of Seal',
            selector: (row) => row.DateTimeUnSeal ? getShowingDateText(row.DateTimeUnSeal) : row.DateTimeSeal ? getShowingDateText(row.DateTimeSeal) : " ",
            sortable: true
        },
        // {
        //     width: '120px',
        //     name: <p className='text-end' style={{ position: 'absolute', top: 8 }}>Attachment</p>,
        //     cell: row =>
        //         row?.SealFiles || row?.UnsealFiles ? (
        //             <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
        //                 <span
        //                     onClick={() => window.open(value?.SealUnseal === 1 ? row?.SealFiles : row?.UnsealFiles)}
        //                     className="btn btn-sm bg-green text-white px-1 py-0"
        //                 >
        //                     <i className="fa fa-eye"></i>
        //                 </span>
        //             </div>
        //         ) : null
        // },
        {
            width: '120px',
            name: (
                <p className="text-end" style={{ position: 'absolute', top: 8 }}>
                    Attachment
                </p>
            ),
            cell: row => {
                const fileUrl = row?.SealUnsealStatus ? row?.SealFiles : row?.UnsealFiles;

                return fileUrl ? (
                    <div style={{ position: 'absolute', top: 4, left: 20 }}>
                        <span
                            onClick={() => window.open(fileUrl, '_blank')}
                            className="btn btn-sm bg-green text-white px-1 py-0"
                            style={{ cursor: 'pointer' }}
                        >
                            <i className="fa fa-eye"></i>
                        </span>
                    </div>
                ) : null;
            }
        },


        { name: 'Performed By', selector: row => row?.SealOfficer || row?.UnSealOfficer, sortable: true },
        {
            name: 'Status Seal', selector: row => (row?.SealUnsealStatus ? 'Seal' : 'Unseal'), sortable: true
        }
    ];



    const handleUnsealSubmit = (actionType) => {
        setAction(actionType); Add_SealOrUnseal(actionType); setShowModal(false);
    };

    const check_Validation_Error = (e) => {
        const File_Not_SelectedErr = validate_fileupload(selectedFileName);
        setErrors(prevValues => {
            return { ...prevValues, ['File_Not_Selected']: File_Not_SelectedErr || prevValues['File_Not_Selected'], }
        })
    }
    const { File_Not_Selected } = errors

    useEffect(() => {
        if (File_Not_Selected === 'true') {
            handleUnsealSubmit(actionType);
        }
    }, [File_Not_Selected])

    const handleCheckboxChange = async (e, selectedRow) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setExpandedRow(null);
            setSelectedRows([selectedRow.ArrestID]);
            await get_ArrestChargeDataget_SealUnsealData(selectedRow?.ArrestID);
            get_ScreenPermissionsData(loginAgencyID, loginPinID); setSelectedRowData(selectedRow); setStatesChangeStatus(true);
            setSelectedRow(selectedRow); setTransactionName(selectedRow.TransactionName);
            setTransactionId(selectedRow.ID); setTransactionNumber(selectedRow?.ArrestNumber);
            setArrestSelectCount(selectedRow.selectedRows); setselectionLockedArrest(true);
        } else {
            get_ScreenPermissionsData();
            setselectionLockedArrest(false); setExpandedRow(null); setSelectedChargeIds([]);
            setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== selectedRow.ArrestID));
        }
    };

    const handleExpandRow = (id) => {
        setExpandedRow((prev) => {
            const newExpandedRow = prev === id ? null : id;
            if (newExpandedRow) {
                get_SealUnsealData(id);
            }
            return newExpandedRow;
        });
    };

    const handleCheckboxChangesCharge = (chargeId) => {

        const newSelectedChargeIds = selectedChargeIds.includes(chargeId.ChargeID)
            ? selectedChargeIds.filter((id) => id !== chargeId.ChargeID)
            : [...selectedChargeIds, chargeId.ChargeID];
        setSelectedChargeIds(newSelectedChargeIds);
        const parentRow = logData.find(row => row.ArrestID === chargeId.ArrestID);
        const childRows = sealUnsealData.filter(charge => charge.ArrestID === chargeId.ArrestID);
        const allChildSelected = childRows.every(charge => newSelectedChargeIds.includes(charge.ChargeID));
        setSelectedRows((prevSelected) => {
            if (allChildSelected) {
                if (!prevSelected.includes(parentRow.ArrestID)) {
                    return [...prevSelected, parentRow.ArrestID];
                }
            } else {

                return prevSelected?.filter(rowId => rowId !== parentRow.ArrestID);
            }
            return prevSelected;
        });
        get_ScreenPermissionsData(loginAgencyID, loginPinID);
        const anyChildUnchecked = childRows.some(charge => !newSelectedChargeIds.includes(charge.ChargeID));
        if (anyChildUnchecked) {
            setSelectedRows((prevSelected) => prevSelected.filter(rowId => rowId !== parentRow.ArrestID));
            get_ScreenPermissionsData(loginAgencyID, loginPinID);
        }
        if (childRows.length === 1 && newSelectedChargeIds.includes(chargeId.ChargeID)) {
            get_ScreenPermissionsData(loginAgencyID, loginPinID);
            setSelectedRows((prevSelected) => {
                if (!prevSelected.includes(parentRow.ArrestID)) {
                    return [...prevSelected, parentRow.ArrestID];
                }
                return prevSelected;
            });
        }
    };


    const get_ScreenPermissionsData = async (loginAgencyID, loginPinID) => {
        const val2 = { 'AgencyID': loginAgencyID, 'PINID': loginPinID };
        try {
            const res = await fetchPostData("RecordSeal/GetUserSealPermission", val2);
            if (res && Array.isArray(res) && res.length > 0) {
                const { IsAllowSeal, IsAllowUnSeal } = res[0];

                setScreenPermissionsData1(IsAllowUnSeal === 1);
                setScreenPermissionsData(IsAllowSeal === 1);
            } else {
                setScreenPermissionsData(false);
                setScreenPermissionsData1(false);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setArrestChareData([]); // Handle error case
        }
    };

    const isActionDisabled = () => {
        return (
            selectedChargeIds.length === 0 ||
            !sealUnsealData.some(charge => selectedChargeIds.includes(charge.ChargeID))
        );
    };



    return (
        <>
            <div className="section-body view_page_design pt-1 p-1 bt ">
                <div className="div">
                    <div className="col-12 inc__tabs">
                        <SealUnsealTab />
                    </div>
                    <div className="dark-row">
                        <div className="col-12 col-sm-12">
                            <div className="card Agency incident-card ">
                                <div className="card-body">
                                    <div className="col-12 col-md-12 col-lg-12 child ">
                                        <div className="row " style={{ marginTop: '-10px' }}>
                                            <div className="col-2 col-md-2 col-lg-1  mt-2">
                                                <label htmlFor="" className='new-label  '>Last Name</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3  text-field mt-1">
                                                <input type="text" name='LastName' autoComplete='off' value={value.LastName} onChange={(e) => { handleChange(e) }} />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1  mt-2">
                                                <label htmlFor="" className='new-label '>First Name</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3  text-field  mt-1">
                                                <input type="text" name='FirstName' autoComplete='off' value={value.FirstName} onChange={(e) => { handleChange(e) }} />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1  mt-2 px-0">
                                                <label htmlFor="" className='new-label px-0'>Middle&nbsp;Name</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3  text-field  mt-1">
                                                <input type="text" name='MiddleName' autoComplete='off' value={value.MiddleName} onChange={(e) => { handleChange(e) }} />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                                <label htmlFor="" className='new-label'>Gender</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                <Select
                                                    name='SexID'
                                                    value={sexIdDrp?.filter((obj) => obj.value === value?.SexID)}
                                                    options={sexIdDrp}
                                                    onChange={(e) => ChangeDropDown(e, 'SexID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                <label htmlFor="" className='new-label'>DOB</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 ">
                                                <DatePicker
                                                    id='DateOfBirth'
                                                    name='DateOfBirth'
                                                    className=''
                                                    onChange={(date) => {
                                                        setdateOfbirth(date); setValue({ ...value, ['DateOfBirth']: date ? getShowingMonthDateYear(date) : null, });
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.DateOfBirth ? true : false}
                                                    selected={dateOfbirth}
                                                    placeholderText={value?.DateOfBirth ? value?.DateOfBirth : 'Select...'}
                                                    maxDate={new Date()}
                                                    // showTimeSelect
                                                    timeIntervals={1}
                                                    // timeCaption="Time"
                                                    autoComplete="Off"

                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1  mt-2">
                                                <label htmlFor="" className='new-label '>SSN</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3  text-field  mt-1">
                                                <input type="text" name='SSN' autoComplete='off' value={value.SSN} maxLength={9} onChange={(e) => { handleChange(e) }} />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                                <label htmlFor="" className='new-label'>Race</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                <Select
                                                    name='RaceID'
                                                    value={raceIdDrp?.filter((obj) => obj.value === value?.RaceID)}
                                                    options={raceIdDrp}
                                                    onChange={(e) => ChangeDropDown(e, 'RaceID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="col-2 col-md-2 col-lg-1 mt-2 ">
                                                <label htmlFor="" className='new-label'>Ethnicity</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                <Select
                                                    name='EthnicityID'
                                                    value={ethinicityDrpData?.filter((obj) => obj.value === value?.EthnicityID)}
                                                    options={ethinicityDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'EthnicityID')}
                                                    isClearable
                                                    placeholder="Select..."
                                                />
                                            </div>
                                            <div className="btn-box col-4  text-right   mb-1 mt-3">
                                                {
                                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.SexID, value.RaceID, value.EthnicityID, true)}>Search</button>
                                                        : <></> :
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.SexID, value.RaceID, value.EthnicityID, true)}>Search</button>
                                                }
                                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={onDashboardClose} >Close</button>
                                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={Clear}>Clear</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={nameSearchValue}
                                            onSelectedRowsChange={handleRowSelected}
                                            pagination
                                            conditionalRowStyles={conditionalRowStyles}
                                            onRowClicked={(row) => {
                                                setClickedRow(row);
                                                if (row?.MasterNameID) { setMasterNameID(row?.MasterNameID); setIncidentID(row?.IncidentID); get_LogData(row?.MasterNameID); setScreenPermissionsData(false); setScreenPermissionsData1(false); get_ScreenPermissionsData(loginAgencyID, loginPinID); }
                                            }}
                                            highlightOnHover
                                            fixedHeaderScrollHeight="150px"
                                            fixedHeader
                                            persistTableHead={true}
                                            customStyles={tableCustomStyles}
                                        />
                                    </div>
                                    <div className="col-12 bg-line py-1 d-flex justify-content-between align-items-center mt-1 text-white mt-3">
                                        <p className="p-0 m-0">Select Charges to be Seal/Unseal</p>
                                        <div className="ml-auto" style={{ width: '200px' }}>
                                            <SelectBox
                                                name="SealUnseal"
                                                options={AddType}
                                                // isClearable
                                                placeholder="Filter..."
                                                value={AddType?.filter((obj) => obj.value === value?.SealUnseal)}
                                                onChange={(selectedOption) => {
                                                    const newValue = selectedOption ? selectedOption.value : '';
                                                    if (newValue !== value.SealUnseal) {
                                                        setSelectedRows([]); setSelectedChargeIds([]);
                                                    }
                                                    // setScreenPermissionsData1(false);
                                                    // setScreenPermissionsData(false);
                                                    if (nameSearchValue.length > 0) { get_ScreenPermissionsData(loginAgencyID, loginPinID); }
                                                    setValue({ ...value, SealUnseal: newValue }); setExpandedRow(null);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 mt-1">
                                        <DataTable
                                            columns={columns2}
                                            data={logData}
                                            expandableRows
                                            dense
                                            persistTableHead={true}
                                            fixedHeader
                                            pagination
                                            selectableRowsHighlight
                                            expandableRowExpanded={(row) => expandedRow === row.ArrestID}
                                            selectableRowDisabled={(row) => selectionLockedArrest && !selectedRowData?.includes(row)}
                                            expandableRowsComponent={({ data: row }) => {
                                                const childDetails = sealUnsealData.filter((charge) => charge.ArrestID === row.ArrestID);
                                                return (
                                                    <div
                                                        style={{
                                                            padding: "10px", background: "#f3f3f3", borderBottom: "1px solid #ccc", marginLeft: "30px",
                                                        }}
                                                    >
                                                        {childDetails.length > 0 && (
                                                            <DataTable
                                                                columns={columns1}
                                                                data={childDetails}
                                                                noHeader
                                                                pagination
                                                                conditionalRowStyles={[{
                                                                    when: row => row?.SealUnsealStatus === true,
                                                                    style: { backgroundColor: '#FFCCCC', color: 'black' }
                                                                }]}
                                                                customStyles={{
                                                                    headRow: {
                                                                        style: {
                                                                            color: '#fff', backgroundColor: '#001f3f', borderBottomColor: '#FFFFFF', outline: '1px solid #FFFFFF',
                                                                            minHeight: "32px",
                                                                        },
                                                                    },
                                                                    expanderRow: {
                                                                        style: { display: "table-row" },
                                                                    },
                                                                    expanderCell: {
                                                                        style: { display: "none" },
                                                                    },
                                                                    table: {
                                                                        style: { maxHeight: '400px', overflowY: 'auto', },
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            }}
                                            expandOnRowClicked={false}
                                            customStyles={{
                                                headRow: {
                                                    style: {
                                                        color: '#fff', backgroundColor: '#001f3f', borderBottomColor: '#FFFFFF', outline: '1px solid #FFFFFF',
                                                    },
                                                },
                                                expanderRow: { style: { display: "table-row" }, },
                                                expanderCell: { style: { display: "none" }, },
                                            }}
                                        />
                                    </div>

                                    <div className="btn-box text-right mr-1 mt-2">
                                        {ScreenPermissionsData && value?.SealUnseal === 1 && (

                                            <button
                                                type="button" className="btn btn-sm btn-success mr-1" onClick={() => { setShowModal(true); setActionType('seal'); }} disabled={isActionDisabled()}
                                            >
                                                Seal
                                            </button>

                                        )}

                                        {ScreenPermissionsData1 && value?.SealUnseal === 2 && (

                                            <button
                                                type="button" className="btn btn-sm btn-success mr-1" onClick={() => { setShowModal(true); setActionType('unseal'); }} disabled={isActionDisabled()}
                                            >
                                                UnSeal
                                            </button>

                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >



            {/* Modal for UnSeal */}
            {
                showModal && (
                    <div className="modal fade show" style={{ background: "rgba(0,0,0, 0.5)", display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    {selectedFileName?.length > 0 &&
                                        <i className="fa fa-close" style={{ position: "absolute", right: "1rem", top: "7px" }} onClick={() => { setSelectedFileName(''); document.querySelector("input[type='file']").value = "" }}></i>}
                                    <div className="col-12 col-md-12 col-lg-12 text-field ">
                                        <h6 htmlFor="sealUnsealData" >Are you sure you want to {actionType === 'seal' ? 'Seal' : 'Unseal'} this record?
                                            First please attach the document to proceed.</h6>
                                        <input className='mt-2 requiredColor' type="file" name='file' onChange={changeHandler} required />

                                    </div>
                                    {errors.File_Not_Selected !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.File_Not_Selected}</p>
                                    ) : null}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => { setShowModal(false); setErrors('') }}>Cancel</button>
                                    <button type="button" className="btn btn-primary" onClick={() => check_Validation_Error()}>Submit</button>
                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default SealUnseal;
function validate_fileupload(fileName) {
    if (fileName.length > 0 && fileName.length < 2) {
        return 'true';
    } else if (fileName.length > 1) {
        toastifyError("Please Select Single File");
    } else {
        return 'Please Select File*';
    }

}
