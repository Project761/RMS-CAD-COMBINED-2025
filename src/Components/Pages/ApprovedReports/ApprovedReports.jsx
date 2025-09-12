import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector, useDispatch } from 'react-redux';
import { Decrypt_Id_Name, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { fetchPostData } from '../../hooks/Api';
import { Link, useNavigate } from 'react-router-dom';

function ApprovedReports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const uniqueId = sessionStorage.getItem('UniqueUserID')
    ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
    : '';

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [clickedRow, setClickedRow] = useState(null);
  const [editval, setEditval] = useState([]);
  const [narrativeID, setNarrativeID] = useState();
  const [approveData, setApproveData] = useState([]);
  const [narrativeReportData, setNarrativeReportData] = useState([]);
  const [useOfForceData, setUseOfForceData] = useState([]);
  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }

    }
  }, []);
  useEffect(() => {
    if (localStoreData) {
      get_Data_Approve_Report(localStoreData?.PINID);
      getUseOfForceReport(localStoreData?.PINID, localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);




  const columns = [
    {
      name: 'Review',
      cell: row => (
        <div className="text-start">
          <button
            type="button"
            className="btn btn-sm btn-dark w-100 mb-1 mt-1"
            style={{ backgroundColor: "#001f3f", color: "#fff" }}
            data-toggle="modal" data-target="#ApprovedReportsModal"
            onClick={() => {
              setNarrativeID(row?.NarrativeID);
            }}
          >
            Approval Comment
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
      width: '200px',
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
          {row.ReportTypeJson === "Use Of force" ? (
            row?.ArrestID ? (
              effectiveScreenPermission ?
                effectiveScreenPermission[0]?.Changeok ?
                  <Link to={`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`}
                    onClick={(e) => { set_IncidentId(row); }}
                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                    <i className="fa fa-edit"></i>
                  </Link>
                  : <></>
                : <Link to={`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`}
                  onClick={(e) => { set_IncidentId(row); }}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                  <i className="fa fa-edit"></i>
                </Link>
            ) : (
              effectiveScreenPermission ? (
                effectiveScreenPermission[0]?.Changeok ? (
                  <Link
                    to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`}
                    onClick={() => set_IncidentId(row)}
                    className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                ) : <></>
              ) : (
                <Link
                  to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`}
                  onClick={() => set_IncidentId(row)}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                >
                  <i className="fa fa-edit"></i>
                </Link>
              )
            )
          ) : (
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.Changeok ?
                <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
                  onClick={(e) => { set_IncidentId(row); }}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                  <i className="fa fa-edit"></i>
                </Link>
                : <></>
              : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
                onClick={(e) => { set_IncidentId(row); }}
                className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                <i className="fa fa-edit"></i>
              </Link>
          )}
        </div>)
    },
    {
      name: 'Incident#',
      selector: row => row.IncidentNumber,
      sortable: true,
      wrap: true,
      grow: 0,
      maxWidth: '180px',
      minWidth: '140px',

    },
    {
      name: 'Seq#',
      selector: row => row.sequence,
      sortable: true,
      wrap: true,
      grow: 0,
      maxWidth: '120px',
      minWidth: '100px',
    },

    {
      name: 'Report Type',
      selector: row => row.NarrativeDescription,
      sortable: true,
      cell: row => {
        const desc = row?.ReportTypeJson || row.NarrativeDescription?.toLowerCase();
        let backgroundColor = 'transparent';
        let color = 'inherit';

        if (desc === 'initial narrative') {
          backgroundColor = '#fde047';
          color = 'inherit';
        } else if (desc === 'public narrative') {
          backgroundColor = '#86efac';
          color = 'inherit';
        } else if (desc === 'supplementary narrative') {
          backgroundColor = '#bfdbfe'; // blue-200
          color = 'inherit';
        }
        else if (desc === 'press release') {
          backgroundColor = '#f87171'; // red-400
          color = 'inherit';
        } else if (desc === 'Use Of force') {
          backgroundColor = '#007bff'; // red-400
          color = 'inherit';
        }

        return (
          <span

            style={{
              backgroundColor,
              color,
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block',
            }}
          >
            {row?.ReportTypeJson || row.NarrativeDescription}
          </span>
        );
      },
    },


    {
      name: 'Report Name',
      selector: row => row.ReportName,
      sortable: true,
      cell: row => (
        <div
          title={row.ReportName}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '300px',
          }}
        >
          {row.ReportName}
        </div>
      ),
    },

    {
      name: 'Approved By',
      selector: row => row?.ApproveBy || row.Approve_Officer,
      sortable: true,
      wrap: true,
      grow: 0,
      maxWidth: '200px',
      minWidth: '180px',
    },

    {
      name: 'Approved Date',
      selector: row =>
        (row.ApproveDT ? getShowingWithOutTime(row.ApproveDT) : '') ||
        (row?.ApproveDtTm ? getShowingWithOutTime(row.ApproveDtTm) : ''),
      sortable: true,
      grow: 0,
      maxWidth: '180px',
      minWidth: '150px',
    },



  ];

  const set_IncidentId = (row) => {
    if (row.IncidentID) {
    }
  }

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

  const get_Data_Approve_Report = (OfficerID) => {
    const val = { 'OfficerID': OfficerID }
    fetchPostData('IncidentNarrativeReport/GetData_NarrativeApprove', val).then((res) => {
      if (res) {
        setNarrativeReportData(res);
        // setNameFilterData(res)
      } else {
        setNarrativeReportData([]);
        // setNameFilterData([])
      }
    })
  }


  const getUseOfForceReport = (OfficerID, agencyId) => {
    const val = { 'ApprovePinID': OfficerID, 'AgencyID': agencyId }
    if (OfficerID && agencyId) {
      fetchPostData('CAD/UseOfForceReport/GetUseOfForceReport', val).then((res) => {
        if (res) {
          const Data = res?.filter((item) => item?.Status === "Approved")
          setUseOfForceData(Data);
        } else {
          setUseOfForceData([]);
        }
      })
    }
  }
  useEffect(() => {
    setApproveData([...useOfForceData, ...narrativeReportData]);
  }, [useOfForceData, narrativeReportData]);

  const onMasterPropClose = () => {

    navigate('/dashboard-page');

  }


  return (
    <div className="section-body view_page_design p-0">
      <div className="col-12 col-sm-12 p-0">
        <div className="card Agency incident-cards-approved">
          {/* <div className="text-end mt-3 d-flex mb-2" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h5 className="fw-bold ml-3">Finalized Reports</h5>
            <button className="btn btn-outline-dark mr-3" style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={onMasterPropClose}>
              Close
            </button>
          </div> */}
          <div className="card-body">
            <DataTable
              className='table-responsive_approve'
              data={approveData}
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
              fixedHeader
              persistTableHead
              fixedHeaderScrollHeight="400px"
              paginationPerPage={100}
              paginationRowsPerPageOptions={[100, 150, 200, 500]}
              conditionalRowStyles={conditionalRowStyles}
              onRowClicked={setClickedRow}
            />

          </div>

        </div>
      </div>
      <ApprovedReportsModal narrativeID={narrativeID} />
    </div>
  );
}

