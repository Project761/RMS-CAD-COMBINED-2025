import React, { useContext, useEffect, useRef, useState } from 'react'
import SubTab from '../../Utility/Tab/SubTab'
import { VehicleTabs } from '../../Utility/Tab/TabsArray'
import Home from './VehicleTab/Home/Home';
import VehicleNotes from './VehicleTab/VehicleNotes/VehicleNotes';
import Document from './VehicleTab/Document/Document';
import VehicleTransactionLog from './VehicleTab/VehicleTransactionLog/VehicleTransactionLog';
import { AgencyContext } from '../../../Context/Agency/Index';
import VehiclePawnProperty from './VehicleTab/VehiclePawnProperty/VehiclePawnProperty';
import TowingVehicle from './VehicleTab/TowingVehicle/TowingVehicle';
import Tab from '../../Utility/Tab/Tab';
import { Link, useLocation } from 'react-router-dom';
import Log from '../Log/Log';
import RecoveredVehicle from './VehicleTab/RecoveredVehicle/RecoveredVehicle';
import AddInformation from './VehicleTab/AddInformation/AddInformation';
import { useDispatch, useSelector } from 'react-redux';
import { base64ToString, getShowingWithOutTime, stringToBase64, tableCustomStyle } from '../../Common/Utility';
import DocumentModal from '../../Common/DocumentModal';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import VehicleInvolvement from '../SummaryModel/VehicleInvolvement';
import VehicleManagement from './VehicleTab/VehicleManagement/VehicleManagement';
import VehicleChain from './VehicleTab/VehicleChain/VehicleChain';
import Offense from './VehicleTab/Offense/Offense';
import { useNavigate } from 'react-router-dom';
import { Vehicle_ID } from '../../../redux/actionTypes';
import DataTable from 'react-data-table-component';
import DeletePopUpModal from '../../Common/DeleteModal';
import { toastifySuccess } from '../../Common/AlertMsg';




