import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostData } from '../../../../hooks/Api';
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';


const OwnerHistory = (props) => {

    const { DecNameID, DecMasterNameID, } = props

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [OwnerHistory, setOwnerHistoryData] = useState([]);
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
        if (DecNameID || DecMasterNameID) { Get_OwnerHistory(DecNameID, DecMasterNameID); }
    }, [DecNameID, DecMasterNameID])

    console.log(DecMasterNameID)

    const Get_OwnerHistory = (DecNameID, DecMasterNameID) => {
        const val = {
            'NameID': DecNameID, 'MasterNameID': DecMasterNameID, 'IsMaster': 1,
        }
        fetchPostData('TransactionLog/GetData_OwnerHistory', val).then((res) => {
            if (res) {
                console.log(res)
                setOwnerHistoryData(res)
            } else {
                setOwnerHistoryData();
            }
        })
    }

    const columns = [
        {
            // width: '120px',
            name: 'Property/Vehicle #',
            selector: (row) => row.TransactionNumber,
            sortable: true
        },
        {
            // width: '180px',
            name: 'Property/Vechicle Category',
            selector: (row) => row.PropertyCategory,
            sortable: true
        },
        {
            // width: '180px',
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            // width: '180px',
            name: 'Fast Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            // width: '180px',
            name: 'Middle Name',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            // width: '180px',
            name: 'Gender',
            selector: (row) => row.Sex_Description,
            sortable: true
        },

    ]

    return (

        <div className="col-md-12 mt-2">
            <div className="col-12">
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? OwnerHistory : [] : OwnerHistory}
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

export default OwnerHistory