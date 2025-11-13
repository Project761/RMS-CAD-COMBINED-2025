import { useContext, useEffect, useRef, useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DatePicker from "react-datepicker";
import Select from "react-select";
import { colorLessStyle_Select, customStylesWithOutColorArrow } from '../../Utility/CustomStylesForReact';
import MasterTableListServices from "../../../CADServices/APIs/masterTableList";
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';
import ReportsServices from "../../../CADServices/APIs/reports";
import { toastifyError } from '../../../Components/Common/AlertMsg';
import { fetchPostData } from '../../../Components/hooks/Api';
import Loader from '../../../Components/Common/Loader';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { getShowingMonthDateYear, getShowingWithOutTime } from '../../../Components/Common/Utility';
import { AgencyContext } from '../../../Context/Agency/Index';
import ReportMainAddress from '../ReportMainAddress/ReportMainAddress';
import { getData_DropDown_IncidentDispositions, getData_DropDown_Operator } from '../../../CADRedux/actions/DropDownsData';
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction';
import { IncidentContext } from '../../../CADContext/Incident';

const ShiftDetailedReport = () => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const IncidentDispositionsDrpData = useSelector((state) => state.CADDropDown.IncidentDispositionsDrpData);
    const { datezone, GetDataTimeZone } = useContext(AgencyContext);
    const { allResourcesData } = useContext(IncidentContext);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loader, setLoader] = useState(false);
    const [verifyIncident, setverifyIncident] = useState(false);
    const [multiImage, setMultiImage] = useState([]);
    const [shiftDetailedData, setShiftDetailedData] = useState([]);
    const [agencyData, setAgencyData] = useState([]);
    const [LoginUserName, setLoginUserName] = useState('');
    const [showFooter, setShowFooter] = useState(false);
    const [CFSDropDown, setCFSDropDown] = useState([]);
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);

    const [
        shiftDetailedState,
        ,
        handleShiftDetailedState,
        clearShiftDetailedState,
    ] = useObjState({
        reportedFromDate: "",
        reportedToDate: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        Resource1: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        CADDisposition: ""
    });

    const [showFields, setShowFields] = useState({
        showReportedFromDate: false,
        showReportedToDate: false,
        showPrimaryOfficer: false,
        showSecondaryOfficer: false,
        showResource1: false,
        showFoundPriorityID: false,
        showFoundCFSLDesc: false,
        showFoundCFSCodeID: false,
        showCADDisposition: false,
    });

    const [searchValue, setSearchValue] = useState({
        reportedFromDate: "",
        reportedToDate: "",
        primaryOfficer: "",
        secondaryOfficer: "",
        Resource1: "",
        FoundPriorityID: "",
        FoundCFSLDesc: "",
        FoundCFSCodeID: "",
        CADDisposition: ""
    });

    useEffect(() => {
        setShowFields({
            showReportedFromDate: searchValue?.reportedFromDate && getShowingWithOutTime(searchValue?.reportedFromDate),
            showReportedToDate: searchValue?.reportedToDate && getShowingWithOutTime(searchValue?.reportedToDate),
            showPrimaryOfficer: searchValue?.primaryOfficer,
            showSecondaryOfficer: searchValue?.secondaryOfficer,
            showResource1: searchValue?.Resource1,
            showFoundPriorityID: searchValue?.FoundPriorityID,
            showFoundCFSLDesc: searchValue?.FoundCFSLDesc,
            showFoundCFSCodeID: searchValue?.FoundCFSCodeID,
            showCADDisposition: searchValue?.CADDisposition,
        });
    }, [searchValue]);

    useEffect(() => {
        if (localStoreData) {
            setLoginUserName(localStoreData?.UserName)
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("CU106", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
            if (IncidentDispositionsDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_IncidentDispositions({ AgencyID: localStoreData?.AgencyID }))
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
            enabled: !!loginAgencyID,
        }
    );

    useEffect(() => {
        if (isFetchCFSCodeData && CFSCodeData) {
            const parsedData = JSON.parse(CFSCodeData?.data?.data);
            setCFSDropDown(parsedData?.Table);
        }
    }, [isFetchCFSCodeData, CFSCodeData]);

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
    const resetFields = () => {
        clearShiftDetailedState();
        setShiftDetailedData([]);
        setAgencyData();
        setLoader(false);
        setverifyIncident(false);
    }

    const getShiftDetailedData = async (isPrintReport = false) => {
        setLoader(true);
        GetDataTimeZone(localStoreData?.AgencyID);

        if (
            !shiftDetailedState?.reportedFromDate &&
            !shiftDetailedState?.reportedToDate &&
            !shiftDetailedState?.primaryOfficer?.PINID &&
            !shiftDetailedState?.secondaryOfficer?.PINID &&
            !shiftDetailedState?.Resource1 &&
            !shiftDetailedState?.FoundCFSCodeID &&
            !shiftDetailedState?.CADDisposition
        ) {
            toastifyError("Please enter at least one detail");
            setLoader(false);
            setverifyIncident(false)
            return;
        }

        const payload = {
            "AgencyID": loginAgencyID,
            "ReportedDate": shiftDetailedState?.reportedFromDate ? getShowingMonthDateYear(shiftDetailedState?.reportedFromDate) : "",
            "ReportedDateTO": shiftDetailedState?.reportedToDate ? getShowingMonthDateYear(shiftDetailedState?.reportedToDate) : "",
            "ResourceID": shiftDetailedState?.Resource1?.ResourceID || "",
            "PrimaryOfficerID": shiftDetailedState?.primaryOfficer?.PINID || "",
            "SecondaryOfficerID": shiftDetailedState?.secondaryOfficer?.PINID || "",
            "CADDispositionID": shiftDetailedState?.CADDisposition?.IncidentDispositionsID,
            "CADCFSCodeID": shiftDetailedState?.FoundCFSCodeID,
        };

        setSearchValue(shiftDetailedState)

        try {
            const response = await ReportsServices.getShiftDetailedReport(payload);
            const data = JSON.parse(response?.data?.data);
            if (data?.Table?.length > 0) {
                setShiftDetailedData(data?.Table);
                setAgencyData(data?.Table1[0]);
                setverifyIncident(true);
                getAgencyImg(loginAgencyID);
                setLoader(false);
            } else {
                if (!isPrintReport) {
                    toastifyError("Data Not Available");
                    setShiftDetailedData([]);
                    setAgencyData([])
                    setverifyIncident(false);
                    setLoader(false);
                }
            }
        } catch (error) {
            console.error("error", error)
            if (!isPrintReport) {
                toastifyError("Data Not Available");
            }
            setverifyIncident(false);
            setLoader(false);
        }
    }

    const handlePrintClick = () => {
        setLoader(true)
        setShowFooter(true);
        setTimeout(() => {
            printForm(); getShiftDetailedData(true); setShowFooter(false);
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
                                                <legend>Shift Detailed</legend>
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
                                                                handleShiftDetailedState("reportedFromDate", date);
                                                                if (!date) {
                                                                    handleShiftDetailedState("reportedToDate", ""); // Clear reportedToDate if from date is cleared
                                                                }
                                                            }}
                                                            selected={shiftDetailedState?.reportedFromDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={shiftDetailedState?.reportedFromDate ? true : false}
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
                                                                handleShiftDetailedState("reportedToDate", date);
                                                            }}
                                                            selected={shiftDetailedState?.reportedToDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            // timeCaption="Time"
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            // showTimeSelect
                                                            // timeInputLabel
                                                            // is24Hour
                                                            // timeFormat="HH:mm "
                                                            isClearable={shiftDetailedState?.reportedToDate ? true : false}
                                                            showDisabledMonthNavigation
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select To Date..."
                                                            minDate={shiftDetailedState?.reportedFromDate || new Date(1991, 0, 1)}
                                                            maxDate={new Date(datezone)}
                                                            disabled={!shiftDetailedState?.reportedFromDate} // Disable if from date is not selected
                                                            className={!shiftDetailedState?.reportedFromDate && 'readonlyColor'}
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
                                                            value={shiftDetailedState?.primaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleShiftDetailedState("primaryOfficer", e) }}
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
                                                            value={shiftDetailedState?.secondaryOfficer}
                                                            isClearable
                                                            onChange={(e) => { handleShiftDetailedState("secondaryOfficer", e) }}
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
                                                            options={allResourcesData}
                                                            placeholder="Select..."
                                                            name="Resource1"
                                                            value={shiftDetailedState?.Resource1}
                                                            getOptionLabel={(v) => v?.ResourceNumber}
                                                            getOptionValue={(v) => v?.ResourceID}
                                                            onChange={(e) => {

                                                                handleShiftDetailedState("Resource1", e);
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
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === shiftDetailedState?.FoundCFSCodeID) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCODE}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleShiftDetailedState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleShiftDetailedState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleShiftDetailedState("FoundPriorityID", v?.PriorityID);
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
                                                            value={CFSDropDown.find((opt) => opt.CallforServiceID === shiftDetailedState?.FoundCFSLDesc) || null}  // Keep the selected value
                                                            options={CFSDropDown}
                                                            getOptionLabel={(v) => v?.CFSCodeDescription}  // Show only value after selection
                                                            getOptionValue={(v) => v?.CallforServiceID}
                                                            onChange={(v) => {
                                                                handleShiftDetailedState("FoundCFSCodeID", v?.CallforServiceID);
                                                                handleShiftDetailedState("FoundCFSLDesc", v?.CallforServiceID);
                                                                handleShiftDetailedState("FoundPriorityID", v?.PriorityID);
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
                                                            value={shiftDetailedState?.CADDisposition}
                                                            onChange={(e) => handleShiftDetailedState("CADDisposition", e)}
                                                            name="CADDisposition" />
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-12 col-lg-12 mt-1 text-right mb-1">
                                    {effectiveScreenPermission?.[0]?.AddOK ? <button className="btn btn-sm bg-green text-white px-2 py-1" onClick={() => { getShiftDetailedData(false); }} >Show Report</button> : <></>}
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
                            <p className="p-0 m-0 d-flex align-items-center">Shift Detailed Report</p>
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
                                    }}>Shift Detailed Report</p>
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
                                                        />
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
                                            {showFields.showCADDisposition && (
                                                <>
                                                    <div className="col-3 col-md-3 col-lg-2 mt-2">
                                                        <label className='new-label'>CAD Disposition</label>
                                                    </div>
                                                    <div className="col-3 col-md-3 col-lg-4 text-field mt-1">
                                                        <input type="text" className='readonlyColor'
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
                                    </fieldset>
                                </div>
                                {
                                    <div className='col-12' style={{ pageBreakAfter: 'always', width: "100%" }}>
                                        {[...new Set(shiftDetailedData.map((obj) => obj.ResourceNumber))].map((ResourceNumber) => {
                                            const filteredData = shiftDetailedData.filter((obj) => obj.ResourceNumber === ResourceNumber);

                                            const currentDate = new Date(datezone); // Assume `datezone` is provided as a string
                                            const calculateTimeDifference = (start, end) => {
                                                const startTime = new Date(start);
                                                const endTime = end ? new Date(end) : currentDate; // If OffDutyTime is null, use current time
                                                const diffTime = endTime - startTime; // difference in milliseconds
                                                return diffTime / (1000 * 60); // convert to minutes
                                            };

                                            const convertMinutesToDDHHMM = (totalMinutes) => {
                                                totalMinutes = Math.round(totalMinutes);
                                                const days = Math.floor(totalMinutes / 1440);
                                                const hours = Math.floor((totalMinutes % 1440) / 60);
                                                const minutes = totalMinutes % 60;
                                                return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                                            };

                                            let totalOnDutyMinutes = 0;
                                            filteredData.forEach((obj, index) => {
                                                if (obj.OnDutyTime) {
                                                    totalOnDutyMinutes += calculateTimeDifference(obj.OnDutyTime, obj.OffDutyTime);
                                                }
                                            });

                                            const onDutyDuration = convertMinutesToDDHHMM(totalOnDutyMinutes);

                                            let totalOffDutyMinutes = 0;

                                            if (filteredData.length === 1) {
                                                const onlyRow = filteredData[0];
                                                if (onlyRow.OffDutyTime) {
                                                    totalOffDutyMinutes += calculateTimeDifference(onlyRow.OffDutyTime, currentDate);
                                                }
                                            } else {
                                                for (let i = 0; i < filteredData.length - 1; i++) {
                                                    const currentRow = filteredData[i];
                                                    const nextRow = filteredData[i + 1];

                                                    if (currentRow.OffDutyTime && nextRow.OnDutyTime) {
                                                        totalOffDutyMinutes += calculateTimeDifference(currentRow.OffDutyTime, nextRow.OnDutyTime);
                                                    }
                                                }
                                            }

                                            const offDutyDuration = convertMinutesToDDHHMM(totalOffDutyMinutes);

                                            const commonData = filteredData[0];

                                            // Calculate the total of TotalTime
                                            const totalMinutes = filteredData.reduce((sum, obj) => {
                                                // Check if TotalTime is null or empty
                                                if (!obj.TotalTime) {
                                                    return sum; // Skip this entry if TotalTime is null or empty
                                                }

                                                const timeParts = obj.TotalTime.split(":");
                                                const hours = parseInt(timeParts[0], 10);
                                                let minutes = parseInt(timeParts[1], 10);

                                                // Handle cases like 4:90 which should be converted to 5:30
                                                if (minutes >= 60) {
                                                    hours += Math.floor(minutes / 60);
                                                    minutes = minutes % 60;
                                                }

                                                return sum + (hours * 60) + minutes;
                                            }, 0);

                                            // Convert the total minutes back to HH:MM format
                                            const totalHours = Math.floor(totalMinutes / 60);
                                            const totalRemainingMinutes = totalMinutes % 60;

                                            const formattedTotalTime = `${totalHours}:${totalRemainingMinutes < 10 ? '0' + totalRemainingMinutes : totalRemainingMinutes}`;

                                            return (
                                                <div key={ResourceNumber}>
                                                    <p className="py-1 text-center" style={{
                                                        textAlign: "center", backgroundColor: "#E6E9EC", color: "#001F3F", fontWeight: "bold", fontSize: "20px", marginBottom: "5px"
                                                    }}>Unit # : {ResourceNumber || "-"}</p>
                                                    <div className="table-responsive">
                                                        <table className="table table-bordered mb-0">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th className="" style={{ width: '205px' }}>On Duty Duration (DD:HH:MM) : {onDutyDuration || "-"}</th>
                                                                    <th className="" style={{ width: '205px' }}>Off Duty Duration (DD:HH:MM) : {offDutyDuration || "-"}</th>
                                                                </tr>
                                                            </thead>
                                                        </table>
                                                        <table className="table table-bordered mb-0">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th className="" style={{ width: '150px' }}>Activity</th>
                                                                    <th className="" style={{ width: '150px' }}>Primary Officer</th>
                                                                    <th className="" style={{ width: '150px' }}>Secondary Officer</th>
                                                                    <th className="" style={{ width: '150px' }}>CFS Code/Description</th>
                                                                    <th className="" style={{ width: '150px' }}>CAD Disposition</th>
                                                                    <th className="" style={{ width: '150px' }}>Total Time</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="master-tbody">
                                                                {filteredData.map((obj) => (
                                                                    <tr key={obj.id}>
                                                                        <td className="text-list" style={{ width: '150px' }}>
                                                                            {obj.Activity}
                                                                        </td>
                                                                        <td className="text-list" style={{ width: '150px' }}>{obj.PrimaryOfficer}</td>
                                                                        <td className="text-list" style={{ width: '150px' }}>{obj.SecondaryOfficer}</td>
                                                                        <td className="text-list" style={{ width: '150px' }}>
                                                                            {obj.CFSCodeDescription}
                                                                        </td>
                                                                        <td className="text-list" style={{ width: '150px' }}>{obj.CADDisposition}</td>
                                                                        <td className="text-list" style={{ width: '150px' }}>{obj.TotalTime}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                        <table className="table table-bordered">
                                                            <thead className="text-dark master-table text-bold">
                                                                <tr>
                                                                    <th className="" style={{ width: '730px' }}>Total Time</th>
                                                                    <th className="" style={{ width: '150px' }}>{formattedTotalTime}</th>
                                                                </tr>
                                                            </thead>

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

export default ShiftDetailedReport