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
import { getData_DropDown_Zone } from '../../../CADRedux/actions/DropDownsData';
const PatrolZoneReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);
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
    const [patrolZoneData, setPatrolZoneData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const [loginPinID, setLoginPinID,] = useState('');
    const [shiftDropDown, setShiftDropDown] = useState([])
    const [zoneDropDown, setZoneDropDown] = useState([])

    const [
        patrolZoneState,
        setPatrolZoneState,
        handlePatrolZoneState,
        clearPatrolZoneState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        shift: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        zone: "",
        location: "",
        Id: "",
        apt: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showCADEventFrom: false,
        showCADEventTo: false,
        showShift: false,
        showFoundPriorityID: false,
        showFoundCFSLDesc: false,
        showFoundCFSCodeID: false,
        showZone: false,
        showLocation: false,
        showId: false,
        showApt: false,
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        CADEventFrom: "",
        CADEventTo: "",
        shift: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        zone: "",
        location: "",
        Id: "",
        apt: "",
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showCADEventFrom: searchValue?.CADEventFrom,
            showCADEventTo: searchValue?.CADEventTo,
            showShift: searchValue?.shift,
            showFoundPriorityID: searchValue?.FoundPriorityID,
            showFoundCFSLDesc: searchValue?.FoundCFSLDesc,
            showFoundCFSCodeID: searchValue?.FoundCFSCodeID,
            showZone: searchValue?.zone,
            showId: searchValue?.Id,
            showApt: searchValue?.apt,
            showLocation: searchValue?.location,
        });
    }, [searchValue]);


    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(parseInt(localStoreData?.PINID));
            GetDataTimeZone(localStoreData?.AgencyID);
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const shiftDataKey = `/CAD/MasterResourceShift/GetData_Shift`;
    const { data: shiftData, isSuccess: isFetchShiftData } = useQuery(
        [shiftDataKey, { AgencyID: loginAgencyID },],
        MasterTableListServices.getShift,
        {
            refetchOnWindowFocus: false,
            enabled: !!loginAgencyID
        }
    );

    useEffect(() => {
        if (shiftData && isFetchShiftData) {
            const data = JSON.parse(shiftData?.data?.data);
            setShiftDropDown(data?.Table || [])
        }
    }, [shiftData, isFetchShiftData])

    const zoneDropDownDataModel = (data, value, label, code) => {
        const result = data?.map((item) => ({
            value: item[value],
            label: item[label],
            code: item[code]
        }));
        return result;
    };

    useEffect(() => {
        if (ZoneDrpData) {
            setZoneDropDown(zoneDropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription", "ZoneCode"));
        }
    }, [ZoneDrpData]);

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
        GeoLocationID: patrolZoneState?.Id,
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
            enabled: !!patrolZoneState?.Id
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

                    if (!patrolZoneState?.apt || Object.keys(patrolZoneState?.apt).length === 0) {
                        handlePatrolZoneState("apt", defaultValue);
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
    }, [isFetchAptSuiteNoData, aptSuiteNoData, patrolZoneState?.Id, patrolZoneState?.location]);

    useEffect(() => {
        if (!patrolZoneState?.location) {
            setPatrolZoneState((prevState) => ({
                ...prevState,
                Id: "",
                apt: {}
            }));
        }

        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: patrolZoneState?.location,
                    AgencyID: loginAgencyID
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };

        if (patrolZoneState?.location) {
            fetchLocationData();
        }
    }, [patrolZoneState?.location, isSelectLocation]);

    const resetFields = () => {
        clearPatrolZoneState();
        setPatrolZoneData([]);
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
            else { console.log("error") }
        })
    }
    const getPatrolZoneData = async (isPrintReport = false) => {
        setLoader(true);

        if (
            !patrolZoneState?.reportedFromDate &&
            !patrolZoneState?.reportedToDate &&
            !patrolZoneState?.CADEventFrom &&
            !patrolZoneState?.CADEventTo &&
            !patrolZoneState?.shift &&
            !patrolZoneState?.FoundCFSCodeID &&
            !patrolZoneState?.zone?.code &&
            !patrolZoneState?.location
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setverifyIncident(false)
            return; // Exit the function if required fields are not filled
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "CADIncidentNumberFrom": patrolZoneState?.CADEventFrom,
            "CADIncidentNumberTo": patrolZoneState?.CADEventTo,
            "ReportedDate": patrolZoneState?.reportedFromDate ? getShowingMonthDateYear(patrolZoneState?.reportedFromDate) : "",
            "ReportedDateTO": patrolZoneState?.reportedToDate ? getShowingMonthDateYear(patrolZoneState?.reportedToDate) : "",
            "CADCFSCodeID": patrolZoneState?.FoundCFSCodeID,
            "Location": patrolZoneState?.location,
            "ApartmentNo": patrolZoneState?.apt?.aptId,
            "ShiftID": patrolZoneState?.shift?.ShiftId,
            "ZoneCode": patrolZoneState?.zone?.code,
            // "ZoneID": patrolZoneState?.zone?.value,
            // "OperatorID": null
            // "ZoneDescription": patrolZoneState?.zone?.label,
        }

        setSearchValue(patrolZoneState)

        try {
            const response = await ReportsServices.getPatrolZoneReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setPatrolZoneData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available"); setPatrolZoneData([]); setAgencyData([])
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
            printForm(); getPatrolZoneData(true); setShowFooter(false);
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
                                                <legend>Patrol Zone</legend>
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
                                                            value={patrolZoneState.CADEventFrom}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                handlePatrolZoneState("CADEventFrom", newValue);
                                                                if (!newValue) {
                                                                    handlePatrolZoneState("CADEventTo", ""); // Clear CADEventTo
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
                                                            value={patrolZoneState.CADEventTo}
                                                            onChange={(e) => handlePatrolZoneState("CADEventTo", e.target.value)}
                                                            onKeyDown={handleNumberTextKeyDown}
                                                            disabled={!patrolZoneState.CADEventFrom}
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
                                                                handlePatrolZoneState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handlePatrolZoneState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={patrolZoneState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={patrolZoneState?.reportedFromDate ? true : false}
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
                                                                handlePatrolZoneState("reportedToDate", date);
                                                            }}
                                                            selected={patrolZoneState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={patrolZoneState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={patrolZoneState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!patrolZoneState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!patrolZoneState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Shift
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            isClearable
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select..."
                                                            getOptionLabel={(v) => v?.ShiftCode + " | " + v?.ShiftDescription}
                                                            getOptionValue={(v) => v?.ShiftId}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.ShiftCode} | ${option?.ShiftDescription}`
                                                                    : option?.ShiftCode;
                                                            }}
                                                            options={shiftDropDown}
                                                            value={patrolZoneState?.shift}
                                                            onChange={(e) => { handlePatrolZoneState("shift", e) }}
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
                                                            CFS
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="CFSLId"
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === patrolZoneState?.FoundCFSCodeID) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handlePatrolZoneState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handlePatrolZoneState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handlePatrolZoneState("FoundPriorityID", v?.PriorityID);
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
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === patrolZoneState?.FoundCFSLDesc) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handlePatrolZoneState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handlePatrolZoneState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handlePatrolZoneState("FoundPriorityID", v?.PriorityID);
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
                                                            Patrol Zone
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={zoneDropDown}

                                                            isClearable
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            value={patrolZoneState?.zone}
                                                            onChange={(e) => { handlePatrolZoneState("zone", e) }}
                                                        />
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
                                                                value: patrolZoneState,
                                                                setValue: setPatrolZoneState,
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
                                                            value={patrolZoneState?.apt || defaultAptSuite} // Set default value
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
                                                                    handlePatrolZoneState("apt", defaultAptSuite);
                                                                } else {
                                                                    handlePatrolZoneState("apt", e);
                                                                }
                                                            }}
                                                            isDisabled={!patrolZoneState?.location || !patrolZoneState?.Id}
                                                        />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getPatrolZoneData(false); }} >Show Report</button>
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
                            <p className="p-0 m-0 d-flex align-items-center">Patrol Zone</p>
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
                                    }}>Patrol Zone Report</p>
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
                                                            // value={patrolZoneState.showReportedFromDate}
                                                            // value={getShowingWithOutTime(patrolZoneState.reportedFromDate)}
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
                                                            // value={getShowingWithOutTime(patrolZoneState.reportedToDate)}
                                                            value={searchValue.reportedToDate ? getShowingWithOutTime(searchValue.reportedToDate) : ""}

                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showShift && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Shift</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.shift?.ShiftDescription}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showZone && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Patrol Zone</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.zone?.label}
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
                                    {[...new Set(patrolZoneData.map((obj) => obj?.PatrolZone))]
                                        .map((PatrolZone) => {
                                            const filteredData = patrolZoneData.filter((obj) => obj.PatrolZone === PatrolZone);
                                            return (
                                                <div>
                                                    <p className="py-1 text-center " style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "16px", marginBottom: "5px"
                                                    }}>
                                                        <span>Patrol Zone: {PatrolZone}</span>

                                                    </p>
                                                    <div className="table-responsive">
                                                        {filteredData.map((obj, index) => {
                                                            const isLastItem = index === filteredData.length - 1;
                                                            return (
                                                                <div>
                                                                    <>
                                                                        <table className="table table-bordered" style={{ marginBottom: "0px" }}>
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th style={{ width: '90px' }}>CAD Event#</th>
                                                                                    <th style={{ width: '120px' }}>Reported DT/TM</th>
                                                                                    <th style={{ width: '160px' }}>Operator Name</th>
                                                                                    <th style={{ width: '160px' }}>Shift</th>
                                                                                    <th style={{ width: '160px' }}>CAD Disposition</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                <tr>
                                                                                    <td className="text-list" style={{ width: '90px' }}>{obj.CADIncidentNumber || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '120px' }}>{obj.ReportedDate ? getShowingDateText(obj.ReportedDate) : "-"}</td>
                                                                                    <td className="text-list" style={{ width: '160px' }}>{obj.OperatorName || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '160px' }}>{obj.Shifts || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '160px' }}>{obj.CADIncidentDispositions || "-"}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table className="table table-bordered" style={{ marginBottom: "0px" }}>
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th >Reported Location</th>
                                                                                    <th style={{ width: '200px' }}>Reported Apt#/Suite</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                <tr key={index}>
                                                                                    <td className="text-list" > {obj.ReportedLocation || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '200px' }}>{obj.ReportedApartmentNo || "-"}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table className="table table-bordered" style={{ marginBottom: "0px" }}>
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th>Reported CFS Code/Description</th>
                                                                                    <th style={{ width: '200px' }}>Reported Priority</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody" style={{ marginBottom: "0px" }}>
                                                                                <tr key={index}>
                                                                                    <td className="text-list" >
                                                                                        {obj.ReportedCODE}{obj.ReportedCFS && `/${obj.ReportedCFS}`}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '200px' }}>{obj.ReportedPriority || "-"}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table className="table table-bordered" style={{ marginBottom: "0px" }}>
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th>Found Location</th>
                                                                                    <th style={{ width: '200px' }}>Found Apt#/Suite</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                <tr key={index}>
                                                                                    <td className="text-list" > {obj.FoundLocation || "-"}</td>
                                                                                    <td className="text-list" style={{ width: '200px' }}>{obj.FoundApartmentNo || "-"}</td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        <table className="table table-bordered">
                                                                            <thead className="text-dark master-table text-bold">
                                                                                <tr>
                                                                                    <th>Found CFS Code/Description</th>
                                                                                    <th style={{ width: '200px' }}>Found Priority</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody className="master-tbody">
                                                                                <tr key={index}>
                                                                                    <td className="text-list" >
                                                                                        {obj.FoundCODE}{obj.FoundCFSCFS && `/${obj.FoundCFSCFS}`}
                                                                                    </td>
                                                                                    <td className="text-list" style={{ width: '200px' }}>{obj.FoundPriority || "-"}</td>
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

export default PatrolZoneReport