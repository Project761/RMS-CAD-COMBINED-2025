import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getShowingDateText, getShowingWithFixedTime01, getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility'
import { fetchPostData } from '../../../../hooks/Api'
import { useLocation } from 'react-router-dom'
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

const ChainOfCustody = (props) => {
    const dispatch = useDispatch()
    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();

    let MstPage = query?.get('page');

    const { DecPropID = 0, DecMPropID = 0, } = props
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [data, setData] = useState([]);

    const get_ChainOfCustodyData = (Id) => {
        const val = {
            'PropertyID': Id,
        };
        const val2 = {
            'MasterPropertyId': Id,
        }
        fetchPostData('Propertyroom/GetData_ChainOfCustody', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {
                setData(res);
            } else { setData([]); }
        });
    };

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("P093", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);



    useEffect(() => {
        if (DecPropID || DecMPropID) { get_ChainOfCustodyData(MstPage === "MST-Property-Dash" ? DecMPropID : DecPropID); }
    }, [DecPropID, DecMPropID]);

    const columns = [
        {
            name: 'Property #',
            selector: (row) => row.PropertyNumber,
            sortable: true,
        },
        {
            name: 'Activity ',
            selector: (row) => row.Status,
            sortable: true,
        },
        {
            name: 'Date & Time',
            selector: (row) => row.ExpectedDate ? getShowingWithFixedTime01(row.ExpectedDate) : '',
            // selector: (row) => row.ExpectedDate,
            sortable: true,
        },
        {
            name: 'Officer Name',
            selector: (row) => row.Officer_Name,
            sortable: true,
        },
        // {
        //     name: 'Activity Reason',
        //     selector: (row) => row.ActivityReason_Des,
        //     sortable: true,
        // },

        {
            name: 'Property Room',
            selector: (row) => '',
            sortable: true,
        },

        {
            name: 'Location',
            selector: (row) => row.location,
            sortable: true,
        },
        {
            name: 'Schedule Destroy Date',
            selector: (row) => row.DestroyDate,
            sortable: true,
        },
        {
            name: 'Schedule Court Date',
            selector: (row) => row.CourtDate,
            sortable: true,
        },
        {
            name: 'Schedule Release Date',
            selector: (row) => row.ReleaseDate ? getShowingDateText(row.ReleaseDate) : '',
            sortable: true,
        },
        {
            name: 'Release To',
            selector: (row) => row.RecepientName,
            sortable: true,
        },
        {
            name: 'Comment',
            selector: (row) => row.ActivityComments,
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

export default ChainOfCustody