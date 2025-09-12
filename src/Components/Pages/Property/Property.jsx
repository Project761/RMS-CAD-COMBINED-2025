import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tab from '../../Utility/Tab/Tab';
import { AgencyContext } from '../../../Context/Agency/Index';
import DataTable from 'react-data-table-component';
import { Decrypt_Id_Name } from '../../Common/Utility';
import { AddDeleteUpadate } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import DeletePopUpModal from '../../Common/DeleteModal';
import Loader from '../../Common/Loader';
import ThreeFilter from '../../Filter/ThreeFilter';

const Property = () => {

    const { propertyData, get_Data_Property, updateCount, setUpdateCount, setIncStatus, loder, propertyFilterData, setPropertyFilterData, get_Property_Count, setIncidentStatus, get_Incident_Count, localStoreArray, get_LocalStorage, setPropertyStatus, deleteStoreData, storeData } = useContext(AgencyContext);

    //screen permission 
    const [propertyID, setPropertyID] = useState();
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID || !localStoreArray.IncidentID || !localStoreArray.IncidentStatus) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginPinID(localStoreArray?.PINID);
                if (localStoreArray.IncidentID) {
                    get_Incident_Count(localStoreArray?.IncidentID);
                    setMainIncidentID(localStoreArray?.IncidentID);
                    get_Data_Property(localStoreArray?.IncidentID);
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
                    <Link to={'/propertytab'} onClick={(e) => setEditVal(row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </Link>

                </div>

        },
        {
            width: '250px',
            name: 'Property Number',
            selector: (row) => row.PropertyNumber,
            sortable: true
        },
        {
            width: '300px',
            name: 'Officer Name',
            selector: (row) => row.Officer_Name,
            sortable: true
        },
        {
            name: 'Property Type',
            selector: (row) => row.PropertyType_Description,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 5 }}>
                    <Link to={`#`} onClick={(e) => setPropertyID(row.PropertyID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </Link>
                </div>
        }
    ]

    const setEditVal = (row) => {
        setUpdateCount(updateCount + 1)
        setIncStatus(true)
        if (row.PropertyID || row.MasterPropertyID) {
            storeData({ 'PropertyID': row?.PropertyID, 'MasterPropertyID': row?.MasterPropertyID, 'propertyStatus': true })
            setPropertyStatus(true);
            get_Property_Count(row?.PropertyID)
            setPropertyID(row?.PropertyID)
        }
    }

    const Delete_Property = () => {
        const val = { 'PropertyID': propertyID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('Property/Delete_Property', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                get_Incident_Count(mainIncidentID);
                get_Data_Property(mainIncidentID);
            } else { console.log("Somthing Wrong"); }
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
                                                    <p className="p-0 m-0">Property</p>
                                                    <p className="p-0 m-0">
                                                        <Link to={'/propertytab'} onClick={() => {
                                                            setPropertyStatus(false);
                                                          
                                                            setIncStatus(false);
                                                        }} className="btn btn-sm bg-green text-white px-2 py-0" >
                                                            <i className="fa fa-plus"></i>
                                                        </Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 ">
                                    {
                                        loder ?
                                            <DataTable
                                                dense
                                                columns={columns}
                                                data={propertyFilterData}
                                                pagination
                                                selectableRowsHighlight
                                                highlightOnHover
                                                noDataComponent={"There are no data to display"}
                                                subHeader
                                                responsive
                                                showPaginationBottom={10}
                                                subHeaderComponent={<ThreeFilter Data={propertyData} setResult={setPropertyFilterData} Col1='PropertyNumber' Col2='Officer_Name' Col3='PropertyType_Description' searchName1='PropertyNumber' searchName2='Officer_Name' searchName3='PropertyType_Description' />}
                                                subHeaderAlign='left'
                                            />
                                            :
                                            <Loader />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={Delete_Property} />
        </>
    )
}

export default Property