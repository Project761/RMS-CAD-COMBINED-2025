import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AgencyContext } from "../../Context/Agency/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import defualtImage from "../../img/uploadImage.png";
import { useDispatch, useSelector } from "react-redux";
import { get_LocalStoreData } from "../../redux/actions/Agency";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import ThemeSetting from "../../Components/Inc/ThemeSetting";
import { base64ToString, Decrypt_Id_Name } from "../../Components/Common/Utility";
import { useQueueCall } from "../../CADContext/QueueCall";
import TreeComponent from "../../Components/Pages/PropertyRoom/PropertyRoomTab/TreeComponent/TreeComponent";
import GEOModal from "../GEOModal";
import CallTakerModal from "../CallTakerModal";
import RIVSModal from "../RIVSModal";
import FreeModal from "../FreeModal";
import DispatcherModal from "../DispatcherModal";
import ClearModal from "../ClearModal";
import ArriveModal from "../ArriveModal";
import EnrouteModal from "../EnrouteModal";
import OnOffDutyModal from "../OnOffDutyModal";
import QueryIncidentModal from "../QueryIncidentModal";
import MiscellaneousModal from "../MiscellaneousModal";
import BoloModal from "../BoloModal";
import { IncidentContext } from "../../CADContext/Incident";
import GoogleAuthServices from "../../CADServices/APIs/googleAuth";
import NCICModal from "../NCICModal";

