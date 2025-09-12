import { memo, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import { useQuery } from "react-query";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import MonitorServices from "../../CADServices/APIs/monitor";
import useObjState from "../../CADHook/useObjState";
import { fieldColourStyles, requiredFieldColourStyles } from "../Utility/CustomStylesForReact";
import { IncidentContext } from "../../CADContext/Incident";
import { useLocation, useNavigate } from "react-router-dom";
import { base64ToString, getShowingDateText } from "../../Components/Common/Utility";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import BootstrapTooltip from "react-bootstrap/Tooltip"; // React-Bootstrap Tooltip (Default Export)
import { getData_DropDown_IncidentDispositions } from "../../CADRedux/actions/DropDownsData";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";

const ClearModal = (props) => {
    const dispatch = useDispatch();
    const IncidentDispositionsDrpData = useSelector((state) => state.CADDropDown.IncidentDispositionsDrpData);
    const { openClearModal, setOpenClearModal, incidentID } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { incidentData, resourceData, resourceRefetch, incidentRefetch, refetchGetComments } = useContext(IncidentContext);
    const [resourceDropDown, setResourceDropDown] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState();
    const [dispositionDropDown, setDispositionDropDown] = useState([]);
    const [loginPinID, setLoginPinID] = useState('');
    const useRouteQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    const query = useRouteQuery();
    const location = useLocation();
    const navigate = useNavigate();
    let IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(parseInt(localStoreData?.PINID));
            if (IncidentDispositionsDrpData?.length === 0 && localStoreData?.AgencyID)
                dispatch(getData_DropDown_IncidentDispositions({ AgencyID: localStoreData?.AgencyID }));
        }
    }, [localStoreData]);

    const [
        clearState,
        setClearState,
        handleClearState,
        clearClearState,
    ] = useObjState({
        incidentID: "",
        resources: "",
        CFSCode: "",
        CFSDesc: "",
        primaryResource: "",
        RMSIncident: "",
        masterIncident: "",
        CADDisposition: "",
        reportDateTime: "",
        Location: "",
        APTSuit: "",
        Comments: "",
        coordinateX: "",
        coordinateY: "",
        isVerifyReportedLocation: ""
    });

    const [
        errorClearState,
        ,
        handleErrorClearState,
        clearErrorClearState,
    ] = useObjState({
        incidentID: false,
        CADDisposition: false,
    });

    const getSingleIncidentKey = `/CAD/Monitor/MonitorIncidentByID/${clearState?.incidentID}`;
    const { data: singleIncidentData, isSuccess: isFetchSingleIncidentData, refetch: refetchGetSingleIncident } = useQuery(
        [getSingleIncidentKey, {
            IncidentID: clearState?.incidentID, AgencyID: loginAgencyID,
        }],
        MonitorServices.getSingleIncident,
        {
            refetchOnWindowFocus: false,
            enabled: !!clearState?.incidentID && !!loginAgencyID && openClearModal,
        }
    );

    useEffect(() => {
        async function fetchIncidentData() {
            if (singleIncidentData && isFetchSingleIncidentData) {
                const parsedData = JSON.parse(singleIncidentData?.data?.data)?.Table || [];
                setClearState({
                    incidentID: parsedData[0]?.IncidentID,
                    resources: resourceDropDown.filter((item) => { return parsedData[0]?.resources === item?.resources }),
                    CFSCode: parsedData[0]?.CFSCODE,
                    CFSDesc: parsedData[0]?.CFSCodeDescription,
                    primaryResource: resourceDropDown.filter((item) => { return parsedData[0]?.PrimaryResourceName === item?.ResourceNumber }),
                    RMSIncident: parsedData[0]?.IncidentNumber,
                    masterIncident: parsedData[0]?.MasterIncidentNumber,
                    CADDisposition: null,
                    reportDateTime: getShowingDateText(parsedData[0]?.ReportedDate),
                    Location: parsedData[0]?.CrimeLocation,
                    APTSuit: parsedData[0]?.ApartmentNo,
                    coordinateX: parsedData[0]?.Longitude,
                    coordinateY: parsedData[0]?.Latitude,
                    isVerifyReportedLocation: parsedData[0]?.isVerifyReportedLocation,
                });
                const payload = {
                    AgencyID: localStoreData?.AgencyID,
                    CFSDetails: [
                        parsedData[0]?.LAW ? '1' : '',
                        parsedData[0]?.FIRE ? '2' : '',
                        parsedData[0]?.EMERGENCYMEDICALSERVICE ? '3' : '',
                        parsedData[0]?.OTHER ? '4' : ''
                    ].filter(Boolean).join(',')
                };

                try {
                    const response = await MasterTableListServices.getDispositionData(payload);
                    const data = JSON.parse(response?.data?.data);
                    setDispositionDropDown(data?.Table);
                } catch (error) {
                }
            }
        }
        fetchIncidentData();
    }, [singleIncidentData, isFetchSingleIncidentData]);

    useEffect(() => {
        const filteredData = resourceData.filter(
            (incident) => incident.IncidentID === clearState?.incidentID
        );
        setResourceDropDown(filteredData);
    }, [resourceData, clearState]);

    const onCloseLocation = () => {
        setOpenClearModal(false);
        clearClearState();
        clearErrorClearState();
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

    useEffect(() => {
        // Fetch data when the modal opens with the incident ID from the URL.
        if (IncID) {
            handleClearState("incidentID", IncID);
            refetchGetSingleIncident();
        }
        if (incidentID) {
            handleClearState("incidentID", incidentID);
            refetchGetSingleIncident();
        }
    }, [openClearModal]);

    const handleSelectCADEvent = (selectedOption) => {
        clearClearState();
        clearErrorClearState();
        handleClearState("incidentID", selectedOption?.IncidentID);
        refetchGetSingleIncident();  // Triggers the API call with the new ID
        setDispositionDropDown([]);
    };

    const validateDispatch = () => {
        let isError = false;
        const keys = Object.keys(errorClearState);

        keys.forEach((field) => {
            if (field === "incidentID" && isEmpty(clearState[field])) {
                handleErrorClearState(field, true);
                isError = true;
            } else if (field === "CADDisposition" && isEmptyObject(clearState[field])) {
                handleErrorClearState(field, true);
                isError = true;
            } else {
                handleErrorClearState(field, false);
            }
        });

        return !isError;
    };

    async function handleSave() {
        if (!validateDispatch()) return;
        const resourceIDs = clearState.resources.map(item => item.ResourceID).join(',');

        const data = {
            IncidentID: clearState?.incidentID,
            PrimaryResourceId: clearState?.primaryResource?.ResourceID,
            IncidentDispositionsID: clearState?.CADDisposition?.IncidentDispositionsID,
            Comments: clearState?.Comments,
            Resources: resourceIDs,
            CreatedByUserFK: loginPinID,
            AgencyID: loginAgencyID,
        };
        const response = await MonitorServices.insertFinishClear(data);
        if (response?.status === 200) {
            toastifySuccess("Data Saved Successfully");
            incidentRefetch();
            resourceRefetch();
            onCloseLocation();
            refetchGetComments();
            const searchParams = new URLSearchParams(location.search);
            searchParams.delete("IncId");
            searchParams.delete("IncNo");
            searchParams.delete("isResourceView");
            searchParams.delete("IncSta");

            // Update the URL without the modal parameters
            navigate(`${location.pathname}?${searchParams.toString()}`);
        }
    }

    return (
        <>
            {openClearModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="clearModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '900px' }}>
                            <div className="modal-content modal-content-cad">
                                <div className="modal-body">
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
                                                    Finish/Clear CAD Event
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="d-flex card-body">
                                                <div
                                                    className="col-12"
                                                    style={{ display: "grid", gap: "5px" }}
                                                >
                                                    {/* Line 1 */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="new-label text-nowrap">CAD Event #{errorClearState.incidentID && isEmptyObject(clearState?.incidentID) && (
                                                                <p className="text-nowrap" style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CAD Event"}</p>
                                                            )}</label>
                                                        </div>
                                                        <div className="col-3">
                                                            <Select
                                                                name="incidentID"
                                                                styles={requiredFieldColourStyles}
                                                                // isClearable
                                                                options={incidentData}
                                                                value={incidentData?.find((i) => i?.IncidentID === clearState?.incidentID)}
                                                                getOptionLabel={(v) => v?.CADIncidentNumber}
                                                                getOptionValue={(v) => v?.IncidentID}
                                                                onChange={handleSelectCADEvent}
                                                                placeholder="Select..."
                                                                className="w-100"
                                                                maxMenuHeight={180}
                                                            />
                                                        </div>
                                                        <div className="col-1 d-flex align-self-center justify-content-end mt-1">
                                                            <label htmlFor="" className="new-label">
                                                                Unit #
                                                            </label>
                                                        </div>
                                                        <div className="col-6 d-flex align-items-center justify-content-end">
                                                            <Select
                                                                className="w-100"
                                                                isClearable
                                                                options={resourceDropDown}
                                                                placeholder="Select..."
                                                                name="Resources"
                                                                value={clearState.resources}
                                                                onChange={(selectedOptions) => {
                                                                    handleClearState("resources", selectedOptions);
                                                                }}
                                                                styles={fieldColourStyles}
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
                                                                isDisabled
                                                            />

                                                        </div>
                                                    </div>
                                                    {/* Line 2 */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">CFS Code</label>
                                                        </div>
                                                        <div className="col-2">
                                                            <input
                                                                type="text"
                                                                className="form-control py-1 new-input"
                                                                name="CFSCode"
                                                                placeholder="CFS Code"
                                                                value={clearState.CFSCode}
                                                                onChange={(v) => handleClearState("CFSCode", v.target.value)}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="col-3">
                                                            <input
                                                                type="text"
                                                                className="form-control py-1 new-input"
                                                                name="CFSDesc"
                                                                placeholder="CFS Description"
                                                                value={clearState.CFSDesc}
                                                                onChange={(v) => handleClearState("CFSDesc", v.target.value)}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Primary Unit #</label>
                                                        </div>
                                                        <div className="col-3">
                                                            <Select
                                                                className="w-100"
                                                                isClearable
                                                                options={resourceDropDown}
                                                                placeholder="Select..."
                                                                name="primaryResource"
                                                                value={clearState?.primaryResource}
                                                                onChange={(selectedOptions) => {
                                                                    handleClearState("primaryResource", selectedOptions);
                                                                }}
                                                                styles={fieldColourStyles}
                                                                maxMenuHeight={180}
                                                                getOptionLabel={(v) => v?.ResourceNumber}
                                                                getOptionValue={(v) => v?.ResourceID}
                                                                onInputChange={(inputValue, actionMeta) => {
                                                                    if (inputValue.length > 12) {
                                                                        return inputValue.slice(0, 12);
                                                                    }
                                                                    return inputValue;
                                                                }}
                                                                // isMulti
                                                                isSearchable={true}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Line 3 */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">RMS Incident #</label>
                                                        </div>
                                                        <div className="col-4">
                                                            <input
                                                                type="text"
                                                                className="form-control py-1 new-input"
                                                                name="RMSIncident"
                                                                placeholder="RMS Incident"
                                                                value={clearState.RMSIncident}
                                                                onChange={(v) => handleClearState("RMSIncident", v.target.value)}
                                                                readOnly
                                                            />
                                                        </div>
                                                        <div className="col-2 d-flex align-self-center justify-content-end mt-1">
                                                            <label htmlFor="" className="new-label">
                                                                Master Incident #
                                                            </label>
                                                        </div>
                                                        <div className="col-4 d-flex align-items-center justify-content-end">
                                                            <input
                                                                type="text"
                                                                className="form-control py-1 new-input"
                                                                name="masterIncident"
                                                                placeholder="Master Incident"
                                                                value={clearState.masterIncident}
                                                                onChange={(v) => handleClearState("masterIncident", v.target.value)}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Line 4 */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex align-self-center justify-content-end">
                                                            <label htmlFor="" className="new-label">
                                                                CAD Disposition{errorClearState.CADDisposition && isEmptyObject(clearState?.CADDisposition) && (
                                                                    <p className="text-nowrap" style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CAD Disposition"}</p>
                                                                )}
                                                            </label>
                                                        </div>
                                                        <div className="col-4 d-flex align-items-center" style={{ gap: "15px" }}>
                                                            <Select
                                                                isClearable
                                                                placeholder="Select..."
                                                                options={dispositionDropDown}
                                                                getOptionLabel={(v) => `${v?.DispositionCode} | ${v?.Description}`}
                                                                getOptionValue={(v) => v?.IncidentDispositionsID}
                                                                styles={requiredFieldColourStyles}
                                                                formatOptionLabel={(option, { context }) => {
                                                                    return context === 'menu'
                                                                        ? `${option?.DispositionCode} | ${option?.Description}`
                                                                        : option?.DispositionCode;
                                                                }}
                                                                className="w-100"
                                                                maxMenuHeight={180}
                                                                value={clearState?.CADDisposition}
                                                                onChange={(e) => handleClearState("CADDisposition", e)}
                                                                name="CADDisposition"
                                                                isDisabled={!clearState?.incidentID}

                                                            />
                                                        </div>
                                                        <div className="col-2 d-flex align-self-center justify-content-end mt-1">
                                                            <label htmlFor="" className="new-label">
                                                                Report Date & Time
                                                            </label>
                                                        </div>
                                                        <div className="col-4 d-flex align-items-center justify-content-end">
                                                            <input
                                                                name="reportDateTime"
                                                                className="form-control py-1 new-input"
                                                                placeholder="Reported Date & Time"
                                                                value={
                                                                    clearState.reportDateTime
                                                                        ? clearState.reportDateTime.slice(0, 16) // Formats to "YYYY-MM-DDTHH:mm"
                                                                        : ""
                                                                }
                                                                onChange={(v) => handleClearState("reportDateTime", v.target.value)}
                                                                readOnly
                                                            />


                                                        </div>
                                                    </div>
                                                    {/* Line 5 */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Location</label>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="d-flex align-items-center" style={{ marginLeft: 'auto', gap: '8px' }}>
                                                                <input
                                                                    type="text"
                                                                    className="form-control py-1 new-input"
                                                                    name="Location"
                                                                    placeholder="Location"
                                                                    value={clearState.Location}
                                                                    onChange={(v) => handleClearState("Location", v.target.value)}
                                                                    readOnly
                                                                />
                                                                {
                                                                    (clearState?.isVerifyReportedLocation === 1 && clearState.Location) && (
                                                                        <span className="badge text-white p-2" style={{ backgroundColor: "#008000" }}>Verified</span>
                                                                    )
                                                                }
                                                                {
                                                                    (clearState?.isVerifyReportedLocation === 0 && clearState.Location) && (
                                                                        <OverlayTrigger
                                                                            placement="bottom"
                                                                            overlay={<BootstrapTooltip id="tooltip" style={{ zIndex: 9999 }}>Please verify the unverified location through the GEO tab.</BootstrapTooltip>}
                                                                        >
                                                                            <span className="badge text-white p-2" style={{ textDecoration: "underline", backgroundColor: "#ff0000", cursor: "pointer" }}>
                                                                                Unverified
                                                                            </span>
                                                                        </OverlayTrigger>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>

                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Apt#/Suite</label>
                                                        </div>
                                                        <div className="col-2">
                                                            <input
                                                                type="text"
                                                                className="form-control py-1 new-input"
                                                                name="APTSuit"
                                                                placeholder="APT#/Suite"
                                                                value={clearState.APTSuit}
                                                                onChange={(v) => handleClearState("APTSuit", v.target.value)}
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Line 6 */}
                                                    <div className="tab-form-row">
                                                        <div className="col-2 d-flex justify-content-end">
                                                            <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Comments</label>
                                                        </div>
                                                        <div className="col-10">
                                                            <textarea name="Comments" rows="3"
                                                                placeholder="Comments"
                                                                className="form-control py-1 new-input" value={clearState?.Comments}
                                                                style={{ height: "auto", overflowY: "scroll" }}
                                                                onChange={(e) => {
                                                                    handleClearState("Comments", e.target.value);
                                                                    e.target.style.height = "auto";
                                                                    const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                                    e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                                }} />
                                                        </div>
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
                                                        onClick={handleSave}
                                                    >
                                                        {"Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        data-dismiss="modal"
                                                        className="cancel-button"
                                                        onClick={onCloseLocation}
                                                    >
                                                        {"Cancel"}
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
            )}
        </>
    );
};

// Adding propTypes for safety
ClearModal.propTypes = {
    openClearModal: PropTypes.bool.isRequired,      // Whether the modal is open
    setOpenClearModal: PropTypes.func.isRequired,   // Function to set modal open state
    incidentID: PropTypes.number,                   // Incident ID (optional, depending on context)
};

export default memo(ClearModal);
