import React, { memo, useRef, useEffect } from "react";
import { useLoadScript, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import usePlacesAutocomplete from "use-places-autocomplete";
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useLocation } from "react-router-dom";
import { SplitAddress, } from "../Common/SplitAddress";

const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const libraries = ["places"];

function Location({
    setValue,
    value,
    col,
    setOnSelectLocation = () => { },
    locationStatus,
    setLocationStatus,
    updateStatus,
    check,
    ref,
    locationID,
    verify,
    setChangesStatus,
    setStatesChangeStatus
}) {


    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: googleMapsApiKey,
        libraries
    });

    const [markers, setMarkers] = React.useState([]);
    const mapRef = React.useRef();

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
        setMarkers(current => [
            ...current,
            {
                lat,
                lng,
                time: new Date()
            }
        ]);
    }, []);


    if (loadError) return "Error";
    if (!isLoaded) return "Loading...";


    return (
        <div>
            <Search
                panTo={panTo}
                set={setValue}
                val={value}
                col={col}
                setOnSelectLocation={setOnSelectLocation}
                LoStatus={locationStatus}
                updCount={updateStatus}
                setLoSta={setLocationStatus}
                check={check}
                ref={ref}
                locationID={locationID}
                verify={verify}
                setChangesStatus={setChangesStatus}
                setStatesChangeStatus={setStatesChangeStatus}
            />
        </div>
    );
}

export default memo(Location)


