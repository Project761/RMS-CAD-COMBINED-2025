import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name, Encrypted_Id_Name, base64ToString, getShowingDateText, getShowingWithOutTime, stringToBase64 } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Vehicle_Search_Data } from '../../../redux/actionTypes';
import { fetchPostData } from '../../hooks/Api';
import { toastifyError } from '../../Common/AlertMsg';
import { useLocation, useNavigate } from 'react-router-dom';

const PropertySearchTab = (props) => {

    const { GetSingleData, searchModalState, setSearchModalState, mainIncidentID, value, setValue, loginPinID, loginAgencyID, MstVehicle, setPropertOther, setEditval, setChangesStatus, setStatesChangeStatus, isCad = false, get_Vehicle_MultiImage = () => { } } = props
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const vehicleSearchData = useSelector((state) => state.Vehicle.vehicleSearchData);


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let DecVehId = 0, DecMVehId = 0
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var VehId = query?.get("VehId");
    var MVehId = query?.get('MVehId');
    var ModNo = query?.get('ModNo');

    var VehSta = query?.get('VehSta');

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));
    if (!VehId) VehId = 0;
    else DecVehId = parseInt(base64ToString(VehId));
    if (!MVehId) VehId = 0;
    else DecMVehId = parseInt(base64ToString(MVehId));

    const VehicleCol = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 7, right: 30 }}>Action</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 30 }}>
                    {
                        <span onClick={() => { setEdit(row); console.log(row) }} style={{ cursor: 'pointer' }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </span>
                    }
                </div>
        },
        {
            width: '150px',
            name: 'Vehicle Number',
            selector: (row) => row.VehicleNumber,
            sortable: true
        },
        // {
        //     width: '150px',

        //     name: 'Incident Number',
        //     selector: (row) => row.IncidentNumber,
        //     sortable: true
        // },
        {
            width: '150px',

            name: 'Category',
            selector: (row) => row.Category_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Classification',
            selector: (row) => row.Classification_Description,
            sortable: true
        },
        {
            width: '150px',
            name: 'Loss Code',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Reported Date',
            selector: (row) => row.ReportedDtTm ? getShowingWithOutTime(row.ReportedDtTm) : " ",
            sortable: true
        },
        {
            width: '150px',

            name: 'Value',
            selector: (row) => row.Value,
            sortable: true
        },
        {
            width: '150px',

            name: 'Owner Name',
            selector: (row) => row.OwnerName,
            sortable: true
        },
        {
            width: '150px',

            name: 'Misc Description',
            selector: (row) => row.Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Plate Number',
            selector: (row) => row.PlateNumber,
            sortable: true
        },
        {
            width: '150px',

            name: 'VIN',
            selector: (row) => row.VIN,
            sortable: true
        },
        {
            width: '150px',

            name: 'Plate Type',
            selector: (row) => row.PlateType_Description,
            sortable: true
        },
        {
            width: '150px',

            name: 'Manufacture Year',
            selector: (row) => row.ManufactureYear,
            sortable: true
        },


        {
            width: '150px',
            name: 'Model',
            selector: (row) => row.Model,
            sortable: true
        },
        {
            width: '150px',
            name: 'Style',
            selector: (row) => row.Style,
            sortable: true
        },


        // {
        //     name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: '5' }}>Action</p>,
        //     cell: row => <>
        //         {
        //             <span onClick={() => { setEdit(row); console.log(row) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
        //                 <i className="fa fa-edit"></i>
        //             </span>
        //         }
        //     </>
        // }
    ]

    const setEdit = (row) => {
        fetchPostData("PropertyVehicle/GetData_PropertyVehicleExist", {
            "MasterPropertyID": row.MasterPropertyID,
            "IncidentID": mainIncidentID ? mainIncidentID : '',
        }).then((data) => {
            if (data) {
                if (data[0]?.Total === 0) {
                    if (MstVehicle === "MST-Vehicle-Dash") {
                        if (isCad) {
                            navigate(`/cad/dashboard-page?page=MST-Vehicle-Dash&?IncId=${stringToBase64(IncID)}&ModNo=${row?.VehicleNumber?.trim()}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}`)
                        } else {
                            navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&?IncId=${stringToBase64(IncID)}&ModNo=${row?.VehicleNumber?.trim()}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}`)
                        }
                    }
                    // navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&?IncId=${stringToBase64(IncID)}&ModNo=${row?.VehicleNumber?.trim()}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}`)
                    GetSingle_Data(row.MasterPropertyID);
                    get_Vehicle_MultiImage(row?.PropertyID, row.MasterPropertyID, true);
                    setSearchModalState(false);

                    setChangesStatus(false); setStatesChangeStatus(false)
                } else {
                    toastifyError('Vehicle Already Exists'); setSearchModalState(true);

                    setChangesStatus(false); setStatesChangeStatus(false)
                }
            }
        })
    }

    const GetSingle_Data = (masterPropertyId) => {
        const val = { 'MasterPropertyID': masterPropertyId, 'VehicleID': 0, 'PINID': loginPinID, 'IncidentID': 0, 'IsMaster': true }
        fetchPostData('PropertyVehicle/GetSingleData_PropertyVehicle', val).then((res) => {
            if (res) {
                setEditval(res);
            } else {
                setEditval([]);
            }
        })
    }

    const onCloseModel = () => {
        dispatch({ type: Vehicle_Search_Data, payload: [] });
        setSearchModalState(false)
    }

    return (
        searchModalState && (
            <>
                <div className="custom-modal" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1050
                }}>
                    <div className="modal-dialog modal-xl" style={{ maxWidth: '95%' }}>
                        <div className="modal-content">
                            <div className="modal-header px-3 p-2">
                                <h5 className="modal-title">Vehicle Search List</h5>
                                <button type="button" onClick={onCloseModel} className="close text-red border-0">X</button>
                            </div>
                            <div className="box text-center px-2">
                                <div className="col-12">
                                    <DataTable
                                        dense
                                        columns={VehicleCol}
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
            </>
        )
    );
};
export default memo(PropertySearchTab)

const Get_Property_Code = (data, dropDownData) => {
    const result = data?.map((sponsor) =>
        (sponsor.PropertyTypeID)
    )
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    }
    )
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}

const Get_LossCode = (data, dropDownData) => {
    const result = data?.map((sponsor) => (sponsor.LossCodeID))
    const result2 = dropDownData?.map((sponsor) => {
        if (sponsor.value === result[0]) {
            return { value: result[0], label: sponsor.label, id: sponsor.id }
        }
    })
    const val = result2.filter(function (element) {
        return element !== undefined;
    });
    return val[0]?.id
}