import React, { useState, useEffect } from 'react'
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../../Common/Utility'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { useDispatch, useSelector } from 'react-redux'
import { get_LocalStoreData } from '../../../../../redux/actions/Agency'
import { useLocation } from 'react-router-dom'
import Loader from '../../../../Common/Loader'

const ScreenPermission = ({ allowMultipleLogin }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [moduleFK, setModuleFK] = useState([]);
    const [applicationScreensByModule, setApplicationScreensByModule] = useState({});
    const [expandedModules, setExpandedModules] = useState({});
    const [groupFieldPermissions, setGroupFieldPermissions] = useState([]);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [pinID, setPinID] = useState('');
    const [selectedScreenId, setSelectedScreenId] = useState(null);
    const [applicationScreen, setApplicationScreen] = useState([])
    const [loder, setLoder] = useState(false);
    const [permissionForAddScreenPermission, setPermissionForAddScreenPermission] = useState(false);
    const [permissionForEditScreenPermission, setPermissionForEditScreenPermission] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return { get: (param) => params.get(param) };
    };

    const query = useQuery();
    let aId = query?.get("Aid");
    const aIdSta = query?.get("ASta");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    const [value, setValue] = useState({
        'ApplicationId': '', 'ModuleFK': '', 'AgencyID': '', 'screenid': '', 'GroupId': ''
    });

    // Initial data fetch
    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            get_ModuleFK('1');
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    // const getScreenPermision = (aId, pinID) => {
    //     ScreenPermision("A008", aId, pinID).then(res => {
    //         if (res) setEffectiveScreenPermission(res);
    //         else setEffectiveScreenPermission([]);
    //     });
    // };

    const get_ModuleFK = (id) => {
        const val = { ApplicationId: id };
        fetchPostData('ScreenPermission/GetData_Module', val).then(res => {
            if (res) {
                console.log(res)
                setModuleFK(changeArrayFormat(res, 'modul'));
            } else {
                setModuleFK([]);
            }
        });
    };

    const get_ApplicationScreen = (moduleId) => {
        const val = { ModuleFK: moduleId, IsChield: 0 };
        fetchPostData('ScreenPermission/GetData_ApplicationScreen', val).then(res => {
            if (res) {
                setApplicationScreensByModule(prev => ({
                    ...prev,
                    [moduleId]: changeArrayFormat(res, 'screen')
                }));
            } else {
                setApplicationScreensByModule(prev => ({
                    ...prev,
                    [moduleId]: []
                }));
            }
        });
    };

    // const get_GroupField_Permissions = (screenid) => {
    //     const val = { 'AgencyID': aId, 'screenid': screenid };
    //     fetchPostData('ScreenPermission/GetData_GroupScreenPermissions', val).then(res => {
    //         if (res) {
    //             setGroupFieldPermissions(res);
    //         } else {
    //             setGroupFieldPermissions([]);
    //         }
    //     });
    // };

    // const handleModuleToggle = (moduleId) => {
    //     const isExpanded = expandedModules[moduleId];
    //     setExpandedModules(prev => ({ ...prev, [moduleId]: !isExpanded }));

    //     if (!isExpanded && !applicationScreensByModule[moduleId]) {
    //         get_ApplicationScreen(moduleId);
    //     }
    // };

    // const handleModuleToggle = (moduleId) => {
    //     setExpandedModules({ [moduleId]: true });

    //     if (!applicationScreensByModule[moduleId]) {
    //         get_ApplicationScreen(moduleId);
    //     }
    // };

    const handleModuleToggle = (moduleId, screenId) => {
        setExpandedModules(prev => {
            const isCurrentlyExpanded = !!prev[moduleId];

            if (isCurrentlyExpanded) {
                // Collapsing the module
                setSelectedScreenId(null);
                setGroupFieldPermissions([]);
                return {}; // Collapse all
            } else {
                // Expanding the module
                if (!applicationScreensByModule[moduleId]) {
                    get_ApplicationScreen(moduleId);
                }

                // Only call when expanding
                setValue(prev => ({ ...prev, screenid: screenId }));
                get_GroupField_Permissions(screenId);

                return { [moduleId]: true }; // Expand only the clicked one
            }
        });
    };






    const handleScreenClick = (screen) => {
        setSelectedScreenId(screen.value);
        setValue(prev => ({ ...prev, screenid: screen.value }));
        get_GroupField_Permissions(screen.value);
    };

    const handlePermissionChange = (e, row) => {
        const { screenid } = value;

        setValue({ ...value, ['GroupId']: e.target.value });

        const val = {
            'Display': e.target.name === 'Display' ? e.target.checked : row.Display,
            'Add': e.target.name === 'AddOK' ? e.target.checked : row.AddOK,
            'Change': e.target.name === 'Change' ? e.target.checked : row.Change,
            'Delete': e.target.name === 'DeleteOK' ? e.target.checked : row.DeleteOK,
            'GroupID': e.target.value,
            'screenid': screenid,
            'AgencyId': aId,
            'ModifiedByUserFK': pinID,
        };

        AddDeleteUpadate('ScreenPermission/UpdateGroupScreenPermissions', val).then(res => {
            if (res?.success) {
                const parsedData = JSON.parse(res.data);
                toastifySuccess(parsedData?.Table?.[0]?.Message);
            }
            get_GroupField_Permissions(screenid);
        });
    };


    const handleChange = (e, row) => {
        setValue({
            ...value,
            ['GroupId']: e.target.value
        });
        update_GroupField_Permissions(e, row)
    }

    const getScreenPermision = (aId, pinID) => {
        ScreenPermision("A008", aId, pinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res);
                setLoder(true);
                setPermissionForAddScreenPermission(res?.[0]?.AddOK); setPermissionForEditScreenPermission(res?.[0]?.Changeok);
                // for change tab when not having  add and update permission
                // setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
            }
            else {
                setEffectiveScreenPermission(); setPermissionForAddScreenPermission(false); setPermissionForEditScreenPermission(false);
                // for change tab when not having  add and update permission
                // setaddUpdatePermission(false)
            }
        }).catch(error => {
            console.error('There was an error!', error);
            setPermissionForAddScreenPermission(false);
            setPermissionForEditScreenPermission(false);
            // for change tab when not having  add and update permission
            // setaddUpdatePermission(false)
        });
    }

    const ModuleFKChange = (e) => {
        if (e) {
            setValue({ ...value, ['ModuleFK']: e.value, ['screenid']: '', })
            get_ApplicationScreen(e.value);
            setApplicationScreen([]);
            setGroupFieldPermissions([])
        } else {
            setValue({ ...value, ['ModuleFK']: null, ['screenid']: null, })
            setApplicationScreen([]);
            setGroupFieldPermissions([])
        }
    }

    const ApplicationScreenChange = (e) => {
        if (e) {
            setValue({ ...value, ['screenid']: e.value })
            get_GroupField_Permissions(e.value);
        } else {
            setValue({ ...value, ['screenid']: null })
            setGroupFieldPermissions([])
        }
    }

    // Get Module and Application Screen And Group Field permission
    // const get_ModuleFK = (id) => {
    //     const val = { ApplicationId: id }
    //     fetchPostData('ScreenPermission/GetData_Module', val).then(res => {
    //         if (res) { setModuleFK(changeArrayFormat(res, 'modul')); }
    //         else setModuleFK()
    //     })
    // }

    // const get_ApplicationScreen = (id) => {
    //     const val = { ModuleFK: id, IsChield: 0 }
    //     fetchPostData('ScreenPermission/GetData_ApplicationScreen', val).then(res => {
    //         if (res) {

    //             setApplicationScreen(changeArrayFormat(res, 'screen'))
    //         } else {
    //             setApplicationScreen([]);
    //             setGroupFieldPermissions()
    //         }
    //     })
    // }

    const get_GroupField_Permissions = (screenid) => {
        const val = { 'AgencyID': aId, 'screenid': screenid }
        setLoder(false);
        fetchPostData('ScreenPermission/GetData_GroupScreenPermissions', val).then(res => {
            if (res) {
                setLoder(true);
                setGroupFieldPermissions(res);
            } else {
                setGroupFieldPermissions()
            }
        })
    }

    // Update group field permission
    const update_GroupField_Permissions = (e, row) => {
        const { screenid, AgencyID } = value
        const val = {
            'Display': e.target.name === 'Display' ? e.target.checked : row.Display,
            'Add': e.target.name === 'AddOK' ? e.target.checked : row.AddOK,
            'Change': e.target.name === 'Change' ? e.target.checked : row.Change,
            'Delete': e.target.name === 'DeleteOK' ? e.target.checked : row.DeleteOK,
            'GroupID': e.target.value,
            'screenid': screenid,
            'AgencyId': aId,
            'ModifiedByUserFK': pinID,
        }

        AddDeleteUpadate('ScreenPermission/UpdateGroupScreenPermissions', val).then(res => {

            if (res?.success) {
                const parsedData = JSON.parse(res.data);
                toastifySuccess(parsedData?.Table?.[0]?.Message);
            }
            get_GroupField_Permissions(screenid)
        })
    }



    const columns = [
        {
            name: 'Group Name',
            selector: (row) => row.GroupName,
            sortable: true
        },
        {
            name: 'Display',
            selector: (row) => <input type="checkbox" checked={row.Display} value={row.GroupId} name='Display'
                disabled={effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Add',
            selector: (row) => <input type="checkbox" checked={row.AddOK} value={row.GroupId} name='AddOK'
                disabled={effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Change',
            selector: (row) => <input type="checkbox" checked={row.Change} value={row.GroupId} name='Change'
                disabled={effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        },
        {
            name: 'Delete',
            selector: (row) => <input type="checkbox" checked={row.DeleteOK} value={row.GroupId} name='DeleteOK'
                disabled={effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok === 1 ? false : true : false}
                onChange={(e) => handleChange(e, row)} />,
            sortable: true
        }

    ]




    return (
        <div className=" mt-2 child" style={{ height: 'calc(100vh - 100px)' }}>
            <div className="row g-3" style={{ height: 'calc(100% - 20px)' }} >

                <div className="col-md-5  d-flex flex-column mt-3" style={{ height: "90%" }}>
                    <div
                        className="border rounded p-2 flex-grow-1 bg-white shadow-sm"
                        style={{ overflowY: "auto" }}
                    >
                        {moduleFK?.map((module) => (
                            <div key={module.value} className="module-item mb-3">
                                <div
                                    className="d-flex justify-content-between align-items-center p-2 rounded"
                                    style={{
                                        backgroundColor: "#f0f4ff",
                                        border: "1px solid #d0d8ff",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "background 0.2s",
                                    }}
                                    onClick={() => handleModuleToggle(module.value, module.ScreenID)}

                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e3eaff")}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f0f4ff")}
                                >
                                    <span>{module.label}</span>
                                    <span
                                        style={{
                                            fontSize: "1.2rem",
                                            fontWeight: "bold",
                                            color: "#3366cc",
                                        }}
                                    >
                                        {expandedModules[module.value] ? "−" : "+"}
                                    </span>
                                </div>

                                {expandedModules[module.value] && (
                                    <div className="application-screen-list ps-4 pt-2 ml-4">
                                        {applicationScreensByModule[module.value]?.length > 0 ? (
                                            applicationScreensByModule[module.value].map((screen) => (
                                                <div
                                                    key={screen.value}
                                                    className={`screen-item mb-1 ps-2 py-1 rounded ${selectedScreenId === screen.value
                                                        ? "fw-bold text-primary bg-light border px-1"
                                                        : "text-dark px-1"
                                                        }`}
                                                    style={{
                                                        cursor: "pointer",
                                                        transition: "background 0.2s",
                                                    }}
                                                    onMouseOver={(e) =>
                                                        (e.currentTarget.style.backgroundColor = "#f8f9fa px-1")
                                                    }
                                                    onMouseOut={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        selectedScreenId === screen.value ? "#f8f9fa" : "transparent")
                                                    }
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
                {/* style={{ height: "45%" }} */}
                <div className="col-md-7 mt-3 h-75 "  >
                    <DataTable
                        columns={columns}
                        data={loder ? ( effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? groupFieldPermissions : '' : '' ) : []}
                        dense
                        paginationRowsPerPageOptions={[10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        subHeaderAlign="right"
                        subHeaderWrap
                        showHeader={true}
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        noDataComponent={ loder ? (effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data"
                                    : 'There are no data to display') : <Loader /> 
                        }
                    />

                    <div>



                    </div>
                </div>
            </div>

        </div>
    );
};

export default ScreenPermission;

// Format dropdown data
export const changeArrayFormat = (data, type) => {
    if (type === 'modul') {
        return data?.map((item) => ({ value: item.ModulePK, label: item.ModuleName, ScreenID: item.ScreenID }));
    }
    if (type === 'screen') {
        return data?.map((item) => ({ value: item.ScreenID, label: item.Description }));
    }
};