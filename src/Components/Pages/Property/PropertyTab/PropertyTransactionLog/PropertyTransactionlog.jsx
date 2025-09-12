import React, { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Link, useLocation } from 'react-router-dom';
import { fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name, DecryptedList, base64ToString, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import ChangesModal from '../../../../Common/ChangesModal';

const PropertyTransactionlog = (props) => {

    const { DecPropID, DecMPropID, DecIncID } = props
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [transactionData, setTransactionData] = useState([]);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');
   

    useEffect(() => {
        if (DecMPropID) {
        
        }
    }, [DecMPropID])

    const Get_TransactionData = (masterPropertyID) => {
        const val = { 'MasterNameID': masterPropertyID, }
        fetchPostData('TransactionLog/GetData_TransactionLog', val).then((res) => {
            if (res) {
              
            } else {
               
            }
        })
    }

    const columns = [
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
            selector: (row) => row.DOB,
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

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="col-12">
                    <DataTable
                        dense
                        columns={columns}
                        data={transactionData}
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        paginationPerPage={'100'}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        showPaginationBottom={100}
                    />
                </div>
            </div>
            <ChangesModal />
        </>
    )
}

export default PropertyTransactionlog