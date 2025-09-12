import React, { useContext, useEffect, useRef, useState } from "react";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { components } from "react-select";
import Select from "react-select";
import SelectBox from "../../../../Common/SelectBox";
import DatePicker from "react-datepicker";
import DataTable from "react-data-table-component";
import {
  Decrypt_Id_Name, DecryptedList, Requiredcolour, base64ToString, changeArrayFormat, changeArrayFormat_WithFilter, decryptBase64, getShowingMonthDateYear, getShowingWithOutTime, tableCustomStyles,
} from "../../../../Common/Utility";
import { Link, useLocation } from "react-router-dom";
import { AddDeleteUpadate, AddDelete_Img, PropertyRoomInsert, ScreenPermision, fetchPostData, } from "../../../../hooks/Api";
import { toastifyError, toastifySuccess } from "../../../../Common/AlertMsg";
import { useDispatch, useSelector } from "react-redux";
import { get_LocalStoreData } from "../../../../../redux/actions/Agency";
import PropListng from "../../../ShowAllList/PropListng";
import ChangesModal from "../../../../Common/ChangesModal";
import { get_Report_Approve_Officer_Data, get_ScreenPermissions_Data, } from "../../../../../redux/actions/IncidentAction";
import { RequiredFieldIncident } from "../../../Utility/Personnel/Validation";
import { threeColArray } from "../../../../Common/ChangeArrayFormat";
import { get_AgencyOfficer_Data, get_Narrative_Type_Drp_Data, } from "../../../../../redux/actions/DropDownsData";

const MultiValue = (props) => (
  <components.MultiValue {...props}>
    <span>{props.data.label}</span>
  </components.MultiValue>
);

