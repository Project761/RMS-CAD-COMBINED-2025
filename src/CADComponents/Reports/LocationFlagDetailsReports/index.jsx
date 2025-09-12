import React, { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import Location from '../../Common/Location';
import { customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import { dropDownDataModelForAptNo, isEmpty } from '../../../CADUtils/functions/common';
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

const LocationFlagDetailsReports = () => {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const [
        locationFlagState,
        setLocationFlagState,
        handleLocationFlagState,
        clearLocationFlagState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        Id: "",
        apt: "",
        location: "",
        flagName: ""
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        Id: "",
        apt: "",
        location: "",
        flagName: "",
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showId: false,
        showApt: false,
        showLocation: false,
        showFlagName: false,
    });
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [aptSuiteNoDropDown, setAptSuiteNoDropDown] = useState([]);
    const [defaultAptSuite, setDefaultAptSuite] = useState(null);
    const [aptInputValue, setAptInputValue] = useState("");
    const [locationStatus, setLocationStatus] = useState(false);
    const [locationData, setLocationData] = useState();
    const [isSelectLocation, setIsSelectLocation] = useState(false);
    const [loder, setLoder] = useState(false);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [locationFlagDetails, setLocationFlagDetails] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const [flagData, setFlagData] = useState([]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showId: searchValue?.Id,
            showApt: searchValue?.apt,
            showLocation: searchValue?.location,
            showFlagName: searchValue?.flagName,
        });
    }, [searchValue]);

    const flagPayload = {
        AptID: locationFlagState?.apt?.aptId,
        FlagFromId: locationFlagState?.Id,
        FlagFrom: "GEO",
        AgencyID: loginAgencyID,
        Action: "Get_All_On_CallTaker"
    }

    const getTypeOfFlagKey = `/CAD/MasterTypeOfFlag/GetData_DropDown_Flag/${loginAgencyID}`;
    const { data: getTypeOfFlagData, isSuccess: isFetchGetTypeOfFlag, refetch, isError: isNoData } = useQuery(
        [getTypeOfFlagKey, {
            "AgencyID": loginAgencyID,
        },],
        MasterTableListServices.getData_DropDown_Flag,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!loginAgencyID
        }
    );
    useEffect(() => {
        if (getTypeOfFlagData && isFetchGetTypeOfFlag) {
            const data = JSON.parse(getTypeOfFlagData?.data?.data);
            setFlagData(data?.Table)
        } else {
            setFlagData([])
        }
    }, [getTypeOfFlagData, isFetchGetTypeOfFlag])


    const aptSuiteNoPayload = {
        GeoLocationID: locationFlagState?.Id,
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
            enabled: !!locationFlagState?.Id
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

                    if (!locationFlagState?.apt || Object.keys(locationFlagState?.apt).length === 0) {
                        handleLocationFlagState("apt", defaultValue);
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
    }, [isFetchAptSuiteNoData, aptSuiteNoData, locationFlagState?.Id, locationFlagState?.location]);

    useEffect(() => {
        if (!locationFlagState?.location) {
            setLocationFlagState((prevState) => ({
                ...prevState,
                Id: "",
                apt: {}
            }));
        }

        const fetchLocationData = async () => {
            try {
                const response = await GeoServices.getLocationData({
                    Location: locationFlagState?.location,
                    AgencyID: loginAgencyID
                });
                const data = JSON.parse(response?.data?.data)?.Table || [];
                setLocationData(data);

            } catch (error) {
                console.error("Error fetching location data:", error);
                setLocationData([]);
            }
        };
        if (locationFlagState?.location) {
            fetchLocationData();
        }
    }, [locationFlagState?.location, isSelectLocation]);





    const resetFields = () => {
        clearLocationFlagState();
        setLocationFlagDetails([]);
        setAgencyData();
        setLoder(false);
        setverifyIncident(false);
    }

    const componentRef = useRef();
    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        onBeforeGetContent: () => {
            setLoder(true);
        },
        onAfterPrint: () => {
            setLoder(false);
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
    const getLocationFlagDetails = async (isPrintReport = false) => {
        setLoder(true);

        if (
            !locationFlagState?.reportedFromDate &&
            !locationFlagState?.reportedToDate &&
            !locationFlagState?.location &&
            !locationFlagState?.flagName
        ) {
            toastifyError("Please enter at least one detail");
            setLoder(false);
            setverifyIncident(false)
            return; // Exit the function if required fields are not filled
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "StartDateFrom": locationFlagState?.reportedFromDate ? getShowingMonthDateYear(locationFlagState?.reportedFromDate) : "",
            "StartDateTo": locationFlagState?.reportedToDate ? getShowingMonthDateYear(locationFlagState?.reportedToDate) : "",
            "Location": locationFlagState?.location,
            "ApartmentNo": locationFlagState?.apt?.aptId,
            "FlagID": locationFlagState?.flagName?.FlagID
        }
        setSearchValue(locationFlagState)

        try {
            const response = await ReportsServices.getLocationFlagDetails(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setLocationFlagDetails(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoder(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setLocationFlagDetails([]);
                    setAgencyData([])
                    setverifyIncident(false);
                    setLoder(false);
                }
            }
        } catch (error) {
            console.log("error", error)
            if (!isPrintReport) {
                toastifyError("Data Not Available");
            }
            setverifyIncident(false);
            setLoder(false);
        }
    }

    const handlePrintClick = () => {
        setLoder(true)

        setShowFooter(true);
        setTimeout(() => {
            printForm(); getLocationFlagDetails(true); setShowFooter(false);
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
                                                <legend>Location Flag Report</legend>
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
                                                                handleLocationFlagState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleLocationFlagState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={locationFlagState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={locationFlagState?.reportedFromDate ? true : false}
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
                                                                handleLocationFlagState("reportedToDate", date);
                                                            }}
                                                            selected={locationFlagState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={locationFlagState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={locationFlagState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!locationFlagState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!locationFlagState?.reportedFromDate && 'readonlyColor'}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex align-self-center justify-content-end">
                                                        <label for="" className="tab-form-label text-nowrap">
                                                            Flag
                                                        </label>
                                                    </div>
                                                    <div className="col-2 d-flex align-self-center justify-content-end">
                                                        <Select
                                                            name="flagName"
                                                            styles={customStylesWithOutColorArrow}
                                                            placeholder="Select"
                                                            options={flagData}
                                                            getOptionLabel={(v) => v?.FlagNameCode}
                                                            getOptionValue={(v) => v?.FlagID}
                                                            isClearable
                                                            value={locationFlagState?.flagName}
                                                            className="w-100"
                                                            onChange={(e) => { handleLocationFlagState("flagName", e) }}
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
                                                                value: locationFlagState,
                                                                setValue: setLocationFlagState,
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
                                                            value={locationFlagState?.apt || defaultAptSuite} // Set default value
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
                                                                    handleLocationFlagState("apt", defaultAptSuite);
                                                                } else {
                                                                    handleLocationFlagState("apt", e);
                                                                }
                                                            }}
                                                            isDisabled={!locationFlagState?.location || !locationFlagState?.Id}
                                                        />
                                                    </div>
                                                </div>


                                            </fieldset>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getLocationFlagDetails(false); }} >Show Report</button>
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
                            <p className="p-0 m-0 d-flex align-items-center">Location Flag Report</p>
                            <div style={{ marginLeft: 'auto' }}>
                                <Link to={''} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                                    {/* <i className="fa fa-print" onClick={printForm}></i> */}
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
                                    }}>Location Flag Report</p>
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
                                        <div className="row">
                                            {showFields.showFlagName && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>Flag</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
                                                            value={searchValue.flagName?.FlagNameCode}
                                                            readOnly />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </fieldset>
                                </div>

                                <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                    {[...new Set(locationFlagDetails.map((obj) => `${obj.Location} | ${obj.Apartment || "-"}`))]
                                        .map((key) => {
                                            const [Location, Apartment] = key.split(" | ");
                                            const filteredData = locationFlagDetails.filter((obj) =>
                                                obj.Location === Location && (obj.Apartment || "-") === Apartment
                                            );

                                            return (
                                                <div key={key}>
                                                    <p className="py-1 text-center " style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "16px", marginBottom: "5px"
                                                    }}>
                                                        <span>Location: {Location || "-"}</span>
                                                        {Apartment && Apartment !== "-" && (
                                                            <span style={{ marginLeft: "30px" }}>Apt#/Suite: {Apartment}</span>
                                                        )}
                                                    </p>


                                                    <div className="table-responsive">
                                                        <table className="table table-bordered">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th style={{ width: '220px' }}>Flag Name</th>
                                                                    <th style={{ width: '160px' }}>Start DT</th>
                                                                    <th style={{ width: '160px' }}>Start Notes</th>
                                                                    <th style={{ width: '140px' }}>End DT</th>
                                                                    <th style={{ width: '140px' }}>End Notes</th>
                                                                    <th style={{ width: '300px' }}>Priority</th>
                                                                    <th style={{ width: '340px' }}>Total Days</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="master-tbody">
                                                                {filteredData.map((obj, index) => (
                                                                    <tr key={index}>
                                                                        <td className="text-list" style={{ width: '220px' }}>{obj.FlagNameCode}</td>
                                                                        <td className="text-list" style={{ width: '240px' }}> {obj.StartDate && getShowingWithOutTime(obj.StartDate)}</td>
                                                                        <td className="text-list" style={{
                                                                            width: '220px',
                                                                            wordBreak: 'break-all',
                                                                            whiteSpace: 'normal'
                                                                        }}>{obj.StartNote}</td>
                                                                        <td className="text-list" style={{ width: '240px' }}> {obj.EndDate && getShowingWithOutTime(obj.EndDate)}</td>
                                                                        <td className="text-list" style={{
                                                                            width: '220px',
                                                                            wordBreak: 'break-all',
                                                                            whiteSpace: 'normal'
                                                                        }}>{obj.EndNote}</td>
                                                                        <td className="text-list" style={{ width: '190px' }}>{obj.Priority}</td>
                                                                        <td className="text-list" style={{ width: '300px' }}>{obj.TotalDays}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                {showFooter && (
                                    <div className="print-footer">
                                        <div className="text-bold py-1 px-3 mr-3 ml-3" style={{ backgroundColor: '#e7eaed', color: 'black', textAlign: 'left', fontSize: "16px" }}>
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
                loder && (
                    <div className="loader-overlay">
                        <Loader />
                    </div>
                )
            }
        </>
    )
}

export default LocationFlagDetailsReports