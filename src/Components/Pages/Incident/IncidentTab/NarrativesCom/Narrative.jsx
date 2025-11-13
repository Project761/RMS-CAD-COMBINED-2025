import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Decrypt_Id_Name, Requiredcolour, base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, editorConfig, filterPassedDateTimeZone, getShowingDateText, getShowingMonthDateYear, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision, fetchPostDataNew } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import Select from "react-select";
import DatePicker from 'react-datepicker';
import { changeArrayFormat_Active_InActive } from '../../../../Common/ChangeArrayFormat';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_AgencyOfficer_Data, get_Report_Approve_Officer_Data } from '../../../../../redux/actions/IncidentAction';
import { get_Narrative_Type_Drp_Data } from '../../../../../redux/actions/DropDownsData';
import ChangesModal from '../../../../Common/ChangesModal';
import SelectBox from '../../../../Common/SelectBox';

// ckeditor 5
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import { ClassicEditor } from 'ckeditor5';
import CurrentIncMasterReport from '../CurrentIncMasterReport';
import ReactQuill from 'react-quill';
import { matchIncidentWords } from '../../../../../CADUtils/functions/redactFind';
import { isEmptyCheck } from '../../../../../CADUtils/functions/common';
import { OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';


const Narrative = (props) => {

  const navigate = useNavigate();
  const { incidentReportedDate, isPreviewNormalReport } = props
  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  var NarrativeAssignId = query?.get("narrativeAssignId");
  var IncNo = query?.get("IncNo");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));
  if (!NarrativeAssignId) NarrativeAssignId = 0;
  else NarrativeAssignId = parseInt(base64ToString(NarrativeAssignId));

  const tabParam = query.get("tab");
  const assigned = query.get("Assigned");

  const dispatch = useDispatch()
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state?.Agency?.localStoreData);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const agencyOfficerFullNameDrpData = useSelector((state) => state.DropDown.agencyOfficerFullNameDrpData);
  const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
  const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

  const { get_IncidentTab_Count, changesStatus, setChangesStatus, nibrsStatus, GetDataTimeZone, datezone, setassignedReportID } = useContext(AgencyContext);

  const [narrativeData, setNarrativeData] = useState([]);
  const [upDateCount, setUpDateCount] = useState(0);
  const [status, setStatus] = useState(false);
  const [narrativeID, setNarrativeID] = useState('');
  const [loder, setLoder] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [incidentID, setIncidentID] = useState('');
  const [loginPinID, setLoginPinID] = useState();
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Individual");
  const [multiSelected, setMultiSelected] = useState({ optionSelected: null })
  const [narrativeAssignId, setnarrativeAssignId] = useState(false);
  const [showModalAssign, setshowModal] = useState(false);
  const [narrativeInformation, setNarrativeInformation] = useState('');
  const [editval, setEditval] = useState();
  const [LastComments, SetLastComments] = useState([]);
  const [WrittenForDataDrp, setWrittenForDataDrp] = useState([]);
  const [IsSupervisor, setIsSupervisor] = useState(false);
  const [IsSuperadmin, setIsSuperadmin] = useState(false);
  const [narrativeTypeCode, setnarrativeTypeCode] = useState('');
  const [primaryOfficer, setprimaryOfficer] = useState('');
  const [showModal, setShowModal] = useState(false);
  // ucr reportdata
  const [printIncReport, setIncMasterReport] = useState(false);
  const [IncReportCount, setIncReportCount] = useState(1);

  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();
  const [isUpdated, setIsUpdated] = useState(false);
  const [redactingData, setRedactingData] = useState({});
  const [detectedWords, setDetectedWords] = useState([]);
  const [missingField, setMissingField] = useState({});
  const [isNormalReport, setNormalReport] = useState(true);
  const [redactedComment, setRedactedComment] = useState("");
  const [checkWebWorkFlowStatus, setcheckWebWorkFlowStatus] = useState(false);
  const [IsSelfApproved, setIsSelfApproved] = useState(false);
  const detectedWordsRef = useRef([]);
  const [value, setValue] = useState({
    'IncidentId': '', 'NarrativeID': '', 'ReportedByPINActivityID': null, 'NarrativeTypeID': null, 'AsOfDate': null,
    'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'ApprovingSupervisorID': '', 'NarrativeAssignedID': '', 'WrittenForID': '',
    'Comments': '', 'CommentsDoc': '',
  })

  const [errors, setErrors] = useState({
    'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', 'WrittenForIDError': '',
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(parseInt(localStoreData?.PINID));
      getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID); GetDataTimeZone(localStoreData?.AgencyID); setnarrativeAssignId(NarrativeAssignId); get_NarrativesData(IncID, localStoreData?.PINID);
      GetData_ReportWorkLevelCheck(localStoreData?.AgencyID, narrativeID);
      setIsSupervisor(localStoreData?.IsSupervisor); get_IncidentTab_Count(IncID, localStoreData?.PINID); setIsSuperadmin(localStoreData?.IsSuperadmin);
      if (NarrativeAssignId && tabParam && !assigned) { setNarrativeID(NarrativeAssignId); GetSingleData(NarrativeAssignId); }
      else if (NarrativeAssignId && tabParam && assigned) {
        GetSingleDataOfficers(NarrativeAssignId);
      }
    }
  }, [localStoreData, IncID]);


  console.log(narrativeID)
  const checkId = (id, obj) => {
    const status = obj?.filter((item) => item?.value == id)
    return status?.length > 0
  }

  const checkWrittenId = async (id, obj) => {
    const status = await obj?.filter((item) => item?.value == id)
    return status?.length > 0
  }

  useEffect(() => {
    if (IncID) {
      setIncidentID(IncID); get_NarrativesInformation(IncID);
    }
  }, [IncID,]);

  useEffect(() => {
    console.log('hello-0')
    if (loginAgencyID) {
      dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
      Get_WrittenForDataDrp(loginAgencyID, IncID);
      Get_AgencyWiseRedactingReport(loginAgencyID, IncID);
      dispatch(get_Report_Approve_Officer_Data(loginAgencyID, loginPinID, narrativeID));
      if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(loginAgencyID)) }
      get_Group_List(loginAgencyID, loginPinID, narrativeID); get_IncidentTab_Count(IncID, loginPinID);
    }
  }, [loginAgencyID])

  const GetSingleData = (NarrativeID) => {
    const val = { 'NarrativeID': NarrativeID }
    fetchPostData('Narrative/GetSingleData_Narrative', val)
      .then((res) => {
        const setChargeCode = res[0]?.LastComments;
        SetLastComments(setChargeCode);
        if (res) {
          setEditval(res);
          setStatus(true)
        }
        else { setEditval() }
      })
  }

  const Get_WrittenForDataDrp = async (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    await fetchPostData('Narrative/GetData_WrittenForOfficer', val).then((data) => {
      console.log("🚀 ~ Get_WrittenForDataDrp ~ data:", data)
      if (data) {
        setWrittenForDataDrp(changeArrayFormat_Active_InActive(data, 'PINID', 'FullName', 'IsActive'));
      } else {
        setWrittenForDataDrp([]);
      }
    })
  }
  const Get_AgencyWiseRedactingReport = async (loginAgencyID, IncID) => {
    const val = { AgencyID: loginAgencyID, IncidentID: IncID }
    await fetchPostDataNew('CAD/RedactingofReports/GetAgencyWiseRedactingReport', val).then((data) => {
      if (data.length > 0) {
        setRedactingData(JSON.parse(data));
      } else {
        setRedactingData([]);
      }
    })
  }


  useEffect(() => {
    if (narrativeTypeCode.toLowerCase() === 'ni') {
      setValue({ ...value, 'WrittenForID': primaryOfficer, });
    }
  }, [WrittenForDataDrp])


  const GetSingleDataOfficers = (assignedReportID) => {
    const val = { 'NarrativeAssignedID': assignedReportID }
    fetchPostData('IncidentNarrativeAssigned/GetSingleData_IncidentNarrativeAssigned', val)
      .then((res) => {
        if (res) {
          setEditval(res);
          setStatus(true)
        }
        else {
          setEditval()
        }
      })
  }

  const GetEditData = (incidentID) => {
    const val = { IncidentID: incidentID };
    fetchPostData("Incident/GetSingleData_Incident", val).then((res) => {
      if (res?.length > 0) {
        const primaryOfficerID = res[0]?.PrimaryOfficerID;
        setprimaryOfficer(primaryOfficerID);
      }
    });
  };

  useEffect(() => {
    if (IncID) {
      GetEditData(IncID);
    }
  }, [IncID, localStoreData]);

  useEffect(() => {
    if (editval?.length > 0) {

      const accessIDs = editval[0]?.ApprovingSupervisorID1?.split(',').map(id => parseInt(id));
      setValue({
        ...value,
        'AsOfDate': editval[0]?.AsOfDate || editval[0]?.CreatedDtTm ? getShowingDateText(editval[0]?.AsOfDate || editval[0]?.CreatedDtTm) : null,
        'NarrativeID': editval[0]?.NarrativeID, 'NarrativeTypeID': editval[0]?.NarrativeTypeID,
        'ReportedByPINActivityID': NarrativeAssignId && tabParam && assigned && !narrativeID ? loginPinID : editval[0]?.ReportedByPINActivityID,
        'WrittenForID': NarrativeAssignId && tabParam && assigned ? (checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : loginPinID) : (narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : editval[0]?.WrittenForID),
        'ApprovingSupervisorID': editval[0]?.ApprovingSupervisorID1, 'Status': editval[0]?.Status, 'ModifiedByUserFK': loginPinID,
        'Comments': editval[0]?.Comments ? editval[0].Comments?.trim() : '', 'CommentsDoc': editval[0]?.CommentsDoc,
      });
      const initialSelectedOptions = (editval[0]?.ApprovingSupervisorType === 'Group' ? groupList : reportApproveOfficer)
        .filter(option => accessIDs?.includes(option.value));
      setMultiSelected({ optionSelected: initialSelectedOptions });
      setSelectedOption(editval[0]?.ApprovingSupervisorType ? editval[0]?.ApprovingSupervisorType : "Individual");
      setIsUpdated(true)
      setRedactedComment(editval[0]?.RedactedComment)
    } else {
      setValue({
        ...value,
        'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerFullNameDrpData) ? loginPinID : loginPinID,
        'WrittenForID': narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : loginPinID,
      });
      setRedactedComment("")
    }
  }, [editval, groupList, reportApproveOfficer, primaryOfficer])


  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      // reset()
      setShowModal(false)
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setValue({ ...value, [name]: e.value });
    } else {
      setValue({ ...value, [name]: null });
    }
  }

  const ChangeDropDownReportType = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
    if (e) {
      setnarrativeTypeCode(e.type);
      setValue({ ...value, [name]: e.value });
      Get_WrittenForDataDrp(loginAgencyID, IncID);
    } else {
      setnarrativeTypeCode('');
      setValue({ ...value, [name]: null });

    }
  }

  const check_Validation_Error = () => {
    const ReportedByPinErr = RequiredFieldIncident(value.ReportedByPINActivityID)
    const AsOfDateErr = RequiredFieldIncident(value.AsOfDate)
    const NarrativeIDErr = RequiredFieldIncident(value.NarrativeTypeID)
    const CommentsErr = RequiredFieldIncident(value.Comments?.trim())
    const WrittenForIDErr = RequiredFieldIncident(value.WrittenForID)

    setErrors((prevValues) => {
      return {
        ...prevValues,
        ["ReportedByPinError"]: ReportedByPinErr || prevValues["ReportedByPinError"],
        ["AsOfDateError"]: AsOfDateErr || prevValues["AsOfDateError"],
        ["NarrativeIDError"]: NarrativeIDErr || prevValues["NarrativeIDError"],
        ["CommentsError"]: CommentsErr || prevValues["CommentsError"],
        ["WrittenForIDError"]: WrittenForIDErr || prevValues["WrittenForIDError"],
      };
    });
  }

  // Check All Field Format is True Then Submit 
  const { ReportedByPinError, AsOfDateError, NarrativeIDError, CommentsError, WrittenForIDError } = errors

  useEffect(() => {
    if (ReportedByPinError === 'true' && AsOfDateError === 'true' && NarrativeIDError === 'true' && CommentsError === 'true' && WrittenForIDError === 'true') {
      if (narrativeID && !(NarrativeAssignId && tabParam && assigned) || narrativeID) { updateNarrative() }
      else { submit() }
    }
  }, [ReportedByPinError, AsOfDateError, NarrativeIDError, CommentsError, WrittenForIDError])



  const submit = () => {
    const result = narrativeData?.find(item =>
      item.Comments && value.Comments &&
      item.Comments.toLowerCase() === value.Comments.toLowerCase()
    );
    let resultType = [];
    if (narrativeTypeCode?.toLowerCase() === 'ni') {
      resultType = narrativeData?.filter(item =>
        item.NarrativeTypeCode?.toLowerCase() === 'ni') || [];
    }
    let hasError = false;

    if (result) {
      toastifyError('Comments Already Exists');
      setErrors(prev => ({ ...prev, AsOfDateError: '' }));
      hasError = true;
    }
    if (resultType.length > 0) {
      toastifyError('Report type already exists');
      setErrors(prev => ({ ...prev, AsOfDateError: '' }));
      hasError = true;
    }
    if (hasError) return;
    const {
      CommentsDoc, NarrativeID, Comments, ReportedByPINActivityID, NarrativeTypeID, AsOfDate, WrittenForID
    } = value;
    const val = {
      CommentsDoc, Comments, IncidentId: IncID, NarrativeID, ReportedByPINActivityID, NarrativeTypeID,
      AsOfDate, NarrativeAssignedID: narrativeAssignId, WrittenForID, CreatedByUserFK: loginPinID, ApprovingSupervisorID: null, RedactedComment: CommentsDoc || ""
    };
    AddDeleteUpadate('Narrative/Insert_Narrative', val)
      .then((res) => {
        if (res.success) {
          toastifySuccess(res?.Message); get_NarrativesData(incidentID, loginPinID);
          GetData_ReportWorkLevelCheck(localStoreData?.AgencyID, res?.NarrativeID);
          get_IncidentTab_Count(incidentID, loginPinID); setNarrativeID(res?.NarrativeID);
          GetSingleData(res?.NarrativeID); setStatesChangeStatus(false);
          setChangesStatus(false); setErrors(prev => ({ ...prev, AsOfDateError: '' }));
        }
      });
  };

  const updateNarrative = (e) => {
    const result = narrativeData?.find(item => {
      if (item.Comments) {
        if (item.NarrativeID != value.NarrativeID) {
          if (item.Comments.toLowerCase() === value.Comments.toLowerCase()) {
            return item.Comments.toLowerCase() === value.Comments.toLowerCase()
          } else return item.Comments.toLowerCase() === value.Comments.toLowerCase()
        }
      }
    });

    const resultType = narrativeTypeCode.toLowerCase() === 'ni' && narrativeData?.filter(item => {
      if (item.NarrativeTypeCode) {
        return item.NarrativeTypeCode.toLowerCase() === 'ni';
      }
      return false;
    });

    if (result) {
      toastifyError('Comments Already Exists ')
      setErrors({ ...errors, ['AsOfDateError']: '' })
    }
    // else if (resultType && resultType.length > 0) {
    //   toastifyError('Report type already exists update');
    //   setErrors({ ...errors, ['AsOfDateError']: '' });
    // }
    else {
      const { CommentsDoc, NarrativeID, Comments, ReportedByPINActivityID, NarrativeTypeID, AsOfDate, WrittenForID, } = value;
      const val = {
        CommentsDoc: CommentsDoc, IncidentId: IncID, NarrativeID: NarrativeID, Comments: Comments, ReportedByPINActivityID: ReportedByPINActivityID, NarrativeTypeID: NarrativeTypeID, AsOfDate: AsOfDate, ModifiedByUserFK: loginPinID, WrittenForID: WrittenForID,
        ApprovingSupervisorID: null, RedactedComment: value.Status === 'Approved' ? redactedComment : CommentsDoc
      };
      AddDeleteUpadate('Narrative/Update_Narrative', val)
        .then((res) => {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);

          setStatesChangeStatus(false); setChangesStatus(false); GetSingleData(narrativeID);
          // setStatus(true);  setStatusFalse();
          setErrors({ ...errors, 'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', ['ApprovingOfficerError']: '' });
          get_NarrativesData(incidentID, loginPinID);
        })
    }
  }

  const reset = () => {
    navigate(`/Inc-Home?IncId=${stringToBase64(IncID)}&IncNo=${IncNo}&IncSta=${true}&IsCadInc=${true}&narrativeAssignId=${stringToBase64('')}`)
    setValue({
      ...value,
      'NarrativeTypeID': '',
      'NarrativeID': '', 'AsOfDate': null, 'IsReject': '', 'status': '', 'ApprovingSupervisorID': '', 'Status': '', 'IncidentId': '', 'NarrativeID': '',
      'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '', 'IsApprove': '', 'CreatedByUserFK': '',
      'CommentsDoc': '', 'Comments': '',
    });
    setRedactedComment("");
    setNormalReport(true);
    setDetectedWords([]);
    setnarrativeTypeCode('')
    setStatus(); setNarrativeID(''); setassignedReportID('');
    setErrors({
      ...errors, 'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', ['ApprovingOfficerError']: '', 'WrittenForIDError': '',
    });
    setStatesChangeStatus(false); setChangesStatus(false);
    setMissingField({})
  }



  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }


  const get_NarrativesData = (incidentID, loginPinID) => {
    const val = { IncidentId: incidentID, OfficerID: loginPinID }
    fetchPostData('Narrative/GetData_Narrative', val).then(res => {
      if (res) {
        setNarrativeData(res); setLoder(true)
      } else {
        setNarrativeData([]); setLoder(true)
      }
    })
  }

  const GetData_ReportWorkLevelCheck = (loginAgencyID, narrativeID) => {
    const val = { AgencyID: loginAgencyID, NarrativeID: narrativeID };

    fetchPostData('IncidentNarrativeReport/GetData_ReportWorkLevelCheck', val).then(res => {
      if (res && res.length > 0) {
        console.log(res);

        const workflowData = res[0];
        const canShowApprovalButton = workflowData?.IsMultipleLevel || workflowData?.IsSingleLevel;
        const canApproved = workflowData?.IsSelfApproved;
        setcheckWebWorkFlowStatus(canShowApprovalButton);
        setIsSelfApproved(canApproved);
        // setLoder(true);
      } else {
        // Handle case where no data is returned
        // setNarrativeData([]);
        // setLoder(true);
      }
    });
  };


  const get_NarrativesInformation = (incidentID) => {
    const val = { IncidentId: incidentID, }
    fetchPostData('Narrative/Narrative_Info', val).then(res => {
      if (res) {
        setNarrativeInformation(res); setLoder(true)
      } else {
        setNarrativeInformation([]); setLoder(true)
      }
    })
  }

  const getScreenPermision = (LoginAgencyID, LoginPinID) => {
    ScreenPermision("I032", LoginAgencyID, LoginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res);
        setPermissionForEdit(res[0]?.Changeok);
        setPermissionForAdd(res[0]?.AddOK);
        // for change tab when not having  add and update permission
        setaddUpdatePermission(res[0]?.AddOK != 1 || res[0]?.Changeok != 1 ? true : false);

      } else {
        setEffectiveScreenPermission([]);
        setPermissionForEdit(false);
        setPermissionForAdd(false);
        setaddUpdatePermission(true);
      }
    });
  }

  // const conditionalRowStyles = [
  //   {
  //     when: row => row?.NarrativeID === narrativeID,
  //     style: {
  //       backgroundColor: '#001f3fbd',
  //       color: 'white',
  //       cursor: 'pointer',
  //     },
  //   },
  // ];
  const conditionalRowStyles = [
    {
      // when: row => String(row.NarrativeID) === String(narrativeID),
      when: row => row?.NarrativeDescription === "Use Of Force" ? "" : parseInt(row.NarrativeID) === parseInt(narrativeID),

      style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
    },
  ];


  const columns = [
    {
      name: 'Date/Time',
      selector: (row) => getShowingDateText(row.CreatedDtTm),
      sortable: true
    },
    {
      name: 'Prepared by',
      selector: (row) => row.ReportedBy_Description,
      sortable: true
    },
    {
      name: 'Written For',
      selector: (row) => row.WrittenFor_Officer,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row) => row.NarrativeDescription,
      sortable: true
    },
    {
      name: 'Status',
      selector: row => row.Status,
      sortable: true,
      cell: row => {
        const desc = row.Status?.toLowerCase();
        let backgroundColor = 'transparent';
        let color = 'black'; // Default text color

        // Set background color based on status
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
      }
    },
    {
      name: 'Comment',
      selector: (row) => row.LastComments,
      sortable: true
    },

    {
      name: 'Approving Officer/Group',
      selector: (row) => row.ApproveOfficer,
      sortable: true
    },
    // {
    //   name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 15 }}>Delete</p>,
    //   cell: row =>
    //     <div style={{ position: 'absolute', top: 4, right: 15 }}>
    //       {
    //         effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
    //           <span onClick={(e) => setNarrativeID(row.NarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //             <i className="fa fa-trash"></i>
    //           </span>
    //           : <></>
    //           : <span onClick={(e) => setNarrativeID(row.NarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
    //             <i className="fa fa-trash"></i>
    //           </span>
    //       }
    //     </div>
    // }
    {
      name: (
        <p className='text-end' style={{ position: 'absolute', top: '7px', right: 15 }}>
          Delete
        </p>
      ),
      cell: row => (
        <div style={{ position: 'absolute', top: 4, right: 15 }}>
          {
            row.IsAllowDelete === 'true' || row.IsAllowDelete === true && (
              effectiveScreenPermission
                ? effectiveScreenPermission[0]?.DeleteOK &&
                <span
                  onClick={() => setNarrativeID(row.NarrativeID)}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                  data-toggle="modal"
                  data-target="#DeleteModal"
                >
                  <i className="fa fa-trash"></i>
                </span>
                : <span
                  onClick={() => setNarrativeID(row.NarrativeID)}
                  className="btn btn-sm bg-green text-white px-1 py-0 mr-1"
                  data-toggle="modal"
                  data-target="#DeleteModal"
                >
                  <i className="fa fa-trash"></i>
                </span>
            )
          }
        </div>
      )
    }
  ]

  const editNarratives = (row) => {
    console.log('hello-1')
    if (changesStatus) {
      const modal = new window.bootstrap.Modal(document?.getElementById('SaveModal'));
      modal?.show();

    } else {
      if (row) {
        setNarrativeID(row?.NarrativeID);
        GetSingleData(row?.NarrativeID);
        GetData_ReportWorkLevelCheck(loginAgencyID, row?.NarrativeID);
        get_Group_List(loginAgencyID, loginPinID, row?.NarrativeID);
        setUpDateCount(upDateCount + 1); dispatch(get_Report_Approve_Officer_Data(loginAgencyID, loginPinID, row?.NarrativeID));
        setStatus(true);
        setErrors({ ...errors, 'ReportedByPinError': '', 'AsOfDateError': '', 'NarrativeIDError': '', 'CommentsError': '', 'WrittenForIDError': '', }); setStatesChangeStatus(false);
      }
    }
  }

  const setStatusFalse = () => {
    reset();
  }

  const DeleteNarratives = () => {
    const val = { 'narrativeID': narrativeID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('Narrative/Delete_Narrative', val).then((res) => {
      if (res.success) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_IncidentTab_Count(incidentID, loginPinID); reset();
      } else { console.log("Somthing Wrong"); }
      get_NarrativesData(incidentID, loginPinID);
      // GetData_ReportWorkLevelCheck(loginAgencyID ,narrativeID);
    })
  }

  const reportedTime = new Date(incidentReportedDate);
  let reportDate = reportedTime.getDate();


  const get_Group_List = (loginAgencyID, loginPinID, NarrativeID) => {
    const value = { AgencyId: loginAgencyID, PINID: loginPinID, NarrativeID: NarrativeID }
    fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
      if (res) {
        setGroupList(changeArrayFormat(res, 'group'))
        if (res[0]?.GroupID) {
          setValue({
            ...value,
            ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
            'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerFullNameDrpData) ? loginPinID : '',
            'WrittenForID': narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
            'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
          });
        }
      }
      else {
        setGroupList();
      }
    })
  }

  function getLabelsString(data) {
    return data.map(item => item.label).join(',');
  }

  const Add_Approval = async (id) => {
    const { ApprovingSupervisorID, status } = value;
    const documentAccess = selectedOption === "Individual" ? 'Individual' : 'Group';
    let ApprovingSupervisorName = null;
    ApprovingSupervisorName = multiSelected?.optionSelected?.length > 0 ? getLabelsString(multiSelected.optionSelected) : null;
    const val = {
      'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': documentAccess, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': '', 'CreatedByUserFK': loginPinID, 'IsReject': '', 'Comments': '', 'status': status, 'ApprovingSupervisorName': ApprovingSupervisorName
    };
    AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val)
      .then((res) => {
        if (res.success) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          get_NarrativesData(incidentID, loginPinID);
          // GetData_ReportWorkLevelCheck(loginAgencyID ,narrativeID);
          resets(); reset()
        } else {
          console.log("something Wrong");
        }
      }).catch(err => console.log(err));
  }

  const Agencychange = (multiSelected) => {
    setStatesChangeStatus(true)
    setMultiSelected({ optionSelected: multiSelected });
    const id = []
    const name = []
    if (multiSelected) {
      multiSelected.map((item, i) => { id.push(item.value); name.push(item.label) })
      setValue({ ...value, ['ApprovingSupervisorID']: id.toString(), ['DocumentAccess_Name']: name.toString() })
    }
  }

  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    setValue({ ...value, ['ApprovingSupervisorID']: "", ['DocumentAccess_Name']: "" })
    setMultiSelected({ optionSelected: [] });
    setErrors({ ...errors, ['ApprovingOfficerError']: '' })
  };


  const colourStylesUsers = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      backgroundColor: isDisabled ? '#9d949436' : '#FFE2A8',
      fontSize: 14,
      marginTop: 2,
      boxShadow: 'none',
      cursor: isDisabled ? 'not-allowed' : 'default',
    }),
  };

  const check_Validation_ErrorApproval = () => {
    if (RequiredFieldIncident(value.ApprovingSupervisorID)) {
      setErrors(prevValues => { return { ...prevValues, ['ApprovingOfficerError']: RequiredFieldIncident(value.ApprovingSupervisorID) } })
    }
  }

  const { ApprovingOfficerError } = errors

  useEffect(() => {
    if (ApprovingOfficerError === 'true') {
      Add_Approval(); updateNarrative(); reset();
    }
  }, [ApprovingOfficerError])

  const resets = () => {
    setValue({
      ...value,
      'IncidentId': '', 'NarrativeID': '', 'ApprovingSupervisorType': '', 'ApprovingSupervisorID': '',
      'IsApprove': '', 'CreatedByUserFK': '', 'IsReject': '', 'Comments': '', 'status': ''
    });
    setErrors({ ...errors, ['ApprovingOfficerError']: '' })
    setMultiSelected({ optionSelected: ' ' });
  }

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `.ck-powered-by { display: none !important; }`;
    document.head.appendChild(style);
  }, []);

  const renderNarrativeData = () => {

    const narrative = Array.isArray(narrativeInformation) && narrativeInformation.length > 0 ? narrativeInformation[0] : null;

    return (
      <div className='col-xxl-12'>
        <div className='row'>
          <div className="col-lg-4">
            <label htmlFor="" className='new-summary'>Reported DT/TM :</label>
            <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
              {narrative ? getShowingDateText(narrative.ReportedDate) : ''}
            </span>
          </div>
          <div className='col-lg-4'>
            <label htmlFor="" className='new-summary'>Victim :</label>
            <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
              {narrative ? narrative.VictimNameData : ''}
            </span>
          </div>
          <div className='col-lg-4'>
            <label htmlFor="" className='new-summary'>Offender :</label>
            <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
              {narrative ? narrative.OffenderNameData : ''}
            </span>
          </div>
        </div>
        <div className='row'>
          <div className="col-lg-8">
            <label htmlFor="" className='new-summary'>Property :</label>
            <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
              {narrative ? narrative.PropertyData : ''}
            </span>
          </div>
          <div className="col-lg-4">
            <label htmlFor="" className='new-summary'>Suspect :</label>
            <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
              {narrative ? narrative.SuspectNameData : ''}
            </span>
          </div>
        </div>
        <div className='row'>
          <div className="col-lg-8">
            <label htmlFor="" className='new-summary'>Vehicle:</label>
            <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
              {narrative ? narrative?.VehicleData : ''}
            </span>
          </div>
          <div className="col-lg-4">
            <label htmlFor="" className='new-summary'>OtherName :</label>
            <span style={{ color: 'black', fontSize: '13px', margin: '0px', padding: '12px' }}>
              {narrative ? narrative.OtherNameData : ''}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const isSupervisor = IsSupervisor === true || IsSupervisor === "True";
  const isSuperadmin = IsSuperadmin === true || IsSuperadmin === "true";

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#FFE2A8', // Default background color
      borderColor: state.isFocused ? '#aaa' : '#ccc',
    }),
    option: (provided, state) => {
      const isInactive = state.data?.IsActive === false;
      return {
        ...provided,
        color: isInactive ? 'red' : 'Green',
        backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
      };
    },
    singleValue: (provided, state) => {
      const isInactive = state.data?.IsActive === false;
      return {
        ...provided,
        color: isInactive ? 'red' : 'Green',
      };
    },
  };



  // editor start
  const [ChargesData, setChargesData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [VehicleData, setVehicleData] = useState([]);
  const [CategoryData, setCategoryData] = useState([]);

  useEffect(() => {
    if (redactingData) {

      const data1 = redactingData?.Table4?.[0]?.Description;
      const data2 = redactingData?.Table;
      const data1List = data1?.split(",");

      const filteredCategoryData = data2?.map(item => {
        const allowNames = data1List?.includes(item?.Category);

        return {
          FullName: allowNames ? item.FullName : "",
          FirstName: allowNames ? item.FirstName : "",
          MiddleName: allowNames ? item.MiddleName : "",
          LastName: allowNames ? item.LastName : "",
          Address: data1List?.includes("Address") ? item.Address : "",
          SSN: data1List?.includes("SSN") ? item.SSN : "",
          Contact: data1List?.includes("Contact") ? item.Contact : "",
          DateOfBirth: data1List?.includes("DateOfBirth") ? item.DateOfBirth : "",
          DLNumber: data1List?.includes("DLNumber") ? item.DLNumber : "",
          // AgeFrom: data1List?.includes("Juveniles") ? item.AgeFrom : "",
          AgeFrom: item.AgeFrom || "",
          Category: item.Category,
        };
      });
      setCategoryData(filteredCategoryData || []);


      // const data1 = redactingData?.Table4?.[0]?.Description;
      // const data2 = redactingData?.Table;
      // console.log("data2", data2)
      // const data1List = data1?.split(",");
      // const roleType = ["Victim", "Witness", "Juveniles"]
      // console.log("data1List", data1List)
      // const filteredCategoryData = data2
      //   ?.map(item =>
      //   ({
      //     FullName: roleType.includes(item?.Category) ? item.FullName : "",
      //     FirstName: roleType.includes(item?.Category) ? item.FirstName : "",
      //     MiddleName: roleType.includes(item?.Category) ? item.MiddleName : "",
      //     LastName: roleType.includes(item?.Category) ? item.LastName : "",
      //     Address: data1List?.includes("Address") ? item.Address : "",
      //     SSN: data1List?.includes("SSN") ? item.SSN : "",
      //     Contact: data1List?.includes("Contact") ? item.Contact : "",
      //     OwnerPhoneNumber: data1List?.includes("Contact") ? item.OwnerPhoneNumber : "",
      //     DateOfBirth: data1List?.includes("DateOfBirth") ? item.DateOfBirth : "",
      //     DLNumber: data1List?.includes("DLNumber") ? item.DLNumber : "",
      //     AgeFrom: data1List?.includes("Juveniles") ? item.AgeFrom : "",
      //     Category: item.Category,
      //   }));
      // console.log("filteredCategoryData", filteredCategoryData)
      // setCategoryData(filteredCategoryData || []);

      // --- ChargesData ---
      if (data1List?.includes("Charges")) {
        setChargesData([...redactingData?.Table1]);
      }

      // --- locationData ---
      if (data1List?.includes("CrimeLocation")) {
        setLocationData([...redactingData?.Table3]);
      }

      // --- VehicleData ---
      if (data1List?.includes("VehicleNo")) {
        const filteredVehicleData = redactingData?.Table2?.map(item => ({
          VehicleNo: item?.VehicleNo,
          VIN: item?.VIN
        }));
        setVehicleData(filteredVehicleData || []);
      }
    }
  }, [redactingData]);

  useEffect(() => {
    detectedWordsRef.current = Array.isArray(detectedWords) ? detectedWords : [];
  }, [detectedWords]);

  useEffect(() => {
    const data = value?.Comments?.replace(/\n/g, '');

    if (data?.length > 0) {
      const val = {
        text: data,
        IncidentID: incidentID,
        AgencyID: loginAgencyID
      };
      AddDeleteUpadate('/suggestion/MissingFiled', val)
        .then((res) => {
          setMissingField(res);
        })
        .catch(err => setMissingField({}));
    } else {
      setMissingField({});
    }
  }, [value.Comments]);


  const autoRedact = (quill, detectedWordsData) => {
    if (!quill || !Array.isArray(detectedWordsData) || detectedWordsData.length === 0) return;

    // --- local helpers ---
    const normalize = (s) =>
      ///s (s || "").toString().toLowerCase() // Convert to lowercase.replace(/-/g, "") // Remove hyphens.replace(/\s+/g, "") // Remove all whitespace characters.trim(); // Trim leading and trailing spaces
      (s || "").toString().toLowerCase().replace(/\s+/g, "").trim();

    const isBlack = (v) => {
      const n = normalize(v);
      return n === "#000" || n === "#000000" || n === "black";
    };

    const isGreen = (v) => {
      const n = normalize(v);
      return n === "#008000" || n === "green";
    };

    // NEW: treat #7FFFD4 / aquamarine as the suggestion text color
    const isAquamarine = (v) => {
      const n = normalize(v);
      return n === "#7fffd4" || n === "aquamarine";
    };

    const isWs = (ch) => /\s/.test(ch);

    // Find next match for `needleNoWs` ignoring whitespace in textLower
    const findNextMatchIgnoringSpaces = (textLower, needleNoWs, startAt) => {
      const nlen = needleNoWs.length;

      for (let i = startAt; i < textLower.length; i++) {
        let j = 0; // needle idx
        let k = i; // haystack idx
        let first = -1;
        let last = -1;

        while (k < textLower.length && j < nlen) {
          const hk = textLower[k];

          if (isWs(hk)) {
            k++;
            continue;
          }
          if (hk === needleNoWs[j]) {
            if (first === -1) first = k;
            last = k;
            j++;
            k++;
            continue;
          }
          // mismatch
          j = -1;
          break;
        }

        if (j === nlen && first !== -1) {
          return { start: first, endExclusive: last + 1 };
        }
      }
      return null;
    };

    // Return true if entire [index, index+length) is black-on-black
    const isRangeFullyBlackOnBlack = (quill, index, length) => {
      if (!quill || length <= 0) return false;

      const delta = quill.getContents(index, length);
      for (const op of (delta && delta.ops) || []) {
        const attr = op.attributes || {};
        if (!(isBlack(attr.color) && isBlack(attr.background))) return false;
      }
      return true;
    };

    // --- main logic ---
    const textLower = quill.getText().toLowerCase();


    const fullTextLength = quill.getLength();
    let currentIndex = 0;

    // Step 1: Clear all previous green background highlights across the entire Quill editor
    while (currentIndex < fullTextLength) {
      const fmt = quill.getFormat(currentIndex, 1);
      if (isGreen(fmt?.background)) {
        quill.formatText(currentIndex, 1, { background: false, color: false }, "user");
      }
      currentIndex++;
    }

    detectedWordsData
      .filter(Boolean)
      .map((w) => String(w).trim())
      .filter((w) => w.length > 0)
      .forEach((word) => {
        const needleNoWs = word.toLowerCase().replace(/\s+/g, "");
        if (!needleNoWs) return;

        let searchFrom = 0;
        while (true) {
          const match = findNextMatchIgnoringSpaces(textLower, needleNoWs, searchFrom);
          if (!match) break;

          const { start, endExclusive } = match;
          const len = Math.max(0, endExclusive - start);
          if (len > 0) {
            // skip if fully redacted already
            if (!isRangeFullyBlackOnBlack(quill, start, len)) {
              // skip if already suggestion styled
              const fmt = quill.getFormat(start, len);
              let alreadySuggestion = false;
              if (Array.isArray(fmt) && fmt.length > 0) {
                alreadySuggestion = fmt.every(
                  (f) => isAquamarine(f?.color) && isGreen(f?.background)
                );
              } else {
                alreadySuggestion = isAquamarine(fmt?.color) && isGreen(fmt?.background);
              }

              if (!alreadySuggestion) {
                quill.formatText(start, len, { color: "#7FFFD4", background: "#008000" }, "user");
              }
            }
          }

          searchFrom = endExclusive;
        }
      });
  };


  useEffect(() => {
    if (isUpdated && redactedComment && !isNormalReport) {
      const detectedWordsData = matchIncidentWords({
        commentsDoc: redactedComment,
        vehicleData: VehicleData,
        categoryData: CategoryData,
        chargesData: ChargesData,
        locationData: locationData,
      })
      setDetectedWords(detectedWordsData);


    }
  }, [redactedComment, VehicleData, CategoryData, ChargesData, locationData, isUpdated, isNormalReport]);


  useMemo(() => {
    // auto redact
    const quill = document.querySelector(".ql-editor");
    if (quill) {
      const quillInstance = quill.closest(".ql-container").__quill;
      if (quillInstance) {
        autoRedact(quillInstance, detectedWords);
        setIsUpdated(false);
      }
    }
  }, [detectedWords])


  const toggleRedactManualFromTextEditor = (quill, detectedWordsArr) => {
    if (!quill) return;

    const sel = quill.getSelection(true);
    if (!sel || sel.length === 0) return;

    const { index, length } = sel;
    const fmt = quill.getFormat(index, length);

    const normalize = (s) =>
      (s || "").toString().toLowerCase().replace(/\s+/g, "").trim();

    const isBlack = (v) => {
      const n = normalize(v);
      return n === "#000" || n === "#000000" || n === "black";
    };

    const currentlyRedacted = isBlack(fmt?.color) && isBlack(fmt?.background);

    const selectedText = quill.getText(index, length);
    const selectedNorm = normalize(selectedText);

    const isDetected =
      Array.isArray(detectedWordsArr) &&
      detectedWordsArr.some((w) => normalize(w) === selectedNorm);

    if (currentlyRedacted) {
      // unredact
      if (isDetected) {
        // detected → suggestion style
        quill.formatText(index, length, { color: "#000000", background: "#008000" }, "user");
      } else {
        // not detected → clear formatting
        quill.formatText(index, length, { color: false, background: false }, "user");
      }
    } else {
      // redact
      quill.formatText(index, length, { color: "#000000", background: "#000000" }, "user");
    }
  };


  const toggleRedactFromHeaderButton = (quill, word) => {
    if (!quill || !word) return;
    // Normalize the clicked word (needle): case-insensitive, remove spaces
    const needle = String(word).toLowerCase().replace(/\s+/g, "").trim();
    if (!needle) return;

    const isBlack = (v) => {
      const n = (v || "").toString().trim().toLowerCase().replace(/\s+/g, "");
      return n === "#000" || n === "#000000" || n === "black";
    };

    const isWs = (ch) => /\s/.test(ch);

    // Find next match ignoring whitespace; return a TIGHT span:
    // [firstNonWs, lastNonWs + 1) — no leading/trailing whitespace included
    const findNextMatchIgnoringSpaces = (text, startAt) => {
      const lower = text.toLowerCase();
      const nlen = needle.length;

      for (let i = startAt; i < lower.length; i++) {
        let j = 0;                 // index in needle (no spaces)
        let k = i;                 // moving index in haystack
        let firstNonWsPos = -1;    // first non-whitespace matched index
        let lastNonWsPos = -1;     // last non-whitespace matched index

        while (k < lower.length && j < nlen) {
          const hk = lower[k];

          if (isWs(hk)) {          // skip whitespace but keep span open
            k++;
            continue;
          }

          if (hk === needle[j]) {
            if (firstNonWsPos === -1) firstNonWsPos = k;
            lastNonWsPos = k;
            j++;
            k++;
            continue;
          }

          // mismatch for this i
          j = -1;
          break;
        }

        if (j === nlen && firstNonWsPos !== -1) {
          return { start: firstNonWsPos, endExclusive: lastNonWsPos + 1 };
        }
      }
      return null;
    };

    // Loop through all matches; only format the tight token span.
    let searchFrom = 0;
    while (true) {
      const plain = quill.getText(); // refresh each loop
      const match = findNextMatchIgnoringSpaces(plain, searchFrom);
      if (!match) break;

      const { start, endExclusive } = match;
      const spanLen = Math.max(0, endExclusive - start);
      if (spanLen === 0) {
        searchFrom = endExclusive + 1;
        continue;
      }

      // Check current formatting on the token span
      const fmt = quill.getFormat(start, spanLen);
      const currentlyRedacted = isBlack(fmt?.color) && isBlack(fmt?.background);

      if (currentlyRedacted) {
        // Suggestion style: black text on green background
        quill.formatText(start, spanLen, { color: "#000000", background: "#008000" }, "user");
      } else {
        // Fully redacted: black text on black background
        quill.formatText(start, spanLen, { color: "#000000", background: "#000000" }, "user");
      }

      // Continue after this matched token
      searchFrom = endExclusive;
    }
  };


  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ size: ["small", "normal", "large", "huge"] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["bold", "italic", "underline"],
          ["link", "image"],
          [{ color: [] }, { background: [] }],
          ["blockquote"],
        ],

      },
      clipboard: { matchVisual: false },
    }),
    [] // ok to keep empty; we read latest via ref
  );

  const redactModules = useMemo(
    () => ({
      toolbar: {
        container: value.Status === 'Approved'
          ? [["redact"]] // Only redact button when status is Approved
          : [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: ["small", "normal", "large", "huge"] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
            [{ color: [] }, { background: [] }],
            ["blockquote"],
            ["redact"], // our button
          ],
        handlers: {
          redact: function () {
            const quill = this.quill;
            // always the latest value:
            toggleRedactManualFromTextEditor(quill, detectedWordsRef.current);
          },
        },
      },
      clipboard: { matchVisual: false },
    }),
    [value.Status] // Add value.Status as dependency
  );
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "size",
    "background",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "code-block",
    "color",
    "align",
    "link",
    "image",
  ];

  const quillRef = useRef(null); // Reference for the Quill editor instance
  // Disable keyboard typing if status is "Approved"
  const handleKeyDown = (e) => {
    if (value?.Status === "Approved") {
      e.preventDefault(); // Prevent keyboard input when status is approved
    }
  };

  // Effect to initialize the Quill instance when the component mounts
  useEffect(() => {
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      // Enable mouse interactions
      if (value?.Status === "Approved") {
        quillInstance.disable(); // Disable typing
      } else {
        quillInstance.enable(); // Allow typing
      }
    }
  }, [value?.Status]);

  console.log(IsSelfApproved);

  const Add_Type_Comments = () => {
    const { IsApprove, IsReject, Comments, CommentsDoc, ApprovalComments, ApprovingSupervisorID, IsApprovedForward } = value
    const type = selectedOption === "Individual" ? 'Individual' : 'Group';

    const val = {
      'AgencyID': loginAgencyID,
      'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': true, 'CreatedByUserFK': loginPinID,
      // 'IncidentId': incidentID, 'NarrativeID': narrativeID, 'ApprovingSupervisorType': type, 'ApprovingSupervisorID': ApprovingSupervisorID, 'IsApprove': IsApprovedForward ? 'true' : IsApprove, 'CreatedByUserFK': loginPinID, 'IsApprovedForward': IsApprovedForward, 'IsReject': IsReject, 'Comments': ApprovalComments,

    };
    AddDeleteUpadate('IncidentNarrativeReport/Insert_IncidentNarrativeReport', val).then((res) => {
      // get_Data_Que_Report(loginPinID, loginAgencyID);
      const parseData = JSON.parse(res.data);
      toastifySuccess(parseData?.Table[0].Message);
      get_NarrativesData(incidentID, loginPinID);
      setIsSelfApproved(false);
      // setStatesChangeStatus(false);
      // setIsSaved(true);
      // setModelStatus(true);
      // resets();
    })
  }

  // editor end
  return (
    <>
      <div className="row mt-1 child">
        <div className="col-12 col-md-12 col-lg-12 px-0 pl-0">
          {/* <div>
            {renderNarrativeData()}
          </div> */}
          <div className="row mb-3">
            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
              <label htmlFor="" className='new-label'>Report Type  {errors.NarrativeIDError !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeIDError}</p>
              ) : null}</label>

            </div>
            <div className="col-4 col-md-4 col-lg-2 mt-2 ">
              <Select
                name='NarrativeTypeID'
                isClearable
                styles={value.Status === 'Pending Review' || value.Status === 'Approved' || (NarrativeAssignId && tabParam && assigned) || status || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                  !IsSuperadmin &&
                  !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? colourStylesUsers : Requiredcolour}
                value={narrativeTypeDrpData?.filter((obj) => obj.value === value?.NarrativeTypeID)}
                options={narrativeTypeDrpData}
                onChange={(e) => ChangeDropDownReportType(e, 'NarrativeTypeID', 'NarrativeTypeCode')}
                placeholder="Select.."
                menuPlacement="bottom"
                isDisabled={value.Status === 'Pending Review' || value.Status === 'Approved' || (NarrativeAssignId && tabParam && assigned) || status || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                  !IsSuperadmin &&
                  !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
              <label htmlFor="" className='new-label'>Date/Time {errors.AsOfDateError !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.AsOfDateError}</p>
              ) : null}</label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 mt-2 ">
              <DatePicker
                ref={startRef}
                onKeyDown={(e) => {
                  if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                    e.preventDefault();
                  } else {
                    onKeyDown(e);
                  }
                }
                }
                dateFormat="MM/dd/yyyy HH:mm"
                timeFormat="HH:mm "
                is24Hour
                timeInputLabel
                isClearable={value?.AsOfDate ? true : false}
                name='AsOfDate'
                onChange={(date) => {
                  if (date) {
                    let currDate = new Date(date);
                    let prevDate = new Date(value?.AsOfDate);
                    let maxDate = new Date(datezone);
                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                    if ((currDate.getDate() === maxDate.getDate() && currDate.getMonth() === maxDate.getMonth() && currDate.getFullYear() === maxDate.getFullYear()) && !(currDate.getDate() === prevDate.getDate() && currDate.getMonth() === prevDate.getMonth() && currDate.getFullYear() === prevDate.getFullYear())) {

                      setValue({ ...value, ['AsOfDate']: maxDate ? getShowingMonthDateYear(maxDate) : null })
                    }
                    else if (date >= new Date()) {

                      setValue({ ...value, ['AsOfDate']: new Date() ? getShowingMonthDateYear(new Date()) : null })
                    } else if (date <= new Date(incidentReportedDate)) {

                      setValue({ ...value, ['AsOfDate']: incidentReportedDate ? getShowingMonthDateYear(incidentReportedDate) : null })
                    } else {

                      setValue({ ...value, ['AsOfDate']: date ? getShowingMonthDateYear(date) : null })
                    }
                  } else {
                    setValue({ ...value, ['AsOfDate']: null })

                  }
                }}
                selected={value?.AsOfDate && new Date(value?.AsOfDate)}
                placeholderText={'Select...'}
                showTimeSelect
                timeIntervals={1}
                timeCaption="Time"
                popperPlacement="bottom"
                maxDate={new Date(datezone)}
                minDate={new Date(incidentReportedDate)}
                autoComplete="Off"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                filterTime={(time) => filterPassedDateTimeZone(time, value?.AsOfDate, incidentReportedDate, datezone)}
                disabled={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                  !IsSuperadmin &&
                  !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? true : false}
                className={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                  !IsSuperadmin &&
                  !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? 'readonlyColor' : 'requiredColor'}
              />

            </div>

            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
              <label htmlFor="" className='new-label text-nowrap'>Prepared by  {errors.ReportedByPinError !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportedByPinError}</p>
              ) : null}</label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 mt-2 ">
              <Select
                name='ReportedByPINActivityID'
                isClearable
                value={agencyOfficerFullNameDrpData?.filter((obj) => obj.value === value?.ReportedByPINActivityID)}
                options={agencyOfficerFullNameDrpData}
                // value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.ReportedByPINActivityID)}
                // options={agencyOfficerDrpData}
                onChange={(e) => ChangeDropDown(e, 'ReportedByPINActivityID')}
                placeholder="Select.."
                menuPlacement="bottom"
                isDisabled
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
              <label htmlFor="" className='new-label text-nowrap'>Written For {errors.WrittenForIDError !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.WrittenForIDError}</p>
              ) : null}</label>
            </div>
            <div className="col-4 col-md-4 col-lg-2 mt-2 ">
              <Select
                name="WrittenForID"
                isClearable
                styles={
                  value.Status === 'Pending Review' || value.Status === 'Approved' || narrativeTypeCode.toLowerCase() === 'ni' || value.Status === 'Draft' || value.Status === 'Rejected'
                    ? colourStylesUsers
                    :
                    customStyles
                }
                value={WrittenForDataDrp?.filter((obj) => obj.value === value?.WrittenForID)}
                options={WrittenForDataDrp}
                onChange={(e) => ChangeDropDown(e, 'WrittenForID')}
                placeholder="Select.."
                menuPlacement="bottom"
                isDisabled={value.Status === 'Pending Review' || value.Status === 'Approved' || value.Status === 'Draft' || narrativeTypeCode.toLowerCase() === 'ni' || value.Status === 'Rejected'}
              />


            </div>
          </div>
          {value.Status === "Rejected" &&
            <div className="row">
              <>
                <div className="col-2 col-md-2 col-lg-1 mt-2 pt-2">
                  <label htmlFor="" className='new-label'>Comment</label>
                </div>
                <div className="col-4 col-md-4 col-lg-4 mt-2 text-field">
                  <textarea type="text" className="form-control" name='Justification'
                    id="Justification"
                    value={LastComments}
                    readOnly />
                </div>
              </>
              <div className={'col-4 text-right ml-auto'}>
                <div
                  id="NIBRSStatus"
                  className={
                    value.Status === "Draft"
                      ? "nibrs-draft-Nar"
                      : value.Status === "Approved"
                        ? "nibrs-submitted-Nar"
                        : value.Status === "Rejected"
                          ? "nibrs-rejected-Nar"
                          : value.Status === "Pending Review"
                            ? "nibrs-reopened-Nar"
                            : ""
                  }
                  style={{
                    color: "black",
                    opacity: 1,
                    height: "35px",
                    fontSize: "14px",
                    marginTop: "2px",
                    boxShadow: "none",
                    userSelect: "none",
                    padding: "5px", // optional for spacing
                  }}
                >
                  {value.Status}
                </div>
              </div>
            </div>
          }
          {(value.Status !== "Rejected" && value.Status) &&
            <div className="row mt-2 align-items-center">
              {value.Status === 'Approved' &&
                <>
                  <div className="col-2 col-md-2 col-lg-1">
                    <label className="new-label">Preview Report</label>
                  </div>

                  <div className="col-4 d-flex align-items-center">
                    {/* Normal Report */}
                    <label className="d-flex align-items-center me-4" style={{ gap: "6px" }}>
                      <input
                        type="radio"
                        name="status"
                        checked={isNormalReport}
                        onChange={() => { setNormalReport(true) }}
                      />
                      <span>Normal Report</span>
                    </label>

                    {/* Redacted Report */}
                    <label className="d-flex align-items-center" style={{ marginLeft: "18px", gap: "6px" }}>
                      <input
                        type="radio"
                        name="status"
                        checked={!isNormalReport}
                        onChange={() => { setNormalReport(false) }}
                      />
                      <span>Redacted Report</span>
                    </label>
                  </div>
                </>
              }
              <div className={'col-4 text-right mb-2 ml-auto'}>
                <div
                  id="NIBRSStatus"
                  className={
                    value.Status === "Draft"
                      ? "nibrs-draft-Nar"
                      : value.Status === "Approved"
                        ? "nibrs-submitted-Nar"
                        : value.Status === "Rejected"
                          ? "nibrs-rejected-Nar"
                          : value.Status === "Pending Review"
                            ? "nibrs-reopened-Nar"
                            : ""
                  }
                  style={{
                    color: "black",
                    opacity: 1,
                    height: "35px",
                    fontSize: "14px",
                    marginTop: "2px",
                    boxShadow: "none",
                    userSelect: "none",
                    padding: "5px", // optional for spacing
                  }}
                >
                  {value.Status}
                </div>
              </div>
            </div>
          }



          {isNormalReport &&
            <span>

              {(missingField?.MissingFields?.length > 0 || missingField.ReasonCodeSuggestions || missingField.ChargeCodeSuggestions) &&
                <div className='mx-2'>
                  <label htmlFor="" className='new-summary' style={{ fontSize: "18px" }}>NIBRS Missing Information</label>
                  <div className="d-flex flex-row flex-wrap mt-1">
                    {/* For when no reson code  */}
                    {missingField.ReasonCodeSuggestions &&
                      <div class="badge-bar px-2 py-2 mx-1 my-1">
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center">
                            <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                            <span class="badge-title">{missingField.ReasonCodeSuggestions}</span>
                          </div>
                          {/* tooltip */}
                          <OverlayTrigger
                            placement="top"
                            trigger={["hover", "focus"]}
                            overlay={
                              <Tooltip id="fmt-tip" className="wide-tooltip">
                                <div className="fw-bold mb-2" style={{ color: "red" }}><b>VALID FORMAT</b></div>
                                <div className="mb-1">
                                  <b>Please Enter Details In The Following Order:</b> Name, Reason Code, DOB, Age, Gender, Race, Ethnicity, Resident
                                </div>
                                <div style={{ wordBreak: "break-word" }}>
                                  <b>Example:</b> Maria Castillo (Victim) (DOB: 09/15/1986) (Age: 45) (Gender: Female) (Race: Unknown) (Ethnicity: Hispanic Or Latino) (Resident: Non-Resident)
                                </div>
                              </Tooltip>
                            }
                          >
                            <span className="badge-pill ml-3" style={{ cursor: "pointer" }}>
                              <i className="fa fa-exclamation" />
                            </span>
                          </OverlayTrigger>
                        </div>
                        <div className="d-flex align-items-center flex-wrap mt-0">
                          <span>
                            <span className="bullet"></span>
                            <span className="meta">Reason Code</span>
                          </span>
                        </div>
                      </div>
                    }

                    {/* For other missing field  */}
                    {missingField?.MissingFields?.length > 0 &&
                      missingField.MissingFields.map((p, idx) => {
                        if (!p?.REASON_CODE) return null;
                        const role = (p?.REASON_CODE || "").trim().toLowerCase();
                        const fields =
                          role === "victim"
                            ? ["AGE", "DOB", "RACE", "GENDER", "ETHNICITY", "RESIDENT"]
                            : ["AGE", "DOB", "RACE", "GENDER"]


                        // --- OR logic for AGE/DOB ---
                        const isEmpty = (v) => isEmptyCheck(v);
                        const hasAge = !isEmpty(p?.AGE);
                        const hasDob = !isEmpty(p?.DOB);

                        // start with naive missing
                        let missing = fields.filter((f) => isEmpty(p?.[f]));

                        // if either AGE or DOB exists, drop both from "missing"
                        if (fields.includes("AGE") && fields.includes("DOB") && (hasAge || hasDob)) {
                          missing = missing.filter((f) => f !== "AGE" && f !== "DOB");
                        }

                        if (missing.length === 0) return null; // nothing missing ⇒ skip

                        const labels = {
                          AGE: "Age",
                          DOB: "DOB",
                          RACE: "Race",
                          GENDER: "Gender",
                          ETHNICITY: "Ethnicity",
                          RESIDENT: "Resident",
                        };

                        const toTitleCaseList = (s = "") =>
                          s
                            .split(",")
                            .map(part =>
                              part
                                .trim()
                                .split(/\s+/)
                                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                                .join(" ")
                            )
                            .filter(Boolean)
                            .join(", ");

                        const roleLabel = role ? toTitleCaseList(role) : "";

                        return (
                          <div class="badge-bar px-2 py-2 mx-1 my-1">
                            <div class="d-flex align-items-center justify-content-between">
                              <div class="d-flex align-items-center">
                                <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                                <span class="badge-title">{roleLabel}: {p?.NAME}</span>
                              </div>
                              {/* tooltip */}
                              <OverlayTrigger
                                placement="top"
                                trigger={["hover", "focus"]}
                                overlay={
                                  <Tooltip id="fmt-tip" className="wide-tooltip">
                                    <div className="fw-bold mb-2" style={{ color: "red" }}><b>VALID FORMAT</b></div>
                                    <div className="mb-1">
                                      <b>Please Enter Details In The Following Order:</b> Name, Reason Code, DOB, Age, Gender, Race, Ethnicity, Resident
                                    </div>
                                    <div style={{ wordBreak: "break-word" }}>
                                      <b>Example:</b> Maria Castillo (Victim) (DOB: 09/15/1986) (Age: 45) (Gender: Female) (Race: Unknown) (Ethnicity: Hispanic Or Latino) (Resident: Non-Resident)
                                    </div>
                                  </Tooltip>
                                }
                              >
                                <span className="badge-pill ml-3" style={{ cursor: "pointer" }}>
                                  <i className="fa fa-exclamation" />
                                </span>
                              </OverlayTrigger>
                            </div>
                            <div className="d-flex align-items-center flex-wrap mt-0">
                              {missing.map((f) => (
                                <span key={f}>
                                  <span className="bullet"></span>
                                  <span className="meta">{labels[f]}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                    {missingField.ChargeCodeSuggestions &&
                      <div class="badge-bar px-2 py-2 mx-1 my-1">
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center">
                            <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                            <span class="badge-title">Charge Code</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center flex-wrap mt-0">
                          <span>
                            <span className="bullet"></span>
                            <span className="meta">Enter Charge Code</span>
                          </span>
                        </div>
                      </div>
                    }
                    {missingField?.VehicleSuggestions &&
                      <div class="badge-bar px-2 py-2 mx-1 my-1">
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center">
                            <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                            <span class="badge-title">Vehicle Missing Field</span>
                          </div>
                          {/* tooltip */}
                          <OverlayTrigger
                            placement="top"
                            trigger={["hover", "focus"]}
                            overlay={
                              <Tooltip id="fmt-tip" className="wide-tooltip">
                                <div className="fw-bold mb-2" style={{ color: "red" }}><b>VALID FORMAT</b></div>
                                <div className="mb-1">
                                  <b>Please Enter Details In The Following Order:</b> Vehicle, Plate State & No, Loss Code, Category, Plate Type
                                </div>
                                <div style={{ wordBreak: "break-word" }}>
                                  <b>Example:</b> Vehicle (TXLP#WHT7386) (Loss Code: Stolen) (Category: Automobile) (Plate Type: Ambulance)
                                </div>
                              </Tooltip>
                            }
                          >
                            <span className="badge-pill ml-3" style={{ cursor: "pointer" }}>
                              <i className="fa fa-exclamation" />
                            </span>
                          </OverlayTrigger>
                        </div>
                        <div className="d-flex align-items-center flex-wrap mt-0">
                          {missingField.VehicleSuggestions.split(",").map((f) => (
                            <span key={f}>
                              <span className="bullet"></span>
                              <span className="meta">{f}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    }
                    {missingField?.KeyWordHitsSuggestions &&
                      <div class="badge-bar px-2 py-2 mx-1 my-1">
                        <div class="d-flex align-items-center justify-content-between">
                          <div class="d-flex align-items-center">
                            <span class="badge-pill mr-2"><i class="fa fa-times"></i></span>
                            <span class="badge-title">Charge Code</span>
                          </div>

                        </div>
                        <div className="d-flex align-items-center flex-wrap mt-0">
                          {missingField.KeyWordHitsSuggestions.split(",").map((f) => {
                            const formatted = f.trim().replace(/\b\w/g, (c) => c.toUpperCase());
                            return (
                              <span key={f}>
                                <span className="bullet"></span>
                                <span className="meta">{formatted}</span>
                              </span>
                            );
                          })}

                        </div>
                      </div>
                    }

                  </div>
                </div>}

              <ReactQuill
                className={`editor-class ${value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') && !IsSuperadmin && !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID)) ? 'readonly' : ''}`}
                disabled={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') &&
                  !IsSuperadmin &&
                  !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}

                readOnly={value.Status === 'Pending Review' || value.Status === 'Approved' || ((value.Status === 'Draft' || value.Status === 'Rejected') && !IsSuperadmin && !(value.ReportedByPINActivityID === loginPinID || value.WrittenForID === loginPinID))}
                value={value.CommentsDoc}
                onChange={(value, delta, source, editor) => {
                  const text = editor?.getText();
                  // setChangesStatus(true); 
                  setStatesChangeStatus(true);

                  setValue((prevValue) => ({
                    ...prevValue,
                    Comments: text,
                    CommentsDoc: value,
                  }));

                }}
                modules={modules}
                formats={formats}
                editorProps={{ spellCheck: true }}
                theme="snow"
                placeholder="Write something..."
                style={{
                  minHeight: 'auto',
                  maxHeight: 'auto',
                  overflowY: 'auto',
                }}
              />

              {errors.CommentsError !== 'true' ? (
                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.CommentsError}</span>
              ) : null}
            </span>
          }

          {(value.Status === 'Approved' && !isNormalReport) &&
            <span>
              {detectedWords.length > 0 &&
                <div className='mx-2'>
                  <label htmlFor="" className='new-summary' style={{ fontSize: "18px" }}>Redact Data</label>
                  <div className="d-flex flex-row flex-wrap mt-1">

                    {detectedWords.map((word, index) => (
                      <>
                        <button
                          key={index}
                          type="button"
                          className="btn btn-success mr-2 mb-0.5 py-1 px-1.5" // 'me-3' adds space to the right and 'mb-2' adds space below
                          onClick={() => {
                            const quill = document.querySelector(".ql-editor");
                            if (quill) {
                              const quillInstance = quill.closest(".ql-container").__quill;
                              toggleRedactFromHeaderButton(quillInstance, word);
                            }
                          }}
                        >
                          {word}
                        </button>
                      </>
                    ))}
                  </div>
                </div>
              }
              <ReactQuill
                ref={quillRef}
                className="editor-class"
                value={redactedComment}
                onChange={(value) => {
                  setChangesStatus(true);
                  setStatesChangeStatus(true);
                  setRedactedComment(value)
                }}
                modules={redactModules}
                formats={formats}
                editorProps={{ spellCheck: true }}
                theme="snow"
                placeholder="Write something..."
                style={{
                  minHeight: 'auto',
                  maxHeight: 'auto',
                  overflowY: 'auto',
                }}
                onKeyDown={handleKeyDown}
              />
              <style jsx>
                {`
                ::selection {
                   background: #000000 !important;  /* Red background for normal selection */
                    color: #000000 !important;  /* White text for normal selection */
                 }
                .ql-toolbar .ql-redact {
                    width: auto !important; /* Ensure it takes the width of the content */
                    min-width: 60px; /* Set a reasonable minimum width */
                    padding: 4px 10px; /* Add more padding if needed */
                    text-align: center; /* Center the text */
                    white-space: nowrap; /* Prevent text from wrapping */
                }
                  .ql-redact::before {
                    content: "REDACT";
                    font-size: 16px;
                    color:blue;
                    font-weight: normal;
                }
                .ql-editor .redacted::selection {
                    background: transparent !important; 
                    color: transparent !important;
                  }
              `}
              </style>
            </span>
          }
        </div>
      </div >
      <div className="col-12">
        {/* Approval  */}
        <div className="row ">
          {
            narrativeID ?
              <>
                <div className="col-12 col-md-12 col-lg-12">
                  <div className="row ">
                    {(value.Status === 'Approved' && !isNormalReport) ?
                      <></>
                      :
                      <>
                        <div className="col-2 col-md-2 col-lg-1 mt-4 ">
                          <div className="form-check ml-2">
                            <input
                              type="radio"
                              name="approverType"
                              value="Individual"
                              className="form-check-input"
                              checked={selectedOption === "Individual"}
                              onChange={handleRadioChange}
                              disabled={value.Status === 'Pending Review' || value.Status === 'Approved' ? true : false}
                            />
                            <label className="form-check-label" htmlFor="Individual">
                              Individual
                            </label>
                          </div>
                        </div>
                        <div className="col-2 col-md-2 col-lg-1 mt-4 ">
                          <div className="form-check ml-2">
                            <input
                              type="radio"
                              name="approverType"
                              value="Group"
                              className="form-check-input"
                              checked={selectedOption === "Group"}
                              disabled={value.Status === 'Pending Review' || value.Status === 'Approved' ? true : false}
                              onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="Group">
                              Group
                            </label>
                          </div>
                        </div>
                        {selectedOption === "Individual" ? (
                          <>
                            <div className="col-10 col-lg-7 dropdown__box d-flex align-items-center ">
                              <span htmlFor="" className='label-name '
                                style={{ marginRight: '10px', flexGrow: 1, whiteSpace: 'nowrap', fontSize: '13px' }}
                              >
                                Report Approver{errors.ApprovingOfficerError !== 'true' ? (
                                  <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ApprovingOfficerError}</p>
                                ) : null}
                              </span>
                              <SelectBox
                                className="custom-multiselect w-100"
                                classNamePrefix="custom"
                                options={reportApproveOfficer}
                                isMulti
                                styles={colourStylesUsers}
                                isDisabled={
                                  value.Status?.trim() === 'Approved' || value.Status === 'Pending Review' ||
                                  (!IsSuperadmin && value.ReportedByPINActivityID != loginPinID && value.Status === 'Draft')
                                }
                                closeMenuOnSelect={false}
                                hideSelectedOptions={true}
                                onChange={Agencychange}
                                allowSelectAll={reportApproveOfficer.length > 0 ? true : false}
                                value={multiSelected.optionSelected}
                              />

                            </div>

                          </>
                        ) : (
                          <>
                            <div className="col-10 col-lg-7 dropdown__box d-flex align-items-center ">
                              <span htmlFor="" className='label-name'
                                style={{ marginRight: '10px', flexGrow: 1, whiteSpace: 'nowrap', fontSize: '13px' }}>  Approval Group{errors.ApprovingOfficerError !== 'true' ? (
                                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ApprovingOfficerError}
                                  </p>
                                ) : null}</span>
                              <SelectBox
                                className="custom-multiselect w-100"
                                classNamePrefix="custom"
                                options={groupList}
                                isMulti
                                styles={colourStylesUsers}
                                isDisabled={
                                  value.Status?.trim() === 'Approved' || value.Status === 'Pending Review' ||
                                  (!IsSuperadmin && value.ReportedByPINActivityID != loginPinID && value.Status === 'Draft')
                                }
                                closeMenuOnSelect={false}
                                hideSelectedOptions={true}
                                onChange={Agencychange}
                                allowSelectAll={true}
                                value={multiSelected.optionSelected}
                              />
                            </div>

                          </>
                        )}
                      </>
                    }

                  </div>
                </div>

              </> :
              <></>
          }

        </div>

        {/* Action Button */}
        <div className="col-12 col-md-12 col-lg-12 text-right mb-2 mt-2 ">
          <div className='row justify-content-end align-items-center'>

            <ul className='d-flex  align-items-center ' style={{ columnGap: "10px", listStyle: "none" }}>
              <li>
                {(isSupervisor || isSuperadmin) && !narrativeAssignId && !narrativeID && (
                  <div className=''>
                    <button
                      type="button"
                      data-toggle="modal"
                      data-target="#QueueReportsModall"
                      onClick={() => setshowModal(true)}
                      style={{ backgroundColor: "#001f3f", color: "#fff" }}
                      className="btn"
                    >
                      Assign a New Report
                    </button>
                  </div>
                )}



                {/* {
                  narrativeID && value.Status != "Pending Review" && value.Status != "Rejected" && value.Status != "Approved" || narrativeID && value.Status === "Rejected" && value.ReportedByPINActivityID === loginPinID  ? <>
                    <div className=" ">
                      <button type="button" disabled={((value.ReportedByPINActivityID != loginPinID && value.Status === 'Draft') || value.Status === 'Approved') ? true : false} onClick={(e) => { check_Validation_ErrorApproval(); }} className="btn btn-sm btn-success"  >Send For Approval</button>
                    </div>
                  </> :
                    <></>
                } */}
                {
                  checkWebWorkFlowStatus ? (
                    narrativeID && (
                      (value.Status !== "Pending Review" &&
                        value.Status !== "Rejected" &&
                        value.Status !== "Approved") ||
                      (value.Status === "Rejected" && value.ReportedByPINActivityID === loginPinID)
                    ) ? (
                      <div className=" ">
                        <button
                          type="button"
                          disabled={
                            value.ReportedByPINActivityID !== loginPinID &&
                              value.Status === 'Draft' ||
                              value.Status === 'Approved'
                              ? true
                              : false
                          }
                          onClick={(e) => {
                            check_Validation_ErrorApproval();
                          }}
                          className="btn btn-sm btn-success"
                        >
                          Send For Approval
                        </button>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : null
                }
                {
                  IsSelfApproved ? (
                    narrativeID && (
                      (value.Status !== "Pending Review" &&
                        value.Status !== "Rejected" &&
                        value.Status !== "Approved") ||
                      (value.Status === "Rejected" && value.ReportedByPINActivityID === loginPinID)
                    ) ? (
                      <div className=" ">
                        <button
                          type="button"
                          disabled={
                            value.ReportedByPINActivityID !== loginPinID &&
                              value.Status === 'Draft' ||
                              value.Status === 'Approved'
                              ? true
                              : false
                          }
                          onClick={(e) => {
                            Add_Type_Comments();
                          }}
                          className="btn btn-sm btn-success"
                        >
                          Approved
                        </button>
                      </div>
                    ) : (
                      <></>
                    )
                  ) : null
                }
                {/* {
                  IsSelfApproved ?
                    <>
                      <div className=" ">
                        <button
                          type="button"
                          onClick={(e) => {
                            Add_Type_Comments();
                          }}
                          className="btn btn-sm btn-success"
                        >
                          Approved
                        </button>
                      </div>
                    </> : <></>


                } */}

              </li>
              <li className=''>
                <button type="button" className="btn btn-sm btn-success mr-1 " onClick={() => { reset(); }}>New</button>
                {
                  narrativeID && !(NarrativeAssignId && tabParam && assigned) || narrativeID ?
                    effectiveScreenPermission ?
                      effectiveScreenPermission[0]?.Changeok ?
                        <>
                          <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">{value.Status === "Approved" ? "Save Redact" : "Update"}</button>
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
                        </>

                        :
                        <>
                        </>
                      :
                      <>
                        <button type="button" disabled={!statesChangeStatus || value.Status === 'Pending Review' || value.Status === 'Approve'} onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">{value.Status === "Approved" ? "Save Redact" : "Update"}</button>
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
                      </>

                    :
                    effectiveScreenPermission ?
                      effectiveScreenPermission[0]?.AddOK ?
                        <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">Save</button>
                        :
                        <>
                        </>
                      :
                      <button type="button" onClick={() => check_Validation_Error()} className="btn btn-sm btn-success pl-2 ">Save</button>
                }
              </li>


            </ul>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="col-12 px-0 mt-1" >
        {
          loder ?
            <DataTable
              showHeader={true}
              persistTableHead={true}
              dense
              columns={columns}
              data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? narrativeData : '' : narrativeData}
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
              highlightOnHover
              customStyles={tableCustomStyles}
              conditionalRowStyles={conditionalRowStyles}
              onRowClicked={(row) => {
                if (row?.NarrativeDescription === "Use Of Force") {
                  row?.ArrestID ? (
                    navigate(`/Arrest-Home?IncId=${stringToBase64(row?.IncidentId)}&IncNo=${(row?.IncidentNumber)}&IncSta=${true}&ArrestId=${stringToBase64(row?.ArrestID)}&ArrNo=${stringToBase64(row?.ArrestNumber)}&isFromDashboard=true`)
                  ) : (
                    navigate(`/Inc-Home?IncId=${stringToBase64(row?.IncidentId)}&IncNo=${row?.IncidentNumber}&IncSta=true&isFromDashboard=true`)
                  )
                }
                else {
                  setIsUpdated(false); setNormalReport(true); editNarratives(row);
                }
              }}
              pagination
              paginationPerPage={'100'}
              paginationRowsPerPageOptions={[100, 150, 200, 500]}
              showPaginationBottom={100}
              fixedHeaderScrollHeight='255px'
              fixedHeader
            />
            :
            <Loader />
        }
      </div>
      {/* <IdentifyFieldColor /> */}
      <ChangesModal func={check_Validation_Error} />
      <DeletePopUpModal func={DeleteNarratives} />
      <CurrentIncMasterReport
        incNumber={IncNo}
        incidentID={IncID}
        isRedactedReport={!isPreviewNormalReport}
        {...{
          printIncReport,
          setIncMasterReport,
          showModal,
          setShowModal,
          IncReportCount,
          setIncReportCount,
        }}
      />
      <NarrativeModal incidentID={incidentID} showModalAssign={showModalAssign} loginAgencyID={loginAgencyID} primaryOfficer={primaryOfficer} narrativeTypeCode={narrativeTypeCode} nibrsStatus={nibrsStatus} setshowModal={setshowModal} loginPinID={loginPinID} value={value} show={showModal}
      />

    </>
  )
}
export default Narrative;


const NarrativeModal = (props) => {

  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const agencyOfficerFullNameDrpData = useSelector((state) => state.DropDown.agencyOfficerFullNameDrpData);
  const localStoreData = useSelector((state) => state?.Agency?.localStoreData);
  const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);
  const [writtenForID, setWrittenForID] = useState([]);
  const [typeCode, settypeCode] = useState('');
  const { incidentID, nibrsStatus, loginPinID, setshowModal, showModalAssign, primaryOfficer, loginAgencyID, narrativeTypeCode } = props
  const dispatch = useDispatch()
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

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

  const rejectColumns = [
    { name: 'Rejected By', selector: row => row.ApprovingOfficer, sortable: true },
    { name: 'Reason For Rejection', selector: row => row.Comments, sortable: true },
    { name: 'Date Of Rejection', selector: row => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : '', sortable: true },
  ];


  const [value, setValue] = useState({
    'CommentsDoc': '', 'IncidentId': '', 'NarrativeID': '', 'Comments': '', 'AssignComment': '', 'ReportType': '',
    'ReportedByPINActivityID': null, 'NarrativeTypeID': null, 'AsOfDate': null,
    'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'ApprovingSupervisorID': '', 'OfficerID': '',
    'IncidentID': ''
  })

  const [errors, setErrors] = useState({
    'OfficerError': '', 'NarrativeIDError': '', 'AssignCommentError': ''
  })


  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (typeCode?.toLowerCase() === 'ni') {
      setValue({ ...value, 'OfficerID': primaryOfficer, });
    }
    else {
      setValue({ ...value, 'OfficerID': '', });
    }

  }, [writtenForID])



  const Get_WrittenForDataDrp = async (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    await fetchPostData('Narrative/GetData_WrittenForOfficer', val).then((data) => {
      if (data) {
        setWrittenForID(changeArrayFormat_Active_InActive(data, 'PINID', 'HeadOfAgency', 'IsActive'));

      } else {
        setWrittenForID([]);
      }
    })
  }

  useEffect(() => {
    if (localStoreData) {
      dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID))
    }
  }, [localStoreData, IncID]);



  // const colourStyles = {
  //   control: (styles) => ({
  //     ...styles,
  //     backgroundColor: "#fce9bf",
  //     height: 20,
  //     minHeight: 35,
  //     fontSize: 14,
  //     margintop: 2,
  //     boxShadow: 0,
  //   }),
  // }

  const colourStylesUsers = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      backgroundColor: isDisabled ? '#9d949436' : '#fce9bf',
      fontSize: 14,
      marginTop: 2,
      boxShadow: 'none',
      cursor: isDisabled ? 'not-allowed' : 'default',
    }),
  };



  const check_Validation_Error = () => {

    const OfficerErr = RequiredFieldIncident(value?.OfficerID);
    const NarrativeTypeIDErr = RequiredFieldIncident(value.NarrativeTypeID);
    const AssignCommentErr = 'true';

    setErrors((prevValues) => {
      return {
        ...prevValues,
        ["OfficerError"]: OfficerErr || prevValues["OfficerError"],
        ["NarrativeIDError"]: NarrativeTypeIDErr || prevValues["NarrativeIDError"],
        ["AssignCommentError"]: AssignCommentErr || prevValues["AssignCommentError"],
      };
    });

  }

  const { OfficerError, NarrativeIDError, AssignCommentError } = errors

  useEffect(() => {
    if (OfficerError === 'true' && NarrativeIDError === 'true' && AssignCommentError === 'true') {
      submit()
    }
  }, [OfficerError, NarrativeIDError, AssignCommentError])

  const ChangeDropDown = (e, name) => {
    if (e) {
      if (name === 'NarrativeTypeID') {
        settypeCode(e.type)
        setValue({ ...value, [name]: e.value, 'ReportType': e.type });
        if (e.type.toLowerCase() === 'ni') {
          Get_WrittenForDataDrp(loginAgencyID, IncID);
        }

      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === 'NarrativeTypeID') {
        setValue({ ...value, [name]: null, 'ReportType': '' });
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  }

  const submit = () => {
    const {
      NarrativeTypeID,
      OfficerID, AssignComment,
    } = value;
    const val = {
      OfficerID: OfficerID,
      NarrativeTypeID: NarrativeTypeID,
      IncidentID: incidentID,
      CreatedByUserFK: loginPinID,
      AssignComment: AssignComment,
    };
    AddDeleteUpadate('IncidentNarrativeAssigned/Insert_IncidentNarrativeAssigned', val)
      .then((res) => {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        setshowModal(false);
        resetOfficers();
        setErrors({ ...errors, ['AssignCommentError']: '', });
      })
  }

  const resetOfficers = () => {
    setValue({
      ...value,
      'IncidentId': '', 'OfficerID': '', 'NarrativeTypeID': '', 'ReportType': '', 'AssignComment': '',
    });
    settypeCode('')

    setErrors({ ...errors, ['OfficerError']: '', ['NarrativeIDError']: '', ['AssignCommentError']: '' })

  }

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      resetOfficers();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);



  return (
    <>
      {showModalAssign && (
        <div class="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="QueueReportsModall" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content p-2 px-4 approvedReportsModal" >
              <div className='d-flex justify-content-between'>
                <h5 className="fw-bold">Assign Report</h5>
                <button className="btn-close b-none bg-transparent text-right" onClick={() => { resetOfficers(); setshowModal(false) }} data-dismiss="modal">X</button>
              </div>
              <div className="d-flex ">
                <div className='col-lg-12'>
                  <div className="row">
                    <div className="col-4 col-md-4 col-lg-2 mt-2 pt-2">
                      <label htmlFor="" className='new-label'>Assigned Officer {errors.OfficerError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OfficerError}</p>
                      ) : null} </label>
                    </div>
                    <div className="col-7 col-md-7 col-lg-6 mt-2 ">
                      <Select
                        name='OfficerID'
                        isClearable
                        // styles={colourStyles}
                        value={agencyOfficerFullNameDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                        options={agencyOfficerFullNameDrpData}
                        // value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.OfficerID)}
                        // options={agencyOfficerDrpData}
                        onChange={(e) => ChangeDropDown(e, 'OfficerID')}
                        placeholder="Select.."
                        styles={
                          typeCode.toLowerCase() === 'ni'
                            ? colourStylesUsers
                            :
                            Requiredcolour
                        }
                        isDisabled={typeCode.toLowerCase() === 'ni'}
                        menuPlacement="bottom"
                      />
                    </div>
                    <div className='col-lg-4'></div>
                    <div className="col-4 col-md-4 col-lg-2 mt-2 pt-2">
                      <label htmlFor="" className='new-label'>Report Type {errors.NarrativeIDError !== 'true' ? (
                        <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NarrativeIDError}</p>
                      ) : null} </label>
                    </div>
                    <div className="col-7 col-md-7 col-lg-6 mt-2 ">
                      <Select
                        name='NarrativeTypeID'
                        isClearable
                        styles={Requiredcolour}
                        value={narrativeTypeDrpData?.filter((obj) => obj.value === value?.NarrativeTypeID)}
                        options={narrativeTypeDrpData}
                        onChange={(e) => ChangeDropDown(e, 'NarrativeTypeID', 'NarrativeTypeCode')}
                        placeholder="Select.."
                        menuPlacement="bottom"
                      />
                    </div>
                    <div className='col-lg-4'></div>

                  </div>
                  {Array.isArray(nibrsStatus) && (
                    (nibrsStatus.includes("CASE CLOSED") && nibrsStatus.includes("NIBRS SUBMITTED")) && (
                      <div className="mt-3">
                        <div className="alert alert-danger p-2" role="alert" style={{ fontSize: "14px", border: "1px solid red" }}>
                          <strong style={{ color: "#000" }}>NOTE:</strong> The case is currently closed. The officer will only be able to submit a supplement narrative.
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className='col-6 col-md-4 col-lg-12 mt-2 d-flex text-right ' style={{ justifyContent: "flex-end" }}>
                <button type="button" style={{ backgroundColor: "#001f3f", color: "#fff" }} className="btn  mr-1 mb-2" onClick={() => check_Validation_Error()} >Save</button>
                <button type="button" style={{ border: " 1px solid#001f3f", color: "#001f3f" }} data-dismiss="modal" onClick={() => { resetOfficers(); setshowModal(false) }} className="btn  pl-2 mb-2">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>


  );
};



