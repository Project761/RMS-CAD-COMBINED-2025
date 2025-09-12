import { memo, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import PropTypes from "prop-types";
import ResourcesStatusServices from "../../CADServices/APIs/resourcesStatus";
import useObjState from "../../CADHook/useObjState";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { useSelector } from "react-redux";
import { IncidentContext } from "../../CADContext/Incident";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import { base64ToString } from "../../Components/Common/Utility";
import { colourStyles1, multiSelectcolourStyles } from "../Utility/CustomStylesForReact";

const FreeModal = (props) => {
    const { openFreeModal, setOpenFreeModal } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { assignedIncidentData, resourceData, resourceRefetch, incidentRefetch, refetchGetComments } = useContext(IncidentContext);
    const [resourceDropDown, setResourceDropDown] = useState([])
    const [loginPinID, setLoginPinID] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState("");

    const [
        dispatchState,
        setDispatchState,
        handleDispatchState,
        clearDispatchState,
    ] = useObjState({
        IncidentID: "",
        Resources1: "",
        Comments: ""
    });

    const [
        errorDispatch,
        ,
        handleErrorDispatch,
        clearStateDispatch,
    ] = useObjState({
        IncidentID: false,
        Resources1: false,
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

    let isResourceView = query?.get("isResourceView");
    if (!isResourceView) isResourceView = 0;

    useEffect(() => {
        if (openFreeModal) {
            const filteredData = resourceData.filter((incident) => {
                if (isResourceView === true || isResourceView === 'true') {
                    return incident.IncidentID === IncID && incident.ResourceID.toString() === resourceID.toString();
                } else {
                    return incident.IncidentID === IncID;
                }
            });

            setDispatchState({
                IncidentID: IncID,
                Resources1: filteredData,
                Comments: "",
            });
        }
    }, [openFreeModal, IncID, resourceData, resourceID, isResourceView, setDispatchState]);

    useEffect(() => {
        const filteredData = resourceData.filter(
            (incident) => incident.IncidentID === dispatchState?.IncidentID
        );
        setResourceDropDown(filteredData);
    }, [resourceData, dispatchState]);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID)
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);


    const onCloseLocation = () => {
        clearDispatchState();
        clearStateDispatch();
        setOpenFreeModal(false);
    };

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            onCloseLocation();
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
        const keys = Object.keys(errorDispatch);
        keys.map((field) => {
            if (
                field === "IncidentID" &&
                (dispatchState?.IncidentID <= 0 || isEmpty(dispatchState[field]))) {
                handleErrorDispatch(field, true);
                isError = true;
            } else if (field === "Resources1" && isEmptyObject(dispatchState[field])) {
                handleErrorDispatch(field, true);
                isError = true;
            } else {
                handleErrorDispatch(field, false);
            }
            return null;
        });
        return !isError;
    };

    async function handleSave() {
        if (!validateDispatch()) return;
        const resourceIDs = dispatchState.Resources1.map(item => item.ResourceID).join(',');
        const data = {
            Status: "AV",
            IncidentID: dispatchState?.IncidentID,
            Resources: resourceIDs,
            Comments: dispatchState?.Comments,
            CreatedByUserFK: loginPinID,
            AgencyID: loginAgencyID,
        }
        const response = await ResourcesStatusServices.incidentRecourseStatus(data);
        if (response?.status === 200) {
            toastifySuccess("Data Saved Successfully");
            onCloseLocation();
            incidentRefetch();
            resourceRefetch();
            refetchGetComments();
        }
    }

    return (
        <>
            {openFreeModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="freeModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content modal-content-cad">
                                <div className="modal-body">
                                    <div className="row pb-2">
                                        <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                            <p
                                                className="p-0 m-0 font-weight-medium"
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: 500,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                Free Unit
                                            </p>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-container">
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label htmlFor="" className="new-label mr-1" style={{ textAlign: "end" }}>
                                                            CAD Event #{errorDispatch.IncidentID && (dispatchState?.IncidentID <= 0 || isEmpty(dispatchState?.IncidentID)) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CAD Event #"}</p>
                                                            )}</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            name="Incident"
                                                            styles={colourStyles1}
                                                            isClearable
                                                            isSearchable
                                                            options={assignedIncidentData}
                                                            value={assignedIncidentData?.find((i) => i?.IncidentID === dispatchState?.IncidentID)}
                                                            getOptionLabel={(v) => v?.CADIncidentNumber}
                                                            getOptionValue={(v) => v?.IncidentID}
                                                            onChange={(e) => {
                                                                handleDispatchState("IncidentID", e?.IncidentID || null);
                                                                if (!e) {
                                                                    handleDispatchState("Resources1", null);
                                                                }
                                                            }}
                                                            placeholder="Select..."
                                                            className="w-100"
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-items-center justify-content-end">
                                                        <label htmlFor="" className="new-label" style={{ textAlign: "end" }}>
                                                            Unit{errorDispatch.Resources1 && isEmptyObject(dispatchState?.Resources1) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Unit"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-4 d-flex align-items-center justify-content-end">
                                                        <Select
                                                            className="w-100"
                                                            isClearable
                                                            options={resourceDropDown}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={dispatchState?.Resources1}
                                                            onChange={(selectedOptions) => {
                                                                handleDispatchState("Resources1", selectedOptions);
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
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap" >
                                                            Comments
                                                        </label>
                                                    </div>
                                                    <div
                                                        className="col-10 d-flex align-items-center justify-content-end select-container"
                                                    >
                                                        <textarea name="comments" rows="3"
                                                            placeholder="Comment"
                                                            className="form-control py-1 new-input" value={dispatchState?.Comments}
                                                            style={{ height: "auto", overflowY: "scroll" }}
                                                            onChange={(e) => {
                                                                handleDispatchState("Comments", e.target.value)
                                                                e.target.style.height = "auto";
                                                                const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                                e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                            }} />

                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    {/* Buttons */}
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
                                                        onClick={onCloseLocation}
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
                </>
            ) : (
                <> </>
            )
            }
        </>
    );
};

export default memo(FreeModal);

// PropTypes definition
FreeModal.propTypes = {
  openFreeModal: PropTypes.bool.isRequired,
  setOpenFreeModal: PropTypes.func.isRequired
};

// Default props
FreeModal.defaultProps = {
  openFreeModal: false,
  setOpenFreeModal: () => {}
};
