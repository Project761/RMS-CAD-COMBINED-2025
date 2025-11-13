import { memo, useCallback, useContext, useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import ResourcesStatusServices from "../../CADServices/APIs/resourcesStatus";
import useObjState from "../../CADHook/useObjState";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { useSelector } from "react-redux";
import { IncidentContext } from "../../CADContext/Incident";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import { base64ToString } from "../../Components/Common/Utility";
import { useLocation } from "react-router-dom";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { useQuery } from "react-query";


const DispatcherModal = (props) => {
    const { openDispatcherModal, setOpenDispatcherModal, incidentID } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { incidentData, resourceRefetch, incidentRefetch, refetchGetComments } = useContext(IncidentContext);
    const [loginPinID, setLoginPinID] = useState(1);
    const [incidentDataState, setIncidentDataState] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState("");
    const [resourceDropDown, setResourceDropDown] = useState([]);
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

    const servicePayload = [
        incidentDataState?.LAW ? '1' : '',
        incidentDataState?.FIRE ? '2' : '',
        incidentDataState?.EMERGENCYMEDICALSERVICE ? '3' : '',
        incidentDataState?.OTHER ? '4' : ''
    ].filter(Boolean).join(',')

    const getResourcesKey = `/CAD/MasterResource/GetDataDropDown_Resource/${loginAgencyID}`;
    const { data: getResourcesData, isSuccess: isFetchResourcesData } = useQuery(
        [getResourcesKey, { AgencyID: loginAgencyID, CFSDetails: servicePayload, },],
        MasterTableListServices.getDataDropDown_Resource,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID && !!servicePayload,
        }
    );

    useEffect(() => {
        if (isFetchResourcesData && getResourcesData) {
            const data = JSON.parse(getResourcesData?.data?.data);
            setResourceDropDown(data?.Table || [])
        }
    }, [isFetchResourcesData, getResourcesData])

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID)
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

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


    useEffect(() => {
        if (openDispatcherModal) {
            const incId = IncID || incidentID;
            setIncidentDataState(incidentData?.find((i) => i?.IncidentID === incId))
            setDispatchState((prevState) => ({
                ...prevState,
                IncidentID: incId,
            }));
        }
    }, [openDispatcherModal, IncID, incidentID, resourceID, isResourceView, setDispatchState]);

    const onCloseLocation = () => {
        clearDispatchState();
        clearStateDispatch();
        setOpenDispatcherModal(false);
    };

    const validateDispatch = () => {
        let isError = false;
        const keys = Object.keys(errorDispatch);
        keys.map((field) => {
            if (
                field === "IncidentID" &&
                isEmpty(dispatchState[field])) {
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
            Status: "DP",
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

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 37,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
            overflowY: 'hidden',
            overflowX: 'hidden'
        }),
        menu: (provided) => ({
            ...provided,
            maxHeight: "140px",
        }), menuList: (provided) => ({
            ...provided,
            maxHeight: "140px",
            overflowY: "auto",
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            transition: "all .2s ease",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: 'auto',
            maxHeight: '40px',
            overflowY: 'auto',
            padding: '0 8px',
        }),
    };

    return (
        <>
            {openDispatcherModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="DispatcherModal"
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
                                                Dispatch
                                            </p>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-container">
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label htmlFor="" className="new-label mr-1" style={{ textAlign: "end" }}>
                                                            CAD Event #{errorDispatch.IncidentID && isEmpty(dispatchState?.IncidentID) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CAD Event #"}</p>
                                                            )}</label>
                                                    </div>
                                                    <div className="col-md-4 col-sm-10 d-flex align-items-center justify-content-end select-container">
                                                        <Select
                                                            name="Incident"
                                                            styles={colourStyles}
                                                            isClearable
                                                            isSearchable
                                                            options={incidentData}
                                                            value={incidentData?.find((i) => i?.IncidentID === dispatchState?.IncidentID)}
                                                            getOptionLabel={(v) => v?.CADIncidentNumber}
                                                            getOptionValue={(v) => v?.IncidentID}
                                                            onChange={(e) => {
                                                                handleDispatchState("IncidentID", e?.IncidentID);
                                                                setIncidentDataState(e)
                                                            }}
                                                            placeholder="Select..."
                                                            className="w-100"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-items-center justify-content-end">
                                                        <label htmlFor="" className="new-label" style={{ textAlign: "end" }}>
                                                            Unit #{errorDispatch.Resources1 && isEmptyObject(dispatchState?.Resources1) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Unit #"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-md-6 col-sm-10 d-flex align-items-center justify-content-end select-container">
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
                                                            styles={colourStyles}
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
                                                                handleDispatchState("Comments", e.target.value);
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

export default memo(DispatcherModal);

// PropTypes definition
DispatcherModal.propTypes = {
    openDispatcherModal: PropTypes.bool.isRequired,
    setOpenDispatcherModal: PropTypes.func.isRequired,
    incidentID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

// Default props
DispatcherModal.defaultProps = {
    openDispatcherModal: false,
    setOpenDispatcherModal: () => { },
    incidentID: null
};
