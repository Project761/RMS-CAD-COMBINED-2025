import React, { useState, useEffect } from 'react';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import Loader from '../../../../Common/Loader';

const ScreenPermission = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID')
        ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
        : '';

    const [moduleFK, setModuleFK] = useState([]);
    const [applicationScreensByModule, setApplicationScreensByModule] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const [groupFieldPermissions, setGroupFieldPermissions] = useState([]);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddScreenPermission, setPermissionForAddScreenPermission] = useState(false);
    const [permissionForEditScreenPermission, setPermissionForEditScreenPermission] = useState(false);
    const [selectedScreenId, setSelectedScreenId] = useState(null);
    const [pinID, setPinID] = useState('');
    const [agencyID, setAgencyID] = useState('');
    const [loder, setLoder] = useState(false);

    const [value, setValue] = useState({
        ApplicationId: '1',
        ModuleFK: '',
        TableID: '',
        screenid: '',
        GroupId: '',
    });


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);


    useEffect(() => {
        if (localStoreData?.AgencyID && localStoreData?.PINID) {
            setAgencyID(localStoreData.AgencyID);
            setPinID(localStoreData.PINID);
            get_ModuleFK('1');
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);


    const get_ModuleFK = (id) => {
        const val = { ApplicationId: id, IslstTables: true };
        fetchPostData('ScreenPermission/GetData_Module', val).then((res) => {
            if (res) setModuleFK(changeArrayFormat(res, 'modul'));
            else setModuleFK([]);
        });
    };

    const getScreenPermision = (aId, pinID) => {
        ScreenPermision("A008", aId, pinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res);
                setLoder(true);
                setPermissionForAddScreenPermission(res?.[0]?.AddOK); setPermissionForEditScreenPermission(res?.[0]?.Changeok);

            }
            else {
                setEffectiveScreenPermission(); setPermissionForAddScreenPermission(false); setPermissionForEditScreenPermission(false);

            }
        }).catch(error => {
            console.error('There was an error!', error);
            setPermissionForAddScreenPermission(false);
            setPermissionForEditScreenPermission(false);

        });
    }

    const get_ApplicationScreen = (moduleId) => {
        const val = { ModuleID: moduleId };
        fetchPostData('TableManagement/GetData_TableManagement', val).then((res) => {
            if (res) {
                setApplicationScreensByModule((prev) => ({
                    ...prev,
                    [moduleId]: changeArrayFormat(res, 'screen'),
                }));
            } else {
                setApplicationScreensByModule((prev) => ({
                    ...prev,
                    [moduleId]: [],
                }));
            }
        });
    };

    const get_GroupField_Permissions = (tableId) => {
        const val = { AgencyID: agencyID, TableId: tableId };
        setLoder(false);
        fetchPostData('TablePermission/GetData_GroupTablePermissions', val).then((res) => {
            if (res) {
                setLoder(true);
                setGroupFieldPermissions(res);
            } else {
                setGroupFieldPermissions([]);
            }
        });
    };

    const update_GroupField_Permissions = (e, row) => {
        const val = {
            Display: e.target.name === 'Display' ? e.target.checked : row.Display,
            Add: e.target.name === 'AddOK' ? e.target.checked : row.AddOK,
            Change: e.target.name === 'Change' ? e.target.checked : row.Change,
            Delete: e.target.name === 'DeleteOK' ? e.target.checked : row.DeleteOK,
            permID: row.Id,
            ModifiedByUserFK: pinID,
        };

        AddDeleteUpadate('TablePermission/UpdateGroupTablePermissions', val).then((res) => {
            if (res.success === true) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_GroupField_Permissions(value.TableID);
            }
        });
    };


    const handleModuleToggle = (moduleId, TableID) => {

        setExpandedModules((prev) => {
            const isCurrentlyExpanded = !!prev[moduleId];

            if (isCurrentlyExpanded) {
                setSelectedScreenId(null);
                setGroupFieldPermissions([]);
                return {};
            } else {

                if (!applicationScreensByModule[moduleId]) {
                    get_ApplicationScreen(moduleId);
                }

                setValue(prev => ({ ...prev, TableID: TableID }));
                get_GroupField_Permissions(TableID);
                return { [moduleId]: true };
            }
        });
    };

    const handleScreenClick = (screen) => {
        setSelectedScreenId(screen.value);
        setValue((prev) => ({ ...prev, TableID: screen.value }));
        get_GroupField_Permissions(screen.value);
    };

    const handleChange = (e, row) => {
        setValue((prev) => ({ ...prev, GroupId: e.target.value }));
        update_GroupField_Permissions(e, row);
    };


    const columns = [
        { name: 'Group Name', selector: (row) => row.GroupName, sortable: true },
        {
            name: 'Display',
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={row.Display}
                    value={row.GroupId}
                    name="Display"
                    onChange={(e) => handleChange(e, row)}
                />
            ),
        },
        {
            name: 'Add',
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={row.AddOK}
                    value={row.GroupId}
                    name="AddOK"
                    onChange={(e) => handleChange(e, row)}
                />
            ),
        },
        {
            name: 'Change',
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={row.Change}
                    value={row.GroupId}
                    name="Change"
                    onChange={(e) => handleChange(e, row)}
                />
            ),
        },
        {
            name: 'Delete',
            selector: (row) => (
                <input
                    type="checkbox"
                    checked={row.DeleteOK}
                    value={row.GroupId}
                    name="DeleteOK"
                    onChange={(e) => handleChange(e, row)}
                />
            ),
        },
    ];




    return (
        <>
            <div className='card Agency incident-card'>
                <div className='card-body'>
                    <div className="mt-2 child" style={{ height: 'calc(100vh - 100px)' }}>
                        <div className="row g-3" style={{ height: 'calc(100% - 20px)' }}>
                            {/* Left Side → Module + Screens */}
                            <div className="col-md-5 d-flex flex-column mt-3" style={{ height: '90%' }}>
                                <div className="border rounded p-2 flex-grow-1 bg-white shadow-sm" style={{ overflowY: 'auto' }}>
                                    {moduleFK?.map((module) => (
                                        <div key={module.value} className="module-item mb-3">
                                            <div
                                                className="d-flex justify-content-between align-items-center p-2 rounded"
                                                style={{
                                                    backgroundColor: '#f0f4ff',
                                                    border: '1px solid #d0d8ff',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s',
                                                }}
                                                onClick={() => handleModuleToggle(module.value, module.TableId)}
                                            >
                                                <span>{module.label}</span>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3366cc' }}>
                                                    {expandedModules[module.value] ? '−' : '+'}
                                                </span>
                                            </div>

                                            {expandedModules[module.value] && (
                                                <div className="application-screen-list ps-4 pt-2 ml-4">
                                                    {applicationScreensByModule[module.value]?.length > 0 ? (
                                                        applicationScreensByModule[module.value].map((screen) => (
                                                            <div
                                                                key={screen.value}
                                                                className={`screen-item mb-1 ps-2 py-1 rounded ${selectedScreenId === screen.value
                                                                    ? 'fw-bold text-primary bg-light border px-1'
                                                                    : 'text-dark px-1'
                                                                    }`}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleScreenClick(screen)}
                                                            >
                                                                {screen.label}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-muted"></div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="col-md-7 mt-3 h-75">
                                <DataTable
                                    columns={columns}
                                     data={loder ? groupFieldPermissions : ''}
                                    // data={loder ? (effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? groupFieldPermissions : '' : '') : []}
                                    dense
                                    paginationRowsPerPageOptions={[10, 15]}
                                    highlightOnHover
                                    noContextMenu
                                    pagination
                                    responsive
                                    showHeader={true}
                                    persistTableHead={true}
                                    subHeaderAlign="right"
                                    subHeaderWrap
                                    customStyles={tableCustomStyles}
                                    progressPending={!loder}
                                    progressComponent={<Loader />}
                                    noDataComponent="No Data Available"
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScreenPermission;

// Format dropdown data
export const changeArrayFormat = (data, type) => {
    if (type === 'modul') {
        return data?.map((item) => ({
            value: item.ModulePK,
            label: item.ModuleName,
            TableId: item.TableId
        }));
    }
    if (type === 'screen') {
        return data?.map((item) => ({
            value: item.TableID,
            label: item.Name,
        }));
    }
};
