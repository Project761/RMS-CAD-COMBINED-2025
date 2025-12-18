
import React, { useState, useEffect, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AddDeleteUpadate, fetchPostData, fieldPermision, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../../Common/Utility';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import ChangesModal from '../../../../Common/ChangesModal';



const Group = ({ allowMultipleLogin }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const { get_CountList, changesStatus, setChangesStatus, } = useContext(AgencyContext);

    const [clickedRow, setClickedRow] = useState(null);
    const [groupList, setGroupList] = useState([]);
    const [getAgency_List, setgetAgency_List] = useState([]);
    const [groupEditData, setGroupEditData] = useState([]);
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [groupID, setGroupID] = useState();
    const [pinID, setPinID] = useState('');
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    const [permissionForAddGroup, setPermissionForAddGroup] = useState(false);
    const [permissionForEditGroup, setPermissionForEditGroup] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const [value, setValue] = useState({
        'GroupName': '', 'AgencyID': aId, 'ModifiedByUserFK': '', 'GroupID': '', 'IsAllowMultipleAgency': '', 'IsAllowUnSeal': '', 'IsAllowSeal': '', 'level': '',
        'CreatedByUserFK': pinID,
    })

    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        'GroupName': '', 'IsAdmin': '', 'IsAllowMultipleAgency': '', 'IsAllowUnSeal': '', 'IsAllowSeal': '',
    })

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


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (aId) {
            get_Group_List(aId);
        }
    }, [aId]);

    useEffect(() => {
        if (pinID) {
            setValue({
                ...value,
                'GroupName': '', 'AgencyID': aId, 'ModifiedByUserFK': '', 'GroupID': '', 'IsAllowMultipleAgency': '', 'IsAllowUnSeal': '', 'IsAllowSeal': '',
                'CreatedByUserFK': pinID,
            });
        }
    }, [pinID]);

    const reset_value = () => {
        setValue({
            ...value, 'GroupName': "", 'GroupID': "", 'IsAllowMultipleAgency': "", 'IsAllowUnSeal': '', 'IsAllowSeal': '', 'level': ''
        });
        setStatesChangeStatus(false); setChangesStatus(false);
    }

    useEffect(() => {
        if (aId && pinID) get_Field_Permision_Group(aId, pinID)
    }, [aId])

    useEffect(() => {
        if (groupEditData?.GroupID) {
            setValue({
                ...value,
                'GroupName': groupEditData?.GroupName,
                'ModifiedByUserFK': pinID,
                'GroupID': groupEditData?.GroupID,
                'IsAllowMultipleAgency': groupEditData?.IsAllowMultipleAgency,
                'IsAllowUnSeal': groupEditData?.IsAllowUnSeal,
                'IsAllowSeal': groupEditData?.IsAllowSeal,
                'CreatedByUserFK': '',
                'level': groupEditData?.level ? groupEditData?.level : ''


            });
        } else {
            setValue({
                ...value,
                'AgencyID': aId,
                'GroupName': '',
                'ModifiedByUserFK': '',
                'GroupID': '',
                'IsAllowMultipleAgency': '',
                'CreatedByUserFK': pinID,
                'IsAllowSeal': '',
                'IsAllowUnSeal': '',
                'level': ''

            });
        }
    }, [groupEditData, updateCount])


    // onChange Hooks Function
    const handlChange = (e) => {
        !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true)
        if (e.target.name === 'IsAllowMultipleAgency' || e.target.name === 'IsAllowUnSeal' || e.target.name === 'IsAllowSeal') {
            setValue({
                ...value,
                [e.target.name]: e.target.checked,
            });
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value,
            });
        }
    }

    // Get Effective Field Permission
    const get_Field_Permision_Group = (aId, pinID) => {
        fieldPermision(aId, 'A002', pinID).then(res => {
            if (res) {
                const groupNameFilter = Agency_Field_Permistion_Filter(res, "Agency-GroupName");
                const isAdminFilter = Agency_Field_Permistion_Filter(res, "Agency-IsAdmin");
                const IsAllowMultipleAgencyFilter = Agency_Field_Permistion_Filter(res, "Agency-IsAllowMultipleAgency");

                const IsAllowSealAgencyFilter = Agency_Field_Permistion_Filter(res, "Agency-IsAllowSeal");
                const IsAllowUnSealAgencyFilter = Agency_Field_Permistion_Filter(res, "Agency-IsAllowUnSeal");

                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['GroupName']: groupNameFilter || prevValues['GroupName'],
                        ['IsAdmin']: isAdminFilter || prevValues['IsAdmin'],
                        ['IsAllowMultipleAgency']: IsAllowMultipleAgencyFilter || prevValues['IsAllowMultipleAgency'],

                        ['IsAllowSeal']: IsAllowSealAgencyFilter || prevValues['IsAllowSeal'],
                        ['IsAllowUnSeal']: IsAllowUnSealAgencyFilter || prevValues['IsAllowUnSeal'],

                    }
                });
            }
        });
    }

    // Submit Group list
    const handleSubmit = (e) => {
        e.preventDefault()
        const result = groupList?.find(item => {
            if (item.GroupName?.trim() === value.GroupName?.trim()) {
                return item.GroupName?.trim() === value.GroupName?.trim()
            } else return item.GroupName?.trim() === value.GroupName?.trim()
        }
        );
        if (result) {
            toastifyError('Group Name Already Exists')
        } else if (value?.GroupName?.trim() !== '') {
            AddDeleteUpadate('Group/GroupInsert', value)
                .then(res => {
                    if (res.success) {

                        const parseData = JSON.parse(res.data);
                        const message = parseData?.Table[0].Message;
                        if (message && message.includes("Insert Successfully")) {
                            toastifySuccess(message);
                        } else {
                            toastifyError(message);
                        }
                        get_Group_List(aId); setChangesStatus(false)
                        get_CountList(aId); setModal(false); reset_value()
                        setStatesChangeStatus(false);

                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else toastifyError('Group Name Can`t be empty')
    }

    // Update group list 
    const group_Update = (e) => {
        e.preventDefault()
        const result = groupList?.find(item => {
            if (item.GroupID !== value.GroupID) {
                if (item.GroupName?.trim() === value.GroupName?.trim()) {
                    return item.GroupName?.trim() === value.GroupName?.trim()
                } else return item.GroupName?.trim() === value.GroupName?.trim()
            }
        }
        );
        if (result) {
            toastifyError('Group Name Already Exists')
        } else if (value?.GroupName?.trim() !== '') {
            AddDeleteUpadate('Group/GroupUpdate', value)
                .then(res => {
                    if (res.success) {




                        const parseData = JSON.parse(res.data);

                        const message = parseData?.Table[0].Message;
                        if (message && message.includes("Update Successfully")) {
                            toastifySuccess(message);
                        } else {
                            toastifyError(message);
                        }
                        setStatusFalse(); get_Group_List(aId);
                        getAgency_List(); setChangesStatus(false)
                        reset_value()
                        setStatesChangeStatus(false);

                    } else {
                        toastifyError(res.data.Message)
                    }
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            toastifyError('Group Name Can`t be empty')
        }
    }

    // Get Group List
    const get_Group_List = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {

                setGroupList(res)
            } else setGroupList()
        })
    }

    // Get Effective Screeen Permission
    const getScreenPermision = (aId, pinID) => {
        try {
            ScreenPermision("A002", aId, pinID).then(res => {
                if (res) {
                    setEffectiveScreenPermission(res);
                    setPermissionForAddGroup(res[0]?.AddOK);
                    setPermissionForEditGroup(res[0]?.Changeok);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
                }
                else {
                    setEffectiveScreenPermission([]);
                    setPermissionForAddGroup(false);
                    setPermissionForEditGroup(false);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(false)
                }
            });
        } catch (error) {
            console.error('There was an error!', error);
            setPermissionForAddGroup(false);
            setPermissionForEditGroup(false);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(false)
        }
    }

    const columns = [
        {
            name: 'Group Name',
            selector: (row) => row.GroupName,
            sortable: true
        },
        {
            name: 'Allow Multiple Agencies',
            selector: (row) => <input type="checkbox" checked={row.IsAllowMultipleAgency} disabled />,
            sortable: true
        },
        {
            name: 'Allow Seal',
            selector: (row) => <input type="checkbox" checked={row.IsAllowSeal} disabled />,
            sortable: true
        },
        {
            name: 'Allow UnSeal',
            selector: (row) => <input type="checkbox" checked={row.IsAllowUnSeal} disabled />,
            sortable: true
        },
        {
            name: 'Group Level',
            selector: (row) => row.level,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 53 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 60 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={(e) => setGroupID(row.GroupID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            : <span onClick={(e) => setGroupID(row.GroupID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>


        }
    ]

    const set_Edit_Value = (row) => {
        setStatesChangeStatus(false)
        setStatus(true); setModal(true); setGroupEditData(row); setUpdateCount(updateCount + 1);
    }

    const setStatusFalse = (e) => {
        setStatesChangeStatus(false);
        setClickedRow(null); setStatus(false); setGroupEditData(); setModal(true); reset_value();
    }

    const set_Status = (e) => {
        e.preventDefault()
        setStatus(false); setModal(true); setGroupEditData()
    }

    // Delete Group data
    const deleteData = async () => {
        const value = { GroupID: groupID, DeletedByUserFK: pinID }
        AddDeleteUpadate('Group/GroupDelete', value).then((data) => {
            if (data.success) {
                const parseData = JSON.parse(data.data);
                toastifySuccess(parseData?.Table[0].Message);
                setChangesStatus(false)
                get_Group_List(aId); get_CountList(aId); setStatusFalse();
            } else {
                toastifyError(data.Message)
            }
        });
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStatesChangeStatus(true);
        if (event) {
            setValue((prevState) => ({ ...prevState, [name]: value.replace(/\D/g, ''), }));
        }
        else {
            setValue((prevState) => ({ ...prevState, [name]: null, }));
        }
    };

    return (
        <>
            <div className="col-12">
                <div className="row ">
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                        <label htmlFor="" className='new-label text-nowrap'>Group Name </label>
                    </div>
                    <div className="col-10 col-md-10 col-lg-5 mt-2 text-field">
                        <input type="text"
                            className={fieldPermissionAgency?.GroupName[0] ?
                                fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && groupEditData?.GroupName === '' && status ? 'requiredColor' : fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.GroupName[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : ''
                            }
                            onChange={fieldPermissionAgency?.GroupName[0] ?
                                fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && groupEditData?.GroupName === '' && status ? handlChange : fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && !status ? handlChange : fieldPermissionAgency?.GroupName[0]?.Changeok === 1 && status ? handlChange : '' : handlChange
                            }
                            value={value.GroupName}
                            name='GroupName' required />
                    </div>

                    <div className="col-2 col-md-4 col-lg-1 mt-2 pt-1 text-right">
                        <label htmlFor="" className='new-label text-nowrap'> Group Level</label>
                    </div>
                    <div className="col-4  col-md-7 col-lg-5 mt-2 text-field">
                        <input type="text" name='level'
                            value={value.level}
                            autocomplete="off" className={''}
                            onChange={handleChange}
                            maxLength={1}

                        />
                    </div>

                    <div className="col-12 col-md-12 col-lg-4 mt-2">
                        <input type="checkbox" name="IsAllowMultipleAgency" checked={value.IsAllowMultipleAgency} value={value.IsAllowMultipleAgency}
                            onChange={fieldPermissionAgency?.IsAllowMultipleAgency[0] ?
                                fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && groupEditData?.IsAllowMultipleAgency === '' && status ? handlChange : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && !status ? handlChange : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 1 && status ? handlChange : ''
                                : handlChange
                            }
                            disabled={fieldPermissionAgency?.IsAllowMultipleAgency[0] ?
                                fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && groupEditData?.IsAllowMultipleAgency === '' && status ? false : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 1 && status ? false : true : false
                            }
                            id="IsAllowMultipleAgency" />
                        <label className='ml-2' htmlFor="IsAllowMultipleAgency">Allow Multiple Agencies</label>
                    </div>

                    <div className="col-12 col-md-12 col-lg-4 mt-2">
                        <input type="checkbox" name="IsAllowSeal" checked={value.IsAllowSeal} value={value.IsAllowSeal}

                            onChange={fieldPermissionAgency?.IsAllowSeal[0] ?
                                fieldPermissionAgency?.IsAllowSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowSeal[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.IsAllowSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowSeal[0]?.AddOK === 1 && groupEditData?.IsAllowSeal === '' && status ? handlChange : fieldPermissionAgency?.IsAllowSeal[0]?.AddOK === 1 && !status ? handlChange : fieldPermissionAgency?.IsAllowSeal[0]?.Changeok === 1 && status ? handlChange : ''
                                : handlChange
                            }
                            disabled={fieldPermissionAgency?.IsAllowSeal[0] ?
                                fieldPermissionAgency?.IsAllowSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowSeal[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.IsAllowSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowSeal[0]?.AddOK === 1 && groupEditData?.IsAllowSeal === '' && status ? false : fieldPermissionAgency?.IsAllowSeal[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.IsAllowSeal[0]?.Changeok === 1 && status ? false : true : false
                            }
                            id="IsAllowSeal" />
                        <label className='ml-2' htmlFor="IsAllowSeal">Allow Seal</label>
                    </div>

                    <div className="col-12 col-md-12 col-lg-4 mt-2 ">
                        <input type="checkbox" name="IsAllowUnSeal" checked={value.IsAllowUnSeal} value={value.IsAllowUnSeal}

                            onChange={fieldPermissionAgency?.IsAllowUnSeal[0] ?
                                fieldPermissionAgency?.IsAllowUnSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowUnSeal[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.IsAllowUnSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowUnSeal[0]?.AddOK === 1 && groupEditData?.IsAllowUnSeal === '' && status ? handlChange : fieldPermissionAgency?.IsAllowUnSeal[0]?.AddOK === 1 && !status ? handlChange : fieldPermissionAgency?.IsAllowUnSeal[0]?.Changeok === 1 && status ? handlChange : ''
                                : handlChange
                            }
                            disabled={fieldPermissionAgency?.IsAllowUnSeal[0] ?
                                fieldPermissionAgency?.IsAllowUnSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowUnSeal[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.IsAllowUnSeal[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowUnSeal[0]?.AddOK === 1 && groupEditData?.IsAllowUnSeal === '' && status ? false : fieldPermissionAgency?.IsAllowUnSeal[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.IsAllowUnSeal[0]?.Changeok === 1 && status ? false : true : false
                            }
                            id="IsAllowUnSeal" />
                        <label className='ml-2' htmlFor="IsAllowUnSeal">Allow Unseal</label>
                    </div>




                </div>
                <div className="col-12 btn-box text-right  mr-1  mt-2">
                    <button type="button" className="btn btn-sm btn-success mr-1 " data-dismiss="modal" onClick={() => { setStatusFalse(); }}>New</button>

                    {status ?
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.Changeok ?
                                <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={group_Update}>Update</button>
                                :
                                <>
                                </>
                            :
                            <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={group_Update}>Update</button>
                        :
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.AddOK ?
                                <button type="button" className="btn btn-sm btn-success mr-1" onClick={handleSubmit}>Save</button>
                                :
                                <>
                                </>
                            :
                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={handleSubmit}>Save</button>
                    }
                </div>
                <div className="col-12 mt-1">
                    <DataTable
                        dense
                        columns={columns}
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? groupList : '' : ''}
                        highlightOnHover
                        paginationPerPage={'100'}
                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                        noContextMenu
                        showHeader={true}
                        persistTableHead={true}
                        conditionalRowStyles={conditionalRowStyles}
                        customStyles={tableCustomStyles}
                        onRowClicked={(row) => {
                            set_Edit_Value(row); setClickedRow(row);
                        }}
                        fixedHeader
                        pagination
                        responsive
                        subHeaderAlign="right"
                        subHeaderWrap
                        fixedHeaderScrollHeight='340px'
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>
            <DeletePopUpModal func={deleteData} />
            <ChangesModal func={group_Update} />
            {/* <ChangesModal hasPermission={status ? permissionForEditGroup : permissionForAddGroup} func={group_Update} /> */}


        </>
    )
}

export default Group;