import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { Link, useLocation } from "react-router-dom";
import {
  base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, customStylesWithOutColor, Decrypt_Id_Name, getShowingMonthDateYear, getShowingWithOutTime, isLockOrRestrictModule, LockFildscolour, Requiredcolour,
} from "../../../../Common/Utility";
import { useSelector, useDispatch } from "react-redux";
import { get_LocalStoreData } from "../../../../../redux/actions/Agency";
import { AddDelete_Img, AddDeleteUpadate, fetchPostData } from "../../../../hooks/Api";
import { toastifyError, toastifySuccess } from "../../../../Common/AlertMsg";
import VehicleListing from "../../../ShowAllList/VehicleListing";
import ChangesModal from "../../../../Common/ChangesModal";
import { get_Report_Approve_Officer_Data, get_ScreenPermissions_Data, } from "../../../../../redux/actions/IncidentAction";
import { MasterVehicle_ID } from "../../../../../redux/actionTypes";
import { RequiredFieldIncident } from "../../../Utility/Personnel/Validation";
import { get_AgencyOfficer_Data, get_Narrative_Type_Drp_Data } from "../../../../../redux/actions/DropDownsData";
import SelectBox from "../../../../Common/SelectBox";
import SendPropertyConfirmModel from "../../../../Common/SendPropertyConfirmModel";

