import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import Location from '../../Common/Location';
import { colorLessStyle_Select, customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import { dropDownDataModelForAptNo } from '../../../CADUtils/functions/common';
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
import { getData_DropDown_Operator } from '../../../CADRedux/actions/DropDownsData';
import { useDispatch } from 'react-redux';

const MiscStatusResourceReport = () => {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const dispatch = useDispatch();
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
    const [defaultAptSuite, setDefaultAptSuite] = useState(null);
    const [aptInputValue, setAptInputValue] = useState("");
    const [locationStatus, setLocationStatus] = useState(false);
    const [locationData, setLocationData] = useState();
    const [isSelectLocation, setIsSelectLocation] = useState(false);
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [miscStatusResourceData, setMiscStatusResourceData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const [resourceDropDown, setResourceDropDown] = useState([]);
    const [statusData, setStatusData] = useState([])
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);

    const [
        miscStatusState,
        setMiscStatusState,
        handleMiscStatusState,
        clearMiscStatusState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        statusCode: "",
        Id: "",
        apt: "",
        location: "",
        Resource1: "",
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        statusCode: "",
        Id: "",
        apt: "",
        location: "",
        Resource1: "",

    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showPrimaryOfficer: false,
        showSecondaryOfficer: false,
        showStatusCode: false,
        showId: false,
        showApt: false,
        showLocation: false,
        showResource1: false
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showPrimaryOfficer: searchValue?.primaryOfficer,
            showSecondaryOfficer: searchValue?.secondaryOfficer,
            showStatusCode: searchValue?.statusCode,
            showId: searchValue?.Id,
            showApt: searchValue?.apt,
            showLocation: searchValue?.location,
            showResource1: searchValue?.Resource1,
        });
    }, [searchValue]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const getResourcesKey = `/CAD/MasterResource/GetDataDropDown_Resource/${loginAgencyID}`;
    const { data: getResourcesData, isSuccess, refetch, isError: isNoData } = useQuery(
        [getResourcesKey, { AgencyID: loginAgencyID },],
        MasterTableListServices.getDataDropDown_Resource,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID,
        }
    );

    useEffect(() => {
        if (isSuccess && getResourcesData) {
            const data = JSON.parse(getResourcesData?.data?.data);
            setResourceDropDown(data?.Table || [])
        }
    }, [isSuccess, getResourcesData])

    const aptSuiteNoPayload = {
        GeoLocationID: miscStatusState?.Id,
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
            enabled: !!miscStatusState?.Id
        }
    );

    const getMiscellaneousStatusListKey = `/CAD/MasterMiscellaneous/GetDataDropDown_MiscellaneousStatus${loginAgencyID}`;
    const { data: miscellaneousStatusList, isSuccess: isFetchMiscellaneousStatusList } = useQuery(
        [getMiscellaneousStatusListKey, {
            IsActive: 1,
            AgencyID: loginAgencyID,
        }],
        MasterTableListServices.getDataDropDown_MiscellaneousStatus,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID,
        }
    );


    useEffect(() => {
        if (isFetchMiscellaneousStatusList && miscellaneousStatusList) {
            const res = JSON.parse(miscellaneousStatusList?.data?.data);
            const data = res?.Table
            setStatusData(data || [])
        } else {
            setStatusData([])
        }
    }, [isFetchMiscellaneousStatusList, miscellaneousStatusList])

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

                    if (!miscStatusState?.apt || Object.keys(miscStatusState?.apt).length === 0) {
                        handleMiscStatusState("apt", defaultValue);
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
    }, [isFetchAptSuiteNoData, aptSuiteNoData, miscStatusState?.Id, miscStatusState?.location]);

    useEffect(() => {
        if (!miscStatusState?.location) {
            setMiscStatusState((prevState) => ({
                ...prevState,
                Id: "",
                apt: {}
            }));
        }

        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: miscStatusState?.location,
                    AgencyID: loginAgencyID,
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };

        if (miscStatusState?.location) {
            fetchLocationData();
        }
    }, [miscStatusState?.location, isSelectLocation]);

    const resetFields = () => {
        clearMiscStatusState();
        setMiscStatusResourceData([]);
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

    const getIncidentSearchData = async (isPrintReport = false) => {
        setLoader(true);
        if (
            !miscStatusState?.reportedFromDate &&
            !miscStatusState?.reportedToDate &&
            !miscStatusState?.primaryOfficer?.PINID &&
            !miscStatusState?.secondaryOfficer?.PINID &&
            !miscStatusState?.statusCode &&
            !miscStatusState?.location &&
            !miscStatusState?.Resource1
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setverifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "DateFrom": miscStatusState?.reportedFromDate ? getShowingMonthDateYear(miscStatusState?.reportedFromDate) : "",
            "DateTO": miscStatusState?.reportedToDate ? getShowingMonthDateYear(miscStatusState?.reportedToDate) : "",
            "PrimaryOfficerID": miscStatusState?.primaryOfficer?.PINID || "",
            "SecondaryOfficerID": miscStatusState?.secondaryOfficer?.PINID || "",
            "MiscellaneousStatusID": miscStatusState?.statusCode?.lstMiscellaneousID || "",
            "Location": miscStatusState?.location || "",
            "ResourceID": miscStatusState?.Resource1?.ResourceID || "",

        }
        setSearchValue(miscStatusState)
        try {
            const response = await ReportsServices.getMiscellaneousStatusReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setMiscStatusResourceData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available"); setMiscStatusResourceData([]); setAgencyData([])
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
            printForm(); getIncidentSearchData(true); setShowFooter(false);
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
                                                <legend>Misc Status Unit</legend>
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
                                                                handleMiscStatusState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleMiscStatusState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={miscStatusState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={miscStatusState?.reportedFromDate ? true : false}
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
                                                                handleMiscStatusState("reportedToDate", date);
                                                            }}
                                                            selected={miscStatusState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={miscStatusState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={miscStatusState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!miscStatusState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!miscStatusState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Primary Officer
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={OperatorDrpData}
                                                            getOptionLabel={(v) => v?.displayName}
                                                            getOptionValue={(v) => v?.PINID}
                                                            value={miscStatusState?.primaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleMiscStatusState("primaryOfficer", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Secondary  Officer
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={OperatorDrpData}
                                                            getOptionLabel={(v) => v?.displayName}
                                                            getOptionValue={(v) => v?.PINID}
                                                            value={miscStatusState?.secondaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleMiscStatusState("secondaryOfficer", e) }}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label">
                                                            Misc. Status
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">

                                                        <Select
                                                            className="w-100"
                                                            isClearable
                                                            options={statusData}
                                                            placeholder="Select..."
                                                            name="statusCode"
                                                            value={miscStatusState?.statusCode}
                                                            onChange={(selectedOptions) => {
                                                                handleMiscStatusState("statusCode", selectedOptions);
                                                            }}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.MiscellaneousStatusCode} | ${option?.Description}`
                                                                    : option?.MiscellaneousStatusCode;
                                                            }}
                                                            styles={colorLessStyle_Select}
                                                            maxMenuHeight={180}
                                                            getOptionLabel={(v) => v?.MiscellaneousStatusCode}
                                                            getOptionValue={(v) => v?.lstMiscellaneousID}
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
                                                <div className='row mb-1 mt-2 ml-4'>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Location
                                                        </label>
                                                    </div>
                                                    <div className="col-5 w-100 inner-input-fullw">
                                                        <Location
                                                            {...{
                                                                value: miscStatusState,
                                                                setValue: setMiscStatusState,
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
                                                            Unit #
                                                        </label>
                                                    </div>
                                                    <div className="col-2 w-100">
                                                        <Select
                                                            isClearable
                                                            options={resourceDropDown}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={miscStatusState?.Resource1}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            onChange={(e) => {

                                                                handleMiscStatusState("Resource1", e);
                                                            }}
                                                            styles={customStylesWithOutColorArrow}
                                                            maxMenuHeight={145}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            isSearchable={true}
                                                        />
                                                        {/* <Select
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={aptSuiteNoDropDown}
                                                            getOptionLabel={(v) => v?.label}
                                                            getOptionValue={(v) => v?.aptId}
                                                            isClearable
                                                            value={miscStatusState?.apt || defaultAptSuite} // Set default value
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
                                                                    handleMiscStatusState("apt", defaultAptSuite);
                                                                } else {
                                                                    handleMiscStatusState("apt", e);
                                                                }
                                                            }}
                                                            isDisabled={!miscStatusState?.location || !miscStatusState?.Id}
                                                        /> */}
                                                    </div>
                                                </div>

                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getIncidentSearchData(false); }} >Show Report</button>
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
                            <p className="p-0 m-0 d-flex align-items-center">Misc Status Unit Report</p>
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
                                    }}>Misc Status Unit Report</p>
                                </div>
                                <div className="col-12 mt-1 mb-3">
                                    <fieldset>
                                        <legend>Search Criteria</legend>
                                        <div className="row mt-2">
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
                                            {showFields.showPrimaryOfficer && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Primary Officer</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.primaryOfficer?.displayName2 || ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showSecondaryOfficer && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Secondary Officer</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.secondaryOfficer?.displayName2 || ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )} {showFields.showStatusCode && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Misc. Status</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.statusCode?.MiscellaneousStatusCode || ""}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                            {showFields.showResource1 && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Unit #</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue?.Resource1?.ResourceNumber}
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

                                        </div>
                                    </fieldset>
                                </div>

                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                        {[
                                            ...new Set(miscStatusResourceData.map((obj) => obj.ResourceNumber)),
                                        ].map((resourceNumber) => {
                                            const filteredData = miscStatusResourceData.filter((obj) => obj.ResourceNumber === resourceNumber);
                                            return (
                                                <div>
                                                    <p className="py-1 text-center" style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px"
                                                    }}>Unit #: {resourceNumber || "-"}</p>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th className="" style={{ width: '80px' }}>Misc. Status</th>
                                                                    <th className="" style={{ width: '90px' }}>Primary Officer</th>
                                                                    <th className="" style={{ width: '90px' }}>Secondary Officer</th>
                                                                    <th className="" style={{ width: '150px' }}>Location</th>
                                                                    <th className="" style={{ width: '100px' }}>From - To</th>
                                                                    <th className="" style={{ width: '70px' }}>Total Time(HH:MM)</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="master-tbody">
                                                                {filteredData.map((obj) => (
                                                                    <tr>
                                                                        <td className="text-list" style={{ width: '80px' }}>
                                                                            {/* {obj.ReportedDate && getShowingDateText(obj.ReportedDate)} */}
                                                                            {obj.MiscStatus}
                                                                        </td>
                                                                        <td className="text-list" style={{ width: '90px' }}>{obj.PrimaryOfficer}</td>
                                                                        <td className="text-list" style={{ width: '90px' }}>{obj.SecondaryOfficer}</td>
                                                                        <td className="text-list" style={{ width: '150px' }}>{obj.Location}</td>
                                                                        <td className="text-list" style={{ width: '100px' }}>
                                                                            {obj.From && getShowingDateText(obj.From)} To {obj.To && getShowingDateText(obj.To)}

                                                                        </td>
                                                                        <td className="text-list" style={{ width: '70px' }}>{obj.TotalTime}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
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

export default MiscStatusResourceReport