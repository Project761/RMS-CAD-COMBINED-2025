import { memo, useEffect, useState } from "react";
import {
    useLoadScript
} from "@react-google-maps/api";
import PropTypes from "prop-types";
import usePlacesAutocomplete from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useLocation } from "react-router-dom";
import { SplitAddress } from "../../../Components/Common/SplitAddress";
import GeoServices from "../../../CADServices/APIs/geo";
import { useSelector } from "react-redux";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const libraries = ["places"];

function Location({
    setValue,
    value,
    col = "location",
    setOnSelectLocation = () => { },
    check,
    ref,
    locationID = "",
    verify = true,
    locationList,
    locationData,
    setContactList = () => { },
    setIsSelectLocation = () => { },
    setGeoLocationID = () => { },
    geoZoneDropDown = [],
    flagDropDown = [],
    premiseDropDown = [],
    jurisdictionDropDown = [],
    setIsChangeFields = () => { },
    isGEO = false,
    setZoom = () => { },
    isDropDown = false,
    setIsEditMode = () => { },
    setIsGoogleLocation = () => { },
    setIsChangeData = () => { },
    setStatesChangeStatus = () => { },
    isDisabled = false,
    setIsCheckGoogleLocation = () => { },

}) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey,
        libraries,
    });


    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";

    return (
        <div>
            <Search
                set={setValue}
                val={value}
                col={col}
                setOnSelectLocation={setOnSelectLocation}
                check={check}
                ref={ref}
                locationID={locationID}
                verify={verify}
                locationList={locationList}
                setContactList={setContactList}
                setGeoLocationID={setGeoLocationID}
                geoZoneDropDown={geoZoneDropDown}
                flagDropDown={flagDropDown}
                premiseDropDown={premiseDropDown}
                jurisdictionDropDown={jurisdictionDropDown}
                setZoom={setZoom}
                setIsSelectLocation={setIsSelectLocation}
                isGEO={isGEO}
                setIsChangeFields={setIsChangeFields}
                isDropDown={isDropDown}
                locationData={locationData}
                setIsEditMode={setIsEditMode}
                setIsGoogleLocation={setIsGoogleLocation}
                setIsCheckGoogleLocation={setIsCheckGoogleLocation}
                isDisabled={isDisabled}
                setIsChangeData={setIsChangeData}
                setStatesChangeStatus={setStatesChangeStatus}
            />
        </div>
    );
}

export default memo(Location);

// PropTypes definition
Location.propTypes = {
    setValue: PropTypes.func.isRequired,
    value: PropTypes.object,
    col: PropTypes.string,
    setOnSelectLocation: PropTypes.func,
    check: PropTypes.bool,
    ref: PropTypes.object,
    locationID: PropTypes.string,
    verify: PropTypes.bool,
    locationList: PropTypes.array,
    locationData: PropTypes.array,
    setContactList: PropTypes.func,
    setIsSelectLocation: PropTypes.func,
    setGeoLocationID: PropTypes.func,
    geoZoneDropDown: PropTypes.array,
    flagDropDown: PropTypes.array,
    premiseDropDown: PropTypes.array,
    jurisdictionDropDown: PropTypes.array,
    setIsChangeFields: PropTypes.func,
    isGEO: PropTypes.bool,
    setZoom: PropTypes.func,
    isDropDown: PropTypes.bool,
    setIsEditMode: PropTypes.func,
    setIsGoogleLocation: PropTypes.func,
    setIsChangeData: PropTypes.func,
    setStatesChangeStatus: PropTypes.func,
    isDisabled: PropTypes.bool,
    setIsCheckGoogleLocation: PropTypes.func
};

// Default props
Location.defaultProps = {
    value: {},
    col: "location",
    setOnSelectLocation: () => { },
    check: false,
    ref: null,
    locationID: "",
    verify: true,
    locationList: [],
    locationData: [],
    setContactList: () => { },
    setIsSelectLocation: () => { },
    setGeoLocationID: () => { },
    geoZoneDropDown: [],
    flagDropDown: [],
    premiseDropDown: [],
    jurisdictionDropDown: [],
    setIsChangeFields: () => { },
    isGEO: false,
    setZoom: () => { },
    isDropDown: false,
    setIsEditMode: () => { },
    setIsGoogleLocation: () => { },
    setIsChangeData: () => { },
    setStatesChangeStatus: () => { },
    isDisabled: false,
    setIsCheckGoogleLocation: () => { }
};

