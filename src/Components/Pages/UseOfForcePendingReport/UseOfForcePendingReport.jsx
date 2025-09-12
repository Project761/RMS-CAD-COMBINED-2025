import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { base64ToString, Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Loader from '../../Common/Loader';
import useObjState from '../../../CADHook/useObjState';



function UseOfForcePendingReport({ isPreview }) {
  const uniqueId = sessionStorage.getItem('UniqueUserID')
    ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
    : '';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [clickedRow, setClickedRow] = useState(null);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState();
  const [editval, setEditval] = useState([]);
  const [queData, setqueData] = useState();
  const [modelStatus, setModelStatus] = useState(false);
  const [loder, setLoder] = useState(false);
  const [LastComments, setLastComments] = useState();
  const [arrsetPoliceForceID, setArrsetPoliceForceID] = useState();
  const [ArrestNumber, setArrestNumber] = useState();
  const [IncidentNumber, setIncidentNumber] = useState();
  const [arrestID, setarrestID] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      getUseOfForceData(localStoreData?.PINID, localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));

    }
  }, [localStoreData]);

  useEffect(() => {
    getUseOfForceData(loginPinID, loginAgencyID);

  }, [isOpen]);


  const columns = [
    {
      name: 'Review',
      cell: row => (
        <div className="text-start">
          <button
            type="button"
            className="btn btn-sm btn-dark w-100 mb-1"
            style={{ backgroundColor: "#001f3f", color: "#fff", fontSize: '11px' }}
            data-toggle="modal" data-target="#PoliceForceTaskModal"
            onClick={() => {
              // GetSingleData(row?.NarrativeID); setWrittenForID(row?.WrittenForID); setNarrativeID(row?.NarrativeID);
              setarrestID(row?.ArrestID)
              setIncidentNumber(row?.IncidentNumber);
              setArrestNumber(row?.ArrestNumber);
              setArrsetPoliceForceID(row?.ArrsetPoliceForceID);
              setEditval(row)
              setIsOpen(true);
            }}
          >
            Review
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,

    },

    {
      name: '',
      selector: row => row.incident,
      sortable: true,
      wrap: true,
      grow: 0,
      maxWidth: '170px',
      minWidth: '50px',

      cell: row => (
        <div style={{ position: 'absolute', top: 4, }}>
          {
            row.ArrestID ?
              (
                effectiveScreenPermission ?
                  effectiveScreenPermission[0]?.Changeok ?
                    <Link to={`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`}
                      onClick={(e) => { set_IncidentId(row); }}
                      className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                      style={{
                        lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
                      }}

                    >
                      <i className="fa fa-edit" style={{ fontSize: '12px' }}></i>
                    </Link>
                    : <></>
                  : <Link to={`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`}
                    onClick={(e) => { set_IncidentId(row); }}
                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                    style={{
                      lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
                    }}

                  >
                    <i className="fa fa-edit" style={{ fontSize: '12px' }}></i>
                  </Link>
              )
              :
              (
                effectiveScreenPermission ?
                  effectiveScreenPermission[0]?.Changeok ?
                    <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`}
                      onClick={(e) => { set_IncidentId(row); }}
                      className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                      style={{
                        lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
                      }}

                    >
                      <i className="fa fa-edit" style={{ fontSize: '12px' }}></i>
                    </Link>
                    : <></>
                  : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`}
                    onClick={(e) => { set_IncidentId(row); }}
                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                    style={{
                      lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
                    }}

                  >
                    <i className="fa fa-edit" style={{ fontSize: '12px' }}></i>
                  </Link>
              )

          }
        </div>)
    },
    {
      name: 'Incident#',
      selector: row => row.IncidentNumber,
      sortable: true,
      wrap: true,
      maxWidth: '200px',
      minWidth: '150px',
      cell: row => (
        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {row.IncidentNumber}
        </div>
      )
    },
    {
      name: 'Arrest#',
      selector: row => row.ArrestNumber,
      sortable: true,
      wrap: true,
      maxWidth: '200px',
      minWidth: '150px',
      cell: row => (
        <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
          {row.ArrestNumber}
        </div>
      )
    },

    {
      name: 'Status',
      selector: row => row.Status,
      sortable: true,
      cell: row => {
        const desc = row.Status?.toLowerCase();
        let backgroundColor = 'transparent';
        let color = 'black';

        if (desc === 'pending review') {
          backgroundColor = '#007bff'; // Blue for "Pending Review"
          color = 'white';
        }
        else if (desc === 'approved') {
          backgroundColor = '#28a745'; // Green color
          color = 'white';
        }
        else if (desc === 'draft') {
          backgroundColor = '#ffc107'; // Orange color
          color = 'white';
        }
        else if (desc === 'rejected') {
          backgroundColor = '#FF0000'; // Red color
          color = 'white';
        }

        return (
          <span
            style={{
              backgroundColor,
              color,
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            {row.Status}
          </span>
        );
      },
      width: "160px",
    },

    { name: 'Approving Officer/Group', selector: row => row.ApproverName, sortable: true, width: "200px", },
    { name: 'Report Type', selector: row => row.ReportTypeJson, sortable: true, width: "200px", },
    { name: 'Summitted By', selector: row => row.SummittedBy, sortable: true, minWidth: "190px", },
    { name: 'Summitted Date/Time', selector: row => row.SummittedDateTime ? getShowingDateText(row.SummittedDateTime) : '', sortable: true, minWidth: "180px", },
    {
      name: 'Due Date',
      selector: row => row.DueDate ? getShowingWithOutTime(row.DueDate) : '',
      sortable: true,
      cell: row => (
        <span style={{ color: 'red' }}>
          {row.DueDate ? getShowingWithOutTime(row.DueDate) : ''}
        </span>
      ),
    },
    {
      name: 'Elapsed Day',
      selector: row => row.ElapsedDay,
      sortable: true,
      minWidth: "140px",
    },
  ];

  const set_IncidentId = (row) => {
    if (row.IncidentID) {
      // dispatch({ type: Incident_ID, payload: row?.IncidentID });
      // dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
    }
  }

  const getUseOfForceData = (OfficerID, agencyId) => {
    const val = { 'ApprovePinID': OfficerID, 'AgencyID': agencyId }
    if (OfficerID && agencyId) {
      fetchPostData('CAD/UseOfForceReport/GetUseOfForceReport', val).then((res) => {
        if (res) {
          const pendingStatusData = res?.filter((item) => item?.Status === "Pending Review")
          setqueData(pendingStatusData);
          setLoder(true);
        } else {
          setqueData([]);
          setLoder(true);
        }
      })
    }
  }

  // const GetSingleData = (NarrativeID) => {
  //   const val = { 'NarrativeID': NarrativeID, }
  //   fetchPostData('IncidentNarrativeReport/GetSingleData_NarrativeApprove', val).then((res) => {
  //     if (res) {
  //       setEditval(res);
  //       //  setNameSingleData(res);
  //       setModelStatus(true);
  //     } else {
  //       setEditval([]);
  //       //  setNameSingleData([]) 
  //     }
  //   })
  // }

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
      },
    },
  ];

  const onMasterPropClose = () => {
    navigate('/dashboard-page');
  }

  return (
    <>
      <div className="col-12 que-reports col-sm-12">
        <div className="text-end mt-2 d-flex w-100" style={{ justifyContent: "space-between", alignItems: "center", }}  >
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center">
              {isPreview && (
                <span className="mr-2 ">
                  <svg width="32" height="32" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
                    <rect width="128" height="128" rx="100" fill="#D6ECFF" />
                    <path d="M48 36h44v52H52v8h48V36h-8v44H48z" fill="#E30613" />
                    <rect x="36" y="24" width="56" height="72" rx="4" fill="#0B2F80" />
                    <rect x="48" y="38" width="32" height="6" rx="3" fill="white" />
                    <rect x="48" y="50" width="40" height="6" rx="3" fill="white" />
                    <rect x="48" y="62" width="40" height="6" rx="3" fill="white" />
                    <rect x="48" y="74" width="24" height="6" rx="3" fill="white" />
                  </svg>
                </span>
              )}
              <span className="fw-bold mb-0 ml-3" style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Use Of Force Pending Approval</span>
            </div>

          </div>

          {isPreview ? (
            <div className="d-flex align-items-center">
              <h5 className="mb-0 mr-3" style={{ fontSize: "18px", fontWeight: "600", color: '#334c65' }}>
                {queData?.length}
              </h5>
              <Link to="/useOfForce-Pending-Report">
                <button className="see-all-btn mr-1 see_all-button" style={{ fontSize: "12px", padding: "4px 8px" }}>See All</button>
              </Link>
            </div>
          ) : (
            <button
              className="btn btn-outline-dark mr-3"
              style={{ backgroundColor: "#001f3f", color: "#fff" }}
              onClick={onMasterPropClose}
            >
              Close
            </button>
          )}
        </div>
        <div className="pt-2 que-reports-datatable mt-2">
          {
            loder ?
              <DataTable
                className={isPreview ? 'table-responsive_pastdues datatable-grid' : ''}

                data={queData}
                dense
                columns={columns}
                pagination
                highlightOnHover
                customStyles={tableCustomStyles}
                noDataComponent={
                  effectiveScreenPermission?.[0]?.DisplayOK
                    ? 'There are no data to display'
                    : 'You don’t have permission to view data'
                }

                persistTableHead
                fixedHeader={true}
                fixedHeaderScrollHeight='400px'
                paginationPerPage={100}
                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={setClickedRow}
                responsive
                paginationComponentOptions={{
                  rowsPerPageText: "Rows per page:",
                  rangeSeparatorText: "of",
                  selectAllRowsItem: true,
                  selectAllRowsItemText: "All",
                }}
              /> : <Loader />
          }
        </div>
        {isOpen && (
          <PoliceForceTaskModal
            editval={editval}
            LastComments={LastComments}
            arrestID={arrestID}
            IncidentNumber={IncidentNumber}
            ArrestNumber={ArrestNumber}
            arrsetPoliceForceID={arrsetPoliceForceID}
            loginAgencyID={loginAgencyID}
            loginPinID={loginPinID}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </>
  )
}

export default UseOfForcePendingReport


const PoliceForceTaskModal = (props) => {
  const { editval, loginPinID, onClose, } = props
  const [clickedRow, setClickedRow] = useState(null);
  const [activeTab, setActiveTab] = useState('Approve');

  const [
    policeForceReviewState,
    setPoliceForceReviewState,
    handlePoliceForceReviewState,
    clearPoliceForceReviewState,
  ] = useObjState({
    reason: "",
    previousReason: ""
  });


  const columns = [
    {
      name: 'Rejected By',
      selector: row => row.CreatedBy,
      sortable: true
    },
    {
      name: 'Reason For Rejection',
      selector: row => row.Comments,
      sortable: true
    },
    {
      name: 'Date Of Rejection',
      selector: row => row.CreatedDtTm,
      sortable: true
    },
  ];

  const saveReview = () => {
    const payload = {
      UseofForceReportID: editval?.UseofForceReportID,
      ApprovePinID: editval?.ApprovePinID,
      IsApprove: activeTab === 'Approve' ? 1 : 0,
      IsReject: activeTab === 'Reject' ? 1 : 0,
      Comments: policeForceReviewState?.reason,
      UseofForceID: editval?.UseofForceID,
      IncidentID: editval?.IncidentID,
      ArrestID: editval?.ArrestID,
      CreatedByUserFK: loginPinID,
    };
    AddDeleteUpadate('CAD/UseOfForceReport/UpdateUseOfForceReport', payload)
      .then((res) => {
        if (res.success) {
          onClose()
        } else {
          console.log("something Wrong");
        }
      }).catch(err => console.log(err));
  }

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#cce5ff',
        color: 'black',
      },
    },
  ];

  const tableCustomStyles = {
    headCells: {
      style: {
        fontWeight: 'bold',
        backgroundColor: '#00264d',
        color: '#ffffff',
      },
    },
  };
  return (
    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PoliceForceTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content p-2 px-4 approvedReportsModal" >
          <div className="d-flex justify-content-between">
            <div className='row mt-1 mb-2'>
              <div className='col-12'>
                <h5 class="fw-bold mb-3">Use Of Force Review </h5>
              </div>
            </div>
            <button
              className="btn-close b-none bg-transparent"
              onClick={onClose}
              data-dismiss="modal">
              X
            </button>
          </div>

          <div className='row mt-1'>
            <div className='col-md-2 offset-1'>
              <label className="me-4">
                <input
                  type="radio"
                  value="Approve"
                  name='IsApprove'
                  checked={activeTab === 'Approve'}
                  className="form-check-input"
                  onChange={() => {
                    setActiveTab('Approve');
                    clearPoliceForceReviewState();
                  }}
                />
                Approve
              </label>
            </div>
            <div className='col-md-2'>
              <label>
                <input
                  type="radio"
                  value="Reject"
                  name='IsReject'
                  checked={activeTab === 'Reject'}
                  className="form-check-input"
                  onChange={() => {
                    setActiveTab('Reject');
                    clearPoliceForceReviewState();
                  }}
                />
                Reject
              </label>
            </div>
          </div>

          {activeTab === 'Approve' && (
            <div className="row align-items-center ">
              <div className="col-lg-12">
                <label className="fw-bold">Enter Reason for Approval</label>
                <textarea
                  className="form-control"
                  style={{ minHeight: '50px', background: '#fef6e4' }}
                  placeholder="Enter Reason for Approval"
                  value={policeForceReviewState?.reason}
                  onChange={(e) => handlePoliceForceReviewState('reason', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'Reject' && (
            <>
              {/* <div className="mb-3 mt-4">
                <label className="fw-bold">Rejected Comment</label>
                <DataTable
                  // data={policeForceData}
                  columns={columns}
                  dense
                  highlightOnHover
                  noHeader
                  customStyles={tableCustomStyles}
                  conditionalRowStyles={conditionalRowStyles}
                  onRowClicked={setClickedRow}
                  paginationPerPage={5}
                  pagination
                />
              </div> */}
              <div className="row g-3 ">
                {/* <div className="col-md-6">
                  <label className="fw-bold">Previous Reason for Rejection</label>
                  <textarea
                    className="form-control"
                    style={{ minHeight: '50px', background: '#fef6e4' }}
                    value={policeForceReviewState?.previousReason}
                    onChange={(e) => handlePoliceForceReviewState('previousReason', e.target.value)}
                    readOnly
                  />
                </div> */}
                <div className="col-md-12">
                  <label className="fw-bold">Enter Reason for Rejection</label>
                  <textarea
                    className="form-control"
                    style={{ minHeight: '50px', background: '#fef6e4' }}
                    placeholder="Enter Reason for Rejection"
                    value={policeForceReviewState?.reason}
                    onChange={(e) => handlePoliceForceReviewState('reason', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
          <div className="d-flex justify-content-end mt-4">
            <button className="btn btn-primary " style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={() => saveReview()} >Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};



