import React, { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Tab from '../../Utility/Tab/Tab';
import { AgencyContext } from '../../../Context/Agency/Index';
import { AddDeleteUpadate, ScreenPermision } from '../../hooks/Api';
import { Decrypt_Id_Name, getShowingWithOutTime } from '../../Common/Utility';
import { toastifySuccess } from '../../Common/AlertMsg';
import DeletePopUpModal from '../../Common/DeleteModal';
import ThreeFilter from '../../Filter/ThreeFilter';

const Warrant = () => {

    const { get_Incident_Count, get_Warrent_Count, updateCount, setUpdateCount, setIncStatus, warentData, get_Warent_Data, warentFilterData, setIncidentStatus, setwarentFilterData, localStoreArray, get_LocalStorage, setWarentStatus, deleteStoreData, storeData } = useContext(AgencyContext);

    const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()
    const [warentID, setWarentID] = useState('');

    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', IncidentStatus: '', IncidentNumber: '', }),
    }

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.PINID) {
                setLoginPinID(localStoreArray?.PINID);
                getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
                if (localStoreArray?.IncidentID) {
                    setMainIncidentID(localStoreArray?.IncidentID);
                    get_Warent_Data(localStoreArray?.IncidentID)
                    get_Incident_Count(localStoreArray?.IncidentID);
                }
            }
            setIncidentStatus(true);
        }
    }, [localStoreArray])

    const getScreenPermision = (loginAgencyID, PinID) => {
        ScreenPermision("O036", loginAgencyID, PinID).then(res => {
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
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, left: 20 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
                            <Link to={'/warrant-tab'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                            : <></>
                            : <Link to={'/warrant-tab'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                                <i className="fa fa-edit"></i>
                            </Link>
                    }
                </div>

        },
        {
            width: '160px',
            name: 'Warrant Number',
            selector: (row) => row.WarrantNumber,
            sortable: true
        },
        {
            name: 'Warrant Holder',
            selector: (row) => row.WarrantHolder,
            sortable: true
        },
        {
            name: 'Location',
            selector: (row) => row.Location,
            sortable: true
        },
        {
            width: '160px',
            name: 'Date Of Complain',
            selector: (row) => row.DateOfComplain ? getShowingWithOutTime(row.DateOfComplain) : '',
            sortable: true
        },
        {
            name: 'NoticeDate',
            selector: (row) => row.NoticeDate ? getShowingWithOutTime(row.NoticeDate) : '',
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 5 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
                            <Link to={`#`} onClick={(e) => setWarentID(row.WarrantID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                            : <></>
                            : <Link to={`#`} onClick={(e) => setWarentID(row.WarrantID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </Link>
                    }
                </div>

        }
    ]

    const setEditVal = (row) => {
        if (row.WarrantID) {
            get_Warrent_Count(row.WarrantID)
            setWarentID(row.WarrantID)
            storeData({ 'WarrantID': row.WarrantID, 'WarrantStatus': true })
            setWarentStatus(true);
        }
        setUpdateCount(updateCount + 1)
        setIncStatus(true);
    }

    const Delete_Warrant = () => {
        const val = {
            'WarrantID': warentID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('Warrant/Delete_Warrant', val).then((res) => {
            toastifySuccess(res.Message);
            get_Incident_Count(mainIncidentID);
            get_Warent_Data(mainIncidentID);
        })
    }

    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row  ">
                                    <div className={`col-12 col-md-12`}>
                                        <div className="row">
                                            <div className="col-12 pl-3  inc__tabs">
                                                <Tab />
                                            </div>
                                            <div className="col-12  mt-2">
                                                <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
                                                    <p className="p-0 m-0">Warrant</p>
                                                    <p className="p-0 m-0">
                                                        <Link to={'/warrant-tab'} className="btn btn-sm bg-green text-white px-2 py-0" onClick={() => {
                                                            setWarentStatus(false);
                                                            setIncStatus(false);
                                                            // deleteStoreData({ 'WarrantID': '', 'WarrantStatus': '', });
                                                            get_Warrent_Count('')
                                                        }}>
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                                <DataTable
                                                    dense
                                                    columns={columns}
                                                    data={warentFilterData}
                                                    pagination
                                                    selectableRowsHighlight
                                                    highlightOnHover
                                                    subHeader
                                                    responsive
                                                    showPaginationBottom={10}
                                                    subHeaderComponent={<ThreeFilter Data={warentData} setResult={setwarentFilterData} Col1='WarrantNumber' Col2='WarrantHolder' Col3='Location' searchName1='Warrant Number' searchName2='Warrant Holder' searchName3='Location' />}
                                                    subHeaderAlign='left'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={Delete_Warrant} />
        </>
    )
}

export default Warrant