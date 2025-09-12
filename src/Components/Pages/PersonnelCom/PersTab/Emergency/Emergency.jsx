import React, { useState, useEffect, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { Link, useLocation, } from 'react-router-dom'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api'
import EmergencyAddUp from './EmergencyAddUp'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { base64ToString, Decrypt_Id_Name } from '../../../../Common/Utility'
import { get_LocalStoreData } from '../../../../../redux/api'

const Emergency = ({ setaddUpdatePermission }) => {

    const { get_CountList } = useContext(AgencyContext);
    const [emergencyContact, setEmergencyContact] = useState([]);
    const [emergencyEditValue, setEmergencyEditValue] = useState([]);
    const [status, setStatus] = useState(false);
    const [modal, setModal] = useState(false);
    const [updCount, setUpdCount] = useState(0);
    const [emergencyId, setEmergencyId] = useState('');
    const [pinId, setPinID] = useState('');
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
    // permissions
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);


    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

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
            // get_Group_Personnel(Aid);
            getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (Aid && perId) get_CountList(Aid, perId);
    }, [Aid, perId])

    useEffect(() => {
        if (perId) {
            get_EmergencyContact(perId);
        }
    }, [perId])

    // useEffect(() => {
    //     get_EmergencyContact(pId);
    //     get_CountList(aId, pId);
    // }, [aId])

    // Get Screeen Permission
    const getScreenPermision = (agencyId, pinId) => {
        ScreenPermision("P014", agencyId, pinId).then(res => {
            if (res) {
                // console.log("🚀 ~ ScreenPermision ~ res:", res);
                setEffectiveScreenPermission(res);
                setPermissionForAdd(res[0]?.AddOK);
                setPermissionForEdit(res[0]?.ChangeOK);
                // for change tab when not having  add and update permission
                setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);
            } else {
                setEffectiveScreenPermission([])
                setPermissionForAdd(false);
                setPermissionForEdit(false);
                setaddUpdatePermission(false);
            }
        });
    }

    const get_EmergencyContact = (perId) => {
        const val = { PINID: perId }
        fetchPostData("EmergencyContact/GetData_EmergencyContact", val).then(res => {
            if (res) {
                get_CountList(Aid, perId)
                setEmergencyContact(res)
            } else {
                setEmergencyContact([])
            }
        }).catch(error => {
            console.error('There was an error!', error);
        });
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 6, }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <button onClick={(e) => set_Edit_Value(e, row)} data-toggle="modal" data-target="#EmergencyModal" className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </button>
                            : <></>
                            : <></>}
                </div>
        },
        {
            name: 'Contact Name',
            selector: (row) => row.ContactName
        },
        {
            name: 'Phone',
            selector: (row) => row.Phone_No,
            sortable: true
        },
        {
            name: 'Fax',
            selector: (row) => row.Fax_No,
            sortable: true
        },
        {
            name: 'Email',
            selector: (row) => row.Email,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row) => row.Address,
            sortable: true
        },
        // {
        //     name: 'Notes',
        //     selector: (row) => row.Notes,
        //     sortable: true
        // },
        {
            name: 'Notes',
            selector: (row) => (
                <span title={row?.Notes}>
                    {row?.Notes ? row?.Notes.substring(0, 20) : ''}
                    {row?.Notes?.length > 20 ? '...' : ''}
                </span>
            ),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 6, right: 50 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 0, right: 40 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <button onClick={(e) => setEmergencyId(row.EmergencyID)} data-toggle="modal" data-target="#DeleteModal" className="btn btn-sm bg-green text-white px-1 py-0">
                                <i className="fa fa-trash"></i>
                            </button>
                            : <></>
                            : <></>
                    }
                </div>
        }
    ]

    const set_Edit_Value = (e, row) => {
        e.preventDefault()
        setStatus(true); setEmergencyEditValue(row); setModal(true); setUpdCount(updCount + 1)
    }

    const set_Status = (e) => {
        e.preventDefault()
        setStatus(false); setEmergencyEditValue([]); setModal(true)
    }

    const delete_EmergencyContact = (e) => {
        e.preventDefault();
        const val = { 'DeletedByUserFK': pinId, 'EmergencyID': emergencyId }
        AddDeleteUpadate('EmergencyContact/DeleteEmergencyContact', val)
            .then((res) => {
                if (res.success === true) {
                    toastifySuccess(res.Message)
                    get_CountList(Aid, perId)
                    get_EmergencyContact(perId)
                }
            })
    }

    return (
        <>
            <div className="row px-3">
                <div className="col-12  ">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Emergency Contact
                        </p>
                        {
                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                <button className="btn btn-sm bg-green text-white px-2 py-0" onClick={set_Status} data-toggle="modal" data-target="#EmergencyModal" >
                                    <i className="fa fa-plus"></i>
                                </button>
                                : <></>
                                : <></>
                        }
                    </div>
                    <DataTable
                        columns={columns}
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? emergencyContact : '' : ''}
                        dense
                        paginationPerPage={'5'}
                        paginationRowsPerPageOptions={[5, 10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        subHeaderAlign="right"
                        fixedHeader
                        fixedHeaderScrollHeight="195px"
                        subHeaderWrap
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    />
                </div>
            </div>
            <EmergencyAddUp {...{ perId, Aid, pinId, emergencyEditValue, status, get_EmergencyContact, modal, setModal, updCount, permissionForAdd, permissionForEdit }} />
            <DeletePopUpModal func={delete_EmergencyContact} />
        </>
    )
}

export default Emergency