const MiscellaneousInformation = (props) => {
  const { ListData, DecPropID, DecMPropID, DecIncID, setIsNonPropertyRoomSelected, propertystatus, setPropertyStatus, isViewEventDetails = false, } = props;

  const { setChangesStatus, get_Incident_Count, incidentCount, datezone, GetDataTimeZone, } = useContext(AgencyContext);
  const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
  const narrativeTypeDrpData = useSelector((state) => state.DropDown.narrativeTypeDrpData);

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const uniqueId = sessionStorage.getItem("UniqueUserID") ? Decrypt_Id_Name(sessionStorage.getItem("UniqueUserID"), "UForUniqueUserID") : "";
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param),
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));
  let MstPage = query?.get("page");
  const [mainIncidentID, setMainIncidentID] = useState("");
  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [loginPinID, setLoginPinID] = useState("");
  const [editval, setEditval] = useState([]);
  const [updateCount, setUpdateCount] = useState(0);
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
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
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [IsEvidenceStatus, setIsEvidenceStatus] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Individual");
  const [multiSelected, setMultiSelected] = useState({ optionSelected: null });
  const [fileUploadStatus, setfileUploadStatus] = useState(false);
  const [groupList, setGroupList] = useState([]);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const [value, setValue] = useState({
    IsSendToTaskList: true, IsSendToPropertyRoom: true, IsMaster: MstPage === "MST-Property-Dash" ? true : false, MasterPropertyID: "", 'MultiDocumentFile': '', PropertyID: "", Task: "", AgencyID: "", IncidentID: "", ReportedDtTm: "", DestroyDtTm: "", PropertyTag: "", NICB: "", Description: "", ModifiedByUserFK: "", CollectingOfficer: "", LocationOfCollection: "", EvidenceDescription: "", CollectionDtTm: "", IsNonPropertyRoom: "", IsEvidence: "", Reason: "", DispatchDtTm: "", ExpectedDtTm: "", DispatchingOfficer: "", FileAttachment1: "", Summary: "", LabLocation: "", LabName: "", TestPerformed: "", FileAttachment: "", PackagingDetails: "", Destination: "", ModOfTransport: "", Recipient: "", DispatchingOfficer: "", Comments: "", OfficerID: "",
  });

  const [errors, setErrors] = useState({
    CollectionDtTmError: "", CollectingOfficerError: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID); setLoginAgencyID(localStoreData?.AgencyID); dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID));
      dispatch(get_ScreenPermissions_Data("P090", localStoreData?.AgencyID, localStoreData?.PINID));
      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setaddUpdatePermission(effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setPermissionForAdd(false); setPermissionForEdit(false); setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (DecPropID || DecMPropID) {
      setMainIncidentID(DecIncID); get_Incident_Count(DecIncID);
      GetSingleData(DecPropID, DecMPropID, loginPinID); Get_SendTask_DrpVal(DecPropID, DecMPropID, loginAgencyID);
      GetDataDocument(DecPropID, DecMPropID, loginPinID);
      Get_TaskList_Status(DecPropID, loginAgencyID); Get_SendTask_Data(DecPropID, DecMPropID);
      setValue({
        ...value, MasterPropertyID: DecMPropID, PropertyID: DecPropID, IncidentID: DecIncID, OfficerID: loginPinID, CreatedByUserFK: loginPinID, AgencyID: loginAgencyID,
      });
    }
  }, [DecPropID]);

  const GetSingleData = (propertyID, masterPropertyID, loginPinID) => {
    const val = {
      PropertyID: propertyID, MasterPropertyID: masterPropertyID, PINID: loginPinID, IsMaster: MstPage === "MST-Property-Dash" ? true : false,
    };
    fetchPostData("Property/GetSingleData_Property", val).then((res) => {
      if (res) {
        setEditval(res); setPropertyRoomStatus(res[0]?.PropertyRoomStatus);
      } else {
        setEditval([]);
      }
    });
  };

  const GetDataDocument = (propertyID, masterPropertyID, loginPinID) => {
    const val = {
      PropertyID: propertyID,
      MasterPropertyID: masterPropertyID,
      PINID: loginPinID,
      IsMaster: MstPage === "MST-Property-Dash",
    };

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

  const Delete_Document = (fileToDelete) => {
    setSelectedFiles((prev) =>
      prev.filter((file) => file.documentID !== fileToDelete.documentID && file.name !== fileToDelete.name)
    );
    if (fileToDelete.isFromAPI) {
      const val = {
        DocumentID: fileToDelete.documentID,
        DeletedByUserFK: loginPinID,
      };

      fetchPostData("NonPropertyRoomDocument/Delete_NonPropertyRoomDocument", val)
        .then((res) => {
          // GetDataDocument(propertyID, masterPropertyID, loginPinID);
        })
        .catch((err) => {

        });
    }
  };



  const Get_SendTask_DrpVal = (PropertyID, MasterPropertyID) => {
    const val = {
      PropertyID: PropertyID, MasterPropertyID: MasterPropertyID, AgencyID: localStoreData?.AgencyID,
    };
    fetchPostData("TaskList/GetData_InsertGetData_TaskList", val)
      .then((data) => {
        if (data) {
          setSendTaskDrp(threeColArray(data, "PINID", "HeadOfAgency", "PINID"));
        } else {
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
          setTask(res[res.length - 1]?.Task);
        } else {
          setTask("");
        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };

  console.log(selectedFiles)

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

  const check_Validation_Error = (e) => {
    const CollectionDtTmErr = value.IsEvidence
      ? RequiredFieldIncident(value?.CollectionDtTm)
      : "true";
    const CollectingOfficerErr = value.IsEvidence
      ? RequiredFieldIncident(value?.CollectingOfficer)
      : "true";
    const ReasonErr =
      value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence
        ? RequiredFieldIncident(value?.Reason)
        : "true";
    const DispatchErr =
      value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence
        ? RequiredFieldIncident(value?.DispatchDtTm)
        : "true";
    const DispatchingOfficerErr =
      value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence
        ? RequiredFieldIncident(value?.DispatchingOfficer)
        : "true";
    const ReceipientErr =
      value.IsNonPropertyRoom && !value?.IsSendToTaskList && value.IsEvidence
        ? RequiredFieldIncident(value?.Recipient)
        : "true";
    setErrors((prevValues) => {
      return {
        ...prevValues,
        ["CollectionDtTmError"]:
          CollectionDtTmErr || prevValues["CollectionDtTmError"],
        ["CollectingOfficerError"]:
          CollectingOfficerErr || prevValues["CollectingOfficerError"],
        ["ReasonError"]: ReasonErr || prevValues["ReasonError"],
        ["DispatchError"]: DispatchErr || prevValues["DispatchError"],
        ["DispatchingOfficerError"]:
          DispatchingOfficerErr || prevValues["DispatchingOfficerError"],
        ["ReceipientError"]: ReceipientErr || prevValues["ReceipientError"],
      };
    });
  };

  const { CollectionDtTmError, CollectingOfficerError, ReasonError, DispatchError, DispatchingOfficerError, ReceipientError, } = errors;

  useEffect(() => {
    if (
      CollectionDtTmError === "true" &&
      CollectingOfficerError === "true" &&
      ReasonError === "true" &&
      DispatchError === "true" &&
      DispatchingOfficerError === "true" &&
      ReceipientError === "true"
    ) {
      if (value.IsSendToPropertyRoom || value.IsNonPropertyRoom) {
        Update_Name();
      } else {
        toastifyError("Select Property Room Type");
      }
    }
  }, [
    CollectionDtTmError, CollectingOfficerError, ReasonError, DispatchError, DispatchingOfficerError, ReceipientError,
  ]);

  // const Update_Name = () => {
  //   const { MasterPropertyID, MProId, PropertyID, ProId, AgencyID, IncidentID, IncID, DestroyDtTm, PropertyTag, NICB, Description, IsSendToPropertyRoom, ModifiedByUserFK, IsMaster, IsSendToTaskList, CollectingOfficer, LocationOfCollection, EvidenceDescription, CollectionDtTm, IsNonPropertyRoom, IsEvidence, Task, Reason, DispatchDtTm, ExpectedDtTm, DispatchingOfficer, Comments, Recipient, ModOfTransport, Destination, PackagingDetails, FileAttachment, TestPerformed, LabName, LabLocation, Summary, FileAttachment1,
  //   } = value;
  //   const val = {
  //     CreatedByUserFK: loginPinID, MasterPropertyID: MasterPropertyID, PropertyID: PropertyID, AgencyID: loginAgencyID, IsMaster: IsMaster, IncidentID: IncidentID, IsSendToPropertyRoom: IsSendToPropertyRoom, ModifiedByUserFK: loginPinID, DestroyDtTm: DestroyDtTm, PropertyTag: PropertyTag, NICB: NICB, Description: Description, CollectingOfficer: CollectingOfficer, LocationOfCollection: LocationOfCollection, EvidenceDescription: EvidenceDescription, CollectionDtTm: CollectionDtTm, IsNonPropertyRoom: IsNonPropertyRoom, IsEvidence: IsEvidence, Task: Task, IsSendToTaskList: IsSendToTaskList, Reason: Reason, DispatchDtTm: DispatchDtTm, ExpectedDtTm: ExpectedDtTm, DispatchingOfficer: DispatchingOfficer, Summary: Summary, LabLocation: LabLocation, LabName: LabName, TestPerformed: TestPerformed, PackagingDetails: PackagingDetails, Destination: Destination, ModOfTransport: ModOfTransport, Recipient: Recipient, DispatchingOfficer: DispatchingOfficer, Comments: Comments,
  //   };
  //   AddDeleteUpadate("Property/Update_MiscellaneousInformation", val)
  //     .then((res) => {
  //       if (res?.success) {
  //         const parsedData = JSON.parse(res.data);
  //         const message = parsedData.Table[0].Message;
  //         toastifySuccess(message);
  //         Update_Name_Document();
  //         GetSingleData(PropertyID, MasterPropertyID, loginPinID);
  //         Get_TaskList_Status(PropertyID);
  //         setChangesStatus(false);
  //         setStatesChangeStatus(false);
  //         Reset();
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toastifyError(err?.message);
  //     });
  // };

  const uploadNonPropertyRoomDocuments = async (PropertyID, MasterPropertyID, CreatedByUserFK, files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    const metadataArray = [];

    files.forEach(() => {
      metadataArray.push(
        JSON.stringify({
          PropertyID,
          MasterPropertyID,
          CreatedByUserFK,
        })
      );
    });

    files.forEach(file => formData.append("File", file));

    formData.append("Data", JSON.stringify(metadataArray));
    console.log(metadataArray)


    try {
      const response = await AddDelete_Img("NonPropertyRoomDocument/Insert_NonPropertyRoomDocument", formData);
      if (response?.success) {
        toastifySuccess("Document(s) uploaded successfully.");
        GetDataDocument(PropertyID, MasterPropertyID, loginPinID);
      } else {
        toastifyError("Failed to upload documents.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toastifyError("An error occurred while uploading documents.");
    }
  };


  const Update_Name = () => {
    const {
      MasterPropertyID, PropertyID, AgencyID, IncidentID, DestroyDtTm, PropertyTag,
      NICB, Description, IsSendToPropertyRoom, ModifiedByUserFK, IsMaster,
      IsSendToTaskList, CollectingOfficer, LocationOfCollection, EvidenceDescription,
      CollectionDtTm, IsNonPropertyRoom, IsEvidence, Task, Reason, DispatchDtTm,
      ExpectedDtTm, DispatchingOfficer, Comments, Recipient, ModOfTransport,
      Destination, PackagingDetails, TestPerformed, LabName, LabLocation, Summary
    } = value;

    const val = {
      CreatedByUserFK: loginPinID,
      MasterPropertyID,
      PropertyID,
      AgencyID: loginAgencyID,
      IsMaster,
      IncidentID,
      IsSendToPropertyRoom,
      ModifiedByUserFK: loginPinID,
      DestroyDtTm,
      PropertyTag,
      NICB,
      Description,
      CollectingOfficer,
      LocationOfCollection,
      EvidenceDescription,
      CollectionDtTm,
      IsNonPropertyRoom,
      IsEvidence,
      Task,
      IsSendToTaskList,
      Reason,
      DispatchDtTm,
      ExpectedDtTm,
      DispatchingOfficer,
      Summary,
      LabLocation,
      LabName,
      TestPerformed,
      PackagingDetails,
      Destination,
      ModOfTransport,
      Recipient,
      Comments
    };



    AddDeleteUpadate("Property/Update_MiscellaneousInformation", val)
      .then(async (res) => {
        if (res?.success) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          // ✅ Call document upload here
          if (selectedFiles?.length > 0 && fileUploadStatus) {
            await uploadNonPropertyRoomDocuments(PropertyID, MasterPropertyID, loginPinID, selectedFiles);
          }

          GetSingleData(PropertyID, MasterPropertyID, loginPinID);
          Get_TaskList_Status(PropertyID);
          setChangesStatus(false);
          setStatesChangeStatus(false);
          Reset();
        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };




  useEffect(() => {
    if (taskEditVal) {
      setSendTaskId(taskEditVal);
    }
  }, [taskEditVal]);

  useEffect(() => {
    if (editval?.length > 0) {
      const IsSendToPropertyRoom =
        editval[0].IsSendToPropertyRoom === false &&
          editval[0].CollectionDtTm === null &&
          editval[0].CollectingOfficer === null
          ? true
          : editval[0]?.IsSendToPropertyRoom;
      let tempTasklistStatus = null;
      if (!editval[0]?.IsNonPropertyRoom) {
        tempTasklistStatus = true;
      } else {
        tempTasklistStatus = editval[0]?.IsSendToTaskList;
      }
      setValue({
        ...value,
        MasterPropertyID: DecMPropID,
        PropertyID: DecPropID,
        DestroyDtTm: editval[0]?.DestroyDtTm
          ? getShowingWithOutTime(editval[0]?.DestroyDtTm)
          : null,
        Description: editval[0]?.Description,
        NICB: editval[0]?.NICB,
        PropertyTag: editval[0]?.PropertyTag,
        IsSendToPropertyRoom: IsSendToPropertyRoom,
        CollectingOfficer: editval[0]?.CollectingOfficer,
        LocationOfCollection: editval[0]?.LocationOfCollection,
        EvidenceDescription: editval[0]?.EvidenceDescription,
        CollectionDtTm: editval[0]?.CollectionDtTm,
        IsEvidence: editval[0]?.IsEvidence,
        IsNonPropertyRoom: editval[0]?.IsNonPropertyRoom,
        ReportedDtTm: editval[0]?.ReportedDtTm,
        IsSendToTaskList: tempTasklistStatus,
        Reason: editval[0]?.Reason,
        DispatchDtTm: editval[0]?.DispatchDtTm,
        ExpectedDtTm: editval[0]?.ExpectedDtTm,
        DispatchingOfficer: editval[0]?.DispatchingOfficer,
        Summary: editval[0]?.Summary,
        LabLocation: editval[0]?.LabLocation,
        LabName: editval[0]?.LabName,
        TestPerformed: editval[0]?.TestPerformed,
        PackagingDetails: editval[0]?.PackagingDetails,
        Destination: editval[0]?.Destination,
        ModOfTransport: editval[0]?.ModOfTransport,
        Recipient: editval[0]?.Recipient,
        DispatchingOfficer: editval[0]?.DispatchingOfficer,
      });

      setIsEvidenceStatus(editval[0]?.IsEvidence);
      setCollectiondate(
        editval[0]?.CollectionDtTm ? new Date(editval[0]?.CollectionDtTm) : ""
      );
      setdisPatchdate(
        editval[0]?.DispatchDtTm ? new Date(editval[0]?.DispatchDtTm) : ""
      );
      setexpectedArrival(
        editval[0]?.ExpectedDtTm ? new Date(editval[0]?.ExpectedDtTm) : ""
      );
      if (editval[0]?.IsSendToPropertyRoom) {
        setPropertyStatus(true);
      } else {
        setPropertyStatus(false);
      }
    }
  }, [editval, updateCount]);

  const HandleChanges = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === "IsSendToPropertyRoom") {
      setIsNonPropertyRoomSelected(false);
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
        IsNonPropertyRoom: false,
      });
      setErrors({
        ...errors,
        CollectionDtTmError: "",
        CollectingOfficerError: "",
      });
    } else if (e.target.name === "IsNonPropertyRoom") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
        IsSendToPropertyRoom: false,
      });
      setIsNonPropertyRoomSelected(true);
      setErrors({
        ...errors,
        CollectionDtTmError: "",
        CollectingOfficerError: "",
      });
    } else if (e.target.name === "IsEvidence") {
      if (!e.target.checked) {
        setValue({
          ...value,
          [e.target.name]: e.target.checked,
          CollectingOfficer: "",
          LocationOfCollection: "",
          EvidenceDescription: "",
          CollectionDtTm: "",
          IsNonPropertyRoom: "",
        });
        setCollectiondate("");
        setIsNonPropertyRoom(false);
      } else {
        setValue({
          ...value,
          [e.target.name]: e.target.checked,
        });
      }
    } else if (e.target.name === "IsSendToTaskList") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
      });
    } else {
      setValue({
        ...value,
        [e.target.name]: e.target.value,
      });
    }
  };

  function filterArray(arr, key) {
    return [...new Map(arr?.map((item) => [item[key], item])).values()];
  }

  const Reset = (e) => {
    setValue({
      ...value,
      MasterPropertyID: "",
      PropertyID: "",
      Task: "",
      AgencyID: "",
      IncidentID: "",
      ReportedDtTm: "",
      DestroyDtTm: "",
      PropertyTag: "",
      NICB: "",
      Description: "",
      IsSendToPropertyRoom: true,
      ModifiedByUserFK: "",
      IsMaster: MstPage === "MST-Property-Dash" ? true : false,
      CollectingOfficer: "",
      LocationOfCollection: "",
      EvidenceDescription: "",
      CollectionDtTm: "",
      IsSendToTaskList: true,
      IsNonPropertyRoom: "",
      IsEvidence: "",
      Reason: "",
      DispatchDtTm: "",
      ExpectedDtTm: "",
      DispatchingOfficer: "",
      FileAttachment1: "",
      Summary: "",
      LabLocation: "",
      LabName: "",
      TestPerformed: "",
      FileAttachment: "",
      PackagingDetails: "",
      Destination: "",
      ModOfTransport: "",
      Recipient: "",
      DispatchingOfficer: "",
    });
    setErrors({
      ...errors,
      CollectionDtTmError: "",
      CollectingOfficerError: "",
    });
    setfileUploadStatus(false);

    setStatesChangeStatus(false);
    setCollectiondate("");
    setdisPatchdate("");
    setexpectedArrival("");
    if (editval[0]?.Description?.length > 0) {
      setUpdateCount(updateCount + 1);
    }
  };

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    !addUpdatePermission && setChangesStatus(true);
    if ((e && name === "Task") || (e === null && name === "Task")) {
      setTaskToSend(e ? e.label : "");

      if (e) TaskListvalidation(e.label);
    } else if (e) {
      setValue({
        ...value,
        [name]: e.value,
      });
    } else {
      setValue({
        ...value,
        [name]: null,
      });
    }
  };
  const TaskListvalidation = (selectedStatus) => {
    setTaskListStatus("");
    if (task === "CheckIn" && selectedStatus === "CheckIn") {
      setTaskListStatus("Task already send to task list ");
    } else if (task === "CheckOut" && selectedStatus === "CheckOut") {
      setTaskListStatus("Already Checkout ");
    } else if (task === "CheckOut" && selectedStatus === "Transfer Location") {
      setTaskListModalStatus(true);
    }
  };

  const TaskListDataChange = (multiSelected) => {
    setSendTaskId(multiSelected);
    const len = multiSelected.length - 1;
    if (multiSelected?.length < taskEditVal?.length) {
      let missing = null;
      let i = taskEditVal.length;
      while (i) {
        missing = ~multiSelected.indexOf(taskEditVal[--i])
          ? missing
          : taskEditVal[i];
      }
      DelSertBasicInfo(missing?.id, "TaskListID", "TaskList/Delete_TaskList");
    } else {
      InSertBasicInfo(
        multiSelected[len]?.value,
        "OfficerID",
        "TaskList/Insert_TaskList"
      );
    }
  };

  const InSertBasicInfo = (id, col1, url, task) => {
    const documentAccess =
      selectedOption === "Individual" ? "Individual" : "Group";

    const val = {
      PropertyID: DecPropID,
      MasterPropertyID: DecMPropID,
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
          toastifySuccess(message);

          Get_SendTask_Data(DecPropID, DecMPropID);
          Get_SendTask_DrpVal(DecPropID, DecMPropID);
        } else {
          console.log("Somthing Wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };

  const DelSertBasicInfo = (TaskListID, col1, url) => {
    const val = {
      [col1]: TaskListID,
      DeletedByUserFK: loginPinID,
    };
    AddDeleteUpadate(url, val)
      .then((res) => {
        if (res) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);

          Get_SendTask_Data(DecPropID, DecMPropID);
          Get_SendTask_DrpVal(DecPropID, DecMPropID);
        } else {
          console.log("Somthing Wrong");
        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };

  const handleChange = (event) => {
    !addUpdatePermission && setChangesStatus(true);
    !addUpdatePermission && setStatesChangeStatus(true);

    const { name, value } = event.target;
    if (event) {
      setValue((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setValue((prevState) => ({ ...prevState, [name]: null }));
    }
  };

  const customStylesWithOutColor = {
    control: (base) => ({
      ...base,
      height: 20,
      minHeight: 31,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newFilesArray = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
    setStatesChangeStatus(true);
    setfileUploadStatus(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      const status = task;
      arr = [{ value: "1", label: "CheckIn" }];
      if (status) {
        const filteredvalue = StatusOption.filter(
          (item) => item.label !== task
        );
        console.log(filteredvalue);
        return filteredvalue;
      }
      return arr;
    }
  };

  console.log(PropertyRoomStatus);

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

  const columns1 = [
    {
      name: "Property ",
      selector: (row) => row.PropertyNumber,
      sortable: true,
    },
    {
      name: "Property Officer",
      selector: (row) => row.PropertyNumber,
      sortable: true,
    },
    {
      name: "Property Type",
      selector: (row) => row.PropertyType_Description,
      sortable: true,
    },
  ];

  const handleRadioChangeArrestForward = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    setValue({
      ...value,
      ["OfficerID"]: "",
      ["DocumentAccess_Name"]: "",
    });
    setMultiSelected({ optionSelected: [] });
    setErrors({
      ...errors,
      ["ApprovalCommentsError"]: "",
      ["CommentsDocumentsError"]: "",
      ["ApprovingOfficerError"]: "",
      ["GroupError"]: "",
    });
  };

  const colourStylesUsers = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      backgroundColor: isDisabled ? "#d3d3d3" : "#fce9bf",
      fontSize: 14,
      marginTop: 2,
      boxShadow: "none",
      cursor: isDisabled ? "not-allowed" : "default",
    }),
  };

  const Agencychange = (multiSelected) => {
    // setStatesChangeStatus(true)
    // setMultiSelected({optionSelected: multiSelected });
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
        ...value,
        ["GroupName"]: changeArrayFormat_WithFilter(
          groupList,
          "group",
          groupList[0]?.GroupID
        ),
        // 'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
        // 'WrittenForID': checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
        // 'IncidentId': incidentID,
        CreatedByUserFK: loginPinID,
      });
    }
  }, [groupList]);

  const get_Group_List = (loginAgencyID) => {
    const value = { AgencyId: loginAgencyID, PINID: loginPinID };
    fetchPostData("Group/GetData_Group", value).then((res) => {
      if (res) {
        setGroupList(changeArrayFormat(res, "group"));
        // if (res[0]?.GroupID) {
        //   setValue({
        //     ...value,
        //     ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
        //     // 'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
        //     // 'WrittenForID': checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
        //     'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
        //   });
        // }
      } else {
        setGroupList();
      }
    });
  };

  useEffect(() => {
    if (loginAgencyID) {
      // dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
      // Get_WrittenForDataDrp(loginAgencyID, IncID);
      dispatch(get_Report_Approve_Officer_Data(loginAgencyID, loginPinID));
      if (narrativeTypeDrpData?.length === 0) {
        dispatch(get_Narrative_Type_Drp_Data(loginAgencyID));
      }
      get_Group_List(loginAgencyID);
      // get_IncidentTab_Count(IncID, loginPinID);
    }
  }, [loginAgencyID]);

  return (
    <>
      <PropListng {...{ ListData }} />
      <div className="col-12 child " id="display-not-form">
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 pt-1 p-0">
            <fieldset className="px-0">
              <legend>Miscellaneous Information</legend>
              <div className="row">
                <div className="col-2 col-md-2 col-lg-2  mt-3">
                  <label htmlFor="" className="new-label">
                    NICB #
                  </label>
                </div>
                <div className="col-10 col-md-10 col-lg-3 text-field mt-2">
                  <input
                    type="text"
                    name="NICB"
                    id="NICB"
                    value={value?.NICB}
                    onChange={HandleChanges}
                    className="readonlyColor"
                    required
                    readOnly
                  />
                </div>
                <div className="col-2 col-md-2 col-lg-3  mt-3">
                  <label htmlFor="" className="new-label">
                    Destroy Date
                  </label>
                </div>
                <div className="col-10 col-md-10 col-lg-4 text-field mt-2">
                  <DatePicker
                    id="DestroyDtTm"
                    name="DestroyDtTm"
                    className="readonlyColor"
                    onChange={(date) => {
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
                    selected={
                      value?.DestroyDtTm && new Date(value?.DestroyDtTm)
                    }
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
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-2 col-md-2 col-lg-2  mt-2">
                  <label htmlFor="" className="new-label">
                    Description
                  </label>
                </div>
                <div className="col-5 col-md-8 col-lg-5 mt-1">
                  <textarea
                    name="Description"
                    id="Description"
                    value={value?.Description}
                    onChange={HandleChanges}
                    className="form-control"
                    cols={30}
                    rows={1}
                    maxLength={250}
                  ></textarea>
                </div>
              </div>
            </fieldset>
            <fieldset className="px-0">
              <div className="col-12">
                <div className="">
                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="evidence"
                        name="IsEvidence"
                        value={value?.IsEvidence}
                        checked={value?.IsEvidence}
                        disabled={IsEvidenceStatus}
                        onChange={HandleChanges}
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
                        {/* <DatePicker
                                                id="ReportedDate"
                                                name='ReportedDate'
                                                dateFormat="MM/dd/yyyy HH:mm"
                                                onChange={(date) => {
                                                    !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                                    if (date) {
                                                        console.log("occured frpm date entered true::", date);
                                                        let maxTimestamp = new Date();
                                                        let occurredFromTimestamp = new Date(value?.ReportedDtTm);

                                                        let selectedDate = new Date(date);
                                                        if (selectedDate?.getTime() <= occurredFromTimestamp.getTime()) {
                                                            selectedDate = new Date(occurredFromTimestamp.getTime() + 60000);
                                                        }
                                                        if (selectedDate?.getTime() >= maxTimestamp.getTime()) {
                                                            selectedDate = maxTimestamp;
                                                        }
                                                        setCollectiondate(selectedDate);
                                                        setValue({
                                                            ...value,
                                                            ['CollectionDtTm']: getShowingMonthDateYear(selectedDate),
                                                        });
                                                    }
                                                    else {
                                                        console.log("occured frpm date entered false::", date);
                                                        setCollectiondate(date);
                                                        setValue({
                                                            ...value,
                                                            ['CollectionDtTm']: date ? getShowingMonthDateYear(date) : null,
                                                        });
                                                    }
                                                }}
                                                maxDate={new Date()}
                                                filterTime={filterTime}
                                                selected={collectiondate}
                                                className='requiredColor'
                                                timeInputLabel
                                                showTimeSelect
                                                timeIntervals={1}
                                                timeCaption="Time"
                                                showMonthDropdown
                                                showYearDropdown
                                                dropdownMode="select"
                                                showDisabledMonthNavigation
                                                autoComplete='off'
                                                timeFormat="HH:mm "
                                                is24Hour
                                                minDate={new Date(value?.ReportedDtTm)}
                                            /> */}
                        <DatePicker
                          id="ReportedDate"
                          name="ReportedDate"
                          dateFormat="MM/dd/yyyy HH:mm"
                          onChange={(date) => {
                            !addUpdatePermission && setStatesChangeStatus(true);
                            !addUpdatePermission && setChangesStatus(true);

                            if (date) {
                              console.log(
                                "occurred from date entered true::",
                                date
                              );

                              let occurredFromTimestamp = new Date(
                                value?.ReportedDtTm
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

                              setCollectiondate(selectedDate);
                              setValue({
                                ...value,
                                ["CollectionDtTm"]:
                                  getShowingMonthDateYear(selectedDate),
                              });
                            } else {
                              console.log(
                                "occurred from date entered false::",
                                date
                              );
                              setCollectiondate(date);
                              setValue({
                                ...value,
                                ["CollectionDtTm"]: null,
                              });
                            }
                          }}
                          selected={collectiondate}
                          placeholderText={"Select..."}
                          className="requiredColor"
                          timeInputLabel
                          showTimeSelect
                          timeIntervals={1}
                          timeCaption="Time"
                          showMonthDropdown
                          isClearable={false}
                          showYearDropdown
                          dropdownMode="select"
                          showDisabledMonthNavigation
                          autoComplete="off"
                          timeFormat="HH:mm"
                          is24Hour
                          minDate={new Date(value?.ReportedDtTm)} // ✅ Only after ReportedDtTm allowed
                          maxDate={new Date(datezone)}
                          filterTime={(time) => {
                            // Optional: If selected date is same day as ReportedDtTm, restrict time
                            const reported = new Date(value?.ReportedDtTm);
                            const selectedDateOnly = new Date(collectiondate);
                            selectedDateOnly.setHours(0, 0, 0, 0);
                            reported.setHours(0, 0, 0, 0);

                            if (
                              selectedDateOnly.getTime() === reported.getTime()
                            ) {
                              return (
                                time.getTime() >
                                new Date(value?.ReportedDtTm).getTime()
                              );
                            }
                            return true;
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
                            onChange={(e) => {
                              handleChange(e);
                            }}
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
                          onChange={(e) =>
                            ChangeDropDown(e, "CollectingOfficer")
                          }
                          placeholder="Select.."
                          menuPlacement="bottom"
                          isClearable
                          styles={Requiredcolour}
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
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {value?.IsEvidence ? (
                    value?.IsNonPropertyRoom ? (
                      <div className="row align-items-center mt-1">
                        <div className="col-12 col-md-12 col-lg-2 ">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              name="IsSendToTaskList"
                              value={value?.IsSendToTaskList}
                              onChange={HandleChanges}
                              checked={value?.IsSendToTaskList}
                              type="checkbox"
                              id="flexCheckDefault"
                            />
                            <label
                              className="form-check-label mb-0"
                              for="flexCheckDefault1"
                            >
                              Send To Task List
                            </label>
                          </div>
                        </div>

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
                                    {/* <div className="col-2 col-md-2 col-lg-2">
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
                                    </div> */}
                                    <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
                                      <SelectBox
                                        className="custom-multiselect"
                                        classNamePrefix="custom"
                                        options={agencyOfficerDrpData}
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
                                    {/* <div className="col-2 col-md-2 col-lg-2 ">
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
                                    </div> */}
                                    <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
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
                          <div className="col-3 col-md-3 col-lg-4 mt-1 px-1 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-sm mb-2 mt-1"
                              style={{
                                backgroundColor: "#001f3f",
                                color: "#fff",
                              }}
                              onClick={() => {
                                InSertBasicInfo(
                                  value?.CollectingOfficer,
                                  "OfficerID",
                                  "TaskList/Insert_TaskList",
                                  taskToSend
                                );
                                setTaskToSend("");
                              }}
                              disabled={!value.OfficerID}
                            >
                              Send
                            </button>
                          </div>
                        </>

                        {/* {value?.IsSendToTaskList ?
                                                <>
                                                    <div className='col-1 col-md-1 col-lg-1 mt-2'>
                                                        <label className="form-check-label" htmlFor="sendToPropertyRoom">
                                                            Assignee
                                                        </label>
                                                    </div>

                                                    <div className='col-3 col-md-3 col-lg-5 g-1 d-flex mt-2   '>

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
                                                                    <label className="form-check-label" htmlFor="Individual">
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
                                                                    <label className="form-check-label" htmlFor="Group">
                                                                        By Group
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <>
                                                                {selectedOption === "Individual" ? (
                                                                    <>
                                                                        <div className="col-2 col-md-2 col-lg-2">
                                                                            <span className="label-name">
                                                                                User
                                                                                {errors.ApprovingOfficerError !== 'true' && (
                                                                                    <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", fontWeight: "400" }}>
                                                                                        {errors.ApprovingOfficerError}
                                                                                    </p>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-4 col-md-12 col-lg-4 dropdown__box mt-0">
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
                                                                        <div className="col-2 col-md-2 col-lg-2 ">
                                                                            <span className="label-name">
                                                                                 Group
                                                                                {errors.ApprovingOfficerError !== 'true' && (
                                                                                    <p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", fontWeight: "400" }}>
                                                                                        {errors.ApprovingOfficerError}
                                                                                    </p>
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                        <div className="col-4 col-md-12 col-lg-4 dropdown__box mt-0">
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


                                                   
                                                </> : null}  */}

                        {value.IsNonPropertyRoom &&
                          !value?.IsSendToTaskList && (
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
                                        className="requiredColor"
                                        onChange={(e) => handleChange(e)}
                                        styles={Requiredcolour}
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
                                    {/* <DatePicker
                                                                        id="DispatchDtTm"
                                                                        name='DispatchDtTm'
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        onChange={(date) => {
                                                                            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                                                            if (date) {
                                                                                console.log("occured frpm date entered true::", date);
                                                                                let maxTimestamp = new Date();
                                                                                let occurredFromTimestamp = new Date(value?.ReportedDtTm);

                                                                                let selectedDate = new Date(date);
                                                                                if (selectedDate?.getTime() <= occurredFromTimestamp.getTime()) {
                                                                                    selectedDate = new Date(occurredFromTimestamp.getTime() + 60000);
                                                                                }
                                                                                if (selectedDate?.getTime() >= maxTimestamp.getTime()) {
                                                                                    selectedDate = maxTimestamp;
                                                                                }
                                                                                setdisPatchdate(selectedDate);
                                                                                setValue({
                                                                                    ...value,
                                                                                    ['DispatchDtTm']: getShowingMonthDateYear(selectedDate),
                                                                                });
                                                                            }
                                                                            else {
                                                                                console.log("occured from date entered false::", date);
                                                                                setdisPatchdate(date);
                                                                                setValue({
                                                                                    ...value,
                                                                                    ['DispatchDtTm']: date ? getShowingMonthDateYear(date) : null,
                                                                                });
                                                                            }
                                                                        }}
                                                                        maxDate={new Date()}
                                                                        filterTime={filterTime}
                                                                        selected={dispatchdate}
                                                                        className='requiredColor'
                                                                        timeInputLabel
                                                                        showTimeSelect
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        dropdownMode="select"
                                                                        showDisabledMonthNavigation
                                                                        autoComplete='off'
                                                                        timeFormat="HH:mm "
                                                                        is24Hour
                                                                        minDate={new Date(value?.ReportedDtTm)}
                                                                    /> */}

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
                                          console.log(
                                            "occurred from date entered true::",
                                            date
                                          );

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
                                              occurredFromTimestamp.getTime() +
                                              60000
                                            ); // 1 min after
                                          }

                                          setdisPatchdate(selectedDate);
                                          setValue({
                                            ...value,
                                            ["DispatchDtTm"]:
                                              getShowingMonthDateYear(
                                                selectedDate
                                              ),
                                          });
                                        } else {
                                          console.log(
                                            "occurred from date entered false::",
                                            date
                                          );
                                          setdisPatchdate(date);
                                          setValue({
                                            ...value,
                                            ["DispatchDtTm"]: null,
                                          });
                                        }
                                      }}
                                      selected={dispatchdate}
                                      className="requiredColor"
                                      timeInputLabel
                                      showTimeSelect
                                      timeIntervals={1}
                                      timeCaption="Time"
                                      showMonthDropdown
                                      isClearable={false}
                                      showYearDropdown
                                      dropdownMode="select"
                                      showDisabledMonthNavigation
                                      autoComplete="off"
                                      placeholderText={"Select..."}
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
                                            new Date(
                                              value?.ReportedDate
                                            ).getTime()
                                          );
                                        }
                                        return true;
                                      }}
                                    />
                                  </div>

                                  <div className="col-3 col-md-2 col-lg-2 mt-2">
                                    <label htmlFor="" className="new-label">
                                      Expected Arrival Date/Time
                                    </label>
                                  </div>
                                  <div className="col-3 col-md-3 col-lg-2 ">
                                    {/* <DatePicker
                                                                        id="ExpectedDtTm"
                                                                        name='ExpectedDtTm'
                                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                                        onChange={(date) => {
                                                                            !addUpdatePermission && setStatesChangeStatus(true); !addUpdatePermission && setChangesStatus(true);
                                                                            if (date) {
                                                                                console.log("occured frpm date entered true::", date);
                                                                                let maxTimestamp = new Date();
                                                                                let occurredFromTimestamp = new Date(value?.ReportedDtTm);

                                                                                let selectedDate = new Date(date);
                                                                                if (selectedDate?.getTime() <= occurredFromTimestamp.getTime()) {
                                                                                    selectedDate = new Date(occurredFromTimestamp.getTime() + 60000);
                                                                                }
                                                                                if (selectedDate?.getTime() >= maxTimestamp.getTime()) {
                                                                                    selectedDate = maxTimestamp;
                                                                                }
                                                                                setexpectedArrival(selectedDate);
                                                                                setValue({
                                                                                    ...value,
                                                                                    ['ExpectedDtTm']: getShowingMonthDateYear(selectedDate),
                                                                                });
                                                                            }
                                                                            else {
                                                                                console.log("occured frpm date entered false::", date);
                                                                                setexpectedArrival(date);
                                                                                setValue({
                                                                                    ...value,
                                                                                    ['ExpectedDtTm']: date ? getShowingMonthDateYear(date) : null,
                                                                                });
                                                                            }
                                                                        }}
                                                                        maxDate={new Date()}
                                                                        filterTime={filterTime}
                                                                        selected={expectedArrival}

                                                                        timeInputLabel
                                                                        showTimeSelect
                                                                        timeIntervals={1}
                                                                        timeCaption="Time"
                                                                        showMonthDropdown
                                                                        showYearDropdown
                                                                        dropdownMode="select"
                                                                        showDisabledMonthNavigation
                                                                        autoComplete='off'
                                                                        timeFormat="HH:mm "
                                                                        is24Hour
                                                                        minDate={new Date(value?.ReportedDtTm)}
                                                                    /> */}

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
                                          console.log(
                                            "occurred from date entered true::",
                                            date
                                          );

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
                                              occurredFromTimestamp.getTime() +
                                              60000
                                            ); // 1 min after
                                          }

                                          setexpectedArrival(selectedDate);
                                          setValue({
                                            ...value,
                                            ["ExpectedDtTm"]:
                                              getShowingMonthDateYear(
                                                selectedDate
                                              ),
                                          });
                                        } else {
                                          console.log(
                                            "occurred from date entered false::",
                                            date
                                          );
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
                                      dropdownMode="select"
                                      showDisabledMonthNavigation
                                      autoComplete="off"
                                      timeFormat="HH:mm"
                                      is24Hour
                                      placeholderText={"Select..."}
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
                                            new Date(
                                              value?.ReportedDate
                                            ).getTime()
                                          );
                                        }
                                        return true;
                                      }}
                                    />
                                  </div>

                                  <div className="col-3 col-md-2 col-lg-2 mt-2">
                                    <label htmlFor="" className="new-label">
                                      Dispatching Officer
                                      {errors.DispatchingOfficerError !==
                                        "true" ? (
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
                                      styles={Requiredcolour}
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
                                    <label htmlFor="" className="new-label">
                                      Recipient
                                    </label>
                                  </div>
                                  <div className="col-4 col-md-3 col-lg-2">
                                    <div className="text-field mt-1">
                                      <input type="text" name="Recipient" value={value.Recipient} onChange={(e) => handleChange(e)}
                                        styles={Requiredcolour} className="requiredColor"
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
                                  {/* <div className="col-4 col-md-3 col-lg-2 mt-1">
                                    <input type="text" name="ModOfTransport" value={value.ModOfTransport} onChange={(e) => handleChange(e)} styles={Requiredcolour}
                                    />
                                  </div> */}
                                  <div className="col-4 col-md-3 col-lg-2">
                                    <div className="text-field mt-1">
                                      <input type="text" name="ModOfTransport" value={value.ModOfTransport} onChange={(e) => handleChange(e)}
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
                                        onChange={(e) => handleChange(e)}
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
                                        onChange={(e) => handleChange(e)}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-2 d-flex align-items-center justify-content-end mt-1">
                                    <label className="new-label">
                                      Comments
                                    </label>
                                  </div>
                                  <div className="col-10 d-flex align-items-center text-field justify-content-end mt-1">
                                    <textarea
                                      type="text"
                                      rows="1"
                                      className="form-control  py-1 new-input"
                                      style={{
                                        height: "auto",
                                        overflowY: "scroll",
                                        color: "#000",
                                      }}
                                      placeholder="Comment"
                                      name="Comments"
                                      value={value.Comments}
                                      onChange={(e) => {
                                        handleChange(e);
                                      }}
                                    />
                                  </div>
                                  {/* <div className="row">
                                    <div className="col-2 col-md-2 col-lg-2  mt-2">
                                      <label htmlFor="" className="new-label">
                                        Description
                                      </label>
                                    </div>
                                    <div className="col-10 d-flex align-items-center justify-content-end mt-1">
                                      <textarea
                                        name="Description"
                                        id="Description"
                                        value={value?.Description}
                                        onChange={HandleChanges}
                                        className="form-control"
                                        cols={30}
                                        rows={1}
                                        maxLength={250}
                                      ></textarea>
                                    </div>
                                  </div> */}

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
                                      padding: "4px",
                                      borderRadius: "4px",
                                      width: "100%",
                                      background: "#fff",
                                    }}
                                  >
                                    {/* Choose File Button */}
                                    <label
                                      htmlFor="file-input"
                                      style={{
                                        padding: "4px 10px",
                                        backgroundColor: "#f0f0f0",
                                        border: "1px solid #ccc",
                                        borderRadius: "2px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                        color: "#333",
                                        marginRight: "6px",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      Choose Files
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
                                        display: "flex",
                                        flexWrap: "wrap",
                                        flex: "1",
                                        alignItems: "center",
                                        gap: "6px",
                                      }}
                                    >
                                      {selectedFiles.length > 0 ? (
                                        selectedFiles.map((file, index) => (
                                          <div
                                            key={index}
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              backgroundColor: "transparent",
                                              border: "1px solid #ccc",
                                              padding: "2px 6px",
                                              borderRadius: "2px",
                                              fontSize: "12px",
                                              color: "#333",
                                            }}
                                          >
                                            <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                              {file.name}
                                            </span>
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
                                                color: "#333",
                                              }}
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ))
                                      ) : (
                                        <span
                                          style={{
                                            color: "#777",
                                            fontSize: "13px",
                                          }}
                                        >
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
                                    <label
                                      htmlFor=""
                                      className="new-label mb-0"
                                    >
                                      Test Performed
                                    </label>
                                  </div>
                                  <div className="col-4 col-md-3 col-lg-2">
                                    <div className="text-field mt-0 ">
                                      <input
                                        type="text"
                                        name="TestPerformed"
                                        value={value.TestPerformed}
                                        onChange={(e) => handleChange(e)}
                                        styles={Requiredcolour}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-3 col-md-2 col-lg-2 ">
                                    <label
                                      htmlFor=""
                                      className="new-label mb-0"
                                    >
                                      Lab Name
                                    </label>
                                  </div>
                                  <div className="col-4 col-md-3 col-lg-2">
                                    <div className="text-field mt-0 ">
                                      <input
                                        type="text"
                                        name="LabName"
                                        value={value.LabName}
                                        onChange={(e) => handleChange(e)}
                                        styles={Requiredcolour}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-3 col-md-2 col-lg-2 ">
                                    <label
                                      htmlFor=""
                                      className="new-label mb-0"
                                    >
                                      Lab Location
                                    </label>
                                  </div>
                                  <div className="col-4 col-md-3 col-lg-2">
                                    <div className="text-field mt-0 ">
                                      <input
                                        type="text"
                                        name="LabLocation"
                                        value={value.LabLocation}
                                        onChange={(e) => handleChange(e)}
                                        styles={Requiredcolour}
                                      />
                                    </div>
                                  </div>

                                  <div className="col-2 mt-1 ">
                                    <label className="new-label mb-0">
                                      Summary
                                    </label>
                                  </div>

                                  <div className="col-12 col-md-10 col-lg-10 mt-1">
                                    <textarea
                                      type="text"
                                      name="Summary"
                                      value={value.Summary}
                                      onChange={(e) => handleChange(e)}
                                      rows="1"
                                      className="form-control py-1 new-input"
                                      style={{
                                        height: "auto",
                                        overflowY: "scroll",
                                      }}
                                      placeholder="Summary"
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
                                      onMouseOver={(e) =>
                                      (e.target.style.backgroundColor =
                                        "#e9e9e9")
                                      }
                                      onMouseOut={(e) =>
                                      (e.target.style.backgroundColor =
                                        "#e9e9e9")
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
                                          style={{
                                            color: "#777",
                                            fontSize: "13px",
                                          }}
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
                          <div className="col-3 col-md-3 col-lg-1 ">
                            <label htmlFor="" className="new-label mb-0">
                              Send Task to List
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
                                value={
                                  StatusOption.find(
                                    (option) => option.label === taskToSend
                                  ) || null
                                }
                                styles={{
                                  container: (base) => ({ ...base, flex: 1 }), // Makes Select grow inside flex
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-9 col-md-9 col-lg-2  ">
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
                          <>
                            <div className="col-1 col-md-1 col-lg-1 ">
                              <label
                                className="form-check-label"
                                htmlFor="sendToPropertyRoom"
                              >
                                Assignee
                              </label>
                            </div>

                            <div className="col-3 col-md-3 col-lg-5 g-1 d-flex align-items-center   ">
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
                                      {/* <div className="col-2 col-md-2 col-lg-2">
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
                                      </div> */}
                                      <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
                                        <SelectBox
                                          className="custom-multiselect"
                                          classNamePrefix="custom"
                                          options={agencyOfficerDrpData}
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
                                      {/* <div className="col-2 col-md-2 col-lg-2 ">
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
                                      </div> */}
                                      <div className="col-4 col-md-12 col-lg-6 dropdown__box mt-0">
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

                          <div className="col-3 col-md-3 col-lg-1 mt-1 px-1 d-flex justify-content-end">
                            <button
                              type="button"
                              className="btn btn-sm mb-2 mt-1"
                              style={{
                                backgroundColor: "#001f3f",
                                color: "#fff",
                              }}
                              onClick={() => {
                                InSertBasicInfo(
                                  value?.CollectingOfficer,
                                  "OfficerID",
                                  "TaskList/Insert_TaskList",
                                  taskToSend
                                );
                                setTaskToSend("");
                              }}
                              disabled={!(taskToSend && value.OfficerID)}
                            >
                              Send
                            </button>
                          </div>

                          <div className="col-12 col-md-12 col-lg-12 mt-2">
                            {/* <DataTable
                                                            dense
                                                            fixedHeader
                                                            persistTableHead={true}
                                                            customStyles={tableCustomStyles}
                                                            columns={columns1}
                                                            selectableRowsHighlight
                                                            highlightOnHover
                                                            responsive

                                                            fxedHeaderScrollHeight='90px'
                                                            pagination
                                                            paginationPerPage={'100'}
                                                            paginationRowsPerPageOptions={[100, 150, 200, 500]}

                                                        /> */}
                          </div>
                        </div>
                      </fieldset>
                    ) : null
                  ) : null}
                </div>
              </div>
            </fieldset>
            {!isViewEventDetails && (
              <div className="col-12 col-md-12 col-lg-12 mt-2 mb-1 text-right">
                {effectiveScreenPermission ? (
                  effectiveScreenPermission[0]?.Changeok ? (
                    <button
                      type="button"
                      disabled={!statesChangeStatus || taskToSend}
                      className="btn btn-md py-1 btn-success "
                      onClick={(e) => {
                        check_Validation_Error();
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
                    onClick={(e) => {
                      check_Validation_Error();
                    }}
                  >
                    Update
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <ChangesModal func={Update_Name} setToReset={Reset} />
      <TaskListModal
        changesStatus={taskListModalStatus}
        setChangesStatus={setTaskListModalStatus}
        setTaskToSend={setTaskToSend}
        InSertBasicInfo={InSertBasicInfo}
        taskToSend={taskToSend}
        value={value}
      />
    </>
  );
};

export default MiscellaneousInformation;

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
