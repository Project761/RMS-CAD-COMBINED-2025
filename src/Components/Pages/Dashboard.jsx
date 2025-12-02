import React, { useState, useEffect, useContext } from "react";
import { Decrypt_Id_Name } from "../Common/Utility";
import { Link } from "react-router-dom";
import { AgencyContext } from "../../Context/Agency/Index";
import { useDispatch, useSelector } from "react-redux";
import { get_LocalStoreData } from "../../redux/actions/Agency";
import DashboardIncidentListModel from "./DashboardIncidentListModel/DashboardIncidentListModel";
import DashboardAllReports from "./DashboardAllReports/DashboardAllReports";
import QueueReports from "./QueueReports/QueueReports";
import PropertyEvidenceReport from "./PropertyEvidenceReport/PropertyEvidenceReport";
import DashwhiteBoard from "./WhiteBoardTab/DashwhiteBoard";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import IncompleteNibrsIncident from "./IncompleteNibrsIncident/IncompleteNibrsIncident";
import PendingCaseReview from "./WhiteBoardTab/PendingCaseReview";
import SupervisorCaseReview from "./DashboardTab/SupervisorCaseReview";
import ManualPurgeRequest from "../../CADComponents/CaseManagement/components/manualPurgeRequest";
// import 'bootstrap-icons/font/bootstrap-icons.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const dispatch = useDispatch();

  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const { setUpdateCount, updateCount, setIncidentStatus, setPropertyCount, setTabCount, setNameTabCount, setIncidentCount, setVehicleCount, GetDataTimeZone, datezone, setCaseStatus } = useContext(AgencyContext);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);

  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, [dispatch, localStoreData?.AgencyID, localStoreData?.PINID, uniqueId]);

  useEffect(() => {
    if (localStoreData) {
      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData, datezone, GetDataTimeZone]);

  const clickOnIncident = () => {
    setUpdateCount(updateCount + 1);
    setIncidentStatus(false);
    setIncidentCount([]);
    setTabCount([]); setCaseStatus('Open');
    setNameTabCount([]);
    setPropertyCount([]);
    setVehicleCount([]);
  };

  const [show, setShow] = useState(false);
  const handleModel = (val) => setShow(val);

  const cardStyle = {
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#fff'
  };

  useEffect(() => {
    // Disable scroll on mount
    document.body.style.overflow = "hidden";

    // Cleanup to re-enable scroll when leaving Dashboard
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);


  return (
    <>
      {/* Quick Action Buttons */}
      <div className="section-body mt-1" style={{ margin: '10px 10px 10px 10px' }}>
        <div className="row clearfix">
          <div className="main-dashboard col-12 mb-2 mt-2">

            <div className=" col-12 mb-2 mt-2">
              <div className="row">
                <div className="col-3">
                  <div className="topBtn-wrapDashboard">
                    <Link
                      to={`/Inc-Home?IncId=${0}&IncNo=${''}&IncSta=${false}`}
                      onClick={clickOnIncident}
                      className="topBtn d-flex align-items-center justify-content-center"
                    >
                      <span className="mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="white">
                          <path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                        </svg>
                      </span>
                      <span className="mb-1">Create New Incident</span>
                    </Link>
                    <div className="topBtn-tooltipDashboard" style={{ fontSize: '13px', color: '#334c65', textAlign: 'center', paddingLeft: '3px', }}> Create A New Incident or Case Report Involving People, Property, or Events
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="topBtn-wrapDashboard">
                    <Link
                      to={`/Name-Home?page=MST-Name-Dash&IncId=${0}&IncNo=${0}&IncSta=${0}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}&isNew=${true}`}
                      className="topBtn d-flex align-items-center justify-content-center"
                    >
                      <span className="mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20" fill="white"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" /></svg>
                      </span>
                      <span className="mb-1">Add Name(Master)</span>
                    </Link>
                    <div className="topBtn-tooltipDashboard" style={{ fontSize: '13px', color: '#334c65', textAlign: 'center', paddingLeft: '3px', }}> Add An Individual Or Business To The Master Name List For Use In Future Reports
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="topBtn-wrapDashboard">
                    <Link
                      to={`/Prop-Home?page=MST-Property-Dash&ProId=${0}&MProId=${0}&ProSta=${false}`}
                      className="topBtn d-flex align-items-center justify-content-center"
                    >
                      <span className="mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="20" fill="white"><path d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z" /></svg>
                      </span>
                      <span className="mb-1">Add Property(Master)</span>
                    </Link>
                    <div className="topBtn-tooltipDashboard" style={{ fontSize: '13px', color: '#334c65', textAlign: 'center', paddingLeft: '3px', }}>
                      Create A New Master Report for Articles,Boats,Guns, Or other Property Type
                    </div>
                  </div>
                </div>
                <div className="col-3">
                  <div className="topBtn-wrapVehicle">
                    <Link
                      to={`/Vehicle-Home?page=MST-Vehicle-Dash&?VehId=${0}&?MVehId=${0}&isNew=${true}`}
                      className="topBtn d-flex align-items-center justify-content-center"
                    >
                      <span className="mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="white"><path d="M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" /></svg>
                      </span>
                      <span className="mb-1">Add Vehicle(Master)</span>
                    </Link>
                    <div className="topBtn-tooltipVehicle" style={{ fontSize: '13px', color: '#334c65', textAlign: 'center', paddingLeft: '3px', }}>Register A Vehicle In The Master Vehicle list To Be Linked With Future Incident
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      {localStoreData?.IsCaseManagementVisible &&
        <div className="container-fluid mt-2 mb-2">
          <div className="row">
            <div className="col-12">
              <div
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  display: 'flex',
                  padding: '0'
                }}
              >
                <div
                  className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
                  id="home-tab"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected={activeTab === 'home'}
                  onClick={() => setActiveTab('home')}
                  style={{
                    backgroundColor: 'transparent',
                    color: activeTab === 'home' ? '#007bff' : '#333',
                    border: 'none',
                    borderRight: '1px solid #e0e0e0',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: activeTab === 'home' ? '500' : '400',
                    cursor: 'pointer',
                    flex: '0 0 auto'
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill={activeTab === 'home' ? '#dc3545' : '#666'}
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                </div>
                {/* <div
                  className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
                  id="pending-tab"
                  type="button"
                  role="tab"
                  aria-controls="pending"
                  aria-selected={activeTab === 'pending'}
                  onClick={() => setActiveTab('pending')}
                  style={{
                    backgroundColor: 'transparent',
                    color: activeTab === 'pending' ? '#007bff' : '#333',
                    border: 'none',
                    borderRight: '1px solid #e0e0e0',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: activeTab === 'pending' ? '500' : '400',
                    cursor: 'pointer',
                    flex: '0 0 auto'
                  }}
                >
                  Pending Case Review

                </div> */}
                <div
                  className={`nav-link ${activeTab === 'supervisor' ? 'active' : ''}`}
                  id="supervisor-tab"
                  type="button"
                  role="tab"
                  aria-controls="supervisor"
                  aria-selected={activeTab === 'pending'}
                  onClick={() => setActiveTab('supervisor')}
                  style={{
                    backgroundColor: 'transparent',
                    color: activeTab === 'supervisor' ? '#007bff' : '#333',
                    border: 'none',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: activeTab === 'supervisor' ? '500' : '400',
                    cursor: 'pointer',
                    flex: '0 0 auto'
                  }}
                >
                  Supervisor Case Review
                </div>
              </div>
            </div>
          </div>
        </div>}

      {/* Tab Content */}
      <div className="container-fluid mt-2 mb-2">
        <div className="tab-content" id="dashboardTabContent">
          {/* Home Tab */}
          <div
            className={`tab-pane fade ${activeTab === 'home' ? 'show active' : ''}`}
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <div className="row">
              {/* Left side: Whiteboard */}
              <div className="col-md-6 pl-0 mb-2" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div style={cardStyle} className="p-3 mb-3">
                  <DashwhiteBoard />
                </div>
              </div>

              {/* Right side: Reports stacked */}
              <div className="col-md-6" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                <div className="row">
                  <div className="col-12 mb-3">
                    <div style={cardStyle} className="p-3">
                      <DashboardAllReports isPreview={true} />
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <div style={cardStyle} className="p-3">
                      <QueueReports isPreview={true} />
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <div style={cardStyle} className="p-3">
                      <PropertyEvidenceReport isPreview={true} />
                    </div>
                  </div>

                  <div className="col-12 mb-3">
                    <div style={cardStyle} className="p-3 h-100">
                      <IncompleteNibrsIncident isPreview={true} />
                    </div>
                  </div>
                 
                  <div className="col-12">
                    <div style={cardStyle} className="p-3 h-100">
                      <ManualPurgeRequest isPreview={true} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Case Review Tab */}
          <div
            className={`tab-pane fade ${activeTab === 'pending' ? 'show active' : ''}`}
            id="pending"
            role="tabpanel"
            aria-labelledby="pending-tab"
          >
            <div className="row">
              <div className="col-12">
                <div style={cardStyle} className="p-3">
                  <PendingCaseReview />
                </div>
              </div>
            </div>
          </div>

          <div
            className={`tab-pane fade ${activeTab === 'supervisor' ? 'show active' : ''}`}
            id="supervisor"
            role="tabpanel"
            aria-labelledby="supervisor-tab"
          >
            <div className="row">
              <div className="col-12">
                <div style={cardStyle} className="p-3">
                  <SupervisorCaseReview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <DashboardIncidentListModel show={show} handleModel={handleModel} Data="" modelSelected={null} />
    </>
  );
};

export default Dashboard;
