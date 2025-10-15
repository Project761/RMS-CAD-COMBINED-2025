import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, Decrypt_Id_Name, editorConfig, getShowingDateText, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { get_Report_Approve_Officer_Data, get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { toastifySuccess } from '../../Common/AlertMsg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import { useQuery } from 'react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import SelectBox from '../../Common/SelectBox';
import { get_Narrative_Type_Drp_Data } from '../../../redux/actions/DropDownsData';
import Loader from '../../Common/Loader';
import ReactQuill from 'react-quill';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from 'ckeditor5';
import CurrentIncMasterReport from '../Incident/IncidentTab/CurrentIncMasterReport';
import useObjState from '../../../CADHook/useObjState';


function QueueReports({ isPreview }) {

  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

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
  var IncNo = query?.get("IncNo");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [clickedRow, setClickedRow] = useState(null);
  const [pastDueReportData, setpastDueReportData] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState();
  const [editval, setEditval] = useState([]);
  const [narrativeID, setNarrativeID] = useState();
  const [queData, setqueData] = useState();
  const [modelStatus, setModelStatus] = useState(false);
  const [WrittenForID, setWrittenForID] = useState();
  const [loder, setLoder] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [reportApprovalStatus, setreportApprovalStatus] = useState(false);
  const [checkapproveStatus, setcheckapproveStatus] = useState(false);
  const [pendingUseOfForceData, setPendingUseOfForceData] = useState([]);
  const [pendingApprovalData, setPendingApprovalData] = useState([]);



  const [arrsetPoliceForceID, setArrsetPoliceForceID] = useState();
  const [ArrestNumber, setArrestNumber] = useState();
  const [IncidentNumber, setIncidentNumber] = useState();
  const [arrestID, setarrestID] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [LastComments, setLastComments] = useState();


  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) { dispatch(get_LocalStoreData(uniqueId)); }
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      get_Data_Que_Report(localStoreData?.PINID, localStoreData?.AgencyID);
      dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));

      setreportApprovalStatus(localStoreData?.ReportApproval);
      setcheckapproveStatus(localStoreData?.IsLevel);
      getUseOfForceData(localStoreData?.PINID, localStoreData?.AgencyID);


    }
  }, [localStoreData]);

  useEffect(() => {
    if (modelStatus) {
      get_Data_Que_Report(loginPinID, loginAgencyID);
    }
  }, [modelStatus]);

  const columns = [
    {
      name: 'Review',
      cell: row => (
        <div className="text-start">
          {row.ReportTypeJson === "Use Of Force"
            ? <button
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

            : <button
              type="button"
              className="btn btn-sm btn-dark w-100 mb-1"
              style={{ backgroundColor: "#001f3f", color: "#fff", fontSize: '11px' }}
              // data-toggle="modal" data-target="#QueueReportsModal"
              onClick={() => {
                GetSingleData(row?.NarrativeID); setWrittenForID(row?.WrittenForID); setNarrativeID(row?.NarrativeID);
              }}
            >
              Review
            </button>}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,

    },
    // {
    //   name: '',
    //   selector: row => row.incident,
    //   sortable: true,
    //   wrap: true,
    //   grow: 0,
    //   maxWidth: '170px',
    //   minWidth: '50px',

    //   cell: row => (
    //     <div style={{ position: 'absolute', top: 4, }}>
    //       {
    //         effectiveScreenPermission ?
    //           effectiveScreenPermission[0]?.Changeok ?
    //             <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
    //               onClick={(e) => { set_IncidentId(row); }}
    //               className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
    //               style={{
    //                 lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
    //                 alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
    //               }}
    //             >
    //               <i className="fa fa-edit" style={{ fontSize: '12px' }}></i>
    //             </Link>
    //             : <></>
    //           : <Link to={`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64(row?.NarrativeID)}&tab=Report`}
    //             onClick={(e) => { set_IncidentId(row); }}
    //             className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
    //             style={{
    //               lineHeight: '1', minWidth: '22px', height: '22px', display: 'flex',
    //               alignItems: 'center', justifyContent: 'center', borderRadius: '4px'
    //             }}

    //           >
    //             <i className="fa fa-edit" style={{ fontSize: '12px' }}></i>
    //           </Link>
    //       }
    //     </div>)
    // },
    // { name: 'Incident# ', selector: row => row.IncidentNumber, sortable: true, grow: 0, maxWidth: '130px', minWidth: '120px', },
    {
      name: 'Incident# ', cell: row => {
        return (
          <span
            onClick={() =>
              navigate(`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=${true}`)
            }
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
      }, sortable: true, grow: 0, width: "105px",
    },
    {
      name: 'Arrest# ', cell: row => {
        return (
          <span
            onClick={() => {
              <>
                {
                  row?.ArrestNumber && (
                    navigate(`/Arrest-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}`)
                  )}
              </>
            }}
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            title="Go to Arrest"
          >
            {row?.ArrestNumber}
          </span>
        );
      }, sortable: true, grow: 0, width: "140px",
    },
    // {
    //   name: 'Incident#',
    //   selector: row => row.IncidentNumber,
    //   sortable: true,
    //   wrap: true,
    //   maxWidth: '200px',
    //   minWidth: '150px',
    //   cell: row => (
    //     <div style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
    //       {row.IncidentNumber}
    //     </div>
    //   )
    // },
    { name: 'Seq#', selector: row => row.sequence, sortable: true, grow: 0, width: '80px', },

    { name: 'Approving Officer/Group', selector: row => row.ApproverName || row.Approve_Officer, sortable: true },
    {
      name: 'Report Type',
      width: "200px",
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
        }
        else if (desc === 'Use Of Force') {
          backgroundColor = '#007bff';
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
              whiteSpace: "nowrap"

            }}
          >
            {row.ReportTypeJson || row.NarrativeDescription}
          </span>
        );
      },
    },
    { name: 'Summitted By', selector: row => row.SummittedBy || row.CreateOfficer, sortable: true },
    { name: 'Summitted Date/Time', selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true },
    // {
    //   name: 'Report Name',
    //   selector: row => row.ReportName,
    //   sortable: true,
    //   cell: row => (
    //     <div
    //       title={row.ReportName}
    //       style={{
    //         whiteSpace: 'nowrap',
    //         overflow: 'hidden',
    //         textOverflow: 'ellipsis',
    //         maxWidth: '300px',
    //       }}
    //     >
    //       {row.ReportName}
    //     </div>
    //   ),
    // },
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
      name: 'Elapsed Days',
      selector: row => row.ElapsedDay,
      sortable: true,
      // grow: 0,
      // maxWidth: '130px',
      // minWidth: '120px',
      cell: row => {
        let color = '';
        if (row.ElapsedDay > row.DueStatus) {
          color = '#FF0000';
        }
        return (
          <span
            style={{
              color,
              // padding: '2px 6px',
              // borderRadius: '4px',
              // display: 'inline-block',
              // fontWeight: 'bold',
            }}
          >
            {row.ElapsedDay}
          </span>
        );
      }
    },
    // {
    //   name: 'Elapsed Day',
    //   selector: row => row.ElapsedDay,
    //   sortable: true,
    //   // cell: row => (
    //   //   <span style={{ color: 'red' }}>
    //   //     {row.DueDate ? getShowingWithOutTime(row.DueDate) : ''}
    //   //   </span>
    //   // ),
    // },
    { name: 'Opened By', selector: row => row.OpenedBy, sortable: true },
  ];

  const set_IncidentId = (row) => {
    if (row.IncidentID) {
      // dispatch({ type: Incident_ID, payload: row?.IncidentID });
      // dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
    }
  }

  const get_Data_Que_Report = (OfficerID, agencyId) => {
    const val = { 'OfficerID': OfficerID, 'AgencyID': agencyId }
    fetchPostData('IncidentNarrativeReport/GetData_NarrativeQueueReport', val).then((res) => {
      if (res) {

        setPendingApprovalData(res);
        setLoder(true);
        // setNameFilterData(res)
      } else {
        setPendingApprovalData([]);
        setLoder(true);
        // setNameFilterData([])
      }
    })
  }

  const GetSingleData = (NarrativeID) => {
    const val = { 'NarrativeID': NarrativeID, }
    fetchPostData('IncidentNarrativeReport/GetSingleData_NarrativeApprove', val).then((res) => {
      if (res) {
        setEditval(res);
        //  setNameSingleData(res);
        setModelStatus(true);
      } else {
        setEditval([]);
        //  setNameSingleData([]) 
      }
    })
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

  const onMasterPropClose = () => {
    navigate('/dashboard-page');
  }


  const HandleChange = (e) => {
    const value = e.target.value
    const filteredData = queData?.filter(item => item.IncidentNumber?.toLowerCase().includes(value.toLowerCase()) || item.NarrativeDescription?.toLowerCase().includes(value.toLowerCase()) || item.CreatedDtTm?.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filteredData);
  };

  // const HandleChange = (e) => {
  //   const value = e.target.value
  //   const filteredData = queData.filter(item => [item.IncidentNumber, item.NarrativeDescription, item.CreatedDtTm].some(f => f?.toLowerCase().includes(value)));
  //   console.log(queData, "queData")
  //   setFilteredData(filteredData);
  // };

  // use of force 

  useEffect(() => {
    setqueData([...pendingUseOfForceData, ...pendingApprovalData]);
    setLoder(true);
  }, [pendingUseOfForceData, pendingApprovalData]);



  useEffect(() => {
    getUseOfForceData(loginPinID, loginAgencyID);

  }, [isOpen]);


  const getUseOfForceData = (OfficerID, agencyId) => {
    const val = { 'ApprovePinID': OfficerID, 'AgencyID': agencyId }
    if (OfficerID && agencyId) {
      fetchPostData('CAD/UseOfForceReport/GetUseOfForceReport', val).then((res) => {
        if (res) {
          const pendingStatusData = res?.filter((item) => item?.Status === "Pending Review")
          setPendingUseOfForceData(pendingStatusData);
          setLoder(true);
        } else {
          setPendingUseOfForceData([]);
          setLoder(true);
        }
      })
    }
  }



  // end use of force

  return (
    <>
      {/* <div className="view_page_design pt-1 p-1"> */}
      <div className="col-12 que-reports col-sm-12">
        {/* <div className="card Agency incident-cards"> */}
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
              <span className="fw-bold mb-0 " style={{ fontSize: '15px', fontWeight: '700', color: '#334c65' }}>Report Pending Approval</span>
            </div>



          </div>

          {isPreview ? (
            <div className="d-flex align-items-center">
              <div className="position-relative mr-3">
                <input
                  type="text" name="IncidentNumber" id="IncidentNumber"
                  className="form-control py-1 new-input" placeholder="Search......"
                  // value={value.IncidentNumber}
                  // maxLength={12}
                  // onKeyDown={handleKeyPress}
                  onChange={(e) => { HandleChange(e); }}
                  autoComplete="off"
                />
              </div>
              <h5 className="mb-0 mr-3" style={{ fontSize: "18px", fontWeight: "600", color: '#334c65' }}>
                {queData?.length}
              </h5>
              <Link to="/queue-Reports">
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
        {/* <div className="card-body que-reports-card-body"> */}
        <div className="pt-2 que-reports-datatable mt-2">
          {
            loder ?
              <DataTable
                className={isPreview ? 'table-responsive_pastdues datatable-grid' : ''}
                data={
                  filteredData?.length > 0 ? filteredData : queData
                }
                // data={queData}
                dense
                columns={columns}
                pagination
                highlightOnHover
                customStyles={tableCustomStyles}
                noDataComponent={effectiveScreenPermission?.[0]?.DisplayOK ? 'There are no data to display' : 'You don’t have permission to view data'}
                persistTableHead
                fixedHeader={true}
                fixedHeaderScrollHeight='400px'
                paginationPerPage={100}
                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={setClickedRow}
                responsive
                defaultSortFieldId={8}
                defaultSortAsc={false}
                paginationComponentOptions={{
                  rowsPerPageText: "Rows per page:",
                  rangeSeparatorText: "of",
                  selectAllRowsItem: true,
                  selectAllRowsItemText: "All",
                }}
              /> : <Loader />
          }

        </div>
        {/* </div> */}
        {modelStatus && editval?.length > 0 && (

          <QueueReportsModal checkapproveStatus={checkapproveStatus} reportApprovalStatus={reportApprovalStatus} editval={editval} get_Data_Que_Report={get_Data_Que_Report} WrittenForID={WrittenForID} narrativeID={narrativeID} loginAgencyID={loginAgencyID} loginPinID={loginPinID} setModelStatus={setModelStatus} />

        )}
        {/* <QueueReportsModal editval={editval} WrittenForID={WrittenForID} narrativeID={narrativeID} loginAgencyID={loginAgencyID} loginPinID={loginPinID} setModelStatus={setModelStatus} /> */}
        {/* </div> */}
      </div>
      {/* </div> */}

      {/* {modelStatus && editval?.length > 0 && (
        <QueueReportsModal editval={editval} WrittenForID={WrittenForID} narrativeID={narrativeID} loginAgencyID={loginAgencyID} loginPinID={loginPinID} setModelStatus={setModelStatus} />
      )} */}
      {/* <QueueReportsModal editval={editval} WrittenForID={WrittenForID} narrativeID={narrativeID} loginAgencyID={loginAgencyID} loginPinID={loginPinID} setModelStatus={setModelStatus} /> */}
      {/* </div> */}

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

    </>
  )
}

export default QueueReports


const QueueReportsModal = (props) => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ReportReview');
  const dispatch = useDispatch();

  const uniqueId = sessionStorage.getItem('UniqueUserID')
    ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
    : '';

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
  const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

  const { editval, narrativeID, loginAgencyID, loginPinID, setModelStatus, checkapproveStatus, reportApprovalStatus, get_Data_Que_Report, WrittenForID } = props

  const [clickedRow, setClickedRow] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('Approve');
  const [commentInput, setCommentInput] = useState('');
  const [narrativeData, setnarrativeData] = useState([]);
  const [approvedNarrativeData, setApprovedNarrativeData] = useState([]);
  const [rejectedNarrativeData, setRejectedNarrativeData] = useState([]);
  const [incidentID, setIncidentID] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [reportedPinActivity, setreportedPinActivity] = useState(false);
  const [narrativeTypeId, setnarrativeTypeId] = useState(false);
  const [AsOfDate, setAsOfDate] = useState('');
  const [CreatedByUserFK, setCreatedByUserFK] = useState(false);
  const [approvingSuperVisorId, setapprovingSuperVisorId] = useState(false);
  const [filteredData, setfilteredData] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Individual");
  const [groupList, setGroupList] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [printIncReport, setIncMasterReport] = useState(false);
  const [IncReportCount, setIncReportCount] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [IncidentNo, setIncidentNo] = useState('');
  const [multiSelected, setMultiSelected] = useState({ optionSelected: null });
  const [checkWebWorkFlowStatus, setcheckWebWorkFlowStatus] = useState(false);
  const [reviewStatus, setreviewStatus] = useState(false);
  const [approverRequiredCount, setapproverRequiredCount] = useState();
  const [appRequiredCountCurrentStatus, setappRequiredCountCurrentStatus] = useState();



  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  const [value, setValue] = useState({
    'NameIDNumber': 'Auto Generated', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
    'IsApprove': true, 'IsReject': false, 'Comments': '', 'CommentsDoc': '', 'ApprovalComments': '', 'IsApprovedForward': '',
    'WrittenID': '',
    'IsReview': '',

  })

  const [errors, setErrors] = useState({
    'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '',
  })

  const reportsData = [
    { approvedBy: 'A K John', approvalComment: 'Not Good', reportName: 'Narrative', date: '06/20/2023' },
    { approvedBy: 'A K John', approvalComment: 'Not Good', reportName: 'Narrative', date: '05/29/2024' },
    { approvedBy: 'A K John', approvalComment: 'Not Good', reportName: 'Narrative', date: '05/29/2024' },
    { approvedBy: 'A K John', approvalComment: 'Not Good', reportName: 'Narrative', date: '05/29/2024' },
  ];

  const approveColumns = [
    { name: 'Approved By', selector: row => row.ApprovingOfficer, sortable: true },
    { name: 'Approval Comments', selector: row => row.Comments1, sortable: true },
    { name: 'Date Of Approval', selector: row => row.CreatedDtTm, sortable: true },
  ];

  const rejectColumns = [
    { name: 'Officer', selector: row => row.ApprovingOfficer, sortable: true },
    { name: 'Last Comment', selector: row => row.Comments, sortable: true },
    { name: 'Date', selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true },
    { name: 'Status', selector: row => row.status, sortable: true },

  ];

  useEffect(() => {
    if (loginAgencyID) {
      // dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
      // Get_WrittenForDataDrp(loginAgencyID, IncID);
      dispatch(get_Report_Approve_Officer_Data(loginAgencyID, loginPinID, narrativeID));
      if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(loginAgencyID)) }
      get_Group_List(loginAgencyID, loginPinID, narrativeID);
      GetData_ReportWorkLevelCheck(loginAgencyID, narrativeID)
      // get_IncidentTab_Count(IncID, loginPinID);
    }
  }, [loginAgencyID])

  const get_Group_List = (loginAgencyID, loginPinID, NarrativeID) => {
    const value = { AgencyId: loginAgencyID, PINID: loginPinID, NarrativeID: NarrativeID }
    fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
      if (res) {
        setGroupList(changeArrayFormat(res, 'group'))
        // if (res[0]?.GroupID) {
        //   setValue({
        //     ...value,
        //     ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
        //     // 'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
        //     // 'WrittenForID': checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
        //     'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
        //   });
        // }
      }
      else {
        setGroupList();
      }
    })
  }

  console.log(checkWebWorkFlowStatus)

  useEffect(() => {
    if (groupList?.GroupID) {
      setValue({
        ...value,
        ['GroupName']: changeArrayFormat_WithFilter(groupList, 'group', groupList[0]?.GroupID),
        // 'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
        // 'WrittenForID': checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
        'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
      });
    }
  }, [groupList])

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.ck-powered-by { display: none !important; }`;
    document.head.appendChild(style);
  }, []);

  const checkId = (id, obj) => {
    const status = obj?.filter((item) => item?.value == id)
    // console.log("🚀 ~ checkId ~ status:", status);?
    return status?.length > 0
  }

  const checkWrittenId = async (id, obj) => {
    const status = await obj?.filter((item) => item?.value == id)

    return status?.length > 0
  }

  console.log(editval)
  useEffect(() => {
    if (editval) {
      setIncidentNo(editval[0]?.IncidentNumber)
      setValue({
        ...value,
        'IncidentID': editval[0]?.IncidentNumber,
        'CADIncidentNumber': editval[0]?.CADIncidentNumber,
        'ReportedBy_Description': editval[0]?.ReportedBy_Description,
        'ReportName': editval[0]?.ReportName,
        'sequence': editval[0]?.sequence,
        'CommentsDoc': editval[0]?.CommentsDoc,
        'Comments': editval[0]?.Comments,
        'NarrativeReport_Comments': editval[0]?.NarrativeReport_Comments,
        'WrittenID': editval[0]?.WrittenForID,
        'IsReview': editval[0]?.IsReview,
      })
      setappRequiredCountCurrentStatus(editval[0]?.IsApprovedForwardCount);
      setApprovalStatus(editval[0]?.IsReview ? 'ApproveAndReview' : 'Approve');

      setIsSaved(false);
      if (editval[0]?.CommentsDoc?.trim()) {
        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editval[0]?.CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));
      }
      setreviewStatus(editval[0]?.IsReview);
      setIncidentID(editval[0]?.IncidentID)
      // setapprovingSuperVisorId(editval[0]?.IncidentID)
      // setCreatedByUserFK(editval[0]?.IncidentID)
      setAsOfDate(editval[0]?.AsOfDate ? getShowingDateText(editval[0]?.AsOfDate) : '');
      setnarrativeTypeId(editval[0]?.NarrativeTypeID)
      setreportedPinActivity(editval[0]?.ReportedByPINActivityID)
      setIsDataReady(true);
    }
    else {
      setValue({
        ...value,
        'IncidentID': '',
        'CADIncidentNumber': '',
        'ReportedBy_Description': '',
        'Comments': '',
        'sequence': '',
        'CommentsDoc': '',
        'WrittenID': ''
      });
    }
  }, [editval])

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

  useEffect(() => {
    get_Data_Narrative(narrativeID)
  }, [narrativeID])

  const get_Data_Narrative = (NarrativeID) => {
    const val = { 'NarrativeID': NarrativeID }
    fetchPostData('IncidentNarrativeReport/GetData_Narrative', val).then((res) => {
      if (res) {


        setnarrativeData(res);
        const approvedData = res.filter(item => item.IsApprove === true);
        const rejectedData = res.filter(item => item.IsReject === true);

        setApprovedNarrativeData(approvedData);
        setRejectedNarrativeData(rejectedData);

        // setpastDueReportData(res);
        setfilteredData(res)
      } else {
        // setpastDueReportData([]);
        setnarrativeData([]);
        // setNameFilterData([])
      }
    })
  }


  const Add_Type = () => {
    const { IsApprove, IsReject, Comments, CommentsDoc } = value
    const documentAccess = selectedOption === "Individual" ? 'Individual' : 'Group';
    const val = {
      'AgencyID': loginAgencyID,
      'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': documentAccess, 'ApprovingSupervisorID': '', 'IsApprove': value.IsApprove === undefined && value.IsReject === undefined ? true : value.IsApprove, 'CreatedByUserFK': loginPinID, 'IsReject': IsApprove === undefined && IsReject === undefined ? false : IsReject,
      // 'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': documentAccess, 'ApprovingSupervisorID': '', 'IsApprove': value.IsApprove === undefined && value.IsReject === undefined ? true : value.IsApprove, 'CreatedByUserFK': loginPinID, 'IsReject': IsReject,
      'CommentsDoc': CommentsDoc,
      "ReportedByPINActivityID": reportedPinActivity,
      "NarrativeTypeID": narrativeTypeId, 'WrittenForID': value?.WrittenID,
      'Comments': Comments,
      'AsOfDate': AsOfDate,
      'ModifiedByUserFK': loginPinID,
    };
    AddDeleteUpadate('Narrative/Update_Narrative', val).then((res) => {
      // setChangesStatus(false);
      Add_Type_Comments()

      get_Data_Narrative(narrativeID)
      // get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
      // setModal(false)

      const parseData = JSON.parse(res.data);
      toastifySuccess(parseData?.Table[0].Message);
      // setStatesChangeStatus(false);
      // get_Data_Que_Report(loginPinID, loginAgencyID)
      setIsSaved(true);
      setModelStatus(false);
      reset();
      navigate('/dashboard-page');
    })
  }

  const Add_Type_Comments = () => {
    const { IsApprove, IsReject, Comments, CommentsDoc, ApprovalComments, ApprovingSupervisorID, IsApprovedForward, IsReview } = value
    const type = selectedOption === "Individual" ? 'Individual' : 'Group';

    const val = {
      'AgencyID': loginAgencyID,
      'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID,
      'IsApprove': reviewStatus ? false : (value.IsApprove === undefined && value.IsReject === undefined) || IsApprovedForward ? true : value.IsApprove,
      //  'IsApprove':  (value.IsApprove === undefined && value.IsReject === undefined) || IsApprovedForward ? true : value.IsApprove,
      'CreatedByUserFK': loginPinID,
      // 'IsApprovedForward': IsApprovedForward,
      'IsApprovedForward': reviewStatus ? false : IsApprovedForward,
      'IsReview': IsReview,
      // 'IsReject': IsApprove === undefined && IsReject === undefined ? false : IsReject,
      'IsReject': IsApprove === undefined && IsReject === undefined || reviewStatus ? false : IsReject,
      'Comments': ApprovalComments,
      // 'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': IsApprovedForward ? 'true' : IsApprove, 'CreatedByUserFK': loginPinID, 'IsApprovedForward': IsApprovedForward, 'IsReject': IsReject, 'Comments': ApprovalComments,

    };
    AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val).then((res) => {
      // setChangesStatus(false);
      // get_Data_Narrative(narrativeID)
      // get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
      // setModal(false)
      get_Data_Que_Report(loginPinID, loginAgencyID);
      const parseData = JSON.parse(res.data);
      // toastifySuccess(parseData?.Table[0].Message);
      // setStatesChangeStatus(false);
      // setIsSaved(true);
      // setModelStatus(true);
      resets();
    })
  }

  const reset = () => {
    // setcountAppear(false);
    setValue({
      ...value,
      // 'Comments': '',
      'CommentsDoc': ''
    });
    // setIsSaved(false);
  }

  const resets = () => {
    // setcountAppear(false);
    setValue({
      ...value,
      // 'Comments': '',
      'ApprovalComments': ''
    });
  }

  const handleRadioChange = (event) => {
    const selectedOptionnew = event.target.value;
    setApprovalStatus(selectedOptionnew);
    setValue(prevState => ({
      ...prevState,
      IsApprove: selectedOptionnew === 'Approve',
      IsReject: selectedOptionnew === 'Reject',
      IsApprovedForward: selectedOptionnew === 'ApproveAndForward',
      IsReview: selectedOptionnew === 'ApproveAndReview',
    }));

    setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', ['GroupError']: '' })
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (event) {
      setValue((prevState) => ({ ...prevState, [name]: value, }));
    }
    else {
      setValue((prevState) => ({ ...prevState, [name]: null, }));
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state); convertContentToHTML(state);
  }

  const convertContentToHTML = (state) => {
    let currentContentAsHTML = draftToHtml(convertToRaw(state.getCurrentContent()));
    setValue({ ...value, 'CommentsDoc': currentContentAsHTML });

  }

  const getValueNarrative = (e) => {
    // setChangesStatus(true);
    // setStatesChangeStatus(true);

    let combinedText = '';

    for (let key in e.blocks) {
      if (e.blocks[key]?.text) {
        combinedText += e.blocks[key].text + ' ';
      }
    }

    setValue({ ...value, ['Comments']: combinedText.trim() });
  };

  const check_Validation_ErrorApproval = () => {
    if (value.IsApprovedForward || value.IsReview) {
      const ApprovalCommentsErr = RequiredFieldIncident(value?.ApprovalComments);
      const CommentsDocumentsErr = RequiredFieldIncident(value.Comments?.trim());
      const ApprovingOfficerErr = RequiredFieldIncident(value?.ApprovingSupervisorID);



      // setErrors(prevValues => { return {...prevValues, ['ApprovalCommentsError']: RequiredFieldIncident(value.ApprovalComments) } })
      // setErrors(prevValues => { return {...prevValues, ['CommentsDocumentsError']: RequiredFieldIncident(value.Comments?.trim()) } })
      // setErrors(prevValues => { return {...prevValues, ['ApprovingOfficerError']: RequiredFieldIncident(value.ApprovingSupervisorID) } })

      setErrors(prevValues => {
        return {
          ...prevValues,
          ['ApprovalCommentsError']: ApprovalCommentsErr || prevValues['ApprovalCommentsError'],
          ['CommentsDocumentsError']: CommentsDocumentsErr || prevValues['CommentsDocumentsError'],
          ['ApprovingOfficerError']: ApprovingOfficerErr || prevValues['ApprovingOfficerError'],

        }
      })
      //  setErrors(prevValues => { return {...prevValues, ['GroupError']:  RequiredFieldIncident(value.ApprovingSupervisorID) } })
    }

    else {
      const ApprovalCommentsErr = RequiredFieldIncident(value.ApprovalComments);
      const CommentsDocumentsErr = RequiredFieldIncident(value.Comments?.trim());
      setErrors(prevValues => {
        return {
          ...prevValues,
          ['ApprovalCommentsError']: ApprovalCommentsErr || prevValues['ApprovalCommentsError'],
          ['CommentsDocumentsError']: CommentsDocumentsErr || prevValues['CommentsDocumentsError'],


        }
      })
      //  setErrors(prevValues => { return {...prevValues, ['ApprovingOfficerError']: 'true' } })
    }

  }


  const { ApprovalCommentsError, CommentsDocumentsError, ApprovingOfficerError } = errors



  useEffect(() => {
    if (value.IsApprovedForward || value.IsReview) {
      if (ApprovalCommentsError === 'true' && CommentsDocumentsError === 'true' && ApprovingOfficerError === 'true') {
        Add_Type()
        // reset();
        resetserror();
      }

    }
    else {
      if (ApprovalCommentsError === 'true' && CommentsDocumentsError === 'true') {
        Add_Type()
        // reset();
        resetserror();
      }
    }
  }, [ApprovalCommentsError, CommentsDocumentsError, ApprovingOfficerError])

  const resetserror = () => {
    setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', ['GroupError']: '' })


  }

  const handleRadioChangeArrestForward = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    // setValue({...value, ['ApprovingSupervisorID']: "", ['DocumentAccess_Name']: "" })
    setMultiSelected({ optionSelected: [] });
    setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', ['GroupError']: '' })
  };

  const Agencychange = (multiSelected) => {
    // setStatesChangeStatus(true)
    // setMultiSelected({optionSelected: multiSelected });
    setMultiSelected({ optionSelected: multiSelected });
    const id = []


    if (multiSelected) {
      multiSelected.map((item, i) => { id.push(item.value); })
      setValue({ ...value, ['ApprovingSupervisorID']: id.toString(), })
    }
  }

  const colourStylesUsers = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      backgroundColor: isDisabled ? '#d3d3d3' : '#fce9bf',
      fontSize: 14,
      marginTop: 2,
      boxShadow: 'none',
      cursor: isDisabled ? 'not-allowed' : 'default',
    }),
  };

  const GetData_ReportWorkLevelCheck = (loginAgencyID, narrativeID) => {
    const val = { AgencyID: loginAgencyID, NarrativeID: narrativeID };

    fetchPostData('IncidentNarrativeReport/GetData_ReportWorkLevelCheck', val).then(res => {
      if (res && res.length > 0) {
        console.log(res);

        const workflowData = res[0];
        const canShowApprovalButton = workflowData?.IsMultipleLevel;
        setcheckWebWorkFlowStatus(canShowApprovalButton);
        setapproverRequiredCount(workflowData?.ReportApproverRequired);
        // setIsSelfApproved(canApproved);
        // setLoder(true);
      } else {
        // Handle case where no data is returned
        // setNarrativeData([]);
        // setLoder(true);
      }
    });
  };


  if (!isDataReady) {
    return (
      <div className="custom-modal-wrapper d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  console.log(reportApprovalStatus);
  console.log(checkapproveStatus);

  const setApproverStatus = (level, ApproveStatus) => {
    if (ApproveStatus === "Single") {
      return true
      // return 'Approve'
    } else if (ApproveStatus === "Multi" && level === "0") {
      return true
      return 'Approve'
    } else if (ApproveStatus === "Multi" && level === "1") {
      return false
      return 'Approve' || 'Forward'
    }
  }

  console.log(checkWebWorkFlowStatus , Number(approverRequiredCount) , Number(appRequiredCountCurrentStatus))

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      {/* <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="QueueReportsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false"> */}
      {/* // <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}> */}
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content p-2 px-4 approvedReportsModal" style={{ minHeight: '500px', overflowY: "scroll " }}>
          <div className="d-flex justify-content-between">
            <div className='row mt-1 mb-2'>
              <div className='col-12'>
                <nav className='nav nav-tabs'>
                  <span
                    className={`nav-link nav-links mr-2 ${activeTab === 'ReportReview' ? 'active' : ''}`}


                    style={{ color: activeTab === 'ReportReview' ? 'blue' : 'Red' }}
                    aria-current="page"

                    onClick={() => setActiveTab('ReportReview')}
                  >
                    Report Review
                  </span>
                  |
                  <span
                    className={`nav-link nav-links ml-2 ${activeTab === 'History' ? 'active' : ''}`}


                    style={{ color: activeTab === 'History' ? 'blue' : 'Red' }}
                    aria-current="page"

                    onClick={() => setActiveTab('History')}
                  >
                    History
                  </span>
                </nav>
              </div>
            </div>
            <button className="btn-close b-none bg-transparent" onClick={() => { setActiveTab('ReportReview'); setModelStatus(false); resetserror() }} data-dismiss="modal">X</button>
          </div>
          {activeTab === 'History' && (
            <div className="mb-3 mt-4">

              <DataTable
                data={filteredData}
                columns={rejectColumns}
                dense
                highlightOnHover
                noHeader
                customStyles={tableCustomStyles}
                conditionalRowStyles={conditionalRowStyles}
                onRowClicked={setClickedRow}
                paginationPerPage={5}
                pagination
              />

            </div>
          )}

          {activeTab === 'ReportReview' && (
            <>
              {/* Report Info */}
              <div className="row mt-1 align-items-center gx-2 gy-2">
                <div className="col-auto px-0" style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>
                  <label className='label-name'>Incident #</label>
                </div>
                <div className='col-sm-2 col-12'>
                  <input type="text" className="form-control" value={value?.IncidentID} readOnly />
                </div>

                <div className="col-auto px-0" style={{ whiteSpace: 'nowrap', minWidth: '90px' }}>
                  <label className='label-name'>CAD Event #</label>
                </div>
                <div className='col-sm-2 col-12'>
                  <input type="text" className="form-control" value={value?.CADIncidentNumber} readOnly />
                </div>

                <div className="col-auto px-0 text-nowrap" style={{ whiteSpace: 'nowrap', minWidth: '116px' }}>
                  <label className='label-name'>Submitting Officer</label>
                </div>
                <div className='col-sm-2 col-12'>
                  <input type="text" className="form-control" value={value?.ReportedBy_Description} readOnly />
                </div>

                <div className="col-auto px-0" style={{ whiteSpace: 'nowrap', minWidth: '50px' }}>
                  <label className='label-name'>Seq #</label>
                </div>
                <div className='col-sm-2 col-12'>
                  <input type="text" className="form-control" value={value?.sequence} readOnly />
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">

                  {/* <Editor
                    editorState={editorState}
                    onEditorStateChange={handleEditorChange}
                    wrapperClassName="wrapper-class"
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                    onChange={getValueNarrative}
                    editorStyle={{ height: '35vh', }}
                    toolbar={{
                      options: ['inline', 'blockType', 'fontFamily', 'list', 'textAlign', 'history',],
                      inline: {
                        inDropdown: false,
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        options: ['bold', 'italic', 'underline', 'monospace',],
                      },
                      list: {
                        inDropdown: false,
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        options: ['unordered', 'ordered',],
                        // unordered: { icon: unordered, className: undefined },
                        // ordered: { icon: ordered, className: undefined },
                        // indent: { icon: indent, className: undefined },
                        // outdent: { icon: outdent, className: undefined },
                      },
                      textAlign: {
                        inDropdown: false,
                        className: undefined,
                        component: undefined,
                        dropdownClassName: undefined,
                        options: ['left', 'center', 'right', 'justify'],
                      },
                      colorPicker: {
                        icon: 'color',
                        className: undefined,
                        component: undefined,
                        popupClassName: undefined,
                        colors: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
                          'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
                          'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
                          'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
                          'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(209,72,65)',
                          'rgb(184,49,47)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
                      },
                    }}
                  /> */}
                  <ReactQuill
                    className={`editor-class ${reviewStatus === true ? 'readonly' : ''}`}

                    value={value.CommentsDoc}
                    onChange={(value, delta, source, editor) => {
                      const text = editor?.getText();
                      // console.log(text, "text");
                      // console.log(value, "value");
                      // setChangesStatus(true);
                      //  setStatesChangeStatus(true);

                      setValue((prevValue) => ({
                        ...prevValue,
                        Comments: text,
                        CommentsDoc: value,
                      }));

                    }}
                    modules={{
                      history: { delay: 200, maxStack: 500, userOnly: true },
                      toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'size': ['small', 'medium', 'large', 'huge'] }],  // Font 
                        // size options 
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
                        ['bold', 'italic', 'underline'],
                        // ['link', 'image'],
                        [{ 'color': [] }, { 'background': [] }],  // Text color and 
                        // background color 
                        ['blockquote'],
                        ['spell-checker'],  // spell checker
                        ['undo', 'redo'],
                      ],
                    }}
                    formats={['undo', 'redo', "header", "bold", "italic", "underline", "size", "background", "strike", 'align', "blockquote", 'list', "bullet", "indent", "code-block", "spell-checker", "color",
                      // "link", 
                      // "image", 
                    ]}
                    editorProps={{ spellCheck: true }}
                    theme="snow"
                    placeholder="Write something..."
                    style={{
                      minHeight: '200px',
                      maxHeight: '210px',
                      overflowY: 'auto',
                    }}
                  />
                  {/* <div className="raditer-mainQue">
                    <CKEditor
                      editor={ClassicEditor}
                      config={editorConfig}
                      onReady={editor => {
                        console.log('Editor is ready to use!', editor);
                      }}
                      data={value?.CommentsDoc || ''}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data, 'text/html');
                        const plainText = doc.body.textContent || '';
                        setValue(prevState => ({
                          ...prevState,
                          CommentsDoc: data,
                          Comments: plainText.trim()
                        }));
                      }}
                      className={`editor-class ck-editor__editable_inline ${reviewStatus === true ? 'readonly' : ''}`}
                      disabled={reviewStatus === true}
         

                      readOnly={reviewStatus === true}
                      // className="editor-class ck-editor__editable_inline"
                      placeholder="Write something..."
                    />
                    {errors.CommentsDocumentsError !== 'true' ? (
                      <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsDocumentsError}</p>
                    ) : null}
                  </div> */}
                </div>

              </div>

              <div className='row mt-1'>
                {
                  (reviewStatus === false || reviewStatus === 'false') && (
                    <>
                      <div className='col-md-2'>
                        {
                          !(checkWebWorkFlowStatus && (Number(appRequiredCountCurrentStatus) < Number(approverRequiredCount))) ?
                            < div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                value="Approve"
                                name="flexRadioDefault"
                                // id="Group"
                                checked={value.IsApprove}
                                onChange={handleRadioChange}
                              // checked={ === "Group"}
                              // onChange={}
                              />
                              <label className="form-check-label " >
                                Approve
                              </label>
                            </div>
                            :
                            <></>
                        }
                       

                          {/* < div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              value="Approve"
                              name="flexRadioDefault"
                              // id="Group"
                              checked={value.IsApprove}
                              onChange={handleRadioChange}
                            // checked={ === "Group"}
                            // onChange={}
                            />
                            <label className="form-check-label ">
                              Approve
                            </label>
                          </div> */}


                       
                      </div>
                      <div className='col-md-2'>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="Reject"
                            name="flexRadioDefault"
                            // id="Group"
                            checked={value.IsReject}
                            onChange={handleRadioChange}
                          // checked={ === "Group"}
                          // onChange={}
                          />
                          <label className="form-check-label ">
                            Reject
                          </label>
                        </div>
                      </div>

                      {/* <div className='col-md-2'>

                        {
                          ((!setApproverStatus(checkapproveStatus, reportApprovalStatus) && checkapproveStatus === "1") || checkWebWorkFlowStatus ||
                            (appRequiredCountCurrentStatus <= approverRequiredCount)) &&
                          < div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              value="ApproveAndForward"
                              name="flexRadioDefault"
                              // id="Group"
                              checked={value.IsApprovedForward}
                              onChange={handleRadioChange}
                            />
                            <label className="form-check-label ">
                              Approve and Forward
                            </label>
                          </div>
                        }

                      </div> */}
                       <div className='col-md-2'>

                        {
                          (checkWebWorkFlowStatus &&
                            (Number(appRequiredCountCurrentStatus) < Number(approverRequiredCount))) &&
                          < div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              value="ApproveAndForward"
                              name="flexRadioDefault"
                              // id="Group"
                              checked={value.IsApprovedForward}
                              onChange={handleRadioChange}
                            />
                            <label className="form-check-label ">
                              Approve and Forward
                            </label>
                          </div>
                        }

                      </div>
                    </>
                  )

                }

                <div className='col-md-2'>


                  < div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="ApproveAndReview"
                      name="flexRadioDefault"
                      // id="Group"
                      checked={value.IsReview}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label ">
                      Review
                    </label>
                  </div>


                </div>
              </div>


              <div className="row ">
                <div className="col-12 col-md-12 col-lg-12">
                  <div className="row ">
                    {(approvalStatus === 'ApproveAndForward' || approvalStatus === 'ApproveAndReview' && reviewStatus === false) && (
                      <>
                        <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                          <div className="form-check ml-2">
                            <input
                              type="radio"
                              name="approverType"
                              value="Individual"
                              className="form-check-input"
                              checked={selectedOption === "Individual"}
                              onChange={handleRadioChangeArrestForward}
                            />
                            <label className="form-check-label" htmlFor="Individual">
                              Individual
                            </label>
                          </div>
                        </div>
                        <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                          <div className="form-check ml-2">
                            <input
                              type="radio"
                              name="approverType"
                              value="Group"
                              className="form-check-input"
                              checked={selectedOption === "Group"}
                              onChange={handleRadioChangeArrestForward}
                            />
                            <label className="form-check-label" htmlFor="Group">
                              Group
                            </label>
                          </div>
                        </div>
                      </>
                    )}


                    {(approvalStatus?.trim() === "ApproveAndForward" || approvalStatus?.trim() === "ApproveAndReview" && reviewStatus === false) && (
                      <>
                        {selectedOption === "Individual" ? (
                          <>
                            <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                              <span className="label-name">
                                Report Approver
                                {errors.ApprovingOfficerError !== 'true' && (
                                  <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", fontWeight: "400" }}>
                                    {errors.ApprovingOfficerError}
                                  </p>
                                )}
                              </span>
                            </div>
                            <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                              <SelectBox
                                className="custom-multiselect"
                                classNamePrefix="custom"
                                options={reportApproveOfficer}
                                isMulti
                                required
                                menuPlacement="top"
                                styles={colourStylesUsers}
                                // isDisabled={value.Status === "Pending Review" || value.Status === "Approved"}
                                closeMenuOnSelect={false}
                                // menuPlacement="top"
                                // hideSelectedOptions={true}
                                onChange={Agencychange}
                                // allowSelectAll={true}
                                value={multiSelected.optionSelected}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                              <span className="label-name">
                                Approval Group
                                {errors.ApprovingOfficerError !== 'true' && (
                                  <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", fontWeight: "400" }}>
                                    {errors.ApprovingOfficerError}
                                  </p>
                                )}
                              </span>
                            </div>
                            <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                              <SelectBox
                                className="custom-multiselect"
                                classNamePrefix="custom"
                                options={groupList}
                                menuPlacement="top"
                                isMulti
                                styles={colourStylesUsers}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={true}
                                onChange={Agencychange}
                                // allowSelectAll={true}
                                value={multiSelected.optionSelected}
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Approve Section */}
              {(approvalStatus === 'Approve' || approvalStatus === 'ApproveAndForward' || approvalStatus === 'ApproveAndReview' && reviewStatus === false) && (
                <>
                  {/* <div className="mb-3 mt-4">
                <h6 className="fw-bold">Approve Report Comment</h6>
                <DataTable
                  data={approvedNarrativeData}
                  columns={approveColumns}
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
                    <div className="col-md-6">
                      <label className="fw-bold">Previous Comment</label>

                      <div className="form-control bg-light" style={{ minHeight: '56px' }}>
                        {value?.NarrativeReport_Comments}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Enter Approval Comments Here</label>
                      <textarea
                        className="form-control"
                        style={{ minHeight: '50px', background: '#fef6e4' }}
                        placeholder="Enter Approval Comments"
                        name="ApprovalComments"
                        value={value?.ApprovalComments}

                        onChange={(e) => { handleChange(e) }}
                      />
                      {errors.ApprovalCommentsError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', fontWeight: "400" }}>{errors.ApprovalCommentsError}</p>
                      ) : null}
                    </div>
                  </div>
                </>
              )}

              {/* Reject Section */}
              {approvalStatus === 'Reject' && (
                <>


                  <div className="row g-3 ">
                    <div className="col-md-6">
                      <label className="fw-bold">Previous Reason for Rejection</label>
                      <div className="form-control bg-light" style={{ minHeight: '56px' }}>
                        {clickedRow?.NarrativeReport_Comments}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Enter Reason for Rejection</label>
                      <textarea
                        className="form-control"
                        style={{ minHeight: '50px', background: '#fff3cd' }} // light yellow
                        placeholder="Enter Reason for Rejection"
                        name="ApprovalComments"
                        value={value.ApprovalComments}
                        onChange={(e) => { handleChange(e) }}
                      />
                      {errors.ApprovalCommentsError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px', fontWeight: "400" }}>{errors.ApprovalCommentsError}</p>
                      ) : null}
                    </div>
                  </div>
                </>
              )}


              {/* Radio Buttons */}

              {/* Buttons */}
              <div className="d-flex justify-content-end mt-4">
                {!isSaved && (
                  <button className="btn btn-primary " style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={(e) => { check_Validation_ErrorApproval(); }}>Save</button>
                )}
                {/* <button className="btn btn-secondary" onClick={() => setActiveTab('ReportReview')} data-dismiss="modal">Cancel</button> */}
                <button
                  type="button"
                  className="btn btn-sm btn-success ml-2 "
                  data-toggle="modal"
                  data-target="#CurrentIncidentReport"
                  onClick={() => {
                    setShowModal(true);
                    setIncMasterReport(true);
                    setIncReportCount(IncReportCount + 1);
                  }}
                >
                  Print <i className="fa fa-print"></i>
                </button>
              </div>

            </>
          )}


          <CurrentIncMasterReport
            incNumber={IncidentNo}
            {...{
              printIncReport,
              setIncMasterReport,
              showModal,
              setShowModal,
              IncReportCount,
              setIncReportCount,
            }}
          />
        </div>
      </div>

    </div >

  );
};


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