const Header = (props) => {
  const dispatch = useDispatch();
  const [openCallTakerModal, setCallTakerModal] = useState(false);
  const [openEnrouteModal, setEnrouteModal] = useState(false);
  const [openArriveModal, setArriveModal] = useState(false);
  const [openGEOModal, setOpenGEOModal] = useState(false);
  const [openBoloModal, setOpenBoloModal] = useState(false);
  const [openDispatcherModal, setOpenDispatcherModal] = useState(false);
  const [openRIVSModal, setOpenRIVSModal] = useState(false);
  const [openFreeModal, setOpenFreeModal] = useState(false);
  const [openClearModal, setOpenClearModal] = useState(false);
  const [openOnOffDutyModal, setOnOffDutyModal] = useState(false);
  const [openMiscModal, setOpenMiscModal] = useState(false);
  const [openQueryIncidentModal, setQueryIncidentModal] = useState(false);
  const [openNCICModal, setOpenNCICModal] = useState(false);
  const { setIncID } = useContext(IncidentContext);
  const { queueCallCount } = useQueueCall();

  const localStoreData = useSelector((state) => state.Agency.localStoreData);

  const uniqueId = sessionStorage.getItem("UniqueUserID")
    ? Decrypt_Id_Name(
      sessionStorage.getItem("UniqueUserID"),
      "UForUniqueUserID"
    )
    : "";

  const useQuery = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    return {
      get: (param) => params.get(param),
      pathname: location.pathname,
    };
  };

  const query = useQuery();
  let pathname = query?.pathname

  const { listManagementSideBar, agencySideBar, personnelSideBar, isIncidentDispatch, setIsIncidentDispatch } = props;
  const { setAgencyName, agnecyName, changesStatus, setIsLogout } =
    useContext(AgencyContext);

  const navigate = useNavigate();

  // Logout User
  const signOut = async () => {
    if (localStoreData?.Is2FAEnabled) {
      const ConnectionID = localStorage.getItem("connectionId");
      if (localStoreData?.PINID && ConnectionID) {
        await GoogleAuthServices.logOutSingleDevices({ UserPINID: localStoreData?.PINID.toString(), ConnectionID: base64ToString(ConnectionID) });
      }
      localStorage.clear();
    } else {
      localStorage.clear();
      sessionStorage.clear();
      toastifySuccess("Logout Successfully !!");
      setIsLogout(true);
      navigate("/");
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return sessionStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      sessionStorage.setItem("darkMode", newMode);
      return newMode;
    });
    document.body.classList.toggle("dark-mode");
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (!localStoreData?.Agency_Name) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setAgencyName(localStoreData?.Agency_Name);
      setUserName(localStoreData?.UserName);
    }
  }, [localStoreData]);

  // Extract nested ternary operations into independent statements
  const getHeaderClassName = () => {
    if (listManagementSideBar) return "section-body";
    if (personnelSideBar) return "section-body";
    if (agencySideBar) return "section-body";
    return "section-body CAD-Header top_dark";
  };

  const getHeaderPadding = () => {
    if (listManagementSideBar) return "0";
    if (personnelSideBar) return "0";
    if (agencySideBar) return "0";
    return "20px;";
  };

  const getHeaderBackgroundColor = () => {
    if (listManagementSideBar) return "#001f3f";
    if (personnelSideBar) return "#001f3f";
    if (agencySideBar) return "#001f3f";
    return "";
  };

  return (
    <>
      <div
        id="page_top"
        className={getHeaderClassName()}
        style={{
          padding: getHeaderPadding(),
        }}
      >
        <div
          className="container-fluid p-0"
          style={{
            backgroundColor: getHeaderBackgroundColor(),
          }}
        >
          <div className="d-flex justify-content-end py-2">
            <div className="col-10 d-flex justify-content-start tab-form-row-gap">
              <div className="div d-flex header-menu">
                <div className="dropdown d-flex">
                  {<button
                    type="button"
                    className="cancel-button-header"
                    onClick={() => {
                      navigate('/dashboard-page');
                    }}
                  >
                    RMS
                  </button>}
                </div>

                {/* Reports */}
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-1" data-toggle="dropdown">
                    Reports
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <div className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle" onClick={(e) => e.stopPropagation()}>
                        Event
                      </div>
                      <div className="dropdown-menu">
                        <Link to={`/cad/reports/event-receive-source?page=EventReceiveSource`} className="dropdown-item">
                          Event Receive Source
                        </Link>
                        <Link to={`/cad/reports/master-event-report?page=MasterEventReport`} className="dropdown-item">
                          Master Event Report
                        </Link>
                        <Link to={`/cad/reports/call-log-report?page=CallLogReport`} className="dropdown-item">
                          Call Log Report
                        </Link>
                        <Link to={`/cad/reports/call-taker-activity?page=CallTakerActivity`} className="dropdown-item">
                          Call Taker Activity
                        </Link>
                        <Link to={`/cad/reports/officer-activity?page=OfficerActivityReport`} className="dropdown-item">
                          Officer Activity
                        </Link>
                        <Link to={`/cad/reports/event-peak-time?page=EventPeakTime`} className="dropdown-item">
                          Event Peak Time
                        </Link>
                        <Link to={`/cad/reports/close-call?page=CloseCall`} className="dropdown-item">
                          Close Call Report
                        </Link>
                        <Link to={`/cad/reports/daily-call-summary?page=DailyCallSummaryReport`} className="dropdown-item">
                          Daily Call Summary
                        </Link>
                        <Link to={`/cad/reports/call-dispatch-summary?page=CallDispatchSummaryReport`} className="dropdown-item">
                          Call Dispatch Summary
                        </Link>

                        <Link to={`/cad/reports/dispatcher-activity?page=DispatcherActivity`} className="dropdown-item">
                          Dispatcher Activity
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle" onClick={(e) => e.stopPropagation()}>
                        GEO
                      </div>
                      <div className="dropdown-menu">
                        <Link to={`/cad/reports/location-flag-details?page=LocationFlagDetails`} className="dropdown-item">
                          Location Flag Details
                        </Link>
                        <Link to={`/cad/reports/patrol-zone?page=PatrolZone`} className="dropdown-item">
                          Patrol Zone
                        </Link>
                        <Link to={`/cad/reports/location-report?page=LocationReport`} className="dropdown-item">
                          Location Report
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle" onClick={(e) => e.stopPropagation()}>
                        Unit
                      </div>
                      <div className="dropdown-menu">
                        <Link to={`/cad/reports/misc-status-of-resource?page=MiscStatusOfResource`} className="dropdown-item">
                          Misc. Status Of Unit
                        </Link>
                        <Link to={`/cad/reports/onoff-duty-resource-report?page=OnOffDutyResource`} className="dropdown-item">
                          On/Off Duty Unit
                        </Link>
                        <Link to={`/cad/reports/resource-history-report?page=ResourceHistory`} className="dropdown-item">
                          Unit History
                        </Link>
                        <Link to={`/cad/reports/shift-summary-report?Page=ShiftSummaryReport`} className="dropdown-item">
                          Shift Summary Report
                        </Link>
                        <Link to={`/cad/reports/shift-detailed-report?Page=ShiftDetailedReport`} className="dropdown-item">
                          Shift Detailed Report
                        </Link>
                        <Link to={`/cad/reports/onoff-duty-officer?page=OnOffDutyOfficer`} className="dropdown-item">
                          On/Off Duty Report By Officer
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle" onClick={(e) => e.stopPropagation()}>
                        CFS
                      </div>
                      <div className="dropdown-menu">
                        <Link to={`/cad/reports/cfs-analysis?page=CFSAnalysis`} className="dropdown-item">
                          CFS Analysis
                        </Link>
                        <Link to={`/cad/reports/cfs-summary?page=CFSSummary`} className="dropdown-item">
                          CFS Summary
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Utilities */}
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-1" data-toggle="dropdown">
                    Utilities
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link
                      to={`/cad/utilities/bolo_disposition`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      List Manager
                    </Link>
                    <Link
                      to={`/cad/unverified-location`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Unverified Location
                    </Link>
                  </div>
                </div>

                {/* Search */}
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-1" data-toggle="dropdown">
                    Search
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link
                      to={`/cad/query_incident/eventSearch`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Event
                    </Link>
                    <Link
                      to={`/cad/query_incident/resourceSearch`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Unit
                    </Link>
                    <Link
                      to={`/cad/query_incident/nameSearch`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Name
                    </Link>
                    <Link
                      to={`/cad/query_incident/propertySearch`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property
                    </Link>
                    <Link
                      to={`/cad/query_incident/vehicleSearch`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Vehicle
                    </Link>
                  </div>
                </div>
                {/* Whiteboard */}
                <span
                  className="nav-link text-white btn-icon position-relative"
                  onClick={() => {
                    navigate('/cad/whiteboard');
                  }}
                >
                  Whiteboard
                  <span className="badge badge-light" style={{ position: "absolute", right: -5, top: -5, backgroundColor: "#B9D9EB" }}>0</span>
                </span>
              </div>
            </div>
            <div className="notification d-flex justify-content-center align-items-center px-3">
              <div>
                <button onClick={toggleDarkMode} className="dark-toogle">
                  <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
                </button>
              </div>
              {
                <div className="dropdown d-flex">
                  <span
                    className="nav-link icon  btn  btn-icon ml-2"
                    data-toggle="dropdown"
                  >
                    <span className="text-uppercase text-white">
                      {userName}&nbsp;
                      <FontAwesomeIcon icon={faCaretDown} className="pl-1" />
                    </span>
                  </span>
                  <div className="dropdown-menu  dropdown-menu-right dropdown-menu-arrow">
                    <div className="header-card">
                      <h6
                        className="text-center mt-2"
                        style={{ fontSize: "15px" }}
                      >
                        {agnecyName ? agnecyName : ""}
                      </h6>
                      <fieldset>
                        <legend style={{ margin: "auto" }}>
                          <div className="header-img mt-3 text-center">
                            <img src={defualtImage} alt="" />
                          </div>
                        </legend>
                      </fieldset>
                      <div className="text-start ml-5 mt-2">
                        <h5
                          className="text-bold "
                          style={{ fontSize: "14px", color: "#001f3f" }}
                        >
                          {userName}
                        </h5>
                      </div>
                      <Link
                        className="dropdown-item bb "
                        to={changesStatus ? "#" : "/LockedUser"}
                        data-toggle={changesStatus ? "modal" : ""}
                        data-target={changesStatus ? "#SaveModal" : ""}
                      >
                        <i className="fa fa-lock"></i> &nbsp; Locked User
                      </Link>
                      <Link
                        className="dropdown-item bb"
                        to={changesStatus ? "#" : "/Dictionary"}
                        data-toggle={changesStatus ? "modal" : ""}
                        data-target={changesStatus ? "#SaveModal" : ""}
                      >
                        <i className="fa fa-lock"></i> &nbsp; Data Dictionary
                      </Link>
                      <Link
                        className="dropdown-item bb"
                        to={changesStatus ? "#" : "/Eroor-Log"}
                        data-toggle={changesStatus ? "modal" : ""}
                        data-target={changesStatus ? "#SaveModal" : ""}
                      >
                        <i className="fa fa-lock"></i> &nbsp; Error Log
                      </Link>
                      <Link
                        className="dropdown-item"
                        to={"/"}
                        onClick={() => signOut()}
                      >
                        <i className="fa fa-sign-out"></i>&nbsp; Sign out
                      </Link>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-center py-2 text-white button-container">
            {(pathname.startsWith("/cad/utilities") || pathname === "/cad/map" || pathname === "/cad/dispatcher" || pathname === "/cad/nameSearchList" || pathname === "/cad/propertySearchList" || pathname === "/cad/vehicleSearchList" || pathname === "/cad/dispatcher/event-info" || pathname === "/cad/name-search" || pathname === "/cad/property_search" || pathname === "/cad/vehicle_search" || pathname === "/cad/eventSearchList" || pathname === "/cad/event-search" || pathname === "/cad/resourceSearchList" || pathname === "/cad/resource-search" || pathname === "/cad/query_incident/eventSearch" || pathname === "/cad/query_incident/resourceSearch" || pathname === "/cad/query_incident/nameSearch" || pathname === "/cad/query_incident/propertySearch" || pathname === "/cad/query_incident/vehicleSearch" || pathname.startsWith("/cad/report") || pathname === "/cad/queue-call" || pathname === "/cad/whiteboard" || pathname === "/cad/unverified-location") &&
              <button
                type="button"
                className="btn btn-sm btn-light custom-button"
                style={{ width: "70px" }}
                onClick={() => {
                  navigate("/cad/dashboard-page");
                  setIncID(null);
                }}
              >
                Monitor
              </button>}
            <button
              className="btn btn-sm btn-light custom-button "
              data-toggle="modal"
              data-target="#CallTakerModal"
              style={{ width: "80px" }}
              onClick={() => {
                setCallTakerModal(true);
              }}
            >
              Call Taker
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#DispatcherModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenDispatcherModal(true);
              }}
            >
              Dispatch
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#EnrouteModal"
              style={{ width: "70px" }}
              onClick={() => {
                setEnrouteModal(true);
              }}
            >
              Enroute
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#ArriveModal"
              style={{ width: "70px" }}
              onClick={() => {
                setArriveModal(true);
              }}
            >
              Arrive
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#freeModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenFreeModal(true);
              }}
            >
              Free
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#clearModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenClearModal(true);
              }}
            >
              Clear
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#miscModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenMiscModal(true);
              }}
            >
              Misc.
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#RIVSModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenRIVSModal(true);
              }}
            >
              UI/VS
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#GEOModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenGEOModal(true);
              }}
            >
              GEO
            </button>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#OnOffDutyModal"
              onClick={() => {
                setOnOffDutyModal(true);
              }}
            >
              On/Off duty
            </button>
            <button

              className="btn btn-sm btn-light custom-button position-relative"
              data-toggle="modal"
              data-target="#BoloModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenBoloModal(true);
              }}
            >
              BOLO
              <span className="badge badge-light" style={{ position: "absolute", right: -8, top: -15, backgroundColor: "#B9D9EB" }}>0</span>
            </button>
            <Link
              className="btn btn-sm btn-light custom-button"
              to={`/cad/map?AgencyID=${localStoreData?.AgencyID}`}
              style={{ width: "70px" }}
              target="_self"
            >
              Map
            </Link>
            <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#NCICModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenNCICModal(true);
              }}
            >
              NCIC
            </button>
            {!pathname.startsWith("/cad/queue-call") && <Link
              className="btn btn-sm btn-light custom-button position-relative"
              to={`/cad/queue-call`}
            >
              Queue Calls
              <span className="badge badge-light" style={{ position: "absolute", right: -8, top: -15, backgroundColor: "#B9D9EB" }}>{queueCallCount}</span>
            </Link>}
          </div>
        </div>
      </div>
      <TreeComponent />
      <ThemeSetting />
      <CallTakerModal
        {...{
          openCallTakerModal,
          setCallTakerModal,
          isIncidentDispatch,
          setIsIncidentDispatch
        }}
        isQueueCall={false}
      />
      {openGEOModal && <GEOModal {...{ openGEOModal, setOpenGEOModal }} />}
      {openBoloModal && <BoloModal {...{ openBoloModal, setOpenBoloModal }} />}
      <DispatcherModal {...{ openDispatcherModal, setOpenDispatcherModal }} />
      <RIVSModal {...{ openRIVSModal, setOpenRIVSModal }} />
      <FreeModal {...{ openFreeModal, setOpenFreeModal }} />
      <ClearModal {...{ openClearModal, setOpenClearModal }} />
      <ArriveModal {...{ openArriveModal, setArriveModal }} />
      <EnrouteModal {...{ openEnrouteModal, setEnrouteModal }} />
      <OnOffDutyModal {...{ openOnOffDutyModal, setOnOffDutyModal }} />
      <QueryIncidentModal {...{ openQueryIncidentModal, setQueryIncidentModal }} />
      <MiscellaneousModal {...{ openMiscModal, setOpenMiscModal }} />
      <NCICModal {...{ openNCICModal, setOpenNCICModal }} />
    </>
  );
};

export default Header;

// PropTypes definition
Header.propTypes = {
  listManagementSideBar: PropTypes.bool,
  agencySideBar: PropTypes.bool,
  personnelSideBar: PropTypes.bool,
  isIncidentDispatch: PropTypes.bool,
  setIsIncidentDispatch: PropTypes.func
};

// Default props
Header.defaultProps = {
  listManagementSideBar: false,
  agencySideBar: false,
  personnelSideBar: false,
  isIncidentDispatch: false,
  setIsIncidentDispatch: () => { }
};
