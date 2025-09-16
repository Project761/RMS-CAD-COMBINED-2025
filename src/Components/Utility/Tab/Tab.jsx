import React, { useEffect, useContext, useState, useRef } from 'react'
import { Link, useLocation } from "react-router-dom";
import { AgencyContext } from '../../../Context/Agency/Index';
import { Decrypt_Id_Name, DecryptedList, base64ToString } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { useDispatch, useSelector } from 'react-redux';
import StatusBar from '../../Inc/StatusBar';
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchPostData, fetchPostDataNibrs } from '../../hooks/Api';

const Tab = () => {

    const { changesStatus, get_Name_Count, tabCount, incidentCount, setVehicleStatus, ArresteName, incidentNumber, } = useContext(AgencyContext)
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const dispatch = useDispatch();
    const statusRef = useRef(null);

    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const [currentTab, setCurrentTab] = useState('Incident');
    const [incidentStatus, setIncidentStatus] = useState(false)

    const [incidentErrorStatus, setIncidentErrorStatus] = useState(false)
    const [offenseErrorStatus, setOffenseErrorStatus] = useState(false)
    const [nameErrorStatus, setNameErrorStatus] = useState(false)
    const [NameRelationshipError, setNameRelationshipError] = useState(false);
    const [narrativeApprovedStatus, setNarrativeApprovedStatus] = useState(false);
    const [PropErrorStatus, setPropErrorStatus] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showStatus, setShowStatus] = useState(false);

    const [isUserClosed, setIsUserClosed] = useState(() => {

        const savedPreference = localStorage.getItem('statusBarClosed');
        return savedPreference === 'true';
    });


    const handleStatusBarClose = (e) => {
        e.stopPropagation();
        const newState = !showStatus;
        setShowStatus(newState);
        if (newState === false) { // Only update localStorage when closing
            setIsUserClosed(true);
            localStorage.setItem('statusBarClosed', 'true');
        } else {
            setIsUserClosed(false);
            localStorage.setItem('statusBarClosed', 'false');
        }
    };


    const loginAgencyID = localStoreData?.AgencyID || '';

    const currentLocation = window.location.pathname + window.location.search;

    const offenseCount = incidentCount[0]?.OffenseCount || 0;
    const NameCount = incidentCount[0]?.NameCount || 0;
    const PropertyCount = incidentCount[0]?.PropertyCount || 0;
    const ArrestCount = incidentCount[0]?.ArrestCount || 0;
    const VehicleCount = incidentCount[0]?.VehicleCount || 0;
    const OffenderCount = incidentCount[0]?.OffenderCount || 0;
    const VictimCount = incidentCount[0]?.VictimCount || 0;


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusRef.current && !statusRef.current.contains(event.target)) {
                setShowStatus(true);
            }
        };
        if (showStatus) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showStatus]);

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var IncID = query?.get("IncId");
    var IncNo = query?.get("IncNo");
    var documentID = query?.get("documentId");

    var IncSta = query?.get("IncSta");
    var NameID = query?.get("NameID");
    var MasterNameID = query?.get("MasterNameID");
    var NameStatus = query?.get('NameStatus');
    var OffId = query?.get("OffId");
    var OffSta = query?.get("OffSta");
    let ProId = query?.get('ProId');
    let MProId = query?.get('MProId');
    var ProSta = query?.get('ProSta');
    let VehId = query?.get('VehId');
    let MVehId = query?.get('MVehId');
    var VehSta = query?.get('VehSta');
    var DocSta = query?.get('DocSta');
    var SideBarStatus = query?.get("SideBarStatus");
    let ArrestId = query?.get('ArrestId');
    var ArrNo = query?.get("ArrNo");
    var ArrestSta = query?.get('ArrestSta');
    let MstPage = query?.get('page');
    var Name = query?.get("Name");
    var ChargeSta = query?.get('ChargeSta');

    var ChargeId = query?.get('ChargeId');
    let DecArrestId = 0, DecIncID = 0, DecChargeId = 0

    // if (!ArrestId) ArrestId = 0;
    // else DecArrestId = parseInt(base64ToString(ArrestId));


    if (!ChargeId) ChargeId = 0;
    else DecChargeId = parseInt((ChargeId));

    if (!IncID) IncID = 0;
    else DecIncID = parseInt(base64ToString(IncID));
    // new
    // if (!ArrestId) { ArrestId = 0; }
    // else { DecArrestId = parseInt(base64ToString(ArrestId)); }

    if (!documentID) documentID = 0;
    else documentID = documentID;

    if (!IncID) IncID = 0;
    else IncID = IncID;

    if (!NameID) NameID = 0;
    else NameID = NameID;

    if (!MasterNameID) MasterNameID = 0;
    else MasterNameID = MasterNameID;

    if (!OffId) OffId = 0;
    else OffId = OffId;

    if (!ProId) ProId = 0;
    else ProId = ProId;

    if (!MProId) MProId = 0;
    else MProId = MProId;

    if (!VehId) VehId = 0;
    else VehId = VehId;

    if (!MVehId) MVehId = 0;
    else MVehId = MVehId;

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (IncSta === false || IncSta === 'false') {
            setIncidentStatus(false);
        } else {
            setIncidentStatus(true);
            if (!isUserClosed) { setShowStatus(true); }
        }
    }, [IncSta]);

    const active = window.location.pathname;

    useEffect(() => {
        const pathname = window.location.pathname;
        if (pathname.includes('Inc-Home')) setCurrentTab('Incident');
        if (pathname.includes('Off-Home')) setCurrentTab('Offense');
        if (pathname.includes('Name-Home')) setCurrentTab('Name');
        if (pathname.includes('Prop-Home')) setCurrentTab('Property');
        if (pathname.includes('Vehicle-Home')) setCurrentTab('Vehicle');
        if (pathname.includes('Document-Home')) setCurrentTab('Document');
        if (pathname.includes('Offvic-Home')) setCurrentTab('OffenderVicitm');
        if (pathname.includes('Arrest-Home')) setCurrentTab('Arrest');
        if (pathname.includes('nibrs-Home')) setCurrentTab('NIBRS');
        if (pathname.includes('NIBRSAudit-Home')) setCurrentTab('NIBRSAudit');
        if (pathname.includes('CloseHistory-Home')) setCurrentTab('CloseHistory');

        // if (pathname.includes('Offvic-Home')) setCurrentTab('Arrest');
        // if (pathname.includes('Offvic-Home')) setCurrentTab('OffenderVicitm');

    }, [window.location.pathname]);

    useEffect(() => {
        if (showStatus && DecIncID && IncNo && loginAgencyID) {
            nibrsValidateInc(DecIncID, IncNo, loginAgencyID);
        }
    }, [showStatus, DecIncID, IncNo, loginAgencyID]);

    // validate property/vehicle
    const nibrsValidateInc = async (incidentID, incidentNumber, agencyID) => {
        // loading
        setLoading(true);
        // incident error
        setIncidentErrorStatus(false);
        // offense
        setOffenseErrorStatus(false);
        // name
        setNameErrorStatus(false);
        // Relation
        setNameRelationshipError(false);
        // narrative
        setNarrativeApprovedStatus(false);

        try {

            const [incidentError, offenseError, victimError, offenderError, DashBoardVicOffRelationStatus, propertyError] = await Promise.all([
                fetchPostDataNibrs('NIBRS/GetIncidentNIBRSError', { 'StrIncidentID': incidentID, 'StrIncidentNumber': incidentNumber, 'StrAgencyID': agencyID }),
                fetchPostDataNibrs("NIBRS/Nibrs_OffenseError", { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'CrimeId': 0, 'gIntAgencyID': loginAgencyID }),
                fetchPostDataNibrs('NIBRS/GetVictimNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'NameID': 0, 'gIntAgencyID': loginAgencyID }),
                fetchPostDataNibrs('NIBRS/GetOffenderNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'NameID': 0, 'gIntAgencyID': loginAgencyID }),
                fetchPostData('DashBoard/GetData_DashBoardIncidentStatus', { 'IncidentID': incidentID, }),
                fetchPostDataNibrs('NIBRS/GetPropertyNIBRSError', { 'gIncidentID': incidentID, 'IncidentNumber': IncNo, 'PropertyId': 0, 'gIntAgencyID': loginAgencyID }),
            ])
            // console.log("🚀 ~ nibrsValidateInc ~ incidentError:", incidentError)

            if (incidentError?.Administrative) {
                const incObj = incidentError?.Administrative ? incidentError?.Administrative : [];

                setIncidentErrorStatus(true);

            } else {
                setIncidentErrorStatus(false);
            }


            if (offenseError) {
                const offenseObj = offenseError?.Offense ? offenseError?.Offense : [];
                if (offenseObj?.length > 0) {
                    setOffenseErrorStatus(true);
                } else {
                    setOffenseErrorStatus(false);
                }
            } else {
                setOffenseErrorStatus(false);
            }

            if (victimError || offenderError) {
                const victimObj = victimError?.Victim ? victimError?.Victim : [];
                const offenderObj = offenderError?.Offender ? offenderError?.Offender : [];

                if (victimObj?.length > 0 || offenderObj?.length > 0) {
                    setNameErrorStatus(true);
                } else {
                    setNameErrorStatus(false);
                }
            } else {
                setNameErrorStatus(false);
            }


            if (DashBoardVicOffRelationStatus?.length > 0) {
                const NameRelationship = DashBoardVicOffRelationStatus[0]?.NameRelationship;
                const Narrative = DashBoardVicOffRelationStatus[0]?.Narrative;
                const VictimOffense = DashBoardVicOffRelationStatus[0]?.VictimOffense;

                setNameRelationshipError(NameRelationship > 0);
                setNarrativeApprovedStatus(Narrative > 0);

            } else {
                setNameRelationshipError(false)
                setNarrativeApprovedStatus(false);

            }

            if (propertyError) {
                const proObj = propertyError?.Properties ? propertyError?.Properties : [];
                console.log("🚀 ~ nibrsValidateInc ~ proObj:", proObj)

                const VehArr = proObj?.filter((item) => item?.PropertyType === 'V');
                const PropArr = proObj?.filter((item) => item?.PropertyType !== 'V');

                if (PropArr?.length > 0 || VehArr?.length > 0) {
                    setPropErrorStatus(true);

                } else {
                    setPropErrorStatus(false);
                }

            } else {
                setPropErrorStatus(false);
            }

            setLoading(false);
        } catch (error) {
            console.log("🚀 ~ ValidateProperty ~ error:", error);
            setLoading(false);
            setIncidentErrorStatus(false);
        }
    }


    return (
        <div className="col-12 inc__tabs">
            {/* <StatusBar /> */}
            <div className='d-flex justify-content-between align-items-center mb-1'>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/Inc-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}` ? 'active' : ''}`}
                            to={changesStatus ? currentLocation : `/Inc-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`}
                            style={{ color: currentTab === 'Incident' ? 'Red' : '#130e0e', fontWeight: '600' }}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Incident') } }}
                        >
                            Incident
                        </Link>
                    </li>
                    <li className="nav-item" >
                        <Link
                            className={`nav-link${active === `/Off-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${OffId}&OffSta=${OffSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/Off-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&OffId=${OffId}&OffSta=${OffSta}`}
                            style={{ color: currentTab === 'Offense' ? 'Red' : incidentCount[0]?.OffenseCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Offense') } }}
                        >
                            Offense{`${incidentCount[0]?.OffenseCount > 0 ? '(' + incidentCount[0]?.OffenseCount + ')' : ''}`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/Name-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'} `}
                            to={changesStatus ? currentLocation : `/Name-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&NameID=${NameID}&MasterNameID=${MasterNameID}&NameStatus=${NameStatus}`}
                            style={{ color: currentTab === 'Name' ? 'Red' : incidentCount[0]?.NameCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            onClick={() => { if (!changesStatus) { setCurrentTab('Name'); } }}
                            tabIndex="-1"
                            aria-disabled="true"
                        >
                            Name{`${incidentCount[0]?.NameCount > 0 ? '(' + incidentCount[0]?.NameCount + ')' : ''}`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/Prop-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${ProId}&MProId=${MProId}&ProSta=${ProSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation :
                                `/Prop-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ProId=${ProId}&MProId=${MProId}&ProSta=${ProSta}`
                            }
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'Property' ? 'Red' : incidentCount[0]?.PropertyCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            onClick={() => { if (!changesStatus) { setCurrentTab('Property') } }}
                        >
                            Property{`${incidentCount[0]?.PropertyCount > 0 ? '(' + incidentCount[0]?.PropertyCount + ')' : ''}`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/Vehicle-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${VehId}&MVehId=${MVehId}&VehSta=${VehSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/Vehicle-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&VehId=${VehId}&MVehId=${MVehId}&VehSta=${VehSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'Vehicle' ? 'Red' : incidentCount[0]?.VehicleCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            onClick={() => { if (!changesStatus) { setCurrentTab('Vehicle'); setVehicleStatus(false) } }}
                        >
                            Vehicle{`${incidentCount[0]?.VehicleCount > 0 ? '(' + incidentCount[0]?.VehicleCount + ')' : ''}`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&documentId=${documentID}&DocSta=${DocSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/Document-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&documentId=${documentID}&DocSta=${DocSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'Document' ? 'Red' : incidentCount[0]?.DocumentManagementCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            onClick={() => { if (!changesStatus) { setCurrentTab('Document') } }}
                        >
                            Document{`${incidentCount[0]?.DocumentManagementCount > 0 ? '(' + incidentCount[0]?.DocumentManagementCount + ')' : ''}`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/Offvic-Home?IncId=${IncID}&IncNo=${IncNo}&NameID=${NameID}&IncSta=${IncSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/Offvic-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'OffenderVicitm' ? 'Red' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            onClick={() => { if (!changesStatus) { setCurrentTab('OffenderVicitm') } }}
                        >
                            Offender/Victim Info
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${active === `/Arrest-Home?IncId=${IncID}&ArrestId=${ArrestId}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&Name=${Name}&SideBarStatus=${false}` ? 'active' : ''}${incidentStatus ? '' : 'disabled'} `}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            // style={{ color: currentTab === 'Arrest' ? 'Red' : '#130e0e', fontWeight: '500' }}
                            // style={{ color: showPage === 'Arrest' ? 'Red' : incidentCount?.ArrestCount > 0 ? 'blue' : '#000' }}
                            style={{ color: currentTab === 'Arrest' ? 'Red' : incidentCount[0]?.ArrestCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}

                            onClick={() => { if (!changesStatus) { setCurrentTab('Arrest'); } }}
                            //------------page=MST-Arrest-Dash ke liye condiction---------
                            to={
                                MstPage ? `/Arrest-Home?page=MST-Arrest-Dash&ArrestId=${ArrestId}&ArrNo=${ArrNo}&Name=${ArresteName}&IncId=${IncID}&IncNo=${incidentNumber}&SideBarStatus=${false}&ArrestSta=${ArrestSta}&ChargeSta=false`
                                    : changesStatus
                                        ? currentLocation
                                        : `/Arrest-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}&ArrestId=${ArrestId}&ArrestSta=${ArrestSta}&ArrNo=${ArrNo}&Name=${Name}&SideBarStatus=${false}&ChargeSta=false`
                            }
                        >Arrest {`${incidentCount[0]?.ArrestCount > 0 ? '(' + incidentCount[0]?.ArrestCount + ')' : ''}`}
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/nibrs-Home?IncId=${IncID}&IncNo=${IncNo}&NameID=${NameID}&IncSta=${IncSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/nibrs-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            style={{ color: currentTab === 'NIBRS' ? 'Red' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            onClick={() => { if (!changesStatus) { setCurrentTab('NIBRS') } }}
                        >
                            TIBRS
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/NIBRSAudit-Home?IncId=${IncID}&IncNo=${IncNo}&NameID=${NameID}&IncSta=${IncSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/NIBRSAudit-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            // style={{ color: currentTab === 'NIBRSAudit' ? 'Red' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            style={{ color: currentTab === 'NIBRSAudit' ? 'Red' : incidentCount[0]?.NIBRSAuditCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            onClick={() => { if (!changesStatus) { setCurrentTab('NIBRSAudit') } }}
                        >
                            TIBRS Audit
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/CloseHistory-Home?IncId=${IncID}&IncNo=${IncNo}&NameID=${NameID}&IncSta=${IncSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/CloseHistory-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            // style={{ color: currentTab === 'NIBRSAudit' ? 'Red' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            style={{ color: currentTab === 'CloseHistory' ? 'Red' : incidentCount[0]?.IncidentCloseHistoryCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            onClick={() => { if (!changesStatus) { setCurrentTab('CloseHistory') } }}
                        >
                            Case History
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            className={`nav-link  ${active === `/NLETShistory-Home?IncId=${IncID}&IncNo=${IncNo}&NameID=${NameID}&IncSta=${IncSta}` ? 'active' : ''} ${incidentStatus ? '' : 'disabled'}`}
                            to={changesStatus ? currentLocation : `/NLETShistory-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`}
                            data-toggle={changesStatus ? "modal" : "pill"}
                            // style={{ color: currentTab === 'NIBRSAudit' ? 'Red' : '#130e0e', fontWeight: '600' }}
                            data-target={changesStatus ? "#SaveModal" : ''}
                            tabIndex="-1"
                            aria-disabled="true"
                            style={{ color: currentTab === 'NLETShistory' ? 'Red' : incidentCount[0]?.IncidentNLETShistoryCount > 0 ? 'blue' : '#130e0e', fontWeight: '600' }}
                            onClick={() => { if (!changesStatus) { setCurrentTab('NLETShistory') } }}
                        >
                            NLETS history
                        </Link>
                    </li>
                </ul>
                <ul className='float-end text-end mb-0'>
                    {
                        IncSta === true || IncSta === "true" ?
                            <>
                                <div className="">
                                    <button
                                        className="btn btn-primary py-1"
                                        // onClick={(e) => {
                                        //     e.stopPropagation();
                                        //     setShowStatus(!showStatus);
                                        // }}
                                        onClick={handleStatusBarClose}
                                    >
                                        <FontAwesomeIcon icon={faArrowLeft} />
                                    </button>
                                    {
                                        showStatus && <StatusBar
                                            ref={statusRef}

                                            loading={loading}

                                            incidentErrorStatus={incidentErrorStatus}

                                            offenseCount={offenseCount}
                                            offenseErrorStatus={offenseErrorStatus}

                                            NameCount={NameCount}
                                            nameErrorStatus={nameErrorStatus}

                                            NameRelationshipError={NameRelationshipError}
                                            narrativeApprovedStatus={narrativeApprovedStatus}

                                            PropertyCount={PropertyCount}
                                            PropErrorStatus={PropErrorStatus}

                                        />}
                                </div>
                            </>
                            :
                            <>
                            </>
                    }

                </ul>
            </div>
        </div >
    )
}

export default Tab

