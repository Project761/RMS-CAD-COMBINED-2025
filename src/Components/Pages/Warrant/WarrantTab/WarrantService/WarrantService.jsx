import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import WarrantServiceAddUp from './WarrantServiceAddUp';

const WarrantService = () => {

    const { get_Warrent_Count, localStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [warrantServiceID, setWarrantServiceID] = useState('')
    const [upDateCount, setUpDateCount] = useState(0)
    const [status, setStatus] = useState(false)
    const [modal, setModal] = useState(false);
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [dispositionData, setDispositionData] = useState([])
    const [warrantID, setWarrantID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', UserName: '' }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray?.WarrantID) {
                    setWarrantID(localStoreArray?.WarrantID); get_WarrantService(localStoreArray?.WarrantID)
                } else {
                    setWarrantID('');
                }
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])


    const get_WarrantService = (warrantID) => {
        const val = {
            'WarrantID': warrantID,
        }
        fetchPostData('WarrantService/GetData_WarrantService', val)
            .then(res => {
                if (res) {

                    setDispositionData(res);
                } else {
                    setDispositionData([]);
                }
            })
    }


    const getScreenPermision = (loginAgencyID, loginPinID) => {
        ScreenPermision("I033", loginAgencyID, loginPinID).then(res => {
            if (res) {
                setEffectiveScreenPermission(res)
            } else {
                setEffectiveScreenPermission([])
            }
        });
    }

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <Link to={''} onClick={(e) => editWarrantService(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#WarrantServiceModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={(e) => editWarrantService(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#WarrantServiceModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>

        },

        {
            name: 'Service Attempt Date',
            selector: (row) => getShowingDateText(row.ServiceAttemptDtTm),
            sortable: true
        },
        {
            name: 'Attempted By',
            selector: (row) => row.OfficerName,
            sortable: true
        },

        {
            name: 'Remarks',
            selector: (row) => row.Remarks,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 5 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setWarrantServiceID(row.WarrantServiceID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={(e) => setWarrantServiceID(row.WarrantServiceID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>

        }
    ]

    const editWarrantService = (e, val) => {
        get_Warrent_Count(val.WarrantID)
        e.preventDefault();
        setWarrantServiceID(val.WarrantServiceID);
        setUpDateCount(upDateCount + 1);
        setStatus(true)
        setModal(true);
    }

    const DeleteWarrantService = () => {
        const val = {
            'WarrantServiceID': warrantServiceID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('WarrantService/Delete_WarrantService', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                get_WarrantService(warrantID)
                get_Warrent_Count(warrantID)
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Clearance</p>
                            <p className="p-0 m-0">
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                                            data-toggle="modal" data-target="#WarrantServiceModal">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        : <></>
                                        : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                                            data-toggle="modal" data-target="#WarrantServiceModal">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                }
                            </p>
                        </div>
                        <div className="col-12 ">
                            {
                                <DataTable
                                    dense
                                    columns={columns}
                                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? dispositionData : '' : dispositionData}
                                    pagination
                                    selectableRowsHighlight
                                    highlightOnHover
                                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteWarrantService} />
            <WarrantServiceAddUp {...{ upDateCount, warrantServiceID, get_WarrantService, status, dispositionData, modal, setModal, loginPinID, loginAgencyID, warrantID, }} />
        </>
    )
}
export default WarrantService;