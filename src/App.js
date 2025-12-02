import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill/dist/quill.snow.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'react-quill/dist/quill.snow.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import DashboardPage from './Pages/DashboardPage';  
import Auth from './Auth';
import Login from './Components/Auth/Login';
import Otp from './Components/Auth/Otp2FA';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ChangePassword from './Components/Auth/ChangePassword';
import LockedUser from './Components/Pages/LockedUser/LockedUser';
import ListManagement from './Components/Pages/Utility/ListManagement/ListManagement';
import ScreenPermision from './Components/Pages/Utility/SecurityManager/ScreenPermission/ScreenPermision';
import { ToastContainer } from 'react-toastify';
import AgencyTab from './Components/Pages/Agency/ModalTest/AgencyTab';
import PersonnelTab from './Components/Pages/PersonnelCom/PersonnelModal/PersonnelTab';
import ListPermission from './Components/Pages/Utility/ListPermission';
import CounterTable from './Components/Pages/Utility/CounterTable/CounterTable';
import Incident from './Components/Pages/Incident/Incident';
import OffenceHomeTabs from './Components/Pages/Offense/OffenceTab/OffenseUpdateTabs';
import NameTab from './Components/Pages/Name/NameTab';
import Gang_Add_Up from './Components/Pages/Name/NameTab/Gang/GangAddUp';
import Victim from './Components/Pages/Name/NameTab/Victim/Victim';
import Arrest_Add_Up from './Components/Pages/Arrest/Arrest_Add_Up';
import ChargeAddUp from './Components/Pages/Arrest/ArrestTab/Charges/ChargeAddUp';
import Property from './Components/Pages/Property/Property';
import Property_Tabs from './Components/Pages/Property/Property_Tabs';
import Vehicle from './Components/Pages/Vehicle/Vehicle';
import Vehicle_Add_Up from './Components/Pages/Vehicle/Vehicle_Add_Up';
import Booking from './Components/Pages/Arrest/Booking/Booking';
import ProgressPage from './Components/Pages/ProgressPage/ProgressPage';
import NameReport from './Components/Pages/ReportPage/NameReport/NameReport';
import PropertyReport from './Components/Pages/ReportPage/PropertyReport/PropertyReport';
import DailyEvent from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/DailyEvent';
import IncidentLocation from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentLocation';
import IncidentMonthly from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentMonthly';
import MasterIncident from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/MasterIncident';
import NameInformation from './Components/Pages/ReportPage/NameReport/NameInformation';
import Warrant from './Components/Pages/Warrant/Warrant';
import WarrantTab from './Components/Pages/Warrant/WarrantTab';
import ReportsMain from './Components/Pages/ReportPage/IncidentReport/ReportsMain';
import ListNewPage from './Components/Pages/ListNewPage/ListNewPage';
import SearchAdvancePage from './Components/Pages/SearchAdvancePage/SearchAdvancePage';
import IncidentSearchPage from './Components/Pages/SearchAdvancePage/IncidentSearchPage/IncidentSearchPage';
import NameSearchPage from './Components/Pages/SearchAdvancePage/NameSearchPage/NameSearchPage';
import PropertySearchPage from './Components/Pages/SearchAdvancePage/PropertySearchPage/PropertySearchPage';
import ArrestSearchPage from './Components/Pages/SearchAdvancePage/ArrestSearchPage/ArrestSearchPage';
import IncidentOfficer from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentOfficer';
import IncidentMedia from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentMedia';
import ArrestMaster from './Components/Pages/ReportPage/ArrestReport/ArrestMaster';
import IncidentPublic from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentPublic';
import ArrestByCharge from './Components/Pages/ReportPage/ArrestReport/ArrestByCharge';
import ArrestIncident from './Components/Pages/ReportPage/ArrestReport/ArrestIncident';
import ArrestMonthly from './Components/Pages/ReportPage/ArrestReport/ArrestMonthly';
import ArrestMonthlyCharge from './Components/Pages/ReportPage/ArrestReport/ArrestMonthlyCharge';
import WarrantExpired from './Components/Pages/ReportPage/WarrantReport/WarrantExpired';
import WarrantMonthly from './Components/Pages/ReportPage/WarrantReport/WarrantMonthly';
import VehicleSearchPage from './Components/Pages/SearchAdvancePage/VehicleSearchPage/VehicleSearchPage';
import VehicleMasterReport from './Components/Pages/ReportPage/VehicleReport/VehicleMasterReport';
import MasterPropertyReport from './Components/Pages/ReportPage/PropertyReport/MasterPropertyReport';
import ReportsSide from './Components/Pages/ReportPage/IncidentReport/ReportsSide';
import WarrantChargeAddUp from './Components/Pages/Warrant/WarrantTab/Charges/WarrantChargeAddUp';
import IncidentEdittable from './Components/Pages/Utility/SecurityManager/IncidentEdittable';
import PreviousYearCounter from './Components/Pages/Utility/PreviousYearCounter/PreviousYearCounter';
import FieldInterview from './Components/Pages/FieldInterview/FieldInterview';
import ThemeSetting from './Components/Inc/ThemeSetting';
import IncidentTab from './Components/Pages/Incident/IncidentTab';
import Log from './Components/Pages/Log/Log';
import Dictionary from './Components/Pages/Dictionary/Dictionary';
import AssaultInjuryCom from './Components/Pages/Name/NameTab/Offender/OffenderTab/AllTabCom/AssaultInjuryCom';
import MissingPersonTab from './Components/Pages/MissingPerson/MissingPersonTab';
import MissingPersonVehicle from './Components/Pages/MissingPerson/MissingPersonVehicle/MissingPersonVehicle';
import PropertyRoomTab from './Components/Pages/PropertyRoom/PropertyRoomTab';
import TreeComponent from './Components/Pages/PropertyRoom/PropertyRoomTab/TreeComponent/TreeComponent';
import FieldNarrative from './Components/Pages/FieldInterview/FieldInterviewTab/FieldNarrative/FieldNarrative';
import FieldNotes from './Components/Pages/FieldInterview/FieldInterviewTab/FieldNotes/FieldNotes';
import Citation from './Components/Pages/Ticket/Citation';
import CitationAdditional from './Components/Pages/Ticket/CitationAdditional/CitationAdditional';
import CitationNotes from './Components/Pages/Ticket/CitationNotes/CitationNotes';
import CitationDocument from './Components/Pages/Ticket/CitationDocument/CitationDocument';
import CitationCharge from './Components/Pages/Ticket/CitationCharge/CitationCharge';
import Expunge from './Components/Pages/Expunge/Expunge';
import NameConsolidation from './Components/Pages/Consolidation/NameConsolidation/NameConsolidation';
import AlertMaster from './Components/Pages/AlertMaster/AlertMaster';
import PropertyConsolidation from './Components/Pages/Consolidation/PropertyConsolidation/PropertyConsolidation';
import VehicleConsolidation from './Components/Pages/Consolidation/VehicleConsolidation/VehicleConsolidation';
import PropertySearch from './Components/Pages/SearchAdvancePage/PropertySearchPage/PropertySearch';
import NameSearch from './Components/Pages/SearchAdvancePage/NameSearchPage/NameSearch';
import VehicleSearch from './Components/Pages/SearchAdvancePage/VehicleSearchPage/VehicleSearch';
import ArrestSearch from './Components/Pages/SearchAdvancePage/ArrestSearchPage/ArrestSearch';
import HateCrimeIncReport from './Components/Pages/UCR/UCR23HateCrimeReport';
import UCR7Report from './Components/Pages/UCR/UCR7SexualAsaultReport';
import UCR10Report from './Components/Pages/UCR/UCR10FamilyViolenceReport';
import UCR84Report from './Components/Pages/UCR/UCR84DrugTypeReport';
import StateReport from './Components/Pages/ReportPage/StateReport/StateReport';
import IncidentTotalByCode from './Components/Pages/ReportPage/IncidentReport/IncidentPrint/IncidentTotalByCode';
import ArrestSummary from './Components/Pages/ReportPage/ArrestReport/ArrestSummary';
import OffenderVictim from './Components/Pages/OffenderVicitm/OffenderVictim';
import ChainOfCustodyReport from './Components/Pages/ReportPage/PropertyReport/ChainOfCustodyReport';
import PropertyInventoryReport from './Components/Pages/ReportPage/PropertyReport/PropertyInventoryReport';
import SealUnseal from './Components/Pages/SealUnseal/SealUnseal';
import WhiteBoard from './Components/Pages/WhiteBoardTab/WhiteBoard';

