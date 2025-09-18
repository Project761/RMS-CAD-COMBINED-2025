import { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {
  base64ToString,
  changeArrayFormat,
  changeArrayFormat_WithFilter,
  Decrypt_Id_Name,
  filterPassedTime,
  getShowingMonthDateYear,
  getShowingWithOutTime,
  Requiredcolour,
} from "../../Common/Utility";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  get_AgencyOfficer_Data,
  get_Narrative_Type_Drp_Data,
} from "../../../redux/actions/DropDownsData";
import {
  Comman_changeArrayFormat,
  threeColArray,
} from "../../Common/ChangeArrayFormat";
import { RequiredFieldIncident } from "../Utility/Personnel/Validation";
import { AgencyContext } from "../../../Context/Agency/Index";
import {
  AddDelete_Img,
  AddDeleteUpadate,
  fetchPostData,
  PropertyRoomInsert,
} from "../../hooks/Api";
import { toastifyError, toastifySuccess } from "../../Common/AlertMsg";
import TreeModelPL from "./TreeModelPL";
import { useReactToPrint } from "react-to-print";
import { get_LocalStoreData } from "../../../redux/actions/Agency";
import { get_Report_Approve_Officer_Data } from "../../../redux/actions/IncidentAction";

const NonpropertyModel = (props) => {
  const {
    modelActivityStatus,
    DecPropID,
    DecMPropID,
    rowData,
    setDataSaved,
    SelectedCategory,
    CallStatus,
    ProType,
    ProNumber,
    ProTransfer,
    CheckboxStatus,
    ProCategory,
    taskListID,
    propertyID,
    masterPropertyID,
    modalOpenStatus,
    setPropertyStatus,
    setModalOpenStatus,
    nonPropertyModalRef,
  } = props;
  const { GetDataTimeZone, datezone } = useContext(AgencyContext);
  const componentRef = useRef();
  const { setChangesStatus, get_Incident_Count, incidentCount } =
    useContext(AgencyContext);
  const reportApproveOfficer = useSelector(
    (state) => state.Incident.reportApproveOfficer
  );
  const narrativeTypeDrpData = useSelector(
    (state) => state.DropDown.narrativeTypeDrpData
  );
  const effectiveScreenPermission = useSelector(
    (state) => state.Incident.effectiveScreenPermission
  );
  const uniqueId = sessionStorage.getItem("UniqueUserID")
    ? Decrypt_Id_Name(
      sessionStorage.getItem("UniqueUserID"),
      "UForUniqueUserID"
    )
    : "";

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const agencyOfficerDrpData = useSelector(
    (state) => state.DropDown.agencyOfficerDrpData
  );
  const propertyTypeData = useSelector(
    (state) => state.DropDown.propertyTypeData
  );

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param),
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");
  var MProId = query?.get("MProId");
  var ProSta = query?.get("ProSta");
  let MstPage = query?.get("page");

  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFilesNew, setselectedFilesNew] = useState([]);
  // date
  const [expecteddate, setExpecteddate] = useState();
  const [courtdate, setCourtdate] = useState("");
  const [releasedate, setreleasedate] = useState("");
  const [destroydate, setdestroydate] = useState("");
  // dropdown
  const [loginAgencyID, setloginAgencyID] = useState("");
  const [loginPinID, setloginPinID] = useState("");
  const [activitydate, setactivitydate] = useState();

  const [reasonIdDrp, setReasonIdDrp] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [possessionID, setPossessionID] = useState("");
  // checkbox states
  let [selectedOption, setSelectedOption] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  // functionality states
  const [propertyNumber, setPropertyNumber] = useState("");
  const [toggleClear, setToggleClear] = useState(false);
  const [locationPath, setLocationPath] = useState();
  const [locationStatus, setlocationStatus] = useState(false);
  const [proRoom] = useState("PropertyRoom");
  const [searchStoStatus, setSearchStoStatus] = useState();
  const [shouldPrintForm, setShouldPrintForm] = useState(false);
  const [transferdate, settransferdate] = useState();
  // modal open state
  const [keyChange, setKeyChange] = useState("");

  const fileInputRef = useRef(null);
  const [mainIncidentID, setMainIncidentID] = useState("");
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
  const [PropertyRoomStatus, setPropertyRoomStatus] = useState("");
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [IsEvidenceStatus, setIsEvidenceStatus] = useState(false);
  const [multiSelected, setMultiSelected] = useState({ optionSelected: null });
  const [groupList, setGroupList] = useState([]);
  // Add Update Permission
  const [addUpdatePermission, setaddUpdatePermission] = useState();
  const [fileUploadStatus, setfileUploadStatus] = useState(false);

  const [value, setValue] = useState({
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
    Comments: "",
    OfficerID: "",
  });

  const [errors, setErrors] = useState({
    ReasonError: "",
    DispatchError: "",
    DispatchingOfficerError: "",
    ReceipientError: "",
  });

  useEffect(() => {
    if (localStoreData) {
      setloginAgencyID(localStoreData?.AgencyID);
      setloginPinID(localStoreData?.PINID);
      setPropertyId(propertyID);
      setValue({
        ...value,
        PropertyTypeID: parseInt(ProNumber),
        ActivityType: ProTransfer,
      });
      GetDataTimeZone(localStoreData?.AgencyID);
    }
  }, [
    localStoreData,
    ProType,
    ProNumber,
    CallStatus,
    propertyID,
    SelectedCategory,
    propertyTypeData,
    ProTransfer,
  ]);

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      // for change tab when not having  add and update permission
      setaddUpdatePermission(
        effectiveScreenPermission[0]?.Changeok != 1 ? true : false
      );
    } else {
      setPermissionForAdd(false);
      setPermissionForEdit(false);
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (propertyID || masterPropertyID) {
      setMainIncidentID(IncID);
      get_Incident_Count(IncID);
      GetSingleData(propertyID, masterPropertyID, loginPinID);
      GetDataDocument(propertyID, masterPropertyID, loginPinID);
      Get_SendTask_DrpVal(propertyID, masterPropertyID, loginAgencyID);
      Get_TaskList_Status(propertyID, loginAgencyID);
      Get_SendTask_Data(propertyID, masterPropertyID);
      setValue({
        ...value,
        MasterPropertyID: masterPropertyID,
        PropertyTypeID: parseInt(ProNumber),
        PropertyID: propertyID,
        IncidentID: IncID,
        OfficerID: loginPinID,
        CreatedByUserFK: loginPinID,
        AgencyID: loginAgencyID,
      });
    }
  }, [propertyID]);

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
        MasterPropertyID: masterPropertyID,
        PropertyID: propertyID,
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
        // setPropertyStatus(true);
      } else {
        // setPropertyStatus(false);
      }
    }
  }, [editval, updateCount, modalOpenStatus]);


  useEffect(() => {
    if (loginAgencyID && selectedOption) {
      GetActivityReasonDrp(loginAgencyID);
    }
    GetActivityReasonDrp(loginAgencyID);
  }, [loginAgencyID, selectedOption]);

  useEffect(() => {
    if (possessionID) {
      setValue({
        ...value,
        ["PropertyRoomPersonNameID"]: parseInt(possessionID),
      });
    }
  }, [possessionID]);

  const GetActivityReasonDrp = (loginAgencyID) => {
    if (selectedOption === "Transfer Location") {
      selectedOption = "TransferLocation";
    }
    const val = { AgencyID: loginAgencyID, EvidenceReasonType: selectedOption };
    fetchPostData(
      "PropertyEvidenceReason/GetDataDropDown_PropertyEvidenceReason",
      val
    ).then((data) => {
      if (data) {
        setReasonIdDrp(
          Comman_changeArrayFormat(data, "EvidenceReasonID", "Description")
        );
      } else {
        setReasonIdDrp([]);
      }
    });
  };

  useEffect(() => {
    if (loginAgencyID) {
      setValue({
        ...value,
        IncidentID: propertyId,
        CreatedByUserFK: loginPinID,
        AgencyID: loginAgencyID,
        OtherPersonNameID: "",
      });
      if (agencyOfficerDrpData?.length === 0) {
        dispatch(get_AgencyOfficer_Data(loginAgencyID));
      }
    }
  }, [selectedOption, loginAgencyID]);

  const handleFileChange = (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;
    const newFilesArray = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesArray]);
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

  const handleFileChangeNew = (e) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;
    const newFilesArray = Array.from(files);
    setselectedFilesNew((prevFiles) => [...prevFiles, ...newFilesArray]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFileNew = (index) => {
    setselectedFilesNew((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const ChangeDropDown = (e, name) => {
    if (e) {
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

  const GetData_Propertyroom = async (DecPropID, category, loginAgencyID) => {
    try {
      const val1 = {
        PropertyID: DecPropID,
        PropertyCategoryCode: category,
        MasterPropertyID: 0,
        AgencyId: loginAgencyID,
      };
      const val2 = {
        PropertyID: 0,
        PropertyCategoryCode: category,
        MasterPropertyID: DecPropID,
        AgencyId: loginAgencyID,
      };
      const res = await AddDeleteUpadate(
        "Propertyroom/GetData_Propertyroom",
        MstPage === "MST-Property-Dash" ? val2 : val1
      );
      const parsedData = JSON.parse(res.data);
      if (parsedData.Table && parsedData.Table.length > 0) {
        if (
          parsedData.Table[0].Status === "Release" &&
          shouldPrintForm === true
        ) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          printForm();
          setShouldPrintForm(false);
        }
      } else {
        toastifyError("No Data Available");
      }
    } catch (error) { }
  };

  const printForm = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Data",
    onAfterPrint: () => {
      "";
    },
  });

  const Delete_TaskList = () => {
    const val = { DeletedByUserFK: loginPinID, TaskListID: taskListID };
    AddDeleteUpadate("TaskList/Delete_TaskList", val)
      .then((res) => {
        if (res) {
          const parsedData = JSON.parse(res.data);
        } else {
          console.log("Somthing Wrong");
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        toastifyError("Failed to Update Tasklist, Please try again.");
      });
  };

  const GetSingleData = (propertyID, masterPropertyID, loginPinID) => {
    const val = {
      PropertyID: propertyID,
      MasterPropertyID: masterPropertyID,
      PINID: loginPinID,
      IsMaster: MstPage === "MST-Property-Dash" ? true : false,
    };
    fetchPostData("Property/GetSingleData_Property", val).then((res) => {
      if (res) {
        setEditval(res);

        setPropertyRoomStatus(res[0]?.PropertyRoomStatus);
      } else {
        setEditval([]);
      }
    });
  };
  const Get_SendTask_DrpVal = (PropertyID, MasterPropertyID) => {
    const val = {
      PropertyID: PropertyID,
      MasterPropertyID: MasterPropertyID,
      AgencyID: localStoreData?.AgencyID,
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

  const Get_TaskList_Status = (PropertyID) => {
    const val = { PropertyID: PropertyID, AgencyID: localStoreData?.AgencyID };
    fetchPostData("Propertyroom/SearchPropertyRoom", val)
      .then((res) => {
        if (res) {
          const obj = res.filter((item) => item?.PropertyID === PropertyID);
        } else {

        }
      })
      .catch((err) => {
        console.log(err);
        toastifyError(err?.message);
      });
  };

  const check_Validation_Error = (e) => {
    // const CollectingOfficerErr = (value.IsEvidence ? RequiredFieldIncident(value?.CollectingOfficer) : 'true');

    const ReasonErr = RequiredFieldIncident(value.Reason);

    const DispatchErr = RequiredFieldIncident(value.DispatchDtTm);

    const DispatchingOfficerErr = RequiredFieldIncident(
      value.DispatchingOfficer
    );

    const ReceipientErr = RequiredFieldIncident(value.Recipient);

    setErrors((prevValues) => {
      return {
        ...prevValues,
        ["ReasonError"]: ReasonErr || prevValues["ReasonError"],
        ["DispatchError"]: DispatchErr || prevValues["DispatchError"],
        ["DispatchingOfficerError"]:
          DispatchingOfficerErr || prevValues["DispatchingOfficerError"],
        ["ReceipientError"]: ReceipientErr || prevValues["ReceipientError"],
      };
    });


  };

  const {
    ReasonError,
    DispatchError,
    DispatchingOfficerError,
    ReceipientError,
  } = errors;

  useEffect(() => {

    if (
      (ReasonError === "true" &&
        DispatchError === "true" &&
        DispatchingOfficerError === "true" &&
        ReceipientError === "true")
    ) {
      Update_Name();
    }
  }, [ReasonError, DispatchError, DispatchingOfficerError, ReceipientError]);

  const Update_Name = () => {
    const {
      MasterPropertyID,
      MProId,
      PropertyID,
      ProId,
      AgencyID,
      IncidentID,
      IncID,
      DestroyDtTm,
      PropertyTag,
      NICB,
      Description,
      IsSendToPropertyRoom,
      ModifiedByUserFK,
      IsMaster,
      IsSendToTaskList,
      CollectingOfficer,
      LocationOfCollection,
      EvidenceDescription,
      CollectionDtTm,
      IsNonPropertyRoom,
      IsEvidence,
      Task,
      Reason,
      DispatchDtTm,
      ExpectedDtTm,
      DispatchingOfficer,
      Comments,
      Recipient,
      ModOfTransport,
      Destination,
      PackagingDetails,
      FileAttachment,
      TestPerformed,
      LabName,
      LabLocation,
      Summary,
      FileAttachment1,
    } = value;
    const val = {
      CreatedByUserFK: loginPinID,
      MasterPropertyID: masterPropertyID,
      PropertyID: propertyId,
      AgencyID: loginAgencyID,
      IsMaster: IsMaster,
      IncidentID: IncidentID,
      IsSendToPropertyRoom: IsSendToPropertyRoom,
      ModifiedByUserFK: loginPinID,
      DestroyDtTm: DestroyDtTm,
      PropertyTag: PropertyTag,
      NICB: NICB,
      Description: Description,
      CollectingOfficer: CollectingOfficer,
      LocationOfCollection: LocationOfCollection,
      EvidenceDescription: EvidenceDescription,
      CollectionDtTm: CollectionDtTm,
      IsNonPropertyRoom: IsNonPropertyRoom,
      IsEvidence: IsEvidence,
      Task: Task,
      IsSendToTaskList: IsSendToTaskList,
      Reason: Reason,
      DispatchDtTm: DispatchDtTm,
      ExpectedDtTm: ExpectedDtTm,
      DispatchingOfficer: DispatchingOfficer,
      Summary: Summary,
      LabLocation: LabLocation,
      LabName: LabName,
      TestPerformed: TestPerformed,
      PackagingDetails: PackagingDetails,
      Destination: Destination,
      ModOfTransport: ModOfTransport,
      Recipient: Recipient,
      DispatchingOfficer: DispatchingOfficer,
      Comments: Comments,
    };
    AddDeleteUpadate("Property/Update_MiscellaneousInformation", val)
      .then((res) => {
        if (res?.success) {
          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          if (selectedFiles?.length > 0 && fileUploadStatus) {
            uploadNonPropertyRoomDocuments(PropertyID, MasterPropertyID, loginPinID, selectedFiles);
          }
          GetSingleData(propertyID, masterPropertyID, loginPinID);
          Get_TaskList_Status(propertyID);
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
    }
  }, [editval, updateCount, modalOpenStatus]);

  const handleChange = (e) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    !addUpdatePermission && setChangesStatus(true);
    if (e.target.name === "IsSendToPropertyRoom") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
        IsNonPropertyRoom: false,
      });
      setErrors({
        ...errors,
        ReasonError: "",
        DispatchError: "",
        DispatchingOfficerError: "",
      });
    } else if (e.target.name === "IsNonPropertyRoom") {
      setValue({
        ...value,
        [e.target.name]: e.target.checked,
        IsSendToPropertyRoom: false,
      });
      setErrors({
        ...errors,
        ReasonError: "",
        DispatchError: "",
        DispatchingOfficerError: "",
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
      DispatchingOfficerError: "",
      ReasonError: "",
      DispatchError: "",
      DispatchingOfficerError: "",
      ReceipientError: "",
    });
    setStatesChangeStatus(false);
    setCollectiondate("");
    setdisPatchdate("");
    setexpectedArrival("");
    if (editval[0]?.Description?.length > 0) {
      setUpdateCount(updateCount + 1);
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

      const status = task;
      arr = [{ value: "1", label: "CheckIn" }];
      if (status) {
        return StatusOption;
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
    // setValue({...value, ['ApprovingSupervisorID']: "", ['DocumentAccess_Name']: "" })
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
    fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
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



  return (
    modalOpenStatus && (
      <>
        <div
          class="modal "
          style={{ background: "rgba(0,0,0, 0.5)" }}
          id="NonpropertyModel"
          ref={nonPropertyModalRef}
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div class="modal-dialog  modal-dialog-centered  modal-xl">
            <div class="modal-content">
              <div className="d-flex justify-content-between align-items-center bg-light postion-relative">
                <div className="ml-4 mb-1" style={{ fontSize: '18px', fontWeight: 600, padding: "5px" }}>Evidence Tracker</div>
                {/* <span className="align-self-end postion-absolute top-0 right-0"><button type="button" className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "start", }} onClick={() => {
                  setErrors({
                    'DispatchingOfficerError': '', 'ReasonError': '', 'DispatchError': '', 'DispatchingOfficerError': '', 'ReceipientError': '',
                  })
                  setModalOpenStatus(false);
                }}><b>X</b> </button></span> */}
              </div>
              <div class="modal-body name-body-model">

                <div className="ml-5 " style={{ fontSize: "16px", fontWeight: 500 }}>Dispatch</div>
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
                      <DatePicker
                        id="DispatchDtTm"
                        name="DispatchDtTm"
                        dateFormat="MM/dd/yyyy HH:mm"
                        onChange={(date) => {
                          !addUpdatePermission && setStatesChangeStatus(true);
                          !addUpdatePermission && setChangesStatus(true);

                          if (date) {


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
                          const reported = new Date(value?.ReportedDate);
                          const selectedDateOnly = new Date(collectiondate);
                          selectedDateOnly.setHours(0, 0, 0, 0);
                          reported.setHours(0, 0, 0, 0);
                          if (
                            selectedDateOnly.getTime() === reported.getTime()
                          ) {
                            return (
                              time.getTime() >
                              new Date(value?.ReportedDate).getTime()
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
                      <DatePicker
                        id="ExpectedDtTm"
                        name="ExpectedDtTm"
                        dateFormat="MM/dd/yyyy HH:mm"
                        onChange={(date) => {
                          !addUpdatePermission && setStatesChangeStatus(true);
                          !addUpdatePermission && setChangesStatus(true);

                          if (date) {


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
                          const reported = new Date(value?.ReportedDate);
                          const selectedDateOnly = new Date(dispatchdate);
                          selectedDateOnly.setHours(0, 0, 0, 0);
                          reported.setHours(0, 0, 0, 0);
                          if (
                            selectedDateOnly.getTime() === reported.getTime()
                          ) {
                            return (
                              time.getTime() >
                              new Date(value?.ReportedDate).getTime()
                            );
                          }
                          return true;
                        }}
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
                          (obj) => obj.value == value?.DispatchingOfficer
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
                    </div>
                    <div className="col-4 col-md-3 col-lg-2">
                      <div className="text-field mt-1">
                        <input
                          type="text"
                          name="Recipient"
                          value={value.Recipient}
                          onChange={(e) => handleChange(e)}
                          styles={Requiredcolour}
                          className="requiredColor"
                        />
                      </div>
                    </div>

                    <div className="col-3 col-md-2 col-lg-2 mt-2">
                      <label htmlFor="" className="new-label">
                        {" "}
                        Mode Of transport{" "}
                        {errors.ModOfTransportError !== "true" ? (
                          <p
                            style={{
                              color: "red",
                              fontSize: "11px",
                              margin: "0px",
                              padding: "0px",
                            }}
                          >
                            {errors.ModOfTransportError}
                          </p>
                        ) : null}
                      </label>
                    </div>

                    <div className="col-4 col-md-3 col-lg-2">
                      <div className="text-field mt-1">
                        <input
                          type="text"
                          name="ModOfTransport"
                          value={value.ModOfTransport}
                          onChange={(e) => handleChange(e)}
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
                      <label className="new-label">Comments</label>
                    </div>

                    <div className="col-10 d-flex align-items-center justify-content-end mt-1">
                      <textarea
                        type="text"
                        rows="1"
                        className="form-control  py-1 new-input"
                        style={{ height: "auto", overflowY: "scroll" }}
                        placeholder="Comment...."
                        name="Comments"
                        value={value.Comments}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                    </div>

                    <div className="col-2 col-md-12 col-lg-2 mt-2">
                      <label htmlFor="" className="new-label text-nowrap">
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
                        htmlFor="file-input-new"
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
                        onChange={handleFileChangeNew}
                        ref={fileInputRef}
                        multiple
                        style={{ display: "none" }}
                        id="file-input-new"
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
                        {selectedFilesNew.length > 0 ? (
                          selectedFilesNew.map((file, index) => (
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
                                onClick={() => removeFileNew(index)}
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
                          <span style={{ color: "#777", fontSize: "13px" }}>
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
                          onChange={(e) => handleChange(e)}
                          styles={Requiredcolour}
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
                          onChange={(e) => handleChange(e)}
                          styles={Requiredcolour}
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
                          onChange={(e) => handleChange(e)}
                          styles={Requiredcolour}
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
                        onChange={(e) => handleChange(e)}
                        rows="1"
                        className="form-control  py-1 new-input"
                        style={{ height: "auto", overflowY: "scroll" }}
                        placeholder="Summary"
                      />
                    </div>

                    <div className="col-2 col-md-12 col-lg-2 mt-2">
                      <label htmlFor="" className="new-label text-nowrap">
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
                          <span style={{ color: "#777", fontSize: "13px" }}>
                            No files selected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-12  text-right ">
                <button
                  type="button"
                  aria-label="Close"
                  data-dismiss="modal"
                  className="btn btn-sm btn-success mr-2 mb-2 mt-1"
                  onClick={() => { Reset(); setModalOpenStatus(false) }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    check_Validation_Error();
                  }}
                  className="btn btn-sm btn-success  mb-2 mt-1"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <TreeModelPL
          {...{
            proRoom,
            locationStatus,
            setlocationStatus,
            locationPath,
            setLocationPath,
            searchStoStatus,
            setSearchStoStatus,
            value,
            setValue,
            setPropertyNumber,
            keyChange,
          }}
        />
      </>
    )
  );
};
export default NonpropertyModel;
