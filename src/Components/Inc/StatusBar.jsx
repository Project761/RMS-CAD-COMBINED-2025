import React, { useState, useEffect, useRef, forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faExclamation, faInfo, } from "@fortawesome/free-solid-svg-icons";

// ✅ forwardRef use correctly
const StatusBar = forwardRef((props, ref) => {

  const { loading, incidentErrorStatus, offenseCount, offenseErrorStatus, NameCount, nameErrorStatus, NameRelationshipError, narrativeApprovedStatus, PropertyCount, PropErrorStatus } = props;


  // console.log(PropertyCount)
  const statusData = [
    {
      label: "Incident",
      value: loading ? "Loading..." : incidentErrorStatus ? "Error" : "Completed",
      border: incidentErrorStatus ? "left-border-red" : "left-border-green",
      color: "text-grays",
      bg: incidentErrorStatus ? "bg-red" : "bg-green",
      icon: incidentErrorStatus ? faTimes : faCheck,
    },
    {
      label: "Offense",
      value: loading ? "Loading..." : offenseCount && !offenseErrorStatus ? "Added" : `${offenseCount} Added`,
      border: offenseCount && !offenseErrorStatus ? "left-border-green" : "left-border-red",
      color: "text-grays",
      bg: offenseCount && !offenseErrorStatus ? "bg-green" : "bg-red",
      icon: offenseCount && !offenseErrorStatus ? faCheck : faTimes,
    },
    {
      label: "Name",
      value: loading ? "Loading..." : NameCount && !nameErrorStatus ? "Added" : `${NameCount} Added`,
      border: NameCount && !nameErrorStatus ? "left-border-green" : "left-border-red",
      color: "text-grays",
      bg: NameCount && !nameErrorStatus ? "bg-green" : "bg-red",
      icon: NameCount && !nameErrorStatus ? faCheck : faTimes,
    },
    {
      label: "OV Links",
      value: loading ? "Loading..." : !NameRelationshipError ? "0/0 Linked" : "Linked",
      border: !NameRelationshipError ? "left-border-red" : "left-border-green",
      color: "text-grays",
      bg: !NameRelationshipError ? "bg-red" : "bg-green",
      icon: !NameRelationshipError ? faTimes : faCheck,
    },
    {
      label: "Narrative",
      value: loading ? "Loading..." : narrativeApprovedStatus ? "Approved" : "Not Approved",
      border: narrativeApprovedStatus ? "left-border-green" : "left-border-yellow",
      color: "text-grays",
      bg: narrativeApprovedStatus ? "bg-green" : "bg-yellow",
      icon: narrativeApprovedStatus ? faCheck : faExclamation,
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
      value: loading ? "Loading..." : typeof PropertyCount === "number" && !PropErrorStatus ? `${PropertyCount} Added` : "Error",
      border: typeof PropertyCount === "number" && !PropErrorStatus ? "left-border-green" : "left-border-red",
      bg: typeof PropertyCount === "number" && !PropErrorStatus ? "bg-green" : "bg-red",
      icon: typeof PropertyCount === "number" && !PropErrorStatus ? faCheck : faTimes,
    },

    {
      label: "TIBRS",
      value: "Pending",
      color: "text-grays",
      // icon: faInfo,
    },
  ];



  return (
    <div ref={ref} className="d-flex gap-3 mb-2 status-cards" style={{
      columnGap: "6px",
      position: "fixed",
      top: 0,
      // left: 0,
      right: 41,
      zIndex: 1050, // Bootstrap modals se bhi upar
      backgroundColor: "#fff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      // border: "1px solid #ccc",
      borderRadius: "6px",
      // width: "81.22%",
    }}>
      {statusData.map((item, index) => (
        <div
          key={index}
          className={`d-flex align-items-center justify-content-between  status-card ${item.border}`}
        >
          {/* Left side: label + value */}
          <div className="d-flex flex-column">
            <div className="status-label">{item.label}</div>
            <div className={`status-value ${item.color}`}>{item.value}</div>
          </div>

          {/* Right side: circular icon */}
          <div className={`status-icons ${item.bg}`}>
            <FontAwesomeIcon icon={item.icon} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default StatusBar;