// CAD
import './CADApp.css';
import CADAuth from './CADAuth';
import CADDashboard from './CADPage/CADDashboard';
import CADUtilities from './CADPage/CADUtilities';
import CADMap from './CADPage/CADMap';
import CADDispatcher from './CADPage/CADDispatcher';
import Document_Add_Up from './Components/Pages/Document/Document_Add_Up';


import IncidentTabSection from './CADComponents/MonitorScreen/TabSections/IncidentTabSection';

import CADNameSearch from './CADPage/CADNameSearch';

import CADPropertySearch from './CADPage/CADPropertySearch';

import CADVehicleSearch from './CADPage/CADVehicleSearch';

import EventSearch from './CADPage/EventSearch';

import CADEventSearch from './CADPage/CADEventSearch';

import ResourceSearch from './CADPage/ResourceSearch';

import CADResourceSearch from './CADPage/CADResourceSearch';

// CJIS Certification Search
import CertificationSearchPage from './Components/Pages/SearchAdvancePage/CertificationSearchPage/CertificationSearchPage';

import EventSearchPage from './CADComponents/EventSearchPage';

import ResourceSearchPage from './CADComponents/ResourceSearchPage';
import UnExpunge from './Components/Pages/UnExpunge/UnExpunge';
import UnConsolidation from './Components/Pages/UnConsolidation/UnConsolidation';
import CertificationSearchList from './Components/Pages/SearchAdvancePage/CertificationSearchList';
import MissingDocument_Add_Up from './Components/Pages/MissingPerson/MissingDocumentTab/MissingDocument_Add_Up';
import NibrsHome from './Components/Pages/NIBRS_Report_Model/Home/NibrsHome';
import Administrative_Details from './Components/Pages/NIBRS_Report_Model/Home/Administrative_Details';
import Offense from './Components/Pages/Name/NameTab/Offense/Offense';
import MainOffender from './Components/Pages/NIBRS_Report_Model/Home/MinOffender';
import MainVictims from './Components/Pages/NIBRS_Report_Model/Home/MainVictims';
import Properties from './Components/Pages/NIBRS_Report_Model/Home/Properties';
import Arrestees from './Components/Pages/NIBRS_Report_Model/Home/Arrestees';
import CadIncidentList from './Components/Pages/CadIncidents/CadIncidentList';
import CadpropertyList from './Components/Pages/CadIncidents/CadpropertyList';
import CadPropertyModel from './Components/Pages/CadIncidents/CadPropertyModel';

