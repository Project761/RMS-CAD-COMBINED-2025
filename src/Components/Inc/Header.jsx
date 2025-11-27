import { useState, useEffect, useContext, useRef, } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { AgencyContext } from "../../Context/Agency/Index";
import { toastifySuccess } from "../Common/AlertMsg";
import ThemeSetting from "./ThemeSetting";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faMoon, faSun, faBell } from '@fortawesome/free-solid-svg-icons';
import defualtImage from '../../img/uploadImage.png';
import { Decrypt_Id_Name, base64ToString, } from '../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../redux/actions/Agency';
import TreeComponent from '../Pages/PropertyRoom/PropertyRoomTab/TreeComponent/TreeComponent';
import { Master_Property_Status, Master_Vehicle_Status, } from '../../redux/actionTypes';
import GoogleAuthServices from '../../CADServices/APIs/googleAuth'
import Nibrs_Report_Model from '../Pages/NIBRS_Report_Model/Nibrs_Report_Model';
import Nibrs_File_Model from '../Pages/NIBRS_File_Model/Home/Nibrs_File_Model';
import TibrsNoIncident from '../Pages/TIBRSNoIncident/TibrsNoIncident';
import NCICModal from '../../CADComponents/NCICModal';
import { ScreenPermision } from '../hooks/Api';
import { useQuery } from 'react-query';
import NotificationServices from '../../CADServices/APIs/notfication';
import moment from 'moment';


const labels = [
  { className: 'geekmark', bgColor: '#ffe2a8', text: 'Required' },
  { className: 'geekmark1', bgColor: '#9d949436', text: 'Read Only' },
  { className: 'geekmark2', bgColor: '#d9e4f2', text: 'Lock' },
  { className: 'geekmark3', bgColor: '#F29A9A', text: 'TIBRS Field' },
];


