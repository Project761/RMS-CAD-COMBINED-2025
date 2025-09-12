import { memo, useCallback, useContext, useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { useQuery } from 'react-query';
import ResourcesStatusServices from "../../CADServices/APIs/resourcesStatus";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import GeoServices from "../../CADServices/APIs/geo";
import useObjState from "../../CADHook/useObjState";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { useSelector } from "react-redux";
import { IncidentContext } from "../../CADContext/Incident";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import { useLocation } from "react-router-dom";
import Location from "../Common/Location";
import { colourStyles, customStylesWithOutColor } from "../Utility/CustomStylesForReact";

const MiscellaneousModal = (props) => {
    const { openMiscModal, setOpenMiscModal } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { resourceData, resourceRefetch, incidentRefetch, refetchGetComments } = useContext(IncidentContext);
    const [statusData, setStatusData] = useState([])
    const [loginAgencyID, setLoginAgencyID] = useState();
    const [locationData, setLocationData] = useState();
    const [isSelectLocation, setIsSelectLocation] = useState(false);
    const [locationStatus, setLocationStatus] = useState(false);
    const [loginPinID, setLoginPinID] = useState(1);
    const [selectedDutyStatus, setSelectedDutyStatus] = useState("placeInto");
    const [statusDropdown, setStatusDropdown] = useState([]);
    const [
        misceState,
        setMisceState,
        handleMisceState,
        clearMisceState,
    ] = useObjState({
        Resources: "",
        statusCode: [],
        Comments: "",
        Location: ""
    });
    const [
        errorMisce,
        ,
        handleErrorMisce,
        clearStateMisce,
    ] = useObjState({
        Location: false,
        Resources: false,
        statusCode: false,
    });

    const useRouteQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };
    const query = useRouteQuery();

    let resourceID = query?.get("resourceID");
    if (!resourceID) resourceID = 0;
    else resourceID = parseInt(resourceID);

    useEffect(() => {
        if (resourceID) {
            handleMisceState("Resources", [resourceData.filter(item => item.Status === "AV")?.find((i) => i?.ResourceID === resourceID)])
        }
    }, [resourceID])

    const getMiscellaneousStatusListKey = `/CAD/MasterMiscellaneous/GetDataDropDown_MiscellaneousStatus/${loginAgencyID}`;
    const { data: miscellaneousStatusList, isSuccess: isFetchMiscellaneousStatusList } = useQuery(
        [getMiscellaneousStatusListKey, {
            AgencyID: loginAgencyID,
        }],
        MasterTableListServices.getDataDropDown_MiscellaneousStatus,
        {
            refetchOnWindowFocus: false,
            enabled: !!loginAgencyID,
            retry: 0,
        }
    );

    useEffect(() => {
        if (isFetchMiscellaneousStatusList && miscellaneousStatusList) {
            const res = JSON.parse(miscellaneousStatusList?.data?.data);
            const data = res?.Table
            setStatusData(data || [])
        } else {
            setStatusData([])
        }
    }, [isFetchMiscellaneousStatusList, miscellaneousStatusList])

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: misceState?.Location,
                    AgencyID: loginAgencyID
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };

        if (misceState?.Location) {
            fetchLocationData();
        }
    }, [misceState?.Location, isSelectLocation]);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID)
            setLoginPinID(localStoreData?.PINID)
        }
    }, [localStoreData]);


    const miscStatusKey = `/CAD/MasterMiscellaneous/GetMiscStatus`;
    const { data: miscStatusData, isSuccess: isFetchMiscStatusData, refetch: refetchMiscStatusData } = useQuery(
        [miscStatusKey, { AgencyID: loginAgencyID }],
        GeoServices.getMiscStatus,
        {
            refetchOnWindowFocus: false,
            enabled: !!loginAgencyID,
            retry: 0,
        }
    );
    useEffect(() => {
        if (isFetchMiscStatusData && miscStatusData) {
            const data = JSON.parse(miscStatusData?.data?.data)?.Table || [];
            setStatusDropdown(
                data
            );
        }
    }, [isFetchMiscStatusData, miscStatusData]);

    const onCloseLocation = () => {
        clearMisceState();
        clearStateMisce();
        setOpenMiscModal(false);
        setSelectedDutyStatus("placeInto");
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
        const keys = Object.keys(errorMisce);
        keys.map((field) => {
            if (
                field === "Resources" &&
                isEmptyObject(misceState[field])) {
                handleErrorMisce(field, true);
                isError = true;
            } else if (
                field === "Location" && selectedDutyStatus === "placeInto" &&
                (isEmpty(misceState[field]) || misceState?.Location === null)
            ) {
                handleErrorMisce(field, true);
                isError = true;
            } else if (
                field === "statusCode" &&
                selectedDutyStatus === "placeInto" &&
                isEmptyObject(misceState[field])
            ) {
                handleErrorMisce(field, true);
                isError = true;
            } else {
                handleErrorMisce(field, false);
            }
            return null;
        });
        return !isError;
    };

    async function handleSave() {
        if (!validateDispatch()) return;
        const resourceIDs = misceState?.Resources?.map(item => item.ResourceID).join(',');
        const data = {
            Status: selectedDutyStatus === "placeInto" ? misceState?.statusCode?.MiscellaneousStatusCode : "AV",
            Resources: resourceIDs,
            Place: selectedDutyStatus === "placeInto" ? misceState?.Location : "",
            Comments: misceState?.Comments,
            CreatedByUserFK: loginPinID,
            AgencyID: loginAgencyID,
        }
        const response = await ResourcesStatusServices.incidentRecourseStatus(data);
        if (response?.status === 200) {
            toastifySuccess("Data Saved Successfully");
            onCloseLocation();
            incidentRefetch();
            refetchGetComments();
            resourceRefetch();
            refetchMiscStatusData();
        }
    }

    const multiSelectcolourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            minHeight: 37,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
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
    };

    return (
        <>
            {openMiscModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="miscModal"
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
                                                Miscellaneous Status
                                            </p>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-container">
                                                <div className="tab-form-row">
                                                    <div className="col-12 d-flex justify-content-start align-items-center my-1 offset-1" style={{ gap: "50px" }}>
                                                        <div className="form-check ">
                                                            <input className="form-check-input" style={{ marginTop: "6px" }} type="radio" value="Attempted" name="AttemptComplete" id="flexRadioDefault1" checked={selectedDutyStatus === 'placeInto'} onChange={(e) => {
                                                                setSelectedDutyStatus("placeInto");
                                                                clearMisceState();
                                                            }} />
                                                            <label className="form-check-label tab-form-label" htmlFor="flexRadioDefault1" >
                                                                Place Into
                                                            </label>
                                                        </div>
                                                        <div className="form-check ">
                                                            <input className="form-check-input" style={{ marginTop: "6px" }} type="radio" value="Attempted" name="AttemptComplete" id="flexRadioDefault12" checked={selectedDutyStatus === 'inService'} onChange={(e) => {
                                                                setSelectedDutyStatus("inService");
                                                                clearMisceState();
                                                            }} />
                                                            <label className="form-check-label tab-form-label" htmlFor="flexRadioDefault12">
                                                                In Service From
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-items-center justify-content-end">
                                                        <label htmlFor="" className="new-label mt-1" style={{ textAlign: "end" }}>
                                                            Unit #{errorMisce.Resources && isEmptyObject(misceState?.Resources) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Unit #"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-6 d-flex align-items-center justify-content-end">
                                                        {selectedDutyStatus === "inService" ? <Select
                                                            className="w-100"
                                                            isClearable
                                                            options={statusDropdown || []}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={misceState?.Resources}
                                                            onChange={(selectedOptions) => {
                                                                handleMisceState("Resources", selectedOptions);
                                                                handleMisceState("statusCode", selectedOptions);

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
                                                        /> : <Select
                                                            className="w-100"
                                                            isClearable
                                                            options={resourceData.filter(item => item.Status === "AV") || []}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={misceState?.Resources}
                                                            onChange={(selectedOptions) => {
                                                                handleMisceState("Resources", selectedOptions);
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
                                                        />}
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label">
                                                            Status Code{errorMisce.statusCode && selectedDutyStatus === "placeInto" && isEmptyObject(misceState?.statusCode) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Code"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-6 d-flex align-items-center justify-content-end">
                                                        {selectedDutyStatus === "inService" ?
                                                            <>
                                                                <input
                                                                    type="text"
                                                                    value={misceState?.statusCode.length > 0
                                                                        ? misceState?.statusCode
                                                                            .filter(item => item?.Status)
                                                                            .map(item => item?.Status)
                                                                            .join(", ")
                                                                        : ""}
                                                                    name="Status"
                                                                    className="form-control py-1 new-input"
                                                                    readOnly
                                                                />
                                                            </> :
                                                            <Select
                                                                className="w-100"
                                                                isClearable
                                                                options={statusData}
                                                                placeholder="Select..."
                                                                name="statusCode"
                                                                value={misceState?.statusCode}
                                                                onChange={(selectedOptions) => {
                                                                    handleMisceState("statusCode", selectedOptions);
                                                                }}
                                                                formatOptionLabel={(option, { context }) => {
                                                                    return context === 'menu'
                                                                        ? `${option?.MiscellaneousStatusCode} | ${option?.Description}`
                                                                        : option?.MiscellaneousStatusCode;
                                                                }}
                                                                styles={selectedDutyStatus === 'inService' ? customStylesWithOutColor : colourStyles}
                                                                isDisabled={selectedDutyStatus === 'inService'}
                                                                maxMenuHeight={150}
                                                                getOptionLabel={(v) => v?.MiscellaneousStatusCode}
                                                                getOptionValue={(v) => v?.lstMiscellaneousID}
                                                                onInputChange={(inputValue, actionMeta) => {
                                                                    if (inputValue.length > 12) {
                                                                        return inputValue.slice(0, 12);
                                                                    }
                                                                    return inputValue;
                                                                }}
                                                                isSearchable={true}
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label">Place / Location {errorMisce.Location && selectedDutyStatus === "placeInto" && isEmptyObject(misceState?.Location) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Location"}</p>
                                                        )}</label>
                                                    </div>
                                                    <div className="col-6 w-100 inner-input-fullw">
                                                        {selectedDutyStatus === "inService" ?
                                                            <>
                                                                <textarea
                                                                    name="NameLocationID"
                                                                    rows=''
                                                                    value={
                                                                        misceState?.statusCode?.length > 0
                                                                            ? misceState.statusCode
                                                                                .filter(item => item?.Place) // Filters out null or undefined `Place` values
                                                                                .map(item => item?.Place)
                                                                                .join(", ")
                                                                            : ""
                                                                    }
                                                                    className="form-control py-1 new-input"
                                                                    style={{ height: 'auto' }}
                                                                    readOnly
                                                                />
                                                            </> :
                                                            <Location
                                                                {...{
                                                                    value: misceState,
                                                                    setValue: setMisceState,
                                                                    locationStatus,
                                                                    setLocationStatus,
                                                                    setIsSelectLocation,
                                                                    locationData,
                                                                }}
                                                                col="Location"
                                                                locationID="NameLocationID"
                                                                check={true}
                                                                verify={true}
                                                                page="Name"
                                                                isGEO
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                                <div className="tab-form-row" style={{ alignItems: 'baseline' }}>
                                                    <div className="col-2 d-flex align-items-end justify-content-end">
                                                        <label className="tab-form-label">
                                                            Comments
                                                        </label>
                                                    </div>
                                                    <div className="col-6 d-flex align-items-center justify-content-end">
                                                        <textarea
                                                            type="text"
                                                            rows="3"
                                                            className="form-control  py-1 new-input"
                                                            style={{ height: "auto", overflowY: "scroll" }}
                                                            placeholder="Comments"
                                                            value={misceState?.Comments}
                                                            onChange={(e) => {
                                                                handleMisceState("Comments", e.target.value)
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
                                    {/* Buttons */}
                                    <div className="row justify-content-end ">
                                        <div className="col-22 p-0">
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
                <></>
            )
            }
        </>
    );
};

export default memo(MiscellaneousModal);

// PropTypes definition
MiscellaneousModal.propTypes = {
  openMiscModal: PropTypes.bool.isRequired,
  setOpenMiscModal: PropTypes.func.isRequired
};

// Default props
MiscellaneousModal.defaultProps = {
  openMiscModal: false,
  setOpenMiscModal: () => {}
};
