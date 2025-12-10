import React, { useEffect, useState } from 'react'
import Tab from '../../Components/Utility/Tab/Tab'
import Home from '../../CADComponents/CaseManagement/home'
import { useLocation, useNavigate } from 'react-router-dom';
import CaseEffort from '../../CADComponents/CaseManagement/caseEffort';
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
import ChargingProsecution from '../../CADComponents/CaseManagement/chargingProsecution';
import LegalOrder from '../../CADComponents/CaseManagement/legalOrder';
import VictimWitness from '../../CADComponents/CaseManagement/victimWitness';
import Entities from '../../CADComponents/CaseManagement/entities';

function CaseManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const [caseID, setCaseID] = useState(null)
    const [caseData, setCaseData] = useState(null)
    const [RMSCaseNumber, setRMSCaseNumber] = useState(null)
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
    let pageParam = query?.get("page");

    if (!IncID) IncID = '0';

    // Initialize caseManagementPage from URL parameter or default to 'home'
    const [caseManagementPage, setCaseManagementPage] = useState(pageParam || 'home');

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

    // Update caseManagementPage when URL page parameter changes
    useEffect(() => {
        if (pageParam) {
            setCaseManagementPage(pageParam);
        } else if (!pageParam && location.search) {
            // If no page param exists but there are other params, default to 'home' and add it to URL
            const params = new URLSearchParams(location.search);
            if (!params.get('page')) {
                params.set('page', 'home');
                navigate(`${location.pathname}?${params.toString()}`, { replace: true });
                setCaseManagementPage('home');
            }
        }
    }, [pageParam, location.search, location.pathname, navigate]);

    useEffect(() => {
        if (isGetCaseManagementCaseDataSuccess && getCaseManagementCaseData) {
            const data = JSON.parse(getCaseManagementCaseData?.data?.data)?.Table
            setCaseData(data?.[0]);
            const apiCaseID = data?.[0]?.CaseID;

            // Use CaseId from URL if available, otherwise use API response
            const finalCaseID = CaseId ? parseInt(CaseId) : apiCaseID;
            setCaseID(finalCaseID);
            setRMSCaseNumber(data?.[0]?.RMSCaseNumber);

            if (finalCaseID && (!CaseId || parseInt(CaseId) !== finalCaseID)) {
                const params = new URLSearchParams(location.search);
                params.set("CaseId", finalCaseID);
                // Preserve page parameter if it exists
                if (pageParam) {
                    params.set("page", pageParam);
                }
                navigate(`${location.pathname}?${params.toString()}`, { replace: true });
            }
        }
    }, [isGetCaseManagementCaseDataSuccess, getCaseManagementCaseData, IncID, IncNo, IncSta, CaseId, pageParam, location.pathname, location.search, navigate])

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
                                <div className="row" style={{ marginTop: '-18px', marginLeft: '-18px', marginRight: '-18px' }}>
                                    {/* Content Area */}
                                    <div className="col-12" style={{ padding: '20px' }}>
                                        {caseManagementPage === 'home' && <Home CaseId={caseID} RMSCaseNumber={RMSCaseNumber} refetchCaseManagementCaseData={refetchCaseManagementCaseData} caseData={caseData} />}
                                        {caseManagementPage === 'entities' && <Entities CaseId={caseID} />}
                                        {caseManagementPage === 'caseTeam' && <CaseTeam CaseId={caseID} />}
                                        {caseManagementPage === 'caseEffort' && <CaseEffort CaseId={caseID} />}
                                        {caseManagementPage === 'detectiveNotes' && <DetectiveNotes CaseId={caseID} />}
                                        {caseManagementPage === 'propertyEvidence' && <PropertyEvidence />}
                                        {caseManagementPage === 'legalOrder' && <LegalOrder />}
                                        {caseManagementPage === 'victimWitness' && <VictimWitness />}
                                        {caseManagementPage === 'caseReport' && <CaseReport CaseId={caseID} />}
                                        {caseManagementPage === 'caseTimeline' && <CaseTimeline />}
                                        {caseManagementPage === 'chargingProsecution' && <ChargingProsecution CaseId={caseID} />}
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
            </div>
        </div>
    )
}

export default CaseManagement