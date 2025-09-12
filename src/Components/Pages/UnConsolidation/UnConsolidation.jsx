import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { base64ToString, getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useContext } from 'react'
import { Comman_changeArrayFormat } from '../../Common/ChangeArrayFormat';
import { fetchPostData } from '../../hooks/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '../Arrest/ConfirmModal';
import ExpungeConfirmModel from '../../Common/ExpungeConfirmModel';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data } from '../../../redux/actions/DropDownsData';

const UnConsolidation = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const [loginAgencyID, setloginAgencyID] = useState('');
    const [ethinicityDrpData, setEthinicityDrpData] = useState([]);
    const [sexIdDrp, setSexIdDrp] = useState([]);
    const [raceIdDrp, setRaceIdDrp] = useState([]);
    const [dateOfbirth, setdateOfbirth] = useState();
    const [dateTo, setdateTo] = useState();
    const [nameSearchValue, setNameSearchValue] = useState([]);
    const [logData, setLogData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loginPinID, setLoginPinID,] = useState('');
    const [nameId, setNameID] = useState('');
    const [masterNameID, setMasterNameID] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [initialExpungeDone, setInitialExpungeDone] = useState(false);
    const [clearSelectedRows, setClearSelectedRows] = useState(false);
    const [notes, setNotes] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [transactionName, setTransactionName] = useState([]);
    const [transactionId, setTransactionId] = useState([])
    const [selectionLocked, setSelectionLocked] = useState(false);
    const [primaryNameSelectCount, setPrimaryNameSelect] = useState([]);
    const [selectedRowData, setSelectedRowData] = useState(null);


    const [value, setValue] = useState({
        'ConsolidateDatefrom': '', 'ConsolidateDateTo': '', 'AgencyID': '', 'OfficerID': '', 'IsCurrentPh': '', 'ConsolidationType': '',
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
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, ''));
        }
    }, [localStoreData]);


    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     if (event) {
    //         setValue((prevState) => ({ ...prevState, [name]: value, }));
    //     }
    //     else {
    //         setValue((prevState) => ({ ...prevState, [name]: null, }));
    //     }
    // };



    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
            // setPossessionID(e.value);
        } else {
            setValue({
                ...value,
                [name]: null
            });
            // setPossessionID('');
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

    // const getNameSearch = async (ConsolidateDatefrom, ConsolidateDateTo, ConsolidationType, OfficerID, AgencyID) => {
    //     if (!ConsolidateDatefrom && !ConsolidateDateTo && !ConsolidationType && !OfficerID) {
    //         toastifyError('Please enter details');
    //         return;
    //     }
    //     if (ConsolidateDatefrom || ConsolidateDateTo || ConsolidationType || OfficerID || AgencyID) {
    //         fetchPostData("Consolidation/GetData_ConsolidateHistory", {
    //             'AgencyID': loginAgencyID,
    //             "ConsolidateDatefrom": ConsolidateDatefrom, "ConsolidateDateTo": ConsolidateDateTo, 'ConsolidationType': ConsolidationType, 'OfficerID': OfficerID,
    //         }).then((data) => {
    //             if (data.length > 0) {
    //                 const [{ MasterNameID, NameIDNumber }] = data;
    //                 setNameSearchValue(data);
    //                 console.log(data);
    //                 setLogData([]);
    //             } else {
    //                 setNameSearchValue([]);
    //             }
    //         });
    //     } else {
    //         toastifyError('No Data Available')
    //     }
    // };

    const getNameSearch = async (ConsolidateDatefrom, ConsolidateDateTo, ConsolidationType, OfficerID, AgencyID) => {
        if (!ConsolidateDatefrom && !ConsolidateDateTo && !ConsolidationType && !OfficerID) {
            toastifyError('Please enter details');
            return;
        }
        if (ConsolidateDatefrom || ConsolidateDateTo || ConsolidationType || OfficerID || AgencyID) {
            fetchPostData("Consolidation/GetData_ConsolidateHistory", {
                'AgencyID': loginAgencyID, "ConsolidateDatefrom": ConsolidateDatefrom, "ConsolidateDateTo": ConsolidateDateTo, 'ConsolidationType': ConsolidationType,
                'OfficerID': OfficerID,
            }).then((data) => {
                if (data.length > 0) {
                    const [{ MasterNameID, NameIDNumber }] = data;
                    setNameSearchValue(data);
                    console.log(data);
                    setLogData([]);
                } else {
                    setNameSearchValue([]);
                    toastifyError('No Data Available');  // ✅ Add this line here
                }
            });
        }
    };

    const get_LogData = (MasterNameID) => {
        const val2 = { 'NameID': 0, 'MasterNameID': MasterNameID, 'IsMaster': true }
        fetchPostData("TransactionLog/GetData_TransactionLog", val2).then((res) => {
            if (res?.length > 0) {
                console.log("Transaction log::", res)
                setLogData(res);
            } else {
                // console.log('hello');
                // toastifyError('No Data Available')
            }
        })
    }

    const get_DeletedData = () => {
        const val2 = { 'NameID': nameId, 'MasterNameID': 0, 'DeletedByUserFK': loginPinID, "Notes": notes, 'TransactionType': transactionName, 'ID': transactionId };
        fetchPostData("MasterName/Delete_Name", val2).then((res) => {
            if (res) {
                if (res.data) {
                    try {
                        const parsedData = JSON.parse(res.data);
                        if (parsedData && parsedData.length > 0 && parsedData[0].Message) {
                            const deleteMessage = parsedData[0].Message;
                            toastifySuccess(deleteMessage);
                            get_LogData(NameID);
                            setNameID('');
                        } else {

                        }
                    } catch (error) {

                    }
                } else if (Array.isArray(res) && res.length > 0 && res[0].Message) {
                    const deleteMessage = res[0].Message;
                    toastifySuccess(deleteMessage);
                    setNameID('');
                } else {

                }
                get_LogData(masterNameID);
            } else {
                setLogData([]);
            }
        }).catch(error => {

        });

    };

    const get_DeletedDatas = () => {
        const val2 = { 'NameID': nameId, 'MasterNameID': masterNameID, };
        fetchPostData("MasterName/Unexpunge", val2).then((res) => {
            if (res) {
                if (res.data) {
                    try {
                        const parsedData = JSON.parse(res.data);
                        if (parsedData && parsedData.length > 0 && parsedData[0].Message) {
                            const deleteMessage = parsedData[0].Message;
                            toastifySuccess(deleteMessage);
                            // getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.SexID, true);
                            get_LogData(NameID);
                            setNameID('');
                        } else {

                        }
                    } catch (error) {

                    }
                } else if (Array.isArray(res) && res.length > 0 && res[0].Message) {
                    const deleteMessage = res[0].Message;
                    getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.SexID, true);
                    toastifySuccess(deleteMessage);
                    setNameID('');
                } else {

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
            console.log(selectedRows);
            const selectedRow = selectedRows.selectedRows[0];
            setPrimaryNameSelect(selectedRows.selectedRows)
            setSelectedRow(selectedRow);
            setMasterNameID(selectedRow.MasterNameID);
            setNameID(selectedRow.NameID)
            // get_LogData(selectedRow.MasterNameID);
            setStatesChangeStatus(true);
            setSelectionLocked(true);
            setClearSelectedRows([]);
        } else {
            setSelectedRow(null);
            setMasterNameID(null);
            setLogData([]);
            // get_LogData('');
            setStatesChangeStatus(false);
            setSelectionLocked(false);
            setPrimaryNameSelect(selectedRows.selectedRows)
            setClearSelectedRows([]);
        }
    };


    const handleRowDeleted = (selectedRows) => {
        const selectedRow = selectedRows.selectedRows[0];
        if (selectedRows.selectedRows.length > 0) {
            if (selectedRows.selectedCount === logData.length) {
                // setShowModal(true)
                setInitialExpungeDone('');
            }
            setStatesChangeStatus(true);
            setSelectedRow(selectedRow);
            setTransactionName(selectedRows.selectedRows.map(row => row.TransactionName));
            setTransactionId(selectedRows.selectedRows.map(row => row.ID));
            setNameID(selectedRow.NameID)
            setSelectionLocked(false);
        }
        else {
            setSelectedRow(null);
            setNameID(null);
            setStatesChangeStatus(false);
        }

    };


    const reset = () => {
        setValue({
            ...value,
            'ConsolidateDatefrom': '', 'ConsolidateDateTo': '', 'OfficerID': '', 'ConsolidationType': '',
        });
        setdateOfbirth('');
        setdateTo(''); setNameSearchValue([])
    }

    const resetUnexpungeColumn = () => {
        setNameSearchValue('');
    }



    const columns1 = [
        {
            name: 'Name Number',
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
            selector: (row) => row.TransactionNumber,
            sortable: true
        },
        {
            name: 'Date/Time',
            selector: (row) => getShowingDateText(row.ReportedDate),
            sortable: true
        },

    ]


    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])


    const handleRowSelected2 = (selectedRows) => {
        const selectedRow = selectedRows.selectedRows[0];
        if (selectedRow?.IncidentID) {
            setSelectedRowData(selectedRow);
            //  setIncidentID(selectedRow?.IncidentID);
            //   get_SealUnsealData(selectedRow?.IncidentID);
        } else { setSelectedRowData(null); }
    };

    const handleExpungeClick = () => {
        get_DeletedDatas();
        // if (!initialExpungeDone) {
        //     if (!notes.trim()) {
        //         toastifyError("Notes required");
        //         return;
        //     }
        //     else if (nameId) {

        //         //  setShowModal(true); setNotes(''); setClearSelectedRows([]);
        //     }

        //     // setInitialExpungeDone(true);
        //     //  setNotes('');
        // } else {
        //     // setShowModal(true);
        // }
    };

    const ExpandedComponent = () => (
        <DataTable
            dense
            columns={columns1}
            // data={filteredData}
            // onSelectedRowsChange={handleRowSelected1}
            pagination
            selectableRows
            // selectableRowSelected={(row) => (selectedRows)?.some((selectedRow) => selectedRow.ChargeID === row.ChargeID)}
            customStyles={tableCustomStyles}
            conditionalRowStyles={[{ when: row => row?.SealUnsealStatus === true, style: { backgroundColor: '#FFCCCC', color: 'black' } }]}
        />
    );



    const handleConfirmExpunge = () => {
        get_DeletedDatas();
        setShowModal(false);
        setInitialExpungeDone(false);
        setClearSelectedRows(!clearSelectedRows);
    };

    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])

    const onDashboardClose = () => {
        navigate('/dashboard-page');
    }

    const columns2 = [
        {
            name: 'Incident Number', selector: (row) => row.IncidentNumber
            , sortable: true
        },
        {
            name: 'Transaction Number', selector: (row) => row.NewMasterNmIdNumber,
            sortable: true
        },
        {
            name: 'Transaction Type', selector: (row) => row.ConsolidationType
        },
    ]

    const TransactionType = [
        { value: 'N', label: 'Name', },
        { value: 'P', label: 'Property', },
        { value: 'V', label: 'Vehile', },
    ]


    return (
        <>
            <div className="section-body view_page_design pt-1">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency  name-card">
                            <div className="card-body">
                                <div className="col-12 col-md-12 col-lg-12 ">
                                    <div className="col-12 col-md-12 col-lg-12">
                                        <div className="row" style={{ marginTop: '-10px' }}>
                                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                <label htmlFor="" className='new-label'>Transaction Type</label>
                                            </div>
                                            <div className="col-3 col-md-4 col-lg-3 mt-1">
                                                <Select
                                                    name="ConsolidationType"
                                                    options={TransactionType}
                                                    isClearable
                                                    placeholder="Select..."
                                                    // value={TransactionType?.find(obj => obj.value === value?.ConsolidationType)}
                                                    value={TransactionType.find(obj => obj.value === value?.ConsolidationType) || null}
                                                    onChange={(selectedOption) => {
                                                        setValue({ ...value, ConsolidationType: selectedOption ? selectedOption.value : '' });
                                                        // setExpandedRow(null);
                                                    }}
                                                />

                                            </div>
                                            <div className="col-3 col-md-2 col-lg-1 mt-2">
                                                <label htmlFor="" className='new-label'>From Date</label>
                                            </div>
                                            <div className="col-3 col-md-4 col-lg-3">
                                                {/* <DatePicker
                                                    id='DateOfBirth'
                                                    name='ConsolidateDatefrom'
                                                    className=''
                                                    onChange={(date) => {
                                                        setdateOfbirth(date);
                                                        setValue({ ...value, ['ConsolidateDatefrom']: date ? getShowingMonthDateYear(date) : null });
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.ConsolidateDatefrom ? true : false}
                                                    selected={dateOfbirth}
                                                    placeholderText={value?.ConsolidateDatefrom ? value.DateOfBirth : 'Select...'}
                                                    maxDate={new Date()}
                                                    timeIntervals={1}
                                                    autoComplete="Off"
                                                /> */}
                                                <DatePicker
                                                    id='DateOfBirth'
                                                    name='ConsolidateDatefrom'
                                                    className=''
                                                    onChange={(date) => {
                                                        setdateOfbirth(date);
                                                        if (!date) {
                                                            setdateTo(null);
                                                            setValue({ ...value, ['ConsolidateDatefrom']: null, ['ConsolidateDateTo']: null }); // Clear both DateFrom and DateTo
                                                        } else {
                                                            setdateTo(null);
                                                            setValue({ ...value, ['ConsolidateDatefrom']: date ? getShowingMonthDateYear(date) : null, ['ConsolidateDateTo']: null });
                                                        }
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.ConsolidateDatefrom ? true : false}
                                                    selected={dateOfbirth}
                                                    placeholderText={value?.ConsolidateDatefrom ? value.DateOfBirth : 'Select...'}
                                                    maxDate={new Date()}
                                                    timeIntervals={1}
                                                    autoComplete="Off"

                                                />
                                            </div>

                                            <div className="col-3 col-md-2 col-lg-1 mt-2">
                                                <label htmlFor="" className='new-label'>To Date</label>
                                            </div>
                                            <div className="col-3 col-md-4 col-lg-3">
                                                {/* <DatePicker
                                                    id='DateOfBirth'
                                                    name='ConsolidateDateTo'
                                                    className=''
                                                    onChange={(date) => {
                                                        setdateTo(date);
                                                        setValue({ ...value, ['ConsolidateDateTo']: date ? getShowingMonthDateYear(date) : null });
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.ConsolidateDateTo ? true : false}
                                                    selected={dateTo}
                                                    placeholderText={value?.ConsolidateDateTo ? value.DateOfBirth : 'Select...'}
                                                    maxDate={new Date()}
                                                    timeIntervals={1}
                                                    autoComplete="Off"
                                                /> */}
                                                <DatePicker
                                                    id='ConsolidateDateTo'
                                                    name='ConsolidateDateTo'
                                                    className={!value?.ConsolidateDatefrom ? 'readonlyColor' : ''}
                                                    onChange={(date) => {
                                                        setdateTo(date);
                                                        setValue({ ...value, ['ConsolidateDateTo']: date ? getShowingMonthDateYear(date) : null });
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.ConsolidateDateTo ? true : false}
                                                    selected={dateTo}
                                                    minDate={new Date(value?.ConsolidateDatefrom)}
                                                    placeholderText={value?.ConsolidateDateTo ? value.DateOfBirth : 'Select...'}
                                                    maxDate={new Date()}
                                                    timeIntervals={1}
                                                    autoComplete="Off"
                                                    disabled={!value?.ConsolidateDatefrom}
                                                />
                                            </div>

                                            <div className="col-3 col-md-2 col-lg-1 mt-2">
                                                <label htmlFor="" className='new-label'>Officer</label>
                                            </div>
                                            <div className="col-3 col-md-4 col-lg-3 mt-1">
                                                <Select
                                                    name='OfficerID'
                                                    // styles={colourStyles}
                                                    menuPlacement='top'
                                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                                                    isClearable
                                                    options={agencyOfficerDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                                                    placeholder="Select..."
                                                />
                                            </div>

                                            <div className="btn-box col-12 text-right mb-1 mt-3 d-flex justify-content-end">
                                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { reset(); }}>Clear</button>
                                                {
                                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => getNameSearch(value.ConsolidateDatefrom, value.ConsolidateDateTo, value.ConsolidationType, value.OfficerID, value.AgencyID,)}>Search</button>
                                                        : <></> :
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => getNameSearch(value.ConsolidateDatefrom, value.ConsolidateDateTo, value.ConsolidationType, value.OfficerID, value.AgencyID,)}>Search</button>
                                                }

                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <fieldset className='mt-2 mb-1'>
                                    <legend>Select Event To be Unconsolidation</legend>
                                    <div className="col-12 mt-3 px-0">
                                        <DataTable
                                            dense
                                            columns={columns2}
                                            data={nameSearchValue} // Your log data
                                            pagination
                                            highlightOnHover
                                            fixedHeaderScrollHeight="190px"
                                            fixedHeader
                                            onSelectedRowsChange={handleRowSelected}
                                            persistTableHead={true}
                                            customStyles={tableCustomStyles}
                                            selectableRows
                                            expandableRows
                                            expandableRowsComponent={({ data }) =>
                                                selectedRowData ? (
                                                    <ExpandedComponent data={selectedRowData} incidentID={selectedRowData.IncidentID} />
                                                ) : null
                                            }
                                            expandableInheritConditionalStyles
                                        />
                                        {/* <DataTable
                                    dense
                                    columns={columns}
                                    data={nameSearchValue}
                                    pagination
                                    selectableRowsHighlight
                                    highlightOnHover
                                /> */}
                                    </div>
                                </fieldset>

                                <div className="col-12 field-button d-flex justify-content-end align-items-center">
                                    <div className="d-inline-flex align-items-center me-3">
                                        <input className="form-check-input" type="checkbox" id="checkboxWithEvents" />
                                        <label htmlFor="checkboxWithEvents" className="px-2 mb-0" style={{ fontSize: '14px' }}>
                                            With Events
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { /* your function here */ }}
                                        className="btn btn-sm btn-success"
                                    >
                                        Unconsolidate
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div >



        </>
    )
}

export default UnConsolidation