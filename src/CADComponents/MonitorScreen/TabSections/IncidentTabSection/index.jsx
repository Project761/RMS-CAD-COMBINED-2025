import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";
import { colorLessStyle_Select } from '../../../Utility/CustomStylesForReact';
import MapComponent from "../../../MapComponent";
import { useLocation, useNavigate } from "react-router-dom";
import MonitorServices from '../../../../CADServices/APIs/monitor'
import GeoServices from "../../../../CADServices/APIs/geo";
import MasterTableListServices from '../../../../CADServices/APIs/masterTableList'
import { base64ToString, filterPassedTime, getShowingMonthDateYear } from "../../../../Components/Common/Utility";
import { useQuery } from 'react-query';
import useObjState from "../../../../CADHook/useObjState";
import { dropDownDataModel, dropDownDataModelForAptNo, isEmpty } from "../../../../CADUtils/functions/common";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import Location from "../../../Common/Location";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { toastifySuccess } from "../../../../Components/Common/AlertMsg";
import classNames from "classnames";
import { IncidentContext } from "../../../../CADContext/Incident";
import CallTakerServices from "../../../../CADServices/APIs/callTaker";
import FlagTableModal from "../../../FlagTableModal";
import CreatableSelect from "react-select/creatable";
import FlagModalViewInc from "../../../FlagMaster/FlagModalViewInc";
import LocationInformationModal from "../../../LocationInformationModal";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getData_DropDown_Priority } from "../../../../CADRedux/actions/DropDownsData";

