import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Decrypt_Id_Name, stringToBase64 } from '../../Common/Utility';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AgencyContext } from '../../../Context/Agency/Index';

const CaseManagementSidebar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const { CaseStatus, caseManagementDataIncidentRecent, updateCount, setIncStatus, setUpdateCount } = useContext(AgencyContext);
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
    let caseID = query?.get("CaseId");
    let pageParam = query?.get("page");

    // Initialize state from URL parameter or default to 'home'
    const [caseManagementPage, setCaseManagementPage] = useState(pageParam || 'home');

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, [dispatch, localStoreData?.AgencyID, localStoreData?.PINID, uniqueId]);

    // Update state when URL parameter changes
    useEffect(() => {
        if (pageParam) {
            setCaseManagementPage(pageParam);
        }
    }, [pageParam]);

    // Get incident description from caseData or use a default
    const incidentDescription = '';

    // Navigation handler
    const handleNavigation = (page) => {
        if (!caseID && page !== 'home') return;

        // Update state
        setCaseManagementPage(page);

        // Update URL with page parameter
        const params = new URLSearchParams(location.search);
        params.set('page', page);

        // Navigate with updated URL
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    };

    // Navigation Item Component
    const NavItem = ({ page, label, badge, isHome = false }) => {
        const isActive = caseManagementPage === page;
        const isDisabled = !caseID && !isHome;

        return (
            <div
                onClick={() => {
                    if (!isDisabled) {
                        handleNavigation(page);
                    }
                }}
                className={`pl-3 py-2 d-flex align-items-center justify-content-between border-start border-3 transition-all ${isActive ? 'case-management-sidebar' : ''} ${isDisabled ? 'opacity-50 pe-none' : 'cursor-pointer'}`}
                onMouseEnter={(e) => {
                    if (!isDisabled && !isActive) {
                        e.currentTarget.classList.add('case-management-sidebar-hover');
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isDisabled && !isActive) {
                        e.currentTarget.classList.remove('case-management-sidebar-hover');
                    }
                }}
                style={{ fontSize: '14px' }}
            >
                <span 
                    className="text-nowrap" 
                    style={{ 
                        fontWeight: isActive ? '500' : '400',
                        color: isDisabled ? '#6c757d' : 'inherit',
                        cursor: isDisabled ? 'not-allowed' : 'inherit'
                    }}
                >
                    {label}
                </span>
                {badge && (
                    <span className="badge bg-secondary rounded-pill ms-2">
                        {badge}
                    </span>
                )}
            </div>
        );
    };

    return (
        <>
            <div className="w-100">
                {/* Header Section */}
                <div className="p-3 mb-3 border-bottom case-management-sidebar pl-4">
                    <div className="fs-4 fw-bold">
                        {IncNo ? `INC-${IncNo}` : 'INC-000000'}
                    </div>
                    <div className="small">Case Status :- {CaseStatus ? CaseStatus : ''}
                    </div>
                </div>
                <ul className="recent">
                    {
                        caseManagementDataIncidentRecent?.slice(-5).map((val) => (
                            <li key={val.IncidentID}>
                                <Link style={{ display: 'flex', flexDirection: 'column' }}
                                    to={`/Inc-Home?IncId=${stringToBase64(val?.IncidentID)}&IncNo=${val?.Potentialincidents}&IncSta=${true}`}
                                    onClick={() => {
                                        navigate(`/Inc-Home?IncId=${stringToBase64(val?.IncidentID)}&IncNo=${val?.Potentialincidents}&IncSta=${true}`);
                                        setIncStatus(true);
                                        setUpdateCount(updateCount + 1);
                                    }}>
                                    <span>Incident-{val.Potentialincidents}</span>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
                {/* Navigation Sections */}
                <div>
                    {/* OVERVIEW Section */}
                    <div className="mb-2">
                        <div>
                            <NavItem page="home" label="Home" isHome={true} />
                            <NavItem page="entities" label="Entities" />
                            <NavItem page="caseTeam" label="Case Team" />
                            <NavItem page="caseEffort" label="Case Effort" />
                            <NavItem page="detectiveNotes" label="Detective Notes" />
                            <NavItem page="propertyEvidence" label="Property & Evidence" />
                            <NavItem page="legalOrder" label="Legal Orders" />
                            <NavItem page="victimWitness" label="Victim & Witness Management" />
                            <NavItem page="caseReport" label="Case Report" />
                            <NavItem page="caseTimeline" label="Case Timeline" />
                            <NavItem page="chargingProsecution" label="Charging & Prosecution" />
                            <NavItem page="discovery" label="Discovery" />
                            <NavItem page="caseClosure" label="Case Closure" />
                            <NavItem page="courtOutcome" label="Court Outcome" />
                            <NavItem page="caseHistory" label="Case History" />
                            <NavItem page="auditLog" label="Case Audit Log" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CaseManagementSidebar
