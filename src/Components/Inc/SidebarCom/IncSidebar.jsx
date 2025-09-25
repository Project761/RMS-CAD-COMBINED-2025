import { useContext, useState, useEffect, useRef } from 'react'
import { AgencyContext } from '../../../Context/Agency/Index'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { base64ToString, Decrypt_Id_Name, stringToBase64 } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import StatusBar from '../StatusBar';
import { fetchPostData, fetchPostDataNibrs } from '../../hooks/Api';


const IncSidebar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const statusRef = useRef(null);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    // Agency ID
    const loginAgencyID = localStoreData?.AgencyID || '';

    const pathname = window.location.pathname;
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const missingPerData = useSelector((state) => state.MissingPerson.MissingPersonAllData);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    let DecEIncID = 0;
    const query = useQuery();
    let openPage = query?.get('page');
    var ModNo = query?.get('ModNo');
    var ArrNo = query?.get("ArrNo");
    var IncID = query?.get("IncId");
    var ArrestId = query?.get("ArrestId");
    var ArrestSta = query?.get('ArrestSta');
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    var ArrNo = query?.get("ArrNo");
    var Name = query?.get("Name");
    var MissPerId = query?.get("MissPerID");
    var MissPerSta = query?.get('MissPerSta');
    var FiID = query?.get("FiID");
    var ChargeSta = query?.get("ChargeSta");
    var SideBarStatus = query?.get("SideBarStatus");


    // if (!IncID) { IncID = 0; }
    // else { IncID = IncID; DecEIncID = parseInt((IncID)); }
    if (!IncID) IncID = 0;
    else DecEIncID = parseInt(base64ToString(IncID));

    if (!IncNo) IncNo = '';
    else IncNo = IncNo;

    if (!ArrestId) ArrestId = 0;
    else ArrestId = ArrestId;

    const { changesStatus, incidentCount, arrestData, updateCount, setUpdateCount, setIncStatus, get_Incident_Count, setActiveArrest, activeArrest, CaseStatus,

        validate_IncSideBar, incidentErrorStatus, offenseErrorStatus, nameErrorStatus, NameRelationshipError, narrativeApprovedStatus, PropErrorStatus, nibrsSideBarLoading, setNibrsSideBarLoading
    } = useContext(AgencyContext);


    const [plusMinus, setPlusMinus] = useState(false)
    const [expandList, setExpandList] = useState()
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [plusMinus3, setPlusMinus3] = useState(false)
    const [plusMinus4, setPlusMinus4] = useState(false)
    const [plusMinus5, setPlusMinus5] = useState(false)
    const [incidentID, setIncidentID] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [currentTab, setCurrentTab] = useState('Arrest');
    const [plusMinus2] = useState(false);

    // Incident Count
    const offenseCount = incidentCount[0]?.OffenseCount || 0;
    const NameCount = incidentCount[0]?.NameCount || 0;
    const PropertyCount = incidentCount[0]?.PropertyCount || 0;
    const ArrestCount = incidentCount[0]?.ArrestCount || 0;
    const VehicleCount = incidentCount[0]?.VehicleCount || 0;
    const OffenderCount = incidentCount[0]?.OffenderCount || 0;
    const VictimCount = incidentCount[0]?.VictimCount || 0;

    // // Error Status
    // const [incidentErrorStatus, setIncidentErrorStatus] = useState(false)
    // const [offenseErrorStatus, setOffenseErrorStatus] = useState(false)
    // const [nameErrorStatus, setNameErrorStatus] = useState(false)
    // const [NameRelationshipError, setNameRelationshipError] = useState(false);
    // const [narrativeApprovedStatus, setNarrativeApprovedStatus] = useState(false);
    // const [PropErrorStatus, setPropErrorStatus] = useState(false);

    // const [loading, setLoading] = useState(false);
    const [showStatus, setShowStatus] = useState(true);
    const [isUserClosed, setIsUserClosed] = useState(() => {
        const savedPreference = localStorage.getItem('statusBarClosed');
        return savedPreference === 'true';
    });


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (IncID && IncID != 0) {
            setIncidentID(IncID);
            if (DecEIncID) {
                get_Incident_Count(DecEIncID)
            }
        }
        else {
            setIncidentID('');
            setExpandList('')
        }
    }, [IncID]);

    useEffect(() => {
        if (localStoreData) {
            setAgencyName(localStoreData?.Agency_Name);
        }
    }, [localStoreData]);

    const callUtilityModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus1(!plusMinus1)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Warrant') {
            setPlusMinus5(!plusMinus5)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Vehicle') {
            setPlusMinus3(!plusMinus3)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Property') {
            setPlusMinus4(!plusMinus4)
            setExpandList(expandList === val ? '' : val)
        }
        if (type === 'Table') {
            setPlusMinus(!plusMinus); setExpandList(expandList === val ? '' : val);
        }
    }

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Arrest-Home')) setCurrentTab('Arrest');
        if (pathname.includes('Missing-Home')) setCurrentTab('MissingPerson');
    }, [window.location.pathname]);

    const currentLocation = window.location.pathname + window.location.search;

    const labels = [
        { className: 'geekmark', bgColor: '#ffe2a8', text: 'Required' },
        { className: 'geekmark1', bgColor: '#9d949436', text: 'Read Only' },
        { className: 'geekmark2', bgColor: '#d9e4f2', text: 'Lock' },
        { className: 'geekmark3', bgColor: '#F29A9A', text: 'TIBRS Field' },
    ];

    useEffect(() => {
        // console.log("🚀 ~ IncSidebar ~ showStatus:", showStatus)
        // console.log("🚀 ~ IncSidebar ~ DecEIncID:", DecEIncID)
        // console.log("🚀 ~ IncSidebar ~ IncNo:", IncNo)
        // console.log("🚀 ~ IncSidebar ~ loginAgencyID:", loginAgencyID)
        // console.log("🚀 ~ IncSidebar ~ pathname:", pathname)
        if (showStatus && DecEIncID && IncNo && loginAgencyID) {
            validate_IncSideBar(DecEIncID, IncNo, loginAgencyID)
        }
    }, [showStatus, DecEIncID, IncNo, loginAgencyID, pathname]);

    // // validate property/vehicle
    // const validate_IncSideBar_NibrsStatus = async (incidentID, incidentNumber, agencyID) => {
    //     // loading
    //     setLoading(true);
    //     // incident error
    //     setIncidentErrorStatus(false);
    //     // offense
    //     setOffenseErrorStatus(false);
    //     // name
    //     setNameErrorStatus(false);
    //     // Relation
    //     setNameRelationshipError(false);
    //     // narrative
    //     setNarrativeApprovedStatus(false);

    //     try {

    //         const [incidentError, offenseError, victimError, offenderError, DashBoardVicOffRelationStatus, propertyError] = await Promise.all([
    //             fetchPostDataNibrs('NIBRS/GetIncidentNIBRSError', { 'StrIncidentID': incidentID, 'StrIncidentNumber': incidentNumber, 'StrAgencyID': agencyID }),
    //             fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'CrimeId': 0, 'gIntAgencyID': loginAgencyID }),
    //             fetchPostDataNibrs('NIBRS/GetVictimNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'NameID': 0, 'gIntAgencyID': loginAgencyID }),
    //             fetchPostDataNibrs('NIBRS/GetOffenderNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'NameID': 0, 'gIntAgencyID': loginAgencyID }),
    //             fetchPostData('DashBoard/GetData_DashBoardIncidentStatus', { 'IncidentID': incidentID, }),
    //             fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'PropertyId': 0, 'gIntAgencyID': loginAgencyID }),
    //         ])

    //         if (incidentError?.Administrative) {
    //             const incObj = incidentError?.Administrative ? incidentError?.Administrative : [];

    //             setIncidentErrorStatus(true);

    //         } else {
    //             setIncidentErrorStatus(false);
    //         }


    //         if (offenseError) {
    //             const offenseObj = offenseError?.Offense ? offenseError?.Offense : [];
    //             if (offenseObj?.length > 0) {
    //                 setOffenseErrorStatus(true);
    //             } else {
    //                 setOffenseErrorStatus(false);
    //             }
    //         } else {
    //             setOffenseErrorStatus(false);
    //         }

    //         if (victimError || offenderError) {
    //             const victimObj = victimError?.Victim ? victimError?.Victim : [];
    //             const offenderObj = offenderError?.Offender ? offenderError?.Offender : [];

    //             if (victimObj?.length > 0 || offenderObj?.length > 0) {
    //                 setNameErrorStatus(true);
    //             } else {
    //                 setNameErrorStatus(false);
    //             }
    //         } else {
    //             setNameErrorStatus(false);
    //         }


    //         if (DashBoardVicOffRelationStatus?.length > 0) {
    //             const NameRelationship = DashBoardVicOffRelationStatus[0]?.NameRelationship;
    //             const Narrative = DashBoardVicOffRelationStatus[0]?.Narrative;
    //             const VictimOffense = DashBoardVicOffRelationStatus[0]?.VictimOffense;

    //             setNameRelationshipError(NameRelationship > 0);
    //             setNarrativeApprovedStatus(Narrative > 0);

    //         } else {
    //             setNameRelationshipError(false)
    //             setNarrativeApprovedStatus(false);

    //         }


    //         if (propertyError) {
    //             const proObj = propertyError?.Properties ? propertyError?.Properties : [];

    //             const VehArr = proObj?.filter((item) => item?.PropertyType === 'V');
    //             const PropArr = proObj?.filter((item) => item?.PropertyType !== 'V');

    //             if (PropArr?.length > 0 || VehArr?.length > 0) {
    //                 setPropErrorStatus(true);

    //             } else {
    //                 setPropErrorStatus(false);
    //             }

    //         } else {
    //             setPropErrorStatus(false);
    //         }

    //         setLoading(false);
    //     } catch (error) {
    //         console.log("🚀 ~ ValidateProperty ~ error:", error);
    //         setLoading(false);
    //         setIncidentErrorStatus(false);
    //     }
    // }


    return (
        <>
            {
                openPage ?
                    <>
                        <span className='agency-sidebar'>
                            <i className="fa fa-chevron-right " style={{ fontSize: '14px' }}></i>
                            <span className="ml-2" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                                {
                                    openPage === "MST-Property-Dash" ? `PRO-NO-${ModNo ? ModNo : ""}`
                                        :
                                        openPage === "MST-Vehicle-Dash" ? `VIC-NO-${ModNo ? ModNo : ""}`
                                            :
                                            openPage === "MST-Arrest-Dash" ? `ARST-NO-${ArrNo ? ArrNo : ""}`
                                                :
                                                openPage === "MST-Name-Dash" ? `NAME-NO-${ModNo ? ModNo : ""}` : ''
                                }
                                <p className='agency-name-sidebar'>{agencyName ? agencyName : ''}</p>
                            </span>
                        </span>
                    </>
                    :
                    <>
                        <Link
                            to={changesStatus ? `/Inc-Home?IncId=${IncID ? IncID : ''}&IncNo=${IncNo}&IncSta=${IncSta}` : `/Inc-Home?IncId=${IncID ? IncID : ''}&IncNo=${IncNo}&IncSta=${IncSta}`} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}

                            className='agency-sidebar' onClick={() => {
                                setActiveArrest(false);
                            }}>
                            <i className="fa fa-chevron-right " style={{ fontSize: '14px' }}></i>
                            <span className="ml-2" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                                INC-{IncNo ? IncNo : ""}
                                {/* INC-{!IncNo ? " " : IncNo} */}
                                <p className='agency-name-sidebar'>Case Status:-{CaseStatus ? CaseStatus : ''}</p>
                            </span>
                        </Link>
                        {/* Arrest */}
                        <li>
                            <div className="col-12 " style={{ pointerEvents: (IncSta === true || IncSta === 'true') ? '' : 'none', opacity: (IncSta === true || IncSta === 'true') ? '' : '0.5' }}>
                                <div className="row">
                                    <div className="col-10">
                                        <Link
                                            to={
                                                '' ? `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${''}&ArrestSta=${false}&SideBarStatus=${true}`
                                                    : changesStatus
                                                        ? currentLocation
                                                        : `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${''}&SideBarStatus=${true}`
                                            }

                                            data-toggle={changesStatus ? "modal" : ""}
                                            data-target={changesStatus ? "#SaveModal" : ''}
                                            className="" aria-expanded={plusMinus2}

                                            onClick={() => {
                                                setActiveArrest(false);
                                                if (IncID) {
                                                    callUtilityModules('List', 'Master Table2');
                                                }
                                            }}

                                        >
                                            {
                                                expandList === 'Master Table2' ?
                                                    <i className="fa fa-caret-down arrow-change"></i>
                                                    :
                                                    <i className="fa fa-caret-right arrow-change"></i>
                                            }
                                            <span>
                                                Arrest {`${incidentCount[0]?.ArrestCount > 0 ? '(' + incidentCount[0]?.ArrestCount + ')' : ''}`}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="col-2">
                                        <Link
                                            to={changesStatus ? currentLocation : `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${''}&ArrestSta=${false}&SideBarStatus=${true}`}

                                        >

                                            <span
                                                className='inc-plus '
                                                to={changesStatus ? '#' : `/Arrest-Home?IncId=${IncID}&ArrestId=${''}&ArrestSta=${false}&SideBarStatus=${true}`}
                                                data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: currentTab === 'Arrest' ? 'Red' : '#130e0e', fontWeight: '500' }}
                                                onKeyDown={''}
                                            >
                                                <i
                                                    onClick={() => {
                                                        navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${true}`)
                                                        setActiveArrest(false);
                                                        if (IncID) {
                                                            callUtilityModules('List', 'Master Table2');
                                                        }
                                                    }}
                                                    className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}>
                                                </i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table2'} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px', maxHeight: 'auto' }}>
                                {
                                    arrestData?.map((val) => (
                                        <li className={`ml-3 p-0 ${activeArrest === val?.ArrestID ? 'activeSide' : ''}`} key={val?.ArrestID}>
                                            <Link
                                                to={`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&ArrNo=${val?.ArrestNumber}&Name=${val?.Arrestee_Name}&IncSta=${IncSta}&ArrestId=${stringToBase64(val?.ArrestID)}&ArrestSta=${true}&ChargeSta=${false}&SideBarStatus=${true}`}
                                                onClick={() => {
                                                    setActiveArrest(val?.ArrestID);
                                                    navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&ArrNo=${val?.ArrestNumber}&Name=${val?.Arrestee_Name}&IncSta=${IncSta}&ArrestId=${stringToBase64(val?.ArrestID)}&ArrestSta=${true}&SideBarStatus=${true}`);
                                                    setIncStatus(true);
                                                    setUpdateCount(updateCount + 1);
                                                }}
                                            >
                                                <i className=" fa fa-arrow-right" ></i>
                                                <span className="m-0 p-0">{val?.ArrestNumber}</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                        {/* Missing Person */}
                        <li>
                            <div className="col-12 " style={{ pointerEvents: (IncSta === true || IncSta === 'true') ? '' : 'none', opacity: (IncSta === true || IncSta === 'true') ? '' : '0.5' }}>
                                <div className="row">
                                    <div className="col-10">
                                        <Link

                                            to={
                                                '' ? `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${''}&MissPerSta=${false}&MissPerPg=home`
                                                    : changesStatus
                                                        ? currentLocation
                                                        : `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${''}&MissPerSta=${false}&MissPerPg=home`
                                            }
                                            data-toggle={changesStatus ? "modal" : ""}
                                            data-target={changesStatus ? "#SaveModal" : ''}
                                            className="" aria-expanded={plusMinus2}

                                            onClick={() => {
                                                setActiveArrest(false);
                                                if (IncID) {
                                                    callUtilityModules('List', 'Master Table4');
                                                }
                                            }}
                                        >
                                            {
                                                expandList === 'Master Table4' ?
                                                    <i className="fa fa-caret-down arrow-change"></i>
                                                    :
                                                    <i className="fa fa-caret-right arrow-change"></i>
                                            }
                                            <span>
                                                Missing Person{`${incidentCount[0]?.MissingPersonCount > 0 ? '(' + incidentCount[0]?.MissingPersonCount + ')' : ''}`}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="col-2">
                                        <Link
                                            to={changesStatus ? currentLocation : `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${''}&MissPerSta=${false}`}

                                        >

                                            <span
                                                className='inc-plus '
                                                to={changesStatus ? '#' : `/Missing-Home?IncId=${IncID}&MissPerID=${''}&MissPerSta=${false}`}
                                                data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: currentTab === 'Arrest' ? 'Red' : '#130e0e', fontWeight: '500' }}

                                                onKeyDown={''}

                                            >
                                                <i
                                                    onClick={() => {
                                                        setActiveArrest(false);
                                                        navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${('')}&MissPerSta=${false}&ChargeSta=${false}`)
                                                        if (IncID) {
                                                            callUtilityModules('List', 'Master Table4');
                                                        }
                                                    }}
                                                    className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}>
                                                </i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table4'} className={`${expandList === 'Master Table4' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px', maxHeight: 'auto' }}>
                                {
                                    missingPerData?.map((val) => (
                                        <li className={`ml-3 p-0 ${activeArrest === val?.MissingPersonID ? 'activeSide' : ''}`} key={val?.MissingPersonID}>
                                            <Link
                                                to={`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${stringToBase64(val?.MissingPersonID)}&MissPerSta=${true}&MissPerPg=home`}
                                                onClick={() => {
                                                    navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${stringToBase64(val?.MissingPersonID)}&MissPerSta=${true}&MissPerPg=home`)
                                                    setIncStatus(true);
                                                    setUpdateCount(updateCount + 1)
                                                    setActiveArrest(val?.MissingPersonID);
                                                }}
                                            >
                                                <i className=" fa fa-arrow-right" ></i>
                                                <span className="m-0 p-0">{val?.MissingPersonNumber}</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                        {/* Search */}
                        <li>
                            <div className="col-12 " style={{ pointerEvents: (IncSta === true || IncSta === 'true') ? '' : 'none', opacity: (IncSta === true || IncSta === 'true') ? '' : '0.5' }}>
                                <div className="row">
                                    <div className="col-10">
                                        <Link
                                            to={
                                                '' ? `/incident-advanceSearch?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`
                                                    : changesStatus
                                                        ? currentLocation
                                                        : `/incident-advanceSearch?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`

                                            }
                                            data-toggle={changesStatus ? "modal" : ""}
                                            data-target={changesStatus ? "#SaveModal" : ''}
                                            className=""
                                            aria-expanded={plusMinus2}
                                            onClick={() => incidentID ? callUtilityModules('List', 'Master Table3') : ''}
                                        >
                                            {expandList === 'Master Table3' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
                                            <span>Search </span>
                                        </Link>
                                    </div>
                                    <div className="col-2">
                                        <Link
                                            to={changesStatus ? currentLocation : `/incident-advanceSearch?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`
                                            }
                                        >
                                            <span
                                                className='inc-plus'
                                                data-toggle={changesStatus ? "modal" : ""}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ marginLeft: '-10px', cursor: 'pointer' }}
                                                onKeyDown={''}
                                            >
                                                <i className="fa fa-search btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </li>

                        {
                            IncSta === true || IncSta === "true" ?
                                <>
                                    <li className='position-relative'>
                                        <hr className='incSiderbar_Hr mt-1 w-100' />
                                        <StatusBar
                                            ref={statusRef}
                                            loading={nibrsSideBarLoading}

                                            incidentErrorStatus={incidentErrorStatus}

                                            offenseCount={offenseCount}
                                            offenseErrorStatus={offenseErrorStatus}

                                            NameCount={NameCount}
                                            nameErrorStatus={nameErrorStatus}

                                            NameRelationshipError={NameRelationshipError}
                                            narrativeApprovedStatus={narrativeApprovedStatus}

                                            PropertyCount={PropertyCount}
                                            PropErrorStatus={PropErrorStatus}

                                        />
                                    </li>

                                </>
                                :
                                <></>
                        }


                        {/* <div className="sidebar-footer">
                            <div className="field-identify-color mt-1 ml-4">
                                <h6 className="mb-1 mt-2" >Field Color</h6>
                                <div className="d-flex flex-column mt-3 ml-4">
                                    {labels?.map(({ className, bgColor, text }) => (
                                        <div className="d-flex mt-2" key={text}>
                                            <span className={`${className} mt-2`}></span>
                                            <span
                                                className="ml-2"
                                                style={{
                                                    border: '1px solid', backgroundColor: bgColor,
                                                    padding: '4px', borderRadius: '4px', display: 'inline-block',
                                                    transition: 'color 0.3s ease', textAlign: "center",
                                                    fontWeight: 600, fontSize: '14px', minWidth: "90px"
                                                }}
                                            >
                                                {text}
                                            </span>
                                        </div>
                                    ))}


                                </div>
                            </div>
                        </div> */}
                    </>
            }
        </>
    )
}

export default IncSidebar











































// import { useContext, useState, useEffect } from 'react'
// import { AgencyContext } from '../../../Context/Agency/Index'
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { Decrypt_Id_Name, stringToBase64 } from '../../Common/Utility';
// import { get_LocalStoreData } from '../../../redux/actions/Agency';

// const IncSidebar = () => {

//     const navigate = useNavigate()
//     const dispatch = useDispatch();
//     const localStoreData = useSelector((state) => state.Agency.localStoreData);
//     const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
//     const missingPerData = useSelector((state) => state.MissingPerson.MissingPersonAllData);

//     const { changesStatus, incidentCount, arrestData, updateCount, setUpdateCount, setIncStatus, get_Incident_Count, setActiveArrest, activeArrest } = useContext(AgencyContext);
//     const [plusMinus, setPlusMinus] = useState(false)
//     const [expandList, setExpandList] = useState()
//     const [plusMinus1, setPlusMinus1] = useState(false)
//     const [plusMinus3, setPlusMinus3] = useState(false)
//     const [plusMinus4, setPlusMinus4] = useState(false)
//     const [plusMinus5, setPlusMinus5] = useState(false)
//     const [incidentID, setIncidentID] = useState('');
//     const [agencyName, setAgencyName] = useState('');
//     const [currentTab, setCurrentTab] = useState('Arrest');
//     const [plusMinus2] = useState(false)

//     const useQuery = () => {
//         const params = new URLSearchParams(useLocation().search);
//         return {
//             get: (param) => params.get(param)
//         };
//     };

//     let DecEIncID = 0;
//     const query = useQuery();
//     let openPage = query?.get('page');
//     var ModNo = query?.get('ModNo');
//     var ArrNo = query?.get("ArrNo");
//     var IncID = query?.get("IncId");
//     var ArrestId = query?.get("ArrestId");
//     var ArrestSta = query?.get('ArrestSta');
//     var IncNo = query?.get("IncNo");
//     var IncSta = query?.get("IncSta");
//     var ArrNo = query?.get("ArrNo");
//     var Name = query?.get("Name");
//     var MissPerId = query?.get("MissPerID");
//     var MissPerSta = query?.get('MissPerSta');
//     var FiID = query?.get("FiID");
//     var ChargeSta = query?.get("ChargeSta");
//     var SideBarStatus = query?.get("SideBarStatus");


//     if (!IncID) { IncID = 0; }
//     else { IncID = IncID; DecEIncID = parseInt((IncID)); }

//     if (!IncNo) IncNo = '';
//     else IncNo = IncNo;

//     if (!ArrestId) ArrestId = 0;
//     else ArrestId = ArrestId;

//     useEffect(() => {
//         if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
//             if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
//         }
//     }, []);

//     useEffect(() => {
//         if (IncID && IncID != 0) {
//             setIncidentID(IncID);
//             if (DecEIncID) {
//                 get_Incident_Count(DecEIncID)
//             }
//         }
//         else {
//             setIncidentID('');
//             setExpandList('')
//         }
//     }, [IncID]);

//     useEffect(() => {
//         if (localStoreData) {
//             setAgencyName(localStoreData?.Agency_Name);
//         }
//     }, [localStoreData]);

//     const callUtilityModules = (type, val) => {
//         if (type === 'List') {
//             setPlusMinus1(!plusMinus1)
//             setExpandList(expandList === val ? '' : val)
//         }
//         if (type === 'Warrant') {
//             setPlusMinus5(!plusMinus5)
//             setExpandList(expandList === val ? '' : val)
//         }
//         if (type === 'Vehicle') {
//             setPlusMinus3(!plusMinus3)
//             setExpandList(expandList === val ? '' : val)
//         }
//         if (type === 'Property') {
//             setPlusMinus4(!plusMinus4)
//             setExpandList(expandList === val ? '' : val)
//         }
//         if (type === 'Table') {
//             setPlusMinus(!plusMinus); setExpandList(expandList === val ? '' : val);
//         }
//     }


//     useEffect(() => {
//         const pathname = window.location.pathname;
//         if (pathname.includes('Arrest-Home')) setCurrentTab('Arrest');
//         if (pathname.includes('Missing-Home')) setCurrentTab('MissingPerson');
//     }, [window.location.pathname]);

//     const currentLocation = window.location.pathname + window.location.search;


//     const labels = [
//         { className: 'geekmark', bgColor: '#ffe2a8', text: 'Required' },
//         { className: 'geekmark1', bgColor: '#9d949436', text: 'Read Only' },
//         { className: 'geekmark2', bgColor: '#d9e4f2', text: 'Lock' },
//         { className: 'geekmark3', bgColor: '#F29A9A', text: 'TIBRS Field' },
//     ];



//     return (
//         <>
//             {
//                 openPage ?
//                     <>
//                         <span className='agency-sidebar'>
//                             <i className="fa fa-chevron-right " style={{ fontSize: '14px' }}></i>
//                             <span className="ml-2" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
//                                 {
//                                     openPage === "MST-Property-Dash" ? `PRO-NO-${ModNo ? ModNo : ""}`
//                                         :
//                                         openPage === "MST-Vehicle-Dash" ? `VIC-NO-${ModNo ? ModNo : ""}`
//                                             :
//                                             openPage === "MST-Arrest-Dash" ? `ARST-NO-${ArrNo ? ArrNo : ""}`
//                                                 :
//                                                 openPage === "MST-Name-Dash" ? `NAME-NO-${ModNo ? ModNo : ""}` : ''
//                                 }
//                                 <p className='agency-name-sidebar'>{agencyName ? agencyName : ''}</p>
//                             </span>
//                         </span>
//                     </>
//                     :
//                     <>
//                         <Link
//                             to={changesStatus ? `/Inc-Home?IncId=${IncID ? IncID : ''}&IncNo=${IncNo}&IncSta=${IncSta}` : `/Inc-Home?IncId=${IncID ? IncID : ''}&IncNo=${IncNo}&IncSta=${IncSta}`} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}

//                             className='agency-sidebar' onClick={() => {
//                                 setActiveArrest(false);
//                             }}>
//                             <i className="fa fa-chevron-right " style={{ fontSize: '14px' }}></i>
//                             <span className="ml-2" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
//                                 INC-{IncNo ? IncNo : ""}
//                                 {/* INC-{!IncNo ? " " : IncNo} */}
//                                 <p className='agency-name-sidebar'>{agencyName ? agencyName : ''}</p>
//                             </span>
//                         </Link>
//                         {/* Arrest */}
//                         <li>
//                             <div className="col-12 " style={{ pointerEvents: (IncSta === true || IncSta === 'true') ? '' : 'none', opacity: (IncSta === true || IncSta === 'true') ? '' : '0.5' }}>
//                                 <div className="row">
//                                     <div className="col-10">
//                                         <Link
//                                             to={
//                                                 '' ? `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${''}&ArrestSta=${false}&SideBarStatus=${true}`
//                                                     : changesStatus
//                                                         ? currentLocation
//                                                         : `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${''}&SideBarStatus=${true}`
//                                             }

//                                             data-toggle={changesStatus ? "modal" : ""}
//                                             data-target={changesStatus ? "#SaveModal" : ''}
//                                             className="" aria-expanded={plusMinus2}

//                                             onClick={() => {
//                                                 setActiveArrest(false);
//                                                 if (IncID) {
//                                                     callUtilityModules('List', 'Master Table2');
//                                                 }
//                                             }}

//                                         >
//                                             {
//                                                 expandList === 'Master Table2' ?
//                                                     <i className="fa fa-caret-down arrow-change"></i>
//                                                     :
//                                                     <i className="fa fa-caret-right arrow-change"></i>
//                                             }
//                                             <span>
//                                                 Arrest {`${incidentCount[0]?.ArrestCount > 0 ? '(' + incidentCount[0]?.ArrestCount + ')' : ''}`}
//                                             </span>
//                                         </Link>
//                                     </div>
//                                     <div className="col-2">
//                                         <Link
//                                             to={changesStatus ? currentLocation : `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${''}&ArrestSta=${false}&SideBarStatus=${true}`}

//                                         >

//                                             <span
//                                                 className='inc-plus '
//                                                 to={changesStatus ? '#' : `/Arrest-Home?IncId=${IncID}&ArrestId=${''}&ArrestSta=${false}&SideBarStatus=${true}`}
//                                                 data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}
//                                                 style={{ color: currentTab === 'Arrest' ? 'Red' : '#130e0e', fontWeight: '500' }}
//                                                 onKeyDown={''}
//                                             >
//                                                 <i
//                                                     onClick={() => {
//                                                         navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${('')}&ArrestSta=${false}&ChargeSta=${false}&SideBarStatus=${true}`)
//                                                         setActiveArrest(false);
//                                                         if (IncID) {
//                                                             callUtilityModules('List', 'Master Table2');
//                                                         }
//                                                     }}
//                                                     className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}>
//                                                 </i>
//                                             </span>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                             <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table2'} className={`${expandList === 'Master Table2' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px', maxHeight: 'auto' }}>
//                                 {
//                                     arrestData?.map((val) => (
//                                         <li className={`ml-3 p-0 ${activeArrest === val?.ArrestID ? 'activeSide' : ''}`} key={val?.ArrestID}>
//                                             <Link
//                                                 to={`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&ArrNo=${val?.ArrestNumber}&Name=${val?.Arrestee_Name}&IncSta=${IncSta}&ArrestId=${stringToBase64(val?.ArrestID)}&ArrestSta=${true}&ChargeSta=${false}&SideBarStatus=${true}`}
//                                                 onClick={() => {
//                                                     setActiveArrest(val?.ArrestID);
//                                                     navigate(`/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&ArrNo=${val?.ArrestNumber}&Name=${val?.Arrestee_Name}&IncSta=${IncSta}&ArrestId=${stringToBase64(val?.ArrestID)}&ArrestSta=${true}&SideBarStatus=${true}`);
//                                                     setIncStatus(true);
//                                                     setUpdateCount(updateCount + 1);
//                                                 }}
//                                             >
//                                                 <i className=" fa fa-arrow-right" ></i>
//                                                 <span className="m-0 p-0">{val?.ArrestNumber}</span>
//                                             </Link>
//                                         </li>
//                                     ))
//                                 }
//                             </ul>
//                         </li>
//                         {/* Missing Person */}
//                         <li>
//                             <div className="col-12 " style={{ pointerEvents: (IncSta === true || IncSta === 'true') ? '' : 'none', opacity: (IncSta === true || IncSta === 'true') ? '' : '0.5' }}>
//                                 <div className="row">
//                                     <div className="col-10">
//                                         <Link

//                                             to={
//                                                 '' ? `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${''}&MissPerSta=${false}&MissPerPg=home`
//                                                     : changesStatus
//                                                         ? currentLocation
//                                                         : `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${''}&MissPerSta=${false}&MissPerPg=home`
//                                             }
//                                             data-toggle={changesStatus ? "modal" : ""}
//                                             data-target={changesStatus ? "#SaveModal" : ''}
//                                             className="" aria-expanded={plusMinus2}

//                                             onClick={() => {
//                                                 setActiveArrest(false);
//                                                 if (IncID) {
//                                                     callUtilityModules('List', 'Master Table4');
//                                                 }
//                                             }}
//                                         >
//                                             {
//                                                 expandList === 'Master Table4' ?
//                                                     <i className="fa fa-caret-down arrow-change"></i>
//                                                     :
//                                                     <i className="fa fa-caret-right arrow-change"></i>
//                                             }
//                                             <span>
//                                                 Missing Person{`${incidentCount[0]?.MissingPersonCount > 0 ? '(' + incidentCount[0]?.MissingPersonCount + ')' : ''}`}
//                                             </span>
//                                         </Link>
//                                     </div>
//                                     <div className="col-2">
//                                         <Link
//                                             to={changesStatus ? currentLocation : `/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${''}&MissPerSta=${false}`}

//                                         >

//                                             <span
//                                                 className='inc-plus '
//                                                 to={changesStatus ? '#' : `/Missing-Home?IncId=${IncID}&MissPerID=${''}&MissPerSta=${false}`}
//                                                 data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}
//                                                 style={{ color: currentTab === 'Arrest' ? 'Red' : '#130e0e', fontWeight: '500' }}

//                                                 onKeyDown={''}

//                                             >
//                                                 <i
//                                                     onClick={() => {
//                                                         setActiveArrest(false);
//                                                         navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${('')}&MissPerSta=${false}&ChargeSta=${false}`)
//                                                         if (IncID) {
//                                                             callUtilityModules('List', 'Master Table4');
//                                                         }
//                                                     }}
//                                                     className="fa fa-plus btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}>
//                                                 </i>
//                                             </span>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                             <ul id="menu" role="menu" aria-expanded={expandList === 'Master Table4'} className={`${expandList === 'Master Table4' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px', maxHeight: 'auto' }}>
//                                 {
//                                     missingPerData?.map((val) => (
//                                         <li className={`ml-3 p-0 ${activeArrest === val?.MissingPersonID ? 'activeSide' : ''}`} key={val?.MissingPersonID}>
//                                             <Link
//                                                 to={`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${stringToBase64(val?.MissingPersonID)}&MissPerSta=${true}&MissPerPg=home`}
//                                                 onClick={() => {
//                                                     navigate(`/Missing-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&MissPerID=${stringToBase64(val?.MissingPersonID)}&MissPerSta=${true}&MissPerPg=home`)
//                                                     setIncStatus(true);
//                                                     setUpdateCount(updateCount + 1)
//                                                     setActiveArrest(val?.MissingPersonID);
//                                                 }}
//                                             >
//                                                 <i className=" fa fa-arrow-right" ></i>
//                                                 <span className="m-0 p-0">{val?.MissingPersonNumber}</span>
//                                             </Link>
//                                         </li>
//                                     ))
//                                 }
//                             </ul>
//                         </li>
//                         {/* Search */}
//                         <li>
//                             <div className="col-12 " style={{ pointerEvents: (IncSta === true || IncSta === 'true') ? '' : 'none', opacity: (IncSta === true || IncSta === 'true') ? '' : '0.5' }}>
//                                 <div className="row">
//                                     <div className="col-10">
//                                         <Link
//                                             to={
//                                                 '' ? `/incident-advanceSearch?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`
//                                                     : changesStatus
//                                                         ? currentLocation
//                                                         : `/incident-advanceSearch?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`

//                                             }
//                                             data-toggle={changesStatus ? "modal" : ""}
//                                             data-target={changesStatus ? "#SaveModal" : ''}
//                                             className=""
//                                             aria-expanded={plusMinus2}
//                                             onClick={() => incidentID ? callUtilityModules('List', 'Master Table3') : ''}
//                                         >
//                                             {expandList === 'Master Table3' ? <i className="fa fa-caret-down arrow-change"></i> : <i className="fa fa-caret-right arrow-change"></i>}
//                                             <span>Search </span>
//                                         </Link>
//                                     </div>
//                                     <div className="col-2">
//                                         <Link
//                                             to={changesStatus ? currentLocation : `/incident-advanceSearch?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`
//                                             }
//                                         >
//                                             <span
//                                                 className='inc-plus'
//                                                 data-toggle={changesStatus ? "modal" : ""}
//                                                 data-target={changesStatus ? "#SaveModal" : ''}
//                                                 style={{ marginLeft: '-10px', cursor: 'pointer' }}
//                                                 onKeyDown={''}
//                                             >
//                                                 <i className="fa fa-search btn btn-sm bg-line text-white" style={{ fontSize: '10px' }}></i>
//                                             </span>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </li>
//                         <div className="sidebar-footer">

//                             <div className="field-identify-color mt-1 ml-4">
//                                 <h6 className="mb-1 mt-2" >Field Color</h6>
//                                 <div className="d-flex flex-column mt-3 ml-4">

//                                     {/* <div className="d-flex ">
//                                         <span className="geekmark mt-2"></span>
//                                         <span className='ml-2' style={{
//                                             border: '1px solid ', backgroundColor: '#ffe2a8',
//                                             padding: '4px', borderRadius: '4px', display: 'inline-block',
//                                             transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
//                                         }}>Required</span>
//                                     </div>

//                                     <div className="d-flex mt-2">
//                                         <span className="geekmark1 mt-2 "></span>
//                                         <span className='ml-2' style={{
//                                             border: '1px solid ', backgroundColor: '#9d949436',
//                                             padding: '4px', borderRadius: '4px', display: 'inline-block',
//                                             transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
//                                         }}>Read Only</span>
//                                     </div>

//                                     <div className="d-flex mt-2">
//                                         <span className="geekmark2 mt-2"></span>
//                                         <span className='ml-2' style={{
//                                             border: '1px solid ', backgroundColor: '#d9e4f2',
//                                             padding: '4px', borderRadius: '4px', display: 'inline-block',
//                                             transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
//                                         }}>Lock</span>
//                                     </div>

//                                     <div className="d-flex mt-2">
//                                         <span className="geekmark3 mt-2"></span>
//                                         <span className='ml-2' style={{
//                                             border: '1px solid ', backgroundColor: '#f29a9a',
//                                             padding: '4px', borderRadius: '4px', display: 'inline-block',
//                                             transition: 'color 0.3s ease', fontWeight: 'bold', fontSize: '14px',
//                                         }}>TIBRS Field</span>
//                                     </div> */}

//                                     {labels?.map(({ className, bgColor, text }) => (
//                                         <div className="d-flex mt-2" key={text}>
//                                             <span className={`${className} mt-2`}></span>
//                                             <span
//                                                 className="ml-2"
//                                                 style={{
//                                                     border: '1px solid', backgroundColor: bgColor,
//                                                     padding: '4px', borderRadius: '4px', display: 'inline-block',
//                                                     transition: 'color 0.3s ease', textAlign: "center",
//                                                     fontWeight: 600, fontSize: '14px', minWidth: "90px"
//                                                 }}
//                                             >
//                                                 {text}
//                                             </span>
//                                         </div>
//                                     ))}


//                                 </div>
//                             </div>
//                         </div>
//                     </>
//             }
//         </>
//     )
// }

// export default IncSidebar

