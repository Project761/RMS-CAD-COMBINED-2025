import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { fetchPostData } from '../../hooks/Api';
import { Link, useNavigate } from 'react-router-dom';

function RejectedReports() {
  const uniqueId = sessionStorage.getItem('UniqueUserID')
    ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
    : '';

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [clickedRow, setClickedRow] = useState(null);
  const [pastDueReportData, setpastDueReportData] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState();
  const [editval, setEditval] = useState([]);
  const [narrativeID, setNarrativeID] = useState();
  const [rejectedData, setRejectedData] = useState();
  const [narrativeReportData, setNarrativeReportData] = useState([]);
  const [useOfForceData, setUseOfForceData] = useState([]);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
      // get_Incident_Count(IncID, localStoreData?.PINID);
      // setMainIncidentID(IncID);
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      //  getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
      get_Data_Rejected_Report(localStoreData?.PINID);
      getUseOfForceReport(localStoreData?.PINID, localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));

    }
  }, [localStoreData]);


  const reportsData = [
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Press Release', typeColor: 'danger', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Supplementary Narrative', typeColor: 'primary', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Initial Narrative', typeColor: 'warning', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Public Narrative', typeColor: 'success', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Initial Narrative', typeColor: 'warning', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Public Narrative', typeColor: 'success', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Public Narrative', typeColor: 'success', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Initial Narrative', typeColor: 'warning', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Supplementary Narrative', typeColor: 'primary', rejectedBy: 'John', rejectedDate: '01/12/2025' },
    { incident: '25–000025', reportName: 'Narrative', seq: 1, reportType: 'Press Release', typeColor: 'danger', rejectedBy: 'John', rejectedDate: '01/12/2025' },
  ];

  const columns = [
    {
      name: 'Review',
      cell: row => (
        <div className="text-start">
          <button
            type="button"
            className="btn btn-sm btn-dark w-100 mb-1"
            style={{ backgroundColor: "#001f3f", color: "#fff" }}
            data-toggle="modal"
            data-target="#RejectedReportsModal"
            onClick={() => {
              setNarrativeID(row?.NarrativeID);
            }}
          >
            Rejected Comment
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
      grow: 0,
      minWidth: '160px',
    },

    // {
    //   name: '',
    //   selector: row => row.IncidentNumber,
    //   sortable: true,
    //   wrap: true,
    //   grow: 0,
    //   minWidth: '60px',
    //   cell: row => (
    //     <div style={{ position: 'absolute', top: 4, }}>
    //       {
    //         effectiveScreenPermission ?
    //           effectiveScreenPermission[0]?.Changeok ?
    //             <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
    //               onClick={(e) => { set_IncidentId(row); }}
    //               className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
    //               <i className="fa fa-edit"></i>
    //             </Link>
    //             : <></>
    //           : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
    //             onClick={(e) => { set_IncidentId(row); }}
    //             className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
    //             <i className="fa fa-edit"></i>
    //           </Link>
    //       }
    //     </div>)
    // },
    
    {
      name: 'Incident# ',
      grow: 1,
      minWidth: '110px',
      cell: row => {
        return (
          <span
            onClick={() => {
              navigate(
                `/Inc-Report?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`
              );
            }}
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            title="Go to Incident"
          >
            {row?.IncidentNumber}
          </span>
        );
      }, sortable: true,
    },
    {
      name: 'Seq#',
      selector: row => row.sequence,
      sortable: true,
      grow: 0,
      minWidth: '80px',

    },
    {
      name: 'Report Type',
      grow: 1,
      minWidth: '140px',
      selector: row => row.NarrativeDescription,
      sortable: true,
      cell: row => {
        const desc = row?.ReportTypeJson || row.NarrativeDescription?.toLowerCase();

        let backgroundColor = 'transparent';
        let color = 'inherit';

        if (desc === 'initial narrative') {
          backgroundColor = '#fde047'; // yellow-300
          color = 'inherit';
        } else if (desc === 'public narrative') {
          backgroundColor = '#86efac'; // green-300
          color = 'inherit';
        } else if (desc === 'supplementary narrative') {
          backgroundColor = '#bfdbfe'; // blue-200
          color = 'inherit';
        }
        else if (desc === 'press release') {
          backgroundColor = '#f87171'; // red-400
          color = 'inherit';
        } else if (desc === 'Use Of Force') {
          backgroundColor = '#007bff'; // red-400
          color = '#ffff';
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
      grow: 2,
      minWidth: '180px',
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
      name: 'Rejected By',
      grow: 1,
      selector: row => row.Reject_Officer,
      sortable: true,
    },
    {
      name: 'Rejected Date',
      minWidth: "70px",
      grow: 1,
      selector: row => row.RejectDtTm ? getShowingWithOutTime(row.RejectDtTm) : '',
      sortable: true,
    },

    // {
    //   name: 'Type Color',
    //   cell: row => (
    //     <span className={`badge bg-${row.typeColor} text-white`}>
    //       {row.reportType}
    //     </span>
    //   ),
    //   sortable: false,
    //   width: '180px',
    // },



  ];

  const set_IncidentId = (row) => {
    if (row.IncidentID) {
      // dispatch({ type: Incident_ID, payload: row?.IncidentID });
      // dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
    }
  }

  const get_Data_Rejected_Report = (OfficerID) => {
    const val = { 'OfficerID': OfficerID }
    fetchPostData('IncidentNarrativeReport/GetData_NarrativeReject', val).then((res) => {
      if (res) {
        console.log(res)
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
          const Data = res?.filter((item) => item?.Status === "Rejected")
          setUseOfForceData(Data);
        } else {
          setUseOfForceData([]);
        }
      })
    }
  }
  useEffect(() => {
    setRejectedData([...useOfForceData, ...narrativeReportData]);
  }, [useOfForceData, narrativeReportData]);

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
      <div className="section-body view_page_design p-0">
        <div className="col-12 col-sm-12 p-0">
          {/* <h5 className="fw-bold">Rejected Reports</h5> */}
          <div className="card Agency incident-cards-rejected">
            {/* <div className="text-end mt-3 d-flex mb-2" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <h5 className="fw-bold ml-3">Needs Correction</h5>
              <button className="btn btn-outline-dark mr-3" style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={onMasterPropClose}>
                Close
              </button>
            </div> */}
            <div className="card-body">
              <DataTable
                className='table-responsive_pastdue_rejected'
                data={rejectedData}
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
                defaultSortFieldId={8}
                defaultSortAsc={false}
              />

            </div>
          </div>
        </div>


        <RejectedReportsModal narrativeID={narrativeID} />

      </div>
    </>
  );
}

