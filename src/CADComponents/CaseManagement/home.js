import React, { useContext, useEffect, useState } from "react"
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { coloredStyle_Select, colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import useObjState from "../../CADHook/useObjState";
import DataTable from "react-data-table-component";
import { base64ToString, filterPassedTimeZonesProperty, tableCustomStyles } from "../../Components/Common/Utility";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import CaseManagementServices from "../../CADServices/APIs/caseManagement";
import { useLocation } from "react-router-dom";
import { fetchPostData } from "../../Components/hooks/Api";
import { Comman_changeArrayFormat, threeColArray } from "../../Components/Common/ChangeArrayFormat";
import { get_AgencyOfficer_Data } from "../../redux/actions/DropDownsData";
import { AgencyContext } from "../../Context/Agency/Index";
import { get_Inc_ReportedDate } from "../../redux/actions/Agency";
import { toastifySuccess } from "../../Components/Common/AlertMsg";
import { isEmpty, isEmptyObject } from "../../CADUtils/functions/common";

function Home({ RMSCaseNumber = null, refetchCaseManagementCaseData = () => { }, caseData = null }) {
    const dispatch = useDispatch();
    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
    const { datezone } = useContext(AgencyContext);
    const startRef = React.useRef();
    const [incidentList, setIncidentList] = useState([]);
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
            setIncidentList(data?.Table1);
            setCaseFormState(prev => ({
                ...prev,
                primaryOfficer: data?.Table?.[0]?.ReportingOfficer,
                incidentAddress: data?.Table?.[0]?.CrimeLocation
            }))
        }
    }, [isGetCaseManagementCaseDataSuccess, getCaseManagementCaseData])

    useEffect(() => {
        if (caseData?.CaseID > 0) {
            const parseDateSafe = (value) => {
                if (!value) return null;
                const d = value instanceof Date ? value : new Date(value);
                return isNaN(d?.getTime?.()) ? null : d;
            };

            setCaseFormState(prev => ({
                ...prev,
                reportedDateTime: parseDateSafe(caseData?.ReportedDateTime),
                assignedDateTime: parseDateSafe(caseData?.AssignedDateTime),
                nextStatusReviewDue: parseDateSafe(caseData?.NextStatusReviewDue),
                nextFormalReportDue: parseDateSafe(caseData?.NextFormalReportDue),
                casePriority: priorityDrpData?.find(item => item?.value === caseData?.CasePriorityID),
                primeInvestigator: agencyOfficerDrpData?.find(item => item?.value === caseData?.PrimeInvestigatorID),
                supervisor: agencyOfficerDrpData?.find(item => item?.value === caseData?.SupervisorID),
                assignedProsecutor: agencyOfficerDrpData?.find(item => item?.value === caseData?.AssignedProsecutorID),
                masterCaseNumber: "",
                caseNotes: caseData?.CaseNotes
            }))
        }
    }, [caseData, priorityDrpData, agencyOfficerDrpData, setCaseFormState])


    useEffect(() => {
        get_priorityDrpData(localStoreData?.AgencyID);
        dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, IncID));
        const defaultDate = datezone ? new Date(datezone) : null;
        handleCaseFormState("reportedDateTime", defaultDate);
        if (!incReportedDate) { dispatch(get_Inc_ReportedDate(IncID)) }
    }, [localStoreData])

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
            selector: (row) => row.investigator,
            sortable: true,
        },
        {
            name: "Date Assigned",
            selector: (row) => row.dateAssigned,
            sortable: true,
        },
        {
            name: "Date Removed",
            selector: (row) => row.dateRemoved,
            sortable: true,
        },
        {
            name: "Primary Investigator",
            selector: (row) => row.primaryInvestigator,
            cell: (row) => {
                return (
                    <span className={`badge ${row.primaryInvestigator ? 'bg-success' : 'bg-secondary'}`}>
                        {row.primaryInvestigator ? 'Yes' : 'No'}
                    </span>
                );
            }
        }
    ];

    // Table data for Personnel Assignment History
    const tableData = [
        {
            investigator: "J. Smith",
            dateAssigned: "06/27/2017 13:47",
            dateRemoved: "06/27/2017 13:47",
            primaryInvestigator: true
        },
        {
            investigator: "L. Jones",
            dateAssigned: "06/27/2017 00:00",
            dateRemoved: "--",
            primaryInvestigator: false
        }
    ];

    const validation = () => {
        let isError = false;
        const keys = Object.keys(errorCaseFormState);
        keys.forEach((field) => {
            if (field === "reportedDateTime" && !(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            } else if (field === "assignedProsecutor" && isEmptyObject(caseFormState[field])) {
                handleErrorCaseFormState(field, true);
                isError = true;
            } else if (field === "assignedDateTime" && !(caseFormState[field])) {
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
        const res = await CaseManagementServices.caseManagementCaseReviewWithAssign({
            "AgencyID": localStoreData?.AgencyID,
            "PINID": localStoreData?.PINID,
            "CreatedByUserFK": localStoreData?.PINID,
            "AssignedDateTime": caseFormState?.assignedDateTime,
            "NextStatusReviewDue": caseFormState?.nextStatusReviewDue,
            "NextFormalReportDue": caseFormState?.nextFormalReportDue,
            "PrimeInvestigatorID": caseFormState?.primeInvestigator?.value,
            "SupervisorID": caseFormState?.supervisor?.value,
            "AssignedProsecutorID": caseFormState?.assignedProsecutor?.value,
            "IncidentID": IncID,
            "CasePriorityID": caseFormState?.casePriority?.value,
            "CaseComment": caseFormState?.caseNotes,
            "MasterCaseLink": caseFormState?.masterCaseNumber
        });
        if (res?.status === 200) {
            toastifySuccess("Data Saved Successfully")
            refetchCaseManagementCaseIDData();
            refetchCaseManagementCaseData();
            clearErrorCaseFormState();
        }
    }

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
                                        filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
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
                                    <label className="form-label fw-bold text-nowrap">Crime Code & Description</label>
                                    <Select
                                        placeholder="Select"
                                        styles={colorLessStyle_Select}
                                        value={caseFormState.crimeCode}
                                        onChange={(selectedOption) => handleCaseFormState("crimeCode", selectedOption)}
                                    />
                                </div>
                                <div className="col-md-6 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label fw-bold text-nowrap">Crime Class</label>
                                    <Select
                                        placeholder="Select"
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
                <div className="col-12">
                    <div className="card" style={{ border: '1px solid #9ec9f5' }}>
                        <div className="card-header" style={{ backgroundColor: '#f0f7ff', borderBottom: '1px solid #9ec9f5', color: '#003366' }}>
                            <h6 className="mb-0 fw-bold">Potential Related Incidents ({caseFormState.incidentAddress})</h6>
                        </div>
                        <div className="card-body" style={{ backgroundColor: '#f0f7ff', }}>
                            <div className="mb-2 d-flex align-items-center font-weight-bold" style={{ gap: '10px' }}>
                                <span className="">{incidentList?.map(item => item?.Potentialincidents).join(', ')}</span>
                            </div>
                            <p className="text-muted mb-0">Review these incidents before assigning a Master Case #.</p>
                        </div>
                    </div>
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
                                        options={agencyOfficerDrpData}
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
                                        filterTime={(date) => filterPassedTimeZonesProperty(date, incReportedDate, datezone)}
                                        className="form-control py-1 new-input requiredColor"
                                        placeholderText="Select Date/Time"
                                    />
                                </div>
                                <div className="col-md-4 mb-2 d-flex align-items-center" style={{ gap: '10px' }}>
                                    <label className="form-label"><span className="fw-bold text-nowrap">Assigned Prosecutor</span> {errorCaseFormState.assignedProsecutor && isEmptyObject(caseFormState.assignedProsecutor) ? <span style={{ color: 'red' }}>Required</span> : ''}</label>
                                    <Select
                                        placeholder="Select"
                                        styles={coloredStyle_Select}
                                        value={caseFormState.assignedProsecutor}
                                        options={agencyOfficerDrpData}
                                        isClearable
                                        onChange={(selectedOption) => handleCaseFormState("assignedProsecutor", selectedOption)}
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

            {/* Personnel Assignment History */}
            <div className="row mb-4">
                <div className="col-12">
                    <fieldset>
                        <legend>Personnel Assignment History</legend>
                        <div className="mt-3">
                            <div className="table-responsive">
                                <DataTable
                                    dense
                                    columns={tableColumns}
                                    data={tableData}
                                    customStyles={tableCustomStyles}
                                    pagination
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
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
