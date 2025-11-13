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

const ArriveModal = (props) => {
  const { openArriveModal, setArriveModal } = props;
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const { assignedIncidentData, refetchGetComments, resourceData, resourceRefetch, incidentRefetch, unassignedIncidentListRefetch, assignedIncidentListRefetch } = useContext(IncidentContext);
  const [resourceDropDown, setResourceDropDown] = useState([])
  const [hospitalCodeDropDown, setHospitalCodeDropDown] = useState([])
  const [loginPinID, setLoginPinID] = useState(1);
  const [loginAgencyID, setLoginAgencyID] = useState("");

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



  useEffect(() => {
    if (openArriveModal) {
      const filteredData = resourceData.filter((incident) => {
        if (enrouteState?.EnroutesceneorHospital === "scene") {
          return (
            incident.IncidentID === IncID &&
            incident.Status !== "AR" && incident.Status !== "DP"
          );
        } else {
          return (
            incident.IncidentID === IncID &&
            incident.Status !== "AH" && incident.Status !== "DP"
          );
        }
      });
      setEnrouteState({
        EnroutesceneorHospital: enrouteState?.EnroutesceneorHospital || "scene",
        IncidentID: IncID || "",
        Resources1: filteredData.length > 0 ? filteredData : "",
        HospitalNameCodeID: "",
        Comments: ""
      });
    }
  }, [openArriveModal, IncID, resourceData, setEnrouteState, enrouteState?.EnroutesceneorHospital]);


  useEffect(() => {
    const filteredData = resourceData.filter((incident) => {
      if (enrouteState?.EnroutesceneorHospital === "scene") {
        return (
          incident.IncidentID === enrouteState?.IncidentID &&
          incident.Status !== "AR" && incident.Status !== "DP"
        );
      } else {
        return (
          incident.IncidentID === enrouteState?.IncidentID &&
          incident.Status !== "AH" && incident.Status !== "DP"
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
      enabled: openArriveModal && !!loginAgencyID
    }
  );

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID)
      setLoginAgencyID(localStoreData?.AgencyID);
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
    setArriveModal(false);
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

  const validateDispatch = () => {
    let isError = false;
    const keys = Object.keys(errorEnroute);

    keys.forEach((field) => {
      if (field === "IncidentID" && isEmpty(enrouteState[field])) {
        handleErrorEnroute(field, true);
        isError = true;
      } else if (field === "Resources" && isEmpty(enrouteState[field])) {
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
      Status: enrouteState?.EnroutesceneorHospital === "scene" ? "AR" : "AH",
      IncidentID: enrouteState?.IncidentID,
      Resources: resourceIDs,
      Comments: enrouteState?.Comments,
      HospitalID: enrouteState?.HospitalNameCodeID?.HospitalNameCodeID || "",
      CreatedByUserFK: loginPinID,
      AgencyID: loginAgencyID,
    }
    const response = await ResourcesStatusServices.incidentRecourseStatus(data);
    if (response?.status === 200) {
      toastifySuccess("Data Saved Successfully");
      handleClose();
      incidentRefetch();
      assignedIncidentListRefetch();
      unassignedIncidentListRefetch();
      resourceRefetch();
      refetchGetComments();
    }
  }

  return (
    <>
      {openArriveModal ? (
        <dialog
          className="modal fade"
          style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
          id="ArriveModal"
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
                        Arrive
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
                          <span className="new-label mt-2">
                            Arrive To
                          </span>
                        </div>
                        <div className="d-flex align-self-center justify-content-start ml-2" style={{ width: '120px' }}>
                          <label className='d-flex align-self-center justify-content-start' style={{ gap: '5px', margin: '0', cursor: 'pointer' }} htmlFor="arrive-to-group">
                            <input type="radio" name="arrive-to-group" value="scene" checked={enrouteState?.EnroutesceneorHospital === 'scene'} onChange={(e) => { handleEnrouteState("EnroutesceneorHospital", e.target.value) }} />
                            <span className="tab-form-label">Scene</span>
                          </label>
                        </div>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                          <label className='d-flex align-self-center justify-content-start' style={{ gap: '5px', margin: '0', cursor: 'pointer' }} htmlFor="arrive-to-group">
                            <input type="radio" name="arrive-to-group" value="hospital" checked={enrouteState?.EnroutesceneorHospital === 'hospital'} onChange={(e) => { handleEnrouteState("EnroutesceneorHospital", e.target.value) }} />
                            <span className="tab-form-label">Hospital</span>
                          </label>
                        </div>
                      </div>

                      {/* Line 2 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label className="new-label mt-1" style={{ textAlign: "end" }} htmlFor="incident-select">
                            CAD Event #{errorEnroute.IncidentID && isEmpty(enrouteState?.IncidentID) && (
                              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CAD Event #"}</p>
                            )}</label>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-content-end">
                          <Select
                            inputId="incident-select"
                            name="Incident"
                            styles={colourStyles1}
                            isClearable
                            options={assignedIncidentData}
                            value={assignedIncidentData?.find((i) => i?.IncidentID === enrouteState?.IncidentID)}
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
                            <label className="new-label mt-1" style={{ textAlign: "end" }} htmlFor="resource-select">
                              Unit #{errorEnroute.Resources1 && isEmptyObject(enrouteState?.Resources1) && (
                                <p className="text-nowrap" style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Unit #"}</p>
                              )}</label>
                          </div>
                          <div className="col-9 d-flex align-items-center justify-content-end">
                            <Select
                              inputId="resource-select"
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

                      {/* Line 5 */}
                      <div className="tab-form-row">
                        <div className="col-2 d-flex align-items-center justify-content-end">
                          <label className="new-label mt-1" style={{ textAlign: "end" }} htmlFor="hospital-select">
                            Hospital Code{errorEnroute.HospitalNameCodeID && isEmptyObject(enrouteState?.HospitalNameCodeID) && enrouteState?.EnroutesceneorHospital !== "scene" && (
                              <p className="text-nowrap" style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Hospital Code"}</p>
                            )}
                          </label>
                        </div>
                        <div className="col-4 d-flex align-items-center justify-content-end ">
                          <Select
                            inputId="hospital-select"
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
                          <label className="tab-form-label" htmlFor="comments-textarea">
                            Comments
                          </label>
                        </div>
                        <div className="col-10 d-flex align-items-center justify-content-end">
                          <textarea
                            id="comments-textarea"
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

ArriveModal.propTypes = {
  openArriveModal: PropTypes.bool.isRequired,
  setArriveModal: PropTypes.func.isRequired
};

ArriveModal.defaultProps = {
  openArriveModal: false,
  setArriveModal: () => { }
};

export default memo(ArriveModal);
