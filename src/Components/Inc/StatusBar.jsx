import React, { useState, useEffect, useRef, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faExclamation, faInfo, } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ forwardRef use correctly
const StatusBar = forwardRef((props, ref) => {

  const pathname = window.location.pathname;
  const navigate = useNavigate();

  const { loading, incidentErrorStatus, offenseCount, offenseErrorStatus, NameCount, nameErrorStatus, NameRelationshipError, narrativeApprovedStatus, PropertyCount, PropErrorStatus } = props;

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");


  const statusData = [
    {
      label: "Incident",
      value: loading ? "Loading..." : incidentErrorStatus ? "Error" : "Completed",
      border: incidentErrorStatus ? "left-border-red" : "left-border-green",
      color: "text-grays",
      bg: incidentErrorStatus ? "bg-red" : "bg-green",
      icon: incidentErrorStatus ? faTimes : faCheck,
      link: `/Inc-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`,
    },
    {
      label: "Offense",
      value: loading ? "Loading..." : offenseCount && !offenseErrorStatus ? `Added` : `${offenseCount} Added`,
      // value: loading ? "Loading..." : !offenseErrorStatus ? `${offenseCount} Added` : "0/1",
      border: offenseCount && !offenseErrorStatus ? "left-border-green" : "left-border-red",
      color: "text-grays",
      bg: offenseCount && !offenseErrorStatus ? "bg-green" : "bg-red",
      icon: offenseCount && !offenseErrorStatus ? faCheck : faTimes,
      link: `/Off-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`,
    },
    {
      label: "Name",
      value: loading ? "Loading..." : NameCount && !nameErrorStatus ? "Added" : `${NameCount} Added`,
      border: NameCount && !nameErrorStatus ? "left-border-green" : "left-border-red",
      color: "text-grays",
      bg: NameCount && !nameErrorStatus ? "bg-green" : "bg-red",
      icon: NameCount && !nameErrorStatus ? faCheck : faTimes,
      link: `/Name-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`,
    },
    {
      label: "OV Links",
      value: loading ? "Loading..." : !NameRelationshipError ? "0/0 Linked" : "Linked",
      border: !NameRelationshipError ? "left-border-red" : "left-border-green",
      color: "text-grays",
      bg: !NameRelationshipError ? "bg-red" : "bg-green",
      icon: !NameRelationshipError ? faTimes : faCheck,
      link: `/Offvic-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`,
    },
    {
      label: "Report",
      value: loading ? "Loading..." : narrativeApprovedStatus ? "Approved" : "Not Approved",
      border: narrativeApprovedStatus ? "left-border-green" : "left-border-yellow",
      color: "text-grays",
      bg: narrativeApprovedStatus ? "bg-green" : "bg-yellow",
      icon: narrativeApprovedStatus ? faCheck : faExclamation,
      link: `/Inc-Report?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`,
    },
    // {
    //   label: "Property",
    //   value: loading ? "Loading..." : PropertyCount && !PropErrorStatus ? "Added" : `${PropertyCount} Added`,
    //   border: PropertyCount && !PropErrorStatus ? "left-border-green" : "left-border-red",
    //   color: "text-grays",
    //   bg: PropertyCount && !PropErrorStatus ? "bg-green" : "bg-red",
    //   icon: PropertyCount && !PropErrorStatus ? faCheck : faTimes,
    // },
    {
      label: "Property",
      value: loading ? "Loading..." : typeof PropertyCount === "number" && !PropErrorStatus ? `${PropertyCount} Added` : `${PropertyCount} Added`,
      border: typeof PropertyCount === "number" && !PropErrorStatus ? "left-border-green" : "left-border-red",
      bg: typeof PropertyCount === "number" && !PropErrorStatus ? "bg-green" : "bg-red",
      icon: typeof PropertyCount === "number" && !PropErrorStatus ? faCheck : faTimes,
      link: `/Prop-Home?IncId=${IncID}&IncNo=${IncNo}&IncSta=${IncSta}`,
    },
    {
      label: "TIBRS",
      value: "Pending",
      color: "text-grays",
      // icon: faInfo,
    },
  ];

  const getFilteredStatusData = (pathname) => {
    switch (pathname) {
      case "/Off-Home":
        return statusData.filter(item => item.label === "Offense");
      case "/Name-Home":
      case "/Offvic-Home":
        return statusData.filter(item => item.label === "Name" || item.label === "OV Links");
      case "/Prop-Home":
      case "/Vehicle-Home":
        return statusData.filter(item => item.label === "Property");
      case "/Inc-Report":
        return statusData.filter(item => item.label === "Report");
      case "/Arrest-Home":
      case "/Document-Home":
      case "/NIBRSAudit-Home":
      case "/CloseHistory-Home":
      case "/NLETShistory-Home":
        return []
      default:
        return statusData;
    }
  };


  return (
    <div ref={ref} className="d-flex flex-column gap-3 mb-2" style={{
      rowGap: "6px",
      // position: "fixed",
      // top: 50,
      // left: 0,
      // right: 41,
      // zIndex: 1050,   
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      // border: "1px solid #ccc",
      borderRadius: "6px",
      // width: "81.22%",
    }}>
      {getFilteredStatusData(pathname).map((item, index) => (
        <div
          key={index}
          className={`d-flex flex-column status-card ${item.border}`}
          onClick={() => {
            if (pathname === item.link?.split("?")[0] || item.label === "TIBRS") {
              return;
            } else {
              navigate(item.link)
            }
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <div className="d-flex align-items-center justify-content-between ">
            {/* Left side */}
            <div className="d-flex flex-column">
              <div className="status-label">{item.label}</div>
              <div className={`status-value ${item.color}`}>{item.value}</div>
            </div>

            {/* Right side */}
            <div className={`status-icons ${item.bg}`}>
              <FontAwesomeIcon icon={item.icon} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default StatusBar;




































































// import React, { useState, useEffect, useRef, forwardRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCheck, faTimes, faExclamation, faInfo, } from "@fortawesome/free-solid-svg-icons";

// // ✅ forwardRef use correctly
// const StatusBar = forwardRef((props, ref) => {

//   const { loading, incidentErrorStatus, offenseCount, offenseErrorStatus, NameCount, nameErrorStatus, NameRelationshipError, narrativeApprovedStatus, PropertyCount, PropErrorStatus } = props;


//   // console.log(PropertyCount)
//   const statusData = [
//     {
//       label: "Incident",
//       value: loading ? "Loading..." : incidentErrorStatus ? "Error" : "Completed",
//       border: incidentErrorStatus ? "left-border-red" : "left-border-green",
//       color: "text-grays",
//       bg: incidentErrorStatus ? "bg-red" : "bg-green",
//       icon: incidentErrorStatus ? faTimes : faCheck,
//     },
//     {
//       label: "Offense",
//       value: loading ? "Loading..." : offenseCount && !offenseErrorStatus ? "Added" : `${offenseCount} Added`,
//       border: offenseCount && !offenseErrorStatus ? "left-border-green" : "left-border-red",
//       color: "text-grays",
//       bg: offenseCount && !offenseErrorStatus ? "bg-green" : "bg-red",
//       icon: offenseCount && !offenseErrorStatus ? faCheck : faTimes,
//     },
//     {
//       label: "Name",
//       value: loading ? "Loading..." : NameCount && !nameErrorStatus ? "Added" : `${NameCount} Added`,
//       border: NameCount && !nameErrorStatus ? "left-border-green" : "left-border-red",
//       color: "text-grays",
//       bg: NameCount && !nameErrorStatus ? "bg-green" : "bg-red",
//       icon: NameCount && !nameErrorStatus ? faCheck : faTimes,
//     },
//     {
//       label: "OV Links",
//       value: loading ? "Loading..." : !NameRelationshipError ? "0/0 Linked" : "Linked",
//       border: !NameRelationshipError ? "left-border-red" : "left-border-green",
//       color: "text-grays",
//       bg: !NameRelationshipError ? "bg-red" : "bg-green",
//       icon: !NameRelationshipError ? faTimes : faCheck,
//     },
//     {
//       label: "Narrative",
//       value: loading ? "Loading..." : narrativeApprovedStatus ? "Approved" : "Not Approved",
//       border: narrativeApprovedStatus ? "left-border-green" : "left-border-yellow",
//       color: "text-grays",
//       bg: narrativeApprovedStatus ? "bg-green" : "bg-yellow",
//       icon: narrativeApprovedStatus ? faCheck : faExclamation,
//     },
//     // {
//     //   label: "Property",
//     //   value: loading ? "Loading..." : PropertyCount && !PropErrorStatus ? "Added" : `${PropertyCount} Added`,
//     //   border: PropertyCount && !PropErrorStatus ? "left-border-green" : "left-border-red",
//     //   color: "text-grays",
//     //   bg: PropertyCount && !PropErrorStatus ? "bg-green" : "bg-red",
//     //   icon: PropertyCount && !PropErrorStatus ? faCheck : faTimes,
//     // },
//     {
//       label: "Property",
//       value: loading ? "Loading..." : typeof PropertyCount === "number" && !PropErrorStatus ? `${PropertyCount} Added` : `${PropertyCount} Added`,
//       border: typeof PropertyCount === "number" && !PropErrorStatus ? "left-border-green" : "left-border-red",
//       bg: typeof PropertyCount === "number" && !PropErrorStatus ? "bg-green" : "bg-red",
//       icon: typeof PropertyCount === "number" && !PropErrorStatus ? faCheck : faTimes,
//     },
//     {
//       label: "TIBRS",
//       value: "Pending",
//       color: "text-grays",
//       // icon: faInfo,
//     },
//   ];



//   return (
//     <div ref={ref} className="d-flex gap-3 mb-2 status-cards" style={{
//       columnGap: "6px",
//       position: "fixed",
//       top: 0,
//       // left: 0,
//       right: 41,
//       zIndex: 1050, // Bootstrap modals se bhi upar
//       backgroundColor: "#fff",
//       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//       // border: "1px solid #ccc",
//       borderRadius: "6px",
//       // width: "81.22%",
//     }}>
//       {statusData.map((item, index) => (
//         <div
//           key={index}
//           className={`d-flex align-items-center justify-content-between  status-card ${item.border}`}
//         >
//           {/* Left side: label + value */}
//           <div className="d-flex flex-column">
//             <div className="status-label">{item.label}</div>
//             <div className={`status-value ${item.color}`}>{item.value}</div>
//           </div>

//           {/* Right side: circular icon */}
//           <div className={`status-icons ${item.bg}`}>
//             <FontAwesomeIcon icon={item.icon} />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// });

// export default StatusBar;