const IncidentTabSection = (props) => {
  const dispatch = useDispatch();
  const { isViewEventDetails = false } = props;
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
  const { setAgencyName, agnecyName, GetDataTimeZone, datezone } = useContext(AgencyContext);

  const { resourceRefetch, incidentRefetch } = useContext(IncidentContext);
  const navigate = useNavigate();
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [locationStatus, setLocationStatus] = useState(false);
  const [IsChangeData, setIsChangeData] = useState(false);
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [CFSDropDown, setCFSDropDown] = useState([]);
  const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
  const [locationData, setLocationData] = useState();
  const [userName, setUserName] = useState("");
  const [flagBudgeList, setFlagBudgeList] = useState([]);
  const [flagName, setFlagName] = useState("");
  const [selectedFlagData, setSelectedFlagData] = useState({});
  const [openFlagTableModal, setOpenFlagTableModal] = useState(false);
  const [openAddFlagModalViewInc, setOpenAddFlagModalViewInc] = useState(false);
  const [isCheckGoogleLocation, setIsCheckGoogleLocation] = useState(false)
  const [aptInputValue, setAptInputValue] = useState("");
  const [aptData, setAptData] = useState("");
  const [emsZoneDropDown, setEmsZoneDropDown] = useState([]);
  const [fireZoneDropDown, setFireZoneDropDown] = useState([]);
  const [otherZoneDropDown, setOtherZoneDropDown] = useState([]);
  const [openLocationInformationModal, setOpenLocationInformationModal] = useState(false);
  const [geoZoneDropDown, setGeoZoneDropDown] = useState([]);

  const originalIncidentState = useRef({});
  const [
    incidentState,
    setIncidentState,
    handleIncidentState,
    ,
  ] = useObjState({
    IncidentId: "",
    MasterIncident: "",
    Case: "",
    ReportedDateTime: "",
    OccurredDateTime: "",
    ReceiveSource: "",
    ReceiveSource1: "",
    PrimaryOfficer: "",
    SecondaryOfficer: "",
    commonPlaceName: "",
    intersection1: "",
    intersection2: "",
    CFSLId: "",
    CFSLDesc: "",
    CFSLPriority: "",
    location: "",
    ReportedApartmentNo: "",
    coordinateY: "",
    coordinateX: "",
    FoundLocation: "",
    FoundCFSCodeID: "",
    FoundCFSLDesc: "",
    FoundPriorityID: "",
    FoundApartmentNo: "",
    Latitude: "",
    Longitude: "",
    GEOID: "",
    Id: "",
    isVerify: false,
    isVerifyReportedLocation: 0,
    isVerifyFoundLocation: 0,
    patrolZone: null,
    emsZone: null,
    fireZone: null,
    otherZone: null,
  })

  const [
    errorIncidentTab,
    ,
    handleErrorIncidentTab,
    clearStateIncidentTab,
  ] = useObjState({
    FoundLocation: false,
    FoundApartmentNo: false,
  });

  const startRef = React.useRef();

  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      setAgencyName(localStoreData?.Agency_Name);
      setUserName(localStoreData?.UserName);
      GetDataTimeZone(localStoreData?.AgencyID);
      if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
    }
  }, [localStoreData]);

  const useRouteQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };
  const query = useRouteQuery();

  let IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const getSingleIncidentKey = `/CAD/Monitor/MonitorIncidentByID`;
  const { data: singleIncidentData, isSuccess: isFetchSingleIncidentData, refetch: refetchSingleIncidentData } = useQuery(
    [getSingleIncidentKey, {
      IncidentID: IncID, AgencyID: loginAgencyID,
    }],
    MonitorServices.getSingleIncident,
    {
      refetchOnWindowFocus: false,
      enabled: !!IncID && !!loginAgencyID,
    }
  );

  useEffect(() => {
    if (singleIncidentData && isFetchSingleIncidentData && !isSelectLocation) {
      const parsedData = JSON.parse(singleIncidentData?.data?.data)?.Table || [];
      const initialData = {
        IncidentId: parsedData[0]?.CADIncidentNumber,
        MasterIncident: parsedData[0]?.MasterIncidentNumber,
        Case: parsedData[0]?.IncidentNumber,
        ReportedDateTime: parsedData[0]?.ReportedDate ? getShowingMonthDateYear(parsedData[0]?.ReportedDate) : "",
        OccurredDateTime: parsedData[0]?.OccurredFrom,
        ReceiveSource: parsedData[0]?.Source,
        commonPlaceName: parsedData[0]?.CommonPlace,
        CFSLPriority: parsedData[0]?.ReportedPriorityID,
        PrimaryOfficer: parsedData[0]?.Officer1,
        SecondaryOfficer: parsedData[0]?.Officer2,
        intersection1: parsedData[0]?.InterDirectionPrefix,
        intersection2: parsedData[0]?.InterDirectionSufix,
        CFSLId: parsedData[0]?.ReportedCFSCodeID,
        CFSLDesc: parsedData[0]?.ReportedCFSCodeID,
        location: parsedData[0]?.ReportedLocation,
        coordinateX: parsedData[0]?.Longitude,
        coordinateY: parsedData[0]?.Latitude,
        ReportedApartmentNo: parsedData[0]?.ReportdApartmentNo,
        FoundLocation: parsedData[0]?.FoundLocation || "",
        FoundCFSCodeID: parsedData[0]?.FoundCFSCodeID || "",
        FoundCFSLDesc: parsedData[0]?.FoundCFSCodeID || "",
        FoundPriorityID: parsedData[0]?.FoundPriorityID || "",
        FoundApartmentNo: parsedData[0]?.FoundApartmentNo || "",
        GEOID: parsedData[0]?.GEOID || "",
        Id: parsedData[0]?.FoundGEOID || "",
        ReportdApartmentNoId: parsedData[0]?.ReportdApartmentNoId || "",
        FoundApartmentNoId: parsedData[0]?.FoundApartmentNoId || "",
        isVerifyReportedLocation: parsedData[0]?.isVerifyReportedLocation || 0,
        isVerifyFoundLocation: parsedData[0]?.isVerifyFoundLocation || 0
      };
      if (parsedData[0]?.FoundLocation) {
        const getAptData = aptSuiteNoDropDown.find(
          (option) => option?.value === parsedData[0]?.FoundApartmentNo
        );
        // boloState?.TypeOfBolo ? typeOFBOLO?.find((i) => i?.BoloTypeID == boloState?.TypeOfBolo) : ""
        setAptData(getAptData);
      }
      originalIncidentState.current = { ...initialData };
      setIncidentState(initialData);
    }
  }, [singleIncidentData, isFetchSingleIncidentData]);

  const isValidZone = (zone) => zone && Object.keys(zone).length > 0;

  const isVerifyLocation =
    incidentState.isVerify &&
    isValidZone(incidentState.patrolZone) &&
    isValidZone(incidentState.emsZone) &&
    isValidZone(incidentState.fireZone) &&
    isValidZone(incidentState.otherZone);

  useEffect(() => {
    // const getAptData = aptSuiteNoDropDown.find(
    //   (option) => option?.value === incidentState?.FoundApartmentNo
    // );

    if (incidentState?.FoundLocation) {
      const getAptData = aptSuiteNoDropDown.find((option) => {
        if (!incidentState?.FoundApartmentNo) {
          // If incidentState?.FoundApartmentNo is empty or null, match options where value is also empty or null
          return option?.value === "" || option?.value === null;
        }
        // Otherwise, match normally
        return option?.value === incidentState?.FoundApartmentNo;
      });
      setAptData(getAptData);
    }
  }, [aptSuiteNoDropDown, incidentState?.FoundApartmentNo])

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
    if (incidentState?.FoundLocation === (null || "") && incidentState.location) {
      setAptData({ value: incidentState.ReportedApartmentNo, label: incidentState.ReportedApartmentNo, aptId: incidentState.ReportdApartmentNoId });

    }
  }, [incidentState?.FoundLocation, incidentState.location])

  useEffect(() => {
    const fieldsToCheck = [
      "OccurredDateTime",
      "FoundApartmentNo",
      "FoundLocation",
      "FoundCFSCodeID",
      "FoundCFSLDesc",
      "FoundPriorityID"
    ];

    const hasChanges = fieldsToCheck.some(key => {
      const currentValue = incidentState[key];
      const originalValue = originalIncidentState.current[key];

      // Normalize values: treat null, undefined, and "" as "empty"
      const normalizedCurrentValue = (currentValue == null || currentValue === "") ? "" : currentValue;
      const normalizedOriginalValue = (originalValue == null || originalValue === "") ? "" : originalValue;

      return normalizedCurrentValue !== normalizedOriginalValue;
    });

    setIsChangeData(hasChanges);
  }, [incidentState]);

  useEffect(() => {
    if (!incidentState?.FoundLocation && singleIncidentData) {
      const parsedData = JSON.parse(singleIncidentData?.data?.data)?.Table || [];
      handleIncidentState("coordinateX", parsedData[0]?.Longitude)
      handleIncidentState("coordinateY", parsedData[0]?.Latitude)
    }
  }, [incidentState?.FoundLocation, singleIncidentData])

  const geoLocationID = incidentState?.FoundLocation
    ? incidentState?.Id
    : incidentState?.GEOID;

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
      enabled: !!loginAgencyID
    }
  );
  const flagPayload = {
    AptID: aptData?.aptId,
    FlagFromId: incidentState?.FoundLocation
      ? incidentState?.Id
      : incidentState?.GEOID,
    FlagFrom: "GEO",
    AgencyID: loginAgencyID,
    IncidentID: IncID,
    Action: "Get_All",
  };

  const getFlagListKey = `/CAD/Flag/GetFlag`;
  const { data: getFlagList, refetch: getFlagListRefetch, isSuccess: isFetchGetFlagList } = useQuery(
    [getFlagListKey, { flagPayload }],
    CallTakerServices.getFlag,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!flagPayload?.FlagFromId && !!incidentState.ReportedDateTime && !isEmpty(aptData?.aptId),
    }
  );

  const aptSuiteNoPayload = {
    // PINID: 0,
    // IsActive: 1,
    // IsSuperAdmin: 1,
    // AgencyID: loginAgencyID,
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
      enabled: !!incidentState?.Id
    }
  );

  // useEffect(() => {
  //   if (isFetchAptSuiteNoData && !isCheckGoogleLocation && aptSuiteNoData && isSelectLocation && incidentState?.Id && incidentState?.FoundLocation) {
  //     const data = JSON.parse(aptSuiteNoData?.data?.data);
  //     setAptSuiteNoDropDown(dropDownDataModel(data?.Table, "Description", "Description"));
  //   } else {
  //     setAptSuiteNoDropDown([])
  //     setIncidentState((prevState) => ({
  //       ...prevState,
  //       FoundApartmentNo: "",
  //     }));
  //   }
  // }, [isFetchAptSuiteNoData, aptSuiteNoData, incidentState?.Id, incidentState?.FoundLocation]);

  useEffect(() => {
    if (isFetchAptSuiteNoData && aptSuiteNoData?.data?.data && incidentState?.Id && incidentState?.FoundLocation) {
      const parsedData = JSON.parse(aptSuiteNoData.data.data || "{}");
      setAptSuiteNoDropDown(parsedData?.Table?.length ? dropDownDataModelForAptNo(parsedData.Table, "Description", "Description", "AptID") : []);
    } else {
      setAptInputValue("");
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, incidentState?.Id && incidentState?.FoundLocation]);

  useEffect(() => {
    if (!incidentState?.FoundLocation) {
      setIncidentState((prevState) => ({
        ...prevState,
        FoundApartmentNo: "",
      }));
      setAptSuiteNoDropDown([]);
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, incidentState?.Id && incidentState?.FoundLocation]);

  const defaultOption = aptSuiteNoDropDown.find(
    (option) => option?.aptId && !option?.value && !option?.label
  );

  useEffect(() => {
    if ((aptData && (aptData.value === "" || aptData.value === null)) &&
      (aptData.label === "" || aptData.label === null) &&
      defaultOption && !incidentState?.FoundApartmentNo && incidentState?.FoundLocation) {
      setAptData({ value: '', label: '', aptId: defaultOption.aptId });
    }
  }, [aptSuiteNoDropDown]);

  // const handleSelectAptSuitNo = (selectedOption, { name }) => {
  //   setIncidentState((prevState) => ({
  //     ...prevState,
  //     [name]: selectedOption?.value || "",
  //   }));
  //   setIsChangeData(true);
  // };

  const handleSelectAptSuitNo = (selectedOption, { name }) => {
    if (selectedOption) {

      setIncidentState((prevState) => ({
        ...prevState,
        [name]: selectedOption?.value || "",
      }));
      setAptData(selectedOption);
    } else if (defaultOption) {

      setIncidentState((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      setAptData({ value: '', label: '', aptId: defaultOption.aptId });
    } else {
      setIncidentState((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      setAptData({ value: '', label: '', aptId: '' });
    }
    setIsChangeData(true);
    setAptInputValue("")
  };

  const handleCreateOption = (aptInputValue) => {
    if (/^[a-zA-Z0-9]{1,4}$/.test(aptInputValue)) {
      const newOption = { value: aptInputValue, label: aptInputValue, aptId: "" };
      setAptSuiteNoDropDown((prev) => [...prev, newOption]);
      handleSelectAptSuitNo(newOption, { name: "FoundApartmentNo" });
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

  useEffect(() => {
    if ((incidentState?.GEOID || incidentState?.Id) && isFetchGetFlagList && getFlagList) {
      const data = JSON.parse(getFlagList?.data?.data) || [];
      setFlagBudgeList(data);
    } else {
      setFlagBudgeList([]);
      setSelectedFlagData({})
    }
  }, [isFetchGetFlagList, getFlagList, incidentState?.GEOID, incidentState?.Id, incidentState?.FoundLocation]);


  //  useEffect(() => {
  //   if (geoFormValues?.location && isSelectLocation && isFetchGetFlagList && getFlagList && (isEmptyObject(aptData) || (aptData && aptData?.aptId))) {
  //     const data = JSON.parse(getFlagList?.data?.data) || [];
  //     setFlagBudgeList(data);
  //   } else {
  //     setFlagBudgeList([]);
  //     setSelectedFlagData({})
  //   }
  // }, [isFetchGetFlagList, getFlagList, geoLocationID, aptData]);


  useEffect(() => {
    if (!incidentState?.FoundLocation) {
      setIncidentState((prevState) => ({
        ...prevState,
        Id: "",
      }));
    }

    const fetchLocationData = async () => {
      try {
        const response = await GeoServices.getLocationData({
          Location: incidentState?.FoundLocation,
          AgencyID: loginAgencyID
        });
        const data = JSON.parse(response?.data?.data)?.Table || [];
        setLocationData(data);

      } catch (error) {
        console.error("Error fetching location data:", error);
        setLocationData([]);
      }
    };

    if (incidentState?.FoundLocation) {
      fetchLocationData();
    }
  }, [incidentState?.FoundLocation, isSelectLocation]);


  useEffect(() => {
    if (isFetchCFSCodeData && CFSCodeData) {
      const parsedData = JSON.parse(CFSCodeData?.data?.data);
      setCFSDropDown(parsedData?.Table);
    }
  }, [isFetchCFSCodeData, CFSCodeData]);

  const validateGeoFormValues = () => {
    let isError = false;
    const keys = Object.keys(errorIncidentTab);
    keys.forEach((field) => {
      if (
        field === "FoundLocation" && incidentState.FoundApartmentNo &&
        (isEmpty(incidentState?.FoundLocation) || incidentState?.FoundLocation === null)) {
        handleErrorIncidentTab(field, true);
        isError = true;
      } else {
        handleErrorIncidentTab(field, false);
      }
    });
    return !isError;
  };

  const createLocationPayload = () => {
    const {
      Street = "", stDirection = "", stDirection2 = "", City = "",
      ZipCode = "", PremiseNo = "", ApartmentNo = "", commonPlaceName = "",
      premiseType = {}, coordinateX = "", coordinateY = "", mileMarker = "",
      AltStreet = "", intersection1 = "", intersection2 = "", patrolZone = {},
      emsZone = {}, fireZone = {}, otherZone = {}, IsVerify = "", location = "",
      currentFlag = []
    } = incidentState || {};

    return {

      Street, "DirectionPrefix": stDirection, "DirectionSufix": stDirection2,
      City, ZipCode, PremiseNo, ApartmentNo: incidentState?.FoundApartmentNo, "CommonPlace": commonPlaceName,
      "PremiseType": premiseType?.label || "", "Latitude": coordinateY, "Longitude": coordinateX,
      "MileMaker": mileMarker, AltStreet, "InterDirectionPrefix": intersection1,
      "InterDirectionSufix": intersection2, "PatrolZone": patrolZone?.label, "EMSZone": emsZone?.label,
      "FireZone": fireZone?.label, "OtherZone": otherZone?.label, IsVerified: IsVerify,
      location: incidentState?.FoundLocation, "CurrentFlage": currentFlag?.map(item => item?.label).join(", "),
      "GeoLocationContactsJson": JSON.stringify({ Contacts: [] }), "AgencyID": loginAgencyID,
      // "CreatedByUserFK": loginPinID
    };
  };

  async function handelSave() {
    if (!validateGeoFormValues()) return
    let newGeoLocationID = "";
    if (isCheckGoogleLocation && incidentState?.FoundLocation) {
      const locationPayload = createLocationPayload();
      const response = await GeoServices.insertLocation(locationPayload);
      if (response?.data?.success) {
        // if (!geoLocationID) {
        const data = JSON.parse(response?.data?.data);
        newGeoLocationID = data?.Table[0]?.GeoLocationID;
        setIncidentState((prevState) => ({
          ...prevState,
          Id: newGeoLocationID,
        }));

      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    const data = {
      IncidentID: IncID,
      FoundCFSCodeID: incidentState?.FoundCFSCodeID,
      FoundPriorityID: incidentState?.FoundPriorityID,
      FoundApartmentNo: incidentState?.FoundApartmentNo,
      FoundLocation: incidentState?.FoundLocation,
      Latitude: incidentState?.coordinateY,
      Longitude: incidentState?.coordinateX,
      OccurredFrom: incidentState?.OccurredDateTime,
      FoundGEOID: newGeoLocationID ? newGeoLocationID : incidentState?.Id || "",
      AgencyID: loginAgencyID,
    };

    try {
      const response = await MonitorServices.updateMonitorIncident(data);
      if (response?.status === 200) {
        toastifySuccess("Data Updated Successfully");
        resourceRefetch();
        incidentRefetch();
        setIsChangeData(false);
        setIsSelectLocation(false);
        clearStateIncidentTab();
        refetchSingleIncidentData();
        setIsCheckGoogleLocation(false);
        refetchAptSuiteNoData();
      }
    } catch (error) {
      console.error("Error saving resource type:", error);
    }
  }

  async function handelAddRMSIncident() {
    const data = {
      AgencyID: loginAgencyID,
      IncidentID: IncID,
    };
    try {
      const response = await MonitorServices.RMSIncidentNumberUpdate(data);
      if (response?.status == "200") {
        const rmsNo = JSON.parse(response?.data?.data)
        setIncidentState((prevState) => ({
          ...prevState,
          Case: rmsNo?.Table?.[0]?.RMSIncidentNumber,
        }));
      }
    } catch (error) {
      console.error("Error saving resource type:", error);
    }
  }

  return (
    <>
      <div className="tab-form-monitor-container section-body pt-1 p-1 bt">
        <div className="card CAD-bg-color">
          <div className="d-flex card-body">
            <div
              className="col-8"
              style={{ display: "grid", gap: "5px" }}
            >
              {/* Line 1*/}
              <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    CAD Event #
                  </label>
                </div>
                <div className="col-10 d-flex align-items-center justify-content-end" style={{ display: "grid", gap: "5px" }}>
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    placeholder="Incident #"
                    value={incidentState.IncidentId}
                    onChange={(v) => handleIncidentState("IncidentId", v.target.value)}
                    readonly=""
                  />
                  <label for="" className="tab-form-label text-nowrap">
                    Master Incident #
                  </label>
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    placeholder="Master Incident #"
                    value={incidentState.MasterIncident}
                    onChange={(v) => handleIncidentState("MasterIncident", v.target.value)}
                    readonly=""
                  />
                  {incidentState.Case ? <>
                    <label for="" className={classNames("tab-form-label text-nowrap")}>
                      {"RMS Incident #"}
                    </label>
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      placeholder="RMS Incident #"
                      value={incidentState.Case}
                      onChange={(v) => { handleIncidentState("Case", v.target.value); setIsChangeData(true); }}
                      readonly=""
                    /></>
                    :
                    <button
                      type="button"
                      className="save-button ml-2 text-nowrap"
                      onClick={() => { handelAddRMSIncident(); setIsChangeData(true); }}
                      disabled={isViewEventDetails}
                    >
                      {'Generate RMS Incident #'}
                    </button>
                  }
                </div>
              </div>

              {/* Line 2 */}
              <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    Reported Date & Time
                  </label>
                </div>
                <div className="col-10 d-flex align-items-center justify-content-end" style={{ display: "grid", gap: "5px" }}>
                  <input
                    className="form-control py-1 new-input requiredColor"
                    placeholder="Reported Date & Time"
                    value={incidentState.ReportedDateTime}
                    // onChange={(v) =>
                    //   handleIncidentState("ReportedDateTime", getShowingMonthDateYear(v.target.value))
                    // }
                    readOnly
                  />
                  <label for="" className="tab-form-label text-nowrap ml-3">
                    Occurred DT / TM
                  </label>
                  <div className="col-3">
                    <DatePicker
                      ref={startRef}
                      onKeyDown={(e) => {
                        if (!((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Delete' || e.key === ':' || e.key === '/' || e.key === ' ' || e.key === 'F5')) {
                          e.preventDefault();
                        } else {
                          onKeyDown(e);
                        }
                      }}
                      id="OccurredDateTime"
                      name="OccurredDateTime"
                      dateFormat="MM/dd/yyyy HH:mm"
                      onChange={(v) => {
                        handleIncidentState("OccurredDateTime", v ? getShowingMonthDateYear(v) : null);
                        setIsChangeData(true);
                      }}
                      filterTime={filterPassedTime}
                      selected={incidentState.OccurredDateTime ? new Date(incidentState.OccurredDateTime) : ""}
                      className="w-100"
                      timeInputLabel
                      showTimeSelect
                      minDate={new Date('1970-01-01')} // Set minDate for any valid past date
                      minTime={new Date().setHours(0, 0, 0, 0)} // Set minTime to 00:00
                      maxDate={incidentState.ReportedDateTime ? new Date(incidentState.ReportedDateTime) : ""}
                      maxTime={incidentState.ReportedDateTime ? new Date(incidentState.ReportedDateTime).setMilliseconds(0) : ""}
                      timeCaption="Time"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      showDisabledMonthNavigation
                      autoComplete="off"
                      timeIntervals={1}
                      timeFormat="HH:mm "
                      is24Hour
                    />
                  </div>
                  <label for="" className="tab-form-label text-nowrap">
                    Recv Source
                  </label>
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    placeholder="Recv Source"
                    value={incidentState.ReceiveSource}
                    onChange={(v) => handleIncidentState("ReceiveSource", v.target.value)}
                    readOnly
                  />
                </div>
              </div>

              {/* Line 3 */}
              <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    Call Taker
                  </label>
                </div>
                <div className="col-3 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    placeholder="Call Taker"
                    value={userName}
                    readOnly
                  />
                </div>
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    Common Place Name
                  </label>
                </div>
                <div className="col-5 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    placeholder="Common Place"
                    value={incidentState.commonPlaceName}
                    onChange={(v) => handleIncidentState("commonPlaceName", v.target.value)}
                    readOnly
                  />
                </div>
              </div>

              {/* Line 4 */}
              <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label text-nowrap">
                    Call Agency
                  </label>
                </div>
                <div className="col-3 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    placeholder="Call Agency"
                    value={agnecyName}
                    readOnly
                  />
                </div>
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    Intersection St/St
                  </label>
                </div>
                <div className="col-5 d-flex align-items-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input mr-1"
                    name="intersection1"
                    placeholder="Intersection St/St"
                    value={incidentState.intersection1}
                    onChange={(v) => handleIncidentState("intersection1", v.target.value)}
                    readOnly
                  />
                  {"/"}
                  <input
                    type="text"
                    className="form-control ml-1 py-1 new-input"
                    name="intersection2"
                    placeholder="Intersection St/St"
                    value={incidentState.intersection2}
                    onChange={(v) => handleIncidentState("intersection2", v.target.value)}
                    readOnly
                  />
                </div>
              </div>
              {/* Line 5 */}
              <div className="tab-form-row">
                <div div className="col-2 d-flex align-self-center justify-content-end" >
                  <label for="" className="tab-form-label">
                    Primary Officer
                  </label>
                </div>
                <div className="col-4 w-100">
                  {/* <Select
                  name="PrimaryOfficer"
                  value={incidentState?.PrimaryOfficer}
                  options={primaryOfficerDropDown}
                  getOptionLabel={(v) => v?.FirstName + " " + v?.LastName}
                  getOptionValue={(v) => v?.PINID}
                  onChange={(v) => handleIncidentState("PrimaryOfficer", v)}
                  placeholder="Select..."
                  styles={customStylesWithOutColor}
                  className="w-100"
                  menuPlacement="top"
                  isClearable
                  onInputChange={(inputValue, actionMeta) => {
                    if (inputValue.length > 12) {
                      return inputValue.slice(0, 12);
                    }
                    return inputValue;
                  }}
                  maxMenuHeight={130}

                /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="PrimaryOfficer"
                    placeholder="Primary Officer"
                    value={incidentState.PrimaryOfficer}
                    onChange={(v) => handleIncidentState("PrimaryOfficer", v.target.value)}
                    readOnly
                  />

                </div>
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    Secondary Officer
                  </label>
                </div>
                <div className="col-4 w-100">
                  {/* <Select
                  name="SecondaryOfficer"
                  value={incidentState?.SecondaryOfficer}
                  options={primaryOfficerDropDown}
                  getOptionLabel={(v) => v?.FirstName + " " + v?.LastName}
                  getOptionValue={(v) => v?.PINID}
                  onChange={(v) => handleIncidentState("SecondaryOfficer", v)}
                  placeholder="Select..."
                  styles={customStylesWithOutColor}
                  className="w-100"
                  menuPlacement="top"
                  isClearable
                  onInputChange={(inputValue, actionMeta) => {
                    if (inputValue.length > 12) {
                      return inputValue.slice(0, 12);
                    }
                    return inputValue;
                  }}
                  maxMenuHeight={130}

                /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="SecondaryOfficer"
                    placeholder="Secondary Officer"
                    value={incidentState.SecondaryOfficer}
                    onChange={(v) => handleIncidentState("SecondaryOfficer", v.target.value)}
                    readOnly
                  />
                </div>
              </div>
              {/* Line 8 */}
              <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label htmlFor="" className="tab-form-label" style={{ textAlign: "end", marginRight: "4px" }}>
                    Reported Location
                  </label>
                </div>
                <div className="col-7 w-100 inner-input-fullw d-flex tab-form-row-gap">
                  <div style={{ flexGrow: 1 }}>
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="Location"
                      placeholder="Location"
                      value={incidentState.location}
                      readOnly
                    />
                  </div>
                  <div className="d-flex align-items-center" style={{ marginLeft: 'auto', gap: '8px' }}>
                    {/* {
                      (incidentState?.isVerifyReportedLocation === 0 && incidentState?.location) &&
                      <span className="badge bg-secondary">Verified</span>
                    }
                    {
                      (incidentState?.isVerifyReportedLocation === 1 && incidentState?.location) &&
                      <OverlayTrigger
                        placement="bottom"
                        overlay={<Tooltip id="tooltip">Please verify the unverified location through the GEO tab.</Tooltip>}
                      >
                        <span className="badge bg-secondary">Unverified</span>
                      </OverlayTrigger>
                    } */}
                    {
                      (incidentState?.isVerifyReportedLocation === 1 && incidentState?.location) && (
                        <span className="badge text-white p-2" style={{ backgroundColor: "#008000" }}>Verified</span>
                      )
                    }
                    {
                      (incidentState?.isVerifyReportedLocation === 0 && incidentState?.location) && (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip id="tooltip">Please verify the unverified location through the GEO tab.</Tooltip>}
                        >
                          <span className="badge text-white p-2" style={{ textDecoration: "underline", backgroundColor: "#ff0000", cursor: "pointer" }}>
                            Unverified
                          </span>
                        </OverlayTrigger>
                      )
                    }


                    {/* {
                      (incidentState?.isVerifyReportedLocation === 1 && incidentState?.location) && (
                        <span className="badge bg-success text-white">Verified</span>
                      )
                    }
                    {
                      (incidentState?.isVerifyReportedLocation === 0 && incidentState?.location) && (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip id="tooltip">Please verify the unverified location through the GEO tab.</Tooltip>}
                        >
                          <span className="badge text-white bg-danger text-decoration-underline">Unverified</span>
                        </OverlayTrigger>
                      )
                    } */}
                  </div>
                </div>
                <div className="col-3 d-flex tab-form-row-gap">
                  <div className=" d-flex align-self-center justify-content-end">
                    <label
                      for=""
                      className="tab-form-label text-nowrap"
                    >
                      Reported Apt/Suite#
                    </label>
                  </div>
                  <input
                    type="number"
                    className="form-control  py-1 new-input"
                    name="ReportedApartmentNo"
                    readOnly
                    placeholder="Apt/Suite#"
                    value={incidentState.ReportedApartmentNo}
                    onChange={(e) => { handleIncidentState("ReportedApartmentNo", e.target.value); setIsChangeData(true); }}
                  />
                </div>
              </div>
              {/* Line 9 */}
              <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    Reported CFS
                  </label>
                </div>
                <div className="col-7 d-flex align-self-center justify-content-end">
                  <Select
                    name="CFSLId"
                    value={CFSDropDown.find((opt) => opt.CallforServiceID === incidentState?.CFSLId)}  // Keep the selected value
                    options={CFSDropDown}
                    getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                    getOptionValue={(v) => v?.CallforServiceID}
                    onChange={(v) => {
                      handleIncidentState("CFSLId", v?.CallforServiceID);
                      handleIncidentState("CFSLDesc", v?.CallforServiceID);
                      handleIncidentState("CFSLPriority", v?.PriorityID);
                      setIsChangeData(true);
                    }}
                    isDisabled
                    placeholder="Select..."
                    styles={colorLessStyle_Select}
                    className="w-100"
                    menuPlacement="top"
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
                  <div className="col-7 w-100">
                    <Select
                      name="CFSLDesc"
                      value={CFSDropDown.find((opt) => opt.CallforServiceID === incidentState?.CFSLDesc)}  // Keep the selected value
                      options={CFSDropDown}
                      getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                      getOptionValue={(v) => v?.CallforServiceID}
                      onChange={(v) => {
                        handleIncidentState("CFSLId", v?.CallforServiceID);
                        handleIncidentState("CFSLDesc", v?.CallforServiceID);
                        handleIncidentState("CFSLPriority", v?.PriorityID);
                        setIsChangeData(true);
                      }}
                      isDisabled
                      placeholder="Select..."
                      styles={colorLessStyle_Select}
                      className="w-100"
                      menuPlacement="top"
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
                </div>
                <div className="col-3 d-flex align-items-center justify-content-end">
                  <label for="" className="tab-form-label mr-2">
                    Reported Priority
                  </label>
                  <Select
                    name="CFSLPriority"
                    value={PriorityDrpData?.find((item) => item?.PriorityID == incidentState?.CFSLPriority)}
                    options={PriorityDrpData}
                    getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                    getOptionValue={(v) => v?.PriorityCode}
                    formatOptionLabel={(option, { context }) => {
                      return context === 'menu'
                        ? `${option?.PriorityCode} | ${option?.Description}`
                        : option?.PriorityCode;
                    }}
                    onChange={(v) => { handleIncidentState("CFSLPriority", v?.PriorityID); setIsChangeData(true); }}
                    placeholder="Select..."
                    isDisabled
                    styles={colorLessStyle_Select}
                    className="w-100"
                    menuPlacement="top"
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
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label htmlFor="" className="tab-form-label" style={{ textAlign: "end", marginRight: "4px" }}>
                    Found Location
                    {errorIncidentTab.FoundLocation && (isEmpty(incidentState?.FoundLocation) || incidentState?.FoundLocation === null) && (
                      <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Found Location"}</p>
                    )}
                  </label>
                </div>
                <div className="col-7 w-100 inner-input-fullw d-flex tab-form-row-gap">
                  <div style={{ flexGrow: 1 }}>
                    <Location
                      {...{
                        value: incidentState,
                        setValue: setIncidentState,
                        locationStatus,
                        setLocationStatus,
                        setIsChangeData,
                        setIsSelectLocation,
                        locationData,
                        setIsCheckGoogleLocation,
                        otherZoneDropDown,
                        emsZoneDropDown,
                        fireZoneDropDown,
                        geoZoneDropDown
                      }}
                      col="FoundLocation"
                      locationID="NameLocationID"
                      check={incidentState?.FoundApartmentNo?.length > 0}
                      // verify={incidentState?.IsVerify}
                      page="Name"
                      isGEO
                    />
                  </div>
                  <div className="d-flex align-items-center" style={{ marginLeft: 'auto', gap: '8px' }}>
                    {/* {
                      (incidentState?.isVerifyFoundLocation === 1 && incidentState?.FoundLocation) && (
                        <span className="badge bg-success text-white">Verified</span>
                      )
                    }
                    {
                      (incidentState?.isVerifyFoundLocation === 0 && incidentState?.FoundLocation) && (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip id="tooltip">Please verify the unverified location through the GEO tab.</Tooltip>}
                        >
                          <span className="badge text-white bg-danger text-decoration-underline">Unverified</span>
                        </OverlayTrigger>
                      )
                    } */}
                    {/* {
                      ((incidentState?.isVerifyFoundLocation === 1 || incidentState?.isVerify === true) && incidentState?.FoundLocation) && (
                        <span className="badge text-white p-2" style={{ backgroundColor: "#008000" }}>Verified</span>
                      )
                    }
                    {
                      ((incidentState?.isVerifyFoundLocation === 0 || incidentState?.isVerify === false) && incidentState?.FoundLocation) && (
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


                    {
                      incidentState?.FoundLocation && (
                        incidentState?.isVerifyFoundLocation === 1 || incidentState?.isVerify === true ? (
                          <span
                            className="badge text-white p-2"
                            style={{ backgroundColor: "#008000" }}>
                            Verified
                          </span>
                        ) : (
                          <OverlayTrigger
                            placement="bottom"
                            overlay={
                              <Tooltip id="tooltip">
                                Please verify the unverified location through the GEO tab.
                              </Tooltip>
                            }
                          >
                            <span
                              className="badge text-white p-2"
                              style={{ textDecoration: "underline", backgroundColor: "#ff0000", cursor: "pointer" }}
                            >
                              Unverified
                            </span>
                          </OverlayTrigger>
                        )
                      )
                    }


                    {/* <div className="form-check custom-control custom-checkbox">
                      <input className="custom-control-input" type="checkbox"
                        checked={incidentState?.isVerify || incidentState?.isVerifyFoundLocation} disabled
                      />
                      <label className="custom-control-label tab-form-label" >
                        Verify
                      </label>
                    </div> */}
                    {/* <span
                      data-toggle={incidentState?.FoundLocation ? "modal" : undefined}
                      data-target={incidentState?.FoundLocation ? "#LocationInformationModal" : undefined}
                      onClick={() => {
                        if (!incidentState?.FoundLocation) return; // Prevent click event when disabled

                        // setSelectedButton(prevSelected =>
                        //   prevSelected.includes(3)
                        //     ? prevSelected.filter(item => item !== 3)
                        //     : [...prevSelected, 3]
                        // );
                        setOpenLocationInformationModal(true);
                      }}
                      className={`pt-1 ${!incidentState?.FoundLocation ? "disabled" : ""}`}
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        cursor: incidentState?.FoundLocation ? "pointer" : "not-allowed",
                        color: incidentState?.FoundLocation ? "blue" : "gray",
                        pointerEvents: !incidentState?.FoundLocation ? "none" : "auto", // Disable click entirely
                      }}
                    >
                      {isVerifyLocation ? "Verify Location" : "UnVerify Location"}
                    </span> */}


                    {/* {isVerifyLocation ? "Verify Location" : "UnVerify Location"} */}


                  </div>
                </div>
                <div className="col-3 d-flex tab-form-row-gap">
                  <div className=" d-flex align-self-center justify-content-end">
                    <label
                      for=""
                      className="tab-form-label text-nowrap"
                    >
                      Found Apt/Suite#
                    </label>
                  </div>
                  {/* <CreatableSelect
                    isClearable
                    options={aptSuiteNoDropDown} // These are just predefined options for reference
                    placeholder="Select..."
                    name="FoundApartmentNo"
                    value={
                      incidentState.FoundApartmentNo
                        ? { value: incidentState.FoundApartmentNo, label: incidentState.FoundApartmentNo }
                        : null
                    }
                    // placeholder="Apt/Suite#"
                    // value={incidentState.FoundApartmentNo}
                    // onChange={(e) => { handleIncidentState("FoundApartmentNo", e.target.value); setIsChangeData(true); }}

                    onChange={handleSelectAptSuitNo}
                    onCreateOption={handleCreateOption} // Handle custom input directly
                    inputValue={aptInputValue} // Real-time controlled input
                    onInputChange={handleInputChange}
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
                    name="FoundApartmentNo"
                    value={
                      incidentState.FoundApartmentNo
                        ? { value: incidentState.FoundApartmentNo, label: incidentState.FoundApartmentNo }
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
                      }),
                    }}
                    className="w-100"
                    menuPlacement="top"
                  />
                </div>
              </div>
              {/* Line 7 */}
              <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label for="" className="tab-form-label">
                    Found CFS
                  </label>
                </div>
                <div className="col-7 d-flex align-self-center justify-content-end">
                  <Select
                    name="CFSLId"
                    value={CFSDropDown.find((opt) => opt.CallforServiceID === incidentState?.FoundCFSCodeID)}  // Keep the selected value
                    options={CFSDropDown}
                    getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                    getOptionValue={(v) => v?.CallforServiceID}
                    onChange={(v) => {
                      handleIncidentState("FoundCFSCodeID", v?.CallforServiceID);
                      handleIncidentState("FoundCFSLDesc", v?.CallforServiceID);
                      handleIncidentState("FoundPriorityID", v?.PriorityID);
                      setIsChangeData(true);
                    }}
                    placeholder="Select..."
                    styles={colorLessStyle_Select}
                    className="w-100"
                    menuPlacement="top"
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
                  <div className="col-7 w-100">
                    <Select
                      name="CFSLDesc"
                      value={CFSDropDown.find((opt) => opt.CallforServiceID === incidentState?.FoundCFSLDesc)}  // Keep the selected value
                      options={CFSDropDown}
                      getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                      getOptionValue={(v) => v?.CallforServiceID}
                      onChange={(v) => {
                        handleIncidentState("FoundCFSCodeID", v?.CallforServiceID);
                        handleIncidentState("FoundCFSLDesc", v?.CallforServiceID);
                        handleIncidentState("FoundPriorityID", v?.PriorityID);
                        setIsChangeData(true);
                      }}
                      placeholder="Select..."
                      styles={colorLessStyle_Select}
                      className="w-100"
                      menuPlacement="top"
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
                </div>
                <div className="col-3 d-flex align-items-center justify-content-end">
                  <label for="" className="tab-form-label mr-2">
                    Found Priority
                  </label>
                  <Select
                    name="CFSLPriority"
                    value={PriorityDrpData?.find((item) => item?.PriorityID == incidentState?.FoundPriorityID)}
                    options={PriorityDrpData}
                    getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                    getOptionValue={(v) => v?.PriorityCode}
                    formatOptionLabel={(option, { context }) => {
                      return context === 'menu'
                        ? `${option?.PriorityCode} | ${option?.Description}`
                        : option?.PriorityCode;
                    }}
                    onChange={(v) => { handleIncidentState("FoundPriorityID", v?.PriorityID); setIsChangeData(true); }}
                    placeholder="Select..."
                    styles={colorLessStyle_Select}
                    className="w-100"
                    menuPlacement="top"
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
              {/* Line 8 */}
              {!isCheckGoogleLocation && <div className="tab-form-row">
                <div className="col-2 d-flex align-self-center justify-content-end">
                  <label htmlFor="" className="tab-form-label" style={{ textAlign: "end", marginRight: "4px" }}>
                    Flags
                  </label>
                </div>
                <div className="col-10 w-100 inner-input-fullw">
                  <div className="d-flex tab-form-row-gap"
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap", // Ensures buttons wrap to a new line
                    }}
                  >
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
                            disabled={isViewEventDetails || (IsChangeData && isSelectLocation)}
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
                            disabled={isViewEventDetails || (IsChangeData && isSelectLocation)}
                          >
                            Premise History
                          </button>
                        );
                      }
                      return <React.Fragment key={`item-${index}`}>{buttons}</React.Fragment>;
                    })}
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
                          onClick={() => { setOpenAddFlagModalViewInc(true); setSelectedFlagData(item); }}
                          className="btn btn-sm btn-CADprimary1"
                          disabled={isViewEventDetails || (IsChangeData && isSelectLocation)}
                        >
                          {item?.FlagType}
                        </button>
                      );
                    })}
                    {/* Add flag button */}
                    <div
                      className="d-flex align-items-center"
                      style={{
                        // marginLeft: "8px", // Add spacing to separate from other elements
                        whiteSpace: "nowrap"
                      }}
                    >
                      {!isViewEventDetails && (
                        <span
                          data-toggle={"modal"}
                          data-target={
                            isViewEventDetails ||
                              IsChangeData || isSelectLocation ||
                              (incidentState?.FoundLocation && !aptData?.aptId)
                              ? undefined
                              : "#addFlagModal"
                          }
                          onClick={
                            isViewEventDetails ||
                              IsChangeData || isSelectLocation ||
                              (incidentState?.FoundLocation && !aptData?.aptId)
                              ? undefined
                              : () => {
                                setOpenAddFlagModalViewInc(true);
                                setSelectedFlagData({});
                              }
                          }
                          style={{
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: isViewEventDetails ||
                              IsChangeData || isSelectLocation ||
                              (incidentState?.FoundLocation && !aptData?.aptId)
                              ? "not-allowed"
                              : "pointer",
                            color: isViewEventDetails ||
                              IsChangeData || isSelectLocation ||
                              (incidentState?.FoundLocation && !aptData?.aptId)
                              ? "gray"
                              : "blue",
                          }}
                        >
                          Add Flag
                        </span>
                      )}

                    </div>
                  </div>
                </div>
              </div>
              }
            </div>
            <div className="col-4" style={{ zIndex: "0" }}>
              <MapComponent latitude={incidentState.coordinateY} longitude={incidentState.coordinateX} />
            </div>
          </div>
          {!isViewEventDetails && <div className="tab-form-row from-button-container px-2" >
            <button className="btn btn-sm btn-success mr-1" onClick={() => {
              navigate('/cad/dashboard-page'); setIsSelectLocation(false);
              clearStateIncidentTab();
              setAptData({});
            }}>Cancel</button>
            <button className="btn btn-sm btn-success mr-1" disabled={!IsChangeData} onClick={() => handelSave()}>Save</button>
          </div>}
        </div>
      </div>
      {openFlagTableModal && <FlagTableModal {...{ openFlagTableModal, setOpenFlagTableModal, geoLocationID, flagName, isViewEventDetails, IncID, aptData }} />
      }
      {openAddFlagModalViewInc && <FlagModalViewInc {...{ openAddFlagModalViewInc, setOpenAddFlagModalViewInc, geoLocationID, getFlagListRefetch, selectedFlagData, setSelectedFlagData, refetchSingleIncidentData, setIsCheckGoogleLocation, aptData, setAptData, refetchAptSuiteNoData, createLocationPayload }} />}
      <LocationInformationModal {...{ openLocationInformationModal, setOpenLocationInformationModal, geoFormValues: incidentState, setGEOFormValues: setIncidentState, isGoogleLocation: isCheckGoogleLocation, createLocationPayload }} />
    </>
  );
};

export default IncidentTabSection;
