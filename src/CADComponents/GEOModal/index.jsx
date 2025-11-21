import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { useQuery } from "react-query";
import GeoServices from "../../CADServices/APIs/geo";
import {
  compareStrings,
  dropDownDataModel,
  dropDownDataModelForAptNo,
  handleNumberNoSpaceKeyDown,
  handleNumberTextKeyDown,
  handleNumDotNoSpaceKeyDown,
  isEmpty,
  isEmptyObject,
} from "../../CADUtils/functions/common";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import GEOContactTable from "../GEOContactTable/Index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { phoneTypes } from "../../CADUtils/constant";
import Location from "../Common/Location";
import ClassNames from "classnames";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import useObjState from "../../CADHook/useObjState";
import ModalConfirm from "../Common/ModalConfirm";
import { useSelector } from 'react-redux';
import DataTable from "react-data-table-component";
import { getShowingDateText, getShowingWithOutTime, tableCustomStyles } from "../../Components/Common/Utility";
import CallTakerServices from "../../CADServices/APIs/callTaker";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import FlagTableModal from "../FlagTableModal";
import FlagModal from "../FlagMaster/FlagModal";
import Tooltip from "../Common/Tooltip";
import CreatableSelect from "react-select/creatable";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import BootstrapTooltip from "react-bootstrap/Tooltip"; // React-Bootstrap Tooltip (Default Export)
import { colourStyles, customStylesWithOutColorNew } from "../Utility/CustomStylesForReact";
import PropTypes from "prop-types";