const Header = (props) => {

  const { listManagementSideBar, agencySideBar, personnelSideBar } = props
  const { setUpdateCount, updateCount, get_Name_Count, setIncidentStatus, setTabCount, setIncidentCount, setAgencyName, agnecyName, changesStatus, setIsLogout, setIncAdvSearchData, setIncidentSearchData, setPropertyCount, setVehicleCount, setRecentSearchData, setIncidentRecentData, setSearchObject, setCaseManagementDataIncidentRecent } = useContext(AgencyContext)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [openNCICModal, setOpenNCICModal] = useState(false);
  const [tibrsFilePermission, setTibrsFilePermission] = useState(false);
  const [tibrsIncidentNoPermission, setTibrsIncidentNoPermission] = useState(false);
  const [tibrsReportPermission, setTibrsReportPermission] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState('today');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Add animation state for smooth transitions
  const [isAnimating, setIsAnimating] = useState(false);
  // Add animation state for tab switching
  const [isTabAnimating, setIsTabAnimating] = useState(false);

  const getNotificationKey = `/Notification/GetNotification`;
  const { data: getNotificationData, isSuccess: isFetchNotification, refetch, isError: isNoData } = useQuery(
    [getNotificationKey, {
      "PINID": localStoreData?.PINID,
    },],
    NotificationServices.getNotification,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!localStoreData?.PINID
    }
  );

  // Transform API data to match notification format
  const transformApiNotifications = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((notification, index) => {
      const sentDate = new Date(notification.SentDate);
      const dateString = moment(sentDate).format('YYYY-MM-DD');
      const dateLabel = sentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).replace(/(\d+)(st|nd|rd|th)/, '$1');

      // Create different colors for variety
      const colors = ["#ffe6e6", "#fff2e6", "#fffacd", "#e6f3ff", "#f0f8f0", "#fff0f0"];
      const colorIndex = index % colors.length;

      return {
        id: notification.UserNotificationStatusID,
        title: notification.NotificationHeader || "Notification",
        description: notification.NotificationContentTemplate ?
          notification.NotificationContentTemplate.replace(/<[^>]*>/g, '') :
          "Notification content",
        isUnread: notification.IsRead,
        color: colors[colorIndex],
        date: dateString,
        dateLabel: dateLabel
      };
    });
  };

  // Use real API data instead of hardcoded data
  const allNotifications = transformApiNotifications(getNotificationData?.data || []);

  // Group notifications by date
  const groupNotificationsByDate = (notifications) => {
    return notifications.reduce((groups, notification) => {
      const date = notification.dateLabel;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
  };

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeNotificationTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return allNotifications.filter(notification => notification.date === today);
    }
    return allNotifications;
  };

  const filteredNotifications = getFilteredNotifications();

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

  const markNotificationAsRead = async (notificationId) => {
    const response = await NotificationServices.markNotificationAsRead({ PINID: localStoreData?.PINID, NotificationID: notificationId });

    if (response?.status === 200) {
      toastifySuccess("Notification marked as read");
      refetch();
    }
  }

  const signOut = async () => {
    if (localStoreData?.Is2FAEnabled) {
      const ConnectionID = localStorage.getItem("connectionId");
      if (localStoreData?.PINID && ConnectionID) {
        await GoogleAuthServices.logOutSingleDevices({ UserPINID: localStoreData?.PINID.toString(), ConnectionID: base64ToString(ConnectionID) });
      }
      setRecentSearchData([]); setSearchObject({});
      localStorage.clear();
    } else {
      localStorage.clear();
      sessionStorage.clear();
      toastifySuccess("Logout Successfully !!");
      setIsLogout(true);
      navigate("/");
    }
  }

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return sessionStorage.getItem('darkMode') === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      sessionStorage.setItem('darkMode', newMode);
      return newMode;
    });
    document.body.classList.toggle('dark-mode');
  };

  const toggleNotifications = () => {
    if (showNotifications) {
      // Start closing animation
      setIsAnimating(true);
      setTimeout(() => {
        setShowNotifications(false);
        setIsAnimating(false);
      }, 200); // Match animation duration
    } else {
      setShowNotifications(true);
      setIsAnimating(false);
    }
  };

  const handleTabSwitch = (tab) => {
    if (activeNotificationTab !== tab) {
      setIsTabAnimating(true);
      setTimeout(() => {
        setActiveNotificationTab(tab);
        setIsTabAnimating(false);
      }, 150);
    }
  };

  // Effect to update body class on initial load
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Effect to handle click outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const [userName, setUserName] = useState('');

  useEffect(() => {
    setShow(false)
    setShowTibrsModel(false)
    if (!localStoreData?.Agency_Name) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    if (localStoreData) {
      setAgencyName(localStoreData?.Agency_Name);
      setUserName(localStoreData?.fullName);
      // setUserName(localStoreData?.UserName);
      // setUserName(localStoreData?.UserName ? localStoreData?.UserName?.split(",")[0] : '');
      getReportPermission(localStoreData?.AgencyID, localStoreData?.PINID)
    }
  }, [localStoreData]);

  const getReportPermission = async (AgencyID, PINID) => {
    const [TibrsFilePermission, TibrsIncidentNo, TibrsReport] = await Promise.all([
      ScreenPermision("N144", AgencyID, PINID),
      ScreenPermision("N145", AgencyID, PINID),
      ScreenPermision("N112", AgencyID, PINID),
    ]);
    if (TibrsFilePermission?.length > 0) {
      setTibrsFilePermission(TibrsFilePermission?.[0]?.DisplayOK === 1);
    }
    if (TibrsIncidentNo?.length > 0) {
      setTibrsIncidentNoPermission(TibrsIncidentNo?.[0]?.DisplayOK === 1);
    }
    if (TibrsReport?.length > 0) {
      setTibrsReportPermission(TibrsReport?.[0]?.DisplayOK === 1);
    }

  }

  const clickOnIncident = () => {
    setUpdateCount(updateCount + 1); setIncidentStatus(false); setIncAdvSearchData(false); setIncidentSearchData([]);
    setIncidentCount([]); setTabCount([]); setPropertyCount([]); setVehicleCount([]); setCaseManagementDataIncidentRecent([]);
  }

  const clickOnMasterName = () => {
    get_Name_Count('');
  }

  const [show, setShow] = useState(false);
  const [showTibrsModel, setShowTibrsModel] = useState(false);

  const handleModel = () => setShow(!show);
  const handleTibrsModel = () => setShowTibrsModel(!showTibrsModel);

  // Check notification read status
  useEffect(() => {
    if (getNotificationData?.data && Array.isArray(getNotificationData.data)) {
      const allNotificationsRead = getNotificationData.data.every(notification => notification.IsRead === true);
      setHasUnreadNotifications(!allNotificationsRead);
    } else {
      setHasUnreadNotifications(false);
    }
  }, [getNotificationData?.data]);

  return (
    <>
      <div id="page_top" className={`${listManagementSideBar ? 'section-body' : personnelSideBar ? 'section-body' : agencySideBar ? 'section-body' : 'section-body top_dark'}`} style={{ padding: `${listManagementSideBar ? '0' : personnelSideBar ? '0' : agencySideBar ? '0' : '20px;'}` }}>
        <div className="container-fluid p-0" style={{ backgroundColor: `${listManagementSideBar ? '#001f3f' : personnelSideBar ? '#001f3f' : agencySideBar ? '#001f3f' : ''}` }} >
          <div className="page-header" >
            <div className="left text-white">

              <div className="div d-flex header-menu">
                <div className="dropdown d-flex">
                  <Link to='/dashboard-page' className=" text-white  ml-2">
                    <span id='mydashButton'>
                      Dashboard
                    </span>
                  </Link>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown">
                    Application
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className="dropdown-item" to={`/Inc-Home?IncId=${0}&IncNo=${''}&IncSta=${false}`} onClick={clickOnIncident} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Incident
                    </Link>
                    <Link to={`/Name-Home?page=MST-Name-Dash&IncNo=${0}&IncSta=${0}&NameID=${0}&MasterNameID=${0}&NameStatus=${false}&isNew=${true}`} onClick={clickOnMasterName} className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Master Name
                    </Link>
                    <Link
                      to={`/Prop-Home?page=MST-Property-Dash&IncId=${0}&IncNo=${0}&IncSta=${0}&?ProId=${0}&?MProId=${0}`}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}
                      onClick={() => {
                        dispatch({ type: Master_Property_Status, payload: true });
                      }}
                    >
                      Master Property
                    </Link>
                    <Link
                      to={`/Vehicle-Home?page=MST-Vehicle-Dash&IncId=${0}&IncNo=${0}&IncSta=${0}&?VehId=${0}&?MVehId=${0}&VehSta=${false}`}
                      onClick={() => {
                        dispatch({ type: Master_Vehicle_Status, payload: true });
                      }}
                      className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Master Vehicle
                    </Link>
                    <Link to={'/Property-room'} className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property Room
                    </Link>

                    <Link to={'/Property-Audit'} className="dropdown-item" data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property Room Audit
                    </Link>
                  </div>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown" >
                    Search
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className="dropdown-item" to={'/incident'} onClick={clickOnIncident} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Incident
                    </Link>

                    <Link className="dropdown-item" to={'/name-advanceSearch?page=Name-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Name
                    </Link>
                    <Link className="dropdown-item" to={'/property-advanceSearch?page=Property-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property
                    </Link>
                    <Link className="dropdown-item" to={'/arrest-advanceSearch?page=Arrest-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Arrest
                    </Link>
                    <Link className="dropdown-item" to={'/vehicle-advanceSearch?page=Vehicle-Search'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Vehicle
                    </Link>

                  </div>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown">
                    Report
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Incident
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Name
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Property
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Arrest
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Vehicle
                    </Link>
                    <Link className="dropdown-item" to={'/Reports'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      State Report
                    </Link>
                    {
                      tibrsReportPermission && (
                        <span className="dropdown-item" onClick={handleModel} style={{ cursor: 'pointer' }} data-toggle={"modal"} data-target={"#NibrsReportModel"} >
                          TIBRS Report
                        </span>
                      )
                    }
                    {
                      tibrsFilePermission && (
                        <span className="dropdown-item" onClick={handleModel} style={{ cursor: 'pointer' }} data-toggle={"modal"} data-target={"#NibrsFileModel"} >
                          TIBRS Files
                        </span>
                      )
                    }
                    {
                      tibrsIncidentNoPermission && (
                        <span className="dropdown-item" onClick={handleTibrsModel} style={{ cursor: 'pointer' }} data-toggle={"modal"} data-target={"#TibrsNoIncident"} >
                          TIBRS No Incident
                        </span>
                      )
                    }
                  </div>
                </div>
                <div className="dropdown d-flex">
                  <span className="nav-link icon text-white btn-icon ml-2" data-toggle="dropdown" >
                    Utility
                    <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                  </span>
                  <div className="dropdown-menu dropdown-menu-left dropdown-menu-arrow mt-2 pt-1">
                    <Link className=" dropdown-item" to={`/agencyTab?Aid=${0}&ASta=${false}`} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Agency
                    </Link>
                    <Link className="dropdown-item" to={'/Alert-Master'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Alert Master
                    </Link>
                    <Link className="dropdown-item" to={'/CounterTable'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Counter Table
                    </Link>
                    <Link className="dropdown-item" to={'/Name-Consolidation'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Consolidation
                    </Link>
                    <Link className="dropdown-item" to={'/Expunge'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Expunge
                    </Link>
                    <Link className="dropdown-item" to={'/ListManagement'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      List Manager
                    </Link>
                    <Link className="dropdown-item" to={'/ListPermission'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      List Module Manager
                    </Link>
                    <Link className="dropdown-item" to={'/PreviousYearCounter'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Pervious Year Counter
                    </Link>
                    <span className="dropdown-item" data-toggle="modal" data-target="#TreeModal" >
                      Property Location
                    </span>
                    <Link className="dropdown-item" to={'/security-manager'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Security Manager
                    </Link>
                    <Link className="dropdown-item" to={'/Seal-unseal'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Seal/Unseal
                    </Link>
                    <Link className="dropdown-item" to={'/UnConsolidation'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Unconsolidation
                    </Link>
                    <Link className="dropdown-item" to={'/UnExpunge'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Unexpunge
                    </Link>
                    <Link className="dropdown-item" to={'/citationTab'} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''} >
                      Citation
                    </Link>
                  </div>
                </div>
                <div
                  data-toggle="modal"
                  data-target="#NCICModal"
                  className='ml-2'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setOpenNCICModal(true);
                  }}
                >
                  NCIC
                </div>
                {/* {localStoreData?.IsCaseManagementVisible && <Link to='/case-management' className=" text-white  ml-5">
                  <span>
                    Case Management
                  </span>
                </Link>} */}
              </div>
            </div>

            <div className="right " >
              <div className="notification d-flex justify-content-between align-items-center px-3" >

                {/* Notification Icon */}
                <div className="position-relative notification-container ">
                  <button
                    onClick={toggleNotifications}
                    className='dark-toogle'
                  >
                    <FontAwesomeIcon icon={faBell} />
                    {hasUnreadNotifications && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-2px',
                          right: '-2px',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#007bff',
                          borderRadius: '50%',
                          border: '1px solid white'
                        }}
                      ></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: '-100px',
                        width: '400px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        marginTop: '8px',
                        // Animation styles
                        opacity: isAnimating ? 0 : 1,
                        transform: isAnimating
                          ? 'translateX(20px) scale(0.95)'
                          : 'translateX(0) scale(1)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: !isAnimating ? 'slideInFromRight 0.3s ease-out' : 'none'
                      }}
                    >
                      {/* Header */}
                      <div style={{ padding: '20px 20px 10px 20px' }}>
                        <h5 style={{
                          margin: 0,
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#333'
                        }}>
                          Notification
                        </h5>

                        {/* Tabs */}
                        <div style={{
                          display: 'flex',
                          marginTop: '15px',
                          borderBottom: '1px solid #eee'
                        }}>
                          <span
                            onClick={() => handleTabSwitch('today')}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '10px 0',
                              marginRight: '20px',
                              fontSize: '14px',
                              color: activeNotificationTab === 'today' ? '#333' : '#666',
                              borderBottom: activeNotificationTab === 'today' ? '2px solid #333' : '0px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Today's notification
                          </span>
                          <span
                            onClick={() => handleTabSwitch('all')}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '10px 0',
                              fontSize: '14px',
                              color: activeNotificationTab === 'all' ? '#333' : '#666',
                              borderBottom: activeNotificationTab === 'all' ? '2px solid #333' : '0px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            All notification
                          </span>
                        </div>
                      </div>

                      {/* Notification List */}
                      <div style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        padding: '0 20px 20px 20px',
                        opacity: isTabAnimating ? 0.5 : 1,
                        transform: isTabAnimating ? 'translateY(20px)' : 'translateY(0)',
                        transition: 'all 0.4s ease'
                      }}>
                        {Object.entries(groupedNotifications)?.length > 0 &&
                          Object.entries(groupedNotifications)?.map(([date, notifications], dateIndex) => (
                            <div
                              key={date}
                              style={{
                                marginBottom: '20px',
                                animation: !isAnimating && !isTabAnimating
                                  ? `slideInUp 0.4s ease-out ${dateIndex * 0.1}s both`
                                  : 'none',
                                opacity: isTabAnimating ? 0 : 1,
                                transform: isTabAnimating ? 'translateY(20px)' : 'translateY(0)',
                                transition: 'all 0.4s ease'
                              }}
                            >
                              {activeNotificationTab === 'all' && <h6 style={{
                                margin: '0 0 10px 0',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#333'
                              }}>
                                {date}
                              </h6>}
                              {/* Date header remains the same */}
                              {notifications.map((notification, index) => (
                                <div
                                  key={notification.id}
                                  onClick={() => !notification.isUnread ? markNotificationAsRead(notification.id) : null}
                                  style={{
                                    backgroundColor: notification.color,
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginTop: '10px',
                                    position: 'relative',
                                    border: '1px solid #f0f0f0',
                                    cursor: !notification.isUnread ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    animation: !isAnimating
                                      ? `slideInUp 0.3s ease-out ${(dateIndex * 0.01) + (index * 0.01)}s both`
                                      : 'none',
                                    transform: 'translateY(0)',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isAnimating) {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isAnimating) {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }
                                  }}
                                >
                                  {!notification.isUnread && (
                                    <span
                                      style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        width: '8px',
                                        height: '8px',
                                        backgroundColor: '#007bff',
                                        borderRadius: '50%'
                                      }}
                                    ></span>
                                  )}
                                  {/* Notification content remains the same */}
                                  <h6 style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#333'
                                  }}>
                                    {notification.title}
                                  </h6>
                                  <p style={{
                                    margin: 0,
                                    fontSize: '12px',
                                    color: '#666',
                                    lineHeight: '1.4'
                                  }}>
                                    {notification.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-2">
                  <button onClick={toggleDarkMode} className='dark-toogle'>
                    <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
                  </button>
                </div>
                {
                  <div className="dropdown d-flex">
                    <span className="nav-link icon  btn  btn-icon ml-2" data-toggle="dropdown" >
                      <span className="text-uppercase text-white">
                        {userName}&nbsp;
                        <FontAwesomeIcon icon={faCaretDown} className='pl-1' />
                      </span>
                    </span>
                    <div className="dropdown-menu  dropdown-menu-right dropdown-menu-arrow" >
                      <div className="header-card">
                        <h6 className="text-center mt-2" style={{ fontSize: '15px' }}>{agnecyName ? agnecyName : ''}</h6>
                        <fieldset >
                          <legend style={{ margin: 'auto' }}>
                            <div className="header-img mt-3 text-center">
                              <img src={defualtImage} alt='' />
                            </div>
                          </legend>
                        </fieldset>
                        <div className="text-start ml-5 mt-2">
                          <h5 className="text-bold " style={{ fontSize: '14px', color: '#001f3f' }}>{userName}</h5>

                        </div>

                        <Link className="dropdown-item bb " to={changesStatus ? '#' : "/LockedUser"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                          <i className="fa fa-lock"></i> &nbsp; Locked User
                        </Link>
                        <Link className="dropdown-item bb" to={changesStatus ? '#' : "/Dictionary"} data-toggle={changesStatus ? "modal" : ""} data-target={changesStatus ? "#SaveModal" : ''}>
                          <i className="fa fa-lock"></i> &nbsp; Data Dictionary
                        </Link>

                        <Link className="dropdown-item bb" to={'/'} onClick={() => signOut()}>
                          <i className="fa fa-sign-out"></i>&nbsp; Sign out
                        </Link>
                        <li className="dropdown-item dropdown-item_remove" >Version Number 1.0</li>

                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <TreeComponent />
      <ThemeSetting />
      <Nibrs_Report_Model show={show} setShow={setShow} handleModel={handleModel} />
      <Nibrs_File_Model show={show} setShow={setShow} handleModel={handleModel} />
      <TibrsNoIncident showTibrsModel={showTibrsModel} setShowTibrsModel={setShowTibrsModel} handleTibrsModel={handleTibrsModel} />
      <NCICModal {...{ openNCICModal, setOpenNCICModal }} />
      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tabSwitch {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  )
}

export default Header;

