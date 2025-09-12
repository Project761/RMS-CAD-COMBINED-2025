import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility'
import { fetchPostData } from '../../../../hooks/Api'
import { useLocation } from 'react-router-dom'
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'

const VehicleChain = (props) => {
    const dispatch = useDispatch()
    const { DecVehId, DecMVehId } = props

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);


    const query = useQuery();

    let MstVehicle = query?.get('page');

    const [data, setData] = useState([]);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("V095", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    const get_ChainOfCustodyData = () => {
        const val = {
            'PropertyID': DecVehId, 'MasterpropertyID': 0,
        };
        const val1 = {
            'MasterpropertyID': DecVehId, 'PropertyID': 0,
        };

        fetchPostData('Propertyroom/GetData_ChainOfCustody', MstVehicle === "MST-Vehicle-Dash" ? val1 : val).then((res) => {
            if (res) {
                setData(res);
            } else { setData([]); }
        });
    };



    useEffect(() => {
        if (DecVehId || DecMVehId) { get_ChainOfCustodyData(); }
        get_ChainOfCustodyData();
    }, []);

    const columns = [
        {
            name: 'Officer Name',
            selector: (row) => row.Officer_Name,
            sortable: true,
        },
        {
            name: 'Activity Reason',
            selector: (row) => row.ActivityReason_Des,
            sortable: true,
        },
        {
            name: 'Other Person Name',
            selector: (row) => row.OtherPersonName_Name,
            sortable: true,
        },
        {
            name: 'Activity Type',
            selector: (row) => row.Status,
            sortable: true,
        },
    ];


    return (
        <div className="col-12 px-3 mt-2 modal-table" >
            <DataTable
                columns={columns}
                data={data}
                showHeader={true}
                persistTableHead={true}
                dense
                highlightOnHover
                responsive
                customStyles={tableCustomStyles}
                fixedHeader
                fixedHeaderScrollHeight='220px'
                pagination
                paginationPerPage={100}
                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                paginationComponentOptions={{ rowsPerPageText: 'Rows per page:' }}
                showPaginationBottom={100}
                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}

            />
        </div>
    )
}

export default VehicleChain