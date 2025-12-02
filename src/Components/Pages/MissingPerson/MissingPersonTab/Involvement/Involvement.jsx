import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { base64ToString, Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility'
import { fetchPostData } from '../../../../hooks/Api';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useLocation } from 'react-router-dom';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const Involvement = ({ DecMissPerID, DecIncID }) => {

    const [logData, setLogData] = useState([]);
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const { incidentCount, get_Incident_Count } = useContext(AgencyContext);


    const [filters, setFilters] = useState({ ColumnName: '', NewValue: '', Officer_Name: '', Module: '' })

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
            dispatch(get_ScreenPermissions_Data("M143", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (localStoreData) {

        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecMissPerID) {
            get_LogData(DecMissPerID); get_Incident_Count(DecIncID)
        }
    }, [DecMissPerID])

    const get_LogData = () => {
        const val = { 'MissingPersonID': DecMissPerID }
        fetchPostData('/Log/GetData_MissingPersonLog', val).then((res) => {
            if (res) {
                setLogData(res);
            } else {
                setLogData([]);
            }
        })
    }

    const filteredData = logData.filter((row) => {
        return (
            (!filters.ColumnName || row.ColumnName?.toLowerCase().includes(filters.ColumnName.toLowerCase())) &&
            (!filters.OldValue || row.OldValue?.toLowerCase().includes(filters.OldValue.toLowerCase())) &&
            (!filters.NewValue || row.NewValue?.toLowerCase().includes(filters.NewValue.toLowerCase())) &&
            (!filters.Officer_Name || row.Officer_Name?.toLowerCase().includes(filters.Officer_Name.toLowerCase())) &&
            (!filters.Module || row.Module?.toLowerCase().includes(filters.Module.toLowerCase()))
        );
    });


    const columns = [
        {
            name: 'Column Name',
            selector: (row) => row.ColumnName,
            sortable: true
        },
        {
            name: 'Old Value',
            selector: (row) => row.OldValue,
            sortable: true
        },
        {
            width: '180px',
            name: 'New Value',
            selector: (row) => {
                const isDateLike = (value) => {
                    return value && /^\d{4}-\d{2}-\d{2}$/.test(value)
                }
                let displayValue = ''
                if (isDateLike(row.NewValue)) {
                    displayValue = getShowingWithOutTime(row.NewValue)
                } else {
                    displayValue = row.NewValue || ' '
                }

                return (
                    <span title={row?.NewValue}>
                        {displayValue?.substring(0, 20)}
                        {displayValue?.length > 20 ? '...' : ''}
                    </span>
                )
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
            <div className="col-12 child" >
                <div className="row g-2 mb-2 mt-2">
                    <div className="col-12 col-sm-6 col-md">
                        <input
                            type="text"
                            placeholder="Search By Column Name..."
                            className="form-control"
                            value={filters.ColumnName}
                            onChange={(e) => setFilters({ ...filters, ColumnName: e.target.value })}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md">
                        <input
                            type="text"
                            placeholder="Search By Old Value..."
                            className="form-control"
                            value={filters.OldValue}
                            onChange={(e) => setFilters({ ...filters, OldValue: e.target.value })}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md">
                        <input
                            type="text"
                            placeholder="Search By New Value..."
                            className="form-control"
                            value={filters.NewValue}
                            onChange={(e) => setFilters({ ...filters, NewValue: e.target.value })}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md">
                        <input
                            type="text"
                            placeholder="Search By Officer Name..."
                            className="form-control"
                            value={filters.Officer_Name}
                            onChange={(e) => setFilters({ ...filters, Officer_Name: e.target.value })}
                        />
                    </div>
                    <div className="col-12 col-sm-6 col-md">
                        <input
                            type="text"
                            placeholder="Search By Module..."
                            className="form-control"
                            value={filters.Module}
                            onChange={(e) => setFilters({ ...filters, Module: e.target.value })}
                        />
                    </div>
                </div>
                <div className="col-12 mt-2">
                    <DataTable
                        dense
                        columns={columns}
                        data={filteredData}
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        fixedHeaderScrollHeight='450px'
                        fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                        pagination
                        paginationPerPage={100}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    />
                </div>
            </div>
        </>
    )
}

export default Involvement