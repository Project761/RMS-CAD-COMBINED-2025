import React, { useContext, useEffect, useRef, useState, } from 'react';
import { PropertyTabs } from '../../Utility/Tab/TabsArray';
import { AgencyContext } from '../../../Context/Agency/Index';
import Home from './PropertyTab/Home/Home'
import Document from './PropertyTab/Document/Document'
import Owner from './PropertyTab/Owner/Owner'
import Offense from './PropertyTab/Offense/Offense'
import RecoveredProperty from './PropertyTab/RecoveredProperty/RecoveredProperty';
import PropertyTransactionlog from './PropertyTab/PropertyTransactionLog/PropertyTransactionlog';
import PawnProperty from './PropertyTab/PawnProperty/PawnProperty';
import Tab from '../../Utility/Tab/Tab';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Log from '../Log/Log';
import PropertyNotes from './PropertyTab/PropertyNotes/PropertyNotes';
import MiscellaneousInformation from './PropertyTab/MiscellaneousInformation/MiscellaneousInformation';
import DocumentModal from '../../Common/DocumentModal';
import { useDispatch, useSelector } from 'react-redux';
import { base64ToString, Decrypt_Id_Name, stringToBase64, tableCustomStyle } from '../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import Other from './PropertyTab/Other/Other';
import Involvements from '../SummaryModel/Involvement';
import PropertyInvolvement from '../SummaryModel/PropertyInvolvement';
import PropertyManagement from './PropertyTab/PropertyManagement/PropertyManagement';
import ChainOfCustody from './PropertyTab/ChainOfCustody/ChainOfCustody';
import { get_PropertyMainModule_Data } from '../../../redux/actions/PropertyAction';
import DataTable from 'react-data-table-component';
import { MasterProperty_ID, Property_ID } from '../../../redux/actionTypes';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { toastifySuccess } from '../../Common/AlertMsg';
import DeletePopUpModal from '../../Common/DeleteModal';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';


