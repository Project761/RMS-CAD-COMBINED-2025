
import React, { useState, useEffect, memo, useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import { AddDeleteUpadate, fieldPermision } from '../../../../hooks/Api'
import { Agency_Field_Permistion_Filter } from '../../../../Filter/AgencyFilter';

const GroupAddUp = (props) => {

    // Props value
    const { aId, pinID, groupEditData, status, get_Group_List, groupList, getAgency_List, setModal, modal, updateCount } = props
    const { get_CountList } = useContext(AgencyContext);
    // Hooks Initialization
    const [value, setValue] = useState({
        'GroupName': '', 'AgencyID': aId, 'ModifiedByUserFK': '', 'GroupID': '', 'IsAllowMultipleAgency': '',
        'CreatedByUserFK': pinID,
    })
    const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
        
        'GroupName': '', 'IsAdmin': '', 'IsAllowMultipleAgency': ''
    })

    const reset_value = () => {
        setValue({
            ...value, 'GroupName': "", 'GroupID': "", 'IsAllowMultipleAgency': "",
        });
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
                'CreatedByUserFK': '',
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

            });
        }
    }, [groupEditData, updateCount])

    // onChange Hooks Function
    const handlChange = (e) => {
        if (e.target.name === 'IsAllowMultipleAgency') {
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

                setFieldPermissionAgency(prevValues => {
                    return {
                        ...prevValues,
                        ['GroupName']: groupNameFilter || prevValues['GroupName'],
                        ['IsAdmin']: isAdminFilter || prevValues['IsAdmin'],
                        ['IsAllowMultipleAgency']: IsAllowMultipleAgencyFilter || prevValues['IsAllowMultipleAgency'],
                    }
                });
            }
        });
    }

    // Submit Group list
    const handleSubmit = (e) => {
        e.preventDefault()
        const result = groupList?.find(item => {
            if (item.GroupName === value.GroupName) {
                return item.GroupName === value.GroupName
            } else return item.GroupName === value.GroupName
        }
        );
        if (result) {
            toastifyError('Group Name Already Exists')
        } else if (value.GroupName.trim() !== '') {
            AddDeleteUpadate('Group/GroupInsert', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); get_Group_List(aId); get_CountList(aId); setModal(false); reset_value()
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
                if (item.GroupName === value.GroupName) {
                    return item.GroupName === value.GroupName
                } else return item.GroupName === value.GroupName
            }
        }
        );
        if (result) {
            toastifyError('Group Name Already Exists')
        } else if (value.GroupName.trim() !== '') {
            AddDeleteUpadate('Group/GroupUpdate', value)
                .then(res => {
                    if (res.success) {
                        toastifySuccess(res.Message); get_Group_List(aId); setModal(false); getAgency_List(); reset_value(); 
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

    return (
        <>
            {
                modal ?
                    <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="GroupModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className="m-1 mt-3">
                                        <fieldset style={{ border: '1px solid gray' }}>
                                            <legend style={{ fontWeight: 'bold' }}>Group</legend>
                                            <div className="row pt-2">
                                                <div className="col-12">
                                                    <div className="text-field">
                                                        <input type="text"
                                                            className={fieldPermissionAgency?.GroupName[0] ?
                                                                fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && groupEditData?.GroupName === '' && status ? 'requiredColor' : fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.GroupName[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : ''
                                                            }
                                                            onChange={fieldPermissionAgency?.GroupName[0] ?
                                                                fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.GroupName[0]?.Changeok === 0 && fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && groupEditData?.GroupName === '' && status ? handlChange : fieldPermissionAgency?.GroupName[0]?.AddOK === 1 && !status ? handlChange : fieldPermissionAgency?.GroupName[0]?.Changeok === 1 && status ? handlChange : '' : handlChange
                                                            }
                                                            value={value.GroupName}
                                                            name='GroupName' required />
                                                        <label>Group Name</label>
                                                    </div>
                                                </div>
                                                <div className="col-6 mt-2">
                                                    <input type="checkbox" name="IsAllowMultipleAgency" checked={value.IsAllowMultipleAgency} value={value.IsAllowMultipleAgency}
                                                        onChange={fieldPermissionAgency?.IsAllowMultipleAgency[0] ?
                                                            fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && groupEditData?.IsAllowMultipleAgency === '' && status ? handlChange : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && !status ? handlChange : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 1 && status ? handlChange : ''
                                                            : handlChange
                                                        }
                                                        disabled={fieldPermissionAgency?.IsAllowMultipleAgency[0] ?
                                                            fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 0 && fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && groupEditData?.IsAllowMultipleAgency === '' && status ? false : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.IsAllowMultipleAgency[0]?.Changeok === 1 && status ? false : true : false
                                                        }
                                                        id="IsAllowMultipleAgency" />
                                                    <label className='ml-2' htmlFor="IsAllowMultipleAgency">Is Allow Multiple Agency</label>
                                                </div>
                                                <div className="col-6 mt-2">
                                                    <input type="checkbox" name="IsAllowListTableEdit" checked={value.IsAllowListTableEdit} value={value.IsAllowListTableEdit}

                                                        id="IsAllowListTableEdit" disabled />
                                                    <label className='ml-2' htmlFor="IsAllowMultipleAgency">Is Allow List Table Edit</label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="btn-box text-right mt-3 mr-1">
                                        {status ?
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={group_Update}>Update</button>
                                            :
                                            <button type="button" className="btn btn-sm btn-success mr-1" onClick={handleSubmit}>Save</button>

                                        }
                                        <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() => reset_value()}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                    :
                    <> </>
            }
        </>
    )
}

export default memo(GroupAddUp)