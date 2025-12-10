import React, { useEffect, useState } from "react"
import Select from "react-select";
import { coloredStyle_Select, colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import DataTable from "react-data-table-component";
import { getShowingDateText, tableCustomStyles } from "../../Components/Common/Utility";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import { get_AgencyOfficer_Data } from "../../redux/actions/IncidentAction";
import CaseManagementServices from "../../CADServices/APIs/caseManagement";
import { toastifyError, toastifySuccess } from "../../Components/Common/AlertMsg";
import { useQuery } from "react-query";
import useObjState from "../../CADHook/useObjState";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";

function CaseTeam({ CaseId }) {
  const dispatch = useDispatch();
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [assignedDateTime, setAssignedDateTime] = useState(null)
  const [removedDateTime, setRemovedDateTime] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalInvestigator, setModalInvestigator] = useState(null)
  const [modalIsPrimaryOfficer, setModalIsPrimaryOfficer] = useState(false)
  const [modalDateTime, setModalDateTime] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editRowData, setEditRowData] = useState(null)
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const [replacePrimaryInvestigator, setReplacePrimaryInvestigator] = useState(null)
  const [replaceDateTime, setReplaceDateTime] = useState(null)
  const [loginPinID, setLoginPinID] = useState(null)
  const [caseTeamData, setCaseTeamData] = useState([])
  const [caseTeamOfficerCountData, setCaseTeamOfficerCountData] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteRowData, setDeleteRowData] = useState(null)
  const [showOfficerSummaryModal, setShowOfficerSummaryModal] = useState(false)
  const [officerSummaryData, setOfficerSummaryData] = useState([])
  const [officerName, setOfficerName] = useState("")
  const [investigator, setInvestigator] = useState(null)
  const [primeInvestigator, setPrimeInvestigator] = useState(null)
  console.log("caseTeamData", caseTeamData)
  const [
    errorCaseTeamState,
    ,
    handleErrorCaseTeamState,
    clearErrorCaseTeamState, ,
  ] = useObjState({
    modalInvestigator: false,
    modalDateTime: false,
  });

  const [
    errorReplaceState,
    ,
    handleErrorReplaceState,
    clearErrorReplaceState, ,
  ] = useObjState({
    replaceDateTime: false,
    replacePrimaryInvestigator: false,
  });

  useEffect(() => {
    dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID));
    setLoginPinID(localStoreData?.PINID);
  }, [localStoreData])

  const getAllCaseTeamKey = `/CaseManagement/GetAllCaseTeam/${localStoreData?.AgencyID}/${CaseId}`;
  const { data: getAllCaseTeamData, isSuccess: isGetAllCaseTeamDataSuccess, refetch: refetchAllCaseTeamData } = useQuery(
    [getAllCaseTeamKey, {
      "AgencyID": localStoreData?.AgencyID,
      "CaseID": parseInt(CaseId),
      "PrimeInvestigator": primeInvestigator?.value,
      "Investigator": investigator?.value,
      "AssignedDateTime": assignedDateTime,
      "RemovedDateTime": removedDateTime,
    },],
    CaseManagementServices.getAllCaseTeam,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!CaseId
    }
  );

  useEffect(() => {
    if (getAllCaseTeamData && isGetAllCaseTeamDataSuccess) {
      const data = JSON.parse(getAllCaseTeamData?.data?.data)?.Table
      const data1 = JSON.parse(getAllCaseTeamData?.data?.data)?.Table1
      setCaseTeamData(data)
      setCaseTeamOfficerCountData(data1)
    } else {
      setCaseTeamData([])
      setCaseTeamOfficerCountData([])
    }
  }, [getAllCaseTeamData, isGetAllCaseTeamDataSuccess])

  const handleCloseModal = () => {
    setShowModal(false)
    setModalInvestigator(null)
    setModalDateTime(null)
    setModalIsPrimaryOfficer(false)
  }

  const handleNew = () => {
    setModalInvestigator(null)
    setModalIsPrimaryOfficer(false)
    setModalDateTime(new Date())
  }

  const validation = () => {
    let isError = false;
    const keys = Object.keys(errorCaseTeamState);
    keys.forEach((field) => {
      if (field === "modalInvestigator" && isEmptyObject(modalInvestigator)) {
        handleErrorCaseTeamState(field, true);
        isError = true;
      } else if (field === "modalDateTime" && !modalDateTime) {
        handleErrorCaseTeamState(field, true);
        isError = true;
      } else {
        handleErrorCaseTeamState(field, false);
      }
    });
    return !isError;
  };

  const handleSave = async () => {
    if (!validation()) return;
    if (CaseId) {
      if (modalIsPrimaryOfficer) {
        const res = await CaseManagementServices.updateCaseTeam({
          "DateAssigned": modalDateTime,
          "CreatedByUserFK": parseInt(loginPinID),
          "CaseID": parseInt(CaseId),
          "NewPrimaryOfficerID": modalInvestigator?.value
        })
        if (res?.status === 200) {
          toastifySuccess("Data Saved Successfully")
          refetchAllCaseTeamData()
        }
      } else {
        const res = await CaseManagementServices.addCaseTeam({
          "CreatedByUserFK": loginPinID,
          "CaseID": parseInt(CaseId),
          "PrimaryOfficerID": modalInvestigator?.value,
          "IsPrimaryOfficer": "false"
        })
        if (res?.status === 200) {
          toastifySuccess("Data Saved Successfully")
          refetchAllCaseTeamData()
        }
      }
      handleCloseModal()
    }
  }

  // Edit modal handlers
  const handleOpenEditModal = (rowData) => {
    setEditRowData(rowData)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditRowData(null)
  }

  const handleReplacePrimaryOfficer = () => {
    // Open the replace modal instead of closing
    setReplaceDateTime(new Date())
    setShowReplaceModal(true)
  }

  // Replace modal handlers
  const handleCloseReplaceModal = () => {
    setShowReplaceModal(false)
    setReplacePrimaryInvestigator(null)
    setReplaceDateTime(null)
    clearErrorReplaceState()
  }

  const handleReplaceClear = () => {
    setReplacePrimaryInvestigator(null)
    setReplaceDateTime(new Date())
    clearErrorReplaceState()
  }

  const replaceValidation = () => {
    let isError = false;
    const keys = Object.keys(errorReplaceState);
    keys.forEach((field) => {
      if (field === "replaceDateTime" && !replaceDateTime) {
        handleErrorReplaceState(field, true);
        isError = true;
      } else if (field === "replacePrimaryInvestigator" && isEmptyObject(replacePrimaryInvestigator)) {
        handleErrorReplaceState(field, true);
        isError = true;
      } else if (field === "replaceDateTime" || field === "replacePrimaryInvestigator") {
        handleErrorReplaceState(field, false);
      }
    });
    return !isError;
  };

  const handleReplaceSave = async () => {
    if (!replaceValidation()) return;
    const res = await CaseManagementServices.updateCaseTeam({
      "PrimaryOfficerID": editRowData?.PrimaryOfficerID,
      "DateAssigned": replaceDateTime,
      "CreatedByUserFK": parseInt(loginPinID),
      "CaseID": parseInt(CaseId),
      "NewPrimaryOfficerID": replacePrimaryInvestigator?.value
    })
    if (res?.status === 200) {
      toastifySuccess("Data Updated Successfully")
      refetchAllCaseTeamData()
      handleCloseReplaceModal()
      handleCloseEditModal()
    }
  }

  const columns = [
    {
      name: "Primary",
      selector: (row) => row.IsPrimaryOfficer,
      cell: (row) => (
        <span
          style={{
            color: row.IsPrimaryOfficer ? "#198754" : "#6c757d",
            fontWeight: "500",
          }}
        >
          {row.IsPrimaryOfficer ? "Yes" : "No"}
        </span>
      ),
      sortable: true,
      width: "90px",
    },
    {
      name: "Case Team Member",
      selector: (row) => row.OfficerName,
      cell: (row) => (
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          <button
            type="button"
            style={{
              color: "#0d6efd",
              fontWeight: "500",
              textDecoration: "underline",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: "0",
            }}
            onClick={() => handleGetOfficerActivityByID(row.PrimaryOfficerID, row.OfficerName)}
          >
            {row.OfficerName}
          </button>
          {caseTeamOfficerCountData.find(item => item.PrimaryOfficerID === row.PrimaryOfficerID)?.officers > 0 && (
            <span
              className="rounded-pill text-white"
              style={{
                backgroundColor: "#dc3545",
                fontSize: "11px",
                fontWeight: "600",
                padding: "2px 6px",
                lineHeight: "1",
              }}
            >
              {caseTeamOfficerCountData.find(item => item.PrimaryOfficerID === row.PrimaryOfficerID)?.officers}
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Assigned Date/Time",
      selector: (row) => row.DateAssigned ? getShowingDateText(row.DateAssigned) : "",
      sortable: true,
    },
    {
      name: "Removed Date/Time",
      selector: (row) => row.RemovedDateTime ? getShowingDateText(row.RemovedDateTime) : "",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.NIBRSStatus,
      sortable: true,
      width: "180px",
    },
    {
      name: "Action",
      selector: (row) => row.Action,
      cell: (row) => (
        <div className="d-flex align-items-center" style={{ gap: "10px" }}>
          {!row.RemovedDateTime && !row.IsPrimaryOfficer && (
            <div
              style={{
                color: "#dc3545",
                cursor: "pointer",
                fontSize: "15px",
              }}
              onClick={() => {
                setDeleteRowData(row)
                setShowDeleteModal(true)
              }}
            ><i className="fa fa-trash fa-lg"></i></div>
          )}
        </div>
      ),
      width: "100px",
      center: true,
    },
  ];

  async function handleGetOfficerActivityByID(officerID, officerName) {
    const res = await CaseManagementServices.getOfficerActivityByID({
      "PrimaryOfficerID": officerID,
      "AgencyID": localStoreData?.AgencyID
    })
    const data = JSON.parse(res?.data?.data)?.Table
    if (data?.length > 0) {
      setOfficerSummaryData(data)
      setOfficerName(officerName)
      setShowOfficerSummaryModal(true)
    } else {
      toastifyError("No data found")
    }
  }

  const handleCloseOfficerSummaryModal = () => {
    setShowOfficerSummaryModal(false)
    setOfficerSummaryData([])
    setOfficerName("")
  }

  const officerSummaryColumns = [
    {
      name: "RMS Case #",
      selector: (row) => row.RMSCaseNumber || row.CaseNumber || '-',
      sortable: true,
    },
    {
      name: "Offense",
      selector: (row) => row.OffenseName_Description || row.OffenseName_Description || '-',
      cell: (row) => {
        const offenseText = row.OffenseName_Description || row.OffenseName_Description || '-';
        return (
          <span title={offenseText}>
            {offenseText.length > 30 ? offenseText.substring(0, 30) + '...' : offenseText}
          </span>
        );
      },
      sortable: true,
    },
    {
      name: "Date Assigned",
      selector: (row) => row.DateAssigned ? getShowingDateText(row.DateAssigned) : '-',
      sortable: true,
    },
    {
      name: "Primary Investigator",
      selector: (row) => row.IsPrimaryOfficer ? 'Yes' : 'No',
      sortable: true,
    },
    {
      name: "Case Status",
      selector: (row) => row.CaseStatus || row.NIBRSStatus || '-',
      cell: (row) => {
        const status = row.CaseStatus || row.NIBRSStatus || '-';
        const statusColor =
          (status === "Closed" || status === "Close")
            ? "#dc3545"
            : (status === "Open")
              ? "#198754"
              : (status === "Hold")
                ? "#ffc107"
                : (status === "Reopen")
                  ? "#007bff"
                  : "#6c757d";
        return (
          <span style={{ color: statusColor, fontWeight: "500" }}>
            {status}
          </span>
        );
      },
      sortable: true,
    },
  ];

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setDeleteRowData(null)
  }

  async function handleDelete() {
    if (deleteRowData) {
      const res = await CaseManagementServices.deleteCaseTeam({
        "CaseTeamID": deleteRowData.CaseTeamID,
        "CreatedByUserFK": parseInt(loginPinID),
      })
      if (res?.status === 200) {
        toastifySuccess("Data Deleted Successfully")
        refetchAllCaseTeamData()
        handleCloseDeleteModal()
      }
    }
  }

  // Helper functions for UI
  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };



  const getCaseloadStatus = (active, max) => {
    const percentage = (active / max) * 100;
    if (percentage >= 90) return { status: 'Overloaded', color: '#dc3545', text: 'Caseload : Overloaded' };
    if (percentage >= 70) return { status: 'Moderate Load', color: '#ff9800', text: 'Caseload :Moderate Load' };
    return { status: 'Safe', color: '#28a745', text: 'Caseload: Safe' };
  };



  // Group team members
  const primaryMembers = caseTeamData.filter(member => member.IsPrimaryOfficer && !member.RemovedDateTime);
  const supportMembers = caseTeamData.filter(member => !member.IsPrimaryOfficer);

  // Calculate team intelligence metrics
  const totalInvestigators = caseTeamData.filter(m => !m.RemovedDateTime).length;
  const pendingTasks = 4; // This would come from API


  // Render team member card
  const TeamMemberCard = ({ member, index }) => {
    const officerCount = caseTeamOfficerCountData.find(item => item.PrimaryOfficerID === member.PrimaryOfficerID)?.officers || 0;

    const maxCaseload = 20;
    const caseloadStatus = getCaseloadStatus(officerCount, maxCaseload);
    const initials = getInitials(member.OfficerName);
    // const avatarColor = getAvatarColor(member.OfficerName);

    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        marginBottom: '6px',
        display: 'flex',
        overflow: 'hidden'
      }} >
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div className="d-flex align-items-center" style={{ gap: '15px', flex: 1 }}>
              {/* Avatar with ring */}
              <div style={{ position: 'relative' }}>
                {member.Path ?
                  <>
                    <img src={member.Path} alt="Officer" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #6c757d' }} /> {officerCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#007bff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          border: '2px solid white'
                        }}
                      >
                        {officerCount}
                      </div>
                    )}
                  </>

                  :

                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      // backgroundColor: avatarColor,
                      backgroundColor: '#007bff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      // border: `3px solid ${ringColor}`,
                      position: 'relative'
                    }}
                  >
                    {initials}
                    {officerCount > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#007bff',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          border: '2px solid white'
                        }}
                      >
                        {officerCount}
                      </div>
                    )}
                  </div>}
              </div>

              {/* Member Details */}
              <div style={{ flex: 1 }}>
                <div className="d-flex align-items-center mb-1" style={{ gap: '8px' }}>
                  <span className="fw-bold" style={{
                    cursor: 'pointer', fontWeight: "500",
                    textDecoration: "underline", color: "#0d6efd"
                  }} onClick={() => handleGetOfficerActivityByID(member.PrimaryOfficerID, member.OfficerName)}>{member.OfficerName}</span>
                 {member.IsPrimaryOfficer && <span style={{ color: '#ffd700', fontSize: '16px' }}>👑</span>}
                  {/* </div> */}
                </div>
                <div className="mb-2 d-flex">
                  <span style={{ fontSize: '13px', color: '#6c757d', marginRight: '40px' }}> {member.DateAssigned && 'Assigned Date/Time: ' + (member.DateAssigned ? getShowingDateText(member.DateAssigned) : '-')}</span>
                  <span style={{ fontSize: '13px', color: '#6c757d', marginRight: '40px' }}> {member.RemovedDateTime && 'Removed Date/Time: ' + (member.RemovedDateTime ? getShowingDateText(member.RemovedDateTime) : '-')}</span>
                </div>
                <div>
                  <div className="d-flex align-items-center mb-1" style={{ gap: '8px' }}>
                    <span style={{ fontSize: '13px', color: caseloadStatus.color, fontWeight: '500' }}>
                      {caseloadStatus.text}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min((officerCount / maxCaseload) * 100, 100)}%`,
                        height: '100%',
                        backgroundColor: caseloadStatus.color,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                  <div className="mt-1" style={{ fontSize: '12px', color: '#6c757d' }}>
                    {officerCount} / {maxCaseload} Active
                  </div>
                </div>
              </div>
            </div>

            {/* Action Icons */}
            <div className="d-flex align-items-center" style={{ gap: '10px' }}>
              {!member.RemovedDateTime && !member.IsPrimaryOfficer && (
                <button
                  className="btn btn-sm btn-link p-0"
                  style={{ color: '#dc3545' }}
                  onClick={() => {
                    setDeleteRowData(member);
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="fa fa-trash fa-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="col-12 col-md-12 col-lg-12 mt-2">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center" style={{ gap: '10px' }}>
            <i className="fa fa-users fa-lg" style={{ color: '#007bff' }}></i>
            <h5 className="mb-0 fw-bold">Case Team Assignment</h5>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setModalDateTime(new Date());
              setShowModal(true);
            }}
          >
            <i className="fa fa-plus me-1"></i> Add Case Team
          </button>
        </div>
        <fieldset className=''>
          <legend>Filters</legend>

        </fieldset>

        <div className="row mb-3">
          <div className="col-md-3">
            <Select
              isClearable
              options={agencyOfficerDrpData}
              placeholder="Filter Case Team Member"
              styles={colorLessStyle_Select}
              value={investigator}
              onChange={(e) => setInvestigator(e)}
            />
          </div>
          <div className="col-md-3">
            <Select
              isClearable
              options={agencyOfficerDrpData}
              placeholder="Filter By Prime Investigator"
              styles={colorLessStyle_Select}
              value={primeInvestigator}
              onChange={(e) => setPrimeInvestigator(e)}
            />
          </div>
          <div className="col-md-3">
            <DatePicker
              selected={assignedDateTime}
              onChange={(date) => setAssignedDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MM/dd/yyyy HH:mm"
              placeholderText="Filter By Assigned Date/Time"
              className="form-control"
              isClearable
            />
          </div>
          <div className="col-md-3">
            <DatePicker
              selected={removedDateTime}
              onChange={(date) => setRemovedDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MM/dd/yyyy HH:mm"
              placeholderText="Filter By Removed Date/Time"
              className="form-control"
              isClearable
            />
          </div>
        </div>
      </div>
      <div className="col-12 col-md-12 col-lg-12 mt-2">
        <div className="row">
          {/* Left Panel - Case Team Assignment */}
          <div className="col-md-9">
            <div className="card-body" style={{ padding: '0px' }}>
              {/* PRIMARY COMMAND Section */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3" style={{ gap: '10px' }}>
                  <h6 className="mb-0 fw-bold">Primary Command</h6>
                </div>
                {primaryMembers.length > 0 ? (
                  primaryMembers.map((member, index) => (
                    <TeamMemberCard key={member.PrimaryOfficerID || index} member={member} index={index} />
                  ))
                ) : (
                  <div className="text-muted text-center py-3">No primary command members</div>
                )}
              </div>

              {/* SUPPORT & FORENSICS Section */}
              <div>
                <div className="d-flex align-items-center mb-3" style={{ gap: '10px' }}>
                  <h6 className="mb-0 fw-bold">Support & Forensics</h6>
                </div>
                {supportMembers.length > 0 ? (
                  supportMembers.map((member, index) => (
                    <TeamMemberCard key={member.PrimaryOfficerID || index} member={member} index={index} />
                  ))
                ) : (
                  <div className="text-muted text-center py-3">No support & forensics members</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panels */}
          <div className="col-md-3">
            {/* Team Intelligence Panel */}
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '6px',
              display: 'flex',
              overflow: 'hidden',
            }}>
              <div className="card-body">
                <p className="mb-2 border-bottom pb-1" style={{ fontWeight: '600', fontSize: '18px' }}>Team Intelligence</p>

                <div className="mb-2 d-flex justify-content-between">
                  <span style={{ color: '#6c757d', fontWeight: '500' }}>Total Investigators:</span> <span style={{ color: '#007bff' }}>{totalInvestigators}</span>
                </div>
                <div className="mb-2 d-flex justify-content-between">
                  <span style={{ color: '#6c757d', fontWeight: '500' }}>Pending Tasks:</span> <span style={{ color: '#007bff' }}>{pendingTasks} Open</span>
                </div>
                <div className="mb-3 d-flex justify-content-between">
                  <span style={{ color: '#6c757d', fontWeight: '500' }}>Open Case Report:</span> <span style={{ color: '#007bff' }}>10</span>
                </div>

              </div>
            </div>

            {/* Task Bottlenecks Panel */}
            <div style={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '6px',
              display: 'flex',
              overflow: 'hidden',

            }}>
              <div className="card-body">
                <p className="mb-3 border-bottom pb-2" style={{ fontWeight: '600', fontSize: '18px' }}>Task Bottlenecks</p>
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <div className="d-flex align-items-center" style={{ gap: '12px', flex: 1 }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '40px', height: '40px', backgroundColor: '#343a40', fontSize: '11px' }}>
                      AA
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="text-dark" style={{ fontSize: '14px', fontWeight: 400 }}>
                        {'Review BodyCam'}
                      </div>
                      <span className="badge bg-success text-white" style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px' }}>
                        Deu Yesterday
                      </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mb-1 ">
                  <div className="d-flex align-items-center" style={{ gap: '12px', flex: 1 }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '40px', height: '40px', backgroundColor: '#343a40', fontSize: '11px' }}>
                      BB
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="text-dark" style={{ fontSize: '14px', fontWeight: 400 }}>
                        {'Upload Forensic '}
                      </div>
                      <span className="badge bg-success text-white" style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px' }}>
                        Deu Today 5PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Investigator Modal */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Case Team Member</h5>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                      <label className="form-label">Investigator {errorCaseTeamState.modalInvestigator && !modalInvestigator ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                      <Select
                        isClearable
                        options={agencyOfficerDrpData}
                        placeholder="Select"
                        styles={coloredStyle_Select}
                        value={modalInvestigator}
                        onChange={(e) => setModalInvestigator(e)}
                      />
                    </div>
                    <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                      <label className="form-label">Date/Time {errorCaseTeamState.modalDateTime && !modalDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                      <DatePicker
                        selected={modalDateTime}
                        onChange={(date) => setModalDateTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/dd/yyyy HH:mm"
                        placeholderText="Select"
                        className="form-control requiredColor"
                        isClearable
                      />
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 offset-1">
                      <input type="checkbox" name="AddPrimaryOfficer" value={modalIsPrimaryOfficer}
                        checked={modalIsPrimaryOfficer}
                        onChange={() => { setModalIsPrimaryOfficer(!modalIsPrimaryOfficer) }}
                        id="AddPrimaryOfficer"
                      />
                      <label className='ml-2' htmlFor="AddPrimaryOfficer">Add Primary Officer</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-success"
                    onClick={() => handleCloseModal()}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleNew()}
                  >
                    Clear
                  </button>
                  <button className="btn btn-success" onClick={() => handleSave()}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Investigator Information Modal */}
        {showEditModal && editRowData && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Investigator Information</h5>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                      <label className="form-label">Investigator</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editRowData.OfficerName}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                    <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                      <label className="form-label">Date/Time</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editRowData?.DateAssigned ? getShowingDateText(editRowData.DateAssigned) : ''}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-success "
                    onClick={() => handleCloseEditModal()}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-success "
                    onClick={() => handleReplacePrimaryOfficer()}
                  >
                    Replace Primary Officer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Replace Primary Investigator Modal */}
        {showReplaceModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Replace Primary Investigator</h5>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                      <label className="form-label">Investigator</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editRowData?.OfficerName || ''}
                        readOnly
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </div>
                    <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                      <label className="form-label">Date/Time {errorReplaceState.replaceDateTime && !replaceDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                      <DatePicker
                        selected={replaceDateTime}
                        onChange={(date) => {
                          setReplaceDateTime(date)
                          if (date) {
                            handleErrorReplaceState("replaceDateTime", false)
                          }
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MM/dd/yyyy HH:mm"
                        placeholderText="Select"
                        className="form-control requiredColor"
                        isClearable
                      />
                    </div>

                  </div>
                  <div className="row">
                    <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                      <label className="form-label"><div className="text-nowrap">Primary Investigator </div>{errorReplaceState.replacePrimaryInvestigator && isEmptyObject(replacePrimaryInvestigator) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                      <Select
                        isClearable
                        options={agencyOfficerDrpData}
                        placeholder="Select"
                        styles={coloredStyle_Select}
                        value={replacePrimaryInvestigator}
                        onChange={(e) => {
                          setReplacePrimaryInvestigator(e)
                          if (e && !isEmptyObject(e)) {
                            handleErrorReplaceState("replacePrimaryInvestigator", false)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-success "
                    onClick={() => handleCloseReplaceModal()}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-success "
                    onClick={() => handleReplaceClear()}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-success "
                    onClick={() => handleReplaceSave()}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center py-5">
                  <h5 className="modal-title mt-2">Are you sure you want to delete this record?</h5>
                  <div className="btn-box mt-3">
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="btn btn-sm text-white"
                      style={{ background: "#ef233c" }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary ml-2"
                      onClick={handleCloseDeleteModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Officer Summary Modal */}
        {showOfficerSummaryModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '1000px' }}>
              <div className="modal-content">
                <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6' }}>
                  <h5 className="modal-title" style={{ fontWeight: 'bold' }}>Master Summary - {officerName}</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={handleCloseOfficerSummaryModal}
                    style={{ border: 'none', background: 'none', fontSize: '1.5rem', color: '#0d6efd' }}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <p style={{ margin: 0 }}>
                      Currently Active Caseload: <strong>{officerSummaryData.filter(item => item.CaseStatus === "Open" || item.NIBRSStatus === "Open").length} Active Cases</strong>
                    </p>
                  </div>
                  <div className="table-responsive">
                    <DataTable
                      dense
                      columns={officerSummaryColumns}
                      data={officerSummaryData}
                      customStyles={tableCustomStyles}
                      pagination
                      responsive
                      noDataComponent={'There are no data to display'}
                      striped
                      persistTableHead={true}
                      highlightOnHover
                      fixedHeader
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Investigator Modal */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Case Team Member</h5>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                    <label className="form-label">Investigator {errorCaseTeamState.modalInvestigator && !modalInvestigator ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                    <Select
                      isClearable
                      options={agencyOfficerDrpData}
                      placeholder="Select"
                      styles={coloredStyle_Select}
                      value={modalInvestigator}
                      onChange={(e) => setModalInvestigator(e)}
                    />
                  </div>
                  <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                    <label className="form-label">Date/Time {errorCaseTeamState.modalDateTime && !modalDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                    <DatePicker
                      selected={modalDateTime}
                      onChange={(date) => setModalDateTime(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MM/dd/yyyy HH:mm"
                      placeholderText="Select"
                      className="form-control requiredColor"
                      isClearable
                    />
                  </div>
                  <div className="col-4 col-md-4 col-lg-3 offset-1">
                    <input type="checkbox" name="AddPrimaryOfficer" value={modalIsPrimaryOfficer}
                      checked={modalIsPrimaryOfficer}
                      onChange={() => { setModalIsPrimaryOfficer(!modalIsPrimaryOfficer) }}
                      id="AddPrimaryOfficer"
                    />
                    <label className='ml-2' htmlFor="AddPrimaryOfficer">Add Primary Officer</label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => handleCloseModal()}
                >
                  Close
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleNew()}
                >
                  Clear
                </button>
                <button className="btn btn-success" onClick={() => handleSave()}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Investigator Information Modal */}
      {showEditModal && editRowData && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Investigator Information</h5>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                    <label className="form-label">Investigator</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editRowData.OfficerName}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                  <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                    <label className="form-label">Date/Time</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editRowData?.DateAssigned ? getShowingDateText(editRowData.DateAssigned) : ''}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success "
                  onClick={() => handleCloseEditModal()}
                >
                  Close
                </button>
                <button
                  className="btn btn-success "
                  onClick={() => handleReplacePrimaryOfficer()}
                >
                  Replace Primary Officer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Replace Primary Investigator Modal */}
      {showReplaceModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '800px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Replace Primary Investigator</h5>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                    <label className="form-label">Investigator</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editRowData?.OfficerName || ''}
                      readOnly
                      style={{ backgroundColor: '#f8f9fa' }}
                    />
                  </div>
                  <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                    <label className="form-label">Date/Time {errorReplaceState.replaceDateTime && !replaceDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                    <DatePicker
                      selected={replaceDateTime}
                      onChange={(date) => {
                        setReplaceDateTime(date)
                        if (date) {
                          handleErrorReplaceState("replaceDateTime", false)
                        }
                      }}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MM/dd/yyyy HH:mm"
                      placeholderText="Select"
                      className="form-control requiredColor"
                      isClearable
                    />
                  </div>

                </div>
                <div className="row">
                  <div className="d-flex align-items-center col-md-6 mb-3" style={{ gap: '10px' }}>
                    <label className="form-label"><div className="text-nowrap">Primary Investigator </div>{errorReplaceState.replacePrimaryInvestigator && isEmptyObject(replacePrimaryInvestigator) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                    <Select
                      isClearable
                      options={agencyOfficerDrpData}
                      placeholder="Select"
                      styles={coloredStyle_Select}
                      value={replacePrimaryInvestigator}
                      onChange={(e) => {
                        setReplacePrimaryInvestigator(e)
                        if (e && !isEmptyObject(e)) {
                          handleErrorReplaceState("replacePrimaryInvestigator", false)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success "
                  onClick={() => handleCloseReplaceModal()}
                >
                  Close
                </button>
                <button
                  className="btn btn-success "
                  onClick={() => handleReplaceClear()}
                >
                  Clear
                </button>
                <button
                  className="btn btn-success "
                  onClick={() => handleReplaceSave()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center py-5">
                <h5 className="modal-title mt-2">Are you sure you want to delete this record?</h5>
                <div className="btn-box mt-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn btn-sm text-white"
                    style={{ background: "#ef233c" }}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary ml-2"
                    onClick={handleCloseDeleteModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Officer Summary Modal */}
      {showOfficerSummaryModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '1000px' }}>
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: '1px solid #dee2e6' }}>
                <h5 className="modal-title" style={{ fontWeight: 'bold' }}>Master Summary - {officerName}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseOfficerSummaryModal}
                  style={{ border: 'none', background: 'none', fontSize: '1.5rem', color: '#0d6efd' }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p style={{ margin: 0 }}>
                    Currently Active Caseload: <strong>{officerSummaryData.filter(item => item.CaseStatus === "Open" || item.NIBRSStatus === "Open").length} Active Cases</strong>
                  </p>
                </div>
                <div className="table-responsive">
                  <DataTable
                    dense
                    columns={officerSummaryColumns}
                    data={officerSummaryData}
                    customStyles={tableCustomStyles}
                    pagination
                    responsive
                    noDataComponent={'There are no data to display'}
                    striped
                    persistTableHead={true}
                    highlightOnHover
                    fixedHeader
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  )
}

export default CaseTeam
