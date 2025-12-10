import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Components/Inc/Sidebar';
import Header from './Components/Inc/Header';
import { AgencyContext } from './Context/Agency/Index';
import { useHistory } from 'react-router-dom';
import useNoBackNavigation from './useNoBackNavigation';
import { useSelector } from 'react-redux';
import GoogleAuthServices from "./CADServices/APIs/googleAuth";
import { base64ToString, stringToBase64 } from './Components/Common/Utility';
import { connection } from "./CADServices/signalRService";
import { HubConnectionState } from '@microsoft/signalr';
const CryptoJS = require("crypto-js");

const Auth = (props) => {

  useNoBackNavigation();
  const { cmp, listManagementSideBar, agencySideBar, propertyRoomSideBar, personnelSideBar, path, incidentSideBar, dashboardSidebar, nameSearchSideBar, arrestSearchSideBar, progressData, progressStatus, propertyStorageSideBar, reportSidebar, searchSidebar, consolidationSideBar, expungeSideBar, caseManagementSideBar } = props

  const Com = cmp;
  const TIMESTAMP_KEY = 'lastTimestamp';
  const CHECK_INTERVAL = 60000;
  const EXPIRY_THRESHOLD = 300000;

  const navigate = useNavigate()

  const { setAuthSession, setLogByOtp, setIsLogout } = useContext(AgencyContext);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const IsLoginSession = sessionStorage.getItem('is-login') ? sessionStorage.getItem('is-login') : false;

  const currentLocation = window.location.pathname + window.location.search + window.location.hash;


  useEffect(() => {

    if (IsLoginSession && window.location.pathname === "/dashboard-page") {
      if (window.location.pathname === "/dashboard-page") {
        preventBack();
      }
    }


  }, [window.location.pathname, window.location.href]);


  function preventBack() {
    window.onpopstate = function (event) {
      if (event.state && event.state.url === currentLocation || currentLocation === window.location.pathname) {
        window.history.go(1);
      }
    };
    window.history.pushState({ url: currentLocation }, '');
    window.history.pushState(null, null, currentLocation);
  }

  useEffect(() => {
    if (localStoreData?.Is2FAEnabled) {
      const accessToken = sessionStorage.getItem("access_token");
      if (IsLoginSession === 'true' || IsLoginSession === true) {
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
  }, [localStoreData]);

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
  }, [IsLoginSession, localStoreData]);

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
  }, [IsLoginSession])


  // to sign out if user is not active from a long time
  const timerRef = useRef(null);
  // const timeout = 1800000;
  const timeout = 14400000;
  const sessionTimeOut = sessionStorage.getItem("SessionTimeOut");
  // const resetTimer = () => {
  //   if (timerRef.current) {
  //     clearTimeout(timerRef.current);
  //   }
  //   timerRef.current = setTimeout(logout, parseInt(sessionTimeOut) * 60 * 1000);
  // };

  const logout = async () => {
    // const ConnectionID = localStorage.getItem("connectionId");
    // if (localStoreData?.PINID && ConnectionID) {
    //   await GoogleAuthServices.logOutSingleDevices({ UserPINID: localStoreData?.PINID.toString(), ConnectionID: base64ToString(ConnectionID) });
    // }
    // navigate("/");
  };

  // useEffect(() => {
  //   resetTimer();
  //   const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'load', 'click', 'resize'];
  //   const handleActivity = () => {
  //     resetTimer();
  //   };

  //   events.forEach(event => {
  //     window.addEventListener(event, handleActivity);
  //   });

  //   return () => {
  //     clearTimeout(timerRef.current);
  //     events.forEach(event => {
  //       window.removeEventListener(event, handleActivity);
  //     });
  //   };
  // }, [sessionTimeOut]);

  return (
    <>
      {/* Sidebar */}
      {
        !IsLoginSession ? navigate('/')
          : <>
            <Sidebar {...{ listManagementSideBar, agencySideBar, propertyRoomSideBar, propertyStorageSideBar, personnelSideBar, path, incidentSideBar, dashboardSidebar, nameSearchSideBar, arrestSearchSideBar, reportSidebar, searchSidebar, consolidationSideBar, expungeSideBar, caseManagementSideBar }} />
            <div className="page">
              <Header {...{ listManagementSideBar, agencySideBar, personnelSideBar }} />
              {/* Component */}
              <Com {...{ progressData, progressStatus }} />
            </div>
          </>
      }
    </>
  )
}

export default Auth


export function encrypt(plain) {
  const aesKey = '0ca175b9c0f726a831d895e269332461';
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const encryptedData = CryptoJS.AES.encrypt(plain, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encryptedData.ciphertext.toString()));
}

export function decrypt(secret) {
  const aesKey = '0ca175b9c0f726a831d895e269332461';
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const decryptedData = CryptoJS.AES.decrypt(secret, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decryptedData.toString(CryptoJS.enc.Utf8);
}