const Vehicle_Add_Up = ({ isCad = false, isCADSearch = false, isViewEventDetails = false }) => {

    const dispatch = useDispatch()
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { changesStatus, vehicleCount, get_vehicle_Count, countoffaduit, get_Incident_Count, get_Data_Vehicle, VehicleFilterData, incidentCount, incidentReportedDate, setIncidentReportedDate, propertyValidateNibrsData } = useContext(AgencyContext);
    const [propertystatus, setPropertyStatus] = useState('');
    const [IsNonPropertyRoomSelected, setIsNonPropertyRoomSelected] = useState(false);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    const carouselRef = useRef(null);
    const navigate = useNavigate();

    let MstVehicle = query?.get('page');
    var VehId = query?.get("VehId");
    var MVehId = query?.get('MVehId');
    var IncID = query?.get('IncId');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get('IncSta');
    var VehSta = query?.get('VehSta');
    var ModNo = query?.get('ModNo');
    var openPage = query?.get('page');
    var VicCategory = query?.get('VicCategory');
    var isNew = query?.get("isNew");

    let DecVehId = 0, DecMVehId = 0, DecIncID = 0;

    if (!VehId) VehId = 0;
    else DecVehId = parseInt(base64ToString(VehId));
    if (!MVehId) MVehId = 0;
    else DecMVehId = parseInt(base64ToString(MVehId));
    // if (!IncID) IncID = 0;
    // else DecIncID = parseInt(base64ToString(IncID));
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState();
    const [vehicleID, setVehicleID] = useState('');
    const [showVehicleRecovered, setShowVehicleRecovered] = useState(false);
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [ListData, setListData] = useState([]);
    const [DocName, setDocName] = useState('VehDoc')
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [viewType, setViewType] = useState('card');
    const [nibrsValidateData, setnibrsValidateData] = useState([]);
    const [newStatus, setnewStatus] = useState(false);
    const [loginPinID, setLoginPinID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [mainIncidentID, setMainIncidentID] = useState('');
    // const [incidentReportedDate, setIncidentReportedDate] = useState(null);
    const NameCount = incidentCount[0]?.VehicleCount || 0;


    useEffect(() => {
        if (IncID) {
            // setMainIncidentID(IncID); 
            get_Data_Vehicle(IncID);
            setMainIncidentID(IncID);
        }
    }, [IncID]);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);


    useEffect(() => {
        if (propertyValidateNibrsData?.Property) {
            setnibrsValidateData(propertyValidateNibrsData?.Property);
        }
    }, [propertyValidateNibrsData]);


    useEffect(() => {
        if (VehSta === 'true' || VehSta === true) {
            setStatus(true)
        } else {
            setStatus(false); get_vehicle_Count('')
        }
    }, [VehSta])

    useEffect(() => {
        if (DecVehId || DecMVehId) { get_List(DecVehId, DecMVehId) } else { setShowPage('home') }
    }, [DecVehId, DecMVehId]);

    const get_List = (DecVehId, DecMVehId) => {
        const val = { "PropertyID": DecVehId, "MasterPropertyID": DecMVehId, "IsMaster": openPage === "MST-Vehicle-Dash" ? true : false }
        fetchPostData('TabBasicInformation/VehicleInformation', val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }

    const setEditVal = (row) => {
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
            modal?.show();
        } else {
            // setVehicleMultiImg([]); setStatesChangeStatus(false);
            // setuploadImgFiles([]);
            if (row.VehicleID || row.MasterPropertyID) {
                if (isCad) {
                    navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}&isNew=${true}`)
                } else {
                    navigate(`/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${stringToBase64(row?.PropertyID)}&MVehId=${stringToBase64(row?.MasterPropertyID)}&VehSta=${true}&isNew=${true}`)
                }
                // setMasterPropertyID(row.MasterPropertyID); dispatch({ type: MasterVehicle_ID, payload: row?.MasterPropertyID });
                // setVehicleID(row?.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID });
                // setVehicleStatus(true); dispatch({ type: Master_Property_Status, payload: true });
                // setUpdateCount(updateCount + 1); setErrors([])
                // GetSingleData(row?.PropertyID, row?.MasterPropertyID);
                // get_vehicle_Count(row?.PropertyID, 0);
            }
        }

    }

    const columns = [
        {
            name: 'Vehicle Number',
            selector: (row) => row.VehicleNumber,
            sortable: true
        },
        {
            name: 'Loss Code ',
            selector: (row) => row.LossCode_Description,
            sortable: true
        },
        {
            name: 'Plate State/Number ',
            selector: (row) => row.PlateState,
            sortable: true
        },
        // {
        //     name: ' Make/Model ',
        //     selector: (row) => row.Model_Description || row.Make_Description,
        //     sortable: true
        // },
        {
            name: 'Make/Model',
            selector: (row) => {
                let make = row.Make_Description ? row.Make_Description : '';
                let model = row.Model_Description ? row.Model_Description : '';
                return `${make}${make && model ? ' / ' : ''}${model}`;
            },
            sortable: true
        },
        // {
        //     name: 'Primary Color',
        //     selector: (row) => row.PrimaryColor_Description,
        //     sortable: true
        // },
        {
            name: 'Primary Color',
            selector: (row) => (
                <span title={row?.PrimaryColor_Description}>
                    {row?.PrimaryColor_Description ? row?.PrimaryColor_Description.substring(0, 20) : ''}
                    {row?.PrimaryColor_Description?.length > 20 ? '...' : ''}
                </span>
            ),
            sortable: true
        },
        {
            name: 'Owner Name',
            selector: (row) => row.Owner_Description,
            sortable: true
        },

        {
            name: 'Plate Expirestion',
            // selector: (row) => row.InspectionExpiresDtTm,
            selector: (row) => row.PlateExpireDtTm,
            sortable: true
        },
        {
            name: 'Manu.Year',
            selector: (row) => row.ManufactureYear,
            sortable: true
        },
        // {
        //     name: 'Evidence Flag ',
        //     selector: (row) => row.Evidence,
        //     sortable: true
        // },
        {
            name: 'Evidence Flag',
            selector: row => (
                <input type="checkbox" checked={row.IsEvidence === true} disabled />
            ),
            sortable: true
        },
        // {
        //     width: '100px',
        //     name: 'View',
        //     cell: row =>
        //         <div style={{ position: 'absolute', top: 4, right: 30 }}>
        //             {
        //                 getNibrsError(row.PropertyID, nibrsValidateData) ?
        //                     <span
        //                         onClick={(e) => { setErrString(row.PropertyID, nibrsValidateData) }}
        //                         className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
        //                         data-toggle="modal"
        //                         data-target="#NibrsErrorShowModal"
        //                     >
        //                         <i className="fa fa-eye"></i>
        //                     </span>
        //                     :
        //                     <></>
        //             }
        //         </div>
        // },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={(e) => { setVehicleID(row.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            <span onClick={(e) => { setVehicleID(row.PropertyID); dispatch({ type: Vehicle_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }

                </div>
        }
    ]

    const getNibrsError = (Id, nibrsValidateData) => {
        const arr = nibrsValidateData?.filter((item) => item?.PropertyID == Id);
        return arr?.[0]?.OnPageError;
    }

    const getStatusColors = (ID, nibrsValidateData) => {
        return getNibrsError(ID, nibrsValidateData) ? { backgroundColor: "rgb(255 202 194)" } : {};
    };


    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => ({
                ...getStatusColors(row.PropertyID, nibrsValidateData),
                ...(row.PropertyID === DecVehId ? {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                    cursor: 'pointer',
                } : {})
            }),
        },
    ];

    const setStatusFalse = () => {
        if (MstVehicle === 'MST-Vehicle-Dash') {
            if (isCad) {
                if (isCADSearch) {
                    navigate(`/cad/vehicle_search?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}`);
                } else {
                    navigate(`/cad/dispatcher?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}`)
                }
            } else {
                navigate(`/Vehicle-Home?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&ModNo=${''}&VehSta=${false}`)
            }


            // dispatch({ type: Master_Vehicle_Status, payload: false });

        } else {
            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}&isNew=${true}`)
            } else {
                navigate(`/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${0}&MVehId=${0}&VehSta=${false}&isNew=${true}`)
            }

        }
    }

    const delete_Vehicle_Property = (e) => {
        const value = { 'PropertyID': vehicleID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstVehicle === "MST-Vehicle-Dash" ? true : false, }
        AddDeleteUpadate('PropertyVehicle/Delete_PropertyVehicle', value).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Incident_Count(mainIncidentID, loginPinID);
                get_Data_Vehicle(mainIncidentID);
                setStatusFalse();
                // newVehicle();
            } else {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
            }
        });
    }



    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                {!isCad && <div className="col-12  inc__tabs">
                    {
                        !openPage && <Tab />
                    }
                </div>}
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={`card Agency ${isCad ? 'CAD-incident-card' : 'incident-card'}`}>
                            <div className="card-body" >
                                {VehicleFilterData && VehicleFilterData.length > 0 && (
                                    <div className="card-carousel-container position-relative mb-3">
                                        {/* Cards Wrapper */}
                                        {viewType === "card" ? (
                                            <div className="card-carousel" id="cardCarousel" ref={carouselRef}>

                                                {VehicleFilterData?.map((row, index) => (
                                                    <div
                                                        className="info-card position-relative d-flex align-items-center justify-content-between"
                                                        key={index}
                                                        style={{
                                                            cursor: "pointer",
                                                            borderLeft: nibrsValidateData?.some(item => item?.PropertyID === row?.PropertyID) ? "5px solid #EB0101" : "5px solid #2DEB7A",
                                                        }}
                                                    >
                                                        {/* Card Content */}
                                                        <div>
                                                            <div>
                                                                <p className="mb-0 small" style={{ color: "black" }}><strong>Vehicle No . {row.VehicleNo}</strong></p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small"> {row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : ""}</p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small">{row.Gender}</p>
                                                            </div>
                                                            <div>
                                                                <p
                                                                    className="mb-0 small"
                                                                    style={{
                                                                        color: "black",
                                                                    }}
                                                                >
                                                                    {row.LossCode_Description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-column align-items-center gap-2 flex-shrink-0">
                                                            {/* Edit Button */}
                                                            {
                                                                effectiveScreenPermission ?
                                                                    <>
                                                                        {
                                                                            effectiveScreenPermission[0]?.Changeok ?
                                                                                <>
                                                                                    <div
                                                                                        style={{
                                                                                            backgroundColor: "#001f3f",
                                                                                            color: "white",
                                                                                            width: "36px",
                                                                                            height: "36px",
                                                                                            borderRadius: "50%",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            cursor: "pointer",
                                                                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                            marginBottom: "10px"
                                                                                            // transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                                                        }}
                                                                                        // onMouseEnter={(e) => {
                                                                                        //     e.currentTarget.style.transform = "scale(1.1)";
                                                                                        //     e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
                                                                                        // }}
                                                                                        // onMouseLeave={(e) => {
                                                                                        //     e.currentTarget.style.transform = "scale(1)";
                                                                                        //     e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                                                                        // }}
                                                                                        onClick={() => {
                                                                                            setEditVal(row);
                                                                                            // setResetErrors(true);
                                                                                        }}
                                                                                        title="Edit"
                                                                                    >
                                                                                        <i className="fa fa-edit"></i>
                                                                                    </div>

                                                                                </>
                                                                                :
                                                                                <>
                                                                                </>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div
                                                                            style={{
                                                                                backgroundColor: "#001f3f",
                                                                                color: "white",
                                                                                width: "36px",
                                                                                height: "36px",
                                                                                borderRadius: "50%",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                cursor: "pointer",
                                                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                marginBottom: "10px"
                                                                                // transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                                            }}
                                                                            // onMouseEnter={(e) => {
                                                                            //     e.currentTarget.style.transform = "scale(1.1)";
                                                                            //     e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
                                                                            // }}
                                                                            // onMouseLeave={(e) => {
                                                                            //     e.currentTarget.style.transform = "scale(1)";
                                                                            //     e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                                                            // }}
                                                                            onClick={() => {
                                                                                setEditVal(row);
                                                                                // setResetErrors(true);
                                                                            }}
                                                                            title="Edit"
                                                                        >
                                                                            <i className="fa fa-edit"></i>
                                                                        </div>

                                                                    </>
                                                            }

                                                            {/* Delete Button */}
                                                            {
                                                                effectiveScreenPermission ?
                                                                    <>
                                                                        {
                                                                            effectiveScreenPermission[0]?.DeleteOK ?
                                                                                <>
                                                                                    <div
                                                                                        style={{
                                                                                            backgroundColor: "#001f3f",
                                                                                            color: "white",
                                                                                            width: "36px",
                                                                                            height: "36px",
                                                                                            borderRadius: "50%",
                                                                                            display: "flex",
                                                                                            alignItems: "center",
                                                                                            justifyContent: "center",
                                                                                            cursor: "pointer",
                                                                                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                            // transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                                                        }}
                                                                                        // onMouseEnter={(e) => {
                                                                                        //     e.currentTarget.style.transform = "scale(1.1)";
                                                                                        //     e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
                                                                                        // }}
                                                                                        // onMouseLeave={(e) => {
                                                                                        //     e.currentTarget.style.transform = "scale(1)";
                                                                                        //     e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                                                                        // }}
                                                                                        data-toggle="modal"
                                                                                        data-target="#DeleteModal"
                                                                                        onClick={() => setVehicleID(row.PropertyID)}
                                                                                        title="Delete"
                                                                                    >
                                                                                        <i className="fa fa-trash"></i>
                                                                                    </div>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                </>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div
                                                                            style={{
                                                                                backgroundColor: "#001f3f",
                                                                                color: "white",
                                                                                width: "36px",
                                                                                height: "36px",
                                                                                borderRadius: "50%",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                cursor: "pointer",
                                                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                                                                // transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                                            }}
                                                                            // onMouseEnter={(e) => {
                                                                            //     e.currentTarget.style.transform = "scale(1.1)";
                                                                            //     e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.3)";
                                                                            // }}
                                                                            // onMouseLeave={(e) => {
                                                                            //     e.currentTarget.style.transform = "scale(1)";
                                                                            //     e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
                                                                            // }}
                                                                            data-toggle="modal"
                                                                            data-target="#DeleteModal"
                                                                            onClick={() => setVehicleID(row.PropertyID)}
                                                                            title="Delete"
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </div>
                                                                    </>
                                                            }

                                                        </div>
                                                        {/* <div className="d-fle flex-column gap-2 flex-shrink-0">
                                                                                        <div
                                                                                            style={{
                                                                                                backgroundColor: "#001f3f",
                                                                                                padding: "8px",
                                                                                                borderRadius: "50%",
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                justifyContent: "center",
                                                                                                cursor: "pointer",
                                                                                                marginBottom: "10px"
                                                                                            }}
                                                                                            className="text-white "
                                                                                            onClick={() => { set_Edit_Value(row); setResetErrors(true) }}
                                                                                        >
                                                                                            <i className="fa fa-edit"></i>
                                                                                        </div>
                                                                                        <div
                                                                                            style={{
                                                                                                backgroundColor: "#001f3f",
                                                                                                padding: "8px",
                                                                                                borderRadius: "50%",
                                                                                                display: "flex",
                                                                                                alignItems: "center",
                                                                                                justifyContent: "center",
                                                                                                cursor: "pointer",
                                                                                                fontSize: '20px'
                                                                                            }}
                                                                                            className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal"
                                                                                            onClick={() => { setNameID(row.NameID); }}
                                                                                        >
                                                                                            <i className="fa fa-trash"></i>
                                                                                        </div>
                                                                                    </div> */}
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                            :
                                            viewType === "list" ? (
                                                <div className="modal-table" style={{ flex: "0 0 95%", maxWidth: "95%" }}>
                                                    {MstVehicle != 'MST-Vehicle-Dash' && (
                                                        <DataTable
                                                            dense
                                                            columns={columns}
                                                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? VehicleFilterData : [] : VehicleFilterData}
                                                            selectableRowsHighlight
                                                            highlightOnHover
                                                            responsive
                                                            fixedHeaderScrollHeight="150px"
                                                            fixedHeader
                                                            persistTableHead={true}
                                                            customStyles={tableCustomStyle}
                                                            onRowClicked={(row) => {
                                                                // setClickedRow(row);
                                                                setEditVal(row);
                                                            }}
                                                            pagination
                                                            paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                                            paginationPerPage={5}
                                                            conditionalRowStyles={conditionalRowStyles}
                                                            showHeader={true}

                                                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                        />
                                                    )}
                                                </div>
                                            )
                                                :
                                                null
                                        }
                                        <div className="text-right ml-3">
                                            <div className="right-controls d-flex flex-column align-items-center gap-2">
                                                <div className="view-toggle d-flex flex-column gap-2">
                                                    <button className="btn btn-sm btn-success mb-2" onClick={() => { setStatusFalse(); }}> New </button>
                                                    {viewType === "card" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("list")}  > Grid </button>)}
                                                    {viewType === "list" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("card")} > Card  </button>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {
                                    (status || isNew === "true" || isNew === true || NameCount === 0 || NameCount === "0") && (
                                        <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                            <div className="col-12  name-tab">
                                                <ul className='nav nav-tabs'>
                                                    <Link
                                                        className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                                        to={
                                                            isCad ? isCADSearch ? `cad/property_search?page=MST-Vehicle-Dash&VehId=${VehId}&MVehId=${MVehId}&ModNo=${ModNo}&VehSta=${VehSta}&VicCategory=${VicCategory}` :
                                                                openPage
                                                                    ? `/cad/dispatcher?page=MST-Vehicle-Dash&VehId=${VehId}&MVehId=${MVehId}&ModNo=${ModNo}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                                    : `/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${VehId}&MVehId=${MVehId}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                                : openPage
                                                                    ? `/Vehicle-Home?page=MST-Vehicle-Dash&VehId=${VehId}&MVehId=${MVehId}&ModNo=${ModNo}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                                    : `/Vehicle-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${VehId}&MVehId=${MVehId}&VehSta=${VehSta}&VicCategory=${VicCategory}`
                                                        }
                                                        style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('home'); setPropertyStatus(false); } }}

                                                    >
                                                        {iconHome}
                                                    </Link>
                                                    <span
                                                        className={`nav-item ${showPage === 'AdditionalInformation' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'AdditionalInformation' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('AdditionalInformation') } }}

                                                    >
                                                        Additional Information
                                                    </span>
                                                    {MstVehicle !== "MST-Vehicle-Dash" && (
                                                        <span
                                                            className={`nav-item ${showPage === 'Offense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'Offense' ? 'Red' : vehicleCount?.OffenseCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => {
                                                                if (!changesStatus) { setShowPage('Offense') }
                                                            }}

                                                        >

                                                            Associated Offenses{`${vehicleCount?.OffenseCount > 0 ? '(' + vehicleCount?.OffenseCount + ')' : ''}`}
                                                        </span>
                                                    )}
                                                    {
                                                        showVehicleRecovered &&
                                                        <span className={`nav-item ${showPage === 'RecoveredVehicle' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'RecoveredVehicle' ? 'Red' : vehicleCount?.VehicleRecovered > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => {
                                                                if (!changesStatus) { setShowPage('RecoveredVehicle') }
                                                            }}

                                                        >
                                                            Recovered Vehicle   {`${vehicleCount?.VehicleRecovered > 0 ? '(' + vehicleCount?.VehicleRecovered + ')' : ''}`}
                                                        </span>
                                                    }

                                                    <span className={`nav-item ${showPage === 'VehicleTransactionLog' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'VehicleTransactionLog' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) setShowPage('VehicleTransactionLog')
                                                        }}


                                                    >
                                                        Involvement
                                                    </span>
                                                    {
                                                        propertystatus && !(IsNonPropertyRoomSelected) &&
                                                        <>
                                                            <span
                                                                className={`nav-item ${showPage === 'PropertyManagement' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: showPage === 'PropertyManagement' ? 'Red' : '#000' }}
                                                                aria-current="page"
                                                                onClick={() => { if (!changesStatus) { setShowPage('PropertyManagement') } }}

                                                            >

                                                                Property Management
                                                            </span>
                                                            <span
                                                                className={`nav-item ${showPage === 'ChainOfCustody' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: showPage === 'ChainOfCustody' ? 'Red' : '#000' }}
                                                                aria-current="page"
                                                                onClick={() => { if (!changesStatus) { setShowPage('ChainOfCustody') } }}

                                                            >
                                                                Chain Of Custody
                                                            </span>
                                                        </>
                                                    }
                                                    <span className={`nav-item ${showPage === 'AuditLog' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'AuditLog' ? 'Red' : countoffaduit === true ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('AuditLog') }
                                                        }}
                                                    >
                                                        {isCad ? "Change Log" : " Audit Log"}
                                                    </span>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    showPage === 'home' ?
                                        <Home {...{ setStatus, setaddUpdatePermission, newStatus, status, setShowVehicleRecovered, showVehicleRecovered, get_List, setPropertyStatus, isCad, isViewEventDetails, isCADSearch }} />
                                        :
                                        // showPage === 'VehicleNotes' ?
                                        //     <VehicleNotes  {...{ ListData, DecVehId, DecMVehId, DecIncID, isViewEventDetails }} />
                                        //     :
                                        showPage === 'Document' ?
                                            <DocumentModal
                                                {...{ ListData, DocName, isViewEventDetails }}
                                                ParentId={DecVehId}
                                                Vichile={'VehicleDoc'}
                                                scrCode={'V083'}
                                                count={DecVehId}
                                                parentTabMasterID={DecMVehId}
                                                rowIdName={'DocumentID'}
                                                masterIDColName={'MasterPropertyID'}
                                                TabIdColName={'PropertyID'}
                                                insertDataMasterUrl={''}
                                                deleteUrl={'VehicleDocument/Delete_VehicleDocument'}
                                                insertDataUrl={'VehicleDocument/Insert_VehicleDocument'}
                                                getDataUrl={'VehicleDocument/GetData_VehicleDocument'}
                                            />
                                            :
                                            showPage === 'RecoveredVehicle' ?
                                                <RecoveredVehicle  {...{ ListData, DecVehId, DecMVehId, DecIncID, isViewEventDetails }} />
                                                :
                                                showPage === 'pawnvehicle' ?
                                                    <VehiclePawnProperty  {...{ ListData, DecVehId, DecMVehId, DecIncID }} />
                                                    :
                                                    showPage === 'Offense' ?
                                                        <Offense {...{ ListData, DecVehId, DecMVehId, DecIncID, }} />
                                                        :
                                                        showPage === 'VehicleTransactionLog' ?
                                                            <VehicleInvolvement
                                                                idColName={'PropertyID'}
                                                                url={''}
                                                                IncNo={IncNo}
                                                                IncSta={IncSta}
                                                                incId={DecIncID}
                                                                scrCode={'V085'}
                                                                tabID={DecVehId}
                                                                masterID={DecMVehId}
                                                                IsMaster={openPage === "MST-Vehicle-Dash" ? true : false}
                                                            />
                                                            :
                                                            showPage === 'AdditionalInformation' ?
                                                                <AddInformation   {...{ ListData, DecVehId, setIsNonPropertyRoomSelected, DecMVehId, DecIncID, propertystatus, setPropertyStatus, isViewEventDetails }} />
                                                                :
                                                                showPage === 'PropertyManagement' ?
                                                                    <VehicleManagement {...{ DecVehId, DecMVehId, DecIncID, VicCategory, isViewEventDetails }} />
                                                                    :
                                                                    showPage === 'ChainOfCustody' ?
                                                                        <VehicleChain {...{ DecVehId, DecMVehId, DecIncID, isViewEventDetails }} />
                                                                        :
                                                                        showPage === 'AuditLog' ?
                                                                            <Log
                                                                                ParentId={DecVehId}
                                                                                scrCode={'V086'}
                                                                                url={'Log/GetData_PropertyVehicle'}
                                                                                para={'PropertyID'}
                                                                                masterPara={'MasterPropertyID'}
                                                                                MstParentId={DecMVehId}
                                                                                IsMaster={openPage === "MST-Vehicle-Dash" ? true : false}
                                                                            />
                                                                            :
                                                                            <></>
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={delete_Vehicle_Property} />
        </div>
    )
}

export default Vehicle_Add_Up