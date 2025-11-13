import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import Location from '../../Common/Location';
import { colorLessStyle_Select, customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import { dropDownDataModelForAptNo, handleNumberTextKeyDown } from '../../../CADUtils/functions/common';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import CallTakerServices from "../../../CADServices/APIs/callTaker";
import GeoServices from "../../../CADServices/APIs/geo";
import ReportsServices from "../../../CADServices/APIs/reports";
import { toastifyError } from '../../../Components/Common/AlertMsg';
import { fetchPostData } from '../../../Components/hooks/Api';
import Loader from '../../../Components/Common/Loader';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getShowingDateText, getShowingMonthDateYear, getShowingWithOutTime } from '../../../Components/Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import ReportMainAddress from '../ReportMainAddress/ReportMainAddress';
import { getData_DropDown_IncidentDispositions } from '../../../CADRedux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';

const LocationReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const IncidentDispositionsDrpData = useSelector((state) => state.CADDropDown.IncidentDispositionsDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [CFSDropDown, setCFSDropDown] = useState([]);
    const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
    const [defaultAptSuite, setDefaultAptSuite] = useState(null);
    const [aptInputValue, setAptInputValue] = useState("");
    const [locationStatus, setLocationStatus] = useState(false);
    const [locationData, setLocationData] = useState();
    const [isSelectLocation, setIsSelectLocation] = useState(false);
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [locationReportData, setLocationReportData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);

    const [
        locationReportState,
        setLocationReportState,
        handleLocationReportState,
        clearLocationReportState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        Id: "",
        apt: "",
        location: "",
        CADDisposition: ""
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCallTaker: false,
        showCADEventFrom: false,
        showCADEventTo: false,
        showZone: false,
        showFoundPriorityID: false,
        showFoundCFSLDesc: false,
        showFoundCFSCodeID: false,
        showId: false,
        showApt: false,
        showLocation: false,
        showCADDisposition: false,
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        Id: "",
        apt: "",
        location: "",
        CADDisposition: ""
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
            showFoundPriorityID: searchValue?.FoundPriorityID,
            showFoundCFSLDesc: searchValue?.FoundCFSLDesc,
            showFoundCFSCodeID: searchValue?.FoundCFSCodeID,
            showId: searchValue?.Id,
            showApt: searchValue?.apt,
            showLocation: searchValue?.location,
            showCADDisposition: searchValue?.CADDisposition,
        });
    }, [searchValue]);


    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("CG104", localStoreData?.AgencyID, localStoreData?.PINID));
            if (IncidentDispositionsDrpData?.length === 0 && localStoreData?.AgencyID)
                dispatch(getData_DropDown_IncidentDispositions({ AgencyID: localStoreData?.AgencyID }))
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
            enabled: !!loginAgencyID
        }
    );

    useEffect(() => {
        if (isFetchCFSCodeData && CFSCodeData) {
            const parsedData = JSON.parse(CFSCodeData?.data?.data);
            setCFSDropDown(parsedData?.Table);
        }
    }, [isFetchCFSCodeData, CFSCodeData]);

    const aptSuiteNoPayload = {
        GeoLocationID: locationReportState?.Id,
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
            enabled: !!locationReportState?.Id
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

                    if (!locationReportState?.apt || Object.keys(locationReportState?.apt).length === 0) {
                        handleLocationReportState("apt", defaultValue);
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
    }, [isFetchAptSuiteNoData, aptSuiteNoData, locationReportState?.Id, locationReportState?.location]);

    useEffect(() => {
        if (!locationReportState?.location) {
            setLocationReportState((prevState) => ({
                ...prevState,
                Id: "",
                apt: {}
            }));
        }

        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: locationReportState?.location,
                    AgencyID: loginAgencyID,
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };

        if (locationReportState?.location) {
            fetchLocationData();
        }
    }, [locationReportState?.location, isSelectLocation]);

    const resetFields = () => {
        clearLocationReportState();
        setLocationReportData([]);
        setAgencyData();
        setLoader(false);
        setverifyIncident(false);
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoader(true);
        },
        onAfterPrint: () => {
            setLoader(false);
        }
    });

    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.error("error") }
        })
    }
    const getLocationReportData = async (isPrintReport = false) => {
        setLoader(true);

        if (
            !locationReportState?.reportedFromDate &&
            !locationReportState?.reportedToDate &&
            !locationReportState?.CADEventFrom &&
            !locationReportState?.CADEventTo &&
            !locationReportState?.FoundCFSCodeID &&
            !locationReportState?.location &&
            !locationReportState?.CADDisposition

        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setverifyIncident(false)
            return; // Exit the function if required fields are not filled
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "CADIncidentNumberFrom": locationReportState?.CADEventFrom,
            "CADIncidentNumberTo": locationReportState?.CADEventTo,
            "ReportedDate": locationReportState?.reportedFromDate ? getShowingMonthDateYear(locationReportState?.reportedFromDate) : "",
            "ReportedDateTO": locationReportState?.reportedToDate ? getShowingMonthDateYear(locationReportState?.reportedToDate) : "",
            "CADDispositionID": locationReportState?.CADDisposition?.IncidentDispositionsID,
            "CADCFSCodeID": locationReportState?.FoundCFSCodeID,
            "CrimeLocation": locationReportState?.location,
            "ApartmentNo": locationReportState?.apt?.aptId,
        }

        setSearchValue(locationReportState)

        try {
            const response = await ReportsServices.getLocationReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setLocationReportData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available"); setLocationReportData([]); setAgencyData([])
                    setverifyIncident(false); setLoader(false);
                }

            }
        } catch (error) {
            if (!isPrintReport) {
                toastifyError("Data Not Available");
            }
            setverifyIncident(false); setLoader(false);
        }

    }

    const handlePrintClick = () => {
        setLoader(true)
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getLocationReportData(true); setShowFooter(false);
        }, 100);
    };

    return (
        <>
            <div className="section-body pt-1 p-1 bt" >
                <div className="div">
                    <div className="dark-row" >
                        <div className="col-12 col-sm-12">
                            <div className="card Agency">
                                <div className="card-body pt-3 pb-2" >
                                    <div className="row " style={{ marginTop: '-10px' }}>

                                        <div className="col-12 mt-2">
                                            <fieldset>
                                                <legend>Location Report</legend>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            CAD Event # From
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control  py-1 new-input"
                                                            name="CADEventFrom"
                                                            placeholder="CAD Event # From"
                                                            value={locationReportState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleLocationReportState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handleLocationReportState("CADEventTo", ""); // Clear CADEventTo
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            CAD Event # To
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control  py-1 new-input"
                                                            name="CADEventTo"
                                                            placeholder="CAD Event # To"
                                                            value={locationReportState.CADEventTo}
                                                            onChange={(e) => handleLocationReportState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!locationReportState.CADEventFrom}
                                                        />
                                                    </div>

                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Reported From Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='startDate'
                                                            id='startDate'
                                                            onChange={(date) => {
                                                                handleLocationReportState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleLocationReportState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={locationReportState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={locationReportState?.reportedFromDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select From Date..."
                                                            maxDate={new Date(datezone)}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Reported To Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='reportedToDate'
                                                            id='reportedToDate'
                                                            onChange={(date) => {
                                                                handleLocationReportState("reportedToDate", date);
                                                            }}
                                                            selected={locationReportState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={locationReportState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={locationReportState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!locationReportState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!locationReportState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            CFS
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="CFSLId"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === locationReportState?.FoundCFSCodeID) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleLocationReportState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleLocationReportState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleLocationReportState("FoundPriorityID", v?.PriorityID);
                                                            }}
                                                            placeholder="Select..."
                                                            styles={colorLessStyle_Select}
                                                            className="w-100"
                                                            menuPlacement="bottom"
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
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="CFSLDesc"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === locationReportState?.FoundCFSLDesc) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleLocationReportState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleLocationReportState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleLocationReportState("FoundPriorityID", v?.PriorityID);
                                                            }}
                                                            placeholder="Select..."
                                                            styles={colorLessStyle_Select}
                                                            className="w-100"
                                                            menuPlacement="bottom"
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
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            CAD Disposition
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            isClearable
                                                            placeholder="Select..."
                                                            options={IncidentDispositionsDrpData}
                                                            getOptionLabel={(v) => `${v?.DispositionCode} | ${v?.Description}`}
                                                            getOptionValue={(v) => v?.IncidentDispositionsID}
                                                            styles={colorLessStyle_Select}

                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.DispositionCode} | ${option?.Description}`
                                                                    : option?.DispositionCode;
                                                            }}
                                                            className="w-100"
                                                            value={locationReportState?.CADDisposition}
                                                            onChange={(e) => handleLocationReportState("CADDisposition", e)}
                                                            name="CADDisposition" />
                                                    </div>
                                                </div>

                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Location
                                                        </label>
                                                    </div>
                                                    <div className="col-5 w-100 inner-input-fullw">
                                                        <Location
                                                            {...{
                                                                value: locationReportState,
                                                                setValue: setLocationReportState,
                                                                locationStatus,
                                                                setLocationStatus,
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
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Apt#/Suite
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
                                                            value={locationReportState?.apt || defaultAptSuite} // Set default value
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
                                                                    handleLocationReportState("apt", defaultAptSuite);
                                                                } else {
                                                                    handleLocationReportState("apt", e);
                                                                }
                                                            }}
                                                            isDisabled={!locationReportState?.location || !locationReportState?.Id}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    {effectiveScreenPermission?.[0]?.AddOK ? <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getLocationReportData(false); }} >Show Report</button> : <></>}
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        onClick={() => { resetFields(); }}
                                    >Clear</button>
                                    <Link to={'/cad/dashboard-page'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2">Close</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                verifyIncident &&
                <>
                    <div className="col-12 col-md-12 col-lg-12  px-2" >
                        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
                            <p className="p-0 m-0 d-flex align-items-center">Location Report</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    <i className="fa fa-print" onClick={handlePrintClick}></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="container mt-1" ref={componentRef}>
                        <div className="col-12" >
                            <div className="row" >
                                {/* Report Address */}
                                <ReportMainAddress {...{ multiImage, agencyData }} />

                                <div className="col-12">
                                    <hr style={{ border: '1px solid rgb(3, 105, 184)' }} />
                                    <p className=" py-1 text-center text-white bg-green" style={{
                                        textAlign: "center", fontWeight: "bold", fontSize: "20px"
                                    }}>Location Report</p>
                                </div>
                                <div className="col-12 mt-1 mb-3">
                                    <fieldset>
                                        <legend>Search Criteria</legend>
                                        <div className="row mt-2">
                                            {showFields.showCADEventFrom && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CAD Event# From</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.CADEventFrom}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showCADEventTo && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CAD Event# To</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.CADEventTo}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showReportedFromDate && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported From Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            // value={locationReportState.showReportedFromDate}
                                                            // value={getShowingWithOutTime(locationReportState.reportedFromDate)}
                                                            value={searchValue.reportedFromDate ? getShowingWithOutTime(searchValue.reportedFromDate) : ""}

                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showReportedToDate && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Reported To Date</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            // value={getShowingWithOutTime(locationReportState.reportedToDate)}
                                                            value={searchValue.reportedToDate ? getShowingWithOutTime(searchValue.reportedToDate) : ""}

                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showCADDisposition && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CAD Disposition</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            // value={getShowingWithOutTime(locationReportState.reportedToDate)}
                                                            value={searchValue.CADDisposition?.DispositionCode}

                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className='row'>
                                            {showFields?.showFoundCFSCodeID && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CFS</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-2 text-field mt-1 d-flex">
                                                        <input type="text" className='readonlyColor'
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === searchValue?.FoundCFSCodeID
                                                            )?.CFSCODE}
                                                            readOnly />
                                                    </div>
                                                    <div className="col-6 col-md-6 col-lg-8 text-field mt-1 d-flex">

                                                        <input type="text" className='readonlyColor ml-2'
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === searchValue?.FoundCFSLDesc
                                                            )?.CFSCodeDescription
                                                            }
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="row">
                                            {showFields.showLocation && (
                                                <>

                                                    <div className="col-2 mt-2">
                                                        <label className='new-label'>Location</label>
                                                    </div>
                                                    <div className="col-7 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.location}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields?.showApt?.label && (
                                                <>
                                                    <div className="col-1 mt-2">
                                                        <label className='new-label'>Apt#/Suite</label>
                                                    </div>
                                                    <div className="col-2 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue?.apt?.label}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                                <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                    {[...new Set(locationReportData.map((obj) => `${obj.CrimeLocation} | ${obj.ApartmentNo || "-"}`))]
                                        .map((key) => {
                                            const [CrimeLocation, ApartmentNo] = key.split(" | ");
                                            const filteredData = locationReportData.filter((obj) =>
                                                obj.CrimeLocation === CrimeLocation && (obj.ApartmentNo || "-") === ApartmentNo
                                            );
                                            return (
                                                <div key={key}>
                                                    <p className="py-1 text-center " style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "16px", marginBottom: "5px"
                                                    }}>
                                                        <span>Location: {CrimeLocation || "-"}</span>
                                                        {ApartmentNo && ApartmentNo !== "-" && (
                                                            <span style={{ marginLeft: "30px" }}>Apt#/Suite: {ApartmentNo}</span>
                                                        )}
                                                    </p>
                                                    <div className="table-responsive">
                                                        {filteredData.map((obj, index) => {
                                                            const isLastItem = index === filteredData.length - 1;
                                                            return (
                                                                <div key={obj.CADIncidentNumber}>
                                                                    <>
                                                                        <table className="table table-bordered" style={{ marginBottom: "0px" }}>
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th style={{ width: '200px' }}>CAD Event#</th>
                                                                                    <th style={{ width: '200px' }}>RMS Incident#</th>
                                                                                    <th style={{ width: '130px' }}>Reported DT/TM</th>
                                                                                    <th style={{ width: '130px' }}>Call Taker</th>
                                                                                    <th style={{ width: '130px' }}>Patrol Zone</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                <tr>
                                                                                    <td className="text-list" style={{ width: '200px' }}>{obj.CADIncidentNumber || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '200px' }}>{obj.RMSIncidentNumber || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>{obj.ReportedDate ? getShowingDateText(obj.ReportedDate) : "-"}</td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>{obj.CallTaker || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>{obj.PatrolZone || "-"}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table className="table table-bordered">
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th style={{ width: '130px' }}>CFS Code/Description</th>
                                                                                    <th style={{ width: '130px' }}>CAD Disposition</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                <tr key={index}>
                                                                                    <td className="text-list" style={{ width: '130px' }}> {obj.CFSCodeDescription || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>{obj.CADDisposition || "-"}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        {!isLastItem && (
                                                                            <div className="col-12">
                                                                                <hr style={{ border: '2px solid #001F3F' }} />
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                {showFooter && (
                                    <div className="print-footer">
                                        <div className="text-bold py-1 px-3 mb-4 mr-3 ml-3" style={{ backgroundColor: '#e7eaed', color: 'black', textAlign: 'left', fontSize: "16px" }}>
                                            Printed By: {LoginUserName || '-'} on {getShowingWithOutTime(datezone) || ''}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </>
            }
            {
                loader && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

export default LocationReport