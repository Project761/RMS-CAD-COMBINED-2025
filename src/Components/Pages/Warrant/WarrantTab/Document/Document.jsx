import React, { useContext, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom'
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { IncDocumentListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import DocumentAddUp from './DocumentAddUp';

const Document = () => {

    const { get_Warrent_Count, localStoreArray, get_LocalStorage, } = useContext(AgencyContext)
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([])
    const [warrantDocumentID, setWarrantDocumentID] = useState('');
    const [status, setStatus] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(0)
    const [modal, setModal] = useState(false)
    const [documentdata, setDocumentdata] = useState();
    const [loder, setLoder] = useState(false);

    const [warrantID, setWarrantID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('')
    const [loginPinID, setLoginPinID] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray?.WarrantID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(parseInt(localStoreArray?.PINID));
                if (localStoreArray?.WarrantID) {
                    setWarrantID(parseInt(localStoreArray?.WarrantID));
                    get_Documentdata(localStoreArray?.WarrantID);
                } else {
                    setWarrantID('');
                }
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    const get_Documentdata = (warrantID) => {
        const val = {
            'WarrantID': warrantID,
        }
        fetchPostData('WarrantDocument/GetData_WarrantDocument', val).then((res) => {
            if (res) {
                setDocumentdata(res); setLoder(true)
            } else {
                setDocumentdata([]); setLoder(true)
            }
        })
    }

    const getScreenPermision = (loginAgencyID, loginPinID) => {
        ScreenPermision("I035", loginAgencyID, loginPinID).then(res => {
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
            name: <p className='text-end' style={{ position: 'absolute', top: 8, }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    <Link to={`#`} onClick={() => window.open(row?.FileAttachment)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" >
                        <i className="fa fa-eye"></i>
                    </Link>

                </div>

        },
        {
            name: 'Document Name',
            selector: (row) => row.DocFileName,
            sortable: true
        },
        {
            name: 'Notes',
            selector: (row) => row.DocumentNotes,
            sortable: true
        },
        {
            name: 'Document Type',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 0 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 7 }}>

                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?

                            <Link to={`#`} onClick={() => { setWarrantDocumentID(row.warrantDocumentID) }} className="btn btn-sm bg-green text-white px-1 py-0 m/-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>

                            : <></>
                            :

                            <Link to={`#`} onClick={() => { setWarrantDocumentID(row.warrantDocumentID); }} className="btn btn-sm bg-green text-white px-1 py-0 ml-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>

                    }
                </div>

        }
    ]

    const DeleteDocument = () => {
        const val = {
            'WarrantDocumentID': warrantDocumentID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('WarrantDocument/Delete_WarrantDocument', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Warrent_Count(warrantID);
                get_Documentdata(warrantID);
            } else console.log("Somthing Wrong");
        })
    }

    const setStatusFalse = (e, row) => {
        setStatus(false)
        setModal(true)
        setUpdateStatus(updateStatus + 1);
        setWarrantDocumentID(row.warrantDocumentID)
    }

    return (
        <>
            <div className="col-md-12 mt-2">
                <div className="row">
                    <div className="col-md-12">
                        <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0">Document Managemnt</p>
                            <div>
                                {
                                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                        <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            data-toggle="modal" data-target="#DocumentModal" onClick={setStatusFalse} style={{ marginTop: '-6px' }}>
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                        : <></>
                                        : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                                            data-toggle="modal" data-target="#DocumentModal" onClick={setStatusFalse} style={{ marginTop: '-6px' }}>
                                            <i className="fa fa-plus"></i>
                                        </Link>
                                }
                                <FindListDropDown
                                    array={IncDocumentListDropDownArray}
                                />
                            </div>
                        </div>
                        {
                            loder ?
                                <DataTable
                                    dense
                                    columns={columns}
                                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? documentdata : '' : documentdata}
                                    pagination
                                    highlightOnHover
                                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                />
                                :
                                <Loader />
                        }
                    </div>
                </div>
            </div>
            <DocumentAddUp {...{ loginPinID, warrantID, loginAgencyID, get_Documentdata, updateStatus, modal, setModal, status, setStatus, warrantDocumentID, setWarrantDocumentID, documentdata }} />
            <DeletePopUpModal func={DeleteDocument} />
        </>
    )
}
export default Document