import EventReceiveSourceReport from './CADComponents/Reports/EventReceiveSourceReport';
import CallLogReport from './CADComponents/Reports/CallLogReport';
import PremisesHistoryReport from './CADComponents/Reports/PremisesHistoryReport';
import ResourceHistoryReport from './CADComponents/Reports/ResourceHistoryReport';
import LocationReport from './CADComponents/Reports/LocationReport';
import OnOffDutyResourceReport from './CADComponents/Reports/OnOffDutyResourceReport';
import LocationFlagDetailsReports from './CADComponents/Reports/LocationFlagDetailsReports';
import CADQueueCall from './CADPage/CADQueueCall';
import UnverifiedLocationList from './CADPage/UnverifiedLocation';
import MiscStatusResourceReport from './CADComponents/Reports/MiscStatusResourceReport';
import ShiftDetailedReport from './CADComponents/Reports/ShiftDetailedReport';
import ShiftSummaryReport from './CADComponents/Reports/ShiftSummaryReport';
import MasterEventReport from './CADComponents/Reports/MasterEventReport';
import CFSAnalysisReport from './CADComponents/Reports/CFSAnalysisReport';
import PatrolZoneReport from './CADComponents/Reports/PatrolZoneReport';
import EventPeakTimeReport from './CADComponents/Reports/EventPeakTimeReport';
import CallTakerActivityReport from './CADComponents/Reports/CallTakerActivityReport';
import OfficerActivityReport from './CADComponents/Reports/OfficerActivityReport';
import CitationTab from './Components/Pages/Citation/CitationTab';
import DocumentTab from './Components/Pages/Citation/DocumentTab';
import OnOffDutyOfficerReport from './CADComponents/Reports/OnOffDutyOfficerReport';
import DispatchQueueWaitTimeReport from './CADComponents/Reports/DispatchQueueWaitTimeReport';
import CloseCallReport from './CADComponents/Reports/CloseCallReport';
import DailyCallSummaryReport from './CADComponents/Reports/DailyCallSummaryReport';
import CallDispatchSummaryReport from './CADComponents/Reports/CallDispatchSummaryReport';
import CFSSummaryReport from './CADComponents/Reports/CFSSummaryReport';
import DispatcherActivityReport from './CADComponents/Reports/DispatcherActivityReport';
import NonPropertyStorageList from './Components/Pages/CadIncidents/NonPropertyStorageList';
import ApprovedReports from './Components/Pages/ApprovedReports/ApprovedReports';
import RejectedReports from './Components/Pages/RejectedReports/RejectedReports';
import PastDueReports from './Components/Pages/PastDueReports/PastDueReports';
import QueueReports from './Components/Pages/QueueReports/QueueReports';
import NIBRSAudit from './Components/Pages/NIBRSAudit/NIBRSAudit';
import AssignedReports from './Components/Pages/AssignedReports/AssignedReports';
import CloseHistory from './Components/Pages/CloseHistory/CloseHistory';
import PoliceForceTask from './Components/Pages/Arrest/PoliceForceTask/PoliceForceTask';
import CADWhiteboard from './CADPage/CADWhiteboard';
import DashboardAllReports from './Components/Pages/DashboardAllReports/DashboardAllReports';
import PropertyEvidenceReport from './Components/Pages/PropertyEvidenceReport/PropertyEvidenceReport';
import IncompleteNibrsIncident from './Components/Pages/IncompleteNibrsIncident/IncompleteNibrsIncident';
import NLETShistory from './Components/Pages/NLETShistory/NLETShistory';
import DashboardAll from './Components/Pages/AllReport/AllReport';
import PropertyAuditTab from './Components/Pages/Audit/Home';
import Property_RoomTab from './Components/Pages/Audit/Audit_RoomTab';
import CaseManagement from './CADPage/CaseManagement';
import MissingPersonForm from './Components/Pages/MissingPerson/MissingPersonForm/MissingPersonForm';
import ReportModule from './Components/Pages/ReportModule/ReportModule';
import HomeCaseManagement from './CADPage/HomeCaseManagement';
import ManualPurgeRequest from './CADComponents/CaseManagement/components/manualPurgeRequest';
// import PropertyAuditTab from './Components/Pages/PropertyRoom/Audit/Home';
function App() {
  const [otp, setOtp] = useState("");
  const [loginResData, setLoginResData] = useState([]);
  const [dashboardSidebar] = useState(true);
  const [listManagementSideBar] = useState(true);
  const [agencySideBar] = useState(true);
  const [incidentSideBar] = useState(true);
  const [consolidationSideBar] = useState(true);
  const [reportSidebar] = useState(true);
  const [searchSidebar] = useState(true);
  const [propertyRoomSideBar] = useState(true);
  const [expungeSideBar] = useState(true);
  const [propertyStorageSideBar] = useState(true);

  const send_Otp = (otp, data) => {
    setOtp(otp); setLoginResData(data);
  };

  const [progressStatus, setProgressStatus] = useState(0);

  return (
    <>
      {/*  -------------------------------- Routes------------------   */}
      <BrowserRouter>
        <div id="main_content" className='no-select'>
          <Routes>
            <Route exact path="/" element={<Login {...{ send_Otp }} />} />
            <Route exact path="/otp" element={<Otp {...{ otp, loginResData }} />} />
            <Route exact path="/TreeComponent" element={<TreeComponent />} />
            <Route exact path="/forgot-Password" element={<ForgotPassword />} />
            {/* 2FA Section */}
            <Route exact path="/change-Password" element={<ChangePassword />} />
            <Route exact path="/dashboard-page" element={<Auth cmp={DashboardPage} path='/dashboard-page' dashboardSidebar={dashboardSidebar} />} />

            <Route exact path="/agencyTab" element={<Auth cmp={AgencyTab} path="/agencyTab" agencySideBar={agencySideBar} />} />
            <Route exact path="/citationTab" element={<Auth cmp={CitationTab} path="/citationTab" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/documentTab" element={<Auth cmp={DocumentTab} path="/documentTab" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/Property-room" element={<Auth cmp={PropertyRoomTab} path="/Property-room" propertyRoomSideBar={propertyRoomSideBar} />} />
            <Route exact path="/personnelTab" element={<Auth cmp={PersonnelTab} path="/personnelTab" agencySideBar={agencySideBar} />} />
            <Route exact path="/LockedUser" element={<Auth cmp={LockedUser} path="/LockedUser" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/ListManagement" element={<Auth cmp={ListManagement} listManagementSideBar={listManagementSideBar} path="/ListManagement" />} />

            <Route exact path="/security-manager" element={<Auth cmp={ScreenPermision} path="/security-manager" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/Editable-Incident" element={<Auth cmp={IncidentEdittable} path="/Editable-Incident" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/ListPermission" element={<Auth cmp={ListPermission} path="/ListPermission" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/CounterTable" element={<Auth cmp={CounterTable} path="/CounterTable" dashboardSidebar={dashboardSidebar} />} />

            <Route exact path="/PreviousYearCounter" element={<Auth cmp={PreviousYearCounter} path="/PreviousYearCounter" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/theme" element={<Auth cmp={ThemeSetting} path='/theme' dashboardSidebar={dashboardSidebar} />} />
            {/* --------------------------------------------LOG Tab------------------------------------------------- */}
            <Route exact path="/Log-Home" element={<Auth cmp={Log} path="/Log-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Dictionary" element={<Auth cmp={Dictionary} path="/Dictionary" />} />
            { /* -------------------- Property Room Storage ---- */}
            <Route exact path="/Property-Room-Storage" element={<Auth cmp={CadpropertyList} path="/Property-Room-Storage" propertyStorageSideBar={propertyStorageSideBar} />} />
            <Route exact path="/Non-Property-Room-Storage" element={<Auth cmp={NonPropertyStorageList} path="/Non-Property-Room-Storage" propertyStorageSideBar={propertyStorageSideBar} />} />
            <Route exact path="/Expunge" element={<Auth cmp={Expunge} path="/Expunge" expungeSideBar={expungeSideBar} />} />
            <Route exact path="/UnExpunge" element={<Auth cmp={UnExpunge} path="/UnExpunge" expungeSideBar={expungeSideBar} />} />
            <Route exact path="/Alert-Master" element={<Auth cmp={AlertMaster} path="/Alert-Master" />} />
            <Route exact path="/Name-Consolidation" element={<Auth cmp={NameConsolidation} path="/Name-Consolidation" consolidationSideBar={consolidationSideBar} />} />
            <Route exact path="/Property-Consolidation" element={<Auth cmp={PropertyConsolidation} path="/Property-Consolidation" consolidationSideBar={consolidationSideBar} />} />
            <Route exact path="/Vehicle-Consolidation" element={<Auth cmp={VehicleConsolidation} path="/Vehicle-Consolidation" consolidationSideBar={consolidationSideBar} />} />
            <Route exact path="/UnConsolidation" element={<Auth cmp={UnConsolidation} path="/UnConsolidation" consolidationSideBar={consolidationSideBar} />} />
            {/* seal */}
            <Route exact path="/Seal-unseal" element={<Auth cmp={SealUnseal} path="/Seal-unseal" />} />

            {/* abhi */}
            <Route exact path="/PropertyEvidenceReport" element={<Auth cmp={PropertyEvidenceReport} path="/PropertyEvidenceReport" />} />


            {/* --------------------------------------- Incident Tab------------------------------------   */}
            <Route exact path="/incident" element={<Auth cmp={Incident} path="/incident" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/approved-Reports" element={<Auth cmp={ApprovedReports} path="/approved-Reports" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/rejected-Reports" element={<Auth cmp={RejectedReports} path="/rejected-Reports" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/pastDue-Reports" element={<Auth cmp={PastDueReports} path="/pastDue-Reports" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/CadincidentList" element={<Auth cmp={CadIncidentList} path="/CadincidentList" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/queue-Reports" element={<Auth cmp={QueueReports} path="/queue-Reports" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/dashboard-Reports" element={<Auth cmp={DashboardAllReports} path="dashboard-Reports" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/assigned-Reports" element={<Auth cmp={AssignedReports} path="/assignedReports" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/all" element={<Auth cmp={DashboardAll} path="/all" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/assigned-Incompletenibrs" element={<Auth cmp={IncompleteNibrsIncident} path="/assigned-Incompletenibrs" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/manual-purge-request" element={<Auth cmp={ManualPurgeRequest} path="/manual-purge-request" dashboardSidebar={dashboardSidebar} />} />

            <Route exact path="/PoliceForceTask" element={<Auth cmp={PoliceForceTask} patIncompleteNibrsIncidenth="/PoliceForceTask" dashboardSidebar={dashboardSidebar} />} />

            <Route exact path="/Cadpropertymodal" element={<Auth cmp={CadPropertyModel} path="/Cadpropertymodal" dashboardSidebar={dashboardSidebar} />} />
            <Route exact path="/Inc-Home" element={<Auth cmp={IncidentTab} path="/Inc-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/inc-case-management" element={<Auth cmp={CaseManagement} path="/inc-case-management" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/case-management" element={<Auth cmp={HomeCaseManagement} path="case-management" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Missing-Home" element={<Auth cmp={MissingPersonTab} path="/Missing-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Missing-Vehicle-Home" element={<Auth cmp={MissingPersonVehicle} path="/Missing-Vehicle-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Missing-Person-Form" element={<Auth cmp={MissingPersonForm} path="/Missing-Person-Form" incidentSideBar={incidentSideBar} />} />

            {/* //------------------------------------Dinesh------------------------------------ */}
            <Route exact path="/Missing-Document-Home" element={<Auth cmp={MissingDocument_Add_Up} path="/Missing-Document-Home" incidentSideBar={incidentSideBar} />} />


            {/* --------------------------------------- offense Tab------------------------------------   */}
            <Route exact path="/Off-Home" element={<Auth cmp={OffenceHomeTabs} path="/Off-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Inc-Report" element={<Auth cmp={ReportModule} path="/Inc-Report" incidentSideBar={incidentSideBar} />} />
            {/* --------------------------------------- name Tab------------------------------------   */}
            <Route exact path="/Name-Home" element={<Auth cmp={NameTab} path="/Name-Home" incidentSideBar={incidentSideBar} />} />
            {/* --------------------------------------- property Tab------------------------------------   */}
            <Route exact path="/Prop-Home" element={<Auth cmp={Property_Tabs} path="/Prop-Home" incidentSideBar={incidentSideBar} />} />
            {/* --------------------------------------- arrest Tab------------------------------------   */}

            <Route exact path="/Arrest-Home" element={<Auth cmp={Arrest_Add_Up} path="/Arrest-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Property-Audit" element={<Auth cmp={Property_RoomTab} path="/Property-Audit" propertyRoomSideBar={propertyRoomSideBar} />} />



            <Route exact path="/Arr-Charge-Home" element={<Auth cmp={ChargeAddUp} path="/Arr-Charge-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Vehicle-Home" element={<Auth cmp={Vehicle_Add_Up} path="/Vehicle-Home" incidentSideBar={incidentSideBar} />} />
            {/* //----------------------Document Home--------------------------- */}
            <Route exact path="/Document-Home" element={<Auth cmp={Document_Add_Up} path="/Document-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Offvic-Home" element={<Auth cmp={OffenderVictim} path="/Offvic-Home" incidentSideBar={incidentSideBar} />} />

            <Route exact path="/field-interview" element={<Auth cmp={FieldInterview} path="/field-interview" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Field-Narrative-Home" element={<Auth cmp={FieldNarrative} path="/Field-Narrative-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Field-Notes-Home" element={<Auth cmp={FieldNotes} path="/Field-Notes-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Citation-Home" element={<Auth cmp={Citation} path="/Citation-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Citation-Notes" element={<Auth cmp={CitationNotes} path="/Citation-Notes" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Citation-Document" element={<Auth cmp={CitationDocument} path="/Citation-Document" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Citation-Additional" element={<Auth cmp={CitationAdditional} path="/Citation-Additional" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Citation-Charge-Home" element={<Auth cmp={CitationCharge} path="/Citation-Charge-Home" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/ganghome" element={<Auth cmp={Gang_Add_Up} path="/ganghome" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/victim" element={<Auth cmp={Victim} path="/victim" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/offender" element={<Auth cmp={AssaultInjuryCom} path="/offender" incidentSideBar={incidentSideBar} />} />

            <Route exact path="/booking" element={<Auth cmp={Booking} path="/booking" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/warrant-chargetab" element={<Auth cmp={WarrantChargeAddUp} path="/warrant-chargetab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/property" element={<Auth cmp={Property} path="/property" incidentSideBar={incidentSideBar} />} />

            <Route exact path="/vehicle" element={<Auth cmp={Vehicle} path="/vehicle" incidentSideBar={incidentSideBar} />} />



            <Route exact path="/progress-testing" element={<Auth cmp={ProgressPage} {...{ setProgressStatus, progressStatus }} path="/progress-testing" />} />


            {/* ---------------------------------------------- Incident-Reports ------------------------------------- */}
            <Route exact path="/incident-DailyEvent" element={<Auth cmp={DailyEvent} reportSidebar={reportSidebar} path="/incident-DailyEvent" />} />  
            <Route exact path="/incident-Location" element={<Auth cmp={IncidentLocation} reportSidebar={reportSidebar} path="/incident-Location" />} />
            <Route exact path="/incident-Monthly" element={<Auth cmp={IncidentMonthly} reportSidebar={reportSidebar} path="/incident-Monthly" />} />
            <Route exact path="/incident-Master" element={<Auth cmp={MasterIncident} reportSidebar={reportSidebar} path="/incident-Master" />} />
            <Route exact path="/incident-Officer" element={<Auth cmp={IncidentOfficer} reportSidebar={reportSidebar} path="/incident-Officer" />} />
            <Route exact path="/incident-media" element={<Auth cmp={IncidentMedia} reportSidebar={reportSidebar} path="/incident-media" />} />
            <Route exact path="/incident-public" element={<Auth cmp={IncidentPublic} reportSidebar={reportSidebar} path="/incident-public" />} />
            <Route exact path="/incident-code" element={<Auth cmp={IncidentTotalByCode} reportSidebar={reportSidebar} path="/incident-code" />} />

            {/* ---------------------------------------------------- Name-Reports ----------------------------------- */}
            <Route exact path="/name-history" element={<Auth cmp={NameReport} path="/name-history" reportSidebar={reportSidebar} />} />
            <Route exact path="/name-information" element={<Auth cmp={NameInformation} path="/name-information" reportSidebar={reportSidebar} />} />

            {/* ---------------------------------------------- Arrest-Reports -------------------------- */}
            <Route exact path="/arrest-master" element={<Auth cmp={ArrestMaster} path="/arrest-master" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-charge" element={<Auth cmp={ArrestByCharge} path="/arrest-charge" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-incident" element={<Auth cmp={ArrestIncident} path="/arrest-incident" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-monthly" element={<Auth cmp={ArrestMonthly} path="/arrest-monthly" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-monthlyCharge" element={<Auth cmp={ArrestMonthlyCharge} path="/arrest-monthlyCharge" reportSidebar={reportSidebar} />} />
            <Route exact path="/arrest-summary" element={<Auth cmp={ArrestSummary} path="/arrest-summary" reportSidebar={reportSidebar} />} />

            {/*------------------------------------------------ Property-Reports ----------------------------------- */}
            <Route exact path="/property-reports" element={<Auth cmp={PropertyReport} path="/property-reports" reportSidebar={reportSidebar} />} />
            <Route exact path="/property-master" element={<Auth cmp={MasterPropertyReport} path="/property-master" reportSidebar={reportSidebar} />} />
            <Route exact path="/chaincustody-report" element={<Auth cmp={ChainOfCustodyReport} path="/chaincustody-report" reportSidebar={reportSidebar} />} />
            <Route exact path="/propertyInventory-report" element={<Auth cmp={PropertyInventoryReport} path="/propertyInventory-report" reportSidebar={reportSidebar} />} />

            {/*------------------------------------------------------ Warrant-Reports --------------------------------------- */}
            <Route exact path="/warrant-expired" element={<Auth cmp={WarrantExpired} path="/warrant-expired" reportSidebar={reportSidebar} />} />
            <Route exact path="/warrant-monthly" element={<Auth cmp={WarrantMonthly} path="/warrant-monthly" reportSidebar={reportSidebar} />} />

            {/* --------------------------------------------- Vehicle-Reports --------------------------------------------- */}
            <Route exact path="/vehicle-master" element={<Auth cmp={VehicleMasterReport} path="/vehicle-master" reportSidebar={reportSidebar} />} />
            <Route exact path="/state" element={<Auth cmp={StateReport} path="/state" reportSidebar={reportSidebar} />} />
            <Route exact path="/warrant" element={<Auth cmp={Warrant} path="/warrant" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/warrant-tab" element={<Auth cmp={WarrantTab} path="/warrant-tab" incidentSideBar={incidentSideBar} />} />
            <Route exact path="/Reports" element={<Auth cmp={ReportsMain} path="/Reports" reportSidebar={reportSidebar} />} />
            <Route exact path="/ReportsMain" element={<Auth cmp={ReportsSide} path="/ReportsMain" reportSidebar={reportSidebar} />} />
            <Route exact path="/newreports" element={<ListNewPage />} />

            {/* --------------------------------------------- SearchPage --------------------------------------------- */}
            <Route exact path="/Search" element={<Auth cmp={SearchAdvancePage} path="/Search" searchSidebar={searchSidebar} />} />
            <Route exact path="/incident-advanceSearch" element={<Auth cmp={IncidentSearchPage} path="/incident-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/name-advanceSearch" element={<Auth cmp={NameSearchPage} path="/name-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/property-advanceSearch" element={<Auth cmp={PropertySearchPage} path="/property-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/arrest-advanceSearch" element={<Auth cmp={ArrestSearchPage} path="/arrest-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/vehicle-advanceSearch" element={<Auth cmp={VehicleSearchPage} path="/vehicle-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/certification-advanceSearch" element={<Auth cmp={CertificationSearchPage} path="/certification-advanceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/certification-SearchList" element={<Auth cmp={CertificationSearchList} path="/certification-SearchList" searchSidebar={searchSidebar} />} />
            <Route exact path="/property-search" element={<Auth cmp={PropertySearch} path="/property-search" searchSidebar={searchSidebar} />} />
            <Route exact path="/arrest-search" element={<Auth cmp={ArrestSearch} path="/arrest-search" searchSidebar={searchSidebar} />} />
            <Route exact path="/namesearch" element={<Auth cmp={NameSearch} path="/namesearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/vehicle-search" element={<Auth cmp={VehicleSearch} path="/vehicle-search" searchSidebar={searchSidebar} />} />

            {/* UCR Report */}
            <Route exact path="/Sexual-Assault-Checklist-Report-7" element={<Auth cmp={UCR7Report} path="/ucr-report" />} />
            <Route exact path="/Hate-Crime-Incident-Report-23" element={<Auth cmp={HateCrimeIncReport} path="/ucr-report" />} />
            <Route exact path="/Family-Violence-Checklist-Report-10" element={<Auth cmp={UCR10Report} path="/ucr-report" />} />
            <Route exact path="/Drug-Type-And-Quantity-Report-84" element={<Auth cmp={UCR84Report} path="/ucr-report" />} />





            {/* Nibrs */}
            <Route Route exact path="/nibrs-Home" element={<Auth cmp={NibrsHome} path="/nibrs-Home" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/Administrative_Details" element={<Auth cmp={Administrative_Details} path="/Administrative_Details" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/Offense" element={<Auth cmp={Offense} path="/Offense" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/MainOffender" element={<Auth cmp={MainOffender} path="/MainOffender" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/MainVictims" element={<Auth cmp={MainVictims} path="/MainVictims" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/Properties" element={<Auth cmp={Properties} path="/Properties" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/Arrestees" element={<Auth cmp={Arrestees} path="/Arrestees" incidentSideBar={incidentSideBar} />} />

            <Route Route exact path="/NIBRSAudit-Home" element={<Auth cmp={NIBRSAudit} path="/NIBRSAudit-Home" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/CloseHistory-Home" element={<Auth cmp={CloseHistory} path="/CloseHistory-Home" incidentSideBar={incidentSideBar} />} />
            <Route Route exact path="/NLETShistory-Home" element={<Auth cmp={NLETShistory} path="/NLETShistory-Home" incidentSideBar={incidentSideBar} />} />

            <Route exact path="/WhiteBoardTab" element={<Auth cmp={WhiteBoard} path="/WhiteBoard" searchSidebar={incidentSideBar} />} />


            {/* CAD */}
            <Route exact path="/cad/dashboard-page" element={<CADAuth cmp={CADDashboard} path="/cad/dashboard-page" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/dispatcher" element={<CADAuth cmp={CADDispatcher} path="/cad/dispatcher" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/hospital_status_code" element={<CADAuth cmp={CADUtilities} listManagementSideBar={listManagementSideBar} path="/cad/utilities/hospital_status_code" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/hospital_name_code" element={<CADAuth cmp={CADUtilities} listManagementSideBar={listManagementSideBar} path="/cad/utilities/hospital_name_code" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/resource" element={<CADAuth cmp={CADUtilities} listManagementSideBar={listManagementSideBar} path="/cad/utilities/resource" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/resource_type" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/resource_type" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/zone" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/zone" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/incident_disposition" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/incident_disposition" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/onOffDuty_configuration" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/onOffDuty_configuration" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/station_code" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/station_code" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/call_for_service_code" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/call_for_service_code" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/CFS_agency_call_filter" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/CFS_agency_call_filter" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/miscellaneous_status" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/miscellaneous_status" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/resource_status_color" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/resource_status_color" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/priority" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/priority" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/bolo_disposition" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/bolo_disposition" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/whiteboard_badges" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/whiteboard_badges" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/jurisdiction" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/jurisdiction" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/typeof_bolo" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/typeof_bolo" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/utilities/typeof_flags" element={<CADAuth cmp={CADUtilities} path="/cad/utilities/typeof_flags" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/map" element={<CADAuth cmp={CADMap} path="/cad/map" hideHeader />} />
            <Route exact path="/cad/dispatcher/event-info" element={<CADAuth cmp={IncidentTabSection} path="/cad/dispatcher/event-info" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/query_incident/nameSearch" element={<CADAuth cmp={NameSearchPage} path="/cad/query_incident/nameSearch" searchSidebar={searchSidebar} isCAD />} />
            <Route exact path="/cad/nameSearchList" element={<CADAuth cmp={NameSearch} path="/cad/nameSearchList" searchSidebar={searchSidebar} isCAD />} />
            <Route exact path="/cad/name-search" element={<CADAuth cmp={CADNameSearch} path="/cad/name-search" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/query_incident/propertySearch" element={<CADAuth cmp={PropertySearchPage} path="/cad/query_incident/propertySearch" searchSidebar={searchSidebar} isCAD />} />
            <Route exact path="/cad/propertySearchList" element={<CADAuth cmp={PropertySearch} path="/cad/propertySearchList" searchSidebar={searchSidebar} isCAD />} />
            <Route exact path="/cad/property_search" element={<CADAuth cmp={CADPropertySearch} path="/cad/property_search" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/query_incident/vehicleSearch" element={<CADAuth cmp={VehicleSearchPage} path="/cad/query_incident/vehicleSearch" searchSidebar={searchSidebar} isCAD />} />
            <Route exact path="/cad/vehicleSearchList" element={<CADAuth cmp={VehicleSearch} path="/cad/vehicleSearchList" searchSidebar={searchSidebar} isCAD />} />
            <Route exact path="/cad/vehicle_search" element={<CADAuth cmp={CADVehicleSearch} path="/cad/vehicle_search" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/query_incident/eventSearch" element={<CADAuth cmp={EventSearchPage} path="/cad/query_incident/eventSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/eventSearchList" element={<CADAuth cmp={EventSearch} path="/cad/eventSearchList" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/event-search" element={<CADAuth cmp={CADEventSearch} path="/cad/event-search" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/query_incident/resourceSearch" element={<CADAuth cmp={ResourceSearchPage} path="/cad/query_incident/resourceSearch" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/patrol-zone" element={<CADAuth cmp={PatrolZoneReport} path="/cad/reports/patrol-zone" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/resourceSearchList" element={<CADAuth cmp={ResourceSearch} path="/cad/resourceSearchList" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/unverified-location" element={<CADAuth cmp={UnverifiedLocationList} path="/cad/unverified-location" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/resource-search" element={<CADAuth cmp={CADResourceSearch} path="/cad/resource-search" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/event-receive-source" element={<CADAuth cmp={EventReceiveSourceReport} path="/cad/reports/event-receive-source" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/master-event-report" element={<CADAuth cmp={MasterEventReport} path="/cad/reports/master-event-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/cfs-analysis" element={<CADAuth cmp={CFSAnalysisReport} path="/cad/reports/cfs-analysis" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/cfs-summary" element={<CADAuth cmp={CFSSummaryReport} path="/cad/reports/cfs-summary" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/call-log-report" element={<CADAuth cmp={CallLogReport} path="/cad/reports/call-log-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/premises-history-report" element={<CADAuth cmp={PremisesHistoryReport} path="/cad/reports/premises-history-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/resource-history-report" element={<CADAuth cmp={ResourceHistoryReport} path="/cad/reports/resource-history-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/onoff-duty-resource-report" element={<CADAuth cmp={OnOffDutyResourceReport} path="/cad/reports/onoff-duty-resource-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/shift-detailed-report" element={<CADAuth cmp={ShiftDetailedReport} path="/cad/reports/shift-detailed-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/shift-summary-report" element={<CADAuth cmp={ShiftSummaryReport} path="/cad/reports/shift-summary-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/location-report" element={<CADAuth cmp={LocationReport} path="/cad/reports/location-report" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/location-flag-details" element={<CADAuth cmp={LocationFlagDetailsReports} path="/cad/reports/location-flag-details" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/call-taker-activity" element={<CADAuth cmp={CallTakerActivityReport} path="/cad/reports/call-taker-activity" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/officer-activity" element={<CADAuth cmp={OfficerActivityReport} path="/cad/reports/officer-activity" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/daily-call-summary" element={<CADAuth cmp={DailyCallSummaryReport} path="/cad/reports/daily-call-summary" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/call-dispatch-summary" element={<CADAuth cmp={CallDispatchSummaryReport} path="/cad/reports/call-dispatch-summary" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/dispatcher-activity" element={<CADAuth cmp={DispatcherActivityReport} path="/cad/reports/dispatcher-activity" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/dispatch-queue-wait-time" element={<CADAuth cmp={DispatchQueueWaitTimeReport} path="/cad/reports/dispatch-queue-wait-time" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/close-call" element={<CADAuth cmp={CloseCallReport} path="/cad/reports/close-call" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/onoff-duty-officer" element={<CADAuth cmp={OnOffDutyOfficerReport} path="/cad/reports/onoff-duty-officer" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/misc-status-of-resource" element={<CADAuth cmp={MiscStatusResourceReport} path="/cad/reports/misc-status-of-resource" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports" element={<CADAuth cmp={ReportsMain} path="/cad/reports" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/reports/event-peak-time" element={<CADAuth cmp={EventPeakTimeReport} path="/cad/reports/event-peak-time" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/queue-call" element={<CADAuth cmp={CADQueueCall} path="/cad/queue-call" searchSidebar={searchSidebar} />} />
            <Route exact path="/cad/whiteboard" element={<CADAuth cmp={CADWhiteboard} path="/cad/whiteboard" searchSidebar={searchSidebar} />} />
          </Routes>
        </div>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
