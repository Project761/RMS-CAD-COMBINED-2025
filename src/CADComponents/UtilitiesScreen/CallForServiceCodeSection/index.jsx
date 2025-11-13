import { useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import Select from "react-select";
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import { coloredStyle_Select, colorLessStyle_Select } from '../../Utility/CustomStylesForReact';
import '../section.css';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import useObjState from '../../../CADHook/useObjState';
import { isEmpty, compareStrings } from '../../../CADUtils/functions/common';
import { useQuery } from 'react-query';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import CADConfirmModal from '../../Common/CADConfirmModal';
import { useSelector, useDispatch } from 'react-redux';
import SelectBox from '../../../Components/Common/SelectBox';
import { fetchPostData } from '../../../Components/hooks/Api';
import { getData_DropDown_Priority } from '../../../CADRedux/actions/DropDownsData';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';
import Tooltip from '../../Common/Tooltip';
import img from '../../../img/file.jpg';

// Utility functions
const validateFileUpload = (file) => {
  const maxFileSizeInBytes = 10 * 1024 * 1024; // Exactly 10MB
  const allowedTypes = [
    'image/png', 'image/jpeg', 'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv', 'text/plain', 'video/mp4'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: `Invalid file type. Allowed types are: ${allowedTypes.join(', ')}` };
  }

  if (file.size > maxFileSizeInBytes) {
    return { isValid: false, error: `File size exceeds 10MB limit.` };
  }

  return { isValid: true };
};

const isImageFile = (fileName) => {
  const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
  return imageExtensions.test(fileName);
};

