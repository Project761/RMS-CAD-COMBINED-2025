import { useContext, useEffect, useRef, useState } from 'react';
import Home from './NameTab/Home/Home';
import General from './NameTab/General/General';
import ContactDetails from './NameTab/ContactDetails/ContactDetails';
import Aliases from './NameTab/Aliases/Aliases';
import Smt from './NameTab/SMT/Smt';
import Victim from './NameTab/Victim/Victim';
import IdentificationNumber from './NameTab/IdentificationNumber/IdentificationNumber';
import Gang from './NameTab/Gang/Gang';
import { AgencyContext } from '../../../Context/Agency/Index';
import Connection from './NameTab/Connection/Connection';
import Address from './NameTab/Address/Address';
import { Decrypt_Id_Name, getShowingWithOutTime, isLockOrRestrictModule, stringToBase64, tableCustomStyle } from '../../Common/Utility';
import Tab from '../../Utility/Tab/Tab';
import { Link, useNavigate } from 'react-router-dom';
import AssaultInjuryCom from './NameTab/Offender/OffenderTab/AllTabCom/AssaultInjuryCom';
import Appearance from './NameTab/Appearance/Appearance';
import Log from '../Log/Log';
import { useLocation } from "react-router-dom";
import { base64ToString } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import Involvements from '../SummaryModel/Involvement';
import Warrant from './NameTab/Warrant/Warrant';
import History from './NameTab/History/History';
import Offense from './NameTab/Offense/Offense';
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toastifySuccess } from '../../Common/AlertMsg';
import DeleteNameModal from '../../Common/DeleteNameModel';
import LockRestrictModule from '../../Common/LockRestrictModule';
import { faLock, faUnlock, faBan, } from "@fortawesome/free-solid-svg-icons";