function Search({
    set,
    val,
    col,
    setOnSelectLocation,
    check = { check },
    locationID,
    verify = true,
    setContactList,
    setGeoLocationID,
    geoZoneDropDown,
    flagDropDown,
    premiseDropDown,
    jurisdictionDropDown,
    setZoom,
    setIsSelectLocation,
    isGEO,
    setIsChangeFields,
    locationData,
    setIsEditMode,
    isDisabled,
    setIsChangeData = () => { },
    setStatesChangeStatus = () => { },
    setIsGoogleLocation = () => { },
    setIsCheckGoogleLocation = () => { }
}) {
    const useQuery = () => new URLSearchParams(useLocation().search);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [loginAgencyID, setLoginAgencyID] = useState("");
    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);
    let openPage = useQuery().get("page");

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: "us" },
            strictBounds: false,
            fields: [
                "route",
                "name",
                "geometry",
                "formatted_address",
                "street_number",
                "geocode",
                "address_components",
                "displayName",
                "formattedAddress",
                "location",
            ],
        },
    });
    useEffect(() => {
        if (val[col]) {
            setValue(val[col], false);
        } else {
            setValue("", false);
            setIsGoogleLocation(true);
            setIsCheckGoogleLocation(false)
        }
    }, [val]);

    const handleInput = (e) => {
        setIsSelectLocation(false);
        const inputValue = e ? e.target.value : "";
        setValue(inputValue);

        if (inputValue === "") {
            set((prevState) => ({
                ...prevState,
                [col]: null,
                Street: "",
                City: "",
                Country: "",
                PremiseNo: "",
                ZipCode: "",
                TypeSufix: "",
                DirectionSufix: "",
                point_of_interest: "",
                neighborhood: "",
                subpremise: "",
                premise: "",
                coordinateX: "",
                coordinateY: "",
                DirectionPrefix: "",
                State: "",
                ApartmentNo: "",
                CommonPlace: "",
                ApartmentType: "",
                Street_Parse: "",
                PremiseNo_Parse: "",
                DirectionPrefix_Parse: "",
                TypeSuffix_Parse: "",
                DirectionSuffix_Parse: "",
                ZipCodeID: "",
                CityID: "",
                CountryID: "",
                stDirection2: "",
                stDirection: "",
                mileMarker: "",
                intersection1: "",
                intersection2: "",
                AltStreet: "",
                commonPlaceName: "",
                currentFlag: [],
                premiseType: [],
                otherZone: [],
                emsZone: [],
                fireZone: [],
                patrolZone: [],
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
                isUpdate: false,
                id: "",
            }));
            setIsGoogleLocation(true);
            setIsCheckGoogleLocation(false);
            if (isGEO) {
                setContactList([]);
                setIsSelectLocation(false);
                setIsChangeFields(false);
                setGeoLocationID("");
            }

            setZoom(17);
            setIsEditMode(false);
        } else {
            setOnSelectLocation(true);
            setStatesChangeStatus(true);
            set((prevState) => ({
                ...prevState,
                [col]: inputValue,
            }));
        }
    };

    useEffect(() => {
        if (openPage === "clear") {
        }
    }, [openPage]);

    const handleSelect = async (Location, e) => {
        set((pre) => ({
            ...pre,
            [col]: "",
            Street: "",
            City: "",
            Country: "",
            PremiseNo: "",
            ZipCode: "",
            TypeSufix: "",
            DirectionSufix: "",
            point_of_interest: "",
            neighborhood: "",
            subpremise: "",
            premise: "",
            coordinateX: "",
            coordinateY: "",
            DirectionPrefix: "",
            State: "",
            ApartmentNo: "",
            CommonPlace: "",
            ApartmentType: "",
            Street_Parse: "",
            PremiseNo_Parse: "",
            DirectionPrefix_Parse: "",
            TypeSuffix_Parse: "",
            DirectionSuffix_Parse: "",
            ZipCodeID: "",
            CityID: "",
            CountryID: "",
            stDirection2: "",
            stDirection: "",
            mileMarker: "",
            intersection1: "",
            intersection2: "",
            AltStreet: "",
            commonPlaceName: "",
            currentFlag: [],
            premiseType: [],
            otherZone: [],
            emsZone: [],
            fireZone: [],
            patrolZone: [],
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
            isUpdate: false,
            id: "",
        }));
        setIsChangeData(true);
        setStatesChangeStatus(true);

        setIsEditMode(false)
        setIsGoogleLocation(true)
        setIsCheckGoogleLocation(false)
        if (locationData?.length > 0 && isGEO) {
            const data = locationData.find((i) => i.Location === Location);
            const response1 = await GeoServices.getLocationDataByID({
                GeoLocationID: data?.ID,
                AgencyID: loginAgencyID,
            });
            const data1 = JSON.parse(response1?.data?.data)?.Table || [];

            if (data1.length > 0) {
                const data = data1[0]
                setIsGoogleLocation(false)
                setIsCheckGoogleLocation(false)
                const ID = data?.ID;
                setGeoLocationID(ID);
                set((pre) => {
                    return { ...pre, [col]: Location };
                });
                setValue(Location, false);
                clearSuggestions();
                set((pre) => {
                    return {
                        ...pre,
                        IsUsLocation: "Y",
                        Street: data?.Street,
                        Id: data?.ID ? data?.ID : "",
                        City: data?.City,
                        PremiseNo: data?.PremiseNo,
                        ZipCode: data?.ZipCode,
                        mileMarker: data?.MileMaker || "",
                        commonPlaceName: data?.CommonPlace,
                        stDirection: data?.DirectionPrefix,
                        stDirection2: data?.DirectionSufix,
                        intersection1: data?.InterDirectionPrefix || "",
                        intersection2: data?.InterDirectionSufix || "",
                        AltStreet: data?.AltStreet,
                        ApartmentNo: data?.ApartmentNo,
                        coordinateX: data?.Longitude,
                        coordinateY: data?.Latitude,
                        DirectionPrefix: "",
                        CommonPlace: "",
                        ApartmentType: "",
                        Street_Parse: "",
                        PremiseNo_Parse: "",
                        DirectionPrefix_Parse: "",
                        TypeSuffix_Parse: "",
                        DirectionSuffix_Parse: "",
                        ZipCodeID: "",
                        CityID: "",
                        CountryID: "",
                        jurisdiction: jurisdictionDropDown?.find(
                            (item) => item?.ID === data?.ID1) || {},
                        currentFlag: flagDropDown?.filter((item) =>
                            data?.CurrentFlage?.includes(item.label)
                        ),
                        premiseType: premiseDropDown?.find(
                            (item) => item?.label === data?.PremiseType
                        ),
                        otherZone: geoZoneDropDown?.find(
                            (item) => item?.label === data?.OtherZone
                        ),
                        emsZone: geoZoneDropDown?.find(
                            (item) => item?.label === data?.EMSZone
                        ),
                        fireZone: geoZoneDropDown?.find(
                            (item) => item?.label === data?.FireZone
                        ),
                        patrolZone: geoZoneDropDown?.find(
                            (item) => item?.label === data?.PatrolZone
                        ),

                        isStreet: data?.Street ? true : false,
                        isCity: data?.City ? true : false,
                        isPremiseNo: data?.PremiseNo ? true : false,
                        isZipCode: data?.ZipCode ? true : false,
                        isMileMarker: data?.MileMaker ? true : false,
                        isCommonPlaceName: data?.CommonPlace ? true : false,
                        isStDirection: data?.DirectionPrefix ? true : false,
                        isStDirection2: data?.DirectionSufix ? true : false,
                        isIntersection1: data?.InterDirectionPrefix ? true : false,
                        isIntersection2: data?.InterDirectionSufix ? true : false,
                        isAltStreet: data?.AltStreet ? true : false,
                        isApartmentNo: data?.ApartmentNo ? true : false,
                        isCoordinateX: data?.Longitude ? true : false,
                        isCoordinateY: data?.Latitude ? true : false,
                        isUpdate: true,
                        ...(col === "FoundLocation"
                            ? { isVerifyFoundLocation: data?.IsVerified }
                            : { IsVerify: data?.IsVerified === 1 ? true : false }
                        ),
                    };
                });
            }

        } else {
            setIsCheckGoogleLocation(true)
            set((pre) => {
                return { ...pre, [col]: Location };
            });
            setValue(Location, false);
            clearSuggestions();
            saveVerifyLocation({ Location, set, val, col, locationID });
            setIsGoogleLocation(true);

            setStatesChangeStatus(true);
        }
        if (isGEO) {
            setIsSelectLocation(true)
        }
        setOnSelectLocation(false);
    };



    return (
        <>
            <div className="search" style={{ pointerEvents: !verify && "none" }}>
                <Combobox onSelect={handleSelect}>
                    <ComboboxInput
                        style={{ background: isDisabled ? "#9d949436" : check ? "#FFE2A8" : "", zIndex: '200' }}
                        value={value}
                        onChange={handleInput}
                        disabled={!ready || isDisabled}
                        maxLength={110}
                    />
                    <ComboboxPopover style={{ maxHeight: "250px", overflowY: "scroll", zIndex: '9999' }}>
                        {verify ? (
                            <ComboboxList>
                                {status === "OK" && (
                                    <>
                                        {locationData?.length > 0
                                            ? locationData.map(({ ID, Location }) => (
                                                <ComboboxOption key={ID} value={Location}>
                                                    {Location}
                                                </ComboboxOption>
                                            ))
                                            : data?.map(({ id, description }) => (
                                                <ComboboxOption key={id} value={description} />
                                            ))}
                                    </>
                                )}
                            </ComboboxList>
                        ) : (
                            <></>
                        )}
                    </ComboboxPopover>
                </Combobox>
            </div>
        </>
        // <GoogleMap
        //     mapContainerStyle={containerStyle}
        //     center={center}
        //     zoom={10}
        //     onLoad={onLoad}
        //     onUnmount={onUnmount}
        // >
        //     <></>
        // </GoogleMap>
    );
}

