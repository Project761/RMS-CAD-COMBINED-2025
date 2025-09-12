import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AgencyContext } from './Context/Agency/Index';
import Header from './CADComponents/Header';
import { LoginContext } from './CADContext/loginAuth';
import { useSelector } from 'react-redux';
import { base64ToString } from './Components/Common/Utility';
import GoogleAuthServices from "./CADServices/APIs/googleAuth";
import { connection } from "./CADServices/signalRService";
import { stringToBase64 } from "./Components/Common/Utility";
import Sidebar from './CADComponents/Sidebar/Sidebar';
import { HubConnectionState } from '@microsoft/signalr';

const CADAuth = (props) => {
  const { cmp, listManagementSideBar, agencySideBar, personnelSideBar, progressData, progressStatus, hideHeader, isCAD = false, reportSidebar } = props
  const Com = cmp;
  const [isIncidentDispatch, setIsIncidentDispatch] = useState(false)
  const navigate = useNavigate()
  const { setAuthSession, setLogByOtp, setIsLogout } = useContext(AgencyContext);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const IsLoginSession = sessionStorage.getItem('is-login') ? sessionStorage.getItem('is-login') : false;
  const currentLocation = window.location.pathname + window.location.search + window.location.hash;

  useEffect(() => {
    if (IsLoginSession && window.location.href === window.location.origin + "/dashboard-page") {
      preventBack();
    }
  }, [window.location.pathname]);

  function preventBack() {
    window.onpopstate = function (event) {
      if (event.state && event.state.url === currentLocation || currentLocation === window.location.pathname) {
        window.history.go(1);
      }
    };
    window.history.pushState(null, null, currentLocation);
  }


  useEffect(() => {
    if (localStoreData?.Is2FAEnabled) {
      const accessToken = sessionStorage.getItem("access_token");
      if ((IsLoginSession === 'true' || IsLoginSession === true)) {
        if (accessToken && connection.state !== HubConnectionState.Connected) {
          connection
            .start()
            .then(() => {
              const encodedId = stringToBase64(connection.connectionId);
              localStorage.setItem("connectionId", encodedId);
              sessionStorage.setItem("connectionId", encodedId);
            })
            .catch(err => console.error("❌ Error starting SignalR connection:", err));
        }
      } else {
        setIsLogout(false);
        setLogByOtp(false);
        setAuthSession('');
        navigate('/');
      }
    }
  }, []);

  useEffect(() => {
    if (localStoreData?.Is2FAEnabled) {
      const accessToken = sessionStorage.getItem("access_token");
      if (IsLoginSession === 'true' || IsLoginSession === true) {
        if (accessToken && connection.state === HubConnectionState.Disconnected) {
          connection
            .start()
            .then(() => {
              const encodedId = stringToBase64(connection.connectionId);
              localStorage.setItem("connectionId", encodedId);
              sessionStorage.setItem("connectionId", encodedId);
            })
            .catch(err => {
              console.error("❌ SignalR start failed:", err);
            });
        } else {
          console.warn("⚠ SignalR already started or not ready.");
        }
      } else {
        setIsLogout(false);
        setLogByOtp(false);
        setAuthSession('');
        navigate('/');
      }
    }
  }, [IsLoginSession]);


  useEffect(() => {
    if (!localStoreData?.Is2FAEnabled) {
      if (IsLoginSession === 'true' || IsLoginSession === true) {

      } else {
        setIsLogout(false);
        setLogByOtp(false)
        setAuthSession('');
        navigate('/');
      }
    }
  }, [])

  useEffect(() => {
    if (!localStoreData?.Is2FAEnabled) {
      if (IsLoginSession === 'true' || IsLoginSession === true) {
      } else {
        setIsLogout(false);
        setLogByOtp(false)
        setAuthSession('');
        navigate('/');
      }
    }
  }, [IsLoginSession]);

  const timerRef = useRef(null);
  const timeout = 1200000;
  const sessionTimeOut = sessionStorage.getItem("SessionTimeOut");
  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(logout, parseInt(sessionTimeOut) * 60 * 1000);
  };

  const logout = async () => {
    const ConnectionID = localStorage.getItem("connectionId");
    if (localStoreData?.PINID && ConnectionID) {
      await GoogleAuthServices.logOutSingleDevices({ UserPINID: localStoreData?.PINID.toString(), ConnectionID: base64ToString(ConnectionID) });
    }
    navigate("/");
  };

  useEffect(() => {
    resetTimer();
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'load', 'click', 'resize'];
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      clearTimeout(timerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [sessionTimeOut]);

  return (
    <>
      {/* Sidebar */}
      {
        !IsLoginSession ? (
          navigate('/')
        ) : (
          <div className="cad-css">
            {reportSidebar ? (
              <>
                <Sidebar {...{ reportSidebar }} />
                <div className="page">
                  <Header {...{ listManagementSideBar, agencySideBar, personnelSideBar }} />
                  {/* Component */}
                  <Com {...{ progressData, progressStatus, isIncidentDispatch, isCAD }} />
                </div>
              </>
            ) : (
              <>
                {!hideHeader && (
                  <Header {...{ listManagementSideBar, agencySideBar, personnelSideBar, isIncidentDispatch, setIsIncidentDispatch }} />
                )}
                <div>
                  {reportSidebar ? (
                    <>
                      <Sidebar {...{ reportSidebar }} />
                      <div className="page">
                        <Com {...{ progressData, progressStatus, isIncidentDispatch, isCAD }} />
                      </div>
                    </>
                  ) : (
                    <Com {...{ progressData, progressStatus, isIncidentDispatch, isCAD }} />
                  )}
                </div>
              </>
            )}
          </div>
        )
      }
    </>
  )
}

CADAuth.propTypes = {
  cmp: PropTypes.elementType.isRequired,
  listManagementSideBar: PropTypes.bool,
  agencySideBar: PropTypes.bool,
  personnelSideBar: PropTypes.bool,
  progressData: PropTypes.any,
  progressStatus: PropTypes.any,
  hideHeader: PropTypes.bool,
  isCAD: PropTypes.bool,
  reportSidebar: PropTypes.bool,
  searchSidebar: PropTypes.bool,
  arrestSearchSideBar: PropTypes.bool,
  consolidationSideBar: PropTypes.bool,
  path: PropTypes.string,
  incidentSideBar: PropTypes.bool,
  dashboardSidebar: PropTypes.bool,
  propertyStorageSideBar: PropTypes.bool,
  nameSearchSideBar: PropTypes.bool,
  expungeSideBar: PropTypes.bool,
  propertyRoomSideBar: PropTypes.bool
}

CADAuth.defaultProps = {
  listManagementSideBar: false,
  agencySideBar: false,
  personnelSideBar: false,
  progressData: null,
  progressStatus: null,
  hideHeader: false,
  isCAD: false,
  reportSidebar: false,
  searchSidebar: false,
  arrestSearchSideBar: false,
  consolidationSideBar: false,
  path: '',
  incidentSideBar: false,
  dashboardSidebar: false,
  propertyStorageSideBar: false,
  nameSearchSideBar: false,
  expungeSideBar: false,
  propertyRoomSideBar: false
}

export default CADAuth