const GEOModal = (props) => {

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const { openGEOModal, setOpenGEOModal, setSelectedButton = () => { }, unVerifiedSingleLocationsList, refetchUnVerifiedLocationsData = () => { }, isVerifiedPage = false } = props;

  const [premiseDropDown, setPremiseDropDown] = useState([]);
  const [loginPinID, setLoginPinID,] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [flagDropDown, setFlagDropDown] = useState([]);
  const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
  const [locationStatus, setLocationStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(0);
  const [geoLocationID, setGeoLocationID] = useState();
  const [onSelectLocation, setOnSelectLocation] = useState(true);
  const [locationList, setLocationList] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [isChangeFields, setIsChangeFields] = useState(false);
  const [isContactChangeFields, setIsContactChangeFields] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [geoZoneDropDown, setGeoZoneDropDown] = useState([]);
  const [jurisdictionDropDown, setJurisdictionDropDown] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [zoom, setZoom] = useState(17);
  const [showPage, setShowPage] = useState("home")
  const [openAddFlagModal, setOpenAddFlagModal] = useState(false);
  const [flagBudgeList, setFlagBudgeList] = useState([]);
  const [flagName, setFlagName] = useState("");
  const [selectedFlagData, setSelectedFlagData] = useState({});
  const [openFlagTableModal, setOpenFlagTableModal] = useState(false);
  const [isGoogleLocation, setIsGoogleLocation] = useState(true);
  const [flagHistoryList, setFlagHistoryList] = useState([]);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [aptInputValue, setAptInputValue] = useState("");
  const [aptData, setAptData] = useState("")
  const initialValueContact = {
    LastName: "",
    MiddleName: "",
    FirstName: "",
    PhoneType: {},
    PhoneNo: "",
  };
  const [disabled, setDisabled] = useState(false)
  const [contactInformation, setContactInformation] = useState(initialValueContact);

  const [
    errorContactInformation,
    ,
    handleErrorContactInformation,
    clearStateContactInformation,
  ] = useObjState({
    PhoneNo: false,
  });

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
    jurisdiction: "",
    intersection1: "",
    intersection2: "",
    verify: false,
    patrolZone: null,
    emsZone: null,
    fireZone: null,
    otherZone: null,
    currentFlag: null,
    location: "",
    IsVerify: false,
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
  };

  const [geoFormValues, setGEOFormValues] = useState(initialFormValues);
  const [
    errorGeo,
    ,
    handleErrorGeo,
    clearState,
  ] = useObjState({
    location: false,
    patrolZone: false,
    emsZone: false,
    fireZone: false,
    otherZone: false,
    coordinateX: false,
    jurisdiction: false,
    coordinateY: false
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_ADD_API_KEY,
  });

  const mapRef = useRef(null);

  const mapCenter = {
    lng: parseFloat(geoFormValues?.coordinateX) || -98.5795,
    lat: parseFloat(geoFormValues?.coordinateY) || 39.8283,
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  function handleClear() {
    setGeoLocationID();
    clearState();
    setGEOFormValues(initialFormValues);
    setContactInformation(initialValueContact);
    setIsEditMode(false)
    setIsChangeFields(false);
    clearStateContactInformation();
    setAptData({})

  }

  const onCloseLocation = () => {
    setOpenGEOModal(false);
    clearState();
    setSelectedButton((prevSelected) =>
      prevSelected?.includes(4)
        ? prevSelected?.filter((item) => item !== 4)
        : [...prevSelected, 4]
    );
    setGeoLocationID("");
    setContactList([]);
    setIsSelectLocation(false);
    setContactInformation(initialValueContact);
    setIsChangeFields(false);
    setIsEditMode(false)
    clearStateContactInformation();
    setAptData({})
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGEOFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setIsChangeFields(true);
  };

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactInformation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangePhoneNumber = (e) => {
    const { name, value } = e.target;
    let ele = e.target.value.replace(/\D/g, '');
    if (ele.length === 10) {
      const cleaned = ('' + ele).replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        setContactInformation((prevState) => ({
          ...prevState,
          [name]: match[1] + '-' + match[2] + '-' + match[3]
        }));
      }
    } else {
      ele = e.target.value.split('-').join('').replace(/\D/g, '');
      setContactInformation((prevState) => ({
        ...prevState,
        [name]: ele,
      }));
    }
  };

  const handleSelectChange = (selectedOption, { name }) => {
    setGEOFormValues((prevState) => ({
      ...prevState,
      [name]: selectedOption,
    }));
    setIsChangeFields(true);
  };

  const handleSelectPhoneType = (selectedOption, { name }) => {
    setContactInformation((prevState) => ({
      ...prevState,
      [name]: selectedOption,
    }));
    // setIsContactChangeFields(true);
  };

  const flagPayload = {
    AptID: aptData?.aptId,
    FlagFromId: geoLocationID,
    FlagFrom: "GEO",
    AgencyID: loginAgencyID,
    Action: "Get_All_On_CallTaker"
  }

  const getFlagListKey = `/CAD/Flag/GetFlag`;
  const { data: getFlagList, refetch: getFlagListRefetch, isSuccess: isFetchGetFlagList } = useQuery(
    [getFlagListKey, { flagPayload }],
    CallTakerServices.getFlag,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      // enabled: openGEOModal && !!geoLocationID,
      enabled: openGEOModal && !!geoLocationID && !isEmpty(aptData?.aptId),

    }
  );

  const aptSuiteNoPayload = {
    AgencyID: loginAgencyID,
    GeoLocationID: geoLocationID
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
      // retry: 0,
      enabled: openGEOModal && !!geoLocationID
    }
  );


  useEffect(() => {
    if (isFetchAptSuiteNoData && aptSuiteNoData?.data?.data && isSelectLocation && geoLocationID && geoFormValues?.location) {
      const parsedData = JSON.parse(aptSuiteNoData.data.data || "{}");
      setAptSuiteNoDropDown(parsedData?.Table?.length ? dropDownDataModelForAptNo(parsedData.Table, "Description", "Description", "AptID") : []);
    } else {
      setAptInputValue("");
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, geoLocationID, geoFormValues?.location]);

  useEffect(() => {
    if (!isSelectLocation && !geoFormValues?.location) {
      setGEOFormValues((prevState) => ({
        ...prevState,
        ApartmentNo: "",
      }));
      setAptSuiteNoDropDown([]);
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, geoLocationID, geoFormValues?.location]);

  useEffect(() => {
    if (geoFormValues?.location && isSelectLocation && isFetchGetFlagList && getFlagList && (isEmptyObject(aptData) || (aptData && aptData?.aptId))) {
      const data = JSON.parse(getFlagList?.data?.data) || [];
      setFlagBudgeList(data);
    } else {
      setFlagBudgeList([]);
      setSelectedFlagData({})
    }
  }, [isFetchGetFlagList, getFlagList, geoLocationID, aptData]);

  const getPremiseKey = `/CAD/GeoPremiseType/GetData_Premise`;
  const { data: premiseData, isSuccess: isFetchPremiseData } = useQuery(
    [getPremiseKey, {}],
    GeoServices.getPremise,
    {
      refetchOnWindowFocus: false,
    }
  );

  const getFlagKey = `/CAD/GeoFlage/GetData_Flag`;
  const { data: flagData, isSuccess: isFetchFlagData } = useQuery(
    [getFlagKey, {}],
    GeoServices.getFlag,
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
      enabled: openGEOModal && !!loginAgencyID
    }
  );

  const jurisdictionDataKey = `/CAD/MasterJurisdiction/GetDataDropDownJurisdiction/${loginAgencyID}`;
  const { data: getJurisdictionData, isSuccess: isFetchJurisdictionData } = useQuery(
    [jurisdictionDataKey, { AgencyID: loginAgencyID }],
    MasterTableListServices.getDataDropDownJurisdiction,
    {
      refetchOnWindowFocus: false,
      enabled: openGEOModal && !!loginAgencyID
    }
  );

  useEffect(() => {
    if (getJurisdictionData && isFetchJurisdictionData) {
      const data = JSON.parse(getJurisdictionData?.data?.data || []);
      setJurisdictionDropDown(data?.Table);
    } else {
      setJurisdictionDropDown([])
    }
  }, [getJurisdictionData, isFetchJurisdictionData])


  const payload = {
    FlagFromId: geoLocationID,
    AptID: aptData?.aptId,
    AgencyID: loginAgencyID,

  }
  const getFlagHistoryDataKey = `/CAD/Flag/Flags_History`;
  const { data: flagHistoryData, isSuccess: isFetchFlagHistoryData, refetch, isError: isNoData } = useQuery(
    [getFlagHistoryDataKey, {
      payload
    }],
    GeoServices.getFlagHistoryList,
    {
      refetchOnWindowFocus: false,
      enabled: showPage === "flagHistory" && !!loginAgencyID && !!geoLocationID,
      retry: 0,
    }
  );

  // const getContactDetailApartmentNoKey = `/CAD/GeoLocation/GetContactDetailApartmentNo/${aptData?.aptId}`;
  // const { data: contactDetailApartmentNo, isSuccess: isFetchContactDetailApartmentNo } = useQuery(
  //   [getContactDetailApartmentNoKey, { AptID: aptData?.aptId }],
  //   GeoServices.getContactDetailApartmentNo,
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );
  const getContactDetailApartmentNoKey = [
    `/CAD/GeoLocation/GetContactDetailApartmentNo`,
    { AptID: aptData?.aptId, AgencyID: loginAgencyID }, // Ensure payloadReasonCode is here
  ];

  const { data: contactDetailApartmentNo, isSuccess: isFetchContactDetailApartmentNo } = useQuery(
    getContactDetailApartmentNoKey,
    GeoServices.getContactDetailApartmentNo,
    {
      refetchOnWindowFocus: false,
      enabled: !!aptData?.aptId,
      retry: 0,
      onSuccess: (res) => {
        if (res?.data?.Data?.length === 0) {
          setContactList([]);
        } else {
          try {
            const parsedData = JSON.parse(res?.data?.data);
            const data = parsedData?.Table;
            setContactList(data);
          } catch (error) {
            console.error("Error parsing name:", error);
          }
        }
      },
      onError: (error) => {
        setContactList([]);
      }
    }
  );

  useEffect(() => {
    if (isFetchFlagHistoryData && flagHistoryData) {
      const data = JSON.parse(flagHistoryData?.data?.data || []);
      setFlagHistoryList(data?.Table);
    } else {
      setFlagHistoryList([])
    }
  }, [isFetchFlagHistoryData, flagHistoryData])


  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (isFetchGeoZoneData && geoZoneData) {
      const data = JSON.parse(geoZoneData?.data?.data)?.Table || [];
      setGeoZoneDropDown(
        dropDownDataModel(data, "ZoneID", "ZoneCode")
      );
    }
  }, [isFetchGeoZoneData, geoZoneData]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await GeoServices.getLocationData({
          Location: geoFormValues?.location,
          AgencyID: loginAgencyID
        });
        const data = JSON.parse(response?.data?.data)?.Table || [];
        setLocationData(data);

      } catch (error) {
        console.error("Error fetching location data:", error);
        setLocationList([]);
        setLocationData([]);
      }
    };

    if (geoFormValues?.location) {
      fetchLocationData();
    }
  }, [geoFormValues?.location, isSelectLocation]);

  useEffect(() => {
    if (isFetchPremiseData && premiseData) {
      const data = JSON.parse(premiseData?.data?.data)?.Table || [];
      setPremiseDropDown(dropDownDataModel(data, "ID", "PremiseType"));
    }
  }, [isFetchPremiseData, premiseData]);

  useEffect(() => {
    if (isFetchFlagData && flagData) {
      const data = JSON.parse(flagData?.data?.data)?.Table || [];
      setFlagDropDown(dropDownDataModel(data, "ID", "CurrentFlag"));
    }
  }, [isFetchFlagData, flagData]);

  const defaultOption = aptSuiteNoDropDown.find(
    (option) => option?.aptId && !option?.value && !option?.label
  );

  useEffect(() => {
    if (!aptData?.value && !aptData?.label && defaultOption) {
      setAptData({ value: '', label: '', aptId: defaultOption.aptId });
    }
  }, [aptSuiteNoDropDown]);

  useEffect(() => {
    if (isFetchAptSuiteNoData && aptSuiteNoData?.data?.data && isSelectLocation && geoLocationID && geoFormValues?.location) {
      const parsedData = JSON.parse(aptSuiteNoData.data.data || "{}");
      setAptSuiteNoDropDown(parsedData?.Table?.length ? dropDownDataModelForAptNo(parsedData.Table, "Description", "Description", "AptID") : []);
    } else {
      setAptInputValue("");
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, geoLocationID, geoFormValues?.location]);

  useEffect(() => {
    if (!isSelectLocation && !geoFormValues?.location) {
      setGEOFormValues((prevState) => ({
        ...prevState,
        ApartmentNo: "",
      }));
      setAptSuiteNoDropDown([]);
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, geoLocationID, geoFormValues?.location]);

  const validateGeoFormValues = () => {
    let isError = false;
    const keys = Object.keys(errorGeo);
    keys.forEach((field) => {
      if (
        field === "location" &&
        isEmpty(geoFormValues[field])
      ) {
        handleErrorGeo(field, true);
        isError = true;
      }
      //  else if (field === "coordinateX" &&
      //   (geoFormValues?.coordinateX === null || geoFormValues?.coordinateX === undefined || geoFormValues?.coordinateX === "")
      // ) {
      //   handleErrorGeo(field, true);
      //   isError = true;
      // } else if (field === "coordinateY" &&
      //   (geoFormValues?.coordinateY === null || geoFormValues?.coordinateY === undefined || geoFormValues?.coordinateY === "")
      // ) {
      //   handleErrorGeo(field, true);
      //   isError = true;
      // } 
      else if ((field === "fireZone" || field === "emsZone" || field === "otherZone" || field === "patrolZone") && isEmptyObject(geoFormValues[field])) {
        handleErrorGeo(field, true);
        isError = true;
      }
      else if (field === "jurisdiction" && isEmptyObject(geoFormValues[field])) {
        handleErrorGeo(field, true);
        isError = true;
      } else {
        handleErrorGeo(field, false);
      }
    });
    return !isError;
  };

  const createLocationPayload = () => {
    const {
      Street = "",
      stDirection = "",
      stDirection2 = "",
      City = "",
      ZipCode = "",
      PremiseNo = "",
      ApartmentNo = "",
      commonPlaceName = "",
      premiseType = {},
      coordinateX = "",
      coordinateY = "",
      mileMarker = "",
      AltStreet = "",
      intersection1 = "",
      intersection2 = "",
      patrolZone = {},
      emsZone = {},
      fireZone = {},
      otherZone = {},
      IsVerify = "",
      location = "",
      currentFlag = [],
      jurisdiction = ""
    } = geoFormValues || {};

    return {
      ...(geoLocationID && { ID: geoLocationID, ModifiedByUserFK: loginPinID }),
      "Street": Street,
      "DirectionPrefix": stDirection,
      "DirectionSufix": stDirection2,
      "City": City,
      "ZipCode": ZipCode,
      "PremiseNo": PremiseNo,
      "ApartmentNo": ApartmentNo,
      "CommonPlace": commonPlaceName,
      "PremiseType": premiseType?.label || "",
      "Latitude": coordinateY,
      "Longitude": coordinateX,
      "MileMaker": mileMarker,
      "JurisdictionID": jurisdiction?.ID || "",
      "AltStreet": AltStreet,
      "InterDirectionPrefix": intersection1,
      "InterDirectionSufix": intersection2,
      "PatrolZone": patrolZone?.label,
      "EMSZone": emsZone?.label,
      "FireZone": fireZone?.label,
      "OtherZone": otherZone?.label,
      "IsVerified": IsVerify,
      "Location": location,
      "CurrentFlage": currentFlag?.map(item => item?.label).join(", "),
      // "GeoLocationContactsJson": JSON.stringify({ Contacts: contactList || [] }),
      "CreatedByUserFK": geoLocationID ? undefined : loginPinID,
      "AgencyID": loginAgencyID,
    };
  };

  async function handleSave() {
    if (!validateGeoFormValues()) return;
    setDisabled(true);

    const locationPayload = createLocationPayload();
    const response = await GeoServices.insertLocation(locationPayload);

    if (response?.data?.success) {
      if (geoLocationID) {
        toastifySuccess("Data Updated Successfully");
      } else {
        const data = JSON.parse(response?.data?.data);
        setGeoLocationID(data?.Table[0]?.GeoLocationID);
        toastifySuccess("Data Saved Successfully");
      }

      if (isVerifiedPage) {
        onCloseLocation();
      }

      refetchUnVerifiedLocationsData();
      setIsChangeFields(false);
      setDisabled(false);
    }
  }

  const validateContactFormValues = () => {
    const phoneType = contactInformation["PhoneType"]?.label;
    const phoneNumber = contactInformation["PhoneNo"];
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (phoneType === "Cellular") {
      const hasError = !phoneNumber || !phoneRegex.test(phoneNumber);
      handleErrorContactInformation("PhoneNo", hasError);
      return !hasError; // Return false if there is an error
    } else {
      handleErrorContactInformation("PhoneNo", false);
      return true; // Return true if there is no error for non-cellular types
    }
  };

  async function handleContactSave() {
    const contactDetailPayload = {
      "AptID": aptData?.aptId,
      "AgencyID": loginAgencyID,
      "CreatedByUserFK": loginPinID,
      "GeoLocationContactsJson": contactList?.map((item, index) => ({
        PhoneNo: item?.PhoneNo,
        FirstName: item?.FirstName,
        MiddleName: item?.MiddleName,
        LastName: item?.LastName,
        IsActive: 1,
        PhoneType: item?.PhoneType
      }))
    }
    const response = await GeoServices.insertContactDetail(contactDetailPayload);
    if (response?.data?.success) {
      toastifySuccess("Data Saved Successfully");
      setIsContactChangeFields(false);
    }
  }

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setTimeout(() => {
      window.google.maps.event.trigger(map, "resize");
    }, 200);
  };

  useEffect(() => {
    if (openGEOModal && isLoaded) {
      setTimeout(() => {
        setIsMapVisible(true);
        if (mapRef.current) {
          window.google.maps.event.trigger(mapRef.current, "resize");
        }
      }, 300);
    } else {
      setIsMapVisible(false);
    }
  }, [openGEOModal, isLoaded]);

  const handleAddContactInformation = async () => {
    if (!validateContactFormValues()) return;
    const { PhoneNo, FirstName, MiddleName, LastName, PhoneType } = contactInformation;
    if (!(FirstName || MiddleName || LastName || (PhoneNo && PhoneType?.label))) return;
    // if (contactList?.find((i) => i?.PhoneNo === PhoneNo)) {
    //   toastifyError("Phone number already exists.")
    //   return
    // }

    const payload = {
      PhoneNo,
      FirstName,
      MiddleName,
      LastName,
      PhoneType: PhoneType?.label,
      ID: editItemId || Date.now(),
      // IsActive: 1,
      // GeoLocationID: geoLocationID,
    };

    setContactList((prevContactList) => {
      return isEditMode
        ? prevContactList.map((contact) => (contact.ID === editItemId ? payload : contact))
        : [...prevContactList, payload];
    });
    setIsContactChangeFields(true);

    setContactInformation({
      LastName: "",
      MiddleName: "",
      FirstName: "",
      PhoneType: {},
      PhoneNo: "",
    });
    setIsEditMode(false);
    setEditItemId(null);
    setIsChangeFields(true);
    clearStateContactInformation()
  };

  const handleKeyDown = (e) => {
    const charCode = e.keyCode || e.which;
    const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
    const isAlphabet = (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
    const isNumberOrNumpad = (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 111);

    if (!isAlphabet && !controlKeys.includes(charCode)) {
      e.preventDefault();
    }

    if (isNumberOrNumpad) {
      e.preventDefault();
    }
  };

  const handleSpecialKeyDown = (e) => {
    const isAlphanumeric = e.key.length === 1 && e.key.match(/[a-zA-Z0-9]/);
    const isBackspace = e.key === "Backspace";

    if (!isAlphanumeric && !isBackspace) {
      e.preventDefault();
    }
  };

  // const handleSelectAptSuitNo = (selectedOption, { name }) => {
  //   setGEOFormValues((prevState) => ({
  //     ...prevState,
  //     [name]: selectedOption?.value || "",
  //   }));
  //   setIsChangeFields(true);
  // };
  const handleSelectAptSuitNo = (selectedOption, { name }) => {
    if (selectedOption) {
      setGEOFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption?.value || "",
      }));
      setAptData(selectedOption);
    } else if (defaultOption) {
      setGEOFormValues((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      setAptData({ value: '', label: '', aptId: defaultOption.aptId });
    } else {
      setGEOFormValues((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      setAptData({ value: '', label: '', aptId: '' });
    }
    setIsChangeFields(true);
    setAptInputValue("")
  };


  // const handleCreateOption = (inputValue) => {
  //   handleSelectAptSuitNo({ value: inputValue, label: inputValue }, { name: "ApartmentNo" });
  // };

  // const handleCreateOption = (aptInputValue) => {
  //   if (/^[a-zA-Z0-9]{1,4}$/.test(aptInputValue)) {
  //     const newOption = { value: aptInputValue, label: aptInputValue };
  //     setAptSuiteNoDropDown((prev) => [...prev, newOption]);
  //     handleSelectAptSuitNo(newOption, { name: "ApartmentNo" });
  //     setAptInputValue("");
  //   }
  // };

  const handleCreateOption = (aptInputValue) => {
    if (/^[a-zA-Z0-9]{1,4}$/.test(aptInputValue)) {
      const newOption = { value: aptInputValue, label: aptInputValue, aptId: "" };
      setAptSuiteNoDropDown((prev) => [...prev, newOption]);
      handleSelectAptSuitNo(newOption, { name: "ApartmentNo" });
      setAptInputValue("");
    }
  };

  const handleAptInputChange = (value, { action }) => {
    if (action === "input-change") {
      if (/^[a-zA-Z0-9]{0,4}$/.test(value)) {
        setAptInputValue(value);
      }
    }
  };

  function handleConfirm() {
    setShowConfirmModal(false);
    if (confirmAction === "close") {
      onCloseLocation();
    } else if (confirmAction === "cancel") {
      onCloseLocation();
    } else if (confirmAction === "clear") {
      handleClear();
    }
  }

  const locations = [
    {
      lng: parseFloat(geoFormValues?.coordinateX) || -98.5795,
      lat: parseFloat(geoFormValues?.coordinateY) || 39.8283,
      status: "open",
      name: geoFormValues?.location,
    },
  ];

  const getColorByStatus = (status) => {
    switch (status) {
      case "open":
        return "green";
      case "closed":
        return "red";
      case "pending":
        return "yellow";
      default:
        return "blue";
    }
  };

  const customStylesWithFixedHeight = {
    ...customStylesWithOutColorNew,
    menu: (provided) => ({
      ...provided,
      maxHeight: "100px",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "100px",
    }),
  };

  const flagHistoryColumn = [
    {
      name: "Flag Name",
      selector: (row) => (row.FlagNameCode ? row.FlagNameCode : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.FlagNameCode, rowB.FlagNameCode),
      cell: (row) => (
        <Tooltip text={row?.FlagNameCode || ''} maxLength={20} />
      ),
      width: "150px",
    },
    {
      name: "Start Date",
      selector: (row) => (row.FlagDateFrom ? getShowingWithOutTime(row.FlagDateFrom) : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.FlagDateFrom, rowB.FlagDateFrom),
      width: "160px",
    },
    {
      name: "Start Flag Details",
      selector: (row) => (row.StartNote ? row.StartNote : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.StartNote, rowB.StartNote),
      cell: (row) => (
        <Tooltip text={row?.StartNote || ''} maxLength={45} />
      ),
      width: "380px",
    },
    {
      name: "End Date",
      selector: (row) => (row.FlagDateTo ? getShowingDateText(row.FlagDateTo) : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.FlagDateTo, rowB.FlagDateTo),
      width: "160px",
    },
    {
      name: "End Flag Details",
      selector: (row) => (row.EndNote ? row.EndNote : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.EndNote, rowB.EndNote),
      cell: (row) => (
        <Tooltip text={row?.EndNote || ''} maxLength={45} />
      ),
      width: "380px",
    },

  ];

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (unVerifiedSingleLocationsList?.ID && isFetchGeoZoneData) {
        try {

          setGeoLocationID(unVerifiedSingleLocationsList?.ID);
          setIsSelectLocation(true)
          const response1 = await GeoServices.getLocationDataByID({
            GeoLocationID: unVerifiedSingleLocationsList?.ID,
            AgencyID: loginAgencyID,
          });
          const data1 = JSON.parse(response1?.data?.data)?.Table || [];
          const data = data1[0]

          if (mounted) {

            setGEOFormValues({
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
              jurisdiction: jurisdictionDropDown?.find(
                (item) => item?.ID === data?.ID1) || {},
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
              location: data?.Location,
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
              IsVerify: data?.IsVerified === 1 ? true : false,
            });
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [unVerifiedSingleLocationsList, openGEOModal, geoZoneData, isFetchGeoZoneData]);

  return (
    <>

      {openGEOModal ? (
        <dialog
          className="modal fade modal-cad"
          style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
          id="GEOModal"
          tabIndex="-1"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content modal-content-cad" style={{
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}>
              <div className="modal-body">
                {/* Modal Header */}
                <div className="row">
                  <div className="col-12">
                    <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                      <p
                        className="p-0 m-0 font-weight-medium"
                        style={{
                          fontSize: 18,
                          fontWeight: 500,
                          letterSpacing: 0.5,
                        }}
                      >
                        GEO
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-1">
                  <div className="col-12 name-tab m-0">
                    <ul className='nav nav-tabs mx-1'>
                      <span
                        className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                        style={{ color: showPage === 'home' ? 'Red' : '#000' }}
                        aria-current="page"
                        onClick={() => { setShowPage('home') }}

                      >
                        <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
                      </span>
                      <span
                        className={`nav-item ${showPage === 'contactInfo' ? 'active' : ''} ${!geoLocationID ? 'disabled' : ''}`}
                        style={{
                          color: showPage === 'contactInfo' && (geoLocationID && aptData?.aptId) ? 'Red' : '#000',
                          cursor: geoLocationID ? 'pointer' : 'not-allowed',
                        }}
                        aria-current="page"
                        onClick={() => {
                          if (geoLocationID && aptData?.aptId) {
                            setShowPage('contactInfo');
                          }
                        }}
                      >
                        Contact Info
                      </span>
                      <span
                        className={`nav-item border-0 ${showPage === 'flagHistory' ? 'active' : ''} ${!geoLocationID ? 'disabled' : ''}`}
                        style={{
                          color: showPage === 'flagHistory' && (geoLocationID && aptData?.aptId) ? 'Red' : '#000',
                          cursor: geoLocationID ? 'pointer' : 'not-allowed',
                        }}
                        aria-current="page"
                        onClick={() => {
                          if (geoLocationID && aptData?.aptId) {
                            setShowPage('flagHistory');
                          }
                        }}
                      >
                        Flag History
                      </span>
                    </ul>
                  </div>
                </div>
                {showPage === 'home' &&
                  <>
                    <div className="m-1">
                      <fieldset style={{ border: "1px solid gray" }}>
                        <div className="d-flex bb">
                          <div
                            className="col-9"
                            style={{ display: "grid", gap: "5px" }}
                          >
                            <div className="tab-form-container">
                              {/* Line 1 */}
                              <div className="tab-form-row">
                                <div className="col-9 d-flex align-items-center justify-content-end">
                                  <label className="tab-form-label pr-2" style={{ width: "17.6%", textAlign: "end" }}>
                                    Location
                                    {errorGeo.location && !geoFormValues.location && (
                                      <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                        {"Select Location"}
                                      </p>
                                    )}
                                  </label>
                                  <div className="w-100 d-flex inner-input-fullw tab-form-row-gap ">
                                    <div style={{ flexGrow: 1 }}>
                                      <Location
                                        {...{
                                          value: geoFormValues,
                                          setValue: setGEOFormValues,
                                          locationStatus,
                                          setLocationStatus,
                                          updateStatus,
                                          setOnSelectLocation,
                                          locationList,
                                          setContactList: setContactList,
                                          setGeoLocationID,
                                          flagDropDown,
                                          premiseDropDown,
                                          jurisdictionDropDown,
                                          setZoom,
                                          setIsSelectLocation,
                                          setIsChangeFields,
                                          geoZoneDropDown,
                                          locationData,
                                          setIsEditMode,
                                          setIsGoogleLocation
                                        }}
                                        col="location"
                                        isGEO
                                        locationID="NameLocationID"
                                        check={true}
                                        // verify={geoFormValues.IsVerify}
                                        page="Name"
                                      />
                                    </div>
                                    <div className="d-flex align-items-center" style={{ marginLeft: 'auto', gap: '8px' }}>
                                      {
                                        geoFormValues.location && (
                                          geoFormValues?.IsVerify ? (
                                            <span className="badge text-white" style={{ backgroundColor: "#008000", padding: "9px" }}>Verified</span>
                                          ) : (
                                            <OverlayTrigger
                                              placement="bottom"
                                              overlay={<BootstrapTooltip id="tooltip" style={{ zIndex: 9999 }}>Please verify the unverified location by entering the coordinates and zones.</BootstrapTooltip>}
                                            >
                                              <span className="badge text-white p-2" style={{ textDecoration: "underline", backgroundColor: "#ff0000", cursor: "pointer" }}>
                                                Unverified
                                              </span>
                                            </OverlayTrigger>
                                          )
                                        )
                                      }
                                    </div>

                                  </div>
                                </div>
                                <div className="col-3 d-flex align-self-center">
                                  <div className="col-4 d-flex align-self-center justify-content-end">
                                    <label className="tab-form-label">Apt/Suite #</label>
                                  </div>
                                  <div className="w-100 d-flex align-self-center justify-content-end">
                                    {/* <input
                                      type="text"
                                      className="form-control py-1 new-input w-100"
                                      name="ApartmentNo"
                                      maxLength={4}
                                      value={geoFormValues.ApartmentNo}
                                      onChange={handleInputChange}
                                      onKeyDown={handleNumberNoSpaceKeyDown}
                                    /> */}
                                    {/* <CreatableSelect
                                      isClearable
                                      options={aptSuiteNoDropDown} // These are just predefined options for reference
                                      placeholder="Select..."
                                      name="ApartmentNo"
                                      value={
                                        geoFormValues.ApartmentNo
                                          ? { value: geoFormValues.ApartmentNo, label: geoFormValues.ApartmentNo }
                                          : null
                                      }
                                      onChange={handleSelectAptSuitNo}
                                      onCreateOption={handleCreateOption} // Handle custom input directly
                                      inputValue={aptInputValue} // Real-time controlled input
                                      onInputChange={handleAptInputChange}
                                      styles={{
                                        control: (provided) => ({
                                          ...provided,
                                          width: "100%",
                                        }),
                                      }}
                                      className="w-100"
                                      menuPlacement="top"
                                    /> */}
                                    <CreatableSelect
                                      isClearable
                                      options={aptSuiteNoDropDown.filter(
                                        (option) => option.value && option.label
                                      )}
                                      placeholder="Select..."
                                      name="ApartmentNo"
                                      value={
                                        geoFormValues.ApartmentNo
                                          ? { value: geoFormValues.ApartmentNo, label: geoFormValues.ApartmentNo }
                                          : defaultOption || null
                                      }
                                      onChange={
                                        handleSelectAptSuitNo
                                      }
                                      onCreateOption={handleCreateOption} // Restrict to 4-digit numbers
                                      inputValue={aptInputValue} // Real-time controlled input
                                      onInputChange={handleAptInputChange} // Restricts input dynamically
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
                              </div>
                              {/* Line 2 */}
                              <div className="tab-form-row">
                                <div className="col-3 d-flex align-items-center justify-content-end">
                                  <label className="tab-form-label pr-2 d-flex justify-content-end text-nowrap" style={{ width: "85%" }}>
                                    Premise #
                                  </label>
                                  <div className="w-100 inner-input-fullw">
                                    <input
                                      type="number"
                                      className="form-control py-1 new-input"
                                      name="PremiseNo"
                                      disabled={geoFormValues?.isPremiseNo}
                                      value={geoFormValues.PremiseNo}
                                      onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,4}$/.test(value)) {
                                          handleInputChange(e);
                                        }
                                      }}
                                      min="0"
                                    />
                                  </div>
                                </div>
                                <div className="col-2 d-flex align-self-center">
                                  <label className="tab-form-label col-4 d-flex align-self-center justify-content-end ml-4">
                                    St.Direction
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="stDirection"
                                    maxLength="4"
                                    disabled={geoFormValues?.isStDirection}
                                    onKeyDown={handleKeyDown}
                                    value={geoFormValues.stDirection}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <div className="col-5 d-flex align-self-center">
                                  <div className="col-2 d-flex align-self-center justify-content-end">
                                    <label className="tab-form-label">St.Name</label>
                                  </div>
                                  <div className="col-10 d-flex align-self-center justify-content-end">
                                    <input
                                      type="text"
                                      className="form-control py-1 new-input"
                                      name="Street"
                                      maxLength={40}
                                      onKeyDown={handleNumberTextKeyDown}
                                      value={geoFormValues.Street}
                                      disabled={geoFormValues?.isStreet}
                                      onChange={handleInputChange}
                                    />
                                  </div>
                                </div>
                                <div className="col-2 d-flex align-self-center">
                                  <label className="tab-form-label col-4 d-flex align-self-center justify-content-end ml-4">
                                    St.Direction
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="stDirection2"
                                    maxLength="4"
                                    onKeyDown={handleKeyDown}
                                    value={geoFormValues.stDirection2}
                                    disabled={geoFormValues?.isStDirection2}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>

                              {/* Line 3 */}
                              <div className="tab-form-row">
                                <div className="col-5 d-flex align-items-center justify-content-end">
                                  <label className="tab-form-label text-nowrap pr-2">
                                    Intersection St/St
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="intersection1"
                                    value={geoFormValues.intersection1}
                                    disabled={geoFormValues?.isIntersection1}
                                    onKeyDown={handleNumberTextKeyDown}
                                    onChange={handleInputChange}
                                  />
                                  {"/"}
                                  <input
                                    type="text"
                                    className="form-control ml-1 py-1 new-input mr-2"
                                    name="intersection2"
                                    value={geoFormValues.intersection2}
                                    onKeyDown={handleNumberTextKeyDown}
                                    disabled={geoFormValues?.isIntersection2}
                                    onChange={handleInputChange}
                                  />
                                </div>
                                <div className="col-7 d-flex align-items-center justify-content-end">
                                  <label className="tab-form-label text-nowrap mr-1">Common Place Name</label>
                                  <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="commonPlaceName"
                                    value={geoFormValues.commonPlaceName}
                                    disabled={geoFormValues?.isCommonPlaceName}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>

                              {/* Line 4 */}
                              <div className="tab-form-row">
                                <div className="col-6 d-flex align-items-center justify-content-end">
                                  <label className="tab-form-label pr-2 d-flex justify-content-end" style={{ width: "28.5%" }}>
                                    Alt.St.Name
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control py-1 new-input ml-1"
                                    name="AltStreet"
                                    onKeyDown={handleSpecialKeyDown}
                                    value={geoFormValues.AltStreet}
                                    disabled={geoFormValues?.isAltStreet}
                                    onChange={handleInputChange}
                                  />
                                </div>

                                <div className="col-4 d-flex align-items-center justify-content-end mr-2">
                                  <label className="tab-form-label mr-2">City</label>
                                  <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="City"
                                    value={geoFormValues.City}
                                    disabled={geoFormValues?.isCity}
                                    onKeyDown={handleKeyDown}
                                    onChange={handleInputChange}
                                  />
                                </div>

                                <div className="col-2 d-flex align-items-center justify-content-end" style={{ paddingRight: "15px" }}>
                                  <label className="tab-form-label mr-2">Zip</label>
                                  <input
                                    type="number"
                                    className="form-control py-1 new-input"
                                    name="ZipCode"
                                    value={geoFormValues.ZipCode}
                                    disabled={geoFormValues?.isZipCode}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>

                              {/* Line 5 */}
                              <div className="tab-form-row">
                                <div className="col-4 d-flex align-items-center justify-content-end mr-2">
                                  <label className="tab-form-label d-flex justify-content-end pr-2 text-nowrap" style={{ width: "50%" }}>
                                    Premise Type
                                  </label>
                                  <Select
                                    name="premiseType"
                                    styles={customStylesWithOutColorNew}
                                    isClearable
                                    options={premiseDropDown}
                                    placeholder="Select..."
                                    maxMenuHeight={130}
                                    className="w-100 ml-1"
                                    onChange={handleSelectChange}
                                    value={geoFormValues.premiseType}
                                    onInputChange={(inputValue, actionMeta) => {
                                      if (inputValue.length > 12) {
                                        return inputValue.slice(0, 12);
                                      }
                                      return inputValue;
                                    }}
                                  />
                                </div>

                                <div className="col-5 d-flex align-self-center justify-content-end">
                                  <div className="d-flex align-self-center align-items-center justify-content-end">
                                    <div className="d-flex align-self-center  justify-content-end">
                                      <label className="tab-form-label mr-1">Coordinate:X{errorGeo.coordinateX && !geoFormValues?.coordinateX && (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Coordinate X"}</p>
                                      )}</label>
                                    </div>
                                    <input
                                      type="number"
                                      className="form-control py-1 new-input"
                                      name="coordinateX"
                                      value={geoFormValues.coordinateX}
                                      disabled={geoFormValues?.isCoordinateX}
                                      onKeyDown={handleNumDotNoSpaceKeyDown}

                                      onChange={(e) => {
                                        // const value = e.target.value;
                                        // if (/^\d{0,10}$/.test(value)) {
                                        handleInputChange(e);
                                        // }
                                      }}
                                    />
                                  </div>
                                  <div className="d-flex align-self-center align-items-center justify-content-end">
                                    <label className="tab-form-label mx-2">Y{errorGeo.coordinateY && !geoFormValues?.coordinateY && (
                                      <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter Coordinate Y"}</p>
                                    )}</label>
                                    <input
                                      type="number"
                                      className="form-control py-1 new-input"
                                      name="coordinateY"
                                      value={geoFormValues.coordinateY}
                                      disabled={geoFormValues?.isCoordinateY}
                                      onKeyDown={handleNumDotNoSpaceKeyDown}
                                      onChange={(e) => {
                                        // const value = e.target.value;
                                        // if (/^\d{0,10}$/.test(value)) {
                                        handleInputChange(e);
                                        // }
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-1 d-flex align-items-center justify-content-end">
                                  <label className="tab-form-label">Mile Marker</label>
                                </div>
                                <div className="col-2 d-flex align-items-center" style={{ paddingRight: "15px" }}>
                                  <input
                                    type="text"
                                    className="form-control py-1 new-input"
                                    name="mileMarker"
                                    value={geoFormValues.mileMarker}
                                    disabled={geoFormValues?.isMileMarker}
                                    onChange={handleInputChange}
                                    onKeyDown={handleNumberNoSpaceKeyDown}
                                    maxLength={4}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-3">
                            {isMapVisible && isLoaded ? (
                              <GoogleMap
                                mapContainerStyle={{
                                  height: "230px",
                                  width: "100%",
                                }}
                                zoom={zoom} // Use the state-managed zoom level
                                center={mapCenter} // Update center as needed
                                //     onLoad={(map) => (mapRef.current = map)} // Set the map ref when the map is loaded
                                onLoad={handleMapLoad}
                                onZoomChanged={() => {
                                  // Keep track of the current zoom level in the state
                                  if (mapRef.current) {
                                    setZoom(mapRef.current.getZoom());
                                  }
                                }}
                              >
                                {locations?.map((location, index) => {
                                  return (
                                    <Marker
                                      key={index}
                                      position={{
                                        lat: location.lat,
                                        lng: location.lng,
                                      }}
                                      icon={{
                                        path: window.google.maps.SymbolPath.CIRCLE,
                                        scale: 10,
                                        fillColor: getColorByStatus(location.status),
                                        fillOpacity: 1,
                                        strokeWeight: 1,
                                      }}
                                      title={location.name}
                                      onClick={() =>
                                        console.warn(`Location: ${location.name}`)
                                      }
                                    />
                                  );
                                })}
                              </GoogleMap>
                            ) : (
                              <p>Loading Map...</p>
                            )}
                          </div>
                        </div>
                        {/* Line 6 */}
                        <div className="tab-form-row py-2">
                          <div className="col-1 d-flex align-items-center justify-content-end">
                            <label className="tab-form-label text-nowrap" style={{ textAlign: "end" }}>
                              Jurisdiction
                              {errorGeo.jurisdiction && isEmptyObject(geoFormValues.jurisdiction) && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>
                                  {"Select Jurisdiction"}
                                </p>
                              )}
                            </label>
                          </div>
                          <div className="tab-form-row-gap d-flex ml-2" style={{ width: "18.3%" }}>
                            <Select
                              name="jurisdiction"
                              styles={colourStyles}
                              isClearable
                              options={jurisdictionDropDown}
                              placeholder="Select..."
                              className="w-100 ml-1"
                              value={geoFormValues.jurisdiction}
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
                        <div className="tab-form-row py-2">
                          <div className="col-1 d-flex align-items-center justify-content-end">
                            <label className="tab-form-label text-nowrap" style={{ textAlign: "end" }}>
                              Law Zone
                              {errorGeo.patrolZone && isEmptyObject(geoFormValues.patrolZone) && (
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
                              value={geoFormValues.patrolZone}
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
                                {errorGeo.fireZone && isEmptyObject(geoFormValues.fireZone) && (
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
                              value={geoFormValues.fireZone}
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
                                {errorGeo.emsZone && isEmptyObject(geoFormValues.emsZone) && (
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
                              value={geoFormValues.emsZone}
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
                                {errorGeo.otherZone && isEmptyObject(geoFormValues.otherZone) && (
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
                              value={geoFormValues.otherZone}
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
                        <div className="tab-form-row py-2">
                          {/* <div className="col-1 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label text-nowrap" style={{ textAlign: "end", marginRight: "4px" }}>Flags</label>
                          </div> */}
                          <div className="col-1 d-flex align-items-center justify-content-end ml-1">
                            <label className="tab-form-label text-nowrap">
                              Flags
                            </label>
                          </div>
                          <div className="col-11 d-flex tab-form-row-gap" style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}>
                            {flagBudgeList?.Table?.map((item, index) => {
                              const buttons = [];

                              if (item?.Is24HourFlag === 1) {
                                buttons.push(
                                  <button
                                    key={`24Hour-${index}`}
                                    type="button"
                                    style={{
                                      backgroundColor: "#FF0000",
                                      color: "#ffff",
                                      border: "none",
                                      whiteSpace: "nowrap",
                                    }}
                                    data-toggle="modal"
                                    data-target="#FlagTableModal"
                                    onClick={() => { setOpenFlagTableModal(true); setFlagName("Is24HourFlag"); }}
                                    className="btn btn-sm btn-CADprimary1"
                                  >
                                    24 Hr
                                  </button>
                                );
                              }
                              if (item?.PremiseFlag === 1) {
                                buttons.push(
                                  <button
                                    key={`Premise-${index}`}
                                    type="button"
                                    style={{
                                      backgroundColor: "#28a745",
                                      color: "#ffff",
                                      border: "none",
                                      whiteSpace: "nowrap",
                                    }}
                                    data-toggle="modal"
                                    data-target="#FlagTableModal"
                                    onClick={() => { setOpenFlagTableModal(true); setFlagName("PremiseFlag") }}
                                    className="btn btn-sm btn-CADprimary1"
                                  >
                                    Premise History
                                  </button>
                                );
                              }
                              return <React.Fragment key={`item-${index}`}>{buttons}</React.Fragment>;
                            })}
                            {flagBudgeList?.Table1?.map(
                              (item, index) => {
                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    style={{
                                      backgroundColor: item?.PriorityColor || "#e6e6e6",
                                      color: "#ffff",
                                      border: "none",
                                      whiteSpace: "nowrap",
                                    }}
                                    data-toggle="modal"
                                    data-target="#addFlagModal"
                                    onClick={() => { setOpenAddFlagModal(true); setSelectedFlagData(item); }}
                                    className="btn btn-sm btn-CADprimary1"
                                  >
                                    {item?.FlagType}
                                  </button>
                                );
                              }
                            )}
                            <div
                              className="d-flex align-items-center"
                              style={{
                                // marginLeft: "8px", // Add spacing to separate from other elements
                                whiteSpace: "nowrap"
                              }}
                            >
                              <span
                                data-toggle={isSelectLocation ? "modal" : undefined}
                                data-target={isSelectLocation ? "#addFlagModal" : undefined}
                                onClick={
                                  isSelectLocation
                                    ? () => {
                                      setOpenAddFlagModal(true);
                                      setSelectedFlagData({});
                                    }
                                    : undefined
                                }
                                className={`pt-1 ${!isSelectLocation ? "disabled" : ""}`}
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "700",
                                  cursor: isSelectLocation ? "pointer" : "not-allowed",
                                  color: isSelectLocation ? "blue" : "gray",
                                }}
                              >
                                Add Flag
                              </span>
                            </div>
                            {/* <div className='col-12'>
                              <div className='row'>
                                <div
                                  className="alert-name col-lg-11"
                                  style={{ alignContent: "center", overflowY: "auto" }}
                                >
                                  <span
                                    data-toggle={isSelectLocation ? "modal" : undefined}
                                    data-target={isSelectLocation ? "#addFlagModal" : undefined}
                                    onClick={isSelectLocation ? () => { setOpenAddFlagModal(true); setSelectedFlagData({}); } : undefined}
                                    className={` pt-1 ${!isSelectLocation ? "disabled" : ""}`}
                                    style={{
                                      fontSize: "13px",
                                      fontWeight: "700",
                                      cursor: isSelectLocation ? "pointer" : "not-allowed",
                                      color: isSelectLocation ? "blue" : "gray",
                                    }}
                                  >
                                    Add Flag
                                  </span>
                                </div>
                              </div>
                            </div> */}
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
                              disabled={!isChangeFields || disabled}
                              onClick={() => handleSave()}
                            >
                              {geoFormValues?.isUpdate ? "Update" : "Save"}
                            </button>
                            <button
                              type="button"
                              className="cancel-button"
                              onClick={() => {
                                if (isChangeFields) {
                                  setConfirmAction("cancel");
                                  setShowConfirmModal(true);
                                } else {
                                  onCloseLocation();
                                }
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="cancel-button"
                              onClick={() => {
                                if (isChangeFields) {
                                  setConfirmAction("clear");
                                  setShowConfirmModal(true);
                                } else {
                                  handleClear();
                                }
                              }}
                            >
                              Clear
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
                              }}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>}
                {showPage === 'contactInfo' &&
                  <>
                    <div className="m-1">
                      <fieldset style={{ border: "1px solid gray" }}>
                        {/* <fieldset className="tab-form-container mt-1">
                          <legend className="cad-legend">Contact Info</legend>
                        </fieldset> */}
                        <div className="tab-form-row">
                          <div className="col-1 d-flex align-items-center justify-content-end ml-1">
                            <label className="tab-form-label text-nowrap">
                              Last Name
                            </label>
                          </div>
                          <div className="col-11 tab-form-row-gap">
                            <input
                              type="text"
                              className={ClassNames(
                                "form-control py-1 new-input"
                              )}
                              name="LastName"
                              required
                              value={contactInformation.LastName}
                              onKeyDown={handleKeyDown}
                              onChange={handleContactInputChange}
                            />
                            <div className="d-flex align-self-center justify-content-end">
                              <label className="tab-form-label text-nowrap">
                                Middle Name
                              </label>
                            </div>
                            <input
                              type="text"
                              className="form-control py-1 new-input"
                              onKeyDown={handleKeyDown}
                              name="MiddleName"
                              value={contactInformation.MiddleName}
                              // disabled={!geoLocationID}
                              onChange={handleContactInputChange}
                            />
                            <div className="d-flex align-self-center justify-content-end">
                              <label className="tab-form-label text-nowrap">
                                First Name
                              </label>
                            </div>
                            <input
                              type="text"
                              className="form-control py-1 new-input"
                              name="FirstName"
                              value={contactInformation.FirstName}
                              // disabled={!geoLocationID}
                              onKeyDown={handleKeyDown}
                              onChange={handleContactInputChange}
                            />
                          </div>
                        </div>
                        <div className="tab-form-row py-1">
                          <div className="d-flex align-items-center justify-content-end">
                            <label className="tab-form-label text-nowrap" style={{ marginLeft: "40px" }}>
                              Phone Type
                            </label>
                          </div>
                          <div className="col-2 tab-form-row-gap d-flex w-100" style={{ marginLeft: "2px" }}>
                            <Select
                              name="PhoneType"
                              styles={customStylesWithFixedHeight}
                              options={phoneTypes}
                              placeholder="Select..."
                              className="w-100 ml-1"
                              value={contactInformation.PhoneType}
                              onChange={handleSelectPhoneType}
                              onKeyDown={handleKeyDown}
                              onInputChange={(inputValue, actionMeta) => {
                                if (inputValue.length > 12) {
                                  return inputValue.slice(0, 12);
                                }
                                return inputValue;
                              }}
                            />
                          </div>
                          <div className="col-4 d-flex align-self-center" style={{ marginLeft: "38px" }}>
                            <div className="col-4 d-flex align-self-center justify-content-end">
                              <label for="" className="tab-form-label">
                                Phone Number{errorContactInformation.PhoneNo && (
                                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Enter valid phone no."}</p>
                                )}
                              </label>
                            </div>
                            <input
                              type="text"
                              className="form-control py-1 new-input"
                              name="PhoneNo"
                              autoComplete='off'
                              required
                              maxLength={10}
                              value={contactInformation.PhoneNo}
                              disabled={
                                !contactInformation.PhoneType ||
                                Object.keys(contactInformation.PhoneType).length === 0
                              }
                              onChange={handleChangePhoneNumber}
                            />
                          </div>
                          <div className="d-flex mr-2 justify-content-end align-items-center w-100 ">
                            <button
                              type="button"
                              className="save-button d-flex align-items-center"
                              onClick={handleAddContactInformation}
                            >
                              <FontAwesomeIcon
                                icon={isEditMode ? faEdit : faPlus}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  marginRight: "5px",
                                }}
                              />
                              {isEditMode
                                ? "Update Contact Information"
                                : "Add Contact Information"}
                            </button>
                          </div>
                        </div>
                        <GEOContactTable
                          contactList={contactList}
                          setContactInformation={setContactInformation}
                          setEditItemId={setEditItemId}
                          setContactList={setContactList}
                          setIsEditMode={setIsEditMode}
                          setIsContactChangeFields={setIsContactChangeFields}
                          setIsChangeFields={setIsChangeFields}
                          isGoogleLocation
                          contactInformation={contactInformation}
                        />
                      </fieldset>
                    </div>
                    <div className="row">
                      <div className="col-12 p-0">
                        <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                          <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                            <button
                              type="button"
                              className="save-button ml-2"
                              disabled={!isContactChangeFields}
                              onClick={() => handleContactSave()}
                            >
                              {"Save"}
                            </button>
                            {/* <button
                              type="button"
                              className="cancel-button"
                              onClick={() => {
                                if (isChangeFields) {
                                  setConfirmAction("cancel");
                                  setShowConfirmModal(true);
                                } else {
                                  onCloseLocation();
                                }
                              }}
                            >
                              Cancel
                            </button> */}
                            {/* <button
                              type="button"
                              className="cancel-button"
                              onClick={() => {
                                if (isChangeFields) {
                                  setConfirmAction("clear");
                                  setShowConfirmModal(true);
                                } else {
                                  handleClear();
                                }
                              }}
                            >
                              Clear
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
                              }}
                            >
                              Close
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>}
                {showPage === 'flagHistory' &&
                  <div className="m-1">
                    <fieldset style={{ border: "1px solid gray" }}>
                      <div className="table-responsive CAD-table mt-2" style={{ position: "sticky" }}>
                        <DataTable
                          dense
                          columns={flagHistoryColumn}
                          data={flagHistoryList}
                          customStyles={tableCustomStyles}
                          pagination
                          responsive
                          striped
                          highlightOnHover
                          fixedHeader
                          selectableRowsHighlight
                          fixedHeaderScrollHeight="190px"
                          persistTableHead={true}
                        />
                      </div>
                    </fieldset>
                  </div>
                }
              </div>
            </div>
          </div>
        </dialog>
      ) : null}

      {openFlagTableModal && <FlagTableModal {...{ openFlagTableModal, setOpenFlagTableModal, geoLocationID, flagName, aptData }} />}
      {openAddFlagModal && <FlagModal {...{ openAddFlagModal, setOpenAddFlagModal, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID, getFlagListRefetch, selectedFlagData, setSelectedFlagData, aptData, setAptData, refetchAptSuiteNoData }} />}
      <ModalConfirm showModal={showConfirmModal} setShowModal={setShowConfirmModal} confirmAction={confirmAction === "close" ? "close" : confirmAction === "clear" ? "clear" : "cancel"} handleConfirm={handleConfirm} />
    </>
  );
};

export default memo(GEOModal);

// PropTypes definition
GEOModal.propTypes = {
  openGEOModal: PropTypes.bool.isRequired,
  setOpenGEOModal: PropTypes.func.isRequired,
  setSelectedButton: PropTypes.func,
  unVerifiedSingleLocationsList: PropTypes.array,
  refetchUnVerifiedLocationsData: PropTypes.func,
  isVerifiedPage: PropTypes.bool
};

// Default props
GEOModal.defaultProps = {
  setSelectedButton: () => { },
  unVerifiedSingleLocationsList: [],
  refetchUnVerifiedLocationsData: () => { },
  isVerifiedPage: false
};
