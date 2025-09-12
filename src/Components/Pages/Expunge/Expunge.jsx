import { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { base64ToString, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles } from '../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { Comman_changeArrayFormat } from '../../Common/ChangeArrayFormat';
import { fetchPostData } from '../../hooks/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpungeConfirmModel from '../../Common/ExpungeConfirmModel';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import ExpungeEventConfirmModel from '../../Common/ExpungeEventConfirmModel';


const Expunge = () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [loginAgencyID, setloginAgencyID] = useState('');
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [dateOfbirth, setdateOfbirth] = useState();
    const [nameSearchValue, setNameSearchValue] = useState([]);
    const [logData, setLogData] = useState([]);
    const [loginPinID, setLoginPinID,] = useState('');
    const [masterNameID, setMasterNameID] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [initialExpungeDone, setInitialExpungeDone] = useState(false);
    const [clearSelectedRows, setClearSelectedRows] = useState(false);
    const [notes, setNotes] = useState('');
    const [transactionId, setTransactionId] = useState([]);
    const [transactionNumber, setTransactionNumber] = useState([]);
    const [selectionLockedArrest, setselectionLockedArrest] = useState(false);
    const [primaryNameSelectCount, setPrimaryNameSelect] = useState([]);
    const [arrestChareData, setArrestChareData] = useState([]);
    const [arrestId, setArrestId] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedChargeIds, setSelectedChargeIds] = useState([]);
    const [selectedCheckedRows, setSelectedCheckedRows] = useState([]);
    const [victimCountStatus, setVictimCountStatus] = useState('');
    const [offenderCountStatus, setoffenderCountStatus] = useState('');
    const [transactionName, setTransactionName] = useState([]);
    const [eventConfirm, seteventConfirm] = useState(false);

    const [value, setValue] = useState({
        'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'DateOfBirth': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '',
    })

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DeNameID = 0, DeMasterNameID = 0

    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    let openPage = query?.get('page');
    var NameID = query?.get("NameID");
    var NameStatus = query?.get("NameStatus");
    var MasterNameID = query?.get("MasterNameID");
    let MstPage = query?.get('page');

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!NameID) NameID = 0;
    else DeNameID = parseInt(base64ToString(NameID));
    if (!MasterNameID) MasterNameID = 0;
    else DeMasterNameID = parseInt(base64ToString(MasterNameID));


    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("U117", localStoreData?.AgencyID, localStoreData?.PINID));

        }
    }, [localStoreData]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'SSN') {
            let ele = value.replace(/\D/g, '');
            if (ele.length === 9) {
                const cleaned = ('' + ele).replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
                if (match) {
                    setValue((prevState) => ({
                        ...prevState,
                        [name]: match[1] + '-' + match[2] + '-' + match[3],
                    }));
                }
            } else {
                ele = value.split('-').join('').replace(/\D/g, '');
                setValue((prevState) => ({
                    ...prevState,
                    [name]: ele,
                }));
            }
        } else {
            if (event) {
                setValue((prevState) => ({ ...prevState, [name]: value }));
            } else {
                setValue((prevState) => ({ ...prevState, [name]: null }));
            }
        }
    };

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else {
            setValue({
                ...value,
                [name]: null
            });
        }
    };

    useEffect(() => {
        if (loginAgencyID) {
            get_Name_Drp_Data(loginAgencyID)
        }

    }, [loginAgencyID])

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


    const getNameSearch = async (LastName, FirstName, MiddleName, DateOfBirth, SSN, Gender, type) => {
        if (LastName || DateOfBirth || FirstName || MiddleName || SSN || Gender || value.RaceID || value.EthnicityID) {
            if (selectionLockedArrest) {
                setselectionLockedArrest(false);
            }
            if (selectedRows.length > 0) {
                setSelectedRows([]);
                setSelectedChargeIds([]);
            }
            if (arrestChareData.length > 0) {
                setArrestChareData([]);
            }
            if (selectedRows) {
                setSelectedRows([]);
            }
            if (selectedCheckedRows) {
                setSelectedCheckedRows([]);
            }
            if (logData) {
                setLogData([]);
            }
            setExpandedRow(null);
            fetchPostData("MasterName/Search_Name", {
                "NameTypeID": 1, "LastName": LastName, "FirstName": FirstName || null, "MiddleName": MiddleName || null, "SSN": SSN || null,
                'AgencyID': loginAgencyID || null, "NameIDNumber": "", "NameReasonCodeID": "", "SuffixID": "",
                "DateOfBirthFrom": '', "DateOfBirthTo": "", "SexID": Gender, "RaceID": value.RaceID, "EthnicityID": value.EthnicityID, "HairColorID": "",
                "EyeColorID": "", "WeightFrom": "", "WeightTo": "", "SMTTypeID": "", "SMTLocationID": "", "SMT_Description": "", "IncidentNumber": "", "IncidentNumberTo": "",
                "ReportedDate": "", "ReportedDateTo": "", "DateOfBirth": DateOfBirth, "HeightFrom": "", "HeightTo": ""
            }).then((data) => {
                if (data.length > 0) {
                    const [{ MasterNameID, NameIDNumber }] = data;
                    setNameSearchValue(data);
                    setLogData([]);
                } else {
                    setNameSearchValue([]);
                    toastifyError('No Name Available')
                }
            });
        } else {
            toastifyError('No Data Available')
        }
    };

    const get_LogData = (MasterNameID) => {
        const val2 = { 'NameID': 0, 'MasterNameID': MasterNameID, 'IsMaster': true }
        fetchPostData("Expunge/GetData_ExpungArrest", val2).then((res) => {
            if (res?.length > 0) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        })
    }


    const get_DeletedData = () => {
        const val2 = { 'ArrestID': arrestId, 'ChargeID': selectedChargeIds, 'DeletedByUserFK': loginPinID, "Notes": notes, 'ArrestNumber': '', 'TransactionType': transactionName, 'ID': transactionId, 'TransactionNumber': transactionNumber, 'PrimaryOfficerID': loginPinID };
        fetchPostData("MasterName/Delete_Name", val2).then((res) => {
            if (res) {
                if (res.data) {
                    try {
                        const parsedData = JSON.parse(res.data);
                        if (parsedData && parsedData.length > 0 && parsedData[0].Message) {
                            const deleteMessage = parsedData[0].Message;
                            toastifySuccess(deleteMessage);
                            get_ArrestChargeData(arrestId);

                        }
                    } catch (error) {

                    }
                } else if (Array.isArray(res) && res.length > 0 && res[0].Message) {
                    const deleteMessage = res[0].Message;
                    toastifySuccess(deleteMessage);
                    setLogData([]);
                }
                get_ArrestChargeData(arrestId);
            } else {
                setLogData([]);
            }
        }).catch(error => {

        });

    };

    const get_DeletedDatas = () => {
        const val2 = { 'NameID': 0, 'MasterNameID': masterNameID, 'DeletedByUserFK': loginPinID, "Notes": notes };
        fetchPostData("MasterName/Delete_Name", val2).then((res) => {
            if (res) {
                if (res.data) {
                    try {
                        const parsedData = JSON.parse(res.data);
                        if (parsedData && parsedData.length > 0 && parsedData[0].Message) {
                            const deleteMessage = parsedData[0].Message;
                            toastifySuccess(deleteMessage);
                            get_LogData(NameID);
                        }
                    } catch (error) {

                    }
                } else if (Array.isArray(res) && res.length > 0 && res[0].Message) {
                    const deleteMessage = res[0].Message;
                    getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.SexID, true);
                    toastifySuccess(deleteMessage);
                    setArrestChareData([]);

                }
                get_LogData(masterNameID);
            } else {
                setLogData([]);
            }
        }).catch(error => {

        });

    };

    const handleRowSelected = (selectedRows) => {
        if (selectedRows.selectedRows.length > 0) {
            const selectedRow = selectedRows.selectedRows[0];
            setPrimaryNameSelect(selectedRows.selectedRows)
            setMasterNameID(selectedRow.MasterNameID);
            get_LogData(selectedRow.MasterNameID);
            setClearSelectedRows([]);

        } else {
            setMasterNameID(null);
            setLogData([]);
            setPrimaryNameSelect(selectedRows.selectedRows)
            setClearSelectedRows([]);
        }
    };

    const get_ArrestChargeData = async (ArrestID) => {
        const val2 = { 'ArrestID': ArrestID };
        try {
            const res = await fetchPostData("Expunge/GetData_ExpungArrestCharge", val2);
            if (res) {
                setArrestChareData(res);
            } else {
                setArrestChareData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setArrestChareData([]);
        }
    };



    const columns2 = [
        {
            name: "Select",
            cell: (row) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        checked={selectedChargeIds.includes(row.ChargeID)}
                        onChange={() => handleCheckboxChangesCharge(row)}

                    />
                </div>
            ),
            width: "120px",
        },
        {
            name: 'TIBRS Code',
            selector: (row) => row.NIBRS_Code,
            sortable: true,
        },
        {
            name: 'Offense Code / Description',
            selector: (row) => row.ChargeCode_Description,
            sortable: true,
        },
        {
            name: 'Date/Time',
            selector: (row) => getShowingDateText(row.CreatedDtTm),
            sortable: true,
        },
    ];


    const reset = () => {
        setValue({
            ...value,
            'LastName': '', 'FirstName': '', 'MiddleName': '', 'SSN': '', 'DateOfBirth': '', 'SexID': '', 'RaceID': '', 'EthnicityID': '',
        });
        setdateOfbirth("");
        setNameSearchValue([]);
        setLogData([]);
        setShowModal('');
        setInitialExpungeDone('');
        setNotes('');
        setPrimaryNameSelect([]);
        setClearSelectedRows([]);
        setselectionLockedArrest(false);
        setSelectedRows('');
        setSelectedRows([]);
        setSelectedChargeIds([]);
        setArrestChareData([]);
        setExpandedRow(null);

    }


    const columns = [
        {
            name: 'Name Number',
            selector: (row) => row.NameIDNumber,
            sortable: true
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
            name: 'Gender',
            selector: (row) => row.Gender_Description,
            sortable: true
        },
        {
            name: 'DOB',
            selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ",

            sortable: true
        },
        {
            name: 'Race',
            selector: (row) => row.Race_Description,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => row.SSN,
            sortable: true
        },

    ]


    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])

    const handleExpungeClick = () => {
       

            if (arrestId) {
                get_DeletedData();
                setNotes('');
                setClearSelectedRows([]);
                const childCharges = arrestChareData.filter((charge) => charge.ArrestID === arrestId);
                const onlyCharge = childCharges[0];

                if ((childCharges.length === 1 && selectedChargeIds.includes(onlyCharge.ChargeID)) || (childCharges.length === selectedChargeIds.length)) {
                    setShowModal(true);
                } else {

                }
            }
       
    };



    const handleConfirmExpunge = () => {
        get_DeletedDatas();
        setShowModal(false);
        setInitialExpungeDone(false);
        setClearSelectedRows(!clearSelectedRows);
        setSelectedChargeIds([]);
    };

    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])

    const onDashboardClose = () => {
        navigate('/dashboard-page');
    }

    const handleCheckboxChange = async (e, selectedRow) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setExpandedRow(null);
            setSelectedRows([selectedRow.ArrestID]);
            setVictimCountStatus(selectedRow.VictimCount);
            setoffenderCountStatus(selectedRow.OffenderCount);
            await get_ArrestChargeDataCheckbox(selectedRow?.ArrestID);

            setSelectedRowData(selectedRow);
            setTransactionId(selectedRow.ID);
            setTransactionNumber(selectedRow?.ArrestNumber);
            setArrestId(selectedRow?.ArrestID);
            setTransactionName(selectedRow.TransactionName);

            setselectionLockedArrest(true);
        } else {
            setselectionLockedArrest(false);
            setSelectedChargeIds([]);
            setSelectedRows((prevSelected) =>
                prevSelected.filter((rowId) => rowId !== selectedRow.ArrestID)
            );
        }
    };


    const get_ArrestChargeDataCheckbox = async (ArrestID) => {
        const val2 = { 'ArrestID': ArrestID };
        try {
            const res = await fetchPostData("Expunge/GetData_ExpungArrestCharge", val2);
            if (res) {

                setArrestChareData(res);
                const childDetails = res.filter((charge) => charge.ArrestID === ArrestID);
                setSelectedCheckedRows(res);

                setSelectedChargeIds(childDetails.map(charge => charge.ChargeID));
            } else {
                setArrestChareData([]);
            }
        } catch (error) {

            setArrestChareData([]);
        }
    };




    const handleCheckboxChangesCharge = (chargeId) => {

        setSelectedCheckedRows((prevSelected) => {
            if (prevSelected.some((selectedRow) => selectedRow.ChargeID === chargeId.ChargeID)) {
                return prevSelected.filter((selectedRow) => selectedRow.ChargeID !== chargeId.ChargeID);
            } else {
                return [...prevSelected, chargeId];
            }
        });
        setSelectedChargeIds((prevSelected) => {
            if (prevSelected.includes(chargeId.ChargeID)) {
                return prevSelected.filter((id) => id !== chargeId.ChargeID);
            } else {
                return [...prevSelected, chargeId.ChargeID];
            }
        });

    };

    useEffect(() => {
        selectedCheckedRows.forEach((chargeId) => {
            const parentRow = logData?.find((row) => row.ArrestID === chargeId.ArrestID);
            const childRows = arrestChareData?.filter((charge) => charge.ArrestID === chargeId.ArrestID);

            const allChildSelected = childRows.every((charge) => selectedChargeIds.includes(charge.ChargeID));
            setArrestId(parentRow?.ArrestID);
            if (allChildSelected) {
                setSelectedRows((prevSelected) => {
                    if (!prevSelected.includes(parentRow?.ArrestID)) {
                        return [...prevSelected, parentRow?.ArrestID];
                    }
                    return prevSelected;
                });
            } else {
                setSelectedRows([]);
            }
        });
    }, [selectedChargeIds, logData, arrestChareData]);




    const columnss = [
        {

            cell: (row) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(row.ArrestID)}
                        onChange={(e) => handleCheckboxChange(e, row)}
                    />
                    <button
                        onClick={() => handleExpandRow(row)}
                        style={{
                            transform: expandedRow === row.ArrestID ? "rotate(90deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease-in-out",
                            marginLeft: "15px",
                            width: "30px",
                            height: "30px",
                            border: "none",
                            fontSize: "20px"
                        }}
                    >
                        {">"}
                    </button>
                </div>
            ),

            width: "120px",
        },
        {
            name: 'MNI',
            selector: (row) => row.NameIDNumber,
            sortable: true
        },
        {
            name: 'Transaction Name',
            selector: (row) => row.TransactionName,
            sortable: true
        },
        {
            name: 'Transaction Number',
            selector: (row) => row.ArrestNumber,
            sortable: true
        },
        {
            name: 'Date/Time',
            selector: (row) => getShowingDateText(row.CreatedDtTm),
            sortable: true
        },
    ];




    const handleExpandRow = (id) => {
        setExpandedRow((prev) => {
            const newExpandedRow = prev === id.ArrestID ? null : id.ArrestID;
            if (newExpandedRow) {
                get_ArrestChargeData(id.ArrestID);
            }

            return newExpandedRow;
        });

        setVictimCountStatus(id.VictimCount);
        setoffenderCountStatus(id.OffenderCount);

    };

    const ConfirmNotes =(()=>{
         if (!initialExpungeDone) {
            if (!notes.trim()) {
                toastifyError("Notes required");
                return;
            }

            handleOpenModal()
        }
       
    })

    const handleOpenModal = () => seteventConfirm(true);
    const handleCloseModal = () => seteventConfirm(false);


    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency  name-card">
                            <div className="card-body">
                                <div className="col-12 col-md-12 col-lg-12 ">
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
                                                placeholderText={value?.DateOfBirth ? value.DateOfBirth : 'Select...'}
                                                maxDate={new Date()}
                                                timeIntervals={1}
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
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-1">
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={nameSearchValue}
                                        pagination
                                        highlightOnHover
                                        fixedHeaderScrollHeight='120px'
                                        fixedHeader
                                        persistTableHead={true}
                                        customStyles={tableCustomStyles}
                                        selectableRowsHighlight
                                        onSelectedRowsChange={handleRowSelected}
                                        selectableRowDisabled={(row) => selectionLockedArrest && !primaryNameSelectCount?.includes(row)}
                                        selectableRows
                                        selectableRowsSingle
                                        headerCheckboxAll={false}
                                    />

                                </div>
                                <fieldset className='mt-2 mb-1'>
                                    <legend>Select Event To be Deleted</legend>
                                    <div className="col-12 mt-3 px-0">
                                        <DataTable
                                            columns={columnss}
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
                                                const childDetails = arrestChareData.filter((charge) => charge.ArrestID === row.ArrestID);

                                                return (
                                                    <div
                                                        style={{
                                                            padding: "10px",
                                                            background: "#f3f3f3",
                                                            borderBottom: "1px solid #ccc",
                                                            marginLeft: "30px",
                                                        }}
                                                    >
                                                        {childDetails.length > 0 && (
                                                            <DataTable
                                                                columns={columns2}
                                                                data={childDetails}
                                                                noHeader
                                                                pagination
                                                                customStyles={{
                                                                    headRow: {
                                                                        style: {
                                                                            color: '#fff',
                                                                            backgroundColor: '#001f3f ',
                                                                            borderBottomColor: '#FFFFFF',
                                                                            outline: '1px solid #FFFFFF',
                                                                            minHeight: "32px"
                                                                        },
                                                                    },
                                                                    expanderRow: {
                                                                        style: { display: "table-row" },
                                                                    },
                                                                    expanderCell: {
                                                                        style: { display: "none" },
                                                                    },
                                                                    table: {
                                                                        style: {
                                                                            maxHeight: '400px',
                                                                            overflowY: 'auto',
                                                                        },
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
                                                        color: '#fff',
                                                        backgroundColor: '#001f3f ',
                                                        borderBottomColor: '#FFFFFF',
                                                        outline: '1px solid #FFFFFF',
                                                    },
                                                },
                                                expanderRow: {
                                                    style: { display: "table-row" },
                                                },
                                                expanderCell: {
                                                    style: { display: "none" },
                                                },
                                            }}
                                        />


                                    </div>
                                </fieldset>
                                <div className="col-12  bt">
                                    <div className="row">
                                        <div className="col-2 col-md-2 col-lg-1 mt-3">
                                            <label htmlFor="" className='label-name '>Notes</label>
                                        </div>
                                        <div className="col-10 col-md-10 col-lg-11 text-field mt-1" >
                                            <textarea name='Notes' id="Notes" value={notes} onChange={(e) => { setNotes(e.target.value) }} cols="30" rows='1' className="form-control pt-2 pb-2 requiredColor" style={{ resize: "none" }} ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 field-button text-right mt-1 "  >
                                    <button type="button" data-toggle="modal" data-target="#EventConfirm" className="btn btn-sm btn-success mr-1" disabled={selectedChargeIds.length === 0} onClick={ConfirmNotes}

                                    >Expunge</button>
                                    <button type="button" data-toggle="modal" data-target="#myModal" onClick={() => { reset(); }} className="btn btn-sm btn-success ">Clear</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <ExpungeConfirmModel victimCountStatus={victimCountStatus} offenderCountStatus={offenderCountStatus} showModal={showModal}
                setShowModal={setShowModal}
                onConfirm={handleConfirmExpunge} />

            <ExpungeEventConfirmModel showModal={showModal} handleCloseModal={handleCloseModal} eventConfirm={eventConfirm} arrestId={arrestId} seteventConfirm={seteventConfirm} func={handleExpungeClick} />




        </>
    )
}

export default Expunge