const AddInformation = (props) => {

  const { ListData, DecVehId, DecMVehId, propertystatus, setIsNonPropertyRoomSelected, setPropertyStatus, isViewEventDetails = false, isLocked, setIsLocked } = props;
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem("UniqueUserID") ? Decrypt_Id_Name(sessionStorage.getItem("UniqueUserID"), "UForUniqueUserID") : "";
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
  const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
  const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

  const { setChangesStatus, GetDataTimeZone, incidentReportedDate } = useContext(AgencyContext);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param),
    };
  };


  const fileInputRef = useRef(null);

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));
  let MstVehicle = query?.get("page");

  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [loginPinID, setLoginPinID] = useState("");
  const [mainIncidentID, setMainIncidentID] = useState("");
  const [editval, setEditval] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [masterPropertyID, setMasterPropertyID] = useState("");
  const [updateCount, setUpdateCount] = useState(0);
  const [evidenceChecked, setEvidenceChecked] = useState(false);
  const [isNonPropertyRoom, setIsNonPropertyRoom] = useState(false);
  const [collectiondate, setCollectiondate] = useState();
  const [dispatchdate, setdisPatchdate] = useState();
  const [expectedArrival, setexpectedArrival] = useState();
  const [sendTaskDrp, setSendTaskDrp] = useState([]);
  const [sendTaskId, setSendTaskId] = useState([]);
  const [taskEditVal, setTaskEditVal] = useState([]);
  const [taskListModalStatus, setTaskListModalStatus] = useState(false);
  const [task, setTask] = useState("");
  const [taskListStatus, setTaskListStatus] = useState("");
  const [taskToSend, setTaskToSend] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [PropertyRoomStatus, setPropertyRoomStatus] = useState("");
  const [IsEvidenceStatus, setIsEvidenceStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Individual");
  const [multiSelected, setMultiSelected] = useState({ optionSelected: null });
  const [groupList, setGroupList] = useState([]);
  const [fileUploadStatus, setfileUploadStatus] = useState(false);
  // permissions
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [IsNonPropertyStatus, setIsNonPropertyStatus] = useState(false);
  const [SendToPropertyRoomStatus, setSendToPropertyRoomStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [LastTask, setLastTask] = useState("");

  const [value, setValue] = useState({
    ReportedDtTm: "", TagID: "", DestroyDtTm: "", IncidentID: "", IsImmobalizationDevice: "", IsEligibleForImmobalization: "", IsMaster: MstVehicle === "MST-Vehicle-Dash" ? true : false, MasterPropertyID: "", PropertyID: "", AgencyID: "", PropertyTag: "", NICBID: "", Description: "",
    IsSendToPropertyRoom: true, ModifiedByUserFK: "", CollectingOfficer: "", LocationOfCollection: "", EvidenceDescription: "", CollectionDtTm: "",
    IsSendToTaskList: true, IsNonPropertyRoom: "", IsEvidence: "", Reason: "", DispatchDtTm: "", ExpectedDtTm: "", DispatchingOfficer: "", FileAttachment1: "", Summary: "", LabLocation: "", LabName: "", TestPerformed: "", FileAttachment: "", PackagingDetails: "", Destination: "", ModOfTransport: "", Recipient: "", DispatchingOfficer: "", Comments: "", OfficerID: "",
  });

  const [errors, setErrors] = useState({
    CollectionDtTmError: "", CollectingOfficerError: "",
  });

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID); dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID))
      dispatch(get_ScreenPermissions_Data("V093", localStoreData?.AgencyID, localStoreData?.PINID)); GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (DecVehId) {
      setValue({ ...value, PropertyID: DecVehId, ModifiedByUserFK: "", AgencyID: loginAgencyID, CreatedByUserFK: loginPinID, IncidentID: IncID, });
      Get_TaskList_Status(DecVehId, loginAgencyID);
    }
  }, [DecVehId]);

  useEffect(() => {
    if (DecVehId || DecMVehId) {
      setVehicleId(DecVehId); GetSingleData(DecVehId, DecMVehId); GetDataDocument(DecVehId, DecMVehId, loginPinID); Get_SendTask_Data(DecVehId, DecMVehId);
    }
  }, [DecVehId, DecMVehId]);

  const GetSingleData = (PropertyID, masterPropertyID) => {
    const val = {
      PropertyID: PropertyID, MasterPropertyID: masterPropertyID, IsMaster: MstVehicle === "MST-Vehicle-Dash" ? true : false,
    };
    const val2 = { MasterPropertyID: masterPropertyID };
    fetchPostData("PropertyVehicle/GetSingleData_PropertyVehicle", val).then(
      (res) => {
        if (res) {
          setEditval(res);
          setPropertyRoomStatus(res[0]?.PropertyRoomStatus);
          setIsNonPropertyStatus(res[0]?.IsNonPropertyRoom);
          setSendToPropertyRoomStatus(res[0]?.IsSendToPropertyRoom);
        } else {
          setEditval([]);
        }
      }
    );
  };

  const HandleChanges1 = (e) => {
    !addUpdatePermission && setChangesStatus(true);
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e.target.name === "IsImmobalizationDevice" || e.target.name === "IsEligibleForImmobalization" || e.target.name === "IsSendToPropertyRoom"
    ) {
      setValue({ ...value, [e.target.name]: e.target.checked, });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value, });
    }
  };

  useEffect(() => {
    if (taskEditVal) {
      setSendTaskId(taskEditVal);
    }
  }, [taskEditVal]);


  useEffect(() => {
    if (editval) {
      // const IsSendToPropertyRoom = editval[0].IsSendToPropertyRoom === false && editval[0].CollectionDtTm === null && editval[0].CollectingOfficer === null ? true : editval[0]?.IsSendToPropertyRoom;
      const IsSendToPropertyRoom = editval[0]?.IsSendToPropertyRoom === false && (editval[0]?.CollectionDtTm === null || editval[0]?.CollectionDtTm === undefined) &&
        (editval[0]?.CollectingOfficer === null || editval[0]?.CollectingOfficer === undefined)
        ? true
        : editval[0]?.IsSendToPropertyRoom;

      dispatch({ type: MasterVehicle_ID, payload: editval[0]?.MasterPropertyID, });
      let tempTasklistStatus = null;
      if (!editval[0]?.IsNonPropertyRoom) {
        tempTasklistStatus = true;
      } else {
        tempTasklistStatus = editval[0]?.IsSendToTaskList;
      }
      setValue({
        ...value,
        MasterPropertyID: DecMVehId, PropertyID: DecVehId, IsImmobalizationDevice: editval[0]?.IsImmobalizationDevice, IsEligibleForImmobalization: editval[0]?.IsEligibleForImmobalization, DestroyDtTm: editval[0]?.DestroyDtTm ? getShowingWithOutTime(editval[0]?.DestroyDtTm) : null,
        Description: editval[0]?.Description, NICB: editval[0]?.NICB, PropertyTag: editval[0]?.PropertyTag, IsSendToPropertyRoom: IsSendToPropertyRoom,
        CollectingOfficer: editval[0]?.CollectingOfficer, LocationOfCollection: editval[0]?.LocationOfCollection, EvidenceDescription: editval[0]?.EvidenceDescription,
        CollectionDtTm: editval[0]?.CollectionDtTm, IsEvidence: editval[0]?.IsEvidence, Comments: editval[0]?.Comments, IsNonPropertyRoom: editval[0]?.IsNonPropertyRoom,
        ReportedDtTm: editval[0]?.ReportedDtTm, IsSendToTaskList: tempTasklistStatus, Reason: editval[0]?.Reason, DispatchDtTm: editval[0]?.DispatchDtTm,
        ExpectedDtTm: editval[0]?.ExpectedDtTm, DispatchingOfficer: editval[0]?.DispatchingOfficer, Summary: editval[0]?.Summary, LabLocation: editval[0]?.LabLocation,
        LabName: editval[0]?.LabName, TestPerformed: editval[0]?.TestPerformed, PackagingDetails: editval[0]?.PackagingDetails, Destination: editval[0]?.Destination,
        ModOfTransport: editval[0]?.ModOfTransport, Recipient: editval[0]?.Recipient, DispatchingOfficer: editval[0]?.DispatchingOfficer,
      });
      setIsEvidenceStatus(editval[0]?.IsEvidence); setCollectiondate(
        editval[0]?.CollectionDtTm ? new Date(editval[0]?.CollectionDtTm) : ""
      );
      setdisPatchdate(editval[0]?.DispatchDtTm ? new Date(editval[0]?.DispatchDtTm) : ""); setexpectedArrival(editval[0]?.ExpectedDtTm ? new Date(editval[0]?.ExpectedDtTm) : "");
      setMasterPropertyID(editval[0]?.MasterPropertyID);
      if (editval[0]?.IsSendToPropertyRoom) { setPropertyStatus(true); }
      else { setPropertyStatus(false); }
    }
  }, [editval, updateCount]);

  const Reset = (e) => {
    setValue({
      ...value, MasterPropertyID: "", PropertyID: "", Task: "", AgencyID: "", IncidentID: "", ReportedDtTm: "", DestroyDtTm: "", PropertyTag: "", NICB: "", Description: "", IsSendToPropertyRoom: true, IsMaster: MstVehicle === "MST-Vehicle-Dash" ? true : false, IsSendToTaskList: true, ModifiedByUserFK: "", CollectingOfficer: "", LocationOfCollection: "", EvidenceDescription: "", CollectionDtTm: "", IsNonPropertyRoom: "", IsEvidence: "", Reason: "", DispatchDtTm: "", ExpectedDtTm: "", DispatchingOfficer: "", FileAttachment1: "", Summary: "", LabLocation: "", LabName: "", TestPerformed: "", FileAttachment: "", PackagingDetails: "", Destination: "", ModOfTransport: "", Recipient: "", DispatchingOfficer: "", Comments: "",
    });
    setErrors({ ...errors, CollectionDtTmError: "", CollectingOfficerError: "", }); setStatesChangeStatus(false); setCollectiondate(""); setdisPatchdate(""); setexpectedArrival(""); setfileUploadStatus(false);
    if (editval[0]?.Description?.length > 0) {
      setUpdateCount(updateCount + 1);
    }
  };

  const check_Validation_Error = (e) => {
    const CollectionDtTmErr = value.IsEvidence ? RequiredFieldIncident(value?.CollectionDtTm) : "true";
    const CollectingOfficerErr = value.IsEvidence ? RequiredFieldIncident(value?.CollectingOfficer) : "true";
    const ReasonErr = value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence ? RequiredFieldIncident(value?.Reason) : "true";
    const DispatchErr = value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence ? RequiredFieldIncident(value?.DispatchDtTm) : "true";
    const DispatchingOfficerErr = value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence ? RequiredFieldIncident(value?.DispatchingOfficer) : "true";
    const ReceipientErr = value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence ? RequiredFieldIncident(value?.Recipient) : "true";
    setErrors((prevValues) => {
      return {
        ...prevValues,
        ["CollectionDtTmError"]: CollectionDtTmErr || prevValues["CollectionDtTmError"],
        ["CollectingOfficerError"]: CollectingOfficerErr || prevValues["CollectingOfficerError"],
        ["ReasonError"]: ReasonErr || prevValues["ReasonError"],
        ["DispatchError"]: DispatchErr || prevValues["DispatchError"],
        ["DispatchingOfficerError"]: DispatchingOfficerErr || prevValues["DispatchingOfficerError"],
        ["ReceipientError"]: ReceipientErr || prevValues["ReceipientError"],
      };
    });
  };
  const { CollectionDtTmError, CollectingOfficerError, ReasonError, DispatchError, DispatchingOfficerError, ReceipientError,
  } = errors;

  useEffect(() => {
    if (CollectionDtTmError === "true" && CollectingOfficerError === "true" && ReasonError === "true" && DispatchError === "true" && DispatchingOfficerError === "true" && ReceipientError === "true"
    ) {
      if (value.IsSendToPropertyRoom || value.IsNonPropertyRoom) {
        Update_Name();
      } else {
        toastifyError("Select Property Room Type");
      }
    }
  }, [CollectionDtTmError, CollectingOfficerError, ReasonError, DispatchError, DispatchingOfficerError, ReceipientError,]);

  const Get_TaskList_Status = (PropertyID) => {
    const val = { PropertyID: PropertyID, AgencyID: localStoreData?.AgencyID };
    fetchPostData("Propertyroom/SearchPropertyRoom", val)
      .then((res) => {
        if (res) {
          const obj = res.filter((item) => item?.PropertyID === PropertyID);
        } else {
          console.log("res of Get_TaskList_Status::", res);
        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };

  const Update_Name = () => {
    const { MasterPropertyID, MProId, PropertyID, ProId, AgencyID, IncidentID, IncID, IsImmobalizationDevice, IsEligibleForImmobalization, DestroyDtTm, PropertyTag, NICBID, Description, TagID, IsSendToPropertyRoom, ModifiedByUserFK, IsMaster, IsSendToTaskList, CollectingOfficer, LocationOfCollection, EvidenceDescription, CollectionDtTm, IsNonPropertyRoom, IsEvidence, Task, Reason, DispatchDtTm, ExpectedDtTm, DispatchingOfficer, Comments, Recipient, ModOfTransport, Destination, PackagingDetails, FileAttachment, TestPerformed, LabName, LabLocation, Summary, FileAttachment1,
    } = value;
    const val = {
      CreatedByUserFK: loginPinID, MasterPropertyID: masterPropertyID, PropertyID: PropertyID, AgencyID: loginAgencyID, IsMaster: IsMaster, IncidentID: IncidentID, IsSendToPropertyRoom: IsSendToPropertyRoom, ModifiedByUserFK: loginPinID, IsImmobalizationDevice: IsImmobalizationDevice, DestroyDtTm: DestroyDtTm, PropertyTag: PropertyTag, NICBID: NICBID, Description: Description, CollectingOfficer: CollectingOfficer, LocationOfCollection: LocationOfCollection, EvidenceDescription: EvidenceDescription, CollectionDtTm: CollectionDtTm, IsEligibleForImmobalization: IsEligibleForImmobalization, IsNonPropertyRoom: IsNonPropertyRoom, IsEvidence: IsEvidence, Task: Task, IsSendToTaskList: IsSendToTaskList, Reason: Reason, DispatchDtTm: DispatchDtTm, ExpectedDtTm: ExpectedDtTm, DispatchingOfficer: DispatchingOfficer, Summary: Summary, LabLocation: LabLocation, LabName: LabName, TestPerformed: TestPerformed, PackagingDetails: PackagingDetails, Destination: Destination, ModOfTransport: ModOfTransport, TagID: TagID, Recipient: Recipient, DispatchingOfficer: DispatchingOfficer, Comments: Comments,
    };
    AddDeleteUpadate("PropertyVehicle/AdditionalInfo_Vehicle", val).then(
      (res) => {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        if (taskToSend && value.OfficerID) {
          InSertBasicInfo(value?.CollectingOfficer, "OfficerID", "TaskList/Insert_TaskList", taskToSend);
          setShowModal(false);
        }
        if (value?.IsSendToTaskList && IsNonPropertyStatus === false && value.IsNonPropertyRoom) {
          InSertBasicInfo(
            value?.CollectingOfficer,
            "OfficerID",
            "TaskList/Insert_TaskList",

          );
          setShowModal(false);
        }
        if (selectedFiles?.length > 0 && fileUploadStatus) {
          uploadNonPropertyRoomDocuments(PropertyID, MasterPropertyID, loginPinID, selectedFiles);
        }
        setChangesStatus(false); setStatesChangeStatus(false); GetSingleData(DecVehId, DecMVehId); Get_TaskList_Status(DecVehId);
        Reset();
      }
    );
  };

  const uploadNonPropertyRoomDocuments = async (PropertyID, MasterPropertyID, CreatedByUserFK, files) => {
    if (!files || files.length === 0) return;
    const formData = new FormData();
    const metadataArray = [];
    files.forEach(() => { metadataArray.push(JSON.stringify({ PropertyID, MasterPropertyID, CreatedByUserFK, })); });
    files.forEach(file => formData.append("File", file));
    formData.append("Data", JSON.stringify(metadataArray));
    try {
      const response = await AddDelete_Img("NonPropertyRoomDocument/Insert_NonPropertyRoomDocument", formData);
      if (response?.success) {
        // toastifySuccess("Document(s) uploaded successfully.");
        GetDataDocument(DecVehId, DecMVehId, loginPinID);
      } else {
        // toastifyError("Failed to upload documents.");
      }
    } catch (error) {
      // toastifyError("An error occurred while uploading documents.");
    }
  };

  const Delete_Document = (fileToDelete) => {
    setSelectedFiles((prev) => prev.filter((file) => file.documentID !== fileToDelete.documentID && file.name !== fileToDelete.name));
    if (fileToDelete.isFromAPI) {
      const val = { DocumentID: fileToDelete.documentID, DeletedByUserFK: loginPinID, };
      fetchPostData("NonPropertyRoomDocument/Delete_NonPropertyRoomDocument", val)
        .then((res) => {
          // GetDataDocument(propertyID, masterPropertyID, loginPinID);
        })
        .catch((err) => {
        });
    }
  };

  const GetDataDocument = (propertyID, masterPropertyID, loginPinID) => {
    const val = { PropertyID: propertyID, MasterPropertyID: masterPropertyID, PINID: loginPinID, IsMaster: MstVehicle === "MST-Vehicle-Dash", };

    fetchPostData("NonPropertyRoomDocument/GetData_NonPropertyRoomDocument", val)
      .then((res) => {
        if (Array.isArray(res)) {
          const normalizedFiles = res.map((doc) => {
            const extension = doc.DocumentType?.toLowerCase() || 'jpg';
            const fileName = `Document_${doc.DocumentID}.${extension}`;
            return {
              name: fileName, type: `image/${extension === 'jpg' ? 'jpeg' : extension}`, size: 0,
              lastModified: new Date(doc.CreatedDtTm).getTime(), lastModifiedDate: new Date(doc.CreatedDtTm), webkitRelativePath: '',
              isFromAPI: true, url: doc.FileAttachment, documentID: doc.DocumentID,
            };
          });
          setSelectedFiles(normalizedFiles);
        } else {
          setSelectedFiles([]);
        }
      })
      .catch((err) => {
        setSelectedFiles([]);
      });
  };

  const setToReset = () => { };

  const HandleChanges = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === "IsSendToPropertyRoom") {
      setIsNonPropertyRoomSelected(false); setValue({ ...value, [e.target.name]: e.target.checked, IsNonPropertyRoom: false, });
      setErrors({ ...errors, CollectionDtTmError: "", CollectingOfficerError: "", OfficerID: "", });
    } else if (e.target.name === "IsNonPropertyRoom") {
      setValue({ ...value, [e.target.name]: e.target.checked, IsSendToPropertyRoom: false, });
      setIsNonPropertyRoomSelected(true); setErrors({ ...errors, CollectionDtTmError: "", CollectingOfficerError: "", OfficerID: "", });
    } else if (e.target.name === "IsEvidence") {
      if (!e.target.checked) {
        setValue({
          ...value, [e.target.name]: e.target.checked, CollectingOfficer: "", LocationOfCollection: "", EvidenceDescription: "", CollectionDtTm: "", IsNonPropertyRoom: "",
        });
        setCollectiondate(""); setIsNonPropertyRoom(false);
      } else {
        setValue({ ...value, [e.target.name]: e.target.checked });
      }
    } else if (e.target.name === "IsSendToTaskList") {
      setValue({ ...value, [e.target.name]: e.target.checked });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const TaskListvalidation = (selectedStatus) => {
    setTaskListStatus("");
    let tasksInList = [];

    try {
      const parsed = JSON.parse(task?.tasklistdata || "[]");
      tasksInList = parsed.map((item) => item.Task);
    } catch (err) {
      console.error("Error parsing tasklistdata:", err);
    }

    setIsSendButtonDisabled(false);
    console.log(tasksInList, 'hello');
    if (tasksInList.includes("CheckIn") && selectedStatus === "CheckOut" || tasksInList.includes("CheckIn") && selectedStatus === "Release" || tasksInList.includes("CheckIn") && selectedStatus === "Destroy" || tasksInList.includes("CheckIn") && selectedStatus === "Update" || tasksInList.includes("CheckIn") && selectedStatus === "Transfer Location") {
      setTaskListStatus("Other task already pending in task list.");
      setChangesStatus(false);
      setIsSendButtonDisabled(true);
    }

    // else if (tasksInList.includes("CheckIn") && selectedStatus === "Release") {
    //     setTaskListStatus("Please complete CheckIn");
    //     setChangesStatus(false);
    //     setIsSendButtonDisabled(true);
    // }
    //  else if (tasksInList.includes("CheckIn") && selectedStatus === "Destroy") {
    //     setTaskListStatus("Please complete CheckIn");
    //     setChangesStatus(false);
    //     setIsSendButtonDisabled(true);
    // }
    else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Release") {
      setTaskListStatus("Other task already pending in task list.");
      setChangesStatus(false);
      setIsSendButtonDisabled(true);
    }
    else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Destroy") {
      setTaskListStatus("Other task already pending in task list.");
      setChangesStatus(false);
      setIsSendButtonDisabled(true);
    }
    else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Transfer Location") {
      setTaskListStatus("Other task already pending in task list.");
      setChangesStatus(false);
      setIsSendButtonDisabled(true);
    }
    else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "Update") {
      setTaskListStatus("Other task already pending in task list.");
      setChangesStatus(false);
      setIsSendButtonDisabled(true);
    }
    else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "CheckIn") {
      setTaskListStatus("CheckIn task already sent to task list.");
      setChangesStatus(false);
      setIsSendButtonDisabled(true);
    } else if (tasksInList.includes("Release") || tasksInList.includes("CheckIn") || tasksInList.includes("Update") || tasksInList.includes("CheckOut") || tasksInList.includes("Destroy") || tasksInList.includes("Transfer Location") && selectedStatus === "CheckOut") {
      setTaskListStatus("Already checked out.");
      setChangesStatus(false);
      setIsSendButtonDisabled(true);
    } else if (tasksInList.includes("CheckOut") && selectedStatus === "Transfer Location") {
      setChangesStatus(false);
      setTaskListModalStatus(true);
      setIsSendButtonDisabled(true);
    } else {
      setChangesStatus(true);
      setTaskListStatus("");
      setIsSendButtonDisabled(false);
    }
  };

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    !addUpdatePermission && setChangesStatus(true);
    if ((e && name === "Task") || (e === null && name === "Task")) {
      setTaskToSend(e ? e.label : "");
      if (e === null) {
        setTaskListStatus("");
      }

      if (e) TaskListvalidation(e.label);
    } else if (e) {
      setValue({ ...value, [name]: e.value, });
    } else {
      setValue({ ...value, [name]: null, });
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFilesArray = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesArray]); setStatesChangeStatus(true);
    setfileUploadStatus(true);
    if (fileInputRef.current) { fileInputRef.current.value = ""; }
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const StatusOption = [
    { value: "1", label: "CheckIn" },
    { value: "2", label: "CheckOut" },
    { value: "3", label: "Release" },
    { value: "4", label: "Destroy" },
    { value: "5", label: "Transfer Location" },
    { value: "6", label: "Update" },
  ];

  const HandleStatusOption = () => {
    let arr = [];
    if (PropertyRoomStatus) {
      arr = StatusOption.filter((item) => !(item.label === PropertyRoomStatus));
      return arr;
    } else {
      console.log("Task::", task);
      const status = LastTask;
      arr = [{ value: "1", label: "CheckIn" }];
      if (status) {
        const filteredvalue = StatusOption.filter(
          (item) => item.label !== LastTask
        );
        return filteredvalue;
      }
      return arr;
    }
  };

  const filterTime = (time) => {
    const occuredFromDate = new Date(value?.ReportedDtTm);
    const occurredFromTimestamp = occuredFromDate?.getTime();
    const maxTimestamp = new Date()?.getTime();
    if (time?.getTime() <= occurredFromTimestamp) {
      return false;
    }
    if (time?.getTime() >= maxTimestamp) {
      return false;
    }
    return true;
  };

  const changeHandler = (e) => {
    const files = e.target.files;
    setSelectedFile(files);
    const nameArray = [];
    for (let i in files) {
      nameArray.push(files[i].name);
    }
    setSelectedFileName(nameArray);
  };

  const InSertBasicInfo = (id, col1, url, task) => {
    const documentAccess =
      selectedOption === "Individual" ? "Individual" : "Group";
    const val = {
      PropertyID: DecVehId,
      MasterPropertyID: DecMVehId,
      OfficerID: value.OfficerID,
      CreatedByUserFK: loginPinID,
      Task: task,
      AssigneeType: documentAccess,
    };
    AddDeleteUpadate(url, val)
      .then((res) => {
        if (res) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message); Get_SendTask_Data(DecVehId, DecMVehId); setTaskToSend(); setMultiSelected({ optionSelected: [] });
          setSelectedOption("Individual");
        } else {
          console.log("Somthing Wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };

  const Get_SendTask_Data = (PropertyID, MasterPropertyID) => {
    const val = { PropertyID: PropertyID, MasterPropertyID: MasterPropertyID };
    fetchPostData("TaskList/GetData_TaskList", val)
      .then((res) => {
        if (res) {
          setLastTask(res[res.length - 1]?.Task);
          setTask(res[0]);
        } else {
          setTask("");
        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };

  const handleRadioChangeArrestForward = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue); setValue({ ...value, ["OfficerID"]: "", ["DocumentAccess_Name"]: "" });
    setMultiSelected({ optionSelected: [] });
    setErrors({
      ...errors, ["ApprovalCommentsError"]: "", ["CommentsDocumentsError"]: "", ["ApprovingOfficerError"]: "", ["GroupError"]: "",
    });
  };

  const colourStylesUsers = {
    control: (styles, { isDisabled }) => ({
      ...styles, backgroundColor: isDisabled ? "#d3d3d3" : "#fce9bf", fontSize: 14,
      marginTop: 2, boxShadow: "none", cursor: isDisabled ? "not-allowed" : "default",
    }),
  };

  const Agencychange = (multiSelected) => {
    setMultiSelected({ optionSelected: multiSelected });
    const id = [];
    if (multiSelected) {
      multiSelected.map((item, i) => {
        id.push(item.value);
      });
      setValue({ ...value, ["OfficerID"]: id.toString() });
    }
  };

  useEffect(() => {
    if (groupList?.GroupID) {
      setValue({
        ...value, ["GroupName"]: changeArrayFormat_WithFilter(groupList, "group", groupList[0]?.GroupID),
        CreatedByUserFK: loginPinID,
      });
    }
  }, [groupList]);

  const get_Group_List = (loginAgencyID) => {
    const value = { AgencyId: loginAgencyID, PINID: loginPinID };
    fetchPostData("Group/GetData_Group", value).then((res) => {
      if (res) {
        setGroupList(changeArrayFormat(res, "group"));
      } else {
        setGroupList();
      }
    });
  };


  useEffect(() => {
    if (loginAgencyID) {
      dispatch(get_Report_Approve_Officer_Data(loginAgencyID, loginPinID));
      if (narrativeTypeDrpData?.length === 0) {
        dispatch(get_Narrative_Type_Drp_Data(loginAgencyID));
      }
      get_Group_List(loginAgencyID);
    }
  }, [loginAgencyID]);



  return (
    <>
      <VehicleListing {...{ ListData }} />
      <div className="col-12 col-md-12 col-lg-12 pt-2 p-0 child">
        <fieldset>
          <legend>Additional Information</legend>
          <div className="row">
            <div className="col-2 col-md-2 col-lg-2 mt-2 ">
              <label htmlFor="" className="new-label">
                Tag #
              </label>
            </div>
            <div className="col-10 col-md-10 col-lg-3 text-field mt-1">
              <input
                type="text"
                name="TagID"
                id="TagID"
                value={value?.TagID}
                onChange={HandleChanges1}
                required
                readOnly
                className={isLockOrRestrictModule("Lock", editval[0]?.TagID, isLocked) ? "LockFildsColor" : "readonlyColor"}
                disabled={isLockOrRestrictModule("Lock", editval[0]?.TagID, isLocked) ? true : false}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-3 mt-2 ">
              <label htmlFor="" className="new-label">
                NICB #
              </label>
            </div>
            <div className="col-10 col-md-10 col-lg-4 text-field mt-1">
              <input
                type="text"
                name="NICBIDID"
                id="NICBIDID"
                value={value?.NICBIDID}
                onChange={HandleChanges}
                required
                readOnly

                className={isLockOrRestrictModule("Lock", editval[0]?.NICBIDID, isLocked) ? "LockFildsColor" : "readonlyColor"}
                disabled={isLockOrRestrictModule("Lock", editval[0]?.NICBIDID, isLocked) ? true : false}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-2 col-md-2 col-lg-2 mt-2 ">
              <label htmlFor="" className="new-label">
                Destroy Date
              </label>
            </div>
            <div className="col-10 col-md-10 col-lg-3 ">
              <DatePicker
                id="DestroyDtTm"
                name="DestroyDtTm"
                onChange={(date) => {
                  !addUpdatePermission && setStatesChangeStatus(true);
                  !addUpdatePermission && setChangesStatus(true);
                  setValue({
                    ...value,
                    ["DestroyDtTm"]: date
                      ? getShowingMonthDateYear(date)
                      : null,
                  });
                }}
                dateFormat="MM/dd/yyyy HH:mm"
                timeInputLabel
                isClearable={value?.DestroyDtTm ? true : false}
                selected={value?.DestroyDtTm && new Date(value?.DestroyDtTm)}
                placeholderText={
                  value?.DestroyDtTm ? value.DestroyDtTm : "Select..."
                }
                showTimeSelect
                timeIntervals={1}
                timeCaption="Time"
                readOnly
                required
                autoComplete="nope"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"

                className={isLockOrRestrictModule("Lock", editval[0]?.DestroyDtTm, isLocked) ? "LockFildsColor" : "readonlyColor"}
                disabled={isLockOrRestrictModule("Lock", editval[0]?.DestroyDtTm, isLocked) ? true : false}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-3 mt-2">
              <label htmlFor="" className="new-label">
                Description
              </label>
            </div>
            <div className="col-8 col-md-8 col-lg-4 ">
              <textarea
                name="Description"
                id="Description"
                maxLength={250}
                value={value?.Description}
                onChange={HandleChanges1}
                cols="30"
                rows="1"
                // className="form-control"

                className={isLockOrRestrictModule("Lock", editval[0]?.Description, isLocked) ? "form-control LockFildsColor" : "form-control"}
                disabled={isLockOrRestrictModule("Lock", editval[0]?.Description, isLocked) ? true : false}
              ></textarea>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-5 col-md-4 col-lg-4 mt-2">
              <div className="form-check ">
                <input
                  name="IsImmobalizationDevice"
                  value={value?.IsImmobalizationDevice}
                  checked={value?.IsImmobalizationDevice}
                  onChange={HandleChanges1}
                  type="checkbox"
                  id="flexCheckDefault2"
                  className="form-check-input" // on Checkboxes class is not needed for lockColor
                // className={isLockOrRestrictModule("Lock", editval[0]?.IsImmobalizationDevice, isLocked) ? "form-check-input LockFildsColor" : "form-check-input"}

                // disabled={isLockOrRestrictModule("Lock", editval[0]?.IsImmobalizationDevice, isLocked) ? true : false}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault2">
                  Immobilization Device
                </label>
              </div>
            </div>
            <div className="col-5 col-md-4 col-lg-4 mt-2">
              <div className="form-check ">
                <input
                  name="IsEligibleForImmobalization"
                  value={value?.IsEligibleForImmobalization}
                  checked={value?.IsEligibleForImmobalization}
                  onChange={HandleChanges1}
                  type="checkbox"
                  id="flexCheckDefault3"
                  className="form-check-input"
                // className={isLockOrRestrictModule("Lock", editval[0]?.IsEligibleForImmobalization, isLocked) ? "form-check-input LockFildsColor" : "form-check-input"}

                // disabled={isLockOrRestrictModule("Lock", editval[0]?.IsEligibleForImmobalization, isLocked) ? true : false}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault3">
                  Eligible For Immobilization
                </label>
              </div>
            </div>
          </div> */}
        </fieldset>

        <fieldset className="px-0">
          <div className="col-12">
            <div className="">
              <div className="mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="evidence"
                    name="IsEvidence"
                    value={value?.IsEvidence}
                    checked={value?.IsEvidence}
                    onChange={HandleChanges}
                    className="form-check-input"
                    disabled={IsEvidenceStatus}
                  // className={isLockOrRestrictModule("Lock", editval[0]?.IsEvidence, isLocked) ? "form-check-input LockFildsColor" : "form-check-input"}
                  // disabled={isLockOrRestrictModule("Lock", editval[0]?.IsEvidence, isLocked) || IsEvidenceStatus ? true : false}
                  />
                  <label className="form-check-label" htmlFor="evidence">
                    Evidence
                  </label>
                </div>
                {value.IsEvidence && (
                  <div className="row  align-items-center">
                    <div className="ms-4 mt-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="IsSendToPropertyRoom"
                          id="IsSendToPropertyRoom"
                          checked={value.IsSendToPropertyRoom}
                          onChange={HandleChanges}

                        // disabled={IsNonPropertyStatus === 'true' || IsNonPropertyStatus === true || isLockOrRestrictModule("Lock", editval[0]?.IsSendToPropertyRoom, isLocked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="sendToPropertyRoom"
                        >
                          Send to Property Room
                        </label>
                      </div>
                    </div>
                    <div className="ms-4 mt-2 ml-5">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="IsNonPropertyRoom"
                          id="IsNonPropertyRoom"
                          checked={value.IsNonPropertyRoom}
                          onChange={HandleChanges}

                        // disabled={SendToPropertyRoomStatus === 'true' || SendToPropertyRoomStatus === true || isLockOrRestrictModule("Lock", editval[0]?.IsNonPropertyRoom, isLocked)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="nonPropertyRoom"
                        >
                          Non Property Room
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {value.IsEvidence && (
                <div className="row mb-2 align-items-center">
                  <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                    <label htmlFor="" className="new-label">
                      {" "}
                      Collection Date/Time
                      {errors.CollectionDtTmError !== "true" ? (
                        <p
                          style={{
                            color: "red",
                            fontSize: "11px",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          {errors.CollectionDtTmError}
                        </p>
                      ) : null}
                    </label>
                  </div>
                  <div className="col-3 col-md-3 col-lg-2 ">
                    <DatePicker
                      id="ReportedDate"
                      name="ReportedDate"
                      dateFormat="MM/dd/yyyy HH:mm"
                      selected={collectiondate}
                      onChange={(date) => {
                        if (!addUpdatePermission) {
                          setStatesChangeStatus(true);
                          setChangesStatus(true);
                        }

                        const reportedDt = new Date(value?.ReportedDtTm);
                        const now = new Date(); // current datetime

                        if (date) {
                          let selectedDate = new Date(date);

                          // Ensure selected > ReportedDtTm
                          if (selectedDate.getTime() <= reportedDt.getTime()) {
                            selectedDate = new Date(reportedDt.getTime() + 60000); // 1 minute later
                          }

                          // Ensure selected <= now
                          if (selectedDate.getTime() > now.getTime()) {
                            selectedDate = now;
                          }

                          setCollectiondate(selectedDate);
                          setValue({
                            ...value,
                            ["CollectionDtTm"]: getShowingMonthDateYear(selectedDate),
                          });
                        } else {
                          setCollectiondate(null);
                          setValue({
                            ...value,
                            ["CollectionDtTm"]: null,
                          });
                        }
                      }}

                      className={isLockOrRestrictModule("Lock", editval[0]?.CollectionDtTm, isLocked) ? "LockFildsColor" : "requiredColor"}
                      disabled={isLockOrRestrictModule("Lock", editval[0]?.CollectionDtTm, isLocked) ? true : false}

                      timeInputLabel
                      showTimeSelect
                      timeIntervals={1}
                      timeCaption="Time"
                      showMonthDropdown
                      isClearable={false}
                      placeholderText={"Select..."}
                      showYearDropdown
                      dropdownMode="select"
                      showDisabledMonthNavigation
                      autoComplete="off"
                      timeFormat="HH:mm"
                      is24Hour

                      // ✅ Don't allow any date in future
                      maxDate={new Date()}

                      // ✅ Don't allow date before ReportedDtTm
                      minDate={new Date(value?.ReportedDtTm)}

                      // ✅ If selected date is today, restrict time to <= current time
                      filterTime={(time) => {
                        const now = new Date();
                        const selectedDate = new Date(collectiondate);
                        const reportedDt = new Date(value?.ReportedDtTm);

                        const isSameDay = (date1, date2) => {
                          return (
                            date1.getFullYear() === date2.getFullYear() &&
                            date1.getMonth() === date2.getMonth() &&
                            date1.getDate() === date2.getDate()
                          );
                        };

                        if (isSameDay(selectedDate, now)) {
                          return time.getTime() > reportedDt.getTime() && time.getTime() <= now.getTime();
                        }

                        if (isSameDay(selectedDate, reportedDt)) {
                          return time.getTime() > reportedDt.getTime();
                        }

                        return time.getTime() <= now.getTime();
                      }}

                    />

                  </div>
                  <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                    <label htmlFor="" className="new-label">
                      {" "}
                      Location of Collection
                    </label>
                  </div>
                  <div className="col-4 col-md-3 col-lg-2">
                    <div className="text-field mt-1">
                      <input
                        type="text"
                        name="LocationOfCollection"
                        value={value.LocationOfCollection}
                        onChange={(e) => { HandleChanges1(e); }}

                        className={isLockOrRestrictModule("Lock", editval[0]?.LocationOfCollection, isLocked) ? "LockFildsColor" : "requiredColor"}
                        disabled={isLockOrRestrictModule("Lock", editval[0]?.LocationOfCollection, isLocked) ? true : false}
                      />
                    </div>
                  </div>
                  <div className="col-3 col-md-2 col-lg-2 mt-2">
                    <label htmlFor="" className="new-label">
                      Collecting Officer
                      {errors.CollectingOfficerError !== "true" ? (
                        <p
                          style={{
                            color: "red",
                            fontSize: "11px",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          {errors.CollectingOfficerError}
                        </p>
                      ) : null}
                    </label>
                  </div>
                  <div className="col-4 col-md-3 col-lg-2 mt-1">
                    <Select
                      name="CollectingOfficer"
                      value={agencyOfficerDrpData?.filter(
                        (obj) => obj.value == value?.CollectingOfficer
                      )}
                      options={agencyOfficerDrpData}
                      onChange={(e) => ChangeDropDown(e, "CollectingOfficer")}
                      placeholder="Select.."
                      menuPlacement="bottom"
                      isClearable

                      styles={isLockOrRestrictModule("Lock", editval[0]?.CollectingOfficer, isLocked) ? LockFildscolour : Requiredcolour}
                      isDisabled={isLockOrRestrictModule("Lock", editval[0]?.CollectingOfficer, isLocked) ? true : false}
                    />
                  </div>
                </div>
              )}
              {value.IsEvidence && (
                <div className="row mb-2 align-items-center">
                  <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                    <label htmlFor="" className="new-label">
                      Evidence Description
                    </label>
                  </div>
                  <div className="col-4 col-md-3 col-lg-6">
                    <div className="text-field mt-1">
                      <input
                        type="text"
                        name="EvidenceDescription"
                        value={value.EvidenceDescription}
                        onChange={(e) => { HandleChanges1(e); }}

                        className={isLockOrRestrictModule("Lock", editval[0]?.EvidenceDescription, isLocked) ? "LockFildsColor" : ""}
                        disabled={isLockOrRestrictModule("Lock", editval[0]?.EvidenceDescription, isLocked) ? true : false}
                      />
                    </div>
                  </div>
                </div>
              )}
              {value?.IsEvidence ? (
                value?.IsNonPropertyRoom ? (
                  <div className="row align-items-center">
                    <div className="col-12 col-md-12 col-lg-2 ">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          name="IsSendToTaskList"
                          value={value?.IsSendToTaskList}
                          checked={value?.IsSendToTaskList}
                          onChange={HandleChanges}
                          type="checkbox"
                          id="flexCheckDefault"

                        // disabled={isLockOrRestrictModule("Lock", editval[0]?.IsSendToTaskList, isLocked) ? true : false}
                        />
                        <label
                          className="form-check-label"
                          for="flexCheckDefault1"
                        >
                          Send To Task List
                        </label>
                      </div>
                    </div>
                    {
                      value?.IsSendToTaskList ?

                        <>
                          <div className="col-1 col-md-1 col-lg-1 ">
                            <label
                              className="form-check-label mb-0"
                              htmlFor="sendToPropertyRoom"
                            >
                              Assignee
                            </label>
                          </div>

                          <div className="col-3 col-md-3 col-lg-5 g-1 row align-items-center">
                            <>
                              <div className="col-6 col-md-6 col-lg-3 ">
                                <div className="form-check ml-2">
                                  <input
                                    type="radio"
                                    name="approverType"
                                    value="Individual"
                                    className="form-check-input"
                                    checked={selectedOption === "Individual"}
                                    onChange={handleRadioChangeArrestForward}

                                  // disabled={isLockOrRestrictModule("Lock", editval[0]?.IsSendToTaskList, isLocked) ? true : false}
                                  />
                                  <label
                                    className="form-check-label mb-0"
                                    htmlFor="Individual"
                                  >
                                    By User
                                  </label>
                                </div>
                              </div>
                              <div className="col-6 col-md-6 col-lg-3 ">
                                <div className="form-check ml-2">
                                  <input
                                    type="radio"
                                    name="approverType"
                                    value="Group"
                                    className="form-check-input"
                                    checked={selectedOption === "Group"}
                                    onChange={handleRadioChangeArrestForward}

                                  // disabled={isLockOrRestrictModule("Lock", editval[0]?.IsSendToTaskList, isLocked) ? true : false}
                                  />
                                  <label
                                    className="form-check-label mb-0"
                                    htmlFor="Group"
                                  >
                                    By Group
                                  </label>
                                </div>
                              </div>
                              <>
                                {selectedOption === "Individual" ? (
                                  <>

                                    <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
                                      <SelectBox
                                        className="custom-multiselect"
                                        classNamePrefix="custom"
                                        options={agencyOfficerDrpData}
                                        isMulti
                                        required
                                        menuPlacement="top"
                                        closeMenuOnSelect={false}
                                        onChange={Agencychange}
                                        value={multiSelected.optionSelected}
                                        // menuPlacement="top"
                                        // hideSelectedOptions={true}
                                        // allowSelectAll={true}
                                        styles={colourStylesUsers}
                                      // isDisabled={isLockOrRestrictModule("Lock", editval[0]?.NameTypeID, isLocked, true) ? true : false}
                                      />
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
                                      <SelectBox
                                        className="custom-multiselect"
                                        classNamePrefix="custom"
                                        options={groupList}
                                        menuPlacement="top"
                                        isMulti
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={true}
                                        onChange={Agencychange}
                                        // allowSelectAll={true}
                                        value={multiSelected.optionSelected}

                                        styles={colourStylesUsers}
                                      />
                                    </div>
                                  </>
                                )}
                              </>
                            </>
                          </div>
                          <div className="col-3 col-md-3 col-lg-4 mt-1 px-1 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-sm mb-2 mt-1"
                              data-toggle="modal" data-target="#myModal"
                              style={{
                                backgroundColor: "#001f3f",
                                color: "#fff",
                              }}
                              onClick={() => {
                                if (value.IsSendToPropertyRoom || value.IsNonPropertyRoom && value.IsSendToTaskList) {
                                  setShowModal(true);
                                }
                                else {
                                  check_Validation_Error()
                                }
                              }}
                              disabled={!value.OfficerID || IsNonPropertyStatus === true}
                            >
                              Send
                            </button>
                          </div>
                        </> : <></>
                    }

                    {value?.IsNonPropertyRoom && !value?.IsSendToTaskList && (
                      <>
                        <div className="col-12 col-md-12 col-lg-12 mt-2">
                          <div className="row mb-2 align-items-center">
                            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                              <label htmlFor="" className="new-label">
                                {" "}
                                Reason
                                {errors.ReasonError !== "true" ? (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "11px",
                                      margin: "0px",
                                      padding: "0px",
                                    }}
                                  >
                                    {errors.ReasonError}
                                  </p>
                                ) : null}
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2">
                              <div className="text-field mt-1">
                                <input
                                  type="text"
                                  name="Reason"
                                  value={value.Reason}
                                  onChange={(e) => HandleChanges1(e)}
                                  // className="requiredColor"

                                  className={isLockOrRestrictModule("Lock", editval[0]?.Reason, isLocked) ? "LockFildsColor" : "requiredColor"}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.Reason, isLocked) ? true : false}
                                />
                              </div>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 mt-2 px-1">
                              <label htmlFor="" className="new-label">
                                {" "}
                                Dispatch Date/Time
                                {errors.DispatchError !== "true" ? (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "11px",
                                      margin: "0px",
                                      padding: "0px",
                                    }}
                                  >
                                    {errors.DispatchError}
                                  </p>
                                ) : null}
                              </label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 ">
                              <DatePicker
                                id="DispatchDtTm"
                                name="DispatchDtTm"
                                dateFormat="MM/dd/yyyy HH:mm"
                                onChange={(date) => {
                                  !addUpdatePermission &&
                                    setStatesChangeStatus(true);
                                  !addUpdatePermission &&
                                    setChangesStatus(true);

                                  if (date) {
                                    // console.log(
                                    //   "occurred from date entered true::",
                                    //   date
                                    // );

                                    let occurredFromTimestamp = new Date(
                                      value?.ReportedDate
                                    );
                                    let selectedDate = new Date(date);

                                    // If selected date is before or equal to ReportedDtTm, push it by 1 minute
                                    if (
                                      selectedDate.getTime() <=
                                      occurredFromTimestamp.getTime()
                                    ) {
                                      selectedDate = new Date(
                                        occurredFromTimestamp.getTime() + 60000
                                      ); // 1 min after
                                    }

                                    setdisPatchdate(selectedDate);
                                    setValue({
                                      ...value,
                                      ["DispatchDtTm"]:
                                        getShowingMonthDateYear(selectedDate),
                                    });
                                  } else {
                                    // console.log(
                                    //   "occurred from date entered false::",
                                    //   date
                                    // );
                                    setdisPatchdate(date);
                                    setValue({
                                      ...value,
                                      ["DispatchDtTm"]: null,
                                    });
                                  }
                                }}
                                selected={dispatchdate}
                                // className="requiredColor"
                                timeInputLabel
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                showMonthDropdown
                                isClearable={false}
                                placeholderText={"Select..."}
                                showYearDropdown
                                dropdownMode="select"
                                showDisabledMonthNavigation
                                autoComplete="off"
                                timeFormat="HH:mm"
                                is24Hour
                                minDate={new Date(collectiondate)} // ✅ Only after ReportedDtTm allowed
                                filterTime={(time) => {
                                  // Optional: If selected date is same day as ReportedDtTm, restrict time
                                  const reported = new Date(
                                    value?.ReportedDate
                                  );
                                  const selectedDateOnly = new Date(
                                    collectiondate
                                  );
                                  selectedDateOnly.setHours(0, 0, 0, 0);
                                  reported.setHours(0, 0, 0, 0);
                                  if (
                                    selectedDateOnly.getTime() ===
                                    reported.getTime()
                                  ) {
                                    return (
                                      time.getTime() >
                                      new Date(value?.ReportedDate).getTime()
                                    );
                                  }
                                  return true;
                                }}

                                className={isLockOrRestrictModule("Lock", editval[0]?.DispatchDtTm, isLocked) ? "LockFildsColor" : "requiredColor"}
                                disabled={isLockOrRestrictModule("Lock", editval[0]?.DispatchDtTm, isLocked) ? true : false}
                              />
                            </div>

                            <div className="col-3 col-md-2 col-lg-2 mt-2">
                              <label htmlFor="" className="new-label">
                                Expected Arrival Date/Time
                              </label>
                            </div>
                            <div className="col-3 col-md-3 col-lg-2 ">
                              <DatePicker
                                id="ExpectedDtTm"
                                name="ExpectedDtTm"
                                dateFormat="MM/dd/yyyy HH:mm"
                                onChange={(date) => {
                                  !addUpdatePermission &&
                                    setStatesChangeStatus(true);
                                  !addUpdatePermission &&
                                    setChangesStatus(true);

                                  if (date) {
                                    // console.log(
                                    //   "occurred from date entered true::",
                                    //   date
                                    // );

                                    let occurredFromTimestamp = new Date(
                                      value?.ReportedDate
                                    );
                                    let selectedDate = new Date(date);

                                    // If selected date is before or equal to ReportedDtTm, push it by 1 minute
                                    if (
                                      selectedDate.getTime() <=
                                      occurredFromTimestamp.getTime()
                                    ) {
                                      selectedDate = new Date(
                                        occurredFromTimestamp.getTime() + 60000
                                      ); // 1 min after
                                    }

                                    setexpectedArrival(selectedDate);
                                    setValue({
                                      ...value,
                                      ["ExpectedDtTm"]:
                                        getShowingMonthDateYear(selectedDate),
                                    });
                                  } else {
                                    // console.log("occurred from date entered false::", date);
                                    setexpectedArrival(date);
                                    setValue({
                                      ...value,
                                      ["ExpectedDtTm"]: null,
                                    });
                                  }
                                }}
                                selected={expectedArrival}
                                // className='requiredColor'
                                timeInputLabel
                                showTimeSelect
                                timeIntervals={1}
                                timeCaption="Time"
                                showMonthDropdown
                                isClearable={false}
                                showYearDropdown
                                placeholderText={"Select..."}
                                dropdownMode="select"
                                showDisabledMonthNavigation
                                autoComplete="off"
                                timeFormat="HH:mm"
                                is24Hour
                                minDate={new Date(dispatchdate)} // ✅ Only after ReportedDtTm allowed

                                filterTime={(time) => {
                                  // Optional: If selected date is same day as ReportedDtTm, restrict time
                                  const reported = new Date(
                                    value?.ReportedDate
                                  );
                                  const selectedDateOnly = new Date(
                                    dispatchdate
                                  );
                                  selectedDateOnly.setHours(0, 0, 0, 0);
                                  reported.setHours(0, 0, 0, 0);
                                  if (
                                    selectedDateOnly.getTime() ===
                                    reported.getTime()
                                  ) {
                                    return (
                                      time.getTime() >
                                      new Date(value?.ReportedDate).getTime()
                                    );
                                  }
                                  return true;
                                }}

                                className={isLockOrRestrictModule("Lock", editval[0]?.ExpectedDtTm, isLocked) ? "LockFildsColor" : "requiredColor"}
                                disabled={isLockOrRestrictModule("Lock", editval[0]?.ExpectedDtTm, isLocked) ? true : false}
                              />
                            </div>

                            <div className="col-3 col-md-2 col-lg-2 mt-2">
                              <label htmlFor="" className="new-label">
                                Dispatching Officer
                                {errors.DispatchingOfficerError !== "true" ? (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "11px",
                                      margin: "0px",
                                      padding: "0px",
                                    }}
                                  >
                                    {errors.DispatchingOfficerError}
                                  </p>
                                ) : null}
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2 mt-1">
                              <Select
                                name="DispatchingOfficer"
                                value={agencyOfficerDrpData?.filter(
                                  (obj) =>
                                    obj.value == value?.DispatchingOfficer
                                )}
                                options={agencyOfficerDrpData}
                                onChange={(e) =>
                                  ChangeDropDown(e, "DispatchingOfficer")
                                }
                                placeholder="Select.."
                                menuPlacement="bottom"
                                className="requiredColor"
                                isClearable

                                // styles={Requiredcolour}
                                styles={isLockOrRestrictModule("Lock", editval[0]?.DispatchingOfficer, isLocked) ? LockFildscolour : Requiredcolour}
                                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.DispatchingOfficer, isLocked) ? true : false}
                              />
                            </div>

                            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                              <label htmlFor="" className="new-label">
                                {" "}
                                Recipient{" "}
                                {errors.ReceipientError !== "true" ? (
                                  <p
                                    style={{
                                      color: "red",
                                      fontSize: "11px",
                                      margin: "0px",
                                      padding: "0px",
                                    }}
                                  >
                                    {errors.ReceipientError}
                                  </p>
                                ) : null}
                              </label>
                              {/* <label htmlFor="" className="new-label">
                                Recipient
                              </label> */}
                            </div>
                            <div className="col-4 col-md-3 col-lg-2">
                              <div className="text-field mt-1">
                                <input
                                  type="text"
                                  name="Recipient"
                                  value={value.Recipient}
                                  onChange={(e) => HandleChanges1(e)}

                                  // className="requiredColor"

                                  className={isLockOrRestrictModule("Lock", editval[0]?.Recipient, isLocked) ? "LockFildsColor" : "requiredColor"}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.Recipient, isLocked) ? true : false}
                                />
                              </div>
                            </div>
                            <div className="col-3 col-md-2 col-lg-2 mt-2">
                              <label htmlFor="" className="new-label">
                                {" "}
                                Mode Of transport{" "}
                                {errors.ModOfTransportError !== "true" ? (<p style={{ color: "red", fontSize: "11px", margin: "0px", padding: "0px", }} >  {errors.ModOfTransportError}
                                </p>) : null}
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2">
                              <div className="text-field mt-1">
                                <input
                                  type="text"
                                  name="ModOfTransport"
                                  value={value.ModOfTransport}
                                  onChange={(e) => HandleChanges1(e)}


                                  className={isLockOrRestrictModule("Lock", editval[0]?.ModOfTransport, isLocked) ? "LockFildsColor" : ""}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.ModOfTransport, isLocked) ? true : false}
                                />
                              </div>
                            </div>
                            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                              <label htmlFor="" className="new-label">
                                Destination
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2">
                              <div className="text-field mt-1">
                                <input
                                  type="text"
                                  name="Destination"
                                  value={value.Destination}
                                  onChange={(e) => HandleChanges1(e)}

                                  className={isLockOrRestrictModule("Lock", editval[0]?.Destination, isLocked) ? "LockFildsColor" : ""}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.Destination, isLocked) ? true : false}
                                />
                              </div>
                            </div>

                            <div className="col-3 col-md-2 col-lg-2 mt-2 px-1">
                              <label htmlFor="" className="new-label">
                                Packaging Details{" "}
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-6">
                              <div className="text-field mt-1">
                                <input
                                  type="text"
                                  name="PackagingDetails"
                                  value={value.PackagingDetails}
                                  onChange={(e) => HandleChanges1(e)}

                                  className={isLockOrRestrictModule("Lock", editval[0]?.PackagingDetails, isLocked) ? "LockFildsColor" : ""}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.PackagingDetails, isLocked) ? true : false}
                                />
                              </div>
                            </div>

                            <div className="col-2 d-flex align-items-center justify-content-end mt-1">
                              <label className="new-label">Comments</label>
                            </div>

                            <div className="col-10 d-flex align-items-center justify-content-end mt-1">
                              <textarea
                                type="text"
                                rows="1"
                                // className="form-control  py-1 new-input"
                                style={{ height: "auto", overflowY: "scroll" }}
                                placeholder="Comment"
                                name="Comments"
                                value={value.Comments}
                                onChange={(e) => {
                                  HandleChanges1(e);
                                }}

                                className={isLockOrRestrictModule("Lock", editval[0]?.Comments, isLocked) ? "LockFildsColor form-control  py-1 new-input" : "form-control  py-1 new-input"}
                                disabled={isLockOrRestrictModule("Lock", editval[0]?.Comments, isLocked) ? true : false}
                              />
                            </div>

                            <div className="col-2 col-md-12 col-lg-2 mt-2">
                              <label
                                htmlFor=""
                                className="new-label text-nowrap"
                              >
                                File Attachment
                              </label>
                            </div>

                            <div
                              className="col-12 col-md-10 mt-1 d-flex align-items-center"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #ccc",
                                padding: "8px",
                                borderRadius: "6px",
                                background: "#f9f9f9",
                                width: "100%",
                              }}
                            >
                              {/* Choose File Button */}
                              <label
                                htmlFor="file-input"
                                style={{
                                  padding: "5px 16px",
                                  backgroundColor: "#e9e9e9",
                                  color: "#fff",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  marginBottom: "0px",
                                  fontWeight: "bold",
                                  transition: "background 0.3s",
                                  whiteSpace: "nowrap",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#e9e9e9")}
                              >
                                Choose File
                              </label>

                              <input
                                type="file"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                multiple
                                style={{ display: "none" }}
                                id="file-input"
                              />

                              {/* File Name Display */}
                              <div
                                style={{
                                  borderRadius: "4px",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  minHeight: "32px",
                                  flex: "1",
                                  alignItems: "center",
                                  gap: "6px",

                                  backgroundColor: "#fff",
                                  padding: "3px 8px",
                                }}
                              >
                                {selectedFiles.length > 0 ? (
                                  selectedFiles.map((file, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        backgroundColor: "#e9ecef",
                                        padding: "1px 10px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      <span>{file.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => { Delete_Document(file); }}
                                        style={{
                                          marginLeft: "6px",
                                          border: "none",
                                          background: "none",
                                          cursor: "pointer",
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          color: "#d9534f",
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <span style={{ color: "#777", fontSize: "13px" }} >
                                    No files selected
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <fieldset>
                            <legend>Results</legend>
                          </fieldset>
                          <div className="row align-items-center">
                            <div className="col-3 col-md-2 col-lg-2 ">
                              <label htmlFor="" className="new-label mb-0">
                                Test Performed
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2">
                              <div className="text-field mt-0 ">
                                <input
                                  type="text"
                                  name="TestPerformed"
                                  value={value.TestPerformed}
                                  onChange={(e) => HandleChanges1(e)}
                                  // styles={Requiredcolour}

                                  className={isLockOrRestrictModule("Lock", editval[0]?.TestPerformed, isLocked) ? "LockFildsColor" : "requiredColor"}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.TestPerformed, isLocked) ? true : false}
                                />
                              </div>
                            </div>

                            <div className="col-3 col-md-2 col-lg-2 ">
                              <label htmlFor="" className="new-label mb-0">
                                Lab Name
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2">
                              <div className="text-field mt-0 ">
                                <input
                                  type="text"
                                  name="LabName"
                                  value={value.LabName}
                                  onChange={(e) => HandleChanges1(e)}
                                  // styles={Requiredcolour}
                                  className={isLockOrRestrictModule("Lock", editval[0]?.LabName, isLocked) ? "LockFildsColor" : "requiredColor"}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.LabName, isLocked) ? true : false}
                                />
                              </div>
                            </div>

                            <div className="col-3 col-md-2 col-lg-2 ">
                              <label htmlFor="" className="new-label mb-0">
                                Lab Location
                              </label>
                            </div>
                            <div className="col-4 col-md-3 col-lg-2">
                              <div className="text-field mt-0 ">
                                <input
                                  type="text"
                                  name="LabLocation"
                                  value={value.LabLocation}
                                  onChange={(e) => HandleChanges1(e)}
                                  // styles={Requiredcolour}
                                  className={isLockOrRestrictModule("Lock", editval[0]?.LabLocation, isLocked) ? "LockFildsColor" : "requiredColor"}
                                  disabled={isLockOrRestrictModule("Lock", editval[0]?.LabLocation, isLocked) ? true : false}
                                />
                              </div>
                            </div>

                            <div className="col-2 mt-1 ">
                              <label className="new-label mb-0">Summary</label>
                            </div>

                            <div className="col-12 col-md-10 col-lg-10 mt-1">
                              <textarea
                                type="text"
                                name="Summary"
                                value={value.Summary}
                                onChange={(e) => HandleChanges1(e)}
                                rows="1"
                                // className="form-control  py-1 new-input"
                                style={{ height: "auto", overflowY: "scroll" }}
                                placeholder="Summary"
                                className={isLockOrRestrictModule("Lock", editval[0]?.Summary, isLocked) ? "form-control  py-1 new-input LockFildsColor " : "form-control  py-1 new-input requiredColor"}
                                disabled={isLockOrRestrictModule("Lock", editval[0]?.Summary, isLocked) ? true : false}
                              />
                            </div>

                            <div className="col-2 col-md-12 col-lg-2 mt-2">
                              <label
                                htmlFor=""
                                className="new-label text-nowrap"
                              >
                                File Attachment
                              </label>
                            </div>

                            <div
                              className="col-12 col-md-10 col-lg-10 mt-1 d-flex align-items-center"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #ccc",
                                padding: "8px",
                                borderRadius: "6px",
                                background: "#f9f9f9",
                              }}
                            >
                              <label
                                htmlFor="file-input"
                                style={{
                                  padding: "5px 16px",
                                  backgroundColor: "#e9e9e9",
                                  color: "#fff",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  marginBottom: "0px",
                                  fontWeight: "bold",
                                  transition: "background 0.3s",
                                  whiteSpace: "nowrap",
                                }}
                                onMouseOver={(e) =>
                                  (e.target.style.backgroundColor = "#e9e9e9")
                                }
                                onMouseOut={(e) =>
                                  (e.target.style.backgroundColor = "#e9e9e9")
                                }
                              >
                                Choose File
                              </label>

                              <input
                                type="file"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                multiple
                                style={{ display: "none" }}
                                id="file-input"
                              />

                              {/* File Name Display */}
                              <div
                                style={{
                                  borderRadius: "4px",
                                  display: "flex",
                                  flexWrap: "wrap",
                                  minHeight: "32px",
                                  flex: "1",
                                  alignItems: "center",
                                  gap: "6px",

                                  backgroundColor: "#fff",
                                  padding: "3px 8px",
                                }}
                              >
                                {selectedFiles.length > 0 ? (
                                  selectedFiles.map((file, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        backgroundColor: "#e9ecef",
                                        padding: "1px 10px",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      <span>{file.name}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        style={{
                                          marginLeft: "6px",
                                          border: "none",
                                          background: "none",
                                          cursor: "pointer",
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          color: "#d9534f",
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))
                                ) : (
                                  <span
                                    style={{ color: "#777", fontSize: "13px" }}
                                  >
                                    No files selected
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : value?.IsSendToPropertyRoom ? (
                  <fieldset className="px-0">
                    <legend>Task List</legend>
                    <div className="row px-0 align-items-center">
                      <div className="col-3 col-md-3 col-lg-2 ">
                        <label
                          htmlFor=""
                          className="new-label text-nowrap mb-0"
                        >
                          Send Task To List
                          {errors.tasklistError && (
                            <p
                              style={{
                                color: "red",
                                fontSize: "13px",
                                margin: "0px",
                                padding: "0px",
                              }}
                            >
                              {errors.tasklistError}
                            </p>
                          )}
                        </label>
                      </div>
                      <div className="col-9 col-md-9 col-lg-2 text-field mt-0">
                        {/* Flex wrapper for Select + inline message */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Select
                            onChange={(e) => ChangeDropDown(e, "Task")}
                            options={HandleStatusOption()}
                            isClearable
                            menuPlacement="top"
                            placeholder="Select..."
                            value={StatusOption.find((option) => option.label === taskToSend) || null}
                            styles={{
                              container: (base) => ({ ...base, flex: 1 }), // Makes Select grow inside flex
                            }}
                          //  isDisabled={isLockOrRestrictModule("Lock", editval[0]?.NameTypeID, isLocked) ? true : false}
                          />
                        </div>
                      </div>

                      <>
                        <div className="col-1 col-md-1 col-lg-1 ">
                          <label
                            className="form-check-label"
                            htmlFor="sendToPropertyRoom"
                          >
                            Assignee
                          </label>
                        </div>

                        <div className="col-3 col-md-3 col-lg-6 g-1 d-flex align-items-center   ">
                          <>
                            <div className="col-6 col-md-6 col-lg-3 ">
                              <div className="form-check ml-2">
                                <input
                                  type="radio"
                                  name="approverType"
                                  value="Individual"
                                  className="form-check-input"
                                  checked={selectedOption === "Individual"}
                                  onChange={handleRadioChangeArrestForward}
                                />
                                <label
                                  className="form-check-label mb-0"
                                  htmlFor="Individual"
                                >
                                  By User
                                </label>
                              </div>
                            </div>
                            <div className="col-6 col-md-6 col-lg-3 ">
                              <div className="form-check ml-2">
                                <input
                                  type="radio"
                                  name="approverType"
                                  value="Group"
                                  className="form-check-input"
                                  checked={selectedOption === "Group"}
                                  onChange={handleRadioChangeArrestForward}
                                />
                                <label
                                  className="form-check-label mb-0"
                                  htmlFor="Group"
                                >
                                  By Group
                                </label>
                              </div>
                            </div>
                            <>
                              {selectedOption === "Individual" ? (
                                <>
                                  <div className="col-2 col-md-2 col-lg-1">
                                    <span className="label-name">
                                      {errors.ApprovingOfficerError !==
                                        "true" && (
                                          <p
                                            style={{
                                              color: "red",
                                              fontSize: "13px",
                                              margin: "0px",
                                              padding: "0px",
                                              fontWeight: "400",
                                            }}
                                          >
                                            {errors.ApprovingOfficerError}
                                          </p>
                                        )}
                                    </span>
                                  </div>
                                  <div className="col-4 col-md-12 col-lg-5 dropdown__box mt-0">
                                    <SelectBox
                                      className="custom-multiselect"
                                      classNamePrefix="custom"
                                      options={agencyOfficerDrpData}
                                      isMulti
                                      required
                                      menuPlacement="top"
                                      closeMenuOnSelect={false}
                                      // menuPlacement="top"
                                      // hideSelectedOptions={true}
                                      // allowSelectAll={true}
                                      onChange={Agencychange}
                                      value={multiSelected.optionSelected}

                                      styles={colourStylesUsers}
                                    // isDisabled={value.Status === "Pending Review" || value.Status === "Approved"}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="col-2 col-md-2 col-lg-1 ">
                                    <span className="label-name">
                                      {errors.ApprovingOfficerError !==
                                        "true" && (
                                          <p
                                            style={{
                                              color: "red",
                                              fontSize: "13px",
                                              margin: "0px",
                                              padding: "0px",
                                              fontWeight: "400",
                                            }}
                                          >
                                            {errors.ApprovingOfficerError}
                                          </p>
                                        )}
                                    </span>
                                  </div>
                                  <div className="col-4 col-md-12 col-lg-5 dropdown__box mt-0">
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
                          </>
                        </div>
                      </>
                      <div className="col-3 col-md-3 col-lg-1  px-1 d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-sm "
                          style={{ backgroundColor: "#001f3f", color: "#fff" }}
                          data-toggle="modal" data-target="#myModal"
                          onClick={() => {
                            // check_Validation_Error();
                            if (value.IsSendToPropertyRoom || value.IsNonPropertyRoom && value.IsSendToTaskList) {
                              setShowModal(true);
                            }
                            else {
                              check_Validation_Error()
                            }
                          }}
                          disabled={
                            isSendButtonDisabled         // ✅ primary check
                              ? true                      // if true → disable directly
                              : !(taskToSend && value.OfficerID) // else check the second rule
                          }
                        // disabled={!(taskToSend && value.OfficerID)}
                        >
                          Send
                        </button>
                      </div>

                      <div className="col-12 col-md-12 col-lg-12 mt-2">

                      </div>
                    </div>

                    <div className="row mt-2 ">
                      <div className="col-lg-1"></div>
                      {taskListStatus && (
                        <p
                          style={{
                            color: "#001f3f",
                            fontSize: "16px",
                            fontWeight: 500,
                            marginLeft: "20px",
                            margin: 0,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {taskListStatus}
                        </p>
                      )}
                    </div>
                  </fieldset>
                ) : null
              ) : null}
            </div>
          </div>
        </fieldset>
        {!isViewEventDetails && (
          <div className="col-12 col-md-12 col-lg-12 mb-1 text-right">
            {effectiveScreenPermission ? (
              effectiveScreenPermission[0]?.Changeok ? (
                <button
                  type="button"
                  disabled={!statesChangeStatus || taskToSend}
                  className="btn btn-md py-1 btn-success "
                  data-toggle="modal" data-target="#myModal"
                  onClick={(e) => {
                    // check_Validation_Error();
                    if (value.IsSendToPropertyRoom || value.IsNonPropertyRoom && value.IsSendToTaskList) {
                      setShowModal(true);
                    }
                    else {
                      check_Validation_Error()
                    }
                  }}
                >
                  Update
                </button>
              ) : (
                <></>
              )
            ) : (
              <button
                type="button"
                disabled={!statesChangeStatus || taskToSend}
                className="btn btn-md py-1 btn-success "
                data-toggle="modal" data-target="#myModal"
                onClick={(e) => {
                  // check_Validation_Error();
                  if (value.IsSendToPropertyRoom || value.IsNonPropertyRoom && value.IsSendToTaskList) {
                    setShowModal(true);
                  }
                  else {
                    check_Validation_Error()
                  }
                }}
              >
                Update
              </button>
            )}
          </div>
        )}
      </div>
      <ChangesModal func={Update_Name} setToReset={setToReset} />
      <TaskListModal
        changesStatus={taskListModalStatus}
        setChangesStatus={setTaskListModalStatus}
        setTaskToSend={setTaskToSend}
        InSertBasicInfo={InSertBasicInfo}
        taskToSend={taskToSend}
        value={value}
      />
      <SendPropertyConfirmModel showModal={showModal} func={check_Validation_Error} value={value} setShowModal={setShowModal} />
    </>
  );
};

export default AddInformation;

export const TaskListModal = ({
  changesStatus,
  setChangesStatus,
  setTaskToSend,
  InSertBasicInfo,
  taskToSend,
  value,
}) => {
  return (
    <>
      {changesStatus && (
        <div
          className="modal show d-block"
          style={{
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "1050",
          }}
          tabIndex="-1"
          aria-labelledby="exampleModalCenterTitle"
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="box text-center py-5">
                <h5 className="modal-title mt-2" id="exampleModalLabel">
                  Checkout task are already in tasklist,do you want to replace
                  it with Transfer Location task?
                </h5>
                <div className="btn-box mt-4">
                  <button
                    type="button"
                    className="btn btn-sm text-white"
                    style={{ background: "#ef233c" }}
                    onClick={() => {
                      InSertBasicInfo(
                        value?.CollectingOfficer,
                        "OfficerID",
                        "TaskList/Insert_TaskList",
                        taskToSend
                      );
                      // setTaskToSend('');
                      setChangesStatus(false);
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary ml-2"
                    onClick={() => {
                      setTaskToSend("");
                      setChangesStatus(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