const CallForServiceCodeSection = () => {
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [filterListData, setFilterListData] = useState([]);
  const [isUpdateAgency, setIsUpdateAgency] = useState(false);
  const [listData, setListData] = useState([]);
  const [searchValue1, setSearchValue1] = useState('');
  const [isChange, setIsChange] = useState(false);
  const [searchValue2, setSearchValue2] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [confirmType, setConfirmType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [isSuperadmin, setIsSuperadmin] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();

  // File upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmParams, setConfirmParams] = useState(null);
  const fileInputRef = useRef(null);

  const [
    CFSCodeState,
    setCFSCodeState,
    handleCFSCodeState,
    clearCFSCodeState,
  ] = useObjState({
    cfsCode: "",
    cfsCodeDesc: "",
    priorityCode: "",
    alarmLevel: "",
    cfsLaw: false,
    cfsFire: false,
    cfsEmergencyMedicalService: false,
    cfsOther: false,
    CaseRequired: false,
    IsTrafficVehicle: false,
    IsRequirePARTimer: false,
    minute: "",
    AgencyID: "",
    agencyCode: "",
    MultiAgency_Name: "",
    IsActive: true
  })
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  })

  const [
    errorCFSCodeState,
    ,
    handleErrorCFSCodeState,
    clearStateCFSCodeState,
  ] = useObjState({
    cfsCode: false,
    cfsCodeDesc: false,
    priorityCode: false,
    agencyTypes: false,
    minute: false,
  });

  const GetResourceTypeKey = `/CAD/MasterCallforServiceCode/InsertCallforServiceCode`;
  const { data: getCFSData, isSuccess: isFetchCFSData, refetch, isError: isNoData } = useQuery(
    [GetResourceTypeKey, { Action: "GetData_CallforService", IsActive: pageStatus, AgencyID: loginAgencyID, PINID: loginPinID, IsSuperAdmin: isSuperadmin },],
    MasterTableListServices.getCFS,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );

  useEffect(() => {
    if (getCFSData && isFetchCFSData) {
      const data = JSON.parse(getCFSData?.data?.data);
      setFilterListData(data?.Table);
      setListData(data?.Table);
      setEffectiveScreenPermission(data?.Table1?.[0]);
    } else {
      setFilterListData([]);
      setListData([]);
      setEffectiveScreenPermission();
    }
  }, [getCFSData, isFetchCFSData])

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
      setIsSuperadmin(localStoreData?.IsSuperadmin ? 1 : 0);
      if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
      if (localStoreData?.AgencyID && agencyCodeDropDown?.length > 0) {
        const agency = agencyCodeDropDown?.find((i => i?.value.toString() === localStoreData?.AgencyID));
        setMultiSelected({
          optionSelected: agency
        });
        setCFSCodeState({
          ...CFSCodeState,
          'agencyCode': agency.value.toString(), 'MultiAgency_Name': agency.label.toString()
        })
      }
    }
  }, [localStoreData, agencyCodeDropDown, isUpdateAgency]);

  useEffect(() => {
    if (agencyCodeDropDown?.length === 0) {
      if (loginPinID && loginAgencyID) {
        getAgency(loginAgencyID, loginPinID);
      }
    }
  }, [loginPinID, loginAgencyID])

  // File upload handlers
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Only get the first file (single file upload)

    if (!file) return;

    const validation = validateFileUpload(file);

    if (!validation.isValid) {
      toastifyError(validation.error);
      event.target.value = "";
      return;
    }

    // Replace any existing file with the new one (single file only)
    setSelectedFiles([file]);
    setIsChange(true);
    event.target.value = "";
  };

  const removeFile = async (index, file) => {
    if (file.name) {
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsChange(true);
    }
    else {
      const data = {
        Action: "Delete_CFS_Image",
        CallforServiceID: CFSCodeState?.CallforServiceID,
        ModifiedByUserFK: loginPinID,
      }
      const response = await MasterTableListServices.deleteCFSImage(data);
      if (response?.status === 200) {
        toastifySuccess("File Deleted Successfully");
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }

  };

  const handleFileClick = (file) => {
    const fileType = file.name ? file.name : file;
    if (isImageFile(fileType)) {
      if (file.name) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      } else {
        window.open(fileType, '_blank');
      }
    } else {
      if (file.name) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      } else {
        window.open(fileType, '_blank');
      }
    }
  };

  const handleFileKeyDown = (e, file) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFileClick(file);
    }
  };

  const handleDeleteFile = (e, index, file) => {
    e.stopPropagation();
    setConfirmParams({ index, file });
    setShowConfirmModal(true);
  };

  // File preview render function
  const renderFilePreview = () => (
    <div className="file-preview-container" style={{
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: '10px'
    }}>
      {selectedFiles.map((file, index) => (
        <div
          key={index}
          className="file-preview-item"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '5px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
            position: 'relative',
            maxWidth: '150px',
            cursor: 'pointer'
          }}
          onClick={() => handleFileClick(file)}
          onKeyDown={(e) => handleFileKeyDown(e, file)}
          tabIndex={0}
          role="button"
          aria-label={`View ${file?.name}`}
        >
          {file.name ? isImageFile(file.name) ? (
            <img
              src={URL.createObjectURL(file)}
              alt={`Selected ${index}`}
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={img}
              alt="Document Icon"
              style={{ width: '50px', height: '50px' }}
            />
          ) : isImageFile(file) ? (
            <img
              src={file}
              alt={`Selected ${index}`}
              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={img}
              alt="Document Icon"
              style={{ width: '50px', height: '50px' }}
            />
          )}

          <button
            className="delete-button"
            onClick={(e) => handleDeleteFile(e, index, file)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ))}
    </div>
  );

  async function handelActiveInactive() {
    const data = {
      CallforServiceID: activeInactiveData?.CallforServiceID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
    }
    const response = await MasterTableListServices.changeStatusCallforServiceCode(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
  }

  const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
  }

  const getAgency = async (loginAgencyID, loginPinID) => {
    const value = {
      AgencyID: loginAgencyID,
      PINID: loginPinID,
    }
    fetchPostData("Agency/GetData_Agency", value).then((data) => {
      if (data) {
        setAgencyCodeDropDown(changeArrayFormat(data))
      } else {
        setAgencyCodeDropDown([]);
      }
    })
  }

  const columns = [
    {
      name: 'CFS Code',
      selector: row => row.CFSCODE,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCODE, rowB.CFSCODE),
      style: {
        position: "static",
      },
    },
    {
      name: 'Description',
      selector: row => row.CFSCodeDescription,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCodeDescription, rowB.CFSCodeDescription),
      style: {
        position: "static",
      },
    },
    {
      name: 'Alarm Level',
      // selector: row => PriorityDrpData?.find((i) => i?.PriorityID == row?.AlrmLevel)?.label,
      style: {
        position: "static",
      },
    },
    {
      name: 'RMS Incident #',
      selector: row => row?.CaseRequired ? "Yes" : "No",
      style: {
        position: "static",
      },
    },
    {
      name: 'Required Agency Type',
      selector: row => {
        let result = [];
        if (row?.LAW === true) result.push("L");
        if (row?.FIRE === true) result.push("F");
        if (row?.EMERGENCYMEDICALSERVICE === true) result.push("E");
        if (row?.OTHER === true) result.push("O");
        return result.join(", ") || "";
      },
      sortable: true,
      style: {
        position: "static",
      },
    },
    {
      name: 'Priority Code',
      selector: row => PriorityDrpData?.find((i) => i?.PriorityID === row?.PriorityID)?.PriorityCode,
      sortable: true,
      style: {
        position: "static",
      },
    },
    {
      name:
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {'Status'}
        </div>,
      cell: (row, index) =>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <span
            className="btn btn-sm text-white px-1 py-0 mr-1"
            style={{ background: "#ddd", cursor: "pointer" }}
          >
            {effectiveScreenPermission ? effectiveScreenPermission?.DeleteOK ? row?.IsActive ? (
              <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(false); setConfirmType("InActive") }}></i>
            ) : (
              <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true" onClick={(e) => { setShowModal(true); setActiveInactiveData(row); setIsActive(true); setConfirmType("Active"); }}></i>
            ) : <></> : <></>}
          </span>
        </div>,
      width: "70px",
      style: {
        position: "static",
      },
    },
  ];

  function handelCancel() {
    clearStateCFSCodeState();
    clearCFSCodeState();
    setMultiSelected({
      optionSelected: null
    });
    setIsChange(false);
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSpecialKeyDown = (e) => {
    const isAlphanumeric = e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/);
    const controlKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
    ];

    if (!isAlphanumeric && !controlKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const validateCFSCodeForm = () => {
    let isError = false;
    const keys = Object.keys(errorCFSCodeState);
    keys.map((field) => {
      if (
        field === "cfsCode" &&
        isEmpty(CFSCodeState[field])) {
        handleErrorCFSCodeState(field, true);
        isError = true;
      } else if (field === "cfsCodeDesc" && isEmpty(CFSCodeState[field])) {
        handleErrorCFSCodeState(field, true);
        isError = true;
      } else if (field === "priorityCode" && (CFSCodeState[field] === null || CFSCodeState[field] === "")) {
        handleErrorCFSCodeState(field, true);
        isError = true;
      } else if (field === "agencyTypes" && (CFSCodeState.cfsLaw === false && CFSCodeState.cfsFire === false && CFSCodeState.cfsEmergencyMedicalService === false && CFSCodeState.cfsOther === false)) {
        handleErrorCFSCodeState(field, true);
        isError = true;
      } else if (field === "minute" && CFSCodeState.IsRequirePARTimer && isEmpty(CFSCodeState[field])) {
        handleErrorCFSCodeState(field, true);
        isError = true;
      } else {
        handleErrorCFSCodeState(field, false);
      }
      return null;
    });
    return !isError;
  };

  const Agencychange = (multiSelected) => {
    setIsChange(true);
    setMultiSelected({
      optionSelected: multiSelected
    });
    const id = []
    const name = []
    if (multiSelected) {
      multiSelected.map((item, i) => {
        id.push(item.value);
        name.push(item.label)
      })
      setCFSCodeState({
        ...CFSCodeState,
        'agencyCode': id.toString(), 'MultiAgency_Name': name.toString()
      })
    }
  }

  const onSave = async () => {
    if (!validateCFSCodeForm()) return
    const isUpdate = !!CFSCodeState?.CallforServiceID;
    setIsDisabled(true);

    const result = listData?.find(item => {
      if (item.CFSCODE) {
        const code = CFSCodeState?.cfsCode?.toLowerCase();
        return code && item.CFSCODE.toLowerCase() === code;
      }
      return false;
    });
    const result1 = listData?.find(item => {
      if (item.CFSCodeDescription) {
        const description = CFSCodeState?.cfsCodeDesc?.toLowerCase();
        return description && item.CFSCodeDescription.toLowerCase() === description;
      }
      return false;
    });
    if ((result || result1) && !isUpdate) {
      if (result) {
        toastifyError('Code Already Exists');
      }
      if (result1) {
        toastifyError('Description Already Exists');
      }
    } else {

      const formdata = new FormData();
      // multiple file upload
      for (let i = 0; i < selectedFiles.length; i++) {
        formdata.append("File", selectedFiles[i]);
      }
      const val = {
        Action: isUpdate ? "UPDATE" : "INSERT",
        CallforServiceID: isUpdate ? CFSCodeState?.CallforServiceID : undefined,
        CFSCODE: CFSCodeState?.cfsCode,
        CFSCodeDescription: CFSCodeState?.cfsCodeDesc,
        Prioritycode: CFSCodeState?.priorityCode?.PriorityID,
        AlrmLevel: CFSCodeState?.alarmLevel?.value,
        LAW: CFSCodeState?.cfsLaw ? 1 : 0,
        FIRE: CFSCodeState?.cfsFire ? 1 : 0,
        EmergencyMedicalService: CFSCodeState?.cfsEmergencyMedicalService ? 1 : 0,
        Other: CFSCodeState?.cfsOther ? 1 : 0,
        CaseRequired: CFSCodeState?.CaseRequired ? 1 : 0,
        IsRequirePARTimer: CFSCodeState?.IsRequirePARTimer ? 1 : 0,
        IsActive: CFSCodeState?.IsActive,
        CreatedByUserFK: isUpdate ? undefined : loginPinID,
        ModifiedByuserFk: isUpdate ? loginPinID : undefined,
        AgencyID: loginAgencyID,
        CheckInEvery: CFSCodeState?.minute || "",
        MultiAgency_Name: CFSCodeState?.MultiAgency_Name,
        AgencyCode: CFSCodeState?.agencyCode,
        Istrafficvehicle: CFSCodeState?.IsTrafficVehicle ? 1 : 0,
      };
      const values = JSON.stringify(val);
      formdata.append("Data", values);
      const response = await MasterTableListServices.insertCFS(formdata);
      if (response?.status === 200) {
        toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
        handelCancel();
        setIsUpdateAgency(!isUpdateAgency);
        refetch();
      }
      setIsDisabled(false);
    }
  };

  function handelSetEditData(data) {
    clearStateCFSCodeState();
    const val = { Action: "GetSingleData_CallforService", CallForServiceID: data?.CallforServiceID }
    fetchPostData('/CAD/MasterCallforServiceCode/GetCallforServiceCode', val).then((res) => {
      if (res) {
        setCFSCodeState({
          CallforServiceID: res[0]?.CallforServiceID,
          cfsCode: res[0]?.CFSCODE,
          cfsCodeDesc: res[0]?.CFSCodeDescription,
          priorityCode: res[0]?.PriorityID ? PriorityDrpData?.find((i) => i?.PriorityID === res[0]?.PriorityID) : "",
          alarmLevel: PriorityDrpData?.find((i) => i?.PriorityID == data?.AlrmLevel),
          cfsLaw: res[0]?.LAW,
          cfsFire: res[0]?.FIRE,
          cfsEmergencyMedicalService: res[0]?.EMERGENCYMEDICALSERVICE,
          cfsOther: res[0]?.OTHER,
          CaseRequired: res[0]?.CaseRequired ? 1 : 0,
          IsRequirePARTimer: res[0]?.IsRequirePARTimer ? 1 : 0,
          minute: res[0]?.IsRequirePARTimer ? res[0]?.CheckInEvery || "" : "",
          IsActive: res[0]?.IsActive,
          MultiAgency_Name: res[0]?.MultiAgency_Name,
          agencyCode: res[0]?.AgencyID,
          IsTrafficVehicle: res[0]?.Istrafficvehicle ? 1 : 0,
        })
        setSelectedFiles(res[0]?.Path ? [res[0]?.Path] : []);
        setMultiSelected({
          optionSelected: res[0]?.MultipleAgency ? changeArrayFormat(res[0]?.MultipleAgency
          ) : '',
        });
      }
      else { setCFSCodeState({}) }
    })
  }

  const conditionalRowStyles = [
    {
      when: row => row?.CallforServiceID === CFSCodeState?.CallforServiceID,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#001f3fbd',
          color: 'white',
        },
      },
    }
  ];

  return (
    <>
      <div className='utilities-tab-content-main-container'>
        <div className='utilities-tab-content-form-container'>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 incident-tab ">
              <ul className="nav nav-tabs mb-1 pl-2 " id="myTab" role="tablist">
                <span className={`nav-item ${pageStatus === true ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(true); setSearchValue1(""); setSearchValue2(""); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === true ? 'Red' : '' }}>Active</span>
                <span className={`nav-item ${pageStatus === false ? 'active' : ''}`} onKeyDown={''} onClick={() => { setPageStatus(false); setSearchValue1(""); setSearchValue2(""); }} id="home-tab" data-bs-toggle="tab" data-bs-target="#" type="button" role="tab" aria-controls="home" aria-selected="true" style={{ color: pageStatus === false ? 'Red' : '' }}>InActive</span>
              </ul>
            </div>
            {
              pageStatus ?
                <>
                  <div className='utilities-tab-content-form-main'>
                    {/* line 1 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          CFS Code{errorCFSCodeState.cfsCode && isEmpty(CFSCodeState.cfsCode) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter CFS Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='CFS Code'
                          name="cfsCode"
                          onKeyDown={handleSpecialKeyDown}
                          maxLength={10}
                          value={CFSCodeState.cfsCode}
                          onChange={(e) => { handleCFSCodeState("cfsCode", e.target.value); setIsChange(true); }}
                        />
                      </div>
                      <div className="col-5 d-flex align-items-center justify-content-between">
                        <label
                          htmlFor=""
                          className="tab-form-label"
                          style={{ whiteSpace: 'nowrap', marginRight: '10px' }} // Ensures label stays on one line
                        >
                          CFS Code Description
                          {errorCFSCodeState.cfsCodeDesc && isEmpty(CFSCodeState.cfsCodeDesc) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                              {"Enter Description"}
                            </p>
                          )}
                        </label>
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder="CFS Code Description"
                          name="cfsCodeDesc"
                          value={CFSCodeState.cfsCodeDesc}
                          onChange={(e) => { handleCFSCodeState("cfsCodeDesc", e.target.value); setIsChange(true); }}
                          style={{ flex: '1' }}
                        />
                      </div>
                    </div>
                    {/* line 2 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-start justify-content-end">
                        <label for="" className="tab-form-label" style={{ marginTop: "10px" }}>
                          Priority Code{errorCFSCodeState.priorityCode && (isEmpty(CFSCodeState.priorityCode) || CFSCodeState.priorityCode === null) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Priority Code"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-start justify-content-end">
                        <Select
                          isClearable
                          options={PriorityDrpData}
                          placeholder="Select..."
                          styles={coloredStyle_Select}
                          getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                          getOptionValue={(v) => v?.PriorityCode}
                          formatOptionLabel={(option, { context }) => {
                            return context === 'menu'
                              ? `${option?.PriorityCode} | ${option?.Description}`
                              : option?.PriorityCode;
                          }}
                          className="w-100"
                          name="priorityCode"
                          value={CFSCodeState.priorityCode ? CFSCodeState.priorityCode : ""}
                          onChange={(e) => { handleCFSCodeState("priorityCode", e); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-start justify-content-end">
                        <label for="" className="tab-form-label" style={{ marginTop: "10px" }}>
                          Alarm Level
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-start justify-content-end" style={{ marginLeft: "13px" }}>
                        <Select
                          isClearable
                          placeholder="Select..."
                          styles={colorLessStyle_Select}
                          className="w-100"
                          name="alarmLevel"
                          isDisabled
                          value={CFSCodeState.alarmLevel}
                          onChange={(e) => { handleCFSCodeState("alarmLevel", e); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div>
                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Agency
                        </label>
                      </div>
                      <div className="col-3 mt-1">
                        <SelectBox
                          options={agencyCodeDropDown}
                          isDisabled
                          closeMenuOnSelect={false}
                          hideSelectedOptions={true}
                          onChange={Agencychange}
                          allowSelectAll={true}
                          value={multiSelected.optionSelected}
                        />
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-8'>
                        {/* line 3 */}
                        <div className="row">
                          <div className="col-2 offset-1 d-flex align-self-start justify-content-end">
                            <label for="" className="tab-form-label" style={{ marginTop: "10px", whiteSpace: 'nowrap', marginRight: '10px' }}>
                              Required Agency Types{errorCFSCodeState.agencyTypes && CFSCodeState.cfsLaw === false && CFSCodeState.cfsFire === false && CFSCodeState.cfsEmergencyMedicalService === false && CFSCodeState.cfsOther === false && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Agency Type"}</p>
                              )}
                            </label>
                          </div>
                          <div className="col-7 d-flex align-self-center justify-content-end">

                            <div className='agency-types-checkbox-container'>
                              {/* L : Law */}
                              <div className="agency-checkbox-item">
                                <input
                                  type="checkbox"
                                  name="cfsLaw"
                                  checked={CFSCodeState.cfsLaw}
                                  onChange={(e) => { handleCFSCodeState("cfsLaw", e.target.checked); setIsChange(true); }}
                                />
                                <div className="agency-checkbox-text-container tab-form-label">
                                  <span>L</span>
                                  <span>|</span>
                                  <span>Law</span>
                                </div>
                              </div>
                              {/* F : Fire */}
                              <div className="agency-checkbox-item ">
                                <input
                                  type="checkbox"
                                  name="cfsFire"
                                  checked={CFSCodeState.cfsFire}
                                  onChange={(e) => { handleCFSCodeState("cfsFire", e.target.checked); setIsChange(true); }}
                                />
                                <div className="agency-checkbox-text-container tab-form-label">
                                  <span>F</span>
                                  <span>|</span>
                                  <span>Fire</span>
                                </div>
                              </div>
                              {/* E : Emergency Medical Service */}
                              <div className="agency-checkbox-item">
                                <input
                                  type="checkbox"
                                  name="cfsEmergencyMedicalService"
                                  checked={CFSCodeState.cfsEmergencyMedicalService}
                                  onChange={(e) => { handleCFSCodeState("cfsEmergencyMedicalService", e.target.checked); setIsChange(true); }}
                                />
                                <div className="agency-checkbox-text-container tab-form-label">
                                  <span>E</span>
                                  <span>|</span>
                                  <span>Emergency Medical Service </span>
                                </div>
                              </div>
                              {/* O : Other */}
                              <div className="agency-checkbox-item">
                                <input
                                  type="checkbox"
                                  name="cfsOther"
                                  checked={CFSCodeState.cfsOther}
                                  onChange={(e) => { handleCFSCodeState("cfsOther", e.target.checked); setIsChange(true); }}

                                />
                                <div className="agency-checkbox-text-container tab-form-label">
                                  <span>O</span>
                                  <span>|</span>
                                  <span>Other</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* line 4 */}
                        <div className="row">
                          <div className="col-2 offset-3 agency-checkbox-item mt-1">
                            <input
                              type="checkbox"
                              name="CaseRequired"
                              checked={CFSCodeState.CaseRequired}
                              onChange={(e) => { handleCFSCodeState("CaseRequired", e.target.checked); setIsChange(true); }}
                            />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span className='text-nowrap'>Generate RMS Incident#</span>
                            </div>
                          </div>
                          <div className="col-2 agency-checkbox-item mt-1">
                            <input
                              type="checkbox"
                              name="IsTrafficVehicle"
                              checked={CFSCodeState.IsTrafficVehicle}
                              onChange={(e) => { handleCFSCodeState("IsTrafficVehicle", e.target.checked); setIsChange(true); }}
                            />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>Is Traffic Vehicle</span>
                            </div>
                          </div>
                        </div>

                        {/* line 5 */}
                        <div className="row">
                          <div className="col-2 offset-3 agency-checkbox-item">
                            <input
                              type="checkbox"
                              name="IsRequirePARTimer"
                              checked={CFSCodeState.IsRequirePARTimer}
                              // onChange={(e) => { handleCFSCodeState("IsRequirePARTimer", e.target.checked); setIsChange(true); }}
                              onChange={(e) => {
                                handleCFSCodeState("IsRequirePARTimer", e.target.checked);
                                if (!e.target.checked) {
                                  handleCFSCodeState("minute", ""); // Clear the minute field when unchecked
                                }
                                setIsChange(true);
                              }}
                            />
                            <div className="agency-checkbox-text-container tab-form-label">
                              <span>Require PAR Timer</span>
                            </div>
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <label for="" className="tab-form-label">
                              Check-in Every {(errorCFSCodeState.minute && isEmpty(CFSCodeState.minute) && !!CFSCodeState.IsRequirePARTimer) && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Check-in Every"}</p>
                              )}
                            </label>
                          </div>
                          <div className="col-2 d-flex align-self-start justify-content-end" style={{ marginLeft: "13px" }}>
                            <input
                              type="text"
                              className="form-control py-1 new-input requiredColor"
                              placeholder="Minute"
                              name="minute"
                              value={CFSCodeState.minute}
                              onChange={(e) => { handleCFSCodeState("minute", e.target.value); setIsChange(true); }}
                              style={{ flex: '1', marginRight: "4px" }}
                              disabled={!CFSCodeState.IsRequirePARTimer}
                            />
                            <span> <label for="" className="tab-form-label">
                              Minute
                            </label></span>
                          </div>
                        </div>

                        {/*  Line 6 */}
                        <div className="tab-form-row">
                          <div className="col-2 offset-1 d-flex align-self-center justify-content-end">
                            <label htmlFor="UploadFile" className="tab-form-label">
                              Upload File
                            </label>
                          </div>
                          <div className="col-5 text-field">
                            <input
                              id="UploadFile"
                              type="file"
                              accept="image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, text/plain, video/mp4"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>
                      {/* File Preview Section */}
                      <div className="col-4 row">
                        <div className="col-12">
                          {renderFilePreview()}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
                :
                <>
                </>
            }
          </div>

        </div>

        <div className='utilities-tab-content-table-container'>
          <div className="row">
            <div className="col-5 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control"
                placeholder='Search By Code...'
                value={searchValue1}
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'CFSCODE', 'CFSCodeDescription')
                  setFilterListData(result)
                }}
              />
            </div>
            <div className="col-1 d-flex align-self-center justify-content-end">
              <Dropdown className='w-100'>
                <Dropdown.Toggle id="dropdown-basic" className='cad-sort-dropdown'>
                  <img src={SendIcon(filterTypeIdOption)} alt="" className='filter-icon mr-1' />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterTypeIdOption('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeIdOption('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeIdOption('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeIdOption('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeIdOption('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-5 d-flex align-self-center justify-content-end">
              <input
                type="text"
                className="form-control"
                placeholder='Search By Description...'
                value={searchValue2}
                onChange={(e) => {
                  setSearchValue2(e.target.value);
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'CFSCODE', 'CFSCodeDescription')
                  setFilterListData(result)
                }}
              />
            </div>
            <div className="col-1 d-flex align-self-center justify-content-end">
              <Dropdown className='w-100'>
                <Dropdown.Toggle id="dropdown-basic" className='cad-sort-dropdown'>
                  <img src={SendIcon(filterTypeDescOption)} alt="" className='filter-icon mr-1' />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setFilterTypeDescOption('Contains')}>Contains</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeDescOption('is equal to')}>is equal to</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeDescOption('is not equal to')}>is not equal to </Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeDescOption('Starts With')}>Starts With</Dropdown.Item>
                  <Dropdown.Item onClick={() => setFilterTypeDescOption('End with')}>End with</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="table-responsive">
            <DataTable
              dense
              columns={columns}
              data={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? filterListData : '' : ''}
              customStyles={tableCustomStyles}
              conditionalRowStyles={conditionalRowStyles}
              pagination
              responsive
              striped
              highlightOnHover
              fixedHeaderScrollHeight="360px"
              fixedHeader
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don't have permission to view data" : 'There are no data to display'}
              onRowClicked={(row) => {
                handelSetEditData(row);
              }}
            />
          </div>
          {pageStatus &&
            <div className="utilities-tab-content-button-container" >
              <button type="button" className="btn btn-sm btn-success" onClick={() => { handelCancel(); setIsUpdateAgency(!isUpdateAgency) }}>New</button>
              {/* {effectiveScreenPermission && ( */}
              <>
                {!CFSCodeState?.CallforServiceID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => onSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!CFSCodeState?.CallforServiceID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange || isDisabled}
                    onClick={() => onSave()}
                  >
                    Update
                  </button>
                ) : null}
              </>
              {/* )} */}
            </div>}
        </div>
      </div >
      <CADConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={handelActiveInactive} confirmType={confirmType} />

      {/* File Delete Confirmation Modal */}
      <CADConfirmModal
        showModal={showConfirmModal}
        setShowModal={setShowConfirmModal}
        handleConfirm={() => {
          removeFile(confirmParams.index, confirmParams.file);
          setShowConfirmModal(false);
        }}
        confirmType="Delete File"
        message="Are you sure you want to delete this file?"
      />
    </>
  );
};

export default CallForServiceCodeSection;