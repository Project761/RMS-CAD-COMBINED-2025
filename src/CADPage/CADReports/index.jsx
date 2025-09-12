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

// Configuration for tabs
const tabsConfig = [
  { key: "bolo_disposition", label: "BOLO Disposition", component: BoloDispositionSection },
  { key: "incident_disposition", label: "CAD Call Disposition", component: DispositionSection },
  { key: "call_for_service_code", label: "Call for Service Code", component: CallForServiceCodeSection },
  { key: "CFS_agency_call_filter", label: "CFS Agency Call Filter", component: CFSAgencyCallFilterSection },
  { key: "hospital_name_code", label: "Hospital Name Code", component: HospitalNameCodeSection },
  { key: "hospital_status_code", label: "Hospital Status Code", component: HospitalStatusCodeSection },
  { key: "miscellaneous_status", label: "Miscellaneous Status", component: MiscellaneousStatusSection },
  { key: "onOffDuty_configuration", label: "On/Off Duty Configuration", component: OnOffDutyConfiguration },
  { key: "priority", label: "Priority", component: PrioritySection },
  { key: "resource", label: "Unit", component: ResourceSection },
  { key: "resource_status_color", label: "Unit Status Color", component: ResourceStatusColorSection },
  { key: "resource_type", label: "Unit Type", component: ResourceTypeSection },
  { key: "station_code", label: "Station Code", component: StationCodeSection },
  { key: "typeof_bolo", label: "Type Of BOLO", component: TypeOfBoloSection },
  { key: "typeof_flags", label: "Type Of Flags", component: TypeOfFlagsSection },
  { key: "zone", label: "Zone", component: ZoneSection },
];

const CADReports = () => {
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
                {tabsConfig.map(({ key, label }) => (
                  <Nav.Item key={key}>
                    <Nav.Link eventKey={key}>{label}</Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </div>

            {/* Tab Content */}
            <div id="utilities-tab-content-container">
              <Tab.Content className="w-100">
                {tabsConfig.map(({ key, component: Component }) => {
                  if (location.pathname.endsWith(key)) {
                    return (
                      <Tab.Pane eventKey={key} key={key}>
                        <Component />
                      </Tab.Pane>
                    );
                  }
                  return null;
                })}
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </div>
      <ConfirmModal />
    </>
  );
};

export default CADReports;
