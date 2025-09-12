import { useState, useEffect, useContext, useRef } from 'react'
import Select from "react-select";
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AddDeleteUpadate, fetchPostData, fetchPostDataNew } from '../../../../hooks/Api';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import {
  Canvas as FabricCanvas,
  Circle,
  FabricImage,
  Ellipse,
  Path,
} from "fabric";
import DatePicker from "react-datepicker";
import useObjState from '../../../../../CADHook/useObjState';
import { base64ToString, changeArrayFormat, Decrypt_Id_Name, getShowingWithOutTime, } from '../../../../Common/Utility';
import { changeArrayFormat_Active_InActive } from '../../../../Common/ChangeArrayFormat';
import SelectBox from '../../../../Common/SelectBox';
import { get_AgencyOfficer_Data, get_Report_Approve_Officer_Data } from '../../../../../redux/actions/IncidentAction';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import moment from 'moment';

const PoliceForceIncident = (props) => {
  // const { DecArrestId } = props
  const deleteSelectedRef = useRef(null);
  const clearAllRef = useRef(null);

  const dispatch = useDispatch();

  const { agnecyName, datezone, changesStatusCount } = useContext(AgencyContext);

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const reportApproveOfficer = useSelector((state) => state.Incident.reportApproveOfficer);
  const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);

  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const [loginAgencyID, setLoginAgencyID] = useState('')
  const [selectedTool, setSelectedTool] = useState(null);
  const [arrestID, setArrestID] = useState('')
  const [loginPinID, setLoginPinID] = useState('');
  const [useOfForceID, setUseOfForceID] = useState('');
  const [editValUseOfForce, setEditValUseOfForce] = useState([]);
  const [selectedOption, setSelectedOption] = useState("IND");
  const [IsSuperadmin, setIsSuperadmin] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [groupList, setGroupList] = useState([]);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  let DecArrestId = 0
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  function isValidBase64(str) {
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    return base64Pattern.test(str);
  }
  let ArrestID = query?.get("ArrestId");
  if (!ArrestID) {
    ArrestID = 0;
  } else {
    if (isValidBase64(ArrestID)) {
      try {
        let decodedString = atob(ArrestID);
        DecArrestId = parseInt(decodedString, 10);
      } catch (error) {
        console.error("Error in decoding Base64 or parsing to integer:", error);
        DecArrestId = 0;
      }
    } else {
      console.error("ArrestID is not a valid Base64 string");
      DecArrestId = 0;
    }
  }

  const [WrittenForDataDrp, setWrittenForDataDrp] = useState([]);

  const Get_WrittenForDataDrp = async (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    await fetchPostData('Narrative/GetData_WrittenForOfficer', val).then((data) => {
      if (data) {
        setWrittenForDataDrp(changeArrayFormat_Active_InActive(data, 'PINID', 'HeadOfAgency', 'IsActive'));
      } else {
        setWrittenForDataDrp([]);
      }
    })
  }
  const get_Group_List = (loginAgencyID) => {
    const value = { AgencyId: loginAgencyID, PINID: loginPinID }
    fetchPostData("Group/GetData_Grouplevel", value).then((res) => {
      if (res) {
        setGroupList(changeArrayFormat(res, 'group'))
        if (res[0]?.GroupID) {
          // setValue({
          //   ...value,
          //   ['GroupName']: changeArrayFormat_WithFilter(res, 'group', res[0]?.GroupID),
          //   'ReportedByPINActivityID': checkId(loginPinID, agencyOfficerDrpData) ? loginPinID : '',
          //   'WrittenForID': narrativeTypeCode?.toLowerCase() === 'ni' ? primaryOfficer : checkWrittenId(loginPinID, WrittenForDataDrp) ? loginPinID : '',
          //   'IncidentId': incidentID, 'CreatedByUserFK': loginPinID,
          // });
        }
      }
      else {
        setGroupList();
      }
    })
  }

  useEffect(() => {
    if (loginAgencyID) {
      dispatch(get_AgencyOfficer_Data(loginAgencyID, IncID));
      Get_WrittenForDataDrp(loginAgencyID, IncID);
      dispatch(get_Report_Approve_Officer_Data(loginAgencyID, localStoreData?.PINID));
      // if (narrativeTypeDrpData?.length === 0) { dispatch(get_Narrative_Type_Drp_Data(loginAgencyID)) }
      get_Group_List(loginAgencyID);
      // get_IncidentTab_Count(IncID, loginPinID);


    }
  }, [loginAgencyID])

  const handleSelectIncidentName = (selectedOption, { name }) => {
    const data = selectedOption.map(item => item?.value);
    handleApprovalState("ApprovingSupervisorID", data.join(","));
  };

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(parseInt(localStoreData?.PINID)); setLoginAgencyID(parseInt(localStoreData?.AgencyID));
      setIsSuperadmin(localStoreData?.IsSuperadmin);

      GetUseOfForceSingleData(DecArrestId)
    }
  }, [localStoreData]);

  useEffect(() => {
    if (DecArrestId) {
      setArrestID(DecArrestId);
      GetUseOfForceSingleData(DecArrestId);
    }
  }, [DecArrestId]);

  useEffect(() => {
    if (arrestID) {
      GetUseOfForceSingleData(arrestID)
    }
  }, [arrestID])

  const [formData, setFormData] = useState({
    useOfForceSecond: {
      subjectInjuredYes: false,
      subjectInjuredNo: false,
      subjectInjuredNote: '',
      transportedTo1: '',
      ambulance1: false,
      refusedTreatment1: false,
      officerInjuryYes: false,
      officerInjuryNo: false,
      officerInjuryNote: '',
      transportedTo2: '',
      ambulance2: false,
      refusedTreatment2: false
    },
    reasonForce: {
      toEffectArrest: false,
      toDefendSelf: false,
      toDefendOfficer: false,
      toDefendPerson: false,
      toPreventOffense: false,
      restrainSafety: false,
      other: false,
      otherText: ''
    },
    subjectActions: {
      nonVerbalCues: false,
      verbalThreats: false,
      deadlyPull: false,
      pulling: false,
      assault: false,
      assaultIntent: false,
      assaultWeapon: false,
      other: false,
      otherText: '',
      numberOfSuspects: '',
      alcohol: false,
      drugs: false,
      mentalIssues: false,
      otherUnderInfluence: false,
      otherUnderInfluenceText: ''
    },
    officerActions: {
      verbalDirection: false,
      softWeapons: false,
      hardWeapons: false,
      ocSpray: false,
      aspBaton: false,
      nonLethal: false,
      lessLethal: false,
      pointedTaser: false,
      dischargedTaser: false,
      pointedFirearm: false,
      dischargedFirearm: false,
      other: false,
      otherText: ''
    },
    physicalControl: {
      notUsed: false,
      muscling: false,
      pressurePoints: false,
      jointLock: false,
      takedown: false,
      handcuffing: false,
      hobble: false,
      other: false,
      otherText: '',
      effectiveYes: false,
      effectiveNo: false,
      effectiveNote: "",
    },
    ocSpray: {
      notUsed: false,
      attempted: false,
      used: false,
      distance: '',
      distance1: '',
      duration1: '',
      duration2: '',
      duration3: '',
      effectiveYes: false,
      effectiveNo: false,
      effectiveNote: "",
    },
    aspBaton: {
      notUsed: false,
      used: false,
      numStrikes: '',
      location: '',
      effectiveYes: false,
      effectiveNo: false,
      effectiveNote: "",
    },
    lessLethal: {
      notUsed: false,
      used: false,
      beanBag: '',
      stinger: '',
      rubber: '',
      pepperball: '',
      location: '',
      effectiveYes: false,
      effectiveNo: false,
      effectiveNote: "",
    },
    taser: {
      notUsed: false,
      pointed: false,
      discharged: false,
      driveStun: false,
      distance: '',
      cycles: '',
      probesPenetrateSkinYes: false,
      probesPenetrateSkinNo: false,
      taserNumber: '',
      cartridgeNumbers: '',
      placedInEvidenceYes: false,
      placedInEvidenceNo: false,
      effectiveYes: false,
      effectiveNo: false,
      effectiveNote: "",
    },
    firearm: {
      notUsed: false,
      pointed: false,
      discharged: false,
      sidearm: false,
      shotgun: false,
      rifle: false,
      backup: false,
      distance: '',
      roundsDischarged: '',
      hitsOnTarget: '',
      serialNumber: '',
      serialNumberMark: false,
      effectiveYes: false,
      effectiveNo: false,
      effectiveNote: "",
    },
    environmental: {
      hot: false,
      warm: false,
      cool: false,
      cold: false,
      daylight: false,
      dawnDusk: false,
      darkness: false,
      other: false,
      otherNote: ''
    },
    situational: {
      multipleSuspects: false,
      hostile: false,
      threats: false,
      confined: false,
      indoors: false,
      outdoors: false,
      inVehicle: false,
      other: false,
      otherNote: ''
    },
    officerSummary: {
      successfulForceType: '',
      forceEffectivenessComments: '',
      reportingOfficer: ''
    },
    supervisorReview: {
      officerCount: '',
      videoReviewed: false,
      comments: '',
      supervisorName: '',
      badgeNumber: '',
      inCompliance: false,
      investigationNeeded: false
    },
    reviewed: {
      patrolLieutenantName: '',
      patrolLieutenantInCompliance: false,
      patrolLieutenantInvestigationNeeded: false,
      chiefOfPoliceName: '',
      chiefOfPoliceInCompliance: false,
      chiefOfPoliceInvestigationNeeded: false
    }
  });

  const [useOfForce, setUseOfForce] = useState({
    useOfForce: {
      date: '',
      time: '',
      dayOfWeek: '',
      shift: '',
      area: '',
      arrOff: '',
      primaryOfficer: '',
      fileNumber: '',
      timeOnDept: '',
      mos: '',
      location: '',
      callType: '',
      typePromises: '',
      subjectName: '',
      race: '',
      sex: '',
      dob: '',
      age: '',
      address: '',
      hgt: '',
      wgt: '',
    },
  });

  const [locks, setLocks] = useState({
    address: false,
    hgt: false,
    wgt: false,
  });

  const [
    useOfForceBasicDetailState,
    setUseOfForceBasicDetailState,
    handleUseOfForceBasicDetailState,
    clearUseOfForceBasicDetailState,
  ] = useObjState({
    ReportType: "Use Of Force",
    ReportDateTime: new Date(datezone),
    PreparedById: loginPinID,
    WrittenForID: "",
  });

  const [
    approvalState,
    setApprovalState,
    handleApprovalState,
    clearApprovalState,
  ] = useObjState({
    Status: "",
    ApprovingSupervisorID: ""
  });

  const [
    errorState,
    setErrorState,
    handleErrorState,
    clearErrorState,
  ] = useObjState({
    ReportDateTime: false,
    WrittenForID: false,
  });

  const [
    errorApprovalState,
    setErrorApprovalState,
    handleErrorApprovalState,
    clearErrorApprovalState,
  ] = useObjState({
    ApprovingSupervisorID: false,
  });

  function extractYearsAndMonths(input) {
    let years = 0;
    let months = 0;

    if (!input) return { years, months };

    // Match "X Years Y Months", "X Year", "Y Months", etc.
    const yearMatch = input.match(/(\d+)\s*Years?/i);
    const monthMatch = input.match(/(\d+)\s*Months?/i);

    if (yearMatch) {
      years = parseInt(yearMatch[1], 10);
    }
    if (monthMatch) {
      months = parseInt(monthMatch[1], 10);
    }

    return { years, months };
  }

  useEffect(() => {
    const useForceSectionData = editValUseOfForce?.Table?.[0];
    const table1UseOfForce = editValUseOfForce?.Table1?.[0]?.useOfForce;
    const prefer = (primary, fallback) => {
      const isMissing =
        primary === undefined ||
        primary === null ||
        (typeof primary === "string" && primary.trim() === "");
      return !isMissing ? primary : fallback;
    };
    const addressInit = prefer(useForceSectionData?.Address, table1UseOfForce?.address);
    const hgtInit = prefer(useForceSectionData?.Height, table1UseOfForce?.hgt);
    const wgtInit = prefer(useForceSectionData?.Weight, table1UseOfForce?.wgt);
    const { years, months } = extractYearsAndMonths(useForceSectionData?.TimeOnDept);
    setUseOfForce({
      useOfForce: {
        date: useForceSectionData?.ReportedDateOnly,
        time: useForceSectionData?.ReportedTimeOnly,
        dayOfWeek: useForceSectionData?.DayOfWeek,
        shift: useForceSectionData?.ShiftDescription,
        area: useForceSectionData?.ZoneDescription,
        arrOff: useForceSectionData?.ArrestNumber,
        primaryOfficer: useForceSectionData?.FirstName,
        fileNumber: useForceSectionData?.PIN,
        timeOnDept: years,
        mos: months,
        location: useForceSectionData?.CrimeLocation,
        callType: useForceSectionData?.CFSDescription,
        typePromises: useForceSectionData?.PrimaryLocationType,
        subjectName: useForceSectionData?.Arrestee_Name,
        race: useForceSectionData?.Race_Code,
        sex: useForceSectionData?.Gender_Code,
        dob: useForceSectionData?.DOB ? moment(useForceSectionData?.DOB).format('MM/DD/YYYY') : '',
        age: useForceSectionData?.Age,
        address: addressInit ?? "",
        hgt: hgtInit ?? "",
        wgt: wgtInit ?? "",
      },
    })
    setUseOfForceBasicDetailState(prevState => ({
      ...prevState,
      PreparedById: loginPinID,
      WrittenForID: loginPinID
    }));

    setLocks(prev => ({
      ...prev,
      address: !!addressInit,
      hgt: !!hgtInit,
      wgt: !!wgtInit,
    }));
    if (useOfForceID) {
      setFormData(editValUseOfForce?.Table1?.[0] || {})

      editCanvasData(editValUseOfForce?.Table1?.[0]?.canvasData || {})
      setUseOfForceBasicDetailState({
        ReportType: "Use Of Force",
        ReportDateTime: editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.ReportDateTime ? new Date(editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.ReportDateTime) : "",
        PreparedById: editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.PreparedById,
        WrittenForID: editValUseOfForce?.Table1?.[0]?.useOfForceBasicDetailState?.WrittenForID,
      })
      setApprovalState({
        Status: editValUseOfForce?.Table1?.[0]?.Status || "",
        ApprovingSupervisorID: editValUseOfForce?.Table1?.[0]?.ApprovePinID || "",
      })
      setIsViewMode(editValUseOfForce?.Table1?.[0]?.Status === "Pending Review" || editValUseOfForce?.Table1?.[0]?.Status === "Approved")
      setSelectedOption(editValUseOfForce?.Table1?.[0]?.ReportApproveType || "IND")

    }
  }, [editValUseOfForce, changesStatusCount, reportApproveOfficer]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section]),
          [subField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleInputChangeUseOfForce = (field, value) => {
    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      setUseOfForce(prev => ({
        ...prev,
        [section]: {
          ...(prev[section]),
          [subField]: value
        }
      }));
    } else {
      setUseOfForce(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    setApprovalState((prev) => ({
      ...prev,
      ApprovingSupervisorID: ""
    }));
  };

  const GetUseOfForceSingleData = (arrestID) => {
    const val = {
      'ArrestID': null,
      'IncidentID': IncID,
      "IsArrest": 0,
    }
    fetchPostDataNew('CAD/UseOfForce/GetUseOfForceSupplement', val)
      .then((res) => {
        setUseOfForceID(res?.Table1?.[0]?.UseofForceID || '');
        setEditValUseOfForce(res);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  const validateForm = () => {
    let isError = false;
    const keys = Object.keys(errorState);
    keys.forEach((field) => {
      if (field === "ReportDateTime" && (useOfForceBasicDetailState?.ReportDateTime === "" || useOfForceBasicDetailState?.ReportDateTime === null || useOfForceBasicDetailState?.ReportDateTime === undefined)) {
        handleErrorState(field, true);
        isError = true;
      } else if (field === "WrittenForID" && (useOfForceBasicDetailState?.WrittenForID === "" || useOfForceBasicDetailState?.WrittenForID === null || useOfForceBasicDetailState?.WrittenForID === undefined)) {
        handleErrorState(field, true);
        isError = true;
      }
      else {
        handleErrorState(field, false);
      }
    });
    return !isError;
  };

  const addUseOfForceForm = () => {
    if (!validateForm()) return;
    const canvasData = fabricCanvas.toJSON();
    const { useOfForce: _, ...formDataWithoutUseOfForce } = formData || {};

    const payload = {
      ...useOfForce,
      ...formDataWithoutUseOfForce,
      useOfForceBasicDetailState: useOfForceBasicDetailState,
      agencyId: loginAgencyID,
      incidentId: IncID,
      arrestId: "",
      canvasData: canvasData,
      CreatedByUserFK: loginPinID,
    };
    AddDeleteUpadate('/CAD/UseOfForce/InsertUseOfForce', payload).then((res) => {
      toastifySuccess("Use of Force added successfully")
      const parsedData = JSON.parse(res.data);
      GetUseOfForceSingleData(DecArrestId)
    });
  }

  const updateUseOfForceForm = () => {
    if (!validateForm()) return;
    const canvasData = fabricCanvas.toJSON();
    const { useOfForce: _, ...formDataWithoutUseOfForce } = formData || {};

    const payload = {
      ...useOfForce,
      ...formDataWithoutUseOfForce,
      useOfForceBasicDetailState: useOfForceBasicDetailState,
      UseofForceID: useOfForceID,
      agencyId: loginAgencyID,
      incidentId: IncID,
      arrestId: "",
      canvasData: canvasData,
      ModifiedByUserFK: loginPinID,
    };
    AddDeleteUpadate('/CAD/UseOfForce/UpdateUseOfForce', payload).then((res) => {
      toastifySuccess("Use of Force updated successfully")
      const parsedData = JSON.parse(res.data);
      GetUseOfForceSingleData(DecArrestId)

    });
  }

  const validateApprovalForm = () => {
    let isError = false;
    const keys = Object.keys(errorApprovalState);
    keys.forEach((field) => {
      if (field === "ApprovingSupervisorID" && (approvalState?.ApprovingSupervisorID === "" || approvalState?.ApprovingSupervisorID === null || approvalState?.ApprovingSupervisorID === undefined)) {
        handleErrorApprovalState(field, true);
        isError = true;
      }
      else {
        handleErrorApprovalState(field, false);
      }
    });
    return !isError;
  };
  const Add_Approval = async (id) => {
    if (!validateApprovalForm()) return;
    const val = {
      "UseofForceID": useOfForceID,
      "ArrestID": DecArrestId,
      "IncidentID": IncID,
      "ReportApproveType": selectedOption,    // IND // Group
      "ApprovePinID": approvalState?.ApprovingSupervisorID,    // Report Approver
      "CreatedByUserFK": loginPinID,
      "Status": "Pending Review",
    };

    AddDeleteUpadate('CAD/UseOfForceApprove/UseOfForceApprove', val)
      .then((res) => {
        if (res.success) {
          GetUseOfForceSingleData(DecArrestId)

          const parsedData = JSON.parse(res.data);
          const message = parsedData.Table[0].Message;
          // toastifySuccess(message);
          // get_Data_PoliceForce(arrestID); setStatus(true); setErrors({ ...errors, ['ApprovingOfficerError']: '' })


        } else {
          console.error("something Wrong");
        }
      }).catch(err => console.error(err));
  }


  // Diagram Code Start

  const handleToolUsed = () => {
    setSelectedTool(null);
  };

  const handleDeleteSelected = () => {
    if (deleteSelectedRef.current) {
      deleteSelectedRef.current();
    }
  };

  const handleClearAll = () => {
    if (clearAllRef.current) {
      clearAllRef.current();
    }
  };
  const tools = [
    { type: 'grip', label: 'Grip', color: '#fbbf24', symbol: '●' },
    { type: 'spray', label: 'Spray', color: '#10b981', symbol: '○' },
    { type: 'impact', label: 'Impact', color: '#ef4444', symbol: '◆' },
    { type: 'dart', label: 'Dart', color: '#8b5cf6', symbol: '▲' },
    { type: 'munition', label: 'Munition', color: '#f59e0b', symbol: '◯' },
  ];

  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const selectedToolRef = useRef(selectedTool);

  const RED = "#ff0000";
  // Update the ref when selectedTool changes
  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    const canvas = new FabricCanvas(canvasRef.current, {
      width: 380,
      height: 400,
      backgroundColor: "#ffffff",
    });
    wireUniformScaling(canvas);
    // Load background image
    FabricImage.fromURL(
      "/image.jpg"
    )
      .then((img) => {
        if (!img) return;

        // Scale image to fit canvas while maintaining aspect ratio
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        const scale = Math.min(scaleX, scaleY) * 1; // 90% to leave some margin

        img.set({
          scaleX: scale,
          scaleY: scale,
          left: (canvas.width - img.width * scale) / 2,
          top: (canvas.height - img.height * scale) / 2,
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
        });

        canvas.add(img);
        canvas.sendObjectToBack(img);
        canvas.renderAll();
      })
      .catch((error) => {
        console.error("Error loading background image:", error);
      });

    setFabricCanvas(canvas);

    // Handle canvas clicks to add annotations
    let isMouseDown = false;
    let mouseDownPosition = { x: 0, y: 0 };
    let hadActiveOnMouseDown = false;
    const handleMouseDown = (e) => {
      // remember if something was selected when the click started
      hadActiveOnMouseDown = !!canvas.getActiveObject();

      // clicking empty space should clear selection immediately
      if (!e.target) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }

      isMouseDown = true;
      if (e.pointer) {
        mouseDownPosition = { x: e.pointer.x, y: e.pointer.y };
      }
    };

    const handleMouseUp = (e) => {
      if (!selectedToolRef.current || !e.pointer || !isMouseDown) {
        isMouseDown = false;
        return;
      }

      const distance = Math.hypot(
        e.pointer.x - mouseDownPosition.x,
        e.pointer.y - mouseDownPosition.y
      );

      // ✅ If this click started while something was selected and we clicked blank,
      // treat it as a deselect-only click (do NOT create a new shape).
      if (distance < 5 && !e.target && hadActiveOnMouseDown) {
        isMouseDown = false;
        hadActiveOnMouseDown = false;
        return;
      }

      // normal place-on-click (only when starting with no selection)
      if (distance < 5 && !e.target) {
        const shape = createAnnotationShape(
          selectedToolRef.current,
          e.pointer.x,
          e.pointer.y
        );
        if (shape) {
          canvas.add(shape);
          canvas.setActiveObject(shape); // keep if you want it selected right away
          canvas.renderAll();
          handleToolUsed?.(); // optional: tell parent to clear tool for one-shot placement
        }
      }

      isMouseDown = false;
      hadActiveOnMouseDown = false;
    };

    const handleMouseDown2 = (e) => {
      if (e.e.button === 2 && e.target && e.target !== canvas.getObjects()[0]) {
        // Right click and not background
        canvas.remove(e.target);
        canvas.renderAll();
        // toast.success("Annotation deleted");
      }
    };

    const handleDeselectOnBlank = (e) => {
      if (!e.target) {
        canvas.discardActiveObject();
        canvas.requestRenderAll();
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("mouse:down", handleMouseDown2);
    canvas.on("mouse:down", handleDeselectOnBlank); // << add this

    // Handle delete key
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach((obj) => {
            // Don't delete the background image
            if (obj !== canvas.getObjects()[0]) {
              canvas.remove(obj);
            }
          });
          canvas.discardActiveObject();
          canvas.renderAll();
          //   toast.success("Annotation deleted");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:up", handleMouseUp);
      canvas.off("mouse:down", handleMouseDown2);
      document.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
    };
  }, []); // Removed selectedTool from dependencies

  function styleAnnotation(obj) {
    obj.set({
      lockUniScaling: true,   // ❗ only uniform scaling allowed
      lockScalingFlip: true,
      lockSkewingX: true,
      lockSkewingY: true,
      strokeUniform: true,    // keep stroke width constant while scaling
      centeredScaling: true,  // scale from center
      lockRotation: true,     // no rotation
    });

    // hide side handles (that cause non-uniform scaling) + rotation handle
    obj.setControlsVisibility({
      ml: false, mr: false, mt: false, mb: false, // sides off
      mtr: false, // rotation off
    });

    return obj;
  }

  const createAnnotationShape = (type, x, y) => {
    const commonOpts = { selectable: true };

    switch (type) {
      // ᐱᐱ Grip (chevron/zig-zag)
      case "grip":
        return styleAnnotation(new Path("M -12 6 L -6 -6 L 0 6 L 6 -6 L 12 6", {
          ...commonOpts,
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          fill: "",
          stroke: RED,
          strokeWidth: 3,
          objectCaching: false,
        }));

      // ◯ Spray (ellipse outline)
      case "spray":
        return styleAnnotation(new Ellipse({
          ...commonOpts,
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          rx: 16,
          ry: 12,
          fill: "transparent",
          stroke: RED,
          strokeWidth: 2,
        }));
      case "impact":
        return styleAnnotation(new Path(
          "M 40 -4 L 20 -4 L 20 -8 L 0 0 L 20 8 L 20 4 L 40 4 Z",
          {
            left: x, top: y,
            originX: "center", originY: "center",
            fill: RED,
            strokeWidth: 0,
          }
        ));
      // ▶ Dart (triangle/arrowhead)
      case "dart":
        return styleAnnotation(new Path("M -8 0 L -2 6 L 8 -6", {
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          fill: "",
          stroke: RED,
          strokeWidth: 4,
        }));
      // ● Munition (solid dot)
      case "munition":
        return styleAnnotation(new Circle({
          ...commonOpts,
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          radius: 6,
          fill: RED,
        }));

      default:
        return null;
    }
  };

  function wireUniformScaling(canvas) {
    canvas.on("object:scaling", (e) => {
      const obj = e.target;
      if (!obj) return;
      const s = Math.max(obj.scaleX, obj.scaleY); // or (obj.scaleX + obj.scaleY)/2
      obj.set({ scaleX: s, scaleY: s });
    });
  }

  const clearCanvas = () => {
    if (!fabricCanvas) return;

    // Keep only the background image (first object)
    const objects = fabricCanvas.getObjects();
    objects.slice(1).forEach((obj) => fabricCanvas.remove(obj));
    fabricCanvas.renderAll();
    // toast.success("All annotations cleared");
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;

    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => {
        // Don't delete the background image
        if (obj !== fabricCanvas.getObjects()[0]) {
          fabricCanvas.remove(obj);
        }
      });
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      //   toast.success("Selected annotations deleted");
    }
  };

  // Expose delete functions
  useEffect(() => {
    deleteSelectedRef.current = deleteSelected;
    clearAllRef.current = clearCanvas;
  }, [fabricCanvas]);

  const editCanvasData = async (canvasData) => {

    if (!fabricCanvas || !canvasData) return;

    // Load JSON back into the same canvas instance
    await fabricCanvas.loadFromJSON(canvasData);

    // Re-apply any canvas-wide handlers if needed
    wireUniformScaling(fabricCanvas);

    // Ensure background image stays locked & at the back
    const imgs = fabricCanvas.getObjects().filter((o) => o.type === "image");
    imgs.forEach((img) => {
      img.set({
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        hasControls: false,
        hoverCursor: "default",
      });
      fabricCanvas.sendObjectToBack(img);
    });

    fabricCanvas.renderAll();
  };
  // Diagram Code End

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

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#fce9bf', // Default background color
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

  return (
    <>
      <style jsx>{`
         body {
      background-color: white;
      color: black;
    }
    
    .form-section {
      border: 2px solid black;
      position: relative;
      margin-bottom: 1rem;
    }
    .form-input {
      border: none;
      border-bottom: 1px solid black;
      background: transparent;
      outline: none;
      padding: 2px 4px;
      font-size: 12px;
      height: 20px;
         width: 100%;
      min-width: 60px;
      max-width: 100%;
         margin: 1px 1px;
    }
    
    .form-checkbox {
      width: 16px;
      height: 16px;
      border: 1px solid black;
      background: transparent;
      margin-right: 4px;
    }
    
    .form-header {
      text-align: center;
      font-weight: bold;
      font-size: 18px;
      letter-spacing: 2px;
    }
    
    .form-subheader {
      text-align: center;
      font-weight: 600;
      font-size: 16px;
    }
    
    .section-title {
      font-weight: bold;
      font-size: 12px;
      background: white;
      padding: 0 8px;
      position: absolute;
      top: -8px;
      left: 8px;
    }
    
    .label-nowrap {
      white-space: nowrap;
      flex-shrink: 0;
      margin-right: 6px; /* tweak as needed */
    }
           `}
      </style>
      <div className="col-12 col-md-12 pt-2 p-0 child" >
        <div
          style={{
            pointerEvents: isViewMode ? 'none' : 'auto',  // Disable interactions if isViewMode is true
            cursor: isViewMode ? 'not-allowed' : 'auto',  // Change cursor to indicate it's read-only
          }}
        >
          <div className="col-12">
            {/* use of force form start */}
            <div className="row mt-2" style={{ minHeight: '100vh', backgroundColor: 'white' }}>
              <div className="container-fluid">
                {/* Header */}
                <div className="text-center my-3">
                  <h4 className=" mb-2">{agnecyName}</h4>

                  <h5 className="">Use of Force Supplement</h5>
                </div>

                {/* Main Content */}
                <div>
                  {/* Use of Force Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Use of Force:</div>
                    <div className="pt-2 row g-2" style={{ fontSize: '12px' }}>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Date:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={getShowingWithOutTime(useOfForce?.useOfForce?.date)}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.date', e.target?.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Time:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.time}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.time', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Day of Week:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.dayOfWeek}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.dayOfWeek', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Shift:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.shift}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.shift', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Area:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.area}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.area', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Arr/Off #:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.arrOff}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.arrOff', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2" style={{ fontSize: '12px' }}>
                      <div className="col-6 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Primary Officer Using Force:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.primaryOfficer}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.primaryOfficer', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">#</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.fileNumber}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.fileNumber', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Time on Dept:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.timeOnDept}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.timeOnDept', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Years</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.mos}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.mos', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                        <span className="me-1 label-nowrap">Mos.</span>
                      </div>

                    </div>

                    <div className="row g-4 mt-2" style={{ fontSize: '12px' }}>
                      <div className="col-8 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Location:</span>
                        <input
                          type="text"
                          className="form-input flex-fill me-2"
                          value={useOfForce?.useOfForce?.location}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.location', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                        <span className="me-1 label-nowrap">Call Type:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.callType}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.callType', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-4 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Type Premises:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.typePromises}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.typePromises', e.target.value)}
                          readOnly
                          disabled
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                    </div>

                    {/* Subject Information */}
                    <div className="row g-2 mt-2" style={{ fontSize: '12px' }}>
                      <div className="col-4 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Subject Name:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.subjectName}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.subjectName', e.target.value)}
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-2 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Race:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.race}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.race', e.target.value)}
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-1 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Sex:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.sex}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.sex', e.target.value)}
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-4 d-flex align-items-center">
                        <span className="me-1 label-nowrap">DOB:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.dob}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.dob', e.target.value)}
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                      <div className="col-1 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Age:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.age}
                          onChange={(e) => handleInputChangeUseOfForce('useOfForce.age', e.target.value)}
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>
                    </div>

                    <div className="row g-4 mt-2" style={{ fontSize: '12px' }}>
                      <div className="col-8 d-flex align-items-center">
                        <span className="me-1 label-nowrap">Address:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={useOfForce?.useOfForce?.address || ""}
                          onChange={(e) => {
                            if (!locks.address) {
                              handleInputChangeUseOfForce('useOfForce.address', e.target.value);
                            }
                          }}
                          readOnly={locks.address}   // ← not value-based; only server-lock based
                          style={{
                            color: '#333333',
                          }}
                        />
                      </div>

                      <div className="col-4 d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center">
                          <span className="me-1 label-nowrap">Hgt:</span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ flexGrow: 1, color: '#333333' }} // Makes the input take up the available space
                            value={useOfForce?.useOfForce?.hgt || ""}
                            onChange={(e) => {
                              if (!locks.hgt) {
                                handleInputChangeUseOfForce('useOfForce.hgt', e.target.value);
                              }
                            }}
                            readOnly={locks.hgt}
                          />
                        </div>

                        <div className="d-flex align-items-center">
                          <span className="me-1 label-nowrap">Wgt:</span>
                          <input
                            type="text"
                            className="form-input"
                            style={{ flexGrow: 1, color: '#333333' }} // Makes the input take up the available space
                            value={useOfForce?.useOfForce?.wgt || ""}
                            onChange={(e) => {
                              if (!locks.wgt) {
                                handleInputChangeUseOfForce('useOfForce.wgt', e.target.value);
                              }
                            }}
                            readOnly={locks.wgt}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subject Injured Section */}
                    <div className="mt-3" style={{ fontSize: '12px' }}>
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <span className="me-1 label-nowrap">Subject Injured:</span>

                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.subjectInjuredNo}
                          onChange={(e) => handleInputChange('useOfForceSecond.subjectInjuredNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.subjectInjuredYes}
                          onChange={(e) => handleInputChange('useOfForceSecond.subjectInjuredYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.useOfForceSecond?.subjectInjuredNote}
                          onChange={(e) => handleInputChange('useOfForceSecond.subjectInjuredNote', e.target.value)}
                        />
                      </div>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="me-1 label-nowrap">Transported to:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.useOfForceSecond?.transportedTo1}
                          onChange={(e) => handleInputChange('useOfForceSecond.transportedTo1', e.target.value)}
                        />
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.ambulance1}
                          onChange={(e) => handleInputChange('useOfForceSecond.ambulance1', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Amb.</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.refusedTreatment1}
                          onChange={(e) => handleInputChange('useOfForceSecond.refusedTreatment1', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Refused Treatment</span>
                      </div>
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <span className="me-1 label-nowrap">Officer Injury:</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.officerInjuryNo}
                          onChange={(e) => handleInputChange('useOfForceSecond.officerInjuryNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.officerInjuryYes}
                          onChange={(e) => handleInputChange('useOfForceSecond.officerInjuryYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.useOfForceSecond?.officerInjuryNote}
                          onChange={(e) => handleInputChange('useOfForceSecond.officerInjuryNote', e.target.value)}
                        />
                      </div>


                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="me-1 label-nowrap">Transported to:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.useOfForceSecond?.transportedTo2}
                          onChange={(e) => handleInputChange('useOfForceSecond.transportedTo2', e.target.value)}
                        />
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.ambulance2}
                          onChange={(e) => handleInputChange('useOfForceSecond.ambulance2', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Amb.</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.useOfForceSecond?.refusedTreatment2}
                          onChange={(e) => handleInputChange('useOfForceSecond.refusedTreatment2', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Refused Treatment</span>
                      </div>

                    </div>
                  </div>

                  {/* Reason for Use of Force Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Reason for Use of Force:</div>
                    <div className="pt-2 row g-4" style={{ fontSize: '12px' }}>
                      <div className="col-4">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.reasonForce?.toEffectArrest}
                              onChange={(e) => handleInputChange('reasonForce.toEffectArrest', e.target.checked)}
                            />
                            <span>To Effect Arrest</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.reasonForce?.toDefendSelf}
                              onChange={(e) => handleInputChange('reasonForce.toDefendSelf', e.target.checked)}
                            />
                            <span>To Defend Self</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.reasonForce?.toDefendOfficer}
                              onChange={(e) => handleInputChange('reasonForce.toDefendOfficer', e.target.checked)}
                            />
                            <span>To Defend Another Officer</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.reasonForce?.toDefendPerson}
                              onChange={(e) => handleInputChange('reasonForce.toDefendPerson', e.target.checked)}
                            />
                            <span>To Defend Another Person</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.reasonForce?.toPreventOffense}
                              onChange={(e) => handleInputChange('reasonForce.toPreventOffense', e.target.checked)}
                            />
                            <span>To Prevent Offense</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.reasonForce?.restrainSafety}
                              onChange={(e) => handleInputChange('reasonForce.restrainSafety', e.target.checked)}
                            />
                            <span>Restrain for Subject Safety</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '12px' }}>
                      <label className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-2"
                          checked={formData?.reasonForce?.other}
                          onChange={(e) => handleInputChange('reasonForce.other', e.target.checked)}
                        />
                        <span>Other:</span>
                      </label>
                      <input
                        type="text"
                        className="form-input flex-fill"
                        value={formData?.reasonForce?.otherText}
                        onChange={(e) => handleInputChange('reasonForce.otherText', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Subject's Actions Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Subject's Actions:</div>
                    <div className="pt-2 row g-4" style={{ fontSize: '12px' }}>
                      <div className="col-6">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.subjectActions?.nonVerbalCues}
                              onChange={(e) => handleInputChange('subjectActions.nonVerbalCues', e.target.checked)}
                            />
                            <span>Nonverbal cues indicating physical resistance</span>
                          </label>
                          <label className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.subjectActions?.verbalThreats}
                              onChange={(e) => handleInputChange('subjectActions.verbalThreats', e.target.checked)}
                            />
                            <span>Verbal threats, non-compliance with officer direction</span>
                          </label>
                          <label className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.subjectActions?.deadlyPull}
                              onChange={(e) => handleInputChange('subjectActions.deadlyPull', e.target.checked)}
                            />
                            <span>Dead weight, clinging to objects, preventing custody</span>
                          </label>
                          <label className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.subjectActions?.pulling}
                              onChange={(e) => handleInputChange('subjectActions.pulling', e.target.checked)}
                            />
                            <span>Pulling, pushing, running away, to avoid control, not harming officer</span>
                          </label>
                          <label className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.subjectActions?.assault}
                              onChange={(e) => handleInputChange('subjectActions.assault', e.target.checked)}
                            />
                            <span>Assault, grabbing, pushing, kicking, striking officer or another</span>
                          </label>
                          <label className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.subjectActions?.assaultIntent}
                              onChange={(e) => handleInputChange('subjectActions.assaultIntent', e.target.checked)}
                            />
                            <span>Assault with intent and ability to cause death or SBI</span>
                          </label>
                          <label className="d-flex align-items-start">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.subjectActions?.assaultWeapon}
                              onChange={(e) => handleInputChange('subjectActions.assaultWeapon', e.target.checked)}
                            />
                            <span>Assault or threats with deadly weapon</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mb-3">
                          <label className="d-flex align-items-center label-nowrap">
                            <span>Number of Suspects Resisting:</span>
                            <input
                              type="text"
                              className="form-input ms-2"
                              // style={{ width: '60px' }}
                              value={formData?.subjectActions?.numberOfSuspects}
                              onChange={(e) => handleInputChange('subjectActions.numberOfSuspects', e.target.value)}
                            />
                          </label>
                        </div>
                        <div>
                          <div className="fw-bold mb-2">Appeared or Known Under the Influence</div>
                          <div className="d-flex flex-column gap-1">
                            <label className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox me-2"
                                checked={formData?.subjectActions?.alcohol}
                                onChange={(e) => handleInputChange('subjectActions.alcohol', e.target.checked)}
                              />
                              <span>Alcohol</span>
                            </label>
                            <label className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox me-2"
                                checked={formData?.subjectActions?.drugs}
                                onChange={(e) => handleInputChange('subjectActions.drugs', e.target.checked)}
                              />
                              <span>Drugs</span>
                            </label>
                            <label className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox me-2"
                                checked={formData?.subjectActions?.mentalIssues}
                                onChange={(e) => handleInputChange('subjectActions.mentalIssues', e.target.checked)}
                              />
                              <span>Mental Issues</span>
                            </label>
                            <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '12px' }}>
                              <label className="d-flex align-items-center">
                                <input
                                  type="checkbox"
                                  className="form-checkbox me-2"
                                  checked={formData?.subjectActions?.otherUnderInfluence}
                                  onChange={(e) => handleInputChange('subjectActions.otherUnderInfluence', e.target.checked)}
                                />
                                <span>Other:</span>
                              </label>
                              <input
                                type="text"
                                className="form-input ms-2"
                                // style={{ width: '60px' }}
                                value={formData?.subjectActions?.otherUnderInfluenceText}
                                onChange={(e) => handleInputChange('subjectActions.otherUnderInfluenceText', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '12px' }}>
                      <label className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-2"
                          checked={formData?.subjectActions?.other}
                          onChange={(e) => handleInputChange('subjectActions.other', e.target.checked)}
                        />
                        <span>Other:</span>
                      </label>
                      <input
                        type="text"
                        className="form-input flex-fill"
                        value={formData?.subjectActions?.otherText}
                        onChange={(e) => handleInputChange('subjectActions.otherText', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Officer Actions Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Officer Actions: (Check all that apply, if more than one type of force used, number in order of use.)</div>
                    <div className="pt-2 row g-1" style={{ fontSize: '12px' }}>
                      <div className="col-7">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.verbalDirection}
                              onChange={(e) => handleInputChange('officerActions.verbalDirection', e.target.checked)}
                            />
                            <span>Verbal Direction</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.softWeapons}
                              onChange={(e) => handleInputChange('officerActions.softWeapons', e.target.checked)}
                            />
                            <span>Soft Weaponless Control  <span style={{ fontSize: "11px" }}> (Muscling, joint locks, pressure points)</span></span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.hardWeapons}
                              onChange={(e) => handleInputChange('officerActions.hardWeapons', e.target.checked)}
                            />
                            <span>Hard Weaponless Control<span style={{ fontSize: "11px" }}>(Hard strikes, leg strikes, shoulder pin)</span></span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.ocSpray}
                              onChange={(e) => handleInputChange('officerActions.ocSpray', e.target.checked)}
                            />
                            <span>OC Spray</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.aspBaton}
                              onChange={(e) => handleInputChange('officerActions.aspBaton', e.target.checked)}
                            />
                            <span>Asp/Baton</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.nonLethal}
                              onChange={(e) => handleInputChange('officerActions.nonLethal', e.target.checked)}
                            />
                            <span>Non-Lethal<span style={{ fontSize: "11px" }}>(Pepperball)</span></span>
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.lessLethal}
                              onChange={(e) => handleInputChange('officerActions.lessLethal', e.target.checked)}
                            />
                            <span>Less Lethal Munitions<span style={{ fontSize: "11px" }}>(Bean bag, stinger, rubber)</span></span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.pointedTaser}
                              onChange={(e) => handleInputChange('officerActions.pointedTaser', e.target.checked)}
                            />
                            <span>Pointed Taser<span style={{ fontSize: "11px" }}>(Laser)</span></span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.dischargedTaser}
                              onChange={(e) => handleInputChange('officerActions.dischargedTaser', e.target.checked)}
                            />
                            <span>Discharged Taser</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.pointedFirearm}
                              onChange={(e) => handleInputChange('officerActions.pointedFirearm', e.target.checked)}
                            />
                            <span>Pointed Firearm</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.officerActions?.dischargedFirearm}
                              onChange={(e) => handleInputChange('officerActions.dischargedFirearm', e.target.checked)}
                            />
                            <span>Discharged Firearm</span>
                          </label>
                          <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '12px' }}>
                            <label className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox me-2"
                                checked={formData?.officerActions?.other}
                                onChange={(e) => handleInputChange('officerActions.other', e.target.checked)}
                              />
                              <span>Other:</span>
                            </label>
                            <input
                              type="text"
                              className="form-input me-2"
                              // style={{ width: '60px' }}
                              value={formData?.officerActions?.otherText}
                              onChange={(e) => handleInputChange('officerActions.otherText', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Physical Control Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div>Physical Control:</div>
                    <div className="pt-2 row g-4" style={{ fontSize: '12px' }}>
                      <div className="col-4">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.physicalControl?.notUsed}
                              onChange={(e) => handleInputChange('physicalControl.notUsed', e.target.checked)}
                            />
                            <span>Not Used</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.physicalControl?.muscling}
                              onChange={(e) => handleInputChange('physicalControl.muscling', e.target.checked)}
                            />
                            <span>Muscling <span style={{ fontSize: "11px" }}>(grip, push, pull)</span></span>
                          </label>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.physicalControl?.pressurePoints}
                              onChange={(e) => handleInputChange('physicalControl.pressurePoints', e.target.checked)}
                            />
                            <span>Pressure Points</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.physicalControl?.jointLock}
                              onChange={(e) => handleInputChange('physicalControl.jointLock', e.target.checked)}
                            />
                            <span>Joint Lock</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-2">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.physicalControl?.takedown}
                              onChange={(e) => handleInputChange('physicalControl.takedown', e.target.checked)}
                            />
                            <span>Takedown</span>
                          </label>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.physicalControl?.handcuffing}
                              onChange={(e) => handleInputChange('physicalControl.handcuffing', e.target.checked)}
                            />
                            <span>Handcuffing</span>
                          </label>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column gap-1">
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-2"
                              checked={formData?.physicalControl?.hobble}
                              onChange={(e) => handleInputChange('physicalControl.hobble', e.target.checked)}
                            />
                            <span>Hobble</span>
                          </label>
                          <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '12px' }}>
                            <label className="d-flex align-items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox me-2"
                                checked={formData?.physicalControl?.other}
                                onChange={(e) => handleInputChange('physicalControl.other', e.target.checked)}
                              />
                              <span>Other:</span>
                            </label>
                            <input
                              type="text"
                              className="form-input me-2"
                              // style={{ width: '60px' }}
                              value={formData?.physicalControl?.otherText}
                              onChange={(e) => handleInputChange('physicalControl.otherText', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mb-2" >
                      <span className="me-1 label-nowrap">Effective:</span>
                      <span className="d-flex align-items-center gap-3" style={{ fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.physicalControl?.effectiveYes}
                          onChange={(e) => handleInputChange('physicalControl.effectiveYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.physicalControl?.effectiveNo}
                          onChange={(e) => handleInputChange('physicalControl.effectiveNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.physicalControl?.effectiveNote}
                          onChange={(e) => handleInputChange('physicalControl.effectiveNote', e.target.value)}
                        />
                      </span>
                    </div>
                  </div>

                  {/* OC Spray Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">OC Spray:</div>
                    <div>OC Spray:</div>
                    <div
                      className="d-flex flex-wrap align-items-center pt-2"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.ocSpray?.notUsed}
                          onChange={(e) =>
                            handleInputChange('ocSpray.notUsed', e.target.checked)
                          }
                        />
                        Not Used
                      </div>

                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.ocSpray?.attempted}
                          onChange={(e) =>
                            handleInputChange('ocSpray.attempted', e.target.checked)
                          }
                        />
                        Attempted
                      </div>

                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.ocSpray?.used}
                          onChange={(e) =>
                            handleInputChange('ocSpray.used', e.target.checked)
                          }
                        />
                        Used
                      </div>

                      <div className="d-flex align-items-center">
                        Distance
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '40px' }}
                          value={formData?.ocSpray?.distance}
                          onChange={(e) =>
                            handleInputChange('ocSpray.distance', e.target.value)
                          }
                        />
                        <span>-</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '40px' }}
                          value={formData?.ocSpray?.distance1}
                          onChange={(e) =>
                            handleInputChange('ocSpray.distance1', e.target.value)
                          }
                        />
                        <span>ft.</span>
                      </div>

                      {/* FULL WIDTH for last one */}
                      <div
                        className="d-flex align-items-center"
                        style={{ flex: 1, gap: '0.5rem' }}
                      >
                        Duration: 1:
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '40px' }}
                          value={formData?.ocSpray?.duration1}
                          onChange={(e) =>
                            handleInputChange('ocSpray.duration1', e.target.value)
                          }
                        />
                        <span>2:</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '40px' }}
                          value={formData?.ocSpray?.duration2}
                          onChange={(e) =>
                            handleInputChange('ocSpray.duration2', e.target.value)
                          }
                        />
                        <span>3:</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '40px' }}
                          value={formData?.ocSpray?.duration3}
                          onChange={(e) =>
                            handleInputChange('ocSpray.duration3', e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-2" >
                      <span className="me-1 label-nowrap">Effective:</span>
                      <span className="d-flex align-items-center gap-3" style={{ fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.ocSpray?.effectiveYes}
                          onChange={(e) => handleInputChange('ocSpray.effectiveYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.ocSpray?.effectiveNo}
                          onChange={(e) => handleInputChange('ocSpray.effectiveNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.ocSpray?.effectiveNote}
                          onChange={(e) => handleInputChange('ocSpray.effectiveNote', e.target.value)}
                        />
                      </span>
                    </div>
                  </div>

                  {/* ASP / Baton */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">ASP / Baton:</div>
                    <div>ASP / Baton:</div>
                    <div
                      className="d-flex flex-wrap align-items-center pt-2"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.aspBaton?.notUsed}
                          onChange={(e) => handleInputChange('aspBaton.notUsed', e.target.checked)} />
                        Not Used
                      </div>

                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.aspBaton?.used}
                          onChange={(e) => handleInputChange('aspBaton.used', e.target.checked)}
                        />
                        Used
                      </div>

                      <div className="d-flex align-items-center">
                        Number of Strikes:
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '60px' }}
                          value={formData?.aspBaton?.numStrikes}
                          onChange={(e) => handleInputChange('aspBaton.numStrikes', e.target.value)}
                        />
                      </div>

                      <div className="d-flex align-items-center">
                        Location:
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.aspBaton?.location}
                          onChange={(e) => handleInputChange('aspBaton.location', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-2" >
                      <span className="me-1 label-nowrap">Effective:</span>
                      <span className="d-flex align-items-center gap-3" style={{ fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.aspBaton?.effectiveYes}
                          onChange={(e) => handleInputChange('aspBaton.effectiveYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.aspBaton?.effectiveNo}
                          onChange={(e) => handleInputChange('aspBaton.effectiveNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.aspBaton?.effectiveNote}
                          onChange={(e) => handleInputChange('aspBaton.effectiveNote', e.target.value)}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Non / Less Lethal Munitions */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Non Lethal / Less Lethal Munitions:</div>
                    <div>Non/Less lethal Munitions:</div>
                    <div
                      className="d-flex flex-wrap align-items-center pt-2"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.lessLethal?.notUsed} onChange={(e) => handleInputChange('lessLethal.notUsed', e.target.checked)} />
                        Not Used
                      </div>

                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.lessLethal?.used} onChange={(e) => handleInputChange('lessLethal.used', e.target.checked)} />
                        Used
                      </div>

                      <div className="d-flex align-items-center">
                        Bean Bag:
                        <input type="text" className="form-input" style={{ width: '40px' }} value={formData?.lessLethal?.beanBag} onChange={(e) => handleInputChange('lessLethal.beanBag', e.target.value)} />

                      </div>

                      <div className="d-flex align-items-center">
                        Stinger:
                        <input type="text" className="form-input" style={{ width: '40px' }} value={formData?.lessLethal?.stinger} onChange={(e) => handleInputChange('lessLethal.stinger', e.target.value)} />
                      </div>
                      <div className="d-flex align-items-center">
                        Rubber:
                        <input type="text" className="form-input" style={{ width: '40px' }} value={formData?.lessLethal?.rubber} onChange={(e) => handleInputChange('lessLethal.rubber', e.target.value)} />
                      </div>
                      <div className="d-flex align-items-center">
                        Pepperball:
                        <input type="text" className="form-input" style={{ width: '40px' }} value={formData?.lessLethal?.pepperball} onChange={(e) => handleInputChange('lessLethal.pepperball', e.target.value)} />
                      </div>

                    </div>
                    <div className="d-flex align-items-center gap-3 mt-1">
                      <span className="me-1 label-nowrap">Location of Hits:</span>
                      <input type="text" className="form-input flex-fill" value={formData?.lessLethal?.location} onChange={(e) => handleInputChange('lessLethal.location', e.target.value)} />
                    </div>


                    <div className="d-flex align-items-center gap-3 mt-1" >
                      <span className="me-1 label-nowrap">Effective:</span>
                      <span className="d-flex align-items-center gap-3" style={{ fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.lessLethal?.effectiveYes}
                          onChange={(e) => handleInputChange('lessLethal.effectiveYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.lessLethal?.effectiveNo}
                          onChange={(e) => handleInputChange('lessLethal.effectiveNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.lessLethal?.effectiveNote}
                          onChange={(e) => handleInputChange('lessLethal.effectiveNote', e.target.value)}
                        />
                      </span>
                    </div>
                  </div>

                  {/* TASER */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">TASER:</div>
                    <div>TASER:</div>
                    <div
                      className="d-flex flex-wrap align-items-center pt-2"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.taser?.notUsed}
                          onChange={(e) => handleInputChange("taser.notUsed", e.target.checked)}
                        />
                        Not Used
                      </div>

                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.taser?.pointed}
                          onChange={(e) => handleInputChange("taser.pointed", e.target.checked)}
                        />
                        Pointed Taser Only (Laser)
                      </div>

                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.taser?.discharged}
                          onChange={(e) => handleInputChange("taser.discharged", e.target.checked)}
                        />
                        Discharged Taser
                      </div>

                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-1"
                          checked={formData?.taser?.driveStun}
                          onChange={(e) => handleInputChange("taser.driveStun", e.target.checked)}
                        />
                        Drive Stun
                      </div>


                    </div>
                    <div
                      className="d-flex flex-wrap align-items-center mt-1"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center">
                        Distance Fired:
                        <input type="text" className="form-input" style={{ width: '60px' }} value={formData?.taser?.distance} onChange={(e) => handleInputChange('taser.distance', e.target.value)} />
                        <span>ft.</span>

                      </div>
                      <div className="d-flex align-items-center">
                        Cycles Discharged:
                        <input type="text" className="form-input" style={{ width: '60px' }} value={formData?.taser?.cycles} onChange={(e) => handleInputChange('taser.cycles', e.target.value)} />
                      </div>
                      <div className="d-flex align-items-center">
                        Probes Penetrate Skin
                      </div>
                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox"
                          checked={formData?.taser?.probesPenetrateSkinYes}
                          onChange={(e) => handleInputChange('taser.probesPenetrateSkinYes', e.target.checked)} />
                        Yes
                      </div>
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={formData?.taser?.probesPenetrateSkinNo}
                          onChange={(e) => handleInputChange('taser.probesPenetrateSkinNo', e.target.checked)} />
                        No
                      </div>

                    </div>
                    <div
                      className="d-flex flex-wrap align-items-center mt-1"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center label-nowrap">
                        Taser Number:
                        <input type="text" className="form-input" value={formData?.taser?.taserNumber} onChange={(e) => handleInputChange('taser.taserNumber', e.target.value)} />

                      </div>
                      <div className="d-flex align-items-center label-nowrap">
                        Cartridge Numbers:
                        <input type="text" className="form-input" value={formData?.taser?.cartridgeNumbers} onChange={(e) => handleInputChange('taser.cartridgeNumbers', e.target.value)} />
                      </div>
                      <div className="d-flex align-items-center">
                        Placed in Evidence:
                      </div>
                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox" checked={formData?.taser?.placedInEvidenceYes} onChange={(e) => handleInputChange('taser.placedInEvidenceYes', e.target.checked)} />
                        Yes
                      </div>
                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox" checked={formData?.taser?.placedInEvidenceNo} onChange={(e) => handleInputChange('taser.placedInEvidenceNo', e.target.checked)} />
                        No
                      </div>

                    </div>
                    <div className="d-flex align-items-center gap-3 mt-1" >
                      <span className="me-1 label-nowrap">Effective:</span>
                      <span className="d-flex align-items-center gap-3" style={{ fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.taser?.effectiveYes}
                          onChange={(e) => handleInputChange('taser.effectiveYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.taser?.effectiveNo}
                          onChange={(e) => handleInputChange('taser.effectiveNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.taser?.effectiveNote}
                          onChange={(e) => handleInputChange('taser.effectiveNote', e.target.value)}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Firearm */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Firearm:</div>
                    <div>Firearm:</div>
                    <div
                      className="d-flex flex-wrap align-items-center pt-2"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center">


                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.notUsed} onChange={(e) => handleInputChange('firearm.notUsed', e.target.checked)} />Not Used
                      </div>

                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.pointed} onChange={(e) => handleInputChange('firearm.pointed', e.target.checked)} />Pointed Firearm Only
                      </div>

                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.discharged} onChange={(e) => handleInputChange('firearm.discharged', e.target.checked)} />Discharged Firearm
                      </div>

                    </div>

                    <div className="mt-1">Weapon:</div>
                    <div
                      className="d-flex flex-wrap align-items-center mt-1"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >
                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.sidearm} onChange={(e) => handleInputChange('firearm.sidearm', e.target.checked)} />
                        Sidearm:
                      </div>
                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.shotgun} onChange={(e) => handleInputChange('firearm.shotgun', e.target.checked)} />
                        Shotgun:
                      </div>

                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.rifle} onChange={(e) => handleInputChange('firearm.rifle', e.target.checked)} />
                        Patrol Rifle
                      </div>
                      <div className="d-flex align-items-center">
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.backup} onChange={(e) => handleInputChange('firearm.backup', e.target.checked)} />
                        Backup / Off Duty
                      </div>
                      <div className="d-flex align-items-center">
                        Distance Fired:
                        <input type="text" className="form-input" style={{ width: '60px' }} value={formData?.firearm?.distance} onChange={(e) => handleInputChange('firearm.distance', e.target.value)} />
                        <span>ft.</span>

                      </div>
                    </div>

                    <div
                      className="d-flex flex-wrap align-items-center mt-1"
                      style={{ gap: '1rem', fontSize: '12px' }}
                    >

                      <div className="d-flex align-items-center">
                        Rounds Discharged:
                        <input type="text" className="form-input" style={{ width: '60px' }} value={formData?.firearm?.roundsDischarged} onChange={(e) => handleInputChange('firearm.roundsDischarged', e.target.value)} />
                      </div>
                      <div className="d-flex align-items-center label-nowrap">
                        Number Hits on Target:
                        <input type="text" className="form-input" style={{ width: '60px' }} value={formData?.firearm?.hitsOnTarget} onChange={(e) => handleInputChange('firearm.hitsOnTarget', e.target.value)} />
                      </div>
                      <div className="d-flex align-items-center label-nowrap">
                        Weapon Serial Number:
                        <input type="text" className="form-input" value={formData?.firearm?.serialNumber} onChange={(e) => handleInputChange('firearm.serialNumber', e.target.value)} />
                        <input type="checkbox" className="form-checkbox me-1" checked={formData?.firearm?.serialNumberMark} onChange={(e) => handleInputChange('firearm.serialNumberMark', e.target.checked)} />
                      </div>
                    </div>


                    <div className="d-flex align-items-center gap-3 mt-1" >
                      <span className="me-1 label-nowrap">Effective:</span>
                      <span className="d-flex align-items-center gap-3" style={{ fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.firearm?.effectiveYes}
                          onChange={(e) => handleInputChange('firearm.effectiveYes', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">Yes</span>
                        <input
                          type="checkbox"
                          className="form-checkbox me-1 label-nowrap"
                          checked={formData?.firearm?.effectiveNo}
                          onChange={(e) => handleInputChange('firearm.effectiveNo', e.target.checked)}
                        />
                        <span className="me-1 label-nowrap">No:</span>
                        <input
                          type="text"
                          className="form-input flex-fill"
                          value={formData?.firearm?.effectiveNote}
                          onChange={(e) => handleInputChange('firearm.effectiveNote', e.target.value)}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Environmental & Situational Conditions: */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Environmental & Situational Conditions:</div>

                    <div className="row" style={{ fontSize: '12px' }}>
                      <div className="col-6">
                        <div className="fw-bold label-nowrap pb-2" style={{ fontSize: '14px' }}>Environmental Conditions:</div>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.environmental?.hot}
                            onChange={(e) => handleInputChange('environmental.hot', e.target.checked)}
                          />
                          Hot (Little or thin clothing)
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.environmental?.warm}
                            onChange={(e) => handleInputChange('environmental.warm', e.target.checked)}
                          />
                          Warm
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.environmental?.cool}
                            onChange={(e) => handleInputChange('environmental.cool', e.target.checked)}
                          />
                          Cool
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.environmental?.cold}
                            onChange={(e) => handleInputChange('environmental.cold', e.target.checked)}
                          />
                          Cold (Heavy clothing)
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.environmental?.daylight}
                            onChange={(e) => handleInputChange('environmental.daylight', e.target.checked)}
                          />
                          Daylight
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.environmental?.dawnDusk}
                            onChange={(e) => handleInputChange('environmental.dawnDusk', e.target.checked)}
                          />
                          Dawn/Dusk
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.environmental?.darkness}
                            onChange={(e) => handleInputChange('environmental.darkness', e.target.checked)}
                          />
                          Darkness
                        </label>
                        <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '12px' }}>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-1"
                              checked={formData?.environmental?.other}
                              onChange={(e) => handleInputChange('environmental.other', e.target.checked)}
                            />
                            Other:
                          </label>
                          <input
                            type="text"
                            className="form-input ms-2"
                            value={formData?.environmental?.otherNote}
                            onChange={(e) => handleInputChange('environmental.otherNote', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="fw-bold label-nowrap pb-2" style={{ fontSize: '14px' }}>Situational Conditions:</div>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.situational?.multipleSuspects}
                            onChange={(e) => handleInputChange('situational.multipleSuspects', e.target.checked)}
                          />
                          Multiple Suspects
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.situational?.hostile}
                            onChange={(e) => handleInputChange('situational.hostile', e.target.checked)}
                          />
                          Hostile Environment
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.situational?.threats}
                            onChange={(e) => handleInputChange('situational.threats', e.target.checked)}
                          />
                          Threats to Officer(s)
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.situational?.confined}
                            onChange={(e) => handleInputChange('situational.confined', e.target.checked)}
                          />
                          Confined Space
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.situational?.indoors}
                            onChange={(e) => handleInputChange('situational.indoors', e.target.checked)}
                          />
                          Indoors
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.situational?.outdoors}
                            onChange={(e) => handleInputChange('situational.outdoors', e.target.checked)}
                          />
                          Outdoors
                        </label>
                        <label className="d-block">
                          <input
                            type="checkbox"
                            className="form-checkbox me-1 label-nowrap"
                            checked={formData?.situational?.inVehicle}
                            onChange={(e) => handleInputChange('situational.inVehicle', e.target.checked)}
                          />
                          In Vehicle
                        </label>
                        <div className="d-flex align-items-center gap-3 mb-2" style={{ fontSize: '12px' }}>
                          <label className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox me-1"
                              checked={formData?.situational?.other}
                              onChange={(e) => handleInputChange('situational.other', e.target.checked)}
                            />
                            Other:
                          </label>
                          <input
                            type="text"
                            className="form-input ms-2"
                            value={formData?.situational?.otherNote}
                            onChange={(e) => handleInputChange('situational.otherNote', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Officer Summary + Diagram Placeholder */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="row" style={{ fontSize: '12px' }}>
                      <div className="col-6">
                        <div className="section-title">Officer Summary:</div>
                        <div className="mt-4 fw-bold">Type of force ultimately successful in Control of Subject:</div>
                        <input
                          type="text"
                          className="form-input ms-2"
                          value={formData?.officerSummary?.successfulForceType}
                          onChange={(e) => handleInputChange('officerSummary.successfulForceType', e.target.value)}
                        />
                        <div className="mb-2 fw-bold mt-2">Officer comments on regarding force effectiveness:</div>
                        <textarea
                          style={{ width: "100%" }}
                          rows={16}
                          value={formData?.officerSummary?.forceEffectivenessComments}
                          onChange={(e) => handleInputChange('officerSummary.forceEffectivenessComments', e.target.value)}
                        />

                        <div className="mt-2 d-flex align-items-center label-nowrap">
                          <span className="me-2">Reporting Officer:</span>
                          <input
                            type="text"
                            className="form-input"
                            value={formData?.officerSummary?.reportingOfficer}
                            onChange={(e) => handleInputChange('officerSummary.reportingOfficer', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-6 text-center">
                        <div className="section-title">Force Location Diagram:</div>
                        {/* <CADUseOfForceFormDiagram /> */}
                        <div className="container-fluid mt-4">
                          <span>
                            <div className="d-flex flex-wrap gap-2 mb-1">
                              {tools.map((tool) => (
                                <button
                                  key={tool.type}
                                  className={`btn ${selectedTool === tool.type ? 'btn-primary' : 'btn-outline-secondary'} d-flex align-items-center gap-2 mr-2 mb-1`}
                                  onClick={() => setSelectedTool(tool.type)}
                                >
                                  {tool.label}
                                </button>
                              ))}
                            </div>

                            <div className="d-flex mb-3  style={{ gap: '0.5rem' }}">
                              {/* <button
                                className="btn btn-secondary btn-sm mr-2"
                                onClick={() => setSelectedTool(null)}
                                disabled={!selectedTool}
                              >
                                Clear Selection
                              </button> */}
                              <button
                                className="btn btn-danger btn-sm mr-2"
                                onClick={handleDeleteSelected}
                              >
                                Delete Selected
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={handleClearAll}
                              >
                                Clear All
                              </button>
                            </div>
                          </span>
                          <canvas
                            ref={canvasRef}
                            className="border border-secondary rounded"
                            style={{ cursor: selectedTool ? "crosshair" : "default" }}
                          />
                          {/* <button onClick={saveCanvasData}>Send Image to API</button>
                        <button onClick={editCanvasData}>Load Canvas Data</button> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className='text-center' style={{ fontWeight: "bold" }}>*** Full Narrative of Use of Force in Arrest or Offense Report - Attach Copy to this Supplement **</p>

                  {/* Supervisor Review Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="section-title">Supervisor:</div>
                    <div className="row g-2" style={{ fontSize: '12px' }}>
                      <div className="col-6 d-flex align-items-center label-nowrap">
                        <span className="me-2">Number of officers at scene and available when force used:</span>
                        <input
                          type="text"
                          className="form-input"
                          value={formData?.supervisorReview?.officerCount}
                          onChange={(e) => handleInputChange('supervisorReview.officerCount', e.target.value)}
                        />
                      </div>
                      <div className="col-4 d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox me-2"
                          checked={formData?.supervisorReview?.videoReviewed}
                          onChange={(e) => handleInputChange('supervisorReview.videoReviewed', e.target.checked)}
                        />
                        <span>Video Reviewed</span>
                      </div>
                      <div className="col-12">
                        <div className="fw-bold">Comments:</div>
                        <textarea
                          className="form-input"
                          rows={6}
                          value={formData?.supervisorReview?.comments}
                          onChange={(e) => handleInputChange('supervisorReview.comments', e.target.value)}
                        />
                      </div>
                      <div className="col-6 d-flex align-items-center">
                        <span className="me-2">Supervisor:</span>
                        <input
                          type="text"
                          className="form-input me-3"
                          value={formData?.supervisorReview?.supervisorName}
                          onChange={(e) => handleInputChange('supervisorReview.supervisorName', e.target.value)}
                        />
                        <span className="me-2">#</span>
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '80px' }}
                          value={formData?.supervisorReview?.badgeNumber}
                          onChange={(e) => handleInputChange('supervisorReview.badgeNumber', e.target.value)}
                        />
                      </div>

                      <div
                        className="col-4 d-flex flex-wrap row align-items-center"
                        style={{ gap: '1rem', fontSize: '12px' }}
                      >
                        <div className="d-flex align-items-center">
                          <input type="checkbox" className="form-checkbox" checked={formData?.supervisorReview?.inCompliance} onChange={(e) => handleInputChange('supervisorReview.inCompliance', e.target.checked)} />
                          In Compliance with Policy
                        </div>

                        <div className="d-flex align-items-center">
                          <input type="checkbox" className="form-checkbox" checked={formData?.supervisorReview?.investigationNeeded} onChange={(e) => handleInputChange('supervisorReview.investigationNeeded', e.target.checked)} />
                          Further Investigation Needed
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Reviewed by Section */}
                  <div className="position-relative mb-4 form-section p-3">
                    <div className="row g-3" style={{ fontSize: '12px' }}>
                      <div className="col-12 d-flex align-items-center gap-3">
                        <span className="me-2">Reviewed:</span>
                        <input
                          type="text"
                          className="form-input"
                          value={formData?.reviewed?.patrolLieutenantName}
                          onChange={(e) => handleInputChange("reviewed.patrolLieutenantName", e.target.value)}
                        />
                        <span className="ms-2 label-nowrap">Patrol Lieutenant</span>
                        <label className="label-nowrap">
                          <input
                            type="checkbox"
                            className="form-checkbox ms-3 me-1 "
                            checked={formData?.reviewed?.patrolLieutenantInCompliance}
                            onChange={(e) => handleInputChange("reviewed.patrolLieutenantInCompliance", e.target.checked)}

                          />
                          In Compliance
                        </label>
                        <label className="label-nowrap">
                          <input
                            type="checkbox"
                            className="form-checkbox ms-2 me-1"
                            checked={formData?.reviewed?.patrolLieutenantInvestigationNeeded}
                            onChange={(e) =>
                              handleInputChange("reviewed.patrolLieutenantInvestigationNeeded", e.target.checked)}
                          />
                          Investigation Needed
                        </label>
                      </div>
                    </div>
                    <div className="row g-3" style={{ fontSize: '12px' }}>
                      <div className="col-12 d-flex align-items-center gap-3">
                        <span className="me-2">Reviewed:</span>
                        <input
                          type="text"
                          className="form-input"
                          value={formData?.reviewed?.chiefOfPoliceName}
                          onChange={(e) => handleInputChange("reviewed.chiefOfPoliceName", e.target.value)}
                        />
                        <span className="ms-2 label-nowrap">Chief of Police</span>
                        <label className="label-nowrap">
                          <input
                            type="checkbox"
                            className="form-checkbox ms-3 me-1 "
                            checked={formData?.reviewed?.chiefOfPoliceInCompliance}
                            onChange={(e) => handleInputChange("reviewed.chiefOfPoliceInCompliance", e.target.checked)}

                          />
                          In Compliance
                        </label>
                        <label className="label-nowrap">
                          <input
                            type="checkbox"
                            className="form-checkbox ms-2 me-1"
                            checked={formData?.reviewed?.chiefOfPoliceInvestigationNeeded}
                            onChange={(e) =>
                              handleInputChange("reviewed.chiefOfPoliceInvestigationNeeded", e.target.checked)}
                          />
                          Investigation Needed
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* use of force form end */}
          </div>
          <div className="col-12 mt-2">
            <div className="row">
              <div className="col-2 mt-2 pt-2">
                <label htmlFor="" className='new-label'>Report Type</label>
              </div>
              <div className="col-3 mt-2 ">
                <input
                  type="text"
                  className="form-control"
                  value={useOfForceBasicDetailState?.ReportType}
                  readOnly
                  disabled
                />

              </div>
              <div className="col-2 mt-2 pt-2">
                <label htmlFor="" className='new-label'>Date/Time{errorState.ReportDateTime && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Enter Report Date Time</p>
                )}</label>
              </div>
              <div className="col-3 mt-2 ">
                <DatePicker
                  name='ReportDateTime'
                  id='ReportDateTime'
                  onChange={(date) => {
                    handleUseOfForceBasicDetailState("ReportDateTime", date);
                  }}
                  selected={useOfForceBasicDetailState?.ReportDateTime || ""}
                  dateFormat="MM/dd/yyyy HH:mm"
                  timeCaption="Time"
                  showMonthDropdown
                  showYearDropdown
                  showTimeSelect
                  timeInputLabel
                  is24Hour
                  timeFormat="HH:mm "
                  isClearable={useOfForceBasicDetailState?.ReportDateTime ? true : false}
                  showDisabledMonthNavigation
                  dropdownMode="select"
                  autoComplete="off"
                  placeholderText="Select To Date..."
                  minDate={useOfForceBasicDetailState?.ReportDateTime || new Date(1991, 0, 1)}
                  maxDate={new Date(datezone)}
                  disabled={approvalState.Status === "Pending Review" || approvalState.Status === "Approved"} // Disable if from date is not selected
                  // className={!useOfForceBasicDetailState?.ReportDateTime && 'readonlyColor'}
                  className={(approvalState.Status === "Pending Review" || approvalState.Status === "Approved") ? "readonlyColor" : "requiredColor"}
                />

              </div>
            </div>
            <div className="row">
              <div className="col-2 mt-2 pt-2">
                <label htmlFor="" className='new-label text-nowrap'>Prepared by </label>
              </div>
              <div className="col-3 mt-2 ">
                <Select
                  name='PreparedById'
                  isClearable
                  value={agencyOfficerDrpData?.filter((obj) => obj.value === useOfForceBasicDetailState?.PreparedById)}
                  options={agencyOfficerDrpData}
                  onChange={(e) => handleUseOfForceBasicDetailState('PreparedById', e)}
                  placeholder="Select.."
                  menuPlacement="bottom"
                  isDisabled
                />
              </div>
              <div className="col-2 mt-2 pt-2">
                <label htmlFor="" className='new-label text-nowrap'>Written For{errorState.WrittenForID && (
                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Enter Report Date Time</p>
                )}</label>
              </div>
              <div className="col-3 mt-2 ">
                <Select
                  name="WrittenForID"
                  styles={
                    approvalState.Status === 'Pending Review' || approvalState.Status === 'Approved' || approvalState.Status === 'Draft' || approvalState.Status === 'Rejected'
                      ? colourStylesUsers
                      : customStyles
                  }
                  value={WrittenForDataDrp?.filter((obj) => obj.value === useOfForceBasicDetailState?.WrittenForID)}
                  options={WrittenForDataDrp}
                  onChange={(e) => handleUseOfForceBasicDetailState('WrittenForID', e.value)}
                  placeholder="Select.."
                  menuPlacement="bottom"
                  isDisabled={approvalState.Status === 'Pending Review' || approvalState.Status === 'Approved' || approvalState.Status === 'Draft' || approvalState.Status === 'Rejected'}
                />
              </div>
            </div>
            <div className="row ">
              {
                useOfForceID ?
                  <>
                    <div className="col-12 col-md-12 col-lg-12">
                      <div className="row ">
                        <div className='col-lg-2'></div>
                        <div className="col-6 col-md-6 col-lg-2 mt-2 pt-1 ">
                          <div className="form-check ml-2">
                            <input
                              type="radio"
                              name="approverType"
                              value="IND"
                              className="form-check-input"
                              checked={selectedOption === "IND"}
                              onChange={handleRadioChange}
                              disabled={approvalState.Status === 'Pending Review' || approvalState.Status === 'Approved' ? true : false}
                            />
                            <label className="form-check-label" htmlFor="Individual">
                              Individual
                            </label>
                          </div>
                        </div>
                        <div className="col-6 col-md-6 col-lg-2 mt-2 pt-1 ">
                          <div className="form-check ml-2">
                            <input
                              type="radio"
                              name="approverType"
                              value="Group"
                              className="form-check-input"
                              checked={selectedOption === "Group"}
                              disabled={approvalState.Status === 'Pending Review' || approvalState.Status === 'Approved' ? true : false}
                              onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="Group">
                              Group
                            </label>
                          </div>
                        </div>
                        <div className='col-lg-6'></div>
                        {selectedOption === "IND" ? (
                          <>
                            <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                              <span htmlFor="" className='label-name '>Report Approver {errorApprovalState.ApprovingSupervisorID && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Report Approver</p>
                              )}</span>
                            </div>
                            <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                              <SelectBox
                                className="custom-multiselect"
                                classNamePrefix="custom"
                                options={reportApproveOfficer}
                                isMulti
                                menuPlacement="top"
                                styles={colourStylesUsers}
                                isDisabled={
                                  approvalState.Status?.trim() === 'Approved' || approvalState.Status === 'Pending Review' ||
                                  (!IsSuperadmin && approvalState.ReportedByPINActivityID != loginPinID && approvalState.Status === 'Draft')
                                }
                                closeMenuOnSelect={false}
                                hideSelectedOptions={true}
                                value={reportApproveOfficer?.filter(option => approvalState?.ApprovingSupervisorID?.split(',').includes(option.value.toString()))}
                                onChange={handleSelectIncidentName}
                              />
                            </div>

                          </>
                        ) : (
                          <>
                            <div className="col-2 col-md-2 col-lg-2 mt-3 pt-2">
                              <span htmlFor="" className='label-name'>Approval Group {errorApprovalState.ApprovingSupervisorID && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Approval Group</p>
                              )}</span>
                            </div>
                            <div className="col-4 col-md-12 col-lg-4 dropdown__box">
                              <SelectBox
                                className="custom-multiselect"
                                classNamePrefix="custom"
                                options={groupList}
                                isMulti
                                styles={colourStylesUsers}
                                // isDisabled={
                                //   approvalState.Status?.trim() === 'Approved' || approvalState.Status === 'Pending Review' ||
                                //   (!IsSuperadmin && approvalState.ReportedByPINActivityID != loginPinID && approvalState.Status === 'Draft')
                                // }
                                closeMenuOnSelect={false}
                                hideSelectedOptions={true}
                                value={groupList?.filter(option => approvalState?.ApprovingSupervisorID?.split(',').includes(option.value.toString()))}
                                onChange={handleSelectIncidentName}
                              />
                            </div>
                          </>
                        )}

                        <div className='col-lg-2'></div>

                        <div className='col-3 col-md-3 col-lg-4 text-right'>
                          <div
                            id="NIBRSStatus"
                            className={
                              approvalState.Status === "Draft"
                                ? "nibrs-draft-Nar"
                                : approvalState.Status === "Approved"
                                  ? "nibrs-submitted-Nar"
                                  : approvalState.Status === "Rejected"
                                    ? "nibrs-rejected-Nar"
                                    : approvalState.Status === "Pending Review"
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
                            {approvalState.Status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </> :
                  <></>
              }

            </div>
          </div>
          {/* Save and Update action */}
          <div className="btn-box d-flex justify-content-between offset-md-3 offset-lg-2 mt-2">
            {
              useOfForceID && approvalState.Status != "Pending Review" && approvalState.Status != "Approved" || useOfForceID && approvalState.ReportedByPINActivityID === loginPinID ?
                <>
                  <button
                    type="button"
                    // disabled={(approvalState.Status === 'Pending Review' || approvalState.Status === 'Approved') ? true : false}
                    // disabled={((approvalState.ReportedByPINActivityID != loginPinID && approvalState.Status === 'Draft') || approvalState.Status === 'Pending Review' || approvalState.Status === 'Approved') ? true : false}
                    onClick={() => Add_Approval()}
                    className="btn btn-sm btn-success ml-1"  >
                    Send For Approval
                  </button>
                </> :
                <></>
            }

            {useOfForceID ?
              <button type="button" disabled={approvalState.Status === "Pending Review" || approvalState.Status === "Approved"} onClick={() => updateUseOfForceForm()} className="btn btn-sm btn-success ml-auto">Update</button>
              :
              <button type="button" onClick={() => addUseOfForceForm()} className="btn btn-sm btn-success ml-auto">Save</button>}
          </div>
        </div>

      </div>
    </>
  )
}

export default PoliceForceIncident