const saveVerifyLocation = async ({ Location, set, val, col, locationID }) => {
    try {
        const geoApiData = await SplitAddress(Location);

        // Handle case where geoApiData might be undefined or malformed
        if (!geoApiData || !geoApiData.address) {
            console.warn('Invalid geoApiData received:', geoApiData);
            return;
        }

        const LocationGeoCode = geoApiData?.geocode?.location;
        const addressComponents = geoApiData?.address?.addressComponents || [];

        const extractedData = extractAddressComponents(addressComponents);
        const { stDirection, stDirection2, streetName } = parseStreetDirections(extractedData.route);
        const locationData = buildLocationData(extractedData, LocationGeoCode, stDirection, stDirection2, streetName);

        set((pre) => ({
            ...pre,
            ...locationData
        }));
    } catch (error) {
        console.error('Error in saveVerifyLocation:', error);
        // Set default values in case of error
        set((pre) => ({
            ...pre,
            IsUsLocation: "Y",
            Street: "",
            City: "",
            Country: "",
            PremiseNo: "",
            ZipCode: "",
            TypeSufix: 0,
            DirectionSufix: "",
            point_of_interest: "",
            neighborhood: "",
            subpremise: "",
            premise: "",
            coordinateX: "",
            coordinateY: "",
            DirectionPrefix: "",
            ApartmentNo: "",
            commonPlaceName: "",
            ApartmentType: "",
            Street_Parse: "",
            PremiseNo_Parse: "",
            DirectionPrefix_Parse: "",
            TypeSuffix_Parse: "",
            DirectionSuffix_Parse: "",
            ZipCodeID: "",
            CityID: "",
            CountryID: "",
            mileMarker: "",
            intersection1: "",
            intersection2: "",
            AltStreet: "",
            stDirection: "",
            stDirection2: "",
            isStreet: false,
            isCity: false,
            isPremiseNo: false,
            isZipCode: false,
            isCommonPlaceName: false,
            isStDirection: false,
            isStDirection2: false,
            isCoordinateX: false,
            isCoordinateY: false,
            Id: "",
            IsVerify: false,
        }));
    };
};

