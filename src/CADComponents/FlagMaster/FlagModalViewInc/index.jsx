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

const FlagModalViewInc = (props) => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const { GetDataTimeZone, datezone } = useContext(AgencyContext);
    const [loginPinID, setLoginPinID] = useState(1);
    const [loginAgencyID, setLoginAgencyID] = useState();
    const [flagData, setFlagData] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const { openAddFlagModalViewInc, setOpenAddFlagModalViewInc, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID = () => { }, getFlagListRefetch, selectedFlagData, setSelectedFlagData, refetchSingleIncidentData = () => { }, aptData, setAptData, refetchAptSuiteNoData } = props;

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
            enabled: !!loginAgencyID && openAddFlagModalViewInc
        }
    );

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
    }, [selectedFlagData, openAddFlagModalViewInc, getTypeOfFlagData, flagData]);

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
        setOpenAddFlagModalViewInc(false);
    };

    const validateDispatch = () => {
        let isError = false;
        const keys = Object.keys(errorFlagState);
        keys.forEach((field) => {
            if (
                field === "flagName" &&
                isEmptyObject(flagState[field])) {
                handleErrorFlagState(field, true);
                isError = true;
            }
            else if (field === "startDate" && (isEmpty(flagState[field]) || flagState?.startDate === null)) {
                handleErrorFlagState(field, true);
                isError = true;
            }
            else {
                handleErrorFlagState(field, false);
            }
        });
        return !isError;
    };

    async function handleSave() {
        if (!validateDispatch()) return;
        setIsDisabled(true)
        const isUpdate = !!flagState?.flagId;

        let flagFromId = "";
        let ApartmentId = "";

        if (isGoogleLocation && !geoLocationID) {
            const locationPayload = createLocationPayload();
            const response = await GeoServices.insertLocation(locationPayload);

            if (response?.data?.success) {
                if (!geoLocationID) {
                    const data = JSON.parse(response?.data?.data);
                    const newGeoLocationID = data?.Table[0]?.GeoLocationID;
                    const aptID = data?.Table[0]?.Column1;

                    setGeoLocationID(newGeoLocationID);
                    setAptData((prevState) => ({
                        ...prevState,
                        aptId: aptID,
                    }));
                    flagFromId = newGeoLocationID; // Set FlagFromId to the fetched geoId
                    ApartmentId = aptID;

                }
            } else {
                console.error("Failed to fetch GeoLocation");
            }
        } else {
            if (isEmptyObject(aptData) || (aptData && !aptData?.aptId)) {
                const locationPayload = createLocationPayload();
                const response = await GeoServices.insertLocation(locationPayload);
                if (response?.data?.success) {
                    const data = JSON.parse(response?.data?.data);

                    const newGeoLocationID = data?.Table[0]?.GeoLocationID;
                    const aptID = data?.Table[0]?.AptID;
                    setGeoLocationID(newGeoLocationID);
                    setAptData((prevState) => ({
                        ...prevState,
                        aptId: aptID,
                    }));
                    flagFromId = newGeoLocationID; // Set FlagFromId to the fetched geoId
                    ApartmentId = aptID;
                } else {
                    console.error("Failed to fetch GeoLocation");
                }
            }
            else {
                flagFromId = geoLocationID;
                ApartmentId = aptData?.aptId;
            }
        }

        const data = {
            ...(isUpdate && { FlagId: flagState?.flagId }),
            FlagTypeId: flagState?.flagName?.FlagID,
            FlagFromId: flagFromId,
            FlagFrom: "GEO",
            FlagDateFrom: flagState?.startDate,
            FlagDateTo: flagState?.endDate,
            Priority: flagState?.flagName?.PriorityID,
            StartNote: flagState?.startNote,
            EndNote: flagState?.endNote,
            IsActive: 1,
            AgencyID: loginAgencyID,
            CreatedByUserFK: isUpdate ? undefined : loginPinID,
            ModifiedByUserFK: isUpdate ? loginPinID : undefined,
            AptID: ApartmentId

        }
        const response = await CallTakerServices.insertFlag(data);
        if (response?.status === 200) {
            if (isUpdate) { toastifySuccess("Data Updated Successfully"); }
            else { toastifySuccess("Data Saved Successfully"); }
            getFlagListRefetch();
            refetchSingleIncidentData();
            refetchAptSuiteNoData();

            handleClose()
        }
        setIsDisabled(false);
    }

    return (
        <>
            {openAddFlagModalViewInc ? (
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
                                                        Flag Name{errorFlagState.flagName && isEmptyObject(flagState.flagName) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Flag Name"}</p>
                                                        )}</label>
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
                                                        Start Date{errorFlagState.startDate && (isEmpty(flagState.startDate) || flagState?.startDate === null) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Start Date"}</p>
                                                        )}</label>
                                                </div>
                                                <div className="col-4 d-flex align-items-center">
                                                    <DatePicker
                                                        name="startDate"
                                                        id="startDate"
                                                        className="requiredColor"
                                                        onChange={(v) => {
                                                            if (v) { handleFlagState("startDate", v ? getShowingMonthDateYear(v) : null) } else {
                                                                handleFlagState("startDate", null)
                                                                handleFlagState("endDate", null)
                                                            }
                                                        }}
                                                        selected={flagState.startDate ? flagState.startDate && new Date(flagState.startDate) : null}
                                                        dateFormat="MM/dd/yyyy"
                                                        isClearable={!!flagState.startDate}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete="off"
                                                        placeholderText="Select Start Date..."
                                                        maxDate={flagState.endDate || null}
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
                                                        onChange={(v) => handleFlagState("endDate", v ? getShowingMonthDateYear(v) : null)}
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
                                                        onChange={(e) => {
                                                            handleFlagState("startNote", e.target.value)
                                                            e.target.style.height = "auto";
                                                            const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                            e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                        }}
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
                                                        onChange={(e) => {
                                                            handleFlagState("endNote", e.target.value)
                                                            e.target.style.height = "auto";
                                                            const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                            e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                        }}
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
                                                        disabled={isDisabled}
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

export default memo(FlagModalViewInc)

// PropTypes definition
FlagModalViewInc.propTypes = {
  openAddFlagModalViewInc: PropTypes.bool.isRequired,
  setOpenAddFlagModalViewInc: PropTypes.func.isRequired,
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
FlagModalViewInc.defaultProps = {
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