import { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AgencyContext } from "../../Context/Agency/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCaretDown, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
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
import { useQuery } from "react-query";
import NotificationServices from "../../CADServices/APIs/notfication";
import ScreenPermissionServices from "../../CADServices/APIs/screenPermission";
import moment from "moment";
import { ScreenPermision } from "../../Components/hooks/Api";

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

  // CAD Screen Permission States
  const [CADDispatch, setCADDispatch] = useState(false);
  const [CADEnroute, setCADEnroute] = useState(false);
  const [CADArrive, setCADArrive] = useState(false);
  const [CADFree, setCADFree] = useState(false);
  const [CADClear, setCADClear] = useState(false);
  const [CADMisc, setCADMisc] = useState(false);
  const [CADUIVS, setCADUIVS] = useState(false);
  const [CADGeo, setCADGeo] = useState(false);
  const [CADOnOffDuty, setCADOnOffDuty] = useState(false);
  const [CADMap, setCADMap] = useState(false);
  const [effectiveNcicScreenPermission, setEffectiveNcicScreenPermission] = useState(null);

  // Event Report Screen Permission States
  const [EventReports, setEventReports] = useState(false);
  const [EventReceiveSource, setEventReceiveSource] = useState(false);
  const [MasterEventReport, setMasterEventReport] = useState(false);
  const [CallLogReport, setCallLogReport] = useState(false);
  const [CallTakerActivity, setCallTakerActivity] = useState(false);
  const [OfficerActivity, setOfficerActivity] = useState(false);
  const [EventPeakTime, setEventPeakTime] = useState(false);
  const [CloseCallReport, setCloseCallReport] = useState(false);
  const [DailyCallSummary, setDailyCallSummary] = useState(false);
  const [CallDispatchSummary, setCallDispatchSummary] = useState(false);
  const [DispatcherActivity, setDispatcherActivity] = useState(false);

  // GEO Report Screen Permission States
  const [GEOCADReports, setGEOCADReports] = useState(false);
  const [LocationFlagDetails, setLocationFlagDetails] = useState(false);
  const [PatrolZone, setPatrolZone] = useState(false);
  const [LocationReport, setLocationReport] = useState(false);

  // Unit Report Screen Permission States
  const [UnitCADReports, setUnitCADReports] = useState(false);
  const [MiscStatusOfUnit, setMiscStatusOfUnit] = useState(false);
  const [OnOffDutyUnit, setOnOffDutyUnit] = useState(false);
  const [UnitHistory, setUnitHistory] = useState(false);
  const [ShiftSummary, setShiftSummary] = useState(false);
  const [ShiftDetailed, setShiftDetailed] = useState(false);
  const [OnOffDutyByOfficer, setOnOffDutyByOfficer] = useState(false);

  // CFS Report Screen Permission States
  const [CFSCADReports, setCFSCADReports] = useState(false);
  const [CFSAnalysis, setCFSAnalysis] = useState(false);
  const [CFSSummary, setCFSSummary] = useState(false);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotificationTab, setActiveNotificationTab] = useState('today');
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [effectiveBoloScreenPermission, setEffectiveBoloScreenPermission] = useState(null);
  const [effectiveQueueCallScreenPermission, setEffectiveQueueCallScreenPermission] = useState(null);
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

  const getScreenPermissionKey = `/ScreenPermission/GetScreenPermissionByParentName/CA101`;
  const { data: getScreenPermissionData, isSuccess: isFetchScreenPermission } = useQuery(
    [getScreenPermissionKey, {
      "PINID": localStoreData?.PINID,
      AgencyID: localStoreData?.AgencyID,
      ScreenCode: "CA101"
    },],
    ScreenPermissionServices.getScreenPermissionByParentName,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!localStoreData?.PINID
    }
  );


  useEffect(() => {
    if (getScreenPermissionData && isFetchScreenPermission) {
      const data = JSON.parse(getScreenPermissionData?.data?.data)?.Table;

      // Filter and set CAD screen permissions
      if (data && Array.isArray(data)) {
        // CAD-Dispatch (CA107)
        const dispatchPermission = data.find(item => item.ScreenCode === "CA107");
        setCADDispatch(dispatchPermission ? dispatchPermission.AddOK === 1 : false);

        // CAD-Enroute (CA108)
        const enroutePermission = data.find(item => item.ScreenCode === "CA108");
        setCADEnroute(enroutePermission ? enroutePermission.AddOK === 1 : false);

        // CAD-Arrive (CA109)
        const arrivePermission = data.find(item => item.ScreenCode === "CA109");
        setCADArrive(arrivePermission ? arrivePermission.AddOK === 1 : false);

        // CAD-Free (CA110)
        const freePermission = data.find(item => item.ScreenCode === "CA110");
        setCADFree(freePermission ? freePermission.AddOK === 1 : false);

        // CAD-Clear (CA111)
        const clearPermission = data.find(item => item.ScreenCode === "CA111");
        setCADClear(clearPermission ? clearPermission.AddOK === 1 : false);

        // CAD-Misc (CA112)
        const miscPermission = data.find(item => item.ScreenCode === "CA112");
        setCADMisc(miscPermission ? miscPermission.AddOK === 1 : false);

        // CAD-UIVS (CA113)
        const uivsPermission = data.find(item => item.ScreenCode === "CA113");
        setCADUIVS(uivsPermission ? uivsPermission.AddOK === 1 : false);

        // CAD-Geo (CA114)
        const geoPermission = data.find(item => item.ScreenCode === "CA114");
        setCADGeo(geoPermission ? geoPermission.AddOK === 1 : false);

        // CAD-OnOffDuty (CA115)
        const onOffDutyPermission = data.find(item => item.ScreenCode === "CA115");
        setCADOnOffDuty(onOffDutyPermission ? onOffDutyPermission.AddOK === 1 : false);

        // CAD-Map (CA116)
        const mapPermission = data.find(item => item.ScreenCode === "CA116");
        setCADMap(mapPermission ? mapPermission.AddOK === 1 : false);
      }
    } else {
      // Reset all permissions to false
      setCADDispatch(false);
      setCADEnroute(false);
      setCADArrive(false);
      setCADFree(false);
      setCADClear(false);
      setCADMisc(false);
      setCADUIVS(false);
      setCADGeo(false);
      setCADOnOffDuty(false);
      setCADMap(false);
    }
  }, [getScreenPermissionData, isFetchScreenPermission])

  const getEventReportScreenPermissionKey = `/ScreenPermission/GetScreenPermissionByParentName/CE101`;
  const { data: getEventReportScreenPermissionData, isSuccess: isFetchEventReportScreenPermission } = useQuery(
    [getEventReportScreenPermissionKey, {
      "PINID": localStoreData?.PINID,
      AgencyID: localStoreData?.AgencyID,
      ScreenCode: "CE101"
    },],
    ScreenPermissionServices.getScreenPermissionByParentName,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!localStoreData?.PINID
    }
  );

  useEffect(() => {
    if (getEventReportScreenPermissionData && isFetchEventReportScreenPermission) {
      const data = JSON.parse(getEventReportScreenPermissionData?.data?.data)?.Table;

      // Filter and set Event Report screen permissions
      if (data && Array.isArray(data)) {
        // Event Reports (CE101)
        const eventReportsPermission = data.find(item => item.ScreenCode === "CE101");
        setEventReports(eventReportsPermission ? eventReportsPermission.DisplayOK === 1 : false);

        // Event Receive Source (CE102)
        const eventReceiveSourcePermission = data.find(item => item.ScreenCode === "CE102");
        setEventReceiveSource(eventReceiveSourcePermission ? eventReceiveSourcePermission.DisplayOK === 1 : false);

        // Master Event Report (CE103)
        const masterEventReportPermission = data.find(item => item.ScreenCode === "CE103");
        setMasterEventReport(masterEventReportPermission ? masterEventReportPermission.DisplayOK === 1 : false);

        // Call Log Report (CE104)
        const callLogReportPermission = data.find(item => item.ScreenCode === "CE104");
        setCallLogReport(callLogReportPermission ? callLogReportPermission.DisplayOK === 1 : false);

        // Call Taker Activity (CE105)
        const callTakerActivityPermission = data.find(item => item.ScreenCode === "CE105");
        setCallTakerActivity(callTakerActivityPermission ? callTakerActivityPermission.DisplayOK === 1 : false);

        // Officer Activity (CE106)
        const officerActivityPermission = data.find(item => item.ScreenCode === "CE106");
        setOfficerActivity(officerActivityPermission ? officerActivityPermission.DisplayOK === 1 : false);

        // Event Peak Time (CE107)
        const eventPeakTimePermission = data.find(item => item.ScreenCode === "CE107");
        setEventPeakTime(eventPeakTimePermission ? eventPeakTimePermission.DisplayOK === 1 : false);

        // Close Call Report (CE108)
        const closeCallReportPermission = data.find(item => item.ScreenCode === "CE108");
        setCloseCallReport(closeCallReportPermission ? closeCallReportPermission.DisplayOK === 1 : false);

        // Daily Call Summary (CE109)
        const dailyCallSummaryPermission = data.find(item => item.ScreenCode === "CE109");
        setDailyCallSummary(dailyCallSummaryPermission ? dailyCallSummaryPermission.DisplayOK === 1 : false);

        // Call Dispatch Summary (CE110)
        const callDispatchSummaryPermission = data.find(item => item.ScreenCode === "CE110");
        setCallDispatchSummary(callDispatchSummaryPermission ? callDispatchSummaryPermission.DisplayOK === 1 : false);

        // Dispatcher Activity (CE111)
        const dispatcherActivityPermission = data.find(item => item.ScreenCode === "CE111");
        setDispatcherActivity(dispatcherActivityPermission ? dispatcherActivityPermission.DisplayOK === 1 : false);
      }
    } else {
      // Reset all permissions to false
      setEventReports(false);
      setEventReceiveSource(false);
      setMasterEventReport(false);
      setCallLogReport(false);
      setCallTakerActivity(false);
      setOfficerActivity(false);
      setEventPeakTime(false);
      setCloseCallReport(false);
      setDailyCallSummary(false);
      setCallDispatchSummary(false);
      setDispatcherActivity(false);
    }
  }, [getEventReportScreenPermissionData, isFetchEventReportScreenPermission])

  const getGEOReportScreenPermissionKey = `/ScreenPermission/GetScreenPermissionByParentName/CG101`;
  const { data: getGEOReportScreenPermissionData, isSuccess: isFetchGEOReportScreenPermission } = useQuery(
    [getGEOReportScreenPermissionKey, {
      "PINID": localStoreData?.PINID,
      AgencyID: localStoreData?.AgencyID,
      ScreenCode: "CG101"
    },],
    ScreenPermissionServices.getScreenPermissionByParentName,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!localStoreData?.PINID
    }
  );

  useEffect(() => {
    if (getGEOReportScreenPermissionData && isFetchGEOReportScreenPermission) {
      const data = JSON.parse(getGEOReportScreenPermissionData?.data?.data)?.Table;

      // Filter and set GEO Report screen permissions
      if (data && Array.isArray(data)) {
        // GEO CAD Reports (CG101)
        const geoCADReportsPermission = data.find(item => item.ScreenCode === "CG101");
        setGEOCADReports(geoCADReportsPermission ? geoCADReportsPermission.DisplayOK === 1 : false);

        // Location Flag Details (CG102)
        const locationFlagDetailsPermission = data.find(item => item.ScreenCode === "CG102");
        setLocationFlagDetails(locationFlagDetailsPermission ? locationFlagDetailsPermission.DisplayOK === 1 : false);

        // Patrol Zone (CG103)
        const patrolZonePermission = data.find(item => item.ScreenCode === "CG103");
        setPatrolZone(patrolZonePermission ? patrolZonePermission.DisplayOK === 1 : false);

        // Location Report (CG104)
        const locationReportPermission = data.find(item => item.ScreenCode === "CG104");
        setLocationReport(locationReportPermission ? locationReportPermission.DisplayOK === 1 : false);
      }
    } else {
      // Reset all permissions to false
      setGEOCADReports(false);
      setLocationFlagDetails(false);
      setPatrolZone(false);
      setLocationReport(false);
    }
  }, [getGEOReportScreenPermissionData, isFetchGEOReportScreenPermission]);

  const getUnitReportScreenPermissionKey = `/ScreenPermission/GetScreenPermissionByParentName/CG101`;
  const { data: getUnitReportScreenPermissionData, isSuccess: isFetchUnitReportScreenPermission } = useQuery(
    [getUnitReportScreenPermissionKey, {
      "PINID": localStoreData?.PINID,
      AgencyID: localStoreData?.AgencyID,
      ScreenCode: "CU101"
    },],
    ScreenPermissionServices.getScreenPermissionByParentName,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!localStoreData?.PINID
    }
  );

  useEffect(() => {
    if (getUnitReportScreenPermissionData && isFetchUnitReportScreenPermission) {
      const data = JSON.parse(getUnitReportScreenPermissionData?.data?.data)?.Table;

      // Filter and set Unit Report screen permissions
      if (data && Array.isArray(data)) {
        // Unit CAD Reports (CU101)
        const unitCADReportsPermission = data.find(item => item.ScreenCode === "CU101");
        setUnitCADReports(unitCADReportsPermission ? unitCADReportsPermission.DisplayOK === 1 : false);

        // Misc Status Of Unit (CU102)
        const miscStatusOfUnitPermission = data.find(item => item.ScreenCode === "CU102");
        setMiscStatusOfUnit(miscStatusOfUnitPermission ? miscStatusOfUnitPermission.DisplayOK === 1 : false);

        // On/Off Duty Unit (CU103)
        const onOffDutyUnitPermission = data.find(item => item.ScreenCode === "CU103");
        setOnOffDutyUnit(onOffDutyUnitPermission ? onOffDutyUnitPermission.DisplayOK === 1 : false);

        // Unit History (CU104)
        const unitHistoryPermission = data.find(item => item.ScreenCode === "CU104");
        setUnitHistory(unitHistoryPermission ? unitHistoryPermission.DisplayOK === 1 : false);

        // Shift Summary (CU105)
        const shiftSummaryPermission = data.find(item => item.ScreenCode === "CU105");
        setShiftSummary(shiftSummaryPermission ? shiftSummaryPermission.DisplayOK === 1 : false);

        // Shift Detailed (CU106)
        const shiftDetailedPermission = data.find(item => item.ScreenCode === "CU106");
        setShiftDetailed(shiftDetailedPermission ? shiftDetailedPermission.DisplayOK === 1 : false);

        // On/Off Duty By Officer (CU107)
        const onOffDutyByOfficerPermission = data.find(item => item.ScreenCode === "CU107");
        setOnOffDutyByOfficer(onOffDutyByOfficerPermission ? onOffDutyByOfficerPermission.DisplayOK === 1 : false);
      }
    } else {
      // Reset all permissions to false
      setUnitCADReports(false);
      setMiscStatusOfUnit(false);
      setOnOffDutyUnit(false);
      setUnitHistory(false);
      setShiftSummary(false);
      setShiftDetailed(false);
      setOnOffDutyByOfficer(false);
    }
  }, [getUnitReportScreenPermissionData, isFetchUnitReportScreenPermission]);

  const getCFSReportScreenPermissionKey = `/ScreenPermission/GetScreenPermissionByParentName/CG101`;
  const { data: getCFSReportScreenPermissionData, isSuccess: isFetchCFSReportScreenPermission } = useQuery(
    [getCFSReportScreenPermissionKey, {
      "PINID": localStoreData?.PINID,
      AgencyID: localStoreData?.AgencyID,
      ScreenCode: "CC101"
    },],
    ScreenPermissionServices.getScreenPermissionByParentName,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!localStoreData?.PINID
    }
  );

  useEffect(() => {
    if (getCFSReportScreenPermissionData && isFetchCFSReportScreenPermission) {
      const data = JSON.parse(getCFSReportScreenPermissionData?.data?.data)?.Table;

      // Filter and set CFS Report screen permissions
      if (data && Array.isArray(data)) {
        // CFS CAD Reports (CC101)
        const cfsCADReportsPermission = data.find(item => item.ScreenCode === "CC101");
        setCFSCADReports(cfsCADReportsPermission ? cfsCADReportsPermission.DisplayOK === 1 : false);

        // CFS Analysis (CC102)
        const cfsAnalysisPermission = data.find(item => item.ScreenCode === "CC102");
        setCFSAnalysis(cfsAnalysisPermission ? cfsAnalysisPermission.DisplayOK === 1 : false);

        // CFS Summary (CC103)
        const cfsSummaryPermission = data.find(item => item.ScreenCode === "CC103");
        setCFSSummary(cfsSummaryPermission ? cfsSummaryPermission.DisplayOK === 1 : false);
      }
    } else {
      // Reset all permissions to false
      setCFSCADReports(false);
      setCFSAnalysis(false);
      setCFSSummary(false);
    }
  }, [getCFSReportScreenPermissionData, isFetchCFSReportScreenPermission]);

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

  const uniqueId = sessionStorage.getItem("UniqueUserID")
    ? Decrypt_Id_Name(
      sessionStorage.getItem("UniqueUserID"),
      "UForUniqueUserID"
    )
    : "";

  const useRouteQuery = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    return {
      get: (param) => params.get(param),
      pathname: location.pathname,
    };
  };

  const query = useRouteQuery();
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
      setUserName(localStoreData?.UserName ? localStoreData?.UserName?.split(",")[0] : '');
      getBoloScreenPermission(localStoreData?.AgencyID, localStoreData?.PINID);
      getQueueCallScreenPermission(localStoreData?.AgencyID, localStoreData?.PINID);
      getNcicScreenPermission(localStoreData?.AgencyID, localStoreData?.PINID);
    }
  }, [localStoreData]);

  const getBoloScreenPermission = (aId, pinID) => {
    try {
      ScreenPermision("BL101", aId, pinID).then(res => {
        if (res) {
          setEffectiveBoloScreenPermission(res);
        }
        else {
          setEffectiveBoloScreenPermission(null);
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setEffectiveBoloScreenPermission(null);
    }
  }

  const getNcicScreenPermission = (aId, pinID) => {
    try {
      ScreenPermision("CN101", aId, pinID).then(res => {
        if (res) {
          setEffectiveNcicScreenPermission(res);
        }
        else {
          setEffectiveNcicScreenPermission(null);
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setEffectiveNcicScreenPermission(null);
    }
  }

  const getQueueCallScreenPermission = (aId, pinID) => {
    try {
      ScreenPermision("QC101", aId, pinID).then(res => {
        if (res) {
          setEffectiveQueueCallScreenPermission(res);
        }
        else {
          setEffectiveQueueCallScreenPermission(null);
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setEffectiveQueueCallScreenPermission(null);
    }
  }

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
                        {EventReceiveSource && <Link to={`/cad/reports/event-receive-source?page=EventReceiveSource`} className="dropdown-item">
                          Event Receive Source
                        </Link>
                        }
                        {MasterEventReport && <Link to={`/cad/reports/master-event-report?page=MasterEventReport`} className="dropdown-item">
                          Master Event Report
                        </Link>
                        }
                        {CallLogReport && <Link to={`/cad/reports/call-log-report?page=CallLogReport`} className="dropdown-item">
                          Call Log Report
                        </Link>
                        }
                        {CallTakerActivity && <Link to={`/cad/reports/call-taker-activity?page=CallTakerActivity`} className="dropdown-item">
                          Call Taker Activity
                        </Link>
                        }
                        {OfficerActivity && <Link to={`/cad/reports/officer-activity?page=OfficerActivityReport`} className="dropdown-item">
                          Officer Activity
                        </Link>
                        }
                        {EventPeakTime && <Link to={`/cad/reports/event-peak-time?page=EventPeakTime`} className="dropdown-item">
                          Event Peak Time
                        </Link>
                        }
                        {CloseCallReport && <Link to={`/cad/reports/close-call?page=CloseCall`} className="dropdown-item">
                          Close Call Report
                        </Link>
                        }
                        {DailyCallSummary && <Link to={`/cad/reports/daily-call-summary?page=DailyCallSummaryReport`} className="dropdown-item">
                          Daily Call Summary
                        </Link>
                        }
                        {CallDispatchSummary && <Link to={`/cad/reports/call-dispatch-summary?page=CallDispatchSummaryReport`} className="dropdown-item">
                          Call Dispatch Summary
                        </Link>
                        }
                        {DispatcherActivity && <Link to={`/cad/reports/dispatcher-activity?page=DispatcherActivity`} className="dropdown-item">
                          Dispatcher Activity
                        </Link>
                        }
                      </div>
                    </div>
                    <div className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle" onClick={(e) => e.stopPropagation()}>
                        GEO
                      </div>
                      <div className="dropdown-menu">
                        {LocationFlagDetails && <Link to={`/cad/reports/location-flag-details?page=LocationFlagDetails`} className="dropdown-item">
                          Location Flag Details
                        </Link>
                        }
                        {PatrolZone && <Link to={`/cad/reports/patrol-zone?page=PatrolZone`} className="dropdown-item">
                          Patrol Zone
                        </Link>
                        }
                        {LocationReport && <Link to={`/cad/reports/location-report?page=LocationReport`} className="dropdown-item">
                          Location Report
                        </Link>
                        }
                      </div>
                    </div>
                    <div className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle" onClick={(e) => e.stopPropagation()}>
                        Unit
                      </div>
                      <div className="dropdown-menu">
                        {MiscStatusOfUnit && <Link to={`/cad/reports/misc-status-of-resource?page=MiscStatusOfResource`} className="dropdown-item">
                          Misc. Status Of Unit
                        </Link>
                        }
                        {OnOffDutyUnit && <Link to={`/cad/reports/onoff-duty-resource-report?page=OnOffDutyResource`} className="dropdown-item">
                          On/Off Duty Unit
                        </Link>
                        }
                        {UnitHistory && <Link to={`/cad/reports/resource-history-report?page=ResourceHistory`} className="dropdown-item">
                          Unit History
                        </Link>
                        }
                        {ShiftSummary && <Link to={`/cad/reports/shift-summary-report?Page=ShiftSummaryReport`} className="dropdown-item">
                          Shift Summary Report
                        </Link>
                        }
                        {ShiftDetailed && <Link to={`/cad/reports/shift-detailed-report?Page=ShiftDetailedReport`} className="dropdown-item">
                          Shift Detailed Report
                        </Link>
                        }
                        {OnOffDutyByOfficer && <Link to={`/cad/reports/onoff-duty-officer?page=OnOffDutyOfficer`} className="dropdown-item">
                          On/Off Duty Report By Officer
                        </Link>
                        }
                      </div>
                    </div>
                    <div className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle" onClick={(e) => e.stopPropagation()}>
                        CFS
                      </div>
                      <div className="dropdown-menu">
                        {CFSAnalysis && <Link to={`/cad/reports/cfs-analysis?page=CFSAnalysis`} className="dropdown-item">
                          CFS Analysis
                        </Link>
                        }
                        {CFSSummary && <Link to={`/cad/reports/cfs-summary?page=CFSSummary`} className="dropdown-item">
                          CFS Summary
                        </Link>
                        }
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
                <button onClick={toggleDarkMode} className="dark-toogle">
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
            {CADDispatch ? (
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
            ) : null}
            {CADEnroute ? (
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
            ) : null}
            {CADArrive ? (
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
            ) : null}
            {CADFree ? (
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
            ) : null}
            {CADClear ? (
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
            ) : null}
            {CADMisc ? (
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
            ) : null}
            {CADUIVS ? (
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
            ) : null}
            {CADGeo ? (
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
            ) : null}
            {CADOnOffDuty ? (
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
            ) : null}
            {effectiveBoloScreenPermission?.[0]?.DisplayOK ? <button
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
            </button> : null}
            {CADMap ? (
              <Link
                className="btn btn-sm btn-light custom-button"
                to={`/cad/map?AgencyID=${localStoreData?.AgencyID}`}
                style={{ width: "70px" }}
                target="_self"
              >
                Map
              </Link>
            ) : null}
            {effectiveNcicScreenPermission?.[0]?.DisplayOK ? <button
              className="btn btn-sm btn-light custom-button"
              data-toggle="modal"
              data-target="#NCICModal"
              style={{ width: "70px" }}
              onClick={() => {
                setOpenNCICModal(true);
              }}
            >
              NCIC
            </button> : null}
            {!pathname.startsWith("/cad/queue-call") && effectiveQueueCallScreenPermission?.[0]?.AddOK ? <Link
              className="btn btn-sm btn-light custom-button position-relative"
              to={`/cad/queue-call`}
            >
              Queue Calls
              <span className="badge badge-light" style={{ position: "absolute", right: -8, top: -15, backgroundColor: "#B9D9EB" }}>{queueCallCount}</span>
            </Link> : null}
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
      {openDispatcherModal && <DispatcherModal {...{ openDispatcherModal, setOpenDispatcherModal }} />}
      {openRIVSModal && <RIVSModal {...{ openRIVSModal, setOpenRIVSModal }} />}
      {openFreeModal && <FreeModal {...{ openFreeModal, setOpenFreeModal }} />}
      {openClearModal && <ClearModal {...{ openClearModal, setOpenClearModal }} />}
      {openArriveModal && <ArriveModal {...{ openArriveModal, setArriveModal }} />}
      {openEnrouteModal && <EnrouteModal {...{ openEnrouteModal, setEnrouteModal }} />}
      {openOnOffDutyModal && <OnOffDutyModal {...{ openOnOffDutyModal, setOnOffDutyModal }} />}
      {openQueryIncidentModal && <QueryIncidentModal {...{ openQueryIncidentModal, setQueryIncidentModal }} />}
      {openMiscModal && <MiscellaneousModal {...{ openMiscModal, setOpenMiscModal }} />}
      {openNCICModal && <NCICModal {...{ openNCICModal, setOpenNCICModal }} />}
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
