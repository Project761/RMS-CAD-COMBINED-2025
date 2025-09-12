/* eslint-disable react/prop-types */

import { memo, useCallback, useContext, useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import useObjState from "../../CADHook/useObjState";
import ResourcesStatusServices from "../../CADServices/APIs/resourcesStatus";
import { useQuery } from "react-query";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { useSelector } from "react-redux";
import { IncidentContext } from "../../CADContext/Incident";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import { useLocation } from "react-router-dom";
import { base64ToString } from "../../Components/Common/Utility";
import { colourStyles1, customStylesWithOutColor, multiSelectcolourStyles } from "../Utility/CustomStylesForReact";

const EnrouteModal = (props) => {
  const { openEnrouteModal, setEnrouteModal } = props;
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const { assignedIncidentData, resourceData, resourceRefetch, incidentRefetch, refetchGetComments } = useContext(IncidentContext);
  const [resourceDropDown, setResourceDropDown] = useState([])
  const [hospitalCodeDropDown, setHospitalCodeDropDown] = useState([])
  const [loginAgencyID, setLoginAgencyID] = useState();
  const [loginPinID, setLoginPinID] = useState(1);


  const [
    enrouteState,
    setEnrouteState,
    handleEnrouteState,
    clearEnrouteState,
  ] = useObjState({
    EnroutesceneorHospital: "scene",
    IncidentID: "",
    Resources1: "",
    HospitalNameCodeID: "",
    Comments: ""
  });

  const [
    errorEnroute,
    ,
    handleErrorEnroute,
    clearStateEnroute,
  ] = useObjState({
    IncidentID: false,
    Resources1: false,
    HospitalNameCodeID: false,
  });

  const useRouteQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };
  const query = useRouteQuery();

  let IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  let resourceID = query?.get("resourceID");
  if (!resourceID) resourceID = 0;

  useEffect(() => {
    if (openEnrouteModal) {
      const filteredData = resourceData.filter((incident) => {
        if (enrouteState?.EnroutesceneorHospital === "scene") {
          return (
            incident.IncidentID === IncID &&
            incident.Status !== "ER" && incident.Status !== "AR" && incident.Status !== "AH"
          );
        } else {
          return (
            incident.IncidentID === IncID &&
            incident.Status !== "EH" && incident.Status !== "AR" && incident.Status !== "AH"
          );
        }
      });

      setEnrouteState({
        EnroutesceneorHospital: enrouteState?.EnroutesceneorHospital || "scene",
        IncidentID: IncID ? IncID : "",
        Resources1: filteredData.length > 0 ? filteredData : "",
        HospitalNameCodeID: "",
        Comments: ""
      });
    }
  }, [openEnrouteModal, IncID, resourceData, setEnrouteState, enrouteState?.EnroutesceneorHospital]);


  useEffect(() => {
    const filteredData = resourceData.filter((incident) => {
      if (enrouteState?.EnroutesceneorHospital === "scene") {
        return (
          incident.IncidentID === enrouteState?.IncidentID &&
          incident.Status !== "ER"
        );
      } else {
        return (
          incident.IncidentID === enrouteState?.IncidentID &&
          incident.Status !== "EH"
        );
      }
    });
    setResourceDropDown(filteredData);
  }, [resourceData, enrouteState?.IncidentID]);


  const getHospitalNameCodeKey = `/CAD/MasterHospitalNamecode/GetDataDropDown_HospitalNameCode/${loginAgencyID}`;
  const { data: getHospitalNameCodeData, isSuccess: isFetchGetHospitalNameCodeKey } = useQuery(
    [getHospitalNameCodeKey, { AgencyID: loginAgencyID },],
    ResourcesStatusServices.getDataDropDown_HospitalNameCode,
    {
      refetchOnWindowFocus: false,
      enabled: openEnrouteModal && !!loginAgencyID
    }
  );

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID)
      setLoginPinID(localStoreData?.PINID)
    }
  }, [localStoreData]);

  useEffect(() => {
    if (getHospitalNameCodeData && isFetchGetHospitalNameCodeKey) {
      const data = JSON.parse(getHospitalNameCodeData?.data?.data);
      setHospitalCodeDropDown(data?.Table)
    }
  }, [getHospitalNameCodeData, isFetchGetHospitalNameCodeKey])

  const handleClose = () => {
    clearEnrouteState();
    clearStateEnroute();
    setEnrouteModal(false);
  };

  const validateDispatch = () => {
    let isError = false;
    const keys = Object.keys(errorEnroute);
    keys.forEach((field) => {
      if (
        field === "IncidentID" &&
        isEmpty(enrouteState[field])) {
        handleErrorEnroute(field, true);
        isError = true;
      } else if (field === "Resources1" && isEmptyObject(enrouteState[field])) {
        handleErrorEnroute(field, true);
        isError = true;
      } else if (
        field === "HospitalNameCodeID" &&
        enrouteState?.EnroutesceneorHospital !== "scene" &&
        isEmptyObject(enrouteState[field])
      ) {
        handleErrorEnroute(field, true);
        isError = true;
      } else {
        handleErrorEnroute(field, false);
      }
    });

    return !isError;
  };

  async function handleSave() {
    if (!validateDispatch()) return;
    const resourceIDs = enrouteState.Resources1.map(item => item.ResourceID).join(',');
    const data = {
      Status: enrouteState?.EnroutesceneorHospital === "scene" ? "ER" : "EH",
      IncidentID: enrouteState?.IncidentID,
      Resources: resourceIDs,
      Comments: enrouteState?.Comments,
      HospitalID: enrouteState?.EnroutesceneorHospital === 'hospital' ? enrouteState?.HospitalNameCodeID?.HospitalNameCodeID : "",
      CreatedByUserFK: loginPinID,
      AgencyID: loginAgencyID,
    }
    const response = await ResourcesStatusServices.incidentRecourseStatus(data);
    if (response?.status === 200) {
      toastifySuccess("Data Saved Successfully");
      handleClose();
      incidentRefetch();
      resourceRefetch();
      refetchGetComments();
    }
  }

  const handleEnrouteChange = (value) => {
    setEnrouteState({
      EnroutesceneorHospital: value,
      IncidentID: "",
      Resources1: "",
      HospitalNameCodeID: "",
      Comments: ""
    });
  };

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
      handleClose();
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
      {openEnrouteModal ? (
        <dialog
          className="modal fade"
          style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
          id="EnrouteModal"
          tabIndex="-1"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-cad">
              <div className="modal-body">
                <div className="row">
                  <div className="col-22 p-0 pb-2">
                    <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                      <p
                        className="p-0 m-0 font-weight-medium"
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                        }}
                      >
                        Enroute
                      </p>
                    </div>
                  </div>
                </div>
                {/* Form Section */}
                <div className="m-1">
                  <fieldset style={{ border: "1px solid gray" }}>
                    <div className="tab-form-container">
                      {/* Line 1 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-self-center justify-content-end">
                          <label className="new-label mt-2">
                            Enroute To
                          </label>
                        </div>
                        <div className="d-flex align-self-center justify-content-start ml-2" style={{ width: '120px' }}>
                          <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                            <input type="radio" id="scene" value="scene" checked={enrouteState?.EnroutesceneorHospital === 'scene'} onChange={(e) => {
                              handleEnrouteChange(e.target.value)
                            }} />
                            <label className="tab-form-label" for="scene" style={{ margin: '0', }}>Scene</label>
                          </div>
                        </div>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                          <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                            <input type="radio" id="hospital" value="hospital" checked={enrouteState?.EnroutesceneorHospital === 'hospital'} onChange={(e) => {
                              handleEnrouteChange(e.target.value)
                            }} />
                            <label className="tab-form-label" for="hospital" style={{ margin: '0', }}>Hospital</label>
                          </div>
                        </div>
                      </div>

                      {/* Line 2 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                            CAD Event #{errorEnroute.IncidentID && isEmpty(enrouteState?.IncidentID) && (
                              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CAD Event #"}</p>
                            )}</label>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-content-end">
                          <Select
                            name="Incident"
                            styles={colourStyles1}
                            isClearable
                            options={assignedIncidentData}
                            value={enrouteState?.IncidentID ? assignedIncidentData?.find((i) => i?.IncidentID === enrouteState?.IncidentID) : ""}
                            getOptionLabel={(v) => v?.CADIncidentNumber}
                            getOptionValue={(v) => v?.IncidentID}
                            onChange={(e) => {
                              handleEnrouteState("IncidentID", e?.IncidentID || null);
                              handleEnrouteState("Resources1", null);
                              if (!e) {
                                handleEnrouteState("Resources1", null);
                              }
                            }}
                            placeholder="Select..."
                            className="w-100"
                          />
                        </div>
                        <div className="tab-form-row ml-2">
                          <div className="col-3 d-flex align-items-center justify-content-end">
                            <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                              Unit #{errorEnroute.Resources1 && isEmptyObject(enrouteState?.Resources1) && (
                                <p className="text-nowrap" style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Unit #"}</p>
                              )}</label>
                          </div>
                          <div className="col-9 d-flex align-items-center justify-content-end">
                            <Select
                              className="w-100"
                              isClearable
                              options={resourceDropDown}
                              placeholder="Select..."
                              name="Resource1"
                              value={enrouteState?.Resources1}
                              onChange={(selectedOptions) => {
                                handleEnrouteState("Resources1", selectedOptions);
                              }}
                              styles={multiSelectcolourStyles}
                              maxMenuHeight={180}
                              getOptionLabel={(v) => v?.ResourceNumber}
                              getOptionValue={(v) => v?.ResourceID}
                              onInputChange={(inputValue, actionMeta) => {
                                if (inputValue.length > 12) {
                                  return inputValue.slice(0, 12);
                                }
                                return inputValue;
                              }}
                              isMulti
                              isSearchable={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                            Hospital Code{errorEnroute.HospitalNameCodeID && isEmptyObject(enrouteState?.HospitalNameCodeID) && enrouteState?.EnroutesceneorHospital !== "scene" && (
                              <p className="text-nowrap" style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Hospital Code"}</p>
                            )}
                          </label>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-content-end">
                          <Select
                            isClearable
                            options={hospitalCodeDropDown}
                            placeholder="Select..."
                            className="w-100"
                            name="Resource4"
                            getOptionLabel={(v) => v?.hospitalnamecode}
                            isDisabled={enrouteState?.EnroutesceneorHospital !== 'hospital'}
                            getOptionValue={(v) => v?.HospitalNameCodeID}
                            value={enrouteState?.HospitalNameCodeID}
                            formatOptionLabel={(option, { context }) => {
                              return context === 'menu'
                                ? `${option?.hospitalnamecode} | ${option?.hospitalname}`
                                : option?.hospitalnamecode;
                            }}
                            onChange={(e) => handleEnrouteState("HospitalNameCodeID", e)}
                            styles={{
                              ...(
                                enrouteState?.EnroutesceneorHospital !== 'hospital'
                                  ? customStylesWithOutColor
                                  : colourStyles1
                              ),
                              control: (base, state) => ({
                                ...base,
                                backgroundColor:
                                  enrouteState?.EnroutesceneorHospital !== 'hospital'
                                    ? '#9d949436'
                                    : "#fce9bf",
                                pointerEvents: state.isDisabled ? 'none' : 'auto',
                              }),
                            }}
                          />
                        </div>
                      </div>

                      {/* Line 6 */}
                      <div className="tab-form-row" style={{ alignItems: 'baseline' }}>
                        <div className="col-2 d-flex align-items-end justify-content-end">
                          <label className="tab-form-label">
                            Comments
                          </label>
                        </div>
                        <div className="col-10 d-flex align-items-center justify-content-end">
                          <textarea
                            type="text"
                            rows="3"
                            className="form-control  py-1 new-input"
                            style={{ height: "auto", overflowY: "scroll" }}
                            placeholder="Comment"
                            value={enrouteState?.Comments}
                            onChange={(e) => {
                              handleEnrouteState("Comments", e.target.value)
                              e.target.style.height = "auto";
                              const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                              e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                            }}
                          />
                        </div>
                      </div>
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
                          onClick={() => handleSave()}
                        >
                          {'Save'}
                        </button>
                        <button
                          type="button"
                          data-dismiss="modal"
                          className="cancel-button"
                          onClick={() => handleClose()}
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

export default memo(EnrouteModal);

// PropTypes definition
EnrouteModal.propTypes = {
  openEnrouteModal: PropTypes.bool.isRequired,
  setEnrouteModal: PropTypes.func.isRequired
};

// Default props
EnrouteModal.defaultProps = {
  openEnrouteModal: false,
  setEnrouteModal: () => {}
};
