import { memo, useContext, useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from 'react-redux';
import { toastifySuccess } from '../../../Components/Common/AlertMsg';
import useObjState from '../../../CADHook/useObjState';
import { isEmpty, isEmptyObject } from '../../../CADUtils/functions/common';
import CallTakerServices from "../../../CADServices/APIs/callTaker";
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import GeoServices from "../../../CADServices/APIs/geo";
import { getShowingMonthDateYear } from '../../../Components/Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import { getData_DropDown_Priority } from '../../../CADRedux/actions/DropDownsData';

const FlagModal = (props) => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const { GetDataTimeZone, datezone } = useContext(AgencyContext);
    const [loginPinID, setLoginPinID] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState();
    const [flagData, setFlagData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { openAddFlagModal, setOpenAddFlagModal, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID = () => { }, getFlagListRefetch, selectedFlagData, setSelectedFlagData, refetchSingleIncidentData = () => { }, aptData, setAptData, refetchAptSuiteNoData } = props;

    const [
        flagState,
        setFlagState,
        handleFlagState,
        clearFlagState,
    ] = useObjState({
        flagId: "",
        flagName: "",
        priority: "",
        startDate: "",
        endDate: "",
        startNote: "",
        endNote: "",
    });

    const [
        errorFlagState,
        ,
        handleErrorFlagState,
        clearErrorFlagState,
    ] = useObjState({
        flagName: false,
        startDate: false,
    });

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20, minHeight: 33, fontSize: 14, margintop: 2, boxShadow: 0,
        }),
    };

    const getTypeOfFlagKey = `/CAD/MasterTypeOfFlag/GetData_DropDown_Flag/${loginAgencyID}`;
    const { data: getTypeOfFlagData, isSuccess: isFetchGetTypeOfFlag, refetch, isError: isNoData } = useQuery(
        [getTypeOfFlagKey, {
            "AgencyID": loginAgencyID,
        },],
        MasterTableListServices.getData_DropDown_Flag,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID && openAddFlagModal
        }
    );

    // Extract validation logic to reduce complexity
    const validateField = (fieldName, fieldValue) => {
        if (fieldName === "flagName" && isEmptyObject(fieldValue)) {
            handleErrorFlagState(fieldName, true);
            return false;
        }
        if (fieldName === "startDate" && (isEmpty(fieldValue) || fieldValue === null)) {
            handleErrorFlagState(fieldName, true);
            return false;
        }
        handleErrorFlagState(fieldName, false);
        return true;
    };

    const validateDispatch = () => {
        const fields = ["flagName", "startDate"];
        let hasError = false;
        
        fields.forEach((field) => {
            if (!validateField(field, flagState[field])) {
                hasError = true;
            }
        });
        
        return !hasError;
    };

    // Extract location creation logic
    const createLocationAndGetIds = async () => {
        const locationPayload = createLocationPayload();
        const response = await GeoServices.insertLocation(locationPayload);
        
        if (!response?.data?.success) {
            console.error("Failed to fetch GeoLocation");
            return { flagFromId: "", ApartmentId: "" };
        }
        
        const data = JSON.parse(response?.data?.data);
        const newGeoLocationID = data?.Table[0]?.GeoLocationID;
        const aptID = data?.Table[0]?.AptID;
        
        setGeoLocationID(newGeoLocationID);
        setAptData((prevState) => ({
            ...prevState,
            aptId: aptID,
        }));
        
        return { flagFromId: newGeoLocationID, ApartmentId: aptID };
    };

    // Extract flag data preparation
    const prepareFlagData = (isUpdate, flagFromId, ApartmentId) => {
        return {
            ...(isUpdate && { FlagId: flagState?.flagId }),
            FlagTypeId: flagState?.flagName?.FlagID,
            FlagFromId: flagFromId,
            FlagFrom: "GEO",
            FlagDateFrom: flagState?.startDate ? getShowingMonthDateYear(flagState?.startDate) : "",
            FlagDateTo: flagState?.endDate ? getShowingMonthDateYear(flagState?.endDate) : "",
            Priority: flagState?.flagName?.PriorityID,
            StartNote: flagState?.startNote,
            EndNote: flagState?.endNote,
            IsActive: 1,
            AgencyID: loginAgencyID,
            CreatedByUserFK: isUpdate ? undefined : loginPinID,
            ModifiedByUserFK: isUpdate ? loginPinID : undefined,
            AptID: ApartmentId
        };
    };

    // Extract success handling
    const handleSuccess = (isUpdate) => {
        if (isUpdate) {
            toastifySuccess("Data Updated Successfully");
        } else {
            toastifySuccess("Data Saved Successfully");
        }
        getFlagListRefetch();
        refetchSingleIncidentData();
        refetchAptSuiteNoData();
        handleClose();
    };

    async function handleSave() {
        if (!validateDispatch()) return;
        
        setIsLoading(true);
        const isUpdate = !!flagState?.flagId;
        let flagFromId = "";
        let ApartmentId = "";

        try {
            // Handle Google location case
            if (isGoogleLocation && !geoLocationID) {
                const { flagFromId: newFlagFromId, ApartmentId: newApartmentId } = await createLocationAndGetIds();
                flagFromId = newFlagFromId;
                ApartmentId = newApartmentId;
            } else {
                // Handle existing location case
                if (!aptData?.aptId) {
                    const { flagFromId: newFlagFromId, ApartmentId: newApartmentId } = await createLocationAndGetIds();
                    flagFromId = newFlagFromId;
                    ApartmentId = newApartmentId;
                } else {
                    flagFromId = geoLocationID;
                    ApartmentId = aptData?.aptId;
                }
            }

            const flagData = prepareFlagData(isUpdate, flagFromId, ApartmentId);
            const response = await CallTakerServices.insertFlag(flagData);
            
            if (response?.status === 200) {
                handleSuccess(isUpdate);
            }
        } catch (error) {
            console.error("Error saving flag:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (getTypeOfFlagData && isFetchGetTypeOfFlag) {
            const data = JSON.parse(getTypeOfFlagData?.data?.data);
            setFlagData(data?.Table)
        } else {
            setFlagData([])
        }
    }, [getTypeOfFlagData, isFetchGetTypeOfFlag])

    useEffect(() => {
        if (selectedFlagData?.FlagID) {
            setFlagState({
                flagId: selectedFlagData.FlagID,
                flagName: flagData?.find((i) => i?.FlagID === selectedFlagData.FlagTypeId),
                priority: PriorityDrpData?.find((i) => i?.PriorityID === selectedFlagData.Priority)?.Description,
                startDate: selectedFlagData.FlagDateFrom ? new Date(selectedFlagData.FlagDateFrom) : null,
                endDate: selectedFlagData.FlagDateTo ? new Date(selectedFlagData.FlagDateTo) : null,
                startNote: selectedFlagData.StartNote || "",
                endNote: selectedFlagData.EndNote || "",
            });
        }
    }, [selectedFlagData, openAddFlagModal, getTypeOfFlagData, flagData]);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const handleClose = () => {
        clearFlagState();
        clearErrorFlagState();
        setSelectedFlagData({});
        setOpenAddFlagModal(false);
    };

    // Extract textarea change handler
    const handleTextareaChange = (fieldName, value, event) => {
        handleFlagState(fieldName, value);
        event.target.style.height = "auto";
        const maxHeight = 3 * parseFloat(getComputedStyle(event.target).lineHeight);
        event.target.style.height = `${Math.min(event.target.scrollHeight, maxHeight)}px`;
    };

    // Extract date change handler
    const handleStartDateChange = (date) => {
        if (date) {
            handleFlagState("startDate", getShowingMonthDateYear(date));
        } else {
            handleFlagState("startDate", null);
            handleFlagState("endDate", null);
        }
    };

    const handleEndDateChange = (date) => {
        handleFlagState("endDate", date ? getShowingMonthDateYear(date) : null);
    };

    // Extract error message component
    const ErrorMessage = ({ show, message }) => {
        if (!show) return null;
        return <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{message}</p>;
    };

    return (
        <>
            {openAddFlagModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="addFlagModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered CAD-sub-modal-width">
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
                                                    Add Flag
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-row">
                                                <div className="col-2 d-flex justify-content-end">
                                                    <label htmlFor="" className="tab-form-label justify-content-end mr-1 text-nowrap" style={{ textAlign: "end" }}>
                                                        Flag Name<ErrorMessage show={errorFlagState.flagName && isEmptyObject(flagState.flagName)} message="Select Flag Name" />
                                                    </label>
                                                </div>
                                                <div className="col-4 d-flex align-items-center" style={{ gap: "15px" }}>
                                                    <Select
                                                        name="flagName"
                                                        styles={colourStyles}
                                                        placeholder="Select"
                                                        options={flagData}
                                                        getOptionLabel={(v) => v?.FlagNameCode}
                                                        getOptionValue={(v) => v?.FlagID}
                                                        isClearable
                                                        value={flagState?.flagName}
                                                        className="w-100"
                                                        onChange={(e) => { handleFlagState("flagName", e) }}
                                                    />
                                                </div>
                                                <div className="col-2 d-flex justify-content-end">
                                                    <label htmlFor="" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">
                                                        Priority
                                                    </label>
                                                </div>
                                                <div className="col-4 d-flex align-items-center justify-content-end">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        placeholder='Priority'
                                                        value={flagState?.flagName?.PriorityID ? PriorityDrpData?.find((i) => i?.PriorityID === flagState?.flagName?.PriorityID)?.Description : ""}
                                                        readOnly
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                            <div className="tab-form-row">
                                                <div className="col-2 d-flex align-self-center justify-content-end">
                                                    <label htmlFor="" className="tab-form-label justify-content-end mr-1 text-nowrap" style={{ textAlign: "end" }}>
                                                        Start Date<ErrorMessage show={errorFlagState.startDate && (isEmpty(flagState.startDate) || flagState?.startDate === null)} message="Select Start Date" />
                                                    </label>
                                                </div>
                                                <div className="col-4 d-flex align-items-center">
                                                    <DatePicker
                                                        name="startDate"
                                                        id="startDate"
                                                        className="requiredColor"
                                                        onChange={handleStartDateChange}
                                                        selected={flagState.startDate ? flagState.startDate && new Date(flagState.startDate) : null}
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={!!flagState.startDate}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete="off"
                                                        placeholderText="Select Start Date..."
                                                        minDate={new Date(datezone)}
                                                    />

                                                </div>
                                                <div className="col-2 d-flex align-self-center justify-content-end">
                                                    <label htmlFor="" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">
                                                        End Date
                                                    </label>
                                                </div>
                                                <div className="col-4 d-flex align-items-center justify-content-end">
                                                    <DatePicker
                                                        name='endDate'
                                                        id='endDate'
                                                        onChange={handleEndDateChange}
                                                        selected={flagState.endDate ? flagState.endDate && new Date(flagState.endDate) : null}
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={!!flagState.endDate}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete="off"
                                                        placeholderText="Select End Date..."
                                                        minDate={new Date(flagState.startDate) || new Date(datezone)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="tab-form-row mt-1">
                                                <div className="col-2 d-flex align-self-center justify-content-end">
                                                    <label htmlFor="" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap" style={{ textAlign: "end" }}>
                                                        Start Notes</label>
                                                </div>
                                                <div className="col-4 d-flex align-items-center" style={{ gap: "15px" }}>
                                                    <textarea name="startNote"
                                                        placeholder="Start Notes"
                                                        cols="30"
                                                        rows='2'
                                                        className="form-control pt-2 pb-2 "
                                                        value={flagState?.startNote}
                                                        style={{ resize: 'none' }}
                                                        onChange={(e) => handleTextareaChange("startNote", e.target.value, e)}
                                                        maxLength={120}
                                                    />
                                                </div>
                                                <div className="col-2 d-flex align-self-center justify-content-end">
                                                    <label htmlFor="" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">
                                                        End Notes
                                                    </label>
                                                </div>
                                                <div className="col-4 d-flex align-items-center justify-content-end">
                                                    <textarea name="endNote"
                                                        placeholder="End Notes"
                                                        cols="30"
                                                        rows='2'
                                                        className="form-control pt-2 pb-2 "
                                                        value={flagState?.endNote}
                                                        style={{ resize: 'none' }}
                                                        onChange={(e) => handleTextareaChange("endNote", e.target.value, e)}
                                                        maxLength={120}
                                                    />
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
                                                        disabled={isLoading}
                                                        onClick={() => handleSave()}
                                                    >
                                                        {"Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        data-dismiss="modal"
                                                        className="cancel-button"
                                                        onClick={() => handleClose()}
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
            )
            }
        </>
    );
};

export default memo(FlagModal)

// PropTypes definition
FlagModal.propTypes = {
  openAddFlagModal: PropTypes.bool.isRequired,
  setOpenAddFlagModal: PropTypes.func.isRequired,
  isGoogleLocation: PropTypes.bool,
  createLocationPayload: PropTypes.func,
  geoLocationID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setGeoLocationID: PropTypes.func,
  getFlagListRefetch: PropTypes.func,
  selectedFlagData: PropTypes.object,
  setSelectedFlagData: PropTypes.func,
  refetchSingleIncidentData: PropTypes.func,
  aptData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setAptData: PropTypes.func,
  refetchAptSuiteNoData: PropTypes.func
};

// Default props
FlagModal.defaultProps = {
  isGoogleLocation: false,
  createLocationPayload: () => {},
  geoLocationID: null,
  setGeoLocationID: () => {},
  getFlagListRefetch: () => {},
  selectedFlagData: {},
  setSelectedFlagData: () => {},
  refetchSingleIncidentData: () => {},
  aptData: "",
  setAptData: () => {},
  refetchAptSuiteNoData: () => {}
};