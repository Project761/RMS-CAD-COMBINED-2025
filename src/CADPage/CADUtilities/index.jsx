import React from "react";
import { Tab, Nav } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmModal from '../../Components/Common/ConfirmModal';
import HospitalStatusCodeSection from '../../CADComponents/UtilitiesScreen/HospitalStatusCodeSection';
import HospitalNameCodeSection from '../../CADComponents/UtilitiesScreen/HospitalNameCodeSection';
import ResourceSection from '../../CADComponents/UtilitiesScreen/ResourceSection';
import ResourceTypeSection from '../../CADComponents/UtilitiesScreen/ResourceTypeSection';
import ZoneSection from '../../CADComponents/UtilitiesScreen/ZoneSection';
import StationCodeSection from '../../CADComponents/UtilitiesScreen/StationCodeSection';
import CallForServiceCodeSection from '../../CADComponents/UtilitiesScreen/CallForServiceCodeSection';
import CFSAgencyCallFilterSection from '../../CADComponents/UtilitiesScreen/CFSAgencyCallFilterSection';
import "./index.css";
import MiscellaneousStatusSection from "../../CADComponents/UtilitiesScreen/MiscellaneousStatusSection";
import ResourceStatusColorSection from "../../CADComponents/UtilitiesScreen/ResourceStatusColorSection";
import PrioritySection from "../../CADComponents/UtilitiesScreen/PrioritySection";
import DispositionSection from "../../CADComponents/UtilitiesScreen/DispositionSection";
import OnOffDutyConfiguration from "../../CADComponents/UtilitiesScreen/OnOffDutyConfiguration";
import BoloDispositionSection from "../../CADComponents/UtilitiesScreen/BoloDispositionSection";
import TypeOfBoloSection from "../../CADComponents/UtilitiesScreen/TypeOfBoloSection";
import TypeOfFlagsSection from "../../CADComponents/UtilitiesScreen/TypeOfFlagsSection";
import WhiteboardBadgesSection from "../../CADComponents/UtilitiesScreen/WhiteboardBadgesSection";
import Jurisdiction from "../../CADComponents/UtilitiesScreen/Jurisdiction";
// import ResizableContainer from "../../CADComponents/Common/ResizableContainer";

const CADUtilities = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelect = (eventKey) => {
    navigate(`/cad/utilities/${eventKey}`);
  };

  return (
    <>
      {/* CAD Utilities */}
      <div className="utilities-main-container">
        {/* Tab Controller */}
        <div id="utilities-tab-container">
          {/* Tab Navigation */}
          <Tab.Container
            id="utilities-tabs"
            activeKey={location.pathname.split('/').pop()}
            onSelect={handleSelect}
          >
            <div id="utilities-nav-tabs-container">
              <Nav variant="tabs" className="utilities-nav-tabs">
                <Nav.Item>
                  <Nav.Link eventKey="bolo_disposition">BOLO Disposition</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="incident_disposition">CAD Call Disposition</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="call_for_service_code">Call for Service Code</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="CFS_agency_call_filter">CFS Agency Call Filter</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="hospital_name_code">Hospital Name Code</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="hospital_status_code">Hospital Status Code</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="jurisdiction">Jurisdiction</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="miscellaneous_status">Miscellaneous Status</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="onOffDuty_configuration">On/Off Duty Configuration</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="priority">Priority</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="station_code">Station Code</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="typeof_bolo">Type Of BOLO</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="typeof_flags">Type Of Flags</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="resource">Unit</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="resource_status_color">Unit Status Color</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="resource_type">Unit Type</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="whiteboard_badges">Whiteboard Badges</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="zone">Zone</Nav.Link>
                </Nav.Item>
              </Nav>

            </div>

            {/* Tab Content */}
            <div id="utilities-tab-content-container">
              <Tab.Content className="w-100">
                {location.pathname.endsWith("bolo_disposition") && (
                  <Tab.Pane eventKey="bolo_disposition">
                    <BoloDispositionSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("hospital_status_code") && (
                  <Tab.Pane eventKey="hospital_status_code">
                    <HospitalStatusCodeSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("hospital_name_code") && (
                  <Tab.Pane eventKey="hospital_name_code">
                    <HospitalNameCodeSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("resource") && (
                  <Tab.Pane eventKey="resource">
                    <ResourceSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("resource_type") && (
                  <Tab.Pane eventKey="resource_type">
                    <ResourceTypeSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("zone") && (
                  <Tab.Pane eventKey="zone">
                    <ZoneSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("incident_disposition") && (
                  <Tab.Pane eventKey="incident_disposition">
                    <DispositionSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("onOffDuty_configuration") && (
                  <Tab.Pane eventKey="onOffDuty_configuration">
                    <OnOffDutyConfiguration />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("station_code") && (
                  <Tab.Pane eventKey="station_code">
                    <StationCodeSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("call_for_service_code") && (
                  <Tab.Pane eventKey="call_for_service_code">
                    <CallForServiceCodeSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("CFS_agency_call_filter") && (
                  <Tab.Pane eventKey="CFS_agency_call_filter">
                    <CFSAgencyCallFilterSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("miscellaneous_status") && (
                  <Tab.Pane eventKey="miscellaneous_status">
                    <MiscellaneousStatusSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("resource_status_color") && (
                  <Tab.Pane eventKey="resource_status_color">
                    <ResourceStatusColorSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("typeof_bolo") && (
                  <Tab.Pane eventKey="typeof_bolo">
                    <TypeOfBoloSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("typeof_flags") && (
                  <Tab.Pane eventKey="typeof_flags">
                    <TypeOfFlagsSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("priority") && (
                  <Tab.Pane eventKey="priority">
                    <PrioritySection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("whiteboard_badges") && (
                  <Tab.Pane eventKey="whiteboard_badges">
                    <WhiteboardBadgesSection />
                  </Tab.Pane>
                )}
                {location.pathname.endsWith("jurisdiction") && (
                  <Tab.Pane eventKey="jurisdiction">
                    <Jurisdiction />
                  </Tab.Pane>
                )}
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </div>
      <ConfirmModal />
    </>
  );
};

export default CADUtilities;
