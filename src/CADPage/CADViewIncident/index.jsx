/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Nav } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
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

function CADViewIncident(props) {
    const { eventDetailsModal, setEventDetailsModal, previousUrl } = props;
    const { get_Incident_Count, incidentCount } = useContext(AgencyContext);
    const navigate = useNavigate();

    const handleModalClose = () => {
        setEventDetailsModal(false);
        if (previousUrl) {
            navigate(previousUrl);
        }
    };
    const tabConfig = [
        { key: "incident", label: "Event Info", component: IncidentTabSection, isPopup: false, class: "black", props: { isViewEventDetails: true }, },
        { key: "name", label: `Name ${incidentCount[0]?.NameCount > 0 ? '(' + incidentCount[0]?.NameCount + ')' : ''}`, class: `${incidentCount[0]?.NameCount > 0 ? "blue" : "black"}`, component: NameTabSectionModal, isPopup: false, props: { isViewEventDetails: true }, },
        {
            key: "property",
            label: `Property ${incidentCount[0]?.PropertyCount > 0 ? '(' + incidentCount[0]?.PropertyCount + ')' : ''}`,
            class: `${incidentCount[0]?.PropertyCount > 0 ? "blue" : "black"}`,
            component: PropertyTabSectionModal,
            isPopup: false,
            props: { isViewEventDetails: true },
        },
        { key: "vehicle", label: `Vehicle ${incidentCount[0]?.VehicleCount > 0 ? '(' + incidentCount[0]?.VehicleCount + ')' : ''}`, class: `${incidentCount[0]?.VehicleCount > 0 ? "blue" : "black"}`, component: VehicleTabSectionModal, isPopup: false, props: { isViewEventDetails: true }, },
        { key: "resourceStatus", label: "Unit Status", component: ResourceStatusTabSection, isPopup: false, class: "black", props: { isViewEventDetails: true }, },
        { key: "resourceHistoryNew", label: "Unit History", component: ResourceHistoryNewTabSection, isPopup: false, class: "black", props: { isViewEventDetails: true }, },
        { key: "comments", label: "Comments", component: CommentsTabSection, isPopup: false, class: "black", props: { isViewEventDetails: true }, },
        { key: "resourceHistory", label: "Call History", component: ResourceHistoryTabSection, isPopup: false, class: "black", props: { isViewEventDetails: true }, },
    ];


    const useRouteQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useRouteQuery();
    let IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (IncID) {
            get_Incident_Count(IncID);
        }
    }, [IncID]);

    const [activeTab, setActiveTab] = useState("incident");
    const ActiveTabComponent = tabConfig.find(tab => tab.key === activeTab)?.component;
    const ActiveTabComponentRef = useRef(null);

    return (
        <>
            {eventDetailsModal ? (
                <dialog
                    className="modal fade"
                    style={{
                        background: "rgba(0,0,0, 0.5)",
                        zIndex: "200",
                        overflow: "hidden",
                    }}
                    id="CADDispatcherModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    data-backdrop="false"
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div
                            className="modal-content modal-content-cad"
                            style={{
                                maxHeight: "calc(100vh - 100px)",
                                overflowY: "auto",
                            }}
                        >
                            <div className="modal-body">
                                <div className="section-body view_page_design">
                                    <div className="dashboard-main-container">
                                        <div className="dispatcher-container">
                                            {/* <TitleCmp title={"CAD Event Details"} /> */}
                                            <div className='header-Container'>
                                                <span>CAD Event Details</span>
                                                <button type="button"
                                                    className="btn btn-sm bg-white btn-border"
                                                    onClick={handleModalClose}
                                                >
                                                    <div style={{ display: "grid" }}>
                                                        <span>Close</span>
                                                    </div>
                                                </button>
                                            </div>
                                            <div className="tab-controller-container">
                                                <Nav variant="tabs" className="nav-tabs px-2" style={{ width: "90%" }}>
                                                    {tabConfig.map((tab) => (
                                                        tab.isPopup ? (
                                                            <Nav.Item key={tab.key} >
                                                                <button
                                                                    type="button"
                                                                    data-toggle="modal"
                                                                    data-target={`#${tab.data_target}`}
                                                                    onClick={true ? tab.target_function : (e) => e.preventDefault()}
                                                                >
                                                                    {tab.label}
                                                                </button>
                                                            </Nav.Item>
                                                        ) : (
                                                            <Nav.Item key={tab.key} >
                                                                <Nav.Link
                                                                    active={activeTab === tab.key}
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        className="btn p-0"
                                                                        onClick={true ? () => setActiveTab(tab.key) : (e) => e.preventDefault()}
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
                                                {/* <div className="mt-1" ref={ActiveTabComponentRef}>
                            {ActiveTabComponent && <ActiveTabComponent />}
                        </div> */}
                                                <div className="mt-1" ref={ActiveTabComponentRef}>
                                                    {ActiveTabComponent &&
                                                        <ActiveTabComponent {...(tabConfig.find(tab => tab.key === activeTab)?.props || {})} />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div >
                            </div>

                        </div>
                    </div>
                </dialog>
            ) : (
                <> </>
            )}
        </>
    );
}

CADViewIncident.propTypes = {
  eventDetailsModal: PropTypes.bool.isRequired,
  setEventDetailsModal: PropTypes.func.isRequired,
  previousUrl: PropTypes.string
};

CADViewIncident.defaultProps = {
  previousUrl: ''
};

export default CADViewIncident;
