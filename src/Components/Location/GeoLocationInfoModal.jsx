import { memo, useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "react-query";
import GeoServices from "../../CADServices/APIs/geo";
import { dropDownDataModel, handleNumberNoSpaceKeyDown, handleNumberTextKeyDown, handleNumDotNoSpaceKeyDown, isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import useObjState from "../../CADHook/useObjState";
import { useSelector } from "react-redux";

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
};

const GeoLOcationInfoModal = (props) => {


    const { openLocationInformationModal, setOpenLocationInformationModal, setSelectedButton = () => { }, geoFormValues, setGEOFormValues, createLocationPayload, isVerifyLocation = false, isCheckGoogleLocation, setIsVerifyReportedLocation = () => { }, setGeoLocationID = () => { } } = props;
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [premiseDropDown, setPremiseDropDown] = useState([]);
    const [isChangeFields, setIsChangeFields] = useState(false);
    const [locationInformation, setLocationInformation] = useState(initialFormValues);
    const [geoZoneDropDown, setGeoZoneDropDown] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [
        errorGeo,

        handleErrorGeo,
        clearState,
    ] = useObjState({

        patrolZone: false,
        emsZone: false,
        fireZone: false,
        otherZone: false,
        coordinateX: false,
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
            if (field === "coordinateX"
                && isEmpty(locationInformation[field])
            ) {
                handleErrorGeo(field, true);
                isError = true;
            } else if (field === "coordinateY" &&
                isEmpty(locationInformation[field])
            ) {
                handleErrorGeo(field, true);
                isError = true;
            } else if ((field === "fireZone" || field === "emsZone" || field === "otherZone" || field === "patrolZone") && !isCheckGoogleLocation && isEmptyObject(locationInformation[field])) {
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
        const isVerifyReportedLocation = data?.Table?.[0]?.GeoLocationID;
        setGeoLocationID(data?.Table?.[0]?.GeoLocationID);
        setIsVerifyReportedLocation(isVerifyReportedLocation ? true : false)
        onCloseLocation();
    }

    const customStylesWithOutColor = {
        control: (base) => ({
            ...base,
            height: 20,
            minHeight: 35,
            fontSize: 14,
            marginTop: 2,
            boxShadow: 0,
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            transition: "all .2s ease",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
        }),
    };

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 37,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            transition: "all .2s ease",
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
        }),
    };
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
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "99999", overflowY: "hidden" }}
                        id="LocationInformationModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-xl ">
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
                                        <fieldset style={{ border: "1px solid gray", margin: "4px", padding: "4px" }}>
                                            {/* Row 1 */}
                                            <div className="row">
                                                <div className="col-1 text-right text-nowrap">
                                                    <label className="tab-form-label text-nowrap">
                                                        Premise #
                                                    </label>
                                                </div>
                                                <div className="col-2 ">
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
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label d-flex align-self-center justify-content-end">
                                                        St.Direction
                                                    </label>

                                                </div>

                                                <div className="col-1">
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
                                                <div className="col-1 text-right ">
                                                    <label className="tab-form-label ">
                                                        St.Name
                                                    </label>

                                                </div>
                                                <div className="col-4">
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
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label d-flex align-self-center justify-content-end">
                                                        St.Direction
                                                    </label>
                                                </div>

                                                <div className="col-1">
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

                                            </div>
                                            {/* Row 2 */}
                                            <div className="row mt-1 align-items-center">
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label ">
                                                        City
                                                    </label>
                                                </div>
                                                <div className="col-2 ">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="City"
                                                        value={locationInformation.City}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label ">Zip</label>
                                                </div>
                                                <div className="col-1 ">
                                                    <input
                                                        type="number"
                                                        className="form-control py-1 new-input"
                                                        name="ZipCode"
                                                        value={locationInformation.ZipCode}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                                <div className="col-2 text-right">
                                                    <label className="tab-form-label">
                                                        Common Place Name
                                                    </label>
                                                </div>
                                                <div className="col-5 text-right">
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
                                            <div className="row mt-1 align-items-center">
                                                <div className="col-1 ">
                                                    <label className="tab-form-label text-nowrap mr-1">
                                                        Coordinate:X{errorGeo.coordinateX && isEmpty(locationInformation.coordinateX) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Coordinate X"}</p>
                                                        )}
                                                    </label>

                                                </div>
                                                <div className="col-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center gap-2 ">
                                                    <div className="d-flex gap-2 w-100">
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
                                                                handleInputChange(e);

                                                            }}
                                                            disabled={(locationInformation.coordinateY && isVerifyLocation) || isCheckGoogleLocation}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-1">
                                                    <label className="tab-form-label d-flex justify-content-end">
                                                        Alt.St.Name
                                                    </label>
                                                </div>
                                                <div className="col-4">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="AltStreet"
                                                        value={locationInformation.AltStreet}
                                                        onChange={handleInputChange}
                                                        maxLength={50}
                                                    />
                                                </div>
                                                <div className="col-1 text-right text-nowrap">
                                                    <label className="tab-form-label ">
                                                        Mile Marker
                                                    </label>

                                                </div>

                                                <div className="col-2">
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input "
                                                        name="mileMarker"
                                                        value={locationInformation.mileMarker}
                                                        onChange={handleInputChange}
                                                        onKeyDown={handleNumberNoSpaceKeyDown}
                                                        maxLength={4}
                                                    />
                                                </div>
                                            </div>
                                            {/* Line 4 */}
                                            <div className="row align-items-center mt-1">
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label">
                                                        Premise Type
                                                    </label>
                                                </div>
                                                <div className="col-2 flex-grow-1">
                                                    <Select
                                                        name="premiseType"
                                                        menuPlacement="top"
                                                        styles={{
                                                            ...customStylesWithOutColor,
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
                                                <div className="col-2 text-right">
                                                    <label className="tab-form-label text-nowrap ">
                                                        Intersection St/St
                                                    </label>

                                                </div>

                                                <div className="col-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center gap-3">
                                                    <div className="d-flex gap-2 w-100">
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input "
                                                            name="intersection1"
                                                            value={locationInformation.intersection1}
                                                            onChange={handleInputChange}
                                                            maxLength={50}
                                                        />
                                                        {"/"}
                                                        <input
                                                            type="text"
                                                            className="form-control ml-1 py-1 new-input"
                                                            name="intersection2"
                                                            value={locationInformation.intersection2}
                                                            onChange={handleInputChange}
                                                            maxLength={50}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Line 5 */}
                                            {!isVerifyLocation && <div className="row align-items-center mt-1">
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label text-nowrap" >
                                                        Law Zone
                                                        {errorGeo.patrolZone && isEmptyObject(locationInformation.patrolZone) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                {"Select Law Zone"}
                                                            </p>
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="col-2">
                                                    <Select
                                                        name="patrolZone"
                                                        styles={colourStyles}
                                                        isClearable
                                                        options={geoZoneDropDown}
                                                        placeholder="Select..."
                                                        className="w-100 "
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
                                                </div>


                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label text-nowrap "> Fire Zone
                                                        {errorGeo.fireZone && isEmptyObject(locationInformation.fireZone) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                {"Select Fire Zone"}
                                                            </p>
                                                        )}
                                                    </label>
                                                </div>

                                                <div className="col-2 ">
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
                                                </div>
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label text-nowrap"> EMS Zone
                                                        {errorGeo.emsZone && isEmptyObject(locationInformation.emsZone) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                {"Select EMS Zone"}
                                                            </p>
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="col-2">
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
                                                </div>
                                                <div className="col-1 text-right">
                                                    <label className="tab-form-label text-nowrap"> Other Zone
                                                        {errorGeo.otherZone && isEmptyObject(locationInformation.otherZone) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                                                {"Select Other Zone"}
                                                            </p>
                                                        )}
                                                    </label>
                                                </div>
                                                <div className="col-2">
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
                                    <div className="row mt-1">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                    <button
                                                        type="button"
                                                        className="custom-save-button ml-2"
                                                        onClick={() => handleSave()}
                                                    >
                                                        {"Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="custom-cancel-button"
                                                        onClick={() => {
                                                            if (isChangeFields) {
                                                                setOpenLocationInformationModal(false);
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

        </>
    );
};

export default memo(GeoLOcationInfoModal);
