import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import ClearanceAddUp from './ClearanceAddUp';

const Clearance = () => {

    const { get_Warrent_Count, localStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [warrantClearanceID, setWarrantClearanceID] = useState('')
    const [upDateCount, setUpDateCount] = useState(0)
    const [status, setStatus] = useState(false)
    const [modal, setModal] = useState(false);
    //screen permission 
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [dispositionData, setDispositionData] = useState([])
    const [warrantID, setWarrantID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', }),
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
                    setWarrantID(localStoreArray?.WarrantID); get_DispositionData(localStoreArray?.WarrantID)
                } else {
                    setWarrantID('');
                }
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    const get_DispositionData = (warrantID) => {
        const val = {
            'WarrantID': warrantID,
        }
        fetchPostData('WarrantClearance/GetData_WarrantClearance', val)
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
                            <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#ClearanceModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#ClearanceModal" >
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>

        },

        {
            name: 'Date',
            selector: (row) => getShowingDateText(row.ClearanceDateTime),
            sortable: true
        },
        {
            name: 'By Pin',
            selector: (row) => row.OfficerName,
            sortable: true
        },
        {
            name: 'Dispositions',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: 'Comment',
            selector: (row) => row.Remarks,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 5 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setWarrantClearanceID(row.WarrantClearanceID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={(e) => setWarrantClearanceID(row.WarrantClearanceID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>

        }
    ]

    const editComments = (e, val) => {
        get_Warrent_Count(val.WarrantID)
        e.preventDefault();
        setWarrantClearanceID(val.WarrantClearanceID);
        setUpDateCount(upDateCount + 1);
        setStatus(true)
        setModal(true);
    }

    const DeleteClearance = () => {
        const val = {
            'WarrantClearanceID': warrantClearanceID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('WarrantClearance/Delete_WarrantClearance', val).then((res) => {
            if (res.success) {
                toastifySuccess(res.Message);
                get_DispositionData(warrantID)
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
                                            data-toggle="modal" data-target="#ClearanceModal">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        : <></>
                                        : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                                            data-toggle="modal" data-target="#ClearanceModal">
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                }
                            </p>
                        </div>
                        <div className="col-12 ">
                            {
                                // loder ?

                                <DataTable
                                    dense
                                    columns={columns}
                                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? dispositionData : '' : dispositionData}
                                    pagination
                                    selectableRowsHighlight
                                    highlightOnHover
                                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                                // :
                                // <Loader />
                            }
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={DeleteClearance} />
            <ClearanceAddUp {...{ upDateCount, warrantClearanceID, get_DispositionData, status, dispositionData, modal, setModal,loginPinID, loginAgencyID, warrantID, }} />
        </>
    )
}
export default Clearance;