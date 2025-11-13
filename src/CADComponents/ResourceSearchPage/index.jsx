import { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../CADHook/useObjState';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { colorLessStyle_Select, customStylesWithOutColorArrow } from '../Utility/CustomStylesForReact';
import { IncidentContext } from '../../CADContext/Incident';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import CallTakerServices from "../../CADServices/APIs/callTaker";
import GeoServices from "../../CADServices/APIs/geo";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { dropDownDataModel, dropDownDataModelForAptNo, handleNumberTextKeyDown, handleTextKeyDown } from '../../CADUtils/functions/common';
import Location from '../Common/Location';
import { AgencyContext } from '../../Context/Agency/Index';
import { fetchPostData } from '../../Components/hooks/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toastifyError } from '../../Components/Common/AlertMsg';
import { filterPassedTimeZone, getShowingMonthDateYear } from '../../Components/Common/Utility';
import { getData_DropDown_Operator, getData_DropDown_Zone } from '../../CADRedux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../redux/actions/IncidentAction';

function ResourceSearchPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const { setResourceData, GetDataTimeZone, datezone } = useContext(AgencyContext);
    const { allResourcesData } = useContext(IncidentContext);
    const [loginAgencyID, setLoginAgencyID] = useState("");
    const [resourceTypeListData, setResourceTypeListData] = useState([]);
    const [shiftDropDown, setShiftDropDown] = useState([])
    const [cfsDropDown, setCFSDropDown] = useState([]);
    const [zoneDropDown, setZoneDropDown] = useState([])
    const [locationStatus, setLocationStatus] = useState(false);
    const [locationData, setLocationData] = useState();
    const [isSelectLocation, setIsSelectLocation] = useState(false);
    const [IsChangeData, setIsChangeData] = useState(false);
    const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
    const [defaultAptSuite, setDefaultAptSuite] = useState(null);
    const [aptInputValue, setAptInputValue] = useState("");
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);

    const [
        resourceState,
        setResourceState,
        handleResourceState,
        clearResourceState,
    ] = useObjState({
        agencyCode: { lable: 'L', value: '1' },
        dateFilter: "none",
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        reportedCSF: "",
        resourceType: "",
        resource: "",
        primaryOfficer: [],
        primaryResource: "",
        shift: "",
        zone: "",
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

    const GetResourceTypeKey = `/CAD/MasterResourceType/GetData_DropDown_ResourceType/${loginAgencyID}`;
    const { data: resourceTypeData, isSuccess: isFetchResourceTypeList } = useQuery(
        [GetResourceTypeKey, { AgencyID: loginAgencyID },],
        MasterTableListServices.getData_DropDown_ResourceType,
        {
            refetchOnWindowFocus: false,
        }
    );
    useEffect(() => {
        if (isFetchResourceTypeList && resourceTypeData) {
            const res = JSON.parse(resourceTypeData?.data?.data);
            const data = res?.Table
            setResourceTypeListData(data || [])
        } else {
            setResourceTypeListData([])
        }
    }, [isFetchResourceTypeList, resourceTypeData])

    const shiftDataKey = `/CAD/MasterResourceShift/GetData_Shift`;
    const { data: shiftData, isSuccess: isFetchShiftData } = useQuery(
        [shiftDataKey, { AgencyID: loginAgencyID },],
        MasterTableListServices.getShift,
        {
            refetchOnWindowFocus: false,
            enabled: !!loginAgencyID
        }
    );

    const aptSuiteNoPayload = {
        // PINID: 0,
        // IsActive: 1,
        // IsSuperAdmin: 1,
        // AgencyID: loginAgencyID,
        GeoLocationID: resourceState?.Id
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
            enabled: !!resourceState?.Id
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

                    if (!resourceState?.apt || Object.keys(resourceState?.apt).length === 0) {
                        handleResourceState("apt", defaultValue);
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
    }, [isFetchAptSuiteNoData, aptSuiteNoData, resourceState?.Id, resourceState?.location]);

    useEffect(() => {
        if (ZoneDrpData) {
            setZoneDropDown(dropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription"));
        }
    }, [ZoneDrpData]);

    useEffect(() => {
        if (!resourceState?.location) {
            setResourceState((prevState) => ({
                ...prevState,
                Id: "",
                apt: {}
            }));
        }

        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: resourceState?.location,
                    AgencyID: loginAgencyID,
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };

        if (resourceState?.location) {
            fetchLocationData();
        }
    }, [resourceState?.location, isSelectLocation]);

    useEffect(() => {
        if (shiftData && isFetchShiftData) {
            const data = JSON.parse(shiftData?.data?.data);
            setShiftDropDown(data?.Table || [])
        }
    }, [shiftData, isFetchShiftData])

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
            dispatch(get_ScreenPermissions_Data("CS103", localStoreData?.AgencyID, localStoreData?.PINID));
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    useEffect(() => {
        if (isFetchCFSData && cfsData) {
            const data = JSON.parse(cfsData?.data?.data)?.Table;
            setCFSDropDown(data);
        }
    }, [isFetchCFSData, cfsData]);

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
            setResourceState(location.state.searchState || {});
        } else if (!refineSearchData) {
            // If no refine search data, reset the form
            clearResourceState();
        }

        // Clear location.state AFTER saving the data locally
        if (location.state) {
            navigate(location.pathname, { replace: true });
        }
    }, [location.state, navigate, refineSearchData]);

    async function handleSearch() {

        const payload = {
            AgencyID: loginAgencyID,
            SearchFlag: resourceState?.isSelfAgency && !resourceState?.isAllAgencies ? 0 : resourceState?.isAllAgencies && !resourceState?.isSelfAgency ? 1 : resourceState?.isSelfAgency && resourceState?.isAllAgencies ? 2 : null,
            ReportedDateTO: resourceState?.reportedToDate ? getShowingMonthDateYear(resourceState?.reportedToDate) : "",
            ReportedDate: resourceState?.reportedFromDate ? getShowingMonthDateYear(resourceState?.reportedFromDate) : "",
            CADCFSCodeID: "",
            CADIncidentNumberFrom: resourceState?.CADEventFrom,
            CADIncidentNumberTo: resourceState?.CADEventTo,
            CrimeLocation: resourceState?.location,
            ReportedCFSCodeID: resourceState?.reportedCSF?.length > 0 ? resourceState?.reportedCSF?.map(r => r?.CallforServiceID).join(",") : "",
            EventDate: getEventDateRange(resourceState?.dateFilter),
            ResourceNumber: resourceState?.resource?.length > 0 ? resourceState?.resource?.map(r => r?.ResourceID).join(",") : "",
            ResourceType: resourceState?.resourceType?.length > 0 ? resourceState?.resourceType?.map(o => o?.ResourceTypeID).join(",") : "",
            Shift: resourceState?.shift?.ShiftId,
            City: resourceState?.City,
            InterDirectionPrefix: resourceState?.intersection1,
            InterDirectionSufix: resourceState?.intersection2,
            CommonPlace: resourceState?.commonPlaceName,
            ZipCode: resourceState?.ZipCode,
            ApartmentNo: resourceState?.apt?.aptId || "",
            PrimeryOfficer: resourceState?.primaryOfficer?.length > 0 ? resourceState?.primaryOfficer?.map(o => o?.PINID).join(",") : "",
            PrimeryUnit: resourceState?.primaryResource?.length > 0 ? resourceState?.primaryResource?.map(pu => pu?.ResourceID).join(",") : "",
            ZoneCode: resourceState?.zone?.label,
        };

        if (loginAgencyID) {
            fetchPostData("/CAD/ResourceEvent/ResourceEvent_Search", payload).then((res) => {
                if (res.length > 0) {
                    setResourceData(res);
                    navigate('/cad/resourceSearchList', { state: { searchState: resourceState } });
                    clearResourceState();
                } else {
                    setResourceData([]);
                    toastifyError("Data Not Available");
                }
            });
        } else {
            toastifyError("Please Enter Details");
        }
    }

    const OnClose = () => {
        clearResourceState()
        navigate('/cad/dashboard-page');
    }


    const filteredResources = allResourcesData.filter(
        (res) =>
            resourceState?.resourceType?.length > 0 ? resourceState?.resourceType?.some(
                (type) => type.ResourceTypeID === res.ResourceTypeID
            ) : []
    );

    return (
        <div className="section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency ">
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
                                                    checked={resourceState.isSelfAgency}
                                                    onChange={(e) => {
                                                        handleResourceState("isSelfAgency", e.target.checked);
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
                                                    checked={resourceState.isAllAgencies}
                                                    onChange={(e) => {
                                                        handleResourceState("isAllAgencies", e.target.checked);
                                                    }}
                                                />
                                                <label htmlFor="isAllAgencies" className="tab-form-label mb-0">
                                                    All Agencies
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex my-2">
                                        <div className="col-4 d-flex  justify-content-start" >
                                            <div className='d-flex align-items-center justify-content-start' style={{ gap: '5px' }}>
                                                <label for="closedEvents" className='tab-form-label text-nowrap'>Select Agency Type</label>
                                                <Select
                                                    styles={colorLessStyle_Select}
                                                    placeholder="Select"
                                                    options={[{ lable: "L", value: "1" }]}
                                                    getOptionLabel={(v) => v?.lable}
                                                    getOptionValue={(v) => v?.value}
                                                    value={resourceState?.agencyCode}
                                                    onChange={(e) => { handleResourceState("agencyCode", e) }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-8 d-flex">
                                            <div className="d-flex align-self-center justify-content-center" style={{ width: '120px' }}>
                                                <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                                                    <input type="radio" id="none" value="none" checked={resourceState?.dateFilter === 'none'} onChange={(e) => { handleResourceState("dateFilter", e.target.value); }} />
                                                    <label for="none" className='tab-form-label' style={{ margin: '0', }}>None</label>
                                                </div>
                                            </div>
                                            <div className="d-flex align-self-center justify-content-start" style={{ width: '90px' }}>
                                                <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                                                    <input type="radio" id="24hr" value="24hr" checked={resourceState?.dateFilter === '24hr'} onChange={(e) => {
                                                        handleResourceState("dateFilter", e.target.value)
                                                    }} />
                                                    <label for="24hr" className='tab-form-label' style={{ margin: '0', }}>24Hr</label>
                                                </div>
                                            </div>
                                            <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                                                <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                                                    <input type="radio" id="lastWeek" value="lastWeek" checked={resourceState?.dateFilter === 'lastWeek'} onChange={(e) => {
                                                        handleResourceState("dateFilter", e.target.value)
                                                    }} />
                                                    <label for="lastWeek" className='tab-form-label' style={{ margin: '0', }}>Last 7 Days</label>
                                                </div>
                                            </div>
                                            <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                                                <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                                                    <input type="radio" id="lastMonth" value="lastMonth" checked={resourceState?.dateFilter === 'lastMonth'} onChange={(e) => {
                                                        handleResourceState("dateFilter", e.target.value)
                                                    }} />
                                                    <label for="lastMonth" className='tab-form-label' style={{ margin: '0', }}>Last 30 Days</label>
                                                </div>
                                            </div>
                                            <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                                                <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                                                    <input type="radio" id="lastYear" value="lastYear" checked={resourceState?.dateFilter === 'lastYear'} onChange={(e) => {
                                                        handleResourceState("dateFilter", e.target.value)
                                                    }} />
                                                    <label for="lastYear" className='tab-form-label' style={{ margin: '0', }}>Last 365 Days</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <fieldset>
                                            <legend>Unit Search</legend>
                                            <div className='row mb-1 my-1 ml-4'>
                                                <div className="col-1 d-flex align-self-center justify-content-end" style={{ marginLeft: '4px' }}>
                                                    <label for="" className="tab-form-label text-nowrap">
                                                        Reported From Date
                                                    </label>
                                                </div>
                                                <div className="col-2 d-flex align-self-center justify-content-end">
                                                    <DatePicker
                                                        name='startDate'
                                                        id='startDate'
                                                        ref={startRef}
                                                        onKeyDown={onKeyDown}
                                                        onChange={(v) => {
                                                            handleResourceState("reportedFromDate", v)
                                                            if (!v) {
                                                                handleResourceState("reportedToDate", null);
                                                            }
                                                        }}
                                                        selected={resourceState?.reportedFromDate || ""}
                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                        timeIntervals={1}
                                                        filterTime={(date) => filterPassedTimeZone(date, datezone)}
                                                        timeCaption="Time"
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        showTimeSelect
                                                        timeInputLabel
                                                        isClearable={!!resourceState?.reportedFromDate}
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
                                                <div className="col-2 d-flex align-self-center justify-content-end" style={{ marginLeft: '5px' }}>
                                                    <label for="" className="tab-form-label">
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
                                                            handleResourceState("reportedToDate", updatedDate);
                                                        }}
                                                        selected={resourceState?.reportedToDate || ""}
                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                        timeIntervals={1}
                                                        filterTime={(date) => filterPassedTimeZone(date, datezone)}
                                                        timeCaption="Time"
                                                        disabled={!resourceState?.reportedFromDate}
                                                        className={!resourceState?.reportedFromDate ? 'readonlyColor' : ''}
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        showTimeSelect
                                                        timeInputLabel
                                                        isClearable={!!resourceState?.reportedToDate}
                                                        timeFormat="HH:mm"
                                                        showDisabledMonthNavigation
                                                        is24Hour
                                                        dropdownMode="select"
                                                        autoComplete="off"
                                                        placeholderText="Select To Date..."
                                                        minDate={resourceState?.reportedFromDate}
                                                        maxDate={new Date(datezone)}
                                                    />
                                                </div>
                                                <div className="col-1 d-flex align-self-center justify-content-end" style={{ marginLeft: '4px' }}>
                                                    <label for="" className="tab-form-label text-nowrap">
                                                        Unit Type
                                                    </label>
                                                </div>
                                                <div className="col-2 w-100 align-self-center">
                                                    <Select
                                                        styles={customStylesWithOutColorArrow}
                                                        isMulti
                                                        placeholder="Select"
                                                        options={resourceTypeListData}
                                                        getOptionLabel={(v) => v?.ResourceTypeCode + " | " + v?.ResourceTypeDescription}
                                                        getOptionValue={(v) => v?.ResourceTypeID}
                                                        formatOptionLabel={(option, { context }) => {
                                                            return context === 'menu'
                                                                ? `${option?.ResourceTypeCode} | ${option?.ResourceTypeDescription}`
                                                                : option?.ResourceTypeCode;
                                                        }}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                        isClearable
                                                        value={resourceState?.resourceType}
                                                        onChange={(e) => {
                                                            handleResourceState("resourceType", e);
                                                            handleResourceState("resource", null);
                                                            if (!e) {
                                                                handleResourceState("resource", null);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className='col-12 mb-1 ml-4'>
                                                <div className='row'>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            CAD Event # From
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input"
                                                            name="CADEventFrom"
                                                            placeholder="CAD Event # From"
                                                            value={resourceState.CADEventFrom}
                                                            onChange={(e) => {
                                                                handleResourceState("CADEventFrom", e.target.value);
                                                                if (!e.target.value) {
                                                                    handleResourceState("CADEventTo", "");
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            CAD Event # To
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            className="form-control py-1 new-input"
                                                            name="CADEventTo"
                                                            placeholder="CAD Event # To"
                                                            value={resourceState.CADEventTo}
                                                            disabled={!resourceState.CADEventFrom}
                                                            onChange={(e) => handleResourceState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Unit #
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100 align-self-center">
                                                        <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={resourceState?.resourceType?.length > 0 ? filteredResources : allResourcesData}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            isClearable
                                                            isMulti
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            value={resourceState?.resource}
                                                            onChange={(e) => { handleResourceState("resource", e) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-12 mb-1 ml-4'>
                                                <div className='row'>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Reported CFS
                                                        </label>
                                                    </div>
                                                    <div className="col-6 w-100">
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
                                                            value={resourceState?.reportedCSF}
                                                            onChange={(e) => { handleResourceState("reportedCSF", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Shift
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            options={shiftDropDown}
                                                            getOptionLabel={(v) => v?.ShiftCode + " | " + v?.ShiftDescription}
                                                            getOptionValue={(v) => v?.ShiftId}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.ShiftCode} | ${option?.ShiftDescription}`
                                                                    : option?.ShiftCode;
                                                            }}
                                                            isClearable
                                                            value={resourceState?.shift}
                                                            onChange={(e) => { handleResourceState("shift", e) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-12 mb-1 ml-4'>
                                                <div className='row'>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Primary Officer
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100 align-self-center">
                                                        <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={OperatorDrpData}
                                                            getOptionLabel={(v) => v?.displayName}
                                                            getOptionValue={(v) => v?.PIN}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            isMulti
                                                            isClearable
                                                            value={resourceState?.primaryOfficer}
                                                            onChange={(e) => { handleResourceState("primaryOfficer", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Primary Unit
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100 align-self-center">
                                                        <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={allResourcesData}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            isClearable
                                                            isMulti
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            value={resourceState?.primaryResource}
                                                            onChange={(e) => { handleResourceState("primaryResource", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Zone
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            options={zoneDropDown}
                                                            isClearable
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            value={resourceState?.zone}
                                                            onChange={(e) => { handleResourceState("zone", e) }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <legend>Unit Location Information</legend>
                                            <div className='col-12 mb-1 mt-2 ml-4'>
                                                <div className='row'>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Location
                                                        </label>
                                                    </div>
                                                    <div className="col-5 w-100 inner-input-fullw pr-2">
                                                        <Location
                                                            {...{
                                                                value: resourceState,
                                                                setValue: setResourceState,
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
                                                        <label for="" className="tab-form-label">
                                                            Apt#/suite
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        {/* <input
                                                            placeholder='APT#/suite'
                                                            type="number"
                                                            className="form-control ml-1 py-1 new-input mr-2"
                                                            maxLength={4}
                                                            value={resourceState?.apt}
                                                            onChange={(e) => { handleResourceState("apt", e.target.value) }}
                                                        /> */}
                                                        <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={aptSuiteNoDropDown}
                                                            getOptionLabel={(v) => v?.label}
                                                            getOptionValue={(v) => v?.aptId}
                                                            isClearable
                                                            value={resourceState?.apt || defaultAptSuite} // Set default value
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
                                                                    handleResourceState("apt", defaultAptSuite);
                                                                } else {
                                                                    handleResourceState("apt", e);
                                                                }
                                                            }}
                                                            isDisabled={!resourceState?.location || !resourceState?.Id}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-12 mb-1 ml-4'>
                                                <div className='row'>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Intersection ST/ST
                                                        </label>
                                                    </div>
                                                    <div className="col-5 d-flex align-items-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input"
                                                            name="intersection1"
                                                            value={resourceState.intersection1}
                                                            onChange={(e) => { handleResourceState("intersection1", e.target.value) }}
                                                        />
                                                        {"/"}
                                                        <input
                                                            type="text"
                                                            className="form-control ml-1 py-1 new-input mr-2"
                                                            name="intersection2"
                                                            value={resourceState.intersection2}
                                                            onChange={(e) => { handleResourceState("intersection2", e.target.value) }}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            City
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input"
                                                            name="intersection2"
                                                            value={resourceState.City}
                                                            onChange={(e) => { handleResourceState("City", e.target.value) }}
                                                            onKeyDown={handleTextKeyDown}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-12 mb-1 ml-4'>
                                                <div className='row'>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Common Place Name
                                                        </label>
                                                    </div>
                                                    <div className="col-5 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control py-1 new-input mr-2"
                                                            name="commonPlaceName"
                                                            value={resourceState.commonPlaceName}
                                                            onChange={(e) => { handleResourceState("commonPlaceName", e.target.value) }}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Zip
                                                        </label>
                                                    </div>
                                                    <div className="col-2">
                                                        <input
                                                            type="number"
                                                            className="form-control py-1 new-input"
                                                            name="zip"
                                                            value={resourceState.ZipCode}
                                                            onChange={(e) => { handleResourceState("ZipCode", e.target.value) }}
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

export default ResourceSearchPage