function Search({
    panTo,
    set,
    val,
    col,
    setOnSelectLocation,
    LoStatus,
    updCount,
    setLoSta,
    setChangesStatus,
    setStatesChangeStatus,
    check = { check },
    ref,
    locationID,
    verify
}) {

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey
    })

    const containerStyle = { width: '800px', height: '200px' };

    const center = { lat: -3.745, lng: -38.523 };

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    let storageRef = useRef(verify);

    useEffect(() => {
        if (!storageRef.current || LoStatus) {
            handleInput(null);
        }
    }, [verify, LoStatus, updCount])

    const useQuery = () => new URLSearchParams(useLocation().search);
    let openPage = useQuery().get('page');

    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions
    } = usePlacesAutocomplete({
        requestOptions: {
            // location: { lat: () => 43.6532, lng: () => -79.3832 },
            // radius: 100 * 1000,
            // types: ["establishment"],
            componentRestrictions: { country: "us" },
            strictBounds: false,
            fields: [
                "route",
                'name',
                'geometry',
                'formatted_address',
                'street_number',
                'geocode',
                "address_components",
                'displayName',
                'formattedAddress',
                'location',
            ]
        }
    });

    useEffect(() => {
        if (val[col]) {
            setValue(val[col], false);
        }
    }, [val])

    const handleInput = (e) => {
        if (e) {
            setOnSelectLocation(true); setStatesChangeStatus(true); setChangesStatus(true)
            const inputValue = e ? e.target.value : '';
            setValue(inputValue);
            // console.log("Location Value set avlue")
            set(prevState => ({ ...prevState, [col]: inputValue }));
        } else {
            const inputValue = e ? e.target.value : '';
            setValue(inputValue);
            // console.log("Location Value set avlue")
            set(prevState => ({ ...prevState, [col]: inputValue }));
            // setOnSelectLocation(true);
        }
    };

    useEffect(() => {
        if (openPage === 'clear');
    }, [openPage])

    const handleSelect = async (address) => {
        console.log("Location Value set avlue")
        set(pre => { return { ...pre, [col]: address } })
        setValue(address, false);
        clearSuggestions();
        saveVerifyLocation({ address, set, val, col, locationID });
        setOnSelectLocation(false)
        setStatesChangeStatus(true); setChangesStatus(true)
    };

    return (
        <>
            <div className="search" style={{ pointerEvents: !verify && 'none' }}>
                <Combobox onSelect={handleSelect}>
                    <ComboboxInput maxLength={250} style={{ background: check ? '#FFE2A8' : '', }}
                        value={value}
                        // value={val[col] || ''}
                        onChange={handleInput}
                        disabled={!ready}
                        placeholder="Search your location"
                    />
                    <ComboboxPopover >
                        {
                            verify ?
                                <ComboboxList>
                                    {status === "OK" &&
                                        data.map(({ id, description }) => (
                                            <ComboboxOption key={id} value={description} />
                                        ))}
                                </ComboboxList>
                                :
                                <>
                                </>
                        }
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

const saveVerifyLocation = async ({ address, set, val, col, locationID }) => {

    let geoApiData = await SplitAddress(address);
    const LocationGeoCode = geoApiData?.geocode?.location

    // const newArr = LocationGeoCode.map(obj => ({ 'lat': obj.latitude, 'lng': obj.longitude, }));

    let Add = geoApiData?.address?.addressComponents ? geoApiData?.address?.addressComponents : [];

    let country = Add?.filter((obj) => { return obj?.componentType === "country" });
    let City = Add?.filter((obj) => { return obj?.componentType === "locality" });
    let Street = Add?.filter((obj) => { return obj?.componentType === "route" });
    let street_number = Add?.filter((obj) => { return obj?.componentType === 'street_number' });
    let sublocality_level_1 = Add?.filter((obj) => { return obj?.componentType === 'sublocality_level_1' });
    let administrative_area_level_1 = Add?.filter((obj) => { return obj?.componentType === "administrative_area_level_1" });
    let postal_code = Add?.filter((obj) => { return obj?.componentType === "postal_code" });
    let point_of_interest = Add?.filter((obj) => { return obj?.componentType === "point_of_interest" });
    let neighborhood = Add?.filter((obj) => { return obj?.componentType === "neighborhood" });
    let subpremise = Add?.filter((obj) => { return obj?.componentType === "subpremise" });
    let premise = Add?.filter((obj) => { return obj?.componentType === "premise" });
    console.log("Location Value set avlue")
    set(pre => {
        return {
            ...pre,
            'IsUsLocation': 'Y',
            'Street': Street[0]?.componentName?.text ? Street[0].componentName.text : '',
            'City': City[0]?.componentName?.text ? City[0]?.componentName?.text : '',
            'Country': country[0]?.componentName?.text ? country[0]?.componentName?.text : '',
            'PremiseNo': street_number[0]?.componentName?.text ? street_number[0]?.componentName?.text : '',
            'ZipCode': postal_code[0]?.componentName?.text ? postal_code[0]?.componentName?.text : '',
            'TypeSufix': typeof (sublocality_level_1[0]?.componentName?.text) === 'number' ? sublocality_level_1[0]?.componentName?.text : 0,
            'DirectionSufix': administrative_area_level_1[0]?.componentName?.text ? administrative_area_level_1[0]?.componentName?.text : '',
            'point_of_interest': point_of_interest[0]?.componentName?.text ? point_of_interest[0]?.componentName?.text : '',
            'neighborhood': neighborhood[0]?.componentName?.text ? neighborhood[0]?.componentName?.text : '',
            'subpremise': subpremise[0]?.componentName?.text ? subpremise[0]?.componentName?.text : '',
            'premise': premise[0]?.componentName?.text ? premise[0]?.componentName?.text : '',
            'DirectionPrefix': '',
            'State': '',
            'ApartmentNo': '',
            'CommonPlace': '',
            'ApartmentType': '',
            'Street_Parse': '',
            'PremiseNo_Parse': '',
            'DirectionPrefix_Parse': '',
            'TypeSuffix_Parse': '',
            'DirectionSuffix_Parse': '',
            'ZipCodeID': '',
            'CityID': '',
            'CountryID': '',
            // 'coordinateX': LocationGeoCode?.longitude,
            // 'coordinateY': LocationGeoCode?.latitude,
            // 'isCoordinateX': LocationGeoCode?.longitude ? true : false,
            // 'isCoordinateY': LocationGeoCode?.latitude ? true : false,
        }
    })
}