export default RejectedReports;







const RejectedReportsModal = (props) => {
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
    { rejectedBy: 'A K John', rejectionReason: 'Not Good', reportName: 'Narrative', date: '06/20/2023' },
    { rejectedBy: 'A K John', rejectionReason: 'Not Good', reportName: 'Narrative', date: '06/20/2023' },
    { rejectedBy: 'A K John', rejectionReason: 'Not Good', reportName: 'Narrative', date: '06/20/2023' },
    { rejectedBy: 'A K John', rejectionReason: 'Not Good', reportName: 'Narrative', date: '06/20/2023' },
    { rejectedBy: 'A K John', rejectionReason: 'Not Good', reportName: 'Narrative', date: '06/20/2023' },
  ];

  const columns = [
    {
      name: 'Rejected By',
      selector: row => row.ApprovingOfficer,
      sortable: true,
    },
    {
      name: 'Reason For Rejection',
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
      name: 'Date Of Rejection',
      selector: row => row.CreatedDtTm ? getShowingWithOutTime(row.CreatedDtTm) : '',
      sortable: true,
    },
  ];

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#d6e6ff',
        color: 'black',
        fontWeight: 'bold',
      },
    },
  ];

  useEffect(() => {
    get_Data_Narrative(narrativeID)
  }, [narrativeID])

  const get_Data_Narrative = (NarrativeID) => {
    const val = { 'NarrativeID': NarrativeID }
    fetchPostData('IncidentNarrativeReport/GetData_Narrative', val).then((res) => {
      if (res) {
        console.log(res)
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

  return (
    <>
      <div
        className="modal fade"
        id="RejectedReportsModal"
        tabIndex="-1"
        aria-labelledby="RejectedReportsModalLabel"
        aria-hidden="true"
        style={{ background: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-xl py-5">
          <div className="modal-content approvedReportsModal">
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
              <h5 className="fw-bold m-0">Rejected Comment</h5>
              <button
                type="button"
                className="btn-close b-none bg-transparent"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => setSelectedComment()}
              >✕</button>
            </div>

            {/* Modal Body */}
            <div className="modal-body name-body-model">
              {/* DataTable */}
              <DataTable
                className='table-responsive_pastdue'
                data={narrativeData}
                dense
                columns={columns}
                highlightOnHover
                customStyles={tableCustomStyles}
                noDataComponent={
                  effectiveScreenPermission?.[0]?.DisplayOK
                    ? 'There are no data to display'
                    : 'You don’t have permission to view data'
                }
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight="250px"
                paginationPerPage={100}
                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={(row) => {
                  setClickedRow(null);
                  setSelectedComment(row?.Comments || '');
                }}
              />

              {/* Rejection Comment Preview */}
              <div className="mt-4">
                <h6 className="fw-bold">Reason For Rejection</h6>
                <div className="border p-3 rounded bg-light" style={{ minHeight: '80px' }}>
                  {selectedComment}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            {/* <div className="mt-4 mb-3 me-3 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-secondary mr-3"
                data-dismiss="modal"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};


