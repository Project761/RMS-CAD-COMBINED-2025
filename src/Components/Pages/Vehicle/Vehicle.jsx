import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import Tab from '../../Utility/Tab/Tab';
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, } from '../../Common/Utility';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import DeletePopUpModal from '../../Common/DeleteModal';
import ThreeFilter from '../../Filter/ThreeFilter';

const Vehicle = () => {

    const { get_Incident_Count, get_Data_Vehicle, VehicleData, updateCount, setUpdateCount, setIncStatus, VehicleFilterData, setVehicleFilterData, setIncidentStatus, localStoreArray, get_LocalStorage, setVehicleStatus, deleteStoreData, storeData } = useContext(AgencyContext);
    const [vehicleId, setVehicleId] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');


    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage();
        }
    }, []);

    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginPinID(localStoreArray?.PINID);
                setMainIncidentID(localStoreArray?.IncidentID);
                if (localStoreArray.IncidentID) {
                    get_Incident_Count(localStoreArray?.IncidentID);
                    get_Data_Vehicle(localStoreArray?.IncidentID)
                }
            }
            setIncidentStatus(true);
        }
    }, [localStoreArray])

    const columns = [
        {
            width: '120px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 20 }}>
                    <Link to={'/Vehicle-Home'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </Link>

                </div>

        },
        {
            name: 'Vehicle Number',
            selector: (row) => row.VehicleNumber,
            sortable: true
        },
        {
            name: 'Model Description',
            selector: (row) => row.Model_Description,
            sortable: true
        },
        {
            name: 'Manufacture Year',
            selector: (row) => row.ManufactureYear,
            sortable: true
        },
        {
            name: 'Owner Description',
            selector: (row) => row.Owner_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 5 }}>
                    <Link to={`#`} onClick={(e) => { setVehicleId(row.VehicleID); setMasterPropertyID(row.MasterPropertyID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </Link>

                </div>

        }
    ]

    const setEditVal = (row) => {
        setVehicleId(row.VehicleID);
        setMasterPropertyID(row.MasterPropertyID);
        setUpdateCount(updateCount + 1)
        setIncStatus(true); setVehicleStatus(true);
        if (row.VehicleID || row.MasterPropertyID) {
            storeData({ 'VehicleID': row.VehicleID, 'MasterPropertyID': row.MasterPropertyID, 'VehicleStatus': true, 'VehicleNumber': row.VehicleNumber })
        }
    }

    const Delete_Vehicle = () => {
        const val = {
            'VehicleID': vehicleId,
            'MasterPropertyID': masterPropertyID,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('PropertyVehicle/Delete_PropertyVehicle', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Incident_Count(mainIncidentID);
                get_Data_Vehicle(mainIncidentID);
            } else {
                console.log("Something Wrong");
            }
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
                                        <div className="row" >
                                            <div className="col-12 pl-3  inc__tabs">
                                                <Tab />
                                            </div>
                                            <div className="col-12 col-md-12 pt-2 " >
                                                <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center ">
                                                    <p className="p-0 m-0">Vehicle</p>
                                                    <div style={{ marginLeft: 'auto' }}>
                                                        <Link to="/Vehicle-Home" onClick={() => {
                                                            setVehicleStatus(false); setIncStatus(false);
                                                        }} className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#">
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className=" col-12">
                                                    <DataTable
                                                        dense
                                                        columns={columns}
                                                        data={VehicleFilterData}
                                                        pagination
                                                        selectableRowsHighlight
                                                        highlightOnHover
                                                        noDataComponent={"There are no data to display"}
                                                        subHeader
                                                        responsive
                                                        showPaginationBottom={10}
                                                        subHeaderComponent={<ThreeFilter Data={VehicleData} setResult={setVehicleFilterData} Col1='VehicleNumber' Col2='Model_Description' Col3='ManufactureYear' searchName1='Vehicle Number' searchName2='Model Description' searchName3='Manufacture Year' />}
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
            </div>
            <DeletePopUpModal func={Delete_Vehicle} />
        </>
    )
}

export default Vehicle