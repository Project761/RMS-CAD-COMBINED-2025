import React, { useContext, useEffect, useState } from 'react';
import { AgencyContext } from '../../../Context/Agency/Index';
import Tab from '../../Utility/Tab/Tab';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Pin from './IncidentTab/PIN/Pin';
import TypeOfSecurity from './IncidentTab/TypeOfSecurity/TypeOfSecurity';
import Narrative from './IncidentTab/NarrativesCom/Narrative';
import LocationHistory from './IncidentTab/LocationHistory/LocationHistory';
import IncidentHome from './IncidentTab/IncidentHome';
import Log from '../Log/Log';
import { useDispatch } from 'react-redux';
import { Decrypt_Id_Name, DecryptedList, base64ToString } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useSelector } from 'react-redux';
import PoliceForceIncident from './IncidentTab/PoliceForceIncident/PoliceForceIncident';
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LockRestrictModule from '../../Common/LockRestrictModule';
import { faLock, faUnlock, faBan, } from "@fortawesome/free-solid-svg-icons";
import { fetchPostData } from '../../hooks/Api';

const IncidentTab = () => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var IncSta = query?.get("IncSta");
    const tabParam = query.get("tab");
    var isFromDashboard = query?.get('isFromDashboard');


    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const navigate = useNavigate()
    const { changesStatus, tabCount, OfficerApprovCount } = useContext(AgencyContext);
    const [status, setStatus] = useState();
    const [showIncPage, setShowIncPage] = useState('home');
    const [incidentReportedDate, setIncidentReportedDate] = useState(null);
    const [incidentId, setIncidentId] = useState('')
    const [isPreviewNormalReport, setIsPreviewNormalReport] = useState(true);
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const [showPoliceForce, setShowPoliceForce] = useState(false);
    const [showLockModal, setShowLockModal] = useState(false);
    const [openModule, setOpenModule] = useState('');

    const [permissionToUnlock, setPermissionToUnlock] = useState(false);
    const [isLocked, setIsLocked] = useState(false);

    const [isRestricted, setIsRestricted] = useState(false);
    const [permissionToUnrestrict, setPermissionToUnrestrict] = useState(false);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (IncSta === true || IncSta === 'true') { setStatus(true); }
        else { setStatus(false); }
        setShowIncPage('home');
    }, [IncSta]);

    useEffect(() => {
        if (isFromDashboard === 'true' || isFromDashboard === true) {
            setShowPoliceForce(true);
            setShowIncPage("PoliceForce")
        }
    }, [isFromDashboard]);

    useEffect(() => {
        if (IncID) {
            setIncidentId(base64ToString(IncID));
            if (IncSta === true || IncSta === 'true') {
                getPermissionLevelByLock(base64ToString(IncID), localStoreData?.PINID);
                getPermissionLevelByRestrict(base64ToString(IncID), localStoreData?.PINID);
            }
        }
    }, [IncID, IncSta]);

    useEffect(() => {
        if (tabParam) setShowIncPage(tabParam);
    }, [tabParam]);


    // api/Restricted/GetPermissionLevelBy_Lock
    // IncidentID
    // OfficerID

    const getPermissionLevelByLock = async (IncidentID, OfficerID) => {
        try {
            const res = await fetchPostData("Restricted/GetPermissionLevelBy_Lock", { 'IncidentID': IncidentID, 'OfficerID': OfficerID, 'ModuleName': "Incident", 'ID': 0 });
            console.log("🚀 ~ getPermissionLevelByLock ~ res:", res)
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

    const getPermissionLevelByRestrict = async (IncidentID, OfficerID) => {
        try {
            const res = await fetchPostData("Restricted/GetPermissionLevelBy_Restricted", { IncidentID, OfficerID, 'ModuleName': "Incident", 'ID': 0 });
            console.log("🚀 ~ getPermissionLevelByRestrict ~ res:", res)
            if (res?.length > 0) {
                setIsRestricted(res[0]?.IsRestricted === true || res[0]?.IsRestricted === 1 ? true : false);
                setPermissionToUnrestrict(res[0]?.IsUnRestrictPermission === true || res[0]?.IsUnRestrictPermission === 1 ? true : false);

            } else {
                setPermissionToUnrestrict(false);
                setIsRestricted(false);

            }
        } catch (error) {
            console.error('There was an error!', error);
            setPermissionToUnrestrict(false);
            setIsRestricted(false);
        }
    }

    // Lock and Unlock
    // api/Restricted/UpdateIncidentLockStatus
    // IncidentID
    // ModifiedByUserFK
    // IsLocked
    // LockLevel
    // LockPINID
    // LockDate

    // api/Restricted/GetPermissionLevelBy_Lock
    // IncidentID
    // OfficerID



    // api/Restricted/UpdateIncidentRestrictedStatus
    // IncidentID
    // ModifiedByUserFK
    // IsRestricted
    // RestrictLevel
    // RestrictPINID
    // RestrictDate

    // api/Restricted/GetPermissionLevelBy_Restricted
    // IncidentID
    // OfficerID

    return (
        <div className="section-body view_page_design pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <Tab />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card ">
                            <div className="card-body" >
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12 incident-tab incident-tab_Lock">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showIncPage === 'home' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                to={`/Inc-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&isIncLocked=${isLocked}&isIncRestricted=${isRestricted}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showIncPage === 'home' ? 'Red' : '#000', }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowIncPage('home') }}
                                            >
                                                {iconHome}
                                            </Link>
                                            <span
                                                className={`nav-item ${showIncPage === 'Officer Activity' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showIncPage === 'Officer Activity' ? 'Red' : OfficerApprovCount === true ? 'blue' : '#000' }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowIncPage('Officer Activity') }}
                                            >
                                                Officer Activity
                                            </span>
                                            {/* <span
                                                className={`nav-item ${showIncPage === 'Report' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showIncPage === 'Report' ? 'Red' : tabCount?.NarrativeCount > 0 ? 'blue' : '#000', }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowIncPage('Report') }}
                                            >
                                                Report{`${tabCount?.NarrativeCount > 0 ? '(' + tabCount?.NarrativeCount + ')' : ''}`}
                                            </span> */}
                                            {
                                                showPoliceForce &&
                                                <span
                                                    className={`nav-item ${showIncPage === 'PoliceForce' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                                                    data-toggle={changesStatus ? "modal" : "pill"}
                                                    data-target={changesStatus ? "#SaveModal" : ''}
                                                    style={{ color: showIncPage === 'PoliceForce' ? 'Red' : tabCount?.ArrsetPoliceForce > 0 ? 'blue' : '#000' }}
                                                    aria-current="page"
                                                    // onClick={() => {
                                                    //     if (!changesStatus) { setShowPage('PoliceForce') }
                                                    // }}>
                                                    onClick={() => {
                                                        if (!changesStatus) setShowIncPage('PoliceForce');
                                                    }}>
                                                    Use Of Force {`${tabCount?.ArrsetPoliceForce > 0 ? '(' + tabCount?.ArrsetPoliceForce + ')' : ''}`}
                                                </span>
                                            }
                                            <span
                                                className={`nav-item ${showIncPage === 'AuditLog' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showIncPage === 'AuditLog' ? 'Red' : tabCount?.IncidentLocationCount > 0 ? 'blue' : '#000', }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowIncPage('AuditLog') }}
                                            >
                                                Audit Log
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

                                                        {/* <li className="list-inline-item nav-item">
                                                {
                                                    !isRestricted &&
                                                    <button
                                                        // disabled
                                                        className="btn py-1  d-flex align-items-center gap-2 text-danger"
                                                        style={{ columnGap: "5px", backgroundColor: "#E0E0E0" }}
                                                        onClick={() => { setOpenModule('Restrict'); setShowLockModal(true) }}
                                                        data-toggle="modal"
                                                        data-target="#NibrsAllModuleErrorShowModal">
                                                        <FontAwesomeIcon icon={faBan} /> Restrict
                                                    </button>
                                                }
                                            </li>
                                            <li className="list-inline-item ">
                                                {
                                                    permissionToUnrestrict &&
                                                    <button
                                                        // disabled
                                                        className="btn py-1  d-flex align-items-center gap-2"
                                                        style={{ columnGap: "5px", backgroundColor: "#E0E0E0" }}
                                                        onClick={() => { setOpenModule('Unrestrict'); setShowLockModal(true) }}
                                                        data-toggle="modal"
                                                        data-target="#NibrsAllModuleErrorShowModal"
                                                    >
                                                        <FontAwesomeIcon icon={faBan} /> Unrestrict
                                                    </button>
                                                }
                                            </li> */}
                                                    </>
                                                    :
                                                    <></>
                                            }



                                        </ul>
                                    </div>
                                </div>
                                {
                                    showIncPage === 'home' ?
                                        <IncidentHome {...{ incidentReportedDate, setIncidentReportedDate, setShowPoliceForce, setShowIncPage, isPreviewNormalReport, setIsPreviewNormalReport, isLocked }} />
                                        :
                                        showIncPage === 'Officer Activity' ?
                                            <div className='mt-2'>
                                                <Pin {...{ incidentReportedDate, isLocked }} />
                                            </div>
                                            :
                                            // showIncPage === 'type of security' ?
                                            //     <TypeOfSecurity />
                                            //     :
                                            showIncPage === 'Report' ?
                                                <Narrative {...{ incidentReportedDate, isPreviewNormalReport }} />
                                                :
                                                // showIncPage === 'location history' ?
                                                //     <LocationHistory />
                                                //     :
                                                showIncPage === 'PoliceForce' && showPoliceForce ?
                                                    <PoliceForceIncident {...{
                                                        // DecArrestId, DecIncID, 
                                                    }} />
                                                    :
                                                    showIncPage === 'AuditLog' ?
                                                        <Log ParentId={incidentId} scrCode={'I089'} url={'Log/GetData_Log'} para={'IncidentID'} />
                                                        :
                                                        <></>
                                }
                            </div>
                            <LockRestrictModule
                                show={showLockModal}
                                openModule={openModule}
                                onClose={() => setShowLockModal(false)}

                                isLockedOrRestrict={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'IsRestricted' : 'IsLocked'}
                                isLockOrRestrictLevel={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'RestrictLevel' : 'LockLevel'}
                                isLockOrRestricPINID={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'RestrictPINID' : 'LockPINID'}
                                isLockOrRestricDate={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'RestrictDate' : 'LockDate'}
                                isLockOrRestrictUrl={openModule === 'Unrestrict' || openModule === 'Restrict' ? 'Restricted/UpdateIncidentRestrictedStatus' : 'Restricted/UpdateIncidentLockStatus'}
                                moduleName={'Incident'}
                                id={0}

                                getPermissionLevelByLock={getPermissionLevelByLock}
                                getPermissionLevelByRestrict={getPermissionLevelByRestrict}

                            />


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default IncidentTab