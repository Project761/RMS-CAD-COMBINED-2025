
import React, { useState, useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { base64ToString, Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';

const Roster = ({ }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    const [unitList, setUnitList] = useState([]);
    const [unitUserList, setUnitUserList] = useState([]);
    const [pinID, setPinID] = useState('');
    const [permissionForAddRoster, setPermissionForAddRoster] = useState(false);
    const [permissionForEditRoster, setPermissionForEditRoster] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'AgencyID': aId, 'UnitId': ''
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            // old code ->   A011
            dispatch(get_ScreenPermissions_Data("A138", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
        }
    }, [localStoreData]);

    // Onload Function
    useEffect(() => {
        if (aId) {
            get_Unit_List(aId)
        }
    }, [aId])

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAddRoster(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEditRoster(effectiveScreenPermission[0]?.Changeok);
            // for change tab when not having  add and update permission
            // setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setPermissionForAddRoster(false);
            setPermissionForEditRoster(false);
            // for change tab when not having  add and update permission
            // setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);


    const get_Unit_List = (aId) => {
        const value = { AgencyID: aId, }
        fetchPostData('Unit/UnitGetData', value).then((res) => {
            if (res) {
                setUnitList(changeArrayFormat(res, 'group'))
            } else {
                setUnitList([]);
            }
        })
    }

    const unitChange = (e) => {
        if (e) {
            setValue({ ...value, ['UnitId']: e.value });
            unitUser(e.value)
        } else {
            setUnitUserList([])
        }
    }

    const unitUser = (id) => {
        const data = { UnitID: id, AgencyId: aId }
        fetchPostData('RoasterUnit/GetDataUnitUser', data).then(result => {
            if (result) {
                console.log("🚀 ~ fetchPostData ~ result:", result);
                setUnitUserList(result)
            } else {
                setUnitUserList([])
            }
        })
    }

    const column = [
        {
            name: 'Assigned/Unassigned',
            selector: (row) => <input type="checkbox" disabled={
                effectiveScreenPermission ?
                    effectiveScreenPermission[0]?.Changeok === 0 ? true
                        : false
                    : false
            }
                checked={row.Assign} onClick={(e) => update_Assigned_Roster(row.PINID, row.Assign ? 0 : 1)} />,
            sortable: true
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'Phone Number',
            selector: (row) => row.WorkPhoneNumber,
            sortable: true
        },

    ]

    // Update Roster
    const update_Assigned_Roster = (PINID, type) => {
        const val = { UnitID: value.UnitId, PINID: PINID }
        AddDeleteUpadate('RoasterUnit/InsertAssignUnitUser', val).then(res => {
            if (res) {
                unitUser(value.UnitId)
                if (type === 1) {
                    toastifySuccess("Unit is assigned !")
                }
                if (type === 0) {
                    toastifySuccess("Unit is Unassigned !")
                }
            }
        })
    }

    return (
        <div className="col-12">
            <div className="row">
                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                    <label htmlFor="" className='new-label'>Unit</label>
                </div>
                <div className="col-6 col-md-6 col-lg-5 mt-2">
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        name="UnitId"
                        options={unitList}
                        isClearable
                        onChange={unitChange}
                    />
                </div>
            </div>
            <div className="col-12 mt-1">
                <DataTable
                    columns={column}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? unitUserList : '' : ''}
                    dense
                    paginationRowsPerPageOptions={[10, 15]}
                    highlightOnHover
                    noContextMenu
                    pagination
                    responsive
                    showHeader={true}
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    fixedHeader
                    subHeaderAlign="right"
                    subHeaderWrap
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
        </div>
    )
}

export default Roster

export const changeArrayFormat = (data, type) => {
    if (type === 'group') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.UnitId, label: sponsor.UnitName, })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, id) => {
    if (type === 'group') {
        const result = data?.filter(function (option) { return option.GroupID === id }).map((sponsor) =>
            ({ value: sponsor.UnitId, label: sponsor.UnitName })
        )
        return result[0]
    }
}
