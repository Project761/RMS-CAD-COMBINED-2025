/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useEffect, useRef, useState } from 'react'
import TitleCmp from '../../CADComponents/Common/TitleCmp';
import { Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import IncidentTabSection from '../../CADComponents/MonitorScreen/TabSections/IncidentTabSection';
import ResourceHistoryTabSection from '../../CADComponents/MonitorScreen/TabSections/ResourceHistoryTabSection';
import ResourceStatusTabSection from '../../CADComponents/MonitorScreen/TabSections/ResourceStatusTabSection';
import ResourceHistoryNewTabSection from '../../CADComponents/MonitorScreen/TabSections/ResourceHistoryNewTabSection';
import CommentsTabSection from "../../CADComponents/MonitorScreen/TabSections/CommentsTabSection";
import NameTabSectionModal from '../../CADComponents/MonitorScreen/TabSections/NameTabSectionModal';
import PropertyTabSectionModal from '../../CADComponents/MonitorScreen/TabSections/PropertyTabSectionModal';
import VehicleTabSectionModal from '../../CADComponents/MonitorScreen/TabSections/VehicleTabSectionModal';
import { AgencyContext } from '../../Context/Agency/Index';
import { base64ToString } from '../../Components/Common/Utility';
import NCICHistoryTabSection from '../../CADComponents/MonitorScreen/TabSections/NCICHistoryTabSection';
import DocumentTabSectionModal from '../../CADComponents/MonitorScreen/TabSections/DocumentTabSectionModal';


function CADDispatcher() {
    const { get_Incident_Count, incidentCount } = useContext(AgencyContext);
    const [activeTab, setActiveTab] = useState("incident");
    const ActiveTabComponentRef = useRef(null);

    const tabConfig = [
        { key: "incident", label: "Event Info", component: IncidentTabSection, isPopup: false, class: "black" },
        { key: "name", label: `Name ${incidentCount[0]?.NameCount > 0 ? '(' + incidentCount[0]?.NameCount + ')' : ''}`, class: `${incidentCount[0]?.NameCount > 0 ? "blue" : "black"}`, component: NameTabSectionModal, isPopup: false },
        { key: "property", label: `Property ${incidentCount[0]?.PropertyCount > 0 ? '(' + incidentCount[0]?.PropertyCount + ')' : ''}`, class: `${incidentCount[0]?.PropertyCount > 0 ? "blue" : "black"}`, component: PropertyTabSectionModal, isPopup: false },
        { key: "vehicle", label: `Vehicle ${incidentCount[0]?.VehicleCount > 0 ? '(' + incidentCount[0]?.VehicleCount + ')' : ''}`, class: `${incidentCount[0]?.VehicleCount > 0 ? "blue" : "black"}`, component: VehicleTabSectionModal, isPopup: false },
        { key: "resourceStatus", label: "Unit Status", component: ResourceStatusTabSection, isPopup: false, class: "black" },
        { key: "resourceHistoryNew", label: "Unit History", component: ResourceHistoryNewTabSection, isPopup: false, class: "black" },
        { key: "comments", label: "Comments", component: CommentsTabSection, isPopup: false, class: "black" },
        { key: "document", label: `Document ${incidentCount[0]?.DocumentManagementCount > 0 ? '(' + incidentCount[0]?.DocumentManagementCount + ')' : ''}`, class: `${incidentCount[0]?.DocumentManagementCount > 0 ? "blue" : "black"}`, component: DocumentTabSectionModal, isPopup: false },
        { key: "resourceHistory", label: "Call History", component: ResourceHistoryTabSection, isPopup: false, class: "black" },
        { key: "ncicHistory", label: "NCIC History", component: NCICHistoryTabSection, isPopup: false, class: "black" },
        // { key: "changeLog", label: "Change Log", component: "", isPopup: false, class: "black" },
        // { key: "changeLog", label: "Change Log", component: ChangeLogSection, isPopup: false },
    ];
    const ActiveTabComponent = tabConfig?.find(tab => tab.key === activeTab)?.component;


    const useRouteQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    const query = useRouteQuery();
    let IncID = query?.get("IncId");
    let tabKey = query?.get("key");
    if (!IncID) IncID = 0;
    if (!tabKey) tabKey = "";
    console.log("IncID", IncID)
    useEffect(() => {
        if (IncID) {
            get_Incident_Count(parseInt(base64ToString(IncID)));
        }
    }, [IncID])

    useEffect(() => {
        if (tabKey) {
            setActiveTab(tabKey || "")
        }
    }, [tabKey])


    return (
        <div className="section-body view_page_design">
            <div className="dashboard-main-container">
                <div className="dispatcher-container">
                    <TitleCmp title={"CAD Event Details"} />
                    <div className="tab-controller-container">
                        <Nav variant="tabs" className="nav-tabs px-2" style={{ width: "90%" }}>
                            {tabConfig && tabConfig?.map((tab) => (
                                tab?.isPopup ? (
                                    <Nav.Item key={tab.key}>
                                        <button
                                            type="button"
                                            className={`btn ${!IncID ? "disabled" : ""}`}
                                            data-toggle="modal"
                                            data-target={`#${tab.data_target}`}
                                            onClick={tab.target_function}
                                        >
                                            {tab.label}
                                        </button>
                                    </Nav.Item>
                                ) : (
                                    <Nav.Item key={tab.key}>
                                        <Nav.Link active={activeTab === tab.key}>
                                            <button
                                                type="button"
                                                className="btn p-0"
                                                onClick={() => setActiveTab(tab.key)}
                                                style={{ color: activeTab === tab.key ? "" : tab.class }}
                                            >
                                                {tab.label}
                                            </button>
                                        </Nav.Link>
                                    </Nav.Item>
                                )
                            ))}
                        </Nav>
                        {/* Tab Content */}
                        <div className="mt-1" ref={ActiveTabComponentRef}>
                            {ActiveTabComponent && <ActiveTabComponent />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CADDispatcher