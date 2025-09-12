import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import IncidentSummaryModel from './IncidentSummaryModel';
import { fetchPostData } from '../../hooks/Api';
import NameListing from '../ShowAllList/NameListing';
import { Decrypt_Id_Name, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import OtherSummaryModel from './OtherSummaryModel';
import { useLocation, useNavigate } from 'react-router-dom';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const VehicleInvolvement = (props) => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const { idColName, masterID, IncSta, NameStatus, IncNo, tabID, incId, url, scrCode, IsMaster } = props
    const [clickedRow, setClickedRow] = useState(null);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [modalTitle, setModalTitle] = useState('');

    const [transactionData, setTransactionData] = useState([]);
    const [incSummModal, setIncSummModal] = useState(false);
    const [otherSummModal, setOtherSummModal] = useState(false);
    const [otherColName, setOtherColName] = useState('');
    const [otherColID, setOtherColID] = useState('');
    const [otherUrl, setOtherUrl] = useState('');
    const [updateCount, setupdateCount] = useState(1);
    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data(scrCode, localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (masterID || tabID) {
            Get_TransactionData(masterID);
        }
    }, [tabID, masterID]);

    const Get_TransactionData = () => {
        const val = { [idColName]: tabID, 'IsMaster': false }
        const val1 = { [idColName]: tabID, 'IsMaster': true, 'MasterPropertyID': masterID }
        fetchPostData('TransactionLog/GetData_VehicleTransactionLog', IsMaster ? val1 : val).then((res) => {

            if (res) {
                console.log(res);
                setTransactionData(res)
            } else {
                setTransactionData();
            }
        })
    }

    const columns = [
        {
            width: '150px',
            cell: row =>
                <div className="div" >
                    <a data-toggle="modal" data-target={`${row?.TransactionName == "Incident" ? "#IncSummaryModel" : "#OtherSummaryModel"}`}
                        style={{ textDecoration: 'underline' }}
                        onClick={() => {
                            setupdateCount(updateCount + 1);
                            if (row?.TransactionName == "Incident") {
                                setIncSummModal(true); setOtherColID(row?.ID);
                            } else if (row?.TransactionName != "Incident") {
                                setOtherSummModal(true)

                                switch (row?.TransactionName) {
                                    case "Name": setOtherColName('NameID');
                                        setOtherColID(row?.ID);
                                        // setOtherColID(row?.OwnerID);
                                        // console.log(row?.ID)
                                        setOtherUrl('Summary/NameSummary');
                                        setModalTitle("Name Summary"); break;
                                    case "Arrest": setOtherColName('ArrestID'); setOtherColID(row?.ID); setOtherUrl('Summary/ArrestSummary'); setModalTitle("Arrest Summary"); break;
                                    default:
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
                        console.log(row)
                        // if (row?.TransactionName === "Name") {
                        //     navigate(`/Name-Home?IncId=${stringToBase64(incId)}&IncSta=${IncSta}&IncNo=${IncNo}&NameID=${stringToBase64(row?.ID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${NameStatus}`);
                        // }
                        if (row?.TransactionName === "Name") {
                            if (IsMaster) {
                                navigate(`/Name-Home?page=MST-Name-Dash&MasterNameID=${stringToBase64(row?.ID)}&ModNo=${row?.TransactionNumber}&NameStatus=${true}`);
                            } else {
                                navigate(`/Name-Home?IncId=${stringToBase64(incId)}&IncSta=${IncSta}&IncNo=${IncNo}&NameID=${stringToBase64(row?.ID)}&NameStatus=${true}`);
                            }
                        }
                        else if (row?.TransactionName === "Incident") {
                            navigate(`/Inc-Home?IncId=${stringToBase64(row?.ID)}&IncNo=${row?.TransactionNumber}&IncSta=${true}`);
                        }
                    }}
                >
                    {row?.TransactionNumber}
                </span>
            )
        },
        {
            name: 'Full Name',
            selector: (row) => row.Owner,
            sortable: true
        },
        {
            name: 'Transaction Name',
            selector: (row) => row.TransactionName,
            sortable: true
        },


        // {

        //     name: 'Transaction Number',
        //     selector: (row) => row ? TransactionNumber,
        //     sortable: true,
        //     cell: (row) => (
        //         <span
        //             style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        //             onClick={() => {
        //                 navigate(`/ Inc - Home ? IncId = ${ stringToBase64(row?.IncidentID) }& IncNo=${ row?.TransactionNumber }& IncSta=true & IsCadInc=false`)
        //             }
        //             }
        //         >
        //             {row?.IncidentNumber}
        //         </span >
        //     )
        // },
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
                <div className="col-12 mt-2 modal-table">
                    <DataTable
                        dense
                        columns={columns}
                        // data={transactionData}
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? transactionData : [] : transactionData}
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
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

export default VehicleInvolvement