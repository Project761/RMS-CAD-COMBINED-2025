import { memo, useCallback, useContext, useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { dropDownDataModel, isEmptyObject } from "../../CADUtils/functions/common";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import MonitorServices from "../../CADServices/APIs/monitor";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import useArrState from "../../CADHook/useArrState";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { IncidentContext } from "../../CADContext/Incident";
import { getData_DropDown_Operator, getData_DropDown_Zone } from "../../CADRedux/actions/DropDownsData";
import { colourStyles, customStylesWithOutColorNew } from "../Utility/CustomStylesForReact";

const OnOffDutyModal = (props) => {
  const defaultRow = {
    resource: null,
    shift: null,
    zone: null,
    resourceType: null,
    primaryOfficer: null,
    primaryOfficerTo: null,
    isDisabledResource: false,
    isDisabledType: false,
  };

  const { openOnOffDutyModal, setOnOffDutyModal } = props;
  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);
  const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
  const { resourceRefetch, incidentRefetch, resourceData: resources } = useContext(IncidentContext);
  const [loginAgencyID, setLoginAgencyID] = useState();
  const [zoneDropDown, setZoneDropDown] = useState([])
  const [primaryOfficerDropDown, setPrimaryOfficerDropDown] = useState([])
  const [shiftDropDown, setShiftDropDown] = useState([])
  const [resourceTypeListData, setResourceTypeListData] = useState([]);
  const [resourceData, setResourceData] = useState([])
  const [errors, setErrors] = useState([]);
  const [onOffStatus, setOnOffStatus] = useState("OnDuty")
  const [rowsState, setRowsState, addRowState, _updateRow, removeRow] = useArrState(
    []
  );

  // Extracted function to handle resource selection updates
  const handleResourceSelection = (selectedResource, updatedRow) => {
    if (selectedResource) {
      updatedRow.shift = shiftDropDown.find(shift => shift.ShiftId === selectedResource.ShiftID) || null;
      updatedRow.zone = zoneDropDown.find(zone => zone.value === selectedResource.ZoneID) || null;
      
      if (selectedResource?.OfficerIDs) {
        const [primaryOfficerID, primaryOfficerToID] = selectedResource?.OfficerIDs?.split(',').map(id => parseInt(id.trim()));
        updatedRow.primaryOfficer = OperatorDrpData?.find(officer => officer?.PINID === primaryOfficerID) || null;
        updatedRow.primaryOfficerTo = OperatorDrpData?.find(officer => officer?.PINID === primaryOfficerToID) || null;
      }
    } else {
      updatedRow.shift = null;
      updatedRow.zone = null;
      updatedRow.primaryOfficer = null;
      updatedRow.primaryOfficerTo = null;
    }
    return updatedRow;
  };

  // Extracted function to handle resource type changes
  const handleResourceTypeChange = (updatedRow) => {
    updatedRow.resource = null;
    updatedRow.shift = null;
    updatedRow.zone = null;
    updatedRow.primaryOfficer = null;
    updatedRow.primaryOfficerTo = null;
    return updatedRow;
  };

  const getMasterOnOfDutyConfigurationKey = `/CAD/MasterOnOfDutyConfiguration/GetMasterOnOfDutyConfiguration`;
  const { data: getOnOffDutyConfData, isSuccess: isFetchGetOnOffDutyConf, refetch: refetchOnOffDuty } = useQuery(
    [getMasterOnOfDutyConfigurationKey, { AgencyID: loginAgencyID },],
    MasterTableListServices.getMasterOnOfDutyConfiguration,
    {
      refetchOnWindowFocus: false,
      enabled: !!openOnOffDutyModal
    }
  );

  useEffect(() => {
    if (getOnOffDutyConfData && isFetchGetOnOffDutyConf) {
      const data = JSON.parse(getOnOffDutyConfData?.data?.data);
      setRowsState(Array(data?.Table[0]?.OnOfDutyconfigurationNO).fill(defaultRow))
    }
  }, [openOnOffDutyModal, getOnOffDutyConfData, isFetchGetOnOffDutyConf])

  const getResourcesKey = `/CAD/MonitorOnOffDuty/GetOnOffDuty/${onOffStatus === "OnDuty" ? 1 : 0}`;
  const { data: getResourcesData, isSuccess, refetch } = useQuery(
    [getResourcesKey, { OnOffDuty: onOffStatus === "OnDuty" ? 1 : 0, AgencyID: loginAgencyID, },],
    MonitorServices.getOnOffDuty,
    {
      refetchOnWindowFocus: false,
      enabled: !!openOnOffDutyModal
    }
  );

  useEffect(() => {
    if (isSuccess && getResourcesData) {
      const data = JSON.parse(getResourcesData?.data?.data || [])?.Table
      setResourceData(data)
    } else {
      setResourceData([])
    }
  }, [getResourcesData, isSuccess, onOffStatus])

  const GetResourceTypeKey = `/CAD/MasterResourceType/GetData_DropDown_ResourceType/${loginAgencyID}`;
  const { data: resourceTypeData, isSuccess: isFetchResourceTypeList } = useQuery(
    [GetResourceTypeKey, { AgencyID: loginAgencyID },],
    MasterTableListServices.getData_DropDown_ResourceType,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
      retry: 0
    }
  );

  useEffect(() => {
    if (isFetchResourceTypeList && resourceTypeData) {
      const res = JSON.parse(resourceTypeData?.data?.data);
      const data = res?.Table
      setResourceTypeListData(data || [])
    } else {
      setResourceTypeListData([])
    }
  }, [isFetchResourceTypeList, resourceTypeData])

  const shiftDataKey = `/CAD/MasterResourceShift/GetData_Shift`;
  const { data: shiftData, isSuccess: isFetchShiftData } = useQuery(
    [shiftDataKey, { AgencyID: loginAgencyID },],
    MasterTableListServices.getShift,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID
    }
  );

  const GetPrimaryOfficerKey = `CAD/MasterPrimaryOfficer/PrimaryOfficer`;
  const { data: getPrimaryOfficerData, isSuccess: isFetchPrimaryOfficers } = useQuery(
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

  // Extracted function to create row data for off duty status
  const createOffDutyRow = (item) => {
    const selectedResource = resourceData?.find(res => res.ResourceID === item?.ResourceID);
    const [primaryOfficerID, primaryOfficerToID] =
      (selectedResource?.OfficerIDs || "")
        .split(',')
        .map(id => parseInt(id.trim()));

    return {
      resource: selectedResource,
      shift: shiftDropDown?.find(shift => shift.ShiftId === selectedResource?.ShiftID) || null,
      zone: zoneDropDown?.find(zone => zone.value === selectedResource?.ZoneID) || null,
      resourceType: resourceTypeListData?.find((i) => i?.ResourceTypeID === item?.ResourceTypeID),
      primaryOfficer: OperatorDrpData?.find(officer => officer?.PINID === primaryOfficerID) || null,
      primaryOfficerTo: OperatorDrpData?.find(officer => officer?.PINID === primaryOfficerToID) || null,
      isDisabledType: item?.ResourceTypeID ? true : false,
      isDisabledResource: selectedResource ? true : false
    };
  };

  useEffect(() => {
    if (onOffStatus === "OffDuty") {
      const available = resources.filter(item => item.Status === "AV" && item?.Is24HourResource !== true);
      setErrors([]);
      const updatedRows = available.map(createOffDutyRow);
      setRowsState(updatedRows);
    }
  }, [onOffStatus, primaryOfficerDropDown, resourceTypeData, resourceData, resources, setRowsState, shiftDropDown, zoneDropDown]);

  function handelAdd() {
    addRowState({
      resource: null,
      shift: null,
      zone: null,
      resourceType: null,
      primaryOfficer: null,
      primaryOfficerTo: null,
    })
  }

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID)
      dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
      if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
    }
  }, [localStoreData]);

  useEffect(() => {
    if (ZoneDrpData) {
      setZoneDropDown(dropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription"));
    }
  }, [ZoneDrpData]);

  useEffect(() => {
    if (shiftData && isFetchShiftData) {
      const data = JSON.parse(shiftData?.data?.data);
      setShiftDropDown(data?.Table || [])
    }
  }, [shiftData, isFetchShiftData])

  const updateRowState = (rowIndex, key, value) => {
    setRowsState((prevState) => {
      const updatedRows = prevState.map((row, index) => {
        if (index !== rowIndex) {
          return row;
        }

        const updatedRow = { ...row, [key]: value };
        
        if (key === 'resource') {
          const selectedResource = resourceData.find(res => res.ResourceID === value?.ResourceID);
          return handleResourceSelection(selectedResource, updatedRow);
        }
        
        if (key === 'resourceType' && !value) {
          return handleResourceTypeChange(updatedRow);
        }
        
        return updatedRow;
      });
      return updatedRows;
    });
  };

  const filterOptionsPersonnel = (options, selectedValues, rowKey) => {
    return options.filter((option) => !selectedValues.includes(option[rowKey]));
  };

  const getSelectedValuesPersonnel = (key) => {
    return rowsState.reduce((acc, row) => {
      if (row[key]) {
        acc.push(row[key]?.PINID);
      }
      return acc;
    }, []);
  };

  const getSelectedResources = () => {
    return rowsState.reduce((acc, row) => {
      if (row.resource) {
        acc.push(row.resource.ResourceID);
      }
      return acc;
    }, []);
  };

  const validateRowFields = (values, rowIndex) => {
    const row = values[rowIndex];
    const rowErrors = {};

    if (row.resourceType) {
      rowErrors.resource = row.resource ? '' : 'required';
      rowErrors.zone = !isEmptyObject(row.zone) ? '' : 'required';
      rowErrors.personnel = !isEmptyObject(row.primaryOfficer) ? '' : 'required';
    }

    return rowErrors;
  };

  // Extracted function to create payload for API call
  const createPayload = () => {
    return rowsState
      .filter(row => row.resource && row.resource.ResourceID)
      .map(row => {
        const payload = {
          ResourceID: row.resource.ResourceID,
          ResourceTypeID: row.resource.ResourceTypeID1,
          OnOffDuty: onOffStatus === "OnDuty" ? '1' : '0',
          ShiftID: row.shift ? row.shift.ShiftId : '',
          ZoneID: row.zone ? row.zone.value : '',
          AgencyID: loginAgencyID,
        };

        // Only add OfficerIDs if there are actual officer IDs to include
        const officerIds = [];
        if (row.primaryOfficer?.PINID) {
          officerIds.push(row.primaryOfficer.PINID);
        }
        if (row.primaryOfficerTo?.PINID) {
          officerIds.push(row.primaryOfficerTo.PINID);
        }
        
        // If no officers are selected, use resource's OfficerIDs if available
        if (officerIds.length === 0 && row.resource?.OfficerIDs) {
          const resourceOfficerIds = row.resource.OfficerIDs.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
          officerIds.push(...resourceOfficerIds);
        }

        // Only add OfficerIDs to payload if there are valid IDs
        if (officerIds.length > 0) {
          payload.OfficerIDs = officerIds;
        }

        return payload;
      });
  };

  async function handelSave() {
    const newErrors = {};

    let isValid = true;
    rowsState.forEach((row, rowIndex) => {
      const rowErrors = validateRowFields(rowsState, rowIndex);
      if (Object.values(rowErrors).some((error) => error)) {
        isValid = false;
      }
      newErrors[rowIndex] = rowErrors;
    });

    setErrors(newErrors);

    if (isValid) {
      const payload = createPayload();
      const jsonPayload = JSON.stringify({ data: payload });
      const finalPayload = {
        jsonPayload: jsonPayload
      };

      const response = await MonitorServices.changeOnOffDuty(finalPayload);
      if (response?.status === 200) {
        toastifySuccess("Data Saved Successfully");
        setOnOffDutyModal(false);
        refetchOnOffDuty();
        incidentRefetch();
        setErrors([]);
        resourceRefetch();
      }
    }
  }

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      setOnOffDutyModal(false); 
      refetchOnOffDuty(); 
      setErrors([]); 
      setOnOffStatus("OnDuty")
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  // Extracted function to handle radio button change
  const handleRadioChange = (status) => {
    setOnOffStatus(status);
    if (status === "OnDuty") {
      refetchOnOffDuty();
    }
  };

  // Extracted function to handle modal close
  const handleModalClose = () => {
    setOnOffDutyModal(false);
    refetchOnOffDuty();
    setErrors([]);
    setOnOffStatus("OnDuty");
  };

  // Extracted function to render form row
  const renderFormRow = (row, index) => {
    return (
      <div key={index} className="row">
        <div className="tab-form-container">
          <div className="d-flex align-items-center" style={{ gap: "6px" }}>
            <label htmlFor="" className="new-label text-nowrap mb-0">
              Unit Type
            </label>
            <Select
              isClearable
              placeholder="Select..."
              options={resourceTypeListData}
              getOptionLabel={(v) => v?.ResourceTypeCode + " | " + v?.ResourceTypeDescription}
              getOptionValue={(v) => v?.ResourceTypeID}
              maxMenuHeight={100}
              formatOptionLabel={(option, { context }) => {
                return context === 'menu'
                  ? `${option?.ResourceTypeCode} | ${option?.ResourceTypeDescription}`
                  : option?.ResourceTypeCode;
              }}
              value={row?.resourceType}
              onChange={(selectedOption) => updateRowState(index, 'resourceType', selectedOption)}
              styles={customStylesWithOutColorNew}
              isDisabled={row?.isDisabledType}
              className="w-100"
              name="CFSLDetails" />
            <label htmlFor="" className="new-label text-nowrap mb-0">
              Unit # {errors[index]?.resource && <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors[index].resource}</p>}
            </label>
            <Select
              isClearable
              placeholder="Select..."
              options={resourceData
                .filter((i) => i?.ResourceTypeID === row?.resourceType?.ResourceTypeID)
                .filter((i) => !getSelectedResources().includes(i?.ResourceID))
              }
              styles={row?.resourceType ? colourStyles : customStylesWithOutColorNew}
              className="w-100"
              maxMenuHeight={100}
              value={row.resource}
              onChange={(selectedOption) => updateRowState(index, 'resource', selectedOption)}
              getOptionLabel={(v) => v?.ResourceNumber}
              getOptionValue={(v) => v?.ResourceID}
              isDisabled={row?.isDisabledResource}
              onInputChange={(inputValue, actionMeta) => {
                if (inputValue.length > 12) {
                  return inputValue.slice(0, 12);
                }
                return inputValue;
              }}
              isSearchable={true}
            />
            <label htmlFor="" className="new-label text-nowrap mb-0">
              Shift  {errors[index]?.shift && <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors[index].shift}</p>}
            </label>
            <Select
              isClearable
              options={shiftDropDown}
              maxMenuHeight={100}
              getOptionLabel={(v) => v?.ShiftCode + " | " + v?.ShiftDescription}
              getOptionValue={(v) => v?.ShiftId}
              value={row.shift}
              onChange={(selectedOption) => updateRowState(index, 'shift', selectedOption)}
              formatOptionLabel={(option, { context }) => {
                return context === 'menu'
                  ? `${option?.ShiftCode} | ${option?.ShiftDescription}`
                  : option?.ShiftCode;
              }}
              placeholder="Select..."
              isDisabled={onOffStatus === 'OffDuty'}
              styles={row?.resourceType && onOffStatus === 'OnDuty' ? colourStyles : customStylesWithOutColorNew}
              className="w-75"
              name="CFSLDetails" />
            <label htmlFor="" className="new-label text-nowrap mb-0">
              Zone {errors[index]?.zone && <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors[index].zone}</p>}
            </label>
            <Select
              isClearable
              placeholder="Select..."
              options={zoneDropDown}
              styles={row?.resourceType && onOffStatus === 'OnDuty' ? colourStyles : customStylesWithOutColorNew}
              isDisabled={onOffStatus === 'OffDuty'}
              value={row?.zone}
              maxMenuHeight={100}
              onChange={(selectedOption) => updateRowState(index, 'zone', selectedOption)}
              className="w-100"
              name="CFSLDetails" />
            <label htmlFor="" className="new-label text-nowrap mb-0">
              Personnel ID 1 {errors[index]?.personnel && <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors[index].personnel}</p>}
            </label>
            <Select
              isClearable
              placeholder="Select..."
              styles={row?.resourceType && onOffStatus === 'OnDuty' ? colourStyles : customStylesWithOutColorNew}
              options={filterOptionsPersonnel(primaryOfficerDropDown, [...getSelectedValuesPersonnel('primaryOfficer'), ...getSelectedValuesPersonnel('primaryOfficerTo')], "PINID")}
              getOptionLabel={(v) => v?.FirstName + " " + v?.LastName}
              value={row?.primaryOfficer}
              maxMenuHeight={100}
              getOptionValue={(v) => v?.PINID}
              onChange={(selectedOption) => updateRowState(index, 'primaryOfficer', selectedOption)}
              isDisabled={onOffStatus === 'OffDuty'}
              className="w-100"
              name="CFSLDetails" />
            <label htmlFor="" className="new-label text-nowrap mb-0">
              Personnel ID 2
            </label>
            <Select
              isClearable
              placeholder="Select..."
              styles={customStylesWithOutColorNew}
              options={filterOptionsPersonnel(primaryOfficerDropDown, [...getSelectedValuesPersonnel('primaryOfficer'), ...getSelectedValuesPersonnel('primaryOfficerTo')], "PINID")}
              value={row?.primaryOfficerTo}
              maxMenuHeight={100}
              getOptionLabel={(v) => v?.FirstName + " " + v?.LastName}
              onChange={(selectedOption) => updateRowState(index, 'primaryOfficerTo', selectedOption)}
              isDisabled={onOffStatus === 'OffDuty'}
              getOptionValue={(v) => v?.PINID}
              className="w-100"
              name="CFSLDetails" />
            {index === 0 && onOffStatus === "OnDuty" ? (
              <div style={{ width: "290px" }}></div>
            ) : (
              <button onClick={() => removeRow(index)} className="btn btn-sm text-white" style={{ backgroundColor: "red" }}> 
                <i className="fa fa-trash"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {openOnOffDutyModal ? (
        <dialog
          className="modal fade"
          style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
          id="OnOffDutyModal"
          tabIndex="-1"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content modal-content-cad">
              <div className="modal-body" style={{
                maxHeight: "80vh",
                overflowY: "auto",
              }}>
                <div className="row">
                  <div className="col-12 p-0 pb-2">
                    <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                      <p
                        className="p-0 m-0 font-weight-medium"
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                        }}
                      >
                        {'On/Off Duty'}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Form Section */}
                <div className="m-1">
                  <fieldset style={{ border: "1px solid gray" }}>
                    {/* Line 1 */}
                    <div className="col-12 d-flex justify-content-start align-items-center mt-4 mb-1" style={{ gap: "50px" }}>
                      <div className="form-check ">
                        <input 
                          className="form-check-input" 
                          style={{ marginTop: "6px" }} 
                          type="radio" 
                          value="Attempted" 
                          name="AttemptComplete" 
                          id="flexRadioDefault1" 
                          checked={onOffStatus === 'OnDuty'} 
                          onChange={() => handleRadioChange("OnDuty")} 
                        />
                        <label className="form-check-label " htmlFor="flexRadioDefault1" >
                          On Duty
                        </label>
                      </div>
                      <div className="form-check ">
                        <input 
                          className="form-check-input" 
                          style={{ marginTop: "6px" }} 
                          type="radio" 
                          value="Attempted" 
                          name="AttemptComplete" 
                          id="flexRadioDefault12" 
                          checked={onOffStatus === 'OffDuty'} 
                          onChange={() => handleRadioChange("OffDuty")} 
                        />
                        <label className="form-check-label " htmlFor="flexRadioDefault12">
                          Off Duty
                        </label>
                      </div>
                    </div>
                    {rowsState.map((row, index) => renderFormRow(row, index))}

                    <div className="float-right mt-2">
                      <button onClick={() => handelAdd()} className="btn btn-primary">
                        Add Row
                      </button>
                    </div>
                  </fieldset>
                </div>
                {/* Buttons Section */}
                <div className="row">
                  <div className="col-12 p-0">
                    <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                      <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                        <button
                          type="button"
                          className="save-button ml-2"
                          onClick={() => handelSave()}
                          disabled={!rowsState.some(item => item.resourceType !== null)}
                        >
                          {'Save'}
                        </button>
                        <button
                          type="button"
                          data-dismiss="modal"
                          className="cancel-button"
                          onClick={handleModalClose}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      ) : (
        <> </>
      )
      }
    </>
  );
};

export default memo(OnOffDutyModal);

// PropTypes definition
OnOffDutyModal.propTypes = {
  openOnOffDutyModal: PropTypes.bool.isRequired,
  setOnOffDutyModal: PropTypes.func.isRequired
};

// Default props
OnOffDutyModal.defaultProps = {
  openOnOffDutyModal: false,
  setOnOffDutyModal: () => {}
};
