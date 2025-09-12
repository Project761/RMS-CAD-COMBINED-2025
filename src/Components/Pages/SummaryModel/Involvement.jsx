import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import IncidentSummaryModel from './IncidentSummaryModel';
import { fetchPostData } from '../../hooks/Api';
import NameListing from '../ShowAllList/NameListing';
import { Decrypt_Id_Name, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import OtherSummaryModel from './OtherSummaryModel';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';

const Involvements = (props) => {

    const { idColName, masterID, SideBarStatus, tabID, ProSta, incId, IncSta, IncNo, NameStatus, NameID, url, scrCode, para, IsMaster } = props
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [modalTitle, setModalTitle] = useState('');
    const [clickedRow, setClickedRow] = useState(null);
    const [transactionData, setTransactionData] = useState([]);
    const [incSummModal, setIncSummModal] = useState(false);
    const [otherSummModal, setOtherSummModal] = useState(false);
    const [otherColName, setOtherColName] = useState('');
    const [otherColID, setOtherColID] = useState('');
    const [otherUrl, setOtherUrl] = useState('');
    const [updateCount, setupdateCount] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [incID, setIncID] = useState('');

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let openPage = query?.get("page");
    let MstPage = query?.get('page');

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data(scrCode, localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (masterID) {
            Get_TransactionData(idColName, masterID, IsMaster, tabID);
        }
    }, [masterID]);

    const Get_TransactionData = () => {
        const val2 = { [idColName]: masterID, 'IsMaster': IsMaster, }
        const val1 = { [para]: tabID, [idColName]: 0, 'IsMaster': IsMaster, }
        fetchPostData('TransactionLog/GetData_TransactionLog', MstPage ? val2 : val1).then((res) => {
            console.log(res)
            if (res) {
                setTransactionData(res)
            } else {
                setTransactionData();
            }
        })
    }

    const columns = [
        {
            // width: '120px',
            cell: row =>
                <div className="div">
                    <a
                        data-toggle="modal"
                        data-target={`${row?.TransactionName === "Incident" ? "#IncSummaryModel" : "#OtherSummaryModel"}`}
                        style={{ textDecoration: 'underline' }}
                        onClick={() => {
                            setupdateCount(updateCount + 1);

                            if (row?.TransactionName === "Incident") {
                                setIncSummModal(true);
                                setOtherColID(row?.ID);
                                setModalTitle("Incident Summary"); // Set the title for Incident
                            } else {

                                setOtherSummModal(true);
                                switch (row?.TransactionName) {
                                    case "Name": setOtherColName('NameID');
                                        setOtherColID(row?.ID);
                                        // setOtherColID(row?.OwnerID);
                                        // console.log(row?.ID)
                                        setOtherUrl('Summary/NameSummary');
                                        setModalTitle("Name Summary"); break;
                                    case "Vehicle":
                                        setOtherColName(MstPage === 'MST-Name-Dash' ? "MasterPropertyID" : 'VehicleID');
                                        setOtherColID(row?.ID);
                                        console.log(row?.ID)
                                        setOtherUrl('Summary/VehicleSummary');
                                        setModalTitle("Vehicle Summary");
                                        break;
                                    case "Arrest":
                                        setOtherColName('ArrestID');
                                        setOtherColID(row?.ID);
                                        setOtherUrl('Summary/ArrestSummary');
                                        setModalTitle("Arrest Summary");
                                        break;
                                    case "Property":
                                        setOtherColName(MstPage === 'MST-Name-Dash' ? 'MasterPropertyID' : 'PropertyID');
                                        setOtherColID(row?.ID);
                                        console.log(row?.ID)
                                        setOtherUrl('Summary/PropertySummary');
                                        setModalTitle("Property Summary");
                                        break;
                                    default:
                                        setModalTitle("Summary");
                                }
                            }
                        }}
                    >
                        MS
                    </a>
                </div>
        },
        {
            name: 'Transaction Number',
            selector: (row) => row.TransactionNumber,
            sortable: true,
            cell: (row) => (
                <span
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        console.log(row);

                        if (row?.TransactionName === "Property") {
                            if (IsMaster) {
                                navigate(`/Prop-Home?page=MST-Property-Dash&MProId=${stringToBase64(row?.ID)}&ModNo=${row?.TransactionNumber?.trim()}&ProSta=${true}`);
                            } else {
                                navigate(`/Prop-Home?IncId=${stringToBase64(incId)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(row?.ID)}&ProSta=${true}`);
                            }
                        } else if (row?.TransactionName === "Incident") {
                            navigate(`/Inc-Home?IncId=${stringToBase64(row?.ID)}&IncNo=${row?.TransactionNumber}&IncSta=${true}`);
                        }
                        else if (row?.TransactionName === "Arrest") {
                            navigate(`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ID)}&ArrNo=${row?.TransactionNumber}&Name=${row?.Name}&ArrestSta=${true}&ChargeSta=${false}&SideBarStatus=${!SideBarStatus}&ArrestStatus=${false} `)
                        }

                        else if (row?.TransactionName === "Vehicle") {
                            if (IsMaster) {
                                navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&MVehId=${stringToBase64(row?.ID)}&ModNo=${row?.TransactionNumber}&VehSta=${true}`)
                            } else {
                                navigate(`/Vehicle-Home?IncId=${stringToBase64(incId)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.ID)}&VehSta=${true}`)
                            }
                        }
                    }}
                >
                    {row?.TransactionNumber}
                </span>
            )
        },
        {
            // width: '200px',
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            // width: '200px',
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            // width: '200px',
            name: 'Middle Name',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            // width: '200px',
            name: 'Gender',
            selector: (row) => row.Sex_Description,
            sortable: true
        },
        {
            // width: '200px',
            name: 'Race',
            selector: (row) => row.Race,
            sortable: true
        },
        {
            // width: '200px',
            name: 'Ethnicity',
            selector: (row) => row.Ethnicity_Description,
            sortable: true
        },
        {
            // width: '200px',
            name: 'Resident',
            selector: (row) => row.Resident_Description,
            sortable: true
        },
        {
            name: 'Reason Code',
            selector: (row) => (
                <span title={row?.ReasonCode}>
                    {row?.ReasonCode ? row?.ReasonCode.substring(0, 20) : ''}
                    {row?.ReasonCode?.length > 20 ? '...' : ''}
                </span>
            ),
            sortable: true
        },
        {
            // width: '100px',
            name: ' Create DT/TM',
            selector: (row) => row.CreatedDtTm ? getShowingWithOutTime(row.CreatedDtTm) : '',
            sortable: true
        },
        {
            // width: '100px',
            name: 'Age',
            selector: (row) => row.Age,
            sortable: true
        },
        {
            // width: '100px',
            name: 'Arrest',
            selector: (row) => row.IsArrest,
            sortable: true
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

    const onClickedRow = (row) => {
        // setClickedRow(row);
        // if (row?.TransactionName === "Incident") {
        //     setIncSummModal(true)
        // } else if (row?.TransactionName != "Incident") {
        //     setOtherSummModal(true)
        // }
    }

    return (
        <>
            <NameListing />
            <div className="col-md-12 mt-2">
                <div className="col-12 mt-2">
                    <DataTable
                        dense
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? transactionData : [] : transactionData}
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        columns={columns}
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        showPaginationBottom={10}
                        customStyles={tableCustomStyles}
                        onRowClicked={(row) => {
                            onClickedRow(row);
                        }}
                        fixedHeader
                        persistTableHead={true}
                        fixedHeaderScrollHeight='330px'
                        conditionalRowStyles={conditionalRowStyles}
                    />
                </div>
            </div>
            {/* <IdentifyFieldColor /> */}
            <IncidentSummaryModel {...{ setIncSummModal, incSummModal, otherColID, updateCount }} />
            <OtherSummaryModel
                {...{ otherSummModal, setOtherSummModal, updateCount, openPage, modalTitle }}
                otherColName={otherColName}
                otherColID={otherColID}
                otherUrl={otherUrl}
            />
        </>
    )
}

export default Involvements