const NameTab = ({ isCad = false, isCADSearch = false, isViewEventDetails = false }) => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
        }
    }, []);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var NameID = query?.get("NameID");
    var MasterNameID = query?.get('MasterNameID');
    var IncID = query?.get('IncId');
    var NameStatus = query?.get('NameStatus');
    var MstPage = query?.get('page');
    var ModNo = query?.get('ModNo');
    var ProSta = query?.get('ProSta');
    var SideBarStatus = query?.get("SideBarStatus");
    var isNew = query?.get("isNew");

    let DecNameID = 0, DecMasterNameID = 0, DecIncID = 0;

    if (!NameID) NameID = 0;
    else DecNameID = parseInt(base64ToString(NameID));
    if (!MasterNameID) MasterNameID = 0;
    else DecMasterNameID = parseInt(base64ToString(MasterNameID));

    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const { nameShowPage, changesStatus, auditCount, offenderCount, nameFilterData, get_Incident_Count, victimCount, tabCount, NameTabCount, setNameShowPage, countStatus, countAppear, localStoreArray, get_LocalStorage, setNameSingleData, get_Data_Name, nibrsNameValidateArray, incidentCount } = useContext(AgencyContext);
    // console.log("🚀 ~ NameTab ~ nibrsNameValidateArray:", nibrsNameValidateArray)

    const carouselRef = useRef(null);
    const navigate = useNavigate();
    const [status, setStatus] = useState();
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const NameCount = incidentCount[0]?.NameCount || 0;

    const [showOffender, setShowOffender] = useState(false);
    const [showVictim, setShowVictim] = useState(false);
    const [showWarrant, setshowWarrant] = useState(false);
    const [isBusinessName, setIsBusinessName] = useState(false);
    const [NameId, setNameId] = useState(false);
    const [ListData, setListData] = useState([]);
    const [DocName, setDocName] = useState('NameDoc');

    const [showArrows, setShowArrows] = useState(false);
    const [viewType, setViewType] = useState('card'); // 'card' or 'list'
    const [addUpdatePermission, setaddUpdatePermission] = useState();
    const [editval, setEditval] = useState([]);
    const [masterNameID, setMasterNameID] = useState();
    const [nameID, setNameID] = useState();
    const [clickNibloder, setclickNibLoder] = useState(false);
    const [nibrsErrModalStatus, setNibrsErrModalStatus] = useState(false);
    const [nibrsErrStr, setNibrsErrStr] = useState('');
    const [addName, setAddName] = useState(true); // 'card' or 'list'
    const [loginPinID, setLoginPinID] = useState(1);
    const [ResetErrors, setResetErrors] = useState(false); // 'card' or 'list'
    // Lock Restrict
    const [showLockModal, setShowLockModal] = useState(false);
    const [openModule, setOpenModule] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [permissionToUnlock, setPermissionToUnlock] = useState(false);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID); get_Data_Name(IncID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (NameStatus === true || NameStatus === 'true') {
            setStatus(true);
        } else {
            setStatus(false);
        }
        setNameShowPage('home');
    }, [NameStatus])

    useEffect(() => {
        if (DecNameID || DecMasterNameID) { get_List(DecNameID, DecMasterNameID); GetSingleData(DecNameID, DecMasterNameID); }
    }, [DecNameID, DecMasterNameID]);

    useEffect(() => {
        if (IncID) {
            get_Data_Name(IncID);
        }
    }, [IncID]);

    const get_List = (DecNameID, DecMasterNameID) => {
        const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
        const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('TabBasicInformation/NameInformation', MstPage ? val2 : val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        const checkOverflow = () => {
            const carousel = carouselRef.current;
            if (carousel) {
                setShowArrows(carousel.scrollWidth > carousel.clientWidth);
            }
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [nameFilterData]);

    useEffect(() => {
        if (DecNameID && IncID && loginPinID) {
            getPermissionLevelByLock(IncID, loginPinID, DecNameID);
        } else {

        }
    }, [DecNameID, IncID, loginPinID]);


    const getPermissionLevelByLock = async (IncidentID, OfficerID, NameID) => {
        try {
            const res = await fetchPostData("Restricted/GetPermissionLevelBy_Lock", { 'IncidentID': IncidentID, 'OfficerID': OfficerID, 'ModuleName': "Name", 'ID': NameID || 0 });
            console.log("🚀 ~ getPermissionLevelByLock ~ res:", res);
            if (res?.length > 0) {
                setIsLocked(res[0]?.IsLocked === true || res[0]?.IsLocked === 1 ? true : false);
                setPermissionToUnlock(res[0]?.IsUnLockPermission === true || res[0]?.IsUnLockPermission === 1 ? true : false);

            } else {
                setPermissionToUnlock(false);
                setIsLocked(false);

            }
        } catch (error) {
            console.error('There was an error!', error);
            setPermissionToUnlock(false);
            setIsLocked(false);
        }
    }

    const scrollCards = (direction) => {
        const carousel = carouselRef.current;
        if (carousel) {
            const scrollAmount = 300;
            carousel.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const GetSingleData = (nameID, masterNameID) => {
        const val = { 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        const val2 = { 'MasterNameID': masterNameID, 'NameID': 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }
        fetchPostData('MasterName/GetSingleData_MasterName', MstPage === "MST-Property-Dash" ? val2 : val).then((res) => {
            if (res) {
                setEditval(res); setNameSingleData(res);
            } else { setEditval([]); setNameSingleData([]) }
        })
    }

    const columns = [
        {
            name: 'MNI', selector: (row) => row.NameIDNumber, sortable: true
        },
        {
            name: 'Name', selector: (row) => row.FullName, sortable: true
        },
        {
            name: 'Gender', selector: (row) => row.Gender, sortable: true
        },
        {
            name: 'DOB', selector: (row) => row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : " ", sortable: true
        },
        {
            name: 'SSN', selector: (row) => row.SSN, sortable: true
        },
        {
            name: 'Race', selector: (row) => row.Description_Race, sortable: true
        },
        {
            name: 'Ethnicity', selector: (row) => row.EthnicityDes, sortable: true
        },
        {
            name: 'Alias Indicator', selector: (row) => row.AliasIndicator, sortable: true
        },
        {
            name: 'Reason Code', selector: (row) => row?.NameReasonCode || '',
            format: (row) => (<>{row?.NameReasonCode ? row?.NameReasonCode.substring(0, 50) : ''}{row?.NameReasonCode?.length > 40 ? '  . . .' : null} </>),
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", nameFilterData, isLocked, true) ?
                                <span onClick={() => { setNameID(row.NameID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            !isLockOrRestrictModule("Lock", nameFilterData, isLocked, true) &&
                            <span onClick={() => { setNameID(row.NameID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteNameModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const getNibrsError = (Id, nibrsNameValidateArray) => {
        const arr = nibrsNameValidateArray?.filter((item) => item?.NameEventID == Id);
        return arr?.[0]?.OnPageError;
    }

    const setErrString = (ID, nibrsNameValidateArray) => {
        const arr = nibrsNameValidateArray?.filter((item) => item?.NameEventID == ID);
        setNibrsErrStr(arr[0]?.OnPageError);
        setNibrsErrModalStatus(true);
    }

    const getStatusColors = (ID, nibrsValidateData) => {
        return getNibrsError(ID, nibrsValidateData) ? { backgroundColor: "rgb(255 202 194)" } : {};
    };

    const set_Edit_Value = (row) => {
        if (row.NameID || row.MasterNameID) {
            // Reset(); setVictimTypeDrp([]);
            GetSingleData(row.NameID, row.MasterNameID);
            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
            } else {
                navigate(`/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${stringToBase64(row?.NameID)}&MasterNameID=${stringToBase64(row?.MasterNameID)}&NameStatus=${true}`)
            }
            getPermissionLevelByLock(IncID, localStoreData?.PINID, row.NameID);
            setNameID(row.NameID); setMasterNameID(row?.MasterNameID);
            setNameShowPage('home');
        }
    }

    const setStatusFalse = () => {
        if (MstPage === "MST-Name-Dash") {
            if (isCADSearch) {
                navigate(`/cad/name-search?page=MST-Name-Dash&IncId=${stringToBase64(IncID)}&IncNo=${0}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}&isNew=${true}`)
            } else {
                navigate(`/Name-Home?page=MST-Name-Dash&&IncId=${stringToBase64(IncID)}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}&isNew=${true}`)
            }
        }
        else {
            if (isCad) {
                navigate(`/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}&isNew=${true}`)
            } else {
                navigate(`/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}&isNew=${true}`)
            }
            setMasterNameID(''); setNameID('');
        }
    }

    const setToReset = () => { }

    const DeleteContactDetail = () => {
        const val = { 'NameID': nameID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('MasterName/Delete_NameEvent', val).then((res) => {
            if (res) {
                const parseData = JSON.parse(res.data);
                toastifySuccess(parseData?.Table[0].Message);
                get_Data_Name(DecIncID, MstPage === "MST-Name-Dash" ? true : false);
                // get_NameTypeData(loginAgencyID);
                // setStatesChangeStatus(false); 
                get_Incident_Count(DecIncID, loginPinID);
                //  Reset(); 
                setStatusFalse();
            } else { console.log("Somthing Wrong"); }
        })
    }

    const tableCustomStyle = {
        headRow: {
            style: { color: '#fff', backgroundColor: '#001f3f', borderBottomColor: '#FFFFFF', outline: '1px solid #FFFFFF', },
        },
        rows: { style: { minHeight: '48px', borderBottom: '1px solid #ccc', }, },
        cells: {
            style: {
                paddingTop: '10px', paddingBottom: '10px', paddingLeft: '8px', paddingRight: '8px',
            },
        },
    };

    const conditionalRowStyles = [
        {
            when: () => true,
            style: (row) => ({
                ...getStatusColors(row.NameID, nibrsNameValidateArray),
                ...(row.NameID === nameID ? {
                    backgroundColor: '#001f3fbd',
                    color: 'white',
                    cursor: 'pointer',
                } : {})
            }),
        },
    ];

    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                {!isCad && <div className="col-12  inc__tabs">
                    {
                        !MstPage && <Tab />
                    }
                </div>}
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className={`card Agency ${isCad ? 'CAD-incident-card' : 'incident-card'}`}>
                            <div className="card-body " style={{ paddingTop: "2px" }} >
                                {nameFilterData && nameFilterData.length > 0 && MstPage !== "MST-Name-Dash" && (
                                    <div className="card-carousel-container position-relative mb-3">
                                        {/* Cards Wrapper */}
                                        {viewType === "card" ? (
                                            <div className="card-carousel" id="cardCarousel" ref={carouselRef}>

                                                {nameFilterData?.map((row, index) => (
                                                    <div
                                                        className="info-card position-relative d-flex align-items-center justify-content-between"
                                                        key={index}
                                                        style={{
                                                            cursor: "pointer",
                                                            borderLeft: nibrsNameValidateArray?.some(item => item?.NameEventID === row?.NameID) ? "5px solid #EB0101" : "5px solid #2DEB7A",
                                                            backgroundColor: row?.NameID === nameID ? "#425971" : "#ffffff",
                                                        }}
                                                    >
                                                        {/* Card Content */}
                                                        <div>

                                                            <p className=" small truncate-multiline mb-1" style={{ color: row?.NameID === nameID ? "white" : "black", fontWeight: "bold" }}>{row.FullName}</p>


                                                            <p className=" small truncate-multiline  mb-1" style={{ color: row?.NameID === nameID ? "white" : "black" }}> {row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : ""}</p>


                                                            <p className=" small truncate-multiline  mb-1" style={{ color: row?.NameID === nameID ? "white" : "black" }}>{row.Gender}</p>

                                                            <p
                                                                className="mb-0 small truncate-multiline"
                                                                style={{ color: row?.NameID === nameID ? "white" : "black" }}
                                                            // style={{
                                                            //     color:
                                                            //         row?.NameID === nameID
                                                            //             ? "white"
                                                            //             : row.RoleName === "Other"
                                                            //                 ? "orange"
                                                            //                 : row.RoleName === "Victim"
                                                            //                     ? "green"
                                                            //                     : row.RoleName === "Offender"
                                                            //                         ? "red"
                                                            //                         : "black",
                                                            // }}
                                                            >
                                                                {row.NameReasonCode || ""}
                                                            </p>

                                                        </div>
                                                        <div className="d-flex flex-column align-items-center gap-2 flex-shrink-0">
                                                            {/* Edit Button */}
                                                            {
                                                                !isLockOrRestrictModule("Lock", nameFilterData, isLocked, true) &&
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
                                                                        set_Edit_Value(row);
                                                                        setResetErrors(true);
                                                                    }}
                                                                    title="Edit"
                                                                >
                                                                    <i className="fa fa-edit"></i>
                                                                </div>
                                                            }

                                                            {/* Delete Button */}
                                                            {
                                                                !isLockOrRestrictModule("Lock", nameFilterData, isLocked, true) &&
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
                                                                    data-toggle="modal"
                                                                    data-target="#DeleteNameModal"
                                                                    onClick={() => setNameID(row.NameID)}
                                                                    title="Delete"
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )
                                            :
                                            viewType === "list" ? (
                                                <div className="modal-table" style={{ flex: "0 0 95%", maxWidth: "95%" }}>
                                                    {MstPage !== "MST-Name-Dash" && (
                                                        <DataTable
                                                            dense
                                                            columns={columns}
                                                            data={
                                                                effectiveScreenPermission
                                                                    ? effectiveScreenPermission[0]?.DisplayOK
                                                                        ? nameFilterData
                                                                        : []
                                                                    : nameFilterData
                                                            }
                                                            selectableRowsHighlight
                                                            highlightOnHover
                                                            responsive
                                                            fixedHeader
                                                            fixedHeaderScrollHeight="150px"
                                                            customStyles={tableCustomStyle}
                                                            conditionalRowStyles={conditionalRowStyles}
                                                            onRowClicked={(row) => { set_Edit_Value(row); }}
                                                            persistTableHead
                                                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : "There are no data to display"}
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
                                                    <button className="btn btn-sm btn-success mb-2" onClick={() => { setStatusFalse(); setResetErrors(true); setIsLocked(false) }}> New </button>
                                                    {viewType === "card" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("list")}  > Grid </button>)}
                                                    {viewType === "list" && (<button className="btn btn-sm btn-success" onClick={() => setViewType("card")} > Card  </button>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {
                                    (status || isNew === "true" || isNew === true || NameCount === 0 || NameCount === "0") && (
                                        <div className="row" style={{ marginLeft: '-18px', marginRight: '-18px' }}>
                                            <div className="col-12 name-tab">
                                                <ul className='nav nav-tabs'>
                                                    {isCad ? <Link
                                                        className={`nav-item ${nameShowPage === 'home' ? 'active' : ''}`}
                                                        to={
                                                            isCADSearch ? `/cad/name-search?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}` :
                                                                MstPage ?
                                                                    `/cad/dispatcher?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}`
                                                                    :
                                                                    `/cad/dispatcher?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}`
                                                        }
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'home' ? 'Red' : '#000' }}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) setNameShowPage('home') }}
                                                    >
                                                        {iconHome}
                                                    </Link> : <Link
                                                        className={`nav-item ${nameShowPage === 'home' ? 'active' : ''}`}
                                                        to={
                                                            MstPage ?
                                                                `/Name-Home?page=MST-Name-Dash&MasterNameID=${MasterNameID}&NameID=${NameID}&NameStatus=${NameStatus}&ModNo=${ModNo}`
                                                                :
                                                                `/Name-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}`
                                                        }
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'home' ? 'Red' : '#000' }}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) setNameShowPage('home') }}
                                                    >
                                                        {iconHome}
                                                    </Link>}

                                                    {isBusinessName && (
                                                        <>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : NameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}
                                                            >
                                                                Contact Details{`${NameTabCount?.ContactDetailsCount > 0 ? '(' + NameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                            </span>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'Address' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'Address' ? 'Red' : NameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('Address') }}
                                                            >
                                                                Address{`${NameTabCount?.AddressCount > 0 ? '(' + NameTabCount?.AddressCount + ')' : ''}`}
                                                            </span>

                                                            <span
                                                                className={`nav-item ${nameShowPage === 'TransactionLog' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'TransactionLog' ? 'Red' : NameTabCount?.TransactionLogCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('TransactionLog') }}
                                                            >
                                                                Involvement{`${NameTabCount?.TransactionLogCount > 0 ? '(' + NameTabCount?.TransactionLogCount + ')' : ''}`}
                                                            </span>
                                                        </>
                                                    )}
                                                    {!isBusinessName && (
                                                        <>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'general' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'general' ? 'Red' : countStatus === true ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('general') }}
                                                            >
                                                                General{`${NameTabCount?.GeneralCount > 0 ? '(' + NameTabCount?.GeneralCount + ')' : ''}`}
                                                            </span>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'Appearance' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'Appearance' ? 'Red' : countAppear === true ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('Appearance') }}
                                                            >
                                                                Appearance{`${NameTabCount?.AppearanceCount > 0 ? '(' + NameTabCount?.AppearanceCount + ')' : ''}`}
                                                            </span>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'aliases' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'aliases' ? 'Red' : NameTabCount?.AliasesCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('aliases') }}
                                                            >
                                                                Aliases{`${NameTabCount?.AliasesCount > 0 ? '(' + NameTabCount?.AliasesCount + ')' : ''}`}
                                                            </span>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'SMT' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'SMT' ? 'Red' : NameTabCount?.NameSMTCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('SMT') }}
                                                            >
                                                                SMT{`${NameTabCount?.NameSMTCount > 0 ? '(' + NameTabCount?.NameSMTCount + ')' : ''}`}
                                                            </span>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'Identification_Number' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'Identification_Number' ? 'Red' : NameTabCount?.IdentificationNumberCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('Identification_Number') }}
                                                            >
                                                                Identification Number{`${NameTabCount?.IdentificationNumberCount > 0 ? '(' + NameTabCount?.IdentificationNumberCount + ')' : ''}`}
                                                            </span>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'Contact_Details' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'Contact_Details' ? 'Red' : NameTabCount?.ContactDetailsCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('Contact_Details') }}
                                                            >
                                                                Contact Details{`${NameTabCount?.ContactDetailsCount > 0 ? '(' + NameTabCount?.ContactDetailsCount + ')' : ''}`}
                                                            </span>
                                                            <span
                                                                className={`nav-item ${nameShowPage === 'Address' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'Address' ? 'Red' : NameTabCount?.AddressCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('Address') }}
                                                            >
                                                                Address{`${NameTabCount?.AddressCount > 0 ? '(' + NameTabCount?.AddressCount + ')' : ''}`}
                                                            </span>


                                                            <span
                                                                className={`nav-item ${nameShowPage === 'Warrant' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'Warrant' ? 'Red' : NameTabCount?.NameWarrantCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('Warrant') }}
                                                            >
                                                                Warrant{`${NameTabCount?.NameWarrantCount > 0 ? '(' + NameTabCount?.NameWarrantCount + ')' : ''}`}
                                                            </span>


                                                            <span
                                                                className={`nav-item ${nameShowPage === 'TransactionLog' ? 'active' : ''}${!status ? ' disabled' : ''}`}

                                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                                style={{ color: nameShowPage === 'TransactionLog' ? 'Red' : NameTabCount?.TransactionLogCount > 0 ? 'blue' : '#000' }}
                                                                aria-current="page"

                                                                onClick={() => { if (!changesStatus) setNameShowPage('TransactionLog') }}
                                                            >
                                                                Involvement{`${NameTabCount?.TransactionLogCount > 0 ? '(' + NameTabCount?.TransactionLogCount + ')' : ''}`}
                                                            </span>
                                                            {
                                                                MstPage &&
                                                                <span
                                                                    className={`nav-item ${nameShowPage === 'History' ? 'active' : ''}${!status ? 'disabled' : ''}`}

                                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                                    style={{ color: nameShowPage === 'History' ? 'Red' : '#000' }}
                                                                    aria-current="page"

                                                                    onClick={() => { if (!changesStatus) setNameShowPage('History') }}
                                                                >
                                                                    History
                                                                </span>
                                                            }
                                                        </>
                                                    )}
                                                    {
                                                        showVictim && !isBusinessName && MstPage !== "MST-Name-Dash" &&
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Victim' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: nameShowPage === 'Victim' ? 'Red' : victimCount === true ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Victim') }}
                                                        >
                                                            Victim
                                                        </span>
                                                    }

                                                    {
                                                        showOffender && MstPage !== "MST-Name-Dash" &&
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Offender' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: nameShowPage === 'Offender' ? 'Red' : offenderCount === true ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Offender') }}
                                                        >
                                                            Offender{`${tabCount?.OffenderCount > 0 ? '(' + tabCount?.OffenderCount + ')' : ''}`}
                                                        </span>
                                                    }
                                                    {MstPage !== "MST-Name-Dash" && (
                                                        <span
                                                            className={`nav-item ${nameShowPage === 'Offense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: nameShowPage === 'Offense' ? 'Red' : NameTabCount?.NameOffenseCount > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => { if (!changesStatus) setNameShowPage('Offense') }}
                                                        >
                                                            Associated Offenses
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`nav-item ${nameShowPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: nameShowPage === 'AuditLog' ? 'Red' : auditCount === true ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) setNameShowPage('AuditLog') }}
                                                    >
                                                        {isCad ? "Change Log" : " Audit Log"}
                                                    </span>
                                                    {
                                                        status ?
                                                            <>
                                                                {
                                                                    !isLocked &&
                                                                    <li className="list-inline-item nav-item">
                                                                        <button
                                                                            className="btn py-1 d-flex align-items-center gap-2"
                                                                            style={{ columnGap: "5px", backgroundColor: "#E0E0E0" }}
                                                                            onClick={() => { setOpenModule('Lock'); setShowLockModal(true) }}
                                                                            data-toggle="modal"
                                                                            data-target="#NibrsAllModuleErrorShowModal"
                                                                        >
                                                                            <FontAwesomeIcon icon={faLock} /> Lock
                                                                        </button>
                                                                    </li>
                                                                }
                                                                {
                                                                    permissionToUnlock &&
                                                                    <li className="list-inline-item nav-item">
                                                                        <button
                                                                            className="btn py-1 d-flex align-items-center gap-2"
                                                                            style={{ columnGap: "5px", backgroundColor: "#E0E0E0" }}
                                                                            onClick={() => { setOpenModule('Unlock'); setShowLockModal(true) }}
                                                                            data-toggle="modal"
                                                                            data-target="#NibrsAllModuleErrorShowModal"
                                                                        >
                                                                            <FontAwesomeIcon icon={faUnlock} /> Unlock
                                                                        </button>
                                                                    </li>
                                                                }
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }

                                {
                                    nameShowPage === 'home' ?
                                        <Home {...{
                                            setStatus, status, showVictim, setShowVictim, setNameShowPage, setshowWarrant, setShowOffender, setIsBusinessName, get_List, isCad, isCADSearch, isViewEventDetails, editval, setEditval, setNameSingleData, masterNameID, setMasterNameID, nameID, setNameID, GetSingleData, get_Data_Name, nibrsErrModalStatus, setNibrsErrModalStatus, nibrsErrStr, setNibrsErrStr,
                                            addName, setAddName, ResetErrors, setResetErrors, isLocked
                                            // nibrsValidateNameData, setnibrsValidateNameData,
                                        }} />
                                        :
                                        nameShowPage === 'general' ?
                                            <General {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                            :
                                            nameShowPage === 'Appearance' ?
                                                <Appearance  {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                :
                                                nameShowPage === 'aliases' ?
                                                    <Aliases {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                    :
                                                    nameShowPage === 'SMT' ?
                                                        <Smt {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                        :
                                                        nameShowPage === 'Identification_Number' ?
                                                            <IdentificationNumber {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                            :
                                                            nameShowPage === 'Contact_Details' ?
                                                                <ContactDetails {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                                :
                                                                nameShowPage === 'Address' ?
                                                                    <Address {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                                    :
                                                                    nameShowPage === 'Warrant' ?
                                                                        <Warrant {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                                        :
                                                                        nameShowPage === 'Victim' && showVictim ?
                                                                            <Victim {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} showTabs={setNameShowPage} />
                                                                            :
                                                                            nameShowPage === 'Offense' ?
                                                                                <Offense {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails, isLocked }} />
                                                                                :
                                                                                nameShowPage === 'Offender' && showOffender ?
                                                                                    <AssaultInjuryCom  {...{ ListData, ListData, DecNameID, DecMasterNameID, DecIncID }} />
                                                                                    :
                                                                                    nameShowPage === 'Gang' ?
                                                                                        <Gang {...{ DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                        :
                                                                                        nameShowPage === 'connections' ?
                                                                                            <Connection  {...{ ListData, DecNameID, DecMasterNameID, DecIncID }} />
                                                                                            :
                                                                                            nameShowPage === 'History' ?
                                                                                                <History {...{ ListData, DecNameID, DecMasterNameID, DecIncID, isViewEventDetails }} />
                                                                                                :
                                                                                                nameShowPage === 'TransactionLog' ?
                                                                                                    <Involvements
                                                                                                        idColName={'MasterNameID'}
                                                                                                        para={'NameID'}
                                                                                                        url={''}
                                                                                                        NameStatus={NameStatus}
                                                                                                        SideBarStatus={SideBarStatus}
                                                                                                        NameID={NameID}
                                                                                                        ProSta={ProSta}
                                                                                                        IncNo={IncNo}
                                                                                                        IncSta={IncSta}
                                                                                                        scrCode={'N055'}
                                                                                                        incId={DecIncID}
                                                                                                        tabID={DecNameID}
                                                                                                        masterID={DecMasterNameID}
                                                                                                        IsMaster={MstPage === "MST-Name-Dash" ? true : false}
                                                                                                    />
                                                                                                    :
                                                                                                    nameShowPage === 'AuditLog' ?
                                                                                                        <Log
                                                                                                            ParentId={DecNameID}
                                                                                                            scrCode={'N056'}
                                                                                                            url={'Log/GetData_LogName'}
                                                                                                            para={'NameID'}
                                                                                                            masterPara={'MasterNameID'}
                                                                                                            MstParentId={DecMasterNameID}
                                                                                                            IsMaster={MstPage === "MST-Name-Dash" ? true : false}
                                                                                                        />
                                                                                                        :
                                                                                                        <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteNameModal func={DeleteContactDetail} setStatusFalse={setStatusFalse} setToReset={setToReset} />
            <LockRestrictModule
                show={showLockModal}
                openModule={openModule}
                onClose={() => setShowLockModal(false)}

                isLockedOrRestrict={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'IsRestricted' : 'IsLocked'}
                isLockOrRestrictLevel={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'RestrictLevel' : 'LockLevel'}
                isLockOrRestricPINID={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'RestrictPINID' : 'LockPINID'}
                isLockOrRestricDate={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'RestrictDate' : 'LockDate'}
                moduleName={'Name'}
                id={DecNameID || 0}
                isLockOrRestrictUrl={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'Restricted/UpdateIncidentRestrictedStatus' : 'Restricted/UpdateIncidentLockStatus'}

                getPermissionLevelByLock={getPermissionLevelByLock}
            // getPermissionLevelByRestrict={getPermissionLevelByRestrict}

            />
        </div >
    )
}

export default NameTab