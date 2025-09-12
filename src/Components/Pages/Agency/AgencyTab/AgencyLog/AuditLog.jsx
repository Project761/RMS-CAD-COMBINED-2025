
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import { Decrypt_Id_Name, base64ToString, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useLocation } from 'react-router-dom';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const AuditLog = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const [pinId, setPinID] = useState('');
    const [personalGroupList, setPersonalGroupList] = useState([]);


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var Aid = query?.get("Aid");
    var perId = query?.get('perId');

    if (!Aid) Aid = 0;
    else Aid = parseInt(base64ToString(Aid));
    if (!perId) perId = 0;
    else perId = parseInt(base64ToString(perId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("A140", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (Aid) {
            get_AuditLog(Aid);
        }
    }, [Aid, perId]);

    const get_AuditLog = () => {
        const val = {
            AgencyID: Aid,

        };
        fetchPostData('Log/GetData_AgencyLog', val).then((res) => {
            console.log(res);
            if (res) setPersonalGroupList(res);
            else setPersonalGroupList();
        }).catch((error) => {
            console.error('There was an error!', error);
        });
    };


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

            name: 'New Value',
            selector: (row) => row.NewValue,
            sortable: true
        },
        {

            name: 'Change Date',

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
    ];

    return (
        <div className="row px-3">
            <div className="col-12 mt-3 ">
                <DataTable
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? personalGroupList : '' : ''}
                    // data={personalGroupList}
                    dense
                    paginationPerPage={'15'}
                    paginationRowsPerPageOptions={[15, 20, 25]}
                    highlightOnHover
                    noContextMenu
                    pagination
                    responsive
                    showHeader={true}
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    subHeaderAlign="right"
                    fixedHeader
                    fixedHeaderScrollHeight="450px"
                    subHeaderWrap
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
        </div>
    );
};

export default AuditLog;
