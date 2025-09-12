import { memo, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types'; // Import PropTypes
import Select from "react-select";
import { requiredFieldColourStyles } from "../Utility/CustomStylesForReact";
import { useSelector } from "react-redux";
import useObjState from "../../CADHook/useObjState";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import GeoServices from "../../CADServices/APIs/geo";
import { IncidentContext } from "../../CADContext/Incident";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";

const CloseCallModal = (props) => {
    const { openCloseCallModal, setOpenCloseCallModal, setSelectedButton = () => { }, getResourceValues, createPayload, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID, insertIncident, setNameData, setVehicleData, onCloseLocation, receiveSourceDropDown, isDuplicateCall = false, incNo, incidentFormValues, refetchQueueCall = () => { }, setDocData } = props;

    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { incidentRefetch, resourceRefetch } = useContext(IncidentContext);
    const [isChangeFields, setIsChangeFields] = useState(false);
    const [receiveSourceID, setReceiveSourceID,] = useState(null);
    const [isAPICall, setIsAPICall] = useState(false);
    const [dispositionDropDown, setDispositionDropDown] = useState([]);

    const [
        closeCallState,
        ,
        handleCloseCallState,
        clearCloseCallState,
    ] = useObjState({
        incidentID: "",
        callDisposition: "",
        reason: "",
    });

    const [
        errorCloseCall,
        ,
        handleErrorCloseCall,
        clearStateCloseCall,
    ] = useObjState({
        callDisposition: false,
        reason: false,
        ReceiveSourceID: false,
    });

    useEffect(() => {
        async function fetchData() {
            if (localStoreData && incidentFormValues) {
                if (localStoreData?.AgencyID) {
                    const payload = {
                        AgencyID: localStoreData?.AgencyID,
                        CFSDetails: [
                            incidentFormValues?.CFSL ? '1' : '',
                            incidentFormValues?.CFSF ? '2' : '',
                            incidentFormValues?.CFSE ? '3' : '',
                            incidentFormValues?.OTHER ? '4' : ''
                        ].filter(Boolean).join(','),
                    };

                    try {
                        const response = await MasterTableListServices.getDispositionData(payload);
                        const data = JSON.parse(response?.data?.data);
                        setDispositionDropDown(data?.Table);
                    } catch (error) { }
                }
            }
        }
        fetchData();
    }, [localStoreData, incidentFormValues]);

    const onCloseCallLocation = () => {
        setOpenCloseCallModal(false);
        setSelectedButton((prevSelected) =>
            prevSelected.includes(6)
                ? prevSelected.filter(item => item !== 6)
                : [...prevSelected, 6]
        );
        setIsChangeFields(false);
        clearCloseCallState();
        clearStateCloseCall();
    };

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            onCloseCallLocation();
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    const validateGeoFormValues = () => {
        let isError = false;
        const keys = Object.keys(errorCloseCall);
        keys.map((field) => {
            if (
                field === "callDisposition" &&
                isEmpty(closeCallState[field])) {
                handleErrorCloseCall(field, true);
                isError = true;
            } else if (field === "reason" && isEmpty(closeCallState[field])) {
                handleErrorCloseCall(field, true);
                isError = true;
            } else if (field === "ReceiveSourceID" && isEmptyObject(receiveSourceID) && isDuplicateCall) {
                handleErrorCloseCall(field, true);
                isError = true;
            } else {
                handleErrorCloseCall(field, false);
            }
            return null;
        });
        return !isError;
    };

    const handleSelectChangeIncident = (selectedOption) => {
        if (selectedOption) {
            setReceiveSourceID(selectedOption);
            setIsChangeFields(true);
        } else {
            setReceiveSourceID(null);
            setIsChangeFields(true);
        }
    };

    const createBaseFormData = useCallback((resourceValues, geoLocationID = null) => {
        let formData = createPayload(resourceValues, geoLocationID);
        formData = {
            ...formData,
            CallDisposition: closeCallState?.callDisposition,
            ClosingReason: closeCallState?.reason,
            IncidentID: incNo || "",
        };

        if (isDuplicateCall) {
            formData = {
                ...formData,
                ReceiveSourceID: receiveSourceID?.ReceiveSourceID || 0,
            };
        }
        return formData;
    }, [closeCallState, incNo, isDuplicateCall, receiveSourceID, createPayload]);

    const handleGoogleLocationInsert = useCallback(async (resourceValues) => {
        const locationPayload = createLocationPayload();
        const response = await GeoServices.insertLocation(locationPayload);
        
        if (!response?.data?.success) return null;
        
        const data = JSON.parse(response?.data?.data);
        const newGeoLocationID = data?.Table[0]?.GeoLocationID;
        setGeoLocationID(newGeoLocationID);
        
        return newGeoLocationID;
    }, [createLocationPayload, setGeoLocationID]);

    const performCleanup = useCallback(() => {
        incidentRefetch();
        refetchQueueCall();
        resourceRefetch();
        setNameData([]);
        setVehicleData([]);
        setDocData([]);
        onCloseLocation();
        onCloseCallLocation();
        setIsAPICall(false);
        setSelectedButton((prevSelected) =>
            prevSelected.includes(6)
                ? prevSelected.filter((item) => item !== 6)
                : [...prevSelected, 6]
        );
    }, [incidentRefetch, refetchQueueCall, resourceRefetch, setNameData, setVehicleData, setDocData, onCloseLocation, onCloseCallLocation, setSelectedButton]);

    async function handleSave() {
        if (!validateGeoFormValues()) return;
        
        setIsAPICall(true);
        const resourceValues = getResourceValues();
        let formData = createBaseFormData(resourceValues);

        if (isGoogleLocation && !geoLocationID) {
            const newGeoLocationID = await handleGoogleLocationInsert(resourceValues);
            if (newGeoLocationID) {
                formData = createBaseFormData(resourceValues, newGeoLocationID);
                setIsChangeFields(false);
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }
        }

        await insertIncident(formData);
        performCleanup();
    }

    return (
        <>
            {openCloseCallModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "300", overflowY: "hidden" }}
                        id="CloseCallModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-lg">
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
                                                    Close Call
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            {/* Row 1 */}
                                            <div className="tab-form-container">
                                                {isDuplicateCall && <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label
                                                            htmlFor=""
                                                            className="new-label text-nowrap" style={{ textAlign: "end", paddingTop: "8px" }}
                                                        >
                                                            Receive Source{errorCloseCall.ReceiveSourceID && isEmptyObject(receiveSourceID) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Receive Source"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            isClearable
                                                            options={receiveSourceDropDown}
                                                            placeholder="Select..."
                                                            styles={requiredFieldColourStyles}
                                                            className="w-100"
                                                            name="ReceiveSourceID"
                                                            maxMenuHeight={150}
                                                            isSearchable
                                                            getOptionLabel={(v) => v?.ReceiveSourceCode}
                                                            getOptionValue={(v) => v?.ReceiveSourceID}
                                                            value={receiveSourceID}
                                                            onChange={handleSelectChangeIncident}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                </div>}
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label className="tab-form-label">
                                                            Call Disposition {errorCloseCall.callDisposition && isEmpty(closeCallState?.callDisposition) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Call Disposition"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            isClearable
                                                            placeholder="Select..."
                                                            options={dispositionDropDown}
                                                            maxMenuHeight={150}
                                                            getOptionLabel={(v) => v?.Description}
                                                            getOptionValue={(v) => v?.IncidentDispositionsID}
                                                            styles={requiredFieldColourStyles}
                                                            className="w-100"
                                                            value={dispositionDropDown?.find((i) => i?.IncidentDispositionsID === closeCallState?.callDisposition)}
                                                            onChange={(e) => { handleCloseCallState("callDisposition", e?.IncidentDispositionsID); setIsChangeFields(true); }}
                                                            name="CADDisposition" />
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label className="tab-form-label">
                                                            Closing Reason {errorCloseCall.reason && isEmpty(closeCallState.reason) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Closing Reason"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-8 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input requiredColor"
                                                            name="PremiseNo"
                                                            value={closeCallState.reason}
                                                            onChange={(e) => { handleCloseCallState("reason", e.target.value); setIsChangeFields(true); }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                    <button
                                                        type="button"
                                                        className="save-button ml-2"
                                                        disabled={!isChangeFields}
                                                        onClick={() => handleSave()}
                                                    >
                                                        {"Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="cancel-button"
                                                        disabled={isAPICall}
                                                        onClick={() => {
                                                            onCloseCallLocation();
                                                        }}
                                                    >
                                                        Close
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

// PropTypes for the CloseCallModal component
CloseCallModal.propTypes = {
    openCloseCallModal: PropTypes.bool.isRequired,          // Whether the modal is open
    setOpenCloseCallModal: PropTypes.func.isRequired,       // Function to set modal open state
    setSelectedButton: PropTypes.func,                      // Function to manage selected buttons
    getResourceValues: PropTypes.func.isRequired,           // Function to retrieve resource values
    createPayload: PropTypes.func.isRequired,               // Function to create the payload
    isGoogleLocation: PropTypes.bool.isRequired,            // Whether the location is from Google
    createLocationPayload: PropTypes.func.isRequired,       // Function to create location payload
    geoLocationID: PropTypes.number,                        // GeoLocation ID
    setGeoLocationID: PropTypes.func.isRequired,            // Function to set GeoLocation ID
    insertIncident: PropTypes.func.isRequired,              // Function to insert incident data
    setNameData: PropTypes.func.isRequired,                 // Function to set name data
    setVehicleData: PropTypes.func.isRequired,              // Function to set vehicle data
    onCloseLocation: PropTypes.func.isRequired,             // Function to handle closing location
    receiveSourceDropDown: PropTypes.array.isRequired,      // Array of receive sources for dropdown
    isDuplicateCall: PropTypes.bool,                        // Whether it is a duplicate call
    incNo: PropTypes.string,                                // Incident number
    incidentFormValues: PropTypes.object.isRequired,        // Incident form values
    refetchQueueCall: PropTypes.func.isRequired,            // Function to refetch the queue call data
    setDocData: PropTypes.func.isRequired,                  // Function to set document data
};

export default memo(CloseCallModal);
