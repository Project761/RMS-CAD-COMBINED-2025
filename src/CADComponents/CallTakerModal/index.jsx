import React, { memo, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import PropTypes from 'prop-types';
import CallTakerServices from "../../CADServices/APIs/callTaker";
import {
  dropDownDataModel,
  dropDownDataModelForAptNo,
  handleNumberTextKeyDown,
  handleTextKeyDown,
  isEmpty,
  isEmptyObject,
} from "../../CADUtils/functions/common";
import GeoServices from "../../CADServices/APIs/geo";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import Location from "../Common/Location";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import NameSearchModal from "../NameSearch/NameSearchModal";
import VehicleSearchModal from "../VehicleSearch/VehicleSearchModal";
import ContactInfoModal from "../ContactInfoModal";
import LocationInformationModal from "../LocationInformationModal";
import useObjState from "../../CADHook/useObjState";
import ModalConfirm from "../Common/ModalConfirm";
import { IncidentContext } from "../../CADContext/Incident";
import { useQueueCall } from "../../CADContext/QueueCall";
import { get_PlateType_Drp_Data, get_State_Drp_Data } from "../../redux/actions/DropDownsData";
import CloseCallModal from "../CloseCallModal";
import FlagTableModal from "../FlagTableModal";
import FlagModal from "../FlagMaster/FlagModal";
import MonitorServices from "../../CADServices/APIs/monitor";
import DuplicateCallModal from "../DuplicateCallModal";
import { getData_DropDown_Priority } from "../../CADRedux/actions/DropDownsData";
import NCICModal from "../NCICModal";
import { toastifyError } from "../../Components/Common/AlertMsg";
import { fetchPostData } from "../../Components/hooks/Api";
import img from '../../img/file.jpg';
import ScreenPermissionServices from "../../CADServices/APIs/screenPermission";

const CallTakerModal = (props) => {
  const { openCallTakerModal, setCallTakerModal, isIncidentDispatch, setIsIncidentDispatch, setIncNo, incNo, refetchQueueCall, isQueueCall
  } = props;
  const mapRef = useRef(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_ADD_API_KEY,
  });

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const { incidentRefetch, resourceRefetch, unassignedIncidentListRefetch, assignedIncidentListRefetch } = useContext(IncidentContext);
  const { refreshQueueCallData, refreshQueueCallCount } = useQueueCall();
  //#region //! useState
  const stateList = useSelector((state) => state.DropDown.stateDrpData);
  const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData)
  const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);

  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [loginPinID, setLoginPinID] = useState(1);
  const [isGoogleLocation, setIsGoogleLocation] = useState(true)
  const [receiveSourceDropDown, setReceiveSourceDropDown] = useState([]);
  const [reasonCodeDropDown, setReasonCodeDropDown] = useState([]);
  const [resourceDropDown, setResourceDropDown] = useState([]);
  const [tagYearDropDown, setTagYearDropDown] = useState([]);
  const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
  const [premiseDropDown, setPremiseDropDown] = useState([]);
  const [cfsDropDown, setCFSDropDown] = useState([]);
  const [cfsDescDropDown, setCFSDescDropDown] = useState([]);
  const [flagDropDown, setFlagDropDown] = useState([]);
  const [locationStatus, setLocationStatus] = useState(false);
  const [geoLocationID, setGeoLocationID] = useState();
  const [onSelectLocation, setOnSelectLocation] = useState(true);
  const [geoZoneDropDown, setGeoZoneDropDown] = useState([]);
  const [locationData, setLocationData] = useState();
  const [contactList, setContactList] = useState([]);
  const [openContactInfoModal, setOpenContactInfoModal] = useState(false);
  const [openLocationInformationModal, setOpenLocationInformationModal] = useState(false);
  const [openCloseCallModal, setOpenCloseCallModal] = useState(false);
  const [openDuplicateCallModal, setOpenDuplicateCallModal] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [selectedButton, setSelectedButton] = useState([]);
  const [zoom, setZoom] = useState(17);
  const [isOpenSearchNameModel, setIsOpenSearchNameModel] = useState(false);
  const [isOpenVehicleSearchModel, setIsOpenVehicleSearchModel] = useState(false);
  const [nameData, setNameData] = useState([]);
  const [isChangeFields, setIsChangeFields] = useState(false);
  const [openFlagTableModal, setOpenFlagTableModal] = useState(false);
  const [openAddFlagModal, setOpenAddFlagModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCallAPI, setIsCallAPI] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isCheckGoogleLocation, setIsCheckGoogleLocation] = useState(false)
  const [flagBudgeList, setFlagBudgeList] = useState([]);
  const [flagName, setFlagName] = useState("");
  const [selectedFlagData, setSelectedFlagData] = useState({});
  const [aptInputValue, setAptInputValue] = useState("");
  const [aptData, setAptData] = useState("");
  const [isVerifyReportedLocation, setIsVerifyReportedLocation] = useState(false);
  const [duplicateCallData, setDuplicateCallData] = useState([]);
  const [openNCICModal, setOpenNCICModal] = useState(false);
  const [docData, setDocData] = useState([]);
  const [nameAlertData, setNameAlertData] = useState([]);
  const [vehicleAlertData, setVehicleAlertData] = useState([]);
  const [isNameCallTaker, setIsNameCallTaker] = useState(false);

  // CallTaker Screen Permission States
  const [CADCallTakerDispatch, setCADCallTakerDispatch] = useState(false);
  const [CADCallTakerRoute, setCADCallTakerRoute] = useState(false);
  const [CADCallTakerLocation, setCADCallTakerLocation] = useState(false);
  const [CADCallTakerContact, setCADCallTakerContact] = useState(false);
  const [CADCallTakerCloseCall, setCADCallTakerCloseCall] = useState(false);
  const [CADCallTakerQueueCall, setCADCallTakerQueueCall] = useState(false);
  const [CADCallTakerNCIC, setCADCallTakerNCIC] = useState(false);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setTimeout(() => {
      window.google.maps.event.trigger(map, "resize");
    }, 200);

  };

  const [nameCallTaker, setNameCallTaker, handleNameCallTaker, clearState] =
    useObjState({
      FirstName: "",
      LastName: "",
      NameReasonCodeID: [],
    });

  const [docCallTaker, setDocCallTaker, handleDocCallTaker, clearDocCallTakerState] =
    useObjState({
      DocumentName: "",
      file: "",
    });

  const [
    errorCallTaker,
    ,
    handleErrorCallTaker,
    clearStateCallTaker,
  ] = useObjState({
    location: false,
    ReceiveSourceID: false,
    CallforServiceID: false,
    CFSLPriority: false,
    patrolZone: false,
    emsZone: false,
    fireZone: false,
    otherZone: false,
    Resource1: false,
  });

  const [
    errorNameCallTaker,
    ,
    handleErrorNameCallTaker,
    clearStateNameCallTaker,
  ] = useObjState({
    NameReasonCodeID: false,
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
  const [geoFormValues, setGEOFormValues] = useState(initialFormValues);
  const [isDispatchLoading, setIsDispatchLoading] = useState(false)
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const [cfsImageData, setCfsImageData] = useState(null);

  const incidentInitialValues = {
    location: "",
    ApartmentNo: "",
    ReceiveSourceID: "",
    CallforServiceID: "",
    CFSLDetails: "",
    CFSLPriority: "",
    CFSL: 1,
    CFSF: 0,
    CFSE: 0,
    OTHER: 0,
    Comments: "",
    Resource1: [],
    Resource2: "",
    Resource3: "",
    Resource4: "",
    Resource5: "",
    Resource6: "",
    Resource7: "",
    Resource8: "",
    requirePARTimer: false,
  };
  const [incidentFormValues, setIncidentFormValues] = useState(
    incidentInitialValues
  );

  const [vehicleData, setVehicleData] = useState([]);
  const [
    vehicleCallTaker,
    setVehicleCallTaker,
    handleVehicleCallTaker,
    clearVehicleState,
  ] = useObjState({
    Plate: "",
    StateCode: null,
    PlateTypeCode: null,
    TagYear: null,
  });

  const isVehicleCallTakerData = Object.values(vehicleCallTaker).some(
    (value) => value !== "" && value !== null && value !== undefined
  );

  const getScreenPermissionKey = `/ScreenPermission/GetScreenPermissionByParentName`;
  const { data: getScreenPermissionData, isSuccess: isFetchScreenPermission } = useQuery(
    [getScreenPermissionKey, {
      "PINID": localStoreData?.PINID,
      AgencyID: localStoreData?.AgencyID,
      ScreenCode: "I201"
    },],
    ScreenPermissionServices.getScreenPermissionByParentName,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!localStoreData?.PINID
    }
  );

  useEffect(() => {
    if (getScreenPermissionData && isFetchScreenPermission) {
      const data = JSON.parse(getScreenPermissionData?.data?.data)?.Table;

      // Filter and set CallTaker screen permissions
      if (data && Array.isArray(data)) {
        // CAD-CallTaker-Dispatch (I202)
        const dispatchPermission = data.find(item => item.ScreenCode === "I202 ");
        setCADCallTakerDispatch(dispatchPermission ? dispatchPermission.AddOK === 1 : false);

        // CAD-CallTaker-Route (I203) 
        const routePermission = data.find(item => item.ScreenCode === "I203 ");
        setCADCallTakerRoute(routePermission ? routePermission.AddOK === 1 : false);

        // CAD-CallTaker-Location (I204)
        const locationPermission = data.find(item => item.ScreenCode === "I204 ");
        setCADCallTakerLocation(locationPermission ? locationPermission.AddOK === 1 : false);

        // CAD-CallTaker-Contact (I205)
        const contactPermission = data.find(item => item.ScreenCode === "I205 ");
        setCADCallTakerContact(contactPermission ? contactPermission.AddOK === 1 : false);

        // CAD-CallTaker-CloseCall (I206)
        const closeCallPermission = data.find(item => item.ScreenCode === "I206 ");
        setCADCallTakerCloseCall(closeCallPermission ? closeCallPermission.AddOK === 1 : false);

        // CAD-CallTaker-QueueCall (I207)
        const queueCallPermission = data.find(item => item.ScreenCode === "I207 ");
        setCADCallTakerQueueCall(queueCallPermission ? queueCallPermission.AddOK === 1 : false);

        // CAD-CallTaker-NCIC (I208)
        const ncicPermission = data.find(item => item.ScreenCode === "I208 ");
        setCADCallTakerNCIC(ncicPermission ? ncicPermission.AddOK === 1 : false);
      }
    } else {
      // Reset all permissions to false
      setCADCallTakerDispatch(false);
      setCADCallTakerRoute(false);
      setCADCallTakerLocation(false);
      setCADCallTakerContact(false);
      setCADCallTakerCloseCall(false);
      setCADCallTakerQueueCall(false);
      setCADCallTakerNCIC(false);
    }
  }, [getScreenPermissionData, isFetchScreenPermission])

  const isNameCallTakerData = Object.values(nameCallTaker).some(
    (value) =>
      value !== "" &&
      value !== null &&
      value !== undefined &&
      !(Array.isArray(value) && value.length === 0)
  );

  const locations = [
    {
      lng: parseFloat(geoFormValues?.coordinateX) || -98.5795,
      lat: parseFloat(geoFormValues?.coordinateY) || 39.8283,
      status: "open",
      name: geoFormValues?.location,
    },
  ];

  const mapCenter = {
    lng: parseFloat(geoFormValues?.coordinateX) || -98.5795,
    lat: parseFloat(geoFormValues?.coordinateY) || 39.8283,
  };

  //#region //! API

  const getSingleIncidentKey = `/CAD/Monitor/MonitorIncidentByID/${incNo}`;
  const { data: singleIncidentData, isSuccess: isFetchSingleIncidentData, } = useQuery(
    [getSingleIncidentKey, {
      IncidentID: incNo, AgencyID: loginAgencyID,
    }],
    MonitorServices.getSingleIncident,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID && !!incNo,
    }
  );

  const servicePayload = [
    incidentFormValues?.CFSL ? '1' : '',
    incidentFormValues?.CFSF ? '2' : '',
    incidentFormValues?.CFSE ? '3' : '',
    incidentFormValues?.OTHER ? '4' : ''
  ].filter(Boolean).join(',') || null

  useEffect(() => {
    if (!servicePayload) {
      setResourceDropDown([]);
    }
  }, [servicePayload])
  const getResourcesKey = `/CAD/MasterResource/GetDataDropDown_Resource/${loginAgencyID}`;
  const { data: getResourcesData, isSuccess: isFetchResourcesData } = useQuery(
    [getResourcesKey, { AgencyID: loginAgencyID, CFSDetails: servicePayload, },],
    MasterTableListServices.getDataDropDown_Resource,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!servicePayload && openCallTakerModal,
    }
  );

  useEffect(() => {
    if (isFetchResourcesData && getResourcesData) {
      const data = JSON.parse(getResourcesData?.data?.data);
      setResourceDropDown(data?.Table || [])
    }
  }, [isFetchResourcesData, getResourcesData])

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      if (singleIncidentData && isFetchSingleIncidentData) {
        try {
          const parsedData = JSON.parse(singleIncidentData?.data?.data)?.Table?.[0] || [];
          setGeoLocationID(parsedData?.GEOID);
          const response1 = await GeoServices.getLocationDataByID({
            GeoLocationID: parsedData?.GEOID,
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
              isVerify: data?.IsVerified === 1 ? true : false,
            });
            const CFScalltypes = parsedData?.CFScalltypes || ''; // e.g., "L,F,E,O"
            const typesArray = CFScalltypes.split(',');
            setIncidentFormValues({
              location: parsedData?.CrimeLocation,
              ApartmentNo: parsedData?.ApartmentNo,
              ReceiveSourceID: receiveSourceDropDown?.find((i) => i?.ReceiveSourceID === parsedData?.ReceiveSourceID),
              CallforServiceID: cfsDropDown?.find((i) => i?.CallforServiceID === parsedData?.CADCFSCodeID),
              CFSLDetails: cfsDropDown?.find((i) => i?.CallforServiceID === parsedData?.CADCFSCodeID),
              CFSLPriority: PriorityDrpData?.find((i) => i?.PriorityID === parsedData?.CFSFPriority),
              CFSL: typesArray.includes('L') ? 1 : 0 || 1,
              CFSF: typesArray.includes('F') ? 1 : 0,
              CFSE: typesArray.includes('E') ? 1 : 0,
              OTHER: typesArray.includes('O') ? 1 : 0,
              Comments: parsedData?.IncidentComment,
              Resource1: [],
              Resource2: "",
              Resource3: "",
              Resource4: "",
              Resource5: "",
              Resource6: "",
              Resource7: "",
              Resource8: "",
            });
          }
          setIsSelectLocation(true);
          setAptData({ value: "", label: "", aptId: parsedData?.ReportdApartmentNoId });
        } catch (error) {
          console.error("Error fetching incident data:", error);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [singleIncidentData, isFetchSingleIncidentData, receiveSourceDropDown, cfsDropDown, PriorityDrpData, isQueueCall]);

  const receiveSourceKey = `/CAD/CallTakerReceiveSource/GetData_ReceiveSource`;
  const { data: receiveSourceData, isSuccess: isFetchReceiveSourceData } =
    useQuery(
      [receiveSourceKey, { Action: "GetData_ReceiveSource", AgencyID: loginAgencyID }],
      CallTakerServices.getReceiveSource,
      {
        refetchOnWindowFocus: false,
        enabled: !!loginAgencyID && openCallTakerModal,
      }
    );

  const CFSCodeKey = `/CAD/MasterCallforServiceCode/GetCallforServiceCode`;
  const { data: cfsData, isSuccess: isFetchCFSData } = useQuery(
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
      enabled: openCallTakerModal && !!loginAgencyID
    }
  );
  const getNameReasonCodeKey = `/CAD/DispatcherNameReasonCode/GetDataDropDown_NameReasonCode`;
  const payloadReasonCode = { CategoryID: 1, AgencyID: loginAgencyID };
  const { data: nameReasonCodeData, isSuccess: isFetchNameReasonCodeData } =
    useQuery(
      [getNameReasonCodeKey, { payloadReasonCode }],
      CallTakerServices.getNameReasonCode,
      {
        refetchOnWindowFocus: false,
        enabled: openCallTakerModal && !!loginAgencyID
      }
    );

  const tagYearKey = `/CAD/CallTakerVehiclePlateType/GetData_TagYear`;
  const { data: tagYearData, isSuccess: isFetchTagYearData } = useQuery(
    [tagYearKey],
    CallTakerServices.getTagYear,
    {
      refetchOnWindowFocus: false,
      enabled: openCallTakerModal
    }
  );
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
      enabled: openCallTakerModal && !!geoLocationID
    }
  );

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

  const getIncidentByCrimeAndCFSKey = `/CAD/Incident/GetIncidentByCrimeAndCFS/${geoLocationID}/${incidentFormValues?.CFSLDetails?.CallforServiceID}/${isQueueCall}`;
  useQuery(
    [getIncidentByCrimeAndCFSKey, {
      AgencyID: loginAgencyID,
      CrimeLocationID: geoLocationID,
      CADCFSCodeID: incidentFormValues?.CFSLDetails?.CallforServiceID,
    }],
    CallTakerServices.getIncidentByCrimeAndCFS,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (res) => {
        if (res?.data?.Data?.length === 0) {
          setDuplicateCallData([]);
        } else {
          try {
            const parsedData = JSON.parse(res?.data?.data);
            const data = parsedData?.Table;
            if (data?.[0]?.IncidentID) {
              setOpenDuplicateCallModal(true);
              setDuplicateCallData(data);
            } else {
              setOpenDuplicateCallModal(false);
              setDuplicateCallData([]);
            }
          } catch (error) {
            setOpenDuplicateCallModal(false);
            console.error("Error parsing name:", error);
          }
        }
      },
      onError: (error) => {
        setOpenDuplicateCallModal(false);
        setDuplicateCallData([]);
        console.error("Error parsing name:", error);
      },
      enabled: !!geoLocationID && incidentFormValues?.CFSLDetails?.CallforServiceID > 0
    }
  );

  const getPremiseKey = `/CAD/GeoPremiseType/GetData_Premise`;
  const { data: premiseData, isSuccess: isFetchPremiseData } = useQuery(
    [getPremiseKey, {}],
    GeoServices.getPremise,
    {
      refetchOnWindowFocus: false,
      enabled: openCallTakerModal
    }
  );

  const getFlagKey = `/CAD/GeoFlage/GetData_Flag`;
  const { data: flagData, isSuccess: isFetchFlagData } = useQuery(
    [getFlagKey, {}],
    GeoServices.getFlag,
    {
      refetchOnWindowFocus: false,
      enabled: openCallTakerModal
    }
  );

  const payload = { GeoLocationID: geoLocationID, AgencyID: loginAgencyID };
  const getContactKey = `/CAD/GeoLocationContactDetail/GetData_GeoContact/${geoLocationID}`;
  const {
    data: contactData,
    isSuccess: isFetchContactData,
  } = useQuery([getContactKey, { payload }], GeoServices.getContactData, {
    refetchOnWindowFocus: false,
    enabled: !!geoLocationID,
  });

  const geoZoneKey = `/CAD/GeoPetrolZone/GetData_Zone`;
  const { data: geoZoneData, isSuccess: isFetchGeoZoneData } = useQuery(
    [geoZoneKey, { IsActive: 1, AgencyID: loginAgencyID, }],
    GeoServices.getGeoZone,
    {
      refetchOnWindowFocus: false,
    }
  );

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
      enabled: openCallTakerModal && !!geoLocationID && !isEmpty(aptData?.aptId),
    }
  );

  useEffect(() => {
    if (geoFormValues?.location && isFetchGetFlagList && getFlagList && (isEmptyObject(aptData) || (aptData && aptData?.aptId))) {
      const data = JSON.parse(getFlagList?.data?.data) || [];
      setFlagBudgeList(data);
    } else {
      setFlagBudgeList([]);
      setSelectedFlagData({})
    }
  }, [isFetchGetFlagList, getFlagList, geoLocationID, aptData]);

  const Get_Alerts_Data = async (AlertFromId, AlertFrom) => {
    const val = { 'AlertFromId': AlertFromId, 'AlertFrom': AlertFrom }
    await fetchPostData('Alerts/GetData_Alerts', val)
      .then((res) => {
        if (res?.length > 0) {
          if (AlertFrom === "Name") {
            setNameAlertData(res);
          } else {
            setVehicleAlertData(res);
          }
        } else {
          if (AlertFrom === "Name") { setNameAlertData([]) } else { setVehicleAlertData([]) }
        }
      })
  }

  useEffect(() => {
    Get_Alerts_Data(nameCallTaker?.MasterNameID, "Name");
  }, [nameCallTaker?.MasterNameID]);

  useEffect(() => {
    Get_Alerts_Data(vehicleCallTaker?.MasterPropertyID, "Vehicle");
  }, [vehicleCallTaker?.MasterPropertyID]);
  //#endregion

  useEffect(() => {
    if (openCallTakerModal && isLoaded) {
      setTimeout(() => {
        setIsMapVisible(true);
        if (mapRef.current) {
          window.google.maps.event.trigger(mapRef.current, "resize");
        }
      }, 300);
    } else {
      setIsMapVisible(false);
    }
  }, [openCallTakerModal, isLoaded]);

  useEffect(() => {
    if (isFetchGeoZoneData && geoZoneData) {
      const data = JSON.parse(geoZoneData?.data?.data)?.Table || [];
      setGeoZoneDropDown(
        dropDownDataModel(data, "ZoneID", "ZoneCode")
      );
    }
  }, [isFetchGeoZoneData, geoZoneData]);

  useEffect(() => {
    if (loginAgencyID) {
      if (stateList?.length === 0) dispatch(get_State_Drp_Data())
      if (plateTypeIdDrp?.length === 0) dispatch(get_PlateType_Drp_Data())
    }
  }, [loginAgencyID])

  useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
      if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
    }
  }, [localStoreData]);

  useEffect(() => {
    if (isFetchReceiveSourceData && receiveSourceData) {
      const data = JSON.parse(receiveSourceData?.data?.data);
      setReceiveSourceDropDown(data?.Table || []);
    }
  }, [isFetchReceiveSourceData, receiveSourceData]);

  useEffect(() => {
    if (isFetchNameReasonCodeData && nameReasonCodeData) {
      const data = JSON.parse(nameReasonCodeData?.data?.data);
      setReasonCodeDropDown(
        dropDownDataModel(data?.Table, "NameReasonCodeID", "Description")
      );
    }
  }, [isFetchNameReasonCodeData, nameReasonCodeData]);

  useEffect(() => {
    if (isFetchCFSData && cfsData) {
      const data = JSON.parse(cfsData?.data?.data)?.Table;
      setCFSDropDown(data);
      setCFSDescDropDown(data);
    }
  }, [isFetchCFSData, cfsData]);

  useEffect(() => {
    if (isFetchPremiseData && premiseData) {
      const data = JSON.parse(premiseData?.data?.data);
      setPremiseDropDown(dropDownDataModel(data?.Table, "ID", "PremiseType"));
    }
  }, [isFetchPremiseData, premiseData]);

  useEffect(() => {
    if (isFetchTagYearData && tagYearData) {
      const data = JSON.parse(tagYearData?.data?.data);
      setTagYearDropDown(dropDownDataModel(data?.Table, "TagYear", "TagYear"));
    }
  }, [isFetchTagYearData, tagYearData]);

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
      setIncidentFormValues((prevState) => ({
        ...prevState,
        ApartmentNo: "",
      }));
      setAptSuiteNoDropDown([]);
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, geoLocationID, geoFormValues?.location]);


  useEffect(() => {
    setIsVerifyReportedLocation(false);

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
        setLocationData([]);
        setAptSuiteNoDropDown([]);
      }
    };

    if (geoFormValues?.location) {
      fetchLocationData();
    }
  }, [geoFormValues?.location, isSelectLocation]);

  useEffect(() => {
    if (isFetchFlagData && flagData) {
      const data = JSON.parse(flagData?.data?.data);
      setFlagDropDown(dropDownDataModel(data?.Table, "ID", "CurrentFlag"));
    }
  }, [isFetchFlagData, flagData]);

  useEffect(() => {
    if (isFetchContactData && contactData) {
      if (contactData?.data?.Data?.length === 0) {
        return;
      } else {
        try {
          const parsedData = JSON.parse(contactData?.data?.data);
          const contactInfo = parsedData?.Table;

          contactInfo.forEach((item) => {
            if (typeof item.PhoneNo === "string") {
              try {
                item.PhoneNo = JSON.parse(item.PhoneNo);
              } catch (error) {
                console.error("Error parsing PhoneNo:", error);
              }
            }
          });

          setContactList(contactInfo);
        } catch (error) {
          console.error("Error parsing contact data:", error);
        }
      }
    }
  }, [isFetchContactData, contactData]);

  const defaultOption = aptSuiteNoDropDown.find(
    (option) => option?.aptId && !option?.value && !option?.label
  );

  useEffect(() => {
    if (!aptData?.value && !aptData?.label && defaultOption) {
      setAptData({ value: '', label: '', aptId: defaultOption.aptId });
    }
  }, [aptSuiteNoDropDown, defaultOption]);

  const validateForm = () => {
    let isError = false;
    const keys = Object.keys(errorNameCallTaker);
    keys.forEach((field) => {
      if (
        field === "NameReasonCodeID" && (!isEmpty(nameCallTaker?.FirstName) || !isEmpty(nameCallTaker?.LastName)) &&
        (nameCallTaker[field]?.length === 0)) {
        handleErrorNameCallTaker(field, true);
        isError = true;
        return;
      } else {
        handleErrorNameCallTaker(field, false);
      }
    });
    return !isError;
  };

  function handleClear() {
    setGeoLocationID();
    clearStateCallTaker();
    clearStateNameCallTaker();
    setGEOFormValues(initialFormValues);
    setIsSelectLocation(false);
    setIsDispatchLoading(false);
    setIsRouteLoading(false)
    clearState();
    setIsChangeFields(false);
    setAptData({})
    clearDocCallTakerState()
    setOpenDuplicateCallModal(false)
    setIncidentFormValues(incidentInitialValues);
    setCfsImageData();
  }

  const onCloseLocation = () => {
    setCallTakerModal(false);
    setIsDispatchLoading(false);
    setIsRouteLoading(false)
    clearVehicleState();
    setGeoLocationID("");
    clearStateCallTaker();
    clearStateNameCallTaker();
    setContactList([]);
    handleClear();
    clearState();
    setIncidentFormValues(incidentInitialValues);
    setGEOFormValues(initialFormValues);
    setIsSelectLocation(false);
    setIsChangeFields(false);
    setAptData({})
    setIsVerifyReportedLocation(false);
    setSelectedButton([]);
    clearDocCallTakerState()
    setOpenDuplicateCallModal(false)
    setCfsImageData();
  };

  const handleInputChangeIncident = (e) => {
    const { name, value } = e.target;
    setIncidentFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setIsChangeFields(true);
  };

  const handleSelectChangeIncident = (selectedOption, { name }) => {
    setIncidentFormValues((prevState) => ({
      ...prevState,
      [name]: selectedOption,
    }));
    setIsChangeFields(true);
    return;
  };

  const handleCheckboxChangeIncident = (key) => (e) => {
    setIncidentFormValues((prevValues) => ({
      ...prevValues,
      [key]: e.target.checked ? 1 : 0,
    }));
  };

  const handleSelectChangeIncidentCFS = (selectedOption, { name }) => {
    setCfsImageData(selectedOption?.Path || null)
    setIsChangeFields(true);
    const updatedValues = { ...incidentFormValues };

    if (selectedOption === null) {
      setResourceDropDown([]);
      updatedValues.Resource1 = [];
      if (name === "CallforServiceID") {
        updatedValues.CallforServiceID = null;
        updatedValues.CFSLDetails = null;
      }

      if (name === "CFSLDetails") {
        updatedValues.CFSLDetails = null;
        updatedValues.CallforServiceID = null;
      }

      setIncidentFormValues(() => ({
        ...updatedValues,
        CFSL: 0,
        CFSF: 0,
        CFSE: 0,
        OTHER: 0,
        CFSLPriority: "",
        requirePARTimer: false
      }));
      return;
    }

    const selectedData = JSON.parse(cfsData?.data?.data)?.Table.find(
      (item) => item?.CallforServiceID === selectedOption?.CallforServiceID
    );

    if (name === "CallforServiceID") {
      updatedValues.CallforServiceID = selectedOption;
      const selectedDescription = cfsDescDropDown.find(
        (item) => item?.CallforServiceID === selectedOption?.CallforServiceID
      );
      updatedValues.CFSLDetails = selectedDescription;
      updatedValues.Resource1 = [];
    }

    if (name === "CFSLDetails") {
      updatedValues.CFSLDetails = selectedOption;
      const selectedDescription = cfsDropDown.find(
        (item) => item?.CallforServiceID === selectedOption?.CallforServiceID
      );
      updatedValues.CallforServiceID = selectedDescription;
      updatedValues.Resource1 = [];
    }

    if (selectedData) {
      setIncidentFormValues(() => ({
        ...updatedValues,
        CFSL: 1,
        CFSF: selectedData?.FIRE ? 1 : 0,
        CFSE: selectedData?.EMERGENCYMEDICALSERVICE ? 1 : 0,
        OTHER: selectedData?.OTHER ? 1 : 0,
        // CFSLPriority: PriorityDrpData?.find(item => item.PriorityID === parseInt(selectedOption?.Prioritycode))
        CFSLPriority: PriorityDrpData?.find(item => item.PriorityID === parseInt(selectedOption?.PriorityID)),
        requirePARTimer: selectedData?.IsRequirePARTimer
      }));
    }
  };


  const handleSelectIncidentName = (selectedOption, { name }) => {
    const data = selectedOption.map(item => item?.value)
    handleNameCallTaker("NameReasonCodeID", data)
    setIsChangeFields(true);
  };

  const handleSelectIncidentVehicle = (selectedOption, { name }) => {
    handleVehicleCallTaker(name, selectedOption?.value)
    setIsChangeFields(true);
  };

  const handleSelectAptSuitNo = (selectedOption, { name }) => {
    if (selectedOption) {
      setIncidentFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption?.value || "",
      }));
      setAptData(selectedOption);
    } else if (defaultOption) {
      setIncidentFormValues((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      setAptData({ value: '', label: '', aptId: defaultOption.aptId });
    } else {
      setIncidentFormValues((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      setAptData({ value: '', label: '', aptId: '' });
    }
    setIsChangeFields(true);
    setAptInputValue("")
  };

  //#region  handler
  //
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

  const validateGeoFormValues = (isRoute) => {
    let isError = false;
    const keys = Object.keys(errorCallTaker);
    keys.forEach((field) => {
      if (
        field === "location" &&
        (geoFormValues[field] === null || isEmpty(geoFormValues[field]))) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else if (field === "ReceiveSourceID" && isEmptyObject(incidentFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else if (field === "CallforServiceID" && isEmptyObject(incidentFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      }
      else if (!isRoute && field === "Resource1" && isEmptyObject(incidentFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      }
      else if (field === "CFSLPriority" && isEmptyObject(incidentFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else {
        handleErrorCallTaker(field, false);
      }
    });
    return !isError;
  };

  const validateQueueCall = () => {
    let isError = false;
    const keys = Object.keys(errorCallTaker);
    keys.forEach((field) => {
      if (
        field === "location" &&
        isEmpty(geoFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else {
        handleErrorCallTaker(field, false);
      }
    });
    return !isError;
  }

  const customStylesWithOutColorArrow = {
    control: base => ({
      ...base,
      // height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      transition: "all .2s ease",
      transform: state.selectProps.menuIsOpen ? null : "rotate(180deg)"
    }),
    input: (provided) => ({
      ...provided,
      minWidth: '0px',
      maxWidth: '100%',
    }),
  };

  const addName = async () => {
    if (!validateForm()) return;
    setNameData((prevData) => [...prevData, nameCallTaker]);
    clearState();
  };

  const addVehicle = () => {
    setVehicleData((prevData) => [...prevData, vehicleCallTaker]);
    clearVehicleState();
  };

  const addDoc = async () => {
    // if (!validateForm()) return;
    setDocData((prevData) => [...prevData, docCallTaker]);
    clearDocCallTakerState();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // clear the input visually
    }
  };
  //#endregion

  const getResourceValues = () => {
    return incidentFormValues?.Resource1 ? incidentFormValues?.Resource1?.map(item => item.ResourceID).join(',') : "";
  };

  const createPayload = (resourceValues, GeoLocationID) => {
    const transformedData = nameData?.length > 0 ? nameData.map(item => ({
      "LastName": item.LastName,
      "FirstName": item.FirstName,
      "ReasonCode": item.NameReasonCodeID.join(",")
    })) : nameCallTaker.LastName || nameCallTaker.FirstName ? [{
      "LastName": nameCallTaker.LastName,
      "FirstName": nameCallTaker.FirstName,
      "ReasonCode": nameCallTaker.NameReasonCodeID.join(",")
    }] : "";

    const transformedVehicleData = vehicleData?.length > 0 ? vehicleData.map(item => ({
      "VehicleNo": item.Plate,
      "PlateTypeID": item.PlateTypeCode,
      "PlateID": item.StateCode,
      "ManufactureYear": item.TagYear
    })) : vehicleCallTaker.Plate || vehicleCallTaker.PlateTypeCode || vehicleCallTaker.StateCode || vehicleCallTaker.TagYear ? [{
      "VehicleNo": vehicleCallTaker.Plate,
      "PlateTypeID": vehicleCallTaker.PlateTypeCode,
      "PlateID": vehicleCallTaker.StateCode,
      "ManufactureYear": vehicleCallTaker.TagYear
    }] : "";

    const payload = {
      AgencyID: loginAgencyID || "",
      CADCFSCodeID: incidentFormValues?.CallforServiceID?.CallforServiceID || 0,
      LocationID: GeoLocationID ? GeoLocationID : geoFormValues?.Id ? geoFormValues?.Id : "",
      LocationDate: new Date().toISOString(),
      DirectionPrefix: geoFormValues?.stDirection || null,
      Street: geoFormValues?.Street || "",
      DirectionSufix: geoFormValues?.stDirection2 || "",
      City: geoFormValues?.City || "",
      ZipCode: geoFormValues?.ZipCode || "",
      PremiseNo: geoFormValues?.PremiseNo || "",
      ApartmentNo: incidentFormValues?.ApartmentNo || "",
      CommonPlace: geoFormValues?.commonPlaceName || "",
      PremiseType: geoFormValues?.premiseType?.value || "",
      MileMaker: geoFormValues?.mileMarker || "",
      AltStreet: geoFormValues?.AltStreet || "",
      InterDirectionPrefix: geoFormValues?.intersection1 || "",
      InterDirectionSufix: geoFormValues?.intersection2 || "",
      CreatedByUserFK: loginPinID || "",
      CFSL: incidentFormValues?.CFSL || 0,
      CFSDetails: incidentFormValues?.CFSLDetails?.CallforServiceID || 0,
      CFSF: incidentFormValues?.CFSF || 0,
      Comments: incidentFormValues?.Comments || "",
      CFSE: incidentFormValues?.CFSE || 0,
      OTHER: incidentFormValues?.OTHER || 0,
      ResourceIDs: resourceValues || "",
      PriorityID: incidentFormValues?.CFSLPriority?.PriorityID || "",
      Location: geoFormValues?.location || "",
      ReceiveSourceID: incidentFormValues?.ReceiveSourceID?.ReceiveSourceID || 0,
      Latitude: geoFormValues?.coordinateY || "",
      Longitude: geoFormValues?.coordinateX || "",
      ChildNameJson: transformedData?.length > 0 ? JSON.stringify(transformedData) : "",
      ChildVehicleJson: transformedVehicleData?.length > 0 ? JSON.stringify(transformedVehicleData) : "",
      ...(incNo && { IncidentID: incNo, IsQueueCall: 1, })
    };
    return payload;
  };

  const createLocationPayload = (locationInformation) => {
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
      City, ZipCode, PremiseNo, ApartmentNo: incidentFormValues.ApartmentNo, "CommonPlace": commonPlaceName,
      "PremiseType": premiseType?.label || "", "Latitude": coordinateY, "Longitude": coordinateX,
      "MileMaker": mileMarker, AltStreet, "InterDirectionPrefix": intersection1,
      "InterDirectionSufix": intersection2, "PatrolZone": patrolZone?.label, "EMSZone": emsZone?.label,
      "FireZone": fireZone?.label, "OtherZone": otherZone?.label, IsVerified: IsVerify,
      location, "CurrentFlage": currentFlag?.map(item => item?.label).join(", "),
      "GeoLocationContactsJson": JSON.stringify({ Contacts: contactList || [] }),
      "CreatedByUserFK": loginPinID, "AgencyID": loginAgencyID
    };
  };

  const updateSelectedButton = () => {
    setSelectedButton(prevSelected =>
      prevSelected.includes(2)
        ? prevSelected.filter(item => item !== 2)
        : [...prevSelected, 2]
    );
    onCloseLocation()
  };

  const insertIncident = async (formData) => {
    try {
      const response = await CallTakerServices.insertIncident(formData);
      const data = JSON.parse(response?.data?.data)
      setIncNo(data?.Table?.[0]?.IncidentID)

      // add doc
      if (data?.Table?.[0]?.IncidentID) {
        const docFormData = new FormData();

        const incidentDocuments = docData.map((doc) => {
          docFormData.append('file', doc.file, doc.file.name); // Adding file as binary data

          return {
            "DocumentName": doc.DocumentName,
            "FileAttachment": doc.file.name,
            "CreatedByUserFK": loginPinID,
            "AgencyID": loginAgencyID,
            "IncidentId": data?.Table?.[0]?.IncidentID
          };
        });

        docFormData.append('Data', JSON.stringify(incidentDocuments));
        await CallTakerServices.insertCallTakerDoc(docFormData);
      }

      // end add doc


      if (data?.Table?.length > 0) {
        setIsIncidentDispatch(!isIncidentDispatch);
        onCloseLocation();
        updateSelectedButton();
      } else {
        console.error("Failed to insert incident data");
      }



    } catch (error) {
      console.error("Failed to insert incident data", error);
    }
  };

  const handleOnSave = async (isRoute) => {
    if (!validateForm()) return;
    if (!validateGeoFormValues(isRoute)) return;
    setIsDispatchLoading(!isRoute);
    setIsRouteLoading(isRoute);
    const resourceValues = getResourceValues();
    let formData;
    if (isGoogleLocation && geoLocationID) {
      formData = createPayload(resourceValues, geoLocationID)
    }
    else {
      formData = createPayload(resourceValues)
    }

    if (isGoogleLocation && !geoLocationID) {
      const locationPayload = createLocationPayload();
      const response = await GeoServices.insertLocation(locationPayload);
      if (response?.data?.success) {
        const data = JSON.parse(response?.data?.data);
        const newGeoLocationID = data?.Table?.[0]?.GeoLocationID;

        if (newGeoLocationID) {
          setGeoLocationID(newGeoLocationID);
          formData = createPayload(resourceValues, newGeoLocationID);
        }

        setIsChangeFields(false);
        await insertIncident(formData);
        refetchQueueCall();
      }
    } else {
      await insertIncident(formData);
      refetchQueueCall();
    }
    incidentRefetch();
    unassignedIncidentListRefetch();
    assignedIncidentListRefetch();
    resourceRefetch();
    setNameData([]);
    setVehicleData([]);
    setDocData([]);
    onCloseLocation();
    setIsDispatchLoading(false);
    setIsRouteLoading(false);
    refreshQueueCallCount();
    refreshQueueCallData(); // Refresh queue call data using context
  };


  const isValidZone = (zone) => zone && Object.keys(zone)?.length > 0;

  const isVerifyLocation =
    geoFormValues.IsVerify &&
    isValidZone(geoFormValues.patrolZone) &&
    isValidZone(geoFormValues.emsZone) &&
    isValidZone(geoFormValues.fireZone) &&
    isValidZone(geoFormValues.otherZone);

  const onNameSearch = async () => {
    setIsOpenSearchNameModel(true)
  }
  function handleCloseConfirm() {
    setShowConfirmModal(false);
    onCloseLocation();
    setIsChangeFields(false);
    setNameData([]);
    setVehicleData([]);
    setDocData([]);
  }

  const validateCloseCall = () => {
    let isError = false;
    const keys = Object.keys(errorCallTaker);
    keys.forEach((field) => {
      if (
        field === "location" &&
        (isEmpty(geoFormValues[field]) || geoFormValues[field] === null)) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else if (field === "CallforServiceID" && isEmptyObject(incidentFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else if (field === "CFSLPriority" && isEmptyObject(incidentFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else if (field === "ReceiveSourceID" && isEmptyObject(incidentFormValues[field])) {
        handleErrorCallTaker(field, true);
        isError = true;
        return;
      } else {
        handleErrorCallTaker(field, false);
      }
    });
    return !isError;
  };

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

  function handleOpenCloseCall() {
    if (!validateCloseCall()) return;
    setSelectedButton(prevSelected =>
      prevSelected.includes(6)
        ? prevSelected.filter(item => item !== 6)
        : [...prevSelected, 6]
    );
    setOpenCloseCallModal(true);
  }

  async function handleQueueCall() {
    if (!validateQueueCall()) return;
    setIsCallAPI(true);
    const resourceValues = getResourceValues();
    let formData = createPayload(resourceValues);
    formData = {
      ...formData,
      IsQueueCall: 1,
    };

    if (isGoogleLocation) {
      const locationPayload = createLocationPayload();
      const response = await GeoServices.insertLocation(locationPayload);
      if (response?.data?.success) {
        if (!geoLocationID) {
          const data = JSON.parse(response?.data?.data);
          const newGeoLocationID = data?.Table[0]?.GeoLocationID;
          setGeoLocationID(newGeoLocationID);
          formData = createPayload(resourceValues, newGeoLocationID);
          formData = {
            ...formData,
            IsQueueCall: 1,
          };
        }
        setIsChangeFields(false);
        await insertIncident(formData);
      }
    } else {
      await insertIncident(formData);
    }
    setIsCallAPI(false);
    incidentRefetch();
    unassignedIncidentListRefetch();
    assignedIncidentListRefetch();
    resourceRefetch();
    setNameData([]);
    setVehicleData([]);
    setDocData([])
    onCloseLocation();
    refreshQueueCallCount();
    refreshQueueCallData(); // Refresh queue call data using context
  }
  // const handleImageChange = (e) => {
  //   setStatesChangeStatus(true)
  //   const files = e.target.files
  //   setSelectedFile(files)
  //   const nameArray = []
  //   for (let name of files) { nameArray?.push(name?.name) }
  //   setSelectedFileName(nameArray);
  // };
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const maxFileSizeInMB = 10;
    const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'text/plain'
    ];

    const validFiles = [];
    const invalidFileTypes = [];
    const oversizedFiles = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFileTypes.push(file.name);
      } else if (file.size > maxFileSizeInBytes) {
        oversizedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFileTypes.length > 0) {
      toastifyError(`Invalid file(s): ${invalidFileTypes.join(", ")}.`);
    }

    if (oversizedFiles.length > 0) {
      toastifyError(`File size exceeds limit.`);
    }

    if (validFiles.length > 0) {
      setDocCallTaker((prev) => ({ ...prev, file: validFiles[0] }));
    }

    // ❌ REMOVE THIS LINE:
    // event.target.value = ""; 
  };

  const isImageFile = (fileName) => {
    const imageExtensions = /\.(png|jpg|jpeg|jfif|bmp|gif|webp|tiff|tif|svg|ico|heif|heic)$/i;
    return imageExtensions.test(fileName);
  };


  const handleFileClick = (file) => {
    const fileType = file.name ? file.name : file;
    if (isImageFile(fileType)) {
      if (file.name) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      } else {
        window.open(fileType, '_blank');
      }
    } else {
      if (file.name) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      } else {
        window.open(fileType, '_blank');
      }
    }
  };

  const day = new Date().getDate()
  const month = new Date().getMonth()
  const year = new Date().getFullYear()
  return (
    <>
      {openCallTakerModal ? (
        <div
          className="modal fade"
          style={{
            background: "rgba(0,0,0, 0.5)",
            zIndex: "200",
            overflow: "hidden",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          id="CallTakerModal"
          tabIndex="-1"
          aria-hidden="true"
          data-backdrop="false"
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div
              className="modal-content modal-content-cad"
              style={{
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
              }}
            >
              <div className="modal-body pb-1">
                {/* Modal Title */}
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
                        Call Taker
                      </p>
                    </div>
                  </div>
                </div>
                <div className="m-1">
                  <fieldset
                    style={{ border: "1px solid gray" }}
                    className="tab-form-container"
                  >
                    {/* Incident */}
                    <fieldset className="tab-form-container">
                      <legend className="cad-legend">Incident</legend>
                      <div className="d-flex">
                        <div
                          className="col-8"
                          style={{ display: "grid", gap: "5px" }}
                        >
                          {/* Row 1 */}
                          <div className="tab-form-row">
                            <div className="col-1 d-flex align-self-center justify-content-end">
                              <label htmlFor="Location" className="tab-form-label" style={{ textAlign: "end", marginRight: "4px" }}>
                                Location {errorCallTaker.location && (isEmpty(geoFormValues?.location) || geoFormValues?.location === null) && (
                                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Location"}</p>
                                )}
                              </label>
                            </div>
                            <div className="col-7 w-100 d-flex tab-form-row-gap inner-input-fullw" style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ flexGrow: 1 }}>
                                <Location
                                  {...{
                                    value: geoFormValues,
                                    setValue: setGEOFormValues,
                                    locationStatus,
                                    setLocationStatus,
                                    setOnSelectLocation,
                                    locationData,
                                    setContactList: setContactList,
                                    setGeoLocationID,
                                    flagDropDown,
                                    premiseDropDown,
                                    setZoom,
                                    setIsSelectLocation,
                                    setIsChangeFields,
                                    geoZoneDropDown,
                                    setIsGoogleLocation,
                                    setIsCheckGoogleLocation,

                                  }}
                                  col="location"
                                  locationID="NameLocationID"
                                  check={true}
                                  isDisabled={!!incNo}
                                  // verify={geoFormValues.IsVerify}
                                  page="Name"
                                  isGEO
                                />
                              </div>
                              <div className="d-flex align-items-center" style={{ marginLeft: 'auto', gap: '8px' }}>
                                {/* <div className="form-check custom-control custom-checkbox">
                                  <input className="custom-control-input" type="checkbox"
                                    checked={geoFormValues?.isVerify} disabled
                                  />
                                  <label className="custom-control-label tab-form-label" >
                                    Verify
                                  </label>
                                </div> */}
                                {geoFormValues?.location &&
                                  <button
                                    type="button"
                                    data-toggle={geoFormValues?.location ? "modal" : undefined}
                                    data-target={geoFormValues?.location ? "#LocationInformationModal" : undefined}
                                    onClick={() => {
                                      if (!geoFormValues?.location) return; // Prevent click event when disabled

                                      setSelectedButton(prevSelected =>
                                        prevSelected.includes(3)
                                          ? prevSelected.filter(item => item !== 3)
                                          : [...prevSelected, 3]
                                      );
                                      setOpenLocationInformationModal(true);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        if (!geoFormValues?.location) return;

                                        setSelectedButton(prevSelected =>
                                          prevSelected.includes(3)
                                            ? prevSelected.filter(item => item !== 3)
                                            : [...prevSelected, 3]
                                        );
                                        setOpenLocationInformationModal(true);
                                      }
                                    }}
                                    className={`pt-1 border-0 bg-transparent ${!geoFormValues?.location ? "disabled" : ""}`}
                                    style={{
                                      fontSize: "16px",
                                      cursor: geoFormValues?.location ? "pointer" : "not-allowed",
                                      color: geoFormValues?.location ? "blue" : "gray",
                                      pointerEvents: !geoFormValues?.location ? "none" : "auto", // Disable click entirely
                                    }}
                                    disabled={!geoFormValues?.location}
                                    aria-label="Open location information modal"
                                  >
                                    {isVerifyLocation || isVerifyReportedLocation ?
                                      <span className="badge text-white" style={{ backgroundColor: "#008000", padding: "9px" }}>Verified</span> :
                                      <span className="badge text-white" style={{ textDecoration: "underline", padding: "9px", backgroundColor: "#ff0000", cursor: "pointer" }}>
                                        Unverified
                                      </span>
                                    }
                                  </button>}

                                {/* {
                                  (incidentState?.isVerifyFoundLocation === 1 && incidentState?.FoundLocation) && (
                                    <span className="badge text-white p-2" style={{ backgroundColor: "#008000" }}>Verified</span>
                                  )
                                }
                                {
                                  (incidentState?.isVerifyFoundLocation === 0 && incidentState?.FoundLocation) && (
                                    <OverlayTrigger
                                      placement="bottom"
                                      overlay={<Tooltip id="tooltip">Please verify the unverified location through the GEO tab.</Tooltip>}
                                    >
                                      <span className="badge text-white p-2" style={{ textDecoration: "underline", backgroundColor: "#ff0000", cursor: "pointer" }}>
                                        Unverified
                                      </span>
                                    </OverlayTrigger>
                                  )
                                } */}



                                {/* {
                                  (incidentState?.isVerifyFoundLocation === 1 && incidentState?.FoundLocation) &&
                                  <span className="badge bg-secondary">Verified</span>
                                }
                                {
                                  (incidentState?.isVerifyFoundLocation === 0 && incidentState?.FoundLocation) &&
                                  <OverlayTrigger
                                    placement="bottom"
                                    overlay={<Tooltip id="tooltip">Please verify the unverified location through the GEO tab.</Tooltip>}
                                  >
                                    <span className="badge bg-secondary">Unverified</span>
                                  </OverlayTrigger>
                                } */}

                              </div>
                            </div>
                            <div className="col-4 d-flex tab-form-row-gap">
                              <div className=" d-flex align-self-center justify-content-end">
                                <label
                                  htmlFor="ApartmentNo"
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
                                  incidentFormValues.ApartmentNo
                                    ? { value: incidentFormValues.ApartmentNo, label: incidentFormValues.ApartmentNo }
                                    : defaultOption || null
                                }
                                onChange={
                                  handleSelectAptSuitNo
                                }
                                onCreateOption={handleCreateOption} // Restrict to 4-digit numbers
                                inputValue={aptInputValue} // Real-time controlled input
                                onInputChange={handleInputChange} // Restricts input dynamically
                                styles={{
                                  control: (provided) => ({
                                    ...provided,
                                    width: "100%",
                                    backgroundColor: incNo ? "#9d949436" : "#fff",
                                  }),
                                }}
                                className="w-100"
                                isDisabled={!!incNo}
                                menuPlacement="bottom"
                              />
                            </div>
                          </div>

                          {/* Row 2 */}
                          <div className="tab-form-row">
                            <div className="col-1 d-flex align-self-center justify-content-end">
                              <label htmlFor="CFS" className="new-label" style={{ textAlign: "end", marginRight: "5px" }}>
                                CFS {errorCallTaker.CallforServiceID && isEmptyObject(incidentFormValues.CallforServiceID) && (
                                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select CFS"}</p>
                                )}
                              </label>
                            </div>
                            <div className="col-2 d-flex tab-form-row-gap">
                              <Select
                                options={cfsDropDown}
                                placeholder="Select..."
                                styles={customStylesWithOutColorArrow}
                                className="w-100"
                                name="CallforServiceID"
                                getOptionLabel={(v) => v?.CFSCODE}
                                getOptionValue={(v) => v?.CallforServiceID}
                                isClearable
                                value={incidentFormValues.CallforServiceID}
                                onChange={handleSelectChangeIncidentCFS}
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
                                options={cfsDescDropDown}
                                placeholder="Select..."
                                styles={customStylesWithOutColorArrow}
                                className="w-100"
                                name="CFSLDetails"
                                getOptionLabel={(v) => v?.CFSCodeDescription}
                                getOptionValue={(v) => v?.CallforServiceID}
                                isClearable
                                // formatOptionLabel={(option, { context }) => {
                                //   return context === 'menu' ? option.CFSCODE + " | " + option.CFSCodeDescription : option?.CFSCodeDescription
                                // }}
                                value={incidentFormValues.CFSLDetails}
                                onChange={handleSelectChangeIncidentCFS}
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
                              {cfsImageData &&
                                <img
                                  src={img}
                                  alt="Document Icon"
                                  onClick={() => handleFileClick(cfsImageData)}
                                  style={{ width: '30px', height: '30px' }}
                                />
                              }
                            </div>{" "}
                            <div className="col-3 d-flex tab-form-row-gap">
                              <div className=" d-flex align-self-center justify-content-end">
                                <label htmlFor="Priority" className="tab-form-label text-nowrap" style={{ textAlign: "end" }}>
                                  Priority {errorCallTaker.CFSLPriority && isEmptyObject(incidentFormValues.CFSLPriority) && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Priority"}</p>
                                  )}
                                </label>
                              </div>
                              <Select
                                isClearable
                                options={PriorityDrpData}
                                placeholder="Select..."
                                styles={customStylesWithOutColorArrow}
                                className="w-100"
                                name="CFSLPriority"
                                value={incidentFormValues.CFSLPriority}
                                getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                getOptionValue={(v) => v?.PriorityCode}
                                formatOptionLabel={(option, { context }) => {
                                  return context === 'menu'
                                    ? `${option?.PriorityCode} | ${option?.Description}`
                                    : option?.PriorityCode;
                                }}
                                onChange={handleSelectChangeIncident}
                                onInputChange={(inputValue, actionMeta) => {
                                  if (inputValue.length > 12) {
                                    return inputValue.slice(0, 12);
                                  }
                                  return inputValue;
                                }}
                              />
                            </div>
                          </div>

                          {/* Row 3 */}
                          <div className="tab-form-row d-flex justify-content-center">
                            <div className="col-6 d-flex justify-content-between offset-1" style={{ gap: "5px" }}>
                              <div
                                className="d-flex align-items-center"
                                style={{ gap: "5px" }}
                              >
                                <input type="checkbox" checked={incidentFormValues.CFSL} disabled onChange={handleCheckboxChangeIncident("CFSL")} />
                                <span className="new-label text-nowrap">L - Law</span>
                              </div>
                              <div
                                className="d-flex align-items-center"
                                style={{ gap: "5px" }}
                              >
                                <input type="checkbox" checked={incidentFormValues.CFSF} onChange={handleCheckboxChangeIncident("CFSF")} />
                                <span className="new-label text-nowrap">F - Fire</span>
                              </div>
                              <div
                                className="d-flex align-items-center"
                                style={{ gap: "5px" }}
                              >
                                <input type="checkbox" checked={incidentFormValues.CFSE} onChange={handleCheckboxChangeIncident("CFSE")} />
                                <span className="new-label text-nowrap">E - Emergency Medical Service</span>
                              </div>
                              <div
                                className="d-flex align-items-center"
                                style={{ gap: "5px" }}
                              >
                                <input type="checkbox" checked={incidentFormValues.OTHER} onChange={handleCheckboxChangeIncident("OTHER")} />
                                <span className="new-label text-nowrap">O - Other</span>
                              </div>
                            </div>
                            <div className="col-4 d-flex tab-form-row-gap offset-1">
                              <label
                                htmlFor="ReceiveSource"
                                className="new-label text-nowrap" style={{ textAlign: "end", paddingTop: "8px" }}
                              >
                                Receive Source{errorCallTaker.ReceiveSourceID && isEmptyObject(incidentFormValues.ReceiveSourceID) && (
                                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Source"}</p>
                                )}
                              </label>
                              <Select
                                isClearable
                                options={receiveSourceDropDown}
                                placeholder="Select..."
                                styles={customStylesWithOutColorArrow}
                                className="w-100"
                                name="ReceiveSourceID"
                                isSearchable
                                getOptionLabel={(v) => v?.ReceiveSourceCode}
                                getOptionValue={(v) => v?.ReceiveSourceID}
                                value={incidentFormValues.ReceiveSourceID}
                                onChange={handleSelectChangeIncident}
                                onInputChange={(inputValue, actionMeta) => {
                                  if (inputValue.length > 12) {
                                    return inputValue.slice(0, 12);
                                  }
                                  return inputValue;
                                }}
                              />
                            </div>
                          </div>

                          {/* Row 5 */}
                          <div className="tab-form-row d-flex align-items-center">
                            <div className="col-1 d-flex justify-content-end">
                              <label htmlFor="Zone" className="new-label" style={{ textAlign: "end", paddingTop: "2px", marginRight: "4px" }}>
                                Zone
                              </label>
                            </div>
                            <div className="col-9 tab-form-row-gap d-flex w-100">
                              {geoFormValues?.patrolZone?.label && <>
                                <button
                                  type="button"
                                  style={{
                                    backgroundColor: "#E0DEDE",
                                    color: "#000",
                                    border: "none",
                                    minWidth: "max-content"
                                  }}
                                  className="btn btn-sm btn-CADprimary1"
                                >
                                  {"Law " + geoFormValues?.patrolZone?.label}
                                </button></>}
                              {geoFormValues?.fireZone?.label && <>
                                <button
                                  type="button"
                                  style={{
                                    backgroundColor: "#E0DEDE",
                                    color: "#000",
                                    border: "none",
                                    minWidth: "max-content"
                                  }}
                                  className="btn btn-sm btn-CADprimary1"
                                >
                                  {"Fire " + geoFormValues?.fireZone?.label}
                                </button></>}
                              {geoFormValues?.emsZone?.label && <>
                                <button
                                  type="button"
                                  style={{
                                    backgroundColor: "#E0DEDE",
                                    color: "#000",
                                    border: "none",
                                    minWidth: "max-content"
                                  }}
                                  className="btn btn-sm btn-CADprimary1"
                                >
                                  {"EMS " + geoFormValues?.emsZone?.label}
                                </button></>} {geoFormValues?.otherZone?.label && <>
                                  <button
                                    type="button"
                                    style={{
                                      backgroundColor: "#E0DEDE",
                                      color: "#000",
                                      border: "none",
                                      minWidth: "max-content"
                                    }}
                                    className="btn btn-sm btn-CADprimary1"
                                  >
                                    {"Other " + geoFormValues?.otherZone?.label}
                                  </button></>}
                            </div>
                            <div className="col-2 agency-checkbox-item">
                              <input
                                type="checkbox"
                                name="requirePARTimer"
                                checked={incidentFormValues.requirePARTimer}
                                disabled
                              />
                              <div className="agency-checkbox-text-container tab-form-label">
                                <span>Require PAR Timer</span>
                              </div>
                            </div>
                          </div>
                          {/* Row 4 */}
                          <div className="tab-form-row">
                            <div className="col-1 d-flex justify-content-end">
                              <label htmlFor="Comments" className="tab-form-label text-nowrap" style={{ marginRight: "3px" }}>
                                Comments
                              </label>
                            </div>
                            <div className="col-11 d-flex tab-form-row-gap">
                              <textarea
                                type="text"
                                rows="1"
                                className="form-control  py-1 new-input"
                                style={{ height: "auto", overflowY: "scroll" }}
                                placeholder="Comment"
                                name="Comments"
                                value={incidentFormValues.Comments}
                                onChange={(e) => {
                                  handleInputChangeIncident(e)
                                  e.target.style.height = "auto";
                                  const maxHeight = 1 * parseFloat(getComputedStyle(e.target).lineHeight);
                                  e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                }}
                              />
                            </div>
                          </div>

                          {/* Row 7 */}
                          <div className="tab-form-row">
                            <div className="col-1 d-flex align-self-center justify-content-end">
                              <label htmlFor="Flags" className="tab-form-label text-nowrap" style={{ textAlign: "end", marginRight: "4px" }}>Flags</label>
                            </div>
                            <div className="col-11 d-flex tab-form-row-gap" style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}>

                              {/* 24 Hr and Premise History Button */}
                              {flagBudgeList?.Table?.map((item, index) => {
                                const buttons = [];

                                if (item?.Is24HourFlag === 1 && !isQueueCall) {
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

                                if (item?.PremiseFlag === 1 && !isQueueCall) {
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
                              {/* Flag List */}
                              {flagBudgeList?.Table1?.map((item, index) => {
                                return (
                                  <button
                                    key={index}
                                    type="button"
                                    style={{
                                      backgroundColor: item?.PriorityColor || "#0000",
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
                              })}
                              {/* Add flag button */}
                              <div
                                className="d-flex align-items-center"
                                style={{
                                  marginLeft: "8px", // Add spacing to separate from other elements
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
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          {isMapVisible && isLoaded ? (
                            <GoogleMap
                              mapContainerStyle={{
                                height: "275px",
                                width: "100%",
                              }}
                              zoom={zoom}
                              center={mapCenter}
                              onLoad={handleMapLoad}
                              onZoomChanged={() => {
                                if (mapRef.current) {
                                  setZoom(mapRef.current.getZoom());
                                }
                              }}
                            >
                              {locations?.map((location, index) => (
                                <Marker
                                  key={index}
                                  position={{
                                    lat: location.lat,
                                    lng: location.lng,
                                  }}
                                  icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 10,
                                    fillColor: getColorByStatus(
                                      location.status
                                    ),
                                    fillOpacity: 1,
                                    strokeWeight: 1,
                                  }}
                                  title={location.name}
                                  onClick={() =>
                                    console.warn(`Location: ${location.name}`)
                                  }
                                />
                              ))}
                            </GoogleMap>
                          ) : (
                            <p>Loading Map...</p>
                          )}
                        </div>
                      </div>
                    </fieldset>
                    <div className="row">
                      {/* Unit */}
                      <div className="col-4">
                        <fieldset className="tab-form-container">
                          <legend className="cad-legend">Unit</legend>
                          <div className="tab-form-row">
                            <div
                              className="col-12 d-flex align-items-center justify-content-start select-container mr-1"
                              style={{ gap: "4.5px" }}
                            >
                              <div>
                                <label htmlFor="Unit" className="tab-form-label text-nowrap" style={{ textAlign: "end", marginRight: "15px", marginLeft: "20px" }}> Unit # {errorCallTaker.Resource1 && isEmptyObject(incidentFormValues.Resource1) && (
                                  <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select  Unit #"}</p>
                                )}</label>
                              </div>
                              <div className="w-auto" style={{ minWidth: "250px" }}>
                                <Select
                                  isClearable
                                  options={resourceDropDown}
                                  placeholder="Select..."
                                  name="Resource1"
                                  value={incidentFormValues?.Resource1}
                                  getOptionLabel={(v) => v?.ResourceNumber}
                                  getOptionValue={(v) => v?.ResourceID}
                                  isDisabled={!incidentFormValues.CallforServiceID}
                                  onChange={handleSelectChangeIncident}
                                  styles={customStylesWithOutColorArrow}
                                  maxMenuHeight={145}
                                  onInputChange={(inputValue, actionMeta) => {
                                    if (inputValue.length > 12) {
                                      return inputValue.slice(0, 12);
                                    }
                                    return inputValue;
                                  }}
                                  isMulti
                                  isSearchable={true}
                                />
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      {/* Doc */}
                      <div className="col-8">
                        <fieldset className="tab-form-container">
                          <legend className="cad-legend">Document</legend>
                          <div className="tab-form-row">
                            <div className="col-5 d-flex tab-form-row-gap">
                              <div className="d-flex align-self-center justify-content-end">
                                <label
                                  htmlFor="DocumentName"
                                  className="tab-form-label text-nowrap"
                                >
                                  Document Name
                                </label>
                              </div>
                              <input
                                type="text"
                                value={docCallTaker.DocumentName}
                                name="DocumentName"
                                onChange={(e) => {
                                  handleDocCallTaker("DocumentName", e.target.value); setIsChangeFields(true);
                                }}
                                autoComplete="off"
                                className="form-control  py-1 new-input "
                              // onKeyDown={handleTextKeyDown}
                              />
                            </div>
                            <div className="col-7 d-flex tab-form-row-gap">
                              <label htmlFor="FileAttachment" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">File Attachment</label>
                              <div className="col-8 text-field mt-0">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv, 'text/plain'"
                                  // multiple
                                  onChange={handleImageChange}
                                  ref={fileInputRef}
                                />
                                {/* <input type="file" className='requiredColor' name='File' onChange={handleImageChange} required /> */}


                              </div>
                              <div className="col-2 d-flex">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-border"
                                  onClick={addDoc}
                                  disabled={!docCallTaker?.DocumentName}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    {/* Name */}
                    <fieldset className="tab-form-container">
                      <legend className="cad-legend">Name</legend>
                      <div className="tab-form-row">
                        <div className="col-10 d-flex tab-form-row-gap">
                          <div className="d-flex align-self-center justify-content-end">
                            <label
                              htmlFor="LastName"
                              className="tab-form-label text-nowrap"
                            >
                              Last Name
                            </label>
                          </div>
                          <input
                            type="text"
                            value={nameCallTaker.LastName}
                            name="LastName"
                            onChange={(e) => {
                              handleNameCallTaker("LastName", e.target.value); setIsChangeFields(true);
                            }}
                            autoComplete="off"
                            className="form-control  py-1 new-input  ml-2"
                            onKeyDown={handleTextKeyDown}
                          />{" "}
                          <div className="d-flex align-self-center justify-content-end">
                            <label htmlFor="FirstName" className="new-label text-nowrap tab-form-label">
                              First Name
                            </label>
                          </div>
                          <input
                            type="text"
                            autoComplete="off"
                            className="form-control py-1 new-input"
                            name="FirstName"
                            value={nameCallTaker.FirstName}
                            onChange={(e) => { handleNameCallTaker("FirstName", e.target.value); setIsChangeFields(true); }}
                            onKeyDown={handleTextKeyDown}
                          />

                          <div className=" d-flex align-self-center justify-content-end">
                            <label
                              htmlFor="ReasonCode"
                              className="tab-form-label text-nowrap">
                              Reason Code {errorNameCallTaker.NameReasonCodeID && nameCallTaker?.NameReasonCodeID?.length === 0 && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select  Reason Code"}</p>
                              )}</label>

                          </div>
                          {/* styles={customStylesWithOutColorArrow} */}
                          <Select
                            isClearable
                            options={reasonCodeDropDown}
                            placeholder="Select..."
                            className="w-100"
                            name="NameReasonCodeID"
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={true}
                            allowSelectAll={true}
                            value={reasonCodeDropDown.filter(option => nameCallTaker.NameReasonCodeID.includes(option.value))}
                            onChange={handleSelectIncidentName}
                            menuPlacement="top"
                            onInputChange={(inputValue, actionMeta) => {
                              if (inputValue.length > 12) {
                                return inputValue.slice(0, 12);
                              }
                              return inputValue;
                            }}
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                backgroundColor: !isEmpty(nameCallTaker?.FirstName) || !isEmpty(nameCallTaker?.LastName) ? "#fce9bf" : "#fff",
                                height: '40px',
                                minHeight: '40px',
                                overflowY: 'hidden',
                                overflowX: 'hidden'
                              }),
                              valueContainer: (provided) => ({
                                ...provided,
                                height: 'auto',
                                maxHeight: '40px',
                                overflowY: 'auto',
                                padding: '0 8px',
                              }),
                              dropdownIndicator: (base, state) => ({
                                ...base,
                                transition: "all .2s ease",
                                transform: state.selectProps.menuIsOpen ? null : "rotate(180deg)"
                              }),
                              input: (provided) => ({
                                ...provided,
                                minWidth: '0px',
                                maxWidth: '100%',
                              }),
                            }}
                          />


                        </div>
                        <div
                          className="col-2 d-flex w-100"
                          style={{ gap: "3px" }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-border w-25"
                            onClick={addName}
                            disabled={!isNameCallTakerData}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                          <button type="button" disabled={!isNameCallTakerData} data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-CADprimary w-100 d-flex align-items-center justify-content-center"
                            onClick={() => {
                              onNameSearch();
                            }}
                          >
                            <i className="fa fa-search mr-2"></i>
                            <span>Search</span>
                          </button>
                          {CADCallTakerNCIC && (
                            <button
                              className="btn btn-sm btn-border w-25"
                              data-toggle="modal"
                              data-target="#NCICModal"
                              // style={{ width: "8%" }}
                              onClick={() => {
                                setOpenNCICModal(true);
                                setIsNameCallTaker(true);
                              }}
                            // disabled={!isNameCallTakerData}
                            >
                              NCIC
                            </button>
                          )}
                        </div>
                      </div>
                      {nameAlertData?.length > 0 && <div className="col-10 d-flex tab-form-row-gap">
                        <div className="d-flex align-self-center justify-content-end ml-4 mr-2">
                          <label
                            htmlFor="Alerts"
                            className="tab-form-label text-nowrap"
                          >
                            Alerts
                          </label>
                        </div>
                        {nameAlertData?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)?.map((alert) => (
                          <span style={{ margin: "0 2px 0 2px", padding: "1px 4px 1px 4px", border: "1px solid", background: `${alert?.BackColor}`, color: alert?.BackColor && alert?.ForeColor, cursor: "pointer" }}>{alert?.AlertType}</span>
                        ))}
                      </div>}
                    </fieldset>

                    {/* Vehicle */}
                    <fieldset className="tab-form-container">
                      <legend className="cad-legend">Vehicle</legend>
                      <div className="tab-form-row">
                        <div className="col-10 d-flex tab-form-row-gap">
                          <div className="col d-flex align-self-center justify-content-end" style={{ marginLeft: "8px" }}>
                            <label htmlFor="Plate" className="tab-form-label new-label text-nowrap">
                              Plate #
                            </label>
                          </div>
                          <input
                            type="text"
                            name="Plate"
                            autoComplete="off"
                            maxLength={8}
                            value={vehicleCallTaker.Plate}
                            onChange={(e) => {
                              let ele = e.target.value.replace(/[^0-9a-zA-Z]/g, "")
                              const checkNumber = ele.toUpperCase();
                              handleVehicleCallTaker("Plate", checkNumber)
                            }}
                            className="form-control  py-1 new-input ml-2"
                            onKeyDown={handleNumberTextKeyDown}
                            menuPlacement="top"
                          />
                          <div className=" d-flex align-self-center justify-content-end">
                            <label
                              htmlFor="State"
                              className="tab-form-label text-nowrap"
                            >
                              State
                            </label>
                          </div>
                          <Select
                            isClearable
                            options={stateList}
                            placeholder="Select..."
                            styles={customStylesWithOutColorArrow}
                            className="w-100"
                            name="StateCode"
                            value={vehicleCallTaker.StateCode ? stateList?.find((i) => i?.value === parseInt(vehicleCallTaker.StateCode)) : ""}
                            onChange={handleSelectIncidentVehicle}
                            menuPlacement="top"
                            onInputChange={(inputValue, actionMeta) => {
                              if (inputValue.length > 12) {
                                return inputValue.slice(0, 12);
                              }
                              return inputValue;
                            }}
                          />
                          <div className=" d-flex align-self-center justify-content-end">
                            <label
                              htmlFor="PlateType"
                              className="tab-form-label text-nowrap"
                            >
                              Plate Type
                            </label>
                          </div>
                          <Select
                            isClearable
                            options={plateTypeIdDrp}
                            placeholder="Select..."
                            name="PlateTypeCode"
                            value={vehicleCallTaker.PlateTypeCode ? plateTypeIdDrp?.find((i) => i?.value === parseInt(vehicleCallTaker.PlateTypeCode)) : ""}
                            onChange={handleSelectIncidentVehicle}
                            styles={customStylesWithOutColorArrow}
                            className="w-100"
                            menuPlacement="top"
                            onInputChange={(inputValue, actionMeta) => {
                              if (inputValue.length > 12) {
                                return inputValue.slice(0, 12);
                              }
                              return inputValue;
                            }}
                          />
                          <div className=" d-flex align-self-center justify-content-end">
                            <label
                              htmlFor="TagYear"
                              className="tab-form-label text-nowrap"
                            >
                              Tag Year
                            </label>
                          </div>
                          <Select
                            isClearable
                            options={tagYearDropDown}
                            placeholder="Select..."
                            name="TagYear"
                            value={vehicleCallTaker.TagYear ? tagYearDropDown?.find((i) => i.value === parseInt(vehicleCallTaker.TagYear)) : ""}
                            onChange={handleSelectIncidentVehicle}
                            styles={customStylesWithOutColorArrow}
                            className="w-100"
                            menuPlacement="top"
                            onInputChange={(inputValue, actionMeta) => {
                              if (inputValue.length > 12) {
                                return inputValue.slice(0, 12);
                              }
                              return inputValue;
                            }}
                          />
                        </div>
                        <div
                          className="col-2 d-flex w-100"
                          style={{ gap: "3px" }}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-border w-25"
                            onClick={addVehicle}
                            disabled={!isVehicleCallTakerData}
                          >
                            <i className="fa fa-plus"></i>
                          </button>
                          <button type="button" disabled={!isVehicleCallTakerData} data-toggle="modal" data-target="#SearchModal" className="btn btn-sm btn-CADprimary w-100 d-flex align-items-center justify-content-center"
                            onClick={() => setIsOpenVehicleSearchModel(true)}
                          >
                            <i className="fa fa-search mr-2"></i>
                            <span>Search</span>
                          </button>
                          {CADCallTakerNCIC && (
                            <button
                              className="btn btn-sm btn-border w-25"
                              data-toggle="modal"
                              data-target="#NCICModal"
                              // style={{ width: "8%" }}
                              onClick={() => {
                                setOpenNCICModal(true);
                              }}
                            // disabled={!isNameCallTakerData}
                            >
                              NCIC
                            </button>
                          )}
                        </div>
                      </div>
                      {vehicleAlertData?.length > 0 && <div className="col-10 d-flex tab-form-row-gap">
                        <div className="d-flex align-self-center justify-content-end ml-4 mr-2">
                          <label
                            htmlFor="Alerts"
                            className="tab-form-label text-nowrap"
                          >
                            Alerts
                          </label>
                        </div>
                        {vehicleAlertData?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)?.map((alert) => (
                          <span style={{ margin: "0 2px 0 2px", padding: "1px 4px 1px 4px", border: "1px solid", background: `${alert?.BackColor}`, color: alert?.BackColor && alert?.ForeColor, cursor: "pointer" }}>{alert?.AlertType}</span>
                        ))}
                      </div>}
                    </fieldset>

                  </fieldset>
                </div>
              </div>

              {/* Shortcut key and Buttons */}
              <div
                className="tab-form-row d-flex align-content-center justify-content-between px-3 pb-2"
                style={{
                  // position: "sticky",
                  // bottom: "0",
                  zIndex: 100,
                  marginBottom: "0",
                }}
              >
                <div className="col-7 d-flex tab-form-row-gap justify-content-start ">
                  {CADCallTakerDispatch && (
                    <button type="button"
                      className={`btn btn-sm w-25 bg-white btn-border`}
                      disabled={isDispatchLoading}
                      onClick={() => {
                        handleOnSave(false);
                      }}
                    >
                      <div style={{ display: "grid" }}>
                        <span>Dispatch</span>
                      </div>
                    </button>
                  )}
                  {CADCallTakerRoute && (
                    <button type="button"
                      className={`btn btn-sm w-25 bg-white btn-border`}
                      disabled={isRouteLoading || incidentFormValues?.Resource1?.length !== 0}
                      onClick={() => {
                        handleOnSave(true);
                      }}
                    >
                      <div style={{ display: "grid" }}>
                        <span>Route</span>
                      </div>
                    </button>
                  )}
                  {CADCallTakerLocation && (
                    <button
                      type="button"
                      className={`btn btn-sm w-25 bg-white ${selectedButton.includes(3) ? 'btn-border-selected' : 'btn-border'}`}
                      data-toggle="modal"
                      data-target="#LocationInformationModal"
                      onClick={() => {
                        setSelectedButton(prevSelected =>
                          prevSelected.includes(3)
                            ? prevSelected.filter(item => item !== 3)
                            : [...prevSelected, 3]
                        );
                        setOpenLocationInformationModal(true);
                      }}
                      disabled={!geoFormValues?.location}
                    >
                      <div style={{ display: "grid" }}>
                        <span>Location</span>
                      </div>
                    </button>
                  )}
                  {CADCallTakerContact && (
                    <button
                      type="button"
                      className={`btn btn-sm w-25 bg-white ${selectedButton.includes(5) ? 'btn-border-selected' : contactList?.length > 0 ? 'btn-border-contact' : 'btn-border'}`}
                      data-toggle="modal"
                      data-target="#ContactInfoModal"
                      onClick={() => {
                        setSelectedButton(prevSelected =>
                          prevSelected.includes(5)
                            ? prevSelected.filter(item => item !== 5)
                            : [...prevSelected, 5]
                        );
                        setOpenContactInfoModal(true);
                      }}
                      disabled={!geoFormValues?.location}
                    >
                      <div style={{ display: "grid" }}>
                        <span>Contact</span>
                      </div>
                    </button>
                  )}
                  {CADCallTakerCloseCall && (
                    <button
                      type="button"
                      className={`btn btn-sm w-25 bg-white ${selectedButton.includes(6) ? 'btn-border-selected' : 'btn-border'}`}
                      data-toggle="modal"
                      data-target="#CloseCallModal"
                      onClick={() => handleOpenCloseCall()}
                      disabled={isCallAPI}
                    >
                      <div style={{ display: "grid" }}>
                        <span>Close Call</span>
                      </div>
                    </button>
                  )}
                  {!incNo && CADCallTakerQueueCall && (
                    <button
                      type="button"
                      className={`btn btn-sm w-25 bg-white ${selectedButton.includes(7) ? 'btn-border-selected' : 'btn-border'}`}
                      data-toggle="modal"
                      data-target="#CloseCallModal"
                      onClick={() => handleQueueCall()}
                      disabled={!geoFormValues?.location || incidentFormValues?.Resource1?.length > 0 || isCallAPI}
                    >
                      <div style={{ display: "grid" }}>
                        <span>Queue Call</span>
                      </div>
                    </button>
                  )}
                  {/* <button type="button"
                    className={`btn btn-sm w-25 bg-white ${selectedButton.includes(6) ? 'btn-border-selected' : 'btn-border'}`}
                    onClick={() => {
                      setSelectedButton(prevSelected =>
                        prevSelected.includes(6)
                          ? prevSelected.filter(item => item !== 6)
                          : [...prevSelected, 6]
                      );
                    }}
                  >
                    <div style={{ display: "grid" }}>
                      <span>Location Flag</span>
                    </div>
                  </button> */}
                </div>
                <div className="col-5 d-flex justify-content-end tab-form-row-gap">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      if (isChangeFields) {
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
        </div>
      ) : (
        <> </>
      )}
      <ModalConfirm showModal={showConfirmModal} setShowModal={setShowConfirmModal} confirmAction="close" handleConfirm={handleCloseConfirm} />
      {isOpenSearchNameModel && <NameSearchModal {...{ isOpenSearchNameModel, setIsOpenSearchNameModel, nameCallTaker, setNameCallTaker }} />}
      {openCloseCallModal && <CloseCallModal {...{ openCloseCallModal, setOpenCloseCallModal, setSelectedButton, getResourceValues, incidentFormValues, createPayload, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID, insertIncident, setNameData, setVehicleData, onCloseLocation, incNo, refetchQueueCall, setDocData }} />}
      {isOpenVehicleSearchModel && <VehicleSearchModal {...{ isOpenVehicleSearchModel, setIsOpenVehicleSearchModel, vehicleCallTaker, setVehicleCallTaker }} />}
      {openContactInfoModal && <ContactInfoModal {...{ openContactInfoModal, setOpenContactInfoModal, setSelectedButton, contactList, setContactList, isGoogleLocation }} />}
      {openFlagTableModal && <FlagTableModal {...{ openFlagTableModal, setOpenFlagTableModal, geoLocationID, flagName, aptData }} />}
      {openAddFlagModal && <FlagModal {...{ openAddFlagModal, setOpenAddFlagModal, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID, insertIncident, getFlagListRefetch, selectedFlagData, setSelectedFlagData, aptData, setAptData, refetchAptSuiteNoData }} />}
      <LocationInformationModal {...{ openLocationInformationModal, setOpenLocationInformationModal, setSelectedButton, geoFormValues, setGEOFormValues, isGoogleLocation, createLocationPayload, isVerifyLocation, geoLocationID, isCheckGoogleLocation, setIsVerifyReportedLocation }} />
      {openDuplicateCallModal && <DuplicateCallModal {...{ openDuplicateCallModal, setOpenDuplicateCallModal, duplicateCallData, getResourceValues, createPayload, isGoogleLocation, createLocationPayload, geoLocationID, setGeoLocationID, insertIncident, setNameData, setVehicleData, onCloseLocation, receiveSourceDropDown, incidentFormValues }} />}

      <NCICModal {...{ openNCICModal, setOpenNCICModal, isNameCallTaker, setIsNameCallTaker }} />

    </>
  );
};

// PropTypes definition
CallTakerModal.propTypes = {
  openCallTakerModal: PropTypes.bool.isRequired,
  setCallTakerModal: PropTypes.func.isRequired,
  isIncidentDispatch: PropTypes.bool.isRequired,
  setIsIncidentDispatch: PropTypes.func.isRequired,
  setIncNo: PropTypes.func,
  incNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refetchQueueCall: PropTypes.func,
  isQueueCall: PropTypes.bool
};

// Default props
CallTakerModal.defaultProps = {
  setIncNo: () => { },
  incNo: null,
  refetchQueueCall: () => { },
  isQueueCall: false,
  openCallTakerModal: false,
  setCallTakerModal: () => { },
  isIncidentDispatch: false,
  setIsIncidentDispatch: () => { }
};

export default memo(CallTakerModal);