const Property_Tabs = ({ isCad = false, isViewEventDetails = false, isCADSearch = false }) => {

    const { changesStatus, propertyCount, get_Property_Count, countoffaduit, get_Incident_Count, incidentCount, propertyValidateNibrsData } = useContext(AgencyContext);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const PropertyCount = incidentCount[0]?.PropertyCount || 0;

    const query = useQuery();
    var IncID = query?.get('IncId');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ProId = query?.get("ProId");
    var MProId = query?.get('MProId');
    var ProSta = query?.get('ProSta');
    let isNew = query?.get('isNew');
    var ModNo = query?.get('ModNo');
    var openPage = query?.get('page');
    var ProCategory = query?.get('ProCategory');
    var NameStatus = query?.get('NameStatus');
    let DecPropID = 0, DecMPropID = 0, DecIncID = 0;
    let MstPage = query?.get('page');

    if (!ProId) ProId = 0;
    else DecPropID = parseInt(base64ToString(ProId));
    if (!MProId) MProId = 0;
    else { DecMPropID = parseInt(base64ToString(MProId)); }
    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState(false);
    const [showRecovered, setShowRecovered] = useState(false);
    const [showOtherTab, setShowOtherTab] = useState(false);
    const [ListData, setListData] = useState([]);
    const [DocName, setDocName] = useState('PropDoc');
    const [propertyID, setPropertyID] = useState('');
    const [masterPropertyID, setMasterPropertyID] = useState('');
    const [propertystatus, setPropertyStatus] = useState('');
    const [IsNonPropertyRoomSelected, setIsNonPropertyRoomSelected] = useState(false);

    useEffect(() => {
        if (ProSta === 'true' || ProSta === true) {
            setStatus(true);
        } else {
            setStatus(false); get_Property_Count('')
        }
    }, [ProSta])

    useEffect(() => {
        if (DecPropID || DecMPropID) {
            get_List(DecPropID, DecMPropID)
        }
    }, [DecPropID, DecMPropID]);

    const get_List = (propertyID, masterPropertyID) => {
        const val = {
            'MasterPropertyID': '0',
            'PropertyID': propertyID,
            'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
        }
        const val1 = {
            'PropertyID': '0',
            'MasterPropertyID': masterPropertyID,
            'IsMaster': MstPage === "MST-Property-Dash" ? true : false,
        }
        fetchPostData('TabBasicInformation/PropertyInformation', MstPage === 'MST-Property-Dash' ? val1 : val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }


    // new Grid List
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const carouselRef = useRef(null);
    const [nibrsValidateData, setnibrsValidateData] = useState([]);
    const [viewType, setViewType] = useState('card');
    const [delPropertyID, setDelPropertyID] = useState('');
    //   const [loginPinID, setLoginPinID,] = useState('');
    const propertyMainModuleData = useSelector((state) => state.Property.propertyMainModuleData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const loginPinID = localStoreData?.PINID || 0;

    const deleteOK = effectiveScreenPermission && effectiveScreenPermission[0]?.DeleteOK;
    const updateOK = effectiveScreenPermission && effectiveScreenPermission[0]?.UpdateOK;
    const addOK = effectiveScreenPermission && effectiveScreenPermission[0]?.AddOK;
    const viewOK = effectiveScreenPermission && effectiveScreenPermission[0]?.ViewOK;



    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("P059", localStoreData?.AgencyID, localStoreData?.PINID));

        }
    }, [localStoreData]);

    useEffect(() => {
        const arr = [
            {
                PropertyID: 7081,
                OnPageError: "This is Testing Error ",
            }
        ]
        setnibrsValidateData(arr);
        // if (propertyValidateNibrsData?.Property) {
        //     setnibrsValidateData(propertyValidateNibrsData?.Property);
        // }
    }, [propertyValidateNibrsData]);

    useEffect(() => {
        if (DecIncID) {
            dispatch(get_PropertyMainModule_Data(DecIncID, MstPage === "MST-Property-Dash" ? true : false));
        }
    }, [DecIncID]);

    const getStatusColors = (ID, nibrsValidateData) => {
        return getNibrsError(ID, nibrsValidateData) ? { backgroundColor: "rgb(255 202 194)" } : {};
    };

    const getNibrsError = (Id, nibrsValidateData) => {
        const arr = nibrsValidateData?.filter((item) => item?.PropertyID == Id);
        return arr?.[0]?.OnPageError;
    }

    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => ({
                ...getStatusColors(row.PropertyID, nibrsValidateData),
                ...(row.PropertyID === DecPropID ? {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                    cursor: 'pointer',
                } : {})
            }),
        },
    ];

    const set_EditRow = (row) => {
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
            modal?.show();

        } else {
            // setuploadImgFiles(''); setMultiImage([]); setStatesChangeStatus(false);
            if (row.PropertyID || row.MasterPropertyID) {
                if (isCad) {
                    navigate(`/cad/dispatcher?IncId=${stringToBase64(DecIncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(row?.PropertyID)}&MProId=${stringToBase64(row?.MasterPropertyID)}&ProSta=${true}&ProCategory=${row.PropertyType_Description}`);

                } else {
                    navigate(`/Prop-Home?IncId=${stringToBase64(DecIncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${stringToBase64(row?.PropertyID)}&MProId=${stringToBase64(row?.MasterPropertyID)}&ProSta=${true}&ProCategory=${row.PropertyType_Description}`);

                }
                setShowPage('home')
                get_Property_Count(row?.PropertyID, row?.MasterPropertyID, MstPage === "MST-Property-Dash" ? true : false);
                setMasterPropertyID(row?.MasterPropertyID); dispatch({ type: MasterProperty_ID, payload: row?.MasterPropertyID });
                setPropertyID(row?.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID });
            }
        }
    }

    const columns1 = [
        {
            grow: 1, minwidth: "100px",
            name: 'Property Number',
            selector: (row) => row.PropertyNumber,
            sortable: true
        },
        {
            grow: 1,
            minWidth: "100px",
            name: 'Property Type',
            selector: (row) => row.PropertyType_Description,
            sortable: true
        },
        {
            grow: 1,
            minWidth: "100px",
            name: 'Category',
            selector: (row) => row.PropertyCategory_Description,
            sortable: true

        },
        {
            grow: 1,
            minWidth: "100px",
            name: 'Loss Code',
            selector: (row) => row.PropertyLossCode_Description,
            sortable: true
        },
        {
            grow: 1,
            minWidth: "100px",
            name: 'Owner Name',
            selector: (row) => row.Owner_Description,
            sortable: true
        },
        {
            grow: 1,
            minWidth: "100px",
            name: 'Evidence Flag',
            selector: row => (
                <input type="checkbox" checked={row.IsEvidence === true} disabled />
            ),
            sortable: true
        },
        {
            grow: 0,
            minWidth: "100px",
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            <span onClick={(e) => { setDelPropertyID(row.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID }); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const Delete_Property = () => {

        const val = { 'PropertyID': delPropertyID, 'DeletedByUserFK': loginPinID, 'IsMaster': MstPage === "MST-Property-Dash" ? true : false, }
        AddDeleteUpadate('Property/Delete_Property', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_Incident_Count(DecIncID, loginPinID);

                dispatch(get_PropertyMainModule_Data(DecIncID, MstPage === "MST-Property-Dash" ? true : false));

                if (propertyID == delPropertyID) {
                    setStatusFalse()
                }
            } else { console.log("Somthing Wrong"); }
        })
    }

    const setStatusFalse = (e) => {
        navigate(`/Prop-Home?IncId=${stringToBase64(DecIncID)}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${0}&MProId=${0}&ProSta=${false}&ProCategory=${''}&isNew=${true}`)
        setPropertyID('');
        setMasterPropertyID('');
        setPropertyStatus(false);
        setShowPage('home')
    };

    const getCardColor = (rowPropertyID, propertyID) => {
        if (rowPropertyID == propertyID) {
            return "#425971";
        } else {
            const arr = nibrsValidateData?.filter((item) => item?.PropertyID == rowPropertyID);
            // console.log("🚀 ~ getCardColor ~ nibrsValidateData:", nibrsValidateData)
            // console.log("🚀 ~ getCardColor ~ arr:", arr)
            return arr.length > 0 ? "#EB0101" : "#2DEB7A";
        }
    }

    return (
        <div className="section-body  pt-1 p-1 bt" >
            <div className="div">
                {!isCad && <div className="col-12  inc__tabs">
                    {
                        !openPage && <Tab />
                    }
                </div>}
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={`card Agency ${isCad ? 'CAD-incident-card' : 'incident-card'} ${openPage ? 'name-card' : ''}`}>
                            <div className="card-body">
                                {propertyMainModuleData && propertyMainModuleData.length > 0 && (
                                    <div className="card-carousel-container position-relative mb-3">
                                        {/* Cards Wrapper */}
                                        {viewType === "card" ? (
                                            <div className="card-carousel" id="cardCarousel" ref={carouselRef}>

                                                {propertyMainModuleData?.map((row, index) => (
                                                    <div
                                                        className="info-card position-relative d-flex align-items-center justify-content-between"
                                                        key={index}
                                                        style={{
                                                            cursor: "pointer",
                                                            borderLeft: nibrsValidateData?.some(item => item?.PropertyID === row?.PropertyID) ? "5px solid #EB0101" : "5px solid #2DEB7A",
                                                            backgroundColor: row?.PropertyID === propertyID ? "#425971" : "#ffffff",
                                                            // backgroundColor: getCardColor(row?.PropertyID, propertyID) ? getCardColor(row?.PropertyID, propertyID) : "#ffffff",
                                                        }}

                                                    >
                                                        {/* Card Content */}
                                                        <div>
                                                            <div>
                                                                <p className="mb-0 small" style={{ color: row?.PropertyID === propertyID ? "white" : "black" }}>
                                                                    <strong>{row.PropertyNumber}</strong></p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small" style={{ color: row?.PropertyID === propertyID ? "white" : "black" }}>
                                                                    {/* {row.PropertyType_Description} */}
                                                                    {row.PropertyType_Description ? row.PropertyType_Description.length > 40 ? `${row.PropertyType_Description.substring(0, 50)} . . .` : row.PropertyType_Description : ""}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small" style={{ color: row?.PropertyID === propertyID ? "white" : "black" }}>
                                                                    {/* {row.PropertyLossCode_Description} */}
                                                                    {row.PropertyLossCode_Description ? row.PropertyLossCode_Description.length > 40 ? `${row.PropertyLossCode_Description.substring(0, 50)} . . .` : row.PropertyLossCode_Description : ""}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small" style={{ color: row?.PropertyID === propertyID ? "white" : "black" }} >
                                                                    {row.PropertyCategory_Description ? row.PropertyCategory_Description.length > 40 ? `${row.PropertyCategory_Description.substring(0, 50)} . . .` : row.PropertyCategory_Description : ""}
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

                                                                                        onClick={() => { set_EditRow(row); }}

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

                                                                            onClick={() => {
                                                                                set_EditRow(row);
                                                                            }}

                                                                            title="Edit"
                                                                        >
                                                                            <i className="fa fa-edit"></i>
                                                                        </div>
                                                                    </>
                                                            }

                                                            {/* <div
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

                                                                onClick={() => { set_EditRow(row); }}

                                                                title="Edit"
                                                            >
                                                                <i className="fa fa-edit"></i>
                                                            </div> */}

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
                                                                                        }}
                                                                                        data-toggle="modal"
                                                                                        data-target="#DeleteModal"
                                                                                        onClick={() => {
                                                                                            setDelPropertyID(row.PropertyID);
                                                                                        }}
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
                                                                            }}
                                                                            data-toggle="modal"
                                                                            data-target="#DeleteModal"
                                                                            onClick={() => {
                                                                                setDelPropertyID(row.PropertyID);
                                                                            }}
                                                                            title="Delete"
                                                                        >
                                                                            <i className="fa fa-trash"></i>
                                                                        </div>
                                                                    </>
                                                            }
                                                            {/* <div
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
                                                                }}
                                                                data-toggle="modal"
                                                                data-target="#DeleteModal"
                                                                onClick={() => {
                                                                    setMasterPropertyID(row?.MasterPropertyID); dispatch({ type: MasterProperty_ID, payload: row?.MasterPropertyID });
                                                                    setPropertyID(row?.PropertyID); dispatch({ type: Property_ID, payload: row.PropertyID });
                                                                }}
                                                                title="Delete"
                                                            >
                                                                <i className="fa fa-trash"></i>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                            :
                                            viewType === "list" ? (
                                                <div className="modal-table" style={{ flex: "0 0 95%", maxWidth: "95%" }}>
                                                    {
                                                        MstPage != "MST-Property-Dash" &&
                                                        <DataTable
                                                            dense
                                                            fixedHeader
                                                            persistTableHead={true}
                                                            customStyles={tableCustomStyle}
                                                            conditionalRowStyles={conditionalRowStyles}
                                                            columns={columns1}
                                                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? propertyMainModuleData : [] : propertyMainModuleData}
                                                            selectableRowsHighlight
                                                            highlightOnHover
                                                            responsive
                                                            onRowClicked={(row) => {
                                                                set_EditRow(row);
                                                            }}
                                                            fixedHeaderScrollHeight='150px'
                                                            pagination
                                                            paginationPerPage={'100'}
                                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                        />
                                                    }
                                                </div>
                                            )
                                                :
                                                null
                                        }
                                        <div className="text-right ml-3">
                                            <div className="right-controls d-flex flex-column align-items-center gap-2">
                                                <div className="view-toggle d-flex flex-column gap-2">
                                                    <button className="btn btn-sm btn-success mb-2"
                                                        onClick={() => { setStatusFalse(); }}
                                                    >
                                                        New
                                                    </button>
                                                    {viewType === "card" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("list")}  > Grid </button>)}
                                                    {viewType === "list" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("card")} > Card  </button>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {
                                    (status || isNew === "true" || isNew === true || PropertyCount === 0 || PropertyCount === "0") && (
                                        <div className="row mt-1 " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                            <div className="col-12  name-tab">
                                                <ul className='nav nav-tabs'>
                                                    {isCad ? <Link
                                                        className={`nav-item ${showPage === 'home' ? 'active' : ''} `}
                                                        to={isCADSearch ? `cad/property_search?page=MST-Property-Dash&ProId=${ProId}&MProId=${MProId}&ModNo=${ModNo}&ProSta=${ProSta}&ProCategory=${ProCategory}` :
                                                            openPage ?
                                                                `/cad/dispatcher?page=MST-Property-Dash&ProId=${ProId}&MProId=${MProId}&ModNo=${ModNo}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                                :
                                                                `/cad/dispatcher?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${ProId}&MProId=${MProId}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                        }
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('home'); setPropertyStatus(false); }

                                                        }}
                                                    >
                                                        {iconHome}
                                                    </Link> : <Link
                                                        className={`nav-item ${showPage === 'home' ? 'active' : ''} `}
                                                        to={
                                                            openPage ?
                                                                `/Prop-Home?page=MST-Property-Dash&ProId=${ProId}&MProId=${MProId}&ModNo=${ModNo}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                                :
                                                                `/Prop-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${ProId}&MProId=${MProId}&ProSta=${ProSta}&ProCategory=${ProCategory}`
                                                        }
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('home'); setPropertyStatus(false); } }}
                                                    >
                                                        {iconHome}
                                                    </Link>}
                                                    <span
                                                        className={`nav-item ${showPage === 'Miscellaneous Information' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        aria-current="page"
                                                        style={{ color: showPage === 'Miscellaneous Information' ? 'Red' : propertyCount?.MiscellaneousInformationCount > 0 ? 'blue' : '#000' }}
                                                        onClick={() => { if (!changesStatus) { setShowPage('Miscellaneous Information') } }}
                                                    >
                                                        Miscellaneous Information{`${propertyCount?.MiscellaneousInformationCount > 0 ? '(' + propertyCount?.MiscellaneousInformationCount + ')' : ''}`}
                                                    </span>


                                                    <span
                                                        className={`nav-item ${showPage === 'Owner' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'Owner' ? 'Red' : propertyCount?.OwnerCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('Owner') } }}
                                                    >
                                                        Owner{`${propertyCount?.OwnerCount > 0 ? '(' + propertyCount?.OwnerCount + ')' : ''}`}
                                                    </span>

                                                    {MstPage !== "MST-Property-Dash" && (
                                                        <span
                                                            className={`nav-item ${showPage === 'Offense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'Offense' ? 'Red' : propertyCount?.OffenseCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) { setShowPage('Offense') } }}
                                                        >
                                                            Associated Offenses{`${propertyCount?.OffenseCount > 0 ? '(' + propertyCount?.OffenseCount + ')' : ''}`}
                                                        </span>
                                                    )}
                                                    {
                                                        showRecovered &&
                                                        <span
                                                            className={`nav-item ${showPage === 'Recoveredproperty' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'Recoveredproperty' ? 'Red' : propertyCount?.RecoveredCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) { setShowPage('Recoveredproperty') } }}
                                                        >
                                                            Recovered property{`${propertyCount?.RecoveredCount > 0 ? '(' + propertyCount?.RecoveredCount + ')' : ''}`}
                                                        </span>
                                                    }

                                                    <span
                                                        className={`nav-item ${showPage === 'PropertyTransactionLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'PropertyTransactionLog' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('PropertyTransactionLog') } }}
                                                    >
                                                        Involvement
                                                    </span>
                                                    {
                                                        showOtherTab &&
                                                        <span
                                                            className={`nav-item ${showPage === 'other' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'other' ? 'Red' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) { setShowPage('other') } }}
                                                        >
                                                            Other
                                                        </span>
                                                    }
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
                                                    <span
                                                        className={`nav-item ${showPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'AuditLog' ? 'Red' : countoffaduit === true ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('AuditLog') } }}
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
                                        <Home {...{ showRecovered, setShowRecovered, get_List, showOtherTab, setShowOtherTab, setPropertyStatus, setShowPage, propertystatus, isCad, isViewEventDetails, isCADSearch, status, }} />
                                        :
                                        showPage === 'Miscellaneous Information' ?
                                            <MiscellaneousInformation {...{ ListData, setIsNonPropertyRoomSelected, DecPropID, DecMPropID, DecIncID, propertystatus, setPropertyStatus, isCad, isViewEventDetails, isCADSearch, }} />
                                            :
                                            showPage === 'Document' ?
                                                // <Document />
                                                <DocumentModal
                                                    {...{ ListData, DocName }}
                                                    scrCode={'P060'}
                                                    IncID={DecIncID}
                                                    count={DecPropID}
                                                    ParentId={DecPropID}
                                                    parentTabMasterID={DecMPropID}
                                                    rowIdName={'DocumentID'}
                                                    masterIDColName={'MasterPropertyID'}
                                                    TabIdColName={'PropertyID'}
                                                    insertDataMasterUrl={''}
                                                    deleteUrl={'PropertyDocument/Delete_PropertyDocument'}
                                                    insertDataUrl={'PropertyDocument/Insert_PropertyDocument'}
                                                    getDataUrl={'PropertyDocument/GetData_PropertyDocument'}
                                                    getDataMasterUrl={'MainMasterPropertyDocument/GetData_MainMasterPropertyDocument'}
                                                />
                                                :
                                                showPage === 'PropertyNotes' ?
                                                    <PropertyNotes {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails }} />
                                                    :
                                                    showPage === 'Owner' ?
                                                        <Owner {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                        :
                                                        showPage === 'Offense' ?
                                                            <Offense {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                            :
                                                            showPage === 'Recoveredproperty' ?
                                                                <RecoveredProperty {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                                :
                                                                showPage === 'other' ?
                                                                    <Other {...{ ListData, DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                                    :
                                                                    showPage === 'PropertyManagement' ?
                                                                        <PropertyManagement {...{ DecPropID, DecMPropID, DecIncID, ProCategory, isViewEventDetails }} />
                                                                        :
                                                                        showPage === 'ChainOfCustody' ?
                                                                            <ChainOfCustody {...{ DecPropID, DecMPropID, DecIncID, isViewEventDetails, }} />
                                                                            :
                                                                            showPage === 'AuditLog' ?
                                                                                <Log
                                                                                    scrCode={'P065'}
                                                                                    ParentId={DecPropID}
                                                                                    para={'PropertyID'}
                                                                                    masterPara={'MasterPropertyID'}
                                                                                    MstParentId={DecMPropID}
                                                                                    IsMaster={openPage === "MST-Property-Dash" ? true : false}
                                                                                    url={'Log/GetData_Property'}
                                                                                />
                                                                                :
                                                                                showPage === 'PropertyTransactionLog' ?

                                                                                    <PropertyInvolvement
                                                                                        idColName={'MasterPropertyID'}
                                                                                        para={'PropertyID'}
                                                                                        url={''}
                                                                                        NameStatus={NameStatus}
                                                                                        IncNo={IncNo}
                                                                                        IncSta={IncSta}
                                                                                        incId={DecIncID}
                                                                                        scrCode={'P064'}
                                                                                        tabID={DecPropID}
                                                                                        IsMaster={openPage === "MST-Property-Dash" ? true : false}
                                                                                        masterID={DecMPropID}
                                                                                    />
                                                                                    :
                                                                                    <></>
                                }


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeletePopUpModal func={Delete_Property} />
        </div>
    )
}

export default Property_Tabs