const extractAddressComponents = (addressComponents) => {
    // Ensure addressComponents is an array
    if (!Array.isArray(addressComponents)) {
        addressComponents = [];
    }

    const componentTypes = [
        "country", "locality", "route", "street_number", "sublocality_level_1",
        "administrative_area_level_1", "postal_code", "point_of_interest",
        "neighborhood", "subpremise", "premise"
    ];

    const extracted = {};
    componentTypes.forEach(type => {
        extracted[type] = addressComponents.filter(obj => obj?.componentType === type);
    });

    return extracted;
};

const parseStreetDirections = (Street) => {
    // Handle case where Street is undefined, null, or empty array
    if (!Street || !Array.isArray(Street) || Street.length === 0) {
        return { stDirection: "", stDirection2: "", streetName: "" };
    }

    const possibleDirections = [
        "East", "West", "North", "South", "Northeast", "Northwest", "Northsouth",
        "Southeast", "Southwest", "Southnorth", "Eastwest", "Eastsouth", "Eastnorth",
        "Westeast", "Westsouth", "Westnorth"
    ];

    const possibleDirectionPairs = [
        "North East", "North West", "North South", "South East", "South West",
        "South North", "East West", "East South", "East North", "West East",
        "West South", "West North"
    ];

    let stDirection = null;
    let stDirection2 = null;
    let streetName = Street[0]?.componentName?.text || "";

    if (!streetName) {
        return { stDirection: "", stDirection2: "", streetName: "" };
    }

    let streetParts = streetName.split(" ");

    // Parse prefix direction
    const prefixResult = parseDirectionPrefix(streetParts, possibleDirections, possibleDirectionPairs);
    stDirection = prefixResult.direction;
    streetParts = prefixResult.remainingParts;

    // Parse suffix direction
    const suffixResult = parseDirectionSuffix(streetParts, possibleDirections, possibleDirectionPairs);
    stDirection2 = suffixResult.direction;
    streetParts = suffixResult.remainingParts;

    streetName = streetParts.join(" ");

    return { stDirection, stDirection2, streetName };
};

