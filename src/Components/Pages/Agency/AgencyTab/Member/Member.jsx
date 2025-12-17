
import React, { useState, useEffect, useContext } from 'react'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import Select from "react-select";
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../../Common/Utility';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useLocation } from 'react-router-dom';
import ChangesModal from '../../../../Common/ChangesModal';
import { Data } from '@react-google-maps/api';

const Member = ({ allowMultipleLogin }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [clickedRow, setClickedRow] = useState(null);

    // Hooks Initialization
    const [groupList, setGroupList] = useState([])
    const [groupMemberListData, setGroupMemberListData] = useState([])
    const [pinID, setPinID] = useState('');
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [permissionForAddMember, setPermissionForAddMember] = useState(false);
    const [permissionForEditMember, setPermissionForEditMember] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var aId = query?.get("Aid");
    var aIdSta = query?.get("ASta");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    const [value, setValue] = useState({
        'ApplicationId': '', 'GroupName': '', 'GroupID': '',
    })

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            get_EffectiveScreen_Permission(localStoreData?.AgencyID, localStoreData?.PINID);
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
                'ApplicationId': '', 'AgencyID': aId, 'ModifiedByUserFK': '', 'GroupName': '', 'GroupID': '',
                'CreatedByUserFK': pinID,
            });
        }
    }, [pinID]);

    // Get Effective Screeen Permission
    const get_EffectiveScreen_Permission = (aId, pinID) => {
        const val = { PINID: pinID, ApplicationID: '1', code: 'A003', AgencyID: aId }
        fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
            .then(res => {
                if (res) {
                    setEffectiveScreenPermission(res); setPermissionForAddMember(res?.[0]?.AddOK); setPermissionForEditMember(res?.[0]?.Changeok);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(res[0]?.Changeok != 1 ? true : false);

                }
                else {
                    setEffectiveScreenPermission(); setPermissionForAddMember(false); setPermissionForEditMember(false);
                    // for change tab when not having  add and update permission
                    setaddUpdatePermission(false)
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
                setPermissionForAddMember(false);
                setPermissionForEditMember(false);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(false)
            });
    }

    // Get Group list
    const get_Group_List = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(changeArrayFormat(res, 'group'))
                if (res[0]?.GroupID) {
                    setValue({ ...value, ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID) })
                }
            } else {
                setGroupList()
            }
        })
    }

    // onChange Hooks Function
    const groupChange = (e) => {
        if (e) {
            setValue({
                ...value,
                ['GroupID']: e.value
            })
            get_Group_Member_List(e.value)
        } else setGroupMemberListData()
    }

    // Group member List
    const get_Group_Member_List = (GroupID) => {
        const value = { GroupID: GroupID, AgencyID: aId }
        fetchPostData("SecurityGroupUserMembers/GetGroupMemberListData", value).then((data) => {
            if (data) setGroupMemberListData(data)
            else setGroupMemberListData()
        })
    }

    // Update Group Member
    const update_Group_Member_List = (e, id) => {
        e.preventDefault()
        const value = { "GroupID": id.GroupID, "PINID": id.PINID, "ModifiedByUserFK": pinID, }
        AddDeleteUpadate("SecurityGroupUserMembers/UpdateGroupMembers", value).then((data) => {
            if (data) {
                const parsedData = JSON.parse(data.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Group_Member_List(value.GroupID);
            }
        })
    }

    // Table Columns Array
    const columns = [
        {
            name: 'Group IN',
            selector: (row) => <input type="checkbox" checked={row.GroupIN} disabled={
                effectiveScreenPermission ?
                    effectiveScreenPermission[0]?.Changeok === 0 ? true
                        : false
                    : false
            }
                onClick={(e) => update_Group_Member_List(e, row)} />,
            sortable: true
        },
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName,
            sortable: true
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'Middle Name',
            selector: (row) => row.MiddleName,
            sortable: true
        },
        {
            name: 'User Name',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Agency Name',
            selector: (row) => row.Agency_Name,
            sortable: true
        }
    ]

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

    return (
        <div className="col-12">
            <div className="row mt-2">
                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                    <label htmlFor="" className='new-label text-nowrap'>Group Name</label>
                </div>
                <div className="col-10 col-md-10 col-lg-10 mt-1 ">
                    {
                        value?.GroupName ?
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                defaultValue={value?.GroupName}
                                options={groupList}
                                isClearable
                                onChange={groupChange}
                            /> : <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                options={groupList}
                                isClearable
                                onChange={groupChange} />
                    }
                </div>
            </div>
            <div className="col-12 mt-2">
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? groupMemberListData : '' : ''}
                    paginationRowsPerPageOptions={[10, 15]}
                    highlightOnHover
                    noContextMenu
                    pagination
                    showHeader={true}
                    persistTableHead={true}
                    conditionalRowStyles={conditionalRowStyles}
                    customStyles={tableCustomStyles}
                    fixedHeader
                    responsive
                    subHeaderAlign="right"
                    subHeaderWrap
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
            </div>
            {/* <ChangesModal hasPermission={IncSta === true || IncSta === "true" ? permissionForEdit : permissionForAdd} func={update_Group_Member_List} /> */}
        </div>

    )
}

export default Member;

export const changeArrayFormat = (data, type) => {
    if (type === 'group') {
        const result = data?.map((sponsor) =>
            ({ value: sponsor.GroupID, label: sponsor.GroupName, })
        )
        return result
    }
}

export const changeArrayFormat_WithFilter = (data, type, id) => {
    if (type === 'group') {
        const result = data?.filter(function (option) { return option.GroupID === id }).map((sponsor) =>
            ({ value: sponsor.GroupID, label: sponsor.GroupName })
        )
        return result[0]
    }
}
