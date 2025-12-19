import { useState, useEffect, useContext, useRef } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import Home from './ArrestTab/Home/Home'
import Property from './ArrestTab/Property/Property'
import CriminalActivity from './ArrestTab/CriminalActivity/CriminalActivity'
import CourtInformation from './ArrestTab/CourtInformation/CourtInformation'
import Narratives from './ArrestTab/Narratives/Narratives'
import PoliceForce from './ArrestTab/PoliceForce/PoliceForce'
import Juvenile from './ArrestTab/Juvenile/Juvenile'
import { base64ToString, Decrypt_Id_Name, isLockOrRestrictModule, stringToBase64, tableCustomStyles } from '../../Common/Utility'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Log from '../Log/Log'
import Tab from '../../Utility/Tab/Tab';
import Warrant from './ArrestTab/Warrant/Warrant'
import MugShorts from './ArrestTab/MugShort/mugShorts'
import FingerPrint from './ArrestTab/Fingerprints/FingerPrint'
import DataTable from 'react-data-table-component'
import DeletePopUpModal from '../../Common/DeleteModal'
import { toastifySuccess } from '../../Common/AlertMsg'
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api'
import { get_LocalStoreData } from '../../../redux/actions/Agency'
import { useDispatch } from 'react-redux'
import { get_ArresteeName_Data } from '../../../redux/actions/DropDownsData'
import Charges from './ArrestTab/Charges/ChargeTab/Home/Home'
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction'


