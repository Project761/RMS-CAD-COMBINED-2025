// NOSONAR
import { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../CADHook/useObjState';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { colorLessStyle_Select } from '../Utility/CustomStylesForReact';
import { useQuery } from 'react-query';
import CallTakerServices from "../../CADServices/APIs/callTaker";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { useSelector, useDispatch } from 'react-redux';
import Location from '../Common/Location';
import GeoServices from "../../CADServices/APIs/geo";
import { fetchPostData } from '../../Components/hooks/Api';
import { toastifyError } from '../../Components/Common/AlertMsg';
import { useLocation, useNavigate } from 'react-router-dom';
import { AgencyContext } from '../../Context/Agency/Index';
import { dropDownDataModelForAptNo, handleNumberTextKeyDown, handleTextKeyDown } from '../../CADUtils/functions/common';
import { filterPassedTimeZone, getShowingMonthDateYear } from '../../Components/Common/Utility';
import { getData_DropDown_Operator } from '../../CADRedux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../redux/actions/IncidentAction';

function EventSearchPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setEventData, datezone, GetDataTimeZone } = useContext(AgencyContext);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
  const [loginAgencyID, setLoginAgencyID] = useState("");
  const [receiveSourceDropDown, setReceiveSourceDropDown] = useState([]);
  const [cfsDropDown, setCFSDropDown] = useState([]);
  const [locationStatus, setLocationStatus] = useState(false);
  const [locationData, setLocationData] = useState();
  const [isSelectLocation, setIsSelectLocation] = useState(false);
  const [IsChangeData, setIsChangeData] = useState(false);
  const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
  const [defaultAptSuite, setDefaultAptSuite] = useState(null);
  const [aptInputValue, setAptInputValue] = useState("");
  const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);

  const [
    eventState,
    setEventState,
    handleEventState,
    clearEventState,
  ] = useObjState({
    eventSearch: "bothEvents",
    agencyCode: { lable: 'L', value: '1' },
    dateFilter: "none",
    reportedFromDate: "",
    reportedToDate: "",
    RMSIncidentFrom: "",
    RMSIncidentTo: "",
    receiveSource: "",
    CADEventFrom: "",
    CADEventTo: "",
    reportedCSF: "",
    operatorID: "",
    Comments: "",
    location: "",
    apt: "",
    intersection1: "",
    intersection2: "",
    City: "",
    commonPlaceName: "",
    ZipCode: "",
    Id: "",
    isAllAgencies: false,
    isSelfAgency: true
  });

  const receiveSourceKey = `/CAD/CallTakerReceiveSource/GetData_ReceiveSource`;
  const { data: receiveSourceData, isSuccess: isFetchReceiveSourceData } =
    useQuery(
      [receiveSourceKey, { Action: "GetData_ReceiveSource", AgencyID: loginAgencyID }],
      CallTakerServices.getReceiveSource,
      {
        refetchOnWindowFocus: false,
        enabled: !!loginAgencyID,
      }
    );

  const CFSCodeKey = `/CAD/MasterCallforServiceCode/InsertCallforServiceCode`;
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
      enabled: !!loginAgencyID,
    }
  );

  const aptSuiteNoPayload = {
    AgencyID: loginAgencyID,
    GeoLocationID: eventState?.Id
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
      enabled: !!eventState?.Id
    }
  );

  useEffect(() => {
    if (isFetchAptSuiteNoData && aptSuiteNoData?.data?.data) {
      const parsedData = JSON.parse(aptSuiteNoData.data.data || "{}");
      if (parsedData?.Table?.length) {
        const filteredOptions = parsedData.Table.filter((item) => item.Description !== null);
        setAptSuiteNoDropDown(
          dropDownDataModelForAptNo(filteredOptions, "Description", "Description", "AptID")
        );
        const defaultOption = parsedData.Table.find(
          (item) => item.Description === null && item.AptID
        );
        if (defaultOption) {
          const defaultValue = {
            value: "",
            label: "",
            aptId: defaultOption.AptID,
          };
          setDefaultAptSuite(defaultValue);
          if (!eventState?.apt || Object.keys(eventState?.apt).length === 0) {
            handleEventState("apt", defaultValue);
          }
        }
      } else {
        setAptSuiteNoDropDown([]);
        setDefaultAptSuite({});
        setAptInputValue("");
      }
    } else {
      setAptSuiteNoDropDown([]);
      setDefaultAptSuite({})
      setAptInputValue("")
    }
  }, [isFetchAptSuiteNoData, aptSuiteNoData, eventState?.Id, eventState?.location]);

  useEffect(() => {
    if (!eventState?.location) {
      setEventState((prevState) => ({
        ...prevState,
        Id: "",
        apt: {}
      }));
    }

    const fetchLocationData = async () => {
      try {
        const response = await GeoServices.getLocationData({
          Location: eventState?.location,
          AgencyID: loginAgencyID
        });
        const data = JSON.parse(response?.data?.data)?.Table || [];
        setLocationData(data);

      } catch (error) {
        console.error("Error fetching location data:", error);
        setLocationData([]);
      }
    };

    if (eventState?.location) {
      fetchLocationData();
    }
  }, [eventState?.location, isSelectLocation]);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      GetDataTimeZone(localStoreData?.AgencyID);
      dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
      dispatch(get_ScreenPermissions_Data("CS102", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  useEffect(() => {
    if (isFetchCFSData && cfsData) {
      const data = JSON.parse(cfsData?.data?.data)?.Table;
      setCFSDropDown(data);
    }
  }, [isFetchCFSData, cfsData]);

  useEffect(() => {
    if (isFetchReceiveSourceData && receiveSourceData) {
      const data = JSON.parse(receiveSourceData?.data?.data);
      setReceiveSourceDropDown(data?.Table || []);
    }
  }, [isFetchReceiveSourceData, receiveSourceData]);

  const startRef = useRef();
  const onKeyDown = (e) => {
    if (e.keyCode === 9 || e.which === 9) {
      startRef.current.setOpen(false);
    }
  };

  const getEventDateRange = (dateFilter) => {
    const currentDate = new Date();
    let startDate = null;

    switch (dateFilter) {
      case "24hr":
        startDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "lastWeek":
        startDate = new Date();
        startDate.setDate(currentDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastMonth":
        startDate = new Date();
        startDate.setMonth(currentDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "lastYear":
        startDate = new Date();
        startDate.setFullYear(currentDate.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        return "";
    }

    return startDate.toISOString().split("T")[0];
  };
  const location = useLocation();
  const [refineSearchData, setRefineSearchData] = useState(null);

  useEffect(() => {
    if (location.state?.fromRefineSearch) {
      setRefineSearchData(location.state);
      setEventState(location.state.searchState || {});
    } else if (!refineSearchData) {
      // If no refine search data, reset the form
      clearEventState();
    }

    // Clear location.state AFTER saving the data locally
    if (location.state) {
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, refineSearchData]);

  async function handleSearch() {
    let agencyID;
    if (eventState?.isSelfAgency && eventState?.isAllAgencies) {
      agencyID = loginAgencyID;
    } else if (eventState?.isAllAgencies) {
      agencyID = "";
    } else {
      agencyID = loginAgencyID;
    }

    let activeClosedEvents;
    if (eventState?.eventSearch === "bothEvents") {
      activeClosedEvents = 1;
    } else if (eventState?.eventSearch === "activeEvents") {
      activeClosedEvents = 2;
    } else {
      activeClosedEvents = 3;
    }

    const payload = {
      AgencyID: loginAgencyID,
      SearchFlag: eventState?.isSelfAgency && !eventState?.isAllAgencies ? 0 : eventState?.isAllAgencies && !eventState?.isSelfAgency ? 1 : eventState?.isSelfAgency && eventState?.isAllAgencies ? 2 : null,
      "IncidentNumber": eventState?.RMSIncidentFrom,
      "IncidentNumberTo": eventState?.RMSIncidentTo,
      "ReportedDateTO": eventState?.reportedToDate ? getShowingMonthDateYear(eventState?.reportedToDate) : "",
      "ReportedDate": eventState?.reportedFromDate ? getShowingMonthDateYear(eventState?.reportedFromDate) : "",
      "ReceiveSourceID": eventState?.receiveSource?.ReceiveSourceID,
      "CADIncidentNumberFrom": eventState?.CADEventFrom,
      "CADIncidentNumberTo": eventState?.CADEventTo,
      "CrimeLocation": eventState?.location,
      ReportedCFSCodeID: eventState?.reportedCSF?.length > 0 ? eventState?.reportedCSF?.map(r => r?.CallforServiceID).join(",") : "",
      "EventDate": getEventDateRange(eventState?.dateFilter),
      "City": eventState?.City,
      "InterDirectionPrefix": eventState?.intersection1,
      "InterDirectionSufix": eventState?.intersection2,
      "CommonPlace": eventState?.commonPlaceName,
      "ZipCode": eventState?.ZipCode,
      "ApartmentNo": eventState?.apt?.aptId || "",
      "ActiveClosedEvents": activeClosedEvents,
      "OperatorID": eventState?.operatorID?.length > 0 ? eventState?.operatorID?.map(o => o?.PINID).join(",") : "",
      "Comments": eventState?.Comments,
    };

    if (loginAgencyID) {
      fetchPostData("/CAD/QueryIncident/IncidentEventSearch", payload).then((res) => {
        if (res.length > 0) {
          setEventData(res);
          navigate('/cad/eventSearchList', { state: { searchState: eventState } });
          clearEventState();
        } else {
          setEventData([]);
          toastifyError("Data Not Available");
        }
      });
    } else {
      toastifyError("Please Enter Details");
    }
  }

  const OnClose = () => {
    clearEventState()
    navigate('/cad/dashboard-page');
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
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
    }),
    input: (provided) => ({
      ...provided,
      minWidth: '0px',
      maxWidth: '100%',
    }),
  };

  return (
    <div className="section-body pt-1 p-1 bt" >
      <div className="div">
        <div className="dark-row" >
          <div className="col-12 col-sm-12">
            <div className="card Agency">
              <div className="card-body pt-3 pb-2" >
                <div className="btn-box  text-right  mr-1 mb-1" >
                  {effectiveScreenPermission?.[0]?.AddOK === 1 && <button type="button" className="btn btn-sm btn-success mr-1" onClick={() => handleSearch()}>Search</button>}
                  <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1 " onClick={() => { OnClose(); }}>Close</button>
                </div>
                <div className="row " style={{ marginTop: '-10px' }}>
                  <div className="col-12 row my-2 ml-3">
                    <div className="row align-items-center px-1">
                      <div className="col-auto mt-1">
                        <label className="new-label">Search with Agency</label>
                      </div>
                      <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                        <input
                          type="checkbox"
                          name="isSelfAgency"
                          checked={eventState.isSelfAgency}
                          onChange={(e) => {
                            handleEventState("isSelfAgency", e.target.checked);
                          }}
                        />
                        <label htmlFor="isSelfAgency" className="tab-form-label mb-0">
                          Self Agency
                        </label>
                      </div>
                      <div className="col-auto d-flex align-items-center" style={{ gap: '5px' }}>
                        <input
                          type="checkbox"
                          name="isAllAgencies"
                          checked={eventState.isAllAgencies}
                          onChange={(e) => {
                            handleEventState("isAllAgencies", e.target.checked);
                          }}
                        />
                        <label htmlFor="isAllAgencies" className="tab-form-label mb-0">
                          All Agencies
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 row my-2 ml-3">
                    <div className='col-5 d-flex '>
                      <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                        <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                          <input type="radio" id="bothEvents" value="bothEvents" checked={eventState?.eventSearch === 'bothEvents'} onChange={(e) => { handleEventState("eventSearch", e.target.value); }} />
                          <label htmlFor="bothEvents" className='tab-form-label' style={{ margin: '0', }}>Both Events</label>
                        </div>
                      </div>
                      <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                        <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                          <input type="radio" id="activeEvents" value="activeEvents" checked={eventState?.eventSearch === 'activeEvents'} onChange={(e) => {
                            handleEventState("eventSearch", e.target.value)
                          }} />
                          <label htmlFor="activeEvents" className='tab-form-label' style={{ margin: '0', }}>Active Events</label>
                        </div>
                      </div>
                      <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                        <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                          <input type="radio" id="closedEvents" value="closedEvents" checked={eventState?.eventSearch === 'closedEvents'} onChange={(e) => {
                            handleEventState("eventSearch", e.target.value)
                          }} />
                          <label htmlFor="closedEvents" className='tab-form-label' style={{ margin: '0', }}>Closed Events</label>
                        </div>
                      </div>
                      <div className="d-flex align-self-center justify-content-start" >
                        <div className='d-flex align-items-center justify-content-start' style={{ gap: '5px' }}>
                          <label htmlFor="closedEvents" className='tab-form-label text-nowrap'>Select Agency Type</label>
                          <Select
                            styles={colorLessStyle_Select}
                            placeholder="Select"
                            options={[{ lable: "L", value: "1" }]}
                            getOptionLabel={(v) => v?.lable}
                            getOptionValue={(v) => v?.value}
                            value={eventState?.agencyCode}
                            onChange={(e) => { handleEventState("agencyCode", e) }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-7 d-flex'>
                      <div className="row align-self-center justify-content-center px-1 mt-2 mb-2">
                        <div className="d-flex align-self-center justify-content-center" style={{ width: '120px' }}>
                          <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                            <input type="radio" id="none" value="none" checked={eventState?.dateFilter === 'none'} onChange={(e) => { handleEventState("dateFilter", e.target.value); }} />
                            <label htmlFor="none" className='tab-form-label' style={{ margin: '0', }}>None</label>
                          </div>
                        </div>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '90px' }}>
                          <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                            <input type="radio" id="24hr" value="24hr" checked={eventState?.dateFilter === '24hr'} onChange={(e) => {
                              handleEventState("dateFilter", e.target.value)
                            }} />
                            <label htmlFor="24hr" className='tab-form-label' style={{ margin: '0', }}>24Hr</label>
                          </div>
                        </div>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                          <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                            <input type="radio" id="lastWeek" value="lastWeek" checked={eventState?.dateFilter === 'lastWeek'} onChange={(e) => {
                              handleEventState("dateFilter", e.target.value)
                            }} />
                            <label htmlFor="lastWeek" className='tab-form-label' style={{ margin: '0', }}>Last 7 Days</label>
                          </div>
                        </div>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                          <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                            <input type="radio" id="lastMonth" value="lastMonth" checked={eventState?.dateFilter === 'lastMonth'} onChange={(e) => {
                              handleEventState("dateFilter", e.target.value)
                            }} />
                            <label htmlFor="lastMonth" className='tab-form-label' style={{ margin: '0', }}>Last 30 Days</label>
                          </div>
                        </div>
                        <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                          <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                            <input type="radio" id="lastYear" value="lastYear" checked={eventState?.dateFilter === 'lastYear'} onChange={(e) => {
                              handleEventState("dateFilter", e.target.value)
                            }} />
                            <label htmlFor="lastYear" className='tab-form-label' style={{ margin: '0', }}>Last 365 Days</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <fieldset>
                      <legend>Event Search</legend>
                      <div className='row mb-1 ml-4'>
                        <div className="col-1 d-flex align-self-center justify-content-end">
                          <label htmlFor="ReportedFromDate" className="tab-form-label text-nowrap">
                            Reported From Date
                          </label>
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end">
                          <DatePicker
                            name='startDate'
                            ref={startRef}
                            onKeyDown={onKeyDown}
                            id='startDate'
                            onChange={(date) => {
                              handleEventState("reportedFromDate", date);
                              if (!date) {
                                handleEventState("reportedToDate", date)
                              }
                            }}
                            selected={eventState?.reportedFromDate || ""}
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeIntervals={1}
                            filterTime={(date) => filterPassedTimeZone(date, datezone)}
                            timeCaption="Time"
                            showMonthDropdown
                            showYearDropdown
                            showTimeSelect
                            timeInputLabel
                            isClearable={!!eventState?.reportedFromDate}
                            timeFormat="HH:mm "
                            showDisabledMonthNavigation
                            is24Hour
                            dropdownMode="select"
                            autoComplete="off"
                            placeholderText="Select From Date..."
                            maxDate={new Date(datezone)}
                            minDate={new Date(1991, 0, 1)}
                          />
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end ml-2">
                          <label htmlFor="ReportedToDate" className="tab-form-label">
                            Reported To Date
                          </label>
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end">
                          <DatePicker
                            name='reportedToDate'
                            id='reportedToDate'
                            onChange={(date) => {
                              let selectedDate = new Date(date);
                              let currentDate = new Date();
                              let updatedDate;
                              if (selectedDate.toDateString() === currentDate.toDateString()) {
                                updatedDate = new Date();
                              } else {
                                updatedDate = new Date(selectedDate.setHours(23, 59, 0, 0));
                              }
                              handleEventState("reportedToDate", updatedDate);
                            }}
                            selected={eventState?.reportedToDate || ""}
                            dateFormat="MM/dd/yyyy HH:mm"
                            timeIntervals={1}
                            filterTime={(date) => filterPassedTimeZone(date, datezone)}
                            timeCaption="Time"
                            showMonthDropdown
                            disabled={!eventState?.reportedFromDate}
                            className={!eventState?.reportedFromDate ? 'readonlyColor' : ''}
                            showYearDropdown
                            showTimeSelect
                            timeInputLabel
                            isClearable={!!eventState?.reportedToDate}
                            timeFormat="HH:mm "
                            showDisabledMonthNavigation
                            is24Hour
                            dropdownMode="select"
                            autoComplete="off"
                            placeholderText="Select To Date..."
                            minDate={eventState?.reportedFromDate}
                            maxDate={new Date(datezone)}
                          />
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end ml-2">
                          <label htmlFor="ReceiveSource" className="tab-form-label">
                            Receive Source
                          </label>
                        </div>
                        <div className="col-2 d-flex align-self-center justify-content-end">
                          <Select
                            styles={colorLessStyle_Select}
                            placeholder="Select"
                            options={receiveSourceDropDown}
                            getOptionLabel={(v) => v?.ReceiveSourceCode}
                            getOptionValue={(v) => v?.ReceiveSourceID}
                            isClearable
                            onInputChange={(inputValue, actionMeta) => {
                              if (inputValue.length > 12) {
                                return inputValue.slice(0, 12);
                              }
                              return inputValue;
                            }}
                            value={eventState?.receiveSource}
                            onChange={(e) => { handleEventState("receiveSource", e) }}
                          />
                        </div>
                      </div>
                      <div className='col-12 mb-1 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-self-center justify-content-end">
                            <label htmlFor="CADEventFrom" className="tab-form-label text-nowrap">
                              CAD Event # From
                            </label>
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <input
                              type="text"
                              className="form-control  py-1 new-input"
                              name="CADEventFrom"
                              placeholder="CAD Event # From"
                              value={eventState.CADEventFrom}
                              onChange={(e) => {
                                handleEventState("CADEventFrom", e.target.value);
                                if (!e.target.value) {
                                  handleEventState("CADEventTo", "")
                                }
                              }}
                              onKeyDown={handleNumberTextKeyDown}
                            />
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="CADEventTo" className="tab-form-label">
                              CAD Event # To
                            </label>
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <input
                              type="text"
                              className="form-control  py-1 new-input"
                              name="CADEventTo"
                              placeholder="CAD Event # To"
                              disabled={!eventState.CADEventFrom}
                              value={eventState.CADEventTo}
                              onChange={(e) => handleEventState("CADEventTo", e.target.value)}
                              onKeyDown={handleNumberTextKeyDown}
                            />
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="OperatorName" className="tab-form-label">
                              Operator Name
                            </label>
                          </div>
                          <div className="col-2 w-100">
                            <Select
                              styles={customStylesWithOutColorArrow}
                              placeholder="Select"
                              options={OperatorDrpData}
                              getOptionLabel={(v) => v?.displayName}
                              getOptionValue={(v) => v?.PIN}
                              isClearable
                              onInputChange={(inputValue, actionMeta) => {
                                if (inputValue.length > 12) {
                                  return inputValue.slice(0, 12);
                                }
                                return inputValue;
                              }}
                              isMulti
                              value={eventState?.operatorID}
                              onChange={(e) => { handleEventState("operatorID", e) }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='col-12 mb-1 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-self-center justify-content-end">
                            <label htmlFor="RMSIncidentFrom" className="tab-form-label text-nowrap">
                              RMS Incident # From
                            </label>
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <input
                              type='text'
                              className="form-control py-1 new-input"
                              name="RMSIncidentFrom"
                              placeholder="RMS Incident # From"
                              value={eventState.RMSIncidentFrom}
                              onChange={(e) => {
                                handleEventState("RMSIncidentFrom", e.target.value);
                                if (!e.target.value) { handleEventState("RMSIncidentTo", "") }
                              }}
                            />
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="RMSIncidentTo" className="tab-form-label">
                              RMS Incident # To
                            </label>
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <input
                              type='text'
                              className="form-control py-1 new-input"
                              name="RMSIncidentTo"
                              disabled={!eventState.RMSIncidentFrom}
                              placeholder="RMS Incident # To"
                              value={eventState.RMSIncidentTo}
                              onChange={(e) => handleEventState("RMSIncidentTo", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='col-12 mb-1 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-self-center justify-content-end">
                            <label htmlFor="ReportedCFS" className="tab-form-label text-nowrap">
                              Reported CFS
                            </label>
                          </div>
                          <div className="col-lg-5 w-100">
                            <Select
                              styles={customStylesWithOutColorArrow}
                              placeholder="Select"
                              isMulti
                              options={cfsDropDown}
                              getOptionLabel={(v) => v?.CFSCODE + "|" + v?.CFSCodeDescription}
                              getOptionValue={(v) => v?.CallforServiceID}
                              isClearable
                              formatOptionLabel={(option) => {
                                return option.CFSCODE + " | " + option.CFSCodeDescription
                              }}
                              value={eventState?.reportedCSF}
                              onChange={(e) => { handleEventState("reportedCSF", e) }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='col-12 mb-1 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-items-start justify-content-end">
                            <label className="tab-form-label text-nowrap">
                              Comments
                            </label>
                          </div>
                          <div className="col-10 d-flex align-items-center justify-content-end">
                            <textarea
                              type="text"
                              rows="1"
                              className="form-control  py-1 new-input"
                              style={{ height: "auto", overflowY: "scroll" }}
                              placeholder="Comment"
                              value={eventState?.Comments}
                              onChange={(e) => {
                                handleEventState("Comments", e.target.value)
                                e.target.style.height = "auto";
                                const maxHeight = 1 * parseFloat(getComputedStyle(e.target).lineHeight);
                                e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    {/* <fieldset>
                      <legend>Event Flag Information</legend>
                      <div className='col-12 mt-2 mb-1 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-self-center justify-content-end">
                              <label htmlFor="SelectFlag" className="tab-form-label text-nowrap">
                              Select Flag
                            </label>
                          </div>
                          <div className="col-2 w-100">
                            <Select
                              styles={customStylesWithOutColorArrow}
                              placeholder="Select"
                              options={flagData}
                              isMulti
                              getOptionLabel={(v) => v?.FlagNameCode}
                              getOptionValue={(v) => v?.FlagID}
                              isClearable
                              value={eventState?.flag}
                              onChange={(e) => { handleEventState("flag", e) }}
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset> */}
                    <fieldset>
                      <legend>Event Location Information</legend>
                      <div className='col-12 mb-1 mt-2 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-self-center justify-content-end">
                            <label htmlFor="Location" className="tab-form-label text-nowrap">
                              Location
                            </label>
                          </div>
                          <div className="col-5 w-100 inner-input-fullw pr-2">
                            <Location
                              {...{
                                value: eventState,
                                setValue: setEventState,
                                locationStatus,
                                setLocationStatus,
                                setIsChangeData,
                                setIsSelectLocation,
                                locationData,
                              }}
                              col="location"
                              locationID="NameLocationID"
                              check={false}
                              verify={true}
                              page="Name"
                              isGEO
                            />
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="AptSuite" className="tab-form-label">
                              Apt#/suite
                            </label>
                          </div>
                          <div className="col-2 w-100">
                            <Select
                              styles={customStylesWithOutColorArrow}
                              placeholder="Select"
                              options={aptSuiteNoDropDown}
                              getOptionLabel={(v) => v?.label}
                              getOptionValue={(v) => v?.aptId}
                              isClearable
                              value={eventState?.apt || defaultAptSuite} // Set default value
                              onInputChange={(inputValue, actionMeta) => {
                                if (actionMeta.action === "input-change") {
                                  setAptInputValue(inputValue.length > 12 ? inputValue.slice(0, 12) : inputValue);
                                }
                                if (actionMeta.action === "menu-close") {
                                  setAptInputValue(""); // Clear the input field when closing the menu
                                }
                              }}
                              inputValue={aptInputValue} // Real-time controlled input
                              onChange={(e) => {
                                if (!e) {
                                  handleEventState("apt", defaultAptSuite);
                                } else {
                                  handleEventState("apt", e);
                                }
                              }}
                              isDisabled={!eventState?.location || !eventState?.Id}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='col-12 mb-1 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-self-center justify-content-end">
                            <label htmlFor="IntersectionST" className="tab-form-label text-nowrap">
                              Intersection ST/ST
                            </label>
                          </div>
                          <div className="col-5 d-flex align-items-center justify-content-end">
                            <input
                              type="text"
                              className="form-control py-1 new-input"
                              name="intersection1"
                              value={eventState.intersection1}
                              onChange={(e) => { handleEventState("intersection1", e.target.value) }}
                            />
                            {"/"}
                            <input
                              type="text"
                              className="form-control ml-1 py-1 new-input mr-2"
                              name="intersection2"
                              value={eventState.intersection2}
                              onChange={(e) => { handleEventState("intersection2", e.target.value) }}
                            />
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="City" className="tab-form-label">
                              City
                            </label>
                          </div>
                          <div className="col-2 w-100">
                            <input
                              type="text"
                              className="form-control py-1 new-input"
                              name="City"
                              value={eventState.City}
                              onChange={(e) => { handleEventState("City", e.target.value) }}
                              onKeyDown={handleTextKeyDown}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='col-12 mb-1 ml-4'>
                        <div className='row'>
                          <div className="col-1 d-flex align-self-center justify-content-end">
                            <label htmlFor="CommonPlaceName" className="tab-form-label text-nowrap">
                              Common Place Name
                            </label>
                          </div>
                          <div className="col-5 d-flex align-self-center justify-content-end">
                            <input
                              type="text"
                              className="form-control py-1 new-input mr-2"
                              name="commonPlaceName"
                              value={eventState.commonPlaceName}
                              onChange={(e) => { handleEventState("commonPlaceName", e.target.value) }}
                              onKeyDown={handleNumberTextKeyDown}
                            />
                          </div>
                          <div className="col-2 d-flex align-self-center justify-content-end">
                            <label htmlFor="Zip" className="tab-form-label">
                              Zip
                            </label>
                          </div>
                          <div className="col-2 w-100">
                            <input
                              type="number"
                              className="form-control py-1 new-input"
                              name="ZipCode"
                              value={eventState.ZipCode}
                              onChange={(e) => { handleEventState("ZipCode", e.target.value) }}
                            />
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventSearchPage