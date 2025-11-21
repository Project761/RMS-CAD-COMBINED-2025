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

  return (
    <>
      <div className="col-12 col-md-12 col-lg-12 mt-2">
        {/* Case Evidence Section */}
        {/* Evidence Filters */}
        <div className="row mb-3">
          <div className="col-md-3">
            <Select
              isClearable
              options={agencyOfficerDrpData}
              placeholder="Case Team Member"
              styles={colorLessStyle_Select}
              value={investigator}
              onChange={(e) => setInvestigator(e)}
            />
          </div>
          <div className="col-md-2">
            <Select
              isClearable
              options={agencyOfficerDrpData}
              placeholder="Prime Investigator"
              styles={colorLessStyle_Select}
              value={primeInvestigator}
              onChange={(e) => setPrimeInvestigator(e)}
            />
          </div>
          <div className="col-md-2">
            <DatePicker
              selected={assignedDateTime}
              onChange={(date) => setAssignedDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MM/dd/yyyy HH:mm"
              placeholderText="Assigned Date/Time"
              className="form-control"
              isClearable
            />
          </div>
          <div className="col-md-2">
            <DatePicker
              selected={removedDateTime}
              onChange={(date) => setRemovedDateTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MM/dd/yyyy HH:mm"
              placeholderText="Removed Date/Time"
              className="form-control"
              isClearable
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary" onClick={() => {
              setModalDateTime(new Date())
              setShowModal(true)
            }}>Add Case Team Member</button>
          </div>
        </div>

        {/* Evidence Table */}
        <div className="table-responsive">
          <DataTable
            dense
            columns={columns}
            data={caseTeamData}
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
                    <div className="col-4 col-md-4 col-lg-3 mt-1 offset-1">
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
                    className="cancel-button"
                    onClick={() => handleCloseModal()}
                  >
                    Close
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => handleNew()}
                  >
                    Clear
                  </button>
                  <button className="btn btn-success px-4 py-2" onClick={() => handleSave()}>
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
                    className="cancel-button"
                    onClick={() => handleCloseEditModal()}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-success px-4 py-2"
                    onClick={() => handleReplacePrimaryOfficer()}
                    style={{ backgroundColor: '#20c997', borderColor: '#20c997' }}
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
                    className="cancel-button"
                    onClick={() => handleCloseReplaceModal()}
                  >
                    Close
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => handleReplaceClear()}
                  >
                    Clear
                  </button>
                  <button
                    className="btn btn-success px-4 py-2"
                    onClick={() => handleReplaceSave()}
                    style={{ backgroundColor: '#20c997', borderColor: '#20c997' }}
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
    </>
  )
}

export default CaseTeam