const Arrest_Add_Up = () => {

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const arresteeNameData = useSelector((state) => state.DropDown.arresteeNameData);

    const { updateCount, EditArrestStatus, incidentCount, offenseChargeCount, setoffenseChargeCount, arrestChargeData, setEditArrestStatus, tabCountArrest, get_OffenseName_Data, get_Data_Arrest_Charge, get_Arrest_Count, changesStatus, arrestFilterData, get_Data_Arrest } = useContext(AgencyContext)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const carouselRef = useRef(null);
    const ArrestCount = incidentCount[0]?.ArrestCount || 0;

    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()
    const [showJuvinile, setShowJuvinile] = useState(false);
    const [showPoliceForce, setShowPoliceForce] = useState(false);

    const [ResetErrors, setResetErrors] = useState(false); // 'card' or 'list'
    const [viewType, setViewType] = useState('card'); // 'card' or 'list'
    const [addName, setAddName] = useState(true);
    const [isEnabled, setIsEnabled] = useState(false);
    const [Agencystatus, setAgencystatus] = useState('true');
    const [arrestID, setArrestID] = useState('');
    const [matchedAgency, setmatchedAgency] = useState('')
    const [offenseNameID, setoffenseNameID] = useState();
    const [delChargeID, setDelChargeID] = useState();
    const [loginPinID, setloginPinID,] = useState('');
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [possessionID, setPossessionID] = useState('');

    const [RestStatus, setRestStatus] = useState(false);
    const [Editval, setEditval] = useState([]);
    const [incExceDate, setincExceDate] = useState();
    const [ArresteeID, setArresteeID] = useState('');

    const [ListData, setListData] = useState([]);

    const [ChargeLocalArr, setChargeLocalArr] = useState(
        JSON.parse(sessionStorage.getItem('ChargeLocalData')) || []
    );
    const [isChargeDel, setIsChargeDel] = useState(false);
    // Lock Restrict
    const [isLocked, setIsLocked] = useState(false);
    const [permissionToUnlock, setPermissionToUnlock] = useState(false);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let ArrestID = query?.get('ArrestId');
    let IncID = query?.get('IncId');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ArrNo = query?.get("ArrNo");
    var ArrestSta = query?.get('ArrestSta');
    let MstPage = query?.get('page');
    var Name = query?.get("Name");
    var ChargeSta = query?.get('ChargeSta');
    var isFromDashboard = query?.get('isFromDashboard');
    var isNew = query?.get("isNew");
    var SideBarStatus = query?.get("SideBarStatus");
    var ArrestStatus = query?.get("ArrestStatus");
    var ChargeId = query?.get('ChargeId');
    let DecArrestId = 0, DecIncID = 0, DecChargeId = 0

    if (!ChargeId) ChargeId = 0;
    else DecChargeId = parseInt((ChargeId));

    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("A067", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        setoffenseChargeCount(arrestChargeData?.length)
    }, [arrestChargeData])

    useEffect(() => {
        if (ArresteeID) {
            get_List(ArresteeID)
        }
    }, [ArresteeID]);

    useEffect(() => {
        if (ArrestSta === 'true' || ArrestSta === true) {
            setStatus(true);
        } else if (ArrestSta === 'false' || ArrestSta === false) {
            setStatus(false); get_Arrest_Count();
        }
    }, [ArrestSta, localStoreData, updateCount]);

    useEffect(() => {
        if (isFromDashboard === 'true' || isFromDashboard === true) {
            setShowPoliceForce(true); setShowPage("PoliceForce")
        }
    }, [isFromDashboard]);

    const [currentTab, setCurrentTab] = useState('Arrest');

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Arrest-Home')) setCurrentTab('Arrest');
        if (pathname.includes('Arr-Charge-Home')) setCurrentTab('Charge');
    }, [window.location.pathname]);

    function isValidBase64(str) {
        const base64Pattern = /^[A-Za-z0-9+/=]+$/;
        return base64Pattern.test(str);
    }

    if (!ArrestID) {
        ArrestID = 0;
    } else {
        if (isValidBase64(ArrestID)) {
            try {
                let decodedString = atob(ArrestID);
                DecArrestId = parseInt(decodedString, 10);
            } catch (error) {
                console.error("Error in decoding Base64 or parsing to integer:", error);
                DecArrestId = 0;
            }
        } else {
            console.error("ArrestID is not a valid Base64 string");
            DecArrestId = 0;
        }
    }

    const columns = [
        {
            name: 'Arrest Number', selector: (row) => row.ArrestNumber, sortable: true
        },
        {
            name: 'Arrestee Name', selector: (row) => row.Arrestee_Name, sortable: true
        },
        {
            name: 'Arrest Type', selector: (row) => row.ArrestType_Description, sortable: true
        },
        {
            name: 'Arresting Agency', selector: (row) => row.Agency_Name, sortable: true
        },
        {
            name: 'Charges(Count)', selector: (row) => row.ChargeCount, sortable: true
        },
        {
            name: 'Juvenile Flag',
            selector: row => (
                <input type="checkbox" checked={row.IsJuvenileArrest === true} disabled />
            ),
            sortable: true
        },

        {
            name: 'Use of Force Flag', selector: (row) => row.PoliceForce_Description, sortable: true
        },
        {
            width: '200px', name: 'Supervisor Name',
            selector: (row) => <>{row?.Supervisor_Name ? row?.Supervisor_Name.substring(0, 60) : ''}{row?.Supervisor_Name?.length > 40 ? '  . . .' : null} </>,
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 10 }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", arrestFilterData, isLocked, true) ?
                            <span onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">                                    <i className="fa fa-trash"></i>
                            </span>
                            :
                            <></>
                            :
                            !isLockOrRestrictModule("Lock", arrestFilterData, isLocked, true) &&
                            <span onClick={() => setArrestID(row.ArrestID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">                                    <i className="fa fa-trash"></i>
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>
        }
    ]

    const GetSingleData = (ArrestID, MainIncidentID) => {
        const val = { 'ArrestID': ArrestID, 'PINID': '0', 'IncidentID': MainIncidentID }
        fetchPostData('Arrest/GetSingleData_Arrest', val).then((res) => {
            if (res.length > 0) {
                if (res[0]?.NIBRSClearanceID) { setincExceDate(new Date(res[0]?.NIBRSclearancedate)); }
                setEditval(res);
            } else {
                setEditval([]); setincExceDate('');
            }
        })
    }

    const set_Edit_Value = (row) => {
        get_List(row.ArresteeID); setArresteeID(row.ArresteeID)
        get_Arrest_Count(row.ArrestID); setRestStatus(true); GetSingleData(row.ArrestID, DecIncID)
        if (row?.PoliceForce_Description === "Yes") {
            setIsEnabled(true);
        } else {
            setIsEnabled(false);
        }
        if (row?.Agency_Name == matchedAgency?.Agency_Name) {
            setAgencystatus(true)
        } else {
            setAgencystatus(false);
        }
        if (changesStatus) {
            const modal = new window.bootstrap.Modal(document.getElementById('SaveModal'));
            modal.show();
        } else {
            if (row.ArrestID) {
                navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${row?.ArrestNumber}&Name=${row?.Arrestee_Name}&ArrestSta=${true}&ChargeSta=${false}&SideBarStatus=${!SideBarStatus}&ArrestStatus=${false}&isNew=${true} `);
                getPermissionLevelByLock(DecIncID, loginPinID)
                // setArrestID(row?.ArrestID); setActiveArrest(row?.ArrestID); setErrors(''); setStatesChangeStatus(false); setChangesStatus(false); setStatus(true);
                // GetSingleData(row.ArrestID, DecEIncID); get_Arrest_Count(row?.ArrestID);
            }
        }
    }


    const getPermissionLevelByLock = async (IncidentID, OfficerID) => {
        try {
            const res = await fetchPostData("Restricted/GetPermissionLevelBy_Lock", { 'IncidentID': IncidentID, 'OfficerID': OfficerID, 'ModuleName': "Incident", 'ID': 0 });
            if (res?.length > 0) {
                setIsLocked(res[0]?.IsLocked === true || res[0]?.IsLocked === 1 ? true : false);
                setPermissionToUnlock(res[0]?.IsUnLockPermission === true || res[0]?.IsUnLockPermission === 1 ? true : false);
            } else {
                setPermissionToUnlock(false); setIsLocked(false);
            }
        } catch (error) {
            console.error('There was an error!', error);
            setPermissionToUnlock(false); setIsLocked(false);
        }
    }

    const setStatusFalse = () => {
        if (MstPage === "MST-Arrest-Dash") {
            navigate(`/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}&isNew=${true}`);
            // reset_Value(); setErrors(''); setPossessionID(''); setPossenSinglData([]); setArrestID('');
            if (ArrestSta === 'true' || ArrestSta === true) {
                setStatus(true);
            } else if (ArrestSta === 'false' || ArrestSta === false) {
                setStatus(false); get_Arrest_Count();
            }
        } else {
            setShowPage('home')
            navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}&SideBarStatus=${false}&isNew=${true}`)
            // setErrors(''); setPossessionID(''); setPossenSinglData([]);
            // setActiveArrest(false); setRightGivenCode(false); setArrestID(''); reset_Value(); setIsEnabled(false);
            setRestStatus(false); setIsEnabled(false);
            if (ArrestSta === 'true' || ArrestSta === true) {
                setStatus(true);
            } else if (ArrestSta === 'false' || ArrestSta === false) {
                setStatus(false); get_Arrest_Count();
            }
        }
    }

    const conditionalRowStyles = [
        {
            when: row => row.ArrestID === DecArrestId,
            style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];

    const DeleteArrest = () => {
        const val = { 'ArrestID': arrestID, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('Arrest/Delete_Arrest', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_Data_Arrest(DecIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                // get_Incident_Count(DecIncID); 
                get_Arrest_Count(DecArrestId); setStatusFalse(); setRestStatus(false);
                //   Reset()
                navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${false}&isNew=${true}`)
                // if (DecIncID) {
                //     dispatch(get_ArresteeName_Data('', '', DecIncID, true, DecArrestId));
                // }
                sessionStorage.removeItem('ChargeLocalData');
            } else { console.log("Somthing Wrong"); }
        })
    }

    const DeleteCharge = () => {
        const chargeID = String(delChargeID);
        if (chargeID.startsWith('local-')) {
            const updatedLocalCharges = ChargeLocalArr.filter(charge => charge.ChargeID !== delChargeID);
            setChargeLocalArr(updatedLocalCharges);
            sessionStorage.setItem('ChargeLocalData', JSON.stringify(updatedLocalCharges));
            toastifySuccess('Deleted successfully.'); setDelChargeID(null); setIsChargeDel(false); get_Data_Arrest(DecIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
        } else {
            const val = { 'ChargeID': delChargeID, 'DeletedByUserFK': loginPinID };
            AddDeleteUpadate('ArrestCharge/Delete_ArrestCharge', val).then((res) => {
                if (res) {
                    const parsedData = JSON.parse(res.data);
                    const message = parsedData.Table[0].Message;
                    toastifySuccess(message);
                    get_Data_Arrest_Charge(DecArrestId); get_Data_Arrest(DecIncID, MstPage === "MST-Arrest-Dash" ? true : false, loginPinID);
                    get_Arrest_Count(arrestID); setIsChargeDel(false);
                } else {
                    console.log("Something went wrong");
                }
            });
        }
    };

    const DeleteOffense = () => {
        const val = {
            'NameOffenseID': offenseNameID, 'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('NameOffense/Delete_NameOffense', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_OffenseName_Data(possessionID)
            } else {
                console.log("res");
            }
        }).catch((err) => {
            console.log("🚀 ~Delete AddDeleteUpadate ~ err:", err);
        })
    }

    const get_List = (NameID) => {
        const val = { NameID: NameID, }
        fetchPostData('TabBasicInformation/NameInformation', val).then((res) => {
            if (res) {
                setListData(res);
            } else {
                setListData([]);
            }
        })
    }
    const handleCardClick = (row) => {
        console.log(row)
        if (!effectiveScreenPermission?.[0]?.Changeok) return;
        set_Edit_Value(row);
        setResetErrors(true);
    };
    return (
        <div className=" section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <Tab />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body py-1" >

                                {arrestFilterData && arrestFilterData.length > 0 && (
                                    <div className="card-carousel-container position-relative mb-1" >
                                        {/* Cards Wrapper */}
                                        {viewType === "card" ? (
                                            <div className="card-carousel" id="cardCarousel" ref={carouselRef}>
                                                {arrestFilterData.map((row, index) => (
                                                    <div
                                                        className="info-card position-relative d-flex align-items-center justify-content-between"
                                                        key={index}
                                                        // style={{ cursor: "pointer" }}
                                                        onClick={() => { handleCardClick(row); }}
                                                        style={{
                                                            cursor: "pointer",
                                                            borderLeft: "5px solid #2DEB7A",
                                                            backgroundColor: row.ArrestID === DecArrestId ? "#425971" : "#ffffff",
                                                            color: row.ArrestID === DecArrestId ? "#ffffff" : "#000000",
                                                        }}

                                                    >
                                                        {/* Card Content */}
                                                        <div>
                                                            <div>
                                                                <p className="mb-0 small"
                                                                    // style={{ color: "black" }}
                                                                    style={{
                                                                        color: row.ArrestID === DecArrestId ? "white" : "black",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >

                                                                    <strong>{row.ArrestNumber}</strong>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small">
                                                                    {/* {row.DateOfBirth ? getShowingWithOutTime(row.DateOfBirth) : ""} */}
                                                                    <strong>{row.Arrestee_Name}</strong>
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="mb-0 small">{row.ArrestType_Description}
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

                                                                                        onClick={() => {
                                                                                            set_Edit_Value(row);
                                                                                            setResetErrors(true);
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

                                                                            onClick={() => {
                                                                                set_Edit_Value(row);
                                                                                setResetErrors(true);
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
                                                                            effectiveScreenPermission[0]?.DeleteOK && !isLockOrRestrictModule("Lock", arrestFilterData, isLocked, true) ?
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
                                                                                        onClick={() => { setArrestID(row.ArrestID); }}
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
                                                                        {
                                                                            !isLockOrRestrictModule("Lock", arrestFilterData, isLocked, true) &&
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
                                                                                onClick={() => { setArrestID(row.ArrestID); }}
                                                                                title="Delete"
                                                                            >
                                                                                <i className="fa fa-trash"></i>
                                                                            </div>
                                                                        }
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
                                        ) : viewType === "list" ? (
                                            <div className="modal-table" style={{ flex: "0 0 95%", maxWidth: "95%" }}>
                                                {
                                                    MstPage != "MST-Arrest-Dash" &&
                                                    <DataTable
                                                        dense
                                                        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? arrestFilterData : [] : arrestFilterData}
                                                        columns={columns}
                                                        selectableRowsHighlight
                                                        highlightOnHover
                                                        responsive
                                                        pagination
                                                        onRowClicked={(row) => {
                                                            set_Edit_Value(row);
                                                        }}
                                                        fixedHeaderScrollHeight='100px'
                                                        conditionalRowStyles={conditionalRowStyles}
                                                        fixedHeader
                                                        persistTableHead={true}
                                                        customStyles={tableCustomStyles}
                                                        paginationPerPage={'100'}
                                                        paginationRowsPerPageOptions={[100, 150, 200, 500]}
                                                        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                                                    />
                                                }
                                            </div>
                                        ) : null}

                                        <div className="text-right ml-3">
                                            <div className="right-controls d-flex flex-column align-items-center gap-2">
                                                <div className="view-toggle d-flex flex-column gap-2">
                                                    {MstPage != "MST-Arrest-Dash" && (
                                                        <button className="btn btn-sm btn-success mb-2" onClick={() => { setStatusFalse(); setResetErrors(true); setIsLocked(false); }}  >
                                                            New
                                                        </button>
                                                    )}
                                                    {viewType === "card" && (
                                                        <button className="btn btn-sm btn-success" onClick={() => setViewType("list")}  >
                                                            Grid
                                                        </button>
                                                    )}
                                                    {viewType === "list" && (
                                                        <button className="btn btn-sm btn-success" onClick={() => setViewType("card")}  >
                                                            Card
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {
                                    (status || isNew === "true" || isNew === true || ArrestCount === 0 || ArrestCount === "0") && (
                                        <div className="row mt-1 " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                            <div className="col-12 name-tab">
                                                <ul className='nav nav-tabs'>
                                                    <Link
                                                        className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                                                        to={
                                                            MstPage ?
                                                                `/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${ArrestID}&Name=${Name}&IncId=${IncID}&ArrNo=${ArrNo}&ArrestSta=${ArrestSta}&ChargeSta=${true}&SideBarStatus=${false}&ArrestStatus=${false}&isNew=${true}`
                                                                :
                                                                `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&Name=${Name}&ArrestId=${ArrestID}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&ChargeSta=${ChargeSta}&SideBarStatus=${false}&ArrestStatus=${false}&isNew=${true}`
                                                        }

                                                        style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        aria-current="page"
                                                        onClick={() => { if (!changesStatus) { setShowPage('home') } }}>

                                                        {iconHome}
                                                    </Link>

                                                    <span
                                                        className={`nav-item ${showPage === 'Charges' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'Charges' ? 'Red' : tabCountArrest?.ChargeCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('Charges') }
                                                        }}>

                                                        Charge{`${tabCountArrest?.ChargeCount > 0 ? '(' + tabCountArrest?.ChargeCount + ')' : offenseChargeCount > 0 && showPage === 'Charges' ? '(' + offenseChargeCount + ')' : ''}`}
                                                    </span>

                                                    <span
                                                        className={`nav-item ${showPage === 'Warrant' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'Warrant' ? 'Red' : tabCountArrest?.NameWarrantCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('Warrant') }
                                                        }}>

                                                        Warrant{`${tabCountArrest?.NameWarrantCount > 0 ? '(' + tabCountArrest?.NameWarrantCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${showPage === 'Narratives' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'Narratives' ? 'Red' : tabCountArrest?.NarrativeCount > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('Narratives') }
                                                        }}>

                                                        Narrative{`${tabCountArrest?.NarrativeCount > 0 ? '(' + tabCountArrest?.NarrativeCount + ')' : ''}`}
                                                    </span>
                                                    <span
                                                        className={`nav-item ${showPage === 'MugShorts' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'MugShorts' ? 'Red' : tabCountArrest?.ArrestMugshots > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('MugShorts') }
                                                        }}>

                                                        {/* Mugshot{`${tabCountArrest?.ArrestMugshots > 0 ? '(' + tabCountArrest?.ArrestMugshots + ')' : ''}`} */}
                                                        Mugshot
                                                    </span>
                                                    <span
                                                        className={`nav-item ${showPage === 'Fingerprint' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'Fingerprint' ? 'Red' : tabCountArrest?.ArrestFingerPrints > 0 ? 'blue' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('Fingerprint') }
                                                        }}>

                                                        Fingerprint{`${tabCountArrest?.ArrestFingerPrints > 0 ? '(' + tabCountArrest?.ArrestFingerPrints + ')' : ''}`}
                                                    </span>
                                                    {/* <span
                                                className={`nav-item ${showPage === 'Property' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'Property' ? 'Red' : tabCountArrest?.PropertyCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('Property') }
                                                }}>

                                                Property{`${tabCountArrest?.PropertyCount > 0 ? '(' + tabCountArrest?.PropertyCount + ')' : ''}`}
                                            </span> */}
                                                    {/* <span
                                                className={`nav-item ${showPage === 'CriminalActivity' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showPage === 'CriminalActivity' ? 'Red' : tabCountArrest?.CriminalActivityCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                onClick={() => {
                                                    if (!changesStatus) { setShowPage('CriminalActivity') }
                                                }}>

                                                Criminal Activity{`${tabCountArrest?.CriminalActivityCount > 0 ? '(' + tabCountArrest?.CriminalActivityCount + ')' : ''}`}
                                            </span> */}
                                                    <span
                                                        className={`nav-item ${showPage === 'CourtInformation' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'CourtInformation' ? 'Red' : tabCountArrest?.CourtInformationCount > 0 ? 'blue' : '#000' }} aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('CourtInformation') }
                                                        }}>

                                                        Court{`${tabCountArrest?.CourtInformationCount > 0 ? '(' + tabCountArrest?.CourtInformationCount + ')' : ''}`}
                                                    </span>

                                                    {
                                                        showPoliceForce &&
                                                        <span
                                                            className={`nav-item ${showPage === 'PoliceForce' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'PoliceForce' ? 'Red' : tabCountArrest?.ArrsetPoliceForce > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => {
                                                                if (!changesStatus) { setShowPage('PoliceForce') }
                                                            }}>

                                                            Use Of Force {`${tabCountArrest?.ArrsetPoliceForce > 0 ? '(' + tabCountArrest?.ArrsetPoliceForce + ')' : ''}`}
                                                        </span>
                                                    }
                                                    {
                                                        showJuvinile &&
                                                        <span
                                                            className={`nav-item ${showPage === 'Juvenile' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                            data-toggle={changesStatus ? "modal" : "pill"}
                                                            data-target={changesStatus ? "#SaveModal" : ''}
                                                            style={{ color: showPage === 'Juvenile' ? 'Red' : tabCountArrest?.ArrestJuvenile > 0 ? 'blue' : '#000' }}
                                                            aria-current="page"
                                                            onClick={() => {
                                                                if (!changesStatus) { setShowPage('Juvenile') }
                                                            }}>

                                                            Juvenile {`${tabCountArrest?.ArrestJuvenile > 0 ? '(' + tabCountArrest?.ArrestJuvenile + ')' : ''}`}
                                                        </span>
                                                    }
                                                    <span
                                                        className={`nav-item ${showPage === 'AuditLog' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                        data-toggle={changesStatus ? "modal" : "pill"}
                                                        data-target={changesStatus ? "#SaveModal" : ''}
                                                        style={{ color: showPage === 'AuditLog' ? 'Red' : '#000' }}
                                                        aria-current="page"
                                                        onClick={() => {
                                                            if (!changesStatus) { setShowPage('AuditLog') }
                                                        }}>

                                                        Audit Log
                                                    </span>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    showPage === 'home' ?
                                        <Home {...{ isEnabled, Editval, incExceDate, ResetErrors, setResetErrors, setincExceDate, GetSingleData, setEditval, RestStatus, setIsEnabled, setStatus, arrestID, matchedAgency, setmatchedAgency, setArrestID, showPage, Agencystatus, setAgencystatus, setShowPage, offenseNameID, setoffenseNameID, status, setEditArrestStatus, showJuvinile, EditArrestStatus, setShowJuvinile, setShowPoliceForce, DecIncID, DecArrestId, delChargeID, isChargeDel, setIsChargeDel, setDelChargeID, ChargeLocalArr, setChargeLocalArr, possessionID, setPossessionID, get_List, isLocked, setIsLocked }} />
                                        :
                                        showPage === 'Property' ?
                                            <Property {...{ DecArrestId, DecIncID, }} />
                                            :
                                            showPage === 'Charges' ?
                                                <Charges {...{ DecArrestId, DecIncID, ListData, setListData, get_List, GetSingleData, ArresteeID, isLocked, setIsLocked, setShowPage }} />
                                                :
                                                showPage === 'Warrant' ?
                                                    <Warrant {...{ DecArrestId, DecIncID, ListData, get_List, isLocked, setIsLocked, setShowPage }} />
                                                    :
                                                    showPage === 'Narratives' ?
                                                        <Narratives {...{ DecArrestId, DecIncID, ListData, get_List, isLocked, setIsLocked, setShowPage }} />
                                                        :
                                                        showPage === 'MugShorts' ?
                                                            <MugShorts {...{ DecArrestId, DecIncID, ListData, get_List, isLocked, setIsLocked, setShowPage }} />
                                                            :
                                                            showPage === 'Fingerprint' ?
                                                                <FingerPrint {...{ DecArrestId, DecIncID, ListData, get_List, isLocked, setIsLocked, setShowPage }} />
                                                                :
                                                                showPage === 'CriminalActivity' ?
                                                                    <CriminalActivity {...{ DecArrestId, DecIncID, ListData, get_List, isLocked, setIsLocked, setShowPage }} />
                                                                    :
                                                                    showPage === 'CourtInformation' ?
                                                                        <CourtInformation {...{ DecArrestId, DecIncID, Editval, ListData, get_List, isLocked, setIsLocked, setShowPage }} />
                                                                        :
                                                                        showPage === 'PoliceForce' && showPoliceForce ?
                                                                            <PoliceForce {...{ DecArrestId, DecIncID, ListData, isLocked, setIsLocked, setShowPage }} />
                                                                            :
                                                                            showPage === 'Juvenile' ?
                                                                                <Juvenile {...{ DecArrestId, DecIncID, ListData, get_List, isLocked, setIsLocked, setShowPage }} />
                                                                                :
                                                                                showPage === 'AuditLog' ?
                                                                                    <Log
                                                                                        scrCode={'A092'}
                                                                                        ParentId={DecArrestId}
                                                                                        url={'Log/GetData_ArrestLog'}
                                                                                        para={'ArrestID'}
                                                                                    />
                                                                                    :
                                                                                    <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeletePopUpModal func={offenseNameID ? DeleteOffense : isChargeDel ? DeleteCharge : DeleteArrest} />
        </div>

    )
}

export default Arrest_Add_Up