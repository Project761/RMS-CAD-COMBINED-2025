import { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ChangesModal from '../../Common/ChangesModal';
import { AgencyContext } from '../../../Context/Agency/Index';
import { base64ToString, Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../Common/Utility';
import { fetchPostData } from '../../hooks/Api';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';


const CloseHistory = () => {

    const [logData, setLogData] = useState([]);
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { get_Incident_Count } = useContext(AgencyContext);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let MstPage = query?.get('page');
    var IncID = query?.get("IncId");

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("C150", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (IncID) {
            get_LogData(IncID); get_Incident_Count(IncID)
        }
    }, [IncID])

    const get_LogData = () => {
        const val = { 'IncidentID': IncID }
        fetchPostData('/IncidentCloseHistory/GetData_IncidentCloseHistory', val).then((res) => {
            if (res) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        })
    }

    const columns = [
        {
            name: 'Incident Number',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            name: 'TIBRS StatusDt/Tm',
            selector: (row) => row.NIBRSStatusDtTm ? getShowingDateText(row.NIBRSStatusDtTm) : " ",
            sortable: true
        },
        {
            name: 'Comments',
            selector: (row) => row.Comments,
            sortable: true
        },
        {
            name: 'Case History',
            selector: (row) => row.CloseHistoryID,
            sortable: true
        },
        {
            name: 'TIBRS Status',
            selector: (row) => row.NIBRSStatus,
            sortable: true
        },


    ]

    return (
        <>

            <div className="col-12 col-sm-12 mt-2">
                <DataTable
                    dense
                    columns={columns}
                    // data={logData}
                    // noDataComponent={'There are no data to display'}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? logData : [] : logData}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    selectableRowsHighlight
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    persistTableHead={true}
                    pagination
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    showPaginationBottom={100}
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                />
                <ChangesModal />
            </div>
        </>
    )
}

export default CloseHistory







