import React, { useContext, useEffect, useRef, useState } from 'react'
import Tab from '../../Utility/Tab/Tab';
import DataTable from 'react-data-table-component';
import { base64ToString, Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime, tableCustomStyles } from '../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useLocation } from 'react-router-dom';
import { fetchPostData } from '../../hooks/Api';
import ChangesModal from '../../Common/ChangesModal';
import { AgencyContext } from '../../../Context/Agency/Index';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';


const NIBRSAudit = () => {

    const [logData, setLogData] = useState([]);
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { incidentCount, get_Incident_Count } = useContext(AgencyContext);

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
            dispatch(get_ScreenPermissions_Data("T149", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (IncID) {
            get_LogData(IncID); get_Incident_Count(IncID)
        }
    }, [IncID])

    const get_LogData = () => {
        const val = { 'IncidentID': IncID }
        fetchPostData('/Log/AuditNIBRSData', val).then((res) => {
            if (res) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        })
    }

    const columns = [
        {
            width: '180px',
            name: 'Column Name',
            selector: (row) => row.ColumnName,
            sortable: true
        },
        {
            width: '140px',
            name: 'Old Value',
            selector: (row) => row.OldValue,
            sortable: true
        },
        {
            width: '180px',
            name: 'New Value',
            selector: (row) => {
                const isDateLike = (value) => {
                    return value && /^\d{4}-\d{2}-\d{2}$/.test(value);
                };
                if (isDateLike(row.NewValue)) {
                    return getShowingWithOutTime(row.NewValue);
                } else {
                    return row.NewValue || " ";
                }
            },
            sortable: true
        },

        {
            name: 'Change Date',
            selector: (row) => row.ChangeDate,
            selector: (row) => row.ChangeDate ? getShowingDateText(row.ChangeDate) : " ",
            sortable: true
        },
        {
            name: 'Officer Name',
            selector: (row) => row.Officer_Name,
            sortable: true
        },
        {
            name: 'Module',
            selector: (row) => row.Module,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => row.Status,
            sortable: true
        },
    ]

    return (
        <>
            <div className="section-body view_page_design  p-1 bt">
                <div className="col-12 inc__tabs">
                    <Tab />
                </div>
                <div className="col-12 col-sm-12">
                    <div className="card Agency incident-card mt-2 ">
                        <DataTable
                            dense
                            columns={columns}
                            // data={logData}
                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? logData : [] : logData}
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            // data={logData ? logData : []}
                            selectableRowsHighlight
                            highlightOnHover
                            customStyles={tableCustomStyles}
                            persistTableHead={true}
                            pagination
                            paginationPerPage={'100'}
                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                            showPaginationBottom={100}
                            fixedHeader
                        // fixedHeaderScrollHeight='450px'
                        />
                    </div>
                    <ChangesModal />
                </div>
            </div >

        </>
    )
}

export default NIBRSAudit







