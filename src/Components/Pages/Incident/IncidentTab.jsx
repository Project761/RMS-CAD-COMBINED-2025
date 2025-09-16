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
        if (IncID) { setIncidentId(base64ToString(IncID)) }
    }, [IncID]);

    useEffect(() => {
        if (tabParam) setShowIncPage(tabParam);
    }, [tabParam]);


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
                                    <div className="col-12   incident-tab">
                                        <ul className='nav nav-tabs'>
                                            <Link
                                                className={`nav-item ${showIncPage === 'home' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                to={`/Inc-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`}
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
                                            <span
                                                className={`nav-item ${showIncPage === 'Report' ? 'active' : ''} ${!status ? 'disabled' : ''}`}
                                                data-toggle={changesStatus ? "modal" : "pill"}
                                                data-target={changesStatus ? "#SaveModal" : ''}
                                                style={{ color: showIncPage === 'Report' ? 'Red' : tabCount?.NarrativeCount > 0 ? 'blue' : '#000', }}
                                                aria-current="page"
                                                onClick={() => { if (!changesStatus) setShowIncPage('Report') }}

                                            >
                                                Report{`${tabCount?.NarrativeCount > 0 ? '(' + tabCount?.NarrativeCount + ')' : ''}`}
                                            </span>
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

                                        </ul>
                                    </div>
                                </div>
                                {
                                    showIncPage === 'home' ?
                                        <IncidentHome {...{ incidentReportedDate, setIncidentReportedDate, setShowPoliceForce, setShowIncPage, isPreviewNormalReport, setIsPreviewNormalReport }} />
                                        :
                                        showIncPage === 'Officer Activity' ?
                                            <div className='mt-2'>
                                                <Pin {...{ incidentReportedDate }} />
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default IncidentTab