export default ApprovedReports;






const ApprovedReportsModal = (props) => {
  const dispatch = useDispatch();
  const uniqueId = sessionStorage.getItem('UniqueUserID')
    ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
    : '';

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const [clickedRow, setClickedRow] = useState(null);
  const [narrativeData, setnarrativeData] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);


  const { narrativeID } = props

  const reportsData = [
    { approvedBy: 'A K John', approvalComment: 'Good', reportName: 'Narrative', date: '06/20/2023' },
    { approvedBy: 'A K John', approvalComment: 'Good', reportName: 'Narrative', date: '06/20/2023' },
    { approvedBy: 'A K John', approvalComment: 'Good', reportName: 'Narrative', date: '06/20/2023' },
    { approvedBy: 'A K John', approvalComment: 'Good', reportName: 'Narrative', date: '06/20/2023' },
    { approvedBy: 'A K John', approvalComment: 'Good', reportName: 'Narrative', date: '06/20/2023' },
  ];

  const columns = [
    {
      name: 'Approval By',
      selector: row => row.ApprovingOfficer,
      sortable: true,
    },
    {
      name: 'Approval Comment',
      selector: row => row.Comments,
      sortable: true,
    },
    {
      name: 'Report Name',
      selector: row => row.ReportName,
      sortable: true,
      cell: row => (
        <div
          title={row.ReportName}
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '300px',
          }}
        >
          {row.ReportName}
        </div>
      ),
    },
    {
      name: 'Date Of Approval',
      selector: row => row.IsApprove ? getShowingWithOutTime(row.CreatedDtTm) : '',
      sortable: true,
    },
    {
      name: 'Date Of Reject',
      selector: row => row.IsReject ? getShowingWithOutTime(row.CreatedDtTm) : '',
      sortable: true,
    },
  ];

  useEffect(() => {
    get_Data_Narrative(narrativeID)
  }, [narrativeID])

  const get_Data_Narrative = (NarrativeID) => {
    const val = { 'NarrativeID': NarrativeID }
    fetchPostData('IncidentNarrativeReport/GetData_Narrative', val).then((res) => {
      if (res) {
        setnarrativeData(res)
        // setpastDueReportData(res);
        // setNameFilterData(res)s
      } else {
        // setpastDueReportData([]);
        setnarrativeData([]);
        // setNameFilterData([])
      }
    })
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedComment(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  return (
    <>
      <div
        className="modal fade" id="ApprovedReportsModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ background: "rgba(0,0,0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl ">
          <div className="modal-content approvedReportsModal" style={{ minHeight: '600px' }}>
            {/* Close Button */}
            <div className="d-flex justify-content-end p-2">
              <button
                type="button"
                className="btn-close b-none bg-transparent"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setSelectedComment()}
              >X</button>
            </div>


            {/* Modal Body */}
            <div className="modal-body name-body-model">
              <h5 className="fw-bold mb-3">Approval Comment</h5>

              <div className="card-body-shadow">
                {/* DataTable */}
                <DataTable
                  data={narrativeData}
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
                  fixedHeader
                  persistTableHead
                  fixedHeaderScrollHeight="300px"
                  paginationPerPage={100}
                  paginationRowsPerPageOptions={[100, 150, 200, 500]}
                  conditionalRowStyles={conditionalRowStyles}
                  onRowClicked={(row) => {
                    setClickedRow(null);
                    setSelectedComment(row?.Comments || '');
                  }}
                />
              </div>
              {/* Approval Comments Preview */}
              <div className="mt-4">
                <h6 className="fw-bold">Approval Comments</h6>
                <div className="border p-3 rounded bg-light" style={{ minHeight: '80px' }}>
                  {selectedComment}
                </div>
              </div>
            </div>
            {/* Close Button */}

          </div>
        </div>
      </div>
    </>
  );
};





