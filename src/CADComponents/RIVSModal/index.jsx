import { memo, useCallback, useContext, useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import ClassNames from "classnames";
import CreatableSelect from "react-select/creatable";
import useObjState from "../../CADHook/useObjState";
import GeoServices from "../../CADServices/APIs/geo";
import Location from "../Common/Location";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { dropDownDataModel, dropDownDataModelForAptNo, isEmpty, isEmptyObject } from "../../CADUtils/functions/common";
import CallTakerServices from "../../CADServices/APIs/callTaker";
import { get_NameTypeData } from "../../redux/actions/Agency";
import { colourStyles } from "../../Components/Common/Utility";
import { IncidentContext } from "../../CADContext/Incident";
import VehicleSearch from "./VehicleSearch";
import NameSearch from "./NameSearch";
import LocationInformationModal from "../LocationInformationModal";
import { getData_DropDown_Priority } from "../../CADRedux/actions/DropDownsData";
import { customStylesWithOutColor, requiredFieldColourStyles } from "../Utility/CustomStylesForReact";

const RIVSModal = (props) => {
    const { openRIVSModal, setOpenRIVSModal } = props;
    const { resourceData, resourceRefetch, incidentRefetch } = useContext(IncidentContext);
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const stateList = useSelector((state) => state.DropDown.stateDrpData);
    const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData)
    const nameTypeData = useSelector((state) => state.Agency.nameTypeData);
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
        isVerify: false
    };
    const [isCheckGoogleLocation, setIsCheckGoogleLocation] = useState(false)
    const [geoFormValues, setGEOFormValues] = useState(initialFormValues);
    const [addressFormValues, setAddressFormValues] = useState(initialFormValues);
    const [locationData, setLocationData] = useState();
    const [addressData, setAddressData] = useState();
    const [flagDropDown, setFlagDropDown] = useState([]);
    const [geoLocationID, setGeoLocationID] = useState();
    const [addressLocationID, setAddressLocationID] = useState();
    const [premiseDropDown, setPremiseDropDown] = useState([]);
    const [loginPinID, setLoginPinID] = useState(1);
    const [isSelectLocation, setIsSelectLocation] = useState(false);
    const [isAddressSelectLocation, setIsAddressSelectLocation] = useState(false);
    const [onSelectLocation, setOnSelectLocation] = useState(true);
    const [onAddressSelectLocation, setAddressOnSelectLocation] = useState(true);
    const [isChangeFields, setIsChangeFields] = useState(false);
    const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
    const [aptData, setAptData] = useState("")
    const [aptInputValue, setAptInputValue] = useState("");
    const [CFSDropDown, setCFSDropDown] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [tagYearDropDown, setTagYearDropDown] = useState([]);
    const [isOpenVehicleSearchModel, setIsOpenVehicleSearchModel] = useState(false);
    const [isOpenSearchNameModel, setIsOpenSearchNameModel] = useState(false);
    const [geoZoneDropDown, setGeoZoneDropDown] = useState([]);
    const [isGoogleLocation, setIsGoogleLocation] = useState(true)
    const [isGoogleAddress, setIsGoogleAddress] = useState(true)
    const [isCallAPI, setIsCallAPI] = useState(false)
    const [isVerifyReportedLocation, setIsVerifyReportedLocation] = useState(false);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);

    const [
        rIVSState,
        setRIVSState,
        handleRIVSState,
        clearRIVSState,
    ] = useObjState({
        vehicleStop: false,
        assignResource: false,
        Resources: "",
        location: "",
        ApartmentNo: "",
        CFSCodeID: "",
        CFSLDesc: "",
        PriorityID: "",
        StateCode: "",
        PlateTypeCode: "",
        NameTypeID: "",
        LastName: "",
        FirstName: "",
        MiddleName: "",
        DLStateID: "",
        DLNumber: "",
        Comments: "",
        AddressApartment: "",
        VehiclePlate: "",
    });

    const [
        errorState,
        ,
        handleErrorState,
        clearStateState,
    ] = useObjState({
        Resources: false,
        PriorityID: false,
        location: false,
        CFSCodeID: false,

    });

    const [openLocationInformationModal, setOpenLocationInformationModal] = useState(false);

    const onCloseLocation = () => {
        setOpenRIVSModal(false);
        clearRIVSState();
        clearStateState();
        setIsSelectLocation(false);
        setIsAddressSelectLocation(false);
        setOnSelectLocation(true);
        setAddressOnSelectLocation(true);
        setAddressFormValues(initialFormValues);
        setGEOFormValues(initialFormValues);
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

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
            dispatch(get_NameTypeData(loginAgencyID))
            if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
        }
    }, [localStoreData]);


    const CFSCodeKey = `/CAD/MasterCallforServiceCode/InsertCallforServiceCode`;
    const { data: CFSCodeData, isSuccess: isFetchCFSCodeData } = useQuery(
        [
            CFSCodeKey,
            {
                Action: "GetData_DropDown_CallforService",
                AgencyID: loginAgencyID,
            }
        ],
        MasterTableListServices.getCFS,
        {
            refetchOnWindowFocus: false,
            enabled: openRIVSModal && !!loginAgencyID,
        }
    );

    useEffect(() => {
        if (isFetchCFSCodeData && CFSCodeData) {
            const parsedData = JSON.parse(CFSCodeData?.data?.data);
            setCFSDropDown(parsedData?.Table);
        }
    }, [isFetchCFSCodeData, CFSCodeData]);

    const aptSuiteNoPayload = {
        GeoLocationID: geoLocationID,
        AgencyID: loginAgencyID,
    };

    const aptSuiteNoKey = `/CAD/GeoLocation/Get_GeoLocationApartmentNo`;
    const { data: aptSuiteNoData, isSuccess: isFetchAptSuiteNoData, refetch: refetchAptSuiteNoData } = useQuery(
        [
            aptSuiteNoKey,
            {
                aptSuiteNoPayload,
            },
        ],
        CallTakerServices.getAptSuiteNo,
        {
            refetchOnWindowFocus: false,
            enabled: !!geoLocationID
        }
    );

    useEffect(() => {
        if (isFetchAptSuiteNoData && aptSuiteNoData?.data?.data && geoLocationID && geoFormValues?.location) {
            const parsedData = JSON.parse(aptSuiteNoData.data.data || "{}");
            setAptSuiteNoDropDown(parsedData?.Table?.length ? dropDownDataModelForAptNo(parsedData.Table, "Description", "Description", "AptID") : []);
        } else {
            setAptInputValue("");
            setAptSuiteNoDropDown([]);
        }
    }, [isFetchAptSuiteNoData, aptSuiteNoData, geoLocationID, geoFormValues?.location]);


    useEffect(() => {
        if (!isSelectLocation && !geoFormValues?.location) {
            setRIVSState((prevState) => ({
                ...prevState,
                ApartmentNo: "",
            }));
            setAptSuiteNoDropDown([]);
        }
    }, [isFetchAptSuiteNoData, aptSuiteNoData, geoLocationID, geoFormValues?.location]);

    const tagYearKey = `/CAD/CallTakerVehiclePlateType/GetData_TagYear`;
    const { data: tagYearData, isSuccess: isFetchTagYearData } = useQuery(
        [tagYearKey],
        CallTakerServices.getTagYear,
        {
            refetchOnWindowFocus: false,
            enabled: openRIVSModal
        }
    );

    useEffect(() => {
        if (isFetchTagYearData && tagYearData) {
            const data = JSON.parse(tagYearData?.data?.data);
            setTagYearDropDown(dropDownDataModel(data?.Table, "TagYear", "TagYear"));
        }
    }, [isFetchTagYearData, tagYearData]);

    const geoZoneKey = `/CAD/GeoPetrolZone/GetData_Zone`;
    const { data: geoZoneData, isSuccess: isFetchGeoZoneData } = useQuery(
        [geoZoneKey, { IsActive: 1 }],
        GeoServices.getGeoZone,
        {
            refetchOnWindowFocus: false,
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
        setIsVerifyReportedLocation(false);
        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: geoFormValues?.location,
                    AgencyID: loginAgencyID,
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
                setAptSuiteNoDropDown([]);
            }
        };

        if (geoFormValues?.location) {
            fetchLocationData();
        }
    }, [geoFormValues?.location, isSelectLocation]);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: addressFormValues?.location,
                    AgencyID: loginAgencyID,
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setAddressData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setAddressData([]);
                setAptSuiteNoDropDown([]);
            }
        };

        if (addressFormValues?.location) {
            fetchLocationData();
        }
    }, [addressFormValues?.location, isSelectLocation]);


    const handleCreateOption = (aptInputValue) => {
        if (/^[a-zA-Z0-9]{1,4}$/.test(aptInputValue)) {
            const newOption = { value: aptInputValue, label: aptInputValue, aptId: "" };
            setAptSuiteNoDropDown((prev) => [...prev, newOption]);
            handleSelectAptSuitNo(newOption, { name: "ApartmentNo" });
            setAptInputValue("");
        }
    };

    const handleInputChange = (value, { action }) => {
        if (action === "input-change") {
            if (/^[a-zA-Z0-9]{0,4}$/.test(value)) {
                setAptInputValue(value);
            }
        }
    };


    const handleSelectAptSuitNo = (selectedOption, { name }) => {
        if (selectedOption) {
            handleRIVSState(name, selectedOption?.value || "",);
            setAptData(selectedOption);
        } else if (defaultOption) {
            handleRIVSState(name, "",);
            setAptData({ value: '', label: '', aptId: defaultOption.aptId });
        } else {
            handleRIVSState(name, "",);
            setAptData({ value: '', label: '', aptId: '' });
        }
        setIsChangeFields(true);
        setAptInputValue("")
    };


    const defaultOption = aptSuiteNoDropDown.find(
        (option) => option?.aptId && !option?.value && !option?.label
    );
    
    useEffect(() => {
        if (!aptData?.value && !aptData?.label && defaultOption) {
            setAptData({ value: '', label: '', aptId: defaultOption.aptId });
        }
    }, [aptSuiteNoDropDown, defaultOption]);

    const isValidZone = (zone) => zone && Object.keys(zone).length > 0;

    const isVerifyLocation =
        geoFormValues.isVerify &&
        isValidZone(geoFormValues.patrolZone) &&
        isValidZone(geoFormValues.emsZone) &&
        isValidZone(geoFormValues.fireZone) &&
        isValidZone(geoFormValues.otherZone);

    const isVerifyAddress =
        addressFormValues.isVerify &&
        isValidZone(addressFormValues.patrolZone) &&
        isValidZone(addressFormValues.emsZone) &&
        isValidZone(addressFormValues.fireZone) &&
        isValidZone(addressFormValues.otherZone);

    const createPayload = (GeoLocationID) => {
        const transformedData = rIVSState.LastName || rIVSState.FirstName || rIVSState?.MiddleName ? [{
            "LastName": rIVSState?.LastName,
            "FirstName": rIVSState?.FirstName,
            "MiddleName": rIVSState?.MiddleName,
            "ReasonCode": rIVSState?.NameTypeID === 1 ? "2" : "137",
            "NameTypeID": rIVSState?.NameTypeID,
            "DLNumber": rIVSState?.DLNumber,
            "DLStateID": rIVSState?.DLStateID,
            "Address": addressFormValues?.location
        }] : "";
        const transformedVehicleData = rIVSState?.VehiclePlate || rIVSState?.PlateTypeCode || rIVSState?.StateCode || rIVSState?.TagYear ? [{
            "VehicleNo": rIVSState?.VehiclePlate,
            "PlateTypeID": rIVSState?.PlateTypeCode,
            "PlateID": rIVSState?.StateCode,
            "ManufactureYear": rIVSState?.TagYear
        }] : "";

        const payload = {
            AgencyID: loginAgencyID || "",
            CADCFSCodeID: rIVSState?.CFSCodeID || 0,
            LocationID: GeoLocationID ? GeoLocationID : geoFormValues?.Id ? geoFormValues?.Id : "",
            LocationDate: new Date().toISOString(),
            DirectionPrefix: geoFormValues?.stDirection || null,
            Street: geoFormValues?.Street || "",
            DirectionSufix: geoFormValues?.stDirection2 || "",
            Comments: rIVSState?.Comments || "",
            City: geoFormValues?.City || "",
            ZipCode: geoFormValues?.ZipCode || "",
            PremiseNo: geoFormValues?.PremiseNo || "",
            ApartmentNo: rIVSState.ApartmentNo ? rIVSState.ApartmentNo : "",
            CommonPlace: geoFormValues?.commonPlaceName || "",
            CFSL: 1,
            PremiseType: geoFormValues?.premiseType?.value || "",
            MileMaker: geoFormValues?.mileMarker || "",
            AltStreet: geoFormValues?.AltStreet || "",
            InterDirectionPrefix: geoFormValues?.intersection1 || "",
            InterDirectionSufix: geoFormValues?.intersection2 || "",
            CreatedByUserFK: loginPinID || "",
            ResourceIDs: rIVSState?.Resources?.ResourceID || "",
            PriorityID: rIVSState?.PriorityID || "",
            Location: geoFormValues?.location || "",
            Latitude: geoFormValues?.coordinateY || "",
            Longitude: geoFormValues?.coordinateX || "",
            ChildNameJson: transformedData?.length > 0 ? JSON.stringify(transformedData) : "",
            ChildVehicleJson: transformedVehicleData?.length > 0 ? JSON.stringify(transformedVehicleData) : "",
        };
        return payload;
    };

    const createLocationPayload = (locationInformation, isAddress) => {
        const data = locationInformation || geoFormValues;
        const {
            Street = "", stDirection = "", stDirection2 = "", City = "",
            ZipCode = "", PremiseNo = "", ApartmentNo = "", commonPlaceName = "",
            premiseType = {}, coordinateX = "", coordinateY = "", mileMarker = "",
            AltStreet = "", intersection1 = "", intersection2 = "", patrolZone = {},
            emsZone = {}, fireZone = {}, otherZone = {}, IsVerify = "", location = "",
            currentFlag = []
        } = data || {};

        return {
            ...(geoLocationID && { ID: geoLocationID }),
            Street, "DirectionPrefix": stDirection, "DirectionSufix": stDirection2,
            City, ZipCode, PremiseNo, ApartmentNo: rIVSState.ApartmentNo ? rIVSState.ApartmentNo : "", "CommonPlace": commonPlaceName,
            "PremiseType": premiseType?.label || "", "Latitude": coordinateY, "Longitude": coordinateX,
            "MileMaker": mileMarker, AltStreet, "InterDirectionPrefix": intersection1,
            "InterDirectionSufix": intersection2, "PatrolZone": patrolZone?.label, "EMSZone": emsZone?.label,
            "FireZone": fireZone?.label, "OtherZone": otherZone?.label, IsVerified: IsVerify,
            location,
            "CreatedByUserFK": loginPinID, "AgencyID": loginAgencyID
        };
    };

    const insertIncident = async (formData) => {
        try {
            const response = await CallTakerServices.insertRIVSIncident(formData);
            if (response) {
                onCloseLocation()
                resourceRefetch();
                incidentRefetch()
            }
        } catch (error) {
            console.error("Failed to insert incident data", error);
        }
    };

    const validateGeoFormValues = () => {
        let isError = false;
        const keys = Object.keys(errorState);
        keys.map((field) => {
            if (
                field === "location" &&
                isEmpty(geoFormValues[field])) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "Resources" && isEmptyObject(rIVSState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "CFSCodeID" && isEmpty(rIVSState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else if (field === "PriorityID" && isEmpty(rIVSState[field])) {
                handleErrorState(field, true);
                isError = true;
            } else {
                handleErrorState(field, false);
            }
            return null;
        });
        return !isError;
    };
    async function handleSave() {
        if (!validateGeoFormValues()) return;
        setIsCallAPI(true);
        let formData;
        if (isGoogleLocation && geoLocationID) {
            formData = createPayload(geoLocationID)
        }
        else {
            formData = createPayload()
        }
        if (addressFormValues?.location?.length > 0) {
            if (isGoogleAddress && !addressLocationID) {
                const locationPayload = createLocationPayload(addressFormValues, true);
                const response = await GeoServices.insertLocation(locationPayload);
                if (response?.data?.success) {
                    if (!geoLocationID) {
                        const data = JSON.parse(response?.data?.data);
                        const newGeoLocationID = data?.Table[0]?.GeoLocationID;
                        setGeoLocationID(newGeoLocationID);
                    }
                }
            }
        }

        if (isGoogleLocation && !geoLocationID) {
            const locationPayload = createLocationPayload(geoFormValues, false);
            const response = await GeoServices.insertLocation(locationPayload);
            if (response?.data?.success) {
                if (!geoLocationID) {
                    const data = JSON.parse(response?.data?.data);
                    const newGeoLocationID = data?.Table[0]?.GeoLocationID;
                    setGeoLocationID(newGeoLocationID);
                    formData = createPayload(newGeoLocationID);
                }
                setIsChangeFields(false);
            }
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await insertIncident(formData);
        } else {
            await insertIncident(formData);
        }
        setIsCallAPI(false);
    }

    const isFieldEmpty = (field) => {
        return field === null || field === "" || field === undefined;
    };

    const isVehicleButtonDisabled =
        isFieldEmpty(rIVSState.VehiclePlate) &&
        isFieldEmpty(rIVSState.StateCode) &&
        isFieldEmpty(rIVSState.PlateTypeCode) &&
        isFieldEmpty(rIVSState.TagYear);

    const isNameButtonDisabled =
        isFieldEmpty(rIVSState.LastName) &&
        isFieldEmpty(rIVSState.FirstName) &&
        isFieldEmpty(rIVSState.MiddleName);



    return (
        <>
            {openRIVSModal ? (
                <>
                    <dialog
                        className="modal fade"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="RIVSModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-xl">
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
                                                    Unit Initiated Incident
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>

                                            <div className="tab-form-container">
                                                {/* Line 1 */}
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap">
                                                            Vehicle Stop
                                                        </label>
                                                    </div>
                                                    <div className="col-1 form-check d-flex align-items-center ml-3">
                                                        <input className="form-check-input mb-1" type="checkbox" value="vehicleStop" id="vehicleStop" checked={rIVSState?.vehicleStop} onChange={(e) => {
                                                            handleRIVSState("vehicleStop", e.target.checked);
                                                        }}
                                                            name="vehicleStop" />
                                                        <label className="tab-form-label" htmlFor="vehicleStop" for="vehicleStop">
                                                            {rIVSState?.vehicleStop ? " Yes" : ""}
                                                        </label>
                                                    </div>
                                                    <div className="col-1 d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap">
                                                            Assign Unit
                                                        </label>
                                                    </div>
                                                    <div className="col-1 form-check d-flex align-items-center ml-3">
                                                        <input className="form-check-input mb-1" type="checkbox" value="assignResource" id="assignResource" name="assignResource"
                                                            checked={rIVSState?.assignResource} onChange={(e) => {
                                                                handleRIVSState("assignResource", e.target.checked);
                                                            }} />
                                                        <label className="tab-form-label" htmlFor="assignResource" for="assignResource">
                                                            {rIVSState?.assignResource ? " Yes" : ""}
                                                        </label>
                                                    </div>
                                                </div>
                                                {/* Line 2 */}
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label htmlFor="" className="tab-form-label" style={{ textAlign: "end", marginRight: "4px" }}>Unit # {errorState.Resources && isEmptyObject(rIVSState.Resources) && (
                                                            <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select  Unit #"}</p>
                                                        )}</label>
                                                    </div>
                                                    <div className="col-2">
                                                        <Select
                                                            className="w-100"
                                                            isClearable
                                                            options={resourceData || []}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={rIVSState?.Resources}
                                                            onChange={(selectedOptions) => {
                                                                handleRIVSState("Resources", selectedOptions);
                                                            }}
                                                            styles={requiredFieldColourStyles}
                                                            maxMenuHeight={180}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            isSearchable={true}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Line 4 */}
                                                <div className="tab-form-row">
                                                    <div className="col-1 offset-1 d-flex align-self-center justify-content-end">
                                                        <label htmlFor="" className="tab-form-label" style={{ textAlign: "end", marginRight: "4px" }}>
                                                            Location
                                                            {errorState.location && (isEmpty(geoFormValues?.location) || geoFormValues?.location === null) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Location"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-8 w-100 d-flex tab-form-row-gap inner-input-fullw" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ flexGrow: 1 }}>
                                                            <Location
                                                                {...{
                                                                    value: geoFormValues,
                                                                    setValue: setGEOFormValues,
                                                                    locationData,
                                                                    setOnSelectLocation,
                                                                    setGeoLocationID,
                                                                    flagDropDown,
                                                                    premiseDropDown,
                                                                    setIsSelectLocation,
                                                                    setIsChangeFields,
                                                                    geoZoneDropDown,
                                                                    setIsGoogleLocation,
                                                                    setIsCheckGoogleLocation,
                                                                }}
                                                                col="location"
                                                                locationID="NameLocationID"
                                                                check={true}
                                                                verify={geoFormValues.IsVerify}
                                                                page="Name"
                                                                isGEO
                                                            />
                                                        </div>
                                                        <div className="d-flex align-items-center" style={{ marginLeft: 'auto', gap: '8px' }}>
                                                            {geoFormValues?.location &&
                                                                <span
                                                                    data-toggle={geoFormValues?.location ? "modal" : undefined}
                                                                    data-target={geoFormValues?.location ? "#LocationInformationModal" : undefined}
                                                                    onClick={() => {
                                                                        if (!geoFormValues?.location) return; // Prevent click event when disabled

                                                                        // setSelectedButton(prevSelected =>
                                                                        //     prevSelected.includes(3)
                                                                        //         ? prevSelected.filter(item => item !== 3)
                                                                        //         : [...prevSelected, 3]
                                                                        // );
                                                                        setOpenLocationInformationModal(true);
                                                                    }}
                                                                    className={`pt-1 ${!geoFormValues?.location ? "disabled" : ""}`}
                                                                    style={{
                                                                        fontSize: "16px",
                                                                        cursor: geoFormValues?.location ? "pointer" : "not-allowed",
                                                                        color: geoFormValues?.location ? "blue" : "gray",
                                                                        pointerEvents: !geoFormValues?.location ? "none" : "auto",
                                                                    }}
                                                                >
                                                                    {isVerifyLocation || isVerifyReportedLocation ?
                                                                        <span className="badge text-white" style={{ backgroundColor: "#008000", padding: "9px" }}>Verified</span> :
                                                                        <span span className="badge text-white " style={{ textDecoration: "underline", padding: "9px", backgroundColor: "#ff0000", cursor: "pointer" }}>
                                                                            Unverified
                                                                        </span>

                                                                    }
                                                                </span>}
                                                        </div>
                                                    </div>
                                                    <div className="col-2 d-flex tab-form-row-gap">
                                                        <div className=" d-flex align-self-center justify-content-end">
                                                            <label
                                                                for=""
                                                                className="tab-form-label text-nowrap"
                                                            >
                                                                Apt/Suite#
                                                            </label>
                                                        </div>
                                                        <CreatableSelect
                                                            isClearable
                                                            options={aptSuiteNoDropDown.filter(
                                                                (option) => option.value && option.label
                                                            )}
                                                            placeholder="Select..."
                                                            name="ApartmentNo"
                                                            value={
                                                                rIVSState.ApartmentNo
                                                                    ? { value: rIVSState.ApartmentNo, label: rIVSState.ApartmentNo }
                                                                    : defaultOption || null
                                                            }
                                                            onChange={
                                                                handleSelectAptSuitNo
                                                            }
                                                            onCreateOption={handleCreateOption}
                                                            inputValue={aptInputValue}
                                                            onInputChange={handleInputChange}
                                                            styles={{
                                                                control: (provided) => ({
                                                                    ...provided,
                                                                    width: "100%",
                                                                }),
                                                            }}
                                                            className="w-100"
                                                            menuPlacement="bottom"
                                                        />
                                                    </div>
                                                </div>


                                                {/* Line 5*/}
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label htmlFor="" className="new-label">
                                                            CFS : {errorState.CFSCodeID && isEmpty(rIVSState.CFSCodeID) && (
                                                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CFS"}</p>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex tab-form-row-gap">
                                                        <Select
                                                            name="CFSLId"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === rIVSState?.CFSCodeID)}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            maxMenuHeight={200}
                                                            onChange={(v) => {
                                                                handleRIVSState("CFSCodeID", v?.CallforServiceID);
                                                                handleRIVSState("CFSLDesc", v?.CallforServiceID);
                                                                handleRIVSState("PriorityID", v?.PriorityID);
                                                            }}
                                                            placeholder="Select..."
                                                            styles={requiredFieldColourStyles}
                                                            className="w-100"
                                                            isClearable
                                                            filterOption={(option, inputValue) =>
                                                                option.data.CFSCODE.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-6 d-flex tab-form-row-gap">
                                                        <Select
                                                            name="CFSLDesc"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === rIVSState?.CFSLDesc)}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            maxMenuHeight={200}
                                                            onChange={(v) => {
                                                                handleRIVSState("CFSCodeID", v?.CallforServiceID);
                                                                handleRIVSState("CFSLDesc", v?.CallforServiceID);
                                                                handleRIVSState("PriorityID", v?.PriorityID);
                                                            }}
                                                            placeholder="Select..."
                                                            styles={requiredFieldColourStyles}
                                                            className="w-100"
                                                            isClearable
                                                            filterOption={(option, inputValue) =>
                                                                option.data.CFSCodeDescription.toLowerCase().startsWith(inputValue.toLowerCase())
                                                            }
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex tab-form-row-gap">
                                                        <div className="d-flex align-self-center justify-content-end" style={{ width: "100px" }}>
                                                            <label
                                                                for=""
                                                                className="tab-form-label text-nowrap"
                                                            >
                                                                Priority {errorState.PriorityID && isEmpty(rIVSState.PriorityID) && (
                                                                    <p style={{ color: 'red', fontSize: '10px', margin: '0px', padding: '0px' }}>{"Select Priority"}</p>
                                                                )}
                                                            </label>
                                                        </div>
                                                        <Select
                                                            name="CFSLPriority"
                                                            value={PriorityDrpData?.find((item) => item?.PriorityID == rIVSState?.PriorityID)}
                                                            options={PriorityDrpData}
                                                            getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                                            getOptionValue={(v) => v?.PriorityCode}
                                                            maxMenuHeight={200}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.PriorityCode} | ${option?.Description}`
                                                                    : option?.PriorityCode;
                                                            }}
                                                            onChange={(v) => { handleRIVSState("PriorityID", v?.PriorityID) }}
                                                            placeholder="Select..."
                                                            styles={requiredFieldColourStyles}
                                                            className="w-100"
                                                            isClearable
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Line 6 */}
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Comments</label>
                                                    </div>
                                                    <div className="col-10">
                                                        <textarea
                                                            name="comments"
                                                            rows="2"
                                                            className="form-control py-1 new-input"
                                                            style={{ height: "auto", overflow: "hidden" }}
                                                            value={rIVSState?.Comments}
                                                            maxLength={1000} // Restricts to 1000 characters
                                                            onChange={(e) => {
                                                                e.target.style.height = "auto"; // Reset height
                                                                e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height dynamically
                                                                handleRIVSState("Comments", e.target.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Line 7 */}
                                                <div className="tab-from-row d-flex align-items-center">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Vehicle Plate</label>
                                                    </div>
                                                    <div className="col-2">
                                                        <input
                                                            name="location"
                                                            type="text"
                                                            className="form-control py-1 new-input"
                                                            value={rIVSState?.VehiclePlate}
                                                            onChange={(e) => {
                                                                let ele = e.target.value.replace(/[^0-9a-zA-Z]/g, "");
                                                                const checkNumber = ele.toUpperCase();
                                                                handleRIVSState("VehiclePlate", checkNumber);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-end ml-4">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">State</label>
                                                    </div>
                                                    <div className="col-2">
                                                        <Select
                                                            isClearable
                                                            options={stateList}
                                                            placeholder="Select..."
                                                            styles={customStylesWithOutColor}
                                                            className="w-100"
                                                            maxMenuHeight={200}
                                                            name="StateCode"
                                                            value={rIVSState?.StateCode ? stateList?.find((i) => i?.value === parseInt(rIVSState?.StateCode)) : ""}
                                                            onChange={(e) => { if (e?.value) { handleRIVSState("StateCode", e.value) } else { handleRIVSState("StateCode", "") } }}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-end ml-4">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Plate Type</label>
                                                    </div>
                                                    <div className="col-2">
                                                        <Select
                                                            isClearable
                                                            options={plateTypeIdDrp}
                                                            placeholder="Select..."
                                                            name="PlateTypeCode"
                                                            value={rIVSState?.PlateTypeCode ? plateTypeIdDrp?.find((i) => i?.value === parseInt(rIVSState?.PlateTypeCode)) : ""}
                                                            onChange={(e) => { if (e?.value) { handleRIVSState("PlateTypeCode", e.value) } else { handleRIVSState("PlateTypeCode", "") } }}
                                                            styles={customStylesWithOutColor}
                                                            className="w-100"
                                                            maxMenuHeight={200}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-end ml-4">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Tag Year</label>
                                                    </div>
                                                    <div className="col-2 d-flex align-items-center">
                                                        <Select
                                                            isClearable
                                                            options={tagYearDropDown}
                                                            placeholder="Select..."
                                                            name="TagYear"
                                                            value={rIVSState?.TagYear ? tagYearDropDown?.find((i) => i.value === parseInt(rIVSState?.TagYear)) : ""}
                                                            onChange={(e) => { if (e?.value) { handleRIVSState("TagYear", e.value) } else { handleRIVSState("TagYear", "") } }}
                                                            styles={customStylesWithOutColor}
                                                            className="w-100"
                                                            maxMenuHeight={200}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-CADprimary ml-1"
                                                            data-toggle="modal"
                                                            data-target="#VehicleRIVSSearchModal"
                                                            disabled={isVehicleButtonDisabled}
                                                            onClick={() => setIsOpenVehicleSearchModel(true)}
                                                        >
                                                            <i className="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Owner's Details */}
                                                <fieldset className="tab-form-container mt-2">
                                                    <legend className="cad-legend">Owner's Details</legend>
                                                </fieldset>
                                                {/* Line 9 */}
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Owner Type</label>
                                                    </div>
                                                    <div className="col-2">
                                                        <Select
                                                            name='NameTypeID'
                                                            value={nameTypeData?.filter((obj) => obj.value === rIVSState?.NameTypeID)}
                                                            options={nameTypeData}
                                                            onChange={(e) => { if (e?.value) { handleRIVSState("NameTypeID", e?.value) } else { handleRIVSState("NameTypeID", "") } }}
                                                            isClearable
                                                            placeholder="Select..."
                                                            styles={colourStyles}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Line 10 */}
                                                <div className="tab-form-row">
                                                    <div className="col-12 tab-form-row-gap">
                                                        <div className="d-flex align-items-center justify-content-end">
                                                            <label className="tab-form-label text-nowrap" style={{ marginLeft: "150px" }}>
                                                                Last Name
                                                            </label>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className={ClassNames(
                                                                "form-control py-1 new-input"
                                                            )}
                                                            value={rIVSState?.LastName}
                                                            onChange={(e) => handleRIVSState("LastName", e.target.value)}
                                                            name="LastName"
                                                            onKeyDown={handleKeyDown}
                                                        />
                                                        <div className="d-flex align-self-center justify-content-end">
                                                            <label className="tab-form-label text-nowrap">
                                                                First Name
                                                            </label>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input"
                                                            onKeyDown={handleKeyDown}
                                                            value={rIVSState?.FirstName}
                                                            onChange={(e) => handleRIVSState("FirstName", e.target.value)}
                                                            name="FirstName"
                                                        />
                                                        <div className="d-flex align-self-center justify-content-end">
                                                            <label className="tab-form-label text-nowrap">
                                                                Middle Name
                                                            </label>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input"
                                                            name="MiddleName"
                                                            value={rIVSState?.MiddleName}
                                                            onChange={(e) => handleRIVSState("MiddleName", e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-CADprimary ml-1"
                                                            data-toggle="modal"
                                                            disabled={isNameButtonDisabled}
                                                            data-target="#NameRIVSSearchModal"
                                                            onClick={() => setIsOpenSearchNameModel(true)}
                                                        >
                                                            <i className="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Line 11 */}
                                                <div className="tab-form-row">
                                                    <div className="col-2 offset-0 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">State</label>
                                                    </div>
                                                    <div className="col-6 d-flex align-items-center p-0">
                                                        <div className="col-3 col-md-5 col-lg-4 mt-1" >
                                                            <Select
                                                                name='DLStateID'
                                                                value={stateList?.filter((obj) => obj.value === rIVSState?.DLStateID)}
                                                                options={stateList}
                                                                onChange={(e) => { if (e?.value) { handleRIVSState('DLStateID', e?.value) } else { handleRIVSState('DLStateID', '') } }}
                                                                menuPlacement="top"
                                                                maxMenuHeight={200}
                                                                isClearable
                                                                placeholder="State"
                                                                styles={customStylesWithOutColor}
                                                            />
                                                        </div>
                                                        <span className='dash-name mt-1' >__</span>
                                                        <div className="col-3 col-md-5 col-lg-4 text-field mt-1" >
                                                            <input
                                                                type="text"
                                                                className={rIVSState?.DLStateID ? '' : 'readonlyColor'}
                                                                style={{ textTransform: "uppercase" }}
                                                                value={rIVSState?.DLNumber ? rIVSState.DLNumber.replace(/[^\w\s]/g, '') : ''}
                                                                maxLength={21}
                                                                disabled={rIVSState?.DLStateID ? false : true}
                                                                onChange={(e) => handleRIVSState('DLNumber', e.target.value)}
                                                                name="DLNumber"
                                                                required
                                                                autoComplete='off'
                                                            />

                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Line 12 */}
                                                <div className="tab-form-row">
                                                    <div className="col-1 offset-1 d-flex align-self-center justify-content-end">
                                                        <label htmlFor="" className="tab-form-label" style={{ textAlign: "end", marginRight: "4px" }}>
                                                            Address
                                                        </label>
                                                    </div>
                                                    <div className="col-8 w-100 d-flex tab-form-row-gap inner-input-fullw" style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ flexGrow: 1 }}>
                                                            <Location
                                                                {...{
                                                                    value: addressFormValues,
                                                                    setValue: setAddressFormValues,
                                                                    locationData: addressData,
                                                                    setOnSelectLocation: setAddressOnSelectLocation,
                                                                    setGeoLocationID: setAddressLocationID,
                                                                    flagDropDown,
                                                                    geoZoneDropDown,
                                                                    premiseDropDown,
                                                                    setIsSelectLocation: setIsAddressSelectLocation,
                                                                    setIsGoogleLocation: setIsGoogleAddress
                                                                }}
                                                                col="location"
                                                                locationID="NameLocationID"
                                                                check={false}
                                                                verify={addressFormValues.IsVerify}
                                                                page="Name"
                                                                isGEO
                                                            />
                                                        </div>
                                                        <div className="d-flex align-items-center" style={{ marginLeft: 'auto', gap: '8px' }}>
                                                            {addressFormValues?.location &&
                                                                <span
                                                                    data-toggle={addressFormValues?.location ? "modal" : undefined}
                                                                    data-target={addressFormValues?.location ? "#LocationInformationModal" : undefined}
                                                                    onClick={() => {
                                                                        if (!addressFormValues?.location) return; // Prevent click event when disabled

                                                                        // setSelectedButton(prevSelected =>
                                                                        //     prevSelected.includes(3)
                                                                        //         ? prevSelected.filter(item => item !== 3)
                                                                        //         : [...prevSelected, 3]
                                                                        // );
                                                                        setOpenLocationInformationModal(true);
                                                                    }}
                                                                    className={`pt-1 ${!addressFormValues?.location ? "disabled" : ""}`}
                                                                    style={{
                                                                        fontSize: "16px",
                                                                        cursor: addressFormValues?.location ? "pointer" : "not-allowed",
                                                                        color: addressFormValues?.location ? "blue" : "gray",
                                                                        pointerEvents: !addressFormValues?.location ? "none" : "auto",
                                                                    }}
                                                                >
                                                                    {isVerifyAddress ?
                                                                        <span className="badge text-white" style={{ backgroundColor: "#008000", padding: "9px" }}>Verified</span> :
                                                                        <span span className="badge text-white " style={{ textDecoration: "underline", padding: "9px", backgroundColor: "#ff0000", cursor: "pointer" }}>
                                                                            Unverified
                                                                        </span>

                                                                    }
                                                                </span>}
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-2 d-flex tab-form-row-gap">
                                                        <div className=" d-flex align-self-center justify-content-end">
                                                            <label
                                                                for=""
                                                                className="tab-form-label text-nowrap"
                                                            >
                                                                Apt/Suite#
                                                            </label>
                                                        </div>
                                                        <CreatableSelect
                                                            isClearable
                                                            options={aptSuiteNoDropDown.filter(
                                                                (option) => option.value && option.label
                                                            )}
                                                            placeholder="Select..."
                                                            name="AddressApartment"
                                                            value={
                                                                rIVSState.AddressApartment
                                                                    ? { value: rIVSState.AddressApartment, label: rIVSState.AddressApartment }
                                                                    : defaultOption || null
                                                            }
                                                            onChange={
                                                                handleSelectAptSuitNo
                                                            }
                                                            onCreateOption={handleCreateOption}
                                                            inputValue={aptInputValue}
                                                            onInputChange={handleInputChange}
                                                            styles={{
                                                                control: (provided) => ({
                                                                    ...provided,
                                                                    width: "100%",
                                                                }),
                                                            }}
                                                            className="w-100"
                                                            menuPlacement="bottom"
                                                        />
                                                    </div> */}
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
                                                        disabled={isCallAPI}
                                                        onClick={() => handleSave()}
                                                    >
                                                        {"Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        data-dismiss="modal"
                                                        disabled={isCallAPI}
                                                        className="cancel-button"
                                                        onClick={() => onCloseLocation()}
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
            {isOpenVehicleSearchModel && <VehicleSearch isOpenVehicleSearchModel={isOpenVehicleSearchModel} setIsOpenVehicleSearchModel={setIsOpenVehicleSearchModel} rIVSState={rIVSState} setRIVSState={setRIVSState} />}
            {isOpenSearchNameModel && <NameSearch {...{ isOpenSearchNameModel, setIsOpenSearchNameModel, rIVSState, setRIVSState }} />}
            <LocationInformationModal {...{ openLocationInformationModal, setOpenLocationInformationModal, geoFormValues, setGEOFormValues, isGoogleLocation, createLocationPayload, isVerifyLocation, geoLocationID, isCheckGoogleLocation, setIsVerifyReportedLocation }} />
        </>
    );
};

export default memo(RIVSModal);

// PropTypes definition
RIVSModal.propTypes = {
    openRIVSModal: PropTypes.bool.isRequired,
    setOpenRIVSModal: PropTypes.func.isRequired
};

// Default props
RIVSModal.defaultProps = {
    openRIVSModal: false,
    setOpenRIVSModal: () => { }
};
