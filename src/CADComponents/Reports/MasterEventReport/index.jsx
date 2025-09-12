import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import Location from '../../Common/Location';
import { colorLessStyle_Select, customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import { dropDownDataModelForAptNo, handleNumberTextKeyDown, isNotEmpty } from '../../../CADUtils/functions/common';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
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

const MasterEventReport = () => {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { datezone, GetDataTimeZone, } = useContext(AgencyContext);
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
    const [eventReceiveData, setEventReceiveData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);

    const [
        masterEventReportState,
        setMasterEventReport,
        handleMasterEventReportState,
        clearMasterEventReportState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        RMSIncidentFrom: "",
        RMSIncidentTo: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        Id: "",
        apt: "",
        location: "",
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        RMSIncidentFrom: "",
        RMSIncidentTo: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        Id: "",
        apt: "",
        location: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCADEventFrom: false,
        showCADEventTo: false,
        showRMSIncidentFrom: false,
        showRMSIncidentTo: false,
        showFoundPriorityID: false,
        showFoundCFSLDesc: false,
        showFoundCFSCodeID: false,
        showId: false,
        showApt: false,
        showLocation: false,
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
            showRMSIncidentTo: searchValue?.RMSIncidentTo,
            showRMSIncidentFrom: searchValue?.RMSIncidentFrom,
            showFoundPriorityID: searchValue?.FoundPriorityID,
            showFoundCFSLDesc: searchValue?.FoundCFSLDesc,
            showFoundCFSCodeID: searchValue?.FoundCFSCodeID,
            showId: searchValue?.Id,
            showApt: searchValue?.apt,
            showLocation: searchValue?.location,
        });
    }, [searchValue]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
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
            enabled: !!loginAgencyID, // Only fetch if loginAgencyID is available
        }
    );

    useEffect(() => {
        if (isFetchCFSCodeData && CFSCodeData) {
            const parsedData = JSON.parse(CFSCodeData?.data?.data);
            setCFSDropDown(parsedData?.Table);
        }
    }, [isFetchCFSCodeData, CFSCodeData]);

    const aptSuiteNoPayload = {
        GeoLocationID: masterEventReportState?.Id,
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
            enabled: !!masterEventReportState?.Id
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

                    if (!masterEventReportState?.apt || Object.keys(masterEventReportState?.apt).length === 0) {
                        handleMasterEventReportState("apt", defaultValue);
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
    }, [isFetchAptSuiteNoData, aptSuiteNoData, masterEventReportState?.Id, masterEventReportState?.location]);

    useEffect(() => {
        if (!masterEventReportState?.location) {
            setMasterEventReport((prevState) => ({
                ...prevState,
                Id: "",
                apt: {}
            }));
        }

        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: masterEventReportState?.location,
                    AgencyID: loginAgencyID,
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };

        if (masterEventReportState?.location) {
            fetchLocationData();
        }
    }, [masterEventReportState?.location, isSelectLocation]);

    const resetFields = () => {
        clearMasterEventReportState();
        setEventReceiveData([]);
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

    const getMasterEventReport = async (isPrintReport = false) => {
        setLoader(true);
        if (
            !masterEventReportState?.reportedFromDate &&
            !masterEventReportState?.reportedToDate &&
            !masterEventReportState?.CADEventFrom &&
            !masterEventReportState?.RMSIncidentTo &&
            !masterEventReportState?.RMSIncidentFrom &&
            !masterEventReportState?.CADEventTo &&
            !masterEventReportState?.FoundCFSCodeID &&
            !masterEventReportState?.location
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setverifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "CADIncidentNumberFrom": masterEventReportState?.CADEventFrom,
            "CADIncidentNumberTo": masterEventReportState?.CADEventTo,
            "CADCFSCodeID": masterEventReportState?.FoundCFSCodeID,
            "ApartmentNo": masterEventReportState?.apt?.aptId,
            "CrimeLocation": masterEventReportState?.location,
            "ReportedDate": masterEventReportState?.reportedFromDate ? getShowingMonthDateYear(masterEventReportState?.reportedFromDate) : "",
            "ReportedDateTO": masterEventReportState?.reportedToDate ? getShowingMonthDateYear(masterEventReportState?.reportedToDate) : "",
            "IncidentNumberFrom": masterEventReportState?.RMSIncidentFrom,
            "IncidentNumberTo": masterEventReportState?.RMSIncidentTo,
        }

        setSearchValue(masterEventReportState)

        try {
            const response = await ReportsServices.getEventMasterReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setEventReceiveData(data);
                setAgencyData(data?.Table6[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available"); setEventReceiveData([]); setAgencyData([])
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
            printForm(); getMasterEventReport(true); setShowFooter(false);
        }, 100);
    };

    const groupByResourceNumber = (data) => {
        const groupedData = {};
    
        data.forEach(item => {
            const key = `${item.ResourceNumber}|${item.PrimaryOfficeR}|${item.ZoneDescription}|${item.ShiftDescription}|${item.SecondaryOfficer}|${item.ResourceType}`;
            if (!groupedData[key]) {
                groupedData[key] = {
                    ResourceNumber: item.ResourceNumber,
                    ResourceType: item.ResourceType,
                    PrimaryOfficeR: item.PrimaryOfficeR,
                    SecondaryOfficer: item.SecondaryOfficer,
                    ShiftDescription: item.ShiftDescription,
                    ZoneDescription: item.ZoneDescription,
                    Status: []
                };
            }
            groupedData[key].Status.push({
                Status: item.Status,
                StatusDT: item.StatusDT
            });
        });
        return Object.values(groupedData);
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
                                                <legend>Master Event Report</legend>
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
                                                            value={masterEventReportState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleMasterEventReportState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handleMasterEventReportState("CADEventTo", ""); // Clear CADEventTo
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
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
                                                            value={masterEventReportState.CADEventTo}
                                                            onChange={(e) => handleMasterEventReportState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!masterEventReportState.CADEventFrom}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            RMS Incident # From
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control  py-1 new-input"
                                                            name="RMSIncidentFrom"
                                                            placeholder="RMS Incident # From"
                                                            value={masterEventReportState.RMSIncidentFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handleMasterEventReportState("RMSIncidentFrom", newValue);
                                                                if (!newValue) {
                                                                    handleMasterEventReportState("RMSIncidentTo", ""); // Clear CADEventTo
                                                                }
                                                            }}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                        />
                                                    </div>
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            RMS Incident # To
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <input
                                                            type="text"
                                                            className="form-control  py-1 new-input"
                                                            name="RMSIncidentTo"
                                                            placeholder="RMS Incident # To"
                                                            value={masterEventReportState.RMSIncidentTo}
                                                            onChange={(e) => handleMasterEventReportState("RMSIncidentTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!masterEventReportState.RMSIncidentFrom}
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
                                                                handleMasterEventReportState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleMasterEventReportState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={masterEventReportState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={masterEventReportState?.reportedFromDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select From Date..."
                                                            maxDate={new Date(datezone)}
                                                        />
                                                    </div>
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Reported To Date
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <DatePicker
                                                            name='reportedToDate'
                                                            id='reportedToDate'
                                                            onChange={(date) => {
                                                                handleMasterEventReportState("reportedToDate", date);
                                                            }}
                                                            selected={masterEventReportState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={masterEventReportState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            // minDate={eventReceiveSourceState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!masterEventReportState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!masterEventReportState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            CFS
                                                        </label>
                                                    </div>
                                                    <div className="col-3 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="CFSLId"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === masterEventReportState?.FoundCFSCodeID) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleMasterEventReportState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleMasterEventReportState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleMasterEventReportState("FoundPriorityID", v?.PriorityID);
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
                                                    <div className="col-4 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="CFSLDesc"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === masterEventReportState?.FoundCFSLDesc) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleMasterEventReportState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleMasterEventReportState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleMasterEventReportState("FoundPriorityID", v?.PriorityID);
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
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Location
                                                        </label>
                                                    </div>
                                                    <div className="col-4 w-100 inner-input-fullw">
                                                        <Location
                                                            {...{
                                                                value: masterEventReportState,
                                                                setValue: setMasterEventReport,
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
                                                            value={masterEventReportState?.apt || defaultAptSuite} // Set default value
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
                                                                    handleMasterEventReportState("apt", defaultAptSuite);
                                                                } else {
                                                                    handleMasterEventReportState("apt", e);
                                                                }
                                                            }}
                                                            isDisabled={!masterEventReportState?.location || !masterEventReportState?.Id}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getMasterEventReport(false); }} >Show Report</button>
                                    <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        onClick={() => { resetFields(); }}
                                    >Clear</button>
                                    <Link to={'/cad/dashboard-page'}>
                                        <button className="btn btn-sm bg-green text-white px-2 py-1 ml-2"
                                        >Close</button>
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
                            <p className="p-0 m-0 d-flex align-items-center">Master Event Report</p>
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
                                    }}>Master Event Report</p>
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
                                            {showFields.showRMSIncidentFrom && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>RMS Incident # From</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.RMSIncidentFrom}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showRMSIncidentTo && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>RMS Incident # To</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.RMSIncidentTo}
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
                                                            value={searchValue.reportedToDate ? getShowingWithOutTime(searchValue.reportedToDate) : ""}
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
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Location</label>
                                                    </div>
                                                    <div className="col-7 col-md-7 col-lg-8 text-field mt-1">
                                                        <input
                                                            type="text"
                                                            className='readonlyColor'
                                                            value={searchValue.location}
                                                            readOnly
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {showFields?.showApt?.label && (
                                                <>
                                                    <div className="col-1 col-md-1 col-lg-1 mt-2">
                                                        <label className='new-label'>Apt#/Suite</label>
                                                    </div>
                                                    <div className="col-1 col-md-1 col-lg-1 text-field mt-1">
                                                        <input
                                                            type="text"
                                                            className='readonlyColor'
                                                            value={searchValue?.apt?.label}
                                                            readOnly
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>
                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>

                                        {[...new Set(eventReceiveData.Table.map(item => item.CADIncidentNumber))].map((cadNumber) => {
                                            const filteredData = eventReceiveData.Table.filter((obj) => obj.CADIncidentNumber === cadNumber);
                                            const commonData = filteredData[0];

                                            const resourceData = eventReceiveData.Table1.filter((resource) => resource.IncidentID === commonData.incidentid);
                                            const commentData = eventReceiveData.Table2.filter((comment) => comment.incidentid === commonData.incidentid);
                                            const nameData = eventReceiveData.Table3.filter((name) => name.incidentid === commonData.incidentid);
                                            const propertyData = eventReceiveData.Table4.filter((property) => property.incidentid === commonData.incidentid);
                                            const vehicleData = eventReceiveData.Table5.filter((vehicle) => vehicle.IncidentID === commonData.incidentid);
                                            const mergedData = groupByResourceNumber(resourceData);
                                            return (
                                                <div>
                                                    <p className="py-1 text-center mt-5" style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px"
                                                    }}>CAD Event #:{commonData?.CADIncidentNumber}</p>

                                                    <div className="col-12  mt-2" >
                                                        <div className="col-12 mb-2">
                                                            <div className="row mt-2">
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.CADIncidentNumber}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>CAD Event #</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.IncidentNumber}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>RMS Incident#</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.MasterIncidentNumber}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Master Incident#</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.ReportedDate && getShowingDateText(commonData?.ReportedDate)}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Reported DT/TM</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-2" >
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.ReportedCODE}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Reported CFS Code</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-9 col-md-9 col-lg-9 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.ReportedCFS}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Reported CFS Description</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-2" >
                                                                <div className="col-6 col-md-6 col-lg-6 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.ReportedLocation}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Reported Location</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.ReportdApartmentNo}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Reported Apt#/Suite</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.ReportedPriority}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Reported Priority</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-2" >
                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.FoundCODE}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Found CFS Code</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-9 col-md-9 col-lg-9 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.FoundCFSCFS}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Found CFS Description</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-2" >
                                                                <div className="col-8 col-md-8 col-lg-8 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.FoundLocation}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Found Location</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.FoundApartmentNo}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Found Apt#/Suite</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-2 col-md-2 col-lg-2 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.FoundPriority}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Found Priority</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row mt-2" >
                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.OperatorName}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Call Taker</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.ReceiveSource}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>Receive Source</label>
                                                                    </div>
                                                                </div>
                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                    <div className='text-field'>
                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                            value={commonData?.CADDisposition}
                                                                        />
                                                                        <label htmlFor="" className='new-summary'>CAD Disposition</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Resource Information */}
                                                    {mergedData?.length > 0 &&
                                                        <>
                                                            <p className="py-1 mt-4" style={{
                                                                textAlign: "first", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderBottom: "2px solid"
                                                            }}>Unit Information</p>

                                                            {mergedData.map((resource, index) => {
                                                                const isLastItem = index === mergedData.length - 1;
                                                                return (
                                                                    <div className="table-responsive">
                                                                        <table className="table table-bordered mb-0">
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th className="" style={{ width: '130px' }}>Unit #</th>
                                                                                    <th className="" style={{ width: '130px' }}>Unit Type</th>
                                                                                    <th className="" style={{ width: '150px' }}>Primary Officer</th>
                                                                                    <th className="" style={{ width: '150px' }}>Secondary Officer</th>
                                                                                    <th className="" style={{ width: '150px' }}>Shift</th>
                                                                                    <th className="" style={{ width: '150px' }}>Patrol Zone</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">

                                                                                <tr>
                                                                                    <td className="text-list" style={{ width: '130px' }}>
                                                                                        {resource.ResourceNumber}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>
                                                                                        {resource.ResourceType}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '150px' }}>
                                                                                        {resource.PrimaryOfficeR}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '150px' }}>
                                                                                        {resource.SecondaryOfficer}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '150px' }}>
                                                                                        {resource.ShiftDescription}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '150px' }}>
                                                                                        {resource.ZoneDescription}
                                                                                    </td>
                                                                                </tr>
                                                                                {/* ))} */}
                                                                            </tbody>
                                                                        </table>
                                                                        <table className="table table-bordered">
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th className="" style={{ width: '130px' }}>Status</th>
                                                                                    <th className="" style={{ width: '130px' }}>Status DT/TM</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                {resource?.Status?.map((obj) => (
                                                                                    <tr>
                                                                                        <td className="text-list" style={{ width: '130px' }}>
                                                                                            {obj.Status}
                                                                                        </td>
                                                                                        <td className="text-list" style={{ width: '130px' }}>
                                                                                            {obj.StatusDT && getShowingDateText(obj.StatusDT)}
                                                                                        </td>

                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                        {!isLastItem && (
                                                                            <div className="col-12">
                                                                                <hr style={{ border: '2px solid #001F3F' }} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}

                                                        </>
                                                    }
                                                    {/* Comment Information */}
                                                    {commentData?.length > 0 &&
                                                        <>
                                                            <p className="py-1 " style={{
                                                                textAlign: "first", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderBottom: "2px solid"
                                                            }}>Comment Information</p>
                                                            {commentData.map((comment) => {
                                                                return (
                                                                    <div className="table-responsive">

                                                                        <table className="table table-bordered">
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th className="" style={{ width: '130px' }}>Comment DT/TM</th>
                                                                                    <th className="" style={{ width: '130px' }}>Operator Name</th>
                                                                                    <th className="" style={{ width: '130px' }}>Comments</th>
                                                                                    <th className="" style={{ width: '130px' }}>Unit #</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                {/* {filteredData.map((obj) => ( */}
                                                                                <tr>
                                                                                    <td className="text-list" style={{ width: '130px' }}>
                                                                                        {comment.CommentDateTime && getShowingDateText(comment.CommentDateTime)}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>
                                                                                        {comment.OperatorName}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>
                                                                                        {comment.Comments}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '130px' }}>
                                                                                        {comment.ResourceNumber}
                                                                                    </td>

                                                                                </tr>
                                                                                {/* ))} */}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )
                                                            })}
                                                        </>
                                                    }

                                                    {/* Name Information */}
                                                    {nameData?.length > 0 &&
                                                        <>
                                                            <p className="py-1 " style={{
                                                                textAlign: "first", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderBottom: "2px solid"
                                                            }}>Name Information</p>
                                                            {nameData.map((name) => {
                                                                return (
                                                                    <div className="row col-12  mt-2">
                                                                        <div className="col-2 mb-2 mt-3" style={{
                                                                            fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderRight: "3px solid #E1DFDF"
                                                                        }}>
                                                                            <div className='text-field '>
                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                    value={name?.NameIDNumber}
                                                                                />
                                                                                <label htmlFor="" className='new-summary'>MNI</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-10 mb-2">
                                                                            <div className="row mt-2">
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.NameType}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Name Type</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={`${name?.FirstName || ''} ${name?.LastName || ''}`}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Name</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.Suffix}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Suffix</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.Gender}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Gender</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.DateOfBirth && getShowingWithOutTime(name?.DateOfBirth)}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>DOB</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-7 col-md-7 col-lg-7 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.Description_Race}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Race</label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.Ethnicity}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Ethnicity</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.SSN}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>SSN</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.DLNumber}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>DL#</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.Contact}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Contact#</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.HairColor}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Hair Color</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.EyeColor}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Eye Color</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <div className='row'>
                                                                                            <div className='col-5 col-md-5 col-lg-5'>
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={name?.WeightFrom}
                                                                                                />
                                                                                            </div>
                                                                                            <div className='col-1 col-md-1 col-lg-1' >
                                                                                                <span className='dash-name mt-1' style={{ marginRight: '-10px' }}>__</span>
                                                                                            </div>
                                                                                            <div className='col-6 col-md-6 col-lg-6'>
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={name?.WeightTo}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <label htmlFor="" className='new-summary'>Weight(LBS)</label>
                                                                                    </div>

                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <div className='row'>
                                                                                            <div className='col-5 col-md-5 col-lg-5'>
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={name?.HeightFrom}
                                                                                                />
                                                                                            </div>
                                                                                            <div className='col-1 col-md-1 col-lg-1' >
                                                                                                <span className='dash-name mt-1' style={{}}>__</span>
                                                                                            </div>
                                                                                            <div className='col-6 col-md-6 col-lg-6'>
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={name?.HeightTo}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <label htmlFor="" className='new-summary'>Height(FT)</label>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.NameReasonCode}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Reason Code</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-12 col-md-12 col-lg-12 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={name?.Address}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Address</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </>
                                                    }

                                                    {/* Property Information */}
                                                    {propertyData?.length > 0 &&
                                                        <>
                                                            <p className="py-1 " style={{
                                                                textAlign: "first", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderBottom: "2px solid"
                                                            }}>Property Information</p>

                                                            {propertyData.map((property) => {
                                                                return (
                                                                    <div className="row col-12  mt-2">
                                                                        <div className="col-2 mb-2 mt-3" style={{
                                                                            fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderRight: "3px solid #E1DFDF"
                                                                        }}>
                                                                            <div className='text-field '>
                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                    value={property?.PropertyNumber}
                                                                                />
                                                                                <label htmlFor="" className='new-summary'>Property#</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-10 mb-2">
                                                                            <div className="row mt-2">
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.PropertyType_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Property Type</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.PropertyCategory_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Property Category</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.PropertyClassification_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Property Classification</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.ReportedDtTm && getShowingDateText(property?.ReportedDtTm)}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Reported Date</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.Value}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Value</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-7 col-md-7 col-lg-7 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.PropertyLossCode_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Loss Code</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-7 col-md-7 col-lg-7 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.PossessionOf_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>In Possession Of</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={property?.Officer_Name}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Primary Officer</label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </>
                                                    }

                                                    {/* Vehicle Information */}
                                                    {vehicleData?.length > 0 &&
                                                        <>
                                                            <p className="py-1 " style={{
                                                                textAlign: "first", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderBottom: "2px solid"
                                                            }}>Vehicle Information</p>
                                                            {vehicleData.map((vehicle) => {
                                                                return (
                                                                    <div className="row col-12  mt-2">
                                                                        <div className="col-2 mb-2 mt-3" style={{
                                                                            fontWeight: "bold", fontSize: "20px", marginBottom: "5px", borderRight: "3px solid #E1DFDF"
                                                                        }}>
                                                                            <div className='text-field '>
                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                    value={vehicle?.VehicleNumber}
                                                                                />
                                                                                <label htmlFor="" className='new-summary'>Vehicle#</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-10 mb-2">
                                                                            <div className="row mt-2">
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Category_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Vehicle Category</label>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Classification_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Vehicle Classification</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.PrimaryOfficer_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Officer Name</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.ReportedDtTm && getShowingDateText(vehicle?.ReportedDtTm)}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Reported Date</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-2 col-md-2 col-lg-2 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Value}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Value</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <div className='row'>
                                                                                            <div className='col-5 col-md-5 col-lg-5'>
                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={vehicle?.PlateState}
                                                                                                />
                                                                                            </div>
                                                                                            <div className='col-7 col-md-7 col-lg-7'>

                                                                                                <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                                    value={vehicle?.PlateID}
                                                                                                />
                                                                                            </div>

                                                                                        </div>
                                                                                        <label htmlFor="" className='new-summary'>Plate State & No.</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.VIN}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>VIN</label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.PlateType_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Plate Type</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.PlateExpireDtTm && getShowingDateText(vehicle?.PlateExpireDtTm)}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Plate Expires</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.PrimaryOfficer_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Primary Officer</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Weight}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Weight</label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.VOD_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>VOD</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Owner_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Owner</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.PossessionOf_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>In Possession Of</label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-4 col-md-4 col-lg-4 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Make_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Make</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Model_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Model</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.Style_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Style</label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="row mt-2" >
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2 ">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.PrimaryColor_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Primary Color</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-3 col-md-3 col-lg-3 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.SecondaryColor_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Secondary Color</label>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-6 col-md-6 col-lg-6 mt-2">
                                                                                    <div className='text-field'>
                                                                                        <input type="text" className='readonlyColor' name='DocFileName' required readOnly
                                                                                            value={vehicle?.LossCode_Description}
                                                                                        />
                                                                                        <label htmlFor="" className='new-summary'>Loss Code</label>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </>
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
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

export default MasterEventReport