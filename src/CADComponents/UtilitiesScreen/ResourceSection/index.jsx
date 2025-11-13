import { useContext, useEffect, useState } from 'react';
import FormTitleSection from '../../Common/FormTitleSection'
import DataTable from 'react-data-table-component';
import Select from "react-select";
import Dropdown from 'react-bootstrap/Dropdown';
import { tableCustomStyles } from '../../../Components/Common/Utility';
import { coloredStyle_Select, colorLessStyle_Select } from '../../Utility/CustomStylesForReact';
import '../section.css';
import useObjState from '../../../CADHook/useObjState';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import { dropDownDataModel, isEmpty, isEmptyObject, compareStrings } from '../../../CADUtils/functions/common';
import { toastifyError, toastifySuccess } from '../../../Components/Common/AlertMsg';
import { useSelector, useDispatch } from 'react-redux';
import CADConfirmModal from '../../Common/CADConfirmModal';
import SelectBox from '../../../Components/Common/SelectBox';
import { getData_DropDown_Zone } from '../../../CADRedux/actions/DropDownsData';
import { fetchPostData } from '../../../Components/hooks/Api';
import { SearchFilter, SendIcon } from '../../Common/SearchFilter';
import { IncidentContext } from '../../../CADContext/Incident';

const ResourceSection = () => {
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
  const { getAllResourcesRefetch } = useContext(IncidentContext);
  const [filterTypeIdOption, setFilterTypeIdOption] = useState('Contains');
  const [filterTypeDescOption, setFilterTypeDescOption] = useState('Contains');
  const [pageStatus, setPageStatus] = useState(true);
  const [resourceId, setResourceId] = useState("")
  const [loginPinID, setLoginPinID] = useState(1);
  const [agencyCodeDropDown, setAgencyCodeDropDown] = useState([])
  const [primaryOfficerDropDown, setPrimaryOfficerDropDown] = useState([])
  const [resourceTypeDropDown, setResourceTypeDropDown] = useState([])
  const [shiftDropDown, setShiftDropDown] = useState([])
  const [searchValue1, setSearchValue1] = useState('');
  const [searchValue2, setSearchValue2] = useState('');
  const [zoneDropDown, setZoneDropDown] = useState([])
  const [isChange, setIsChange] = useState(false);
  const [loginAgencyID, setLoginAgencyID] = useState();
  const [stationCodeDropDown, setStationCodeDropDown] = useState([])
  const [filterListData, setFilterListData] = useState([]);
  const [listData, setListData] = useState([]);
  const [operatorData, setOperatorData] = useState([]);
  const [stationCodeTable, setStationCodeTable] = useState([]);
  const [officerUpdatedData, setOfficerUpdatedData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [confirmType, setConfirmType] = useState('');
  const [activeInactiveData, setActiveInactiveData] = useState({})
  const [isSuperAdmin, setIsSuperAdmin] = useState(0);
  const [isActive, setIsActive] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [multiSelected, setMultiSelected] = useState({
    optionSelected: null
  });
  const [isUpdateAgency, setIsUpdateAgency] = useState(false);
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [
    resourceState,
    setResourceState,
    handleResourceState,
    clearResourceState,
  ] = useObjState({
    agencyCode: "",
    agencyType: "",
    agencyType2: "",
    resource: "",
    resourceType: "",
    station: "",
    primaryOfficer: "",
    primaryOfficer2: "",
    hours24Resource: false,
    carResource: false,
    zone: "",
    dutyStatus: "offduty",
    shift: "",
    MultiAgency_Name: "",
    cfsLaw: false,
    cfsFire: false,
    cfsEmergencyMedicalService: false,
    cfsOther: false,
  });
  const [
    errorResourceState,
    ,
    handleErrorResourceState,
    clearStateResourceState,
  ] = useObjState({
    resource: false,
    resourceType: false,
    station: false,
    primaryOfficer: false,
    zone: false,
    shift: false,
    agencyTypes: false,
  });

  const getResourcesKey = `/CAD/MasterResource/GetResource/${parseInt(pageStatus)}`;
  const { data: getResourcesData, isSuccess, refetch, isError: isNoData } = useQuery(
    [getResourcesKey, {
      IsActive: pageStatus,
      AgencyID: loginAgencyID,
      IsSuperAdmin: isSuperAdmin,
      PINID: loginPinID,
    },],
    MasterTableListServices.getResources,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
    }
  );
  useEffect(() => {
    if (isSuccess && getResourcesData) {
      const data = JSON.parse(getResourcesData?.data?.data || [])
      setFilterListData(data?.Table)
      setListData(data?.Table)
      setEffectiveScreenPermission(data?.Table1?.[0]);
    } else {
      setFilterListData([])
      setListData([])
      setEffectiveScreenPermission();
    }
  }, [getResourcesData, isSuccess])

  const shiftDataKey = `/CAD/MasterResourceShift/GetData_Shift`;
  const { data: shiftData, isSuccess: isFetchShiftData } = useQuery(
    [shiftDataKey, { AgencyID: loginAgencyID },],
    MasterTableListServices.getShift,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID
    }
  );

  useEffect(() => {
    if (shiftData && isFetchShiftData) {
      const data = JSON.parse(shiftData?.data?.data);
      setShiftDropDown(data?.Table || [])
    }
  }, [shiftData, isFetchShiftData])
  const servicePayload = [
    resourceState?.cfsLaw ? '1' : '',
    resourceState?.cfsFire ? '2' : '',
    resourceState?.cfsEmergencyMedicalService ? '3' : '',
    resourceState?.cfsOther ? '4' : ''
  ].filter(Boolean).join(',')

  const stationCodeKey = `/CAD/MasterStationCode/GetData_DropDown_StationCode/${loginAgencyID}`;
  const { data: stationCodeData, isSuccess: isFetchStationCode } = useQuery(
    [stationCodeKey, {
      AgencyID: loginAgencyID,
      CFSDetails: servicePayload,
    },],
    MasterTableListServices.getData_DropDown_StationCode,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID && !!servicePayload,
    }
  );
  const stationCodeTableKey = `/CAD/MasterStationCode/GetData_DropDown_StationCode/${loginAgencyID}`;
  const { data: stationCodeTableData, isSuccess: isFetchStationCodeTable } = useQuery(
    [stationCodeTableKey, {
      AgencyID: loginAgencyID,
    },],
    MasterTableListServices.getData_DropDown_StationCode,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID && !!servicePayload,
    }
  );

  useEffect(() => {
    if (stationCodeData && isFetchStationCode) {
      const data = JSON.parse(stationCodeData?.data?.data);
      setStationCodeDropDown(data?.Table || [])
    }
  }, [stationCodeData, isFetchStationCode])

  useEffect(() => {
    if (stationCodeTableData && isFetchStationCodeTable) {
      const data = JSON.parse(stationCodeTableData?.data?.data);
      setStationCodeTable(data?.Table || [])
    }
  }, [stationCodeTableData, isFetchStationCodeTable])

  useEffect(() => {
    if (shiftData && isFetchShiftData) {
      const data = JSON.parse(shiftData?.data?.data);
      setShiftDropDown(data?.Table)
    }
  }, [shiftData, isFetchShiftData])

  const GetResourceTypeKey = `/CAD/MasterResourceType/GetData_DropDown_ResourceType/${loginAgencyID}`;
  const { data: resourceTypeData, isSuccess: isResourceTypeData } = useQuery(
    [GetResourceTypeKey, { AgencyID: loginAgencyID },],
    MasterTableListServices.getData_DropDown_ResourceType,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
    }
  );

  useEffect(() => {
    if (resourceTypeData && isResourceTypeData) {
      const data = JSON.parse(resourceTypeData?.data?.data);
      setResourceTypeDropDown(data?.Table || [])
    }
  }, [resourceTypeData, isResourceTypeData])

  const getOperatorKey = `/CAD/Operator_search/Operator`;
  const { data: getOperatorData, isSuccess: isFetchGetOperator } = useQuery(
    [getOperatorKey, {
      "AgencyID": loginAgencyID,
    },],
    MasterTableListServices.getOperator,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID
    }
  );

  const GetPrimaryOfficerKey = `CAD/MasterPrimaryOfficer/PrimaryOfficer`;
  const { data: getPrimaryOfficerData, isSuccess: isFetchPrimaryOfficers, refetch: refetchPrimaryOfficers } = useQuery(
    [GetPrimaryOfficerKey, { AgencyID: loginAgencyID },],
    MasterTableListServices.getPrimaryOfficer,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID
    }
  );

  useEffect(() => {
    if (getPrimaryOfficerData && isFetchPrimaryOfficers) {
      const data = JSON.parse(getPrimaryOfficerData?.data?.data);
      setPrimaryOfficerDropDown(data?.Table || [])
    }
  }, [getPrimaryOfficerData, isFetchPrimaryOfficers])

  useEffect(() => {
    if (getOperatorData && isFetchGetOperator) {
      const data = JSON.parse(getOperatorData?.data?.data);
      setOperatorData(data?.Table || [])
    }
  }, [getOperatorData, isFetchGetOperator])

  const getAgencyCodeKey = `/CAD/MasterAgency/MasterAgencyCode`;
  const { data: getAgencyCodeData, isSuccess: isFetchAgencyCode } = useQuery(
    [getAgencyCodeKey, {},],
    MasterTableListServices.getAgencyCode,
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setIsSuperAdmin(localStoreData?.IsSuperadmin);
      setLoginAgencyID(localStoreData?.AgencyID)
      if (localStoreData?.AgencyID && agencyCodeDropDown?.length > 0) {
        const agency = agencyCodeDropDown?.find((i => i?.value.toString() === localStoreData?.AgencyID));
        setMultiSelected({
          optionSelected: agency
        });
        setResourceState({
          ...resourceState,
          'agencyCode': agency.value.toString(), 'MultiAgency_Name': agency.label.toString()
        })
      }
      if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
    }
  }, [localStoreData, agencyCodeDropDown, isUpdateAgency]);

  const changeArrayFormat = (data) => {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.AgencyID, label: sponsor.Agency_Name })
    )
    return result
  }

  useEffect(() => {
    if (isFetchAgencyCode && getAgencyCodeData) {
      const data = JSON.parse(getAgencyCodeData?.data?.data);
      setAgencyCodeDropDown(changeArrayFormat(data?.Table) || [])
    }
  }, [isFetchAgencyCode, getAgencyCodeData]);

  const getByIdResourcesKey = `/CAD/MasterResource/GetSingleData_Resource/${resourceId}`;
  const { data: getByIdResourcesData, isSuccess: isFetchGetByIdResource, refetch: refetchResourceById } = useQuery(
    [getByIdResourcesKey, { ResourceID: resourceId, AgencyID: loginAgencyID },],
    MasterTableListServices.getSingleData_Resource,
    {
      refetchOnWindowFocus: false,
      enabled: !!resourceId && !!loginAgencyID
    }
  );

  async function handelActiveInactive() {
    const data = {
      ResourceID: activeInactiveData?.ResourceID,
      DeletedByUserFK: loginPinID,
      IsActive: isActive,
      AgencyID: loginAgencyID,
    }
    const response = await MasterTableListServices.changeStatusMasterResource(data);
    if (response?.status === 200) {
      const data = JSON.parse(response?.data?.data)?.Table?.[0];
      toastifySuccess(data?.Message);
      refetch();
    }
    setShowModal(false);
  }

  useEffect(() => {
    if (ZoneDrpData) {
      setZoneDropDown(dropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription"));
    }
  }, [ZoneDrpData]);

  const columns = [
    {
      name: 'Unit #',
      selector: row => row?.ResourceNumber,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceNumber, rowB.ResourceNumber),
      style: {
        position: "static",
      },
    },
    {
      name: 'Unit Type',
      selector: row => row?.ResourceTypeCode,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
      sortable: true,
      width: "30%",
      style: {
        position: "static",
      },
    },
    {
      name: 'Station Code',
      selector: row =>
        stationCodeTable?.find((i) => i?.stationID === row?.StationID)?.stationCode,
      sortable: true,
      style: {
        position: "static",
      },
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

  const validateHandel = () => {
    let isError = false;
    const keys = Object.keys(errorResourceState);
    keys.map((field) => {
      if (field === "resource" && isEmpty(resourceState[field])) {
        handleErrorResourceState(field, true);
        isError = true;
      } else if (field === "resourceType" && isEmptyObject(resourceState[field])) {
        handleErrorResourceState(field, true);
        isError = true;
      } else if (field === "agencyTypes" && (resourceState.cfsLaw === false && resourceState.cfsFire === false && resourceState.cfsEmergencyMedicalService === false && resourceState.cfsOther === false)) {
        handleErrorResourceState(field, true);
        isError = true;
      } else if (field === "primaryOfficer" && isEmptyObject(resourceState?.primaryOfficer) && (resourceState?.dutyStatus === "onduty" || resourceState?.hours24Resource)) {
        handleErrorResourceState(field, true);
        isError = true;
      } else {
        handleErrorResourceState(field, false);
      }
      return null;
    });
    return !isError;
  };

  function handelCancel() {
    clearStateResourceState();
    clearResourceState();
    setResourceId("");
    setIsChange(false);
    setMultiSelected({
      optionSelected: null
    });
    setOfficerUpdatedData([]);
  }

  async function handleSave() {
    if (!validateHandel()) return
    setIsDisabled(true);
    const result = listData?.find(item => {
      if (item.ResourceNumber) {
        const code = resourceState?.resource?.toLowerCase();
        return code && item.ResourceNumber.toLowerCase() === code;
      }
      return false;
    });
    if (result && !resourceState?.ResourceID) {
      if (result) {
        toastifyError('Code Already Exists');
      }
    } else {
      const officerIDs = [
        resourceState?.primaryOfficer?.PINID,
        resourceState?.primaryOfficer2?.PINID,
      ].filter(Boolean).join(',');
      const commonData = {
        ResourceNumber: resourceState?.resource,
        ResourceTypeID: resourceState?.resourceType?.ResourceTypeID || "",
        StationID: resourceState?.station?.stationID || "",
        OfficerIDs: officerIDs,
        Is24HourResource: resourceState?.hours24Resource ? 1 : 0,
        IsCarResource: resourceState?.carResource ? 1 : 0,
        ResourceZone: resourceState?.zone?.value || "",
        OnOffDuty: resourceState?.hours24Resource ? "" : resourceState?.dutyStatus === "onduty" ? 1 : 0,
        ShiftID: resourceState?.hours24Resource ? "" : resourceState?.shift?.ShiftId || "",
        ZoneID: resourceState?.zone?.value || "",
        AgencyID: resourceState?.agencyCode || "",
        MultiAgency_Name: resourceState?.MultiAgency_Name || "",
        CFSL: resourceState?.cfsLaw ? 1 : 0,
        CFSF: resourceState?.cfsFire ? 1 : 0,
        CFSE: resourceState?.cfsEmergencyMedicalService ? 1 : 0,
        OTHER: resourceState?.cfsOther ? 1 : 0,
      };
      const data = resourceState?.ResourceID
        ? {
          ...commonData,
          ResourceID: resourceState?.ResourceID,
          ModifiedByUserFK: loginPinID
        }
        : {
          ...commonData,
          CreatedByUserFK: loginPinID
        };
      const response = await MasterTableListServices.insertResource(data);
      if (response?.status === 200) {
        const parsedData = JSON.parse(response?.data?.data);
        const IsAlreadyAssigned = parsedData?.Table[0]?.IsAlreadyAssigned;
        IsAlreadyAssigned ? toastifySuccess("Unit is already assigned to incident.") :
          resourceState?.ResourceID
            ? toastifySuccess("Data Updated Successfully")
            : toastifySuccess("Data Saved Successfully");
        clearResourceState();
        refetchPrimaryOfficers();
        refetchResourceById();
        setResourceId("");
        refetch();
        getAllResourcesRefetch();
      }
      handelCancel()
      setIsUpdateAgency(!isUpdateAgency);
    } setIsDisabled(false);
  }

  const getFilteredOptions = (selectedKey) => {
    const selectedOfficers = [
      resourceState?.primaryOfficer,
      resourceState?.primaryOfficer2,
      resourceState?.primaryOfficer3,
      resourceState?.primaryOfficer4,
    ].filter(Boolean);

    return resourceId
      ? officerUpdatedData.filter(
        (officer) =>
          !selectedOfficers.some((selected) => selected?.PINID === officer?.PINID) ||
          selectedKey?.PINID === officer?.PINID
      )
      : primaryOfficerDropDown.filter(
        (officer) =>
          !selectedOfficers.some((selected) => selected?.PINID === officer?.PINID) ||
          selectedKey?.PINID === officer?.PINID
      );
  };

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

  const conditionalRowStyles = [
    {
      when: (row) => row.ResourceID === resourceId,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#001f3fbd',
          color: 'white',
        },
      },
    },
  ];

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
      setResourceState({
        ...resourceState,
        'agencyCode': id.toString(), 'MultiAgency_Name': name.toString()
      })
    }
  }

  function handelSetEditData(resourceId) {
    const val = { ResourceID: resourceId, AgencyID: loginAgencyID, }
    fetchPostData('/CAD/MasterResource/GetSingleData_Resource', val).then((res) => {
      if (res) {
        const data = res[0];
        const officerIDsArray = data?.OfficerIDs ? data?.OfficerIDs.split(',').map(Number) : [];

        const updatedOfficerData = officerIDsArray
          .map((id) => operatorData?.find((i) => i?.PINID === id))
          .filter(Boolean);

        setResourceState({
          ResourceID: data?.ResourceID,
          agencyCode: agencyCodeDropDown?.find((i) => i?.AgencyID === data?.AgencyID) || "",
          agencyType: "",
          agencyType2: "",
          resource: data?.ResourceNumber || "",
          resourceType: resourceTypeDropDown?.find((i) => i?.ResourceTypeID === data?.ResourceTypeID) || "",
          station: stationCodeDropDown?.find((i) => i?.stationID === data?.StationID) || "",
          primaryOfficer: updatedOfficerData[0] || "",
          primaryOfficer2: updatedOfficerData[1] || "",
          hours24Resource: data?.Is24HourResource || false,
          carResource: data?.IsCarResource || false,
          zone: zoneDropDown?.find((i) => i?.value === data?.ZoneID) || "",
          dutyStatus: data?.OnOffDuty ? "onduty" : "offduty",
          shift: shiftDropDown?.find((i) => i?.ShiftId === data?.ShiftID) || "",
          agencyCode: data?.AgencyID,
          MultiAgency_Name: data?.MultiAgency_Name,
          cfsLaw: data?.LAW,
          cfsFire: data?.FIRE,
          cfsEmergencyMedicalService: data?.EMERGENCY,
          cfsOther: data?.OTHER,
        });

        setMultiSelected({
          optionSelected: data?.MultipleAgency ? changeArrayFormat(data?.MultipleAgency) : '',
        });

        const mergedOfficerData = [
          ...updatedOfficerData,
          ...primaryOfficerDropDown
        ];
        setOfficerUpdatedData(mergedOfficerData);
      }
    })
  }

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
                          Agency
                        </label>
                      </div>
                      <div className="col-6">
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
                    {/* line 2 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Unit Type{errorResourceState.resourceType && isEmptyObject(resourceState.resourceType) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Unit Type"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <Select
                          isClearable
                          styles={coloredStyle_Select}
                          placeholder="Select"
                          options={resourceTypeDropDown}
                          value={resourceState?.resourceType}
                          getOptionLabel={(v) => v?.ResourceTypeCode + " | " + v?.ResourceTypeDescription}
                          getOptionValue={(v) => v?.ResourceTypeID}
                          formatOptionLabel={(option, { context }) => {
                            return context === 'menu'
                              ? `${option?.ResourceTypeCode} | ${option?.ResourceTypeDescription}`
                              : option?.ResourceTypeCode;
                          }}
                          onChange={(e) => { handleResourceState("resourceType", e); setIsChange(true); }}
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
                          Unit #{errorResourceState.resource && isEmpty(resourceState.resource) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Unit #"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <input
                          type="text"
                          className="form-control py-1 new-input requiredColor"
                          placeholder='Unit #'
                          maxLength={7}
                          onKeyDown={handleSpecialKeyDown}
                          value={resourceState?.resource}
                          onChange={(e) => { handleResourceState("resource", e.target.value); setIsChange(true); }}
                        />
                      </div>

                      <div className="col-1 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Station Code
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <Select
                          isClearable
                          styles={colorLessStyle_Select}
                          placeholder="Select"
                          options={stationCodeDropDown}
                          isDisabled={!resourceState?.cfsLaw && !resourceState?.cfsFire && !resourceState?.cfsEmergencyMedicalService && !resourceState?.cfsOther}
                          getOptionLabel={(v) => v?.stationCode + " | " + v?.description}
                          getOptionValue={(v) => v?.stationID}
                          formatOptionLabel={(option, { context }) => {
                            return context === 'menu'
                              ? `${option?.stationCode} | ${option?.description}`
                              : option?.stationCode;
                          }}
                          value={resourceState?.station}
                          onChange={(e) => { handleResourceState("station", e); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div>
                    </div>
                    {/* line 3 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Primary Officer{errorResourceState.primaryOfficer && isEmptyObject(resourceState.primaryOfficer) && (
                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Primary Officers"}</p>
                          )}
                        </label>
                      </div>
                      <div className="col-3 d-flex align-self-center justify-content-end">
                        <Select
                          styles={resourceState?.dutyStatus === "offduty" && !resourceState?.hours24Resource ? colorLessStyle_Select : coloredStyle_Select}
                          placeholder="Select"
                          options={getFilteredOptions(resourceState?.primaryOfficer)}
                          getOptionLabel={(v) => v?.FirstName + " " + v?.LastName + " | " + v?.PIN}
                          getOptionValue={(v) => v?.PINID}
                          value={resourceState?.primaryOfficer}
                          isClearable
                          isDisabled={resourceState?.dutyStatus === "offduty" && !resourceState?.hours24Resource}
                          onChange={(e) => { handleResourceState("primaryOfficer", e); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div>
                      <div className="col-3 d-flex align-self-center justify-content-end">
                        <Select
                          styles={colorLessStyle_Select}
                          placeholder="Select"
                          options={getFilteredOptions(resourceState?.primaryOfficer2)}
                          getOptionLabel={(v) => v?.FirstName + " " + v?.LastName + " | " + v?.PIN}
                          getOptionValue={(v) => v?.PINID}
                          isClearable
                          isDisabled={resourceState?.dutyStatus === "offduty" && !resourceState?.hours24Resource}
                          value={resourceState?.primaryOfficer2}
                          onChange={(e) => { handleResourceState("primaryOfficer2", e); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div>
                    </div>
                    {/* line 5 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        {/* Empty Space */}
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-start" style={{ gap: '3.5px' }}>
                        <input type="checkbox" className='tab-form-label' checked={resourceState?.hours24Resource}
                          onChange={(e) => {
                            if (e.target.checked) { handleResourceState("hours24Resource", e.target.checked); setIsChange(true); } else {
                              handleResourceState("primaryOfficer2", ""); handleResourceState("primaryOfficer", ""); setIsChange(true);
                              handleResourceState("hours24Resource", e.target.checked);
                            }
                          }} /><span className='tab-form-label'>24 Hours Unit</span>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-start" style={{ gap: '3.5px' }}>
                        <input type="checkbox" className='tab-form-label' checked={resourceState?.carResource} onChange={(e) => { handleResourceState("carResource", e.target.checked); setIsChange(true); }} /><span className='tab-form-label'>Car Unit</span>
                      </div>
                    </div>
                    {/* line 6 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-start justify-content-end">
                        <label for="" className="tab-form-label" style={{ marginTop: "10px", whiteSpace: 'nowrap', marginRight: '10px' }}>
                          Required Agency Types{errorResourceState.agencyTypes && resourceState.cfsLaw === false && resourceState.cfsFire === false && resourceState.cfsEmergencyMedicalService === false && resourceState.cfsOther === false && (
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
                              checked={resourceState.cfsLaw}
                              onChange={(e) => { handleResourceState("cfsLaw", e.target.checked); setIsChange(true); }}
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
                              checked={resourceState.cfsFire}
                              onChange={(e) => { handleResourceState("cfsFire", e.target.checked); setIsChange(true); }}
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
                              checked={resourceState.cfsEmergencyMedicalService}
                              onChange={(e) => { handleResourceState("cfsEmergencyMedicalService", e.target.checked); setIsChange(true); }}
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
                              checked={resourceState.cfsOther}
                              onChange={(e) => { handleResourceState("cfsOther", e.target.checked); setIsChange(true); }}

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
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <label for="" className="tab-form-label">
                          Zone Code
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <Select
                          styles={colorLessStyle_Select}
                          placeholder="Select"
                          options={zoneDropDown}
                          isClearable
                          value={resourceState?.zone}
                          onChange={(e) => { handleResourceState("zone", e); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
                      </div>
                    </div>

                    <FormTitleSection title="On / Off Duty Status" />

                    {/* line 7 */}
                    <div className="row">
                      <div className="col-2 d-flex align-self-center justify-content-end">
                      </div>
                      <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                        <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                          <input type="radio" id="offduty" value="offduty" checked={resourceState?.dutyStatus === 'offduty'} disabled={resourceState?.hours24Resource} onChange={(e) => { handleResourceState("dutyStatus", e.target.value); handleResourceState("shift", ""); handleResourceState("primaryOfficer2", ""); handleResourceState("primaryOfficer", ""); setIsChange(true); }} />
                          <label for="offduty" className='tab-form-label' style={{ margin: '0', }}>Off Duty</label>
                        </div>
                      </div>
                      <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                        <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                          <input type="radio" id="onduty" value="onduty" checked={resourceState?.dutyStatus === 'onduty'} disabled={resourceState?.hours24Resource} onChange={(e) => {
                            handleResourceState("dutyStatus", e.target.value); setIsChange(true);
                          }} />
                          <label for="onduty" className='tab-form-label' style={{ margin: '0', }}>On Duty</label>
                        </div>
                      </div>
                      <div className="d-flex align-self-center justify-content-end" style={{ width: '50px' }}>
                        <label for="" className="tab-form-label text-nowrap">
                          Shift Code
                        </label>
                      </div>
                      <div className="col-2 d-flex align-self-center justify-content-end">
                        <Select
                          isClearable
                          styles={colorLessStyle_Select}
                          placeholder="Select"
                          getOptionLabel={(v) => v?.ShiftCode + " | " + v?.ShiftDescription}
                          getOptionValue={(v) => v?.ShiftId}
                          formatOptionLabel={(option, { context }) => {
                            return context === 'menu'
                              ? `${option?.ShiftCode} | ${option?.ShiftDescription}`
                              : option?.ShiftCode;
                          }}
                          options={shiftDropDown}
                          isDisabled={resourceState?.dutyStatus === "offduty" || resourceState?.hours24Resource}
                          value={resourceState?.shift}
                          onChange={(e) => { handleResourceState("shift", e); setIsChange(true); }}
                          onInputChange={(inputValue, actionMeta) => {
                            if (inputValue.length > 12) {
                              return inputValue.slice(0, 12);
                            }
                            return inputValue;
                          }}
                        />
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
                placeholder='Search By Unit...'
                value={searchValue1}
                onChange={(e) => {
                  setSearchValue1(e.target.value);
                  const result = SearchFilter(listData, e.target.value, searchValue2, filterTypeIdOption, 'ResourceNumber', 'ResourceTypeCode')
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
                placeholder='Search By Unit Type...'
                value={searchValue2}
                onChange={(e) => {
                  setSearchValue2(e.target.value);
                  const result = SearchFilter(listData, searchValue1, e.target.value, filterTypeDescOption, 'ResourceNumber', 'ResourceTypeCode')
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
          {isSuccess &&
            <div className="table-responsive">
              <DataTable
                dense
                columns={columns}
                data={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? filterListData : '' : ''}
                customStyles={tableCustomStyles}
                conditionalRowStyles={conditionalRowStyles}
                pagination
                responsive
                noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                striped
                fixedHeaderScrollHeight="360px"
                highlightOnHover
                fixedHeader
                onRowClicked={(row) => {
                  setIsChange(false);
                  setResourceId(row?.ResourceID);
                  handelSetEditData(row?.ResourceID);
                }}
              />
            </div>}

          {pageStatus && <div className="utilities-tab-content-button-container" >
            <button type="button" onClick={() => { handelCancel(); setIsUpdateAgency(!isUpdateAgency); }} className="btn btn-sm btn-success">New</button>
            {effectiveScreenPermission && (
              <>
                {effectiveScreenPermission.AddOK && !resourceState?.ResourceID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange}
                    onClick={() => handleSave()}
                  >
                    Save
                  </button>
                ) : effectiveScreenPermission.ChangeOK && !!resourceState?.ResourceID ? (
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    disabled={!isChange || isDisabled}
                    onClick={() => handleSave()}
                  >
                    Update
                  </button>
                ) : null}
              </>
            )}
          </div>}
        </div>
      </div>
      <CADConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={handelActiveInactive} confirmType={confirmType} />
    </>
  );
};

export default ResourceSection;