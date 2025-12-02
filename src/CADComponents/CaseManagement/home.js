import React, { useContext, useEffect, useState } from "react"
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { coloredStyle_Select, colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import useObjState from "../../CADHook/useObjState";
import DataTable from "react-data-table-component";
import { base64ToString, filterPassedTimeZonesProperty, getShowingDateText, tableCustomStyles } from "../../Components/Common/Utility";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import CaseManagementServices from "../../CADServices/APIs/caseManagement";
import { Link, useLocation } from "react-router-dom";
import { fetchPostData } from "../../Components/hooks/Api";
import { Comman_changeArrayFormat } from "../../Components/Common/ChangeArrayFormat";
import { get_AgencyOfficer_Data } from "../../redux/actions/DropDownsData";
import { AgencyContext } from "../../Context/Agency/Index";
import { get_Inc_ReportedDate } from "../../redux/actions/Agency";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { isEmptyObject } from "../../CADUtils/functions/common";

function Home({ CaseId = null, RMSCaseNumber = null, refetchCaseManagementCaseData = () => { }, caseData = null }) {
    const dispatch = useDispatch();
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const { datezone, caseManagementDataIncidentRecent, setCaseManagementDataIncidentRecent } = useContext(AgencyContext);
    const startRef = React.useRef();
    const [incidentList, setIncidentList] = useState([]);
    const [chargeCodeDrp, setChargeCodeDrp] = useState([]);
    const [categoryIdDrp, setCategoryIdDrp] = useState([]);
    const [showPotentialIncidentsModal, setShowPotentialIncidentsModal] = useState(false);
    const [showAttachIncidentModal, setShowAttachIncidentModal] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [supervisorsByAgencyID, setSupervisorsByAgencyID] = useState([]);
    const [prosecutor, setProsecutor] = useState([]);
    const [primaryOfficerHistory, setPrimaryOfficerHistory] = useState([]);
    const [
        caseFormState,
        setCaseFormState,
        handleCaseFormState,
        clearCaseFormState,
    ] = useObjState({
        reportedDateTime: null,
        assignedDateTime: null,
        nextStatusReviewDue: null,
        nextFormalReportDue: null,
        primaryOfficer: "",
        crimeCode: null,
        crimeClass: null,
        incidentAddress: null,
        casePriority: null,
        primeInvestigator: null,
        supervisor: null,
        assignedProsecutor: null,
        masterCaseNumber: "",
        caseNotes: ""
    });
    const [
        errorCaseFormState,
        ,
        handleErrorCaseFormState,
        clearErrorCaseFormState,
    ] = useObjState({
        reportedDateTime: false,
        crimeCode: false,
        crimeClass: false,
        assignedProsecutor: false,
        assignedDateTime: false,
        supervisor: false,
        primeInvestigator: false,
        casePriority: false,
    });

    const [priorityDrpData, setPriorityDrpData] = useState([]);
    const useRouterQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param),
        };
    };
    const query = useRouterQuery();
    var IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    const getCaseManagementCaseDataKey = `/CaseManagement/GetCaseManagementCaseData/${IncID}`;
    const { data: getCaseManagementCaseData, isSuccess: isGetCaseManagementCaseDataSuccess, refetch: refetchCaseManagementCaseIDData } = useQuery(
        [getCaseManagementCaseDataKey, {
            "IncidentID": IncID,
        },],
        CaseManagementServices.getCaseManagementCaseData,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!IncID
        }
    );

    useEffect(() => {
        if (isGetCaseManagementCaseDataSuccess && getCaseManagementCaseData) {
            const data = JSON.parse(getCaseManagementCaseData?.data?.data)
            // setIncidentList(data?.Table1);
            setCaseFormState(prev => ({
                ...prev,
                primaryOfficer: data?.Table?.[0]?.ReportingOfficer,
                incidentAddress: data?.Table?.[0]?.CrimeLocation
            }))

            if (data?.Table1 && Array.isArray(data.Table1) && data.Table1.length > 0) {
                setIncidentList(prev => {
                    let newData = [...(prev || [])];
                    data.Table1.forEach((row) => {
                        if (row?.IncidentID && IncID && row?.IncidentID === IncID) {
                            return; // Don't add current incident
                        }
                        const existingItem = newData.find((item) =>
                            item?.IncidentID && row?.IncidentID && item?.IncidentID === row?.IncidentID
                        );
                        if (!existingItem) {
                            newData.push(row);
                        }
                    });
                    return newData;
                });
            }
        }
    }, [isGetCaseManagementCaseDataSuccess, getCaseManagementCaseData, IncID])

    const getSupervisorsByAgencyIDKey = `/Personnel/GetSupervisorsByAgencyID/${localStoreData?.AgencyID}`;
    const { data: getSupervisorsByAgencyID, isSuccess: isGetSupervisorsByAgencyIDSuccess } = useQuery(
        [getSupervisorsByAgencyIDKey, {
            "AgencyID": localStoreData?.AgencyID,
        },],
        CaseManagementServices.getSupervisorsByAgencyID,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!localStoreData?.AgencyID
        }
    );

    const getProsecutorByAgencyIDKey = `/Personnel/GetProsecutorByAgencyID/${localStoreData?.AgencyID}`;
    const { data: getProsecutorByAgencyID, isSuccess: isGetProsecutorByAgencyIDSuccess } = useQuery(
        [getProsecutorByAgencyIDKey, {
            "AgencyID": localStoreData?.AgencyID,
        },],
        CaseManagementServices.getProsecutorByAgencyID,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!localStoreData?.AgencyID
        }
    );

    const getPrimaryOfficerHistoryKey = `/CaseManagement/GetPrimaryOfficerHistory/${CaseId}`;
    const { data: getPrimaryOfficerHistory, isSuccess: isGetPrimaryOfficerHistorySuccess } = useQuery(
        [getPrimaryOfficerHistoryKey, {
            "CaseID": CaseId,
        },],
        CaseManagementServices.getPrimaryOfficerHistory,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!CaseId
        }
    );

    useEffect(() => {
        if (getPrimaryOfficerHistory && isGetPrimaryOfficerHistorySuccess) {
            const data = JSON.parse(getPrimaryOfficerHistory?.data?.data)?.Table
            setPrimaryOfficerHistory(data || [])
        } else {
            setPrimaryOfficerHistory([])
        }
    }, [getPrimaryOfficerHistory, isGetPrimaryOfficerHistorySuccess])

    useEffect(() => {
        if (isGetSupervisorsByAgencyIDSuccess && getSupervisorsByAgencyID) {
            const data = Comman_changeArrayFormat(JSON.parse(getSupervisorsByAgencyID?.data?.data)?.Table, 'PINID', 'FullName')
            setSupervisorsByAgencyID(data || []);
        } else {
            setSupervisorsByAgencyID([]);
        }
    }, [isGetSupervisorsByAgencyIDSuccess, getSupervisorsByAgencyID])

    useEffect(() => {
        if (isGetProsecutorByAgencyIDSuccess && getProsecutorByAgencyID) {
            const data = Comman_changeArrayFormat(JSON.parse(getProsecutorByAgencyID?.data?.data)?.Table, 'PINID', 'FullName')
            setProsecutor(data || []);
        } else {
            setProsecutor([]);
        }
    }, [isGetProsecutorByAgencyIDSuccess, getProsecutorByAgencyID])

    useEffect(() => {
        if (caseData?.CaseID > 0) {
            const parseDateSafe = (value) => {
                if (!value) return null;
                const d = value instanceof Date ? value : new Date(value);
                return isNaN(d?.getTime?.()) ? null : d;
            };

            setCaseFormState(prev => ({
                ...prev,
                reportedDateTime: parseDateSafe(caseData?.CaseReportedDateTime),
                assignedDateTime: parseDateSafe(caseData?.AssignedDateTime),
                nextStatusReviewDue: parseDateSafe(caseData?.NextStatusReviewDue),
                nextFormalReportDue: parseDateSafe(caseData?.NextFormalReportDue),
                casePriority: priorityDrpData?.find(item => item?.value === caseData?.CasePriorityID),
                primeInvestigator: agencyOfficerDrpData?.find(item => item?.value === caseData?.PrimeInvestigatorID),
                supervisor: agencyOfficerDrpData?.find(item => item?.value === caseData?.SupervisorID),
                assignedProsecutor: agencyOfficerDrpData?.find(item => item?.value === caseData?.AssignedProsecutorID),
                masterCaseNumber: "",
                caseNotes: caseData?.CaseNotes,
                crimeCode: chargeCodeDrp?.find(item => item?.value === caseData?.CrimeCodeID),
                crimeClass: categoryIdDrp?.find(item => item?.value === caseData?.CrimeClassID)
            }))
        } else {
            clearCaseFormState();
        }
    }, [caseData, priorityDrpData, agencyOfficerDrpData, setCaseFormState])


    useEffect(() => {
        get_priorityDrpData(localStoreData?.AgencyID);
        dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID));
        const defaultDate = datezone ? new Date(datezone) : null;
        handleCaseFormState("reportedDateTime", defaultDate);
        if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
        getChargeCodeIDDrp(localStoreData?.AgencyID, 0, 0);
        CategoryDrpDwnVal(localStoreData?.AgencyID);
    }, [localStoreData, IncID, datezone])

    const CategoryDrpDwnVal = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID };
        fetchPostData("ChargeCategory/GetDataDropDown_ChargeCategory", val).then(
            (data) => {
                if (data) setCategoryIdDrp(Comman_changeArrayFormat(data, "ChargeCategoryID", "Description"));
                else setCategoryIdDrp([]);
            }
        );
    };

    const getChargeCodeIDDrp = (loginAgencyID, NIBRSCodeId, LawTitleID) => {
        const val = {
            AgencyID: loginAgencyID, FBIID: NIBRSCodeId, LawTitleID: LawTitleID,
        };
        fetchPostData("ChargeCodes/GetDataDropDown_ChargeCodes", val).then((data) => {
            if (data) {
                setChargeCodeDrp(Comman_changeArrayFormat(data, "ChargeCodeID", "Description"));
            }
            else
                setChargeCodeDrp([]);
        });
    };

    //-----------DrpDown_Data-------------------
    const get_priorityDrpData = (loginAgencyID) => {
        const val = { AgencyID: loginAgencyID }
        fetchPostData('Priority/GetDataDropDown_Priority', val).then((res) => {
            if (res) { setPriorityDrpData(Comman_changeArrayFormat(res, 'PriorityID', 'Description')) }
            else { setPriorityDrpData() }
        })
    }

    // Table columns for Personnel Assignment History
    const tableColumns = [
        {
            name: "Investigator/Personnel",
            selector: (row) => row.FullName,
            sortable: true,
        },
        {
            name: "Date Assigned",
            selector: (row) => row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : "",
            sortable: true,
        },
        {
            name: "Date Removed",
            selector: (row) => row.DeletedDtTm ? getShowingDateText(row.DeletedDtTm) : "",
            sortable: true,
        },
        {
            name: "Primary Investigator",
            selector: (row) => row.IsPrimaryOfficer,
            cell: (row) => {
                return (
                    <span className={`badge ${row.IsPrimaryOfficer ? 'bg-success' : 'bg-secondary'}`}>
                        {row.IsPrimaryOfficer ? 'Yes' : 'No'}
                    </span>
                );
            }
        }
    ];

    const validation = () => {
        let isError = false;
        const keys = Object.keys(errorCaseFormState);
        keys.forEach((field) => {
            if (field === "reportedDateTime" && !(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            }
            else if (field === "assignedProsecutor" && isEmptyObject(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            }
            else if (field === "assignedDateTime" && !(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            } else if (field === "supervisor" && isEmptyObject(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            } else if (field === "primeInvestigator" && isEmptyObject(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            } else if (field === "casePriority" && isEmptyObject(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            } else {
                handleErrorCaseFormState(field, false);
            }
        });
        return !isError;
    };

    const handleSave = async () => {
        if (!validation()) return;
        const isUpdate = CaseId ? true : false;
        const res = await CaseManagementServices.caseManagementCaseReviewWithAssign({
            "CaseManagementID": isUpdate ? CaseId : undefined,
            "AgencyID": localStoreData?.AgencyID,
            "PINID": localStoreData?.PINID,
            "CreatedByUserFK": isUpdate ? undefined : localStoreData?.PINID,
            "ModifiedByUserFK": isUpdate ? localStoreData?.PINID : undefined,
            "AssignedDateTime": caseFormState?.assignedDateTime,
            "NextStatusReviewDue": caseFormState?.nextStatusReviewDue,
            "NextFormalReportDue": caseFormState?.nextFormalReportDue,
            "PrimeInvestigatorID": caseFormState?.primeInvestigator?.value,
            "SupervisorID": caseFormState?.supervisor?.value,
            "AssignedProsecutorID": caseFormState?.assignedProsecutor?.value,
            "IncidentID": IncID,
            "CasePriorityID": caseFormState?.casePriority?.value,
            "CaseComment": caseFormState?.caseNotes,
            "MasterCaseLink": caseFormState?.masterCaseNumber,
            "CrimeCodeID": caseFormState?.crimeCode?.value,
            "CrimeClassID": caseFormState?.crimeClass?.value
        });
        if (res?.status === 200) {
            toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully")
            refetchCaseManagementCaseIDData();
            refetchCaseManagementCaseData();
            clearErrorCaseFormState();
        }
    }

    const potentialIncidentsTableColumns = [
        {
            name: "Incident",
            selector: (row) => row.Potentialincidents,
            sortable: true,
            cell: (row) => {
                return (
                    <button
                        type="button"
                        onClick={() => {
                            // Preserve existing data and add new row data
                            let newData = [...(caseManagementDataIncidentRecent || [])];
                            // Check if item already exists (by Potentialincidents or IncidentID if available)
                            const existingItem = newData.find((item) =>
                                item?.Potentialincidents === row?.Potentialincidents ||
                                (item?.IncidentID && row?.IncidentID && item?.IncidentID === row?.IncidentID)
                            );
                            if (!existingItem) {
                                newData.push(row);
                            }
                            setCaseManagementDataIncidentRecent(newData);
                        }}
                        style={{
                            color: '#007bff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            font: 'inherit'
                        }}
                    >
                        {row.Potentialincidents}
                    </button>
                );
            },
        },
        {
            name: "Reason",
            selector: (row) => row.Reason,
            sortable: true,
        },
        {
            name: "Attach",
            selector: (row) => row.Attach,
            sortable: true,
            cell: (row) => {
                return (
                    <button className="btn btn-primary btn-sm" onClick={() => {
                        setSelectedIncident(row?.Potentialincidents);
                        setShowAttachIncidentModal(true);
                    }}>
                        <i className="fa fa-paperclip"></i>
                    </button>
                );
            },
            width: '90px',
        },
    ];

    return (
        <div className="container-fluid">
            {/* Case Identity & Offense Details */}
            <div className="row mt-4">
                <div className="col-12">
                    <fieldset>
                        <legend>Case Identity & Offense Details</legend>
                        <div className="mt-3">
                            <div className="row">
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label fw-bold text-nowrap" style={{ marginLeft: '90px' }}>RMS Case #</label>
                                    <input type="text" className="form-control py-1 new-input" value={RMSCaseNumber ? RMSCaseNumber : "Auto Generated"} readOnly />
                                </div>
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label fw-bold"><span className="fw-bold text-nowrap">Reported Date/Time</span> {errorCaseFormState.reportedDateTime && !caseFormState.reportedDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                                    <DatePicker
                                        id='reportedDateTime'
                                        name='reportedDateTime'
                                        ref={startRef}
                                        selected={caseFormState.reportedDateTime}
                                        onChange={(date) => handleCaseFormState("reportedDateTime", date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={1}
                                        timeCaption="time"
                                        timeInputLabel
                                        autoComplete="Off"
                                        dropdownMode="select"
                                        showYearDropdown
                                        showMonthDropdown
                                        showDisabledMonthNavigation
                                        minDate={new Date(incReportedDate)}
                                        maxDate={new Date(datezone)}
                                        filterTime={(date) => filterPassedTimeZonesProperty(date, caseFormState.reportedDateTime, incReportedDate)}
                                        dateFormat="MM/dd/yyyy HH:mm"
                                        className="form-control py-1 new-input requiredColor"
                                        placeholderText="Select Date/Time"
                                        is24Hour
                                    />
                                </div>
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}    >
                                    <label className="form-label fw-bold text-nowrap">Primary Officer</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        placeholder="Placeholder"
                                        value={caseFormState.primaryOfficer}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <Link to={'/ListManagement?page=Charge%20Code&call=/Arr-Charge-Home'} className='new-link text-nowrap'> Offense Code/Name</Link>
                                    <Select
                                        placeholder="Select"
                                        options={chargeCodeDrp}
                                        isClearable
                                        styles={colorLessStyle_Select}
                                        value={caseFormState.crimeCode}
                                        onChange={(selectedOption) => handleCaseFormState("crimeCode", selectedOption)}
                                    />
                                </div>
                                <div className="col-md-6 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label fw-bold text-nowrap">Category</label>
                                    <Select
                                        placeholder="Select"
                                        options={categoryIdDrp}
                                        isClearable
                                        styles={colorLessStyle_Select}
                                        value={caseFormState.crimeClass}
                                        onChange={(selectedOption) => handleCaseFormState("crimeClass", selectedOption)}
                                    />
                                </div>
                                <div className="col-md-12 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label fw-bold text-nowrap" style={{ marginLeft: '60px' }}>Incident Address</label>
                                    <input
                                        type="text"
                                        className="form-control py-1 new-input"
                                        placeholder="Placeholder"
                                        value={caseFormState.incidentAddress}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Potential Related Incidents */}
            <div className="row mb-4">
                <div className="col-12 d-flex justify-content-end">
                    <button
                        className="btn btn-success px-4 py-2"
                        onClick={() => setShowPotentialIncidentsModal(true)}
                    >
                        Potential Related Incidents
                    </button>
                </div>
            </div>

            {/* Assignment & Priority Management */}
            <div className="row">
                <div className="col-12">
                    <fieldset className="">
                        <legend>Assignment & Priority Management</legend>
                        <div className="mt-3">
                            <div className="row">
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label" style={{ marginLeft: '50px' }}><span className="fw-bold text-nowrap">Case Priority</span> {errorCaseFormState.casePriority && isEmptyObject(caseFormState.casePriority) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                                    <Select
                                        placeholder="Select"
                                        styles={coloredStyle_Select}
                                        value={caseFormState.casePriority}
                                        options={priorityDrpData}
                                        onChange={(selectedOption) => handleCaseFormState("casePriority", selectedOption)}
                                    />
                                </div>
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label"><span className="fw-bold text-nowrap">Prime Investigator</span> {errorCaseFormState.primeInvestigator && isEmptyObject(caseFormState.primeInvestigator) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                                    <Select
                                        placeholder="Select"
                                        styles={coloredStyle_Select}
                                        options={agencyOfficerDrpData}
                                        value={caseFormState.primeInvestigator}
                                        isClearable
                                        onChange={(selectedOption) => handleCaseFormState("primeInvestigator", selectedOption)}
                                    />
                                </div>
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label"><span className="fw-bold text-nowrap">Supervisor</span> {errorCaseFormState.supervisor && isEmptyObject(caseFormState.supervisor) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                                    <Select
                                        placeholder="Select"
                                        styles={coloredStyle_Select}
                                        options={supervisorsByAgencyID}
                                        value={caseFormState.supervisor}
                                        isClearable
                                        onChange={(selectedOption) => handleCaseFormState("supervisor", selectedOption)}
                                        name="PrimaryOfficerID"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label"><span className="fw-bold text-nowrap">Assigned Date/Time</span> {errorCaseFormState.assignedDateTime && !caseFormState.assignedDateTime ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                                    <DatePicker
                                        selected={caseFormState.assignedDateTime}
                                        onChange={(date) => handleCaseFormState("assignedDateTime", date)}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        dateFormat="MM/dd/yyyy h:mm aa"
                                        minDate={new Date(incReportedDate)}
                                        maxDate={new Date(datezone)}
                                        filterTime={(date) => filterPassedTimeZonesProperty(date, caseFormState.assignedDateTime, incReportedDate)}
                                        className="form-control py-1 new-input requiredColor"
                                        placeholderText="Select Date/Time"
                                    />
                                </div>
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label"><span className="fw-bold text-nowrap">Assigned Prosecutor</span> {errorCaseFormState.assignedProsecutor && isEmptyObject(caseFormState.assignedProsecutor) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                                    <Select
                                        placeholder="Select"
                                        styles={coloredStyle_Select}
                                        options={prosecutor}
                                        value={caseFormState.assignedProsecutor}
                                        isClearable
                                        onChange={(selectedOption) => handleCaseFormState("assignedProsecutor", selectedOption)}
                                        name="assignedProsecutor"
                                    />
                                </div>
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label fw-bold text-nowrap">Master Case # (Link) </label>
                                    <div className="input-group d-flex align-items-center" style={{ gap: '10px' }}>
                                        <input
                                            type="text"
                                            className="form-control py-1 new-input"
                                            placeholder="Enter Master Case"
                                            value={caseFormState.masterCaseNumber}
                                            onChange={(e) => handleCaseFormState("masterCaseNumber", e.target.value)}
                                        />
                                        <button className="btn btn-outline-primary" type="button">Generate</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Review Schedule & Case Log */}
            <div className="row">
                <div className="col-12">
                    <fieldset>
                        <legend>Review Schedule & Case Log</legend>
                        <div className="mt-3">
                            <div className="">
                                <div className="row">
                                    <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                        <label className="form-label fw-bold text-nowrap" style={{ marginLeft: '38px' }}>Next Status Review Due</label>
                                        <DatePicker
                                            selected={caseFormState.nextStatusReviewDue}
                                            onChange={(date) => handleCaseFormState("nextStatusReviewDue", date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="time"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            minDate={new Date(incReportedDate)}
                                            className="form-control py-1 new-input"
                                            placeholderText="Select Date/Time"
                                        />
                                    </div>
                                    <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                        <label className="form-label fw-bold text-nowrap">Next Formal Report Due</label>
                                        <DatePicker
                                            selected={caseFormState.nextFormalReportDue}
                                            onChange={(date) => handleCaseFormState("nextFormalReportDue", date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="time"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            minDate={new Date(incReportedDate)}
                                            className="form-control py-1 new-input"
                                            placeholderText="Select Date/Time"
                                        />
                                    </div>
                                    <div className="col-md-12 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                        <label className="form-label fw-bold text-nowrap">Case Notes / Investigator Log</label>
                                        <textarea
                                            className="form-control py-1 new-input"
                                            rows="3"
                                            placeholder="Placeholder"
                                            value={caseFormState.caseNotes}
                                            onChange={(e) => handleCaseFormState("caseNotes", e.target.value)}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            {/* Action Buttons */}
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-end" style={{ gap: '10px' }}>
                        <button
                            className="cancel-button"
                            onClick={() => { clearCaseFormState(); clearErrorCaseFormState(); }}
                        >
                            Clear
                        </button>
                        <button className="btn btn-success px-4 py-2" onClick={handleSave}>
                            {CaseId ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Personnel Assignment History */}
            <div className="row mb-4">
                <div className="col-12">
                    <fieldset>
                        <legend>Primary Officer History</legend>
                        <div className="mt-3">
                            <div className="table-responsive">
                                <DataTable
                                    dense
                                    columns={tableColumns}
                                    data={primaryOfficerHistory}
                                    customStyles={tableCustomStyles}
                                    pagination={false}
                                    responsive
                                    noDataComponent={'There are no data to display'}
                                    striped
                                    persistTableHead={true}
                                    highlightOnHover
                                    fixedHeader
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Potential Related Incidents Modal */}
            {showPotentialIncidentsModal && (
                <div
                    className="modal fade show"
                    style={{ display: 'block', background: "rgba(0,0,0, 0.5)", zIndex: "9999" }}
                    id="PotentialIncidentsModal"
                    tabIndex="-1"
                    aria-labelledby="potentialIncidentsModalLabel"
                    aria-hidden="false"
                    onClick={(e) => {
                        if (e.target.id === 'PotentialIncidentsModal') {
                            setShowPotentialIncidentsModal(false);
                        }
                    }}
                >
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "800px" }}>
                        <div className="modal-content" style={{ borderRadius: "8px" }}>
                            <div className="modal-header" style={{ borderBottom: "1px solid #dee2e6" }}>
                                <h5 className="modal-title fw-bold" id="potentialIncidentsModalLabel">
                                    Potential Related Incidents ({caseFormState.incidentAddress || 'N/A'})
                                </h5>
                            </div>
                            <div className="modal-body p-4" style={{ backgroundColor: '#f0f7ff', }}>
                                <div className="mb-2 d-flex align-items-center font-weight-bold" style={{ gap: '10px', flexWrap: 'wrap' }}>
                                    <DataTable
                                        dense
                                        columns={potentialIncidentsTableColumns}
                                        data={incidentList}
                                        customStyles={tableCustomStyles}
                                        pagination={false}
                                        responsive
                                        noDataComponent={'There are no data to display'}
                                        striped
                                        persistTableHead={true}
                                        fixedHeaderScrollHeight='350px'
                                        highlightOnHover
                                        fixedHeader
                                    />
                                </div>
                                <p className="text-muted mb-0">Review these incidents before assigning a Master Case #.</p>
                            </div>
                            <div className="modal-footer" style={{ borderTop: "1px solid #dee2e6" }}>
                                <button
                                    type="button"
                                    className="btn text-white"
                                    onClick={() => setShowPotentialIncidentsModal(false)}
                                    style={{ backgroundColor: '#17a2b8', borderColor: '#17a2b8' }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Attach Incident Confirmation Modal */}
            {showAttachIncidentModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body text-center py-5">
                                <h5 className="modal-title mt-2">Are you sure you want to attach this Incident?</h5>
                                <div className="btn-box mt-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Handle attach incident logic here
                                            setShowAttachIncidentModal(false);
                                            setSelectedIncident(null);
                                        }}
                                        className="btn btn-sm text-white"
                                        style={{ background: "#ef233c" }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-secondary ml-2"
                                        onClick={() => {
                                            setShowAttachIncidentModal(false);
                                            setSelectedIncident(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