const parseDirectionPrefix = (streetParts, possibleDirections, possibleDirectionPairs) => {
    if (streetParts.length < 1) return { direction: null, remainingParts: streetParts };

    const firstTwoWords = streetParts.slice(0, 2).join(" ");
    if (possibleDirectionPairs.includes(firstTwoWords)) {
        return { direction: firstTwoWords, remainingParts: streetParts.slice(2) };
    }

    if (possibleDirections.includes(streetParts[0])) {
        return { direction: streetParts[0], remainingParts: streetParts.slice(1) };
    }

    return { direction: null, remainingParts: streetParts };
};

const parseDirectionSuffix = (streetParts, possibleDirections, possibleDirectionPairs) => {
    if (streetParts.length < 1) return { direction: null, remainingParts: streetParts };

    const lastTwoWords = streetParts.slice(-2).join(" ");
    if (possibleDirectionPairs.includes(lastTwoWords)) {
        return { direction: lastTwoWords, remainingParts: streetParts.slice(0, -2) };
    }

    if (possibleDirections.includes(streetParts[streetParts.length - 1])) {
        return { direction: streetParts[streetParts.length - 1], remainingParts: streetParts.slice(0, -1) };
    }

    return { direction: null, remainingParts: streetParts };
};

const buildLocationData = (extractedData, LocationGeoCode, stDirection, stDirection2, streetName) => {
    const getComponentText = (componentArray, index = 0) =>
        componentArray[index]?.componentName?.text || "";

    const getCityText = () => {
        const city = getComponentText(extractedData.locality);
        const sublocality = getComponentText(extractedData.sublocality_level_1);
        const neighborhood = getComponentText(extractedData.neighborhood);
        return city || sublocality || neighborhood || "";
    };

    const getCommonPlaceName = () => {
        const poi = getComponentText(extractedData.point_of_interest);
        const subpremise = getComponentText(extractedData.subpremise);
        return poi || subpremise || "";
    };

    const getCityStatus = () => {
        const city = getComponentText(extractedData.locality);
        const sublocality = getComponentText(extractedData.sublocality_level_1);
        const neighborhood = getComponentText(extractedData.neighborhood);
        return !!(city || sublocality || neighborhood);
    };

    return {
        IsUsLocation: "Y",
        Street: streetName,
        City: getCityText(),
        Country: getComponentText(extractedData.country),
        PremiseNo: getComponentText(extractedData.street_number),
        ZipCode: getComponentText(extractedData.postal_code),
        TypeSufix: typeof getComponentText(extractedData.sublocality_level_1) === "number"
            ? getComponentText(extractedData.sublocality_level_1) : 0,
        DirectionSufix: getComponentText(extractedData.administrative_area_level_1),
        point_of_interest: getComponentText(extractedData.point_of_interest),
        neighborhood: getComponentText(extractedData.neighborhood),
        subpremise: "",
        premise: getComponentText(extractedData.premise),
        coordinateX: LocationGeoCode?.longitude,
        coordinateY: LocationGeoCode?.latitude,
        DirectionPrefix: "",
        ApartmentNo: "",
        commonPlaceName: getCommonPlaceName(),
        ApartmentType: "",
        Street_Parse: "",
        PremiseNo_Parse: "",
        DirectionPrefix_Parse: "",
        TypeSuffix_Parse: "",
        DirectionSuffix_Parse: "",
        ZipCodeID: "",
        CityID: "",
        CountryID: "",
        mileMarker: "",
        intersection1: "",
        intersection2: "",
        AltStreet: "",
        stDirection: stDirection || "",
        stDirection2: stDirection2 || "",
        isStreet: !!streetName,
        isCity: getCityStatus(),
        isPremiseNo: !!getComponentText(extractedData.street_number),
        isZipCode: !!getComponentText(extractedData.postal_code),
        isCommonPlaceName: !!getCommonPlaceName(),
        isStDirection: !!stDirection,
        isStDirection2: !!stDirection2,
        isCoordinateX: !!LocationGeoCode?.longitude,
        isCoordinateY: !!LocationGeoCode?.latitude,
        Id: "",
        // IsVerify: false,
    };
};
