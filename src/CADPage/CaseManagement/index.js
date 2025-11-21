import React, { useEffect, useState } from 'react'
import Tab from '../../Components/Utility/Tab/Tab'
import Home from '../../CADComponents/CaseManagement/home'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EvidenceDocs from '../../CADComponents/CaseManagement/evidenceDocs';
import CaseEffort from '../../CADComponents/CaseManagement/caseEffort';
import Prosecution from '../../CADComponents/CaseManagement/prosecution';
import Discovery from '../../CADComponents/CaseManagement/discovery';
import CaseClosure from '../../CADComponents/CaseManagement/caseClosure';
import CourtOutcome from '../../CADComponents/CaseManagement/courtOutcome';
import AuditLog from '../../CADComponents/CaseManagement/auditLog';
import CaseTeam from '../../CADComponents/CaseManagement/caseTeam';
import DetectiveNotes from '../../CADComponents/CaseManagement/detectiveNotes';
import PropertyEvidence from '../../CADComponents/CaseManagement/propertyEvidence';
import CaseReport from '../../CADComponents/CaseManagement/caseReport';
import CaseTimeline from '../../CADComponents/CaseManagement/CaseTimeline';
import { useQuery } from 'react-query';
import CaseManagementServices from '../../CADServices/APIs/caseManagement';
import { base64ToString } from '../../Components/Common/Utility';
import CloseHistory from '../../Components/Pages/CloseHistory/CloseHistory';

function CaseManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const [caseManagementPage, setCaseManagementPage] = useState('home');
    const [caseID, setCaseID] = useState(null)
    const [caseData, setCaseData] = useState(null)
    const [RMSCaseNumber, setRMSCaseNumber] = useState(null)
    const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
    const useRouterQuery = () => {
        const params = new URLSearchParams(location.search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useRouterQuery();
    let IncID = query?.get("IncId");
    let IncNo = query?.get("IncNo");
    let IncSta = query?.get("IncSta");
    let CaseId = query?.get("CaseId");

    if (!IncID) IncID = 0;
    else IncID = IncID;

    const getCaseManagementCaseDataKey = `/CaseManagement/GetAllCaseManagementCaseData/${IncID}`;
    const { data: getCaseManagementCaseData, isSuccess: isGetCaseManagementCaseDataSuccess, refetch: refetchCaseManagementCaseData } = useQuery(
        [getCaseManagementCaseDataKey, {
            "IncidentID": parseInt(base64ToString(IncID)),
        },],
        CaseManagementServices.getAllCaseManagementCaseData,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!IncID
        }
    );

    useEffect(() => {
        if (isGetCaseManagementCaseDataSuccess && getCaseManagementCaseData) {
            const data = JSON.parse(getCaseManagementCaseData?.data?.data)?.Table
            setCaseData(data?.[0]);
            const apiCaseID = data?.[0]?.CaseID;

            // Use CaseId from URL if available, otherwise use API response
            const finalCaseID = CaseId ? parseInt(CaseId) : apiCaseID;
            setCaseID(finalCaseID);
            setRMSCaseNumber(data?.[0]?.RMSCaseNumber);


        }
    }, [isGetCaseManagementCaseDataSuccess, getCaseManagementCaseData, IncID, IncNo, IncSta, CaseId,])

    return (
        <div className="section-body view_page_design pt-1 p-1 bt cad-css">
            <div className="div">
                <div className="col-12 inc__tabs">
                    <Tab />
                </div>
                <div className="dark-row">
                    <div className="col-12">
                        <div className="card Agency incident-cards-agency">
                            <div className="card-body">
                                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    <div className="col-12 name-tab">
                                        <ul className='nav nav-tabs'>
                                            {/* Home tab - Updates URL with page=home parameter */}
                                            <Link
                                                className={`nav-item ${caseManagementPage === 'home' ? 'active' : ''}`}
                                                to={
                                                    `/inc-case-management?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}${caseID ? `&CaseId=${caseID}` : ''}&page=home`
                                                }
                                                style={{ color: caseManagementPage === 'home' ? 'Red' : '#000' }}
                                                data-toggle={"pill"}
                                                aria-current="page"
                                                onClick={() => { setCaseManagementPage('home') }}

                                            >
                                                {iconHome}
                                            </Link>
                                            <>
                                                {/* Navigation tabs - Each tab updates URL with corresponding page parameter */}
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'evidence' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'evidence' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('evidence') }}
                                                >
                                                    Entities
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'caseTeam' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'caseTeam' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('caseTeam') }}
                                                >
                                                    Case Team
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'caseEffort' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'caseEffort' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('caseEffort') }}
                                                >
                                                    Case Effort
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'detectiveNotes' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'detectiveNotes' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('detectiveNotes') }}
                                                >
                                                    Detective Notes
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'propertyEvidence' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'propertyEvidence' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('propertyEvidence') }}
                                                >
                                                    Property and Evidence
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'caseReport' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'caseReport' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('caseReport') }}
                                                >
                                                    Case Report
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'caseTimeline' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'caseTimeline' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('caseTimeline') }}
                                                >
                                                    Case Timeline
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'discovery' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'discovery' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('discovery') }}
                                                >
                                                    Discovery
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'caseClosure' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'caseClosure' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('caseClosure') }}
                                                >
                                                    Case Closure
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'courtOutcome' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'courtOutcome' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('courtOutcome') }}
                                                >
                                                    Court Outcome
                                                </span>
                                                <span
                                                    className={`nav-item ${caseManagementPage === 'caseHistory' ? 'active' : ''}`}
                                                    data-toggle={"pill"}
                                                    style={{ color: caseManagementPage === 'caseHistory' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                    aria-current="page"
                                                    onClick={() => { if (!caseID) return; setCaseManagementPage('caseHistory') }}
                                                >
                                                    Case History
                                                </span>
                                            </>
                                            <span
                                                className={`nav-item ${caseManagementPage === 'auditLog' ? 'active' : ''}`}
                                                data-toggle={"pill"}
                                                style={{ color: caseManagementPage === 'auditLog' ? 'Red' : '#000', pointerEvents: caseID ? 'auto' : 'none', opacity: caseID ? 1 : 0.5, cursor: caseID ? 'pointer' : 'not-allowed' }}
                                                aria-current="page"
                                                onClick={() => { if (!caseID) return; setCaseManagementPage('auditLog') }}
                                            >
                                                {" Audit Log"}
                                            </span>

                                        </ul>
                                    </div>
                                </div>

                                {caseManagementPage === 'home' && <Home CaseId={caseID} RMSCaseNumber={RMSCaseNumber} refetchCaseManagementCaseData={refetchCaseManagementCaseData} caseData={caseData} />}
                                {caseManagementPage === 'evidence' && <EvidenceDocs CaseId={caseID} />}
                                {caseManagementPage === 'caseTeam' && <CaseTeam CaseId={caseID} />}
                                {caseManagementPage === 'caseEffort' && <CaseEffort CaseId={caseID} />}
                                {caseManagementPage === 'detectiveNotes' && <DetectiveNotes CaseId={caseID} />}
                                {caseManagementPage === 'propertyEvidence' && <PropertyEvidence />}
                                {caseManagementPage === 'caseReport' && <CaseReport CaseId={caseID} />}
                                {caseManagementPage === 'caseTimeline' && <CaseTimeline />}
                                {caseManagementPage === 'discovery' && <Discovery />}
                                {caseManagementPage === 'caseClosure' && <CaseClosure CaseId={caseID} />}
                                {caseManagementPage === 'courtOutcome' && <CourtOutcome />}
                                {caseManagementPage === 'auditLog' && <AuditLog />}
                                {caseManagementPage === 'caseHistory' && <CloseHistory />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaseManagement