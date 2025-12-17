import{ useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import {useLocation } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData } from '../../../../hooks/Api';
import IdentifyFieldColor from '../../../../Common/IdentifyFieldColor';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import NameListing from '../../../ShowAllList/NameListing';
import IncidentSummaryModel from '../../../SummaryModel/IncidentSummaryModel';

const TransactionLog = (props) => {

    const { DecMasterNameID } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';


    const { setNameStatus, setNameData, nameData, storeData } = useContext(AgencyContext);
    const [clickedRow, setClickedRow] = useState(null);

    const useQuery = () => new URLSearchParams(useLocation().search);

    const [transactionData, setTransactionData] = useState([]);


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
            Get_TransactionData();
        }
    }, []);



    const Get_TransactionData = () => {
        const val = {
            'MasterNameID': DecMasterNameID,
        }
        fetchPostData('TransactionLog/GetData_TransactionLog', val).then((res) => {
            if (res) {
                setTransactionData(res)
            } else {
                setTransactionData();
            }
        })
    }

    const columns = [
        {
            cell: row =>
                <div className="div" >
                    <a data-toggle="modal" data-target="#IncSummaryModel" style={{ textDecoration: 'underline' }}>
                        MS
                    </a>
                </div>
        },
        {
            width: '120px',
            name: 'Full Name',
            selector: (row) => row.Name,
            sortable: true
        },
        {
            width: '180px',
            name: 'Transaction Name',
            selector: (row) => row.TransactionName,
            sortable: true
        },
        {
            width: '180px',
            name: 'Transaction Number',
            selector: (row) => row.TransactionNumber,
            sortable: true
        },
        {
            width: '100px',
            name: 'DOB',
            selector: (row) => getShowingWithOutTime(row.DateOfBirth),

            sortable: true
        },
        {
            width: '90px',
            name: 'Age',
            selector: (row) => row.Age,
            sortable: true
        },
        {
            width: '100px',
            name: 'Race',
            selector: (row) => row.Race,
            sortable: true
        },
        {
            width: '130px',
            name: 'Reason Code',
            selector: (row) => <>{row?.ReasonCode ? row?.ReasonCode.substring(0, 10) : ''}{row?.ReasonCode?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>

                </div>

        },
    ]

    const set_IncidentId = (row) => {
        let newData = [...nameData];

        let currentItem = newData.find((item) => row.NameID === item.NameID || row.masterNameID === item.masterNameID);

        if (!currentItem) {
            newData.push(row);
        }
        setNameData(newData);
        setNameStatus(false);
        if (row.NameID || row.masterNameID) {
            storeData({ 'NameID': row.NameID, 'MasterNameID': row.masterNameID, 'NameStatus': false })

        }
    }
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
    return (
        <>
            <NameListing />
            <div className="col-md-12 mt-2">
                <div className="col-12 mt-2">
                    <DataTable
                        dense
                        columns={columns}
                        data={transactionData}
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        showPaginationBottom={10}
                        customStyles={tableCustomStyles}
                        onRowClicked={(row) => {
                            setClickedRow(row);
                            set_IncidentId(row);
                        }}
                        fixedHeader
                        persistTableHead={true}
                        fixedHeaderScrollHeight='330px'
                        conditionalRowStyles={conditionalRowStyles}
                    />
                </div>
            </div>
            {/* <IdentifyFieldColor /> */}
            <IncidentSummaryModel />
        </>
    )
}

export default TransactionLog