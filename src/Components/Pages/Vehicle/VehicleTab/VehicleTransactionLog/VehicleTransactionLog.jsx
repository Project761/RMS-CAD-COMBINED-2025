import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';


const VehicleTransactionLog = (props) => {

    const { DecVehId, DecMVehId, DecIncID } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [transactionData, setTransactionData] = useState([]);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const { nameFilterData, setIncidentStatus } = useContext(AgencyContext);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("V085", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    let openPage = useQuery().get('page');
    useEffect(() => {
        if (DecVehId) { Get_TransactionData(DecVehId); }
        setIncidentStatus(true);
    }, [DecVehId])

    const Get_TransactionData = (VehicleID) => {
        const val = { 'VehicleID': VehicleID, }
        fetchPostData('TransactionLog/GetData_VehicleTransactionLog', val).then((res) => {
            if (res) {
    
                setTransactionData(res)
            } else {
                setTransactionData();
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
      
    ]

    return (

        <div className="col-md-12 mt-2">
            <div className="col-12">
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? transactionData : [] : transactionData}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    pagination
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    showPaginationBottom={10}
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                />
            </div>
        </div>



    )
}

export default VehicleTransactionLog