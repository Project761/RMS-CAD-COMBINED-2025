import { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { base64ToString, getShowingDateText, getShowingMonthDateYear, } from '../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostData } from '../../hooks/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpungeConfirmModel from '../../Common/ExpungeConfirmModel';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data } from '../../../redux/actions/DropDownsData';

const UnExpunge = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

    const [loginAgencyID, setloginAgencyID] = useState('');
    const [dateOfbirth, setdateOfbirth] = useState();
    const [dateTo, setdateTo] = useState();
    const [nameSearchValue, setNameSearchValue] = useState([]);
    const [logData, setLogData] = useState([]);
    const [loginPinID, setLoginPinID,] = useState('');
    const [nameId, setNameID] = useState('');
    const [masterNameID, setMasterNameID] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [clearSelectedRows, setClearSelectedRows] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [selectionLockedArrest, setselectionLockedArrest] = useState(false);
    const [arrestChareData, setArrestChareData] = useState([]);
    const [arrestId, setArrestId] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedChargeIds, setSelectedChargeIds] = useState([]);
    const [selectedCheckedRows, setSelectedCheckedRows] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const [value, setValue] = useState({
        'CreatedDtTmfrom': '', 'CreatedDtTmTo': '', 'AgencyID': '', 'PrimaryOfficerID': ''
    })

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
    if (!NameID) NameID = 0;

    if (!MasterNameID) MasterNameID = 0;

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("U117", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, ''));
        }
    }, [localStoreData]);

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


    const getNameSearch = async (CreatedDtTmfrom, CreatedDtTmTo, AgencyID, PrimaryOfficerID) => {
        if (CreatedDtTmfrom || CreatedDtTmTo || AgencyID || PrimaryOfficerID) {
            if (nameSearchValue) {
                setNameSearchValue([]);
            }
            if (selectedRows) {
                setSelectedRows([]);
            }
            if (selectedCheckedRows) {
                setSelectedCheckedRows([]);
            }
            setExpandedRow(null);
            fetchPostData("MasterName/GetData_ExpungeName", {
                'AgencyID': loginAgencyID,
                "CreatedDtTmfrom": CreatedDtTmfrom, "CreatedDtTmTo": CreatedDtTmTo,
                'PrimaryOfficerID': PrimaryOfficerID
            }).then((data) => {
                if (data.length > 0) {
                    const [{ MasterNameID, NameIDNumber }] = data;
                    setNameSearchValue(data);
                    setLogData([]);
                } else {
                    setNameSearchValue([]);
                    toastifyError('No Name Available');
                }
            });
        } else {
            toastifyError('No Data Available')
        }
    };


    const get_ArrestChargeData = (ArrestID) => {
        const val2 = { 'ArrestID': ArrestID };
        fetchPostData("Expunge/GetData_UnExpungArrestCharge", val2).then((res) => {
            if (res) {
                setArrestChareData(res);
            } else {
                setArrestChareData([]);
            }
        })
    }

    const get_ArrestChargeDataCheckbox = async (ArrestID) => {
        const val2 = { 'ArrestID': ArrestID };
        try {
            const res = await fetchPostData("Expunge/GetData_UnExpungArrestCharge", val2);
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

    const get_DeletedDatas = () => {
        const val2 = { 'ArrestID': arrestId, 'ChargeID': selectedChargeIds, 'DeletedByUserFK': loginPinID, 'ArrestNumber': '', 'PrimaryOfficerID': loginPinID, 'NameID': nameId, 'MasterNameID': masterNameID };
        fetchPostData("MasterName/Unexpunge", val2).then((res) => {
            if (res) {
                if (res.data) {
                    try {
                        const parsedData = JSON.parse(res.data);
                        if (parsedData && parsedData.length > 0 && parsedData[0].Message) {
                            const deleteMessage = parsedData[0].Message;
                            toastifySuccess(deleteMessage);
                            get_ArrestChargeData(arrestId);
                            setNameID('');
                        }
                    } catch (error) {

                    }
                } else if (Array.isArray(res) && res.length > 0 && res[0].Message) {
                    const deleteMessage = res[0].Message;
                    getNameSearch(value.LastName, value.FirstName, value.MiddleName, value.DateOfBirth, value.SSN, value.SexID, true);
                    toastifySuccess(deleteMessage);
                    setNameID('');
                }
                toastifySuccess(res[0]?.message);
                setSelectedRows([]);
                get_ArrestChargeData(arrestId);
            } else {
                setLogData([]);
            }
        }).catch(error => {

        });

    };

    const reset = () => {
        setValue({
            ...value, 'CreatedDtTmfrom': '', 'CreatedDtTmTo': '', 'AgencyID': '', 'PrimaryOfficerID': ''
        });
        dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, ''));
        setdateOfbirth(''); setdateTo(''); setClearSelectedRows([]);
        setselectionLockedArrest(false); setSelectedRows(''); setNameSearchValue([]);
    }

    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])

    const handleExpungeClick = () => {
        get_DeletedDatas();
    };

    const handleConfirmExpunge = () => {
        get_DeletedDatas(); setShowModal(false); setClearSelectedRows(!clearSelectedRows);
    };

    useEffect(() => {
        document.addEventListener('load', function () {
            document.getElementById('#myModal').modal('showModal');
        });
    }, [])

    const onDashboardClose = () => {
        navigate('/dashboard-page');
    }

    const columns1 = [
        {
            name: 'TIBRS Code',
            selector: (row) => row.FBICode,
            sortable: true
        },
        {
            name: 'Offense Code / Description',
            selector: (row) => row.ChargeCode_Description,
            sortable: true
        },
        {
            name: 'Transaction Number',
            selector: (row) => row.TransactionNumber,
            sortable: true
        },
        {
            name: 'Date/Time',
            selector: (row) => getShowingDateText(row.CreatedDtTm),
            sortable: true
        },

    ]



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
                        onClick={() => handleExpandRow(row.ArrestID)}
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

    const handleCheckboxChange = async (e, selectedRow) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setExpandedRow(null); setSelectedRows([selectedRow.ArrestID]);
            await get_ArrestChargeDataCheckbox(selectedRow?.ArrestID);
            setSelectedRowData(selectedRow); setSelectedRow(selectedRow);
            setArrestId(selectedRow?.ArrestID); setNameID(selectedRow.NameID);
            setselectionLockedArrest(true);
        } else {
            setselectionLockedArrest(false); setSelectedChargeIds([]);
            setSelectedRows((prevSelected) => prevSelected.filter((rowId) => rowId !== selectedRow.ArrestID));
        }
    };

    const handleExpandRow = (id) => {
        setExpandedRow((prev) => {
            const newExpandedRow = prev === id ? null : id;
            if (newExpandedRow) {
                get_ArrestChargeData(id);
            }
            return newExpandedRow;
        });
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
            const parentRow = logData.find((row) => row.ArrestID === chargeId.ArrestID);
            const childRows = arrestChareData.filter((charge) => charge.ArrestID === chargeId.ArrestID);
            const allChildSelected = childRows.every((charge) => selectedChargeIds.includes(charge.ChargeID));
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
    }, [selectedChargeIds, nameSearchValue, arrestChareData]);

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
                                                <label htmlFor="" className='new-label'>From Date</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3">
                                                <DatePicker
                                                    id='CreatedDtTmfrom'
                                                    name='CreatedDtTmfrom'
                                                    className=''
                                                    onChange={(date) => {
                                                        setdateOfbirth(date);
                                                        if (!date) {
                                                            setdateTo(null);
                                                            setValue({ ...value, ['CreatedDtTmfrom']: null, ['CreatedDtTmTo']: null });
                                                        } else {
                                                            setValue({ ...value, ['CreatedDtTmfrom']: date ? getShowingMonthDateYear(date) : null });
                                                        }
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.CreatedDtTmfrom ? true : false}
                                                    selected={dateOfbirth}
                                                    placeholderText={value?.CreatedDtTmfrom ? value.DateOfBirth : 'Select...'}
                                                    maxDate={new Date()}
                                                    timeIntervals={1}
                                                    autoComplete="Off"

                                                />
                                            </div>

                                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                <label htmlFor="" className='new-label'>To Date</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3">
                                                <DatePicker
                                                    id='CreatedDtTmTo'
                                                    name='CreatedDtTmTo'
                                                    className={!value?.CreatedDtTmfrom ? 'readonlyColor' : ''}
                                                    onChange={(date) => {
                                                        setdateTo(date);
                                                        setValue({ ...value, ['CreatedDtTmTo']: date ? getShowingMonthDateYear(date) : null });
                                                    }}
                                                    dateFormat="MM/dd/yyyy"
                                                    timeInputLabel
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    isClearable={value?.CreatedDtTmTo ? true : false}
                                                    selected={dateTo}
                                                    placeholderText={value?.CreatedDtTmTo ? value.DateOfBirth : 'Select...'}
                                                    maxDate={new Date()}
                                                    timeIntervals={1}
                                                    autoComplete="Off"
                                                    disabled={!value?.CreatedDtTmfrom}
                                                />
                                            </div>

                                            <div className="col-2 col-md-2 col-lg-1 mt-2">
                                                <label htmlFor="" className='new-label'>Primary officer</label>
                                            </div>
                                            <div className="col-4 col-md-4 col-lg-3 mt-1">
                                                <Select
                                                    name='PrimaryOfficerID'
                                                    menuPlacement='top'
                                                    value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.PrimaryOfficerID)}
                                                    isClearable
                                                    options={agencyOfficerDrpData}
                                                    onChange={(e) => ChangeDropDown(e, 'PrimaryOfficerID')}
                                                    placeholder="Select..."
                                                />
                                            </div>

                                            <div className="btn-box col-12 text-right mb-1 mt-3 d-flex justify-content-end">
                                                <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { onDashboardClose(); }}>Close</button>
                                                {
                                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => getNameSearch(value.CreatedDtTmfrom, value.CreatedDtTmTo, value.AgencyID, value.PrimaryOfficerID)}>Search</button>
                                                        : <></> :
                                                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => getNameSearch(value.CreatedDtTmfrom, value.CreatedDtTmTo, value.AgencyID, value.PrimaryOfficerID)}>Search</button>
                                                }

                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <fieldset className='mt-2 mb-1'>
                                    <legend>Select Event To be Deleted</legend>
                                    <div className="col-12 mt-3 px-0">
                                        <DataTable
                                            columns={columnss}
                                            data={nameSearchValue}
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

                                <div className="col-12 field-button text-right mt-1" >
                                    <button type="button" data-toggle="modal" data-target="#myModal" onClick={() => { reset(); }} className="btn btn-sm btn-success mr-1">Clear</button>
                                    <button type="button" className="btn btn-sm btn-success " onClick={handleExpungeClick}
                                        {...(showModal && nameId ? { 'data-toggle': 'modal', 'data-target': '#myModal' } : {})}
                                    >UnExpunge</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <ExpungeConfirmModel showModal={showModal}
                setShowModal={setShowModal}
                onConfirm={handleConfirmExpunge} />


        </>
    )
}

export default UnExpunge