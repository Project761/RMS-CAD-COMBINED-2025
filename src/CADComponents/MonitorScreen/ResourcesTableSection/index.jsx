import { useContext, useEffect, useState } from 'react';
import { getShowingDateText, getShowingYearMonthDate, stringToBase64 } from '../../../Components/Common/Utility';
import DateTimeCounter from '../../Common/DateTimeCounter';
import { useNavigate } from 'react-router-dom';
import { IncidentContext } from '../../../CADContext/Incident';
import {
  compareStrings
} from "../../../CADUtils/functions/common";
import ResourcesStatusServices from "../../../CADServices/APIs/resourcesStatus";
import { useSelector } from 'react-redux';
import MasterTableListServices from '../../../CADServices/APIs/masterTableList'
import { useQuery } from 'react-query';
import Tooltip from '../../Common/Tooltip';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import MonitorServices from '../../../CADServices/APIs/monitor'
import PARTimerOverDueModal from '../../PARTimerOverDueModal';
import { AgencyContext } from '../../../Context/Agency/Index';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { ScreenPermision } from '../../../Components/hooks/Api';

const ResourcesTableSection = (props) => {
  const dispatch = useDispatch();
  const { GetDataTimeZone, datezone } =
    useContext(AgencyContext);
  const navigate = useNavigate();
  const { resources, isResourceStatusTab = false, isCADMap = false, isViewEventDetails = false } = props
  const { resourceRefetch, offset } = useContext(IncidentContext);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [editValue, setEditValue] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
  const [draggingColumnIndex, setDraggingColumnIndex] = useState(null);
  const [loginAgencyID, setLoginAgencyID] = useState();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 670);
  const [resourceStatusColorData, setResourceStatusColorData] = useState([]);
  const [PARTimerModal, setPARTimerModal] = useState(false);
  const [loginPinID, setLoginPinID,] = useState('');
  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);
  const [displayTimer, setDisplayTimer] = useState("00:00"); // State to store the formatted timer
  const [timers, setTimers] = useState({});
  const [isResourcePAR, setIsResourcePAR] = useState(false);
  const [isOfficer1PAR, setIsOfficer1PAR] = useState(false);
  const [isOfficer2PAR, setIsOfficer2PAR] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState(null);
  const [effectivePARScreenPermission, setEffectivePARScreenPermission] = useState(null);

  const getFilteredOptions = (status) => {
    let validStatusCodes = [];
    if (status === 'DP') {
      validStatusCodes = ['AV', 'ER', 'EH', 'AR', 'AH', 'DP'];
    } else if (status === 'ER') {
      validStatusCodes = ['AV', 'EH', 'AR', 'AH', 'ER'];
    } else if (status === 'EH') {
      validStatusCodes = ['AV', 'ER', 'AR', 'AH', 'EH'];
    } else if (status === 'AR') {
      validStatusCodes = ['AV', 'AH', 'AR'];
    } else {
      validStatusCodes = resourceStatusColorData.map(option => option.ResourceStatusCode);
    }
    return resourceStatusColorData.filter(option => validStatusCodes.includes(option.ResourceStatusCode));
  };

  const getResourceStatusColorKey = `/CAD/ResourceStatusColor/GetData_DropDown_ResourceStatusColor/${loginAgencyID}`;
  const { data: resourceStatusColorList, isSuccess: isFetchResourceStatusColorList } = useQuery(
    [getResourceStatusColorKey, {
      AgencyID: loginAgencyID,
    }],
    MasterTableListServices.getData_DropDown_ResourceStatusColor,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID,
    }
  );

  useEffect(() => {
    if (isFetchResourceStatusColorList && resourceStatusColorList) {
      const res = JSON.parse(resourceStatusColorList?.data?.data);
      const data = res?.Table
      setResourceStatusColorData(data || [])
    } else {
      setResourceStatusColorData([])
    }
  }, [isFetchResourceStatusColorList, resourceStatusColorList])

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      setLoginPinID(localStoreData?.PINID)
      GetDataTimeZone(localStoreData?.AgencyID);
      getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID)
      getPARScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID)
    }
  }, [localStoreData]);

  const getScreenPermision = (aId, pinID) => {
    try {
      ScreenPermision("CA104", aId, pinID).then(res => {
        if (res) {
          setEffectiveScreenPermission(res);
        }
        else {
          setEffectiveScreenPermission(null);
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setEffectiveScreenPermission(null);
    }
  }

  const getPARScreenPermision = (aId, pinID) => {
    try {
      ScreenPermision("CA103", aId, pinID).then(res => {
        if (res) {
          setEffectivePARScreenPermission(res);
        }
        else {
          setEffectivePARScreenPermission(null);
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setEffectivePARScreenPermission(null);
    }
  }

  const handleStatusChange = async (row, newValue) => {
    const data = {
      Status: newValue,
      IncidentID: row?.IncidentID,
      Resources: row?.ResourceID,
      CreatedByUserFK: loginPinID,
      AgencyID: loginAgencyID,
    };

    try {
      const response = await ResourcesStatusServices.incidentRecourseStatus(data);
      if (response?.status === 200) {
        resourceRefetch();
      } else {
        console.error("Failed to update status:", response);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const initialStatusData = {};
    resources.forEach(row => {
      initialStatusData[row.IncidentID] = row.Status;
    });
  }, [resources]);

  const getStatusColors = (statusCode) => {
    const statusItem = resourceStatusColorData.find(item => item.ResourceStatusCode === statusCode);
    return statusItem
      ? { backgroundColor: statusItem.BackColor, color: statusItem.ForeColor }
      : {}; // Default to empty if no match found
  };

  const removeStateAndCountry = (location) => {
    if (!location) return '';

    const cleaned = location
      .replace(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|Texas|California)\b,?\s?/g, '')
      .replace(/,?\s?USA\b/, '')
      .trim();

    // If everything was removed and it's now empty, return the original
    return cleaned.length > 0 ? cleaned : location;
  };

  const handleTimerUpdate = (rowID, newTime, type) => {

    // Update the timers with a structure that ensures no overwriting
    setTimers((prevTimers) => ({
      ...prevTimers,
      [rowID]: {
        // If the resource already has a timer, keep it; otherwise, set it to newTime

        timer: type === "Officer2" ? prevTimers[rowID]?.timer : newTime,
        // If Officer2 timer is being updated, set it, otherwise keep existing one
        ...(type === "Officer2" ? { Officer2: newTime } : {})
      }
    }));

    // Update the display timer
    setDisplayTimer(newTime);
  };


  const handleEditResource = (row) => {
    setEditValue(row);
    setIsResourcePAR(true);
    setIsOfficer1PAR(false);
    setIsOfficer2PAR(false);
    setPARTimerModal(true);
  };

  const handleEditOfficer1 = (row) => {
    setEditValue(row);
    setIsResourcePAR(false);
    setIsOfficer1PAR(true);
    setIsOfficer2PAR(false);
    setPARTimerModal(true);
  };

  const handleEditOfficer2 = (row) => {
    setEditValue(row);
    setIsResourcePAR(false);
    setIsOfficer1PAR(false);
    setIsOfficer2PAR(true);
    setPARTimerModal(true);
  };

  // const TimerComponent = ({ row, onTimerUpdate, type }) => {
  //   const [isNegative, setIsNegative] = useState(false);
  //   let timeParts;

  //   if (type === "Resource") {
  //     timeParts = row?.ResourcePARTime?.split(':')
  //   }
  //   if (type === "Officer1") {
  //     timeParts = row?.Officer1PARTime?.split(':')
  //   }
  //   if (type === "Officer2") {
  //     timeParts = row?.Officer2PARTime?.split(':')
  //   }

  //   // If the length is 1 (only minutes), we assume seconds to be 0
  //   const minutes = parseInt(timeParts[0], 10);;
  //   const seconds = timeParts?.length > 1 ? parseInt(timeParts[1], 10) : 0;

  //   // const [minutes, seconds] = row.ResourcePARTime.split(':').map((str) => parseInt(str, 10));
  //   const totalSecond = minutes * 60 + seconds
  //   // const [timer, setTimer] = useState(minutes * 60 + seconds);
  //   const [timer, setTimer] = useState();

  //   const [isCountingDown, setIsCountingDown] = useState(true); // To track whether we are counting down or up

  //   useEffect(() => {
  //     if (offset) {

  //       const NewResourceSafeTime = new Date(row?.ResourceSafeTime);
  //       const NewOfficer1SafeTime = new Date(row?.Officer1SafeTime);
  //       const NewOfficer2SafeTime = new Date(row?.Officer2SafeTime);
  //       let statusTime;
  //       if (type === "Resource") {
  //         statusTime = NewResourceSafeTime
  //       }
  //       if (type === "Officer1") {
  //         statusTime = NewOfficer1SafeTime
  //       }
  //       if (type === "Officer2") {
  //         statusTime = NewOfficer2SafeTime
  //       }
  //       const dataMoment = moment(statusTime);
  //       const pastDate = dataMoment.add(offset * -1, 'm');
  //       const currentDate = moment().utc().add(new Date().getTimezoneOffset(), 'm');
  //       const duration = moment.duration(currentDate.diff(pastDate));

  //       const elapsedSeconds = Math.floor(duration / 1000); // Convert to seconds
  //       let remainingTime = totalSecond - elapsedSeconds; // Calculate remaining time in seconds

  //       if (remainingTime <= 0) {
  //         remainingTime = Math.abs(remainingTime); // Ensure it doesn't go negative and start counting up
  //         setIsCountingDown(false); // Switch to counting up after reaching 0
  //         setIsNegative(false);
  //       } else {
  //         setIsCountingDown(true); // Continue counting down
  //         setIsNegative(true);
  //       }
  //       setTimer(remainingTime); // Set the timer to the calculated remaining time
  //     }

  //     // Interval logic to update the timer every second
  //     const interval = setInterval(() => {
  //       setTimer((prevTimer) => {
  //         let newTimer;
  //         if (isCountingDown) {
  //           newTimer = prevTimer - 1; // Decrease the timer by 1 second
  //           if (newTimer <= 0) {
  //             newTimer = 0; // Set the timer to 0 when it hits 0
  //             setIsCountingDown(false); // Switch to counting up after reaching 0
  //             setIsNegative(false);
  //           }
  //         } else {
  //           newTimer = prevTimer + 1; // Start increasing the timer by 1 second
  //         }
  //         return newTimer;
  //       });
  //     }, 1000); // Update every second

  //     return () => clearInterval(interval); // Cleanup the interval on unmount
  //   }, [row.ResourceID, isCountingDown, resources, row.StatusDT, row.ResourcePARTime, row.ResourceSafeTime, row.Officer1PARTime, row.Officer1SafeTime, row.Officer2PARTime, row.Officer2SafeTime, offset]);
  //   useEffect(() => {
  //     const minutes = Math.floor(timer / 60); // Get the minutes
  //     const seconds = timer % 60; // Get the seconds
  //     const formattedTime = `${isNegative ? '-' : '+'}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  //     //  const time =  type === "Officer2" ? formattedTime : ""
  //     onTimerUpdate(row.ResourceID, formattedTime, type);
  //     setDisplayTimer(formattedTime); // Update displayTimer state
  //   }, [timer, onTimerUpdate, isNegative, row.ResourceID]); // Update when timer changes

  //   let formattedTime;


  //   if (type === "Resource") {
  //     formattedTime = row?.IsPauseResource ?
  //       row.ResourceCurrentTimer : `${isNegative ? '-' : '+'}${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;
  //   }
  //   if (type === "Officer1") {
  //     formattedTime = row?.IsPauseOfficer1 ?
  //       row.Officer1CurrentTimer : `${isNegative ? '-' : '+'}${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;
  //   }
  //   if (type === "Officer2") {
  //     formattedTime = row?.IsPauseOfficer2 ?
  //       row.Officer2CurrentTimer : `${isNegative ? '-' : '+'}${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;
  //   }

  //   let backgroundColor;
  //   let color;
  //   let isBlinking = false;
  //   const convertToSeconds = (timer) => {
  //     const [minutes, seconds] = timer?.split(':').map(Number);
  //     const isNegative = timer.startsWith('-');
  //     if (isNegative) {
  //       return minutes * 60 - Math.abs(seconds); // Subtract seconds when minutes are negative
  //     } else {
  //       return minutes * 60 + seconds; // Normal calculation for positive or zero minutes
  //     }
  //   };

  //   if (formattedTime) {
  //     const timerInSeconds = convertToSeconds(formattedTime);
  //     if (timerInSeconds <= -60) {
  //       backgroundColor = "green"
  //       color = "white"
  //       isBlinking = false
  //     } else if (timerInSeconds > -60 && timerInSeconds <= 0) {
  //       backgroundColor = "yellow"
  //       color = "black"
  //       isBlinking = false
  //     } else if (timerInSeconds > 0) {
  //       backgroundColor = "red"
  //       color = "white"
  //       isBlinking = true
  //     }
  //   }

  //   return (
  //     <>
  //       {(type === "Resource") && <button
  //         className={`btn btn-sm  p-1 py-0 ${isBlinking ? "blinking-text" : ""}`}
  //         style={{ background: backgroundColor, color: color, cursor: "pointer", display: 'flex', alignItems: 'center', gap: '5px', width: "100%", fontSize: "12px" }}
  //         onClick={() => {
  //           handleEditResource(row)
  //         }}
  //         data-toggle="modal"
  //         data-target="#PARTimerModal"
  //       >
  //         {row.ResourceNumber}
  //         {row.IsPrimaryResource && (
  //           <span
  //             style={{
  //               backgroundColor: "#3358ff",
  //               color: "#ffffff",
  //               // padding: '4px 4px',
  //               borderRadius: '4px',
  //               display: 'inline-block',
  //               minWidth: '22px',
  //               textAlign: 'center',
  //             }}
  //           >
  //             {"P"}
  //           </span>
  //         )}
  //         {row?.IsPauseResource ? <i className="fa fa-pause" style={{ fontSize: "16px" }} /> : <i className="fa fa-clock-o" style={{ fontSize: "16px" }} />}
  //         {
  //           row?.IsPauseResource ?
  //             row.ResourceCurrentTimer :
  //             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0px', margin: '0px', width: "60px" }}>
  //               {isNegative ? '-' : '+'}
  //               {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
  //             </div>
  //         }
  //       </button>}
  //       {(type === "Officer1") && <button
  //         className={`btn btn-sm  p-1 py-0 ${isBlinking ? "blinking-text" : ""}`}
  //         style={{ background: backgroundColor, color: color, cursor: "pointer", display: 'flex', alignItems: 'center', gap: '5px', width: "100%", fontSize: "12px" }}
  //         onClick={() => {
  //           handleEditOfficer1(row)
  //         }}
  //         data-toggle="modal"
  //         data-target="#PARTimerModal"
  //       >
  //         {row.Officer1}
  //         {row?.IsPauseOfficer1 ? <i className="fa fa-pause" style={{ fontSize: "16px" }} /> : <i className="fa fa-clock-o" style={{ fontSize: "16px" }} />}
  //         {
  //           row?.IsPauseOfficer1 ?
  //             row.Officer1CurrentTimer :
  //             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0px', margin: '0px', width: "60px" }}>
  //               {isNegative ? '-' : '+'}
  //               {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
  //             </div>
  //         }
  //       </button>}
  //       {(type === "Officer2") && <button
  //         className={`btn btn-sm  p-1 py-0 ${isBlinking ? "blinking-text" : ""}`}

  //         style={{ background: backgroundColor, color: color, cursor: "pointer", display: 'flex', alignItems: 'center', gap: '5px', width: "100%", fontSize: "12px" }}
  //         onClick={() => {
  //           handleEditOfficer2(row)
  //         }}
  //         data-toggle="modal"
  //         data-target="#PARTimerModal"
  //       >
  //         {row.Officer2}
  //         {row?.IsPauseOfficer2 ? <i className="fa fa-pause" style={{ fontSize: "16px" }} /> : <i className="fa fa-clock-o" style={{ fontSize: "16px" }} />}
  //         {
  //           row?.IsPauseOfficer2 ?
  //             row.Officer2CurrentTimer :
  //             <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0px', margin: '0px', width: "60px" }}>
  //               {isNegative ? '-' : '+'}
  //               {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`}
  //             </div>
  //         }
  //       </button>}
  //     </>
  //   );
  // };

  const TimerComponent = ({ row, onTimerUpdate, type }) => {
    const [timer, setTimer] = useState();
    const [isNegative, setIsNegative] = useState(false);
    const [isCountingDown, setIsCountingDown] = useState(true);

    // Derive PAR time and Safe time based on type
    const getTimeParts = () => {
      const timeStr = row?.[`${type}PARTime`];
      return timeStr?.split(':') || [];
    };

    const getSafeTime = () => new Date(row?.[`${type}SafeTime`]);

    const isPaused = row?.[`IsPause${type}`];
    const currentTimer = row?.[`${type}CurrentTimer`];

    const getFormattedTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${isNegative ? '-' : '+'}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const convertToSeconds = (formatted) => {
      const [min, sec] = formatted?.split(':').map(Number);
      return formatted?.startsWith('-') ? (min * 60 - Math.abs(sec)) : (min * 60 + sec);
    };

    // Setup timer on mount
    useEffect(() => {
      const timeParts = getTimeParts();
      const minutes = parseInt(timeParts[0], 10);
      const seconds = timeParts.length > 1 ? parseInt(timeParts[1], 10) : 0;
      const totalSeconds = minutes * 60 + seconds;

      if (offset) {
        const statusTime = getSafeTime();
        const pastDate = moment(statusTime).add(offset * -1, 'm');
        const currentDate = moment().utc().add(new Date().getTimezoneOffset(), 'm');
        const elapsedSeconds = Math.floor(moment.duration(currentDate.diff(pastDate)).asSeconds());

        let remaining = totalSeconds - elapsedSeconds;

        if (remaining <= 0) {
          setIsCountingDown(false);
          setIsNegative(false);
          remaining = Math.abs(remaining);
        } else {
          setIsCountingDown(true);
          setIsNegative(true);
        }

        setTimer(remaining);
      }

      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev === undefined) return prev;
          const updated = isCountingDown ? prev - 1 : prev + 1;

          if (isCountingDown && updated <= 0) {
            setIsCountingDown(false);
            setIsNegative(false);
            return 0;
          }

          return updated;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [
      row.ResourceID, type, offset, isCountingDown,
      row.ResourcePARTime, row.ResourceSafeTime,
      row.Officer1PARTime, row.Officer1SafeTime,
      row.Officer2PARTime, row.Officer2SafeTime
    ]);

    useEffect(() => {
      if (timer === undefined) return;
      const formattedTime = getFormattedTime(timer);
      onTimerUpdate(row.ResourceID, formattedTime, type);
    }, [timer]);

    // Format for display
    const displayFormatted = isPaused
      ? currentTimer
      : getFormattedTime(timer);

    // Style logic
    const secondsVal = convertToSeconds(displayFormatted);
    let backgroundColor = 'transparent', color = 'black', isBlinking = false;

    if (secondsVal <= -60) {
      backgroundColor = 'green';
      color = 'white';
    } else if (secondsVal > -60 && secondsVal <= 0) {
      backgroundColor = 'yellow';
      color = 'black';
    } else if (secondsVal > 0) {
      backgroundColor = 'red';
      color = 'white';
      isBlinking = true;
    }

    const handleClick = () => {
      if (type === 'Resource') handleEditResource(row);
      else if (type === 'Officer1') handleEditOfficer1(row);
      else if (type === 'Officer2') handleEditOfficer2(row);
    };

    return (
      <button
        className={`btn btn-sm p-1 py-0 ${isBlinking ? 'blinking-text' : ''}`}
        style={{
          background: backgroundColor,
          color,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          width: '100%',
          fontSize: '12px'
        }}
        onClick={effectivePARScreenPermission?.[0]?.Changeok === 1 ? handleClick : () => { }}
        data-toggle="modal"
        data-target="#PARTimerModal"
      >
        {type === 'Resource' ? row.ResourceNumber : row[type]}
        {row?.[`IsPrimary${type}`] && type === 'Resource' && (
          <span style={{
            backgroundColor: "#3358ff",
            color: "#fff",
            borderRadius: '4px',
            minWidth: '22px',
            textAlign: 'center',
          }}>P</span>
        )}
        <i className={`fa ${isPaused ? 'fa-pause' : 'fa-clock-o'}`} style={{ fontSize: '16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '60px' }}>
          {displayFormatted}
        </div>
      </button>
    );
  };

  const initialCols = [
    {
      name: 'Unit Type',
      selector: (row) => row.ResourceTypeCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
      width: isSmallScreen ? "130px" : "130px",
    },
    {
      name: 'Unit #',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceNumber, rowB.ResourceNumber),
      width: isSmallScreen ? "160px" : "160px",
      selector: (row) => {
        if ((row.Status === "AR" || row.Status === "AH") && row.ResourcePARTime && !row.IsSplited && !isCADMap) {
          return (
            <>
              <TimerComponent
                row={row}
                onTimerUpdate={handleTimerUpdate}
                type={"Resource"}
              />
            </>
          );
        } else {
          return (
            <>
              {row.ResourceNumber}
              {row.IsPrimaryResource &&
                <span
                  style={{
                    backgroundColor: "#3358ff", color: "#ffffff",
                    padding: '4px 4px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    minWidth: '22px',
                    textAlign: 'center',
                    marginLeft: "2px"
                  }}
                >
                  {"P"}
                </span>
              }
            </>
          );
        }
      },
    },
    {
      name: 'Status',
      selector: (row) => {
        const colors = getStatusColors(row.Status); // Get colors based on Status
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                ...colors,
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                minWidth: '50px',
                textAlign: 'center'
              }}
            >
              {row.Status}
            </span>
            {(row.Status !== "AV" && !!row?.ResourceAvailableStatus && effectiveScreenPermission?.[0]?.Changeok === 1) && (
              <select
                onChange={(e) => { if (row.Status !== e.target.value) { handleStatusChange(row, e.target.value) } }}
                value={
                  getFilteredOptions(row.Status)?.find((i) => i?.ResourceStatusCode === row.Status)?.ResourceStatusCode ||
                  getFilteredOptions(row.Status)?.[0]?.ResourceStatusCode
                }
                disabled={isViewEventDetails}
                className="form-select status-dropdown"
                style={{
                  width: '20px',
                  padding: '2px',
                  fontSize: '16px',
                  marginLeft: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  appearance: 'auto',
                }}
              >
                {getFilteredOptions(row.Status)?.map((option, index) => (
                  <option key={index} value={option.ResourceStatusCode}>
                    {`${option.ResourceStatusCode} | ${option.Description}`}&nbsp;
                  </option>
                ))}
              </select>
            )
            }
          </div>
        );
      },
      sortable: false,
      width: isSmallScreen ? "120px" : "120px",
    },
    {
      name: 'Location',
      selector: (row) => removeStateAndCountry(row?.CrimeLocation || '') || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CrimeLocation, rowB.CrimeLocation),
      width: isSmallScreen ? "350px" : "350px",
      cell: (row) => {
        const cleanedLocation = removeStateAndCountry(row?.CrimeLocation || '');
        return <Tooltip text={cleanedLocation} maxLength={45} />;
      },
    },
    {
      name: 'Status Date & Time',
      selector: (row) => (row.StatusDT ? getShowingDateText(row.StatusDT) : ""),
      sortable: true,
      width: isSmallScreen ? "170px" : "170px",

    },
    {
      name: 'E Timer',
      selector: (row) => (row.StatusDT && row.Status !== "AV" ? <DateTimeCounter data={row.StatusDT} /> : ""),
      sortable: true,
      width: isSmallScreen ? "100px" : "100px",

    },
    {
      name: 'CAD Event #',
      selector: (row) => row.CADIncidentNumber,
      sortable: true,
      width: isSmallScreen ? "100px" : "120px",

    },
    {
      name: 'Incident Recvd DT&TM',
      selector: (row) => (row.IncidentDtTm ? getShowingDateText(row.IncidentDtTm) : ""),
      sortable: true,
      width: isSmallScreen ? "180px" : "180px",

    },
    {
      name: 'RMS Incident#',
      selector: (row) => row.IncidentNumber,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.IncidentNumber, rowB.IncidentNumber),
      width: isSmallScreen ? "170px" : "170px",
    },
    {
      name: 'CFS Code',
      selector: (row) => row.CFSCODE,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCODE, rowB.CFSCODE),
      width: isSmallScreen ? "170px" : "170px",
    },
    {
      name: 'CFS Description',
      selector: (row) => row.CFSCodeDescription,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCodeDescription, rowB.CFSCodeDescription),
      width: isSmallScreen ? "190px" : "190px",
      cell: (row) => (
        <Tooltip text={row?.CFSCodeDescription || ''} maxLength={15} />
      ),
    },
    {
      name: 'Zone',
      selector: (row) => row.ZoneCode,
      sortable: true,
      width: isSmallScreen ? "100px" : "100px",
    },
    {
      name: 'Officer 1',
      selector: (row) => {
        if ((row.Status === "AR" || row.Status === "AH") && row.IsSplited && row?.Officer1PARTime) {
          // const resourceTimer = timers[row.ResourceID];
          // const isNegative = resourceTimer?.startsWith("-");
          // const backgroundColor = isNegative
          //   ? "#FFD700"  // yellow for negative
          //   : "#00A86B"; // green for positive or undefined

          return (
            <>
              {/* <button
                className="btn btn-sm text-white p-1 py-0"
                style={{ background: "#00A86B", cursor: "pointer", display: 'flex', alignItems: 'center', gap: '5px', width: "100%", fontSize: "12px" }}
                onClick={() => {
                  handleEditOfficer1(row)
                }}
                data-toggle="modal"
                data-target="#PARTimerModal"
              >
                {row.Officer1}
                {row?.IsPauseOfficer1 ? <i className="fa fa-pause" style={{ fontSize: "16px" }} /> : <i className="fa fa-clock-o" style={{ fontSize: "16px" }} />}
                {
                  row?.IsPauseOfficer1 ?
                    row.Officer1CurrentTimer :
                    <TimerComponent
                      row={row}
                      onTimerUpdate={handleTimerUpdate}
                      type={"Officer1"}
                    />
                }
              </button> */}
              <TimerComponent
                row={row}
                onTimerUpdate={handleTimerUpdate}
                type={"Officer1"}
              />
            </>
          );
        } else {
          return (
            <>
              {row.Officer1}
            </>
          );
        }
      },
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.Officer1, rowB.Officer1),
      width: isSmallScreen ? "110px" : "110px",
    },
    {
      name: 'Officer 2',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.Officer2, rowB.Officer2),
      width: isSmallScreen ? "110px" : "110px",
      selector: (row) => {
        if ((row.Status === "AR" || row.Status === "AH") && row.IsSplited && row?.Officer2PARTime) {
          return (
            <>
              <TimerComponent
                row={row}
                onTimerUpdate={handleTimerUpdate}
                type={"Officer2"}
              />
            </>
          );
        } else {
          return (
            <>
              {row.Officer2}
            </>
          );
        }
      },
    },
  ];

  const ResourceStatusColumns = [
    {
      name: 'Unit Type',
      selector: (row) => row.ResourceTypeCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
      width: "20%",
    },
    {
      name: 'Unit #',
      selector: (row) => row.ResourceNumber,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceNumber, rowB.ResourceNumber),
      width: "20%",
    },
    {
      name: 'RMS Incident #',
      selector: (row) => row.IncidentNumber,
      sortable: true,
      width: "20%",
    },
    {
      name: 'Status',
      selector: (row) => {
        const colors = getStatusColors(row.Status); // Get colors based on Status
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                ...colors,
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                minWidth: '50px',
                textAlign: 'center'
              }}
            >
              {row.Status}
            </span>
            {row.Status !== "AV" && (
              <select
                onChange={(e) => { if (row.Status !== e.target.value) { handleStatusChange(row, e.target.value) } }}
                className="form-select status-dropdown"
                style={{
                  width: '20px',
                  padding: '2px',
                  fontSize: '16px',
                  marginLeft: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  appearance: 'auto'
                }}
              >
                {resourceStatusColorData.map((option, index) => (
                  <option key={index} value={option.ResourceStatusCode}>
                    {`${option.ResourceStatusCode} | ${option.Description}`}&nbsp;
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      },
      sortable: false,
      width: "20%",
    },
    {
      name: 'Status Date & Time',
      selector: (row) => (row.StatusDT ? getShowingYearMonthDate(row.StatusDT) : ""),
      sortable: true,
      width: "20%",
    },
  ];

  const MapResourceStatusColumns = [
    // {
    //   name: 'Resource Type',
    //   selector: (row) => row.ResourceTypeCode,
    //   sortable: true,
    //   sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
    //   width: "50%",
    // },
    {
      name: 'Unit #',
      selector: (row) => {
        const colors = getStatusColors(row.Status); // Get colors based on Status

        return (<>{row.ResourceNumber} {row.PrimaryResourceName ? <span
          style={{
            backgroundColor: "#3358ff", color: "#ffffff",
            padding: '4px 4px',
            borderRadius: '4px',
            display: 'inline-block',
            minWidth: '22px',
            textAlign: 'center'
          }}
        >
          P
        </span> : ""} </>)
      },
      width: "50%",
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceNumber, rowB.ResourceNumber),
    },
    {
      name: 'Status',
      selector: (row) => {
        const colors = getStatusColors(row.Status); // Get colors based on Status
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                ...colors,
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                minWidth: '50px',
                textAlign: 'center'
              }}
            >
              {row.Status}
            </span>
            {row.Status !== "AV" && (
              <select
                onChange={(e) => { if (row.Status !== e.target.value) { handleStatusChange(row, e.target.value) } }}
                className="form-select status-dropdown"
                style={{
                  width: '20px',
                  padding: '2px',
                  fontSize: '16px',
                  marginLeft: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  appearance: 'auto'
                }}
              >
                {resourceStatusColorData.map((option, index) => (
                  <option key={index} value={option.ResourceStatusCode}>
                    {`${option.ResourceStatusCode} | ${option.Description}`}&nbsp;
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      },
      sortable: false,
      width: "50%",
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1400);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onIncidentRowClick = (row) => {
    if (row?.ResourceID) {
      setEditValue(row);
      if (!isCADMap && !isResourceStatusTab) {
        navigate(`/cad/dashboard-page?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.CADIncidentNumber}&resourceID=${row?.ResourceID}&isResourceView=true&IncSta=true`);
      }
    } else {
      setEditValue(null);
      if (!isCADMap) {
        navigate(`/cad/dashboard-page`);
      }
    }
  };

  const sanitizeColumns1 = (columns) => {
    return columns?.map((col) => ({
      name: col.name.props?.header,
      selector: col.selector,
      sortable: col.sortable,
      width: col.width,
    }));
  };

  const restoreColumns = (savedColumns) => {
    //     // Input data
    let inputData = `${savedColumns}`;

    // Step 1: Parse JSON string into an array (if it's a string)
    if (typeof inputData === 'string') {
      try {
        inputData = JSON.parse(inputData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    // Step 2: Ensure inputData is an array
    if (!Array.isArray(inputData)) {
      console.error('Input data is not an array.');
    } else {
      // Step 3: Map over the array and process each column
      savedColumns = inputData.map((col) => {
        return {
          name: col?.name,
          width: col?.width || 'auto', // Default width if not provided
          sortable: col?.sortable || false // Default sortable to false
        };
      });

      // Step 4: Log the mapped array
    }
    if (!Array.isArray(savedColumns)) {
      console.error("savedColumns is not an array:", savedColumns);
      return []; // Return an empty array if savedColumns is invalid
    }

    return savedColumns.map((col) => {
      const matchingColumn = initialCols.find((initialCol) => {
        const colName =
          typeof initialCol.name === "string"
            ? initialCol.name
            : initialCol.name.props?.children;
        return colName === col.name;
      });

      return {
        ...col,
        name: matchingColumn?.name || col.name,
        selector: matchingColumn?.selector || col.selector,
        cell: matchingColumn?.cell || col.cell,
      };
    });
  };

  const getUserTableKey = `/CAD/UserTableColumns/GetData_UserTableResourse/${loginPinID}`;
  const { data: getDataUserTableResourse, isSuccess: isFetchUserTable } = useQuery(
    [getUserTableKey, {
      UserID: loginPinID,
      AgencyID: loginAgencyID,
    }],
    MonitorServices.getDataUserTableResourse,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginPinID && !!loginAgencyID,
    }
  );

  useEffect(() => {
    const tableCategory = isResourceStatusTab
      ? "ResourceStatusColumns"
      : isCADMap
        ? "MapResourceStatusColumns"
        : "initialCols";

    const selectedColumns = isResourceStatusTab
      ? ResourceStatusColumns
      : isCADMap
        ? MapResourceStatusColumns
        : initialCols;
    const lastCategory = localStorage.getItem("tableCategory_RT");
    const savedColumns = localStorage.getItem("tableColumns_RT");
    if (tableCategory !== lastCategory) {
      localStorage.setItem("tableColumns_RT", "");
      localStorage.setItem("tableCategory_RT", tableCategory);
      saveColumnsToLocalStorage(selectedColumns);
    }
    if (savedColumns && savedColumns !== "") {
      const restoredColumns = restoreColumns(JSON.parse(savedColumns), selectedColumns);
      setColumns(restoredColumns);
    } else {
      saveColumnsToLocalStorage(selectedColumns);
      setColumns(selectedColumns);
    }
  }, [isResourceStatusTab, isCADMap, offset]);

  useEffect(() => {
    const savedColumns = localStorage.getItem("tableColumns_RT");
    if (savedColumns && savedColumns !== "") {
      const restoredColumns = restoreColumns(JSON.parse(savedColumns), columns);
      setColumns(restoredColumns);
    }
  }, [resourceStatusColorData]);

  const sanitizeColumns = (columns) => {
    return columns.map((col) => ({
      name: typeof col.name === "string" ? col.name : col.name.props?.children || col.name,
      selector: col.selector,
      sortable: col.sortable,
      width: col.width,
    }));
  };

  useEffect(() => {
    if (getDataUserTableResourse && isFetchUserTable) {
      const descriptionData = JSON.parse(getDataUserTableResourse?.data?.data)
      setColumns(
        restoreColumns(descriptionData));
    } else {
      setColumns(initialCols);
    }
  }, [getDataUserTableResourse, isFetchUserTable]);

  const saveColumnsToLocalStorage = (columns) => {
    const sanitizedColumns = sanitizeColumns(columns);
    localStorage.setItem("tableColumns_RT", JSON.stringify(sanitizedColumns));
  };

  const columnElements = columns?.map((column, index) => ({
    ...column,
    name: (
      <div
        className={selectedColumnIndex === index ? "selected-column" : ""}
        draggable
        style={{
          cursor: "move",
          opacity: draggingColumnIndex === index ? 0.5 : 1,
        }}
      >
        {typeof column.name === "string" ? column.name : column.name.props?.children}
      </div>
    ),
  }))

  const handleColumnReorder = async (e) => {
    const test = columns?.map((column, index) => ({
      ...column,
      name: e.columns[index],
    }))
    const sanitizedColumns = sanitizeColumns1(test);
    const data = {
      Description: JSON.stringify(sanitizedColumns),
      UserID: loginPinID,
      AgencyID: loginAgencyID,
      CreatedByUserFK: loginPinID
    }
    const response = await MonitorServices.insertUserTableResourse(data);
  };

  const createdClasses = new Set();
  const createDynamicClass = (color) => {
    const className = `color-${color?.replace('#', '')}`;
    if (!createdClasses.has(className)) {
      const style = document.createElement('style');
      style.innerHTML = `
          .${className} {
              background-color: ${color} !important;
              color: black !important;
              padding: 5px 8px;
              font-size: 12px;
              border-radius: 4px;
              // box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          }
      `;
      document.head.appendChild(style);
      createdClasses.add(className);
    }
    return className;
  };

  const rowClassName = (data) => {
    const color = getStatusColors(data?.PriorityCode)?.backgroundColor;
    const dynamicClass = createDynamicClass(color);
    return dynamicClass;
  };

  const onRowsChange = (e) => {
    setRows(parseInt(e.target.value, 10));
    setFirst(0);
  };

  const paginatorTemplate = {
    layout: ' FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    RowsPerPageDropdown: () => (
      <div className="custom-rows-per-page">

        <select value={rows} onChange={onRowsChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    ),
    CurrentPageReport: (options) => (
      <span style={{ marginRight: '8px', fontSize: '13px' }}>
        Showing {options.first} to {options.last} of {options.totalRecords}
      </span>
    )
  };

  return (
    <>
      <div className='table-container CAD-table'>
        <div className="card">
          <DataTable
            value={resources}
            onColReorder={(e) => handleColumnReorder(e)}
            reorderableColumns
            size="small"
            selectionMode="single"
            selection={editValue}
            onSelectionChange={(e) => onIncidentRowClick(e?.value)}
            dataKey="ResourceID"
            sortMode="multiple"
            stripedRows
            columnResizeMode="expand"
            resizableColumns
            tableStyle={{ minWidth: '10rem' }}
            rowClassName={rowClassName}
            className="small-table" // Apply the custom class
            paginator
            rows={rows}
            first={first}
            onPage={(e) => setFirst(e.first)}
            paginatorTemplate={paginatorTemplate}
          // scrollable scrollHeight="400px" 
          >
            {columnElements.map((item) => {
              return <Column
                key={item?.name.props?.children}
                sortable={item?.sortable || false}
                field={item?.selector}
                header={item?.name.props?.children}
                style={{ width: '25%' }}
                headerClassName="cad-custom-header"
              />;
            })}
          </DataTable>
        </div>
      </div>
      {/* <PARTimerOverDueModal
        {...{
          PARTimerModal,
          setPARTimerModal,
          displayTimer,
          // incidentID,
          // incidentNumber,
          editValue,
          isResourcePAR,
          isOfficer1PAR,
          isOfficer2PAR,
          isNegative,
          resourceRefetch
        }}
      /> */}
      <PARTimerOverDueModal
        PARTimerModal={PARTimerModal}
        setPARTimerModal={setPARTimerModal}
        displayTimer={timers[editValue?.ResourceID] || '00:00'} // Pass the correct timer for the selected row
        editValue={editValue}
        isResourcePAR={isResourcePAR}
        isOfficer1PAR={isOfficer1PAR}
        isOfficer2PAR={isOfficer2PAR}
        resourceRefetch={resourceRefetch}
        setEditValue={setEditValue}
        setIsResourcePAR={setIsResourcePAR}
        setIsOfficer1PAR={setIsOfficer1PAR}
        setIsOfficer2PAR={setIsOfficer2PAR}
      />

    </>
  );
};

export default ResourcesTableSection;

// PropTypes definition
ResourcesTableSection.propTypes = {
  resources: PropTypes.array,
  isResourceStatusTab: PropTypes.bool,
  isCADMap: PropTypes.bool,
  isViewEventDetails: PropTypes.bool
};

// Default props
ResourcesTableSection.defaultProps = {
  resources: [],
  isResourceStatusTab: false,
  isCADMap: false,
  isViewEventDetails: false
};
