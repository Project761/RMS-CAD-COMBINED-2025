import { memo, useCallback, useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import GeoServices from "../../CADServices/APIs/geo";
import { dropDownDataModel, handleNumberNoSpaceKeyDown, handleNumberTextKeyDown, handleNumDotNoSpaceKeyDown, isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import ModalConfirm from "../Common/ModalConfirm";
import useObjState from "../../CADHook/useObjState";
import { useSelector } from "react-redux";
import { colourStyles, customStylesWithOutColorDrop } from "../Utility/CustomStylesForReact";

const initialFormValues = {
    PremiseNo: "",
    stDirection: "",
    Street: "",
    stDirection2: "",
    ApartmentNo: "",
    commonPlaceName: "",
    premiseType: null,
    City: "",
    ZipCode: "",
    mileMarker: "",
    coordinateX: "",
    coordinateY: "",
    AltStreet: "",
    intersection1: "",
    intersection2: "",
    verify: true,
    patrolZone: null,
    emsZone: null,
    fireZone: null,
    otherZone: null,
    currentFlag: null,
    location: "",
    IsVerify: true,
    isStreet: false,
    isCity: false,
    isPremiseNo: false,
    isZipCode: false,
    isMileMarker: false,
    isCommonPlaceName: false,
    isStDirection: false,
    isStDirection2: false,
    isIntersection1: false,
    isIntersection2: false,
    isAltStreet: false,
    isApartmentNo: false,
    isCoordinateX: false,
    isCoordinateY: false,
    jurisdiction: "",
};

const LocationInformationModal = (props) => {
    const { openLocationInformationModal, setOpenLocationInformationModal, setSelectedButton = () => { }, geoFormValues, setGEOFormValues, isGoogleLocation = false, createLocationPayload, isVerifyLocation = false, geoLocationID, isCheckGoogleLocation, setIsVerifyReportedLocation = () => { }, jurisdictionDropDown = []
    } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [premiseDropDown, setPremiseDropDown] = useState([]);
    const [isChangeFields, setIsChangeFields] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [locationInformation, setLocationInformation] = useState(initialFormValues);
    const [geoZoneDropDown, setGeoZoneDropDown] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [
        errorGeo,
        ,
        handleErrorGeo,
        clearState,
    ] = useObjState({

        patrolZone: false,
        emsZone: false,
        fireZone: false,
        otherZone: false,
        coordinateX: false,
        jurisdiction: false,
        coordinateY: false
    });

    useEffect(() => {
        if (geoFormValues && openLocationInformationModal) {
            setLocationInformation(geoFormValues, geoFormValues)
        }
    }, [geoFormValues, openLocationInformationModal]);
    function handleClear() {
        setLocationInformation({})
        setIsChangeFields(false)
    }

    const onCloseLocation = () => {
        setOpenLocationInformationModal(false);
        setSelectedButton(prevSelected =>
            prevSelected.includes(3)
                ? prevSelected.filter(item => item !== 3)
                : [...prevSelected, 3]
        );
        clearState();
        handleClear()
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocationInformation((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsChangeFields(true)
    };


    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    const handleSelectChange = (selectedOption, { name }) => {
        setLocationInformation((prevState) => ({
            ...prevState,
            [name]: selectedOption,
        }));
        setIsChangeFields(true)
    };

    const getPremiseKey = `/CAD/GeoPremiseType/GetData_Premise`;
    const { data: premiseData, isSuccess: isFetchPremiseData } = useQuery(
        [getPremiseKey, {}],
        GeoServices.getPremise,
        {
            refetchOnWindowFocus: false,
        }
    );

    const geoZoneKey = `/CAD/GeoPetrolZone/GetData_Zone`;
    const { data: geoZoneData, isSuccess: isFetchGeoZoneData } = useQuery(
        [geoZoneKey, { IsActive: 1, AgencyID: loginAgencyID }],
        GeoServices.getGeoZone,
        {
            refetchOnWindowFocus: false,
            enabled: openLocationInformationModal
        }
    );
    useEffect(() => {
        if (isFetchGeoZoneData && geoZoneData) {
            const data = JSON.parse(geoZoneData?.data?.data)?.Table || [];
            setGeoZoneDropDown(
                dropDownDataModel(data, "ZoneID", "ZoneCode")
            );
        }
    }, [isFetchGeoZoneData, geoZoneData]);


    useEffect(() => {
        if (isFetchPremiseData && premiseData) {
            const data = JSON.parse(premiseData?.data?.data);
            setPremiseDropDown(dropDownDataModel(data?.Table, "ID", "PremiseType"));
        }
    }, [isFetchPremiseData, premiseData]);

    const validateLocationFormValues = () => {
        let isError = false;
        const keys = Object.keys(errorGeo);
        keys.forEach((field) => {
            // if (field === "coordinateX"
            //     && isEmpty(locationInformation[field])
            // ) {
            //     handleErrorGeo(field, true);
            //     isError = true;
            // } else if (field === "coordinateY" &&
            //     isEmpty(locationInformation[field])
            // ) {
            //     handleErrorGeo(field, true);
            //     isError = true;
            // } 
            if (field === "fireZone" && isEmptyObject(locationInformation[field])) {
                handleErrorGeo(field, true);
                isError = true;
            } else if (field === "otherZone" && isEmptyObject(locationInformation[field])) {
                handleErrorGeo(field, true);
                isError = true;
            } else if (field === "emsZone" && isEmptyObject(locationInformation[field])) {
                handleErrorGeo(field, true);
                isError = true;
            } else if (field === "patrolZone" && isEmptyObject(locationInformation[field])) {
                handleErrorGeo(field, true);
                isError = true;
            } else if (field === "jurisdiction" && isEmptyObject(locationInformation[field])) {
                handleErrorGeo(field, true);
                isError = true;
            } else {
                handleErrorGeo(field, false);
            }
        });
        return !isError;
    };

    async function handleSave() {
        if (!validateLocationFormValues()) return;

        setGEOFormValues(locationInformation);
        const locationPayload = createLocationPayload(locationInformation);
        const response = await GeoServices.insertLocation(locationPayload);
        const data = JSON.parse(response?.data?.data);
        const isVerifyReportedLocation = data?.Table?.[0]?.VerifyReportedLocation;
        setIsVerifyReportedLocation(isVerifyReportedLocation === 1 ? true : false)
        onCloseLocation();
    }

    const handleKeyDown = (e) => {
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode);
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
        const numpadKeys = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
        const numpadSpecialKeys = [106, 107, 109, 110, 111];
        if (!charStr.match(/^[a-zA-Z]+$/) && !controlKeys.includes(charCode)) {
            e.preventDefault();
        }
        if (
            (charCode >= 48 && charCode <= 57) ||
            numpadKeys.includes(charCode) ||
            numpadSpecialKeys.includes(charCode)
        ) {
            e.preventDefault();
        }
    };

    function handleCloseConfirm() {
        setShowConfirmModal(false);
        if (confirmAction === "close") {
            onCloseLocation();
        } else if (confirmAction === "clear") {
            handleClear();
        }
    }

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


    return (
        <>
            {openLocationInformationModal ? (
                <>
                    <dialog
                        className="modal fade modal-in-Call-taker"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="LocationInformationModal"
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
                                                    Location Information
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            {/* Row 1 */}
                                            <div className="tab-form-row">
                                                <div className="col-1 d-flex align-self-center justify-content-end">
                                                    <label className="tab-form-label">
                                                        Premise #
                                                    </label>
                                                </div>
                                                <div className="col-2 d-flex align-self-center justify-content-end">
                                                    <input
                                                        type="number"
                                                        className="form-control py-1 new-input"
                                                        name="PremiseNo"
                                                        value={locationInformation.PremiseNo}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (/^\d{0,4}$/.test(value)) {
                                                                handleInputChange(e);
                                                            }
                                                        }}
                                                        min="0"
                                                    />
                                                </div>
                                                <div className="col-2 d-flex align-self-center tab-form-row-gap">
                                                    <label className="tab-form-label d-flex align-self-center justify-content-end">
                                                        St.Direction
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input w-100"
                                                        name="stDirection"
                                                        onKeyDown={handleKeyDown}
                                                        maxLength="4"
                                                        value={locationInformation.stDirection}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-5 d-flex align-self-center tab-form-row-gap">
                                                    <label className="tab-form-label d-flex align-self-center justify-content-end">
                                                        St.Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="Street"
                                                        maxLength={35}
                                                        onKeyDown={handleNumberTextKeyDown}
                                                        value={locationInformation.Street}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-2 d-flex align-self-center tab-form-row-gap">
                                                    <label className="tab-form-label d-flex align-self-center justify-content-end">
                                                        St.Direction
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="stDirection2"
                                                        maxLength="4"
                                                        onKeyDown={handleKeyDown}
                                                        value={locationInformation.stDirection2}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                {/* <div className="col-2 d-flex align-items-center tab-form-row-gap">
                                                    <div className="flex-shrink-0">
                                                        <label className="tab-form-label d-flex justify-content-end">
                                                            Apt/Suite #
                                                        </label>
                                                    </div>
                                                    <div className="flex-grow-1 ms-2">
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input w-100"
                                                            name="ApartmentNo"
                                                            value={locationInformation.ApartmentNo}
                                                            onChange={handleInputChange}
                                                            onKeyDown={handleNumberNoSpaceKeyDown}
                                                            maxLength={4}
                                                        />
                                                    </div>
                                                </div> */}
                                            </div>
                                            {/* Row 2 */}
                                            <div className="tab-form-row">
                                                <div className="col-1 d-flex align-items-center justify-content-end">
                                                    <label className="tab-form-label mr-2">
                                                        City
                                                    </label>
                                                </div>
                                                <div className="col-2 d-flex align-self-center justify-content-end">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="City"
                                                        value={locationInformation.City}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-1 d-flex align-items-center justify-content-end">
                                                    <label className="tab-form-label mr-2">Zip</label>
                                                </div>
                                                <div className="col-1 d-flex align-self-center justify-content-end">
                                                    <input
                                                        type="number"
                                                        className="form-control py-1 new-input"
                                                        name="ZipCode"
                                                        value={locationInformation.ZipCode}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-2 d-flex align-self-center justify-content-end text-nowrap">
                                                    <label className="tab-form-label">
                                                        Common Place Name
                                                    </label>
                                                </div>
                                                <div className="col-5 d-flex align-self-center justify-content-end">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="commonPlaceName"
                                                        onKeyDown={handleNumberTextKeyDown}
                                                        value={locationInformation.commonPlaceName}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>
                                            {/* Row 3 */}
                                            <div className="tab-form-row">
                                                <div className="col-1 d-flex align-self-center justify-content-end">
                                                    <label className="tab-form-label">
                                                        Coordinate:X{errorGeo.coordinateX && isEmpty(locationInformation.coordinateX) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Coordinate X"}</p>
                                                        )}
                                                    </label>

                                                </div>
                                                <div className="col-3 d-flex align-items-center justify-content-end">
                                                    <input
                                                        type="number"
                                                        className="form-control py-1 new-input w-100 requiredColor"
                                                        name="coordinateX"
                                                        value={locationInformation.coordinateX}
                                                        onKeyDown={handleNumDotNoSpaceKeyDown}
                                                        onChange={(e) => {

                                                            handleInputChange(e);

                                                        }}
                                                        disabled={(locationInformation.coordinateY && isVerifyLocation) || isCheckGoogleLocation}
                                                    />
                                                    <label className="tab-form-label mx-2">Y{errorGeo.coordinateY && isEmpty(locationInformation.coordinateY) && (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Coordinate Y"}</p>
                                                    )}</label>
                                                    <input
                                                        type="number"
                                                        className="form-control py-1 new-input w-100 requiredColor"
                                                        name="coordinateY"
                                                        value={locationInformation.coordinateY}
                                                        onKeyDown={handleNumDotNoSpaceKeyDown}

                                                        onChange={(e) => {
                                                            // const value = e.target.value;
                                                            // if (/^\d{0,10}$/.test(value)) {
                                                            handleInputChange(e);
                                                            // }
                                                        }}
                                                        disabled={(locationInformation.coordinateY && isVerifyLocation) || isCheckGoogleLocation}
                                                    />
                                                </div>

                                                <div className="col-6 d-flex align-items-center tab-form-row-gap pr-3">
                                                    <div className="flex-shrink-0">
                                                        <label className="tab-form-label d-flex justify-content-end">
                                                            Alt.St.Name
                                                        </label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="AltStreet"
                                                        // onKeyDown={handleNumberTextKeyDown}
                                                        value={locationInformation.AltStreet}
                                                        onChange={handleInputChange}
                                                        maxLength={50}
                                                    />
                                                </div>
                                                <div className="col-2 d-flex align-self-center">
                                                    <label className="tab-form-label col-5 d-flex align-self-center justify-content-end text-nowrap">
                                                        Mile Marker
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input col-7"
                                                        name="mileMarker"
                                                        value={locationInformation.mileMarker}
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleNumberNoSpaceKeyDown}
                                                        maxLength={4}
                                                    />
                                                </div>
                                            </div>
                                            {/* Line 4 */}
                                            <div className="tab-form-row">
                                                <div className="col-1 d-flex align-items-center justify-content-end tab-form-row-gap">
                                                    <label className="tab-form-label d-flex justify-content-end text-nowrap">
                                                        Premise Type
                                                    </label>
                                                </div>
                                                <div className="col-2 flex-grow-1">
                                                    <Select
                                                        name="premiseType"
                                                        menuPlacement="top"
                                                        styles={{
                                                            ...customStylesWithOutColorDrop,
                                                            menuList: (provided) => ({
                                                                ...provided,
                                                                maxHeight: 150,
                                                                overflowY: 'auto',
                                                            }),
                                                        }}
                                                        isClearable
                                                        options={premiseDropDown}
                                                        placeholder="Select..."
                                                        onChange={handleSelectChange}
                                                        value={locationInformation.premiseType}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                    />

                                                </div>
                                                <div className="col-5 d-flex align-items-center justify-content-end ml-2">
                                                    <label className="tab-form-label text-nowrap mr-2">
                                                        Intersection St/St
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input mr-1"
                                                        name="intersection1"
                                                        value={locationInformation.intersection1}
                                                        // onKeyDown={handleNumberTextKeyDown}
                                                        onChange={handleInputChange}
                                                        maxLength={50}
                                                    />
                                                    {"/"}
                                                    <input
                                                        type="text"
                                                        className="form-control ml-1 py-1 new-input"
                                                        name="intersection2"
                                                        value={locationInformation.intersection2}
                                                        // onKeyDown={handleNumberTextKeyDown}
                                                        onChange={handleInputChange}
                                                        maxLength={50}
                                                    />
                                                </div>
                                                <div className="col-1 d-flex align-items-center justify-content-end ml-1">
                                                    <label className="tab-form-label text-nowrap" style={{ textAlign: "end" }}>
                                                        Jurisdiction
                                                        {errorGeo.jurisdiction && isEmptyObject(locationInformation.jurisdiction) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                {"Select Jurisdiction"}
                                                            </p>
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="tab-form-row-gap d-flex" style={{ marginTop: "5px" }}>
                                                    <Select
                                                        name="jurisdiction"
                                                        styles={colourStyles}
                                                        isClearable
                                                        options={jurisdictionDropDown}
                                                        placeholder="Select..."
                                                        className="w-100 ml-1"
                                                        value={locationInformation.jurisdiction}
                                                        getOptionLabel={(v) => `${v?.JurisdictionCode} | ${v?.Name}`}
                                                        getOptionValue={(v) => v?.JurisdictionCode}
                                                        formatOptionLabel={(option, { context }) => {
                                                            return context === 'menu'
                                                                ? `${option?.JurisdictionCode} | ${option?.Name}`
                                                                : option?.JurisdictionCode;
                                                        }}
                                                        maxMenuHeight={100}
                                                        onChange={handleSelectChange}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Line 5 */}
                                            {!isVerifyLocation && <div className="tab-form-row py-2">
                                                <div className="col-1 d-flex align-items-center justify-content-end">
                                                    <label className="tab-form-label text-nowrap" style={{ textAlign: "end" }}>
                                                        Law Zone
                                                        {/* {errorGeo.patrolZone && isEmptyObject(geoFormValues.patrolZone) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                {"Select Law Zone"}
                                                            </p>
                                                        )} */}
                                                        {errorGeo.patrolZone && isEmptyObject(locationInformation.patrolZone) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                {"Select Law Zone"}
                                                            </p>
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="col-11 tab-form-row-gap d-flex w-100">
                                                    <Select
                                                        name="patrolZone"
                                                        styles={colourStyles}
                                                        isClearable
                                                        options={geoZoneDropDown}
                                                        placeholder="Select..."
                                                        className="w-100 ml-1"
                                                        value={locationInformation.patrolZone}
                                                        maxMenuHeight={100}
                                                        onChange={handleSelectChange}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                    />
                                                    <div className="d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap mr-1"> Fire Zone
                                                            {errorGeo.fireZone && isEmptyObject(locationInformation.fireZone) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                    {"Select Fire Zone"}
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <Select
                                                        name="fireZone"
                                                        styles={colourStyles}
                                                        isClearable
                                                        options={geoZoneDropDown}
                                                        placeholder="Select..."
                                                        className="w-100"
                                                        value={locationInformation.fireZone}
                                                        maxMenuHeight={100}
                                                        onChange={handleSelectChange}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                    />
                                                    <div className="d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap mr-1"> EMS Zone
                                                            {errorGeo.emsZone && isEmptyObject(locationInformation.emsZone) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                    {"Select EMS Zone"}
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <Select
                                                        name="emsZone"
                                                        styles={colourStyles}
                                                        isClearable
                                                        options={geoZoneDropDown}
                                                        placeholder="Select..."
                                                        className="w-100"
                                                        value={locationInformation.emsZone}
                                                        maxMenuHeight={100}
                                                        onChange={handleSelectChange}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                    />
                                                    <div className="d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap mr-1"> Other Zone
                                                            {errorGeo.otherZone && isEmptyObject(locationInformation.otherZone) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                    {"Select Other Zone"}
                                                                </p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <Select
                                                        name="otherZone"
                                                        styles={colourStyles}
                                                        isClearable
                                                        options={geoZoneDropDown}
                                                        placeholder="Select..."
                                                        className="w-100"
                                                        value={locationInformation.otherZone}
                                                        maxMenuHeight={100}
                                                        onChange={handleSelectChange}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                    />
                                                </div>
                                            </div>}
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                    <button
                                                        type="button"
                                                        className="save-button ml-2"
                                                        onClick={() => handleSave()}
                                                    >
                                                        {"Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="cancel-button"
                                                        onClick={() => {
                                                            if (isChangeFields) {
                                                                setConfirmAction("close");
                                                                setShowConfirmModal(true);
                                                            } else {
                                                                onCloseLocation();
                                                            }
                                                        }
                                                        }
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
            <ModalConfirm showModal={showConfirmModal} setShowModal={setShowConfirmModal} confirmAction={confirmAction === "close" ? "close" : "clear"} handleConfirm={handleCloseConfirm} />
        </>
    );
};

export default memo(LocationInformationModal);

// PropTypes definition
LocationInformationModal.propTypes = {
    openLocationInformationModal: PropTypes.bool.isRequired,
    setOpenLocationInformationModal: PropTypes.func.isRequired,
    setSelectedButton: PropTypes.func,
    geoFormValues: PropTypes.object,
    setGEOFormValues: PropTypes.func,
    isGoogleLocation: PropTypes.bool,
    createLocationPayload: PropTypes.func,
    isVerifyLocation: PropTypes.bool,
    geoLocationID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isCheckGoogleLocation: PropTypes.bool,
    setIsVerifyReportedLocation: PropTypes.func
};

// Default props
LocationInformationModal.defaultProps = {
    setSelectedButton: () => { },
    geoFormValues: {},
    setGEOFormValues: () => { },
    isGoogleLocation: false,
    createLocationPayload: () => { },
    isVerifyLocation: false,
    geoLocationID: null,
    isCheckGoogleLocation: false,
    setIsVerifyReportedLocation: () => { }
};
