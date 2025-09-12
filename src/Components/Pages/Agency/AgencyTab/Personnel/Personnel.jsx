
import React, { useState, useEffect, useContext } from 'react'
import DataTable from 'react-data-table-component';
import { Link, useLocation } from "react-router-dom";
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name } from '../../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';

const Personnel = ({ aId }) => {

    const { get_CountList, get_Personnel_Lists, personnelList, setPersonnelStatus, setPersonnelEffectiveScreenPermission, localStoreArray, get_LocalStorage, } = useContext(AgencyContext);

    // Hooks Initialization
    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
    const [PinId, setPinId] = useState();
    const [loginPinID, setLoginPinID] = useState('');

   

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var agencyID = query?.get('id')
    if (!agencyID) agencyID = 0;
    else agencyID = agencyID?.split(" ", 3)[0]?.split("/", 1)[0]?.substring(10,);

    useEffect(() => {
        if (aId) {
            get_Personnel_Lists(aId);
            get_CountList(aId);
        }
    }, [aId]);

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginPinID(localStoreArray?.PINID);
              
                get_EffectiveScreen_Permission(localStoreArray?.AgencyID, localStoreArray?.PINID);
            }
        }
    }, [localStoreArray])

    // Get Effective Screeen Permission
    const get_EffectiveScreen_Permission = (aId, pinId) => {
        const val = {
            AgencyID: aId,
            PINID: pinId,
            ApplicationID: '1',
            code: 'A006',
        }
        fetchPostData("EffectivePermission/GetData_EffectiveScreenPermission", val)
            .then(res => {
                if (res) { setEffectiveScreenPermission(res); setPersonnelEffectiveScreenPermission(res) }
                else { setEffectiveScreenPermission(); setPersonnelEffectiveScreenPermission() }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    // Delete Peronnel Fuction
    const delete_Personnel = (e, id) => {
        e.preventDefault()
        const val = {
            PINID: PinId,
            DeletedByUserFK: loginPinID,
        }
        AddDeleteUpadate('Personnel/DeletePersonnel', val)
            .then((res) => {
                if (res) {
                    toastifySuccess(res.Message);
                    get_CountList(aId);
                };
                get_Personnel_Lists(aId);
            })
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 7, }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <Link to={`/personnelTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG${row.PINID}/2Wga0gJLXEgctxh79FeM/G`}
                                onClick={(e) => { setPersonnelStatus(true); get_Personnel_Lists(aId) }}
                                className="btn btn-sm bg-green text-white px-1 py-0 mr-1"><i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <></>
                    }

                </div>

        },
        {
            name: 'PIN',
            selector: (row) => row.PIN,
            sortable: true
        },
        {
            name: 'Last Name',
            selector: (row) => row.LastName
        },
        {
            name: 'First Name',
            selector: (row) => row.FirstName,
            sortable: true
        },
        {
            name: 'User Name',
            selector: (row) => row.UserName,
            sortable: true
        },
        {
            name: 'Division Name',
            selector: (row) => row.Division_Name,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 7, right: 42 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 50 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`/agencyTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=`}
                                onClick={(e) => setPinId(row.PINID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <></>
                    }

                </div>

        }
    ]

    return (
        <>
            <div className="row px-3">
                <div className="col-12 pt-2 p-0">
                    <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0 d-flex align-items-center">
                            Personnel
                        </p>
                        {
                            effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                                <Link to={`/personnelTab?id=U2FsdGVkX1${aId}/rbn7XDh9W4GiUkZ4MTV1Vx8pMNVkdjyw=&pd=89zw03LXTG0000/2Wga0gJLXEgctxh79FeM/G`} className="btn btn-sm bg-green text-white px-2 py-0"
                                    data-toggle="modal" data-target="#PersonnelModal" onClick={(e) => { setPinId(); setPersonnelStatus(false) }} >
                                    <i className="fa fa-plus"></i>
                                </Link>
                                : <></>
                                : <></>
                        }
                    </div>
                    <DataTable
                        dense
                        columns={columns}
                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? personnelList : '' : ''}
                        paginationPerPage={'10'}
                        paginationRowsPerPageOptions={[10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        subHeaderAlign="right"
                        subHeaderWrap
                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}

                    />
                </div>
            </div>

            <DeletePopUpModal func={delete_Personnel} />
        </>
    )
}

export default Personnel