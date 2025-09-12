import React, { useContext, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from "react-select";
import { Decrypt_Id_Name, colourStyles, getShowingMonthDateYear, stringToBase64 } from '../../Common/Utility';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { threeColArray } from '../../Common/ChangeArrayFormat';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { AgencyContext } from '../../../Context/Agency/Index';
import DeletePopUpModal from '../../Common/DeleteModal';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';

const VehicleSearch = () => {

    const navigate = useNavigate();

    const { vehicleSearchData, setVehicleSearchData } = useContext(AgencyContext)
    const [loginPinID, setLoginPinID,] = useState('');
    const [masterVehicleId, setMasterVehicleId] = useState('');

    const columns = [
        {
            width: '150px',
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row =>
                <span onClick={(e) => set_Edit_Value(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-edit"></i>
                </span>
        },
        {
            name: 'IncidentNumber',
            selector: (row) => row.IncidentNumber,
            sortable: true
        },
        {
            name: 'VehicleNumber',
            selector: (row) => row.VehicleNumber,
            sortable: true
        },
        {
            name: 'VIN',
            selector: (row) => row.VIN,
            sortable: true
        },
        {
            name: 'PlateType',
            selector: (row) => row.PlateType_Description,
            sortable: true
        },
        {
            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        // {
        //     name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 5 }}>Delete</p>,
        //     cell: row =>
        //         <div className="div" style={{ position: 'absolute', right: 5 }}>
        //             {
        //                 <span onClick={(e) => { setMasterVehicleId(row.MasterPropertyID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
        //                     <i className="fa fa-trash"></i>
        //                 </span>
        //             }
        //         </div>

        // },
    ]

    const set_Edit_Value = (e, row) => {
        if (row.MasterPropertyID) {
            navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&VehId=${stringToBase64(row?.VehicleID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&ModNo=${row?.VehicleNumber}&VehSta=${true}`)
        }
    }

    const Delete_Vehicle = () => {
        const val = { 'MasterPropertyID': masterVehicleId, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('MainMasterVehicle/Delete_MainMasterVehicle', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
            } else {
                console.log("Something Wrong")
            }
        })
    }


    return (
        <>
            <div className="section-body view_page_design pt-3">
                <div className="row clearfix">
                    <div className="col-12 col-sm-12">
                        <div className="card Agency">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12 ">
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={vehicleSearchData}
                                            pagination
                                            selectableRowsHighlight
                                            highlightOnHover
                                        />
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

export default VehicleSearch