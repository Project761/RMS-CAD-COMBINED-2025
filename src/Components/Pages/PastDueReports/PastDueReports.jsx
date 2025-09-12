import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { changeArrayFormat, changeArrayFormat_WithFilter, Decrypt_Id_Name, getShowingDateText, getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../Common/Utility';
import { useDispatch } from 'react-redux';
import { get_Report_Approve_Officer_Data, get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { get_LocalStoreData } from '../../../redux/actions/Agency';
import { toastifySuccess } from '../../Common/AlertMsg';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Link, useNavigate } from 'react-router-dom';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import { get_Narrative_Type_Drp_Data } from '../../../redux/actions/DropDownsData';
import SelectBox from '../../Common/SelectBox';

function PastDueReports() {
  const uniqueId = sessionStorage.getItem('UniqueUserID')
    ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
    : '';

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [clickedRow, setClickedRow] = useState(null);
  const [pastDueReportData, setpastDueReportData] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState();
  const [editval, setEditval] = useState([]);
  const [narrativeID, setNarrativeID] = useState();
  const [WrittenForID, setWrittenForID] = useState();


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
      get_Data_Past_Due_Report(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N046", localStoreData?.AgencyID, localStoreData?.PINID));

    }
  }, [localStoreData]);



  const columns = [
    {
      name: 'Review',
      cell: row => (
        // <button className="btn btn-sm btn-dark w-100">Review</button>
        <div className="text-start">
          <button
            type="button"
            className="btn btn-sm btn-dark w-100 mb-1"
            style={{ backgroundColor: "#001f3f", color: "#fff" }}
            data-toggle="modal" data-target="#PastDueReportsModal"
            onClick={() => {
              GetSingleData(row?.NarrativeID);
              setWrittenForID(row?.WrittenForID);
              setNarrativeID(row?.NarrativeID);
            }}

          >
            Review
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
    {
      name: '',
      selector: row => row.incident,
      sortable: true,
      wrap: true,
      wrap: true,
      grow: 0,
      maxWidth: '170px',
      minWidth: '50px',
      // cell: row => (
      //   <div className="text-start">
      //     <span className="btn btn-sm bg-green text-white px-1 py-0">
      //       <i className="fa fa-eye"></i>
      //     </span>
      //   </div>
      // ),
      cell: row => (
        <div style={{ position: 'absolute', top: 4, }}>
          {
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
          }
        </div>)
    },
    {
      name: 'Incident#',
      selector: row => row.IncidentNumber,
      sortable: true,
      wrap: true,
      grow: 0,

    },

    { name: 'Seq#', selector: row => row.sequence, sortable: true, wrap: true, grow: 0, maxWidth: '120px', minWidth: '100px', },

    {
      name: 'Report Type',
      selector: row => row.NarrativeDescription,
      sortable: true,
      cell: row => {
        const desc = row.NarrativeDescription?.toLowerCase();

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
            {row.NarrativeDescription}
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



    { name: 'Summitted By', selector: row => row.CreateOfficer, sortable: true },
    { name: 'Summitted Date/Time', selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true },
    { name: 'Approving Officer/Group', selector: row => row.Approve_Officer, sortable: true },

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

    { name: 'Opened By', selector: row => row.openedBy, sortable: true },

  ];

  const set_IncidentId = (row) => {
    if (row.IncidentID) {
      // dispatch({ type: Incident_ID, payload: row?.IncidentID });
      // dispatch({ type: Incident_Number, payload: row?.IncidentNumber });
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



  const get_Data_Past_Due_Report = (OfficerID) => {
    const val = { 'OfficerID': OfficerID }
    fetchPostData('IncidentNarrativeReport/GetData_NarrativePastDue', val).then((res) => {
      if (res) {

        setpastDueReportData(res);
        // setNameFilterData(res)
      } else {
        setpastDueReportData([]);
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
      } else {
        setEditval([]);
        //  setNameSingleData([]) 
      }
    })
  }

  const onMasterPropClose = () => {

    navigate('/dashboard-page');

  }

  return (
    <div className="section-body view_page_design pt-1 p-1 bt">
      <div className="col-12 col-sm-12 ">
        {/* <h5 className="fw-bold">Past Due Reports</h5> */}
        <div className="card Agency incident-cards">
          {/* <div className="text-end mt-3 d-flex mb-2" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h5 className="fw-bold ml-3">Overdue Reports</h5>
            <button className="btn btn-outline-dark mr-3" style={{ backgroundColor: "#001f3f", color: "#fff" }} onClick={onMasterPropClose}>
              Close
            </button>
          </div> */}
          <div className="card-body mb-2">
            <DataTable
              className='table-responsive_pastdue'
              data={pastDueReportData}
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
              // fixedHeaderScrollHeight="300px"
              paginationPerPage={100}
              paginationRowsPerPageOptions={[100, 150, 200, 500]}
              conditionalRowStyles={conditionalRowStyles}
              onRowClicked={setClickedRow}
            />

          </div>

        </div>

      </div>
      <PastDueReportsModal editval={editval} WrittenForID={WrittenForID} narrativeID={narrativeID} loginPinID={loginPinID} loginAgencyID={loginAgencyID} />
    </div>
  );
}

export default PastDueReports;








const PastDueReportsModal = (props) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uniqueId = sessionStorage.getItem('UniqueUserID')
    ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID')
    : '';

  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
  const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

  const { editval, narrativeID, loginAgencyID, loginPinID, WrittenForID } = props

  const [clickedRow, setClickedRow] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('Approve');
  const [commentInput, setCommentInput] = useState('');
  const [narrativeData, setnarrativeData] = useState([]);
  const [activeTab, setActiveTab] = useState('ReportReview');
  const [isSaved, setIsSaved] = useState(false);
  const [incidentID, setIncidentID] = useState('');
  const [reportedPinActivity, setreportedPinActivity] = useState(false);
  const [narrativeTypeId, setnarrativeTypeId] = useState(false);
  const [AsOfDate, setAsOfDate] = useState('');
  const [selectedOption, setSelectedOption] = useState("Individual");
  const [groupList, setGroupList] = useState([]);
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );


  const [value, setValue] = useState({
    'NameIDNumber': 'Auto Generated', 'NameTypeID': '', 'BusinessTypeID': '', 'SuffixID': '', 'VerifyID': '', 'SexID': '',
    'IsApprove': true, 'IsReject': false, 'CommentsDoc': '', 'Comments': '', 'ApprovalComments': '', 'IsApprovedForward': '',
    'WrittenID': ''
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
    { name: 'Rejected By', selector: row => row.rejectedBy, sortable: true },
    { name: 'Reason For Rejection', selector: row => row.reason, sortable: true },
    { name: 'Date Of Rejection', selector: row => row.date, sortable: true },
  ];

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
    if (loginAgencyID) {
      // dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
      // Get_WrittenForDataDrp(loginAgencyID, IncID);
      dispatch(get_Report_Approve_Officer_Data(loginAgencyID));
      if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(loginAgencyID)) }
      get_Group_List(loginAgencyID);
      // get_IncidentTab_Count(IncID, loginPinID);
    }
  }, [loginAgencyID])

  const get_Group_List = (loginAgencyID) => {
    const value = { AgencyId: loginAgencyID, PINID: loginPinID }
    fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
      if (res) {
        setGroupList(changeArrayFormat(res, 'group'))
        if (res[0]?.GroupID) {
          setValue({
            ...value,
            ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
            // 'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
            // 'WrittenForID': checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
            'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
          });
        }
      }
      else {
        setGroupList();
      }
    })
  }

  const handleRadioChangeArrestForward = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    // setValue({ ...value, ['ApprovingSupervisorID']: "", ['DocumentAccess_Name']: "" })
    // setMultiSelected({ optionSelected: [] });
    setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', ['GroupError']: '' })
  };

  const Agencychange = (multiSelected) => {
    // setStatesChangeStatus(true)
    // setMultiSelected({ optionSelected: multiSelected });
    const id = []
    const name = []
    if (multiSelected) {
      multiSelected.map((item, i) => { id.push(item.value); name.push(item.label) })
      setValue({ ...value, ['ApprovingSupervisorID']: id.toString(), ['DocumentAccess_Name']: name.toString() })
    }
  }


  useEffect(() => {
    if (editval) {
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
      })
      setIsSaved(false);
      if (editval[0]?.CommentsDoc?.trim()) {
        setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft(editval[0]?.CommentsDoc ? editval[0].CommentsDoc?.trim() : <p></p>))));
      }
      setIncidentID(editval[0]?.IncidentID)
      setnarrativeTypeId(editval[0]?.NarrativeTypeID)
      setreportedPinActivity(editval[0]?.ReportedByPINActivityID)
      setAsOfDate(editval[0]?.AsOfDate ? getShowingDateText(editval[0]?.AsOfDate) : '');
    }
    else {

      setValue({
        ...value,
        'IncidentID': '',
        'CADIncidentNumber': '',
        'ReportedBy_Description': '',
        'Comments': '',
        'sequence': '',

      });
    }
  }, [editval])



  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   if (event) {
  //     setValue((prevState) => ({ ...prevState, [name]: value, }));
  //   }
  //   else {
  //     setValue((prevState) => ({ ...prevState, [name]: null, }));
  //   }
  // };

  useEffect(() => {
    get_Data_Narrative(narrativeID)
  }, [narrativeID])

  const get_Data_Narrative = (NarrativeID) => {
    const val = { 'NarrativeID': NarrativeID }
    fetchPostData('IncidentNarrativeReport/GetData_Narrative', val).then((res) => {
      if (res) {

        setnarrativeData(res)
        // setpastDueReportData(res);
        // setNameFilterData(res)
      } else {
        // setpastDueReportData([]);
        setnarrativeData([]);
        // setNameFilterData([])
      }
    })
  }


  const Add_Type = () => {
    const { IsApprove, IsReject, Comments, CommentsDoc, AsOfDate } = value
    const val = {
      'AgencyID': loginAgencyID,
      'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '', 'IsApprove': value.IsApprove === undefined && value.IsReject === undefined ? true : value.IsApprove, 'IsReject': IsApprove === undefined && IsReject === undefined ? false : IsReject, 'Comments': Comments,
      'CommentsDoc': CommentsDoc,
      'AsOfDate': AsOfDate, 'WrittenForID': value?.WrittenID,
      "ReportedByPINActivityID": reportedPinActivity,
      "NarrativeTypeID": narrativeTypeId,
      'ModifiedByUserFK': loginPinID,
    };
    AddDeleteUpadate('Narrative/Update_Narrative', val).then((res) => {

      Add_Type_Comments()

      // setChangesStatus(false);
      get_Data_Narrative(narrativeID)

      // setModal(false)
      const parseData = JSON.parse(res.data);
      toastifySuccess(parseData?.Table[0].Message);
      // setStatesChangeStatus(false);
      setIsSaved(true);
      reset();
      navigate('/dashboard-page');
    })
  }

  const Add_Type_Comments = () => {
    const { IsApprove, IsReject, Comments, CommentsDoc, ApprovalComments, ApprovingSupervisorID, IsApprovedForward } = value
    const type = selectedOption === "Individual" ? 'Individual' : 'Group';
    const val = {
      'AgencyID': loginAgencyID,
      'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprovedForward': IsApprovedForward, 'IsApprove': (value.IsApprove === undefined && value.IsReject === undefined) || IsApprovedForward ? true : value.IsApprove, 'CreatedByUserFK': loginPinID, 'IsReject': IsApprove === undefined && IsReject === undefined ? false : IsReject, 'Comments': ApprovalComments,

    };
    AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val).then((res) => {
      // setChangesStatus(false);
      // get_Data_Narrative(narrativeID)
      // get_Name_Count(DecNameID, DecMasterNameID, MstPage === "MST-Name-Dash" ? true : false);
      // setModal(false)

      const parseData = JSON.parse(res.data);
      // toastifySuccess(parseData?.Table[0].Message);
      // setStatesChangeStatus(false);
      // setIsSaved(true);
      // setModelStatus(true);
      resets();
    })
  }

  const reset = () => {
    setValue({
      ...value,
      'Comments': '',
    });
  }

  const resets = () => {
    setValue({
      ...value,
      'ApprovalComments': '',
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

    if (value.IsApprovedForward) {
      const ApprovalCommentsErr = RequiredFieldIncident(value?.ApprovalComments);
      const CommentsDocumentsErr = RequiredFieldIncident(value.Comments?.trim());
      const ApprovingOfficerErr = RequiredFieldIncident(value.ApprovingSupervisorID);

      // setErrors(prevValues => { return { ...prevValues, ['ApprovalCommentsError']: RequiredFieldIncident(value.ApprovalComments) } })
      // setErrors(prevValues => { return { ...prevValues, ['CommentsDocumentsError']: RequiredFieldIncident(value.Comments?.trim()) } })
      // setErrors(prevValues => { return { ...prevValues, ['ApprovingOfficerError']: RequiredFieldIncident(value.ApprovingSupervisorID) } })
      setErrors(prevValues => {
        return {
          ...prevValues,
          ['ApprovalCommentsError']: ApprovalCommentsErr || prevValues['ApprovalCommentsError'],
          ['CommentsDocumentsError']: CommentsDocumentsErr || prevValues['CommentsDocumentsError'],
          ['ApprovingOfficerError']: ApprovingOfficerErr || prevValues['ApprovingOfficerError'],

        }
      })
      //  setErrors(prevValues => { return { ...prevValues, ['GroupError']:  RequiredFieldIncident(value.ApprovingSupervisorID) } })
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
      //  setErrors(prevValues => { return { ...prevValues, ['ApprovingOfficerError']: 'true' } })
    }

  }


  const { ApprovalCommentsError, CommentsDocumentsError, ApprovingOfficerError } = errors



  useEffect(() => {
    if (value.IsApprovedForward) {
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
    setErrors({ ...errors, ['ApprovalCommentsError']: '', ['CommentsDocumentsError']: '', ['ApprovingOfficerError']: '', })
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

  return (

    <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="PastDueReportsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content p-2 px-4 approvedReportsModal" style={{ minHeight: '610px' }}>
          <div className="d-flex justify-content-between">
            <div className='row mt-1 mb-2'>
              <div className='col-12'>
                <nav className='nav nav-tabs'>
                  <span
                    className={`nav-link nav-links mr-2 ${activeTab === 'ReportReview' ? 'active' : ''}`}
                    // to={`/Name-Home?IncId=${IncID}WVX?OffId=${''}WVX?NameID=${NameID}WVX?MasterNameID=${MasterNameID}`}

                    style={{ color: activeTab === 'ReportReview' ? 'blue' : 'Red' }}
                    aria-current="page"

                    onClick={() => setActiveTab('ReportReview')}
                  >
                    Report Review
                  </span>
                  |
                  <span
                    className={`nav-link nav-links ml-2 ${activeTab === 'History' ? 'active' : ''}`}
                    // to={`/Name-Home?IncId=${IncID}WVX?OffId=${''}WVX?NameID=${NameID}WVX?MasterNameID=${MasterNameID}`}

                    style={{ color: activeTab === 'History' ? 'blue' : 'Red' }}
                    aria-current="page"

                    onClick={() => setActiveTab('History')}
                  >
                    History
                  </span>
                </nav>
              </div>
            </div>
            <button className="btn-close b-none bg-transparent" onClick={() => { setActiveTab('ReportReview'); resetserror() }} data-dismiss="modal">X</button>
          </div>



          {/* <div className='row mt-1'>
                <div className='col-12 col-md-12 col-lg-12'>
                  <nav className='nav nav-tabs'>
                    <button
                      className={`nav-link ${activeTab === 'Approve' ? 'active' : ''}`}
                      onClick={() => setActiveTab('Approve')}
                    >
                      History
                    </button>
                  </nav>
                </div>
              </div> */}

          {activeTab === 'History' && (


            <div className="mb-3 mt-4">

              <DataTable
                // data={approvalStatus === 'Approve' ? approvedNarrativeData : rejectedNarrativeData}
                columns={approvalStatus === 'Approve' ? approveColumns : rejectColumns}
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

                <div className="col-auto px-0" style={{ whiteSpace: 'nowrap', minWidth: '80px' }}>
                  <label className='label-name'>Seq #</label>
                </div>
                <div className='col-sm-2 col-12'>
                  <input type="text" className="form-control" value={value?.sequence} readOnly />
                </div>
              </div>

              <div className="row mt-1">
                <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">
                  <Editor
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
                  />
                  {errors.CommentsDocumentsError !== 'true' ? (
                    <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsDocumentsError}</p>
                  ) : null}
                </div>
              </div>


              <div className='row mt-1'>
                <div className='col-md-2'>
                  <div className="form-check">
                    <input
                      type="radio"
                      value="Approve"
                      className="form-check-input"
                      checked={value.IsApprove}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label" htmlFor="approve">
                      Approve
                    </label>

                  </div>
                </div>
                <div className='col-md-2'>
                  <div className="form-check">
                    <input
                      type="radio"
                      value="Reject"
                      className="form-check-input"
                      checked={value.IsReject}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label" htmlFor="reject">
                      Reject
                    </label>

                  </div>
                </div>

                <div className='col-md-2'>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="ApproveAndForward"
                      name="flexRadioDefault"
                      id="Group"
                      checked={value.IsApprovedForward}
                      onChange={handleRadioChange}
                    />
                    <label className="form-check-label " htmlFor="Group">
                      Approve and Forward
                    </label>
                  </div>
                </div>
              </div>




              <div className="row ">
                <div className="col-12 col-md-12 col-lg-12">
                  <div className="row ">
                    {approvalStatus === 'ApproveAndForward' && (
                      <>
                        <div className="col-6 col-md-6 col-lg-3 mt-2 pt-1">
                          <div className="form-check ml-2">
                            <input
                              type="radio"
                              name="approverType"
                              value="Individual"
                              checked={selectedOption === "Individual"}
                              className="form-check-input"

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

                              checked={selectedOption === "Group"}
                              className="form-check-input"
                              onChange={handleRadioChangeArrestForward}
                            />
                            <label className="form-check-label" htmlFor="Group">
                              Group
                            </label>
                          </div>
                        </div>
                      </>
                    )}


                    {approvalStatus?.trim() === "ApproveAndForward" && (
                      <>
                        {selectedOption === "Individual" ? (
                          <>
                            <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                              <span className="label-name">
                                Report Approver
                                {errors.ApprovingOfficerError !== 'true' && (
                                  <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px" }}>
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
                                styles={colourStylesUsers}
                                // isDisabled={value.Status === "Pending Review" || value.Status === "Approved"}
                                closeMenuOnSelect={false}
                                // hideSelectedOptions={true}
                                onChange={Agencychange}
                              // allowSelectAll={true}
                              // value={multiSelected.optionSelected}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                              <span className="label-name">
                                Approval Group
                                {errors.ApprovingOfficerError !== 'true' && (
                                  <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px" }}>
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
                                isMulti
                                styles={colourStylesUsers}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={true}
                                onChange={Agencychange}
                              // allowSelectAll={true}
                              // value={multiSelected.optionSelected}
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
              {(approvalStatus === 'Approve' || approvalStatus === 'ApproveAndForward') && (
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
                      <label className="fw-bold">Enter Approval Comments Here{errors.ApprovalCommentsError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalCommentsError}</p>
                      ) : null}</label>
                      <textarea
                        className="form-control"
                        style={{ minHeight: '50px', background: '#fef6e4' }}
                        placeholder="Enter Approval Comments"
                        name="ApprovalComments"
                        value={value.ApprovalComments}

                        onChange={(e) => { handleChange(e) }}
                      />
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
                        {value?.NarrativeReport_Comments}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-bold">Enter Reason for Rejection{errors.ApprovalCommentsError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovalCommentsError}</p>
                      ) : null}</label>
                      <textarea
                        className="form-control"
                        style={{ minHeight: '50px', background: '#fff3cd' }} // light yellow
                        placeholder="Enter Reason for Rejection"
                        name="ApprovalComments"
                        value={value.ApprovalComments}

                        onChange={(e) => { handleChange(e) }}
                      />
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
              </div>

            </>
          )}



        </div>
      </div>

    </div >
    // <div className="modal fade" id="PastDueReportsModal" tabIndex="-1" aria-hidden="true" style={{ background: "rgba(0,0,0, 0.5)" }}>
    //   <div className="modal-dialog modal-xl modal-dialog-centered py-5">
    //     <div className="modal-content p-4 approvedReportsModal">
    //       <div className="d-flex justify-content-between mb-3">
    //         <h5 className="fw-bold">Report Review</h5>
    //         <button className="btn-close" data-dismiss="modal">X</button>
    //       </div>

    //       {/* Radio Buttons */}
    //       <div className='row'>
    //         <div className='col-md-2'>
    //           <label className="me-4">
    //             <input
    //               type="radio"
    //               value="Approve"
    //               checked={value.IsApprove}
    //               onChange={handleRadioChange}
    //             />
    //             Approve
    //           </label>
    //         </div>
    //         <div className='col-md-2'>
    //           <label>
    //             <input
    //               type="radio"
    //               value="Reject"
    //               checked={value.IsReject}
    //               onChange={handleRadioChange}
    //             />
    //             Reject
    //           </label>
    //         </div>
    //       </div>

    //       {/* Report Info */}
    //       <div className="row mt-3 align-items-center">
    //         <div className="col-md-2">
    //           <label className='label-name'>Incident #</label>
    //         </div>
    //         <div className='col-md-4'>
    //           <input type="text" className="form-control" value={value?.IncidentID} readOnly />
    //         </div>
    //         <div className="col-md-2">
    //           <label className='label-name'>CAD Event #</label>
    //         </div>
    //         <div className='col-md-4'>
    //           <input type="text" className="form-control" value={value?.CADIncidentNumber} readOnly />
    //         </div>
    //         <div className="col-md-2 mt-3">
    //           <label className='label-name'>Submitting Officer</label>
    //         </div>
    //         <div className='col-md-4 mt-3'>
    //           <input type="text" className="form-control" value={value?.ReportedBy_Description} readOnly />
    //         </div>
    //         <div className="col-md-2 mt-3">
    //           <label className='label-name'>Seq #</label>
    //         </div>
    //         <div className='col-md-4 mt-3'>
    //           <input type="text" className="form-control" value={value?.sequence} readOnly />
    //         </div>
    //         <div className="col-md-2 mt-3">
    //           <label className='label-name'>Report Name</label>
    //         </div>
    //         <div className='col-md-10 mt-3'>
    //           <input type="text" className="form-control" value={value?.ReportName} readOnly />
    //         </div>
    //       </div>

    //       {/* Approve Section */}
    //       {approvalStatus === 'Approve' && (
    //         <>
    //           <div className="mb-3 mt-4">
    //             <h6 className="fw-bold">Approve Report Comment</h6>
    //             <DataTable
    //               data={narrativeData}
    //               columns={approveColumns}
    //               dense
    //               highlightOnHover
    //               noHeader
    //               customStyles={tableCustomStyles}
    //               conditionalRowStyles={conditionalRowStyles}
    //               onRowClicked={setClickedRow}
    //               paginationPerPage={5}
    //               pagination
    //             />
    //           </div>

    //           <div className="row g-3 mt-3">
    //             <div className="col-md-6">
    //               <label className="fw-bold">Previous Approval Comments</label>
    //               <div className="form-control bg-light" style={{ minHeight: '80px' }}>
    //                 {clickedRow?.approvalComment}
    //               </div>
    //             </div>
    //             <div className="col-md-6">
    //               <label className="fw-bold">Enter Approval Comments Here</label>
    //               <textarea
    //                 className="form-control"
    //                 style={{ minHeight: '80px', background: '#fef6e4' }}
    //                 placeholder="Enter Approval Comments"
    //                 name="Comments"
    //                 value={value.Comments}

    //                 onChange={(e) => { handleChange(e) }}
    //               />
    //             </div>
    //           </div>
    //         </>
    //       )}

    //       {/* Reject Section */}
    //       {approvalStatus === 'Reject' && (
    //         <>
    //           <div className="mb-3 mt-4">
    //             <h6 className="fw-bold">Reject Report Comment</h6>
    //             <DataTable
    //               data={reportsData.map(row => ({
    //                 rejectedBy: row.approvedBy,
    //                 reason: row.approvalComment,
    //                 date: row.date,
    //               }))}
    //               columns={rejectColumns}
    //               dense
    //               highlightOnHover
    //               noHeader
    //               customStyles={tableCustomStyles}
    //               conditionalRowStyles={conditionalRowStyles}
    //               onRowClicked={setClickedRow}
    //               paginationPerPage={5}
    //               pagination
    //             />
    //           </div>

    //           <div className="row g-3 mt-3">
    //             <div className="col-md-6">
    //               <label className="fw-bold">Previous Reason for Rejection</label>
    //               <div className="form-control bg-light" style={{ minHeight: '80px' }}>
    //                 {clickedRow?.approvalComment || 'Not Good'}
    //               </div>
    //             </div>
    //             <div className="col-md-6">
    //               <label className="fw-bold">Enter Reason for Rejection</label>
    //               <textarea
    //                 className="form-control"
    //                 style={{ minHeight: '80px', background: '#fff3cd' }} // light yellow
    //                 placeholder="Enter Reason for Rejection"
    //                 name="Comments"
    //                 value={value.Comments}

    //                 onChange={(e) => { handleChange(e) }}
    //               />
    //             </div>
    //           </div>
    //         </>
    //       )}

    //       {/* Buttons */}
    //       <div className="d-flex justify-content-end mt-4">
    //         <button className="btn btn-primary mr-2" onClick={(e) => Add_Type()}>Ok</button>
    //         <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};




